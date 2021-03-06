const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./api/routes/users');
const messagesRoutes = require('./api/routes/messages');
const tedBitzRoutes = require('./api/routes/tedBitz');
const adminRoutes = require('./api/routes/admin');
const standingsRoutes = require('./api/routes/standings');
const historyRoutes = require('./api/routes/history');

mongoose.connect('mongodb+srv://theAvenueApp:5JiOuLiq4wtpnp9O@the-avenue-db-jikeb.mongodb.net/CodingChallenge?retryWrites=true', {
    useNewUrlParser: true
});

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).jsonBinFile({});
    }
    next();
});p

app.use('/users', userRoutes);
app.use('/history', historyRoutes);
app.use('/messages', messagesRoutes);
app.use('/admin', adminRoutes);
app.use('/standings', standingsRoutes);
app.use('/tedBitz', tedBitzRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.jsonBinFile({
        error: {
            message: error.message
        }
    })
});

module.exports = app;
