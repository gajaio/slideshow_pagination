# slideshow_pagination
This web ui component allows you to create slideshow or pagination without much effort.
Currently, it supports two animation styles when it comes to the page transition.
* default (fadein and fadeout)
* slide

##Pagination

to use the pagination component, keep your html and css ready
```
<link rel="stylesheet" href="http://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
    <link href="lib/css/option_btn.css" rel="stylesheet" type="text/css" media="all" />
  <script src="http://code.jquery.com/jquery-1.10.2.js"></script>
  <script src="http://code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
    <script type="text/javascript" src="lib/option_btn.js"></script>
    <script type="text/javascript" src="lib/pagination.js"></script>
```

###css
The following css is just an example and is not part of the library.
```
.x{
    width: auto;
    margin: 10px;
    border: red 1px solid;
}
.y{
    width: auto;
    margin: 10px;
    border: blue 2px solid;
}
.pagination {
    height: 280px;
    width: 350px;
    border: 1px solid green;
}

.cntrl{
    height: 50px;
    width: 350px;
    text-align: center;
}
```
    
###html
```
<div class="caption">
    <p><span class="current"></span> of <span class="total"></span> pages
</div>
    
<div class="cntrl" style="clear: both;">
    <button id="first">|&lt;</button>
    <button id="prev">previous</button>
    <button id="next">next</button>
    <button id="last">&gt;|</button>
</div>

<div class="pagination">
    <div class="x">
        ...........
    </div>
    <div class="x">
        .........
    </div>
    <div class="x">
        .........
    </div>
    <div class="x">
        ..........
    </div>
    <div class="x">
       ...........
    </div>
    <div class="x">
        ..........
    </div>
    <div class="x">
        ..........
    </div>
    <div class="x">
        ...........
    </div>
</div>
```
###Javascript

```
<script type="text/javascript">
	$(function(){
		var page = $(".pagination").pagination({ // add callback for transition also or provide support for the same
			columnCount: 3,
			rowCount: 1, 
            /*width: '400px',
            height: '400px',*/
			forward_click_binding: "#next", //add go method also
			backward_click_binding: "#prev",
            first_click_binding: "#first",
            last_click_binding: "#last",
			itemOnClick: function(index, itemnodes){
				var item = $(itemnodes).get(index);
				$(itemnodes).removeClass("y");
				$(item).addClass("y");
			},
			onNavigate: function(obj){ //recieves page object ($.pagination.page)
				$('span.current').text(obj.currentpage);
			},
			on_load: function(obj){
				$('span.current').text(obj.currentpage);
				$('span.total').text(obj.pagecount);
			},
            animation_style: 'default',
            page_transition_delay: 1000
			//circular: true
            /*autoloop_delay: 2000*/ //uncomment and see the auto loop
		});
    });
    </script>
```
##Slideshow
The slideshow component will have only one item per page

### css

```
.grid {
            border: solid 1px grey;
            box-shadow: 10px 10px 5px #888888;
            height: 400px;
            width: 640px;
            margin: 20px auto;
        }
        
        .grid div{
            width: inherit;
            height: inherit;
        }
        .grid div img{
            height: inherit;
            width: 100%;
        }
        
        .page_controls input{
            position: relative;
            float: left;
        }
        
        .page_controls{
            width: 100px;
            margin: 0 auto;
        }
        
        .page_controls table{
            position: relative;
            top: -50px;
        }
```

###html
```
<div class="grid">
    <div>
        <img alt="Item 1" src="images/1.jpg">
        
    </div>
    <div>
        <img alt="Item 2" src="images/2.jpg">
        
    </div>
    <div>
        <img alt="Item 3" src="images/3.jpg">
        
    </div>
    <div>
        <img alt="Item 4" src="images/4.jpg">
        
    </div>
    <div>
        <img alt="Item 5" src="images/5.jpg">
        
    </div>

</div>
    
<div class="page_controls">
    <table align="center">
        <tbody>
            <tr><td><input class="group1" type="radio" name="option1" value="1"></td>
            <td><input class="group1" type="radio" name="option2" value="2"></td>
            <td><input class="group1" type="radio" name="option3" value="3"></td>
            <td><input class="group1" type="radio" name="option4" value="4"></td>
            <td><input class="group1" type="radio" name="option5" value="5"></td></tr>
        </tbody>
    </table>
</div>
```

###Javascript

```
var newPage;
        var flow_btns = $(".group1").radioButton({
            backgroundCls: 'unchecked',
            checkmarkCls: 'checked',
            onChecked : function(item){
                console.log("Hello World !!!");
                newPage.goto($(item).prev("input").attr("value"));
            }
        });
        
        
        newPage = $(".grid").pagination({ // add callback for transition also or provide support for the same
            columnCount: 1,
            rowCount: 1, 
            
            itemOnClick: function(index, itemnodes){
                
            },
            onNavigate: function(obj){ //recieves page object ($.pagination.page)
//                $('span.currentPage').text(obj.currentpage);
                flow_btns.enable($("input[value='"+obj.currentpage+"']"));
            },
            on_load: function(obj){
                /*$('span.currentPage').text(obj.currentpage);
                $('span.totalPages').text(obj.pagecount);*/
                console.log($("input[value='1']").attr('value'));
                flow_btns.enable($("input[value='"+obj.currentpage+"']"));
            },
            animation_style: 'slide',
            page_transition_delay: 1000,
            circular: true,
            delay_wait: 3000 //uncomment and see the auto loop
        });
  ```
  
