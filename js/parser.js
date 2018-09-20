var Parser;				//Parser object for game data
function initParser(){
	Parser = {
		parseFunction:function(data){
			//parse a function
			//"type | arg1 | arg2..."
			if(data==null||data=="null"||data=="n"){
				return function(){};
			}
			data = data.split(":");
			var type = data[0];
			switch(type){
				case "l"://location
				var lType = data[1];
				switch(lType){
					case "m"://move to location
						return function(){GameState.changeLocation(GameState.getEpisode().getLocation(data[1]))};
					break;
					case "a"://add location to map
						return function(){Map.addObject(new MapObject(GameState.getEpisode().getLocation(data[2])))};
					break;
					case "r"://remove location on map
						//TODO: return function(){Map.removeObject(GameState.getEpisode().getLocation(data[2]).id)};
					break;
				}
					
				case "d"://start dialogue
					return function(){GameState.getEpisode().getDialogue(data[1]).click()}
				break;
				case "e"://evidence
				var eType = data[1];
				switch(eType){
					case "a"://add evidence
						return function(){Evidences.addEvidence(data[2])};
					break;
					case "r"://remove evidence
						return function(){Evidences.removeEvidence(data[2])};
					break;
				}
				break;
				case "s"://suspect
				var sType = data[1];
				switch(sType){
					case "a"://add suspect
						return function(){Evidences.addSuspect(data[2])};
					break;
					case "r"://remove suspect
						return function(){Evidences.removeSuspect(data[2])};
					break;
				}
				break;
			}
		},
		parseDialogue:function(data,id){
			//parse dialogue
			//"title | function | r? | m1 \ m2 \ m3"
			data = data.split("|")
			var title = data[0];
			var onFinish = Parser.parseFunction(data[1]);
			var repeatOnFinish = data[2]=="r";
			var messages = data[3].split("\\");
			for(var i=0;i<messages.length;i++){
				messages[i] = Parser.parseMessage(messages[i]);
			}
			return new Dialogue(id,title,messages,onFinish,repeatOnFinish);
		},
		parseMessage:function(data){
			//parse a message
			//"text <> charId <> expression"
			data = data.split("<>");
			var text = data[0];
			var charId = data[1];
			var expression = data[2];
			return new Message(text,charId,expression);
		},
		parseEvidence:function(data,id){
			//parse evidence
			//"name | desc | imgFolderName"
			if(id==null){
				id=0;
			}
			data = data.split("|");
			//get image from evidenceFolder, with foldername
			var name = data[0];
			var desc = data[1];
			var imageSet = new ImageSet("evidence/"+data[2],["80px","150px"]);
			return new Evidence(id,imageSet,name,desc);
		},
		parseCharacter:function(data,id){
			//parse a character
			//"name | desc | imgPath | dialogues"
			data = data.split("|");
			var name = data[0];
			var desc = data[1];
			var imageSet = new ImageSet(("characters/"+data[2]),["icon","portrait","scene","dia_default","dia_sad","dia_surprised","dia_angry"]);
			var dialogues;
			if(data[3]!=null){
				dialogues = data[3].split(",");
				for(var i=0;i<dialogues.length;i++){
					dialogues[i] = GameState.getEpisode().getDialogue(dialogues[i]);
				}
			}else{
				dialogues = [];
			}
			return new Character(id,name,desc,imageSet,dialogues);
		},
		parseLocation:function(data,id){
			//parse a location
			//"pos | name |	bgImg | objects | charId | function"
			data = data.split("|");
			var pos = data[0].split(",");
			pos[0] = parseInt(pos[0])+200;
			pos[1] = parseInt(pos[1])+150;
			var name = data[1];
			// image set with bg and objects
			var background = new ImageSet("backgrounds",[data[2]]);
			var character = data[4]
			var callWhenEntered = Parser.parseFunction(data[5]);
			data[3] = data[3].split("-");
			var objects = [];
			for(var i=0;i<data[3].length;i++){
				var obj = Parser.parseObject(data[3][i]);
				if(obj!=null){
					objects.push(obj);
				}
			}
			return new Location(background,objects,character,name,callWhenEntered,pos);
		},
		parseObject:function(data){
			if(data=="")
				return null;
			//parse a custom_object
			//path ; function [; pos ; img]
			data = data.split(";");
			var path = JSON.parse(data[0]);
			var f = Parser.parseFunction(data[1]);
			var pos = null;
			var img = null;
			if(data.length>2){
				pos = JSON.parse(data[2]);
				img = new ImageSet("objects",[data[3]]);
			}
			return new CustomObject(path,f,img,pos);
		}
	};
	loadNext();
}
