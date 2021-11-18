/*
 * @Description: 拖拽进入组件
 * @Date: 2021-11-17 14:40:29
 * @LastEditTime: 2021-11-18 18:32:25
 * @FilePath: \dragInto\src\dragInto.js
 */

export class DragInto {
  constructor(currnetElement, targetElement, options) {
    this.currnetElement = currnetElement
    this.targetElement = targetElement

    this.options = options

    this.initEvents()
  }

  initData() {
    this.dragging = false
    this.enter = false
    this.enterElement
  }

  initEvents() {
    this.currnetElement.setAttribute('draggable', true)

    this.currnetElement.addEventListener(
      'dragstart',
      this.currentDragStart.bind(this)
    )
    this.currnetElement.addEventListener('dragend', this.initData.bind(this))
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
    this.initData()

    this.dragging = true
  }

  targetDragOver(e) {
    e.preventDefault()
    if (!this.enter) {
      this.enter = true
      const newElement = this.cloneElement(this.currnetElement)
      this.enterElement = newElement
      if (!this.hasCurrentElement()) {
        this.targetElement.appendChild(newElement)
      }
    }
  }

  targetDragleave() {
    this.enter = false
    if (this.hasCurrentElement()) {
      this.targetElement.removeChild(this.enterElement)
      this.enterElement = null
    }
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
        child.localName === this.currnetElement.localName &&
        child.innerHTML === this.currnetElement.innerHTML
      )
    })
  }
}
