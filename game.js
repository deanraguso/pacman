const gameState = {};

function preload() {

}

function create() {

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