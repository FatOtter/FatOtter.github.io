function toggle_front(element){
    var element_type = element.prop('tagName');
    var current_element = element;
    var current_index = element.parent().find(element_type).index(current_element);
    element.parent().find(element_type).each(function(){
        $(this).removeClass("front_layer base_layer before_front after_front");
        if ($(this).parent().find(element_type).index($(this))<current_index){
            $(this).addClass("base_layer before_front");
        } else if ($(this).parent().find(element_type).index($(this))==current_index) {
            $(this).addClass("front_layer");
        } else {
            $(this).addClass("base_layer after_front");
        }
    });
}

$(document).ready(function(){
    
    // Add scroll class animation
    $(".animated").scrollClass();

    var $win = $(window);

    //control background parallax effect
    $('.background_block').each(function(){
        var scroll_speed = 3;
        var $this = $(this);
        $(window).scroll(function() {
            var bgScroll = -(($win.scrollTop() - $this.offset().top)/ scroll_speed);
            var bgPosition = 'center '+ bgScroll + 'px';
            $this.css({ backgroundPosition: bgPosition });
        });
    });

    $(".language_selection button").click(function(){
        toggle_front($(this));
        $(this).parent().find("button").removeClass("selected");
        $(this).addClass("selected");
    });

    $(".logo").hover(function(){
        var timeout = setTimeout(function(){
            $("body").addClass("inverted");
        }, 2000);
    }, function(){
        clearTimeout(timeout);
        console.log("hover off");
        $("body").removeClass("inverted");
    });

});