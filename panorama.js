var arDrone = require('ar-drone'),
fs = require('fs'),
util = require('util');

var numOfPics = 40,
    spinSpeed = 0.5,
    frameRate = 5;


var client = arDrone.createClient({frameRate: frameRate});
client.config('general:navdata_demo', 'FALSE');
//client.createRepl();

var exit = function(code) {
  console.log('Bye!');
  process.exit(code)
};

var landing = false;
process.on('SIGINT', function() {
  if (landing) {
    exit(0);
  } else {
    console.log('Landing');
    client.land(function() {
      exit(0);
    });
    landing = true;
  }
});

var flightID = new Date().toString();
console.log("Flight ID: " + flightID);
fs.mkdirSync(flightID);
process.chdir(flightID);

console.log('Create PNG Stream');
var pngSteram = client.getPngStream();



try {
  //var pngSteram = undefined,
  var initialAngle = undefined,
  lastAngle = 0, offset = 0,
  picCount = 0;

  console.log('Take off!');
  client.takeoff(function() {

    console.log('Bind to navdata');
    client.on('navdata', function (data) {
      lastAngle = data.demo.clockwiseDegrees + 180;
    });

    console.log('Instruct rotation');
    client.counterClockwise(spinSpeed);

    console.log('Bind to new pictures');
    pngSteram.on('data', function (png) {
      if (initialAngle == undefined) {
        initialAngle = lastAngle;
        offset = 360.0 - initialAngle;
        console.log('Initial Angle is: ' + lastAngle);
        console.log('Offset is: ' + offset);
      }
      //console.log(lastAngle - 180);
      //console.log((lastAngle - initialAngle));
      var currAngle = (lastAngle + offset);

      console.log({
        currAngle: currAngle,
        lastAngle: lastAngle,
        angle: lastAngle - 180
      });
      if (currAngle < 370.0) {
        util.print('.');
        fs.writeFileSync(String('0000' + picCount + ".png").slice(-8), png);
        picCount++;
      } else {
        client.stop();
        client.land(function() {
          exit(0)
        });
      }
    });
  });

} catch (error) {
  console.log(error);
  client.land(function() {
    exit(0);
  });
}

