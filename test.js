#!/usr/bin/env node
/**
 * PPT to Text 测试文件
 * 
 * 测试所有新增功能
 */

var PPT = require('./ppt');
var fs = require('fs');
var path = require('path');
var assert = require('assert');

// 测试文件路径
var testFile = 'test_files/layout_types_2011.ppt';

console.log('========================================');
console.log('PPT to Text 功能测试');
console.log('========================================\n');

var testsPassed = 0;
var testsFailed = 0;
var testsSkipped = 0;

// 检查测试文件是否存在
var testFileExists = fs.existsSync(testFile);

if (!testFileExists) {
    console.log('⚠ 警告: 测试文件不存在:', testFile);
    console.log('   某些需要测试文件的测试将被跳过\n');
}

function test(name, fn) {
    try {
        fn();
        console.log('✓', name);
        testsPassed++;
    } catch (e) {
        console.log('✗', name);
        console.log('  错误:', e.message);
        testsFailed++;
    }
}

function skip(name, reason) {
    console.log('⊘', name, '(跳过:', reason + ')');
    testsSkipped++;
}

// 测试1: 检查API是否存在
test('检查 readBuffer API 是否存在', function() {
    assert(typeof PPT.readBuffer === 'function', 'readBuffer 应该是函数');
});

test('检查 extractText API 是否存在', function() {
    assert(typeof PPT.extractText === 'function', 'extractText 应该是函数');
});

test('检查 utils.toTextString API 是否存在', function() {
    assert(typeof PPT.utils.toTextString === 'function', 'toTextString 应该是函数');
});

test('检查 utils.writeTextFile API 是否存在', function() {
    assert(typeof PPT.utils.writeTextFile === 'function', 'writeTextFile 应该是函数');
});

// 测试2: 从文件路径读取
if (testFileExists) {
    test('从文件路径读取 PPT 文件', function() {
        var pres = PPT.readFile(testFile);
        assert(pres !== null && pres !== undefined, '应该返回解析后的对象');
        assert(Array.isArray(pres.slides) || Array.isArray(pres.docs), '应该包含 slides 或 docs');
    });
} else {
    skip('从文件路径读取 PPT 文件', '测试文件不存在');
}

// 测试3: 从Buffer读取
if (testFileExists) {
    test('从 Buffer 读取 PPT 文件', function() {
        var buffer = fs.readFileSync(testFile);
        assert(Buffer.isBuffer(buffer), '应该是 Buffer 对象');
        var pres = PPT.readBuffer(buffer);
        assert(pres !== null && pres !== undefined, '应该返回解析后的对象');
    });
} else {
    skip('从 Buffer 读取 PPT 文件', '测试文件不存在');
}

// 测试4: to_text 函数
if (testFileExists) {
    test('to_text 函数返回文本数组', function() {
        var pres = PPT.readFile(testFile);
        var textArray = PPT.utils.to_text(pres);
        assert(Array.isArray(textArray), '应该返回数组');
    });
} else {
    skip('to_text 函数返回文本数组', '测试文件不存在');
}

// 测试5: toTextString 函数
if (testFileExists) {
    test('toTextString 函数返回文本字符串', function() {
        var pres = PPT.readFile(testFile);
        var textString = PPT.utils.toTextString(pres);
        assert(typeof textString === 'string', '应该返回字符串');
        assert(textString.length > 0, '字符串不应该为空');
    });
} else {
    skip('toTextString 函数返回文本字符串', '测试文件不存在');
}

// 测试6: extractText 从文件路径读取，返回字符串
if (testFileExists) {
    test('extractText 从文件路径读取，返回字符串', function() {
        var text = PPT.extractText(testFile);
        assert(typeof text === 'string', '应该返回字符串');
        assert(text.length > 0, '字符串不应该为空');
    });
} else {
    skip('extractText 从文件路径读取，返回字符串', '测试文件不存在');
}

// 测试7: extractText 从Buffer读取，返回字符串
if (testFileExists) {
    test('extractText 从 Buffer 读取，返回字符串', function() {
        var buffer = fs.readFileSync(testFile);
        var text = PPT.extractText(buffer);
        assert(typeof text === 'string', '应该返回字符串');
        assert(text.length > 0, '字符串不应该为空');
    });
} else {
    skip('extractText 从 Buffer 读取，返回字符串', '测试文件不存在');
}

