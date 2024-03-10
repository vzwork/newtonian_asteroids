/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/___asteroid.ts":
/*!****************************!*\
  !*** ./src/___asteroid.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Asteroid = /** @class */ (function () {
    function Asteroid(location, radius) {
        this.location = location;
        this.radius = radius;
    }
    return Asteroid;
}());
exports["default"] = Asteroid;


/***/ }),

/***/ "./src/_controller.ts":
/*!****************************!*\
  !*** ./src/_controller.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var RADIUS_CIRCLE_STEERING = 250;
var RADIUS_CIRCLE_STEERING_ACTIVATION = 30;
var SPEED = 3;
var Controller = /** @class */ (function () {
    function Controller() {
        var _this = this;
        this.velocity = { x: 0, y: 0 };
        this.location_mouse = { x: 0, y: 0 };
        this.mode_movement_active = false;
        this.canvas = document.getElementById("canvas");
        // Add a mousemove event listener to the canvas
        this.canvas.addEventListener("mousemove", function (event) {
            _this.location_mouse.x =
                event.clientX - _this.canvas.getBoundingClientRect().left;
            _this.location_mouse.y =
                event.clientY - _this.canvas.getBoundingClientRect().top;
            // Use mouseX and mouseY to do something
            _this.claculateVelocity();
        });
        this.canvas.addEventListener("click", function (event) {
            _this.modeMovementActivation();
        });
    }
    Controller.prototype.modeMovementActivation = function () {
        var x = this.location_mouse.x - this.canvas.width / 2;
        var y = this.location_mouse.y - this.canvas.height / 2;
        var magnitude = Math.sqrt(x * x + y * y);
        if (magnitude < RADIUS_CIRCLE_STEERING) {
            this.mode_movement_active = !this.mode_movement_active;
        }
    };
    Controller.prototype.claculateVelocity = function () {
        var x = this.location_mouse.x - this.canvas.width / 2;
        var y = this.location_mouse.y - this.canvas.height / 2;
        var magnitude = Math.sqrt(x * x + y * y);
        if (magnitude > RADIUS_CIRCLE_STEERING ||
            magnitude < RADIUS_CIRCLE_STEERING_ACTIVATION ||
            !this.mode_movement_active) {
            this.velocity = { x: 0, y: 0 };
        }
        else {
            this.velocity = {
                x: (x / RADIUS_CIRCLE_STEERING) * SPEED,
                y: (y / RADIUS_CIRCLE_STEERING) * SPEED,
            };
        }
    };
    Controller.prototype.getData = function () {
        // Return the user's input
        return {
            velocity: this.velocity,
            mode_movement_active: this.mode_movement_active,
        };
    };
    return Controller;
}());
exports["default"] = Controller;


/***/ }),

/***/ "./src/_model.ts":
/*!***********************!*\
  !*** ./src/_model.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var ___asteroid_1 = __webpack_require__(/*! ./___asteroid */ "./src/___asteroid.ts");
var Model = /** @class */ (function () {
    function Model() {
        this.location_user = { x: 0, y: 0 };
        this.mode_movement_active = false;
        this.asteroids = [];
        // Add your model initialization here
        this.canvas = document.getElementById("canvas");
    }
    Model.prototype.update = function (data) {
        if (data.mode_movement_active) {
            this.location_user = {
                x: this.location_user.x + data.velocity.x,
                y: this.location_user.y + data.velocity.y,
            };
        }
        this.mode_movement_active = data.mode_movement_active;
        this.generateAsteroids();
    };
    Model.prototype.generateAsteroids = function () {
        var arbitrary_plane_width = 3000;
        if (this.asteroids.length < 5) {
            for (var i = 0; i < 100; i++) {
                var x = Math.random() * arbitrary_plane_width - arbitrary_plane_width / 2;
                var y = Math.random() * arbitrary_plane_width - arbitrary_plane_width / 2;
                var asteroid = new ___asteroid_1.default({ x: x, y: y }, Math.random() * 20 + 10);
                this.asteroids.push(asteroid);
            }
        }
    };
    Model.prototype.getData = function () {
        // Return the model's data
        return {
            location_user: this.location_user,
            mode_movement_active: this.mode_movement_active,
            asteroids: this.asteroids,
        };
    };
    return Model;
}());
exports["default"] = Model;


/***/ }),

