(function () {
   'use strict';

   angular
      .module('iigame.users')
      .controller('UsersCtrl', UsersCtrl);

   /** @ngAnotate */
   function UsersCtrl($log, FirebaseService, AuthService, AlertsService, gettextCatalog, ROLE, MODULE) {

      AuthService.checkAccess(MODULE.USERS);

      var vm = this;

      // fields
      vm.users = FirebaseService.getUsers();
      vm.logins = FirebaseService.getLogins();
      console.log('here ' + FirebaseService.areUsersDisabled());
      vm.areUsersDisabled = FirebaseService.areUsersDisabled();
      vm.addingUser = false;
      vm.areUsersDisabled = true;
      vm.userForm = {};
      vm.newUser = {};
      vm.newUser.password = {};
      vm.newUser.role = null;

      // methods
      vm.createUser = createUser;
      vm.createUserCancel = createUserCancel;
      vm.addUser = addUser;
      vm.getFirebaseSecurityUrl = getFirebaseSecurityUrl;

      console.log(vm.users);

      ////////////

      function createUser() {
         if (vm.userForm.$invalid) {
            return;
         }

         FirebaseService.getAuth().$createUser({
            email: vm.newUser.mail,
            password: vm.newUser.password.new
         }).then(function (userData) {
            AlertsService.addAlert('success', gettextCatalog.getString('User {{login}} was created.', {login: vm.newUser.login}));
            __saveUser(userData);
            __saveLogin();
         }).catch(function (error) {
            $log.error('Error while adding user:', error);
            AlertsService.addAlert('alert', gettextCatalog.getString('Something is wrong. Maybe user with e-mail {{mail}} exists already?', {mail: vm.newUser.mail}));
         }).finally(function () {
            __clearForm();
            addUser(false);
         });
      }

      function createUserCancel() {
         addUser(false);
         __clearForm();
      }

      function addUser(value) {
         vm.addingUser = value;
      }

      function getFirebaseSecurityUrl() {
         return FirebaseService.getSecurityUrl();
      }

      ////////////

      function __saveUser(userData) {
         vm.users[userData.uid] = {
            login: vm.newUser.login,
            role: ROLE.getAll()[vm.newUser.role]
         };
         vm.users.$save();
      }

      function __saveLogin() {
         vm.logins[vm.newUser.login] = {
            mail: vm.newUser.mail
         };
         vm.logins.$save();
      }

      function __clearForm() {
         vm.newUser.login = '';
         vm.newUser.role = null;
         vm.newUser.mail = '';
         vm.newUser.password.new = '';
         vm.newUser.password.confirm = '';

         vm.userForm.$setPristine();
      }

   }

})();
