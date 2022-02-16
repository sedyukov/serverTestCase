const express = require('express')
const mongoose = require('mongoose')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json({extended: true}))
app.use('/api/auth', require('./routes/auth.route'))
app.use('/api/todo', require('./routes/todo.route'))

async function start() {
    try {
        await mongoose.connect('mongodb+srv://kot:adept@mycluster.flb6q.mongodb.net/todoBase?retryWrites=true&w=majority', {
        })

        app.listen(PORT, () => {
            console.log('Server started on port ' + PORT)
        })
    } catch (err) {
        console.error(err)
    }
}

start()