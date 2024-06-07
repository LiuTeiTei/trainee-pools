[demo](https://www.typescriptlang.org/play/#code/PTAEEsFsAcHsCcAuoA2sAmBDAzgC1AGbyySgDkaWeZAUFHEqJCQKYB2yRJ5zk7itXvwAUASgB0BBJEyIxNGiFQYcuceGwBRGIgCe8uhxbwCmAMYtQASU3xi8AMK4WZgNYBlRLICu2B5hQUACNzV1AAbxpQUGFsL0RfAC5QINhYFBZMNgAaUHgWbG8URAB+ZPDQAHdMeDZwNgBzADlvSCDjZLZW9vgAblBjexa2jtAukfhQAF9RZIA3WHB0GimFDOREAsRkmzsEJxcPeN9-QJC3UABeGNErgD4I1YUWAA8GDd1oS137A7djAAi4EwDTYsGwGiuoAACjVMHxNvBsAAeH77ZxuTw+PwBYKhO4AbQAjABdGhAA)

TypeScript Playground 使用 [ATA](https://github.com/microsoft/TypeScript-Website/tree/v2/packages/ata) 从 https://www.jsdelivr.com/ 上下载依赖的类型文件。

TypeScript Playground 对 import 的依赖加载流程大致如下：

1. sandbox 将代码传入 ATA 中下载依赖（源码：[createTypeScriptSandbox](https://github.com/microsoft/TypeScript-Website/blob/4e0d4e5848df8b36a7271bc5a43bb7b028f591ce/packages/sandbox/src/index.ts#L235)）；
2. ATA 分析出需要加载的依赖，获取该依赖下所有文件及其路径，提取出 .d.ts 文件路径和 package.json 文件，没有的话获取对应 @types 依赖下的 .d.ts 文件路径，下载这些文件（源码：[resolveDeps](https://github.com/microsoft/TypeScript-Website/blob/4e0d4e5848df8b36a7271bc5a43bb7b028f591ce/packages/ata/src/index.ts#L63)）；
3. sandbox 通过 addExtraLib 将这些类型文件添加到 monaco 中（源码：[addLibraryToRuntime](https://github.com/microsoft/TypeScript-Website/blob/4e0d4e5848df8b36a7271bc5a43bb7b028f591ce/packages/sandbox/src/index.ts#L185)）。

**综上所述：TypeScript Playground 在加载依赖的类型文件时，会下载所有的 .d.ts 文件添加到 monaco 中，没有做缓存。**