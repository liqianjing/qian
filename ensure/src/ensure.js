/**
 * 该函数用于完成target的类型判断和校验
 * 检测target是否为type类型，
 *     如果是，则直接返回target；
 *     如果不是，则判断第三个参数是否存在，
 *         如果存在，则返回默认值
 *         如果不存在，则强制转换成type类型
 * @param {String/Number/Boolean/Undefined/Null/Object/Array/RegExp} target
 * @param {String} type 类型名称
 * @param {String} def  默认信息（可选）
 */
;(function(global){

  var typeObj = {};
  var toStr = Object.prototype.toString;
  var typeArr = ['Boolean','Number','String','Function','Array','Date','RegExp','Object'];

  var dataObj = {
    'string' : '1',
    'number' : 1,
    'undefined' : undefined,
    'null' : null,
    'boolean' : true,
    'object' : {},
    'array' : [],
    'function' : function(){},
    'date' : new Date(),
    'regexp' : /^\d$/
  };

  for(var i = 0, len = typeArr.length, item; i < len; i++) {
    item = typeArr[i];
    typeObj[ "[object " + item + "]" ] = item.toLowerCase();
  }

  global.myEnsure = {
    ensure : function(target, type, def){
      var argLens = arguments.length;
      var result;
      // 如果未输入参数/ type 不是一个字符串/ type不是数据类型的某一个
      if(argLens < 1 || argLens > 1 && typeof type !== 'string') {
        return;
      }else {
        if(argLens === 1){                                         // 如果只传入一个参数，返回该参数的类型
          if(target === null || target === undefined){
            result = String(target);
          }else {
            result = typeObj[ toStr.call(target) ] || "object";
          }
        }else {                                                       // 传入两个及以上参数，则判断，转换
          if(target !== null && target !== undefined) {               // 不是null和undefined
            if(typeObj[ toStr.call(target) ] === type.toLowerCase()){ // 当前target是为type类型，返回传入的target
              result = target;
            }else {                                                // 当前target不是type类型   
              if(argLens > 2) {                                    // 第三个参数存在，返回第三个参数
                result = def;
              }else {                                              // 第三个参数不存在，进行强制类型转化    
                /*
                 * 如果是转化为string，则调用String（）
                 * 如果是转化为number，则调用Number（）
                 * 如果是转化为boolean，则调用Boolean（）
                 */
                switch(type){
                  case 'null':
                    result = null;
                    break;
                  case 'undefined':
                    result = undefined;
                    break;
                  default:
                    /*排除异常情况*/
                    if(typeObj[ toStr.call(target) ] === 'object' && type === 'function'){
                      result = function(){}; //myEnsure.ensure({a:1},'function')
                    }else if(typeof target === 'number' && isNaN(target) && type === 'array'){
                      result = []; //myEnsure.ensure(NaN,'array')
                    }else {
                      result = dataObj[''+ type.toLowerCase() +''].constructor(target);
                    }
                }
                
              }
            }
          }else {                                                  //是null和undefined 就直接返回结果
            result = argLens > 2 ? def : target;
          }
        }

        return result;
      }
    }
  };
})(window);