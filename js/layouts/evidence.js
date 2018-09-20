//EVIDENCE
var Evidences;

function Evidence(id,imageSet,name,desc){
	this.id = id;
	this.imageSet = imageSet;
	this.desc = desc;
	this.name = name;
	this.clicked = function(){
		Evidences.display(this);
	}
	this.getImgSmall = function(){
		return this.imageSet.get(0);
	}
	this.getImgLarge = function(){
		return this.imageSet.get(1);
	}
	this.getName = function(){
		return this.name;
	}
	this.getDesc = function(){
		return this.desc;
	}
	this.addDesc = function(addedDesc){
		this.updateDesc(this.desc+" "+addedDesc);
	}
	this.updateDesc = function(newDesc){
		this.desc = newDesc;
		Notifications.push(new Notification("Evidence Details Updated",images[6]));
	}
}

function initEvidence(){
	var img = new ImageSet("buttons",["suspect80px","objects80px"],"Evidence Buttons");
	img.load(function(){
			var img = this;
			Evidences = {
			images:img,
			mode:0,
			SUSimg:img.get(0),
			OBJimg:img.get(1),
			collectedEvidence:[],
			collectedSuspects:[],
			currentPage:0,
			evidencePages:1,
			suspectPages:1,
			currentDisplayed:null,
			getCurrentPage:function(){
				var array = this.getCurrentArray();
				var start = 16*this.currentPage;
				var end = 16*(this.currentPage+1);
				if(end>array.length){
					end=array.length;
				}
				return array.slice(start,end);
			},
			getCurrentArray:function(){
				switch(this.mode){
					case 0:return this.collectedEvidence;
					case 1:return this.collectedSuspects;
					default:return [];
				}
			},
			changeMode:function(newMode){
				this.mode = newMode;
				this.currentPage = 0;
				this.currentDisplayed = 0;
				Display.draw();
			},
			addEvidence:function(evidence){
				if(evidence.id==null){
					evidence = GameState.getEpisode().getEvidence(evidence);
				}
				console.log("Added Evidence");
				this.collectedEvidence.push(evidence);
				//notification
				Notifications.push(new Notification("Evidence Added",evidence.getImgSmall()));
				this.evidencePages = Math.ceil(this.collectedEvidence.length/16);
				if(this.evidencePages < 1){
					this.evidencePages = 1;
				}
			},
			removeEvidence:function(id){
				console.log("Removing Evidence");
				var idx = -1;
				for(var i=0;i<this.collectedEvidence.length;i++){
					var e = this.collectedEvidence[i];
					if(e.id == id){
						idx = i;
						break;
					}
				}
				if(idx!=-1){
					this.collectedEvidence.splice(idx,1);
				}
				this.evidencePages = Math.ceil(this.collectedEvidence.length/16);
				if(this.evidencePages < 1){
					this.evidencePages = 1;
				}
			},
			addSuspect:function(suspect){
				if(suspect.id==null){
					suspect = GameState.getEpisode().getCharacter(suspect);
				}
				this.collectedSuspects.push(suspect);
				//notification
				Notifications.push(new Notification("Profile Added",suspect.getImgSmall()));
				this.suspectPages = Math.ceil(this.collectedSuspects.length/16);
				if(this.suspectPages < 1){
					this.suspectPages = 1;
				}
			},
			removeSuspect:function(id){
				console.log("Removing Suspect");
				var idx = -1;
				for(var i=0;i<this.collectedSuspects.length;i++){
					var s = this.collectedSuspects[i];
					if(s.id == id){
						idx = i;
						break;
					}
				}
				if(idx!=-1){
					this.collectedSuspects.splice(idx,1);
				}
				this.suspectPages = Math.ceil(this.collectedSuspects.length/16);
				if(this.suspectPages < 1){
					this.suspectPages = 1;
				}
			},
			clear:function(){
				console.log("E Cleared");
				this.collectedEvidence = [];
				this.collectedSuspects = [];
				this.evidencePages = 1;
				this.suspectPages = 1;
			},
			display:function(object){
				object += this.currentPage*16;
				this.currentDisplayed = object;
				
				//redraw display;
				Display.draw();
			}
			,getCurrentObject:function(){
				var array = this.getCurrentArray();
				return array[this.currentDisplayed];
			}
			,getNumPages:function(){
				switch(this.mode){
					case 0: return this.evidencePages;
					case 1: return this.suspectPages;
				}
			},
			canLeft:function(){
				return Evidences.currentPage>0;
			},
			canRight:function(){
				return Evidences.currentPage<(Evidences.getNumPages()-1);
			},
			pageLeft:function(){
				this.currentPage--;
				this.display(0);
				Display.draw();
			},
			pageRight:function(){
				this.currentPage++;
				this.display(0);
				Display.draw();
			},
			getEvidenceById:function(id){
				for(var i=0;i<this.collectedEvidence.length;i++){
					var e = this.collectedEvidence[i];
					if(e.id == id){
						return e;
					}
				}
				console.log("Evidence with id: "+id+" not found");
			},
			getSuspectById:function(id){
				for(var i=0;i<this.collectedSuspects.length;i++){
					var s = this.collectedSuspects[i];
					if(s.id == id){
						return s;
					}
				}
				console.log("Suspect with id: "+id+" not found");
			}
		};
		loadNext();
	});
	
}
function _drawSUS(){
	Display.btn.drawPolygon([[795,25],[875,25],[875,105],[795,105]],"black","white");
	Display.btn.drawImage(Evidences.SUSimg,[795,25]);
}
function _drawOBJ(){
	Display.btn.drawPolygon([[770,50],[850,50],[850,130],[770,130]],"black","white");
	Display.btn.drawImage(Evidences.OBJimg,[770,50]);
}
function _drawEvidence(){
	//draw layout
		
	//draw 'objects' and 'suspects' overlapping		
	switch(Evidences.mode){
		case 0:
			_drawSUS();
			_drawOBJ();
		break;
		case 1:
			_drawOBJ();
			_drawSUS();
		break;
	}
	
	//draw object/suspect name
	Display.btn.drawPolygon([[25,25],[755,25],[755,75],[25,75]],"black","grey");
	var modeText;
	switch(Evidences.mode){
		case 0:modeText="Evidence";break;
		case 1:modeText="Profiles";break;
	}
	Display.btn.drawText(modeText,[30,67],50);
		//arrows
			//left
	var leftColor = "grey";
	if(Evidences.canLeft()){
		leftColor = "black";
	}
	Display.btn.drawPolygon([[50,185],[75,185],[75,285],[50,285]],"black","white");
	Display.btn.drawPolygon([[55,235],[70,195],[70,275]],"black",leftColor);
			//right
	var rightColor = "grey";
	if(Evidences.canRight()){
		rightColor = "black";
	}
	Display.btn.drawPolygon([[825,185],[850,185],[850,285],[825,285]],"black","white");
	Display.btn.drawPolygon([[845,235],[830,195],[830,275]],"black",rightColor);
	
	//draw object selector box
	Display.btn.drawPolygon([[85,140],[815,140],[815,330],[85,330]],"black","grey");
	var relPos = [85,140];
	var padding = 10;
	for(var i=0;i<2;i++){
		for(var j=0;j<8;j++){
			var border = "black";
			var fill = "white";
			if(Evidences.currentDisplayed%16==(i*8+j)){
				border = "#d3d3d3";
				fill = "white";
			}
			var corner = [(relPos[0]+padding+(j*(80+padding))),(relPos[1]+padding+(i*(80+padding)))];
			Display.btn.drawPolygon([corner,[(corner[0]+80),corner[1]],[(corner[0]+80),(corner[1]+80)],[corner[0],(corner[1]+80)]],border,fill);
		}
	}
	var evidenceToDraw = Evidences.getCurrentPage();
	for(var i=0;i<evidenceToDraw.length;i++){
		var e = evidenceToDraw[i];
		var yPos = 150;
		if(i>7){
			yPos = 240;
		}
		var pos = [((i%8)*90+95),yPos];
		Display.btn.drawImage(e.getImgSmall(),pos);
	}
		//draw object showcase box
	Display.btn.drawPolygon([[85,340],[815,340],[815,510],[85,510]],"black","grey");
	Display.btn.drawPolygon([[95,350],[245,350],[245,500],[95,500]],"black","white");
	Display.btn.drawPolygon([[255,375],[810,375]],"black","white");
	var eToDraw = Evidences.getCurrentObject();
	if(eToDraw!=null){
		Display.btn.drawImage(eToDraw.getImgLarge(),[95,350]);
		Display.btn.drawText(eToDraw.getName(),[255,365],null,null,"WildWest");
		
		Display.btn.drawText(eToDraw.getDesc(),[255,400,480]);
	}
}
