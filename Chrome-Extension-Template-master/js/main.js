/*
** file: js/main.js
** description: javascript code for "html/main.html" page
*/

function init_main () {
    $('html').hide().fadeIn('slow');
    //camel, chamois, jaguar, (kitten), lion, monkey, nessie, panda, red fox, (sheep), stingray, (teddy) ,wolverine
    const plushID = ["384","273","258","281","269","266","274","268","618","261"];
    const flowerID = ["260","264","282","277","276","271","272","263","267","385","617"];
    var plush_raw = {"384":null,"273":null,"258":null,"281":null,"269":null,"266":null,"274":null,"268":null,"618":null,"261":null}
    var flower_raw = {"260":null,"264":null,"282":null,"277":null,"276":null,"271":null,"272":null,"263":null,"267":null,"385":null,"617":null};
    var bazaarPlushID = {"384":0,"273":0,"258":0,"281":0,"269":0,"266":0,"274":0,"268":0,"618":0,"261":0}
        
    var plush_minPrice = {"384":1000000,"273":1000000,"258":1000000,"281":1000000,"269":1000000,"266":1000000,"274":1000000,"268":1000000,"618":1000000,"261":1000000}
    var flower_minPrice = {"260":1000000,"264":1000000,"282":1000000,"277":1000000,"276":1000000,"271":1000000,"272":1000000,"263":1000000,"267":1000000,"385":1000000,"617":1000000};
    // var arrayLength = itemID.length;

    var pointMinPrice = 1000000;

    var plushROI = 0;
    var flowerROI = 0;

    function findingSum(){
    	var plushieTotalPrice = Object.keys(plush_minPrice).reduce((acc, curr) => acc+plush_minPrice[curr],0);
    	console.log(plushieTotalPrice);
    	$("#total_plush_price").text(plushieTotalPrice + "       " + pointMinPrice);
    	plushROI = (pointMinPrice*10)/plushieTotalPrice-1;
    	localStorage['plushROI'] = JSON.stringify(plushROI);

    	var flowerTotalPrice = Object.keys(flower_minPrice).reduce((acc, curr) => acc+flower_minPrice[curr],0);
    	console.log(flowerTotalPrice);
    	$("#total_flower_price").text(flowerTotalPrice + "       " + pointMinPrice);
    	flowerROI = (pointMinPrice*10)/flowerTotalPrice-1;
    	localStorage['flowerROI'] = JSON.stringify(flowerROI);

    }
    function findingBazaarMin(){
    	console.log(plush_raw)
		for (x in plush_raw){

			var minCost = 1000000;
			for (y in plush_raw[x].bazaar) {
				var tempCost = plush_raw[x].bazaar[y].cost;
				if (tempCost < minCost) {
					minCost = tempCost;
					bazaarPlushID[x] = y;
				}
			}
			plush_minPrice[x] = minCost;
		} 
		console.log(flower_raw)
		for (x in flower_raw){
			var minCost = 1000000;
			for (y in flower_raw[x].bazaar) {
				var tempCost = flower_raw[x].bazaar[y].cost;
				if (tempCost < minCost) {
					minCost = tempCost;
					bazaarFlowerID[x] = y;
				}
			}
			flower_minPrice[x] = minCost;
		}
		localStorage['bazaarFlowerID'] = JSON.stringify(bazaarFlowerID);
		localStorage['bazaarPlushID'] = JSON.stringify(bazaarPlushID); 
		localStorage['plush_minPrice'] = JSON.stringify(plush_minPrice);
		localStorage['flower_minPrice'] = JSON.stringify(flower_minPrice); 
	}
	function updatePrices(){
		for (x in plush_minPrice) {
			// console.log(x)
			$('#'+x).text(plush_minPrice[x]);
			$('#'+x).attr("href", "https://www.torn.com/bazaar.php#/p=bazaar&userID="+bazaarPlushID[x]);
		}
		for (x in flower_minPrice) {
			// console.log(x)
			$('#'+x).text(flower_minPrice[x]);
			$('#'+x).attr("href", "https://www.torn.com/bazaar.php#/p=bazaar&userID="+bazaarFlowerID[x]);
		}
		$('#point-price').text(pointMinPrice);
		$('#plushROI').text((plushROI*100)+'%');
		$('#flowerROI').text((flowerROI*100)+'%');
	}

    function fetchNext(ID) {
    	// console.log(localStorage['api_key']);

    	return fetch('https://api.torn.com/market/'+ ID +'?selections=bazaar&key='+ localStorage['api_key'])
	  	.then(
	    function(response) {
	      if (response.status !== 200) {
	        console.log('Looks like there was a problem. Status Code: ' +
	          response.status);
	        return;
	      }
	      // Examine the text in the response
	      response.json().then(function(data) {
	      	if (plushID.includes(ID)) {
	      		plush_raw[ID] = data;
	      		// console.log("plush")
	      	} else {
	      		flower_raw[ID] = data;
	      		// console.log("flower")
	      	}
	      	var plush_flag = 1;
	      	var flower_flag = 1;
	      	for (x in plush_raw){
      			if (plush_raw[x] != null) continue;
      			plush_flag = 0;
      		}
      		for (x in flower_raw){
      			// console.log(flower_raw);
      			if (flower_raw[x] != null) continue;
      			flower_flag = 0;
      		}
	      	if (plush_flag && flower_flag) {
	      		findingBazaarMin();
	      	    findingSum();
	    		updatePrices();
	      	}
	      });
	    }
	  )
	  .catch(function(err) {
	    console.log('Fetch Error :-S', err);
	  });
    }
    
    function fetchPointPrice() {
    	fetch('https://api.torn.com/market/?selections=pointsmarket&key='+ localStorage['api_key'])
	  	.then(
	    function(response) {
	      if (response.status !== 200) {
	        console.log('Looks like there was a problem. Status Code: ' +
	          response.status);
	        return;
	      }
	      // Examine the text in the response
	      response.json().then(function(data) {
	      	var minCost = 1000000;

			for (y in data.pointsmarket) {
				var tempCost = data.pointsmarket[y].cost;
				if (tempCost < minCost) {
					minCost = tempCost;
				}
			}
			pointMinPrice = minCost;
			localStorage['pointMinPrice'] = pointMinPrice;
			console.log(pointMinPrice)
	      });
	    }
	  )
	  .catch(function(err) {
	    console.log('Fetch Error :-S', err);
	  });
    	
    }
    fetchPointPrice();
    for (var j=0;j<plushID.length;j++) {
    	fetchNext(plushID[j]);
    }
    for (var j=0;j<flowerID.length;j++) {
		fetchNext(flowerID[j]);
    }

}

