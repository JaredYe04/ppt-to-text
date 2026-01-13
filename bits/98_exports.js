PPT.parse_pptcfb = process_ppt;
PPT.readFile = readFile;
PPT.readBuffer = readBuffer;
PPT.utils = utils;

/**
 * 统一的文本提取API
 * @param {string|Buffer} input - PPT文件路径或Buffer
 * @param {object} options - 选项
 * @param {string} options.outputPath - 输出文件路径（如果提供，则写入文件；否则返回字符串）
 * @param {string} options.separator - 文本分隔符，默认为 "\n"
 * @param {string} options.encoding - 文件编码，默认为 'utf8'
 * @param {object} options.readOpts - 传递给readFile/readBuffer的选项
 * @returns {string} - 如果提供了outputPath则返回文件路径，否则返回文本字符串
 */
PPT.extractText = function(input, options) {
	options = options || {};
	var separator = options.separator || "\n";
	var encoding = options.encoding || 'utf8';
	var readOpts = options.readOpts || {};
	
	var pres;
	// 判断输入是Buffer还是文件路径
	if(Buffer.isBuffer(input)) {
		pres = readBuffer(input, readOpts);
	} else if(typeof input === 'string') {
		pres = readFile(input, readOpts);
	} else {
		throw new Error("input must be a file path (string) or Buffer");
	}
	
	var text = utils.toTextString(pres, separator);
	
	// 如果提供了输出路径，写入文件
	if(options.outputPath) {
		return utils.writeTextFile(text, options.outputPath, encoding);
	}
	
	// 否则返回文本字符串
	return text;
};
