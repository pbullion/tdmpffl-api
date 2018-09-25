const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const checkAuth = require('../middleware/check-auth');

const TedBitz = require('../models/tedBitz');

router.get('/', (req, res, next) => {
    TedBitz.find()
        .select('_id week bitz')
        .exec()
        .then(docs => {
            const response = {
                tedBitz: docs.map(doc => {
                    return {
                        _id: doc._id,
                        week: doc.week,
                        bitz: doc.bitz
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
    const tedBitz = new TedBitz({
        _id: new mongoose.Types.ObjectId(),
        week: req.body.week,
        bitz: req.body.bitz
    });
    tedBitz
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                tedBitz: 'Created tedBitz successfully',
                createdTedBitz: {
                    week: result.week,
                    bitz: result.bitz,
                    _id: result._id
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });});

router.delete('/:tedBitzId', (req, res, next) => {
    const id = req.params.tedBitzId;
    TedBitz.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});
module.exports = router;
