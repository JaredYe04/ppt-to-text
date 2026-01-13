#!/usr/bin/env node
/**
 * PPT to Text 使用示例
 * 
 * 这个文件展示了如何使用改造后的PPT解析库
 */

var PPT = require('./ppt');

// 示例1: 从文件路径读取，返回纯文本字符串
console.log('=== 示例1: 从文件路径读取，返回纯文本字符串 ===');
try {
    var text1 = PPT.extractText('test_files/layout_types_2011.ppt');
    console.log('提取的文本:');
    console.log(text1);
    console.log('\n');
} catch (e) {
    console.error('错误:', e.message);
}

// 示例2: 从Buffer读取，返回纯文本字符串
console.log('=== 示例2: 从Buffer读取，返回纯文本字符串 ===');
try {
    var fs = require('fs');
    var buffer = fs.readFileSync('test_files/layout_types_2011.ppt');
    var text2 = PPT.extractText(buffer);
    console.log('提取的文本:');
    console.log(text2);
    console.log('\n');
} catch (e) {
    console.error('错误:', e.message);
}

// 示例3: 从文件路径读取，输出到文本文件
console.log('=== 示例3: 从文件路径读取，输出到文本文件 ===');
try {
    var outputPath = PPT.extractText('test_files/layout_types_2011.ppt', {
        outputPath: 'output.txt',
        separator: '\n',
        encoding: 'utf8'
    });
    console.log('文本已保存到:', outputPath);
    console.log('\n');
} catch (e) {
    console.error('错误:', e.message);
}

// 示例4: 从Buffer读取，输出到文本文件
console.log('=== 示例4: 从Buffer读取，输出到文本文件 ===');
try {
    var fs = require('fs');
    var buffer = fs.readFileSync('test_files/layout_types_2011.ppt');
    var outputPath2 = PPT.extractText(buffer, {
        outputPath: 'output2.txt',
        separator: '\n',
        encoding: 'utf8'
    });
    console.log('文本已保存到:', outputPath2);
    console.log('\n');
} catch (e) {
    console.error('错误:', e.message);
}

// 示例5: 使用底层API
console.log('=== 示例5: 使用底层API ===');
try {
    // 从文件读取
    var pres1 = PPT.readFile('test_files/layout_types_2011.ppt');
    var textArray1 = PPT.utils.to_text(pres1);
    var textString1 = PPT.utils.toTextString(pres1, '\n');
    console.log('文本数组长度:', textArray1.length);
    console.log('文本字符串长度:', textString1.length);
    console.log('\n');
    
    // 从Buffer读取
    var fs = require('fs');
    var buffer = fs.readFileSync('test_files/layout_types_2011.ppt');
    var pres2 = PPT.readBuffer(buffer);
    var textString2 = PPT.utils.toTextString(pres2);
    console.log('从Buffer提取的文本长度:', textString2.length);
    console.log('\n');
} catch (e) {
    console.error('错误:', e.message);
}

