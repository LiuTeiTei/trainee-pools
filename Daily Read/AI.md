#### * [Building AI Agents the Right Way: Design Principles for Agentic AI](https://freedium.cfd/https://ai.gopubby.com/building-ai-agents-the-right-way-design-principles-for-agentic-ai-47d1b92f0124)

> https://github.com/BrainBlend-AI/atomic-agents
>
> https://brainblend-ai.github.io/atomic-agents/

设计 AI Agents 就像软件工程开发，遵循一系列设计原则。

+ Embrace Modularity (Think LEGO Blocks)
+ Implement Persistent Memory
+ Plan and Orchestrate the Workflow
+ Adopt Defensive Design (Validate and Handle Errors)
+ Define Clear Interfaces and Boundaries
+ Align with Reality (Practicality & Testing)



#### * [Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)

Claude 在 [2025.10.16] 推出 Skills 功能结构化管理 Agents 能力。将提示词、tools 调用、script 运行按照目录管理，让 Agent 判断需要运用某能力时再加载该文件，可以更加有条理的完成任务，还可以减少 tokn 消耗。

+ Introducing Agent Skills, a new way to build specialized agents using files and folders.
+ Agents with a filesystem and code execution tools don’t need to read the entirety of a skill into their context window when working on a particular task. 
+ <img src='images/Agent + Skills + Virtual Machine.jpg' >
+ <img src='images/Claude Skill Content.jpg' >



#### [Evals: LLM as a Judge](https://freedium.cfd/https://medium.com/@alejandro7899871776/evals-llm-as-a-judge-2ac869c2d63e)

用一个简单的例子实际说明下怎么使用 LLM 进行评估。

+ scoring subjective outputs gives us the tools to improve quality and make better model choices.
+ 可以客观测量的指标，就用函数进行评估；
+ 分多个 LLM Judeg 分别评估不同指标；
+ 用更聪明，或者同厂商同等级的 LLM 作为 Judeg。



#### [How to turn Claude Code into a domain specific coding agent](https://blog.langchain.com/how-to-turn-claude-code-into-a-domain-specific-coding-agent/)

LangChain 探索如何组织 Claude Code 实现一个效果更好的 Coding Agent。

+ 手动检查失败的运行以发现重复出现的陷阱并为其添加指导。
+ 在 `Claude.md` 在每个部分末尾加上参考 URL，可以让 Agent 在需要查询更多信息的时候 web tool 获取。
+ 简洁的、结构化的 `Claude.md`  比把所有上下文丢给 Agent 的效果更好。

提到了如何进行评估。

+ Smoke Tests：验证基本功能，例如代码可以正常运行，预期输入输入
+ Task Requirement Tests：验证特殊要求，例如配置文件的生成，外部 api 的调用
+ Code Quality & Implementation Evaluation：使用 LLM-as-a-Judge
  + Objective Checks：例如特定节点是否存在、图结构是否正确、模块是否分离、是否有测试文件，返回 Boolean
  + Subjective Assessment：使用专家编写的代码作为参考，采用人工注释来传递编译和运行时错误日志
