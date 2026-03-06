yarn global 的包装在哪里？有没有什么 where 或者 which 查看安装路径？



非常好的问题 👍！
这是很多前端工程师第一次用 `yarn global` 时的困惑：

> 「用 `yarn global add xxx` 装的包到底放哪？
> 我怎么查看它的安装路径？有没有命令能查？」

下面我们来系统讲清楚 👇

------

## 🧩 一、`yarn global` 是什么

当你执行：

```
bashCopy
yarn global add typescript
```

它会把包安装到 Yarn 的全局目录（不是当前项目的 `node_modules`），
然后把其中的可执行文件链接到 Yarn 的全局 `bin` 目录。

------

## 🧭 二、查看全局安装路径（命令）

### ✅ 1️⃣ 查看根目录（包存放位置）

```
bashCopy
yarn global dir
```

输出类似：

```
plaintextCopy
/Users/<用户名>/.config/yarn/global
```

这就是 Yarn 存放 全局 package 的目录（类似 NPM 的 `~/.npm-global`）。

------

### ✅ 2️⃣ 查看可执行文件所在目录（可执行命令的路径）

```
bashCopy
yarn global bin
```

输出示例：

```
plaintextCopy
/Users/<用户名>/.yarn/bin
```

这个目录存放着全局命令的链接（symbolic link），
比如执行的 `tsc`、`eslint`、`create-react-app` 等等。

💡 你可以把这个路径加进环境变量 `$PATH`，
才能在任何目录下直接运行这些命令。

------

## 🧱 三、示例（macOS / Linux）

```
bashCopy
$ yarn global dir
/Users/alice/.config/yarn/global

$ yarn global bin
/Users/alice/.yarn/bin
```

- 真实包文件：`~/.config/yarn/global/node_modules/`
- 执行命令链接：`~/.yarn/bin/`

例如：

```
plaintextCopy
~/.yarn/bin/tsc → ~/.config/yarn/global/node_modules/typescript/bin/tsc
```

------

## ⚙️ 四、在命令行里直接验证

- 查看全局命令路径：

  ```
  bashCopy
  which tsc
  ```

  或使用 Windows：

  ```
  bashCopy
  where tsc
  ```

如果输出路径在你上面看到的 Yarn bin 目录里，说明命令确实来自 `yarn global`。

------

## 🧩 五、在 Windows 上的路径

| 系统             | Yarn global 存放路径              | Bin 目录                  |
| :--------------- | :-------------------------------- | :------------------------ |
| macOS / Linux    | `~/.config/yarn/global`           | `~/.yarn/bin`             |
| Windows CMD 默认 | `%LOCALAPPDATA%\Yarn\Data\global` | `%LOCALAPPDATA%\Yarn\bin` |

示例：

```
plaintextCopy
C:\Users\<User>\AppData\Local\Yarn\Data\global\node_modules\
C:\Users\<User>\AppData\Local\Yarn\bin\
```

------

## 🧠 六、Yarn 2 / Berry 之后的差异

> 注意：Yarn 2+（Berry 版本）不再推荐使用 `yarn global`，
> 它改为 “Per‑Project 或 Plug’n’Play” 模式。

如果你使用的是新版：

```
bashCopy
yarn --version
```

输出若是 `2.x` 或 `3.x`，
建议使用：

```
bashCopy
yarn dlx <package>
```

或

```
bashCopy
npm install -g <package>
```

执行全局命令。

------

## ✅ 七、一句话总结

| 需求                   | 命令 / 路径                                         |
| :--------------------- | :-------------------------------------------------- |
| 查看 Yarn 全局安装路径 | `yarn global dir`                                   |
| 查看全局 bin 路径      | `yarn global bin`                                   |
| 定位某个命令实际来源   | Linux/Mac → `which <cmd>` / Windows → `where <cmd>` |
| Yarn 2+ 替代方案       | `yarn dlx <pkg>` 或 使用 npm global                 |

------

### 💡 记忆口诀：

> 📦 包存哪里？→ `yarn global dir`
> ⚙️ 命令在哪？→ `yarn global bin`
> 🔍 直接查绝对路径？→ `which` / `where`





