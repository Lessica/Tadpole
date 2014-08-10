var domain_name;
var status;
var Settings = function() {
	if ($.cookie('server')) {
		domain_name = $.cookie('server');
	}
	if (domain_name == null) {
		 var domain_arr = ['workerman.net:8280','www.workerman.net:8280','phpgame.cn:8280','www.phpgame.cn:8280'];
		 domain_name = domain_arr[Math.floor(Math.random() * domain_arr.length + 1)-1];
	}
	if ($.cookie('status')) {
		status = parseInt($.cookie('status'));
	} else {
		status = 0;
	}
  this.socketServer = 'ws://'+domain_name;
}
