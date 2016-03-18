/**
 * 该函数用于合并对象
 * @param {Boolean} 是否进行深度合并
 * @param {Object} target
 * @param {Object} 一个对象，它包含额外的属性合并到第一个参数
 */

(function(WIN){

	var type = myEnsure.ensure;

	WIN.myExtend = {
		extend : function (){
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

			target = type(target) !== 'objcet' ? target : {};
			
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
						if( deep && optVal && (type(optVal) === 'object' || type(optVal) === 'array')) { // 如果深拷贝，则递归

							if(type(optVal) === 'object') {
								clone = targetVal && type(targetVal) === 'object' ? targetVal : {};
							}else {
								clone = targetVal && type(targetVal) === 'array' ? targetVal : [];
							}

							target[ key ] = myExtend.extend( deep, clone, optVal );
						}else {
							target[ key ] = optVal; //否则直接覆盖值
						}
					}
				}
			}

			return target;
		}
	};
})(window);