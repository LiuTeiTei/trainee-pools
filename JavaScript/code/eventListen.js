function f1(){
  setTimeout(function () {
    // f1的任务代码  
    f1.trigger('done');  
  }, 1000);  
}
  
f1.on('done', f2);


// *===================== 分割线 =====================* //


const buttonElement = document.getElementById('btn');

// Add a handler for the 'click' event by providing a callback function.
// Whenever the element is clicked, a pop-up with "Element clicked!" will
// appear.
buttonElement.addEventListener('click', function (event) {
  alert('Element clicked through function!');
});

// 由于兼容性原因，一个带有 handleEvent 函数属性的对象也可以达到相同的效果。
buttonElement.addEventListener('click', {
  handleEvent: function (event) {
    alert('Element clicked through handleEvent property!');
  }
});