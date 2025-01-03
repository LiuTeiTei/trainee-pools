## 使用场景

+ 有时需要树中的许多组件以及不同的嵌套级别可以访问相同的数据。 Context 允许您将此类数据 “广播” 到下面的所有组件并对其进行更改。 
+ 当一些数据需要在**不同的嵌套级别**上被**许多**组件访问时，首先考虑使用 Context 。 
  + 请谨慎使用它，因为它使组件重用更加困难。
  + 如果您只想避免在多个级别上传递一些 props ，那么组件组合通常比 Context 更简单。
+ 在典型的 React 应用程序中，数据通过 props 自上而下（父到子）传递，但对于应用程序中许多组件所需的某些类型的 props（例如环境偏好,UI主题），这可能很麻烦。 上下文(Context) 提供了在组件之间共享这些值的方法，而不必在树的每个层级显式传递一个 prop 。



## API

### `React.createContext`

+ ```jsx
  const MyContext = React.createContext(defaultValue);
  ```

+ 创建一个 Context 对象对。

+ 当 React 渲染订阅这 个Context 对象的组件时，它将从组件树中匹配最接近的 `Provider` 中读取当前的 context 值。

  + 也就是说如果有下面三个组件：`ContextA.Provider->A->ContexB.Provider->B->C`
  + 如果 ContextA 和 ContextB 提供了相同的方法，则 C 组件只会选择 ContextB 提供的方法。

+ defaultValue 参数仅当 consumer 在树中没有匹配的 Provider 时使用它。这有助于在不封装它们的情况下对组件进行测试。注意：将 `undefined` 作为 Provider(提供者) 值传递不会导致 consumer 组件使用 `defaultValue` 。

  + 默认值一般只有在对组件进行单元测试（组件并未嵌入到父组件中）的时候，比较有用。

### `Context.Provider`

+ ```jsx
  <MyContext.Provider value={/* some value */}>
  ```

+ 每个 Context 对象都附带一个 Provider React 组件，允许 consumer 组件来订阅 context 的改变。

+ 接受一个 `value` 属性传递给使用组件，这个 consumer 组件 为 Provider 的后代组件 。一个 Provider 可以连接到许多 consumers 。Provider可以被嵌套以覆盖树中更深层次的值。

+ 每当 Provider 的 `value` 属性发生变化时，所有作为 Provider 后代的 consumer 组件都将重新渲染。 从Provider 到其后代使用者的传播不受 `shouldComponentUpdate` 方法的约束，因此即使祖先组件退出更新，也会更新 consumer。

+ 通过使用与 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description) 相同的算法，比较新旧值来确定更改。

### `Class.contextType`

+ ```jsx
  class MyClass extends React.Component {
    componentDidMount() {
      let value = this.context;
      /* perform a side-effect at mount using the value of MyContext */
    }
    componentDidUpdate() {
      let value = this.context;
      /* ... */
    }
    componentWillUnmount() {
      let value = this.context;
      /* ... */
    }
    render() {
      let value = this.context;
      /* render something based on the value of MyContext */
    }
  }
  MyClass.contextType = MyContext;
  
  ===========================================================================
  
  class MyClass extends React.Component {
    static contextType = MyContext;
    render() {
      let value = this.context;
      /* render something based on the value */
    }
  }
  ```

