function _drawTalk(){
	//draw char
	var c = GameState.getLocation().getCharacter();
	if(c==null){
		return;
	}
	var dimens = [455,600];
	var pos = [(900/2)-(dimens[0]/2)-100,600-dimens[1]];
	var img = c.getImages().get(2);
	if(img==null){
		//draw placeholder
		Display.btn.drawPolygon([pos,[pos[0]+400,pos[1]],[pos[0]+400,pos[1]+400],[pos[0],pos[1]+400]],"black","white");
	}else{
		Display.btn.drawImage(img,pos);
	}
	//draw dialogues
	var dias = c.getDialogues();
	if(dias==null){
		return;
	}
	var xPos = 720;	//center
	var yPos = 300;
	var textHeight = 50;
	var textWidth = 300;
	yPos -= dias.length*(30);
	for(var i = 0;i<dias.length;i++){
		var color = "white";
		if(dias[i].read){
			color = "#D3D3D3";
		}
		Display.btn.drawPolygon([[xPos-textWidth/2,yPos],[xPos+textWidth/2,yPos],[xPos+textWidth/2,yPos+textHeight],[xPos-textWidth/2,yPos+textHeight]],"black",color);
		//draw text;
		Display.btn.ctx.textAlign = "center";
		Display.btn.drawText(dias[i].getTitle(),[xPos,yPos+35],30);
		Display.btn.ctx.textAlign = "left";
		yPos += 60;
	}
}
