import IShapeCommand from "../IShapeCommand"
import Shape from "../Shape"

export default class MoveLeftCommand implements IShapeCommand {
  public execute(this: Shape, board) {
    board.checkCollisions((collisions) => {
      if (!collisions.left) {
        for (let i = 0; i < 4; ++i) {
          this.bricks[i].x -= board.brickSize
        }
      }
    })
  }
}
