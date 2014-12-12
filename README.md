leap-instrument
===============

Kind of a theremin-style instrument for live performance. You need to connect a MIDI controller/keyboard to get this to work.

Once you've cloned the repo, be sure to run
<pre>npm install && bower install</pre>
before attempting to run the application.

Then to get things running,
<pre>grunt serve</pre>

Thanks to the lovely [yeoman-fullstack](https://github.com/DaftMonk/generator-angular-fullstack) generator, the <code>grunt serve</code> command will fire up the Express server with the built-in MIDI bridge and Socket.IO, and the browser will open the client-side application with the visuals provided by P5js and fancy data-binding using AngularJS. Nice.