➜ yarn global list yarn global v1.22.22 warning package.json: No license field info "@xiami/space-megaserver@2.10.1" has binaries:   - sms2   - sms2-daemon info "@space/devhome-server@1.1.8" has binaries:   - devhome-daemon-cli info "create-jest@29.7.0" has binaries:   - create-jest info "create-playwright@1.17.135" has binaries:   - create-playwright info "create-umi@4.3.30" has binaries:   - create-umi info "create-vite@6.1.1" has binaries:   - create-vite   - cva ✨  Done in 0.23s.  ➜ where @xiami/space-megaserver @xiami/space-megaserver not found



这个现象非常典型 👍
你执行 `yarn global list` 能看到全局安装的包，但用 `where @xiami/space-megaserver` 或 `which @xiami/space-megaserver` 查不到路径 ——
其实这是因为：

> `where/which` 只能找到**可执行二进制（命令文件）**的路径，
> 而不是 Node 包本身的目录。

------

## 🧠 1️⃣ 关键区别

| 目的                 | 正确命令                                     |
| :------------------- | :------------------------------------------- |
| 找包的安装目录       | `yarn global dir` ↩️ 输出全局目录，手动进去找 |
| 找包提供的命令位置   | `yarn global bin` ↩️ 看可执行文件 link 到哪   |
| 搜索某个命令执行文件 | `which <command>` 或 `where <command>`       |

------

## 🧩 2️⃣ 你的情况分析

输出中看到：

```
plaintextCopy
info "@xiami/space-megaserver@2.10.1" has binaries:
   - sms2
   - sms2-daemon
```

👉 表示这个包里导出了两个可执行命令：
`sms2` 和 `sms2‑daemon`。
所以要查这些命令的路径，而不是查包名。

```
bashCopy
which sms2
which sms2-daemon
```

举个例子（Mac/Linux）：

```
plaintextCopy
/Users/<username>/.yarn/bin/sms2
```

Windows：

```
bashCopy
where sms2
```

------

## ⚙️ 3️⃣ 如何查看包的安装目录

执行：

```
bashCopy
yarn global dir
```

假设输出：

```
plaintextCopy
/Users/<username>/.config/yarn/global
```

你可以进去找对应包目录：

```
bashCopy
cd /Users/<username>/.config/yarn/global/node_modules/@xiami/space-megaserver
ls
```

在这里你就能看到这个包的源码文件、`package.json` 等。

------

## 🧠 4️⃣ 补充说明

- `where` / `which` 命令只能搜索 PATH 环境变量中的可执行文件。
  所以 `@xiami/space-megaserver` 这种 Node 包名找不到是正常的。

- Yarn 1.x 的全局路径一般是：

  ```
  plaintextCopy
  Global packages: ~/.config/yarn/global/node_modules/
  Global bin:       ~/.yarn/bin
  ```

------

## ✅ 5️⃣ 一句总结

> - 用 `where/which` 只能查执行文件（比如 `sms2`）；
> - 用 `yarn global dir` + `node_modules` 路径查看包源码目录；
> - 全局执行文件一般都在 `yarn global bin` 输出目录中。

------

### 💡 记忆口诀

| 想找什么       | 用什么命令                             |
| :------------- | :------------------------------------- |
| 🧱 包文件夹     | `yarn global dir`                      |
| ⚙️ 执行命令路径 | `yarn global bin` 或 `which` / `where` |





我本地有 @xiami/space-megaserver 这个项目，并且 yarn link 了。如何在终端中 使用 sms2 的时候用的是本地的？



非常好的问题 👍！
这是前端开发中常见又稍绕的场景：

> 你本地有一个包（`@xiami/space-megaserver`），并且想调试它导出的命令行工具（`sms2`），
> 希望终端执行 `sms2` 时使用你本地版本（而不是全局安装的版本）。

我们一步步讲清楚 👇

------

## 🧩 一、背景理解

- 当你执行：

  ```
  bashCopy
  yarn global add @xiami/space-megaserver
  ```

  yarn 会：

  - 把包装在全局 node_modules 里；
  - 把 `sms2` 软链接到全局 bin 目录（一般是 `~/.yarn/bin`）。

- 当你键入 `sms2` 命令时，shell 会从 `$PATH` 环境变量中按顺序搜索可执行文件；
  如果全局的 `~/.yarn/bin` 在 PATH 中靠前，就会直接运行 全局安装的版本。

------

## 🧠 二、目标

