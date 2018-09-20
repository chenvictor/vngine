var Display;		//Display object
var Fade;
function initDisplay(){
	Fade = {
		NONE:-1,
		IN:0,
		OUT:1
	};
	Display = {
		_BG:0,
		_OBJ:1,
		_BTN:2,
		_NOTIF:3,
		background:new Canvas("bgCanvas"),
		objects:new Canvas("objCanvas"),
		btn:new Canvas("btnCanvas"),
		notif:new Canvas("notifCanvas"),
		_fades:[-1,-1,-1,-1],
		_callbacks:[function(){},function(){},function(){},function(){}],
		_fadeSpeed:0.05,
		draw:function(whichCanvas){
			//draw a canvas, if unspecified, draw all canvases
			if(whichCanvas==null){
				//console.log("Drawing Full Display");
				this._drawBg();
				this._drawBtn();
				this._drawNotif();
			}else{
				switch(whichCanvas){
					case this._BG:this._drawBg();break;
					case this._OBJ:this._drawObj();break;
					case this._BTN:this._drawBtn();break;
					case this._NOTIF:this._drawNotif();break;
				}
			}
		},
		_drawBg:function(){
			//draw the background canvas
			this.background.clear();
			if(GameState.getLocation()!=null){
				this.background.drawImage(GameState.getLocation().getBackground());
			}
			this.objects.setAlpha(this.background.getAlpha());
			this._drawObj();
		},
		_drawObj:function(){
			//draw the object canvas
			this.objects.clear();
			//console.log("Drawing Objects");
			if(GameState.getLocation()==null){
				return;
			}
			var objs = GameState.getLocation().getObjects();
			if(objs==null||objs.length==0){
				return;
			}
			for(var i=0;i<objs.length;i++){
				var obj = objs[i];
				if(!obj.isHidden()){
					this.objects.drawImage(obj.getImage(),obj.getPos());
				}
			}
		},
		_drawBtn:function(){
			this.btn.clear();
			//console.log("Drawing Buttons");
			for(var i=0;i<GameState.getMenu().getButtons().length;i++){
				var b = GameState.getMenu().getButtons()[i];
				if(b.getImage==null){
					this.btn.ctx.textAlign = "center";
					//this.btn.drawPolygon(b.getPath(),"black","white");
					this.btn.drawText(b.getText(),b.getPos(),b.getSize(),"black",b.getFont());
					this.btn.ctx.textAlign = "left";
				}else{
					this.btn.drawImage(b.getImage(),b.getPos());
				}
			}
			//draw state specifics
			switch(GameState.getState()){
				case GameState.EPISODE:
					_drawEpisodes();break;
				case GameState.DEFAULT:
					_drawDefault();break;
				case GameState.EVIDENCE:
					_drawEvidence();break;
				case GameState.MOVE:
					_drawMap();break;
				case GameState.TALK:
					_drawTalk();break;
				case GameState.DIALOGUE:
					_drawDialogue();break;
			}
		},
		_drawNotif:function(){
			//draw the notifications canvas
			this.notif.clear();
			//console.log("Drawing Notifications");
			//notifications
			if(Notifications._current!=null){
				this.notif.ctx.textAlign = "start";
				var n = Notifications._current;
				var pos = Notifications.getPos();
				//draw box
				this.notif.drawPolygon([[250,pos-82],[650,pos-82],[650,pos-2],[250,pos-2]],"black","white");
				//if image, draw image
				var textPos = [250+30,pos-42+10];
				if(n.hasImage()){
					this.notif.drawImage(n.getImage(),[250,pos-82]);
					textPos[0] = 330+15;
				}
				this.notif.drawText(n.getText(),textPos,20,"black","Comic Sans MS");
			}
			//titleText
			if(Notifications._titleText!=null){
				var a = this.notif.getAlpha();
				this.notif.setAlpha(Notifications._titleAlpha);
				this.notif.ctx.textAlign = "center";
				this.notif.drawText(Notifications._titleText,[450,300],100,"white","WildWest");
				this.notif.setAlpha(a);
				this.notif.ctx.textAling = "left";
			}
		},
		_getCanvas:function(whichCanvas){
			switch(whichCanvas){
				case this._BG:return this.background;
				case this._OBJ:return this.objects;
				case this._BTN:return this.btn;
				case this._NOTIF:return this.notif;
			}
		},
		fade:function(which,direction,callback){
			//console.log("Fading Display");
			var shouldFade = false;
			if(!this._isFading()){
				shouldFade = true;
			}
			this._fades[which]=direction;
			if(callback==null){
				callback=function(){};
			}
			this._callbacks[which]=callback;
			if(shouldFade){
				this._fadeDisplay();
			}
		},
		_fadeDisplay:function(){
			for(var i=0;i<Display._fades.length;i++){
				var fading = Display._fades[i];
				var c = Display._getCanvas(i);
				switch(fading){
					case Fade.NONE:break;
					case Fade.IN:
						c.setAlpha(c.getAlpha()+Display._fadeSpeed);
						if(c.getAlpha()==1.0){
							Display._fades[i]=Fade.NONE;
							Display._callbacks[i]();
							Display._callbacks[i]=function(){};
						}
						Display.draw(i);
					break;
					case Fade.OUT:
						c.setAlpha(c.getAlpha()-Display._fadeSpeed);
						if(c.getAlpha()==0.0){
							Display._fades[i]=Fade.NONE;
							Display._callbacks[i]();
							Display._callbacks[i]=function(){};
						}
						Display.draw(i);
					break;
				}
			}
			//see if fade should continue
			if(Display._isFading()){
				window.requestAnimationFrame(Display._fadeDisplay);
			}
		},
		_isFading:function(){
			//private function for canvas fading
			//console.log(this._fades);
			for(var i=0;i<this._fades.length;i++){
				if(this._fades[i]==null){
					this._fades[i]=Fade.NONE;
				}
				if(this._fades[i]!=Fade.NONE){
					return true;
				}
			}
			return false;
		},
		__fadeScreenIn:function(){
			//fades all canvases but notification in
			Display.fade(Display._BG,Fade.IN);
			Display.fade(Display._OBJ,Fade.IN);
			Display.fade(Display._BTN,Fade.IN);
		},
		__fadeScreenOut:function(){
			//fades all canvases but notification in
			Display.fade(Display._BG,Fade.OUT);
			Display.fade(Display._OBJ,Fade.OUT);
			Display.fade(Display._BTN,Fade.OUT);
		}
	};
	loadNext();
}
