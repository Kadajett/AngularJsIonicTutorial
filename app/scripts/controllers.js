'use strict';
angular.module('IonicTut.controllers', [])

.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate) {
 
  // Called to navigate to the main app
  $scope.startApp = function() {
    $state.go('main');
  };
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
})

.controller('MainCtrl', function($scope, $state, $http, $q) {
  console.log('MainCtrl');
  
  $scope.init = function(){
    $scope.page = 1;
    $scope.getImages()
    .then(function(res){
      // success
      console.log('Images: ', res)
      $scope.imageList = res.shots;
    }, function(status){
      // err
      $scope.pageError = status;
    })
  }

  $scope.setActive = function(index){
    angular.forEach($scope.imageList, function(image){
      image.active = false;
    })

    $scope.imageList[index].active = true
  }

  $scope.getImages = function(){
    var defer = $q.defer();

    $http.jsonp('http://api.dribbble.com/shots/everyone?page=' + $scope.page +  '&callback=JSON_CALLBACK')
    .success(function(res){
      defer.resolve(res)
    })
    .error(function(status, err){
      defer.reject(status)
    })

    return defer.promise;
  }

  $scope.nextPage = function(){
    $scope.page += 1;

    $scope.getImages()
    .then(function(res){
      if($scope.imageList[0]){
        $scope.imageList = $scope.imageList.concat(res.shots)
      }
      else{
        $scope.imageList = res.shots;
      }
      console.log('nextPage: ', $scope.imageList)
      $scope.$broadcast('scroll.infiniteScrollComplete');
    })
  }

  $scope.init();

});
