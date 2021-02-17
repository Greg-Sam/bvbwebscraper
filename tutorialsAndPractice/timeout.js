function myFunc(arg, more) {
  console.log(`arg was => ${arg} ${more}`);
}

setTimeout(myFunc, 100, 'happy', 'boy');