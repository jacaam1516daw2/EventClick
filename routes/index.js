var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert'); //utilitzem assercions

var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/EventClickBD';
var eventClick = [{
    title: '',
    subtitle: '',
    description: '',
    author: '',
    isActive: true,
    initDate: {
        type: Date,
        default: Date.now
    },
    endDate: ''
}];

var lista = [];

/* GET home page. */
router.get('/', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connexió correcta");
        activeEvents(db, err, function () {});
    });
    res.render('index', {
        title: 'EventClick',
        eventClick: eventClick
    });
});

/**
 * MONGO ACTIONS
 */

var activeEvents = function (db, err, callback) {
    console.log('activeEvents');
    var cursor = db.collection('events').find({
        "active": true
    });
    cursor.each(function (err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            eventClick.title = doc.title;
            eventClick.subtitle = doc.subtitle;
            eventClick.description = doc.description;
            eventClick.author = doc.author;
            lista.push(eventClick);
        } else {
            callback();
        }

    });
};

module.exports = router;
