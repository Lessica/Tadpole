<?php 
if(!function_exists('is_mobile')) {
    function is_mobile() {
        //php判断客户端是否为手机
        $agent = $_SERVER['HTTP_USER_AGENT'];
        return (strpos($agent,"NetFront") || strpos($agent,"iPhone") || strpos($agent,"iPad") || strpos($agent,"Opera Mini") || strpos($agent,"UCWEB") || strpos($agent,"Android") || strpos($agent,"Windows CE") || strpos($agent,"SymbianOS"));
    }
    $is_mobile = is_mobile();
}
?>
<!DOCTYPE HTML>
<html>
	<head>
		<meta charset="UTF-8">
		<title>82Flex 互动聊天室</title>
		<link rel="stylesheet" type="text/css" href="/css/main.css" />	
    <meta name="apple-mobile-web-app-title" content="82Flex">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta name="HandheldFriendly" content="true">
    <meta name="MobileOptimized" content="320">
	  <link rel="apple-touch-icon" href="/images/apple-touch-icon.png"/>
		<meta property="fb:app_id" content="149260988448984" />
		<meta name="title" content="82Flex" />
		<meta name="description" content="82Flex" />
		<link rel="image_src" href="/images/fb-image.jpg" / >
		<script language="javascript">
				function exFuncDiv() {
					if (document.getElementById('exfun').style.display == 'none') {
						document.getElementById('exfun').style.display='';
						document.getElementById("exfun").style.visibility='visible';
					} else {
						document.getElementById('exfun').style.display='none';
						document.getElementById("exfun").style.visibility='hidden';
					}
				}
		</script>
	</head>
	<body>
		<canvas id="canvas"></canvas>
		<div id="ui">
			<div id="fps"></div>
			<input id="chat" type="text" style="opacity: 0; width: 30px; margin-left: -15px;" />
			<div id="chatText"></div>
			<h1>82Flex</h1>
			<?php if(!$is_mobile){ ?>
			<div id="instructions" onmouseover="exFuncDiv();" onmouseout="exFuncDiv();">
				<h2>查看示例</h2>
				<div id="exfun" style="display:none">
					<p>设置昵称 /name 昵称<br />设置颜色 /sex 颜色编号(0 ~ 6)<br />显示状态 /status<br />设置速度 /speed 速度值(1 ~ 20)<br />瞬移 /goto 横坐标 纵坐标<br />短距离瞬移按住 CTRL<br />定位 /find 蝌蚪昵称或 ID<br />开始或停止追踪 /follow 蝌蚪昵称或 ID<br />保存位置 /savepos<br />读取位置 /readpos<br />查看在线列表 /dumplist<br />切换星系 /star 星系编号(1 ~ 2)<br />查看聊天记录 /record</p>
				</div>
			</div>
			<?php } ?>
			<aside id="info">
						<section id="wtf">
						<div id="server"></div>
						<?php if(!$is_mobile){ ?>
						<h2>Powered By <a rel="external" href="http://rumpetroll.com" target="_blank">Rumpetroll</a> &amp; <a rel="external" href="http://workerman.net" target="_blank">Workerman</a></h2>
						<script>
							var mobile = 0;
							document.getElementById('chat').style.display='';
						</script>
						<?php
									} else {
						?>
						<h2><a href="javascript:exFuncDiv();">❤</a> 双指手势调出或隐藏输入框</h2>
						<div id="exfun" style="display:none">
						<p>设置昵称 /name 昵称<br />设置颜色 /sex 颜色编号(0 ~ 6)<br />显示状态 /status<br />设置速度 /speed 速度值(3 ~ 20)<br />瞬移 /goto 横坐标 纵坐标<br />定位 /find 蝌蚪昵称或 ID<br />开始或停止追踪 /follow 蝌蚪昵称或 ID<br />保存位置 /savepos<br /> 读取位置 /readpos<br />查看在线列表 /dumplist<br />切换星系 /star 星系编号(1 ~ 2)<br />查看聊天记录 /record</p>
						</div>
						<script>
							var mobile = 1;
							document.getElementById('chat').style.display='none';
						</script>
						<?php
									}
						?>
						</section>
			</aside>
			<div id="cant-connect">
				与服务器断开连接。
			</div>
			<div id="unsupported-browser">
				<p>
					您的浏览器不支持 <a rel="external" href="http://en.wikipedia.org/wiki/WebSocket">WebSockets</a>
				</p>
				<p>
					<a href="#" id="force-init-button">仍然浏览</a>
				</p>
			</div>
		</div>
		<script src="http://libs.useso.com/js/jquery/2.0.0/jquery.min.js"></script>
		<script src="/js/lib/parseUri.js"></script> 
		<script src="http://libs.useso.com/js/modernizr/1.7/modernizr-1.7.min.js"></script>
		<script src="/js/lib/Stats.js"></script>
		<script src="/js/App.js"></script>
		<script src="/js/Model.js"></script>
		<script src="/js/Settings.js"></script>
		<script src="/js/Keys.js"></script>
		<script src="/js/WebSocketService.js"></script>
		<script src="/js/Camera.js"></script>
		<script src="/js/Tadpole.js"></script>
		<script src="/js/TadpoleTail.js"></script>
		<script src="/js/Message.js"></script>
		<script src="/js/WaterParticle.js"></script>
		<script src="/js/Arrow.js"></script>
		<script src="/js/formControls.js"></script>
		<script src="/js/Cookie.js"></script>
		<script src="/js/main.js"></script>
	</body>
</html>
