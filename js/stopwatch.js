// * Stopwatch class {{{
Stopwatch = function(resolution, id) {
    this.startTime = 0;
	this.stopTime = 0;
	this.totalElapsed = 0; // * elapsed number of ms in total
	this.started = false;
	this.tickResolution = (resolution != undefined ? resolution : 500); // * how long between each tick in milliseconds
	this.tickInterval = null;
	
	// * pretty static vars
	this.onehour = 1000 * 60 * 60;
	this.onemin  = 1000 * 60;
	this.onesec  = 1000;
    
    this.duration = weaponDef[id].time;
    this.id = id;
    this.displayed = true;
    
    //oCanvas Objects
    this.canvas = oCanvas.create({
        canvas: '#weapon_' + this.id + '_ACTIVE',
        background: '#dadada',
        fps: 60
    });
    
    this.arc = this.canvas.display.arc({
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
        radius: 50,
        start: -90,
        end: -90,
        stroke: "10px #000"
    });
    this.image = this.canvas.display.image({
        origin: {x: 'center', y: 'center'},
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
        image: weaponDef[id].img,
        width: 110,
        height: 110
    });
    this.text = this.canvas.display.text({
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
        origin: { x: "center", y: "center" },
    	font: "bold 30px sans-serif",
    	text: "",
    	fill: "#FFF",
        stroke: "1px #000"
    });
    this.canvas.addChild(this.image);
    this.canvas.addChild(this.arc);
    this.canvas.addChild(this.text);
}
Stopwatch.prototype.start = function() {
	var delegate = function(that, method) { return function() { return method.call(that) } };
	if(!this.started) {
		this.startTime = new Date().getTime();
		this.stopTime = 0;
		this.started = true;
		this.tickInterval = setInterval(delegate(this, this.onTick), this.tickResolution);
	}
};
Stopwatch.prototype.stop = function() {
	if(this.started) {
		this.stopTime = new Date().getTime();
		this.started = false;
		var elapsed = this.stopTime - this.startTime;
		this.totalElapsed += elapsed;
		if(this.tickInterval != null)
			clearInterval(this.tickInterval);
	}
	return this.getElapsed();
};
Stopwatch.prototype.reset = function() {
	this.totalElapsed = 0;
	// * if watch is running, reset it to current time
	this.startTime = new Date().getTime();
	this.stopTime = this.startTime;
    this.text.text = 0;
    this.arc.start = -90;
    this.arc.end = -90;
    this.canvas.redraw();
};
Stopwatch.prototype.restart = function() {
	this.stop();
	this.reset();
	this.start();
};
Stopwatch.prototype.getElapsed = function() {
	// * if watch is stopped, use that date, else use now
	var elapsed = 0;
	if(this.started)
		elapsed = new Date().getTime() - this.startTime;
	elapsed += this.totalElapsed;
	
	var secs = parseInt(elapsed / this.onesec);
	var ms = elapsed % this.onesec;
	
	return {
		seconds: secs,
		milliseconds: ms
	};
};
Stopwatch.prototype.setElapsed = function(hours, mins, secs) {
	this.reset();
	this.totalElapsed = 0;
	this.totalElapsed += hours * this.onehour;
	this.totalElapsed += mins  * this.onemin;
	this.totalElapsed += secs  * this.onesec;
	this.totalElapsed = Math.max(this.totalElapsed, 0); // * No negative numbers

    //oCanvas
    var amount = 360 / this.duration;
    
    this.arc.end = -90 + amount * ((mins * 60) + secs);

};
Stopwatch.prototype.toString = function() {
	var zpad = function(no, digits) {
		no = no.toString();
		while(no.length < digits)
			no = '0' + no;
		return no;
	};
	var e = this.getElapsed();
	return zpad(e.hours,2) + ":" + zpad(e.minutes,2) + ":" + zpad(e.seconds,2);
};

// * triggered every <resolution> ms
Stopwatch.prototype.onTick = function() {
	var amount = 360 / (this.duration * 10);
    if( this.getElapsed().seconds === this.duration ) {
        this.stop();
        this.text.text = 0;
        this.arc.start = -90;
        this.arc.end = -90;
        $('#weapon_' + this.id + '_ACTIVE').remove();
        this.displayed = false;
    }
    else {
        var s = this.duration - this.getElapsed().seconds;
        this.text.text = s;
        this.arc.end += amount;
    }
    if( this.duration - this.getElapsed().seconds <= 3 ) {
        this.text.fill = '#ff0000';
        this.arc.stroke = '10px #ff0000';
    }
    else if( this.duration - this.getElapsed().seconds === 30 ) {
        alert("30 seconds left!");
    }
    this.canvas.redraw();
};
var weaponDef = [
    { img: 'images/rocket.png', time: 160 },
    { img: 'images/overshield.png', time: 120 },
    { img: 'images/stickydetonator.png', time: 120 },
    { img: 'images/railgun.png', time: 120 },
    { img: 'images/sniper.png', time: 60 },
    { img: 'images/dmr.png', time: 60 },
    { img: 'images/lightrifle.png', time: 60 },
    { img: 'images/boltshot.png', time: 60 },
    { img: 'images/needler.png', time: 30 },
    { img: 'images/battlerifle.png', time: 30 },
    { img: 'images/plasmapistol.png', time: 30 },
    { img: 'images/assaultrifle.png', time: 30 },
    { img: 'images/carbine.png', time: 30 },
    { img: 'images/pulsegrenades.png', time: 30 },
    { img: 'images/plasmagrenades.png', time: 30 },
    { img: 'images/fraggrenades.png', time: 30 },
    { img: 'images/magnum.png', time: 30 }
];
// }}}
