function ImageSet(path,srcArray,id){
	//an imageSet object, used to load images
	this.id = id;
	this.path = path;
	this.srcArray = srcArray;
	this.array;
	this.loaded = 0;
	this._callback = function(){};
	this.load = function(_callback){
		if(this.array!=null){
			//return if already loaded
			return;
		}
		//loads the imageSet
		if(_callback==null){
			_callback = function(){};
		}
		this._callback = _callback;
		if(this.id!=null){
			console.log("Loading Image Set: "+this.id);
		}else{
			console.log("Loading Image Set");
		}
		this.array = new Array(this.srcArray.length);
		for(var i=0;i<this.srcArray.length;i++){
			var src = "res/img/"+this.path+"/"+this.srcArray[i]+".png";
			this.array[i] = new Image();
			this.array[i].src = src;
			this.array[i].onload = this.checkLoaded.bind(this);
		}
	}
	this.checkLoaded = function(){
		//helper function to check if all images are loaded
		this.loaded++;
		//console.log("	Loaded "+this.loaded+"/"+this.array.length);
		if(this.isLoaded()){
			this.loaded++;
			if(this.id!=null){
				console.log("Done Loading Image Set: "+this.id);
			}else{
				console.log("Done Loading Image Set");
			}
			this._callback();
		}
	}
	this.isLoaded = function(){
		//returns whether or not the imageset is loaded
		return this.loaded==this.array.length;
	}
	//GETTER functions
	this.get = function(index){
		return this.array[index];
	}
}
function AudioSet(path,srcArray,id){
	//an audioSet object, used to load audio
	this.id = id;
	this.path = path;
	this.srcArray = srcArray;
	this.array;
	this.loaded = 0;
	this._callback = function(){};
	this.load = function(_callback){
		if(this.array!=null){
			//return if already loaded
			return;
		}
		this._callback = _callback;
		if(this.id!=null){
			console.log("Loading Audio Set: "+this.id);
		}else{
			console.log("Loading Audio Set");
		}
		this.array = new Array(this.srcArray.length);
		for(var i=0;i<this.srcArray.length;i++){
			var src = "res/audio/"+this.path+"/"+this.srcArray[i]+".wav";
			this.array[i] = new Audio();
			this.array[i].src = src;
			this.array[i].oncanplaythrough = this.checkLoaded.bind(this);
		}
	}
	this.checkLoaded = function(){
		this.loaded++;
		//console.log("	Loaded "+this.loaded+"/"+this.array.length);
		if(this.isLoaded()){
			this.loaded++;
			if(this.id!=null){
				console.log("Done Loading Audio Set: "+this.id);
			}else{
				console.log("Done Loading Audio Set");
			}
			this._callback();
		}
	}
	this.isLoaded = function(){
		return this.loaded==this.array.length;
	}
	//GETTER function
	this.get = function(index){
		return this.array[index];
	}
}
