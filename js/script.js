/*
	Copyright (c) 2013-2014 Sallai András 
	Licenc: GNU GPL v.2
 */
var htmleditor;
var csseditor;
var jseditor;

$("html output").each(function () {
        this.style.height = (this.scrollHeight-2)+'px';
});

function createhtmleditor()
{
	htmleditor = ace.edit("htmleditor");
	htmleditor.setTheme("ace/theme/monokai");
	htmleditor.getSession().setMode("ace/mode/html");

	$('#panels').on("focus", "#htmleditor", function(){
		$("body").data("focus","html");		
	});
	$('#htmleditor').keyup(function(){
		refresh(htmleditor, csseditor, jseditor);
	});	
	return htmleditor
}

function createCssEditor()
{
	csseditor = ace.edit("csseditor");
	csseditor.setTheme("ace/theme/monokai");
	csseditor.getSession().setMode("ace/mode/css");
	
	$('#panels').on("focus", "#csseditor", function(){
		$("body").data("focus","css");		
	});
	$('#csseditor').keyup(function(){
		refresh(htmleditor, csseditor, jseditor);
	});	
	
	return csseditor;
}

function createJsEditor()
{
	jseditor = ace.edit("jseditor");
	jseditor.setTheme("ace/theme/monokai");
	jseditor.getSession().setMode("ace/mode/javascript");
	
	$('#panels').on("focus", "#jseditor", function(){
		$("body").data("focus","js");		
	});
	$('#jseditor').keyup(function(){
		refresh(htmleditor, csseditor, jseditor);
	});	

	return jseditor;
}

$(document).ready(function(){
	htmleditor = createhtmleditor();
	csseditor = createCssEditor();
	jseditor = createJsEditor();
	
	htmleditor.getSession().setValue("<!doctype html>\n<html>\n<head>\n<meta charset=\"utf-8\">\n<title>SWBin</title>\n</head>\n<body>\n	\n</body>\n</html>");
	
	$("#bodyOutput").html("");
	$("#html").show();
	$("#css").hide();
	$("#js").hide();
	$("#console").hide();
	$("#output").show();
	setColumnSize();
	refresh();
	$("#consoleButton").hide();
	$("#cssButton").addClass("notoggledButton");
	$("#jsButton").addClass("notoggledButton");
	$("#numButton").addClass("notoggledButton");
	$("#runButton").addClass("notoggledButton");
	$("#aboutButton").addClass("notoggledButton");
	$("#jqueryButton").addClass("notoggledButton");
	$("#saveButton").addClass("notoggledButton");
	$('#htmleditor').data('jqueryInserted', false);
	$('#htmleditor').data('jqueryMobileInserted', false);
	$('#htmleditor').data('jqueryUiInserted', false);
	$('#htmleditor').data('angularInserted', false);
	$('#htmleditor').data('angularAnimateInserted', false);
	$('#htmleditor').data('bootStrapInserted', false);
	
	$("#runButton").data("downed", "false");
	$('body').data('presentationMode', false);
	
	htmleditor.focus();	
	htmleditor.moveCursorTo(7,8);

	htmleditor.renderer.setHScrollBarAlwaysVisible(false);
	csseditor.renderer.setHScrollBarAlwaysVisible(false);
	jseditor.renderer.setHScrollBarAlwaysVisible(false);
	
	htmleditor.getSession().setUseWrapMode(true);
	csseditor.getSession().setUseWrapMode(true);
	jseditor.getSession().setUseWrapMode(true);
	
	htmleditor.setWrapBehavioursEnabled(true);	
	csseditor.setWrapBehavioursEnabled(true);	
	jseditor.setWrapBehavioursEnabled(true);	
	
	htmleditor.getSession().setUseWorker(false);
	csseditor.getSession().setUseWorker(false);
	jseditor.getSession().setUseWorker(false);
	
	htmleditor.setFontSize(16);
	csseditor.setFontSize(16);
	jseditor.setFontSize(16);	
});

window.onresize = doit;
function doit(){
	setWrapLength(htmleditor);
}

function setWrapLength(editor) {
    var session = editor.session;
    editor.resize();
    if(session.getUseWrapMode()) {
        var characterWidth = editor.renderer.characterWidth;
        var contentWidth = editor.container.ownerDocument.getElementsByClassName("ace_scroller")[0].clientWidth;

        if(contentWidth > 0) {
            session.setWrapLimit(parseInt(contentWidth / characterWidth-1, 10));
        }
    }
}

