## CSS 网格

父元素称为容器（container），它的子元素称为项（items）。



## 容器属性

+ `display` ：将类为 `container` 的 div 的 `display` 属性改为 `grid` 。

+ `grid-template-columns` ：**为网格设置列数**；属性值的个数表示网格的列数，而每个值表示对应列的宽度。

+ `grid-template-rows` ：**为网格设置行数**；属性值的个数表示网格的行数，而每个值表示对应行的高度。

+ 使用 **CSS 网格单位**来更改列和行的大小：在 CSS 网格中，可以使用绝对定位和相对定位单位来确定行或列的大小。

  + px；
  + em；
  + `fr`：设置列或行占剩余空间的一个比例；
  + `auto`：设置列宽或行高自动等于它的内容的宽度或高度；
  + `%`：将列或行调整为它的容器宽度或高度的百分比。

+ 使用 **minmax 函数**限制项目大小：在网格容器改变大小时限制网格项的大小。

  + ```css
    grid-template-columns: 100px minmax(50px, 200px);
    ```

  + 在上面的代码中，`grid-template-columns`被设置为添加两列，第一列 100px 宽，第二列宽度最小值是 50px，最大值是 200px。

+ `repeat` ：**指定行或列的重复次数**，后面加上逗号以及需要重复的值。

  + ```css
    grid-template-rows: repeat(100, 50px);
    ```

    + 添加 100 行网格的例子，使每行高度均为 50px。

  + ```css
    grid-template-columns: repeat(2, 1fr 50px) 20px;
    ```

    + 用 repeat 方法重复多个值，并在定义网格结构时与其他值一起使用。
    + 效果相当于：`grid-template-columns: 1fr 50px 1fr 50px 20px;` 

  + ```css
    grid-template-columns: repeat(3, minmax(60px, 1fr));
    ```

    + 设置重复 3 列，每列宽度最小值为`90px`，最大值为`1fr`。

  + `auto-fill` ：repeat 方法带有一个名为自动填充的功能。它的功能是**根据容器的大小，尽可能多地放入指定大小的行或列**。

    + 可以通过结合`auto-fill`和`minmax`来更灵活地布局。

    + ```css
      repeat(auto-fill, minmax(60px, 1fr));
      ```

    + 列的宽度会随容器大小改变，在可以插入一个 60px 宽的列之前，当前行的所有列会一直拉伸；

    + 如果容器无法使所有网格项放在同一行，余下的网格项将移至新的一行。

  + `auto-fit` ：效果几乎和`auto-fill`一样。不同点仅在于，当容器的大小大于各网格项之和时，`auto-fill`将会持续地在一端放入空行或空列，这样就会使所有网格项挤到另一边；而`auto-fit`则不会在一端放入空行或空列，而是会将所有网格项拉伸至合适的大小。

+ `grid-column-gap` ：在列与列之间添加一些间隙。

+ `grid-row-gap` ：在行与行之间添加一些间隙。

+ `grid-gap` ：`grid-row-gap` 和 `grid-column-gap` 的简写。

  + 一个值，行与行之间和列与列之间将添加等于该值的间隙；
  + 两个值，第一个值将作为行间隙的高度值，第二个值是列间隙的宽度值。

+ `justify-items` ：容器内所有项目的沿行轴对齐方式。

  + `stretch` ：内容占满整个单元格的宽度（default）；
  + `start`：使内容在单元格左侧对齐；
  + `center`：使内容在单元格居中对齐；
  + `end`：使内容在单元格右侧对齐。

+ `align-items` ：给网格中所有的网格项设置沿列轴对齐的方式。属性值同上。

+ `grid-template-areas` ：将网格中的一些网格单元格组合成一个区域（area），并为该区域指定一个自定义名称。

  + 在代码中，每个单词代表一个网格单元格，每对引号代表一行。

  + 除了自定义标签，你还能使用句点（`.`）来表示一个空单元格

  + ```css
    grid-template-areas:
      "header header header"
      "advert content content"
      "footer footer footer";
    ```

  + 上面的代码将顶部三个单元格合并成一个名为`header`的区域，将底部三个单元格合并为一个名为`footer`的区域，并在中间行生成两个区域————`advert`和`content`。

  + 配合项属性的 `grid-area` 使用



## 项属性

+ `grid-column` ：定义网格项开始和结束的位置，进而控制每个网格项占用的列数。

  + <img src="images/grid-column.png" alt="grid-column" style="zoom:50%;" />
  + 网格的假想水平线和垂直线被称为线（lines）。这些线在网格的左上角从 1 开始编号，垂直线向右、水平线向下累加计数。
  + 例如一个 3x3 网格的线条，`grid-column: 1 / 3` 会让网格项从左侧第一条线开始到第三条线结束，占用两列。

+ `grid-row` ：确定开始和结束的水平线，进而控制每个网格项占用的行数。

+ `justify-self` ：设置其内容的位置在单元格内沿行轴对齐的方式。

  + `stretch` ：内容占满整个单元格的宽度（default）；
  + `start`：使内容在单元格左侧对齐；
  + `center`：使内容在单元格居中对齐；
  + `end`：使内容在单元格右侧对齐。

+ `align-self` ：设置其内容的位置在单元格内沿列轴对齐的方式。属性值同上。

+ `grid-area` ：在为网格容添加区域模板后，你可以通过添加你定义的名称将网格项放入自定义区域。

  + ```css
    .item1 { grid-area: header; }
    ```

    + 这样，类名为`item1`的网格项就被放到了`header`区域里。这种情况下，网格项将使用整个顶行，因为这一行被名为 header 区域。

  + ```css
    .item1 { grid-area: 1/1/2/4; }
    ```

    + 如果网格中没有定义区域模板，你也可以像这样为它添加一个模板；
    + 上例中数字代表这些值：grid-area: 起始水平线 / 起始垂直线 / 末尾水平线 / 终止垂直线 ;
    + 因此，示例中的网格项将占用第 1 条和第 2 条水平线之间的行及第 1 条和第 4 条垂直线之间的列。

  + 配合容器属性的 `grid-template-areas` 使用。



## 例子

```css
<style>
  .item1 {
    background: LightSkyBlue;
    grid-area: header;
  }
  
  .item2 {
    background: LightSalmon;
    grid-area: advert;
  }
  
  .item3 {
    background: PaleTurquoise;
    grid-area: content;
  }
  
  .item4 {
    background: lightpink;
    grid-area: footer;
  }
  
  .container {
    font-size: 1.5em;
    min-height: 300px;
    width: 100%;
    background: LightGray;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 50px auto 1fr auto;
    grid-gap: 10px;
    grid-template-areas:
      "header"
      "advert"
      "content"
      "footer";
  }
  
  @media (min-width: 300px){
    .container{
      grid-template-columns: auto 1fr;
      grid-template-rows: auto 1fr auto;
      grid-template-areas:
        "advert header"
        "advert content"
        "advert footer";
    }
  }
  
  @media (min-width: 400px){
    .container{
      grid-template-areas:
        "header header"
        "advert content"
        "footer footer";
    }
  }
</style>
  
<div class="container">
  <div class="item1">header</div>
  <div class="item2">advert</div>
  <div class="item3">content</div>
  <div class="item4">footer</div>
</div>
```

+ 当网页可视区域的宽不小于 300px 时，列数从 1 变为 2。并且，广告（advertisement）区域完全占据左列。
+ 当网页可视区域的宽不小于 400px 时，使 header 区域完全占据最顶行，footer 区域完全占据最底行。



## External Link

+ [FreeCodeCamp - 网格介绍](https://learn.freecodecamp.one/responsive-web-design/css-grid) 