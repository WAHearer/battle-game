这是一款线上对战网页游戏，玩家可以进行线上匹配来进行对局，对局为1v1形式，两名玩家首先进行猜拳，获胜者可以进行一项行动：对对方造成自身体力值二分之一的伤害（下取整），或令自身体力值+1。特别的，自身体力值为1时进行攻击将互换双方生命值，自身体力值为0时进行攻击将对对方造成同等于其体力值的伤害。生命值为0的玩家再次受到伤害时即落败。同时，玩家可以选择技能来获得不同的初始体力及丰富的对局内效果。
文件夹内需安装socket.io库方可使用，服务器文件为server.js，使用nodejs编译；客户端文件为game.html，将game.js中的localhost修改为主机的内网ip并使用tomcat等工具进行局域网联机。游戏已部署到公网服务器：http://120.26.163.231:8080/battle/game.html ，服务器日常开启，可以登录与各地的玩家进行对战。
