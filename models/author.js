const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a table named 'Author' with defined schema 'authorSchema'
const authorSchema = new Schema({
    name: String,
    description: String
});

module.exports = mongoose.model('Author', authorSchema);