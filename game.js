const gameState = {};

function preload() {
    this.load.svg('map', 'assets/map.svg');
    this.load.spritesheet('pacman_ss', 'assets/pacman.svg', {frameWidth:15, frameHeight:15});
}

function create() {
    // Sprite configuration
    const chomp_speed = 7
    gameState.map = this.add.sprite(300,300,'map');

    gameState.map = this.add.path(50,500);
    gameState.map.inputEnabled = true;

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

    // Add cursor controls
    gameState.cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    // console.log(this.textures.getPixel(this.input.mousePointer.x,this.input.mousePointer.y,'map').b);
    // console.log(gameState.pacman.body.velocity.x)

    // Pacman Controls
    const speed = 100;
    if(gameState.cursors.left.isDown){
        gameState.pacman.angle = 0;
        gameState.pacman.play('left');
        gameState.pacman.setVelocityY(0);
        gameState.pacman.setVelocityX(-speed);
    } else if(gameState.cursors.right.isDown){
        gameState.pacman.angle = 0;
        gameState.pacman.play('right');
        gameState.pacman.setVelocityY(0);
        gameState.pacman.setVelocityX(speed);
    } else if(gameState.cursors.down.isDown){
        gameState.pacman.play('right');
        gameState.pacman.angle = 90;
        gameState.pacman.setVelocityX(0);
        gameState.pacman.setVelocityY(speed);
    } else if(gameState.cursors.up.isDown){
        gameState.pacman.play('left');
        gameState.pacman.angle = 90;
        gameState.pacman.setVelocityX(0);
        gameState.pacman.setVelocityY(-speed);
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