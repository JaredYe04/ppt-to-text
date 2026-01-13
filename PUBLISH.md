# 发布到 npm 指南

本项目使用 GitHub Actions 自动发布到 npm。

## 准备工作

### 1. 设置 NPM_TOKEN

在 GitHub 仓库的 Settings > Secrets and variables > Actions 中添加 `NPM_TOKEN`：

1. 登录 npm: https://www.npmjs.com/
2. 进入 Account Settings > Access Tokens
3. 创建新的 Access Token（类型选择 "Automation"）
4. 在 GitHub 仓库中添加 Secret，名称为 `NPM_TOKEN`，值为刚才创建的 token

### 2. 确保 package.json 配置正确

- `name`: `ppt-to-text`
- `version`: 当前版本号
- `main`: 指向主入口文件
- `files`: 确保需要发布的文件在 package.json 的 `files` 字段中（或使用 .npmignore）

## 发布方式

### 方式1: 手动触发发布（推荐）

1. 进入 GitHub 仓库的 Actions 页面
2. 选择 "Publish to npm" 工作流
3. 点击 "Run workflow"
4. 选择版本类型：
   - `patch`: 补丁版本（0.0.2 -> 0.0.3）
   - `minor`: 次要版本（0.0.2 -> 0.1.0）
   - `major`: 主要版本（0.0.2 -> 1.0.0）
5. 点击 "Run workflow" 按钮

工作流会自动：
- 运行测试
- 构建项目
- 更新版本号
- 发布到 npm
- 创建 Git tag
- 创建 GitHub Release

### 方式2: 通过 GitHub Release 触发

1. 在 GitHub 仓库创建新的 Release
2. 填写版本号（例如：v0.0.3）
3. 发布 Release

工作流会自动：
- 运行测试
- 构建项目
- 使用 Release 的版本号更新 package.json
- 发布到 npm

## 发布流程

发布工作流会执行以下步骤：

1. **Checkout code** - 检出代码
2. **Setup Node.js** - 设置 Node.js 环境
3. **Configure Git** - 配置 Git 用户信息
4. **Install dependencies** - 安装依赖
5. **Bump version** - 更新版本号（先更新版本，确保构建时使用新版本号）
6. **Build** - 运行 `npm run build` 构建项目（使用新版本号）
7. **Run tests** - 运行 `npm test` 执行测试
8. **Publish to npm** - 发布到 npm
9. **Create Git tag** - 创建 Git 标签（仅 workflow_dispatch）
10. **Create GitHub Release** - 创建 GitHub Release（仅 workflow_dispatch）

## CI 工作流

每次 push 或 pull request 时，CI 工作流会自动：

1. 在多个 Node.js 版本（16.x, 18.x, 20.x）上运行测试
2. 构建项目
3. 运行测试

确保所有测试通过后再发布。

## 注意事项

1. **版本号**: 确保版本号遵循语义化版本（Semantic Versioning）
2. **测试**: 发布前确保所有测试通过
3. **构建**: 确保 `npm run build` 能成功生成 `ppt.js`
4. **文件**: 检查 `.npmignore` 确保不需要的文件不会被发布
5. **权限**: 确保 NPM_TOKEN 有发布权限

## 验证发布

发布后，可以通过以下方式验证：

```bash
npm view ppt-to-text
```

或访问：https://www.npmjs.com/package/ppt-to-text

