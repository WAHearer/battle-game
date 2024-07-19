function play(){
	document.getElementById("startSearch").innerText="匹配中...";
	parent.play();
}
function refresh(){
	document.getElementById("nameText").innerText=localStorage.getItem('name');
	document.getElementById('count').innerText=localStorage.getItem('playerCount')+"人";
	document.getElementById('ability').innerText=localStorage.getItem('abilityName');
}
function chooseAbility(){
	parent.chooseAbility();
}