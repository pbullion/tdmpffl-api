const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');

router.get('/', (req, res, next) => {
    User.find()
        .select('_id expoToken')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                user: docs.map(doc => {
                    return {
                        _id: doc._id,
                        expoToken: doc.expoToken
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(error);
            res.status(500).json({
                error: err
            })
        })
});

router.post('/', (req, res, next) => {
    console.log('expotoken', req.body.expoToken);
    User.find({expoToken: req.body.expoToken})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "user token exists"
                });
            } else {
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    expoToken: req.body.expoToken
                });
                user
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            user: 'Created user successfully',
                            createdUser: {
                                expoToken: result.expoToken
                            }
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({error: err});
                    });
            }
        })
});

module.exports = router;
