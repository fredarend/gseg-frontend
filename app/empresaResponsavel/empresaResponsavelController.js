angular.module('primeiraApp').controller('EmpresaResponsavelCtrl', [
  '$scope',
  '$http',
  '$location',
  'msgs',
  'tabs',
  'consts',
  '$timeout',
  'auth',
  EmpresaResponsavelController
])

function EmpresaResponsavelController($scope, $http, $location, msgs, tabs, consts, $timeout, auth) {

  var vm = $scope

  vm.searchEmpresaResponsavel = function() {
    tabs.show($scope, {tabList: true, tabCreate: true})
    vm.user_cooperativa = auth.getUser().cooperativa
    vm.user_pa = auth.getUser().pa
    vm.user_id = auth.getUser()._id    
    vm.user_nivel = auth.getUser().nivel  
    const url = `${consts.apiUrl}/empresaResponsavel/buscarEmpresaResponsavel/${vm.user_cooperativa}/${vm.user_pa}/${vm.user_nivel}`
    $http.post(url)
      .then(function(resp) {
        vm.empresasResponsaveis = resp.data
        vm.empresaResponsavel = {}
        tabs.show($scope, {tabList: true, tabCreate: true})
      }, function (error) {
         console.log("Fail")
      })
  }

  vm.buscarCEP = function(){
    const cep = vm.empresaResponsavel.cep
    const url = `${consts.apiUrl}/empresaResponsavel/buscarCep/${cep}`
    $http.post(url)
      .then(function(resp) {
          vm.empresaResponsavel.logradouro = resp.data.logradouro
          vm.empresaResponsavel.bairro = resp.data.bairro
          vm.empresaResponsavel.cidade = resp.data.localidade
          vm.empresaResponsavel.uf = resp.data.uf    
      }, function (error) {
         console.log("CEP INEXISTENTE")
      })
  }


  vm.cadastrarEmpresaResponsavel = function() {
    const url = `${consts.apiUrl}/empresaResponsavel`;
    vm.empresaResponsavel["user_cooperativa"] = vm.user_cooperativa;
    vm.empresaResponsavel["user_pa"] = vm.user_pa;
    vm.empresaResponsavel["user_id"] = vm.user_id;      
    $http.post(url, vm.empresaResponsavel).then(function(response) {
      vm.empresaResponsavel = {}
      msgs.addSuccess('Operação realizada com sucesso!!')
      $location.path('/dashboard');
    }).catch(function(resp) {
      msgs.addError(resp.data.errors)
    })
  }

  vm.cancel = function() {
    $location.path('/dashboard');
  }

  vm.searchEmpresaResponsavel()

}
