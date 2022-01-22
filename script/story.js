function get_date_string() {
    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();

    var output = d.getFullYear() + '-' +
    (month<10 ? '0' : '') + month + '-' +
    (day<10 ? '0' : '') + day;
    return output
}

function update_date_counter() {
    var start_date = Date.parse("2016-10-17");
    var end_string = $("#calendar").text();
    var end_date = Date.parse(end_string);
    var diff = Math.floor((end_date-start_date)/(24*3600*1000));
    if (diff < 0) {
        $("#date_comp").text("before");
        $("#date_counter").text(-diff);
    } else {
        $("#date_comp").text("since");
        $("#date_counter").text(diff);
    }
}

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
            // Handle fade out vision effect
            var temp = (current.position().top - scroll_top) / header_bottom
            if (temp < 1) {
                current.css("opacity", temp);
            } else {
                current.css("opacity", 1);
            }

            // Update calendar
            var date_caption = current.find(".time_stamp").first().text();
            temp = (current.position().top - scroll_top) / ($(window).height() / 2);
            if (temp < 1) {
                $("#calendar").text(date_caption);
                // console.log(date_caption)
            }
        });
        update_date_counter();
    });

    update_date_counter();

    $(".content_block").last().find(".time_stamp").first().text(get_date_string())
});