$("#htmlButton").click(function(){
	if($("#html").is(":visible"))
	{
		$("#html").hide();
		$("#htmlButton").addClass("notoggledButton");
		$("#htmlButton").removeClass("toggledButton");		
	}
	else
	{
		$("#html").show();
		$("#htmlButton").addClass("toggledButton");
		$("#htmlButton").removeClass("notoggledButton");
		htmleditor.focus();
	}
	setColumnSize();
});

$("#cssButton").click(function(){
	if($("#css").is(":visible"))
	{
		$("#css").hide();
		$("#cssButton").addClass("notoggledButton");
		$("#cssButton").removeClass("toggledButton");
		htmleditor.focus();		
	}
	else
	{
		$("#css").show();
		$("#cssButton").addClass("toggledButton");
		$("#cssButton").removeClass("notoggledButton");
		csseditor.focus();	
	}	
	setColumnSize();
});

$("#jsButton").click(function(){
	if($("#js").is(":visible"))
	{
		$("#js").hide();
		$("#jsButton").addClass("notoggledButton");
		$("#jsButton").removeClass("toggledButton");	
		htmleditor.focus();
	}
	else	
	{
		$("#js").show();
		$("#jsButton").addClass("toggledButton");
		$("#jsButton").removeClass("notoggledButton");
		jseditor.focus();		
	}
	setColumnSize();
});

$("#outputButton").click(function(){
	if($("#output").is(":visible"))
	{
		$("#output").hide();
		$("#outputButton").addClass("notoggledButton");
		$("#outputButton").removeClass("toggledButton");		
	}
	else
	{
		$("#output").show();
		$("#outputButton").addClass("toggledButton");
		$("#outputButton").removeClass("notoggledButton");		
	}
	setColumnSize();
});

$("#aboutButton").click(function(){
	if($("#aboutBox").is(":visible"))
		$("#aboutBox").fadeOut(400);
	else
		$("#aboutBox").fadeIn(400);
});

$("#aboutBox").click(function(){
	$("#aboutBox").fadeOut(400);
});

$("#clearContentMenuItem").click(function(){
	document.location.reload(true);
});

$("#saveMenuItem").click(function(){	
	var content = $("#outputiframe").attr("srcdoc");
	var blob = new Blob([content], {type: "text/html;charset=utf-8"});
	saveAs(blob, "mentes.html");
});

$("#openMenuItem").click(function(){
	
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		handleFileSelect(this);
	} else {
		alert('A File API nincs támogatva a böngésződben!');
	}
	$("#fileListMenuItems").toggle();
});

function handleFileSelect(evt) {
	$("#fileselection").click();
	$("#fileselection").change(function(){
		readBlob();		
	});
}

$("#saveMultiFileMenuItem").click(function(){	
	var htmlContent = htmleditor.doc.getValue("");
	var cssContent = csseditor.doc.getValue("");
	var jsContent = jseditor.doc.getValue("");	
	
	htmlContent = decodeURIComponent(htmlContent);
	htmlContent = htmlContent.replace("</head>\n", "\n<link rel=\"stylesheet\" href=\"style.css\">\n<\/head>\n");
	htmlContent = htmlContent.replace("</head>\n", "\n<script src=\"script.js\"><\/script>\n<\/head>\n");
	
	var htmlBlob = new Blob([htmlContent], {type: "text/html;charset=utf-8"});
	var cssBlob = new Blob([cssContent], {type: "text/css;charset=utf-8"});
	var jsBlob = new Blob([jsContent], {type: "text/javascript;charset=utf-8"});
	saveAs(htmlBlob, "index.html");
	saveAs(cssBlob, "style.css");
	saveAs(jsBlob, "script.js");	
});

$("#insertJqueryMenuItem").click(function(){
	if($('#htmleditor').data('jqueryInserted')==false)
	{
		var curPos = htmleditor.getCursorPosition();
		var htmlSrc = htmleditor.getSession().getValue();
		htmlSrc = htmlSrc.replace("</head>\n", "<script src=\"http:\/\/code.jquery.com\/jquery.min.js\"><\/script>\n<\/head>\n");
		htmleditor.getSession().setValue(htmlSrc);		
		$('#htmleditor').data('jqueryInserted', true);		
		htmleditor.focus();
		var row = curPos.row;
		var column = curPos.column;
		htmleditor.moveCursorTo(row + 1, column);
	}
});

