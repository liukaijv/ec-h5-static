/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2006, 2014 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD (Register as an anonymous module)
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		module.exports = factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (arguments.length > 1 && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {},
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling $.cookie().
			cookies = document.cookie ? document.cookie.split('; ') : [],
			i = 0,
			l = cookies.length;

		for (; i < l; i++) {
			var parts = cookies[i].split('='),
				name = decode(parts.shift()),
				cookie = parts.join('=');

			if (key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));
// store变量和商城店铺同名，替换为$.store调用

// Module export pattern from
// https://github.com/umdjs/umd/blob/master/returnExports.js
;(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals (root is window)
        factory(jQuery);
  }
}(function ($) {
	
	// Store.js
	var store = {},
		win = window,
		doc = win.document,
		localStorageName = 'localStorage',
		scriptTag = 'script',
		storage

	store.disabled = false
	store.version = '1.3.17'
	store.set = function(key, value) {}
	store.get = function(key, defaultVal) {}
	store.has = function(key) { return store.get(key) !== undefined }
	store.remove = function(key) {}
	store.clear = function() {}
	store.transact = function(key, defaultVal, transactionFn) {
		if (transactionFn == null) {
			transactionFn = defaultVal
			defaultVal = null
		}
		if (defaultVal == null) {
			defaultVal = {}
		}
		var val = store.get(key, defaultVal)
		transactionFn(val)
		store.set(key, val)
	}
	store.getAll = function() {}
	store.forEach = function() {}

	store.serialize = function(value) {
		return JSON.stringify(value)
	}
	store.deserialize = function(value) {
		if (typeof value != 'string') { return undefined }
		try { return JSON.parse(value) }
		catch(e) { return value || undefined }
	}

	// Functions to encapsulate questionable FireFox 3.6.13 behavior
	// when about.config::dom.storage.enabled === false
	// See https://github.com/marcuswestin/store.js/issues#issue/13
	function isLocalStorageNameSupported() {
		try { return (localStorageName in win && win[localStorageName]) }
		catch(err) { return false }
	}

	if (isLocalStorageNameSupported()) {
		storage = win[localStorageName]
		store.set = function(key, val) {
			if (val === undefined) { return store.remove(key) }
			storage.setItem(key, store.serialize(val))
			return val
		}
		store.get = function(key, defaultVal) {
			var val = store.deserialize(storage.getItem(key))
			return (val === undefined ? defaultVal : val)
		}
		store.remove = function(key) { storage.removeItem(key) }
		store.clear = function() { storage.clear() }
		store.getAll = function() {
			var ret = {}
			store.forEach(function(key, val) {
				ret[key] = val
			})
			return ret
		}
		store.forEach = function(callback) {
			for (var i=0; i<storage.length; i++) {
				var key = storage.key(i)
				callback(key, store.get(key))
			}
		}
	} else if (doc.documentElement.addBehavior) {
		var storageOwner,
			storageContainer
		// Since #userData storage applies only to specific paths, we need to
		// somehow link our data to a specific path.  We choose /favicon.ico
		// as a pretty safe option, since all browsers already make a request to
		// this URL anyway and being a 404 will not hurt us here.  We wrap an
		// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
		// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
		// since the iframe access rules appear to allow direct access and
		// manipulation of the document element, even for a 404 page.  This
		// document can be used instead of the current document (which would
		// have been limited to the current path) to perform #userData storage.
		try {
			storageContainer = new ActiveXObject('htmlfile')
			storageContainer.open()
			storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>')
			storageContainer.close()
			storageOwner = storageContainer.w.frames[0].document
			storage = storageOwner.createElement('div')
		} catch(e) {
			// somehow ActiveXObject instantiation failed (perhaps some special
			// security settings or otherwse), fall back to per-path storage
			storage = doc.createElement('div')
			storageOwner = doc.body
		}
		var withIEStorage = function(storeFunction) {
			return function() {
				var args = Array.prototype.slice.call(arguments, 0)
				args.unshift(storage)
				// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
				// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
				storageOwner.appendChild(storage)
				storage.addBehavior('#default#userData')
				storage.load(localStorageName)
				var result = storeFunction.apply(store, args)
				storageOwner.removeChild(storage)
				return result
			}
		}

		// In IE7, keys cannot start with a digit or contain certain chars.
		// See https://github.com/marcuswestin/store.js/issues/40
		// See https://github.com/marcuswestin/store.js/issues/83
		var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
		var ieKeyFix = function(key) {
			return key.replace(/^d/, '___$&').replace(forbiddenCharsRegex, '___')
		}
		store.set = withIEStorage(function(storage, key, val) {
			key = ieKeyFix(key)
			if (val === undefined) { return store.remove(key) }
			storage.setAttribute(key, store.serialize(val))
			storage.save(localStorageName)
			return val
		})
		store.get = withIEStorage(function(storage, key, defaultVal) {
			key = ieKeyFix(key)
			var val = store.deserialize(storage.getAttribute(key))
			return (val === undefined ? defaultVal : val)
		})
		store.remove = withIEStorage(function(storage, key) {
			key = ieKeyFix(key)
			storage.removeAttribute(key)
			storage.save(localStorageName)
		})
		store.clear = withIEStorage(function(storage) {
			var attributes = storage.XMLDocument.documentElement.attributes
			storage.load(localStorageName)
			while (attributes.length) {
				storage.removeAttribute(attributes[0].name)
			}
			storage.save(localStorageName)
		})
		store.getAll = function(storage) {
			var ret = {}
			store.forEach(function(key, val) {
				ret[key] = val
			})
			return ret
		}
		store.forEach = withIEStorage(function(storage, callback) {
			var attributes = storage.XMLDocument.documentElement.attributes
			for (var i=0, attr; attr=attributes[i]; ++i) {
				callback(attr.name, store.deserialize(storage.getAttribute(attr.name)))
			}
		})
	}

	try {
		var testKey = '__storejs__'
		store.set(testKey, testKey)
		if (store.get(testKey) != testKey) { store.disabled = true }
		store.remove(testKey)
	} catch(e) {
		store.disabled = true
	}
	store.enabled = !store.disabled
	
	$.store = store;

	return store
}));
// 统一取url的相关方法

// A simple, lightweight url parser for JavaScript 
// from http://www.websanova.com

