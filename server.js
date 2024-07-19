var server=require('http').createServer();
var io=require('socket.io')(server);
var playerCount=0,players=[];
server.listen(3000,function(){
	console.log('server starting...');
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
function abilityHp(id){
	if(id===null)
		return 4;
	else if(id===1)
		return 3;
	else if(id===2)
		return 3;
	else if(id===3)
		return 3;
	else if(id===4)
		return 3;
	else if(id===5)
		return 8;
	else if(id===6)
		return 4;
	else if(id===7)
		return 3;
	else if(id===8)
		return 3;
	else if(id===9)
		return 3;
	else if(id===10)
		return 4;
	else if(id===11)
		return 3;
}
function abilityShield(id){
	if(id===2)
		return 2;
	else
		return 0;
}
function isExistHost(player1){
	var availablePlayers=players.filter(function(player){
		return player.state===0&&player.onSearch&&player1.name!==player.name&&player.isHost;
	});
	return availablePlayers.length;
}
function findPlayer(player1){
	var availablePlayers=players.filter(function(player){
		return player.state===0&&player.onSearch&&player1.name!==player.name&&!player.isHost;
	});
	if(availablePlayers.length>0){
		var index=~~(Math.random()*availablePlayers.length);
		return availablePlayers[index];
	}
	return null;
}
function dealDamage(self,id,damage){
	if(id===2){
		if(self.player1.ability===6&&self.player1.abilityCount!==0){
			damage+=self.player1.abilityCount;
			self.player1.abilityCount=0;
			if(damage>=4&&self.player1.abilityFlag===0){
				self.player1.abilityFlag=1;
				self.player1.shield+=1;
			}
		}
		if(self.player2.ability===7){
			if(self.player2.abilityFlag===0){
				self.player2.abilityFlag=2;
				self.player2.hp++;
			}
			else{
				if(self.player2.hp===0){
					if(self.player2.shield!==0)
						self.player2.shield--;
					else
						result(self,self.player1.name+'赢了');
				}
				else
					self.player2.hp--;
			}
		}
		if(damage>self.player2.hp||self.player2.hp===0){
			if(self.player1.ability===3)
				self.player1.hp+=self.player2.hp;
			if(self.player2.ability===6)
				self.player2.abilityCount+=self.player2.hp;
			if(self.player1.ability===11&&self.player1.hp<=self.player2.hp)
				self.player1.abilityCount+=self.player2.hp;
			if(self.player2.ability===11)
				self.player2.abilityCount+=self.player2.hp;
			if(self.player2.shield!==0){
				self.player2.hp=0;
				self.player2.shield--;
			}
			else if(self.player2.ability===1&&self.player2.abilityFlag===0){
				self.player2.hp=2;
				var hpStolen=Math.floor(self.player1.hp/2);
				if(self.player1.ability===6)
					self.player1.abilityCount+=hpStolen;
				self.player1.hp-=hpStolen;
				self.player2.hp+=hpStolen;
				self.player2.abilityFlag=1;
			}
			else
				result(self,self.player1.name+'赢了');
		}
		else{
			if(self.player1.ability===3)
				self.player1.hp+=damage;
			if(self.player2.ability===6)
				self.player2.abilityCount+=damage;
			if(self.player1.ability===11&&self.player1.hp<=self.player2.hp)
				self.player1.abilityCount+=damage;
			if(self.player2.ability===11)
				self.player2.abilityCount+=damage;
			self.player2.hp-=damage;
		}
	}
	else{
		if(self.player2.ability===6&&self.player2.abilityCount!==0){
			damage+=self.player2.abilityCount;
			self.player2.abilityCount=0;
			if(damage>=4&&self.player2.abilityFlag===0){
				self.player2.abilityFlag=1;
				self.player2.shield+=1;
			}
		}
		if(self.player1.ability===7){
			if(self.player1.abilityFlag===0){
				self.player1.abilityFlag=2;
				self.player1.hp++;
			}
			else{
				if(self.player1.hp===0){
					if(self.player1.shield!==0)
						self.player1.shield--;
					else
						result(self,self.player2.name+'赢了');
				}
				else
					self.player1.hp--;
			}
		}
		if(damage>self.player1.hp||self.player1.hp===0){
			if(self.player2.ability===3)
				self.player2.hp+=self.player1.hp;
			if(self.player1.ability===6)
				self.player1.abilityCount+=self.player1.hp;
			if(self.player1.ability===11)
				self.player1.abilityCount+=self.player1.hp;
			if(self.player2.ability===11&&self.player2.hp<=self.player1.hp)
				self.player2.abilityCount+=self.player1.hp;
			if(self.player1.shield!==0){
				self.player1.hp=0;
				self.player1.shield--;
			}
			else if(self.player1.ability===1&&self.player1.abilityFlag===0){
				self.player1.hp=2;
				var hpStolen=Math.floor(self.player2.hp/2);
				if(self.player2.ability===6)
					self.player2.abilityCount+=hpStolen;
				self.player2.hp-=hpStolen;
				self.player1.hp+=hpStolen;
				self.player1.abilityFlag=1;
			}
			else
				result(self,self.player2.name+'赢了');
		}
		else{
			if(self.player2.ability===3)
				self.player2.hp+=damage;
			if(self.player1.ability===6)
				self.player1.abilityCount+=damage;
			if(self.player1.ability===11)
				self.player1.abilityCount+=damage;
			if(self.player2.ability===11&&self.player2.hp<=self.player1.hp)
				self.player2.abilityCount+=damage;
			self.player1.hp-=damage;
		}
	}
	if(self.player1.ability===10)
		self.player1.socket.emit('qiangxi');
	if(self.player2.ability===10)
		self.player2.socket.emit('qiangxi');
}
function judge(self){//0平局，1胜，-1败
	if(self.player1.use===self.player2.use){
		if(self.player1.ability===4&&self.player1.abilityCount<3){
			self.player1.abilityCount++;
			dealDamage(self,2,self.player1.abilityCount);
		}
		if(self.player2.ability===4&&self.player2.abilityCount<3){
			self.player2.abilityCount++;
			dealDamage(self,1,self.player2.abilityCount);
		}
		self.player1.socket.emit('judge',0);
		self.player2.socket.emit('judge',0);
		if(self.player1.ability===5&&self.player1.hp>self.player2.hp)
			self.player1.hp--;
		if(self.player2.ability===5&&self.player2.hp>self.player1.hp)
			self.player2.hp--;
		self.turn++;
		if(self.player1.ability===7&&self.player1.abilityFlag!==0)
			self.player1.abilityFlag--;
		if(self.player2.ability===7&&self.player2.abilityFlag!==0)
			self.player2.abilityFlag--;
		if(self.player1.ability===8&&self.player1.abilityFlag>0)
			self.player1.abilityFlag--;
		if(self.player2.ability===8&&self.player2.abilityFlag>0)
			self.player2.abilityFlag--;
		if(self.player1.gamePlay!==null){
			self.player1.socket.emit('actDone',{'selfHp':self.player1.hp,'oppoHp':self.player2.hp,'selfShield':self.player1.shield,'oppoShield':self.player2.shield,'selfAbilityFlag':self.player1.abilityFlag,'oppoAbilityFlag':self.player2.abilityFlag,'turn':self.turn});
			self.player2.socket.emit('actDone',{'selfHp':self.player2.hp,'oppoHp':self.player1.hp,'selfShield':self.player2.shield,'oppoShield':self.player1.shield,'selfAbilityFlag':self.player2.abilityFlag,'oppoAbilityFlag':self.player1.abilityFlag,'turn':self.turn});
		}
	}
	else if((self.player1.use===1&&self.player2.use===2)||(self.player1.use===2&&self.player2.use===3)||(self.player1.use===3&&self.player2.use===1)){
		if(self.player2.ability===8&&self.player2.abilityFlag===-1){
			self.player2.abilityCount=0;
			self.player2.abilityFlag=0;
		}
		if(self.player1.ability===8&&self.player1.abilityFlag===-1){
			if(self.player1.hp===0){
				if(self.player1.shield!==0)
					self.player1.shield--;
				else
					result(self,self.player2.name+'赢了');
			}
			else
				self.player1.hp--;
			self.player2.hp+=self.player1.abilityCount;
			self.player1.abilityCount=0;
			self.player1.abilityFlag=4;
			self.player1.socket.emit('actDone',{'selfHp':self.player1.hp,'oppoHp':self.player2.hp,'selfShield':self.player1.shield,'oppoShield':self.player2.shield,'selfAbilityFlag':self.player1.abilityFlag,'oppoAbilityFlag':self.player2.abilityFlag,'turn':self.turn});
			self.player2.socket.emit('actDone',{'selfHp':self.player2.hp,'oppoHp':self.player1.hp,'selfShield':self.player2.shield,'oppoShield':self.player1.shield,'selfAbilityFlag':self.player2.abilityFlag,'oppoAbilityFlag':self.player1.abilityFlag,'turn':self.turn});
		}
		else{
			self.player1.socket.emit('judge',-1);
			self.player2.socket.emit('judge',1);
		}
	}
	else{
		if(self.player1.ability===8&&self.player1.abilityFlag===-1){
			self.player1.abilityCount=0;
			self.player1.abilityFlag=0;
		}
		if(self.player2.ability===8&&self.player2.abilityFlag===-1){
			if(self.player2.hp===0){
				if(self.player2.shield!==0)
					self.player2.shield--;
				else
					result(self,self.player1.name+'赢了');
			}
			else
				self.player2.hp--;
			self.player1.hp+=self.player2.abilityCount;
			self.player2.abilityCount=0;
			self.player2.abilityFlag=4;
			self.player1.socket.emit('actDone',{'selfHp':self.player1.hp,'oppoHp':self.player2.hp,'selfShield':self.player1.shield,'oppoShield':self.player2.shield,'selfAbilityFlag':self.player1.abilityFlag,'oppoAbilityFlag':self.player2.abilityFlag,'turn':self.turn});
			self.player2.socket.emit('actDone',{'selfHp':self.player2.hp,'oppoHp':self.player1.hp,'selfShield':self.player2.shield,'oppoShield':self.player1.shield,'selfAbilityFlag':self.player2.abilityFlag,'oppoAbilityFlag':self.player1.abilityFlag,'turn':self.turn});
		}
		else{
			self.player1.socket.emit('judge',1);
			self.player2.socket.emit('judge',-1);
		}
	}
	self.player1.use=null;
	self.player2.use=null;
}
function setUse(self,use,id){
	if(self===null||self.player1===null||self.player2===null)
		return;
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
function act(self,action,id){//1攻击 2回血 3夷灭
	if(action===1){
		if(id===1){
			if(self.player1.hp===0){
				dealDamage(self,2,self.player2.hp);
			}
			else if(self.player1.hp===1){
				if(self.player2.hp<=1){
					dealDamage(self,2,1);
				}
				else{
					var num=self.player2.hp-self.player1.hp;
					self.player1.hp+=num;
					dealDamage(self,2,num);
				}
			}
			else{
				var damage=Math.floor(self.player1.hp/2);
				dealDamage(self,2,damage);
			}
		}
		else{
			if(self.player2.hp===0){
				dealDamage(self,1,self.player1.hp);
			}
			else if(self.player2.hp===1){
				if(self.player1.hp<=1){
					dealDamage(self,1,1);
				}
				else{
					var num=self.player1.hp-self.player2.hp;
					self.player2.hp+=num;
					dealDamage(self,1,num);
				}
			}
			else{
				var damage=Math.floor(self.player2.hp/2);
				dealDamage(self,1,damage);
			}
		}
	}
	else if(action===2){
		if(id===1){
			self.player1.hp++;
		}
		else{
			self.player2.hp++;
		}	
	}
	else if(action===3){
		if(id===1){
			self.player2.socket.emit('oppoUseAbility');
			var damage=self.player2.hp;
			self.player1.abilityFlag=-1;
			self.player1.abilityCount=damage;
			dealDamage(self,2,damage);
		}
		else{
			self.player1.socket.emit('oppoUseAbility');
			var damage=self.player1.hp;
			self.player2.abilityFlag=-1;
			self.player2.abilityCount=damage;
			dealDamage(self,1,damage);
		}
	}
	if(id===1&&self.player2.ability===5&&self.player2.hp>self.player1.hp)
		self.player2.hp--;
	if(id===2&&self.player1.ability===5&&self.player1.hp>self.player2.hp)
		self.player1.hp--;
	self.turn++;
	if(self.player1.ability===7&&self.player1.abilityFlag!==0)
		self.player1.abilityFlag--;
	if(self.player2.ability===7&&self.player2.abilityFlag!==0)
		self.player2.abilityFlag--;
	if(self.player1.ability===8&&self.player1.abilityFlag>0)
		self.player1.abilityFlag--;
	if(self.player2.ability===8&&self.player2.abilityFlag>0)
		self.player2.abilityFlag--;
	if(self.player1.gamePlay!==null){
		self.player1.socket.emit('actDone',{'selfHp':self.player1.hp,'oppoHp':self.player2.hp,'selfShield':self.player1.shield,'oppoShield':self.player2.shield,'selfAbilityFlag':self.player1.abilityFlag,'oppoAbilityFlag':self.player2.abilityFlag,'turn':self.turn});
		self.player2.socket.emit('actDone',{'selfHp':self.player2.hp,'oppoHp':self.player1.hp,'selfShield':self.player2.shield,'oppoShield':self.player1.shield,'selfAbilityFlag':self.player2.abilityFlag,'oppoAbilityFlag':self.player1.abilityFlag,'turn':self.turn});
	}
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
	this.shield=0;
	this.ability=null;
	this.abilityFlag=0;
	this.abilityCount=0;
	this.intervalId=null;
	playerCount++;
	players.push(this);
	for(let i of players)
		i.socket.emit('playerCountUpdate',playerCount);
	var self=this;
	this.socket.on('disconnect',function(){
		if(self.intervalId!==null)
			clearInterval(self.intervalId);
		if(self.gamePlay!==null){
			if(self.id===1){
				self.gamePlay.player2.state=0;
				self.gamePlay.player2.socket.emit('oppoExitGame');
			}
				
			else{
				self.gamePlay.player1.state=0;
				self.gamePlay.player1.socket.emit('oppoExitGame');
			}
		}
		players=players.filter(function(value){
			return value.name!==self.name;
		})
		playerCount--;
		for(let i of players)
			i.socket.emit('playerCountUpdate',playerCount);
		console.log(self.name+'已退出游戏');
	});
	this.socket.on('equipAbility',function(data){
		self.ability=data;
	});
	this.socket.on('play',function(){
		if(self.onSearch===1)
			return;
		self.onSearch=1;
		if(isExistHost(self)>0){
			return;
		}
		self.isHost=1;
		var player2=null;
		self.intervalId=setInterval(function(){
			if(player2=findPlayer(self)){
				console.log('匹配成功');
				self.onSearch=0;
				player2.onSearch=0;
				self.gamePlay=new game(self,player2);
				player2.gamePlay=self.gamePlay;
				clearInterval(self.intervalId);
			}
		},1000)
	});
	this.socket.on('use',function(data){
		setUse(self.gamePlay,data,self.id);
	});
	this.socket.on('act',function(data){
		act(self.gamePlay,data,self.id);
	});
	this.socket.on('useDimeng',function(){
		if(self.id===1){
			self.gamePlay.player2.socket.emit('oppoUseAbility');
			var diff=Math.abs(self.hp-self.gamePlay.player2.hp);
			if(self.hp<diff){
				if(self.shield!==0){
					self.hp=0;
					self.shield--;
				}
				else{
					result(self.gamePlay,self.gamePlay.player2.name+'赢了');
					return;
				}
					
			}
			else
				self.hp-=diff;
			var num=self.hp;
			self.hp=self.gamePlay.player2.hp;
			self.gamePlay.player2.hp=num;
			self.socket.emit('abilityDone',{'selfHp':self.hp,'oppoHp':self.gamePlay.player2.hp,'selfShield':self.shield,'oppoShield':self.gamePlay.player2.shield,'selfAbilityFlag':self.abilityFlag,'oppoAbilityFlag':self.gamePlay.player2.abilityFlag});
			self.gamePlay.player2.socket.emit('abilityDone',{'selfHp':self.gamePlay.player2.hp,'oppoHp':self.hp,'selfShield':self.gamePlay.player2.shield,'oppoShield':self.shield,'selfAbilityFlag':self.gamePlay.player2.abilityFlag,'oppoAbilityFlag':self.abilityFlag});
		}
		else{
			self.gamePlay.player1.socket.emit('oppoUseAbility');
			var diff=Math.abs(self.hp-self.gamePlay.player1.hp);
			if(self.hp<diff){
				if(self.shield!==0){
					self.hp=0;
					self.shield--;
				}
				else{
					result(self.gamePlay,self.gamePlay.player1.name+'赢了');
					return;
				}
					
			}
			else
				self.hp-=diff;
			var num=self.hp;
			self.hp=self.gamePlay.player1.hp;
			self.gamePlay.player1.hp=num;
			self.socket.emit('abilityDone',{'selfHp':self.hp,'oppoHp':self.gamePlay.player1.hp,'selfShield':self.shield,'oppoShield':self.gamePlay.player1.shield,'selfAbilityFlag':self.abilityFlag,'oppoAbilityFlag':self.gamePlay.player1.abilityFlag});
			self.gamePlay.player1.socket.emit('abilityDone',{'selfHp':self.gamePlay.player1.hp,'oppoHp':self.hp,'selfShield':self.gamePlay.player1.shield,'oppoShield':self.shield,'selfAbilityFlag':self.gamePlay.player1.abilityFlag,'oppoAbilityFlag':self.abilityFlag});
		}
	});
	this.socket.on('useQiangxi',function(){
		if(self.id===1){
			self.gamePlay.player2.socket.emit('oppoUseAbility');
			if(self.gamePlay.player2.ability===6)
			self.gamePlay.player2.abilityCount++;
			if(self.hp===0){
				if(self.shield!==0)
					self.shield--;
				else{
					result(self.gamePlay,self.gamePlay.player2.name+'赢了');
					return;
				}
			}
			else
				self.hp--;
			if(self.gamePlay.player2.hp===0){
				if(self.gamePlay.player2.shield!==0)
					self.gamePlay.player2.shield--;
				else if(self.gamePlay.player2.ability===1&&self.gamePlay.player2.abilityFlag===0){
					self.gamePlay.player2.hp=2;
					var hpStolen=Math.floor(self.hp/2);
					if(self.ability===6)
						self.abilityCount+=hpStolen;
					self.hp-=hpStolen;
					self.gamePlay.player2.hp+=hpStolen;
					self.gamePlay.player2.abilityFlag=1;
				}
				else{
					result(self.gamePlay,self.name+'赢了');
					return;
				}
			}
			else
				self.gamePlay.player2.hp--;
			self.socket.emit('abilityDone',{'selfHp':self.hp,'oppoHp':self.gamePlay.player2.hp,'selfShield':self.shield,'oppoShield':self.gamePlay.player2.shield,'selfAbilityFlag':self.abilityFlag,'oppoAbilityFlag':self.gamePlay.player2.abilityFlag});
			self.gamePlay.player2.socket.emit('abilityDone',{'selfHp':self.gamePlay.player2.hp,'oppoHp':self.hp,'selfShield':self.gamePlay.player2.shield,'oppoShield':self.shield,'selfAbilityFlag':self.gamePlay.player2.abilityFlag,'oppoAbilityFlag':self.abilityFlag});
		}
		else{
			self.gamePlay.player1.socket.emit('oppoUseAbility');
			if(self.gamePlay.player1.ability===6)
				self.gamePlay.player1.abilityCount++;
			if(self.hp===0){
				if(self.shield!==0)
					self.shield--;
				else{
					result(self.gamePlay,self.gamePlay.player1.name+'赢了');
					return;
				}
			}
			else
				self.hp--;
			if(self.gamePlay.player1.hp===0){
				if(self.gamePlay.player1.shield!==0)
					self.gamePlay.player1.shield--;
				else if(self.gamePlay.player1.ability===1&&self.gamePlay.player1.abilityFlag===0){
					self.gamePlay.player1.hp=2;
					var hpStolen=Math.floor(self.hp/2);
					if(self.ability===6)
						self.abilityCount+=hpStolen;
					self.hp-=hpStolen;
					self.gamePlay.player1.hp+=hpStolen;
					self.gamePlay.player1.abilityFlag=1;
				}
				else{
					result(self.gamePlay,self.name+'赢了');
					return;
				}
			}
			else
				self.gamePlay.player1.hp--;
			self.socket.emit('abilityDone',{'selfHp':self.hp,'oppoHp':self.gamePlay.player1.hp,'selfShield':self.shield,'oppoShield':self.gamePlay.player1.shield,'selfAbilityFlag':self.abilityFlag,'oppoAbilityFlag':self.gamePlay.player1.abilityFlag});
			self.gamePlay.player2.socket.emit('abilityDone',{'selfHp':self.gamePlay.player1.hp,'oppoHp':self.hp,'selfShield':self.gamePlay.player1.shield,'oppoShield':self.shield,'selfAbilityFlag':self.gamePlay.player1.abilityFlag,'oppoAbilityFlag':self.abilityFlag});
		}
	});
	this.socket.on('useTaofa',function(){
		self.abilityFlag=1;
		if(self.id===1){
			self.gamePlay.player2.socket.emit('oppoUseAbility');
			dealDamage(self.gamePlay,2,self.abilityCount);
			if(self.gamePlay!==null){
				self.socket.emit('abilityDone',{'selfHp':self.hp,'oppoHp':self.gamePlay.player2.hp,'selfShield':self.shield,'oppoShield':self.gamePlay.player2.shield,'selfAbilityFlag':self.abilityFlag,'oppoAbilityFlag':self.gamePlay.player2.abilityFlag});
				self.gamePlay.player2.socket.emit('abilityDone',{'selfHp':self.gamePlay.player2.hp,'oppoHp':self.hp,'selfShield':self.gamePlay.player2.shield,'oppoShield':self.shield,'selfAbilityFlag':self.gamePlay.player2.abilityFlag,'oppoAbilityFlag':self.abilityFlag});
			}
		}
		else{
			self.gamePlay.player1.socket.emit('oppoUseAbility');
			dealDamage(self.gamePlay,1,self.abilityCount);
			if(self.gamePlay!==null){
				self.socket.emit('abilityDone',{'selfHp':self.hp,'oppoHp':self.gamePlay.player1.hp,'selfShield':self.shield,'oppoShield':self.gamePlay.player1.shield,'selfAbilityFlag':self.abilityFlag,'oppoAbilityFlag':self.gamePlay.player1.abilityFlag});
				self.gamePlay.player1.socket.emit('abilityDone',{'selfHp':self.gamePlay.player1.hp,'oppoHp':self.hp,'selfShield':self.gamePlay.player1.shield,'oppoShield':self.shield,'selfAbilityFlag':self.gamePlay.player1.abilityFlag,'oppoAbilityFlag':self.abilityFlag});
			}
		}
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
	this.player1.hp=abilityHp(this.player1.ability);
	this.player2.hp=abilityHp(this.player2.ability);
	this.player1.abilityFlag=0;
	this.player2.abilityFlag=0;
	this.player1.abilityCount=0;
	this.player2.abilityCount=0;
	this.player1.shield=abilityShield(this.player1.ability);
	this.player2.shield=abilityShield(this.player2.ability);
	this.player1.id=1;
	this.player2.id=2;
	this.player1.socket.emit('play',{'oppoName':this.player2.name,'oppoAbility':this.player2.ability,'oppoAbilityName':abilityName(this.player2.ability),'selfHp':this.player1.hp,'oppoHp':this.player2.hp,'selfShield':this.player1.shield,'oppoShield':this.player2.shield,'selfAbilityFlag':this.player1.abilityFlag,'oppoAbilityFlag':this.player2.abilityFlag});
	this.player2.socket.emit('play',{'oppoName':this.player1.name,'oppoAbility':this.player1.ability,'oppoAbilityName':abilityName(this.player1.ability),'selfHp':this.player2.hp,'oppoHp':this.player1.hp,'selfShield':this.player2.shield,'oppoShield':this.player1.shield,'selfAbilityFlag':this.player2.abilityFlag,'oppoAbilityFlag':this.player1.abilityFlag});
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
