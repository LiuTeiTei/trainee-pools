## 块作用域声明

> JavaScript 中变量作用域的基本单位是 function

### let 声明

+ let 必须在初始化之后被调用
  + var 可以变量提升，let 不行
  + 在初始化之前访问 let 会导致 TDZ（Temporal Dead Zone）错误，抛出 ReferenceError 报错
  + ES6 引入 TDZ 是为了防止变量在未初始化的状态下被访问
  + 初始化时没有赋值的变量会自动赋值为 undefiend，let b 等价于 let b = undefined
+ 显示 or 隐式 声明
  + 显示：(let a){...}
  + 隐式：{ let a; ......}

+ 考虑下面几个代码的输出结果

  + ```javascript
    var funcs = []
    
    for (let i = 0; i < 5; i++) {
    	funcs.push( function(){
    		console.log(i)
    	})
    }
    
    funcs[3]()	// 3
    ```

  + ```javascript
    var funcs = []
    
    for (var i = 0; i < 5; i++) {
    	funcs.push( function(){
    		console.log(i)
    	})
    }
    
    funcs[3]()	// 5
    ```

    + for 循环头部的 `let i` 不只为 for 循环本身声明了一个 i，而是为循环的每一次迭代都重新声明了一个新的 i。这意味着 loop 迭代内部创建的闭包封闭的是每次迭代中的变量。而 `var i` 的方式是在外层作用域只有一个 i，这个 i 被封闭进去，而不是每个迭代的函数会封闭一个新的 i。

  + ```javascript
    var funcs = []
    
    for (var i = 0; i < 5; i++) {
    	let j = i
    	funcs.push( function(){
    		console.log(j)
    	})
    }
    
    funcs[3]()	// 3
    ```

    + 这里强制在每个迭代内部创建可一个新的 j，然后闭包的工作方式是一样的。

### const 声明

+ 用于创建常量，设定了初始值之后就只读的常量
  
+ 在初始化时必须赋值
  
+ const 不是对值本身的限制，而是对赋值的那个变量的限制

  + 值没有因为 const 被锁定或者不可变，只是赋值本身不可变

  + 如果这个值是复杂值，比如对象或者数组，其内容仍然可以修改

  + ```javascript
    const a = [1, 2, 3]
    a.push(4)
    console.log(a) // [1, 2, 3, 4]
    
    a = 42 // TypeError
    ```

    + 变量 a 并不是持有一个常量数组，而是持有一个指向数组的常量引用，数组本身是可以随意改变的
    + 将对象或者数组作为常量赋值，意味着这个值在这个常量的词法作用域结束之前不会被垃圾回收，因为指向这个值的引用没有清除。

### spread/rest

+ 展开

  + 当 `...` 用在数组之前时（任何的 iterable），会把这个变量展开为各个独立的值

  + ```javascript
    function foo (x, y, z) {
      console.log(x, y, z)
    }
    
    foo(...[1, 2, 3]) // 1 2 3
    
    // 等价于 ES6 之前
    
    foo.apply(null, [1, 2, 3])
    ```

  + ```javascript
    var a = [2, 3, 4]
    var b = [1, ...a, 5]
    
    console.log(b) // [1, 2, 3, 4, 5]
    
    // 等价于 ES6 之前
    
    [1].concat(a, [5])
    ```

+ 收集

  + 把一系列值收集到一起成为一个数组

  + ```javascript
    function foo (x, y, ...z) {
      console.log(x, y, z)
    }
    
    foo(1, 2, 3, 4, 5) // 1 2 [3, 4, 5]
    ```

    + 把剩下的参数（如果有的话）收集到一起组成一个名为 z 的数组

  + ```javascript
    function foo (...args) {
      console.log(args)
    }
    
    foo(1, 2, 3, 4, 5) // [1, 2, 3, 4, 5]
    ```

    + 如果没有命名参数 `...` 会收集所有的参数

## 默认参数值

+ undefined 意味着缺失，undefined 和缺失无法区别

  + ```javascript
    function foo(x = 11, y = 31) {
      console.log(x + y)
    }
    
    foo() // 42
    foo(5, undefined) // 36  丢了 undefiend
    foo(5, null) // 5  null 被强制转换为0
    ```

+ 函数默认值还可以是任意合法表达式，甚至是函数调用

  + ```javascript
    function bar(val) {
      console.log('bar called')
      return y + val
    }
    
    function foo(x = y + 3, z = bar(x)) {
      console.log(x, z)
    }
    
    var y = 5
    foo() // 'bar called'
          // 8 13
    
    y = 6
    foo(undefiend, 10) // 9 10
    ```

  + 默认值表达式是惰性求值，它们只在需要的时候运行，也就是参数值省略或为 undefiend 的时候。