window.url = (function() {
    function isNumeric(arg) {
      return !isNaN(parseFloat(arg)) && isFinite(arg);
    }
    
    return function(arg, url) {
        var _ls = url || window.location.toString();

        if (!arg) { return _ls; }
        else { arg = arg.toString(); }

        if (_ls.substring(0,2) === '//') { _ls = 'http:' + _ls; }
        else if (_ls.split('://').length === 1) { _ls = 'http://' + _ls; }

        url = _ls.split('/');
        var _l = {auth:''}, host = url[2].split('@');

        if (host.length === 1) { host = host[0].split(':'); }
        else { _l.auth = host[0]; host = host[1].split(':'); }

        _l.protocol=url[0];
        _l.hostname=host[0];
        _l.port=(host[1] || ((_l.protocol.split(':')[0].toLowerCase() === 'https') ? '443' : '80'));
        _l.pathname=( (url.length > 3 ? '/' : '') + url.slice(3, url.length).join('/').split('?')[0].split('#')[0]);
        var _p = _l.pathname;

        if (_p.charAt(_p.length-1) === '/') { _p=_p.substring(0, _p.length-1); }
        var _h = _l.hostname, _hs = _h.split('.'), _ps = _p.split('/');

        if (arg === 'hostname') { return _h; }
        else if (arg === 'domain') {
            if (/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(_h)) { return _h; }
            return _hs.slice(-2).join('.'); 
        }
        //else if (arg === 'tld') { return _hs.slice(-1).join('.'); }
        else if (arg === 'sub') { return _hs.slice(0, _hs.length - 2).join('.'); }
        else if (arg === 'port') { return _l.port; }
        else if (arg === 'protocol') { return _l.protocol.split(':')[0]; }
        else if (arg === 'auth') { return _l.auth; }
        else if (arg === 'user') { return _l.auth.split(':')[0]; }
        else if (arg === 'pass') { return _l.auth.split(':')[1] || ''; }
        else if (arg === 'path') { return _l.pathname; }
        else if (arg.charAt(0) === '.')
        {
            arg = arg.substring(1);
            if(isNumeric(arg)) {arg = parseInt(arg, 10); return _hs[arg < 0 ? _hs.length + arg : arg-1] || ''; }
        }
        else if (isNumeric(arg)) { arg = parseInt(arg, 10); return _ps[arg < 0 ? _ps.length + arg : arg] || ''; }
        else if (arg === 'file') { return _ps.slice(-1)[0]; }
        else if (arg === 'filename') { return _ps.slice(-1)[0].split('.')[0]; }
        else if (arg === 'fileext') { return _ps.slice(-1)[0].split('.')[1] || ''; }
        else if (arg.charAt(0) === '?' || arg.charAt(0) === '#')
        {
            var params = _ls, param = null;

            if(arg.charAt(0) === '?') { params = (params.split('?')[1] || '').split('#')[0]; }
            else if(arg.charAt(0) === '#') { params = (params.split('#')[1] || ''); }

            if(!arg.charAt(1)) { return params; }

            arg = arg.substring(1);
            params = params.split('&');

            for(var i=0,ii=params.length; i<ii; i++)
            {
                param = params[i].split('=');
                if(param[0] === arg) { return param[1] || ''; }
            }

            return null;
        }

        return '';
    };
})();

if(typeof jQuery !== 'undefined') {
    jQuery.extend({
        url: function(arg, url) { return window.url(arg, url); }
    });
}
// ui基础js

var UI = UI || {};

;(function($, UI){

	UI.support = {};

	UI.support.transition = (function() {
	  var transitionEnd = (function() {
	    // https://developer.mozilla.org/en-US/docs/Web/Events/transitionend#Browser_compatibility
	    var element = window.document.body || window.document.documentElement;
	    var transEndEventNames = {
	      WebkitTransition: 'webkitTransitionEnd',
	      MozTransition: 'transitionend',
	      OTransition: 'oTransitionEnd otransitionend',
	      transition: 'transitionend'
	    };
	    var name;

	    for (name in transEndEventNames) {
	      if (element.style[name] !== undefined) {
	        return transEndEventNames[name];
	      }
	    }
	  })();

	  return transitionEnd && {end: transitionEnd};
	})();

	UI.support.animation = (function() {
  var animationEnd = (function() {
    var element = window.document.body || window.document.documentElement;
    var animEndEventNames = {
      WebkitAnimation: 'webkitAnimationEnd',
      MozAnimation: 'animationend',
      OAnimation: 'oAnimationEnd oanimationend',
      animation: 'animationend'
    };
    var name;

    for (name in animEndEventNames) {
      if (element.style[name] !== undefined) {
        return animEndEventNames[name];
      }
    }
  })();

  return animationEnd && {end: animationEnd};
	})();

	UI.support.requestAnimationFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};

	UI.support.touch = (
		('ontouchstart' in window &&
			navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
		(window.DocumentTouch && document instanceof window.DocumentTouch) ||
		(window.navigator['msPointerEnabled'] &&
		window.navigator['msMaxTouchPoints'] > 0) || //IE 10
		(window.navigator['pointerEnabled'] &&
		window.navigator['maxTouchPoints'] > 0) || //IE >=11
		false);

	// https://developer.mozilla.org/zh-CN/docs/DOM/MutationObserver
	UI.support.mutationobserver = (window.MutationObserver ||
	window.WebKitMutationObserver || window.MozMutationObserver || null);

	UI.utils = {};

	UI.utils.debounce = function(func, wait, immediate) {
	  var timeout;
	  return function() {
	    var context = this;
	    var args = arguments;
	    var later = function() {
	      timeout = null;
	      if (!immediate) {
	        func.apply(context, args);
	      }
	    };
	    var callNow = immediate && !timeout;

	    clearTimeout(timeout);
	    timeout = setTimeout(later, wait);

	    if (callNow) {
	      func.apply(context, args);
	    }
	  };
	};

	UI.utils.isInView = function(element, options) {
	  var $element = $(element);
	  var visible = !!($element.width() || $element.height()) &&
	    $element.css('display') !== 'none';

	  if (!visible) {
	    return false;
	  }

	  var windowLeft = $win.scrollLeft();
	  var windowTop = $win.scrollTop();
	  var offset = $element.offset();
	  var left = offset.left;
	  var top = offset.top;

	  options = $.extend({topOffset: 0, leftOffset: 0}, options);

	  return (top + $element.height() >= windowTop &&
	  top - options.topOffset <= windowTop + $win.height() &&
	  left + $element.width() >= windowLeft &&
	  left - options.leftOffset <= windowLeft + $win.width());
	};

	UI.utils.options = function(string) {
	  if ($.isPlainObject(string)) {
	    return string;
	  }

	  var start = (string ? string.indexOf('{') : -1);
	  var options = {};

	  if (start != -1) {
	    try {
	      options = (new Function('',
	        'var json = ' + string.substr(start) +
	        '; return JSON.parse(JSON.stringify(json));'))();
	    } catch (e) {
	    }
	  }

	  return options;
	};

	$.support.transition = UI.support.transition ;
	$.debounce = UI.utils.debounce ;

	// http://blog.alexmaccaw.com/css-transitions
	$.fn.emulateTransitionEnd = function(duration) {
		var called = false;
		var $el = this;

		$(this).one(UI.support.transition.end, function() {
			called = true;
		});

		var callback = function() {
			if (!called) {
				$($el).trigger(UI.support.transition.end);
			}
			$el.transitionEndTimmer = undefined;
		};
		this.transitionEndTimmer = setTimeout(callback, duration);
		return this;
	};

	$.fn.redraw = function() {
	  $(this).each(function() {    
	    var redraw = this.offsetHeight;
	  });
	  return this;
	};

	$.fn.transitionEnd = function(callback) {
		var endEvent = UI.support.transition.end;
		var dom = this;

		function fireCallBack(e) {
			callback.call(this, e);
			endEvent && dom.off(endEvent, fireCallBack);
		}

		if (callback && endEvent) {
			dom.on(endEvent, fireCallBack);
		}

		return this;
	};	

	// handle multiple browsers for requestAnimationFrame()
	// http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
	// https://github.com/gnarf/jquery-requestAnimationFrame
	UI.utils.rAF = (function() {
	  return window.requestAnimationFrame ||
	    window.webkitRequestAnimationFrame ||
	    window.mozRequestAnimationFrame ||
	    window.oRequestAnimationFrame ||
	      // if all else fails, use setTimeout
	    function(callback) {
	      return window.setTimeout(callback, 1000 / 60); // shoot for 60 fps
	    };
	})();

	// handle multiple browsers for cancelAnimationFrame()
	UI.utils.cancelAF = (function() {
	  return window.cancelAnimationFrame ||
	    window.webkitCancelAnimationFrame ||
	    window.mozCancelAnimationFrame ||
	    window.oCancelAnimationFrame ||
	    function(id) {
	      window.clearTimeout(id);
	    };
	})();

	// via http://davidwalsh.name/detect-scrollbar-width
	UI.utils.measureScrollbar = function() {
	  if (document.body.clientWidth >= window.innerWidth) {
	    return 0;
	  }

	  // if ($html.width() >= window.innerWidth) return;
	  // var scrollbarWidth = window.innerWidth - $html.width();
	  var $measure = $('<div ' +
	  'style="width: 100px;height: 100px;overflow: scroll;' +
	  'position: absolute;top: -9999px;"></div>');

	  $(document.body).append($measure);

	  var scrollbarWidth = $measure[0].offsetWidth - $measure[0].clientWidth;

	  $measure.remove();

	  return scrollbarWidth;
	};

	// 模板解析
	$.parseTpl = function( str, data ) {
		var tmpl = 'var __p=[];' + 'with(obj||{}){__p.push(\'' +
			str.replace(/[\r\t\n]/g, " ")
	          .split("<%").join("\t")
	          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
	          .replace(/\t=(.*?)%>/g, "',$1,'")
	          .split("\t").join("');")
	          .split("%>").join("p.push('")
	          .split("\r").join("\\'") +
			'\');}return __p.join("");',
		func = new Function( 'obj', tmpl );
		return data ? func( data ) : func;
	};

	$.UI = UI;

})(jQuery, UI);
// 抽屉菜单插件

