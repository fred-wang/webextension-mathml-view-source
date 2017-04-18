/* -*- Mode: Java; tab-width: 2; indent-tabs-mode:nil; c-basic-offset: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

function viewMathMLSource(aSource) {
  // Print invisible characters in a readable way.
  let source = aSource.replace(/[\u2061-\u2064]/g, function(c) {
    let codePoint = c.charCodeAt(0);
    let unicodeName = ["FUNCTION APPLICATION",
                       "INVISIBLE TIMES",
                       "INVISIBLE SEPARATOR",
                       "INVISIBLE PLUS"][codePoint - 0x2061];
    return "&#x" + codePoint.toString(16) + ";<!-- " + unicodeName + " -->";
  });

  // Open a new tab with the MathML source.
  browser.tabs.create({
    url: "/tab/view-mathml-source.html"
  }).then((tab) => {
    let connectListener = (port) => {
      port.postMessage(source);
      browser.runtime.onConnect.removeListener(connectListener);
    };
    browser.runtime.onConnect.addListener(connectListener);
  });
}
