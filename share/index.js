// 待完成：
// 1. 配置一套默认的皮肤同时可配置显示的渠道

;(function(global){
  var coreToString = Object.prototype.toString;
  var link = global.location.href;
  var tit = document.title;
  var source = encodeURIComponent('http://www.bilibili.com');

  // 分享初始化的默认配置参数
  var def = {
    target: null,
    style: 0,
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
    initParam = extend(true,{},def,param);
    initParam.rnd = new Date().getTime() + Math.floor(Math.random() * 1000);
    this.initParam = initParam;
  }

  // 完成绑定
  WebShare.prototype.bind = function(){
    var _this, initParam, curChannelParam, target, share;
    _this = this;
    initParam = _this.initParam;
    ele = initParam.target;
    share = initParam.share;

    for(var i = 0, len = ele.length, item, type, channelParam; i < len; i++) {
      item = ele[i];
      item.onclick = function bindShare(){
        type = this.getAttribute('data-share');

        if(!bindShareParam.rnd || !bindShareParam.rnd[''+ type +'']) {
          channelParam = extend({},defShare[''+ type +'']);
          channelParam = JSON.stringify(channelParam);
          channelParam = channelParam.replace('{{url}}', encodeURIComponent(share.url));
          channelParam = channelParam.replace('{{title}}', share.title);
          channelParam = channelParam.replace('{{pic}}', encodeURIComponent(share.pic));
          channelParam = channelParam.replace('{{desc}}', share.desc);

          bindShareParam[''+ type +''] = JSON.parse(channelParam);
        }
        
        // 把分享参数配置到链接里面拼接起来
        curChannelParam = extend({},bindShareParam[''+ type +'']);
        curChannelParam = JSON.stringify(curChannelParam).replace(/\:/g,'=');
        curChannelParam = curChannelParam.replace(/\,/g,'&');
        curChannelParam = curChannelParam.replace(/\{|\}/g,'');
        curChannelParam = curChannelParam.replace(/\"|\'/g,'');
        global.open(url[''+ type +''] + curChannelParam,'_blank','toolbar=no,menubar=no,scrollbars=no,resizable=1,location=no,status=0,width=800,height=680,top=0,left=0');
      };
    }
  };

  WebShare.prototype.chageShare = function(param){
    var newShareParam = {};
    var _this = this;
    extend(_this.initParam.share,param);
    bindShareParam[''+ _this.initParam.rnd +''] = {};
  };

  window.webShare = WebShare;

  /* 工具函数 */
  function extend(){
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

          // updata by liqian 2016/03/21
          //深拷贝结束之后，打破递归
          if( deep && !optVal ) {
            
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

})(window);