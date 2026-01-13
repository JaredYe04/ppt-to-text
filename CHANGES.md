# 改造总结

## 改造目标

将原本的 CLI 程序改造为支持在 Node.js 环境中使用的库，可以：
1. 从文件路径或 Buffer 读取 PPT 文件
2. 输出纯文本字符串或保存到文本文件

## 改造内容

### 1. 新增 `readBuffer` 函数

**文件：** `bits/80_ppt.js`

支持从 Buffer 读取 PPT 文件，而不仅仅是从文件路径。

```javascript
function readBuffer(buffer, opts) {
	var ppt = CFB.read(buffer, {type:'buffer'});
	return process_ppt(ppt, opts);
}
```

### 2. 新增 `toTextString` 函数

**文件：** `bits/90_utils.js`

将文本数组转换为字符串，方便直接使用。

```javascript
var toTextString = function(pres, separator) {
	separator = separator || "\n";
	var textArray = to_text(pres);
	return textArray.join(separator);
};
```

### 3. 新增 `writeTextFile` 函数

**文件：** `bits/90_utils.js`

将文本内容写入文件。

```javascript
var writeTextFile = function(text, outputPath, encoding) {
	if(typeof require === 'undefined') {
		throw new Error("writeTextFile requires Node.js fs module");
	}
	var fs = require('fs');
	encoding = encoding || 'utf8';
	fs.writeFileSync(outputPath, text, encoding);
	return outputPath;
};
```

### 4. 新增 `extractText` 统一API

**文件：** `bits/98_exports.js`

提供统一的文本提取API，支持所有输入输出方式。

```javascript
PPT.extractText = function(input, options) {
	// 支持文件路径或Buffer输入
	// 支持返回字符串或写入文件
	// ...
};
```

### 5. 更新导出

**文件：** `bits/98_exports.js`

- 导出 `readBuffer` 函数
- 导出 `extractText` 统一API
- 更新 `utils` 对象，包含新函数

### 6. 添加构建脚本

**文件：** `package.json`

添加了 `npm run build` 脚本，支持跨平台构建。

### 7. 创建文档和示例

- `USAGE.md`: 使用指南
- `PROJECT_STRUCTURE.md`: 项目结构分析
- `example.js`: 使用示例代码
- `CHANGES.md`: 改造总结（本文件）

## API 对比

### 改造前

```javascript
// 只能从文件路径读取
var pres = PPT.readFile('file.ppt');

// 只能返回文本数组
var textArray = PPT.utils.to_text(pres);
console.log(textArray.join('\n')); // 需要手动join
```

### 改造后

```javascript
// 方式1: 从文件路径读取，返回字符串
var text = PPT.extractText('file.ppt');

// 方式2: 从Buffer读取，返回字符串
var buffer = fs.readFileSync('file.ppt');
var text = PPT.extractText(buffer);

// 方式3: 从文件路径读取，写入文件
PPT.extractText('file.ppt', { outputPath: 'output.txt' });

// 方式4: 从Buffer读取，写入文件
PPT.extractText(buffer, { outputPath: 'output.txt' });

// 方式5: 使用底层API
var pres = PPT.readBuffer(buffer);
var text = PPT.utils.toTextString(pres);
PPT.utils.writeTextFile(text, 'output.txt');
```

## 向后兼容性

所有原有API都保持不变：
- `PPT.readFile(filename, opts)` - 仍然可用
- `PPT.utils.to_text(pres)` - 仍然可用
- CLI工具 `bin/ppt.njs` - 仍然可用

## 文件修改清单

1. `bits/80_ppt.js` - 添加 `readBuffer` 函数
2. `bits/90_utils.js` - 添加 `toTextString` 和 `writeTextFile` 函数
3. `bits/98_exports.js` - 添加 `extractText` API 和导出
4. `package.json` - 添加构建脚本
5. `ppt.js` - 重新构建（包含所有新功能）

## 新增文件

1. `USAGE.md` - 使用指南
2. `PROJECT_STRUCTURE.md` - 项目结构分析
3. `example.js` - 使用示例
4. `CHANGES.md` - 改造总结

## 测试建议

1. 测试从文件路径读取
2. 测试从Buffer读取
3. 测试返回字符串
4. 测试写入文件
5. 测试各种选项参数
6. 测试错误处理

## 下一步

可以考虑：
1. 添加单元测试
2. 支持批量处理多个文件
3. 支持更多输出格式（JSON、XML等）
4. 添加进度回调
5. 支持异步API

