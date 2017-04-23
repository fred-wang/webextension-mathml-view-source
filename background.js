/* -*- Mode: Java; tab-width: 2; indent-tabs-mode:nil; c-basic-offset: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

let gMathMLSource = "";

function setMathMLSource (aSource) {
    // Print invisible characters in a readable way.
  gMathMLSource = aSource.replace(/[\u2061-\u2064]/g, function(c) {
    let codePoint = c.charCodeAt(0);
    let unicodeName = ["FUNCTION APPLICATION",
                       "INVISIBLE TIMES",
                       "INVISIBLE SEPARATOR",
                       "INVISIBLE PLUS"][codePoint - 0x2061];
    return "&#x" + codePoint.toString(16) + ";<!-- " + unicodeName + " -->";
  });
}

function viewMathMLSource() {
  // Open a new tab with the MathML source.
  browser.tabs.create({
    url: "/tab/view-mathml-source.html"
  });
}

browser.runtime.onConnect.addListener((aPort) => {
  switch (aPort.name) {
  case "view-mathml-source":
    aPort.postMessage(gMathMLSource);
    break;
  case "get-mathml-source":
    aPort.onMessage.addListener(setMathMLSource);
    break;
  }
});

// FIXME: We should set access key to viewPartialSourceCmdAccessKey
// See https://github.com/fred-wang/webextension-mathml-view-source/issues/1
// FIXME: Only show the menu item when one clicks MathML content?
// See https://github.com/fred-wang/webextension-mathml-view-source/issues/2
// FIXME: Can we improve how the MathML is retrieved?
// https://github.com/fred-wang/webextension-mathml-view-source/issues/3
browser.contextMenus.create({
  type: "normal",
  title: browser.i18n.getMessage("viewPartialSourceForMathMLCmdLabel"),
  onclick: viewMathMLSource
});
