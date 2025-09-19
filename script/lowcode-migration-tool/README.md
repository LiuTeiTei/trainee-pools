# 脚本使用说明

## GitLab 仓库配置文件批量下载工具

这个脚本提供了两种使用方式：

1. **直接命令行调用** - 适用于手动执行
2. **函数调用** - 适用于其他脚本集成

### 核心功能

- 调用 `https://lc.xiami.io/api/project/<projectId>/branches/master/gitlab-repo` 获取 GitLab 仓库 URL
- 批量从 GitLab 仓库下载多个配置文件并保存到本地目录
- 支持交互式 token 输入和命令行参数传入
- 优雅处理文件下载失败，不会因单个文件失败而中断整个流程

### 支持的配置文件

- `.eslintrc.json` - ESLint 配置文件
- `.stylelintrc` - StyleLint 配置文件
- `biome.json` - Biome 配置文件
- `package.json` - NPM 包配置文件
- `tsconfig.json` - TypeScript 配置文件
- `yarn.lock` - Yarn 锁定文件

## 方式一：直接命令行调用

### 基本用法

```bash
# 使用 npm script（默认项目ID为2）
npm run download-configs

# 或直接运行脚本，指定项目ID
node scripts/download-gitlab-files.js <projectId> [选项]

# 示例
node scripts/download-gitlab-files.js 2 -i
node scripts/download-gitlab-files.js 123 -i
node scripts/download-gitlab-files.js project-name -i
```

### 命令行选项

- `-i, --interactive` - 交互式输入所有 token（推荐，更安全）
- `-t, --space-token <token>` - 直接提供 Space token
- `-g, --gitlab-token <token>` - 直接提供 GitLab token
- `-b, --branch <branch>` - 指定 Git 分支（默认：master）
- `-o, --output <dir>` - 指定输出目录（默认：tests/fixtures/{projectId}）
- `-h, --help` - 显示帮助信息

### 使用示例

#### 交互式模式（推荐）

```bash
node scripts/download-gitlab-files.js project-123 -i
```

这种方式会分步提示你输入所需的 token，不会在命令行历史中留下敏感信息。

#### 命令行参数模式

```bash
# 指定所有参数
node scripts/download-gitlab-files.js project-123 -t "space-token" -g "gitlab-token"

# 指定分支和输出目录
node scripts/download-gitlab-files.js project-123 -t "space-token" -g "gitlab-token" -b "main" -o "custom/output"
```

### 完整执行流程示例

```
$ node scripts/download-gitlab-files.js project-123 -i

=== GitLab仓库配置文件批量下载工具 ===

项目ID: project-123
将要下载的文件:
  • .eslintrc.json
  • .stylelintrc
  • biome.json
  • package.json
  • tsconfig.json
  • yarn.lock
保存目录: tests/fixtures/project-123

======= 请输入 Space token(Copy User Token): [用户输入]
======= 请输入 GitLab token(Personal Access Token): [用户输入]

步骤1: 获取 GitLab 仓库 URL

正在调用 LC API 获取 GitLab 仓库 URL...
请求地址: https://lc.xiami.io/api/project/project-123/branches/master/gitlab-repo

--- API 响应信息 ---
响应状态: 200 OK

✓ 请求成功！
GitLab 仓库 URL: https://git.xiami.com/xiami/space/front-end/space-ndre-firewall

步骤2: 批量下载配置文件
...

步骤3: 保存文件到本地
...

🎉 所有配置文件下载并保存成功！
✓ 下载成功: 6/6 个文件
✓ 保存成功: 6/6 个文件
✓ 文件已保存到: tests/fixtures/project-123
```

## 方式二：函数调用（供其他脚本使用）

### 核心函数

```javascript
const {
  downloadAndSaveGitlabFiles,
} = require("./scripts/download-gitlab-files");

// 基本用法
const result = await downloadAndSaveGitlabFiles(
  projectID,
  spaceToken,
  gitlabToken
);

// 带选项的用法
const result = await downloadAndSaveGitlabFiles(
  projectID,
  spaceToken,
  gitlabToken,
  {
    branch: "main",
    outputDir: "custom/output",
    fileList: ["package.json", "tsconfig.json"],
  }
);
```

### 参数说明

