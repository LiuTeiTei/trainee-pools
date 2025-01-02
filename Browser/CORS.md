# 同源策略

[浏览器的同源策略](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)

同源

+ 如果两个 URL 的 Protal、Domain 和 Port 都相同的话，则这两个 URL 是同源的。
+ Cookie 对同域的定义更加宽泛一些，只要是父域相同且不是公共后缀即可。例如 `x.a.com` 和 `y.a.com` 是同域。



# 支持跨域请求

[ 突破跨域限制的9种解决方案](https://juejin.cn/post/6999615960134975495#heading-6)



## CORS

跨域资源共享 Cross-Origin Resource Sharing

[阮一峰 - 跨域资源共享 CORS 详解](https://www.ruanyifeng.com/blog/2016/04/cors.html)

+ 简单请求（simple request）和非简单请求（not-so-simple request）
+ Access-Control-XXX



### 服务端

[nest - CORS](https://docs.nestjs.com/security/cors#getting-started)

```js
// 方法一
const app = await NestFactory.create(AppModule);
app.enableCors();
await app.listen(process.env.PORT ?? 3000);

// 方法二
const app = await NestFactory.create(AppModule, { cors: true });
await app.listen(process.env.PORT ?? 3000);
```



# Cookie

## 设置 Cookie

设置 Cookie 时 Domain 可以设置为父域名和自身，但是不能设置其他域名和子域名。

```js
document.cookie = 'xxx'
```



## 跨域请求带上 Cookie

客户端和服务端的域名相同时，会自动带上该 Domain 下同一 Path 的 Cookie。

假设发送跨域请求的客户端的域名是 `a.com`，接收请求的服务端的域名是 `b.com`

+ 受浏览器的同源策略所限制，`a.com` 向 `b.com` 发送的跨域请求默认不会带上 Cookie；
+ 通过一些设置可以带上 Cookie，但这个 Cookie 的 Domian 必须是域名为 `b.com` 下的 Cookie。

跨域请求带 Cookie 的设置如下：

1. 对服务端的要求
   + > 参考 MDN - [Access-Control-Allow-Origin](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Origin) 和 [Access-Control-Allow-Credentials](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials) 

   + `Access-Control-Allow-Origin=http://localhost:${port}` 服务端允许跨域，且支持跨域的域名必须是具体的域名而不能是通配符 `*`；

   + `Access-Control-Allow-Credentials=true` 服务端允许接收跨域 Cookie。

2. 对客户端的要求

   + > 参考 MDN - [Access-Control-Allow-Credentials](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials) 和 [HTML 属性：crossorigin](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Attributes/crossorigin) 

   + 如果是 fetch 请求，必须设置 `credentials=include`，表示跨域请求中发送 Cookie；

   + 如果是 `<script />` 或 `<link />` 标签，要么不设置 `crossorigin` 属性表示不检查 CORS；要么 `crossorigin=use-credentials` 表示总是携带 Cookie。

3. 对 Cookie 的要求

   + > 参考 MDN - [Set-Cookie](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie) 

   + `Domain= b.com` Cookie 的 Domain 必须是服务端的同域，不能是当前域等其他域；

   + `SameSite=None; Secure` Cookie 的 SameSite 必须为 None，表示支持该 Cookie 随跨域请求一起发送，根据规范需要同时设置 Secure，且请求需要是 HTTPS 协议（localhost 不受此限制）。



# References

[网络基础16 携带Cookie跨域](https://duola8789.github.io/2018/01/06/01%20%E5%89%8D%E7%AB%AF%E7%AC%94%E8%AE%B0/08%20%E7%BD%91%E7%BB%9C%E5%9F%BA%E7%A1%80/%E7%BD%91%E7%BB%9C%E5%9F%BA%E7%A1%8016%20%E6%90%BA%E5%B8%A6Cookie%E8%B7%A8%E5%9F%9F/) 

[cookie跨域那些事儿](https://www.cnblogs.com/imgss/p/cors.html) 

[前端如何获取httpOnly](https://docs.pingcode.com/baike/2194419) 
