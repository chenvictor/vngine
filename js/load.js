//things to load, in order
var LOAD_NUM;
var LOADS;
function load(){
	console.log("STARTING LOAD");
	LOADS = [
	initData,initAudio,									//misc
	initDisplay,initButton,initMenu,initNotification,	//objects
	initMouseInteractions,initKeyboardInteractions,		//events
	initTitle,initEpisodes,initEvidence,initMap,		//layouts
	initParser											//parser
	];
	LOAD_NUM = LOADS.length;
	loadNext();
}
function loadNext(){
	if(LOADS.length==0){
		//done loading
		doneLoad();
	}else{
		console.log("Loading: "+(LOAD_NUM-LOADS.length));
		var next = LOADS.splice(0,1)[0];
		next();
	}
}
var CLEAR_CONSOLE_AFTER_LOAD = true;
function doneLoad(){
	console.log("DONE LOADING");
	if(CLEAR_CONSOLE_AFTER_LOAD){
		console.clear();
	}
	initGame();
}
