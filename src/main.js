import Phaser from 'phaser';

// Game configuration
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#87CEEB', // Light blue background
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

let basket, cursors, score = 0, scoreText;

const game = new Phaser.Game(config);

function preload() {
  // Load basket and object images
  this.load.image('basket', '/assets/basket.png'); // Place assets in the `src/assets` folder
  this.load.image('object', '/assets/object.png');
}

function create() {
  // Add basket
  basket = this.physics.add.sprite(400, 550, 'basket').setCollideWorldBounds(true);

  // Add falling objects group
  this.objects = this.physics.add.group({
    key: 'object',
    repeat: 5,
    setXY: { x: 50, y: 0, stepX: 150 },
  });

  // Set slower falling speed
  this.objects.children.iterate((child) => {
    child.setVelocityY(Phaser.Math.Between(20, 60)); // Slower speed
  });

  // Collision between basket and objects
  this.physics.add.overlap(basket, this.objects, collectObject, null, this);

  // Controls
  cursors = this.input.keyboard.createCursorKeys();

  // Score
  scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '20px', fill: '#000' });
}

function update() {
  // Move basket
  if (cursors.left.isDown) {
    basket.setVelocityX(-300);
  } else if (cursors.right.isDown) {
    basket.setVelocityX(300);
  } else {
    basket.setVelocityX(0);
  }

  // Reset objects out of bounds
  this.objects.children.iterate((child) => {
    if (child.y > 600) {
      child.y = 0; // Reset to the top
      child.x = Phaser.Math.Between(50, 750); // Random horizontal position
      child.setVelocityY(Phaser.Math.Between(20, 60)); // Keep consistent slow speed
    }
  });
}

function collectObject(basket, object) {
  // Reset object to top position
  object.y = 0;
  object.x = Phaser.Math.Between(50, 750);

  // Increase score
  score += 10;
  scoreText.setText(`Score: ${score}`);
}
