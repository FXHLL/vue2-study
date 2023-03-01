/* 
  1.html字符串->ast语法树
  对html字符串进行match,将匹配内容删除，将捕获内容传入对应节点分类的函数生成ast语法树
  2.ast语法树->变成render
  ast->拼接字符串->函数
*/
import { parseHTML } from './parseHTML'
import { codegen } from './gengerate'


export function compileToFunction(el) {
  const ast = parseHTML(el)
  console.log('ast:', ast)

  let code = codegen(ast)
  console.log(code)

  code = `with(this){return ${code}}`
  const render = new Function(code)
  return render
}


