// Get Splatoon map rotations using the Splatoon.ink API

function retrieveRotations() {
	
	// Retrieve JSON file
	var AJAX_req = new XMLHttpRequest();
	var noCacheJSON = new Date().getTime();
	AJAX_req.open("GET", 'https://splatoon.ink/schedule.json?c='+noCacheJSON, true);
	AJAX_req.setRequestHeader("Content-type", "application/json");
	
	AJAX_req.onreadystatechange = function() {
		
		// Check if splatoon.ink is up and running
		if(AJAX_req.readyState == 4 && AJAX_req.status == 200) {
			
			// Parse JSON
			var json = JSON.parse(AJAX_req.responseText)
			parseRotations(json);
		}
	}
	AJAX_req.send(null);
}

// Parse acquired data

function parseRotations(data) {
    var updateTime = data.updateTime;
    var schedule = data.schedule;

	document.getElementById('rotations').innerHTML = "";
	
    for (rotation in schedule) {
	    // Set data
    	var startTime = new Date(schedule[rotation].startTime);
    	var endTime = new Date(schedule[rotation].endTime);
    	var nextRotation;
    	
        var regular = schedule[rotation].regular.maps;
        var ranked = schedule[rotation].ranked.maps;
        var rankedMode = schedule[rotation].ranked.rulesEN;
        
    	if ([rotation] == 0) {
	    	nextRotation = chrome.i18n.getMessage("currentRotation");
	    	
    	} else if (navigator.language.substring(0, 2) == 'en') {
	    	nextRotation = chrome.i18n.getMessage("nextRotation")+startTime.toLocaleTimeString('en-US').replace(':00 ', ' ');
    	} else {
	    	nextRotation = chrome.i18n.getMessage("nextRotation")+startTime.toLocaleTimeString('fr-FR').replace(':00:00', 'h00');
    	}
        
        // Set DOM
        var eachRotation = document.createElement('div');
        eachRotation.id = [rotation];
        
        var timeRotation = document.createElement('div');
        timeRotation.className = "time rotation"+[rotation];
        timeRotation.innerHTML = nextRotation;
        eachRotation.appendChild(timeRotation);
        
        var divRegular = document.createElement('div');
        divRegular.className = "regular";
        eachRotation.appendChild(divRegular);
        var h1Regular = document.createElement('h1');
        h1Regular.innerHTML = chrome.i18n.getMessage("regularBattle");
        divRegular.appendChild(h1Regular);
        
        var divRanked = document.createElement('div');
        divRanked.className = "ranked";
        eachRotation.appendChild(divRanked);
        var h1Ranked = document.createElement('h1');
        h1Ranked.innerHTML = chrome.i18n.getMessage("rankedBattle");
        divRanked.appendChild(h1Ranked);
        
        // Set ranked mode
        var divRankedMode = document.createElement('div');
        divRankedMode.className = "mode "+String(rankedMode).split(' ')[0].toLowerCase();
        divRankedMode.innerHTML = chrome.i18n.getMessage(String(rankedMode).split(' ')[0].toLowerCase());
        divRanked.appendChild(divRankedMode);
        
        // Regular loop
        for (map in regular) {
	        
	        // Data
	        var mapName = regular[map].nameEN;
            var mapRegular = document.createElement('div');
            mapRegular.className = "map"+[map];
            
        	// Map Image
			var mapRegularImage = document.createElement('img');
			mapRegularImage.className = "map";
			mapRegularImage.src = "assets/stages/"+String(mapName).split(' ')[0]+".jpg";
			mapRegular.appendChild(mapRegularImage);
            
            // Map Name
            var mapRegularText = document.createElement('div');
            mapRegularText.className = "name";
            mapRegularText.innerHTML = chrome.i18n.getMessage(String(mapName).split(' ')[0].toLowerCase());
            mapRegular.appendChild(mapRegularText);
            
            // Add all of this to the DOM
            divRegular.appendChild(mapRegular);
        }
        
        // Ranked Loop
        for (map in ranked) {
	        var mapName = ranked[map].nameEN;
	        var mapRanked = document.createElement('div');
	        mapRanked.className = "map"+[map];
	        
	        // Map Image
			var mapRankedImage = document.createElement('img');
			mapRankedImage.className = "map";
			mapRankedImage.src = "assets/stages/"+String(mapName).split(' ')[0]+".jpg";
			mapRanked.appendChild(mapRankedImage);
			
			// Map Name
            var mapRankedText = document.createElement('div');
            mapRankedText.className = "name";
            mapRankedText.innerHTML = chrome.i18n.getMessage(String(mapName).split(' ')[0].toLowerCase());
            mapRanked.appendChild(mapRankedText);
            
            // Add all of this to the DOM
            divRanked.appendChild(mapRanked);
        }
        
        var separator = document.createElement('hr');
        eachRotation.appendChild(separator);
        
        // Add everything to the document
        document.getElementById('rotations').appendChild(eachRotation);
    }
}

document.getElementById('load').innerHTML = chrome.i18n.getMessage("loading");
retrieveRotations();