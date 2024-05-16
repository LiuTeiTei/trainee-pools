## 大小

相对单位（比如 em），绝对单位（比如 px），或者包含块（父元素）宽度的百分比。



## 颜色

### 互补色

+ 色环是一个近色相邻异色相离的圆环，当两个颜色恰好在色环的两端时，这两个颜色叫做补色。绘画中两只补色在混合后会变成灰色。补色搭配能形成强列的对比效果，传达出活力、能量、兴奋等意义。

### 三原色

+ 两种原色相加产生二次色：蓝绿（G+B）、品红（R+B）和黄色（R+G）。
+ 这些二次色恰好是在合成它们时未使用的原色的补色，即在色环中位于两端。例如，品红色是红色和蓝色相加产生，它是绿色的补色。
+ 三次色是由原色和二次色相加产生的颜色，例如红色（原色）和黄色（二次色）相加产生橙色。将这六种颜色中相邻的颜色相加，便产生了十二色色环。
+ 设计里面有很多种颜色搭配方法。涉及到三次色的一种配色方法是分裂补色搭配法。选定主色之后，在色环上选择与它的补色相邻的两种颜色与之搭配。此种搭配既有对比，又不失和谐。
  + 下面是使用分裂补色搭配法创建的三个颜色：
  + 橙色：#FF7D00；蓝绿色：#00FFFF；树莓红：#FF007D。

### HEX 颜色码

+ 浏览器 17 种标准色？

### rgba()

+ rgba 代表：r = red 红色；g = green 绿色；b = blue 蓝色；a = alpha 透明度。
+ RGB 值可以在 0 到 255 之间。alpha 值可以在 0 到 1 之间，其中 0 代表完全透明，1 代表完全不透明。

### hsl()

#### HSL 色彩空间模型

+ HSL 色彩空间模型是一种将 RGB 色彩模型中的点放在圆柱坐标系中的表示法，描述了色相（hue）、饱和度（saturation）、亮度（lightness）。

#### 色相

+ **色相**是色彩的基本属性，就是平常所说的颜色名称，如红色、黄色等。以颜色光谱为例，光谱左边从红色开始，移动到中间的绿色，一直到右边的蓝色，色相值就是沿着这条线的取值。在`hsl()`里面，色相用色环来代替光谱，色相值就是色环里面的颜色对应的从 0 到 360 度的角度值。

#### 饱和度

+ **饱和度**是指色彩的纯度，也就是颜色里灰色的占比，越高色彩越纯，低则逐渐变灰，取0-100%的数值。

#### 亮度

+ **亮度**决定颜色的明暗程度，也就是颜色里白色或者黑色的占比，100% 亮度是白色， 0% 亮度是黑色，而 50% 亮度是“一般的”。

#### hsl()

+ CSS3 引入了对应的 `hsl()` 属性做为对应的颜色描述方式。
+ 下面是一些使用 `hsl()` 描述颜色的例子，颜色都为满饱和度，中等亮度：
  + 红：hsl(0, 100%, 50%)
  + 黄：hsl(60, 100%, 50%)
  + 绿：hsl(120, 100%, 50%)
  + 蓝绿：hsl(180, 100%, 50%)
  + 蓝：hsl(240, 100%, 50%)
  + 品红：hsl(300, 100%, 50%)

### 颜色渐变

+ HTML 元素的背景色并不局限于单色。CSS 还提供了颜色过渡，也就是渐变。可以通过 `background` 里面的 `linear-gradient()` 来实现线性渐变

  + 语法：`background: linear-gradient(gradient_direction, 颜色 1, 颜色 2, 颜色 3, ...);` 
  + 参数指定了颜色过渡的方向 - 它的值是角度，90deg 代表垂直渐变，45deg 的渐变角度和反斜杠方向差不多。剩下的参数指定了渐变颜色的顺序。

+ `repeating-linear-gradient()` 函数和 `linear-gradient()` 很像，主要区别是 `repeating-linear-gradient()` 重复指定的渐变。

  +  `repeating-linear-gradient()` 有很多参数，为了便于理解，这里只用到角度值和起止渐变颜色值。

  + 角度就是渐变的方向。起止渐变颜色值代表渐变颜色及其宽度值，由颜色值和起止位置组成，起止位置用百分比或者像素值表示。

  + ```css
    background: repeating-linear-gradient(
      90deg,
      yellow 0px,
      blue 40px,
      green 40px,
      red 80px
    );
    ```

    + `0px [黄色 -- 过渡 -- 蓝色] 40px [绿色 -- 过渡 -- 红色] 80px` 
    + 渐变开始于 0 像素位置的 `yellow`，然后过渡到距离开始位置 40 像素的 `blue`。由于下一个起止渐变颜色值的起止位置也是 40 像素，所以颜色直接渐变成第三个颜色值 `green`，然后过渡到距离开始位置 80 像素的 `red`。
    + 如果每对起止渐变颜色值的颜色都是相同的，由于是在两个相同的颜色间过渡，那么中间的过渡色也为同色，接着就是同色的过渡色和下一个起止颜色，最终产生的效果就是条纹。





