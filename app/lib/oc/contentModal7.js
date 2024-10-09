angular.module('OrderCloud-ContentModal7', []); 

angular.module('OrderCloud-ContentModal7')
    .directive('contentmodal7', contentmodal7)
    .controller('ContentModalCtrl7', ContentModalCtrl7)
;

function contentmodal7() {
    var directive = {
        restrict: 'E',
        template: template,
        controller: 'ContentModalCtrl7'
    };
    return directive;

    function template() {
        return [
            '<style>',
            //this style is conditional based on nav placement and site css
            'contentmodal a, contentmodal a:hover, contentmodal a:focus {color:#fff; text-decoration:none;}',
            '</style>',
            // update the size of the modal window within the open()
            '<a ng-click="open7(500)" style="text-decoration: none;">',
            // replace the *Open Modal* below with your link name
            '<span class="modalName PDT-modalName"></span> {{\'Open\' | r | xlat}}',
            '</a>'
        ].join('');
    }
}

ContentModalCtrl7.$inject = ['$scope', '$modal'];
function ContentModalCtrl7($scope, $modal) {

    $scope.animationsEnabled = true;

    $scope.open7 = function (size) {

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: true,
            size: size,
            template: contentmodal7open,
            controller: ContentModalOpenCtrl7,
            resolve: {
                item: function () {
                    //pass a scope variable into the modal content. in this case we are providing line item as an example for product use
                    return $scope.LineItem;
                }
            }
        });

        function contentmodal7open() {
            return [
                      '<style>',
        '.modal-header {min-height: 36px; padding: 2px;border-bottom: 1px solid #e5e5e5;}',
        '.modal-header h3 { margin-top:0;}',
        '.modal-header h5 { font-size:1.16em; font-weight:bold; padding:5px 10px; text-shadow: 0 1px 0 #ffffff;}',
        '.modal-header a.close {margin:0;padding:0;position:absolute;top:8px;right:10px;font-size:1.5em;color:#000;}',
        '.modal-body {width:100%; margin:0 auto; padding:10px 25px;}',
        '</style>',
        '<div class="modal-header" style="padding:0;">',
        //Optional title in top header
        // '<img src="https://thumbprint.com/four51_images/Our-offices-will-be-closed-December-24th-January-2nd_v1.png" alt="Happy Holidays" style="width: 100%;border-top-left-radius: 6px;border-top-right-radius: 6px;">',
        '<img src="https://thumbprint.com/four51_images/Hurricane Milton Web Banner.png" alt="Alert Message" style="width: 100%;border-top-left-radius: 6px;border-top-right-radius: 6px;">',
        // '<h5 class="modal-title text-primary">Happy Holiday from Thumbprint</i></h5>',
        //Optional close (x) in top header
        '<a class="pull-right close" ng-click="close()" style="top: 2px;">',
        '<i class="fa fa-times"></i>',
        '</a>',
        '</div>',
        '<div class="modal-body" style="padding-top: 25px;">',
        // '<h3>Heading</h3>',
        // content block 1
        //'<h4>Subheading</h4>',
        '<p>',
        'Please be aware that we are in the path of Hurricane Milton. Our operations are currently suspended or limited through the end of this week as we prioritize the safety of our team and community',
        '</p>',
        '<p>',
        'We appreciate your understanding during this time.',
        '</p>',
        // '<p>',
        // 'We wish you a Happy Holidays and New Year!',
        // '</p>',
        // '<p>',
        // 'If you have any questions please email: events@teamtag.com',
        // '</p>',
        //content block 2
        // '<p>',
        // '<div ng-repeat="field in user.CustomFields | filter:{Name:\'ADMI_Popup\'}">',
        //   '<occheckboxfield id="update-password-field" customfield="field" ng-if="field.ControlType == \'Selection\'" ng-required="field.IsRequired" label=\'Check box to never see this pop-up again\' checked=\'Yes\' unchecked=\'No\'/>',
        // '</div>',
        // '</p>',
        // <occheckboxfield customfield='Variant.Specs.Approved' label='Custom' checked='Yes' unchecked='No'></occheckboxfield>
        //'<h4>Subheading</h4>',
        '</div>',
        //Optional footer
        '<div class="modal-footer">',
        '<div class="pull-left">',
        // '<a class="btn btn-default" ng-click="cancel()">Cancel</a>',
        // '<div ng-repeat="field in user.CustomFields | filter:{Name:\'Chewy_Popup\'}">',
        // '<occheckboxfield id="update-password-field" customfield="field" ng-if="field.ControlType == \'Selection\'" ng-required="field.IsRequired" label=\'Check box to never see this pop-up again\' checked=\'Yes\' unchecked=\'No\'/>',
        // '</div>',
        '</div>',
        '<div class="pull-right">',
        '<a target="_blank" class="btn btn-info" ng-click="close()">Close</a>',
        '</div>',
        '</div>'
            ].join('');
        }

        $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };

    };

    var ContentModalOpenCtrl7 = ['$scope', '$modalInstance', '$modal', 'item', function($scope, $modalInstance, $modal, item) {

        $scope.item = item; // this is the item passed in from the ContentModalCtrl7 resolve

        $scope.close = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    }];
$scope.open7(500);
}
