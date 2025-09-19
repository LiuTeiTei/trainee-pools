#!/usr/bin/env node

const fetch = require('node-fetch');
const { program } = require('commander');
const chalk = require('chalk');
const readline = require('readline');
const fs = require('fs-extra');
const path = require('path');

// 定义要下载的配置文件列表
const CONFIG_FILES = [
  '.eslintrc.json',
  '.stylelintrc', 
  'biome.json',
  'package.json',
  'tsconfig.json',
  'yarn.lock'
];

function promptForToken(promptText) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(chalk.cyan(`======= ${promptText}`), (token) => {
      rl.close();
      resolve(token.trim());
    });
  });
}

function parseGitlabUrl(gitlabUrl) {
  try {
    // 支持不同格式的GitLab URL
    // 例如: https://git.xiami.com/xiami/space/front-end/space-ndre-firewall
    // 例如: https://git.xiami.com/xiami/space/front-end/space-cloud-cmdb/-/tree/master
    const url = new URL(gitlabUrl);
    const pathParts = url.pathname.replace('/-/tree/master', '').split('/').filter(part => part.length > 0);
    
    if (pathParts.length < 2) {
      throw new Error('Invalid GitLab URL format');
    }
    
    // 提取域名和项目路径
    const domain = `${url.protocol}//${url.host}`;
    const projectPath = pathParts.join('/');
    
    return {
      domain,
      projectPath,
      apiBase: `${domain}/api/v4`
    };
  } catch (error) {
    throw new Error(`无法解析 GitLab URL: ${error.message}`);
  }
}

/**
 * 获取 GitLab 仓库 URL
 * @param {string} projectID - 项目 ID
 * @param {string} token - 访问 token
 * @returns {Promise<string>} GitLab 仓库 URL
 */
async function getGitlabRepoUrl(projectID, token) {
  const url = `https://lc.xiami.io/api/project/${projectID}/branches/master/gitlab-repo`

  try {
    console.log(chalk.blue('正在调用 LC API 获取 GitLab 仓库 URL...'));
    console.log(chalk.gray(`请求地址: ${url}`));
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    console.log(chalk.blue('\n--- API 响应信息 ---'));
    console.log(chalk.gray('响应状态:'), chalk.green(response.status, response.statusText));
    
    if (result && result.data && result.data.url) {
      console.log(chalk.green('\n✓ 请求成功！'));
      console.log(chalk.yellow('GitLab 仓库 URL:'), chalk.white.bold(result.data.url));
      
      return result.data.url;
    } else {
      console.log(chalk.red('\n✗ 响应数据中未找到 data.url 字段'));
      console.log(chalk.gray('完整响应结构:'));
      console.log(JSON.stringify(result, null, 2));
      return null;
    }
  } catch (error) {
    console.error(chalk.red('\n✗ 请求失败:'), error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log(chalk.yellow('提示: 请检查网络连接或API地址是否正确'));
    } else if (error.message.includes('401')) {
      console.log(chalk.yellow('提示: token 可能无效或已过期'));
    } else if (error.message.includes('403')) {
      console.log(chalk.yellow('提示: token 没有访问该资源的权限'));
    }
    
    throw error;
  }
}

/**
 * 从 GitLab 下载文件内容
 * @param {string} gitlabUrl - GitLab仓库URL
 * @param {string} gitlabToken - GitLab访问token
 * @param {string} filePath - 文件路径
 * @param {string} branch - Git分支名
 * @returns {Promise<string>} 文件内容
 */
async function downloadFileFromGitlab(gitlabUrl, gitlabToken, filePath, branch = 'master') {
  try {
    const { apiBase, projectPath } = parseGitlabUrl(gitlabUrl);
    
    // URL编码项目路径和文件路径
    const encodedProjectPath = encodeURIComponent(projectPath);
    const encodedFilePath = encodeURIComponent(filePath);
    
    // 构建GitLab API URL
    const fileApiUrl = `${apiBase}/projects/${encodedProjectPath}/repository/files/${encodedFilePath}/raw?ref=${branch}`;
    
    const response = await fetch(fileApiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${gitlabToken}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`文件 ${filePath} 未找到，请检查文件是否存在于仓库根目录`);
      } else if (response.status === 401) {
        throw new Error('GitLab token 无效或已过期');
      } else if (response.status === 403) {
        throw new Error('GitLab token 没有访问该仓库的权限');
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }

    const fileContent = await response.text();
    return fileContent;
  } catch (error) {
    throw error;
  }
}

/**
 * 将文件内容保存到本地
 * @param {string} fileName - 文件名
 * @param {string} fileContent - 文件内容
 * @param {string} outputDir - 输出目录
 * @returns {Promise<{filePath: string, fileSize: number}>} 保存结果
 */
