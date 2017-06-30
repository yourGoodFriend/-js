/**
 * Created by tangcheng on 2017/6/29.
 */
(function() {
    var Carousel = function(poster) {
        let _carousel = this;
        //获取插件需要的对象节点
        _carousel.posterWrap = poster;
        _carousel.poster = poster.getElementsByClassName('poster-list')[0];
        _carousel.bothBtn = poster.getElementsByClassName("poster-btn");
        _carousel.nextBtn = poster.getElementsByClassName("poster-next-btn")[0];
        _carousel.prevBtn = poster.getElementsByClassName("poster-prev-btn")[0];
        _carousel.posterItems = poster.getElementsByClassName("poster-item");
        _carousel.leftPosterItems = [];                                                    //左边的节点
        _carousel.rightPosterItems = [];                                                   //右边的节点
        _carousel.posterFirstItem = _carousel.posterItems[0];                              //第一个幻灯片
        _carousel.posterLastItem = _carousel.posterItems[_carousel.posterItems.length-1];  //最后一个幻灯片
        _carousel.rotateFlag = true;
        //偶数张
        if (_carousel.posterItems.length % 2 == 0) {
            let imgSrc = _carousel.posterFirstItem.childNodes[0].childNodes[0].src;
            let li = document.createElement("li");
            li.className = "poster-item";
            let a = document.createElement("a");
            a.href = "#";
            let img = document.createElement("img");
            img.src = imgSrc;
            a.appendChild(img);
            li.appendChild(a);
            _carousel.poster.appendChild(li);
        };
        //默认配置参数
        _carousel.setting = {
            "width": 1000,                            //幻灯片总宽
            "height": 270,                            //幻灯片总高
            "posterWidth": 640,                       //第一帧宽度 --> 当前显示
            "posterHeight": 270,                      //第一帧高度 --> 当前显示
            "scale": 0.9,                             //记录显示比例关系
            "autoPlay": false,
            "delay": 2000,                            //自动播放间隔时间
            "verticalAlign": "middle"                 //top bottom middle
        };
        //取两次配置项的并集
        for(let i in _carousel.setting){
            for(let j in _carousel.getSetting()){
                if(i === j){
                    _carousel.setting[j] = _carousel.getSetting()[j];
                }
            }
        }
        //分割左右两边的节点
        _carousel.divisionNode( _carousel.posterItems,"botn");
        //设置基本属性样式
        _carousel.setSettingValue();
        //设置左右两边节点样式
        _carousel.setPosterPos();
        //右边按钮
        _carousel.nextBtn.onclick = function(){
            _carousel.carouselRotate("right");
        };
        //左边按钮
        _carousel.prevBtn.onclick = function(){
            _carousel.carouselRotate("left");
        };
        //自动播放
        if (_carousel.setting.autoPlay){
            _carousel.autoPlay();
            _carousel.posterWrap.onmouseover = function(){
                clearInterval(_carousel.timer);
            };
            _carousel.posterWrap.onmouseout = function(){
                _carousel.autoPlay();
            };
        }
    };
    Carousel.prototype = {
        /**
         * 获取配置信息
         * @returns {JSON.parse(setting) / {}}
         */
        getSetting:function(){
            let setting = this.posterWrap.getAttribute("data-setting");
            if(setting && setting != ""){
                return JSON.parse(setting);
            }else{
                return {}
            }
        },
        /**
         * 设置配置项的基本样式
         */
        setSettingValue:function(){
            //最高层级
            let tier = Math.ceil(this.posterItems.length / 2);
            //两边按钮的宽度
            let botnBtnWidth = (this.setting.width - this.setting.posterWidth) / 2;
            //幻灯片大小
            this.objectAddStyle(this.posterWrap,{
                "width": this.setting.width,
                "height": this.setting.height,
                "z-index": tier,
            });
            //第一张图片
            this.objectAddStyle(this.posterFirstItem,{
                "width": this.setting.posterWidth,
                "height": this.setting.posterHeight,
                "z-index": tier,
                "left":botnBtnWidth
            })
            //右边按钮
            this.objectAddStyle(this.nextBtn,{
                "width": botnBtnWidth,
                "height": this.setting.posterHeight,
                "z-index": tier
            });
            //左边按钮
            this.objectAddStyle(this.prevBtn,{
                "width": botnBtnWidth,
                "height": this.setting.posterHeight,
                "z-index": tier
            });
        },
        /**
         * 设置帧的位置关系
         */
        setPosterPos:function(){
            let _carousel = this;
            //设置除去第一个一下的层级
            let tier = Math.floor(this.posterItems.length / 2),
                oloop = Math.floor(this.posterItems.length / 2);
            //间隙
            let gap = ((_carousel.setting.width - _carousel.setting.posterWidth) / 2) / tier;
            //设置右边帧的高度,宽度值
            let rightWidth = _carousel.setting.posterWidth,
                rightHeight = _carousel.setting.posterHeight,
                firstLeft = (_carousel.setting.width - _carousel.setting.posterWidth) / 2,
                fixOffsetLeft = firstLeft + rightWidth; //第一张 + 左边宽度
            //设置右边帧样式
            for(let i = 0 ; i < _carousel.rightPosterItems.length ;i++){
                tier--;
                rightWidth = rightWidth * _carousel.setting.scale;        //宽度缩小
                rightHeight = rightHeight *  _carousel.setting.scale;     //高度缩小
                let j = i, k = i;
                _carousel.objectAddStyle(_carousel.rightPosterItems[i],{
                    "width":rightWidth,
                    "height":rightHeight,
                    "z-index":tier,
                    "opacity": 1 / (++k),
                    "left": fixOffsetLeft + (++j) * gap - rightWidth,
                    "top": (_carousel.setting.posterHeight-rightHeight)/2
                });
            }
            //设置左边帧的最低层的一帧样式
            let leftWidth = rightWidth,
                leftHight = rightHeight;
            //设置左边帧样式
            for(let i = 0 ; i < _carousel.leftPosterItems.length ;i++){
                let j = i;
                _carousel.objectAddStyle(_carousel.leftPosterItems[i],{
                    "width":leftWidth,
                    "height":leftHight,
                    "z-index":j,
                    "opacity":1 / oloop,
                    "left":j * gap,
                    "top":(_carousel.setting.posterHeight-leftHight)/2
                });
                leftWidth = leftWidth / _carousel.setting.scale;         //宽度放大
                leftHight = leftHight / _carousel.setting.scale;         //高度放大
                oloop--;
            }
        },
        /**
         * 旋转切换效果
         * @param type
         */
        carouselRotate:function(type){
            let _carousel = this;
            if(type === "left"){
                let l = _carousel.posterItems.length;
                let firstItem = _carousel.posterItems[0];
                let fw = firstItem.style.width,
                    fh = firstItem.style.height,
                    fl = firstItem.style.left,
                    fo = firstItem.style.opacity,
                    ft = firstItem.style.top,
                    fz = firstItem.style.zIndex;
                for(let i = 0 ; i < l ; i++){
                    if (i === l-1){
                        _carousel.posterItems[i].style.width = fw;
                        _carousel.posterItems[i].style.height = fh;
                        _carousel.posterItems[i].style.opacity = fo;
                        _carousel.posterItems[i].style.left = fl;
                        _carousel.posterItems[i].style.top = ft;
                        _carousel.posterItems[i].style.zIndex = fz;
                    }else{
                        _carousel.posterItems[i].style.width = _carousel.posterItems[i+1].style.width;
                        _carousel.posterItems[i].style.height = _carousel.posterItems[i+1].style.height;
                        _carousel.posterItems[i].style.opacity = _carousel.posterItems[i+1].style.opacity;
                        _carousel.posterItems[i].style.left = _carousel.posterItems[i+1].style.left;
                        _carousel.posterItems[i].style.top = _carousel.posterItems[i+1].style.top;
                        _carousel.posterItems[i].style.zIndex = _carousel.posterItems[i+1].style.zIndex;
                    }
                }
            }else if (type === "right"){
                let l = _carousel.posterItems.length;
                let lastItem = _carousel.posterItems[l-1];
                let fw = lastItem.style.width,
                    fh = lastItem.style.height,
                    fl = lastItem.style.left,
                    fo = lastItem.style.opacity,
                    ft = lastItem.style.top,
                    fz = lastItem.style.zIndex;
                for(let i = l-1 ; i > -1 ; i--){
                    if (i === 0){
                        _carousel.posterItems[i].style.width = fw;
                        _carousel.posterItems[i].style.height = fh;
                        _carousel.posterItems[i].style.opacity = fo;
                        _carousel.posterItems[i].style.left = fl;
                        _carousel.posterItems[i].style.top = ft;
                        _carousel.posterItems[i].style.zIndex = fz;
                    }else{
                        _carousel.posterItems[i].style.width = _carousel.posterItems[i-1].style.width;
                        _carousel.posterItems[i].style.height = _carousel.posterItems[i-1].style.height;
                        _carousel.posterItems[i].style.opacity = _carousel.posterItems[i-1].style.opacity;
                        _carousel.posterItems[i].style.left = _carousel.posterItems[i-1].style.left;
                        _carousel.posterItems[i].style.top = _carousel.posterItems[i-1].style.top;
                        _carousel.posterItems[i].style.zIndex = _carousel.posterItems[i-1].style.zIndex;
                    }
                }
            }
        },
        /**
         * 自动轮播
         */
        autoPlay:function(){
            let _carousel = this;
            _carousel.timer = setInterval(function(){
                _carousel.carouselRotate("right");
            },_carousel.setting.delay);
        },
        /**
         * 给对象设置样式
         * @param addObject
         * @param json
         */
        objectAddStyle:function(addObject,json){
            for(let i in json){
                if(i === "width" || i === "height" || i === "left" || i === "top"){
                    addObject.style.cssText += ";"+i+":"+json[i]+"px";
                }else{
                    addObject.style.cssText += ";"+i+":"+json[i];
                }
            }
        },
        /**
         * 除去中间第一个节点,分割左右两边的节点
         * @param objectNode
         * @param type
         */
        divisionNode:function(objectNode,type){
            let cutObjectLength = (objectNode.length-1)/2;
            //去除第一个节点
            for(let i = 1 ; i < objectNode.length ; i++){
                if(i < cutObjectLength || i === cutObjectLength){
                    if (type === "right" || type === "botn"){
                        this.rightPosterItems.push(objectNode[i]);
                    }
                }else{
                    if (type === "left" ||　type === "botn"){
                        this.leftPosterItems.push(objectNode[i]);
                    }
                }
            }
        }
    };
    /**
     * 创建插件对象
     * @param posters
     */
    Carousel.init = function(posters) {
        let wrapId = document.querySelectorAll(posters);
        let _carousel = this;
        for(let i = 0 ; i < wrapId.length ; i++){
            new _carousel(wrapId[i]);
        }
    };
    window.Carousel = Carousel;
})();
