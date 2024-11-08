console.log('1')

setTimeout(() => {
  console.log('2')
}, 0)

console.log('3')


// *===================== 分割线 =====================* //


let i = 1;

setTimeout(function run() {
  console.log('setTimeout', i);
  i++;
  setTimeout(run, 1000);
}, 1000);


// *===================== 分割线 =====================* //


let j = 1;

setInterval(function run() {
  console.log('setInterval', j);
  j++
}, 1000);