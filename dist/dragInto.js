"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DragInto = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/*
 * @Description: 拖拽进入组件
 * @Date: 2021-11-17 14:40:29
 * @LastEditTime: 2021-11-18 18:32:25
 * @FilePath: \dragInto\src\dragInto.js
 */
var DragInto = /*#__PURE__*/function () {
  function DragInto(currnetElement, targetElement, options) {
    _classCallCheck(this, DragInto);

    this.currnetElement = currnetElement;
    this.targetElement = targetElement;
    this.options = options;
    this.initEvents();
  }

  _createClass(DragInto, [{
    key: "initData",
    value: function initData() {
      this.dragging = false;
      this.enter = false;
      this.enterElement;
    }
  }, {
    key: "initEvents",
    value: function initEvents() {
      this.currnetElement.setAttribute('draggable', true);
      this.currnetElement.addEventListener('dragstart', this.currentDragStart.bind(this));
      this.currnetElement.addEventListener('dragend', this.initData.bind(this));
      this.targetElement.addEventListener('dragover', this.targetDragOver.bind(this));
      this.targetElement.addEventListener('dragleave', this.targetDragleave.bind(this));
    }
  }, {
    key: "currentDragStart",
    value: function currentDragStart() {
      this.initData();
      this.dragging = true;
    }
  }, {
    key: "targetDragOver",
    value: function targetDragOver(e) {
      e.preventDefault();

      if (!this.enter) {
        this.enter = true;
        var newElement = this.cloneElement(this.currnetElement);
        this.enterElement = newElement;

        if (!this.hasCurrentElement()) {
          this.targetElement.appendChild(newElement);
        }
      }
    }
  }, {
    key: "targetDragleave",
    value: function targetDragleave() {
      this.enter = false;

      if (this.hasCurrentElement()) {
        this.targetElement.removeChild(this.enterElement);
        this.enterElement = null;
      }
    }
  }, {
    key: "cloneElement",
    value: function cloneElement(element) {
      var newElement = document.createElement(element.localName);
      newElement.classList.add(element.attributes["class"].value);
      newElement.style.pointerEvents = 'none';
      newElement.innerHTML = element.innerHTML;
      return newElement;
    }
  }, {
    key: "hasCurrentElement",
    value: function hasCurrentElement() {
      var _this = this;

      return Array.from(this.targetElement.children).some(function (child) {
        return child.localName === _this.currnetElement.localName && child.innerHTML === _this.currnetElement.innerHTML;
      });
    }
  }]);

  return DragInto;
}();

exports.DragInto = DragInto;