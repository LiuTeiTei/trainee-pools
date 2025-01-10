[React.memo() 和 useMemo() 的用法和区别](https://juejin.cn/post/6991837003537088542) 

+ 在 React 函数组件中，当组件中的 props 发生变化时，默认情况下整个组件都会重新渲染。 

  + 换句话说，如果组件中的任何值更新，整个组件将重新渲染，包括尚未更改其 values/props 的函数/组件。
  + [CodeSandBox-nomemo](https://codesandbox.io/p/sandbox/no-memo-sx2k8q) 

+ React.memo()

  + 高阶组件 HOC；

  + 它接收一个组件 A 作为参数并返回一个组件 B，如果组件 B 的 props 或其中的值没有改变，则组件 B 会阻止组件 A 重新渲染 ：

    ```js
    const MemoizedComponent = React.memo(Component);
    ```

  + 用于优化函数组件的性能，它可以记忆组件的渲染结果，并在组件的 props 没有改变时，直接返回之前缓存的结果，从而避免不必要的重渲染。

  + [CodeSandBox-React.memo](https://codesandbox.io/p/sandbox/memo-m3w539) 

+ [React.useMemo()](https://zh-hans.react.dev/reference/react/useMemo) 

  + React Hook；

  + 它接收一个回调函数和一个依赖数组作为参数，并返回回调函数的计算结果，当依赖数组发生变化时，会重新计算并返回新的结果，否则会直接返回之前缓存的结果：

    ```js
    const memoizedValue = useMemo(callback, dependencies);
    ```

  + 用于在函数组件中缓存计算结果，返回记忆值来避免函数的依赖项没有改变的情况下重新渲染。

  + [CodeSandBox-React.useMemo](https://codesandbox.io/p/sandbox/usememo-vgn7j8) 