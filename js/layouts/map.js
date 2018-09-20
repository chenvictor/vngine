var Map;
function initMap(){
	var img = new ImageSet("buttons",["marker","currentMarker"],"Map Markers");
	img.load(function(){
		var img = this;
		Map = {
			backgroundImg:null,	//img 500 x 350 px
			markerImg:img.get(0),
			currentMarkerImg:img.get(1),
			selected:null,
			mapObjects:[],
			addObject:function(obj){
				if(obj==null){
					return;
				}
				this.mapObjects.push(obj);
			},
			removeObject:function(obj){
				if(obj==null){
					return;
				}
				var idx = this.mapObjects.indexOf(obj);
				if(idx==-1){
					return;
				}
				this.mapObjects.splice(idx,1);
			},
			clear:function(){
				this.mapObjects = [];
			},
			setBg:function(newBg){
				this.backgroundImg = newBg;
			},
			getObjects:function(){
				return this.mapObjects;
			}
		};
	loadNext();
	});
}
function MapObject(locationSendTo){
	//map object
	if(locationSendTo==null){
		return null;
	}
	this.location = locationSendTo;
	this.pos = locationSendTo.getPos();
	this.absPath;
	this.click = function(){
		GameState.changeLocation(this.location);
	}
	this.getPath = function(){
		if(this.absPath==null){
			var relPath = [[12.5,0],[6.5,2],[3.5,6],[1.5,12],[2.5,19],[12.5,35],[22.5,20],[24.5,16],[24.5,10],[23.5,4],[21.5,3],[19.5,1]];
			this.absPath = [];
			for(var i=0;i<relPath.length;i++){
				this.absPath.push([relPath[i][0]-12+this.pos[0],relPath[i][1]-40+this.pos[1]]);
			}
		}
		return this.absPath;	
	}
	this.isCurrent = function(){
		return this.location == GameState.getLocation();
	}
}
function _drawMap(){
	if(Map.selected == null){
		Map.selected = GameState.getLocation();
	}
	//draw box
	Display.btn.drawPolygon([[200,100],[700,100],[700,500],[200,500]]
	,"black","white");
	//draw current location text
	Display.btn.drawPolygon([[200,150],[700,150]],"black");
	Display.btn.ctx.textAlign = "center";
        //if text length exceeds 10 characters
        var name = new String(Map.selected.getName());
        if(name.length>10){
                Display.btn.drawText(name,[450,141],35,"black","Comic Sans MS");
        }else{
                Display.btn.drawText(name,[450,141],50,"black","Comic Sans MS");
        }
	Display.btn.ctx.textAlign = "left";
	//draw map image 500 by 350
	if(Map.backgroundImg!=null){
		Display.btn.drawImage(Map.backgroundImg,[200,100]);
	}else{
		//map placeholder
		Display.btn.drawPolygon([[200,150],[700,150],[700,500],[200,500]],"black","grey");
	}
	//draw location tags
	for(var i=0;i<Map.mapObjects.length;i++){
		var o = Map.mapObjects[i];
		_drawMarker(o.pos,o.isCurrent());
	}
}
function _drawMarker(pos,blue){
	//helper function to draw a marker
	var img = Map.markerImg;
	if(blue){
		img = Map.currentMarkerImg;
	}
	var imgPos = [pos[0]-12,pos[1]-40];
	Display.btn.drawImage(img,imgPos);
}