$("#insertJqueryMobileMenuItem").click(function(){
	if($('#htmleditor').data('jqueryMobileInserted')==false)
	{
		var curPos = htmleditor.getCursorPosition();
		var htmlSrc = htmleditor.getSession().getValue();
		htmlSrc = htmlSrc.replace("</head>\n", "<link rel=\"stylesheet\" href=\"http:\/\/code.jquery.com\/mobile\/1.3.2\/jquery.mobile-1.3.2.min.css\"><\/head>\n");
		htmlSrc = htmlSrc.replace("</head>\n", "\n<script src=\"http:\/\/code.jquery.com\/mobile\/1.3.2\/jquery.mobile-1.3.2.min.js\"><\/script>\n<\/head>\n");
		htmleditor.getSession().setValue(htmlSrc);		
		$('#htmleditor').data('jqueryMobileInserted', true);		
		htmleditor.focus();
		var row = curPos.row;
		var column = curPos.column;
		htmleditor.moveCursorTo(row + 2, column);
	}
});

$("#insertJqueryUiMenuItem").click(function(){
	if($('#htmleditor').data('jqueryUiInserted')==false)
	{
		var curPos = htmleditor.getCursorPosition();
		var htmlSrc = htmleditor.getSession().getValue();
		htmlSrc = htmlSrc.replace("</head>\n", "<link rel=\"stylesheet\" href=\"http:\/\/code.jquery.com\/ui\/1.10.4\/themes\/smoothness\/jquery-ui.css\"><\/head>\n");
		htmlSrc = htmlSrc.replace("</head>\n", "\n<script src=\"http:\/\/code.jquery.com\/jquery-1.10.2.js\"><\/script><\/head>\n");
		htmlSrc = htmlSrc.replace("</head>\n", "\n<script src=\"http:\/\/code.jquery.com\/ui\/1.10.4\/jquery-ui.js\"><\/script>\n<\/head>\n");
		htmleditor.getSession().setValue(htmlSrc);		
		$('#htmleditor').data('jqueryUiInserted', true);		
		htmleditor.focus();
		var row = curPos.row;
		var column = curPos.column;
		htmleditor.moveCursorTo(row + 3, column);
	}
});

$("#insertAngularMenuItem").click(function(){
	if($('#htmleditor').data('angularInserted')==false)
	{
		var curPos = htmleditor.getCursorPosition();
		var htmlSrc = htmleditor.getSession().getValue();
		htmlSrc = htmlSrc.replace("</head>\n", "<script src=\"http:\/\/code.angularjs.org\/1.2.8\/angular.min.js\"><\/script>\n<\/head>\n");
		htmleditor.getSession().setValue(htmlSrc);		
		$('#htmleditor').data('angularInserted', true);		
		htmleditor.focus();		
		var row = curPos.row;
		var column = curPos.column;
		htmleditor.moveCursorTo(row + 1, column);		
	}
});

$("#insertAngularAnimateMenuItem").click(function(){	
	if($('#htmleditor').data('angularAnimateInserted')==false)
	{		
		var curPos = htmleditor.getCursorPosition();
		var htmlSrc = htmleditor.getSession().getValue();
		htmlSrc = htmlSrc.replace("</head>\n", "<script src=\"http:\/\/code.angularjs.org\/1.2.8\/angular-animate.min.js\"><\/script>\n<\/head>\n");
		htmleditor.getSession().setValue(htmlSrc);		
		$('#htmleditor').data('angularAnimateInserted', true);		
		htmleditor.focus();		
		var row = curPos.row;
		var column = curPos.column;
		htmleditor.moveCursorTo(row + 1, column);
	}
	
});

