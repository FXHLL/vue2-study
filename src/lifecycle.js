import { createElementVNode, createTextVNode } from "./vnode/index"
import Watch from "./observe/watcher"

function patchProps(el, props) {
  for (let key in props) {
    if (key === 'style') {
      for (let styleName in props.style) {
        el.style[styleName] = props.style[styleName]
      }
    } else {
      el.setAttribute(key, props[key])
    }
  }
}

function createEl(vnode) {
  const { tagName, data, children, text } = vnode
  if (typeof tagName === 'string') {
    vnode.el = document.createElement(tagName)
    patchProps(vnode.el, data)
    children.forEach(item => {
      vnode.el.appendChild(createEl(item))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}

/* 
  path:
  对传入的新旧节点判断
  若旧节点为真实元素则为初次渲染，找到真实元素父级，挂载vnode生成的dom
*/
function path(oldVNode, vnode) {
  const isRealElement = oldVNode.nodeType
  if (isRealElement) {
    const el = oldVNode
    const parentEl = el.parentNode
    const newEl = createEl(vnode)
    parentEl.insertBefore(newEl, el.nextSibing) //插入下个兄弟节点前
    parentEl.removeChild(el)
    return newEl
  } else {
    // 比较 diff
  }
}

export function initLifeCycle(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this
    const el = vm.$el
    vm.$el = path(el, vnode) // 视图更新后，更新vm.$el值
  }

  Vue.prototype._render = function () {
    const vm = this
    return vm.$options.render.call(vm)
  }

  Vue.prototype._c = function (value) {
    return createElementVNode(this, ...arguments)
  }

  Vue.prototype._v = function (value) {
    return createTextVNode(this, ...arguments)
  }

  Vue.prototype._s = function (value) {
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }
    return value
  }
}

export function mountComponent(vm, el) {
  /* 
    1.定义updateComponent: 将render生成的vnode通过path转换为真实元素并挂载
    2.将updateComponent注册到watch,当依赖变化后会自动更新视图
  */
  vm.$el = el
  const updateComponent  = () => {
    const vnode = vm._render()
    vm._update(vnode)
  }
  new Watch(vm, updateComponent, true) // true用于标识watcher
}

export function callHook (vm,hook) {  // 生命周期函数执行
  const handlers = vm.$options[hook];
    if(handlers){
        handlers.forEach(handler=>handler.call(vm))
    }
}