(function($) {
    "use strict"; // Start of use strict

    var products = {
        'Almonds': {
            image: 'almonds.jpg',
            description: 'Roasted, unsalted, classic.',
            price: 5.72,
        },
        'Cashews': {
            image: 'cashews.jpg',
            description: 'Roasted, unsalted, halves and pieces.',
            price: 8.20,
        },
        'Walnuts': {
            image: 'walnuts.jpg',
            description: 'Roasted halves and pieces',
            price: 10.99,
        },
        'Raisins': {
            image: 'raisins.jpg',
            description: 'Certified Organic, Thompsons, oil free.',
            price: 2.30,
        },
        'Figs': {
            image: 'figs.jpg',
            description: 'Certified Organic, Turkish.',
            price: 6.60,
        },
        'Apricots': {
            image: 'apricots.jpg',
            description: 'Certified Organic, Turkish, Pitted, Unsulfured.',
            price: 7.06,
        }
    };

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $(document).on('click', 'a.page-scroll', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 100
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 50
        }
    })

    var productNames = Object.keys(products);
    var html = '';
    for (var index in productNames) {
        var productName = productNames[index];
        var product = products[productName];
        if (index % 3 === 0) html += '<div class="row">';
        html += '<div class="col-md-4"><div class="feature-item"><img src="/img/products/' + product.image + '" style="width: 100%" /><h3>' + productName + '</h3><p class="text-muted">' + product.description + '</p>' + 
        '<p>$' + calculatePrice(product.price) + '/lb</p><input id="spinner" name="' + productName + '" value=0 /></div></div>';
        if (index % 3 === 2) html += '</div>';
    }

    $('#products').html(html);
    $('#spinner').spinner({
        step: 1,
        min: 0,
        max: 100,
    });
})(jQuery); // End of use strict

function calculatePrice(cost) {
    return (cost * 1.022 + 1.00).toFixed(2);
}
