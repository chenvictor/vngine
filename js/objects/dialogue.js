var currentDialogue;
function Dialogue(id,title,messages,onFinish,repeatOnFinish){
	this.id = id;
	this.read = false;
	this.title = title;
	this.messages = messages;
	this.progress = [0,0,0];
	if(onFinish==null){
		onFinish = function(){};
	}
	this.onFinish = onFinish;
	if(repeatOnFinish==null){
		repeatOnFinish = false;
	}
	this.repeat = repeatOnFinish;
	this.getTitle = function(){
		return this.title;
	}
	this.click = function(){
		//start a dialogue
		if(this.messages==null || this.messages.length==0){
			alert("Dialogue is missing");
			return;
		}
		//start dialogue
		GameState.changeState(GameState.DIALOGUE);
		this.progress = [0,0,0];
		currentDialogue = this;
	}
	this.getCurrentMessage = function(){
		if(this.progress[0]<this.messages.length)
			return this.messages[this.progress[0]];
	}
	this.nextMessage = function(){
		//check to see if ended
		if(this.progress[0]>=this.messages.length-1){
			//return to previous state
			this.progress[2]=-1;
			if(this.repeat!=false||!this.read){
				if(this.onFinish!=null){
					this.onFinish();
				}
				this.read = true;
			}
			//check to see if the "onFinish" has started a new dialogue
			if(currentDialogue.progress[2] == -1){
				if(GameState.previousState!=-1){
					GameState.changeState(GameState.previousState);
				}else{
					GameState.changeState(GameState.DEFAULT);
				}
			}
				
		}else{
			this.progress[0]+=1;
			this.progress[1]=0;
		}
		Display.draw(Display._BTN);
	}
	this.quickDisplay = function(){
		console.log("Message quick displayed");
		this.progress[1]=this.getCurrentMessage().getText().length-1;
	}
}
function _drawDialogue(){
	if(currentDialogue==null)
		return;
	var m = currentDialogue.getCurrentMessage();
	//draw textArea
	var alpha = Display.btn.ctx.globalAlpha;
	var areaAlpha = 0.7;
	if(alpha<areaAlpha){
		areaAlpha = alpha;
	}
	Display.btn.ctx.globalAlpha = areaAlpha;
	//draw stuff
	Display.btn.drawPolygon([[0,400],[900,400],[900,600],[0,600]],"black","grey");
	if(m.hasSpeaker()){
		//draw image box
		Display.btn.drawPolygon([[0,248],[150,248],[150,398],[0,398]],"grey","white");
	}
	//return alpha to normal
	Display.btn.ctx.globalAlpha = alpha;
	if(m.hasSpeaker()){
		//draw picture
		Display.btn.drawImage(m.getImage(),[0,250]);
	}
	Display.btn.drawText(m.getText().substring(0,currentDialogue.progress[1]),[25,450,850],40,"black");
	if(m.getText().length==currentDialogue.progress[1]){
		Display.btn.drawText("Click to continue",[770,585],"15","white");
	}
	
	if(currentDialogue.progress[1]==0)
		_incrementDialogue();
}
function _incrementDialogue(){
	var m = currentDialogue.getCurrentMessage();
	currentDialogue.progress[1]++;
	Display.draw(Display._BTN);
	if(currentDialogue.progress[1]<m.getText().length){
		var delayTime = 50;
		switch(m.getText().charAt(currentDialogue.progress[1]-1)){
			case ",":delayTime=200;break;
			case ".":delayTime=300;break;
			case "!":delayTime=300;break;
			case "?":delayTime=300;break;
		}
		window.setTimeout(_incrementDialogue,delayTime);
	}
}