function f1(){
  var dfd = $.Deferred(); 

  setTimeout(function () { 
    // f1的任务代码    
    dfd.resolve();  
  }, 500);
  
  return dfd.promise;  
}

f1().then(f2);


// *===================== 分割线 =====================* //


fetch('products.json')
.then(function (response) {
  return response.json()
}).then(function (json) {
  products = json
  initialize()
}).catch(function (err) {
  console.log('Fetch problem: ' + err.message)
})
