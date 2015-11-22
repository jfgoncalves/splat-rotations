function init() {
    
    //Send the right URL to the program depending on the region set
	var region = localStorage.getItem("region");
	var url = "https://splatoon.ink/schedule.json";
	
	if (region == 'jp') {
		url = "http://s3-ap-northeast-1.amazonaws.com/splatoon-data.nintendo.net/fes_info.json";
	} /* else if(region == 'eu') {
  	url = "https://splatoon.ink/schedule_eu.json";
	} */
	retrieveFes(url, region);
}


function retrieveFes(url, fes_region) {
    
    // URL specific on region
	var AJAX_req = new XMLHttpRequest();
	var noCacheJSON = new Date().getTime();
	AJAX_req.open("GET", url+'?c='+noCacheJSON, true);
	AJAX_req.setRequestHeader("Content-type", "application/json");
	
	AJAX_req.onreadystatechange = function() {
		
		if (AJAX_req.readyState == 4 && AJAX_req.status == 200) {
			
			var json = JSON.parse(AJAX_req.responseText);
			if (json.fes_state == 1) {
				parseFes(json, fes_region);
			} else {
				if(url == "https://splatoon.ink/schedule.json") {
					parseRotations(json);
				} else {
					retrieveRotations();
				}
			}
			
		} else if (AJAX_req.readyState == 3) {
            document.getElementById('load').innerHTML = chrome.i18n.getMessage("loading");
		} else if (AJAX_req.status == 403 || 404 || 500 || 503) {
			document.getElementById('load').innerHTML = chrome.i18n.getMessage("error");
		} 
	};
	AJAX_req.send(null);
}

function retrieveRotations() {
	
	// Basic splatoon.ink
	var AJAX_req = new XMLHttpRequest();
	var noCacheJSON = new Date().getTime();
	AJAX_req.open("GET", 'https://splatoon.ink/schedule.json?c='+noCacheJSON, true);
	AJAX_req.setRequestHeader("Content-type", "application/json");
	
	AJAX_req.onreadystatechange = function() {
		
		if (AJAX_req.readyState == 4 && AJAX_req.status == 200) {
			
			var json = JSON.parse(AJAX_req.responseText);
			parseRotations(json);
		} else if (AJAX_req.status == 403 || 404 || 500 || 503) {
			document.getElementById('load').innerHTML = chrome.i18n.getMessage("error");
		}
	};
	AJAX_req.send(null);
}

