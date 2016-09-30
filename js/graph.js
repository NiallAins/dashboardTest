function drawGraph(stats) {
	//Canvas set up
	var can = document.getElementById("graphBg");
	can.width = 940;
	can.height = 380;
	var ctx = can.getContext('2d');
	//Translate to draw clear 1px lines
	ctx.translate(0.5, 0.5);

	//Draws graph background lines
	function drawBg() {
		ctx.save();
		ctx.beginPath();
			//Base Line
			ctx.strokeStyle = '#C8CAC9';
			ctx.moveTo(20, 379);
			ctx.lineTo(916, 379);
			for (var i = 20; i < 940; i += 128) {
				ctx.moveTo(i, 380);
				ctx.lineTo(i, 369);
			}
		ctx.stroke();
			//Dashed lies
			ctx.setLineDash([4, 3]);
			for (var i = 28; i < 300; i += 88) {
				ctx.moveTo(20, i);
				ctx.lineTo(920, i);
			}
		ctx.stroke();
		ctx.restore();
	}

	var Point = function(xIn, targetIn, colIn) {
		this.x = xIn;
		this.y = 380;
		this.col = colIn;
		//Convert point graph value to canvas co-ords
		this.target = targetIn;
		this.done = false;
	}
		Point.prototype.draw = function() {
			ctx.save();
				ctx.strokeStyle = (this.col === "blue") ? "#3598DC" : "#E04E3F";
				ctx.lineWidth = 4;
				ctx.beginPath();
					ctx.arc(this.x, this.y, 12, 0, 2*Math.PI);
				ctx.stroke();
			ctx.restore();
		}

	//Initiate points from $scope data
	var points = [];
	for (var i = 20, j = 0; i < 920; i += 128, j++) {
		points.push(new Point(i, stats[j].graphPos.yImp, "blue"));
		points.push(new Point(i, stats[j].graphPos.yClick, "red"));
	}

	//Animate points
	var ani = function() {
		var allDone = false;

		//Clear canvas for new frame
		ctx.clearRect(0, 0, 940, 380);

		//Shade area under lines
		ctx.fillStyle = "rgba(200, 200, 255, 0.2)";
		ctx.beginPath();
		ctx.moveTo(20, 380);
		for (var i = 0; i < points.length; i += 2) {
			ctx.lineTo(points[i].x, points[i].y);
		}
		ctx.lineTo(915, 380);
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(20, 380);
		for (var i = 1; i < points.length; i += 2) {
			ctx.lineTo(points[i].x, points[i].y);
		}
		ctx.lineTo(915, 380);
		ctx.fill();

		//Redraw background
		drawBg();

		for (p in points) {
			//See if point is finished animating
			if (points[p].y - points[p].target < 0.5) {
				points[p].y = points[p].target;
				points[p].done = true;
			}

			//Draw connecting lines
			if (p < points.length - 2) {
				ctx.strokeStyle = (points[p].col === "blue") ? "#3598DC" : "#E04E3F";
				ctx.beginPath();
					ctx.moveTo(points[p].x, points[p].y);
					ctx.lineTo(points[parseInt(p) + 2].x, points[parseInt(p) + 2].y);
				ctx.stroke();
				ctx.closePath();
			}

			//Clear around points to create effect of lines not touching points
			ctx.save();
				ctx.arc(points[p].x, points[p].y, 16, 0, 2*Math.PI);
				ctx.clip();
				ctx.clearRect(0, 0, 940, 380);
			ctx.restore();
			points[p].draw();
		}

		for (p in points) {
			//Draw Points
			points[p].draw();

			//Move Points for next frame
			points[p].y -= (points[p].y - points[p].target) / 20;
		}

		//Check to see if animation is finished
		for (p in points) {
			if (!points[p].done) {
				break;
			} else {
				if (parseInt(p) === points.length - 1) {
					allDone = true;
				}
			}
		}
		//If not, continue animating
		if (!allDone) {
			window.requestAnimationFrame(ani);
		}
	}
	ani();
}