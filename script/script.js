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

    $("body").removeClass("inverted");
    
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

    //Handle language selection

    var language_preference = "English";
    language_preference = localStorage.getItem("rex_portfolio_language_preference");
    if (language_preference == "Chinese") {
        $(".Chinese").removeClass("no_display");
        $(".English").addClass("no_display");
        $(".language_selection button").removeClass("selected front_layer base_layer after_front");
        $(".language_selection button:first-of-type").addClass("base_layer before_front");
        $(".language_selection button:last-of-type").addClass("selected front_layer");
    } ;

    $(".language_selection button").click(function(){
        toggle_front($(this));
        $(this).parent().find("button").removeClass("selected");
        $(this).addClass("selected");
        language_preference = $(this).data("language");
        if (language_preference == "Chinese") {
            $(".English").addClass("no_display");
            $(".Chinese").removeClass("no_display");
        } else if (language_preference == "English"){
            $(".Chinese").addClass("no_display");
            $(".English").removeClass("no_display");
        };
        localStorage.setItem("rex_portfolio_language_preference", language_preference);
    });

    //control visual effect for hovering on logo
    var timeout = null;

    $(".top_navigation").hover(function(){
        timeout = setTimeout(function(){
            $("body").addClass("inverted");
        }, 2000);
    }, function(){
        clearTimeout(timeout);
        $("body").removeClass("inverted");
        $(this).find(">ul").removeClass("select_first select_last");
        $(".logo").removeClass("select_first select_last");
    });


    //handle mouse move effect for top navigation
    $(".top_navigation").mousemove(function(event){
        var coordX = event.pageX;
        var window_width = $win.width();
        if (window_width <= 768){
            return;
        }
        if (coordX < window_width/3) {
            $(".logo").removeClass("select_last");
            $(".logo").addClass("select_first");
            $(this).find(">ul").removeClass("select_last");
            $(this).find(">ul").addClass("select_first");
        } else if (coordX > 2*window_width/3) {
            $(".logo").removeClass("select_first");
            $(".logo").addClass("select_last");
            $(this).find(">ul").removeClass("select_first");
            $(this).find(">ul").addClass("select_last");
        } else {
            $(".logo").removeClass("select_first select_last");
            $(this).find(">ul").removeClass("select_first select_last");
        };
        
    });
});