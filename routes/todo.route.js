const {Router} = require('express')
const router = Router()
const Todo = require('../models/Todo')

router.post('/add', async (req, res) => {
    try {
        const {text, userId} = req.body

        const todo = await new Todo({
            text,
            owner: userId,
            completed: false,
            important: false
        })

        await todo.save()

        res.json(todo)
    } 
    catch (error) {
        console.log(error)
    }
})

router.get('/', async (req, res) => {
    try {
        const { userId } = req.query

        const todo = await Todo.find({owner: userId})

        res.json(todo)
    } 
    catch (error) {
        console.log(error)
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({_id: req.params.id})
        res.json(todo)
    } 
    catch (error) {
        console.log(error)
    }
})

router.put('/complete/:id', async (req, res) => {
    try {
        const todo = await Todo.findOne({_id: req.params.id})
        todo.completed = !todo.completed
        
        await todo.save()
        res.json(todo)
    } 
    catch (error) {
        console.log(error)
    }
})

router.put('/important/:id', async (req, res) => {
    try {
        const todo = await Todo.findOne({_id: req.params.id})
        todo.important = !todo.important
        
        await todo.save()
        res.json(todo)
    } 
    catch (error) {
        console.log(error)
    }
})

module.exports = router


