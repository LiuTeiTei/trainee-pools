Webpack 5 的模块联邦（Module Federation） 是近几年前端架构里最创新、影响力最大的特性之一。
我们来系统地讲清楚它的设计理念、底层原理、核心机制和运行流程 👇

------

## 🧩 一、背景：为什么需要模块联邦

在微前端或多团队协作的大型前端系统中，我们希望做到：

1. 🧱 各应用按功能独立构建、独立部署；
2. 🚀 应用之间可以在运行时共享模块；
3. ♻️ 相同依赖（例如 React、lodash）不用重复打包；
4. 🔄 能随时更新远程代码，不用重新部署所有应用。

Webpack 5 的 Module Federation 正是为了解决这些「跨应用模块复用」问题而引入的。

------

## 🧠 二、核心思想

> 💡 让不同应用在运行时动态地加载别的应用导出的模块。

以前 Webpack 打包阶段会把所有模块打包到一起，产出一个静态 bundle。
而现在 Module Federation 在运行时「联邦」了多个构建，它使得：

- 每个应用既可以 暴露（expose）模块 给别人用；
- 也可以 引用（remote/load）别的模块 来复用；
- 不需要提前合并代码、也不需要重新打包。

------

## 🧱 三、基本使用结构

### Host 应用（使用者）

```
jsCopy
new ModuleFederationPlugin({
  name: 'host',
  remotes: {
    remoteApp: 'remoteApp@http://localhost:3001/remoteEntry.js',
  },
});
```

### Remote 应用（暴露者）

```
jsCopy
new ModuleFederationPlugin({
  name: 'remoteApp',
  filename: 'remoteEntry.js',
  exposes: {
    './Button': './src/Button',
  },
});
```

打包后 remote 会比普通应用多生成一个 `remoteEntry.js`，
这个文件就是它的 模块清单 + 加载入口。

------

## ⚙️ 四、运行流程原理（非常关键）

整个联邦机制分为三个阶段：

### ① 构建时（Build Time）

- Webpack 在两个工程中分别生成构建产物；
- Remote 生成一个额外的 `remoteEntry.js`；
- 该文件注册了这个构建可对外暴露的模块映射表（exposes）。

```
jsCopy
self["remoteApp"] = {
  get: (module) => { /* 返回模块工厂函数 */ },
  init: (shareScope) => { /* 初始化共享模块 */ },
};
```

这个对象通过全局变量挂载到 window/self。

------

### ② 启动时（Runtime Initialization）

Host 在执行时遇到 `import('remoteApp/Button')`：

1. Webpack Runtime 加载 `remoteEntry.js`；
2. 调用其中的 `init()` 方法；
3. Remote 把自己的 `sharedScope` （共享依赖信息）注入进来；
4. Host 与 Remote 协商共享模块 （例如 React)。

------

### ③ 使用时（Dynamic Module Loading）

当真正引用远程模块时：

1. Host 调用 `remoteApp.get('./Button')`；
2. 由 Remote 提供模块的工厂函数；
3. Webpack Runtime 执行这个工厂函数，返回模块实例；
4. 模块加载完成，像本地模块一样使用。

------

## 🔄 五、共享依赖机制（Share Scope）

跨应用模块引用最复杂的部分是依赖冲突。
Webpack 5 提供了一个全局共享表 `__webpack_share_scopes__`，
它记录所有 “共享依赖模块” 的版本、加载状态。

当多个应用都声明要共享同一个依赖（如 React）：

```
jsCopy
shared: {
  react: {
    singleton: true,
    requiredVersion: '^18.0.0',
  },
}
```

运行时会通过语义化版本判断：

- ✅ 若版本兼容 ⇒ 只保留一个 React 实例；
- ❌ 若不兼容 ⇒ 各自使用自己的版本；
- 🚫 若启用了 `strictVersion` 且不匹配 ⇒ 报错。

这样做能避免「多个 React 副本导致 hooks 失效」这类问题。

