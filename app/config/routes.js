angular.module('primeiraApp').config([
  '$stateProvider',
  '$urlRouterProvider',
  '$httpProvider',
  function($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider.state('dashboard', {
      url: "/dashboard",
      templateUrl: "dashboard/dashboard.html"
    }).state('acoesCriminosas', {
      url: "/acoesCriminosas",
      templateUrl: "acoesCriminosas/tabs.html"
    }).state('alertas', {
      url: "/alertas",
      templateUrl: "alertas/tabs.html"
    }).state('empresaResponsavel', {
      url: "/empresaResponsavel",
      templateUrl: "empresaResponsavel/tabs.html"
    }).state('manutencao', {
      url: "/manutencao",
      templateUrl: "manutencao/tabs.html"
    }).state('unidades', {
      url: "/unidades",
      templateUrl: "unidades/tabs.html"
    })

    $httpProvider.interceptors.push('handleResponseError')

}])

.run([
  '$rootScope',
  '$http',
  '$location',
  '$window',
  'auth',
  function ($rootScope, $http, $location, $window, auth) {
    validateUser()
    $rootScope.$on('$locationChangeStart', () => validateUser())
  
    const user = auth.getUser()

    function validateUser() {
      const user = auth.getUser()
      const authPage = '/auth.html'
      const isAuthPage = $window.location.href.includes(authPage)

      if (!user && !isAuthPage) {
        $window.location.href = authPage
      } else if (user && !user.isValid) {
        auth.validateToken(user.token, (err, valid) => {
          if (!valid) {
            $window.location.href = authPage
          } else {
            user.isValid = true
            $http.defaults.headers.common.Authorization = user.token
            isAuthPage ? $window.location.href = '/' : $location.path('/dashboard')
          }
        })
      }
    }
  }
])