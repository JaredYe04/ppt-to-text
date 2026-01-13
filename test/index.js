#!/usr/bin/env node
/**
 * PPT to Text 测试框架
 * 
 * 自动发现测试文件夹中的 PPT 文件并运行测试
 * 使用方法：
 *   1. 将 PPT 文件放入 test_files/ 目录
 *   2. 运行 npm test 或 node test/index.js
 */

const PPT = require('../ppt');
const fs = require('fs');
const path = require('path');

// 配置
const TEST_FILES_DIR = path.join(__dirname, '../test_files');
const OUTPUT_DIR = path.join(TEST_FILES_DIR, 'output'); // 输出目录
const SUPPORTED_EXTENSIONS = ['.ppt'];

// 测试结果统计
const stats = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    errors: []
};

// 测试用例定义
const testCases = [
    {
        name: 'API 存在性检查',
        test: (file) => {
            const checks = [
                { name: 'readBuffer', fn: PPT.readBuffer },
                { name: 'readFile', fn: PPT.readFile },
                { name: 'extractText', fn: PPT.extractText },
                { name: 'utils.toTextString', fn: PPT.utils.toTextString },
                { name: 'utils.writeTextFile', fn: PPT.utils.writeTextFile },
            ];
            
            for (const check of checks) {
                if (typeof check.fn !== 'function') {
                    throw new Error(`${check.name} 不是函数`);
                }
            }
            return true;
        }
    },
    {
        name: '从文件路径读取',
        test: (file) => {
            const pres = PPT.readFile(file);
            if (!pres || (typeof pres !== 'object')) {
                throw new Error('readFile 返回无效对象');
            }
            if (!Array.isArray(pres.slides) && !Array.isArray(pres.docs)) {
                throw new Error('返回对象缺少 slides 或 docs 属性');
            }
            return true;
        }
    },
    {
        name: '从 Buffer 读取',
        test: (file) => {
            const buffer = fs.readFileSync(file);
            if (!Buffer.isBuffer(buffer)) {
                throw new Error('文件读取失败');
            }
            const pres = PPT.readBuffer(buffer);
            if (!pres || (typeof pres !== 'object')) {
                throw new Error('readBuffer 返回无效对象');
            }
            return true;
        }
    },
    {
        name: '提取文本数组',
        test: (file) => {
            const pres = PPT.readFile(file);
            const textArray = PPT.utils.to_text(pres);
            if (!Array.isArray(textArray)) {
                throw new Error('to_text 应该返回数组');
            }
            // 验证每个元素都是字符串（代表一张幻灯片的文本）
            if (textArray.length > 0) {
                for (let i = 0; i < textArray.length; i++) {
                    if (typeof textArray[i] !== 'string') {
                        throw new Error(`to_text 数组的第 ${i + 1} 个元素应该是字符串（代表一张幻灯片的文本）`);
                    }
                }
            }
            // 验证数组长度应该等于幻灯片数量
            const slideCount = pres.slides.length || (pres.docs.length > 0 && pres.docs[0].slideList ? pres.docs[0].slideList.length : 0);
            if (slideCount > 0 && textArray.length !== slideCount) {
                throw new Error(`to_text 返回的数组长度 (${textArray.length}) 应该等于幻灯片数量 (${slideCount})`);
            }
            return true;
        }
    },
    {
        name: '提取文本字符串',
        test: (file) => {
            const pres = PPT.readFile(file);
            const textString = PPT.utils.toTextString(pres);
            if (typeof textString !== 'string') {
                throw new Error('toTextString 应该返回字符串');
            }
            return true;
        }
    },
    {
        name: 'extractText 从文件路径',
        test: (file) => {
            const text = PPT.extractText(file);
            if (typeof text !== 'string') {
                throw new Error('extractText 应该返回字符串');
            }
            return true;
        }
    },
    {
        name: 'extractText 从 Buffer',
        test: (file) => {
            const buffer = fs.readFileSync(file);
            const text = PPT.extractText(buffer);
            if (typeof text !== 'string') {
                throw new Error('extractText 应该返回字符串');
            }
            return true;
        }
    },
    {
        name: 'extractText 写入文件',
        test: (file) => {
            const outputPath = path.join(__dirname, '../test_output_temp.txt');
            try {
                const result = PPT.extractText(file, { outputPath });
                if (result !== outputPath) {
                    throw new Error('应该返回输出文件路径');
                }
                if (!fs.existsSync(outputPath)) {
                    throw new Error('输出文件不存在');
                }
                const content = fs.readFileSync(outputPath, 'utf8');
                if (content.length === 0) {
                    throw new Error('输出文件内容为空');
                }
                fs.unlinkSync(outputPath);
                return true;
            } catch (e) {
                if (fs.existsSync(outputPath)) {
                    fs.unlinkSync(outputPath);
                }
                throw e;
            }
        }
    },
    {
        name: '文件路径和 Buffer 结果一致',
        test: (file) => {
            const text1 = PPT.extractText(file);
            const buffer = fs.readFileSync(file);
            const text2 = PPT.extractText(buffer);
            if (text1 !== text2) {
                throw new Error('两种方式读取的结果不一致');
            }
            return true;
        }
    }
];

