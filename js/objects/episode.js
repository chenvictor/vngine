function Episode(id){
	this.loadState = 0;
	this.id = id;
	this.title;
	this.desc;
	this.img;
	this.path = "eps/"+this.id+"/";
	this.key;
	this._callback;
	//info for playing
	this.dialogues;
	this.evidence;
	this.locations;
	this.chars;
	this.map;
	
	this._loaderIndex;
	
	this.loadInfo = function(_callback){
		this.key = Math.floor(Math.random()*1000);
		if(_callback==null){
			_callback=function(){}
		}
		if(this.loadState > 0){
			_callback();
			return;
		}
		console.log("Loading Ep "+this.id+" Info");
		this._callback = _callback;
		//load basic info
		//img, title, desc
		this.img = new Image();
		this.img.src = this.path+"img.png";
		console.log("	Loading Image");
		this.img.onload = function(){
			console.log("	Image Loaded");
			console.log("	Loading Data");
			Data.getFile(this.path+"episode.info?key="+this.key,this.doneInfo.bind(this));
		}.bind(this);
	}
	this.doneInfo = function(text){
		console.log("	Data Loaded");
		console.log("RAW:");
		console.log(text);
		text = text.split("|");
		this.title = text[0];
		this.desc = text[1];
		console.log("Done Loading Ep "+this.id+" Info");
		console.log(this.title);
		console.log(this.desc);
		console.log(this.img);
		this.loadState = 1;
		if(this._callback!=null){
			this._callback()
		}
	}
	this.start = function(){
		//check loaded, then _start
		this.loadInfo(function(){this.load(this._start)}.bind(this));
	}
	this._start = function(){
		if(CLEAR_CONSOLE_AFTER_LOAD){
			console.clear();
		}
		//start game
		console.log("Starting Episode "+this.id);
		//move to starting location (idx 0)
		GameState.currentState = 0;
		GameState.changeLocation(this.getLocation(0));
	}
	this.totalSets = 0;
	this._loadImageSets = function(){
		this.totalSets = this.evidence.length+this.locations.length+this.characters.length;
		for(var i=0;i<this.locations.length;i++){
			var loc = this.locations[i];
			for(var j=0;j<loc.getObjects().length;j++){
				var o = loc.getObjects()[j];
				if(o.img!=null){
					this.totalSets++;
				}
			}
		}
		console.log("Loading "+this.totalSets+" ImageSet(s)");
		//evidence
		for(var i=0;i<this.evidence.length;i++){
			var e = this.evidence[i];
			e.imageSet.load(this._imageSetLoaded.bind(this));
		}
		//characters
		for(var i=0;i<this.characters.length;i++){
			var c = this.characters[i];
			c.images.load(this._imageSetLoaded.bind(this));
		}
		//locations
		for(var i=0;i<this.locations.length;i++){
			var l = this.locations[i];
			l.background.load(this._imageSetLoaded.bind(this));
			var objs = l.getObjects();
			for(var j=0;j<objs.length;j++){
				var o = objs[j];
				if(o.img!=null){
					o.img.load(this._imageSetLoaded.bind(this));
				}
			}
		}
		//when done, start game
	}
	this._imageSetLoaded = function(){
		this.totalSets--;
		console.log(this.totalSets+" Sets left to load");
		if(this.totalSets==0){
			this._start();
		}
	}
	this.load = function(_callback){
		//full load
		if(_callback==null){
			_callback=function(){}
		}
		if(this.loadState > 1){
			_callback();
			return;
		}
		console.log("Loading Ep "+this.id+" Data");
		//load all ep
		
		//load dialogues
		//load evidence
		//load locations
		//load chars
		//load map
		this._loadDialogues();
	}
	this._loadDialogues = function(){
		console.log("	Loading Dialogue");
		this.dialogues = [];
		Data.getFile(this.path+"dialogues.info?key="+this.key,this._parseDia.bind(this));
	}
	this._parseDia = function(d){
		if(d!=null){
			d = d.split("\n");
			for(var i=0;i<d.length;i++){
				var dia = d[i];
				if(dia!=null&&dia!=""){
					this.dialogues.push(Parser.parseDialogue(dia));
				}
			}
		}
		console.log("	"+this.dialogues.length+" Dialogue(s) Loaded");
		//when done
		this._loadEvidence();
	}
	this._loadEvidence = function(){
		console.log("	Loading Evidence");
		this.evidence = [];
		Data.getFile(this.path+"evidence.info?key="+this.key,this._parseEvi.bind(this));
	}
	this._parseEvi = function(e){
		if(e!=null){
			e = e.split("\n");
			for(var i=0;i<e.length;i++){
				var evi = e[i];
				if(evi!=null&&evi!=""){
					this.evidence.push(Parser.parseEvidence(evi));
				}
			}
		}
		console.log("	"+this.evidence.length+" Evidence Loaded");
		//when done
		this._loadLocations();
	}
	this._loadLocations = function(){
		console.log("	Loading Locations");
		this.locations = [];
		Data.getFile(this.path+"locations.info?key="+this.key,this._parseLoc.bind(this));
	}
	this._parseLoc = function(l){
		if(l!=null){
			l = l.split("\n");
			for(var i=0;i<l.length;i++){
				var loc = l[i];
				if(loc!=null&&loc!=""){
					this.locations.push(Parser.parseLocation(loc));
				}
			}
		}
		console.log("	"+this.locations.length+" Location(s) Loaded");
		//when done
		this._loadCharacters();
	}
	this._loadCharacters = function(){
		console.log("	Loading Characters");
		this.characters = [];
		Data.getFile(this.path+"characters.info?key="+this.key,this._parseChar.bind(this));
	}
	this._parseChar = function(c){
		if(c!=null){
			c = c.split("\n");
			for(var i=0;i<c.length;i++){
				var cha = c[i];
				if(cha!=null&&cha!=""){
					this.characters.push(Parser.parseCharacter(cha));
				}
			}
		}
		console.log("	"+this.characters.length+" Character(s) Loaded");
		//when done
		this._loadMap();
	}
	this._loadMap = function(){
		console.log("	Loading Map");
		Data.getFile(this.path+"map.info?key="+this.key,this._parseMap.bind(this));
	}
	this._parseMap = function(m){
		this.map = m.split(",");
		Map.clear();
		for(var i=0;i<this.map.length;i++){
			var idx = this.map[i];
			Map.addObject(new MapObject(this.getLocation(idx)));
		}
		console.log("		"+this.map.length+" Map Location(s) added");
		//when done, load image 
		this.loadState = 2;
		this._loadImageSets();
	}
	this.getDialogue = function(id){
		if(id==null){
			id=0;
		}
		if(id<0){
			console.log("Invalid Dialogue ID: Id < 0");
		}else if(id>this.dialogues.length){
			console.log("Invalid Dialogue ID: Id doesn't exist");
		}else{
			return this.dialogues[id];
		}
	}
	this.getEvidence = function(id){
		if(id==null){
			id=0;
		}
		if(id<0){
			console.log("Invalid Evidence ID: Id < 0");
		}else if(id>this.evidence.length){
			console.log("Invalid Evidence ID: Id doesn't exist");
		}else{
			return this.evidence[id];
		}
	}
	this.getLocation = function(id){
		if(id==null){
			id=0;
		}
		if(id<0){
			console.log("Invalid Location ID: Id < 0");
		}else if(id>this.locations.length){
			console.log("Invalid Location ID: Id doesn't exist");
		}else{
			return this.locations[id];
		}
	}
	this.getCharacter = function(id){
		if(id==null){
			id=0;
		}
		if(id<0){
			console.log("Invalid Character ID: Id < 0");
		}else if(id>this.characters.length){
			console.log("Invalid Character ID: Id doesn't exist");
		}else{
			return this.characters[id];
		}
	}
}
