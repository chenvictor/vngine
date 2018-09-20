function Message(text,charId,expression){
	this.text = text;	//string
	if(expression==null){
		expression=0;
	}
	this.expression = parseInt(expression);
	if(isNaN(this.expression)){
		this.expression=null;
	}
	//expression
	/*
	0 default
	1 sad
	2 surprised
	3 angry
	*/
	this.charId = parseInt(charId);	//int
	if(isNaN(this.charId)){
		this.charId=null;
	}
	this.getText = function(){
		return this.text;
	}
	this.getImage = function(){
		//find images with expression
		if(this.charId==null){
			return null;
		}
		var c = GameState.getEpisode().getCharacter(this.charId);
		var img = c.getImages().get(this.expression+3);
		return img;
	}
	this.getSpeaker = function(){
		if(this.charId==null){
			return null;
		}
		var c = GameState.getEpisode().getCharacter(this.charId);
		var name = c.getName();
		return name;
	}
	this.hasSpeaker = function(){
		return this.charId!=null;
	}
}