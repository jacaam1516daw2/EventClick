var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert'); //utilitzem assercions

var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/EventClickBD';

var eventClick = new Object();

var listaEventClick = [];

/* GET home page. */
router.get('/', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connexió correcta");
        listaEventClick = [];
        activeEvents(db, err, function () {
            res.render('index', {
                title: 'EventClick',
                listaEventClick: listaEventClick
            });
        });
    });

});

router.post('/newEvent', function (req, res) {
    eventClick = new Object();
    eventClick.title = req.body.titleForm;
    eventClick.subtitle = req.body.subtitleForm;
    eventClick.description = req.body.descriptionForm;
    //eventClick.author = req.body.author;
    eventClick.isActive = req.body.isActiveForm;
    eventClick.initDate = req.body.initDateForm;
    eventClick.endDate = req.body.endDateForm;

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connexió correcta");
        saveEvents(db, err, function () {});
        listaEventClick = [];
        activeEvents(db, err, function () {
            res.render('index', {
                title: 'EventClick',
                listaEventClick: listaEventClick
            });
        });
    });
});

/**
 * MONGO ACTIONS
 */

var activeEvents = function (db, err, callback) {
    var cursor = db.collection('events').find({
        "isActive": 'on'
    });
    cursor.each(function (err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            eventClick = new Object();
            eventClick.idEvent = doc._id;
            eventClick.title = doc.title;
            eventClick.subtitle = doc.subtitle;
            eventClick.description = doc.description;
            //eventClick.author = doc.author;
            eventClick.isActive = doc.isActive;
            eventClick.initDate = doc.initDate;
            eventClick.endDate = doc.endDate;

            listaEventClick.push(eventClick);
        } else {
            callback();
        }

    });
};

var saveEvents = function (db, err, callback) {
    db.collection('events').insertOne({
        "title": eventClick.title,
        "subtitle": eventClick.subtitle,
        "description": eventClick.description,
        //"author": author,
        "isActive": eventClick.isActive,
        "initDate": eventClick.initDate,
        "endDate": eventClick.endDate
    });
    assert.equal(err, null);
    console.log("Nuevo evento creado en col·lección de eventos");
    callback();
};

module.exports = router;
