/* Endless raider application
 * @version: 3.0.0
 * @author : Sieg
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
		$('.nav a').on('click',function(){
			endlessRaider.navigation();
		});
		

		var routeHandler = document.getElementsByClassName('route-link');
		routeHandler.addEventListener('click', function(){
			route = routeHandler.getAttribute('data-route');
			if(route !== endlessRaider.config.route){
				endlessRaider.removeContent();
				endlessRaider.raiderRouter()
				endlessRaider.config.route = route;
			}else{
				return false;
			}
		},true);
		
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
	raiderRouter: function(){
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
			case 'edit-player':
				this.editPlayer();
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
			$('.content').append('<div>'+events[event].name+'</div>');
		}
	},
	/* Append the games list template */
	gamesRender: function(games){
		for(game in games){
			$('.content').append('<div>'+games[game].name+'</div>');
		}
	},
	/* Append the players list template */
	playersRender: function(players){
		for(player in players){
			$('.content').append('<div>'+players[player].name+'<button class="edit-player">Edit</buttons</div>');
		}
	},
	editPlayer: function(){
		$('.content').append('<div>'+
			'<div>name: '+endlessRaider.config.player.name+'</div>'+
			'<div>rules: <select>'+
			'<option>Read</option>'+
			'<option>Write</option>'+
			'<option>All</option>'+
			'</section></div>'+
		'</div>');
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