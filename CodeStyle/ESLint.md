# 开发使用

ESLint 的初次配置可以参考 [Getting Started with ESLint](https://eslint.org/docs/latest/use/getting-started)。

编辑器自动显示 ESLint 结果可以参考 [Integrations](https://eslint.org/docs/latest/use/integrations)，第一次使用需要重启编辑器。

ESLint 是通过[解析器](https://eslint.org/docs/latest/use/configure/plugins#configure-a-parser)将代码转换为 ESLint 可以评估的抽象语法树。



## 针对 TypeScript

https://github.com/typescript-eslint/typescript-eslint



## 针对 React 框架

https://github.com/jsx-eslint/eslint-plugin-react



## pre-commit

https://segmentfault.com/a/1190000015862803



# 常见规则

[ESLint 内置规则](https://eslint.org/docs/latest/rules/) 

非 ESLint 推荐规则：

+ [indent](https://eslint.org/docs/latest/rules/indent)：强制执行一致的缩进风格，默认 4 个空格；

  ```json
  {
    "rules": {
      "indent": ["error", 2],
    }
  }
  ```

+ [quotes](https://eslint.org/docs/latest/rules/quotes)：强制要求统一使用反斜线、双引号或单引号，默认是双引号；

  ```json
  {
    "rules": {
      "indent": ["error", "single"],
    }
  }
  ```

+ [semi](https://eslint.org/docs/latest/rules/semi)：语句结尾处的分号的一致使用，默认是使用分号：

  ```json
  {
    "rules": {
      "indent": ["error", "never"],
    }
  }
  ```

  