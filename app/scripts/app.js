var endlessRaider = function(){

	var raiderUI = {

		/*
		 * Manage navigation panel
		 */
		navigation: function(){
			$('.nav a').on('click',function(){
				$('.nav a').removeClass('active');
				$(this).toggleClass('active');
				$(this).next().slideToggle();
			});
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
endlessRaider();