我们要让 终端执行的 `sms2` 来自本地工程的版本，
即本地源码目录中的 `bin/sms2`（或 package.json `"bin"` 字段对应的可执行文件）。

------

## ⚙️ 三、正确做法：使用 `yarn link` （两步法）

假设项目目录结构如下：

```
plaintextCopy
~/workspace/space-megaserver/
  package.json （里有 "bin": { "sms2": "./bin/index.js" })
```

### ✅ 步骤 1：在你的项目里 link 出一个全局符号链接

```
bashCopy
cd ~/workspace/space-megaserver
yarn link
```

Yarn 输出大概是：

```
plaintextCopy
success Registered "@xiami/space-megaserver".
```

这个操作会在全局 Yarn 链接目录里（类比 `npm link`）创建一个符号链接。

------

### ✅ 步骤 2：在你需要使用 `sms2` 的环境里 link 回来

有两种选择：

#### 👉 方式 A：只在某个项目里想用本地包

```
bashCopy
cd ~/workspace/your-host-project
yarn link "@xiami/space-megaserver"
```

这样当前工程引用的包就会用本地源码版本；
若你在项目脚本里执行 `yarn sms2` 或 `npx sms2`，就会走本地版本。

#### 👉 方式 B（推荐调试 CLI 工具）：在全局注册 bin 软链接

想直接在任意终端键入 `sms2` 时执行本地的 bin 文件，可手动 link 全局 bin：

```
bashCopy
cd ~/workspace/space-megaserver
yarn global remove @xiami/space-megaserver # 可选：防止全局冲突
yarn link --global
```

或者手动把项目的 bin 加入 PATH：

```
bashCopy
export PATH=~/workspace/space-megaserver/bin:$PATH
```

> 📌 你也可以查看 yarn link 创建的全局链接路径：
>
> ```
> bashCopy
> yarn global dir
> ```
>
> 然后看到的 `node_modules/@xiami/space-megaserver -> ~/workspace/space-megaserver` 说明成功。

------

## 🔍 四、验证当前 `sms2` 指向哪个版本

执行：

```
bashCopy
which sms2
```

或在 Windows:

```
powershellCopy
where sms2
```

输出路径应该指向你的本地工程：

```
plaintextCopy
/Users/<你用户名>/workspace/space-megaserver/bin/sms2
```

如果仍指向类似：

```
plaintextCopy
~/.yarn/bin/sms2
```

说明全局版本还在生效，需要处理：

```
bashCopy
yarn global remove @xiami/space-megaserver
hash -r    # 刷新 shell 命令缓存（zsh/bash）
```

再检查一次路径 ✅

------

## 🧩 五、总结命令流程

```
bashCopy
# 在本地包项目里
cd ~/workspace/space-megaserver
yarn link             # 注册本地链接

# （可选）删除全局旧版，防止冲突
yarn global remove @xiami/space-megaserver

# 确保 PATH 没优先指向 ~/.yarn/bin
hash -r
which sms2            # 验证指向你本地项目
```

------

## ✅ 一句话总结

> 💡 想让终端执行的 `sms2` 使用本地源码：
>
> 1. 在包目录执行 `yarn link`；
> 2. 移除全局安装版本；
> 3. 确认 shell 的 PATH 中先找到本地项目的链接；
> 4. `which sms2` 显示路径在本地项目即可。

------

### 💡 记忆口诀

> 🧱 本地包 → `yarn link`
> 🔗 移除全局 → 防冲突
> 🔍 `which sms2` 看路径，看到本地路径 = 成功





yarn link --global 后再执行 which sms2 还是 /opt/homebrew/bin/sms2



非常好的问题 👍！
你现在的现象说明了一个关键点：

> 你的系统上有一个早先安装的 全局 `sms2` 二进制链接（来自全局安装或 Homebrew 路径），
> 它在当前的 `$PATH` 搜索顺序中比 Yarn 的链接目录优先。

------

## 👀 你看到的问题

执行：

```
bashCopy
which sms2
```

输出：

```
plaintextCopy
/opt/homebrew/bin/sms2
```

说明：

- 这个 `/opt/homebrew/bin` 目录在你的 `$PATH` 最前面；
- 而你刚刚 `yarn link --global` 生成的 `sms2`（出现在 Yarn 的 `global bin` 路径中）还排在后面；
- 所以系统优先找到 Homebrew 版本，而不是 Yarn 的本地 link。

