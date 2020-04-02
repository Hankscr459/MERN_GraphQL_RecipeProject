const mongoose = require('mongoose')

const Schema = mongoose.Schema

const RecipeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    },
    username: {
        type: String
    }
})

RecipeSchema.index({
    // we're searching on every field with our recipe
    // and we're going to set that to text
    '$**': 'text'
})

module.exports = mongoose.model('Recipe', RecipeSchema)