function f1(){
  setTimeout(function () { 
    // f1的任务代码 
    jQuery.publish("done");
  }, 1000); 
}

jQuery.subscribe("done", f2);

jQuery.unsubscribe("done", f2);