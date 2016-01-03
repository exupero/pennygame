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
function t(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function ca(a){return"function"==t(a)}var da="closure_uid_"+(1E9*Math.random()>>>0),ga=0;function ia(a,b,c){return a.call.apply(a.bind,arguments)}function ja(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}
function ka(a,b,c){ka=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ia:ja;return ka.apply(null,arguments)};function pa(a,b){for(var c in a)b.call(void 0,a[c],c,a)};function ra(a,b){null!=a&&this.append.apply(this,arguments)}k=ra.prototype;k.hb="";k.set=function(a){this.hb=""+a};k.append=function(a,b,c){this.hb+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.hb+=arguments[d];return this};k.clear=function(){this.hb=""};k.toString=function(){return this.hb};function sa(a,b){a.sort(b||ta)}function ua(a,b){for(var c=0;c<a.length;c++)a[c]={index:c,value:a[c]};var d=b||ta;sa(a,function(a,b){return d(a.value,b.value)||a.index-b.index});for(c=0;c<a.length;c++)a[c]=a[c].value}function ta(a,b){return a>b?1:a<b?-1:0};var wa={},ya;if("undefined"===typeof za)var za=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof Ba)var Ba=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var Ca=null;if("undefined"===typeof Ea)var Ea=null;function Fa(){return new u(null,5,[Ga,!0,Ha,!0,Ia,!1,Ka,!1,La,null],null)}Ma;function x(a){return null!=a&&!1!==a}Na;y;function Oa(a){return null==a}function Ra(a){return a instanceof Array}
function Sa(a){return null==a?!0:!1===a?!0:!1}function Ua(a,b){return a[t(null==b?null:b)]?!0:a._?!0:!1}function Va(a,b){var c=null==b?null:b.constructor,c=x(x(c)?c.xb:c)?c.eb:t(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function Xa(a){var b=a.eb;return x(b)?b:""+A(a)}var Ya="undefined"!==typeof Symbol&&"function"===t(Symbol)?Symbol.iterator:"@@iterator";function Za(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}C;$a;
var Ma=function Ma(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ma.b(arguments[0]);case 2:return Ma.a(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};Ma.b=function(a){return Ma.a(null,a)};Ma.a=function(a,b){function c(a,b){a.push(b);return a}var d=[];return $a.c?$a.c(c,d,b):$a.call(null,c,d,b)};Ma.w=2;function ab(){}function bb(){}
var cb=function cb(b){if(null!=b&&null!=b.Z)return b.Z(b);var c=cb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=cb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("ICounted.-count",b);},db=function db(b){if(null!=b&&null!=b.da)return b.da(b);var c=db[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=db._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IEmptyableCollection.-empty",b);};function eb(){}
var fb=function fb(b,c){if(null!=b&&null!=b.X)return b.X(b,c);var d=fb[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=fb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("ICollection.-conj",b);};function gb(){}
var D=function D(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return D.a(arguments[0],arguments[1]);case 3:return D.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
D.a=function(a,b){if(null!=a&&null!=a.ca)return a.ca(a,b);var c=D[t(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=D._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Va("IIndexed.-nth",a);};D.c=function(a,b,c){if(null!=a&&null!=a.Ea)return a.Ea(a,b,c);var d=D[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=D._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Va("IIndexed.-nth",a);};D.w=3;function hb(){}
var ib=function ib(b){if(null!=b&&null!=b.ta)return b.ta(b);var c=ib[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ib._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("ISeq.-first",b);},kb=function kb(b){if(null!=b&&null!=b.xa)return b.xa(b);var c=kb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=kb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("ISeq.-rest",b);};function lb(){}function mb(){}
var nb=function nb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return nb.a(arguments[0],arguments[1]);case 3:return nb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
nb.a=function(a,b){if(null!=a&&null!=a.N)return a.N(a,b);var c=nb[t(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=nb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Va("ILookup.-lookup",a);};nb.c=function(a,b,c){if(null!=a&&null!=a.I)return a.I(a,b,c);var d=nb[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=nb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Va("ILookup.-lookup",a);};nb.w=3;function ob(){}
var pb=function pb(b,c){if(null!=b&&null!=b.lc)return b.lc(b,c);var d=pb[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=pb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("IAssociative.-contains-key?",b);},qb=function qb(b,c,d){if(null!=b&&null!=b.Oa)return b.Oa(b,c,d);var e=qb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=qb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Va("IAssociative.-assoc",b);};function rb(){}
var sb=function sb(b,c){if(null!=b&&null!=b.ib)return b.ib(b,c);var d=sb[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=sb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("IMap.-dissoc",b);};function tb(){}
var ub=function ub(b){if(null!=b&&null!=b.Mb)return b.Mb(b);var c=ub[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ub._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IMapEntry.-key",b);},vb=function vb(b){if(null!=b&&null!=b.Nb)return b.Nb(b);var c=vb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=vb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IMapEntry.-val",b);};function wb(){}
var xb=function xb(b){if(null!=b&&null!=b.jb)return b.jb(b);var c=xb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=xb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IStack.-peek",b);};function yb(){}
var zb=function zb(b,c,d){if(null!=b&&null!=b.kb)return b.kb(b,c,d);var e=zb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=zb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Va("IVector.-assoc-n",b);},Ab=function Ab(b){if(null!=b&&null!=b.Jb)return b.Jb(b);var c=Ab[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Ab._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IDeref.-deref",b);};function Cb(){}
var Db=function Db(b){if(null!=b&&null!=b.O)return b.O(b);var c=Db[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Db._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IMeta.-meta",b);},Eb=function Eb(b,c){if(null!=b&&null!=b.P)return b.P(b,c);var d=Eb[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Eb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("IWithMeta.-with-meta",b);};function Fb(){}
var Gb=function Gb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Gb.a(arguments[0],arguments[1]);case 3:return Gb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
Gb.a=function(a,b){if(null!=a&&null!=a.ea)return a.ea(a,b);var c=Gb[t(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=Gb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Va("IReduce.-reduce",a);};Gb.c=function(a,b,c){if(null!=a&&null!=a.fa)return a.fa(a,b,c);var d=Gb[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=Gb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Va("IReduce.-reduce",a);};Gb.w=3;
var Hb=function Hb(b,c,d){if(null!=b&&null!=b.Lb)return b.Lb(b,c,d);var e=Hb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Hb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Va("IKVReduce.-kv-reduce",b);},Ib=function Ib(b,c){if(null!=b&&null!=b.D)return b.D(b,c);var d=Ib[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Ib._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("IEquiv.-equiv",b);},Jb=function Jb(b){if(null!=b&&null!=b.T)return b.T(b);
var c=Jb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Jb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IHash.-hash",b);};function Kb(){}var Lb=function Lb(b){if(null!=b&&null!=b.U)return b.U(b);var c=Lb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Lb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("ISeqable.-seq",b);};function Mb(){}function Nb(){}function Ob(){}
var Pb=function Pb(b){if(null!=b&&null!=b.bc)return b.bc(b);var c=Pb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Pb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IReversible.-rseq",b);},Qb=function Qb(b,c){if(null!=b&&null!=b.Bc)return b.Bc(0,c);var d=Qb[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Qb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("IWriter.-write",b);},Rb=function Rb(b,c,d){if(null!=b&&null!=b.M)return b.M(b,c,d);
var e=Rb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Rb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Va("IPrintWithWriter.-pr-writer",b);},Sb=function Sb(b,c,d){if(null!=b&&null!=b.Ac)return b.Ac(0,c,d);var e=Sb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Sb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Va("IWatchable.-notify-watches",b);},Tb=function Tb(b){if(null!=b&&null!=b.vb)return b.vb(b);var c=Tb[t(null==
b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Tb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IEditableCollection.-as-transient",b);},Ub=function Ub(b,c){if(null!=b&&null!=b.Rb)return b.Rb(b,c);var d=Ub[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Ub._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("ITransientCollection.-conj!",b);},Vb=function Vb(b){if(null!=b&&null!=b.Sb)return b.Sb(b);var c=Vb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):
c.call(null,b);c=Vb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("ITransientCollection.-persistent!",b);},Wb=function Wb(b,c,d){if(null!=b&&null!=b.Qb)return b.Qb(b,c,d);var e=Wb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Wb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Va("ITransientAssociative.-assoc!",b);},Xb=function Xb(b,c,d){if(null!=b&&null!=b.zc)return b.zc(0,c,d);var e=Xb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,
b,c,d);e=Xb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Va("ITransientVector.-assoc-n!",b);};function Yb(){}
var Zb=function Zb(b,c){if(null!=b&&null!=b.ub)return b.ub(b,c);var d=Zb[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Zb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("IComparable.-compare",b);},$b=function $b(b){if(null!=b&&null!=b.wc)return b.wc();var c=$b[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=$b._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IChunk.-drop-first",b);},ac=function ac(b){if(null!=b&&null!=b.nc)return b.nc(b);
var c=ac[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ac._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IChunkedSeq.-chunked-first",b);},bc=function bc(b){if(null!=b&&null!=b.oc)return b.oc(b);var c=bc[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=bc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IChunkedSeq.-chunked-rest",b);},cc=function cc(b){if(null!=b&&null!=b.mc)return b.mc(b);var c=cc[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,
b);c=cc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IChunkedNext.-chunked-next",b);},dc=function dc(b){if(null!=b&&null!=b.Ob)return b.Ob(b);var c=dc[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=dc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("INamed.-name",b);},ec=function ec(b){if(null!=b&&null!=b.Pb)return b.Pb(b);var c=ec[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ec._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("INamed.-namespace",
b);},fc=function fc(b,c){if(null!=b&&null!=b.Zc)return b.Zc(b,c);var d=fc[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=fc._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("IReset.-reset!",b);},gc=function gc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return gc.a(arguments[0],arguments[1]);case 3:return gc.c(arguments[0],arguments[1],arguments[2]);case 4:return gc.m(arguments[0],arguments[1],arguments[2],
arguments[3]);case 5:return gc.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};gc.a=function(a,b){if(null!=a&&null!=a.ad)return a.ad(a,b);var c=gc[t(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=gc._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Va("ISwap.-swap!",a);};
gc.c=function(a,b,c){if(null!=a&&null!=a.bd)return a.bd(a,b,c);var d=gc[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=gc._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Va("ISwap.-swap!",a);};gc.m=function(a,b,c,d){if(null!=a&&null!=a.cd)return a.cd(a,b,c,d);var e=gc[t(null==a?null:a)];if(null!=e)return e.m?e.m(a,b,c,d):e.call(null,a,b,c,d);e=gc._;if(null!=e)return e.m?e.m(a,b,c,d):e.call(null,a,b,c,d);throw Va("ISwap.-swap!",a);};
gc.A=function(a,b,c,d,e){if(null!=a&&null!=a.dd)return a.dd(a,b,c,d,e);var f=gc[t(null==a?null:a)];if(null!=f)return f.A?f.A(a,b,c,d,e):f.call(null,a,b,c,d,e);f=gc._;if(null!=f)return f.A?f.A(a,b,c,d,e):f.call(null,a,b,c,d,e);throw Va("ISwap.-swap!",a);};gc.w=5;var hc=function hc(b){if(null!=b&&null!=b.Ga)return b.Ga(b);var c=hc[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=hc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IIterable.-iterator",b);};
function ic(a){this.rd=a;this.g=1073741824;this.C=0}ic.prototype.Bc=function(a,b){return this.rd.append(b)};function jc(a){var b=new ra;a.M(null,new ic(b),Fa());return""+A(b)}var kc="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function lc(a){a=kc(a|0,-862048943);return kc(a<<15|a>>>-15,461845907)}
function mc(a,b){var c=(a|0)^(b|0);return kc(c<<13|c>>>-13,5)+-430675100|0}function nc(a,b){var c=(a|0)^b,c=kc(c^c>>>16,-2048144789),c=kc(c^c>>>13,-1028477387);return c^c>>>16}function oc(a){var b;a:{b=1;for(var c=0;;)if(b<a.length){var d=b+2,c=mc(c,lc(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^lc(a.charCodeAt(a.length-1)):b;return nc(b,kc(2,a.length))}pc;qc;rc;sc;var tc={},uc=0;
function vc(a){255<uc&&(tc={},uc=0);var b=tc[a];if("number"!==typeof b){a:if(null!=a)if(b=a.length,0<b)for(var c=0,d=0;;)if(c<b)var e=c+1,d=kc(31,d)+a.charCodeAt(c),c=e;else{b=d;break a}else b=0;else b=0;tc[a]=b;uc+=1}return a=b}function wc(a){null!=a&&(a.g&4194304||a.yd)?a=a.T(null):"number"===typeof a?a=Math.floor(a)%2147483647:!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=vc(a),0!==a&&(a=lc(a),a=mc(0,a),a=nc(a,4))):a=a instanceof Date?a.valueOf():null==a?0:Jb(a);return a}
function xc(a,b){return a^b+2654435769+(a<<6)+(a>>2)}function Na(a,b){return b instanceof a}function zc(a,b){if(a.$a===b.$a)return 0;var c=Sa(a.Ba);if(x(c?b.Ba:c))return-1;if(x(a.Ba)){if(Sa(b.Ba))return 1;c=ta(a.Ba,b.Ba);return 0===c?ta(a.name,b.name):c}return ta(a.name,b.name)}G;function qc(a,b,c,d,e){this.Ba=a;this.name=b;this.$a=c;this.tb=d;this.Da=e;this.g=2154168321;this.C=4096}k=qc.prototype;k.toString=function(){return this.$a};k.equiv=function(a){return this.D(null,a)};
k.D=function(a,b){return b instanceof qc?this.$a===b.$a:!1};k.call=function(){function a(a,b,c){return G.c?G.c(b,this,c):G.call(null,b,this,c)}function b(a,b){return G.a?G.a(b,this):G.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};
k.b=function(a){return G.a?G.a(a,this):G.call(null,a,this)};k.a=function(a,b){return G.c?G.c(a,this,b):G.call(null,a,this,b)};k.O=function(){return this.Da};k.P=function(a,b){return new qc(this.Ba,this.name,this.$a,this.tb,b)};k.T=function(){var a=this.tb;return null!=a?a:this.tb=a=xc(oc(this.name),vc(this.Ba))};k.Ob=function(){return this.name};k.Pb=function(){return this.Ba};k.M=function(a,b){return Qb(b,this.$a)};
var Ac=function Ac(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ac.b(arguments[0]);case 2:return Ac.a(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};Ac.b=function(a){if(a instanceof qc)return a;var b=a.indexOf("/");return-1===b?Ac.a(null,a):Ac.a(a.substring(0,b),a.substring(b+1,a.length))};Ac.a=function(a,b){var c=null!=a?[A(a),A("/"),A(b)].join(""):b;return new qc(a,b,c,null,null)};
Ac.w=2;H;Bc;Cc;function I(a){if(null==a)return null;if(null!=a&&(a.g&8388608||a.$c))return a.U(null);if(Ra(a)||"string"===typeof a)return 0===a.length?null:new Cc(a,0);if(Ua(Kb,a))return Lb(a);throw Error([A(a),A(" is not ISeqable")].join(""));}function J(a){if(null==a)return null;if(null!=a&&(a.g&64||a.F))return a.ta(null);a=I(a);return null==a?null:ib(a)}function Dc(a){return null!=a?null!=a&&(a.g&64||a.F)?a.xa(null):(a=I(a))?kb(a):Ec:Ec}
function K(a){return null==a?null:null!=a&&(a.g&128||a.ac)?a.wa(null):I(Dc(a))}var rc=function rc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return rc.b(arguments[0]);case 2:return rc.a(arguments[0],arguments[1]);default:return rc.h(arguments[0],arguments[1],new Cc(c.slice(2),0))}};rc.b=function(){return!0};rc.a=function(a,b){return null==a?null==b:a===b||Ib(a,b)};
rc.h=function(a,b,c){for(;;)if(rc.a(a,b))if(K(c))a=b,b=J(c),c=K(c);else return rc.a(b,J(c));else return!1};rc.B=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return rc.h(b,a,c)};rc.w=2;function Fc(a){this.J=a}Fc.prototype.next=function(){if(null!=this.J){var a=J(this.J);this.J=K(this.J);return{value:a,done:!1}}return{value:null,done:!0}};function Gc(a){return new Fc(I(a))}Hc;function Ic(a,b,c){this.value=a;this.Db=b;this.jc=c;this.g=8388672;this.C=0}Ic.prototype.U=function(){return this};
Ic.prototype.ta=function(){return this.value};Ic.prototype.xa=function(){null==this.jc&&(this.jc=Hc.b?Hc.b(this.Db):Hc.call(null,this.Db));return this.jc};function Hc(a){var b=a.next();return x(b.done)?Ec:new Ic(b.value,a,null)}function Jc(a,b){var c=lc(a),c=mc(0,c);return nc(c,b)}function Kc(a){var b=0,c=1;for(a=I(a);;)if(null!=a)b+=1,c=kc(31,c)+wc(J(a))|0,a=K(a);else return Jc(c,b)}var Lc=Jc(1,0);function Mc(a){var b=0,c=0;for(a=I(a);;)if(null!=a)b+=1,c=c+wc(J(a))|0,a=K(a);else return Jc(c,b)}
var Nc=Jc(0,0);Oc;pc;Pc;bb["null"]=!0;cb["null"]=function(){return 0};Date.prototype.D=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};Date.prototype.Ib=!0;Date.prototype.ub=function(a,b){if(b instanceof Date)return ta(this.valueOf(),b.valueOf());throw Error([A("Cannot compare "),A(this),A(" to "),A(b)].join(""));};Ib.number=function(a,b){return a===b};Qc;ab["function"]=!0;Cb["function"]=!0;Db["function"]=function(){return null};Jb._=function(a){return a[da]||(a[da]=++ga)};
function Rc(a){return a+1}M;function Sc(a){this.H=a;this.g=32768;this.C=0}Sc.prototype.Jb=function(){return this.H};function Tc(a){return a instanceof Sc}function M(a){return Ab(a)}function Uc(a,b){var c=cb(a);if(0===c)return b.l?b.l():b.call(null);for(var d=D.a(a,0),e=1;;)if(e<c){var f=D.a(a,e),d=b.a?b.a(d,f):b.call(null,d,f);if(Tc(d))return Ab(d);e+=1}else return d}
function Vc(a,b,c){var d=cb(a),e=c;for(c=0;;)if(c<d){var f=D.a(a,c),e=b.a?b.a(e,f):b.call(null,e,f);if(Tc(e))return Ab(e);c+=1}else return e}function Wc(a,b){var c=a.length;if(0===a.length)return b.l?b.l():b.call(null);for(var d=a[0],e=1;;)if(e<c){var f=a[e],d=b.a?b.a(d,f):b.call(null,d,f);if(Tc(d))return Ab(d);e+=1}else return d}function Xc(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var f=a[c],e=b.a?b.a(e,f):b.call(null,e,f);if(Tc(e))return Ab(e);c+=1}else return e}
function Yc(a,b,c,d){for(var e=a.length;;)if(d<e){var f=a[d];c=b.a?b.a(c,f):b.call(null,c,f);if(Tc(c))return Ab(c);d+=1}else return c}$c;N;ad;bd;function cd(a){return null!=a?a.g&2||a.Qc?!0:a.g?!1:Ua(bb,a):Ua(bb,a)}function dd(a){return null!=a?a.g&16||a.xc?!0:a.g?!1:Ua(gb,a):Ua(gb,a)}function ed(a,b){this.f=a;this.s=b}ed.prototype.ya=function(){return this.s<this.f.length};ed.prototype.next=function(){var a=this.f[this.s];this.s+=1;return a};
function Cc(a,b){this.f=a;this.s=b;this.g=166199550;this.C=8192}k=Cc.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.ca=function(a,b){var c=b+this.s;return c<this.f.length?this.f[c]:null};k.Ea=function(a,b,c){a=b+this.s;return a<this.f.length?this.f[a]:c};k.Ga=function(){return new ed(this.f,this.s)};k.wa=function(){return this.s+1<this.f.length?new Cc(this.f,this.s+1):null};k.Z=function(){var a=this.f.length-this.s;return 0>a?0:a};
k.bc=function(){var a=cb(this);return 0<a?new ad(this,a-1,null):null};k.T=function(){return Kc(this)};k.D=function(a,b){return Pc.a?Pc.a(this,b):Pc.call(null,this,b)};k.da=function(){return Ec};k.ea=function(a,b){return Yc(this.f,b,this.f[this.s],this.s+1)};k.fa=function(a,b,c){return Yc(this.f,b,c,this.s)};k.ta=function(){return this.f[this.s]};k.xa=function(){return this.s+1<this.f.length?new Cc(this.f,this.s+1):Ec};k.U=function(){return this.s<this.f.length?this:null};
k.X=function(a,b){return N.a?N.a(b,this):N.call(null,b,this)};Cc.prototype[Ya]=function(){return Gc(this)};var Bc=function Bc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Bc.b(arguments[0]);case 2:return Bc.a(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};Bc.b=function(a){return Bc.a(a,0)};Bc.a=function(a,b){return b<a.length?new Cc(a,b):null};Bc.w=2;
var H=function H(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return H.b(arguments[0]);case 2:return H.a(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};H.b=function(a){return Bc.a(a,0)};H.a=function(a,b){return Bc.a(a,b)};H.w=2;Qc;fd;function ad(a,b,c){this.$b=a;this.s=b;this.v=c;this.g=32374990;this.C=8192}k=ad.prototype;k.toString=function(){return jc(this)};
k.equiv=function(a){return this.D(null,a)};k.O=function(){return this.v};k.wa=function(){return 0<this.s?new ad(this.$b,this.s-1,null):null};k.Z=function(){return this.s+1};k.T=function(){return Kc(this)};k.D=function(a,b){return Pc.a?Pc.a(this,b):Pc.call(null,this,b)};k.da=function(){var a=Ec,b=this.v;return Qc.a?Qc.a(a,b):Qc.call(null,a,b)};k.ea=function(a,b){return fd.a?fd.a(b,this):fd.call(null,b,this)};k.fa=function(a,b,c){return fd.c?fd.c(b,c,this):fd.call(null,b,c,this)};
k.ta=function(){return D.a(this.$b,this.s)};k.xa=function(){return 0<this.s?new ad(this.$b,this.s-1,null):Ec};k.U=function(){return this};k.P=function(a,b){return new ad(this.$b,this.s,b)};k.X=function(a,b){return N.a?N.a(b,this):N.call(null,b,this)};ad.prototype[Ya]=function(){return Gc(this)};function gd(a){return J(K(a))}function hd(a){for(;;){var b=K(a);if(null!=b)a=b;else return J(a)}}Ib._=function(a,b){return a===b};
var id=function id(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return id.l();case 1:return id.b(arguments[0]);case 2:return id.a(arguments[0],arguments[1]);default:return id.h(arguments[0],arguments[1],new Cc(c.slice(2),0))}};id.l=function(){return jd};id.b=function(a){return a};id.a=function(a,b){return null!=a?fb(a,b):fb(Ec,b)};id.h=function(a,b,c){for(;;)if(x(c))a=id.a(a,b),b=J(c),c=K(c);else return id.a(a,b)};
id.B=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return id.h(b,a,c)};id.w=2;function O(a){if(null!=a)if(null!=a&&(a.g&2||a.Qc))a=a.Z(null);else if(Ra(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.g&8388608||a.$c))a:{a=I(a);for(var b=0;;){if(cd(a)){a=b+cb(a);break a}a=K(a);b+=1}}else a=cb(a);else a=0;return a}function kd(a,b){for(var c=null;;){if(null==a)return c;if(0===b)return I(a)?J(a):c;if(dd(a))return D.c(a,b,c);if(I(a)){var d=K(a),e=b-1;a=d;b=e}else return c}}
function ld(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.g&16||a.xc))return a.ca(null,b);if(Ra(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.g&64||a.F)){var c;a:{c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(I(c)){c=J(c);break a}throw Error("Index out of bounds");}if(dd(c)){c=D.a(c,d);break a}if(I(c))c=K(c),--d;else throw Error("Index out of bounds");
}}return c}if(Ua(gb,a))return D.a(a,b);throw Error([A("nth not supported on this type "),A(Xa(null==a?null:a.constructor))].join(""));}
function Q(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return null;if(null!=a&&(a.g&16||a.xc))return a.Ea(null,b,null);if(Ra(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.g&64||a.F))return kd(a,b);if(Ua(gb,a))return D.a(a,b);throw Error([A("nth not supported on this type "),A(Xa(null==a?null:a.constructor))].join(""));}
var G=function G(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return G.a(arguments[0],arguments[1]);case 3:return G.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};G.a=function(a,b){return null==a?null:null!=a&&(a.g&256||a.yc)?a.N(null,b):Ra(a)?b<a.length?a[b|0]:null:"string"===typeof a?b<a.length?a[b|0]:null:Ua(mb,a)?nb.a(a,b):null};
G.c=function(a,b,c){return null!=a?null!=a&&(a.g&256||a.yc)?a.I(null,b,c):Ra(a)?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:Ua(mb,a)?nb.c(a,b,c):c:c};G.w=3;md;var nd=function nd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return nd.c(arguments[0],arguments[1],arguments[2]);default:return nd.h(arguments[0],arguments[1],arguments[2],new Cc(c.slice(3),0))}};nd.c=function(a,b,c){return null!=a?qb(a,b,c):od([b],[c])};
nd.h=function(a,b,c,d){for(;;)if(a=nd.c(a,b,c),x(d))b=J(d),c=gd(d),d=K(K(d));else return a};nd.B=function(a){var b=J(a),c=K(a);a=J(c);var d=K(c),c=J(d),d=K(d);return nd.h(b,a,c,d)};nd.w=3;var pd=function pd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return pd.b(arguments[0]);case 2:return pd.a(arguments[0],arguments[1]);default:return pd.h(arguments[0],arguments[1],new Cc(c.slice(2),0))}};pd.b=function(a){return a};
pd.a=function(a,b){return null==a?null:sb(a,b)};pd.h=function(a,b,c){for(;;){if(null==a)return null;a=pd.a(a,b);if(x(c))b=J(c),c=K(c);else return a}};pd.B=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return pd.h(b,a,c)};pd.w=2;function qd(a,b){this.i=a;this.v=b;this.g=393217;this.C=0}k=qd.prototype;k.O=function(){return this.v};k.P=function(a,b){return new qd(this.i,b)};k.Pc=!0;
k.call=function(){function a(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,B,F,E,L,P){a=this;return C.wb?C.wb(a.i,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,B,F,E,L,P):C.call(null,a.i,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,B,F,E,L,P)}function b(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,B,F,E,L){a=this;return a.i.qa?a.i.qa(b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,B,F,E,L):a.i.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,B,F,E,L)}function c(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,B,F,E){a=this;return a.i.pa?a.i.pa(b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,B,F,E):
a.i.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,B,F,E)}function d(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,B,F){a=this;return a.i.oa?a.i.oa(b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,B,F):a.i.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,B,F)}function e(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,B){a=this;return a.i.na?a.i.na(b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,B):a.i.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,B)}function f(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z){a=this;return a.i.ma?a.i.ma(b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z):a.i.call(null,b,
c,d,e,f,g,h,l,m,n,p,q,r,w,v,z)}function g(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v){a=this;return a.i.la?a.i.la(b,c,d,e,f,g,h,l,m,n,p,q,r,w,v):a.i.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v)}function h(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w){a=this;return a.i.ka?a.i.ka(b,c,d,e,f,g,h,l,m,n,p,q,r,w):a.i.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w)}function l(a,b,c,d,e,f,g,h,l,m,n,p,q,r){a=this;return a.i.ja?a.i.ja(b,c,d,e,f,g,h,l,m,n,p,q,r):a.i.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r)}function m(a,b,c,d,e,f,g,h,l,m,n,p,q){a=this;
return a.i.ia?a.i.ia(b,c,d,e,f,g,h,l,m,n,p,q):a.i.call(null,b,c,d,e,f,g,h,l,m,n,p,q)}function n(a,b,c,d,e,f,g,h,l,m,n,p){a=this;return a.i.ha?a.i.ha(b,c,d,e,f,g,h,l,m,n,p):a.i.call(null,b,c,d,e,f,g,h,l,m,n,p)}function p(a,b,c,d,e,f,g,h,l,m,n){a=this;return a.i.ga?a.i.ga(b,c,d,e,f,g,h,l,m,n):a.i.call(null,b,c,d,e,f,g,h,l,m,n)}function q(a,b,c,d,e,f,g,h,l,m){a=this;return a.i.sa?a.i.sa(b,c,d,e,f,g,h,l,m):a.i.call(null,b,c,d,e,f,g,h,l,m)}function r(a,b,c,d,e,f,g,h,l){a=this;return a.i.ra?a.i.ra(b,c,
d,e,f,g,h,l):a.i.call(null,b,c,d,e,f,g,h,l)}function v(a,b,c,d,e,f,g,h){a=this;return a.i.ba?a.i.ba(b,c,d,e,f,g,h):a.i.call(null,b,c,d,e,f,g,h)}function w(a,b,c,d,e,f,g){a=this;return a.i.Y?a.i.Y(b,c,d,e,f,g):a.i.call(null,b,c,d,e,f,g)}function z(a,b,c,d,e,f){a=this;return a.i.A?a.i.A(b,c,d,e,f):a.i.call(null,b,c,d,e,f)}function B(a,b,c,d,e){a=this;return a.i.m?a.i.m(b,c,d,e):a.i.call(null,b,c,d,e)}function F(a,b,c,d){a=this;return a.i.c?a.i.c(b,c,d):a.i.call(null,b,c,d)}function L(a,b,c){a=this;
return a.i.a?a.i.a(b,c):a.i.call(null,b,c)}function P(a,b){a=this;return a.i.b?a.i.b(b):a.i.call(null,b)}function Aa(a){a=this;return a.i.l?a.i.l():a.i.call(null)}var E=null,E=function(na,la,U,W,ea,fa,ha,ma,oa,qa,va,xa,E,Da,Qa,Ja,Wa,Ta,jb,Bb,yc,Zc){switch(arguments.length){case 1:return Aa.call(this,na);case 2:return P.call(this,na,la);case 3:return L.call(this,na,la,U);case 4:return F.call(this,na,la,U,W);case 5:return B.call(this,na,la,U,W,ea);case 6:return z.call(this,na,la,U,W,ea,fa);case 7:return w.call(this,
na,la,U,W,ea,fa,ha);case 8:return v.call(this,na,la,U,W,ea,fa,ha,ma);case 9:return r.call(this,na,la,U,W,ea,fa,ha,ma,oa);case 10:return q.call(this,na,la,U,W,ea,fa,ha,ma,oa,qa);case 11:return p.call(this,na,la,U,W,ea,fa,ha,ma,oa,qa,va);case 12:return n.call(this,na,la,U,W,ea,fa,ha,ma,oa,qa,va,xa);case 13:return m.call(this,na,la,U,W,ea,fa,ha,ma,oa,qa,va,xa,E);case 14:return l.call(this,na,la,U,W,ea,fa,ha,ma,oa,qa,va,xa,E,Da);case 15:return h.call(this,na,la,U,W,ea,fa,ha,ma,oa,qa,va,xa,E,Da,Qa);case 16:return g.call(this,
na,la,U,W,ea,fa,ha,ma,oa,qa,va,xa,E,Da,Qa,Ja);case 17:return f.call(this,na,la,U,W,ea,fa,ha,ma,oa,qa,va,xa,E,Da,Qa,Ja,Wa);case 18:return e.call(this,na,la,U,W,ea,fa,ha,ma,oa,qa,va,xa,E,Da,Qa,Ja,Wa,Ta);case 19:return d.call(this,na,la,U,W,ea,fa,ha,ma,oa,qa,va,xa,E,Da,Qa,Ja,Wa,Ta,jb);case 20:return c.call(this,na,la,U,W,ea,fa,ha,ma,oa,qa,va,xa,E,Da,Qa,Ja,Wa,Ta,jb,Bb);case 21:return b.call(this,na,la,U,W,ea,fa,ha,ma,oa,qa,va,xa,E,Da,Qa,Ja,Wa,Ta,jb,Bb,yc);case 22:return a.call(this,na,la,U,W,ea,fa,ha,
ma,oa,qa,va,xa,E,Da,Qa,Ja,Wa,Ta,jb,Bb,yc,Zc)}throw Error("Invalid arity: "+arguments.length);};E.b=Aa;E.a=P;E.c=L;E.m=F;E.A=B;E.Y=z;E.ba=w;E.ra=v;E.sa=r;E.ga=q;E.ha=p;E.ia=n;E.ja=m;E.ka=l;E.la=h;E.ma=g;E.na=f;E.oa=e;E.pa=d;E.qa=c;E.Kb=b;E.wb=a;return E}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.l=function(){return this.i.l?this.i.l():this.i.call(null)};k.b=function(a){return this.i.b?this.i.b(a):this.i.call(null,a)};
k.a=function(a,b){return this.i.a?this.i.a(a,b):this.i.call(null,a,b)};k.c=function(a,b,c){return this.i.c?this.i.c(a,b,c):this.i.call(null,a,b,c)};k.m=function(a,b,c,d){return this.i.m?this.i.m(a,b,c,d):this.i.call(null,a,b,c,d)};k.A=function(a,b,c,d,e){return this.i.A?this.i.A(a,b,c,d,e):this.i.call(null,a,b,c,d,e)};k.Y=function(a,b,c,d,e,f){return this.i.Y?this.i.Y(a,b,c,d,e,f):this.i.call(null,a,b,c,d,e,f)};
k.ba=function(a,b,c,d,e,f,g){return this.i.ba?this.i.ba(a,b,c,d,e,f,g):this.i.call(null,a,b,c,d,e,f,g)};k.ra=function(a,b,c,d,e,f,g,h){return this.i.ra?this.i.ra(a,b,c,d,e,f,g,h):this.i.call(null,a,b,c,d,e,f,g,h)};k.sa=function(a,b,c,d,e,f,g,h,l){return this.i.sa?this.i.sa(a,b,c,d,e,f,g,h,l):this.i.call(null,a,b,c,d,e,f,g,h,l)};k.ga=function(a,b,c,d,e,f,g,h,l,m){return this.i.ga?this.i.ga(a,b,c,d,e,f,g,h,l,m):this.i.call(null,a,b,c,d,e,f,g,h,l,m)};
k.ha=function(a,b,c,d,e,f,g,h,l,m,n){return this.i.ha?this.i.ha(a,b,c,d,e,f,g,h,l,m,n):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n)};k.ia=function(a,b,c,d,e,f,g,h,l,m,n,p){return this.i.ia?this.i.ia(a,b,c,d,e,f,g,h,l,m,n,p):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p)};k.ja=function(a,b,c,d,e,f,g,h,l,m,n,p,q){return this.i.ja?this.i.ja(a,b,c,d,e,f,g,h,l,m,n,p,q):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q)};
k.ka=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){return this.i.ka?this.i.ka(a,b,c,d,e,f,g,h,l,m,n,p,q,r):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r)};k.la=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v){return this.i.la?this.i.la(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v)};k.ma=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w){return this.i.ma?this.i.ma(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w)};
k.na=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z){return this.i.na?this.i.na(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z)};k.oa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B){return this.i.oa?this.i.oa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B)};
k.pa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F){return this.i.pa?this.i.pa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F)};k.qa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F,L){return this.i.qa?this.i.qa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F,L):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F,L)};
k.Kb=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F,L,P){return C.wb?C.wb(this.i,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F,L,P):C.call(null,this.i,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F,L,P)};function Qc(a,b){return ca(a)?new qd(a,b):null==a?null:Eb(a,b)}function rd(a){var b=null!=a;return(b?null!=a?a.g&131072||a.Wc||(a.g?0:Ua(Cb,a)):Ua(Cb,a):b)?Db(a):null}function sd(a){return null==a||Sa(I(a))}function td(a){return null==a?!1:null!=a?a.g&4096||a.Cd?!0:a.g?!1:Ua(wb,a):Ua(wb,a)}
function ud(a){return null!=a?a.g&16777216||a.Bd?!0:a.g?!1:Ua(Mb,a):Ua(Mb,a)}function vd(a){return null==a?!1:null!=a?a.g&1024||a.Uc?!0:a.g?!1:Ua(rb,a):Ua(rb,a)}function wd(a){return null!=a?a.g&16384||a.Dd?!0:a.g?!1:Ua(yb,a):Ua(yb,a)}xd;yd;function zd(a){return null!=a?a.C&512||a.wd?!0:!1:!1}function Ad(a){var b=[];pa(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}function Bd(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var Cd={};
function Dd(a){return null==a?!1:null!=a?a.g&64||a.F?!0:a.g?!1:Ua(hb,a):Ua(hb,a)}function Ed(a){return null==a?!1:!1===a?!1:!0}function Fd(a,b){return G.c(a,b,Cd)===Cd?!1:!0}function Gd(a,b){var c;if(c=null!=a)c=null!=a?a.g&512||a.vd?!0:a.g?!1:Ua(ob,a):Ua(ob,a);return c&&Fd(a,b)?new R(null,2,5,S,[b,G.a(a,b)],null):null}
function sc(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if("number"===typeof a){if("number"===typeof b)return ta(a,b);throw Error([A("Cannot compare "),A(a),A(" to "),A(b)].join(""));}if(null!=a?a.C&2048||a.Ib||(a.C?0:Ua(Yb,a)):Ua(Yb,a))return Zb(a,b);if("string"!==typeof a&&!Ra(a)&&!0!==a&&!1!==a||(null==a?null:a.constructor)!==(null==b?null:b.constructor))throw Error([A("Cannot compare "),A(a),A(" to "),A(b)].join(""));return ta(a,b)}
function Hd(a,b){var c=O(a),d=O(b);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=sc(ld(a,d),ld(b,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}function Id(a){return rc.a(a,sc)?sc:function(b,c){var d=a.a?a.a(b,c):a.call(null,b,c);return"number"===typeof d?d:x(d)?-1:x(a.a?a.a(c,b):a.call(null,c,b))?1:0}}Jd;
var fd=function fd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return fd.a(arguments[0],arguments[1]);case 3:return fd.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};fd.a=function(a,b){var c=I(b);if(c){var d=J(c),c=K(c);return $a.c?$a.c(a,d,c):$a.call(null,a,d,c)}return a.l?a.l():a.call(null)};
fd.c=function(a,b,c){for(c=I(c);;)if(c){var d=J(c);b=a.a?a.a(b,d):a.call(null,b,d);if(Tc(b))return Ab(b);c=K(c)}else return b};fd.w=3;Kd;var $a=function $a(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return $a.a(arguments[0],arguments[1]);case 3:return $a.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
$a.a=function(a,b){return null!=b&&(b.g&524288||b.Yc)?b.ea(null,a):Ra(b)?Wc(b,a):"string"===typeof b?Wc(b,a):Ua(Fb,b)?Gb.a(b,a):fd.a(a,b)};$a.c=function(a,b,c){return null!=c&&(c.g&524288||c.Yc)?c.fa(null,a,b):Ra(c)?Xc(c,a,b):"string"===typeof c?Xc(c,a,b):Ua(Fb,c)?Gb.c(c,a,b):fd.c(a,b,c)};$a.w=3;function Ld(a){return a}function Md(a,b,c,d){a=a.b?a.b(b):a.call(null,b);c=$a.c(a,c,d);return a.b?a.b(c):a.call(null,c)}
var Nd=function Nd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Nd.l();case 1:return Nd.b(arguments[0]);case 2:return Nd.a(arguments[0],arguments[1]);default:return Nd.h(arguments[0],arguments[1],new Cc(c.slice(2),0))}};Nd.l=function(){return 0};Nd.b=function(a){return a};Nd.a=function(a,b){return a+b};Nd.h=function(a,b,c){return $a.c(Nd,a+b,c)};Nd.B=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return Nd.h(b,a,c)};Nd.w=2;
var Od=function Od(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Od.b(arguments[0]);case 2:return Od.a(arguments[0],arguments[1]);default:return Od.h(arguments[0],arguments[1],new Cc(c.slice(2),0))}};Od.b=function(a){return-a};Od.a=function(a,b){return a-b};Od.h=function(a,b,c){return $a.c(Od,a-b,c)};Od.B=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return Od.h(b,a,c)};Od.w=2;
var Pd=function Pd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Pd.l();case 1:return Pd.b(arguments[0]);case 2:return Pd.a(arguments[0],arguments[1]);default:return Pd.h(arguments[0],arguments[1],new Cc(c.slice(2),0))}};Pd.l=function(){return 1};Pd.b=function(a){return a};Pd.a=function(a,b){return a*b};Pd.h=function(a,b,c){return $a.c(Pd,a*b,c)};Pd.B=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return Pd.h(b,a,c)};Pd.w=2;wa.Jd;
var Qd=function Qd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Qd.b(arguments[0]);case 2:return Qd.a(arguments[0],arguments[1]);default:return Qd.h(arguments[0],arguments[1],new Cc(c.slice(2),0))}};Qd.b=function(a){return 1/a};Qd.a=function(a,b){return a/b};Qd.h=function(a,b,c){return $a.c(Qd,a/b,c)};Qd.B=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return Qd.h(b,a,c)};Qd.w=2;function Rd(a){return a-1}
var Sd=function Sd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Sd.b(arguments[0]);case 2:return Sd.a(arguments[0],arguments[1]);default:return Sd.h(arguments[0],arguments[1],new Cc(c.slice(2),0))}};Sd.b=function(a){return a};Sd.a=function(a,b){return a>b?a:b};Sd.h=function(a,b,c){return $a.c(Sd,a>b?a:b,c)};Sd.B=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return Sd.h(b,a,c)};Sd.w=2;
var Td=function Td(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Td.b(arguments[0]);case 2:return Td.a(arguments[0],arguments[1]);default:return Td.h(arguments[0],arguments[1],new Cc(c.slice(2),0))}};Td.b=function(a){return a};Td.a=function(a,b){return a<b?a:b};Td.h=function(a,b,c){return $a.c(Td,a<b?a:b,c)};Td.B=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return Td.h(b,a,c)};Td.w=2;Ud;function Ud(a,b){return(a%b+b)%b}
function Vd(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function Wd(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function Xd(a,b){for(var c=b,d=I(a);;)if(d&&0<c)--c,d=K(d);else return d}var A=function A(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return A.l();case 1:return A.b(arguments[0]);default:return A.h(arguments[0],new Cc(c.slice(1),0))}};A.l=function(){return""};
A.b=function(a){return null==a?"":""+a};A.h=function(a,b){for(var c=new ra(""+A(a)),d=b;;)if(x(d))c=c.append(""+A(J(d))),d=K(d);else return c.toString()};A.B=function(a){var b=J(a);a=K(a);return A.h(b,a)};A.w=1;T;Yd;function Pc(a,b){var c;if(ud(b))if(cd(a)&&cd(b)&&O(a)!==O(b))c=!1;else a:{c=I(a);for(var d=I(b);;){if(null==c){c=null==d;break a}if(null!=d&&rc.a(J(c),J(d)))c=K(c),d=K(d);else{c=!1;break a}}}else c=null;return Ed(c)}
function $c(a){if(I(a)){var b=wc(J(a));for(a=K(a);;){if(null==a)return b;b=xc(b,wc(J(a)));a=K(a)}}else return 0}Zd;$d;function ae(a){var b=0;for(a=I(a);;)if(a){var c=J(a),b=(b+(wc(Zd.b?Zd.b(c):Zd.call(null,c))^wc($d.b?$d.b(c):$d.call(null,c))))%4503599627370496;a=K(a)}else return b}Yd;be;ce;function bd(a,b,c,d,e){this.v=a;this.first=b;this.Ca=c;this.count=d;this.u=e;this.g=65937646;this.C=8192}k=bd.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.O=function(){return this.v};
k.wa=function(){return 1===this.count?null:this.Ca};k.Z=function(){return this.count};k.jb=function(){return this.first};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.da=function(){return Eb(Ec,this.v)};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){return this.first};k.xa=function(){return 1===this.count?Ec:this.Ca};k.U=function(){return this};
k.P=function(a,b){return new bd(b,this.first,this.Ca,this.count,this.u)};k.X=function(a,b){return new bd(this.v,b,this,this.count+1,null)};function de(a){return null!=a?a.g&33554432||a.zd?!0:a.g?!1:Ua(Nb,a):Ua(Nb,a)}bd.prototype[Ya]=function(){return Gc(this)};function ee(a){this.v=a;this.g=65937614;this.C=8192}k=ee.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.O=function(){return this.v};k.wa=function(){return null};k.Z=function(){return 0};k.jb=function(){return null};
k.T=function(){return Lc};k.D=function(a,b){return de(b)||ud(b)?null==I(b):!1};k.da=function(){return this};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){return null};k.xa=function(){return Ec};k.U=function(){return null};k.P=function(a,b){return new ee(b)};k.X=function(a,b){return new bd(this.v,b,null,1,null)};var Ec=new ee(null);ee.prototype[Ya]=function(){return Gc(this)};
function fe(a){return(null!=a?a.g&134217728||a.Ad||(a.g?0:Ua(Ob,a)):Ua(Ob,a))?Pb(a):$a.c(id,Ec,a)}var pc=function pc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return pc.h(0<c.length?new Cc(c.slice(0),0):null)};pc.h=function(a){var b;if(a instanceof Cc&&0===a.s)b=a.f;else a:for(b=[];;)if(null!=a)b.push(a.ta(null)),a=a.wa(null);else break a;a=b.length;for(var c=Ec;;)if(0<a){var d=a-1,c=c.X(null,b[a-1]);a=d}else return c};pc.w=0;pc.B=function(a){return pc.h(I(a))};
function ge(a,b,c,d){this.v=a;this.first=b;this.Ca=c;this.u=d;this.g=65929452;this.C=8192}k=ge.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.O=function(){return this.v};k.wa=function(){return null==this.Ca?null:I(this.Ca)};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.da=function(){return Qc(Ec,this.v)};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){return this.first};
k.xa=function(){return null==this.Ca?Ec:this.Ca};k.U=function(){return this};k.P=function(a,b){return new ge(b,this.first,this.Ca,this.u)};k.X=function(a,b){return new ge(null,b,this,this.u)};ge.prototype[Ya]=function(){return Gc(this)};function N(a,b){var c=null==b;return(c?c:null!=b&&(b.g&64||b.F))?new ge(null,a,b,null):new ge(null,a,I(b),null)}
function he(a,b){if(a.Ha===b.Ha)return 0;var c=Sa(a.Ba);if(x(c?b.Ba:c))return-1;if(x(a.Ba)){if(Sa(b.Ba))return 1;c=ta(a.Ba,b.Ba);return 0===c?ta(a.name,b.name):c}return ta(a.name,b.name)}function y(a,b,c,d){this.Ba=a;this.name=b;this.Ha=c;this.tb=d;this.g=2153775105;this.C=4096}k=y.prototype;k.toString=function(){return[A(":"),A(this.Ha)].join("")};k.equiv=function(a){return this.D(null,a)};k.D=function(a,b){return b instanceof y?this.Ha===b.Ha:!1};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return G.a(c,this);case 3:return G.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return G.a(c,this)};a.c=function(a,c,d){return G.c(c,this,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return G.a(a,this)};k.a=function(a,b){return G.c(a,this,b)};
k.T=function(){var a=this.tb;return null!=a?a:this.tb=a=xc(oc(this.name),vc(this.Ba))+2654435769|0};k.Ob=function(){return this.name};k.Pb=function(){return this.Ba};k.M=function(a,b){return Qb(b,[A(":"),A(this.Ha)].join(""))};function V(a,b){return a===b?!0:a instanceof y&&b instanceof y?a.Ha===b.Ha:!1}
var ie=function ie(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ie.b(arguments[0]);case 2:return ie.a(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
ie.b=function(a){if(a instanceof y)return a;if(a instanceof qc){var b;if(null!=a&&(a.C&4096||a.Xc))b=a.Pb(null);else throw Error([A("Doesn't support namespace: "),A(a)].join(""));return new y(b,Yd.b?Yd.b(a):Yd.call(null,a),a.$a,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new y(b[0],b[1],a,null):new y(null,b[0],a,null)):null};ie.a=function(a,b){return new y(a,b,[A(x(a)?[A(a),A("/")].join(""):null),A(b)].join(""),null)};ie.w=2;
function je(a,b,c,d){this.v=a;this.Cb=b;this.J=c;this.u=d;this.g=32374988;this.C=0}k=je.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};function ke(a){null!=a.Cb&&(a.J=a.Cb.l?a.Cb.l():a.Cb.call(null),a.Cb=null);return a.J}k.O=function(){return this.v};k.wa=function(){Lb(this);return null==this.J?null:K(this.J)};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.da=function(){return Qc(Ec,this.v)};
k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){Lb(this);return null==this.J?null:J(this.J)};k.xa=function(){Lb(this);return null!=this.J?Dc(this.J):Ec};k.U=function(){ke(this);if(null==this.J)return null;for(var a=this.J;;)if(a instanceof je)a=ke(a);else return this.J=a,I(this.J)};k.P=function(a,b){return new je(b,this.Cb,this.J,this.u)};k.X=function(a,b){return N(b,this)};je.prototype[Ya]=function(){return Gc(this)};le;
function me(a,b){this.L=a;this.end=b;this.g=2;this.C=0}me.prototype.add=function(a){this.L[this.end]=a;return this.end+=1};me.prototype.W=function(){var a=new le(this.L,0,this.end);this.L=null;return a};me.prototype.Z=function(){return this.end};function ne(a){return new me(Array(a),0)}function le(a,b,c){this.f=a;this.ua=b;this.end=c;this.g=524306;this.C=0}k=le.prototype;k.Z=function(){return this.end-this.ua};k.ca=function(a,b){return this.f[this.ua+b]};
k.Ea=function(a,b,c){return 0<=b&&b<this.end-this.ua?this.f[this.ua+b]:c};k.wc=function(){if(this.ua===this.end)throw Error("-drop-first of empty chunk");return new le(this.f,this.ua+1,this.end)};k.ea=function(a,b){return Yc(this.f,b,this.f[this.ua],this.ua+1)};k.fa=function(a,b,c){return Yc(this.f,b,c,this.ua)};function xd(a,b,c,d){this.W=a;this.Wa=b;this.v=c;this.u=d;this.g=31850732;this.C=1536}k=xd.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};
k.O=function(){return this.v};k.wa=function(){if(1<cb(this.W))return new xd($b(this.W),this.Wa,this.v,null);var a=Lb(this.Wa);return null==a?null:a};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.da=function(){return Qc(Ec,this.v)};k.ta=function(){return D.a(this.W,0)};k.xa=function(){return 1<cb(this.W)?new xd($b(this.W),this.Wa,this.v,null):null==this.Wa?Ec:this.Wa};k.U=function(){return this};k.nc=function(){return this.W};
k.oc=function(){return null==this.Wa?Ec:this.Wa};k.P=function(a,b){return new xd(this.W,this.Wa,b,this.u)};k.X=function(a,b){return N(b,this)};k.mc=function(){return null==this.Wa?null:this.Wa};xd.prototype[Ya]=function(){return Gc(this)};function oe(a,b){return 0===cb(a)?b:new xd(a,b,null,null)}function pe(a,b){a.add(b)}function be(a){return ac(a)}function ce(a){return bc(a)}function Jd(a){for(var b=[];;)if(I(a))b.push(J(a)),a=K(a);else return b}
function qe(a){if("number"===typeof a)a:{var b=Array(a);if(Dd(null))for(var c=0,d=I(null);;)if(d&&c<a)b[c]=J(d),c+=1,d=K(d);else{a=b;break a}else{for(c=0;;)if(c<a)b[c]=null,c+=1;else break;a=b}}else a=Ma.b(a);return a}function re(a,b){if(cd(a))return O(a);for(var c=a,d=b,e=0;;)if(0<d&&I(c))c=K(c),--d,e+=1;else return e}
var se=function se(b){return null==b?null:null==K(b)?I(J(b)):N(J(b),se(K(b)))},te=function te(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return te.l();case 1:return te.b(arguments[0]);case 2:return te.a(arguments[0],arguments[1]);default:return te.h(arguments[0],arguments[1],new Cc(c.slice(2),0))}};te.l=function(){return new je(null,function(){return null},null,null)};te.b=function(a){return new je(null,function(){return a},null,null)};
te.a=function(a,b){return new je(null,function(){var c=I(a);return c?zd(c)?oe(ac(c),te.a(bc(c),b)):N(J(c),te.a(Dc(c),b)):b},null,null)};te.h=function(a,b,c){return function e(a,b){return new je(null,function(){var c=I(a);return c?zd(c)?oe(ac(c),e(bc(c),b)):N(J(c),e(Dc(c),b)):x(b)?e(J(b),K(b)):null},null,null)}(te.a(a,b),c)};te.B=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return te.h(b,a,c)};te.w=2;function ue(a){return Vb(a)}
var ve=function ve(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return ve.l();case 1:return ve.b(arguments[0]);case 2:return ve.a(arguments[0],arguments[1]);default:return ve.h(arguments[0],arguments[1],new Cc(c.slice(2),0))}};ve.l=function(){return Tb(jd)};ve.b=function(a){return a};ve.a=function(a,b){return Ub(a,b)};ve.h=function(a,b,c){for(;;)if(a=Ub(a,b),x(c))b=J(c),c=K(c);else return a};
ve.B=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return ve.h(b,a,c)};ve.w=2;function we(a,b,c){return Wb(a,b,c)}
function xe(a,b,c){var d=I(c);if(0===b)return a.l?a.l():a.call(null);c=ib(d);var e=kb(d);if(1===b)return a.b?a.b(c):a.b?a.b(c):a.call(null,c);var d=ib(e),f=kb(e);if(2===b)return a.a?a.a(c,d):a.a?a.a(c,d):a.call(null,c,d);var e=ib(f),g=kb(f);if(3===b)return a.c?a.c(c,d,e):a.c?a.c(c,d,e):a.call(null,c,d,e);var f=ib(g),h=kb(g);if(4===b)return a.m?a.m(c,d,e,f):a.m?a.m(c,d,e,f):a.call(null,c,d,e,f);var g=ib(h),l=kb(h);if(5===b)return a.A?a.A(c,d,e,f,g):a.A?a.A(c,d,e,f,g):a.call(null,c,d,e,f,g);var h=ib(l),
m=kb(l);if(6===b)return a.Y?a.Y(c,d,e,f,g,h):a.Y?a.Y(c,d,e,f,g,h):a.call(null,c,d,e,f,g,h);var l=ib(m),n=kb(m);if(7===b)return a.ba?a.ba(c,d,e,f,g,h,l):a.ba?a.ba(c,d,e,f,g,h,l):a.call(null,c,d,e,f,g,h,l);var m=ib(n),p=kb(n);if(8===b)return a.ra?a.ra(c,d,e,f,g,h,l,m):a.ra?a.ra(c,d,e,f,g,h,l,m):a.call(null,c,d,e,f,g,h,l,m);var n=ib(p),q=kb(p);if(9===b)return a.sa?a.sa(c,d,e,f,g,h,l,m,n):a.sa?a.sa(c,d,e,f,g,h,l,m,n):a.call(null,c,d,e,f,g,h,l,m,n);var p=ib(q),r=kb(q);if(10===b)return a.ga?a.ga(c,d,e,
f,g,h,l,m,n,p):a.ga?a.ga(c,d,e,f,g,h,l,m,n,p):a.call(null,c,d,e,f,g,h,l,m,n,p);var q=ib(r),v=kb(r);if(11===b)return a.ha?a.ha(c,d,e,f,g,h,l,m,n,p,q):a.ha?a.ha(c,d,e,f,g,h,l,m,n,p,q):a.call(null,c,d,e,f,g,h,l,m,n,p,q);var r=ib(v),w=kb(v);if(12===b)return a.ia?a.ia(c,d,e,f,g,h,l,m,n,p,q,r):a.ia?a.ia(c,d,e,f,g,h,l,m,n,p,q,r):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r);var v=ib(w),z=kb(w);if(13===b)return a.ja?a.ja(c,d,e,f,g,h,l,m,n,p,q,r,v):a.ja?a.ja(c,d,e,f,g,h,l,m,n,p,q,r,v):a.call(null,c,d,e,f,g,h,l,m,n,
p,q,r,v);var w=ib(z),B=kb(z);if(14===b)return a.ka?a.ka(c,d,e,f,g,h,l,m,n,p,q,r,v,w):a.ka?a.ka(c,d,e,f,g,h,l,m,n,p,q,r,v,w):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,v,w);var z=ib(B),F=kb(B);if(15===b)return a.la?a.la(c,d,e,f,g,h,l,m,n,p,q,r,v,w,z):a.la?a.la(c,d,e,f,g,h,l,m,n,p,q,r,v,w,z):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z);var B=ib(F),L=kb(F);if(16===b)return a.ma?a.ma(c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B):a.ma?a.ma(c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B);var F=
ib(L),P=kb(L);if(17===b)return a.na?a.na(c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F):a.na?a.na(c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F);var L=ib(P),Aa=kb(P);if(18===b)return a.oa?a.oa(c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F,L):a.oa?a.oa(c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F,L):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F,L);P=ib(Aa);Aa=kb(Aa);if(19===b)return a.pa?a.pa(c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F,L,P):a.pa?a.pa(c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F,L,P):a.call(null,c,d,e,
f,g,h,l,m,n,p,q,r,v,w,z,B,F,L,P);var E=ib(Aa);kb(Aa);if(20===b)return a.qa?a.qa(c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F,L,P,E):a.qa?a.qa(c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F,L,P,E):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F,L,P,E);throw Error("Only up to 20 arguments supported on functions");}
var C=function C(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return C.a(arguments[0],arguments[1]);case 3:return C.c(arguments[0],arguments[1],arguments[2]);case 4:return C.m(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return C.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return C.h(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new Cc(c.slice(5),0))}};
C.a=function(a,b){var c=a.w;if(a.B){var d=re(b,c+1);return d<=c?xe(a,d,b):a.B(b)}return a.apply(a,Jd(b))};C.c=function(a,b,c){b=N(b,c);c=a.w;if(a.B){var d=re(b,c+1);return d<=c?xe(a,d,b):a.B(b)}return a.apply(a,Jd(b))};C.m=function(a,b,c,d){b=N(b,N(c,d));c=a.w;return a.B?(d=re(b,c+1),d<=c?xe(a,d,b):a.B(b)):a.apply(a,Jd(b))};C.A=function(a,b,c,d,e){b=N(b,N(c,N(d,e)));c=a.w;return a.B?(d=re(b,c+1),d<=c?xe(a,d,b):a.B(b)):a.apply(a,Jd(b))};
C.h=function(a,b,c,d,e,f){b=N(b,N(c,N(d,N(e,se(f)))));c=a.w;return a.B?(d=re(b,c+1),d<=c?xe(a,d,b):a.B(b)):a.apply(a,Jd(b))};C.B=function(a){var b=J(a),c=K(a);a=J(c);var d=K(c),c=J(d),e=K(d),d=J(e),f=K(e),e=J(f),f=K(f);return C.h(b,a,c,d,e,f)};C.w=5;function ye(a){return I(a)?a:null}
var ze=function ze(){"undefined"===typeof ya&&(ya=function(b,c){this.od=b;this.nd=c;this.g=393216;this.C=0},ya.prototype.P=function(b,c){return new ya(this.od,c)},ya.prototype.O=function(){return this.nd},ya.prototype.ya=function(){return!1},ya.prototype.next=function(){return Error("No such element")},ya.prototype.remove=function(){return Error("Unsupported operation")},ya.ic=function(){return new R(null,2,5,S,[Qc(Ae,new u(null,1,[Be,pc(Ce,pc(jd))],null)),wa.Id],null)},ya.xb=!0,ya.eb="cljs.core/t_cljs$core23323",
ya.Tb=function(b,c){return Qb(c,"cljs.core/t_cljs$core23323")});return new ya(ze,De)};Ee;function Ee(a,b,c,d){this.Fb=a;this.first=b;this.Ca=c;this.v=d;this.g=31719628;this.C=0}k=Ee.prototype;k.P=function(a,b){return new Ee(this.Fb,this.first,this.Ca,b)};k.X=function(a,b){return N(b,Lb(this))};k.da=function(){return Ec};k.D=function(a,b){return null!=Lb(this)?Pc(this,b):ud(b)&&null==I(b)};k.T=function(){return Kc(this)};k.U=function(){null!=this.Fb&&this.Fb.step(this);return null==this.Ca?null:this};
k.ta=function(){null!=this.Fb&&Lb(this);return null==this.Ca?null:this.first};k.xa=function(){null!=this.Fb&&Lb(this);return null==this.Ca?Ec:this.Ca};k.wa=function(){null!=this.Fb&&Lb(this);return null==this.Ca?null:Lb(this.Ca)};Ee.prototype[Ya]=function(){return Gc(this)};function Fe(a,b){for(;;){if(null==I(b))return!0;var c;c=J(b);c=a.b?a.b(c):a.call(null,c);if(x(c)){c=a;var d=K(b);a=c;b=d}else return!1}}
function Ge(a,b){for(;;)if(I(b)){var c;c=J(b);c=a.b?a.b(c):a.call(null,c);if(x(c))return c;c=a;var d=K(b);a=c;b=d}else return null}
function He(a){return function(){function b(b,c){return Sa(a.a?a.a(b,c):a.call(null,b,c))}function c(b){return Sa(a.b?a.b(b):a.call(null,b))}function d(){return Sa(a.l?a.l():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new Cc(g,0)}return c.call(this,a,d,f)}function c(b,d,e){return Sa(C.m(a,b,d,e))}b.w=2;b.B=function(a){var b=J(a);a=K(a);var d=J(a);a=Dc(a);return c(b,d,a)};b.h=
c;return b}(),e=function(a,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var m=null;if(2<arguments.length){for(var m=0,n=Array(arguments.length-2);m<n.length;)n[m]=arguments[m+2],++m;m=new Cc(n,0)}return f.h(a,e,m)}throw Error("Invalid arity: "+arguments.length);};e.w=2;e.B=f.B;e.l=d;e.b=c;e.a=b;e.h=f.h;return e}()}
function Ie(a){return function(){function b(b){if(0<arguments.length)for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;return a}b.w=0;b.B=function(b){I(b);return a};b.h=function(){return a};return b}()}
var Je=function Je(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Je.l();case 1:return Je.b(arguments[0]);case 2:return Je.a(arguments[0],arguments[1]);case 3:return Je.c(arguments[0],arguments[1],arguments[2]);default:return Je.h(arguments[0],arguments[1],arguments[2],new Cc(c.slice(3),0))}};Je.l=function(){return Ld};Je.b=function(a){return a};
Je.a=function(a,b){return function(){function c(c,d,e){c=b.c?b.c(c,d,e):b.call(null,c,d,e);return a.b?a.b(c):a.call(null,c)}function d(c,d){var e=b.a?b.a(c,d):b.call(null,c,d);return a.b?a.b(e):a.call(null,e)}function e(c){c=b.b?b.b(c):b.call(null,c);return a.b?a.b(c):a.call(null,c)}function f(){var c=b.l?b.l():b.call(null);return a.b?a.b(c):a.call(null,c)}var g=null,h=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+
3],++g;g=new Cc(h,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){c=C.A(b,c,e,f,g);return a.b?a.b(c):a.call(null,c)}c.w=3;c.B=function(a){var b=J(a);a=K(a);var c=J(a);a=K(a);var e=J(a);a=Dc(a);return d(b,c,e,a)};c.h=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+
3],++q;q=new Cc(r,0)}return h.h(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.B=h.B;g.l=f;g.b=e;g.a=d;g.c=c;g.h=h.h;return g}()};
Je.c=function(a,b,c){return function(){function d(d,e,f){d=c.c?c.c(d,e,f):c.call(null,d,e,f);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}function e(d,e){var f;f=c.a?c.a(d,e):c.call(null,d,e);f=b.b?b.b(f):b.call(null,f);return a.b?a.b(f):a.call(null,f)}function f(d){d=c.b?c.b(d):c.call(null,d);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}function g(){var d;d=c.l?c.l():c.call(null);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}var h=null,l=function(){function d(a,
b,c,f){var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;g=new Cc(h,0)}return e.call(this,a,b,c,g)}function e(d,f,g,h){d=C.A(c,d,f,g,h);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}d.w=3;d.B=function(a){var b=J(a);a=K(a);var c=J(a);a=K(a);var d=J(a);a=Dc(a);return e(b,c,d,a)};d.h=e;return d}(),h=function(a,b,c,h){switch(arguments.length){case 0:return g.call(this);case 1:return f.call(this,a);case 2:return e.call(this,a,b);
case 3:return d.call(this,a,b,c);default:var r=null;if(3<arguments.length){for(var r=0,v=Array(arguments.length-3);r<v.length;)v[r]=arguments[r+3],++r;r=new Cc(v,0)}return l.h(a,b,c,r)}throw Error("Invalid arity: "+arguments.length);};h.w=3;h.B=l.B;h.l=g;h.b=f;h.a=e;h.c=d;h.h=l.h;return h}()};
Je.h=function(a,b,c,d){return function(a){return function(){function b(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new Cc(e,0)}return c.call(this,d)}function c(b){b=C.a(J(a),b);for(var d=K(a);;)if(d)b=J(d).call(null,b),d=K(d);else return b}b.w=0;b.B=function(a){a=I(a);return c(a)};b.h=c;return b}()}(fe(N(a,N(b,N(c,d)))))};Je.B=function(a){var b=J(a),c=K(a);a=J(c);var d=K(c),c=J(d),d=K(d);return Je.h(b,a,c,d)};Je.w=3;
function Ke(a,b){return function(){function c(c,d,e){return a.m?a.m(b,c,d,e):a.call(null,b,c,d,e)}function d(c,d){return a.c?a.c(b,c,d):a.call(null,b,c,d)}function e(c){return a.a?a.a(b,c):a.call(null,b,c)}function f(){return a.b?a.b(b):a.call(null,b)}var g=null,h=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;g=new Cc(h,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){return C.h(a,b,c,e,f,H([g],0))}c.w=
3;c.B=function(a){var b=J(a);a=K(a);var c=J(a);a=K(a);var e=J(a);a=Dc(a);return d(b,c,e,a)};c.h=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+3],++q;q=new Cc(r,0)}return h.h(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.B=h.B;g.l=f;g.b=
e;g.a=d;g.c=c;g.h=h.h;return g}()}Le;function Me(a,b){return function d(b,f){return new je(null,function(){var g=I(f);if(g){if(zd(g)){for(var h=ac(g),l=O(h),m=ne(l),n=0;;)if(n<l)pe(m,function(){var d=b+n,f=D.a(h,n);return a.a?a.a(d,f):a.call(null,d,f)}()),n+=1;else break;return oe(m.W(),d(b+l,bc(g)))}return N(function(){var d=J(g);return a.a?a.a(b,d):a.call(null,b,d)}(),d(b+1,Dc(g)))}return null},null,null)}(0,b)}function Ne(a,b,c,d){this.state=a;this.v=b;this.Nc=d;this.C=16386;this.g=6455296}k=Ne.prototype;
k.equiv=function(a){return this.D(null,a)};k.D=function(a,b){return this===b};k.Jb=function(){return this.state};k.O=function(){return this.v};k.Ac=function(a,b,c){a=I(this.Nc);for(var d=null,e=0,f=0;;)if(f<e){var g=d.ca(null,f),h=Q(g,0),g=Q(g,1);g.m?g.m(h,this,b,c):g.call(null,h,this,b,c);f+=1}else if(a=I(a))zd(a)?(d=ac(a),a=bc(a),h=d,e=O(d),d=h):(d=J(a),h=Q(d,0),g=Q(d,1),g.m?g.m(h,this,b,c):g.call(null,h,this,b,c),a=K(a),d=null,e=0),f=0;else return null};
k.T=function(){return this[da]||(this[da]=++ga)};var X=function X(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return X.b(arguments[0]);default:return X.h(arguments[0],new Cc(c.slice(1),0))}};X.b=function(a){return new Ne(a,null,0,null)};X.h=function(a,b){var c=null!=b&&(b.g&64||b.F)?C.a(Oc,b):b,d=G.a(c,Ia);G.a(c,Oe);return new Ne(a,d,0,null)};X.B=function(a){var b=J(a);a=K(a);return X.h(b,a)};X.w=1;Pe;
function Qe(a,b){if(a instanceof Ne){var c=a.state;a.state=b;null!=a.Nc&&Sb(a,c,b);return b}return fc(a,b)}var Re=function Re(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Re.a(arguments[0],arguments[1]);case 3:return Re.c(arguments[0],arguments[1],arguments[2]);case 4:return Re.m(arguments[0],arguments[1],arguments[2],arguments[3]);default:return Re.h(arguments[0],arguments[1],arguments[2],arguments[3],new Cc(c.slice(4),0))}};
Re.a=function(a,b){var c;a instanceof Ne?(c=a.state,c=b.b?b.b(c):b.call(null,c),c=Qe(a,c)):c=gc.a(a,b);return c};Re.c=function(a,b,c){if(a instanceof Ne){var d=a.state;b=b.a?b.a(d,c):b.call(null,d,c);a=Qe(a,b)}else a=gc.c(a,b,c);return a};Re.m=function(a,b,c,d){if(a instanceof Ne){var e=a.state;b=b.c?b.c(e,c,d):b.call(null,e,c,d);a=Qe(a,b)}else a=gc.m(a,b,c,d);return a};Re.h=function(a,b,c,d,e){return a instanceof Ne?Qe(a,C.A(b,a.state,c,d,e)):gc.A(a,b,c,d,e)};
Re.B=function(a){var b=J(a),c=K(a);a=J(c);var d=K(c),c=J(d),e=K(d),d=J(e),e=K(e);return Re.h(b,a,c,d,e)};Re.w=4;function Se(a){this.state=a;this.g=32768;this.C=0}Se.prototype.Jb=function(){return this.state};function Le(a){return new Se(a)}
var T=function T(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return T.b(arguments[0]);case 2:return T.a(arguments[0],arguments[1]);case 3:return T.c(arguments[0],arguments[1],arguments[2]);case 4:return T.m(arguments[0],arguments[1],arguments[2],arguments[3]);default:return T.h(arguments[0],arguments[1],arguments[2],arguments[3],new Cc(c.slice(4),0))}};
T.b=function(a){return function(b){return function(){function c(c,d){var e=a.b?a.b(d):a.call(null,d);return b.a?b.a(c,e):b.call(null,c,e)}function d(a){return b.b?b.b(a):b.call(null,a)}function e(){return b.l?b.l():b.call(null)}var f=null,g=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new Cc(g,0)}return d.call(this,a,b,f)}function d(c,e,f){e=C.c(a,e,f);return b.a?b.a(c,e):b.call(null,c,e)}c.w=2;c.B=function(a){var b=
J(a);a=K(a);var c=J(a);a=Dc(a);return d(b,c,a)};c.h=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var n=null;if(2<arguments.length){for(var n=0,p=Array(arguments.length-2);n<p.length;)p[n]=arguments[n+2],++n;n=new Cc(p,0)}return g.h(a,b,n)}throw Error("Invalid arity: "+arguments.length);};f.w=2;f.B=g.B;f.l=e;f.b=d;f.a=c;f.h=g.h;return f}()}};
T.a=function(a,b){return new je(null,function(){var c=I(b);if(c){if(zd(c)){for(var d=ac(c),e=O(d),f=ne(e),g=0;;)if(g<e)pe(f,function(){var b=D.a(d,g);return a.b?a.b(b):a.call(null,b)}()),g+=1;else break;return oe(f.W(),T.a(a,bc(c)))}return N(function(){var b=J(c);return a.b?a.b(b):a.call(null,b)}(),T.a(a,Dc(c)))}return null},null,null)};
T.c=function(a,b,c){return new je(null,function(){var d=I(b),e=I(c);if(d&&e){var f=N,g;g=J(d);var h=J(e);g=a.a?a.a(g,h):a.call(null,g,h);d=f(g,T.c(a,Dc(d),Dc(e)))}else d=null;return d},null,null)};T.m=function(a,b,c,d){return new je(null,function(){var e=I(b),f=I(c),g=I(d);if(e&&f&&g){var h=N,l;l=J(e);var m=J(f),n=J(g);l=a.c?a.c(l,m,n):a.call(null,l,m,n);e=h(l,T.m(a,Dc(e),Dc(f),Dc(g)))}else e=null;return e},null,null)};
T.h=function(a,b,c,d,e){var f=function h(a){return new je(null,function(){var b=T.a(I,a);return Fe(Ld,b)?N(T.a(J,b),h(T.a(Dc,b))):null},null,null)};return T.a(function(){return function(b){return C.a(a,b)}}(f),f(id.h(e,d,H([c,b],0))))};T.B=function(a){var b=J(a),c=K(a);a=J(c);var d=K(c),c=J(d),e=K(d),d=J(e),e=K(e);return T.h(b,a,c,d,e)};T.w=4;function Te(a,b){return new je(null,function(){if(0<a){var c=I(b);return c?N(J(c),Te(a-1,Dc(c))):null}return null},null,null)}
function Ue(a,b){return new je(null,function(c){return function(){return c(a,b)}}(function(a,b){for(;;){var e=I(b);if(0<a&&e){var f=a-1,e=Dc(e);a=f;b=e}else return e}}),null,null)}function Ve(a){return new je(null,function(){return N(a,Ve(a))},null,null)}function We(a){return new je(null,function(){return N(a.l?a.l():a.call(null),We(a))},null,null)}
var Xe=function Xe(b,c){return N(c,new je(null,function(){return Xe(b,b.b?b.b(c):b.call(null,c))},null,null))},Ye=function Ye(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ye.a(arguments[0],arguments[1]);default:return Ye.h(arguments[0],arguments[1],new Cc(c.slice(2),0))}};Ye.a=function(a,b){return new je(null,function(){var c=I(a),d=I(b);return c&&d?N(J(c),N(J(d),Ye.a(Dc(c),Dc(d)))):null},null,null)};
Ye.h=function(a,b,c){return new je(null,function(){var d=T.a(I,id.h(c,b,H([a],0)));return Fe(Ld,d)?te.a(T.a(J,d),C.a(Ye,T.a(Dc,d))):null},null,null)};Ye.B=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return Ye.h(b,a,c)};Ye.w=2;function Ze(a){return Ue(1,Ye.a(Ve("L"),a))}$e;
function af(a,b){return new je(null,function(){var c=I(b);if(c){if(zd(c)){for(var d=ac(c),e=O(d),f=ne(e),g=0;;)if(g<e){var h;h=D.a(d,g);h=a.b?a.b(h):a.call(null,h);x(h)&&(h=D.a(d,g),f.add(h));g+=1}else break;return oe(f.W(),af(a,bc(c)))}d=J(c);c=Dc(c);return x(a.b?a.b(d):a.call(null,d))?N(d,af(a,c)):af(a,c)}return null},null,null)}function bf(a,b){return af(He(a),b)}
function cf(a){return function c(a){return new je(null,function(){var e=N,f;x(Dd.b?Dd.b(a):Dd.call(null,a))?(f=H([I.b?I.b(a):I.call(null,a)],0),f=C.a(te,C.c(T,c,f))):f=null;return e(a,f)},null,null)}(a)}var df=function df(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return df.a(arguments[0],arguments[1]);case 3:return df.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
df.a=function(a,b){return null!=a?null!=a&&(a.C&4||a.Rc)?Qc(ue($a.c(Ub,Tb(a),b)),rd(a)):$a.c(fb,a,b):$a.c(id,Ec,b)};df.c=function(a,b,c){return null!=a&&(a.C&4||a.Rc)?Qc(ue(Md(b,ve,Tb(a),c)),rd(a)):Md(b,id,a,c)};df.w=3;function ef(a,b){return ue($a.c(function(b,d){return ve.a(b,a.b?a.b(d):a.call(null,d))},Tb(jd),b))}
function ff(a,b){var c;a:{c=Cd;for(var d=a,e=I(b);;)if(e)if(null!=d?d.g&256||d.yc||(d.g?0:Ua(mb,d)):Ua(mb,d)){d=G.c(d,J(e),c);if(c===d){c=null;break a}e=K(e)}else{c=null;break a}else{c=d;break a}}return c}
var gf=function gf(b,c,d){var e=Q(c,0);c=Xd(c,1);return x(c)?nd.c(b,e,gf(G.a(b,e),c,d)):nd.c(b,e,d)},hf=function hf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return hf.c(arguments[0],arguments[1],arguments[2]);case 4:return hf.m(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return hf.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);case 6:return hf.Y(arguments[0],arguments[1],arguments[2],arguments[3],
arguments[4],arguments[5]);default:return hf.h(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],new Cc(c.slice(6),0))}};hf.c=function(a,b,c){var d=Q(b,0);b=Xd(b,1);return x(b)?nd.c(a,d,hf.c(G.a(a,d),b,c)):nd.c(a,d,function(){var b=G.a(a,d);return c.b?c.b(b):c.call(null,b)}())};hf.m=function(a,b,c,d){var e=Q(b,0);b=Xd(b,1);return x(b)?nd.c(a,e,hf.m(G.a(a,e),b,c,d)):nd.c(a,e,function(){var b=G.a(a,e);return c.a?c.a(b,d):c.call(null,b,d)}())};
hf.A=function(a,b,c,d,e){var f=Q(b,0);b=Xd(b,1);return x(b)?nd.c(a,f,hf.A(G.a(a,f),b,c,d,e)):nd.c(a,f,function(){var b=G.a(a,f);return c.c?c.c(b,d,e):c.call(null,b,d,e)}())};hf.Y=function(a,b,c,d,e,f){var g=Q(b,0);b=Xd(b,1);return x(b)?nd.c(a,g,hf.Y(G.a(a,g),b,c,d,e,f)):nd.c(a,g,function(){var b=G.a(a,g);return c.m?c.m(b,d,e,f):c.call(null,b,d,e,f)}())};
hf.h=function(a,b,c,d,e,f,g){var h=Q(b,0);b=Xd(b,1);return x(b)?nd.c(a,h,C.h(hf,G.a(a,h),b,c,d,H([e,f,g],0))):nd.c(a,h,C.h(c,G.a(a,h),d,e,f,H([g],0)))};hf.B=function(a){var b=J(a),c=K(a);a=J(c);var d=K(c),c=J(d),e=K(d),d=J(e),f=K(e),e=J(f),g=K(f),f=J(g),g=K(g);return hf.h(b,a,c,d,e,f,g)};hf.w=6;function jf(a,b,c){return nd.c(a,b,function(){var d=G.a(a,b);return c.b?c.b(d):c.call(null,d)}())}function kf(a,b,c,d){return nd.c(a,b,function(){var e=G.a(a,b);return c.a?c.a(e,d):c.call(null,e,d)}())}
function lf(a,b,c,d){var e=mf;return nd.c(a,e,function(){var f=G.a(a,e);return b.c?b.c(f,c,d):b.call(null,f,c,d)}())}function nf(a,b){this.V=a;this.f=b}function of(a){return new nf(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function pf(a){a=a.o;return 32>a?0:a-1>>>5<<5}function qf(a,b,c){for(;;){if(0===b)return c;var d=of(a);d.f[0]=c;c=d;b-=5}}
var rf=function rf(b,c,d,e){var f=new nf(d.V,Za(d.f)),g=b.o-1>>>c&31;5===c?f.f[g]=e:(d=d.f[g],b=null!=d?rf(b,c-5,d,e):qf(null,c-5,e),f.f[g]=b);return f};function sf(a,b){throw Error([A("No item "),A(a),A(" in vector of length "),A(b)].join(""));}function tf(a,b){if(b>=pf(a))return a.R;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.f[b>>>d&31],d=e;else return c.f}function uf(a,b){return 0<=b&&b<a.o?tf(a,b):sf(b,a.o)}
var vf=function vf(b,c,d,e,f){var g=new nf(d.V,Za(d.f));if(0===c)g.f[e&31]=f;else{var h=e>>>c&31;b=vf(b,c-5,d.f[h],e,f);g.f[h]=b}return g};function wf(a,b,c,d,e,f){this.s=a;this.kc=b;this.f=c;this.Na=d;this.start=e;this.end=f}wf.prototype.ya=function(){return this.s<this.end};wf.prototype.next=function(){32===this.s-this.kc&&(this.f=tf(this.Na,this.s),this.kc+=32);var a=this.f[this.s&31];this.s+=1;return a};xf;yf;zf;M;Af;Bf;Cf;
function R(a,b,c,d,e,f){this.v=a;this.o=b;this.shift=c;this.root=d;this.R=e;this.u=f;this.g=167668511;this.C=8196}k=R.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.N=function(a,b){return nb.c(this,b,null)};k.I=function(a,b,c){return"number"===typeof b?D.c(this,b,c):c};
k.Lb=function(a,b,c){a=0;for(var d=c;;)if(a<this.o){var e=tf(this,a);c=e.length;a:for(var f=0;;)if(f<c){var g=f+a,h=e[f],d=b.c?b.c(d,g,h):b.call(null,d,g,h);if(Tc(d)){e=d;break a}f+=1}else{e=d;break a}if(Tc(e))return M.b?M.b(e):M.call(null,e);a+=c;d=e}else return d};k.ca=function(a,b){return uf(this,b)[b&31]};k.Ea=function(a,b,c){return 0<=b&&b<this.o?tf(this,b)[b&31]:c};
k.kb=function(a,b,c){if(0<=b&&b<this.o)return pf(this)<=b?(a=Za(this.R),a[b&31]=c,new R(this.v,this.o,this.shift,this.root,a,null)):new R(this.v,this.o,this.shift,vf(this,this.shift,this.root,b,c),this.R,null);if(b===this.o)return fb(this,c);throw Error([A("Index "),A(b),A(" out of bounds  [0,"),A(this.o),A("]")].join(""));};k.Ga=function(){var a=this.o;return new wf(0,0,0<O(this)?tf(this,0):null,this,0,a)};k.O=function(){return this.v};k.Z=function(){return this.o};
k.Mb=function(){return D.a(this,0)};k.Nb=function(){return D.a(this,1)};k.jb=function(){return 0<this.o?D.a(this,this.o-1):null};k.bc=function(){return 0<this.o?new ad(this,this.o-1,null):null};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){if(b instanceof R)if(this.o===O(b))for(var c=hc(this),d=hc(b);;)if(x(c.ya())){var e=c.next(),f=d.next();if(!rc.a(e,f))return!1}else return!0;else return!1;else return Pc(this,b)};
k.vb=function(){return new zf(this.o,this.shift,xf.b?xf.b(this.root):xf.call(null,this.root),yf.b?yf.b(this.R):yf.call(null,this.R))};k.da=function(){return Qc(jd,this.v)};k.ea=function(a,b){return Uc(this,b)};k.fa=function(a,b,c){a=0;for(var d=c;;)if(a<this.o){var e=tf(this,a);c=e.length;a:for(var f=0;;)if(f<c){var g=e[f],d=b.a?b.a(d,g):b.call(null,d,g);if(Tc(d)){e=d;break a}f+=1}else{e=d;break a}if(Tc(e))return M.b?M.b(e):M.call(null,e);a+=c;d=e}else return d};
k.Oa=function(a,b,c){if("number"===typeof b)return zb(this,b,c);throw Error("Vector's key for assoc must be a number.");};k.U=function(){if(0===this.o)return null;if(32>=this.o)return new Cc(this.R,0);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.f[0];else{a=a.f;break a}}return Cf.m?Cf.m(this,a,0,0):Cf.call(null,this,a,0,0)};k.P=function(a,b){return new R(b,this.o,this.shift,this.root,this.R,this.u)};
k.X=function(a,b){if(32>this.o-pf(this)){for(var c=this.R.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.R[e],e+=1;else break;d[c]=b;return new R(this.v,this.o+1,this.shift,this.root,d,null)}c=(d=this.o>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=of(null),d.f[0]=this.root,e=qf(null,this.shift,new nf(null,this.R)),d.f[1]=e):d=rf(this,this.shift,this.root,new nf(null,this.R));return new R(this.v,this.o+1,c,d,[b],null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.ca(null,c);case 3:return this.Ea(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.ca(null,c)};a.c=function(a,c,d){return this.Ea(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return this.ca(null,a)};k.a=function(a,b){return this.Ea(null,a,b)};
var S=new nf(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),jd=new R(null,0,5,S,[],Lc);function Df(a){var b=a.length;if(32>b)return new R(null,b,5,S,a,null);for(var c=32,d=(new R(null,32,5,S,a.slice(0,32),null)).vb(null);;)if(c<b)var e=c+1,d=ve.a(d,a[c]),c=e;else return Vb(d)}R.prototype[Ya]=function(){return Gc(this)};function Kd(a){return Ra(a)?Df(a):Vb($a.c(Ub,Tb(jd),a))}
var Ef=function Ef(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Ef.h(0<c.length?new Cc(c.slice(0),0):null)};Ef.h=function(a){return a instanceof Cc&&0===a.s?Df(a.f):Kd(a)};Ef.w=0;Ef.B=function(a){return Ef.h(I(a))};Ff;function yd(a,b,c,d,e,f){this.Ia=a;this.node=b;this.s=c;this.ua=d;this.v=e;this.u=f;this.g=32375020;this.C=1536}k=yd.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.O=function(){return this.v};
k.wa=function(){if(this.ua+1<this.node.length){var a;a=this.Ia;var b=this.node,c=this.s,d=this.ua+1;a=Cf.m?Cf.m(a,b,c,d):Cf.call(null,a,b,c,d);return null==a?null:a}return cc(this)};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.da=function(){return Qc(jd,this.v)};k.ea=function(a,b){var c;c=this.Ia;var d=this.s+this.ua,e=O(this.Ia);c=Ff.c?Ff.c(c,d,e):Ff.call(null,c,d,e);return Uc(c,b)};
k.fa=function(a,b,c){a=this.Ia;var d=this.s+this.ua,e=O(this.Ia);a=Ff.c?Ff.c(a,d,e):Ff.call(null,a,d,e);return Vc(a,b,c)};k.ta=function(){return this.node[this.ua]};k.xa=function(){if(this.ua+1<this.node.length){var a;a=this.Ia;var b=this.node,c=this.s,d=this.ua+1;a=Cf.m?Cf.m(a,b,c,d):Cf.call(null,a,b,c,d);return null==a?Ec:a}return bc(this)};k.U=function(){return this};k.nc=function(){var a=this.node;return new le(a,this.ua,a.length)};
k.oc=function(){var a=this.s+this.node.length;if(a<cb(this.Ia)){var b=this.Ia,c=tf(this.Ia,a);return Cf.m?Cf.m(b,c,a,0):Cf.call(null,b,c,a,0)}return Ec};k.P=function(a,b){return Cf.A?Cf.A(this.Ia,this.node,this.s,this.ua,b):Cf.call(null,this.Ia,this.node,this.s,this.ua,b)};k.X=function(a,b){return N(b,this)};k.mc=function(){var a=this.s+this.node.length;if(a<cb(this.Ia)){var b=this.Ia,c=tf(this.Ia,a);return Cf.m?Cf.m(b,c,a,0):Cf.call(null,b,c,a,0)}return null};yd.prototype[Ya]=function(){return Gc(this)};
var Cf=function Cf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Cf.c(arguments[0],arguments[1],arguments[2]);case 4:return Cf.m(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Cf.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};Cf.c=function(a,b,c){return new yd(a,uf(a,b),b,c,null,null)};
Cf.m=function(a,b,c,d){return new yd(a,b,c,d,null,null)};Cf.A=function(a,b,c,d,e){return new yd(a,b,c,d,e,null)};Cf.w=5;Gf;function Hf(a,b,c,d,e){this.v=a;this.Na=b;this.start=c;this.end=d;this.u=e;this.g=167666463;this.C=8192}k=Hf.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.N=function(a,b){return nb.c(this,b,null)};k.I=function(a,b,c){return"number"===typeof b?D.c(this,b,c):c};
k.Lb=function(a,b,c){a=this.start;for(var d=0;;)if(a<this.end){var e=d,f=D.a(this.Na,a);c=b.c?b.c(c,e,f):b.call(null,c,e,f);if(Tc(c))return M.b?M.b(c):M.call(null,c);d+=1;a+=1}else return c};k.ca=function(a,b){return 0>b||this.end<=this.start+b?sf(b,this.end-this.start):D.a(this.Na,this.start+b)};k.Ea=function(a,b,c){return 0>b||this.end<=this.start+b?c:D.c(this.Na,this.start+b,c)};
k.kb=function(a,b,c){var d=this.start+b;a=this.v;c=nd.c(this.Na,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return Gf.A?Gf.A(a,c,b,d,null):Gf.call(null,a,c,b,d,null)};k.O=function(){return this.v};k.Z=function(){return this.end-this.start};k.jb=function(){return D.a(this.Na,this.end-1)};k.bc=function(){return this.start!==this.end?new ad(this,this.end-this.start-1,null):null};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};
k.da=function(){return Qc(jd,this.v)};k.ea=function(a,b){return Uc(this,b)};k.fa=function(a,b,c){return Vc(this,b,c)};k.Oa=function(a,b,c){if("number"===typeof b)return zb(this,b,c);throw Error("Subvec's key for assoc must be a number.");};k.U=function(){var a=this;return function(b){return function d(e){return e===a.end?null:N(D.a(a.Na,e),new je(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};
k.P=function(a,b){return Gf.A?Gf.A(b,this.Na,this.start,this.end,this.u):Gf.call(null,b,this.Na,this.start,this.end,this.u)};k.X=function(a,b){var c=this.v,d=zb(this.Na,this.end,b),e=this.start,f=this.end+1;return Gf.A?Gf.A(c,d,e,f,null):Gf.call(null,c,d,e,f,null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.ca(null,c);case 3:return this.Ea(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.ca(null,c)};a.c=function(a,c,d){return this.Ea(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return this.ca(null,a)};k.a=function(a,b){return this.Ea(null,a,b)};Hf.prototype[Ya]=function(){return Gc(this)};
function Gf(a,b,c,d,e){for(;;)if(b instanceof Hf)c=b.start+c,d=b.start+d,b=b.Na;else{var f=O(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new Hf(a,b,c,d,e)}}var Ff=function Ff(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ff.a(arguments[0],arguments[1]);case 3:return Ff.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
Ff.a=function(a,b){return Ff.c(a,b,O(a))};Ff.c=function(a,b,c){return Gf(null,a,b,c,null)};Ff.w=3;function If(a,b){return a===b.V?b:new nf(a,Za(b.f))}function xf(a){return new nf({},Za(a.f))}function yf(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];Bd(a,0,b,0,a.length);return b}
var Jf=function Jf(b,c,d,e){d=If(b.root.V,d);var f=b.o-1>>>c&31;if(5===c)b=e;else{var g=d.f[f];b=null!=g?Jf(b,c-5,g,e):qf(b.root.V,c-5,e)}d.f[f]=b;return d};function zf(a,b,c,d){this.o=a;this.shift=b;this.root=c;this.R=d;this.C=88;this.g=275}k=zf.prototype;
k.Rb=function(a,b){if(this.root.V){if(32>this.o-pf(this))this.R[this.o&31]=b;else{var c=new nf(this.root.V,this.R),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.R=d;if(this.o>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=qf(this.root.V,this.shift,c);this.root=new nf(this.root.V,d);this.shift=e}else this.root=Jf(this,this.shift,this.root,c)}this.o+=1;return this}throw Error("conj! after persistent!");};k.Sb=function(){if(this.root.V){this.root.V=null;var a=this.o-pf(this),b=Array(a);Bd(this.R,0,b,0,a);return new R(null,this.o,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
k.Qb=function(a,b,c){if("number"===typeof b)return Xb(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
k.zc=function(a,b,c){var d=this;if(d.root.V){if(0<=b&&b<d.o)return pf(this)<=b?d.R[b&31]=c:(a=function(){return function f(a,h){var l=If(d.root.V,h);if(0===a)l.f[b&31]=c;else{var m=b>>>a&31,n=f(a-5,l.f[m]);l.f[m]=n}return l}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.o)return Ub(this,c);throw Error([A("Index "),A(b),A(" out of bounds for TransientVector of length"),A(d.o)].join(""));}throw Error("assoc! after persistent!");};
k.Z=function(){if(this.root.V)return this.o;throw Error("count after persistent!");};k.ca=function(a,b){if(this.root.V)return uf(this,b)[b&31];throw Error("nth after persistent!");};k.Ea=function(a,b,c){return 0<=b&&b<this.o?D.a(this,b):c};k.N=function(a,b){return nb.c(this,b,null)};k.I=function(a,b,c){return"number"===typeof b?D.c(this,b,c):c};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};function Kf(){this.g=2097152;this.C=0}
Kf.prototype.equiv=function(a){return this.D(null,a)};Kf.prototype.D=function(){return!1};var Lf=new Kf;function Mf(a,b){return Ed(vd(b)?O(a)===O(b)?Fe(Ld,T.a(function(a){return rc.a(G.c(b,J(a),Lf),gd(a))},a)):null:null)}function Nf(a,b,c,d,e){this.s=a;this.qd=b;this.uc=c;this.fd=d;this.Kc=e}Nf.prototype.ya=function(){var a=this.s<this.uc;return a?a:this.Kc.ya()};Nf.prototype.next=function(){if(this.s<this.uc){var a=ld(this.fd,this.s);this.s+=1;return new R(null,2,5,S,[a,nb.a(this.qd,a)],null)}return this.Kc.next()};
Nf.prototype.remove=function(){return Error("Unsupported operation")};function Of(a){this.J=a}Of.prototype.next=function(){if(null!=this.J){var a=J(this.J),b=Q(a,0),a=Q(a,1);this.J=K(this.J);return{value:[b,a],done:!1}}return{value:null,done:!0}};function Pf(a){return new Of(I(a))}function Qf(a){this.J=a}Qf.prototype.next=function(){if(null!=this.J){var a=J(this.J);this.J=K(this.J);return{value:[a,a],done:!1}}return{value:null,done:!0}};
function Rf(a,b){var c;if(b instanceof y)a:{c=a.length;for(var d=b.Ha,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof y&&d===a[e].Ha){c=e;break a}e+=2}}else if("string"==typeof b||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof qc)a:for(c=a.length,d=b.$a,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof qc&&d===a[e].$a){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=
a.length,d=0;;){if(c<=d){c=-1;break a}if(rc.a(b,a[d])){c=d;break a}d+=2}return c}Sf;function Tf(a,b,c){this.f=a;this.s=b;this.Da=c;this.g=32374990;this.C=0}k=Tf.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.O=function(){return this.Da};k.wa=function(){return this.s<this.f.length-2?new Tf(this.f,this.s+2,this.Da):null};k.Z=function(){return(this.f.length-this.s)/2};k.T=function(){return Kc(this)};k.D=function(a,b){return Pc(this,b)};
k.da=function(){return Qc(Ec,this.Da)};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){return new R(null,2,5,S,[this.f[this.s],this.f[this.s+1]],null)};k.xa=function(){return this.s<this.f.length-2?new Tf(this.f,this.s+2,this.Da):Ec};k.U=function(){return this};k.P=function(a,b){return new Tf(this.f,this.s,b)};k.X=function(a,b){return N(b,this)};Tf.prototype[Ya]=function(){return Gc(this)};Uf;Vf;function Wf(a,b,c){this.f=a;this.s=b;this.o=c}
Wf.prototype.ya=function(){return this.s<this.o};Wf.prototype.next=function(){var a=new R(null,2,5,S,[this.f[this.s],this.f[this.s+1]],null);this.s+=2;return a};function u(a,b,c,d){this.v=a;this.o=b;this.f=c;this.u=d;this.g=16647951;this.C=8196}k=u.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.keys=function(){return Gc(Uf.b?Uf.b(this):Uf.call(null,this))};k.entries=function(){return Pf(I(this))};
k.values=function(){return Gc(Vf.b?Vf.b(this):Vf.call(null,this))};k.has=function(a){return Fd(this,a)};k.get=function(a,b){return this.I(null,a,b)};k.forEach=function(a){for(var b=I(this),c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e),g=Q(f,0),f=Q(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=I(b))zd(b)?(c=ac(b),b=bc(b),g=c,d=O(c),c=g):(c=J(b),g=Q(c,0),f=Q(c,1),a.a?a.a(f,g):a.call(null,f,g),b=K(b),c=null,d=0),e=0;else return null};k.N=function(a,b){return nb.c(this,b,null)};
k.I=function(a,b,c){a=Rf(this.f,b);return-1===a?c:this.f[a+1]};k.Lb=function(a,b,c){a=this.f.length;for(var d=0;;)if(d<a){var e=this.f[d],f=this.f[d+1];c=b.c?b.c(c,e,f):b.call(null,c,e,f);if(Tc(c))return M.b?M.b(c):M.call(null,c);d+=2}else return c};k.Ga=function(){return new Wf(this.f,0,2*this.o)};k.O=function(){return this.v};k.Z=function(){return this.o};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Mc(this)};
k.D=function(a,b){if(null!=b&&(b.g&1024||b.Uc)){var c=this.f.length;if(this.o===b.Z(null))for(var d=0;;)if(d<c){var e=b.I(null,this.f[d],Cd);if(e!==Cd)if(rc.a(this.f[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return Mf(this,b)};k.vb=function(){return new Sf({},this.f.length,Za(this.f))};k.da=function(){return Eb(De,this.v)};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};
k.ib=function(a,b){if(0<=Rf(this.f,b)){var c=this.f.length,d=c-2;if(0===d)return db(this);for(var d=Array(d),e=0,f=0;;){if(e>=c)return new u(this.v,this.o-1,d,null);rc.a(b,this.f[e])||(d[f]=this.f[e],d[f+1]=this.f[e+1],f+=2);e+=2}}else return this};
k.Oa=function(a,b,c){a=Rf(this.f,b);if(-1===a){if(this.o<Xf){a=this.f;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new u(this.v,this.o+1,e,null)}return Eb(qb(df.a(Yf,this),b,c),this.v)}if(c===this.f[a+1])return this;b=Za(this.f);b[a+1]=c;return new u(this.v,this.o,b,null)};k.lc=function(a,b){return-1!==Rf(this.f,b)};k.U=function(){var a=this.f;return 0<=a.length-2?new Tf(a,0,null):null};k.P=function(a,b){return new u(b,this.o,this.f,this.u)};
k.X=function(a,b){if(wd(b))return qb(this,D.a(b,0),D.a(b,1));for(var c=this,d=I(b);;){if(null==d)return c;var e=J(d);if(wd(e))c=qb(c,D.a(e,0),D.a(e,1)),d=K(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};var De=new u(null,0,[],Nc),Xf=8;u.prototype[Ya]=function(){return Gc(this)};
Zf;function Sf(a,b,c){this.Bb=a;this.qb=b;this.f=c;this.g=258;this.C=56}k=Sf.prototype;k.Z=function(){if(x(this.Bb))return Vd(this.qb);throw Error("count after persistent!");};k.N=function(a,b){return nb.c(this,b,null)};k.I=function(a,b,c){if(x(this.Bb))return a=Rf(this.f,b),-1===a?c:this.f[a+1];throw Error("lookup after persistent!");};
k.Rb=function(a,b){if(x(this.Bb)){if(null!=b?b.g&2048||b.Vc||(b.g?0:Ua(tb,b)):Ua(tb,b))return Wb(this,Zd.b?Zd.b(b):Zd.call(null,b),$d.b?$d.b(b):$d.call(null,b));for(var c=I(b),d=this;;){var e=J(c);if(x(e))c=K(c),d=Wb(d,Zd.b?Zd.b(e):Zd.call(null,e),$d.b?$d.b(e):$d.call(null,e));else return d}}else throw Error("conj! after persistent!");};k.Sb=function(){if(x(this.Bb))return this.Bb=!1,new u(null,Vd(this.qb),this.f,null);throw Error("persistent! called twice");};
k.Qb=function(a,b,c){if(x(this.Bb)){a=Rf(this.f,b);if(-1===a)return this.qb+2<=2*Xf?(this.qb+=2,this.f.push(b),this.f.push(c),this):we(Zf.a?Zf.a(this.qb,this.f):Zf.call(null,this.qb,this.f),b,c);c!==this.f[a+1]&&(this.f[a+1]=c);return this}throw Error("assoc! after persistent!");};$f;md;function Zf(a,b){for(var c=Tb(Yf),d=0;;)if(d<a)c=Wb(c,b[d],b[d+1]),d+=2;else return c}function ag(){this.H=!1}bg;cg;Qe;dg;X;M;function eg(a,b){return a===b?!0:V(a,b)?!0:rc.a(a,b)}
function fg(a,b,c){a=Za(a);a[b]=c;return a}function gg(a,b){var c=Array(a.length-2);Bd(a,0,c,0,2*b);Bd(a,2*(b+1),c,2*b,c.length-2*b);return c}function hg(a,b,c,d){a=a.mb(b);a.f[c]=d;return a}function ig(a,b,c){for(var d=a.length,e=0,f=c;;)if(e<d){c=a[e];if(null!=c){var g=a[e+1];c=b.c?b.c(f,c,g):b.call(null,f,c,g)}else c=a[e+1],c=null!=c?c.pb(b,f):f;if(Tc(c))return M.b?M.b(c):M.call(null,c);e+=2;f=c}else return f}jg;function kg(a,b,c,d){this.f=a;this.s=b;this.Zb=c;this.Ra=d}
kg.prototype.advance=function(){for(var a=this.f.length;;)if(this.s<a){var b=this.f[this.s],c=this.f[this.s+1];null!=b?b=this.Zb=new R(null,2,5,S,[b,c],null):null!=c?(b=hc(c),b=b.ya()?this.Ra=b:!1):b=!1;this.s+=2;if(b)return!0}else return!1};kg.prototype.ya=function(){var a=null!=this.Zb;return a?a:(a=null!=this.Ra)?a:this.advance()};
kg.prototype.next=function(){if(null!=this.Zb){var a=this.Zb;this.Zb=null;return a}if(null!=this.Ra)return a=this.Ra.next(),this.Ra.ya()||(this.Ra=null),a;if(this.advance())return this.next();throw Error("No such element");};kg.prototype.remove=function(){return Error("Unsupported operation")};function lg(a,b,c){this.V=a;this.$=b;this.f=c}k=lg.prototype;k.mb=function(a){if(a===this.V)return this;var b=Wd(this.$),c=Array(0>b?4:2*(b+1));Bd(this.f,0,c,0,2*b);return new lg(a,this.$,c)};
k.Wb=function(){return bg.b?bg.b(this.f):bg.call(null,this.f)};k.pb=function(a,b){return ig(this.f,a,b)};k.fb=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.$&e))return d;var f=Wd(this.$&e-1),e=this.f[2*f],f=this.f[2*f+1];return null==e?f.fb(a+5,b,c,d):eg(c,e)?f:d};
k.Qa=function(a,b,c,d,e,f){var g=1<<(c>>>b&31),h=Wd(this.$&g-1);if(0===(this.$&g)){var l=Wd(this.$);if(2*l<this.f.length){a=this.mb(a);b=a.f;f.H=!0;a:for(c=2*(l-h),f=2*h+(c-1),l=2*(h+1)+(c-1);;){if(0===c)break a;b[l]=b[f];--l;--c;--f}b[2*h]=d;b[2*h+1]=e;a.$|=g;return a}if(16<=l){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[c>>>b&31]=mg.Qa(a,b+5,c,d,e,f);for(e=d=0;;)if(32>d)0!==
(this.$>>>d&1)&&(h[d]=null!=this.f[e]?mg.Qa(a,b+5,wc(this.f[e]),this.f[e],this.f[e+1],f):this.f[e+1],e+=2),d+=1;else break;return new jg(a,l+1,h)}b=Array(2*(l+4));Bd(this.f,0,b,0,2*h);b[2*h]=d;b[2*h+1]=e;Bd(this.f,2*h,b,2*(h+1),2*(l-h));f.H=!0;a=this.mb(a);a.f=b;a.$|=g;return a}l=this.f[2*h];g=this.f[2*h+1];if(null==l)return l=g.Qa(a,b+5,c,d,e,f),l===g?this:hg(this,a,2*h+1,l);if(eg(d,l))return e===g?this:hg(this,a,2*h+1,e);f.H=!0;f=b+5;d=dg.ba?dg.ba(a,f,l,g,c,d,e):dg.call(null,a,f,l,g,c,d,e);e=2*
h;h=2*h+1;a=this.mb(a);a.f[e]=null;a.f[h]=d;return a};
k.Pa=function(a,b,c,d,e){var f=1<<(b>>>a&31),g=Wd(this.$&f-1);if(0===(this.$&f)){var h=Wd(this.$);if(16<=h){g=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];g[b>>>a&31]=mg.Pa(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.$>>>c&1)&&(g[c]=null!=this.f[d]?mg.Pa(a+5,wc(this.f[d]),this.f[d],this.f[d+1],e):this.f[d+1],d+=2),c+=1;else break;return new jg(null,h+1,g)}a=Array(2*(h+1));Bd(this.f,
0,a,0,2*g);a[2*g]=c;a[2*g+1]=d;Bd(this.f,2*g,a,2*(g+1),2*(h-g));e.H=!0;return new lg(null,this.$|f,a)}var l=this.f[2*g],f=this.f[2*g+1];if(null==l)return h=f.Pa(a+5,b,c,d,e),h===f?this:new lg(null,this.$,fg(this.f,2*g+1,h));if(eg(c,l))return d===f?this:new lg(null,this.$,fg(this.f,2*g+1,d));e.H=!0;e=this.$;h=this.f;a+=5;a=dg.Y?dg.Y(a,l,f,b,c,d):dg.call(null,a,l,f,b,c,d);c=2*g;g=2*g+1;d=Za(h);d[c]=null;d[g]=a;return new lg(null,e,d)};
k.Xb=function(a,b,c){var d=1<<(b>>>a&31);if(0===(this.$&d))return this;var e=Wd(this.$&d-1),f=this.f[2*e],g=this.f[2*e+1];return null==f?(a=g.Xb(a+5,b,c),a===g?this:null!=a?new lg(null,this.$,fg(this.f,2*e+1,a)):this.$===d?null:new lg(null,this.$^d,gg(this.f,e))):eg(c,f)?new lg(null,this.$^d,gg(this.f,e)):this};k.Ga=function(){return new kg(this.f,0,null,null)};var mg=new lg(null,0,[]);function ng(a,b,c){this.f=a;this.s=b;this.Ra=c}
ng.prototype.ya=function(){for(var a=this.f.length;;){if(null!=this.Ra&&this.Ra.ya())return!0;if(this.s<a){var b=this.f[this.s];this.s+=1;null!=b&&(this.Ra=hc(b))}else return!1}};ng.prototype.next=function(){if(this.ya())return this.Ra.next();throw Error("No such element");};ng.prototype.remove=function(){return Error("Unsupported operation")};function jg(a,b,c){this.V=a;this.o=b;this.f=c}k=jg.prototype;k.mb=function(a){return a===this.V?this:new jg(a,this.o,Za(this.f))};
k.Wb=function(){return cg.b?cg.b(this.f):cg.call(null,this.f)};k.pb=function(a,b){for(var c=this.f.length,d=0,e=b;;)if(d<c){var f=this.f[d];if(null!=f&&(e=f.pb(a,e),Tc(e)))return M.b?M.b(e):M.call(null,e);d+=1}else return e};k.fb=function(a,b,c,d){var e=this.f[b>>>a&31];return null!=e?e.fb(a+5,b,c,d):d};k.Qa=function(a,b,c,d,e,f){var g=c>>>b&31,h=this.f[g];if(null==h)return a=hg(this,a,g,mg.Qa(a,b+5,c,d,e,f)),a.o+=1,a;b=h.Qa(a,b+5,c,d,e,f);return b===h?this:hg(this,a,g,b)};
k.Pa=function(a,b,c,d,e){var f=b>>>a&31,g=this.f[f];if(null==g)return new jg(null,this.o+1,fg(this.f,f,mg.Pa(a+5,b,c,d,e)));a=g.Pa(a+5,b,c,d,e);return a===g?this:new jg(null,this.o,fg(this.f,f,a))};
k.Xb=function(a,b,c){var d=b>>>a&31,e=this.f[d];if(null!=e){a=e.Xb(a+5,b,c);if(a===e)d=this;else if(null==a)if(8>=this.o)a:{e=this.f;a=e.length;b=Array(2*(this.o-1));c=0;for(var f=1,g=0;;)if(c<a)c!==d&&null!=e[c]&&(b[f]=e[c],f+=2,g|=1<<c),c+=1;else{d=new lg(null,g,b);break a}}else d=new jg(null,this.o-1,fg(this.f,d,a));else d=new jg(null,this.o,fg(this.f,d,a));return d}return this};k.Ga=function(){return new ng(this.f,0,null)};
function og(a,b,c){b*=2;for(var d=0;;)if(d<b){if(eg(c,a[d]))return d;d+=2}else return-1}function pg(a,b,c,d){this.V=a;this.bb=b;this.o=c;this.f=d}k=pg.prototype;k.mb=function(a){if(a===this.V)return this;var b=Array(2*(this.o+1));Bd(this.f,0,b,0,2*this.o);return new pg(a,this.bb,this.o,b)};k.Wb=function(){return bg.b?bg.b(this.f):bg.call(null,this.f)};k.pb=function(a,b){return ig(this.f,a,b)};k.fb=function(a,b,c,d){a=og(this.f,this.o,c);return 0>a?d:eg(c,this.f[a])?this.f[a+1]:d};
k.Qa=function(a,b,c,d,e,f){if(c===this.bb){b=og(this.f,this.o,d);if(-1===b){if(this.f.length>2*this.o)return b=2*this.o,c=2*this.o+1,a=this.mb(a),a.f[b]=d,a.f[c]=e,f.H=!0,a.o+=1,a;c=this.f.length;b=Array(c+2);Bd(this.f,0,b,0,c);b[c]=d;b[c+1]=e;f.H=!0;d=this.o+1;a===this.V?(this.f=b,this.o=d,a=this):a=new pg(this.V,this.bb,d,b);return a}return this.f[b+1]===e?this:hg(this,a,b+1,e)}return(new lg(a,1<<(this.bb>>>b&31),[null,this,null,null])).Qa(a,b,c,d,e,f)};
k.Pa=function(a,b,c,d,e){return b===this.bb?(a=og(this.f,this.o,c),-1===a?(a=2*this.o,b=Array(a+2),Bd(this.f,0,b,0,a),b[a]=c,b[a+1]=d,e.H=!0,new pg(null,this.bb,this.o+1,b)):rc.a(this.f[a],d)?this:new pg(null,this.bb,this.o,fg(this.f,a+1,d))):(new lg(null,1<<(this.bb>>>a&31),[null,this])).Pa(a,b,c,d,e)};k.Xb=function(a,b,c){a=og(this.f,this.o,c);return-1===a?this:1===this.o?null:new pg(null,this.bb,this.o-1,gg(this.f,Vd(a)))};k.Ga=function(){return new kg(this.f,0,null,null)};
var dg=function dg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return dg.Y(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return dg.ba(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
dg.Y=function(a,b,c,d,e,f){var g=wc(b);if(g===d)return new pg(null,g,2,[b,c,e,f]);var h=new ag;return mg.Pa(a,g,b,c,h).Pa(a,d,e,f,h)};dg.ba=function(a,b,c,d,e,f,g){var h=wc(c);if(h===e)return new pg(null,h,2,[c,d,f,g]);var l=new ag;return mg.Qa(a,b,h,c,d,l).Qa(a,b,e,f,g,l)};dg.w=7;function qg(a,b,c,d,e){this.v=a;this.gb=b;this.s=c;this.J=d;this.u=e;this.g=32374860;this.C=0}k=qg.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.O=function(){return this.v};
k.T=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.da=function(){return Qc(Ec,this.v)};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){return null==this.J?new R(null,2,5,S,[this.gb[this.s],this.gb[this.s+1]],null):J(this.J)};
k.xa=function(){if(null==this.J){var a=this.gb,b=this.s+2;return bg.c?bg.c(a,b,null):bg.call(null,a,b,null)}var a=this.gb,b=this.s,c=K(this.J);return bg.c?bg.c(a,b,c):bg.call(null,a,b,c)};k.U=function(){return this};k.P=function(a,b){return new qg(b,this.gb,this.s,this.J,this.u)};k.X=function(a,b){return N(b,this)};qg.prototype[Ya]=function(){return Gc(this)};
var bg=function bg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return bg.b(arguments[0]);case 3:return bg.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};bg.b=function(a){return bg.c(a,0,null)};
bg.c=function(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new qg(null,a,b,null,null);var d=a[b+1];if(x(d)&&(d=d.Wb(),x(d)))return new qg(null,a,b+2,d,null);b+=2}else return null;else return new qg(null,a,b,c,null)};bg.w=3;function rg(a,b,c,d,e){this.v=a;this.gb=b;this.s=c;this.J=d;this.u=e;this.g=32374860;this.C=0}k=rg.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.O=function(){return this.v};
k.T=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.da=function(){return Qc(Ec,this.v)};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){return J(this.J)};k.xa=function(){var a=this.gb,b=this.s,c=K(this.J);return cg.m?cg.m(null,a,b,c):cg.call(null,null,a,b,c)};k.U=function(){return this};k.P=function(a,b){return new rg(b,this.gb,this.s,this.J,this.u)};k.X=function(a,b){return N(b,this)};
rg.prototype[Ya]=function(){return Gc(this)};var cg=function cg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return cg.b(arguments[0]);case 4:return cg.m(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};cg.b=function(a){return cg.m(null,a,0,null)};
cg.m=function(a,b,c,d){if(null==d)for(d=b.length;;)if(c<d){var e=b[c];if(x(e)&&(e=e.Wb(),x(e)))return new rg(a,b,c+1,e,null);c+=1}else return null;else return new rg(a,b,c,d,null)};cg.w=4;$f;function sg(a,b,c){this.Aa=a;this.Mc=b;this.tc=c}sg.prototype.ya=function(){return this.tc&&this.Mc.ya()};sg.prototype.next=function(){if(this.tc)return this.Mc.next();this.tc=!0;return this.Aa};sg.prototype.remove=function(){return Error("Unsupported operation")};
function md(a,b,c,d,e,f){this.v=a;this.o=b;this.root=c;this.za=d;this.Aa=e;this.u=f;this.g=16123663;this.C=8196}k=md.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.keys=function(){return Gc(Uf.b?Uf.b(this):Uf.call(null,this))};k.entries=function(){return Pf(I(this))};k.values=function(){return Gc(Vf.b?Vf.b(this):Vf.call(null,this))};k.has=function(a){return Fd(this,a)};k.get=function(a,b){return this.I(null,a,b)};
k.forEach=function(a){for(var b=I(this),c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e),g=Q(f,0),f=Q(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=I(b))zd(b)?(c=ac(b),b=bc(b),g=c,d=O(c),c=g):(c=J(b),g=Q(c,0),f=Q(c,1),a.a?a.a(f,g):a.call(null,f,g),b=K(b),c=null,d=0),e=0;else return null};k.N=function(a,b){return nb.c(this,b,null)};k.I=function(a,b,c){return null==b?this.za?this.Aa:c:null==this.root?c:this.root.fb(0,wc(b),b,c)};
k.Lb=function(a,b,c){a=this.za?b.c?b.c(c,null,this.Aa):b.call(null,c,null,this.Aa):c;return Tc(a)?M.b?M.b(a):M.call(null,a):null!=this.root?this.root.pb(b,a):a};k.Ga=function(){var a=this.root?hc(this.root):ze;return this.za?new sg(this.Aa,a,!1):a};k.O=function(){return this.v};k.Z=function(){return this.o};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Mc(this)};k.D=function(a,b){return Mf(this,b)};k.vb=function(){return new $f({},this.root,this.o,this.za,this.Aa)};
k.da=function(){return Eb(Yf,this.v)};k.ib=function(a,b){if(null==b)return this.za?new md(this.v,this.o-1,this.root,!1,null,null):this;if(null==this.root)return this;var c=this.root.Xb(0,wc(b),b);return c===this.root?this:new md(this.v,this.o-1,c,this.za,this.Aa,null)};
k.Oa=function(a,b,c){if(null==b)return this.za&&c===this.Aa?this:new md(this.v,this.za?this.o:this.o+1,this.root,!0,c,null);a=new ag;b=(null==this.root?mg:this.root).Pa(0,wc(b),b,c,a);return b===this.root?this:new md(this.v,a.H?this.o+1:this.o,b,this.za,this.Aa,null)};k.lc=function(a,b){return null==b?this.za:null==this.root?!1:this.root.fb(0,wc(b),b,Cd)!==Cd};k.U=function(){if(0<this.o){var a=null!=this.root?this.root.Wb():null;return this.za?N(new R(null,2,5,S,[null,this.Aa],null),a):a}return null};
k.P=function(a,b){return new md(b,this.o,this.root,this.za,this.Aa,this.u)};k.X=function(a,b){if(wd(b))return qb(this,D.a(b,0),D.a(b,1));for(var c=this,d=I(b);;){if(null==d)return c;var e=J(d);if(wd(e))c=qb(c,D.a(e,0),D.a(e,1)),d=K(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};var Yf=new md(null,0,null,!1,null,Nc);
function od(a,b){for(var c=a.length,d=0,e=Tb(Yf);;)if(d<c)var f=d+1,e=e.Qb(null,a[d],b[d]),d=f;else return Vb(e)}md.prototype[Ya]=function(){return Gc(this)};function $f(a,b,c,d,e){this.V=a;this.root=b;this.count=c;this.za=d;this.Aa=e;this.g=258;this.C=56}function tg(a,b,c){if(a.V){if(null==b)a.Aa!==c&&(a.Aa=c),a.za||(a.count+=1,a.za=!0);else{var d=new ag;b=(null==a.root?mg:a.root).Qa(a.V,0,wc(b),b,c,d);b!==a.root&&(a.root=b);d.H&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}k=$f.prototype;
k.Z=function(){if(this.V)return this.count;throw Error("count after persistent!");};k.N=function(a,b){return null==b?this.za?this.Aa:null:null==this.root?null:this.root.fb(0,wc(b),b)};k.I=function(a,b,c){return null==b?this.za?this.Aa:c:null==this.root?c:this.root.fb(0,wc(b),b,c)};
k.Rb=function(a,b){var c;a:if(this.V)if(null!=b?b.g&2048||b.Vc||(b.g?0:Ua(tb,b)):Ua(tb,b))c=tg(this,Zd.b?Zd.b(b):Zd.call(null,b),$d.b?$d.b(b):$d.call(null,b));else{c=I(b);for(var d=this;;){var e=J(c);if(x(e))c=K(c),d=tg(d,Zd.b?Zd.b(e):Zd.call(null,e),$d.b?$d.b(e):$d.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};k.Sb=function(){var a;if(this.V)this.V=null,a=new md(null,this.count,this.root,this.za,this.Aa,null);else throw Error("persistent! called twice");return a};
k.Qb=function(a,b,c){return tg(this,b,c)};ug;vg;var wg=function wg(b,c,d){d=null!=b.left?wg(b.left,c,d):d;if(Tc(d))return M.b?M.b(d):M.call(null,d);var e=b.key,f=b.H;d=c.c?c.c(d,e,f):c.call(null,d,e,f);if(Tc(d))return M.b?M.b(d):M.call(null,d);b=null!=b.right?wg(b.right,c,d):d;return Tc(b)?M.b?M.b(b):M.call(null,b):b};function vg(a,b,c,d,e){this.key=a;this.H=b;this.left=c;this.right=d;this.u=e;this.g=32402207;this.C=0}k=vg.prototype;k.replace=function(a,b,c,d){return new vg(a,b,c,d,null)};
k.pb=function(a,b){return wg(this,a,b)};k.N=function(a,b){return D.c(this,b,null)};k.I=function(a,b,c){return D.c(this,b,c)};k.ca=function(a,b){return 0===b?this.key:1===b?this.H:null};k.Ea=function(a,b,c){return 0===b?this.key:1===b?this.H:c};k.kb=function(a,b,c){return(new R(null,2,5,S,[this.key,this.H],null)).kb(null,b,c)};k.O=function(){return null};k.Z=function(){return 2};k.Mb=function(){return this.key};k.Nb=function(){return this.H};k.jb=function(){return this.H};
k.T=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.da=function(){return jd};k.ea=function(a,b){return Uc(this,b)};k.fa=function(a,b,c){return Vc(this,b,c)};k.Oa=function(a,b,c){return nd.c(new R(null,2,5,S,[this.key,this.H],null),b,c)};k.U=function(){return fb(fb(Ec,this.H),this.key)};k.P=function(a,b){return Qc(new R(null,2,5,S,[this.key,this.H],null),b)};k.X=function(a,b){return new R(null,3,5,S,[this.key,this.H,b],null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};vg.prototype[Ya]=function(){return Gc(this)};
function ug(a,b,c,d,e){this.key=a;this.H=b;this.left=c;this.right=d;this.u=e;this.g=32402207;this.C=0}k=ug.prototype;k.replace=function(a,b,c,d){return new ug(a,b,c,d,null)};k.pb=function(a,b){return wg(this,a,b)};k.N=function(a,b){return D.c(this,b,null)};k.I=function(a,b,c){return D.c(this,b,c)};k.ca=function(a,b){return 0===b?this.key:1===b?this.H:null};k.Ea=function(a,b,c){return 0===b?this.key:1===b?this.H:c};k.kb=function(a,b,c){return(new R(null,2,5,S,[this.key,this.H],null)).kb(null,b,c)};
k.O=function(){return null};k.Z=function(){return 2};k.Mb=function(){return this.key};k.Nb=function(){return this.H};k.jb=function(){return this.H};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.da=function(){return jd};k.ea=function(a,b){return Uc(this,b)};k.fa=function(a,b,c){return Vc(this,b,c)};k.Oa=function(a,b,c){return nd.c(new R(null,2,5,S,[this.key,this.H],null),b,c)};k.U=function(){return fb(fb(Ec,this.H),this.key)};
k.P=function(a,b){return Qc(new R(null,2,5,S,[this.key,this.H],null),b)};k.X=function(a,b){return new R(null,3,5,S,[this.key,this.H,b],null)};k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};
k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};ug.prototype[Ya]=function(){return Gc(this)};Zd;var Oc=function Oc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Oc.h(0<c.length?new Cc(c.slice(0),0):null)};Oc.h=function(a){a=I(a);for(var b=Tb(Yf);;)if(a){var c=K(K(a)),b=we(b,J(a),gd(a));a=c}else return Vb(b)};Oc.w=0;Oc.B=function(a){return Oc.h(I(a))};function xg(a,b){this.K=a;this.Da=b;this.g=32374988;this.C=0}k=xg.prototype;
k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.O=function(){return this.Da};k.wa=function(){var a=(null!=this.K?this.K.g&128||this.K.ac||(this.K.g?0:Ua(lb,this.K)):Ua(lb,this.K))?this.K.wa(null):K(this.K);return null==a?null:new xg(a,this.Da)};k.T=function(){return Kc(this)};k.D=function(a,b){return Pc(this,b)};k.da=function(){return Qc(Ec,this.Da)};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){return this.K.ta(null).Mb(null)};
k.xa=function(){var a=(null!=this.K?this.K.g&128||this.K.ac||(this.K.g?0:Ua(lb,this.K)):Ua(lb,this.K))?this.K.wa(null):K(this.K);return null!=a?new xg(a,this.Da):Ec};k.U=function(){return this};k.P=function(a,b){return new xg(this.K,b)};k.X=function(a,b){return N(b,this)};xg.prototype[Ya]=function(){return Gc(this)};function Uf(a){return(a=I(a))?new xg(a,null):null}function Zd(a){return ub(a)}function yg(a,b){this.K=a;this.Da=b;this.g=32374988;this.C=0}k=yg.prototype;k.toString=function(){return jc(this)};
k.equiv=function(a){return this.D(null,a)};k.O=function(){return this.Da};k.wa=function(){var a=(null!=this.K?this.K.g&128||this.K.ac||(this.K.g?0:Ua(lb,this.K)):Ua(lb,this.K))?this.K.wa(null):K(this.K);return null==a?null:new yg(a,this.Da)};k.T=function(){return Kc(this)};k.D=function(a,b){return Pc(this,b)};k.da=function(){return Qc(Ec,this.Da)};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){return this.K.ta(null).Nb(null)};
k.xa=function(){var a=(null!=this.K?this.K.g&128||this.K.ac||(this.K.g?0:Ua(lb,this.K)):Ua(lb,this.K))?this.K.wa(null):K(this.K);return null!=a?new yg(a,this.Da):Ec};k.U=function(){return this};k.P=function(a,b){return new yg(this.K,b)};k.X=function(a,b){return N(b,this)};yg.prototype[Ya]=function(){return Gc(this)};function Vf(a){return(a=I(a))?new yg(a,null):null}function $d(a){return vb(a)}
var zg=function zg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return zg.h(0<c.length?new Cc(c.slice(0),0):null)};zg.h=function(a){return x(Ge(Ld,a))?$a.a(function(a,c){return id.a(x(a)?a:De,c)},a):null};zg.w=0;zg.B=function(a){return zg.h(I(a))};Ag;function Bg(a){this.Db=a}Bg.prototype.ya=function(){return this.Db.ya()};Bg.prototype.next=function(){if(this.Db.ya())return this.Db.next().R[0];throw Error("No such element");};Bg.prototype.remove=function(){return Error("Unsupported operation")};
function Cg(a,b,c){this.v=a;this.nb=b;this.u=c;this.g=15077647;this.C=8196}k=Cg.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.keys=function(){return Gc(I(this))};k.entries=function(){var a=I(this);return new Qf(I(a))};k.values=function(){return Gc(I(this))};k.has=function(a){return Fd(this,a)};
k.forEach=function(a){for(var b=I(this),c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e),g=Q(f,0),f=Q(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=I(b))zd(b)?(c=ac(b),b=bc(b),g=c,d=O(c),c=g):(c=J(b),g=Q(c,0),f=Q(c,1),a.a?a.a(f,g):a.call(null,f,g),b=K(b),c=null,d=0),e=0;else return null};k.N=function(a,b){return nb.c(this,b,null)};k.I=function(a,b,c){return pb(this.nb,b)?b:c};k.Ga=function(){return new Bg(hc(this.nb))};k.O=function(){return this.v};k.Z=function(){return cb(this.nb)};
k.T=function(){var a=this.u;return null!=a?a:this.u=a=Mc(this)};k.D=function(a,b){return td(b)&&O(this)===O(b)&&Fe(function(a){return function(b){return Fd(a,b)}}(this),b)};k.vb=function(){return new Ag(Tb(this.nb))};k.da=function(){return Qc(Dg,this.v)};k.U=function(){return Uf(this.nb)};k.P=function(a,b){return new Cg(b,this.nb,this.u)};k.X=function(a,b){return new Cg(this.v,nd.c(this.nb,b,null),null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};var Dg=new Cg(null,De,Nc);Cg.prototype[Ya]=function(){return Gc(this)};
function Ag(a){this.cb=a;this.C=136;this.g=259}k=Ag.prototype;k.Rb=function(a,b){this.cb=Wb(this.cb,b,null);return this};k.Sb=function(){return new Cg(null,Vb(this.cb),null)};k.Z=function(){return O(this.cb)};k.N=function(a,b){return nb.c(this,b,null)};k.I=function(a,b,c){return nb.c(this.cb,b,Cd)===Cd?c:b};
k.call=function(){function a(a,b,c){return nb.c(this.cb,b,Cd)===Cd?c:b}function b(a,b){return nb.c(this.cb,b,Cd)===Cd?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return nb.c(this.cb,a,Cd)===Cd?null:a};k.a=function(a,b){return nb.c(this.cb,a,Cd)===Cd?b:a};
function Eg(a,b){if(wd(b)){var c=O(b);return $a.c(function(){return function(b,c){var f=Gd(a,ld(b,c));return x(f)?nd.c(b,c,gd(f)):b}}(c),b,Te(c,Xe(Rc,0)))}return T.a(function(b){var c=Gd(a,b);return x(c)?gd(c):b},b)}function Fg(a){for(var b=jd;;)if(K(a))b=id.a(b,J(a)),a=K(a);else return I(b)}function Yd(a){if(null!=a&&(a.C&4096||a.Xc))return a.Ob(null);if("string"===typeof a)return a;throw Error([A("Doesn't support name: "),A(a)].join(""));}
var Gg=function Gg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Gg.a(arguments[0],arguments[1]);case 3:return Gg.c(arguments[0],arguments[1],arguments[2]);default:return Gg.h(arguments[0],arguments[1],arguments[2],new Cc(c.slice(3),0))}};Gg.a=function(a,b){return b};Gg.c=function(a,b,c){return(a.b?a.b(b):a.call(null,b))<(a.b?a.b(c):a.call(null,c))?b:c};
Gg.h=function(a,b,c,d){return $a.c(function(b,c){return Gg.c(a,b,c)},Gg.c(a,b,c),d)};Gg.B=function(a){var b=J(a),c=K(a);a=J(c);var d=K(c),c=J(d),d=K(d);return Gg.h(b,a,c,d)};Gg.w=3;function Hg(a,b){return new je(null,function(){var c=I(b);if(c){var d;d=J(c);d=a.b?a.b(d):a.call(null,d);c=x(d)?N(J(c),Hg(a,Dc(c))):null}else c=null;return c},null,null)}function Ig(a,b,c){this.s=a;this.end=b;this.step=c}Ig.prototype.ya=function(){return 0<this.step?this.s<this.end:this.s>this.end};
Ig.prototype.next=function(){var a=this.s;this.s+=this.step;return a};function Jg(a,b,c,d,e){this.v=a;this.start=b;this.end=c;this.step=d;this.u=e;this.g=32375006;this.C=8192}k=Jg.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.ca=function(a,b){if(b<cb(this))return this.start+b*this.step;if(this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};
k.Ea=function(a,b,c){return b<cb(this)?this.start+b*this.step:this.start>this.end&&0===this.step?this.start:c};k.Ga=function(){return new Ig(this.start,this.end,this.step)};k.O=function(){return this.v};k.wa=function(){return 0<this.step?this.start+this.step<this.end?new Jg(this.v,this.start+this.step,this.end,this.step,null):null:this.start+this.step>this.end?new Jg(this.v,this.start+this.step,this.end,this.step,null):null};k.Z=function(){return Sa(Lb(this))?0:Math.ceil((this.end-this.start)/this.step)};
k.T=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.da=function(){return Qc(Ec,this.v)};k.ea=function(a,b){return Uc(this,b)};k.fa=function(a,b,c){for(a=this.start;;)if(0<this.step?a<this.end:a>this.end){c=b.a?b.a(c,a):b.call(null,c,a);if(Tc(c))return M.b?M.b(c):M.call(null,c);a+=this.step}else return c};k.ta=function(){return null==Lb(this)?null:this.start};
k.xa=function(){return null!=Lb(this)?new Jg(this.v,this.start+this.step,this.end,this.step,null):Ec};k.U=function(){return 0<this.step?this.start<this.end?this:null:0>this.step?this.start>this.end?this:null:this.start===this.end?null:this};k.P=function(a,b){return new Jg(b,this.start,this.end,this.step,this.u)};k.X=function(a,b){return N(b,this)};Jg.prototype[Ya]=function(){return Gc(this)};
function Kg(a,b){return new je(null,function(){var c=I(b);if(c){var d=J(c),e=a.b?a.b(d):a.call(null,d),d=N(d,Hg(function(b,c){return function(b){return rc.a(c,a.b?a.b(b):a.call(null,b))}}(d,e,c,c),K(c)));return N(d,Kg(a,I(Ue(O(d),c))))}return null},null,null)}function Lg(a){return new je(null,function(){var b=I(a);return b?Mg(Nd,J(b),Dc(b)):fb(Ec,Nd.l?Nd.l():Nd.call(null))},null,null)}
function Mg(a,b,c){return N(b,new je(null,function(){var d=I(c);if(d){var e=Mg,f;f=J(d);f=a.a?a.a(b,f):a.call(null,b,f);d=e(a,f,Dc(d))}else d=null;return d},null,null))}
function Ng(a,b){return function(){function c(c,d,e){return new R(null,2,5,S,[a.c?a.c(c,d,e):a.call(null,c,d,e),b.c?b.c(c,d,e):b.call(null,c,d,e)],null)}function d(c,d){return new R(null,2,5,S,[a.a?a.a(c,d):a.call(null,c,d),b.a?b.a(c,d):b.call(null,c,d)],null)}function e(c){return new R(null,2,5,S,[a.b?a.b(c):a.call(null,c),b.b?b.b(c):b.call(null,c)],null)}function f(){return new R(null,2,5,S,[a.l?a.l():a.call(null),b.l?b.l():b.call(null)],null)}var g=null,h=function(){function c(a,b,e,f){var g=null;
if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;g=new Cc(h,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){return new R(null,2,5,S,[C.A(a,c,e,f,g),C.A(b,c,e,f,g)],null)}c.w=3;c.B=function(a){var b=J(a);a=K(a);var c=J(a);a=K(a);var e=J(a);a=Dc(a);return d(b,c,e,a)};c.h=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);
default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+3],++q;q=new Cc(r,0)}return h.h(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.B=h.B;g.l=f;g.b=e;g.a=d;g.c=c;g.h=h.h;return g}()}
function Af(a,b,c,d,e,f,g){var h=Ca;Ca=null==Ca?null:Ca-1;try{if(null!=Ca&&0>Ca)return Qb(a,"#");Qb(a,c);if(0===La.b(f))I(g)&&Qb(a,function(){var a=Og.b(f);return x(a)?a:"..."}());else{if(I(g)){var l=J(g);b.c?b.c(l,a,f):b.call(null,l,a,f)}for(var m=K(g),n=La.b(f)-1;;)if(!m||null!=n&&0===n){I(m)&&0===n&&(Qb(a,d),Qb(a,function(){var a=Og.b(f);return x(a)?a:"..."}()));break}else{Qb(a,d);var p=J(m);c=a;g=f;b.c?b.c(p,c,g):b.call(null,p,c,g);var q=K(m);c=n-1;m=q;n=c}}return Qb(a,e)}finally{Ca=h}}
function Pg(a,b){for(var c=I(b),d=null,e=0,f=0;;)if(f<e){var g=d.ca(null,f);Qb(a,g);f+=1}else if(c=I(c))d=c,zd(d)?(c=ac(d),e=bc(d),d=c,g=O(c),c=e,e=g):(g=J(d),Qb(a,g),c=K(d),d=null,e=0),f=0;else return null}var Qg={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function Rg(a){return[A('"'),A(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return Qg[a]})),A('"')].join("")}Sg;
function Tg(a,b){var c=Ed(G.a(a,Ia));return c?(c=null!=b?b.g&131072||b.Wc?!0:!1:!1)?null!=rd(b):c:c}
function Ug(a,b,c){if(null==a)return Qb(b,"nil");if(Tg(c,a)){Qb(b,"^");var d=rd(a);Bf.c?Bf.c(d,b,c):Bf.call(null,d,b,c);Qb(b," ")}if(a.xb)return a.Tb(a,b,c);if(null!=a&&(a.g&2147483648||a.aa))return a.M(null,b,c);if(!0===a||!1===a||"number"===typeof a)return Qb(b,""+A(a));if(null!=a&&a.constructor===Object)return Qb(b,"#js "),d=T.a(function(b){return new R(null,2,5,S,[ie.b(b),a[b]],null)},Ad(a)),Sg.m?Sg.m(d,Bf,b,c):Sg.call(null,d,Bf,b,c);if(Ra(a))return Af(b,Bf,"#js ["," ","]",c,a);if("string"==typeof a)return x(Ha.b(c))?
Qb(b,Rg(a)):Qb(b,a);if(ca(a)){var e=a.name;c=x(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return Pg(b,H(["#object[",c,' "',""+A(a),'"]'],0))}if(a instanceof Date)return c=function(a,b){for(var c=""+A(a);;)if(O(c)<b)c=[A("0"),A(c)].join("");else return c},Pg(b,H(['#inst "',""+A(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),3),"-",'00:00"'],
0));if(a instanceof RegExp)return Pg(b,H(['#"',a.source,'"'],0));if(null!=a&&(a.g&2147483648||a.aa))return Rb(a,b,c);if(x(a.constructor.eb))return Pg(b,H(["#object[",a.constructor.eb.replace(RegExp("/","g"),"."),"]"],0));e=a.constructor.name;c=x(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return Pg(b,H(["#object[",c," ",""+A(a),"]"],0))}function Bf(a,b,c){var d=Vg.b(c);return x(d)?(c=nd.c(c,Wg,Ug),d.c?d.c(a,b,c):d.call(null,a,b,c)):Ug(a,b,c)}
var Pe=function Pe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Pe.h(0<c.length?new Cc(c.slice(0),0):null)};Pe.h=function(a){var b=Fa();if(sd(a))b="";else{var c=A,d=new ra;a:{var e=new ic(d);Bf(J(a),e,b);a=I(K(a));for(var f=null,g=0,h=0;;)if(h<g){var l=f.ca(null,h);Qb(e," ");Bf(l,e,b);h+=1}else if(a=I(a))f=a,zd(f)?(a=ac(f),g=bc(f),f=a,l=O(a),a=g,g=l):(l=J(f),Qb(e," "),Bf(l,e,b),a=K(f),f=null,g=0),h=0;else break a}b=""+c(d)}return b};Pe.w=0;Pe.B=function(a){return Pe.h(I(a))};
function Sg(a,b,c,d){return Af(c,function(a,c,d){var h=ub(a);b.c?b.c(h,c,d):b.call(null,h,c,d);Qb(c," ");a=vb(a);return b.c?b.c(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,I(a))}Se.prototype.aa=!0;Se.prototype.M=function(a,b,c){Qb(b,"#object [cljs.core.Volatile ");Bf(new u(null,1,[Xg,this.state],null),b,c);return Qb(b,"]")};Cc.prototype.aa=!0;Cc.prototype.M=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};je.prototype.aa=!0;je.prototype.M=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};
qg.prototype.aa=!0;qg.prototype.M=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};vg.prototype.aa=!0;vg.prototype.M=function(a,b,c){return Af(b,Bf,"["," ","]",c,this)};Tf.prototype.aa=!0;Tf.prototype.M=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};Ic.prototype.aa=!0;Ic.prototype.M=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};yd.prototype.aa=!0;yd.prototype.M=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};ge.prototype.aa=!0;
ge.prototype.M=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};ad.prototype.aa=!0;ad.prototype.M=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};md.prototype.aa=!0;md.prototype.M=function(a,b,c){return Sg(this,Bf,b,c)};rg.prototype.aa=!0;rg.prototype.M=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};Hf.prototype.aa=!0;Hf.prototype.M=function(a,b,c){return Af(b,Bf,"["," ","]",c,this)};Cg.prototype.aa=!0;Cg.prototype.M=function(a,b,c){return Af(b,Bf,"#{"," ","}",c,this)};
xd.prototype.aa=!0;xd.prototype.M=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};Ne.prototype.aa=!0;Ne.prototype.M=function(a,b,c){Qb(b,"#object [cljs.core.Atom ");Bf(new u(null,1,[Xg,this.state],null),b,c);return Qb(b,"]")};yg.prototype.aa=!0;yg.prototype.M=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};ug.prototype.aa=!0;ug.prototype.M=function(a,b,c){return Af(b,Bf,"["," ","]",c,this)};R.prototype.aa=!0;R.prototype.M=function(a,b,c){return Af(b,Bf,"["," ","]",c,this)};
ee.prototype.aa=!0;ee.prototype.M=function(a,b){return Qb(b,"()")};Ee.prototype.aa=!0;Ee.prototype.M=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};u.prototype.aa=!0;u.prototype.M=function(a,b,c){return Sg(this,Bf,b,c)};Jg.prototype.aa=!0;Jg.prototype.M=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};xg.prototype.aa=!0;xg.prototype.M=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};bd.prototype.aa=!0;bd.prototype.M=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};qc.prototype.Ib=!0;
qc.prototype.ub=function(a,b){if(b instanceof qc)return zc(this,b);throw Error([A("Cannot compare "),A(this),A(" to "),A(b)].join(""));};y.prototype.Ib=!0;y.prototype.ub=function(a,b){if(b instanceof y)return he(this,b);throw Error([A("Cannot compare "),A(this),A(" to "),A(b)].join(""));};Hf.prototype.Ib=!0;Hf.prototype.ub=function(a,b){if(wd(b))return Hd(this,b);throw Error([A("Cannot compare "),A(this),A(" to "),A(b)].join(""));};R.prototype.Ib=!0;
R.prototype.ub=function(a,b){if(wd(b))return Hd(this,b);throw Error([A("Cannot compare "),A(this),A(" to "),A(b)].join(""));};var Yg=null;function Zg(a){null==Yg&&(Yg=X.b?X.b(0):X.call(null,0));return Ac.b([A(a),A(Re.a(Yg,Rc))].join(""))}function $g(a){return function(b,c){var d=a.a?a.a(b,c):a.call(null,b,c);return Tc(d)?new Sc(d):d}}
function $e(a){return function(b){return function(){function c(a,c){return $a.c(b,a,c)}function d(b){return a.b?a.b(b):a.call(null,b)}function e(){return a.l?a.l():a.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.l=e;f.b=d;f.a=c;return f}()}($g(a))}ah;function bh(){}
var ch=function ch(b){if(null!=b&&null!=b.Tc)return b.Tc(b);var c=ch[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ch._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IEncodeJS.-clj-\x3ejs",b);};dh;function eh(a){return(null!=a?a.Sc||(a.ec?0:Ua(bh,a)):Ua(bh,a))?ch(a):"string"===typeof a||"number"===typeof a||a instanceof y||a instanceof qc?dh.b?dh.b(a):dh.call(null,a):Pe.h(H([a],0))}
var dh=function dh(b){if(null==b)return null;if(null!=b?b.Sc||(b.ec?0:Ua(bh,b)):Ua(bh,b))return ch(b);if(b instanceof y)return Yd(b);if(b instanceof qc)return""+A(b);if(vd(b)){var c={};b=I(b);for(var d=null,e=0,f=0;;)if(f<e){var g=d.ca(null,f),h=Q(g,0),g=Q(g,1);c[eh(h)]=dh(g);f+=1}else if(b=I(b))zd(b)?(e=ac(b),b=bc(b),d=e,e=O(e)):(e=J(b),d=Q(e,0),e=Q(e,1),c[eh(d)]=dh(e),b=K(b),d=null,e=0),f=0;else break;return c}if(null==b?0:null!=b?b.g&8||b.xd||(b.g?0:Ua(eb,b)):Ua(eb,b)){c=[];b=I(T.a(dh,b));d=null;
for(f=e=0;;)if(f<e)h=d.ca(null,f),c.push(h),f+=1;else if(b=I(b))d=b,zd(d)?(b=ac(d),f=bc(d),d=b,e=O(b),b=f):(b=J(d),c.push(b),b=K(d),d=null,e=0),f=0;else break;return c}return b},ah=function ah(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return ah.l();case 1:return ah.b(arguments[0]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};ah.l=function(){return ah.b(1)};ah.b=function(a){return Math.random()*a};ah.w=1;
function fh(a,b){return ue($a.c(function(b,d){var e=a.b?a.b(d):a.call(null,d);return we(b,e,id.a(G.c(b,e,jd),d))},Tb(De),b))}var gh=null;function hh(){if(null==gh){var a=new u(null,3,[ih,De,jh,De,mh,De],null);gh=X.b?X.b(a):X.call(null,a)}return gh}
function nh(a,b,c){var d=rc.a(b,c);if(!d&&!(d=Fd(mh.b(a).call(null,b),c))&&(d=wd(c))&&(d=wd(b)))if(d=O(c)===O(b))for(var d=!0,e=0;;)if(d&&e!==O(c))d=nh(a,b.b?b.b(e):b.call(null,e),c.b?c.b(e):c.call(null,e)),e+=1;else return d;else return d;else return d}function oh(a){var b;b=hh();b=M.b?M.b(b):M.call(null,b);return ye(G.a(ih.b(b),a))}function ph(a,b,c,d){Re.a(a,function(){return M.b?M.b(b):M.call(null,b)});Re.a(c,function(){return M.b?M.b(d):M.call(null,d)})}
var qh=function qh(b,c,d){var e=(M.b?M.b(d):M.call(null,d)).call(null,b),e=x(x(e)?e.b?e.b(c):e.call(null,c):e)?!0:null;if(x(e))return e;e=function(){for(var e=oh(c);;)if(0<O(e))qh(b,J(e),d),e=Dc(e);else return null}();if(x(e))return e;e=function(){for(var e=oh(b);;)if(0<O(e))qh(J(e),c,d),e=Dc(e);else return null}();return x(e)?e:!1};function rh(a,b,c){c=qh(a,b,c);if(x(c))a=c;else{c=nh;var d;d=hh();d=M.b?M.b(d):M.call(null,d);a=c(d,a,b)}return a}
var sh=function sh(b,c,d,e,f,g,h){var l=$a.c(function(e,g){var h=Q(g,0);Q(g,1);if(nh(M.b?M.b(d):M.call(null,d),c,h)){var l;l=(l=null==e)?l:rh(h,J(e),f);l=x(l)?g:e;if(!x(rh(J(l),h,f)))throw Error([A("Multiple methods in multimethod '"),A(b),A("' match dispatch value: "),A(c),A(" -\x3e "),A(h),A(" and "),A(J(l)),A(", and neither is preferred")].join(""));return l}return e},null,M.b?M.b(e):M.call(null,e));if(x(l)){if(rc.a(M.b?M.b(h):M.call(null,h),M.b?M.b(d):M.call(null,d)))return Re.m(g,nd,c,gd(l)),
gd(l);ph(g,e,h,d);return sh(b,c,d,e,f,g,h)}return null};function th(a,b){throw Error([A("No method in multimethod '"),A(a),A("' for dispatch value: "),A(b)].join(""));}function uh(a,b,c,d,e,f,g,h){this.name=a;this.j=b;this.ed=c;this.Vb=d;this.Eb=e;this.pd=f;this.Yb=g;this.Hb=h;this.g=4194305;this.C=4352}k=uh.prototype;
k.call=function(){function a(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,B,F,E,L,P){a=this;var Aa=C.h(a.j,b,c,d,e,H([f,g,h,l,m,n,p,q,r,w,z,v,B,F,E,L,P],0)),lh=vh(this,Aa);x(lh)||th(a.name,Aa);return C.h(lh,b,c,d,e,H([f,g,h,l,m,n,p,q,r,w,z,v,B,F,E,L,P],0))}function b(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,B,F,E,L){a=this;var P=a.j.qa?a.j.qa(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,B,F,E,L):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,B,F,E,L),Aa=vh(this,P);x(Aa)||th(a.name,P);return Aa.qa?Aa.qa(b,c,d,e,f,g,h,l,m,n,p,q,r,
w,z,v,B,F,E,L):Aa.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,B,F,E,L)}function c(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,B,F,E){a=this;var L=a.j.pa?a.j.pa(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,B,F,E):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,B,F,E),P=vh(this,L);x(P)||th(a.name,L);return P.pa?P.pa(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,B,F,E):P.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,B,F,E)}function d(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,B,F){a=this;var E=a.j.oa?a.j.oa(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,B,F):a.j.call(null,
b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,B,F),L=vh(this,E);x(L)||th(a.name,E);return L.oa?L.oa(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,B,F):L.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,B,F)}function e(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,B){a=this;var F=a.j.na?a.j.na(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,B):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,B),E=vh(this,F);x(E)||th(a.name,F);return E.na?E.na(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,B):E.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,B)}function f(a,b,c,d,e,f,g,h,l,m,n,p,q,r,
w,z,v){a=this;var B=a.j.ma?a.j.ma(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v),F=vh(this,B);x(F)||th(a.name,B);return F.ma?F.ma(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v):F.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v)}function g(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z){a=this;var v=a.j.la?a.j.la(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z),B=vh(this,v);x(B)||th(a.name,v);return B.la?B.la(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z):B.call(null,b,c,d,e,f,g,h,l,m,n,p,
q,r,w,z)}function h(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w){a=this;var z=a.j.ka?a.j.ka(b,c,d,e,f,g,h,l,m,n,p,q,r,w):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w),v=vh(this,z);x(v)||th(a.name,z);return v.ka?v.ka(b,c,d,e,f,g,h,l,m,n,p,q,r,w):v.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w)}function l(a,b,c,d,e,f,g,h,l,m,n,p,q,r){a=this;var w=a.j.ja?a.j.ja(b,c,d,e,f,g,h,l,m,n,p,q,r):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r),z=vh(this,w);x(z)||th(a.name,w);return z.ja?z.ja(b,c,d,e,f,g,h,l,m,n,p,q,r):z.call(null,b,c,d,e,f,
g,h,l,m,n,p,q,r)}function m(a,b,c,d,e,f,g,h,l,m,n,p,q){a=this;var r=a.j.ia?a.j.ia(b,c,d,e,f,g,h,l,m,n,p,q):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q),w=vh(this,r);x(w)||th(a.name,r);return w.ia?w.ia(b,c,d,e,f,g,h,l,m,n,p,q):w.call(null,b,c,d,e,f,g,h,l,m,n,p,q)}function n(a,b,c,d,e,f,g,h,l,m,n,p){a=this;var q=a.j.ha?a.j.ha(b,c,d,e,f,g,h,l,m,n,p):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p),r=vh(this,q);x(r)||th(a.name,q);return r.ha?r.ha(b,c,d,e,f,g,h,l,m,n,p):r.call(null,b,c,d,e,f,g,h,l,m,n,p)}function p(a,b,
c,d,e,f,g,h,l,m,n){a=this;var p=a.j.ga?a.j.ga(b,c,d,e,f,g,h,l,m,n):a.j.call(null,b,c,d,e,f,g,h,l,m,n),q=vh(this,p);x(q)||th(a.name,p);return q.ga?q.ga(b,c,d,e,f,g,h,l,m,n):q.call(null,b,c,d,e,f,g,h,l,m,n)}function q(a,b,c,d,e,f,g,h,l,m){a=this;var n=a.j.sa?a.j.sa(b,c,d,e,f,g,h,l,m):a.j.call(null,b,c,d,e,f,g,h,l,m),p=vh(this,n);x(p)||th(a.name,n);return p.sa?p.sa(b,c,d,e,f,g,h,l,m):p.call(null,b,c,d,e,f,g,h,l,m)}function r(a,b,c,d,e,f,g,h,l){a=this;var m=a.j.ra?a.j.ra(b,c,d,e,f,g,h,l):a.j.call(null,
b,c,d,e,f,g,h,l),n=vh(this,m);x(n)||th(a.name,m);return n.ra?n.ra(b,c,d,e,f,g,h,l):n.call(null,b,c,d,e,f,g,h,l)}function v(a,b,c,d,e,f,g,h){a=this;var l=a.j.ba?a.j.ba(b,c,d,e,f,g,h):a.j.call(null,b,c,d,e,f,g,h),m=vh(this,l);x(m)||th(a.name,l);return m.ba?m.ba(b,c,d,e,f,g,h):m.call(null,b,c,d,e,f,g,h)}function w(a,b,c,d,e,f,g){a=this;var h=a.j.Y?a.j.Y(b,c,d,e,f,g):a.j.call(null,b,c,d,e,f,g),l=vh(this,h);x(l)||th(a.name,h);return l.Y?l.Y(b,c,d,e,f,g):l.call(null,b,c,d,e,f,g)}function z(a,b,c,d,e,f){a=
this;var g=a.j.A?a.j.A(b,c,d,e,f):a.j.call(null,b,c,d,e,f),h=vh(this,g);x(h)||th(a.name,g);return h.A?h.A(b,c,d,e,f):h.call(null,b,c,d,e,f)}function B(a,b,c,d,e){a=this;var f=a.j.m?a.j.m(b,c,d,e):a.j.call(null,b,c,d,e),g=vh(this,f);x(g)||th(a.name,f);return g.m?g.m(b,c,d,e):g.call(null,b,c,d,e)}function F(a,b,c,d){a=this;var e=a.j.c?a.j.c(b,c,d):a.j.call(null,b,c,d),f=vh(this,e);x(f)||th(a.name,e);return f.c?f.c(b,c,d):f.call(null,b,c,d)}function L(a,b,c){a=this;var d=a.j.a?a.j.a(b,c):a.j.call(null,
b,c),e=vh(this,d);x(e)||th(a.name,d);return e.a?e.a(b,c):e.call(null,b,c)}function P(a,b){a=this;var c=a.j.b?a.j.b(b):a.j.call(null,b),d=vh(this,c);x(d)||th(a.name,c);return d.b?d.b(b):d.call(null,b)}function Aa(a){a=this;var b=a.j.l?a.j.l():a.j.call(null),c=vh(this,b);x(c)||th(a.name,b);return c.l?c.l():c.call(null)}var E=null,E=function(na,E,U,W,ea,fa,ha,ma,oa,qa,va,xa,Pa,Da,Qa,Ja,Wa,Ta,jb,Bb,yc,Zc){switch(arguments.length){case 1:return Aa.call(this,na);case 2:return P.call(this,na,E);case 3:return L.call(this,
na,E,U);case 4:return F.call(this,na,E,U,W);case 5:return B.call(this,na,E,U,W,ea);case 6:return z.call(this,na,E,U,W,ea,fa);case 7:return w.call(this,na,E,U,W,ea,fa,ha);case 8:return v.call(this,na,E,U,W,ea,fa,ha,ma);case 9:return r.call(this,na,E,U,W,ea,fa,ha,ma,oa);case 10:return q.call(this,na,E,U,W,ea,fa,ha,ma,oa,qa);case 11:return p.call(this,na,E,U,W,ea,fa,ha,ma,oa,qa,va);case 12:return n.call(this,na,E,U,W,ea,fa,ha,ma,oa,qa,va,xa);case 13:return m.call(this,na,E,U,W,ea,fa,ha,ma,oa,qa,va,xa,
Pa);case 14:return l.call(this,na,E,U,W,ea,fa,ha,ma,oa,qa,va,xa,Pa,Da);case 15:return h.call(this,na,E,U,W,ea,fa,ha,ma,oa,qa,va,xa,Pa,Da,Qa);case 16:return g.call(this,na,E,U,W,ea,fa,ha,ma,oa,qa,va,xa,Pa,Da,Qa,Ja);case 17:return f.call(this,na,E,U,W,ea,fa,ha,ma,oa,qa,va,xa,Pa,Da,Qa,Ja,Wa);case 18:return e.call(this,na,E,U,W,ea,fa,ha,ma,oa,qa,va,xa,Pa,Da,Qa,Ja,Wa,Ta);case 19:return d.call(this,na,E,U,W,ea,fa,ha,ma,oa,qa,va,xa,Pa,Da,Qa,Ja,Wa,Ta,jb);case 20:return c.call(this,na,E,U,W,ea,fa,ha,ma,oa,
qa,va,xa,Pa,Da,Qa,Ja,Wa,Ta,jb,Bb);case 21:return b.call(this,na,E,U,W,ea,fa,ha,ma,oa,qa,va,xa,Pa,Da,Qa,Ja,Wa,Ta,jb,Bb,yc);case 22:return a.call(this,na,E,U,W,ea,fa,ha,ma,oa,qa,va,xa,Pa,Da,Qa,Ja,Wa,Ta,jb,Bb,yc,Zc)}throw Error("Invalid arity: "+arguments.length);};E.b=Aa;E.a=P;E.c=L;E.m=F;E.A=B;E.Y=z;E.ba=w;E.ra=v;E.sa=r;E.ga=q;E.ha=p;E.ia=n;E.ja=m;E.ka=l;E.la=h;E.ma=g;E.na=f;E.oa=e;E.pa=d;E.qa=c;E.Kb=b;E.wb=a;return E}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};
k.l=function(){var a=this.j.l?this.j.l():this.j.call(null),b=vh(this,a);x(b)||th(this.name,a);return b.l?b.l():b.call(null)};k.b=function(a){var b=this.j.b?this.j.b(a):this.j.call(null,a),c=vh(this,b);x(c)||th(this.name,b);return c.b?c.b(a):c.call(null,a)};k.a=function(a,b){var c=this.j.a?this.j.a(a,b):this.j.call(null,a,b),d=vh(this,c);x(d)||th(this.name,c);return d.a?d.a(a,b):d.call(null,a,b)};
k.c=function(a,b,c){var d=this.j.c?this.j.c(a,b,c):this.j.call(null,a,b,c),e=vh(this,d);x(e)||th(this.name,d);return e.c?e.c(a,b,c):e.call(null,a,b,c)};k.m=function(a,b,c,d){var e=this.j.m?this.j.m(a,b,c,d):this.j.call(null,a,b,c,d),f=vh(this,e);x(f)||th(this.name,e);return f.m?f.m(a,b,c,d):f.call(null,a,b,c,d)};k.A=function(a,b,c,d,e){var f=this.j.A?this.j.A(a,b,c,d,e):this.j.call(null,a,b,c,d,e),g=vh(this,f);x(g)||th(this.name,f);return g.A?g.A(a,b,c,d,e):g.call(null,a,b,c,d,e)};
k.Y=function(a,b,c,d,e,f){var g=this.j.Y?this.j.Y(a,b,c,d,e,f):this.j.call(null,a,b,c,d,e,f),h=vh(this,g);x(h)||th(this.name,g);return h.Y?h.Y(a,b,c,d,e,f):h.call(null,a,b,c,d,e,f)};k.ba=function(a,b,c,d,e,f,g){var h=this.j.ba?this.j.ba(a,b,c,d,e,f,g):this.j.call(null,a,b,c,d,e,f,g),l=vh(this,h);x(l)||th(this.name,h);return l.ba?l.ba(a,b,c,d,e,f,g):l.call(null,a,b,c,d,e,f,g)};
k.ra=function(a,b,c,d,e,f,g,h){var l=this.j.ra?this.j.ra(a,b,c,d,e,f,g,h):this.j.call(null,a,b,c,d,e,f,g,h),m=vh(this,l);x(m)||th(this.name,l);return m.ra?m.ra(a,b,c,d,e,f,g,h):m.call(null,a,b,c,d,e,f,g,h)};k.sa=function(a,b,c,d,e,f,g,h,l){var m=this.j.sa?this.j.sa(a,b,c,d,e,f,g,h,l):this.j.call(null,a,b,c,d,e,f,g,h,l),n=vh(this,m);x(n)||th(this.name,m);return n.sa?n.sa(a,b,c,d,e,f,g,h,l):n.call(null,a,b,c,d,e,f,g,h,l)};
k.ga=function(a,b,c,d,e,f,g,h,l,m){var n=this.j.ga?this.j.ga(a,b,c,d,e,f,g,h,l,m):this.j.call(null,a,b,c,d,e,f,g,h,l,m),p=vh(this,n);x(p)||th(this.name,n);return p.ga?p.ga(a,b,c,d,e,f,g,h,l,m):p.call(null,a,b,c,d,e,f,g,h,l,m)};k.ha=function(a,b,c,d,e,f,g,h,l,m,n){var p=this.j.ha?this.j.ha(a,b,c,d,e,f,g,h,l,m,n):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n),q=vh(this,p);x(q)||th(this.name,p);return q.ha?q.ha(a,b,c,d,e,f,g,h,l,m,n):q.call(null,a,b,c,d,e,f,g,h,l,m,n)};
k.ia=function(a,b,c,d,e,f,g,h,l,m,n,p){var q=this.j.ia?this.j.ia(a,b,c,d,e,f,g,h,l,m,n,p):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p),r=vh(this,q);x(r)||th(this.name,q);return r.ia?r.ia(a,b,c,d,e,f,g,h,l,m,n,p):r.call(null,a,b,c,d,e,f,g,h,l,m,n,p)};k.ja=function(a,b,c,d,e,f,g,h,l,m,n,p,q){var r=this.j.ja?this.j.ja(a,b,c,d,e,f,g,h,l,m,n,p,q):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q),v=vh(this,r);x(v)||th(this.name,r);return v.ja?v.ja(a,b,c,d,e,f,g,h,l,m,n,p,q):v.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q)};
k.ka=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){var v=this.j.ka?this.j.ka(a,b,c,d,e,f,g,h,l,m,n,p,q,r):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r),w=vh(this,v);x(w)||th(this.name,v);return w.ka?w.ka(a,b,c,d,e,f,g,h,l,m,n,p,q,r):w.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r)};
k.la=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v){var w=this.j.la?this.j.la(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v),z=vh(this,w);x(z)||th(this.name,w);return z.la?z.la(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v):z.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v)};
k.ma=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w){var z=this.j.ma?this.j.ma(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w),B=vh(this,z);x(B)||th(this.name,z);return B.ma?B.ma(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w):B.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w)};
k.na=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z){var B=this.j.na?this.j.na(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z),F=vh(this,B);x(F)||th(this.name,B);return F.na?F.na(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z):F.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z)};
k.oa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B){var F=this.j.oa?this.j.oa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B),L=vh(this,F);x(L)||th(this.name,F);return L.oa?L.oa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B):L.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B)};
k.pa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F){var L=this.j.pa?this.j.pa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F),P=vh(this,L);x(P)||th(this.name,L);return P.pa?P.pa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F):P.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F)};
k.qa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F,L){var P=this.j.qa?this.j.qa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F,L):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F,L),Aa=vh(this,P);x(Aa)||th(this.name,P);return Aa.qa?Aa.qa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F,L):Aa.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F,L)};
k.Kb=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F,L,P){var Aa=C.h(this.j,a,b,c,d,H([e,f,g,h,l,m,n,p,q,r,v,w,z,B,F,L,P],0)),E=vh(this,Aa);x(E)||th(this.name,Aa);return C.h(E,a,b,c,d,H([e,f,g,h,l,m,n,p,q,r,v,w,z,B,F,L,P],0))};function wh(a,b,c){Re.m(a.Eb,nd,b,c);ph(a.Yb,a.Eb,a.Hb,a.Vb)}
function vh(a,b){rc.a(M.b?M.b(a.Hb):M.call(null,a.Hb),M.b?M.b(a.Vb):M.call(null,a.Vb))||ph(a.Yb,a.Eb,a.Hb,a.Vb);var c=(M.b?M.b(a.Yb):M.call(null,a.Yb)).call(null,b);if(x(c))return c;c=sh(a.name,b,a.Vb,a.Eb,a.pd,a.Yb,a.Hb);return x(c)?c:(M.b?M.b(a.Eb):M.call(null,a.Eb)).call(null,a.ed)}k.Ob=function(){return dc(this.name)};k.Pb=function(){return ec(this.name)};k.T=function(){return this[da]||(this[da]=++ga)};var xh=new y(null,"y","y",-1757859776),yh=new y(null,"text-anchor","text-anchor",585613696),zh=new y(null,"path","path",-188191168),Ah=new y(null,"penny-spacing","penny-spacing",-20780703),Bh=new y(null,"supplier","supplier",18255489),Ch=new y(null,"determine-capacity","determine-capacity",-452765887),Dh=new y(null,"by-station","by-station",516084641),Eh=new y(null,"selector","selector",762528866),Fh=new y(null,"basic+efficient+fixed","basic+efficient+fixed",-1106868702),Gh=new y(null,"r","r",-471384190),
Hh=new y(null,"run","run",-1821166653),Ih=new y(null,"richpath","richpath",-150197948),Jh=new y(null,"turns","turns",-1118736892),Kh=new y(null,"transform","transform",1381301764),Lh=new y(null,"die","die",-547192252),Ia=new y(null,"meta","meta",1499536964),Mh=new y(null,"transformer","transformer",-1493470620),Nh=new y(null,"dx","dx",-381796732),Oh=new y(null,"color","color",1011675173),Ph=new y(null,"executors","executors",-331073403),Ka=new y(null,"dup","dup",556298533),Qh=new y(null,"intaking",
"intaking",-1009888859),Rh=new y(null,"running?","running?",-257884763),Sh=new y(null,"processing","processing",-1576405467),Th=new y(null,"stats-history","stats-history",636123973),Uh=new y(null,"spout-y","spout-y",1676697606),Vh=new y(null,"stations","stations",-19744730),Wh=new y(null,"capacity","capacity",72689734),Xh=new y(null,"disabled","disabled",-1529784218),Yh=new y(null,"private","private",-558947994),Zh=new y(null,"efficient","efficient",-63016538),$h=new y(null,"graphs?","graphs?",-270895578),
ai=new y(null,"transform*","transform*",-1613794522),bi=new y(null,"button","button",1456579943),ci=new y(null,"top","top",-1856271961),di=new y(null,"basic+efficient","basic+efficient",-970783161),Oe=new y(null,"validator","validator",-1966190681),ei=new y(null,"total-utilization","total-utilization",-1341502521),fi=new y(null,"use","use",-1846382424),gi=new y(null,"default","default",-1987822328),hi=new y(null,"finally-block","finally-block",832982472),ii=new y(null,"name","name",1843675177),ji=
new y(null,"scenarios","scenarios",1618559369),ki=new y(null,"formatter","formatter",-483008823),li=new y(null,"value","value",305978217),mi=new y(null,"green","green",-945526839),ni=new y(null,"section","section",-300141526),oi=new y(null,"circle","circle",1903212362),pi=new y(null,"drop","drop",364481611),qi=new y(null,"tracer","tracer",-1844475765),ri=new y(null,"width","width",-384071477),si=new y(null,"supply","supply",-1701696309),ti=new y(null,"spath","spath",-1857758005),ui=new y(null,"source-spout-y",
"source-spout-y",1447094571),vi=new y(null,"onclick","onclick",1297553739),wi=new y(null,"dy","dy",1719547243),xi=new y(null,"penny","penny",1653999051),yi=new y(null,"params","params",710516235),zi=new y(null,"total-output","total-output",1149740747),Ai=new y(null,"easing","easing",735372043),Xg=new y(null,"val","val",128701612),Y=new y(null,"recur","recur",-437573268),Bi=new y(null,"type","type",1174270348),Ci=new y(null,"catch-block","catch-block",1175212748),Di=new y(null,"duration","duration",
1444101068),Ei=new y(null,"execute","execute",-129499188),Fi=new y(null,"constrained","constrained",597287981),Gi=new y(null,"intaking?","intaking?",834765),Wg=new y(null,"fallback-impl","fallback-impl",-1501286995),Hi=new y(null,"output","output",-1105869043),Ii=new y(null,"original-setup","original-setup",2029721421),Ga=new y(null,"flush-on-newline","flush-on-newline",-151457939),Ji=new y(null,"normal","normal",-1519123858),Ki=new y(null,"wip","wip",-103467282),Li=new y(null,"averages","averages",
-1747836978),Mi=new y(null,"className","className",-1983287057),jh=new y(null,"descendants","descendants",1824886031),Ni=new y(null,"size","size",1098693007),Oi=new y(null,"accessor","accessor",-25476721),Pi=new y(null,"title","title",636505583),Qi=new y(null,"running","running",1554969103),Ri=new y(null,"no-op","no-op",-93046065),Si=new qc(null,"folder","folder",-1138554033,null),Ti=new y(null,"num-needed-params","num-needed-params",-1219326097),Ui=new y(null,"dropping","dropping",125809647),Vi=
new y(null,"high","high",2027297808),Wi=new y(null,"setup","setup",1987730512),mh=new y(null,"ancestors","ancestors",-776045424),Xi=new y(null,"style","style",-496642736),Yi=new y(null,"div","div",1057191632),Ha=new y(null,"readably","readably",1129599760),Zi=new y(null,"params-idx","params-idx",340984624),$i=new qc(null,"box","box",-1123515375,null),Og=new y(null,"more-marker","more-marker",-14717935),aj=new y(null,"percent-utilization","percent-utilization",-2006109103),bj=new y(null,"g","g",1738089905),
cj=new y(null,"update-stats","update-stats",1938193073),dj=new y(null,"basic+efficient+constrained","basic+efficient+constrained",-815375631),ej=new y(null,"info?","info?",361925553),fj=new y(null,"transfer-to-next-station","transfer-to-next-station",-114193262),gj=new y(null,"set-spacing","set-spacing",1920968978),hj=new y(null,"intake","intake",-108984782),ij=new qc(null,"coll","coll",-1006698606,null),jj=new y(null,"line","line",212345235),kj=new y(null,"basic+efficient+constrained+fixed","basic+efficient+constrained+fixed",
-963095949),lj=new qc(null,"val","val",1769233139,null),mj=new qc(null,"xf","xf",2042434515,null),La=new y(null,"print-length","print-length",1931866356),pj=new y(null,"select*","select*",-1829914060),qj=new y(null,"cx","cx",1272694324),rj=new y(null,"id","id",-1388402092),sj=new y(null,"class","class",-2030961996),tj=new y(null,"red","red",-969428204),uj=new y(null,"blue","blue",-622100620),vj=new y(null,"cy","cy",755331060),wj=new y(null,"catch-exception","catch-exception",-1997306795),xj=new y(null,
"total-input","total-input",1219129557),ih=new y(null,"parents","parents",-2027538891),yj=new y(null,"collect-val","collect-val",801894069),zj=new y(null,"xlink:href","xlink:href",828777205),Aj=new y(null,"prev","prev",-1597069226),Bj=new y(null,"svg","svg",856789142),Cj=new y(null,"info","info",-317069002),Dj=new y(null,"bin-h","bin-h",346004918),Ej=new y(null,"length","length",588987862),Fj=new y(null,"continue-block","continue-block",-1852047850),Gj=new y(null,"hookTransition","hookTransition",
-1045887913),Hj=new y(null,"tracer-reset","tracer-reset",283192087),Ij=new y(null,"distribution","distribution",-284555369),Jj=new y(null,"transfer-to-processed","transfer-to-processed",198231991),Kj=new y(null,"roll","roll",11266999),Lj=new y(null,"position","position",-2011731912),Mj=new y(null,"graphs","graphs",-1584479112),Nj=new y(null,"basic","basic",1043717368),Oj=new y(null,"image","image",-58725096),Pj=new y(null,"d","d",1972142424),Qj=new y(null,"average","average",-492356168),Rj=new y(null,
"dropping?","dropping?",-1065207176),Sj=new y(null,"processed","processed",800622264),Tj=new y(null,"x","x",2099068185),Uj=new y(null,"run-next","run-next",1110241561),Vj=new y(null,"x1","x1",-1863922247),Wj=new y(null,"tracer-start","tracer-start",1036491225),Xj=new y(null,"domain","domain",1847214937),Yj=new y(null,"transform-fns","transform-fns",669042649),Ce=new qc(null,"quote","quote",1377916282,null),Zj=new y(null,"purple","purple",-876021126),ak=new y(null,"fixed","fixed",-562004358),Be=new y(null,
"arglists","arglists",1661989754),mf=new y(null,"dice","dice",707777434),bk=new y(null,"y2","y2",-718691301),ck=new y(null,"set-lengths","set-lengths",742672507),Ae=new qc(null,"nil-iter","nil-iter",1101030523,null),dk=new y(null,"main","main",-2117802661),ek=new y(null,"hierarchy","hierarchy",-1053470341),Vg=new y(null,"alt-impl","alt-impl",670969595),fk=new y(null,"under-utilized","under-utilized",-524567781),gk=new qc(null,"fn-handler","fn-handler",648785851,null),hk=new y(null,"doc","doc",1913296891),
ik=new y(null,"integrate","integrate",-1653689604),jk=new y(null,"rect","rect",-108902628),kk=new y(null,"step","step",1288888124),lk=new y(null,"delay","delay",-574225219),mk=new y(null,"stats","stats",-85643011),nk=new y(null,"x2","x2",-1362513475),ok=new y(null,"pennies","pennies",1847043709),pk=new y(null,"incoming","incoming",-1710131427),qk=new y(null,"productivity","productivity",-890721314),rk=new y(null,"range","range",1639692286),sk=new y(null,"height","height",1025178622),tk=new y(null,
"spacing","spacing",204422175),uk=new y(null,"left","left",-399115937),vk=new y("cljs.core","not-found","cljs.core/not-found",-1572889185),wk=new y(null,"foreignObject","foreignObject",25502111),xk=new y(null,"text","text",-1790561697),yk=new y(null,"data","data",-232669377),zk=new qc(null,"f","f",43394975,null);var Ak=new u(null,3,[si,2,Sh,4,Ij,1],null),Bk=new u(null,3,[si,-1,Sh,0,Ij,0],null),Ck=new u(null,3,[si,40,Sh,40,Ij,0],null);function Dk(a,b){var c=T.a(Je.a(Ak,Bi),b),d=a/$a.a(Nd,c);return T.a(Ke(Pd,d),c)}function Ek(a,b,c){return id.a(b,function(){var d=null==b?null:xb(b);return a.a?a.a(d,c):a.call(null,d,c)}())}function Fk(a,b){var c=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a,c=G.a(c,Bi),c=b-(Ck.b?Ck.b(c):Ck.call(null,c));return c-Ud(c,20)}
function Gk(a,b){var c=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a,d=G.a(c,ri),e=G.a(c,sk),f=Dk(e,b);return T.h(function(a,b,c,d){return function(a,b,c,e){a=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a;c=G.a(a,Bi);b=new u(null,5,[xh,b+(Bk.b?Bk.b(c):Bk.call(null,c)),ri,d,Dj,e,Uh,e,ui,-30],null);return zg.h(H([a,b],0))}}(f,a,c,d,e),b,$a.c(Ke(Ek,Nd),new R(null,1,5,S,[0],null),f),f,H([T.c(Fk,b,f)],0))}
function Hk(a,b){var c=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a,d=G.a(c,ri),e=G.a(c,sk),f=G.a(c,Tj),g=O(b),h=d/g;return T.c(function(a,b,c,d,e,f){return function(a,c){var d=new u(null,3,[Tj,a,ri,b-30,sk,f],null),d=null!=d&&(d.g&64||d.F)?C.a(Oc,d):d,e=G.a(d,ri),g=G.a(d,sk),h=null!=c&&(c.g&64||c.F)?C.a(Oc,c):c;G.a(h,Vh);return jf(zg.h(H([h,d],0)),Vh,Ke(Gk,new u(null,2,[ri,e,sk,g],null)))}}(g,h,a,c,d,e,f),Te(g,Xe(Ke(Nd,h),f)),b)};function Ik(a){if(x(rc.a?rc.a(0,a):rc.call(null,0,a)))return jd;if(x(rc.a?rc.a(1,a):rc.call(null,1,a)))return new R(null,1,5,S,[new R(null,2,5,S,[0,0],null)],null);if(x(rc.a?rc.a(2,a):rc.call(null,2,a)))return new R(null,2,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[1,1],null)],null);if(x(rc.a?rc.a(3,a):rc.call(null,3,a)))return new R(null,3,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[0,0],null),new R(null,2,5,S,[1,1],null)],null);if(x(rc.a?rc.a(4,a):rc.call(null,4,a)))return new R(null,
4,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[-1,1],null),new R(null,2,5,S,[1,-1],null),new R(null,2,5,S,[1,1],null)],null);if(x(rc.a?rc.a(5,a):rc.call(null,5,a)))return new R(null,5,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[-1,1],null),new R(null,2,5,S,[0,0],null),new R(null,2,5,S,[1,-1],null),new R(null,2,5,S,[1,1],null)],null);if(x(rc.a?rc.a(6,a):rc.call(null,6,a)))return new R(null,6,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[-1,0],null),new R(null,2,5,S,[-1,1],
null),new R(null,2,5,S,[1,-1],null),new R(null,2,5,S,[1,0],null),new R(null,2,5,S,[1,1],null)],null);throw Error([A("No matching clause: "),A(a)].join(""));}var Jk=Ng(function(a){return a.x},function(a){return a.y});
function Kk(a){var b=Q(a,0),c=Q(a,1),d=Math.ceil(Math.sqrt(4)),e=b/d,f=c/d;return function(a,b,c,d,e,f,q){return function v(w){return new je(null,function(a,b,c,d,e,f,g){return function(){for(var h=w;;){var l=I(h);if(l){var m=l,n=J(m);if(l=I(function(a,b,c,d,e,f,g,h,l,m,n){return function Wa(p){return new je(null,function(a,b,c,d,e,f,g,h){return function(){for(;;){var a=I(p);if(a){if(zd(a)){var c=ac(a),d=O(c),e=ne(d);a:for(var l=0;;)if(l<d){var m=D.a(c,l),m=nd.h(h,Tj,m*f,H([xh,b*g],0));e.add(m);l+=
1}else{c=!0;break a}return c?oe(e.W(),Wa(bc(a))):oe(e.W(),null)}e=J(a);return N(nd.h(h,Tj,e*f,H([xh,b*g],0)),Wa(Dc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n),null,null)}}(h,n,m,l,a,b,c,d,e,f,g)(new Jg(null,0,a,1,null))))return te.a(l,v(Dc(h)));h=Dc(h)}else return null}}}(a,b,c,d,e,f,q),null,null)}}(d,e,f,new u(null,2,[ri,e,sk,f],null),a,b,c)(new Jg(null,0,d,1,null))}var Lk=Ng(Ke(C,Td),Ke(C,Sd));
function Mk(a,b){var c=Q(a,0),d=Q(a,1),e=Q(b,0),f=Q(b,1),g=rc.a(c,d)?new R(null,2,5,S,[0,1],null):new R(null,2,5,S,[c,d],null),h=Q(g,0),l=Q(g,1),m=(f-e)/(l-h);return function(a,b,c,d,e){return function(a){return d*a+e}}(g,h,l,m,f-m*l,a,c,d,b,e,f)}
var Nk=function Nk(b,c){return rc.a(1,b)?T.a(pc,c):new je(null,function(){var d=I(c);if(d){var e=Q(d,0),f=Xd(d,1);return te.a(function(){return function(b,c,d,e){return function p(f){return new je(null,function(b,c){return function(){for(;;){var b=I(f);if(b){if(zd(b)){var d=ac(b),e=O(d),g=ne(e);a:for(var h=0;;)if(h<e){var l=D.a(d,h),l=N(c,l);g.add(l);h+=1}else{d=!0;break a}return d?oe(g.W(),p(bc(b))):oe(g.W(),null)}g=J(b);return N(N(c,g),p(Dc(b)))}return null}}}(b,c,d,e),null,null)}}(d,e,f,d)(Nk(b-
1,f))}(),Nk(b,f))}return null},null,null)};
function Ok(a){function b(a){var b=sc;I(a)?(a=Jd.b?Jd.b(a):Jd.call(null,a),b=Id(b),ua(a,b),a=I(a)):a=Ec;b=Q(a,0);a=Q(a,1);var c=(18-(a-b))/2,b=[b,b-c,a,a+c];a=[];for(c=0;;)if(c<b.length){var g=b[c],h=b[c+1];-1===Rf(a,g)&&(a.push(g),a.push(h));c+=2}else break;return new u(null,a.length/2,a,null)}for(;;){var c=gd(C.c(Gg,J,af(function(){return function(a){return 0<J(a)&&18>J(a)}}(a,b),T.a(function(){return function(a){var b=S,c=C.a(Od,a);return new R(null,2,5,b,[Math.abs(c),a],null)}}(a,b),Nk(2,a)))));
if(x(c))a=Eg(b(c),a);else return a}}function Pk(a,b){return te.a(a,Ue(O(a),b))}function Qk(a,b,c){var d=null!=b&&(b.g&64||b.F)?C.a(Oc,b):b;b=G.a(d,ri);var d=G.a(d,sk),e=null!=c&&(c.g&64||c.F)?C.a(Oc,c):c;c=G.a(e,rk);var e=G.a(e,Xj),f=C.a(te,a);a=Pk(e,function(){var a=T.a(J,f);return Lk.b?Lk.b(a):Lk.call(null,a)}());c=Pk(c,function(){var a=T.a(gd,f);return Lk.b?Lk.b(a):Lk.call(null,a)}());return new R(null,2,5,S,[Mk(a,new R(null,2,5,S,[0,b],null)),Mk(c,new R(null,2,5,S,[d,0],null))],null)};var Rk;a:{var Sk=aa.navigator;if(Sk){var Tk=Sk.userAgent;if(Tk){Rk=Tk;break a}}Rk=""};var Uk;function Vk(a){return a.l?a.l():a.call(null)}function Wk(a,b,c){return vd(c)?Hb(c,a,b):null==c?b:Ra(c)?Xc(c,a,b):Gb.c(c,a,b)}
var Xk=function Xk(b,c,d,e){if(null!=b&&null!=b.qc)return b.qc(b,c,d,e);var f=Xk[t(null==b?null:b)];if(null!=f)return f.m?f.m(b,c,d,e):f.call(null,b,c,d,e);f=Xk._;if(null!=f)return f.m?f.m(b,c,d,e):f.call(null,b,c,d,e);throw Va("CollFold.coll-fold",b);},Yk=function Yk(b,c){"undefined"===typeof Uk&&(Uk=function(b,c,f,g){this.gd=b;this.fc=c;this.ab=f;this.jd=g;this.g=917504;this.C=0},Uk.prototype.P=function(b,c){return new Uk(this.gd,this.fc,this.ab,c)},Uk.prototype.O=function(){return this.jd},Uk.prototype.ea=
function(b,c){return Gb.c(this.fc,this.ab.b?this.ab.b(c):this.ab.call(null,c),c.l?c.l():c.call(null))},Uk.prototype.fa=function(b,c,f){return Gb.c(this.fc,this.ab.b?this.ab.b(c):this.ab.call(null,c),f)},Uk.prototype.qc=function(b,c,f,g){return Xk(this.fc,c,f,this.ab.b?this.ab.b(g):this.ab.call(null,g))},Uk.ic=function(){return new R(null,4,5,S,[Qc(Si,new u(null,2,[Be,pc(Ce,pc(new R(null,2,5,S,[ij,mj],null))),hk,"Given a foldable collection, and a transformation function xf,\n  returns a foldable collection, where any supplied reducing\n  fn will be transformed by xf. xf is a function of reducing fn to\n  reducing fn."],
null)),ij,mj,wa.Ed],null)},Uk.xb=!0,Uk.eb="clojure.core.reducers/t_clojure$core$reducers19004",Uk.Tb=function(b,c){return Qb(c,"clojure.core.reducers/t_clojure$core$reducers19004")});return new Uk(Yk,b,c,De)};
function Zk(a,b){return Yk(b,function(b){return function(){function d(d,e,f){e=a.a?a.a(e,f):a.call(null,e,f);return b.a?b.a(d,e):b.call(null,d,e)}function e(d,e){var f=a.b?a.b(e):a.call(null,e);return b.a?b.a(d,f):b.call(null,d,f)}function f(){return b.l?b.l():b.call(null)}var g=null,g=function(a,b,c){switch(arguments.length){case 0:return f.call(this);case 2:return e.call(this,a,b);case 3:return d.call(this,a,b,c)}throw Error("Invalid arity: "+arguments.length);};g.l=f;g.a=e;g.c=d;return g}()})}
function $k(a,b){return Yk(b,function(b){return function(){function d(d,e,f){return Wk(b,d,a.a?a.a(e,f):a.call(null,e,f))}function e(d,e){return Wk(b,d,a.b?a.b(e):a.call(null,e))}function f(){return b.l?b.l():b.call(null)}var g=null,g=function(a,b,c){switch(arguments.length){case 0:return f.call(this);case 2:return e.call(this,a,b);case 3:return d.call(this,a,b,c)}throw Error("Invalid arity: "+arguments.length);};g.l=f;g.a=e;g.c=d;return g}()})}
var al=function al(b,c,d,e){if(sd(b))return d.l?d.l():d.call(null);if(O(b)<=c)return Wk(e,d.l?d.l():d.call(null),b);var f=Vd(O(b)),g=Ff.c(b,0,f);b=Ff.c(b,f,O(b));return Vk(function(b,c,e,f){return function(){var b=f(c),g;g=f(e);b=b.l?b.l():b.call(null);g=g.l?g.l():g.call(null);return d.a?d.a(b,g):d.call(null,b,g)}}(f,g,b,function(b,f,g){return function(n){return function(){return function(){return al(n,c,d,e)}}(b,f,g)}}(f,g,b)))};Xk["null"]=function(a,b,c){return c.l?c.l():c.call(null)};
Xk.object=function(a,b,c,d){return Wk(d,c.l?c.l():c.call(null),a)};R.prototype.qc=function(a,b,c,d){return al(this,b,c,d)};function bl(){}
var cl=function cl(b,c,d){if(null!=b&&null!=b.zb)return b.zb(b,c,d);var e=cl[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=cl._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Va("StructurePath.select*",b);},dl=function dl(b,c,d){if(null!=b&&null!=b.Ab)return b.Ab(b,c,d);var e=dl[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=dl._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Va("StructurePath.transform*",b);};
function el(){}var fl=function fl(b,c){if(null!=b&&null!=b.rc)return b.rc(0,c);var d=fl[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=fl._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("Collector.collect-val",b);};var gl=function gl(b){if(null!=b&&null!=b.Gc)return b.Gc();var c=gl[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=gl._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("PathComposer.comp-paths*",b);};function hl(a,b,c){this.type=a;this.sd=b;this.ud=c}var il;
il=new hl(Ih,function(a,b,c,d){var e=function(){return function(a,b,c,d){return sd(c)?new R(null,1,5,S,[d],null):new R(null,1,5,S,[id.a(c,d)],null)}}(a,b,jd,d);return c.A?c.A(a,b,jd,d,e):c.call(null,a,b,jd,d,e)},function(a,b,c,d,e){var f=function(){return function(a,b,c,e){return sd(c)?d.b?d.b(e):d.call(null,e):C.a(d,id.a(c,e))}}(a,b,jd,e);return c.A?c.A(a,b,jd,e,f):c.call(null,a,b,jd,e,f)});var jl;
jl=new hl(ti,function(a,b,c,d){a=function(){return function(a){return new R(null,1,5,S,[a],null)}}(d);return c.a?c.a(d,a):c.call(null,d,a)},function(a,b,c,d,e){return c.a?c.a(e,d):c.call(null,e,d)});function kl(a,b,c,d,e,f){this.Ka=a;this.La=b;this.Ma=c;this.S=d;this.G=e;this.u=f;this.g=2229667594;this.C=8192}k=kl.prototype;k.N=function(a,b){return nb.c(this,b,null)};
k.I=function(a,b,c){switch(b instanceof y?b.Ha:null){case "executors":return this.Ka;case "selector":return this.La;case "transformer":return this.Ma;default:return G.c(this.G,b,c)}};k.M=function(a,b,c){return Af(b,function(){return function(a){return Af(b,Bf,""," ","",c,a)}}(this),"#com.rpl.specter.impl.TransformFunctions{",", ","}",c,te.a(new R(null,3,5,S,[new R(null,2,5,S,[Ph,this.Ka],null),new R(null,2,5,S,[Eh,this.La],null),new R(null,2,5,S,[Mh,this.Ma],null)],null),this.G))};
k.Ga=function(){return new Nf(0,this,3,new R(null,3,5,S,[Ph,Eh,Mh],null),hc(this.G))};k.O=function(){return this.S};k.Z=function(){return 3+O(this.G)};k.T=function(){var a=this.u;return null!=a?a:this.u=a=ae(this)};k.D=function(a,b){var c;c=x(b)?(c=this.constructor===b.constructor)?Mf(this,b):c:b;return x(c)?!0:!1};
k.ib=function(a,b){return Fd(new Cg(null,new u(null,3,[Eh,null,Mh,null,Ph,null],null),null),b)?pd.a(Qc(df.a(De,this),this.S),b):new kl(this.Ka,this.La,this.Ma,this.S,ye(pd.a(this.G,b)),null)};
k.Oa=function(a,b,c){return x(V.a?V.a(Ph,b):V.call(null,Ph,b))?new kl(c,this.La,this.Ma,this.S,this.G,null):x(V.a?V.a(Eh,b):V.call(null,Eh,b))?new kl(this.Ka,c,this.Ma,this.S,this.G,null):x(V.a?V.a(Mh,b):V.call(null,Mh,b))?new kl(this.Ka,this.La,c,this.S,this.G,null):new kl(this.Ka,this.La,this.Ma,this.S,nd.c(this.G,b,c),null)};k.U=function(){return I(te.a(new R(null,3,5,S,[new R(null,2,5,S,[Ph,this.Ka],null),new R(null,2,5,S,[Eh,this.La],null),new R(null,2,5,S,[Mh,this.Ma],null)],null),this.G))};
k.P=function(a,b){return new kl(this.Ka,this.La,this.Ma,b,this.G,this.u)};k.X=function(a,b){return wd(b)?qb(this,D.a(b,0),D.a(b,1)):$a.c(fb,this,b)};function ll(a,b,c){return new kl(a,b,c,null,null,null)}function ml(a,b,c,d,e,f){this.va=a;this.Xa=b;this.Ya=c;this.S=d;this.G=e;this.u=f;this.g=2229667594;this.C=8192}k=ml.prototype;k.N=function(a,b){return nb.c(this,b,null)};
k.I=function(a,b,c){switch(b instanceof y?b.Ha:null){case "transform-fns":return this.va;case "params":return this.Xa;case "params-idx":return this.Ya;default:return G.c(this.G,b,c)}};k.M=function(a,b,c){return Af(b,function(){return function(a){return Af(b,Bf,""," ","",c,a)}}(this),"#com.rpl.specter.impl.CompiledPath{",", ","}",c,te.a(new R(null,3,5,S,[new R(null,2,5,S,[Yj,this.va],null),new R(null,2,5,S,[yi,this.Xa],null),new R(null,2,5,S,[Zi,this.Ya],null)],null),this.G))};
k.Ga=function(){return new Nf(0,this,3,new R(null,3,5,S,[Yj,yi,Zi],null),hc(this.G))};k.O=function(){return this.S};k.Z=function(){return 3+O(this.G)};k.T=function(){var a=this.u;return null!=a?a:this.u=a=ae(this)};k.D=function(a,b){var c;c=x(b)?(c=this.constructor===b.constructor)?Mf(this,b):c:b;return x(c)?!0:!1};
k.ib=function(a,b){return Fd(new Cg(null,new u(null,3,[yi,null,Zi,null,Yj,null],null),null),b)?pd.a(Qc(df.a(De,this),this.S),b):new ml(this.va,this.Xa,this.Ya,this.S,ye(pd.a(this.G,b)),null)};
k.Oa=function(a,b,c){return x(V.a?V.a(Yj,b):V.call(null,Yj,b))?new ml(c,this.Xa,this.Ya,this.S,this.G,null):x(V.a?V.a(yi,b):V.call(null,yi,b))?new ml(this.va,c,this.Ya,this.S,this.G,null):x(V.a?V.a(Zi,b):V.call(null,Zi,b))?new ml(this.va,this.Xa,c,this.S,this.G,null):new ml(this.va,this.Xa,this.Ya,this.S,nd.c(this.G,b,c),null)};k.U=function(){return I(te.a(new R(null,3,5,S,[new R(null,2,5,S,[Yj,this.va],null),new R(null,2,5,S,[yi,this.Xa],null),new R(null,2,5,S,[Zi,this.Ya],null)],null),this.G))};
k.P=function(a,b){return new ml(this.va,this.Xa,this.Ya,b,this.G,this.u)};k.X=function(a,b){return wd(b)?qb(this,D.a(b,0),D.a(b,1)):$a.c(fb,this,b)};function nl(a){return new ml(a,null,0,null,null,null)}Z;function ol(a,b,c,d,e){this.va=a;this.rb=b;this.S=c;this.G=d;this.u=e;this.g=2229667595;this.C=8192}k=ol.prototype;k.N=function(a,b){return nb.c(this,b,null)};
k.I=function(a,b,c){switch(b instanceof y?b.Ha:null){case "transform-fns":return this.va;case "num-needed-params":return this.rb;default:return G.c(this.G,b,c)}};k.M=function(a,b,c){return Af(b,function(){return function(a){return Af(b,Bf,""," ","",c,a)}}(this),"#com.rpl.specter.impl.ParamsNeededPath{",", ","}",c,te.a(new R(null,2,5,S,[new R(null,2,5,S,[Yj,this.va],null),new R(null,2,5,S,[Ti,this.rb],null)],null),this.G))};k.Ga=function(){return new Nf(0,this,2,new R(null,2,5,S,[Yj,Ti],null),hc(this.G))};
k.call=function(){function a(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,B,E,F,L,P){a=qe(te.a(new R(null,20,5,S,[b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,B,E,F,L],null),P));return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function b(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,B,E,F,L){a=qe(20);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;a[14]=v;a[15]=z;a[16]=B;a[17]=E;a[18]=F;a[19]=L;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function c(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,
v,z,B,E,F){a=qe(19);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;a[14]=v;a[15]=z;a[16]=B;a[17]=E;a[18]=F;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function d(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,B,E){a=qe(18);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;a[14]=v;a[15]=z;a[16]=B;a[17]=E;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function e(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,B){a=qe(17);
a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;a[14]=v;a[15]=z;a[16]=B;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function f(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z){a=qe(16);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;a[14]=v;a[15]=z;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function g(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v){a=qe(15);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;
a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;a[14]=v;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function h(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w){a=qe(14);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function l(a,b,c,d,e,f,g,h,l,m,n,p,q,r){a=qe(13);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function m(a,
b,c,d,e,f,g,h,l,m,n,p,q){a=qe(12);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function n(a,b,c,d,e,f,g,h,l,m,n,p){a=qe(11);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function p(a,b,c,d,e,f,g,h,l,m,n){a=qe(10);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function q(a,
b,c,d,e,f,g,h,l,m){a=qe(9);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function r(a,b,c,d,e,f,g,h,l){a=qe(8);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function v(a,b,c,d,e,f,g,h){a=qe(7);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function w(a,b,c,d,e,f,g){a=qe(6);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;return Z.c?Z.c(this,
a,0):Z.call(null,this,a,0)}function z(a,b,c,d,e,f){a=qe(5);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function B(a,b,c,d,e){a=qe(4);a[0]=b;a[1]=c;a[2]=d;a[3]=e;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function F(a,b,c,d){a=qe(3);a[0]=b;a[1]=c;a[2]=d;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function L(a,b,c){a=qe(2);a[0]=b;a[1]=c;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function P(a,b){var c=qe(1);c[0]=b;return Z.c?Z.c(this,c,0):Z.call(null,
this,c,0)}function Aa(){var a=qe(0);return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}var E=null,E=function(E,la,U,W,ea,fa,ha,ma,oa,qa,va,xa,Pa,Da,Qa,Ja,Wa,Ta,jb,Bb,yc,Zc){switch(arguments.length){case 1:return Aa.call(this);case 2:return P.call(this,0,la);case 3:return L.call(this,0,la,U);case 4:return F.call(this,0,la,U,W);case 5:return B.call(this,0,la,U,W,ea);case 6:return z.call(this,0,la,U,W,ea,fa);case 7:return w.call(this,0,la,U,W,ea,fa,ha);case 8:return v.call(this,0,la,U,W,ea,fa,ha,ma);case 9:return r.call(this,
0,la,U,W,ea,fa,ha,ma,oa);case 10:return q.call(this,0,la,U,W,ea,fa,ha,ma,oa,qa);case 11:return p.call(this,0,la,U,W,ea,fa,ha,ma,oa,qa,va);case 12:return n.call(this,0,la,U,W,ea,fa,ha,ma,oa,qa,va,xa);case 13:return m.call(this,0,la,U,W,ea,fa,ha,ma,oa,qa,va,xa,Pa);case 14:return l.call(this,0,la,U,W,ea,fa,ha,ma,oa,qa,va,xa,Pa,Da);case 15:return h.call(this,0,la,U,W,ea,fa,ha,ma,oa,qa,va,xa,Pa,Da,Qa);case 16:return g.call(this,0,la,U,W,ea,fa,ha,ma,oa,qa,va,xa,Pa,Da,Qa,Ja);case 17:return f.call(this,0,
la,U,W,ea,fa,ha,ma,oa,qa,va,xa,Pa,Da,Qa,Ja,Wa);case 18:return e.call(this,0,la,U,W,ea,fa,ha,ma,oa,qa,va,xa,Pa,Da,Qa,Ja,Wa,Ta);case 19:return d.call(this,0,la,U,W,ea,fa,ha,ma,oa,qa,va,xa,Pa,Da,Qa,Ja,Wa,Ta,jb);case 20:return c.call(this,0,la,U,W,ea,fa,ha,ma,oa,qa,va,xa,Pa,Da,Qa,Ja,Wa,Ta,jb,Bb);case 21:return b.call(this,0,la,U,W,ea,fa,ha,ma,oa,qa,va,xa,Pa,Da,Qa,Ja,Wa,Ta,jb,Bb,yc);case 22:return a.call(this,0,la,U,W,ea,fa,ha,ma,oa,qa,va,xa,Pa,Da,Qa,Ja,Wa,Ta,jb,Bb,yc,Zc)}throw Error("Invalid arity: "+
arguments.length);};E.b=Aa;E.a=P;E.c=L;E.m=F;E.A=B;E.Y=z;E.ba=w;E.ra=v;E.sa=r;E.ga=q;E.ha=p;E.ia=n;E.ja=m;E.ka=l;E.la=h;E.ma=g;E.na=f;E.oa=e;E.pa=d;E.qa=c;E.Kb=b;E.wb=a;return E}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.l=function(){var a=qe(0);return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)};k.b=function(a){var b=qe(1);b[0]=a;return Z.c?Z.c(this,b,0):Z.call(null,this,b,0)};k.a=function(a,b){var c=qe(2);c[0]=a;c[1]=b;return Z.c?Z.c(this,c,0):Z.call(null,this,c,0)};
k.c=function(a,b,c){var d=qe(3);d[0]=a;d[1]=b;d[2]=c;return Z.c?Z.c(this,d,0):Z.call(null,this,d,0)};k.m=function(a,b,c,d){var e=qe(4);e[0]=a;e[1]=b;e[2]=c;e[3]=d;return Z.c?Z.c(this,e,0):Z.call(null,this,e,0)};k.A=function(a,b,c,d,e){var f=qe(5);f[0]=a;f[1]=b;f[2]=c;f[3]=d;f[4]=e;return Z.c?Z.c(this,f,0):Z.call(null,this,f,0)};k.Y=function(a,b,c,d,e,f){var g=qe(6);g[0]=a;g[1]=b;g[2]=c;g[3]=d;g[4]=e;g[5]=f;return Z.c?Z.c(this,g,0):Z.call(null,this,g,0)};
k.ba=function(a,b,c,d,e,f,g){var h=qe(7);h[0]=a;h[1]=b;h[2]=c;h[3]=d;h[4]=e;h[5]=f;h[6]=g;return Z.c?Z.c(this,h,0):Z.call(null,this,h,0)};k.ra=function(a,b,c,d,e,f,g,h){var l=qe(8);l[0]=a;l[1]=b;l[2]=c;l[3]=d;l[4]=e;l[5]=f;l[6]=g;l[7]=h;return Z.c?Z.c(this,l,0):Z.call(null,this,l,0)};k.sa=function(a,b,c,d,e,f,g,h,l){var m=qe(9);m[0]=a;m[1]=b;m[2]=c;m[3]=d;m[4]=e;m[5]=f;m[6]=g;m[7]=h;m[8]=l;return Z.c?Z.c(this,m,0):Z.call(null,this,m,0)};
k.ga=function(a,b,c,d,e,f,g,h,l,m){var n=qe(10);n[0]=a;n[1]=b;n[2]=c;n[3]=d;n[4]=e;n[5]=f;n[6]=g;n[7]=h;n[8]=l;n[9]=m;return Z.c?Z.c(this,n,0):Z.call(null,this,n,0)};k.ha=function(a,b,c,d,e,f,g,h,l,m,n){var p=qe(11);p[0]=a;p[1]=b;p[2]=c;p[3]=d;p[4]=e;p[5]=f;p[6]=g;p[7]=h;p[8]=l;p[9]=m;p[10]=n;return Z.c?Z.c(this,p,0):Z.call(null,this,p,0)};
k.ia=function(a,b,c,d,e,f,g,h,l,m,n,p){var q=qe(12);q[0]=a;q[1]=b;q[2]=c;q[3]=d;q[4]=e;q[5]=f;q[6]=g;q[7]=h;q[8]=l;q[9]=m;q[10]=n;q[11]=p;return Z.c?Z.c(this,q,0):Z.call(null,this,q,0)};k.ja=function(a,b,c,d,e,f,g,h,l,m,n,p,q){var r=qe(13);r[0]=a;r[1]=b;r[2]=c;r[3]=d;r[4]=e;r[5]=f;r[6]=g;r[7]=h;r[8]=l;r[9]=m;r[10]=n;r[11]=p;r[12]=q;return Z.c?Z.c(this,r,0):Z.call(null,this,r,0)};
k.ka=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){var v=qe(14);v[0]=a;v[1]=b;v[2]=c;v[3]=d;v[4]=e;v[5]=f;v[6]=g;v[7]=h;v[8]=l;v[9]=m;v[10]=n;v[11]=p;v[12]=q;v[13]=r;return Z.c?Z.c(this,v,0):Z.call(null,this,v,0)};k.la=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v){var w=qe(15);w[0]=a;w[1]=b;w[2]=c;w[3]=d;w[4]=e;w[5]=f;w[6]=g;w[7]=h;w[8]=l;w[9]=m;w[10]=n;w[11]=p;w[12]=q;w[13]=r;w[14]=v;return Z.c?Z.c(this,w,0):Z.call(null,this,w,0)};
k.ma=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w){var z=qe(16);z[0]=a;z[1]=b;z[2]=c;z[3]=d;z[4]=e;z[5]=f;z[6]=g;z[7]=h;z[8]=l;z[9]=m;z[10]=n;z[11]=p;z[12]=q;z[13]=r;z[14]=v;z[15]=w;return Z.c?Z.c(this,z,0):Z.call(null,this,z,0)};k.na=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z){var B=qe(17);B[0]=a;B[1]=b;B[2]=c;B[3]=d;B[4]=e;B[5]=f;B[6]=g;B[7]=h;B[8]=l;B[9]=m;B[10]=n;B[11]=p;B[12]=q;B[13]=r;B[14]=v;B[15]=w;B[16]=z;return Z.c?Z.c(this,B,0):Z.call(null,this,B,0)};
k.oa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B){var F=qe(18);F[0]=a;F[1]=b;F[2]=c;F[3]=d;F[4]=e;F[5]=f;F[6]=g;F[7]=h;F[8]=l;F[9]=m;F[10]=n;F[11]=p;F[12]=q;F[13]=r;F[14]=v;F[15]=w;F[16]=z;F[17]=B;return Z.c?Z.c(this,F,0):Z.call(null,this,F,0)};k.pa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F){var L=qe(19);L[0]=a;L[1]=b;L[2]=c;L[3]=d;L[4]=e;L[5]=f;L[6]=g;L[7]=h;L[8]=l;L[9]=m;L[10]=n;L[11]=p;L[12]=q;L[13]=r;L[14]=v;L[15]=w;L[16]=z;L[17]=B;L[18]=F;return Z.c?Z.c(this,L,0):Z.call(null,this,L,0)};
k.qa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F,L){var P=qe(20);P[0]=a;P[1]=b;P[2]=c;P[3]=d;P[4]=e;P[5]=f;P[6]=g;P[7]=h;P[8]=l;P[9]=m;P[10]=n;P[11]=p;P[12]=q;P[13]=r;P[14]=v;P[15]=w;P[16]=z;P[17]=B;P[18]=F;P[19]=L;return Z.c?Z.c(this,P,0):Z.call(null,this,P,0)};k.Kb=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F,L,P){a=qe(te.a(new R(null,20,5,S,[a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,B,F,L],null),P));return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)};k.O=function(){return this.S};
k.Z=function(){return 2+O(this.G)};k.T=function(){var a=this.u;return null!=a?a:this.u=a=ae(this)};k.D=function(a,b){var c;c=x(b)?(c=this.constructor===b.constructor)?Mf(this,b):c:b;return x(c)?!0:!1};k.ib=function(a,b){return Fd(new Cg(null,new u(null,2,[Ti,null,Yj,null],null),null),b)?pd.a(Qc(df.a(De,this),this.S),b):new ol(this.va,this.rb,this.S,ye(pd.a(this.G,b)),null)};
k.Oa=function(a,b,c){return x(V.a?V.a(Yj,b):V.call(null,Yj,b))?new ol(c,this.rb,this.S,this.G,null):x(V.a?V.a(Ti,b):V.call(null,Ti,b))?new ol(this.va,c,this.S,this.G,null):new ol(this.va,this.rb,this.S,nd.c(this.G,b,c),null)};k.U=function(){return I(te.a(new R(null,2,5,S,[new R(null,2,5,S,[Yj,this.va],null),new R(null,2,5,S,[Ti,this.rb],null)],null),this.G))};k.P=function(a,b){return new ol(this.va,this.rb,b,this.G,this.u)};k.X=function(a,b){return wd(b)?qb(this,D.a(b,0),D.a(b,1)):$a.c(fb,this,b)};
function pl(a,b){return new ol(a,b,null,null,null)}function Z(a,b,c){return new ml(a.va,b,c,null,null,null)}function ql(a){return new u(null,2,[pj,null!=a&&a.yb?function(a,c,d){return a.zb(null,c,d)}:cl,ai,null!=a&&a.yb?function(a,c,d){return a.Ab(null,c,d)}:dl],null)}function rl(a){return new u(null,1,[yj,null!=a&&a.Jc?function(a,c){return a.rc(0,c)}:fl],null)}
function sl(a){var b=function(b){return function(d,e,f,g,h){f=id.a(f,b.a?b.a(a,g):b.call(null,a,g));return h.m?h.m(d,e,f,g):h.call(null,d,e,f,g)}}(yj.b(rl(a)));return nl(ll(il,b,b))}function tl(a){var b=ql(a),c=pj.b(b),d=ai.b(b);return nl(ll(jl,function(b,c){return function(b,d){return c.c?c.c(a,b,d):c.call(null,a,b,d)}}(b,c,d),function(b,c,d){return function(b,c){return d.c?d.c(a,b,c):d.call(null,a,b,c)}}(b,c,d)))}
var ul=function ul(b){if(null!=b&&null!=b.lb)return b.lb(b);var c=ul[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ul._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("CoercePath.coerce-path",b);};ul["null"]=function(){return tl(null)};ml.prototype.lb=function(){return this};ol.prototype.lb=function(){return this};R.prototype.lb=function(){return gl(this)};Cc.prototype.lb=function(){return ul(Kd(this))};ee.prototype.lb=function(){return ul(Kd(this))};bd.prototype.lb=function(){return ul(Kd(this))};
ul._=function(a){var b;b=(b=(b=ca(a))?b:null!=a?a.Pc?!0:a.ec?!1:Ua(ab,a):Ua(ab,a))?b:null!=a?a.yb?!0:a.ec?!1:Ua(bl,a):Ua(bl,a);if(x(b))a=tl(a);else if(null!=a?a.Jc||(a.ec?0:Ua(el,a)):Ua(el,a))a=sl(a);else throw b=H,a=[A("Protocol implementation cannot be found for object.\n        Extending Specter protocols should not be done inline in a deftype definition\n        because that prevents Specter from finding the protocol implementations for\n        optimized performance. Instead, you should extend the protocols via an\n        explicit extend-protocol call. \n"),
A(a)].join(""),a=b([a],0),Error(C.a(A,a));return a};function vl(a){return a.Ka.type}
function wl(a){var b=Q(a,0),c=Xd(a,1),d=b.Ka,e=d.type,f=rc.a(e,Ih)?function(a,b,c,d,e,f){return function(q,r){return function(a,b,c,d,e,f){return function(g,h,l,m,n){var p=function(){return function(a,b,c,d){return r.A?r.A(a,b,c,d,n):r.call(null,a,b,c,d,n)}}(g,h,l,m,a,b,c,d,e,f);return q.A?q.A(g,h,l,m,p):q.call(null,g,h,l,m,p)}}(a,b,c,d,e,f)}}(d,e,a,b,c,a):function(a,b,c,d,e,f){return function(q,r){return function(a,b,c,d,e,f){return function(g,h){var l=function(){return function(a){return r.a?r.a(a,
h):r.call(null,a,h)}}(g,a,b,c,d,e,f);return q.a?q.a(g,l):q.call(null,g,l)}}(a,b,c,d,e,f)}}(d,e,a,b,c,a);return $a.a(function(a,b,c){return function(b,d){return ll(a,function(){var a=b.La,e=d.La;return c.a?c.a(a,e):c.call(null,a,e)}(),function(){var a=b.Ma,e=d.Ma;return c.a?c.a(a,e):c.call(null,a,e)}())}}(d,e,f,a,b,c,a),a)}
function xl(a){if(rc.a(vl(a),Ih))return a;var b=a.La;a=a.Ma;return ll(il,function(a,b){return function(e,f,g,h,l){var m=function(){return function(a){return l.m?l.m(e,f,g,a):l.call(null,e,f,g,a)}}(h,a,b);return a.a?a.a(h,m):a.call(null,h,m)}}(b,a),function(a,b){return function(e,f,g,h,l){var m=function(){return function(a){return l.m?l.m(e,f,g,a):l.call(null,e,f,g,a)}}(h,a,b);return b.a?b.a(h,m):b.call(null,h,m)}}(b,a))}
function yl(a){if(a instanceof ml){var b=yi.b(a),c=Zi.b(a),d=Eh.b(Yj.b(a)),e=Mh.b(Yj.b(a));return sd(b)?a:nl(ll(il,function(a,b,c,d){return function(e,n,p,q,r){var v=function(){return function(a,b,c,d){return r.m?r.m(e,n,c,d):r.call(null,e,n,c,d)}}(a,b,p,q,a,b,c,d);return c.A?c.A(a,b,p,q,v):c.call(null,a,b,p,q,v)}}(b,c,d,e),function(a,b,c,d){return function(e,n,p,q,r){var v=function(){return function(a,b,c,d){return r.m?r.m(e,n,c,d):r.call(null,e,n,c,d)}}(a,b,p,q,a,b,c,d);return d.A?d.A(a,b,p,q,v):
d.call(null,a,b,p,q,v)}}(b,c,d,e)))}return a}gl["null"]=function(a){return ul(a)};gl._=function(a){return ul(a)};R.prototype.Gc=function(){if(sd(this))return ul(null);var a=T.a(yl,T.a(ul,this)),b=T.a(wl,Kg(vl,T.a(Yj,a))),c=rc.a(1,O(b))?J(b):wl(T.a(xl,b)),a=af(function(){return function(a){return a instanceof ol}}(a,b,c,this),a);return sd(a)?nl(c):pl(xl(c),$a.a(Nd,T.a(Ti,a)))};function zl(a){return a instanceof ml?0:Ti.b(a)}
var Al=function Al(b,c){if(null!=b&&null!=b.Hc)return b.Hc(0,c);var d=Al[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Al._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("SetExtremes.set-first",b);},Bl=function Bl(b,c){if(null!=b&&null!=b.Ic)return b.Ic(0,c);var d=Bl[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Bl._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("SetExtremes.set-last",b);};
R.prototype.Hc=function(a,b){return nd.c(this,0,b)};R.prototype.Ic=function(a,b){return nd.c(this,O(this)-1,b)};Al._=function(a,b){return N(b,Dc(a))};Bl._=function(a,b){var c=Fg(a);return id.a(Kd(c),b)};function Cl(a,b){var c=a.va;return c.Ka.sd.call(null,a.Xa,a.Ya,c.La,b)}function Dl(a,b,c){var d=a.va;return d.Ka.ud.call(null,a.Xa,a.Ya,d.Ma,b,c)}function El(){}El.prototype.yb=!0;El.prototype.zb=function(a,b,c){return df.a(jd,$k(c,b))};
El.prototype.Ab=function(a,b,c){a=null==b?null:db(b);if(de(a))for(c=b=T.a(c,b);;)if(I(c))c=K(c);else break;else b=df.a(a,Zk(c,b));return b};function Fl(){}Fl.prototype.Jc=!0;Fl.prototype.rc=function(a,b){return b};function Gl(a,b){this.Lc=a;this.td=b}Gl.prototype.yb=!0;Gl.prototype.zb=function(a,b,c){if(sd(b))return null;a=this.Lc.call(null,b);return c.b?c.b(a):c.call(null,a)};
Gl.prototype.Ab=function(a,b,c){var d=this;return sd(b)?b:d.td.call(null,b,function(){var a=d.Lc.call(null,b);return c.b?c.b(a):c.call(null,a)}())};function Hl(a,b,c,d){a=Ff.c(Kd(a),b,c);return d.b?d.b(a):d.call(null,a)}function Il(a,b,c,d){var e=Kd(a),f=Ff.c(e,b,c);d=d.b?d.b(f):d.call(null,f);b=te.h(Ff.c(e,0,b),d,H([Ff.c(e,c,O(a))],0));return wd(a)?Kd(b):b}bl["null"]=!0;cl["null"]=function(a,b,c){return c.b?c.b(b):c.call(null,b)};dl["null"]=function(a,b,c){return c.b?c.b(b):c.call(null,b)};
function Jl(a,b,c){return x(a.b?a.b(b):a.call(null,b))?c.b?c.b(b):c.call(null,b):null}function Kl(a,b,c){return x(a.b?a.b(b):a.call(null,b))?c.b?c.b(b):c.call(null,b):b};function Ll(a){return gl(Kd(a))}function Ml(a,b){var c=gl(a);return Cl.a?Cl.a(c,b):Cl.call(null,c,b)}function Nl(a,b,c){a=gl(a);return Dl.c?Dl.c(a,b,c):Dl.call(null,a,b,c)}var Ol=Ll(H([new El],0)),Pl=new Fl,Ql=Ll(H([new Gl(hd,Bl)],0));Ll(H([new Gl(J,Al)],0));
var Rl=pl(ll(il,function(a,b,c,d,e){var f=a[b+0],g=a[b+1];return Hl(d,f.b?f.b(d):f.call(null,d),g.b?g.b(d):g.call(null,d),function(d){var f=b+2;return e.m?e.m(a,f,c,d):e.call(null,a,f,c,d)})},function(a,b,c,d,e){var f=a[b+0],g=a[b+1];return Il(d,f.b?f.b(d):f.call(null,d),g.b?g.b(d):g.call(null,d),function(d){var f=b+2;return e.m?e.m(a,f,c,d):e.call(null,a,f,c,d)})}),2),Sl=pl(ll(il,function(a,b,c,d,e){return Hl(d,a[b+0],a[b+1],function(d){var g=b+2;return e.m?e.m(a,g,c,d):e.call(null,a,g,c,d)})},function(a,
b,c,d,e){return Il(d,a[b+0],a[b+1],function(d){var g=b+2;return e.m?e.m(a,g,c,d):e.call(null,a,g,c,d)})}),2);Sl.a?Sl.a(0,0):Sl.call(null,0,0);Rl.a?Rl.a(O,O):Rl.call(null,O,O);y.prototype.yb=!0;y.prototype.zb=function(a,b,c){a=G.a(b,this);return c.b?c.b(a):c.call(null,a)};y.prototype.Ab=function(a,b,c){var d=this;return nd.c(b,d,function(){var a=G.a(b,d);return c.b?c.b(a):c.call(null,a)}())};bl["function"]=!0;cl["function"]=function(a,b,c){return Jl(a,b,c)};
dl["function"]=function(a,b,c){return Kl(a,b,c)};Cg.prototype.yb=!0;Cg.prototype.zb=function(a,b,c){return Jl(this,b,c)};Cg.prototype.Ab=function(a,b,c){return Kl(this,b,c)};var Tl=pl(ll(il,function(a,b,c,d,e){var f=a[b+0];d=x(d)?d:f;b+=1;return e.m?e.m(a,b,c,d):e.call(null,a,b,c,d)},function(a,b,c,d,e){var f=a[b+0];d=x(d)?d:f;b+=1;return e.m?e.m(a,b,c,d):e.call(null,a,b,c,d)}),1);Tl.b?Tl.b(Dg):Tl.call(null,Dg);var Ul=Ec;Tl.b?Tl.b(Ul):Tl.call(null,Ul);Tl.b?Tl.b(jd):Tl.call(null,jd);
function Vl(){var a=H([pk],0),b=T.a(gl,new R(null,1,5,S,[a],null)),c=T.a(zl,b),d=N(0,Lg(c)),e=hd(d),f=T.c(function(a,b,c,d){return function(e,f){return x(f instanceof ml)?function(){return function(){return f}}(a,b,c,d):function(){return function(a,b){return Z(f,a,b+e)}}(a,b,c,d)}}(b,c,d,e),d,b),g=Q(f,0),a=function(){var a=function(a,b,c,d,e,f,g){return function(a,b,c,e,f){var h;h=g.a?g.a(a,b):g.call(null,a,b);var l=Cl.a?Cl.a(h,e):Cl.call(null,h,e);if(1<O(l))throw a=H(["More than one element found for params: ",
h,e],0),Error(C.a(A,a));h=J(l);b+=d;c=id.a(c,h);return f.m?f.m(a,b,c,e):f.call(null,a,b,c,e)}}(b,c,d,e,f,f,g);return pl(ll(il,a,a),e)}();return rc.a(0,e)?Z(a,null,0):a};function Wl(a){return rc.a(Sh,Bi.b(a))}function Xl(a){return Nl(new R(null,7,5,S,[ji,Ol,Vh,Ol,function(a){return Wj.b(a)},ok,Ql],null),Ie(qi),a)}if("undefined"===typeof Yl)var Yl=function(){var a=X.b?X.b(De):X.call(null,De),b=X.b?X.b(De):X.call(null,De),c=X.b?X.b(De):X.call(null,De),d=X.b?X.b(De):X.call(null,De),e=G.c(De,ek,hh());return new uh(Ac.a("pennygame.updates","capacity"),function(){return function(a,b){var c=null!=b&&(b.g&64||b.F)?C.a(Oc,b):b;return G.a(c,Bi)}}(a,b,c,d,e),gi,e,a,b,c,d)}();
wh(Yl,Ji,function(a){return a});wh(Yl,Vi,function(a){switch(a){case 1:return 4;case 2:return 4;case 3:return 4;case 4:return 4;case 5:return 5;case 6:return 6;default:throw Error([A("No matching clause: "),A(a)].join(""));}});wh(Yl,Fi,function(a,b,c){a=null!=b&&(b.g&64||b.F)?C.a(Oc,b):b;b=G.a(a,Dh);a=G.a(a,fi);c=ld(c,b);b=null!=c&&(c.g&64||c.F)?C.a(Oc,c):c;c=G.a(b,Wh);b=G.a(b,ok);if(rc.a(a,Wh))return c;a=O(b);return c<a?c:a});function Zl(a,b){return Nl(new R(null,4,5,S,[ji,Ol,Vh,Ol],null),b,a)}
function $l(a,b){return Kd(T.c(function(a,b){return nd.c(a,li,b)},a,b))}function am(a,b){return kf(a,mf,$l,b)}function bm(a,b){return Nl(new R(null,6,5,S,[ji,Ol,Vh,Pl,Ol,function(a){return Fd(a,Lh)}],null),function(a,d){var e=null!=d&&(d.g&64||d.F)?C.a(Oc,d):d,f=G.a(e,Lh),g=G.a(e,qk);G.a(e,ok);f=ff(b,new R(null,2,5,S,[f,li],null));g=Yl.c?Yl.c(f,g,a):Yl.call(null,f,g,a);return nd.c(e,Wh,g)},a)}
function cm(a,b){return Nl(new R(null,7,5,S,[ji,Ol,Vh,Pl,Ol,function(a){return Fd(a,Lh)},function(a){return rc.a(Fi,ff(a,new R(null,2,5,S,[qk,Bi],null)))}],null),function(a,d){var e=null!=d&&(d.g&64||d.F)?C.a(Oc,d):d,f=G.a(e,Lh),g=G.a(e,qk);G.a(e,ok);f=ff(b,new R(null,2,5,S,[f,li],null));g=Yl.c?Yl.c(f,g,a):Yl.call(null,f,g,a);return nd.c(e,Wh,g)},a)}function dm(a){var b=a.b?a.b(mf):a.call(null,mf);return cm(bm(a,b),b)}
if("undefined"===typeof em){var em,fm=X.b?X.b(De):X.call(null,De),gm=X.b?X.b(De):X.call(null,De),hm=X.b?X.b(De):X.call(null,De),im=X.b?X.b(De):X.call(null,De),jm=G.c(De,ek,hh());em=new uh(Ac.a("pennygame.updates","process"),Bi,gi,jm,fm,gm,hm,im)}wh(em,gi,function(a){a=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a;var b=G.a(a,Wh),c=G.a(a,ok);return nd.h(a,ok,Ue(b,c),H([Sj,Te(b,c)],0))});wh(em,si,function(a){a=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a;var b=G.a(a,Wh);return nd.c(a,Sj,Te(b,Ve(De)))});
function km(a){var b=J(Ml(new R(null,4,5,S,[Vh,Ol,function(a){return Hj.b(a)},Hj],null),a));return Nl(new R(null,5,5,S,[Vh,function(){var a=b+1;return Sl.a?Sl.a(b,a):Sl.call(null,b,a)}(),Ol,Sj,Ql],null),Ie(qi),a)}function lm(a){return Ge(function(a){return rc.a(a,qi)},Ml(new R(null,4,5,S,[Ol,function(a){return Hj.b(a)},Sj,Ol],null),a))}function mm(a){return x(lm(a.b?a.b(Vh):a.call(null,Vh)))?km(a):a}
function nm(a){return Nl(new R(null,2,5,S,[ji,Ol],null),mm,Nl(new R(null,5,5,S,[ji,Ol,Vh,Ol,function(a){return G.a(a,Wh)}],null),em,a))}function om(a){var b=C.c(Td,16.5,T.a(function(a){var b=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a;a=G.a(b,Ej);var e=G.a(b,pk),b=G.a(b,ok);return a/(O(e)+O(b))},Ml(new R(null,5,5,S,[ji,Ol,Vh,Ol,Wl],null),a)));return Nl(new R(null,5,5,S,[ji,Ol,Vh,Ol,Wl],null),function(a){return function(b){return kf(b,Ah,Td,a)}}(b),a)}
function pm(a){return Nl(new R(null,6,5,S,[ji,Ol,Vh,Pl,Ol,function(a){return Fd(a,Bh)}],null),function(a,c){var d=null!=c&&(c.g&64||c.F)?C.a(Oc,c):c,e=G.a(d,Bh);return nd.c(d,pk,ff(Kd(a),new R(null,2,5,S,[e,Sj],null)))},a)}function qm(a){return Nl(new R(null,6,5,S,[ji,Ol,Vh,Ol,Vl(),ok],null),function(a,c){return te.a(c,a)},a)}
function rm(a,b){var c=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a,c=G.a(c,Vh),d=null!=b&&(b.g&64||b.F)?C.a(Oc,b):b,e=G.c(d,Jh,0),f=G.a(d,xj),g=G.a(d,zi),h=G.c(d,ei,new R(null,2,5,S,[0,0],null)),d=O(Sj.b(J(c))),l=O(Sj.b(hd(Fg(c)))),m=C.c(T,Nd,T.a(Ng(Je.a(O,Sj),Wh),Ml(new R(null,2,5,S,[Ol,Wl],null),c))),n=$a.a(Nd,T.a(O,Ml(new R(null,3,5,S,[Ol,Wl,ok],null),c))),h=T.c(Nd,h,m);return new u(null,6,[Ki,n,Jh,x(lm(c))?e+1:e,xj,f+d,zi,g+l,ei,h,aj,C.a(Qd,h)],null)}
function sm(a){return Nl(new R(null,5,5,S,[ji,Ol,function(a){return I(G.a(a,Vh))},Pl,Th],null),function(a,c){return id.a(c,rm(a,null==c?null:xb(c)))},Nl(new R(null,7,5,S,[ji,Ol,function(a){return I(G.a(a,Vh))},Vh,Ol,function(a){return O(Sj.b(a))<Wh.b(a)},fk],null),Rc,a))};var tm,um=function um(b,c){if(null!=b&&null!=b.pc)return b.pc(0,c);var d=um[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=um._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("ReadPort.take!",b);},vm=function vm(b,c,d){if(null!=b&&null!=b.dc)return b.dc(0,c,d);var e=vm[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=vm._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Va("WritePort.put!",b);},wm=function wm(b){if(null!=b&&null!=b.cc)return b.cc();
var c=wm[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=wm._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("Channel.close!",b);},xm=function xm(b){if(null!=b&&null!=b.Ec)return!0;var c=xm[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=xm._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("Handler.active?",b);},ym=function ym(b){if(null!=b&&null!=b.Fc)return b.Fa;var c=ym[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ym._;if(null!=c)return c.b?
c.b(b):c.call(null,b);throw Va("Handler.commit",b);},zm=function zm(b,c){if(null!=b&&null!=b.Dc)return b.Dc(0,c);var d=zm[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=zm._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("Buffer.add!*",b);},Am=function Am(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Am.b(arguments[0]);case 2:return Am.a(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),
A(c.length)].join(""));}};Am.b=function(a){return a};Am.a=function(a,b){return zm(a,b)};Am.w=2;var Bm,Cm=function Cm(b){"undefined"===typeof Bm&&(Bm=function(b,d,e){this.sc=b;this.Fa=d;this.ld=e;this.g=393216;this.C=0},Bm.prototype.P=function(b,d){return new Bm(this.sc,this.Fa,d)},Bm.prototype.O=function(){return this.ld},Bm.prototype.Ec=function(){return!0},Bm.prototype.Fc=function(){return this.Fa},Bm.ic=function(){return new R(null,3,5,S,[Qc(gk,new u(null,2,[Yh,!0,Be,pc(Ce,pc(new R(null,1,5,S,[zk],null)))],null)),zk,wa.Gd],null)},Bm.xb=!0,Bm.eb="cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers22073",
Bm.Tb=function(b,d){return Qb(d,"cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers22073")});return new Bm(Cm,b,De)};function Dm(a){try{return a[0].call(null,a)}catch(b){throw b instanceof Object&&a[6].cc(),b;}}function Em(a,b,c){c=c.pc(0,Cm(function(c){a[2]=c;a[1]=b;return Dm(a)}));return x(c)?(a[2]=M.b?M.b(c):M.call(null,c),a[1]=b,Y):null}function Fm(a,b,c,d){c=c.dc(0,d,Cm(function(c){a[2]=c;a[1]=b;return Dm(a)}));return x(c)?(a[2]=M.b?M.b(c):M.call(null,c),a[1]=b,Y):null}
function Gm(a,b){var c=a[6];null!=b&&c.dc(0,b,Cm(function(){return function(){return null}}(c)));c.cc();return c}function Hm(a,b,c,d,e,f,g,h){this.Sa=a;this.Ta=b;this.Va=c;this.Ua=d;this.Za=e;this.S=f;this.G=g;this.u=h;this.g=2229667594;this.C=8192}k=Hm.prototype;k.N=function(a,b){return nb.c(this,b,null)};
k.I=function(a,b,c){switch(b instanceof y?b.Ha:null){case "catch-block":return this.Sa;case "catch-exception":return this.Ta;case "finally-block":return this.Va;case "continue-block":return this.Ua;case "prev":return this.Za;default:return G.c(this.G,b,c)}};
k.M=function(a,b,c){return Af(b,function(){return function(a){return Af(b,Bf,""," ","",c,a)}}(this),"#cljs.core.async.impl.ioc-helpers.ExceptionFrame{",", ","}",c,te.a(new R(null,5,5,S,[new R(null,2,5,S,[Ci,this.Sa],null),new R(null,2,5,S,[wj,this.Ta],null),new R(null,2,5,S,[hi,this.Va],null),new R(null,2,5,S,[Fj,this.Ua],null),new R(null,2,5,S,[Aj,this.Za],null)],null),this.G))};k.Ga=function(){return new Nf(0,this,5,new R(null,5,5,S,[Ci,wj,hi,Fj,Aj],null),hc(this.G))};k.O=function(){return this.S};
k.Z=function(){return 5+O(this.G)};k.T=function(){var a=this.u;return null!=a?a:this.u=a=ae(this)};k.D=function(a,b){var c;c=x(b)?(c=this.constructor===b.constructor)?Mf(this,b):c:b;return x(c)?!0:!1};k.ib=function(a,b){return Fd(new Cg(null,new u(null,5,[hi,null,Ci,null,wj,null,Aj,null,Fj,null],null),null),b)?pd.a(Qc(df.a(De,this),this.S),b):new Hm(this.Sa,this.Ta,this.Va,this.Ua,this.Za,this.S,ye(pd.a(this.G,b)),null)};
k.Oa=function(a,b,c){return x(V.a?V.a(Ci,b):V.call(null,Ci,b))?new Hm(c,this.Ta,this.Va,this.Ua,this.Za,this.S,this.G,null):x(V.a?V.a(wj,b):V.call(null,wj,b))?new Hm(this.Sa,c,this.Va,this.Ua,this.Za,this.S,this.G,null):x(V.a?V.a(hi,b):V.call(null,hi,b))?new Hm(this.Sa,this.Ta,c,this.Ua,this.Za,this.S,this.G,null):x(V.a?V.a(Fj,b):V.call(null,Fj,b))?new Hm(this.Sa,this.Ta,this.Va,c,this.Za,this.S,this.G,null):x(V.a?V.a(Aj,b):V.call(null,Aj,b))?new Hm(this.Sa,this.Ta,this.Va,this.Ua,c,this.S,this.G,
null):new Hm(this.Sa,this.Ta,this.Va,this.Ua,this.Za,this.S,nd.c(this.G,b,c),null)};k.U=function(){return I(te.a(new R(null,5,5,S,[new R(null,2,5,S,[Ci,this.Sa],null),new R(null,2,5,S,[wj,this.Ta],null),new R(null,2,5,S,[hi,this.Va],null),new R(null,2,5,S,[Fj,this.Ua],null),new R(null,2,5,S,[Aj,this.Za],null)],null),this.G))};k.P=function(a,b){return new Hm(this.Sa,this.Ta,this.Va,this.Ua,this.Za,b,this.G,this.u)};k.X=function(a,b){return wd(b)?qb(this,D.a(b,0),D.a(b,1)):$a.c(fb,this,b)};
function Im(a){for(;;){var b=a[4],c=Ci.b(b),d=wj.b(b),e=a[5];if(x(function(){var a=e;return x(a)?Sa(b):a}()))throw e;if(x(function(){var a=e;return x(a)?(a=c,x(a)?e instanceof d:a):a}())){a[1]=c;a[2]=e;a[5]=null;a[4]=nd.h(b,Ci,null,H([wj,null],0));break}if(x(function(){var a=e;return x(a)?Sa(c)&&Sa(hi.b(b)):a}()))a[4]=Aj.b(b);else{if(x(function(){var a=e;return x(a)?(a=Sa(c))?hi.b(b):a:a}())){a[1]=hi.b(b);a[4]=nd.c(b,hi,null);break}if(x(function(){var a=Sa(e);return a?hi.b(b):a}())){a[1]=hi.b(b);
a[4]=nd.c(b,hi,null);break}if(Sa(e)&&Sa(hi.b(b))){a[1]=Fj.b(b);a[4]=Aj.b(b);break}throw Error("No matching clause");}}};function Jm(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function Km(a,b,c,d){this.head=a;this.R=b;this.length=c;this.f=d}Km.prototype.pop=function(){if(0===this.length)return null;var a=this.f[this.R];this.f[this.R]=null;this.R=(this.R+1)%this.f.length;--this.length;return a};Km.prototype.unshift=function(a){this.f[this.head]=a;this.head=(this.head+1)%this.f.length;this.length+=1;return null};function Lm(a,b){a.length+1===a.f.length&&a.resize();a.unshift(b)}
Km.prototype.resize=function(){var a=Array(2*this.f.length);return this.R<this.head?(Jm(this.f,this.R,a,0,this.length),this.R=0,this.head=this.length,this.f=a):this.R>this.head?(Jm(this.f,this.R,a,0,this.f.length-this.R),Jm(this.f,0,a,this.f.length-this.R,this.head),this.R=0,this.head=this.length,this.f=a):this.R===this.head?(this.head=this.R=0,this.f=a):null};function Mm(a,b){for(var c=a.length,d=0;;)if(d<c){var e=a.pop();(b.b?b.b(e):b.call(null,e))&&a.unshift(e);d+=1}else break}
function Nm(a){return new Km(0,0,0,Array(a))}function Om(a,b){this.L=a;this.n=b;this.g=2;this.C=0}function Pm(a){return a.L.length===a.n}Om.prototype.Dc=function(a,b){Lm(this.L,b);return this};Om.prototype.Z=function(){return this.L.length};var Qm;
function Rm(){var a=aa.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==Rk.indexOf("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=ka(function(a){if(("*"==d||a.origin==
d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&-1==Rk.indexOf("Trident")&&-1==Rk.indexOf("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.vc;c.vc=null;a()}};return function(a){d.next={vc:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=
document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){aa.setTimeout(a,0)}};var Sm=Nm(32),Tm=!1,Um=!1;Vm;function Wm(){Tm=!0;Um=!1;for(var a=0;;){var b=Sm.pop();if(null!=b&&(b.l?b.l():b.call(null),1024>a)){a+=1;continue}break}Tm=!1;return 0<Sm.length?Vm.l?Vm.l():Vm.call(null):null}function Vm(){var a=Um;if(x(x(a)?Tm:a))return null;Um=!0;!ca(aa.setImmediate)||aa.Window&&aa.Window.prototype&&aa.Window.prototype.setImmediate==aa.setImmediate?(Qm||(Qm=Rm()),Qm(Wm)):aa.setImmediate(Wm)}function Xm(a){Lm(Sm,a);Vm()}function Ym(a,b){setTimeout(a,b)};var Zm,$m=function $m(b){"undefined"===typeof Zm&&(Zm=function(b,d,e){this.Oc=b;this.H=d;this.md=e;this.g=425984;this.C=0},Zm.prototype.P=function(b,d){return new Zm(this.Oc,this.H,d)},Zm.prototype.O=function(){return this.md},Zm.prototype.Jb=function(){return this.H},Zm.ic=function(){return new R(null,3,5,S,[Qc($i,new u(null,1,[Be,pc(Ce,pc(new R(null,1,5,S,[lj],null)))],null)),lj,wa.Hd],null)},Zm.xb=!0,Zm.eb="cljs.core.async.impl.channels/t_cljs$core$async$impl$channels22136",Zm.Tb=function(b,d){return Qb(d,
"cljs.core.async.impl.channels/t_cljs$core$async$impl$channels22136")});return new Zm($m,b,De)};function an(a,b){this.Ub=a;this.H=b}function bn(a){return xm(a.Ub)}var cn=function cn(b){if(null!=b&&null!=b.Cc)return b.Cc();var c=cn[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=cn._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("MMC.abort",b);};function dn(a,b,c,d,e,f,g){this.Gb=a;this.hc=b;this.sb=c;this.gc=d;this.L=e;this.closed=f;this.Ja=g}
dn.prototype.Cc=function(){for(;;){var a=this.sb.pop();if(null!=a){var b=a.Ub;Xm(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(b.Fa,b,a.H,a,this))}break}Mm(this.sb,Ie(!1));return wm(this)};
dn.prototype.dc=function(a,b,c){var d=this;if(a=d.closed)return $m(!a);if(x(function(){var a=d.L;return x(a)?Sa(Pm(d.L)):a}())){for(c=Tc(d.Ja.a?d.Ja.a(d.L,b):d.Ja.call(null,d.L,b));;){if(0<d.Gb.length&&0<O(d.L)){var e=d.Gb.pop(),f=e.Fa,g=d.L.L.pop();Xm(function(a,b){return function(){return a.b?a.b(b):a.call(null,b)}}(f,g,e,c,a,this))}break}c&&cn(this);return $m(!0)}e=function(){for(;;){var a=d.Gb.pop();if(x(a)){if(x(!0))return a}else return null}}();if(x(e))return c=ym(e),Xm(function(a){return function(){return a.b?
a.b(b):a.call(null,b)}}(c,e,a,this)),$m(!0);64<d.gc?(d.gc=0,Mm(d.sb,bn)):d.gc+=1;Lm(d.sb,new an(c,b));return null};
dn.prototype.pc=function(a,b){var c=this;if(null!=c.L&&0<O(c.L)){for(var d=b.Fa,e=$m(c.L.L.pop());;){if(!x(Pm(c.L))){var f=c.sb.pop();if(null!=f){var g=f.Ub,h=f.H;Xm(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(g.Fa,g,h,f,d,e,this));Tc(c.Ja.a?c.Ja.a(c.L,h):c.Ja.call(null,c.L,h))&&cn(this);continue}}break}return e}d=function(){for(;;){var a=c.sb.pop();if(x(a)){if(xm(a.Ub))return a}else return null}}();if(x(d))return e=ym(d.Ub),Xm(function(a){return function(){return a.b?a.b(!0):
a.call(null,!0)}}(e,d,this)),$m(d.H);if(x(c.closed))return x(c.L)&&(c.Ja.b?c.Ja.b(c.L):c.Ja.call(null,c.L)),x(x(!0)?b.Fa:!0)?(d=function(){var a=c.L;return x(a)?0<O(c.L):a}(),d=x(d)?c.L.L.pop():null,$m(d)):null;64<c.hc?(c.hc=0,Mm(c.Gb,xm)):c.hc+=1;Lm(c.Gb,b);return null};
dn.prototype.cc=function(){var a=this;if(!a.closed)for(a.closed=!0,x(function(){var b=a.L;return x(b)?0===a.sb.length:b}())&&(a.Ja.b?a.Ja.b(a.L):a.Ja.call(null,a.L));;){var b=a.Gb.pop();if(null==b)break;else{var c=b.Fa,d=x(function(){var b=a.L;return x(b)?0<O(a.L):b}())?a.L.L.pop():null;Xm(function(a,b){return function(){return a.b?a.b(b):a.call(null,b)}}(c,d,b,this))}}return null};function en(a){console.log(a);return null}
function fn(a,b){var c=(x(null)?null:en).call(null,b);return null==c?a:Am.a(a,c)}
function gn(a){return new dn(Nm(32),0,Nm(32),0,a,!1,function(){return function(a){return function(){function c(c,d){try{return a.a?a.a(c,d):a.call(null,c,d)}catch(e){return fn(c,e)}}function d(c){try{return a.b?a.b(c):a.call(null,c)}catch(d){return fn(c,d)}}var e=null,e=function(a,b){switch(arguments.length){case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};e.b=d;e.a=c;return e}()}(x(null)?null.b?null.b(Am):null.call(null,Am):Am)}())};function hn(a,b,c){this.key=a;this.H=b;this.forward=c;this.g=2155872256;this.C=0}hn.prototype.U=function(){return fb(fb(Ec,this.H),this.key)};hn.prototype.M=function(a,b,c){return Af(b,Bf,"["," ","]",c,this)};function jn(a,b,c){c=Array(c+1);for(var d=0;;)if(d<c.length)c[d]=null,d+=1;else break;return new hn(a,b,c)}function kn(a,b,c,d){for(;;){if(0>c)return a;a:for(;;){var e=a.forward[c];if(x(e))if(e.key<b)a=e;else break a;else break a}null!=d&&(d[c]=a);--c}}
function ln(a,b){this.ob=a;this.level=b;this.g=2155872256;this.C=0}ln.prototype.put=function(a,b){var c=Array(15),d=kn(this.ob,a,this.level,c).forward[0];if(null!=d&&d.key===a)return d.H=b;a:for(d=0;;)if(.5>Math.random()&&15>d)d+=1;else break a;if(d>this.level){for(var e=this.level+1;;)if(e<=d+1)c[e]=this.ob,e+=1;else break;this.level=d}for(d=jn(a,b,Array(d));;)return 0<=this.level?(c=c[0].forward,d.forward[0]=c[0],c[0]=d):null};
ln.prototype.remove=function(a){var b=Array(15),c=kn(this.ob,a,this.level,b).forward[0];if(null!=c&&c.key===a){for(a=0;;)if(a<=this.level){var d=b[a].forward;d[a]===c&&(d[a]=c.forward[a]);a+=1}else break;for(;;)if(0<this.level&&null==this.ob.forward[this.level])--this.level;else return null}else return null};function mn(a){for(var b=nn,c=b.ob,d=b.level;;){if(0>d)return c===b.ob?null:c;var e;a:for(e=c;;){e=e.forward[d];if(null==e){e=null;break a}if(e.key>=a)break a}null!=e?(--d,c=e):--d}}
ln.prototype.U=function(){return function(a){return function c(d){return new je(null,function(){return function(){return null==d?null:N(new R(null,2,5,S,[d.key,d.H],null),c(d.forward[0]))}}(a),null,null)}}(this)(this.ob.forward[0])};ln.prototype.M=function(a,b,c){return Af(b,function(){return function(a){return Af(b,Bf,""," ","",c,a)}}(this),"{",", ","}",c,this)};var nn=new ln(jn(null,null,0),0);
function on(a){var b=(new Date).valueOf()+a,c=mn(b),d=x(x(c)?c.key<b+10:c)?c.H:null;if(x(d))return d;var e=gn(null);nn.put(b,e);Ym(function(a,b,c){return function(){nn.remove(c);return wm(a)}}(e,d,b,c),a);return e};var pn=function pn(b){"undefined"===typeof tm&&(tm=function(b,d,e){this.sc=b;this.Fa=d;this.kd=e;this.g=393216;this.C=0},tm.prototype.P=function(b,d){return new tm(this.sc,this.Fa,d)},tm.prototype.O=function(){return this.kd},tm.prototype.Ec=function(){return!0},tm.prototype.Fc=function(){return this.Fa},tm.ic=function(){return new R(null,3,5,S,[Qc(gk,new u(null,2,[Yh,!0,Be,pc(Ce,pc(new R(null,1,5,S,[zk],null)))],null)),zk,wa.Fd],null)},tm.xb=!0,tm.eb="cljs.core.async/t_cljs$core$async19305",tm.Tb=
function(b,d){return Qb(d,"cljs.core.async/t_cljs$core$async19305")});return new tm(pn,b,De)};function qn(a){a=rc.a(a,0)?null:a;return gn("number"===typeof a?new Om(Nm(a),a):a)}function rn(a,b){var c=um(a,pn(b));if(x(c)){var d=M.b?M.b(c):M.call(null,c);x(!0)?b.b?b.b(d):b.call(null,d):Xm(function(a){return function(){return b.b?b.b(a):b.call(null,a)}}(d,c))}return null}var sn=pn(function(){return null});function tn(a,b){var c=vm(a,b,sn);return x(c)?M.b?M.b(c):M.call(null,c):!0}
function un(a){var b=Kd(new R(null,1,5,S,[vn],null)),c=qn(null),d=O(b),e=qe(d),f=qn(1),g=X.b?X.b(null):X.call(null,null),h=ef(function(a,b,c,d,e,f){return function(g){return function(a,b,c,d,e,f){return function(a){d[g]=a;return 0===Re.a(f,Rd)?tn(e,d.slice(0)):null}}(a,b,c,d,e,f)}}(b,c,d,e,f,g),new Jg(null,0,d,1,null)),l=qn(1);Xm(function(b,c,d,e,f,g,h,l){return function(){var B=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!V(e,Y)){d=e;break a}}}catch(f){if(f instanceof
Object)c[5]=f,Im(c),d=Y;else throw f;}if(!V(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(b,c,d,e,f,g,h,l){return function(b){var f=b[1];if(7===f)return b[2]=null,b[1]=8,Y;if(1===f)return b[2]=null,b[1]=2,Y;if(4===f){var m=b[7],
f=m<e;b[1]=x(f)?6:7;return Y}return 15===f?(f=b[2],b[2]=f,b[1]=3,Y):13===f?(f=wm(d),b[2]=f,b[1]=15,Y):6===f?(b[2]=null,b[1]=11,Y):3===f?(f=b[2],Gm(b,f)):12===f?(f=b[8],f=b[2],m=Ge(Oa,f),b[8]=f,b[1]=x(m)?13:14,Y):2===f?(f=Qe.a?Qe.a(h,e):Qe.call(null,h,e),b[9]=f,b[7]=0,b[2]=null,b[1]=4,Y):11===f?(m=b[7],b[4]=new Hm(10,Object,null,9,b[4],null,null,null),f=c.b?c.b(m):c.call(null,m),m=l.b?l.b(m):l.call(null,m),f=rn(f,m),b[2]=f,Im(b),Y):9===f?(m=b[7],b[10]=b[2],b[7]=m+1,b[2]=null,b[1]=4,Y):5===f?(b[11]=
b[2],Em(b,12,g)):14===f?(f=b[8],f=C.a(a,f),Fm(b,16,d,f)):16===f?(b[12]=b[2],b[2]=null,b[1]=2,Y):10===f?(m=b[2],f=Re.a(h,Rd),b[13]=m,b[2]=f,Im(b),Y):8===f?(f=b[2],b[2]=f,b[1]=5,Y):null}}(b,c,d,e,f,g,h,l),b,c,d,e,f,g,h,l)}(),F=function(){var a=B.l?B.l():B.call(null);a[6]=b;return a}();return Dm(F)}}(l,b,c,d,e,f,g,h));return c};var wn=VDOM.diff,xn=VDOM.patch,yn=VDOM.create;function zn(a){return bf(Oa,bf(Dd,cf(a)))}function An(a,b,c){return new VDOM.VHtml(Yd(a),dh(b),dh(c))}function Bn(a,b,c){return new VDOM.VSvg(Yd(a),dh(b),dh(c))}Cn;
var Dn=function Dn(b){if(null==b)return new VDOM.VText("");if(Dd(b))return An(Yi,De,T.a(Dn,zn(b)));if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(rc.a(Bj,J(b)))return Cn.b?Cn.b(b):Cn.call(null,b);var c=Q(b,0),d=Q(b,1);b=Xd(b,2);return An(c,d,T.a(Dn,zn(b)))},Cn=function Cn(b){if(null==b)return new VDOM.VText("");if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(rc.a(wk,J(b))){var c=Q(b,0),d=Q(b,1);b=Xd(b,2);return Bn(c,d,T.a(Dn,zn(b)))}c=Q(b,0);d=Q(b,
1);b=Xd(b,2);return Bn(c,d,T.a(Cn,zn(b)))};
function En(){var a=document.body,b=function(){var a=new VDOM.VText("");return X.b?X.b(a):X.call(null,a)}(),c=function(){var a;a=M.b?M.b(b):M.call(null,b);a=yn.b?yn.b(a):yn.call(null,a);return X.b?X.b(a):X.call(null,a)}(),d=null==window.requestAnimationFrame?function(){return function(a){return a.l?a.l():a.call(null)}}(b,c):function(){return function(a){return window.requestAnimationFrame(a)}}(b,c);a.appendChild(M.b?M.b(c):M.call(null,c));return function(a,b,c){return function(d){var l=Dn(d);d=function(){var b=
M.b?M.b(a):M.call(null,a);return wn.a?wn.a(b,l):wn.call(null,b,l)}();Qe.a?Qe.a(a,l):Qe.call(null,a,l);d=function(a,b,c,d){return function(){return Re.c(d,xn,b)}}(l,d,a,b,c);return c.b?c.b(d):c.call(null,d)}}(b,c,d)};var Fn=Error();var Gn=X.b?X.b(De):X.call(null,De);function Hn(a){return Re.m(Gn,nd,Zg("animation"),a)}
function In(){var a=1E3/30,b=qn(1);Xm(function(a,b){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!V(e,Y)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Im(c),d=Y;else throw f;}if(!V(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(a,b){return function(a){var c=a[1];if(7===c)return c=a,c[2]=a[2],c[1]=4,Y;if(20===c){var c=a[7],d=a[8],e=J(d),d=Q(e,0),e=Q(e,1),c=e.b?e.b(c):e.call(null,c);a[9]=d;a[1]=x(c)?22:23;return Y}if(1===c)return c=on(0),Em(a,2,c);if(24===c){var d=a[8],e=a[2],c=K(d),f;a[10]=null;a[11]=0;a[12]=c;a[13]=0;a[14]=e;a[2]=null;a[1]=8;return Y}if(4===c)return c=a[2],Gm(a,c);if(15===c){d=a[10];f=a[11];var c=
a[12],e=a[13],g=a[2];a[10]=d;a[11]=f;a[15]=g;a[12]=c;a[13]=e+1;a[2]=null;a[1]=8;return Y}return 21===c?(c=a[2],a[2]=c,a[1]=18,Y):13===c?(a[2]=null,a[1]=15,Y):22===c?(a[2]=null,a[1]=24,Y):6===c?(a[2]=null,a[1]=7,Y):25===c?(c=a[7],c+=b,a[16]=a[2],a[7]=c,a[2]=null,a[1]=3,Y):17===c?(a[2]=null,a[1]=18,Y):3===c?(c=M.b?M.b(Gn):M.call(null,Gn),c=I(c),a[1]=c?5:6,Y):12===c?(c=a[2],a[2]=c,a[1]=9,Y):2===c?(c=a[2],a[17]=c,a[7]=0,a[2]=null,a[1]=3,Y):23===c?(d=a[9],c=Re.c(Gn,pd,d),a[2]=c,a[1]=24,Y):19===c?(d=a[8],
c=ac(d),d=bc(d),e=O(c),a[10]=c,a[11]=e,a[12]=d,a[13]=0,a[2]=null,a[1]=8,Y):11===c?(c=a[12],c=I(c),a[8]=c,a[1]=c?16:17,Y):9===c?(c=a[2],d=on(b),a[18]=c,Em(a,25,d)):5===c?(c=M.b?M.b(Gn):M.call(null,Gn),c=I(c),a[10]=null,a[11]=0,a[12]=c,a[13]=0,a[2]=null,a[1]=8,Y):14===c?(d=a[19],c=Re.c(Gn,pd,d),a[2]=c,a[1]=15,Y):16===c?(d=a[8],c=zd(d),a[1]=c?19:20,Y):10===c?(d=a[10],c=a[7],e=a[13],e=D.a(d,e),d=Q(e,0),e=Q(e,1),c=e.b?e.b(c):e.call(null,c),a[19]=d,a[1]=x(c)?13:14,Y):18===c?(c=a[2],a[2]=c,a[1]=12,Y):8===
c?(f=a[11],e=a[13],c=e<f,a[1]=x(c)?10:11,Y):null}}(a,b),a,b)}(),f=function(){var b=e.l?e.l():e.call(null);b[6]=a;return b}();return Dm(f)}}(b,a));return b}function Jn(a){return a*a}function Kn(a,b,c){var d=null!=c&&(c.g&64||c.F)?C.a(Oc,c):c,e=G.c(d,lk,0),f=G.a(d,Di),g=G.c(d,Ai,Ld);return function(c,d,e,f,g){return function(c){if(c<=e)return!0;if(c<e+f)return c=(c-e)/f,c=g.b?g.b(c):g.call(null,c),b.a?b.a(a,c):b.call(null,a,c),!0;b.a?b.a(a,1):b.call(null,a,1);return!1}}(c,d,e,f,g)}
function Ln(a,b){return function(c){return Hn(Kn(c,a,b))}}function Mn(a,b,c){return function(d){var e=function(c){return function(e,h){var l,m=a.getPointAtLength(h*c);l=Jk.b?Jk.b(m):Jk.call(null,m);m=Q(l,0);l=Q(l,1);m=new R(null,2,5,S,[m,l],null);return b.a?b.a(d,m):b.call(null,d,m)}}(a.getTotalLength());return Hn(Kn(d,e,c))}};function Nn(){var a=On,b=De,c=Pn,d=qn(null);tn(d,b);var e=qn(1);Xm(function(d,e){return function(){var h=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!V(e,Y)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Im(c),d=Y;else throw f;}if(!V(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,
a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(d,e){return function(d){var f=d[1];if(1===f)return Em(d,2,c);if(2===f){var f=b,g=d[2];d[7]=f;d[8]=g;d[2]=null;d[1]=3;return Y}return 3===f?(f=d[9],f=d[7],g=d[8],f=a.a?a.a(f,g):a.call(null,f,g),g=tn(e,f),d[10]=g,d[9]=f,Em(d,5,c)):4===f?(f=d[2],Gm(d,f)):5===f?(f=d[9],g=d[2],d[7]=f,d[8]=g,d[2]=null,d[1]=3,Y):null}}(d,e),d,e)}(),l=function(){var a=h.l?h.l():h.call(null);a[6]=d;return a}();return Dm(l)}}(e,d));return d}
function Qn(){var a=Rn,b=En(),c=qn(1);Xm(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!V(e,Y)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Im(c),d=Y;else throw f;}if(!V(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.l=c;d.b=b;return d}()}(function(){return function(c){var d=c[1];return 1===d?(c[2]=null,c[1]=2,Y):2===d?Em(c,4,a):3===d?(d=c[2],Gm(c,d)):4===d?(d=c[7],d=c[2],c[7]=d,c[1]=x(d)?5:6,Y):5===d?(d=c[7],d=b.b?b.b(d):b.call(null,d),c[8]=d,c[2]=null,c[1]=2,Y):6===d?(c[2]=null,c[1]=7,Y):7===d?(d=c[2],c[2]=d,c[1]=3,Y):null}}(c),c)}(),f=function(){var a=e.l?e.l():e.call(null);a[6]=c;return a}();return Dm(f)}}(c));return c};function Sn(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;return Tn(0<b.length?new Cc(b.slice(0),0):null)}function Tn(a){return zg.h(H([new u(null,2,[li,0,Bi,Sh],null),C.a(Oc,a)],0))}function Un(a){return zg.h(H([od([Ah,Wh,Bi,rj,Sj,fk,ok,pk,qk],[999999,null,Sh,Zg("station"),jd,0,Te(4,Ve(xi)),jd,new u(null,1,[Bi,Ji],null)]),C.a(Oc,a)],0))}
function Vn(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;return Wn(0<b.length?new Cc(b.slice(0),0):null)}function Wn(a){return zg.h(H([new u(null,2,[Th,jd,Vh,jd],null),C.a(Oc,a)],0))}var Xn=new R(null,5,5,S,[Tn(H([Bi,si],0)),Sn(),Sn(),Sn(),Sn()],null);function Yn(a){return zg.h(H([new u(null,3,[kk,0,mf,Xn,ji,jd],null),C.a(Oc,a)],0))}
var Zn=Wn(H([ii,Nj,Vh,new R(null,6,5,S,[Un(H([Bi,si,Lh,0],0)),Un(H([Bh,0,Lh,1,Wj,!0],0)),Un(H([Bh,1,Lh,2],0)),Un(H([Bh,2,Lh,3],0)),Un(H([Bh,3,Lh,4,Hj,0],0)),Un(H([Bi,Ij,Bh,4],0))],null)],0)),$n=Wn(H([ii,Zh,Vh,new R(null,6,5,S,[Un(H([Bi,si,Lh,0,qk,new u(null,1,[Bi,Vi],null)],0)),Un(H([Bh,0,Lh,1,qk,new u(null,1,[Bi,Vi],null),Wj,!0],0)),Un(H([Bh,1,Lh,2,qk,new u(null,1,[Bi,Vi],null)],0)),Un(H([Bh,2,Lh,3],0)),Un(H([Bh,3,Lh,4,qk,new u(null,1,[Bi,Vi],null),Hj,0],0)),Un(H([Bi,Ij,Bh,4],0))],null)],0)),ao=
Wn(H([ii,Fi,Vh,new R(null,6,5,S,[Un(H([Bi,si,Lh,0,qk,new u(null,3,[Bi,Fi,Dh,3,fi,Wh],null)],0)),Un(H([Bh,0,Lh,1,qk,new u(null,1,[Bi,Vi],null),Wj,!0],0)),Un(H([Bh,1,Lh,2,qk,new u(null,1,[Bi,Vi],null)],0)),Un(H([Bh,2,Lh,3],0)),Un(H([Bh,3,Lh,4,qk,new u(null,1,[Bi,Vi],null),Hj,0],0)),Un(H([Bi,Ij,Bh,4],0))],null)],0)),bo=Wn(H([ii,ak,Vh,new R(null,6,5,S,[Un(H([Bi,si,Lh,0,qk,new u(null,3,[Bi,Fi,Dh,3,fi,Hi],null)],0)),Un(H([Bh,0,Lh,1,qk,new u(null,1,[Bi,Vi],null),Wj,!0],0)),Un(H([Bh,1,Lh,2,qk,new u(null,
1,[Bi,Vi],null)],0)),Un(H([Bh,2,Lh,3,ok,Te(6,Ve(xi))],0)),Un(H([Bh,3,Lh,4,qk,new u(null,1,[Bi,Vi],null),Hj,0],0)),Un(H([Bi,Ij,Bh,4],0))],null)],0)),co=new u(null,7,[Nj,Yn(H([ji,new R(null,3,5,S,[Zn,Vn(),Vn()],null)],0)),Zh,Yn(H([ji,new R(null,3,5,S,[Vn(),$n,Vn()],null)],0)),Fi,Yn(H([ji,new R(null,3,5,S,[Vn(),Vn(),ao],null)],0)),di,Yn(H([ji,new R(null,3,5,S,[Zn,$n,Vn()],null)],0)),dj,Yn(H([ji,new R(null,3,5,S,[Zn,$n,ao],null)],0)),Fh,Yn(H([ji,new R(null,3,5,S,[Zn,$n,bo],null)],0)),kj,Yn(H([ji,new R(null,
4,5,S,[Zn,$n,ao,bo],null)],0))],null);function eo(a){return sm(qm(pm(nm(dm(am(jf(a,kk,Rc),We(function(){return 6*Math.random()+1|0})))))))}function fo(a,b){for(var c=0,d=Xl(b);;)if(c<a)c+=1,d=eo(d);else return d}function go(a){a:for(var b=De,c=I(new R(null,4,5,S,[Ki,zi,Jh,aj],null));;)if(c)var d=J(c),e=G.c(a,d,vk),b=rc.a(e,vk)?b:nd.c(b,d,e),c=K(c);else{a=Qc(b,rd(a));break a}return a}function ho(a){return df.a(De,bf(Je.a(Oa,J),T.a(Ng(ii,Je.a(function(a){return T.a(go,a)},Th)),ji.b(a))))}
function io(a,b){var c;a:{var d=Uf(b),e=T.a(a,Vf(b));c=Tb(De);d=I(d);for(e=I(e);;)if(d&&e)c=we(c,J(d),J(e)),d=K(d),e=K(e);else{c=Vb(c);break a}}return c}var jo=function jo(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return jo.h(arguments[0],1<c.length?new Cc(c.slice(1),0):null)};jo.h=function(a,b){return io(function(b){return C.a(a,b)},io(function(a){return T.a($d,a)},fh(Zd,C.a(te,b))))};jo.w=1;jo.B=function(a){var b=J(a);a=K(a);return jo.h(b,a)};
function ko(a){return io(function(a){return C.c(T,Ef,a)},io(function(a){return T.a($d,a)},fh(Zd,C.a(te,a))))}
function lo(a){var b=function(){var b=ho(a);return X.b?X.b(b):X.call(null,b)}(),c=X.b?X.b(1):X.call(null,1),d=function(a,b){return function(a,c){return((M.b?M.b(b):M.call(null,b))*a+c)/((M.b?M.b(b):M.call(null,b))+1)}}(b,c);return function(a,b,c,d){return function(l){l=io(function(a,b,c,d,e){return function(a){return T.a(e,a)}}(a,a,b,c,d),ko(H([M.b?M.b(a):M.call(null,a),ho(l)],0)));Qe.a?Qe.a(a,l):Qe.call(null,a,l);Re.a(b,Rc);return M.b?M.b(a):M.call(null,a)}}(b,c,d,function(a,b,c){return function(a){return C.c(jo,
c,a)}}(b,c,d))};var mo,no=new u(null,3,[kk,250,hj,500,pi,500],null);mo=X.b?X.b(no):X.call(null,no);function oo(a){return document.querySelector([A("#"),A(a),A(" .penny-path")].join(""))}function po(a){return document.querySelector([A("#"),A(a),A(" .ramp")].join(""))};function qo(a){this.Fa=a}qo.prototype.hd=function(a){return this.Fa.b?this.Fa.b(a):this.Fa.call(null,a)};ba("Hook",qo);ba("Hook.prototype.hook",qo.prototype.hd);var ro=new u(null,4,[Nj,tj,Zh,mi,Fi,uj,ak,Zj],null);function so(a){var b=Q(a,0);a=Q(a,1);return[A(b),A(","),A(a)].join("")}function to(a,b,c){var d=Q(a,0);Q(a,1);a=Q(b,0);var e=Q(b,1);b=Q(c,0);c=Q(c,1);var d=d-a,f=(e-c)/2*(d/Math.abs(d)),g=f/2,d=new R(null,2,5,S,[a+f,e],null);a=new R(null,2,5,S,[a-g,e],null);e=new R(null,2,5,S,[b-g,c],null);b=new R(null,2,5,S,[b+f,c],null);return[A("L"),A(so(d)),A("C"),A(so(a)),A(","),A(so(e)),A(","),A(so(b))].join("")}
function uo(a){return I(a)?C.c(A,"M",Ze(T.a(so,a))):null}function vo(a,b){return[A("translate("),A(a),A(","),A(b),A(")")].join("")}
function wo(a){var b=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a,c=G.a(b,ri),d=G.a(b,sk),e=G.a(b,Tj),f=G.a(b,xh),g=G.a(b,li),h=c/2;return new R(null,4,5,S,[bj,new u(null,1,[Kh,vo(h,h)],null),new R(null,2,5,S,[jk,new u(null,5,[sj,"die",Tj,-h,xh,-h,ri,c,sk,c],null)],null),function(){return function(a,b,c,d,e,f,g,h,z){return function F(L){return new je(null,function(a,b,c,d,e){return function(){for(;;){var b=I(L);if(b){if(zd(b)){var c=ac(b),d=O(c),f=ne(d);a:for(var g=0;;)if(g<d){var h=D.a(c,g),l=Q(h,0),h=Q(h,
1),l=new R(null,2,5,S,[oi,new u(null,3,[qj,a.b?a.b(l):a.call(null,l),vj,a.b?a.b(h):a.call(null,h),Gh,e/10],null)],null);f.add(l);g+=1}else{c=!0;break a}return c?oe(f.W(),F(bc(b))):oe(f.W(),null)}c=J(b);f=Q(c,0);c=Q(c,1);return N(new R(null,2,5,S,[oi,new u(null,3,[qj,a.b?a.b(f):a.call(null,f),vj,a.b?a.b(c):a.call(null,c),Gh,e/10],null)],null),F(Dc(b)))}return null}}}(a,b,c,d,e,f,g,h,z),null,null)}}(Ke(Pd,c/4),h,a,b,c,d,e,f,g)(Ik(g))}()],null)}
function xo(a,b){for(var c=a-10,d=jd,e=!0,f=b-10;;)if(0<f)d=te.a(d,e?new R(null,2,5,S,[new R(null,2,5,S,[c,f],null),new R(null,2,5,S,[10,f],null)],null):new R(null,2,5,S,[new R(null,2,5,S,[10,f],null),new R(null,2,5,S,[c,f],null)],null)),e=!e,f-=20;else{c=S;a:for(e=Q(d,0),f=Xd(d,1),d=[A("M"),A(so(e))].join(""),Q(f,0),Q(f,1),Xd(f,2);;){var g=f,h=Q(g,0),f=Q(g,1),g=Xd(g,2),l;l=h;x(l)&&(l=f,l=x(l)?I(g):l);if(x(l))d=[A(d),A(to(e,h,f))].join(""),e=f,f=g;else{d=x(h)?[A(d),A("L"),A(so(h))].join(""):d;break a}}return new R(null,
2,5,c,[zh,new u(null,2,[sj,"penny-path",Pj,d],null)],null)}}function yo(a,b,c){a=a.getPointAtLength(c*b+20);return Jk.b?Jk.b(a):Jk.call(null,a)}function zo(a,b,c){var d=Q(a,0);a=Q(a,1);return new R(null,4,5,S,[bj,new u(null,2,[Kh,vo(d,a),Gj,x(c)?new qo(c):null],null),new R(null,2,5,S,[oi,new u(null,2,[sj,"penny fill",Gh,8],null)],null),rc.a(b,qi)?new R(null,2,5,S,[oi,new u(null,2,[sj,"tracer",Gh,4],null)],null):null],null)}
function Ao(a,b,c){var d=null!=c&&(c.g&64||c.F)?C.a(Oc,c):c,e=G.a(d,ok),f=G.a(d,tk),g=G.a(d,Qh),h=G.a(d,Uh);return fb(fb(Ec,function(){var a=d.b?d.b(zh):d.call(null,zh);return x(a)?fb(fb(Ec,fe(Me(function(a,b,c,d,e,f,g,h,l){return function(F,L){var P=function(a,b,c,d,e,f,g){return function(b){return yo(a,b,g)}}(a,b,c,d,e,f,g,h,l);return zo(P(F),L,0<h?Ln(function(a,b,c,d,e,f,g,h,l){return function(b,c){var d;d=F-c*l;d=-1>d?-1:d;var e=a(d),f=Q(e,0),e=Q(e,1);b.setAttribute("transform",vo(f,e));return rc.a(-1,
d)?b.setAttribute("transform","scale(0)"):null}}(P,a,b,c,d,e,f,g,h,l),new u(null,1,[Di,(M.b?M.b(mo):M.call(null,mo)).call(null,hj)],null)):null)}}(a,a,c,d,d,e,f,g,h),e))),fe(Me(function(){return function(a,b,c,d,e,f,g,h,l,F){return function(L,P){var Aa=yo(b,a+L,h),E=Q(Aa,0),na=Q(Aa,1);return zo(new R(null,2,5,S,[E,F],null),P,Ln(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){return function(a,c){return a.setAttribute("transform",vo(b,r+c*d))}}(Aa,E,na,na-F,a,b,c,d,e,f,g,h,l,F),new u(null,3,[Di,(M.b?M.b(mo):
M.call(null,mo)).call(null,pi),lk,50*L,Ai,Jn],null)))}}(O(e),a,a,c,d,d,e,f,g,h)}(),d.b?d.b(Ui):d.call(null,Ui)))):null}()),xo(a,b))}
function Bo(a,b,c,d){var e=b-20,f=S;a=new u(null,2,[sj,"spout",Kh,vo(0,a)],null);var g=S,e=[A(uo(new R(null,6,5,S,[new R(null,2,5,S,[b,-20],null),new R(null,2,5,S,[b,23],null),new R(null,2,5,S,[0,23],null),new R(null,2,5,S,[0,3],null),new R(null,2,5,S,[e,3],null),new R(null,2,5,S,[e,-20],null)],null))),A("Z")].join("");return new R(null,4,5,f,[bj,a,new R(null,2,5,g,[zh,new u(null,1,[Pj,e],null)],null),x(d)?new R(null,3,5,S,[xk,new u(null,2,[Kh,vo(b/2,23),wi,-5],null),c],null):null],null)}
if("undefined"===typeof Co){var Co,Do=X.b?X.b(De):X.call(null,De),Eo=X.b?X.b(De):X.call(null,De),Fo=X.b?X.b(De):X.call(null,De),Go=X.b?X.b(De):X.call(null,De),Ho=G.c(De,ek,hh());Co=new uh(Ac.a("pennygame.ui","station"),Bi,gi,Ho,Do,Eo,Fo,Go)}wh(Co,si,function(a,b){var c=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a,d=G.a(c,ri);G.a(c,Dj);var e=G.a(c,Uh),c=G.c(c,mk,De);return Bo(e,d,[A("Total Input: "),A(c.a?c.a(xj,0):c.call(null,xj,0))].join(""),b)});
wh(Co,Sh,function(a,b){var c=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a,d=G.a(c,ri),e=G.a(c,Dj),c=fb(fb(fb(Ec,Bo(c.b?c.b(Uh):c.call(null,Uh),d,[A("Under-utilized: "),A(c.b?c.b(fk):c.call(null,fk))].join(""),b)),Ao(d,e,new u(null,6,[ok,c.b?c.b(ok):c.call(null,ok),tk,c.b?c.b(Ah):c.call(null,Ah),Qh,x(c.b?c.b(Gi):c.call(null,Gi))?c.b?c.b(Wh):c.call(null,Wh):0,Ui,x(c.b?c.b(Rj):c.call(null,Rj))?c.b?c.b(pk):c.call(null,pk):null,zh,oo(c.b?c.b(rj):c.call(null,rj)),Uh,c.b?c.b(ui):c.call(null,ui)],null))),new R(null,
2,5,S,[jk,new u(null,3,[sj,"bin",ri,d,sk,e],null)],null));a:for(var f=jd,g=!0,e=e-20;;)if(0<e)f=id.a(f,new R(null,2,5,S,[jj,new u(null,4,[sj,"shelf",Kh,vo(0,e),Vj,g?20:0,nk,g?d:d-20],null)],null)),g=!g,e-=20;else{d=new R(null,3,5,S,[bj,De,C.a(pc,f)],null);break a}return fb(c,d)});
wh(Co,Ij,function(a,b){var c=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a,d=G.a(c,ri),e=G.a(c,rj),f=G.a(c,Dj),g=G.a(c,ui),h=G.c(c,mk,De),l=G.a(c,pk),m=G.a(c,Rj);return fb(fb(fb(fb(Ec,x(b)?new R(null,3,5,S,[xk,new u(null,3,[Nh,d/2,wi,-4,yh,"middle"],null),[A("Total Output: "),A(h.a?h.a(zi,0):h.call(null,zi,0))].join("")],null):null),new R(null,2,5,S,[Oj,new u(null,3,[zj,truckSrc,ri,d,sk,f],null)],null)),new R(null,2,5,S,[zh,new u(null,2,[sj,"ramp",Pj,[A("M"),A(so(new R(null,2,5,S,[10,g],null))),A("C"),A(so(new R(null,
2,5,S,[10,f/2],null))),A(","),A(so(new R(null,2,5,S,[10,f/2],null))),A(","),A(so(new R(null,2,5,S,[d/2,f/2],null)))].join("")],null)],null)),function(){var b=po(e);return x(x(b)?m:b)?Me(function(a,b,c,d,e,f,g,h,l,m){return function(n,E){return zo(new R(null,2,5,S,[10,g],null),E,Mn(a,function(){return function(a,b){var c=Q(b,0),d=Q(b,1);return a.setAttribute("transform",vo(c,d))}}(a,b,c,d,e,f,g,h,l,m),new u(null,3,[Di,(M.b?M.b(mo):M.call(null,mo)).call(null,pi),lk,50*n,Ai,Jn],null)))}}(b,a,c,d,e,f,
g,h,l,m),l):null}())});
function Io(a,b){var c=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a,d=G.a(c,ii),e=G.a(c,Tj),f=G.a(c,Vh),g=G.a(c,Th);return x(x(e)?d:e)?new R(null,3,5,S,[bj,new u(null,2,[sj,[A("scenario "),A(Yd(ro.b?ro.b(d):ro.call(null,d)))].join(""),Kh,vo(e,0)],null),function(){return function(a,c,d,e,f,g){return function v(w){return new je(null,function(a,c,d,e,f,g){return function(){for(;;){var a=I(w);if(a){if(zd(a)){var c=ac(a),d=O(c),e=ne(d);return function(){for(var a=0;;)if(a<d){var f=D.a(c,a),h=null!=f&&(f.g&64||f.F)?
C.a(Oc,f):f,f=h,l=G.a(h,qk),l=null!=l&&(l.g&64||l.F)?C.a(Oc,l):l,m=G.a(l,Bi),n=G.a(h,rj),p=G.a(h,xh),h=e,l=S,m=new u(null,3,[rj,n,sj,[A(Yd(m)),A(" productivity-"),A(Yd(m))].join(""),Kh,vo(0,p)],null);I(g)&&(f=nd.c(f,mk,null==g?null:xb(g)));f=Co.a?Co.a(f,b):Co.call(null,f,b);h.add(new R(null,3,5,l,[bj,m,f],null));a+=1}else return!0}()?oe(e.W(),v(bc(a))):oe(e.W(),null)}var f=J(a),h=f=null!=f&&(f.g&64||f.F)?C.a(Oc,f):f,l=G.a(f,qk),l=null!=l&&(l.g&64||l.F)?C.a(Oc,l):l,l=G.a(l,Bi),m=G.a(f,rj),f=G.a(f,
xh);return N(new R(null,3,5,S,[bj,new u(null,3,[rj,m,sj,[A(Yd(l)),A(" productivity-"),A(Yd(l))].join(""),Kh,vo(0,f)],null),I(g)?function(){var a=nd.c(h,mk,null==g?null:xb(g));return Co.a?Co.a(a,b):Co.call(null,a,b)}():Co.a?Co.a(h,b):Co.call(null,h,b)],null),v(Dc(a)))}return null}}}(a,c,d,e,f,g),null,null)}}(a,c,d,e,f,g)(fe(f))}()],null):null}
function Jo(a,b,c){if(I(a)){var d=Ok(T.a(function(a){a=hd(yk.b(a));a=b.b?b.b(a):b.call(null,a);return gd(a)},a));return function(a){return function g(d){return new je(null,function(){return function(){for(var a=d;;)if(a=I(a)){if(zd(a)){var e=ac(a),n=O(e),p=ne(n);return function(){for(var a=0;;)if(a<n){var d=D.a(e,a),g=Q(d,0),g=null!=g&&(g.g&64||g.F)?C.a(Oc,g):g,h=G.a(g,yk),d=Q(d,1),g=function(){var a=hd(h);return b.b?b.b(a):b.call(null,a)}(),g=Q(g,0);x(g)&&pe(p,new R(null,3,5,S,[xk,new u(null,3,[sj,
[A("label "),A("history")].join(""),Kh,vo(g,d),wi,7],null),function(){var a=gd(hd(h));return c.b?c.b(a):c.call(null,a)}()],null));a+=1}else return!0}()?oe(p.W(),g(bc(a))):oe(p.W(),null)}var q=J(a),r=Q(q,0),r=null!=r&&(r.g&64||r.F)?C.a(Oc,r):r,v=G.a(r,yk),q=Q(q,1),r=function(){var a=hd(v);return b.b?b.b(a):b.call(null,a)}(),r=Q(r,0);if(x(r))return N(new R(null,3,5,S,[xk,new u(null,3,[sj,[A("label "),A("history")].join(""),Kh,vo(r,q),wi,7],null),function(){var a=gd(hd(v));return c.b?c.b(a):c.call(null,
a)}()],null),g(Dc(a)));a=Dc(a)}else return null}}(a),null,null)}}(d)(T.c(Ef,a,d))}return null}
function Ko(a,b,c){var d=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a,e=G.a(d,ri),f=G.a(d,sk),g=G.a(d,Tj),h=G.a(d,xh),l=null!=c&&(c.g&64||c.F)?C.a(Oc,c):c,m=G.a(l,Oi),n=G.a(l,rk),p=G.a(l,Pi),q=G.c(l,ki,Ld),r=f-60,v=function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w){return function Pa(v){return new je(null,function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w){return function(){for(;;){var z=I(v);if(z){var B=z;if(zd(B)){var E=ac(B),F=O(E),L=ne(F);return function(){for(var v=0;;)if(v<F){var P=D.a(E,v),U=Q(P,0),W=Q(P,
1);pe(L,new u(null,2,[Oh,ro.b?ro.b(U):ro.call(null,U),yk,Me(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,B,E,F,L){return function(a,b){return new R(null,2,5,S,[a,L.b?L.b(b):L.call(null,b)],null)}}(v,P,U,W,E,F,L,B,z,a,b,c,d,e,f,g,h,l,m,n,p,q,r,w),W)],null));v+=1}else return!0}()?oe(L.W(),Pa(bc(B))):oe(L.W(),null)}var P=J(B),U=Q(P,0),W=Q(P,1);return N(new u(null,2,[Oh,ro.b?ro.b(U):ro.call(null,U),yk,Me(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z){return function(a,b){return new R(null,2,5,S,[a,z.b?z.b(b):
z.call(null,b)],null)}}(P,U,W,B,z,a,b,c,d,e,f,g,h,l,m,n,p,q,r,w),W)],null),Pa(Dc(B)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w),null,null)}}(30,50,r,a,d,e,f,g,h,c,l,m,n,p,q)(b)}(),w=Qk(T.a(yk,v),new u(null,2,[ri,e-100,sk,r],null),new u(null,2,[Xj,jd,rk,n],null)),z=Q(w,0),B=Q(w,1),F=function(a,b,c,d,e,f,g){return function(a){return new R(null,2,5,S,[function(){var b=J(a);return f.b?f.b(b):f.call(null,b)}(),function(){var b=gd(a);return g.b?g.b(b):g.call(null,b)}()],null)}}(30,50,r,v,w,z,B,a,d,
e,f,g,h,c,l,m,n,p,q);return new R(null,5,5,S,[bj,new u(null,2,[sj,"graph",Kh,vo(g,h)],null),new R(null,2,5,S,[jk,new u(null,2,[ri,e,sk,f],null)],null),new R(null,3,5,S,[xk,new u(null,4,[sj,"title",Tj,e/2,xh,f/2,wi,10],null),p],null),new R(null,7,5,S,[bj,new u(null,1,[Kh,vo(50,30)],null),function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,B,F,Ja){return function Ta(jb){return new je(null,function(a,b,c,d,e,f,g,h){return function(){for(;;){var a=I(jb);if(a){if(zd(a)){var b=ac(a),c=O(b),d=ne(c);
a:for(var e=0;;)if(e<c){var f=D.a(b,e),f=null!=f&&(f.g&64||f.F)?C.a(Oc,f):f;G.a(f,Oh);f=G.a(f,yk);f=new R(null,2,5,S,[zh,new u(null,2,[sj,"stroke outline",Pj,uo(T.a(h,f))],null)],null);d.add(f);e+=1}else{b=!0;break a}return b?oe(d.W(),Ta(bc(a))):oe(d.W(),null)}d=J(a);d=null!=d&&(d.g&64||d.F)?C.a(Oc,d):d;G.a(d,Oh);d=G.a(d,yk);return N(new R(null,2,5,S,[zh,new u(null,2,[sj,"stroke outline",Pj,uo(T.a(h,d))],null)],null),Ta(Dc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,B,F,Ja),null,null)}}(30,
50,r,v,w,z,B,F,a,d,e,f,g,h,c,l,m,n,p,q)(v)}(),function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,B,F,Ja){return function Ta(jb){return new je(null,function(a,b,c,d,e,f,g,h){return function(){for(;;){var a=I(jb);if(a){if(zd(a)){var b=ac(a),c=O(b),d=ne(c);a:for(var e=0;;)if(e<c){var f=D.a(b,e),g=null!=f&&(f.g&64||f.F)?C.a(Oc,f):f,f=G.a(g,Oh),g=G.a(g,yk),f=new R(null,2,5,S,[zh,new u(null,2,[sj,[A("history stroke "),A(Yd(f))].join(""),Pj,uo(T.a(h,g))],null)],null);d.add(f);e+=1}else{b=!0;break a}return b?
oe(d.W(),Ta(bc(a))):oe(d.W(),null)}d=J(a);b=null!=d&&(d.g&64||d.F)?C.a(Oc,d):d;d=G.a(b,Oh);b=G.a(b,yk);return N(new R(null,2,5,S,[zh,new u(null,2,[sj,[A("history stroke "),A(Yd(d))].join(""),Pj,uo(T.a(h,b))],null)],null),Ta(Dc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,B,F,Ja),null,null)}}(30,50,r,v,w,z,B,F,a,d,e,f,g,h,c,l,m,n,p,q)(v)}(),Jo(v,F,q),new R(null,2,5,S,[jj,new u(null,3,[sj,"axis",Kh,vo(0,r),nk,e-100],null)],null),new R(null,2,5,S,[jj,new u(null,2,[sj,"axis",bk,r],null)],null)],
null)],null)}
function Lo(a,b){var c=Kk(a),d=Q(c,0),e=Q(c,1),f=Q(c,2),g=Q(c,3);return new R(null,6,5,S,[bj,new u(null,1,[rj,"graphs"],null),Ko(d,b,new u(null,4,[Pi,"Work in Progress",Oi,Ki,rk,new R(null,1,5,S,[0],null),ki,function(){return function(a){return Math.round(a)}}(c,d,e,f,g)],null)),Ko(e,b,new u(null,3,[Pi,"Total Output",Oi,zi,ki,function(){return function(a){return Math.round(a)}}(c,d,e,f,g)],null)),Ko(f,b,new u(null,3,[Pi,"Inventory Turns",Oi,Jh,ki,function(){return function(a){return Math.round(a)}}(c,d,
e,f,g)],null)),Ko(g,b,new u(null,4,[Pi,"Utilization",Oi,aj,rk,new R(null,2,5,S,[0,1],null),ki,function(){return function(a){return[A(Math.round(100*a)),A("%")].join("")}}(c,d,e,f,g)],null))],null)}
function Mo(a,b){var c=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a,d=G.a(c,Wi),e=null!=d&&(d.g&64||d.F)?C.a(Oc,d):d,f=G.a(e,kk),g=G.a(e,Li),h=G.a(c,ej),l=G.a(c,$h),m=G.a(c,Rh);return new R(null,4,5,S,[Yi,new u(null,1,[rj,"controls"],null),new R(null,9,5,S,[ni,new u(null,1,[Mi,"slidden"],null),new R(null,3,5,S,[bi,new u(null,1,[vi,function(){return function(){var a=new R(null,3,5,S,[Hh,1,!0],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Roll"],null),new R(null,3,5,S,[bi,new u(null,1,[vi,
function(){return function(){var a=new R(null,3,5,S,[Hh,100,!0],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Run"],null),new R(null,3,5,S,[bi,new u(null,1,[vi,function(){return function(){var a=new R(null,3,5,S,[Hh,100,!1],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Run Fast"],null),new R(null,3,5,S,[bi,new u(null,1,[vi,function(){return function(){var a=new R(null,2,5,S,[Ei,100],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Run Instantly"],
null),new R(null,3,5,S,[bi,new u(null,1,[vi,function(a,c,d,e,f,g,h){return function(){var a=new R(null,2,5,S,[Cj,Sa(h)],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),x(h)?"Hide info":"Show info"],null),new R(null,3,5,S,[bi,new u(null,1,[vi,function(a,c,d,e,f,g,h,l){return function(){var a=new R(null,2,5,S,[Mj,Sa(l)],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),x(l)?"Hide graphs":"Show graphs"],null),x(l)?new R(null,3,5,S,[bi,new u(null,2,[Xh,function(){var a=
0===f;return a?a:m}(),vi,function(a,c,d,e,f,g){return function(){var a=new R(null,2,5,S,[Li,Sa(g)],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),x(g)?"Hide averages":"Average"],null):null],null),new R(null,8,5,S,[ni,new u(null,1,[Mi,"slidden wide"],null),new R(null,3,5,S,[bi,new u(null,1,[vi,function(){return function(){var a=new R(null,2,5,S,[Wi,Nj],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Basic"],null),new R(null,3,5,S,[bi,new u(null,1,[vi,function(){return function(){var a=
new R(null,2,5,S,[Wi,Zh],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Efficient"],null),new R(null,3,5,S,[bi,new u(null,1,[vi,function(){return function(){var a=new R(null,2,5,S,[Wi,di],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Basic \x26 Efficient"],null),new R(null,3,5,S,[bi,new u(null,1,[vi,function(){return function(){var a=new R(null,2,5,S,[Wi,Fi],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Constrained"],null),new R(null,
3,5,S,[bi,new u(null,1,[vi,function(){return function(){var a=new R(null,2,5,S,[Wi,dj],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Basic, Efficient, \x26 Constrained"],null),new R(null,3,5,S,[bi,new u(null,1,[vi,function(){return function(){var a=new R(null,2,5,S,[Wi,kj],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Basic, Efficient, Constrained, \x26 Fixed"],null)],null)],null)}
function No(a){var b=Oo,c=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a,d=G.a(c,Wi),e=null!=d&&(d.g&64||d.F)?C.a(Oc,d):d,f=G.a(e,ri),g=G.a(e,sk),h=G.a(e,kk),l=G.a(e,mf),m=G.a(e,ji),n=G.a(e,Li),p=G.a(c,ej),q=G.a(c,$h);return new R(null,5,5,S,[dk,De,new R(null,3,5,S,[Yi,new u(null,1,[Xi,new u(null,3,[Lj,ak,uk,"5px",ci,"5px"],null)],null),new R(null,4,5,S,[Yi,De,h," steps"],null)],null),Mo(c,b),new R(null,5,5,S,[Bj,new u(null,3,[rj,"space",ri,"100%",sk,"99%"],null),function(){return function(a,b,c,d,e,f,g,h,l,
m,n,p,q,W){return function fa(ha){return new je(null,function(){return function(){for(;;){var a=I(ha);if(a){if(zd(a)){var b=ac(a),c=O(b),d=ne(c);a:for(var e=0;;)if(e<c){var f=D.a(b,e),g=null!=f&&(f.g&64||f.F)?C.a(Oc,f):f,f=g,h=G.a(g,Tj),g=G.a(g,xh),f=x(h)?new R(null,3,5,S,[bj,new u(null,1,[Kh,vo(h,g)],null),wo(f)],null):null;d.add(f);e+=1}else{b=!0;break a}return b?oe(d.W(),fa(bc(a))):oe(d.W(),null)}d=J(a);d=c=null!=d&&(d.g&64||d.F)?C.a(Oc,d):d;b=G.a(c,Tj);c=G.a(c,xh);return N(x(b)?new R(null,3,5,
S,[bj,new u(null,1,[Kh,vo(b,c)],null),wo(d)],null):null,fa(Dc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,W),null,null)}}(a,c,c,d,e,e,f,g,h,l,m,n,p,q)(l)}(),T.a(function(a,b,c,d,e,f,g,h,l,m,n,p,q){return function(a){return Io(a,q)}}(a,c,c,d,e,e,f,g,h,l,m,n,p,q),m),x(x(f)?x(g)?q:g:f)?Lo(new R(null,2,5,S,[f,g],null),x(n)?n:ho(e)):null],null)],null)};za=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new Cc(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,Ma.b?Ma.b(a):Ma.call(null,a))}a.w=0;a.B=function(a){a=I(a);return b(a)};a.h=b;return a}();
Ba=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new Cc(e,0)}return b.call(this,d)}function b(a){return console.error.apply(console,Ma.b?Ma.b(a):Ma.call(null,a))}a.w=0;a.B=function(a){a=I(a);return b(a)};a.h=b;return a}();
function Po(a){var b="undefined"!==typeof document.hidden?"visibilitychange":"undefined"!==typeof document.webkitHidden?"webkitvisibilitychange":"undefined"!==typeof document.mozHidden?"mozvisibilitychange":"undefined"!==typeof document.msHidden?"msvisibilitychange":null;return document.addEventListener(b,function(b){return function e(){a.l?a.l():a.call(null);return document.removeEventListener(b,e)}}(b))}
function Qo(a,b){var c=null!=b&&(b.g&64||b.F)?C.a(Oc,b):b,d=G.a(c,ri),e=G.a(c,Tj),f=Ue(1,Vh.b(J(af(ii,ji.b(a))))),g=T.a(sk,f),h=T.a(xh,f);return lf(a,Ke(T,function(a,b,c,d,e,f,g){return function(a,b,c){return nd.h(a,Tj,g,H([xh,b+c+(0-f/2-20),ri,f,sk,f],0))}}(f,g,h,b,c,d,e)),h,g)}if("undefined"===typeof Pn)var Pn=qn(null);function Oo(a){return tn(Pn,a)}
function Ro(a,b){var c=qn(1);Xm(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!V(e,Y)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Im(c),d=Y;else throw f;}if(!V(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(){return function(c){var d=c[1];if(7===d){var d=c[2],e=In();c[7]=d;return Em(c,8,e)}return 20===d?(c[8]=c[2],c[1]=x(b)?21:22,Y):27===d?(d=c[2],Gm(c,d)):1===d?Fm(c,2,Pn,Kj):24===d?(d=c[2],c[2]=d,c[1]=23,Y):4===d?(d=new R(null,2,5,S,[Qh,!0],null),Fm(c,7,Pn,d)):15===d?(c[9]=c[2],Fm(c,19,Pn,ik)):21===d?(c[2]=null,c[1]=23,Y):13===d?(d=new R(null,2,5,S,[Ui,!0],null),Fm(c,16,Pn,d)):22===d?(d=
M.b?M.b(mo):M.call(null,mo),d=d.b?d.b(kk):d.call(null,kk),d=on(d),Em(c,24,d)):29===d?(d=c[2],c[2]=d,c[1]=27,Y):6===d?(c[10]=c[2],Fm(c,10,Pn,Jj)):28===d?(d=c[2],c[2]=d,c[1]=27,Y):25===d?(d=new R(null,3,5,S,[Uj,c[11],b],null),Fm(c,28,Pn,d)):17===d?(d=new R(null,2,5,S,[Ui,!1],null),c[12]=c[2],Fm(c,18,Pn,d)):3===d?(c[13]=c[2],c[1]=x(b)?4:5,Y):12===d?(c[14]=c[2],c[1]=x(b)?13:14,Y):2===d?(c[15]=c[2],Fm(c,3,Pn,Ch)):23===d?(d=c[2],e=a-1,c[11]=e,c[16]=d,c[1]=x(0<e)?25:26,Y):19===d?(c[17]=c[2],Fm(c,20,Pn,cj)):
11===d?(c[18]=c[2],Fm(c,12,Pn,gj)):9===d?(d=c[2],c[2]=d,c[1]=6,Y):5===d?(c[2]=null,c[1]=6,Y):14===d?(c[2]=null,c[1]=15,Y):26===d?(d=new R(null,2,5,S,[Qi,!1],null),Fm(c,29,Pn,d)):16===d?(d=c[2],e=In(),c[19]=d,Em(c,17,e)):10===d?(c[20]=c[2],Fm(c,11,Pn,fj)):18===d?(d=c[2],c[2]=d,c[1]=15,Y):8===d?(d=new R(null,2,5,S,[Qh,!1],null),c[21]=c[2],Fm(c,9,Pn,d)):null}}(c),c)}(),f=function(){var a=e.l?e.l():e.call(null);a[6]=c;return a}();return Dm(f)}}(c))}
var So=function So(){var b=qn(1);Xm(function(b){return function(){var d=function(){return function(b){return function(){function c(d){for(;;){var e;a:try{for(;;){var g=b(d);if(!V(g,Y)){e=g;break a}}}catch(h){if(h instanceof Object)d[5]=h,Im(d),e=Y;else throw h;}if(!V(e,Y))return e}}function d(){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];b[0]=e;b[1]=1;return b}var e=null,e=function(b){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,
b)}throw Error("Invalid arity: "+arguments.length);};e.l=d;e.b=c;return e}()}(function(b){return function(c){var d=c[1];if(7===d){var e=c[7],e=e.getBoundingClientRect();c[2]=e;c[1]=8;return Y}if(1===d)return e=on(50),Em(c,2,e);if(4===d)return e=document.getElementById("space"),c[2]=e,c[1]=5,Y;if(15===d){var e=c[2],m=tn(Pn,ck),n=on(100);c[8]=m;c[9]=e;return Em(c,16,n)}if(13===d)return e=Po(So),c[2]=e,c[1]=14,Y;if(6===d)return c[2]=null,c[1]=8,Y;if(3===d)return c[2]=null,c[1]=5,Y;if(12===d)return e=
c[10],m=c[11],e=tn(Pn,new R(null,3,5,S,[Ni,e,m],null)),m=on(100),c[12]=e,Em(c,15,m);if(2===d){var p=c[2],q=function(){return function(){return function(b){return b.width}}(p,d,b)}(),e=Ng(q,function(){return function(){return function(b){return b.height}}(p,q,d,b)}()),m=null==document;c[13]=e;c[14]=p;c[1]=x(m)?3:4;return Y}return 11===d?(n=c[2],e=Q(n,0),m=Q(n,1),c[10]=e,c[11]=m,c[1]=x(n)?12:13,Y):9===d?(c[2]=null,c[1]=11,Y):5===d?(e=c[7],e=c[2],c[7]=e,c[1]=x(null==e)?6:7,Y):14===d?(e=c[2],Gm(c,e)):
16===d?(m=c[2],e=tn(Pn,gj),c[15]=m,c[2]=e,c[1]=14,Y):10===d?(m=c[16],e=c[13],e=e.b?e.b(m):e.call(null,m),c[2]=e,c[1]=11,Y):8===d?(m=c[16],e=c[2],c[16]=e,c[1]=x(null==e)?9:10,Y):null}}(b),b)}(),e=function(){var e=d.l?d.l():d.call(null);e[6]=b;return e}();return Dm(e)}}(b));return b};
function To(a,b){var c=lo(b),d=b.b?b.b(kk):b.call(null,kk),e=qn(1);Xm(function(c,d,e,l){return function(){var m=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!V(e,Y)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Im(c),d=Y;else throw f;}if(!V(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(c,d,e,f){return function(c){var g=c[1];if(7===g)return c[2]=null,c[1]=8,Y;if(1===g)return g=ho(b),g=new R(null,2,5,S,[Qj,g],null),Fm(c,2,Pn,g);if(4===g)return g=c[7],c[1]=x(50>g)?6:7,Y;if(6===g)return g=fo(e,a),g=d.b?d.b(g):d.call(null,g),g=new R(null,2,5,S,[Qj,g],null),Fm(c,9,Pn,g);if(3===g)return g=c[2],c[7]=0,c[8]=g,c[2]=null,c[1]=4,Y;if(2===g){var g=c[2],h=on(f);c[9]=g;return Em(c,
3,h)}return 9===g?(g=c[2],h=on(f),c[10]=g,Em(c,10,h)):5===g?(g=c[2],Gm(c,g)):10===g?(g=c[7],h=c[2],c[7]=g+1,c[11]=h,c[2]=null,c[1]=4,Y):8===g?(g=c[2],c[2]=g,c[1]=5,Y):null}}(c,d,e,l),c,d,e,l)}(),n=function(){var a=m.l?m.l():m.call(null);a[6]=c;return a}();return Dm(n)}}(e,c,d,100))}
function On(a,b){var c=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a,d=G.a(c,ji);try{if(V(b,Ri))return c;throw Fn;}catch(e){if(e instanceof Error)if(e===Fn)try{if(wd(b)&&3===O(b))try{var f=ld(b,0);if(V(f,Ni)){var g=ld(b,1),h=ld(b,2);return kf(hf.c(gf(gf(c,new R(null,2,5,S,[Wi,ri],null),g),new R(null,2,5,S,[Wi,sk],null),h),new R(null,2,5,S,[Wi,ji],null),Ke(Hk,new u(null,3,[Tj,150,ri,g-150,sk,h],null))),Wi,Qo,new u(null,2,[Tj,45,ri,60],null))}throw Fn;}catch(l){if(l instanceof Error){f=l;if(f===Fn)throw Fn;throw f;
}throw l;}else throw Fn;}catch(m){if(m instanceof Error)if(f=m,f===Fn)try{if(V(b,ck))return kf(c,Wi,Zl,function(){return function(a){a=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a;var b=G.a(a,rj),b=oo(b);return x(b)?nd.c(a,Ej,b.getTotalLength()):a}}(f,e,a,c,c,d));throw Fn;}catch(n){if(n instanceof Error)if(n===Fn)try{if(wd(b)&&2===O(b))try{var p=ld(b,0);if(V(p,Wi)){var q=ld(b,1);So();var r=Xl(q.b?q.b(co):q.call(null,co));return nd.h(c,Wi,r,H([Ii,r,Rh,!1],0))}throw Fn;}catch(v){if(v instanceof Error)if(q=v,
q===Fn)try{p=ld(b,0);if(V(p,Qi)){var w=ld(b,1);return nd.c(c,Rh,w)}throw Fn;}catch(z){if(z instanceof Error){var B=z;if(B===Fn)throw Fn;throw B;}throw z;}else throw q;else throw v;}else throw Fn;}catch(F){if(F instanceof Error)if(q=F,q===Fn)try{if(wd(b)&&3===O(b))try{var L=ld(b,0);if(V(L,Hh)){var P=ld(b,1),Aa=ld(b,2);Ro(P,Aa);return nd.c(c,Rh,!0)}throw Fn;}catch(E){if(E instanceof Error)if(B=E,B===Fn)try{L=ld(b,0);if(V(L,Uj))return P=ld(b,1),Aa=ld(b,2),x(c.b?c.b(Rh):c.call(null,Rh))&&Ro(P,Aa),c;throw Fn;
}catch(na){if(na instanceof Error){var la=na;if(la===Fn)throw Fn;throw la;}throw na;}else throw B;else throw E;}else throw Fn;}catch(U){if(U instanceof Error)if(B=U,B===Fn)try{if(wd(b)&&2===O(b))try{var W=ld(b,0);if(V(W,Ei))return P=ld(b,1),jf(c,Wi,function(a){return function(b){return fo(a,b)}}(P,W,B,q,n,f,e,a,c,c,d));throw Fn;}catch(ea){if(ea instanceof Error){la=ea;if(la===Fn)throw Fn;throw la;}throw ea;}else throw Fn;}catch(fa){if(fa instanceof Error)if(la=fa,la===Fn)try{if(V(b,Kj))return kf(hf.c(c,
new R(null,2,5,S,[Wi,kk],null),Rc),Wi,am,We(function(){return function(){return 6*Math.random()+1|0}}(la,B,q,n,f,e,a,c,c,d)));throw Fn;}catch(ha){if(ha instanceof Error)if(ha===Fn)try{if(V(b,Ch))return jf(c,Wi,dm);throw Fn;}catch(ma){if(ma instanceof Error)if(ma===Fn)try{if(wd(b)&&2===O(b))try{var oa=ld(b,0);if(V(oa,Qh))return w=ld(b,1),kf(c,Wi,Zl,function(a){return function(b){return nd.c(b,Gi,a)}}(w,oa,ma,ha,la,B,q,n,f,e,a,c,c,d));throw Fn;}catch(qa){if(qa instanceof Error){p=qa;if(p===Fn)throw Fn;
throw p;}throw qa;}else throw Fn;}catch(va){if(va instanceof Error)if(p=va,p===Fn)try{if(V(b,Jj))return jf(c,Wi,nm);throw Fn;}catch(xa){if(xa instanceof Error)if(xa===Fn)try{if(V(b,fj))return jf(c,Wi,pm);throw Fn;}catch(Pa){if(Pa instanceof Error)if(Pa===Fn)try{if(V(b,gj))return jf(c,Wi,om);throw Fn;}catch(Da){if(Da instanceof Error)if(Da===Fn)try{if(wd(b)&&2===O(b))try{var Qa=ld(b,0);if(V(Qa,Ui))return w=ld(b,1),kf(c,Wi,Zl,function(a){return function(b){return nd.c(b,Rj,a)}}(w,Qa,Da,Pa,xa,p,ma,ha,
la,B,q,n,f,e,a,c,c,d));throw Fn;}catch(Ja){if(Ja instanceof Error){d=Ja;if(d===Fn)throw Fn;throw d;}throw Ja;}else throw Fn;}catch(Wa){if(Wa instanceof Error)if(d=Wa,d===Fn)try{if(V(b,ik))return jf(c,Wi,qm);throw Fn;}catch(Ta){if(Ta instanceof Error)if(Ta===Fn)try{if(V(b,cj))return jf(c,Wi,sm);throw Fn;}catch(jb){if(jb instanceof Error)if(jb===Fn)try{if(wd(b)&&2===O(b))try{var Bb=ld(b,0);if(V(Bb,Cj))return w=ld(b,1),nd.c(c,ej,w);throw Fn;}catch(yc){if(yc instanceof Error)if(d=yc,d===Fn)try{Bb=ld(b,
0);if(V(Bb,Mj))return w=ld(b,1),nd.c(c,$h,w);throw Fn;}catch(Zc){if(Zc instanceof Error)if(Zc===Fn)try{Bb=ld(b,0);if(V(Bb,Li))return w=ld(b,1),x(w)?(To(c.b?c.b(Ii):c.call(null,Ii),c.b?c.b(Wi):c.call(null,Wi)),c):kf(c,Wi,pd,Li);throw Fn;}catch(kh){if(kh instanceof Error)if(kh===Fn)try{Bb=ld(b,0);if(V(Bb,Qj)){var lh=ld(b,1);return gf(c,new R(null,2,5,S,[Wi,Li],null),lh)}throw Fn;}catch(nj){if(nj instanceof Error&&nj===Fn)throw Fn;throw nj;}else throw kh;else throw kh;}else throw Zc;else throw Zc;}else throw d;
else throw yc;}else throw Fn;}catch(oj){if(oj instanceof Error){d=oj;if(d===Fn)throw Error([A("No matching clause: "),A(b)].join(""));throw d;}throw oj;}else throw jb;else throw jb;}else throw Ta;else throw Ta;}else throw d;else throw Wa;}else throw Da;else throw Da;}else throw Pa;else throw Pa;}else throw xa;else throw xa;}else throw p;else throw va;}else throw ma;else throw ma;}else throw ha;else throw ha;}else throw la;else throw fa;}else throw B;else throw U;}else throw q;else throw F;}else throw n;
else throw n;}else throw f;else throw m;}else throw e;else throw e;}}if("undefined"===typeof vn)var vn=Nn();if("undefined"===typeof Uo){var Rn;Rn=un(function(a){return No(a)});var Uo;Uo=Qn()}
if("undefined"===typeof Vo)var Vo=function(){var a=qn(1);Xm(function(a){return function(){var c=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var f=a(c);if(!V(f,Y)){d=f;break a}}}catch(g){if(g instanceof Object)c[5]=g,Im(c),d=Y;else throw g;}if(!V(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.l=c;d.b=b;return d}()}(function(){return function(a){var b=a[1];return 1===b?Fm(a,2,Pn,new R(null,2,5,S,[Wi,Nj],null)):2===b?(b=a[2],Gm(a,b)):null}}(a),a)}(),d=function(){var d=c.l?c.l():c.call(null);d[6]=a;return d}();return Dm(d)}}(a));return a}();