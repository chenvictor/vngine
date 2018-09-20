var Notifications;
function Notification(text,img){
	this.text = text;
	this.img = img;
	this.hasImage = function(){
		return this.img!=null;
	}
	this.getText = function(){
		return this.text;
	}
	this.getImage = function(){
		return this.img;
	}
}

function initNotification(){
	Notifications = {
		_queue:[],
		_current:null,
		push:function(notification){
			if(this._current==null){
				this._current=notification;
				this.pos = 0;
				this._scrollIn();
			}else{
				this._queue.splice(this._queue.length,0,notification);
			}
		},
		_pop:function(){
			if(this._queue.length>0){
				return this._queue.splice(0,1)[0];
			}
		},
		pos:0,	//int [0,80]
		_scrollSpeed:3,
		getPos:function(){
			return this.pos;
		},
		_scrollIn:function(){
			if(Notifications.pos<80){
				Notifications.pos+=Notifications._scrollSpeed;
				if(Notifications.pos>=80){
					Notifications.pos=80;
					setTimeout(Notifications._scrollOut,1000);
				}else{
					window.requestAnimationFrame(Notifications._scrollIn);
				}
			}
			Display._drawNotif();
		},
		_scrollOut:function(){
			if(Notifications.pos>0){
				Notifications.pos-=Notifications._scrollSpeed;
				if(Notifications.pos<=0){
					Notifications.pos=0;
					if(Notifications._queue.length>0){
						Notifications._current = Notifications._pop();
						setTimeout(Notifications._scrollIn,500);
					}else{
						Notifications._current = null;
					}
				}else{
					window.requestAnimationFrame(Notifications._scrollOut);
				}
			}
			Display._drawNotif();
		},
		
		//screen text
		displayTitleText:function(text){
			if(text==null||text==""){
				return;
			}
			this._titleAlpha=0.0;
			this._titleText=text;
			this._titleFadeIn();
		},
		_titleText:null,
		_titleAlpha:1.0,
		_titleFadeSpeed:0.1,
		_titleFadeIn:function(){
			if(Notifications._titleAlpha<1.0){
				Notifications._titleAlpha+=Notifications._titleFadeSpeed;
				if(Notifications._titleAlpha>=1.0){
					Notifications._titleAlpha=1.0;
					setTimeout(Notifications._titleFadeOut,500);
				}else{
					window.requestAnimationFrame(Notifications._titleFadeIn);
				}
			}
			Display._drawNotif();
		},
		_titleFadeOut:function(){
			if(Notifications._titleAlpha>0.0){
				Notifications._titleAlpha-=Notifications._titleFadeSpeed;
				if(Notifications._titleAlpha<=0.0){
					Notifications._titleAlpha=0.0;
					Notifications._titleText=null;
				}else{
					window.requestAnimationFrame(Notifications._titleFadeOut);
				}
			}
			Display._drawNotif();
		}
	};
	loadNext();
}
