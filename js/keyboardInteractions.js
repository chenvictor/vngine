var Pressed;
function initKeyboardInteractions(){
	Pressed = {
		//checking pressed keys
		ctrl:false
	};
	window.addEventListener("keydown",function(){keyDown(event.keyCode);});
	window.addEventListener("keyup",function(){keyUp(event.keyCode)});
	loadNext();
}
function keyDown(c){
	//logs keys pressed
	switch(c){
		case 17:Pressed.ctrl=true;break;
	}
}
function keyUp(c){
	//logs keys released
	switch(c){
		case 17:Pressed.ctrl=false;break;
	}
}
