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