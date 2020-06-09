const sum = (a, b) => {
  if (a && b) {
    return a + b;
  }

  throw new Error('Invalid Argument'); //Application crashes due to unhandled errors, can use try...catch for sync code.
}

try {
  console.log(sum(1))
} catch (error) {
  console.log('Error Occured!');
  console.log(error)
}

console.log('This works');

// Async is done with then...catch