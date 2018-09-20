function Canvas(id){
	this.canvas = document.getElementById(id);
	this.canvas.width = this.canvas.offsetWidth;
	this.canvas.height = this.canvas.offsetHeight;
	this.ctx = this.canvas.getContext("2d");

	this.delta = 0.05;	//change in alpha
	
	this.clear = function(){
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
	}
	this.drawImage = function(img,pos){
		if(pos==null){
			pos=[0,0];
		}
		this.ctx.drawImage(img,pos[0],pos[1]);
	}
	this.drawPolygon = function(path,strokeColor,fillColor,alpha){
		if(alpha==null){
			alpha = 1;
		}
		var lastAlpha = this.ctx.globalAlpha;
		if(this.ctx.globalAlpha<alpha){
			alpha = this.ctx.globalAlpha;
		}
		this.ctx.globalAlpha = alpha;
		this.ctx.lineWidth="4";
		this.ctx.strokeStyle="yellow";
		if(strokeColor!=null){
			this.ctx.strokeStyle=strokeColor;
		}
		if(fillColor!=null){
			this.ctx.fillStyle = fillColor;
		}
		this.ctx.beginPath();
		this.ctx.moveTo(path[0][0],path[0][1]);
		for(var i=1;i<path.length;i++){
			this.ctx.lineTo(path[i][0],path[i][1]);
		}
		this.ctx.lineTo(path[0][0],path[0][1])
		this.ctx.stroke();
		if(fillColor!=null){
			this.ctx.fill();
		}
		this.ctx.globalAlpha = lastAlpha;
	}
	this.drawText = function(text,pos,size,color,font){
		if(text==null){
			return;
		}
		if(pos==null){
			pos=[0,0];
		}
		if(size==null){
			size=20;
		}
		if(color==null){
			color="black";
		}
		if(font==null){
			font="Garamond";
		}
		this.ctx.fillStyle = color;
		this.ctx.font=size+"px "+font;
		if(pos[2]!=null){
			//control overflow
			if(this.ctx.measureText(text).width>pos[2]){
				var line = text.split(" ");
				var lineText = "";
				do{
					lineText += line.splice(0,1)+" ";
				}while(line.length>0&&this.ctx.measureText((lineText+line.slice(0,1))).width<pos[2]);
				var nextLine = "";
				for(var i=0;i<line.length;i++){
					nextLine += line[i]+" ";
				}
				text = lineText;
				//draw nextLine
				var nextPos = [pos[0],pos[1]+size,pos[2]]
				this.drawText(nextLine,nextPos,size,color,font);
			}
		}
		this.ctx.fillText(text,pos[0],pos[1]);
	}
	this.getAlpha = function(){
		return this.ctx.globalAlpha;
	}
	this.setAlpha = function(newAlpha){
		if(newAlpha>1.0){
			newAlpha=1.0;
		}else if(newAlpha<0.0){
			newAlpha=0.0
		}
		this.ctx.globalAlpha = newAlpha;
	}
}
