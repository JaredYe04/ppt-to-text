# 工作流说明

## CI 工作流（自动执行）

### 触发条件
- ✅ **Push 到 main/master/develop 分支** - 自动触发
- ✅ **Pull Request 到 main/master/develop 分支** - 自动触发

### 执行步骤
1. 检出代码
2. 在多个 Node.js 版本（16.x, 18.x, 20.x）上并行运行
3. 安装依赖
4. **构建项目** (`npm run build`)
5. **运行测试** (`npm test`)

### 验证
每次 commit 和 push 后，GitHub Actions 会自动运行 CI，确保：
- ✅ 代码可以正常构建
- ✅ 所有测试通过
- ✅ 在多个 Node.js 版本上兼容

---

## 发布工作流（手动触发）

### 触发方式

#### 方式1: 手动触发（推荐）
1. 进入 GitHub 仓库的 **Actions** 页面
2. 选择 **"Publish to npm"** 工作流
3. 点击 **"Run workflow"**
4. 选择版本类型：
   - `patch`: 0.0.2 → 0.1.0
   - `minor`: 0.0.2 → 0.1.0
   - `major`: 0.0.2 → 1.0.0
5. 点击 **"Run workflow"**

#### 方式2: 通过 GitHub Release
1. 创建新的 GitHub Release
2. 填写版本号（例如：v0.1.0）
3. 发布 Release

### 执行步骤（按顺序）

1. **Checkout code** - 检出最新代码
2. **Setup Node.js** - 设置 Node.js 20 环境
3. **Configure Git** - 配置 Git 用户信息
4. **Install dependencies** - 安装依赖
5. **Bump version** - 更新版本号（先更新，确保构建时使用新版本）
6. **Build** - 构建项目（`npm run build`，使用新版本号）
7. **Run tests** - 运行测试（`npm test`）
8. **Publish to npm** - 发布到 npm
9. **Create Git tag** - 创建 Git 标签（仅 workflow_dispatch）
10. **Create GitHub Release** - 创建 GitHub Release（仅 workflow_dispatch）

### 重要说明

✅ **自动构建最新代码**：发布工作流会：
- 检出最新的代码
- 更新版本号
- 构建项目（确保使用最新代码和版本号）
- 运行测试
- 发布到 npm

✅ **版本号管理**：
- 手动触发时：自动根据选择的类型（patch/minor/major）更新版本号
- Release 触发时：使用 Release 标签中的版本号

✅ **安全性**：
- 发布前必须通过测试
- 需要配置 `NPM_TOKEN` Secret

---

## 工作流验证清单

### CI 工作流
- [x] 在 push 时自动触发
- [x] 在 pull request 时自动触发
- [x] 在多个 Node.js 版本上测试
- [x] 自动构建和测试

### 发布工作流
- [x] 支持手动触发（workflow_dispatch）
- [x] 支持通过 Release 触发
- [x] 自动更新版本号
- [x] 自动构建最新代码
- [x] 自动运行测试
- [x] 自动发布到 npm
- [x] 自动创建 Git tag 和 Release

---

## 使用示例

### 日常开发流程

```bash
# 1. 开发代码
git add .
git commit -m "feat: add new feature"
git push origin main

# 2. CI 自动运行
# - GitHub Actions 自动触发 CI
# - 在多个 Node.js 版本上测试
# - 验证构建和测试通过
```

### 发布流程

```bash
# 1. 确保代码已提交
git push origin main

# 2. 在 GitHub 上手动触发发布
# - 进入 Actions > Publish to npm
# - 选择版本类型（patch/minor/major）
# - 点击 Run workflow

# 3. 工作流自动执行
# - 更新版本号
# - 构建最新代码
# - 运行测试
# - 发布到 npm
# - 创建 tag 和 Release
```

---

## 故障排查

### CI 失败
- 检查代码是否有语法错误
- 确保所有测试通过
- 查看 GitHub Actions 日志

### 发布失败
- 确保已配置 `NPM_TOKEN` Secret
- 检查版本号是否已存在
- 确保所有测试通过
- 检查 npm 包名是否可用

---

## 配置要求

### 必需的 GitHub Secrets
- `NPM_TOKEN`: npm 访问令牌（用于发布）

### 分支保护（推荐）
- 要求 CI 通过后才能合并 PR
- 保护 main/master 分支

