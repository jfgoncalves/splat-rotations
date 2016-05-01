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

function localize_options() {
  document.getElementById('timeFormatLabel').innerHTML = chrome.i18n.getMessage("timeFormatLabel");
  document.getElementById('12hoursLabel').innerHTML = chrome.i18n.getMessage("12hoursLabel");
  document.getElementById('24hoursLabel').innerHTML = chrome.i18n.getMessage("24hoursLabel");
  document.getElementById('regionLabel').innerHTML = chrome.i18n.getMessage("regionLabel");
  document.getElementById('regionJP').innerHTML = chrome.i18n.getMessage("regionJP");
  document.getElementById('regionNA').innerHTML = chrome.i18n.getMessage("regionNA");
  document.getElementById('regionEU').innerHTML = chrome.i18n.getMessage("regionEU");
  document.getElementById('mapsThumbnailsLabel').innerHTML = chrome.i18n.getMessage("mapsThumbnailsLabel");
  document.getElementById('mapsInked').innerHTML = chrome.i18n.getMessage("mapsInked");
  document.getElementById('mapsNotInked').innerHTML = chrome.i18n.getMessage("mapsNotInked");
  document.getElementById('offsetLabel').innerHTML = chrome.i18n.getMessage("offsetLabel");
  document.getElementById('warning').innerHTML = chrome.i18n.getMessage("offsetWarning");
}

localize_options();

var currentLang, timeValue, regionValue, inkedValue, offsetValue, time, region, setInk;

currentLang = chrome.i18n.getUILanguage();
timeValue = document.getElementById('timeFormat');
regionValue = document.getElementById('region');
inkedValue = document.getElementById('setInk');
offsetValue = document.getElementById('offset');

// Displays saved message when saved.

function saved_status() {
  document.getElementById("saved").innerHTML = '<div class="saved-inner animated fadeIn">'+chrome.i18n.getMessage("savedMessage")+'</div>';
}

// Listeners in case of change.

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

offsetValue.addEventListener('input', function() {
  setOffset = offsetValue.value;
  localStorage.setItem("offset", setOffset);
  saved_status();
});


// Restores select box and checkbox state using the preferences
// stored in localStorage.
function restore_options() {
  if (localStorage.getItem("timeFormat") === null) {
    localStorage.setItem("timeFormat", 24);
  }
  timeValue.value = localStorage.getItem("timeFormat");
  if (localStorage.getItem("region") === null) {
    localStorage.setItem("region", "na");
  }
  regionValue.value = localStorage.getItem("region");
  if (localStorage.getItem("setInk") === null) {
    localStorage.setItem("setInk", "inked");
  }
  inkedValue.value = localStorage.getItem("setInk");
  if (localStorage.getItem("offset") === null) {
    localStorage.setItem("offset", 0);
  }
  offsetValue.value = localStorage.getItem("offset");
}

// Load localStorage when the page is opened

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementsByTagName('html')[0].setAttribute('lang', currentLang.substring(0, 2));

// Shows translation help if partial language

if (currentLang === 'it' || currentLang === 'ja') {
  document.getElementById('translate').style.display = 'block';
}

// Disable time management for JA/DE users

if (currentLang === 'de' || currentLang === 'ja') {
  document.getElementById('timeFormat').disabled = 'true';
}
