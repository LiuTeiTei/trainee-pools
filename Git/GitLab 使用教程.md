## Token 鉴权

+ 先在 https://{gitlab host}/-/profile/personal_access_tokens 中创建一个 Personal Access Tokens

+ 修改仓库的 remote 为 https url

  ```bash
  git remote set-url origin https://{gitlab host}/{repoe path}.git
  ```

+ 使用 `url.<base>.insteadOf` 配置，让 Git 自动将所有匹配的 URL 替换为包含 token 的 URL

  ```bash
  git config --global url."https://oauth2:{token}@{gitlab host}/".insteadOf "https://{gitlab host}/"
  ```

+ 检查配置是否生效

  ```bash
  git config --global --get-regexp url
  // url.https://oauth2:{token}@{gitlab host}/.insteadof https://{gitlab host}/
  // 带 token 的 https url
  
  git config --get remote.origin.url
  // https://{gitlab host}/{repoe path}.git
  // 原始的 https url
  
  git remote -v
  // origin	https://oauth2:{token}@{gitlab host}/{repoe path}.git (fetch)
  // origin	https://oauth2:{token}@{gitlab host}/{repoe path}.git (push)
  // 经过 replace 后的 https url
  ```

+ 删除配置

  ```bash
  git config --global --unset url."https://oauth2:{token}@{gitlab host}/".insteadOf
  ```

+ 查看全局配置

  ```bash
  git config --global --list
  ```




## 优点

+ 开源，可以自己搭建
+ 内部集成 CI/CD