- `projectID` (string) - 项目 ID
- `spaceToken` (string) - Space token
- `gitlabToken` (string) - GitLab token
- `options` (object, 可选) - 配置选项
  - `branch` (string) - Git 分支名，默认 'master'
  - `outputDir` (string) - 输出目录，默认 `tests/fixtures/{projectID}`
  - `fileList` (string[]) - 要下载的文件列表，默认为所有配置文件

### 返回值

```javascript
{
  success: boolean,           // 是否成功
  projectID: string,          // 项目ID
  gitlabUrl?: string,        // GitLab仓库URL（成功时）
  outputDir: string,         // 输出目录
  downloadResult?: {         // 下载结果（成功时）
    results: Array,
    successful: string[],
    failed: string[],
    totalCount: number,
    successCount: number,
    failedCount: number
  },
  saveResult?: {             // 保存结果（成功时）
    saveResults: Array,
    saveSuccessful: string[],
    saveFailed: string[],
    totalCount: number,
    successCount: number,
    failedCount: number,
    outputDir: string
  },
  hasPartialFailure?: boolean, // 是否有部分失败
  error?: string              // 错误信息（失败时）
}
```

### 使用示例

#### 基本用法

```javascript
const {
  downloadAndSaveGitlabFiles,
} = require("./scripts/download-gitlab-files");

async function example() {
  const result = await downloadAndSaveGitlabFiles(
    "project-123",
    "your-space-token",
    "your-gitlab-token"
  );

  if (result.success) {
    console.log("下载成功！");
    console.log("输出目录:", result.outputDir);
    console.log("成功文件数:", result.downloadResult.successCount);
  } else {
    console.error("下载失败:", result.error);
  }
}
```

#### 自定义选项

```javascript
async function customExample() {
  const result = await downloadAndSaveGitlabFiles(
    "my-project",
    process.env.SPACE_TOKEN,
    process.env.GITLAB_TOKEN,
    {
      branch: "main",
      outputDir: "custom/output/dir",
      fileList: ["package.json", "tsconfig.json", ".gitignore"],
    }
  );

  // 处理结果...
}
```

#### 错误处理

```javascript
async function robustExample() {
  try {
    const result = await downloadAndSaveGitlabFiles(
      projectId,
      spaceToken,
      gitlabToken
    );

    if (result.success) {
      if (result.hasPartialFailure) {
        console.warn("部分文件处理失败，但至少有一个成功");
        console.log("成功:", result.downloadResult.successful);
        console.log("失败:", result.downloadResult.failed);
      } else {
        console.log("所有文件处理成功！");
      }
    } else {
      console.error("处理完全失败:", result.error);
    }
  } catch (error) {
    console.error("发生未预期的错误:", error.message);
  }
}
```

## 其他可用函数

除了核心函数外，还提供了以下工具函数：

```javascript
const {
  getGitlabRepoUrl, // 获取GitLab仓库URL
  downloadFileFromGitlab, // 下载单个文件
  downloadMultipleFilesFromGitlab, // 批量下载（不保存）
  saveFileToLocal, // 保存单个文件
  saveMultipleFilesToLocal, // 批量保存文件
  parseGitlabUrl, // 解析GitLab URL
  promptForToken, // 交互式输入token
  CONFIG_FILES, // 默认配置文件列表
} = require("./scripts/download-gitlab-files");
```

## 文件结构

```
scripts/
├── download-gitlab-files.js   # 主脚本（包含所有功能）
├── usage-example.js           # 使用示例
├── test-batch-download.js     # 功能测试脚本
└── README.md                  # 本文档
```

## Token 获取方式

1. **Space Token**:

   - 登录 Space 平台
   - 个人设置 -> Copy User Token

2. **GitLab Token**:
   - 登录 GitLab
   - User Settings -> Access Tokens -> Personal Access Tokens
   - 权限需要包含 `read_repository`

## 注意事项

- 项目 ID 现在支持字符串格式（如：2, 123, project-name 等）
- 使用交互式模式 `-i` 更安全，不会在命令行历史中留下 token 信息
- 如果某个文件下载失败，程序会继续处理其他文件，不会中断
- 只有当所有文件都下载失败时，程序才会退出并报错
- 文件会保存到 `tests/fixtures/{projectID}` 目录中，目录会自动创建
