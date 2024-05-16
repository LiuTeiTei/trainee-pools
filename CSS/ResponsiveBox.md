## 响应式 Web 设计

> 如果你预计网站的大部分流量来自移动端，那么应该采取“移动端优先”的策略，再为PC端做兼容。
>
> 如果你预计网站的大部分流量来自PC端，那么应该采取“PC端优先”的策略，再为移动端做兼容。



### 媒体查询

> CSS3 新技术

+ ```css
  @media (max-height: 800px) {
    p {
      font-size: 12px;
    }
  }
  ```



### 使图片根据设备尺寸自如响应

+ ```css
  img {
    display: block;
    max-width: 100%;
    height: auto;
  }
  ```



### 针对高分辨率屏幕应使用视网膜图片

+ 为优化图片在高分辨率设备下的显示效果，最简单的方式是定义它们的 `width`和 `height`值为源文件宽高的一半。



### 使排版根据设备尺寸自如响应

除了用 `em` 或 `px` 去设置文本大小, 你还可以用视窗单位来做响应式排版。视窗单位还有百分比，它们都是相对单位，但却基于不同的参照物。视窗单位相对于设备的视窗尺寸 (宽度或高度) ，百分比是相对于父级元素的大小。

四个不同的视窗单位分别是：

- `vw` ：如 `10vw` 的意思是视窗宽度的 10%。
- `vh` ：如 `3vh` 的意思是视窗高度的 3%。
- `vmin` ：如 `70vmin` 的意思是视窗中较小尺寸的 70% (高度 VS 宽度)。
- `vmax` ：如 `100vmax` 的意思是视窗中较大尺寸的 100% (高度 VS 宽度)。



## External Link

+ [FreeCodeCamp - 响应式 Web 设计原则](https://learn.freecodecamp.one/responsive-web-design/responsive-web-design-principles) 