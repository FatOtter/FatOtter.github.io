$(document).ready(function(){
    var header_bottom = $("#header").height()

    $(window).scroll(function() {
        //control background parallax effect
        var scroll_speed = 3;
        var scroll_top = $(window).scrollTop()
        var bgScroll = -(scroll_top/ scroll_speed);
        var bgPosition = 'center '+ bgScroll + 'px';
        var css_to_load = {"background-position": bgPosition}
        $('.background_block').css(css_to_load);

        //control each content block
        $(".content_block").each(function(){
            var current = $(this)
            var to_load = (current.position().top - scroll_top) / header_bottom
            if (to_load < 1) {
                current.css("opacity", to_load);
                // console.log(current.css("opacity"));
            }
        })
    });

});