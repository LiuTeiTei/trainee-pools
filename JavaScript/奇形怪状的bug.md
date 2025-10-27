## 对数字的处理

### JSON 转换

+ 对超长数字的处理不对：

  ```js
  const bignumber = {num: 999999999999999}
  JSON.parse(JSON.stringify(bignumber)) // {num: 10000000000000000}
  ```

+ 不支持 BigInt：

  ```js
  const data = { bigNumber: 9007199254740992n };
  JSON.stringify(data)
  // Uncaught TypeError: Do not know how to serialize a BigInt
  //  at JSON.stringify (<anonymous>)
  //  at <anonymous>:1:6
  ```

解决办法：[json-with-bigint](https://github.com/Ivan-Korolenko/json-with-bigint)

