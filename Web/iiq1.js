// ==UserScript==
// @name         GSD IIQ Custimizations
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Injects JS for GSD custimizations
// @author       Miko Brown
// @updateURL    URLHERE
// @include      https://domain.incidentiq.com/*
// @include      https://domain.iiqstaging.com/*
// @grant        none
// @run-at document-end
// ==/UserScript==

(function() {
    'use strict';

var scriptElem = document.createElement('script');
scriptElem.src = "URLTOIIQ2";
document.body.appendChild(scriptElem);


})();
