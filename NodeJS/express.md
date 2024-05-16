## Express

> Express 不是 Node.js 的内置模块，它是一个 Node.js 框架。
>
> Express 提供精简的基本 Web 应用程序功能，包括应用的路由。路由根据用户在页面的操作将用户导向到相应的页面。

### 路由结构

+ 在 Express 中，路由采用这种结构：`app.METHOD(PATH, HANDLER)` ；
+ `METHOD` 是小写的 http 方法；
+ `PATH` 是服务器上的相对路径（它是一个字符串，甚至是正则表达式）；
+ `HANDLER` 是 Express 匹配路由时调用的处理函数。

### 函数结构

+ 处理函数采用这种形式：`function(req, res) {...}` 。

+ 在这个处理函数的参数中 `req` 是请求对象，`res` 是响应对象。

+ ```js
  function(req, res) {
  	res.send('Response String');
  }
  ```

### 创建一个 express 应用对象

+ ```js
  var express = require('express');
  var app = express();
  
  // ...
  
  module.exports = app;
  ```

+ `app.listen(port)` 

  + 它告诉服务器监听指定的端口，并且让这个服务处于运行状态。

  + ```js
    app.listen(3000, () => {
      console.log('示例应用正在监听 3000 端口!');
    });
    ```

+ `app.get(..)` 

  + 当 GET 请求根路由（ "/" ）时，端响应一个 "Hello Express" 字符串。

  + ```js
    app.get('/', function(req, res) {
      res.send('Hello Express')
    })
    ```
    
  + 当 GET 请求路由（ "/json" ）时，端响应一个 json 文件。

  + ```js
    app.get('/json', (req, res) => {
      res.json({
        'message': 'Hello json'
      })
    })
    ```
    
  + 可以使用 `res.sendFile(path)` 方法来响应一个文件，此方法需要文件的绝对路径。

  + ```js
    app.get('/', function(req, res) {
      res.sendFile(__dirname + '/views/index.html')
    })
    ```

### 中间件

