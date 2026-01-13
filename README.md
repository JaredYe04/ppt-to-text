# ppt-to-text

Parser and writer for PowerPoint PPT files. Pure-JS cleanroom implementation from the Microsoft Open Specifications and related documents.

本项目是从 npm `ppt` 包 fork 下来的，原本是一个 CLI 程序。现在已经改造为支持在 Node.js 环境中使用的库，可以：
- 从文件路径或 Buffer 读取 PPT 文件
- 输出纯文本字符串或保存到文本文件

## Installation

In [nodejs](https://www.npmjs.org/package/ppt):

    npm install

## 项目结构

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
└── Makefile               # 构建脚本（Linux/Mac）
```

## 主要 API

### 1. `PPT.extractText(input, options)` - 统一的文本提取API（推荐）

这是最推荐的API，支持所有输入输出方式。

**参数：**
- `input`: `string` (文件路径) 或 `Buffer` (文件内容)
- `options`: 可选配置对象
  - `outputPath`: `string` - 如果提供，文本将保存到此文件路径；否则返回文本字符串
  - `separator`: `string` - 文本分隔符，默认为 `"\n"`
  - `encoding`: `string` - 文件编码，默认为 `'utf8'`
  - `readOpts`: `object` - 传递给 `readFile`/`readBuffer` 的选项

**返回值：**
- 如果提供了 `outputPath`，返回文件路径（字符串）
- 否则返回提取的文本字符串

**示例：**

```javascript
var PPT = require('./ppt');

// 示例1: 从文件路径读取，返回纯文本字符串
var text = PPT.extractText('path/to/file.ppt');
console.log(text);

// 示例2: 从Buffer读取，返回纯文本字符串
var fs = require('fs');
var buffer = fs.readFileSync('path/to/file.ppt');
var text2 = PPT.extractText(buffer);
console.log(text2);

// 示例3: 从文件路径读取，输出到文本文件
var outputPath = PPT.extractText('path/to/file.ppt', {
    outputPath: 'output.txt',
    separator: '\n',
    encoding: 'utf8'
});
console.log('文本已保存到:', outputPath);

// 示例4: 从Buffer读取，输出到文本文件
var buffer = fs.readFileSync('path/to/file.ppt');
var outputPath2 = PPT.extractText(buffer, {
    outputPath: 'output2.txt'
});
console.log('文本已保存到:', outputPath2);
```

### 2. `PPT.readFile(filename, opts)` - 从文件路径读取

读取PPT文件并返回解析后的对象。

```javascript
var pres = PPT.readFile('path/to/file.ppt');
var textArray = PPT.utils.to_text(pres);
var textString = PPT.utils.toTextString(pres);
```

### 3. `PPT.readBuffer(buffer, opts)` - 从Buffer读取

从Buffer读取PPT文件并返回解析后的对象。

```javascript
var fs = require('fs');
var buffer = fs.readFileSync('path/to/file.ppt');
var pres = PPT.readBuffer(buffer);
var textString = PPT.utils.toTextString(pres);
```

### 4. `PPT.utils.to_text(pres)` - 转换为文本数组

将解析后的PPT对象转换为文本数组。

### 5. `PPT.utils.toTextString(pres, separator)` - 转换为文本字符串

将解析后的PPT对象转换为文本字符串。

### 6. `PPT.utils.writeTextFile(text, outputPath, encoding)` - 写入文本文件

将文本写入文件。

## 构建

### 基本构建（生成 ppt.js）

使用 npm 脚本（推荐，跨平台）：
```bash
npm run build
```

这会：
1. 自动更新版本号到 `bits/01_version.js`
2. 合并所有 `bits/*.js` 文件到 `ppt.js`

### 完整构建（包含 dist 文件）

如果需要生成压缩版本到 `dist/` 目录：
```bash
npm run build:dist
```

这会额外生成：
- `dist/ppt.js` - 未压缩版本
- `dist/ppt.min.js` - 压缩版本
- `dist/ppt.full.min.js` - 包含 codepage 的完整压缩版本
- 对应的 source map 文件

**注意**：`dist/` 目录中的文件主要用于浏览器环境，npm 包发布时不会包含这些文件（已在 `.npmignore` 中排除）。

### 使用 Makefile（Linux/Mac）

```bash
make          # 生成 ppt.js
make dist     # 生成 dist 文件
```

## CLI Tool

The node module ships with a binary `ppt` that dumps the text content of a PPT presentation. The only argument is the file name:

```
$ node bin/ppt.njs test.ppt
...
```

## 测试

运行测试：

```bash
npm test
```

或直接运行：

```bash
node test.js
```

## CI/CD

项目使用 GitHub Actions 进行持续集成和自动发布。

### CI 工作流

每次 push 或 pull request 时，会自动在多个 Node.js 版本（16.x, 18.x, 20.x）上运行测试。

### 发布到 npm

项目配置了自动发布到 npm 的工作流。详细说明请查看 [PUBLISH.md](PUBLISH.md)。

发布方式：
1. **手动触发**: 在 GitHub Actions 中手动运行 "Publish to npm" 工作流
2. **通过 Release**: 创建 GitHub Release 会自动触发发布

**注意**: 发布前需要在 GitHub Secrets 中配置 `NPM_TOKEN`。

## 依赖关系

- `cfb`: 用于读取复合文件格式（PPT文件格式）
- `codepage`: 用于字符编码转换
- `commander`: CLI工具使用（可选）

## 新增功能

### 1. Buffer 支持

**新增函数：** `PPT.readBuffer(buffer, opts)`

允许从 Buffer 读取 PPT 文件，而不是只能从文件路径读取。

### 2. 文本字符串输出

**新增函数：** `PPT.utils.toTextString(pres, separator)`

将文本数组转换为字符串，方便直接使用。

### 3. 文件输出

**新增函数：** `PPT.utils.writeTextFile(text, outputPath, encoding)`

将文本内容写入文件。

### 4. 统一API

**新增函数：** `PPT.extractText(input, options)`

统一的文本提取API，支持所有输入输出方式。

## 向后兼容性

所有原有API都保持不变：
- `PPT.readFile(filename, opts)` - 仍然可用
- `PPT.utils.to_text(pres)` - 仍然可用
- CLI工具 `bin/ppt.njs` - 仍然可用

## Contributing

Due to the precarious nature of the Open Specifications Promise, it is very important to ensure code is cleanroom. Consult CONTRIBUTING.md

## License

Please consult the attached LICENSE file for details. All rights not explicitly granted by the Apache 2.0 license are reserved by the Original Author.

It is the opinion of the Original Author that this code conforms to the terms of the Microsoft Open Specifications Promise, falling under the same terms as OpenOffice (which is governed by the Apache License v2). Given the vagaries of the promise, the Original Author makes no legal claim that in fact end users are protected from future actions. It is highly recommended that, for commercial uses, you consult a lawyer before proceeding.

## References

OSP-covered specifications:

 - [MS-PPT]: PowerPoint (.ppt) Binary File Format
 - [MS-ODRAW]: Office Drawing Binary File Format
