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

/*
* Add new hand json object and save it to db on Post request
* Return 200 status if hand is added succesfully
* Otherwise, return the error
*/
app.post('/hands',function(req,res){
	var hand = new Hand();
	hand.cards = req.body;
	hand.save().then(function(doc){
		res.status(200);
		res.json({status:200,id:doc._id})
	},function(err){
		res.send(err);
	});
});



app.listen(port,function(){
	console.log(`Started and running on port: ${port}`);
});