function prev_values() {
    $('html').hide().fadeIn('slow');
    //camel, chamois, jaguar, (kitten), lion, monkey, nessie, panda, red fox, (sheep), stingray, (teddy) ,wolverine

    var bazaarPlushID = JSON.parse(localStorage['bazaarPlushID']);
    var bazaarFlowerID = JSON.parse(localStorage['bazaarFlowerID']);
    
    var plush_minPrice = JSON.parse(localStorage['plush_minPrice']);
    var flower_minPrice= JSON.parse(localStorage['flower_minPrice']);

    var pointMinPrice = JSON.parse(localStorage['pointMinPrice']);

    var plushROI = JSON.parse(localStorage['plushROI']);
    var flowerROI = JSON.parse(localStorage['flowerROI']);

    function findingSum(){
    	var plushieTotalPrice = Object.keys(plush_minPrice).reduce((acc, curr) => acc+plush_minPrice[curr],0);
    	console.log(plushieTotalPrice);
    	$("#total_plush_price").text(plushieTotalPrice + "  " + pointMinPrice);
    	plushROI = (pointMinPrice*10)/plushieTotalPrice-1;

    	var flowerTotalPrice = Object.keys(flower_minPrice).reduce((acc, curr) => acc+flower_minPrice[curr],0);
    	console.log(flowerTotalPrice);
    	$("#total_flower_price").text(flowerTotalPrice + "  " + pointMinPrice);
    	flowerROI = (pointMinPrice*10)/flowerTotalPrice-1;
    }
	function updatePrices(){
		for (x in plush_minPrice) {
			// console.log(x)
			$('#'+x).text(plush_minPrice[x]);
			$('#'+x).attr("href", "https://www.torn.com/bazaar.php#/p=bazaar&userID="+bazaarPlushID[x]);
		}
		for (x in flower_minPrice) {
			// console.log(x)
			$('#'+x).text(flower_minPrice[x]);
			$('#'+x).attr("href", "https://www.torn.com/bazaar.php#/p=bazaar&userID="+bazaarFlowerID[x]);
		}
		$('#point-price').text(pointMinPrice);
		$('#plushROI').text((plushROI*100)+'%');
		$('#flowerROI').text((flowerROI*100)+'%');
	}

    findingSum();
	updatePrices();
}


//bind events to dom elements
//document.addEventListener('DOMContentLoaded', init_main);
document.addEventListener('DOMContentLoaded', prev_values);
document.querySelector('#refresh').addEventListener('click', init_main);