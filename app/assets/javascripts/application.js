
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .
//= require bootstrap-sprockets
//= require jquery.turbolinks

// WEB AUDIO API CHECK
window.AudioContext = window.AudioContext || window.webkitAudioContext;
if (!AudioContext) {
  alert("Sorry, your browser doesn't support the Web Audio APIs.");
  throw new Error("Sorry, your browser doesn't support the Web Audio APIs.");
}

var frequencyByKey = {
  65: 261.626, // C4
  87: 277.183, // C#4
  83: 293.665, // D4
  69: 311.127, // D#4
  68: 329.628, // E4
  70: 349.228, // F4
  84: 369.994, // F#4
  71: 391.995, // G4
  89: 415.305, // G#4
  72: 440.000, // A4
  85: 466.164, // A#4
  74: 493.883, // B4
  75: 523.251, // C5
  79: 554.365, // C#5
  76: 587.330, // D5
  80: 622.254, // D#5
  186: 659.3 // E5
};

var nameByKey = {
  65: "C4",
  87: "C#4",
  83: "D4",
  69: "D#4",
  68: "E4",
  70: "F4",
  84: "F#4",
  71: "G4",
  89: "G#4",
  72: "A4",
  85: "A#4",
  74: "B4",
  75: "C5",
  79: "C#5",
  76: "D5",
  80: "D#5",
  186: "E5"
};

var show = document.getElementById("show");

var context = new AudioContext(),
    gain = context.createGain(),
    nodes = [];

gain.gain.value = 0.5;
gain.connect(context.destination);

document.addEventListener('keydown', function (event) {
  var alreadyPressed = false;
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i].code === event.keyCode) {
      alreadyPressed = true;
      break;
    }
  }
  if (event.keyCode >= 65 && event.keyCode <= 186 && !alreadyPressed) {
    var osc = context.createOscillator();
      if (document.getElementById('osc-shape').value == "0") {
        osc.type = 'sawtooth';
      } else if (document.getElementById('osc-shape').value == "1") {
        osc.type = 'sine';
      } else if (document.getElementById('osc-shape').value == "2") {
        osc.type = 'square';
      } else if (document.getElementById('osc-shape').value == "3") {
        osc.type = 'triangle';
      }

    osc.frequency.value = frequencyByKey[event.keyCode];
    osc.connect(gain);
    try {
      osc.start(0);
    } catch (e) {}
    nodes.push({
      code: event.keyCode,
      node: osc
    });

    var str = "";
    for (var i = 0; i < nodes.length; i++) {
      str += nameByKey[nodes[i].code] + " ";
    }
    // show.textContent = str;
  }
}, false);

document.addEventListener('keyup', function (event) {
  var garbage = [];
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i].code === event.keyCode) {
      nodes[i].node.stop(0);
      nodes[i].node.disconnect();
      garbage.push(i);
    }
  }
  for (var i = 0; i < garbage.length; ++i) {
    nodes.splice(garbage[i], 1);
  }
  var str = "";
  for (var i = 0; i < nodes.length; ++i) {
    str += nameByKey[nodes[i].code] + " ";
  }
  // show.textContent = str;
}, false);


$(function() {
  $(document).keydown(function(e) {
    var code = (e.keyCode ? e.keyCode : e.which)
    if (code === 65) {
      $("[data-note='C']").removeClass('C').addClass('colorChange');
    }
  });
});

// $(function() {
//     $(document).keydown(function(e) {
//         var code = (e.keyCode ? e.keyCode : e.which)
//         if (code === 65) {
//             $('.C','.colorChange').toggleClass("C", "colorChange");
//         }
//     });
// });





