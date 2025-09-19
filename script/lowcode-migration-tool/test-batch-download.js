#!/usr/bin/env node

// 测试脚本 - 验证批量下载功能（仅用于开发测试）
// 注意：这个文件需要真实的token才能运行

const { 
  getGitlabRepoUrl, 
  downloadMultipleFilesFromGitlab,
  saveFileToLocal,
  saveMultipleFilesToLocal,
  parseGitlabUrl,
  CONFIG_FILES
} = require('./download-gitlab-files');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const TEST_OUTPUT_DIR = 'tests/fixtures/2';

async function testBatchDownload() {
  console.log(chalk.blue('=== 批量下载功能测试 ===\n'));
  
  // 检查输出目录
  const outputPath = path.resolve(TEST_OUTPUT_DIR);
  console.log(chalk.gray(`测试输出目录: ${outputPath}`));
  
  try {
    await fs.ensureDir(outputPath);
    console.log(chalk.green('✓ 输出目录准备就绪'));
    
    // 列出目录中的现有文件
    const existingFiles = await fs.readdir(outputPath);
    console.log(chalk.gray(`当前目录文件: ${existingFiles.length} 个`));
    if (existingFiles.length > 0) {
      console.log(chalk.gray('  现有文件:'), existingFiles.join(', '));
    }
    
  } catch (error) {
    console.error(chalk.red('✗ 无法准备输出目录:'), error.message);
    return;
  }
  
  // 测试URL解析功能
  console.log(chalk.blue('\n=== URL解析功能测试 ==='));
  const testUrls = [
    'https://xiami/xiami/space/front-end/space-ndre-firewall',
    'https://xiami/xiami/space/front-end/space-cloud-cmdb/-/tree/master'
  ];
  
  for (const url of testUrls) {
    try {
      const parsed = parseGitlabUrl(url);
      console.log(chalk.green(`✓ URL解析成功: ${url}`));
      console.log(chalk.gray(`  项目路径: ${parsed.projectPath}`));
      console.log(chalk.gray(`  API基地址: ${parsed.apiBase}`));
    } catch (error) {
      console.log(chalk.red(`✗ URL解析失败: ${url}`));
      console.log(chalk.gray(`  错误: ${error.message}`));
    }
  }
  
  // 测试文件保存功能
  console.log(chalk.blue('\n=== 文件保存功能测试 ==='));
  
  try {
    const testContent = JSON.stringify({
      "name": "test-config",
      "version": "1.0.0",
      "test": true,
      "timestamp": new Date().toISOString()
    }, null, 2);
    
    const testFileName = 'test-save.json';
    
    console.log(chalk.gray(`测试文件: ${testFileName}`));
    console.log(chalk.gray(`测试内容: ${testContent.length} 字符`));
    
    const saveResult = await saveFileToLocal(testFileName, testContent, outputPath);
    console.log(chalk.green('✓ 文件保存功能测试通过'));
    
    // 验证文件是否真的被创建
    const savedFilePath = path.join(outputPath, testFileName);
    const fileExists = await fs.pathExists(savedFilePath);
    
    if (fileExists) {
      console.log(chalk.green('✓ 文件确实已创建在磁盘上'));
      
      // 清理测试文件
      await fs.remove(savedFilePath);
      console.log(chalk.gray('✓ 测试文件已清理'));
    } else {
      console.log(chalk.red('✗ 文件保存验证失败'));
    }
    
  } catch (error) {
    console.error(chalk.red('✗ 文件保存功能测试失败:'), error.message);
  }
  
  // 测试批量保存功能
  console.log(chalk.blue('\n=== 批量保存功能测试 ==='));
  
  try {
    // 模拟下载结果
    const mockDownloadResult = {
      results: [
        {
          fileName: 'mock-config1.json',
          success: true,
          content: JSON.stringify({ test: 'config1', timestamp: new Date().toISOString() }, null, 2),
          fileSize: 50
        },
        {
          fileName: 'mock-config2.json', 
          success: true,
          content: JSON.stringify({ test: 'config2', timestamp: new Date().toISOString() }, null, 2),
          fileSize: 50
        },
        {
          fileName: 'failed-file.json',
          success: false,
          error: '文件不存在'
        }
      ],
      successful: ['mock-config1.json', 'mock-config2.json'],
      failed: ['failed-file.json'],
      totalCount: 3,
      successCount: 2,
      failedCount: 1
    };
    
    console.log(chalk.gray('模拟下载结果:', JSON.stringify(mockDownloadResult, null, 2)));
    
    // 测试批量保存
    const saveResult = await saveMultipleFilesToLocal(mockDownloadResult, outputPath);
    
    console.log(chalk.green('✓ 批量保存功能测试通过'));
    console.log(chalk.gray('保存结果:', JSON.stringify(saveResult, null, 2)));
    
    // 清理测试文件
    for (const fileName of saveResult.saveSuccessful) {
      const filePath = path.join(outputPath, fileName);
      if (await fs.pathExists(filePath)) {
        await fs.remove(filePath);
        console.log(chalk.gray(`✓ 清理测试文件: ${fileName}`));
      }
    }
    
  } catch (error) {
    console.error(chalk.red('✗ 批量保存功能测试失败:'), error.message);
  }
  
  console.log(chalk.blue('\n=== 功能验证完成 ==='));
  console.log(chalk.yellow('要进行完整的下载测试，请运行:'));
  console.log(chalk.white('npm run download-configs'));
  console.log(chalk.gray('或者:'));
  console.log(chalk.white('node scripts/get-gitlab-repo-id-interactive.js -i'));
  console.log(chalk.blue('\n新的分离架构:'));
  console.log(chalk.gray('1. downloadMultipleFilesFromGitlab() - 仅下载'));
  console.log(chalk.gray('2. saveMultipleFilesToLocal() - 仅保存'));
}

// 运行测试
if (require.main === module) {
  testBatchDownload().catch(error => {
    console.error(chalk.red('测试执行出错:'), error.message);
    process.exit(1);
  });
}

module.exports = { testBatchDownload, TEST_OUTPUT_DIR };