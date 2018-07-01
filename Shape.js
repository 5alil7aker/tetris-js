import Brick from './Brick.js';

export default function Shape(boardWidth, brickSize, random) {
  const data = Object.freeze({
    types: [
      { name: 'I', matrix: [[0, -1], [0, 1], [0, 2]] },
      { name: 'O', matrix: [[0, 1], [1, 0], [1, 1]] },
      { name: 'Z', matrix: [[0, -1], [-1, 0], [1, -1]] },
      { name: 'S', matrix: [[-1, -1], [0, -1], [1, 0]] },
      { name: 'T', matrix: [[1, 0], [-1, 0], [0, 1]] },
      { name: 'J', matrix: [[1, 0], [-1, 0], [-1, 1]] },
      { name: 'L', matrix: [[1, 0], [-1, 0], [-1, -1]] }
    ],
    orientations: [
      { angle: 0, matrix: [[1, 0], [0, 1]] },
      { angle: 90, matrix: [[0, -1], [1, 0]] },
      { angle: 180, matrix: [[-1, 0], [0, -1]] },
      { angle: 270, matrix: [[0, 1], [-1, 0]] }
    ],
    colors: [
      { name: 'orange', rgb: 'rgb(239,108,0)' },
      { name: 'red', rgb: 'rgb(211,47,47)' },
      { name: 'green', rgb: 'rgb(76,175,80)' },
      { name: 'blue', rgb: 'rgb(33,150,243)' },
      { name: 'yellow', rgb: 'rgb(255,235,59)' },
      { name: 'cyan', rgb: 'rgb(0,188,212)' },
      { name: 'pink', rgb: 'rgb(233,30,99)' },
      { name: 'white', rgb: 'rgb(224,224,224)' }
    ]
  });

  this.startX = boardWidth / 2;
  this.startY = brickSize;
  this.isFrozen = false;
  this.color = random.nextInRange(data.colors.length);
  this.type = random.nextInRange(data.types.length);
  this.orientaion = random.nextInRange(data.orientations.length);
  this.bricks = [];

  this.draw = (context) => {
    this.bricks.forEach((brick) => brick.draw(context));
  };

  this.performAction = (movement) => {
    switch (movement) {
      case Shape.prototype.actions.ROTATE:
        if (data.types[this.type].name !== 'O') {
          this.orientaion = (this.orientaion === 3) ? 0 : ++this.orientaion;
          this.applyOrientation();
        }
        break;

      case Shape.prototype.actions.FALL:
        this.bricks.forEach(function (brick) {
          brick.y += brickSize;
        });
        break;

      case Shape.prototype.actions.MOVE_RIGHT:
      case Shape.prototype.actions.MOVE_LEFT:
        for (let i = 0; i < 4; ++i) {
          if (movement === Shape.prototype.actions.MOVE_LEFT) {
            this.bricks[i].x -= brickSize;
          } else {
            this.bricks[i].x += brickSize;
          }
        }
        break;

      case Shape.prototype.actions.DROP:
        break;
    }

    return this;
  };

  this.applyOrientation = () => {
    const
      type = data.types[this.type].matrix,
      orientation = data.orientations[this.orientaion].matrix;

    let oriented = [];

    // Dot product of the data matrix and the orientation matrix
    for (let i = 0; i < 3; ++i) {
      oriented[i] = [];
      for (let j = 0; j < 2; ++j) {
        oriented[i][j] = 0;
        for (let k = 0; k < 2; ++k) {
          oriented[i][j] += type[i][k] * orientation[k][j];
        }
      }
    }

    const center = this.bricks[0];

    for (let i = 0; i < 3; ++i) {
      this.bricks[i + 1].x = center.x + oriented[i][0] * brickSize;
      this.bricks[i + 1].y = center.y + oriented[i][1] * brickSize;
    }

    return this;
  };

  for (let i = 0; i < 4; ++i) {
    this.bricks.push(new Brick(
      this.startX,
      this.startY,
      data.colors[this.color].rgb,
      brickSize
    ));
  }

  this.applyOrientation();

  return this;
}

Shape.prototype.actions = Object.freeze({
  ROTATE: 'rotate',
  MOVE_LEFT: 'move-left',
  MOVE_RIGHT: 'move-right',
  FALL: 'fall',
  DROP: 'drop'
});