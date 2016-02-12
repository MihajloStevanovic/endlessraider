var endlessRaider = function(){

	var raiderUI = {

		/*
		 * Manage navigation panel
		 */
		navigation: function(){
			console.log('ready');
		},

		/*
		 * UI functions initialization
		 */
		init: function(){
			this.navigation();
		}

	}

	$(document).ready(function(){
		raiderUI.init();
	})

}

