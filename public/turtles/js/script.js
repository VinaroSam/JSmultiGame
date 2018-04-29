(function (){ 

//------------------------------------
// introduction panel - Game info
//------------------------------------

    // global variables

    var turtlesprite = [-20, -94, -160, -232, -301, -369, -439, -506];
    var movea;
    var logged = false;
    var turtle = {};
    var avaPath = "./images/characters/";
    var socketUrl = (window.location.hostname === 'www.vinaro.me') ? 'http://35.180.42.242:3000' : 'http://localhost:3000';
    //  distance max 850 - min 80
    var distance = 850;

    // Display random tracks ground colour

    function trackgroundColour() { 
        return ['darkorange', 'blue','green', 'flashygreen', 'flashyblue', 'lightblue'][Math.floor(Math.random()*6)]
        };
    var trackground = document.getElementById('trackground');
    trackground.style.backgroundImage = 'url("./images/background/trackground_'+ trackgroundColour() +'.png")';

    var play = document.getElementById('play');

    play.addEventListener('click', function(){
        var section1 = document.getElementById('section1');
        var sectionStyle = window.getComputedStyle(section1);
        var i = 0;
        function scrollcontent(){
            section1.style.marginTop = i + 'px';
            section1.style.marginLeft = i + 'px';
            var stopscroll = window.requestAnimationFrame(scrollcontent);
            if (i <= -parseFloat(sectionStyle.height)){
                window.cancelAnimationFrame(stopscroll);
            };  
            i-=7;
        }
        requestAnimationFrame(scrollcontent);
    }, false);

//------------------------------------
// Scenery elements
//------------------------------------

    var runner = document.getElementById('runner');
    var run = false;
    
    var theatre = {
        stage : document.getElementById('gameCanvas'),
        scenery : document.getElementById('scene'),
        stageStyle : window.getComputedStyle(document.getElementById('gameCanvas')),
        sceneryStyle : window.getComputedStyle(document.getElementById('scene'))
    };
    
    
     var decors = {
        clouds : document.getElementById("clouds"),
        cloudsStyle : window.getComputedStyle(document.getElementById("clouds"))
    };
	
    decors.clouds.style.left = decors.cloudsStyle.left;

    // clone clouds for infinite loop

    var clouds2 = decors.clouds.cloneNode(true);
    clouds2.setAttribute('id', 'clouds2');
    clouds2.setAttribute('class', 'clouds');
    decors.clouds.parentNode.appendChild(clouds2);
    clouds2.style.left = theatre.scenery.width;

    var cloudsPosX = 0;
    
    function loopCloud(){
        cloudsPosX -= 0.3;
        decors.clouds.style.left = cloudsPosX + 'px';
        clouds2.style.left = parseFloat(theatre.sceneryStyle.width) + cloudsPosX + 'px';
    
        var stoploopCloud = requestAnimationFrame(loopCloud);
        if (parseFloat(decors.clouds.style.left) <= -parseFloat(theatre.sceneryStyle.width)){
            cloudsPosX = 0;
        }
    }

    loopCloud();
    
//------------------------------------
// Turtles
//------------------------------------    
    
    // Function create main player turtle and keys control 

    function CreateTurtle(id, track){
    turtle[id] = document.createElement('div');
    turtle[id].setAttribute('id','turtle'+id);
    turtle[id].style.position = 'absolute';
    turtle[id].style.background = 'transparent url(images/characters/turtles.png) no-repeat';
    turtle[id].style.backgroundSize = '571px 212px';
    turtle[id].style.backgroundPosition = '-20px -' + (8 + track*53.5) +'px';
    turtle[id].style.zIndex = '110';
    turtle[id].style.width = '56px';
    turtle[id].style.height = '34px';
    turtle[id].style.top = (418 - track* 28) + 'px';
    turtle[id].style.left = '80px';
    scene.appendChild(turtle[id]);
    console.log(turtle[id]);
    
    var posX = parseFloat(turtle[id].style.left);
    var i = 0;
    
    movea = function(){
        if (!run){
            posX += 3;

            turtle[id].style.left = posX + 'px';

            if(!turtlesprite[i]) i = 0;
            if(posX > distance) posX = distance;    

            turtle[id].style.backgroundPositionX = turtlesprite[i] + 'px';
            turtle[id].style.top = parseFloat(turtle[id].style.top) + (0.5*Math.sin(posX*0.2)) + 'px';
            
            socket.emit('sendPosition', {id: id, positionX: posX, positionY: parseFloat(turtle[id].style.top), positionSprite: turtlesprite[i] })
            i++;
            run = true;
        }
    };

    window.addEventListener('keyup', function(){
        run = false;
    });

    window.addEventListener('keydown', function(event){
        var code = event.keyCode
        switch(code) {
            case 75: 
            case 76: 
            movea();
            break;
            }
        });
    }

    // Function create others players turtles

    function CreateOthersTurtles(id, track){
    
        turtle[id] = document.createElement('div');
        turtle[id].setAttribute('id','turtle'+id);
        turtle[id].style.position = 'absolute';
        turtle[id].style.background = 'transparent url(images/characters/turtles.png) no-repeat';
        turtle[id].style.backgroundSize = '571px 212px';
        turtle[id].style.backgroundPosition = '-20px -' + (8 + track*53.5) +'px';
        turtle[id].style.zIndex = '110';
        turtle[id].style.width = '56px';
        turtle[id].style.height = '34px';
        turtle[id].style.top = (418 - track* 27) + 'px';
        turtle[id].style.left = '80px';
        scene.appendChild(turtle[id]);
        console.log(turtle[id]);
    }
    
    //------------------------------------
    //  socket.io
    //------------------------------------

    // selection avatar

    $('input[type="radio"]').on('change', function(){
        $(this).closest('fieldset').find('img').css('opacity','0.4')
        $(this).closest('label').find('img').css('opacity','1')
    })

    // players info panel

    var infoBoard = document.createElement('div')
    infoBoard.setAttribute('id', 'infoBoard');
    
    // stopwatch

    var currentTime;
    var timeformat = function(time){
        var min = Math.floor(time/1000/60);
        var sec = Math.floor(time/1000);
        var msec = time % 1000;
            
        if(min < 10) {
            min = "0" + min;
        }
        if(sec >= 60) {
            sec = sec % 60;
        }
        if(sec < 10) {
            sec = "0" + sec;
        }

        return min + ":" + sec + ":" + msec.toString().substring(0,2);
    };

    // Connect socket.io module

    var socket = io.connect(socketUrl);
        

    // Submit user information
    var usernameExist;

    $('#username').blur(function(){
            socket.emit('testusername', {username: $('#username').val()});
            socket.on('testUsernameResult', function(data){
                console.log(data);
                usernameExists = data.usernameExists;
                if (usernameExists === 1) {
                    $('#username').closest('label').find('#errorusername').css('display','block');
                    $('#username').focus(function(){
                        $(this).val('');
                        $(this).closest('label').find('#errorusername').css('display','none');
                    });
                } else {
                    $('#username').closest('label').find('#errorusername').css('display','none');
                }
            });
    });



    $('#userform').submit(function(event){
        event.preventDefault();

        if($('#username').val()!='' && $('input[name=avatar]:checked').val() != null && usernameExist !== 1){

            // Send user information

            socket.emit('createUser', {username: $('#username').val().trim(), avatar: $('#userform fieldset input[name=avatar]:checked').val()});
            theatre.stage.appendChild(infoBoard);
            
            $('#start').hide();
            // $('#infoBoard').append('<h3>Players :</h3>')



            socket.on('users', function(data){
                console.log(data);
                if(data.track !== null){
                    $('#infoBoard').append('<p id="inf' + data.id+ '"><img src="'+ avaPath + data.avatar + '.png" /><span class="player"> ' + data.username + ' - track ' + (data.track +1) + ' <span class="status"></span></span></p>')
                    CreateTurtle(data.id, data.track);
                };
            });
            socket.on('newuser', function(data){
                console.log(data);
                if(data.track !== null){
                    $('#infoBoard').append('<p id="inf' + data.id+ '"><img src="'+ avaPath + data.avatar + '.png" /><span class="player"> ' + data.username + ' - track ' + (data.track +1) + ' <button class="ready">ready</button></span></span></p>');
                    CreateOthersTurtles(data.id, data.track);
                };
            });
    
            // Update players position 

            socket.on('updatePosition', function(data){
                turtle[data.id].style.backgroundPositionX = data.positionSprite + 'px';
                turtle[data.id].style.left = data.positionX + 'px';
                turtle[data.id].style.top = data.positionY + 'px';
            });
    
            // disconnection handling

            socket.on('discusers', function(data){
                $('#inf'+data.id).remove();
                $('#turtle'+data.id).remove();
            });

               // display timer
    
            socket.on('timestamp', function (data) {
                $('#score').text(timeformat(data.timestamp));
            });

        } else{
            $('#userform .error').css('visibility','visible');
            return;
        };
    });
 
})();
