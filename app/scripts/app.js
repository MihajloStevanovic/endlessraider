/* Endless raider application
 * @version: 3.0.0
 * @author : Sieg
 * @url : http://www.endlessfr.com
 */
var endlessRaider = {

	/* Global App variables */
	config: {
		player: {},
		events: {},
		games: {},
		players: {},
		route: 'home',
		modal: null
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
	/* Append the calendar template */
	raiderCalender: function(){
		$('.content').append('<div class="raiderCalendar"></div>');
		$('.raiderCalendar').fullCalendar({
		    header: {
		    	left: '',
				center: 'title'
		    },
		    events: endlessRaider.config.calendar
		})
	},
	/* Get the calendar informations */
	getCalendarDatas: function(){
		var calendarDatas = $.getJSON( "datas/calendar.json", function(data) {
		})
		.done(function(data) {
			endlessRaider.config.calendar = data;
		})
		.fail(function() {
			console.log( "calendar error" );
		})
		calendarDatas.complete(function() {
			endlessRaider.raiderCalender();
		});
	},
	/* Get current player informations */
	getPLayerInfos: function(){
		var playerInfos = $.getJSON( "datas/player.json", function(data) {
		})
		.done(function(data) {
			endlessRaider.config.player = data;
		})
		.fail(function() {
			console.log( "Player error" );
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
			$('.sub-menu').append('<li><a href="#" class="route-link" data-route="events">Events</a></li>'+
				'<li><a href="#" class="route-link" data-route="players">Players</a></li>'+
				'<li><a href="#" class="route-link" data-route="games">Games</a></li>');
		} else if(endlessRaider.config.player.rules === "Write"){
			$('.sub-menu').append('<li><a href="#" class="route-link" data-route="events">Events</a></li>');
		} else {
			return false;
		}
	},
	/* Get events list */
	getEventsList: function(){
		var eventsList = $.getJSON( "datas/events-list.json", function(data) {
		})
		.done(function(data) {
			endlessRaider.config.events = data;
			console.log(endlessRaider.config.events);
		})
		.fail(function() {
			console.log( "Events error" );
		})
		eventsList.complete(function() {
			endlessRaider.eventsRender(endlessRaider.config.events);
		});
	},
	/* Get games list */
	getGamesList: function(){
		var gamesList = $.getJSON( "datas/games-list.json", function(data) {
		})
		.done(function(data) {
			endlessRaider.config.games = data;
		})
		.fail(function() {
			console.log( "Events error" );
		})
		gamesList.complete(function() {
			endlessRaider.gamesRender(endlessRaider.config.games);
		});
	},
	/* Get players list */
	getPlayersList: function(){
		var playersList = $.getJSON( "datas/players-list.json", function(data) {
		})
		.done(function(data) {
			endlessRaider.config.players = data;
		})
		.fail(function() {
			console.log( "Events error" );
		})
		playersList.complete(function() {
			endlessRaider.playersRender(endlessRaider.config.players);
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
					'<button class="route-link edit" data-route="event-edit" data-event-id="'+events[event].id+'"><i class="fa fa-pencil-square-o"></i> Edit</button>'+
					'<button class="modal-link remove" data-modal="event-remove" data-event-id="'+events[event].id+'"><i class="fa fa-times-circle"></i> remove</button></div>'+
			'</div>');
		}
		$('.content').append('<div class=""><button class="route-link add" data-route="event-add">create new</button></div>');
	},
	/* Append the games list template */
	gamesRender: function(games){
		for(game in games){
			$('.content').append('<div class="row list-item">'+
				'<div class="float-left col-8">'+games[game].name+'</div>'+
				'<div class="float-left col-4">'+
					'<button class="route-link edit" data-route="game-edit" data-game-id="'+games[game].id+'"><i class="fa fa-pencil-square-o"></i> Edit</button>'+
					'<button class="modal-link remove" data-modal="game-remove" data-game-id="'+games[game].id+'"><i class="fa fa-times-circle"></i> remove</button></div>'+
			'</div>');
		}
		$('.content').append('<div class=""><button class="route-link add" data-route="game-add">create new</button></div>');
	},
	/* Append the players list template */
	playersRender: function(players){
		for(player in players){
			$('.content').append('<div class="row list-item">'+
				'<div class="float-left col-8">'+players[player].name+'</div>'+
				'<div class="float-left col-4">'+
					'<button class="route-link edit" data-route="player-edit" data-player-id="'+players[player].id+'"><i class="fa fa-pencil-square-o"></i> Edit</button>'+
					'<button class="modal-link remove" data-modal="player-remove" data-player-id="'+players[player].id+'"><i class="fa fa-times-circle"></i> remove</button></div>'+
			'</div>');
		}
		$('.content').append('<div class=""><button class="route-link add" data-route="player-add">create new</button></div>');
	},
	/* Append the player edition template */
	playerEdit: function(playerId){
		for(player in endlessRaider.config.players){
			var currentEditPlayer = endlessRaider.config.players[player];
			if(currentEditPlayer.id == playerId){
				$('.content').append('<form>'+
					'<div>name: '+currentEditPlayer.name+'</div>'+
					'<div>rules:</div>'+
					'<select>'+
						'<option>Read</option>'+
						'<option>Write</option>'+
						'<option>All</option>'+
					'</select>'+
					'<input type="submit" value="Apply">'+
				'</form>');
			}
		}
	},
	/* Append the game edition template */
	gameEdit: function(gameId){
		for(game in endlessRaider.config.games){
			var currentEditGame = endlessRaider.config.games[game];
			if(currentEditGame.id == gameId){
				$('.content').append('<form>'+
					'<div>'+
						'<label>name:</label>'+
						'<input type="text" value="'+currentEditGame.name+'" />'+
					'</div>'+
					'<input type="submit" value="Apply">'+
				'</form>');
			}
		}
	},
	/* Append the event edition template */
	eventEdit: function(eventId){
		for(event in endlessRaider.config.events){
			var currentEditEvent = endlessRaider.config.events[event];
			if(currentEditEvent.id == eventId){
				$('.content').append('<form>'+
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
					'<input type="submit" value="Apply">'+
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
						'<button>Confirm</button>'+
						'<button class="modal-cancel modal-closer">Cancel</button>'+
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
						'<button>Confirm</button>'+
						'<button class="modal-cancel modal-closer">Cancel</button>'+
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
						'<button>Confirm</button>'+
						'<button class="modal-cancel modal-closer">Cancel</button>'+
					'</div>');
			}
		}
	},
	/* Init the functions */
	init: function(){
		this.getPLayerInfos();
		this.eventsListener();
		this.raiderRouter();
	}
}

$(document).ready(function(){
	endlessRaider.init()
})