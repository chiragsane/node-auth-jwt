var express = require('express'),
    app = express();

var config = require('./config');
var User = require('./app/models/user');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var mongoose = require('mongoose');
mongoose.connect(config.database);
app.set('mongo_key', config.mongo_key);

var jwt = require('jsonwebtoken');

var morgan = require('morgan');
app.use(morgan('dev'));

var port = process.env.PORT || 8080;

app.get('/', function(req, res) {
    res.send('The API is at http://localhost:' + port + '/api');
});
app.use('/api/users', require('./app/routes/users'));
app.post('/api/authenticate', (req, res) => {
    User.findOne({
        name: req.body.name
    }, function(err, user) {
        if (err)
            throw err;
        if (!user)
            res.json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        else if (user) {
            if (user.password != req.body.password)
                res.json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });
            else {
                var token = jwt.sign({ data: user }, app.get('mongo_key'), { expiresIn: 1440 });
                res.json({
                    success: true,
                    token: token
                });
            }
        }
    });
});

var port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`App started on ${port}`);
});