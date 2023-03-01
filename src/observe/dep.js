/* 
  dep是属性管理watcher的实例
*/
let id = 0
class Dep{
  constructor(){
    this.id = id++
    this.subs = []

  }
  depend() {
    Dep.target.addDep(this) // 访问全局变量里的watcher，完成watcher对dep的收集，dep对watcher的收集
  }
  addSub(watcher) {
    this.subs.push(watcher) // dep收集watcher
  }
  notify() {
    this.subs.forEach(watcher => watcher.update()) // 通知watcher更新
  }
}
const stack = []
export function pushTarget(watcher) {
  stack.push(watcher)
  Dep.target = watcher
}
export function popTarget(watcher) {
  stack.pop()
  Dep.target = stack[stack.length - 1]
}

export default Dep 