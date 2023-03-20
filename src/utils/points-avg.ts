import type { Point } from "../typings";

export class PointsAvg {
  lastValue: Point | null;
  limit;
  lastIteration;
  onDraw;
  constructor(n: number, onDraw: (p: Point) => void) {
    this.limit = n;
    this.lastValue = null;
    this.lastIteration = 0;
    this.onDraw = onDraw;
  }
  onResult(point: Point) {
    if (this.lastValue == null) {
      this.lastValue = point;
      return;
    }
    const newLastValue = this.avgBetweenTwoPoints(point, this.lastValue);
    this.lastValue = newLastValue;
    this.lastIteration += 1;
    if (this.lastIteration == this.limit) {
      this.onDraw(this.lastValue);
      this.lastIteration = 0;
    }
  }
  private avgBetweenTwoPoints(point1: Point, point2: Point): Point {
    return {
      x: (point1.x + point2.x) / 2,
      y: (point1.y + point2.y) / 2,
      z: (point1.z + point2.z) / 2,
    };
  }
}
