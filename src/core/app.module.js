(function () {
   'use strict';

   angular
      .module('iigame', [
         'ui.router',
         'mm.foundation',
         'gettext',
         'firebase',
         'ngMessages',
         'ngPassword',
         'ngCookies',
         'hljs',
         'angular-md5',
         'iigame.modal',
         'iigame.error',
         'iigame.constants',
         'iigame.alerts',
         'iigame.core',
         'iigame.filters',
         'iigame.menu',
         'iigame.check',
         'iigame.login',
         'iigame.passwords',
         'iigame.users',
         'iigame.settings',
         'iigame.about'
      ])
      .config(config)
      .run(run);

   /** @ngInject */
   function config($urlRouterProvider) {
      $urlRouterProvider
         .when('', '/home')
         .otherwise('/error/404');
   }

   /** @ngInject */
   function run($rootScope, ConfigService, AlertsService, SessionService, gettextCatalog) {
      ConfigService.getLanguage().then(function (lang) {
         gettextCatalog.setCurrentLanguage(lang);
      });

      $rootScope.$on('$stateChangeStart', function () {
         SessionService.setPageLoaded(false);
         AlertsService.cleanAlerts();
      });
   }

})();