+ 可以为类上的 `contextType` 属性分配由 [`React.createContext()`](https://react.html.cn/docs/context.html#reactcreatecontext) 创建的 Context 对象。 这允许您使用 `this.context` 使用该 Context 类型 的最近的当前值。 您可以在任何生命周期方法中引用它，包括 render 函数。

+ 只能使用这个 API 订阅单个上下文。

### `Context.Consumer`

+ ```jsx
  <MyContext.Consumer>
    {value => /* render something based on the context value */}
  </MyContext.Consumer>
  ```

+ 一个可以订阅 context 变化的 React 组件。 这允许您订阅 [函数式组件](https://react.html.cn/docs/components-and-props.html#function-and-class-components) 中的 context 。

+ 需要接收一个 [函数作为子节点](https://react.html.cn/docs/render-props.html#using-props-other-than-render)。 该函数接收当前 context 值并返回一个 React 节点。 传递给函数的 `value` 参数将等于组件树中上层这个 context 最接近的 Provider 的 `value` 属性。 如果上层没有提供这个 context 的 Provider ，`value` 参数将等于传递给 `createContext()` 的 `defaultValue` 。

### `Context.displayName`

+ ```jsx
  const MyContext = React.createContext(/* some value */);
  MyContext.displayName = 'MyDisplayName';
  
  <MyContext.Provider> // "MyDisplayName.Provider" 在 DevTools 中
  <MyContext.Consumer> // "MyDisplayName.Consumer" 在 DevTools 中
  ```

+ 上述组件在 DevTools 中将显示为 MyDisplayName。

+ context 对象接受一个名为 `displayName` 的 property，类型为字符串。React DevTools 使用该字符串来确定 context 要显示的内容。

### `useContext`

+ ```jsx
  const value = useContext(MyContext);
  ```

  + 接收一个 context 对象（`React.createContext` 的返回值）并返回该 context 的当前值。当前的 context 值由上层组件中距离当前组件最近的 `<MyContext.Provider>` 的 `value` prop 决定。
  + 当组件上层最近的 `<MyContext.Provider>` 更新时，该 Hook 会触发重渲染，并使用最新传递给 `MyContext` provider 的 context `value` 值。即使祖先使用 [`React.memo`](https://zh-hans.reactjs.org/docs/react-api.html#reactmemo) 或 [`shouldComponentUpdate`](https://zh-hans.reactjs.org/docs/react-component.html#shouldcomponentupdate)，也会在组件本身使用 `useContext` 时重新渲染。
  + 别忘记 `useContext` 的参数必须是 **context 对象本身**：
    + 正确： `useContext(MyContext)`
    + 错误： `useContext(MyContext.Consumer)`
    + 错误： `useContext(MyContext.Provider)` 
  + 父子组件不在一个目录中，如何共享 `MyContext` 这个 Context 实例呢？一般这种情况下，通过 Context Manager 统一管理上下文的实例，然后通过 `export` 将实例导出，在子组件中在将实例 `import` 进来。
  + 调用了 `useContext` 的组件总会在 context 值变化时重新渲染。如果重渲染组件的开销较大，可以 [通过使用 memoization 来优化](https://github.com/facebook/react/issues/15156#issuecomment-474590693)。

+ ```jsx
  onst themes = {
    light: {
      foreground: "#000000",
      background: "#eeeeee"
    },
    dark: {
      foreground: "#ffffff",
      background: "#222222"
    }
  };
  
  const ThemeContext = React.createContext(themes.light);
  
  function App() {
    return (
      <ThemeContext.Provider value={themes.dark}>
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
  
  function Toolbar(props) {
    return (
      <div>
        <ThemedButton />
      </div>
    );
  }
  
  function ThemedButton() {
    const theme = useContext(ThemeContext);
    return (
      <button style={{ background: theme.background, color: theme.foreground }}>
        I am styled by theme context!
      </button>
    );
  }
  ```
  + `useContext(MyContext)` 相当于 class 组件中的 `static contextType = MyContext` 或者 `<MyContext.Consumer>`。
  + `useContext(MyContext)` 只是让你能够读取 context 的值以及订阅 context 的变化。你仍然需要在上层组件树中使用 `<MyContext.Provider>` 来为下层组件*提供* context。



## 示例

### 静态 Context

+ ```jsx
  // Context lets us pass a value deep into the component tree
  // without explicitly threading it through every component.
  // Create a context for the current theme (with "light" as the default).
  const ThemeContext = React.createContext('light');
  
  class App extends React.Component {
    render() {
      // Use a Provider to pass the current theme to the tree below.
      // Any component can read it, no matter how deep it is.
      // In this example, we're passing "dark" as the current value.
      return (
        <ThemeContext.Provider value="dark">
          <Toolbar />
        </ThemeContext.Provider>
      );
    }
  }
  
  // A component in the middle doesn't have to
  // pass the theme down explicitly anymore.
  function Toolbar(props) {
    return (
      <div>
        <ThemedButton />
      </div>
    );
  }
  
  class ThemedButton extends React.Component {
    // Assign a contextType to read the current theme context.
    // React will find the closest theme Provider above and use its value.
    // In this example, the current theme is "dark".
    static contextType = ThemeContext;
    render() {
      return <Button theme={this.context} />;
    }
  }
  ```

### 动态 Context

+ **theme-context.js**

  + ```jsx
    export const themes = {
      light: {
        foreground: '#000000',
        background: '#eeeeee',
      },
      dark: {
        foreground: '#ffffff',
        background: '#222222',
      },
    };
    
    export const ThemeContext = React.createContext(
      themes.dark // default value
    );
    ```

+ **themed-button.js**

  + ```jsx
    import {ThemeContext} from './theme-context';
    
    class ThemedButton extends React.Component {
      render() {
        let props = this.props;
        let theme = this.context;
        return (
          <button
            {...props}
            style={{backgroundColor: theme.background}}
          />
        );
      }
    }
    ThemedButton.contextType = ThemeContext;
    
    export default ThemedButton;
    ```

+ **app.js**

  + ```jsx
    mport {ThemeContext, themes} from './theme-context';
    import ThemedButton from './themed-button';
    
    // An intermediate component that uses the ThemedButton
    function Toolbar(props) {
      return (
        <ThemedButton onClick={props.changeTheme}>
          Change Theme
        </ThemedButton>
      );
    }
    
    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          theme: themes.light,
        };
    
        this.toggleTheme = () => {
          this.setState(state => ({
            theme:
              state.theme === themes.dark
                ? themes.light
                : themes.dark,
          }));
        };
      }
    
      render() {
        // The ThemedButton button inside the ThemeProvider
        // uses the theme from state while the one outside uses
        // the default dark theme
        return (
          <Page>
            <ThemeContext.Provider value={this.state.theme}>
              <Toolbar changeTheme={this.toggleTheme} />
            </ThemeContext.Provider>
            <Section>
              <ThemedButton />
            </Section>
          </Page>
        );
      }
    }
    
    ReactDOM.render(<App />, document.root);
    ```

### 从嵌套组件更新 context

+ 我们通常需要从组件树中深层嵌套组件中更新 context。在这种情况下，您可以在 context 中向下传递一个函数，以允许 Consumer 更新 context ：

+ **theme-context.js**

  + ```jsx
    // Make sure the shape of the default value passed to
    // createContext matches the shape that the consumers expect!
    export const ThemeContext = React.createContext({
      theme: themes.dark,
      toggleTheme: () => {},
    });
    ```

+ **theme-toggler-button.js**

  + ```jsx
    import {ThemeContext} from './theme-context';
    
    function ThemeTogglerButton() {
      // The Theme Toggler Button receives not only the theme
      // but also a toggleTheme function from the context
      return (
        <ThemeContext.Consumer>
          {({theme, toggleTheme}) => (
            <button
              onClick={toggleTheme}
              style={{backgroundColor: theme.background}}>
              Toggle Theme
            </button>
          )}
        </ThemeContext.Consumer>
      );
    }
    
    export default ThemeTogglerButton;
    ```

+ **app.js**

  + ```jsx
    import {ThemeContext, themes} from './theme-context';
    import ThemeTogglerButton from './theme-toggler-button';
    
    class App extends React.Component {
      constructor(props) {
        super(props);
    
        this.toggleTheme = () => {
          this.setState(state => ({
            theme:
              state.theme === themes.dark
                ? themes.light
                : themes.dark,
          }));
        };
    
        // State also contains the updater function so it will
        // be passed down into the context provider
        this.state = {
          theme: themes.light,
          toggleTheme: this.toggleTheme,
        };
      }
    
      render() {
        // The entire state is passed to the provider
        return (
          <ThemeContext.Provider value={this.state}>
            <Content />
          </ThemeContext.Provider>
        );
      }
    }
    
    function Content() {
      return (
        <div>
          <ThemeTogglerButton />
        </div>
      );
    }
    
    ReactDOM.render(<App />, document.root);
    ```

### 使用多个 context

+ 为了保持 context 的快速重新渲染，React 需要使每个 context Consumer 成为树中的一个独立节点。

+ ```jsx
  / Theme context, default to light theme
  const ThemeContext = React.createContext('light');
  
  // Signed-in user context
  const UserContext = React.createContext({
    name: 'Guest',
  });
  
  class App extends React.Component {
    render() {
      const {signedInUser, theme} = this.props;
  
      // App component that provides initial context values
      return (
        <ThemeContext.Provider value={theme}>
          <UserContext.Provider value={signedInUser}>
            <Layout />
          </UserContext.Provider>
        </ThemeContext.Provider>
      );
    }
  }
  
  function Layout() {
    return (
      <div>
        <Sidebar />
        <Content />
      </div>
    );
  }
  
  // A component may consume multiple contexts
  function Content() {
    return (
      <ThemeContext.Consumer>
        {theme => (
          <UserContext.Consumer>
            {user => (
              <ProfilePage user={user} theme={theme} />
            )}
          </UserContext.Consumer>
        )}
      </ThemeContext.Consumer>
    );
  }
  ```

### useContext 的使用

+ **context-manager.js**

  + ```jsx
    import React from 'react';
    
    export const MyContext = React.createContext(null);
    ```

  + 创建一个上下文管理的组件，用来统一导出 Context 实例

+ **父组件 Provider 提供上下文 value** 

  + ```jsx
    import React, { useReducer } from 'react';
    import Child from './Child';
    import { MyContext } from './context-manager';
    
    const initState = { count: 0, step: 0, number: 0 };
    
    const reducer = (state, action) => {
        switch (action.type) {
            case 'stepInc': return Object.assign({}, state, { step: state.step + 1 });
            case 'numberInc': return Object.assign({}, state, { number: state.number + 1 });
            case 'count': return Object.assign({}, state, { count: state.step + state.number });
            default: return state;
        }
    }
    
    export default (props = {}) => {
        const [state, dispatch] = useReducer(reducer, initState);
        return (
            <MyContext.Provider value={{ state, dispatch }}>
                <button onClick={() => { dispatch({ type: 'stepInc' }) }}>parent step ++</button>
                <Child />
            </MyContext.Provider>
        );
    }
    ```

  + 父组件引入了实例，并且通过 `MyContext.Provider` 将父组件包装，并且通过 `Provider.value` 将方法提供出去。

+ **子组件 useContext 解析上下文**

  + ```jsx
    import React, { useContext, useMemo } from 'react';
    
    import { MyContext } from './context-manager';
    
    export default (props = {}) => {
        const { state, dispatch } = useContext(MyContext);
        return useMemo(() => {
            return (
                <div>
                    <p>step is : {state.step}</p>
                    <p>number is : {state.number}</p>
                    <p>count is : {state.count}</p>
                    <hr />
                    <div>
                        <button onClick={() => { dispatch({ type: 'stepInc' }) }}>step ++</button>
                        <button onClick={() => { dispatch({ type: 'numberInc' }) }}>number ++</button>
                        <button onClick={() => { dispatch({ type: 'count' }) }}>number + step</button>
                    </div>
                </div>
            )
        }, [state.count, state.number, state.step, dispatch]);
    }
    ```

  + 需要从 `context-manager` 中引入 MyContext 这个实例，然后才能通过 `const { state, dispatch } = useContext(MyContext);` 解析出上下文中的状态和方法，在子组件中则可以直接使用这些状态和方法，修改父组件的 state。

  + `React.memo` 只会对 props 进行浅比较，而通过 Context 我们直接将 state 注入到了组件内部，因此 state 的变化必然会触发 re-render，整个 state 变化是绕过了 `memo`。如果函数组件被 `React.memo` 包裹，且其实现中拥有 useState 或 useContext 的 Hook，当 context 发生变化时，它仍会重新渲染。

  +  `React.memo()` 无法拦截注入到 Context 的 state 的变化，需要在组件内部进行更细粒度的性能优化，这个时候可以使用 `useMemo()` 。



## 注意事项

+ 无意义的重新渲染

  + ```jsx
    class App extends React.Component {
      render() {
        return (
          <Provider value={{something: 'something'}}>
            <Toolbar />
          </Provider>
        );
      }
    }
    ```

  + 因为 context 使用引用标识来确定何时重新渲染，当 Provider(提供者) 的父节点重新渲染时，有一些陷阱可能触发 Consumer(使用者) 无意渲染。例如，下面的代码将在每次 Provider(提供者) 重新渲染时，会重新渲染所有 Consumer(使用者) ，因为总是为 `value` 创建一个新对象。

  + 为了防止这样, 提升 `value` 到父节点的 state 里：

  + ```jsx
    class App extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          value: {something: 'something'},
        };
      }
    
      render() {
        return (
          <Provider value={this.state.value}>
            <Toolbar />
          </Provider>
        );
      }
    }
    ```



## Reference Links

[React 官方文档：上下文(Context)](https://zh-hans.reactjs.org/docs/context.html) 

[React Hook 中 createContext & useContext 跨组件透传上下文与性能优化](http://www.ptbird.cn/react-createContex-useContext.html) 