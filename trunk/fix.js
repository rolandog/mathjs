/** 
 * fix.js
 * http://rolandog.com/math-js/
 *
 * License: Creative Commons Attribution-Share Alike 3.0 Unported.
 * http://creativecommons.org/licenses/by-sa/3.0/
 *
 * @projectDescription   A fix for displaying stuff on rolandog.com
 * @author               Rolando Garza rolandog@gmail.com
 */

"use strict";

/**
 * Gets a file and calls a function.
 * @param(Number) a A Number.
 */
http.get = function get(url) {
    var AJAX;
    if (window.XMLHttpRequest) {
        AJAX = new XMLHttpRequest();
    } else {
        AJAX = new ActiveXObject("Microsoft.XMLHTTP");
    }
    if (AJAX) {
        AJAX.open("GET", "http://rolandog.com/wp-content/uploads/2008/11/" + url, false);
        AJAX.send(null);
        return AJAX.responseText;
    } else {
        return false;
    }
};
