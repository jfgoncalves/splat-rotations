/*
    Splat Rotations - A Chrome extension fetching the current and upcoming Splatoon stages.
    Copyright (C) 2015  Jean-François Goncalves

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

function init() {

    var region, offset, url, warning;
    //Send the right URL to the program depending on the region set
    region = localStorage.getItem("region");
    offset = localStorage.getItem("offset");
    if (region === null || region === "null") {
        url = 'http://splatapi.ovh/schedule_na.json';
        warning = document.getElementById("warning");
        warning.innerHTML = chrome.i18n.getMessage("noRegion");
        warning.setAttribute("style", "background-color: #FFFF97; text-align: center; height: 30px; line-height: 30px;");
    } else {
        url = 'http://splatapi.ovh/schedule_'+region+'.json';
    }
    if (offset === null) {
        localStorage.setItem("offset", 0);
    }
    retrieveJSON(url, region);
}

function retrieveJSON(url, fes_region) {

    var AJAX_req, json;
    // URL specific on region
    AJAX_req = new XMLHttpRequest();
    AJAX_req.open("GET", url, true);
    AJAX_req.setRequestHeader("Content-type", "application/json");
    AJAX_req.setRequestHeader("cache-control", "no-cache");

    AJAX_req.onreadystatechange = function() {

        if (AJAX_req.readyState == 4 && AJAX_req.status == 200) {

            json = JSON.parse(AJAX_req.responseText);

            if (json.festival === true) {
                parseFes(json);

            } else {
                parseRotations(json);
            }
        } else if (AJAX_req.readyState == 3) {
            document.getElementById('load').innerHTML = chrome.i18n.getMessage("loading");
        } else {
            document.getElementById('load').innerHTML = chrome.i18n.getMessage("error");
        }
    };
    AJAX_req.send(null);
}

// Parse the name of the stages and returns the correct localized name that can be used to parse images and strings.

function jpNameParser(name) {
    var jp_dic = {
        "アンチョビットゲームズ": "ancho",
        "アロワナモール": "arowana",
        "Ｂバスパーク": "blackbelly",
        "ネギトロ炭鉱": "bluefin",
        "モンガラキャンプ場": "camp",
        "ヒラメが丘団地": "flounder",
        "マサバ海峡大橋": "hammerhead",
        "モズク農園": "kelp",
        "マヒマヒリゾート＆スパ": "mahi",
        "タチウオパーキング": "moray",
        "キンメダイ美術館": "museum",
        "ショッツル鉱山": "piranha",
        "ホッケふ頭": "port",
        "シオノメ油田": "saltspray",
        "デカライン高架下": "urchin",
        "ハコフグ倉庫": "walleye",
        "ガチエリア": "splat",
        "ガチホコ": "rainmaker",
        "ガチヤグラ": "tower"
    };
    return jp_dic[name];
}

// Handle Splatfest

function parseFes(json) {

    var fes_css, fesTitle, title, festival, fesDiv, fesImage, fesMapName, fesStageName, fesMapContainer, stage;

    // DOM starting
    document.getElementById('day').id = "night";
    document.getElementById('rotations').innerHTML = "";

    fes_css = document.createElement('link');
    fes_css.rel = "stylesheet";
    fes_css.href = "popup_night.css";
    document.getElementsByTagName('head')[0].appendChild(fes_css);

    fesTitle = document.createElement('img');
    fesTitle.className = "fesTitle";
    fesTitle.src = "assets/fes.png";
    document.getElementById('rotations').appendChild(fesTitle);

    vs = document.createElement('div');
    vs.className = "teams";
    vs.innerHTML = '<span class="team">'+json.schedule[0].team_alpha_name+'</span><span class="vs"> vs </span><span class="team">'+json.schedule[0].team_bravo_name+'</span';
    // Teams color
    document.getElementById('rotations').appendChild(vs);

    // Parsing

    festival = json.schedule[0].stages;
    fesMapContainer = document.createElement('div');

    for (stage in festival) {

        if (festival.hasOwnProperty(stage)) {
            fesDiv = document.createElement('div');
            fesDiv.className = "fesContainer";

            fesStageName = jpNameParser(festival[stage].name);

            fesImage = document.createElement('img');
            fesImage.className = "map";
            fesImage.src = "assets/stages/night/"+fesStageName+".jpg";
            fesDiv.appendChild(fesImage);

            fesImage.onerror = function () {
                this.onerror = null;
                this.src = "assets/stages/notfoundfes.jpg";
            };

            fesMapName = document.createElement('div');
            fesMapName.className = "name";
            fesMapName.innerHTML = chrome.i18n.getMessage(fesStageName);
            fesDiv.appendChild(fesMapName);

            fesMapContainer.appendChild(fesDiv);
        }
    }
    document.getElementById('rotations').appendChild(fesMapContainer);
}

function parseRotations(json) {

    var schedule, offset, currentLang, rotation, startTime, nextRotation, regular, ranked, rankedMode, eachRotation, timeRotation, divRegular, h1Regular, divRanked, h1Ranked, divRankedMode, map, mapName, mapRegular, mapRegularImage, mapRegularText, mapRanked, mapRankedImage, mapRankedText, separator;

    schedule = json.schedule;
    offset = Number(localStorage.getItem("offset"));
    currentLang = chrome.i18n.getUILanguage();

    document.getElementById('rotations').innerHTML = "";

    for (rotation in schedule) {

        if (schedule.hasOwnProperty(rotation)) {
            startTime = new Date(schedule[rotation].begin);
            startTime.setHours(startTime.getHours()+offset);

            regular = schedule[rotation].stages.regular;
            ranked = schedule[rotation].stages.ranked;
            rankedMode = schedule[rotation].ranked_mode;

            if (Number([rotation]) === 0) {
                nextRotation = chrome.i18n.getMessage("currentRotation");

            } else if (currentLang === 'ja' || currentLang === 'de') {
                nextRotation = chrome.i18n.getMessage("nextRotation")+" "+startTime.toLocaleTimeString('ja-JA').replace(':00:00', ':00');
            } else if (localStorage.getItem("timeFormat") === '12') {
                nextRotation = chrome.i18n.getMessage("nextRotation")+" "+startTime.toLocaleTimeString('en-US').replace(':00 ', ' ');
            } else {
                nextRotation = chrome.i18n.getMessage("nextRotation")+" "+startTime.toLocaleTimeString('fr-FR').replace(':00:00', 'h00');
            }

            // DOM Starting
            eachRotation = document.createElement('div');
            eachRotation.id = [rotation];

            timeRotation = document.createElement('div');
            timeRotation.className = "time rotation"+[rotation];
            timeRotation.innerHTML = nextRotation;
            eachRotation.appendChild(timeRotation);

            divRegular = document.createElement('div');
            divRegular.className = "regular";
            eachRotation.appendChild(divRegular);
            h1Regular = document.createElement('img');
            h1Regular.className = "imgMode";
            h1Regular.src = "assets/modes/regular.png";
            divRegular.appendChild(h1Regular);

            divRanked = document.createElement('div');
            divRanked.className = "ranked";
            eachRotation.appendChild(divRanked);
            h1Ranked = document.createElement('img');
            h1Ranked.className = "imgMode";
            h1Ranked.src = "assets/modes/ranked.png";
            divRanked.appendChild(h1Ranked);

            divRankedMode = document.createElement('div');
            divRankedMode.className = "mode "+jpNameParser(rankedMode);
            divRankedMode.innerHTML = chrome.i18n.getMessage(jpNameParser(rankedMode));
            divRanked.appendChild(divRankedMode);

            for (map in regular) {

                if (regular.hasOwnProperty(map)) {
                    mapName = regular[map].name;
                    mapRegular = document.createElement('div');
                    mapRegular.className = "map"+[map];

                    // Map Image
                    mapRegularImage = document.createElement('img');
                    mapRegularImage.className = "map";
                    if (localStorage.getItem("setInk") === 'notInked') {
                        mapRegularImage.src = "assets/stages/alpha/"+jpNameParser(mapName)+".jpg";
                    } else {
                        mapRegularImage.src = "assets/stages/day/"+jpNameParser(mapName)+".jpg";
                    }

                    // Error handling
                    mapRegularImage.onerror = function () {
                        this.onerror = null;
                        this.src = "assets/stages/notfound.jpg";
                    };

                    mapRegular.appendChild(mapRegularImage);

                    // Map Name
                    mapRegularText = document.createElement('div');
                    mapRegularText.className = "name";
                    if (jpNameParser(mapName) === undefined) {
                        mapRegularText.innerHTML = chrome.i18n.getMessage("unknown");
                    } else {
                        mapRegularText.innerHTML = chrome.i18n.getMessage(jpNameParser(mapName));
                    }
                    mapRegular.appendChild(mapRegularText);

                    // Append to the DOM
                    divRegular.appendChild(mapRegular);
                }
            }

            // Ranked Loop
            for (map in ranked) {

                if (ranked.hasOwnProperty(map)) {
                    mapName = ranked[map].name;
                    mapRanked = document.createElement('div');
                    mapRanked.className = "map"+[map];

                    // Map Image
                    mapRankedImage = document.createElement('img');
                    mapRankedImage.className = "map";
                    if (localStorage.getItem("setInk") === 'notInked') {
                        mapRankedImage.src = "assets/stages/alpha/"+jpNameParser(mapName)+".jpg";
                    } else {
                        mapRankedImage.src = "assets/stages/day/"+jpNameParser(mapName)+".jpg";
                    }

                    // Error handling
                    mapRankedImage.onerror = function () {
                        this.onerror = null;
                        this.src = "assets/stages/notfound.jpg";
                    };

                    mapRanked.appendChild(mapRankedImage);

                    // Map Name
                    mapRankedText = document.createElement('div');
                    mapRankedText.className = "name";
                    if (jpNameParser(mapName) === undefined) {
                        mapRankedText.innerHTML = chrome.i18n.getMessage("unknown");
                    } else {
                        mapRankedText.innerHTML = chrome.i18n.getMessage(jpNameParser(mapName));
                    }
                    mapRanked.appendChild(mapRankedText);

                    // Append to the DOM
                    divRanked.appendChild(mapRanked);
                }
            }

            separator = document.createElement('hr');
            eachRotation.appendChild(separator);

            // Append each rotation to the DOM
            document.getElementById('rotations').appendChild(eachRotation);
        }
    }
}

document.getElementsByTagName('html')[0].setAttribute('lang', chrome.i18n.getUILanguage().substring(0, 2));
document.getElementById('load').innerHTML = chrome.i18n.getMessage("loading");
window.addEventListener("load", function() {
    init();
});
