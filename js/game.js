var GameState;		//GameState object

function initGame(){
	console.log("Starting Game");
	
	createGameState();
	
	GameState.changeLocation(TitleMenu.location);
	GameState.changeState(GameState.MENU);
	testMain();
}
function createGameState(){
	GameState = 
	{
		CREDITS:-3,
		EPISODE:-2,
		MENU:-1,
		DEFAULT:0,
		INVESTIGATE:1,
		EVIDENCE:2,
		TALK:3,
		DIALOGUE:4,
		MOVE:5,
		
		incomingState:null,
		currentState:null,
		previousState:null,
		
		menu:Menus.title,
		map:null,
	
		incomingLocation:null,
		location:null,
		previousLocation:null,
		
		episode:null,
		
		changeState:function(newState,fade){
			//change the state of the game
			if(this.currentState==newState){
				return;
			}
				console.log("GameState Changing to: "+newState);
				this.incomingState = newState;
				if(fade==null){
					//default fade = true
					fade=true;
				}
				if(!fade){
					this._callbackChangeState();
					return;
				}
				Display.fade(Display._BTN,Fade.OUT,GameState._callbackChangeState);
			},
		_callbackChangeState:function(){
			GameState.previousState=GameState.currentState;
			GameState.currentState=GameState.incomingState;
			var newMenu;
			switch(GameState.currentState){
				case GameState.CREDITS:newMenu = Menus.credits;break;
				case GameState.EPISODE:newMenu = Menus.episodes;break;
				case GameState.MENU:newMenu = Menus.title;break;
				case GameState.DEFAULT:newMenu = Menus.def;break;
				case GameState.INVESTIGATE:newMenu = Menus.inv;break;
				case GameState.EVIDENCE:newMenu = Menus.evi;break;
				case GameState.TALK:newMenu = Menus.talk;break;
				case GameState.DIALOGUE:newMenu = Menus.dia;break;
				case GameState.MOVE:newMenu = Menus.move;break;
			}
			GameState.setMenu(newMenu);
			Display.fade(Display._BTN,Fade.IN);
			//reset cursors on buttons
			mouseMoved(lastMousePos);

			Display._drawBg();
		},
		changeLocation:function(newLocation,fade){
			//change game location
			if(this.location==newLocation){
				return;
			}
				console.log("Moving to: "+newLocation.getName());
				if(fade==null){
					//default fade = true
					fade = true;
				}
				this.incomingLocation = newLocation;
				if(fade){
					Display.fade(Display._BG,Fade.OUT,GameState._callbackChangeLocation);
					Display.fade(Display._OBJ,Fade.OUT);
					Display.fade(Display._BTN,Fade.OUT);
				}else{
					this._callbackChangeLocation();
				}
			},
		_callbackChangeLocation:function(){
			//console.log("ChangeLocation Called Back")
			GameState.previousLocation = GameState.location;
			GameState.location = GameState.incomingLocation;
			Delay.start(50,function(){Display.__fadeScreenIn();GameState.location.enter();});
		},
		startEpisode:function(ep){
			//starts an episode with the episode id
			//ep id
			Display.__fadeScreenOut();
			//fade out screen
			if(ep==null){
				//default ep is ep 1
				ep=1;
			}
			ep = Episodes.getById(ep);
			this.episode = ep;
			this.episode.start()
		},
		
		//GETTER AND SETTER FUNCTIONS
		getLocation:function(){
			return this.location;
		}
		,
		setMenu:function(newMenu){
			this.menu = newMenu;
		},
		getMenu:function(){
			if(this.menu==null){
				return new Menu([]);
			}
			return this.menu;
		},
		getState:function(){
			return this.currentState;
		},
		getEpisode:function(){
			return this.episode;
		}
	};
}
