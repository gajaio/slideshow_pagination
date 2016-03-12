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

(function($){

	//consider num of pages & active page
	// now changed the logic to ---- overflow: hidden so that it would be easy to animate the transition
	$.fn.pagination = function(params){
		var self = this;
		var options = {};
		opts = $.fn.pagination.defaults;

		self.next = $.fn.pagination.next;
		self.previous = $.fn.pagination.previous;
		self.first = $.fn.pagination.first;
		self.last = $.fn.pagination.last;
        self.goto = $.fn.pagination.goto;
        self._int = null;
        self.timer_stop = function(){
            if(self._int) {
                clearInterval(self._int);
                self._int = null;
            }
        }

        self.timer_start = function(){
            if(self._int == null) self._int = setInterval(function(){ self.next(); }, self.options.delay_wait);
        } 

		self.currentpage = $.fn.pagination.currentpage;
		self.pageCount = $.fn.pagination.pageCount;

		return this.each(function(){
			console.log(typeof options);
			if(typeof params === 'string'){
				options.columnCount = params;
			}else{
				options = params;
			}
			options = $.extend({}, opts, options);
			self.options = options;
			var html;
			//loop through each item
			var c_count = options.columnCount;
			var r_count = options.rowCount;
			var col_counter = 1;
			var i = 0;
			var items = [];
			var children = $(this).children(); //takes immediate children as page items. div is prefferred as child node
			var count_ch = $(children).length;
			$(children).each(function(index){
				items[i] = (items[i] || "") + "<div style='float: left; position: relative; width: auto;' id='item"+(index+1)+"' class='"+$(this).attr('class')+" item'>"+$(this).html()+"</div>";
				c_count--;
				if(c_count == 0) {
					c_count = options.columnCount;
					items[i]="<div style='clear:both;' id='row"+(col_counter++)+"'>"+items[i]+"</div>";
					i+=1;
				}else if(index == count_ch - 1) {
					items[i]="<div style='clear:both;' id='row"+(col_counter++)+"'>"+items[i]+"</div>";
				}
			});
			
			$(self).empty();
            $(self).css("overflow-x", "hidden");
			var pageCount = 0;
			var page = '';
			var page_counter = 1;
            
            var divNode = $("<div class='mat' style='position: relative; left: 0px; overflow:hidden'/>");
            var pageWidth = $(self).width();
            var pageHeight = $(self).height();
			
			for (var i = 0; i < items.length; i++) {
				page+=items[i];
				r_count--;
				var lastPageCounted = false;
				if(r_count == 0) {
					page = "<div id='page"+(page_counter++)+"' class='pagination_page_hide' style='position: relative; float: left; width:"+pageWidth+"px; height: "+pageHeight+"px' class=''>"+page+"</div>";
					
					$(page).appendTo(divNode);
					r_count = options.rowCount;
					page = '';
					pageCount++;
					lastPageCounted = true; 
				}
				if(i == items.length -1 && !lastPageCounted){
					page = "<div id='page"+(page_counter++)+"' class='pagination_page_hide'  style='position: relative; float: left; width:"+pageWidth+"px; height: "+pageHeight+"px' class=''>"+page+"</div>";
					$(page).appendTo(divNode);
					pageCount++;
				}
			};
            $(divNode).css({
                width: pageCount * $(self).width()
            });
            $(divNode).appendTo($(self));

			if(options.animation_style === "default"){
                $(self).find(".pagination_page_hide").hide();
            }
			self.options.page_count = pageCount;
			self.options.page_active = 1;
            self.options.page_transition_delay = self.options.page_transition_delay || 2000;
			
			$(self).find("#page"+self.options.page_active).removeClass('pagination_page_hide').addClass('pagination_page_show')
                .fadeIn();
			$(self.options.forward_click_binding).click(function(){
				self.next();
			});

			$(self.options.backward_click_binding).click(function(){
				self.previous();
			});

			$(self.options.first_click_binding).click(function(){
				self.first();
			});

			$(self.options.last_click_binding).click(function(){
				self.last();
			});


			var itemnodes = $(self).find("div.item");
			$(itemnodes).click(function(){
				self.options.itemOnClick($(itemnodes).index(this), itemnodes);
			}); 
            
            

			$.fn.pagination.page.currentpage = self.currentpage();
			$.fn.pagination.page.pagecount = self.pageCount();
			self.options.on_load($.fn.pagination.page);
			if(self.options.delay_wait){
				self.options.circular = true;
//				_int = setInterval(function(){ self.next(); }, self.options.delay_wait);
                if(self.options.delay_wait) self.timer_start();
				$(self).mouseover(function(){
					/*if(_int) {
						clearInterval(_int);
						_int = null;
					}*/
                    self.timer_stop();
				});
				$(self).mouseout(function(){
//					if(_int==null) _int = setInterval(function(){ self.next(); }, self.options.delay_wait);
                    if(self.options.delay_wait) self.timer_start();
				});
			}
		});
	};
    

	$.fn.pagination.defaults = {
		columnCount: undefined,
		width: 'auto',
		height: 'auto',
		rowCount: 2,
		totalPages: 0,
		forward_click_binding: undefined,
		backward_click_binding: undefined,
		first_click_binding: undefined,
        last_click_binding: undefined,
		circular: false,
		delay_wait: null,
        animation_style: 'default', //slide, default
        page_transition_delay: null,
		itemOnClick: function(index, itemnodes){
			console.log("Unimplemented code");
		},
		onNavigate: function(){
			
		},
		on_load: function(){

		}
	};

	$.fn.pagination.page = {
		currentpage: 0,
		pagecount: 0
	};
    
    $.fn.pagination.goto = function(pageNum){
        if(this.options.animation_style === 'slide') $(this).find("div.mat").stop(true, false);
        if(this.options.delay_wait)  this.timer_stop();
        var pg_num = new Number(pageNum);
        if(pg_num == NaN) return;
        if(pg_num < 1 || pg_num > this.pageCount()) return;
        var toHide = $(this).find("#page"+this.options.page_active).removeClass("pagination_page_show").addClass("pagination_page_hide");
        var old_page_ref = this.options.page_active;
        this.options.page_active = pg_num;
		var toShow = $(this).find("#page"+this.options.page_active).removeClass("pagination_page_hide").addClass("pagination_page_show");
        var obj = this;
        if(this.options.animation_style === 'slide'){
            var distance = 0;
            if(old_page_ref >= pageNum){
                var pos = $(this).find("div.mat").css('left');
                pos = new Number(pos.replace(/px/g, ''));
                distance = -1 * (old_page_ref - 1) * $(this).width()+ $(this).width() * (old_page_ref - pageNum);
            }
            else{
               distance = -1 * $(this).width() * (old_page_ref - 1) - (pageNum - old_page_ref)*$(this).width(); 
            }
        
            $(this).find('div.mat').animate({left: distance}, this.options.page_transition_delay, function(){
                if(obj.options.delay_wait) obj.timer_start(obj.options.delay_wait);
            });
        }else if(this.options.animation_style === "default"){
            $(toHide).fadeOut();
            $(toShow).fadeIn(this.options.page_transition_delay, function(){
                if(obj.options.delay_wait) obj.timer_start(obj.options.delay_wait);
            });
        }
		$.fn.pagination.page.currentpage = pageNum;
		$.fn.pagination.page.pagecount = this.pageCount();
		this.options.onNavigate($.fn.pagination.page);
		return this;
    }

	$.fn.pagination.last = function(){
        if(this.options.animation_style === 'slide') $(this).find("div.mat").stop(true, false);
        if(this.options.delay_wait)  this.timer_stop();
        
        
		var toHide = $(this).find("#page"+this.options.page_active).removeClass("pagination_page_show").addClass("pagination_page_hide");
            
		this.options.page_active = this.pageCount();
        var obj = this;
		var toShow = $(this).find("#page"+this.options.page_active).removeClass("pagination_page_hide").addClass("pagination_page_show");
            
        if(this.options.animation_style === 'slide'){
            var distance = $(this).width() * (this.options.page_active - 1);
            $(this).find('div.mat').animate({left: -1*distance}, this.options.page_transition_delay, function(){
                if(obj.options.delay_wait) obj.timer_start(obj.options.delay_wait);
            });
        }else if(this.options.animation_style === "default"){
            $(toHide).fadeOut();
            $(toShow).fadeIn(this.options.page_transition_delay, function(){
                if(obj.options.delay_wait) obj.timer_start(obj.options.delay_wait);
            });
        }
		$.fn.pagination.page.currentpage = this.currentpage();
		$.fn.pagination.page.pagecount = this.pageCount();
		this.options.onNavigate($.fn.pagination.page);
		
		return this;
	}

	$.fn.pagination.first = function(){
        if(this.options.animation_style === 'slide') $(this).find("div.mat").stop(true, false);
        if(this.options.delay_wait)  this.timer_stop();
        
		var toHide = $(this).find("#page"+this.options.page_active).removeClass("pagination_page_show").addClass("pagination_page_hide");
        
		this.options.page_active = 1;

		var toShow = $(this).find("#page"+this.options.page_active).removeClass("pagination_page_hide").addClass("pagination_page_show");
        var obj = this;
        
        if(this.options.animation_style === 'slide'){
            var distance = $(this).width() * (this.options.page_active - 1);
            $(this).find('div.mat').animate({left: distance}, this.options.page_transition_delay, function(){
                if(obj.options.delay_wait) obj.timer_start(obj.options.delay_wait);
            });
        }else if(this.options.animation_style === "default"){
            $(toHide).fadeOut();
            $(toShow).fadeIn(this.options.page_transition_delay, function(){
                if(obj.options.delay_wait) obj.timer_start(obj.options.delay_wait);
            });
        }
        
		$.fn.pagination.page.currentpage = this.currentpage();
		$.fn.pagination.page.pagecount = this.pageCount();
		this.options.onNavigate($.fn.pagination.page);
		
		return this;
	}

	$.fn.pagination.next = function(){
        if(this.options.animation_style === 'slide') $(this).find("div.mat").stop(true, false);
        if(this.options.delay_wait)  this.timer_stop();
		var toHide = $(this).find("#page"+this.options.page_active).removeClass("pagination_page_show").addClass("pagination_page_hide");
    
		this.options.page_active += 1;
		if(this.options.page_active > this.options.page_count) this.options.page_active = this.options.circular?1:this.options.page_active-1;
		var toShow = $(this).find("#page"+this.options.page_active).removeClass("pagination_page_hide").addClass("pagination_page_show");
        var obj = this;
        if(this.options.animation_style === 'slide'){
            var distance = $(this).width() * (this.options.page_active - 1);
            
            $(this).find('div.mat').animate({left: -1*distance}, this.options.page_transition_delay, function(){
                if(obj.options.delay_wait) obj.timer_start(obj.options.delay_wait);
            });
        }else if(this.options.animation_style === "default"){
            $(toHide).fadeOut();
            $(toShow).fadeIn(this.options.page_transition_delay, function(){
                if(obj.options.delay_wait) obj.timer_start(obj.options.delay_wait);
            });
        }
		$.fn.pagination.page.currentpage = this.currentpage();
		$.fn.pagination.page.pagecount = this.pageCount();
		this.options.onNavigate($.fn.pagination.page);
		
		return this;
	};

	$.fn.pagination.previous = function(){
        if(this.options.animation_style === 'slide') $(this).find("div.mat").stop(true, false);
        if(this.options.delay_wait)  this.timer_stop();
        
		var toHide = $(this).find("#page"+this.options.page_active).removeClass("pagination_page_show").addClass("pagination_page_hide");
            
        var old_page_position = this.options.page_active;
		this.options.page_active -= 1;
		if(this.options.page_active < 1) this.options.page_active = this.options.circular?this.options.page_count:this.options.page_active+1;
        var toShow = $(this).find("#page"+this.options.page_active).removeClass("pagination_page_hide").addClass("pagination_page_show");
        var obj = this;
        if(this.options.animation_style === 'slide'){
            
            var distance = 0;
           
            if(this.options.page_active == this.options.page_count){
                distance = -1 * (this.options.page_active - 1) * $(this).width();
            }else if(this.options.page_active>=1){
                distance = $(this).width() - (this.options.page_active) * $(this).width();
            }
            
            $(this).find('div.mat').animate({left: distance}, this.options.page_transition_delay, function(){
                if(obj.options.delay_wait) obj.timer_start(obj.options.delay_wait);
            });
        }else if(this.options.animation_style === "default"){
            $(toHide).fadeOut();
            $(toShow).fadeIn(this.options.page_transition_delay, function(){
                if(obj.options.delay_wait) obj.timer_start(obj.options.delay_wait);
            });
        }
        
		$.fn.pagination.page.currentpage = this.currentpage();
		$.fn.pagination.page.pagecount = this.pageCount();
		this.options.onNavigate($.fn.pagination.page);
		console.log(this.options.page_active);
		return this;
	};

	$.fn.pagination.currentpage = function(){
		return this.options.page_active;
	};

	$.fn.pagination.pageCount = function(){
		return this.options.page_count;
	};
	

})(jQuery)