/***/ "./src/_view.ts":
/*!**********************!*\
  !*** ./src/_view.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var RADIUS_CIRCLE_STEERING = 250;
var RADIUS_CIRCLE_STEERING_ACTIVATION = 30;
function render(_a) {
    var location_user = _a.location_user, mode_movement_active = _a.mode_movement_active, asteroids = _a.asteroids;
    // console.log(Math.floor(Math.random() * 10));
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
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
exports["default"] = render;
function drawVisibleArea(location_user, canvas, ctx, asteroids) {
    var limit_top_x = location_user.x - canvas.width / 2;
    var limit_bottom_x = location_user.x + canvas.width / 2;
    var limit_top_y = location_user.y - canvas.height / 2;
    var limit_bottom_y = location_user.y + canvas.height / 2;
    var buffer = 100;
    drawAsteroids(location_user, asteroids.filter(function (asteroid) {
        return asteroid.location.x > limit_top_x - buffer &&
            asteroid.location.x < limit_bottom_x + buffer &&
            asteroid.location.y > limit_top_y - buffer &&
            asteroid.location.y < limit_bottom_y + buffer;
    }), ctx);
}
function drawAsteroids(location_user, asteroids, ctx) {
    asteroids.forEach(function (asteroid) {
        ctx.beginPath();
        ctx.arc(asteroid.location.x - location_user.x + window.innerWidth / 2, asteroid.location.y - location_user.y + window.innerHeight / 2, asteroid.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
    });
}
function drawCircleSteering(mode_movement_active, canvas, ctx) {
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, RADIUS_CIRCLE_STEERING, 0, Math.PI * 2);
    ctx.strokeStyle = mode_movement_active ? "#040" : "#440";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, RADIUS_CIRCLE_STEERING_ACTIVATION, 0, Math.PI * 2);
    ctx.strokeStyle = mode_movement_active ? "#090" : "#990";
    ctx.lineWidth = 1;
    ctx.stroke();
}
function drawGrid(location_user, canvas, ctx) {
    var COLOR_GRID = "#222";
    var WIDTH_GRID = 50;
    // grid x
    var count_positivie_direction_lines_x = Math.floor(canvas.height / WIDTH_GRID / 2) + 2;
    var count_negative_direction_lines_x = Math.floor(canvas.height / WIDTH_GRID / 2) + 2;
    for (var i = 0; i < count_positivie_direction_lines_x; i++) {
        var location_user_offset_x = location_user.y % WIDTH_GRID;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2 + WIDTH_GRID * i - location_user_offset_x);
        ctx.lineTo(canvas.width, canvas.height / 2 + WIDTH_GRID * i - location_user_offset_x);
        ctx.strokeStyle = COLOR_GRID;
        ctx.stroke();
    }
    for (var i = 1; i < count_negative_direction_lines_x; i++) {
        var location_user_offset_x = location_user.y % WIDTH_GRID;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2 - WIDTH_GRID * i - location_user_offset_x);
        ctx.lineTo(canvas.width, canvas.height / 2 - WIDTH_GRID * i - location_user_offset_x);
        ctx.strokeStyle = COLOR_GRID;
        ctx.stroke();
    }
    // grid y
    var count_positivie_direction_lines_y = Math.floor(canvas.width / WIDTH_GRID / 2) + 2;
    var count_negative_direction_lines_y = Math.floor(canvas.width / WIDTH_GRID / 2) + 2;
    for (var i = 0; i < count_positivie_direction_lines_y; i++) {
        var location_user_offset_y = location_user.x % WIDTH_GRID;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 + WIDTH_GRID * i - location_user_offset_y, 0);
        ctx.lineTo(canvas.width / 2 + WIDTH_GRID * i - location_user_offset_y, canvas.height);
        ctx.strokeStyle = COLOR_GRID;
        ctx.stroke();
    }
    for (var i = 1; i < count_negative_direction_lines_y; i++) {
        var location_user_offset_y = location_user.x % WIDTH_GRID;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - WIDTH_GRID * i - location_user_offset_y, 0);
        ctx.lineTo(canvas.width / 2 - WIDTH_GRID * i - location_user_offset_y, canvas.height);
        ctx.strokeStyle = COLOR_GRID;
        ctx.stroke();
    }
}


/***/ }),

/***/ "./src/scheduler.ts":
/*!**************************!*\
  !*** ./src/scheduler.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var _controller_1 = __webpack_require__(/*! ./_controller */ "./src/_controller.ts");
