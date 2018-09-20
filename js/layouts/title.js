var TitleMenu;
function initTitle(){
	var img = new ImageSet("backgrounds",["title"]);
	img.load(function(){
			var img = this;
			TitleMenu = {
			images:img,
			location:new Location(img,null,null,"Title Menu")
		};
		loadNext();
	});
	
}