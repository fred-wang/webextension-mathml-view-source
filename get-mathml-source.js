/* -*- Mode: Java; tab-width: 2; indent-tabs-mode:nil; c-basic-offset: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var MathMLNameSpace = "http://www.w3.org/1998/Math/MathML";

let port = browser.runtime.connect({"name": "get-mathml-source"});

// FIXME: Can we avoid adding such a listener to the page?
// See https://github.com/fred-wang/webextension-mathml-view-source/issues/3
document.addEventListener("contextmenu", function(event) {
  // Retrieve the <math> ancestor, serialize it and send the source to the
  // background script.
  let node = event.target;
  while (node) {
    if (node.nodeType === Node.ELEMENT_NODE &&
      node.namespaceURI === MathMLNameSpace &&
      node.localName === "math") {
      var source = (new XMLSerializer()).serializeToString(node);
      port.postMessage(source);
      break;
    }
    node = node.parentNode;
  }
}, true);