------

## 🪄 六、依赖关系图示（简化）

```
plaintextCopy
Host runtime ─┐
               ├── 加载 remoteEntry.js（远程清单）
               ├── 注册 sharedScope（共享依赖）
               ├── remoteApp.get('./Button') → 远程模块工厂
               └── 执行模块工厂 → 得到 React 组件实例
```

整个过程就像动态 import 加上依赖共享机制。

------

## 🔧 七、关键运行时代码组件

Webpack 在运行时生成了一些特殊函数：

| 函数                             | 作用             |
| :------------------------------- | :--------------- |
| `__webpack_init_sharing__`       | 初始化共享空间   |
| `__webpack_share_scopes__`       | 存储共享依赖     |
| `__webpack_require__.federation` | 动态拉取远程模块 |
| `remoteContainer.get(module)`    | 返回模块工厂函数 |
| `remoteContainer.init(scope)`    | 初始化共享       |

这些 runtime 片段由 Webpack 自动注入，不需要人工维护。

------

## 🧩 八、生命周期小结

| 阶段         | 行为                                |
| :----------- | :---------------------------------- |
| 构建阶段     | 各应用独立打包，生成 remoteEntry    |
| 启动阶段     | Host 初始化共享依赖表               |
| 加载阶段     | Host 动态加载 remoteEntry           |
| 模块请求阶段 | Host 调用 remote.get() 获取模块工厂 |
| 实例化阶段   | 执行模块工厂，导出模块内容          |

------

## 🚀 九、优点

| 优点                 | 说明                     |
| :------------------- | :----------------------- |
| 🔗 跨项目代码真正共享 | 运行时加载，不需重新打包 |
| 🧱 独立部署           | Remote 可单独发布        |
| 🧠 智能依赖共享       | 减少重复包体积           |
| ⚙️ 灵活               | 任意组合 Host/Remote     |
| 💡 支持懒加载         | 按需 import，性能好      |

------

## ⚠️ 十、几个容易误解的点

| 误区                        | 正解                                                    |
| :-------------------------- | :------------------------------------------------------ |
| “模块是打包好的静态文件？”  | ❌ 实际是运行时动态加载                                  |
| “共享依赖自动合并？”        | ❌ 需要手动声明 `shared`                                 |
| “版本自动匹配？”            | ✅ 有 semver 检查机制，但不强制，除非 strictVersion:true |
| “Remote 必须运行在同源域？” | ❌ 只要能请求到 remoteEntry.js 即可                      |

------

## 🧠 十一、整体架构示意（简化）

```
plaintextCopy
               ┌──────────────────────┐
               │  Remote Application  │
               │  (exposes modules)   │
               └──────────┬───────────┘
                          │
        remoteEntry.js ←──┘
                          │
 ┌───────────────┐       ↓
 │ Host App      │  动态加载
 │ (uses remote) │────────────► 共享依赖注册 → 远程模块执行
 └───────────────┘
```

------

## ✅ 十二、一句话总结

> Webpack 5 的模块联邦原理：
> 在运行时，通过一个「远程模块清单 (remoteEntry.js)」动态加载别的构建导出的模块，
> 并通过全局共享表（ shareScopes ）协调依赖版本，从而实现跨应用依赖共享和动态加载。

------

### 💡 记忆口诀

> 🧩 Compile 时划边界，
> 🌐 Runtime 时建联邦，
> 🤝 Shared Scope 管冲突。

------

如果你想，我可以帮你画一张「Module Federation Host ⇄ Remote 交互流程图」，
展示从代码 import 到远程模块实际执行时的调用链，全图可视化理解这个机制，要吗？

好的 👍！下面是一张文字版的概念图 （适合理解 Webpack 5 Module Federation Host 与 Remote 在运行时的交互过程）
我会把整个链路画成顺序结构，你能直观看出 Runtime 的调用顺序：

------

