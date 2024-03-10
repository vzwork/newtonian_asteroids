import Asteroid from "./___asteroid";

interface IModelToView {
  location_user: { x: number; y: number };
  mode_movement_active: boolean;
  asteroids: Asteroid[];
}

export default IModelToView;
