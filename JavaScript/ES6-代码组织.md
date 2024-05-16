## 迭代器——iterator

> 迭代器是一个结构化的模块，用于从源以一次一个的方式提取数据。
>
> 迭代器是一种有序的、连续的、基于拉取的用于消耗数据的组织方式。

### Iterator 接口

JavaScript 中默认为、提供 iterator 的标准内建值包括：

+ Arrays
+ Strings
+ Generators
+ Collections / TypedArrays

ES6 中开包括几个新的称为集合的数据结构，这些集合不仅本身是 iterator，还提供了 API 方法来产生迭代器：

+ Maps

### next()迭代

+ ```js
  function* gen() {
    yield 1;
    yield 2;
    yield 3;
  }
  
  var g = gen(); // "Generator { }"
  g.next();      // "Object { value: 1, done: false }"
  g.next();      // "Object { value: 2, done: false }"
  g.next();      // "Object { value: 3, done: false }"
  g.next();      // "Object { value: undefined, done: true }"
  ```

  + 在提取最后一个值的时候，迭代器 `g` 不会报告 `done: true` ，必须得再次调用 `next()` 越过结尾的值，才能得到信号 `done: true` 。

+ ```js
  var arr = [1, 2, 3]
  var it = arr[Symbol.iterator]()
  
  it.next() // "Object { value: 1, done: false }"
  ```

  + 每次在这个 arr 值上调用位于 Symbol.iterator 的方法时，都会产生一个全新的迭代器。多数数据结构都是这么实现的，包括所有的 JavaScript 内置数据结构。

### return()

+ return(..) 被定义为向迭代器发送一个信号，表明消费者代码已经完毕，不会再从中提取任何值。这个信号可以用于通知生产者（响应 next 调用的迭代器）执行可能需要的清理工作，比如释放/关闭网络、数据库或者文件句柄资源。

+ ```js
  function* gen() {
    yield 1;
    yield 2;
    yield 3;
  }
  
  var g = gen();
  
  g.next();        // { value: 1, done: false }
  g.return("foo"); // { value: "foo", done: true }
  g.next();        // { value: undefined, done: true }
  g.return(); // { value: undefined, done: true }
  g.return(1); // { value: 1, done: true }
  ```

  + 如果对已经处于“完成”状态的生成器调用 `return(value)`，则生成器将保持在“完成”状态。如果没有提供参数，则返回对象的 `value` 属性与示例最后的 `.next()` 方法相同。如果提供了参数，则参数将被设置为返回对象的 `value` 属性的值。

### throw()

+ throw(..) 用于迭代器报告一个异常/错误，迭代器针对这个信号的反应可能不同于针对return(..) 意味着的完成信息。它并不一定意味着迭代器的完全停止。

+ ```js
  function* gen() {
    while(true) {
      try {
         yield 42;
      } catch(e) {
        console.log("Error caught!");
      }
    }
  }
  
  var g = gen();
  g.next(); // { value: 42, done: false }
  g.throw(new Error("Something went wrong")); // "Error caught!"  { value: 42, done: false }
  g.next(); // { value: 42, done: false }
  ```

### 迭代器循环

+ ```js
  var it = {
    // 使迭代器 it 称为 iterator
    [Symbol.iterator]() {return this}
    next(){..}
  ..
  }
  
  it[Symbol.iterator]() === it
  ```

  + 如果迭代器也是一个 iterator，那么它可以直接用于 for..of 循环。
  + 可以通过为迭代器提供一个 Symbol.iterator 方法简单返回这个迭代器本身使它成为 iterator。

+ ```js
  for (var v, res;(res = it.next()) && !res.done;) {
    v = res.value
    console.log(v)
  }
  ```

  +  for..of 循环的等价 for 形式。
  + 迭代器一般不应与最终预期的值一起返回 done: true。



## 生成器——generator

> 生成器可以在执行当中暂停自身，可以立即恢 复执行也可以过一段时间之后恢复执行。
>
> 在执行当中的每次暂停 / 恢复循环都提供了一个双向信息传递的机会，生成器可以 返回一个值，恢复它的控制代码也可以发回一个值。
>
> 生成器实际上就是状态机逻辑的简化语法。

### 声明

+ 使用 `*` 声明。

+  `*` 的位置无所谓。

