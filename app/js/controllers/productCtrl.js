four51.app.controller('ProductCtrl', ['$scope', '$routeParams', '$route', '$location', '$451', 'Nav', 'Product', 'ProductDisplayService', 'Order', 'Variant', 'User',
  function($scope, $routeParams, $route, $location, $451, Nav, Product, ProductDisplayService, Order, Variant, User) {
    $scope.isEditforApproval = $routeParams.orderID && $scope.user.Permissions.contains('EditApprovalOrder');
    if ($scope.isEditforApproval) {
      Order.get($routeParams.orderID, function(order) {
        $scope.currentOrder = order;
      });
    }

    // panel-nav
    $scope.navStatus = Nav.status;
    //default the category panel to be collapsed
    $scope.navStatus.visible = false;

    $scope.toggleNav = Nav.toggle;

    $scope.searchTerm = $routeParams.searchTerm;
    console.log('string routeParams ', $routeParams);
    // $scope.search = Search;

    // ----

    /* Custom Logic Preventing a Mixed Cart */
    $scope.CartContainsCustomShipperProduct = false;
    $scope.productapp = false;
    $scope.cartapparel = false;
    $scope.ProductHasCustomShipper = false;

    if ($scope.currentOrder !== null) {
      angular.forEach($scope.currentOrder.LineItems, function(item) {
        if (item.Product.StaticSpecGroups && item.Product.StaticSpecGroups.isapparel !== undefined) {
          if (item.Product.StaticSpecGroups.isapparel.Specs['Item'].Value === 'true') {
            $scope.cartapparel = true;
            $scope.CartContainsCustomShipperProduct = true;
          }
        }
      });
    }
    $scope.$watch('LineItem.Product', function(newVal) {
      if (!newVal) return;
      if ($scope.LineItem.Product.StaticSpecGroups && $scope.LineItem.Product.StaticSpecGroups.isapparel !== undefined) {
        if ($scope.LineItem.Product.StaticSpecGroups.isapparel.Specs['Item'].Value === 'true') {
          $scope.productapp = true;
          $scope.ProductHasCustomShipper = true;
        }
      }
      $scope.allowProductToBeAdded = (($scope.cartapparel || !$scope.currentOrder) && $scope.productapp) ||
        (!$scope.cartapparel && !$scope.productapp);
    });

    // hide price spec

    $scope.CartContainsCustomShipperProductPrice = false;
    $scope.productappPrice = false;
    $scope.cartapparelPrice = false;
    $scope.ProductHasCustomShipperPrice = false;

    if ($scope.currentOrder !== null) {
      angular.forEach($scope.currentOrder.LineItems, function(item) {
        if (item.Product.StaticSpecGroups && item.Product.StaticSpecGroups.HidePrice !== undefined) {
          if (item.Product.StaticSpecGroups.HidePrice.Specs['Item'].Value === 'true') {
            $scope.cartapparelPrice = true;
            $scope.CartContainsCustomShipperProductPrice = true;
          }
        }
      });
    }
    $scope.$watch('LineItem.Product', function(newVal) {
      if (!newVal) return;
      if ($scope.LineItem.Product.StaticSpecGroups && $scope.LineItem.Product.StaticSpecGroups.HidePrice !== undefined) {
        if ($scope.LineItem.Product.StaticSpecGroups.HidePrice.Specs['Item'].Value === 'true') {
          $scope.productappPrice = true;
          $scope.ProductHasCustomShipperPrice = true;
        }
      }
      $scope.allowProductToBeAddedPrice = (($scope.cartapparelPrice || !$scope.currentOrder) && $scope.productappPrice) ||
        (!$scope.cartapparelPrice && !$scope.productappPrice);
    });

    //End Custom Logic

    $scope.selected = 1;
    $scope.LineItem = {};
    $scope.addToOrderText = "Add To Cart";
    $scope.loadingIndicator = true;
    $scope.loadingImage = true;
    $scope.searchTerm = null;
    $scope.settings = {
      currentPage: 1,
      pageSize: 10
    };

    $scope.calcVariantLineItems = function(i) {
      $scope.variantLineItemsOrderTotal = 0;
      angular.forEach($scope.variantLineItems, function(item) {
        $scope.variantLineItemsOrderTotal += item.LineTotal || 0;
      })
    };

    function setDefaultQty(lineitem) {
      if (lineitem.PriceSchedule && lineitem.PriceSchedule.DefaultQuantity != 0)
        $scope.LineItem.Quantity = lineitem.PriceSchedule.DefaultQuantity;
    }

    function init(searchTerm, callback) {
      ProductDisplayService.getProductAndVariant($routeParams.productInteropID, $routeParams.variantInteropID, function(data) {
        if (data.product.Type == 'Kit') {
          $location.path('/kit/' + data.product.InteropID);
        }
        $scope.LineItem.Product = data.product;
        $scope.LineItem.Variant = data.variant;
        ProductDisplayService.setNewLineItemScope($scope);
        ProductDisplayService.setProductViewScope($scope);
        setDefaultQty($scope.LineItem);
        $scope.$broadcast('ProductGetComplete');
        $scope.loadingIndicator = false;
        $scope.setAddToOrderErrors();
        if (angular.isFunction(callback))
          callback();
      }, $scope.settings.currentPage, $scope.settings.pageSize, searchTerm);
    }
    $scope.$watch('settings.currentPage', function(n, o) {
      if (n != o || (n == 1 && o == 1))
        init($scope.searchTerm);
    });

    $scope.searchVariants = function(searchTerm) {
      $scope.searchTerm = searchTerm;
      $scope.settings.currentPage == 1 ?
        init(searchTerm) :
        $scope.settings.currentPage = 1;
    };

    $scope.deleteVariant = function(v, redirect) {
      if (!v.IsMpowerVariant) return;
      // doing this because at times the variant is a large amount of data and not necessary to send all that.
      var d = {
        "ProductInteropID": $scope.LineItem.Product.InteropID,
        "InteropID": v.InteropID
      };
      Variant.delete(d,
        function() {
          redirect ? $location.path('/product/' + $scope.LineItem.Product.InteropID) : $route.reload();
        },
        function(ex) {
          if ($scope.lineItemErrors.indexOf(ex.Message) == -1) $scope.lineItemErrors.unshift(ex.Message);
          $scope.showAddToCartErrors = true;
        }
      );
    }


    $scope.addToOrder = function() {
      if ($scope.currentOrder !== null) {
        if ($scope.productapp === false && $scope.cartapparel === true) {
          alert("Apparel can not be combined Sales & Marketing Items");
          $location.path('/cart');
          return;
        } else if ($scope.productappPrice === false && $scope.cartapparelPrice === true) {
          alert("Kits can not be combined with other items.");
          $location.path('/cart');
          return;
        }

        if ($scope.productapp === true && $scope.cartapparel === false) {
          alert("Apparel can not be combined Sales & Marketing Items");
          $location.path('/cart');
          return;
        } else if ($scope.productappPrice === true && $scope.cartapparelPrice === false) {
          alert("Kits can not be combined with other items");
          $location.path('/cart');
          return;
        }
      }
      if ($scope.lineItemErrors && $scope.lineItemErrors.length) {
        $scope.showAddToCartErrors = true;
        return;
      }
      if (!$scope.currentOrder) {
        $scope.currentOrder = {};
        $scope.currentOrder.LineItems = [];
      }
      if (!$scope.currentOrder.LineItems)
        $scope.currentOrder.LineItems = [];

      // Check if desired product exceeds limits

      var types = {
        'ADT-BC-001': 'card',
        'ADT-BC-002': 'card',
        'ADT-BC-003': 'card',
        'ADT-BC-004': 'card',
        'ADT-BC-005': 'card',
      }
      var counts = {
        card: {
          count: 0,
          limit: 1
        },
      }
      angular.forEach($scope.currentOrder.LineItems, function(item) {
        console.log(item);
        if (types.hasOwnProperty(item.Product.InteropID)) {
          var productType = types[item.Product.InteropID];
          // Have to account for counts -- could be more than 1
          counts[productType].count += item.Quantity;
        }
      });
      if ($scope.busCardUser === true || $scope.chsUser === true) {
        console.log('counts', counts);
        var currentProductType = types[$scope.LineItem.Product.InteropID];
        if ((counts[currentProductType].count + parseInt($scope.LineItem.Quantity)) > counts[currentProductType].limit) {
          console.log('Order limit filled for:', currentProductType);
          alert('You hit your item limit of ' + counts[currentProductType].limit + ' for ' + currentProductType + ' products.');
          return;
        }
      }
      // --------

      if ($scope.allowAddFromVariantList) {
        angular.forEach($scope.variantLineItems, function(item) {
          if (item.Quantity > 0) {
            $scope.currentOrder.LineItems.push(item);
            $scope.currentOrder.Type = item.PriceSchedule.OrderType;
          }
        });
      } else {
        $scope.currentOrder.LineItems.push($scope.LineItem);
        $scope.currentOrder.Type = $scope.LineItem.PriceSchedule.OrderType;
      }
      $scope.addToOrderIndicator = true;
      //$scope.currentOrder.Type = (!$scope.LineItem.Product.IsVariantLevelInventory && $scope.variantLineItems) ? $scope.variantLineItems[$scope.LineItem.Product.Variants[0].InteropID].PriceSchedule.OrderType : $scope.LineItem.PriceSchedule.OrderType;
      // shipper rates are not recalcuated when a line item is added. clearing out the shipper to force new selection, like 1.0
      Order.clearshipping($scope.currentOrder).
      save($scope.currentOrder,
        function(o) {
          $scope.user.CurrentOrderID = o.ID;
          User.save($scope.user, function() {
            $scope.addToOrderIndicator = true;
            // $location.path('/cart' + ($scope.isEditforApproval ? '/' + o.ID : ''));
          });
        },
        function(ex) {
          //remove the last LineItem added to the cart.
          $scope.currentOrder.LineItems.pop();
          $scope.addToOrderIndicator = false;
          $scope.lineItemErrors.push(ex.Detail);
          $scope.showAddToCartErrors = true;
          //$route.reload();
        }
      );
       $scope.open(500);
    };

    $scope.setOrderType = function(type) {
      $scope.loadingIndicator = true;
      $scope.currentOrder = {
        'Type': type
      };
      init(null, function() {
        $scope.loadingIndicator = false;
      });
    };

    $scope.$on('event:imageLoaded', function(event, result) {
      $scope.loadingImage = false;
      $scope.$apply();
    });
  }
]);