```
plaintextCopy
                ┌───────────────────────────────┐
                │         Remote 应用            │
                │  ──────────────────────────   │
                │  1. exposes:                 │
                │     './Button' -> ./src/Button|
                │                               │
                │  2. 打包生成                  │
                │     remoteEntry.js            │
                │     ↓                         │
                │  其中导出：                   │
                │     self["remoteApp"] = {     │
                │       get: (m)=>模块工厂，      │
                │       init: (scope)=>初始化共享，│
                │     }                         │
                └──────────────┬────────────────┘
                               │ (HTTP 资源暴露）
                               │
                               ▼
              ┌────────────────────────────────────┐
              │           Host 应用                │
              │  ───────────────────────────────    │
              │  import("remoteApp/Button")   🔽   │
              │  模块联邦运行时流程：               │
              │                                   │
              │  ① 调用 __webpack_init_sharing__() │
              │     → 初始化本地 sharedScope       │
              │                                   │
              │  ② 通过 <script> 动态加载          │
              │     http://.../remoteEntry.js     │
              │                                   │
              │  ③ remoteEntry 执行后注册全局容器 │
              │     window["remoteApp"]           │
              │                                   │
              │  ④ 调用 remoteApp.init(scope)     │
              │     → 共享依赖（如 React）         │
              │                                   │
              │  ⑤ 调用 remoteApp.get("./Button") │
              │     → 返回对应模块的工厂函数       │
              │                                   │
              │  ⑥ 运行工厂函数，生成模块实例     │
              │     → 相当于执行 Button 代码       │
              │                                   │
              │  ⑦ 模块加入本地依赖图，可正常使用 │
              │     import Button from 'remoteApp/Button'
              │                                   │
              └────────────────────────────────────┘

共享依赖说明：
────────────────────────────────────────────
• Host 初始化自己的 sharedScope，例如 {react@18.2.0}
• Remote init() 时把自身 shareScope 注入
• Webpack runtime 比较版本：
    - 若 Host 与 Remote 的 React 兼容 → 共用同一份实例
    - 若不兼容 → 各自独立加载
────────────────────────────────────────────


运行流总结：
────────────
Host import → 加载 remoteEntry → 初始化共享 → get() 模块工厂 → 执行工厂函数 → 得到组件实例
```

------

### 🧭 从上图你可以记住核心的五步

| 步骤 | 行为                         | 描述                              |
| :--- | :--------------------------- | :-------------------------------- |
| ①    | `__webpack_init_sharing__()` | 初始化 Host 的共享依赖表          |
| ②    | 动态加载 `remoteEntry.js`    | 拿到远程模块清单                  |
| ③    | `remoteApp.init()`           | 注册共享依赖（Shared Scope 协商） |
| ④    | `remoteApp.get(module)`      | 拉取远程模块工厂函数              |
| ⑤    | 执行模块工厂函数             | 真正实例化远程组件/模块           |

------

简单记忆：

> 🧩 build 时 「发布 remoteEntry」
> 🌐 run 时 「Host 动态加载 + 联邦共享 + get 模块」

------

如果你想继续深入理解「shareScope 里是怎么存 React 实例的」、「版本冲突时会怎样选」，我可以再帮你画一张“shareScope 结构与版本协商流程”图，让你把这个 runtime 机制看得一清二楚，要不要我接着画那张？





要



太好了 👍
这是 Webpack 5 Module Federation 运行时 shareScope（共享依赖表） 的机制示意图。

这张图帮你看清：

> 「React 等共享依赖是如何存进表里、Remote 使用时怎么查、版本冲突时谁优先」。

------

