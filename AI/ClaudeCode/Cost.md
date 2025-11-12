[Tracking Costs and Usage](https://docs.claude.com/en/api/agent-sdk/cost-tracking)

+ 同一轮对话中共享同一个 message.id，共享 usage，算一次花费
+ 有时有 bug，usgae 可能不一样，按最后一个为准
+ 总价格 total_cost_usd 最准
+ 算花费的那条 session 是 message.type === 'assistant'，message.type === 'user' 是输入，输出就是当前的 message，可能是一段话，可能是一个工具的调用。
+ 一个工具的花费一般分成两步骤，一步是上一个 session 的输出（调用该工具是但传参），一步是下一个 session 的输入（工具结果）



## 省钱大法

#### 模型选择

不是所有的任务都需要最聪明（昂贵）的模型，简单的用 haiku，编程的用 sonnet，架构设计的用 opus。



#### 启用缓存

"cache_control": {"type": "ephemeral"}



#### 启用代理

https://github.com/ericc-ch/copilot-api：转换成 copilot openai api，代理到 copilot

https://github.com/musistudio/claude-code-router：将阿里云百炼、魔搭社区等平台的 API 代理成 Claude Code 兼容的接口。



#### 批量处理



#### 压缩上下文

例如 confluence 的 mcp 压缩了原始数据



#### 精准控制

生成 todo list，按照步骤完成

提供具体的文件名/路径

屏蔽读文件清单：node_modules、logs、二进制文件、



## 计算花费的工具

https://github.com/cobra91/better-ccusage