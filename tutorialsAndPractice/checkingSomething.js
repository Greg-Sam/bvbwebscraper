const myFunction = (x, y) => {
  let sum = x + y
  return(sum)
}

for (let i = 0; i <10; i++) {

  console.log(myFunction(i, i+1));
  
}
module.exports = myFunction