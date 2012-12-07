var app = app || {} ;

$(function( $ ) {

 // Timer
 // Fires timer-tick event every second
 // and fires timer-timeup event when number of seconds expired
app.timer = function() { 
   var timerId = null;
   var sec = 0;
   var onTickCallback = null;
   var onTimeUpCallback = null;
   
   this.start = function(seconds, onTick, onTimeUp) {
      sec = seconds;
      onTickCallback = onTick;
      onTimeUpCallback = onTimeUp;
      timerId = setInterval(this.onTick, 1000);
   };

   this.onTick = function() {
      if (sec > 0) {
          onTickCallback();
          sec--;
          return;
      }
      if (onTimeUpCallback) onTimeUpCallback();
      stop();
   };
   
   var stop = function() {
      if (timerId) { 
         clearInterval(timerId); 
         timerId = null;
      }
   };
   
   this.stop = stop;
};

app.formatTime = function(unixTimestamp) {
   var dt = new Date(unixTimestamp);

   var hours = dt.getHours();
   var minutes = dt.getMinutes();
   var seconds = dt.getSeconds();
   var milli = dt.getMilliseconds();

   if (hours < 10) hours = '0' + hours;

   if (minutes < 10) minutes = '0' + minutes;

   if (seconds < 10) seconds = '0' + seconds;

   return hours + ":" + minutes + ":" + seconds + "." + milli;
};       
   
});