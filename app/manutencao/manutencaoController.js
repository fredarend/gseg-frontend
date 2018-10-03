angular.module('primeiraApp').controller('ManutencaoCtrl', [
  '$scope',
  '$http',
  '$location',
  'msgs',
  'tabs',
  'consts',
  '$timeout',
  'auth',
  ManutencaoController
])

function ManutencaoController($scope, $http, $location, msgs, tabs, consts, $timeout, auth) {

  var vm = $scope

  vm.getUser = function(){
    vm.user_cooperativa = auth.getUser().cooperativa
    vm.user_pa = auth.getUser().pa
    vm.user_id = auth.getUser()._id    
    vm.user_nivel = auth.getUser().nivel
  }

  vm.searchManutencao = function() {
    tabs.show($scope, {tabList: true, tabCreate: true})
    vm.user_cooperativa = auth.getUser().cooperativa
    vm.user_pa = auth.getUser().pa
    vm.user_id = auth.getUser()._id    
    vm.user_nivel = auth.getUser().nivel
    const url = `${consts.apiUrl}/manutencao/buscarManutencao/${vm.user_cooperativa}/${vm.user_pa}/${vm.user_nivel}`
    $http.post(url)
      .then(function(resp) {
        vm.manutencao = resp.data
        vm.manutencaoForm = {}
        tabs.show($scope, {tabList: true, tabCreate: true})
      }, function (error) {
         console.log("Fail")
      })
  }

  vm.searchEmpresaResponsavel = function() {
    const url = `${consts.apiUrl}/empresaResponsavel/searchEmpresaResponsavel`    
    $http.get(url).then(function(resp) {
      vm.empresasResponsaveis = resp.data
    })
  }

  vm.cadastrarManutencao = function() {
    const url = `${consts.apiUrl}/manutencao`;

    vm.manutencaoForm["user_cooperativa"] = vm.user_cooperativa;
    vm.manutencaoForm["user_pa"] = vm.user_pa;
    vm.manutencaoForm["user_id"] = vm.user_id;

    $http.post(url, vm.manutencaoForm).then(function(response) {
      vm.manutencaoForm = {}
      vm.searchManutencao()
      msgs.addSuccess('Manutenção cadastrada com sucesso!')
      $location.path('/dashboard')


    }).catch(function(resp) {
      msgs.addError(resp.data.errors)
    })
  }

  vm.cancel = function() {
    tabs.show(vm, {tabList: true, tabCreate: true})
    vm.manutencaoForm = {}
    vm.searchManutencao()
    $location.path('/dashboard')
  }

  vm.equipamento = [
    { name: "CFTV"  },
    { name: "Sistema de Alarme"  },
    { name: "Sistema de Alarme de Incêncio"  },
    { name: "Iluminação"  },
    { name: "Porta Giratória"  },
    { name: "Cofre"  }
  ]

  vm.getUser()
  vm.searchManutencao()
  vm.searchEmpresaResponsavel()

}
