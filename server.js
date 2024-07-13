var server=require('http').createServer();
var io=require('socket.io')(server);
var playerCount=0,players=[];
server.listen(3000,function(){
	console.log('server starting...');
})
function isExistHost(player1){
	var availablePlayers=players.filter(function(player){
		return player.state===0&&player.onSearch&&player1!== player&&player.isHost;
	});
	return availablePlayers.length;
}
function findPlayer(player1){
	var availablePlayers=players.filter(function(player){
		return player.state===0&&player.onSearch&&player1!==player&&!player.isHost;
	});
	if(availablePlayers.length>0){
		var index=~~(Math.random()*availablePlayers.length);
		return availablePlayers[index];
	}
	return null;
}
function judge(self){//0平局，1胜，-1败
	if(self.player1.use===self.player2.use){
		self.player1.socket.emit('judge',0);
		self.player2.socket.emit('judge',0);
		self.turn++;
	}
	else if((self.player1.use===1&&self.player2.use===2)||(self.player1.use===2&&self.player2.use===3)||(self.player1.use===3&&self.player2.use===1)){
		self.player1.socket.emit('judge',-1);
		self.player2.socket.emit('judge',1);
	}
	else{
		self.player1.socket.emit('judge',1);
		self.player2.socket.emit('judge',-1);
	}
	self.player1.use=null;
	self.player2.use=null;
}
function setUse(self,use,id){
	if(id===1)
		self.player1.use=use;
	else if(id===2)
		self.player2.use=use;
	if(self.player1.use!==null&&self.player2.use!==null)
		judge(self);
}
function result(self,str){
	self.player1.state=0;
	self.player2.state=0;
	self.player1.gamePlay=null;
	self.player2.gamePlay=null;
	self.player1.socket.emit('result',str);
	self.player2.socket.emit('result',str);
}
function act(self,action,id){//1攻击 2回血
	if(action===1){
		if(id===1){
			if(self.player2.hp===0)
				result(self,self.player1.name+'赢了');
			else{
				if(self.player1.hp===0)
					self.player2.hp=0;
				else if(self.player1.hp===1){
					var num=self.player1.hp;
					self.player1.hp=self.player2.hp;
					self.player2.hp=num;
				}
				else{
					self.player2.hp-=Math.floor(self.player1.hp/2);
					if(self.player2.hp<0)
						result(self,self.player1.name+'赢了');
				}
			}
		}
		else{
			if(self.player1.hp===0)
				result(self,self.player2.name+'赢了');
			else{
				if(self.player2.hp===0)
					self.player1.hp=0;
				else if(self.player2.hp===1){
					var num=self.player1.hp;
					self.player1.hp=self.player2.hp;
					self.player2.hp=num;
				}
				else{
					self.player1.hp-=Math.floor(self.player2.hp/2);
					if(self.player1.hp<0)
						result(self,self.player2.name+'赢了');
				}
			}
		}
	}
	else{
		if(id===1)
			self.player1.hp++;
		else
			self.player2.hp++;
	}
	self.turn++;
	self.player1.socket.emit('actDone',{'selfHp':self.player1.hp,'oppoHp':self.player2.hp,'turn':self.turn});
	self.player2.socket.emit('actDone',{'selfHp':self.player2.hp,'oppoHp':self.player1.hp,'turn':self.turn});
}
function player(socket,name){
	this.socket=socket;
	this.name=name;
	this.state=0;//0为空闲，1为游戏中
	this.gamePlay=null;
	this.isHost=0;
	this.onSearch=0;
	this.id=null;
	this.use=null;//1剪刀 2石头 3布
	this.hp=3;
	playerCount++;
	players.push(this);
	var self=this;
	this.socket.on('disconnect',function(){
		players=players.filter(function(value){
			return value.name!==self.name;
		})
		playerCount--;
		console.log(self.name+'已退出游戏');
	});
	this.socket.on('play',function(){
		self.onSearch=1;
		if(isExistHost(self)>0){
			return;
		}
		self.isHost=1;
		var player2=null;
		self.timer=setInterval(function(){
			console.log('正在匹配...');
			if (player2=findPlayer(self)){
				console.log('匹配成功');
				self.gamePlay=new game(self,player2);
				player2.gamePlay=self.gamePlay;
				clearInterval(self.timer);
			}
		},1000)
	});
	this.socket.on('use',function(data){
		setUse(self.gamePlay,data,self.id);
	});
	this.socket.on('act',function(data){
		act(self.gamePlay,data,self.id);
	});
}
function game(player1,player2){
	this.turn=1;
	this.player1=player1;
	this.player2=player2;
	this.player1.state=1;
	this.player2.state=1;
	this.player1.onSearch=0;
	this.player2.onSearch=0;
	this.player1.isHost=0;
	this.player2.isHost=0;
	this.player1.hp=3;
	this.player2.hp=3;
	this.player1.id=1;
	this.player2.id=2;
	this.player1.socket.emit('play', {'name': this.player2.name});
	this.player2.socket.emit('play', {'name': this.player1.name});
}
io.on('connection',function(socket){
	socket.on('login',function(name){
		var flag=players.some(function(value){
			return value.name===name;
		})
		if(flag){
			socket.emit('home',{'flag':true});
		}
		else{
			console.log(name+'登录');
			new player(socket,name);
			socket.emit('home',{'flag':false,'playerCount':playerCount,'name':name});
		}
	})
})
io.on('close',function(socket){
	console.log('服务器关闭');
})