------

## 🧩 一、先确认 Yarn 全局 bin 路径

运行：

```
bashCopy
yarn global bin
```

常见输出：

```
plaintextCopy
/Users/<用户名>/.yarn/bin
```

或（新版本）：

```
plaintextCopy
/Users/<用户名>/.config/yarn/global/node_modules/.bin
```

在这个目录下应该能看到你的 `sms2`：

```
bashCopy
ls $(yarn global bin) | grep sms2
```

如果确实存在，说明 Yarn 已经创建好了软链接，比如：

```
plaintextCopy
sms2 -> /Users/<username>/workspace/space-megaserver/bin/sms2
```

------

## ⚙️ 二、让系统优先使用 Yarn 的版本

### ✅ 方式 1：调整 PATH 顺序（一劳永逸）

在 `.zshrc` 或 `.bashrc` 里，把 Yarn bin 目录放到 PATH 最前面：

```
bashCopy
export PATH="$(yarn global bin):$PATH"
```

然后让配置生效：

```
bashCopy
source ~/.zshrc   # 或 source ~/.bashrc
hash -r           # 清除 shell 命令缓存
```

再来查：

```
bashCopy
which sms2
```

现在应该变为类似：

```
plaintextCopy
/Users/<用户名>/.yarn/bin/sms2
```

✅ 成功使用你的本地 link 版本。

------

### ✅ 方式 2：删除旧版本冲突文件（临时方案）

如果你确定不需要 `/opt/homebrew/bin/sms2`：

```
bashCopy
sudo rm /opt/homebrew/bin/sms2
```

然后刷新命令缓存：

```
bashCopy
hash -r
```

> ⚠️ 删除前建议确认：
>
> ```
> bashCopy
> ls -l /opt/homebrew/bin/sms2
> ```
>
> 确认它只是个旧的软链接（不是别的命令）

------

### ✅ 方式 3：直接用完整路径执行（一次性调试）

临时场景可以：

```
bashCopy
$(yarn global bin)/sms2
```

或

```
bashCopy
node /Users/<用户名>/workspace/space-megaserver/bin/sms2
```

这样确保执行的就是你本地工程内的 CLI。

------

## 🧠 三、原理小结

`which` 查找命令的逻辑就是按照 `$PATH` 从前往后匹配第一个符合的文件，
所以要么删掉旧路径，要么让 `$PATH` 里 `yarn global bin` 在前。

------

## ✅ 一句话总结

> 出现 `/opt/homebrew/bin/sms2` 是因为 Homebrew 的路径优先于 Yarn global bin。
>
> 想让终端用本地 yarn link 版本：
>
> 1. `echo $(yarn global bin)` 确认路径；
> 2. 把它加入 PATH 最前面（`export PATH="$(yarn global bin):$PATH"`）；
> 3. `hash -r` 刷新缓存，再执行 `which sms2` 验证。

------

### 💡 记忆口诀

> ⚙️ 路径先后决定执行版本
> 🧱 `yarn global bin` 放最前，Homebrew 靠后





我的配置文件中有 # 路径配置 # Homebrew case ":$PATH:" in  *":/opt/homebrew/bin:"*) ;;  *) export PATH="/opt/homebrew/bin:$PATH" ;; esac # Cursor agent case ":$PATH:" in  *":$HOME/.local/bin:"*) ;;  *) export PATH="$HOME/.local/bin:$PATH" ;; esac



你这段 shell 代码确实说明了一件事👇

> 当前 PATH 配置里，`/opt/homebrew/bin` 被放在最前面。
> 所以当你在终端敲 `sms2` 时，`which` 首先命中了 `/opt/homebrew/bin/sms2`，
> 而不是后面 `yarn link --global` 生成的那个链接。

------

## 🧠 解释一下你的代码

```
bashCopy
# Homebrew
case ":$PATH:" in
  *":/opt/homebrew/bin:"*) ;;
  *) export PATH="/opt/homebrew/bin:$PATH" ;;
esac
```

这段意思是：
如果 PATH 中还没有 `/opt/homebrew/bin`，
就把它添加到最前面。

⚙️ 结果：Homebrew 的命令路径 排在最前。

------

## ✅ 解决方法：让 Yarn 路径排到 Homebrew 前面

