(function (){ 

//------------------------------------
// introduction panel - Game info
//------------------------------------

// buttons handling content scroll moving up on click

var score = 0;
// var life = 3;
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

// Reducing opacity info panel and trigger the game 

startit.addEventListener('click', function(event){
    event.preventDefault();
    var start = document.getElementById('start');
    var startit = document.getElementById('startit');
    var section2 = document.getElementById('section2')
    var i = 1.5;
    
    var changeOpacity = setInterval( function(){
    start.style.opacity = i.toFixed(1);
    if(i.toFixed(1) == -1.5){
        window.clearInterval(changeOpacity);
        start.style.display = 'none';
        start.style.left = '200px';
        section2.style.display = 'none';
        var playerInfo = document.getElementById('playerinfo');
        playerInfo.style.visibility = 'visible';
         startGame();
    }
        i = i - 0.1;
        },50)
}, false);


//------------------------------------
// Start Game
//------------------------------------

function startGame(){
    
// temporary variables
    
// variables initialisation
    
    var allSprites = [];
    var stopVillain = '';
    
    var direction = {
        toLeft : false,
        toRight : false,
        toJump : false,
        stopToLeft: '',
        stopToRight: '',
        scaleX : 1
    };
    
    var heroM = window.document.getElementById('heroM');
    var heroSprite = window.document.getElementById('heroSprite');

    var centerSprite = window.document.getElementById('centerSprite');
    var centerSpriteStyle = window.getComputedStyle(centerSprite);

      centerSprite.style.width = '100px';
      centerSprite.style.height = '80px';
      centerSprite.style.position = 'absolute';
      centerSprite.style.overflow = 'hidden';
      centerSprite.style.top = '370px';
      centerSprite.style.left = '400px';
      centerSprite.style.zIndex = "140";
      // centerSprite.style.border = "1px solid yellow";

      heroM.style.bottom = '0px';
      heroM.style.left = '0px';
      heroM.style.width = '0px';
      heroM.style.height = '0px';
      heroM.style.position = 'relative';
      heroM.style.overflow = 'hidden';
      heroM.style.margin = '0 auto';
      // heroM.style.border = '1px solid red';

      // heroM.style.border = '1px solid blue';

      heroSprite.style.top = '0px';
      heroSprite.style.left = '0px';
      heroSprite.style.position = 'absolute';
     //  heroSprite.style.border = '1px solid green';
    
    var motion = "stand";

// variable to control elements widths and sprites    
    
    var theatre = {
        stage : document.getElementById('gameCanvas'),
        scenery : document.getElementById('scene'),
        stageStyle : window.getComputedStyle(document.getElementById('gameCanvas')),
        sceneryStyle : window.getComputedStyle(document.getElementById('scene'))
    };
    
	var posSceneX = parseFloat(theatre.sceneryStyle.left);
	var maxRight = parseFloat(theatre.sceneryStyle.width) - parseFloat(theatre.stageStyle.width);

// Background parallax

    var decors = {
        clouds : document.getElementById("clouds"),
        mountains : document.getElementById("mountains"),
        mountainsShadow : document.getElementById("mountainsShadow"),
        mountainsStyle : window.getComputedStyle(document.getElementById("mountains")),
        cloudsStyle : window.getComputedStyle(document.getElementById("clouds")),
        mountainsShadowStyle : window.getComputedStyle(document.getElementById("mountainsShadow"))
    };
	
// Collision testing function (rectangles)
    
    function collision(element1, element2) {
        var testCollision=  !(element2.lmtLeft > element1.lmtRight || 
        element2.lmtRight < element1.lmtLeft || 
        element2.lmtTop > element1.lmtBottom ||
        element2.lmtBottom < element1.lmtTop);
//        if(testCollision){console.log(element2.lmtLeft + ' : ' + element1.lmtRight + ' - ' + element2.lmtRight + ' : ' + element1.lmtLeft + ' - ' + element2.lmtTop + ' : ' + element1.lmtBottom + ' - ' + element2.lmtBottom + ' : ' + element1.lmtTop )};
        return testCollision;
    }
    
	decors.mountains.style.left = decors.mountainsStyle.left;
    decors.mountainsShadow.style.left = decors.mountainsShadowStyle.left;
    decors.clouds.style.left = decors.cloudsStyle.left;
    // console.log(maxRight + " mySceneWidth" + mySceneWidth); 

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

// play sounds

    // main music
    
//    var myAudio = new Audio('sounds/POL-starry-night-short.mp3'); 
//    myAudio.addEventListener('play', function(){
//        this.currentTime = 0;
//        this.volume = 0.1;
//        this.loop = true;
//        this.play();
//    }, false);
// myAudio.play();
//
//window.onclick = function(){
//    myAudio.pause();
//    myAudio.currentTime = 0;
//}

function PlaySound(path) {
  var audioElement = document.createElement('audio');
  audioElement.setAttribute('src', path);
  audioElement.play();
}    

// Testing elements

//var explosion = document.createElement('div');
//
//explosion.setAttribute('class', 'explosion');
//explosion.style.width = '10px';
//explosion.style.height = '10px';
////explosion.style.backgroundColor = 'blue';
//explosion.style.zIndex = '200';
//explosion.style.position = 'absolute';
//explosion.style.top = '200px';
//explosion.style.left = '-200px';
//
//theatre['scenery'].appendChild(explosion);
    
// sprite objects
    
    var charSprite = {
        x: 0,
        y: 0,
        xWidth: 0,
        yWidth: 0,
        srcX: 0,
        srcY: 0,
        srcWidth: 0,
        srcHeight: 0,
        lmtLeft: 0,
        lmtTop: 0,
        lmtRight: 0,
        lmtBottom: 0
    }
    
    // Main character object
    
    var hero = Object.create(charSprite);
    hero.velocity = 8;
    hero.xWidth = parseFloat(centerSprite.style.width);
    hero.srcWidth = 60;
    hero.y = 375;
    hero.x = 400;

//------------------------------------
// trigger motions
//------------------------------------
    
// Move left    
    
    hero.left = function moveLeft(){
            motion = "run";
             direction.scaleX = -1;
            
         if (direction.toLeft === false) {
          direction.toLeft = function(){
              
//            if (refScene <400 || refScene > mySceneWidth -400){
//                moveTo.style.left = (parseFloat(moveTo.style.left) - 4) + 'px';
//                if (parseFloat(moveTo.style.left) <=40){
//                    moveTo.style.left = 40 + 'px'
//                }
//            }
//              else {
             if (posSceneX >= 0)	{posSceneX = 0} else {
                posSceneX += hero.velocity;
                theatre.scenery.style.left = posSceneX + 'px';
                decors.mountains.style.left = (parseFloat(decors.mountains.style.left) + 1) + "px";
                decors.mountainsShadow.style.left = (parseFloat(decors.mountainsShadow.style.left) + 0.5) + "px";
                decors.clouds.style.left = (parseFloat(decors.clouds.style.left) + 0.05) + "px";
                hero.x = (parseFloat(centerSpriteStyle.left) - parseFloat(theatre.scenery.style.left));
                hero.y = parseFloat(centerSprite.style.top);  
                hero.lmtLeft = hero.x + Math.floor((hero.xWidth - hero.srcWidth)/2);
                hero.lmtTop = hero.y;
                // console.log (hero.x + ' - ' + hero.y); 
                }
              direction.stopToLeft = requestAnimationFrame(direction.toLeft);
            }
          direction.toLeft();
            }
        }
// Move right
    
    hero.right = function(){
            direction.scaleX = 1;
            var distMax = parseFloat(theatre.sceneryStyle.width) - (parseFloat(theatre.sceneryStyle.width)%(hero.velocity)) - ( parseFloat(theatre.stageStyle.width) - parseFloat(theatre.stageStyle.width)%(hero.velocity));
            motion = "run";
            if (direction.toRight === false) {
              direction.toRight = function(){
                
                // if end of the screen and top score (40) display victory panel 
                  
                if (posSceneX <= -distMax){ 
                    posSceneX = -distMax;
                    if(score == 40 ){
                        start.style.display = 'block';
                        start.style.opacity = '1'};
                    } else { 
                    posSceneX -= hero.velocity;
                    theatre.scenery.style.left = posSceneX + 'px';
                    decors.mountains.style.left = (parseFloat(decors.mountains.style.left) - 1) + "px";
                    decors.mountainsShadow.style.left = (parseFloat(decors.mountainsShadow.style.left) - 0.5) + 'px';
                    decors.clouds.style.left = (parseFloat(decors.clouds.style.left) - 0.05) + "px";
                    }
                  
                hero.x = (parseFloat(centerSpriteStyle.left) - parseFloat(theatre.scenery.style.left));
                hero.y = parseFloat(centerSprite.style.top);
                hero.lmtLeft = hero.x + Math.floor((hero.xWidth - hero.srcWidth)/2);
                hero.lmtTop = hero.y;
                // console.log (hero.x + ' : ' + hero.y) ;  
               
                // if (hero.x ===1000) {villain('mush','walk',2, -3000, 415);} 
                
                  
             direction.stopToRight = requestAnimationFrame(direction.toRight);
              }
              direction.toRight();
            }
        }
    
// Knife attack
    
    hero.attack = function(){
            
        motion = 'attack';
        PlaySound('/jsgame/sounds/arrow.mp3');

        // throw knives

        // console.log((parseFloat(theatre.scenery.style.left)));
        var knife = document.createElement('div');
        knife.setAttribute('class', 'knife');
        knife.style.position = 'absolute';
        knife.style.width = '17px';
        knife.style.height = '6px';
        // knife.style.border = '1px solid blue';
        knife.style.left = ( -(parseFloat(theatre.sceneryStyle.left)) + parseFloat(centerSprite.style.left) + 46) + "px";
        knife.style.top = (parseFloat(centerSprite.style.top) + 38) + "px";
        theatre.scenery.appendChild(knife);

        if (direction.scaleX === 1){

            function throwknife(){

            knife.style.left = (parseFloat(knife.style.left) + 12) + "px";

            // if certain distance, remove knife from DOM
            var stop = requestAnimationFrame(throwknife);
            if (Math.abs(parseFloat(knife.style.left)) >= -(parseFloat(theatre.scenery.style.left)) + 1000){
                cancelAnimationFrame(stop);
                // console.log('stop knife');
                knife.parentNode.removeChild(knife);
                // console.log('delete knife');
           }
        }
           throwknife();
            } else {
            knife.setAttribute("class", "knife reverse");
                function throwknife(){

            knife.style.left = (parseFloat(knife.style.left) - 12) + "px";

                // if certain distance remove knife from DOM
                var stop = requestAnimationFrame(throwknife);

                if (Math.abs(parseFloat(knife.style.left)) >= -(parseFloat(theatre.scenery.style.left)) + 800){
                cancelAnimationFrame(stop);
                // console.log('stop knife');
                knife.parentNode.removeChild(knife); 
                // console.log('delete knife');
                }
            };
        throwknife();
        }
    }
// Jump
    
    hero.jump = function(){   
        motion = "jump";
        
        // parabolic function to animate jump
        
        var i= -100;
        function jumphigh(){
        centerSprite.style.top = 255 + Math.floor(((i*i*0.1))/8) + 'px';
        i = i + 4;
        hero.x = (parseFloat(centerSpriteStyle.left) - parseFloat(theatre.scenery.style.left));
        hero.y = parseFloat(centerSprite.style.top);      
        direction.toJump = true;
        var myLoop = requestAnimationFrame(jumphigh);
        if (i >= 100){
           cancelAnimationFrame(myLoop);
          direction.toJump = false; 
            }
        }
        if (direction.toJump === false) {
            jumphigh();  
        }
    };
    hero.stand = function(){
        motion = "stand";   
    };

    // window.setInterval(function(){explosion.style.left = hero.lmtLeft() +  'px'; explosion.style.top = hero.lmtTop() + 'px'}, 1)
    
//------------------------------------
// Characters sprites positions data
//------------------------------------

// Hero sprites movements

var character = {
    stand:{
        interval: 20,
        repeat: true,
        coords:
            [
                [40, 68,-2,-58]//,
                //[40, 68,-49,-58],
                //[40, 68,-101,-58],
                //[40, 68,-154,-58],
                //[40, 68,-205,-58],
                //[40, 68,-257,-58]
            ]
        },
    run:{
        interval: 30,
        repeat: true,
        coords:
            [
                [39,67,-7,-452],
                [40,67,-57,-452],
                [45,67,-106,-452],
                [47,67,-157,-452],
                [49,67,-219,-452],
                [43,67,-285,-452],
                [39,67,-344,-452],
                [40,67,-397,-452],
                [42,67,-448,-452],
                [43,67,-506,-452],
                [43,67,-562,-452],
                [44,67,-618,-452],
                [42,67,-671,-452],
                [41,67,-730,-452]
            ]
        },
    jump: {
        interval: 30,
        repeat: false,
        coords:
            [
                [40, 68,-2,-58],
                [39,67,-8,-136],
                [41,72,-59,-136],
                [43,71,-110,-136],
                [44,69,-162,-136],
                [48,72,-214,-135],
                [49,67,-280,-135],
                [46,68,-348,-136]
            ]
        },
    attack: {
        interval: 30,
        repeat: false,
        coords:
            [
                [44,65,-10,-374],
                [45,65,-62,-374],
                [51,66,-116,-373],
                [55,66,-172,-374],
                [60,66,-235,-374],
                [64,66,-302,-372]//,
                //[52,66,-367,-374]
            ]
        },
    die: {
        interval: 30,
        repeat: false,
        coords:
            [
                [70,68,-363,-292],
                [70,68,-275,-292],
                [70,68,-197,-292],
                [70,68,-124,-292],
                [70,68,-68,-292],
                [70,68,-8,292]
            ]}
        };

// Villains
    
var villains = {
    stork : {
    fly:{
        interval: 115,
        repeat: true,
        coords:
            [
                [124,98,-20,0],
                [124,98,-163,0],
                [124,98,-300,0],
                [124,98,-443,0],
                [124,98,-20,-113],
                [124,98,-163,-113],
                [124,98,-300,-113],
                [124,98,-443,-113]
            ]
        }
    },
    eagle : {
    fly:{
        interval: 115,
        repeat: true,
        coords:
            [
                [93,80,-178,-115],
                [93,80,-270,-115],
                [93,80,-377,-115],
                [93,80,-476,-115],
       
            ]
        }
    },
    mush : {
    walk:{
        interval: 115,
        repeat: true,
        coords:
            [
                [48,32,-96,-17],
                [49, 32, -154, -17],
                [48, 32, -211, -17],
                [48, 32, -266, -17],
                [48, 32, -331, -17],
                [48, 32, -394, -17],
                [49, 32, -454, -17],
                [48, 32, -511, -17]
            ]
        }
    },
    armturtle : {
    walk:{
        interval: 115,
        repeat: true,
        coords:
            [
                [55, 34, -9, -394],
                [55, 34,-77,-394],
                [55, 34,-146,-394],
                [55, 34,-214,-394],
                [55, 34,-284,-394],
                [55, 34,-356,-394],
                [55, 34,-421,-394],
                [55, 34,-496,-394]
            ]
        }
    },
    paladin : {
    walk: {
        interval: 115,
        repeat: true,
        coords:[
            [76, 89,-1489, -569],
            //[77, 88, -1379, -570],
            [77, 86, -1284, -572],
            //[75, 85, -1179, -573],
            [73, 84, -1087, -574],
            //[75, 85, -983, -573],
            [77, 86, -883, -572],
            //[77, 88, -788, -570],
            [77, 89, -691, -569],
            //[75, 86, -593, -572],
            [74, 84, -497, -574],
            //[72, 84, -385, -574],
            [74, 83, -291, -576],
            //[74, 84, -204, -574],
            [74, 84, -112, -574]
            ]
        }
    }  
}

// main character animation engine

  var x = 0;
  
    function spriteAnim(){

  
    // console.log(motion);  
    heroM.style.transform = 'scaleX('+ direction.scaleX+')';
    
          if (x >= character[motion].coords.length) {
      x = 0;
    }
    heroM.style.width = character[motion].coords[x][0] + "px";
    heroM.style.height = character[motion].coords[x][1] + "px";
    hero.srcWidth = parseFloat(heroM.style.width);
    // hero.srcX = hero.x + Math.floor((hero.xWidth - hero.srcWidth)/2)
  
    heroSprite.style.left = character[motion].coords[x][2] + "px";
    heroSprite.style.top = character[motion].coords[x][3] + "px";
    x++;
    hero.lmtRight = parseFloat(hero.lmtLeft) + parseFloat(heroM.style.width);
    hero.lmtBottom = parseFloat(hero.lmtTop) + parseFloat(heroM.style.height);
        var stopAnim = requestAnimationFrame(spriteAnim);
        }
    requestAnimationFrame(spriteAnim)
    
    // Enemies animation engine
    
    var villain = function(choose, move, speed, posX, posY){

    var speed = speed || 5;
    var foe = document.createElement('div');
    var foeSprite = document.createElement('div')
    var img = document.createElement('img');
    img.setAttribute('class', choose);
    
    if (choose!== 'stork'){
        img.src = '/jsgame/images/characters/sprites_villains.png';
        img.style.width = "1574px";
        img.style.height = "679px";
    } else if(choose === 'stork'){
        img.src = '/jsgame/images/characters/'+ choose +'.png';
        img.style.width = "554px";
        img.style.height = "215px";
    }
    
    img.style.position = "absolute";
    img.style.display = "block";
    
    foeSprite.setAttribute('class', 'foeSprite');
    foe.setAttribute('class', 'foe');
    theatre.scenery.appendChild(foe);
    foe.appendChild(foeSprite);
    foeSprite.appendChild(img);

    foe.style.width = '140px';
    foe.style.height = '100px';
    foe.style.position = 'absolute';
    foe.style.overflow = 'hidden';
    foe.style.top = '200px';
    foe.style.left = parseFloat(theatre.stageStyle.width) + posX + "px";
    foe.lmtLeft = 0;
    foe.lmtTop = 0;
    foe.lmtRight = 0;
    foe.lmtBottom = 0;
    // foe.style.border = '1px solid red';

    foe.style.zIndex = "160";
    // foe.style.border = '1px solid yellow';

    foeSprite.style.bottom = '0px';
    foeSprite.style.left = '0px';
    foeSprite.style.width = '0px';
    foeSprite.style.height = '0px';
    foeSprite.style.position = 'relative';
    foeSprite.style.overflow = 'hidden';
    foeSprite.style.margin = '0 auto';
    // foeSprite.style.border = '1px solid red';

    var y = 0;
    
    var villainAnim = window.setInterval(function(){
        
    if (y >= villains[choose][move].coords.length) {
      y = 0;
    }
    foeSprite.style.width = villains[choose][move].coords[y][0] + "px";
    foeSprite.style.height = villains[choose][move].coords[y][1] + "px";
    img.style.left = villains[choose][move].coords[y][2] + "px";
    img.style.top = villains[choose][move].coords[y][3] + "px"; 
    y++;

  }, 80);  

    var villainX = parseFloat(theatre.stageStyle.width) + 100;

    function moveVillain(){
        villainX -= speed;
        foe.style.left = parseFloat(theatre.sceneryStyle.width) + villainX + posX + "px";
        foe.style.top = posY + (move === 'fly' ? (40*Math.sin(villainX*0.01)) : (1.5*Math.sin(villainX*0.2))) + "px";
        
        foe.lmtLeft = parseFloat(foe.style.left) + ((parseFloat(foe.style.width) - Math.floor(parseFloat(foeSprite.style.width)))/2) ;
        foe.lmtTop = parseFloat(foe.style.top);
        foe.lmtRight = parseFloat(foe.style.left) + ((parseFloat(foe.style.width) - Math.floor(parseFloat(foeSprite.style.width)))/2) + parseFloat(foeSprite.style.width);
        
        foe.lmtBottom = posY + (move === 'fly' ? (40*Math.sin(villainX*0.01)) : (1.5*Math.sin(villainX*0.2))) + parseFloat(foeSprite.style.height);
        

        //200
        // console.log(foe.style.left);
        var stopVillain = requestAnimationFrame(moveVillain);
        
        
        if(villainX < -(parseFloat(theatre.sceneryStyle.width)+200 + posX)){
            
             villainX = 0;
//            cancelAnimationFrame(stopVillain);
//            console.log('Ca marche!')
//            foe.parentNode.removeChild(foe);
//            console.log('Foe removed')
        };
    };
    requestAnimationFrame(moveVillain);
      var lifeNumber = document.getElementById('life');    

var stopTestHeroFoe;        
function testHeroFoe(){
        if(collision(hero, foe)){
            
            
            // life = life -1;
            // lifeNumber.innerHTML = life;
            // console.log(foe.lmtLeft + ' - ' + hero.lmtRight);
            var count = 0;
            var bool = true;
            var blinking = setInterval(function(){
                direction.toJump = true;
                direction.toRight = true;
                direction.toLeft = true;
                motion = 'stand';
                
                if(bool == true){
                    heroM.style.visibility = 'hidden'; 
                    // skills.style.visibility = 'hidden';
                    bool = false;
                }
                else{
                    heroM.style.visibility = 'visible'; 
                    // skills.style.visibility = 'visible';
                    bool = true;
                }
                if(count == 12){
                    heroM.style.visibility = 'visible';
                    clearInterval(blinking);
                    
                    direction.toJump = false;
                    direction.toRight = false;
                    direction.toLeft = false;
                    
                }
                count++;
                // console.log(count);
            }, 100);
            cancelAnimationFrame(stopTestHeroFoe);
        } 
    stopTestHeroFoe = requestAnimationFrame(testHeroFoe);
    } 
    requestAnimationFrame(testHeroFoe);    
}

    
    
//  Enemies creation
    
    villain('stork','fly',5, 300, 50);
    villain('stork','fly',6, 600, 80);
    villain('eagle','fly',8, 500, 150);
    villain('eagle','fly',7, 800, 250);
    villain('mush','walk',1, 0, 415);
    
    villain('mush','walk',2, 0, 415);
    villain('paladin','walk',3, 0, 355);
    villain('armturtle','walk',0.5, 300, 410);
    villain('armturtle','walk',2, 600, 410);
    villain('paladin','walk',2, 200, 355);

//------------------------------------
// Treasure box
//------------------------------------

var addThings = function(what, leftPos, topPos, counter){
    
    var things = document.createElement('div');
    var thingsImg = document.createElement('img');
        if (what == 'goldbox'){
            things.style.width = "49px";
            things.style.height = "48px";
            
            thingsImg.src = "/jsgame/images/objects/goldbox.png";
            thingsImg.style.width = '49px';
            thingsImg.style.height = '48px';
        }
        
        things.style.zIndex = '130';
        things.style.position = "absolute";
        // things.style.border = '1px solid red';
        things.style.top = topPos + "px";
        things.style.left = leftPos + "px";
        theatre.scenery.appendChild(things);
        things.appendChild(thingsImg);
         
          
        var thingsLimit = {
            lmtLeft: leftPos,
            lmtTop: topPos,
            lmtRight: leftPos + parseFloat(things.style.width),
            lmtBottom: topPos + parseFloat(things.style.height)            
        }
        
        // console.log(thingsLimit.lmtLeft + " : " +thingsLimit.lmtTop  + " : "  + thingsLimit.lmtRight + " : " + thingsLimit.lmtBottom);
    
        var skills = document.createElement('div');
        skills.style.position = 'absolute';
        skills.style.left = 20 + (counter* 50) +'px';
        skills.style.top = '20px';
        skills.style.width = '41px';
        skills.style.height = '41px';
        skills.style.backgroundImage = 'url(/jsgame/images/objects/skills.png)';
        skills.style.backgroundPositionX = (counter) * -40 + 'px';
        skills.style.backgroundPositionY = '0';
        skills.style.backgroundSize = '405px 41px';
        skills.style.visibility = 'hidden';
        
    
        skills.style.zIndex = 140;
        theatre.stage.appendChild(skills);
        
        // when character touch treasure chest, blink and display skill
    
        var testCollision = setInterval(function(){
            // if(hero.lmtLeft && hero.lmtRight && hero.lmtTop && hero.lmtBottom){
            
            //    console.log(hero.lmtLeft + ' - ' + hero.lmtTop);
                
            if(collision(hero, thingsLimit)){
            clearInterval(testCollision);
            var bool = true; 
            var count = 0;
            var scorenumber = document.getElementById('score');
            score += 5;
            
            PlaySound('/jsgame/sounds/coin.mp3');
            var blinking = setInterval(function(){
                
                if(bool == true){
                    things.style.visibility = 'hidden'; 
                    // skills.style.visibility = 'hidden';
                    bool = false;
                }
                else{
                    things.style.visibility = 'visible'; 
                    // skills.style.visibility = 'visible';
                    bool = true;
                }
                if(count == 12){
                    clearInterval(blinking);
                    things.parentNode.removeChild(things);
                    
                    skills.style.visibility = 'visible';
                    scorenumber.textContent = score;
                }
                count++;
                // console.log(count);
            }, 70);
            }
            // }
        }, 1);
    };

//------------------------------------
// Automate treasure chests 
//------------------------------------

    var collect = {
        objects: [
            ['goldbox', 600, 395],
            ['goldbox', 1000, 395],
        
            ['goldbox', 1600, 395],
            ['goldbox', 2000, 395],
            ['goldbox', 2200, 395],
        
            ['goldbox', 2700, 395],
            ['goldbox', 3100, 395],
            ['goldbox', 3700, 395]
        ]
    }
    
    for (var z = 0; z < collect.objects.length; z++){
        addThings(collect.objects[z][0], collect.objects[z][1], collect.objects[z][2], z)
    }

//------------------------------------
// Keys control
//------------------------------------

// Stop character animation from keys release
    
  window.addEventListener('keyup', function(event){
    cancelAnimationFrame(direction.stopToLeft);
    cancelAnimationFrame(direction.stopToRight);
     
    direction.toLeft = false;
    direction.toRight = false;
    direction.toJump = false;
    motion = "stand"
  });

// Keys down control for main character

  window.addEventListener('keydown', function(event){

    var code = event.keyCode;
    switch (code) {
      case 37:
        // move left (key "Arrow left")
        hero.left();
        break;
    
        case 83:
        // jump (key "D")
        hero.jump();    
        break;

        case 39:
        // move right (key "Arrow right")
        hero.right();
        break;

        case 68:
        // Knive attack (key "F")
        hero.attack();
        break;

        default:
        hero.stand();
      }
  });	
};

})();