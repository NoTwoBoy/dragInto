import { Emitter } from './emitter'
import {DRAG_START, DRAG_END, DRAG_ENTER, DRAG_LEAVE, BEFORE_ENTER} from './events'

class DragInto {
  constructor({ id, currentElement, targetElement, data, options, emit }) {
    this.id = id
    this.currentElement = currentElement
    this.targetElement = targetElement
    this.data = data
    this.options = options

    this.emit = emit

    this.initEvents()
  }

  get dragEventArgs() {
    return {
      id: this.id,
      current: this.currentElement,
      target: this.targetElement,
      data: this.data
    }
  }

  initEvents() {
    this.currentElement.setAttribute('draggable', true)
    this.currentElement.style.cursor = 'move'

    this.currentElement.addEventListener(
      'dragstart',
      this.currentDragStart.bind(this)
    )
    this.currentElement.addEventListener(
      'dragend',
      this.targetDragEnd.bind(this)
    )

    this.targetElement.addEventListener(
      'dragover',
      this.targetDragOver.bind(this)
    )
    this.targetElement.addEventListener(
      'dragleave',
      this.targetDragleave.bind(this)
    )
  }

  currentDragStart() {
    this.dragging = true
    this.emit(`${this.id}:${DRAG_START}`, this.dragEventArgs)
  }

  targetDragOver(e) {
    e.preventDefault()

    const appendChild = flag => {
      flag === undefined && (flag = true)
      if (flag) {
        const newElement = this.cloneElement(this.currentElement)
        this.enterElement = newElement
        if (!this.hasCurrentElement()) {
          this.targetElement.appendChild(newElement)
          this.emit(`${this.id}:${DRAG_ENTER}`, this.dragEventArgs)
        }
      }
      this.enter = true
      this.executeBeforeEnter = true
    }

    if (!this.enter && this.dragging && !this.executeBeforeEnter) {
      this.emit(`${this.id}:${BEFORE_ENTER}`, {
        next: appendChild.bind(this),
        ...this.dragEventArgs
      })
      if (this.executeBeforeEnter) {
        return
      } else {
        appendChild(true)
      }
    }
  }

  targetDragleave() {
    if (this.enter && this.executeBeforeEnter) {
      if (this.hasCurrentElement()) {
        this.targetElement.removeChild(this.enterElement)
        this.enterElement = null
      }
      this.executeBeforeEnter = false
      this.enter = false
      this.emit(`${this.id}:${DRAG_LEAVE}`, this.dragEventArgs)
    }
  }

  targetDragEnd() {
    this.emit(`${this.id}:${DRAG_END}`, this.enter, this.dragEventArgs)
    this.dragging = false
    this.executeBeforeEnter = false
    this.enter = false
    this.enterElement = null
  }

  cloneElement(element) {
    const newElement = document.createElement(element.localName)
    newElement.classList.add(element.attributes.class.value)
    newElement.style.pointerEvents = 'none'
    newElement.innerHTML = element.innerHTML

    return newElement
  }

  hasCurrentElement() {
    return Array.from(this.targetElement.children).some(child => {
      return (
        child.localName === this.currentElement.localName &&
        child.innerHTML === this.currentElement.innerHTML
      )
    })
  }
}
class DragControl extends Emitter {
  constructor(options) {
    super()
    this.dragEventsMap = new Map()
    this.options = options
    this.count = 1
  }

  addDrag({ currentElement, targetElement, data, options }) {
    const id = `drag${this.count++}`
    this.dragEventsMap.set(
      id,
      new DragInto({
        id,
        currentElement,
        targetElement,
        data,
        options: options ?? this.options,
        emit: this.emit.bind(this)
      })
    )

    return id
  }

  cleanDragEvents() {
    this.dragEventsMap.clear()
    this.events.clear()
    this.eventsCaches.clear()
    this.count = 1
  }

  get dragCount() {
    return this.count
  }
}

export const Dragger = (function() {
  let dragger
  return function() {
    return dragger || (dragger = new DragControl())
  }
})()
