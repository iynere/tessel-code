var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['A']);
var path = require('path');
var av = require('tessel-av');
// need to move mp3
var needToMove = path.join(__dirname, 'move.mp3');
var needToMoveSound = new av.Speaker(needToMove);

// keep moving
var keepMoving = path.join(__dirname, 'keepmoving.mp3');
var keepMovingSound = new av.Speaker(keepMoving);

// good job you're moving mp3
var movingShort = path.join(__dirname, 'movingshort.mp3');
var movingShortSound = new av.Speaker(movingShort);

var vals = [];

// Initialize the accelerometer.
accel.on('ready', function () {
// Stream accelerometer data
	accel.on('data', function (xyz) {
		function activeMonitor() {
			var x = xyz[0], y = xyz[1], z = xyz[2];
			
			vals.push([x, y, z]);
		}
		
		activeMonitor();
		
		//console.log(vals);
		
		// if (Math.abs(x) > .5 && Math.abs(y) > .5) {
		// 	console.log('tessel is moving!');
		// } else {
		// 	console.log('tessel is at rest')
		// }
	});
	
	setInterval(function() {
			var xAvg = 0, yAvg = 0, zAvg = 0;
			
			vals.forEach(function (coordsArr) {
				xAvg += Math.abs(coordsArr[0]);
				yAvg += Math.abs(coordsArr[1]);
				zAvg += Math.abs(coordsArr[2]);
			});
			
			var result = [xAvg, yAvg, zAvg].map(function(val) {
				return parseFloat((val / vals.length).toFixed(3));
			});
			
			// x at rest: less than than .14
			// y at rest: less than than .14
			// z at rest: less than than 1.01
			
			// console.log(result);
			
			if (result[0] < .3 && result[2] < 1) {
				console.log('you need to get up');
				needToMoveSound.play();
			} else {
				if (result[1] > .3 && result[2] > 1) {
					console.log('congrats u got the special song');
					movingShortSound.play();
				}
				console.log('keep moving');
				keepMovingSound.play();
			}
			vals = [], result = [];
		}, 5000);
});

accel.on('error', function(err){
  console.log('Error:', err);
});