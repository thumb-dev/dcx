four51.app.filter('onproperty', ['$451', function($451) {
  var defaults = {
    'OrderStats': 'Type',
    'Message': 'Box'
  };

  return function(input, query) {
    if (!input || input.length === 0) return;
    if (!query) return input;
    query.Property = query.Property || defaults[query.Model];
    return $451.filter(input, query);
  }
}]);

four51.app.filter('kb', function() {
  return function(value) {
    return isNaN(value) ? value : parseFloat(value) / 1024;
  }
});

four51.app.filter('r', ['$sce', 'WhiteLabel', function($sce, WhiteLabel) {
  return function(value) {
    var result = value,
      found = false;
    angular.forEach(WhiteLabel.replacements, function(c) {
      if (found) return;
      if (c.key == value) {
        result = $sce.trustAsHtml(c.value);
        found = true;
      }
    });
    return result;
  }
}]);

four51.app.filter('rc', ['$sce', 'WhiteLabel', function($sce, WhiteLabel) {
  return function(value) {
    var result = value,
      found = false;
    angular.forEach(WhiteLabel.replacements, function(c) {
      if (found) return;
      if (c.key.toLowerCase() == value.toLowerCase()) {
        result = $sce.trustAsHtml(c.value);
        found = true;
      }
    });
    return result;
  }
}]);

four51.app.filter('rl', ['$sce', 'WhiteLabel', function($sce, WhiteLabel) {
  return function(value) {
    var result = value,
      found = false;
    angular.forEach(WhiteLabel.replacements, function(c) {
      if (found) return;
      if (c.key.toLowerCase() == value.toLowerCase()) {
        result = $sce.trustAsHtml(c.value.toLowerCase());
        found = true;
      }
    });
    return result;
  }
}]);

four51.app.filter('noliverates', function() {
  return function(value) {
    var output = [];
    angular.forEach(value, function(v) {
      if (v.ShipperRateType != 'ActualRates')
        output.push(v);
    });
    return output;
  }
});

four51.app.filter('paginate', function() {
  return function(input, start) {
    if (typeof input != 'object' || !input) return;
    start = +start; //parse to int
    return input.slice(start);
  }
});


// The issue is the use of the Large Address Search customization. You only have a limited number of addresses in the shipaddresses array. You will have to have your filter make a direct call to get the address using the currentOrder.ShipAddressID.

four51.app.filter('shipperFilter', ['Address', function(Address) {
  return function(shippers, addresses, currentid, order) {
    var results = [];
    var upsGround = [];
    var multiFamily = [];
    var adtBuilderKit = [];
    var shipWeight = 0;
    var addressFound = false;
    
    if (order && order.LineItems) {
      angular.forEach(order.LineItems, function(item) {
        var itemWeight = item.Quantity * item.Product.ShipWeight;
        shipWeight += itemWeight;
      });
    }
    // console.log('calculated shipWeight', shipWeight);
    if (order && order.LineItems) {
      angular.forEach(order.LineItems, function(item) {
        if (item.Product.StaticSpecGroups && item.Product.StaticSpecGroups.upsGround && item.Product.StaticSpecGroups.upsGround.Specs['Item'].Value === 'true') {
          upsGround = true;
        } else {
          upsGround = false;
        }
      });
    }
     // console.log('upsGround', upsGround)
    if (order && order.LineItems) {
      angular.forEach(order.LineItems, function(item) {
        if (item.Product.StaticSpecGroups && item.Product.StaticSpecGroups.multiFamily && item.Product.StaticSpecGroups.multiFamily.Specs['Item'].Value === 'true') {
          multiFamily = true;
        } else {
          multiFamily = false;
        }
      });
    }
    if (order && order.LineItems) {
      angular.forEach(order.LineItems, function(item) {
        if (item.Product.StaticSpecGroups && item.Product.StaticSpecGroups.adtBuilderKit && item.Product.StaticSpecGroups.adtBuilderKit.Specs['Item'].Value === 'true') {
          adtBuilderKit = true;
        } else {
          adtBuilderKit = false;
        }
      });
    }
  
    // What if there is no custom address?
    Address.get(order.ShipAddressID, function(address) {
      // console.log('got address for ship address id', order.ShipAddressID, address);
      if (!addresses) {
        addresses = [];
      }

    angular.forEach(shippers, function(s) {
      // console.log(`checking shipper: "${addressFound}" "${shipWeight}" "${s.Name}" "${upsGround}"`);
      //console.log('shippers', s.Name)
      if (s.Name.startsWith('UPS Ground')) {
        if (shipWeight < 150) {
          results.push(s);
        }
      } else if (s.Name.startsWith('FedEx Ground')) {
        if (shipWeight < 150 && (multiFamily === true || adtBuilderKit === true)) {
          results.push(s);
        }
      } else if (s.Name.startsWith('FedEx')) {
        if (shipWeight < 150 && upsGround != true && multiFamily != true && adtBuilderKit != true) {
          results.push(s);
        }
      } else if (s.Name == 'Bulk Shipping (over 150 lbs)') {
          if (shipWeight >= 150) {
            // console.log('states, over weight');
            results.push(s);
          }
      }
    });    
  });
    // console.log('results', results);
    return results;
  }
}]);
