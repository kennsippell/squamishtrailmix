(function($, config, keyPublishable) {
  "use strict";
  var products = config.products;
  var prices = config.prices;
  var dne = config.dne;

  var productCost = 0;
  var productPounds = 0;
  var productDeliveryFee = 0;

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
  });

  var productNames = Object.keys(products);
  generateProductGrid(productNames, function(x) { return x.isMix === true; }, '#mixes', 2);
  generateProductGrid(productNames, function(x) { return x.isMix !== true; }, '#ingredients');

  var html = '<tr><th></th><th class=me>Squamish Trail Mix</th><th>' + prices.Competitors.join('</th><th>') + '</th></tr>';
  for (var index in productNames) {
    var productName = productNames[index];
    var product = products[productName];
    var myPrice = calculatePrice(product.price);
    var price = [ myPrice ]
    Array.prototype.push.apply(price, prices[productName])
    var bestCompetitor = Math.min.apply(null, prices[productName]);
    var best = Math.min.apply(null, price);
    
    price = price.map(function(x, i) {
      var isOrganic = i === 0 && product.isOrganic;
      if (x === dne) return '<td>-</td>';

      return '<td' + 
        (x === best ? ' class="best">' : '>') +
        '$' + x.toFixed(2) + 
        (x === best && best === myPrice ? ' (' + ((bestCompetitor - best) / bestCompetitor * 100).toFixed(0) + '% less' + ')' : '') +
        (isOrganic ? '<sup>1</sup>' : '') +
        (productName === 'Apricots' && i === 0 ? '<sup>2</sup>' : '') +  
        '</td>';
    });

    $('form#stripeForm').append('<input name="' + productName + '" id="' + productName.replace(' ', '') + '" type="hidden" value="0" />');

    if (bestCompetitor !== Infinity) {
      html += '<tr><td>' + productName + '</td>' + price.join('') + '</tr>';
    }
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
    key: keyPublishable,
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

  $(document).on('change', 'input:radio[name="pickupLocation"]', function (event) {
    var isDelivery = $(this).val() === 'delivery';
    $('#deliverTo').attr('disabled', isDelivery ? null : 'disabled');
    productDeliveryFee = (isDelivery ? 500 : 0);
  });

  $('.buynow').click(function() {
    $("#orderDetails").modal('show');
  });
  
  var collectPaymentButton = document.getElementById("collectPayment");
  collectPaymentButton.addEventListener("click", function() {
    if (productCost > 0) {
      handler.open({
        amount: (productCost * 100 * config.gst + productDeliveryFee).toFixed(0),
        currency: 'cad',
      });
    }
  });

  function addProductToCost(productName, delta) {
    var product = products[productName];
    if (product.amount + delta >= 0) {
      productCost += calculatePrice(product.price) * delta;
      productPounds += delta;
      product.amount += delta;
      $('input#' + productName.replace(' ', '')).val(product.amount);
      $('.amount[data-product="' + productName + '"]').text('Buy ' + product.amount + ' lb');
      $('.buynow:not(.icononly)').html('<i class="fa fa-shopping-cart"></i>Buy ' + productPounds + ' lb for $' + productCost.toFixed(2) + ' + GST');
      $('.buynow.icononly').html('<i class="fa fa-shopping-cart"></i>');
    }

    if (productCost > 0 && productCost.toFixed(2) !== "0.00") { $('.buynow').show("fast"); }
    else { $('.buynow').hide("fast"); }
  }
  $('.buynow').hide();

  function calculatePrice(cost) {
    return Math.ceil((cost * config.priceMultiplier + config.priceAddition) * 10) / 10;
  }

  function generateProductGrid(productNames, filter, selector, initialOffset) {
    var html = '';
    var count = 0;
    for (var index in productNames) {
      var productName = productNames[index];
      var product = products[productName];
      if (!filter(product)) continue;

      if (count % 3 === 0) html += '<div class="row">';
      html += 
      '<div class="col-sm-4' + 
        (initialOffset !== undefined && count === 0 ? ' col-sm-offset-' + initialOffset : '') + '">' + 
        '<a class="product-plus" data-product="' + productName + '">' +
        '<div class="feature-item">' + 
          '<img src="/img/products/' + product.image + '" style="width: 100%" />' + 
          '<h3>' + (product.name || productName) + '</h3>' + 
          '<p class="out-of-stock ' + (!product.outOfStock ? 'hidden' : '') + '">Temporarily Out of Stock</p>' +
          '<p class="text-muted">' + product.description + '</p>' + 
          '<p>$' + calculatePrice(product.price).toFixed(2) + '/lb</p>' + 
          '<a class="btn btn-default product-minus" data-product="' + productName + '"><i class="fa fa-minus"></i></a>' +
          '<span class="amount" data-product="' + productName + '">Buy 0 lb</span>' +
          '<a class="btn btn-default product-plus" data-product="' + productName + '"><i class="fa fa-plus"></i></a>' + 
      '</div></a></div>';
      if (count % 3 === 2) html += '</div>';
      count++;
    }
    $(selector).html(html);
  }
})(jQuery, window.productLine, window.keyPublishable); // End of use strict

$(function() {
  $('[data-toggle="tooltip"]').tooltip();
});

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-100903847-1', 'auto');
ga('send', 'pageview');