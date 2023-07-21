## commit message

+ feat: 新特性
+ fix: 修改问题
+ wip：暂时不合，等待完成
+ refactor: 代码重构，既不是 feat 也不是 fix
+ docs: 文档修改
+ style: 代码格式修改，非css
+ test: 测试用例修改
+ chore: 其他修改，比如构建流程，依赖管理
+ build
+ ci
+ perf
+ revert



- **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci**: Changes to our CI configuration files and scripts (example scopes: Circle, BrowserStack, SauceLabs)
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests



https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional#subject-case



+ eg:
  + `fix(AlertRules): xxxxxx [jira-000]` 
  + `git commit -m 'feat: changes of AlertRecords [SPMON-1128]'` 





注释

TODO：英语翻译为待办事项，备忘录。如果代码中有该标识，说明在标识处有功能代码待编写，待实现的功能在说明中会简略说明。

FIXME：可以拆成短语，fix me ，意为修理我。如果代码中有该标识，说明标识处代码需要修正，甚至代码是错误的，不能工作，需要修复，如何修正会在说明中简略说明。

XXX：如果代码中有该标识，说明标识处代码虽然实现了功能，但是实现的方法有待商榷，希望将来能改进，要改进的地方会在说明中简略说明。

HACK：英语翻译为砍。如果代码中有该标识，说明标识处代码我们需要根据自己的需求去调整程序代码。



