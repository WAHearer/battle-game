var socket=io('ws://localhost:3000');
function login(name){
	socket.emit('login',name);
}
socket.on('home',function(data){
	if(data.flag){
		alert("已有重名用户！");
	}
	else{
		localStorage.setItem('name',data.name);
		localStorage.setItem('playerCount',data.playerCount);
		document.querySelector('#game').src='home.html';
	}
});
function play(){
	socket.emit('play');
}
socket.on('play',function(data){
	localStorage.setItem('oppoName',data.name);
	localStorage.setItem('turn',1);
	document.querySelector('#game').src='battleField.html';
});
function setUse(use){
	socket.emit('use',use);
}
function act(action){
	socket.emit('act',action);
}
socket.on('judge',function(data){
	document.querySelector('#game').contentWindow.showJudge(data);
	if(data===1){
		document.querySelector('#game').contentWindow.showAct();
	}
	else if(data===-1){
		document.querySelector('#game').contentWindow.oppoAct();
	}
	else{
		var turn=localStorage.getItem("turn");
		turn++;
		localStorage.setItem('turn',turn);
		document.querySelector('#game').contentWindow.init();
	}
});
socket.on('result',function(data){
	alert(data);
	document.querySelector('#game').src="home.html";
});
socket.on('actDone',function(data){
	localStorage.setItem('selfHp',data.selfHp);
	localStorage.setItem('oppoHp',data.oppoHp);
	localStorage.setItem('turn',data.turn);
	document.querySelector('#game').contentWindow.init();
});
