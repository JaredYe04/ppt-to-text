var to_text_d = function(docs) {
	var out = [];
	docs.forEach(function(d) {
		var o, i;
		try { o = d.slideList; } catch(e) { return; }
		// 每张幻灯片作为一个元素
		for(i = 0; i != o.length; ++i) {
			out.push(o[i]);
		}
	});
	return out;
};

var to_text_s = function(slides) {
	var out = [];
	// 遍历每张幻灯片
	slides.forEach(function(s) {
		var slideTexts = [];
		var o, i;
		try { o = s.drawing.groupShape; } catch(e) { 
			// 如果幻灯片没有 groupShape，返回空字符串
			out.push("");
			return; 
		}
		// 收集该幻灯片中所有文本框的文本
		for(i = 0; i != o.length; ++i) {
			if(!o[i].clientTextbox) continue;
			slideTexts.push(o[i].clientTextbox.t);
		}
		// 将每张幻灯片的文本合并为一个字符串，作为数组的一个元素
		out.push(slideTexts.join("\n"));
	});
	return out;
};

var to_text = function(pres) {
	// 优先使用 slides 结构（如果存在），因为可以按幻灯片分组
	// slides 结构可以确保每个元素代表一张幻灯片的文本
	if(pres.slides && pres.slides.length > 0) {
		return to_text_s(pres.slides);
	}
	// 如果没有 slides，则使用 docs 结构
	// 注意：docs 结构的 slideList 可能不是按幻灯片分组的
	if(pres.docs.length > 0 && pres.docs[0].slideList && pres.docs[0].slideList.length > 0) {
		return to_text_d(pres.docs);
	}
	// 如果都没有，返回空数组
	return [];
};

var toTextString = function(pres, separator) {
	separator = separator || "\n";
	var textArray = to_text(pres);
	return textArray.join(separator);
};

var writeTextFile = function(text, outputPath, encoding) {
	if(typeof require === 'undefined') {
		throw new Error("writeTextFile requires Node.js fs module");
	}
	var fs = require('fs');
	encoding = encoding || 'utf8';
	fs.writeFileSync(outputPath, text, encoding);
	return outputPath;
};

var utils = {
	to_text: to_text,
	toTextString: toTextString,
	writeTextFile: writeTextFile
};
