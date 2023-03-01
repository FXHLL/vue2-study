/* 
  ast对象       -->       代码字符串
  _c(标签名,属性，子集)
  _v(文本) _s(文本变量处理)
*/

export { codegen }

function codegen(ast) {
  const tagName = ast.tagName
  const attrObj = ast.attrs.length
    ? genProps(ast.attrs)
    : 'null'
  const children = ast.children.length
    ? `${genChildren(ast.children)}`
    : ''
  const code = `_c("${tagName}",${attrObj},${children})`
  return code
}
function genProps(attrs) {
  let str = ''
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i]
    if (attr.name === 'style') {
      let obj = {}
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':')
        obj[key] = value
      })
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }
  return `{${str.slice(0, -1)}}`
}

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // 捕获插值表达式内变量

function genChildren(children) {
  return children.map(child => gen(child)).join(',')
}

function gen(node) {
  if (node.type === 1) {
    return codegen(node)
  } else {
    let text = node.text
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`
    } else {
      // 插值表达式解析
      let tokens = []
      let match
      defaultTagRE.lastIndex = 0
      let lastIndex = 0 // 记录上一次匹配index+匹配长度
      while (match = defaultTagRE.exec(text)) {
        const index = match.index //当前匹配位置
        if (index > lastIndex) { // ---{{data}} 取---
          tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        tokens.push(`_s(${match[1].trim()})`)
        lastIndex = index + match[0].length
      }
      if (lastIndex < text.length) {  // {{data}}--- 取---
        tokens.push(JSON.stringify(text.slice(lastIndex)))
      }
      return `_v(${tokens.join('+')})`
    }
  }
}