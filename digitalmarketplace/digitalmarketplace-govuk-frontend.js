"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define('DMGOVUKFrontend', ['exports'], factory) : (global = global || self, factory(global.DMGOVUKFrontend = {}));
})(void 0, function (exports) {
  'use strict'; // used by the cookie banner component

  var DEFAULT_COOKIE_CONSENT = {
    analytics: false
  };
  var COOKIE_CATEGORIES = {
    _ga: 'analytics',
    _gid: 'analytics'
  };

  function getCookie(name) {
    var nameEQ = name + '=';
    var cookies = document.cookie.split(';');

    for (var i = 0, len = cookies.length; i < len; i++) {
      var cookie = cookies[i];

      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length);
      }

      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }

    return null;
  }
  /*
  Cookie methods
  ==============
   Usage:
     Setting a cookie:
    setCookie('hobnob', 'tasty', { days: 30 })
     Reading a cookie:
    getCookie('hobnob')
     Deleting a cookie:
    Cookie('hobnob', null)
  */


  function Cookie(name, value, options) {
    if (typeof value !== 'undefined') {
      if (value === false || value === null) {
        return setCookie(name, '', {
          days: -1
        });
      } else {
        // Default expiry date of 30 days
        if (typeof options === 'undefined') {
          options = {
            days: 30
          };
        }

        return setCookie(name, value, options);
      }
    } else {
      return getCookie(name);
    }
  }

  function getConsentCookie() {
    var consentCookie = getCookie('dm_cookies_policy');
    var consentCookieObj;

    if (consentCookie) {
      try {
        consentCookieObj = JSON.parse(consentCookie);
      } catch (err) {
        return null;
      }

      if (_typeof(consentCookieObj) !== 'object' && consentCookieObj !== null) {
        consentCookieObj = JSON.parse(consentCookieObj);
      }
    } else {
      return null;
    }

    return consentCookieObj;
  }

  function setConsentCookie(options) {
    var cookieConsent = getConsentCookie();

    if (!cookieConsent) {
      cookieConsent = JSON.parse(JSON.stringify(DEFAULT_COOKIE_CONSENT));
    }

    for (var cookieType in options) {
      cookieConsent[cookieType] = options[cookieType]; // Delete cookies of that type if consent being set to false

      if (!options[cookieType]) {
        for (var cookie in COOKIE_CATEGORIES) {
          if (COOKIE_CATEGORIES[cookie] === cookieType) {
            Cookie(cookie, null);

            if (Cookie(cookie)) {
              document.cookie = cookie + '=;expires=' + new Date() + ';domain=' + window.location.hostname.replace(/^www\./, '.') + ';path=/';
            }
          }
        }
      }
    }

    setCookie('dm_cookies_policy', JSON.stringify(cookieConsent), {
      days: 365
    });
  }

  function checkConsentCookieCategory(cookieName, cookieCategory) {
    var currentConsentCookie = getConsentCookie(); // If the consent cookie doesn't exist, but the cookie is in our known list, return true

    if (!currentConsentCookie && COOKIE_CATEGORIES[cookieName]) {
      return true;
    }

    currentConsentCookie = getConsentCookie(); // Sometimes currentConsentCookie is malformed in some of the tests, so we need to handle these

    try {
      return currentConsentCookie[cookieCategory];
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  function checkConsentCookie(cookieName, cookieValue) {
    // If we're setting the consent cookie OR deleting a cookie, allow by default
    if (cookieName === 'dm_cookies_policy' || cookieValue === null || cookieValue === false) {
      return true;
    }

    if (COOKIE_CATEGORIES[cookieName]) {
      var cookieCategory = COOKIE_CATEGORIES[cookieName];
      return checkConsentCookieCategory(cookieName, cookieCategory);
    } else {
      // Deny the cookie if it is not known to us
      return false;
    }
  } // Usage :
  // Setting a cookie:
  // Cookie('hobnob', 'tasty', { days: 30 })


  function setCookie(name, value, options) {
    if (checkConsentCookie(name, value)) {
      if (typeof options === 'undefined') {
        options = {};
      }

      var cookieString = name + '=' + value + '; path=/';

      if (options.days) {
        var date = new Date();
        date.setTime(date.getTime() + options.days * 24 * 60 * 60 * 1000);
        cookieString = cookieString + '; expires=' + date.toGMTString();
      }

      if (document.location.protocol === 'https:') {
        cookieString = cookieString + '; Secure';
      }

      document.cookie = cookieString;
    }
  } // Stripped-down wrapper for Google Analytics, based on:
  // https://github.com/alphagov/static/blob/master/doc/analytics.md


  function SetupAnalytics(config) {
    window.ga('create', config.trackingId, config.cookieDomain, config.name, {
      cookieExpires: config.expires * 24 * 60 * 60
    });
    window.ga('set', 'anonymizeIp', config.anonymizeIp);
    window.ga('set', 'displayFeaturesTask', config.displayFeaturesTask);
    window.ga('set', 'transport', config.transport);
  }

  function LoadGoogleAnalytics() {
    /* eslint-disable */
    // Copied from Google Analytics installation instructions

    /* jshint ignore:start */
    (function (i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r;
      i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments);
      }, i[r].l = 1 * new Date();
      a = s.createElement(o), m = s.getElementsByTagName(o)[0];
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
    /* jshint ignore:end */

  }

  function TrackPageview(path, title, options) {
    var page = window.location.pathname + window.location.search;
    window.ga('send', 'pageview', page);
  } // https://developers.google.com/analytics/devguides/collection/analyticsjs/events


  function TrackEvent(category, action, options) {
    options = options || {};
    var evt = {
      eventCategory: category,
      eventAction: action
    };

    if (options.label) {
      evt.eventLabel = options.label;
      delete options.label;
    }

    if (_typeof(options) === 'object') {
      Object.assign(evt, options);
    }

    window.ga('send', 'event', evt);
  }

  var analytics =
  /*#__PURE__*/
  Object.freeze({
    __proto__: null,
    SetupAnalytics: SetupAnalytics,
    LoadGoogleAnalytics: LoadGoogleAnalytics,
    TrackPageview: TrackPageview,
    TrackEvent: TrackEvent
  });
  window.DMGOVUKFrontend = window.DMGOVUKFrontend || {}; // TODO: Remove hard coded tracking ID to make this more generic and useful to others

  var trackingId = 'UA-26179049-1';
  window["ga-disable-".concat(trackingId)] = true;

  function InitialiseAnalytics() {
    // guard against being called more than once
    if (!('analytics' in window.DMGOVUKFrontend)) {
      window["ga-disable-".concat(trackingId)] = false; // TODO: Check if we still need this hack for the domain

      var cookieDomain = document.domain === 'www.digitalmarketplace.service.gov.uk' ? '.digitalmarketplace.service.gov.uk' : document.domain; // Load Analytics libraries

      LoadGoogleAnalytics(); // Configure profiles and make interface public
      // for custom dimensions, virtual pageviews and events

      window.DMGOVUKFrontend.analytics = new SetupAnalytics({
        trackingId: trackingId,
        cookieDomain: cookieDomain,
        anonymizeIp: true,
        displayFeaturesTask: null,
        transport: 'beacon',
        name: 'DMGOVUKFrontend.analytics',
        expires: 365
      }); // Track initial pageview

      TrackPageview();
    }
  }

  var CookieBanner = function CookieBanner($module) {
    this.$module = $module;
  };

  CookieBanner.prototype.clearOldCookies = function () {
    // clear any cookies set by the previous version
    var oldCookies = ['seen_cookie_message', '_ga', '_gid'];

    for (var i = 0; i < oldCookies.length; i++) {
      if (getCookie(oldCookies[i])) {
        var cookieString = oldCookies[i] + '=;expires=' + new Date() + ';domain=' + window.location.hostname.replace(/^www\./, '.') + ';path=/';
        document.cookie = cookieString;
      }
    }
  };

  CookieBanner.prototype.init = function ($module) {
    this.$module.hideCookieMessage = this.hideCookieMessage.bind(this);
    this.$module.showConfirmationMessage = this.showConfirmationMessage.bind(this);
    this.$module.setCookieConsent = this.setCookieConsent.bind(this);
    this.$module.cookieBanner = document.querySelector('.dm-cookie-banner');
    this.$module.cookieBannerConfirmationMessage = this.$module.querySelector('.dm-cookie-banner__confirmation');
    this.setupCookieMessage();
  };

  CookieBanner.prototype.setupCookieMessage = function () {
    var _this = this;

    this.$hideLink = this.$module.querySelector('button[data-hide-cookie-banner]');

    if (this.$hideLink) {
      this.$hideLink.addEventListener('click', this.$module.hideCookieMessage);
    }

    this.$acceptCookiesLink = this.$module.querySelector('button[data-accept-cookies=true]');

    if (this.$acceptCookiesLink) {
      this.$acceptCookiesLink.addEventListener('click', function () {
        return _this.$module.setCookieConsent(true);
      });
    }

    this.$rejectCookiesLink = this.$module.querySelector('button[data-accept-cookies=false]');

    if (this.$rejectCookiesLink) {
      this.$rejectCookiesLink.addEventListener('click', function () {
        return _this.$module.setCookieConsent(false);
      });
    }

    this.showCookieMessage();
  };

  CookieBanner.prototype.showCookieMessage = function () {
    // Show the cookie banner if policy cookie not set
    var hasCookiesPolicy = getCookie('dm_cookies_policy');

    if (this.$module && !hasCookiesPolicy) {
      this.$module.style.display = 'block';
    }
  };

  CookieBanner.prototype.hideCookieMessage = function (event) {
    if (this.$module) {
      this.$module.style.display = 'none';
    }

    if (event.target) {
      event.preventDefault();
    }
  };

  CookieBanner.prototype.setCookieConsent = function (analyticsConsent) {
    setConsentCookie({
      analytics: analyticsConsent
    });
    this.$module.showConfirmationMessage(analyticsConsent);
    this.$module.cookieBannerConfirmationMessage.focus();

    if (analyticsConsent) {
      InitialiseAnalytics();
    }
  };

  CookieBanner.prototype.showConfirmationMessage = function (analyticsConsent) {
    var messagePrefix = analyticsConsent ? 'You’ve accepted analytics cookies.' : 'You told us not to use analytics cookies.';
    this.$cookieBannerMainContent = document.querySelector('.dm-cookie-banner__wrapper');
    this.$cookieBannerConfirmationMessage = document.querySelector('.dm-cookie-banner__confirmation-message');
    this.$cookieBannerConfirmationMessage.insertAdjacentText('afterbegin', messagePrefix);
    this.$cookieBannerMainContent.style.display = 'none';
    this.$module.cookieBannerConfirmationMessage.style.display = 'block';
  }; // Javascript code to support the Cookie Settings page


  function CookieSettings($module) {
    this.$module = $module;
  }

  CookieSettings.prototype.init = function () {
    this.$module.submitSettingsForm = this.submitSettingsForm.bind(this);
    this.$module.addEventListener('submit', this.$module.submitSettingsForm); // Ensure there aren't two forms for setting cookie preferences on the same page

    this.hideCookieBanner();
    this.setInitialFormValues();
  };

  CookieSettings.prototype.setInitialFormValues = function () {
    var currentConsentCookie = getCookie('dm_cookies_policy');

    if (!currentConsentCookie) {
      // Don't populate the form
      return;
    }

    this.hideWarningMessage(); // Populate the form with the existing choice

    var radioButton;

    if (currentConsentCookie.analytics) {
      radioButton = this.$module.querySelector('input[name=cookies-analytics][value=On]');
    } else {
      radioButton = this.$module.querySelector('input[name=cookies-analytics][value=Off]');
    }

    radioButton.checked = true;
  };

  CookieSettings.prototype.submitSettingsForm = function (event) {
    event.preventDefault();
    var formInputs = event.target.querySelectorAll('input[name=cookies-analytics]');
    var options = {}; // Retrieve the selected value from the form inputs

    for (var i = 0; i < formInputs.length; i++) {
      var input = formInputs[i];

      if (input.checked) {
        var value = input.value === 'On';
        options.analytics = value;
        break;
      }
    } // the cookie choice must be set when form is submitted


    if (options.analytics === undefined) {
      this.showErrorMessage();
      return false;
    } // Set the analytics cookie preferences
    // If 'Off' option not checked, this function will also delete any existing Google Analytics cookies


    setConsentCookie(options); // If 'On' option checked and analytics not yet present,
    // initialise Analytics (this includes firing the initial pageview)

    if (options.analytics && !window.DMGOVUKFrontend.analytics) {
      InitialiseAnalytics();
    }

    this.hideWarningMessage();
    this.hideErrorMessage();
    this.showConfirmationMessage();
    return false;
  };

  CookieSettings.prototype.showConfirmationMessage = function () {
    var confirmationMessage = document.querySelector('#dm-cookie-settings-confirmation');
    var previousPageLink = document.querySelector('.dm-cookie-settings__prev-page');
    var referrer = CookieSettings.prototype.getReferrerLink();
    document.body.scrollTop = document.documentElement.scrollTop = 0;

    if (referrer && referrer !== document.location.pathname) {
      previousPageLink.href = referrer;
      previousPageLink.style.display = 'block';
    } else {
      previousPageLink.style.display = 'none';
    }

    confirmationMessage.style.display = 'block';
  };

  CookieSettings.prototype.showErrorMessage = function () {
    var errorMessage = document.querySelector('#dm-cookie-settings-error');

    if (errorMessage !== null) {
      errorMessage.style.display = 'block';
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
  };

  CookieSettings.prototype.hideErrorMessage = function () {
    var errorMessage = document.querySelector('#dm-cookie-settings-error');

    if (errorMessage !== null) {
      errorMessage.style.display = 'none';
    }
  };

  CookieSettings.prototype.hideWarningMessage = function () {
    var warningMessage = document.querySelector('#dm-cookie-settings-warning');

    if (warningMessage !== null) {
      warningMessage.style.display = 'none';
    }
  };

  CookieSettings.prototype.hideCookieBanner = function () {
    var cookieBanner = document.querySelector('.dm-cookie-banner');

    if (cookieBanner !== null) {
      cookieBanner.style.display = 'none';
    }
  };

  CookieSettings.prototype.getReferrerLink = function () {
    return document.referrer ? new URL(document.referrer).pathname : false;
  };

  function initAll(options) {
    var $cookieBanner = document.querySelector('[data-module="dm-cookie-banner"]');

    if ($cookieBanner) {
      new CookieBanner($cookieBanner).init();
    }

    var $cookieSettingsPage = document.querySelector('[data-module="dm-cookie-settings"]');

    if ($cookieSettingsPage) {
      new CookieSettings($cookieSettingsPage).init();
    }
  }

  exports.Analytics = analytics;
  exports.CookieBanner = CookieBanner;
  exports.CookieSettings = CookieSettings;
  exports.initAll = initAll;
  exports.initAnalytics = InitialiseAnalytics;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});