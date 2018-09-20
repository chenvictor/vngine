var Menus;
function initMenu(){
	var m = new Menu([Buttons.back]);
	Menus = {
		title: new Menu([Buttons.start,Buttons.episode,Buttons.credits]),
		def: new Menu([Buttons.investigate,Buttons.evidence,Buttons.move]),
		inv: new Menu([Buttons.backToDefault]),
		evi: m,
		talk: new Menu([Buttons.backToDefault]),
		dia: new Menu([]),
		move: new Menu([Buttons.backToDefault]),
		credits: new Menu([Buttons.backText]),
		episodes: new Menu([Buttons.backText,Buttons.nextEpText,Buttons.prevEpText,Buttons.epStartText])
	};
	loadNext();
}

function Menu(buttons){
	this.buttons = buttons;
	this.getButtons = function(){
		return this.buttons;
	}
}
