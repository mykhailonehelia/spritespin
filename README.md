# SpriteSpin JS - Pure JS Sprite Spin

- Pure JS spritespin library.
- You can use native events `mousedown`, `mousemove`, `mouseup` and `touchstart`, `touchmove`, `touchend` OR [ hammer.js](https://github.com/hammerjs/hammer.js/tree/master/ " hammer.js") `pan` event. To use native [ hammer.js](https://github.com/hammerjs/hammer.js/tree/master/ " hammer.js") set **panHandler** option to Hammer.
- If **panHandler** set to Hammer, include  [ hammer.js](https://github.com/hammerjs/hammer.js/tree/master/ " hammer.js"). It's NOT included.


### Options

- **container** - DOM element

    	...
    	"container": document.getElementById("spin"),
    	...

- **path** - path to images */path/to/images/< your-file-name >{frame}.jpg*

    	...
    	"path": "./examples/data/RcH_png_00{frame}.jpg",
    	...

- **digits** - number of digits in {frame}

    	...
    	"digits": 3,
    	...

- **frames** - first and last file indices, for example if you set frames to [0, 110] and digits to 3 it will look for **file-name-000.jpg**, **file-name-001.jpg**, ... , **file-name-110.jpg**

    	...
    	"frame": [0, 110]
    	...

- **sensitivity** - default is 1

    	...
    	"sensitivity": 2.3,
    	...

- **anchors** - anchor frames, if anchors set, it will fly to neasert on **panend**

    	...
    	"digits": [0, 22, 52, 72, 103]
    	...

### Events
- `load` - function() {}
- `panstart` - function(**frame**) {}
- `panend` - function(**frame**) {}
- `pan` - function(**frame**) {}
- `framechange` - function(**frame**) {}

### Example

```javascript
    var spin = new SpriteSpin({
      "container": document.getElementById("spin"),
      "panHandler": "Hammer", //Hammer or undefined fo native code
      "path": "./examples/data/RcH_png_00{frame}.jpg",
      "digits": 3,
      "frames": [0, 110],
      "sensitivity": 1,
      "anchors": [0, 22, 52, 72, 103]
    });

    spin.on('load', function() {
      console.log("Loaded");
    });

    spin.on('panstart', function(frame) {
      console.log("panstart", frame);
    });

    spin.on('pan', function(frame) {
      console.log("pan", frame);
    });

    spin.on('panend', function(frame) {
      console.log("panend", frame);
    });

    spin.on('framechange', function(frame) {
      console.log("framechange", frame);
    });
```




### End
