function commaSeparateNumber(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
        val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
}

function isNull(v) {
    return v != null ? v : 0;
}

function getRFC() {
    var value = "; " + document.cookie;
    var parts = value.split("; rfc_v=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

function checkAPIusage(num) {
    var apiUsage = JSON.parse(localStorage.apiUsage || '[]');
    var currentTime = moment().unix();

    for(var i = 0; i < apiUsage.length; i++) {
        if((currentTime - apiUsage[0]) > 60)
            apiUsage.splice(0,1);
        else
            break;
    }

    localStorage.apiUsage = JSON.stringify(apiUsage);

    if((num + apiUsage.length) <= 100)
        return true;
    else
    {
        console.warn("cooldown API usage to avoid temporary API banned");
        alert("Hold down, your api request is almost reach the limit (100 request per minute). Please try again in a few seconds.")
        return false;
    }
}

function addAPIusage() {
    var apiUsage = JSON.parse(localStorage.apiUsage || '[]');
    var currentTime = moment().unix();
    apiUsage.push(currentTime);
    localStorage.apiUsage = JSON.stringify(apiUsage);
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function requireAPI() {
    if (localStorage.getItem("_apiKey") === null) {
        $('div.content-title').after(`
        <div id='scbox' class="m-top10">
            <div class="title-gray top-round" role="heading" aria-level="5">
            <i class="issue-attention-icon"></i>
            <span id="title">API Key required</span>
            </div>
            <div class="bottom-round cont-gray p10" id="msg">
                <fieldset class="submit-wrap">
                    <p>You are using script that require API key. Please fill your correct API key to use it.</p><br/>
                    <div class="cont-quantity left">
                        <div class="input-money-group"><span title="Fill with your correct API key" class="input-money-symbol">KEY</span><input id="quantity-price" class="quantity price input-money" type="text" value=""></div>
                    </div>
                    <div class="cont-button left" id="apiSignIn" style="margin-left: 10px;">
                        <span class="btn-wrap silver">
                            <span class="btn c-pointer bold" style="padding: 0 15px 0 10px;"><span>SIGN IN</span></span>
                        </span>
                    </div>
                    <div class="clear"></div>
                </fieldset>
            </div>
            <!--div class="clear"></div-->
            <hr class="page-head-delimiter m-top10">
        </div>`);

        $("div#scbox #apiSignIn").click(function() {
            var apikey = $("div#scbox input").val();
            
            if(!checkAPIusage(1)) return 0;
            $.getJSON('https://api.torn.com/user/?selections=basic&key='+apikey, function(data) {
               if(data.error != undefined) {
                   alert(data.error.error);
                   $("div#scbox .input-money-group").addClass("error");
               }
               else {
                   localStorage._apiKey = apikey;
                   addAPIusage();
                   $("div#scbox #msg").text("Hi " + data.name +", you have successfully signed in your API key. Thank you.");
                   setTimeout(() => {
                       location.reload();
                   }, 3000);
               }
            });
        });
    }
    else {
        var apikey = localStorage.getItem("_apiKey");
        if(!checkAPIusage(1)) return 0;
        $.getJSON('https://api.torn.com/user/?selections=basic&key='+apikey, function(data) {
            if(data.error != undefined) {
                localStorage.removeItem("_apiKey");
            }
            else {
                addAPIusage();
                callFunction();
            }
        });
    }
}