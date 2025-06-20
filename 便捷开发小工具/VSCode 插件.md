## 插件

https://previewjs.com/ 代码可视化插件



[open in browser](https://marketplace.visualstudio.com/items?itemName=techer.open-in-browser)：在浏览器中直接打开文件



## 快捷键

JSON 文件格式化

+ 右键单击：选择格式化文档
+ 快捷键：option + shift + F
+ 命令面板：option + shift + P 后，搜索 Format Document 后执行



## 格式化

vscode 自动保存的时候 import 自动排序

```
在 VSCode 中，你可以使用扩展来自动排序 import 语句，比如 Prettier 或 ESLint。以下是一些步骤：

安装 Prettier 或 ESLint 扩展：

在 VSCode 的扩展市场中搜索并安装 Prettier 或 ESLint。
配置 Prettier：

创建或编辑 .prettierrc 文件。
使用插件如 prettier-plugin-organize-imports 来自动排序 import 语句。
配置 ESLint：

创建或编辑 .eslintrc 文件。
使用 eslint-plugin-import 插件，并配置 import/order 规则来排序 import 语句。
启用自动保存时格式化：

在 VSCode 设置中，启用 editor.formatOnSave 选项。
通过这些设置，VSCode 在自动保存时会自动排序 import 语句。
```