// 发现测试文件
function discoverTestFiles(dir) {
    if (!fs.existsSync(dir)) {
        return [];
    }
    
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
            // 递归查找子目录
            files.push(...discoverTestFiles(fullPath));
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            if (SUPPORTED_EXTENSIONS.includes(ext)) {
                files.push(fullPath);
            }
        }
    }
    
    return files;
}

// 运行单个测试用例
function runTestCase(testCase, file) {
    try {
        const result = testCase.test(file);
        return { success: true, result };
    } catch (error) {
        // 改进错误处理：捕获完整的错误信息
        let errorMessage = '未知错误';
        if (error instanceof Error) {
            errorMessage = error.message || error.toString();
            // 如果错误信息太短或可疑，添加更多上下文
            if (errorMessage.length <= 2 && error.stack) {
                errorMessage = error.stack.split('\n')[0] || errorMessage;
            }
        } else if (typeof error === 'string') {
            errorMessage = error;
        } else if (error) {
            errorMessage = String(error);
        }
        return { success: false, error: errorMessage };
    }
}

// 保存解析出的文本到文件
function saveExtractedText(file, text) {
    try {
        // 确保输出目录存在
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        }
        
        // 生成输出文件名（保持原文件名，只改扩展名）
        const fileName = path.basename(file, path.extname(file));
        const outputFile = path.join(OUTPUT_DIR, `${fileName}.txt`);
        
        // 保存文本内容
        fs.writeFileSync(outputFile, text, 'utf8');
        return outputFile;
    } catch (error) {
        console.error(`保存文本文件失败: ${error.message}`);
        return null;
    }
}

// 运行单个文件的测试
function runFileTests(file) {
    const relativePath = path.relative(process.cwd(), file);
    const results = [];
    
    for (const testCase of testCases) {
        const result = runTestCase(testCase, file);
        results.push({
            testCase: testCase.name,
            ...result
        });
    }
    
    // 如果测试通过，保存解析出的文本
    const allPassed = results.every(r => r.success);
    if (allPassed) {
        try {
            const text = PPT.extractText(file);
            const outputFile = saveExtractedText(file, text);
            if (outputFile) {
                results.push({
                    testCase: '保存解析文本',
                    success: true,
                    result: outputFile
                });
            }
        } catch (error) {
            // 保存失败不影响测试结果
            results.push({
                testCase: '保存解析文本',
                success: false,
                error: error.message
            });
        }
    }
    
    return {
        file: relativePath,
        results
    };
}

