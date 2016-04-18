

function automouse(element,type,in_options) {
	options={
		view   : window,
		target : element,
		bubbles: true,
		cancelable: true,
		buttons: 0,
		clientX: 0,
		clientY: 0,
		layerX : 0,
		layerY : 0,
	}

	if(typeof(in_options)!=='undefined')
		for(var o in in_options)
			options[o]=in_options[o]

	var ev=new MouseEvent(type,options)
	element.dispatchEvent(ev);
}

function left(element,v){
	var o={buttons:1,clientX:v.x,clientY:v.y}
	automouse(element,'mousedown',o)
	o.buttons=0
	automouse(element,'mouseup',o)
}

function right(element,v){
	var o={buttons:2,clientX:v.x,clientY:v.y}
	automouse(element,'mousedown',o)
	o.buttons=0
	automouse(element,'mouseup',o)
}

function step_solver(game) {
	var origin=game.context.hex.toAbs(game.context.hex.toHex(0,0))
	if(game.game_over || game.selected.length==0) {
		return left(game.context.canvas, origin)
	}

	for(var t in game.selected) {
		var tile=game.tiles[game.selected[t]]
		if(tile.button!=1) continue
		var unselected=0;
		var empty=0;
		var suspected=0;
		for(var i in tile.neighbours) {
			var H=tile.neighbours[i];
			var h=game.context.hex.toHex(H.a,H.b)
			var a=game.context.hex.toAbs(h)
			var ntile=game.tiles[h.toString()]
			if(ntile.button==2)
				suspected++
			if(ntile.button!=1)
				unselected++
			if(ntile.button==0)
				empty++
		}
		//automouse(game.context.canvas,'mousemove',{clientX:a.x,clientY:a.y})
		if(unselected*empty==0) continue	
		if(suspected==tile.count) {
			for(var i in tile.neighbours) {
				var H=tile.neighbours[i];
				var h=game.context.hex.toHex(H.a,H.b)
				var a=game.context.hex.toAbs(h)
				var ntile=game.tiles[h.toString()]
				if(ntile.button==0) {
					left(game.context.canvas, a)
				}
			}
			return
		}
		if(unselected==tile.count) {
			for(var i in tile.neighbours) {
				var H=tile.neighbours[i];
				var h=game.context.hex.toHex(H.a,H.b)
				var a=game.context.hex.toAbs(h)
				var ntile=game.tiles[h.toString()]
				if(ntile.button==0) {
					right(game.context.canvas, a)
				}
			}
			return
		}
	}

	// else pick randomly
	var a=Math.round(Math.random()*(2*game.radius+1)-game.radius)
	var b=Math.round(Math.random()*(2*game.radius+1)-game.radius)
	var h=game.context.hex.toHex(a,b)
	while(!game.inBounds({a:a,b:b}) && !(h.toString() in game.selected)) {
		var a=Math.round(Math.random()*(2*game.radius+1)-game.radius)
		var b=Math.round(Math.random()*(2*game.radius+1)-game.radius)
		var h=game.context.hex.toHex(a,b)
	}
	var random=game.context.hex.toAbs(h)
	left(game.context.canvas,random)

}
