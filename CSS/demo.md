```
.line {
    padding: 8px 12px;
    align-items: center;

    & + .line {
      border-top: 1px solid --border-color-base;
    }
```



```
& .header {
      background-color: #f5f5f5;
      padding: 6px;
      border-bottom: 1px solid --border-color-base;

      & div {
        padding: 0 4px;
        font-weight: 500;
      }

      & div + div {
        border-left: 1.5px solid --border-color-base;
      }
    }
```



[CSS Overflow 玄学](https://jancat.github.io/post/2021/css-overflow-metaphysics/) 
