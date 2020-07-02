//* Variável background, hud, start
var fundo, hud, startBackground;
//* Variável webcam
var video;

//* Variável balões (vermelho, amarelo, verde, azul)
var balloon, index, balloons;
var redBalloon, blueBalloon, greenBalloon, yellowBalloon;
    //? Animações estouro, normal
    var redPop, bluePop, greenPop, yellowPop,
        redIdle, blueIdle, greenIdle, yellowIdle;
    //? Array pra armazenar 'labels' das animações
    var balloonPop = [], ballonIdle= [];
    //? Index dos sprites
    var index;

//* Variável bola
var spikeBall;
    //? Animação bola
    var spikeRoll;

//* Variável pontuação, cronometro, recorde
var pontos = 0, tempo = 60, record = 0;

//* Variável fonte
var pixeledFont;

//* Variável som
var popSound;

//* Variável classificador e resultado
var classifier;
var label;

//* Variável gameState
var gameState;

//! --- PRELOAD ---
function preload(){
    //! Carregar background e hud
    fundo = loadImage('sprites/fundo.png');
    hud = loadImage('sprites/hud.png');
    startBackground = loadImage('sprites/start.png');
    
    //! Carregar vídeo webcam
    video = createCapture(VIDEO);
    video.hide();
    video.size(160,120);

    //! Carregar fonte
    pixeledFont = loadFont('Pixeled.ttf');

    //! Carregar som
    soundFormats('mp3', 'ogg');
    popSound = loadSound('popSound.mp3');

   //! Carregar animações dos balões
   redPop = loadAnimation('sprites/balao/red/red1.png',
                          'sprites/balao/red/red2.png',
                          'sprites/balao/red/red3.png',
                          'sprites/balao/red/red4.png',
                          'sprites/balao/red/red5.png');

   redIdle = loadAnimation('sprites/balao/red/red1.png',
                           'sprites/balao/red/red1.png',
                           'sprites/balao/red/red1.png');

   bluePop = loadAnimation('sprites/balao/blue/blue1.png',
                           'sprites/balao/blue/blue2.png',
                           'sprites/balao/blue/blue3.png',
                           'sprites/balao/blue/blue4.png',
                           'sprites/balao/blue/blue5.png');

   blueIdle = loadAnimation('sprites/balao/blue/blue1.png',
                            'sprites/balao/blue/blue1.png',
                            'sprites/balao/blue/blue1.png');

   greenPop = loadAnimation('sprites/balao/green/green1.png',
                            'sprites/balao/green/green2.png',
                            'sprites/balao/green/green3.png',
                            'sprites/balao/green/green4.png',
                            'sprites/balao/green/green5.png');

   greenIdle = loadAnimation('sprites/balao/green/green1.png',
                             'sprites/balao/green/green1.png',
                             'sprites/balao/green/green1.png');

   yellowPop = loadAnimation('sprites/balao/yellow/yellow1.png',
                             'sprites/balao/yellow/yellow2.png',
                             'sprites/balao/yellow/yellow3.png',
                             'sprites/balao/yellow/yellow4.png',
                             'sprites/balao/yellow/yellow5.png');

   yellowIdle = loadAnimation('sprites/balao/yellow/yellow1.png',
                              'sprites/balao/yellow/yellow1.png',
                              'sprites/balao/yellow/yellow1.png');

   //! Carregar animação da bola
   spikeRoll = loadAnimation('sprites/spike/spike1.png', 'sprites/spike/spike1.png',
                             'sprites/spike/spike2.png',
                             'sprites/spike/spike3.png',
                             'sprites/spike/spike4.png', 'sprites/spike/spike4.png');

    //! Carregar classificador
    classifier = ml5.imageClassifier('https://storage.googleapis.com/tm-model/h9y28mqRl/model.json')
}

//! --- SETUP ---
function setup(){
    createCanvas(640, 480);
    balloons = new Group();

    spikeBall = createSprite(200,200, 60, 60);
    spikeBall.setCollider('circle', 0,0, 18);
    spikeBall.addAnimation('spikeRoll', spikeRoll);

    LoadBalloon();

    ClassifyVideo();

    //gameState = 'start';
    //index = Math.round(random(0,4));
    //console.log(index);
}

