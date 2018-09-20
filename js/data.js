var Data;		//data object
function initData(){
	Data = {
		getFile:function(path,_callBack){
		//console.log(window.location.protocol);
			switch(window.location.protocol){
				case "http:":case "https:":break;
				case "file:":
				//remove for hosted version
					_callBack(null);
					return;
				default:break;
			}
			//return a file from the specified path through _callBack function
			var rf = new XMLHttpRequest();
			rf.open("GET",path,true);
			rf.send();
			rf.onload = function(){
				if(this.readyState==4&&this.status==200){
					_callBack(rf.responseText);
				}else if(this.status==404){
					_callBack(null);
				}
			}
		}
	};
	loadNext();
}
