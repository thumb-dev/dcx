angular.module('OrderCloud-HeaderNavigation', []);
angular.module('OrderCloud-HeaderNavigation')
    .directive('headernavigation', headernavigation)
;

function headernavigation() {
    return {
        restrict: 'E',
        template: template,
        controller: 'NavCtrl'
    };

    function template() {
        return [
            '<style>',
            '.alert-banner {text-align: center;background-color: #FF7F30;color: white;font-size: 20px;font-weight: 300;margin-bottom: 0;}',
            '.navUL {display:flex;}',
            '.navItems {padding: .5rem 1rem;margin-top: 33px;text-transform: capitalize;;letter-spacing: -1px;color: #313131;font-weight: 500;}',
            '.nav-link {text-decoration: none !important;font-size: 16px;text-decoration: none !important;font-size: 16px;letter-spacing: .4px;color: #333333;font-family: "Open Sans", sans-serif;line-height: 24px;font-weight: 600;}',
						'nav-link:hover {color:#1775ab;}',
            '.headerRow {display: flex;}',
            '.header-decoration {height: 30px;background-color: #E8E8E8;}',
            '</style>',
            /*'<div>',
              '<div class="alert alert-warning alert-dismissable alert-banner">',
                '<a href="#" class="close" data-dismiss="alert" aria-label="close">×</a>',
                'Checkout our Exclusive Astreea Dispensers and Astreea Safe Sanitizers <a href="catalog/usdp_ast" style="color: white;font-weight: 500;">Here</a>',
              '</div>',h
            '</div>',*/
            
            '<div class="header-decoration">',
            '</div>',
      

            '<section class="header-navigation">',
            '<div class="row headerRow" style="height: 75px;">',

                '<div class="col-xs-12 col-sm-12 col-md-1 col-lg-1 pull-left navImages main-logo" style="">',
                '<a ng-show="Four51User.isAuthenticated()" href="catalog">',
                /*'<img class="headerLogo" src="{{user.Company.LogoUrl}}" width="200px" height=""/>',*/
                '<img class="headerLogo" src="https://thumbprint.com/four51_images/FullColor_Primary.svg" width="150px" height=""/>',
                '</a>',
                '</div>',

                '<div class="col-xs-12 col-sm-12 col-md-6 col-lg-7 hidden-xs hidden-sm" style="margin-left: 100px;">',
                '<ul class="navUL">',

              //  '<li class="products navItems" ng-class="{\'active\': isActive([\'catalog\'])}">',
              //  '<a class="nav-link" href="catalog">',
              //  '{{\'Products\' | r | xlat}}',
              //  '</a>',
              //  '</li>',
                
                '<li class="order navItems" ng-class="{\'active\': isActive([\'order\'])}">',
                '<a class="nav-link" href="order">',
                '{{\'Orders\' | r | xlat}}',
                '<span ng-if="waitingOrderCount > 0" class="badge" style="margin-left: 5px;">{{waitingOrderCount}}</span>',
                '</a>',
                '</li>',

              //  '<li class="report navItems" ng-show="user.Type ==\'Customer\' && user.Permissions.contains(\'AdvancedReporting\')" ng-class="{\'active\': isActive([\'reports\'])}">',
              //  '<a class="nav-link" href="reports">',
              //  '{{\'Reports\' | r | xlat}}',
              //  '</a>',
              //  '</li>',

                /*'<li class="order navItems" ng-show="user.Permissions.contains(\'ViewContactUs\')" ng-class="{\'active\': isActive([\'contactus\'])}">',
                '<a href="contactus">',
                '{{\'Contact Us\' | r | xlat}}',
                '</a>',
                '</li>',*/

                '<li class="report navItems" ng-show="adminMember === true">',
                '<a class="nav-link" href="https://insights.thumbprint.com/open-view/2093611000006857945/f65b5c4d0f3796576e5004aac2dc5e39" target="_blank">',
                '{{\'Insights\' | r | xlat}}',
                '</a>',
                '</li>',
                
                '<li class="dropdown visible-md visible-lg navItems" ng-class="{\'active\': isActive([\'admin\', \'addresses\', \'address\', \'messages\', \'message\', \'favoriteorders\'])}">',
                '<a class="nav-link" class="dropdown-toggle" data-toggle="dropdown">',
                '<span class="hidden-xs">{{\'Account\' | r | xlat}}</span>',
                '<b class="caret"></b>',
                '</a>',
                '<ul class="dropdown-menu">',
                '<li ng-show="user.Permissions.contains(\'ViewSelfAdmin\')" class="admin">',
                '<a href="admin">',
                '{{\'User Information\' | r | xlat}}',
                '</a>',
                '</li>',
                '<li ng-show="user.Type == \'Customer\' && (user.Permissions.contains(\'CreateShipToAddress\') || user.Permissions.contains(\'CreateBillToAddress\'))" class="addresses">',
                '<a href="addresses">',
                '{{\'Addresses\' | r | xlat}}',
                '</a>',
                '</li>',
                '<li ng-show="user.Type == \'Customer\' && user.Permissions.contains(\'ViewMessaging\')" class="messages">',
                '<a href="message">',
                '{{\'Messages\' | r | xlat}}',
                '</a>',
                '</li>',
                '<li ng-show="user.Permissions.contains(\'ViewContactUs\')" class="contactus">',
                '<a href="contactus">',
                '{{\'Contact Us\' | r | xlat}}',
                '</a>',
                '</li>',
                '<li ng-show="user.Type!=\'TempCustomer\' && !user.Permissions.contains(\'PunchoutUser\')" class="logout">',
                '<a href="#" neworder ng-if="user.Permissions.contains(\'MultipleShoppingCart\') && currentOrder" class="neworder" ng-click="newOrderLoadingIndicator = true;startNewOrder()">',
                '{{"Start" | r | xlat}} {{"New" | r | xlat}} {{"Order" | r | xlat}}',
                '</a>',
                '</li>',
                '<li class="divider" ng-show="user.Type!=\'TempCustomer\' || AppConst.debug"></li>',
                '<li ng-show="user.Type!=\'TempCustomer\'" class="logout" ng-hide="PunchoutUser === true">',
                '<a href="#" ng-click="Logout()">',
                '<i class="fa fa-power-off text-danger"></i>',
                '<span>{{\' Log Out\' | r | xlat}}</span>',
                '</a>',
                '</li>',
                '<li ng-if="AppConst.debug">',
                '<a href="#" ng-click="Clear()">',
                '<i class="fa fa-archive"></i>',
                '<span class="text-nav">Clear Cache</span>',
                '</a>',
                '</li>',
                '</ul>',
                '</li>',
                '</ul>',
                '</div>',
                '<div class="col-xs-12 col-sm-12 col-md-5 col-lg-4 hidden-xs hidden-sm" style="">',
                '<div class="product-search pull-right col-md-12 col-lg-9" style="margin-top:20px;">',
                '<productsearchinput></productsearchinput>',
                '</div>',
                '</div>',
            '</div>',
              '<ul class="pull-right hidden-xs hidden-sm">',
              	'<minicart></minicart>',
              '</ul>',
            '</section>'
        ].join('');
    }
}