// var Synth = (function() {
//   // Variables and Notes
//   var notes = ['B','c','c#','d','d#','e','f','f#','g','g#','a','a#','b','C'];
//   var keybind = ['S','D','R','F','T','G','H','U','J','I','K','O','L','º'];
//   var myCanvas;
//   var frequencyLabel;
//   var volumeLabel;
//   var myAudioContext;
//   var oscillator;
//   var gainNode;
//
//
//   // Notes
//   var lowNote = 261.63; // C4
//   var highNote = 493.88; // B4
//
//
//
//   // Constructor
//   var Synth = function() {
//     myCanvas = document.getElementsByClassName('piano-keys')[0];
//     // frequencyLabel = document.getElementById('frequency');
//     // volumeLabel = document.getElementById('volume');
//
//     // Create an audio context.
//     window.AudioContext = window.AudioContext || window.webkitAudioContext;
//     myAudioContext = new window.AudioContext();
//     Synth.setupEventListeners();
//   };
//
//
//   // Event Listeners
//   Synth.setupEventListeners = function() {
//
//     // Disables scrolling on touch devices.
//     document.body.addEventListener('touchmove', function(event) {
//       event.preventDefault();
//     }, false);
//
//     myCanvas.addEventListener('mousedown', Synth.playSound);
//     myCanvas.addEventListener('touchstart', Synth.playSound);
//     myCanvas.addEventListener('mouseup', Synth.stopSound);
//     document.addEventListener('mouseleave', Synth.stopSound);
//     myCanvas.addEventListener('touchend', Synth.stopSound);
//
//     // $('*[data-targetID="C"]');. addEventListener ('keydown', function (event) {
//     //  if (event.which == 67) {
//     //     Event.preventDefault ();
//     //     var field = event.target;
//     //     if (field.getAttribute ('data-index')) {
//     //        var next = document.getElementById (field.getAttribute ('data-index'));
//     //        next.focus ();
//     //       }
//     //    }
//     // });
//
// $(function() {
//     $(document).keydown(function(event){
//       var press = jQuery.Event('keypress');
//       if (event.which == 67) {
//         $('.C').trigger('click');
//       }
//     });
//   });
//
//   };
//
//
//
//
//   // Play a note.
//   Synth.playSound = function(event) {
//     oscillator = myAudioContext.createOscillator();
//     gainNode = myAudioContext.createGain();
//
//     if (document.getElementById('osc-shape').value == "0") {
//       oscillator.type = 'sawtooth';
//     } else if (document.getElementById('osc-shape').value == "1") {
//       oscillator.type = 'sine';
//     } else if (document.getElementById('osc-shape').value == "2") {
//       oscillator.type = 'square';
//     } else if (document.getElementById('osc-shape').value == "3") {
//       oscillator.type = 'triangle';
//     }
//
//     gainNode.connect(myAudioContext.destination);
//     oscillator.connect(gainNode);
//
//     Synth.updateFrequency(event);
//
//     oscillator.start(0);
//
//     myCanvas.addEventListener('mousemove', Synth.updateFrequency);
//     myCanvas.addEventListener('touchmove', Synth.updateFrequency);
//
//     myCanvas.addEventListener('mouseout', Synth.stopSound);
//   };
//
//
//   // Stop the audio.
//   Synth.stopSound = function(event) {
//     oscillator.stop(0);
//
//     myCanvas.removeEventListener('mousemove', Synth.updateFrequency);
//     myCanvas.removeEventListener('touchmove', Synth.updateFrequency);
//     myCanvas.removeEventListener('mouseout', Synth.stopSound);
//   };
//
//
//   // Calculate the note frequency.
//   Synth.calculateNote = function(posX) {
//     var noteDifference = highNote - lowNote;
//     var noteOffset = (noteDifference / myCanvas.offsetWidth) * (posX - myCanvas.offsetLeft);
//     return lowNote + noteOffset;
//   };
//
//
//   // Calculate the volume.
//   Synth.calculateVolume = function(posY) {
//     var volumeLevel = 1;
//     return volumeLevel;
//   };
//
//
//   // Fetch the new frequency and volume.
//   Synth.calculateFrequency = function(x, y) {
//     var noteValue = Synth.calculateNote(x);
//     var volumeValue = Synth.calculateVolume(y);
//
//     oscillator.frequency.value = noteValue;
//     gainNode.gain.value = volumeValue;
//
//   };
//
//
//   // Update the note frequency.
//   Synth.updateFrequency = function(event) {
//     if (event.type == 'mousedown' || event.type == 'mousemove') {
//       Synth.calculateFrequency(event.x, event.y);
//     } else if (event.type == 'touchstart' || event.type == 'touchmove') {
//       var touch = event.touches[0];
//       Synth.calculateFrequency(touch.pageX, touch.pageY);
//     }
//   };
//
//
//
//   // Export Synth.
//   return Synth;
// })();
//
//
// // Initialize the page.
// window.onload = function() {
//   var synth = new Synth();
// }
