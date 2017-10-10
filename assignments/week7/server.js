var express = require("express"),
    http = require("http"),
    app = express(),
const port = 3000;

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

app.listen(port,function(){
	console.log(`Started and running on port: ${port}`);
});
