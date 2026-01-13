#!/usr/bin/env node
/**
 * 构建脚本
 * 1. 更新版本号到 bits/01_version.js
 * 2. 合并 bits 目录下的文件到 ppt.js
 * 3. 可选：生成 dist 目录文件
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 读取 package.json 获取版本号
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const version = packageJson.version;

console.log(`Building ppt-to-text v${version}...`);

// 1. 更新版本号
console.log('1. Updating version...');
const versionFile = 'bits/01_version.js';
const versionContent = `PPT.version = '${version}';\n`;
fs.writeFileSync(versionFile, versionContent, 'utf8');
console.log(`   ✓ Updated ${versionFile}`);

// 2. 合并文件到 ppt.js
console.log('2. Merging files...');
const files = [
  '00_header',
  '01_version',
  '20_helpers',
  '50_odraw',
  '62_basic',
  '63_fstypes',
  '64_doctype',
  '65_slidetypes',
  '66_sstypes',
  '67_shapetypes',
  '69_text',
  '70_external',
  '71_misctypes',
  '75_parsetab',
  '80_ppt',
  '90_utils',
  '98_exports',
  '99_footer'
].map(f => `bits/${f}.js`);

let content = '';
for (const file of files) {
  if (!fs.existsSync(file)) {
    console.error(`   ✗ File not found: ${file}`);
    process.exit(1);
  }
  content += fs.readFileSync(file, 'utf8') + '\n';
}

fs.writeFileSync('ppt.js', content, 'utf8');
console.log('   ✓ Created ppt.js');

// 3. 生成 dist 目录（如果 uglify-js 可用）
const buildDist = process.argv.includes('--dist') || process.argv.includes('-d');
if (buildDist) {
  console.log('3. Building dist files...');
  
  // 确保 dist 目录存在
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }
  
  try {
    // 检查 uglify-js 是否可用
    execSync('npx uglify-js --version', { stdio: 'ignore' });
    
    // 复制 ppt.js 和 LICENSE 到 dist
    fs.copyFileSync('ppt.js', 'dist/ppt.js');
    if (fs.existsSync('LICENSE')) {
      fs.copyFileSync('LICENSE', 'dist/LICENSE');
    }
    
    // 读取 header
    const header = fs.readFileSync('bits/00_header.js', 'utf8').split('\n')[0];
    
    // 生成压缩版本
    console.log('   Generating minified versions...');
    
    // uglify-js 3.x 不支持 --preamble，需要手动添加 header
    // 生成 ppt.min.js
    execSync(`npx uglify-js ppt.js -o dist/ppt.min.js --source-map "url='ppt.min.map'"`, { stdio: 'pipe' });
    // 手动添加 header
    const minContent = fs.readFileSync('dist/ppt.min.js', 'utf8');
    fs.writeFileSync('dist/ppt.min.js', header + '\n' + minContent, 'utf8');
    console.log('   ✓ Generated dist/ppt.min.js');
    
    // 如果有 cpexcel.js，生成 full 版本
    if (fs.existsSync('dist/cpexcel.js')) {
      execSync(`npx uglify-js dist/cpexcel.js ppt.js -o dist/ppt.full.min.js --source-map "url='ppt.full.min.map'"`, { stdio: 'pipe' });
      const fullContent = fs.readFileSync('dist/ppt.full.min.js', 'utf8');
      fs.writeFileSync('dist/ppt.full.min.js', header + '\n' + fullContent, 'utf8');
      console.log('   ✓ Generated dist/ppt.full.min.js');
    }
    
    console.log('   ✓ Dist files generated');
  } catch (e) {
    console.log('   ⚠ uglify-js not available, skipping dist generation');
    console.log('   Install uglify-js: npm install --save-dev uglify-js');
  }
} else {
  console.log('3. Skipping dist generation (use --dist to build)');
}

console.log('\n✓ Build completed successfully!');

