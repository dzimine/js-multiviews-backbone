
$(function($) {
   console.log("beginning with Rafael");
   var r = Raphael("holder"), txtattr = {
      font : "12px sans-serif"
   };

   var x = [], y = [];

   for ( var i = 0; i < 1e6; i++) {
      x[i] = i * 10;
      y[i] = (y[i - 1] || 0) + (Math.random() * 7) - 3;
   }

   r.text(160, 10, "Simple Line Chart (1000 points)").attr(txtattr);
    r.linechart(10, 10, 300, 220, x,
         [ y.slice(0, 1e3) ], 
         {  axis: "0 0 1 1", shade:true, axisxstep:1, axisystep:1 
         }).hoverColumn(
         function() {
            this.set = r.set(r.circle(this.x, this.y[0]));
         }, function() {
            this.set.remove();
         });
});
