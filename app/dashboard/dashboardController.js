angular.module('primeiraApp').controller('DashboardCtrl', [
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
	DashboardController
	])

function DashboardController($scope, $http, $location, msgs, tabs, consts, leafletData, $timeout, leafletMarkerEvents, leafletMarkersHelpers, auth) {
	const vm = $scope

	vm.user_nivel = auth.getUser().nivel  
	console.log("nivel: ", vm.user_nivel)

	$(function () {
		$('[data-toggle="tooltip"]').tooltip()
	})

	vm.ptbr = {
	    search          : "Buscar ...",
	    nothingSelected : "Selecione uma Agência" 
	}

	vm.searchUnidades = function() {
	    const url = `${consts.apiUrl}/unidades/searchUnidades`	
		$http.post(url)
		.then(function(resp) {
			vm.unidadesLista = resp.data
			var lista = vm.unidadesLista
			lista.unshift({unidade: "Todas as Agências", parametro: "todas_agencias"})
			vm.unidades = resp.data.length - 1 
		}, function (error) {
			console.log("Fail")
		})
	}  	


	vm.pesquisarPorUnidade = 0
	vm.pesquisarTodasUnidades = 1

	console.log(vm.pesquisarPorUnidade)

	vm.buscarDashboardUnidade = function(data) {
		if(data.parametro == 'todas_agencias'){
			vm.pesquisarPorUnidade = 0
			vm.pesquisarTodasUnidades = 1		
			console.log(vm.pesquisarPorUnidade)
			vm.searchAlertas()
			vm.searchManutencoes()
			vm.searchAcoesCriminosas()
			vm.buscarAcoesAnoGraficoDashboard()
			vm.buscarAlertasAnoGraficoDashboard()
			vm.buscarAcoesTipoGraficoDashboard()
			vm.buscarAlertasTipoGraficoDashboard()
		} else {
			vm.pesquisarPorUnidade = 1
			vm.pesquisarTodasUnidades = 0		
			vm.searchAlertasUnidade(data.parametro)
			vm.searchAcoesCriminosasUnidade(data.parametro)
			vm.searchManutencaoUnidade(data.parametro)
			vm.buscarAcoesAnoGraficoUnidade(data.parametro)
			vm.buscarAlertasAnoGraficoUnidade(data.parametro)
			vm.buscarAcoesTipoGraficoUnidade(data.parametro)
			vm.buscarAlertasTipoGraficoUnidade(data.parametro)
		}
	}

	vm.searchAlertasUnidade = function(parametro){
		vm.user_nivel = auth.getUser().nivel  
		const url = `${consts.apiUrl}/alertas/buscarAlertasUnidade/${vm.user_nivel}/${parametro}`
		$http.post(url)
		.then(function(resp) {
			vm.alertaUnidade = resp.data
		}, function (error) {
			console.log("Fail")
		})
	}

	vm.searchAcoesCriminosasUnidade = function(parametro){
		vm.user_nivel = auth.getUser().nivel  
		const url = `${consts.apiUrl}/acoesCriminosas/buscarAcoesUnidade/${vm.user_nivel}/${parametro}`
		$http.post(url)
		.then(function(resp) {
			vm.acoesUnidade = resp.data
		}, function (error) {
			console.log("Fail")
		})		
	}

	vm.searchManutencaoUnidade = function(parametro){
		vm.user_nivel = auth.getUser().nivel
		const url = `${consts.apiUrl}/manutencao/buscarManutencaoUnidade/${vm.user_nivel}/${parametro}`
		$http.post(url)
		.then(function(resp) {
			vm.manutencaoUnidade = resp.data
		}, function (error) {
			console.log("Fail")
		})		
	}

	//CARDS

	vm.searchAlertas = function() {
		vm.user_cooperativa = auth.getUser().cooperativa
		vm.user_pa = auth.getUser().pa
		vm.user_id = auth.getUser()._id    
		vm.user_nivel = auth.getUser().nivel  
		const url = `${consts.apiUrl}/alertas/buscarAlertas/${vm.user_cooperativa}/${vm.user_pa}/${vm.user_nivel}`
		$http.post(url)
		.then(function(resp) {
			vm.alerta = resp.data.length
		}, function (error) {
			console.log("Fail")
		})
	}  	

	vm.searchAcoesCriminosas = function() {
		vm.user_cooperativa = auth.getUser().cooperativa
		vm.user_pa = auth.getUser().pa
		vm.user_id = auth.getUser()._id    
		vm.user_nivel = auth.getUser().nivel  
		const url = `${consts.apiUrl}/acoesCriminosas/buscarAcoesCriminosas/${vm.user_cooperativa}/${vm.user_pa}/${vm.user_nivel}`
		$http.post(url)
		.then(function(resp) {
			vm.acoesCriminosas = resp.data
		}, function (error) {
			console.log("Fail")
		})
	} 

	vm.searchManutencoes = function() {
		vm.user_cooperativa = auth.getUser().cooperativa
		vm.user_pa = auth.getUser().pa
		vm.user_id = auth.getUser()._id    
		vm.user_nivel = auth.getUser().nivel
		const url = `${consts.apiUrl}/manutencao/buscarManutencao/${vm.user_cooperativa}/${vm.user_pa}/${vm.user_nivel}`
		$http.post(url)
		.then(function(resp) {
			vm.manutencoes = resp.data.length
		}, function (error) {
			console.log("Fail")
		})
	}

	vm.searchManutencoes()
	vm.searchAcoesCriminosas()
	vm.searchAlertas()
	vm.searchUnidades()

	//GRÁFICO AÇÕES CRIMINOSAS GRAFICOACOES

	// *** GRÁFICO DE AÇÕES CRIMINOSAS POR ANO GERAL *** // 

	vm.buscarAcoesAnoGraficoDashboard = function() {		
		vm.user_cooperativa = auth.getUser().cooperativa
		vm.user_pa = auth.getUser().pa
		vm.user_id = auth.getUser()._id    
		vm.user_nivel = auth.getUser().nivel  
		const url = `${consts.apiUrl}/acoesCriminosas/buscarAcoesAnoGraficoDashboard/${vm.user_cooperativa}/${vm.user_pa}/${vm.user_nivel}`
		$http.post(url)
		.then(function(resp) {
			vm.jan = []
			vm.fev = []
			vm.mar = []
			vm.abr = []
			vm.mai = []
			vm.jun = []
			vm.jul = []
			vm.ago = []
			vm.set = []
			vm.out = []
			vm.nov = []
			vm.dez = []
			vm.acoesAno = resp.data
			angular.forEach(vm.acoesAno, function(value, key){
				if (/(.*)-01-(.*)/.test(value.data)){
					vm.jan.push(value);
				} else if (/(.*)-02-(.*)/.test(value.data)){
					vm.fev.push(value);
				} else if (/(.*)-03-(.*)/.test(value.data)){
					vm.mar.push(value);
				} else if (/(.*)-04-(.*)/.test(value.data)){
					vm.abr.push(value);
				} else if (/(.*)-05-(.*)/.test(value.data)){
					vm.mai.push(value);
				} else if (/(.*)-06-(.*)/.test(value.data)){
					vm.jun.push(value);
				} else if (/(.*)-07-(.*)/.test(value.data)){
					vm.jul.push(value);
				} else if (/(.*)-08-(.*)/.test(value.data)){
					vm.ago.push(value);
				} else if (/(.*)-09-(.*)/.test(value.data)){
					vm.set.push(value);
				} else if (/(.*)-10-(.*)/.test(value.data)){
					vm.out.push(value);
				} else if (/(.*)-11-(.*)/.test(value.data)){
					vm.nov.push(value);
				} else if (/(.*)-12-(.*)/.test(value.data)){
					vm.dez.push(value);
				}
			})		

			vm.labels_acoes_geral = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

			vm.data_acoes_geral = [
				[vm.jan.length, vm.fev.length, vm.mar.length, vm.abr.length, vm.mai.length, vm.jun.length, vm.jul.length, vm.ago.length, vm.set.length, vm.out.length, vm.nov.length, vm.dez.length]
			];

		}, function (error) {
			console.log("Fail")
		})
	} 

	vm.buscarAcoesAnoGraficoDashboard()

	// *** GRÁFICO DE AÇÕES CRIMINOSAS POR ANO POR UNIDADES *** // 

	vm.buscarAcoesAnoGraficoUnidade = function(parametro){
		vm.graficoTipoAcao = 0
		vm.graficoAnoAcao = 1		
		vm.user_nivel = auth.getUser().nivel  
		const url = `${consts.apiUrl}/acoesCriminosas/buscarAcoesAnoGraficoUnidade/${vm.user_nivel}/${parametro}`
		$http.post(url)
		.then(function(resp) {
			vm.jan = []
			vm.fev = []
			vm.mar = []
			vm.abr = []
			vm.mai = []
			vm.jun = []
			vm.jul = []
			vm.ago = []
			vm.set = []
			vm.out = []
			vm.nov = []
			vm.dez = []
			vm.acoesAno = resp.data
			angular.forEach(vm.acoesAno, function(value, key){
				if (/(.*)-01-(.*)/.test(value.data)){
					vm.jan.push(value);
				} else if (/(.*)-02-(.*)/.test(value.data)){
					vm.fev.push(value);
				} else if (/(.*)-03-(.*)/.test(value.data)){
					vm.mar.push(value);
				} else if (/(.*)-04-(.*)/.test(value.data)){
					vm.abr.push(value);
				} else if (/(.*)-05-(.*)/.test(value.data)){
					vm.mai.push(value);
				} else if (/(.*)-06-(.*)/.test(value.data)){
					vm.jun.push(value);
				} else if (/(.*)-07-(.*)/.test(value.data)){
					vm.jul.push(value);
				} else if (/(.*)-08-(.*)/.test(value.data)){
					vm.ago.push(value);
				} else if (/(.*)-09-(.*)/.test(value.data)){
					vm.set.push(value);
				} else if (/(.*)-10-(.*)/.test(value.data)){
					vm.out.push(value);
				} else if (/(.*)-11-(.*)/.test(value.data)){
					vm.nov.push(value);
				} else if (/(.*)-12-(.*)/.test(value.data)){
					vm.dez.push(value);
				}
			})		

			vm.labels_acoes_unidade = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

			vm.data_acoes_unidade = [
				[vm.jan.length, vm.fev.length, vm.mar.length, vm.abr.length, vm.mai.length, vm.jun.length, vm.jul.length, vm.ago.length, vm.set.length, vm.out.length, vm.nov.length, vm.dez.length]
			];

		}, function (error) {
			console.log("Fail")
		})
	}

	// *** GRÁFICO DE AÇÕES CRIMINOSAS POR TIPO GERAL *** // 

	vm.buscarAcoesTipoGraficoDashboard = function() {
		vm.user_cooperativa = auth.getUser().cooperativa
		vm.user_pa = auth.getUser().pa
		vm.user_id = auth.getUser()._id    
		vm.user_nivel = auth.getUser().nivel  
		const url = `${consts.apiUrl}/acoesCriminosas/buscarAcoesAnoGraficoDashboard/${vm.user_cooperativa}/${vm.user_pa}/${vm.user_nivel}`
		$http.post(url)
		.then(function(resp) {
			vm.furto = []
			vm.rouboArmado = []
			vm.rouboFuradeira = []
			vm.rouboExplosivo = []
			vm.estelionato = []
			vm.acoesTipo = resp.data

			angular.forEach(vm.acoesTipo, function(value, key){
				if (/Furto/.test(value.tipoAcao)){
					vm.furto.push(value);
				} else if (/Roubo armado/.test(value.tipoAcao)){
					vm.rouboArmado.push(value);
				} else if (/Roubo com furadeira/.test(value.tipoAcao)){
					vm.rouboFuradeira.push(value);
				} else if (/Roubo com explosivo/.test(value.tipoAcao)){
					vm.rouboExplosivo.push(value);
				} else if (/Estelionato/.test(value.tipoAcao)){
					vm.estelionato.push(value);
				}
			})		

			var furto = vm.furto.length 
			var rouboArmado = vm.rouboArmado.length
			var rouboFuradeira = vm.rouboFuradeira.length
			var rouboExplosivo = vm.rouboExplosivo.length
			var estelionato = vm.estelionato.length

			vm.labels_acoes_tipo_geral = ["Furto", "Roubo armado", "Roubo com furadeira", "Roubo com explosivo", "Estelionato"];
			vm.data_acoes_tipo_geral = [furto, rouboArmado, rouboFuradeira, rouboExplosivo, estelionato];
			vm.colors_acoes_tipo_geral = [{
			      backgroundColor: 'rgba(87, 199, 212, 0.7)',
			      pointBackgroundColor: 'rgb(87, 199, 212)',
			      pointHoverBackgroundColor: 'rgb(87, 199, 212)',
			      borderColor: 'rgb(87, 199, 212)',
			      pointBorderColor: '#fff',
			      pointHoverBorderColor: 'rgb(87, 199, 212)'
			    },{
			      backgroundColor: 'rgba(70, 190, 138, 0.7)',
			      pointBackgroundColor: 'rgb(70, 190, 138)',
			      pointHoverBackgroundColor: 'rgb(70, 190, 138)',
			      borderColor: 'rgb(70, 190, 138)',
			      pointBorderColor: '#fff',
			      pointHoverBorderColor: 'rgb(70, 190, 138)'
			    },{
			      backgroundColor: 'rgba(225,56,18, 0.7)',
			      pointBackgroundColor: 'rgb(225,56,18)',
			      pointHoverBackgroundColor: 'rgb(225,56,18)',
			      borderColor: 'rgb(225,56,18)',
			      pointBorderColor: '#fff',
			      pointHoverBorderColor: 'rgb(225,56,18)'
			    },{
			      backgroundColor: 'rgba(242,164,0, 0.7)',
			      pointBackgroundColor: 'rgb(242,164,0)',
			      pointHoverBackgroundColor: 'rgb(242,164,0)',
			      borderColor: 'rgb(242,164,0)',
			      pointBorderColor: '#fff',
			      pointHoverBorderColor: 'rgb(242,164,0)'
			    },{
			      backgroundColor: 'rgba(41,84,171, 0.7)',
			      pointBackgroundColor: 'rgb(41,84,171)',
			      pointHoverBackgroundColor: 'rgb(41,84,171)',
			      borderColor: 'rgb(41,84,171)',
			      pointBorderColor: '#fff',
			      pointHoverBorderColor: 'rgb(41,84,171)'
			    }
			  ]
			vm.options_acoes_tipo_geral = {
				legend: {
					display: true,
					position: 'right'
				}
			}

		}, function (error) {
			console.log("Fail")
		})
	} 

	vm.buscarAcoesTipoGraficoDashboard()

	// *** GRÁFICO DE AÇÕES CRIMINOSAS POR TIPO POR UNIDADE *** // 

	vm.buscarAcoesTipoGraficoUnidade = function(parametro) {
		vm.user_nivel = auth.getUser().nivel  
		const url = `${consts.apiUrl}/acoesCriminosas/buscarAcoesAnoGraficoUnidade/${vm.user_nivel}/${parametro}`
		$http.post(url)
		.then(function(resp) {
			vm.furto = []
			vm.rouboArmado = []
			vm.rouboFuradeira = []
			vm.rouboExplosivo = []
			vm.estelionato = []
			vm.acoesTipoUnidade = resp.data
			angular.forEach(vm.acoesTipoUnidade, function(value, key){
				if (/Furto/.test(value.tipoAcao)){
					vm.furto.push(value);
				} else if (/Roubo armado/.test(value.tipoAcao)){
					vm.rouboArmado.push(value);
				} else if (/Roubo com furadeira/.test(value.tipoAcao)){
					vm.rouboFuradeira.push(value);
				} else if (/Roubo com explosivo/.test(value.tipoAcao)){
					vm.rouboExplosivo.push(value);
				} else if (/Estelionato/.test(value.tipoAcao)){
					vm.estelionato.push(value);
				}
			})		

			var furto = vm.furto.length 
			var rouboArmado = vm.rouboArmado.length
			var rouboFuradeira = vm.rouboFuradeira.length
			var rouboExplosivo = vm.rouboExplosivo.length
			var estelionato = vm.estelionato.length

			vm.labels_acoes_tipo_unidade = ["Furto", "Roubo armado", "Roubo com furadeira", "Roubo com explosivo", "Estelionato"];
			vm.data_acoes_tipo_unidade = [furto, rouboArmado, rouboFuradeira, rouboExplosivo, estelionato];
			vm.colors_acoes_tipo_geral = [{
			      backgroundColor: 'rgba(87, 199, 212, 0.7)',
			      pointBackgroundColor: 'rgb(87, 199, 212)',
			      pointHoverBackgroundColor: 'rgb(87, 199, 212)',
			      borderColor: 'rgb(87, 199, 212)',
			      pointBorderColor: '#fff',
			      pointHoverBorderColor: 'rgb(87, 199, 212)'
			    },{
			      backgroundColor: 'rgba(70, 190, 138, 0.7)',
			      pointBackgroundColor: 'rgb(70, 190, 138)',
			      pointHoverBackgroundColor: 'rgb(70, 190, 138)',
			      borderColor: 'rgb(70, 190, 138)',
			      pointBorderColor: '#fff',
			      pointHoverBorderColor: 'rgb(70, 190, 138)'
			    },{
			      backgroundColor: 'rgba(225,56,18, 0.7)',
			      pointBackgroundColor: 'rgb(225,56,18)',
			      pointHoverBackgroundColor: 'rgb(225,56,18)',
			      borderColor: 'rgb(225,56,18)',
			      pointBorderColor: '#fff',
			      pointHoverBorderColor: 'rgb(225,56,18)'
			    },{
			      backgroundColor: 'rgba(242,164,0, 0.7)',
			      pointBackgroundColor: 'rgb(242,164,0)',
			      pointHoverBackgroundColor: 'rgb(242,164,0)',
			      borderColor: 'rgb(242,164,0)',
			      pointBorderColor: '#fff',
			      pointHoverBorderColor: 'rgb(242,164,0)'
			    },{
			      backgroundColor: 'rgba(41,84,171, 0.7)',
			      pointBackgroundColor: 'rgb(41,84,171)',
			      pointHoverBackgroundColor: 'rgb(41,84,171)',
			      borderColor: 'rgb(41,84,171)',
			      pointBorderColor: '#fff',
			      pointHoverBorderColor: 'rgb(41,84,171)'
			    }
			  ]		
			vm.options_acoes_tipo_unidade = {
				legend: {
					display: true,
					position: 'right'
				}
			}

		}, function (error) {
			console.log("Fail")
		})
	} 

	//FIM - GRÁFICO AÇÕES CRIMINOSAS

	//GRÁFICO ALERTAS

	// *** GRÁFICO DE ALERTAS POR ANO GERAL *** // 

	vm.buscarAlertasAnoGraficoDashboard = function() {
		vm.user_cooperativa = auth.getUser().cooperativa
		vm.user_pa = auth.getUser().pa
		vm.user_id = auth.getUser()._id    
		vm.user_nivel = auth.getUser().nivel  
		const url = `${consts.apiUrl}/alertas/buscarAlertasAnoGraficoDashboard/${vm.user_cooperativa}/${vm.user_pa}/${vm.user_nivel}`
		$http.post(url)
		.then(function(resp) {
			vm.jan = []
			vm.fev = []
			vm.mar = []
			vm.abr = []
			vm.mai = []
			vm.jun = []
			vm.jul = []
			vm.ago = []
			vm.set = []
			vm.out = []
			vm.nov = []
			vm.dez = []
			vm.alertasAno = resp.data
			angular.forEach(vm.alertasAno, function(value, key){
				if (/(.*)-01-(.*)/.test(value.data)){
					vm.jan.push(value);
				} else if (/(.*)-02-(.*)/.test(value.data)){
					vm.fev.push(value);
				} else if (/(.*)-03-(.*)/.test(value.data)){
					vm.mar.push(value);
				} else if (/(.*)-04-(.*)/.test(value.data)){
					vm.abr.push(value);
				} else if (/(.*)-05-(.*)/.test(value.data)){
					vm.mai.push(value);
				} else if (/(.*)-06-(.*)/.test(value.data)){
					vm.jun.push(value);
				} else if (/(.*)-07-(.*)/.test(value.data)){
					vm.jul.push(value);
				} else if (/(.*)-08-(.*)/.test(value.data)){
					vm.ago.push(value);
				} else if (/(.*)-09-(.*)/.test(value.data)){
					vm.set.push(value);
				} else if (/(.*)-10-(.*)/.test(value.data)){
					vm.out.push(value);
				} else if (/(.*)-11-(.*)/.test(value.data)){
					vm.nov.push(value);
				} else if (/(.*)-12-(.*)/.test(value.data)){
					vm.dez.push(value);
				}
			})		

			vm.labels_alerta_geral = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

			vm.data_alerta_geral = [
				[vm.jan.length, vm.fev.length, vm.mar.length, vm.abr.length, vm.mai.length, vm.jun.length, vm.jul.length, vm.ago.length, vm.set.length, vm.out.length, vm.nov.length, vm.dez.length]
			];

		}, function (error) {
			console.log("Fail")
		})
	} 

	vm.buscarAlertasAnoGraficoDashboard()

	// *** GRÁFICO DE ALERTAS POR ANO POR UNIDADES *** // 

	vm.buscarAlertasAnoGraficoUnidade = function(parametro){	
		vm.user_nivel = auth.getUser().nivel  
		const url = `${consts.apiUrl}/alertas/buscarAlertasAnoGraficoUnidade/${vm.user_nivel}/${parametro}`
		$http.post(url)
		.then(function(resp) {
			vm.jan = []
			vm.fev = []
			vm.mar = []
			vm.abr = []
			vm.mai = []
			vm.jun = []
			vm.jul = []
			vm.ago = []
			vm.set = []
			vm.out = []
			vm.nov = []
			vm.dez = []

			vm.alertasAnoUnidade = resp.data
			angular.forEach(vm.alertasAnoUnidade, function(value, key){

				if (/(.*)-01-(.*)/.test(value.data)){
					vm.jan.push(value);
				} else if (/(.*)-02-(.*)/.test(value.data)){
					vm.fev.push(value);
				} else if (/(.*)-03-(.*)/.test(value.data)){
					vm.mar.push(value);
				} else if (/(.*)-04-(.*)/.test(value.data)){
					vm.abr.push(value);
				} else if (/(.*)-05-(.*)/.test(value.data)){
					vm.mai.push(value);
				} else if (/(.*)-06-(.*)/.test(value.data)){
					vm.jun.push(value);
				} else if (/(.*)-07-(.*)/.test(value.data)){
					vm.jul.push(value);
				} else if (/(.*)-08-(.*)/.test(value.data)){
					vm.ago.push(value);
				} else if (/(.*)-09-(.*)/.test(value.data)){
					vm.set.push(value);
				} else if (/(.*)-10-(.*)/.test(value.data)){
					vm.out.push(value);
				} else if (/(.*)-11-(.*)/.test(value.data)){
					vm.nov.push(value);
				} else if (/(.*)-12-(.*)/.test(value.data)){
					vm.dez.push(value);
				}
			})		

			vm.labels_alerta_unidade = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

			vm.data_alerta_unidade = [
				[vm.jan.length, vm.fev.length, vm.mar.length, vm.abr.length, vm.mai.length, vm.jun.length, vm.jul.length, vm.ago.length, vm.set.length, vm.out.length, vm.nov.length, vm.dez.length]
			];

		}, function (error) {
			console.log("Fail")
		})
	}

	// *** GRÁFICO DE ALERTAS POR TIPO GERAL *** // 

	vm.buscarAlertasTipoGraficoDashboard = function() {
		vm.user_cooperativa = auth.getUser().cooperativa
		vm.user_pa = auth.getUser().pa
		vm.user_id = auth.getUser()._id    
		vm.user_nivel = auth.getUser().nivel  
		const url = `${consts.apiUrl}/alertas/buscarAlertasAnoGraficoDashboard/${vm.user_cooperativa}/${vm.user_pa}/${vm.user_nivel}`
		$http.post(url)
		.then(function(resp) {
			vm.suspeitos = []
			vm.veiculos = []
			vm.alertasTipo = resp.data

			angular.forEach(vm.alertasTipo, function(value, key){
				if (/Suspeito/.test(value.tipoAlerta)){
					vm.suspeitos.push(value);
				} else if (/Veículo/.test(value.tipoAlerta)){
					vm.veiculos.push(value);
				}
			})		

			vm.labels_alerta_tipo_geral = ["Suspeitos", "Veículos"];
			vm.data_alerta_tipo_geral = [vm.suspeitos.length,vm.veiculos.length];
			vm.colors_alerta_tipo_geral = [{
			      backgroundColor: 'rgba(87, 199, 212, 0.7)',
			      pointBackgroundColor: 'rgb(87, 199, 212)',
			      pointHoverBackgroundColor: 'rgb(87, 199, 212)',
			      borderColor: 'rgb(87, 199, 212)',
			      pointBorderColor: '#fff',
			      pointHoverBorderColor: 'rgb(87, 199, 212)'
			    },{
			      backgroundColor: 'rgba(70, 190, 138, 0.7)',
			      pointBackgroundColor: 'rgb(70, 190, 138)',
			      pointHoverBackgroundColor: 'rgb(70, 190, 138)',
			      borderColor: 'rgb(70, 190, 138)',
			      pointBorderColor: '#fff',
			      pointHoverBorderColor: 'rgb(70, 190, 138)'
			    }
			  ]
			vm.options_alerta_tipo_geral = {
				legend: {
					display: true,
					position: 'right'
				}
			}

		}, function (error) {
			console.log("Fail")
		})
	} 
	
	vm.buscarAlertasTipoGraficoDashboard()

	// *** GRÁFICO DE ALERTAS POR TIPO POR UNIDADES *** // 

	vm.buscarAlertasTipoGraficoUnidade = function(parametro) {
		vm.user_nivel = auth.getUser().nivel  
		const url = `${consts.apiUrl}/alertas/buscarAlertasAnoGraficoUnidade/${vm.user_nivel}/${parametro}`
		$http.post(url)
		.then(function(resp) {
			vm.suspeitos = []
			vm.veiculos = []
			vm.alertasTipoUnidade = resp.data

			angular.forEach(vm.alertasTipoUnidade, function(value, key){
				if (/Suspeito/.test(value.tipoAlerta)){
					vm.suspeitos.push(value);
				} else if (/Veículo/.test(value.tipoAlerta)){
					vm.veiculos.push(value);
				}
			})		

			vm.labels_alerta_tipo_unidade = ["Suspeitos", "Veículos"];
			vm.data_alerta_tipo_unidade = [vm.suspeitos.length,vm.veiculos.length];
			vm.colors_alerta_tipo_unidade = [{
			      backgroundColor: 'rgba(87, 199, 212, 0.7)',
			      pointBackgroundColor: 'rgb(87, 199, 212)',
			      pointHoverBackgroundColor: 'rgb(87, 199, 212)',
			      borderColor: 'rgb(87, 199, 212)',
			      pointBorderColor: '#fff',
			      pointHoverBorderColor: 'rgb(87, 199, 212)'
			    },{
			      backgroundColor: 'rgba(70, 190, 138, 0.7)',
			      pointBackgroundColor: 'rgb(70, 190, 138)',
			      pointHoverBackgroundColor: 'rgb(70, 190, 138)',
			      borderColor: 'rgb(70, 190, 138)',
			      pointBorderColor: '#fff',
			      pointHoverBorderColor: 'rgb(70, 190, 138)'
			    }
			  ]
			vm.options_alerta_tipo_unidade = {
				legend: {
					display: true,
					position: 'right'
				}
			}
		}, function (error) {
			console.log("Fail")
		})
	} 

	//MAPAS

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

	vm.buscaLatLong2 = function() {
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

	angular.extend(vm, { // EXTENDE AS PROPRIEDADES DO MAP (MARCADORES, LOCALIZAÇÃO INCIAL..)
	center2: { // LOCALIZAÇÃO INICIAL  .
		lat: -27.226548,
		lng: -52.018311,
		zoom: 9
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

	vm.ajustarMapa = function() {
		vm.buscaLatLong()
		leafletData.getMap().then(function(map) {
			setTimeout(function() {
				map.invalidateSize();
				map._resetView(map.getCenter(), map.getZoom(), true);   
				map.fire('layeradd', {layer: this});

			}, 200);
		});
	};

	vm.ajustarMapa()

}