function parseFes(json, region) {
    
    // DOM starting
	document.getElementById('day').id = "night";
	document.getElementById('rotations').innerHTML = "";
	
	var fes_css = document.createElement('link');
	fes_css.rel = "stylesheet";
	fes_css.href = "popup_night.css";
	document.getElementsByTagName('head')[0].appendChild(fes_css);
	
	
	var fesTitle = document.createElement('img');
    fesTitle.className = "fesTitle";
    fesTitle.src = "assets/fes.png";
    document.getElementById('rotations').appendChild(fesTitle);
  
    var title = document.createElement('div');
    title.className = "title";
    title.innerHTML = chrome.i18n.getMessage("fesTitle");
    document.getElementById('rotations').appendChild(title);
    
    // Region specific code executed here
	
	if (region == 'jp') {
    	
    	var festival = json.fes_stages;
    	
    	var fesMapContainer = document.createElement('div');
    	
    	for (stage in festival) {
        	
        	var fesDiv = document.createElement('div');
        	fesDiv.className = "fesContainer";
        	
        	var fesStageName = jpNameParser(festival[stage].name);
        	
        	var fesImage = document.createElement('img');
    		fesImage.className = "map";
    		fesImage.src = "assets/stages/night/"+fesStageName+".jpg";
    		fesDiv.appendChild(fesImage);
    		
    		fesImage.onerror = function () { 
                this.onerror = null;
			    this.src = "assets/stages/notfoundfes.jpg";
			};
    		
    		var fesMapName = document.createElement('div')
    		fesMapName.className = "name";
    		fesMapName.innerHTML = chrome.i18n.getMessage(fesStageName);
    		fesDiv.appendChild(fesMapName);
    		
    		fesMapContainer.appendChild(fesDiv);
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
    var schedule = json.schedule;

	document.getElementById('rotations').innerHTML = "";
	
    for (rotation in schedule) {

    	var startTime = new Date(schedule[rotation].startTime);
    	var nextRotation;
    	
        var regular = schedule[rotation].regular.maps;
        var ranked = schedule[rotation].ranked.maps;
        var rankedMode = schedule[rotation].ranked.rulesJP;
        
    	if ([rotation] == 0) {
	    	nextRotation = chrome.i18n.getMessage("currentRotation");
	    	
    	} else if (localStorage.getItem("timeFormat") == '12') {
	    	nextRotation = chrome.i18n.getMessage("nextRotation")+startTime.toLocaleTimeString('en-US').replace(':00 ', ' ');
    	} else {
	    	nextRotation = chrome.i18n.getMessage("nextRotation")+startTime.toLocaleTimeString('fr-FR').replace(':00:00', 'h00');
    	}
        
        // DOM Starting
        var eachRotation = document.createElement('div');
        eachRotation.id = [rotation];
        
        var timeRotation = document.createElement('div');
        timeRotation.className = "time rotation"+[rotation];
        timeRotation.innerHTML = nextRotation;
        eachRotation.appendChild(timeRotation);
        
        var divRegular = document.createElement('div');
        divRegular.className = "regular";
        eachRotation.appendChild(divRegular);
        var h1Regular = document.createElement('img');
        h1Regular.className = "imgMode";
        h1Regular.src = "assets/modes/regular.png";
        divRegular.appendChild(h1Regular);
        
        var divRanked = document.createElement('div');
        divRanked.className = "ranked";
        eachRotation.appendChild(divRanked);
        var h1Ranked = document.createElement('img');
        h1Ranked.className = "imgMode";
        h1Ranked.src = "assets/modes/ranked.png";
        divRanked.appendChild(h1Ranked);
        
        var divRankedMode = document.createElement('div');
        divRankedMode.className = "mode "+jpNameParser(rankedMode);
        divRankedMode.innerHTML = chrome.i18n.getMessage(jpNameParser(rankedMode));
        divRanked.appendChild(divRankedMode);
        
        for (map in regular) {
	        
	        var mapName = regular[map].nameJP;
            var mapRegular = document.createElement('div');
            mapRegular.className = "map"+[map];
            
        	// Map Image
			var mapRegularImage = document.createElement('img');
			mapRegularImage.className = "map";
			if (localStorage.getItem("setInk") == 'notInked') {
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
            var mapRegularText = document.createElement('div');
            mapRegularText.className = "name";
            if (jpNameParser(mapName) == undefined) {
				mapRegularText.innerHTML = chrome.i18n.getMessage("unknown");		
			} else {
				mapRegularText.innerHTML = chrome.i18n.getMessage(jpNameParser(mapName));
			}
            mapRegular.appendChild(mapRegularText);
            
            // Append to the DOM
            divRegular.appendChild(mapRegular);
        }
        
        // Ranked Loop
        for (map in ranked) {
            
	        var mapName = ranked[map].nameJP;
	        var mapRanked = document.createElement('div');
	        mapRanked.className = "map"+[map];
	        
	        // Map Image
			var mapRankedImage = document.createElement('img');
			mapRankedImage.className = "map";
			if (localStorage.getItem("setInk") == 'notInked') {
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
            var mapRankedText = document.createElement('div');
            mapRankedText.className = "name";
            if (jpNameParser(mapName) == undefined) {
				mapRankedText.innerHTML = chrome.i18n.getMessage("unknown");		
			} else {
				mapRankedText.innerHTML = chrome.i18n.getMessage(jpNameParser(mapName));
			}
            mapRanked.appendChild(mapRankedText);
            
            // Append to the DOM
            divRanked.appendChild(mapRanked);
        }
        
        var separator = document.createElement('hr');
        eachRotation.appendChild(separator);
        
        // Append each rotation to the DOM
        document.getElementById('rotations').appendChild(eachRotation);
    }
}

document.getElementById('load').innerHTML = chrome.i18n.getMessage("loading");
init();