# useState VS this.setState



# 更新策略

可以查看 React 开发者的回答 [why is `setState` asynchronous?](https://github.com/facebook/react/issues/11527#issuecomment-360199710) 



## 异步更新

一般情况下，setState 更新是异步的。这里的异步指的是 setState 方法调用后，并不能立马获取更新后的 state，**看起来像异步**一样：

```js
const [value, setValue] = useState(0);
console.log("render===========", value);

const handleClick = () => {
  setValue(value + 1);
  console.log("current value", value);
};

// current value 0
// render=========== 1
```

+ 可以看到 setValue 被调用后，输出的 value 是上一次 render 时的值。



如何获取更新后的 state 呢？一个简单的方法是先获取再更新：

```js
const handleClick = () => {
	const newValue = value + 1;
  setValue(newValue);
  console.log("current value", newValue);
};

// updated value 1
// render=========== 1
```

或者使用函数式更新：

```js
const handleClick = () => {
  setValue((prev) => {
    const newValue = prev + 1;
    console.log("updated value", newValue);
    return newValue;
  });
  console.log("current value", value);
};

// updated value 1
// current value 0
// render=========== 1
```



## 合并更新

setState 更新是异步的更深层的原因，是因为 React 为了减少无效的渲染有一个**合并更新机制 - batchUpdate**：将多次 setState 合并到一次进行渲染。



### 同个 state 合并

多次 setState 会被合并到一次进行渲染，但更新的方式不同会导致不同的解决：

```js
const handleClick = () => {
  setValue(value + 1);
  setValue(value + 1);
  setValue(value + 1);
};
// render=========== 1

const handleClick = () => {
  setValue((prev) => prev + 1);
  setValue((prev) => prev + 1);
  setValue((prev) => prev + 1);
};
// render=========== 3
```

+ 三次 setState 被合并成一次，只会触发一次渲染；
+ 参考源码 [processUpdateQueue](https://github.com/facebook/react/blob/5c56b873efb300b4d1afc4ba6f16acf17e4e5800/packages/react-server/src/ReactFizzClassComponent.js#L609) 
  + 如果是传入值更新，React 会对要更新的所有 state 进行对象合并，如果是对同一 state 的更新会被覆盖，最终只有最后一次调用生效；
  + 如果是函数式更新，React 会根据每个 setState 的调用顺序，依次将函数存入一个队列，在进行统一更新时按照队列顺序依次调用，并将上一次调用结束时产生的最新 state 传给下个调用函数中；
+ 当更新 state 时如果依赖先前的 state 值，或需要考虑异步更新的情况，建议使用函数式更新，以确保获取到最新的 state 值并避免潜在的问题。



#### React 18 更新

在 React 18 之前，默认情况下 `promise`、`setTimeout`、原生应用的事件处理程序以及任何其他事件中的 setState，由于丢失了上下文无法做合并处理；但[在 React 18 以后](https://zh-hans.react.dev/blog/2022/03/29/react-v18#new-feature-automatic-batching)，这些更新内容都会被自动合并处理。更多细节可以参考 [Automatic batching for fewer renders in React 18](https://github.com/reactwg/react-18/discussions/21)。

```js
// react 16
const handleClick = async () => {
  const data = await fetchData();
  setValue(value + 1);
  setValue(value + 1);
  setValue(value + 1);
};
// render=========== 1

const handleClick = async () => {
  const data = await fetchData();
  setValue((prev) => prev + 1);
  setValue((prev) => prev + 1);
  setValue((prev) => prev + 1);
};
// render=========== 1
// render=========== 2
// render=========== 3
```

+ 传入值的更新方式被合并成一次，只会触发一次渲染；
+ 函数式的更新方式没有被合并，触发了三次渲染。



如果在 React 18 中实现 setState 调用后立即重渲染，只需要用 [`flushSync`](https://zh-hans.react.dev/reference/react-dom/flushSync) 包裹：

```js
const handleClick = async () => {
  const data = await fetchData();
  ReactDOM.flushSync(() => {
    setValue((prev) => prev + 1);
  });
  ReactDOM.flushSync(() => {
    setValue((prev) => prev + 1);
  });
  ReactDOM.flushSync(() => {
    setValue((prev) => prev + 1);
  });
};
// render=========== 1
// render=========== 2
// render=========== 3
```

+ 开启这个特性的前提是，将 ReactDOM.render 替换为 ReactDOM.createRoot 调用方式；
+ `flushSync` 可能会严重影响性能，谨慎使用。



### 不同 state 合并

和上述一样



# Reference

+ [React中的setState的同步异步与合并](https://blog.csdn.net/wuyxinu/article/details/113902057) 
  + componentWillUpdate 和 componentDidUpdate 这两个生命周期中不能调用 setState，会造成死循环导致程序崩溃。
+ [React中setState的异步与合并](https://blog.csdn.net/qq_36647492/article/details/136395865) 
+ [CodeSandBox - React useState](https://codesandbox.io/dashboard/sandboxes/React/usState?workspace=f515a3a5-c31a-4315-b150-d8d5df24700a) 