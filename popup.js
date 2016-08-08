/*
    Splat Rotations - A Chrome extension fetching the current and upcoming Splatoon stages.
    Copyright (C) 2016  Jean-François Goncalves

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

    var url, offset, warning;
    url = 'https://splatoon.ink/schedule.json';
    if (offset === null) {
        localStorage.setItem("offset", 0);
    } else {
        offset = localStorage.getItem("offset");
    }
    retrieveJSON(url);
    // Setting dark theme
    if (localStorage.getItem("theme") === "dark") {
        dark_css = document.createElement('link');
        dark_css.rel = "stylesheet";
        dark_css.href = "popup-dark.css";
        document.getElementsByTagName('head')[0].appendChild(dark_css);
    }
}

function retrieveJSON(url) {

    var AJAX_req, json;
    // URL specific on region
    AJAX_req = new XMLHttpRequest();
    AJAX_req.open("GET", url, true);
    AJAX_req.setRequestHeader("Content-type", "application/json");
    AJAX_req.setRequestHeader("cache-control", "no-cache");

    AJAX_req.onreadystatechange = function() {

        if (AJAX_req.readyState == 4 && AJAX_req.status == 200) {
            json = JSON.parse(AJAX_req.responseText);
            parseRotations(json);
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

function parseRotations(json) {

    var schedule, offset, currentLang, rotation, startTime, nextRotation, regular, ranked, rankedMode, eachRotation, timeRotation, divRegular, h1Regular, divRanked, h1Ranked, divRankedMode, map, mapName, mapRegular, mapRegularImage, mapRegularText, mapRanked, mapRankedImage, mapRankedText, separator;

    schedule = json.schedule;
    offset = Number(localStorage.getItem("offset"));
    currentLang = chrome.i18n.getUILanguage();

    document.getElementById('rotations').innerHTML = "";

    for (rotation in schedule) {

        if (schedule.hasOwnProperty(rotation)) {
            startTime = new Date(schedule[rotation].startTime);
            startTime.setHours(startTime.getHours()+offset);

            regular = schedule[rotation].regular.maps;
            ranked = schedule[rotation].ranked.maps;
            rankedMode = schedule[rotation].ranked.rulesJP;

            if (Number([rotation]) === 0) {
                nextRotation = chrome.i18n.getMessage("currentRotation");
            } else if (localStorage.getItem("timeFormat") === '12') {
                nextRotation = chrome.i18n.getMessage("nextRotation")+" "+startTime.toLocaleTimeString('en-US').replace(':00 ', ' ');
            } else if (currentLang === 'fr') {
                nextRotation = chrome.i18n.getMessage("nextRotation")+" "+startTime.toLocaleTimeString('fr-FR').replace(':00:00', 'h00');
            } else {
                nextRotation = chrome.i18n.getMessage("nextRotation")+" "+startTime.toLocaleTimeString('ja-JA').replace(':00:00', ':00');
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
                    mapName = regular[map].nameJP;
                    mapRegular = document.createElement('div');
                    mapRegular.className = "map"+[map];

                    // Map Image
                    mapRegularImage = document.createElement('img');
                    mapRegularImage.className = "map";
                    if (localStorage.getItem("setInk") === 'notInked') {
                        mapRegularImage.src = "assets/stages/alpha/"+jpNameParser(mapName)+".jpg";
                    } else if (localStorage.getItem("setInk") === 'night') {
                        mapRegularImage.src = "assets/stages/night/"+jpNameParser(mapName)+".jpg";
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
                    mapName = ranked[map].nameJP;
                    mapRanked = document.createElement('div');
                    mapRanked.className = "map"+[map];

                    // Map Image
                    mapRankedImage = document.createElement('img');
                    mapRankedImage.className = "map";
                    if (localStorage.getItem("setInk") === 'notInked') {
                        mapRankedImage.src = "assets/stages/alpha/"+jpNameParser(mapName)+".jpg";
                    } else if (localStorage.getItem("setInk") === 'night') {
                        mapRankedImage.src = "assets/stages/night/"+jpNameParser(mapName)+".jpg";
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
