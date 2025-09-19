#!/usr/bin/env node

// 示例：以编程方式使用GitLab下载工具的各个函数

const { 
  getGitlabRepoUrl, 
  downloadFileFromGitlab,
  downloadMultipleFilesFromGitlab,
  saveFileToLocal,
  saveMultipleFilesToLocal,
  parseGitlabUrl,
  CONFIG_FILES
} = require('./download-gitlab-files');

async function exampleUsage() {
  try {
    // 示例1: 解析GitLab URL
    console.log('=== 示例1: 解析GitLab URL ===');
    const testUrls = [
      'https://gitlab.xiami.io/space/space-low-code',
      'https://gitlab.com/user/project',
      'https://git.example.com/team/repo'
    ];
    
    for (const url of testUrls) {
      try {
        const parsed = parseGitlabUrl(url);
        console.log(`URL: ${url}`);
        console.log(`  域名: ${parsed.domain}`);
        console.log(`  项目路径: ${parsed.projectPath}`);
        console.log(`  API基地址: ${parsed.apiBase}\n`);
      } catch (error) {
        console.log(`URL解析失败: ${url} - ${error.message}\n`);
      }
    }
    
    // 示例2: 单文件下载流程（需要真实的token）
    console.log('=== 示例2: 单文件下载流程 ===');
    console.log('注意：这个示例需要真实的token才能运行\n');
    
    const singleFileExample = `
// 单文件下载示例：
async function downloadSingleFileExample() {
  const SPACE_TOKEN = 'your-space-token';
  const GITLAB_TOKEN = 'your-gitlab-token';
  const PROJECT_ID = 'your-project-id'; // 现在支持字符串
  
  try {
    // 步骤1: 获取GitLab仓库URL
    const repoUrl = await getGitlabRepoUrl(PROJECT_ID, SPACE_TOKEN);
    
    if (repoUrl) {
      // 步骤2: 下载单个文件
      const content = await downloadFileFromGitlab(
        repoUrl, 
        GITLAB_TOKEN, 
        'package.json',
        'master'
      );
      
      console.log('文件下载完成！内容：', content);
      return content;
    }
  } catch (error) {
    console.error('下载失败：', error.message);
  }
}
    `;
    
    // 示例3: 批量下载流程（需要真实的token）
    console.log('=== 示例3: 批量下载配置文件 ===');
    console.log('注意：这个示例需要真实的token才能运行\n');
    
    const batchDownloadExample = `
// 批量下载配置文件示例（仅下载，不保存）：
async function downloadOnlyExample() {
  const SPACE_TOKEN = 'your-space-token';
  const GITLAB_TOKEN = 'your-gitlab-token';
  const PROJECT_ID = 'your-project-id'; // 现在支持字符串
  
  try {
    // 步骤1: 获取GitLab仓库URL
    const repoUrl = await getGitlabRepoUrl(PROJECT_ID, SPACE_TOKEN);
    
    if (repoUrl) {
      // 步骤2: 批量下载配置文件（不保存到本地）
      const downloadResult = await downloadMultipleFilesFromGitlab(
        repoUrl, 
        GITLAB_TOKEN, 
        CONFIG_FILES,
        'master'
      );
      
      console.log(\`下载完成！成功: \${downloadResult.successCount}, 失败: \${downloadResult.failedCount}\`);
      console.log('成功的文件:', downloadResult.successful);
      console.log('失败的文件:', downloadResult.failed);
      
      // 可以访问下载的文件内容
      downloadResult.results.forEach(result => {
        if (result.success) {
          console.log(\`\${result.fileName}: \${result.content.length} 字符\`);
        }
      });
      
      return downloadResult;
    }
  } catch (error) {
    console.error('下载失败：', error.message);
  }
}

// 完整流程示例（下载后保存）：
async function downloadAndSaveExample() {
  const SPACE_TOKEN = 'your-space-token';
  const GITLAB_TOKEN = 'your-gitlab-token';
  const PROJECT_ID = 'your-project-id'; // 现在支持字符串
  
  try {
    // 步骤1: 获取GitLab仓库URL
    const repoUrl = await getGitlabRepoUrl(PROJECT_ID, SPACE_TOKEN);
    
    if (repoUrl) {
      // 步骤2: 批量下载配置文件
      const downloadResult = await downloadMultipleFilesFromGitlab(
        repoUrl, 
        GITLAB_TOKEN, 
        CONFIG_FILES,
        'master'
      );
      
      // 步骤3: 保存下载的文件到本地
      const saveResult = await saveMultipleFilesToLocal(
        downloadResult,
        'tests/fixtures/2'
      );
      
      console.log(\`处理完成！\`);
      console.log(\`下载: \${downloadResult.successCount}/\${downloadResult.totalCount}\`);
      console.log(\`保存: \${saveResult.successCount}/\${saveResult.totalCount}\`);
      
      return { downloadResult, saveResult };
    }
  } catch (error) {
    console.error('处理失败：', error.message);
  }
}
    `;
    
    // 示例4: 独立的文件保存功能
    console.log('=== 示例4: 独立的文件保存功能 ===');
    console.log('展示如何使用重构后的saveFileToLocal函数\n');
    
    const saveFileExample = `
// 独立保存文件示例：
async function saveFileExample() {
  const fileContent = '{"name": "example", "version": "1.0.0"}';
  const fileName = 'example.json';
  const outputDir = 'my-output-dir';
  
  try {
    // 直接保存文件到本地
    const saveResult = await saveFileToLocal(fileName, fileContent, outputDir);
    
    console.log('文件保存成功：', saveResult.filePath);
    console.log('文件大小：', saveResult.fileSize, '字符');
    
    return saveResult;
  } catch (error) {
    console.error('文件保存失败：', error.message);
  }
}

// 分步处理示例：先下载后保存
async function stepByStepExample() {
  const SPACE_TOKEN = 'your-space-token';
  const GITLAB_TOKEN = 'your-gitlab-token';
  const PROJECT_ID = 'your-project-id'; // 现在支持字符串
  
  try {
    // 步骤1: 获取仓库URL
    const repoUrl = await getGitlabRepoUrl(PROJECT_ID, SPACE_TOKEN);
    
    // 步骤2: 下载单个文件内容
    const fileContent = await downloadFileFromGitlab(
      repoUrl, 
      GITLAB_TOKEN, 
      'package.json'
    );
    
    // 步骤3: 保存文件到本地
    const saveResult = await saveFileToLocal(
      'package.json', 
      fileContent, 
      'custom-output-dir'
    );
    
    console.log('分步处理完成！', saveResult);
    return saveResult;
  } catch (error) {
    console.error('分步处理失败：', error.message);
  }
}
    `;
    
    console.log(singleFileExample);
    console.log(batchDownloadExample);
    console.log(saveFileExample);
    
  } catch (error) {
    console.error('示例执行出错：', error.message);
  }
}

// 如果直接运行此文件，则执行示例
if (require.main === module) {
  exampleUsage();
}

module.exports = { exampleUsage };