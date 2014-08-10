var settings = new Settings();

var debug = false;
var isStatsOn = false;
var timeout = 0;
var has_set_timeout = 0;
var authWindow;
var statushide = 0;

var app;
var runLoop = function() {
	app.update();
	app.draw();
}
var initApp = function() {
	if (app!=null) { return; }
	app = new App(settings, document.getElementById('canvas'));

	window.addEventListener('resize', app.resize, false);
	if (mobile == 1) {
		document.addEventListener('touchstart',app.touchstart, false);
		document.addEventListener('touchend',app.touchend, false);
		document.addEventListener('touchcancel',app.touchend, false);
		document.addEventListener('touchmove',app.touchmove, false);
		
		document.addEventListener('gesturestart',app.gesturestart, false);
		document.addEventListener('gestureend',app.gestureend, false);
	} else {
		//document.addEventListener('dblclick',app.dblclick, false);
		document.addEventListener('mousemove',app.mousemove, false);
		document.addEventListener('mousedown',app.mousedown, false);
		document.addEventListener('mouseup',app.mouseup, false);
	}
	document.addEventListener('keydown',app.keydown, false);
	document.addEventListener('keyup',app.keyup, false);
	
	setInterval(runLoop,30);
}

var forceInit = function() {
	initApp()
	document.getElementById('unsupported-browser').style.display = "none";
	return false;
}

if(Modernizr.canvas && Modernizr.websockets) {
	initApp();
} else {
	document.getElementById('unsupported-browser').style.display = "block";	
	document.getElementById('force-init-button').addEventListener('click', forceInit, false);
}

var addStats = function() {
	if (isStatsOn) { return; }
	// Draw fps
	var stats = new Stats();
	document.getElementById('fps').appendChild(stats.domElement);

	setInterval(function () {
	    stats.update();
	}, 1000/60);

	// Array Remove - By John Resig (MIT Licensed)
	Array.remove = function(array, from, to) {
	  var rest = array.slice((to || from) + 1 || array.length);
	  array.length = from < 0 ? array.length + from : from;
	  return array.push.apply(array, rest);
	};
	isStatsOn = true;
}

if(debug) { addStats(); }

$(function() {
	$('a[rel=external]').click(function(e) {
		e.preventDefault();
		window.open($(this).attr('href'));
	});
});

document.body.onselectstart = function() { return false; }

Date.prototype.format = function(fmt){
    var year    =   this.getFullYear();
    var month   =   this.getMonth()+1;
    var date    =   this.getDate();
    var hour    =   this.getHours();
    var minute  =   this.getMinutes();
    var second  =   this.getSeconds();
		fmt = fmt.replace("yyyy",year);
		fmt = fmt.replace("yy",year%100);
		fmt = fmt.replace("MM",fix(month));
		fmt = fmt.replace("dd",fix(this.getDate()));
		fmt = fmt.replace("hh",fix(this.getHours()));
		fmt = fmt.replace("mm",fix(this.getMinutes()));
		fmt = fmt.replace("ss",fix(this.getSeconds()));
		return fmt;
		function fix(n){
				return n<10?"0"+n:n;
		}
}