```
plaintextCopy
🧩 共享依赖表结构概览
───────────────────────────────────────
Webpack runtime 会维护全局对象：
__webpack_share_scopes__ = {
  default: {
    react: {
      '18.2.0': { get: ()=> moduleFactory, loaded: true, from: 'host' },
      '17.0.2': { get: ()=> moduleFactory, loaded: true, from: 'remoteA' }
    },
    lodash: {
      '4.17.21': { get: ()=> moduleFactory, loaded: true, from: 'host' }
    }
  }
}

键说明：
• 第一层 key → 共享作用域名（scope），通常是 "default"
• 第二层 key → 共享模块名（包名）
• 第三层 key → 版本号
• 内容 → 存储该模块的工厂函数和信息
───────────────────────────────────────


🔁 初始化阶段（Host）
───────────────────────────────────────
Host 启动时：
1. 运行 __webpack_init_sharing__('default')
2. 创建 shareScope.default = {}
3. 注册自己声明的 shared 模块，例如：

   shared: {
     react: {
       singleton: true,
       requiredVersion: '^18.0.0'
     },
     lodash: { singleton: true }
   }

✅ 初始化后：
__webpack_share_scopes__.default = {
  react: { '18.2.0': { from: 'host', get: ()=>factory } },
  lodash: { '4.17.21': { from: 'host', get: ()=>factory } }
}
───────────────────────────────────────


📡 远程应用 Remote 初始化阶段
───────────────────────────────────────
当 Host 动态加载 remoteEntry.js：

remoteApp.init(shareScope.default)

Remote 内部逻辑：
for （每一个 shared 模块） {
  比较版本关系；
  if (Host 没有该模块） → 注册自己版本；
  if (Host 有相同模块） {
    比较 semver：
      - 若兼容 → 使用 Host 的版本；
      - 若不兼容且 strictVersion=false → 各自保留版本；
      - 若不兼容且 strictVersion=true → 抛错；
  }
}
───────────────────────────────────────


⚙️ 版本协商过程（以 React 为例）
───────────────────────────────────────
Host 声明 react@18.2.0
Remote 声明 react@17.0.2  requiredVersion '^17.0.0'

应用加载顺序及结果：

① Host 启动 → 注册 React 18.2.0
② Remote.init() 执行 -> 发现 Host 有 React 18.2.0

比较 semver:
  • Host(18.2.0) 是否满足 remote 的 requiredVersion (^17.0.0)?
    ✅ 满足
  → Remote 复用 Host 的 React 实例。

若 remote 要求 '^18.3.0'
  ➡️ 18.2.0 不满足，
      - 若 strictVersion=false → Remote 用自己的 18.3.0；
      - 若 strictVersion=true → Runtime 报错。
───────────────────────────────────────


🧠 模块加载阶段
───────────────────────────────────────
当 Remote 的某个模块（如 Button）依赖 React 时：

1. 调用 __webpack_require__('react')
2. Webpack runtime 去 shareScope.default.react 查找：
     - 有 React@18.2.0 → 直接用 Host 已加载版本
3. 返回该共享实例 → 避免重复加载 → 保持单一上下文
───────────────────────────────────────


🎯 结果
───────────────────────────────────────
• 所有 Host + 各 Remote 应用共享同一 React 实例；
• 若版本不兼容可独立运行；
• strictVersion 可控制冲突策略。

───────────────────────────────────────
```

------

### ✅ 图文总结（逻辑流程）

```
plaintextCopy
        ┌──────────┐
        │  Host    │
        │ shareScope.default 注册 react@18.2.0
        └────┬─────┘
             │
  加载 remoteEntry.js
             │
             ▼
        ┌──────────┐
        │  Remote  │
        │  声明 react@17.0.2 required:^17.0.0
        └────┬─────┘
             │ 初始化共享
             ▼
比较版本 → Host 满足版本条件
复用 Host 的 React 实例 ✅
```

------

### 🧭 一句话总结

> shareScope 是 Webpack Module Federation 运行时的“共享依赖全局表”。
> Host 在启动时注册自己的依赖，Remote 在 `init()` 阶段向其注入自己的依赖。
>
> - 若版本兼容：Remote 直接用 Host 的依赖；
> - 若不兼容：可并存或报错（依据 `strictVersion`）。
>
> ✅ 从而确保跨应用的依赖共享和版本协商机制。

