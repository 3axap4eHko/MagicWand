// Main Navigation
var FluidNav = {
    init: function() {
        $("a[href*=#]").click(function(e) {
            e.preventDefault();
            if($(this).attr("href").split("#")[1]) {
                FluidNav.goTo($(this).attr("href").split("#")[1]);
            }
        });
        this.goTo("home");
    },
    goTo: function(page) {
        var next_page = $("#"+page);
        var nav_item = $('nav ul li a[href=#'+page+']')
        $("nav ul li").removeClass("current");
        nav_item.parent().addClass("current");
        FluidNav.resizePage((next_page.height() + 40), true, function() {
            $(".page").removeClass("current");
            next_page.addClass("current"); 
        });
        $(".page").fadeOut(500);
        next_page.fadeIn(500);
        FluidNav.centerArrow(nav_item);
    },
    centerArrow: function(nav_item, animate) {
        var left_margin = (nav_item.parent().position().left + nav_item.parent().width()) + 24 - (nav_item.parent().width() / 2);
        if(animate != false) {
            $("nav .arrow").animate({
                left: left_margin - 8
            }, 500, function() {
                $(this).show();
            });
        } else {
            $("nav .arrow").css({
                left: left_margin - 8
            });
        }
    },
    resizePage: function(size, animate, callback) {
        if(size) {
            var new_size = size;
        } else {
            var new_size = $(".page.current").height() + 40;
        }
        if(!callback) {
            callback = function(){};        
    }
    if(animate) {
        $("#pages").animate({
            height: new_size
        }, 400, function() {
            callback.call();
        }); 
    } else {
        $("#pages").css({
            height: new_size
        }); 
    }
}
};

// Fix page height and nav on browser resize
$(window).resize(function() { 
    FluidNav.resizePage();
    FluidNav.centerArrow($("nav ul li.current a"), false);
});

$(document).ready(function() {
	
    // Initialize navigation
    FluidNav.init();
	
    // Enable mobile drop down navigation
    $("nav ul").mobileMenu();
	
    // Form hints	
    $("label").inFieldLabels({
        fadeOpacity: 0.4
    });

    $("nav select").change(function() {
        if(this.options[this.selectedIndex].value != "#") {
            var page = this.options[this.selectedIndex].value.split("#")[1];
            FluidNav.goTo(page);
            $("html,body").animate({
                scrollTop:$('#'+page).offset().top
            }, 700);
        }
    });
		
    // Tooltips
    $("a[rel=tipsy]").tipsy({
        fade: true, 
        gravity: 's', 
        offset: 5, 
        html: true
    });
	
    $("ul.social li a").each(function() {
        if($(this).attr("title")) {
            var title_text = $(this).attr("title");
        } else {
            var title_text = $(this).text();
        }
        $(this).tipsy({
            fade: true, 
            gravity: 'n', 
            offset: 5,
            title: function() {
                return title_text;
            }
        });
    });
	
    // Contact form
    $("div#contact_form form").submit(function() {
        var this_form = $(this);
        this_form.find(".input-text").removeClass("error");
        $.ajax({
            type: 'post',
            data: this_form.serialize(),
            url: 'contact.php',
            success: function(res) {
                if (res == '1') {
                    this_form.fadeOut("fast");
                    $(".validation").fadeOut("fast");
                    $(".success").fadeIn("fast");
                    FluidNav.resizePage('', true);
                } else {
                    $(".validation").fadeIn("fast");
                    FluidNav.resizePage('', true);
                    this_form.find(".input-text").removeClass("error");
                    $.each(res.split(","), function() {
                        this_form.find("#"+this).addClass("error");
                    });
                }
            }
        });
    });
	
});