// 原型嫁接，在中间重写同名原型方法
const oldArrayProtoMethods = Array.prototype
const ArrayMethods = Object.create(oldArrayProtoMethods)

const methods = [
  'push',
  'pop',
  'unshift',
  'shift',
  'splice'
]

// 数组劫持
methods.forEach(item => {
  ArrayMethods[item] = function (...args) {
    let result = oldArrayProtoMethods[item].apply(this, args)
    let inserted  // 记录数组新增项
    switch (item) {
      case 'push':
      case 'unshift':
        inserted = args
        break;
      case 'splice':
        inserted = args.splice(2)
        break;
    }
    let ob = this.__ob__
    if(inserted) {
      // 对新增项的代理
      ob.observerArray(inserted)
    }
    ob.dep.notify() //通知更新
    return result
  }
})

export {ArrayMethods}
