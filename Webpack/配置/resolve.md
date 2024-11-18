# 路径别名

假设你的文件结构是这样的：

```bash
your-app-root/
├── src
│   ├── page
│   │   └── preview
│   │       └── index.tsx
│   └── constants 
│       └── env.ts
├── tsconfig.json
└── webpack.config.js
```

默认情况下你在 `preview/index.tsx` 中引用 `env.ts` 的文件是这样的：

```js
import { LC_FETCH_URL } from '../../constants/env'
```

相对路径看上去很冗余，且无法直接看出引用关系，于是你想这样引用：

```js
import { LC_FETCH_URL } from 'src/constants/env'
```

怎么配置路径别名呢？



## tsconfig.json

配置 [baseUrl](https://www.typescriptlang.org/zh/tsconfig/#baseUrl) 和 [paths](https://www.typescriptlang.org/zh/tsconfig/#paths) 参数：

```js
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "src/*": [
        "src/*"
      ]
    },
  },
}
```

+ `baseUrl`：设置解析非绝对路径模块名时的基准目录；
+ `paths`：将模块导入重新映射到相对于 `baseUrl` 路径的配置。



## webpack.config.js

配置 [resolve](https://webpack.docschina.org/configuration/resolve/#resolve) 参数：

```js
// webpack.config.js
module.exports = {
  //...
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json', '.css', '.scss', '.less', '.svg'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
};
```

+ `resolve.extensions`：尝试按顺序解析这些后缀名。如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件 并跳过其余的后缀；
+ `resolve.modules`：告诉 webpack 解析模块时应该搜索的目录；
+ `resolve.alias`：创建 `import` 或 `require` 的别名，来确保模块引入变得更简单。