var _model_1 = __webpack_require__(/*! ./_model */ "./src/_model.ts");
var _view_1 = __webpack_require__(/*! ./_view */ "./src/_view.ts");
function scheduler() {
    // MVC
    // CONTROLLER -> DATA -> MODEL -> DATA -> VIEW
    // CONTROLLER
    var controller = new _controller_1.default();
    var model = new _model_1.default();
    var FPS = 60; // Desired refresh rate (frames per second)
    var FRAME_TIME = 1000 / FPS; // Time per frame in milliseconds
    var lastUpdateTime = 0;
    function gameLoop(timestamp) {
        // Calculate the time since the last update
        var elapsedTime = timestamp - lastUpdateTime;
        // Check if enough time has passed to update the model
        if (elapsedTime >= FRAME_TIME) {
            // Synchronously pass data from the controller to the model
            var controller_to_model = controller.getData();
            model.update(controller_to_model);
            // Get most recent model data
            var model_to_view = model.getData();
            // Pass data to the view
            (0, _view_1.default)(model_to_view);
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
exports["default"] = scheduler;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!***********************!*\
  !*** ./src/script.ts ***!
  \***********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
var scheduler_1 = __webpack_require__(/*! ./scheduler */ "./src/scheduler.ts");
(0, scheduler_1.default)();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7QUN0QmE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Qsa0JBQWtCLG1CQUFPLENBQUMsdUNBQWE7QUFDdkMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9uZXd0b25pYW5fYXN0ZXJvaWRzLy4vc3JjL19fX2FzdGVyb2lkLnRzIiwid2VicGFjazovL25ld3Rvbmlhbl9hc3Rlcm9pZHMvLi9zcmMvX2NvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vbmV3dG9uaWFuX2FzdGVyb2lkcy8uL3NyYy9fbW9kZWwudHMiLCJ3ZWJwYWNrOi8vbmV3dG9uaWFuX2FzdGVyb2lkcy8uL3NyYy9fdmlldy50cyIsIndlYnBhY2s6Ly9uZXd0b25pYW5fYXN0ZXJvaWRzLy4vc3JjL3NjaGVkdWxlci50cyIsIndlYnBhY2s6Ly9uZXd0b25pYW5fYXN0ZXJvaWRzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL25ld3Rvbmlhbl9hc3Rlcm9pZHMvLi9zcmMvc2NyaXB0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEFzdGVyb2lkID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEFzdGVyb2lkKGxvY2F0aW9uLCByYWRpdXMpIHtcbiAgICAgICAgdGhpcy5sb2NhdGlvbiA9IGxvY2F0aW9uO1xuICAgICAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcbiAgICB9XG4gICAgcmV0dXJuIEFzdGVyb2lkO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IEFzdGVyb2lkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgUkFESVVTX0NJUkNMRV9TVEVFUklORyA9IDI1MDtcbnZhciBSQURJVVNfQ0lSQ0xFX1NURUVSSU5HX0FDVElWQVRJT04gPSAzMDtcbnZhciBTUEVFRCA9IDM7XG52YXIgQ29udHJvbGxlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDb250cm9sbGVyKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLnZlbG9jaXR5ID0geyB4OiAwLCB5OiAwIH07XG4gICAgICAgIHRoaXMubG9jYXRpb25fbW91c2UgPSB7IHg6IDAsIHk6IDAgfTtcbiAgICAgICAgdGhpcy5tb2RlX21vdmVtZW50X2FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpO1xuICAgICAgICAvLyBBZGQgYSBtb3VzZW1vdmUgZXZlbnQgbGlzdGVuZXIgdG8gdGhlIGNhbnZhc1xuICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgX3RoaXMubG9jYXRpb25fbW91c2UueCA9XG4gICAgICAgICAgICAgICAgZXZlbnQuY2xpZW50WCAtIF90aGlzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xuICAgICAgICAgICAgX3RoaXMubG9jYXRpb25fbW91c2UueSA9XG4gICAgICAgICAgICAgICAgZXZlbnQuY2xpZW50WSAtIF90aGlzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XG4gICAgICAgICAgICAvLyBVc2UgbW91c2VYIGFuZCBtb3VzZVkgdG8gZG8gc29tZXRoaW5nXG4gICAgICAgICAgICBfdGhpcy5jbGFjdWxhdGVWZWxvY2l0eSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgX3RoaXMubW9kZU1vdmVtZW50QWN0aXZhdGlvbigpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgQ29udHJvbGxlci5wcm90b3R5cGUubW9kZU1vdmVtZW50QWN0aXZhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHggPSB0aGlzLmxvY2F0aW9uX21vdXNlLnggLSB0aGlzLmNhbnZhcy53aWR0aCAvIDI7XG4gICAgICAgIHZhciB5ID0gdGhpcy5sb2NhdGlvbl9tb3VzZS55IC0gdGhpcy5jYW52YXMuaGVpZ2h0IC8gMjtcbiAgICAgICAgdmFyIG1hZ25pdHVkZSA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5KTtcbiAgICAgICAgaWYgKG1hZ25pdHVkZSA8IFJBRElVU19DSVJDTEVfU1RFRVJJTkcpIHtcbiAgICAgICAgICAgIHRoaXMubW9kZV9tb3ZlbWVudF9hY3RpdmUgPSAhdGhpcy5tb2RlX21vdmVtZW50X2FjdGl2ZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgQ29udHJvbGxlci5wcm90b3R5cGUuY2xhY3VsYXRlVmVsb2NpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB4ID0gdGhpcy5sb2NhdGlvbl9tb3VzZS54IC0gdGhpcy5jYW52YXMud2lkdGggLyAyO1xuICAgICAgICB2YXIgeSA9IHRoaXMubG9jYXRpb25fbW91c2UueSAtIHRoaXMuY2FudmFzLmhlaWdodCAvIDI7XG4gICAgICAgIHZhciBtYWduaXR1ZGUgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSk7XG4gICAgICAgIGlmIChtYWduaXR1ZGUgPiBSQURJVVNfQ0lSQ0xFX1NURUVSSU5HIHx8XG4gICAgICAgICAgICBtYWduaXR1ZGUgPCBSQURJVVNfQ0lSQ0xFX1NURUVSSU5HX0FDVElWQVRJT04gfHxcbiAgICAgICAgICAgICF0aGlzLm1vZGVfbW92ZW1lbnRfYWN0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5ID0geyB4OiAwLCB5OiAwIH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnZlbG9jaXR5ID0ge1xuICAgICAgICAgICAgICAgIHg6ICh4IC8gUkFESVVTX0NJUkNMRV9TVEVFUklORykgKiBTUEVFRCxcbiAgICAgICAgICAgICAgICB5OiAoeSAvIFJBRElVU19DSVJDTEVfU1RFRVJJTkcpICogU1BFRUQsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcbiAgICBDb250cm9sbGVyLnByb3RvdHlwZS5nZXREYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBSZXR1cm4gdGhlIHVzZXIncyBpbnB1dFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdmVsb2NpdHk6IHRoaXMudmVsb2NpdHksXG4gICAgICAgICAgICBtb2RlX21vdmVtZW50X2FjdGl2ZTogdGhpcy5tb2RlX21vdmVtZW50X2FjdGl2ZSxcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIHJldHVybiBDb250cm9sbGVyO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IENvbnRyb2xsZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBfX19hc3Rlcm9pZF8xID0gcmVxdWlyZShcIi4vX19fYXN0ZXJvaWRcIik7XG52YXIgTW9kZWwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTW9kZWwoKSB7XG4gICAgICAgIHRoaXMubG9jYXRpb25fdXNlciA9IHsgeDogMCwgeTogMCB9O1xuICAgICAgICB0aGlzLm1vZGVfbW92ZW1lbnRfYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYXN0ZXJvaWRzID0gW107XG4gICAgICAgIC8vIEFkZCB5b3VyIG1vZGVsIGluaXRpYWxpemF0aW9uIGhlcmVcbiAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc1wiKTtcbiAgICB9XG4gICAgTW9kZWwucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGlmIChkYXRhLm1vZGVfbW92ZW1lbnRfYWN0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLmxvY2F0aW9uX3VzZXIgPSB7XG4gICAgICAgICAgICAgICAgeDogdGhpcy5sb2NhdGlvbl91c2VyLnggKyBkYXRhLnZlbG9jaXR5LngsXG4gICAgICAgICAgICAgICAgeTogdGhpcy5sb2NhdGlvbl91c2VyLnkgKyBkYXRhLnZlbG9jaXR5LnksXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubW9kZV9tb3ZlbWVudF9hY3RpdmUgPSBkYXRhLm1vZGVfbW92ZW1lbnRfYWN0aXZlO1xuICAgICAgICB0aGlzLmdlbmVyYXRlQXN0ZXJvaWRzKCk7XG4gICAgfTtcbiAgICBNb2RlbC5wcm90b3R5cGUuZ2VuZXJhdGVBc3Rlcm9pZHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmJpdHJhcnlfcGxhbmVfd2lkdGggPSAzMDAwO1xuICAgICAgICBpZiAodGhpcy5hc3Rlcm9pZHMubGVuZ3RoIDwgNSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxMDA7IGkrKykge1xuICAgICAgICAgICAgICAgIHZhciB4ID0gTWF0aC5yYW5kb20oKSAqIGFyYml0cmFyeV9wbGFuZV93aWR0aCAtIGFyYml0cmFyeV9wbGFuZV93aWR0aCAvIDI7XG4gICAgICAgICAgICAgICAgdmFyIHkgPSBNYXRoLnJhbmRvbSgpICogYXJiaXRyYXJ5X3BsYW5lX3dpZHRoIC0gYXJiaXRyYXJ5X3BsYW5lX3dpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICB2YXIgYXN0ZXJvaWQgPSBuZXcgX19fYXN0ZXJvaWRfMS5kZWZhdWx0KHsgeDogeCwgeTogeSB9LCBNYXRoLnJhbmRvbSgpICogMjAgKyAxMCk7XG4gICAgICAgICAgICAgICAgdGhpcy5hc3Rlcm9pZHMucHVzaChhc3Rlcm9pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIE1vZGVsLnByb3RvdHlwZS5nZXREYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBSZXR1cm4gdGhlIG1vZGVsJ3MgZGF0YVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbG9jYXRpb25fdXNlcjogdGhpcy5sb2NhdGlvbl91c2VyLFxuICAgICAgICAgICAgbW9kZV9tb3ZlbWVudF9hY3RpdmU6IHRoaXMubW9kZV9tb3ZlbWVudF9hY3RpdmUsXG4gICAgICAgICAgICBhc3Rlcm9pZHM6IHRoaXMuYXN0ZXJvaWRzLFxuICAgICAgICB9O1xuICAgIH07XG4gICAgcmV0dXJuIE1vZGVsO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IE1vZGVsO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgUkFESVVTX0NJUkNMRV9TVEVFUklORyA9IDI1MDtcbnZhciBSQURJVVNfQ0lSQ0xFX1NURUVSSU5HX0FDVElWQVRJT04gPSAzMDtcbmZ1bmN0aW9uIHJlbmRlcihfYSkge1xuICAgIHZhciBsb2NhdGlvbl91c2VyID0gX2EubG9jYXRpb25fdXNlciwgbW9kZV9tb3ZlbWVudF9hY3RpdmUgPSBfYS5tb2RlX21vdmVtZW50X2FjdGl2ZSwgYXN0ZXJvaWRzID0gX2EuYXN0ZXJvaWRzO1xuICAgIC8vIGNvbnNvbGUubG9nKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKSk7XG4gICAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpO1xuICAgIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgIGZ1bmN0aW9uIHNldENhbnZhc1NpemUoKSB7XG4gICAgICAgIGNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICAvLyBiZ1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCIjMDEwMjBkXCI7XG4gICAgICAgIGN0eC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgICAgICAvLyBncmlkXG4gICAgICAgIGRyYXdHcmlkKGxvY2F0aW9uX3VzZXIsIGNhbnZhcywgY3R4KTtcbiAgICAgICAgLy8gc3RlZXJpbmcgY2lyY2xlXG4gICAgICAgIGRyYXdDaXJjbGVTdGVlcmluZyhtb2RlX21vdmVtZW50X2FjdGl2ZSwgY2FudmFzLCBjdHgpO1xuICAgICAgICAvLyB2aXNpYmxlIGFyZWFcbiAgICAgICAgZHJhd1Zpc2libGVBcmVhKGxvY2F0aW9uX3VzZXIsIGNhbnZhcywgY3R4LCBhc3Rlcm9pZHMpO1xuICAgIH1cbiAgICAvLyBDYWxsIHNldENhbnZhc1NpemUgaW5pdGlhbGx5IGFuZCBvbiB3aW5kb3cgcmVzaXplXG4gICAgc2V0Q2FudmFzU2l6ZSgpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHNldENhbnZhc1NpemUpO1xufVxuZXhwb3J0cy5kZWZhdWx0ID0gcmVuZGVyO1xuZnVuY3Rpb24gZHJhd1Zpc2libGVBcmVhKGxvY2F0aW9uX3VzZXIsIGNhbnZhcywgY3R4LCBhc3Rlcm9pZHMpIHtcbiAgICB2YXIgbGltaXRfdG9wX3ggPSBsb2NhdGlvbl91c2VyLnggLSBjYW52YXMud2lkdGggLyAyO1xuICAgIHZhciBsaW1pdF9ib3R0b21feCA9IGxvY2F0aW9uX3VzZXIueCArIGNhbnZhcy53aWR0aCAvIDI7XG4gICAgdmFyIGxpbWl0X3RvcF95ID0gbG9jYXRpb25fdXNlci55IC0gY2FudmFzLmhlaWdodCAvIDI7XG4gICAgdmFyIGxpbWl0X2JvdHRvbV95ID0gbG9jYXRpb25fdXNlci55ICsgY2FudmFzLmhlaWdodCAvIDI7XG4gICAgdmFyIGJ1ZmZlciA9IDEwMDtcbiAgICBkcmF3QXN0ZXJvaWRzKGxvY2F0aW9uX3VzZXIsIGFzdGVyb2lkcy5maWx0ZXIoZnVuY3Rpb24gKGFzdGVyb2lkKSB7XG4gICAgICAgIHJldHVybiBhc3Rlcm9pZC5sb2NhdGlvbi54ID4gbGltaXRfdG9wX3ggLSBidWZmZXIgJiZcbiAgICAgICAgICAgIGFzdGVyb2lkLmxvY2F0aW9uLnggPCBsaW1pdF9ib3R0b21feCArIGJ1ZmZlciAmJlxuICAgICAgICAgICAgYXN0ZXJvaWQubG9jYXRpb24ueSA+IGxpbWl0X3RvcF95IC0gYnVmZmVyICYmXG4gICAgICAgICAgICBhc3Rlcm9pZC5sb2NhdGlvbi55IDwgbGltaXRfYm90dG9tX3kgKyBidWZmZXI7XG4gICAgfSksIGN0eCk7XG59XG5mdW5jdGlvbiBkcmF3QXN0ZXJvaWRzKGxvY2F0aW9uX3VzZXIsIGFzdGVyb2lkcywgY3R4KSB7XG4gICAgYXN0ZXJvaWRzLmZvckVhY2goZnVuY3Rpb24gKGFzdGVyb2lkKSB7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmFyYyhhc3Rlcm9pZC5sb2NhdGlvbi54IC0gbG9jYXRpb25fdXNlci54ICsgd2luZG93LmlubmVyV2lkdGggLyAyLCBhc3Rlcm9pZC5sb2NhdGlvbi55IC0gbG9jYXRpb25fdXNlci55ICsgd2luZG93LmlubmVySGVpZ2h0IC8gMiwgYXN0ZXJvaWQucmFkaXVzLCAwLCBNYXRoLlBJICogMik7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcIiNmZmZcIjtcbiAgICAgICAgY3R4LmZpbGwoKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGRyYXdDaXJjbGVTdGVlcmluZyhtb2RlX21vdmVtZW50X2FjdGl2ZSwgY2FudmFzLCBjdHgpIHtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmFyYyhjYW52YXMud2lkdGggLyAyLCBjYW52YXMuaGVpZ2h0IC8gMiwgUkFESVVTX0NJUkNMRV9TVEVFUklORywgMCwgTWF0aC5QSSAqIDIpO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9IG1vZGVfbW92ZW1lbnRfYWN0aXZlID8gXCIjMDQwXCIgOiBcIiM0NDBcIjtcbiAgICBjdHgubGluZVdpZHRoID0gMTtcbiAgICBjdHguc3Ryb2tlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5hcmMoY2FudmFzLndpZHRoIC8gMiwgY2FudmFzLmhlaWdodCAvIDIsIFJBRElVU19DSVJDTEVfU1RFRVJJTkdfQUNUSVZBVElPTiwgMCwgTWF0aC5QSSAqIDIpO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9IG1vZGVfbW92ZW1lbnRfYWN0aXZlID8gXCIjMDkwXCIgOiBcIiM5OTBcIjtcbiAgICBjdHgubGluZVdpZHRoID0gMTtcbiAgICBjdHguc3Ryb2tlKCk7XG59XG5mdW5jdGlvbiBkcmF3R3JpZChsb2NhdGlvbl91c2VyLCBjYW52YXMsIGN0eCkge1xuICAgIHZhciBDT0xPUl9HUklEID0gXCIjMjIyXCI7XG4gICAgdmFyIFdJRFRIX0dSSUQgPSA1MDtcbiAgICAvLyBncmlkIHhcbiAgICB2YXIgY291bnRfcG9zaXRpdmllX2RpcmVjdGlvbl9saW5lc194ID0gTWF0aC5mbG9vcihjYW52YXMuaGVpZ2h0IC8gV0lEVEhfR1JJRCAvIDIpICsgMjtcbiAgICB2YXIgY291bnRfbmVnYXRpdmVfZGlyZWN0aW9uX2xpbmVzX3ggPSBNYXRoLmZsb29yKGNhbnZhcy5oZWlnaHQgLyBXSURUSF9HUklEIC8gMikgKyAyO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY291bnRfcG9zaXRpdmllX2RpcmVjdGlvbl9saW5lc194OyBpKyspIHtcbiAgICAgICAgdmFyIGxvY2F0aW9uX3VzZXJfb2Zmc2V0X3ggPSBsb2NhdGlvbl91c2VyLnkgJSBXSURUSF9HUklEO1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5tb3ZlVG8oMCwgY2FudmFzLmhlaWdodCAvIDIgKyBXSURUSF9HUklEICogaSAtIGxvY2F0aW9uX3VzZXJfb2Zmc2V0X3gpO1xuICAgICAgICBjdHgubGluZVRvKGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCAvIDIgKyBXSURUSF9HUklEICogaSAtIGxvY2F0aW9uX3VzZXJfb2Zmc2V0X3gpO1xuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSBDT0xPUl9HUklEO1xuICAgICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgY291bnRfbmVnYXRpdmVfZGlyZWN0aW9uX2xpbmVzX3g7IGkrKykge1xuICAgICAgICB2YXIgbG9jYXRpb25fdXNlcl9vZmZzZXRfeCA9IGxvY2F0aW9uX3VzZXIueSAlIFdJRFRIX0dSSUQ7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4Lm1vdmVUbygwLCBjYW52YXMuaGVpZ2h0IC8gMiAtIFdJRFRIX0dSSUQgKiBpIC0gbG9jYXRpb25fdXNlcl9vZmZzZXRfeCk7XG4gICAgICAgIGN0eC5saW5lVG8oY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0IC8gMiAtIFdJRFRIX0dSSUQgKiBpIC0gbG9jYXRpb25fdXNlcl9vZmZzZXRfeCk7XG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IENPTE9SX0dSSUQ7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG4gICAgLy8gZ3JpZCB5XG4gICAgdmFyIGNvdW50X3Bvc2l0aXZpZV9kaXJlY3Rpb25fbGluZXNfeSA9IE1hdGguZmxvb3IoY2FudmFzLndpZHRoIC8gV0lEVEhfR1JJRCAvIDIpICsgMjtcbiAgICB2YXIgY291bnRfbmVnYXRpdmVfZGlyZWN0aW9uX2xpbmVzX3kgPSBNYXRoLmZsb29yKGNhbnZhcy53aWR0aCAvIFdJRFRIX0dSSUQgLyAyKSArIDI7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudF9wb3NpdGl2aWVfZGlyZWN0aW9uX2xpbmVzX3k7IGkrKykge1xuICAgICAgICB2YXIgbG9jYXRpb25fdXNlcl9vZmZzZXRfeSA9IGxvY2F0aW9uX3VzZXIueCAlIFdJRFRIX0dSSUQ7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4Lm1vdmVUbyhjYW52YXMud2lkdGggLyAyICsgV0lEVEhfR1JJRCAqIGkgLSBsb2NhdGlvbl91c2VyX29mZnNldF95LCAwKTtcbiAgICAgICAgY3R4LmxpbmVUbyhjYW52YXMud2lkdGggLyAyICsgV0lEVEhfR1JJRCAqIGkgLSBsb2NhdGlvbl91c2VyX29mZnNldF95LCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gQ09MT1JfR1JJRDtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGNvdW50X25lZ2F0aXZlX2RpcmVjdGlvbl9saW5lc195OyBpKyspIHtcbiAgICAgICAgdmFyIGxvY2F0aW9uX3VzZXJfb2Zmc2V0X3kgPSBsb2NhdGlvbl91c2VyLnggJSBXSURUSF9HUklEO1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5tb3ZlVG8oY2FudmFzLndpZHRoIC8gMiAtIFdJRFRIX0dSSUQgKiBpIC0gbG9jYXRpb25fdXNlcl9vZmZzZXRfeSwgMCk7XG4gICAgICAgIGN0eC5saW5lVG8oY2FudmFzLndpZHRoIC8gMiAtIFdJRFRIX0dSSUQgKiBpIC0gbG9jYXRpb25fdXNlcl9vZmZzZXRfeSwgY2FudmFzLmhlaWdodCk7XG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IENPTE9SX0dSSUQ7XG4gICAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBfY29udHJvbGxlcl8xID0gcmVxdWlyZShcIi4vX2NvbnRyb2xsZXJcIik7XG52YXIgX21vZGVsXzEgPSByZXF1aXJlKFwiLi9fbW9kZWxcIik7XG52YXIgX3ZpZXdfMSA9IHJlcXVpcmUoXCIuL192aWV3XCIpO1xuZnVuY3Rpb24gc2NoZWR1bGVyKCkge1xuICAgIC8vIE1WQ1xuICAgIC8vIENPTlRST0xMRVIgLT4gREFUQSAtPiBNT0RFTCAtPiBEQVRBIC0+IFZJRVdcbiAgICAvLyBDT05UUk9MTEVSXG4gICAgdmFyIGNvbnRyb2xsZXIgPSBuZXcgX2NvbnRyb2xsZXJfMS5kZWZhdWx0KCk7XG4gICAgdmFyIG1vZGVsID0gbmV3IF9tb2RlbF8xLmRlZmF1bHQoKTtcbiAgICB2YXIgRlBTID0gNjA7IC8vIERlc2lyZWQgcmVmcmVzaCByYXRlIChmcmFtZXMgcGVyIHNlY29uZClcbiAgICB2YXIgRlJBTUVfVElNRSA9IDEwMDAgLyBGUFM7IC8vIFRpbWUgcGVyIGZyYW1lIGluIG1pbGxpc2Vjb25kc1xuICAgIHZhciBsYXN0VXBkYXRlVGltZSA9IDA7XG4gICAgZnVuY3Rpb24gZ2FtZUxvb3AodGltZXN0YW1wKSB7XG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgdGltZSBzaW5jZSB0aGUgbGFzdCB1cGRhdGVcbiAgICAgICAgdmFyIGVsYXBzZWRUaW1lID0gdGltZXN0YW1wIC0gbGFzdFVwZGF0ZVRpbWU7XG4gICAgICAgIC8vIENoZWNrIGlmIGVub3VnaCB0aW1lIGhhcyBwYXNzZWQgdG8gdXBkYXRlIHRoZSBtb2RlbFxuICAgICAgICBpZiAoZWxhcHNlZFRpbWUgPj0gRlJBTUVfVElNRSkge1xuICAgICAgICAgICAgLy8gU3luY2hyb25vdXNseSBwYXNzIGRhdGEgZnJvbSB0aGUgY29udHJvbGxlciB0byB0aGUgbW9kZWxcbiAgICAgICAgICAgIHZhciBjb250cm9sbGVyX3RvX21vZGVsID0gY29udHJvbGxlci5nZXREYXRhKCk7XG4gICAgICAgICAgICBtb2RlbC51cGRhdGUoY29udHJvbGxlcl90b19tb2RlbCk7XG4gICAgICAgICAgICAvLyBHZXQgbW9zdCByZWNlbnQgbW9kZWwgZGF0YVxuICAgICAgICAgICAgdmFyIG1vZGVsX3RvX3ZpZXcgPSBtb2RlbC5nZXREYXRhKCk7XG4gICAgICAgICAgICAvLyBQYXNzIGRhdGEgdG8gdGhlIHZpZXdcbiAgICAgICAgICAgICgwLCBfdmlld18xLmRlZmF1bHQpKG1vZGVsX3RvX3ZpZXcpO1xuICAgICAgICAgICAgLy8gY29uc3QgbG9jYXRpb25fdXNlciA9IHtcbiAgICAgICAgICAgIC8vICAgeDogTWF0aC5zaW4oRGF0ZS5ub3coKSAvIDgwMCkgKiA1MCxcbiAgICAgICAgICAgIC8vICAgeTogTWF0aC5jb3MoRGF0ZS5ub3coKSAvIDgwMCkgKiA1MCxcbiAgICAgICAgICAgIC8vIH07XG4gICAgICAgICAgICBsYXN0VXBkYXRlVGltZSA9IHRpbWVzdGFtcDtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZXF1ZXN0IHRoZSBuZXh0IGZyYW1lXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShnYW1lTG9vcCk7XG4gICAgfVxuICAgIC8vIFN0YXJ0IHRoZSBnYW1lIGxvb3BcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZ2FtZUxvb3ApO1xufVxuZXhwb3J0cy5kZWZhdWx0ID0gc2NoZWR1bGVyO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHNjaGVkdWxlcl8xID0gcmVxdWlyZShcIi4vc2NoZWR1bGVyXCIpO1xuKDAsIHNjaGVkdWxlcl8xLmRlZmF1bHQpKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=