+ ```js
  function *foo() { .. } 
  function* foo() { .. } 
  function * foo() { .. } 
  function*foo() { .. }
  ..
  ```

### 运行

+ ```js
  function *foo(x,y) {
  	return x + y
  }
  foo(5, 10)	// foo {<suspended>}
  ```

  + 执行生成器，比如 `foo(5,10)`，并不实际在生成器中运行代码。相反，它会产生一个迭代器控制这个生成器执行其代码。

+ ```js
  var it = foo(5, 10)	// foo {<suspended>}
  it.next()	// {value: 15, done: true}
  ```

  + 要启动/继续 `*foo()`，调用 `it.next(..)` 

### yield

+ 标示暂停点

  + ```js
    function *foo() {
      var x = 10
      var y = 20
      yield
      return x + y
    }
    
    it = foo()
    it.next()	// {value: undefined, done: false}
    it.next()	// {value: 30, done: true}
    ```

+ 表达式，在暂停生成器的时候发出一个值，没有值的 yield 等价于 yield undefined。

  + ```js
    function *foo() {
    	while (true) {
    		yield Math.random()
    	}
    }
    
    it = foo()
    it.next()	// {value: 0.5763429468026025, done: false}
    ```

+ 表达式，接收（也就是被替换为）最终的恢复值。

  + ```js
    function *foo() {
    	var x = yield 10
    	return x
    }
    
    it = foo()
    it.next()	// {value: 10, done: false}
    it.next(30)	// {value: 30, done: true}
    ```

+ 优先级

  + 如果需要 `yield..` 出现在某个位置，而这个位置上像 `a = 3` 这样的赋值不允许出现， 那么就要用  `() ` 封装。
  + yield 关键字的优先级很低，几乎 `yield..` 之后的任何表达式都会首先计算，然后再 通过 yield 发送。只有 spread 运算符 `...` 和逗号运算符 , 拥有更低的优先级，也就是说它们会在 yield 已经被求值之后才会被绑定。

### yield 委托

+ `*` 使得一个 function 声明成了 `function*` 生成器声明，类似地，`*`  使得 yield 成为了` yield *`，这是一个完全不同的机制，称为 yield委托。

+ 语法上说，`yield *..` 行为方式与 `yield..` 完全相同.

+  `*` 的位置和 function 的类似，无所谓。

+ `yield * ..` 需要一个 iterable; 然后它会调用这个 iterable 的迭代器，把自己的生成器控制委托给这个迭代器，直到其耗尽。

+ 使用 `yield..` 表达式的完成值来自于用 `it.next(..)` 恢复生成器的值，而对于 `yield *..` 表达式来说，完成值来自于被委托的迭代器的返回值(如果有的话)。

+ ```js
  function *foo() {
    yield 1;
    yield 2;
    yield 3;
    return 4;
  }
  function *bar() {
  	var x = yield *foo(); 
  	console.log( "x:", x );
  }
  for (var v of bar()) { 
  	console.log( v );
  }
  // 1 
  // 2 
  // 3 
  // x: 4
  ```

  + 内置迭代器通常没有返回值。而如果自定义迭代器(或者生成器)的话，可以设计为 return 一个值，`yield *..` 可以捕获这个值。
  + 值 1、2 和 3 从 `*foo()` 中 yield 出来后再从 `*bar()` 中 yield 出来，然后从 `*foo()` 返回的值 4 是 `yield *foo()` 表达式的完成值，被赋给了 x。

+ ```js
  function *foo(x) {
    if (x < 3) {
      x = yield *foo(x + 1);
    }
    return x * 2; 
  }
  
  it = foo(1);
  it.next();	// {value: 24, done: true}
  ```

  + `yield *` 可以调用另外一个生成器(通过委托到其迭代器)，所以它也可以通过调用自 身执行某种生成器递归。
  + `foo(1)` 以及之后的调用迭代器的 `next()` 来运行递归步骤的结果是 24。
  + 第一个 `foo(..)` 运 行x值为1，满足x < 3。x + 1被递归地传给 `*foo(..)`，所以这一次x为2。再次的递归 调用使得 x 值为 3。
  + 因为不满足 x < 3，递归停止，返回 3 * 2 也就是 6 给前一个调用的 `yield *..` 表达 式，这个值被赋给 x。再次返回 6 * 2 的结果 12 给前一次调用的 x。最后是 12 * 2，也就是 24，返回 `*foo()` 生成器的完成结果。