------

如果你想，我可以下一步帮你画出「Host + 两个 Remote」同时协商共享的示意图（多版本在 shareScope 中共存的情况），看清多个 remote 各自持有不同版本如何在同一个 runtime 共存，你要不要看这一张？





要



太好了 👍 我们继续！下面这张图展示的是 一个 Host 应用 同时加载 两个 Remote 应用 时，
`shareScope` 如何处理同一个依赖（比如 React）存在多个版本的情况。

------

```
plaintextCopy
🧩 多 Remote 环境下的共享依赖结构示意
───────────────────────────────────────────────

全局共享表（Host 创建）
__webpack_share_scopes__ = {
  default: {
    react: {
      '18.2.0': { from: 'host', get: ()=>factory, loaded: true }
    }
  }
}

───────────────────────────────────────────────
1️⃣  Host 启动阶段
───────────────────────────────────────────────
Host 声明：
shared: { react: { singleton: true, requiredVersion: '^18.0.0' } }

→ 注册 react@18.2.0 到 shareScope.default

内存状态：
{
  default: {
    react: { '18.2.0': { from:'host' } }
  }
}

───────────────────────────────────────────────
2️⃣  RemoteA 初始化
───────────────────────────────────────────────
RemoteA 声明：
shared: { react: { singleton: true, requiredVersion: '^18.0.0' } }

步骤：
• 调用 remoteA.init(shareScope.default)
• RemoteA 检查 Host 的 shareScope 是否有 React
• Host 已提供 18.2.0，满足 ^18.0.0 → ✅ 复用 Host 的版本

结果：
shareScope.default.react = {
  '18.2.0': { from:'host' }
}
RemoteA 复用 Host 的 React 实例

───────────────────────────────────────────────
3️⃣  RemoteB 初始化
───────────────────────────────────────────────
RemoteB 声明：
shared: {
  react: { singleton:false, requiredVersion: '^17.0.0' },
  lodash: { singleton:true, requiredVersion: '^4.17.0' }
}

步骤：
• 调用 remoteB.init(shareScope.default)
• 检测 React 版本：
   - Host 对应 18.2.0
   - requiredVersion：^17.0.0 → 不兼容 ❌
• 因为 singleton:false → 可并存
  → RemoteB 将自己的 17.0.2 注册到 shareScope

结果：
shareScope.default.react = {
  '18.2.0': { from:'host' },
  '17.0.2': { from:'remoteB' }
}

此时 shareScope 里共存两个 React 版本！

───────────────────────────────────────────────
4️⃣  模块加载时版本选择
───────────────────────────────────────────────
当某模块执行 require('react')：

规则：
1. 先看当前构建自身声明的 requiredVersion；
2. 在 shareScope.default.react 表中找到符合版本的最高版本；
3. 加载该版本的工厂函数并缓存。

例：
• Host / RemoteA 组件 → 找到 18.2.0 ✅
• RemoteB 内部模块 → 找到 17.0.2 ✅

即使 Host 与 RemoteB 不兼容，它们仍可各自运行自己的 React。

───────────────────────────────────────────────
5️⃣  内存共享表最终形态
───────────────────────────────────────────────
__webpack_share_scopes__.default = {
  react: {
    '18.2.0': { from: 'host', get: ()=>React18Factory },
    '17.0.2': { from: 'remoteB', get: ()=>React17Factory }
  },
  lodash: {
    '4.17.21': { from: 'remoteB', get: ()=>LodashFactory }
  }
}

───────────────────────────────────────────────
```

------

### ✅ 结果总结

| 模块           | 版本    | 来源           | 被谁使用 |
| :------------- | :------ | :------------- | :------- |
| React 18.2.0   | host    | host、remoteA  |          |
| React 17.0.2   | remoteB | remoteB        |          |
| Lodash 4.17.21 | remoteB | 所有需要的模块 |          |

------

### 🌐 版本协商逻辑（简化版伪代码）

