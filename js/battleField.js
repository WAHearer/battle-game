function setUse(use){
	document.getElementById("useSelect").style.display="none";
	document.getElementById("useAbility").style.display="none";
	var str;
	if(use===1)
		str="剪刀";
	else if(use===2)
		str="石头";
	else
		str="布";
	document.getElementById("selfUse").innerText=str;
	document.getElementById("condition").innerText="等待对手出拳...";
	parent.setUse(use);
}
function showJudge(result){
	if(result===0)
		document.getElementById("judgeText").innerText="平局";
	else if(result===1)
		document.getElementById("judgeText").innerText="你获胜";
	else
		document.getElementById("judgeText").innerText="对手获胜";
}
function showAct(){
	document.getElementById("condition").innerText="由你行动";
	document.getElementById("actSelect").style.display="block";
}
function oppoAct(){
	document.getElementById("condition").innerText="等待对手行动...";
}
function act(action){
	parent.act(action);
}
function showAbility(){
	document.getElementById("useSelect").style.display="none";
	document.getElementById("actSelect").style.display="none";
	document.getElementById("useAbility").style.display="block";
}
function useAbility(op){
	document.getElementById("useAbility").style.display="none";
	parent.useAbility(op);
}
function init(){
	document.getElementById("turn").innerText=localStorage.getItem("turn");
	document.getElementById("selfHp").innerText=localStorage.getItem("selfHp");
	document.getElementById("selfAbility").innerText=localStorage.getItem("abilityName");
	document.getElementById("oppoAbility").innerText=localStorage.getItem("oppoAbilityName");
	document.getElementById("oppoHp").innerText=localStorage.getItem("oppoHp");
	document.getElementById("selfShield").innerText=localStorage.getItem("selfShield");
	document.getElementById("oppoShield").innerText=localStorage.getItem("oppoShield");
	document.getElementById("selfUse").innerText="";
	document.getElementById("condition").innerText="战斗";
	document.getElementById("judgeText").innerText="-";
	document.getElementById("useSelect").style.display="block";
	document.getElementById("actSelect").style.display="none";
}