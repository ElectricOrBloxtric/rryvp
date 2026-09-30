// ==UserScript==
// @name         RRYVP
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Remove the border-radius from the YouTube video player and makes it fully Rectangle again
// @author       ElectricOrBloxtric
// @downloadURL  https://raw.githubusercontent.com/ElectricOrBloxtric/rryvp/main/rryvp.user.js
// @updateURL    https://raw.githubusercontent.com/ElectricOrBloxtric/rryvp/main/rryvp.user.js
// @match        *://*.youtube.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    const css = `
        ytd-thumbnail,
        ytd-thumbnail img,
        .ytThumbnailViewModelLarge,
        ytd-playlist-thumbnail,
        ytd-playlist-thumbnail img,
        .style-scope.ytd-rich-grid-media,
        .yt-core-image,
        .yt-core-image--fill-parent-height,
        .yt-core-image--fill-parent-width,
        ytd-moving-thumbnail-renderer,
        ytd-moving-thumbnail-renderer img,
        #thumbnail-container,
        #thumbnail-container img {
            border-radius: 0px !important;
        }

        #img {
            border-radius: 50% !important;
            object-fit: cover !important;
        }

        ytd-rich-grid-slim-media,
        ytd-rich-grid-slim-media ytd-thumbnail,
        ytd-reel-item-renderer,
        ytd-reel-item-renderer ytd-thumbnail,
        .ytd-reel-video-renderer img,
        .ytp-inline-preview-ui {
            border-radius: 0px !important;
        }

        ytd-watch-flexy,
        ytd-watch-flexy #ytd-player,
        ytd-watch-flexy[rounded-player-large] #ytd-player,
        #player-container-outer,
        #player-container-inner,
        .html5-video-player,
        .html5-main-video,
        #ytd-player,
        .ytp-inline-preview-scrim,
        .inline-preview-player {
            border-radius: 0px !important;
        }

        .ytp-ce-video,
        .ytp-ce-channel,
        .ytp-ce-playlist,
        .ytp-ce-expanding-overlay,
        .ytp-videowall-still,
        .ytp-videowall-still-image,
        .ytp-sb-subscribe,
        .ytp-sb-unsubscribe {
            border-radius: 0px !important;
        }

        ytd-miniplayer,
        ytd-miniplayer #player-container,
        ytd-miniplayer #video-container,
        ytd-miniplayer #card,
        #video-player-container,
        #miniplayer-bar {
            border-radius: 0px !important;
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