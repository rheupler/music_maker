
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require_tree .
//= require bootstrap-sprockets



var Synth = (function() {
  // Variables
  var myCanvas;
  var frequencyLabel;
  var volumeLabel;
  var myAudioContext;
  var oscillator;
  var gainNode;


  // Notes
  var lowNote = 261.63; // C4
  var highNote = 493.88; // B4



  // Constructor
  var Synth = function() {
    myCanvas = document.getElementsByClassName('piano-keys')[0];
    // frequencyLabel = document.getElementById('frequency');
    // volumeLabel = document.getElementById('volume');

    // Create an audio context.
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    myAudioContext = new window.AudioContext();
    Synth.setupEventListeners();
  };


  // Event Listeners
  Synth.setupEventListeners = function() {

    // Disables scrolling on touch devices.
    document.body.addEventListener('touchmove', function(event) {
      event.preventDefault();
    }, false);

    myCanvas.addEventListener('mousedown', Synth.playSound);
    myCanvas.addEventListener('touchstart', Synth.playSound);
    myCanvas.addEventListener('mouseup', Synth.stopSound);
    document.addEventListener('mouseleave', Synth.stopSound);
    myCanvas.addEventListener('touchend', Synth.stopSound);

    // $('*[data-targetID="C"]');. addEventListener ('keydown', function (event) {
    //  if (event.which == 67) {
    //     Event.preventDefault ();
    //     var field = event.target;
    //     if (field.getAttribute ('data-index')) {
    //        var next = document.getElementById (field.getAttribute ('data-index'));
    //        next.focus ();
    //       }
    //    }
    // });

$(function() {
    $(document).keydown(function(event){
      var press = jQuery.Event('keypress');
      if (event.which == 67) {
        $('#natural').trigger('press');
      }
    });
  });

  };




  // Play a note.
  Synth.playSound = function(event) {
    oscillator = myAudioContext.createOscillator();
    gainNode = myAudioContext.createGain();

    if (document.getElementById('osc-shape').value == "0") {
      oscillator.type = 'sawtooth';
    } else if (document.getElementById('osc-shape').value == "1") {
      oscillator.type = 'sine';
    } else if (document.getElementById('osc-shape').value == "2") {
      oscillator.type = 'square';
    } else if (document.getElementById('osc-shape').value == "3") {
      oscillator.type = 'triangle';
    }

    gainNode.connect(myAudioContext.destination);
    oscillator.connect(gainNode);

    Synth.updateFrequency(event);

    oscillator.start(0);

    myCanvas.addEventListener('mousemove', Synth.updateFrequency);
    myCanvas.addEventListener('touchmove', Synth.updateFrequency);

    myCanvas.addEventListener('mouseout', Synth.stopSound);
  };


  // Stop the audio.
  Synth.stopSound = function(event) {
    oscillator.stop(0);

    myCanvas.removeEventListener('mousemove', Synth.updateFrequency);
    myCanvas.removeEventListener('touchmove', Synth.updateFrequency);
    myCanvas.removeEventListener('mouseout', Synth.stopSound);
  };


  // Calculate the note frequency.
  Synth.calculateNote = function(posX) {
    var noteDifference = highNote - lowNote;
    var noteOffset = (noteDifference / myCanvas.offsetWidth) * (posX - myCanvas.offsetLeft);
    return lowNote + noteOffset;
  };


  // Calculate the volume.
  Synth.calculateVolume = function(posY) {
    var volumeLevel = 1 - (((100 / myCanvas.offsetHeight) * (posY - myCanvas.offsetTop)) / 100);
    return volumeLevel;
  };


  // Fetch the new frequency and volume.
  Synth.calculateFrequency = function(x, y) {
    var noteValue = Synth.calculateNote(x);
    var volumeValue = Synth.calculateVolume(y);

    oscillator.frequency.value = noteValue;
    gainNode.gain.value = volumeValue;

  };


  // Update the note frequency.
  Synth.updateFrequency = function(event) {
    if (event.type == 'mousedown' || event.type == 'mousemove') {
      Synth.calculateFrequency(event.x, event.y);
    } else if (event.type == 'touchstart' || event.type == 'touchmove') {
      var touch = event.touches[0];
      Synth.calculateFrequency(touch.pageX, touch.pageY);
    }
  };



  // Export Synth.
  return Synth;
})();


// Initialize the page.
window.onload = function() {
  var synth = new Synth();
}