async function saveFileToLocal(fileName, fileContent, outputDir) {
  try {
    const filePath = path.join(outputDir, fileName);
    await fs.writeFile(filePath, fileContent, 'utf8');
    
    const fileSize = fileContent.length;
    
    console.log(chalk.green(`✓ ${fileName} 保存成功`));
    console.log(chalk.gray(`  保存位置: ${filePath}`));
    console.log(chalk.gray(`  文件大小: ${fileSize} 字符`));
    
    return {
      filePath,
      fileSize
    };
  } catch (error) {
    console.error(chalk.red(`✗ ${fileName} 保存失败: ${error.message}`));
    throw new Error(`文件保存失败: ${error.message}`);
  }
}

/**
 * 批量从GitLab下载多个文件内容
 * @param {string} gitlabUrl - GitLab仓库URL
 * @param {string} gitlabToken - GitLab访问token
 * @param {string[]} fileList - 要下载的文件列表
 * @param {string} branch - Git分支名
 * @returns {Promise<Object>} 下载结果，包含文件内容
 */
async function downloadMultipleFilesFromGitlab(gitlabUrl, gitlabToken, fileList, branch = 'master') {
  const results = [];
  const successful = [];
  const failed = [];
  
  console.log(chalk.blue('\n正在批量下载配置文件...'));
  console.log(chalk.gray('目标文件:'), fileList.join(', '));
  
  const { apiBase, projectPath } = parseGitlabUrl(gitlabUrl);
  console.log(chalk.gray('GitLab 域名:'), apiBase);
  console.log(chalk.gray('项目路径:'), projectPath);
  
  // 逐个下载文件
  for (const fileName of fileList) {
    try {
      console.log(chalk.blue(`\n正在下载: ${fileName}`));
      
      // 从GitLab下载文件内容
      const fileContent = await downloadFileFromGitlab(gitlabUrl, gitlabToken, fileName, branch);
      
      console.log(chalk.green(`✓ ${fileName} 下载成功`));
      console.log(chalk.gray(`  文件大小: ${fileContent.length} 字符`));
      
      successful.push(fileName);
      results.push({
        fileName,
        success: true,
        content: fileContent,
        fileSize: fileContent.length
      });
      
    } catch (error) {
      console.log(chalk.yellow(`⚠ ${fileName} 下载失败: ${error.message}`));
      failed.push(fileName);
      results.push({
        fileName,
        success: false,
        error: error.message
      });
    }
  }
  
  // 总结下载结果
  console.log(chalk.blue('\n--- 批量下载结果总结 ---'));
  console.log(chalk.green(`✓ 成功下载: ${successful.length} 个文件`));
  if (successful.length > 0) {
    console.log(chalk.gray('  成功文件:'), successful.join(', '));
  }
  
  console.log(chalk.red(`✗ 下载失败: ${failed.length} 个文件`));
  if (failed.length > 0) {
    console.log(chalk.gray('  失败文件:'), failed.join(', '));
  }
  
  return {
    results,
    successful,
    failed,
    totalCount: fileList.length,
    successCount: successful.length,
    failedCount: failed.length
  };
}

/**
 * 批量保存下载的文件到本地
 * @param {Object} downloadResults - downloadMultipleFilesFromGitlab的返回结果
 * @param {string} outputDir - 输出目录
 * @returns {Promise<Object>} 保存结果统计
 */
async function saveMultipleFilesToLocal(downloadResults, outputDir) {
  const saveResults = [];
  const saveSuccessful = [];
  const saveFailed = [];
  
  console.log(chalk.blue('\n正在批量保存文件到本地...'));
  console.log(chalk.gray('保存目录:'), outputDir);
  
  // 确保输出目录存在
  await fs.ensureDir(outputDir);
  console.log(chalk.green(`✓ 确保目录存在: ${outputDir}`));
  
  // 只处理成功下载的文件
  const successfulDownloads = downloadResults.results.filter(result => result.success);
  
  console.log(chalk.gray(`准备保存 ${successfulDownloads.length} 个文件`));
  
  for (const downloadResult of successfulDownloads) {
    try {
      console.log(chalk.blue(`\n正在保存: ${downloadResult.fileName}`));
      
      // 保存文件到本地
      const saveResult = await saveFileToLocal(
        downloadResult.fileName, 
        downloadResult.content, 
        outputDir
      );
      
      saveSuccessful.push(downloadResult.fileName);
      saveResults.push({
        fileName: downloadResult.fileName,
        success: true,
        filePath: saveResult.filePath,
        fileSize: saveResult.fileSize
      });
      
    } catch (error) {
      console.log(chalk.yellow(`⚠ ${downloadResult.fileName} 保存失败: ${error.message}`));
      saveFailed.push(downloadResult.fileName);
      saveResults.push({
        fileName: downloadResult.fileName,
        success: false,
        error: error.message
      });
    }
  }
  
  // 总结保存结果
  console.log(chalk.blue('\n--- 批量保存结果总结 ---'));
  console.log(chalk.green(`✓ 成功保存: ${saveSuccessful.length} 个文件`));
  if (saveSuccessful.length > 0) {
    console.log(chalk.gray('  成功文件:'), saveSuccessful.join(', '));
  }
  
  console.log(chalk.red(`✗ 保存失败: ${saveFailed.length} 个文件`));
  if (saveFailed.length > 0) {
    console.log(chalk.gray('  失败文件:'), saveFailed.join(', '));
  }
  
  return {
    saveResults,
    saveSuccessful,
    saveFailed,
    totalCount: successfulDownloads.length,
    successCount: saveSuccessful.length,
    failedCount: saveFailed.length,
    outputDir
  };
}

