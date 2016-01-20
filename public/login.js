(function() {

    'use strict';

    angular.module('main')
        .directive('login', 
            function($http) {
                return {
                     
                    templateUrl: 'login.html',
                    link: function(scope) {

                        scope.isLogin = function() {
                            $http.get('/api/login').success(function(info) {
                                scope.username = info.username;
                            });
                        };
                        scope.isLogin();

                        scope.singup = function(user) {
                            $http.post('/api/login', user).success(function(user) {
                                scope.username = user.name;
                            });
                        };

                        scope.login = function(user) {
                            user.isLogin = true;
                            $http.post('/api/login', user).success(function(info) {
                                if (info.status) {
                                    scope.username = user.name;
                                }
                            });
                        };

                        scope.logout = function() {
                            $http.get('/api/login/logout').success(function() {
                                delete scope.username;
                            });
                        };


                    }
                }
            }
        )


})();
