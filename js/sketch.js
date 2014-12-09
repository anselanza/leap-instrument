var osc, envelope, fft;

// var scaleArray = [60, 64, 65, 67, 69, 72];
// var scaleArray = ["C4", "E4", "F4", "G4", "A4", "C5", "E5", "F5", "G5", "A5", "C6"];
// var scaleArray = ["C4", "Eb4", "F4", "G4", "Ab4", "C5"];
var scaleArray = ["E3", "G3", "A3", "B3", "D4", "E4", "G4", "A4", "B4", "D5", "E5"];
var note = 0;

var synth = new Tone.MonoSynth();
var fx = new Tone.PingPongDelay("4n");

var controller = new Leap.Controller({
      enableGestures: true
});

controller.on('connect', function() {
  console.log("Leap Motion connected!");

  setInterval(function(){
      var frame = controller.frame();
      var hand = frame.hands[0];

      if (hand) {
        var actualHeight = hand.palmPosition[1];
        var mappedHeight = floor(map(actualHeight, 100, 400, 0, scaleArray.length));
        mappedHeight = constrain(mappedHeight, 0, scaleArray.length-1);
        var grabStrength = hand.grabStrength;
        var rotation = hand.roll();
        // console.log("actualHeight: ", actualHeight, " / mappedHeight: ", mappedHeight, "grabStrength: ", grabStrength, "rotation: ", rotation);

        note = mappedHeight;

        var midiValue = scaleArray[note];
        var freqValue = midiToFreq(midiValue);

        synth.triggerAttackRelease(scaleArray[note]);
        var volDb = 0 - grabStrength * 50;
        synth.setVolume(volDb, 0.05);
        // osc.freq(freqValue, 0.1);
        // osc.amp(1-grabStrength, 0.05);

      } else {
        synth.setVolume(-100, 1);
        // osc.amp(0, 1);
      }


  }, 50);

});


function setup() {
  createCanvas(710, 200);
  // osc = new p5.SinOsc();

  // osc.start();

  fft = new p5.FFT();
  noStroke();

  console.log("Screen resolution: ", displayWidth, "x", displayHeight);

  fx.setFeedback(0.3);
  synth.connect(fx);
  fx.toMaster();
  fx.setWet(0.5);

  synth.setPortamento(0.1);

  Tone.Transport.start();

  controller.connect();
}

function draw() {
  background(20);
    
 
  var spectrum = fft.analyze();
  for (var i = 0; i < spectrum.length/20; i++) {
    fill(spectrum[i], spectrum[i]/10, 0);
    var x = map(i, 0, spectrum.length/20, 0, width);
    var h = map(spectrum[i], 0, 255, 0, height);
    rect(x, height, spectrum.length/20, -h);
  }
}

// function keyPressed() {
//   console.log("Triggering note");
//   synth.triggerAttackRelease("C4", "8n");
// }
