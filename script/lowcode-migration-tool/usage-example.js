#!/usr/bin/env node

// 演示如何在其他脚本中使用 download-gitlab-files.js 的核心函数

const { downloadAndSaveGitlabFiles, CONFIG_FILES } = require('./download-gitlab-files');

async function exampleUsage() {
  console.log('=== downloadAndSaveGitlabFiles 使用示例 ===\n');
  
  // 示例1: 基本用法
  console.log('示例1: 基本用法（需要真实的token）');
  const basicExample = `
async function basicUsage() {
  const result = await downloadAndSaveGitlabFiles(
    'project-123',           // 项目ID
    'your-space-token',      // Space token
    'your-gitlab-token'      // GitLab token
  );
  
  if (result.success) {
    console.log('下载成功！');
    console.log('输出目录:', result.outputDir);
    console.log('下载文件数:', result.downloadResult.successCount);
    console.log('保存文件数:', result.saveResult.successCount);
  } else {
    console.error('下载失败:', result.error);
  }
}
  `;
  
  // 示例2: 自定义选项
  console.log('\n示例2: 使用自定义选项');
  const advancedExample = `
async function advancedUsage() {
  const result = await downloadAndSaveGitlabFiles(
    'my-project',            // 项目ID
    'your-space-token',      // Space token  
    'your-gitlab-token',     // GitLab token
    {
      branch: 'main',                    // 自定义分支
      outputDir: 'custom/output/dir',    // 自定义输出目录
      fileList: [                        // 自定义文件列表
        'package.json',
        'tsconfig.json',
        '.gitignore'
      ]
    }
  );
  
  console.log('处理结果:', result);
}
  `;
  
  // 示例3: 在其他脚本中使用
  console.log('\n示例3: 在其他脚本中使用');
  const integrationExample = `
// my-custom-script.js
const { downloadAndSaveGitlabFiles } = require('./download-gitlab-files');

async function myCustomWorkflow() {
  // 步骤1: 从配置文件或环境变量获取参数
  const projectId = process.env.PROJECT_ID;
  const spaceToken = process.env.SPACE_TOKEN;
  const gitlabToken = process.env.GITLAB_TOKEN;
  
  // 步骤2: 下载和保存文件
  const result = await downloadAndSaveGitlabFiles(projectId, spaceToken, gitlabToken);
  
  // 步骤3: 基于结果进行后续处理
  if (result.success) {
    // 对下载的文件进行进一步处理
    console.log(\`已下载到: \${result.outputDir}\`);
    
    // 可以访问详细的结果信息
    result.downloadResult.results.forEach(file => {
      if (file.success) {
        console.log(\`\${file.fileName}: \${file.fileSize} 字符\`);
      }
    });
  }
}
  `;
  
  // 示例4: 错误处理
  console.log('\n示例4: 完整的错误处理');
  const errorHandlingExample = `
async function robustUsage() {
  try {
    const result = await downloadAndSaveGitlabFiles(
      projectId, 
      spaceToken, 
      gitlabToken
    );
    
    if (result.success) {
      if (result.hasPartialFailure) {
        console.warn('部分文件处理失败，但至少有一个成功');
        console.log('成功文件:', result.downloadResult.successful);
        console.log('失败文件:', result.downloadResult.failed);
      } else {
        console.log('所有文件处理成功！');
      }
    } else {
      console.error('处理完全失败:', result.error);
      // 根据错误类型采取不同的处理策略
    }
    
  } catch (error) {
    console.error('发生未预期的错误:', error.message);
  }
}
  `;
  
  console.log(basicExample);
  console.log(advancedExample);
  console.log(integrationExample);
  console.log(errorHandlingExample);
  
  console.log('\n=== 函数签名 ===');
  console.log(`
downloadAndSaveGitlabFiles(projectID, spaceToken, gitlabToken, options?)

参数:
- projectID: string - 项目ID
- spaceToken: string - Space token
- gitlabToken: string - GitLab token
- options?: object - 可选配置
  - branch?: string - Git分支 (默认: 'master')
  - outputDir?: string - 输出目录 (默认: tests/fixtures/{projectID})
  - fileList?: string[] - 文件列表 (默认: CONFIG_FILES)

返回:
Promise<{
  success: boolean,
  projectID: string,
  gitlabUrl?: string,
  outputDir: string,
  downloadResult?: object,
  saveResult?: object,
  hasPartialFailure?: boolean,
  error?: string
}>
  `);
}

if (require.main === module) {
  exampleUsage().catch(console.error);
}

module.exports = { exampleUsage };