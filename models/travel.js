const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TravelSchema = new Schema({
    title: String,
    name : String,
	location : String,
	price: Number,
    image: String,
	description: String
})

module.exports = mongoose.model('Travel', TravelSchema)