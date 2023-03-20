interface Point {
  x: number;
  y: number;
  z: number;
}
export const distanceBetweenTwo3dPoints = (point1: Point, point2: Point) => {
  const { x: x1, y: y1, z: z1 } = point1;
  const { x: x2, y: y2, z: z2 } = point2;

  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
};
