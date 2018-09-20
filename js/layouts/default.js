function _drawDefault(){
	//draw char
	var c = GameState.getLocation().getCharacter();
	if(c==null){
		return;
	}
	var dimens = [455,600];
	var pos = [(900/2)-(dimens[0]/2),600-dimens[1]];
	var img = c.getImages().get(2);
	if(img==null){
		//draw placeholder
		Display.btn.drawPolygon([pos,[pos[0]+400,pos[1]],[pos[0]+400,pos[1]+400],[pos[0],pos[1]+400]],"black","white");
	}else{
		Display.btn.drawImage(img,pos);
	}
}