在你的配置文件（比如 `~/.zshrc` 或 `~/.bashrc`）里，
在这段 Homebrew 配置 之后，再加一段：

```
bashCopy
# Yarn global bin 放到最前面
YARN_GLOBAL_BIN=$(yarn global bin 2>/dev/null)
case ":$PATH:" in
  *":$YARN_GLOBAL_BIN:"*) ;;
  *) export PATH="$YARN_GLOBAL_BIN:$PATH" ;;
esac
```

这会把 Yarn 的全局 bin 路径（通常是 `~/.yarn/bin`）
插进 PATH 最前面。

------

## 🚀 让配置生效

保存文件后执行：

```
bashCopy
source ~/.zshrc     # 或 source ~/.bashrc
hash -r             # 刷新 shell 命令缓存
```

再查看：

```
bashCopy
echo $PATH
which sms2
```

输出应该显示：

```
plaintextCopy
/Users/<用户名>/.yarn/bin/sms2
```

------

## ⚙️ 临时验证（不改配置）

如果你只想临时让 yarn 的路径优先一次，可以在当前 shell 里手动执行：

```
bashCopy
export PATH="$(yarn global bin):$PATH"
hash -r
which sms2
```

此时就会找到你 yarn link 对应的本地二进制。

------

### ✅ 小结

| 操作                    | 命令/配置                                |
| :---------------------- | :--------------------------------------- |
| 查看 Yarn 全局 bin 路径 | `yarn global bin`                        |
| 临时调整路径            | `export PATH="$(yarn global bin):$PATH"` |
| 永久调整 PATH           | 在 `~/.zshrc` 添加上面 Yarn 配置段       |
| 应用配置 & 刷新缓存     | `source ~/.zshrc && hash -r`             |
| 验证路径来源            | `which sms2`                             |

------

💡 一句话解释你的现象：

> 你的 shell 启动脚本把 Homebrew 路径放在 PATH 最前，
> Yarn link 生成的 bin 路径排在后面。
> 调整 PATH 顺序或刷新缓存即可让系统优先使用 本地 `sms2`。





11:56:06 with user in ~ via ⬢ v22.19.0 took 1m 59.5s ➜ export PATH="$(yarn global bin):$PATH" warning package.json: No license field 11:56:13 with user in ~ ➜ hash -r 11:56:22 with user in ~ ➜ which sms2 /opt/homebrew/bin/sms2



你这一步一步做是对的，只是目前结果还是指向 `/opt/homebrew/bin/sms2`，
说明 PATH 顺序还没真正在当前 shell 生效 ——Homebrew 那一段仍然排在 Yarn bin 前。

让我们确认并彻底修正👇

------

## 🧩 一、查看当前 PATH 具体顺序

执行下面两行，看看路径里 Yarn bin 在哪：

```
bashCopy
echo $(yarn global bin)
echo $PATH | tr ':' '\n'
```

- `echo $(yarn global bin)` → 会打印出类似：

  ```
  plaintextCopy
  /Users/user/.yarn/bin
  ```

- 然后 `echo $PATH | tr ':' '\n'`
  会一行一行打印 PATH 中的目录。

🔍 请看 Yarn 路径在 `/opt/homebrew/bin` 前还是后。

------

## 🧠 二、如果 Yarn 路径还在 Homebrew 后面

那说明你在 `.zshrc` 或 某个启动脚本里执行了像下面这样的代码：

```
bashCopy
# Homebrew
export PATH="/opt/homebrew/bin:$PATH"
```

这个每次登录都会把 Homebrew 路径「插入最前面」。
所以你即使再运行临时 `export PATH=...` 命令，
下一次新开终端还是 Homebrew 在前。

------

## ⚙️ 三、修复方案（几种选择）

### ✅ 方案 1 ：一劳永逸（推荐）

在 `~/.zshrc` Homebrew 那段之后，加上这一段：

```
bashCopy
# --- YARN bin 路径优先 ---
YARN_GLOBAL_BIN=$(yarn global bin 2>/dev/null)
case ":$PATH:" in
  *":$YARN_GLOBAL_BIN:"*) ;;
  *) export PATH="$YARN_GLOBAL_BIN:$PATH" ;;
esac
```

然后执行：

```
bashCopy
source ~/.zshrc
hash -r
which sms2
```