+ 函数声明中形式参数是在自己的作用域中（函数声明包裹的 （ .. ）的作用域中），而不是在函数体作用域中。

  + 默认值表达式中的标识符引用首先匹配到形式参数作用域，然后才会搜索外层作用域

  + ```javascript
    var w = 1, z = 2
    
    function foo(x = w + 1, y = x + 1, z = z + 1) {
      console.log(x, y, z)
    }
    
    foo() // ReferrnceError
    ```

+ 默认值表达式还可以是 inline 函数表达式调用，立即调用函数表达式（IIFE）

  + ```javascript
    function foo (x = (function(v){ return v + 11 })(31)) {
      console.log(x)
    }
    
    foo() // 42
    ```

+ 默认表达式还可以是函数引用

  + ```javascript
    function ajax(url, cb = function(){}){
      // ..
    }
    
    ajax('http: //some.url.1')
    ```



## 解构

```javascript
function foo() {
  return [1, 2, 3]
}

function bar () {
  return {
    x: 4, y: 5, z: 6
  }
}
```

+ 解构化赋值

  + **数组解构**和**对象解构**：将数组或对象属性中带索引的值手动赋值

  + ```javascript
    var [a, b, c] = foo()
    var {x: x, y: y, z: z} = bar()
    ```

+ 对象解构简写

  + 如果属性名和要赋值的变量名相同，可以简写

  + ```javascript
    var {x, y, z} = bar()
    ```

  + 缩写语法略去了 `x:` 部分

+ 反转

  + 给对象属性赋值是 `target: source` 模式，下面中 a 是对象属性，X 是要赋给它的值

  + ```javascript
    var X = 10
    var o = {a: X}
    ```

  + 在对象解构中，反转为 `source:target` 模式

  + ```javascript
    var {x: bam, y: baz, z: bap} = bar()
    console.log(bam, baz, bap) // 4 5 6
    console.log(x, y, z) // ReferenceError
    ```

+ 解构是一个通用的赋值操作，不只是声明

  + 对于对象解构形式来说，如果省略了 var/let/const 声明符，就必须把整个赋值表达式用 `()` 括起来，不这么做的话，语句左侧的 `{...}` 作为语句的第一个元素会被当作是一个块语句而不是一个对象

    + ```javascript 
      var a, b, c, x, y, z
      
      [a, b, c] = foo()
      ({x, y, z} = bar())
      ```

  + 赋值表达式 a、x 等不一定必须是变量标识符。任何合法的赋值表达式都可以。

    + 例如把数组重排到另一个数组

      + ```javascript
        var a1 = [1, 2, 3], a2=[]
        
        [a2[2], a2[0], a2[1]] = a1
        console.log(a2) // [2, 3, 4]
        ```

    + 例如，不用临时变量交换两个变量的值

      + ```javascript
        var x = 10, y= 20
        
        [y, x] = [x, y]
        console.log(x, y) // 20 10
        ```

+ 对象解构形式允许多次列出同一个源属性

  + ```javascript
    var {a: {x: X, x: Y}, a} = {a: {x: 1}}
    
    console.log(X, Y, a) // 1 1 {x: 1}
    
    ({a: X, a: y, a: [Z]} = {a: [1]})
    
    X.push(2)
    Y[0] = 10
    
    console.log(X, Y, Z) // [10, 2] [10, 2] 1
    ```



## 解构与 ...

+ 为解构/分解出来的值更多的值赋值

  + ```javascript
    var [, , c, d] = foo()
    console.log(c, d) // 3 undefined
    ```

  + 多余的值会被赋为 undefined，undefined 就是丢失

+ 默认值赋值

  + ```javascript
    var [a = 3, b = 6, c = 9, d = 12] = foo()
    console.log(a, b, c, d) // 1, 2, 3, 12
    ```

+ 在解构中使用一个对象或者数组作为默认值

  + ```javascript
    var x = 200, y = 300. z = 100
    var o1 = {x: {y: 42}, z: {y: z}}
    
    ({y: x = {y: y}} = o1)
    ({z: y = {y: z}} = o1)
    ({x: x = {y: x}} = o1)
    
    console.log(x.y, y.y, z.y) // 300 100 42
    ```

+ 嵌套解构

  + ```javascript
    var App = {
      model: {
        User: function(){...}
      }
    }
      
    var {model: {User}} = App
    
    // 不用
    var User = App.model.User
    ```

  + 把嵌套解构当作一种展开对象名字空间的简单方法

