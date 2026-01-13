# 项目结构分析

## 项目概述

本项目是从 npm `ppt` 包 fork 下来的，原本是一个 CLI 程序。现在已经改造为支持在 Node.js 环境中使用的库，可以：
- 从文件路径或 Buffer 读取 PPT 文件
- 输出纯文本字符串或保存到文本文件

## 目录结构

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
│   ├── 80_ppt.js          # 核心PPT处理逻辑（process_ppt, readFile, readBuffer）
│   ├── 90_utils.js        # 工具函数（to_text, toTextString, writeTextFile）
│   ├── 98_exports.js      # 导出函数（extractText API）
│   └── 99_footer.js       # 文件尾，闭合命名空间
├── dist/                   # 构建输出目录
├── test_files/            # 测试文件
├── ppt.js                 # 合并后的主文件（由 Makefile 生成）
├── package.json           # 项目配置
├── Makefile               # 构建脚本（Linux/Mac）
└── README.md              # 项目说明

```

## 核心文件说明

### 1. `bits/80_ppt.js` - 核心PPT处理

包含以下关键函数：
- `process_ppt(ppt, opts)`: 处理CFB对象，解析PPT结构
- `readFile(filename, opts)`: 从文件路径读取PPT文件
- `readBuffer(buffer, opts)`: 从Buffer读取PPT文件（新增）

### 2. `bits/90_utils.js` - 工具函数

包含以下函数：
- `to_text(pres)`: 将PPT对象转换为文本数组
- `toTextString(pres, separator)`: 将PPT对象转换为文本字符串（新增）
- `writeTextFile(text, outputPath, encoding)`: 将文本写入文件（新增）

### 3. `bits/98_exports.js` - 导出和统一API

包含：
- 所有函数的导出
- `PPT.extractText(input, options)`: 统一的文本提取API（新增）
  - 支持文件路径或Buffer输入
  - 支持返回字符串或写入文件

### 4. `ppt.js` - 合并后的主文件

由 Makefile 将所有 `bits/*.js` 文件按字母顺序合并生成。这是实际被引用的主文件。

## 新增功能

### 1. Buffer 支持

**新增函数：** `PPT.readBuffer(buffer, opts)`

允许从 Buffer 读取 PPT 文件，而不是只能从文件路径读取。

```javascript
var fs = require('fs');
var buffer = fs.readFileSync('file.ppt');
var pres = PPT.readBuffer(buffer);
```

### 2. 文本字符串输出

**新增函数：** `PPT.utils.toTextString(pres, separator)`

将文本数组转换为字符串，而不是只返回数组。

```javascript
var pres = PPT.readFile('file.ppt');
var text = PPT.utils.toTextString(pres, '\n');
```

### 3. 文件输出

**新增函数：** `PPT.utils.writeTextFile(text, outputPath, encoding)`

将文本写入文件。

```javascript
PPT.utils.writeTextFile('文本内容', 'output.txt', 'utf8');
```

### 4. 统一API

**新增函数：** `PPT.extractText(input, options)`

统一的文本提取API，支持所有输入输出方式。

```javascript
// 从文件读取，返回字符串
var text = PPT.extractText('file.ppt');

// 从Buffer读取，返回字符串
var text = PPT.extractText(buffer);

// 从文件读取，写入文件
PPT.extractText('file.ppt', { outputPath: 'output.txt' });

// 从Buffer读取，写入文件
PPT.extractText(buffer, { outputPath: 'output.txt' });
```

## 构建流程

1. **Makefile 构建**（Linux/Mac）:
   ```bash
   make
   ```
   执行 `cat bits/*.js > ppt.js`，将所有模块合并

2. **npm 脚本构建**（跨平台）:
   ```bash
   npm run build
   ```
   使用 Node.js 脚本合并文件

3. **手动构建**（Windows PowerShell）:
   ```powershell
   Get-Content bits\*.js | Set-Content ppt.js -Encoding UTF8
   ```

## 依赖关系

- `cfb`: 用于读取复合文件格式（PPT文件格式）
- `codepage`: 用于字符编码转换
- `commander`: CLI工具使用（可选）

## 使用方式

### 作为 Node.js 模块

```javascript
var PPT = require('./ppt');

// 使用统一API
var text = PPT.extractText('file.ppt');
```

### 作为 CLI 工具

```bash
node bin/ppt.njs file.ppt
```

## 代码组织原则

1. **模块化**: 代码按功能拆分到 `bits/` 目录下的多个文件
2. **命名空间**: 所有代码都在 `PPT` 对象下
3. **构建时合并**: 开发时使用模块化文件，运行时使用合并后的 `ppt.js`
4. **向后兼容**: 保留了原有的 `readFile` 和 `to_text` 等API

