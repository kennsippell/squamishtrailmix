(function($, config) {
  "use strict"; // Start of use strict

  var products = config.products;
  var prices = config.prices;
  var dne = config.dne;

  var productCost = 0;
  var productPounds = 0;

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
    '<div class="col-sm-4">' + 
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

    $('form#stripeForm').append('<input name="' + productName + '" id="' + productName + '" type="hidden" value="0" />');

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
    key: config.keyPublishable,
    locale: 'auto',
    currency: 'CAD',
    name: 'Squamish Trail Mix',
    description: 'Trail Mix',
    // image: '/square-image.png',
    token: function(token) {
      $('input#stripeEmail').val(token.email);
      $('input#stripeToken').val(token.id);

      $.ajax({
        type: 'POST',
        url: '/charge',
        dataType: 'json',
        data: $('form#stripeForm').serialize(),
        success: function(data) {
          $("#onOrderSuccess").modal('show');
        },
        error: function() {
          $("#onOrderFail").modal('show');
        },
      })
    }
  });

  var buyNowButtons = document.getElementsByClassName("buynow");
  for (var i = 0; i < buyNowButtons.length; i++) {
    buyNowButtons[i].addEventListener("click", function() {
      if (productCost > 0) {
        handler.open({
          amount: (productCost * 100 * config.gst).toFixed(0),
          currency: 'cad',
        });
      }
    });
  }

  function addProductToCost(productName, delta) {
    var product = products[productName];
    if (product.amount + delta >= 0) {
      productCost += calculatePrice(product.price) * delta;
      productPounds += delta;
      product.amount += delta;
      $('input#' + productName).val(product.amount);
      $('.amount[data-product="' + productName + '"]').text(product.amount + ' lb');
      $('.buynow').html('<i class="fa fa-shopping-cart"></i>Buy ' + productPounds + ' lb for $' + productCost.toFixed(2) + ' + GST');
    }

    if (productCost > 0 && productCost.toFixed(2) !== "0.00") { $('.buynow').show("fast"); }
    else { $('.buynow').hide("fast"); }
  }
  $('.buynow').hide();

  function calculatePrice(cost) {
    return (cost * config.priceMultiplier + config.priceAddition);
  }
})(jQuery, window.configuration); // End of use strict

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-100903847-1', 'auto');
ga('send', 'pageview');