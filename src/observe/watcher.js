import Dep, { popTarget, pushTarget } from './dep'

let id = 0

class Watch {
  constructor(vm, exprOrFn, options, cb) {
    this.id = id++
    this.renderWatcher = options
    this.getter = typeof exprOrFn === 'string'
      ? function() { return vm[exprOrFn] }  //用户Watch,访问vm[exprOrFn]收集此watcher
      : exprOrFn
    this.deps = []
    this.cb = cb  // 用户Watch传入函数 
    this.depsId = new Set()
    this.lazy = options.lazy
    this.dirty = this.lazy  // computed取值由脏值决定
    this.vm = vm
    this.user = options.user
    this.value = this.lazy ? undefined : this.get() // 缓存Watch旧值
  }

  // 执行函数
  get() {
    pushTarget(this) // watcher内函数执行，装载入全局变量使依赖收集
    console.log(this.getter)
    const value = this.getter.call(this.vm)
    popTarget()
    return value
  }

  evaluate() {   // computed取值并清空脏值
    this.value = this.get()
    this.dirty = false
  }

  // watcher收集dep
  addDep(dep) {
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.deps.push(dep)
      this.depsId.add(id)
      dep.addSub(this)  //dep收集watcher
    }
  }
  depend() {
    let i = this.deps.length
    while(i--){
      this.deps[i].depend()
    }
  }
  update() {
    if (this.lazy) {
      this.dirty = true // 依赖更新时计算watcher需要标记为脏值
    } else {
      queueWatcher(this) // 异步队列执行函数
    }
  }

  run() {
    let oldValue = this.value
    let newValue = this.get()
    if(this.user){
      this.cb.call(this.vm,newValue,oldValue)
    }
  }


}
let queue = []
let has = {}
let pending = false

function flushSchedulerQueue() {
  let flushQueue = queue.slice(0)
  queue = []
  has = {}
  pending = false
  flushQueue.forEach(q => q.run())
}

/* 
  下一轮宏任务之前的watcher.update都存在闭包queue，再执行前都可以加入队列
*/
function queueWatcher(watcher) {
  const id = watcher.id
  if (!has[id]) {
    queue.push(watcher)
    has[id] = true
  }
  if (!pending) {
    vm.$nextTick(flushSchedulerQueue, 0)
    pending = true
  }
}

let callbacks = []
let waiting = false
function flushCallbacks() {
  waiting = false
  let cbs = callbacks.slice(0)
  callbacks = []
  cbs.forEach(cb => cb())
}
let timeFn
if (Promise) {
  timeFn = () => { Promise.resolve().then(flushCallbacks) }
} else if (MutationObserver) {
  const observe = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(1)
  observe.observe(textNode, { characterData: true })
  timeFn = () => { textNode.textContent = 2 }
} else if (setImmediate) {
  timeFn = () => { setImmediate(flushCallbacks) }
} else {
  timeFn = () => { setTimeout(flushCallbacks, 0) }
}

export function nextTick(cb) {
  callbacks.push(cb)
  if (!waiting) {
    timeFn()
    waiting = true
  }
}


export default Watch