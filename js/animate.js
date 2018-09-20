var Delay = {
	/*
	 * Manage delays between animations
	 * Only 1 delay can be used at a time
	 */
	time:null,		//delay time
	callback:null,	//callback after delay
	
	start:function(time,_callback){
		//start a delay with time and _callback
		console.log("Starting Delay: "+time);
		Delay.time=time;
		Delay.callback=_callback;
		Delay._delaying();
	},
	_delaying:function(){
		//private function to increment delay
		if(Delay.time==0){
			console.log("Done Delay");
			Delay.callback();
			Delay.reset();
		}else{
			Delay.time--;
			window.requestAnimationFrame(Delay._delaying);
		}
	},
	reset:function(){
		//cancel a previously set delay
		Delay.time=null;
		Delay.callback=null;
	}
}
