## Carousel-js
不依赖于JQ的旋转木马
###  页面格式
```
<div class="poster-main" data-setting='{
          "width":1000,
          "height":300,
          "posterWidth":640,
          "posterHeight":270,
          "scale":0.9,
          "autoPlay":true,
          "delay":2000,
          "verticalAlign":"middle"
}'>
    <div class="poster-btn poster-prev-btn"></div>
    <ul class="poster-list">
        <li class="poster-item"><a href="#"><img src="img/10.png" alt="" width="100%" /></a></li>
        <li class="poster-item"><a href="#"><img src="img/17.png" alt="" width="100%" /></a></li>
        <li class="poster-item"><a href="#"><img src="img/12.png" alt="" width="100%" /></a></li>
        <li class="poster-item"><a href="#"><img src="img/14.png" alt="" width="100%" /></a></li>
        <li class="poster-item"><a href="#"><img src="img/20.png" alt="" width="100%" /></a></li>
    </ul>
    <div class="poster-btn poster-next-btn"></div>
</div>
```
###  配置参数
```
data-setting='{
    "width":1000,             
    "height":300,
    "posterWidth":640,
    "posterHeight":270,
    "scale":0.9,
    "autoPlay":true,
    "delay":2000,
    "verticalAlign":"middle"
}'
```
###  初始化(选择器)
```
Carousel.init(".poster-main");
```
##  建议
基数张图片展示效果更好
