function Character(id,name,desc,imageSet,dialogues){
	this.id = id;
	this.name = name;
	this.images = imageSet;
	/*
	0 icon
	1 portrait
	2 scene
	3 dia_default
	4 dia_sad
	5 dia_surprised
	6 dia_angry
	 */
	this.dialogues = dialogues;
	this.getName = function(){
		return this.name;
	}
	this.getImages = function(){
		return this.images;
	}
	this.getDialogues = function(){
		return this.dialogues;
	}
	//also functions as a suspect
	this.desc = desc;
	this.clicked = function(){
		Evidences.display(this);
	}
	this.getImgSmall = function(){
		return this.images.get(0);
	}
	this.getImgLarge = function(){
		return this.images.get(1);
	}
	this.getDesc = function(){
		return this.desc;
	}
	this.addDesc = function(addedDesc){
		this.updateDesc(this.desc+" "+addedDesc);
	}
	this.updateDesc = function(newDesc){
		this.desc = newDesc;
		Notifications.push(new Notification("Suspect Info Updated",images[5]));
	}
}
