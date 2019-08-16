const Event = require('./Event.js');

class Spin {

  constructor(options) {
    this.options = options;

    this.frames = {};
    this.start = false;
    this.mspf = 24; //ms per frame

    this.framesLoaded = 0;
    this.framesCount = this.options.frames[1] - this.options.frames[0] + 1;
    this.anglePerFrame = 2 * Math.PI / (this.options.frames[1] + 1 - this.options.frames[0]);

    this.options.sensitivity = this.options.sensitivity ? this.options.sensitivity : 1;
    this.load = new Event(this);
    this.framechange = new Event(this);
    this.panstart = new Event(this);
    this.panend = new Event(this);
    this.pan = new Event(this);

    this.init();
  }
  on(eventName, listener) {

    if (!this[eventName]) {
      throw new Error("No such event \"" + eventName + "\"");
    }

    this[eventName].attach((sender, args) => {
      listener(args);
    })
  };
  init() {
    for (var frame = this.options.frames[0]; frame <= this.options.frames[1]; frame++) {
      this.createImage(frame);
    }
    this.addEventListeners();
    this.setFrame(this.options.start ? this.options.start : this.options.frames[0]);
  };
  createImage(frame) {
    var index = (parseInt(('1' + '0'.repeat(this.options.digits))) + frame).toString().substring(1),
      src = this.options.path.replace('{frame}', index),
      img = document.createElement('img');

    // img.id = 'frame-'+frame;
    img.classList.add('spin-img');
    img.setAttribute('data-frame', frame);
    img.setAttribute('draggable', false);

    img.onload = () => {
      this.framesLoaded++;
      if (this.framesLoaded == this.framesCount) {
        this.load.notify({});
      }
    }

    this.options.container.appendChild(img);
    img.src = src;

    this.frames[frame] = img;

  };
  setFrame(frame) {

    frame = this.validateFrame(frame);


    if (this.currentFrame != undefined) {
      this.frames[this.currentFrame].classList.remove("active");
    }


    this.frames[frame].classList.add("active");

    var trigger = this.currentFrame != frame;

    this.currentFrame = frame;


    if (trigger)
      this.framechange.notify(frame);

  };
  addEventListeners() {
    if (this.options.panHandler == "Hammer" && Hammer != undefined) {
      return this.addHammerEventListeners();
    } else {
      return this.addNativeEventListeners();
    }
  };
  addHammerEventListeners() {
    this.mc = new Hammer(this.options.container, {
      direction: Hammer.DIRECTION_ALL
    });
    this.mc.get('pan').set({
      direction: Hammer.DIRECTION_ALL
    });

    // listen to events...
    this.mc.on("panstart panend panleft panright", (ev) => {
      this.handlePanHammer(ev);
    });

  };
  addNativeEventListeners() {



    this.options.container.addEventListener("mousedown", (e) => {
      this.moveStart(this.getContainerWidth() - e.x, e.y);
    });
    this.options.container.addEventListener("mousemove", (e) => {
      this.move(e.x, e.y);
    });
    this.options.container.addEventListener("mouseup", (e) => {
      this.moveEnd();
    });


    this.options.container.addEventListener("touchstart", (e) => {
      this.moveStart(this.getContainerWidth() - e.changedTouches[0].screenX, e.changedTouches[0].screenY);
    });
    this.options.container.addEventListener("touchmove", (e) => {
      this.move(e.changedTouches[0].screenX, e.changedTouches[0].screenY);
    });
    this.options.container.addEventListener("touchend", (e) => {
      this.moveEnd();
    });
  };
  handlePanHammer(ev) {

    if (ev.type == "panstart") {
      this.moveStart(this.getContainerWidth() - ev.center.x, ev.center.y);
    } else if (ev.type == "panend") {
      this.moveEnd();
    } else {
      this.move(ev.center.x, ev.center.y);
    }

  };
  moveStart(x, y) {
    this.start = {
      "x": x,
      "y": y,
    };
    this.startFrame = this.currentFrame;
    this.panstart.notify(this.currentFrame);
  };
  moveEnd() {

    this.start = false;
    if (this.options.anchors) {
      this.flyToNearestAnchor();
    }
    this.panend.notify(this.currentFrame);
  };
  move(x, y) {
    if(this.start) {

    var diff = Math.ceil(0.1 * parseFloat(this.options.sensitivity) * ((this.getContainerWidth() - x) - this.start.x)),
      frame = this.startFrame - diff;

    this.pan.notify(frame);
    this.setFrame(frame);
  }

  };

  getContainerWidth() {
    return this.options.container.getBoundingClientRect().width
  };
  validateFrame(frame) {

    if (frame < this.options.frames[0])
      frame = this.options.frames[0] + this.options.frames[1] + 1 + frame;
    if (frame > this.options.frames[1])
      frame = this.options.frames[0] + frame - this.options.frames[1] - 1;

    return frame;
  };
  flyTo(frame, direction) {

    frame = this.validateFrame(frame);

    var distance = frame - this.currentFrame;

    if (!direction)
      direction = Math.sign(Math.sin(distance * this.anglePerFrame));


    this.animate(() => {
      if (this.currentFrame != frame) {
        this.setFrame(this.currentFrame + direction);
      } else {
        this.stopAnimation();
        return false;
      }
    }, 1 / this.mspf);


  };
  flyToNearestAnchor() {

    if (!this.options.anchors) return false;

    var currentAngle = this.anglePerFrame * this.currentFrame,
      minAngle = 2 * Math.PI,
      frameToSet;

    for (var i = 0; i < this.options.anchors.length; i++) {

      var angle = this.anglePerFrame * this.options.anchors[i],
        absoluteDistance = Math.abs(angle - currentAngle);

      if (absoluteDistance < minAngle) {
        minAngle = absoluteDistance;
        frameToSet = this.options.anchors[i];
      }

    }

    return this.flyTo(frameToSet);


  };
  animate(fn, delay) {


    if (!this.interval) {

      this.isRunning = true;


      var start = new Date().getTime();

      let loop = () => {

        var current = new Date().getTime();

        if (current - start >= delay) {
          fn.call();
          start = new Date().getTime();
        }

        if (this.isRunning) {
          return requestAnimationFrame(loop);
        } else {
          return cancelAnimationFrame(this.interval);
          // return false;
        }
      };

      this.interval = loop();
    }
  };
  stopAnimation() {
    this.isRunning = false;
    this.interval = false;
  };
  lock() {
    this.options.container.classList.add("locked");
  };
  unlock() {
    this.options.container.classList.remove("locked");
  }
}

module.exports = Spin;
