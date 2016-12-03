// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.run(['$rootScope', '$window', function($rootScope, $window) {
  $window.fbAsyncInit = function() {
    // Executed when the SDK is loaded
    FB.init({
      appId: '1794346987494326',
      channelUrl: 'app/channel.html',
      status: true,
      cookie: true,
      xfbml: true,
      version: 'v2.8'
    });
  };
  (function(d){
    // load the Facebook javascript SDK
    var js,
    id = 'facebook-jssdk',
    ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
  }(document));
}])

.factory('clientHttpErrorInterceptor', ['$q', '$injector', function ($q, $injector) {
  return {
    request: function(request) {
              return request;
            },
            // This is the responseError interceptor
            responseError: function(rejection) {
              if (rejection.status === 401) {
                console.log('responseError');
                console.log(rejection);
                //$injector.get('Account').refreshToken();
              }

              /* If not a 401, do nothing with this error.
               * This is necessary to make a `responseError`
               * interceptor a no-op. */
              return $q.reject(rejection);
            }
          };

        }])
.config(function ($httpProvider) {
    $httpProvider.interceptors.push('clientHttpErrorInterceptor');
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.matches', {
    url: '/matches',
    views: {
      'menuContent': {
        templateUrl: 'templates/matches.html',
        controller: 'MatchesCtrl'
      }
    }
  })
  .state('app.dashboard', {
      url: '/dashboard',
      views: {
        'menuContent': {
          templateUrl: 'templates/dashboard.html',
          controller: 'DashboardCtrl'
        }
      }
    })
    .state('app.profile', {
      url: '/profile',
      views: {
        'menuContent': {
          templateUrl: 'templates/profile.html',
          controller: 'ProfileCtrl'
        }
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })

    .state('logout', {
      url: '/logout',
      templateUrl:'templates/logout.html',
      controller: 'LogoutCtrl'
    })
    .state('app.chat', {
        url: '/chat/:id',
        views: {
          'menuContent': {
            templateUrl: 'templates/chat.html',
            controller: 'ChatCtrl'
          }
        }
    });


  // if none of the above states are matched, use this as the fallback
    if(localStorage.getItem('ID')) {
        // console.log('user logged in');
        $urlRouterProvider.otherwise('app/dashboard');
    }else {
        // console.log('not logged in');
        $urlRouterProvider.otherwise('/login');
    }
   // $urlRouterProvider.otherwise('/dashboard');

});
