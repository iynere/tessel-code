var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['A']);

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
			
			if ((result[0] < .2 && result[1] < .2) && result[2] < 1.05) {
				console.log('you need to get up');
			} else {
				console.log('something"s wrong or tessel is moving');
			}
			
			vals = [], result = [];
		}, 5000);
});

accel.on('error', function(err){
  console.log('Error:', err);
});