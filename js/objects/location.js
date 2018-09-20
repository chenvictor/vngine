function Location(background,objects,charId,name,callWhenEntered,posOnMap){
	this.background = background;	//imageSet
	this.objects = objects;			//Objects
	this.charId = charId;		//Character ID
	this.name = name;
	if(callWhenEntered==null){
		callWhenEntered=function(){};
	}
	this.onEnter = callWhenEntered;
	if(posOnMap==null){
		posOnMap=[0,0];
	}
	this.pos = posOnMap;
	this.getBackground = function(){
		if(this.background!=null){
			return this.background.get(0);
		}
	}
	this.getObjects = function(){
		return this.objects;
	}
	this.getCharacter = function(){
		return GameState.getEpisode().getCharacter(this.charId);
	}
	this.getName = function(){
		return this.name;
	}
	this.getPos = function(){
		return this.pos;
	}
	this.enter = function(){
		this.onEnter();
		this.onEnter = function(){};
	}
}
