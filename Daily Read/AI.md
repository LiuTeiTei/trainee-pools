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
