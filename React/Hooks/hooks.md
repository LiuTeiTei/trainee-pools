[When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback) 

非必要场景无需使用 useMemo 和 useCallback：

+ 性能优化都是有代价的，使用前需要充分考虑优化带来的代价是否超过成本；
+ 组件再次渲染时，原始的函数会被 GC 回收并重新创建一个；而 useCallbak 不会被回收但也会重新创建一个，并且 React 会将其和旧的函数做关联来进行依赖比较；
+ useCallback 虽然带来了避免重复渲染的优化，但会造成额外的内存消耗和计算；而实际上一般的重复渲染开销很小，是不需要优化的；
+ 使代码更复杂，填入了错误的依赖项数组，难以完全掌握渲染时机。

什么时候使用 useMemo 和 useCallback：

+ 当渲染会花费大量时间时，例如重交互的图、表、动画等；
+ 避免计算成本很高的函数被重复调用。