### 迭代器控制

+ 生成器由迭代器控制。

+ `for..of` 循环需要一个 iterable。生成器函数引用（比如 foo）自己并不是一个 iterable；需要通过 `foo()` 执行它才能得到一个迭代器（也是一个 iterable）。

+ ```js
  function *foo() {
    var x = yield 1;
    var y = yield 2;
    var z = yield 3; 
    console.log( x, y, z );
  }
  ```

  + 假定所有都被计算，生成器完整运行到结束，`next()` 调用总是会比 `yield` 语句多 1 个。

  + `yield..` 表达式用恢复生成器所用的值完成。这意味着传给 `next(..)` 的参数完成了当前 `yield..` 表达式暂停等待完成的。

  + ```js
    var it = foo();
    
    // 启动生成器
    it.next( "satrt" );	// { value: 1, done: false }
    
    // 回答第一个问题 
    it.next( "foo" );	// { value: 2, done: false }
    
    // 回答第二个问题 
    it.next( "bar" );	// { value: 3, done: false }
    
    // 回答第三个问题 
    it.next( "baz" );	// "foo" "bar" "baz"  
    									// { value: undefined, done: true }
    ```

  + 第一个 `next()` 调用初始的暂停状态启动生成器，运行直到第一个 yield。在调用第一个 `next()` 的时候，并没有 `yield..` 表达式等待完成。如果向第一个 `next()` 调用传入一个值， 这个值会马上被丢弃，因为并没有 yield 等待接收这个值。

  + “额外的” `next()` 调用就是启动所有这一切的第一个。



## 模块——module

### 概念

+ ES6 使用基于文件的模块，也就是说一个文件一个模块。目前，还没有把多个模块合并到单个文件中的标准方法。
+ ES6 模块的 API 是静态的。也就是说，需要在模块的公开 API 中静态定义所有最高层导出，之后无法补充。
+ ES6 模块是单例。也就是说，模块只有一个实例，其中维护了它的状态。每次向其他模块导入这个模块的时候，得到的是对单个中心实例的引用。如果需要产生多个模块实例，那么你的模块需要提供某种工厂方法来实现这一点。
+ 模块的公开 API 中暴露的属性和方法并不仅仅是普通的值或引用的赋值。它们是到内部模块定义中的标识符的实际绑定(几乎类似于指针)。
  + 模块导出不是像你熟悉的赋值运算符 = 那样只是值或者引用的普通赋值。实际上，导出的是对这些东西(变量等)的绑定(类似于指针)。
  + 如果在你的模块内部修改已经导出绑定的变量的值，即使是已经导入的(参见下一小节)，导入的绑定也将会决议到当前(更新后)的值。
+ 导入模块和静态请求加载(如果还没加载的话)这个模块是一样的。如果是在浏览器环境中，这意味着通过网络阻塞加载;如果是在服务器上(比如 Node.js)，则是从文件系统的阻塞加载。

### export 导出

+ 命名导出

  + ```js
    export function foo() { 
    	// ..
    }
    export var awesome = 42;
    var bar = [1,2,3];
    export { bar };
    ```

  + export 关键字或者是放在声明的前面，或者是作为一个操作符(或类似的)与一个要导出的绑定列表一起使用。

+ 重命名导出

  + ```js
    function foo() { .. } 
    export { foo as bar };
    ```

  + 导入这个模块的时候，只有成员名称 bar 可以导入;foo 还是隐藏在模块内部。

+ 默认导出

  + 导入模块绑定时可以重命名，因为通常都会使用默认导出。

  + 每个模块定义只能有一个 default。

  + ```js
    function foo(..) { 
      // ..
    }
    export default foo;
    
    ------------------------- or ------------------------
    
    export default function foo(..) { 
      // ..
    }
    ```

    + 导出的是此时到函数表达式值的绑定，而不是标识符 `foo`。
    + `export default ..` 接受的是一个表达式。如果之后在你的模块中给 `foo` 赋一个不同的值， 模块导入得到的仍然是原来导出的函数，而不是新的值。

  + ```js
    function foo(..) { 
      // ..
    }
    export { foo as default };
    ```

    + 默认导出绑定实际上绑定到 `foo` 标识符而不是它的值。
    + 如果之后修改了 foo 的值，在导入一侧看到的值也会更新。