// <div class="ui-panel">
// 	<div class="ui-panel-content">		
// 		<a href="#" data-panel="close">close</a>			
// 	</div>
// </div>

;(function($) {	

	"use strict";
	
	var $win = $(window);
	var $doc = $(document);

	//记录滚动条位置
	var scrollPos;	

	// Constructor
	function Panel($element, settings) {
		this.settings = $.extend({},
			Panel.DEFAULTS, settings || {});
		this.$element = $element;
		this.active = null;
		this.events();
		return this;
	}

	// 初始值
	Panel.DEFAULTS = {
		duration: 300,
		effect: 'overlay', //push||overlay
		target: null,
		width: null
	};

	Panel.prototype = {

		open: function() {
			var $element = this.$element;
			if (!$element.length || $element.hasClass('ui-active')) {
				return;
			}
			var effect = this.settings.effect;
			var $html = $('html');
			var $body = $('body');
			var $bar = $element.find('.ui-panel-content').first();

			// 设置宽度
			if(this.settings.width){
				typeof this.settings.width == 'number'? $bar.width(this.settings.width + 'px') : $bar.width(this.settings.width);
			}

			// 展出方向 左|右
			var dir = $bar.hasClass('ui-panel-flip') ? -1: 1;
			$bar.addClass('ui-panel-' + effect);
			scrollPos = {
				x: window.scrollX,
				y: window.scrollY
			};
			$element.addClass('ui-active');
			$body.css({
				width: window.innerWidth,
				height: $win.height()
			}).addClass('ui-panel-page');
			if (effect !== 'overlay') {				
				$body.css({
					'margin-left': $bar.outerWidth() * dir
				}).width();
			}
			$html.css('margin-top', scrollPos.y * -1);
			setTimeout(function() {
				$bar.addClass('ui-active').width();
			},
			0);
			$element.trigger('open.panel');
			this.active = true;
			$element.off('click.panel').on('click.panel', $.proxy(function(e) {
				var $target = $(e.target);
				if (!e.type.match(/swipe/)) {
					if ($target.hasClass('ui-panel-content')) {
						return;
					}
					if ($target.parents('.ui-panel-content').first().length) {
						return;
					}
				}
				e.stopImmediatePropagation();
				this.close();
			},
			this));

			// esc键取消
			// $html.on('keydown.panel', $.proxy(function(e) {
			// 	if (e.keyCode === 27) {
			// 		this.close();
			// 	}
			// },
			// this));
	},

	// 关闭方法 || 快速关闭
	close: function(force) {
		var me = this;
		var $html = $('html');
		var $body = $('body');
		var $element = this.$element;
		var $bar = $element.find('.ui-panel-content').first();
		if (!$element.length || !$element.hasClass('ui-active')) {
			return;
		}
		$element.trigger('close.panel');
		function complete() {
			$body.removeClass('ui-panel-page').css({
				width: '',
				height: '',
				'margin-left': '',
				'margin-right': ''
			});
			$element.removeClass('ui-active');
			$bar.removeClass('ui-active');
			$html.css('margin-top', '');
			window.scrollTo(scrollPos.x, scrollPos.y);
			$element.trigger('closed.panel');
			me.active = false;
		}
		// 关闭时的动画效果	需要 $.fn.transition插件		
		// transition helper depend http://getbootstrap.com/javascript/#transitions 
		if (!force && $.support.transition) {
			setTimeout(function() {
				$bar.removeClass('ui-active');
			},
			0);
			$body.css('margin-left', '').one($.support.transition.end,
				function() {
					complete();
				}).emulateTransitionEnd(this.settings.duration);
		} else {
			complete();
		}
		$element.off('click.panel');
		$html.off('.panel');
	},

	events: function() {
		
		$doc.on('click.panel', '[data-panel="close"]', $.proxy(function(e) {
			e.preventDefault();
			this.close();
		}, this));

		// resize 时关闭
		// $win.on('resize.panel orientationchange.panel', $.proxy(function(e) {
		// 	this.active && this.close();
		// },
		// this));
	},

	toggle: function(){
		this.active ? this.close() : this.open();
	}
}

	//  插件
	function Plugin(option) {
		return this.each(function() {
			// debugger;
			var $this = $(this);
			var data = $this.data('panel');
			var options = $.extend({}, Panel.DEFAULTS,
				typeof option == 'object' && option);

			if (!data) {
				$this.data('panel', (data = new Panel($this, options)));								
			}
			
			if (typeof option == 'string') {
				data[option] && data[option]();
			}
			else {
				data.toggle();
			}
		});
	}
	
	$.fn.panel = Plugin;

	// 自动绑定
	$doc.on('click.panel', '[data-role="panel"]', function(e) {
		e.preventDefault();
		var $this = $(this);
		var options = UI.utils.options($this.data('options'));
		var $target = $(options.target ||
			(this.href && this.href.replace(/.*(?=#[^\s]+$)/, '')) || $this.data('target'));
		var option = $target.data('panel') ? 'open' : options;

		Plugin.call($target, option, this);

	});
	
})(jQuery);

// button组件，可用于模拟checkbox, radio

;(function($){

	// Constructor
	var Button = function(element, options){
		this.$element = $(element);
		this.options = $.extend({}, Button.DEFAULTS, options);
		this.isloading = false;
		this.init();		
	}

	Button.DEFAULTS = {
		loadingText : 'loading...',
		type: null,
		className : {
			loading : 'ui-btn-loading',
			disabled : 'ui-disabled',
			active : 'ui-active',
			parent : 'ui-btn-group'
		}
	}

	Button.prototype = {

		init:function() {
			
		},

		// state = loading || reset
		setState: function(state){
			var disabled = 'disabled';
			var options = this.options;
			var $element = this.$element;
			var val = $element.is('input') ? 'val' : 'html';
			var loadingClassName = options.className.disabled + ' ' + options.className.loading;
			state = state + 'Text';

			if(!options.resetText){
				options.resetText = $element[val]();
			}

			$element[val](options[state]);

			setTimeout($.proxy(function(){
				if(state == 'loadingText'){
					$element.addClass(loadingClassName).attr(disabled, disabled);
					this.isloading = true;
				}
				else if(this.isloading){
					$element.removeClass(loadingClassName).removeAttr(disabled);
					this.isLoading = false;
				}
			}, this), 0);
		},	

		toggle: function(){
			var changed = true;
			var $element = this.$element;
			var $parent = this.$element.parent('.' + this.options.className.parent);
			var activeClassName = this.options.className.active;
			
			if($parent.length){				
				var $input = this.$element.find('input');			
				if($input.prop('type') == 'radio'){
					if($input.prop('checked') && $element.hasClass(activeClassName)){
						changed = false;
					}else{
						$parent.find('.' + activeClassName).removeClass(activeClassName);
					}
				}
				if(changed){
					$input.prop('checked', !$element.hasClass(activeClassName)).trigger('change');
				}
			}
			if(changed){
				$element.toggleClass(activeClassName);
				if(!$element.hasClass(activeClassName)){
					$element.blur();
				}
			}
		}

	}	

	//插件
	$.fn.button = function(option){
		return this.each(function(){

			var $this = $(this);
			var data = $this.data('ui.button');
			var options = typeof option == 'object' && {};			

			if(!data){
				$this.data('ui.button', (data = new Button(this, options)));
			}

			if(option == 'toggle'){				
				data.toggle();
			}
			else if(typeof option == 'string'){				
				data.setState(option);
			}			
		});
	}		

	// 自动绑定
	$(document).on('click.button', '[data-role="button"]', function(e) {
	  var $btn = $(this);  
	  $btn.button('toggle');
	  e.preventDefault();
	});

})(jQuery)
// 选项卡插件

// <div class="ui-tabs">
// <ul class="ui-tabs-nav">
// 	<li><a href="#">tab1</a></li>
// 	<li><a href="#">tab2</a></li>
// 	<li><a href="#">tab3</a></li>
// </ul>
// <div class="ui-tabs-content">
// 	<div class="ui-tabs-panel ui-active" id="tab1">
// 	</div>
// 	<div class="ui-tabs-panel" id="tab2">
// 	</div>
// 	<div class="ui-tabs-panel" id="tab3">
// 	</div>
// </div>
// </div>

;(function($){

	"use strict";

	function Tabs(element, options) {

		this.$element = $(element);
		this.options = $.extend({}, Tabs.DEFAULTS, options || {});

		this.$tabNav = this.$element.find(this.options.selector.nav);
		this.$navs = this.$tabNav.find('a');

		this.$content = this.$element.find(this.options.selector.content);
		this.$tabPanels = this.$content.find(this.options.selector.panel);

		this.transitioning = false;

		this.init();
	};

	Tabs.DEFAULTS = {
		selector: {
			nav: '.ui-tabs-nav',
			content: '.ui-tabs-content',
			panel: '.ui-tabs-panel'
		},
		className: {
			active: 'ui-active'
		}
	};

	Tabs.prototype = {

		init: function(){

			var me = this;
			var options = this.options;

			// Activate the first Tab when no active Tab or multiple active Tabs
			if (this.$tabNav.find('> .ui-active').length !== 1) {
				var $tabNav = this.$tabNav;
				this.activate($tabNav.children('li').first(), $tabNav);
				this.activate(this.$tabPanels.first(), this.$content);
			}

			this.$navs.on('click.tabs.ui', function(e) {
				e.preventDefault();
				me.open($(this));
			});			

		},

		open: function($nav) {
			
			if (!$nav || this.transitioning || $nav.parent('li').hasClass('ui-active')) {
				return;
			}		
			var $tabNav = this.$tabNav;
			var $navs = this.$navs;
			var $tabContent = this.$content;
			var href = $nav.attr('href');
			var regexHash = /^#.+$/;
			var $target = regexHash.test(href) && this.$content.find(href) ||
			this.$tabPanels.eq($navs.index($nav));
			var previous = $tabNav.find('.ui-active a')[0];
			var e = $.Event('open.tabs.ui', {
				relatedTarget: previous
			});

			$nav.trigger(e);

			if (e.isDefaultPrevented()) {
				return;
			}

		  // activate Tab nav
		  this.activate($nav.closest('li'), $tabNav);

		  // activate Tab content
		  this.activate($target, $tabContent, function() {		  	
		  	$nav.trigger({
		  		type: 'opened.tabs.ui',
		  		relatedTarget: previous
		  	});
		  });

		},

		activate: function($element, $container, callback) {

			this.transitioning = true;

			var $active = $container.find('> .ui-active');
			var transition = callback && $.support.transition && !!$active.length;
			
			$active.removeClass('ui-active');
			// $element.width();
			$element.addClass('ui-active');				  

			// 回调函数
		  if(transition){		  	
		  	$active.one($.support.transition.end, function(){
		  		callback && callback();	
		  	});
		  }else{
		  	callback && callback();			  	
		  }

		  this.transitioning = false;

		}

	}

	$.fn.tabs = function(option){
		return this.each(function() {
			
			var $this = $(this);
			var $tabs = $this.is('.ui-tabs') && $this || $this.closest('.ui-tabs');
			var data = $tabs.data('ui.tabs');
			var options = $.extend({}, $.isPlainObject(option) ? option : {});

			if (!data) {
				$tabs.data('ui.tabs', (data = new Tabs($tabs[0], options)));
			}

			if (typeof option == 'string' && $this.is('.ui-tabs-nav a')) {
				data[option]($this);
			}
		});
	}

})(jQuery);

$(function(){
	$('.ui-tabs').tabs();
});
// 加减数值插件
// 需要增disable方法

// <div data-trigger="spinner">
//   <a data-spin="down" href="javascript:"></a>
//   <input type="text" data-rule="quantity" value="1">
//   <a data-spin="up" href="javascript:"></a>
// </div>

/*! jQuery spinner - v0.1.5 - 2014-01-29
* https://github.com/xixilive/jquery-spinner
* Copyright (c) 2014 xixilive; Licensed MIT */

;(function($){
  "use strict";

  var spinningTimer;
  var Spinning = function(el, options){
    this.$el = el;
    this.options = $.extend({}, Spinning.rules.defaults, Spinning.rules[options.rule] || {}, options || {});
    this.min = parseFloat(this.options.min) || 0;
    this.max = parseFloat(this.options.max) || 0;

    this.$el
      .on('focus.spinner', $.proxy(function(e){
        e.preventDefault();
        $(document).trigger('mouseup.spinner');
        this.oldValue = this.value();
      }, this))
      .on('change.spinner', $.proxy(function(e){
        e.preventDefault();
        this.value(this.$el.val());
      }, this))
      .on('keydown.spinner', $.proxy(function(e){
        var dir = {38: 'up', 40: 'down'}[e.which];
        if(dir){
          e.preventDefault();
          this.spin(dir);
        }
      }, this));
    
    //init input value
    this.oldValue = this.value();
    this.value(this.$el.val());
    return this;
  };

  Spinning.rules = {
    defaults: {min: null, max: null, step: 1, precision:0},
    currency: {min: 0.00, max: null, step: 0.01, precision: 2},
    quantity: {min: 1, max: 999, step: 1, precision:0},
    percent:  {min: 1, max: 100, step: 1, precision:0},
    month:    {min: 1, max: 12, step: 1, precision:0},
    day:      {min: 1, max: 31, step: 1, precision:0},
    hour:     {min: 0, max: 23, step: 1, precision:0},
    minute:   {min: 1, max: 59, step: 1, precision:0},
    second:   {min: 1, max: 59, step: 1, precision:0}
  };

  Spinning.prototype = {
    spin: function(dir){
      if (this.$el.attr('disabled') === 'disabled') {
          return;
      }

      this.oldValue = this.value();
      switch(dir){
        case 'up':
          this.value(this.oldValue + Number(this.options.step, 10));
          break;
        case 'down':
          this.value(this.oldValue - Number(this.options.step, 10));
          break;
      }
    },

    value: function(v){
      if(v === null || v === undefined){
        return this.numeric(this.$el.val());
      }
      v = this.numeric(v);
      
      var valid = this.validate(v);
      if(valid !== 0){
        v = (valid === -1) ? this.min : this.max;
      }
      this.$el.val(v.toFixed(this.options.precision));

      if(this.oldValue !== this.value()){
        //changing.spinner
        this.$el.trigger('changing.spinner', [this.value(), this.oldValue]);

        //lazy changed.spinner
        clearTimeout(spinningTimer);
        spinningTimer = setTimeout($.proxy(function(){
          this.$el.trigger('changed.spinner', [this.value(), this.oldValue]);
        }, this), Spinner.delay);
      }
    },

    numeric: function(v){
      v = this.options.precision > 0 ? parseFloat(v, 10) : parseInt(v, 10);
      return v || this.options.min || 0;
    },

    validate: function(val){
      if(this.options.min !== null && val < this.min){
        return -1;
      }
      if(this.options.max !== null && val > this.max){
        return 1;
      }
      return 0;
    }
  };

  var Spinner = function(el, options){
    this.$el = el;
    this.$spinning = $("[data-spin='spinner']", this.$el);
    if(this.$spinning.length === 0){
      this.$spinning = $(":input[type='text']", this.$el);
    }
    this.spinning = new Spinning(this.$spinning, this.$spinning.data());

    this.$el
      .on('click.spinner', "[data-spin='up'],[data-spin='down']", $.proxy(this.spin, this))
      .on('mousedown.spinner', "[data-spin='up'],[data-spin='down']", $.proxy(this.spin, this));

    $(document).on('mouseup.spinner', $.proxy(function(){
      clearTimeout(this.spinTimeout);
      clearInterval(this.spinInterval);
    }, this));

    options = $.extend({}, options);
    if(options.delay){
      this.delay(options.delay);
    }
    if(options.changed){
      this.changed(options.changed);
    }
    if(options.changing){
      this.changing(options.changing);
    }
  };

  Spinner.delay = 500;

  Spinner.prototype = {
    constructor: Spinner,

    spin: function(e){
      var dir = $(e.currentTarget).data('spin');
      switch(e.type){
        case 'click':
          e.preventDefault();
          this.spinning.spin(dir);
          break;

        case 'mousedown':
          if(e.which === 1){
            this.spinTimeout = setTimeout($.proxy(this.beginSpin, this, dir), 300);
          }
          break;
      }
    },

    delay: function(ms){
      var delay = parseInt(ms, 10);
      if(delay > 0){
        this.constructor.delay = delay + 100;
      }
    },

    value: function(){
      return this.spinning.value();
    },

    changed: function(fn){
      this.bindHandler('changed.spinner', fn);
    },

    changing: function(fn){
      this.bindHandler('changing.spinner', fn);
    },

    bindHandler: function(t, fn){
      if($.isFunction(fn)){
        this.$spinning.on(t, fn);
      }else{
        this.$spinning.off(t);
      }
    },

    beginSpin: function(dir){
      this.spinInterval = setInterval($.proxy(this.spinning.spin, this.spinning, dir), 100);
    }
  };

  $.fn.spinner = function(options, value){
    return this.each(function(){
      var self = $(this), data = self.data('spinner');
      if(!data){
        self.data('spinner', (data = new Spinner(self, $.extend({}, self.data(), options))));
      }
      if(options === 'delay' || options === 'changed' || options === 'changing'){
        data[options](value);
      }
      if(options === 'spin' && value){
        data.spinning.spin(value);
      }
    });
  };

  $(function(){
    $('[data-trigger="spinner"]').spinner();
  });
})(jQuery);
// select 插件

// <div class="form-select">
// 	<span></span>
// 	<select>					
// 		<option></option>						
// 	</select>
// </div>

;(function($){

	"use strict";

	var FormSelect = function($element ,settings){
		this.settings = $.extend({},
			FormSelect.DEFAULTS, settings || {});
		this.element = $element;
		this.init();
		return this;
	}

	// 初始值
	FormSelect.DEFAULTS = {
		'target': '>span:first'
	};

	FormSelect.prototype = {	

		init: function() {
			
			var $this = this;
			// debugger;

			this.target  = this.element.find(this.settings.target);
			this.select  = this.element.find('select');

        // init + on change event
        this.select.on("change", (function(){

        	var select = $this.select[0], fn = function(){        		
        		try {
        			// console.log(select.options[select.selectedIndex].text);
        			$this.target.text(select.options[select.selectedIndex].text);
        		} catch(e) {}

        		return fn;
        	};

        	return fn();
        })());

        this.element.data("formSelect", this);
      }
    }

	//  插件
	$.fn.formSelect = function(settings) {		
		return this.each(function() {
			var that = $(this);			
			var plugin = that.data('formSelect');
			if(!plugin){
				plugin = new FormSelect(that, settings);
				that.data('formSelect', plugin);
			}			
		});
	}		

})(jQuery);
$(function(){
	$('.form-select').formSelect();	
});
// 遮罩插件

;(function($) { 

  "use strict";

  var $doc = $(document);
  var supportTransition = $.support.transition;

  var Mask = function() {
    this.settings = $.extend({},
      Mask.DEFAULTS || {});
    this.id = "ID"+(new Date().getTime())+"RAND"+(Math.ceil(Math.random() * 100000));
    this.$element = $(this.settings.tpl, {
      id: this.id
    });

    this.inited = false;
    this.scrollbarWidth = 0;
    this.used = $([]);
  };

  Mask.DEFAULTS = {
    tpl: '<div class="ui-mask" data-role="mask"></div>',
    duration: 300
  };

  Mask.prototype = {

    init: function(){

      if (!this.inited) {
        $(document.body).append(this.$element);
        this.settings.opacity && this.$element.css('opacity', this.settings.opacity);
        this.inited = true;
        $doc.trigger('init.mask');
      }
    
      return this;
    },

    open: function(relatedElement){

      if (!this.inited) {
        this.init();
      }

      var $element = this.$element;

    // 用于多重调用
    if (relatedElement) {
      this.used = this.used.add($(relatedElement));
    }

    this.checkScrollbar().setScrollbar();

    $element.show().trigger('open.mask');

    setTimeout(function() {
      $element.addClass('ui-active');
    }, 0);

    return this;

  },

  close: function(relatedElement, force){

    this.used = this.used.not($(relatedElement));

    if (!force && this.used.length) {
      return this;
    }

    var $element = this.$element;

    $element.removeClass('ui-active').trigger('close.mask');

    function complete() {      
      this.resetScrollbar();
      $element.hide();
    } 

    // 动画支持
    if(supportTransition){
      $element.one(supportTransition.end, $.proxy(complete, this)).emulateTransitionEnd(this.settings.duration);
    }else{
      complete.call(this);
    } 

    return this;

  },

  checkScrollbar: function(){

    this.scrollbarWidth = UI.utils.measureScrollbar();
    return this;

  },

  setScrollbar: function(){

    var $body = $(document.body);
    var bodyPaddingRight = parseInt(($body.css('padding-right') || 0), 10);

    if (this.scrollbarWidth) {
      $body.css('padding-right', bodyPaddingRight + this.scrollbarWidth);
    }

    $body.addClass('ui-mask-active');

    return this;

  },

  resetScrollbar: function(){

    $(document.body).css('padding-right', '').removeClass('ui-mask-active');
    return this;

  }

}

$.mask = new Mask();

})(jQuery);
  // 弹出框插件

  // <div class="ui-modal modal-dialog">
  //   <div class="ui-modal-header">
  //     header
  //     <a href="javascript:;" class="ui-close" data-modal="close">&times;</a>
  //   </div>
  //   <div class="ui-modal-content">
  //     content
  //   </div>    
  //   <div class="ui-modal-footer">
  //     <a href="#" class="ui-modal-btn" data-modal="close">cancel</a>
  //     <a href="#" class="ui-modal-btn" data-modal="confirm">confirm</a>
  //   </div>
  // </div>

  // via https://github.com/allmobilize/amazeui.git

  ;(function($) {

    "use strict";

    var $doc = $(document);
    var supportTransition = UI.support.transition;

    var Modal = function(element, options) {
      this.options = $.extend({}, Modal.DEFAULTS, options || {});
      this.$element = $(element);

      if (!this.$element.attr('id')) {
        this.$element.attr('id', "ID"+(new Date().getTime())+"RAND"+(Math.ceil(Math.random() * 100000)));
      }

      this.isPopup = this.$element.hasClass('ui-popup');
      this.active = this.transitioning = null;

      this.events();
    };

    Modal.DEFAULTS = {
      className: {
        active: 'ui-modal-active',
        out: 'ui-modal-out'
      },
      selector: {
        modal: '.ui-modal',
        active: '.ui-modal-active'
      },
      cancelable: true,
      onConfirm: function() {
      },
      onCancel: function() {
      },    
      duration: 300, 
      transitionEnd: supportTransition.end &&
      supportTransition.end + '.modal'
    };

    Modal.prototype = {

      toggle: function(relatedElement){
        return this.active ? this.close() : this.open(relatedElement);
      },

      open: function(relatedElement ){
        var $element = this.$element;
        var options = this.options;
        var isPopup = this.isPopup;

        if (this.active) {
          return;
        }

        if (!this.$element.length) {
          return;
        }

        // 判断如果还在动画，就先触发之前的closed事件
        if (this.transitioning) {
          clearTimeout($element.transitionEndTimmer);
          $element.transitionEndTimmer = null;
          $element.trigger(options.transitionEnd).off(options.transitionEnd);
        }

        isPopup && this.$element.show();

        this.active = true;

        $element.trigger($.Event('open.modal',
          {relatedElement: relatedElement}));

        $.mask.open($element);

        $element.show().redraw();

        !isPopup && $element.css({
          marginTop: -parseInt($element.height() / 2, 10) + 'px'
        });

        $element.
        removeClass(options.className.out).
        addClass(options.className.active);

        this.transitioning = 1;

        var complete = function() {
          $element.trigger($.Event('opened.modal',
            {relatedElement: relatedElement}));
          this.transitioning = 0;
        };

        if (!supportTransition) {
          return complete.call(this);
        }

        $element.
        one(options.transitionEnd, $.proxy(complete, this)).
        emulateTransitionEnd(options.duration);
      },

      close: function(relatedElement){

        if (!this.active) {
          return;
        }

        var $element = this.$element;
        var options = this.options;
        var isPopup = this.isPopup;

        // 判断如果还在动画，就先触发之前的opened事件
        if (this.transitioning) {
          clearTimeout($element.transitionEndTimmer);
          $element.transitionEndTimmer = null;
          $element.trigger(options.transitionEnd).off(options.transitionEnd);
          $.mask.close($element, true);
        }

        this.$element.trigger($.Event('close.modal',
          {relatedElement: relatedElement}));       

        this.transitioning = 1;

        var complete = function() {
          $element.trigger('closed.modal');
          isPopup && $element.removeClass(options.className.out);
          $element.hide();
          this.transitioning = 0;
        };

        $element.
        removeClass(options.className.active).
        addClass(options.className.out);

        if (!supportTransition) {
          return complete.call(this);
        }

        $element
        .one(options.transitionEnd, $.proxy(complete, this))
        .emulateTransitionEnd(options.duration);
        
        $.mask.close($element, false);

        this.active = false;

      },

      // 事件绑定
      events: function(){

        var that = this;
        var $element = this.$element;
        var $ipt = $element.find('[data-modal="input"]');

        if (this.options.cancelable) { 
          $.mask.$element.on('click', function(e) {        
            that.close();
          });
        }

        // Close button
        $element.find('[data-modal="close"]').on('click.modal', function(e) {
          e.preventDefault();
          that.close();
        });  

        $element.find('[data-modal="cancel"]').on('click.modal', function(e) {
          e.preventDefault();          
          that.options.onCancel.call(that, $ipt.val());
          that.close(); 
        });           

        $element.find('[data-modal="confirm"]').on('click.modal', function(e) {
          e.preventDefault();
          that.options.onConfirm.call(that, $ipt.val()); 
          that.close();
        });       

      }

    }
    
    // 插件
    $.fn.modal = function(option, relatedElement) {
      return this.each(function() {
        var $this = $(this);
        var data = $this.data('modal');
        var options = $.extend({},
          Modal.DEFAULTS, typeof option == 'object' && option);

        if (!data) {
          $this.data('modal', (data = new Modal(this, options)));
        }

        if (typeof option == 'string') {
          data[option](relatedElement);
        } else {
          data.open(option && option.relatedElement || undefined);
        }
      });
    }  

    // 自动绑定
    $doc.on('click.modal', '[data-role="modal"]', function() {
      var $this = $(this);
      var options = UI.utils.options($this.attr('data-options'));
      // console.log(options);
      var $target = $(options.target ||
        (this.href && this.href.replace(/.*(?=#[^\s]+$)/, '')) || $this.data('target'));
      var option = $target.data('modal') ? 'toggle' : options;

      $.fn.modal.call($target, option, this);
    });  


    var alertTpl = '<div id="alertModal" class="ui-modal hide">' +
    '<div class="ui-modal-header"></div>' +        
    '<div class="ui-modal-content"></div>' +  
    '<div class="ui-modal-footer">' + 
    '<a href="#" class="ui-modal-btn" data-modal="confirm">确定</a>' + 
    '</div>' +
    '</div>';  

    $.alert = function (text, title, callbackOk) {

      if (typeof title === 'function') {
        callbackOk = arguments[1];
        title = undefined;
      }
      var modal = $('#alertModal');
      if(!modal.length){
        $('body').append(alertTpl);
        modal = $('#alertModal')
      }       

      modal.find('.ui-modal-header').html(typeof title === 'undefined' ? '提示信息' : title);
      modal.find('.ui-modal-content').html(text || '');

      return modal.modal({
        cancelable: false,
        onConfirm: function() {  
          modal.remove();              
          $.isFunction(callbackOk) && callbackOk.call(this);
          this.close();          
        }
      });

    }

    var confirmTpl = '<div id="confirmModal" class="ui-modal hide">' +
    '<div class="ui-modal-header"></div>' +        
    '<div class="ui-modal-content"></div>' +  
    '<div class="ui-modal-footer">' + 
    '<a href="#" class="ui-modal-btn" data-modal="cancel">取消</a>' +  
    '<a href="#" class="ui-modal-btn" data-modal="confirm">确定</a>' +   
    '</div>' +
    '</div>';

    $.confirm = function (text, title, callbackOk, callbackCancel) {
      if (typeof title === 'function') {
        callbackCancel = arguments[2];
        callbackOk = arguments[1];
        title = undefined;
      }

      var modal = $('#confirmModal');
      if(!modal.length){
        $('body').append(confirmTpl);
        modal = $('#confirmModal')
      }       

      modal.find('.ui-modal-header').html(typeof title === 'undefined' ? '提示信息' : title);
      modal.find('.ui-modal-content').html(text || '');

      return modal.modal({
        cancelable: false,
        onConfirm: function() {                           
          $.isFunction(callbackOk) && callbackOk.call(this); 
        },
        onCancel: function() {
          $.isFunction(callbackCancel) && callbackCancel.call(this);          
        }
      });

    };

    var promptTpl = '<div id="promptModal" class="ui-modal hide">' +
    '<div class="ui-modal-header"></div>' +        
    '<div class="ui-modal-content"><p class="modal-prompt-text"></p>' +
    '<input type="text" data-modal="input">' +
    '</div>' +  
    '<div class="ui-modal-footer">' + 
    '<a href="#" class="ui-modal-btn" data-modal="cancel">取消</a>' +  
    '<a href="#" class="ui-modal-btn" data-modal="confirm">确定</a>' +   
    '</div>' +
    '</div>';
    
    $.prompt = function (text, title, callbackOk, callbackCancel) {
      if (typeof title === 'function') {
        callbackCancel = arguments[2];
        callbackOk = arguments[1];
        title = undefined;
      }
      var modal = $('#promptModal');
      if(!modal.length){
        $('body').append(promptTpl);
        modal = $('#promptModal')
      }       

      modal.find('.ui-modal-header').html(typeof title === 'undefined' ? '提示信息' : title);
      modal.find('.ui-modal-content .modal-prompt-text').html(text || '');

      return modal.modal({
        cancelable: false,
        onConfirm: function(val) {                         
          $.isFunction(callbackOk) && callbackOk.call(this);          
        },
        onCancel: function(val) {   
          $.isFunction(callbackCancel) && callbackCancel.call(this);          
        }
      });
    };

  })(jQuery);
// 信息提示插件

// <div class="ui-notify ui-notify-center">
//     <div class="ui-notify-message">
//         <a class="ui-close">×</a>
//         <div class="ui-notify-content">content</div>
//     </div>
// </div>

// via https:https://github.com/uikit

;(function($) {

	"use strict";

	// 可以提示多个
	var containers = {},
		messages = {},

		notify = function(options, callFn) {

			if ($.type(options) == 'string') {
				options = {
					message: options
				};
			}

			if (arguments[1]) {
				options = $.extend(options, $.type(arguments[1]) == 'string' ? {
					status: arguments[1]
				} : arguments[1]);
			}

			// 回调函数
			if(callFn != undefined && $.isFunction(callFn)){
				options.onClose = callFn;
			}

			return (new Message(options)).show();
		},
		closeAll = function(group, instantly) {
			if (group) {
				for (var id in messages) {
					if (group === messages[id].group) messages[id].close(instantly);
				}
			} else {
				for (var id in messages) {
					messages[id].close(instantly);
				}
			}
		};

	var Message = function(options) {

			var $this = this;

			this.options = $.extend({}, Message.defaults, options);

			if (this.options.id) {
				this.uuid = this.options.id;
			} else {
				this.uuid = "ID" + (new Date().getTime()) + "RAND" + (Math.ceil(Math.random() * 100000));
			}

			this.element = $([

			'<div class="ui-notify-message">', '<a class="ui-close">×</a>', '<div class="ui-notify-content">' + this.options.message + '</div>', '</div>'

			].join('')).data("notifyMessage", this);

			// status
			if (this.options.status) {
				this.element.addClass('ui-notify-message-' + this.options.status);
				this.currentstatus = this.options.status;
			}

			if(!this.options.showClose){
				this.element.find('.ui-close').hide();
			}

			this.group = this.options.group;

			messages[this.uuid] = this;

			if (!containers[this.options.pos]) {
				containers[this.options.pos] = $('<div class="ui-notify ui-notify-' + this.options.pos + '"></div>').appendTo('body').on("click", ".ui-notify-message", function() {
					$(this).data("notifyMessage").close();
				});
			}
		};

	Message.defaults = {
		id: null,
		message: "",
		status: "",
		timeout: 3000,
		showMask: false, // 背景共用mask的，太黑了
		group: null,
		showClose: false,
		pos: 'center',
		onClose: function() {}
	};


	Message.prototype = {

		uuid: false,
		element: false,
		timout: false,
		currentstatus: "",
		group: false,

		show: function() {

			if (this.element.is(":visible")) return;

			var $this = this;

			containers[this.options.pos].show().prepend(this.element);

			var marginbottom = parseInt(this.element.css("margin-bottom"), 10);

			this.options.showMask && $.mask.open($this);

			this.element.css({
				"opacity": 0,
				"margin-top": -1 * this.element.outerHeight(),
				"margin-bottom": 0
			}).animate({
				"opacity": 1,
				"margin-top": 0,
				"margin-bottom": marginbottom
			}, function() {

				if ($this.options.timeout) {

					var closefn = function() {
							$this.close();
						};

					$this.timeout = setTimeout(closefn, $this.options.timeout);

					$this.element.hover(

					function() {
						clearTimeout($this.timeout);
					}, function() {
						$this.timeout = setTimeout(closefn, $this.options.timeout);
					});
				}

			});

			return this;
		},

		close: function(instantly) {

			var $this = this,
				finalize = function() {
					$this.element.remove();

					if (!containers[$this.options.pos].children().length) {
						containers[$this.options.pos].hide();
					}

					$this.options.onClose.apply($this, []);

					delete messages[$this.uuid];
				};

			if (this.timeout) clearTimeout(this.timeout);

			if (instantly) {
				finalize();
			} else {
				this.element.animate({
					"opacity": 0,
					"margin-top": -1 * this.element.outerHeight(),
					"margin-bottom": 0
				}, function() {
					finalize();
				});
			}


			this.options.showMask && $.mask.close($this, false);
		},

		content: function(html) {

			var container = this.element.find(".ui-notify-content");

			if (!html) {
				return container.html();
			}

			container.html(html);

			return this;
		},

		status: function(status) {

			if (!status) {
				return this.currentstatus;
			}

			this.element.removeClass('ui-notify-message-' + this.currentstatus).addClass('ui-notify-message-' + status);

			this.currentstatus = status;

			return this;
		}
	}

	// 插件
	$.notify = notify;
	$.notify.closeAll = closeAll;

})(jQuery);
// 平滑滚动
// 默认<span data-smooth-scroll>回到顶部</span>

;(function($) {

  var rAF = UI.utils.rAF;
  var cAF = UI.utils.cancelAF;

  /**
   * Smooth Scroll
   * @param position
   * @via http://mir.aculo.us/2014/01/19/scrolling-dom-elements-to-the-top-a-zepto-plugin/
   */

  // Usage: $(window).smoothScroll([options])

  // only allow one scroll to top operation to be in progress at a time,
  // which is probably what you want
  var smoothScrollInProgress = false;

  var SmoothScroll = function(element, options) {
      options = options || {};

      var $this = $(element);
      var targetY = parseInt(options.position) || SmoothScroll.DEFAULTS.position;
      var initialY = $this.scrollTop();
      var lastY = initialY;
      var delta = targetY - initialY;
      // duration in ms, make it a bit shorter for short distances
      // this is not scientific and you might want to adjust this for
      // your preferences
      var speed = options.speed || Math.min(750, Math.min(1500, Math.abs(initialY - targetY)));
      // temp variables (t will be a position between 0 and 1, y is the calculated scrollTop)
      var start;
      var t;
      var y;
      var cancelScroll = function() {
          abort();
        };

      // abort if already in progress or nothing to scroll
      if (smoothScrollInProgress) {
        return;
      }

      if (delta === 0) {
        return;
      }

      // quint ease-in-out smoothing, from
      // https://github.com/madrobby/scripty2/blob/master/src/effects/transitions/penner.js#L127-L136

      function smooth(pos) {
        if ((pos /= 0.5) < 1) {
          return 0.5 * Math.pow(pos, 5);
        }

        return 0.5 * (Math.pow((pos - 2), 5) + 2);
      }

      function abort() {
        $this.off('touchstart.smoothscroll', cancelScroll);
        smoothScrollInProgress = false;
      }

      // when there's a touch detected while scrolling is in progress, abort
      // the scrolling (emulates native scrolling behavior)
      $this.on('touchstart.smoothscroll', cancelScroll);
      smoothScrollInProgress = true;

      // start rendering away! note the function given to frame
      // is named "render" so we can reference it again further down

      function render(now) {
        if (!smoothScrollInProgress) {
          return;
        }
        if (!start) {
          start = now;
        }

        // calculate t, position of animation in [0..1]
        t = Math.min(1, Math.max((now - start) / speed, 0));
        // calculate the new scrollTop position (don't forget to smooth)
        y = Math.round(initialY + delta * smooth(t));
        // bracket scrollTop so we're never over-scrolling
        if (delta > 0 && y > targetY) {
          y = targetY;
        }
        if (delta < 0 && y < targetY) {
          y = targetY;
        }

        // only actually set scrollTop if there was a change fromt he last frame
        if (lastY != y) {
          $this.scrollTop(y);
        }

        lastY = y;
        // if we're not done yet, queue up an other frame to render,
        // or clean up
        if (y !== targetY) {
          cAF(scrollRAF);
          scrollRAF = rAF(render);
        } else {
          cAF(scrollRAF);
          abort();
        }
      }

      var scrollRAF = rAF(render);
    };

  SmoothScroll.DEFAULTS = {
    position: 0
  };

  $.fn.smoothScroll = function(option) {
    return this.each(function() {
      new SmoothScroll(this, option);
    });
  };

  // Init code
  $(document).on('click.smoothScroll', '[data-smooth-scroll]', function(e) {
    e.preventDefault();
    var options = UI.utils.options($(this).data('SmoothScroll'));
    $(window).smoothScroll(options);
  });

})(jQuery);