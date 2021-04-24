const gameState = {};

function preload() {
    this.load.image('map', 'assets/map.svg');
    this.load.spritesheet('pacman_ss', 'assets/pacman.svg', {frameWidth:15, frameHeight:15});
}

function create() {
    gameState.map = this.add.image(300,300,'map');
    gameState.pacman = this.add.sprite(20, 20,'pacman_ss');
    this.anims.create(
        {key: 'left',
        frames: this.anims.generateFrameNumbers('pacman_ss', {frames: [0,1]}),
        repeat: -1,
        frameRate:5
        }
    );
    this.anims.create(
        {key: 'right',
        frames: this.anims.generateFrameNumbers('pacman_ss', {frames: [1,2]}),
        repeat: -1,
        frameRate:5
        }
    );
    gameState.pacman.play('left');
    gameState.pacman.angle = -90;
}

function update() {

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
            debug: true
        }
    },
    scene: {
        preload, create, update
    }
}

const game = new Phaser.Game(config);