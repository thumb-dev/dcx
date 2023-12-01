four51.app.controller('CheckOutViewCtrl', ['$scope', '$routeParams', '$location', '$filter', '$rootScope', '$451', 'User', 'Order', 'OrderConfig', 'FavoriteOrder', 'AddressList', 'GoogleAnalytics',
  function($scope, $routeParams, $location, $filter, $rootScope, $451, User, Order, OrderConfig, FavoriteOrder, AddressList, GoogleAnalytics) {
    $scope.errorSection = '';


    var adtDealer = false;
    for (var i = $scope.currentOrder.LineItems.length - 1; i >= 0; i--) {
      if ($scope.currentOrder.LineItems[i].Product.StaticSpecGroups != null && $scope.currentOrder.LineItems[i].Product.StaticSpecGroups.adtDealer != null) {
        var staticSpecDealer = $scope.currentOrder.LineItems[i].Product.StaticSpecGroups.adtDealer.Specs.Item.Value;
        console.log(staticSpecDealer);
      };
      if (staticSpecDealer === "true") {
        adtDealer = true;
        break;
      } else {
        adtDealer = false;
        break;
      };
    };
    $scope.adtDealer = adtDealer;
    
    var adtBuilderKit = false;
    for (var i = $scope.currentOrder.LineItems.length - 1; i >= 0; i--) {
      if ($scope.currentOrder.LineItems[i].Product.StaticSpecGroups != null && $scope.currentOrder.LineItems[i].Product.StaticSpecGroups.adtBuilderKit != null) {
        var staticSpecBK = $scope.currentOrder.LineItems[i].Product.StaticSpecGroups.adtBuilderKit.Specs.Item.Value;
        console.log(staticSpecBK);
      };
      if (staticSpecBK === "true") {
        adtBuilderKit = true;
        break;
      } else {
        adtBuilderKit = false;
        break;
      };
    };
    $scope.adtBuilderKit = adtBuilderKit;
    

    if ($scope.adtDealer != true || $scope.adtBuilderKit != true) {
      $scope.$watch('currentOrder.Total', function(total) {
        if ($scope.currentOrder && $scope.currentOrder.BudgetAccountID)
          budgetAccountCalculation($scope.currentOrder.BudgetAccountID);
        if ($scope.currentOrder.Coupon === null &&  $scope.adtBuilderKit != true) {
          console.log('setting to CC');
          $scope.currentOrder.PaymentMethod = 'CreditCard';
        }
      });
      $scope.$watch('currentOrder.Coupon', function(total) {
        if ($scope.currentOrder.Coupon != null || $scope.adtBuilderKit === true) {
          $scope.currentOrder.PaymentMethod = 'PurchaseOrder';
        } else {
          $scope.currentOrder.PaymentMethod = 'CreditCard';
        }
      });
    }
    
    if ($scope.adtBuilderKit === true ) {
        $scope.currentOrder.PaymentMethod = 'PurchaseOrder';
        console.log('inside adtBuilderKit', $scope.currentOrder.PaymentMethod);
    }

    var multiFamily = false;
    for (var i = $scope.currentOrder.LineItems.length - 1; i >= 0; i--) {
      if ($scope.currentOrder.LineItems[i].Product.StaticSpecGroups != null && $scope.currentOrder.LineItems[i].Product.StaticSpecGroups.multiFamily != null) {
        var staticSpecMulti = $scope.currentOrder.LineItems[i].Product.StaticSpecGroups.multiFamily.Specs.Item.Value;
        console.log(staticSpecMulti);
      };
      if (staticSpecMulti === "true") {
        multiFamily = true;
        break;
      } else {
        multiFamily = false;
        break;
      };
    };
    $scope.multiFamily = multiFamily;

    $scope.isEditforApproval = $routeParams.id != null && $scope.user.Permissions.contains('EditApprovalOrder');
    if ($scope.isEditforApproval) {
      Order.get($routeParams.id, function(order) {
        $scope.currentOrder = order;
      });
    }

    if (!$scope.currentOrder) {
      $location.path('catalog');
    }


    var cartCC = false;
    for (var i = $scope.currentOrder.LineItems.length - 1; i >= 0; i--) {
      if ($scope.currentOrder.LineItems[i].Product.StaticSpecGroups != null && $scope.currentOrder.LineItems[i].Product.StaticSpecGroups.isapparel != null) {
        var staticSpe = $scope.currentOrder.LineItems[i].Product.StaticSpecGroups.isapparel.Specs.Item.Value;
        console.log(staticSpe);
      };
      if (staticSpe === "true") {
        cartCC = true;
        break;
      } else {
        cartCC = false;
        break;
      };
    };
    $scope.cartCC = cartCC;
    
    var adtBuilderKit = false;
    for (var i = $scope.currentOrder.LineItems.length - 1; i >= 0; i--) {
      if ($scope.currentOrder.LineItems[i].Product.StaticSpecGroups != null && $scope.currentOrder.LineItems[i].Product.StaticSpecGroups.adtBuilderKit != null) {
        var staticSpecBK = $scope.currentOrder.LineItems[i].Product.StaticSpecGroups.adtBuilderKit.Specs.Item.Value;
        console.log(staticSpecBK);
      };
      if (staticSpecBK === "true") {
        adtBuilderKit = true;
        break;
      } else {
        adtBuilderKit = false;
        break;
      };
    };
    $scope.adtBuilderKit = adtBuilderKit;


    for (var i = $scope.currentOrder.LineItems.length - 1; i >= 0; i--) {
      var itemID = $scope.currentOrder.LineItems[i].Product.InteropID;
      if ($scope.currentOrder.LineItems[i].Product.StaticSpecGroups != null && $scope.currentOrder.LineItems[i].Product.StaticSpecGroups.upsGround != null) {
        var staticSpecFedex= $scope.currentOrder.LineItems[i].Product.StaticSpecGroups.upsGround.Specs.Item.Value;
      };
      if (staticSpecFedex === "true") {
        upsGround = true;
        break;
      } else {
        upsGround = false;
        break;
      };
    };
    $scope.upsGround = upsGround;
    console.log('upsGround', upsGround, $scope.currentOrder.LineItems[0].ShipAccount)

    var shipAccount = '512819060';
    var shipperName = 'FedEx';
    if (upsGround) {
      shipAccount = 'E75753';
      shipperName = 'UPS';
    }
    
    $scope.currentOrder.LineItems[0].ShipAccount = shipAccount;

    $scope.currentOrder.OrderFields.forEach(function(item) {
      if (item.Name == 'requestedShipCo') {
        item.Value = shipperName;
      }
    });


    $scope.hasOrderConfig = OrderConfig.hasConfig($scope.currentOrder, $scope.user);
    $scope.checkOutSection = $scope.hasOrderConfig ? 'order' : 'shipping';

    $scope.atkinsOrderFields = {};
    angular.forEach($scope.currentOrder.OrderFields, function(field) {
      $scope.atkinsOrderFields[field.Name] = field;
    });

    function submitOrder() {
      $scope.displayLoadingIndicator = true;
      $scope.submitClicked = true;
      $scope.errorMessage = null;
      Order.submit($scope.currentOrder,
        function(data) {
          if ($scope.user.Company.GoogleAnalyticsCode) {
            GoogleAnalytics.ecommerce(data, $scope.user);
          }
          $scope.user.CurrentOrderID = null;
          User.save($scope.user, function(data) {
            $scope.user = data;
            $scope.displayLoadingIndicator = false;
          });
          $scope.currentOrder = null;
          $location.path('/order/new/' + data.ID);
        },
        function(ex) {
          $scope.submitClicked = false;
          $scope.errorMessage = ex.Message;
          $scope.displayLoadingIndicator = false;
          $scope.shippingUpdatingIndicator = false;
          $scope.shippingFetchIndicator = false;
        }
      );
    };

    $scope.$watch('currentOrder.CostCenter', function() {
      OrderConfig.address($scope.currentOrder, $scope.user);
    });

    $scope.FHCentralOrderFields = {};
    angular.forEach($scope.currentOrder.OrderFields, function(field) {
      $scope.FHCentralOrderFields[field.Name] = field;
    });


    $scope.$watch('currentOrder.LineItems', function(item) {
      if (!item) return;
      if ($scope.user.ShipMethod && $scope.user.ShipMethod.DefaultShipperAccountNumber) {
        angular.forEach($scope.currentOrder.LineItems, function(li) {
          li.ShipAccount = $scope.user.ShipMethod.DefaultShipperAccountNumber;
        });
      }
    });

    $scope.$watch('currentOrder.LineItems[0].ShipAccount', function(val) {
      if (!val) return;
      if (!$scope.currentOrder.IsMultipleShip()) {
        angular.forEach($scope.currentOrder.LineItems, function(li) {
          li.ShipAccount = val;
        });
      }
    });

    function saveChanges(callback) {
      $scope.displayLoadingIndicator = true;
      $scope.errorMessage = null;
      $scope.actionMessage = null;
      var auto = $scope.currentOrder.autoID;
      Order.save($scope.currentOrder,
        function(data) {
          $scope.currentOrder = data;
          if (auto) {
            $scope.currentOrder.autoID = true;
            $scope.currentOrder.ExternalID = 'auto';
          }
          $scope.displayLoadingIndicator = false;
          if (callback) callback($scope.currentOrder);
          $scope.actionMessage = "Your changes have been saved";
        },
        function(ex) {
          $scope.currentOrder.ExternalID = null;
          $scope.errorMessage = ex.Message;
          $scope.displayLoadingIndicator = false;
          $scope.shippingUpdatingIndicator = false;
          $scope.shippingFetchIndicator = false;
        }
      );
    };

    $scope.continueShopping = function() {
      if (confirm('Do you want to save changes to your order before continuing?') == true)
        saveChanges(function() {
          $location.path('catalog')
        });
      else
        $location.path('catalog');
    };

    $scope.cancelOrder = function() {
      if (confirm('Are you sure you wish to cancel your order?') == true) {
        $scope.displayLoadingIndicator = true;
        Order.delete($scope.currentOrder,
          function() {
            $scope.user.CurrentOrderID = null;
            $scope.currentOrder = null;
            User.save($scope.user, function(data) {
              $scope.user = data;
              $scope.displayLoadingIndicator = false;
              $location.path('catalog');
            });
          },
          function(ex) {
            $scope.actionMessage = ex.Message;
            $scope.displayLoadingIndicator = false;
          }
        );
      }
    };

    $scope.saveChanges = function() {
      saveChanges();
    };

    $scope.submitOrder = function() {
      submitOrder();
    };

    $scope.saveFavorite = function() {
      FavoriteOrder.save($scope.currentOrder);
    };

    $scope.cancelEdit = function() {
      $location.path('order');
    };
  }
]);