```
jsCopy
function registerShared(pkg, version, factory, options, from) {
  const scope = __webpack_share_scopes__.default[pkg] ||= {};

  const existing = chooseBestVersion(scope, version, options.requiredVersion);

  if (!existing || !semverSatisfies(existing.version, version)) {
    scope[version] = { from, get: factory, loaded: true };
  }
}
```

关键点：

- singleton: true ⇒ 强制只存在一个实例；
- strictVersion: true ⇒ 不兼容时报错；
- singleton: false ⇒ 允许多版本共存。

------

### 📘 一图小结（逻辑结构）

```
plaintextCopy
Host ──┐
       │    shareScope.default
RemoteA├──▶ react@18.2.0  ← 复用
RemoteB└──▶ react@17.0.2  ← 独立
```

------

### 💡 一句话总结

> 多 Remote 注册时，Webpack 的 `shareScope` 会充当全局依赖表：
>
> - Host 先初始化；
> - 每个 Remote `init()` 时加入自己的依赖；
> - 对相同库使用 semver 算法版本协商；
> - singleton + 版本兼容 → 共用一份；
> - singleton:false 或不兼容 → 共存多版本。



是怎么加载 remoteEntry 文件的？



这个问题问得非常关键 🎯，
理解 Webpack 5 Module Federation 的核心运行机制——
“remoteEntry.js 是怎样被加载的？”
就等于真正理解了 Module Federation 的动态加载原理。

我们来完整拆开这个过程 👇

------

## 🧩 一、背景：remoteEntry.js 是什么

当你在 Remote 项目里定义：

```
jsCopy
new ModuleFederationPlugin({
  name: 'remoteApp',
  filename: 'remoteEntry.js',
  exposes: {
    './Button': './src/Button',
  },
});
```

Webpack 在构建时会生成一个额外文件：`remoteEntry.js`。
它不是普通 JS 模块，而是一个运行时代码清单，里面注册并导出远程容器（remote container）对象，比如：

```
jsCopy
self["remoteApp"] = {
  get: function (module) { … },
  init: function (shareScope) { … }
};
```

------

## ⚙️ 二、Host 端的配置

在 Host 工程的 `ModuleFederationPlugin` 里配置：

```
jsCopy
new ModuleFederationPlugin({
  name: 'host',
  remotes: {
    remoteApp: 'remoteApp@http://localhost:3001/remoteEntry.js',
  },
});
```

Webpack 在打包 Host 的时候，会生成一段运行时加载逻辑来处理这个远程声明。

------

## 🧠 三、import ('remoteApp/Button') 执行时发生了什么

当代码中出现：

```
jsCopy
import('remoteApp/Button')
```

Webpack 生成的 runtime 模块负责执行以下几步 👇

------

### 🔹 步骤 1 — 检查远程容器是否已加载

```
jsCopy
let container = __webpack_require__.f.remotes["remoteApp"];
if (!container) {
  // 动态加载 remoteEntry
}
```

Webpack runtime 先看 `remoteApp` 是否已注册在全局（`window.remoteApp`）。
如果未加载，它会去加载对应的 remoteEntry.js 脚本。

------

### 🔹 步骤 2 — 动态创建 `<script>` 请求 remoteEntry.js

运行时代码类似于：

```
jsCopy
var script = document.createElement('script');
script.src = "http://localhost:3001/remoteEntry.js";

script.onload = () => {
  // remoteEntry.js 加载完成后在全局注册 container
  var container = window["remoteApp"];
  resolve(container);
};

document.head.appendChild(script);
```

加载成功后，`window["remoteApp"]` 对象就会出现。

这一步其实就是 webpack runtime 的动态插入 script 标签机制。
Webpack 5 runtime 在内部用到 `__webpack_require__.l(url, callback)` 负责加载脚本。

------

### 🔹 步骤 3 — 执行 remoteEntry.js

当 remoteEntry.js 执行时，它会往 `window` 挂载一个模块容器对象：

