console.log("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓");
console.log("┃                CodeTimeTracker 1.0.0                ┃");
console.log("┠─────────────────────────────────────────────────────┨");
console.log("┃ github.com/victoreduardobarreto/CodeTimeTracker.git ┃");
console.log("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛");
/**
 * { function for verify if exists some data in array of objects }
 *
 * @param      {<array>}  arraySearch  The array search
 * @param      {<str>}  key        The key
 * @param      {<str>}  value      The value
 * @return     {int or null}  { if true return is id of array, if false return null }
 */
 function findValue(arraySearch, key, value) {

 	for (let i = 0; i < arraySearch.length; i++) {

 		if (arraySearch[i][key] == value) {
 			return i;
 		}
 	}
 	return null;
 }

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

// call the refresh (ms)
window.setInterval(refresh, 180000);


/**
* { function for refresh the page }
*/
function refresh() {
	location.reload();
}

/**
* { function to do collpase}
*/
$(function () {
	$('[data-tooltip="tooltip"]').tooltip()
});


/**
* { filter to appear only numbers }
*
* @param      {<string>}   e       { characters }
* @return     {boolean}  { true for number, false to letters  }
*/
function onlyNumber(e){

	let key=(window.event)?event.keyCode:e.which;

	if (key>47 && key<58) {

		return true;
	} else{

		if (key==8 || key==0) {

			return true;
		}else {

			return false;
		}
	}
};

/**
* Function to save changes of graphics
*/
function saveChanges() {

	// set data in local storage to use after refresh
	sessionStorage.setItem('day', $('#inpDay').val());
	sessionStorage.setItem('dayTech', $('#inpDayTech').val());
	sessionStorage.setItem('techProj', $('#inpTechProj').val());
	sessionStorage.setItem('month', $('#inpMonth').val());
	sessionStorage.setItem('year', $('#inpYear').val());

	// close modal and reload the page
	$('#confModal').modal('hide').delay(250);
	location.reload();
};