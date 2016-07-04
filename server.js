// server.js

    // set up ========================
    var http = require('http');
    var express  = require('express');
    var app      = express();                               // create our app w/ express

    // configuration ================

    app.use(express.static(__dirname + '/public'));                 // set the static files location

    // application -------------------------------------------------------------
    app.get('/', function(req, res) {
        res.sendfile('/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });

    // listen (start app with node server.js) ======================================
    app.listen(3000);
    console.log("App listening on port 3000");

