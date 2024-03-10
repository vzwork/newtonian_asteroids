class Asteroid {
  public location: { x: number; y: number };
  public radius: number;

  constructor(location: { x: number; y: number }, radius: number) {
    this.location = location;
    this.radius = radius;
  }
}

export default Asteroid;
