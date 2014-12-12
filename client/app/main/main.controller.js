'use strict';

angular.module('midiserverApp')
  .controller('MainCtrl', function ($scope, $http, $timeout) {
    $scope.awesomeThings = [];

    // $http.get('/api/things').success(function(awesomeThings) {
    //   $scope.awesomeThings = awesomeThings;
    // });

	// $scope.scaleArray = ["E3", "G3", "A3", "B3", "D4", "E4", "G4", "A4", "B4", "D5", "E5"];
	$scope.scaleArray = [];
	$scope.note = 0;

	$scope.param1 = 0;
	$scope.param2 = 1;

	var synth = new Tone.FMSynth();

	var fx1 = new Tone.PingPongDelay("4n");
	var fx2 = new Tone.Chorus(0);
	var fx3 = new Tone.Filter();

	$scope.volNormalised;




	var controller = new Leap.Controller({
	      enableGestures: false
	});

	controller.on('connect', function() {
	  console.log("Leap Motion connected!");

	  setInterval(function(){
	      var frame = controller.frame();
	      var hand1 = frame.hands[0];
	      var hand2 = frame.hands[1];


	      if (hand1) {
	        var actualHeight = hand1.palmPosition[1];
	        var mappedHeight = floor(map(actualHeight, 100, 400, 0, $scope.scaleArray.length));
	        mappedHeight = constrain(mappedHeight, 0, $scope.scaleArray.length-1);
	        var grabStrength = hand1.grabStrength;
	        $scope.volNormalised = 1-grabStrength;
	        var rotation = hand1.roll();
	        
	        $scope.param1 = constrain(map(rotation, -2, 2, 0, 30), 0, 30);
	        
	        $scope.$digest();
	        // console.log("actualHeight: ", actualHeight, " / mappedHeight: ", mappedHeight, "grabStrength: ", grabStrength, "rotation: ", rotation);

	        $scope.note = mappedHeight;

	        var midiValue = $scope.scaleArray[$scope.note];
	        // var freqValue = midiToFreq(midiValue);

	        if ($scope.scaleArray.length > 0) {
		        synth.triggerAttackRelease(synth.midiToNote($scope.scaleArray[$scope.note]));
		    }
	        var volDb = 0 - grabStrength * 50;
	        synth.setVolume(volDb, 0.05);
	        // osc.freq(freqValue, 0.1);
	        // osc.amp(1-grabStrength, 0.05);

	      } else {
	        synth.setVolume(-100, 1);
	        // osc.amp(0, 1);
	      }

	      if (hand2) {
	        var actualHeight = hand2.palmPosition[1];
	        var mappedHeight = map(actualHeight, 200, 400, 0, 1);
	        mappedHeight = constrain(mappedHeight, 0, 1);

	        $scope.param2 = constrain(map(hand2.grabStrength, 0, 1, -1, 20), 0, 20);

	        $scope.param3 = mappedHeight;


	      }


	  }, 50);

	});

	controller.connect();

	fx1.setFeedback(0.3);
	// fx2.setOrder(3);
	synth.connect(fx1);
	synth.connect(fx2);
	fx1.toMaster();
	fx2.toMaster();
	fx1.setWet(0.5);
	fx2.setWet(0.6);

	synth.setPortamento(0.1);

	Tone.Transport.start();

	var socket = io();

	$scope.console = "";


	var lastMidi;
	$scope.notes = [];

    socket.on('connect', function() {
      console.log("Connected to socket IO server");
      socket.on('midi', function(msg, deltaTime) {
        console.log("Got a message: ", msg);

    	var newNote = { n: msg[1], t: deltaTime };
        
        var add = false;
        if (lastMidi) {
	        if (lastMidi.n != msg[1] && lastMidi.t != deltaTime) {
	        	add = true;
	        	lastMidi = newNote;
	        	console.log("OK to add this note");
	        } else {
	        	console.log("Duplicate note / time rejected");
	        }

        } else {
        	add = true;
        	lastMidi = newNote;
        }
        if (add) {
	        $timeout(function() {
	        	$scope.scaleArray.push( newNote.n );
	        });
	    }
      });
    });

 	$scope.$watch('param1', function(oldValue, newValue) {
 		// console.log('param1 changed to ', newValue);
 		// synth.setHarmonicity(newValue);
 		synth.setModulationIndex(newValue);
 	});

 	// $scope.$watch('param2', function(oldValue, newValue) {
 	// 	// console.log('param1 changed to ', newValue);
 	// 	// synth.setHarmonicity(newValue);
 	// 	fx2.setRate(newValue);
 	// });


 	$scope.$watch('param3', function(oldValue, newValue) {
 		// console.log('param1 changed to ', newValue);
 		// synth.setHarmonicity(newValue);
 		fx1.setWet(newValue);
 	});


 	setInterval(function () {
 		// console.log("Updating fx");
 		fx2.setRate($scope.param2);

 	}, 100);



  });
