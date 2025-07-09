# GenStoryAI 后端

本项目是 GenStoryAI 的后端服务，基于 FastAPI 构建。

## 安装指南

本指南将引导您在不同操作系统上安装和运行本项目。

### **通用前置要求**

在开始之前，请确保您的系统已经安装了以下软件：

- **Python**: 版本需 >= 3.12, < 4.0。您可以从 [Python 官网](https://www.python.org/downloads/) 下载并安装。
- **Poetry**: 用于项目依赖管理。您可以参考 [Poetry 官方文档](https://python-poetry.org/docs/#installation)进行安装。

### **国际化工具 (可选)**

如果需要处理项目的国际化（i18n）和本地化（l10n），例如编辑 `.po` 翻译文件，您还需要安装 `gettext` 工具集。

- **Windows**:
  - 从 [这个网站](https://mlocati.github.io/gettext-iconv-windows/) 下载最新的 `gettext` zip 压缩包。
  - 解压后，将其中的 `bin` 目录路径添加到系统的 `Path` 环境变量中。

- **Linux (Debian/Ubuntu)**:
  ```bash
  sudo apt-get update && sudo apt-get install -y gettext
  ```

- **Linux (Fedora/CentOS/RHEL)**:
  ```bash
  sudo dnf install -y gettext
  # 或者在旧版系统上使用 yum
  # sudo yum install -y gettext
  ```

- **macOS**:
  ```bash
  brew install gettext
  ```
  安装后，Homebrew 可能会提示您需要将 `gettext` 添加到您的 `PATH` 环境变量中，请根据提示执行相应命令，例如：
  ```bash
  echo 'export PATH="/opt/homebrew/opt/gettext/bin:$PATH"' >> ~/.zshrc
  source ~/.zshrc
  ```
  *(请根据您使用的 Shell 和 Homebrew 的安装路径自行调整)*

---

### **Windows 安装步骤**

1.  **克隆代码库**
    打开 PowerShell 或 CMD，将代码库克隆到本地：
    ```bash
    git clone <your-repository-url>
    cd genstoryai/backend/genstoryai_backend
    ```

2.  **安装项目依赖**
    使用 Poetry 安装所有依赖项。
    ```bash
    poetry install
    ```

3.  **配置环境变量**
    项目中包含一个 `.env.template` 文件，您需要复制一份并重命名为 `.env`。
    ```powershell
    copy .env.template .env
    ```
    然后，使用文本编辑器打开 `.env` 文件，根据您的环境（例如数据库连接信息、密钥等）填写所有必要的变量。

4.  **运行应用**
    在 `backend/genstoryai_backend` 目录下，运行以下命令启动服务：
    ```bash
    poetry run start
    ```
    服务默认将在 `http://127.0.0.1:80` 启动。

---

### **Linux / macOS 安装步骤**

1.  **克隆代码库**
    打开终端，将代码库克隆到本地：
    ```bash
    git clone <your-repository-url>
    cd genstoryai/backend/genstoryai_backend
    ```

2.  **安装项目依赖**
    使用 Poetry 安装所有依赖项。
    ```bash
    poetry install
    ```

3.  **配置环境变量**
    项目中包含一个 `.env.template` 文件，您需要复制一份并重命名为 `.env`。
    ```bash
    cp .env.template .env
    ```
    然后，使用您喜欢的文本编辑器（如 `vim` 或 `nano`）打开 `.env` 文件，根据您的环境（例如数据库连接信息、密钥等）填写所有必要的变量。

4.  **运行应用**
    在 `backend/genstoryai_backend` 目录下，运行以下命令启动服务：
    ```bash
    poetry run start
    ```
    服务默认将在 `http://127.0.0.1:80` 启动。

---

## Ollama 本地大模型配置 (可选)

如果希望使用本地大语言模型（LLM）来驱动 AI 功能，本项目支持通过 [Ollama](https://ollama.com/) 进行部署。请遵循以下步骤进行配置。

### 1. 安装 Ollama

首先，您需要在您的电脑上安装 Ollama。

- **Windows / macOS**:
  - 前往 [Ollama 官方下载页面](https://ollama.com/download) 下载对应的安装包并进行安装。

- **Linux**:
  - 在终端中运行以下命令进行安装：
    ```bash
    curl -fsSL https://ollama.com/install.sh | sh
    ```
安装完成后，Ollama 服务将在后台自动运行。

### 2. 下载模型

接下来，下载项目所需的 `qwen3:4b` 模型。

打开终端或 PowerShell，运行以下命令：
```bash
ollama pull qwen3:4b
```
这将会从 Ollama Hub 下载模型到您的本地。您也可以在 [Ollama Library](https://ollama.com/library) 查找并使用其他模型。

### 3. 配置环境变量

本项目通过一个兼容 OpenAI 的 API 接口来连接到 Ollama 服务。您需要在 `.env` 文件中配置以下变量：

- `OPENAI_API_KEY`: 对于本地 Ollama 服务，API 密钥不是必需的，您可以填写任意字符串，例如 `123456`。
- `OPENAI_BASE_URL`: 这是您本地 Ollama 服务的地址。默认情况下，它应该是 `http://localhost:11434/v1`。
- `OPENAI_MODEL`: 指定要使用的模型名称，这里我们使用 `qwen3:4b`。

请确保您的 `.env` 文件中有类似以下的配置：
```env
# .env file
OPENAI_API_KEY=123456
OPENAI_BASE_URL="http://localhost:11434/v1"
OPENAI_MODEL="qwen3:4b"
```

完成以上步骤后，当您启动后端服务时，它将能够连接到本地的 Ollama 大语言模型。

## 项目结构

- `genstoryai_backend/`: FastAPI 应用的主要代码目录。
- `pyproject.toml`: 项目依赖和配置。
- `.env`: 环境变量文件（需要自行创建）。
- `tests/`: 测试用例目录。

## 主要技术栈

- FastAPI
- Uvicorn
- SQLModel
- Poetry
