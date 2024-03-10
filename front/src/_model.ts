import Asteroid from "./___asteroid";
import IControllerToModel from "./__controller_to_model";
import IModelToView from "./__model_to_view";

class Model {
  canvas: HTMLCanvasElement;
  location_user: { x: number; y: number } = { x: 0, y: 0 };
  mode_movement_active = false;
  asteroids: Asteroid[] = [];

  constructor() {
    // Add your model initialization here
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
  }

  public update(data: IControllerToModel) {
    if (data.mode_movement_active) {
      this.location_user = {
        x: this.location_user.x + data.velocity.x,
        y: this.location_user.y + data.velocity.y,
      };
    }
    this.mode_movement_active = data.mode_movement_active;

    this.generateAsteroids();
  }

  private generateAsteroids() {
    const arbitrary_plane_width = 3000;

    if (this.asteroids.length < 5) {
      for (let i = 0; i < 100; i++) {
        const x =
          Math.random() * arbitrary_plane_width - arbitrary_plane_width / 2;
        const y =
          Math.random() * arbitrary_plane_width - arbitrary_plane_width / 2;
        const asteroid = new Asteroid({ x, y }, Math.random() * 20 + 10);

        this.asteroids.push(asteroid);
      }
    }
  }

  public getData(): IModelToView {
    // Return the model's data
    return {
      location_user: this.location_user,
      mode_movement_active: this.mode_movement_active,
      asteroids: this.asteroids,
    };
  }
}

export default Model;
