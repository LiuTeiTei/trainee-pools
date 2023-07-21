# 介绍

[GitLab 使用手册](https://docs.gitlab.com/ee/ci/)

GitLab CI/CD 由一个名为 `.gitlab-ci.yml` 的文件进行配置，该文件位于仓库的根目录下。

文件中指定的脚本由 GitLab Runner 执行。

## CI

- Continuous Integration（持续集成）
- 小的代码块推送到 Git 仓库中托管的应用程序代码库中，并且每次推送时，都要运行一系列脚本来构建、测试和验证代码更改。

## CD

- Continuous Delivery (CD) 持续交付
- Continuous Deployment (CD) 持续部署
- 持续交付和部署相当于更进一步的 CI，可以在每次推送到仓库默认分支的同时将应用程序部署到生产环境。

# .gitlab-ci.yml

- [GitLab 文档：Keyword reference for the .gitlab-ci.yml file (FREE)](https://xiami/help/ci/yaml/README)

- 开始构建之前 YAML 文件定义了一系列带有约束说明的任务；

- 这些任务都是以任务名开始并且至少要包含 `script` 部分：

  ```yaml
  job1:
    script: execute-script-for-job1
  
  job2:
    script: execute-script-for-job2
  ```

  - 保留字段不能被定义为 `job` 名称；
  - `script ` 可以直接执行系统命令；
  - 每一个任务的执行过程都是独立运行的；

## Global

### stages

- The names and order of the pipeline stages；

- 用来定义可以被 job 调用的 stages，stages 的规范允许有灵活的多级 pipelines；

- stages 中的元素顺序决定了对应 job 的执行顺序：

  ```yaml
  stages:
    - install
    - test
    - compile
    - publish-to-registry
    - deploy-umd
    - send-publish-noti
    - release-job
  ```

  - 相同 stage 的 job 可以并行执行，例如所有的 install job 都是并行执行的；
  - 下一个 stage 的 job 会在前一个 stage 的 job 成功后开始执行，例如所有 install 的 jobs 执行成功后，test 的 jobs 才会开始并行执行；
  - 所有的 jobs 执行成功后，mr 才会被标记为 success；
  - 任何一个前置的 jobs 失败了，mr 会标记为 failed，并且下一个 stages 的 jobs 都不会执行。

- 没有定义 stages，那么会默认定义为 .pre、build、test、deploy、.post；

- 如果一个 job 没有指定 stage，那么会默认定义为 test stage。

### workflow

- Control what types of pipeline run.

- 确认是否运行 pipeline；

- 下层属性只有 rules 字段，其中每条 rule 可配：

  - if：检查此规则，以确定何时运行一个 pipeline；
  - when：当 rule 规则通过时执行什么操作；
    - always：运行 pipeline；
    - never：停止运行的 pipeline；
  - variables：如果没有定义，使用其他地方定义的变量。

- 例如：

  ```yaml
  workflow:
    rules:
      - if: $CI_COMMIT_MESSAGE =~ /-draft$/
        when: never
      - if: '$CI_PIPELINE_SOURCE == "push"'
  ```

### include

- Import configuration from other YAML files.

- 例如：

  ```yaml
  include:
    - project: "xxx/project-xxx/model-x"
      ref: master
      file: "/templates/v2/main.yml"
  ```

## Global & Job

可以为一些关键词设置全局默认值，也可以在某个 job 中单独设置，job 中的设置可以覆盖全局的。

### image

- Use Docker images；

- 全局的 image 作用于所有的 jobs：

  ```yaml
  default:
    image: node:14
  ```

- 某个 job 内定义的只在当前 job 范围内生效：

  ```yaml
  test:
    stage: test
    image: harbor.xxx.com/mdap/xxx-puppeteer:lts
  ```

### services

- Use Docker services images.

### cache

- List of files that should be cached between subsequent runs.

### before_script

- Override a set of commands that are executed before job；

- 用来定义所有 jobs，或者某个 job 运行之前的命令，它必须是一个数组或者是多行字符串；

- ```yaml
  default:
    before_script:
      - echo "Execute this script in all jobs that don't already have a before_script section."
  
  job1:
    script:
      - echo "This script executes after the global before_script."
  
  job:
    before_script:
      - echo "Execute this script instead of the global before_script."
    script:
      - echo "This script executes after the job's `before_script`"
  ```

### after_script

- Override a set of commands that are executed after job.

- 用来定义所有 jobs，或者某个 job 运行之后的命令，它必须是一个数组或者是多行字符串；

- ```yaml
  default:
    after_script:
      - echo "Execute this script in all jobs that don't already have an after_script section."
  
  job1:
    script:
      - echo "This script executes first. When it completes, the global after_script executes."
  
  job:
    script:
      - echo "This script executes first. When it completes, the job's `after_script` executes."
    after_script:
      - echo "Execute this script instead of the global after_script."
  ```

### variables

- Define job variables on a job level.

- 从定义层面来说分为两种：

  - 自定义变量：
    - 在 `.gitlab-ci.yml` 文件中定义；
    - 在 GitLab 平台的 Settings CI/CD 配置中的 Variables；
    - 手动运行 Pipeline 时从 Variables 输入框中传入；
  - 预设变量：Runner 预定义了一些自己的变量，例如 `CI_COMMIT_REG_NAME` 就表示用于构建项目的分支或 tag 名称。

- 从作用域来说分为两种：

  - 全局：定义在 `.gitlab-ci.yml` 文件的头部，所有 jobs 都可以使用；

  - job：定义在某个 job 内，只有当前 job 可以使用，相同变量名的话权重比全局变量高；

  - 例如：

    ```yaml
    variables:
      DEPLOY_SITE: "https://example.com/"
  
    deploy_job:
      stage: deploy
      script:
        - deploy-script --url $DEPLOY_SITE --path "/"
  
    deploy_review_job:
      stage: deploy
      variables:
        REVIEW_PATH: "/review"
      script:
        - deploy-review-script --url $DEPLOY_SITE --path $REVIEW_PATH
    ```

- 变量的名称和值只能是整型或者字符串；

- 这些变量可以被后续的命令和脚本使用；

- 因为这些配置是存储在 git 仓库中，所以不要是项目的敏感配置；

- 服务容器（Docker）也可以使用定义的变量。

### tags

- List of tags that are used to select a runner.

- 在注册 Runner 的过程中，我们可以设置 Runner 的标签，比如 `ruby`，`postgres`，`development` 等，

  通过 tags 来指定特殊的 Runners 来运行 jobs：

  ```yaml
  windows job:
    stage:
      - build
    tags:
      - windows
    script:
      - echo Hello, %USERNAME%!

  osx job:
    stage:
      - build
    tags:
      - osx
    script:
      - echo "Hello, $USER!"
  ```

- 也可以全局指定：

  ```yaml
  default:
    tags:
      - share-standard-sg
  ```

### interruptible

- Defines if a job can be canceled when made redundant by a newer run.

### retry

- When and how many times a job can be auto-retried in case of a failure.

### timeout

- Define a custom job-level timeout that takes precedence over the project-wide setting.

### artifacts

- List of files and directories to attach to a job on success.

## Jobs

- yml 文件允许指定无限量 jobs；
- 每个 job 必须有一个唯一的名字，而且不能是上面提到的关键字；

  - image
  - services
  - stages
  - types
  - before_script
  - after_script
  - variables
  - cache
  - include

-
- 每个 job 由一些参数来定义 job 的行为。

### stage

- Defines a job stage(default test).

- 可选；

- 相同 stage 的 jobs 可以并行执行；

- ```yaml
  stages:
    - build
    - test
    - deploy
  
  job 0:
    stage: .pre
    script: make something useful before build stage
  
  job 1:
    stage: build
    script: make build dependencies
  
  job 2:
    stage: build
    script: make build artifacts
  
  job 3:
    stage: test
    script: make test
  
  job 4:
    stage: deploy
    script: make deploy
  
  job 5:
    stage: .post
    script: make something useful at the end of pipeline
  ```

### script

- Shell script that is executed by a runner.

- 必填；

- 可以是单个命令：

  ```yaml
  job:
    script: "bundle exec rspec"
  ```

- 可以是多行命令：

  ```yaml
  job:
    script:
      - uname -a
      - bundle exec rspec
  ```

- 当使用 `:`，`{`，`}`，`[`，`]`，`,`，`&`，`*`，`#`，`?`，`|`，`-`，`<`，`>`，`=`，`!` 这些字符时，需要用单引号或者双引号包裹起来：

  ```yaml
  job:
    script:
      - 'curl --request POST --header "Content-Type: application/json" "https://gitlab/api/v4/projects"'
  ```

### allow_failure

- Allow job to fail. A failed job does not cause the pipeline to fail.

- 设置一个 job 失败之后并不影响后续的 CI 组件：

  ```yaml
  job1:
    stage: test
    script:
      - execute_script_that_will_fail
    allow_failure: true
  
  job2:
    stage: test
    script:
      - execute_script_that_will_succeed
  
  job3:
    stage: deploy
    script:
      - deploy_to_staging
  ```

  - job1 和 job2 将会并列进行，如果 job1 失败了，它也不会影响进行中的下一个 stage。

### when

- When to run job.

- 可以设置以下值：

  - `on_success` ：默认值，只有前面 stages 的所有工作成功时才执行，除非前面失败的 job 设置了 allow_failure；
  - `on_failure`：当前面 stages 中任意一个 jobs 失败后执行；
  - `always`：无论前面 stages 中 jobs 状态如何都执行；
  - `manual`：手动执行；
  - `delayed`：延迟一段时间后执行；
  - `never`：
    - With job rules，don't execute job；
    - With workflow:rules，don't run pipeline。

- 例如：

  ```yaml
  stages:
    - build
    - cleanup_build
    - test
    - deploy
    - cleanup
  
  build_job:
    stage: build
    script:
      - make build
  
  cleanup_build_job:
    stage: cleanup_build
    script:
      - cleanup build when failed
    when: on_failure
  
  test_job:
    stage: test
    script:
      - make test
  
  deploy_job:
    stage: deploy
    script:
      - make deploy
    when: manual
  
  cleanup_job:
    stage: cleanup
    script:
      - cleanup after jobs
    when: always
  ```

  - 只有当 build_job 失败的时候才会执行 cleanup_build_job；
  - 不管前一个 job 执行失败还是成功都会执行 cleanup_job；
  - 可以从 GitLab 界面中手动执行 deploy_jobs。

# Ref

[GitLab CI/CD](https://www.cnblogs.com/cjsblog/p/12256843.html)

[Keyword reference for the .gitlab-ci.yml file](https://xiami/help/ci/yaml/README)
