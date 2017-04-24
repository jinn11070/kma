/* timmer */
var count = new Date("February 09,2018 20:18:00"); // D-Day
var xmlHttp;
function srvTime(){
	if(window.XMLHttpRequest){
		xmlHttp = new XMLHttpRequest();
		xmlHttp.open('HEAD',window.location.href.toString(),false);
		xmlHttp.setRequestHeader("Content-Type","text/html");
		xmlHttp.send('');
		return xmlHttp.getResponseHeader("Date");
	}else if(window.ActiveXObject){
		xmlHttp =new ActiveXObject('Msxml2.XMLHTTP');
		xmlHttp.open('HEAD',window.location.href.toString(),false);
		xmlHttp.setRequestHeader("Content-Type","text/html");
		xmlHttp.send('');
		return xmlHttp.getResponseHeader("Date");
	}
}
var st = srvTime();
var today = new Date(st);
setInterval(timer, 1000);

function timer(){
	today = today - 1000 + 2000;

	var gap = Math.round((count-today) / 1000);

	var D = Math.floor(gap / 86400);

	$('#D_100').html(D.toString().substr(0, 1));
	$('#D_10').html(D.toString().substr(1, 1));
	$('#D_1').html(D.toString().substr(2, 1));
	var H = Math.floor((gap - D * 86400) / 3600 % 3600);
	if(H.toString() > 10){
		$('#H_10').html(H.toString().substr(0, 1));
		$('#H_1').html(H.toString().substr(1, 1));
	}else{
		$('#H_10').html('0');
		$('#H_1').html(H.toString().substr(0, 1));
	}
	var M = Math.floor((gap - H * 3600) / 60 % 60);
	if(M.toString() > 10){
		$('#M_10').html(M.toString().substr(0, 1));
		$('#M_1').html(M.toString().substr(1, 1));
	}else{
		$('#M_10').html('0');
		$('#M_1').html(M.toString().substr(0, 1));
	}
	var S = Math.floor((gap - M * 60) % 60);
	if(S.toString() > 10){
		$('#S_10').html(S.toString().substr(0, 1));
		$('#S_1').html(S.toString().substr(1, 1));
	}else{
		$('#S_10').html('0');
		$('#S_1').html(S.toString().substr(0, 1));
	}
}
