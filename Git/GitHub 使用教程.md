## 配置公钥/私钥

### 生成 SSH key

> https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh

+ 查看现有的 SSH

  + ```bash
    $ cd ~/.ssh
    $ ls -al ~/.ssh
    drwx------   8 XXX  staff   256  9 30 11:59 .
    drwxr-xr-x+ 60 XXX  staff  1920  2  9 18:20 ..
    ```

+ 新建 SSH

  + ```bash
    $ ssh-keygen -t ed25519 -C "your_email@example.com"
    
    $ ls -al ~/.ssh
    drwx------   8 XXX  staff   256  9 30 11:59 .
    drwxr-xr-x+ 60 XXX  staff  1920  2  9 18:20 ..
    -rw-------   1 XXX  staff   419  7 10  2020 id_ed25519
    -rw-r--r--   1 XXX  staff   105  7 10  2020 id_ed25519.pub
    -rw-r--r--   1 tingtingliu  staff  3618  9 19  2020 known_hosts
    ```

  + 当系统提示您 “Enter a file in which to save the key（输入要保存密钥的文件）” 时，可以按 Enter 键接受默认文件位置。

+ 查看 SSH

  + ```bash
    $ cat id_ed25519.pub
    ssh-ed25519 XXX your_email@example.com
    ```

+ 复制 SSH 公钥

  + ```bash
    $ pbcopy < ~/.ssh/id_ed25519.pub
    ```

  + 添加到 Git SSH Keys 中。

+ 使用

  + 如果在使用过程中出现下类错误：

    ```bash
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    @    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
    @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
    Someone could be eavesdropping on you right now (man-in-the-middle attack)!
    It is also possible that a host key has just been changed.
    The fingerprint for the RSA key sent by the remote host is
    SHA256:uNiVztksCsDhcc0u9e8BujQXVUpKZIDTMczCvj3tD2s.
    Please contact your system administrator.
    Add correct host key in /Users/tingtingliu/.ssh/known_hosts to get rid of this message.
    Offending RSA key in /Users/tingtingliu/.ssh/known_hosts:2
    Host key for github.com has changed and you have requested strict checking.
    Host key verification failed.
    fatal: Could not read from remote repository.
    ```

  + 方法一，添加进去：

    ```bash
    $ ssh-keygen -R github.com
    # Host github.com found: line 2
    /Users/tingtingliu/.ssh/known_hosts updated.
    Original contents retained as /Users/tingtingliu/.ssh/known_hosts.old
    ```

  + 方法二，删除报错的行：

    ```bash
    $ sed -i '140d' /home/tom/.ssh/known_hosts
    ```

    + 如果直接用 sed 报错，可以使用 gnu-sed：

      ```bash
      $ brew install gnu-sed
      
      $ gsed -i '140d' /home/tom/.ssh/known_hosts
      ```

      

## 搜索项目

+ https://github.com/search/advanced
+ 输入的关键字是在「项目名」和「描述」中搜索
+ 加上 `in:readme` 关键字就可以在 「Readme」文件中搜索
+ `stars > 1000` 根据收藏数搜索
+ `'after_script:'+'stage:deploy' filename:gitlab-ci.` 根据代码内容搜索
+ `blog easily start in:readme starts:>5000` 



## 搭建博客

+ https://github.com/barryclark/jekyll-now
+ https://liuteitei.github.io/



## External Links

+ github 文档

https://guides.github.com/activities/hello-world/

https://docs.github.com/cn/free-pro-team@latest/github/authenticating-to-github/connecting-to-github-with-ssh

+ GitHub上的私有仓库转换为共有仓库以及共有仓库转换为私有仓库

https://blog.csdn.net/u25th_engineer/article/details/87992633