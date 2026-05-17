// ==UserScript==
// @name         Return Rectangle YouTube Video Player
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Remove the border-radius from the YouTube video player and makes it fully Rectangle again
// @author       ElectricOrBloxtric
// @match        *://*.youtube.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        #ytd-player,
        #movie_player,
        .html5-video-player,
        .ytp-player-container,
        [data-player-container],
        yt-player,
        .yt-core-image,
        img[alt*="thumbnail"] {
            border-radius: 0 !important;
        }
    `;

    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        const style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);
    }

    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    }

    const observer = new MutationObserver(debounce(() => {
        document.querySelectorAll("[style*='border-radius']").forEach(el => {
            if (el.style.borderRadius && el.style.borderRadius !== "0px") {
                el.style.borderRadius = "0px";
            }
        });
    }, 500));

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    window.addEventListener("beforeunload", () => observer.disconnect());
})();