[Quickstart](https://docs.anthropic.com/en/docs/claude-code/quickstart)

```bash
export ANTHROPIC_BASE_URL="http://compass.llm.xiami.io/compass-api/v1"
export ANTHROPIC_AUTH_TOKEN="api-key-from-comppas-llm"
export ANTHROPIC_MODEL="claude-sonnet-4@20250514"
export ANTHROPIC_SMALL_FAST_MODEL="claude-3-5-haiku@20241022"
```





[claude-code-log](https://github.com/daaain/claude-code-log) 

+ A Python CLI tool that converts Claude Code transcript JSONL files into readable HTML format.

+ ```bash
  14:13:45 with tingting.liu in ~ via ⬢ v20.18.1
  ➜ brew install uv
  ==> Downloading https://formulae.brew.sh/api/formula.jws.json
  ==> Downloading https://formulae.brew.sh/api/cask.jws.json
  ==> Fetching downloads for: uv
  ==> Downloading https://ghcr.io/v2/homebrew/core/uv/manifests/0.8.12
  ################################################################################################################### 100.0%
  ==> Fetching uv
  ==> Downloading https://ghcr.io/v2/homebrew/core/uv/blobs/sha256:ad8503ecc440b956a5bcff2428909664c9141763afe558058a6b3f400
  ################################################################################################################### 100.0%
  ==> Pouring uv--0.8.12.arm64_ventura.bottle.tar.gz
  🍺  /opt/homebrew/Cellar/uv/0.8.12: 17 files, 37.6MB
  ==> Running `brew cleanup uv`...
  Disable this behaviour by setting `HOMEBREW_NO_INSTALL_CLEANUP=1`.
  Hide these hints with `HOMEBREW_NO_ENV_HINTS=1` (see `man brew`).
  ==> No outdated dependents to upgrade!
  ==> Caveats
  zsh completions have been installed to:
    /opt/homebrew/share/zsh/site-functions
  
  14:15:07 with tingting.liu in ~ via ⬢ v20.18.1 took 12.6s
  ➜ uv --version
  uv 0.8.12 (Homebrew 2025-08-18)
  
  14:15:13 with tingting.liu in ~ via ⬢ v20.18.1
  ➜ uvx --version
  uvx 0.8.12 (Homebrew 2025-08-18)
  ```

  ```bash
  cd .claude/projects
  
  uvx claude-code-log@latest --open-browser
  ```




测试

[promptfoo](https://www.promptfoo.dev/docs/providers/anthropic/) 



claude code 解析

[Claude Code 逆向工程研究仓库](https://github.com/shareAI-lab/analysis_claude_code?tab=readme-ov-file)

[Claude Code 模拟](https://github.com/shareAI-lab/Kode/blob/main/README.zh-CN.md)
