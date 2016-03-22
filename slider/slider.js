;(function(global){
  'use strict';
  var SLIDER = 'bili-slider';

  var paramDefault = {
    animation: "slide",             // String: ["fade"|"slide"]，动画效果
    direction: "horizontal",        // String: 滚动方向 ["horizontal"|"vertical"]
    reverse: false,                 // Boolean: 翻转 slide 运动方向
    animationLoop: true,            // Boolean: 是否循环播放

    startAt: 0,                     // Integer: 开始播放的 slide，从 0 开始计数
    slideshow: true,                // Boolean: 是否自动播放
    slideshowSpeed: 5000,           // Integer: ms 滚动间隔时间
    animationSpeed: 600,            // Integer: ms 动画滚动速度
    initDelay: 0,                   // Integer: ms 首次执行动画的延迟
    randomize: false,               // Boolean: 是否随机 slide 顺序

    pauseOnAction: true,            // Boolean: 用户操作时停止自动播放
    pauseOnHover: false,            // Boolean: 悬停时暂停自动播放
    //useCSS: true,                   // Boolean: 是否使用 css3 transition
    //touch: true,                    // Boolean: 允许触摸屏触摸滑动滑块

    // Primary Controls
    controlThumbnail: false,        // Boolean: 是否创建缩略图
    controlNav: true,               // Boolean: 是否创建控制点
    directionNav: true,             // Boolean: 是否创建上/下一个按钮（previous/next）
    prevText: "Previous",           // String: 上一个按钮文字
    nextText: "Next",               // String: 下一个按钮文字
    
    itemWidth: 0,                   // Integer: slide 宽度，多个同时滚动时设置
    itemMargin: 0,                  // Integer: slide 间距
    minItems: 1,                    // Integer: 最少显示 slide 数, 与 `itemWidth` 相关
    maxItems: 0,                    // Integer: 最多显示 slide 数, 与 `itemWidth` 相关
    move: 0,                        // Integer: 一次滚动移动的 slide 数量，0 - 滚动可见的 slide

    start: function(){},            // Callback: function(slider) - 初始化完成的回调
    before: function(){},           // Callback: function(slider) - 每次滚动开始前的回调
    after: function(){},            // Callback: function(slider) - 每次滚动完成后的回调
    end: function(){},              // Callback: function(slider) - 执行到最后一个 slide 的回调
    added: function(){},            // Callback: function(slider) - slide 添加时触发
    removed: function(){}           // Callback: function(slider) - slide 被移除时触发
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
    // 4. 进行事件的绑定
    bindEvent($el);
  }

  function setStyle($el){
    var el = $el[0];
    var opts = $.data(el, SLIDER); //配置参数
    var $item = $('li.bili-slides-item',$el);
    var $biliSlider = $('div.bili-slider',$el);
    var $view = $('.set-style',$el);
    var $ul = $('ul.bili-slides',$el);
    var lens = $item.size();
    var startAt = lens > opts.startAt ? opts.startAt : 0;

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
      if(opts.direction === 'vertical') {
        $ul.css({
          height : hei * lens + 'px',
          top : -hei * startAt + 'px'
        });
      }else {
        $ul.css({
          width : wid * lens + 'px',
          left : -wid * startAt + 'px'
        });
      }
    }
  }

  function domReader($el){
    var el = $el[0];
    var opts = $.data(el, SLIDER); //配置参数
    var lens = opts.imgUrl.length;
    //controlNav，directionNav，prevText，nextText
    var str = '';
    if(opts.controlNav) { //如果需要下面那个点
      str += '<ol class="bili-control-nav bili-control-paging">';
      for(var i = 0; i < lens; i++){
        str += '<li><a class="bili-control-item">'+ (i+1) +'</a><i></i></li>';
      }
      str += '</ol>';

      $el.append(str);
    }

    if(opts.controlThumbnail) {
      str += '<ol class = "am-control-nav am-control-thumbs">';
      for(var i = 0; i < lens; i++){
        str += '<li><a class="bili-control-item">'+ (i+1) +'</a><i></i></li>';
      }
      str += '</ol>';

    
      // str += '<ol class="bili-control-nav bili-control-thumbs">';
      // for(var i = 0; i < lens; i++){
      //   str += '<li><a class="bili-control-item">'+ (i+1) +'</a><i></i></li>';
      // }
      // str += '</ol>';

      // $el.append(str);
    }
  }

  function bindEvent(){

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