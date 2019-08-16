import Spin from './Spin.js';

window.requestAnimationFrame =  window.requestAnimationFrame ||
                                window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame ||
                                window.msRequestAnimationFrame;

window.cancelAnimationFrame =   window.cancelAnimationFrame ||
                                window.mozCancelAnimationFrame;

// DRAF
window.draf = function(cb) {
  return requestAnimationFrame(function() {
    requestAnimationFrame(cb)
  })
}


window.SpriteSpin = Spin;
