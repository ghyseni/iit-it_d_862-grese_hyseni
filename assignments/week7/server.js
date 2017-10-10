var express = require("express"),
    http = require("http"),
    app = express(),
const port = 3000;

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

/* Create the hand model/schema */
var Hand = mongoose.model('Hand',{
	cards:{
		type:[]
	}
});



app.listen(port,function(){
	console.log(`Started and running on port: ${port}`);
});
