angular.module('primeiraApp').controller('UnidadesCtrl', [
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
  UnidadesController
])

function UnidadesController($scope, $http, $location, msgs, tabs, consts, leafletData, $timeout, leafletMarkerEvents, leafletMarkersHelpers, auth) {

  var vm = $scope

  //TODA VEZ QUE TROCAR A ROTA DEVE-SE CHAMAR ESSA FUNÇÃO PARA RESETAR OS MARCADORES.
  vm.$on('$destroy', function () { 
      leafletMarkersHelpers.resetMarkerGroups(); 
  });

  vm.markers_unidades = new Array();

  vm.searchUnidades = function() {
    vm.ajustarMapa()
    tabs.show($scope, {tabList: true, tabCreate: true})    
    const url = `${consts.apiUrl}/unidades/searchUnidades`
    $http.get(url).then(function(resp) {
      vm.unidades = resp.data
      vm.unidade = {}     

      angular.forEach(vm.unidades, function(value, key){

        vm.latitude = parseFloat(value.latitude)
        vm.longitude = parseFloat(value.longitude)
        vm.unidadeMessage = value.unidade

        vm.markers_unidades.push({
          group: "Santa Catarina",
          lat: vm.latitude,
          lng: vm.longitude,
          message: vm.unidadeMessage,
          icon: {
            type: 'awesomeMarker',
            prefix: 'fa',
            icon: 'building',
            iconColor: 'white',
            markerColor: 'green'
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
    center_list: { // LOCALIZAÇÃO INICIAL  .
      lat: -26.93139823,
      lng: -51.01158833,
      zoom: 7.5
    },
    markers_list: vm.markers_unidades,
    defaults_list: {
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

  vm.buscarCEP = function(){
    const cep = vm.unidade.cep
    vm.marcarUnidade(cep)
    const url = `${consts.apiUrl}/empresaResponsavel/buscarCep/${cep}`
    $http.post(url)
      .then(function(resp) {
          vm.unidade.logradouro = resp.data.logradouro
          vm.unidade.bairro = resp.data.bairro
          vm.unidade.cidade = resp.data.localidade
          vm.unidade.uf = resp.data.uf   
      }, function (error) {
         console.log("CEP INEXISTENTE")
      })
  }  

  vm.cadastrarUnidade = function() {
    const url = `${consts.apiUrl}/unidades`;  
    $http.post(url, vm.unidade).then(function(response) {
      vm.unidade = {}
      $location.path('/dashboard')      
      msgs.addSuccess('Agência cadastrada com sucesso!')
    }).catch(function(resp) {
      msgs.addError(resp.data.errors)
    })
  }

  vm.replaceSpaces = function() {
    var strAccents = vm.unidade.unidade.split('');
    var strAccentsOut = new Array();
    var strAccentsLen = strAccents.length;
    var accents = 'ÀÁÂÃÄÅàáâãäåÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
    var accentsOut = "AAAAAAaaaaaaOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
    for (var y = 0; y < strAccentsLen; y++) {
      if (accents.indexOf(strAccents[y]) != -1) {
        strAccentsOut[y] = accentsOut.substr(accents.indexOf(strAccents[y]), 1);
      } else
        strAccentsOut[y] = strAccents[y];
    }
    vm.parametro1 = strAccentsOut.join('');
    vm.parametro2 = vm.parametro1.split(' ').join('_')
    vm.unidade.parametro = vm.parametro2.toLowerCase()
    return(vm.unidade.parametro)
  }

  vm.marcarUnidade = function(cep) {
    const url = `${consts.apiUrl}/getLatLong/${cep}`

    if (cep){
      $http.post(url)
        .then(function(resp) {
            vm.unidade.latPar = resp.data.lat 
            vm.unidade.lngPar = resp.data.lng

            return(vm.unidade.latPar,vm.unidade.lngPar)            
        }, function (error) {
           console.log("CEP INEXISTENTE")
        })

      var latitude = vm.unidade.latPar
      var longitude = vm.unidade.lngPar

      vm.markers = {
          sicoob: {
              lat: latitude,
              lng: longitude,
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
      vm.events = {
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
          vm.unidade.latitude = args.model.lat;
          vm.unidade.longitude = args.model.lng;
          return(vm.unidade.latitude, vm.unidade.longitude)
      });
    }
  }

  angular.extend(vm, { // EXTENDE AS PROPRIEDADES DO MAP (MARCADORES, LOCALIZAÇÃO INCIAL..)
      center: { // LOCALIZAÇÃO INICIAL  .
          lat: -27.226548,
          lng: -52.018311,
          zoom: 8
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

  vm.cancel = function() {
    tabs.show(vm, {tabList: true, tabCreate: true})
    vm.manutencaoForm = {}
    vm.searchManutencao()
    $location.path('/dashboard')
  }

  vm.ajustarMapa = function() {
      leafletData.getMap().then(function(map) {
          setTimeout(function() {
              map.invalidateSize();
              map._resetView(map.getCenter(), map.getZoom(), true);   
              map.fire('layeradd', {layer: this});
          }, 200);
      });
  };

  vm.ajustarMapa()
  vm.searchUnidades()

}
