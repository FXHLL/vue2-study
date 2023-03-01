
// * 0或多  + 1或多  ? 0或1  (?:)不捕获分组  [^xx]除xx以外 \s空白符 
const ncname = '[a-zA-Z_][\\-\\.0-9_a-zA-Z]*' // 标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})` // (?:${ncame}\\:)? xml的命名空间
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 捕获开始标签名
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 捕获 key=value 或 key
const startTagClose = /^\s*(\/?)>/ // 捕获开始标签结束
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>*`) // 捕获结束标签名

// 生成 对应 ast对象
let root  // 根元素
let createParent   // 栈顶元素
let stack = []

function createASTElement(tagName, attrs,type=1,text) {
  return {
    tagName,
    attrs,
    children: [],
    type,
    text,
    parent: null
  }
}

function start(tagName, attrs) {
  const element = createASTElement(tagName, attrs)
  if (!root) {
    root = element
  }
  createParent = element
  stack.push(element)
}
function charts(text) {
  text = text.replace(/s/g, '')
  if (text) {
    createParent.children.push({
      type: 3,
      text,
      parent:createParent
    })
  }
}
function end(tagName) {
  const element = stack.pop() //元素闭合出栈
  createParent = stack[stack.length - 1]
  if (createParent) { //处理元素层级
    element.parent = createParent.tagName
    createParent.children.push(element)
  }
}

// html捕获
function parseHTML(html) {
  // <div id="app"><span>number:{{a}}</span><span>...</span></div>
  /* 
    搜索html字符串中 < 的位置，判断当前字符串内容
    1.textEnd === 0 标签
    2.textEnd > 0 文本或注释 + 标签
    3.textEnd < 0 文本或注释或空
  */
  while (html) {
    let textEnd = html.indexOf('<')
    if (textEnd === 0) {
      // debugger
      // 开始标签
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
      }
      // 结束标签
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
      }
      continue;
    }
    if (textEnd > 0) {
      let text = html.slice(0, textEnd)
      if (text) {
        advance(text.length)
        charts(text)
      }
    }
  }
  // 解析开始标签
  function parseStartTag() {
    const start = html.match(startTagOpen)  // T:匹配内容 捕获组1...  F:null
    if (!start) return
    const match = {
      tagName: start[1],
      attrs: [],
    }
    advance(start[0].length)
    let attr
    let end
    // 没匹配闭合标签且匹配到了属性
    while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
      match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
      advance(attr[0].length)
    }
    if (end) {
      advance(end[0].length)
    }
    return match
  }
  // 字符串删除
  function advance(n) {
    html = html.slice(n)
  }

  return root
}

export {parseHTML}