/*global Phaser*/
/* activity shows a bouncing ball */

var game = new Phaser.Game(600, 400, Phaser.AUTO, 'TutContainer', { preload: preload, create: create, update:update });

//level array
var levelData=
[[1,1,1,1,1,1],
[1,0,0,0,0,1],
[1,0,0,0,0,1],
[1,0,0,0,0,1],
[1,0,0,0,0,1],
[1,1,1,1,1,1]];

var tileWidth=50;// the width of a tile
var borderOffset = new Phaser.Point(250,50);//to centralise the isometric level display
var wallGraphicHeight=98;
var floorGraphicWidth=103;
var floorGraphicHeight=53;
var wallHeight=wallGraphicHeight-floorGraphicHeight; 
var ballOffset=new Phaser.Point(30,12);
var shadowOffset=new Phaser.Point(30,16);
var ball2DVolume=new Phaser.Point(30,30);
var bmpText;//title text
var normText;//text to display hero coordinates
var gameScene;//we do not need a render texture here, we could just add items are sprites once & totally get rid of the redraw for this example
var floorSprite;
var wallSprite;
var ballSprite;
var ballShadowSprite;
var ballMapTile=new Phaser.Point(2,2);
var ballMapPos;

var zValue=100;
var gravity=-1;
var incrementValue=0;

function preload() {
    //load all necessary assets
    game.load.bitmapFont('font', 'assets/font.png', 'assets/font.xml');
    game.load.image('ballShadow', 'assets/ball_shadow.png');
    game.load.image('floor', 'assets/floor.png');
    game.load.image('wall', 'assets/block.png');
    game.load.image('ball', 'assets/ball.png');
}

function create() {
    bmpText = game.add.bitmapText(10, 10, 'font', 'Projectile Tutorial', 18);
    normText=game.add.text(10,360,"Press X to bounce again.");
    game.stage.backgroundColor = '#cccccc';
    //we draw the depth sorted scene into this render texture
    gameScene=game.add.renderTexture(game.width,game.height);
    game.add.sprite(0, 0, gameScene);
    floorSprite= game.make.sprite(0, 0, 'floor');
    wallSprite= game.make.sprite(0, 0, 'wall');
    ballSprite= game.make.sprite(0, 0, 'ball');
    ballShadowSprite= game.make.sprite(0, 0, 'ballShadow');
   
    createLevel();
}

function update(){
    if(game.input.keyboard.isDown(Phaser.Keyboard.X)){
        zValue=100;
    }
    incrementValue-=gravity;
    zValue-=incrementValue;
    if(zValue<=0){
        zValue=0;
        incrementValue*=-1;
    }
    renderScene();
}

function createLevel(){
    ballMapPos=new Phaser.Point(ballMapTile.y * tileWidth, ballMapTile.x * tileWidth);
    ballMapPos.x+=(tileWidth/2);
    ballMapPos.y+=(tileWidth/2);
    ballMapTile=getTileCoordinates(ballMapPos,tileWidth);
    renderScene();//draw once the initial state
}
function renderScene(){
    gameScene.clear();//clear the previous frame then draw again
    var tileType=0;
    for (var i = 0; i < levelData.length; i++)
    {
        for (var j = 0; j < levelData[0].length; j++)
        {
            tileType=levelData[i][j];
            drawTileIso(tileType,i,j);
            if(i==ballMapTile.y&&j==ballMapTile.x){
                drawBallIso();
            }
        }
    }
}
function drawBallIso(){
    var isoPt= new Phaser.Point();//It is not advisable to create points in update loop
    var ballCornerPt=new Phaser.Point(ballMapPos.x-ball2DVolume.x/2,ballMapPos.y-ball2DVolume.y/2);
    isoPt=cartesianToIsometric(ballCornerPt);//find new isometric position for hero from 2D map position
    gameScene.renderXY(ballShadowSprite,isoPt.x+borderOffset.x+shadowOffset.x, isoPt.y+borderOffset.y+shadowOffset.y, false);//draw shadow to render texture
    gameScene.renderXY(ballSprite,isoPt.x+borderOffset.x+ballOffset.x, isoPt.y+borderOffset.y-ballOffset.y-zValue, false);//draw hero to render texture
}
function drawTileIso(tileType,i,j){//place isometric level tiles
    var isoPt= new Phaser.Point();//It is not advisable to create point in update loop
    var cartPt=new Phaser.Point();//This is here for better code readability.
    cartPt.x=j*tileWidth;
    cartPt.y=i*tileWidth;
    isoPt=cartesianToIsometric(cartPt);
    if(tileType==1){
        gameScene.renderXY(wallSprite, isoPt.x+borderOffset.x, isoPt.y+borderOffset.y-wallHeight, false);
    }else{
        gameScene.renderXY(floorSprite, isoPt.x+borderOffset.x, isoPt.y+borderOffset.y, false);
    }
}
function cartesianToIsometric(cartPt){
    var tempPt=new Phaser.Point();
    tempPt.x=cartPt.x-cartPt.y;
    tempPt.y=(cartPt.x+cartPt.y)/2;
    return (tempPt);
}
function isometricToCartesian(isoPt){
    var tempPt=new Phaser.Point();
    tempPt.x=(2*isoPt.y+isoPt.x)/2;
    tempPt.y=(2*isoPt.y-isoPt.x)/2;
    return (tempPt);
}
function getTileCoordinates(cartPt, tileHeight){
    var tempPt=new Phaser.Point();
    tempPt.x=Math.floor(cartPt.x/tileHeight);
    tempPt.y=Math.floor(cartPt.y/tileHeight);
    return(tempPt);
}
function getCartesianFromTileCoordinates(tilePt, tileHeight){
    var tempPt=new Phaser.Point();
    tempPt.x=tilePt.x*tileHeight;
    tempPt.y=tilePt.y*tileHeight;
    return(tempPt);
}
