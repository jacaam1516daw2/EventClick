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

/*
 * Redirección Botones de Inicio
 */
router.post('/', function (req, res, next) {
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

/*
 * Redirección de Inicio a la pantalla de Altas
 */
router.post('/alta', function (req, res) {
    console.log('alta');
    res.render('alta', {
        title: 'EventClick'
    });
});

/*
 * Al guardar el alta nueva guardamos los datos i redireccionamos a la pantalla de Inicio
 */
router.post('/insert', function (req, res) {
    console.log('insert');
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
        saveEvents(db, err, function () {
            res.redirect('/');
        });
    });
});

/*
 * Redirección de la pantalla show a la pantalla de edición
 * Hacemos una busqueda por ID evento para enviar los datos actualizados
 */
router.post('/edit', function (req, res) {
    console.log('edit');
    eventClick = new Object();
    eventClick.idEvent = req.body.idEvent;
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connexió correcta");
        eventsById(db, err, function () {
            console.log('eventsById edit: ' + eventClick.title);
            res.render('edit', {
                title: 'EventClick',
                eventClick: eventClick
            });
        });
    });
});

/*
 * Al modificar los datos guardamos los datos y redireccionamos a la pantalla de Inicio
 */
router.post('/update', function (req, res) {
    console.log('update');
    eventClick = new Object();
    eventClick.idEvent = req.body.idEvent;
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
        editEvents(db, err, function () {
            res.redirect('/');
        });
    });
});

/*
 * Visualización de evento y busqueda por id
 */
router.post('/show', function (req, res) {
    console.log("show");
    eventClick = new Object();
    eventClick.idEvent = req.body.idEvent;
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connexió correcta");
        eventsById(db, err, function () {
            res.render('show', {
                title: 'EventClick',
                eventClick: eventClick
            });
        });
    });
});

/**
 * MONGO ACTIONS
 */

/**
 * Alta de vento nuevo
 */
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

/**
 * Modificación evento (guardamos por id)
 */
var editEvents = function (db, err, callback) {
    db.collection('events').updateOne({
        "title": eventClick.title,
        "subtitle": eventClick.subtitle,
        "description": eventClick.description,
        //"author": author,
        "isActive": eventClick.isActive,
        "initDate": eventClick.initDate,
        "endDate": eventClick.endDate
    }, {
        $set: {
            "_id": ObjectId(eventClick.idEvent)
        }
    });
    assert.equal(err, null);
    console.log("Evento modificado en col·lección de eventos");
    callback();
};

/**
 * Busqueda evento por ID
 */
var eventsById = function (db, err, callback) {
    console.log("eventsById");
    var cursor = db.collection('events').find({
        "_id": ObjectId(eventClick.idEvent)
    });
    cursor.each(function (err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            eventClick.idEvent = doc._id;
            eventClick.title = doc.title;
            eventClick.subtitle = doc.subtitle;
            eventClick.description = doc.description;
            //eventClick.author = doc.author;
            eventClick.isActive = doc.isActive;
            eventClick.initDate = doc.initDate;
            eventClick.endDate = doc.endDate;
        } else {
            callback();
        }

    });
};

/**
 * Busqueda evento pantalla de inicio (Solo los activos)
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

module.exports = router;
