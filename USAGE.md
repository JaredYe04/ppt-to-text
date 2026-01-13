# PPT to Text 使用指南

本项目已从原始的 npm `ppt` 包改造，现在支持在 Node.js 环境中：
- 从文件路径或 Buffer 读取 PPT 文件
- 输出纯文本字符串或保存到文本文件

## 安装

```bash
npm install
```

## 主要 API

### 1. `PPT.extractText(input, options)` - 统一的文本提取API

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

**参数：**
- `filename`: `string` - PPT文件路径
- `opts`: `object` - 可选选项

**返回值：** 解析后的PPT对象

**示例：**

```javascript
var pres = PPT.readFile('path/to/file.ppt');
var textArray = PPT.utils.to_text(pres);
var textString = PPT.utils.toTextString(pres);
```

### 3. `PPT.readBuffer(buffer, opts)` - 从Buffer读取

从Buffer读取PPT文件并返回解析后的对象。

**参数：**
- `buffer`: `Buffer` - PPT文件的Buffer
- `opts`: `object` - 可选选项

**返回值：** 解析后的PPT对象

**示例：**

```javascript
var fs = require('fs');
var buffer = fs.readFileSync('path/to/file.ppt');
var pres = PPT.readBuffer(buffer);
var textString = PPT.utils.toTextString(pres);
```

### 4. `PPT.utils.to_text(pres)` - 转换为文本数组

将解析后的PPT对象转换为文本数组。

**参数：**
- `pres`: PPT解析对象

**返回值：** 文本数组

### 5. `PPT.utils.toTextString(pres, separator)` - 转换为文本字符串

将解析后的PPT对象转换为文本字符串。

**参数：**
- `pres`: PPT解析对象
- `separator`: `string` - 分隔符，默认为 `"\n"`

**返回值：** 文本字符串

### 6. `PPT.utils.writeTextFile(text, outputPath, encoding)` - 写入文本文件

将文本写入文件。

**参数：**
- `text`: `string` - 要写入的文本
- `outputPath`: `string` - 输出文件路径
- `encoding`: `string` - 文件编码，默认为 `'utf8'`

**返回值：** 输出文件路径

## 完整示例

查看 `example.js` 文件获取更多使用示例。

## 构建

在 Linux/Mac 上：
```bash
make
```

在 Windows 上（使用 PowerShell）：
```powershell
Get-Content bits\00_header.js,bits\01_version.js,bits\20_helpers.js,bits\50_odraw.js,bits\62_basic.js,bits\63_fstypes.js,bits\64_doctype.js,bits\65_slidetypes.js,bits\66_sstypes.js,bits\67_shapetypes.js,bits\69_text.js,bits\70_external.js,bits\71_misctypes.js,bits\75_parsetab.js,bits\80_ppt.js,bits\90_utils.js,bits\98_exports.js,bits\99_footer.js | Set-Content ppt.js -Encoding UTF8
```

或者添加 npm 脚本后使用：
```bash
npm run build
```

