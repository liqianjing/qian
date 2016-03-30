;(function(global){
  'use strict';

  var SLIDER = 'bili-slider';
  var CLICK = 'click.bilislider';
  var MOUSEENTER = 'mouseenter.bilislider';
  var MOUSELEAVE = 'mouseleave.bilislider';
  var ACTIVE = 'bili-active';
  var SIZE = 'sliderSize';
  var Y = 'vertical';
  var CURRENT = 'current';
  var DISABLED = 'bili-disabled';
  var supportAnimate = isSupport();
  var timer;

  var paramDefault = {
    animation: "slide",             // String: ["fade"|"slide"]，动画效果
    direction: "horizontal",        // String: 滚动方向 ["horizontal"|"vertical"]
    animationLoop: true,            // Boolean: 是否循环播放

    startAt: 0,                     // Integer: 开始播放的 slide，从 0 开始计数
    slideAuto: false,               // Boolean: 是否自动播放
    slideshowSpeed: 5000,           // Integer: ms 滚动间隔时间
    animationSpeed: 600,            // Integer: ms 动画滚动速度
    initDelay: 0,                   // Integer: ms 首次执行动画的延迟

    pauseOnAction: true,            // Boolean: 用户操作时停止自动播放
    pauseOnHover: false,            // Boolean: 悬停时暂停自动播放

    controlThumbnail: false,        // Boolean: 是否创建缩略图
    controlNav: true,               // Boolean: 是否创建控制点
    directionNav: false,            // Boolean: 是否创建上/下一个按钮（previous/next）
    prevText: "Previous",           // String: 上一个按钮文字
    nextText: "Next",               // String: 下一个按钮文字
    end: function(){},              // Callback: function(slider) - 执行到最后一个 slide 的回调
    start: function(){}             // Callback: function(slider) - 执行到最前面一个 slide 的回调
  };

  // 入口函数
  function compInit($el){
    var el = $el[0];
    var opts = $.data(el, SLIDER); //配置参数
    var lens = opts.imgUrl.length;
    var str = '';
    var startAt = lens > opts.startAt ? opts.startAt : 0;
    $.data( el, SIZE, lens );
    $.data( el, CURRENT, startAt);

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
    //var lens = $item.size();
    var lens = $.data(el, SIZE);
    var speed = opts.animationSpeed || 0;
    var startAt = lens > opts.startAt ? opts.startAt : 0;
    var ulStyle = {};

    // 获取外框的大小，由此定义里面盒子的大小
    var wid = $el.width();
    var hei = $el.height();
    $el.css({
      'position' : 'relative'
    });
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
        if(opts.direction === Y) {
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
        if(opts.direction === Y) {
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
    //var lens = opts.imgUrl.length;
    var lens = $.data(el, SIZE);
    var str = '';
    var startAt = lens > opts.startAt ? opts.startAt : 0;

    //如果需要下面那个点
    if(opts.controlNav) {
      str += '<ol class="bili-control-nav bili-control-paging">';
      for(var i = 0; i < lens; i++){
        str += '<li class="bili-control-item '+ ( startAt === i ? "bili-active" : "") +'" data-index="'+ i +'"><a href="javascript:;">'+ (i+1) +'</a><i></i></li>';
      }
      str += '</ol>';
    }

    //如果需要缩略图
    if(opts.controlThumbnail) {
      str += '<ol class = "bili-control-nav bili-control-thumbs">';
      for(var i = 0; i < lens; i++){
        str += '<li class="bili-control-item '+ ( startAt === i ? "bili-active" : "") +'" data-index="'+ i +'"><img src="'+ opts.imgUrl[i] +'" class="bili-active"><i></i></li>';
      }
      str += '</ol>';
    }

    //如果需要左右按钮
    if(opts.directionNav){ 
      str += '<p class="bili-btn bili-btn-left">' + opts.prevText + '</p>';
      str += '<p class="bili-btn bili-btn-right">' + opts.nextText + '</p>';
    }

    $('div.bili-slider',$el).append(str);

    // 4. 进行事件的绑定
    bindEvent($el);
  }

  //绑定事件
  function bindEvent($el){
    var el = $el[0];
    var opts = $.data(el, SLIDER); //配置参数
    var $ul = $('ol.bili-control-nav',$el);
    var $lis = $('ol.bili-control-nav li',$el);
    var $slide = $('ul.bili-slides',$el);
    var $leftBtn = $('p.bili-btn-left',$el);
    var $rightBtn = $('p.bili-btn-right',$el);
    var $imgs = $('li.bili-slides-item',$slide);

    // 绑定下面的小点(或者缩略图)
    $lis.off(CLICK).on(CLICK,function(){
      var $this = null;
      var curIndex = 0;

      $this = $(this);
      //curIndex = $this.prevAll().length; // 当前点击的li的索引值
      curIndex = parseInt($this.attr('data-index'));
      $.data(el, CURRENT, curIndex);

      //点击的位置变化
      $lis.removeClass(ACTIVE);
      $this.addClass(ACTIVE);

      // todo
      //对应的上面的图片变化（增加动画）
      if(opts.animation === 'fade') {
        $imgs.fadeOut(opts.animationSpeed, 'linear', function(){
          $imgs.removeClass(ACTIVE);
        });
        $imgs.eq(curIndex).fadeIn(opts.animationSpeed, 'linear', function(){
          $this.addClass(ACTIVE);
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

    // 左按钮绑定事件
    $leftBtn.off(CLICK).on(CLICK,function(){
      clickBtn($el,'left',$(this));
    });

    // 右按钮绑定事件
    $rightBtn.off(CLICK).on(CLICK,function(){
      clickBtn($el,'right',$(this));
    });
  }

  // 点击左右按钮的处理部分
  function clickBtn($el, direction, _this){
    var el = $el[0];
    var opts = $.data(el, SLIDER); //配置参数
    var lens = $.data(el, SIZE); //总长度
    var curIndex; //当前显示的
    var navLen = $('ol.bili-control-nav',$el).size();
    var $lis = $('ol.bili-control-nav li',$el);
    var $slide = $('ul.bili-slides',$el);
    var $btn = $('p.bili-btn',$el);

    curIndex = $.data(el, CURRENT);

    if( direction === 'left') {
      --curIndex;
      if(curIndex <= 0) {
        if(curIndex === 0 && !opts.animationLoop){
          _this.addClass(DISABLED);
          opts.start(_this);
        }
        if(curIndex < 0){
          if(opts.animationLoop) {
            curIndex = lens-1;
          }else {
            return;
          }
        }
      }else {
        $btn.removeClass(DISABLED);
      }
    }

    if( direction === 'right') {
      ++curIndex;
      if(curIndex >= lens-1) {
        if(curIndex === lens-1 && !opts.animationLoop){
          _this.addClass(DISABLED);
          opts.end(_this);
        }
        if(curIndex > lens-1){
          if(opts.animationLoop) {
            curIndex = 0;
          }else {
            return;
          }
        }
      }else {
        $btn.removeClass(DISABLED);
      }
    }

    //移动(默认先去找是否初始化了控制点，如果有就直接trigger，否则的话再重新计算滚动)
    if(navLen > 0) {
      $lis.eq(curIndex).trigger(CLICK);
    }else { // 左右移动
      if(supportAnimate) {
        animate($el,$slide,curIndex);
      }else {
        jqAnimate($el,$slide,curIndex);
      }
    }
    //记录当前
    $.data(el, CURRENT, curIndex);

  }

  // 自动切换
  function animateAuto($el){
    var el = $el[0];
    var opts = $.data(el, SLIDER); //配置参数
    var $lis = $('ol.bili-control-nav li',$el);
    var lens = $.data(el, SIZE);
    var current = 0;
    if(opts.slideAuto) { //如果需要自动播放
      timer = setInterval(function(){
        current = $.data(el, CURRENT);
        showAuto($el, current, lens);
      }, opts.slideshowSpeed);
    }
  }
  
  // 滚动的函数(如果自动播放，则默认循环)
  function showAuto($el, n, count) {
    var el = $el[0];
    var $lis = $('ol.bili-control-nav li',$el);
    var opts = $.data(el, SLIDER);

    // updata: 如果自动播放，那么默认循环
    n = n >= (count -1) ? 0 : ++n;
    $lis.eq(n).trigger(CLICK);
    $.data(el, CURRENT, n);
  }

  // 支持css3动画的动画
  // 根据animationSpeed，执行动画
  // 和下面的jqAnimate的函数只会执行一个
  function animate($el,tar,curIndex){
    var el = $el[0];
    var opts = $.data(el, SLIDER); //配置参数
    //var speed = opts.animationSpeed; //执行动画的时间
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
  // 和上面的animate的函数只会执行一个
  function jqAnimate($el,tar,curIndex){
    //debugger;
    var el = $el[0];
    var opts = $.data(el, SLIDER); //配置参数
    var speed = opts.animationSpeed; //执行动画的时间
    var wid = $el.width();
    var hei = $el.height();
    var scroll = {
      left : -(wid * curIndex) + 'px'
    };

    if(opts.direction === Y) {
      scroll = {
        top : -(hei * curIndex) + 'px'
      };
    }

    tar.animate(scroll, opts.animationSpeed);
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

    if(typeof param === 'string') { //如果传入的是字符串,则调用方法

    }else { //如果是对象，则为初始化
      var options = $.extend({}, paramDefault, param); //初始化的配置参数
      $.data(el,SLIDER,options); //把参数存储到dom对象上面
      compInit($el);
    }
  };
})(window);