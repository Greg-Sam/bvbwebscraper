let string = 'document.query'
let nav = '.elementSibling'

let array = [1, 2, 3, 4, 5, 6]

const stringGrower = () => {
  string = string + nav
  console.log(string)
}

array.map(stringGrower)