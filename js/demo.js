$(function(){

	$checkoutConfirmModal = $('#checkoutConfirmModal');	
	$('#checkoutConfirm').on('click',function(){
		$checkoutConfirmModal.modal();
	});	

	$('#orderConfirm').click(function(){
		// $('#confirmPost').modal();
		var aa = $.prompt('11', function(){
			$.notify('输入错误了');
		});	

	});
});