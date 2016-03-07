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
		route: 'home'
	},

	/* Manage the events */
	eventsListener: function(){
		$('.menu-category').on('click',function(){
			$('.sub-menu').slideUp();
			$(this).next().slideDown();
			$('.nav a').removeClass('active');
			$(this).addClass('active');
		});
		$('body').on('click','.route-link',function(){
			route = this.getAttribute('data-route');
			if(route !== endlessRaider.config.route){
				endlessRaider.removeContent();
				endlessRaider.config.route = route;
			}else{
				return false;
			}
			endlessRaider.raiderRouter(this);
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
			case 'event-remove':
				var type = 'event';
				this.modal();
				this.eventRemove(type);
			break;

			/*
			 * @TODO: Subscribe to an event
			 * @TODO: Unsubscribe to an event
			 */
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
			console.log(endlessRaider.config.player);
		});
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
			$('.content').append('<div class="row list-item">'+
				'<div class="float-left col-4">'+events[event].name+'</div>'+
				'<div class="float-left col-4">'+
					'<button class="route-link edit" data-route="event-edit" data-event-id="'+events[event].id+'">Edit</button>'+
					'<button class="route-link remove" data-route="event-remove" data-event-id="'+events[event].id+'">remove</button></div>'+
			'</div>');
		}
		$('.content').append('<div class=""><button class="route-link add" data-route="event-add">create new</button></div>');
	},
	/* Append the games list template */
	gamesRender: function(games){
		for(game in games){
			$('.content').append('<div class="row list-item">'+
				'<div class="float-left col-4">'+games[game].name+'</div>'+
				'<div class="float-left col-4">'+
					'<button class="route-link edit" data-route="game-edit" data-game-id="'+games[game].id+'">Edit</button>'+
					'<button class="route-link remove" data-route="game-remove" data-game-id="'+games[game].id+'">remove</button></div>'+
			'</div>');
		}
		$('.content').append('<div class=""><button class="route-link add" data-route="game-add">create new</button></div>');
	},
	/* Append the players list template */
	playersRender: function(players){
		for(player in players){
			$('.content').append('<div class="row list-item">'+
				'<div class="float-left col-4">'+players[player].name+'</div>'+
				'<div class="float-left col-4">'+
					'<button class="route-link edit" data-route="player-edit" data-player-id="'+players[player].id+'">Edit</button>'+
					'<button class="route-link remove" data-route="player-remove" data-player-id="'+players[player].id+'">remove</button></div>'+
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
		$('.modal-overlay').fadeIn(200,function(){
			
		});
		$('.modal-wrapper').addClass('open');
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