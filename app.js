const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require('path');
const pug = require('pug');

app.locals.pretty = true;
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.render('index.pug');
});

app.get('/turtles', function(req, res){
    res.render('turtles.pug');
});

app.get('/jsgame', function(req, res){
    res.render('jsgame.pug');
});

app.get(/.*/, function(req, res){
    res.end("<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\"><title>Error</title></head><body><h1>www.vinaro.me</h1><h2>Error 404 : </h2><p>The requested URL " + req.url + " was not found on this server.</p></body></html>")
});

server.listen(app.get('port'), function(){
    console.log('Server listening on port ' + app.get('port'));
});

var uniqueId = function() {
    const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return randomLetter + Date.now();
  };
  

const io = require('socket.io').listen(server);
users = {};
var tracks = [null, null, null, null];

io.sockets.on('connection', function(socket){
    
    var user = false;

    socket.on('testusername', function(data){
        var testUsername = 0;
        console.log(data.username);
        for (prop in users){
                console.log(users[prop].username);
                if(users[prop].username.toLowerCase().trim() === data.username.toLowerCase().trim()) testUsername = 1;
        };
        console.log(testUsername);
        socket.emit('testUsernameResult', {usernameExists : testUsername});
    });

    socket.on('createUser', function(identified){
        console.log(identified);
        
        user = identified;
        user.id = uniqueId();
        for (var i = 0; i < tracks.length ; i++){
            if(tracks[i] === null){
                tracks[i] = 1;
                user.track = i;
                break;
            }
        }
        users[user.id] = user;
        console.log(user);
        socket.emit('tomyself', user)
        socket.broadcast.emit('newuser', user)

        for (prop in users){
                socket.emit('users', users[prop] );
        };

        if (identified.avatar === 'avatar02'){
            stopwatch();
        };
        if (identified.avatar === 'avatar04'){
            clearInterval(stopit);
        };

    });

    socket.on('sendPosition', function(position){
        console.log(position);
        socket.broadcast.emit('updatePosition', position);
    });

    socket.on('disconnect', function(){
        if(!user){
            return false;
        };
        console.log(user);
        console.log(user.username + ' s\'est deconnecte')
        tracks[user.track] = null;
        delete users[user.id];
        io.sockets.emit('discusers', user);
    });
});

   // Chronometre server
   var stopit;

   var stopwatch = function (){
    var start = new Date();
    stopit = setInterval(function(){
        var now = new Date()
            io.sockets.emit('timestamp', {timestamp: now - start});
    }, 10); 


   }

