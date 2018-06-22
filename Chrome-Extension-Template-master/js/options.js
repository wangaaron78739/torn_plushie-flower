/*
** file: js/options.js
** description: javascript code for "html/options.html" page
*/

function init_options () {
    console.log("function: init_options");

    //load currently stored options configuration
    var api_key = localStorage['api_key'];
    //set the current state of the options form elements to match the stored options values
    //api_key
    if (api_key) {
        document.getElementById("update-api-key").value = api_key;
    }  
}

function save_options () {
    console.log("function: save_options");

    //favorite-movie-dropdown
    var api_key = document.getElementById("update-api-key").value;
    localStorage['api_key'] = api_key;
    console.log("api_key = " + api_key);
    alert("saved");
}

//bind events to dom elements
document.addEventListener('DOMContentLoaded', init_options);
document.querySelector('#save-options-button').addEventListener('click', save_options);