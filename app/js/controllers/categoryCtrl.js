four51.app.controller('CategoryCtrl', ['$routeParams', '$sce', '$scope', '$451', 'Category', 'Product', 'Nav', '$modal',
function ($routeParams, $sce, $scope, $451, Category, Product, Nav, $modal) {
	$scope.productLoadingIndicator = true;
	$scope.settings = {
		currentPage: 1,
		pageSize: 40
	};
	$scope.trusted = function(d){
		if(d) return $sce.trustAsHtml(d);
	}

	function _search() {
		$scope.searchLoading = true;
		Product.search($routeParams.categoryInteropID, null, null, function (products, count) {
			$scope.products = products;
			$scope.productCount = count;
			$scope.productLoadingIndicator = false;
			$scope.searchLoading = false;
		}, $scope.settings.currentPage, $scope.settings.pageSize);
	}
	
    $scope.animationsEnabled = true;

    $scope.openProductModal = function (li) {
        console.log('in function');
		var type = 'normal order';
        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'productModal.html',
            controller: 'productModalCtrl',
            backdrop: 'static',
            resolve: {
                lineitem: function () {
                    return li;
                },
                user: function () {
                    return $scope.user;
                },
                currentOrder: function () {
                    return $scope.currentOrder;
                },
				display: function() {
					return type
				}
            }
        });
        modalInstance.result.then(function(o){
            $scope.currentOrder = o;
        });
	};

	$scope.$watch('settings.currentPage', function(n, o) {
		if (n != o || (n == 1 && o == 1))
			_search();
	});

	if ($routeParams.categoryInteropID) {
	    $scope.categoryLoadingIndicator = true;
        Category.get($routeParams.categoryInteropID, function(cat) {
            $scope.currentCategory = cat;
	        $scope.categoryLoadingIndicator = false;
        });
    }
	else if($scope.tree){
		$scope.currentCategory ={SubCategories:$scope.tree};
	}


	$scope.$on("treeComplete", function(data){
		if (!$routeParams.categoryInteropID) {
			$scope.currentCategory ={SubCategories:$scope.tree};
		}
	});

    // panel-nav
    $scope.navStatus = Nav.status;
	//default the category panel to be collapsed
	$scope.navStatus.visible = true;

    $scope.toggleNav = Nav.toggle;
	$scope.$watch('sort', function(s) {
		if (!s) return;
		(s.indexOf('Price') > -1) ?
			$scope.sorter = 'StandardPriceSchedule.PriceBreaks[0].Price' :
			$scope.sorter = s.replace(' DESC', "");
		$scope.direction = s.indexOf('DESC') > -1;
	});
}]);
