# crontab

Linux 系统默认支持的命令；

crontab 可以用来定期执行程序；

crontab 每分钟会定期检查是否有要执行的工作，如果有要执行的工作便会自动执行该工作。



# 命令格式

```bash
> crontab [-u user] file
> crontab [-u user] [-e | -l | -r]
```

+ -u user：用来指定某个用户的 crontab 服务；
+ file：命令文件的名字；
+ -e：编辑 crontab 文件，如果不指定用户则编辑当前用户的 crontab 文件；
+ -l：展示 crontab 文件内容，如果不指定用户则展示当前用户的 crontab 文件内容；



# crontab 文件格式

```bash
> 分 时 日 月 星期 program
```

+ 分：1～59

+ 时：1～23

+ 日：1～31

+ 月：1～12

+ 星期：0～7

+ program：可以是指令，也可以是一个脚本路径

  ```sh
  # 每月每天的午夜 0 点 20 分, 2 点 20 分, 4 点 20 分....执行 echo "haha"
  20 0-23/2 * * * echo "haha"
  
  # 每周四 11 点执行 weeklyMeetingNotification 脚本
  0 11 * * 2 /usr/local/bin/node /Users/script/weeklyMeetingNotification.js
  ```

  

# 实例

在 /Users/script 中有一个 datatest.sh 脚本：

```sh
#!bin/bash
/etc/profile
. ~/.bash_profile

time=$(date "+%Y%m%d%H%M%S") 
mkdir /Users/script/$time
echo $time
```



在 crontab 文件中添加定时任务，每分钟执行一次这个脚本

```sh
> crontab -e
* * * * * /Users/script/datatest.sh
```



保存后查看这个脚本

```sh
> crontab -l
* * * * * sh /Users/script/datatest.sh
```



检查 /Users/script 路径下的文件夹变化，可以看到每分钟都会以当前时间为名创建一个文件夹。



# 参考

+ [Linux crontab 命令](https://www.runoob.com/linux/linux-comm-crontab.html)
+ [Scheduling Cron Jobs in Node.js](https://cronitor.io/guides/node-cron-jobs) 

+ [Mac创建定时任务](https://blog.csdn.net/qq_21137441/article/details/106608115) 
+ [执行shell脚本，提示permission denied:shellname.sh](https://blog.csdn.net/mml5211314/article/details/108484674) 