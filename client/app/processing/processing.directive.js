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

          background(20);

          fill(255,scope.volNormalised*255,scope.volNormalised*255);
          var steps = scope.scaleArray.length;
          var y = height - (scope.note + 1) * height/steps;
          rect(0, y, width, height/steps);

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