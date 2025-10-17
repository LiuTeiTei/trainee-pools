MCP 相关

+ [Inside MCP: A Protocol for AI Integration](https://www.promptfoo.dev/blog/understanding-mcp/)

+ [MCP (Model Context Protocol) Provider](https://www.promptfoo.dev/docs/providers/mcp/)
+ [Using MCP (Model Context Protocol) in Promptfoo](https://www.promptfoo.dev/docs/integrations/mcp/)



查看结果

+ [Using the web viewer](https://www.promptfoo.dev/docs/usage/web-ui/)



断言

+ 使用 js 脚本断言：[Javascript assertions](https://www.promptfoo.dev/docs/configuration/expected-outputs/javascript)
+ 断言基本用法：[Assertions & metrics](https://www.promptfoo.dev/docs/configuration/expected-outputs/)



Provider

+ 脚本：[Custom scripts](https://www.promptfoo.dev/docs/providers/custom-script/)

  + ```yaml
    providers:
      - 'exec: python3 claude_wrapper.py'
    ```

  + 不能直接写指令，例如 claude，一定要用脚本包裹一下

  + 不能有 id，只能是上述这个形式，一定要用 `''` 包裹起来

+ 脚本：[Javascript Provider](https://www.promptfoo.dev/docs/providers/custom-api/)

  + ```yaml
    providers:
      - file://scripts/dynamic-claude-provider.js
    ```

  + js 构造函数中一定要有 `id` 和 `callApi` 方法



一些设置

+ PROMPTFOO_ASSERTIONS_MAX_CONCURRENCY
  + 同时跑多少个测试
  + 设置为 1 时是想让测试同步完成，但实际上 extensions 的 beforeEach 脚本是一起完成的