### import 导入

+ 导入一个模块 API 的某个特定命名成员到顶层作用域：

  + ```js
    import { foo, bar, baz } from "foo";
    
    foo();
    ```

  + 字符串 "foo" 称为模块指定符(module specifier)。因为整体目标是可静态分析的语法，模块指定符必须是字符串字面值，而不能是持有字符串值的变量。

  + 列出的标识符 foo、bar 和 baz 必须匹配模块 API 的命名导出(会应用静态分析和错误判定)。

+ 对导入绑定标识符重命名:

  + ```js
    import { foo as theFooFunc } from "foo";
    
    theFooFunc();
    ```

+ 导入并绑定到一个标识符的默认导出：

  + ```js
    import foo from "foo";
    
    // 或者:
    import { default as foo } from "foo";
    ```

  + 模块的 export 中的关键字 default 指定了一个命名导 出，名称实际上就是 default。

+ 命名空间导入：

  + ```js
    // 一个模块 "foo" 导出，如下:
    export default function foo() { .. }
    export function bar() { .. } 
    export var x = 42;
    export function baz() { .. }
    
    // 把整个 API 导入到单个模块命名空间绑定:
    import * as foo from "foo";
    foo.foo();
    foo.bar();
    foo.x; // 42 
    foo.baz();
    ```

+ 所有导入的绑定都是不可变和 / 或只读的：

  + ```js
    import foofn, * as hello from "world";
    
    foofn = 42; // (运行时)TypeError! 42;
    hello.default = 42; // (运行时)TypeError!
    hello.bar = 42; // (运行时)TypeError!
    hello.baz = 42; // (运行时)TypeError!
    ```

+ 模块相互依赖
  + import 语句的静态加载语义意味着可以确保通过 import 相互依赖的 "foo" 和 "bar" 在其中任何一个运行之前，二者都会被加载、解析和编译。
  + 它们的环依赖是静态决议的。
  + 在 foo(25) 或 bar(25) 调用执行的时候，所有模块的所有分析/编译都已经完成。



## 类——class

### 类与对象的区别

+ ```js
  class Foo {
  	constructor(a,b) {
      this.x = a;
      this.y = b; 
    }
    
  	gimmeXY() {
  		return this.x * this.y;
  	} 
  }
  ```

+ ```js
  // 粗略理解
  function Foo(a,b) { 
    this.x = a; 
    this.y = b;
  }
  
  Foo.prototype.gimmeXY = function() { 
    return this.x * this.y;
  }
  ```

+ ```js
  // 实例化和使用
  var f = new Foo( 5, 15 );
  
  f.x; // 5
  f.y; // 15
  f.gimmeXY(); // 75
  ```

+ 差异

  + 类方法是不可枚举的，而对象方法默认是可枚举的。
  + 和对象字面量不一样，在 class 定义体内部不用逗号分隔成员。
  + `function Foo` 是“提升的”， 而 `class Foo` 并不是，`extends ..` 语句指定了一个不能被“提升”的表达式。所以，在 实例化一个 class 之前必须先声明它。

### extend

+ 用来在两个函数原型之间 建立 [[Prototype]] 委托链接。

  + ```js
    class Bar extends Foo {
    	constructor(a,b,c) {
    		super(a, b); 
        this.z = c;
      }
    	gimmeXYZ() {
    		return super.gimmeXY() * this.z;
    	} 
    }
    
    var b = new Bar( 5, 15, 25 );
    
    b.x; // 5
    b.y; // 15
    b.z; // 25
    b.gimmeXYZ(); // 1875
    ```

  + Bar extends Foo 的意思当然就是把 Bar.prototype 的 [[Prototype]] 连接到 Foo.prototype。

  + 在像 gimmeXYZ() 这样的方法中，super 具体指 Foo.prototype，而在 Bar 构造器中 super 指的是 Foo。

+ 可以构建内置类的子类。

  + ES6 子类则可以完全按照期望 “继承” 并新增特性；
  + 例如 Array 的自动更新 length 特有属性；
  + 例如 Error 对象创建时，会自动捕获特殊的 stack 信息，包括生成错误时的行号和文件名。

### super

+ 在构造器中，super 自动指向“父构造器”。

