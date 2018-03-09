var borderSize = 0.75;
var active = [false, false, false, false, false, false, false, false, false, false, false, false];
//var canvas = document.getElementById("draw");

function getHight() {
	var w = window;
	var d = document;
	var e = d.documentElement;
	var g = d.getElementsByTagName('body')[0];
	return g.clientHeight - 16;
}

function getWidht() {
	var w = window;
	var d = document;
	var e = d.documentElement;
	var g = d.getElementsByTagName('body')[0];
	return g.clientWidth - 16;
}

function resizeCanvas() {
	canvas = document.getElementById("draw");

	canvas.width = getWidht();
	canvas.height = getHight();
}

function getRadius() {
	he = getHight();
	wi = getWidht();
	if (he < wi) {
		return (he / 2) * borderSize;
	} else {
		return (wi / 2) * borderSize;

	}
}

function drawCicel(ctx) {
	ctx.lineWidth = 15 * (getRadius() / 200);
	ctx.fillStyle = "#eaeaea";
	ctx.beginPath();
	he = getHight();
	wi = getWidht();
	radius = getRadius() * 1.1;
	ctx.arc(wi / 2, he * 0.85 / 2, radius, 0, 2 * Math.PI);
	ctx.closePath()
	ctx.fill();
	//ctx.stroke();
}

function drawText(ctx, txt, size, x, y, color) {
	ctx.fillStyle = color;
	rad = getRadius();
	size *= (rad / 200)
	ctx.font = size + "px Baloo, cursive";
	ctx.fillText(txt, x - (ctx.measureText(txt).width / 2), y + (size / 2.5));
}

function drawImage(ctx, src, x, y, dow) {
	var img = new Image();

	img.onload = function () {
		i = getRadius() * dow;
		ctx.drawImage(img, x - (i / 2), y - (i / 2), i, i);
	};
	img.src = src;
}

function setUnderTitel(ctx, txt) {
	ctx.font = 50 + "px Arial";
	drawText(ctx, txt, 50, (getWidht() / 2), (getHight() * 0.90), "#121212");
}

function getPosFor(deg) {
	// 0/360/2PI  = 12 o'clock
	he = getHight();
	wi = getWidht();
	radius = getRadius() * 0.9;
	centerX = wi / 2;
	centerY = he * 0.85 / 2;
	y = centerY - (Math.cos(deg) * radius)
	x = centerX - (Math.sin(deg) * radius)
	return [x, y];

}

function getDegs() {
	degs = [];
	for (i = 0; i < (2 * Math.PI); i += (Math.PI / 6)) {
		degs.push(getPosFor(i));
	}

	return degs;
}

function drawDiagram(ctx) {
	degs = getDegs();

	str = ["0", "E", "T", "9", "8", "7", "6", "5", "4", "3", "2", "1"];

	for (i = 0; i < 12; i++) {

		drawText(ctx, str[i], 30, degs[i][0], degs[i][1], "#363030");
	}
}

function activate(ctx, deg, color, siz) {
	canvas = document.getElementById("draw");

	var ctx = canvas.getContext("2d");
	rad = 20 * (getRadius() / 200)
	ctx.lineWidth = 4 * (getRadius() / 200) * siz;
	pos = getPosFor(deg);
	ctx.strokeStyle = color;
	ctx.beginPath();
	he = getHight();
	wi = getWidht();

	ctx.arc(pos[0], pos[1], rad, 0, 2 * Math.PI);
	ctx.stroke();
}

function getBtnPos() {
	out = [];

	out.push([borderSize * 100, getHight() * 0.90]);
	out.push([getWidht() - (borderSize * 100), getHight() * 0.90])

	return out;
}

function drawButtons() {
	canvas = document.getElementById("draw");
	var ctx = canvas.getContext("2d");

	drawImage(ctx, "RCl.svg", borderSize * 100, (getHight() * 0.90), 0.3);
	drawImage(ctx, "RACl.svg", getWidht() - (borderSize * 100), getHight() * 0.90, 0.3);
}

function drawActivstion() {
	for (i = 0; i < 12; i++) {
		if (!active[i]) {
			activate(ctx, i * (Math.PI / 6), "#eaeaea", 1.5);

		} else {
			activate(ctx, i * (Math.PI / 6), "#191919", 1);

		}
	}
}

function getInterval(a, b) {
	iv = b - a;
	if (iv > 6) {
		iv = (iv - 12) * -1;
	}
	return iv
}

function getVector() {
	vect = [0, 0, 0, 0, 0, 0];
	for (i = 0; i < active.length - 1; i++) {
		if (active[i]) {
			for (j = i + 1; j < active.length; j++) {
				if(active[j]){
					iv = getInterval(i,j);
					vect[iv-1]++;
				}
			}
		}
	}
	return "<"+vect[0]+" "+vect[1]+" "+vect[2]+" "+vect[3]+" "+vect[4]+" "+vect[5]+">"
}

function resize() {
	resizeCanvas();
	canvas = document.getElementById("draw");

	ctx = canvas.getContext("2d");
	drawCicel(ctx);
	var txt = getVector();
	setUnderTitel(ctx, txt);
	drawDiagram(ctx);
	drawActivstion();
	drawButtons();

}

function onLoad() {
	resize();
	

}

function disrace(p1, p2) {
	a = Math.abs(p1[0] - p2[0]);
	b = Math.abs(p1[1] - p2[1]);
	return Math.sqrt((a * a) + (b * b));
}

function btnPressed(id) {
	switch (id) {
		case 1:
			s = active[11];
			active.splice(11);
			active.splice(0, 0, s);
			break;
		case 0:
			s = active[0];
			active.shift();
			active.push(s);
			break;
		default:
			console.log("invalid BtnID:" + id);

	}

}

function onMouseDown(e) {
	e = e || window.event;
	canvas = document.getElementById("draw");
	ctx = canvas.getContext("2d");
	x = e.clientX - 8;
	y = e.clientY - 8;
	posi = [x, y];
	rad = 15 * (getRadius() / 200);

	//numbers
	degs = getDegs();
	for (i = 0; i < 12; i++) {
		if (disrace(posi, degs[i]) <= rad) {
			if (active[i]) {
				activate(ctx, i * (Math.PI / 6), "#eaeaea", 1.5);
				active[i] = false;
			} else {
				activate(ctx, i * (Math.PI / 6), "#191919", 1);
				active[i] = true;
			}
		}
	}

	rad = 35 * (getRadius() / 200);
	btns = getBtnPos();
	for (i = 0; i < btns.length; i++) {
		if (disrace(posi, btns[i]) <= rad) {
			btnPressed(i);
		}
	}
	resize();
}
