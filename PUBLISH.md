# 发布到 npm 指南

本项目使用 GitHub Actions 自动发布到 npm。

## 准备工作

### 1. 设置 NPM_TOKEN（重要！）

**⚠️ 重要提示**：npm 现在要求使用 **Granular Access Token** 并启用 **"Bypass 2FA"** 选项。如果遇到 403 错误，请查看详细的设置指南。

#### 快速设置步骤：

1. 登录 npm: https://www.npmjs.com/
2. 进入 **Access Tokens** 页面
3. 创建 **Granular Access Token**（不是 Classic Token）
4. 配置时**必须启用 "Bypass 2FA"** 选项
5. 在 GitHub 仓库的 Secrets 中添加 `NPM_TOKEN`

#### 详细设置指南：

请查看 [NPM_TOKEN_SETUP.md](NPM_TOKEN_SETUP.md) 获取完整的步骤说明和常见问题解答。

#### 常见错误：

**错误 403 - Two-factor authentication required**:
- ✅ 确保使用 **Granular Access Token**（不是 Classic Token）
- ✅ 确保启用了 **"Bypass 2FA"** 选项
- ✅ 确保 Token 类型是 **"Automation"**

**错误 403 - Forbidden**:
- 检查 Token 是否有正确的权限（Read and write）
- 检查包名是否已存在且你有权限发布
- 确保 Token 未过期

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
   - `patch`: 补丁版本（0.0.2 -> 0.1.0）
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
2. 填写版本号（例如：v0.1.0）
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

