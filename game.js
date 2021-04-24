const gameState = {};

function preload() {
    this.load.svg('map', 'assets/map.svg');
    this.load.spritesheet('pacman_ss', 'assets/pacman.svg', {frameWidth:15, frameHeight:15});
    this.load.svg('food', 'assets/food.svg');
    this.load.spritesheet('ghost', 'assets/ghost.svg', {frameWidth:15, frameHeight:15});
}

function create() {
    // Sprite configuration
    gameState.status = true;
    gameState.speed = 100;
    const chomp_speed = 7
    gameState.map = this.add.sprite(300,300,'map');
    gameState.foods = this.physics.add.group();

    gameState.pacman = this.physics.add.sprite(12, 296,'pacman_ss');
    this.anims.create(
        {key: 'left',
        frames: this.anims.generateFrameNumbers('pacman_ss', {frames: [0,1]}),
        repeat: -1,
        frameRate:chomp_speed
        }
    );
    this.anims.create(
        {key: 'right',
        frames: this.anims.generateFrameNumbers('pacman_ss', {frames: [1,2]}),
        repeat: -1,
        frameRate:chomp_speed
        }
    );
    gameState.pacman.play('right');

    // Set collider between pacman and walls
    this.physics.add.collider(gameState.pacman, gameState.map)
    
    // Has space to spawn food
    function foodSpace(x,y){
        buffer = 7;
        for(let a = -buffer; a <= buffer; a++){
            for(let b = -buffer; b<=buffer; b++){
                predictedColor = _this.textures.getPixel(x + a, y + b,'map');
                if(predictedColor.g == 64 && predictedColor.b == 245){
                    return false;
                }
            }
        }
        return true;
    }

    const _this = this;
    gameState.foodAmount = 0;
    gameState.score = 0;
    // Populate map with food
    for(let i = 33; i<580; i+=19){
        for(let j = 45; j<560; j +=19){
            if(foodSpace(i,j)){
                gameState.foods.create(i, j, 'food').setScale(0.3);
                gameState.foodAmount ++;
            }
        }
    }
    this.physics.add.collider(gameState.pacman, gameState.foods, (pacman, food)=> {
        gameState.score ++;
        gameState.scoreText.setText(`Score: ${gameState.score}`);
        food.destroy();
        if (gameState.pacman.body.velocity.x > 0) {     //Moving right
            gameState.pacman.setVelocityX(gameState.speed);
        } else if (gameState.pacman.body.velocity.x < 0){
            gameState.pacman.setVelocityX(-gameState.speed);
        } else if (gameState.pacman.body.velocity.y < 0){
            gameState.pacman.setVelocityY(-gameState.speed);
        } else if (gameState.pacman.body.velocity.y > 0){
            gameState.pacman.setVelocityY(gameState.speed);
        }
    });

    // Generate ghosts
    gameState.ghosts = this.physics.add.group();
    const ghost_speed = 170;
    const ghost_num = 20;

    this.anims.create(
        {key: 'left',
        frames: this.anims.generateFrameNumbers('ghost', {frames: [0]}),
        }
    );
    this.anims.create(
        {key: 'right',
        frames: this.anims.generateFrameNumbers('ghost', {frames: [1]}),
        }
    );
    this.anims.create(
        {key: 'up',
        frames: this.anims.generateFrameNumbers('ghost', {frames: [2]}),
        }
    );
    this.anims.create(
        {key: 'down',
        frames: this.anims.generateFrameNumbers('ghost', {frames: [3]}),
        }
    );
    
    for(let i = 0; i< ghost_num; i++){
        gameState.ghosts.create(300, 300, 'ghost').setVelocityX(Math.floor(Math.random()*ghost_speed - ghost_speed/2)).setVelocityY(Math.floor(Math.random()*ghost_speed - ghost_speed/2)).setCollideWorldBounds().setBounceX(1).setBounceY(1);
    }
    
    // Ghost collider
    this.physics.add.collider(gameState.ghosts, gameState.pacman, ()=>{
        gameState.pacman.stop();
        gameState.status = false;
        gameState.scoreText.setText("YOU LOSE");
    });

    // Add score text
    gameState.scoreText = this.add.text(260, 575, `Score: 0`, { fontSize: '15px', fill: '#FFFFFF' });

    // Add cursor controls
    gameState.cursors = this.input.keyboard.createCursorKeys();
}

