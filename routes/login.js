var express = require('express');
var router = express.Router();
var db = require('mongodb').MongoClient.connect('mongodb://localhost/test');
var Q = require('q');


router.post('/', function(req, res, next) {

    var user = req.body;
    var isLogin = user.isLogin || false;
    delete user.isLogin;
    // TODO, separate login and signup
    db.then(function(db) {
        if (isLogin) {
            return db.collection('users').find(user).toArray();
        } else
            return db.collection('users').insert(user);
    }).then(function(users) {
        var defer = Q.defer();
        req.session.user = user;
        req.session.save(function(err) {
            if (err) {
                defer.reject(err);
            } else {
                var result;
                /*
                if (isLogin) {
                    result = res.json({
                        status: users.length > 0
                    });
                } else {
                    result = res.json(user);
                }*/
                result = isLogin ? {status: users.length > 0} : user;
                defer.resolve(result);
            }
        });
        return defer.promise;
    })
    .then(res.json.bind(res))
    .catch(function(err) {
        console.log('insert user fail', err);
        next(err);
    });
});

router.get('/', function(req, res, next){
    var username;
    if (req.session.user)
        username = req.session.user.name;
    res.json({username: username});
    
});

router.get('/logout', function(req, res, next){
    req.session.destroy(function(){
        res.json({});
    })
});

module.exports = router;
