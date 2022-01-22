const express = require('express');
const router = express.Router();
const User = require('../models/users');
const { userValidationRules, validate } = require('../controllers/validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;


router.get('/register', (req, res) => {
    if (req.session.userId){
        res.redirect('/home');
    } else{
        res.render('register');
    }
})

router.post('/register', userValidationRules(), validate, (req, res) => {
    let data = req.body;
    if (data.name && data.email && data.password){
        User.findOne({ email : data.email}, (err, user) => {
            if (user){
                res.send({'Error' : 'Email already in use'});
            } else{
                if (data.password === data.cnfrm_password){
                    bcrypt.hash(data.password, saltRounds, (err, encrypted_password) => {
                        let newUser = new User({
                            name : data.name,
                            email : data.email,
                            password : encrypted_password
                        })
                        newUser.save((err, user) => {
                            if (err) {
                                res.send(err);
                            } else {
                                req.session.userId = user._id.toString();
                                res.redirect('/home');
                            }
                        });
                    });
                }
            }
        })
    } else {
        res.sendStatus(500);
    }
})

router.get(['/', '/login'], (req, res) => {
    if (req.session.userId){
        res.redirect('/home');
    } else{
        res.render('login');
    }
})

router.post('/login', (req, res) => {
    let data = req.body;
    if (data.email && data.password) {
        User.findOne({ email : data.email}, (err, user) => {
            if (user){
                bcrypt.compare(data.password, user.password, (err, result) => {
                    if (result === true){
                        req.session.userId = user._id.toString();
                        res.redirect('/home');
                    } else {
                        res.send({'Error' : 'Incorrect Password'});
                    }
                })
            } else {
                res.send({'Error' : 'Incorrect Email'});
            }
        })
    } else {
        res.sendStatus(500);
    }
})

router.get('/logout', (req, res) => {
    if (req.session){
        req.session.destroy((err) => {
            if (err){
                res.send({"Error" : err});
            } else{
                res.redirect('/login');
            }
        })
    }
})

module.exports = router