function update() {

    // Pacman Controls
    
    if(gameState.cursors.left.isDown){
        gameState.pacman.angle = 0;
        gameState.pacman.play('left');
        gameState.pacman.setVelocityY(0);
        gameState.pacman.setVelocityX(-gameState.speed);
    } else if(gameState.cursors.right.isDown){
        gameState.pacman.angle = 0;
        gameState.pacman.play('right');
        gameState.pacman.setVelocityY(0);
        gameState.pacman.setVelocityX(gameState.speed);
    } else if(gameState.cursors.down.isDown){
        gameState.pacman.play('right');
        gameState.pacman.angle = 90;
        gameState.pacman.setVelocityX(0);
        gameState.pacman.setVelocityY(gameState.speed);
    } else if(gameState.cursors.up.isDown){
        gameState.pacman.play('left');
        gameState.pacman.angle = 90;
        gameState.pacman.setVelocityX(0);
        gameState.pacman.setVelocityY(-gameState.speed);
    }

    // Is the next 5 non-blue (not r 0 g 64 b 245)

    // Detect color hits side!
    const distance = 7;
    const buffer = 0;
    const size = 15; //Pacman is 15 pixels wide

    const _this = this;

    function wallComingRight(){
        for(let i = buffer; i< distance; i++){
            predictedColor = _this.textures.getPixel(gameState.pacman.x + buffer + i, gameState.pacman.y,'map')
            if(predictedColor.g == 64 && predictedColor.b == 245){
                return true;
            }
        }
        return false;
    }
    function wallComingLeft(){
        for(let i = buffer; i< distance; i++){
            predictedColor = _this.textures.getPixel(gameState.pacman.x -buffer - i, gameState.pacman.y,'map')
            if(predictedColor.g == 64 && predictedColor.b == 245){
                return true;
            }
        }
        return false;
    }
    function wallComingUp(){
        for(let i = buffer; i< distance; i++){
            predictedColor = _this.textures.getPixel(gameState.pacman.x, gameState.pacman.y - buffer - i,'map')
            if(predictedColor.g == 64 && predictedColor.b == 245){
                return true;
            }
        }
        return false;
    }
    function wallComingDown(){
        for(let i = buffer; i< distance; i++){
            predictedColor = _this.textures.getPixel(gameState.pacman.x, gameState.pacman.y + buffer + i,'map')
            if(predictedColor.g == 64 && predictedColor.b == 245){
                return true;
            }
        }
        return false;
    }
    
    if (gameState.pacman.body.velocity.x > 0) {     //Moving right
        if(wallComingRight()){
            gameState.pacman.setVelocityX(0);
            gameState.pacman.anims.stop();
        }
    } else if (gameState.pacman.body.velocity.x < 0){
        if(wallComingLeft()){
            gameState.pacman.setVelocityX(0);
            gameState.pacman.anims.stop();
        }
    } else if (gameState.pacman.body.velocity.y < 0){
        if(wallComingUp()){
            gameState.pacman.setVelocityY(0);
            gameState.pacman.anims.stop();
        }
    } else if (gameState.pacman.body.velocity.y > 0){
        if(wallComingDown()){
            gameState.pacman.setVelocityY(0);
            gameState.pacman.anims.stop();
        }
    }

    // Game Logic
    if(!gameState.status){
        this.scene.restart();
    }

    if(gameState.score >= gameState.foodAmount){
        gameState.scoreText.setText("YOU WIN");
        this.scene.restart();
    }
}

const config = {
    type: Phaser.AUTO,
    height: 600,
    width: 600,
    backgroundColor: "000000",
    physics: {
        default: 'arcade',
        arcade: {
            // gravity: {y:500}
            // debug: true
        }
    },
    scene: {
        preload, create, update
    }, 
    dom: {
        createContainer: true
    }
}

const game = new Phaser.Game(config);