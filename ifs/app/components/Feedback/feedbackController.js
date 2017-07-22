/* Feedback -
    Tool Controller includes a 2nd route /tool/data for collecting information in this controller
    The main route /tool is server side in toolRoutes.js

    This Controller mostly works with popovers (inc mini)
*/
app.controller( "feedbackCtrl", function($scope, $http, $sce) {

    /* This refers to the user selected item. */
    $scope.selectedFeedback = {};
    $scope.activeFeedback = {};

    $scope.selectedArray = [];
    $scope.sideSelectedArrId = 0;
    $scope.sideSelectedId = 0;

    $scope.showSideBar = false;

    $scope.test = function() {
        $scope.showSideBar = !$scope.showSideBar;
    }

    $scope.setSelectedItem = function(event) {
        // Array of items matching this error are passed
        console.log("HERE34");

        if( event.target.getAttribute("data-feedback")){
            $scope.selectedArray = event.target.getAttribute("data-feedback");
            $scope.selectedArray = $scope.selectedArray.split(",");

            $scope.sideSelectedArrId = 0;

            // Set the first item for the mini popover
            $scope.sideSelectedId = $scope.selectedArray[ $scope.sideSelectedArrId ];
            $scope.selectedFeedback = $scope.feedbackItems[ $scope.sideSelectedId ];
        }
    };

    $scope.getNextSelected = function() {
        $scope.sideSelectedArrId++;
        $scope.sideSelectedArrId =  $scope.sideSelectedArrId  % $scope.selectedArray.length;

        // Set the first item for the mini popover
        $scope.sideSelectedId =  $scope.selectedArray[ $scope.sideSelectedArrId ];
        $scope.selectedFeedback = $scope.feedbackItems[ $scope.sideSelectedId ];
    };

    $scope.getPrevSelected = function() {
        if( $scope.sideSelectedArrId <= 0 )
            $scope.sideSelectedArrId = $scope.selectedArray.length-1;
        else
            $scope.sideSelectedArrId--;

    // Set the first item for the mini popover
        $scope.sideSelectedId =  $scope.selectedArray[ $scope.sideSelectedArrId ];
        $scope.selectedFeedback = $scope.feedbackItems[ $scope.sideSelectedId ];
    };

    // Storing backend information into the front end.
    $scope.files = [];
    $scope.toolsUsed = [];
    $scope.feedbackItems=[];
    $scope.feedbackStats=[];
    $scope.filterByTool =null;
    $scope.toolType = null;
    $scope.code =

    $scope.allowFeedbackType = function(feedbackItem) {
        return ( $scope.filterByTool == "All" || feedbackItem.toolName == $scope.filterByTool);
    }

    $scope.generalFeedbackType = function(feedbackItem) {
        return $scope.filename == "";
    }

    $scope.inDisplayStats = function(feedbackItem) {
        var result = [];
        if( feedbackItem ) {
            var displayStats = [ 'chCount','wordCount','nSens', 'avgWrdPerSen', 'nPar',
                                'avgSenPerPar', 'correctWordCount', 'misspelledWordCount'];

            angular.forEach(displayStats, function(value){
                if(feedbackItem.hasOwnProperty(value)) {
                    result.push( feedbackItem[value] );
                }
            });
        }
        return result;
    };

    $scope.getFeedback = function(feedback) {
        return feedback.markedUp;
    };

    $http.get("/feedback/data").then(function(res) {
        $scope.feedbackItems = res.data.feedbackItems;
        $scope.files = res.data.files;
        $scope.toolsUsed = res.data.toolsUsed;
        $scope.feedbackStats = res.data.feedbackStats;
        $scope.filterByTool = res.data.selectedTool;
        $scope.toolType = res.data.toolType;

        if($scope.toolsUsed) {
            $scope.toolsUsed.unshift( "All" );
        }
    });
})
.filter('unsafe', function($sce) { 
    return $sce.trustAsHtml; 
})
.directive('dynamic', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.dynamic, function(html) {
        ele.html(html);
        $compile(ele.contents())(scope);
      });
    }
  };
});