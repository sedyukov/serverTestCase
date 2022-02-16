const { Schema, model, Types} = require('mongoose')

const schema = new Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    todos: [{type: Types.ObjectId, ref: 'Todo'}]
})

module.exports = model('User', schema)