function localize_options() {

document.getElementById('timeFormatLabel').innerHTML = chrome.i18n.getMessage("timeFormatLabel");
document.getElementById('12hoursLabel').innerHTML = chrome.i18n.getMessage("12hoursLabel");
document.getElementById('24hoursLabel').innerHTML = chrome.i18n.getMessage("24hoursLabel");
document.getElementById('regionLabel').innerHTML = chrome.i18n.getMessage("regionLabel");
document.getElementById('regionJP').innerHTML = chrome.i18n.getMessage("regionJP");
document.getElementById('regionUS').innerHTML = chrome.i18n.getMessage("regionUS");
document.getElementById('regionEU').innerHTML = chrome.i18n.getMessage("regionEU");
document.getElementById('mapsThumbnailsLabel').innerHTML = chrome.i18n.getMessage("mapsThumbnailsLabel");
document.getElementById('mapsInked').innerHTML = chrome.i18n.getMessage("mapsInked");
document.getElementById('mapsNotInked').innerHTML = chrome.i18n.getMessage("mapsNotInked");

}

localize_options();
	
	var timeValue = document.getElementById('timeFormat');
	var regionValue = document.getElementById('region');
	var inkedValue = document.getElementById('setInk');
	
	timeValue.addEventListener('change', function() {
		var time = timeValue.value;
		localStorage.setItem("timeFormat", time);	
	});
	
	regionValue.addEventListener('change', function() {
		var region = regionValue.value;
		localStorage.setItem("region", region);
	});
	
	inkedValue.addEventListener('change', function() {
		var setInk = inkedValue.value;
		localStorage.setItem("setInk", setInk);		
	});

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    document.getElementById('timeFormat').value = localStorage.getItem("timeFormat");
    document.getElementById('region').value = localStorage.getItem("region");
    document.getElementById('setInk').value = localStorage.getItem("setInk");
}

document.addEventListener('DOMContentLoaded', restore_options);