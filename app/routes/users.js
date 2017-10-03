var express = require('express');
var router = express.Router();

var User = require('../../app/models/user');

router.route('/')
    .get((req, res) => {
        User.find((err, users) => {
            if (err)
                res.send(err);
            res.json(users);
        });
    })
    .post((req, res) => {
        var user = new User();
        user.name = req.body.name;
        user.password = req.body.password;
        user.admin = req.body.admin;
        user.save((err) => {
            if (err)
                res.send(err);
            res.json({ reply: 'User created!' });
        });
    });

router.route('/:user_id')
    .get((req, res) => {
        User.findById(req.params.user_id, (err, user) => {
            if (err)
                res.send(err);
            res.json(user);
        });
    })
    .put((req, res) => {
        User.findById(req.params.user_id, (err, user) => {
            if (err)
                res.send(err);
            user.name = req.body.name;
            user.password = req.body.password;
            user.admin = req.body.admin;
            user.save((err) => {
                if (err)
                    res.send(err);
                res.json({ reply: 'User updated!' });
            });
        });
    })
    .delete((req, res) => {
        User.remove({
            _id: req.params.user_id
        }, (err, user) => {
            if (err)
                res.send(err);
            res.json({ reply: 'Successfully deleted' });
        });
    });

module.exports = router;