```
jsCopy
self["remoteApp"] = {
  get: (module) => { … },
  init: (shareScope) => { … }
};
```

也就是注册了供外部使用的接口。

------

### 🔹 步骤 4 — 初始化共享依赖 (`init`)

Host runtime 调用：

```
jsCopy
await container.init(__webpack_share_scopes__.default);
```

把当前的共享依赖表（shareScope）传给远程容器。
这步让双方的共享依赖（如 React）可以协商版本。

------

### 🔹 步骤 5 — 请求远程模块 (`get`)

执行：

```
jsCopy
const factory = await container.get('./Button');
const Module = factory();
```

`get()` 返回的是一个“模块工厂函数”，
执行后就得到远程模块的实例内容（比如 Button 组件导出对象）。

------

### 🔹 步骤 6 — 后续缓存与复用

一旦 remoteEntry.js 加载并初始化，
Webpack 会缓存容器对象，之后再 import('remoteApp/xxx') 时不会重新加载脚本。

------

## 🔁 四、整体时序图简化版

```
plaintextCopy
Host 运行时
   │
   │ import("remoteApp/Button")
   │
   ▼
[检查]: window.remoteApp 是否存在？
   ├── 否 → 创建 <script src="remoteEntry.js">
   │           │
   │           ▼
   │    远程文件执行，注册 window.remoteApp
   │
   ▼
[调用] remoteApp.init(shareScope)
   │
   ▼
[调用] remoteApp.get('./Button')
   │
   ▼
[执行] 工厂函数 → 得到远程模块导出
```

------

## 🧩 五、关键运行时函数（Webpack 内置）

| 函数名                            | 作用                             |
| :-------------------------------- | :------------------------------- |
| `__webpack_require__.l(url, cb)`  | 动态插入 `<script>` 加载远程文件 |
| `__webpack_init_sharing__(scope)` | 初始化共享依赖表                 |
| `__webpack_share_scopes__`        | 全局共享依赖空间                 |
| `container.init(scope)`           | 远程容器初始化，建立共享         |
| `container.get(module)`           | 获取具体远程模块的工厂函数       |

------

## ⚙️ 六、加载失败与超时重试

Webpack 也会在 runtime 代码里处理加载失败：

```
jsCopy
script.onerror = () => {
  reject(new Error('Loading remote entry failed: ' + script.src));
};
```

有时（比如微前端应用首次访问）Remote 不可用，它就会抛出 “Loading remote failed” 的错误。

------

## ✅ 七、一句话总结

> 💡 remoteEntry.js 是通过 Webpack Runtime 动态创建 `<script>` 标签加载的远程入口文件。
>
> 加载过程是：
>
> 1. import ('remote/Module') 触发；
> 2. Webpack runtime 生成 `<script>` 加载远程入口；
> 3. 远程执行后注册全局容器；
> 4. Host 调用 `init()` 协商共享依赖；
> 5. 调用 `get()` 获取模块工厂，执行得到导出；
> 6. 缓存结果，后续直接复用。

------

如果你希望，我可以再帮你画一张「浏览器端完整加载过程图 （含 script 标签/全局注册/调用栈）」，
你能看到 runtime 里 `__webpack_require__.l()` 怎么一步步创建 script 并挂载到 head。要我画那一张吗？





要



好的 👍，下面这一张是浏览器端运行时加载 remoteEntry.js 的完整交互图，
帮助你直观理解「Webpack Runtime 如何动态插入 `<script>` 标签、注册远程容器并执行 get/init 流程」。

------

