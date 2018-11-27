export default function (game) {

  var beginTime = Date.now(), prevTime = beginTime, frames = 0, count = 0, flag = true;

  return {
    begin: function () {
      beginTime = Date.now();
    },

    stop: function () {
      flag = false;
      if (count > 3) game.removeShadow();
    },

    end: function () {
      //if (!flag) return;
      frames++;
      var time = Date.now();
      //console.log("prevy", prevTime, time);
      if (time >= prevTime + 1000) {
        // console.log("frames", frames * 1000 / (time - prevTime));
        prevTime = time;
        frames = 0;
      }
      return time;
    }
  };
}
