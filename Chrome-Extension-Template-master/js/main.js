/*
** file: js/main.js
** description: javascript code for "html/main.html" page
*/

function init_main () {
    $('html').hide().fadeIn('slow');
    //camel, chamois, jaguar, (kitten), lion, monkey, nessie, panda, red fox, (sheep), stingray, (teddy) ,wolverine
    var plushPrice = ["384","273","258","281","269","266","274","268","618","261"];
    //var plushPrice = ["260","264","282","277","276","271","272","263","267","385","617"];
    var minPrice = {"384":1000000,"273":1000000,"258":1000000,"281":1000000,"269":1000000,"266":1000000,"274":1000000,"268":1000000,"618":1000000,"261":1000000};
    var arrayLength = plushPrice.length;
    var raw = {"384":null,"273":null,"258":null,"281":null,"269":null,"266":null,"274":null,"268":null,"618":null,"261":null};
    var bazaarID = {"384":0,"273":0,"258":0,"281":0,"269":0,"266":0,"274":0,"268":0,"618":0,"261":0};



    function findingSum(){
    	console.log(minPrice)
    	var totalSum = Object.keys(minPrice).reduce((total,reducer)=>total+minPrice[reducer],0)
    	console.log(totalSum);
    	$("#total_plush_price").text(totalSum);
    }
    function findingMin(){
		for (x in raw){
			var minCost = 1000000;
			for (y in raw[x].bazaar) {
				var tempCost = raw[x].bazaar[y].cost;
				if (tempCost < minCost) {
					minCost = tempCost;
					bazaarID[x] = y;
				}
			}
			minPrice[x] = minCost;
		} 
	    findingSum();
	    updatePrices();
	}
	function updatePrices(){
		for (x in minPrice) {
			console.log(x)
			$('#'+x).text(minPrice[x]);
			$('#'+x).attr("href", "https://www.torn.com/bazaar.php#/p=bazaar&userID="+bazaarID[x]);
		}
	}



    function fetchNext(ID) {
    	
    	return fetch('https://api.torn.com/market/'+ ID +'?selections=bazaar&key=MkWouG6i6CXrWt8H')
	  	.then(
	    function(response) {
	      if (response.status !== 200) {
	        console.log('Looks like there was a problem. Status Code: ' +
	          response.status);
	        return;
	      }
	      // Examine the text in the response
	      response.json().then(function(data) {
	      	raw[ID] = data;
	      	//console.log(data);
	      	//console.log(raw);
	      	var flag = 1;
	      	for (x in raw){
	      		//console.log(raw[x])
	      		if (raw[x] != null) continue;
	      		flag = 0;
	      	}
	      	if (flag) {
	      		findingMin();
	      	}
	      });
	    }
	  )
	  .catch(function(err) {
	    console.log('Fetch Error :-S', err);
	  });
    }
    
    for (var j=0;j<arrayLength;j++) {
    	fetchNext(plushPrice[j]);
    }

}



//bind events to dom elements
document.addEventListener('DOMContentLoaded', init_main);