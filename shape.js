var shapeData = {
    types: [
        {
            name: 'I',
            matrix: [
                [0, -1],
                [0, 1],
                [0, 2]
            ]
        },
        {
            name: 'O',
            matrix: [
                [0, 1],
                [1, 0],
                [1, 1]
            ]
        },
        {
            name: 'Z',
            matrix: [
                [0, -1],
                [-1, 0],
                [1, -1]
            ]
        },
        {
            name: 'S',
            matrix: [
                [-1, -1],
                [0, -1],
                [1, 0]
            ]
        },
        {
            name: 'T',
            matrix: [
                [1, 0],
                [-1, 0],
                [1, 1]
            ]
        },
        {
            name: 'J',
            matrix: [
                [1, 0],
                [-1, 0],
                [-1, 1]
            ]
        },
        {
            name: 'L',
            matrix: [
                [1, 0],
                [-1, 0],
                [-1, -1]
            ]
        }
    ],
    orientations: [
        {
            angle: 0,
            matrix: [
                [1, 0],
                [0, 1]
            ]
        }, {
            angle: 90,
            matrix: [
                [0, -1],
                [1, 0]
            ]
        }, {
            angle: 180,
            matrix: [
                [-1, 0],
                [0, -1]
            ]
        }, {
            angle: 270,
            matrix: [
                [0, 1],
                [-1, 0]
            ]
        }
    ],
    colors: [
        {
            name: 'orange',
            rgb: 'rgb(239,108,0)'
        },{
            name: 'red',
            rgb: 'rgb(211,47,47)'
        }, {
            name: 'green',
            rgb: 'rgb(76,175,80)'
        }, {
            name: 'blue',
            rgb: 'rgb(33,150,243)'
        }, {
            name: 'yellow',
            rgb: 'rgb(255,235,59)'
        }, {
            name: 'cyan',
            rgb: 'rgb(0,188,212)'
        }, {
            name: 'pink',
            rgb: 'rgb(233,30,99)'
        }, {
            name: 'white',
            rgb: 'rgb(224,224,224)'
        }
    ]
};

function Shape() {
    this.startX = boardWidth / 2;
    this.startY = brickSize;
    this.isFrozen = false;
    this.color = randInt(shapeData.colors.length);
    this.type = randInt(shapeData.types.length);
    this.orientaion = randInt(shapeData.orientations.length);
    this.bricks = [];
    this.fall = function () {
        if (!this.isFrozen) {
            this.bricks.forEach(function (brick) {
                brick.y += brickSize;
            });
        }

        return this;
    };
    this.show = function () {
        for (var i = 0; i < 4; ++i) {
            this.bricks[i].show();
        }

        return this;
    };
    this.applyMovement = function (direction) {
        switch (direction) {
            case userAction.ROTATE:
                if (shapeData.types[this.type].name !== 'O') {
                    if (this.orientaion === 3) {
                        this.orientaion = 0;
                    } else {
                        ++this.orientaion;
                    }

                    this.applyOrientation();
                }

                break;

            case userAction.MOVE_RIGHT:
            case userAction.MOVE_LEFT:
                for (var i = 0; i < 4; ++i) {
                    if (direction === userAction.MOVE_LEFT) {
                        this.bricks[i].x -= brickSize;
                    } else {
                        this.bricks[i].x += brickSize;
                    }
                }

                break;

            default:
                break;
        }

        return this;
    };
    this.applyOrientation = function () {
        var resultMatrix = matrixMultiply(
            shapeData.types[this.type].matrix,
            shapeData.orientations[this.orientaion].matrix
        );

        for (var i = 0; i < 3; ++i) {
            this.bricks[i + 1].x =
                this.bricks[0].x + resultMatrix[i][0] * brickSize;
            this.bricks[i + 1].y =
                this.bricks[0].y + resultMatrix[i][1] * brickSize;
        }

        return this;
    };

    for (var i = 0; i < 4; i++) {
        this.bricks.push(new Brick(
            this.startX,
            this.startY,
            shapeData.colors[this.color].rgb
        ));
    }

    this.applyOrientation();

    return this;
}