+ 什么是中间件

  + 一个最基本的中间件可以看做是一个函数，它拦截路由处理方法，并在里面添加了一点别的信息。
  + 中间件是一个接收 3 个参数的函数：请求对象、响应对象和在应用请求响应循环中的下一个函数。
  + 这些函数执行一些可能对应用程序产生副作用的代码，通常还会在请求对象或者响应对象里添加一些信息。
  + 当满足某些条件时，它们也可以结束发送响应的循环。
  + 如果它们没有发送响应，那么当它们完成时就会开始执行堆栈中的下一个函数。这将触发调用第 3 个参数`next()`。
  + 更多信息请查看 [express 文档：Using middleware](http://expressjs.com/en/guide/using-middleware.html)。

+ `app.use(<mware-function>)` 

    + 使用 `app.use(path, middlewareFunction)` 方法来加载一个中间件。第一个参数是可选的，如果没设置第一个参数，那么应用的所有请求都会经过这个中间件处理。

    + 当完成时，要调用 `next()` 方法，否则你的服务器将一直处于挂起状态。

    + ```js
      app.use(function middleware(req, res, next) {
        var str = req.method + ' ' + req.path + ' ' + ' - ' + req.ip
        console.log(str)
        next()
      })
      ```

+ POST

  + 要解析来自 POST 请求的数据，你必须安装一个包：body-parser。这个包允许你使用一套可以解码不同格式数据的中间件，在[这里](https://github.com/expressjs/body-parser)查看文档。

  + 在 package.json 中安装 body-parser 模块，然后在文件顶部 require 进来，用变量 bodyParser 保存它。

  + 处理 URL 编码数据通过中间件的 `bodyParser.urlencoded({extended: false})` 方法。`extended=false` 是一个配置选项，告诉解析器使用经典编码。当你使用它时，值只能是字符串或者数组。继承版使用起来数据更加灵活，它比 JSON 更好。

  + 传递给 `app.use()` 上一次方法调用返回的函数。通常中间件必须挂载在所有需要它的路由之前。

  + ```js
    var bodyParser = require('body-parser');
    
    app.use(bodyParser.urlencoded({ extended: false }));
    ```

+ `app.METHOD(path, middlewareFunction)` 

  + 使用 `app.use(<mware-function>)` 方法，在这种情况下，该函数将对所有请求执行，但是还可以设置成更具体的条件来执行。举个例子，如果希望某个函数只针对 POST 请求执行，可以使用 `app.post(<mware-function>)` 方法。所有 http 动作都有类似的方法，比如 GET、DELETE、PUT 等等。

  + 使用 `app.METHOD(path, middlewareFunction)` 可以将中间件挂载到指定的路由，中间件也可以在路由定义中链接。

  + ```js
    app.get('/now', (req, res, next) => {
      req.time = new Date().toString()
      next()
    }, (req, res) => {
      res.send({time: req.time})
    })
    ```

+ `req.params` 

  + 路由参数是由斜杠 `/` 分隔的 URL 命名段。每一小段能捕获与其位置匹配的 URL 部分的值。捕获的值能够在 `req.params` 对象中找到。

  + ```json
    route_path: '/user/:userId/book/:bookId'
    actual_request_URL: '/user/546/book/6754'
    req.params: {userId: '546', bookId: '6754'}
    ```

  + ```js
    app.get('/:word/echo', (req, res) => {
      const { word } = req.params
      res.json({ echo: word })
    })
    ```

+ `req.query` 

  + 从客户端获取输入的另一种常见方式是使用查询字符串对路由路径中的数据进行编码。

  + 查询字符串使用标记 `?` 分隔，并且包含一对 `field=value`。每一对键值使用符号 `&` 分隔。Express 能够从查询字符串中分析这些数据，并且把它放到`req.query`对象中。

  + 可以使用 `app.route(path).get(handler).post(handler)` 这种写法，此语法允许你在同一路径路由上链接不同的 HTTP 动词处理函数。可以节省一点打字时间，并且可以让代码看起来更清晰。

  + 有些字符不能在出现在 URL 中，它们在发送前必须以[不同的格式](https://en.wikipedia.org/wiki/Percent-encoding)进行编码。如果你使用来自 JavaScript 的 API，你可以使用特定的方法来编码/解码这些字符。

  + ```json
    route_path: '/library'
    actual_request_URL: '/library?userId=546&bookId=6754'
    req.query: {userId: '546', bookId: '6754'}
    ```

  + ```js
    app.get('/name', (req, res) => {
      const { first, last } = req.query
      res.json({ name: first + ' ' + last})
    })
    ```

+ `req.body` 

  + 可以在 `req.body` 对象中找到请求的参数。

  + 除了 GET 之外，其他几种 http 方法都可以负载数据（换言之，数据都能在请求体中找到），也可以使用 body-parser 来正常工作。

  + ```json
    route: POST '/library'
    urlencoded_body: userId=546&bookId=6754
    req.body: {userId: '546', bookId: '6754'}
    ```

  + ```js
    app.use(bodyParser.urlencoded({ extended: false }));
    
    app.post('/name', (req, res) => {
      const { first, last } = req.body
      res.json({ name: first + ' ' + last})
    })
    ```

+ `express.static(path)` 

  + 在 Express 中你可以使用中间件 `express.static(path)` 来设置应用程序所需的静态资源，HTML 服务器通常有一个或多个用户可以访问的目录。你可以将应用程序所需的静态资源 (样式表、脚本、图片) 放在那里。

  + 参数就是静态资源文件的绝对路径。

  + ```js
    app.get('/', function(req, res) {
      res.sendFile(__dirname + '/views/index.html')
    })
    
    app.use(express.static(__dirname + "/public"))
    ```

### `.env` 文件

  + `.env` 文件是一个隐藏文件，用于将环境变量传给应用程序。
  
  + 这是一个私密文件，除了你之外没人可以访问它，它可以用来存储你想保持私有或者隐藏的数据。举个例子，可以存储第三方服务 API 密钥或者数据库 URI。你也可以使用它来存储配置选项。通过设置配置选项，你可以改变应用程序的行为，而无需重写一些代码。
  
  + 在应用程序中可以通过 `process.env.VAR_NAME` 访问到环境变量。
  
  + `process.env` 是 Node 程序中的一个全局对象，可以给这个变量传字符串。按照惯例，变量名都是大写的，单词之间用下划线隔开。
  
  + `.env` 是一个 shell 文件，因此不需要用给变量名和值加引号。
  
  + 还有一点需要注意，当你给变量赋值时，等号周围不能有空格，举个例子：`VAR_NAME=value`。通常来讲，每一个变量会单独定义在新的一行。
  
  + ```js
    app.get('/json', (req, res) => {
      if (process.env.MESSAGE_STYLE === 'uppercase') {
        res.json({
        'message': 'HELLO JSON'
        })
      } else {
        res.json({
        'message': 'Hello json'
        })
      }
    })
    ```
  
    



## Reference

[MDN: Express/Node 入门](https://developer.mozilla.org/zh-CN/docs/learn/Server-side/Express_Nodejs/Introduction) 

[Express: 路由](https://expressjs.com/zh-cn/guide/routing.html) 

[freeCodeCamp: 关于 Node 和 Express 基础挑战](https://learn.freecodecamp.one/apis-and-microservices/basic-node-and-express) 



## Glitch

[我的项目链接](https://glitch.com/edit/#!/bird-shrub-freckle?path=server.js%3A29%3A26)

[glitch入门了解](https://blog.csdn.net/MengJie_/article/details/105738951)

