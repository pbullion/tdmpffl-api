const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fetch = require('node-fetch');

const Message = require('../models/message');
const User = require('../models/user');

router.get('/', (req, res, next) => {
    Message.find()
        .select('_id title body date')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                messages: docs.map(doc => {
                    return {
                        _id: doc._id,
                        title: doc.title,
                        body: doc.body,
                        date: doc.date
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
    const message = new Message({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        body: req.body.body,
        date: req.body.date
    });
    message
        .save()
        .then(result => {
            console.log(result);
            var messages = [];
            User.find().then(userArray => {
                console.log(userArray);
                userArray.forEach(function(element) {
                    messages.push({
                        "to": element.expoToken,
                        "sound": "default",
                        "body": result.body,
                        "title": result.title
                    });
                });
                console.log(messages);
                fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'post',
                    headers: {
                        "accept": "application/json",
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(messages)
                })
                .catch(reason => {
                    console.log(reason)
                });
            });

            res.status(201).json({
                message: 'Created message successfully',
                createdMessage: {
                    title: result.title,
                    body: result.body,
                    date: result.date,
                    _id: result._id
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });});

module.exports = router;