+ 解构默认值与函数默认值之间的区别

  + ```javascript
    function f6({x = 10} = {}, y = {y: 10}) {
      console.log(x, y)
    }
    
    f6() // 10 10
    f6(undefined, undefined) // 10 10
    f6({}, undefined) // 10 10
    
    f6({}, {}) // 10 undefined
    f6(undefined, {}) // 10 undefined
    
    f6({x: 2}, {y: 3}) // 2 3
    ```

  + 作为函数默认值的 {y: 10} 的值是一个对象，而不是解构默认值。因此，它只在第二个参数没有传入，或者传入 undefined 的时候生效。

  + 传入第二个参数 ({})，所有没有使用默认值 {y: 10} ，而是在传入的空对象值 {} 上进行 {y} 解构

  + 对于 x 这种形式的用法来说，如果第一个参数省略或者是 undefined， 就会应用 {} 空对象默认值。然后，在第一个参数位置传入的任何值（或者是默认 {}，或者是你传入的任何值）都使用 {x = 10} 来解构，这会检查是否有 x 属性，如果没有（或者 undefined），就会为名为 x 的参数应用默认值 10

+ 为嵌套对象属性设置默认值：结构并重组

  + ```javascript
    var default = {
      options: {
        remove: true,
        enable: false,
        instance: {},
      },
      log: {
        warn: true,
        error: false
      }
    }
    
    var config = {
      options: {
        remove: false,
        instance: null
      }
    }
    ```

  + 目标：把 config 对象空槽的位置用默认值覆盖，但是不想覆盖已存在的部分

  + ```javascript
    // 把 default 合并进 config
    {
      // （带默认值赋值的）解构
      let {
        options: {
          remove = default.options.remove,
          enable = default.options.enable,
          instance = default.options.instance
        } = {},
        log = {
          warn = default.log.warn,
          error = default.log.error
        } = {}
      } = config
      
      // 重组
      config = {
        options: { remove, enable, instance},
        log: { warn, error }
      }
    }
    ```



## 对象字面量扩展

+ 简洁属性

  + ```js
    var x = 2, y = 3
    
    // old
    var o = { x = x, y = y }
    
    // new
    var o = { x, y }
    ```

+ 简洁方法

  + ```jsx
    // old
    var o = {
      x: function() {},
      y: function() {}
    }
    
    // new
    var o = {
      x() {},
      y() {}
    }
    ```

  + 简洁方法等价于匿名函数表达式，`x() {}` 等价于 `x: function (){}` ，而不是 `x: function x() {}` 

  + 只能在不需要它们执行递归或者事件绑定/解绑定的时候使用

  + ```js
    {
      something: function something(x, y) {
        if (x > y) {
          return something(y, x)
        }
        return y - x
      }
    }
    ```

+ 对象字面定义属性名位置的 `[ .. ]` 可以放置任意合法表达式

  + ```js
    var prefix = 'user_'
    
    // old
    var o = {
      baz: function() {}
    }
    o[prefix + 'foo'] = function() {}
    
    // new
    var o = {
      baz: function() {},
      ['prefix + 'foo'']: function() {}
    }
    ```



## 模版字面量

+ 插入字符串字面量中的换行会在字符串值中被保留



## 箭头函数

+ 箭头函数是匿名函数表达式，在需要反复使用同一个函数的场景下，箭头函数并不太适用。

+ 箭头函数转变带来的可读性与被转换函数的长度负相关。

+ 箭头函数的**主要设计目**的是以特定的方式改变 this 的行为特性，解决 this 相关编码的一个特殊又常见的痛点。

  + 考虑一个 `=>` 以前的用法

    + ```js
      var controller = {
        makeRequest: function(..) {
          var self = this
          
          btn.addEventListener('click', function() {
            // ..
            self.makeRequest(..)
          }, false)
        }
      }
      ```

    + 使用 `var self = this` 这一 hack，因为我们在传入 addEventListener 的回掉函数内部，this 绑定和 makeRequest 本身的 this 绑定是不同的。

    + 因为 this 绑定是动态的，通过变量 self 依赖于词法作用域的可预测性。

  + 考虑一个 `=>` 之后的用法

    + ```js
      var controller = {
        makeRequest: function(..) {
          btn.addEventListener('click', () => {
            // ..
            this.makeRequest(..)
          }, false)
        }
      }
      ```

    + 在箭头函数内部，this 绑定不是动态的，而是词法的。

    + 箭头函数回调中的词法 this 与封装的 makeRequest 指向同样的值

    + 在需要 `var self = this` 或者 `.bind(this)` 的场景，可以使用箭头函数来代替

  + 考虑一个 `=>` 滥用的场景

    + ```js
      var controller = {
        makeRequest: (..) => {
          // ..
          this.helper(..)
        },
        helper: (..) => {
          // ..
        }
      }
      
      controller.makeRequest(..) // Uncaught TypeError: this.helper is not a function
      
      ------------------------------------------
      
      var controller = {
        makeRequest: function(x) {
          let y = x
          this.helper(y)
        },
        helper: function(x) {
          console.log(x)
        }
      }
      
      controller.makeRequest(10) // 10
      ```

    + 在一个支持 this 、不需要 `var self = this` 或者 `.bind(this)` 的函数中使用箭头函数，会把事情搞乱

    + 这里的 this 并不像平时一样指向 controller ，它是从包围的作用域中词法继承而来的 this，也就是全局作用域，这里的 this 指向那个全局对象。

    + 除了词法 this，箭头函数还有词法 arguments，它们没有自己的 arguments 数组，而是继承自父层，词法 super 和 new.target 也是一样。

