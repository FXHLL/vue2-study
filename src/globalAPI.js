import {mergeOptions} from './utils'

export function initGlobalAPI(Vue) {
  Vue.options = {}
  Vue.mixin = function(mixin) {
    // 将传入选项和全局选项进行合并
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}