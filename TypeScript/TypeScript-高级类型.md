## 联合类型（Union Types）

> 申明的类型并不确定，可以为多个类型中的一个

+ 基础类型的联合使用

  + 联合类型通常与 `null` 或 `undefined` 一起使用：

    ```typescript
    declare function func(value: string | undefined): string
    func(undefined)
    ```

+ 字面量类型

  + 不仅限定变量的类型，还限定变量的取值在某一个特性的范围内，用来约束取值只能是某几个值中的一个：

    ```typescript
    declare function func(value: 'left' | 'right'): string
    func('left')
    
    const value = 'left'
    func(value)
    ```

  + 当使用可变的变量时，编译器会扩展变量的类型，例如，将 `left` 扩展为 `string` 类型：

    ```typescript
    let value = 'left'
    func(value)   // let value: string;  Argument of type 'string' is not assignable to parameter of type '"left" | "right"'
    ```

  + 可以通过类型注解解决这个问题，但这样可变变量将失去一部分灵活性：

    ```typescript
    let value: 'left' | 'right' = 'left'
    func(value)
    ```

+ 如果一个值是联合类型，在类型没有确定的情况下，只能访问此联合类型的公共属性：

  ```typescript
  type Person = 
    | { name: string, house: string}
    | { name: string, car: string }
  
  function getName(p: Person) {
    const house = p.house  //  Property 'house' does not exist on type 'Person'.  Property 'house' does not exist on type '{ name: string; car: string; }'
    return p.name
  }
  ```

+ 枚举值的联合类型会丢弃掉公共属性：

  + 枚举值定义的时候将值作为类型，如果值相同，会丢失相同的那个值（key 不同但是值相同也会丢失）：
  
    ```typescript
    enum OPERATION {
      LIST = 'list',
      GET = 'get'
    }
      
    enum OTHER {
      LIST = 'list',
      SHARE = 'share'
    }
      
    type COMBINE = OPERATION | OTHER
    type Inter = Partial<Record<COMBINE, string>>
    // Inter = {
    //   get?: string | undefined;
    //   share?: string | undefined;
    // }
    ```
  + 如果 key 相同，但是值不同，会扩展：

    ```typescript
    enum OPERATION {
      LIST = 'lists',
      GET = 'get'
    }
    
    enum OTHER {
      LIST = 'list',
      SHARE = 'share'
    }
    
    type COMBINE = OPERATION | OTHER
    type Inter = Partial<Record<COMBINE, string>>
    // Inter = {
    //   lists?: string | undefined;
    //   get?: string | undefined;
    //   list?: string | undefined;
    //   share?: string | undefined;
    // }
    ```



### 可辨识联合类型（Discriminated Unions）

  + 这种类型的本质是结合联合类型和字面量类型的一种类型保护方法；

  + 如果一个类型是多个类型的联合类型，且多个类型含有一个公共属性，那么就可以利用这个公共属性，来创建不同的类型保护区块；

  + 它包含 3 个要点：可辨识、联合类型和类型守卫：

    + **可辨识**要求联合类型中的每个元素都含有一个单例类型属性，比如：

      ```typescript
      interface Square {
        kind: "square";
        x: number;
      }
      interface Rectangle {
        kind: "rectangle";
        x: number;
        y: number;
      }
      interface Circle {
        kind: "circle";
        radius: number;
      }
      ```

    + 基于前面定义了三个接口，我们可以创建一个 `Shape` **联合类型**：

      ```typescript
      type Shape = Square | Rectangle | Circle
      ```

    + 使用**类型守卫**可以安全地访问 `shape` 对象中的所包含的属性：

      ```typescript
      function area(s: Shape) {
        if (s.kind === "circle") {
          return Math.PI * s.radius * s.radius;
        } else if (s.kind === "square") {
          return s.x * s.x;
        } else {
          return (s.x * s.y) / 2;
        }
      }
      ```

      + area 的返回类型被推断为 `number`，如果某些变量没有被覆盖，面积的返回类型将是 `number|undefined`；

      + 公共属性会出现在联合类型中：

        ```typescript
        function height(s: Shape) {
          if (s.kind === "circle") {
            return 2 * s.radius;
          } else {
            // s.kind: "square" | "triangle"
            return s.x;
          }
        }
        ```

+ 利用 `never` 确保 `Shape` 的改动正确

  ```typescript
  interface Other {
    kind: "single"
  }
  
  type Shape = Square | Rectangle | Circle | Other
  
  function area(s: Shape) {
    switch(s.kind) {
      case 'circle':
        return Math.PI * s.radius * s.radius
      case 'square':
        return s.x * s.x
      case 'rectangle':
        return (s.x * s.y) / 2
      default:
        const exhaustiveCheck: never = s  // Type 'Other' is not assignable to type 'never'.
        return exhaustiveCheck
    }
  }
  ```

  + 在 default 里面把被辨识为 `never` 的 `s` 赋值给一个显式声明为 `never` 的变量。如果一切逻辑正确，那么能够编译通过。如果将来改动了 `Shape` 的类型，但是没有改动 area 函数，此时 default 里面 `s` 会被辨识为 Other 类型，无法赋值给 `never` 类型，因此会产生一个 ts error。通过这个方法可以保证 area 函数的正确。




## 交叉类型（Intersection Types）

> 交叉类型是将多个类型合并为一个类型。 
>
> 这让我们可以把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性。
>
> 特别适合对象混入的场景。

+ 交叉类型用 `&` 连接：

  ```typescript
  interface DogInterface {
      run(): void
  }
  interface CatInterface {
      jump(): void
  }
  let pet: DogInterface & CatInterface = {
      run() {},
      jump() {}
  }
  ```

+ 同名基础类型属性的合并：

  ```typescript
  type Conflicting = { a: number } & { a: string };
  const test: Conflicting = {
    a: 'a'  // Type 'string' is not assignable to type 'never'.
  }
  ```

  + 混入后成员 a 的类型为 `string & number`，很明显这种类型是不存在的，所以混入后成员 c 的类型为 `never`。

+ 同名非基础类型属性的合并：

  ```typescript
  interface D { d: boolean; }
  interface E { e: string; }
  interface F { f: number; }
  
  interface A { x: D; }
  interface B { x: E; }
  interface C { x: F; }
  
  type ABC = A & B & C;
  
  let abc: ABC = {
    x: {
      d: true,
      e: 'semlinker',
      f: 666
    }
  };
  ```

  + 混入多个类型时，若存在相同的成员，且成员类型为非基本数据类型，可以成功合并。

+ 交叉类型可以简单看作类型的并集，联合类型可以简单看作类型的交集。