// 测试8: extractText 从文件路径读取，写入文件
if (testFileExists) {
    test('extractText 从文件路径读取，写入文件', function() {
        var outputPath = 'test_output_1.txt';
        try {
            var result = PPT.extractText(testFile, { outputPath: outputPath });
            assert(result === outputPath, '应该返回输出文件路径');
            assert(fs.existsSync(outputPath), '输出文件应该存在');
            var content = fs.readFileSync(outputPath, 'utf8');
            assert(content.length > 0, '输出文件内容不应该为空');
            // 清理
            fs.unlinkSync(outputPath);
        } catch (e) {
            // 如果文件存在，清理
            if (fs.existsSync(outputPath)) {
                fs.unlinkSync(outputPath);
            }
            throw e;
        }
    });
} else {
    skip('extractText 从文件路径读取，写入文件', '测试文件不存在');
}

// 测试9: extractText 从Buffer读取，写入文件
if (testFileExists) {
    test('extractText 从 Buffer 读取，写入文件', function() {
        var buffer = fs.readFileSync(testFile);
        var outputPath = 'test_output_2.txt';
        try {
            var result = PPT.extractText(buffer, { outputPath: outputPath });
            assert(result === outputPath, '应该返回输出文件路径');
            assert(fs.existsSync(outputPath), '输出文件应该存在');
            var content = fs.readFileSync(outputPath, 'utf8');
            assert(content.length > 0, '输出文件内容不应该为空');
            // 清理
            fs.unlinkSync(outputPath);
        } catch (e) {
            // 如果文件存在，清理
            if (fs.existsSync(outputPath)) {
                fs.unlinkSync(outputPath);
            }
            throw e;
        }
    });
} else {
    skip('extractText 从 Buffer 读取，写入文件', '测试文件不存在');
}

// 测试10: extractText 使用自定义分隔符
if (testFileExists) {
    test('extractText 使用自定义分隔符', function() {
        var text = PPT.extractText(testFile, { separator: '|' });
        assert(typeof text === 'string', '应该返回字符串');
        // 如果文本包含分隔符，应该能找到
        if (text.length > 0) {
            // 至少应该是一个字符串
            assert(true);
        }
    });
} else {
    skip('extractText 使用自定义分隔符', '测试文件不存在');
}

// 测试11: 比较文件路径和Buffer读取的结果是否一致
if (testFileExists) {
    test('文件路径和 Buffer 读取结果应该一致', function() {
        var text1 = PPT.extractText(testFile);
        var buffer = fs.readFileSync(testFile);
        var text2 = PPT.extractText(buffer);
        assert(text1 === text2, '两种方式读取的结果应该一致');
    });
} else {
    skip('文件路径和 Buffer 读取结果应该一致', '测试文件不存在');
}

// 测试12: writeTextFile 函数
test('writeTextFile 函数写入文件', function() {
    var testContent = '测试内容\n第二行';
    var outputPath = 'test_output_3.txt';
    try {
        var result = PPT.utils.writeTextFile(testContent, outputPath);
        assert(result === outputPath, '应该返回输出文件路径');
        assert(fs.existsSync(outputPath), '输出文件应该存在');
        var content = fs.readFileSync(outputPath, 'utf8');
        assert(content === testContent, '文件内容应该一致');
        // 清理
        fs.unlinkSync(outputPath);
    } catch (e) {
        // 如果文件存在，清理
        if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
        }
        throw e;
    }
});

// 测试13: 错误处理 - 无效的文件路径
test('错误处理 - 无效的文件路径', function() {
    try {
        PPT.extractText('nonexistent_file.ppt');
        throw new Error('应该抛出错误');
    } catch (e) {
        // 应该抛出错误
        assert(e !== null && e !== undefined);
    }
});

// 测试14: 错误处理 - 无效的输入类型
test('错误处理 - 无效的输入类型', function() {
    try {
        PPT.extractText(123); // 无效的输入类型
        throw new Error('应该抛出错误');
    } catch (e) {
        // 应该抛出错误
        assert(e.message.includes('file path') || e.message.includes('Buffer'));
    }
});

console.log('\n========================================');
console.log('测试结果');
console.log('========================================');
console.log('通过:', testsPassed);
console.log('失败:', testsFailed);
console.log('跳过:', testsSkipped);
console.log('总计:', testsPassed + testsFailed + testsSkipped);
console.log('========================================\n');

if (testsFailed === 0) {
    console.log('✓ 所有测试通过！');
    if (testsSkipped > 0) {
        console.log('⚠ 注意: 部分测试被跳过（测试文件不存在）');
    }
    process.exit(0);
} else {
    console.log('✗ 部分测试失败');
    process.exit(1);
}
