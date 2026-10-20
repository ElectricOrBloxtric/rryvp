// ==UserScript==
// @name         Return Rectangle YouTube Video Player
// @namespace    https://github.com/ElectricOrBloxtric/rryvp
// @version      2.7
// @description  Remove the border-radius from the YouTube video player and makes it fully rectangle again
// @author       ElectricOrBloxtric
// @license      MIT
// @downloadURL  https://raw.githubusercontent.com/ElectricOrBloxtric/rryvp/main/rryvp.user.js
// @updateURL    https://raw.githubusercontent.com/ElectricOrBloxtric/rryvp/main/rryvp.user.js
// @match        *://www.youtube.com/*
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

        #experiment-overlay > ytd-reel-player-overlay-renderer-cow > yt-reel-player-overlay-view-model > div.ytReelPlayerOverlayViewModelMetadataContainer.ytReelPlayerOverlayViewModelMetadataContainerRounded > div > yt-reel-metapanel-view-model > div:nth-child(1) > yt-reel-channel-bar-view-model > yt-decorated-avatar-view-model > yt-avatar-shape,
        #experiment-overlay > ytd-reel-player-overlay-renderer-cow > yt-reel-player-overlay-view-model > div.ytReelPlayerOverlayViewModelMetadataContainer.ytReelPlayerOverlayViewModelMetadataContainerRounded > div > yt-reel-metapanel-view-model > div:nth-child(1) > yt-reel-channel-bar-view-model > yt-decorated-avatar-view-model > yt-avatar-shape > div,
        #experiment-overlay > ytd-reel-player-overlay-renderer-cow > yt-reel-player-overlay-view-model > div.ytReelPlayerOverlayViewModelMetadataContainer.ytReelPlayerOverlayViewModelMetadataContainerRounded > div > yt-reel-metapanel-view-model > div:nth-child(1) > yt-reel-channel-bar-view-model > yt-decorated-avatar-view-model > yt-avatar-shape > div > div,
        #experiment-overlay > ytd-reel-player-overlay-renderer-cow > yt-reel-player-overlay-view-model > div.ytReelPlayerOverlayViewModelMetadataContainer.ytReelPlayerOverlayViewModelMetadataContainerRounded > div > yt-reel-metapanel-view-model > div:nth-child(1) > yt-reel-channel-bar-view-model > yt-decorated-avatar-view-model > yt-avatar-shape > div > div > div,
        #experiment-overlay > ytd-reel-player-overlay-renderer-cow > yt-reel-player-overlay-view-model > div.ytReelPlayerOverlayViewModelMetadataContainer.ytReelPlayerOverlayViewModelMetadataContainerRounded > div > yt-reel-metapanel-view-model > div:nth-child(1) > yt-reel-channel-bar-view-model > yt-decorated-avatar-view-model > yt-avatar-shape > div > div > div > div {
            border-radius: 50% !important;
            overflow: hidden !important;
            object-fit: cover !important;
        }

        ytd-reel-player-overlay-renderer-cow yt-decorated-avatar-view-model yt-avatar-shape,
        ytd-reel-player-overlay-renderer-cow yt-decorated-avatar-view-model yt-avatar-shape * {
            border-radius: 50% !important;
            overflow: hidden !important;
            object-fit: cover !important;
        }

        #img {
            border-radius: 50% !important;
            object-fit: cover !important;
        }

        html.rryvp-post-page #img {
            border-radius: 0px !important;
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

    const reelChannelAvatarSelector = "ytd-reel-player-overlay-renderer-cow yt-decorated-avatar-view-model";

    function updatePostImageShape() {
        const path = window.location.pathname;
        const isPostPage = path === "/post" ||
            path.startsWith("/post/") ||
            /\/posts(?:\/|$)/.test(path);

        document.documentElement.classList.toggle("rryvp-post-page", isPostPage);
    }

    function enforceReelChannelAvatarShape() {
        const avatars = document.querySelectorAll(reelChannelAvatarSelector);
        if (!avatars.length) {
            return;
        }

        avatars.forEach(avatar => {
            avatar.querySelectorAll("yt-avatar-shape, yt-avatar-shape *").forEach(element => {
                element.style.setProperty("border-radius", "50%", "important");
                element.style.setProperty("overflow", "hidden", "important");
                element.style.setProperty("object-fit", "cover", "important");
            });
        });
    }

    const observer = new MutationObserver(debounce(() => {
        enforceReelChannelAvatarShape();

        document.querySelectorAll("[style*='border-radius']").forEach(el => {
            if (el.closest("ytd-reel-player-overlay-renderer-cow yt-decorated-avatar-view-model")) {
                return;
            }

            if (el.style.borderRadius && el.style.borderRadius !== "0px") {
                el.style.borderRadius = "0px";
            }
        });
    }, 500));

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class", "style"],
        characterData: false
    });

    updatePostImageShape();
    enforceReelChannelAvatarShape();

    window.addEventListener("popstate", updatePostImageShape);
    window.addEventListener("yt-navigate-finish", updatePostImageShape);
    window.addEventListener("beforeunload", () => observer.disconnect());
})();