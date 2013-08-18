var arDrone = require('ar-drone'),
sys = require('sys'),
fs = require('fs'),
exec = require('child_process').exec,
util = require('util');

var spinSpeed = 0.5,
    frameRate = 3;


var client = arDrone.createClient({frameRate: frameRate});
client.config('general:navdata_demo', 'FALSE');

var landing = false;
process.on('SIGINT', function() {
  if (landing) {
    console.log('Bye');
    process.exit(0);
  } else {
    createPanorama();
    console.log('Landing');
    client.land(function() {
      console.log('Bye!');
    });
    landing = true;
  }
});

var flightID = new Date().toISOString();
console.log("Flight ID: " + flightID);
fs.mkdirSync(flightID);

console.log('Create PNG Stream');
var pngSteram = client.getPngStream();


try {
  var initialAngle = undefined,
  lastAngle = 0, offset = 0,
  flying = true,
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
      var currAngle = (lastAngle + offset);

      if (currAngle < 370.0) {
        util.print('.');
        var filename = String('0000' + picCount).slice(-4);
        fs.writeFileSync(flightID +
                         "/"+ filename + ".png", png);
        picCount++;
      } else if (flying) {
        client.stop();
        createPanorama();
        client.land(function() {
          console.log('Bye!');
        });
        flying = false;
      }
    });
  });

} catch (error) {
  console.log(error);
  client.land(function() {
    console.log('Bye!');
    process.exit(0);
  });
}

function createPanorama() {
  if (fs.readdirSync(flightID).length > 0) {
    console.log("Generating Panorama");
  exec('bin/panoramize.sh ' + flightID, function (error, stdout, stderr) {
    fs.writeFileSync(flightID + "/panoramic_stdout.txt", stdout);
    fs.writeFileSync(flightID + "/panoramic_stderr.txt", stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
    console.log("Panorama generated");
    process.exit(0);
  });
  }
}

