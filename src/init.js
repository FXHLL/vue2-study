import { initState } from './initState'
import { compileToFunction } from './compile/index'
import { callHook, mountComponent } from './lifecycle'
import { mergeOptions } from './utils'
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    let vm = this
    vm.$options = mergeOptions(this.constructor.options, options) // 合并选项
    callHook(vm,'beforeCreate')
    // 初始化 data computed watcher
    initState(vm)
    // 渲染模板
    callHook(vm,'created')
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
  //创建 $mount
  Vue.prototype.$mount = function (el) {
    let vm = this
    el = document.querySelector(el)
    let options = vm.$options
    // render 比 template 优先级高
    if (!options.render) {
      let template
      if (!options.template && el) {  //没template
        template = el.outerHTML
      } else {
        if(el) {  // 有template
          template = options.template
        }
      }
      if(template && el) {
        const render = compileToFunction(template)
        options.render = render
      }
    }
    mountComponent(vm, el)
  }
}


