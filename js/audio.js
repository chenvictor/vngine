var MusicPlayer;	//Global MusicPlayer object
function initAudio(){
	//types of fades
	Fade = {
		NONE:-1,
		IN:0,
		OUT:1
	};
	
	MusicPlayer = {
		BGM:new MPlayer(true),
		SFX:new MPlayer(false)
	};
	MusicPlayer.BGM.loop = true;
	loadNext();
}
function MPlayer(){
	//A music player object
	this.loop = false;
	this.volume = 0.5;
	this.track;
	this.fade = Fade.NONE;
	this.nextTrack;
	
	this.fadeTrack = function(newTrack){
		//change track with a fade audio animation
		this.nextTrack = newTrack;
		this.fadeOut();
	}
	this.changeVolume = function(newVol){
		//sets a new volume for the player
		if(newVol>1.0){
			newVol = 1.0;
		}else if(newVol<0.0){
			newVol = 0.0;
		}
		this.volume = newVol;
		if(this.fade!=Fade.NONE){
			this.track.volume = this.volume;
			if(this.volume==0.0){
				this.pause();
			}
		}
	}
	this.setTrack = function(newTrack){
		//changes the track
		var play = true;
		if(this.track!=null){
			play = !this.track.paused;
			this.track.pause();
		}
		this.track = newTrack;
		this.track.currentTime = 0;
		this.track.loop = this.loop;
		if(this.fade==Fade.NONE){
			this.track.volume = this.volume;
		}
		if(play){
			this.play();
		}
	}
	this.play = function(){
		//starts, resumes the track
		if(this.track==null){
			return;
		}
		this.track.play();
	}
	this.fadeIn = function(){
		//fade audio in
		this.play();
		if(this.fade==Fade.NONE){
			this.track.volume = 0.0;
			this.fade = Fade.IN;
		}
		if(this.fade==Fade.IN){
			this.track.volume += 0.1;
			if(this.track.volume>=this.volume){
				this.track.volume = this.volume;
				this.fade = Fade.NONE;
			}
		}
		if(this.fade==Fade.IN){
			setTimeout(this.fadeIn.bind(this),500);
		}
	}
	this.pause = function(){
		//pauses the track
		if(this.track==null){
			return;
		}
		if(!this.track.ended&&!this.track.paused){
			this.track.pause();
		}
	}
	this.fadeOut = function(){
		//fade out audio
		if(this.fade==Fade.NONE){
			this.track.volume = this.volume;
			this.fade = Fade.OUT;
		}
		if(this.fade==Fade.OUT){
			var newVol = this.track.volume-0.1;
			if(newVol<=0){
				newVol=0;
				this.fade = Fade.NONE;
			}
			this.track.volume = newVol;
		}
		if(this.fade==Fade.OUT){
			setTimeout(this.fadeOut.bind(this),500);
		}else{
			if(this.nextTrack==null){
				this.pause();
			}else{
				this.setTrack(this.nextTrack);
				this.nextTrack=null;
				this.fadeIn();
			}
		}
	}
}