$("#insertBootStrapMenuItem").click(function(){	
	if($('#htmleditor').data('bootStrapInserted')==false)
	{		
		var curPos = htmleditor.getCursorPosition();
		var htmlSrc = htmleditor.getSession().getValue();
		var forInsertStr = "<script src=\"http:\/\/code.jquery.com\/jquery.min.js\"><\/script>\n<link href=\"http:\/\/getbootstrap.com\/2.3.2\/assets\/css\/bootstrap.css\" rel=\"stylesheet\" >\n<link href=\"http:\/\/getbootstrap.com\/2.3.2\/assets\/css\/bootstrap-responsive.css\" rel=\"stylesheet\" >\n<script src=\"http:\/\/getbootstrap.com\/2.3.2\/assets\/js\/bootstrap.js\"><\/script>\n<\/head>\n";
		htmlSrc = htmlSrc.replace("</head>\n", forInsertStr);
		htmleditor.getSession().setValue(htmlSrc);		
		$('#htmleditor').data('bootStrapInserted', true);		
		htmleditor.focus();		
		var row = curPos.row;
		var column = curPos.column;
		htmleditor.moveCursorTo(row + 4, column);
	}	
});

$("#insertLoremIpsumMenuItem").click(function(){	
	var curPos = htmleditor.getCursorPosition();
	var forInsertStr = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam condimentum blandit sapien non volutpat. Vivamus posuere massa euismod libero varius et mollis velit aliquam. Donec ultrices placerat consequat. Phasellus sit amet est non lorem vestibulum placerat iaculis vitae justo. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus bibendum feugiat eleifend. Duis tincidunt tempus eros, ac laoreet magna suscipit eu. Praesent quis facilisis lacus. Quisque imperdiet egestas lectus dapibus iaculis. Morbi egestas nulla eu magna sagittis vitae eleifend lacus sodales. Nullam vel nunc nisl. Vestibulum eget sapien eros. Donec ac pellentesque odio. In hac habitasse platea dictumst.";
	htmleditor.focus();
	htmleditor.getSession().insert(curPos, forInsertStr);
	sendData();
});

$("#presentationModeMenuItem").click(function(){
	if( $('body').data('presentationMode') == false )
	{
		htmleditor.setFontSize(24);
		csseditor.setFontSize(24);
		jseditor.setFontSize(24);
		$('body').data('presentationMode', true);
		$('#presentationModeMenuItem').text("Normal mode");
	}
	else
	{
		htmleditor.setFontSize(16);
		csseditor.setFontSize(16);
		jseditor.setFontSize(16);
		$('body').data('presentationMode', false);
		$('#presentationModeMenuItem').text("Presentation mode");		
	}
	setWrapLength(htmleditor);
	setWrapLength(csseditor);
	setWrapLength(jseditor);
});

$("#eclipseThemeMenuItem").click(function(){
	htmleditor.setTheme("ace/theme/eclipse");
	csseditor.setTheme("ace/theme/eclipse");
	jseditor.setTheme("ace/theme/eclipse");
});

$("#ambianceThemeMenuItem").click(function(){
	htmleditor.setTheme("ace/theme/ambiance");
	csseditor.setTheme("ace/theme/ambiance");
	jseditor.setTheme("ace/theme/ambiance");
});

$("#monokaiThemeMenuItem").click(function(){
	htmleditor.setTheme("ace/theme/monokai");
	csseditor.setTheme("ace/theme/monokai");
	jseditor.setTheme("ace/theme/monokai");
});

$("#cobaltThemeMenuItem").click(function(){
	htmleditor.setTheme("ace/theme/cobalt");
	csseditor.setTheme("ace/theme/cobalt");
	jseditor.setTheme("ace/theme/cobalt");
});

$("#textmateThemeMenuItem").click(function(){	
	htmleditor.setTheme("ace/theme/textmate");
	csseditor.setTheme("ace/theme/textmate");
	jseditor.setTheme("ace/theme/textmate");
});

function setColumnSize()
{
	var count = 0;
	if( $("#html").is(":visible") )
		count++;
	if($("#css").is(":visible"))
		count++;
	if($("#js").is(":visible"))
		count++;
	if($("#console").is(":visible"))
		count++;
	if($("#output").is(":visible"))
		count++;
	
	if(count == 1){
		$("#html, #css, #js, #output")
		.removeClass( "contentBoxWidth2 contentBoxWidth3 contentBoxWidth4" )
		.addClass("contentBoxWidth1");
		
	}
	if(count == 2){
		$("#html, #css, #js, #output")
		.removeClass( "contentBoxWidth1 contentBoxWidth3 contentBoxWidth4" )
		.addClass("contentBoxWidth2");
	}
	if(count == 3){
		$("#html, #css, #js, #output")
		.removeClass( "contentBoxWidth1 contentBoxWidth2 contentBoxWidth4" )
		.addClass("contentBoxWidth3");
	}
	if(count == 4){
		$("#html, #css, #js, #output")
		.removeClass( "contentBoxWidth1 contentBoxWidth3 contentBoxWidth2" )
		.addClass("contentBoxWidth4");
	}	
	setWrapLength(htmleditor);
	setWrapLength(csseditor);
	setWrapLength(jseditor);
}

