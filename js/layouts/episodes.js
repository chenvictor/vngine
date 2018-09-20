var Episodes;
function initEpisodes(){
	Episodes = {
		episodes:[],
		selected:0,
		getNumber:function(){
			return this.episodes.length;
		},
		add:function(episode){
			this.episodes.push(episode);
		},
		getUnlocked:function(){
			//TODO: returns the highest episode # unlocked
			return 1;
		},
		getCurrent:function(){
			//returns the current episode
			return this.episodes[this.selected]
		},
		getById:function(id){
			if(id>0&&id<this.episodes.length+1){
				return this.episodes[id-1];
			}
		},
		changeSelected:function(change){
			this.selected+=change;
			if(this.selected<0)
				this.selected = 0;
			if(this.selected>=this.episodes.length)
				this.selected = this.episodes.length-1;
		}
		
	};
	//get episodes
	getNextEpisode();
}
var eLoadedTimes = 0;
function doneGetEpisodes(){
	eLoadedTimes++;
	console.log(Episodes.getNumber()+" episode(s) loaded");
	console.log("#"+eLoadedTimes);
	//Episodes.selected=Episodes.getUnlocked()-1;
	loadNext();
}
function getNextEpisode(){
	var n = Episodes.getNumber()+1;
	Data.getFile("eps/"+n+"/episode.info",addEpisode);
}
function addEpisode(e){
	if(e!=null){
		var id = Episodes.getNumber()+1;
		console.log("Episode "+id+" Found");
		var ep = new Episode(id);
		Episodes.add(ep);
		ep.loadInfo(getNextEpisode);
	}else{
		doneGetEpisodes();
	}
}
function _drawEpisodes(){
	var ep = Episodes.getCurrent();
	//draw image 400 by 300
	var img = ep.img;
	//placeholder
	Display.btn.ctx.shadowColor = "white";
	Display.btn.ctx.shadowOffsetX = 2;
	Display.btn.ctx.shadowOffsetY = 2;
	Display.btn.drawPolygon([[100,100],[500,100],[500,400],[100,400]]);
	//draw name
	var num = Episodes.selected+1;
	Display.btn.drawText("Episode "+num+": "+ep.title,[100,80],30);
	//draw description
	Display.btn.drawText(ep.desc,[100,425,400]);
	
	
	Display.btn.ctx.shadowColor = "transparent"
}
