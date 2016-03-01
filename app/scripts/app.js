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

	/* Manage de navigation animation */
	navigation: function() {
		$('.nav a').on('click',function(e){
			e.preventDefault();
			$('.sub-menu').slideUp();
			$(this).next().slideDown();
			$('.nav a').removeClass('active');
			$(this).addClass('active');
		});
	},
	/* Manage the current route functions
	 * @params: route
	 */
	raiderRouter: function(link){
		switch(endlessRaider.config.route){
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
		}
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
			$('.content').append('<div>'+events[event].name+
				'<button class="route-link" data-route="event-edit" data-event-id="'+events[event].id+'">Edit</button>'+
			'</div>');
		}
	},
	/* Append the games list template */
	gamesRender: function(games){
		for(game in games){
			$('.content').append('<div>'+games[game].name+
				'<button class="route-link" data-route="game-edit" data-game-id="'+games[game].id+'">Edit</button>'+
			'</div>');
		}
	},
	/* Append the players list template */
	playersRender: function(players){
		for(player in players){
			$('.content').append('<div>'+players[player].name+
				'<button class="route-link" data-route="player-edit" data-player-id="'+players[player].id+'">Edit</button>'+
			'</div>');
		}
	},
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
						'<input type="text" value="'+currentEditEvent.date+'" />'+
					'</div>'+
					'<div>'+
						'<label>hour:</label>'+
						'<input type="text" value="'+currentEditEvent.hour+'" />'+
					'</div>'+
					'<input type="submit" value="Apply">'+
				'</form>');
			}
		}
	},
	/* Init the functions */
	init: function(){
		this.getPLayerInfos();
		this.eventsListener();
	}
}

$(document).ready(function(){
	endlessRaider.init()
})