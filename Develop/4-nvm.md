# nvm

nvm 是 node.js 的版本管理器，可在 sh，dash，ksh，zsh，bash 这些 Shells 内运行。

为什么需要管理 node.js 版本呢？不同项目依赖的 node.js 版本不一样，例如 Grafana 通过二进制启动时依赖的 14 版本的 node.js，但本地项目开发中依赖的 12 版本；同时开发多个项目的时候，不同项目的 node.js 依赖往往也是不一样的。重复卸载于安装显然是十分不便的。

nvm 可以帮助我们做什么？

+ 可安装多版本的 node.js
+ 灵活切换当前版本的 node.js
+ 以沙箱方式全局安装第三方组件到对应版本的 node.js
+ 通过 `.nvmrc` 文件指定各应用系统所需要的 node.js 版本进行运行



## 安装

### 官方推荐

+ 使用 [nvm 官方 Github 文档](https://github.com/nvm-sh/nvm#install--update-script) 安装方式，在终端中运行以下命令：

  ```bash
  $ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
  ```

+ 该命令会下载一个脚本并自动运行，将 nvm 仓库克隆到 `~/.nvm` 中，并且会将下面的源代码片段加载到正确的配置文件中，配置环境变量，例如`~/.bash_profile` ， `~/.zshrc` ，`~/.profile` ， 或者 `~/.bashrc` ：

  ```bash
  # 不同官方版本的环境变量可能不一样
  export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
  ```

+ 从 macOS 10.15 开始，默认使用的 zsh ，nvm 会寻找 `~/.zshrc` 文件进行配置。
  + 默认情况下是不存在  `~/.zshrc` 文件，需要手动创建后再安装 nvm。或者安装完成后手动添加到 `~/.zshrc` 文件中。
  + 如果使用的是 bash，同样的道理需要先创建 `~/.bash_profile` 文件。

+ 如果不想每次启动终端的时候都使用 nvm，只想在需要的时候才使用，可以将上面的配置代码单独写在一个文件中，例如 `~/.profile` 中，在需要使用的时候运行 `source ~/.profile` 命令就行；

+ 可以通过 `npm config get prefix` 指令查看 nvm 安装路径。



### Homebrew 安装

官方不推荐使用 brew 安装，如使用 brew 安装，需要手动配置环境变量。



### Antigen 安装

+ 推荐使用该方法安装，不用手动输入安装语句，不用手动配置环境变量，只需要在 `.zshrc` 配置文件中引用一句话：

  ```bash
  antigen bundle lukechilds/zsh-nvm
  ```

+ 通过 `nvm upgrade` 可以快速更新 nvm 至最新版本；

+ 如果使用 node 中出现报错，可能是环境变量配置不正确，需要手动配置：
  + 使用官方的方法安装后，在从 `.profile` 文件中拷贝环境变量的配置，粘贴到 `.zshrc` 中。



## 使用 [.nvmrc](https://github.com/nvm-sh/nvm#nvmrc) 管理

+ 在服务器上很多时候会运行多个应用系统，每个应用系统使用的 node 版本是不一样的。 老系统用旧的 node 版本，新系统用新的 node 版本，在迭代中十分常见。

+ 为了让不同的应用系统使用各自所需的 node 版本运行，我们只需在各应用系统内的根目录里生成一个`.nvmrc` 文件，在其内写一个版本号，利用 `nvm run <系统启动文件>` 的方式运行系统，即可完成要求。



**使用方法：**

+ 在根目录里面创建 `.nvmrc` 文件，并写入欲使用的 node 版本

  ```bash
  $ echo 12 > .nvmrc
  ```

+ 使用 nvm 运行时无需指定版本号，会自动使用 .nvmrc 文件中配置的版本，但是需要先安装。

  ```bash
  $ nvm use
  ```



## 基本命令语句

+ `nvm ls` 

  + 查看目前已有的

  + 如果在安装 nvm 之前已经安装了 node.js，则已有的 node.js 会成为默认的版本，system

  + ```
    ->       system
    iojs -> N/A (default)
    node -> stable (-> N/A) (default)
    unstable -> N/A (default)
    ```

  + 此时只有系统原来带的node版本，没有通过nvm安装任何的node版本

+ `nvm ls-remote` 

  + 查看目前有哪些node可以安装

+ `nvm install node` 

  + 安装最新版本的node

+ `nvm install <version>` 

  + 安装特定版本的 node.js，例如 `nvm install 12.20.0`，除了直接写版本号，还可以通过代称：node（最新版本）、stable（最新稳定版本）

+ `nvm use <version>` 

  + 切换 node.js 版本，除了直接切换版本号，还可以通过代称：system、default、node
  + `nvm use 12` `nvm use default` `nvm use node` 

+ `nvm uninstall <version>` 

  + 卸载指定 node.js，不能卸载当前正在运行中的node版本
  
+ `nvm uninstall` 

  + 查看有哪些版本可以卸载
  
+ `nvm alias XXX <version>` 

  + 给指定版本设置一个代称，这个代称的版本可以修改。例如 `nvm alias default 12.20.0` 就是把 12.20.0 版本命名为 default，之后想要对其操作直接使用 default，方便好记忆



# External Links

[node 多版本控制](https://segmentfault.com/a/1190000010252661) 