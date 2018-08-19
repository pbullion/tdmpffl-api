const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

const Admin = require('../models/admin');

router.post('/signup', (req, res, next) => {
    Admin.find({email: req.body.email})
        .exec()
        .then(admin => {
            if (admin.length >=1) {
                return res.status(409).json({
                    message: 'Email exists'
                })
            } else {
                bcrypt.hash(req.body.password, null, null, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const admin = new Admin({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        admin
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User Created'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                })
                            });
                    }
                });
            }
        });
});

router.post('/login', (req, res, next) => {
    Admin.find({ email: req.body.email })
        .then(admin => {
            if (admin.length < 1) {
                return res.status(401).json({
                    message: 'Auth Failed'
                })
            }
            bcrypt.compare(req.body.password, admin[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth Failed'
                    })
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: admin[0].email,
                            adminId: admin[0]._id
                        },
                        'jwtsecretpasswordhaha',
                        {
                            expiresIn: "12hr"
                        }
                    );
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    })
                }
                res.status(401).json({
                    message: 'Auth Failed'
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.delete('/:userId', (req, res, next) => {
    Admin.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});


module.exports = router;