## 文本类标签

### `<u>` 

### `<s>` 

### `<b>` & `<strong>`

### `<i>` & `<em>`

[知乎：HTML5 中的 b/strong，i/em 有什么区别？](https://www.zhihu.com/question/19551271) 

https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-b-element

### `<hr>` 



## 文本类样式

### text-align

> 控制文本的对齐方式。

+ `text-align: justify;` 可以让除最后一行之外的文字两端对齐，即每行的左右两端都紧贴行的边缘。
+ `text-align: center;` 可以让文本居中对齐。
+ `text-align: right;` 可以让文本右对齐。
+ `text-align: left;` 是`text-align`的默认值，它可以让文本左对齐。

### text-transform

> 改变英文中字母的大小写。



### line-height

> 设置行间的距离。

+ 设置每行文字所占据的垂直空间。



### font-size

> 设置元素内文字的大小。



### font-weight

> 设置文本中所用的字体的粗细。



## 背景类样式

### opacity

> 设置元素的透明度。

+ 值 1 代表完全不透明；值 0 代表完全透明。
+ 透明度会应用到元素内的所有内容，不论是图片，还是文本，或是背景色。

### background

+ background: linear-gradient()
  + 实现线性渐变
+ background: repeating-linear-gradient()
  + 重复指定的渐变
+ background: url()
  + 通过链接的方式引入一个指定纹理或样式的图片。图片链接地址在括号内，一般会用引号包起来。

### background-color



## 3D

### transform

+  `scale()` 函数可以用来改变元素的显示比例。

  + ```css
    transform: scale(2.1);
    ```

+ `skewX` 使选择的元素沿着 X 轴（横向）翻转指定的角度。

  + ```css
    transform: skewX(-32deg);
    ```

+ `skewY`属性使指定元素沿 Y 轴（垂直方向）翻转指定角度。

  + ```css
    transform: skewY(-32deg);
    ```



## 动画

`animation` 属性控制动画的外观，`@keyframes` 规则控制动画中各阶段的变化。总共有 8 个 `animation` 属性。

+ `animation-name` 设置动画的名称， 也就是要绑定的选择器的 `@keyframes` 的名称。

+ `animation-duration` 设置动画所花费的时间。

+ `animation-fill-mode` 指定了在动画结束时元素的样式。

+ `animation-iteration-count` 控制动画循环的次数。

+ `animation-timing-function` 规定动画的速度曲线。

  + 默认的值是 `ease`，动画以低速开始，然后加快，在结束前变慢。其它常用的值包括 `ease-out`，动画以高速开始，以低速结束；`ease-in`，动画以低速开始，以高速结束；`linear`，动画从头到尾的速度是相同的。

  + 在 CSS 动画里，用 `cubic-bezier` 来定义贝塞尔曲线。

    + 曲线的形状代表了动画的速度。曲线在 1*1 的坐标系统内，曲线的 X 轴代表动画的时间间隔（类似于时间比例尺），Y 轴代表动画的改变。

    + `cubic-bezier` 函数包含了 1 * 1 网格里的4个点：`p0`、`p1`、`p2` 和 `p3`。其中 `p0` 和 `p3` 是固定值，代表曲线的起始点和结束点，坐标值依次为 (0, 0) 和 (1, 1)。你只需设置另外两点的 x 值和 y 值，设置的这两点确定了曲线的形状从而确定了动画的速度曲线。

    + 在 CSS 里面通过 `(x1, y1, x2, y2)` 来确定 `p1` 和 `p2`。

    + 综上，下面就是 CSS 贝塞尔曲线的例子：

      + linear：
    
        + ```css
        animation-timing-function: cubic-bezier(0.25, 0.25, 0.75, 0.75);
          ```
    
        + 在上面的例子里，两个点的 x 和 y 值相等（x1 = 0.25 = y1 和 x2 = 0.75 = y2），如果你还记得初中几何，结果是从原点到点 (1, 1) 的一条直线。动画速度呈线性，效果和 `linear` 一致。换言之，元素匀速运动。
        
      + easy-out
      
        + ```css
          animation-timing-function: cubic-bezier(0, 0, 0.58, 1);
          ```
      
        + 在这个例子里，曲线在 y 轴（从 0 开始，运动到 `p1` 的 0，然后运动到 `p2` 的 1）上移动的比在 x 轴（从 0 开始，运动到 `p1` 的 0，到 `p2` 的 0.58）上移动的快。结果是，在这一段动画内元素运动的快。到曲线的结尾，x 和 y 之间的关系反过来了，y 值保持为1，没有变化，x 值从 0.58 变为 1，元素运动的慢。

+ `@keyframes`能够创建动画。 创建动画的原理是将一套 CSS 样式逐渐变化为另一套样式。具体是通过设置动画期间对应的“frames”的 CSS 的属性，以百分比来规定改变的时间，或者通过关键词“from”和“to”，等价于 0% 和 100%。打个比方，CSS 里面的 0% 属性就像是电影里面的开场镜头。CSS 里面的 100% 属性就是元素最后的样子，相当于电影里的演职员表或者鸣谢镜头。CSS 在对应的时间内给元素过渡添加效果。

+ 例子

  + ```css
    <style>
      button {
        border-radius: 5px;
        color: white;
        background-color: #0F5897;
        padding: 5px 10px 8px 10px;
      }
      button:hover {
        animation-name: background-color;
        animation-duration: 500ms;
        animation-fill-mode: forwards;
      }
      @keyframes background-color {
        100% {
          background-color: #4791d0;
        }
      }
    </style>
    <button>注册</button>
    ```

  + ```html
    // 心跳
    <style>
      .back {
        position: fixed;
        padding: 0;
        margin: 0;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        animation-name: backdiv;
        animation-duration: 1s; 
        animation-iteration-count: infinite;
      }
    
      .heart {
        position: absolute;
        margin: auto;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: pink;
        height: 50px;
        width: 50px;
        transform: rotate(-45deg);
        animation-name: beat;
        animation-duration: 1s;
        animation-iteration-count: infinite;
      }
      .heart:after {
        background-color: pink;
        content: "";
        border-radius: 50%;
        position: absolute;
        width: 50px;
        height: 50px;
        top: 0px;
        left: 25px;
      }
      .heart:before {
        background-color: pink;
        content: "";
        border-radius: 50%;
        position: absolute;
        width: 50px;
        height: 50px;
        top: -25px;
        left: 0px;
      }
    
      @keyframes backdiv {
        50% {
          background: #ffe6f2;
        }
      }
    
      @keyframes beat {
        0% {
          transform: scale(1) rotate(-45deg);
        }
        50% {
          transform: scale(0.6) rotate(-45deg);
        }
      }
    
    </style>
    <div class="back"></div>
    <div class="heart"></div>
    ```

    



## 盒模型

### box-shadow

> 给元素添加阴影，该属性值是由逗号分隔的一个或多个阴影列表。

+ `box-shadow `属性的每个阴影依次由下面这些值描述：
  - `offset-x` 阴影的水平偏移量；
  - `offset-y` 阴影的垂直偏移量;
  - `blur-radius` 模糊距离；
  - `spread-radius` 阴影尺寸；
  - 颜色。
+ 其中 `blur-raduis` 和 `spread-raduis` 是可选的。

### border-radius

> 控制元素的圆角边框。

+ 制作一个🌙

  + ```html
    <style>
    .center
    {
      position: absolute;
      margin: auto;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100px;
      height: 100px;
      
      background-color: transparent;
      border-radius: 50%;
      box-shadow: 25px 10px 0 0 yellow; 
    }
    
    </style>
    <div class="center"></div>
    ```

+ 制作一个❤️

  + ```css
    <style>
    .heart {
      position: absolute;
      margin: auto;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: red;
      height: 50px;
      width: 50px;
      transform: rotate(-45deg);
    }
    .heart:after {
      background-color: red;
      content: "";
      border-radius: 50%;
      position: absolute;
      width: 50px;
      height: 50px;
      top: 0px;
      left: 25px;
    }
    .heart:before {
      content: '';
      background-color: red;
      border-radius: 50%;
      position: absolute;
      width: 50px;
      height: 50px;
      top: -25px;
      left: 0px;
    }
    </style>
    <div class = "heart"></div>
    ```

    



## 元素位置





## External Links

[freeCodeCamp: Applied Visual Design Challenges](https://learn.freecodecamp.one/responsive-web-design/applied-visual-design) 