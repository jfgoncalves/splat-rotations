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

function localize_options() {

document.getElementById('select1').innerHTML = chrome.i18n.getMessage("select");
document.getElementById('select2').innerHTML = chrome.i18n.getMessage("select");
document.getElementById('select3').innerHTML = chrome.i18n.getMessage("select");
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

var timeValue, regionValue, inkedValue, time, region, setInk;

timeValue = document.getElementById('timeFormat');
regionValue = document.getElementById('region');
inkedValue = document.getElementById('setInk');

function saved_status() {
	document.getElementById("saved").innerHTML = '<div class="saved-inner animated fadeIn">'+chrome.i18n.getMessage("savedMessage")+'</div>';
}

timeValue.addEventListener('change', function() {
	time = timeValue.value;
	localStorage.setItem("timeFormat", time);
	saved_status();

});

regionValue.addEventListener('change', function() {
	region = regionValue.value;
	localStorage.setItem("region", region);
	saved_status();
});

inkedValue.addEventListener('change', function() {
	setInk = inkedValue.value;
	localStorage.setItem("setInk", setInk);
	saved_status();
});

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    document.getElementById('timeFormat').value = localStorage.getItem("timeFormat");
    document.getElementById('region').value = localStorage.getItem("region");
    document.getElementById('setInk').value = localStorage.getItem("setInk");
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementsByTagName('html')[0].setAttribute('lang', chrome.i18n.getUILanguage().substring(0, 2));
