# 背景

如果你不小心将敏感信息上传到了 Git 仓库，无论是 `remove` + `git commit`，还是 `git reset` + `git push -f` 都无法完善删除，会在 git history 中留有痕迹。那么如何完全清除呢？推荐使用 [BFG Repo-Cleaner](http://rtyley.github.io/bfg-repo-cleaner/)。



# BFG Repo-Cleaner

> Removes large or troublesome blobs like [git-filter-branch](https://git-scm.com/docs/git-filter-branch) does, but faster.



## 环境配置

### 安装 JDK

首先需要确保你的系统已经安装了 Java Development Kit (JDK) 1.7 或者更高版本：

+ 打开 Oracle官网：https://www.oracle.com/java/technologies/downloads
+ 如果系统是 MAc M1芯片，选择 `Arm 64 DMG Installer`；如果系统是 Mac Intel芯片，选择 `x64 Compressed Archive`。
+ 下载后，点击进行安装。

检查是否安装成功：

```shell
$ java -version

# 安装成功
java version "23.0.1" 2024-10-15
Java(TM) SE Runtime Environment (build 23.0.1+11-39)
Java HotSpot(TM) 64-Bit Server VM (build 23.0.1+11-39, mixed mode, sharing)

# 安装失败
The operation couldn’t be completed. Unable to locate a Java Runtime.
Please visit http://www.java.com for information on installing Java.
```



### 下载 BFG Repo-Cleaner

BFG 本身不需要安装，只需要拥有 Java 运行环境，下载执行文件将其放在可执行的路径下即可：

+ 打开 BFG 网站：https://rtyley.github.io/bfg-repo-cleaner/

+ 点击 Download 按钮下载文件，下载成功后将其移动到想要运行的文件夹中；

+ 设置可执行权限：

  ```shell
  $ chmod +x bfg.jar
  ```

使用 Java 运行 BFG 检查是否可用：

```shell
$ java -jar bfg.jar --help
```



## 使用

```shell
$ git clone --mirror git@example.com/your-repo.git
```

在本地文件夹中克隆一个裸仓库，只包含存储库的历史记录和分支，不包含任何工作副本。

你会得到一个 `your-repo.git` 文件夹。



```shell
$ java -jar bfg.jar --delete-files id_{dsa,rsa}  your-repo.git
```

使用 BFG 进行对仓库进行修改，例如删除 `id_das` 和 `id_rsa` 文件。

你会得到一个 `trainee-pools.git.bfg-report` 文件夹，里面记录了修改的数据。



```shell
$ cd your-repo.git
$ git reflog expire --expire=now --all && git gc --prune=now --aggressive
```

删除不需要的脏数据。



```shell
$ git push
```

推送到远端。



### 指令解析

```shell
$ java -jar 占位符1 占位符2 占位符3
```

+ 占位符1：BFG 执行文件的路径；
+ 占位符2：BFG 的具体执行操作；
+ 占位符3：想要进行操作的裸仓库的路径。



### 例子

```shell
$ bfg --strip-blobs-bigger-than 50M your-repo.git
```

删除大于 `50M` 的文件。



```shell
$ bfg --delete-folders .git --delete-files .git --no-blob-protection your-repo.git
```

删除所有 `.git` 文件夹和 `.git` 文件。

默认情况下这些操组会跳过受保护的分支，例如 `master` 和 `main` 等，你可能会看到下列提示：

```shell
Using repo : */*/your-repo.git

Found 288 objects to protect
Found 2 commit-pointing refs : HEAD, refs/heads/main

Protected commits
-----------------

These are your protected commits, and so their contents will NOT be altered:

 * commit f73f4db2 (protected by 'HEAD')

Cleaning
--------

Found 106 commits
Cleaning commits:       100% (106/106)
Cleaning commits completed in 42 ms.

BFG aborting: No refs to update - no dirty commits found??
```

加上 `--no-blob-protection` 指令表示删除的操作也会包含这些分支。



```shell
$ bfg --replace-text replace.txt your-repo.git
```

其中 replace.txt 文件是自定义的移除数据规则的文本，语法如下：

```txt
password1													# 删除 password1 的相关记录
password2==>											# password2 转换为 空字符串
password3==>examplePassword				# password3 转换为 examplePassword
regex:password=\w+==>password=		# 正则匹配替换 password 具体数据为 空字符串
regex:\r(\n)==>$1									# 正则匹配替换 Window 换行符为 Unix 换行符
```



# 防范于未然

最好的方式是将风险扼杀在摇篮中，但有时就是不小心写入了一些敏感信息怎么办呢？可以在 `git commit` 的时候进行检查。

+ 创建 pre-commit 钩子脚本：在仓库的 `.git/hooks/` 目录下创建一个名为 `pre-commit` 的文件，如果已存在可直接使用；

+ 编写脚本：

  ```shell
  #!/bin/sh
  
  # 设置红色文本颜色
  RED=$(tput setaf 1)
  RESET=$(tput sgr0)
  
  # 检查提交的文件内容是否包含特定字符串
  function check_file_contents() {
    # 要检查的字符串列表
    local patterns=("aaa" "bbb" "ccc")
  
    # 通过 git diff-index 命令获取即将提交的文件列表
    files=$(git diff-index --name-only --cached HEAD)
    
    # 设置分隔符为换行符，以处理文件名中的空格
    IFS=$'\n'
  
    # 遍历文件列表
    for file in $files; do
      # 使用 grep 命令检查文件内容是否包含指定字符串
      for pattern in "${patterns[@]}"; do
        if grep -q "$pattern" "$file"; then
          echo "${RED}Error: File '$file' contains the string '$pattern'.${RESET}"
          echo "Commit aborted."
          exit 1
        fi
      done
    done
  }
  
  # 调用检查文件内容的函数
  check_file_contents
  ```

+ 赋予脚本可执行权限：进入到 `.git/hooks/` 目录，然后添加可执行权限：

  ```shell
  $ chmod +x pre-commit
  ```



# References

[从仓库中移除敏感信息](https://github.com/madneal/articles-translator/blob/master/%E4%BB%8E%E4%BB%93%E5%BA%93%E4%B8%AD%E7%A7%BB%E9%99%A4%E6%95%8F%E6%84%9F%E4%BF%A1%E6%81%AF.md) 