/**
 * 核心函数：下载和保存GitLab配置文件
 * @param {string} projectID - 项目ID
 * @param {string} spaceToken - Space token
 * @param {string} gitlabToken - GitLab token
 * @param {Object} options - 可选配置
 * @param {string} options.branch - Git分支名 (默认: 'master')
 * @param {string} options.outputDir - 输出目录 (默认: tests/fixtures/{projectID})
 * @param {string[]} options.fileList - 要下载的文件列表 (默认: CONFIG_FILES)
 * @returns {Promise<Object>} 包含下载和保存结果的对象
 */
async function downloadAndSaveGitlabFiles(projectID, spaceToken, gitlabToken, options = {}) {
  const {
    branch = 'master',
    outputDir = `tests/fixtures/${projectID}`,
    fileList = CONFIG_FILES
  } = options;

  try {
    console.log(chalk.green('=== GitLab配置文件下载和保存 ===\n'));
    console.log(chalk.blue('项目ID:'), chalk.white.bold(projectID));
    console.log(chalk.blue('分支:'), chalk.white(branch));
    console.log(chalk.blue('输出目录:'), chalk.white(outputDir));
    console.log(chalk.blue('文件列表:'));
    fileList.forEach(file => console.log(chalk.gray(`  • ${file}`)));
    console.log('');

    // 步骤1：获取 GitLab 仓库 URL
    console.log(chalk.green('步骤1: 获取 GitLab 仓库 URL'));
    const gitlabUrl = await getGitlabRepoUrl(projectID, spaceToken);
    
    if (!gitlabUrl) {
      throw new Error('未能获取到 GitLab 仓库 URL');
    }
    
    // 步骤2：批量下载配置文件（不保存到本地）
    console.log(chalk.green('\n步骤2: 批量下载配置文件'));
    const downloadResult = await downloadMultipleFilesFromGitlab(
      gitlabUrl, 
      gitlabToken, 
      fileList, 
      branch
    );
    
    // 判断下载结果
    if (downloadResult.successCount === 0) {
      throw new Error('所有文件下载失败！请检查 GitLab token 和仓库文件');
    }
    
    // 步骤3：保存下载的文件到本地
    console.log(chalk.green('\n步骤3: 保存文件到本地'));
    const saveResult = await saveMultipleFilesToLocal(downloadResult, outputDir);
    
    // 判断最终结果
    if (saveResult.successCount === 0) {
      throw new Error('所有文件保存失败！');
    }
    
    // 成功完成
    const hasPartialFailure = downloadResult.failedCount > 0 || saveResult.failedCount > 0;
    
    if (hasPartialFailure) {
      console.log(chalk.yellow('\n⚠ 部分文件处理失败，但至少有一个文件成功'));
    } else {
      console.log(chalk.green('\n🎉 所有配置文件下载并保存成功！'));
    }
    
    console.log(chalk.green(`✓ 下载成功: ${downloadResult.successCount}/${downloadResult.totalCount} 个文件`));
    console.log(chalk.green(`✓ 保存成功: ${saveResult.successCount}/${saveResult.totalCount} 个文件`));
    console.log(chalk.green(`✓ 文件已保存到: ${outputDir}`));
    
    return {
      success: true,
      projectID,
      gitlabUrl,
      outputDir,
      downloadResult,
      saveResult,
      hasPartialFailure
    };
    
  } catch (error) {
    console.error(chalk.red('\n✗ 执行过程中出现错误:'), error.message);
    return {
      success: false,
      projectID,
      outputDir,
      error: error.message
    };
  }
}

/**
 * 命令行主函数
 */