//! --- DRAW ---
function draw(){

    clear();
    noSmooth();
    background(fundo);

    //* Movimentação
    Move();
    
    //* Colisão
    spikeBall.overlap(balloons, BalloonRemoved);

    //* Cronômetro
    Timer();
    
    //spikeBall.debug = mouseIsPressed;
    //balloons[0].debug = mouseIsPressed;

    drawSprites();

    //* Webcam
    Webcam();
    
    //* Texto
    HUDText();
    
}

function LoadBalloon(){
    balloon = createSprite(Math.round(random(210, 610)), Math.round(random(60, 430)), 60, 80);
    index = Math.round(random(0, 3));
    
    console.log(index);
    balloon.addAnimation('redPop', redPop);
    balloon.addAnimation('bluePop', bluePop);
    balloon.addAnimation('greenPop', greenPop);
    balloon.addAnimation('yellowPop', yellowPop);
    balloon.addAnimation('redIdle', redIdle);
    balloon.addAnimation('blueIdle', blueIdle);
    balloon.addAnimation('greenIdle', greenIdle);
    balloon.addAnimation('yellowIdle', yellowIdle);
    

    balloonPop = ['redPop', 'bluePop', 'greenPop', 'yellowPop'];
    balloonIdle = ['redIdle', 'blueIdle', 'greenIdle', 'yellowIdle'];

    balloon.changeAnimation(balloonIdle[index]);
    balloon.setCollider('circle', 0, 0, 40);

    balloons.add(balloon);
    
    balloon.onMousePressed = function(){
        this.changeAnimation(balloonPop[index]);
        this.life = 21;
        pontos++;
        LoadBalloon();
    };
}

function BalloonRemoved(char, balloon){
    balloon.animation.looping = false;
    
    if(balloon.animation.getFrame() == 4){
        pontos++;
        balloon.remove();
        popSound.play();
        LoadBalloon();
    }
    balloon.changeAnimation(balloonPop[index]);
}

function Move(){
    /*
    if(keyDown('RIGHT_ARROW')) spikeBall.velocity.x = 5;
    if(keyDown('LEFT_ARROW')) spikeBall.velocity.x = -5;
    if(keyDown('UP_ARROW')) spikeBall.velocity.y = -5;
    if(keyDown('DOWN_ARROW')) spikeBall.velocity.y = 5;
    */
    if(label == 'up') spikeBall.velocity.y = -5;
    else if(label == 'down') spikeBall.velocity.y = 5;
    else if(label == 'right') spikeBall.velocity.x = 5;
    else if(label == 'left') spikeBall.velocity.x = -5;
    else if(label == 'idle'){
        spikeBall.velocity.x = 0;
        spikeBall.velocity.y = 0;
    }
    spikeBall.friction = 0.4; //* ATRITO

    //* Manter a bola no canvas no eixo x
    if(spikeBall.position.x <= 140) spikeBall.position.x = 660;
    else if(spikeBall.position.x >= 660) spikeBall.position.x = 140;
    
    //* Manter a bola no canvas no eixo y
    if(spikeBall.position.y <= -15) spikeBall.position.y = 495;
    else if(spikeBall.position.y >= 495) spikeBall.position.y = -15;
}

function Timer(){
    if(frameCount % 60 == 0 && tempo > 0){
        tempo--
    } else if(tempo == 0){
        tempo = 60;
        if(pontos > record) record = pontos;
        pontos = 0;
    }
}

function Webcam(){
    //! Imagem HUD
    image(hud,0,0);

    //! Webcam
    push();
    translate(video.width, 0);
    scale(-1, 1);
    image(video, -1,1);
    pop();
}

function HUDText(){
    fill(0);
    textSize(20);
    textFont(pixeledFont);
    //! Pontos
    text(pontos.toString(), 80, 244);
    //! Recorde
    text(record.toString(), 80, 334);
    //! Tempo
    text(tempo.toString(), 80, 424);
}

function ClassifyVideo(){
    classifier.classify(video, GotResults)
}

function GotResults(error, results){
    if(error){
        console.error(error);
    }
    //console.log(results[0].label);
    label = results[0].label;
    ClassifyVideo();
}