现在应该会得到：

```
plaintextCopy
/Users/user/.yarn/bin/sms2
```

------

### ✅ 方案 2 ：临时解决（当前 session 生效）

手动让 yarn 路径优先一次：

```
bashCopy
export PATH="$(yarn global bin):$PATH"
hash -r
which sms2
```

如果还是不变，说明 Homebrew bin 在 PATH 里重复出现了两次，并且 `hash` 缓存没有清干净。

可以先清除命令缓存：

```
bashCopy
hash -d sms2 2>/dev/null
rehash
which sms2
```

这会强制 shell 重新查找 sms2。

------

### ✅ 方案 3 ：彻底删除旧的 Homebrew 版本（可选）

如果确定 `/opt/homebrew/bin/sms2` 是早期全局安装的旧链接：

```
bashCopy
ls -l /opt/homebrew/bin/sms2
sudo rm /opt/homebrew/bin/sms2
hash -r
which sms2
```

删除后 `which` 就只会找到你现在 PATH 里别的同名命令。

------

## 🔍 四、确认成功

最后验证路径：

```
bashCopy
which sms2
ls -l $(which sms2)
```

应该类似于：

```
plaintextCopy
/Users/user/.yarn/bin/sms2 -> /Users/user/workspace/space-megaserver/bin/sms2
```

🎉 说明现在调用的就是你本地 yarn link 版本。

------

### ✅ 一句话总结

> `which sms2` 还是 `/opt/homebrew/bin/sms2` 说明当前 PATH 顺序仍然是 Homebrew 优先。
>
> 把 `$(yarn global bin)` 放到 PATH 最前、刷新缓存 (`hash -r`) 或删除旧的可执行文件后，
> 你终端里的 `sms2` 就会使用 你本地的 yarn link 版本了。





➜ yarn global bin 2>/dev/null /opt/homebrew/bin



👍 这个输出说明了一切关键点：

> 💡 现在你的 Yarn global bin 其实已经被 Homebrew 的 Yarn 指向了 `/opt/homebrew/bin`！
> 所以当你执行 `yarn link --global` 或 `yarn global add`，Yarn 会在 `/opt/homebrew/bin` 下创建软链接。
>
> 这就是为什么无论你怎么 `export PATH`、`hash -r`，`which sms2` 一直是 `/opt/homebrew/bin/sms2` —— 它其实确实就在那个目录下面。

------

## 一、为什么会这样？

你是通过 Homebrew 安装 Yarn 的：

```
bashCopy
brew install yarn
```

默认 Homebrew 版 Yarn 的全局 bin 和 brew 自己安装的可执行文件在同一个位置：`/opt/homebrew/bin`。

👉 换句话说：

- 你看到 `/opt/homebrew/bin/sms2`

  ```
  plaintextCopy
  /opt/homebrew/bin/sms2 -> /opt/homebrew/Cellar/yarn/.../.config/yarn/global/node_modules/@xiami/space-megaserver/bin/sms2
  ```

  它并不是完全错误的，只是它现在关联的是 Homebrew Yarn 管理的 “global” 目录。

------

## 二、要想让 `yarn link --global` 使用你本地代码，有两个方案 👇

------

### ✅ 方案 1：保留 Homebrew Yarn，直接替换全局的 symlink

直接让全局的 `/opt/homebrew/bin/sms2` 链接到你的本地项目。

```
bashCopy
# 删除旧的全局 link
rm /opt/homebrew/bin/sms2
rm /opt/homebrew/bin/sms2-daemon

# 手动创建软链接到你的本地包
ln -s ~/workspace/space-megaserver/bin/sms2 /opt/homebrew/bin/sms2
ln -s ~/workspace/space-megaserver/bin/sms2-daemon /opt/homebrew/bin/sms2-daemon

# 验证
which sms2
ls -l $(which sms2)
```

✅ 这样你任何地方执行 `sms2`，都会使用你本地源码目录下的可执行文件。

------

### ✅ 方案 2：自定义 Yarn global bin 目录，让它脱离 Homebrew

设置 Yarn 使用独立的 global bin 路径：

```
bashCopy
mkdir -p ~/.yarn-global/bin
yarn config set prefix ~/.yarn-global
```

现在再查：

```
bashCopy
yarn global bin
```

输出应该变为：