async function main() {
  program
    .version('1.0.0')
    .description('调用 lc.xiami.io API 获取GitLab仓库URL并批量下载配置文件\n\n使用方法: node scripts/download-gitlab-files.js <projectId> [选项]')
    .option('-t, --space-token <spaceToken>', '提供 Space token(Copy User Token)')
    .option('-g, --gitlab-token <gitlabToken>', '提供 GitLab token(Personal Access Token)')
    .option('-i, --interactive', '交互式输入所有 token(推荐，更安全)')
    .option('-b, --branch <branch>', '指定 Git 分支', 'master')
    .option('-o, --output <outputDir>', '指定输出目录')
    .parse(process.argv);

  const options = program.opts();
  
  // 手动解析项目ID参数 (commander 6.x兼容方式)
  // 查找第一个不以 - 开头的参数作为项目ID
  let projectIdArg = null;
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (!args[i].startsWith('-')) {
      projectIdArg = args[i];
      break;
    }
    // 如果当前参数是一个选项，且下一个参数不是以-开头，跳过下一个参数（选项值）
    if (args[i].startsWith('-') && !args[i].includes('=') && args[i+1] && !args[i+1].startsWith('-')) {
      i++; // 跳过选项值
    }
  }
  
  // 检查必需的项目ID参数
  if (!projectIdArg) {
    console.error(chalk.red('✗ 错误: 缺少必需的项目ID参数'));
    console.log(chalk.yellow('\n使用方法:'));
    console.log(chalk.white('  node scripts/download-gitlab-files.js <projectId> [选项]'));
    console.log(chalk.yellow('\n示例:'));
    console.log(chalk.white('  node scripts/download-gitlab-files.js 2 -i'));
    console.log(chalk.white('  node scripts/download-gitlab-files.js 123 -t <space-token> -g <gitlab-token>'));
    console.log(chalk.white('  node scripts/download-gitlab-files.js project-name -i'));
    console.log(chalk.yellow('\n获取帮助:'));
    console.log(chalk.white('  node scripts/download-gitlab-files.js --help'));
    process.exit(1);
  }

  const projectID = projectIdArg;
  
  // 验证项目ID是否为有效字符串（不为空）
  if (!projectID || projectID.trim() === '') {
    console.error(chalk.red('✗ 错误: 项目ID不能为空'));
    console.log(chalk.yellow('提供的值:'), chalk.white(projectIdArg));
    console.log(chalk.yellow('期望格式:'), chalk.white('非空字符串 (如: 2, 123, abc, project-name)'));
    process.exit(1);
  }
  
  let spaceToken = options.spaceToken;
  let gitlabToken = options.gitlabToken;
  
  console.log(chalk.green('=== GitLab仓库配置文件批量下载工具 ===\n'));
  console.log(chalk.blue('项目ID:'), chalk.white.bold(projectID));
  console.log(chalk.blue('将要下载的文件:'));
  CONFIG_FILES.forEach(file => console.log(chalk.gray(`  • ${file}`)));
  
  const outputDir = options.output || `tests/fixtures/${projectID}`;
  console.log(chalk.blue(`保存目录: ${outputDir}\n`));
  
  // 第一步：获取 Space token
  if (!spaceToken || options.interactive) {
    spaceToken = await promptForToken('请输入 Space token(Copy User Token): ');
  }

  // 第二步：获取 Gitlab token
  if (!gitlabToken || options.interactive) {
    gitlabToken = await promptForToken('请输入 GitLab token(Personal Access Token): ');
  }
  
  if (!spaceToken || !gitlabToken) {
    console.error(chalk.red('✗ 错误: Space token 和 GitLab token 不能为空'));
    console.log(chalk.yellow('使用方法:'));
    console.log(chalk.white('  交互式模式: node scripts/download-gitlab-files.js <projectId> -i'));
    console.log(chalk.white('  指定token:  node scripts/download-gitlab-files.js <projectId> -t <space-token> -g <gitlab-token>'));
    process.exit(1);
  }

  try {
    // 调用核心下载和保存函数
    const result = await downloadAndSaveGitlabFiles(projectID, spaceToken, gitlabToken, {
      branch: options.branch,
      outputDir: outputDir,
      fileList: CONFIG_FILES
    });
    
    if (!result.success) {
      process.exit(1);
    }
    
  } catch (error) {
    console.error(chalk.red('\n✗ 执行过程中出现错误:'), error.message);
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

// 导出所有函数
module.exports = { 
  getGitlabRepoUrl, 
  downloadFileFromGitlab,
  downloadMultipleFilesFromGitlab,
  saveFileToLocal,
  saveMultipleFilesToLocal,
  downloadAndSaveGitlabFiles,
  parseGitlabUrl, 
  promptForToken,
  CONFIG_FILES,
  main  // 导出 main 函数供测试使用
};