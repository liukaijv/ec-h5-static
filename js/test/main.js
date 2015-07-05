$(function(){

	// 一些变量
	var $productList = $('#productList');
	var $preloader = $('.ui-preloader');
	var $refresh = $('.ui-refresh-down');
	var scrollOff = $refresh.outerHeight();

	// 实例化iscroll
	var iScroll = new IScroll('#iscroller', {
		scrollbars: true,
		onScrollStart: function(){
			console.log('onScrollStart');
		},
		onScrollMove: function(){
			console.log('onScrollMove');
		},
		onScrollEnd: function(){
			console.log('onScrollEnd');
		}
	});

	// 加载提示
	$(window).load(function(){		
		$preloader.stop(true, true).fadeOut(300);
	});	

	// 列表切换
	$('.toggle-list').click(function(){
		var changeClass = true;
		var $icon = $(this).find('.icon');
		if($icon.hasClass('icon-list-ul')){
			$icon.removeClass('icon-list-ul').addClass('icon-th');
			changeClass = false;
		}else{
			$icon.removeClass('icon-th').addClass('icon-list-ul');
			changeClass = true;
		}		
		changeClass ? $productList.removeClass('mode-list').addClass('mode-gird') : $productList.removeClass('mode-gird').addClass('mode-list');
		iScroll.refresh();
	});

	// 商品列表模板
	var productTpl = '<li data-id="<%=data.productid%>">' +
			'<div style="background-image:url(<%=data.productpic%>);" class="media">' +
				'<img src="images/placeholder1x1.png">' +
			'</div>' +
			'<div class="content">' +
				'<div class="title"><%=data.productname%></div>' +
				'<div class="extra">' +
					'<span class="price-sale">¥ <%=data.mktprice%></span>' +				
				'</div>' +
			'</div>' +
		'</li>';	

	function loadProducts(){
		$productList.hide();	
		$refresh.hide();	
		$preloader.show();
		$.post(baseUrl + '/getProducts', function(data){
			var html = '';
			$.each(data, function(key, value){
				var renderData = {
					data: value
				}
				html += $.parseTpl(productTpl, renderData);
			});
			$productList.fadeIn().html(html);
			$refresh.show();	
			$preloader.hide();				
			iScroll.refresh();
		});		
	}

	// 商品选项卡
	$('.tabs-nav li:not(".toggle-list")').click(function(){
		loadProducts();
		iScroll.scrollTo(0,0);
		$(this).addClass('active').siblings().removeClass('active');		
		return false;
	}).first().click();

	$('#filterTrigger').panel({
		width: '100%'
	});

	// 简单解析模板，
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

})