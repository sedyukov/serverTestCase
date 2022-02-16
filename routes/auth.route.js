const {Router} = require('express')
const router = new Router()
const User = require('../models/User')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/registration', 
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Некорректный пароль').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Некорректные данные"
                })
            }

            const { email, password } = req.body

            const isUsed = await User.findOne({ email })

            if (isUsed) {
                return res.status(300).json({ message: 'Данный email уже занят, попробуйте другой.'})
            }

            const hashedPassword = await bcrypt.hash(password, 12)

            const user = new User({
                email, password: hashedPassword
            })

            await user.save()

            res.status(201).json({ message: 'Пользователь создан'})
        } 
        catch (error) {
            console.log(error)
        }
})

router.post('/login', 
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Некорректный пароль').exists()
    ],
    async (req, res) => {
        try {
            
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: "Некорректные данные"
                })
            }


            const user = await User.findOne({email: req.body.email})

            if (!user) {
                return res.status(400).json({
                    message: "Такого email нет в базе"
                })
            }

            const isMatch = await bcrypt.compare(req.body.password, user.password)

            if (!isMatch) {
                return res.status(400).json({
                    message: "Неверный пароль"
                })
            }

            const jwtSecret = 'dhf8d7g32g9fg932sfdsf81D90ASSAgf8hdfhaofhia939129138'

            const token = jwt.sign(
                {userId: user.id}, 
                jwtSecret,
                {expiresIn: '1h'}
            )

            res.json({
                token, 
                userId: user.id,
            })
        } 
        catch (error) {
            console.log(error)
        }
})

module.exports = router
