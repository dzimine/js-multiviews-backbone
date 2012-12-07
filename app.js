// Node.js backend for the app
// 
var express = require('express');
var app = express();
var port = 3000;

// static first, to ignore logging
app.use(express.static(__dirname));

//body parser next, so we have req.body
app.use(express.bodyParser());

// simple logger
app.use(function(req, res, next) {
   console.log("Received %s %s:", req.method, req.url);
   console.log(req.body);
   next();
});

app.post('/rest/views/:id', function(req, res) {
   //curl -H "Content-type: application/json" -X POST -d '{"timestamp":100}' http://localhost:3000/rest/views/1
   console.log(req);
   var t_begin = req.body.t_begin ? req.body.t_begin : 0; 
   var delay = req.body.delay ? req.body.delay : 0;
   setTimeout(function() {
      var data = {
            id : req.params.id,
            t_begin : t_begin,
            delay : delay,
         };
      res.json(data);
   }, delay);
   
});

app.listen(port);
console.log('Express listening on port ' + port);


