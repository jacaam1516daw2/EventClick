var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert'); //utilitzem assercions
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/EventClickBD';
var http = require("http");
var https = require("https");

/*
 * Declaracion de variables
 */
var eventClick = new Object();
var accessUser = new Object();
var userSign = new Object();
var listaEventClick = [];
var listaUserSign = [];
var users = [];

/*
 * INICIO ACCIONES DE ENRUTAMIENTO
 */

router.get('/', function (req, res, next) {
    if (accessUser.id == '' || accessUser.id === undefined) {
        res.render('login', {
            title: 'EventClick',
            listaEventClick: listaEventClick
        });
    } else {
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            console.log("Connexió correcta");
            listaEventClick = [];
            topEvents(db, err, function () {
                res.render('index', {
                    title: 'EventClick',
                    listaEventClick: listaEventClick,
                    accessUser: accessUser
                });
            });
        });
    }
});

/*
 * Redirección Botones de Inicio
 */
router.post('/', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connexió correcta");
        listaEventClick = [];
        topEvents(db, err, function () {
            res.render('index', {
                title: 'EventClick',
                listaEventClick: listaEventClick,
                accessUser: accessUser
            });
        });
    });
});

/*
 * Logout
 */

router.post('/logout', function (req, res, next) {
    console.log('logout');
    accessUser = new Object();
    res.redirect('/');
});

/*
 * Login
 */
router.post('/login', function (req, res, next) {
    console.log('login');
    accessUser = new Object();
    accessUser.nameClick = req.body.user;
    accessUser.passwordClick = req.body.pass;

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connexió correcta");
        loginAccess(db, err, function () {
            if (accessUser.id === '' || accessUser.id === undefined) {
                res.render('login', {
                    title: 'EventClick',
                    msg: 'Username and password are incorrect'
                });
            } else {
                res.redirect('/');
            }
        });
    });
});

/*
 * Registro de usuarios
 */
router.post('/insertUserClick', function (req, res) {
    console.log('insertUserClick');
    userClick = new Object();
    userClick.nameClick = req.body.nameClick;
    userClick.emailClick = req.body.emailClick;
    userClick.passwordClick = req.body.passwordClick;
    userClick.isAdmin = 'false';
    if (req.body.passwordClick === req.body.confirmClick) {
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            console.log("Connexió correcta");
            insertUserClick(db, err, function () {
                res.redirect('/');
            });
        });
    } else {
        res.render('/login', {
            title: 'EventClick'
        });
    }
});

/*
 * Redirección de Inicio a la pantalla de Altas
 */
router.post('/register', function (req, res) {
    console.log('register');
    res.render('register', {
        title: 'EventClick'
    });
});

/*
 * Redirección Botones de Inicio
 */
router.post('/allevents', function (req, res, next) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connexió correcta");
        listaEventClick = [];
        allEvents(db, err, function () {
            res.render('allevents', {
                title: 'EventClick',
                listaEventClick: listaEventClick,
                accessUser: accessUser
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
 * Eliminación de un evento
 */
router.post('/delete', function (req, res) {
    console.log('delete');
    eventClick = new Object();
    eventClick.idEvent = req.body.idEvent;

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connexió correcta");
        deleteEvents(db, err, function () {
            res.redirect('/');
        });
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
    eventClick.url = req.body.urlForm;
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
    eventClick.url = req.body.urlForm;
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

/**
 * Envío de mail de notificación de eventos
 */
router.post('/sendmail', function (req, res) {
    console.log("sendmail");
    eventClick = new Object();
    eventClick.idEvent = req.body.idEvent;
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connexió correcta");
        eventsById(db, err, function () {
            handleSayEmail(req, res);
        });
    });
});

/*
 * FIN ACCIONES DE ENRUTAMIENTO
 */

/*
 * INICIO A LLAMADAS A LA API
 */

/*
 * Inscribirse al evento
 */
router.post('/signme', function (req, res, next) {
    console.log('signme');
    userSign = new Object();
    userSign.idEvent = req.body.idEvent;
    userSign.idUser = accessUser.id;
    userSign.email = accessUser.emailClick;
    userSign.name = accessUser.nameClick;

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connexió correcta");
        userSignme(db, err, function () {
            listaUserSign = [];
            inscriptionUsers(db, err, function () {
                res.render('show', {
                    title: 'EventClick',
                    eventClick: eventClick,
                    users: users,
                    accessUser: accessUser,
                    listaUserSign: listaUserSign,
                    msg: 'Estas inscrito en este evento'
                });
            });
        });
    });
});

/*
 * DesInscribirse al evento
 */
router.post('/unsignme', function (req, res, next) {
    console.log('unsignme');
    userSign = new Object();
    userSign.idEvent = req.body.idEvent;
    userSign.idUser = accessUser.id;

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connexió correcta");
        userUnSignme(db, err, function () {
            listaUserSign = [];
            inscriptionUsers(db, err, function () {
                res.render('show', {
                    title: 'EventClick',
                    eventClick: eventClick,
                    users: users,
                    accessUser: accessUser,
                    listaUserSign: listaUserSign,
                    msg: 'No estas inscrito en este evento'
                });
            });
        });
    });
});

/*
 * Visualización de evento y busqueda por id
 */
router.post('/show', function (req, res) {
    console.log("show");
    //LLAMADA a la API para recuperar las cuentas de mail
    var request = require('request');
    users = [];
    request('http://localhost:8080/api/users', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var listUsers = JSON.parse(body);
            for (i = 0; i < listUsers.length; i++) {
                user = new Object();
                user.email = listUsers[i].email;
                user.name = listUsers[i].name;
                users.push(user);
            }
        }
    })
    eventClick = new Object();
    eventClick.idEvent = req.body.idEvent;
    listaUserSign = [];
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connexió correcta");

        eventsById(db, err, function () {
            listaUserSign = [];
            inscriptionUsers(db, err, function () {
                var msg = 'No estas inscrito en este evento';
                for (i in listaUserSign) {
                    if (i.idUser = accessUser.id) {
                        msg = 'Estas inscrito en este evento';
                        break;
                    }
                }
                res.render('show', {
                    title: 'EventClick',
                    eventClick: eventClick,
                    users: users,
                    accessUser: accessUser,
                    listaUserSign: listaUserSign,
                    msg: msg
                });
            });
        });
    });
});