+ 构造器或函数在声明时在内部建立了 super 引用（在 class 声明体内），此时 super 是静态绑定到这个特定的类层次上的，不能重载（至少在 ES6 中是这样）。

  + ```js
    class ParentA {
    	constructor() { this.id = "a"; }
    	foo() { console.log("ParentA:", this.id); }
    }
    
    class ParentB {
    	constructor() { this.id = "b"; }
    	foo() { console.log("ParentB:", this.id); }
    }
    
    class ChildA extends ParentA {
    	foo() {
    		super.foo();
    		console.log("ChildA:", this.id); 
      }
    }
    class ChildB extends ParentB {
    	foo() {
     	  super.foo(); 
        console.log("ChildB:", this.id );
      }
    }
    
    var a = new ChildA(); 
    a.foo();							// ParentA: a
    											// ChildA: a
    var b = new ChildB(); 
    b.foo();							// ParentB: b
       										// ChildB: b
    
    // 在a的上下文中借来b.foo()使用 
    b.foo.call( a ); 			// ParentB: a
    											// ChildB: a
    ```

  + this.id 引用被动态重新绑定，因此两种情况下都打印: a，而不是: b。

  + b.foo() 的 super.foo() 引用没有被动态重绑定，所以它仍然打印出 ParentB 而不是期望的ParentA。

  + 因为 b.foo() 引用了 super，它是静态绑定到 ChildB/ParentB 类层次的，而不能用在 ChildA / ParentA 类层次。ES6 并没有对这个局限提供解决方案。

### constructor

+ 对于类和子类来说，构造器并不是必须的；如果省略的话那么二者都会自动提供一个默认构造器。

+ 默认子类构造器自动调用父类的构造器并传递所有参数。类似于：

  + ```js
    constructor(...args) {
    	super(...args);
    }
    ```

+ 子类构造器中调用 super(..) 之后才能访问 this。

  + 创建 / 初始化你的实例 this 的实际上是父构造器。
  + 前 ES6 中，this 对象是由“子类构造器”创建的，然后在子类的 this 上下文中调用“父类”构造器。

### new.target

+ 元属性

+ 在任何构造器中，new.target 总是指向 new 实际上直接调用的构造器，即使构造器是在父类中且通过子类构造器用 super(..) 委托调用。

  + ```js
    class Foo {
    	constructor() {
        console.log( "Foo: ", new.target.name ); 
      }
    }
    class Bar extends Foo {
    	constructor() {
        super();
        console.log( "Bar: ", new.target.name ); 
      }
      baz() {
        console.log( "baz: ", new.target );
      } 
    }
    
    var a = new Foo();	// Foo: Foo
    var b = new Bar();	// Foo: Bar <-- 遵循new调用点 
    										// Bar: Bar
    b.baz();						// baz: undefined
    ```

  + 如果 new.target 是 undefined，那么就可以知道这个函数不是通过 new 调用的。

### static

+ 不要误以为 static 成员在类的原型链上。实际上它们在函数构造器之间的双向 / 并行链上。

  + ```js
    class Foo {
    	static cool() { console.log( "cool" ); }
     	wow() { console.log( "wow"); }
    }
    
    class Bar extends Foo {
    	static awesome() {
        super.cool(); 
        console.log( "awesome" );
    }
      neat() {
        super.wow();
        console.log( "neat" ); 
      }
    }
    
    Foo.cool();					// "cool"
    
    Bar.cool(); 				// "cool"
    Bar.awesome();			// "cool"
    										// "awesome"
    var b = new Bar(); 	
    b.neat();						// "wow"
    										// "neat"
    b.awesome; 					// undefined
    b.cool;							// undefined
    ```

+ static 适用的一个地方就是为派生(子)类设定 Symbol.species getter(规范内称为 @@species)。如果当任何父类方法需要构造一个新实例，但不想使用子类的构造器本身时，这个功能使得子类可以通知父类应该使用哪个构造器。

  + ```js
    class MyCoolArray extends Array {
      // 强制species为父构造器
      static get [Symbol.species]() { return Array; }
    }
    
    var a = new MyCoolArray( 1, 2, 3 ),
    		b = a.map( function(v){ return v * 2; } );
    
    b instanceof MyCoolArray;   // false
    b instanceof Array;         // true
    ```

