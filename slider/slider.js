;(function(global){
  'use strict';
  var SLIDER = 'bili-slider';
  var CLICK = 'click.bilislider';
  var ACTIVE = 'bili-active';
  var supportAnimate = isSupport();

  var paramDefault = {
    animation: "slide",             // String: ["fade"|"slide"]，动画效果
    direction: "horizontal",        // String: 滚动方向 ["horizontal"|"vertical"]
    animationLoop: true,            // Boolean: 是否循环播放

    startAt: 0,                     // Integer: 开始播放的 slide，从 0 开始计数
    slideAuto: true,                // Boolean: 是否自动播放
    slideshowSpeed: 5000,           // Integer: ms 滚动间隔时间
    animationSpeed: 600,            // Integer: ms 动画滚动速度
    initDelay: 0,                   // Integer: ms 首次执行动画的延迟

    pauseOnAction: true,            // Boolean: 用户操作时停止自动播放
    pauseOnHover: false,            // Boolean: 悬停时暂停自动播放

    controlThumbnail: false,        // Boolean: 是否创建缩略图
    controlNav: true,               // Boolean: 是否创建控制点
    directionNav: true,             // Boolean: 是否创建上/下一个按钮（previous/next）
    prevText: "Previous",           // String: 上一个按钮文字
    nextText: "Next"                // String: 下一个按钮文字
    
    // itemWidth: 0,                   // Integer: slide 宽度，多个同时滚动时设置
    // itemMargin: 0,                  // Integer: slide 间距
    // minItems: 1,                    // Integer: 最少显示 slide 数, 与 `itemWidth` 相关
    // maxItems: 0,                    // Integer: 最多显示 slide 数, 与 `itemWidth` 相关
    // move: 0,                        // Integer: 一次滚动移动的 slide 数量，0 - 滚动可见的 slide

    // start: function(){},            // Callback: function(slider) - 初始化完成的回调
    // before: function(){},           // Callback: function(slider) - 每次滚动开始前的回调
    // after: function(){},            // Callback: function(slider) - 每次滚动完成后的回调
    // end: function(){},              // Callback: function(slider) - 执行到最后一个 slide 的回调
    // added: function(){},            // Callback: function(slider) - slide 添加时触发
    // removed: function(){}           // Callback: function(slider) - slide 被移除时触发
  };

  function compInit($el){
    var el = $el[0];
    var opts = $.data(el, SLIDER); //配置参数
    var lens = opts.imgUrl.length;
    var str = '';
    var startAt = lens > opts.startAt ? opts.startAt : 0;

    for(var i = 0; i < lens; i++) {
      str += '<li class="bili-slides-item set-style '+ ( startAt === i ? "bili-active" : "") +'"><img src="'+ opts.imgUrl[i] +'" class="set-style"></li>';
    }

    // 先定义固定的外框结构
    var domStr = [
      '<div class="bili-slider set-style">',
        '<div class="bili-viewport set-style">',
          '<ul class="bili-slides set-style">'+ str +'</ul>',
        '</div>',
      '</div>'
    ].join('');

    $el.html(domStr);

    // 1. 根据图片的数量，animation，direction定义样式
    setStyle($el);
    // 2. 根据controlNav，directionNav，prevText，nextText添加dom结构
    // 3. 根据startAt，标注当前显示
    domReader($el);
  }

  // 根据图片的数量，animation，direction定义样式
  function setStyle($el){
    var el = $el[0];
    var opts = $.data(el, SLIDER); //配置参数
    var $item = $('li.bili-slides-item',$el);
    var $biliSlider = $('div.bili-slider',$el);
    var $view = $('.set-style',$el);
    var $ul = $('ul.bili-slides',$el);
    var lens = $item.size();
    var speed = opts.animationSpeed || 0;
    var startAt = lens > opts.startAt ? opts.startAt : 0;
    var ulStyle = {};

    // 获取外框的大小，由此定义里面盒子的大小
    var wid = $el.width();
    var hei = $el.height();

    $view.css({
      width: wid + 'px',
      height: hei + 'px'
    });


    // 定义外框样式
    if(opts.animation === 'fade') {
      $biliSlider.addClass(''+ SLIDER +'-fade');
    }else {
      $biliSlider.addClass(''+ SLIDER +'-slide');

      if(supportAnimate) {
        if(opts.direction === 'vertical') {
          ulStyle = {
            height : hei * lens + 'px',
            transition : 'transform '+ speed +'ms linear',
            transform : 'translateY('+ (-hei * startAt) +'px)'
          };
        }else {
          ulStyle = {
            width : wid * lens + 'px',
            transition : 'transform '+ speed +'ms linear',
            transform : 'translateX('+ (-wid * startAt) +'px)'
          };
        }
      }else {
        if(opts.direction === 'vertical') {
          ulStyle = {
            position : 'absolute',
            height : hei * lens + 'px',
            top : -hei * startAt + 'px'
          };
        }else {
          ulStyle = {
            position : 'absolute',
            width : wid * lens + 'px',
            left : -wid * startAt + 'px'
          };
        }
      }
      $ul.css(ulStyle);
    }
  }

  // 根据controlNav，directionNav，prevText，nextText添加dom结构
  function domReader($el){
    var el = $el[0];
    var opts = $.data(el, SLIDER); //配置参数
    var lens = opts.imgUrl.length;
    var str = '';
    var startAt = lens > opts.startAt ? opts.startAt : 0;

    //如果需要下面那个点
    if(opts.controlNav) {
      str += '<ol class="bili-control-nav bili-control-paging">';
      for(var i = 0; i < lens; i++){
        str += '<li class="'+ ( startAt === i ? "bili-active" : "") +'"><a class="bili-control-item">'+ (i+1) +'</a><i></i></li>';
      }
      str += '</ol>';

      $el.append(str);
    }

    //如果需要缩略图
    if(opts.controlThumbnail) {
      str += '<ol class = "bili-control-nav bili-control-thumbs">';
      for(var i = 0; i < lens; i++){
        str += '<li class="'+ ( startAt === i ? "bili-active" : "") +'"><img src="'+ opts.imgUrl[i] +'" class="bili-active"><i></i></li>';
      }
      str += '</ol>';

      $el.append(str);
    }

    //如果需要左右按钮
    if(opts.directionNav){ 

    }


    // 4. 进行事件的绑定
    bindEvent($el);
  }

  //绑定事件
  function bindEvent($el){
    var el = $el[0];
    var opts = $.data(el, SLIDER); //配置参数
    var $lis = $('ol.bili-control-nav li',$el);
    var $slide = $('ul.bili-slides',$el);

    //绑定下面的小点(或者缩略图)
    $lis.unbind(CLICK).bind(CLICK,function(){
      var $this = null;
      var curIndex = 0;
      var $imgs = $('li.bili-slides-item',$slide);

      $this = $(this);
      curIndex = $this.prevAll().length; // 当前点击的li的索引值

      //点击的位置变化
      $lis.removeClass(ACTIVE);
      $this.addClass(ACTIVE);

      //对应的上面的图片变化（增加动画）
      if(opts.animation === 'fade') {
        $imgs.fadeOut(opts.animationSpeed, 'linear', function(){
          $imgs.removeClass(ACTIVE);
        });
        $imgs.eq(curIndex).fadeIn(opts.animationSpeed, 'linear', function(){
          $(this).addClass(ACTIVE);
        });
      }else {
        if(supportAnimate) {
          animate($el,$slide,curIndex);
        }else {
          jqAnimate($el,$slide,curIndex);
        }
      }
    });

    // 处理自动切换
    animateAuto($el);
    // 处理循环切换
    animateLoop($el); 
  }

  function animateAuto($el){
    var el = $el[0];
    var opts = $.data(el, SLIDER); //配置参数
    if(opts.slideAuto) { //如果自动播放的话

    }
  }

  function animateLoop($el){

  }

  // 支持css3动画的动画
  // 根据animationSpeed，执行动画
  function animate($el,tar,curIndex){
    var el = $el[0];
    var opts = $.data(el, SLIDER); //配置参数
    var speed = opts.animationSpeed; //执行动画的时间
    var wid = $el.width();
    var hei = $el.height();
    var animateVal = "translateX(-" + wid * curIndex + "px)";

    if(opts.direction === 'vertical') {
      animateVal = "translateY(-" + hei * curIndex + "px)";
    }

    tar.css({
      transform: animateVal
    });
  }

  // 不支持css3的，用jq的动画
  function jqAnimate($el,tar,curIndex){
    var el = $el[0];
    var opts = $.data(el, SLIDER); //配置参数
    var speed = opts.animationSpeed; //执行动画的时间
    var wid = $el.width();
    var hei = $el.height();
    var scroll = {
      left : -(wid * curIndex) + 'px'
    };

    if(opts.direction === 'vertical') {
      scroll = {
        top : -(hei * curIndex) + 'px'
      };
    }

    // animate
    tar.animate(scroll, opts.animationSpeed, function(){

    });
  }

  // 判断当前的浏览器是否支持translate和transform
  function isSupport(){
    var result = false;
    var element = document.createElement('div');
    if('transition' in element.style && 'transform' in element.style){
      result = true;
    }
    return result;
  }

  //入口
  $.fn.slider = function(param){
    //这里有一个处理，如果传入的是字符串，则认为是方法调用，否则为初始化

    param = param || {};
    var $el = this;
    var el = $el[0];

    if(typeof param === 'string') { //如果传入的是字符串

    }else { //如果是对象，则为初始化
      var options = $.extend({}, paramDefault, param); //初始化的配置参数
      $.data(el,SLIDER,options); //把参数存储到dom对象上面
      compInit($el);
    }
  };
})(window);