function refresh()
{	
	if($("input#autorun:checked").val() == "on")
	{
		sendData();
	}
	if($("#runButton").data("downed")=="true")
	{
		sendData();
	}
}

function sendData()
{
	var htmlSrc = htmleditor.getSession().getValue();
	var cssSrc = csseditor.getSession().getValue();
	if($("input#autorunjs:checked").val())
	{
		var jsSrc = jseditor.getValue("");
	}
	else
	{
		var jsSrc = "";
	}
	htmlSrc = htmlSrc.replace("</head>\n", "<style>\n" + cssSrc + "</style>\n</head>\n");	
	htmlSrc = htmlSrc.replace("</body>\n", "<script>\n" + jsSrc + "<\/script>\n\n<\/body>\n");	
	
	document.getElementById('outputiframe').srcdoc = htmlSrc;
}

$("#runButton").click(function(){
	htmleditor.focus();		
	sendData();
	$("#runButton").data("downed", "false");
});

$("#runButton").mousedown(function(){
	$("#runButton").data("downed", "true");
});

$("#numButton").click(function(){	
	if(htmleditor.renderer.getShowGutter())
	{
		htmleditor.renderer.setShowGutter(false);
		csseditor.renderer.setShowGutter(false);
		jseditor.renderer.setShowGutter(false);
	}
	else
	{
		htmleditor.renderer.setShowGutter(true);
		csseditor.renderer.setShowGutter(true);
		jseditor.renderer.setShowGutter(true);
	}
	
	if($("body").data("focus") =="html")
		htmleditor.focus();
	if($("body").data("focus") == "css")
		csseditor.focus();
	if($("body").data("focus") == "js")
		jseditor.focus();
	setWrapLength(htmleditor);
	setWrapLength(csseditor);
	setWrapLength(jseditor);
});

function readBlob(opt_startByte, opt_stopByte) {
	
	var files = document.getElementById('fileselection').files;
	
	if (!files.length) {
		alert('Please select a file!');
		return;
	}

	var file = files[0];	
	var reader = new FileReader();
	
	// If we use onloadend, we need to check the readyState.
	reader.onloadend = function(evt) {
		if (evt.target.readyState == FileReader.DONE) { 
			var str = evt.target.result;
			htmleditor.getSession().setValue(str);
			refresh();
		}
	};

	var blob = file.slice(0, file.size);
	reader.readAsBinaryString(blob);
}

$("#creditionalButton").click(function(){	
	$("#creditionalBox").fadeIn(400);
});

$("#creditionalBox").click(function(){
	$("#creditionalBox").fadeOut(400);
});

$("#descriptionButton").click(function(){	
	$("#descriptionBox").fadeIn(400);
});


$("#descriptionBox").click(function(){
	$("#descriptionBox").fadeOut(400);
});

$("#shortCutHelpBoxButton").click(function(){
	$("#shortCutHelpBox").fadeIn(400);
});

$("#shortCutHelpBox").click(function(){
	$("#shortCutHelpBox").fadeOut(400);
});

$("#fileMenu").click(function(){
	$("#fileListMenuItems").toggle();	
	$("#libsListMenuItems").hide();	
});

$("#libsMenu").click(function(){
	$("#libsListMenuItems").toggle();
	$("#fileListMenuItems").hide();
});

$("body").click(function(event){
	if( event.target.id != "fileMenu" &&
	    event.target.id != "libsMenu"){
		$("#fileListMenuItems").hide();
		$("#libsListMenuItems").hide();
	}
});

$("#outputiframe").load(function(){
	var iframe = $("#outputiframe").contents().get(0);
	$(iframe).bind('click', function(event) { 
		$("#fileListMenuItems").hide();
		$("#libsListMenuItems").hide();
	});
});
