console.clear();

const config = {
  target: $('.point'),
  line: $('.line'),
  delay: 0 // enter zero for live resizing
};

const uniqueID = () => '_' + Math.random().toString(36).substr(2, 9);
const Draw = function () {};

Draw.prototype.line = function (path, start_el, stop_el) {
  const _id = uniqueID();
  const _path_el_id = `ph_draw_path-path-${_id}`;

  const _new_path = path.cloneNode(false);
  _new_path.setAttribute('id', _path_el_id);
  _new_path.classList.remove('original');
  path.parentNode.insertBefore(_new_path, path.nextSibling);

  const x1 = start_el.offset().left + start_el.width() / 2;
  const y1 = start_el.offset().top + start_el.height() / 2;
  const x2 = stop_el.offset().left + stop_el.width() / 2;
  const y2 = stop_el.offset().top + stop_el.height() / 2;

  const height = y2 - y1;

  console.dir({ x1, x2, y1, y2 });

  const p0 = { x: x1, y: y1 }; // The first point on curve
  const c0 = { x: x2 / 1.5, y: y1 }; // Controller for p0
  const c1 = { x: x2 - x2 / 1.5, y: y2 }; // Controller for p1
  const p1 = { x: x2, y: y2 }; // The last point on curve

  console.dir({
    p0,
    c0,
    c1,
    p1
  });

  const D = 'M ' + p0.x + ' ' + p0.y + 'C ' + c0.x + ' ' + c0.y + ', ' + c1.x + ' ' + c1.y + ', ' + p1.x + ' ' + p1.y;
  _new_path.setAttribute('d', D); //svg attributes
};

const draw = new Draw();

const drawBetweenObjects = {
  //cmake the path
  makeLine: draw.line,
  findLines: function (search) {
    $('.deleteMe').remove(); //remove last set of lines
    $(search).each(function (index, el) {
      if (search.eq(index + 1).length) {
        //only do drawBetweenObject if there is another.
        drawBetweenObjects.makeLine(config.line, $(this), search.eq(index + 1)); //args order - line, div1 and div2 - the next div.
      }
    });
  },
  init: function () {
    drawBetweenObjects.findLines(config.target);
    //give resizing time to happen
    var resizeId;
    $(window).resize(function () {
      clearTimeout(resizeId);
      if (config.delay !== 0) {
        resizeId = setTimeout(doneResizing, config.delay);
      } else {
        drawBetweenObjects.findLines(config.target);
      }
    });
    function doneResizing() {
      drawBetweenObjects.findLines(config.target);
    }
  }
};

drawBetweenObjects.init();
