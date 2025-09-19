#!/usr/bin/env node

// 测试 download-gitlab-files.js 的集成功能

const { downloadAndSaveGitlabFiles, CONFIG_FILES } = require('./download-gitlab-files');
const chalk = require('chalk');

async function testIntegration() {
  console.log(chalk.green('=== download-gitlab-files.js 集成测试 ===\n'));
  
  // 测试1: 验证函数导出
  console.log(chalk.blue('测试1: 验证核心函数导出'));
  try {
    if (typeof downloadAndSaveGitlabFiles === 'function') {
      console.log(chalk.green('✓ downloadAndSaveGitlabFiles 函数导出正常'));
    } else {
      throw new Error('downloadAndSaveGitlabFiles 不是函数');
    }
    
    if (Array.isArray(CONFIG_FILES) && CONFIG_FILES.length > 0) {
      console.log(chalk.green('✓ CONFIG_FILES 数组导出正常'));
      console.log(chalk.gray('  支持的文件:'), CONFIG_FILES.join(', '));
    } else {
      throw new Error('CONFIG_FILES 不是有效数组');
    }
    
  } catch (error) {
    console.log(chalk.red('✗ 函数导出测试失败:'), error.message);
    return;
  }
  
  // 测试2: 参数验证
  console.log(chalk.blue('\n测试2: 参数验证（模拟调用，不实际执行）'));
  
  const mockProjectId = 'test-project';
  const mockSpaceToken = 'mock-space-token';
  const mockGitlabToken = 'mock-gitlab-token';
  const mockOptions = {
    branch: 'main',
    outputDir: 'test-output',
    fileList: ['package.json', 'tsconfig.json']
  };
  
  console.log(chalk.gray('模拟参数:'));
  console.log(chalk.gray(`  projectID: ${mockProjectId}`));
  console.log(chalk.gray(`  spaceToken: ${mockSpaceToken}`));
  console.log(chalk.gray(`  gitlabToken: ${mockGitlabToken}`));
  console.log(chalk.gray('  options:'), JSON.stringify(mockOptions, null, 2));
  
  // 测试3: 显示集成示例
  console.log(chalk.blue('\n测试3: 集成用法示例'));
  
  const exampleCode = `
// 在其他脚本中使用示例
const { downloadAndSaveGitlabFiles } = require('./scripts/download-gitlab-files');

async function myScript() {
  // 从环境变量获取参数
  const projectId = process.env.PROJECT_ID || 'my-project';
  const spaceToken = process.env.SPACE_TOKEN;
  const gitlabToken = process.env.GITLAB_TOKEN;
  
  if (!spaceToken || !gitlabToken) {
    throw new Error('请设置 SPACE_TOKEN 和 GITLAB_TOKEN 环境变量');
  }
  
  // 调用核心函数
  const result = await downloadAndSaveGitlabFiles(
    projectId, 
    spaceToken, 
    gitlabToken,
    {
      branch: 'main',
      outputDir: 'downloads',
      fileList: ['package.json', 'tsconfig.json', '.eslintrc.json']
    }
  );
  
  // 处理结果
  if (result.success) {
    console.log(\`成功下载 \${result.downloadResult.successCount} 个文件\`);
    console.log(\`文件保存到: \${result.outputDir}\`);
  } else {
    console.error(\`下载失败: \${result.error}\`);
  }
}
  `;
  
  console.log(chalk.white(exampleCode));
  
  // 测试4: 命令行测试提示
  console.log(chalk.blue('测试4: 命令行功能测试'));
  console.log(chalk.yellow('要测试完整的命令行功能，请运行:'));
  console.log(chalk.white('  node scripts/download-gitlab-files.js test-project --help'));
  console.log(chalk.white('  node scripts/download-gitlab-files.js test-project -i  # 需要真实token'));
  console.log(chalk.white('  npm run download-configs  # 使用默认项目ID=2'));
  
  console.log(chalk.green('\n✅ 集成测试完成！'));
  console.log(chalk.gray('download-gitlab-files.js 支持两种使用方式:'));
  console.log(chalk.gray('1. 命令行调用 - node scripts/download-gitlab-files.js <projectId> [选项]'));
  console.log(chalk.gray('2. 函数调用 - require() 导入并调用 downloadAndSaveGitlabFiles()'));
}

// 运行测试
if (require.main === module) {
  testIntegration().catch(error => {
    console.error(chalk.red('测试执行出错:'), error.message);
    process.exit(1);
  });
}

module.exports = { testIntegration };