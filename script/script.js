$(document).ready(function(){
    
    // Add scroll class animation
    $(".animated").scrollClass();

    var $win = $(window);

    //control background parallax effect
    $('.background_block').each(function(){
        var scroll_speed = 5;
        var $this = $(this);
        $(window).scroll(function() {
            var bgScroll = -(($win.scrollTop() - $this.offset().top)/ scroll_speed);
            var bgPosition = 'center '+ bgScroll + 'px';
            $this.css({ backgroundPosition: bgPosition });
        });
    });

    //control section header parallax effect, make sure the title moved out of container when scrolled to top
    $('.section_header').each(function(){
        var base_position = $(this).parent().position().top;
        var container_width = $(this).width();
        var header = $(this).find("h1");
        $(window).scroll(function(){
            var window_height = $win.height();
            //The formular is to calculate the current position : base_position - scollTop
            //current_position is a value by pixel, divided by window height would be the percantage of it's height on view port
            //then change this percantage to pixel by multiplying the width of container and use it as offset
            var position_offset = container_width * (base_position - $win.scrollTop())/window_height;
            header.css({left: position_offset});
        });
    });

    // handel section content background scrolling effect
    $('.section_content').each(function(){
        var base_position = $(this).parent().position().top;
        var content_block = $(this);
        var container_height = $(this).parent().height();
        $(window).scroll(function(){
            var window_height = $win.height();
            var background_op = 0.8 - 2.5 * Math.abs((base_position + container_height/2 - $win.scrollTop())/window_height - 0.5);
            var background_color = 'rgba(0,0,0,'+background_op+')';
            content_block.css({background:background_color});
        })
    })

    //handle bottom navigation display
    $('.side_navigation button').click(function(){
        $(this).parent().find("ul").toggleClass("hidden");
        $(this).parent().toggleClass("expanded");
    });

    //handle collapse behaviour
    $(".collapse").click(function(){
        $(this).parent().removeClass("visible");
        $(this).parent().removeClass("fadeInLeft")
    });

    //expanding sub section
    $(".expand").click(function(){
        $(".sub_section").removeClass("visible fadeInLeft");
        var sub_section_name = $(this).data("subsection");
        $(sub_section_name).addClass("visible fadeInLeft");
    });


    //handle the slide show
    var active_index = {
        "exploration_content":1,
        "part_a_content":1,
        "part_b_content":1,
        "part_c_content":1,
        "journal_content":1
    };
    
    //handle prev slide button
    $(".prev_slide").click(function(){
        var slide_length = $(this).parent().find("ul.slide_index>li").length;
        var content_id = $(this).parent().parent().attr("id");
        var index = active_index[content_id];
        if (index>1) {
            index-=1;
            active_index[content_id] = index;
        } else {
            index = slide_length;
            active_index[content_id] = index;
        }
        $(this).parent().find(".slide").removeClass("active");
        $(this).parent().find("ul>li").removeClass("active");
        var selector = ".slide:nth-of-type("+index+")";
        $(this).parent().find(selector).addClass("active");
        selector = "ul>li:nth-of-type(" + index + ")";
        $(this).parent().find(selector).addClass("active");
    });

    //handel next slide button
    $(".next_slide").click(function(){
        var slide_length = $(this).parent().find("ul.slide_index>li").length;
        var content_id = $(this).parent().parent().attr("id");
        var index = active_index[content_id];
        if (index<slide_length) {
            index+=1;
            active_index[content_id] = index;
        } else {
            index = 1;
            active_index[content_id] = index;
        }
        $(this).parent().find(".slide").removeClass("active");
        $(this).parent().find("ul>li").removeClass("active");
        var selector = ".slide:nth-of-type("+index+")";
        $(this).parent().find(selector).addClass("active");
        selector = "ul>li:nth-of-type(" + index + ")";
        $(this).parent().find(selector).addClass("active");
    });

    //handle slide show index
    $(".slide_box ul a").click(function(event){
        event.preventDefault();
        var content_id = $(this).parent().parent().parent().parent().attr("id");
        var current_item = $(this).parent();
        var index = $(this).parent().parent().find("li").index(current_item) + 1;
        active_index[content_id] = index;
        $(this).parent().parent().parent().find(".slide").removeClass("active");
        $(this).parent().parent().find("li").removeClass("active");
        $(this).parent().addClass("active");
        var selector = ".slide:nth-of-type("+index+")";
        $(this).parent().parent().parent().find(selector).addClass("active");
    });

    //handle content tile list click
    $(".breakdown a").click(function(event){
        event.preventDefault();
        $(".sub_section").removeClass("visible fadeInLeft");
        var content_id = $(this).parent().parent().parent().parent().find(".thumbnail").data("subsection");
        $(content_id).addClass("visible fadeInLeft")
        
        var current_item = $(this).parent();
        var index = $(this).parent().parent().find("li").index(current_item) + 1;

        $(content_id).find(".slide_box>ul>li").removeClass("active");
        $(content_id).find(".slide_box>.slide").removeClass("active");
        var selector = ".slide_box>.slide:nth-of-type("+index+")";
        $(content_id).find(selector).addClass("active");
        selector = ".slide_box>ul>li:nth-of-type(" + index + ")";
        $(content_id).find(selector).addClass("active");

        content_id = content_id.slice(1);
        active_index[content_id] = index;
    });

    //handle visual effect for reflection slide
    $(".reflection ul li").hover(function(){
        var current_index = $(this).parent().find("li").index($(this));
        current_index += 1;
        var selector = "li:nth-of-type(" + current_index +")";
        $(this).parent().parent().find(".active").removeClass("active");
        $(this).parent().parent().find(selector).each(function(){
            $(this).addClass("active");
        });
    });

    $(".gear").each(function(){
        var images = $(this);
        $(window).scroll(function(){
            var degree = ($win.scrollTop()/5)%360;
            degree = 'rotate(' + degree + 'deg)';
            images.css({transform: degree});
        });
    });
});