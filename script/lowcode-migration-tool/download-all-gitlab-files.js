#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { program } = require('commander');
const { downloadAndSaveGitlabFiles, promptForToken } = require('./download-gitlab-files');

/**
 * 分析 tests/fixtures 下的第一层文件夹，提取所有文件夹名字
 * @param {string} fixturesPath - fixtures 目录路径
 * @returns {Promise<string[]>} 文件夹名字列表
 */
async function analyzeFixtureFolders(fixturesPath = 'tests/fixtures') {
  try {
    console.log(chalk.blue(`正在分析目录: ${fixturesPath}`));
    
    // 检查目录是否存在
    if (!(await fs.pathExists(fixturesPath))) {
      throw new Error(`目录不存在: ${fixturesPath}`);
    }
    
    // 读取目录内容
    const items = await fs.readdir(fixturesPath, { withFileTypes: true });
    
    // 过滤出文件夹
    const folders = items
      .filter(item => item.isDirectory())
      .map(item => item.name)
      .sort((a, b) => {
        // 数字文件夹按数值排序，其他按字母排序
        const aIsNum = /^\d+$/.test(a);
        const bIsNum = /^\d+$/.test(b);
        
        if (aIsNum && bIsNum) {
          return parseInt(a) - parseInt(b);
        } else if (aIsNum && !bIsNum) {
          return -1; // 数字文件夹排在前面
        } else if (!aIsNum && bIsNum) {
          return 1;
        } else {
          return a.localeCompare(b); // 字母排序
        }
      });
    
    console.log(chalk.green(`✓ 找到 ${folders.length} 个文件夹`));
    
    return folders;
  } catch (error) {
    console.error(chalk.red('✗ 分析文件夹失败:'), error.message);
    throw error;
  }
}

/**
 * 对文件夹进行分类分析
 * @param {string[]} folders - 文件夹列表
 * @returns {Object} 分类结果
 */
function analyzeFolderTypes(folders) {
  const analysis = {
    numeric: [],      // 纯数字文件夹
    demo: [],         // demo 前缀文件夹
    other: [],        // 其他文件夹
    statistics: {
      total: folders.length,
      numericCount: 0,
      demoCount: 0,
      otherCount: 0
    }
  };
  
  folders.forEach(folder => {
    if (/^\d+$/.test(folder)) {
      analysis.numeric.push(folder);
    } else if (folder.startsWith('demo')) {
      analysis.demo.push(folder);
    } else {
      analysis.other.push(folder);
    }
  });
  
  analysis.statistics.numericCount = analysis.numeric.length;
  analysis.statistics.demoCount = analysis.demo.length;
  analysis.statistics.otherCount = analysis.other.length;
  
  return analysis;
}

/**
 * 显示分析结果
 * @param {string[]} folders - 文件夹列表
 * @param {Object} analysis - 分类分析结果
 */
function displayAnalysis(folders, analysis) {
  console.log(chalk.green('\n=== 文件夹分析结果 ==='));
  
  // 总体统计
  console.log(chalk.blue('\n📊 总体统计:'));
  console.log(chalk.white(`  总文件夹数: ${analysis.statistics.total}`));
  console.log(chalk.white(`  数字文件夹: ${analysis.statistics.numericCount} 个`));
  console.log(chalk.white(`  Demo文件夹: ${analysis.statistics.demoCount} 个`));
  console.log(chalk.white(`  其他文件夹: ${analysis.statistics.otherCount} 个`));
  
  // 数字文件夹
  if (analysis.numeric.length > 0) {
    console.log(chalk.blue('\n🔢 数字文件夹 (项目ID):'));
    console.log(chalk.gray('  ' + analysis.numeric.join(', ')));
  }
  
  // Demo文件夹
  if (analysis.demo.length > 0) {
    console.log(chalk.blue('\n🎯 Demo文件夹:'));
    console.log(chalk.gray('  ' + analysis.demo.join(', ')));
  }
  
  // 其他文件夹
  if (analysis.other.length > 0) {
    console.log(chalk.blue('\n📁 其他文件夹:'));
    console.log(chalk.gray('  ' + analysis.other.join(', ')));
  }
  
  // 完整列表
  console.log(chalk.blue('\n📋 完整文件夹列表:'));
  folders.forEach((folder, index) => {
    const type = /^\d+$/.test(folder) ? '数字' : folder.startsWith('demo') ? 'Demo' : '其他';
    console.log(chalk.gray(`  ${index + 1}. ${folder} (${type})`));
  });
}

/**
 * 批量下载所有项目的配置文件
 * @param {string[]} projectIds - 项目ID列表（数字文件夹）
 * @param {string} spaceToken - Space token
 * @param {string} gitlabToken - GitLab token
 * @param {Object} options - 下载选项
 */
