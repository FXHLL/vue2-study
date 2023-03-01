/* 
  observe:对传入值进行数据劫持
  1.对object的key设置gettter,seetter,在其中通过闭包存储dep类，实现watcher搜集
    对arr的数组值新增
  3.递归重复,处理对象多层级
*/
import { ArrayMethods } from './arr'
import Dep from './dep'

export function observe(data) {
  if(typeof data !== 'object' || data == null){
    return // 只对对象代理
}
if(data.__ob__ instanceof Observer){ // 代理过了
    return data.__ob__;
}
return new Observer(data);
}

class Observer {
  constructor(data) {
    this.dep = new Dep()  // 对象本身的dep
    Object.defineProperty(data,'__ob__',{ // __ob__指向实例，可以取到对象的dep，还有标识作用
      enumerable:false,
      value:this
    })
    // console.log('层级代理', data)
    if (Array.isArray(data)) {
      // 数组代理
      data.__proto__ = ArrayMethods
      this.observerArray(data)
    } else {
      // 对象代理
      this.walk(data)
    }
  }
  walk(data) {
    let keys = Object.keys(data)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const value = data[key]
      defineReactive(data, key, value)

    }
  }
  observerArray(data) {
    for (let i = 0; i < data.length; i++) {
      observe(data[i])
    }
  }
}

function defineReactive(data, key, value) {
  let childOb = observe(value)  // 递归此逻辑 + 返回对象的dep
  const dep = new Dep() // 属性的dep
  Object.defineProperty(data, key, {
    get() {
      console.log(`${key}  被访问`)
      /* 
        watcher与dep的双向收集
        此处属性dep和对象dep是同步收集的，
        即保证了watcher的收集是一致的
        所以使得数组新增后通过__ob__属性访问到数组对应的Observer实例
        从而拿到dep属性进行watcher的通知
      */
      if(Dep.target){
        dep.depend() //属性dep
        if(childOb){
          childOb.dep.depend()  // 对象dep
          if(Array.isArray(value)) {  //子集数组的dep收集
            dependArray(value)
          }
        }
      }
      return value
    },
    set(newValue) {
      if(key === 'pid') debugger;
      console.log(`${key}  被设置  ${newValue}`)
      if (newValue === value) return value
      observe(newValue) // 新值可能需要代理
      value = newValue
      dep.notify()  // watcher执行
    }
  })
}

// 层级数组依赖收集
function dependArray(value){
  for(let i = 0; i < value.length;i++){
      let current = value[i]
      current.__ob__ && current.__ob__.dep.depend();
      if(Array.isArray(current)){
          dependArray(current);
      }
  }
}
