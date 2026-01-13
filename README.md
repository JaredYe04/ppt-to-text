# 📄 ppt-to-text

> **Pure JavaScript PowerPoint 97-2003 (.ppt) Parser for Node.js**

[![npm version](https://img.shields.io/npm/v/ppt-to-text)](https://www.npmjs.com/package/ppt-to-text)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D0.8-green.svg)](https://nodejs.org/)

一个纯 JavaScript 实现的 PowerPoint 97-2003 (.ppt) 文件解析器，**无需任何外部依赖或 Office 软件**，即可在 Node.js 环境中直接解析旧版 PPT 文件并提取文本内容。

本项目基于 Microsoft Open Specifications 的 cleanroom 实现，从 npm `ppt` 包 fork 并增强，现已改造为功能完善的 Node.js 库。

---

## ✨ 核心特性

- 🚀 **纯 JavaScript 实现** - 无需 Office 软件或外部依赖
- 📦 **Node.js 原生支持** - 专为 Node.js 环境优化
- 🔄 **多种输入方式** - 支持文件路径和 Buffer 两种输入方式
- 📝 **灵活的输出格式** - 支持文本数组、文本字符串、文件输出
- 🎯 **简单易用的 API** - 提供统一的 `extractText()` 方法
- ✅ **完善的测试框架** - 自动发现测试文件，CI/CD 友好
- 🔒 **向后兼容** - 保持所有原有 API 不变

---

## 📦 安装

```bash
npm install ppt-to-text
```

---

## 🚀 快速开始

### 方式一：使用统一的 `extractText()` API（推荐）

这是最简单、最推荐的使用方式，支持所有输入输出场景：

```javascript
const PPT = require('ppt-to-text');

// 1️⃣ 从文件路径读取，返回文本字符串
const text = PPT.extractText('presentation.ppt');
console.log(text);

// 2️⃣ 从 Buffer 读取，返回文本字符串
const fs = require('fs');
const buffer = fs.readFileSync('presentation.ppt');
const text2 = PPT.extractText(buffer);
console.log(text2);

// 3️⃣ 从文件路径读取，直接保存到文本文件
const outputPath = PPT.extractText('presentation.ppt', {
    outputPath: 'output.txt',
    separator: '\n',
    encoding: 'utf8'
});
console.log('文本已保存到:', outputPath);

// 4️⃣ 从 Buffer 读取，直接保存到文本文件
const outputPath2 = PPT.extractText(buffer, {
    outputPath: 'output2.txt'
});
console.log('文本已保存到:', outputPath2);
```

### 方式二：使用底层 API（更灵活的控制）

如果需要更细粒度的控制，可以使用底层 API：

```javascript
const PPT = require('ppt-to-text');
const fs = require('fs');

// 从文件路径读取
const pres = PPT.readFile('presentation.ppt');

// 或从 Buffer 读取
const buffer = fs.readFileSync('presentation.ppt');
const pres2 = PPT.readBuffer(buffer);

// 转换为文本数组（每张幻灯片一个元素）
const textArray = PPT.utils.to_text(pres);

// 转换为文本字符串
const textString = PPT.utils.toTextString(pres, '\n');

// 写入文件
PPT.utils.writeTextFile(textString, 'output.txt', 'utf8');
```

---

## 📚 API 文档

### `PPT.extractText(input, options)` - 统一文本提取 API ⭐

**最推荐的 API**，支持所有输入输出方式。

**参数：**
- `input`: `string` | `Buffer` - PPT 文件路径或文件内容的 Buffer
- `options`: `object` (可选)
  - `outputPath`: `string` - 如果提供，文本将保存到此文件路径；否则返回文本字符串
  - `separator`: `string` - 文本分隔符，默认为 `"\n"`
  - `encoding`: `string` - 文件编码，默认为 `'utf8'`
  - `readOpts`: `object` - 传递给 `readFile`/`readBuffer` 的选项

**返回值：**
- 如果提供了 `outputPath`，返回文件路径（字符串）
- 否则返回提取的文本字符串

### `PPT.readFile(filename, opts)` - 从文件路径读取

读取 PPT 文件并返回解析后的对象。

```javascript
const pres = PPT.readFile('presentation.ppt');
```

### `PPT.readBuffer(buffer, opts)` - 从 Buffer 读取

从 Buffer 读取 PPT 文件并返回解析后的对象。

```javascript
const fs = require('fs');
const buffer = fs.readFileSync('presentation.ppt');
const pres = PPT.readBuffer(buffer);
```

### `PPT.utils.to_text(pres)` - 转换为文本数组

将解析后的 PPT 对象转换为文本数组，每张幻灯片对应数组中的一个元素。

```javascript
const textArray = PPT.utils.to_text(pres);
// 返回: ['幻灯片1的文本', '幻灯片2的文本', ...]
```

### `PPT.utils.toTextString(pres, separator)` - 转换为文本字符串

将解析后的 PPT 对象转换为文本字符串。

```javascript
const textString = PPT.utils.toTextString(pres, '\n');
// 返回: '幻灯片1的文本\n幻灯片2的文本\n...'
```

### `PPT.utils.writeTextFile(text, outputPath, encoding)` - 写入文本文件

将文本内容写入文件。

```javascript
PPT.utils.writeTextFile(textString, 'output.txt', 'utf8');
```

---

## 🧪 测试

项目包含完善的自动化测试框架，可以自动发现并测试 `test_files/` 目录中的所有 PPT 文件。

### 运行测试

```bash
npm test
```

测试框架会自动：
- ✅ 扫描 `test_files/` 目录及其所有子目录
- ✅ 对每个 PPT 文件运行完整的测试套件
- ✅ 验证所有 API 的功能
- ✅ 显示详细的测试报告

### 测试内容

每个 PPT 文件会运行以下测试：

1. ✅ API 存在性检查
2. ✅ 从文件路径读取
3. ✅ 从 Buffer 读取
4. ✅ 提取文本数组
5. ✅ 提取文本字符串
6. ✅ `extractText()` 从文件路径
7. ✅ `extractText()` 从 Buffer
8. ✅ `extractText()` 写入文件
9. ✅ 文件路径和 Buffer 结果一致性验证

### 添加测试文件

只需将 PPT 文件放入 `test_files/` 目录（支持子目录），测试框架会自动发现并测试：

```
test_files/
  ├── sample1.ppt
  ├── sample2.ppt
  └── subfolder/
      └── sample3.ppt
```

更多测试相关信息，请查看 [test/README.md](test/README.md)。

---

## 🔨 构建

### 基本构建（生成 ppt.js）

```bash
npm run build
```

这会：
1. 自动更新版本号到 `bits/01_version.js`
2. 合并所有 `bits/*.js` 文件到 `ppt.js`

### 完整构建（包含 dist 文件）

如果需要生成压缩版本到 `dist/` 目录（主要用于浏览器环境）：

```bash
npm run build:dist
```

**注意**：`dist/` 目录中的文件主要用于浏览器环境，npm 包发布时不会包含这些文件。

---

## 🛠️ 项目结构

```
ppt-to-text/
├── bin/                    # CLI 入口
│   └── ppt.njs            # 命令行工具入口
├── bits/                   # 源代码模块（按功能拆分）
│   ├── 00_header.js       # 文件头，定义 PPT 对象和命名空间
│   ├── 01_version.js      # 版本信息（从 package.json 生成）
│   ├── 20_helpers.js      # 辅助函数（recordhopper 等）
│   ├── 50_odraw.js        # Office Drawing 相关解析
│   ├── 62_basic.js        # 基础类型解析
│   ├── 63_fstypes.js      # 文件结构类型
│   ├── 64_doctype.js      # 文档类型
│   ├── 65_slidetypes.js   # 幻灯片类型
│   ├── 66_sstypes.js      # 幻灯片显示类型
│   ├── 67_shapetypes.js   # 形状类型
│   ├── 69_text.js         # 文本相关解析
│   ├── 70_external.js     # 外部对象类型
│   ├── 71_misctypes.js    # 其他类型
│   ├── 75_parsetab.js     # 解析表（RecordEnum）
│   ├── 80_ppt.js          # 核心PPT处理逻辑
│   ├── 90_utils.js        # 工具函数
│   ├── 98_exports.js      # 导出函数（extractText API）
│   └── 99_footer.js       # 文件尾，闭合命名空间
├── dist/                   # 构建输出目录（浏览器版本）
├── test/                   # 测试框架
│   ├── index.js           # 测试主文件
│   └── README.md          # 测试文档
├── test_files/            # 测试文件目录
├── ppt.js                 # 合并后的主文件（由构建脚本生成）
├── package.json           # 项目配置
└── scripts/               # 构建脚本
    └── build.js           # 构建脚本
```

---

## 💻 CLI 工具

项目还包含一个命令行工具，可以直接从终端提取 PPT 文本：

```bash
node bin/ppt.njs presentation.ppt
```

---

## 🔄 新增功能

相比原始 `ppt` 包，本项目新增了以下功能：

### 1. Buffer 支持

**新增函数：** `PPT.readBuffer(buffer, opts)`

允许从 Buffer 读取 PPT 文件，无需先写入临时文件，特别适合处理从网络或数据库获取的文件。

### 2. 文本字符串输出

**新增函数：** `PPT.utils.toTextString(pres, separator)`

将文本数组直接转换为字符串，方便直接使用，无需手动 join。

### 3. 文件输出

**新增函数：** `PPT.utils.writeTextFile(text, outputPath, encoding)`

将文本内容直接写入文件，简化文件操作流程。

### 4. 统一 API

**新增函数：** `PPT.extractText(input, options)`

统一的文本提取 API，一个函数支持所有输入输出方式，大大简化使用流程。

---

## 🔒 向后兼容性

所有原有 API 都保持不变，可以放心升级：

- ✅ `PPT.readFile(filename, opts)` - 仍然可用
- ✅ `PPT.utils.to_text(pres)` - 仍然可用
- ✅ CLI 工具 `bin/ppt.njs` - 仍然可用

---

## 🤝 贡献

欢迎贡献代码！由于 Open Specifications Promise 的特殊性，确保代码是 cleanroom 实现非常重要。请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详情。

---

## 📄 许可证

请查看 [LICENSE](LICENSE) 文件了解详情。所有未明确授予 Apache 2.0 许可证的权利均由原作者保留。

原作者认为此代码符合 Microsoft Open Specifications Promise 的条款，与 OpenOffice（受 Apache License v2 管辖）适用相同条款。鉴于该承诺的模糊性，原作者不做出任何法律声明，保证最终用户在未来行动中受到保护。强烈建议在商业用途中，在继续之前咨询律师。

---

## 📚 参考文档

OSP 覆盖的规范：

- [MS-PPT]: PowerPoint (.ppt) Binary File Format
- [MS-ODRAW]: Office Drawing Binary File Format

---

## 🔗 相关链接

- [GitHub Repository](https://github.com/JaredYe04/ppt-to-text)
- [npm Package](https://www.npmjs.com/package/ppt-to-text)

---

**Made with ❤️ for Node.js developers who need to parse old PowerPoint files**
