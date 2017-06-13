(function($) {
  "use strict"; // Start of use strict

  var productCost = 0;
  var products = {
    'Almonds': {
      image: 'almonds.jpg',
      description: 'Unsalted classics. Roasted in Victora, BC.',
      price: 5.73,
      amount: 0,
    },
    'Cashews': {
      image: 'cashews.jpg',
      description: 'Unsalted halves and pieces. Roasted in Victoria, BC.',
      price: 8.27,
      amount: 0,
    },
    'Walnuts': {
      image: 'walnuts.jpg',
      description: 'Unsalted halves and pieces. Roasted in Victoria, BC.',
      price: 6.11,
      amount: 0,
    },
    'Raisins': {
      image: 'raisins.jpg',
      description: 'Certified Organic, Thompsons, oil free.',
      price: 2.86,
      amount: 0,
    },
    'Figs': {
      image: 'figs.jpg',
      description: 'Certified Organic, Turkish.',
      price: 7.27,
      amount: 0,
    },
    'Apricots': {
      image: 'apricots.jpg',
      description: 'Certified Organic, Turkish, Pitted, Unsulfured.',
      price: 7.66,
      amount: 0,
    }
  };

  var dne = 10000;
  var prices = {
    'Competitors': [ 'Independent', 'Save On Foods', 'Nesters', 'Walmart' ],
    'Almonds': [ 13.06, 13.59, 15.86, 19.19 ],
    'Cashews': [ 11.35, 13.59, 17.50, 11.57 ],
    'Walnuts': [ 15.90, 10.41, 15.95, 9.09 ],
    'Raisins': [ 4.60, 9.05, 6.32, dne ],
    'Figs': [ dne, dne, 14.53, dne ],
    'Apricots': [ 12.86, 10.41, dne, 8.29 ],
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
    html += 
    '<div class="col-md-4">' + 
      '<div class="feature-item">' + 
        '<img src="/img/products/' + product.image + '" style="width: 100%" />' + 
        '<h3>' + productName + '</h3>' + 
        '<p class="text-muted">' + product.description + '</p>' + 
        '<p>$' + calculatePrice(product.price).toFixed(2) + '/lb</p>' + 
        '<a class="btn btn-default product-minus" data-product="' + productName + '"><i class="fa fa-minus"></i></a>' +
        '<span class="amount" data-product="' + productName + '">0</span>' +
        '<a class="btn btn-default product-plus" data-product="' + productName + '"><i class="fa fa-plus"></i></a>' + 
    '</div></div>';
    if (index % 3 === 2 || index === productNames.length - 1) html += '</div><a class="btn btn-success buynow" />';
  }
  $('#products').html(html);
  $('#spinner').spinner({
    step: 1,
    min: 0,
    max: 100,
  });

  html = '<tr><th></th><th class=me>Squamish Trail Mix</th><th>' + prices.Competitors.join('</th><th>') + '</th></tr>';
  for (var index in productNames) {
    var productName = productNames[index];
    var product = products[productName];
    var myPrice = calculatePrice(product.price);
    var price = [ myPrice ]
    Array.prototype.push.apply(price, prices[productName])
    var bestCompetitor = Math.min.apply(null, prices[productName]);
    var best = Math.min.apply(null, price);
    price = price.map(function(x) {
      if (x === dne) return '<td>-</td>';

      return '<td' + 
        (x === best ? ' class="best">' : '>') +
        '$' + x.toFixed(2) + 
        (x === best && best === myPrice ? ' (' + ((bestCompetitor - best) / bestCompetitor * 100).toFixed(0) + '% less' + ('') + ')' : '')
        '</td>';
    });

    html += '<tr><td>' + productName + '</td>' + price.join('') + '</tr>';
  }
  $('#priceTable').html(html);

  $('.product-plus').click(function() {
    var productName = $(this).attr('data-product');
    addProductToCost(productName, 1);
  });
  $('.product-minus').click(function() {
    var productName = $(this).attr('data-product');
    addProductToCost(productName, -1);
  });
  
  var handler = StripeCheckout.configure({
    key: 'pk_test_DZkclA7Lk0U2szChf0u7RV8U',
    locale: 'auto',
    name: 'Squamish Trail Mix',
    description: 'Trail Mix',
    // image: '/square-image.png',
    token: function(token) {
      $('input#stripeToken').val(token.id);
      $('form').submit();
    }
  });

  var buyNowButtons = document.getElementsByClassName("buynow");
  for (var i = 0; i < buyNowButtons.length; i++) {
    buyNowButtons[i].addEventListener("click", function() {
      if (productCost > 0) {
        handler.open({
          amount: (productCost * 100 * 1.05).toFixed(0),
        });
      }
    });
  }

  function addProductToCost(productName, delta) {
    var product = products[productName];
    if (product.amount + delta >= 0) {
      productCost += calculatePrice(product.price) * delta;
      product.amount += delta;
      $('.amount[data-product="' + productName + '"]').text(product.amount + ' lb');
      $('.buynow').html('<i class="fa fa-shopping-cart"></i>Buy now for $' + productCost.toFixed(2) + ' + GST');
    }

    if (productCost > 0 && productCost.toFixed(2) !== "0.00") { $('.buynow').show("fast"); }
    else { $('.buynow').hide("fast"); }
  }
  $('.buynow').hide();
})(jQuery); // End of use strict

function calculatePrice(cost) {
  return (cost * 1.022 + 1.00);
}
