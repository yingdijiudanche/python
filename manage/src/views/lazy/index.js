// const first = import.meta.glob('./*.jsx')
const first = import.meta.globEager('./*.jsx')
const second = import.meta.globEager('./*/*.jsx')
const third = import.meta.globEager('./*/*/*.jsx')

const linkReg = /[^./](\S*)(?=.jsx)/
const lazyPagesKeyValue = {}

function conver2obj(modules) {
  for (const path in modules) {
    let key = linkReg.exec(path)[0]
    lazyPagesKeyValue[key] = modules[path].default
    // lazyPagesKeyValue[key] = modules[path];
  }
}
conver2obj(first)
conver2obj(second)
conver2obj(third)
// console.log(lazyPagesKeyValue);
export default lazyPagesKeyValue
