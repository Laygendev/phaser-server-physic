import Vector2 from './Math/Vector2';

class Body {
	constructor(width, height) {
		this.width = width;
		this.height = height;

		this.transform = {
			x: 0,
			y: 0
		};

		this.position = new Vector2(0, 0);
		this.prev = new Vector2(0, 0);

		this.velocity = new Vector2(0, 0);
		this.newVelocity = new Vector2(0, 0);

		this.gravity = new Vector2(0, 0);
		this.deltaMax = new Vector2(0, 0);

		this.speed = 0;
		this.mass = 1;
		this.onCollide = false;

		this.touching = { none: true, up: false, down: false, left: false, right: false };
		this.wasTouching = { none: true, up: false, down: false, left: false, right: false };

		this.blocked = { none: true, up: false, down: false, left: false, right: false };

		this.dirty = false;

		this._dx = 0;
		this._dy = 0;

		this._reset = true;

		console.log(this.position);
	}

	update(delta) {
		this.dirty = true;

		//  Store and reset collision flags
		this.wasTouching.none = this.touching.none;
		this.wasTouching.up = this.touching.up;
		this.wasTouching.down = this.touching.down;
		this.wasTouching.left = this.touching.left;
		this.wasTouching.right = this.touching.right;

		this.touching.none = true;
		this.touching.up = false;
		this.touching.down = false;
		this.touching.left = false;
		this.touching.right = false;

		this.blocked.none = true;
		this.blocked.up = false;
		this.blocked.down = false;
		this.blocked.left = false;
		this.blocked.right = false;

		var sprite = this.transform;

		this.newVelocity.x = this.velocity.x * delta;
		this.newVelocity.y = this.velocity.y * delta;

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		if (this._reset) {
			this.prev.x = this.position.x;
			this.prev.y = this.position.y;
		}

		this.speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);

		this._dx = this.deltaX();
		this._dy = this.deltaY();

		this._reset = false;
	}

	postUpdate() {
		if (!this.dirty) {
			return;
		}

		this.dirty = false;

		this._dx = this.deltaX();
		this._dy = this.deltaY();

		if (this.deltaMax.x !== 0 && this._dx !== 0) {
			if (this._dx < 0 && this._dx < -this.deltaMax.x) {
				this._dx = -this.deltaMax.x;
			} else if(this._dx > 0 && this._dx > this.deltaMax.x) {
				this._dx = this.deltaMax.x;
			}
		}

		if (this.deltaMax.y !== 0 && this._dy !== 0)
		{
			if (this._dy < 0 && this._dy < -this.deltaMax.y)
			{
				this._dy = -this.deltaMax.y;
			}
			else if (this._dy > 0 && this._dy > this.deltaMax.y)
			{
				this._dy = this.deltaMax.y;
			}
		}

		this.reset = true;

		this.prev.x = this.position.x;
		this.prev.y = this.position.y;
	}

	checkWorldBounds() {
		// var pos = this.position;
		// var bound = this.world.bounds;
		// var check = this.world.checkCollision;
	}

	deltaX() {
		return this.position.x - this.prev.x;
	}

	deltaY() {
		return this.position.y - this.prev.y;
	}
}

export default Body;
