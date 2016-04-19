/* Endless raider application
 * @version: 3.0.0
 * @author : Sieg
 * @url : http://www.endlessfr.com
 */
var endlessRaider = {

	/* Global App variables */
	config: {
		status: false,
		player: {},
		events: {},
		games: {},
		players: {},
		route: 'home',
		modal: null
	},

	services: {
		getStatus: undefined,
		getAllEvents: undefined,
		getListJeux: undefined,
		getAllJoueurs: undefined
	},

	/* Manage the events */
	eventsListener: function(){
		$('.menu-category').on('click',function(e){
			e.preventDefault();
			$('.sub-menu').slideUp();
			$(this).next().slideDown();
			$('.nav a').removeClass('active');
			$(this).addClass('active');
		});
		$('body').on('click','.route-link',function(e){
			e.preventDefault();
			route = this.getAttribute('data-route');
			if(route !== endlessRaider.config.route){
				endlessRaider.removeContent();
				endlessRaider.config.route = route;
			}else{
				return false;
			}
			endlessRaider.raiderRouter(this);
		});
		$('body').on('click','.modal-link',function(e){
			e.preventDefault();
			modal = this.getAttribute('data-modal');
				endlessRaider.config.modal = modal;
			endlessRaider.modalRouter(this);
		});
	},
	/* Manage the current route functions
	 * @params: route
	 */
	raiderRouter: function(link){
		switch(endlessRaider.config.route){
			case 'home':
				this.getCalendarDatas();
			break;
			case 'profile':
				endlessRaider.profileRender();
			break;
			case 'events':
				this.getEventsList();
			break;
			case 'games':
				this.getGamesList();
			break;
			case 'players':
				this.getPlayersList();
			break;
			case 'player-edit':
				var playerId = link.getAttribute('data-player-id');
				this.playerEdit(playerId);
			break;
			case 'game-edit':
				var gameId = link.getAttribute('data-game-id');
				this.gameEdit(gameId);
			break;
			case 'event-edit':
				var eventId = link.getAttribute('data-event-id');
				this.eventEdit(eventId);
			break;
			case 'player-add':
				var tplUrl = 'tpl/createPlayer.html';
				this.createTemplate(tplUrl);
			break;
			case 'game-add':
				var tplUrl = 'tpl/createGame.html';
				this.createTemplate(tplUrl);
			break;
			case 'event-add':
				var tplUrl = 'tpl/createEvent.html';
				this.createTemplate(tplUrl);
			break;

			/*
			 * @TODO: Subscribe to an event
			 * @TODO: Unsubscribe to an event
			 */
		}
	},
	modalRouter:function(modal){
		switch(endlessRaider.config.modal) {
			case 'event-remove':
				var eventId = modal.getAttribute('data-event-id');
				this.modal();
				this.eventRemove(eventId);
			break;
			case 'game-remove':
				var gameId = modal.getAttribute('data-game-id');
				this.modal();
				this.gameRemove(gameId);
			break;
			case 'player-remove':
				var playerId = modal.getAttribute('data-player-id');
				this.modal();
				this.playerRemove(playerId);
			break;
		}
	},
	getEventModal: function(calEvent){
		console.log(calEvent);
		this.modal(calEvent);
		$('.modal-content').append('<h2>'+calEvent.title+'</h2>'+
		'<div class="event-date">Date : '+calEvent._start._i.split(':')[0]+'</div>'+
		'<div class="event-hour">Heure : '+calEvent._start._i.split(':')[1]+'</div>');
		$('.modal-content').append('<div class="event-players">'+
			'<h3>Participants :</h3>'+
			'<ul></ul>'+
		'</div>');
		for (player in calEvent.players){
			$('.event-players').append('<li>'+calEvent.players[player]+'</li>');
		}
		$('.modal-content').append('<div>'+
			'<button>S\'inscrire</button>'+
			'<button class="modal-cancel modal-closer">Annuler</button>'+
		'</div>');
	},
	/* Append the calendar template */
	raiderCalender: function(){
		$('.content').append('<div class="raiderCalendar"></div>');
		$('.raiderCalendar').fullCalendar({
		    header: {
		    	left: '',
				center: 'title'
		    },
		    events: endlessRaider.config.calendar,
		    eventClick: function(calEvent){
		    	endlessRaider.getEventModal(calEvent);
		    },
		})
	},
	/* Get the calendar informations */
	getCalendarDatas: function(){
		var calendarDatas = $.getJSON( endlessRaider.services.getCalendarDatas, function(data) {
		})
		.done(function(data) {
			endlessRaider.config.calendar = data;
		})
		.fail(function() {
			console.log( 'calendar error' );
		})
		calendarDatas.complete(function() {
			endlessRaider.raiderCalender();
		});
	},
	/* Get user status */
	getUserStatus: function(){
		var userStatus = $.getJSON( endlessRaider.services.getStatus, function(data) {
		})
		.done(function(data) {
			endlessRaider.config.status = data.success;
			endlessRaider.config.player = data.user;
		})
		.fail(function() {
			console.log( 'connect request failed' );
		})
		userStatus.complete(function(data) {
			if(endlessRaider.config.status === 'true'){
				console.log( 'You are connected' );
				//endlessRaider.getPLayerInfos(data);
				endlessRaider.eventsListener();
				endlessRaider.raiderRouter();
				endlessRaider.navigationElements();
				endlessRaider.submit();
				endlessRaider.loader();
			} else {
				console.log( 'Your are not connected' );
			}
		});
	},
	/* Get current player informations */
	getPLayerInfos: function(){
		var playerInfos = $.getJSON( endlessRaider.services.getPlayerInfos, function(data) {
		})
		.done(function(data) {
			endlessRaider.config.player = data;
			console.log( 'Player informations loaded' );
		})
		.fail(function() {
			console.log( 'Player informations request failed' );
		})
		playerInfos.complete(function() {
			endlessRaider.navigationElements();
			endlessRaider.loader();
		});
	},
	loader: function(){
		$('.loader').fadeOut(function(){
			$(this).remove();
		})
	},
	/* Manage the navigation rules */
	navigationElements: function(){
		if(endlessRaider.config.player.rules === "All"){
			$('.sub-menu').append('<li><a href="#" class="route-link" data-route="events">Evénements</a></li>'+
				'<li><a href="#" class="route-link" data-route="players">Joueurs</a></li>'+
				'<li><a href="#" class="route-link" data-route="games">Jeux</a></li>');
		} else if(endlessRaider.config.player.rules === "Write"){
			$('.sub-menu').append('<li><a href="#" class="route-link" data-route="events">Evénements</a></li>');
		} else {
			return false;
		}
	},
	/* Get events list */
	getEventsList: function(){
		var eventsList = $.ajax( endlessRaider.services.getAllEvents, function(data) {
		})
		.done(function(data) {
			endlessRaider.config.events = data;
		})
		.fail(function() {
			console.log( 'Events error' );
		})
		eventsList.complete(function() {
			endlessRaider.eventsRender(endlessRaider.config.events);
		});
	},
	/* Get games list */
	getGamesList: function(){
		var gamesList = $.ajax( endlessRaider.services.getListJeux, function(data) {
		})
		.done(function(data) {
			endlessRaider.config.games = data;
		})
		.fail(function() {
			console.log( 'Games error' );
		})
		gamesList.complete(function() {
			endlessRaider.gamesRender(endlessRaider.config.games);
		});
	},
	/* Get players list */
	getPlayersList: function(){
		var playersList = $.ajax( endlessRaider.services.getAllJoueurs, function(data) {
		})
		.done(function(data) {
			endlessRaider.config.players = data;
		})
		.fail(function() {
			console.log( 'Players error' );
		})
		playersList.complete(function() {
			endlessRaider.playersRender(endlessRaider.config.players);
		});
	},
	getServices: function(){
		$.get('datas/services.json', function(data){
		})
		.done(function(data){
			endlessRaider.services.getStatus = data.connectJoueur;
			endlessRaider.services.getPlayerInfos = data.getJoueur;
			endlessRaider.services.getCalendarDatas = data.getAllEvents;
			endlessRaider.services.getAllEvents = data.getAllEvents;
			endlessRaider.services.getListJeux = data.getListJeux;
			endlessRaider.services.getAllJoueurs = data.getAllJoueurs;

			// To remove
			endlessRaider.services.getStatus = 'datas/status.json';
			endlessRaider.services.getPlayerInfos = 'datas/player.json';
			endlessRaider.services.getCalendarDatas = 'datas/calendar.json';
			endlessRaider.services.getAllEvents = 'datas/events-list.json';
			endlessRaider.services.getListJeux = 'datas/games-list.json';
			endlessRaider.services.getAllJoueurs = 'datas/players-list.json';

			endlessRaider.getUserStatus();
		})
		.fail(function(){
			console.log('services error !');
		});
	},
	/* Remove the current content */
	removeContent: function(){
		$('.content *').remove();
	},
	/* Append the profile template */
	profileRender: function(){
		$('.content').append('<div>'+
			'<div>name: '+endlessRaider.config.player.name+'</div>'+
			'<div>rules: '+endlessRaider.config.player.rules+'</div>'+
		'</div>');
	},
	/* Append the events list template */
	eventsRender: function(events){
		for(event in events){
			$('.content').append(''+
				'<div class="row list-item">'+
				'<div class="float-left col-8">'+events[event].name+'</div>'+
				'<div class="float-left col-4">'+
					'<button class="route-link edit" data-route="event-edit" data-event-id="'+events[event].id+'"><i class="fa fa-pencil-square-o"></i> Editer</button>'+
					'<button class="modal-link remove" data-modal="event-remove" data-event-id="'+events[event].id+'"><i class="fa fa-times-circle"></i> Supprimer</button></div>'+
			'</div>');
		}
		$('.content').append('<div class=""><button class="route-link add" data-route="event-add">Ajouter</button></div>');
	},
	/* Append the games list template */
	gamesRender: function(games){
		for(game in games){
			$('.content').append('<div class="row list-item">'+
				'<div class="float-left col-8">'+games[game].name+'</div>'+
				'<div class="float-left col-4">'+
					'<button class="route-link edit" data-route="game-edit" data-game-id="'+games[game].id+'"><i class="fa fa-pencil-square-o"></i> Editer</button>'+
					'<button class="modal-link remove" data-modal="game-remove" data-game-id="'+games[game].id+'"><i class="fa fa-times-circle"></i> Supprimer</button></div>'+
			'</div>');
		}
		$('.content').append('<div class=""><button class="route-link add" data-route="game-add">Ajouter</button></div>');
	},
	/* Append the players list template */
	playersRender: function(players){
		for(player in players){
			$('.content').append('<div class="row list-item">'+
				'<div class="float-left col-8">'+players[player].name+'</div>'+
				'<div class="float-left col-4">'+
					'<button class="route-link edit" data-route="player-edit" data-player-id="'+players[player].id+'"><i class="fa fa-pencil-square-o"></i> Editer</button>'+
					'<button class="modal-link remove" data-modal="player-remove" data-player-id="'+players[player].id+'"><i class="fa fa-times-circle"></i> Supprimer</button></div>'+
			'</div>');
		}
		$('.content').append('<div class=""><button class="route-link add" data-route="player-add">Ajouter</button></div>');
	},
	/* Append the player edition template */
	playerEdit: function(playerId){
		for(player in endlessRaider.config.players){
			var currentEditPlayer = endlessRaider.config.players[player];
			if(currentEditPlayer.id == playerId){
				$('.content').append('<form type="player">'+
					'<div>name: '+currentEditPlayer.name+'</div>'+
					'<div>rules:</div>'+
					'<select class="player-rules">'+
						'<option>Read</option>'+
						'<option>Write</option>'+
						'<option>All</option>'+
					'</select>'+
					'<input class="submit" type="submit" value="Modifier">'+
				'</form>');
			}
		}
	},
	/* Append the game edition template */
	gameEdit: function(gameId){
		for(game in endlessRaider.config.games){
			var currentEditGame = endlessRaider.config.games[game];
			if(currentEditGame.id == gameId){
				$('.content').append('<form type="game">'+
					'<div>'+
						'<label>name:</label>'+
						'<input class="game-name" type="text" value="'+currentEditGame.name+'" />'+
					'</div>'+
					'<input class="submit" type="submit" value="Modifier">'+
				'</form>');
			}
		}
	},
	/* Append the event edition template */
	eventEdit: function(eventId){
		for(event in endlessRaider.config.events){
			var currentEditEvent = endlessRaider.config.events[event];
			if(currentEditEvent.id == eventId){
				$('.content').append('<form type="event">'+
					'<div>'+
						'<label>name:</label>'+
						'<input type="text" value="'+currentEditEvent.name+'" />'+
					'</div>'+
					'<div>'+
						'<label>type:</label>'+
						'<input type="text" value="'+currentEditEvent.type+'" />'+
					'</div>'+
					'<div>'+
						'<label>game:</label>'+
						'<input type="text" value="'+currentEditEvent.game+'" />'+
					'</div>'+
					'<div>'+
						'<label>date:</label>'+
						'<input type="date" value="'+currentEditEvent.date+'" />'+
					'</div>'+
					'<div>'+
						'<label>hour:</label>'+
						'<input type="time" value="'+currentEditEvent.hour+'" />'+
					'</div>'+
					'<input class="submit" type="submit" value="Modifier">'+
				'</form>');
			}
		}
	},
	/* Template for new event creation*/
	createTemplate: function(type){
		var url = type;
		var tpl = $.ajax(url)
		.done(function(data){
			$('.content').append(data)
		})
	},
	modal: function(){
		$('.modal-overlay').fadeIn(400);
		$('.modal-wrapper').addClass('open');

		$('body').on('click','.modal-closer',function(){
			$('.modal-wrapper').removeClass('open');
			$('.modal-overlay').fadeOut(400,function(){
				$('.modal-content *').remove();
			});
		})
	},
	eventRemove: function(eventId){
		for(event in endlessRaider.config.events){
			var currentRemoveEvent = endlessRaider.config.events[event];
			if(currentRemoveEvent.id == eventId){
				$('.modal-content').append('<h2>Delete the game ?</h2>'+
					'<h3>'+endlessRaider.config.events[event].name+'</h3>'+
					'<div>'+
						'<button>Confirmer</button>'+
						'<button class="modal-cancel modal-closer">Annuler</button>'+
					'</div>');
			}
		}
	},
	gameRemove: function(gameId){
		for(game in endlessRaider.config.games){
			var currentRemoveGame = endlessRaider.config.games[game];
			if(currentRemoveGame.id == gameId){
				$('.modal-content').append('<h2>Delete this game ?</h2>'+
					'<h3>'+endlessRaider.config.games[game].name+'</h3>'+
					'<div>'+
						'<button>Confirmer</button>'+
						'<button class="modal-cancel modal-closer">Annuler</button>'+
					'</div>');
			}
		}
	},
	playerRemove: function(playeId){
		for(player in endlessRaider.config.players){
			var currentRemoveEvent = endlessRaider.config.players[player];
			if(currentRemoveEvent.id == playeId){
				$('.modal-content').append('<h2>Delete this player ?</h2>'+
					'<h3>'+endlessRaider.config.players[player].name+'</h3>'+
					'<div>'+
						'<button>Confirmer</button>'+
						'<button class="modal-cancel modal-closer">Annuler</button>'+
					'</div>');
			}
		}
	},
	submit : function(){
		$('body').on('click','.submit',function(e){
			e.preventDefault();
			var form = $(this).parent('form'),
				type = $(form).attr('type');
			endlessRaider.getSubmitType(form,type);
		});
	},
	getSubmitType: function(form,type){
		switch(type){
			case 'player':
				var rules = $(form).find('.player-rules').val();
				console.log(rules);
				if(rules !== ''){
					endlessRaider.getSubmitUri(type,rules);
				}
				
			break;
			case 'game':
				var name = $(form).find('.game-name').val();
				console.log(name);
				if(name !== ''){
					endlessRaider.getSubmitUri(type);
				}
			break;
			case 'event':
			break;
			default:
			// Nothing
		}
	},
	getSubmitUri: function(type,param){
		var uri;
		switch(type){
			case 'player':
				uri = endlessRaider.services.getPlayerEdit;
			break;
			case 'game':
				uri = endlessRaider.services.getGameEdit;
			break;
			case 'event':
				uri = endlessRaider.services.getEventEdit;
				endlessRaider.submitForm(uri,param);
			break;
			default:
			// Nothing
		}
	},
	submitForm: function(uri,param){
		$.post( uri, {data:param})
		.done(function() {
			console.log('Request completed')
		})
		.fail(function() {
			console.log('Request failed')
		})
		.always(function() {
			console.log('Request finished')
		});
	},
	/* Init the functions */
	init: function(){
		this.getServices();
	}
}

$(document).ready(function(){
	endlessRaider.init()
})