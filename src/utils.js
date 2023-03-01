const strats = {}
const LIFECYCLE_hook = [
  'beforeCreate',
  'created'
]
LIFECYCLE_hook.forEach(hook => {
  /* 
    初始：旧：undefined 新：fn 返回 [fn]
    旧：[fn] 新：undefined 返回 [fn]
    旧：[fn] 新：fn 返回 [fn,fn]
  */
  strats[hook] = function (p, c) {
    if (c) {
      if (p) {
        return p.concat(c)
      } else {
        return [c]
      }
    } else {
      return p
    }
  }
})

export function mergeOptions(parent, child) {
  const options = {}
  for (let key in parent) {
    mergeField(key)
  }
  for (let key in child) {
    if (!parent.hasOwnProperty(key)) {  // 相同属性已经设置过
      mergeField(key)
    }
  }

  function mergeField(key) {
    if (strats[key]) { // 生命周期选项
      options[key] = strats[key](parent[key], child[key])
    } else {
      options[key] = child[key] || parent[key]  // 优先取新选项
    }
  }
  return options
}

