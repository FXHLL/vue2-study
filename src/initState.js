import { observe } from "./observe/index.js"
import Watch from "./observe/watcher.js"
import { nextTick } from "./observe/watcher"
import Dep from "./observe/dep.js"

export function initState(vm) {
  let opts = vm.$options
  //判断
  if (opts.props) {
    initProp()
  }
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed(vm)
  }
  if (opts.watch) {
    initWatch(vm)
  }
  if (opts.methods) {
    initMethods()
  }
}
function initProp() { }
function initData(vm) {
  console.log('init data')
  let data = vm.$options.data
  data = vm._data = typeof data === 'function'
    ? data.call(vm)
    : data
  // data属性代理到实例
  for (let key in data) {
    proxy(vm, key)
  }
  // 设置劫持
  observe(data)
}
function initWatch(vm) {
  let watch = vm.$options.watch;
  for (let key in watch) {
    const handler = watch[key]; // 字符串 数组 函数
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher(vm, key, handler) {
  // 字符串  函数
  if (typeof handler === 'string') {
      handler = vm[handler];
  }
  return vm.$watch(key, handler)
}

function initComputed(vm) {
  const computed = vm.$options.computed;
  const watchers = vm._computedWatchers = {}; // 将计算属性watcher保存到vm上
  for (let key in computed) {
    let userDef = computed[key];

    // 函数和对象形式
    let fn = typeof userDef === 'function' ? userDef : userDef.get

    // 计算属性watcher
    watchers[key] = new Watch(vm, fn, { lazy: true })

    defineComputed(vm, key, userDef);
  }
}
function defineComputed(vm, key, userDef) {
  const setter = userDef.set || (() => { })

  // 挂载vm且设置代理
  Object.defineProperty(vm, key, {
    get: createComputedGetter(key),
    set: setter
  })
}

// 脏值求值，非脏值取缓存
function createComputedGetter(key) {
  return function () {
    const watcher = this._computedWatchers[key]; // 获取到对应属性的watcher
    if (watcher.dirty) {
      // 脏值则更新
      watcher.evaluate();
    }
    /* 
      如果Dep.target在计算watcher出栈后还存在，说明了前一个watcher的get()中包含了此计算watcher的get()
      说明前一个watcher执行时访问了计算属性，说明计算属性也是这个watcher的依赖
      所以需要在计算属性的watcher中拿到计算属性的依赖的dep,用他们的dep存储前一个watcher

      即计算属性中的依赖收集了计算属性的watcher,和用到了计算属性的watcher
    */
    if (Dep.target) {
      watcher.depend();
    }
    return watcher.value; // 最后返回的是watcher上的值
  }
}

function initMethods() { }


function proxy(vm, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm._data[key]
    },
    set(newValue) {
      vm._data[key] = newValue
    }
  })
}

export function initStateMixin(Vue) {
  Vue.prototype.$nextTick = nextTick;
  Vue.prototype.$watch = function (exprOrFn, cb) {
      // watch注册的变量变化了则执行cb函数
      new Watch(this, exprOrFn, { user: true }, cb)
  }
}
