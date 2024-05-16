# Homebrew

> Homebrew是一款 Mac OS 平台下的软件包管理工具，拥有安装、卸载、更新、查看、搜索等很多实用的功能。简单的一条指令，就可以实现包管理，而不用关心各种依赖和文件路径的情况，十分方便快捷。
>

+ Homebrew 会将软件包安装到独立目录，并将其文件软链接至 `/usr/local` ；



## 安装

### 常规安装

+ 打开官网链接 👉 https://brew.sh/index_zh-cn

+ 按照提示在终端中输入命令

  + ```bash
    $ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```

+ 检查是否安装成功

  + ```bash
    $ brew -v
    ```

  + 使用 `brew` 关键字进行命令语句的调用

### 国内镜像安装

+ https://zhuanlan.zhihu.com/p/111014448
+ 如果没有反应多试几遍

### 安装包

+ Homebrew 可安装的包 👉 [Homebrew Formulae](https://formulae.brew.sh/formula/)
+ [iterm2](https://formulae.brew.sh/cask/iterm2#default) 
+ [antigen](https://formulae.brew.sh/formula/antigen#default) 
+ [git](https://formulae.brew.sh/formula/git#default) 
+ [node](https://formulae.brew.sh/formula/node#default)
+ [typescript](https://formulae.brew.sh/formula/typescript#default) 
+ [mysql](https://formulae.brew.sh/formula/mysql#default) 
+ [yarn](https://formulae.brew.sh/formula/yarn#default) 



## brew 与 brew case

+ HomeBrew 是通过源码的方式来安装软件，但是有时候我们安装的软件是 GUI 程序应用包（.dmg/.pkg），这个时候我们就不能使用 HomeBrew，所以有了 HomeBrew Cask 的出现；

+ brew cask 是在 brew 的基础上一个增强的工具，用来安装 Mac 上的 GUI程序应用包，比如 QQ、Chrome、iterm2 等；

+ 它先下载解压到统一的目录中（/opt/homebrew-cask/Caskroom），省掉了自己去下载、解压、拖拽（安装）等步骤，同样，卸载相当容易与干净。然后再软链到 （~/Applications/） 目录下，非常方便，而且还包含很多在 AppStore 里没有的常用软件；

+ HomeBrew cask 没有提供更新软件的命令，所以我们更新软件得先卸载再安装：

+ 简而言之的区别：

  + brew 主要用来下载一些不带界面的命令行下的工具和第三方库来进行二次开发；


  + brew cask主要用来下载一些带界面的应用软件，下载好后会自动安装，并能在 mac 中直接运行使用；
  + 可以在 `/usr/local/Cellar` 目录中查看有哪些文件夹，对应的就是 brew 安装包；
  + 可以在 `/usr/local/Caskroom` 目录中查看有哪些文件夹，对应的就是 brew case  安装包。




## brew 与 npm

+ Homebrew 是软件管理工具，仅用于 Mac OS 平台；

+ npm 是 NodeJS 语言的模块/包管理工具，可跨平台使用。



## 常用命令行

+ `which brew` ：查看 Homebrew 的安装地址



+ `brew search` ：列出所有支持的软件
+ `brew search <package_name>` ：搜索指定软件



+ `brew list` ：查看已安装的软件
+ `brew list --versions` ：查看安装的包列表（包括版本号）
+ `brew list <package_name>` ：查看指定软件的安装路径



+ `brew install <package_name>` ：安装
+ `brew uninstall <package_name>` ：卸载
+ `brew update` ：从服务器上拉取，并更新本地 brew 的包目录
+ `brew upgrade <package_name>` ：更新软件
+ `brew outdated` ：查看你的软件中哪些有新版本可用
+ `brew cleanup` ：清理老版本。使用 `-n` 参数，不会真正执行，只是打印出真正运行时会做什么。



+ `brew home` ：用浏览器打开brew的官方网站
+ `brew info` ：显示软件信息
+ `brew deps` ：显示包依赖