// 打印测试结果
function printResults(fileResults) {
    console.log('\n' + '='.repeat(60));
    console.log('测试结果汇总');
    console.log('='.repeat(60));
    
    for (const fileResult of fileResults) {
        console.log(`\n📄 文件: ${fileResult.file}`);
        console.log('-'.repeat(60));
        
        let filePassed = 0;
        let fileFailed = 0;
        
        for (const result of fileResult.results) {
            if (result.success) {
                if (result.testCase === '保存解析文本' && result.result) {
                    const relativeOutput = path.relative(process.cwd(), result.result);
                    console.log(`  ✓ ${result.testCase} -> ${relativeOutput}`);
                } else {
                    console.log(`  ✓ ${result.testCase}`);
                }
                filePassed++;
            } else {
                console.log(`  ✗ ${result.testCase}`);
                console.log(`    错误: ${result.error}`);
                fileFailed++;
            }
        }
        
        console.log(`  通过: ${filePassed} | 失败: ${fileFailed}`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('总体统计');
    console.log('='.repeat(60));
    console.log(`总文件数: ${stats.total}`);
    console.log(`通过: ${stats.passed} 文件`);
    console.log(`失败: ${stats.failed} 文件`);
    console.log(`跳过: ${stats.skipped} 文件`);
    
    if (stats.errors.length > 0) {
        console.log('\n错误详情:');
        for (const error of stats.errors) {
            console.log(`  - ${error}`);
        }
    }
    
    console.log('='.repeat(60) + '\n');
}

// 主函数
function main() {
    console.log('='.repeat(60));
    console.log('PPT to Text 测试框架');
    console.log('='.repeat(60));
    console.log(`\n扫描目录: ${TEST_FILES_DIR}`);
    
    // 发现测试文件
    const testFiles = discoverTestFiles(TEST_FILES_DIR);
    
    if (testFiles.length === 0) {
        console.log('\n⚠️  未找到测试文件！');
        console.log(`\n请将 PPT 文件放入以下目录:`);
        console.log(`  ${TEST_FILES_DIR}`);
        console.log(`\n支持的格式: ${SUPPORTED_EXTENSIONS.join(', ')}`);
        
        // 在 CI 环境中，即使没有测试文件，也运行基本的 API 测试
        const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
        if (isCI) {
            console.log('\n🔍 CI 环境检测：运行基本 API 测试...\n');
            try {
                // 运行基本的 API 存在性检查
                const apiTest = testCases.find(tc => tc.name === 'API 存在性检查');
                if (apiTest) {
                    apiTest.test(null); // API 测试不需要文件
                    console.log('✅ 基本 API 测试通过\n');
                }
                console.log('ℹ️  跳过文件测试（无测试文件）\n');
                process.exit(0);
            } catch (error) {
                console.error('❌ 基本 API 测试失败:', error.message);
                process.exit(1);
            }
        } else {
            process.exit(0);
        }
    }
    
    console.log(`\n找到 ${testFiles.length} 个测试文件:\n`);
    testFiles.forEach((file, index) => {
        const relativePath = path.relative(process.cwd(), file);
        console.log(`  ${index + 1}. ${relativePath}`);
    });
    
    console.log('\n开始测试...\n');
    
    // 确保输出目录存在
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        console.log(`创建输出目录: ${OUTPUT_DIR}\n`);
    }
    
    // 运行测试
    const fileResults = [];
    
    for (const file of testFiles) {
        stats.total++;
        const result = runFileTests(file);
        fileResults.push(result);
        
        // 统计（排除"保存解析文本"测试，因为它不影响主要测试结果）
        const mainResults = result.results.filter(r => r.testCase !== '保存解析文本');
        const allPassed = mainResults.every(r => r.success);
        if (allPassed) {
            stats.passed++;
        } else {
            stats.failed++;
            const errors = mainResults
                .filter(r => !r.success)
                .map(r => `${result.file}: ${r.testCase} - ${r.error}`);
            stats.errors.push(...errors);
        }
    }
    
    // 打印结果
    printResults(fileResults);
    
    // 退出码
    if (stats.failed === 0) {
        console.log('✅ 所有测试通过！\n');
        process.exit(0);
    } else {
        console.log('❌ 部分测试失败\n');
        process.exit(1);
    }
}

// 运行
if (require.main === module) {
    main();
}

module.exports = { discoverTestFiles, runFileTests, testCases };

