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
	$('[data-role="tab"]').tabs();	
});