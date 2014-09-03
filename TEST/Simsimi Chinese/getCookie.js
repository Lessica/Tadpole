
function refresh() {
	var uid=getCookie("simsimi_uid");
	var URL="http://www.simsimi.com/talk.htm";
	if (uid) {
	} else {
		if (URL.indexOf('set_profile')>0 || URL.indexOf('uid')>0 || (URL.indexOf('kakao')>0 && URL.indexOf('push')>0)) {
		} else {
			getUid();
		}
	}
}

function getUid() {
	var URL ="http://www.simsimi.com/talk.htm";
	$.ajax({
		url: "http://www.simsimi.com/func/register",
		type: 'GET',
		dataType: 'json',
		contentType: "application/json; charset=utf-8",
		error: function(xhr, textStatus, errorThrown){
			alert("error! : "+xhr+textStatus+errorThrown);
		},
		success: function(json) {
			try{
				var uid = json.uid;
				setCookie("simsimi_uid",uid,10000);
			} catch(e) {
				alert('error! : '+e);
			}
		}
	});
}

function getCookie( name ) {
	var nameOfCookie = name + "=";
	var x = 0;
	while ( x <= document.cookie.length ) {
	var y = (x+nameOfCookie.length);
	if ( document.cookie.substring( x, y ) == nameOfCookie ) {
	if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 )
		endOfCookie = document.cookie.length;
		return unescape( document.cookie.substring( y, endOfCookie ) );
	}
	x = document.cookie.indexOf( " ", x ) + 1;
	if ( x == 0 )
		break;
	}
	return "";
}

function setCookie( cookieName, cookieValue, expireDate ) {
	var today = new Date();
	today.setDate( today.getDate() + parseInt( expireDate ) );
	document.cookie = cookieName + "=" + escape( cookieValue ) + "; path=/;domain=.simsimi.com;expires=" + today.toGMTString() + ";";
	document.cookie = cookieName + "=" + escape( cookieValue ) + "; path=/;expires=" + today.toGMTString() + ";";
}

$(document).ready(refresh());
