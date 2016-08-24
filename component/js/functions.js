console.log("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓");
console.log("┃                CodeTimeTracker 1.0.0                ┃");
console.log("┠─────────────────────────────────────────────────────┨");
console.log("┃ github.com/victoreduardobarreto/CodeTimeTracker.git ┃");
console.log("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛");


/**
 * { function for show or hidden the title }
 */
 $(window).scroll(function(){

 	let top = $(window).scrollTop();

 	if(top > 60){

 		$('#subMenu').stop().fadeIn(100);
 		$('.navbar-fixed-top').css('padding-top', 0);

 	}else{

 		$('#subMenu').stop().fadeOut(0);
 		$('.navbar-fixed-top').css('padding-top', '75px');
 	}
 });