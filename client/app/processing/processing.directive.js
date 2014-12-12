'use strict';

angular.module('midiserverApp')
  .directive('processing', function ($timeout) {
    return {
      template: ' <div id="myContainer"></div>',
      restrict: 'E',
      link: function (scope, element, attrs) {

        // console.log(p5);
        
        var p = new p5(); // setup() called here with defaults
        
        p.resizeCanvas(400,400);

        p.draw = function() {

          background(0);

          if (scope.scaleArray.length > 0) {

            var y;
            var steps = scope.scaleArray.length;
 
            for (var i=0; i<scope.scaleArray.length; i++) {
              var thisNote = scope.scaleArray[i];

              // Fret markers...
              y = height - height/steps * i;
              noFill();
              strokeWeight(1);
              stroke(50);
              rect (0, y, width, height/steps);

              // Note markers...
              var x = map (thisNote, 30, 100, 0, width);
              strokeWeight(2);
              stroke(255);
              noFill();
              // fill (0,0,255);
              y = height - height/steps * i - (height/steps/2);
              ellipse (x, y, 10, 10);

            }

            // Current note selection...
            noStroke();
            fill(255,scope.volNormalised*255,scope.volNormalised*255, 100);
            y = height - (scope.note + 1) * height/steps;
            rect(0, y, width, height/steps);


          }



        }


        p.keyPressed = function() {
          // console.log("Keypressed: ",key);
          if (key == ' ') {
            console.log("Clearing scaleArray...");
              $timeout(function() {
                scope.scaleArray = [];
              });
          }
        }

      }
    };
  });