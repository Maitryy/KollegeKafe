const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CabSchema = new Schema({
    title: String,
    name : String,
	location1 : String,
	location2 : String,
	price: Number,
	description: String
})

module.exports = mongoose.model('Cab', CabSchema)