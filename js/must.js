$(function(){	
	$('[data-form="ajax"]').each(function(){
		var form = $(this);
		form.html5Validate(function(){           
            form.ajaxSubmit();
            return false;
        });
	});

	window.appSwipe = Swipe($('#swipe').get(0));
});

