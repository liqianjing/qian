;(function(WIN){
  function isType(param,type){
    return Object.prototype.toString.call(param) === "[object "+ type +"]";
  }

  var _ensure = {
    isNumber : function(param){
      return isType(param,'Number');
    },
    toNumber : function(param){
      if(_ensure.isNumber(param)){
        return param;
      }else {
        return Number(param);
      }
    },
    isStr : function(param){
      return isType(param,'String');
    },
    toStr : function(param){
      if(_ensure.isString(param)){
        return param;
      }else {
        return String(param);
      }
    },
    isBoolean : function(param){
      return isType(param,'Boolean');
    },
    toBoolean : function(param){
      if(_ensure.isBoolean(param)){
        return param;
      }else {
        return Boolean(param);
      }
    },
    isHTMLElement: function (param) {
      return param.length > 0 && typeof param === 'object' && param[0].nodeType == 1 && typeof param[0].nodeName == 'string';
    },
    isArray : function(param){
      return isType(param,'Array');
    },
    toArray : function(param){
      if(_ensure.isArray(param)){
        return param;
      }else {
        var arr = [];
        if( param != null && _ensure.isHTMLElement(param)){ 
          var i = param.length;
          while( i ){
            arr[--i] = param[i]; 
          }
          return arr;
        }else {
          arr.push(param);
          return arr;
        }
      }
    },
    isObject : function(param){
      return isType(param,'Object');
    },
    toObject : function(param){
      if(_ensure.isObject(param)){
        return param;
      }else {
        var obj = {};
        obj[0] = ele;
        return obj;
      }
    },
    isFunction : function(param){
      return isType(param,'Function');
    },
    isNull : function(param){
      return param === null;
    },
    isUndefined : function(param){
      return typeof (param) === "undefined";
    }
  };

  WIN.ensure = _ensure;
})(window);

    // ;(function(WIN){
    //   var _obj = {};
    //   var result;

    //   var dataTypes = {  //数据类型
    //     'string' : function(ele){
    //       return String(ele);
    //     },
    //     'number' : function(ele){
    //       return Number(ele);
    //     },
    //     'undefined' : function(ele){
    //       return undefined;
    //     },
    //     'null' : function(ele){
    //       return null;
    //     },
    //     'boolean' : function(ele){
    //       return Boolean(ele);
    //     },
    //     'object' : function(ele){
    //       var obj = {};
    //       obj[0] = ele;
    //       return obj;
    //     },
    //     'array' : function(ele){
    //       var arr = [];
    //       arr.push(ele);
    //       return arr;
    //     }
    //   };

    //   function isType(type) {
    //     return function(obj) {
    //       return _obj.toString.call(obj) == "[object " + toUpper(type) + "]"
    //     }
    //   }

    //   function toUpper(param){
    //     return param.replace(/(\w)/,function(v){return v.toUpperCase()});
    //   }

    //   Object.prototype.ensure = function(target, type, isConversion){

    //     if(typeof type !== 'string') {
    //       return;
    //     }

    //     var that = this;
    //     var isAccord;

    //     type = type.toLowerCase();
    //     isAccord = isType(type)(that);
    //     isConversion = isConversion || false;

    //     if(!isAccord) {
    //       if(isConversion && dataTypes[''+ type +'']) {//进行强制类型转化
    //         result = dataTypes[''+ type +''](that);         
    //       }else {
    //         result = isAccord;
    //       }
    //     }else {
    //       result = isAccord;
    //     }

    //     return result;
    //   };

    //   WIN.ensure = ensure;

    // })(window);

    