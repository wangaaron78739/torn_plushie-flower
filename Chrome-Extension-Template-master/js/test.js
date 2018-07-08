// ==UserScript==
// @name         TORN : Pointster
// @namespace    pointster
// @version      3.1
// @description  Worth way to buy points
// @author       Mafia[610357]
// @match        https://www.torn.com/pmarket.php*
// @require     http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js
// @require     https://greasyfork.org/scripts/39572-tornlib/code/tornlib.js?version=259509
// @grant       GM_addStyle
// ==/UserScript==

'use strict';

requireAPI();

function callFunction() {
    pointSter();
}

$("a.point").before(`<a role="button" onclick="" aria-labelledby="point" class="point t-clear h c-pointer  m-icon line-h24 right " href="museum.php">
    <span class="icon-wrap">
        <i class="top-page-icon city-icon"></i>
    </span>
    <span id="point">Museum</span>
</a>`);

function pointSter() {
    var apikey = localStorage.getItem("_apiKey");
    var myprice = JSON.parse(localStorage.pointster || '{}');
    // global CSS

    var myjson = {"1":{"points":10,"items":{"186":{"name":"Sheep Plushie"},"187":{"name":"Teddy Bear Plushie"},"215":{"name":"Kitten Plushie"},"258":{"name":"Jaguar Plushie"},"261":{"name":"Wolverine Plushie"},"266":{"name":"Nessie Plushie"},"268":{"name":"Red Fox Plushie"},"269":{"name":"Monkey Plushie"},"273":{"name":"Chamois Plushie"},"274":{"name":"Panda Plushie"},"281":{"name":"Lion Plushie"},"384":{"name":"Camel Plushie"},"618":{"name":"Stingray Plushie"}},"height1":"34px","height2":"440px"},"2":{"points":10,"items":{"260":{"name":"Dahlia"},"263":{"name":"Crocus"},"264":{"name":"Orchid"},"267":{"name":"Heather"},"271":{"name":"Ceibo Flower"},"272":{"name":"Edelweiss"},"276":{"name":"Peony"},"277":{"name":"Cherry Blossom"},"282":{"name":"African Violet"},"385":{"name":"Tribulus Omanense"},"617":{"name":"Banana Orchid"}},"height1":"34px","height2":"374px"},"3":{"points":100,"items":{"450":{"name":"Leopard Coin"},"451":{"name":"Florin Coin"},"452":{"name":"Gold Noble Coin"}},"height1":"34px","height2":"102px"},"4":{"points":100,"items":{"454":{"name":"Vairocana Buddha Sculpture"}},"height2":"34px","height1":"34px"},"5":{"points":250,"items":{"453":{"name":"Ganesha Sculpture"}},"height2":"34px","height1":"34px"},"6":{"points":500,"items":{"458":{"name":"Shabti Sculpture"}},"height2":"34px","height1":"34px"},"7":{"points":1000,"items":{"455":{"name":"Script from the Quran: Ibn Masud"},"456":{"name":"Script from the Quran: Ubay Ibn Kab"},"457":{"name":"Script from the Quran: Ali"}},"height2":"102px","height1":"34px"},"8":{"points":2000,"items":{"460":{"name":"White Senet Pawn x5"},"461":{"name":"Black Senet Pawn x5"},"462":{"name":"Senet Board"}},"height2":"102px","height1":"34px"},"9":{"points":10000,"items":{"459":{"name":"Egyptian Amulet"}},"height2":"34px","height1":"34px"}};
    var itemList = [];
    var totalItems = 37;
    var priceModal = "<div><input type='text' /> <button>SET</button></div>"

    $("fieldset.submit-wrap:last div.clear").before(`<div class="cont-button left" id="btnPointster" style="margin-left: 10px; display: none;">
        <span class="btn-wrap silver">
            <span class="btn c-pointer bold" style="padding: 0 15px 0 10px;"><span>POINTSTER</span></span>
        </span>
    </div>`);

    $("#btnPointster").fadeIn().click(function() {

        if(!checkAPIusage(38)) return 0;


        $("div.chart-main-wrap").before(`
        <h5 style="text-decoration: underline;margin-bottom: 11px;">Poinster</h5>
        <ul class="users-list-header title-green top-round" aria-hidden="true">
            <li class="name" style="width: 304px;">Items</li>
            <li class="points psiprice">Item Price</li>
            <li class="cost-each pspoints">Points</li>
            <li class="total-price pstotal">Total Price</li>
            <li class="action pscosteach">Cost Each</li>
        </ul>
        <ul class="users-point-sell ulps cont-gray bottom-round" style="display: none;"></ul>
        <hr class="delimiter-999 m-top10 m-bottom10">
        `);

        $.each(myjson, function(id) {
            var lid = id;
            var points = this.points;
            var cheap;

            $("ul.ulps").append(`
            <li id="li${id}" class="${id == 9 ? 'last' : ''}">
                <span class="expander ui-accordion-header ui-helper-reset ui-state-default ui-corner-all ui-accordion-icons">
                    <span class="user-info psname"></span>
                    <span class="points psiprice" style="line-height: ${this.height1}"></span>
                    <span class="cost-each pspoints">${commaSeparateNumber(points)}</span>
                    <span class="total-price pstotal" style="line-height: ${this.height2}" total="0"></span>
                    <span class="action pscosteach"></span>
                </span>
            </li>`);
            $.each(this.items, function(itemid) {
                var itemname = this.name;
                $.getJSON('https://api.torn.com/market/'+itemid+'?selections=bazaar,itemmarket&key='+apikey, function(data) {
                    addAPIusage();
                    var bazaarcost = Object.values(data.bazaar).reduce(function(m, k){ return k.cost < m.cost ? k : m;  }).cost;
                    var imarketcost = data.itemmarket != null ? Object.values(data.itemmarket).reduce(function(m, k){ return k.cost < m.cost ? k : m;  }).cost : 99999999999;
                    var cost = bazaarcost < imarketcost ? bazaarcost : imarketcost;
                    var totalprice = parseInt($("li#li"+lid+" .pstotal").attr("total")) + (cost * (itemid == 461 || itemid == 462 ? 5 : 1));
                    var costeach = parseInt(totalprice / points);
                    itemList.push(parseInt(itemid));

                    $("li#li"+lid+" .user-info").append(`
                    <img src="/images/items/${itemid}/small.png">
                    <a class="psitem user name">${itemname} (<span id="owned${itemid}" title="">0</span>)</a>
                    <ul id="iconTray" class="med singleicon" style="display: inline-block;">
                        <a target="_blank" href="/imarket.php#/p=shop&type=${itemid}"><i class="buy-icon"></i></a>
                    </ul><br/>`);
                    $("li#li"+lid+" .points").append($('<span id="price'+itemid+'" title="Click to set your preferred price" class="'+(myprice[itemid]!=undefined?(cost<=myprice[itemid]?'spgreen':'spred'):'')+'">$'+commaSeparateNumber(cost)+"</span><br/>").click(function(){
                        var $span = $(this);
                        $span.hide();
                        $span.after($("<input type='text' class='myprice' value='"+(myprice[itemid]!==undefined?myprice[itemid]:0)+"' title='Your current preferred price is "+myprice[itemid]+"' />").keypress(function(e){
                            if(e.which == 13) {
                                if(!isNaN(parseInt($(this).val())) && (parseInt($(this).val()) > 0)) {
                                    myprice[itemid] = parseInt($(this).val());
                                    localStorage.pointster = JSON.stringify(myprice);
                                    $span.removeClass().addClass(cost<=myprice[itemid]?'spgreen':'spred');
                                }
                                $(this).remove();
                                $span.fadeIn()
                            }
                            if(e.which == 27) {
                                $(this).remove();
                                $span.fadeIn();
                            }
                        }).blur(function(){
                            $(this).remove();
                            $span.fadeIn();
                        })).next().select();
                    }));
                    $("li#li"+lid+" .pstotal").attr("total", totalprice).text('$' + commaSeparateNumber(totalprice));
                    $("li#li"+lid+" .pscosteach").attr("costeach", costeach).text('$' + commaSeparateNumber(costeach));

                    //TODO
                    // $("#price281").click(function() {$("<span style='background-color: #ccc; padding:10px;'><input type='text' id='setprice' /> <button> set</button> </span>").dialog({closeText:'X'})})

                    totalItems--;

                    if(!totalItems) {
                        $.getJSON('https://api.torn.com/user/?selections=inventory,bazaar,display&key='+apikey, function(data) {
                            $.each(data.inventory, function(){
                                if(itemList.indexOf(this.ID) !== -1) {
                                    $("span#owned"+this.ID).attr("title", "<strong>Inventory</strong> : "+this.quantity);
                                    $("span#owned"+this.ID).text(parseInt($("span#owned"+this.ID).text()) + this.quantity);
                                }
                            });

                            $.each(data.bazaar, function(){
                                if(itemList.indexOf(this.ID) !== -1) {
                                    var br = $("span#owned"+this.ID).attr("title").length ? "<br/>" : "";
                                    $("span#owned"+this.ID).attr("title", $("span#owned"+this.ID).attr("title") + br + "<strong>Bazaar</strong> : "+this.quantity);
                                    $("span#owned"+this.ID).text(parseInt($("span#owned"+this.ID).text()) + this.quantity);
                                }
                            });

                            $.each(data.display, function(){
                                if(itemList.indexOf(this.ID) !== -1) {
                                    var br = $("span#owned"+this.ID).attr("title").length ? "<br/>" : "";
                                    $("span#owned"+this.ID).attr("title", $("span#owned"+this.ID).attr("title") + br + "<strong>Display</strong> : "+this.quantity);
                                    $("span#owned"+this.ID).text(parseInt($("span#owned"+this.ID).text()) + this.quantity);
                                }
                            });
                        });

                        cheap = Object.values($("ul.ulps li .pscosteach")).reduce(function(p,k,v) { return $(k).attr("costeach") < p ? parseInt($(k).attr("costeach")) : p });

                        if(parseInt($(".users-point-sell:eq(1) .cost-each:eq(0)").clone().children().remove().end().text().replace(/[, $]+/g, '').trim()) < cheap) {
                            $(".users-point-sell:eq(1) .cost-each:eq(0)").addClass("highlight-active bold").closest("li").css("background-color", "#efffea");
                        }
                        else {
                            $("ul.ulps li").find("span[costeach='"+cheap+"']").addClass("highlight-active bold").closest("li").css("background-color", "#efffea");
                        }
                    }
                });
            });
        });
        $("ul.ulps").slideDown();
        $("a.form-reset").fadeOut();
        $("ul.users-list-header:eq(0)").css("cursor", "pointer").click(function(){
            if($("ul.ulps").is(':visible')) {
                $("ul.ulps").slideUp(function(){
                    $(this).removeClass("users-point-sell");
                    $("a.form-reset").fadeIn();
                })
            }
            else {
                $("ul.ulps").slideDown().addClass("users-point-sell");
                $("a.form-reset").fadeOut();
            }
        });
        $(this).fadeOut();
    });
}