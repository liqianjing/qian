/**
 * 该函数用于完成通过class查找元素
 * @ author   liqian
 * @ version  0.0.1
 * @ email    liqian@bilibili.com
 *
 * @ param {String}[必选] selector 需要查找的元素名称
 * @ param {Object}[非必选] context 查找的范围（父元素，祖父元素）
 * @ param {Boolean}[非必选] isFilter 是否需要过滤
 * 
 * @ return {Array} 
 * 
 * 第一个参数支持两种方式，'class'和'tagname.class',例如'list' 或者 'li.list'。
 *     'tagname.class'这种形式：
 *          优势：第一可以通过标签名过滤；第二在低版本浏览器会根据标签进行一次查找，可以提高效率
 *          劣势：在高版本浏览器下面如果不需要标签过滤，会多一次循环检测的消耗
 *     'class'这种形式：
 *          优势：在高版本浏览器下面一次查找，效率高
 *          劣势：第一不具有标签过滤功能；第二在低版本浏览器会首先查找范围内所有元素，及其消耗性能
 *     综上：考虑传入第三个参数,默认为true即过滤，传入false的时候则不会进行过滤
 */

;(function( global ){
  var DOC = global.document;
  var BYCLASS = 'getElementsByClassName';
  var push = [].push;
  var nodeType;
  var tagName;      //标签名称
  var className;    //class名称

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
      tagName ? push.apply(allTag, context.getElementsByTagName(tagName)) : push.apply(allTag, DOC.all);
      //push.apply(allTag, context.getElementsByTagName(tagName));
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

  global.getByClass = _getByClass;
})(window);