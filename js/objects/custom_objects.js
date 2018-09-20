function CustomObject(relPath,onClicked,img,pos){
	if(pos==null){
		pos = [0,0];
	}
	this.pos = pos;
	this.img = img;
	this.relPath = relPath;
	this.absPath;
	this.onClicked = onClicked;
	this.click = function(){
		if(this.onClicked!=null){
			this.onClicked();
		}
	}
	this.getPath = function(){
		if(this.absPath==null){
			if(this.isHidden()){
				this.absPath = this.relPath;
			}else{
				this.absPath = [];
				for(var i=0;i<this.relPath.length;i++){
					this.absPath.push([(this.pos[0]+this.relPath[i][0]),(this.pos[1]+this.relPath[i][1])]);
				}
			}
		}
		return this.absPath;
	}
	this.getImage = function(){
		return this.img.get(0);
	}
	this.getPos = function(){
		return this.pos;
	}
	this.isHidden = function(){
		return this.img==null;
	}
}
