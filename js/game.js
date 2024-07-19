var socket=io('ws://192.168.1.231:3000');
localStorage.setItem('ability',null);
localStorage.setItem('abilityName',"无");
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
function abilityName(id){
	if(id===null)
		return "无";
	else if(id===1)
		return "涅槃";
	else if(id===2)
		return "护盾";
	else if(id===3)
		return "吸血";
	else if(id===4)
		return "平伤";
	else if(id===5)
		return "崩坏";
	else if(id===6)
		return "超伤";
	else if(id===7)
		return "矢北";
	else if(id===8)
		return "夷灭";
	else if(id===9)
		return "缔盟";
	else if(id===10)
		return "强袭";
	else if(id===11)
		return "讨伐";
}
function chooseAbility(){
	document.querySelector('#game').src='chooseAbility.html';
}
function equipAbility(id){
	document.querySelector('#game').src='home.html';
	socket.emit('equipAbility',id);
	localStorage.setItem('ability',id);
	localStorage.setItem('abilityName',abilityName(id));
}
function play(){
	socket.emit('play');
}
socket.on('play',function(data){
	localStorage.setItem('oppoName',data.oppoName);
	localStorage.setItem('oppoAbility',data.oppoAbility);
	localStorage.setItem('oppoAbilityName',data.oppoAbilityName);
	localStorage.setItem('turn',1);
	localStorage.setItem('selfHp',data.selfHp);
	localStorage.setItem('oppoHp',data.oppoHp);
	localStorage.setItem('selfShield',data.selfShield);
	localStorage.setItem('oppoShield',data.oppoShield);
	localStorage.setItem('selfAbilityFlag',data.selfAbilityFlag);
	localStorage.setItem('oppoAbilityFlag',data.oppoAbilityFlag);
	document.querySelector('#game').src='battleField.html';
});
function setUse(use){
	socket.emit('use',use);
}
function act(action){
	if(action===1){
		if(localStorage.getItem('ability')==='8'&&localStorage.getItem('selfAbilityFlag')==='0')
			document.querySelector('#game').contentWindow.showAbility();
		else
			socket.emit('act',action);
	}
	else
		socket.emit('act',action);
}
function useAbility(op){
	if(localStorage.getItem('ability')==='8'){
		if(op===1)
			socket.emit('act',3);
		else
			socket.emit('act',1);
	}
	if(localStorage.getItem('ability')==='9'){
		if(op===1)
			socket.emit('useDimeng');
		else
			document.querySelector('#game').contentWindow.init();
	}
	if(localStorage.getItem('ability')==='10'){
		if(op===1)
			socket.emit('useQiangxi');
		else
			document.querySelector('#game').contentWindow.init();
	}
	if(localStorage.getItem('ability')==='11'){
		if(op===1)
			socket.emit('useTaofa');
		else
			document.querySelector('#game').contentWindow.init();
	}
}
function gameReset(){
	if(localStorage.getItem('ability')==='1')
		localStorage.setItem('abilityName',"涅槃");
	if(localStorage.getItem('ability')==='11')
		localStorage.setItem('abilityName',"讨伐");
	document.querySelector('#game').src="home.html";
}
socket.on('playerCountUpdate',function(data){
	localStorage.setItem('playerCount',data);
	if(document.querySelector('#game').src.includes("home.html"))
		document.querySelector('#game').contentWindow.refresh();
});
socket.on('judge',function(data){
	document.querySelector('#game').contentWindow.showJudge(data);
	if(data===1){
		document.querySelector('#game').contentWindow.showAct();
	}
	else if(data===-1){
		document.querySelector('#game').contentWindow.oppoAct();
	}
});
socket.on('result',function(data){
	alert(data);
	gameReset();
});
socket.on('actDone',function(data){
	localStorage.setItem('selfHp',data.selfHp);
	localStorage.setItem('oppoHp',data.oppoHp);
	localStorage.setItem('selfShield',data.selfShield);
	localStorage.setItem('oppoShield',data.oppoShield);
	localStorage.setItem('selfAbilityFlag',data.selfAbilityFlag);
	localStorage.setItem('oppoAbilityFlag',data.oppoAbilityFlag);
	localStorage.setItem('turn',data.turn);
	if(localStorage.getItem('ability')==='1'&&localStorage.getItem('selfAbilityFlag')==='1')
		localStorage.setItem('abilityName',"涅槃（已发动）");
	if(localStorage.getItem('oppoAbility')==='1'&&localStorage.getItem('oppoAbilityFlag')==='1')
		localStorage.setItem('oppoAbilityName',"涅槃（已发动）");
	document.querySelector('#game').contentWindow.init();
	if(localStorage.getItem('ability')==='9'&&localStorage.getItem('turn')==='2'){
		document.querySelector('#game').contentWindow.showAbility();
		return;
	}
	if(localStorage.getItem('ability')==='11'&&localStorage.getItem('selfAbilityFlag')==='0'){
		document.querySelector('#game').contentWindow.showAbility();
		return;
	}
});
socket.on('oppoExitGame',function(){
	alert('对方已退出游戏！');
	gameReset();
});
socket.on('oppoUseAbility',function(){
	alert("对方发动了技能 "+localStorage.getItem('oppoAbilityName'));
});
socket.on('abilityDone',function(data){
	localStorage.setItem('selfHp',data.selfHp);
	localStorage.setItem('oppoHp',data.oppoHp);
	localStorage.setItem('selfShield',data.selfShield);
	localStorage.setItem('oppoShield',data.oppoShield);
	localStorage.setItem('selfAbilityFlag',data.selfAbilityFlag);
	localStorage.setItem('oppoAbilityFlag',data.oppoAbilityFlag);
	if(localStorage.getItem('ability')==='1'&&localStorage.getItem('selfAbilityFlag')==='1')
		localStorage.setItem('abilityName',"涅槃（已发动）");
	if(localStorage.getItem('oppoAbility')==='1'&&localStorage.getItem('oppoAbilityFlag')==='1')
		localStorage.setItem('oppoAbilityName',"涅槃（已发动）");
	if(localStorage.getItem('ability')==='11'&&localStorage.getItem('selfAbilityFlag')==='1')
		localStorage.setItem('abilityName',"讨伐（已发动）");
	if(localStorage.getItem('oppoAbility')==='11'&&localStorage.getItem('oppoAbilityFlag')==='1')
		localStorage.setItem('oppoAbilityName',"讨伐（已发动）");
	document.querySelector('#game').contentWindow.init();
});
socket.on('qiangxi',function(){
	document.querySelector('#game').contentWindow.showAbility();
});