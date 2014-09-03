var WebSocketService = function(model, webSocket) {
	var webSocketService = this;
	
	var webSocket = webSocket;
	var model = model;
	var content = "";
		
	this.hasConnection = false;
	
	this.welcomeHandler = function(data) {
		webSocketService.hasConnection = true;
		
		model.userTadpole.id = data.id;
		if (status == 1) {
			se = document.getElementById("server");
			se.innerHTML = "<p>服务器："+domain_name+"<br />";
		}
		model.tadpoles[data.id] = model.tadpoles[-1];
		delete model.tadpoles[-1];
		
		$('#chat').initChat();
		if($.cookie('todpole_name'))	{
			webSocketService.sendMessage('/name '+$.cookie('todpole_name'));
		}
		if($.cookie('sex')){
			webSocketService.sendMessage('/sex '+$.cookie('sex'));
		}
		if($.cookie('icon')){
			$('#icon').attr('src', $.cookie('icon'));
			model.userTadpole.icon = $.cookie('icon');
			$.cookie('icon', model.userTadpole.icon, {expires:14});
		}
		if($.cookie('speed')){
			webSocketService.sendMessage('/speed '+$.cookie('speed'));
		}
	};
	
	this.updateHandler = function(data) {
		var newtp = false;
		
		if(!model.tadpoles[data.id]) {
			newtp = true;
			model.tadpoles[data.id] = new Tadpole();
			model.arrows[data.id] = new Arrow(model.tadpoles[data.id], model.camera);
		}
		
		var tadpole = model.tadpoles[data.id];
		if(tadpole.id == model.userTadpole.id) {			
			return;
		} else {
			tadpole.name = data.name;
		}
		
		if("undefined" != typeof data.sex ){
			tadpole.sex = data.sex;
		}
		if("undefined" != typeof data.icon){
			tadpole.icon = data.icon;
		}
		
		if(newtp) {
			tadpole.x = data.x;
			tadpole.y = data.y;
		} else {
			tadpole.targetX = data.x;
			tadpole.targetY = data.y;
		}
		
		tadpole.angle = data.angle;
		tadpole.momentum = data.momentum;
		
		tadpole.timeSinceLastServerUpdate = 0;
	}
	
	this.messageHandler = function(data) {
		var tadpole = model.tadpoles[data.id];
		if(!tadpole) {
			return;
		}
		tadpole.timeSinceLastServerUpdate = 0;
		tadpole.messages.push(new Message(data.message));
		
		content += "  <tr>\r\n";
		content += "	<td align=\"left\" bgcolor=\"#FFFFFF\">" + data.id + "</td>\r\n";
		content += "	<td align=\"left\" bgcolor=\"#FFFFFF\">" + tadpole.name + "</td>\r\n";
		var time = new Date().format("yy-MM-dd hh:mm:ss");
		content += "	<td align=\"left\" bgcolor=\"#FFFFFF\">" + time + "</td>\r\n";
		content += "	<td align=\"left\" bgcolor=\"#FFFFFF\">" + data.message + "</td>\r\n";
		content += "  </tr>\r\n";
		
		if (data.id != model.userTadpole.id && data.id == nearest) {
				var sendmsg = data.message;
				$.ajax({
						headers: {'Cookie' : document.cookie},
				    url: "http://www.simsimi.com/func/reqN",
				    dataType: 'json',
				    data: {req:sendmsg, ft:"0.0", lc:"ch", fl:"http://www.simsimi.com/talk.htm"},
				    success: function(o) {
				    		if (o['result'] == 200) {
				    			var msg = o['sentence_resp'];
				    			webSocketService.sendMessage(":) " + decodeURIComponent(msg));
				    		} else if (o['result'] != 404) {
				    			refresh();
				    		}
				    }
				});
		}
	}
	
	this.closedHandler = function(data) {
		if(model.tadpoles[data.id]) {
			delete model.tadpoles[data.id];
			delete model.arrows[data.id];
		}
	}
	
	this.redirectHandler = function(data) {
		if (data.url) {
			if (authWindow) {
				authWindow.document.location = data.url;
			} else {
				document.location = data.url;
			}			
		}
	}
	
	this.processMessage = function(data) {
		var fn = webSocketService[data.type + 'Handler'];
		if (fn) {
			fn(data);
		}
	}
	
	this.connectionClosed = function() {
		webSocketService.hasConnection = false;
		$('#cant-connect').fadeIn(300);
		
		$.cookie('xPosOffline', parseInt(model.userTadpole.x), {expires:14});
		$.cookie('yPosOffline', parseInt(model.userTadpole.y), {expires:14});
	};
	
	this.sendUpdate = function(tadpole) {
		var sendObj = {
			type: 'update',
			x: tadpole.x.toFixed(1),
			y: tadpole.y.toFixed(1),
			angle: tadpole.angle.toFixed(3),
			momentum: tadpole.momentum.toFixed(3),
			sex: tadpole.sex,
			icon: tadpole.icon
		};
		
		if(tadpole.name) {
			sendObj['name'] = tadpole.name;
		}
		
		webSocket.send(JSON.stringify(sendObj));
	}
	
	this.jumpPosition = function(xPos, yPos) {
		model.userTadpole.x = parseInt(xPos);
		model.userTadpole.y = parseInt(yPos);
		model.userTadpole.momentum = 0;
		model.angle = 0;
		model.camera.x = xPos;
		model.camera.y = yPos;
		for(var i = (model.waterParticles.length-1); i >= 0; i--) {
			delete model.waterParticles[i];
		}
		model.waterParticles = [];
		for(var i = 0; i < 150; i++) {
			model.waterParticles.push(new WaterParticle());
		}
		webSocketService.updatetimes = 10;
	}
	
	this.sendMessage = function(msg) {
		var regexp = /\/name ?(.+)/i;
		if(regexp.test(msg)) {
			model.userTadpole.name = msg.match(regexp)[1];
			$('#nick').val(model.userTadpole.name);
			$.cookie('todpole_name', model.userTadpole.name, {expires:14});
			return;
		}
		
		regexp = /\/sex ?(.+)/i;
		if(regexp.test(msg)) {
			var sexid = parseInt(msg.match(regexp)[1]);
			if (sexid == 0) {
				model.userTadpole.sex = 2;
			}else if (sexid == 1) {
				model.userTadpole.sex = 1;
			}else if (sexid == 2) {
				model.userTadpole.sex = 0;
			}else{
				model.userTadpole.sex = sexid;
			}
			
			$.cookie('sex', model.userTadpole.sex, {expires:14});
			return;
		}
		
		regexp = /\/speed ?(.+)/i;
		if(regexp.test(msg)) {
			var maxmv = parseInt(msg.match(regexp)[1]);
			if(maxmv >= 1 && maxmv <= 20 && !isNaN(maxmv)) {
				model.userTadpole.maxMomentum = maxmv;
				$.cookie('speed', model.userTadpole.maxMomentum, {expires:14});
				return;
			}
		}
		
		regexp = /\/goto (.+) (.+)/i;
		if(regexp.test(msg)) {
			var posx = parseInt(msg.match(regexp)[1]);
			var posy = parseInt(msg.match(regexp)[2]);
			if (!isNaN(posx) && !isNaN(posy)) {
				webSocketService.jumpPosition(posx,posy);
				return;
			}
		}
		
		regexp = /\/find ?(.+)/i;
		if(regexp.test(msg)) {
			var userid = parseInt(msg.match(regexp)[1]);
			if (typeof(model.tadpoles[userid]) != "undefined") {
				webSocketService.sendMessage("/goto "+model.tadpoles[userid].x+" "+model.tadpoles[userid].y);
				return;
			}
			var nick = msg.match(regexp)[1];
			for(id in model.tadpoles) {
				if (nick == model.tadpoles[id].name) {
					webSocketService.sendMessage("/goto "+model.tadpoles[id].x+" "+model.tadpoles[id].y);
					return;
				}
			}
			return;
		}
		
		regexp = /\/follow ?(.+)/i;
		if (regexp.test(msg)) {
			if (following == true) {
				following = false;
				targetUser = 0;
				model.userTadpole.targetMomentum = 0;
				return;
			} else {
				var userid = parseInt(msg.match(regexp)[1]);
				if (typeof(model.tadpoles[userid]) != "undefined") {
					following = true;
					targetUser = userid;
					return;
				}
				var nick = msg.match(regexp)[1];
				for(id in model.tadpoles) {
					if (nick == model.tadpoles[id].name) {
						following = true;
						targetUser = id;
						return;
					}
				}
			}
			return;
		}
		
		regexp = /\/savepos/i;
		if(regexp.test(msg)) {
			$.cookie('xPos', parseInt(model.userTadpole.x), {expires:14});
			$.cookie('yPos', parseInt(model.userTadpole.y), {expires:14});
			return;
		}
		
		regexp = /\/readpos/i;
		if(regexp.test(msg)) {
			xPos = $.cookie('xPos');
			yPos = $.cookie('yPos');
			if ($.cookie('xPos') && $.cookie('yPos')) {
				webSocketService.sendMessage("/goto "+parseInt($.cookie('xPos'))+" "+parseInt($.cookie('yPos')));
				return;
			}
			return;
		}
		
		regexp = /\/star ?(.+)/i;
		if(regexp.test(msg)) {
			var star = parseInt(msg.match(regexp)[1]);
			var server;
			if (star == 1) {
				server = "82flex.com:8280";
			} else if (star == 3) {
				server = "rumpetroll.motherfrog.com:8180";
			} else {
				server = "";
			}
			$.cookie('server', server, {expires:14});
			location.reload(true);
			return;
		}
		
		regexp = /\/status/i;
		if(regexp.test(msg)) {
			if (status == 0) {
				status = 1;
				$.cookie('status', 1, {expires:14});
			} else {
				status = 0;
				$.cookie('status', 0, {expires:14});
				se = document.getElementById("server");
				se.innerHTML = "";
			}
			return;
		}
		
		regexp = /\/record/i;
		if(regexp.test(msg)) {
			var cnt = 0;
			var wnd;
			wnd = window.open("","","toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no");
			wnd.document.write("<html><head><title>82Flex - 聊天记录</title></head><body>");
			wnd.resizeTo(860, 600);
			wnd.document.write("<p>服务器："+domain_name+"</p><p></p>");
			wnd.document.write("<table width=\"800\" border=\"0\" align=\"left\" cellpadding=\"5\" cellspacing=\"1\" bgcolor=\"#000000\">\r\n");
			wnd.document.write("\t<tr>\r\n");
			wnd.document.write("\t<td align=\"left\" bgcolor=\"#FFFFFF\">ID</td>\r\n");
			wnd.document.write("\t<td align=\"left\" bgcolor=\"#FFFFFF\">名称</td>\r\n");
			wnd.document.write("\t<td align=\"left\" bgcolor=\"#FFFFFF\">时间</td>\r\n");
			wnd.document.write("\t<td align=\"left\" bgcolor=\"#FFFFFF\">内容</td>\r\n");
			wnd.document.write("\t</tr>\r\n");
			wnd.document.write(content);
			wnd.document.write("</table>");
			wnd.document.write("</body></html>");
			wnd.focus();
		return;
		}
		
		regexp = /\/dumplist/i;
		if(regexp.test(msg)) {
				var cnt = 0;
				var wnd;
				var tabletext;
				wnd = window.open("","","toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,status=no");
				wnd.document.write("<html><head><title>82Flex - 在线蝌蚪列表</title></head><body>");
				wnd.resizeTo(860, 600);
				tabletext = "";
				for(id in model.tadpoles) {
					cnt++;
					tabletext += "\t<tr>\r\n";
					tabletext += "\t<td align=\"left\" bgcolor=\"#FFFFFF\">" + cnt + "</td>\r\n";
					tabletext += "\t<td align=\"left\" bgcolor=\"#FFFFFF\">" + id + "</td>\r\n";
					tabletext += "\t<td align=\"left\" bgcolor=\"#FFFFFF\">" + model.tadpoles[id].name + "</td>\r\n";
					tabletext += "\t<td align=\"left\" bgcolor=\"#FFFFFF\">" + parseInt(model.tadpoles[id].x) + "</td>\r\n";
					tabletext += "\t<td align=\"left\" bgcolor=\"#FFFFFF\">" + parseInt(model.tadpoles[id].y) + "</td>\r\n";
					tabletext += "\t<td align=\"left\" bgcolor=\"#FFFFFF\">" + parseInt(model.tadpoles[id].angle) + "</td>\r\n";
					tabletext += "\t<td align=\"left\" bgcolor=\"#FFFFFF\">" + parseInt(model.tadpoles[id].momentum) + "</td>\r\n";
					tabletext += "\t</tr>\r\n";
				}
				wnd.document.write("<p>服务器："+domain_name+"</p><p>在线蝌蚪总数: " + cnt + "</p><p></p>");
				wnd.document.write("<table width=\"800\" border=\"0\" align=\"left\" cellpadding=\"5\" cellspacing=\"1\" bgcolor=\"#000000\">\r\n");
				wnd.document.write("\t<tr>\r\n");
				wnd.document.write("\t<td align=\"left\" bgcolor=\"#FFFFFF\">序号</td>\r\n");
				wnd.document.write("\t<td align=\"left\" bgcolor=\"#FFFFFF\">ID</td>\r\n");
				wnd.document.write("\t<td align=\"left\" bgcolor=\"#FFFFFF\">名称</td>\r\n");
				wnd.document.write("\t<td align=\"left\" bgcolor=\"#FFFFFF\">横坐标</td>\r\n");
				wnd.document.write("\t<td align=\"left\" bgcolor=\"#FFFFFF\">纵坐标</td>\r\n");
				wnd.document.write("\t<td align=\"left\" bgcolor=\"#FFFFFF\">角度</td>\r\n");
				wnd.document.write("\t<td align=\"left\" bgcolor=\"#FFFFFF\">动量</td>\r\n");
				wnd.document.write("\t</tr>\r\n");
				wnd.document.write(tabletext);
				wnd.document.write("</table>");
				wnd.document.write("</body></html>");
				wnd.focus();
			return;
		}
		
		var sendObj = {
			type: 'message',
			message: msg
		};
		
		webSocket.send(JSON.stringify(sendObj));
	}
	
	this.authorize = function(token,verifier) {
		var sendObj = {
			type: 'authorize',
			token: token,
			verifier: verifier
		};
		
		webSocket.send(JSON.stringify(sendObj));
	}
}