```
plaintextCopy
📦 Host 应用加载远程模块的完整过程
─────────────────────────────────────────────────────────

用户代码：
──────────────────────────────
import('remoteApp/Button')
──────────────────────────────

执行链（由 Webpack Runtime 自动生成）：
───────────────────────────────────────
     ▼
(1)  Webpack runtime 解析模块名：
     remoteApp/Button
     └─> 识别出 remote 容器（remoteApp) 与模块路径（。/Button)

     ▼
(2)  检查远程容器是否存在：
     if(!window["remoteApp"]) → 需要加载 remoteEntry.js

     ▼
(3)  调用内置函数 __webpack_require__.l()
     它会动态创建 <script> 节点：

         const script = document.createElement('script');
         script.src = 'http://remote-domain/remoteEntry.js';
         script.type = 'text/javascript';
         script.charset = 'utf-8';
         script.onerror = onScriptLoadError;
         script.onload  = onScriptLoadSuccess;
         document.head.appendChild(script);

     ▼
(4)  浏览器开始加载该 JS 文件；
     下载完成后执行 remoteEntry.js

     ▼
(5)  remoteEntry.js 内部执行以下注册逻辑：
         self["remoteApp"] = {
             get: (module) => { /* 模块工厂函数 */ },
             init: (scope) => { /* 初始化 shareScope */ }
         };

     → 在全局（window/self) 上挂上远程容器对象

     ▼
(6)  script.onload 回调触发
     runtime 发现 window["remoteApp"] 已存在

     ▼
(7)  调用  remoteApp.init(__webpack_share_scopes__.default)
         - 传递 Local Host 的共享依赖
         - Remote 注册或复用依赖版本
         - 构建全局共享依赖关系

     ▼
(8)  调用  remoteApp.get('./Button')
         - 取得远程模块工厂（factory)
         - 等价于一个返回模块导出的函数

     ▼
(9)  执行工厂函数：
         const ButtonModule = factory();
         导出组件或逻辑模块

     ▼
(10) Host 开始正常使用远程模块：

         ButtonModule.default.render(...);

─────────────────────────────────────────────────────────
💾 后续缓存与复用
─────────────────────────────────────────────────────────
• remoteEntry.js 已加载 → 下次 import 不再创建 <script>
• remoteApp 容器对象被缓存；
• remoteApp/Button 模块工厂在远程容器中也可缓存；
─────────────────────────────────────────────────────────


内核关键函数对应关系：
─────────────────────────────────────────────────────────
| 函数名                        | 作用 |
|-------------------------------|------|
| __webpack_require__.l(url,cb) | 动态加载远程 JS (script标签逻辑） |
| __webpack_require__.f.remotes | 缓存远程容器引用 |
| __webpack_init_sharing__()    | 初始化共享依赖空间 |
| remoteApp.init(scope)         | 注册共享依赖表 |
| remoteApp.get(module)         | 获取模块工厂函数 |
─────────────────────────────────────────────────────────
```

------

### 🧠 直观理解（简化流程示意）

```
plaintextCopy
Host import('remoteApp/Button')
     │
     ▼
[Webpack Runtime]
     ├─ 动态插入 <script src=remoteEntry.js>
     ├─ 等待加载成功 → window.remoteApp 出现
     ├─ 调用 remoteApp.init() 共享依赖
     ├─ 调用 remoteApp.get("./Button")
     └─ factory() → 模块实例化 → 得到组件导出
```

------

### ⚙️ 用户角度效果

- 第一次加载：浏览器网络面板会看到请求了远程应用的 `remoteEntry.js` 文件。
- 后续加载：不再重复请求，Webpack Runtime 缓存了容器对象。
- 错误处理：如果 remoteEntry.js 无法请求到，会触发 `onerror` 抛出 “Loading remote failed”。

------

### ✅ 一句话总结

> Webpack 5 Module Federation 加载 remoteEntry.js 的实质：
> 运行时通过 `__webpack_require__.l()` 动态创建 `<script>` 标签加载远程入口，
> 等远程脚本注册全局容器后，再调用 `init()` 建立共享作用域、 `get()` 拿模块工厂，
> 最终执行工厂函数得到远程模块实例。

------

是否希望我接着帮你画最后一张「错误和超时重试逻辑图」，展示加载 remoteEntry 失败时 runtime 是如何抛出错误和重试的？