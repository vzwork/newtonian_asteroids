import IControllerToModel from "./__controller_to_model";

const RADIUS_CIRCLE_STEERING = 250;
const RADIUS_CIRCLE_STEERING_ACTIVATION = 30;
const SPEED = 3;

class Controller {
  // Add your controller methods here
  private canvas: HTMLCanvasElement;
  private velocity: { x: number; y: number } = { x: 0, y: 0 };
  private location_mouse: { x: number; y: number } = { x: 0, y: 0 };
  private mode_movement_active = false;

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    // Add a mousemove event listener to the canvas
    this.canvas.addEventListener("mousemove", (event) => {
      this.location_mouse.x =
        event.clientX - this.canvas.getBoundingClientRect().left;
      this.location_mouse.y =
        event.clientY - this.canvas.getBoundingClientRect().top;

      // Use mouseX and mouseY to do something
      this.claculateVelocity();
    });
    this.canvas.addEventListener("click", (event) => {
      this.modeMovementActivation();
    });
  }

  private modeMovementActivation() {
    const x = this.location_mouse.x - this.canvas.width / 2;
    const y = this.location_mouse.y - this.canvas.height / 2;
    const magnitude = Math.sqrt(x * x + y * y);

    if (magnitude < RADIUS_CIRCLE_STEERING) {
      this.mode_movement_active = !this.mode_movement_active;
    }
  }

  private claculateVelocity() {
    const x = this.location_mouse.x - this.canvas.width / 2;
    const y = this.location_mouse.y - this.canvas.height / 2;
    const magnitude = Math.sqrt(x * x + y * y);
    if (
      magnitude > RADIUS_CIRCLE_STEERING ||
      magnitude < RADIUS_CIRCLE_STEERING_ACTIVATION ||
      !this.mode_movement_active
    ) {
      this.velocity = { x: 0, y: 0 };
    } else {
      this.velocity = {
        x: (x / RADIUS_CIRCLE_STEERING) * SPEED,
        y: (y / RADIUS_CIRCLE_STEERING) * SPEED,
      };
    }
  }

  getData(): IControllerToModel {
    // Return the user's input
    return {
      velocity: this.velocity,
      mode_movement_active: this.mode_movement_active,
    };
  }
}

export default Controller;
