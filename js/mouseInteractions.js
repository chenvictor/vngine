//check for things hovering

var DRAW_HITBOX = false;	//should custom_object hitboxes be drawn when investigating
var rect;					//canvas area offset
var lastMousePos=[0,0];		//store last mouse pos
var nothingHere;			//default dialogue when investigating
var mouseCursors;			//different cursors
function initMouseInteractions(){
	mouseCursors = new ImageSet("cursor",["investigate"],"Cursors");
	//event Listener
	rect = document.getElementById("cover").getBoundingClientRect();
	window.addEventListener("resize",function(){
		rect = document.getElementById("cover").getBoundingClientRect();
	});
	var cover = document.getElementById("cover");
	cover.addEventListener("mousemove",function(e){
		mouseMoved([(e.clientX-rect.left),(e.clientY-rect.top)]);
	});
	cover.addEventListener("click",function(e){
		if(e.button == 0){
			mouseClicked([(e.clientX-rect.left),(e.clientY-rect.top)]);
		}
	});
	nothingHere = new Dialogue(null,"Nothing Here...",[new Message("Nothing important here...")]);
	mouseCursors.load(loadNext);
}
function mouseUpdate(){
	//update mouse
	mouseMoved(lastMousePos);
}
function mouseMoved(point){
	//check if mouse has landed in a "click zone", updating mouse if so
	lastMousePos=point;
	var cursorStyle = "default";
	if(Pressed.ctrl){
		document.getElementById("cover").style.cursor = "crosshair";
		return;
	}
	var mainButtonsToHover = GameState.getMenu().getButtons();
	for(var i=0;i<mainButtonsToHover.length;i++){
		var btn = mainButtonsToHover[i];
		if(btn.clickedFunction!=null&&inside(point,btn.getPath())){
			cursorStyle = "pointer";
			document.getElementById("cover").style.cursor = "pointer";
		return;
		}
	}
	switch(GameState.getState()){
		case GameState.DEFAULT:
			if(GameState.getLocation().getCharacter()!=null && GameState.getLocation().getCharacter().getDialogues().length!=0){
				if(inside(point,[[250,200],[650,200],[650,600],[250,600]])){
					cursorStyle = "pointer";
					//cursorStyle = "url("+images[3].src+") 48 70,auto";
				}
				document.getElementById("cover").style.cursor = cursorStyle;
				return;
			}
			break;
		case GameState.EVIDENCE:
			//evidence hovers
			var toggleButtonPath;
			if(Evidences.mode==0){
				//changeTo suspect mode
				toggleButtonPath = [[795,25],[875,25],[875,105],[850,105],[850,50],[795,50]];
			}else if(Evidences.mode==1){
				//changeTo evidence mode
				toggleButtonPath = [[770,50],[795,50],[795,105],[850,105],[850,130],[770,130]];
			}
			if(inside(point,toggleButtonPath)){
				cursorStyle = "pointer";
				document.getElementById("cover").style.cursor = cursorStyle;
				return;
			}
			if(Evidences.canLeft()){
				if(inside(point,[[50,185],[75,185],[75,285],[50,285]])){
					cursorStyle = "pointer";
					document.getElementById("cover").style.cursor = cursorStyle;
					return;
				}
			}
			if(Evidences.canRight()){
				if(inside(point,[[825,185],[850,185],[850,285],[825,285]])){
					cursorStyle = "pointer";
					document.getElementById("cover").style.cursor = cursorStyle;
					return;
				}
			}
			//selector
			var numSelectable = Evidences.getCurrentPage().length;
			var relPos = [85,140];
			var padding = 10;
			for(var i=0;i<2;i++){
				for(var j=0;j<8;j++){
					if((i*8+j)>numSelectable-1){
						break;
					}
					if(Evidences.currentDisplayed%16!=(i*8+j)){
						var corner = [(relPos[0]+padding+(j*(80+padding))),(relPos[1]+padding+(i*(80+padding)))];
						var path = [corner,[(corner[0]+80),corner[1]],[(corner[0]+80),(corner[1]+80)],[corner[0],(corner[1]+80)]];
						if(inside(point,path)){
							cursorStyle = "pointer";
							document.getElementById("cover").style.cursor = cursorStyle;
							return;
						}
					}
				}
			}break;
		case GameState.INVESTIGATE:
			cursorStyle = "url("+mouseCursors.get(0).src+") 5 5, auto";
			if(DRAW_HITBOX){
				var objs = GameState.getLocation().getObjects();
				for(var i=0;i<objs.length;i++){
					var o = objs[i];
					Display.btn.drawPolygon(o.getPath(),"yellow");
				}
			}
			break;
			case GameState.MOVE:
			var mapObjs = Map.getObjects();
			for(var i=0;i<mapObjs.length;i++){
				var o = mapObjs[i];
				if(!o.isCurrent()){
					if(inside(point,o.getPath())){
						Map.selected = o.location;
						_drawMap();
						cursorStyle = "pointer";
						document.getElementById("cover").style.cursor = cursorStyle;
						return;
					}
				}
			}
			Map.selected = null;_drawMap();
		break;
		case GameState.TALK:
			var c = GameState.getLocation().getCharacter();
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
				var path = [[xPos-textWidth/2,yPos],[xPos+textWidth/2,yPos],[xPos+textWidth/2,yPos+textHeight],[xPos-textWidth/2,yPos+textHeight]];
				if(inside(point,path)){
					cursorStyle = "pointer";
					document.getElementById("cover").style.cursor = cursorStyle;
					return;
				}
				yPos += 60;
			}
		break;
	}
	document.getElementById("cover").style.cursor = cursorStyle;
}
function mouseClicked(point){
	//check if mouse is in a "click zone", running function if so
	if(Pressed.ctrl){
		console.log(point);
		foundPath.splice(foundPath.length,0,point);
		return;
	}
	var mainButtonsToClick = GameState.getMenu().getButtons();
	for(var i=0;i<mainButtonsToClick.length;i++){
		var btn = mainButtonsToClick[i];
		if(btn.clickedFunction!=null&&inside(point,btn.getPath())){
			btn.clicked();
			return;
		}
	}
	switch(GameState.getState()){
		case GameState.DEFAULT:
			if(GameState.getLocation().getCharacter()!=null && GameState.getLocation().getCharacter().getDialogues().length!=0){
				GameState.changeState(GameState.TALK);
				return;
			}
		break;
		case GameState.EVIDENCE:
			var toggleButtonPath;
			if(Evidences.mode==0){
				//changeTo suspect mode
				toggleButtonPath = [[795,25],[875,25],[875,105],[850,105],[850,50],[795,50]];
			}else if(Evidences.mode==1){
				//changeTo evidence mode
				toggleButtonPath = [[770,50],[795,50],[795,105],[850,105],[850,130],[770,130]];
			}
			if(inside(point,toggleButtonPath)){
				var newMode = 0;
				if(Evidences.mode == 0){
					newMode = 1;
				}
				Evidences.changeMode(newMode);
			}
			//left
			if(Evidences.canLeft()){
				if(inside(point,[[50,185],[75,185],[75,285],[50,285]])){
					Evidences.pageLeft();
					return;
				}
			}
			//right
			if(Evidences.canRight()){
				if(inside(point,[[825,185],[850,185],[850,285],[825,285]])){
					Evidences.pageRight();
					return;
				}
			}
			//selector
			var numSelectable = Evidences.getCurrentPage().length;
			var relPos = [85,140];
			var padding = 10;
			for(var i=0;i<2;i++){
				for(var j=0;j<8;j++){
					if((i*8+j)>numSelectable-1){
						break;
					}
					if(Evidences.currentDisplayed%16!=(i*8+j)){
						var corner = [(relPos[0]+padding+(j*(80+padding))),(relPos[1]+padding+(i*(80+padding)))];
						var path = [corner,[(corner[0]+80),corner[1]],[(corner[0]+80),(corner[1]+80)],[corner[0],(corner[1]+80)]];
						if(inside(point,path)){
							Evidences.display(i*8+j);
							return;
						}
					}
				}
			}
		break;
		case GameState.INVESTIGATE:
			var objs = GameState.getLocation().getObjects();
			if(objs!=null&&objs.length!=0){
				for(var i=0;i<objs.length;i++){
					var obj = objs[i];
					if(inside(point,obj.getPath())){
						obj.click()
						return;
					}
				}
			}
			//if none clicked
			nothingHere.click();
		break;
		case GameState.MOVE:
			var mapObjs = Map.getObjects();
			for(var i=0;i<mapObjs.length;i++){
				var o = mapObjs[i];
				if(!o.isCurrent()){
					if(inside(point,o.getPath())){
						o.click();
						return;
					}
				}
			}
		break;
		case GameState.TALK:
			var c = GameState.getLocation().getCharacter();
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
				var path = [[xPos-textWidth/2,yPos],[xPos+textWidth/2,yPos],[xPos+textWidth/2,yPos+textHeight],[xPos-textWidth/2,yPos+textHeight]];
				if(inside(point,path)){
					dias[i].click();
					return;
				}
				yPos += 60;
			}
		break;
		case GameState.DIALOGUE:
			var m = currentDialogue.getCurrentMessage();
			if(m.getText().length==currentDialogue.progress[1]){
				currentDialogue.nextMessage();
			}else{
				currentDialogue.quickDisplay();
			}
		break;
	}
}
function inside(point, vs) {
	// helper function
	
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};


// Function to create paths 
var foundPath = [];
function getFoundPath(){
	var str = "[";
	for(var i=0;i<foundPath.length;i++){
		str+="["+foundPath[i][0]+","+foundPath[i][1]+"]";
		if(i==foundPath.length-1){
			str+="]";
		}else{
			str+=",";
		}
	}
	console.log(str);
	foundPath = [];
}
