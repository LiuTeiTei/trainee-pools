+ `columns` 在伸缩容器上没有效果。
+ `float` 、`clear` 和 `vertical-align` 在伸缩项目上没有效果。
+ `white-space: nowrap` 和 `display:flex` 是存在冲突的。



## 弹性盒子

> 网页的用户界面（User Interface 缩写 UI）包括两个部分：第一部分是视觉要素，如色彩、字体和图片等；第二部分是这些元素的排列和定位。
>
> 在响应式 Web 设计中，UI 布局必须适配不同尺寸的设备。



## 伸缩容器属性

+ `display`	添加了 `display: flex` 的元素会成为 flex 容器。其所有的子元素将变成 flex 文档流：伸缩项目。
  + flex
  + Inline-flex
+ `flex-direction`	定义伸缩项目放置在伸缩容器的方向
  + row	(default)
  + row-reverse
  + column
  + column-reverse
+ `flex-wrap`	定义伸缩容器里是单行还是多行显示，**当伸缩项目超过伸缩容器的容量时才有效果**，侧轴的方向决定了新行堆放的方向。
  + nowrap	(default)
  + wrap  多行
  + wrap-reverse
+ `flex-flow`    flex-direction 和 flex-wrap 属性的复合属性
+ `align-items`	定义伸缩项目可以在伸缩容器的当前行的侧轴上对齐方式。**在没有设置高度（按行布局）的情况下，默认的 stretch 会使伸缩项目的外边距盒的尺寸在遵照「min/max-width/height」属性的限制下尽可能接近所在行的尺寸**，其余的属性值会默认伸缩项目的高是内容的高度，可以实现内容均中对齐
  + stretch	(default)
  + center    均中对齐
  + baseline
  + flex-start    紧靠侧轴起始的边
  + flex-end
+ `justify-content` 用于**设置或检索弹性盒子元素在主轴（横轴）方向上的对齐方式**。flex 容器里的 flex 子元素有时不能充满整个容器，所以我们需要告诉 CSS 如何以特定方案排列和调整 flex 子元素。
  + flex-start    （default）项目位于容器的开头。
  + flex-end     项目位于容器的结尾。
  + center    项目位于容器的中心。
  + space-between    项目位于各行之间留有空白的容器内。
  + space-around    项目位于各行之前、之间、之后都留有空白的容器内。
  + initial    设置该属性为它的默认值。
  + inherit    从父元素继承该属性。



## 伸缩项目属性

+ `flex-grow`	默认值为0，决定**伸缩容器剩余空间按比例应扩展多少空间**，接受一个不带单位的值做为一个比例，负值有效。如果 flex 容器太大，该项目会自动扩大。
+ `flex-shrink`	默认值为1，根据需要用来**定义伸缩项目收缩的能力**，负值有效。使用之后，如果 flex 容器太小，该项目会自动缩小。当容器的宽度小于里面所有项目的宽度，项目就会自动压缩。数值越大，与其他项目相比会被压缩得更厉害。
+ `flex-basic`	用来设置伸缩基准值（初始值），剩余的空间按比率进行伸缩，负值不合法。flex-basis 和 width 同时设置时，如果 flex-basis 的值不为 auto 则权重比 width 大。
  + auto	（default）长度等于灵活项目的长度，如果该项目未指定长度，则长度将根据内容决定。
  + number	一个长度单位或者一个百分比，规定灵活项目的初始长度。
  + initial    设置该属性为它的默认值。
  + inherit    从父元素继承该属性。
+ `flex`	上面三个属性的缩写，后两个属性是可选的。
+ `align-self`	用来在单独的伸缩项目上覆写默认的对齐方式，属性值和 `align-item` 一致。
  + stretch	(default)
  + center    均中对齐
  + baseline
  + flex-start    紧靠侧轴起始的边
  + flex-end
+ `order`     告诉 CSS flex 容器里项目的顺序。默认情况下，项目排列顺序与源 HTML 文件中顺序相同。这个属性接受数字作为参数，可以使用负数。



## 例子
```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"> 
<title>W3Cschool教程(w3cschool.cn)</title> 
<style> 

.wrapper {
    background-color: #ccc;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
}

.header {
    background-color: red;
    height: 100px;
    width: 100%;
    order: 1;
}

.footer {
    background-color: red;
    height: 100px;
    width: 100%;
    order: 5;
}

.leftAside {
    background-color: blue;
    height: 300px;
    flex: 1;
    order: 2;
}

.rightAside {
    background-color: blue;
    height: 300px;
    flex: 1;
    order: 4;
}

.content {
    background-color: green;
    height: 300px;
    flex: 4;
    order: 3;
}


</style>
</head>
<body>
    
<div class="wrapper">
    <div class="header">header</div>
    <div class="leftAside">leftAside</div>
    <div class="rightAside">rightAside</div>
    <div class="content">content</div>
    <div class="footer">footer</div>
</div>

</body>
</html>
```



## External Link

+ [FreeCodeCamp - CSS 弹性盒子介绍](https://learn.freecodecamp.one/responsive-web-design/css-flexbox) 
+ [一个完整的Flexbox指南](https://www.w3cplus.com/css3/a-guide-to-flexbox.html) 
+ [Flex 布局语法教程](https://www.runoob.com/w3cnote/flex-grammar.html) 



## 扩展

+ [控制Flex子元素在主轴上的比例](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout/Controlling_Ratios_of_Flex_Items_Along_the_Main_Ax)
+ [Oh My God，CSS flex-basis原来有这么多细节](https://www.zhangxinxu.com/wordpress/2019/12/css-flex-basis/) 
+ [flex-basis和width](https://juejin.cn/post/6916762468710613000)