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
		res.json({"status":200,"id":doc._id})
	},function(err){
		res.send(err);
	});
});

/*
* Get hand json object by giving the id to url
* Return 200 status if hand is found
* Otherwise, return 404 and error
*/
app.get("/hands/:handId",function(req,res){
	Hand.findById(req.params.handId).then(function(hand){
		res.send({id: hand._id, cards: hand.cards});
	},function(err){
		res.status(404).send({"status":404,"error":err});
	});
});



app.listen(port,function(){
	console.log(`Started and running on port: ${port}`);
});
