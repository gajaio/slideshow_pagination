/*Copyright (C) 2016  Srikanth Modegunta

This program is free software: you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the Free
Software Foundation, either version 3 of the License, or (at your option)
any later version.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
more details.

You should have received a copy of the GNU General Public License along
with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function($) {
	
	$.fn.radioButton = function(options) {
		var config = {
			backgroundCls: undefined,
			checkmarkCls: undefined,
			onChecked : function(){
				//your own code here
			}
		};
        
        this.enable = $.fn.radioButton.enable;
        this.selectedItem = $.fn.radioButton.selectedItem;
        var self = this;
		
		var className = $(this).attr("class");
		return this.each(function() {
            self.config = $.extend({}, config, options);
            self.config.disbaleCallbacks = null;
			var $this = $(this);
			$this.css({opacity: 0});
			$this.attr("checked", false);
            console.log(this.options);
			$this.after('<span class="'+self.config.backgroundCls+'"></span>');
            var obj = this;
            $("."+self.config.backgroundCls).click(function() {
                console.log("each");
                $("."+self.config.checkmarkCls).removeClass(self.config.checkmarkCls);
                $(this).addClass(self.config.checkmarkCls);
                $("."+className+"[value!=" + $(this).prev().attr("value") + "]").prop("checked", false);
                if(self.config.disbaleCallbacks == null){
                    self.config.onChecked(this);   
                }
                
                $(this).prev().prop("checked", true);
            });
		});
        
       

		
	};
    
    $.fn.radioButton.enable = function(comp){ // input is the component
        this.config.disbaleCallbacks = 1;
        $(comp).next("span").trigger('click');
        this.config.disbaleCallbacks = null;
    }
    
    $.fn.radioButton.selectedItem = function(){
        retu$(self).find("."+this.config.checkmarkCls).prev("input");
    }

})(jQuery);
