import Controller from "./_controller";
import Model from "./_model";
import render from "./_view";

export default function scheduler() {
  // MVC
  // CONTROLLER -> DATA -> MODEL -> DATA -> VIEW

  // CONTROLLER
  const controller = new Controller();
  const model = new Model();

  const FPS = 60; // Desired refresh rate (frames per second)
  const FRAME_TIME = 1000 / FPS; // Time per frame in milliseconds

  let lastUpdateTime = 0;

  function gameLoop(timestamp: number) {
    // Calculate the time since the last update
    const elapsedTime = timestamp - lastUpdateTime;

    // Check if enough time has passed to update the model
    if (elapsedTime >= FRAME_TIME) {
      // Synchronously pass data from the controller to the model
      const controller_to_model = controller.getData();

      model.update(controller_to_model);

      // Get most recent model data
      const model_to_view = model.getData();

      // Pass data to the view
      render(model_to_view);

      // const location_user = {
      //   x: Math.sin(Date.now() / 800) * 50,
      //   y: Math.cos(Date.now() / 800) * 50,
      // };

      lastUpdateTime = timestamp;
    }

    // Request the next frame
    requestAnimationFrame(gameLoop);
  }

  // Start the game loop
  requestAnimationFrame(gameLoop);
}
