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

    var region, url;
    //Send the right URL to the program depending on the region set
    region = localStorage.getItem("region");
    url = "https://splatoon.ink/schedule.json";

    if (region === 'jp') {
        url = "http://s3-ap-northeast-1.amazonaws.com/splatoon-data.nintendo.net/fes_info.json";
    } else if (region === 'eu') {
      url = "http://nintendhome.fr/splat-rotations/fes_eu.json";
    } 
    retrieveFes(url, region);
}


function retrieveFes(url, fes_region) {

    var AJAX_req, json;
    // URL specific on region
    AJAX_req = new XMLHttpRequest();
    AJAX_req.open("GET", url, true);
    AJAX_req.setRequestHeader("Content-type", "application/json");
    AJAX_req.setRequestHeader("cache-control", "no-cache");

    AJAX_req.onreadystatechange = function() {

        if (AJAX_req.readyState == 4 && AJAX_req.status == 200) {

            json = JSON.parse(AJAX_req.responseText);
            if (json.fes_state === 1) {
                parseFes(json, fes_region);
            } else {
                if (fes_region === "jp" || fes_region === 'eu') {
                    retrieveRotations();
                } else {
                    parseRotations(json);
                }
            }
        } else if (AJAX_req.readyState == 3) {
            document.getElementById('load').innerHTML = chrome.i18n.getMessage("loading");
        } else {
            document.getElementById('load').innerHTML = chrome.i18n.getMessage("error");
        }
    };
    AJAX_req.send(null);
}

function retrieveRotations() {

    var AJAX_req, json;

    AJAX_req = new XMLHttpRequest();
    AJAX_req.open("GET", 'https://splatoon.ink/schedule.json', true);
    AJAX_req.setRequestHeader("Content-type", "application/json");
    AJAX_req.setRequestHeader("Cache-Control", "no-cache");

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

function parseFes(json, region) {

    var fes_css, fesTitle, title;

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

    title = document.createElement('div');
    title.className = "title";
    title.innerHTML = chrome.i18n.getMessage("fesTitle");
    document.getElementById('rotations').appendChild(title);

    // Region specific code executed here

    if (region === 'jp' || region === 'eu') {

        var festival, fesDiv, fesImage, fesMapName, fesStageName, fesMapContainer, stage;

        festival = json.fes_stages;
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

    } else {

        //
        // Handle US/EU Splatfest var here
        //

    }
}

// This function parse the name of the stages and returns the correct localized name that can be used to parse images and strings.

function jpNameParser(name) {
    var jp_dic = {
        "アロワナモール": "arowana",
        "Ｂバスパーク": "blackbelly",
        "ネギトロ炭鉱": "bluefin",
        "モンガラキャンプ場": "camp",
        "ヒラメが丘団地": "flounder",
        "マサバ海峡大橋": "hammerhead",
        "モズク農園": "kelp",
        "タチウオパーキング": "moray",
        "キンメダイ美術館": "museum",
        "ホッケふ頭": "port",
        "シオノメ油田": "saltspray",
        "デカライン高架下": "urchin",
        "ハコフグ倉庫": "walleye",
        "マヒマヒリゾート＆スパ": "mahi",
        "ガチエリア": "splat",
        "ガチホコ": "rainmaker",
        "ガチヤグラ": "tower"
    };
    return jp_dic[name];
}

function parseRotations(json) {

    var schedule, rotation, startTime, nextRotation, regular, ranked, rankedMode, eachRotation, timeRotation, divRegular, h1Regular, divRanked, h1Ranked, divRankedMode, map, mapName, mapRegular, mapRegularImage, mapRegularText, mapRanked, mapRankedImage, mapRankedText, separator;

    schedule = json.schedule;

    document.getElementById('rotations').innerHTML = "";

    for (rotation in schedule) {

        if (schedule.hasOwnProperty(rotation)) {
            startTime = new Date(schedule[rotation].startTime);

            regular = schedule[rotation].regular.maps;
            ranked = schedule[rotation].ranked.maps;
            rankedMode = schedule[rotation].ranked.rulesJP;

            if (Number([rotation]) === 0) {
                nextRotation = chrome.i18n.getMessage("currentRotation");

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
                    mapName = regular[map].nameJP;
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
                    mapName = ranked[map].nameJP;
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
