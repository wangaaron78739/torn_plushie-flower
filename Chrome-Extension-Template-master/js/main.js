/*
** file: js/main.js
** description: javascript code for "html/main.html" page
*/

function init_main () {
    $('html').hide().fadeIn('slow');
    //camel, chamois, jaguar, (kitten), lion, monkey, nessie, panda, red fox, (sheep), stingray, (teddy) ,wolverine
    var plushPrice = ["384","273","258","281","269","266","274","268","618","261"];
    //var plushPrice = ["260","264","282","277","276","271","272","263","267","385","617"];
    var minPrice =[]
    var bazaarID = [];
    var arrayLength = plushPrice.length;
    var raw = [];

    function fetchNext(ID) {
    	if (ID >= arrayLength) return findingMin();
    	return fetch('https://api.torn.com/market/'+ plushPrice[ID] +'?selections=bazaar&key=MkWouG6i6CXrWt8H')
	  	.then(
	    function(response) {
	      if (response.status !== 200) {
	        console.log('Looks like there was a problem. Status Code: ' +
	          response.status);
	        return;
	      }
	      // Examine the text in the response
	      response.json().then(function(data) {
	      	raw.push(data);
	      	fetchNext(ID+1)
	      });
	    }
	  )
	  .catch(function(err) {
	    console.log('Fetch Error :-S', err);
	  });
    }
    fetchNext(0);
    function findingMin(){
	    for (var i=0;i<arrayLength;i++) {
	    	var minCost = 1000000;
	    	for (var j=0;j<Object.keys(raw[i].bazaar).length;j++) {
	    		var tempCost = raw[i].bazaar[Object.keys(raw[i].bazaar)[j]].cost;
	    		if (tempCost < minCost) {
	    			minCost = tempCost;
	    		}
	    	}
	    	minPrice.push(minCost);
	    }
	    return findingSum();
	}
    function findingSum(){
    	var totalSum = minPrice.reduce((acc,reducer) => acc+reducer);
    	console.log(totalSum);
    	$("#total_plush_price").text(totalSum);
    }
}



//bind events to dom elements
document.addEventListener('DOMContentLoaded', init_main);