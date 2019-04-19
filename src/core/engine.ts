export interface Position {
  x:number;
  y:number;
}

export interface Boundary {
  left:number;
  right:number;
  top:number;
  bottom:number;
}

export enum Direction {
  left,
  right,
  top,
  bottom,
}

export function simpleClone (things:any):any {
  if (things instanceof Array) {
    return things.map((thing) => simpleClone(thing));
  } else if (typeof things === 'object') {
    const keys = Object.keys(things);
    const result:typeof things = {};
    keys.forEach((key) => result[key] = simpleClone(things[key]));
    return result;
  }
  return things;
}

export class Engine {
  private static engine:Engine
  private positionRate = 10;
  private boundary:Boundary = {
    left:0,
    right:0,
    top:0,
    bottom:0,
  };
  private constructor(boundary?:Boundary) {
    this.boundary = boundary || this.boundary;
  }
  public static getInstance(boundary?:Boundary) {
    if (Engine.engine === undefined) {
      Engine.engine = new Engine(boundary);
    }
    return Engine.engine;
  }

  public touchPosition(body:Position[]|Position, position:Position) {
    if (body instanceof Array) {
      return body.find((segment) => segment.x === position.x && segment.y === position.y);
    }
    return body.x === position.x && body.y === position.y
  }

  public isFail(body:Position[]) {
    return this.reachBoundary(body[0]) || this.touchItself(body);
  }

  public reachBoundary(head:Position) {
    return head.x > this.boundary.right - 1 || head.x < this.boundary.left || head.y > this.boundary.bottom - 1 || head.y < this.boundary.top;
  }

  public generateTail(lastBody:Position[]) {
    const lastTail = lastBody[lastBody.length - 1];
    return {
      x:lastTail.x,
      y:lastTail.y,
    };
  }

  public moveOneShot(body:Position[], direction:Direction) {
    const newBody = simpleClone(body) as Position[];
    for (let i = newBody.length - 1; i > 0; i--) {
      newBody[i].x = newBody[i - 1].x;
      newBody[i].y = newBody[i - 1].y;
    }
    const head = newBody[0];
    switch(direction) {
      case Direction.left:
        head.x = head.x - 1;
        break;
      case Direction.right:
        head.x = head.x + 1;
        break;
      case Direction.top:
        head.y = head.y - 1;
        break;
      case Direction.bottom:
        head.y = head.y + 1;
        break;
    }
    return newBody;
  }

  public touchItself(body:Position[]) {
    const head = body[0];
    for (let i = 1; i < body.length; i++) {
      if (this.touchPosition(head, body[i])) {
        return true;
      }
    }
    return false;
  }

  // (start, end)
  private generateRange(start:number, end:number) {
    return Math.floor(Math.random() * (end - start - 1)) + start + 1;
  }

  public generateBonus() {
    const x = this.generateRange(this.boundary.left, this.boundary.right);
    const y = this.generateRange(this.boundary.top, this.boundary.bottom);
    return {x, y};
  }

  public getPixel(postion:Position) {
    return {
      x:postion.x * this.positionRate,
      y:postion.y * this.positionRate
    };
  }

  public getPositionRate() {
    return this.positionRate;
  }
}