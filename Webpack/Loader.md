# 简单介绍

## 一个最简单的 loader

+ loader 本质上是一个导出为函数的 JavaScript 模块：

  ```js
  module.exports = fucntion (content) {
    return content;
  };
  ```

+ [loader runner](https://github.com/webpack/loader-runner) 会调用此函数，然后将上一个 loader 产生的结果或者资源文件传入进去;
+ 函数中的 `this` 作为上下文会被 webpack 填充，并且附加上 loader runner 中包含的一些实用方法，比如可以使 loader 调用方式变为异步，或者获取 query 参数。



## 执行顺序

多个 loader 从后往前串行执行：

```js
// webpack.config.js

module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'styles-loader',
          'css-loader',
          'less-loader'
        ]
      }
    ]
  }
}
```



# 如何开发

## 开发方式

+ 构建一个 webpack 项目 ==》比较繁琐；
+ 使用 [loader-runner](https://github.com/webpack/loader-runner) 协助开发 ==》可以在不安装 webpack 的项目中运行 loader：

  ```js
  const fs = require('fs')
  const path = require('path')
  const { runLoaders } = require('loader-runner')
  
  runLoaders({
    resource: path.join(__dirname, './src/demo.txt'),
    loaders: [
      path.join(__dirname, './src/row-loader.js'),
      // or
      {
        loader: path.join(__dirname, './src/row-loader.js'),
        options: {
          name: 'ltt',
        },
      },
    ],
    context: {
      minimize: true
    },
    readResource: fs.readFile.bind(fs)
  }, (error, result) => {
    error ? console.error(error) : console.log(result)
  })
  ```

  

## 获取参数

+ 通过 [loader-utils](https://github.com/webpack/loader-utils/tree/master) 提供的 getOptions 方法获取：

  ```js
  const loaderUtils = require('loader-utils')
  
  module.exports = function(content) {
    const { name } = loaderUtils.getOptions(this)
    ... ...
  }
  ```

  + getOptions 方法在 [3.0.0 版本中被废除](https://github.com/webpack/loader-utils/blob/master/CHANGELOG.md)

+ 通过 [`this.query`](https://www.webpackjs.com/api/loaders/#thisquery) 直接获取：

  ```js
  module.exports = function(content) {
    const { name } = this.query
    ... ...
  }
  ```



## 异常处理

### 同步 loader 

+ loader 内 throw new Error()；

+ 通过 [`this.callback`](https://www.webpackjs.com/api/loaders#thiscallback) 传递错误：

  ```js
  module.exports = function(content) {
    ... ...
    this.callback(
      err: Error | null,
      content: string | Buffer,
      sourceMap?: SourceMap,
      meta?: any
    );
  }
  ```

### 异步 loader

+ 通过 [`this.async`](https://www.webpackjs.com/api/loaders/#thisasync) 来告知 loader runner 等待异步结果，它会返回 `this.callback()` 回调函数：

  ```js
  const fs = require('fs')
  const path = require('path')
  
  module.exports = function(content) {
    fs.readFile(path.join(__dirname, './async.txt'), 'utf-8', (err, data) => {
      if (err) {
        this.async(err, null)
      }
      this.async(null, data)
    })
  }
  ```
  



## 缓存

+ loader 的结果具有幂等时可以进行缓存，但 loader 有依赖时无法缓存；
+ loader 默认开启缓存，可以通过 [this.cacheable(false)](https://webpack.js.org/api/loaders/#thiscacheable) 关闭缓存。



## 文件输出

+ 通过 [loader-utils](https://github.com/webpack/loader-utils/tree/master) 提供的 interpolateName 方法获取输出文件路径；

+ 通过 [this.emitFile](https://webpack.js.org/api/loaders/#thisemitfile) 输出文件；

+ ```js
  const loaderUtils = require('loader-utils')
  
  module.exports = function(content) {
    const fileName = loaderUtils.interpolateName(this, "[hash].[ext]", { content });  
    this.emitFile(fileName, content)
  
    return content;
  }
  ```



# Reference

+ [Loader Interface](https://www.webpackjs.com/api/loaders/) 