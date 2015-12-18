if(typeof Math.imul == "undefined" || (Math.imul(0xffffffff,5) == 0)) {
    Math.imul = function (a, b) {
        var ah  = (a >>> 16) & 0xffff;
        var al = a & 0xffff;
        var bh  = (b >>> 16) & 0xffff;
        var bl = b & 0xffff;
        // the shift by 0 fixes the sign on the high part
        // the final |0 converts the unsigned value into a signed value
        return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
    }
}

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":13}],3:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":36}],4:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],5:[function(require,module,exports){
'use strict';

var OneVersionConstraint = require('individual/one-version');

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

},{"individual/one-version":7}],6:[function(require,module,exports){
(function (global){
'use strict';

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
'use strict';

var Individual = require('./index.js');

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}

},{"./index.js":6}],8:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":1}],9:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],10:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],11:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":16}],12:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":27,"is-object":9}],13:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":25,"../vnode/is-vnode.js":28,"../vnode/is-vtext.js":29,"../vnode/is-widget.js":30,"./apply-properties":12,"global/document":8}],14:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],15:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var render = require("./create-element")
var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":30,"../vnode/vpatch.js":33,"./apply-properties":12,"./create-element":13,"./update-widget":17}],16:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches) {
    return patchRecursive(rootNode, patches)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions) {
        renderOptions = { patch: patchRecursive }
        if (ownerDocument !== document) {
            renderOptions.document = ownerDocument
        }
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./dom-index":14,"./patch-op":15,"global/document":8,"x-is-array":10}],17:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":30}],18:[function(require,module,exports){
'use strict';

module.exports = AttributeHook;

function AttributeHook(namespace, value) {
    if (!(this instanceof AttributeHook)) {
        return new AttributeHook(namespace, value);
    }

    this.namespace = namespace;
    this.value = value;
}

AttributeHook.prototype.hook = function (node, prop, prev) {
    if (prev && prev.type === 'AttributeHook' &&
        prev.value === this.value &&
        prev.namespace === this.namespace) {
        return;
    }

    node.setAttributeNS(this.namespace, prop, this.value);
};

AttributeHook.prototype.unhook = function (node, prop, next) {
    if (next && next.type === 'AttributeHook' &&
        next.namespace === this.namespace) {
        return;
    }

    var colonPosition = prop.indexOf(':');
    var localName = colonPosition > -1 ? prop.substr(colonPosition + 1) : prop;
    node.removeAttributeNS(this.namespace, localName);
};

AttributeHook.prototype.type = 'AttributeHook';

},{}],19:[function(require,module,exports){
'use strict';

var EvStore = require('ev-store');

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};

},{"ev-store":5}],20:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],21:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var VNode = require('../vnode/vnode.js');
var VText = require('../vnode/vtext.js');
var isVNode = require('../vnode/is-vnode');
var isVText = require('../vnode/is-vtext');
var isWidget = require('../vnode/is-widget');
var isHook = require('../vnode/is-vhook');
var isVThunk = require('../vnode/is-thunk');

var parseTag = require('./parse-tag.js');
var softSetHook = require('./hooks/soft-set-hook.js');
var evHook = require('./hooks/ev-hook.js');

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

},{"../vnode/is-thunk":26,"../vnode/is-vhook":27,"../vnode/is-vnode":28,"../vnode/is-vtext":29,"../vnode/is-widget":30,"../vnode/vnode.js":32,"../vnode/vtext.js":34,"./hooks/ev-hook.js":19,"./hooks/soft-set-hook.js":20,"./parse-tag.js":22,"x-is-array":10}],22:[function(require,module,exports){
'use strict';

var split = require('browser-split');

var classIdSplit = /([\.#]?[a-zA-Z0-9_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

},{"browser-split":4}],23:[function(require,module,exports){
'use strict';

var DEFAULT_NAMESPACE = null;
var EV_NAMESPACE = 'http://www.w3.org/2001/xml-events';
var XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';
var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';

// http://www.w3.org/TR/SVGTiny12/attributeTable.html
// http://www.w3.org/TR/SVG/attindex.html
var SVG_PROPERTIES = {
    'about': DEFAULT_NAMESPACE,
    'accent-height': DEFAULT_NAMESPACE,
    'accumulate': DEFAULT_NAMESPACE,
    'additive': DEFAULT_NAMESPACE,
    'alignment-baseline': DEFAULT_NAMESPACE,
    'alphabetic': DEFAULT_NAMESPACE,
    'amplitude': DEFAULT_NAMESPACE,
    'arabic-form': DEFAULT_NAMESPACE,
    'ascent': DEFAULT_NAMESPACE,
    'attributeName': DEFAULT_NAMESPACE,
    'attributeType': DEFAULT_NAMESPACE,
    'azimuth': DEFAULT_NAMESPACE,
    'bandwidth': DEFAULT_NAMESPACE,
    'baseFrequency': DEFAULT_NAMESPACE,
    'baseProfile': DEFAULT_NAMESPACE,
    'baseline-shift': DEFAULT_NAMESPACE,
    'bbox': DEFAULT_NAMESPACE,
    'begin': DEFAULT_NAMESPACE,
    'bias': DEFAULT_NAMESPACE,
    'by': DEFAULT_NAMESPACE,
    'calcMode': DEFAULT_NAMESPACE,
    'cap-height': DEFAULT_NAMESPACE,
    'class': DEFAULT_NAMESPACE,
    'clip': DEFAULT_NAMESPACE,
    'clip-path': DEFAULT_NAMESPACE,
    'clip-rule': DEFAULT_NAMESPACE,
    'clipPathUnits': DEFAULT_NAMESPACE,
    'color': DEFAULT_NAMESPACE,
    'color-interpolation': DEFAULT_NAMESPACE,
    'color-interpolation-filters': DEFAULT_NAMESPACE,
    'color-profile': DEFAULT_NAMESPACE,
    'color-rendering': DEFAULT_NAMESPACE,
    'content': DEFAULT_NAMESPACE,
    'contentScriptType': DEFAULT_NAMESPACE,
    'contentStyleType': DEFAULT_NAMESPACE,
    'cursor': DEFAULT_NAMESPACE,
    'cx': DEFAULT_NAMESPACE,
    'cy': DEFAULT_NAMESPACE,
    'd': DEFAULT_NAMESPACE,
    'datatype': DEFAULT_NAMESPACE,
    'defaultAction': DEFAULT_NAMESPACE,
    'descent': DEFAULT_NAMESPACE,
    'diffuseConstant': DEFAULT_NAMESPACE,
    'direction': DEFAULT_NAMESPACE,
    'display': DEFAULT_NAMESPACE,
    'divisor': DEFAULT_NAMESPACE,
    'dominant-baseline': DEFAULT_NAMESPACE,
    'dur': DEFAULT_NAMESPACE,
    'dx': DEFAULT_NAMESPACE,
    'dy': DEFAULT_NAMESPACE,
    'edgeMode': DEFAULT_NAMESPACE,
    'editable': DEFAULT_NAMESPACE,
    'elevation': DEFAULT_NAMESPACE,
    'enable-background': DEFAULT_NAMESPACE,
    'end': DEFAULT_NAMESPACE,
    'ev:event': EV_NAMESPACE,
    'event': DEFAULT_NAMESPACE,
    'exponent': DEFAULT_NAMESPACE,
    'externalResourcesRequired': DEFAULT_NAMESPACE,
    'fill': DEFAULT_NAMESPACE,
    'fill-opacity': DEFAULT_NAMESPACE,
    'fill-rule': DEFAULT_NAMESPACE,
    'filter': DEFAULT_NAMESPACE,
    'filterRes': DEFAULT_NAMESPACE,
    'filterUnits': DEFAULT_NAMESPACE,
    'flood-color': DEFAULT_NAMESPACE,
    'flood-opacity': DEFAULT_NAMESPACE,
    'focusHighlight': DEFAULT_NAMESPACE,
    'focusable': DEFAULT_NAMESPACE,
    'font-family': DEFAULT_NAMESPACE,
    'font-size': DEFAULT_NAMESPACE,
    'font-size-adjust': DEFAULT_NAMESPACE,
    'font-stretch': DEFAULT_NAMESPACE,
    'font-style': DEFAULT_NAMESPACE,
    'font-variant': DEFAULT_NAMESPACE,
    'font-weight': DEFAULT_NAMESPACE,
    'format': DEFAULT_NAMESPACE,
    'from': DEFAULT_NAMESPACE,
    'fx': DEFAULT_NAMESPACE,
    'fy': DEFAULT_NAMESPACE,
    'g1': DEFAULT_NAMESPACE,
    'g2': DEFAULT_NAMESPACE,
    'glyph-name': DEFAULT_NAMESPACE,
    'glyph-orientation-horizontal': DEFAULT_NAMESPACE,
    'glyph-orientation-vertical': DEFAULT_NAMESPACE,
    'glyphRef': DEFAULT_NAMESPACE,
    'gradientTransform': DEFAULT_NAMESPACE,
    'gradientUnits': DEFAULT_NAMESPACE,
    'handler': DEFAULT_NAMESPACE,
    'hanging': DEFAULT_NAMESPACE,
    'height': DEFAULT_NAMESPACE,
    'horiz-adv-x': DEFAULT_NAMESPACE,
    'horiz-origin-x': DEFAULT_NAMESPACE,
    'horiz-origin-y': DEFAULT_NAMESPACE,
    'id': DEFAULT_NAMESPACE,
    'ideographic': DEFAULT_NAMESPACE,
    'image-rendering': DEFAULT_NAMESPACE,
    'in': DEFAULT_NAMESPACE,
    'in2': DEFAULT_NAMESPACE,
    'initialVisibility': DEFAULT_NAMESPACE,
    'intercept': DEFAULT_NAMESPACE,
    'k': DEFAULT_NAMESPACE,
    'k1': DEFAULT_NAMESPACE,
    'k2': DEFAULT_NAMESPACE,
    'k3': DEFAULT_NAMESPACE,
    'k4': DEFAULT_NAMESPACE,
    'kernelMatrix': DEFAULT_NAMESPACE,
    'kernelUnitLength': DEFAULT_NAMESPACE,
    'kerning': DEFAULT_NAMESPACE,
    'keyPoints': DEFAULT_NAMESPACE,
    'keySplines': DEFAULT_NAMESPACE,
    'keyTimes': DEFAULT_NAMESPACE,
    'lang': DEFAULT_NAMESPACE,
    'lengthAdjust': DEFAULT_NAMESPACE,
    'letter-spacing': DEFAULT_NAMESPACE,
    'lighting-color': DEFAULT_NAMESPACE,
    'limitingConeAngle': DEFAULT_NAMESPACE,
    'local': DEFAULT_NAMESPACE,
    'marker-end': DEFAULT_NAMESPACE,
    'marker-mid': DEFAULT_NAMESPACE,
    'marker-start': DEFAULT_NAMESPACE,
    'markerHeight': DEFAULT_NAMESPACE,
    'markerUnits': DEFAULT_NAMESPACE,
    'markerWidth': DEFAULT_NAMESPACE,
    'mask': DEFAULT_NAMESPACE,
    'maskContentUnits': DEFAULT_NAMESPACE,
    'maskUnits': DEFAULT_NAMESPACE,
    'mathematical': DEFAULT_NAMESPACE,
    'max': DEFAULT_NAMESPACE,
    'media': DEFAULT_NAMESPACE,
    'mediaCharacterEncoding': DEFAULT_NAMESPACE,
    'mediaContentEncodings': DEFAULT_NAMESPACE,
    'mediaSize': DEFAULT_NAMESPACE,
    'mediaTime': DEFAULT_NAMESPACE,
    'method': DEFAULT_NAMESPACE,
    'min': DEFAULT_NAMESPACE,
    'mode': DEFAULT_NAMESPACE,
    'name': DEFAULT_NAMESPACE,
    'nav-down': DEFAULT_NAMESPACE,
    'nav-down-left': DEFAULT_NAMESPACE,
    'nav-down-right': DEFAULT_NAMESPACE,
    'nav-left': DEFAULT_NAMESPACE,
    'nav-next': DEFAULT_NAMESPACE,
    'nav-prev': DEFAULT_NAMESPACE,
    'nav-right': DEFAULT_NAMESPACE,
    'nav-up': DEFAULT_NAMESPACE,
    'nav-up-left': DEFAULT_NAMESPACE,
    'nav-up-right': DEFAULT_NAMESPACE,
    'numOctaves': DEFAULT_NAMESPACE,
    'observer': DEFAULT_NAMESPACE,
    'offset': DEFAULT_NAMESPACE,
    'opacity': DEFAULT_NAMESPACE,
    'operator': DEFAULT_NAMESPACE,
    'order': DEFAULT_NAMESPACE,
    'orient': DEFAULT_NAMESPACE,
    'orientation': DEFAULT_NAMESPACE,
    'origin': DEFAULT_NAMESPACE,
    'overflow': DEFAULT_NAMESPACE,
    'overlay': DEFAULT_NAMESPACE,
    'overline-position': DEFAULT_NAMESPACE,
    'overline-thickness': DEFAULT_NAMESPACE,
    'panose-1': DEFAULT_NAMESPACE,
    'path': DEFAULT_NAMESPACE,
    'pathLength': DEFAULT_NAMESPACE,
    'patternContentUnits': DEFAULT_NAMESPACE,
    'patternTransform': DEFAULT_NAMESPACE,
    'patternUnits': DEFAULT_NAMESPACE,
    'phase': DEFAULT_NAMESPACE,
    'playbackOrder': DEFAULT_NAMESPACE,
    'pointer-events': DEFAULT_NAMESPACE,
    'points': DEFAULT_NAMESPACE,
    'pointsAtX': DEFAULT_NAMESPACE,
    'pointsAtY': DEFAULT_NAMESPACE,
    'pointsAtZ': DEFAULT_NAMESPACE,
    'preserveAlpha': DEFAULT_NAMESPACE,
    'preserveAspectRatio': DEFAULT_NAMESPACE,
    'primitiveUnits': DEFAULT_NAMESPACE,
    'propagate': DEFAULT_NAMESPACE,
    'property': DEFAULT_NAMESPACE,
    'r': DEFAULT_NAMESPACE,
    'radius': DEFAULT_NAMESPACE,
    'refX': DEFAULT_NAMESPACE,
    'refY': DEFAULT_NAMESPACE,
    'rel': DEFAULT_NAMESPACE,
    'rendering-intent': DEFAULT_NAMESPACE,
    'repeatCount': DEFAULT_NAMESPACE,
    'repeatDur': DEFAULT_NAMESPACE,
    'requiredExtensions': DEFAULT_NAMESPACE,
    'requiredFeatures': DEFAULT_NAMESPACE,
    'requiredFonts': DEFAULT_NAMESPACE,
    'requiredFormats': DEFAULT_NAMESPACE,
    'resource': DEFAULT_NAMESPACE,
    'restart': DEFAULT_NAMESPACE,
    'result': DEFAULT_NAMESPACE,
    'rev': DEFAULT_NAMESPACE,
    'role': DEFAULT_NAMESPACE,
    'rotate': DEFAULT_NAMESPACE,
    'rx': DEFAULT_NAMESPACE,
    'ry': DEFAULT_NAMESPACE,
    'scale': DEFAULT_NAMESPACE,
    'seed': DEFAULT_NAMESPACE,
    'shape-rendering': DEFAULT_NAMESPACE,
    'slope': DEFAULT_NAMESPACE,
    'snapshotTime': DEFAULT_NAMESPACE,
    'spacing': DEFAULT_NAMESPACE,
    'specularConstant': DEFAULT_NAMESPACE,
    'specularExponent': DEFAULT_NAMESPACE,
    'spreadMethod': DEFAULT_NAMESPACE,
    'startOffset': DEFAULT_NAMESPACE,
    'stdDeviation': DEFAULT_NAMESPACE,
    'stemh': DEFAULT_NAMESPACE,
    'stemv': DEFAULT_NAMESPACE,
    'stitchTiles': DEFAULT_NAMESPACE,
    'stop-color': DEFAULT_NAMESPACE,
    'stop-opacity': DEFAULT_NAMESPACE,
    'strikethrough-position': DEFAULT_NAMESPACE,
    'strikethrough-thickness': DEFAULT_NAMESPACE,
    'string': DEFAULT_NAMESPACE,
    'stroke': DEFAULT_NAMESPACE,
    'stroke-dasharray': DEFAULT_NAMESPACE,
    'stroke-dashoffset': DEFAULT_NAMESPACE,
    'stroke-linecap': DEFAULT_NAMESPACE,
    'stroke-linejoin': DEFAULT_NAMESPACE,
    'stroke-miterlimit': DEFAULT_NAMESPACE,
    'stroke-opacity': DEFAULT_NAMESPACE,
    'stroke-width': DEFAULT_NAMESPACE,
    'surfaceScale': DEFAULT_NAMESPACE,
    'syncBehavior': DEFAULT_NAMESPACE,
    'syncBehaviorDefault': DEFAULT_NAMESPACE,
    'syncMaster': DEFAULT_NAMESPACE,
    'syncTolerance': DEFAULT_NAMESPACE,
    'syncToleranceDefault': DEFAULT_NAMESPACE,
    'systemLanguage': DEFAULT_NAMESPACE,
    'tableValues': DEFAULT_NAMESPACE,
    'target': DEFAULT_NAMESPACE,
    'targetX': DEFAULT_NAMESPACE,
    'targetY': DEFAULT_NAMESPACE,
    'text-anchor': DEFAULT_NAMESPACE,
    'text-decoration': DEFAULT_NAMESPACE,
    'text-rendering': DEFAULT_NAMESPACE,
    'textLength': DEFAULT_NAMESPACE,
    'timelineBegin': DEFAULT_NAMESPACE,
    'title': DEFAULT_NAMESPACE,
    'to': DEFAULT_NAMESPACE,
    'transform': DEFAULT_NAMESPACE,
    'transformBehavior': DEFAULT_NAMESPACE,
    'type': DEFAULT_NAMESPACE,
    'typeof': DEFAULT_NAMESPACE,
    'u1': DEFAULT_NAMESPACE,
    'u2': DEFAULT_NAMESPACE,
    'underline-position': DEFAULT_NAMESPACE,
    'underline-thickness': DEFAULT_NAMESPACE,
    'unicode': DEFAULT_NAMESPACE,
    'unicode-bidi': DEFAULT_NAMESPACE,
    'unicode-range': DEFAULT_NAMESPACE,
    'units-per-em': DEFAULT_NAMESPACE,
    'v-alphabetic': DEFAULT_NAMESPACE,
    'v-hanging': DEFAULT_NAMESPACE,
    'v-ideographic': DEFAULT_NAMESPACE,
    'v-mathematical': DEFAULT_NAMESPACE,
    'values': DEFAULT_NAMESPACE,
    'version': DEFAULT_NAMESPACE,
    'vert-adv-y': DEFAULT_NAMESPACE,
    'vert-origin-x': DEFAULT_NAMESPACE,
    'vert-origin-y': DEFAULT_NAMESPACE,
    'viewBox': DEFAULT_NAMESPACE,
    'viewTarget': DEFAULT_NAMESPACE,
    'visibility': DEFAULT_NAMESPACE,
    'width': DEFAULT_NAMESPACE,
    'widths': DEFAULT_NAMESPACE,
    'word-spacing': DEFAULT_NAMESPACE,
    'writing-mode': DEFAULT_NAMESPACE,
    'x': DEFAULT_NAMESPACE,
    'x-height': DEFAULT_NAMESPACE,
    'x1': DEFAULT_NAMESPACE,
    'x2': DEFAULT_NAMESPACE,
    'xChannelSelector': DEFAULT_NAMESPACE,
    'xlink:actuate': XLINK_NAMESPACE,
    'xlink:arcrole': XLINK_NAMESPACE,
    'xlink:href': XLINK_NAMESPACE,
    'xlink:role': XLINK_NAMESPACE,
    'xlink:show': XLINK_NAMESPACE,
    'xlink:title': XLINK_NAMESPACE,
    'xlink:type': XLINK_NAMESPACE,
    'xml:base': XML_NAMESPACE,
    'xml:id': XML_NAMESPACE,
    'xml:lang': XML_NAMESPACE,
    'xml:space': XML_NAMESPACE,
    'y': DEFAULT_NAMESPACE,
    'y1': DEFAULT_NAMESPACE,
    'y2': DEFAULT_NAMESPACE,
    'yChannelSelector': DEFAULT_NAMESPACE,
    'z': DEFAULT_NAMESPACE,
    'zoomAndPan': DEFAULT_NAMESPACE
};

module.exports = SVGAttributeNamespace;

function SVGAttributeNamespace(value) {
  if (SVG_PROPERTIES.hasOwnProperty(value)) {
    return SVG_PROPERTIES[value];
  }
}

},{}],24:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var h = require('./index.js');


var SVGAttributeNamespace = require('./svg-attribute-namespace');
var attributeHook = require('./hooks/attribute-hook');

var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

module.exports = svg;

function svg(tagName, properties, children) {
    if (!children && isChildren(properties)) {
        children = properties;
        properties = {};
    }

    properties = properties || {};

    // set namespace for svg
    properties.namespace = SVG_NAMESPACE;

    var attributes = properties.attributes || (properties.attributes = {});

    for (var key in properties) {
        if (!properties.hasOwnProperty(key)) {
            continue;
        }

        var namespace = SVGAttributeNamespace(key);

        if (namespace === undefined) { // not a svg attribute
            continue;
        }

        var value = properties[key];

        if (typeof value !== 'string' &&
            typeof value !== 'number' &&
            typeof value !== 'boolean'
        ) {
            continue;
        }

        if (namespace !== null) { // namespaced attribute
            properties[key] = attributeHook(namespace, value);
            continue;
        }

        attributes[key] = value
        properties[key] = undefined
    }

    return h(tagName, properties, children);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x);
}

},{"./hooks/attribute-hook":18,"./index.js":21,"./svg-attribute-namespace":23,"x-is-array":10}],25:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":26,"./is-vnode":28,"./is-vtext":29,"./is-widget":30}],26:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],27:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],28:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":31}],29:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":31}],30:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],31:[function(require,module,exports){
module.exports = "2"

},{}],32:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":26,"./is-vhook":27,"./is-vnode":28,"./is-widget":30,"./version":31}],33:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":31}],34:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":31}],35:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":27,"is-object":9}],36:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free,     // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":25,"../vnode/is-thunk":26,"../vnode/is-vnode":28,"../vnode/is-vtext":29,"../vnode/is-widget":30,"../vnode/vpatch":33,"./diff-props":35,"x-is-array":10}],37:[function(require,module,exports){
return VDOM = {
  diff: require("virtual-dom/diff"),
  patch: require("virtual-dom/patch"),
  create: require("virtual-dom/create-element"),
  VHtml: require("virtual-dom/vnode/vnode"),
  VText: require("virtual-dom/vnode/vtext"),
  VSvg: require("virtual-dom/virtual-hyperscript/svg")
}

},{"virtual-dom/create-element":2,"virtual-dom/diff":3,"virtual-dom/patch":11,"virtual-dom/virtual-hyperscript/svg":24,"virtual-dom/vnode/vnode":32,"virtual-dom/vnode/vtext":34}]},{},[37]);

var k,aa=this;function ba(a,b){var c=a.split("."),d=aa;c[0]in d||!d.execScript||d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)c.length||void 0===b?d=d[e]?d[e]:d[e]={}:d[e]=b}
function ca(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function ea(a){return"function"==ca(a)}var fa="closure_uid_"+(1E9*Math.random()>>>0),ga=0;function ka(a,b,c){return a.call.apply(a.bind,arguments)}function la(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}
function na(a,b,c){na=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ka:la;return na.apply(null,arguments)};function oa(a,b){for(var c in a)b.call(void 0,a[c],c,a)};function pa(a,b){null!=a&&this.append.apply(this,arguments)}k=pa.prototype;k.hb="";k.set=function(a){this.hb=""+a};k.append=function(a,b,c){this.hb+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.hb+=arguments[d];return this};k.clear=function(){this.hb=""};k.toString=function(){return this.hb};function ra(a,b){a.sort(b||sa)}function ta(a,b){for(var c=0;c<a.length;c++)a[c]={index:c,value:a[c]};var d=b||sa;ra(a,function(a,b){return d(a.value,b.value)||a.index-b.index});for(c=0;c<a.length;c++)a[c]=a[c].value}function sa(a,b){return a>b?1:a<b?-1:0};var ua={},va;if("undefined"===typeof xa)var xa=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof ya)var ya=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var Aa=null;if("undefined"===typeof Ba)var Ba=null;function Ca(){return new u(null,5,[Da,!0,Fa,!0,Ga,!1,Ha,!1,Ia,null],null)}Ja;function v(a){return null!=a&&!1!==a}Ka;x;function Ma(a){return null==a}function Na(a){return a instanceof Array}
function Oa(a){return null==a?!0:!1===a?!0:!1}function Pa(a,b){return a[ca(null==b?null:b)]?!0:a._?!0:!1}function Sa(a,b){var c=null==b?null:b.constructor,c=v(v(c)?c.xb:c)?c.eb:ca(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function Ta(a){var b=a.eb;return v(b)?b:""+z(a)}var Ua="undefined"!==typeof Symbol&&"function"===ca(Symbol)?Symbol.iterator:"@@iterator";function Wa(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}D;Xa;
var Ja=function Ja(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ja.b(arguments[0]);case 2:return Ja.a(arguments[0],arguments[1]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};Ja.b=function(a){return Ja.a(null,a)};Ja.a=function(a,b){function c(a,b){a.push(b);return a}var d=[];return Xa.c?Xa.c(c,d,b):Xa.call(null,c,d,b)};Ja.w=2;function Ya(){}function Za(){}
var $a=function $a(b){if(null!=b&&null!=b.Y)return b.Y(b);var c=$a[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=$a._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("ICounted.-count",b);},ab=function ab(b){if(null!=b&&null!=b.da)return b.da(b);var c=ab[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ab._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IEmptyableCollection.-empty",b);};function bb(){}
var cb=function cb(b,c){if(null!=b&&null!=b.X)return b.X(b,c);var d=cb[ca(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=cb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("ICollection.-conj",b);};function db(){}
var eb=function eb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return eb.a(arguments[0],arguments[1]);case 3:return eb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};
eb.a=function(a,b){if(null!=a&&null!=a.ca)return a.ca(a,b);var c=eb[ca(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=eb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Sa("IIndexed.-nth",a);};eb.c=function(a,b,c){if(null!=a&&null!=a.Ea)return a.Ea(a,b,c);var d=eb[ca(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=eb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Sa("IIndexed.-nth",a);};eb.w=3;function fb(){}
var gb=function gb(b){if(null!=b&&null!=b.ta)return b.ta(b);var c=gb[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=gb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("ISeq.-first",b);},hb=function hb(b){if(null!=b&&null!=b.xa)return b.xa(b);var c=hb[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=hb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("ISeq.-rest",b);};function ib(){}function jb(){}
var kb=function kb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return kb.a(arguments[0],arguments[1]);case 3:return kb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};
kb.a=function(a,b){if(null!=a&&null!=a.N)return a.N(a,b);var c=kb[ca(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=kb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Sa("ILookup.-lookup",a);};kb.c=function(a,b,c){if(null!=a&&null!=a.I)return a.I(a,b,c);var d=kb[ca(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=kb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Sa("ILookup.-lookup",a);};kb.w=3;function lb(){}
var mb=function mb(b,c){if(null!=b&&null!=b.lc)return b.lc(b,c);var d=mb[ca(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=mb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("IAssociative.-contains-key?",b);},nb=function nb(b,c,d){if(null!=b&&null!=b.Oa)return b.Oa(b,c,d);var e=nb[ca(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=nb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Sa("IAssociative.-assoc",b);};function ob(){}
var pb=function pb(b,c){if(null!=b&&null!=b.ib)return b.ib(b,c);var d=pb[ca(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=pb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("IMap.-dissoc",b);};function qb(){}
var rb=function rb(b){if(null!=b&&null!=b.Mb)return b.Mb(b);var c=rb[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=rb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IMapEntry.-key",b);},sb=function sb(b){if(null!=b&&null!=b.Nb)return b.Nb(b);var c=sb[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=sb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IMapEntry.-val",b);};function tb(){}
var ub=function ub(b){if(null!=b&&null!=b.jb)return b.jb(b);var c=ub[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ub._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IStack.-peek",b);};function vb(){}
var wb=function wb(b,c,d){if(null!=b&&null!=b.kb)return b.kb(b,c,d);var e=wb[ca(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=wb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Sa("IVector.-assoc-n",b);},xb=function xb(b){if(null!=b&&null!=b.Jb)return b.Jb(b);var c=xb[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=xb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IDeref.-deref",b);};function yb(){}
var zb=function zb(b){if(null!=b&&null!=b.P)return b.P(b);var c=zb[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=zb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IMeta.-meta",b);},Ab=function Ab(b,c){if(null!=b&&null!=b.R)return b.R(b,c);var d=Ab[ca(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Ab._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("IWithMeta.-with-meta",b);};function Bb(){}
var Cb=function Cb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Cb.a(arguments[0],arguments[1]);case 3:return Cb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};
Cb.a=function(a,b){if(null!=a&&null!=a.ea)return a.ea(a,b);var c=Cb[ca(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=Cb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Sa("IReduce.-reduce",a);};Cb.c=function(a,b,c){if(null!=a&&null!=a.fa)return a.fa(a,b,c);var d=Cb[ca(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=Cb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Sa("IReduce.-reduce",a);};Cb.w=3;
var Db=function Db(b,c,d){if(null!=b&&null!=b.Lb)return b.Lb(b,c,d);var e=Db[ca(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Db._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Sa("IKVReduce.-kv-reduce",b);},Eb=function Eb(b,c){if(null!=b&&null!=b.D)return b.D(b,c);var d=Eb[ca(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Eb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("IEquiv.-equiv",b);},Fb=function Fb(b){if(null!=b&&null!=
b.U)return b.U(b);var c=Fb[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Fb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IHash.-hash",b);};function Hb(){}var Ib=function Ib(b){if(null!=b&&null!=b.V)return b.V(b);var c=Ib[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Ib._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("ISeqable.-seq",b);};function Jb(){}function Kb(){}function Lb(){}
var Mb=function Mb(b){if(null!=b&&null!=b.bc)return b.bc(b);var c=Mb[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Mb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IReversible.-rseq",b);},Nb=function Nb(b,c){if(null!=b&&null!=b.Bc)return b.Bc(0,c);var d=Nb[ca(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Nb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("IWriter.-write",b);},Ob=function Ob(b,c,d){if(null!=b&&null!=b.M)return b.M(b,c,d);
var e=Ob[ca(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Ob._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Sa("IPrintWithWriter.-pr-writer",b);},Pb=function Pb(b,c,d){if(null!=b&&null!=b.Ac)return b.Ac(0,c,d);var e=Pb[ca(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Pb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Sa("IWatchable.-notify-watches",b);},Qb=function Qb(b){if(null!=b&&null!=b.vb)return b.vb(b);var c=Qb[ca(null==
b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Qb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IEditableCollection.-as-transient",b);},Rb=function Rb(b,c){if(null!=b&&null!=b.Rb)return b.Rb(b,c);var d=Rb[ca(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Rb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("ITransientCollection.-conj!",b);},Sb=function Sb(b){if(null!=b&&null!=b.Sb)return b.Sb(b);var c=Sb[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):
c.call(null,b);c=Sb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("ITransientCollection.-persistent!",b);},Tb=function Tb(b,c,d){if(null!=b&&null!=b.Qb)return b.Qb(b,c,d);var e=Tb[ca(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Tb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Sa("ITransientAssociative.-assoc!",b);},Ub=function Ub(b,c,d){if(null!=b&&null!=b.zc)return b.zc(0,c,d);var e=Ub[ca(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,
b,c,d);e=Ub._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Sa("ITransientVector.-assoc-n!",b);};function Wb(){}
var Xb=function Xb(b,c){if(null!=b&&null!=b.ub)return b.ub(b,c);var d=Xb[ca(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Xb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("IComparable.-compare",b);},Yb=function Yb(b){if(null!=b&&null!=b.wc)return b.wc();var c=Yb[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Yb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IChunk.-drop-first",b);},Zb=function Zb(b){if(null!=b&&null!=b.nc)return b.nc(b);
var c=Zb[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Zb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IChunkedSeq.-chunked-first",b);},$b=function $b(b){if(null!=b&&null!=b.oc)return b.oc(b);var c=$b[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=$b._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IChunkedSeq.-chunked-rest",b);},ac=function ac(b){if(null!=b&&null!=b.mc)return b.mc(b);var c=ac[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):
c.call(null,b);c=ac._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IChunkedNext.-chunked-next",b);},bc=function bc(b){if(null!=b&&null!=b.Ob)return b.Ob(b);var c=bc[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=bc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("INamed.-name",b);},cc=function cc(b){if(null!=b&&null!=b.Pb)return b.Pb(b);var c=cc[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=cc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("INamed.-namespace",
b);},dc=function dc(b,c){if(null!=b&&null!=b.Zc)return b.Zc(b,c);var d=dc[ca(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=dc._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("IReset.-reset!",b);},ec=function ec(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return ec.a(arguments[0],arguments[1]);case 3:return ec.c(arguments[0],arguments[1],arguments[2]);case 4:return ec.o(arguments[0],arguments[1],arguments[2],
arguments[3]);case 5:return ec.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};ec.a=function(a,b){if(null!=a&&null!=a.ad)return a.ad(a,b);var c=ec[ca(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=ec._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Sa("ISwap.-swap!",a);};
ec.c=function(a,b,c){if(null!=a&&null!=a.bd)return a.bd(a,b,c);var d=ec[ca(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=ec._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Sa("ISwap.-swap!",a);};ec.o=function(a,b,c,d){if(null!=a&&null!=a.cd)return a.cd(a,b,c,d);var e=ec[ca(null==a?null:a)];if(null!=e)return e.o?e.o(a,b,c,d):e.call(null,a,b,c,d);e=ec._;if(null!=e)return e.o?e.o(a,b,c,d):e.call(null,a,b,c,d);throw Sa("ISwap.-swap!",a);};
ec.A=function(a,b,c,d,e){if(null!=a&&null!=a.dd)return a.dd(a,b,c,d,e);var f=ec[ca(null==a?null:a)];if(null!=f)return f.A?f.A(a,b,c,d,e):f.call(null,a,b,c,d,e);f=ec._;if(null!=f)return f.A?f.A(a,b,c,d,e):f.call(null,a,b,c,d,e);throw Sa("ISwap.-swap!",a);};ec.w=5;var fc=function fc(b){if(null!=b&&null!=b.Ga)return b.Ga(b);var c=fc[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=fc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IIterable.-iterator",b);};
function gc(a){this.rd=a;this.g=1073741824;this.C=0}gc.prototype.Bc=function(a,b){return this.rd.append(b)};function hc(a){var b=new pa;a.M(null,new gc(b),Ca());return""+z(b)}var ic="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function jc(a){a=ic(a|0,-862048943);return ic(a<<15|a>>>-15,461845907)}
function kc(a,b){var c=(a|0)^(b|0);return ic(c<<13|c>>>-13,5)+-430675100|0}function lc(a,b){var c=(a|0)^b,c=ic(c^c>>>16,-2048144789),c=ic(c^c>>>13,-1028477387);return c^c>>>16}function mc(a){var b;a:{b=1;for(var c=0;;)if(b<a.length){var d=b+2,c=kc(c,jc(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^jc(a.charCodeAt(a.length-1)):b;return lc(b,ic(2,a.length))}nc;oc;pc;qc;var rc={},sc=0;
function tc(a){255<sc&&(rc={},sc=0);var b=rc[a];if("number"!==typeof b){a:if(null!=a)if(b=a.length,0<b)for(var c=0,d=0;;)if(c<b)var e=c+1,d=ic(31,d)+a.charCodeAt(c),c=e;else{b=d;break a}else b=0;else b=0;rc[a]=b;sc+=1}return a=b}function uc(a){null!=a&&(a.g&4194304||a.yd)?a=a.U(null):"number"===typeof a?a=Math.floor(a)%2147483647:!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=tc(a),0!==a&&(a=jc(a),a=kc(0,a),a=lc(a,4))):a=a instanceof Date?a.valueOf():null==a?0:Fb(a);return a}
function vc(a,b){return a^b+2654435769+(a<<6)+(a>>2)}function Ka(a,b){return b instanceof a}function wc(a,b){if(a.$a===b.$a)return 0;var c=Oa(a.Ba);if(v(c?b.Ba:c))return-1;if(v(a.Ba)){if(Oa(b.Ba))return 1;c=sa(a.Ba,b.Ba);return 0===c?sa(a.name,b.name):c}return sa(a.name,b.name)}E;function oc(a,b,c,d,e){this.Ba=a;this.name=b;this.$a=c;this.tb=d;this.Da=e;this.g=2154168321;this.C=4096}k=oc.prototype;k.toString=function(){return this.$a};k.equiv=function(a){return this.D(null,a)};
k.D=function(a,b){return b instanceof oc?this.$a===b.$a:!1};k.call=function(){function a(a,b,c){return E.c?E.c(b,this,c):E.call(null,b,this,c)}function b(a,b){return E.a?E.a(b,this):E.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};
k.b=function(a){return E.a?E.a(a,this):E.call(null,a,this)};k.a=function(a,b){return E.c?E.c(a,this,b):E.call(null,a,this,b)};k.P=function(){return this.Da};k.R=function(a,b){return new oc(this.Ba,this.name,this.$a,this.tb,b)};k.U=function(){var a=this.tb;return null!=a?a:this.tb=a=vc(mc(this.name),tc(this.Ba))};k.Ob=function(){return this.name};k.Pb=function(){return this.Ba};k.M=function(a,b){return Nb(b,this.$a)};
var xc=function xc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return xc.b(arguments[0]);case 2:return xc.a(arguments[0],arguments[1]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};xc.b=function(a){if(a instanceof oc)return a;var b=a.indexOf("/");return-1===b?xc.a(null,a):xc.a(a.substring(0,b),a.substring(b+1,a.length))};xc.a=function(a,b){var c=null!=a?[z(a),z("/"),z(b)].join(""):b;return new oc(a,b,c,null,null)};
xc.w=2;F;yc;zc;function I(a){if(null==a)return null;if(null!=a&&(a.g&8388608||a.$c))return a.V(null);if(Na(a)||"string"===typeof a)return 0===a.length?null:new zc(a,0);if(Pa(Hb,a))return Ib(a);throw Error([z(a),z(" is not ISeqable")].join(""));}function J(a){if(null==a)return null;if(null!=a&&(a.g&64||a.F))return a.ta(null);a=I(a);return null==a?null:gb(a)}function Ac(a){return null!=a?null!=a&&(a.g&64||a.F)?a.xa(null):(a=I(a))?hb(a):Bc:Bc}
function K(a){return null==a?null:null!=a&&(a.g&128||a.ac)?a.wa(null):I(Ac(a))}var pc=function pc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return pc.b(arguments[0]);case 2:return pc.a(arguments[0],arguments[1]);default:return pc.j(arguments[0],arguments[1],new zc(c.slice(2),0))}};pc.b=function(){return!0};pc.a=function(a,b){return null==a?null==b:a===b||Eb(a,b)};
pc.j=function(a,b,c){for(;;)if(pc.a(a,b))if(K(c))a=b,b=J(c),c=K(c);else return pc.a(b,J(c));else return!1};pc.B=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return pc.j(b,a,c)};pc.w=2;function Cc(a){this.J=a}Cc.prototype.next=function(){if(null!=this.J){var a=J(this.J);this.J=K(this.J);return{value:a,done:!1}}return{value:null,done:!0}};function Dc(a){return new Cc(I(a))}Ec;function Fc(a,b,c){this.value=a;this.Db=b;this.jc=c;this.g=8388672;this.C=0}Fc.prototype.V=function(){return this};
Fc.prototype.ta=function(){return this.value};Fc.prototype.xa=function(){null==this.jc&&(this.jc=Ec.b?Ec.b(this.Db):Ec.call(null,this.Db));return this.jc};function Ec(a){var b=a.next();return v(b.done)?Bc:new Fc(b.value,a,null)}function Gc(a,b){var c=jc(a),c=kc(0,c);return lc(c,b)}function Hc(a){var b=0,c=1;for(a=I(a);;)if(null!=a)b+=1,c=ic(31,c)+uc(J(a))|0,a=K(a);else return Gc(c,b)}var Jc=Gc(1,0);function Kc(a){var b=0,c=0;for(a=I(a);;)if(null!=a)b+=1,c=c+uc(J(a))|0,a=K(a);else return Gc(c,b)}
var Lc=Gc(0,0);Mc;nc;Oc;Za["null"]=!0;$a["null"]=function(){return 0};Date.prototype.D=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};Date.prototype.Ib=!0;Date.prototype.ub=function(a,b){if(b instanceof Date)return sa(this.valueOf(),b.valueOf());throw Error([z("Cannot compare "),z(this),z(" to "),z(b)].join(""));};Eb.number=function(a,b){return a===b};Pc;Ya["function"]=!0;yb["function"]=!0;zb["function"]=function(){return null};Fb._=function(a){return a[fa]||(a[fa]=++ga)};
function Qc(a){return a+1}L;function Rc(a){this.H=a;this.g=32768;this.C=0}Rc.prototype.Jb=function(){return this.H};function Sc(a){return a instanceof Rc}function L(a){return xb(a)}function Tc(a,b){var c=$a(a);if(0===c)return b.l?b.l():b.call(null);for(var d=eb.a(a,0),e=1;;)if(e<c){var f=eb.a(a,e),d=b.a?b.a(d,f):b.call(null,d,f);if(Sc(d))return xb(d);e+=1}else return d}
function Uc(a,b,c){var d=$a(a),e=c;for(c=0;;)if(c<d){var f=eb.a(a,c),e=b.a?b.a(e,f):b.call(null,e,f);if(Sc(e))return xb(e);c+=1}else return e}function Vc(a,b){var c=a.length;if(0===a.length)return b.l?b.l():b.call(null);for(var d=a[0],e=1;;)if(e<c){var f=a[e],d=b.a?b.a(d,f):b.call(null,d,f);if(Sc(d))return xb(d);e+=1}else return d}function Wc(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var f=a[c],e=b.a?b.a(e,f):b.call(null,e,f);if(Sc(e))return xb(e);c+=1}else return e}
function Xc(a,b,c,d){for(var e=a.length;;)if(d<e){var f=a[d];c=b.a?b.a(c,f):b.call(null,c,f);if(Sc(c))return xb(c);d+=1}else return c}Yc;Zc;$c;ad;function bd(a){return null!=a?a.g&2||a.Qc?!0:a.g?!1:Pa(Za,a):Pa(Za,a)}function cd(a){return null!=a?a.g&16||a.xc?!0:a.g?!1:Pa(db,a):Pa(db,a)}function dd(a,b){this.f=a;this.s=b}dd.prototype.ya=function(){return this.s<this.f.length};dd.prototype.next=function(){var a=this.f[this.s];this.s+=1;return a};
function zc(a,b){this.f=a;this.s=b;this.g=166199550;this.C=8192}k=zc.prototype;k.toString=function(){return hc(this)};k.equiv=function(a){return this.D(null,a)};k.ca=function(a,b){var c=b+this.s;return c<this.f.length?this.f[c]:null};k.Ea=function(a,b,c){a=b+this.s;return a<this.f.length?this.f[a]:c};k.Ga=function(){return new dd(this.f,this.s)};k.wa=function(){return this.s+1<this.f.length?new zc(this.f,this.s+1):null};k.Y=function(){var a=this.f.length-this.s;return 0>a?0:a};
k.bc=function(){var a=$a(this);return 0<a?new $c(this,a-1,null):null};k.U=function(){return Hc(this)};k.D=function(a,b){return Oc.a?Oc.a(this,b):Oc.call(null,this,b)};k.da=function(){return Bc};k.ea=function(a,b){return Xc(this.f,b,this.f[this.s],this.s+1)};k.fa=function(a,b,c){return Xc(this.f,b,c,this.s)};k.ta=function(){return this.f[this.s]};k.xa=function(){return this.s+1<this.f.length?new zc(this.f,this.s+1):Bc};k.V=function(){return this.s<this.f.length?this:null};
k.X=function(a,b){return Zc.a?Zc.a(b,this):Zc.call(null,b,this)};zc.prototype[Ua]=function(){return Dc(this)};var yc=function yc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return yc.b(arguments[0]);case 2:return yc.a(arguments[0],arguments[1]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};yc.b=function(a){return yc.a(a,0)};yc.a=function(a,b){return b<a.length?new zc(a,b):null};yc.w=2;
var F=function F(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return F.b(arguments[0]);case 2:return F.a(arguments[0],arguments[1]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};F.b=function(a){return yc.a(a,0)};F.a=function(a,b){return yc.a(a,b)};F.w=2;Pc;ed;function $c(a,b,c){this.$b=a;this.s=b;this.v=c;this.g=32374990;this.C=8192}k=$c.prototype;k.toString=function(){return hc(this)};
k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};k.wa=function(){return 0<this.s?new $c(this.$b,this.s-1,null):null};k.Y=function(){return this.s+1};k.U=function(){return Hc(this)};k.D=function(a,b){return Oc.a?Oc.a(this,b):Oc.call(null,this,b)};k.da=function(){var a=Bc,b=this.v;return Pc.a?Pc.a(a,b):Pc.call(null,a,b)};k.ea=function(a,b){return ed.a?ed.a(b,this):ed.call(null,b,this)};k.fa=function(a,b,c){return ed.c?ed.c(b,c,this):ed.call(null,b,c,this)};
k.ta=function(){return eb.a(this.$b,this.s)};k.xa=function(){return 0<this.s?new $c(this.$b,this.s-1,null):Bc};k.V=function(){return this};k.R=function(a,b){return new $c(this.$b,this.s,b)};k.X=function(a,b){return Zc.a?Zc.a(b,this):Zc.call(null,b,this)};$c.prototype[Ua]=function(){return Dc(this)};function fd(a){return J(K(a))}function gd(a){for(;;){var b=K(a);if(null!=b)a=b;else return J(a)}}Eb._=function(a,b){return a===b};
var hd=function hd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return hd.l();case 1:return hd.b(arguments[0]);case 2:return hd.a(arguments[0],arguments[1]);default:return hd.j(arguments[0],arguments[1],new zc(c.slice(2),0))}};hd.l=function(){return id};hd.b=function(a){return a};hd.a=function(a,b){return null!=a?cb(a,b):cb(Bc,b)};hd.j=function(a,b,c){for(;;)if(v(c))a=hd.a(a,b),b=J(c),c=K(c);else return hd.a(a,b)};
hd.B=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return hd.j(b,a,c)};hd.w=2;function M(a){if(null!=a)if(null!=a&&(a.g&2||a.Qc))a=a.Y(null);else if(Na(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.g&8388608||a.$c))a:{a=I(a);for(var b=0;;){if(bd(a)){a=b+$a(a);break a}a=K(a);b+=1}}else a=$a(a);else a=0;return a}function jd(a,b){for(var c=null;;){if(null==a)return c;if(0===b)return I(a)?J(a):c;if(cd(a))return eb.c(a,b,c);if(I(a)){var d=K(a),e=b-1;a=d;b=e}else return c}}
function kd(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.g&16||a.xc))return a.ca(null,b);if(Na(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.g&64||a.F)){var c;a:{c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(I(c)){c=J(c);break a}throw Error("Index out of bounds");}if(cd(c)){c=eb.a(c,d);break a}if(I(c))c=K(c),--d;else throw Error("Index out of bounds");
}}return c}if(Pa(db,a))return eb.a(a,b);throw Error([z("nth not supported on this type "),z(Ta(null==a?null:a.constructor))].join(""));}
function N(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return null;if(null!=a&&(a.g&16||a.xc))return a.Ea(null,b,null);if(Na(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.g&64||a.F))return jd(a,b);if(Pa(db,a))return eb.a(a,b);throw Error([z("nth not supported on this type "),z(Ta(null==a?null:a.constructor))].join(""));}
var E=function E(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return E.a(arguments[0],arguments[1]);case 3:return E.c(arguments[0],arguments[1],arguments[2]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};E.a=function(a,b){return null==a?null:null!=a&&(a.g&256||a.yc)?a.N(null,b):Na(a)?b<a.length?a[b|0]:null:"string"===typeof a?b<a.length?a[b|0]:null:Pa(jb,a)?kb.a(a,b):null};
E.c=function(a,b,c){return null!=a?null!=a&&(a.g&256||a.yc)?a.I(null,b,c):Na(a)?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:Pa(jb,a)?kb.c(a,b,c):c:c};E.w=3;ld;var md=function md(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return md.c(arguments[0],arguments[1],arguments[2]);default:return md.j(arguments[0],arguments[1],arguments[2],new zc(c.slice(3),0))}};
md.c=function(a,b,c){if(null!=a)a=nb(a,b,c);else a:{a=[b];c=[c];b=a.length;var d=0,e;for(e=Qb(nd);;)if(d<b){var f=d+1;e=e.Qb(null,a[d],c[d]);d=f}else{a=Sb(e);break a}}return a};md.j=function(a,b,c,d){for(;;)if(a=md.c(a,b,c),v(d))b=J(d),c=fd(d),d=K(K(d));else return a};md.B=function(a){var b=J(a),c=K(a);a=J(c);var d=K(c),c=J(d),d=K(d);return md.j(b,a,c,d)};md.w=3;
var od=function od(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return od.b(arguments[0]);case 2:return od.a(arguments[0],arguments[1]);default:return od.j(arguments[0],arguments[1],new zc(c.slice(2),0))}};od.b=function(a){return a};od.a=function(a,b){return null==a?null:pb(a,b)};od.j=function(a,b,c){for(;;){if(null==a)return null;a=od.a(a,b);if(v(c))b=J(c),c=K(c);else return a}};
od.B=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return od.j(b,a,c)};od.w=2;function pd(a,b){this.h=a;this.v=b;this.g=393217;this.C=0}k=pd.prototype;k.P=function(){return this.v};k.R=function(a,b){return new pd(this.h,b)};k.Pc=!0;
k.call=function(){function a(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C,H,G,B){a=this;return D.wb?D.wb(a.h,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C,H,G,B):D.call(null,a.h,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C,H,G,B)}function b(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C,H,G){a=this;return a.h.qa?a.h.qa(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C,H,G):a.h.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C,H,G)}function c(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C,H){a=this;return a.h.pa?a.h.pa(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C,H):
a.h.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C,H)}function d(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C){a=this;return a.h.oa?a.h.oa(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C):a.h.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C)}function e(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A){a=this;return a.h.na?a.h.na(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A):a.h.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A)}function f(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y){a=this;return a.h.ma?a.h.ma(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y):a.h.call(null,b,
c,d,e,f,g,h,l,m,n,p,q,r,t,w,y)}function g(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w){a=this;return a.h.la?a.h.la(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w):a.h.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w)}function h(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t){a=this;return a.h.ka?a.h.ka(b,c,d,e,f,g,h,l,m,n,p,q,r,t):a.h.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t)}function l(a,b,c,d,e,f,g,h,l,m,n,p,q,r){a=this;return a.h.ja?a.h.ja(b,c,d,e,f,g,h,l,m,n,p,q,r):a.h.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r)}function m(a,b,c,d,e,f,g,h,l,m,n,p,q){a=this;
return a.h.ia?a.h.ia(b,c,d,e,f,g,h,l,m,n,p,q):a.h.call(null,b,c,d,e,f,g,h,l,m,n,p,q)}function n(a,b,c,d,e,f,g,h,l,m,n,p){a=this;return a.h.ha?a.h.ha(b,c,d,e,f,g,h,l,m,n,p):a.h.call(null,b,c,d,e,f,g,h,l,m,n,p)}function p(a,b,c,d,e,f,g,h,l,m,n){a=this;return a.h.ga?a.h.ga(b,c,d,e,f,g,h,l,m,n):a.h.call(null,b,c,d,e,f,g,h,l,m,n)}function q(a,b,c,d,e,f,g,h,l,m){a=this;return a.h.sa?a.h.sa(b,c,d,e,f,g,h,l,m):a.h.call(null,b,c,d,e,f,g,h,l,m)}function r(a,b,c,d,e,f,g,h,l){a=this;return a.h.ra?a.h.ra(b,c,
d,e,f,g,h,l):a.h.call(null,b,c,d,e,f,g,h,l)}function t(a,b,c,d,e,f,g,h){a=this;return a.h.ba?a.h.ba(b,c,d,e,f,g,h):a.h.call(null,b,c,d,e,f,g,h)}function w(a,b,c,d,e,f,g){a=this;return a.h.aa?a.h.aa(b,c,d,e,f,g):a.h.call(null,b,c,d,e,f,g)}function y(a,b,c,d,e,f){a=this;return a.h.A?a.h.A(b,c,d,e,f):a.h.call(null,b,c,d,e,f)}function C(a,b,c,d,e){a=this;return a.h.o?a.h.o(b,c,d,e):a.h.call(null,b,c,d,e)}function A(a,b,c,d){a=this;return a.h.c?a.h.c(b,c,d):a.h.call(null,b,c,d)}function G(a,b,c){a=this;
return a.h.a?a.h.a(b,c):a.h.call(null,b,c)}function H(a,b){a=this;return a.h.b?a.h.b(b):a.h.call(null,b)}function ja(a){a=this;return a.h.l?a.h.l():a.h.call(null)}var B=null,B=function(Y,ha,P,W,S,Z,da,ia,ma,qa,wa,za,B,Ea,Qa,La,Ra,Gb,Vb,Ic,Ed,xf){switch(arguments.length){case 1:return ja.call(this,Y);case 2:return H.call(this,Y,ha);case 3:return G.call(this,Y,ha,P);case 4:return A.call(this,Y,ha,P,W);case 5:return C.call(this,Y,ha,P,W,S);case 6:return y.call(this,Y,ha,P,W,S,Z);case 7:return w.call(this,
Y,ha,P,W,S,Z,da);case 8:return t.call(this,Y,ha,P,W,S,Z,da,ia);case 9:return r.call(this,Y,ha,P,W,S,Z,da,ia,ma);case 10:return q.call(this,Y,ha,P,W,S,Z,da,ia,ma,qa);case 11:return p.call(this,Y,ha,P,W,S,Z,da,ia,ma,qa,wa);case 12:return n.call(this,Y,ha,P,W,S,Z,da,ia,ma,qa,wa,za);case 13:return m.call(this,Y,ha,P,W,S,Z,da,ia,ma,qa,wa,za,B);case 14:return l.call(this,Y,ha,P,W,S,Z,da,ia,ma,qa,wa,za,B,Ea);case 15:return h.call(this,Y,ha,P,W,S,Z,da,ia,ma,qa,wa,za,B,Ea,Qa);case 16:return g.call(this,Y,
ha,P,W,S,Z,da,ia,ma,qa,wa,za,B,Ea,Qa,La);case 17:return f.call(this,Y,ha,P,W,S,Z,da,ia,ma,qa,wa,za,B,Ea,Qa,La,Ra);case 18:return e.call(this,Y,ha,P,W,S,Z,da,ia,ma,qa,wa,za,B,Ea,Qa,La,Ra,Gb);case 19:return d.call(this,Y,ha,P,W,S,Z,da,ia,ma,qa,wa,za,B,Ea,Qa,La,Ra,Gb,Vb);case 20:return c.call(this,Y,ha,P,W,S,Z,da,ia,ma,qa,wa,za,B,Ea,Qa,La,Ra,Gb,Vb,Ic);case 21:return b.call(this,Y,ha,P,W,S,Z,da,ia,ma,qa,wa,za,B,Ea,Qa,La,Ra,Gb,Vb,Ic,Ed);case 22:return a.call(this,Y,ha,P,W,S,Z,da,ia,ma,qa,wa,za,B,Ea,Qa,
La,Ra,Gb,Vb,Ic,Ed,xf)}throw Error("Invalid arity: "+arguments.length);};B.b=ja;B.a=H;B.c=G;B.o=A;B.A=C;B.aa=y;B.ba=w;B.ra=t;B.sa=r;B.ga=q;B.ha=p;B.ia=n;B.ja=m;B.ka=l;B.la=h;B.ma=g;B.na=f;B.oa=e;B.pa=d;B.qa=c;B.Kb=b;B.wb=a;return B}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};k.l=function(){return this.h.l?this.h.l():this.h.call(null)};k.b=function(a){return this.h.b?this.h.b(a):this.h.call(null,a)};k.a=function(a,b){return this.h.a?this.h.a(a,b):this.h.call(null,a,b)};
k.c=function(a,b,c){return this.h.c?this.h.c(a,b,c):this.h.call(null,a,b,c)};k.o=function(a,b,c,d){return this.h.o?this.h.o(a,b,c,d):this.h.call(null,a,b,c,d)};k.A=function(a,b,c,d,e){return this.h.A?this.h.A(a,b,c,d,e):this.h.call(null,a,b,c,d,e)};k.aa=function(a,b,c,d,e,f){return this.h.aa?this.h.aa(a,b,c,d,e,f):this.h.call(null,a,b,c,d,e,f)};k.ba=function(a,b,c,d,e,f,g){return this.h.ba?this.h.ba(a,b,c,d,e,f,g):this.h.call(null,a,b,c,d,e,f,g)};
k.ra=function(a,b,c,d,e,f,g,h){return this.h.ra?this.h.ra(a,b,c,d,e,f,g,h):this.h.call(null,a,b,c,d,e,f,g,h)};k.sa=function(a,b,c,d,e,f,g,h,l){return this.h.sa?this.h.sa(a,b,c,d,e,f,g,h,l):this.h.call(null,a,b,c,d,e,f,g,h,l)};k.ga=function(a,b,c,d,e,f,g,h,l,m){return this.h.ga?this.h.ga(a,b,c,d,e,f,g,h,l,m):this.h.call(null,a,b,c,d,e,f,g,h,l,m)};k.ha=function(a,b,c,d,e,f,g,h,l,m,n){return this.h.ha?this.h.ha(a,b,c,d,e,f,g,h,l,m,n):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n)};
k.ia=function(a,b,c,d,e,f,g,h,l,m,n,p){return this.h.ia?this.h.ia(a,b,c,d,e,f,g,h,l,m,n,p):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p)};k.ja=function(a,b,c,d,e,f,g,h,l,m,n,p,q){return this.h.ja?this.h.ja(a,b,c,d,e,f,g,h,l,m,n,p,q):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q)};k.ka=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){return this.h.ka?this.h.ka(a,b,c,d,e,f,g,h,l,m,n,p,q,r):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r)};
k.la=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t){return this.h.la?this.h.la(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t)};k.ma=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w){return this.h.ma?this.h.ma(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w)};k.na=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y){return this.h.na?this.h.na(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y)};
k.oa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C){return this.h.oa?this.h.oa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C)};k.pa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A){return this.h.pa?this.h.pa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A)};
k.qa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A,G){return this.h.qa?this.h.qa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A,G):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A,G)};k.Kb=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A,G,H){return D.wb?D.wb(this.h,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A,G,H):D.call(null,this.h,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A,G,H)};function Pc(a,b){return ea(a)?new pd(a,b):null==a?null:Ab(a,b)}
function qd(a){var b=null!=a;return(b?null!=a?a.g&131072||a.Wc||(a.g?0:Pa(yb,a)):Pa(yb,a):b)?zb(a):null}function rd(a){return null==a||Oa(I(a))}function sd(a){return null==a?!1:null!=a?a.g&4096||a.Cd?!0:a.g?!1:Pa(tb,a):Pa(tb,a)}function td(a){return null!=a?a.g&16777216||a.Bd?!0:a.g?!1:Pa(Jb,a):Pa(Jb,a)}function ud(a){return null==a?!1:null!=a?a.g&1024||a.Uc?!0:a.g?!1:Pa(ob,a):Pa(ob,a)}function vd(a){return null!=a?a.g&16384||a.Dd?!0:a.g?!1:Pa(vb,a):Pa(vb,a)}wd;xd;
function yd(a){return null!=a?a.C&512||a.wd?!0:!1:!1}function zd(a){var b=[];oa(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}function Ad(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var Bd={};function Cd(a){return null==a?!1:null!=a?a.g&64||a.F?!0:a.g?!1:Pa(fb,a):Pa(fb,a)}function Dd(a){return null==a?!1:!1===a?!1:!0}function Fd(a,b){return E.c(a,b,Bd)===Bd?!1:!0}
function Gd(a,b){var c;if(c=null!=a)c=null!=a?a.g&512||a.vd?!0:a.g?!1:Pa(lb,a):Pa(lb,a);return c&&Fd(a,b)?new O(null,2,5,Q,[b,E.a(a,b)],null):null}
function qc(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if("number"===typeof a){if("number"===typeof b)return sa(a,b);throw Error([z("Cannot compare "),z(a),z(" to "),z(b)].join(""));}if(null!=a?a.C&2048||a.Ib||(a.C?0:Pa(Wb,a)):Pa(Wb,a))return Xb(a,b);if("string"!==typeof a&&!Na(a)&&!0!==a&&!1!==a||(null==a?null:a.constructor)!==(null==b?null:b.constructor))throw Error([z("Cannot compare "),z(a),z(" to "),z(b)].join(""));return sa(a,b)}
function Hd(a,b){var c=M(a),d=M(b);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=qc(kd(a,d),kd(b,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}function Id(a){return pc.a(a,qc)?qc:function(b,c){var d=a.a?a.a(b,c):a.call(null,b,c);return"number"===typeof d?d:v(d)?-1:v(a.a?a.a(c,b):a.call(null,c,b))?1:0}}Jd;
var ed=function ed(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return ed.a(arguments[0],arguments[1]);case 3:return ed.c(arguments[0],arguments[1],arguments[2]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};ed.a=function(a,b){var c=I(b);if(c){var d=J(c),c=K(c);return Xa.c?Xa.c(a,d,c):Xa.call(null,a,d,c)}return a.l?a.l():a.call(null)};
ed.c=function(a,b,c){for(c=I(c);;)if(c){var d=J(c);b=a.a?a.a(b,d):a.call(null,b,d);if(Sc(b))return xb(b);c=K(c)}else return b};ed.w=3;Kd;var Xa=function Xa(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Xa.a(arguments[0],arguments[1]);case 3:return Xa.c(arguments[0],arguments[1],arguments[2]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};
Xa.a=function(a,b){return null!=b&&(b.g&524288||b.Yc)?b.ea(null,a):Na(b)?Vc(b,a):"string"===typeof b?Vc(b,a):Pa(Bb,b)?Cb.a(b,a):ed.a(a,b)};Xa.c=function(a,b,c){return null!=c&&(c.g&524288||c.Yc)?c.fa(null,a,b):Na(c)?Wc(c,a,b):"string"===typeof c?Wc(c,a,b):Pa(Bb,c)?Cb.c(c,a,b):ed.c(a,b,c)};Xa.w=3;function Ld(a){return a}function Md(a,b,c,d){a=a.b?a.b(b):a.call(null,b);c=Xa.c(a,c,d);return a.b?a.b(c):a.call(null,c)}
var Nd=function Nd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Nd.l();case 1:return Nd.b(arguments[0]);case 2:return Nd.a(arguments[0],arguments[1]);default:return Nd.j(arguments[0],arguments[1],new zc(c.slice(2),0))}};Nd.l=function(){return 0};Nd.b=function(a){return a};Nd.a=function(a,b){return a+b};Nd.j=function(a,b,c){return Xa.c(Nd,a+b,c)};Nd.B=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return Nd.j(b,a,c)};Nd.w=2;
var Od=function Od(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Od.b(arguments[0]);case 2:return Od.a(arguments[0],arguments[1]);default:return Od.j(arguments[0],arguments[1],new zc(c.slice(2),0))}};Od.b=function(a){return-a};Od.a=function(a,b){return a-b};Od.j=function(a,b,c){return Xa.c(Od,a-b,c)};Od.B=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return Od.j(b,a,c)};Od.w=2;
var Pd=function Pd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Pd.l();case 1:return Pd.b(arguments[0]);case 2:return Pd.a(arguments[0],arguments[1]);default:return Pd.j(arguments[0],arguments[1],new zc(c.slice(2),0))}};Pd.l=function(){return 1};Pd.b=function(a){return a};Pd.a=function(a,b){return a*b};Pd.j=function(a,b,c){return Xa.c(Pd,a*b,c)};Pd.B=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return Pd.j(b,a,c)};Pd.w=2;ua.Jd;
var Qd=function Qd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Qd.b(arguments[0]);case 2:return Qd.a(arguments[0],arguments[1]);default:return Qd.j(arguments[0],arguments[1],new zc(c.slice(2),0))}};Qd.b=function(a){return 1/a};Qd.a=function(a,b){return a/b};Qd.j=function(a,b,c){return Xa.c(Qd,a/b,c)};Qd.B=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return Qd.j(b,a,c)};Qd.w=2;function Rd(a){return a-1}
var Sd=function Sd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Sd.b(arguments[0]);case 2:return Sd.a(arguments[0],arguments[1]);default:return Sd.j(arguments[0],arguments[1],new zc(c.slice(2),0))}};Sd.b=function(a){return a};Sd.a=function(a,b){return a>b?a:b};Sd.j=function(a,b,c){return Xa.c(Sd,a>b?a:b,c)};Sd.B=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return Sd.j(b,a,c)};Sd.w=2;
var Td=function Td(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Td.b(arguments[0]);case 2:return Td.a(arguments[0],arguments[1]);default:return Td.j(arguments[0],arguments[1],new zc(c.slice(2),0))}};Td.b=function(a){return a};Td.a=function(a,b){return a<b?a:b};Td.j=function(a,b,c){return Xa.c(Td,a<b?a:b,c)};Td.B=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return Td.j(b,a,c)};Td.w=2;Ud;function Ud(a,b){return(a%b+b)%b}
function Vd(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function Wd(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function Xd(a,b){for(var c=b,d=I(a);;)if(d&&0<c)--c,d=K(d);else return d}var z=function z(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return z.l();case 1:return z.b(arguments[0]);default:return z.j(arguments[0],new zc(c.slice(1),0))}};z.l=function(){return""};
z.b=function(a){return null==a?"":""+a};z.j=function(a,b){for(var c=new pa(""+z(a)),d=b;;)if(v(d))c=c.append(""+z(J(d))),d=K(d);else return c.toString()};z.B=function(a){var b=J(a);a=K(a);return z.j(b,a)};z.w=1;R;Yd;function Oc(a,b){var c;if(td(b))if(bd(a)&&bd(b)&&M(a)!==M(b))c=!1;else a:{c=I(a);for(var d=I(b);;){if(null==c){c=null==d;break a}if(null!=d&&pc.a(J(c),J(d)))c=K(c),d=K(d);else{c=!1;break a}}}else c=null;return Dd(c)}
function Yc(a){if(I(a)){var b=uc(J(a));for(a=K(a);;){if(null==a)return b;b=vc(b,uc(J(a)));a=K(a)}}else return 0}Zd;$d;function ae(a){var b=0;for(a=I(a);;)if(a){var c=J(a),b=(b+(uc(Zd.b?Zd.b(c):Zd.call(null,c))^uc($d.b?$d.b(c):$d.call(null,c))))%4503599627370496;a=K(a)}else return b}Yd;be;ce;function ad(a,b,c,d,e){this.v=a;this.first=b;this.Ca=c;this.count=d;this.u=e;this.g=65937646;this.C=8192}k=ad.prototype;k.toString=function(){return hc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};
k.wa=function(){return 1===this.count?null:this.Ca};k.Y=function(){return this.count};k.jb=function(){return this.first};k.U=function(){var a=this.u;return null!=a?a:this.u=a=Hc(this)};k.D=function(a,b){return Oc(this,b)};k.da=function(){return Ab(Bc,this.v)};k.ea=function(a,b){return ed.a(b,this)};k.fa=function(a,b,c){return ed.c(b,c,this)};k.ta=function(){return this.first};k.xa=function(){return 1===this.count?Bc:this.Ca};k.V=function(){return this};
k.R=function(a,b){return new ad(b,this.first,this.Ca,this.count,this.u)};k.X=function(a,b){return new ad(this.v,b,this,this.count+1,null)};function de(a){return null!=a?a.g&33554432||a.zd?!0:a.g?!1:Pa(Kb,a):Pa(Kb,a)}ad.prototype[Ua]=function(){return Dc(this)};function ee(a){this.v=a;this.g=65937614;this.C=8192}k=ee.prototype;k.toString=function(){return hc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};k.wa=function(){return null};k.Y=function(){return 0};k.jb=function(){return null};
k.U=function(){return Jc};k.D=function(a,b){return de(b)||td(b)?null==I(b):!1};k.da=function(){return this};k.ea=function(a,b){return ed.a(b,this)};k.fa=function(a,b,c){return ed.c(b,c,this)};k.ta=function(){return null};k.xa=function(){return Bc};k.V=function(){return null};k.R=function(a,b){return new ee(b)};k.X=function(a,b){return new ad(this.v,b,null,1,null)};var Bc=new ee(null);ee.prototype[Ua]=function(){return Dc(this)};
function fe(a){return(null!=a?a.g&134217728||a.Ad||(a.g?0:Pa(Lb,a)):Pa(Lb,a))?Mb(a):Xa.c(hd,Bc,a)}var nc=function nc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return nc.j(0<c.length?new zc(c.slice(0),0):null)};nc.j=function(a){var b;if(a instanceof zc&&0===a.s)b=a.f;else a:for(b=[];;)if(null!=a)b.push(a.ta(null)),a=a.wa(null);else break a;a=b.length;for(var c=Bc;;)if(0<a){var d=a-1,c=c.X(null,b[a-1]);a=d}else return c};nc.w=0;nc.B=function(a){return nc.j(I(a))};
function ge(a,b,c,d){this.v=a;this.first=b;this.Ca=c;this.u=d;this.g=65929452;this.C=8192}k=ge.prototype;k.toString=function(){return hc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};k.wa=function(){return null==this.Ca?null:I(this.Ca)};k.U=function(){var a=this.u;return null!=a?a:this.u=a=Hc(this)};k.D=function(a,b){return Oc(this,b)};k.da=function(){return Pc(Bc,this.v)};k.ea=function(a,b){return ed.a(b,this)};k.fa=function(a,b,c){return ed.c(b,c,this)};k.ta=function(){return this.first};
k.xa=function(){return null==this.Ca?Bc:this.Ca};k.V=function(){return this};k.R=function(a,b){return new ge(b,this.first,this.Ca,this.u)};k.X=function(a,b){return new ge(null,b,this,this.u)};ge.prototype[Ua]=function(){return Dc(this)};function Zc(a,b){var c=null==b;return(c?c:null!=b&&(b.g&64||b.F))?new ge(null,a,b,null):new ge(null,a,I(b),null)}
function he(a,b){if(a.Ha===b.Ha)return 0;var c=Oa(a.Ba);if(v(c?b.Ba:c))return-1;if(v(a.Ba)){if(Oa(b.Ba))return 1;c=sa(a.Ba,b.Ba);return 0===c?sa(a.name,b.name):c}return sa(a.name,b.name)}function x(a,b,c,d){this.Ba=a;this.name=b;this.Ha=c;this.tb=d;this.g=2153775105;this.C=4096}k=x.prototype;k.toString=function(){return[z(":"),z(this.Ha)].join("")};k.equiv=function(a){return this.D(null,a)};k.D=function(a,b){return b instanceof x?this.Ha===b.Ha:!1};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return E.a(c,this);case 3:return E.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return E.a(c,this)};a.c=function(a,c,d){return E.c(c,this,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};k.b=function(a){return E.a(a,this)};k.a=function(a,b){return E.c(a,this,b)};
k.U=function(){var a=this.tb;return null!=a?a:this.tb=a=vc(mc(this.name),tc(this.Ba))+2654435769|0};k.Ob=function(){return this.name};k.Pb=function(){return this.Ba};k.M=function(a,b){return Nb(b,[z(":"),z(this.Ha)].join(""))};function T(a,b){return a===b?!0:a instanceof x&&b instanceof x?a.Ha===b.Ha:!1}
var ie=function ie(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ie.b(arguments[0]);case 2:return ie.a(arguments[0],arguments[1]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};
ie.b=function(a){if(a instanceof x)return a;if(a instanceof oc){var b;if(null!=a&&(a.C&4096||a.Xc))b=a.Pb(null);else throw Error([z("Doesn't support namespace: "),z(a)].join(""));return new x(b,Yd.b?Yd.b(a):Yd.call(null,a),a.$a,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new x(b[0],b[1],a,null):new x(null,b[0],a,null)):null};ie.a=function(a,b){return new x(a,b,[z(v(a)?[z(a),z("/")].join(""):null),z(b)].join(""),null)};ie.w=2;
function je(a,b,c,d){this.v=a;this.Cb=b;this.J=c;this.u=d;this.g=32374988;this.C=0}k=je.prototype;k.toString=function(){return hc(this)};k.equiv=function(a){return this.D(null,a)};function ke(a){null!=a.Cb&&(a.J=a.Cb.l?a.Cb.l():a.Cb.call(null),a.Cb=null);return a.J}k.P=function(){return this.v};k.wa=function(){Ib(this);return null==this.J?null:K(this.J)};k.U=function(){var a=this.u;return null!=a?a:this.u=a=Hc(this)};k.D=function(a,b){return Oc(this,b)};k.da=function(){return Pc(Bc,this.v)};
k.ea=function(a,b){return ed.a(b,this)};k.fa=function(a,b,c){return ed.c(b,c,this)};k.ta=function(){Ib(this);return null==this.J?null:J(this.J)};k.xa=function(){Ib(this);return null!=this.J?Ac(this.J):Bc};k.V=function(){ke(this);if(null==this.J)return null;for(var a=this.J;;)if(a instanceof je)a=ke(a);else return this.J=a,I(this.J)};k.R=function(a,b){return new je(b,this.Cb,this.J,this.u)};k.X=function(a,b){return Zc(b,this)};je.prototype[Ua]=function(){return Dc(this)};le;
function me(a,b){this.L=a;this.end=b;this.g=2;this.C=0}me.prototype.add=function(a){this.L[this.end]=a;return this.end+=1};me.prototype.O=function(){var a=new le(this.L,0,this.end);this.L=null;return a};me.prototype.Y=function(){return this.end};function ne(a){return new me(Array(a),0)}function le(a,b,c){this.f=a;this.ua=b;this.end=c;this.g=524306;this.C=0}k=le.prototype;k.Y=function(){return this.end-this.ua};k.ca=function(a,b){return this.f[this.ua+b]};
k.Ea=function(a,b,c){return 0<=b&&b<this.end-this.ua?this.f[this.ua+b]:c};k.wc=function(){if(this.ua===this.end)throw Error("-drop-first of empty chunk");return new le(this.f,this.ua+1,this.end)};k.ea=function(a,b){return Xc(this.f,b,this.f[this.ua],this.ua+1)};k.fa=function(a,b,c){return Xc(this.f,b,c,this.ua)};function wd(a,b,c,d){this.O=a;this.Wa=b;this.v=c;this.u=d;this.g=31850732;this.C=1536}k=wd.prototype;k.toString=function(){return hc(this)};k.equiv=function(a){return this.D(null,a)};
k.P=function(){return this.v};k.wa=function(){if(1<$a(this.O))return new wd(Yb(this.O),this.Wa,this.v,null);var a=Ib(this.Wa);return null==a?null:a};k.U=function(){var a=this.u;return null!=a?a:this.u=a=Hc(this)};k.D=function(a,b){return Oc(this,b)};k.da=function(){return Pc(Bc,this.v)};k.ta=function(){return eb.a(this.O,0)};k.xa=function(){return 1<$a(this.O)?new wd(Yb(this.O),this.Wa,this.v,null):null==this.Wa?Bc:this.Wa};k.V=function(){return this};k.nc=function(){return this.O};
k.oc=function(){return null==this.Wa?Bc:this.Wa};k.R=function(a,b){return new wd(this.O,this.Wa,b,this.u)};k.X=function(a,b){return Zc(b,this)};k.mc=function(){return null==this.Wa?null:this.Wa};wd.prototype[Ua]=function(){return Dc(this)};function oe(a,b){return 0===$a(a)?b:new wd(a,b,null,null)}function pe(a,b){a.add(b)}function be(a){return Zb(a)}function ce(a){return $b(a)}function Jd(a){for(var b=[];;)if(I(a))b.push(J(a)),a=K(a);else return b}
function qe(a){if("number"===typeof a)a:{var b=Array(a);if(Cd(null))for(var c=0,d=I(null);;)if(d&&c<a)b[c]=J(d),c+=1,d=K(d);else{a=b;break a}else{for(c=0;;)if(c<a)b[c]=null,c+=1;else break;a=b}}else a=Ja.b(a);return a}function re(a,b){if(bd(a))return M(a);for(var c=a,d=b,e=0;;)if(0<d&&I(c))c=K(c),--d,e+=1;else return e}
var se=function se(b){return null==b?null:null==K(b)?I(J(b)):Zc(J(b),se(K(b)))},te=function te(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return te.l();case 1:return te.b(arguments[0]);case 2:return te.a(arguments[0],arguments[1]);default:return te.j(arguments[0],arguments[1],new zc(c.slice(2),0))}};te.l=function(){return new je(null,function(){return null},null,null)};te.b=function(a){return new je(null,function(){return a},null,null)};
te.a=function(a,b){return new je(null,function(){var c=I(a);return c?yd(c)?oe(Zb(c),te.a($b(c),b)):Zc(J(c),te.a(Ac(c),b)):b},null,null)};te.j=function(a,b,c){return function e(a,b){return new je(null,function(){var c=I(a);return c?yd(c)?oe(Zb(c),e($b(c),b)):Zc(J(c),e(Ac(c),b)):v(b)?e(J(b),K(b)):null},null,null)}(te.a(a,b),c)};te.B=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return te.j(b,a,c)};te.w=2;function ue(a){return Sb(a)}
var ve=function ve(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return ve.l();case 1:return ve.b(arguments[0]);case 2:return ve.a(arguments[0],arguments[1]);default:return ve.j(arguments[0],arguments[1],new zc(c.slice(2),0))}};ve.l=function(){return Qb(id)};ve.b=function(a){return a};ve.a=function(a,b){return Rb(a,b)};ve.j=function(a,b,c){for(;;)if(a=Rb(a,b),v(c))b=J(c),c=K(c);else return a};
ve.B=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return ve.j(b,a,c)};ve.w=2;function we(a,b,c){return Tb(a,b,c)}
function xe(a,b,c){var d=I(c);if(0===b)return a.l?a.l():a.call(null);c=gb(d);var e=hb(d);if(1===b)return a.b?a.b(c):a.b?a.b(c):a.call(null,c);var d=gb(e),f=hb(e);if(2===b)return a.a?a.a(c,d):a.a?a.a(c,d):a.call(null,c,d);var e=gb(f),g=hb(f);if(3===b)return a.c?a.c(c,d,e):a.c?a.c(c,d,e):a.call(null,c,d,e);var f=gb(g),h=hb(g);if(4===b)return a.o?a.o(c,d,e,f):a.o?a.o(c,d,e,f):a.call(null,c,d,e,f);var g=gb(h),l=hb(h);if(5===b)return a.A?a.A(c,d,e,f,g):a.A?a.A(c,d,e,f,g):a.call(null,c,d,e,f,g);var h=gb(l),
m=hb(l);if(6===b)return a.aa?a.aa(c,d,e,f,g,h):a.aa?a.aa(c,d,e,f,g,h):a.call(null,c,d,e,f,g,h);var l=gb(m),n=hb(m);if(7===b)return a.ba?a.ba(c,d,e,f,g,h,l):a.ba?a.ba(c,d,e,f,g,h,l):a.call(null,c,d,e,f,g,h,l);var m=gb(n),p=hb(n);if(8===b)return a.ra?a.ra(c,d,e,f,g,h,l,m):a.ra?a.ra(c,d,e,f,g,h,l,m):a.call(null,c,d,e,f,g,h,l,m);var n=gb(p),q=hb(p);if(9===b)return a.sa?a.sa(c,d,e,f,g,h,l,m,n):a.sa?a.sa(c,d,e,f,g,h,l,m,n):a.call(null,c,d,e,f,g,h,l,m,n);var p=gb(q),r=hb(q);if(10===b)return a.ga?a.ga(c,
d,e,f,g,h,l,m,n,p):a.ga?a.ga(c,d,e,f,g,h,l,m,n,p):a.call(null,c,d,e,f,g,h,l,m,n,p);var q=gb(r),t=hb(r);if(11===b)return a.ha?a.ha(c,d,e,f,g,h,l,m,n,p,q):a.ha?a.ha(c,d,e,f,g,h,l,m,n,p,q):a.call(null,c,d,e,f,g,h,l,m,n,p,q);var r=gb(t),w=hb(t);if(12===b)return a.ia?a.ia(c,d,e,f,g,h,l,m,n,p,q,r):a.ia?a.ia(c,d,e,f,g,h,l,m,n,p,q,r):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r);var t=gb(w),y=hb(w);if(13===b)return a.ja?a.ja(c,d,e,f,g,h,l,m,n,p,q,r,t):a.ja?a.ja(c,d,e,f,g,h,l,m,n,p,q,r,t):a.call(null,c,d,e,f,g,h,l,
m,n,p,q,r,t);var w=gb(y),C=hb(y);if(14===b)return a.ka?a.ka(c,d,e,f,g,h,l,m,n,p,q,r,t,w):a.ka?a.ka(c,d,e,f,g,h,l,m,n,p,q,r,t,w):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,t,w);var y=gb(C),A=hb(C);if(15===b)return a.la?a.la(c,d,e,f,g,h,l,m,n,p,q,r,t,w,y):a.la?a.la(c,d,e,f,g,h,l,m,n,p,q,r,t,w,y):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y);var C=gb(A),G=hb(A);if(16===b)return a.ma?a.ma(c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C):a.ma?a.ma(c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C);var A=
gb(G),H=hb(G);if(17===b)return a.na?a.na(c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A):a.na?a.na(c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A);var G=gb(H),ja=hb(H);if(18===b)return a.oa?a.oa(c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A,G):a.oa?a.oa(c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A,G):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A,G);H=gb(ja);ja=hb(ja);if(19===b)return a.pa?a.pa(c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A,G,H):a.pa?a.pa(c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A,G,H):a.call(null,c,d,e,
f,g,h,l,m,n,p,q,r,t,w,y,C,A,G,H);var B=gb(ja);hb(ja);if(20===b)return a.qa?a.qa(c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A,G,H,B):a.qa?a.qa(c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A,G,H,B):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A,G,H,B);throw Error("Only up to 20 arguments supported on functions");}
var D=function D(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return D.a(arguments[0],arguments[1]);case 3:return D.c(arguments[0],arguments[1],arguments[2]);case 4:return D.o(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return D.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return D.j(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new zc(c.slice(5),0))}};
D.a=function(a,b){var c=a.w;if(a.B){var d=re(b,c+1);return d<=c?xe(a,d,b):a.B(b)}return a.apply(a,Jd(b))};D.c=function(a,b,c){b=Zc(b,c);c=a.w;if(a.B){var d=re(b,c+1);return d<=c?xe(a,d,b):a.B(b)}return a.apply(a,Jd(b))};D.o=function(a,b,c,d){b=Zc(b,Zc(c,d));c=a.w;return a.B?(d=re(b,c+1),d<=c?xe(a,d,b):a.B(b)):a.apply(a,Jd(b))};D.A=function(a,b,c,d,e){b=Zc(b,Zc(c,Zc(d,e)));c=a.w;return a.B?(d=re(b,c+1),d<=c?xe(a,d,b):a.B(b)):a.apply(a,Jd(b))};
D.j=function(a,b,c,d,e,f){b=Zc(b,Zc(c,Zc(d,Zc(e,se(f)))));c=a.w;return a.B?(d=re(b,c+1),d<=c?xe(a,d,b):a.B(b)):a.apply(a,Jd(b))};D.B=function(a){var b=J(a),c=K(a);a=J(c);var d=K(c),c=J(d),e=K(d),d=J(e),f=K(e),e=J(f),f=K(f);return D.j(b,a,c,d,e,f)};D.w=5;function ye(a){return I(a)?a:null}
var ze=function ze(){"undefined"===typeof va&&(va=function(b,c){this.od=b;this.nd=c;this.g=393216;this.C=0},va.prototype.R=function(b,c){return new va(this.od,c)},va.prototype.P=function(){return this.nd},va.prototype.ya=function(){return!1},va.prototype.next=function(){return Error("No such element")},va.prototype.remove=function(){return Error("Unsupported operation")},va.ic=function(){return new O(null,2,5,Q,[Pc(Ae,new u(null,1,[Be,nc(Ce,nc(id))],null)),ua.Id],null)},va.xb=!0,va.eb="cljs.core/t_cljs$core23323",
va.Tb=function(b,c){return Nb(c,"cljs.core/t_cljs$core23323")});return new va(ze,De)};Ee;function Ee(a,b,c,d){this.Fb=a;this.first=b;this.Ca=c;this.v=d;this.g=31719628;this.C=0}k=Ee.prototype;k.R=function(a,b){return new Ee(this.Fb,this.first,this.Ca,b)};k.X=function(a,b){return Zc(b,Ib(this))};k.da=function(){return Bc};k.D=function(a,b){return null!=Ib(this)?Oc(this,b):td(b)&&null==I(b)};k.U=function(){return Hc(this)};k.V=function(){null!=this.Fb&&this.Fb.step(this);return null==this.Ca?null:this};
k.ta=function(){null!=this.Fb&&Ib(this);return null==this.Ca?null:this.first};k.xa=function(){null!=this.Fb&&Ib(this);return null==this.Ca?Bc:this.Ca};k.wa=function(){null!=this.Fb&&Ib(this);return null==this.Ca?null:Ib(this.Ca)};Ee.prototype[Ua]=function(){return Dc(this)};function Fe(a,b){for(;;){if(null==I(b))return!0;var c;c=J(b);c=a.b?a.b(c):a.call(null,c);if(v(c)){c=a;var d=K(b);a=c;b=d}else return!1}}
function Ge(a,b){for(;;)if(I(b)){var c;c=J(b);c=a.b?a.b(c):a.call(null,c);if(v(c))return c;c=a;var d=K(b);a=c;b=d}else return null}
function He(a){return function(){function b(b,c){return Oa(a.a?a.a(b,c):a.call(null,b,c))}function c(b){return Oa(a.b?a.b(b):a.call(null,b))}function d(){return Oa(a.l?a.l():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new zc(g,0)}return c.call(this,a,d,f)}function c(b,d,e){return Oa(D.o(a,b,d,e))}b.w=2;b.B=function(a){var b=J(a);a=K(a);var d=J(a);a=Ac(a);return c(b,d,a)};b.j=
c;return b}(),e=function(a,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var m=null;if(2<arguments.length){for(var m=0,n=Array(arguments.length-2);m<n.length;)n[m]=arguments[m+2],++m;m=new zc(n,0)}return f.j(a,e,m)}throw Error("Invalid arity: "+arguments.length);};e.w=2;e.B=f.B;e.l=d;e.b=c;e.a=b;e.j=f.j;return e}()}
function Ie(a){return function(){function b(b){if(0<arguments.length)for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;return a}b.w=0;b.B=function(b){I(b);return a};b.j=function(){return a};return b}()}
var Je=function Je(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Je.l();case 1:return Je.b(arguments[0]);case 2:return Je.a(arguments[0],arguments[1]);case 3:return Je.c(arguments[0],arguments[1],arguments[2]);default:return Je.j(arguments[0],arguments[1],arguments[2],new zc(c.slice(3),0))}};Je.l=function(){return Ld};Je.b=function(a){return a};
Je.a=function(a,b){return function(){function c(c,d,e){c=b.c?b.c(c,d,e):b.call(null,c,d,e);return a.b?a.b(c):a.call(null,c)}function d(c,d){var e=b.a?b.a(c,d):b.call(null,c,d);return a.b?a.b(e):a.call(null,e)}function e(c){c=b.b?b.b(c):b.call(null,c);return a.b?a.b(c):a.call(null,c)}function f(){var c=b.l?b.l():b.call(null);return a.b?a.b(c):a.call(null,c)}var g=null,h=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+
3],++g;g=new zc(h,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){c=D.A(b,c,e,f,g);return a.b?a.b(c):a.call(null,c)}c.w=3;c.B=function(a){var b=J(a);a=K(a);var c=J(a);a=K(a);var e=J(a);a=Ac(a);return d(b,c,e,a)};c.j=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+
3],++q;q=new zc(r,0)}return h.j(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.B=h.B;g.l=f;g.b=e;g.a=d;g.c=c;g.j=h.j;return g}()};
Je.c=function(a,b,c){return function(){function d(d,e,f){d=c.c?c.c(d,e,f):c.call(null,d,e,f);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}function e(d,e){var f;f=c.a?c.a(d,e):c.call(null,d,e);f=b.b?b.b(f):b.call(null,f);return a.b?a.b(f):a.call(null,f)}function f(d){d=c.b?c.b(d):c.call(null,d);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}function g(){var d;d=c.l?c.l():c.call(null);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}var h=null,l=function(){function d(a,
b,c,f){var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;g=new zc(h,0)}return e.call(this,a,b,c,g)}function e(d,f,g,h){d=D.A(c,d,f,g,h);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}d.w=3;d.B=function(a){var b=J(a);a=K(a);var c=J(a);a=K(a);var d=J(a);a=Ac(a);return e(b,c,d,a)};d.j=e;return d}(),h=function(a,b,c,h){switch(arguments.length){case 0:return g.call(this);case 1:return f.call(this,a);case 2:return e.call(this,a,b);
case 3:return d.call(this,a,b,c);default:var r=null;if(3<arguments.length){for(var r=0,t=Array(arguments.length-3);r<t.length;)t[r]=arguments[r+3],++r;r=new zc(t,0)}return l.j(a,b,c,r)}throw Error("Invalid arity: "+arguments.length);};h.w=3;h.B=l.B;h.l=g;h.b=f;h.a=e;h.c=d;h.j=l.j;return h}()};
Je.j=function(a,b,c,d){return function(a){return function(){function b(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new zc(e,0)}return c.call(this,d)}function c(b){b=D.a(J(a),b);for(var d=K(a);;)if(d)b=J(d).call(null,b),d=K(d);else return b}b.w=0;b.B=function(a){a=I(a);return c(a)};b.j=c;return b}()}(fe(Zc(a,Zc(b,Zc(c,d)))))};Je.B=function(a){var b=J(a),c=K(a);a=J(c);var d=K(c),c=J(d),d=K(d);return Je.j(b,a,c,d)};Je.w=3;
function Ke(a,b){return function(){function c(c,d,e){return a.o?a.o(b,c,d,e):a.call(null,b,c,d,e)}function d(c,d){return a.c?a.c(b,c,d):a.call(null,b,c,d)}function e(c){return a.a?a.a(b,c):a.call(null,b,c)}function f(){return a.b?a.b(b):a.call(null,b)}var g=null,h=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;g=new zc(h,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){return D.j(a,b,c,e,f,F([g],0))}c.w=
3;c.B=function(a){var b=J(a);a=K(a);var c=J(a);a=K(a);var e=J(a);a=Ac(a);return d(b,c,e,a)};c.j=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+3],++q;q=new zc(r,0)}return h.j(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.B=h.B;g.l=f;g.b=
e;g.a=d;g.c=c;g.j=h.j;return g}()}Le;function Me(a,b){return function d(b,f){return new je(null,function(){var g=I(f);if(g){if(yd(g)){for(var h=Zb(g),l=M(h),m=ne(l),n=0;;)if(n<l)pe(m,function(){var d=b+n,f=eb.a(h,n);return a.a?a.a(d,f):a.call(null,d,f)}()),n+=1;else break;return oe(m.O(),d(b+l,$b(g)))}return Zc(function(){var d=J(g);return a.a?a.a(b,d):a.call(null,b,d)}(),d(b+1,Ac(g)))}return null},null,null)}(0,b)}function Ne(a,b,c,d){this.state=a;this.v=b;this.Nc=d;this.C=16386;this.g=6455296}
k=Ne.prototype;k.equiv=function(a){return this.D(null,a)};k.D=function(a,b){return this===b};k.Jb=function(){return this.state};k.P=function(){return this.v};k.Ac=function(a,b,c){a=I(this.Nc);for(var d=null,e=0,f=0;;)if(f<e){var g=d.ca(null,f),h=N(g,0),g=N(g,1);g.o?g.o(h,this,b,c):g.call(null,h,this,b,c);f+=1}else if(a=I(a))yd(a)?(d=Zb(a),a=$b(a),h=d,e=M(d),d=h):(d=J(a),h=N(d,0),g=N(d,1),g.o?g.o(h,this,b,c):g.call(null,h,this,b,c),a=K(a),d=null,e=0),f=0;else return null};
k.U=function(){return this[fa]||(this[fa]=++ga)};var U=function U(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return U.b(arguments[0]);default:return U.j(arguments[0],new zc(c.slice(1),0))}};U.b=function(a){return new Ne(a,null,0,null)};U.j=function(a,b){var c=null!=b&&(b.g&64||b.F)?D.a(Mc,b):b,d=E.a(c,Ga);E.a(c,Oe);return new Ne(a,d,0,null)};U.B=function(a){var b=J(a);a=K(a);return U.j(b,a)};U.w=1;Pe;
function Qe(a,b){if(a instanceof Ne){var c=a.state;a.state=b;null!=a.Nc&&Pb(a,c,b);return b}return dc(a,b)}var Re=function Re(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Re.a(arguments[0],arguments[1]);case 3:return Re.c(arguments[0],arguments[1],arguments[2]);case 4:return Re.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:return Re.j(arguments[0],arguments[1],arguments[2],arguments[3],new zc(c.slice(4),0))}};
Re.a=function(a,b){var c;a instanceof Ne?(c=a.state,c=b.b?b.b(c):b.call(null,c),c=Qe(a,c)):c=ec.a(a,b);return c};Re.c=function(a,b,c){if(a instanceof Ne){var d=a.state;b=b.a?b.a(d,c):b.call(null,d,c);a=Qe(a,b)}else a=ec.c(a,b,c);return a};Re.o=function(a,b,c,d){if(a instanceof Ne){var e=a.state;b=b.c?b.c(e,c,d):b.call(null,e,c,d);a=Qe(a,b)}else a=ec.o(a,b,c,d);return a};Re.j=function(a,b,c,d,e){return a instanceof Ne?Qe(a,D.A(b,a.state,c,d,e)):ec.A(a,b,c,d,e)};
Re.B=function(a){var b=J(a),c=K(a);a=J(c);var d=K(c),c=J(d),e=K(d),d=J(e),e=K(e);return Re.j(b,a,c,d,e)};Re.w=4;function Se(a){this.state=a;this.g=32768;this.C=0}Se.prototype.Jb=function(){return this.state};function Le(a){return new Se(a)}
var R=function R(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return R.b(arguments[0]);case 2:return R.a(arguments[0],arguments[1]);case 3:return R.c(arguments[0],arguments[1],arguments[2]);case 4:return R.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:return R.j(arguments[0],arguments[1],arguments[2],arguments[3],new zc(c.slice(4),0))}};
R.b=function(a){return function(b){return function(){function c(c,d){var e=a.b?a.b(d):a.call(null,d);return b.a?b.a(c,e):b.call(null,c,e)}function d(a){return b.b?b.b(a):b.call(null,a)}function e(){return b.l?b.l():b.call(null)}var f=null,g=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new zc(g,0)}return d.call(this,a,b,f)}function d(c,e,f){e=D.c(a,e,f);return b.a?b.a(c,e):b.call(null,c,e)}c.w=2;c.B=function(a){var b=
J(a);a=K(a);var c=J(a);a=Ac(a);return d(b,c,a)};c.j=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var n=null;if(2<arguments.length){for(var n=0,p=Array(arguments.length-2);n<p.length;)p[n]=arguments[n+2],++n;n=new zc(p,0)}return g.j(a,b,n)}throw Error("Invalid arity: "+arguments.length);};f.w=2;f.B=g.B;f.l=e;f.b=d;f.a=c;f.j=g.j;return f}()}};
R.a=function(a,b){return new je(null,function(){var c=I(b);if(c){if(yd(c)){for(var d=Zb(c),e=M(d),f=ne(e),g=0;;)if(g<e)pe(f,function(){var b=eb.a(d,g);return a.b?a.b(b):a.call(null,b)}()),g+=1;else break;return oe(f.O(),R.a(a,$b(c)))}return Zc(function(){var b=J(c);return a.b?a.b(b):a.call(null,b)}(),R.a(a,Ac(c)))}return null},null,null)};
R.c=function(a,b,c){return new je(null,function(){var d=I(b),e=I(c);if(d&&e){var f=Zc,g;g=J(d);var h=J(e);g=a.a?a.a(g,h):a.call(null,g,h);d=f(g,R.c(a,Ac(d),Ac(e)))}else d=null;return d},null,null)};R.o=function(a,b,c,d){return new je(null,function(){var e=I(b),f=I(c),g=I(d);if(e&&f&&g){var h=Zc,l;l=J(e);var m=J(f),n=J(g);l=a.c?a.c(l,m,n):a.call(null,l,m,n);e=h(l,R.o(a,Ac(e),Ac(f),Ac(g)))}else e=null;return e},null,null)};
R.j=function(a,b,c,d,e){var f=function h(a){return new je(null,function(){var b=R.a(I,a);return Fe(Ld,b)?Zc(R.a(J,b),h(R.a(Ac,b))):null},null,null)};return R.a(function(){return function(b){return D.a(a,b)}}(f),f(hd.j(e,d,F([c,b],0))))};R.B=function(a){var b=J(a),c=K(a);a=J(c);var d=K(c),c=J(d),e=K(d),d=J(e),e=K(e);return R.j(b,a,c,d,e)};R.w=4;function Te(a,b){return new je(null,function(){if(0<a){var c=I(b);return c?Zc(J(c),Te(a-1,Ac(c))):null}return null},null,null)}
function Ue(a,b){return new je(null,function(c){return function(){return c(a,b)}}(function(a,b){for(;;){var e=I(b);if(0<a&&e){var f=a-1,e=Ac(e);a=f;b=e}else return e}}),null,null)}function Ve(a){return new je(null,function(){return Zc(a,Ve(a))},null,null)}function We(a){return new je(null,function(){return Zc(a.l?a.l():a.call(null),We(a))},null,null)}
var Xe=function Xe(b,c){return Zc(c,new je(null,function(){return Xe(b,b.b?b.b(c):b.call(null,c))},null,null))},Ye=function Ye(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ye.a(arguments[0],arguments[1]);default:return Ye.j(arguments[0],arguments[1],new zc(c.slice(2),0))}};Ye.a=function(a,b){return new je(null,function(){var c=I(a),d=I(b);return c&&d?Zc(J(c),Zc(J(d),Ye.a(Ac(c),Ac(d)))):null},null,null)};
Ye.j=function(a,b,c){return new je(null,function(){var d=R.a(I,hd.j(c,b,F([a],0)));return Fe(Ld,d)?te.a(R.a(J,d),D.a(Ye,R.a(Ac,d))):null},null,null)};Ye.B=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return Ye.j(b,a,c)};Ye.w=2;function Ze(a){return Ue(1,Ye.a(Ve("L"),a))}$e;function af(a,b){return D.a(te,D.c(R,a,b))}
function bf(a,b){return new je(null,function(){var c=I(b);if(c){if(yd(c)){for(var d=Zb(c),e=M(d),f=ne(e),g=0;;)if(g<e){var h;h=eb.a(d,g);h=a.b?a.b(h):a.call(null,h);v(h)&&(h=eb.a(d,g),f.add(h));g+=1}else break;return oe(f.O(),bf(a,$b(c)))}d=J(c);c=Ac(c);return v(a.b?a.b(d):a.call(null,d))?Zc(d,bf(a,c)):bf(a,c)}return null},null,null)}
function cf(a){return function c(a){return new je(null,function(){return Zc(a,v(Cd.b?Cd.b(a):Cd.call(null,a))?af(c,F([I.b?I.b(a):I.call(null,a)],0)):null)},null,null)}(a)}var df=function df(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return df.a(arguments[0],arguments[1]);case 3:return df.c(arguments[0],arguments[1],arguments[2]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};
df.a=function(a,b){return null!=a?null!=a&&(a.C&4||a.Rc)?Pc(ue(Xa.c(Rb,Qb(a),b)),qd(a)):Xa.c(cb,a,b):Xa.c(hd,Bc,b)};df.c=function(a,b,c){return null!=a&&(a.C&4||a.Rc)?Pc(ue(Md(b,ve,Qb(a),c)),qd(a)):Md(b,hd,a,c)};df.w=3;function ef(a,b){return ue(Xa.c(function(b,d){return ve.a(b,a.b?a.b(d):a.call(null,d))},Qb(id),b))}
function ff(a,b){var c;a:{c=Bd;for(var d=a,e=I(b);;)if(e)if(null!=d?d.g&256||d.yc||(d.g?0:Pa(jb,d)):Pa(jb,d)){d=E.c(d,J(e),c);if(c===d){c=null;break a}e=K(e)}else{c=null;break a}else{c=d;break a}}return c}function gf(a,b,c){return md.c(a,b,function(){var d=E.a(a,b);return c.b?c.b(d):c.call(null,d)}())}function hf(a,b,c,d){return md.c(a,b,function(){var e=E.a(a,b);return c.a?c.a(e,d):c.call(null,e,d)}())}
function jf(a,b,c,d){var e=kf;return md.c(a,e,function(){var f=E.a(a,e);return b.c?b.c(f,c,d):b.call(null,f,c,d)}())}function lf(a,b){this.W=a;this.f=b}function mf(a){return new lf(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function nf(a){a=a.m;return 32>a?0:a-1>>>5<<5}function of(a,b,c){for(;;){if(0===b)return c;var d=mf(a);d.f[0]=c;c=d;b-=5}}
var pf=function pf(b,c,d,e){var f=new lf(d.W,Wa(d.f)),g=b.m-1>>>c&31;5===c?f.f[g]=e:(d=d.f[g],b=null!=d?pf(b,c-5,d,e):of(null,c-5,e),f.f[g]=b);return f};function qf(a,b){throw Error([z("No item "),z(a),z(" in vector of length "),z(b)].join(""));}function rf(a,b){if(b>=nf(a))return a.S;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.f[b>>>d&31],d=e;else return c.f}function sf(a,b){return 0<=b&&b<a.m?rf(a,b):qf(b,a.m)}
var tf=function tf(b,c,d,e,f){var g=new lf(d.W,Wa(d.f));if(0===c)g.f[e&31]=f;else{var h=e>>>c&31;b=tf(b,c-5,d.f[h],e,f);g.f[h]=b}return g};function uf(a,b,c,d,e,f){this.s=a;this.kc=b;this.f=c;this.Na=d;this.start=e;this.end=f}uf.prototype.ya=function(){return this.s<this.end};uf.prototype.next=function(){32===this.s-this.kc&&(this.f=rf(this.Na,this.s),this.kc+=32);var a=this.f[this.s&31];this.s+=1;return a};vf;wf;yf;L;zf;Af;Bf;
function O(a,b,c,d,e,f){this.v=a;this.m=b;this.shift=c;this.root=d;this.S=e;this.u=f;this.g=167668511;this.C=8196}k=O.prototype;k.toString=function(){return hc(this)};k.equiv=function(a){return this.D(null,a)};k.N=function(a,b){return kb.c(this,b,null)};k.I=function(a,b,c){return"number"===typeof b?eb.c(this,b,c):c};
k.Lb=function(a,b,c){a=0;for(var d=c;;)if(a<this.m){var e=rf(this,a);c=e.length;a:for(var f=0;;)if(f<c){var g=f+a,h=e[f],d=b.c?b.c(d,g,h):b.call(null,d,g,h);if(Sc(d)){e=d;break a}f+=1}else{e=d;break a}if(Sc(e))return L.b?L.b(e):L.call(null,e);a+=c;d=e}else return d};k.ca=function(a,b){return sf(this,b)[b&31]};k.Ea=function(a,b,c){return 0<=b&&b<this.m?rf(this,b)[b&31]:c};
k.kb=function(a,b,c){if(0<=b&&b<this.m)return nf(this)<=b?(a=Wa(this.S),a[b&31]=c,new O(this.v,this.m,this.shift,this.root,a,null)):new O(this.v,this.m,this.shift,tf(this,this.shift,this.root,b,c),this.S,null);if(b===this.m)return cb(this,c);throw Error([z("Index "),z(b),z(" out of bounds  [0,"),z(this.m),z("]")].join(""));};k.Ga=function(){var a=this.m;return new uf(0,0,0<M(this)?rf(this,0):null,this,0,a)};k.P=function(){return this.v};k.Y=function(){return this.m};
k.Mb=function(){return eb.a(this,0)};k.Nb=function(){return eb.a(this,1)};k.jb=function(){return 0<this.m?eb.a(this,this.m-1):null};k.bc=function(){return 0<this.m?new $c(this,this.m-1,null):null};k.U=function(){var a=this.u;return null!=a?a:this.u=a=Hc(this)};k.D=function(a,b){if(b instanceof O)if(this.m===M(b))for(var c=fc(this),d=fc(b);;)if(v(c.ya())){var e=c.next(),f=d.next();if(!pc.a(e,f))return!1}else return!0;else return!1;else return Oc(this,b)};
k.vb=function(){return new yf(this.m,this.shift,vf.b?vf.b(this.root):vf.call(null,this.root),wf.b?wf.b(this.S):wf.call(null,this.S))};k.da=function(){return Pc(id,this.v)};k.ea=function(a,b){return Tc(this,b)};k.fa=function(a,b,c){a=0;for(var d=c;;)if(a<this.m){var e=rf(this,a);c=e.length;a:for(var f=0;;)if(f<c){var g=e[f],d=b.a?b.a(d,g):b.call(null,d,g);if(Sc(d)){e=d;break a}f+=1}else{e=d;break a}if(Sc(e))return L.b?L.b(e):L.call(null,e);a+=c;d=e}else return d};
k.Oa=function(a,b,c){if("number"===typeof b)return wb(this,b,c);throw Error("Vector's key for assoc must be a number.");};k.V=function(){if(0===this.m)return null;if(32>=this.m)return new zc(this.S,0);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.f[0];else{a=a.f;break a}}return Bf.o?Bf.o(this,a,0,0):Bf.call(null,this,a,0,0)};k.R=function(a,b){return new O(b,this.m,this.shift,this.root,this.S,this.u)};
k.X=function(a,b){if(32>this.m-nf(this)){for(var c=this.S.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.S[e],e+=1;else break;d[c]=b;return new O(this.v,this.m+1,this.shift,this.root,d,null)}c=(d=this.m>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=mf(null),d.f[0]=this.root,e=of(null,this.shift,new lf(null,this.S)),d.f[1]=e):d=pf(this,this.shift,this.root,new lf(null,this.S));return new O(this.v,this.m+1,c,d,[b],null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.ca(null,c);case 3:return this.Ea(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.ca(null,c)};a.c=function(a,c,d){return this.Ea(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};k.b=function(a){return this.ca(null,a)};k.a=function(a,b){return this.Ea(null,a,b)};
var Q=new lf(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),id=new O(null,0,5,Q,[],Jc);function Cf(a){var b=a.length;if(32>b)return new O(null,b,5,Q,a,null);for(var c=32,d=(new O(null,32,5,Q,a.slice(0,32),null)).vb(null);;)if(c<b)var e=c+1,d=ve.a(d,a[c]),c=e;else return Sb(d)}O.prototype[Ua]=function(){return Dc(this)};function Kd(a){return Na(a)?Cf(a):Sb(Xa.c(Rb,Qb(id),a))}
var Df=function Df(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Df.j(0<c.length?new zc(c.slice(0),0):null)};Df.j=function(a){return a instanceof zc&&0===a.s?Cf(a.f):Kd(a)};Df.w=0;Df.B=function(a){return Df.j(I(a))};Ef;function xd(a,b,c,d,e,f){this.Ia=a;this.node=b;this.s=c;this.ua=d;this.v=e;this.u=f;this.g=32375020;this.C=1536}k=xd.prototype;k.toString=function(){return hc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};
k.wa=function(){if(this.ua+1<this.node.length){var a;a=this.Ia;var b=this.node,c=this.s,d=this.ua+1;a=Bf.o?Bf.o(a,b,c,d):Bf.call(null,a,b,c,d);return null==a?null:a}return ac(this)};k.U=function(){var a=this.u;return null!=a?a:this.u=a=Hc(this)};k.D=function(a,b){return Oc(this,b)};k.da=function(){return Pc(id,this.v)};k.ea=function(a,b){var c;c=this.Ia;var d=this.s+this.ua,e=M(this.Ia);c=Ef.c?Ef.c(c,d,e):Ef.call(null,c,d,e);return Tc(c,b)};
k.fa=function(a,b,c){a=this.Ia;var d=this.s+this.ua,e=M(this.Ia);a=Ef.c?Ef.c(a,d,e):Ef.call(null,a,d,e);return Uc(a,b,c)};k.ta=function(){return this.node[this.ua]};k.xa=function(){if(this.ua+1<this.node.length){var a;a=this.Ia;var b=this.node,c=this.s,d=this.ua+1;a=Bf.o?Bf.o(a,b,c,d):Bf.call(null,a,b,c,d);return null==a?Bc:a}return $b(this)};k.V=function(){return this};k.nc=function(){var a=this.node;return new le(a,this.ua,a.length)};
k.oc=function(){var a=this.s+this.node.length;if(a<$a(this.Ia)){var b=this.Ia,c=rf(this.Ia,a);return Bf.o?Bf.o(b,c,a,0):Bf.call(null,b,c,a,0)}return Bc};k.R=function(a,b){return Bf.A?Bf.A(this.Ia,this.node,this.s,this.ua,b):Bf.call(null,this.Ia,this.node,this.s,this.ua,b)};k.X=function(a,b){return Zc(b,this)};k.mc=function(){var a=this.s+this.node.length;if(a<$a(this.Ia)){var b=this.Ia,c=rf(this.Ia,a);return Bf.o?Bf.o(b,c,a,0):Bf.call(null,b,c,a,0)}return null};xd.prototype[Ua]=function(){return Dc(this)};
var Bf=function Bf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Bf.c(arguments[0],arguments[1],arguments[2]);case 4:return Bf.o(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Bf.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};Bf.c=function(a,b,c){return new xd(a,sf(a,b),b,c,null,null)};
Bf.o=function(a,b,c,d){return new xd(a,b,c,d,null,null)};Bf.A=function(a,b,c,d,e){return new xd(a,b,c,d,e,null)};Bf.w=5;Ff;function Gf(a,b,c,d,e){this.v=a;this.Na=b;this.start=c;this.end=d;this.u=e;this.g=167666463;this.C=8192}k=Gf.prototype;k.toString=function(){return hc(this)};k.equiv=function(a){return this.D(null,a)};k.N=function(a,b){return kb.c(this,b,null)};k.I=function(a,b,c){return"number"===typeof b?eb.c(this,b,c):c};
k.Lb=function(a,b,c){a=this.start;for(var d=0;;)if(a<this.end){var e=d,f=eb.a(this.Na,a);c=b.c?b.c(c,e,f):b.call(null,c,e,f);if(Sc(c))return L.b?L.b(c):L.call(null,c);d+=1;a+=1}else return c};k.ca=function(a,b){return 0>b||this.end<=this.start+b?qf(b,this.end-this.start):eb.a(this.Na,this.start+b)};k.Ea=function(a,b,c){return 0>b||this.end<=this.start+b?c:eb.c(this.Na,this.start+b,c)};
k.kb=function(a,b,c){var d=this.start+b;a=this.v;c=md.c(this.Na,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return Ff.A?Ff.A(a,c,b,d,null):Ff.call(null,a,c,b,d,null)};k.P=function(){return this.v};k.Y=function(){return this.end-this.start};k.jb=function(){return eb.a(this.Na,this.end-1)};k.bc=function(){return this.start!==this.end?new $c(this,this.end-this.start-1,null):null};k.U=function(){var a=this.u;return null!=a?a:this.u=a=Hc(this)};k.D=function(a,b){return Oc(this,b)};
k.da=function(){return Pc(id,this.v)};k.ea=function(a,b){return Tc(this,b)};k.fa=function(a,b,c){return Uc(this,b,c)};k.Oa=function(a,b,c){if("number"===typeof b)return wb(this,b,c);throw Error("Subvec's key for assoc must be a number.");};k.V=function(){var a=this;return function(b){return function d(e){return e===a.end?null:Zc(eb.a(a.Na,e),new je(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};
k.R=function(a,b){return Ff.A?Ff.A(b,this.Na,this.start,this.end,this.u):Ff.call(null,b,this.Na,this.start,this.end,this.u)};k.X=function(a,b){var c=this.v,d=wb(this.Na,this.end,b),e=this.start,f=this.end+1;return Ff.A?Ff.A(c,d,e,f,null):Ff.call(null,c,d,e,f,null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.ca(null,c);case 3:return this.Ea(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.ca(null,c)};a.c=function(a,c,d){return this.Ea(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};k.b=function(a){return this.ca(null,a)};k.a=function(a,b){return this.Ea(null,a,b)};Gf.prototype[Ua]=function(){return Dc(this)};
function Ff(a,b,c,d,e){for(;;)if(b instanceof Gf)c=b.start+c,d=b.start+d,b=b.Na;else{var f=M(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new Gf(a,b,c,d,e)}}var Ef=function Ef(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ef.a(arguments[0],arguments[1]);case 3:return Ef.c(arguments[0],arguments[1],arguments[2]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};
Ef.a=function(a,b){return Ef.c(a,b,M(a))};Ef.c=function(a,b,c){return Ff(null,a,b,c,null)};Ef.w=3;function Hf(a,b){return a===b.W?b:new lf(a,Wa(b.f))}function vf(a){return new lf({},Wa(a.f))}function wf(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];Ad(a,0,b,0,a.length);return b}
var If=function If(b,c,d,e){d=Hf(b.root.W,d);var f=b.m-1>>>c&31;if(5===c)b=e;else{var g=d.f[f];b=null!=g?If(b,c-5,g,e):of(b.root.W,c-5,e)}d.f[f]=b;return d};function yf(a,b,c,d){this.m=a;this.shift=b;this.root=c;this.S=d;this.C=88;this.g=275}k=yf.prototype;
k.Rb=function(a,b){if(this.root.W){if(32>this.m-nf(this))this.S[this.m&31]=b;else{var c=new lf(this.root.W,this.S),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.S=d;if(this.m>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=of(this.root.W,this.shift,c);this.root=new lf(this.root.W,d);this.shift=e}else this.root=If(this,this.shift,this.root,c)}this.m+=1;return this}throw Error("conj! after persistent!");};k.Sb=function(){if(this.root.W){this.root.W=null;var a=this.m-nf(this),b=Array(a);Ad(this.S,0,b,0,a);return new O(null,this.m,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
k.Qb=function(a,b,c){if("number"===typeof b)return Ub(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
k.zc=function(a,b,c){var d=this;if(d.root.W){if(0<=b&&b<d.m)return nf(this)<=b?d.S[b&31]=c:(a=function(){return function f(a,h){var l=Hf(d.root.W,h);if(0===a)l.f[b&31]=c;else{var m=b>>>a&31,n=f(a-5,l.f[m]);l.f[m]=n}return l}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.m)return Rb(this,c);throw Error([z("Index "),z(b),z(" out of bounds for TransientVector of length"),z(d.m)].join(""));}throw Error("assoc! after persistent!");};
k.Y=function(){if(this.root.W)return this.m;throw Error("count after persistent!");};k.ca=function(a,b){if(this.root.W)return sf(this,b)[b&31];throw Error("nth after persistent!");};k.Ea=function(a,b,c){return 0<=b&&b<this.m?eb.a(this,b):c};k.N=function(a,b){return kb.c(this,b,null)};k.I=function(a,b,c){return"number"===typeof b?eb.c(this,b,c):c};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};function Jf(){this.g=2097152;this.C=0}
Jf.prototype.equiv=function(a){return this.D(null,a)};Jf.prototype.D=function(){return!1};var Kf=new Jf;function Lf(a,b){return Dd(ud(b)?M(a)===M(b)?Fe(Ld,R.a(function(a){return pc.a(E.c(b,J(a),Kf),fd(a))},a)):null:null)}function Mf(a,b,c,d,e){this.s=a;this.qd=b;this.uc=c;this.fd=d;this.Kc=e}Mf.prototype.ya=function(){var a=this.s<this.uc;return a?a:this.Kc.ya()};Mf.prototype.next=function(){if(this.s<this.uc){var a=kd(this.fd,this.s);this.s+=1;return new O(null,2,5,Q,[a,kb.a(this.qd,a)],null)}return this.Kc.next()};
Mf.prototype.remove=function(){return Error("Unsupported operation")};function Nf(a){this.J=a}Nf.prototype.next=function(){if(null!=this.J){var a=J(this.J),b=N(a,0),a=N(a,1);this.J=K(this.J);return{value:[b,a],done:!1}}return{value:null,done:!0}};function Of(a){return new Nf(I(a))}function Pf(a){this.J=a}Pf.prototype.next=function(){if(null!=this.J){var a=J(this.J);this.J=K(this.J);return{value:[a,a],done:!1}}return{value:null,done:!0}};
function Qf(a,b){var c;if(b instanceof x)a:{c=a.length;for(var d=b.Ha,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof x&&d===a[e].Ha){c=e;break a}e+=2}}else if("string"==typeof b||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof oc)a:for(c=a.length,d=b.$a,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof oc&&d===a[e].$a){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=
a.length,d=0;;){if(c<=d){c=-1;break a}if(pc.a(b,a[d])){c=d;break a}d+=2}return c}Rf;function Sf(a,b,c){this.f=a;this.s=b;this.Da=c;this.g=32374990;this.C=0}k=Sf.prototype;k.toString=function(){return hc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.Da};k.wa=function(){return this.s<this.f.length-2?new Sf(this.f,this.s+2,this.Da):null};k.Y=function(){return(this.f.length-this.s)/2};k.U=function(){return Hc(this)};k.D=function(a,b){return Oc(this,b)};
k.da=function(){return Pc(Bc,this.Da)};k.ea=function(a,b){return ed.a(b,this)};k.fa=function(a,b,c){return ed.c(b,c,this)};k.ta=function(){return new O(null,2,5,Q,[this.f[this.s],this.f[this.s+1]],null)};k.xa=function(){return this.s<this.f.length-2?new Sf(this.f,this.s+2,this.Da):Bc};k.V=function(){return this};k.R=function(a,b){return new Sf(this.f,this.s,b)};k.X=function(a,b){return Zc(b,this)};Sf.prototype[Ua]=function(){return Dc(this)};Tf;Uf;function Vf(a,b,c){this.f=a;this.s=b;this.m=c}
Vf.prototype.ya=function(){return this.s<this.m};Vf.prototype.next=function(){var a=new O(null,2,5,Q,[this.f[this.s],this.f[this.s+1]],null);this.s+=2;return a};function u(a,b,c,d){this.v=a;this.m=b;this.f=c;this.u=d;this.g=16647951;this.C=8196}k=u.prototype;k.toString=function(){return hc(this)};k.equiv=function(a){return this.D(null,a)};k.keys=function(){return Dc(Tf.b?Tf.b(this):Tf.call(null,this))};k.entries=function(){return Of(I(this))};
k.values=function(){return Dc(Uf.b?Uf.b(this):Uf.call(null,this))};k.has=function(a){return Fd(this,a)};k.get=function(a,b){return this.I(null,a,b)};k.forEach=function(a){for(var b=I(this),c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e),g=N(f,0),f=N(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=I(b))yd(b)?(c=Zb(b),b=$b(b),g=c,d=M(c),c=g):(c=J(b),g=N(c,0),f=N(c,1),a.a?a.a(f,g):a.call(null,f,g),b=K(b),c=null,d=0),e=0;else return null};k.N=function(a,b){return kb.c(this,b,null)};
k.I=function(a,b,c){a=Qf(this.f,b);return-1===a?c:this.f[a+1]};k.Lb=function(a,b,c){a=this.f.length;for(var d=0;;)if(d<a){var e=this.f[d],f=this.f[d+1];c=b.c?b.c(c,e,f):b.call(null,c,e,f);if(Sc(c))return L.b?L.b(c):L.call(null,c);d+=2}else return c};k.Ga=function(){return new Vf(this.f,0,2*this.m)};k.P=function(){return this.v};k.Y=function(){return this.m};k.U=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};
k.D=function(a,b){if(null!=b&&(b.g&1024||b.Uc)){var c=this.f.length;if(this.m===b.Y(null))for(var d=0;;)if(d<c){var e=b.I(null,this.f[d],Bd);if(e!==Bd)if(pc.a(this.f[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return Lf(this,b)};k.vb=function(){return new Rf({},this.f.length,Wa(this.f))};k.da=function(){return Ab(De,this.v)};k.ea=function(a,b){return ed.a(b,this)};k.fa=function(a,b,c){return ed.c(b,c,this)};
k.ib=function(a,b){if(0<=Qf(this.f,b)){var c=this.f.length,d=c-2;if(0===d)return ab(this);for(var d=Array(d),e=0,f=0;;){if(e>=c)return new u(this.v,this.m-1,d,null);pc.a(b,this.f[e])||(d[f]=this.f[e],d[f+1]=this.f[e+1],f+=2);e+=2}}else return this};
k.Oa=function(a,b,c){a=Qf(this.f,b);if(-1===a){if(this.m<Wf){a=this.f;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new u(this.v,this.m+1,e,null)}return Ab(nb(df.a(nd,this),b,c),this.v)}if(c===this.f[a+1])return this;b=Wa(this.f);b[a+1]=c;return new u(this.v,this.m,b,null)};k.lc=function(a,b){return-1!==Qf(this.f,b)};k.V=function(){var a=this.f;return 0<=a.length-2?new Sf(a,0,null):null};k.R=function(a,b){return new u(b,this.m,this.f,this.u)};
k.X=function(a,b){if(vd(b))return nb(this,eb.a(b,0),eb.a(b,1));for(var c=this,d=I(b);;){if(null==d)return c;var e=J(d);if(vd(e))c=nb(c,eb.a(e,0),eb.a(e,1)),d=K(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};var De=new u(null,0,[],Lc),Wf=8;u.prototype[Ua]=function(){return Dc(this)};
Xf;function Rf(a,b,c){this.Bb=a;this.qb=b;this.f=c;this.g=258;this.C=56}k=Rf.prototype;k.Y=function(){if(v(this.Bb))return Vd(this.qb);throw Error("count after persistent!");};k.N=function(a,b){return kb.c(this,b,null)};k.I=function(a,b,c){if(v(this.Bb))return a=Qf(this.f,b),-1===a?c:this.f[a+1];throw Error("lookup after persistent!");};
k.Rb=function(a,b){if(v(this.Bb)){if(null!=b?b.g&2048||b.Vc||(b.g?0:Pa(qb,b)):Pa(qb,b))return Tb(this,Zd.b?Zd.b(b):Zd.call(null,b),$d.b?$d.b(b):$d.call(null,b));for(var c=I(b),d=this;;){var e=J(c);if(v(e))c=K(c),d=Tb(d,Zd.b?Zd.b(e):Zd.call(null,e),$d.b?$d.b(e):$d.call(null,e));else return d}}else throw Error("conj! after persistent!");};k.Sb=function(){if(v(this.Bb))return this.Bb=!1,new u(null,Vd(this.qb),this.f,null);throw Error("persistent! called twice");};
k.Qb=function(a,b,c){if(v(this.Bb)){a=Qf(this.f,b);if(-1===a)return this.qb+2<=2*Wf?(this.qb+=2,this.f.push(b),this.f.push(c),this):we(Xf.a?Xf.a(this.qb,this.f):Xf.call(null,this.qb,this.f),b,c);c!==this.f[a+1]&&(this.f[a+1]=c);return this}throw Error("assoc! after persistent!");};Yf;ld;function Xf(a,b){for(var c=Qb(nd),d=0;;)if(d<a)c=Tb(c,b[d],b[d+1]),d+=2;else return c}function Zf(){this.H=!1}$f;ag;Qe;bg;U;L;function cg(a,b){return a===b?!0:T(a,b)?!0:pc.a(a,b)}
function dg(a,b,c){a=Wa(a);a[b]=c;return a}function eg(a,b){var c=Array(a.length-2);Ad(a,0,c,0,2*b);Ad(a,2*(b+1),c,2*b,c.length-2*b);return c}function fg(a,b,c,d){a=a.mb(b);a.f[c]=d;return a}function gg(a,b,c){for(var d=a.length,e=0,f=c;;)if(e<d){c=a[e];if(null!=c){var g=a[e+1];c=b.c?b.c(f,c,g):b.call(null,f,c,g)}else c=a[e+1],c=null!=c?c.pb(b,f):f;if(Sc(c))return L.b?L.b(c):L.call(null,c);e+=2;f=c}else return f}hg;function ig(a,b,c,d){this.f=a;this.s=b;this.Zb=c;this.Ra=d}
ig.prototype.advance=function(){for(var a=this.f.length;;)if(this.s<a){var b=this.f[this.s],c=this.f[this.s+1];null!=b?b=this.Zb=new O(null,2,5,Q,[b,c],null):null!=c?(b=fc(c),b=b.ya()?this.Ra=b:!1):b=!1;this.s+=2;if(b)return!0}else return!1};ig.prototype.ya=function(){var a=null!=this.Zb;return a?a:(a=null!=this.Ra)?a:this.advance()};
ig.prototype.next=function(){if(null!=this.Zb){var a=this.Zb;this.Zb=null;return a}if(null!=this.Ra)return a=this.Ra.next(),this.Ra.ya()||(this.Ra=null),a;if(this.advance())return this.next();throw Error("No such element");};ig.prototype.remove=function(){return Error("Unsupported operation")};function jg(a,b,c){this.W=a;this.Z=b;this.f=c}k=jg.prototype;k.mb=function(a){if(a===this.W)return this;var b=Wd(this.Z),c=Array(0>b?4:2*(b+1));Ad(this.f,0,c,0,2*b);return new jg(a,this.Z,c)};
k.Wb=function(){return $f.b?$f.b(this.f):$f.call(null,this.f)};k.pb=function(a,b){return gg(this.f,a,b)};k.fb=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.Z&e))return d;var f=Wd(this.Z&e-1),e=this.f[2*f],f=this.f[2*f+1];return null==e?f.fb(a+5,b,c,d):cg(c,e)?f:d};
k.Qa=function(a,b,c,d,e,f){var g=1<<(c>>>b&31),h=Wd(this.Z&g-1);if(0===(this.Z&g)){var l=Wd(this.Z);if(2*l<this.f.length){a=this.mb(a);b=a.f;f.H=!0;a:for(c=2*(l-h),f=2*h+(c-1),l=2*(h+1)+(c-1);;){if(0===c)break a;b[l]=b[f];--l;--c;--f}b[2*h]=d;b[2*h+1]=e;a.Z|=g;return a}if(16<=l){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[c>>>b&31]=kg.Qa(a,b+5,c,d,e,f);for(e=d=0;;)if(32>d)0!==
(this.Z>>>d&1)&&(h[d]=null!=this.f[e]?kg.Qa(a,b+5,uc(this.f[e]),this.f[e],this.f[e+1],f):this.f[e+1],e+=2),d+=1;else break;return new hg(a,l+1,h)}b=Array(2*(l+4));Ad(this.f,0,b,0,2*h);b[2*h]=d;b[2*h+1]=e;Ad(this.f,2*h,b,2*(h+1),2*(l-h));f.H=!0;a=this.mb(a);a.f=b;a.Z|=g;return a}l=this.f[2*h];g=this.f[2*h+1];if(null==l)return l=g.Qa(a,b+5,c,d,e,f),l===g?this:fg(this,a,2*h+1,l);if(cg(d,l))return e===g?this:fg(this,a,2*h+1,e);f.H=!0;f=b+5;d=bg.ba?bg.ba(a,f,l,g,c,d,e):bg.call(null,a,f,l,g,c,d,e);e=2*
h;h=2*h+1;a=this.mb(a);a.f[e]=null;a.f[h]=d;return a};
k.Pa=function(a,b,c,d,e){var f=1<<(b>>>a&31),g=Wd(this.Z&f-1);if(0===(this.Z&f)){var h=Wd(this.Z);if(16<=h){g=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];g[b>>>a&31]=kg.Pa(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.Z>>>c&1)&&(g[c]=null!=this.f[d]?kg.Pa(a+5,uc(this.f[d]),this.f[d],this.f[d+1],e):this.f[d+1],d+=2),c+=1;else break;return new hg(null,h+1,g)}a=Array(2*(h+1));Ad(this.f,
0,a,0,2*g);a[2*g]=c;a[2*g+1]=d;Ad(this.f,2*g,a,2*(g+1),2*(h-g));e.H=!0;return new jg(null,this.Z|f,a)}var l=this.f[2*g],f=this.f[2*g+1];if(null==l)return h=f.Pa(a+5,b,c,d,e),h===f?this:new jg(null,this.Z,dg(this.f,2*g+1,h));if(cg(c,l))return d===f?this:new jg(null,this.Z,dg(this.f,2*g+1,d));e.H=!0;e=this.Z;h=this.f;a+=5;a=bg.aa?bg.aa(a,l,f,b,c,d):bg.call(null,a,l,f,b,c,d);c=2*g;g=2*g+1;d=Wa(h);d[c]=null;d[g]=a;return new jg(null,e,d)};
k.Xb=function(a,b,c){var d=1<<(b>>>a&31);if(0===(this.Z&d))return this;var e=Wd(this.Z&d-1),f=this.f[2*e],g=this.f[2*e+1];return null==f?(a=g.Xb(a+5,b,c),a===g?this:null!=a?new jg(null,this.Z,dg(this.f,2*e+1,a)):this.Z===d?null:new jg(null,this.Z^d,eg(this.f,e))):cg(c,f)?new jg(null,this.Z^d,eg(this.f,e)):this};k.Ga=function(){return new ig(this.f,0,null,null)};var kg=new jg(null,0,[]);function lg(a,b,c){this.f=a;this.s=b;this.Ra=c}
lg.prototype.ya=function(){for(var a=this.f.length;;){if(null!=this.Ra&&this.Ra.ya())return!0;if(this.s<a){var b=this.f[this.s];this.s+=1;null!=b&&(this.Ra=fc(b))}else return!1}};lg.prototype.next=function(){if(this.ya())return this.Ra.next();throw Error("No such element");};lg.prototype.remove=function(){return Error("Unsupported operation")};function hg(a,b,c){this.W=a;this.m=b;this.f=c}k=hg.prototype;k.mb=function(a){return a===this.W?this:new hg(a,this.m,Wa(this.f))};
k.Wb=function(){return ag.b?ag.b(this.f):ag.call(null,this.f)};k.pb=function(a,b){for(var c=this.f.length,d=0,e=b;;)if(d<c){var f=this.f[d];if(null!=f&&(e=f.pb(a,e),Sc(e)))return L.b?L.b(e):L.call(null,e);d+=1}else return e};k.fb=function(a,b,c,d){var e=this.f[b>>>a&31];return null!=e?e.fb(a+5,b,c,d):d};k.Qa=function(a,b,c,d,e,f){var g=c>>>b&31,h=this.f[g];if(null==h)return a=fg(this,a,g,kg.Qa(a,b+5,c,d,e,f)),a.m+=1,a;b=h.Qa(a,b+5,c,d,e,f);return b===h?this:fg(this,a,g,b)};
k.Pa=function(a,b,c,d,e){var f=b>>>a&31,g=this.f[f];if(null==g)return new hg(null,this.m+1,dg(this.f,f,kg.Pa(a+5,b,c,d,e)));a=g.Pa(a+5,b,c,d,e);return a===g?this:new hg(null,this.m,dg(this.f,f,a))};
k.Xb=function(a,b,c){var d=b>>>a&31,e=this.f[d];if(null!=e){a=e.Xb(a+5,b,c);if(a===e)d=this;else if(null==a)if(8>=this.m)a:{e=this.f;a=e.length;b=Array(2*(this.m-1));c=0;for(var f=1,g=0;;)if(c<a)c!==d&&null!=e[c]&&(b[f]=e[c],f+=2,g|=1<<c),c+=1;else{d=new jg(null,g,b);break a}}else d=new hg(null,this.m-1,dg(this.f,d,a));else d=new hg(null,this.m,dg(this.f,d,a));return d}return this};k.Ga=function(){return new lg(this.f,0,null)};
function mg(a,b,c){b*=2;for(var d=0;;)if(d<b){if(cg(c,a[d]))return d;d+=2}else return-1}function ng(a,b,c,d){this.W=a;this.bb=b;this.m=c;this.f=d}k=ng.prototype;k.mb=function(a){if(a===this.W)return this;var b=Array(2*(this.m+1));Ad(this.f,0,b,0,2*this.m);return new ng(a,this.bb,this.m,b)};k.Wb=function(){return $f.b?$f.b(this.f):$f.call(null,this.f)};k.pb=function(a,b){return gg(this.f,a,b)};k.fb=function(a,b,c,d){a=mg(this.f,this.m,c);return 0>a?d:cg(c,this.f[a])?this.f[a+1]:d};
k.Qa=function(a,b,c,d,e,f){if(c===this.bb){b=mg(this.f,this.m,d);if(-1===b){if(this.f.length>2*this.m)return b=2*this.m,c=2*this.m+1,a=this.mb(a),a.f[b]=d,a.f[c]=e,f.H=!0,a.m+=1,a;c=this.f.length;b=Array(c+2);Ad(this.f,0,b,0,c);b[c]=d;b[c+1]=e;f.H=!0;d=this.m+1;a===this.W?(this.f=b,this.m=d,a=this):a=new ng(this.W,this.bb,d,b);return a}return this.f[b+1]===e?this:fg(this,a,b+1,e)}return(new jg(a,1<<(this.bb>>>b&31),[null,this,null,null])).Qa(a,b,c,d,e,f)};
k.Pa=function(a,b,c,d,e){return b===this.bb?(a=mg(this.f,this.m,c),-1===a?(a=2*this.m,b=Array(a+2),Ad(this.f,0,b,0,a),b[a]=c,b[a+1]=d,e.H=!0,new ng(null,this.bb,this.m+1,b)):pc.a(this.f[a],d)?this:new ng(null,this.bb,this.m,dg(this.f,a+1,d))):(new jg(null,1<<(this.bb>>>a&31),[null,this])).Pa(a,b,c,d,e)};k.Xb=function(a,b,c){a=mg(this.f,this.m,c);return-1===a?this:1===this.m?null:new ng(null,this.bb,this.m-1,eg(this.f,Vd(a)))};k.Ga=function(){return new ig(this.f,0,null,null)};
var bg=function bg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return bg.aa(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return bg.ba(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};
bg.aa=function(a,b,c,d,e,f){var g=uc(b);if(g===d)return new ng(null,g,2,[b,c,e,f]);var h=new Zf;return kg.Pa(a,g,b,c,h).Pa(a,d,e,f,h)};bg.ba=function(a,b,c,d,e,f,g){var h=uc(c);if(h===e)return new ng(null,h,2,[c,d,f,g]);var l=new Zf;return kg.Qa(a,b,h,c,d,l).Qa(a,b,e,f,g,l)};bg.w=7;function og(a,b,c,d,e){this.v=a;this.gb=b;this.s=c;this.J=d;this.u=e;this.g=32374860;this.C=0}k=og.prototype;k.toString=function(){return hc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};
k.U=function(){var a=this.u;return null!=a?a:this.u=a=Hc(this)};k.D=function(a,b){return Oc(this,b)};k.da=function(){return Pc(Bc,this.v)};k.ea=function(a,b){return ed.a(b,this)};k.fa=function(a,b,c){return ed.c(b,c,this)};k.ta=function(){return null==this.J?new O(null,2,5,Q,[this.gb[this.s],this.gb[this.s+1]],null):J(this.J)};
k.xa=function(){if(null==this.J){var a=this.gb,b=this.s+2;return $f.c?$f.c(a,b,null):$f.call(null,a,b,null)}var a=this.gb,b=this.s,c=K(this.J);return $f.c?$f.c(a,b,c):$f.call(null,a,b,c)};k.V=function(){return this};k.R=function(a,b){return new og(b,this.gb,this.s,this.J,this.u)};k.X=function(a,b){return Zc(b,this)};og.prototype[Ua]=function(){return Dc(this)};
var $f=function $f(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return $f.b(arguments[0]);case 3:return $f.c(arguments[0],arguments[1],arguments[2]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};$f.b=function(a){return $f.c(a,0,null)};
$f.c=function(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new og(null,a,b,null,null);var d=a[b+1];if(v(d)&&(d=d.Wb(),v(d)))return new og(null,a,b+2,d,null);b+=2}else return null;else return new og(null,a,b,c,null)};$f.w=3;function pg(a,b,c,d,e){this.v=a;this.gb=b;this.s=c;this.J=d;this.u=e;this.g=32374860;this.C=0}k=pg.prototype;k.toString=function(){return hc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};
k.U=function(){var a=this.u;return null!=a?a:this.u=a=Hc(this)};k.D=function(a,b){return Oc(this,b)};k.da=function(){return Pc(Bc,this.v)};k.ea=function(a,b){return ed.a(b,this)};k.fa=function(a,b,c){return ed.c(b,c,this)};k.ta=function(){return J(this.J)};k.xa=function(){var a=this.gb,b=this.s,c=K(this.J);return ag.o?ag.o(null,a,b,c):ag.call(null,null,a,b,c)};k.V=function(){return this};k.R=function(a,b){return new pg(b,this.gb,this.s,this.J,this.u)};k.X=function(a,b){return Zc(b,this)};
pg.prototype[Ua]=function(){return Dc(this)};var ag=function ag(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ag.b(arguments[0]);case 4:return ag.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};ag.b=function(a){return ag.o(null,a,0,null)};
ag.o=function(a,b,c,d){if(null==d)for(d=b.length;;)if(c<d){var e=b[c];if(v(e)&&(e=e.Wb(),v(e)))return new pg(a,b,c+1,e,null);c+=1}else return null;else return new pg(a,b,c,d,null)};ag.w=4;Yf;function qg(a,b,c){this.Aa=a;this.Mc=b;this.tc=c}qg.prototype.ya=function(){return this.tc&&this.Mc.ya()};qg.prototype.next=function(){if(this.tc)return this.Mc.next();this.tc=!0;return this.Aa};qg.prototype.remove=function(){return Error("Unsupported operation")};
function ld(a,b,c,d,e,f){this.v=a;this.m=b;this.root=c;this.za=d;this.Aa=e;this.u=f;this.g=16123663;this.C=8196}k=ld.prototype;k.toString=function(){return hc(this)};k.equiv=function(a){return this.D(null,a)};k.keys=function(){return Dc(Tf.b?Tf.b(this):Tf.call(null,this))};k.entries=function(){return Of(I(this))};k.values=function(){return Dc(Uf.b?Uf.b(this):Uf.call(null,this))};k.has=function(a){return Fd(this,a)};k.get=function(a,b){return this.I(null,a,b)};
k.forEach=function(a){for(var b=I(this),c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e),g=N(f,0),f=N(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=I(b))yd(b)?(c=Zb(b),b=$b(b),g=c,d=M(c),c=g):(c=J(b),g=N(c,0),f=N(c,1),a.a?a.a(f,g):a.call(null,f,g),b=K(b),c=null,d=0),e=0;else return null};k.N=function(a,b){return kb.c(this,b,null)};k.I=function(a,b,c){return null==b?this.za?this.Aa:c:null==this.root?c:this.root.fb(0,uc(b),b,c)};
k.Lb=function(a,b,c){a=this.za?b.c?b.c(c,null,this.Aa):b.call(null,c,null,this.Aa):c;return Sc(a)?L.b?L.b(a):L.call(null,a):null!=this.root?this.root.pb(b,a):a};k.Ga=function(){var a=this.root?fc(this.root):ze;return this.za?new qg(this.Aa,a,!1):a};k.P=function(){return this.v};k.Y=function(){return this.m};k.U=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Lf(this,b)};k.vb=function(){return new Yf({},this.root,this.m,this.za,this.Aa)};
k.da=function(){return Ab(nd,this.v)};k.ib=function(a,b){if(null==b)return this.za?new ld(this.v,this.m-1,this.root,!1,null,null):this;if(null==this.root)return this;var c=this.root.Xb(0,uc(b),b);return c===this.root?this:new ld(this.v,this.m-1,c,this.za,this.Aa,null)};
k.Oa=function(a,b,c){if(null==b)return this.za&&c===this.Aa?this:new ld(this.v,this.za?this.m:this.m+1,this.root,!0,c,null);a=new Zf;b=(null==this.root?kg:this.root).Pa(0,uc(b),b,c,a);return b===this.root?this:new ld(this.v,a.H?this.m+1:this.m,b,this.za,this.Aa,null)};k.lc=function(a,b){return null==b?this.za:null==this.root?!1:this.root.fb(0,uc(b),b,Bd)!==Bd};k.V=function(){if(0<this.m){var a=null!=this.root?this.root.Wb():null;return this.za?Zc(new O(null,2,5,Q,[null,this.Aa],null),a):a}return null};
k.R=function(a,b){return new ld(b,this.m,this.root,this.za,this.Aa,this.u)};k.X=function(a,b){if(vd(b))return nb(this,eb.a(b,0),eb.a(b,1));for(var c=this,d=I(b);;){if(null==d)return c;var e=J(d);if(vd(e))c=nb(c,eb.a(e,0),eb.a(e,1)),d=K(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};var nd=new ld(null,0,null,!1,null,Lc);ld.prototype[Ua]=function(){return Dc(this)};
function Yf(a,b,c,d,e){this.W=a;this.root=b;this.count=c;this.za=d;this.Aa=e;this.g=258;this.C=56}function rg(a,b,c){if(a.W){if(null==b)a.Aa!==c&&(a.Aa=c),a.za||(a.count+=1,a.za=!0);else{var d=new Zf;b=(null==a.root?kg:a.root).Qa(a.W,0,uc(b),b,c,d);b!==a.root&&(a.root=b);d.H&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}k=Yf.prototype;k.Y=function(){if(this.W)return this.count;throw Error("count after persistent!");};
k.N=function(a,b){return null==b?this.za?this.Aa:null:null==this.root?null:this.root.fb(0,uc(b),b)};k.I=function(a,b,c){return null==b?this.za?this.Aa:c:null==this.root?c:this.root.fb(0,uc(b),b,c)};
k.Rb=function(a,b){var c;a:if(this.W)if(null!=b?b.g&2048||b.Vc||(b.g?0:Pa(qb,b)):Pa(qb,b))c=rg(this,Zd.b?Zd.b(b):Zd.call(null,b),$d.b?$d.b(b):$d.call(null,b));else{c=I(b);for(var d=this;;){var e=J(c);if(v(e))c=K(c),d=rg(d,Zd.b?Zd.b(e):Zd.call(null,e),$d.b?$d.b(e):$d.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};k.Sb=function(){var a;if(this.W)this.W=null,a=new ld(null,this.count,this.root,this.za,this.Aa,null);else throw Error("persistent! called twice");return a};
k.Qb=function(a,b,c){return rg(this,b,c)};sg;tg;var ug=function ug(b,c,d){d=null!=b.left?ug(b.left,c,d):d;if(Sc(d))return L.b?L.b(d):L.call(null,d);var e=b.key,f=b.H;d=c.c?c.c(d,e,f):c.call(null,d,e,f);if(Sc(d))return L.b?L.b(d):L.call(null,d);b=null!=b.right?ug(b.right,c,d):d;return Sc(b)?L.b?L.b(b):L.call(null,b):b};function tg(a,b,c,d,e){this.key=a;this.H=b;this.left=c;this.right=d;this.u=e;this.g=32402207;this.C=0}k=tg.prototype;k.replace=function(a,b,c,d){return new tg(a,b,c,d,null)};
k.pb=function(a,b){return ug(this,a,b)};k.N=function(a,b){return eb.c(this,b,null)};k.I=function(a,b,c){return eb.c(this,b,c)};k.ca=function(a,b){return 0===b?this.key:1===b?this.H:null};k.Ea=function(a,b,c){return 0===b?this.key:1===b?this.H:c};k.kb=function(a,b,c){return(new O(null,2,5,Q,[this.key,this.H],null)).kb(null,b,c)};k.P=function(){return null};k.Y=function(){return 2};k.Mb=function(){return this.key};k.Nb=function(){return this.H};k.jb=function(){return this.H};
k.U=function(){var a=this.u;return null!=a?a:this.u=a=Hc(this)};k.D=function(a,b){return Oc(this,b)};k.da=function(){return id};k.ea=function(a,b){return Tc(this,b)};k.fa=function(a,b,c){return Uc(this,b,c)};k.Oa=function(a,b,c){return md.c(new O(null,2,5,Q,[this.key,this.H],null),b,c)};k.V=function(){return cb(cb(Bc,this.H),this.key)};k.R=function(a,b){return Pc(new O(null,2,5,Q,[this.key,this.H],null),b)};k.X=function(a,b){return new O(null,3,5,Q,[this.key,this.H,b],null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};tg.prototype[Ua]=function(){return Dc(this)};
function sg(a,b,c,d,e){this.key=a;this.H=b;this.left=c;this.right=d;this.u=e;this.g=32402207;this.C=0}k=sg.prototype;k.replace=function(a,b,c,d){return new sg(a,b,c,d,null)};k.pb=function(a,b){return ug(this,a,b)};k.N=function(a,b){return eb.c(this,b,null)};k.I=function(a,b,c){return eb.c(this,b,c)};k.ca=function(a,b){return 0===b?this.key:1===b?this.H:null};k.Ea=function(a,b,c){return 0===b?this.key:1===b?this.H:c};k.kb=function(a,b,c){return(new O(null,2,5,Q,[this.key,this.H],null)).kb(null,b,c)};
k.P=function(){return null};k.Y=function(){return 2};k.Mb=function(){return this.key};k.Nb=function(){return this.H};k.jb=function(){return this.H};k.U=function(){var a=this.u;return null!=a?a:this.u=a=Hc(this)};k.D=function(a,b){return Oc(this,b)};k.da=function(){return id};k.ea=function(a,b){return Tc(this,b)};k.fa=function(a,b,c){return Uc(this,b,c)};k.Oa=function(a,b,c){return md.c(new O(null,2,5,Q,[this.key,this.H],null),b,c)};k.V=function(){return cb(cb(Bc,this.H),this.key)};
k.R=function(a,b){return Pc(new O(null,2,5,Q,[this.key,this.H],null),b)};k.X=function(a,b){return new O(null,3,5,Q,[this.key,this.H,b],null)};k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};
k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};sg.prototype[Ua]=function(){return Dc(this)};Zd;var Mc=function Mc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Mc.j(0<c.length?new zc(c.slice(0),0):null)};Mc.j=function(a){a=I(a);for(var b=Qb(nd);;)if(a){var c=K(K(a)),b=we(b,J(a),fd(a));a=c}else return Sb(b)};Mc.w=0;Mc.B=function(a){return Mc.j(I(a))};function vg(a,b){this.K=a;this.Da=b;this.g=32374988;this.C=0}k=vg.prototype;
k.toString=function(){return hc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.Da};k.wa=function(){var a=(null!=this.K?this.K.g&128||this.K.ac||(this.K.g?0:Pa(ib,this.K)):Pa(ib,this.K))?this.K.wa(null):K(this.K);return null==a?null:new vg(a,this.Da)};k.U=function(){return Hc(this)};k.D=function(a,b){return Oc(this,b)};k.da=function(){return Pc(Bc,this.Da)};k.ea=function(a,b){return ed.a(b,this)};k.fa=function(a,b,c){return ed.c(b,c,this)};k.ta=function(){return this.K.ta(null).Mb(null)};
k.xa=function(){var a=(null!=this.K?this.K.g&128||this.K.ac||(this.K.g?0:Pa(ib,this.K)):Pa(ib,this.K))?this.K.wa(null):K(this.K);return null!=a?new vg(a,this.Da):Bc};k.V=function(){return this};k.R=function(a,b){return new vg(this.K,b)};k.X=function(a,b){return Zc(b,this)};vg.prototype[Ua]=function(){return Dc(this)};function Tf(a){return(a=I(a))?new vg(a,null):null}function Zd(a){return rb(a)}function wg(a,b){this.K=a;this.Da=b;this.g=32374988;this.C=0}k=wg.prototype;k.toString=function(){return hc(this)};
k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.Da};k.wa=function(){var a=(null!=this.K?this.K.g&128||this.K.ac||(this.K.g?0:Pa(ib,this.K)):Pa(ib,this.K))?this.K.wa(null):K(this.K);return null==a?null:new wg(a,this.Da)};k.U=function(){return Hc(this)};k.D=function(a,b){return Oc(this,b)};k.da=function(){return Pc(Bc,this.Da)};k.ea=function(a,b){return ed.a(b,this)};k.fa=function(a,b,c){return ed.c(b,c,this)};k.ta=function(){return this.K.ta(null).Nb(null)};
k.xa=function(){var a=(null!=this.K?this.K.g&128||this.K.ac||(this.K.g?0:Pa(ib,this.K)):Pa(ib,this.K))?this.K.wa(null):K(this.K);return null!=a?new wg(a,this.Da):Bc};k.V=function(){return this};k.R=function(a,b){return new wg(this.K,b)};k.X=function(a,b){return Zc(b,this)};wg.prototype[Ua]=function(){return Dc(this)};function Uf(a){return(a=I(a))?new wg(a,null):null}function $d(a){return sb(a)}
var xg=function xg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return xg.j(0<c.length?new zc(c.slice(0),0):null)};xg.j=function(a){return v(Ge(Ld,a))?Xa.a(function(a,c){return hd.a(v(a)?a:De,c)},a):null};xg.w=0;xg.B=function(a){return xg.j(I(a))};yg;function zg(a){this.Db=a}zg.prototype.ya=function(){return this.Db.ya()};zg.prototype.next=function(){if(this.Db.ya())return this.Db.next().S[0];throw Error("No such element");};zg.prototype.remove=function(){return Error("Unsupported operation")};
function Ag(a,b,c){this.v=a;this.nb=b;this.u=c;this.g=15077647;this.C=8196}k=Ag.prototype;k.toString=function(){return hc(this)};k.equiv=function(a){return this.D(null,a)};k.keys=function(){return Dc(I(this))};k.entries=function(){var a=I(this);return new Pf(I(a))};k.values=function(){return Dc(I(this))};k.has=function(a){return Fd(this,a)};
k.forEach=function(a){for(var b=I(this),c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e),g=N(f,0),f=N(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=I(b))yd(b)?(c=Zb(b),b=$b(b),g=c,d=M(c),c=g):(c=J(b),g=N(c,0),f=N(c,1),a.a?a.a(f,g):a.call(null,f,g),b=K(b),c=null,d=0),e=0;else return null};k.N=function(a,b){return kb.c(this,b,null)};k.I=function(a,b,c){return mb(this.nb,b)?b:c};k.Ga=function(){return new zg(fc(this.nb))};k.P=function(){return this.v};k.Y=function(){return $a(this.nb)};
k.U=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return sd(b)&&M(this)===M(b)&&Fe(function(a){return function(b){return Fd(a,b)}}(this),b)};k.vb=function(){return new yg(Qb(this.nb))};k.da=function(){return Pc(Bg,this.v)};k.V=function(){return Tf(this.nb)};k.R=function(a,b){return new Ag(b,this.nb,this.u)};k.X=function(a,b){return new Ag(this.v,md.c(this.nb,b,null),null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};var Bg=new Ag(null,De,Lc);Ag.prototype[Ua]=function(){return Dc(this)};
function yg(a){this.cb=a;this.C=136;this.g=259}k=yg.prototype;k.Rb=function(a,b){this.cb=Tb(this.cb,b,null);return this};k.Sb=function(){return new Ag(null,Sb(this.cb),null)};k.Y=function(){return M(this.cb)};k.N=function(a,b){return kb.c(this,b,null)};k.I=function(a,b,c){return kb.c(this.cb,b,Bd)===Bd?c:b};
k.call=function(){function a(a,b,c){return kb.c(this.cb,b,Bd)===Bd?c:b}function b(a,b){return kb.c(this.cb,b,Bd)===Bd?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};k.b=function(a){return kb.c(this.cb,a,Bd)===Bd?null:a};k.a=function(a,b){return kb.c(this.cb,a,Bd)===Bd?b:a};
function Cg(a,b){if(vd(b)){var c=M(b);return Xa.c(function(){return function(b,c){var f=Gd(a,kd(b,c));return v(f)?md.c(b,c,fd(f)):b}}(c),b,Te(c,Xe(Qc,0)))}return R.a(function(b){var c=Gd(a,b);return v(c)?fd(c):b},b)}function Dg(a){for(var b=id;;)if(K(a))b=hd.a(b,J(a)),a=K(a);else return I(b)}function Yd(a){if(null!=a&&(a.C&4096||a.Xc))return a.Ob(null);if("string"===typeof a)return a;throw Error([z("Doesn't support name: "),z(a)].join(""));}
function Eg(a,b){for(var c=Qb(De),d=I(a),e=I(b);;)if(d&&e)c=we(c,J(d),J(e)),d=K(d),e=K(e);else return Sb(c)}var Fg=function Fg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Fg.a(arguments[0],arguments[1]);case 3:return Fg.c(arguments[0],arguments[1],arguments[2]);default:return Fg.j(arguments[0],arguments[1],arguments[2],new zc(c.slice(3),0))}};Fg.a=function(a,b){return b};
Fg.c=function(a,b,c){return(a.b?a.b(b):a.call(null,b))<(a.b?a.b(c):a.call(null,c))?b:c};Fg.j=function(a,b,c,d){return Xa.c(function(b,c){return Fg.c(a,b,c)},Fg.c(a,b,c),d)};Fg.B=function(a){var b=J(a),c=K(a);a=J(c);var d=K(c),c=J(d),d=K(d);return Fg.j(b,a,c,d)};Fg.w=3;function Gg(a,b){return new je(null,function(){var c=I(b);if(c){var d;d=J(c);d=a.b?a.b(d):a.call(null,d);c=v(d)?Zc(J(c),Gg(a,Ac(c))):null}else c=null;return c},null,null)}function Hg(a,b,c){this.s=a;this.end=b;this.step=c}
Hg.prototype.ya=function(){return 0<this.step?this.s<this.end:this.s>this.end};Hg.prototype.next=function(){var a=this.s;this.s+=this.step;return a};function Ig(a,b,c,d,e){this.v=a;this.start=b;this.end=c;this.step=d;this.u=e;this.g=32375006;this.C=8192}k=Ig.prototype;k.toString=function(){return hc(this)};k.equiv=function(a){return this.D(null,a)};
k.ca=function(a,b){if(b<$a(this))return this.start+b*this.step;if(this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};k.Ea=function(a,b,c){return b<$a(this)?this.start+b*this.step:this.start>this.end&&0===this.step?this.start:c};k.Ga=function(){return new Hg(this.start,this.end,this.step)};k.P=function(){return this.v};
k.wa=function(){return 0<this.step?this.start+this.step<this.end?new Ig(this.v,this.start+this.step,this.end,this.step,null):null:this.start+this.step>this.end?new Ig(this.v,this.start+this.step,this.end,this.step,null):null};k.Y=function(){return Oa(Ib(this))?0:Math.ceil((this.end-this.start)/this.step)};k.U=function(){var a=this.u;return null!=a?a:this.u=a=Hc(this)};k.D=function(a,b){return Oc(this,b)};k.da=function(){return Pc(Bc,this.v)};k.ea=function(a,b){return Tc(this,b)};
k.fa=function(a,b,c){for(a=this.start;;)if(0<this.step?a<this.end:a>this.end){c=b.a?b.a(c,a):b.call(null,c,a);if(Sc(c))return L.b?L.b(c):L.call(null,c);a+=this.step}else return c};k.ta=function(){return null==Ib(this)?null:this.start};k.xa=function(){return null!=Ib(this)?new Ig(this.v,this.start+this.step,this.end,this.step,null):Bc};k.V=function(){return 0<this.step?this.start<this.end?this:null:0>this.step?this.start>this.end?this:null:this.start===this.end?null:this};
k.R=function(a,b){return new Ig(b,this.start,this.end,this.step,this.u)};k.X=function(a,b){return Zc(b,this)};Ig.prototype[Ua]=function(){return Dc(this)};function Jg(a,b){return new je(null,function(){var c=I(b);if(c){var d=J(c),e=a.b?a.b(d):a.call(null,d),d=Zc(d,Gg(function(b,c){return function(b){return pc.a(c,a.b?a.b(b):a.call(null,b))}}(d,e,c,c),K(c)));return Zc(d,Jg(a,I(Ue(M(d),c))))}return null},null,null)}
function Kg(a){return new je(null,function(){var b=I(a);return b?Lg(Nd,J(b),Ac(b)):cb(Bc,Nd.l?Nd.l():Nd.call(null))},null,null)}function Lg(a,b,c){return Zc(b,new je(null,function(){var d=I(c);if(d){var e=Lg,f;f=J(d);f=a.a?a.a(b,f):a.call(null,b,f);d=e(a,f,Ac(d))}else d=null;return d},null,null))}
function Mg(a,b){return function(){function c(c,d,e){return new O(null,2,5,Q,[a.c?a.c(c,d,e):a.call(null,c,d,e),b.c?b.c(c,d,e):b.call(null,c,d,e)],null)}function d(c,d){return new O(null,2,5,Q,[a.a?a.a(c,d):a.call(null,c,d),b.a?b.a(c,d):b.call(null,c,d)],null)}function e(c){return new O(null,2,5,Q,[a.b?a.b(c):a.call(null,c),b.b?b.b(c):b.call(null,c)],null)}function f(){return new O(null,2,5,Q,[a.l?a.l():a.call(null),b.l?b.l():b.call(null)],null)}var g=null,h=function(){function c(a,b,e,f){var g=null;
if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;g=new zc(h,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){return new O(null,2,5,Q,[D.A(a,c,e,f,g),D.A(b,c,e,f,g)],null)}c.w=3;c.B=function(a){var b=J(a);a=K(a);var c=J(a);a=K(a);var e=J(a);a=Ac(a);return d(b,c,e,a)};c.j=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);
default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+3],++q;q=new zc(r,0)}return h.j(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.B=h.B;g.l=f;g.b=e;g.a=d;g.c=c;g.j=h.j;return g}()}
function zf(a,b,c,d,e,f,g){var h=Aa;Aa=null==Aa?null:Aa-1;try{if(null!=Aa&&0>Aa)return Nb(a,"#");Nb(a,c);if(0===Ia.b(f))I(g)&&Nb(a,function(){var a=Ng.b(f);return v(a)?a:"..."}());else{if(I(g)){var l=J(g);b.c?b.c(l,a,f):b.call(null,l,a,f)}for(var m=K(g),n=Ia.b(f)-1;;)if(!m||null!=n&&0===n){I(m)&&0===n&&(Nb(a,d),Nb(a,function(){var a=Ng.b(f);return v(a)?a:"..."}()));break}else{Nb(a,d);var p=J(m);c=a;g=f;b.c?b.c(p,c,g):b.call(null,p,c,g);var q=K(m);c=n-1;m=q;n=c}}return Nb(a,e)}finally{Aa=h}}
function Og(a,b){for(var c=I(b),d=null,e=0,f=0;;)if(f<e){var g=d.ca(null,f);Nb(a,g);f+=1}else if(c=I(c))d=c,yd(d)?(c=Zb(d),e=$b(d),d=c,g=M(c),c=e,e=g):(g=J(d),Nb(a,g),c=K(d),d=null,e=0),f=0;else return null}var Pg={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function Qg(a){return[z('"'),z(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return Pg[a]})),z('"')].join("")}Rg;
function Sg(a,b){var c=Dd(E.a(a,Ga));return c?(c=null!=b?b.g&131072||b.Wc?!0:!1:!1)?null!=qd(b):c:c}
function Tg(a,b,c){if(null==a)return Nb(b,"nil");if(Sg(c,a)){Nb(b,"^");var d=qd(a);Af.c?Af.c(d,b,c):Af.call(null,d,b,c);Nb(b," ")}if(a.xb)return a.Tb(a,b,c);if(null!=a&&(a.g&2147483648||a.$))return a.M(null,b,c);if(!0===a||!1===a||"number"===typeof a)return Nb(b,""+z(a));if(null!=a&&a.constructor===Object)return Nb(b,"#js "),d=R.a(function(b){return new O(null,2,5,Q,[ie.b(b),a[b]],null)},zd(a)),Rg.o?Rg.o(d,Af,b,c):Rg.call(null,d,Af,b,c);if(Na(a))return zf(b,Af,"#js ["," ","]",c,a);if("string"==typeof a)return v(Fa.b(c))?
Nb(b,Qg(a)):Nb(b,a);if(ea(a)){var e=a.name;c=v(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return Og(b,F(["#object[",c,' "',""+z(a),'"]'],0))}if(a instanceof Date)return c=function(a,b){for(var c=""+z(a);;)if(M(c)<b)c=[z("0"),z(c)].join("");else return c},Og(b,F(['#inst "',""+z(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),3),"-",'00:00"'],
0));if(a instanceof RegExp)return Og(b,F(['#"',a.source,'"'],0));if(null!=a&&(a.g&2147483648||a.$))return Ob(a,b,c);if(v(a.constructor.eb))return Og(b,F(["#object[",a.constructor.eb.replace(RegExp("/","g"),"."),"]"],0));e=a.constructor.name;c=v(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return Og(b,F(["#object[",c," ",""+z(a),"]"],0))}function Af(a,b,c){var d=Ug.b(c);return v(d)?(c=md.c(c,Vg,Tg),d.c?d.c(a,b,c):d.call(null,a,b,c)):Tg(a,b,c)}
var Pe=function Pe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Pe.j(0<c.length?new zc(c.slice(0),0):null)};Pe.j=function(a){var b=Ca();if(rd(a))b="";else{var c=z,d=new pa;a:{var e=new gc(d);Af(J(a),e,b);a=I(K(a));for(var f=null,g=0,h=0;;)if(h<g){var l=f.ca(null,h);Nb(e," ");Af(l,e,b);h+=1}else if(a=I(a))f=a,yd(f)?(a=Zb(f),g=$b(f),f=a,l=M(a),a=g,g=l):(l=J(f),Nb(e," "),Af(l,e,b),a=K(f),f=null,g=0),h=0;else break a}b=""+c(d)}return b};Pe.w=0;Pe.B=function(a){return Pe.j(I(a))};
function Rg(a,b,c,d){return zf(c,function(a,c,d){var h=rb(a);b.c?b.c(h,c,d):b.call(null,h,c,d);Nb(c," ");a=sb(a);return b.c?b.c(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,I(a))}Se.prototype.$=!0;Se.prototype.M=function(a,b,c){Nb(b,"#object [cljs.core.Volatile ");Af(new u(null,1,[Wg,this.state],null),b,c);return Nb(b,"]")};zc.prototype.$=!0;zc.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};je.prototype.$=!0;je.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};
og.prototype.$=!0;og.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};tg.prototype.$=!0;tg.prototype.M=function(a,b,c){return zf(b,Af,"["," ","]",c,this)};Sf.prototype.$=!0;Sf.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};Fc.prototype.$=!0;Fc.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};xd.prototype.$=!0;xd.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};ge.prototype.$=!0;
ge.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};$c.prototype.$=!0;$c.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};ld.prototype.$=!0;ld.prototype.M=function(a,b,c){return Rg(this,Af,b,c)};pg.prototype.$=!0;pg.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};Gf.prototype.$=!0;Gf.prototype.M=function(a,b,c){return zf(b,Af,"["," ","]",c,this)};Ag.prototype.$=!0;Ag.prototype.M=function(a,b,c){return zf(b,Af,"#{"," ","}",c,this)};wd.prototype.$=!0;
wd.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};Ne.prototype.$=!0;Ne.prototype.M=function(a,b,c){Nb(b,"#object [cljs.core.Atom ");Af(new u(null,1,[Wg,this.state],null),b,c);return Nb(b,"]")};wg.prototype.$=!0;wg.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};sg.prototype.$=!0;sg.prototype.M=function(a,b,c){return zf(b,Af,"["," ","]",c,this)};O.prototype.$=!0;O.prototype.M=function(a,b,c){return zf(b,Af,"["," ","]",c,this)};ee.prototype.$=!0;
ee.prototype.M=function(a,b){return Nb(b,"()")};Ee.prototype.$=!0;Ee.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};u.prototype.$=!0;u.prototype.M=function(a,b,c){return Rg(this,Af,b,c)};Ig.prototype.$=!0;Ig.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};vg.prototype.$=!0;vg.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};ad.prototype.$=!0;ad.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};oc.prototype.Ib=!0;
oc.prototype.ub=function(a,b){if(b instanceof oc)return wc(this,b);throw Error([z("Cannot compare "),z(this),z(" to "),z(b)].join(""));};x.prototype.Ib=!0;x.prototype.ub=function(a,b){if(b instanceof x)return he(this,b);throw Error([z("Cannot compare "),z(this),z(" to "),z(b)].join(""));};Gf.prototype.Ib=!0;Gf.prototype.ub=function(a,b){if(vd(b))return Hd(this,b);throw Error([z("Cannot compare "),z(this),z(" to "),z(b)].join(""));};O.prototype.Ib=!0;
O.prototype.ub=function(a,b){if(vd(b))return Hd(this,b);throw Error([z("Cannot compare "),z(this),z(" to "),z(b)].join(""));};var Xg=null;function Yg(a){null==Xg&&(Xg=U.b?U.b(0):U.call(null,0));return xc.b([z(a),z(Re.a(Xg,Qc))].join(""))}function Zg(a){return function(b,c){var d=a.a?a.a(b,c):a.call(null,b,c);return Sc(d)?new Rc(d):d}}
function $e(a){return function(b){return function(){function c(a,c){return Xa.c(b,a,c)}function d(b){return a.b?a.b(b):a.call(null,b)}function e(){return a.l?a.l():a.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.l=e;f.b=d;f.a=c;return f}()}(Zg(a))}$g;function ah(){}
var bh=function bh(b){if(null!=b&&null!=b.Tc)return b.Tc(b);var c=bh[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=bh._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IEncodeJS.-clj-\x3ejs",b);};ch;function dh(a){return(null!=a?a.Sc||(a.ec?0:Pa(ah,a)):Pa(ah,a))?bh(a):"string"===typeof a||"number"===typeof a||a instanceof x||a instanceof oc?ch.b?ch.b(a):ch.call(null,a):Pe.j(F([a],0))}
var ch=function ch(b){if(null==b)return null;if(null!=b?b.Sc||(b.ec?0:Pa(ah,b)):Pa(ah,b))return bh(b);if(b instanceof x)return Yd(b);if(b instanceof oc)return""+z(b);if(ud(b)){var c={};b=I(b);for(var d=null,e=0,f=0;;)if(f<e){var g=d.ca(null,f),h=N(g,0),g=N(g,1);c[dh(h)]=ch(g);f+=1}else if(b=I(b))yd(b)?(e=Zb(b),b=$b(b),d=e,e=M(e)):(e=J(b),d=N(e,0),e=N(e,1),c[dh(d)]=ch(e),b=K(b),d=null,e=0),f=0;else break;return c}if(null==b?0:null!=b?b.g&8||b.xd||(b.g?0:Pa(bb,b)):Pa(bb,b)){c=[];b=I(R.a(ch,b));d=null;
for(f=e=0;;)if(f<e)h=d.ca(null,f),c.push(h),f+=1;else if(b=I(b))d=b,yd(d)?(b=Zb(d),f=$b(d),d=b,e=M(b),b=f):(b=J(d),c.push(b),b=K(d),d=null,e=0),f=0;else break;return c}return b},$g=function $g(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return $g.l();case 1:return $g.b(arguments[0]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};$g.l=function(){return $g.b(1)};$g.b=function(a){return Math.random()*a};$g.w=1;
function eh(a,b){return ue(Xa.c(function(b,d){var e=a.b?a.b(d):a.call(null,d);return we(b,e,hd.a(E.c(b,e,id),d))},Qb(De),b))}var fh=null;function gh(){if(null==fh){var a=new u(null,3,[hh,De,ih,De,jh,De],null);fh=U.b?U.b(a):U.call(null,a)}return fh}
function kh(a,b,c){var d=pc.a(b,c);if(!d&&!(d=Fd(jh.b(a).call(null,b),c))&&(d=vd(c))&&(d=vd(b)))if(d=M(c)===M(b))for(var d=!0,e=0;;)if(d&&e!==M(c))d=kh(a,b.b?b.b(e):b.call(null,e),c.b?c.b(e):c.call(null,e)),e+=1;else return d;else return d;else return d}function lh(a){var b;b=gh();b=L.b?L.b(b):L.call(null,b);return ye(E.a(hh.b(b),a))}function mh(a,b,c,d){Re.a(a,function(){return L.b?L.b(b):L.call(null,b)});Re.a(c,function(){return L.b?L.b(d):L.call(null,d)})}
var nh=function nh(b,c,d){var e=(L.b?L.b(d):L.call(null,d)).call(null,b),e=v(v(e)?e.b?e.b(c):e.call(null,c):e)?!0:null;if(v(e))return e;e=function(){for(var e=lh(c);;)if(0<M(e))nh(b,J(e),d),e=Ac(e);else return null}();if(v(e))return e;e=function(){for(var e=lh(b);;)if(0<M(e))nh(J(e),c,d),e=Ac(e);else return null}();return v(e)?e:!1};function oh(a,b,c){c=nh(a,b,c);if(v(c))a=c;else{c=kh;var d;d=gh();d=L.b?L.b(d):L.call(null,d);a=c(d,a,b)}return a}
var ph=function ph(b,c,d,e,f,g,h){var l=Xa.c(function(e,g){var h=N(g,0);N(g,1);if(kh(L.b?L.b(d):L.call(null,d),c,h)){var l;l=(l=null==e)?l:oh(h,J(e),f);l=v(l)?g:e;if(!v(oh(J(l),h,f)))throw Error([z("Multiple methods in multimethod '"),z(b),z("' match dispatch value: "),z(c),z(" -\x3e "),z(h),z(" and "),z(J(l)),z(", and neither is preferred")].join(""));return l}return e},null,L.b?L.b(e):L.call(null,e));if(v(l)){if(pc.a(L.b?L.b(h):L.call(null,h),L.b?L.b(d):L.call(null,d)))return Re.o(g,md,c,fd(l)),
fd(l);mh(g,e,h,d);return ph(b,c,d,e,f,g,h)}return null};function qh(a,b){throw Error([z("No method in multimethod '"),z(a),z("' for dispatch value: "),z(b)].join(""));}function rh(a,b,c,d,e,f,g,h){this.name=a;this.i=b;this.ed=c;this.Vb=d;this.Eb=e;this.pd=f;this.Yb=g;this.Hb=h;this.g=4194305;this.C=4352}k=rh.prototype;
k.call=function(){function a(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C,H,B,G){a=this;var ja=D.j(a.i,b,c,d,e,F([f,g,h,l,m,n,p,q,r,t,w,y,A,C,H,B,G],0)),Nc=sh(this,ja);v(Nc)||qh(a.name,ja);return D.j(Nc,b,c,d,e,F([f,g,h,l,m,n,p,q,r,t,w,y,A,C,H,B,G],0))}function b(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C,H,B){a=this;var G=a.i.qa?a.i.qa(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C,H,B):a.i.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C,H,B),ja=sh(this,G);v(ja)||qh(a.name,G);return ja.qa?ja.qa(b,c,d,e,f,g,h,l,m,n,p,q,r,
t,w,y,A,C,H,B):ja.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C,H,B)}function c(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C,H){a=this;var B=a.i.pa?a.i.pa(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C,H):a.i.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C,H),G=sh(this,B);v(G)||qh(a.name,B);return G.pa?G.pa(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C,H):G.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C,H)}function d(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C){a=this;var H=a.i.oa?a.i.oa(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C):a.i.call(null,
b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C),B=sh(this,H);v(B)||qh(a.name,H);return B.oa?B.oa(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C):B.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C)}function e(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A){a=this;var C=a.i.na?a.i.na(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A):a.i.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A),H=sh(this,C);v(H)||qh(a.name,C);return H.na?H.na(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A):H.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A)}function f(a,b,c,d,e,f,g,h,l,m,n,p,q,r,
t,w,y){a=this;var A=a.i.ma?a.i.ma(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y):a.i.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y),C=sh(this,A);v(C)||qh(a.name,A);return C.ma?C.ma(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y):C.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y)}function g(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w){a=this;var y=a.i.la?a.i.la(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w):a.i.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w),A=sh(this,y);v(A)||qh(a.name,y);return A.la?A.la(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w):A.call(null,b,c,d,e,f,g,h,l,m,n,p,
q,r,t,w)}function h(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t){a=this;var w=a.i.ka?a.i.ka(b,c,d,e,f,g,h,l,m,n,p,q,r,t):a.i.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t),y=sh(this,w);v(y)||qh(a.name,w);return y.ka?y.ka(b,c,d,e,f,g,h,l,m,n,p,q,r,t):y.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t)}function l(a,b,c,d,e,f,g,h,l,m,n,p,q,r){a=this;var t=a.i.ja?a.i.ja(b,c,d,e,f,g,h,l,m,n,p,q,r):a.i.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r),w=sh(this,t);v(w)||qh(a.name,t);return w.ja?w.ja(b,c,d,e,f,g,h,l,m,n,p,q,r):w.call(null,b,c,d,e,f,
g,h,l,m,n,p,q,r)}function m(a,b,c,d,e,f,g,h,l,m,n,p,q){a=this;var r=a.i.ia?a.i.ia(b,c,d,e,f,g,h,l,m,n,p,q):a.i.call(null,b,c,d,e,f,g,h,l,m,n,p,q),t=sh(this,r);v(t)||qh(a.name,r);return t.ia?t.ia(b,c,d,e,f,g,h,l,m,n,p,q):t.call(null,b,c,d,e,f,g,h,l,m,n,p,q)}function n(a,b,c,d,e,f,g,h,l,m,n,p){a=this;var q=a.i.ha?a.i.ha(b,c,d,e,f,g,h,l,m,n,p):a.i.call(null,b,c,d,e,f,g,h,l,m,n,p),r=sh(this,q);v(r)||qh(a.name,q);return r.ha?r.ha(b,c,d,e,f,g,h,l,m,n,p):r.call(null,b,c,d,e,f,g,h,l,m,n,p)}function p(a,b,
c,d,e,f,g,h,l,m,n){a=this;var p=a.i.ga?a.i.ga(b,c,d,e,f,g,h,l,m,n):a.i.call(null,b,c,d,e,f,g,h,l,m,n),q=sh(this,p);v(q)||qh(a.name,p);return q.ga?q.ga(b,c,d,e,f,g,h,l,m,n):q.call(null,b,c,d,e,f,g,h,l,m,n)}function q(a,b,c,d,e,f,g,h,l,m){a=this;var n=a.i.sa?a.i.sa(b,c,d,e,f,g,h,l,m):a.i.call(null,b,c,d,e,f,g,h,l,m),p=sh(this,n);v(p)||qh(a.name,n);return p.sa?p.sa(b,c,d,e,f,g,h,l,m):p.call(null,b,c,d,e,f,g,h,l,m)}function r(a,b,c,d,e,f,g,h,l){a=this;var m=a.i.ra?a.i.ra(b,c,d,e,f,g,h,l):a.i.call(null,
b,c,d,e,f,g,h,l),n=sh(this,m);v(n)||qh(a.name,m);return n.ra?n.ra(b,c,d,e,f,g,h,l):n.call(null,b,c,d,e,f,g,h,l)}function t(a,b,c,d,e,f,g,h){a=this;var l=a.i.ba?a.i.ba(b,c,d,e,f,g,h):a.i.call(null,b,c,d,e,f,g,h),m=sh(this,l);v(m)||qh(a.name,l);return m.ba?m.ba(b,c,d,e,f,g,h):m.call(null,b,c,d,e,f,g,h)}function w(a,b,c,d,e,f,g){a=this;var h=a.i.aa?a.i.aa(b,c,d,e,f,g):a.i.call(null,b,c,d,e,f,g),l=sh(this,h);v(l)||qh(a.name,h);return l.aa?l.aa(b,c,d,e,f,g):l.call(null,b,c,d,e,f,g)}function y(a,b,c,d,
e,f){a=this;var g=a.i.A?a.i.A(b,c,d,e,f):a.i.call(null,b,c,d,e,f),h=sh(this,g);v(h)||qh(a.name,g);return h.A?h.A(b,c,d,e,f):h.call(null,b,c,d,e,f)}function C(a,b,c,d,e){a=this;var f=a.i.o?a.i.o(b,c,d,e):a.i.call(null,b,c,d,e),g=sh(this,f);v(g)||qh(a.name,f);return g.o?g.o(b,c,d,e):g.call(null,b,c,d,e)}function A(a,b,c,d){a=this;var e=a.i.c?a.i.c(b,c,d):a.i.call(null,b,c,d),f=sh(this,e);v(f)||qh(a.name,e);return f.c?f.c(b,c,d):f.call(null,b,c,d)}function G(a,b,c){a=this;var d=a.i.a?a.i.a(b,c):a.i.call(null,
b,c),e=sh(this,d);v(e)||qh(a.name,d);return e.a?e.a(b,c):e.call(null,b,c)}function H(a,b){a=this;var c=a.i.b?a.i.b(b):a.i.call(null,b),d=sh(this,c);v(d)||qh(a.name,c);return d.b?d.b(b):d.call(null,b)}function ja(a){a=this;var b=a.i.l?a.i.l():a.i.call(null),c=sh(this,b);v(c)||qh(a.name,b);return c.l?c.l():c.call(null)}var B=null,B=function(Y,B,P,W,S,Z,da,ia,ma,qa,wa,za,Va,Ea,Qa,La,Ra,Gb,Vb,Ic,Ed,xf){switch(arguments.length){case 1:return ja.call(this,Y);case 2:return H.call(this,Y,B);case 3:return G.call(this,
Y,B,P);case 4:return A.call(this,Y,B,P,W);case 5:return C.call(this,Y,B,P,W,S);case 6:return y.call(this,Y,B,P,W,S,Z);case 7:return w.call(this,Y,B,P,W,S,Z,da);case 8:return t.call(this,Y,B,P,W,S,Z,da,ia);case 9:return r.call(this,Y,B,P,W,S,Z,da,ia,ma);case 10:return q.call(this,Y,B,P,W,S,Z,da,ia,ma,qa);case 11:return p.call(this,Y,B,P,W,S,Z,da,ia,ma,qa,wa);case 12:return n.call(this,Y,B,P,W,S,Z,da,ia,ma,qa,wa,za);case 13:return m.call(this,Y,B,P,W,S,Z,da,ia,ma,qa,wa,za,Va);case 14:return l.call(this,
Y,B,P,W,S,Z,da,ia,ma,qa,wa,za,Va,Ea);case 15:return h.call(this,Y,B,P,W,S,Z,da,ia,ma,qa,wa,za,Va,Ea,Qa);case 16:return g.call(this,Y,B,P,W,S,Z,da,ia,ma,qa,wa,za,Va,Ea,Qa,La);case 17:return f.call(this,Y,B,P,W,S,Z,da,ia,ma,qa,wa,za,Va,Ea,Qa,La,Ra);case 18:return e.call(this,Y,B,P,W,S,Z,da,ia,ma,qa,wa,za,Va,Ea,Qa,La,Ra,Gb);case 19:return d.call(this,Y,B,P,W,S,Z,da,ia,ma,qa,wa,za,Va,Ea,Qa,La,Ra,Gb,Vb);case 20:return c.call(this,Y,B,P,W,S,Z,da,ia,ma,qa,wa,za,Va,Ea,Qa,La,Ra,Gb,Vb,Ic);case 21:return b.call(this,
Y,B,P,W,S,Z,da,ia,ma,qa,wa,za,Va,Ea,Qa,La,Ra,Gb,Vb,Ic,Ed);case 22:return a.call(this,Y,B,P,W,S,Z,da,ia,ma,qa,wa,za,Va,Ea,Qa,La,Ra,Gb,Vb,Ic,Ed,xf)}throw Error("Invalid arity: "+arguments.length);};B.b=ja;B.a=H;B.c=G;B.o=A;B.A=C;B.aa=y;B.ba=w;B.ra=t;B.sa=r;B.ga=q;B.ha=p;B.ia=n;B.ja=m;B.ka=l;B.la=h;B.ma=g;B.na=f;B.oa=e;B.pa=d;B.qa=c;B.Kb=b;B.wb=a;return B}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};
k.l=function(){var a=this.i.l?this.i.l():this.i.call(null),b=sh(this,a);v(b)||qh(this.name,a);return b.l?b.l():b.call(null)};k.b=function(a){var b=this.i.b?this.i.b(a):this.i.call(null,a),c=sh(this,b);v(c)||qh(this.name,b);return c.b?c.b(a):c.call(null,a)};k.a=function(a,b){var c=this.i.a?this.i.a(a,b):this.i.call(null,a,b),d=sh(this,c);v(d)||qh(this.name,c);return d.a?d.a(a,b):d.call(null,a,b)};
k.c=function(a,b,c){var d=this.i.c?this.i.c(a,b,c):this.i.call(null,a,b,c),e=sh(this,d);v(e)||qh(this.name,d);return e.c?e.c(a,b,c):e.call(null,a,b,c)};k.o=function(a,b,c,d){var e=this.i.o?this.i.o(a,b,c,d):this.i.call(null,a,b,c,d),f=sh(this,e);v(f)||qh(this.name,e);return f.o?f.o(a,b,c,d):f.call(null,a,b,c,d)};k.A=function(a,b,c,d,e){var f=this.i.A?this.i.A(a,b,c,d,e):this.i.call(null,a,b,c,d,e),g=sh(this,f);v(g)||qh(this.name,f);return g.A?g.A(a,b,c,d,e):g.call(null,a,b,c,d,e)};
k.aa=function(a,b,c,d,e,f){var g=this.i.aa?this.i.aa(a,b,c,d,e,f):this.i.call(null,a,b,c,d,e,f),h=sh(this,g);v(h)||qh(this.name,g);return h.aa?h.aa(a,b,c,d,e,f):h.call(null,a,b,c,d,e,f)};k.ba=function(a,b,c,d,e,f,g){var h=this.i.ba?this.i.ba(a,b,c,d,e,f,g):this.i.call(null,a,b,c,d,e,f,g),l=sh(this,h);v(l)||qh(this.name,h);return l.ba?l.ba(a,b,c,d,e,f,g):l.call(null,a,b,c,d,e,f,g)};
k.ra=function(a,b,c,d,e,f,g,h){var l=this.i.ra?this.i.ra(a,b,c,d,e,f,g,h):this.i.call(null,a,b,c,d,e,f,g,h),m=sh(this,l);v(m)||qh(this.name,l);return m.ra?m.ra(a,b,c,d,e,f,g,h):m.call(null,a,b,c,d,e,f,g,h)};k.sa=function(a,b,c,d,e,f,g,h,l){var m=this.i.sa?this.i.sa(a,b,c,d,e,f,g,h,l):this.i.call(null,a,b,c,d,e,f,g,h,l),n=sh(this,m);v(n)||qh(this.name,m);return n.sa?n.sa(a,b,c,d,e,f,g,h,l):n.call(null,a,b,c,d,e,f,g,h,l)};
k.ga=function(a,b,c,d,e,f,g,h,l,m){var n=this.i.ga?this.i.ga(a,b,c,d,e,f,g,h,l,m):this.i.call(null,a,b,c,d,e,f,g,h,l,m),p=sh(this,n);v(p)||qh(this.name,n);return p.ga?p.ga(a,b,c,d,e,f,g,h,l,m):p.call(null,a,b,c,d,e,f,g,h,l,m)};k.ha=function(a,b,c,d,e,f,g,h,l,m,n){var p=this.i.ha?this.i.ha(a,b,c,d,e,f,g,h,l,m,n):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n),q=sh(this,p);v(q)||qh(this.name,p);return q.ha?q.ha(a,b,c,d,e,f,g,h,l,m,n):q.call(null,a,b,c,d,e,f,g,h,l,m,n)};
k.ia=function(a,b,c,d,e,f,g,h,l,m,n,p){var q=this.i.ia?this.i.ia(a,b,c,d,e,f,g,h,l,m,n,p):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p),r=sh(this,q);v(r)||qh(this.name,q);return r.ia?r.ia(a,b,c,d,e,f,g,h,l,m,n,p):r.call(null,a,b,c,d,e,f,g,h,l,m,n,p)};k.ja=function(a,b,c,d,e,f,g,h,l,m,n,p,q){var r=this.i.ja?this.i.ja(a,b,c,d,e,f,g,h,l,m,n,p,q):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q),t=sh(this,r);v(t)||qh(this.name,r);return t.ja?t.ja(a,b,c,d,e,f,g,h,l,m,n,p,q):t.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q)};
k.ka=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){var t=this.i.ka?this.i.ka(a,b,c,d,e,f,g,h,l,m,n,p,q,r):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r),w=sh(this,t);v(w)||qh(this.name,t);return w.ka?w.ka(a,b,c,d,e,f,g,h,l,m,n,p,q,r):w.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r)};
k.la=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t){var w=this.i.la?this.i.la(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t),y=sh(this,w);v(y)||qh(this.name,w);return y.la?y.la(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t):y.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t)};
k.ma=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w){var y=this.i.ma?this.i.ma(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w),C=sh(this,y);v(C)||qh(this.name,y);return C.ma?C.ma(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w):C.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w)};
k.na=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y){var C=this.i.na?this.i.na(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y),A=sh(this,C);v(A)||qh(this.name,C);return A.na?A.na(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y):A.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y)};
k.oa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C){var A=this.i.oa?this.i.oa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C),G=sh(this,A);v(G)||qh(this.name,A);return G.oa?G.oa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C):G.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C)};
k.pa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A){var G=this.i.pa?this.i.pa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A),H=sh(this,G);v(H)||qh(this.name,G);return H.pa?H.pa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A):H.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A)};
k.qa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A,G){var H=this.i.qa?this.i.qa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A,G):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A,G),ja=sh(this,H);v(ja)||qh(this.name,H);return ja.qa?ja.qa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A,G):ja.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A,G)};
k.Kb=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A,G,H){var ja=D.j(this.i,a,b,c,d,F([e,f,g,h,l,m,n,p,q,r,t,w,y,C,A,G,H],0)),B=sh(this,ja);v(B)||qh(this.name,ja);return D.j(B,a,b,c,d,F([e,f,g,h,l,m,n,p,q,r,t,w,y,C,A,G,H],0))};function th(a,b,c){Re.o(a.Eb,md,b,c);mh(a.Yb,a.Eb,a.Hb,a.Vb)}
function sh(a,b){pc.a(L.b?L.b(a.Hb):L.call(null,a.Hb),L.b?L.b(a.Vb):L.call(null,a.Vb))||mh(a.Yb,a.Eb,a.Hb,a.Vb);var c=(L.b?L.b(a.Yb):L.call(null,a.Yb)).call(null,b);if(v(c))return c;c=ph(a.name,b,a.Vb,a.Eb,a.pd,a.Yb,a.Hb);return v(c)?c:(L.b?L.b(a.Eb):L.call(null,a.Eb)).call(null,a.ed)}k.Ob=function(){return bc(this.name)};k.Pb=function(){return cc(this.name)};k.U=function(){return this[fa]||(this[fa]=++ga)};var uh=new x(null,"y","y",-1757859776),vh=new x(null,"path","path",-188191168),wh=new x(null,"penny-spacing","penny-spacing",-20780703),xh=new x(null,"supplier","supplier",18255489),yh=new x(null,"determine-capacity","determine-capacity",-452765887),zh=new x(null,"by-station","by-station",516084641),Ah=new x(null,"selector","selector",762528866),Bh=new x(null,"basic+efficient+fixed","basic+efficient+fixed",-1106868702),Ch=new x(null,"r","r",-471384190),Dh=new x(null,"run","run",-1821166653),Eh=new x(null,
"richpath","richpath",-150197948),Fh=new x(null,"turns","turns",-1118736892),Gh=new x(null,"transform","transform",1381301764),Hh=new x(null,"die","die",-547192252),Ga=new x(null,"meta","meta",1499536964),Ih=new x(null,"transformer","transformer",-1493470620),Jh=new x(null,"color","color",1011675173),Kh=new x(null,"executors","executors",-331073403),Ha=new x(null,"dup","dup",556298533),Lh=new x(null,"intaking","intaking",-1009888859),Mh=new x(null,"processing","processing",-1576405467),Nh=new x(null,
"stats-history","stats-history",636123973),Oh=new x(null,"spout-y","spout-y",1676697606),Ph=new x(null,"stations","stations",-19744730),Qh=new x(null,"capacity","capacity",72689734),Rh=new x(null,"private","private",-558947994),Sh=new x(null,"efficient","efficient",-63016538),Th=new x(null,"graphs?","graphs?",-270895578),Uh=new x(null,"transform*","transform*",-1613794522),Vh=new x(null,"button","button",1456579943),Wh=new x(null,"top","top",-1856271961),Xh=new x(null,"basic+efficient","basic+efficient",
-970783161),Oe=new x(null,"validator","validator",-1966190681),Yh=new x(null,"total-utilization","total-utilization",-1341502521),Zh=new x(null,"coords","coords",-599429112),$h=new x(null,"use","use",-1846382424),ai=new x(null,"default","default",-1987822328),bi=new x(null,"finally-block","finally-block",832982472),ci=new x(null,"scenarios","scenarios",1618559369),di=new x(null,"formatter","formatter",-483008823),ei=new x(null,"value","value",305978217),fi=new x(null,"green","green",-945526839),gi=
new x(null,"section","section",-300141526),hi=new x(null,"circle","circle",1903212362),ii=new x(null,"drop","drop",364481611),ji=new x(null,"tracer","tracer",-1844475765),ki=new x(null,"width","width",-384071477),li=new x(null,"supply","supply",-1701696309),mi=new x(null,"spath","spath",-1857758005),ni=new x(null,"source-spout-y","source-spout-y",1447094571),oi=new x(null,"onclick","onclick",1297553739),pi=new x(null,"dy","dy",1719547243),qi=new x(null,"params","params",710516235),ri=new x(null,"total-output",
"total-output",1149740747),si=new x(null,"easing","easing",735372043),Wg=new x(null,"val","val",128701612),V=new x(null,"recur","recur",-437573268),ti=new x(null,"type","type",1174270348),ui=new x(null,"catch-block","catch-block",1175212748),vi=new x(null,"duration","duration",1444101068),wi=new x(null,"constrained","constrained",597287981),xi=new x(null,"intaking?","intaking?",834765),Vg=new x(null,"fallback-impl","fallback-impl",-1501286995),yi=new x(null,"output","output",-1105869043),Da=new x(null,
"flush-on-newline","flush-on-newline",-151457939),zi=new x(null,"normal","normal",-1519123858),Ai=new x(null,"wip","wip",-103467282),Bi=new x(null,"averages","averages",-1747836978),Ci=new x(null,"className","className",-1983287057),ih=new x(null,"descendants","descendants",1824886031),Di=new x(null,"size","size",1098693007),Ei=new x(null,"accessor","accessor",-25476721),Fi=new x(null,"title","title",636505583),Gi=new x(null,"no-op","no-op",-93046065),Hi=new oc(null,"folder","folder",-1138554033,
null),Ii=new x(null,"num-needed-params","num-needed-params",-1219326097),Ji=new x(null,"dropping","dropping",125809647),Ki=new x(null,"high","high",2027297808),jh=new x(null,"ancestors","ancestors",-776045424),Li=new x(null,"style","style",-496642736),Mi=new x(null,"div","div",1057191632),Fa=new x(null,"readably","readably",1129599760),Ni=new x(null,"params-idx","params-idx",340984624),Oi=new oc(null,"box","box",-1123515375,null),Ng=new x(null,"more-marker","more-marker",-14717935),Pi=new x(null,
"percent-utilization","percent-utilization",-2006109103),Qi=new x(null,"g","g",1738089905),Ri=new x(null,"update-stats","update-stats",1938193073),Si=new x(null,"basic+efficient+constrained","basic+efficient+constrained",-815375631),Ti=new x(null,"transfer-to-next-station","transfer-to-next-station",-114193262),Ui=new x(null,"set-spacing","set-spacing",1920968978),Vi=new x(null,"intake","intake",-108984782),Wi=new x(null,"set-up","set-up",874388242),Xi=new oc(null,"coll","coll",-1006698606,null),
Yi=new x(null,"line","line",212345235),Zi=new x(null,"basic+efficient+constrained+fixed","basic+efficient+constrained+fixed",-963095949),$i=new oc(null,"val","val",1769233139,null),aj=new oc(null,"xf","xf",2042434515,null),Ia=new x(null,"print-length","print-length",1931866356),bj=new x(null,"select*","select*",-1829914060),cj=new x(null,"cx","cx",1272694324),dj=new x(null,"id","id",-1388402092),ej=new x(null,"class","class",-2030961996),fj=new x(null,"red","red",-969428204),gj=new x(null,"blue",
"blue",-622100620),hj=new x(null,"cy","cy",755331060),ij=new x(null,"catch-exception","catch-exception",-1997306795),hh=new x(null,"parents","parents",-2027538891),jj=new x(null,"collect-val","collect-val",801894069),kj=new x(null,"xlink:href","xlink:href",828777205),lj=new x(null,"prev","prev",-1597069226),mj=new x(null,"svg","svg",856789142),nj=new x(null,"bin-h","bin-h",346004918),oj=new x(null,"length","length",588987862),pj=new x(null,"continue-block","continue-block",-1852047850),qj=new x(null,
"hookTransition","hookTransition",-1045887913),rj=new x(null,"tracer-reset","tracer-reset",283192087),sj=new x(null,"distribution","distribution",-284555369),tj=new x(null,"transfer-to-processed","transfer-to-processed",198231991),uj=new x(null,"roll","roll",11266999),vj=new x(null,"position","position",-2011731912),wj=new x(null,"graphs","graphs",-1584479112),xj=new x(null,"basic","basic",1043717368),yj=new x(null,"image","image",-58725096),zj=new x(null,"d","d",1972142424),Aj=new x(null,"average",
"average",-492356168),Bj=new x(null,"dropping?","dropping?",-1065207176),Cj=new x(null,"processed","processed",800622264),Dj=new x(null,"x","x",2099068185),Ej=new x(null,"x1","x1",-1863922247),Fj=new x(null,"tracer-start","tracer-start",1036491225),Gj=new x(null,"transform-fns","transform-fns",669042649),Ce=new oc(null,"quote","quote",1377916282,null),Hj=new x(null,"purple","purple",-876021126),Ij=new x(null,"fixed","fixed",-562004358),Be=new x(null,"arglists","arglists",1661989754),kf=new x(null,
"dice","dice",707777434),Jj=new x(null,"y2","y2",-718691301),Kj=new x(null,"set-lengths","set-lengths",742672507),Ae=new oc(null,"nil-iter","nil-iter",1101030523,null),Lj=new x(null,"main","main",-2117802661),Mj=new x(null,"hierarchy","hierarchy",-1053470341),Ug=new x(null,"alt-impl","alt-impl",670969595),Nj=new oc(null,"fn-handler","fn-handler",648785851,null),Oj=new x(null,"doc","doc",1913296891),Pj=new x(null,"integrate","integrate",-1653689604),Qj=new x(null,"rect","rect",-108902628),Rj=new x(null,
"step","step",1288888124),Sj=new x(null,"delay","delay",-574225219),Tj=new x(null,"x2","x2",-1362513475),Uj=new x(null,"pennies","pennies",1847043709),Vj=new x(null,"incoming","incoming",-1710131427),Wj=new x(null,"productivity","productivity",-890721314),Xj=new x(null,"range","range",1639692286),Yj=new x(null,"height","height",1025178622),Zj=new x(null,"spacing","spacing",204422175),ak=new x(null,"left","left",-399115937),bk=new x("cljs.core","not-found","cljs.core/not-found",-1572889185),ck=new x(null,
"foreignObject","foreignObject",25502111),dk=new x(null,"text","text",-1790561697),ek=new x(null,"data","data",-232669377),fk=new oc(null,"f","f",43394975,null);var gk;function hk(a){return a.l?a.l():a.call(null)}function ik(a,b,c){return ud(c)?Db(c,a,b):null==c?b:Na(c)?Wc(c,a,b):Cb.c(c,a,b)}
var jk=function jk(b,c,d,e){if(null!=b&&null!=b.qc)return b.qc(b,c,d,e);var f=jk[ca(null==b?null:b)];if(null!=f)return f.o?f.o(b,c,d,e):f.call(null,b,c,d,e);f=jk._;if(null!=f)return f.o?f.o(b,c,d,e):f.call(null,b,c,d,e);throw Sa("CollFold.coll-fold",b);},kk=function kk(b,c){"undefined"===typeof gk&&(gk=function(b,c,f,g){this.gd=b;this.fc=c;this.ab=f;this.jd=g;this.g=917504;this.C=0},gk.prototype.R=function(b,c){return new gk(this.gd,this.fc,this.ab,c)},gk.prototype.P=function(){return this.jd},gk.prototype.ea=
function(b,c){return Cb.c(this.fc,this.ab.b?this.ab.b(c):this.ab.call(null,c),c.l?c.l():c.call(null))},gk.prototype.fa=function(b,c,f){return Cb.c(this.fc,this.ab.b?this.ab.b(c):this.ab.call(null,c),f)},gk.prototype.qc=function(b,c,f,g){return jk(this.fc,c,f,this.ab.b?this.ab.b(g):this.ab.call(null,g))},gk.ic=function(){return new O(null,4,5,Q,[Pc(Hi,new u(null,2,[Be,nc(Ce,nc(new O(null,2,5,Q,[Xi,aj],null))),Oj,"Given a foldable collection, and a transformation function xf,\n  returns a foldable collection, where any supplied reducing\n  fn will be transformed by xf. xf is a function of reducing fn to\n  reducing fn."],
null)),Xi,aj,ua.Ed],null)},gk.xb=!0,gk.eb="clojure.core.reducers/t_clojure$core$reducers19004",gk.Tb=function(b,c){return Nb(c,"clojure.core.reducers/t_clojure$core$reducers19004")});return new gk(kk,b,c,De)};
function lk(a,b){return kk(b,function(b){return function(){function d(d,e,f){e=a.a?a.a(e,f):a.call(null,e,f);return b.a?b.a(d,e):b.call(null,d,e)}function e(d,e){var f=a.b?a.b(e):a.call(null,e);return b.a?b.a(d,f):b.call(null,d,f)}function f(){return b.l?b.l():b.call(null)}var g=null,g=function(a,b,c){switch(arguments.length){case 0:return f.call(this);case 2:return e.call(this,a,b);case 3:return d.call(this,a,b,c)}throw Error("Invalid arity: "+arguments.length);};g.l=f;g.a=e;g.c=d;return g}()})}
function mk(a,b){return kk(b,function(b){return function(){function d(d,e,f){return ik(b,d,a.a?a.a(e,f):a.call(null,e,f))}function e(d,e){return ik(b,d,a.b?a.b(e):a.call(null,e))}function f(){return b.l?b.l():b.call(null)}var g=null,g=function(a,b,c){switch(arguments.length){case 0:return f.call(this);case 2:return e.call(this,a,b);case 3:return d.call(this,a,b,c)}throw Error("Invalid arity: "+arguments.length);};g.l=f;g.a=e;g.c=d;return g}()})}
var nk=function nk(b,c,d,e){if(rd(b))return d.l?d.l():d.call(null);if(M(b)<=c)return ik(e,d.l?d.l():d.call(null),b);var f=Vd(M(b)),g=Ef.c(b,0,f);b=Ef.c(b,f,M(b));return hk(function(b,c,e,f){return function(){var b=f(c),g;g=f(e);b=b.l?b.l():b.call(null);g=g.l?g.l():g.call(null);return d.a?d.a(b,g):d.call(null,b,g)}}(f,g,b,function(b,f,g){return function(n){return function(){return function(){return nk(n,c,d,e)}}(b,f,g)}}(f,g,b)))};jk["null"]=function(a,b,c){return c.l?c.l():c.call(null)};
jk.object=function(a,b,c,d){return ik(d,c.l?c.l():c.call(null),a)};O.prototype.qc=function(a,b,c,d){return nk(this,b,c,d)};function ok(){}
var pk=function pk(b,c,d){if(null!=b&&null!=b.zb)return b.zb(b,c,d);var e=pk[ca(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=pk._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Sa("StructurePath.select*",b);},qk=function qk(b,c,d){if(null!=b&&null!=b.Ab)return b.Ab(b,c,d);var e=qk[ca(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=qk._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Sa("StructurePath.transform*",b);};
function rk(){}var sk=function sk(b,c){if(null!=b&&null!=b.rc)return b.rc(0,c);var d=sk[ca(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=sk._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("Collector.collect-val",b);};var tk=function tk(b){if(null!=b&&null!=b.Gc)return b.Gc();var c=tk[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=tk._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("PathComposer.comp-paths*",b);};function uk(a,b,c){this.type=a;this.sd=b;this.ud=c}var vk;
vk=new uk(Eh,function(a,b,c,d){var e=function(){return function(a,b,c,d){return rd(c)?new O(null,1,5,Q,[d],null):new O(null,1,5,Q,[hd.a(c,d)],null)}}(a,b,id,d);return c.A?c.A(a,b,id,d,e):c.call(null,a,b,id,d,e)},function(a,b,c,d,e){var f=function(){return function(a,b,c,e){return rd(c)?d.b?d.b(e):d.call(null,e):D.a(d,hd.a(c,e))}}(a,b,id,e);return c.A?c.A(a,b,id,e,f):c.call(null,a,b,id,e,f)});var wk;
wk=new uk(mi,function(a,b,c,d){a=function(){return function(a){return new O(null,1,5,Q,[a],null)}}(d);return c.a?c.a(d,a):c.call(null,d,a)},function(a,b,c,d,e){return c.a?c.a(e,d):c.call(null,e,d)});function xk(a,b,c,d,e,f){this.Ka=a;this.La=b;this.Ma=c;this.T=d;this.G=e;this.u=f;this.g=2229667594;this.C=8192}k=xk.prototype;k.N=function(a,b){return kb.c(this,b,null)};
k.I=function(a,b,c){switch(b instanceof x?b.Ha:null){case "executors":return this.Ka;case "selector":return this.La;case "transformer":return this.Ma;default:return E.c(this.G,b,c)}};k.M=function(a,b,c){return zf(b,function(){return function(a){return zf(b,Af,""," ","",c,a)}}(this),"#com.rpl.specter.impl.TransformFunctions{",", ","}",c,te.a(new O(null,3,5,Q,[new O(null,2,5,Q,[Kh,this.Ka],null),new O(null,2,5,Q,[Ah,this.La],null),new O(null,2,5,Q,[Ih,this.Ma],null)],null),this.G))};
k.Ga=function(){return new Mf(0,this,3,new O(null,3,5,Q,[Kh,Ah,Ih],null),fc(this.G))};k.P=function(){return this.T};k.Y=function(){return 3+M(this.G)};k.U=function(){var a=this.u;return null!=a?a:this.u=a=ae(this)};k.D=function(a,b){var c;c=v(b)?(c=this.constructor===b.constructor)?Lf(this,b):c:b;return v(c)?!0:!1};
k.ib=function(a,b){return Fd(new Ag(null,new u(null,3,[Ah,null,Ih,null,Kh,null],null),null),b)?od.a(Pc(df.a(De,this),this.T),b):new xk(this.Ka,this.La,this.Ma,this.T,ye(od.a(this.G,b)),null)};
k.Oa=function(a,b,c){return v(T.a?T.a(Kh,b):T.call(null,Kh,b))?new xk(c,this.La,this.Ma,this.T,this.G,null):v(T.a?T.a(Ah,b):T.call(null,Ah,b))?new xk(this.Ka,c,this.Ma,this.T,this.G,null):v(T.a?T.a(Ih,b):T.call(null,Ih,b))?new xk(this.Ka,this.La,c,this.T,this.G,null):new xk(this.Ka,this.La,this.Ma,this.T,md.c(this.G,b,c),null)};k.V=function(){return I(te.a(new O(null,3,5,Q,[new O(null,2,5,Q,[Kh,this.Ka],null),new O(null,2,5,Q,[Ah,this.La],null),new O(null,2,5,Q,[Ih,this.Ma],null)],null),this.G))};
k.R=function(a,b){return new xk(this.Ka,this.La,this.Ma,b,this.G,this.u)};k.X=function(a,b){return vd(b)?nb(this,eb.a(b,0),eb.a(b,1)):Xa.c(cb,this,b)};function yk(a,b,c){return new xk(a,b,c,null,null,null)}function zk(a,b,c,d,e,f){this.va=a;this.Xa=b;this.Ya=c;this.T=d;this.G=e;this.u=f;this.g=2229667594;this.C=8192}k=zk.prototype;k.N=function(a,b){return kb.c(this,b,null)};
k.I=function(a,b,c){switch(b instanceof x?b.Ha:null){case "transform-fns":return this.va;case "params":return this.Xa;case "params-idx":return this.Ya;default:return E.c(this.G,b,c)}};k.M=function(a,b,c){return zf(b,function(){return function(a){return zf(b,Af,""," ","",c,a)}}(this),"#com.rpl.specter.impl.CompiledPath{",", ","}",c,te.a(new O(null,3,5,Q,[new O(null,2,5,Q,[Gj,this.va],null),new O(null,2,5,Q,[qi,this.Xa],null),new O(null,2,5,Q,[Ni,this.Ya],null)],null),this.G))};
k.Ga=function(){return new Mf(0,this,3,new O(null,3,5,Q,[Gj,qi,Ni],null),fc(this.G))};k.P=function(){return this.T};k.Y=function(){return 3+M(this.G)};k.U=function(){var a=this.u;return null!=a?a:this.u=a=ae(this)};k.D=function(a,b){var c;c=v(b)?(c=this.constructor===b.constructor)?Lf(this,b):c:b;return v(c)?!0:!1};
k.ib=function(a,b){return Fd(new Ag(null,new u(null,3,[qi,null,Ni,null,Gj,null],null),null),b)?od.a(Pc(df.a(De,this),this.T),b):new zk(this.va,this.Xa,this.Ya,this.T,ye(od.a(this.G,b)),null)};
k.Oa=function(a,b,c){return v(T.a?T.a(Gj,b):T.call(null,Gj,b))?new zk(c,this.Xa,this.Ya,this.T,this.G,null):v(T.a?T.a(qi,b):T.call(null,qi,b))?new zk(this.va,c,this.Ya,this.T,this.G,null):v(T.a?T.a(Ni,b):T.call(null,Ni,b))?new zk(this.va,this.Xa,c,this.T,this.G,null):new zk(this.va,this.Xa,this.Ya,this.T,md.c(this.G,b,c),null)};k.V=function(){return I(te.a(new O(null,3,5,Q,[new O(null,2,5,Q,[Gj,this.va],null),new O(null,2,5,Q,[qi,this.Xa],null),new O(null,2,5,Q,[Ni,this.Ya],null)],null),this.G))};
k.R=function(a,b){return new zk(this.va,this.Xa,this.Ya,b,this.G,this.u)};k.X=function(a,b){return vd(b)?nb(this,eb.a(b,0),eb.a(b,1)):Xa.c(cb,this,b)};function Ak(a){return new zk(a,null,0,null,null,null)}X;function Bk(a,b,c,d,e){this.va=a;this.rb=b;this.T=c;this.G=d;this.u=e;this.g=2229667595;this.C=8192}k=Bk.prototype;k.N=function(a,b){return kb.c(this,b,null)};
k.I=function(a,b,c){switch(b instanceof x?b.Ha:null){case "transform-fns":return this.va;case "num-needed-params":return this.rb;default:return E.c(this.G,b,c)}};k.M=function(a,b,c){return zf(b,function(){return function(a){return zf(b,Af,""," ","",c,a)}}(this),"#com.rpl.specter.impl.ParamsNeededPath{",", ","}",c,te.a(new O(null,2,5,Q,[new O(null,2,5,Q,[Gj,this.va],null),new O(null,2,5,Q,[Ii,this.rb],null)],null),this.G))};k.Ga=function(){return new Mf(0,this,2,new O(null,2,5,Q,[Gj,Ii],null),fc(this.G))};
k.call=function(){function a(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C,B,H,G){a=qe(te.a(new O(null,20,5,Q,[b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C,B,H],null),G));return X.c?X.c(this,a,0):X.call(null,this,a,0)}function b(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C,B,H){a=qe(20);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=w;a[15]=y;a[16]=A;a[17]=C;a[18]=B;a[19]=H;return X.c?X.c(this,a,0):X.call(null,this,a,0)}function c(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,
w,y,A,C,B){a=qe(19);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=w;a[15]=y;a[16]=A;a[17]=C;a[18]=B;return X.c?X.c(this,a,0):X.call(null,this,a,0)}function d(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,C){a=qe(18);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=w;a[15]=y;a[16]=A;a[17]=C;return X.c?X.c(this,a,0):X.call(null,this,a,0)}function e(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A){a=qe(17);
a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=w;a[15]=y;a[16]=A;return X.c?X.c(this,a,0):X.call(null,this,a,0)}function f(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y){a=qe(16);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=w;a[15]=y;return X.c?X.c(this,a,0):X.call(null,this,a,0)}function g(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w){a=qe(15);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;
a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=w;return X.c?X.c(this,a,0):X.call(null,this,a,0)}function h(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t){a=qe(14);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;return X.c?X.c(this,a,0):X.call(null,this,a,0)}function l(a,b,c,d,e,f,g,h,l,m,n,p,q,r){a=qe(13);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;return X.c?X.c(this,a,0):X.call(null,this,a,0)}function m(a,
b,c,d,e,f,g,h,l,m,n,p,q){a=qe(12);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;return X.c?X.c(this,a,0):X.call(null,this,a,0)}function n(a,b,c,d,e,f,g,h,l,m,n,p){a=qe(11);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;return X.c?X.c(this,a,0):X.call(null,this,a,0)}function p(a,b,c,d,e,f,g,h,l,m,n){a=qe(10);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;return X.c?X.c(this,a,0):X.call(null,this,a,0)}function q(a,
b,c,d,e,f,g,h,l,m){a=qe(9);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;return X.c?X.c(this,a,0):X.call(null,this,a,0)}function r(a,b,c,d,e,f,g,h,l){a=qe(8);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;return X.c?X.c(this,a,0):X.call(null,this,a,0)}function t(a,b,c,d,e,f,g,h){a=qe(7);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;return X.c?X.c(this,a,0):X.call(null,this,a,0)}function w(a,b,c,d,e,f,g){a=qe(6);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;return X.c?X.c(this,
a,0):X.call(null,this,a,0)}function y(a,b,c,d,e,f){a=qe(5);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;return X.c?X.c(this,a,0):X.call(null,this,a,0)}function C(a,b,c,d,e){a=qe(4);a[0]=b;a[1]=c;a[2]=d;a[3]=e;return X.c?X.c(this,a,0):X.call(null,this,a,0)}function A(a,b,c,d){a=qe(3);a[0]=b;a[1]=c;a[2]=d;return X.c?X.c(this,a,0):X.call(null,this,a,0)}function G(a,b,c){a=qe(2);a[0]=b;a[1]=c;return X.c?X.c(this,a,0):X.call(null,this,a,0)}function H(a,b){var c=qe(1);c[0]=b;return X.c?X.c(this,c,0):X.call(null,
this,c,0)}function ja(){var a=qe(0);return X.c?X.c(this,a,0):X.call(null,this,a,0)}var B=null,B=function(B,ha,P,W,S,Z,da,ia,ma,qa,wa,za,Va,Ea,Qa,La,Ra,Gb,Vb,Ic,Ed,xf){switch(arguments.length){case 1:return ja.call(this);case 2:return H.call(this,0,ha);case 3:return G.call(this,0,ha,P);case 4:return A.call(this,0,ha,P,W);case 5:return C.call(this,0,ha,P,W,S);case 6:return y.call(this,0,ha,P,W,S,Z);case 7:return w.call(this,0,ha,P,W,S,Z,da);case 8:return t.call(this,0,ha,P,W,S,Z,da,ia);case 9:return r.call(this,
0,ha,P,W,S,Z,da,ia,ma);case 10:return q.call(this,0,ha,P,W,S,Z,da,ia,ma,qa);case 11:return p.call(this,0,ha,P,W,S,Z,da,ia,ma,qa,wa);case 12:return n.call(this,0,ha,P,W,S,Z,da,ia,ma,qa,wa,za);case 13:return m.call(this,0,ha,P,W,S,Z,da,ia,ma,qa,wa,za,Va);case 14:return l.call(this,0,ha,P,W,S,Z,da,ia,ma,qa,wa,za,Va,Ea);case 15:return h.call(this,0,ha,P,W,S,Z,da,ia,ma,qa,wa,za,Va,Ea,Qa);case 16:return g.call(this,0,ha,P,W,S,Z,da,ia,ma,qa,wa,za,Va,Ea,Qa,La);case 17:return f.call(this,0,ha,P,W,S,Z,da,ia,
ma,qa,wa,za,Va,Ea,Qa,La,Ra);case 18:return e.call(this,0,ha,P,W,S,Z,da,ia,ma,qa,wa,za,Va,Ea,Qa,La,Ra,Gb);case 19:return d.call(this,0,ha,P,W,S,Z,da,ia,ma,qa,wa,za,Va,Ea,Qa,La,Ra,Gb,Vb);case 20:return c.call(this,0,ha,P,W,S,Z,da,ia,ma,qa,wa,za,Va,Ea,Qa,La,Ra,Gb,Vb,Ic);case 21:return b.call(this,0,ha,P,W,S,Z,da,ia,ma,qa,wa,za,Va,Ea,Qa,La,Ra,Gb,Vb,Ic,Ed);case 22:return a.call(this,0,ha,P,W,S,Z,da,ia,ma,qa,wa,za,Va,Ea,Qa,La,Ra,Gb,Vb,Ic,Ed,xf)}throw Error("Invalid arity: "+arguments.length);};B.b=ja;B.a=
H;B.c=G;B.o=A;B.A=C;B.aa=y;B.ba=w;B.ra=t;B.sa=r;B.ga=q;B.ha=p;B.ia=n;B.ja=m;B.ka=l;B.la=h;B.ma=g;B.na=f;B.oa=e;B.pa=d;B.qa=c;B.Kb=b;B.wb=a;return B}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};k.l=function(){var a=qe(0);return X.c?X.c(this,a,0):X.call(null,this,a,0)};k.b=function(a){var b=qe(1);b[0]=a;return X.c?X.c(this,b,0):X.call(null,this,b,0)};k.a=function(a,b){var c=qe(2);c[0]=a;c[1]=b;return X.c?X.c(this,c,0):X.call(null,this,c,0)};
k.c=function(a,b,c){var d=qe(3);d[0]=a;d[1]=b;d[2]=c;return X.c?X.c(this,d,0):X.call(null,this,d,0)};k.o=function(a,b,c,d){var e=qe(4);e[0]=a;e[1]=b;e[2]=c;e[3]=d;return X.c?X.c(this,e,0):X.call(null,this,e,0)};k.A=function(a,b,c,d,e){var f=qe(5);f[0]=a;f[1]=b;f[2]=c;f[3]=d;f[4]=e;return X.c?X.c(this,f,0):X.call(null,this,f,0)};k.aa=function(a,b,c,d,e,f){var g=qe(6);g[0]=a;g[1]=b;g[2]=c;g[3]=d;g[4]=e;g[5]=f;return X.c?X.c(this,g,0):X.call(null,this,g,0)};
k.ba=function(a,b,c,d,e,f,g){var h=qe(7);h[0]=a;h[1]=b;h[2]=c;h[3]=d;h[4]=e;h[5]=f;h[6]=g;return X.c?X.c(this,h,0):X.call(null,this,h,0)};k.ra=function(a,b,c,d,e,f,g,h){var l=qe(8);l[0]=a;l[1]=b;l[2]=c;l[3]=d;l[4]=e;l[5]=f;l[6]=g;l[7]=h;return X.c?X.c(this,l,0):X.call(null,this,l,0)};k.sa=function(a,b,c,d,e,f,g,h,l){var m=qe(9);m[0]=a;m[1]=b;m[2]=c;m[3]=d;m[4]=e;m[5]=f;m[6]=g;m[7]=h;m[8]=l;return X.c?X.c(this,m,0):X.call(null,this,m,0)};
k.ga=function(a,b,c,d,e,f,g,h,l,m){var n=qe(10);n[0]=a;n[1]=b;n[2]=c;n[3]=d;n[4]=e;n[5]=f;n[6]=g;n[7]=h;n[8]=l;n[9]=m;return X.c?X.c(this,n,0):X.call(null,this,n,0)};k.ha=function(a,b,c,d,e,f,g,h,l,m,n){var p=qe(11);p[0]=a;p[1]=b;p[2]=c;p[3]=d;p[4]=e;p[5]=f;p[6]=g;p[7]=h;p[8]=l;p[9]=m;p[10]=n;return X.c?X.c(this,p,0):X.call(null,this,p,0)};
k.ia=function(a,b,c,d,e,f,g,h,l,m,n,p){var q=qe(12);q[0]=a;q[1]=b;q[2]=c;q[3]=d;q[4]=e;q[5]=f;q[6]=g;q[7]=h;q[8]=l;q[9]=m;q[10]=n;q[11]=p;return X.c?X.c(this,q,0):X.call(null,this,q,0)};k.ja=function(a,b,c,d,e,f,g,h,l,m,n,p,q){var r=qe(13);r[0]=a;r[1]=b;r[2]=c;r[3]=d;r[4]=e;r[5]=f;r[6]=g;r[7]=h;r[8]=l;r[9]=m;r[10]=n;r[11]=p;r[12]=q;return X.c?X.c(this,r,0):X.call(null,this,r,0)};
k.ka=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){var t=qe(14);t[0]=a;t[1]=b;t[2]=c;t[3]=d;t[4]=e;t[5]=f;t[6]=g;t[7]=h;t[8]=l;t[9]=m;t[10]=n;t[11]=p;t[12]=q;t[13]=r;return X.c?X.c(this,t,0):X.call(null,this,t,0)};k.la=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t){var w=qe(15);w[0]=a;w[1]=b;w[2]=c;w[3]=d;w[4]=e;w[5]=f;w[6]=g;w[7]=h;w[8]=l;w[9]=m;w[10]=n;w[11]=p;w[12]=q;w[13]=r;w[14]=t;return X.c?X.c(this,w,0):X.call(null,this,w,0)};
k.ma=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w){var y=qe(16);y[0]=a;y[1]=b;y[2]=c;y[3]=d;y[4]=e;y[5]=f;y[6]=g;y[7]=h;y[8]=l;y[9]=m;y[10]=n;y[11]=p;y[12]=q;y[13]=r;y[14]=t;y[15]=w;return X.c?X.c(this,y,0):X.call(null,this,y,0)};k.na=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y){var C=qe(17);C[0]=a;C[1]=b;C[2]=c;C[3]=d;C[4]=e;C[5]=f;C[6]=g;C[7]=h;C[8]=l;C[9]=m;C[10]=n;C[11]=p;C[12]=q;C[13]=r;C[14]=t;C[15]=w;C[16]=y;return X.c?X.c(this,C,0):X.call(null,this,C,0)};
k.oa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C){var A=qe(18);A[0]=a;A[1]=b;A[2]=c;A[3]=d;A[4]=e;A[5]=f;A[6]=g;A[7]=h;A[8]=l;A[9]=m;A[10]=n;A[11]=p;A[12]=q;A[13]=r;A[14]=t;A[15]=w;A[16]=y;A[17]=C;return X.c?X.c(this,A,0):X.call(null,this,A,0)};k.pa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A){var G=qe(19);G[0]=a;G[1]=b;G[2]=c;G[3]=d;G[4]=e;G[5]=f;G[6]=g;G[7]=h;G[8]=l;G[9]=m;G[10]=n;G[11]=p;G[12]=q;G[13]=r;G[14]=t;G[15]=w;G[16]=y;G[17]=C;G[18]=A;return X.c?X.c(this,G,0):X.call(null,this,G,0)};
k.qa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A,G){var H=qe(20);H[0]=a;H[1]=b;H[2]=c;H[3]=d;H[4]=e;H[5]=f;H[6]=g;H[7]=h;H[8]=l;H[9]=m;H[10]=n;H[11]=p;H[12]=q;H[13]=r;H[14]=t;H[15]=w;H[16]=y;H[17]=C;H[18]=A;H[19]=G;return X.c?X.c(this,H,0):X.call(null,this,H,0)};k.Kb=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A,G,H){a=qe(te.a(new O(null,20,5,Q,[a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,C,A,G],null),H));return X.c?X.c(this,a,0):X.call(null,this,a,0)};k.P=function(){return this.T};
k.Y=function(){return 2+M(this.G)};k.U=function(){var a=this.u;return null!=a?a:this.u=a=ae(this)};k.D=function(a,b){var c;c=v(b)?(c=this.constructor===b.constructor)?Lf(this,b):c:b;return v(c)?!0:!1};k.ib=function(a,b){return Fd(new Ag(null,new u(null,2,[Ii,null,Gj,null],null),null),b)?od.a(Pc(df.a(De,this),this.T),b):new Bk(this.va,this.rb,this.T,ye(od.a(this.G,b)),null)};
k.Oa=function(a,b,c){return v(T.a?T.a(Gj,b):T.call(null,Gj,b))?new Bk(c,this.rb,this.T,this.G,null):v(T.a?T.a(Ii,b):T.call(null,Ii,b))?new Bk(this.va,c,this.T,this.G,null):new Bk(this.va,this.rb,this.T,md.c(this.G,b,c),null)};k.V=function(){return I(te.a(new O(null,2,5,Q,[new O(null,2,5,Q,[Gj,this.va],null),new O(null,2,5,Q,[Ii,this.rb],null)],null),this.G))};k.R=function(a,b){return new Bk(this.va,this.rb,b,this.G,this.u)};
k.X=function(a,b){return vd(b)?nb(this,eb.a(b,0),eb.a(b,1)):Xa.c(cb,this,b)};function Ck(a,b){return new Bk(a,b,null,null,null)}function X(a,b,c){return new zk(a.va,b,c,null,null,null)}function Dk(a){return new u(null,2,[bj,null!=a&&a.yb?function(a,c,d){return a.zb(null,c,d)}:pk,Uh,null!=a&&a.yb?function(a,c,d){return a.Ab(null,c,d)}:qk],null)}function Ek(a){return new u(null,1,[jj,null!=a&&a.Jc?function(a,c){return a.rc(0,c)}:sk],null)}
function Gk(a){var b=function(b){return function(d,e,f,g,h){f=hd.a(f,b.a?b.a(a,g):b.call(null,a,g));return h.o?h.o(d,e,f,g):h.call(null,d,e,f,g)}}(jj.b(Ek(a)));return Ak(yk(vk,b,b))}function Hk(a){var b=Dk(a),c=bj.b(b),d=Uh.b(b);return Ak(yk(wk,function(b,c){return function(b,d){return c.c?c.c(a,b,d):c.call(null,a,b,d)}}(b,c,d),function(b,c,d){return function(b,c){return d.c?d.c(a,b,c):d.call(null,a,b,c)}}(b,c,d)))}
var Ik=function Ik(b){if(null!=b&&null!=b.lb)return b.lb(b);var c=Ik[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Ik._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("CoercePath.coerce-path",b);};Ik["null"]=function(){return Hk(null)};zk.prototype.lb=function(){return this};Bk.prototype.lb=function(){return this};O.prototype.lb=function(){return tk(this)};zc.prototype.lb=function(){return Ik(Kd(this))};ee.prototype.lb=function(){return Ik(Kd(this))};ad.prototype.lb=function(){return Ik(Kd(this))};
Ik._=function(a){var b;b=(b=(b=ea(a))?b:null!=a?a.Pc?!0:a.ec?!1:Pa(Ya,a):Pa(Ya,a))?b:null!=a?a.yb?!0:a.ec?!1:Pa(ok,a):Pa(ok,a);if(v(b))a=Hk(a);else if(null!=a?a.Jc||(a.ec?0:Pa(rk,a)):Pa(rk,a))a=Gk(a);else throw b=F,a=[z("Protocol implementation cannot be found for object.\n        Extending Specter protocols should not be done inline in a deftype definition\n        because that prevents Specter from finding the protocol implementations for\n        optimized performance. Instead, you should extend the protocols via an\n        explicit extend-protocol call. \n"),
z(a)].join(""),a=b([a],0),Error(D.a(z,a));return a};function Jk(a){return a.Ka.type}
function Kk(a){var b=N(a,0),c=Xd(a,1),d=b.Ka,e=d.type,f=pc.a(e,Eh)?function(a,b,c,d,e,f){return function(q,r){return function(a,b,c,d,e,f){return function(g,h,l,m,n){var p=function(){return function(a,b,c,d){return r.A?r.A(a,b,c,d,n):r.call(null,a,b,c,d,n)}}(g,h,l,m,a,b,c,d,e,f);return q.A?q.A(g,h,l,m,p):q.call(null,g,h,l,m,p)}}(a,b,c,d,e,f)}}(d,e,a,b,c,a):function(a,b,c,d,e,f){return function(q,r){return function(a,b,c,d,e,f){return function(g,h){var l=function(){return function(a){return r.a?r.a(a,
h):r.call(null,a,h)}}(g,a,b,c,d,e,f);return q.a?q.a(g,l):q.call(null,g,l)}}(a,b,c,d,e,f)}}(d,e,a,b,c,a);return Xa.a(function(a,b,c){return function(b,d){return yk(a,function(){var a=b.La,e=d.La;return c.a?c.a(a,e):c.call(null,a,e)}(),function(){var a=b.Ma,e=d.Ma;return c.a?c.a(a,e):c.call(null,a,e)}())}}(d,e,f,a,b,c,a),a)}
function Lk(a){if(pc.a(Jk(a),Eh))return a;var b=a.La;a=a.Ma;return yk(vk,function(a,b){return function(e,f,g,h,l){var m=function(){return function(a){return l.o?l.o(e,f,g,a):l.call(null,e,f,g,a)}}(h,a,b);return a.a?a.a(h,m):a.call(null,h,m)}}(b,a),function(a,b){return function(e,f,g,h,l){var m=function(){return function(a){return l.o?l.o(e,f,g,a):l.call(null,e,f,g,a)}}(h,a,b);return b.a?b.a(h,m):b.call(null,h,m)}}(b,a))}
function Mk(a){if(a instanceof zk){var b=qi.b(a),c=Ni.b(a),d=Ah.b(Gj.b(a)),e=Ih.b(Gj.b(a));return rd(b)?a:Ak(yk(vk,function(a,b,c,d){return function(e,n,p,q,r){var t=function(){return function(a,b,c,d){return r.o?r.o(e,n,c,d):r.call(null,e,n,c,d)}}(a,b,p,q,a,b,c,d);return c.A?c.A(a,b,p,q,t):c.call(null,a,b,p,q,t)}}(b,c,d,e),function(a,b,c,d){return function(e,n,p,q,r){var t=function(){return function(a,b,c,d){return r.o?r.o(e,n,c,d):r.call(null,e,n,c,d)}}(a,b,p,q,a,b,c,d);return d.A?d.A(a,b,p,q,t):
d.call(null,a,b,p,q,t)}}(b,c,d,e)))}return a}tk["null"]=function(a){return Ik(a)};tk._=function(a){return Ik(a)};O.prototype.Gc=function(){if(rd(this))return Ik(null);var a=R.a(Mk,R.a(Ik,this)),b=R.a(Kk,Jg(Jk,R.a(Gj,a))),c=pc.a(1,M(b))?J(b):Kk(R.a(Lk,b)),a=bf(function(){return function(a){return a instanceof Bk}}(a,b,c,this),a);return rd(a)?Ak(c):Ck(Lk(c),Xa.a(Nd,R.a(Ii,a)))};function Nk(a){return a instanceof zk?0:Ii.b(a)}
var Ok=function Ok(b,c){if(null!=b&&null!=b.Hc)return b.Hc(0,c);var d=Ok[ca(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Ok._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("SetExtremes.set-first",b);},Pk=function Pk(b,c){if(null!=b&&null!=b.Ic)return b.Ic(0,c);var d=Pk[ca(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Pk._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("SetExtremes.set-last",b);};
O.prototype.Hc=function(a,b){return md.c(this,0,b)};O.prototype.Ic=function(a,b){return md.c(this,M(this)-1,b)};Ok._=function(a,b){return Zc(b,Ac(a))};Pk._=function(a,b){var c=Dg(a);return hd.a(Kd(c),b)};function Qk(a,b){var c=a.va;return c.Ka.sd.call(null,a.Xa,a.Ya,c.La,b)}function Rk(a,b,c){var d=a.va;return d.Ka.ud.call(null,a.Xa,a.Ya,d.Ma,b,c)}function Sk(){}Sk.prototype.yb=!0;Sk.prototype.zb=function(a,b,c){return df.a(id,mk(c,b))};
Sk.prototype.Ab=function(a,b,c){a=null==b?null:ab(b);if(de(a))for(c=b=R.a(c,b);;)if(I(c))c=K(c);else break;else b=df.a(a,lk(c,b));return b};function Tk(){}Tk.prototype.Jc=!0;Tk.prototype.rc=function(a,b){return b};function Uk(a,b){this.Lc=a;this.td=b}Uk.prototype.yb=!0;Uk.prototype.zb=function(a,b,c){if(rd(b))return null;a=this.Lc.call(null,b);return c.b?c.b(a):c.call(null,a)};
Uk.prototype.Ab=function(a,b,c){var d=this;return rd(b)?b:d.td.call(null,b,function(){var a=d.Lc.call(null,b);return c.b?c.b(a):c.call(null,a)}())};function Vk(a,b,c,d){a=Ef.c(Kd(a),b,c);return d.b?d.b(a):d.call(null,a)}function Wk(a,b,c,d){var e=Kd(a),f=Ef.c(e,b,c);d=d.b?d.b(f):d.call(null,f);b=te.j(Ef.c(e,0,b),d,F([Ef.c(e,c,M(a))],0));return vd(a)?Kd(b):b}ok["null"]=!0;pk["null"]=function(a,b,c){return c.b?c.b(b):c.call(null,b)};qk["null"]=function(a,b,c){return c.b?c.b(b):c.call(null,b)};
function Xk(a,b,c){return v(a.b?a.b(b):a.call(null,b))?c.b?c.b(b):c.call(null,b):null}function Yk(a,b,c){return v(a.b?a.b(b):a.call(null,b))?c.b?c.b(b):c.call(null,b):b};function Zk(a){return tk(Kd(a))}function $k(a,b){var c=tk(a);return Qk.a?Qk.a(c,b):Qk.call(null,c,b)}function al(a,b,c){a=tk(a);return Rk.c?Rk.c(a,b,c):Rk.call(null,a,b,c)}var bl=Zk(F([new Sk],0)),cl=new Tk,dl=Zk(F([new Uk(gd,Pk)],0));Zk(F([new Uk(J,Ok)],0));
var el=Ck(yk(vk,function(a,b,c,d,e){var f=a[b+0],g=a[b+1];return Vk(d,f.b?f.b(d):f.call(null,d),g.b?g.b(d):g.call(null,d),function(d){var f=b+2;return e.o?e.o(a,f,c,d):e.call(null,a,f,c,d)})},function(a,b,c,d,e){var f=a[b+0],g=a[b+1];return Wk(d,f.b?f.b(d):f.call(null,d),g.b?g.b(d):g.call(null,d),function(d){var f=b+2;return e.o?e.o(a,f,c,d):e.call(null,a,f,c,d)})}),2),fl=Ck(yk(vk,function(a,b,c,d,e){return Vk(d,a[b+0],a[b+1],function(d){var g=b+2;return e.o?e.o(a,g,c,d):e.call(null,a,g,c,d)})},function(a,
b,c,d,e){return Wk(d,a[b+0],a[b+1],function(d){var g=b+2;return e.o?e.o(a,g,c,d):e.call(null,a,g,c,d)})}),2);fl.a?fl.a(0,0):fl.call(null,0,0);el.a?el.a(M,M):el.call(null,M,M);x.prototype.yb=!0;x.prototype.zb=function(a,b,c){a=E.a(b,this);return c.b?c.b(a):c.call(null,a)};x.prototype.Ab=function(a,b,c){var d=this;return md.c(b,d,function(){var a=E.a(b,d);return c.b?c.b(a):c.call(null,a)}())};ok["function"]=!0;pk["function"]=function(a,b,c){return Xk(a,b,c)};
qk["function"]=function(a,b,c){return Yk(a,b,c)};Ag.prototype.yb=!0;Ag.prototype.zb=function(a,b,c){return Xk(this,b,c)};Ag.prototype.Ab=function(a,b,c){return Yk(this,b,c)};var gl=Ck(yk(vk,function(a,b,c,d,e){var f=a[b+0];d=v(d)?d:f;b+=1;return e.o?e.o(a,b,c,d):e.call(null,a,b,c,d)},function(a,b,c,d,e){var f=a[b+0];d=v(d)?d:f;b+=1;return e.o?e.o(a,b,c,d):e.call(null,a,b,c,d)}),1);gl.b?gl.b(Bg):gl.call(null,Bg);var hl=Bc;gl.b?gl.b(hl):gl.call(null,hl);gl.b?gl.b(id):gl.call(null,id);
function il(){var a=F([Vj],0),b=R.a(tk,new O(null,1,5,Q,[a],null)),c=R.a(Nk,b),d=Zc(0,Kg(c)),e=gd(d),f=R.c(function(a,b,c,d){return function(e,f){return v(f instanceof zk)?function(){return function(){return f}}(a,b,c,d):function(){return function(a,b){return X(f,a,b+e)}}(a,b,c,d)}}(b,c,d,e),d,b),g=N(f,0),a=function(){var a=function(a,b,c,d,e,f,g){return function(a,b,c,e,f){var h;h=g.a?g.a(a,b):g.call(null,a,b);var l=Qk.a?Qk.a(h,e):Qk.call(null,h,e);if(1<M(l))throw a=F(["More than one element found for params: ",
h,e],0),Error(D.a(z,a));h=J(l);b+=d;c=hd.a(c,h);return f.o?f.o(a,b,c,e):f.call(null,a,b,c,e)}}(b,c,d,e,f,f,g);return Ck(yk(vk,a,a),e)}();return pc.a(0,e)?X(a,null,0):a};var jl=new u(null,3,[li,2,Mh,4,sj,1],null),kl=new u(null,3,[li,-1,Mh,0,sj,0],null),ll=new u(null,3,[li,40,Mh,40,sj,0],null);function ml(a,b){var c=R.a(Je.a(jl,ti),b),d=a/Xa.a(Nd,c);return R.a(Ke(Pd,d),c)}function nl(a,b,c){return hd.a(b,function(){var d=null==b?null:ub(b);return a.a?a.a(d,c):a.call(null,d,c)}())}function ol(a,b){var c=null!=a&&(a.g&64||a.F)?D.a(Mc,a):a,c=E.a(c,ti),c=b-(ll.b?ll.b(c):ll.call(null,c));return c-Ud(c,20)}
function pl(a,b){var c=null!=a&&(a.g&64||a.F)?D.a(Mc,a):a,d=E.a(c,ki),e=E.a(c,Yj),f=ml(e,b);return R.j(function(a,b,c,d){return function(a,b,c,e){a=null!=a&&(a.g&64||a.F)?D.a(Mc,a):a;c=E.a(a,ti);b=new u(null,5,[uh,b+(kl.b?kl.b(c):kl.call(null,c)),ki,d,nj,e,Oh,e,ni,-30],null);return xg.j(F([a,b],0))}}(f,a,c,d,e),b,Xa.c(Ke(nl,Nd),new O(null,1,5,Q,[0],null),f),f,F([R.c(ol,b,f)],0))}
function ql(a,b){var c=null!=a&&(a.g&64||a.F)?D.a(Mc,a):a,d=E.a(c,ki),e=E.a(c,Yj),f=E.a(c,Dj),g=M(b),h=d/g;return R.c(function(a,b,c,d,e,f){return function(a,c){var d=new u(null,3,[Dj,a,ki,b-30,Yj,f],null),d=null!=d&&(d.g&64||d.F)?D.a(Mc,d):d,e=E.a(d,ki),g=E.a(d,Yj),h=null!=c&&(c.g&64||c.F)?D.a(Mc,c):c;E.a(h,Ph);return gf(xg.j(F([h,d],0)),Ph,Ke(pl,new u(null,2,[ki,e,Yj,g],null)))}}(g,h,a,c,d,e,f),Te(g,Xe(Ke(Nd,h),f)),b)};function rl(a){return pc.a(Mh,ti.b(a))}function sl(a){return al(new O(null,8,5,Q,[ci,bl,Ph,bl,function(a){return Fj.b(a)},Uj,dl,ji],null),Ie(!0),a)}if("undefined"===typeof tl)var tl=function(){var a=U.b?U.b(De):U.call(null,De),b=U.b?U.b(De):U.call(null,De),c=U.b?U.b(De):U.call(null,De),d=U.b?U.b(De):U.call(null,De),e=E.c(De,Mj,gh());return new rh(xc.a("pennygame.updates","capacity"),function(){return function(a,b){var c=null!=b&&(b.g&64||b.F)?D.a(Mc,b):b;return E.a(c,ti)}}(a,b,c,d,e),ai,e,a,b,c,d)}();
th(tl,zi,function(a){return a});th(tl,Ki,function(a){switch(a){case 1:return 4;case 2:return 4;case 3:return 4;case 4:return 4;case 5:return 5;case 6:return 6;default:throw Error([z("No matching clause: "),z(a)].join(""));}});th(tl,wi,function(a,b,c){a=null!=b&&(b.g&64||b.F)?D.a(Mc,b):b;b=E.a(a,zh);a=E.a(a,$h);c=kd(c,b);b=null!=c&&(c.g&64||c.F)?D.a(Mc,c):c;c=E.a(b,Qh);b=E.a(b,Uj);if(pc.a(a,Qh))return c;a=M(b);return c<a?c:a});function ul(a,b){return al(new O(null,4,5,Q,[ci,bl,Ph,bl],null),b,a)}
function vl(a,b){return Kd(R.c(function(a,b){return md.c(a,ei,b)},a,b))}function wl(a,b){return hf(a,kf,vl,b)}function xl(a,b){return al(new O(null,6,5,Q,[ci,bl,Ph,cl,bl,function(a){return Fd(a,Hh)}],null),function(a,d){var e=null!=d&&(d.g&64||d.F)?D.a(Mc,d):d,f=E.a(e,Hh),g=E.a(e,Wj);E.a(e,Uj);f=ff(b,new O(null,2,5,Q,[f,ei],null));g=tl.c?tl.c(f,g,a):tl.call(null,f,g,a);return md.c(e,Qh,g)},a)}
function yl(a,b){return al(new O(null,7,5,Q,[ci,bl,Ph,cl,bl,function(a){return Fd(a,Hh)},function(a){return pc.a(wi,ff(a,new O(null,2,5,Q,[Wj,ti],null)))}],null),function(a,d){var e=null!=d&&(d.g&64||d.F)?D.a(Mc,d):d,f=E.a(e,Hh),g=E.a(e,Wj);E.a(e,Uj);f=ff(b,new O(null,2,5,Q,[f,ei],null));g=tl.c?tl.c(f,g,a):tl.call(null,f,g,a);return md.c(e,Qh,g)},a)}function zl(a){var b=a.b?a.b(kf):a.call(null,kf);return yl(xl(a,b),b)}
if("undefined"===typeof Al){var Al,Bl=U.b?U.b(De):U.call(null,De),Cl=U.b?U.b(De):U.call(null,De),Dl=U.b?U.b(De):U.call(null,De),El=U.b?U.b(De):U.call(null,De),Fl=E.c(De,Mj,gh());Al=new rh(xc.a("pennygame.updates","process"),ti,ai,Fl,Bl,Cl,Dl,El)}th(Al,ai,function(a){a=null!=a&&(a.g&64||a.F)?D.a(Mc,a):a;var b=E.a(a,Qh),c=E.a(a,Uj);return md.j(a,Uj,Ue(b,c),F([Cj,Te(b,c)],0))});th(Al,li,function(a){a=null!=a&&(a.g&64||a.F)?D.a(Mc,a):a;var b=E.a(a,Qh);return md.c(a,Cj,Te(b,Ve(De)))});
function Gl(a){var b=J($k(new O(null,4,5,Q,[Ph,bl,function(a){return rj.b(a)},rj],null),a));return al(new O(null,6,5,Q,[Ph,function(){var a=b+1;return fl.a?fl.a(b,a):fl.call(null,b,a)}(),bl,Cj,dl,ji],null),Ie(!0),a)}function Hl(a){return Ge(ji,$k(new O(null,4,5,Q,[bl,function(a){return rj.b(a)},Cj,bl],null),a))}function Il(a){return v(Hl(a.b?a.b(Ph):a.call(null,Ph)))?Gl(a):a}
function Jl(a){return al(new O(null,2,5,Q,[ci,bl],null),Il,al(new O(null,5,5,Q,[ci,bl,Ph,bl,function(a){return E.a(a,Qh)}],null),Al,a))}function Kl(a){var b=D.c(Td,16.5,R.a(function(a){var b=null!=a&&(a.g&64||a.F)?D.a(Mc,a):a;a=E.a(b,oj);var e=E.a(b,Vj),b=E.a(b,Uj);return a/(M(e)+M(b))},$k(new O(null,5,5,Q,[ci,bl,Ph,bl,rl],null),a)));return al(new O(null,5,5,Q,[ci,bl,Ph,bl,rl],null),function(a){return function(b){return hf(b,wh,Td,a)}}(b),a)}
function Ll(a){return al(new O(null,6,5,Q,[ci,bl,Ph,cl,bl,function(a){return Fd(a,xh)}],null),function(a,c){var d=null!=c&&(c.g&64||c.F)?D.a(Mc,c):c,e=E.a(d,xh);return md.c(d,Vj,ff(Kd(a),new O(null,2,5,Q,[e,Cj],null)))},a)}function Ml(a){return al(new O(null,6,5,Q,[ci,bl,Ph,bl,il(),Uj],null),function(a,c){return te.a(c,a)},a)}
function Nl(a,b){var c=null!=a&&(a.g&64||a.F)?D.a(Mc,a):a,c=E.a(c,Ph),d=null!=b&&(b.g&64||b.F)?D.a(Mc,b):b,e=E.c(d,Fh,0),f=E.c(d,Yh,new O(null,2,5,Q,[0,0],null)),d=E.a(d,ri),g=D.c(R,Nd,R.a(Mg(Je.a(M,Cj),Qh),$k(new O(null,2,5,Q,[bl,rl],null),c))),h=M(Cj.b(gd(Dg(c)))),l=Xa.a(Nd,R.a(M,$k(new O(null,3,5,Q,[bl,rl,Uj],null),c))),f=R.c(Nd,f,g);return new u(null,5,[Ai,l,Fh,v(Hl(c))?e+1:e,ri,d+h,Yh,f,Pi,D.a(Qd,f)],null)}
function Ol(a){return al(new O(null,5,5,Q,[ci,bl,function(a){return I(E.a(a,Ph))},cl,Nh],null),function(a,c){return hd.a(c,Nl(a,null==c?null:ub(c)))},a)};function Pl(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;return Ql(0<b.length?new zc(b.slice(0),0):null)}function Ql(a){return xg.j(F([new u(null,2,[ei,0,ti,Mh],null),D.a(Mc,a)],0))}function Rl(a){return xg.j(F([new u(null,8,[dj,Yg("station"),ti,Mh,Vj,id,Uj,Te(4,Ve(De)),Cj,id,Qh,null,Wj,new u(null,1,[ti,zi],null),wh,999999],null),D.a(Mc,a)],0))}
function Sl(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;return Tl(0<b.length?new zc(b.slice(0),0):null)}function Tl(a){return xg.j(F([new u(null,2,[Nh,id,Ph,id],null),D.a(Mc,a)],0))}
var Ul=new O(null,5,5,Q,[Ql(F([ti,li],0)),Pl(),Pl(),Pl(),Pl()],null),Vl=Tl(F([Jh,fj,Ph,new O(null,6,5,Q,[Rl(F([ti,li,Hh,0],0)),Rl(F([xh,0,Hh,1,Fj,!0],0)),Rl(F([xh,1,Hh,2],0)),Rl(F([xh,2,Hh,3],0)),Rl(F([xh,3,Hh,4,rj,0],0)),Rl(F([ti,sj,xh,4],0))],null)],0)),Wl=Tl(F([Jh,fi,Ph,new O(null,6,5,Q,[Rl(F([ti,li,Hh,0,Wj,new u(null,1,[ti,Ki],null)],0)),Rl(F([xh,0,Hh,1,Wj,new u(null,1,[ti,Ki],null),Fj,!0],0)),Rl(F([xh,1,Hh,2,Wj,new u(null,1,[ti,Ki],null)],0)),Rl(F([xh,2,Hh,3],0)),Rl(F([xh,3,Hh,4,Wj,new u(null,
1,[ti,Ki],null),rj,0],0)),Rl(F([ti,sj,xh,4],0))],null)],0)),Xl=Tl(F([Jh,gj,Ph,new O(null,6,5,Q,[Rl(F([ti,li,Hh,0,Wj,new u(null,3,[ti,wi,zh,3,$h,Qh],null)],0)),Rl(F([xh,0,Hh,1,Wj,new u(null,1,[ti,Ki],null),Fj,!0],0)),Rl(F([xh,1,Hh,2,Wj,new u(null,1,[ti,Ki],null)],0)),Rl(F([xh,2,Hh,3],0)),Rl(F([xh,3,Hh,4,Wj,new u(null,1,[ti,Ki],null),rj,0],0)),Rl(F([ti,sj,xh,4],0))],null)],0)),Yl=Tl(F([Jh,Hj,Ph,new O(null,6,5,Q,[Rl(F([ti,li,Hh,0,Wj,new u(null,3,[ti,wi,zh,4,$h,yi],null)],0)),Rl(F([xh,0,Hh,1,Wj,new u(null,
1,[ti,Ki],null),Fj,!0],0)),Rl(F([xh,1,Hh,2,Wj,new u(null,1,[ti,Ki],null)],0)),Rl(F([xh,2,Hh,3],0)),Rl(F([xh,3,Hh,4,Wj,new u(null,1,[ti,Ki],null),rj,0],0)),Rl(F([ti,sj,xh,4],0))],null)],0)),Zl=new u(null,7,[xj,new u(null,3,[Rj,0,kf,Ul,ci,new O(null,3,5,Q,[Vl,Sl(),Sl()],null)],null),Sh,new u(null,3,[Rj,0,kf,Ul,ci,new O(null,3,5,Q,[Sl(),Wl,Sl()],null)],null),wi,new u(null,3,[Rj,0,kf,Ul,ci,new O(null,3,5,Q,[Sl(),Sl(),Xl],null)],null),Xh,new u(null,3,[Rj,0,kf,Ul,ci,new O(null,3,5,Q,[Vl,Wl,Sl()],null)],
null),Si,new u(null,3,[Rj,0,kf,Ul,ci,new O(null,3,5,Q,[Vl,Wl,Xl],null)],null),Bh,new u(null,3,[Rj,0,kf,Ul,ci,new O(null,3,5,Q,[Vl,Wl,Yl],null)],null),Zi,new u(null,3,[Rj,0,kf,Ul,ci,new O(null,4,5,Q,[Vl,Wl,Xl,Yl],null)],null)],null);function $l(a){return Ol(Ml(Ll(Jl(zl(wl(gf(a,Rj,Qc),We(function(){return 6*Math.random()+1|0})))))))}function am(a){a:for(var b=De,c=I(new O(null,4,5,Q,[Ai,ri,Fh,Pi],null));;)if(c)var d=J(c),e=E.c(a,d,bk),b=pc.a(e,bk)?b:md.c(b,d,e),c=K(c);else{a=Pc(b,qd(a));break a}return a}var bm=new u(null,3,[Rj,0,kf,Ul,ci,new O(null,4,5,Q,[Vl,Wl,Xl,Yl],null)],null);function cm(a){return Eg(new O(null,4,5,Q,[xj,Sh,wi,Ij],null),R.a(Je.a(function(a){return R.a(am,a)},Nh),ci.b(a)))}
function dm(a,b){return Eg(Tf(b),R.a(a,Uf(b)))}var em=function em(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return em.j(arguments[0],1<c.length?new zc(c.slice(1),0):null)};em.j=function(a,b){return dm(function(b){return D.a(a,b)},dm(function(a){return R.a($d,a)},eh(Zd,D.a(te,b))))};em.w=1;em.B=function(a){var b=J(a);a=K(a);return em.j(b,a)};function fm(a){return dm(function(a){return D.c(R,Df,a)},dm(function(a){return R.a($d,a)},eh(Zd,D.a(te,a))))}
function gm(a){var b=function(){var b=cm(a);return U.b?U.b(b):U.call(null,b)}(),c=U.b?U.b(1):U.call(null,1),d=function(a,b){return function(a,c){return((L.b?L.b(b):L.call(null,b))*a+c)/((L.b?L.b(b):L.call(null,b))+1)}}(b,c);return function(a,b,c,d){return function(l){l=dm(function(a,b,c,d,e){return function(a){return R.a(e,a)}}(a,a,b,c,d),fm(F([L.b?L.b(a):L.call(null,a),cm(l)],0)));Qe.a?Qe.a(a,l):Qe.call(null,a,l);Re.a(b,Qc);return L.b?L.b(a):L.call(null,a)}}(b,c,d,function(a,b,c){return function(a){return D.c(em,
c,a)}}(b,c,d))};var hm;a:{var im=aa.navigator;if(im){var jm=im.userAgent;if(jm){hm=jm;break a}}hm=""};var km,lm=function lm(b,c){if(null!=b&&null!=b.pc)return b.pc(0,c);var d=lm[ca(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=lm._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("ReadPort.take!",b);},mm=function mm(b,c,d){if(null!=b&&null!=b.dc)return b.dc(0,c,d);var e=mm[ca(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=mm._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Sa("WritePort.put!",b);},nm=function nm(b){if(null!=b&&null!=
b.cc)return b.cc();var c=nm[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=nm._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("Channel.close!",b);},om=function om(b){if(null!=b&&null!=b.Ec)return!0;var c=om[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=om._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("Handler.active?",b);},pm=function pm(b){if(null!=b&&null!=b.Fc)return b.Fa;var c=pm[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,
b);c=pm._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("Handler.commit",b);},qm=function qm(b,c){if(null!=b&&null!=b.Dc)return b.Dc(0,c);var d=qm[ca(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=qm._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("Buffer.add!*",b);},rm=function rm(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return rm.b(arguments[0]);case 2:return rm.a(arguments[0],arguments[1]);
default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};rm.b=function(a){return a};rm.a=function(a,b){return qm(a,b)};rm.w=2;var sm,tm=function tm(b){"undefined"===typeof sm&&(sm=function(b,d,e){this.sc=b;this.Fa=d;this.ld=e;this.g=393216;this.C=0},sm.prototype.R=function(b,d){return new sm(this.sc,this.Fa,d)},sm.prototype.P=function(){return this.ld},sm.prototype.Ec=function(){return!0},sm.prototype.Fc=function(){return this.Fa},sm.ic=function(){return new O(null,3,5,Q,[Pc(Nj,new u(null,2,[Rh,!0,Be,nc(Ce,nc(new O(null,1,5,Q,[fk],null)))],null)),fk,ua.Gd],null)},sm.xb=!0,sm.eb="cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers22073",
sm.Tb=function(b,d){return Nb(d,"cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers22073")});return new sm(tm,b,De)};function um(a){try{return a[0].call(null,a)}catch(b){throw b instanceof Object&&a[6].cc(),b;}}function vm(a,b,c){c=c.pc(0,tm(function(c){a[2]=c;a[1]=b;return um(a)}));return v(c)?(a[2]=L.b?L.b(c):L.call(null,c),a[1]=b,V):null}function wm(a,b,c,d){c=c.dc(0,d,tm(function(c){a[2]=c;a[1]=b;return um(a)}));return v(c)?(a[2]=L.b?L.b(c):L.call(null,c),a[1]=b,V):null}
function xm(a,b){var c=a[6];null!=b&&c.dc(0,b,tm(function(){return function(){return null}}(c)));c.cc();return c}function ym(a,b,c,d,e,f,g,h){this.Sa=a;this.Ta=b;this.Va=c;this.Ua=d;this.Za=e;this.T=f;this.G=g;this.u=h;this.g=2229667594;this.C=8192}k=ym.prototype;k.N=function(a,b){return kb.c(this,b,null)};
k.I=function(a,b,c){switch(b instanceof x?b.Ha:null){case "catch-block":return this.Sa;case "catch-exception":return this.Ta;case "finally-block":return this.Va;case "continue-block":return this.Ua;case "prev":return this.Za;default:return E.c(this.G,b,c)}};
k.M=function(a,b,c){return zf(b,function(){return function(a){return zf(b,Af,""," ","",c,a)}}(this),"#cljs.core.async.impl.ioc-helpers.ExceptionFrame{",", ","}",c,te.a(new O(null,5,5,Q,[new O(null,2,5,Q,[ui,this.Sa],null),new O(null,2,5,Q,[ij,this.Ta],null),new O(null,2,5,Q,[bi,this.Va],null),new O(null,2,5,Q,[pj,this.Ua],null),new O(null,2,5,Q,[lj,this.Za],null)],null),this.G))};k.Ga=function(){return new Mf(0,this,5,new O(null,5,5,Q,[ui,ij,bi,pj,lj],null),fc(this.G))};k.P=function(){return this.T};
k.Y=function(){return 5+M(this.G)};k.U=function(){var a=this.u;return null!=a?a:this.u=a=ae(this)};k.D=function(a,b){var c;c=v(b)?(c=this.constructor===b.constructor)?Lf(this,b):c:b;return v(c)?!0:!1};k.ib=function(a,b){return Fd(new Ag(null,new u(null,5,[bi,null,ui,null,ij,null,lj,null,pj,null],null),null),b)?od.a(Pc(df.a(De,this),this.T),b):new ym(this.Sa,this.Ta,this.Va,this.Ua,this.Za,this.T,ye(od.a(this.G,b)),null)};
k.Oa=function(a,b,c){return v(T.a?T.a(ui,b):T.call(null,ui,b))?new ym(c,this.Ta,this.Va,this.Ua,this.Za,this.T,this.G,null):v(T.a?T.a(ij,b):T.call(null,ij,b))?new ym(this.Sa,c,this.Va,this.Ua,this.Za,this.T,this.G,null):v(T.a?T.a(bi,b):T.call(null,bi,b))?new ym(this.Sa,this.Ta,c,this.Ua,this.Za,this.T,this.G,null):v(T.a?T.a(pj,b):T.call(null,pj,b))?new ym(this.Sa,this.Ta,this.Va,c,this.Za,this.T,this.G,null):v(T.a?T.a(lj,b):T.call(null,lj,b))?new ym(this.Sa,this.Ta,this.Va,this.Ua,c,this.T,this.G,
null):new ym(this.Sa,this.Ta,this.Va,this.Ua,this.Za,this.T,md.c(this.G,b,c),null)};k.V=function(){return I(te.a(new O(null,5,5,Q,[new O(null,2,5,Q,[ui,this.Sa],null),new O(null,2,5,Q,[ij,this.Ta],null),new O(null,2,5,Q,[bi,this.Va],null),new O(null,2,5,Q,[pj,this.Ua],null),new O(null,2,5,Q,[lj,this.Za],null)],null),this.G))};k.R=function(a,b){return new ym(this.Sa,this.Ta,this.Va,this.Ua,this.Za,b,this.G,this.u)};k.X=function(a,b){return vd(b)?nb(this,eb.a(b,0),eb.a(b,1)):Xa.c(cb,this,b)};
function zm(a){for(;;){var b=a[4],c=ui.b(b),d=ij.b(b),e=a[5];if(v(function(){var a=e;return v(a)?Oa(b):a}()))throw e;if(v(function(){var a=e;return v(a)?(a=c,v(a)?e instanceof d:a):a}())){a[1]=c;a[2]=e;a[5]=null;a[4]=md.j(b,ui,null,F([ij,null],0));break}if(v(function(){var a=e;return v(a)?Oa(c)&&Oa(bi.b(b)):a}()))a[4]=lj.b(b);else{if(v(function(){var a=e;return v(a)?(a=Oa(c))?bi.b(b):a:a}())){a[1]=bi.b(b);a[4]=md.c(b,bi,null);break}if(v(function(){var a=Oa(e);return a?bi.b(b):a}())){a[1]=bi.b(b);
a[4]=md.c(b,bi,null);break}if(Oa(e)&&Oa(bi.b(b))){a[1]=pj.b(b);a[4]=lj.b(b);break}throw Error("No matching clause");}}};function Am(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function Bm(a,b,c,d){this.head=a;this.S=b;this.length=c;this.f=d}Bm.prototype.pop=function(){if(0===this.length)return null;var a=this.f[this.S];this.f[this.S]=null;this.S=(this.S+1)%this.f.length;--this.length;return a};Bm.prototype.unshift=function(a){this.f[this.head]=a;this.head=(this.head+1)%this.f.length;this.length+=1;return null};function Cm(a,b){a.length+1===a.f.length&&a.resize();a.unshift(b)}
Bm.prototype.resize=function(){var a=Array(2*this.f.length);return this.S<this.head?(Am(this.f,this.S,a,0,this.length),this.S=0,this.head=this.length,this.f=a):this.S>this.head?(Am(this.f,this.S,a,0,this.f.length-this.S),Am(this.f,0,a,this.f.length-this.S,this.head),this.S=0,this.head=this.length,this.f=a):this.S===this.head?(this.head=this.S=0,this.f=a):null};function Dm(a,b){for(var c=a.length,d=0;;)if(d<c){var e=a.pop();(b.b?b.b(e):b.call(null,e))&&a.unshift(e);d+=1}else break}
function Em(a){return new Bm(0,0,0,Array(a))}function Fm(a,b){this.L=a;this.n=b;this.g=2;this.C=0}function Gm(a){return a.L.length===a.n}Fm.prototype.Dc=function(a,b){Cm(this.L,b);return this};Fm.prototype.Y=function(){return this.L.length};var Hm;
function Im(){var a=aa.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==hm.indexOf("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=na(function(a){if(("*"==d||a.origin==
d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&-1==hm.indexOf("Trident")&&-1==hm.indexOf("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.vc;c.vc=null;a()}};return function(a){d.next={vc:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=
document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){aa.setTimeout(a,0)}};var Jm=Em(32),Km=!1,Lm=!1;Mm;function Nm(){Km=!0;Lm=!1;for(var a=0;;){var b=Jm.pop();if(null!=b&&(b.l?b.l():b.call(null),1024>a)){a+=1;continue}break}Km=!1;return 0<Jm.length?Mm.l?Mm.l():Mm.call(null):null}function Mm(){var a=Lm;if(v(v(a)?Km:a))return null;Lm=!0;!ea(aa.setImmediate)||aa.Window&&aa.Window.prototype&&aa.Window.prototype.setImmediate==aa.setImmediate?(Hm||(Hm=Im()),Hm(Nm)):aa.setImmediate(Nm)}function Om(a){Cm(Jm,a);Mm()}function Pm(a,b){setTimeout(a,b)};var Qm,Rm=function Rm(b){"undefined"===typeof Qm&&(Qm=function(b,d,e){this.Oc=b;this.H=d;this.md=e;this.g=425984;this.C=0},Qm.prototype.R=function(b,d){return new Qm(this.Oc,this.H,d)},Qm.prototype.P=function(){return this.md},Qm.prototype.Jb=function(){return this.H},Qm.ic=function(){return new O(null,3,5,Q,[Pc(Oi,new u(null,1,[Be,nc(Ce,nc(new O(null,1,5,Q,[$i],null)))],null)),$i,ua.Hd],null)},Qm.xb=!0,Qm.eb="cljs.core.async.impl.channels/t_cljs$core$async$impl$channels22136",Qm.Tb=function(b,d){return Nb(d,
"cljs.core.async.impl.channels/t_cljs$core$async$impl$channels22136")});return new Qm(Rm,b,De)};function Sm(a,b){this.Ub=a;this.H=b}function Tm(a){return om(a.Ub)}var Um=function Um(b){if(null!=b&&null!=b.Cc)return b.Cc();var c=Um[ca(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Um._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("MMC.abort",b);};function Vm(a,b,c,d,e,f,g){this.Gb=a;this.hc=b;this.sb=c;this.gc=d;this.L=e;this.closed=f;this.Ja=g}
Vm.prototype.Cc=function(){for(;;){var a=this.sb.pop();if(null!=a){var b=a.Ub;Om(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(b.Fa,b,a.H,a,this))}break}Dm(this.sb,Ie(!1));return nm(this)};
Vm.prototype.dc=function(a,b,c){var d=this;if(a=d.closed)return Rm(!a);if(v(function(){var a=d.L;return v(a)?Oa(Gm(d.L)):a}())){for(c=Sc(d.Ja.a?d.Ja.a(d.L,b):d.Ja.call(null,d.L,b));;){if(0<d.Gb.length&&0<M(d.L)){var e=d.Gb.pop(),f=e.Fa,g=d.L.L.pop();Om(function(a,b){return function(){return a.b?a.b(b):a.call(null,b)}}(f,g,e,c,a,this))}break}c&&Um(this);return Rm(!0)}e=function(){for(;;){var a=d.Gb.pop();if(v(a)){if(v(!0))return a}else return null}}();if(v(e))return c=pm(e),Om(function(a){return function(){return a.b?
a.b(b):a.call(null,b)}}(c,e,a,this)),Rm(!0);64<d.gc?(d.gc=0,Dm(d.sb,Tm)):d.gc+=1;Cm(d.sb,new Sm(c,b));return null};
Vm.prototype.pc=function(a,b){var c=this;if(null!=c.L&&0<M(c.L)){for(var d=b.Fa,e=Rm(c.L.L.pop());;){if(!v(Gm(c.L))){var f=c.sb.pop();if(null!=f){var g=f.Ub,h=f.H;Om(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(g.Fa,g,h,f,d,e,this));Sc(c.Ja.a?c.Ja.a(c.L,h):c.Ja.call(null,c.L,h))&&Um(this);continue}}break}return e}d=function(){for(;;){var a=c.sb.pop();if(v(a)){if(om(a.Ub))return a}else return null}}();if(v(d))return e=pm(d.Ub),Om(function(a){return function(){return a.b?a.b(!0):
a.call(null,!0)}}(e,d,this)),Rm(d.H);if(v(c.closed))return v(c.L)&&(c.Ja.b?c.Ja.b(c.L):c.Ja.call(null,c.L)),v(v(!0)?b.Fa:!0)?(d=function(){var a=c.L;return v(a)?0<M(c.L):a}(),d=v(d)?c.L.L.pop():null,Rm(d)):null;64<c.hc?(c.hc=0,Dm(c.Gb,om)):c.hc+=1;Cm(c.Gb,b);return null};
Vm.prototype.cc=function(){var a=this;if(!a.closed)for(a.closed=!0,v(function(){var b=a.L;return v(b)?0===a.sb.length:b}())&&(a.Ja.b?a.Ja.b(a.L):a.Ja.call(null,a.L));;){var b=a.Gb.pop();if(null==b)break;else{var c=b.Fa,d=v(function(){var b=a.L;return v(b)?0<M(a.L):b}())?a.L.L.pop():null;Om(function(a,b){return function(){return a.b?a.b(b):a.call(null,b)}}(c,d,b,this))}}return null};function Wm(a){console.log(a);return null}
function Xm(a,b){var c=(v(null)?null:Wm).call(null,b);return null==c?a:rm.a(a,c)}
function Ym(a){return new Vm(Em(32),0,Em(32),0,a,!1,function(){return function(a){return function(){function c(c,d){try{return a.a?a.a(c,d):a.call(null,c,d)}catch(e){return Xm(c,e)}}function d(c){try{return a.b?a.b(c):a.call(null,c)}catch(d){return Xm(c,d)}}var e=null,e=function(a,b){switch(arguments.length){case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};e.b=d;e.a=c;return e}()}(v(null)?null.b?null.b(rm):null.call(null,rm):rm)}())};function Zm(a,b,c){this.key=a;this.H=b;this.forward=c;this.g=2155872256;this.C=0}Zm.prototype.V=function(){return cb(cb(Bc,this.H),this.key)};Zm.prototype.M=function(a,b,c){return zf(b,Af,"["," ","]",c,this)};function $m(a,b,c){c=Array(c+1);for(var d=0;;)if(d<c.length)c[d]=null,d+=1;else break;return new Zm(a,b,c)}function an(a,b,c,d){for(;;){if(0>c)return a;a:for(;;){var e=a.forward[c];if(v(e))if(e.key<b)a=e;else break a;else break a}null!=d&&(d[c]=a);--c}}
function bn(a,b){this.ob=a;this.level=b;this.g=2155872256;this.C=0}bn.prototype.put=function(a,b){var c=Array(15),d=an(this.ob,a,this.level,c).forward[0];if(null!=d&&d.key===a)return d.H=b;a:for(d=0;;)if(.5>Math.random()&&15>d)d+=1;else break a;if(d>this.level){for(var e=this.level+1;;)if(e<=d+1)c[e]=this.ob,e+=1;else break;this.level=d}for(d=$m(a,b,Array(d));;)return 0<=this.level?(c=c[0].forward,d.forward[0]=c[0],c[0]=d):null};
bn.prototype.remove=function(a){var b=Array(15),c=an(this.ob,a,this.level,b).forward[0];if(null!=c&&c.key===a){for(a=0;;)if(a<=this.level){var d=b[a].forward;d[a]===c&&(d[a]=c.forward[a]);a+=1}else break;for(;;)if(0<this.level&&null==this.ob.forward[this.level])--this.level;else return null}else return null};function cn(a){for(var b=dn,c=b.ob,d=b.level;;){if(0>d)return c===b.ob?null:c;var e;a:for(e=c;;){e=e.forward[d];if(null==e){e=null;break a}if(e.key>=a)break a}null!=e?(--d,c=e):--d}}
bn.prototype.V=function(){return function(a){return function c(d){return new je(null,function(){return function(){return null==d?null:Zc(new O(null,2,5,Q,[d.key,d.H],null),c(d.forward[0]))}}(a),null,null)}}(this)(this.ob.forward[0])};bn.prototype.M=function(a,b,c){return zf(b,function(){return function(a){return zf(b,Af,""," ","",c,a)}}(this),"{",", ","}",c,this)};var dn=new bn($m(null,null,0),0);
function en(a){var b=(new Date).valueOf()+a,c=cn(b),d=v(v(c)?c.key<b+10:c)?c.H:null;if(v(d))return d;var e=Ym(null);dn.put(b,e);Pm(function(a,b,c){return function(){dn.remove(c);return nm(a)}}(e,d,b,c),a);return e};var fn=function fn(b){"undefined"===typeof km&&(km=function(b,d,e){this.sc=b;this.Fa=d;this.kd=e;this.g=393216;this.C=0},km.prototype.R=function(b,d){return new km(this.sc,this.Fa,d)},km.prototype.P=function(){return this.kd},km.prototype.Ec=function(){return!0},km.prototype.Fc=function(){return this.Fa},km.ic=function(){return new O(null,3,5,Q,[Pc(Nj,new u(null,2,[Rh,!0,Be,nc(Ce,nc(new O(null,1,5,Q,[fk],null)))],null)),fk,ua.Fd],null)},km.xb=!0,km.eb="cljs.core.async/t_cljs$core$async19305",km.Tb=
function(b,d){return Nb(d,"cljs.core.async/t_cljs$core$async19305")});return new km(fn,b,De)};function gn(a){a=pc.a(a,0)?null:a;return Ym("number"===typeof a?new Fm(Em(a),a):a)}function hn(a,b){var c=lm(a,fn(b));if(v(c)){var d=L.b?L.b(c):L.call(null,c);v(!0)?b.b?b.b(d):b.call(null,d):Om(function(a){return function(){return b.b?b.b(a):b.call(null,a)}}(d,c))}return null}var jn=fn(function(){return null});function kn(a,b){var c=mm(a,b,jn);return v(c)?L.b?L.b(c):L.call(null,c):!0}
function ln(a){var b=Kd(new O(null,1,5,Q,[mn],null)),c=gn(null),d=M(b),e=qe(d),f=gn(1),g=U.b?U.b(null):U.call(null,null),h=ef(function(a,b,c,d,e,f){return function(g){return function(a,b,c,d,e,f){return function(a){d[g]=a;return 0===Re.a(f,Rd)?kn(e,d.slice(0)):null}}(a,b,c,d,e,f)}}(b,c,d,e,f,g),new Ig(null,0,d,1,null)),l=gn(1);Om(function(b,c,d,e,f,g,h,l){return function(){var C=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!T(e,V)){d=e;break a}}}catch(f){if(f instanceof
Object)c[5]=f,zm(c),d=V;else throw f;}if(!T(d,V))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(b,c,d,e,f,g,h,l){return function(b){var f=b[1];if(7===f)return b[2]=null,b[1]=8,V;if(1===f)return b[2]=null,b[1]=2,V;if(4===f){var m=b[7],
f=m<e;b[1]=v(f)?6:7;return V}return 15===f?(f=b[2],b[2]=f,b[1]=3,V):13===f?(f=nm(d),b[2]=f,b[1]=15,V):6===f?(b[2]=null,b[1]=11,V):3===f?(f=b[2],xm(b,f)):12===f?(f=b[8],f=b[2],m=Ge(Ma,f),b[8]=f,b[1]=v(m)?13:14,V):2===f?(f=Qe.a?Qe.a(h,e):Qe.call(null,h,e),b[9]=f,b[7]=0,b[2]=null,b[1]=4,V):11===f?(m=b[7],b[4]=new ym(10,Object,null,9,b[4],null,null,null),f=c.b?c.b(m):c.call(null,m),m=l.b?l.b(m):l.call(null,m),f=hn(f,m),b[2]=f,zm(b),V):9===f?(m=b[7],b[10]=b[2],b[7]=m+1,b[2]=null,b[1]=4,V):5===f?(b[11]=
b[2],vm(b,12,g)):14===f?(f=b[8],f=D.a(a,f),wm(b,16,d,f)):16===f?(b[12]=b[2],b[2]=null,b[1]=2,V):10===f?(m=b[2],f=Re.a(h,Rd),b[13]=m,b[2]=f,zm(b),V):8===f?(f=b[2],b[2]=f,b[1]=5,V):null}}(b,c,d,e,f,g,h,l),b,c,d,e,f,g,h,l)}(),A=function(){var a=C.l?C.l():C.call(null);a[6]=b;return a}();return um(A)}}(l,b,c,d,e,f,g,h));return c};var nn=VDOM.diff,on=VDOM.patch,pn=VDOM.create;function qn(a){return bf(He(Ma),bf(He(Cd),cf(a)))}function rn(a,b,c){return new VDOM.VHtml(Yd(a),ch(b),ch(c))}function sn(a,b,c){return new VDOM.VSvg(Yd(a),ch(b),ch(c))}tn;
var un=function un(b){if(null==b)return new VDOM.VText("");if(Cd(b))return rn(Mi,De,R.a(un,qn(b)));if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(pc.a(mj,J(b)))return tn.b?tn.b(b):tn.call(null,b);var c=N(b,0),d=N(b,1);b=Xd(b,2);return rn(c,d,R.a(un,qn(b)))},tn=function tn(b){if(null==b)return new VDOM.VText("");if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(pc.a(ck,J(b))){var c=N(b,0),d=N(b,1);b=Xd(b,2);return sn(c,d,R.a(un,qn(b)))}c=N(b,0);d=N(b,
1);b=Xd(b,2);return sn(c,d,R.a(tn,qn(b)))};
function vn(){var a=document.body,b=function(){var a=new VDOM.VText("");return U.b?U.b(a):U.call(null,a)}(),c=function(){var a;a=L.b?L.b(b):L.call(null,b);a=pn.b?pn.b(a):pn.call(null,a);return U.b?U.b(a):U.call(null,a)}(),d=null==window.requestAnimationFrame?function(){return function(a){return a.l?a.l():a.call(null)}}(b,c):function(){return function(a){return window.requestAnimationFrame(a)}}(b,c);a.appendChild(L.b?L.b(c):L.call(null,c));return function(a,b,c){return function(d){var l=un(d);d=function(){var b=
L.b?L.b(a):L.call(null,a);return nn.a?nn.a(b,l):nn.call(null,b,l)}();Qe.a?Qe.a(a,l):Qe.call(null,a,l);d=function(a,b,c,d){return function(){return Re.c(d,on,b)}}(l,d,a,b,c);return c.b?c.b(d):c.call(null,d)}}(b,c,d)};var wn=Error();function xn(a){if(v(pc.a?pc.a(0,a):pc.call(null,0,a)))return id;if(v(pc.a?pc.a(1,a):pc.call(null,1,a)))return new O(null,1,5,Q,[new O(null,2,5,Q,[0,0],null)],null);if(v(pc.a?pc.a(2,a):pc.call(null,2,a)))return new O(null,2,5,Q,[new O(null,2,5,Q,[-1,-1],null),new O(null,2,5,Q,[1,1],null)],null);if(v(pc.a?pc.a(3,a):pc.call(null,3,a)))return new O(null,3,5,Q,[new O(null,2,5,Q,[-1,-1],null),new O(null,2,5,Q,[0,0],null),new O(null,2,5,Q,[1,1],null)],null);if(v(pc.a?pc.a(4,a):pc.call(null,4,a)))return new O(null,
4,5,Q,[new O(null,2,5,Q,[-1,-1],null),new O(null,2,5,Q,[-1,1],null),new O(null,2,5,Q,[1,-1],null),new O(null,2,5,Q,[1,1],null)],null);if(v(pc.a?pc.a(5,a):pc.call(null,5,a)))return new O(null,5,5,Q,[new O(null,2,5,Q,[-1,-1],null),new O(null,2,5,Q,[-1,1],null),new O(null,2,5,Q,[0,0],null),new O(null,2,5,Q,[1,-1],null),new O(null,2,5,Q,[1,1],null)],null);if(v(pc.a?pc.a(6,a):pc.call(null,6,a)))return new O(null,6,5,Q,[new O(null,2,5,Q,[-1,-1],null),new O(null,2,5,Q,[-1,0],null),new O(null,2,5,Q,[-1,1],
null),new O(null,2,5,Q,[1,-1],null),new O(null,2,5,Q,[1,0],null),new O(null,2,5,Q,[1,1],null)],null);throw Error([z("No matching clause: "),z(a)].join(""));}var yn=Mg(function(a){return a.x},function(a){return a.y});
function zn(a){var b=N(a,0),c=N(a,1),d=Math.ceil(Math.sqrt(4)),e=b/d,f=c/d;return function(a,b,c,d,e,f,q){return function t(w){return new je(null,function(a,b,c,d,e,f,g){return function(){for(var h=w;;){var l=I(h);if(l){var m=l,n=J(m);if(l=I(function(a,b,c,d,e,f,g,h,l,m,n){return function Ra(p){return new je(null,function(a,b,c,d,e,f,g,h){return function(){for(;;){var a=I(p);if(a){if(yd(a)){var c=Zb(a),d=M(c),e=ne(d);a:for(var l=0;;)if(l<d){var m=eb.a(c,l),m=md.j(h,Dj,m*f,F([uh,b*g],0));e.add(m);
l+=1}else{c=!0;break a}return c?oe(e.O(),Ra($b(a))):oe(e.O(),null)}e=J(a);return Zc(md.j(h,Dj,e*f,F([uh,b*g],0)),Ra(Ac(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n),null,null)}}(h,n,m,l,a,b,c,d,e,f,g)(new Ig(null,0,a,1,null))))return te.a(l,t(Ac(h)));h=Ac(h)}else return null}}}(a,b,c,d,e,f,q),null,null)}}(d,e,f,new u(null,2,[ki,e,Yj,f],null),a,b,c)(new Ig(null,0,d,1,null))}var An=Mg(Ke(D,Td),Ke(D,Sd));
function Bn(a,b){var c=N(a,0),d=N(a,1),e=N(b,0),f=N(b,1),g=pc.a(c,d)?new O(null,2,5,Q,[0,1],null):new O(null,2,5,Q,[c,d],null),h=N(g,0),l=N(g,1),m=(f-e)/(l-h);return function(a,b,c,d,e){return function(a){return d*a+e}}(g,h,l,m,f-m*l,a,c,d,b,e,f)}
var Cn=function Cn(b,c){return pc.a(1,b)?R.a(nc,c):new je(null,function(){var d=I(c);if(d){var e=N(d,0),f=Xd(d,1);return te.a(function(){return function(b,c,d,e){return function p(f){return new je(null,function(b,c){return function(){for(;;){var b=I(f);if(b){if(yd(b)){var d=Zb(b),e=M(d),g=ne(e);a:for(var h=0;;)if(h<e){var l=eb.a(d,h),l=Zc(c,l);g.add(l);h+=1}else{d=!0;break a}return d?oe(g.O(),p($b(b))):oe(g.O(),null)}g=J(b);return Zc(Zc(c,g),p(Ac(b)))}return null}}}(b,c,d,e),null,null)}}(d,e,f,d)(Cn(b-
1,f))}(),Cn(b,f))}return null},null,null)};
function Dn(a){function b(a){var b=qc;I(a)?(a=Jd.b?Jd.b(a):Jd.call(null,a),b=Id(b),ta(a,b),a=I(a)):a=Bc;b=N(a,0);a=N(a,1);var c=(a-b)/2,b=[b,b-c,a,a+c];a=[];for(c=0;;)if(c<b.length){var g=b[c],h=b[c+1];-1===Qf(a,g)&&(a.push(g),a.push(h));c+=2}else break;return new u(null,a.length/2,a,null)}for(;;){var c=fd(D.c(Fg,J,bf(function(){return function(a){return 0<J(a)&&10>J(a)}}(a,b),R.a(function(){return function(a){var b=Q,c=D.a(Od,a);return new O(null,2,5,b,[Math.abs(c),a],null)}}(a,b),Cn(2,a)))));if(v(c))a=
Cg(b(c),a);else return a}};var En=U.b?U.b(De):U.call(null,De);function Fn(a){return Re.o(En,md,Yg("animation"),a)}
function Gn(){var a=1E3/30,b=gn(1);Om(function(a,b){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!T(e,V)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,zm(c),d=V;else throw f;}if(!T(d,V))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(a,b){return function(a){var c=a[1];if(7===c)return c=a,c[2]=a[2],c[1]=4,V;if(20===c){var c=a[7],d=a[8],e=J(d),d=N(e,0),e=N(e,1),c=e.b?e.b(c):e.call(null,c);a[9]=d;a[1]=v(c)?22:23;return V}if(1===c)return c=en(0),vm(a,2,c);if(24===c){var d=a[8],e=a[2],c=K(d),f;a[10]=c;a[11]=0;a[12]=0;a[13]=null;a[14]=e;a[2]=null;a[1]=8;return V}if(4===c)return c=a[2],xm(a,c);if(15===c){c=a[10];f=a[11];var e=
a[12],d=a[13],g=a[2];a[10]=c;a[11]=f;a[12]=e+1;a[13]=d;a[15]=g;a[2]=null;a[1]=8;return V}return 21===c?(c=a[2],a[2]=c,a[1]=18,V):13===c?(a[2]=null,a[1]=15,V):22===c?(a[2]=null,a[1]=24,V):6===c?(a[2]=null,a[1]=7,V):25===c?(c=a[7],d=a[2],a[7]=c+b,a[16]=d,a[2]=null,a[1]=3,V):17===c?(a[2]=null,a[1]=18,V):3===c?(c=L.b?L.b(En):L.call(null,En),c=I(c),a[1]=c?5:6,V):12===c?(c=a[2],a[2]=c,a[1]=9,V):2===c?(c=a[2],a[7]=0,a[17]=c,a[2]=null,a[1]=3,V):23===c?(d=a[9],c=Re.c(En,od,d),a[2]=c,a[1]=24,V):19===c?(d=a[8],
c=Zb(d),d=$b(d),e=M(c),a[10]=d,a[11]=e,a[12]=0,a[13]=c,a[2]=null,a[1]=8,V):11===c?(c=a[10],c=I(c),a[8]=c,a[1]=c?16:17,V):9===c?(c=a[2],d=en(b),a[18]=c,vm(a,25,d)):5===c?(c=L.b?L.b(En):L.call(null,En),c=I(c),a[10]=c,a[11]=0,a[12]=0,a[13]=null,a[2]=null,a[1]=8,V):14===c?(d=a[19],c=Re.c(En,od,d),a[2]=c,a[1]=15,V):16===c?(d=a[8],c=yd(d),a[1]=c?19:20,V):10===c?(c=a[7],e=a[12],d=a[13],e=eb.a(d,e),d=N(e,0),e=N(e,1),c=e.b?e.b(c):e.call(null,c),a[19]=d,a[1]=v(c)?13:14,V):18===c?(c=a[2],a[2]=c,a[1]=12,V):8===
c?(f=a[11],e=a[12],c=e<f,a[1]=v(c)?10:11,V):null}}(a,b),a,b)}(),f=function(){var b=e.l?e.l():e.call(null);b[6]=a;return b}();return um(f)}}(b,a));return b}function Hn(a){return a*a}function In(a,b,c){var d=null!=c&&(c.g&64||c.F)?D.a(Mc,c):c,e=E.c(d,Sj,0),f=E.a(d,vi),g=E.c(d,si,Ld);return function(c,d,e,f,g){return function(c){if(c<=e)return!0;if(c<e+f)return c=(c-e)/f,c=g.b?g.b(c):g.call(null,c),b.a?b.a(a,c):b.call(null,a,c),!0;b.a?b.a(a,1):b.call(null,a,1);return!1}}(c,d,e,f,g)}
function Jn(a,b){return function(c){return Fn(In(c,a,b))}}function Kn(a,b,c){return function(d){var e=function(c){return function(e,h){var l,m=a.getPointAtLength(h*c);l=yn.b?yn.b(m):yn.call(null,m);m=N(l,0);l=N(l,1);m=new O(null,2,5,Q,[m,l],null);return b.a?b.a(d,m):b.call(null,d,m)}}(a.getTotalLength());return Fn(In(d,e,c))}};function Ln(){var a=Mn,b=Nn,c=On,d=gn(null);kn(d,b);var e=gn(1);Om(function(d,e){return function(){var h=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!T(e,V)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,zm(c),d=V;else throw f;}if(!T(d,V))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,
a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(d,e){return function(d){var f=d[1];if(1===f)return vm(d,2,c);if(2===f){var f=b,g=d[2];d[7]=f;d[8]=g;d[2]=null;d[1]=3;return V}return 3===f?(f=d[9],f=d[7],g=d[8],f=a.a?a.a(f,g):a.call(null,f,g),g=kn(e,f),d[10]=g,d[9]=f,vm(d,5,c)):4===f?(f=d[2],xm(d,f)):5===f?(f=d[9],g=d[2],d[7]=f,d[8]=g,d[2]=null,d[1]=3,V):null}}(d,e),d,e)}(),l=function(){var a=h.l?h.l():h.call(null);a[6]=d;return a}();return um(l)}}(e,d));return d}
function Pn(){var a=Qn,b=vn(),c=gn(1);Om(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!T(e,V)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,zm(c),d=V;else throw f;}if(!T(d,V))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.l=c;d.b=b;return d}()}(function(){return function(c){var d=c[1];return 1===d?(c[2]=null,c[1]=2,V):2===d?vm(c,4,a):3===d?(d=c[2],xm(c,d)):4===d?(d=c[7],d=c[2],c[7]=d,c[1]=v(d)?5:6,V):5===d?(d=c[7],d=b.b?b.b(d):b.call(null,d),c[8]=d,c[2]=null,c[1]=2,V):6===d?(c[2]=null,c[1]=7,V):7===d?(d=c[2],c[2]=d,c[1]=3,V):null}}(c),c)}(),f=function(){var a=e.l?e.l():e.call(null);a[6]=c;return a}();return um(f)}}(c));return c};var Rn,Sn=new u(null,3,[Rj,250,Vi,500,ii,500],null);Rn=U.b?U.b(Sn):U.call(null,Sn);function Tn(a){return document.querySelector([z("#"),z(a),z(" .penny-path")].join(""))}function Un(a){return document.querySelector([z("#"),z(a),z(" .ramp")].join(""))};function Vn(a){this.Fa=a}Vn.prototype.hd=function(a){return this.Fa.b?this.Fa.b(a):this.Fa.call(null,a)};ba("Hook",Vn);ba("Hook.prototype.hook",Vn.prototype.hd);function Wn(a){var b=N(a,0);a=N(a,1);return[z(b),z(","),z(a)].join("")}function Xn(a,b,c){var d=N(a,0);N(a,1);a=N(b,0);var e=N(b,1);b=N(c,0);c=N(c,1);var d=d-a,f=(e-c)/2*(d/Math.abs(d)),g=f/2,d=new O(null,2,5,Q,[a+f,e],null);a=new O(null,2,5,Q,[a-g,e],null);e=new O(null,2,5,Q,[b-g,c],null);b=new O(null,2,5,Q,[b+f,c],null);return[z("L"),z(Wn(d)),z("C"),z(Wn(a)),z(","),z(Wn(e)),z(","),z(Wn(b))].join("")}function Yn(a){return I(a)?D.c(z,"M",Ze(R.a(Wn,a))):null}
function Zn(a,b){return[z("translate("),z(a),z(","),z(b),z(")")].join("")}
function $n(a){var b=null!=a&&(a.g&64||a.F)?D.a(Mc,a):a,c=E.a(b,ki),d=E.a(b,Yj),e=E.a(b,Dj),f=E.a(b,uh),g=E.a(b,ei),h=c/2;return new O(null,4,5,Q,[Qi,new u(null,1,[Gh,Zn(h,h)],null),new O(null,2,5,Q,[Qj,new u(null,5,[ej,"die",Dj,-h,uh,-h,ki,c,Yj,c],null)],null),function(){return function(a,b,c,d,e,f,g,h,y){return function A(G){return new je(null,function(a,b,c,d,e){return function(){for(;;){var b=I(G);if(b){if(yd(b)){var c=Zb(b),d=M(c),f=ne(d);a:for(var g=0;;)if(g<d){var h=eb.a(c,g),l=N(h,0),h=N(h,
1),l=new O(null,2,5,Q,[hi,new u(null,3,[cj,a.b?a.b(l):a.call(null,l),hj,a.b?a.b(h):a.call(null,h),Ch,e/10],null)],null);f.add(l);g+=1}else{c=!0;break a}return c?oe(f.O(),A($b(b))):oe(f.O(),null)}c=J(b);f=N(c,0);c=N(c,1);return Zc(new O(null,2,5,Q,[hi,new u(null,3,[cj,a.b?a.b(f):a.call(null,f),hj,a.b?a.b(c):a.call(null,c),Ch,e/10],null)],null),A(Ac(b)))}return null}}}(a,b,c,d,e,f,g,h,y),null,null)}}(Ke(Pd,c/4),h,a,b,c,d,e,f,g)(xn(g))}()],null)}
function ao(a,b){for(var c=a-10,d=id,e=!0,f=b-10;;)if(0<f)d=te.a(d,e?new O(null,2,5,Q,[new O(null,2,5,Q,[c,f],null),new O(null,2,5,Q,[10,f],null)],null):new O(null,2,5,Q,[new O(null,2,5,Q,[10,f],null),new O(null,2,5,Q,[c,f],null)],null)),e=!e,f-=20;else{c=Q;a:for(e=N(d,0),f=Xd(d,1),d=[z("M"),z(Wn(e))].join(""),N(f,0),N(f,1),Xd(f,2);;){var g=f,h=N(g,0),f=N(g,1),g=Xd(g,2),l;l=h;v(l)&&(l=f,l=v(l)?I(g):l);if(v(l))d=[z(d),z(Xn(e,h,f))].join(""),e=f,f=g;else{d=v(h)?[z(d),z("L"),z(Wn(h))].join(""):d;break a}}return new O(null,
2,5,c,[vh,new u(null,2,[ej,"penny-path",zj,d],null)],null)}}function bo(a,b,c){a=a.getPointAtLength(c*b+20);return yn.b?yn.b(a):yn.call(null,a)}function co(a,b,c){var d=N(a,0);a=N(a,1);return new O(null,4,5,Q,[Qi,new u(null,2,[Gh,Zn(d,a),qj,v(c)?new Vn(c):null],null),new O(null,2,5,Q,[hi,new u(null,2,[ej,"penny",Ch,8],null)],null),v(b)?new O(null,2,5,Q,[hi,new u(null,2,[ej,"tracer",Ch,4],null)],null):null],null)}
function eo(a,b,c){var d=null!=c&&(c.g&64||c.F)?D.a(Mc,c):c,e=E.a(d,Uj),f=E.a(d,Zj),g=E.a(d,Lh),h=E.a(d,Oh);return cb(cb(Bc,function(){var a=d.b?d.b(vh):d.call(null,vh);return v(a)?cb(cb(Bc,fe(Me(function(a,b,c,d,e,f,g,h,l){return function(A,G){var H=null!=G&&(G.g&64||G.F)?D.a(Mc,G):G,ja=E.a(H,ji),B=function(a,b,c,d,e,f,g,h,l,m){return function(a){return bo(d,a,m)}}(G,H,ja,a,b,c,d,e,f,g,h,l);return co(B(A),ja,0<h?Jn(function(a,b,c,d,e,f,g,h,l,m,n,p){return function(b,c){var d;d=A-c*p;d=-1>d?-1:d;
var e=a(d),f=N(e,0),e=N(e,1);b.setAttribute("transform",Zn(f,e));return pc.a(-1,d)?b.setAttribute("transform","scale(0)"):null}}(B,G,H,ja,a,b,c,d,e,f,g,h,l),new u(null,1,[vi,(L.b?L.b(Rn):L.call(null,Rn)).call(null,Vi)],null)):null)}}(a,a,c,d,d,e,f,g,h),e))),fe(Me(function(){return function(a,b,c,d,e,f,g,h,l,A){return function(G,H){var ja=null!=H&&(H.g&64||H.F)?D.a(Mc,H):H,B=E.a(ja,ji),Y=bo(b,a+G,h),ha=N(Y,0),P=N(Y,1);return co(new O(null,2,5,Q,[ha,A],null),B,Jn(function(a,b,c,d,e,f,g,h,l,m,n,p,q,
r,t,w,y){return function(a,c){return a.setAttribute("transform",Zn(b,y+c*d))}}(Y,ha,P,P-A,H,ja,B,a,b,c,d,e,f,g,h,l,A),new u(null,3,[vi,(L.b?L.b(Rn):L.call(null,Rn)).call(null,ii),Sj,50*G,si,Hn],null)))}}(M(e),a,a,c,d,d,e,f,g,h)}(),d.b?d.b(Ji):d.call(null,Ji)))):null}()),ao(a,b))}
function fo(a,b){var c=b-20,d=Q,e=Zn(0,a),c=[z(Yn(new O(null,6,5,Q,[new O(null,2,5,Q,[b,-20],null),new O(null,2,5,Q,[b,23],null),new O(null,2,5,Q,[0,23],null),new O(null,2,5,Q,[0,3],null),new O(null,2,5,Q,[c,3],null),new O(null,2,5,Q,[c,-20],null)],null))),z("Z")].join("");return new O(null,2,5,d,[vh,new u(null,3,[ej,"spout",Gh,e,zj,c],null)],null)}
if("undefined"===typeof go){var go,ho=U.b?U.b(De):U.call(null,De),io=U.b?U.b(De):U.call(null,De),jo=U.b?U.b(De):U.call(null,De),ko=U.b?U.b(De):U.call(null,De),lo=E.c(De,Mj,gh());go=new rh(xc.a("pennygame.ui","station"),ti,ai,lo,ho,io,jo,ko)}th(go,li,function(a){var b=null!=a&&(a.g&64||a.F)?D.a(Mc,a):a;a=E.a(b,ki);E.a(b,nj);b=E.a(b,Oh);return fo(b,a)});
th(go,Mh,function(a){var b=null!=a&&(a.g&64||a.F)?D.a(Mc,a):a;a=E.a(b,ki);var c=E.a(b,nj),b=cb(cb(cb(Bc,fo(b.b?b.b(Oh):b.call(null,Oh),a)),eo(a,c,new u(null,6,[Uj,b.b?b.b(Uj):b.call(null,Uj),Zj,b.b?b.b(wh):b.call(null,wh),Lh,v(b.b?b.b(xi):b.call(null,xi))?b.b?b.b(Qh):b.call(null,Qh):0,Ji,v(b.b?b.b(Bj):b.call(null,Bj))?b.b?b.b(Vj):b.call(null,Vj):null,vh,Tn(b.b?b.b(dj):b.call(null,dj)),Oh,b.b?b.b(ni):b.call(null,ni)],null))),new O(null,2,5,Q,[Qj,new u(null,3,[ej,"bin",ki,a,Yj,c],null)],null));a:for(var d=
id,e=!0,c=c-20;;)if(0<c)d=hd.a(d,new O(null,2,5,Q,[Yi,new u(null,4,[ej,"shelf",Gh,Zn(0,c),Ej,e?20:0,Tj,e?a:a-20],null)],null)),e=!e,c-=20;else{a=new O(null,3,5,Q,[Qi,De,D.a(nc,d)],null);break a}return cb(b,a)});
th(go,sj,function(a){var b=null!=a&&(a.g&64||a.F)?D.a(Mc,a):a,c=E.a(b,ki),d=E.a(b,dj),e=E.a(b,nj),f=E.a(b,ni);return cb(cb(cb(Bc,new O(null,2,5,Q,[yj,new u(null,3,[kj,truckSrc,ki,c,Yj,e],null)],null)),new O(null,2,5,Q,[vh,new u(null,2,[ej,"ramp",zj,[z("M"),z(Wn(new O(null,2,5,Q,[10,f],null))),z("C"),z(Wn(new O(null,2,5,Q,[10,e/2],null))),z(","),z(Wn(new O(null,2,5,Q,[10,e/2],null))),z(","),z(Wn(new O(null,2,5,Q,[c/2,e/2],null)))].join("")],null)],null)),function(){var g=Un(d);return v(v(g)?b.b?b.b(Bj):
b.call(null,Bj):g)?Me(function(a,b,c,d,e,f,g,t){return function(w,y){var C=null!=y&&(y.g&64||y.F)?D.a(Mc,y):y,A=E.a(C,ji);return co(new O(null,2,5,Q,[10,t],null),A,Kn(a,function(){return function(a,b){var c=N(b,0),d=N(b,1);return a.setAttribute("transform",Zn(c,d))}}(y,C,A,a,b,c,d,e,f,g,t),new u(null,3,[vi,(L.b?L.b(Rn):L.call(null,Rn)).call(null,ii),Sj,50*w,si,Hn],null)))}}(g,a,b,b,c,d,e,f),b.b?b.b(Vj):b.call(null,Vj)):null}())});
function mo(a){var b=null!=a&&(a.g&64||a.F)?D.a(Mc,a):a,c=E.a(b,Dj),d=E.a(b,Jh),e=E.a(b,Ph);return v(v(c)?d:c)?new O(null,3,5,Q,[Qi,new u(null,2,[ej,[z("scenario "),z(Yd(d))].join(""),Gh,Zn(c,0)],null),function(){return function(a,b,c,d,e){return function p(q){return new je(null,function(){return function(){for(;;){var a=I(q);if(a){if(yd(a)){var b=Zb(a),c=M(b),d=ne(c);a:for(var e=0;;)if(e<c){var f=eb.a(b,e),g=null!=f&&(f.g&64||f.F)?D.a(Mc,f):f,f=g,h=E.a(g,Wj),h=null!=h&&(h.g&64||h.F)?D.a(Mc,h):h,
h=E.a(h,ti),l=E.a(g,dj),g=E.a(g,uh),f=new O(null,3,5,Q,[Qi,new u(null,3,[dj,l,ej,[z(Yd(h)),z(" productivity-"),z(Yd(h))].join(""),Gh,Zn(0,g)],null),go.b?go.b(f):go.call(null,f)],null);d.add(f);e+=1}else{b=!0;break a}return b?oe(d.O(),p($b(a))):oe(d.O(),null)}d=J(a);d=b=null!=d&&(d.g&64||d.F)?D.a(Mc,d):d;c=E.a(b,Wj);c=null!=c&&(c.g&64||c.F)?D.a(Mc,c):c;c=E.a(c,ti);e=E.a(b,dj);b=E.a(b,uh);return Zc(new O(null,3,5,Q,[Qi,new u(null,3,[dj,e,ej,[z(Yd(c)),z(" productivity-"),z(Yd(c))].join(""),Gh,Zn(0,b)],
null),go.b?go.b(d):go.call(null,d)],null),p(Ac(a)))}return null}}}(a,b,c,d,e),null,null)}}(a,b,c,d,e)(fe(e))}()],null):null}
function no(a,b,c){if(I(a)){var d=Dn(R.a(function(a){return fd(gd(Zh.b(a)))},a));return function(a){return function g(d){return new je(null,function(){return function(){for(var a=d;;)if(a=I(a)){if(yd(a)){var e=Zb(a),n=M(e),p=ne(n);return function(){for(var a=0;;)if(a<n){var d=eb.a(e,a),g=N(d,0),g=null!=g&&(g.g&64||g.F)?D.a(Mc,g):g,h=E.a(g,Zh),g=E.a(g,ek),l=N(d,1),d=gd(h),q=N(d,0);v(q)&&(d=p,h=Q,l=new u(null,3,[ej,[z("label "),z(c)].join(""),Gh,Zn(q,l),pi,4],null),g=fd(gd(g)),g=b.b?b.b(g):b.call(null,
g),d.add(new O(null,3,5,h,[dk,l,g],null)));a+=1}else return!0}()?oe(p.O(),g($b(a))):oe(p.O(),null)}var q=J(a),r=N(q,0),t=null!=r&&(r.g&64||r.F)?D.a(Mc,r):r,r=E.a(t,Zh),w=E.a(t,ek),q=N(q,1),r=gd(r),r=N(r,0);if(v(r))return Zc(new O(null,3,5,Q,[dk,new u(null,3,[ej,[z("label "),z(c)].join(""),Gh,Zn(r,q),pi,4],null),function(){var a=fd(gd(w));return b.b?b.b(a):b.call(null,a)}()],null),g(Ac(a)));a=Ac(a)}else return null}}(a),null,null)}}(d)(R.c(Df,a,d))}return null}
function oo(a,b,c,d){var e=null!=a&&(a.g&64||a.F)?D.a(Mc,a):a,f=E.a(e,ki),g=E.a(e,Yj),h=E.a(e,Dj),l=E.a(e,uh),m=null!=d&&(d.g&64||d.F)?D.a(Mc,d):d,n=E.a(m,Ei),p=E.a(m,Xj),q=E.a(m,Fi),r=E.c(m,di,Ld),t=g-60,w=function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){return function La(t){return new je(null,function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){return function(){for(var w=t;;){var y=I(w);if(y){var A=y;if(yd(A)){var B=Zb(A),C=M(B),H=ne(C);return function(){for(var t=0;;)if(t<C){var G=eb.a(B,t),P=null!=
G&&(G.g&64||G.F)?D.a(Mc,G):G,S=E.a(P,Jh),Y=E.a(P,Nh);v(S)&&pe(H,new u(null,2,[Jh,S,ek,Me(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,B,C,G,H){return function(a,b){return new O(null,2,5,Q,[a,H.b?H.b(b):H.call(null,b)],null)}}(t,w,G,P,S,Y,B,C,H,A,y,a,b,c,d,e,f,g,h,l,m,n,p,q,r),Y)],null));t+=1}else return!0}()?oe(H.O(),La($b(A))):oe(H.O(),null)}var G=J(A),P=null!=G&&(G.g&64||G.F)?D.a(Mc,G):G,S=E.a(P,Jh),Y=E.a(P,Nh);if(v(S))return Zc(new u(null,2,[Jh,S,ek,Me(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,
y,A){return function(a,b){return new O(null,2,5,Q,[a,A.b?A.b(b):A.call(null,b)],null)}}(w,G,P,S,Y,A,y,a,b,c,d,e,f,g,h,l,m,n,p,q,r),Y)],null),La(Ac(A)));w=Ac(A)}else return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r),null,null)}}(30,t,a,e,f,g,h,l,d,m,n,p,q,r)(b)}(),y=af(ek,F([w],0)),C=te.a(p,Ue(M(p),function(){var a=R.a(fd,y);return An.b?An.b(a):An.call(null,a)}())),A=Bn(function(){var a=R.a(J,y);return An.b?An.b(a):An.call(null,a)}(),new O(null,2,5,Q,[0,f-60],null)),G=Bn(C,new O(null,2,5,Q,[t,0],null)),
H=function(a,b,c,d,e,f,g){return function(a,b){return new O(null,2,5,Q,[f.b?f.b(a):f.call(null,a),g.b?g.b(b):g.call(null,b)],null)}}(30,t,w,y,C,A,G,a,e,f,g,h,l,d,m,n,p,q,r),ja=R.a(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,B,C){return function(G){return md.c(G,Zh,R.a(function(a,b,c,d,e,f,g,h){return function(a){return D.a(h,a)}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,B,C),G.b?G.b(ek):G.call(null,ek)))}}(30,t,w,y,C,A,G,H,a,e,f,g,h,l,d,m,n,p,q,r),w),B=function(){return function(a,b,c,d,e,f,g,h,l,m,n,
p,q,r,t,w,y,A,B,C,G){return function Fk(H){return new je(null,function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,B,C,G){return function(){for(;;){var P=I(H);if(P){var S=P;if(yd(S)){var Y=Zb(S),W=M(Y),Z=ne(W);return function(){for(var H=0;;)if(H<W){var ha=eb.a(Y,H),da=N(ha,0),ia=N(ha,1),ma=Me(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,B,C,G,H,P,S,Y,W,Z){return function(a,b){return new O(null,2,5,Q,[a,Z.b?Z.b(b):Z.call(null,b)],null)}}(H,ha,da,ia,Y,W,Z,S,P,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,B,C,G),ia);
pe(Z,new u(null,3,[Jh,function(){var a=new u(null,4,[xj,fj,Sh,fi,wi,gj,Ij,Hj],null);return da.b?da.b(a):da.call(null,a)}(),ek,ma,Zh,R.a(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A){return function(a){return D.a(A,a)}}(H,ma,ha,da,ia,Y,W,Z,S,P,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,B,C,G),ma)],null));H+=1}else return!0}()?oe(Z.O(),Fk($b(S))):oe(Z.O(),null)}var ha=J(S),da=N(ha,0),ia=N(ha,1),ma=Me(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,B,C,G,H,P){return function(a,b){return new O(null,2,5,Q,[a,P.b?
P.b(b):P.call(null,b)],null)}}(ha,da,ia,S,P,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,B,C,G),ia);return Zc(new u(null,3,[Jh,function(){var a=new u(null,4,[xj,fj,Sh,fi,wi,gj,Ij,Hj],null);return da.b?da.b(a):da.call(null,a)}(),ek,ma,Zh,R.a(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){return function(a){return D.a(r,a)}}(ma,ha,da,ia,S,P,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,B,C,G),ma)],null),Fk(Ac(S)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,B,C,G),null,null)}}(30,t,w,y,C,A,G,H,ja,a,e,f,g,h,l,d,m,n,p,q,
r)(c)}();return new O(null,5,5,Q,[Qi,new u(null,2,[ej,[z("graph "),z(v(c)?"averaging":null)].join(""),Gh,Zn(h,l)],null),new O(null,2,5,Q,[Qj,new u(null,2,[ki,f,Yj,g],null)],null),new O(null,3,5,Q,[dk,new u(null,4,[ej,"title",Dj,f/2,uh,g/2,pi,10],null),q],null),new O(null,9,5,Q,[Qi,new u(null,1,[Gh,Zn(30,30)],null),function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,B,C,G,H){return function Nc(ja){return new je(null,function(){return function(){for(;;){var a=I(ja);if(a){if(yd(a)){var b=
Zb(a),c=M(b),d=ne(c);a:for(var e=0;;)if(e<c){var f=eb.a(b,e),g=null!=f&&(f.g&64||f.F)?D.a(Mc,f):f,f=E.a(g,Jh),g=E.a(g,Zh),f=new O(null,2,5,Q,[vh,new u(null,2,[ej,[z("average "),z(Yd(f))].join(""),zj,Yn(g)],null)],null);d.add(f);e+=1}else{b=!0;break a}return b?oe(d.O(),Nc($b(a))):oe(d.O(),null)}d=J(a);b=null!=d&&(d.g&64||d.F)?D.a(Mc,d):d;d=E.a(b,Jh);b=E.a(b,Zh);return Zc(new O(null,2,5,Q,[vh,new u(null,2,[ej,[z("average "),z(Yd(d))].join(""),zj,Yn(b)],null)],null),Nc(Ac(a)))}return null}}}(a,b,c,d,
e,f,g,h,l,m,n,p,q,r,t,w,y,A,B,C,G,H),null,null)}}(30,t,w,y,C,A,G,H,ja,B,a,e,f,g,h,l,d,m,n,p,q,r)(B)}(),function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,B,C,G,H){return function Nc(ja){return new je(null,function(){return function(){for(;;){var a=I(ja);if(a){if(yd(a)){var b=Zb(a),c=M(b),d=ne(c);a:for(var e=0;;)if(e<c){var f=eb.a(b,e),f=null!=f&&(f.g&64||f.F)?D.a(Mc,f):f;E.a(f,Jh);f=E.a(f,Zh);f=new O(null,2,5,Q,[vh,new u(null,2,[ej,"history stroke",zj,Yn(f)],null)],null);d.add(f);e+=1}else{b=
!0;break a}return b?oe(d.O(),Nc($b(a))):oe(d.O(),null)}d=J(a);d=null!=d&&(d.g&64||d.F)?D.a(Mc,d):d;E.a(d,Jh);d=E.a(d,Zh);return Zc(new O(null,2,5,Q,[vh,new u(null,2,[ej,"history stroke",zj,Yn(d)],null)],null),Nc(Ac(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,B,C,G,H),null,null)}}(30,t,w,y,C,A,G,H,ja,B,a,e,f,g,h,l,d,m,n,p,q,r)(ja)}(),function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,B,C,G,H){return function Nc(ja){return new je(null,function(){return function(){for(;;){var a=
I(ja);if(a){if(yd(a)){var b=Zb(a),c=M(b),d=ne(c);a:for(var e=0;;)if(e<c){var f=eb.a(b,e),g=null!=f&&(f.g&64||f.F)?D.a(Mc,f):f,f=E.a(g,Jh),g=E.a(g,Zh),f=new O(null,2,5,Q,[vh,new u(null,2,[ej,[z("history "),z(Yd(f))].join(""),zj,Yn(g)],null)],null);d.add(f);e+=1}else{b=!0;break a}return b?oe(d.O(),Nc($b(a))):oe(d.O(),null)}d=J(a);b=null!=d&&(d.g&64||d.F)?D.a(Mc,d):d;d=E.a(b,Jh);b=E.a(b,Zh);return Zc(new O(null,2,5,Q,[vh,new u(null,2,[ej,[z("history "),z(Yd(d))].join(""),zj,Yn(b)],null)],null),Nc(Ac(a)))}return null}}}(a,
b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,y,A,B,C,G,H),null,null)}}(30,t,w,y,C,A,G,H,ja,B,a,e,f,g,h,l,d,m,n,p,q,r)(ja)}(),no(ja,r,"history"),no(B,r,"average"),new O(null,2,5,Q,[Yi,new u(null,3,[ej,"axis",Gh,Zn(0,t),Tj,f-60],null)],null),new O(null,2,5,Q,[Yi,new u(null,2,[ej,"axis",Jj,t],null)],null)],null)],null)}
function po(a,b,c){a=zn(a);var d=N(a,0),e=N(a,1),f=N(a,2),g=N(a,3);return new O(null,6,5,Q,[Qi,new u(null,1,[dj,"graphs"],null),oo(d,b,c,new u(null,4,[Fi,"Work in Progress",Ei,Ai,Xj,new O(null,1,5,Q,[0],null),di,function(){return function(a){return Math.round(a)}}(a,d,e,f,g)],null)),oo(e,b,c,new u(null,3,[Fi,"Total Output",Ei,ri,di,function(){return function(a){return Math.round(a)}}(a,d,e,f,g)],null)),oo(f,b,c,new u(null,3,[Fi,"Inventory Turns",Ei,Fh,di,function(){return function(a){return Math.round(a)}}(a,
d,e,f,g)],null)),oo(g,b,c,new u(null,4,[Fi,"Utilization",Ei,Pi,Xj,new O(null,2,5,Q,[0,1],null),di,function(){return function(a){return[z(Math.round(100*a)),z("%")].join("")}}(a,d,e,f,g)],null))],null)}
function qo(a){var b=ro,c=null!=a&&(a.g&64||a.F)?D.a(Mc,a):a,d=E.a(c,ki),e=E.a(c,Yj),f=E.a(c,Rj),g=E.a(c,kf),h=E.a(c,ci),l=E.a(c,Bi),m=E.a(c,Th);return new O(null,5,5,Q,[Lj,De,new O(null,3,5,Q,[Mi,new u(null,1,[Li,new u(null,3,[vj,Ij,ak,"5px",Wh,"5px"],null)],null),new O(null,4,5,Q,[Mi,De,f," steps"],null)],null),new O(null,4,5,Q,[Mi,new u(null,1,[dj,"controls"],null),new O(null,7,5,Q,[gi,new u(null,1,[Ci,"slidden"],null),new O(null,3,5,Q,[Vh,new u(null,1,[oi,function(){return function(){var a=new O(null,
3,5,Q,[Dh,1,!0],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Roll"],null),new O(null,3,5,Q,[Vh,new u(null,1,[oi,function(){return function(){var a=new O(null,3,5,Q,[Dh,100,!0],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Run"],null),new O(null,3,5,Q,[Vh,new u(null,1,[oi,function(){return function(){var a=new O(null,3,5,Q,[Dh,100,!1],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Run Fast"],null),new O(null,3,5,Q,[Vh,new u(null,1,[oi,
function(a,c,d,e,f,g,h,l,m){return function(){var a=new O(null,2,5,Q,[wj,Oa(m)],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),v(m)?"Hide graphs":"Show graphs"],null),new O(null,3,5,Q,[Vh,new u(null,1,[oi,function(a,c,d,e,f,g,h,l){return function(){var a=new O(null,2,5,Q,[Bi,Oa(l)],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),v(l)?"Hide averages":"Average"],null)],null),new O(null,8,5,Q,[gi,new u(null,1,[Ci,"slidden"],null),new O(null,3,5,Q,[Vh,new u(null,
1,[oi,function(){return function(){var a=new O(null,2,5,Q,[Wi,xj],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Basic"],null),new O(null,3,5,Q,[Vh,new u(null,1,[oi,function(){return function(){var a=new O(null,2,5,Q,[Wi,Sh],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Efficient"],null),new O(null,3,5,Q,[Vh,new u(null,1,[oi,function(){return function(){var a=new O(null,2,5,Q,[Wi,Xh],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Basic \x26 Efficient"],
null),new O(null,3,5,Q,[Vh,new u(null,1,[oi,function(){return function(){var a=new O(null,2,5,Q,[Wi,wi],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Constrained"],null),new O(null,3,5,Q,[Vh,new u(null,1,[oi,function(){return function(){var a=new O(null,2,5,Q,[Wi,Si],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Basic, Efficient, \x26 Constrained"],null),new O(null,3,5,Q,[Vh,new u(null,1,[oi,function(){return function(){var a=new O(null,2,5,Q,[Wi,Zi],null);
return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Basic, Efficient, Constrained, \x26 Fixed"],null)],null)],null),new O(null,5,5,Q,[mj,new u(null,3,[dj,"space",ki,"100%",Yj,"100%"],null),function(){return function(a,b,c,d,e,f,g,h,l){return function H(m){return new je(null,function(){return function(){for(;;){var a=I(m);if(a){if(yd(a)){var b=Zb(a),c=M(b),d=ne(c);a:for(var e=0;;)if(e<c){var f=eb.a(b,e),g=null!=f&&(f.g&64||f.F)?D.a(Mc,f):f,f=g,h=E.a(g,Dj),g=E.a(g,uh),f=v(h)?new O(null,3,
5,Q,[Qi,new u(null,1,[Gh,Zn(h,g)],null),$n(f)],null):null;d.add(f);e+=1}else{b=!0;break a}return b?oe(d.O(),H($b(a))):oe(d.O(),null)}d=J(a);d=c=null!=d&&(d.g&64||d.F)?D.a(Mc,d):d;b=E.a(c,Dj);c=E.a(c,uh);return Zc(v(b)?new O(null,3,5,Q,[Qi,new u(null,1,[Gh,Zn(b,c)],null),$n(d)],null):null,H(Ac(a)))}return null}}}(a,b,c,d,e,f,g,h,l),null,null)}}(a,c,d,e,f,g,h,l,m)(g)}(),R.a(mo,h),v(v(d)?v(e)?m:e:d)?po(new O(null,2,5,Q,[d,e],null),h,l):null],null)],null)};xa=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new zc(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,Ja.b?Ja.b(a):Ja.call(null,a))}a.w=0;a.B=function(a){a=I(a);return b(a)};a.j=b;return a}();
ya=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new zc(e,0)}return b.call(this,d)}function b(a){return console.error.apply(console,Ja.b?Ja.b(a):Ja.call(null,a))}a.w=0;a.B=function(a){a=I(a);return b(a)};a.j=b;return a}();
function so(a){var b=new u(null,2,[Dj,45,ki,60],null),c=null!=b&&(b.g&64||b.F)?D.a(Mc,b):b,d=E.a(c,ki),e=E.a(c,Dj),f=Ue(1,Ph.b(J(bf(Jh,ci.b(a))))),g=R.a(Yj,f),h=R.a(uh,f);return jf(a,Ke(R,function(a,b,c,d,e,f,g){return function(a,b,c){return md.j(a,Dj,g,F([uh,b+c+(0-f/2-20),ki,f,Yj,f],0))}}(f,g,h,b,c,d,e)),h,g)}if("undefined"===typeof On)var On=gn(null);function ro(a){return kn(On,a)}if("undefined"===typeof to)var to=U.b?U.b(!1):U.call(null,!1);
function uo(a,b){var c=gn(1);Om(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!T(e,V)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,zm(c),d=V;else throw f;}if(!T(d,V))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(){return function(c){var d=c[1];if(7===d){var d=c[2],e=Gn();c[7]=d;return vm(c,8,e)}if(20===d)return c[8]=c[2],c[1]=v(b)?21:22,V;if(27===d)return d=c[2],c[1]=v(d)?28:29,V;if(1===d)return wm(c,2,On,uj);if(24===d)return d=c[2],c[2]=d,c[1]=23,V;if(4===d)return d=new O(null,2,5,Q,[Lh,!0],null),wm(c,7,On,d);if(15===d)return c[9]=c[2],wm(c,19,On,Pj);if(21===d)return c[2]=null,c[1]=23,V;if(31===
d)return d=c[2],c[2]=d,c[1]=30,V;if(13===d)return d=new O(null,2,5,Q,[Ji,!0],null),wm(c,16,On,d);if(22===d)return d=L.b?L.b(Rn):L.call(null,Rn),d=d.b?d.b(Rj):d.call(null,Rj),d=en(d),vm(c,24,d);if(29===d)return c[2]=null,c[1]=30,V;if(6===d)return c[10]=c[2],wm(c,10,On,tj);if(28===d)return d=c[11],d=new O(null,3,5,Q,[Dh,d,b],null),wm(c,31,On,d);if(25===d)return d=c[11],c[2]=0<d,c[1]=27,V;if(17===d)return d=new O(null,2,5,Q,[Ji,!1],null),c[12]=c[2],wm(c,18,On,d);if(3===d)return c[13]=c[2],c[1]=v(b)?
4:5,V;if(12===d)return c[14]=c[2],c[1]=v(b)?13:14,V;if(2===d)return c[15]=c[2],wm(c,3,On,yh);if(23===d){var d=c[16],e=c[2],d=a-1,f=L.b?L.b(to):L.call(null,to);c[17]=e;c[16]=f;c[11]=d;c[1]=v(f)?25:26;return V}return 19===d?(c[18]=c[2],wm(c,20,On,Ri)):11===d?(c[19]=c[2],wm(c,12,On,Ui)):9===d?(d=c[2],c[2]=d,c[1]=6,V):5===d?(c[2]=null,c[1]=6,V):14===d?(c[2]=null,c[1]=15,V):26===d?(d=c[16],c[2]=d,c[1]=27,V):16===d?(d=c[2],e=Gn(),c[20]=d,vm(c,17,e)):30===d?(d=c[2],xm(c,d)):10===d?(c[21]=c[2],wm(c,11,On,
Ti)):18===d?(d=c[2],c[2]=d,c[1]=15,V):8===d?(d=new O(null,2,5,Q,[Lh,!1],null),c[22]=c[2],wm(c,9,On,d)):null}}(c),c)}(),f=function(){var a=e.l?e.l():e.call(null);a[6]=c;return a}();return um(f)}}(c))}
function vo(){var a=gn(1);Om(function(a){return function(){var c=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var f=a(c);if(!T(f,V)){d=f;break a}}}catch(g){if(g instanceof Object)c[5]=g,zm(c),d=V;else throw g;}if(!T(d,V))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.l=c;d.b=b;return d}()}(function(a){return function(b){var c=b[1];if(1===c){var d=en(50);return vm(b,2,d)}if(2===c){var l=b[2],m=function(){return function(){return function(a){return a.width}}(l,c,a)}(),d=Mg(m,function(){return function(){return function(a){return a.height}}(l,m,c,a)}()),n=document.getElementById("space").getBoundingClientRect(),n=d.b?d.b(n):d.call(null,n),d=N(n,0),n=N(n,1),d=kn(On,new O(null,3,5,Q,[Di,d,n],null)),n=en(100);b[7]=d;b[8]=l;return vm(b,3,n)}if(3===
c){var d=b[2],n=kn(On,Kj),p=en(100);b[9]=d;b[10]=n;return vm(b,4,p)}return 4===c?(d=b[2],n=kn(On,Ui),b[11]=d,xm(b,n)):null}}(a),a)}(),d=function(){var d=c.l?c.l():c.call(null);d[6]=a;return d}();return um(d)}}(a))}
function wo(a){var b=gm(a),c=a.b?a.b(Rj):a.call(null,Rj),d=gn(1);Om(function(b,c,d,h){return function(){var l=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!T(e,V)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,zm(c),d=V;else throw f;}if(!T(d,V))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(b,c,d,e){return function(b){var f=b[1];if(7===f)return b[2]=null,b[1]=8,V;if(1===f)return f=cm(a),f=new O(null,2,5,Q,[Aj,f],null),wm(b,2,On,f);if(4===f)return f=b[7],b[1]=v(50>f)?6:7,V;if(6===f){a:for(var f=0,g=sl(bm);;)if(f<d)f+=1,g=$l(g);else{f=g;break a}f=c.b?c.b(f):c.call(null,f);f=new O(null,2,5,Q,[Aj,f],null);return wm(b,9,On,f)}return 3===f?(f=b[2],b[8]=f,b[7]=0,b[2]=null,b[1]=4,
V):2===f?(f=b[2],g=en(e),b[9]=f,vm(b,3,g)):9===f?(f=b[2],g=en(e),b[10]=f,vm(b,10,g)):5===f?(f=b[2],xm(b,f)):10===f?(f=b[7],b[11]=b[2],b[7]=f+1,b[2]=null,b[1]=4,V):8===f?(f=b[2],b[2]=f,b[1]=5,V):null}}(b,c,d,h),b,c,d,h)}(),m=function(){var a=l.l?l.l():l.call(null);a[6]=b;return a}();return um(m)}}(d,b,c,100))}
function Mn(a,b){var c=null!=a&&(a.g&64||a.F)?D.a(Mc,a):a,d=E.a(c,ci);try{if(T(b,Gi))return c;throw wn;}catch(e){if(e instanceof Error)if(e===wn)try{if(vd(b)&&3===M(b))try{var f=kd(b,0);if(T(f,Di)){var g=kd(b,1),h=kd(b,2);return so(gf(md.j(c,ki,g,F([Yj,h],0)),ci,Ke(ql,new u(null,3,[Dj,150,ki,g-150,Yj,h],null))))}throw wn;}catch(l){if(l instanceof Error){f=l;if(f===wn)throw wn;throw f;}throw l;}else throw wn;}catch(m){if(m instanceof Error)if(f=m,f===wn)try{if(T(b,Kj))return ul(c,function(){return function(a){a=
null!=a&&(a.g&64||a.F)?D.a(Mc,a):a;var b=E.a(a,dj),b=Tn(b);return v(b)?md.c(a,oj,b.getTotalLength()):a}}(f,e,a,c,c,d));throw wn;}catch(n){if(n instanceof Error)if(n===wn)try{if(vd(b)&&2===M(b))try{var p=kd(b,0);if(T(p,Wi)){var q=kd(b,1);Qe.a?Qe.a(to,!1):Qe.call(null,to,!1);vo();return sl(Zl.b?Zl.b(q):Zl.call(null,q))}throw wn;}catch(r){if(r instanceof Error){p=r;if(p===wn)throw wn;throw p;}throw r;}else throw wn;}catch(t){if(t instanceof Error)if(p=t,p===wn)try{if(vd(b)&&3===M(b))try{var w=kd(b,0);
if(T(w,Dh)){var y=kd(b,1),C=kd(b,2);Qe.a?Qe.a(to,!0):Qe.call(null,to,!0);uo(y,C);return c}throw wn;}catch(A){if(A instanceof Error){w=A;if(w===wn)throw wn;throw w;}throw A;}else throw wn;}catch(G){if(G instanceof Error)if(w=G,w===wn)try{if(T(b,uj))return wl(gf(c,Rj,Qc),We(function(){return function(){return 6*Math.random()+1|0}}(w,p,n,f,e,a,c,c,d)));throw wn;}catch(H){if(H instanceof Error)if(H===wn)try{if(T(b,yh))return zl(c);throw wn;}catch(ja){if(ja instanceof Error)if(ja===wn)try{if(vd(b)&&2===
M(b))try{var B=kd(b,0);if(T(B,Lh)){var Y=kd(b,1);return ul(c,function(a){return function(b){return md.c(b,xi,a)}}(Y,B,ja,H,w,p,n,f,e,a,c,c,d))}throw wn;}catch(ha){if(ha instanceof Error){B=ha;if(B===wn)throw wn;throw B;}throw ha;}else throw wn;}catch(P){if(P instanceof Error)if(B=P,B===wn)try{if(T(b,tj))return Jl(c);throw wn;}catch(W){if(W instanceof Error)if(W===wn)try{if(T(b,Ti))return Ll(c);throw wn;}catch(S){if(S instanceof Error)if(S===wn)try{if(T(b,Ui))return Kl(c);throw wn;}catch(Z){if(Z instanceof
Error)if(Z===wn)try{if(vd(b)&&2===M(b))try{var da=kd(b,0);if(T(da,Ji))return Y=kd(b,1),ul(c,function(a){return function(b){return md.c(b,Bj,a)}}(Y,da,Z,S,W,B,ja,H,w,p,n,f,e,a,c,c,d));throw wn;}catch(ia){if(ia instanceof Error){d=ia;if(d===wn)throw wn;throw d;}throw ia;}else throw wn;}catch(ma){if(ma instanceof Error)if(d=ma,d===wn)try{if(T(b,Pj))return Ml(c);throw wn;}catch(qa){if(qa instanceof Error)if(qa===wn)try{if(T(b,Ri))return Ol(c);throw wn;}catch(wa){if(wa instanceof Error)if(wa===wn)try{if(vd(b)&&
2===M(b))try{var za=kd(b,0);if(T(za,wj))return Y=kd(b,1),md.c(c,Th,Y);throw wn;}catch(Va){if(Va instanceof Error)if(d=Va,d===wn)try{za=kd(b,0);if(T(za,Bi))return Y=kd(b,1),v(Y)?(wo(c),c):od.a(c,Bi);throw wn;}catch(Ea){if(Ea instanceof Error)if(Ea===wn)try{za=kd(b,0);if(T(za,Aj)){var Qa=kd(b,1);return md.c(c,Bi,Qa)}throw wn;}catch(La){if(La instanceof Error&&La===wn)throw wn;throw La;}else throw Ea;else throw Ea;}else throw d;else throw Va;}else throw wn;}catch(Ra){if(Ra instanceof Error){d=Ra;if(d===
wn)throw Error([z("No matching clause: "),z(b)].join(""));throw d;}throw Ra;}else throw wa;else throw wa;}else throw qa;else throw qa;}else throw d;else throw ma;}else throw Z;else throw Z;}else throw S;else throw S;}else throw W;else throw W;}else throw B;else throw P;}else throw ja;else throw ja;}else throw H;else throw H;}else throw w;else throw G;}else throw p;else throw t;}else throw n;else throw n;}else throw f;else throw m;}else throw e;else throw e;}}var Nn=sl(Zl.b?Zl.b(xj):Zl.call(null,xj));
if("undefined"===typeof mn)var mn=Ln();if("undefined"===typeof xo){var Qn;Qn=ln(function(a){return qo(a)});var xo;xo=Pn()}vo();