async function batchDownloadAllProjects(projectIds, spaceToken, gitlabToken, options = {}) {
  const { 
    concurrent = 5,  // 并发下载数量
    dryRun = false  // 试运行（不实际下载）
  } = options;
  
  console.log(chalk.green('\n=== 批量下载所有项目配置文件 ==='));
  console.log(chalk.blue(`待处理项目: ${projectIds.length} 个`));
  console.log(chalk.blue(`并发数量: ${concurrent}`));
  
  if (dryRun) {
    console.log(chalk.yellow('🔍 试运行模式 - 不会实际下载文件'));
  }
  
  const results = {
    total: projectIds.length,
    success: 0,
    failed: 0,
    skipped: 0,
    details: []
  };
  
  // 分批处理
  for (let i = 0; i < projectIds.length; i += concurrent) {
    const batch = projectIds.slice(i, i + concurrent);
    console.log(chalk.blue(`\n处理批次 ${Math.floor(i/concurrent) + 1}/${Math.ceil(projectIds.length/concurrent)}: ${batch.join(', ')}`));
    
    const promises = batch.map(async (projectId) => {
      const outputDir = `tests/fixtures/${projectId}`;
      
      try {
        if (dryRun) {
          console.log(chalk.gray(`🔍 [试运行] 将下载项目 ${projectId}`));
          results.success++;
          results.details.push({
            projectId,
            status: 'success',
            reason: '试运行模式'
          });
          return;
        }
        
        // 实际下载
        console.log(chalk.blue(`📥 开始下载项目 ${projectId}`));
        const result = await downloadAndSaveGitlabFiles(projectId, spaceToken, gitlabToken);
        
        if (result.success) {
          console.log(chalk.green(`✓ ${projectId} 下载成功`));
          results.success++;
          results.details.push({
            projectId,
            status: 'success',
            downloadCount: result.downloadResult?.successCount || 0,
            saveCount: result.saveResult?.successCount || 0
          });
        } else {
          throw new Error(result.error || '未知错误');
        }
        
      } catch (error) {
        console.log(chalk.red(`✗ ${projectId} 下载失败: ${error.message}`));
        results.failed++;
        results.details.push({
          projectId,
          status: 'failed',
          error: error.message
        });
      }
    });
    
    await Promise.all(promises);
    
    // 显示批次进度
    console.log(chalk.gray(`批次完成 - 成功: ${results.success}, 失败: ${results.failed}, 跳过: ${results.skipped}`));
  }
  
  // 显示最终结果
  console.log(chalk.green('\n=== 批量下载结果总结 ==='));
  console.log(chalk.green(`✓ 成功: ${results.success}/${results.total}`));
  console.log(chalk.red(`✗ 失败: ${results.failed}/${results.total}`));
  console.log(chalk.yellow(`⏭ 跳过: ${results.skipped}/${results.total}`));
  
  if (results.failed > 0) {
    console.log(chalk.red('\n失败的项目:'));
    results.details
      .filter(item => item.status === 'failed')
      .forEach(item => {
        console.log(chalk.gray(`  ${item.projectId}: ${item.error}`));
      });
  }
  
  return results;
}

/**
 * 主函数
 */
async function main() {
  program
    .version('1.0.0')
    .description('分析 tests/fixtures 下的项目文件夹并批量下载配置文件')
    .option('-p, --path <path>', '指定 fixtures 目录路径', 'tests/fixtures')
    .option('-d, --download', '批量下载所有数字项目ID的配置文件')
    .option('-t, --space-token <token>', '提供 Space token')
    .option('-g, --gitlab-token <token>', '提供 GitLab token')
    .option('-i, --interactive', '交互式输入token')
    .option('-c, --concurrent <number>', '并发下载数量', '5')
    .option('--dry-run', '试运行模式（不实际下载）')
    .parse(process.argv);

  const options = program.opts();
  
  try {
    // 分析文件夹
    const folders = await analyzeFixtureFolders(options.path);
    const analysis = analyzeFolderTypes(folders);
    
    // 显示分析结果
    displayAnalysis(folders, analysis);
    
    // 如果需要下载
    if (options.download) {
      if (analysis.numeric.length === 0) {
        console.log(chalk.yellow('\n⚠ 没有找到数字项目ID文件夹，无法进行批量下载'));
        return;
      }
      
      console.log(chalk.green(`\n🚀 准备批量下载 ${analysis.numeric.length} 个项目的配置文件`));
      
      let spaceToken = options.spaceToken;
      let gitlabToken = options.gitlabToken;
      
      // 获取token
      if (!spaceToken || options.interactive) {
        spaceToken = await promptForToken('请输入 Space token(Copy User Token): ');
      }
      
      if (!gitlabToken || options.interactive) {
        gitlabToken = await promptForToken('请输入 GitLab token(Personal Access Token): ');
      }
      
      if (!spaceToken || !gitlabToken) {
        console.error(chalk.red('✗ 错误: 必须提供 Space token 和 GitLab token'));
        process.exit(1);
      }
      
      // 开始批量下载
      const downloadOptions = {
        concurrent: parseInt(options.concurrent),
        dryRun: options.dryRun
      };
      
      await batchDownloadAllProjects(analysis.numeric, spaceToken, gitlabToken, downloadOptions);
    }
    
  } catch (error) {
    console.error(chalk.red('✗ 执行失败:'), error.message);
    process.exit(1);
  }
}

// 当作为主模块运行时执行 main 函数
if (require.main === module) {
  main().catch(error => {
    console.error(chalk.red('程序执行出错:'), error);
    process.exit(1);
  });
}

// 导出函数供其他脚本使用
module.exports = {
  analyzeFixtureFolders,
  analyzeFolderTypes,
  displayAnalysis,
  batchDownloadAllProjects,
  main
};