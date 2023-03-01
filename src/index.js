import { initLifeCycle } from "./lifecycle"
import { initMixin } from "./init"
import { initGlobalAPI } from "./globalAPI"
import { initStateMixin } from "./initState"

function Vue(options) {
  //初始化
  this._init(options)
}
initMixin(Vue)
initLifeCycle(Vue)
initGlobalAPI(Vue)
initStateMixin(Vue)
export default Vue