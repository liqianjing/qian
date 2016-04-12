/**
 * 完成基本的分享功能(初始化的对象必须是具体元素)
 * 
 * @Author      liqian
 * @Date        2016/04/12
 * @Version     0.0.1
 *
 * 初始化方式 new webShare({
 *    target : {Object} 需要分享组件的外框dom对象
 *    channel : {Array} 需要的渠道
 *    pageCodeUrl : {String} 页面的二维码（如果需要微信分享，这个参数为必选参数）
 *    share : {Object} 分享的配置内容
 * });
 *
 * chageShare 为暴露的方法，可以更换分享的内容
 */

// 需要补充内容：
// 1. css配置
// 2. 分享渠道增加（暴露一个addChannel方法）

;(function(global){
  var coreToString = Object.prototype.toString;
  var link = global.location.href;
  var tit = document.title;
  var source = encodeURIComponent('http://www.bilibili.com');

  var DOC = global.document;
  var BYCLASS = 'getElementsByClassName';
  var push = [].push;
  var nodeType;
  var tagName;      //标签名称
  var className;    //class名称

  // 分享初始化的默认配置参数
  var def = {
    target: null,
    share: {
      url: link,
      title: tit,
      desc: '',
      pic: ''
    }
  };
  // 每个渠道默认配置参数
  var defShare = {
    /* 微博只有title，没有描述 ==> 分享的时候默认title = title + desc*/
    weibo: {
      url: '{{url}}',
      title: '{{title}}' + '{{desc}}',
      pic: '{{pic}}',
      type: '', /* 按钮样式 */
      count: 'n', /* 是否显示分享数 */
      language: 'zh_ch',
      sourceUrl: source,
      appkey: 2841902482,
      searchPic: false, /* 是否自动抓取 */
      ralateUid: '',
      rnd: new Date().getTime() + Math.floor(Math.random() * 100)
    },
    qqzone: {
      url: '{{url}}',
      showcount: '0',/*是否显示分享总数,显示：'1'，不显示：'0' */
      desc: '',/*默认分享理由(可选)*/
      summary: '{{desc}}',/*分享摘要(可选)*/
      title: '{{title}}',/*分享标题(可选)*/
      site: '#哔哩哔哩#',/*分享来源*/
      pics: '{{pic}}', /*分享图片的路径(可选)*/
      style: '',
      source: source
    },
    tieba: {
      title: '{{title}}',
      url: '{{url}}',
      uid: 726865,
      comment: '{{desc}}',
      sign: 'on',
      to: 'tieba',
      type: 'text',
      pic: '{{pic}}'
    },
    /* 腾讯微博只有title，没有描述 ==> 分享的时候默认title = title + desc */
    tqq: {
      c: 'share',
      a: 'index',
      site: source,
      title: '{{title}}' + '{{desc}}',
      pic: '{{pic}}',
      url: '{{url}}'
    },
    renren: {
      resourceUrl: '{{url}}', //url
      srcUrl: '{{url}}', //url
      pic: '{{pic}}',
      title: '{{title}}',
      description: '{{desc}}'
    },
    douban: {
      image: '{{pic}}',
      href: '{{url}}',
      name: '{{title}}',
      text: '{{desc}}'
    },
    qq: {
      url: '{{url}}',
      showcount: 0,
      desc: '{{desc}}',
      summary: '',
      title: '{{title}}',
      site: '#哔哩哔哩#',
      pics: '{{pic}}'
    },
    facebook: {
      u: '{{url}}',
      pic: '{{pic}}',
      t: '{{title}}' + '{{desc}}'
    },
    twitter: {
      url: '{{url}}',
      text: '{{desc}}'
    }
  }; 

  var bindShareParam = {}; // 这个是点击的时候需要读取的对象

  var url = {
    weibo: 'http://service.weibo.com/share/share.php?',
    qqzone: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?',
    tqq: 'http://share.v.t.qq.com/index.php?',
    tieba: 'http://tieba.baidu.com/f/commit/share/openShareApi?',
    renren: 'http://widget.renren.com/dialog/share?',
    douban: 'http://www.douban.com/share/service?',
    facebook: 'https://www.facebook.com/sharer/sharer.php?',
    twitter: 'https://twitter.com/intent/tweet?',
    qq: 'http://connect.qq.com/widget/shareqq/index.html?',
  };

  function WebShare(param){
    var initParam = null; //初始化的对象

    // 合并初始化参数
    initParam = _extend(true,{},def,param);
    initParam.rnd = new Date().getTime() + Math.floor(Math.random() * 1000);
    this.initParam = initParam;

    // 执行方法
    init(initParam);
  }

  WebShare.prototype.chageShare = function(param){
    var newShareParam = {};
    var _this = this;
    _extend(_this.initParam.share,param);
    bindShareParam[''+ _this.initParam.rnd +''] = {};
  };

  WebShare.prototype.add = function(param){};

  window.webShare = WebShare;


  // 装填每一个渠道显示
  function init(initParam){
    var str = '<ul class="share-pc-wrap clearfix">';
    var curChannel = null;
    var ele;

    // 在页头插入样式表
    // if(flag){
    //   var link = DOC.createElement('link');
    //   var head = DOC.getElementsByTagName('head')[0];
    //   link.rel = "stylesheet";
    //   link.type = "text/css";
    //   link.href = "index.css";
    //   head.appendChild(link);
    //   flag = false;
    // }

    ele = initParam.target;
    curChannel = initParam.channel ? initParam.channel : {"0":"weibo","1":"tieba","2":"qqzone","3":"tqq","4":"renren","5":"douban","6":"facebook","7":"qq"};
    for(var key in curChannel){
      item = curChannel[''+ key +''];
      if(item === 'weixin'){
        str += '<li class="share-btn share-icon-'+ item +'" data-share="'+ item +'"><p class="share-weixin-code"><img src="'+ initParam.pageCodeUrl +'"/></p></li>';
      }else {
        str += '<li class="share-btn share-icon-'+ item +'" data-share="'+ item +'">'+ item +'</li>';
      }
    }

    str += '</ul>';
    ele.innerHTML = str;

    bindEvent(initParam);
  }

  // 绑定每一个渠道的显示
  function bindEvent(initParam){
    var ele, lis, curChannelParam, share, code;

    ele = initParam.target;
    lis = _getByClass('share-btn',ele,false);
    share = initParam.share;

    for(var i = 0, len = lis.length, item, type, channelParam; i < len; i++) {
      item = lis[i];

      if( item.getAttribute('data-share') === 'weixin') {
        item.onmouseover = function(){
          code = _getByClass('share-weixin-code',item,false)[0];
          _addClass(code, 'active');
        };
        item.onmouseleave = function(){
          code = _getByClass('share-weixin-code',item,false)[0];
          _removeClass(code, 'active');
        };
      }else {
        item.onclick = function bindShare(){
          type = this.getAttribute('data-share');
          // 如果当前点击的是微信，需要单独处理
          if(!bindShareParam.rnd || !bindShareParam.rnd[''+ type +'']) {
            channelParam = _extend({},defShare[''+ type +'']);
            channelParam = JSON.stringify(channelParam);
            channelParam = channelParam.replace('{{url}}', encodeURIComponent(share.url));
            channelParam = channelParam.replace('{{title}}', share.title);
            channelParam = channelParam.replace('{{pic}}', encodeURIComponent(share.pic));
            channelParam = channelParam.replace('{{desc}}', share.desc);

            bindShareParam[''+ type +''] = JSON.parse(channelParam);
          }
          
          // 把分享参数配置到链接里面拼接起来
          curChannelParam = _extend({},bindShareParam[''+ type +'']);
          curChannelParam = JSON.stringify(curChannelParam).replace(/\:/g,'=');
          curChannelParam = curChannelParam.replace(/\,/g,'&');
          curChannelParam = curChannelParam.replace(/\{|\}/g,'');
          curChannelParam = curChannelParam.replace(/\"|\'/g,'');
          global.open(url[''+ type +''] + curChannelParam,'_blank','toolbar=no,menubar=no,scrollbars=no,resizable=1,location=no,status=0,width=800,height=680,top=0,left=0');
        }
      }
    }
  }

  /* 工具函数 */

  // 合并对象
  function _extend(){
    var deep = false; //默认是不会进行深度合并的
    var param1 = arguments[0]; //第一个参数
    var target = param1 || {}; //默认第一个参数是target
    var paramsLength = arguments.length; //参数的个数
    var counter = 0; // 计数器，为下面arguments循环做准备

    //判断第一个参数的类型，如果是boolean，则为deep；否则为target
    if( typeof param1 === 'boolean') {
      deep = param1;

      target = arguments[1] || {};
      counter = 1;
    }

    target = coreToString.call(target) === '[object Object]' ? target : {};
    
    /*
     * option : 当前的参数arguments[i]
     * optVal : 当前参数的key值
     * targetVal : 目标对象的key值
     * clone : 需要克隆的对象
     */
    for(var i = counter, option, optVal, targetVal, clone; i < paramsLength; i++){
      option = arguments[i];

      //排除异常参数
      if(typeof option !== 'undefined' && option !== null) {
        for(var key in option) {
          targetVal = target[ key ];
          optVal = option[ key ];

          //如果当前的值和目标值一样就直接跳出本次循环
          if(optVal === target) {
            continue;
          }

          //判断深拷贝(如果当前的值不存在，或者不是对象或者数组，则不进行递归调用)
          if( deep && optVal && (coreToString.call(optVal) === '[object Object]' || coreToString.call(optVal) === '[object Array]')) { // 如果深拷贝，则递归

            // updata by liqian 2016/03/20

            if(coreToString.call(optVal) === '[object Object]') {
              clone = targetVal && coreToString.call(targetVal) === '[object Object]' ? targetVal : {};
            }else if( coreToString.call(optVal) === '[object Array]' ) {
              clone = targetVal && coreToString.call(targetVal) === '[object Array]' ? targetVal : [];
            }else {
              target[ key ] = optVal;
              continue;
            }

            target[ key ] = arguments.callee( deep, clone, optVal );
          }else {
            target[ key ] = optVal; //否则直接覆盖值
          }
        }
      }
    }

    return target;
  }

  // getByClass
  function _getByClass(selector, context, isFilter){

    var result = [];  //用来存放结果
    var allTag = [];  //用来存储一级查找找到的元素
    var temp = [];    //拆分selector的时候临时存储
    var reg; //匹配class的正则表达式

    context = context || document; // 查找范围
    nodeType = context.nodeType;
    isFilter = typeof isFilter === 'boolean' ? isFilter : true; // 是否过滤
    selector = _trim(selector); // 去掉前后空格

    // 先判断参数的有效性，参数错误直接返回空数组
    if( !selector || typeof selector !== 'string' || nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {
      return result;
    }

    // 解析selector
    temp = selector.split('.');
    if(temp.length === 1) {
      className = selector;
    }else if(temp.length === 2){
      tagName = temp[0];
      className = temp[1];
    }

    // 判断当前环境是否支持getElementsByClassName这个方法
    if(DOC[''+ BYCLASS +'']){ // 如果支持
      // 查找该范围所有含有class的元素
      push.apply(allTag, context.getElementsByClassName(className));

      // 判断是否需要标签过滤
      if(tagName && isFilter){ //如果需要则进行过滤
        for( var i = 0, len = allTag.length, item; i < len; i++) {
          item = allTag[i];
          if(item.nodeName.toLowerCase() === tagName) {
            result.push(item);
          }
        }
      }else { // 否则复制结果
        result = allTag;
      }
      
    }else { // 如果不支持
      // 获取所有该范围内的符合的标签元素
      allTag = tagName ? context.getElementsByTagName(tagName) : DOC.all;
      // 匹配给定classname的正则表达式
      reg = new RegExp('(^| )'+ className +'( |$)');
      // 循环匹配结果
      for(var i = 0, len = allTag.length, item, curClass; i < len; i++){
        item = allTag[i];
        curClass = item.className; //当前元素的所有class
        if(reg.test(curClass)){
          result.push(item);
        }
      }
    }
    // 统一返回结果数组
    return result;
  }

  function _trim(str){
    return str.replace(/(^\s*)|(\s*$)/g,'');
  }

  function _addClass(obj, cls){
    var obj_class = obj.className;//获取 class 内容.
    if(!_hasClass(obj, cls)) {
      blank = (obj_class != '') ? ' ' : '';//判断获取到的 class 是否为空, 如果不为空在前面加个'空格'.
      added = obj_class + blank + cls;//组合原来的 class 和需要添加的 class.
      obj.className = added;//替换原来的 class.
    }
  }
 
  function _removeClass(obj, cls){
    var obj_class = ' '+obj.className+' ';//获取 class 内容, 并在首尾各加一个空格. ex) 'abc        bcd' -> ' abc        bcd '
    obj_class = obj_class.replace(/(\s+)/gi, ' '),//将多余的空字符替换成一个空格. ex) ' abc        bcd ' -> ' abc bcd '
    removed = obj_class.replace(' '+cls+' ', ' ');//在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
    removed = removed.replace(/(^\s+)|(\s+$)/g, '');//去掉首尾空格. ex) 'bcd ' -> 'bcd'
    obj.className = removed;//替换原来的 class.
  }
 
  function _hasClass(obj, cls){
    var obj_class = obj.className,//获取 class 内容.
    obj_class_lst = obj_class.split(/\s+/);//通过split空字符将cls转换成数组.
    x = 0;
    for(x in obj_class_lst) {
        if(obj_class_lst[x] == cls) {//循环数组, 判断是否包含cls
            return true;
        }
    }
    return false;
  }

})(window);