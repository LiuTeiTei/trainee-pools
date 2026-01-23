# 语法糖

在 ES5 之前我们是这样写类的：

```js
// 构造函数
function Parent() {
  // 相当于 constructor 内部代码
  this.value = 1;
}

// ==== 实例方法：定义在原型（prototype）上 ====
Parent.prototype.sayHi = function () {
  console.log('Hi');
};

// ==== 静态属性：定义在构造函数本身上 ====
Parent.staticProp = 'parent';

// ==== 静态方法：同样定义在构造函数本身上 ====
Parent.greet = function () {
  console.log('Hello from static');
};
```

ES6 Class 其实是上面这种写法的语法糖：

```js
class Parent {
  static staticProp = 'parent'
  constructor() {
    this.value = 1;     // 实例属性（非 static）
  }

  sayHi() {            // 实例方法（定义在 Parent.prototype 上）
    console.log('Hi');
  }

  static greet() {     // 静态方法（定义在 Parent 构造函数上）
    console.log('Hello from static');
  }
}
```



# 类成员

在 `class` 中，你可以定义两类成员：

| 成员类型           | 定义方式      | 归属对象               |
| :----------------- | :------------ | :--------------------- |
| 实例成员           | 不带 `static` | 属于实例对象           |
| 静态成员（static） | 带 `static`   | 属于类本身，而不是实例 |

```js
class Person {
  // 静态属性
  static species = 'Homo sapiens';

  // 静态方法
  static greet() {
    console.log('Hello from Person class');
  }

  // 实例方法
  sayHi() {
    console.log(`Hi, I'm a ${Person.species}`);
  }
}

const p = new Person();

p.sayHi();          // ✅ 实例方法
Person.greet();     // ✅ 静态方法
console.log(p.greet); // ❌ undefined（实例不能访问静态方法）
```

`static` 成员是可以被继承的。

```js
class Parent {
  static greet() {
    console.log('Hello from Parent');
  }
}

class Child extends Parent {}

Child.greet(); // ✅ Hello from Parent
```

你也可以在子类中重写它：

```js
class Child extends Parent {
  static greet() {
    super.greet();
    console.log('Hello from Child');
  }
}
Child.greet();
// Hello from Parent
// Hello from Child
```

`static` 关键字定义的成员，本质上就是在构造函数对象上定义的属性。



在 JavaScript 的 static 方法中，`this` 指向调用该方法的类（构造函数对象）。

通过这种机制，静态方法可被继承并保持“动态调用方”上下文。

具体来说：

| 场景                                | `this` 指向          |
| :---------------------------------- | :------------------- |
| 直接调用 `ClassName.staticMethod()` | `this === ClassName` |
| 子类调用 `SubClass.staticMethod()`  | `this === SubClass`  |
| 被继承时在父类静态方法中使用 `this` | 指向“当前调用方”类   |

```js
class Animal {
  static type = 'animal';
  static show() {
    console.log(this.type);
  }
}

class Dog extends Animal {
  static type = 'dog';
}

Dog.show();     // 输出 dog
Animal.show();  // 输出 animal
```



# 继承

> ✅ 子类会继承父类定义在 `prototype` 上的实例方法。
> ❌ 子类不会直接继承父类实例属性（`this.xxx` 定义的内容）。
>
> ⚙️ 父类的构造函数里定义的属性，只会通过调用 `super()` 才“继承”到子类实例上。

------

## 🧱 一、先看这段 class 的结构（等价的非语法糖写法）

实际上和你之前的 ES5 写法等价👇：

```
jsCopy
function Parent() {
  this.value = 1; // 构造函数内属性，是实例自己的
}

Parent.prototype.sayHi = function () {
  console.log('Hi');
};

Parent.staticProp = 'parent';
Parent.greet = function () {
  console.log('Hello from static');
};
```

------

## 🧩 二、创建一个子类

```
jsCopy
class Child extends Parent {
  constructor() {
    super(); // 重点
    this.childValue = 2;
  }
}
```

展开到 ES5 等价的结构相当于：

```
jsCopy
function Child() {
  // 调用 Parent 构造函数来初始化 this
  Parent.call(this);
  this.childValue = 2;
}

// 建立原型链，让 Child.prototype 继承 Parent.prototype
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

// 静态方法 / 属性继承
Object.setPrototypeOf(Child, Parent);
```

------

## 🧠 三、从结构上看清“继承了什么”

现在关系是：

```
plaintextCopy
Child.prototype → Parent.prototype → Object.prototype
Child           → Parent           → Function.prototype
```

### ✅ 子类实例

会继承 Parent.prototype 上的所有实例方法：

```
jsCopy
const c = new Child();
c.sayHi(); // ✅ 从 Parent.prototype 继承来的
```

### ⚙️ 但不会“直接继承”实例属性：

```
jsCopy
console.log(c.value); // ✅ 有值 1
```

看起来 有，但这是因为执行了 `super()`。
`super()` 本质是 `Parent.call(this)`，父类构造函数被执行了一遍，`this.value = 1` 赋在了实例上。

如果你不写 `super()` 呢？👇

```
jsCopy
class BadChild extends Parent {
  constructor() {
    // super() 要求必须先调用，否则无法使用 this
    console.log(this.value); // ❌ 报错
  }
}
```

说明构造函数（父类的构造逻辑）不会自动执行，必须手动调用。

------

## ⚙️ 四、具体总结：三种“继承”情况

| 类型                                                    | 存在位置                       | 子类是否继承                | 如何获得                                                   |
| :------------------------------------------------------ | :----------------------------- | :-------------------------- | :--------------------------------------------------------- |
| 实例方法（非 static 方法）                              | `Parent.prototype`             | ✅ 会继承                    | 通过原型链：`Child.prototype.__proto__ = Parent.prototype` |
| 实例属性（如 `this.value`）                             | `constructor` 内，属于实例自身 | ⚙️ 通过 `super()` 执行时复制 | `super()` → `Parent.call(this)`                            |
| 静态属性/方法（如 `Parent.greet` / `Parent.staticProp`) | 直接挂在构造函数对象上         | ✅ 继承                      | 通过 `Object.setPrototypeOf(Child, Parent)`                |

------

## 💬 五、验证一下

```
jsCopy
class Parent {
  static staticProp = 'parent'
  constructor() {
    this.value = 1;
  }
  sayHi() { console.log('Hi'); }
  static greet() { console.log('Hello from static'); }
}

class Child extends Parent {
  constructor() {
    super();
    this.childValue = 2;
  }
}

const c = new Child();
console.log(c.value);   // ✅ 1  ← super() 调用了父类构造函数
c.sayHi();              // ✅ 'Hi' ← 来自 Parent.prototype
Child.greet();          // ✅ 'Hello from static' ← 静态方法继承
console.log(Child.staticProp); // ✅ 'parent'
```

------

## ✅ 六、一句话总结

> JavaScript 的子类继承来自两条链路：
>
> - 原型链继承 → 继承父类的实例方法（非 static）；
> - 构造函数调用 (`super()`) → 激活父类的实例属性初始化；
> - 构造函数对象链 (`Object.setPrototypeOf`) → 继承父类的静态方法与静态属性。

------

### 💡 记忆口诀：

> 🧩 方法靠链（原型链继承）
> ⚙️ 属性靠调（super 初始化）
> ⚡ 静态靠挂（类本身继承）

------

所以结论清晰地是：

> ✔️ 子类确实会继承父类的「非 static 方法（实例方法）」，
> ❌ 但不会直接继承父类的实例属性，它们是通过 `super()` 执行父类构造函数“借”过来的。