+ 箭头函数适用时机

  + 简短单句在线函数表达式，函数内部没有 this 引用，没有自身引用；
  + 内层函数表达式，需要 `var self = this` 或者 `.bind(this)` 来确保适当的 this 绑定；
  + 内层函数表达式，类似于 `var args = Array.prototype.slice.call(arguments)` 来保证 arguments 的词法复制。

+ 箭头函数**不适用** 

  + 函数声明
  + 较长的多语句表达式
  + 需要词法名称标识符
  + 内部有 this 的使用



## for..of 循环

+ `for..in` 在键/索引上循环，`for..of` 在值上循环

  + ```js
    var a = ['a', 'b', 'c']
    
    for (var idx in a) {
      console.log(idx)
    }
    // 0 1 2
    
    for (var val of a) {
      console.log(val)
    }
    // 'a' 'b' 'c'
    ```

+ `for..of` 循环向 iterable 请求一个迭代器（通过内建的 Symbol.interator），然后反复调用这个迭代器把它产生的值赋给循环迭代变量。



## 正则表达式

+ Unicode 标识—— `u` 
  + JavaScript 字符串通常被解释为 16位字符序列，这些序列对应**基本多语言平台——BMP**中的字符。但还有很多 UTF-16 字符在这个范围之外（UTF-16 不完全是 16 位的，现代 Unicode 使用 21 位来表示）。
  + 在 ES6 之前，正则表达式只能基于 BMP 字符匹配，一些扩展字符会被当作两个独立的字符来匹配。
  + 在 ES6 之后，u 标识符表示正则表达式用 Unicode（UTF-16）字符来解释处理字符串，把这些扩展字符当作单个实体来匹配。
  + `/[🎵]/u`

+ 定点标识—— `y`
  + 在正则表达式的起点有一个虚拟的锚点，只从正则表达式的 lastIndex 属性指定的位置开始。
  + y 模式不能向前移动搜索匹配。
  + y 要求 lastIndex 精确位于每个匹配发生的位置。
  + `/f../y` 
+ 正则表达式应用标识—— `flags`
  + 该属性返回一个字符串，由当前正则表达式对象的标志组成。
  + 属性中的标志以字典序排序（从左到右，即 `"gimuy"` ）。
  + `re.flags` 



## 符号

+ ES6 引入了一个新的原生类型 symbol。

+ symbol 没有字面量形式。

+ 如同原生字符串值不是 String 的实例一样，symbol 也不是 Symbol 的实例。

+ symbol 本身的内部值（称为它的名字 name），不在代码中出现且无法获得，存在的意义是创建一个类字符串、不会与其他任何值冲突的值。

  + 使用一个 symbol 作为事件名的常量：

    + ```js
      var EVT_LOGIN = Symbol('event.login')
      
      evthub.listen(EVT_LOGIN, function(data){...})
      ```

    + 这里的好处是  EVT_LOGIN 持有一个不可能与其他值重复的值，所以这里分发或者处理的事件不会有任何混淆。

  + 可以在对象中直接使用符号作为属性名/键值，比如用作一个特殊的想要作为隐藏或者原属性的属性：

    + 这个属性不出现在对这个对象的一般属性枚举中。

    + 实现单例模式，只允许自己被创建一次。

    + ```js
      const INSTANCE = Symbol('instance')
      
      function HappyFace() {
        if (HappyFace[INSTANCE]) return HappyFace[INSTANCE]
        
        function smile() {...}
        
        return HappyFace[INSTANCE] = {
          smile: smile
        }
      }
        
      var me = HappyFace(),
          you = HappyFace()
      
      me === you; // true
      ```

    + 这里的 INSTANCE 是一个特殊的、几乎隐藏的、类似元属性的属性，静态保存在 HappyFace() 函数对象中



## Inference

你不知道的 JavaScript 下卷 —— 第二部分：第二章

