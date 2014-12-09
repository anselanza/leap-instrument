var osc, envelope, fft;

var scaleArray = [60, 64, 65, 67, 69, 72];
var note = 0;

var synth = new Tone.MonoSynth();

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
        var mappedHeight = floor(map(actualHeight, 100, 500, 0, scaleArray.length));
        mappedHeight = constrain(mappedHeight, 0, scaleArray.length-1);
        var grabStrength = hand.grabStrength;
        var rotation = hand.roll();
        console.log("actualHeight: ", actualHeight, " / mappedHeight: ", mappedHeight, "grabStrength: ", grabStrength, "rotation: ", rotation);

        note = mappedHeight;

        var midiValue = scaleArray[note];
        var freqValue = midiToFreq(midiValue);

        synth.triggerAttackRelease(freqValue);
        var volDb = 0 - grabStrength * 20;
        synth.setVolume(volDb, 0.1);
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

  synth.toMaster();

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
