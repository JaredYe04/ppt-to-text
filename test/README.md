# 测试框架使用指南

## 概述

这是一个易于扩展的测试框架，可以自动发现测试文件夹中的 PPT 文件并运行测试。

## 使用方法

### 1. 添加测试文件

将 PPT 文件放入 `test_files/` 目录（或子目录）：

```
test_files/
  ├── layout_types_2011.ppt
  ├── sample1.ppt
  ├── sample2.ppt
  └── subfolder/
      └── sample3.ppt
```

### 2. 运行测试

```bash
npm test
```

或直接运行：

```bash
node test/index.js
```

## 测试内容

框架会自动对每个 PPT 文件运行以下测试：

1. **API 存在性检查** - 验证所有 API 函数是否存在
2. **从文件路径读取** - 测试 `PPT.readFile()`
3. **从 Buffer 读取** - 测试 `PPT.readBuffer()`
4. **提取文本数组** - 测试 `PPT.utils.to_text()`
5. **提取文本字符串** - 测试 `PPT.utils.toTextString()`
6. **extractText 从文件路径** - 测试 `PPT.extractText()` 文件路径模式
7. **extractText 从 Buffer** - 测试 `PPT.extractText()` Buffer 模式
8. **extractText 写入文件** - 测试 `PPT.extractText()` 文件输出
9. **文件路径和 Buffer 结果一致** - 验证两种读取方式结果一致

## 测试报告

测试完成后会显示：

- 每个文件的测试结果
- 总体统计（通过/失败/跳过）
- 错误详情（如果有）

示例输出：

```
============================================================
测试结果汇总
============================================================

📄 文件: test_files/layout_types_2011.ppt
------------------------------------------------------------
  ✓ API 存在性检查
  ✓ 从文件路径读取
  ✓ 从 Buffer 读取
  ...
  通过: 9 | 失败: 0

============================================================
总体统计
============================================================
总文件数: 3
通过: 3 文件
失败: 0 文件
跳过: 0 文件
============================================================
```

## 扩展测试

### 添加新的测试用例

编辑 `test/index.js`，在 `testCases` 数组中添加新的测试用例：

```javascript
{
    name: '你的测试名称',
    test: (file) => {
        // file 是 PPT 文件的完整路径
        // 在这里编写你的测试逻辑
        // 如果测试失败，抛出错误
        // 如果测试通过，返回 true
        
        const result = PPT.someFunction(file);
        if (!result) {
            throw new Error('测试失败的原因');
        }
        return true;
    }
}
```

### 修改测试文件目录

在 `test/index.js` 中修改 `TEST_FILES_DIR` 常量：

```javascript
const TEST_FILES_DIR = path.join(__dirname, '../your_test_dir');
```

### 添加支持的格式

在 `test/index.js` 中修改 `SUPPORTED_EXTENSIONS` 数组：

```javascript
const SUPPORTED_EXTENSIONS = ['.ppt', '.pptx']; // 添加 .pptx
```

## 配置选项

在 `test/index.js` 中可以配置：

- `TEST_FILES_DIR`: 测试文件目录（默认: `test_files/`）
- `SUPPORTED_EXTENSIONS`: 支持的文件扩展名（默认: `['.ppt']`）

## 注意事项

1. 测试文件会自动递归查找子目录
2. 测试过程中会创建临时文件，测试完成后会自动清理
3. 如果测试文件不存在，会显示提示信息并正常退出（退出码 0）
4. 测试失败会返回退出码 1，可用于 CI/CD

## CI/CD 集成

测试框架设计为 CI/CD 友好：

- 退出码 0 = 所有测试通过
- 退出码 1 = 有测试失败
- 清晰的输出格式，便于日志分析

## 故障排查

### 没有找到测试文件

确保：
- PPT 文件在 `test_files/` 目录中
- 文件扩展名是 `.ppt`（或已添加到 `SUPPORTED_EXTENSIONS`）
- 文件权限正确

### 测试失败

查看错误详情：
- 检查 PPT 文件是否损坏
- 检查文件格式是否支持
- 查看具体的错误信息