```
plaintextCopy
/Users/<you>/.yarn-global/bin
```

然后重新 link：

```
bashCopy
cd ~/workspace/space-megaserver
yarn link --global
```

最后更新 PATH，把这段放进你的 `~/.zshrc`：

```
bashCopy
export PATH="$HOME/.yarn-global/bin:$PATH"
```

刷新：

```
bashCopy
source ~/.zshrc
hash -r
which sms2
```

✅ 现在输出就会是：

```
plaintextCopy
/Users/<you>/.yarn-global/bin/sms2
```

并且它会指到你的本地项目。

------

## 🧠 三、总结对比

| 需求                            | 方案                                             |
| :------------------------------ | :----------------------------------------------- |
| 临时调试 / 快速生效             | 替换 `/opt/homebrew/bin/sms2` 的软链接           |
| 彻底解决 / 独立控制 Yarn global | 新建自己的 Yarn global prefix (`~/.yarn-global`) |

------

### ✅ 推荐做法

> 运行：
>
> ```
> bashCopy
> mkdir -p ~/.yarn-global/bin
> yarn config set prefix ~/.yarn-global
> export PATH="$HOME/.yarn-global/bin:$PATH"
> ```
>
> 这样你的全局 Yarn 环境与 Homebrew 完全解耦，
> 以后 `yarn link --global` 和 `yarn global add` 都不依赖 `/opt/homebrew/bin`。





我的路径配置之前是 # 路径配置 # Homebrew case ":$PATH:" in  *":/opt/homebrew/bin:"*) ;;  *) export PATH="/opt/homebrew/bin:$PATH" ;; esac # Cursor agent case ":$PATH:" in  *":$HOME/.local/bin:"*) ;;  *) export PATH="$HOME/.local/bin:$PATH" ;; esac 怎么兼容的加上 export PATH="$HOME/.yarn-global/bin:$PATH"



非常好的问题 👍！
你现在的 PATH 配置是通过 `case` 语法防止重复添加路径的；
如果你想保持相同风格，同时兼容地加入 `~/.yarn-global/bin`，可以直接仿照已有写法来加一段即可 👇

------

### ✅ 推荐改法（保持与现有一致的风格）

```
bashCopy
# 路径配置

# Homebrew
case ":$PATH:" in
  *":/opt/homebrew/bin:"*) ;;
  *) export PATH="/opt/homebrew/bin:$PATH" ;;
esac

# Cursor agent
case ":$PATH:" in
  *":$HOME/.local/bin:"*) ;;
  *) export PATH="$HOME/.local/bin:$PATH" ;;
esac

# Yarn global（新添加）
case ":$PATH:" in
  *":$HOME/.yarn-global/bin:"*) ;;
  *) export PATH="$HOME/.yarn-global/bin:$PATH" ;;
esac
```

这样可以确保：

- 不论你重复 `source ~/.zshrc` 或开多少终端，都不会重复追加同一路径；
- 各路径都能并存；
- Yarn global 的路径会在 Homebrew、Cursor 之后追加（或你要更高优先级，也可以放到 Homebrew 之前）。

------

### 🧠 如果你希望 Yarn 命令优先级最高

> 那就把这一块移动到 Homebrew 那段前面（PATH 是“从左到右”优先匹配的）

```
bashCopy
# Yarn global（放最前面，优先级最高）
case ":$PATH:" in
  *":$HOME/.yarn-global/bin:"*) ;;
  *) export PATH="$HOME/.yarn-global/bin:$PATH" ;;
esac
```

然后再是 Homebrew、Cursor 部分。

------

### ✅ 验证

保存并执行：

```
bashCopy
source ~/.zshrc
hash -r
```

再查看：

```
bashCopy
echo $PATH
which sms2
```

✅ 如果输出类似：

```
plaintextCopy
/Users/<你用户名>/.yarn-global/bin/sms2
```

说明 Yarn global bin 已经生效。

------

### 💡 一句话总结

> 保留原有 `case` 写法，仿照添加一段：
>
> ```
> bashCopy
> case ":$PATH:" in
>   *":$HOME/.yarn-global/bin:"*) ;;
>   *) export PATH="$HOME/.yarn-global/bin:$PATH" ;;
> esac
> ```
>
> 放在适当位置即可兼容 Homebrew 与 Cursor 的配置。