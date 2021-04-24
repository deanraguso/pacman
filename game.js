const gameState = {};

function preload() {
    gameState.map = this.load.image('map', 'assets/map.svg');
}

function create() {
    const map = this.add.image(300,300,'map');
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