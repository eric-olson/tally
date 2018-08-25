#!/usr/bin/env node

var dgram = require('dgram');

console.log("Tally server starting...");

// enum of tally states
var tallyStates = {
  OFF: 0,
  PGM: 1,
  PVW: 2
};

// UMD setup
var UMD = require('tsl-umd');
var umd = new UMD(5001);

// parse tally data and update lights
var updateTally = function(state, ips) {
  // use static port of 5002
  var recvPort = 5002;

  // create buffers containing strings for tally states
  var off = new Buffer.from('0\n');
  var pgm = new Buffer.from('1\n');
  var pvw = new Buffer.from('2\n');

  // create and send UDP messages to tally lights
  for (var tallyId in ips) {
    var recvIP = ips[tallyId];
    var recvState = state[tallyId];
    var msg = off;
    if (recvState == tallyStates.PGM) {
      msg = pgm;
    }
    else if (recvState == tallyStates.PVW) {
      msg = pvw;
    }

    // create socket and send message to tally light
    var client = dgram.createSocket('udp4');
    client.send(msg, 0, msg.length, recvPort, recvIP, function(err, bytes) {
      if (err) {
        console.log('Error sending UDP packet:\n' + err);
        return;
      }
    });
  }
};

// *******************
// main execution loop
// *******************

// define IPs for each tally ID. TODO: move this to a config file from webui
var ips = {
  3: '10.1.4.71',
  4: '10.1.4.72',
  5: '10.1.4.73',
};

var state = {
  3: tallyStates.OFF,
  4: tallyStates.OFF,
  5: tallyStates.OFF,
};

console.log("IP Mappings: ", ips);

// callback when UMD message received
umd.on('message', function(tally) {
  //console.log("Tally update:", tally);

  // update state with new info
  // reminder: tally2 from carbonite is PGM, tally1 is PVW, and IDs are 1-36

  var tallyAddr = tally['address'];
  // filter out non-input tally values
  // carbonite black only from 1-36
  if (tallyAddr >= 1 && tallyAddr <= 36) {
    // filter out addresses without IPs
    if (tallyAddr in ips) {
      // update state with new tally data
      var pvwUMD = !!tally['tally1'];
      var pgmUMD = !!tally['tally2'];

      // set state based on received UMD message
      if (pgmUMD) {
        state[tallyAddr] = tallyStates.PGM;
      }
      else if (pvwUMD) {
        state[tallyAddr] = tallyStates.PVW;
      }
      else {
        state[tallyAddr] = tallyStates.OFF;
      }

      // distribute updated state to lights
      updateTally(state, ips);
    }
  }

});

