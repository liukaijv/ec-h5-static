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
		
		// 关闭所有
		$doc.on('click.panel', '[data-panel="closeAll"]', $.proxy(function(e) {
			e.preventDefault();			
			this.close();
		}, this));

		// 关闭当前的弹框		
		$doc.on('click.panel', '[data-panel="close"]', function(e) {			
			e.preventDefault();			
			var _this = $(this);
			var closestPanel = _this.closest('.ui-panel');			
			closestPanel.length && closestPanel.panel('close');			
		});

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
		if(!$target.length) return;
		var option = $target.data('panel') ? 'open' : options;

		Plugin.call($target, option, this);

	});
	
})(jQuery);