/**
 * Alta usuarios para notificar eventos
 */
router.get('/usermails', function (req, res) {
    console.log("usermails");
    //LLAMADA a la API para recuperar las cuentas de mail
    var request = require('request');
    users = [];
    request('http://localhost:8080/api/users', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var listUsers = JSON.parse(body);
            for (i = 0; i < listUsers.length; i++) {
                user = new Object();
                user.email = listUsers[i].email;
                user.name = listUsers[i].name;
                users.push(user);
            }
        }
        res.render('usermails', {
            title: 'EventClick',
            users: users
        });
    });
});

/**
 * Eliminar usuarios para notificar eventos llamando a la API
 */
router.post('/deleteUser', function (req, res) {
    console.log("deleteUser");
    var listMails = req.body.isSend;
    var request = require('request');

    if (typeof listMails === 'string') {
        request({
            url: 'http://localhost:8080/api/users/' + listMails, //URL to hit
            method: 'DELETE'
        }, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                console.log(response.statusCode, body);
            }
        });
    } else {
        for (i in listMails) {
            request({
                url: 'http://localhost:8080/api/users/' + listMails[i], //URL to hit
                method: 'DELETE'
            }, function (error, response, body) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(response.statusCode, body);
                }
            });
        }
    }
    res.redirect('/usermails');
});

/**
 * Añadir usuario para notificar eventos llamando a la API
 */
router.post('/altaUser', function (req, res) {
    console.log("altaUser");
    var name = req.body.nombreForm;
    var email = req.body.emailForm;
    var request = require('request');

    request({
        url: 'http://localhost:8080/api/users/',
        method: 'POST',
        json: {
            "name": name,
            "email": email
        }
    }, function (error, response, body) {
        if (error) {
            console.log(error);
        } else {
            console.log(response.statusCode, body);
        }
    });

    res.redirect('/usermails');
});

/*
 * FIN A LLAMADAS A LA API
 */

/**
 * INICIO LLAMADAS A MONGO ACTIONS
 */

/**
 * Busqueda evento por ID
 */
var loginAccess = function (db, err, callback) {
    console.log("loginAccess");
    var cursor = db.collection('usersClick').find({
        "nameClick": accessUser.nameClick,
        "passwordClick": accessUser.passwordClick
    });

    cursor.each(function (err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            accessUser.id = doc._id;
            accessUser.emailClick = doc.emailClick;
            accessUser.isAdmin = doc.isAdmin;
            accessUser.nameClick = doc.nameClick;
        } else {
            callback();
        }

    });
};

/**
 * Insertar usuario nuevo
 */
var insertUserClick = function (db, err, callback) {
    db.collection('usersClick').insertOne({
        "nameClick": userClick.nameClick,
        "emailClick": userClick.emailClick,
        "passwordClick": userClick.passwordClick,
        "isAdmin": userClick.isAdmin
    });
    assert.equal(err, null);
    console.log("Nuevo userClick creado en col·lección de usersClick");
    callback();
};

/**
 * Inscribir usuario
 */
var userSignme = function (db, err, callback) {
    db.collection('userSignme').insertOne({
        "idEvent": userSign.idEvent,
        "idUser": userSign.idUser,
        "name": userSign.name,
        "email": userSign.email
    });
    assert.equal(err, null);
    console.log("Usuario inscrito");
    callback();
};

/**
 * Desinscribir usuario
 */
var userUnSignme = function (db, err, callback) {
    console.log("userunSignme");
    db.collection('userSignme').remove({
        "idEvent": userSign.idEvent,
        "idUser": userSign.idUser
    });
    assert.equal(err, null);
    console.log("Usuario desinscrito");
    callback();
};

/**
 * Lista usuarios inscritos
 */
