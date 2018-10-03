angular.module('primeiraApp').controller('AcoesCriminosasCtrl', [
  '$scope',
  '$http',
  '$location',
  'msgs',
  'tabs',
  'consts',
  'leafletData',
  '$timeout',
  'leafletMarkerEvents',
  'leafletMarkersHelpers',
  'auth',
  AcoesCriminosasController
])

function AcoesCriminosasController($scope, $http, $location, msgs, tabs, consts, leafletData, $timeout, leafletMarkerEvents, leafletMarkersHelpers, auth) {

  var vm = $scope

  //TODA VEZ QUE TROCAR A ROTA DEVE-SE CHAMAR ESSA FUNÇÃO PARA RESETAR OS MARCADORES.
  vm.$on('$destroy', function () { 
      leafletMarkersHelpers.resetMarkerGroups(); 
  });

  vm.searchAcoesCriminosas = function() {
    vm.ajustarMapa()
    tabs.show($scope, {tabList: true, tabCreate: true})
    vm.user_cooperativa = auth.getUser().cooperativa
    vm.user_pa = auth.getUser().pa
    vm.user_id = auth.getUser()._id    
    vm.user_nivel = auth.getUser().nivel  
    const url = `${consts.apiUrl}/acoesCriminosas/buscarAcoesCriminosas/${vm.user_cooperativa}/${vm.user_pa}/${vm.user_nivel}`
    $http.post(url)
      .then(function(resp) {
        vm.acoesCriminosas = resp.data
        vm.acaoCriminosa = {}
        tabs.show($scope, {tabList: true, tabCreate: true})
      }, function (error) {
         console.log("Fail")
      })
  } 

  vm.haSuspeitos = "nao";
  vm.haSuspeitos2 = "nao";
  vm.haSuspeitos3 = "nao";
  vm.haSuspeitos4 = "nao";
  vm.haVeiculo = "nao";

  vm.cadastrarAcaoCriminosa = function() {
    const url = `${consts.apiUrl}/acoesCriminosas`;
    vm.acaoCriminosa["user_cooperativa"] = vm.user_cooperativa;
    vm.acaoCriminosa["user_pa"] = vm.user_pa;
    vm.acaoCriminosa["user_id"] = vm.user_id;
    $http.post(url, vm.acaoCriminosa).then(function(response) {
      vm.acaoCriminosa = {}
      msgs.addSuccess('Operação realizada com sucesso!!')
      $location.path('/dashboard')
    }).catch(function(resp) {
      msgs.addError(resp.data.errors)
    })
  }

  vm.marcarPosicaoAcao = function() {

    vm.markers2 = {
        sicoob: {
            lat: -27.226785483109737,
            lng: -52.01850950717926,
            draggable: true,
            icon: {
                type: 'awesomeMarker',
                prefix: 'fa',
                icon: 'exclamation',
                iconColor: 'white',
                markerColor: 'blue'
            },
            focus: true
        }
    };

    vm.events2 = {
        markers: {
            enable: leafletMarkerEvents.getAvailableEvents(),
        }
    };

    vm.eventDetected = "No events yet...";
    var markerEvents = leafletMarkerEvents.getAvailableEvents();
    for (var k in markerEvents){
        var eventName = 'leafletDirectiveMarker.' + markerEvents[k];
        vm.$on(eventName, function(event, args){
            vm.eventDetected = event.name;
        });
    }

    vm.$on("leafletDirectiveMarker.dragend", function(event, args){
        vm.acaoCriminosa.latitude = args.model.lat;
        vm.acaoCriminosa.longitude = args.model.lng;
    });

  }

  angular.extend(vm, { // EXTENDE AS PROPRIEDADES DO MAP (MARCADORES, LOCALIZAÇÃO INCIAL..)
      center2: { // LOCALIZAÇÃO INICIAL  .
          lat: -27.226548,
          lng: -52.018311,
          zoom: 17
      },
      markers2: vm.markers2,
      defaults2: {
          tileLayer: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          zoomControlPosition: 'topright',
          tileLayerOptions: {
              opacity: 0.9,
              detectRetina: true,
              reuseTiles: true,
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy <a href="http://www.openstreetmap.org/copyright">GSEG Sistemas</a>',
          },
          scrollWheelZoom: true,
          minZoom: 3,
          worldCopyJump: true
      }
  });

  vm.cancel = function() {
    tabs.show(vm, {tabList: true, tabCreate: true})
    vm.acaoCriminosa = {}
    vm.searchAcoesCriminosas()
    $location.path('/dashboard')
  }

  //INICIO -- ANGULAR-MULTI-SELECT

  vm.tipoAcoes = [
    { name: "Furto"  },
    { name: "Roubo armado"  },
    { name: "Furto com maçarico"  },
    { name: "Roubo com furadeira"  },
    { name: "Roubo com explosivo"  },
    { name: "Roubo armado"  },
    { name: "Estelionato"  }
  ]

  vm.etnia = [
    { name: "Branco"  },
    { name: "Negros"  },
    { name: "Amarelo"  },
    { name: "Indígena"  },
    { name: "Pardo"  },
    { name: "Mulato"  },
    { name: "Caboclo"  }
  ]

  vm.cumprimentoCabelo = [
    { name: "Curto"  },
    { name: "Médio"  },
    { name: "Longo"  },
    { name: "Calvo"  }
  ]

  vm.corCabelo = [
    { name: "Louro"  },
    { name: "Preto"  },
    { name: "Castanho"  },
    { name: "Ruivo"  },
    { name: "Grisalho"  }
  ]

  vm.alturaSuspeito = [
    { name: "150"  },
    { name: "155"  },
    { name: "160"  },
    { name: "165"  },
    { name: "170"  },
    { name: "175"  },
    { name: "180"  },
    { name: "185"  },
    { name: "190"  },
    { name: "195"  },
    { name: "200"  }
  ]

vm.idadeSuspeito = [
    { name: "15"  },
    { name: "20"  },
    { name: "25"  },
    { name: "30"  },
    { name: "35"  },
    { name: "40"  },
    { name: "45"  },
    { name: "50"  },
    { name: "55"  },
    { name: "60"  },
    { name: "65"  },
    { name: "70"  },
    { name: "75"  },
    { name: "80"  }
  ]

  vm.pesoSuspeito = [
    { name: "50"  },
    { name: "55"  },
    { name: "60"  },
    { name: "65"  },
    { name: "70"  },
    { name: "75"  },
    { name: "80"  },
    { name: "85"  },
    { name: "90"  },
    { name: "95"  },
    { name: "100"  },
    { name: "110"  },
    { name: "120"  },
    { name: "130"  }
  ]

  vm.armaSuspeito = [
    { name: "Pistola"  },
    { name: "Revolver"  },
    { name: "Fuzil"  },
    { name: "SMG"  }
  ]

  vm.fonte = [
      { name: "Polícia Militar"  },
      { name: "Polícia Civil"  },
      { name: "Gerente"  }
  ];
  
  //FIM -- ANGULAR-MULTI-SELECT

  //MAPA 

  vm.markers = new Array();

  vm.buscaLatLong = function() {
    const url = `${consts.apiUrl}/acoesCriminosas/searchAcoesCriminosas/`
    $http.get(url).then(function(resp) {
      vm.acoesCriminosas = resp.data
      angular.forEach(vm.acoesCriminosas, function(value, key){

        vm.latitude = parseFloat(value.latitude)
        vm.longitude = parseFloat(value.longitude)
        vm.tipoAcao = value.tipoAcao

        var message = vm.tipoAcao

        vm.markers.push({
            group: "Santa Catarina",
            lat: vm.latitude,
            lng: vm.longitude,
            message: message,
            icon: {
                type: 'awesomeMarker',
                prefix: 'fa',
                icon: 'exclamation',
                iconColor: 'white',
                markerColor: 'blue'
            },
            label: {
                options: {
                    noHide: true
                }
            }
        });
      })
    })
  }
 
  angular.extend(vm, { // EXTENDE AS PROPRIEDADES DO MAP (MARCADORES, LOCALIZAÇÃO INCIAL..)
      center: { // LOCALIZAÇÃO INICIAL  .
          lat: -27.226548,
          lng: -52.018311,
          zoom: 17
      },
      markers: vm.markers,
      defaults: {
          tileLayer: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          zoomControlPosition: 'topright',
          tileLayerOptions: {
              opacity: 0.9,
              detectRetina: true,
              reuseTiles: true,
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy <a href="http://www.openstreetmap.org/copyright">GSEG Sistemas</a>',
          },
          scrollWheelZoom: true,
          minZoom: 3,
          worldCopyJump: true
      }
  });

  vm.ajustarMapa = function() {
      leafletData.getMap().then(function(map) {
          setTimeout(function() {
              map.invalidateSize();
              map._resetView(map.getCenter(), map.getZoom(), true);   
              map.fire('layeradd', {layer: this});

          }, 200);
      });
  };

  //TABELA FIPE//


  vm.getMarcasFipe = function(){
    const tipo = vm.acaoCriminosa.veiculos.tipo
    const urlMarca = `${consts.apiUrl}/getMarcaFipe/${tipo}`
    $http.post(urlMarca)
      .then(function(resp) {
        vm.marcasFipe = resp.data
      }, function (error) {
        console.log("Erro")
      })
  }

  vm.getModelosFipe = function() {
    const tipo = vm.acaoCriminosa.veiculos.tipo
    const marca = vm.acaoCriminosa.veiculos.marca
    const urlModelo = `${consts.apiUrl}/getModeloFipe/${tipo}/${marca}`
    $http.post(urlModelo)
      .then(function(resp) {
        vm.modelosFipe = resp.data
      }, function (error) {
        console.log("Erro")
      })
  }

  vm.getAnoFipe = function() {
    const tipo = vm.acaoCriminosa.veiculos.tipo
    const marca = vm.acaoCriminosa.veiculos.marca    
    const modelo = vm.acaoCriminosa.veiculos.modelo
    const urlAno = `${consts.apiUrl}/getAnoFipe/${tipo}/${marca}/${modelo}`
    $http.post(urlAno)
      .then(function(resp) {
        vm.anoFipe = resp.data
      }, function (error) {
        console.log("Erro")
      })
  }

  vm.corVeiculo = [
    { name: "Azul"  },
    { name: "Prata"  },
    { name: "Preto"  },
    { name: "Vermelho"  }
  ]  

  vm.ajustarMapa()
  vm.searchAcoesCriminosas()

}
