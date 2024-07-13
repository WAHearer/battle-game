function login(){
	var name=document.getElementById("name").value;
	if(name=="")
		alert("请输入昵称！");
	else
		parent.login(name);
}