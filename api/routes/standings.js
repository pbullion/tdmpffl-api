const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const espnFF = require('espn-ff-api');

const Standings = require('../models/standings');

const leagueID = '584136';
const cookies = {
    espnS2 : 'AEBYHUTTeOIm3d0iuJ9p7%2BPam16PplfNIbCrZsN39o8NPGUUyT8imjnusWnZOnlP1GqluFJ2AKHhvGuJLBYUEzJ5MFmPm5si17OwV7hAVOMrEzqL%2FLHrkaeoXgnb29TJhXbNBwxjcfn10Z8l%2FDz3tqlpiWdr20Qu6aeyktfkXyqOv8YPSp7nXuIeMx0s%2Fcj7uRKwsdPW%2FykdnxdbBRywa6%2BCSUcqAX6W2TxxcFt78DeWj6oP99wVwT4GrWEzfIuI8SoeVE4CeoDwBFeOk9kuhVCfouan4IfwzhCaENL1oNt%2FXg%3D%3D',
    SWID   : '{19B220F5-0B10-46F8-B420-44A371995BC5}'
};

router.get('/', (req, res, next) => {
    espnFF.getLeagueStandings(cookies, leagueID)
        .then(standings => {
            console.log('getting the standings');
            console.log('standings', standings);
            res.status(200).jsonBinFile(standings.teams);
        })
        .catch(err => {
            console.log(error);
            res.status(500).jsonBinFile({
                error: err
            })
        })
});
router.get('/scoreboard', (req, res, next) => {
    espnFF.getLeagueScoreboard(cookies, leagueID)
        .then(leagueInfo => {
            console.log('getting the standings');
            console.log('leagueInfo', leagueInfo);
            res.status(200).jsonBinFile(leagueInfo.scoreboard.matchups);
        })
        .catch(err => {
            console.log(error);
            res.status(500).jsonBinFile({
                error: err
            })
        })
});

router.get('/scoreboard/singleteam', (req, res, next) => {
    const teamLocation = req.params.teamLocation;
    const teamName = req.params.teamName;
    espnFF.getSingleTeamLineup(cookies, leagueID, 2, 2)
        .then(leagueInfo => {
            console.log('getting the standings');
            console.log('leagueInfo', leagueInfo);
            // res.status(200).json(leagueInfo[0].projectedPoints);
            res.status(200).jsonBinFile(leagueInfo);
        })
        .catch(err => {
            console.log(error);
            res.status(500).jsonBinFile({
                error: err
            })
        })
});

router.post('/', (req, res, next) => {
    const standings = new Standings({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        body: req.body.body,
        date: req.body.date
    });
    standings
        .save()
        .then(result => {
            console.log(result);
            var standings = [];
            User.find().then(userArray => {
                console.log(userArray);
                userArray.forEach(function(element) {
                    standings.push({
                        "to": element.expoToken,
                        "sound": "default",
                        "body": result.body,
                        "title": result.title,
                        "badge": 1
                    });
                });
                console.log(standings);
                fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'post',
                    headers: {
                        "accept": "application/json",
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(standings)
                })
                    .catch(reason => {
                        console.log(reason)
                    });
            });

            res.status(201).jsonBinFile({
                standings: 'Created standings successfully',
                createdStandings: {
                    title: result.title,
                    body: result.body,
                    date: result.date,
                    _id: result._id
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).jsonBinFile({error: err});
        });});

router.delete('/:standingsId', (req, res, next) => {
    const id = req.params.standingsId;
    Standings.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).jsonBinFile(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).jsonBinFile({
                error: err
            })
        })
});
module.exports = router;
