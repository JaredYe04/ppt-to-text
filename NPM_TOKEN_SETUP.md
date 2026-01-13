# NPM Token 设置指南

## 问题

如果遇到以下错误：
```
npm error 403 403 Forbidden - PUT https://registry.npmjs.org/ppt-to-text
npm error 403 Two-factor authentication or granular access token with bypass 2fa enabled is required
```

这是因为 npm 现在要求使用 **Granular Access Token** 并启用 **Bypass 2FA** 选项。

## 解决方案

### 步骤 1: 创建 Granular Access Token

1. **登录 npm**
   - 访问 https://www.npmjs.com/
   - 使用你的 npm 账号登录

2. **进入 Access Tokens 页面**
   - 点击右上角头像
   - 选择 **"Access Tokens"**

3. **创建新 Token**
   - 点击 **"Generate New Token"**
   - 选择 **"Granular Access Token"**（不是 Classic Token）

4. **配置 Token**
   ```
   Token name: ppt-to-text-publish (或任何你喜欢的名称)
   Expiration: 选择合适的时间（建议至少 1 年）
   Type: Automation
   Packages: 
     - 选择 "Select packages" 并选择 ppt-to-text
     - 或选择 "All packages"
   Permissions:
     ✅ Read and write (必须)
     ✅ Bypass 2FA (必须启用！)
   ```

5. **生成并复制 Token**
   - 点击 **"Generate Token"**
   - **重要**：立即复制 token（只显示一次，无法再次查看）
   - 如果丢失，需要重新创建

### 步骤 2: 在 GitHub 中添加 Secret

1. **进入 GitHub 仓库**
   - 打开你的仓库页面
   - 点击 **Settings** > **Secrets and variables** > **Actions**

2. **添加新 Secret**
   - 点击 **"New repository secret"**
   - **Name**: `NPM_TOKEN`（必须完全一致）
   - **Value**: 粘贴刚才复制的 npm token
   - 点击 **"Add secret"**

### 步骤 3: 验证配置

1. **检查 Secret 是否存在**
   - 在 Secrets 列表中应该能看到 `NPM_TOKEN`

2. **测试发布**
   - 在 GitHub Actions 中手动触发 "Publish to npm" 工作流
   - 如果配置正确，应该能成功发布

## 常见问题

### Q: 为什么必须使用 Granular Access Token？

A: npm 从 2024 年开始要求使用 Granular Access Token 来发布包，Classic Token 不再支持发布操作。

### Q: 为什么必须启用 Bypass 2FA？

A: GitHub Actions 是自动化环境，无法进行交互式 2FA 验证，所以必须启用 Bypass 2FA 选项。

### Q: Token 过期了怎么办？

A: 需要重新创建新的 Token 并更新 GitHub Secret。

### Q: 如何检查 Token 是否有效？

A: 可以在本地测试：
```bash
npm whoami --registry=https://registry.npmjs.org/
# 如果显示你的用户名，说明 Token 有效
```

### Q: 可以给 Token 设置更短的过期时间吗？

A: 可以，但建议至少设置 1 年，避免频繁更新。如果担心安全，可以设置较短的过期时间，但需要定期更新。

## 安全建议

1. ✅ 使用 Granular Access Token 而不是 Classic Token
2. ✅ 只给 Token 必要的权限（Read and write）
3. ✅ 只授权给需要的包（如果可能）
4. ✅ 定期检查 Token 的使用情况
5. ✅ 如果 Token 泄露，立即撤销并创建新的

## 参考链接

- [npm Access Tokens 文档](https://docs.npmjs.com/about-access-tokens)
- [GitHub Actions Secrets 文档](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

