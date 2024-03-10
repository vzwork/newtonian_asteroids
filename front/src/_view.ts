import Asteroid from "./___asteroid";
import IModelToView from "./__model_to_view";

const RADIUS_CIRCLE_STEERING = 250;
const RADIUS_CIRCLE_STEERING_ACTIVATION = 30;

export default function render({
  location_user,
  mode_movement_active,
  asteroids,
}: IModelToView) {
  // console.log(Math.floor(Math.random() * 10));
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d");

  function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // bg
    ctx.fillStyle = "#01020d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // grid
    drawGrid(location_user, canvas, ctx);

    // steering circle
    drawCircleSteering(mode_movement_active, canvas, ctx);

    // visible area
    drawVisibleArea(location_user, canvas, ctx, asteroids);
  }

  // Call setCanvasSize initially and on window resize
  setCanvasSize();
  window.addEventListener("resize", setCanvasSize);
}

function drawVisibleArea(
  location_user: { x: number; y: number },
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  asteroids: Asteroid[]
) {
  const limit_top_x = location_user.x - canvas.width / 2;
  const limit_bottom_x = location_user.x + canvas.width / 2;
  const limit_top_y = location_user.y - canvas.height / 2;
  const limit_bottom_y = location_user.y + canvas.height / 2;

  const buffer = 100;

  drawAsteroids(
    location_user,
    asteroids.filter(
      (asteroid) =>
        asteroid.location.x > limit_top_x - buffer &&
        asteroid.location.x < limit_bottom_x + buffer &&
        asteroid.location.y > limit_top_y - buffer &&
        asteroid.location.y < limit_bottom_y + buffer
    ),
    ctx
  );
}

function drawAsteroids(
  location_user: { x: number; y: number },
  asteroids: Asteroid[],
  ctx: CanvasRenderingContext2D
) {
  asteroids.forEach((asteroid) => {
    ctx.beginPath();
    ctx.arc(
      asteroid.location.x - location_user.x + window.innerWidth / 2,
      asteroid.location.y - location_user.y + window.innerHeight / 2,
      asteroid.radius,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "#fff";
    ctx.fill();
  });
}

function drawCircleSteering(
  mode_movement_active: boolean,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  ctx.beginPath();
  ctx.arc(
    canvas.width / 2,
    canvas.height / 2,
    RADIUS_CIRCLE_STEERING,
    0,
    Math.PI * 2
  );
  ctx.strokeStyle = mode_movement_active ? "#040" : "#440";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(
    canvas.width / 2,
    canvas.height / 2,
    RADIUS_CIRCLE_STEERING_ACTIVATION,
    0,
    Math.PI * 2
  );
  ctx.strokeStyle = mode_movement_active ? "#090" : "#990";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawGrid(
  location_user: { x: number; y: number },
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) {
  const COLOR_GRID = "#222";
  const WIDTH_GRID = 50;

  // grid x
  const count_positivie_direction_lines_x =
    Math.floor(canvas.height / WIDTH_GRID / 2) + 2;
  const count_negative_direction_lines_x =
    Math.floor(canvas.height / WIDTH_GRID / 2) + 2;
  for (let i = 0; i < count_positivie_direction_lines_x; i++) {
    const location_user_offset_x = location_user.y % WIDTH_GRID;
    ctx.beginPath();
    ctx.moveTo(
      0,
      canvas.height / 2 + WIDTH_GRID * i - location_user_offset_x
    );
    ctx.lineTo(
      canvas.width,
      canvas.height / 2 + WIDTH_GRID * i - location_user_offset_x
    );
    ctx.strokeStyle = COLOR_GRID;
    ctx.stroke();
  }
  for (let i = 1; i < count_negative_direction_lines_x; i++) {
    const location_user_offset_x = location_user.y % WIDTH_GRID;
    ctx.beginPath();
    ctx.moveTo(
      0,
      canvas.height / 2 - WIDTH_GRID * i - location_user_offset_x
    );
    ctx.lineTo(
      canvas.width,
      canvas.height / 2 - WIDTH_GRID * i - location_user_offset_x
    );
    ctx.strokeStyle = COLOR_GRID;
    ctx.stroke();
  }
  // grid y
  const count_positivie_direction_lines_y =
    Math.floor(canvas.width / WIDTH_GRID / 2) + 2;
  const count_negative_direction_lines_y =
    Math.floor(canvas.width / WIDTH_GRID / 2) + 2;
  for (let i = 0; i < count_positivie_direction_lines_y; i++) {
    const location_user_offset_y = location_user.x % WIDTH_GRID;
    ctx.beginPath();
    ctx.moveTo(
      canvas.width / 2 + WIDTH_GRID * i - location_user_offset_y,
      0
    );
    ctx.lineTo(
      canvas.width / 2 + WIDTH_GRID * i - location_user_offset_y,
      canvas.height
    );
    ctx.strokeStyle = COLOR_GRID;
    ctx.stroke();
  }
  for (let i = 1; i < count_negative_direction_lines_y; i++) {
    const location_user_offset_y = location_user.x % WIDTH_GRID;
    ctx.beginPath();
    ctx.moveTo(
      canvas.width / 2 - WIDTH_GRID * i - location_user_offset_y,
      0
    );
    ctx.lineTo(
      canvas.width / 2 - WIDTH_GRID * i - location_user_offset_y,
      canvas.height
    );
    ctx.strokeStyle = COLOR_GRID;
    ctx.stroke();
  }
}
