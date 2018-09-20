var Buttons;
function Btn(pos,path,img,clickedFunction){
	/*
	 *	pos = image position
	 *	path= click area
	 *	img = image
	 */
	this.pos = pos;
	this.path = path;
	this.img = img;
	this.clickedFunction = clickedFunction;
	this.clicked = function(){
		this.clickedFunction();
	};
	this.getPos = function(){
		return this.pos;
	};
	this.getImage = function(){
		return this.img;
	};
	this.getPath = function(){
		return this.path;
	}
}
function TextBtn(text,centeredPos,size,clickedFunction,font){
	this.text = text;
	this.centeredPos = centeredPos;
	this.size = size;
	this.clickedFunction = clickedFunction;
	this.font = font;
	this.clicked = function(){
		this.clickedFunction();
	}
	this.getPath = function(){
		return this.path;
	}
	this.getText = function(){
		return this.text;
	}
	this.getSize = function(){
		return this.size;
	}
	this.getPos = function(){
		return this.centeredPos;
	}
	this.getFont = function(){
		return this.font;
	}
	//calculate path
	var top = this.centeredPos[1]+12-this.size;
	var bot = this.centeredPos[1]+6;
	var s = Display.btn.ctx.font;
	Display.btn.ctx.font = this.size+"px "+this.font;
	var length = Display.btn.ctx.measureText(this.text).width+10;
	Display.btn.ctx.font = s;
	var left = this.centeredPos[0]-length/2;
	var right = this.centeredPos[0]+length/2;
	
	this.path = [[left,top],[right,top],[right,bot],[left,bot]];
}

function initButton(){
	//create buttons
	var img = new ImageSet("buttons",["investigate","evidence","map","back"],"Menu Buttons");
	img.load(function(){
			var img = this;
			Buttons = {
			images:img,
			investigate:new Btn([5,5],[[24.5,11],[41.5,6],[58.5,16],[70.5,17],[77.5,28],[73.5,45],[64.5,55],
				[70.5,64],[100.5,91],[99.5,99],[93.5,99],[63.5,69],[54.5,65],[39.5,69],[29.5,72],[17.5,72],[10.5,61],
				[10.5,44],[10.5,28],[13.5,22]],img.get(0),investigateClicked),
			evidence:new Btn([770,10],[[770.5,35],[777.5,19],[802.5,15],[810.5,22],[878.5,10],[881.5,18],
				[892.5,17],[892.5,73],[786.5,97]],img.get(1),evidenceClicked),
			move:new Btn([790,500],[[793.5,509],[818.5,533],[840.5,510],[854.5,527],[887.5,526],[887.5,585],
				[856.5,584],[817.5,592],[793.5,569]],img.get(2),moveClicked),
			back:new Btn([5,540],[[9.5,561],[37.5,542],[38.5,550],[54.5,547],[67.5,546],[77.5,546],[90.5,551],
				[100.5,560],[108.5,569],[106.5,586],[100.5,594],[96.5,593],[98.5,583],[99.5,571],[89.5,562],[78.5,560],
				[64.5,559],[51.5,562],[41.5,565],[43.5,570]],img.get(3),backClicked),
			backToDefault:new Btn([5,540],[[9.5,561],[37.5,542],[38.5,550],[54.5,547],[67.5,546],[77.5,546],[90.5,551],
				[100.5,560],[108.5,569],[106.5,586],[100.5,594],[96.5,593],[98.5,583],[99.5,571],[89.5,562],[78.5,560],
				[64.5,559],[51.5,562],[41.5,565],[43.5,570]],img.get(3),function(){GameState.changeState(GameState.DEFAULT)}),
			start:new TextBtn("Start",[460,170],50,function(){GameState.startEpisode(1)},"Garamond"),
			episode:new TextBtn("Episode Select",[313, 478],40,function(){GameState.changeState(GameState.EPISODE)},"Garamond"),
			credits:new TextBtn("Credits",[733, 323],40,creditsClicked,"Garamond"),
			backText:new TextBtn("Back",[73,563],40,backClicked,"Garamond"),
			nextEpText:new TextBtn("Next",[775,560],40,nextEpClicked,"Garamond"),
			prevEpText:new TextBtn("Previous",[650,560],40,prevEpClicked,"Garamond"),
			epStartText:new TextBtn("Start",[280,560],40,function(){
				GameState.startEpisode(Episodes.getCurrent().id);
			})
		}
		loadNext();
	});
	
}

function investigateClicked(){
	GameState.changeState(GameState.INVESTIGATE);
}
function evidenceClicked(){
	GameState.changeState(GameState.EVIDENCE);
}
function moveClicked(){
	GameState.changeState(GameState.MOVE);
}
function talkClicked(){
	GameState.changeState(GameState.TALK);
}
function creditsClicked(){
	GameState.changeState(GameState.CREDITS);
}
function backClicked(){
	if(GameState.previousState==null){
		GameState.previousState = GameState.DEFAULT;
	}
	GameState.changeState(GameState.previousState);
}
function nextEpClicked(){
	Episodes.changeSelected(1);
}
function prevEpClicked(){
	Episodes.changeSelected(-1);
}
