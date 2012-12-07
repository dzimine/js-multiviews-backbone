var app = app || {};

$(function() {

   // Twitter bootstrap layout constants, 12 tiles total, 6 tiles per row
   var N_TILES = 12;
   var N_COLUMNS = 6;

   // Event dispatcher (global for simplicity)
   var dispatcher = _.clone(Backbone.Events);

   var TimeStampBucket = Backbone.Model.extend ({
      defaults: function() {
         // Unix timestamps on key events 
         return {
            name       :     "no name",
            timestamp  :     "never",
            time      :     "0",
            active     :     0,
         };
      },
   });
   
   var TileView = Backbone.View.extend({

      tagName : "div",
      className : "span2",
      tileTemplate : _.template($("#tile-template").html()),

      events : {
         "click" : "updateView"   
      },
      
      initialize : function() {
         dispatcher.on("timer-tick", this.update, this);
         this.model = new TimeStampBucket();
         this.model.set("name", this.options.name);
         this.model.set("active", 0);
         this.model.bind("change:active", this.render, this );
         this.update();
      },

      updateView : function() {
         this.update();
      },
      
      render : function() {
         this.$el.html(this.tileTemplate(this.model.toJSON()));
         if (this.model.get("active") > 0) this.showProgress(); else this.hideProgress();
         return this;
      },

      update : function() {
         var self = this;
         self.incrementActive();
         //self.showProgress(); 

         var body = { "t_begin" : Date.now(), "delay" : 2000 };
         $.post("/rest/views/"+this.id, body).done(function(res) {
            var now = Date.now();
            self.model.set("time", now - res.t_begin );
            self.model.set("timestamp", app.formatTime(now));
            self.decrementActive();
         });

      },
      
      incrementActive : function() { 
         this.model.set("active", this.model.get("active") + 1);
         dispatcher.trigger("change:count", 1);
      },
      decrementActive : function() {          
         this.model.set("active", this.model.get("active") - 1);
         dispatcher.trigger("change:count", -1);
      },

      showProgress: function() {
         this.$el.addClass("loading");
         this.$el.find(".indicator").removeClass("invisible");   
         this.$el.find(".badge").addClass("badge-info");
      }, 
      
      hideProgress: function(){ 
         this.$el.removeClass("loading");
         this.$el.find(".indicator").addClass("invisible");
         this.$el.find(".badge").removeClass("badge-info");
      }, 

   });

   var AppView = Backbone.View.extend({

      el : $(".container"),
      
      events : {
        "click #btn-start" : "start" 
      },
      
      start: function () {

      //update every second for a count of seconds
         var count = 10;
         this.timer.start(count,
                  function() { dispatcher.trigger("timer-tick"); },
                  function() { dispatcher.trigger("timer-timeup"); }
            );
         this.started = true;
      }, 
      
      stop: function() {
         if (this.started) {
            this.timer.stop();
            this.started = false;
         }
      },
      
      initialize : function() {
         $("#tiles").empty(); 
         dispatcher.on("change:count", this.update, this);
         this.counter = 0;
         this.gauge = this.setGauge($("#gauge-canvas")[0]);
         this.timer = new app.timer();
         this.started = false;

         // Append n tile view to the main view 
         // Algorithm: Compute number of rows and iterate by rows and cols,
         // break from the loop if not enough tasks to complete [last] row.
         var n_rows = N_TILES / N_COLUMNS;
         for ( var i_row = 0, idx = 0; i_row < n_rows; i_row++) {
            var row = $("<div/>", {
               class : "row show-grid"
            }).appendTo("#tiles");
            for ( var j_col = 0; j_col < N_COLUMNS; j_col++, idx++) {
               if (idx == N_TILES)
                  break;
               var view = new TileView({ 
                     name : "View " + (idx+1), 
                     id : "tile-view-"+(idx+1)
               });
               row.append(view.render().el);
               // console.log(i_row, j_col, idx );
            }
         }
         $("#gauge").removeClass("hidden");
         
      },
      
      setGauge : function(canvas) {
         var opts = {
               lines: 12, // The number of lines to draw
               angle: 0, // The length of each line
               lineWidth: 0.42, // The line thickness
               pointer: {
                 length: 0.71, // The radius of the inner circle
                 strokeWidth: 0.057, // The rotation offset
                 color: '#000000' // Fill color
               },
               colorStart: '#0088CC',   // Colors
               colorStop: '#0055CC',    // just experiment with them
               strokeColor: '#E0E0E0',   // to see which ones work best for you
               generateGradient: true
             };
             var target = canvas; // your canvas element
             var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
             gauge.maxValue = 100; // set max gauge value
             gauge.animationSpeed = 32; // set animation speed (32 is default value)
             gauge.set(0.1); // set actual value
             return gauge;
      },
      
      update : function(val) {
         this.counter+= val;
         console.log("counter = %d", this.counter);
         this.gauge.set(this.counter);
         $("#gauge-label").text(this.counter);
      }
      
   });

   // Creates app view instance
   new AppView;
});
