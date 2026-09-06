(function () {
  "use strict";

  var CONTACT_MODULE = "Contacts";

  // GeoNames requires a free account: sign up at https://www.geonames.org/login,
  // then enable "Free Web Services" under My Account, and paste your username here.
  var GEONAMES_USERNAME = "dansnf";

  // Zippopotam.us indexes some countries at a coarser precision than their
  // real postal-code format — confirmed live against api.zippopotam.us:
  //   CA: only the 3-char FSA prefix ("G2E 0A8" 404s, "G2E" resolves)
  //   GB: only the outward code       ("SW1A 1AA" 404s, "SW1A" resolves)
  //   NL: only the numeric prefix     ("1012 AB" 404s, "1012" resolves)
  // GeoNames gets the postal code untouched — it has full precision.
  var ZIPPOPOTAM_NORMALIZERS = {
    CA: function (zip) { return zip.replace(/\s+/g, "").slice(0, 3).toUpperCase(); },
    GB: function (zip) { return zip.split(/\s+/)[0].toUpperCase(); },
    NL: function (zip) { return zip.split(/\s+/)[0]; }
  };

  function normalizeForZippopotam(zip, countryCode) {
    var fn = ZIPPOPOTAM_NORMALIZERS[countryCode];
    return fn ? fn(zip) : zip;
  }

  // Full list so the user can always set a contact's real country, even for
  // countries GeoNames has thin or no postal-code data for (in that case the
  // lookup just fails gracefully and the user types city/state by hand).
  var COUNTRIES = [
    { code: "AF", name: "Afghanistan" },
    { code: "AL", name: "Albania" },
    { code: "DZ", name: "Algeria" },
    { code: "AD", name: "Andorra" },
    { code: "AO", name: "Angola" },
    { code: "AG", name: "Antigua and Barbuda" },
    { code: "AR", name: "Argentina" },
    { code: "AM", name: "Armenia" },
    { code: "AU", name: "Australia" },
    { code: "AT", name: "Austria" },
    { code: "AZ", name: "Azerbaijan" },
    { code: "BS", name: "Bahamas" },
    { code: "BH", name: "Bahrain" },
    { code: "BD", name: "Bangladesh" },
    { code: "BB", name: "Barbados" },
    { code: "BY", name: "Belarus" },
    { code: "BE", name: "Belgium" },
    { code: "BZ", name: "Belize" },
    { code: "BJ", name: "Benin" },
    { code: "BT", name: "Bhutan" },
    { code: "BO", name: "Bolivia" },
    { code: "BA", name: "Bosnia and Herzegovina" },
    { code: "BW", name: "Botswana" },
    { code: "BR", name: "Brazil" },
    { code: "BN", name: "Brunei" },
    { code: "BG", name: "Bulgaria" },
    { code: "BF", name: "Burkina Faso" },
    { code: "BI", name: "Burundi" },
    { code: "CV", name: "Cabo Verde" },
    { code: "KH", name: "Cambodia" },
    { code: "CM", name: "Cameroon" },
    { code: "CA", name: "Canada" },
    { code: "CF", name: "Central African Republic" },
    { code: "TD", name: "Chad" },
    { code: "CL", name: "Chile" },
    { code: "CN", name: "China" },
    { code: "CO", name: "Colombia" },
    { code: "KM", name: "Comoros" },
    { code: "CR", name: "Costa Rica" },
    { code: "HR", name: "Croatia" },
    { code: "CU", name: "Cuba" },
    { code: "CY", name: "Cyprus" },
    { code: "CZ", name: "Czech Republic" },
    { code: "CD", name: "Democratic Republic of the Congo" },
    { code: "DK", name: "Denmark" },
    { code: "DJ", name: "Djibouti" },
    { code: "DM", name: "Dominica" },
    { code: "DO", name: "Dominican Republic" },
    { code: "EC", name: "Ecuador" },
    { code: "EG", name: "Egypt" },
    { code: "SV", name: "El Salvador" },
    { code: "GQ", name: "Equatorial Guinea" },
    { code: "ER", name: "Eritrea" },
    { code: "EE", name: "Estonia" },
    { code: "SZ", name: "Eswatini (Swaziland)" },
    { code: "ET", name: "Ethiopia" },
    { code: "FJ", name: "Fiji" },
    { code: "FI", name: "Finland" },
    { code: "FR", name: "France" },
    { code: "GA", name: "Gabon" },
    { code: "GM", name: "Gambia" },
    { code: "GE", name: "Georgia" },
    { code: "DE", name: "Germany" },
    { code: "GH", name: "Ghana" },
    { code: "GR", name: "Greece" },
    { code: "GD", name: "Grenada" },
    { code: "GT", name: "Guatemala" },
    { code: "GN", name: "Guinea" },
    { code: "GW", name: "Guinea-Bissau" },
    { code: "GY", name: "Guyana" },
    { code: "HT", name: "Haiti" },
    { code: "HN", name: "Honduras" },
    { code: "HU", name: "Hungary" },
    { code: "IS", name: "Iceland" },
    { code: "IN", name: "India" },
    { code: "ID", name: "Indonesia" },
    { code: "IR", name: "Iran" },
    { code: "IQ", name: "Iraq" },
    { code: "IE", name: "Ireland" },
    { code: "IL", name: "Israel" },
    { code: "IT", name: "Italy" },
    { code: "CI", name: "Ivory Coast" },
    { code: "JM", name: "Jamaica" },
    { code: "JP", name: "Japan" },
    { code: "JO", name: "Jordan" },
    { code: "KZ", name: "Kazakhstan" },
    { code: "KE", name: "Kenya" },
    { code: "KI", name: "Kiribati" },
    { code: "KW", name: "Kuwait" },
    { code: "KG", name: "Kyrgyzstan" },
    { code: "LA", name: "Laos" },
    { code: "LV", name: "Latvia" },
    { code: "LB", name: "Lebanon" },
    { code: "LS", name: "Lesotho" },
    { code: "LR", name: "Liberia" },
    { code: "LY", name: "Libya" },
    { code: "LI", name: "Liechtenstein" },
    { code: "LT", name: "Lithuania" },
    { code: "LU", name: "Luxembourg" },
    { code: "MG", name: "Madagascar" },
    { code: "MW", name: "Malawi" },
    { code: "MY", name: "Malaysia" },
    { code: "MV", name: "Maldives" },
    { code: "ML", name: "Mali" },
    { code: "MT", name: "Malta" },
    { code: "MH", name: "Marshall Islands" },
    { code: "MR", name: "Mauritania" },
    { code: "MU", name: "Mauritius" },
    { code: "MX", name: "Mexico" },
    { code: "FM", name: "Micronesia" },
    { code: "MD", name: "Moldova" },
    { code: "MC", name: "Monaco" },
    { code: "MN", name: "Mongolia" },
    { code: "ME", name: "Montenegro" },
    { code: "MA", name: "Morocco" },
    { code: "MZ", name: "Mozambique" },
    { code: "MM", name: "Myanmar (Burma)" },
    { code: "NA", name: "Namibia" },
    { code: "NR", name: "Nauru" },
    { code: "NP", name: "Nepal" },
    { code: "NL", name: "Netherlands" },
    { code: "NZ", name: "New Zealand" },
    { code: "NI", name: "Nicaragua" },
    { code: "NE", name: "Niger" },
    { code: "NG", name: "Nigeria" },
    { code: "KP", name: "North Korea" },
    { code: "MK", name: "North Macedonia" },
    { code: "NO", name: "Norway" },
    { code: "OM", name: "Oman" },
    { code: "PK", name: "Pakistan" },
    { code: "PW", name: "Palau" },
    { code: "PA", name: "Panama" },
    { code: "PG", name: "Papua New Guinea" },
    { code: "PY", name: "Paraguay" },
    { code: "PE", name: "Peru" },
    { code: "PH", name: "Philippines" },
    { code: "PL", name: "Poland" },
    { code: "PT", name: "Portugal" },
    { code: "QA", name: "Qatar" },
    { code: "CG", name: "Republic of the Congo" },
    { code: "RO", name: "Romania" },
    { code: "RU", name: "Russia" },
    { code: "RW", name: "Rwanda" },
    { code: "KN", name: "Saint Kitts and Nevis" },
    { code: "LC", name: "Saint Lucia" },
    { code: "VC", name: "Saint Vincent and the Grenadines" },
    { code: "WS", name: "Samoa" },
    { code: "SM", name: "San Marino" },
    { code: "ST", name: "Sao Tome and Principe" },
    { code: "SA", name: "Saudi Arabia" },
    { code: "SN", name: "Senegal" },
    { code: "RS", name: "Serbia" },
    { code: "SC", name: "Seychelles" },
    { code: "SL", name: "Sierra Leone" },
    { code: "SG", name: "Singapore" },
    { code: "SK", name: "Slovakia" },
    { code: "SI", name: "Slovenia" },
    { code: "SB", name: "Solomon Islands" },
    { code: "SO", name: "Somalia" },
    { code: "ZA", name: "South Africa" },
    { code: "KR", name: "South Korea" },
    { code: "SS", name: "South Sudan" },
    { code: "ES", name: "Spain" },
    { code: "LK", name: "Sri Lanka" },
    { code: "SD", name: "Sudan" },
    { code: "SR", name: "Suriname" },
    { code: "SE", name: "Sweden" },
    { code: "CH", name: "Switzerland" },
    { code: "SY", name: "Syria" },
    { code: "TW", name: "Taiwan" },
    { code: "TJ", name: "Tajikistan" },
    { code: "TZ", name: "Tanzania" },
    { code: "TH", name: "Thailand" },
    { code: "TL", name: "Timor-Leste" },
    { code: "TG", name: "Togo" },
    { code: "TO", name: "Tonga" },
    { code: "TT", name: "Trinidad and Tobago" },
    { code: "TN", name: "Tunisia" },
    { code: "TR", name: "Turkey" },
    { code: "TM", name: "Turkmenistan" },
    { code: "TV", name: "Tuvalu" },
    { code: "UG", name: "Uganda" },
    { code: "UA", name: "Ukraine" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "GB", name: "United Kingdom" },
    { code: "US", name: "United States" },
    { code: "UY", name: "Uruguay" },
    { code: "UZ", name: "Uzbekistan" },
    { code: "VU", name: "Vanuatu" },
    { code: "VA", name: "Vatican City" },
    { code: "VE", name: "Venezuela" },
    { code: "VN", name: "Vietnam" },
    { code: "YE", name: "Yemen" },
    { code: "ZM", name: "Zambia" },
    { code: "ZW", name: "Zimbabwe" }
  ];

  var ZIP_LOOKUP_DEBOUNCE_MS = 600;
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var REQUIRED_FIELDS = ["firstName", "email"];

  var els = {};
  var state = {
    recordId: null,
    saved: null,
    saving: false,
    // undefined = untouched this edit session (preserve saved coords);
    // null = explicitly cleared (lookup failed or address changed);
    // {lat, lng} = a fresh successful lookup this session.
    pendingCoords: undefined
  };
  var zipDebounceTimer = null;

  // Country combobox: a plain text input plus a filtered suggestion list —
  // .code is set either when the user picks a suggestion (click or Enter) or
  // programmatically, when a postal-code lookup resolves to exactly one
  // country (see lookupWithoutCountry) — never from raw typed text, so it
  // can't drift out of sync with the ISO code the rest of the app relies on.
  var countryState = {
    code: "",
    matches: [],
    activeIndex: -1
  };

  document.addEventListener("DOMContentLoaded", function () {
    cacheEls();
    bindEvents();
    initZoho();

    // Opened directly in a tab (e.g. just to trust the local dev cert), not
    // embedded inside a CRM record — the SDK has no parent CRM page to
    // handshake with, so PageLoad never fires and the spinner would spin
    // forever with no explanation. Say so instead.
    if (window.self === window.top) {
      window.setTimeout(function () {
        if (!state.saved) {
          showLoadError("This widget needs to be opened embedded inside a Contact in Zoho CRM — opening this URL directly is only useful for trusting the local certificate.");
        }
      }, 2500);
    }
  });

  function cacheEls() {
    els.card = document.getElementById("card");
    els.loading = document.getElementById("loadingState");
    els.form = document.getElementById("contactForm");
    els.editBtn = document.getElementById("editBtn");
    els.cancelBtn = document.getElementById("cancelBtn");
    els.saveBtn = document.getElementById("saveBtn");
    els.editFooter = document.getElementById("editFooter");
    els.statusPill = document.getElementById("statusPill");
    els.lookupStatus = document.getElementById("lookupStatus");

    els.firstName = document.getElementById("firstName");
    els.lastName = document.getElementById("lastName");
    els.phone = document.getElementById("phone");
    els.email = document.getElementById("email");
    els.street = document.getElementById("street");
    els.flatNumber = document.getElementById("flatNumber");
    els.countryCombobox = document.getElementById("countryCombobox");
    els.country = document.getElementById("country");
    els.countryList = document.getElementById("countryListbox");
    els.zip = document.getElementById("zip");
    els.city = document.getElementById("city");
    els.state = document.getElementById("state");
    els.cityBadge = document.getElementById("cityBadge");
    els.stateBadge = document.getElementById("stateBadge");
  }

  function bindEvents() {
    els.editBtn.addEventListener("click", enterEditMode);
    els.cancelBtn.addEventListener("click", exitEditMode);
    els.form.addEventListener("submit", handleSave);
    els.zip.addEventListener("input", scheduleZipLookup);
    els.zip.addEventListener("blur", handleZipLookup);
    els.zip.addEventListener("keydown", function (evt) {
      if (evt.key === "Enter") {
        evt.preventDefault();
        handleZipLookup();
      }
    });

    els.country.addEventListener("focus", openCountryList);
    els.country.addEventListener("click", openCountryList);
    els.country.addEventListener("input", handleCountryInput);
    els.country.addEventListener("keydown", handleCountryKeydown);
    els.country.addEventListener("blur", handleCountryBlur);
    document.addEventListener("click", function (evt) {
      if (!els.countryCombobox.contains(evt.target)) closeCountryList();
    });

    REQUIRED_FIELDS.forEach(function (key) {
      els[key].addEventListener("input", function () {
        clearFieldError(key);
      });
    });
  }

  // --- Country combobox -----------------------------------------------

  // Matches for the current text: the full list when empty, so focusing (or
  // clicking) an untouched field browses all ~195 countries just like a
  // native <select> would — typing on top of that narrows it down.
  function countryMatchesForQuery(query) {
    if (!query) return COUNTRIES;
    return COUNTRIES.filter(function (c) {
      return c.name.toLowerCase().indexOf(query) !== -1;
    });
  }

  function openCountryList() {
    renderCountryMatches(countryMatchesForQuery(els.country.value.trim().toLowerCase()));
  }

  function handleCountryInput() {
    var query = els.country.value.trim().toLowerCase();
    if (!query && countryState.code) {
      countryState.code = "";
      handleCountryChange();
    }
    renderCountryMatches(countryMatchesForQuery(query));
  }

  function renderCountryMatches(matches) {
    countryState.matches = matches;
    countryState.activeIndex = matches.length ? 0 : -1;
    els.countryList.innerHTML = "";

    matches.forEach(function (c, i) {
      var li = document.createElement("li");
      li.textContent = c.name;
      li.id = "countryOption-" + c.code;
      li.setAttribute("role", "option");
      li.className = "combobox-option" + (i === 0 ? " is-active" : "");
      // mousedown (not click) + preventDefault: fires before the input's
      // blur, so the selection registers instead of the list closing first.
      li.addEventListener("mousedown", function (evt) {
        evt.preventDefault();
        selectCountry(c.code, c.name);
      });
      els.countryList.appendChild(li);
    });

    var open = matches.length > 0;
    els.countryList.hidden = !open;
    els.country.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function highlightActiveCountryOption() {
    Array.prototype.forEach.call(els.countryList.children, function (li, i) {
      li.classList.toggle("is-active", i === countryState.activeIndex);
    });
  }

  function handleCountryKeydown(evt) {
    if (!countryState.matches.length) return;

    if (evt.key === "ArrowDown") {
      evt.preventDefault();
      countryState.activeIndex = Math.min(countryState.activeIndex + 1, countryState.matches.length - 1);
      highlightActiveCountryOption();
    } else if (evt.key === "ArrowUp") {
      evt.preventDefault();
      countryState.activeIndex = Math.max(countryState.activeIndex - 1, 0);
      highlightActiveCountryOption();
    } else if (evt.key === "Enter") {
      evt.preventDefault();
      var picked = countryState.matches[countryState.activeIndex];
      if (picked) selectCountry(picked.code, picked.name);
    } else if (evt.key === "Escape") {
      closeCountryList();
    }
  }

  function closeCountryList() {
    els.countryList.hidden = true;
    els.countryList.innerHTML = "";
    countryState.matches = [];
    countryState.activeIndex = -1;
    els.country.setAttribute("aria-expanded", "false");
  }

  // Runs after every blur, including one caused by picking a suggestion
  // (selectCountry re-focuses the input, so this still fires last and just
  // re-confirms the same value). If the user tabs/clicks away with typed
  // text that never resolved to a real pick, revert it — a country field
  // holding text that doesn't map to any ISO code is worse than a blank one
  // (see the picklist-mismatch limitation in decisiones-tecnicas.md, #7).
  function handleCountryBlur() {
    window.setTimeout(function () {
      closeCountryList();
      els.country.value = countryState.code ? countryNameFromCode(countryState.code) : "";
    }, 150);
  }

  function selectCountry(code, name) {
    var changed = countryState.code !== code;
    countryState.code = code;
    els.country.value = name;
    closeCountryList();
    els.country.focus();
    if (changed) handleCountryChange();
  }

  function getSelectedCountryCode() {
    return countryState.code || "";
  }

  function setSelectedCountryCode(code) {
    countryState.code = code || "";
    els.country.value = code ? countryNameFromCode(code) : "";
  }

  function handleCountryChange() {
    hideLookupStatus();
    els.city.value = "";
    els.state.value = "";
    setCityStateEditable(false);
    state.pendingCoords = null;
    // Re-run the lookup regardless of whether the new country is set or
    // blank — handleZipLookup itself branches on that (see below), so this
    // also covers "user cleared the country" by falling back to the
    // country-less GeoNames attempt instead of just going silent.
    if (els.zip.value.trim()) {
      handleZipLookup();
    }
  }

  // --- Zoho -------------------------------------------------------------

  function initZoho() {
    if (typeof ZOHO === "undefined") {
      showLoadError("Couldn't load the Zoho CRM SDK.");
      return;
    }
    ZOHO.embeddedApp.on("PageLoad", function (data) {
      var entityId = data && data.EntityId;
      state.recordId = Array.isArray(entityId) ? entityId[0] : entityId;
      loadRecord();
    });
    ZOHO.embeddedApp.init();
  }

  function loadRecord() {
    if (!state.recordId) {
      showLoadError("Couldn't determine the current contact.");
      return;
    }
    ZOHO.CRM.API.getRecord({ Entity: CONTACT_MODULE, RecordID: state.recordId })
      .then(function (res) {
        var record = res && res.data && res.data[0];
        if (!record) {
          showLoadError("Contact not found.");
          return;
        }
        state.saved = mapRecordToFields(record);
        renderSaved();
        els.loading.hidden = true;
        els.form.hidden = false;
      })
      .catch(function (err) {
        console.error(err);
        showLoadError("Error loading the contact from the CRM.");
      });
  }

  function mapRecordToFields(record) {
    return {
      firstName: record.First_Name || "",
      lastName: record.Last_Name || "",
      phone: record.Phone || "",
      email: record.Email || "",
      street: record.Mailing_Street || "",
      flatNumber: record.Mailing_Flat_House_No_Building_Apartment_Name || "",
      zip: record.Mailing_Zip || "",
      city: record.Mailing_City || "",
      state: record.Mailing_State || "",
      countryName: record.Mailing_Country || "",
      countryCode: guessCountryCode(record.Mailing_Country),
      latitude: record.Mailing_Latitude != null ? record.Mailing_Latitude : null,
      longitude: record.Mailing_Longitude != null ? record.Mailing_Longitude : null
    };
  }

  // Returns "" when the record has no country on file, or when it holds text
  // that doesn't match our list (legacy data, another language, a typo, …).
  // Callers must NOT fall back to a default country here — see handleSave for
  // why silently guessing one is worse than leaving it unset.
  function guessCountryCode(countryName) {
    if (!countryName) return "";
    var match = COUNTRIES.filter(function (c) {
      return c.name.toLowerCase() === countryName.toLowerCase();
    })[0];
    return match ? match.code : "";
  }

  function countryNameFromCode(code) {
    var match = COUNTRIES.filter(function (c) { return c.code === code; })[0];
    return match ? match.name : "";
  }

  function renderSaved() {
    var s = state.saved;
    setField("firstName", s.firstName);
    setField("lastName", s.lastName);
    setField("phone", s.phone);
    setField("email", s.email);
    setField("street", s.street);
    setField("flatNumber", s.flatNumber);
    setField("zip", s.zip);
    setField("city", s.city);
    setField("state", s.state);
    setSelectedCountryCode(s.countryCode);
    setViewText("countrySelectLabel", s.countryName || countryNameFromCode(s.countryCode));
    setCityStateEditable(false);
    state.pendingCoords = undefined;
  }

  function setField(key, value) {
    els[key].value = value;
    setViewText(key, value);
  }

  function setViewText(key, value) {
    var view = document.querySelector('[data-view="' + key + '"]');
    if (view) view.textContent = value;
  }

  // City/State are locked ("auto") by default — only the postal-code lookup
  // is allowed to fill them in. They only unlock for manual typing when a
  // lookup genuinely can't resolve the postal code (no source has it).
  function setCityStateEditable(editable) {
    els.city.disabled = !editable;
    els.city.readOnly = !editable;
    els.state.disabled = !editable;
    els.state.readOnly = !editable;
    els.city.classList.toggle("field-input--auto", !editable);
    els.state.classList.toggle("field-input--auto", !editable);

    var badgeText = editable ? "manual" : "auto";
    var badgeTitle = editable
      ? "Couldn't auto-fill this — enter it manually."
      : "Auto-filled from the postal code.";
    if (els.cityBadge) {
      els.cityBadge.textContent = badgeText;
      els.cityBadge.title = badgeTitle;
    }
    if (els.stateBadge) {
      els.stateBadge.textContent = badgeText;
      els.stateBadge.title = badgeTitle;
    }
  }

  // Restarts the CSS flash animation even if it's already mid-run (e.g. the
  // user edits the postal code again right after a successful lookup).
  // Takes the element list because country only joins the flash when a
  // lookup auto-detects it (see lookupWithoutCountry) — city/state flash on
  // every successful lookup, country never gets the permanent "auto" lock
  // city/state get, so a flash is the only visual cue it was just filled in.
  function flashFields(elements) {
    elements.forEach(function (el) {
      el.classList.remove("field-input--flash");
      void el.offsetWidth; // force reflow so re-adding the class restarts it
      el.classList.add("field-input--flash");
    });
  }

  function enterEditMode() {
    els.card.classList.add("is-editing");
    els.editBtn.hidden = true;
    els.editFooter.hidden = false;
    setEditableInputsDisabled(false);
    clearValidationErrors();
    els.firstName.focus();
  }

  function exitEditMode() {
    els.card.classList.remove("is-editing");
    els.editBtn.hidden = false;
    els.editFooter.hidden = true;
    setEditableInputsDisabled(true);
    closeCountryList();
    renderSaved();
    hideLookupStatus();
    clearValidationErrors();
  }

  function validateForm() {
    var errors = [];

    if (!els.firstName.value.trim()) {
      errors.push({ key: "firstName", message: "First name is required." });
    }

    var email = els.email.value.trim();
    if (!email) {
      errors.push({ key: "email", message: "Email is required." });
    } else if (!EMAIL_PATTERN.test(email)) {
      errors.push({ key: "email", message: "Email isn't a valid format." });
    }

    return errors;
  }

  function applyValidationErrors(errors) {
    clearValidationErrors();
    errors.forEach(function (err) {
      els[err.key].classList.add("field-input--invalid");
      var errorEl = document.getElementById(err.key + "Error");
      if (errorEl) {
        errorEl.textContent = err.message;
        errorEl.hidden = false;
      }
    });
  }

  function clearFieldError(key) {
    els[key].classList.remove("field-input--invalid");
    var errorEl = document.getElementById(key + "Error");
    if (errorEl) {
      errorEl.hidden = true;
      errorEl.textContent = "";
    }
  }

  function clearValidationErrors() {
    REQUIRED_FIELDS.forEach(clearFieldError);
  }

  function setEditableInputsDisabled(disabled) {
    ["firstName", "lastName", "phone", "email", "street", "flatNumber", "country", "zip"].forEach(function (key) {
      els[key].disabled = disabled;
    });
    if (disabled) closeCountryList();
    // city/state are handled separately by setCityStateEditable — they're
    // only ever unlocked when a postal-code lookup genuinely fails
  }

  function handleZipLookup() {
    if (zipDebounceTimer) {
      window.clearTimeout(zipDebounceTimer);
      zipDebounceTimer = null;
    }

    var zip = els.zip.value.trim();
    if (!zip) {
      hideLookupStatus();
      return;
    }

    setLookupStatus("Looking up address…", "loading");

    var countryCode = getSelectedCountryCode();
    if (countryCode) {
      lookupWithCountry(zip, countryCode);
    } else {
      lookupWithoutCountry(zip);
    }
  }

  // Three-source waterfall: GeoNames first (broadest country coverage) →
  // Zippopotam.us (mirrors the same GeoNames data, see decisiones-tecnicas
  // #5 — a disponibility backstop, not independent coverage) → Nominatim
  // (OpenStreetMap) last, which *is* a genuinely independent dataset, so it
  // catches postal codes the first two simply don't have on file.
  function lookupWithCountry(zip, countryCode) {
    lookupViaGeoNames(zip, countryCode)
      .catch(function () {
        return lookupViaZippopotam(zip, countryCode);
      })
      .catch(function () {
        return lookupViaNominatim(zip, countryCode);
      })
      .then(function (result) {
        result.countryCode = countryCode;
        applyResolvedLookup(result, {
          flashCountry: false,
          statusMessage: "City and state filled in automatically.",
          timeout: 3000
        });
      })
      .catch(function () {
        attemptCountryMismatchRecovery(zip, countryCode);
      });
  }

  // All three sources failed for the selected country — before asking for
  // fully manual entry, check whether the postal code actually belongs to a
  // different country (a stale or simply wrong country already on the
  // record is a realistic case; a silent "not found" hides that). Reuses
  // the same country-less GeoNames query as the blank-country path below.
  // Unlike that path, this never overrides the country on its own — the
  // user picked it explicitly, so a mismatch is only ever *offered* as a
  // selectable suggestion in the existing combobox, never auto-applied.
  function attemptCountryMismatchRecovery(zip, selectedCountryCode) {
    lookupCountryUnknown(zip)
      .then(function (result) {
        if (result.outcome === "resolved" && result.countryCode === selectedCountryCode) {
          // Same country GeoNames just failed to confirm directly — a
          // transient hiccup on that one request, not an actual mismatch.
          applyResolvedLookup(result, {
            flashCountry: false,
            statusMessage: "City and state filled in automatically.",
            timeout: 3000
          });
          return;
        }

        if (result.outcome === "resolved") {
          offerCountryMismatch([result.countryCode], selectedCountryCode);
          return;
        }

        if (result.outcome === "ambiguous") {
          offerCountryMismatch(result.countries, selectedCountryCode);
          return;
        }

        clearAddressResult(true);
        setLookupStatus("We couldn't find that postal code in any source — enter city and state manually.", "error");
      })
      .catch(function () {
        clearAddressResult(true);
        setLookupStatus("We couldn't find that postal code in any source — enter city and state manually.", "error");
      });
  }

  // Shows the candidate country/countries as selectable options in the same
  // combobox the user would use to change it manually, and names them in the
  // status message instead of just saying "N countries" — so the next click
  // is picking a real option, not guessing from a number.
  function offerCountryMismatch(countryCodes, selectedCountryCode) {
    var matches = showCountrySuggestions(countryCodes);
    if (!matches.length) {
      // None of the candidates are in our own country list (see #4) —
      // nothing concrete to offer, fall back to the plain not-found case.
      clearAddressResult(true);
      setLookupStatus("We couldn't find that postal code in any source — enter city and state manually.", "error");
      return;
    }

    clearAddressResult(false);
    var names = matches.map(function (c) { return c.name; }).join(", ");
    setLookupStatus(
      "This postal code doesn't match " + countryNameFromCode(selectedCountryCode)
        + " — it looks like it could be " + names + ". Select the right one below.",
      "error"
    );
  }

  // Country left blank: try one country-less GeoNames query — the only one
  // of the three sources that supports searching without a country
  // (Zippopotam and Nominatim both require one in the request URL, see #5).
  // If the postal code resolves to exactly one country, auto-fill country,
  // city, and state together — the field was empty, so there's nothing to
  // override. If it matches more than one, don't guess: surface them as
  // selectable suggestions (see offerCountryMismatch) instead of a separate
  // "candidates" picker (see decisiones-tecnicas #16 for why that's a
  // deliberately different design from the narrowed-picker idea already
  // evaluated and discarded in #14).
  function lookupWithoutCountry(zip) {
    lookupCountryUnknown(zip)
      .then(function (result) {
        if (result.outcome === "resolved") {
          applyResolvedLookup(result, {
            flashCountry: true,
            statusMessage: "Country, city, and state detected automatically from the postal code.",
            timeout: 3500
          });
          return;
        }

        if (result.outcome === "ambiguous") {
          var matches = showCountrySuggestions(result.countries);
          clearAddressResult(false);
          if (matches.length) {
            var names = matches.map(function (c) { return c.name; }).join(", ");
            setLookupStatus("This postal code could be " + names + " — select the right one below.", "error");
          } else {
            setLookupStatus("We couldn't identify a country for this postal code — select one to look up the address.", "error");
          }
          return;
        }

        clearAddressResult(false);
        setLookupStatus("We couldn't identify a country for this postal code — select one to look up the address.", "error");
      })
      .catch(function () {
        clearAddressResult(false);
        setLookupStatus("We couldn't identify a country for this postal code — select one to look up the address.", "error");
      });
  }

  // Fills in country (only when flashCountry is true — see call sites),
  // city, and state from a resolved lookup result, and shows the ride-along
  // save state (flash, status message, lat/lng) shared by every successful
  // path (scoped cascade, blank-country auto-detect, or a same-country retry
  // after a mismatch check).
  function applyResolvedLookup(result, opts) {
    if (opts.flashCountry) setSelectedCountryCode(result.countryCode);
    els.city.value = result.city;
    els.state.value = result.state;
    setCityStateEditable(false);
    flashFields(opts.flashCountry ? [els.country, els.city, els.state] : [els.city, els.state]);
    setViewText("countrySelectLabel", countryNameFromCode(result.countryCode));

    // Latitude/longitude ride along silently — real native Zoho fields
    // (Mailing_Latitude/Mailing_Longitude), but not shown in the form;
    // raw coordinates aren't something client staff need to see day to day.
    state.pendingCoords = (result.lat != null && result.lng != null)
      ? { lat: result.lat, lng: result.lng }
      : null;

    setLookupStatus(opts.statusMessage, "quiet");
    window.setTimeout(hideLookupStatus, opts.timeout);
  }

  function clearAddressResult(editable) {
    els.city.value = "";
    els.state.value = "";
    setCityStateEditable(editable);
    state.pendingCoords = null;
  }

  // Pre-populates the country combobox's own suggestion list with just these
  // candidates (instead of the full ~180 countries) and opens it, so picking
  // one is a click/Enter away in the exact same widget the user already
  // knows — no separate picker component. Filters out any code missing from
  // COUNTRIES (see #4); returns the matches actually shown so callers can
  // fall back gracefully if that filter empties the list.
  function showCountrySuggestions(countryCodes) {
    var matches = COUNTRIES.filter(function (c) {
      return countryCodes.indexOf(c.code) !== -1;
    });
    renderCountryMatches(matches);
    return matches;
  }

  // Merges two independent country-less searches — GeoNames and Nominatim —
  // instead of relying on GeoNames alone. Confirmed live why this matters:
  // GeoNames has zero data for Nigeria + "900211" (only Nominatim has it),
  // so a GeoNames-only search resolves that code to Romania "unambiguously"
  // — a confident wrong answer, not a real single match. Merging the two
  // sources turns that into a correct "ambiguous: Nigeria or Romania"
  // instead. Confirmed live that this doesn't add noise to the cases that
  // already worked (SW1A, 1012 AB): Nominatim returns empty or the same
  // single country GeoNames already found for both.
  function lookupCountryUnknown(zip) {
    return Promise.all([
      lookupCountryUnknownViaGeoNames(zip).catch(function () { return {}; }),
      lookupCountryUnknownViaNominatim(zip).catch(function () { return {}; })
    ]).then(function (bySource) {
      var merged = {};
      // Nominatim written first, GeoNames second so it wins on overlap —
      // GeoNames is the documented primary/live source (see #5).
      Object.keys(bySource[1]).forEach(function (code) { merged[code] = bySource[1][code]; });
      Object.keys(bySource[0]).forEach(function (code) { merged[code] = bySource[0][code]; });

      var codes = Object.keys(merged);
      if (codes.length === 0) return { outcome: "not_found" };
      if (codes.length > 1) return { outcome: "ambiguous", countries: codes };

      var place = merged[codes[0]];
      return {
        outcome: "resolved",
        countryCode: codes[0],
        city: place.city,
        state: place.state,
        lat: place.lat,
        lng: place.lng
      };
    });
  }

  // Returns { countryCode: {city, state, lat, lng}, ... } — one entry per
  // distinct country found, never an "outcome" wrapper (that's decided once
  // by lookupCountryUnknown, after merging with the other source).
  function lookupCountryUnknownViaGeoNames(zip) {
    var url = "https://secure.geonames.org/postalCodeSearchJSON"
      + "?postalcode=" + encodeURIComponent(zip)
      + "&maxRows=20"
      + "&username=" + encodeURIComponent(GEONAMES_USERNAME);

    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP_" + res.status);
        return res.json();
      })
      .then(function (data) {
        // GeoNames-level error (bad/unpropagated username, quota, etc.)
        // arrives as HTTP 200 with a "status" object instead of results.
        if (data && data.status) throw new Error("PROVIDER_ERROR");

        var byCountry = {};
        (data.postalCodes || []).forEach(function (p) {
          if (p.countryCode && !byCountry[p.countryCode]) {
            byCountry[p.countryCode] = {
              city: p.placeName || "",
              state: p.adminName1 || "",
              lat: p.lat != null ? parseFloat(p.lat) : null,
              lng: p.lng != null ? parseFloat(p.lng) : null
            };
          }
        });
        return byCountry;
      });
  }

  // Same shape as lookupCountryUnknownViaGeoNames — {countryCode: {...}}.
  // Nominatim's own search without a country filter, used only to catch
  // postal codes GeoNames simply doesn't have on file (see the comment on
  // lookupCountryUnknown above for why that matters, not just in theory).
  function lookupCountryUnknownViaNominatim(zip) {
    var url = "https://nominatim.openstreetmap.org/search"
      + "?postalcode=" + encodeURIComponent(zip)
      + "&format=json&addressdetails=1&limit=10"
      + "&accept-language=en";

    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP_" + res.status);
        return res.json();
      })
      .then(function (data) {
        var byCountry = {};
        (data || []).forEach(function (place) {
          var addr = place.address;
          var code = addr && addr.country_code ? addr.country_code.toUpperCase() : "";
          if (code && !byCountry[code]) {
            byCountry[code] = {
              city: addr.city || addr.town || addr.village || addr.municipality || "",
              state: addr.state || "",
              lat: place.lat != null ? parseFloat(place.lat) : null,
              lng: place.lon != null ? parseFloat(place.lon) : null
            };
          }
        });
        return byCountry;
      });
  }

  function lookupViaGeoNames(zip, countryCode) {
    var url = "https://secure.geonames.org/postalCodeSearchJSON"
      + "?postalcode=" + encodeURIComponent(zip)
      + "&country=" + encodeURIComponent(countryCode)
      + "&maxRows=1"
      + "&username=" + encodeURIComponent(GEONAMES_USERNAME);

    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP_" + res.status);
        return res.json();
      })
      .then(function (data) {
        // GeoNames-level error (bad/unpropagated username, quota, etc.)
        // arrives as HTTP 200 with a "status" object instead of results.
        if (data && data.status) throw new Error("PROVIDER_ERROR");
        var place = data.postalCodes && data.postalCodes[0];
        if (!place) throw new Error("NOT_FOUND");
        return {
          city: place.placeName || "",
          state: place.adminName1 || "",
          lat: place.lat != null ? parseFloat(place.lat) : null,
          lng: place.lng != null ? parseFloat(place.lng) : null
        };
      });
  }

  function lookupViaZippopotam(zip, countryCode) {
    var normalizedZip = normalizeForZippopotam(zip, countryCode);
    var url = "https://api.zippopotam.us/" + countryCode.toLowerCase() + "/" + encodeURIComponent(normalizedZip);

    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP_" + res.status);
        return res.json();
      })
      .then(function (data) {
        var place = data.places && data.places[0];
        if (!place) throw new Error("NOT_FOUND");
        return {
          city: place["place name"] || "",
          state: place["state"] || place["state abbreviation"] || "",
          lat: place["latitude"] ? parseFloat(place["latitude"]) : null,
          lng: place["longitude"] ? parseFloat(place["longitude"]) : null
        };
      });
  }

  // Nominatim (OpenStreetMap) needs no per-country zip normalization —
  // confirmed live: it takes GB/NL postal codes at full precision (unlike
  // Zippopotam), but has no Canadian postal-code coverage at all, at any
  // precision — a real data gap, not a formatting one. Zippopotam already
  // covers CA earlier in the waterfall, so that gap never surfaces in
  // practice. A "no results" response here is HTTP 200 with an empty array,
  // not an error object (unlike GeoNames) or a 404 (unlike Zippopotam) —
  // each provider signals "not found" differently.
  //
  // Nominatim's usage policy asks callers to identify themselves via
  // User-Agent or Referer. Browsers block scripts from setting a custom
  // User-Agent on fetch(), so this relies on the Referer the browser sends
  // automatically (the widget's own hosted URL) to satisfy that.
  //
  // accept-language=en: Nominatim is the only one of the three sources that
  // can be told to answer in English (confirmed live — GeoNames and
  // Zippopotam ignore any language parameter and just return whatever
  // script is native to that record, e.g. Cyrillic for Russia). This only
  // helps when Nominatim is the one that actually resolves the lookup — see
  // decisiones-tecnicas #17 for why that doesn't cover GeoNames/Zippopotam
  // results, which come first in the waterfall.
  function lookupViaNominatim(zip, countryCode) {
    var url = "https://nominatim.openstreetmap.org/search"
      + "?postalcode=" + encodeURIComponent(zip)
      + "&country=" + encodeURIComponent(countryCode)
      + "&format=json&addressdetails=1&limit=1"
      + "&accept-language=en";

    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP_" + res.status);
        return res.json();
      })
      .then(function (data) {
        var place = data && data[0];
        if (!place || !place.address) throw new Error("NOT_FOUND");
        var addr = place.address;
        return {
          city: addr.city || addr.town || addr.village || addr.municipality || "",
          state: addr.state || "",
          lat: place.lat != null ? parseFloat(place.lat) : null,
          lng: place.lon != null ? parseFloat(place.lon) : null
        };
      });
  }

  function setLookupStatus(message, kind) {
    els.lookupStatus.hidden = false;
    els.lookupStatus.textContent = message;
    els.lookupStatus.className = "lookup-status" + (kind === "loading" ? " is-loading" : kind === "error" ? " is-error" : "");
  }

  function hideLookupStatus() {
    els.lookupStatus.hidden = true;
    els.lookupStatus.textContent = "";
  }

  function scheduleZipLookup() {
    if (zipDebounceTimer) window.clearTimeout(zipDebounceTimer);
    if (!els.zip.value.trim()) {
      hideLookupStatus();
      els.city.value = "";
      els.state.value = "";
      setCityStateEditable(false);
      state.pendingCoords = null;
      return;
    }
    zipDebounceTimer = window.setTimeout(handleZipLookup, ZIP_LOOKUP_DEBOUNCE_MS);
  }

  function handleSave(evt) {
    evt.preventDefault();
    if (state.saving) return;

    var errors = validateForm();
    if (errors.length) {
      applyValidationErrors(errors);
      els[errors[0].key].focus();
      return;
    }

    // If the country field is untouched (no confirmed selection), don't
    // overwrite whatever country was already on the record — only a real
    // selection should change it.
    var selectedCode = getSelectedCountryCode();
    var countryName = selectedCode
      ? countryNameFromCode(selectedCode)
      : (state.saved.countryName || "");

    // Same "preserve if untouched" logic as country: only overwrite the
    // stored coordinates if this edit session actually resolved a lookup
    // (successfully or not) — otherwise keep whatever was already saved.
    var coords = state.pendingCoords === undefined
      ? { lat: state.saved.latitude, lng: state.saved.longitude }
      : (state.pendingCoords || { lat: null, lng: null });

    var payload = {
      id: state.recordId,
      First_Name: els.firstName.value.trim(),
      Last_Name: els.lastName.value.trim(),
      Phone: els.phone.value.trim(),
      Email: els.email.value.trim(),
      Mailing_Street: els.street.value.trim(),
      Mailing_Flat_House_No_Building_Apartment_Name: els.flatNumber.value.trim(),
      Mailing_Zip: els.zip.value.trim(),
      Mailing_City: els.city.value.trim(),
      Mailing_State: els.state.value.trim(),
      Mailing_Country: countryName,
      Mailing_Latitude: coords.lat,
      Mailing_Longitude: coords.lng
    };

    setSaving(true);

    ZOHO.CRM.API.updateRecord({
      Entity: CONTACT_MODULE,
      APIData: payload,
      Trigger: []
    })
      .then(function (res) {
        var result = res && res.data && res.data[0];
        if (result && result.code === "SUCCESS") {
          state.saved = {
            firstName: payload.First_Name,
            lastName: payload.Last_Name,
            phone: payload.Phone,
            email: payload.Email,
            street: payload.Mailing_Street,
            flatNumber: payload.Mailing_Flat_House_No_Building_Apartment_Name,
            zip: payload.Mailing_Zip,
            city: payload.Mailing_City,
            state: payload.Mailing_State,
            countryName: payload.Mailing_Country,
            countryCode: guessCountryCode(payload.Mailing_Country),
            latitude: payload.Mailing_Latitude,
            longitude: payload.Mailing_Longitude
          };
          renderSaved();
          els.card.classList.remove("is-editing");
          els.editBtn.hidden = false;
          els.editFooter.hidden = true;
          setEditableInputsDisabled(true);
          hideLookupStatus();
          setSaving(false, "success");
        } else {
          var message = result && result.message ? result.message : null;
          console.error("updateRecord failed:", result);
          setSaving(false, "error", message);
        }
      })
      .catch(function (err) {
        console.error(err);
        var message = err && err.message ? err.message : null;
        setSaving(false, "error", message);
      });
  }

  function setSaving(isSaving, outcome, errorMessage) {
    state.saving = isSaving;
    els.saveBtn.disabled = isSaving;
    els.cancelBtn.disabled = isSaving;

    if (isSaving) {
      showStatusPill("Saving…", "is-saving");
      return;
    }

    if (outcome === "success") {
      showStatusPill("Saved ✓", "is-success");
      window.setTimeout(hideStatusPill, 2500);
    } else if (outcome === "error") {
      showStatusPill(errorMessage ? ("Error saving: " + errorMessage) : "Error saving. Please try again.", "is-error");
    }
  }

  function showStatusPill(text, cls) {
    els.statusPill.hidden = false;
    els.statusPill.textContent = text;
    els.statusPill.className = "status-pill " + cls;
  }

  function hideStatusPill() {
    els.statusPill.hidden = true;
  }

  function showLoadError(message) {
    els.loading.innerHTML = "";
    var span = document.createElement("span");
    span.textContent = message;
    els.loading.appendChild(span);
  }
})();