var inscriptionUsers = function (db, err, callback) {
    var cursor = db.collection('userSignme').find({});
    cursor.each(function (err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            userSign = new Object();
            userSign.idEvent = doc._id;
            userSign.idUser = doc.title;
            userSign.name = doc.name;
            userSign.email = doc.email;

            listaUserSign.push(userSign);
        } else {
            callback();
        }

    });
};

/**
 * Alta de evento nuevo
 */
var saveEvents = function (db, err, callback) {
    db.collection('events').insertOne({
        "title": eventClick.title,
        "subtitle": eventClick.subtitle,
        "description": eventClick.description,
        "url": eventClick.url,
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
var deleteEvents = function (db, err, callback) {
    console.log("deleteEvents");
    db.collection('events').remove({
        "_id": ObjectId(eventClick.idEvent)
    });
    assert.equal(err, null);
    console.log("Evento eliminado de la col·lección de eventos");
    callback();
};

/**
 * Modificación evento (guardamos por id)
 */
var editEvents = function (db, err, callback) {
    db.collection('events').updateOne({
        "_id": ObjectId(eventClick.idEvent)
    }, {
        $set: {
            "title": eventClick.title,
            "subtitle": eventClick.subtitle,
            "description": eventClick.description,
            "url": eventClick.url,
            "isActive": eventClick.isActive,
            "initDate": eventClick.initDate,
            "endDate": eventClick.endDate
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
            eventClick.url = doc.url;
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
 * Busqueda evento activados
 */
var activeEvents = function (db, err, callback) {
    var cursor = db.collection('events').find({
        "isActive": 'checked'
    });
    cursor.each(function (err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            eventClick = new Object();
            eventClick.idEvent = doc._id;
            eventClick.title = doc.title;
            eventClick.subtitle = doc.subtitle;
            eventClick.description = doc.description;
            eventClick.url = doc.url;
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

/**
 * Busqueda evento desactivados
 */
var inactiveEvents = function (db, err, callback) {
    var cursor = db.collection('events').find({
        "isActive": ''
    });
    cursor.each(function (err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            eventClick = new Object();
            eventClick.idEvent = doc._id;
            eventClick.title = doc.title;
            eventClick.subtitle = doc.subtitle;
            eventClick.description = doc.description;
            eventClick.url = doc.url;
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

/**
 * Busqueda evento pantalla de inicio (Solo los activos)
 */
var allEvents = function (db, err, callback) {
    var cursor = db.collection('events').find().sort({
        _id: -1
    });
    cursor.each(function (err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            eventClick = new Object();
            eventClick.idEvent = doc._id;
            eventClick.title = doc.title;
            eventClick.subtitle = doc.subtitle;
            eventClick.description = doc.description;
            eventClick.url = doc.url;
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

/**
 * Busqueda evento pantalla de inicio (Solo los activos) 6 ultimos
 */
var topEvents = function (db, err, callback) {
    var cursor = db.collection('events').find({
        "isActive": 'on'
    }).sort({
        _id: -1
    }).limit(6);
    cursor.each(function (err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            eventClick = new Object();
            eventClick.idEvent = doc._id;
            eventClick.title = doc.title;
            eventClick.subtitle = doc.subtitle;
            eventClick.description = doc.description;
            eventClick.url = doc.url;
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

/**
 * INICIO LLAMADAS A MONGO ACTIONS
 */

/**
 * INICIO ENVIO EMAIL
 */

function handleSayEmail(req, res) {
    // Not the movie transporter!
    console.log("handleSayEmail");
    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        auth: {
            user: 'jacaam1516daw2@gmail.com', // my mail
            pass: 'fjeclotfjeclot'
        }
    }));

    var text = "<div><h1>" + eventClick.title + "</h1></div>" +
        "<div><h3>" + eventClick.subtitle + "</h3></div>" +
        "<div><label>Del:" + eventClick.initDate + "Al:" + eventClick.endDate + "</label></div>" +
        "<div><img src=" + eventClick.url + " width=250px height=200px></div>" +
        "<div><h3>" + eventClick.description + "</h3></div>";

    var toMail = '';

    var listMails = req.body.isSend;

    if (typeof listMails === 'string') {
        toMail = listMails;
    } else {
        for (i in listMails) {
            if (toMail == '') {
                toMail = listMails[i];
            } else {
                toMail = toMail + ',' + listMails[i];
            }
        }
    }

    var mailOptions = {
        from: 'jacaam1516daw2@gmail.com', // sender address
        to: toMail, // list of receivers
        subject: eventClick.title, // Subject line
        html: text
    };
    if (toMail == '') {
        res.render('sendmail', {
            title: 'EventClick',
            msg: 'No has selecionado ningún usuario'
        });
    } else {
        transporter.sendMail(mailOptions, function (error, info) {
            console.log("sendMail");
            if (error) {
                res.render('error', {
                    title: 'EventClick',
                    msg: 'Error en el envío, vuelva a intentarlo de nuevo'
                });
            } else {
                res.render('sendmail', {
                    title: 'EventClick',
                    msg: 'Envío de notificación correcta'
                });
            };
        });
    }
};

/**
 * FIN ENVIO EMAIL
 */

module.exports = router;
