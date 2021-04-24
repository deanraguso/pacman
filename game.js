const gameState = {};

function preload() {
    this.load.image('map', 'assets/map.svg');
    this.load.spritesheet('pacman_ss', 'assets/pacman.svg', {frameWidth:15, frameHeight:15});
}

function create() {
    // Sprite configuration
    const chomp_speed = 7
    gameState.map = this.add.image(300,300,'map');
    gameState.pacman = this.physics.add.sprite(20, 20,'pacman_ss');
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
    gameState.pacman.play('left');

    // Add cursor controls
    gameState.cursors = this.input.keyboard.createCursorKeys();
}

function update() {
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
            debug: false
        }
    },
    scene: {
        preload, create, update
    }
}

const game = new Phaser.Game(config);