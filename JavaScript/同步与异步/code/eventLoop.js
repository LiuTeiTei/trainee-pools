console.log('Starting')

new Promise((resolve, reject) => {
  // do something
  resolve('fetch')
}).then(response => {
  // do something
  console.log('It worked :)')
}).catch(error => {
  // do something
  console.log('It worked :(')
})

console.log('All done!')


// *===================== 分割线 =====================* //