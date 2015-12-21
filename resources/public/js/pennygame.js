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
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function ca(a){return"function"==t(a)}var da="closure_uid_"+(1E9*Math.random()>>>0),ea=0;function ga(a,b,c){return a.call.apply(a.bind,arguments)}function ia(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}
function ja(a,b,c){ja=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ga:ia;return ja.apply(null,arguments)};function la(a,b){for(var c in a)b.call(void 0,a[c],c,a)};function pa(a,b){null!=a&&this.append.apply(this,arguments)}k=pa.prototype;k.hb="";k.set=function(a){this.hb=""+a};k.append=function(a,b,c){this.hb+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.hb+=arguments[d];return this};k.clear=function(){this.hb=""};k.toString=function(){return this.hb};function ra(a,b){a.sort(b||sa)}function ta(a,b){for(var c=0;c<a.length;c++)a[c]={index:c,value:a[c]};var d=b||sa;ra(a,function(a,b){return d(a.value,b.value)||a.index-b.index});for(c=0;c<a.length;c++)a[c]=a[c].value}function sa(a,b){return a>b?1:a<b?-1:0};var ua={},wa;if("undefined"===typeof xa)var xa=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof za)var za=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var Ca=null;if("undefined"===typeof Da)var Da=null;function Ea(){return new u(null,5,[Fa,!0,Ga,!0,Ha,!1,Ia,!1,Ka,null],null)}La;function x(a){return null!=a&&!1!==a}Ma;y;function Na(a){return null==a}function Oa(a){return a instanceof Array}
function Pa(a){return null==a?!0:!1===a?!0:!1}function Qa(a,b){return a[t(null==b?null:b)]?!0:a._?!0:!1}function Ra(a,b){var c=null==b?null:b.constructor,c=x(x(c)?c.xb:c)?c.eb:t(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function Sa(a){var b=a.eb;return x(b)?b:""+B(a)}var Wa="undefined"!==typeof Symbol&&"function"===t(Symbol)?Symbol.iterator:"@@iterator";function Xa(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}C;Za;
var La=function La(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return La.b(arguments[0]);case 2:return La.a(arguments[0],arguments[1]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};La.b=function(a){return La.a(null,a)};La.a=function(a,b){function c(a,b){a.push(b);return a}var d=[];return Za.c?Za.c(c,d,b):Za.call(null,c,d,b)};La.w=2;function $a(){}function ab(){}
var bb=function bb(b){if(null!=b&&null!=b.Z)return b.Z(b);var c=bb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=bb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("ICounted.-count",b);},cb=function cb(b){if(null!=b&&null!=b.da)return b.da(b);var c=cb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=cb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IEmptyableCollection.-empty",b);};function db(){}
var eb=function eb(b,c){if(null!=b&&null!=b.X)return b.X(b,c);var d=eb[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=eb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("ICollection.-conj",b);};function fb(){}
var gb=function gb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return gb.a(arguments[0],arguments[1]);case 3:return gb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};
gb.a=function(a,b){if(null!=a&&null!=a.ca)return a.ca(a,b);var c=gb[t(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=gb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Ra("IIndexed.-nth",a);};gb.c=function(a,b,c){if(null!=a&&null!=a.Ea)return a.Ea(a,b,c);var d=gb[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=gb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Ra("IIndexed.-nth",a);};gb.w=3;function hb(){}
var ib=function ib(b){if(null!=b&&null!=b.ta)return b.ta(b);var c=ib[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ib._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("ISeq.-first",b);},jb=function jb(b){if(null!=b&&null!=b.xa)return b.xa(b);var c=jb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=jb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("ISeq.-rest",b);};function kb(){}function lb(){}
var mb=function mb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return mb.a(arguments[0],arguments[1]);case 3:return mb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};
mb.a=function(a,b){if(null!=a&&null!=a.N)return a.N(a,b);var c=mb[t(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=mb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Ra("ILookup.-lookup",a);};mb.c=function(a,b,c){if(null!=a&&null!=a.I)return a.I(a,b,c);var d=mb[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=mb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Ra("ILookup.-lookup",a);};mb.w=3;function nb(){}
var ob=function ob(b,c){if(null!=b&&null!=b.lc)return b.lc(b,c);var d=ob[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=ob._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("IAssociative.-contains-key?",b);},qb=function qb(b,c,d){if(null!=b&&null!=b.Oa)return b.Oa(b,c,d);var e=qb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=qb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ra("IAssociative.-assoc",b);};function rb(){}
var sb=function sb(b,c){if(null!=b&&null!=b.ib)return b.ib(b,c);var d=sb[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=sb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("IMap.-dissoc",b);};function tb(){}
var ub=function ub(b){if(null!=b&&null!=b.Mb)return b.Mb(b);var c=ub[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ub._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IMapEntry.-key",b);},vb=function vb(b){if(null!=b&&null!=b.Nb)return b.Nb(b);var c=vb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=vb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IMapEntry.-val",b);};function wb(){}
var xb=function xb(b){if(null!=b&&null!=b.jb)return b.jb(b);var c=xb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=xb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IStack.-peek",b);};function yb(){}
var zb=function zb(b,c,d){if(null!=b&&null!=b.kb)return b.kb(b,c,d);var e=zb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=zb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ra("IVector.-assoc-n",b);},Ab=function Ab(b){if(null!=b&&null!=b.Jb)return b.Jb(b);var c=Ab[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Ab._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IDeref.-deref",b);};function Cb(){}
var Db=function Db(b){if(null!=b&&null!=b.O)return b.O(b);var c=Db[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Db._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IMeta.-meta",b);},Eb=function Eb(b,c){if(null!=b&&null!=b.P)return b.P(b,c);var d=Eb[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Eb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("IWithMeta.-with-meta",b);};function Fb(){}
var Gb=function Gb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Gb.a(arguments[0],arguments[1]);case 3:return Gb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};
Gb.a=function(a,b){if(null!=a&&null!=a.ea)return a.ea(a,b);var c=Gb[t(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=Gb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Ra("IReduce.-reduce",a);};Gb.c=function(a,b,c){if(null!=a&&null!=a.fa)return a.fa(a,b,c);var d=Gb[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=Gb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Ra("IReduce.-reduce",a);};Gb.w=3;
var Hb=function Hb(b,c,d){if(null!=b&&null!=b.Lb)return b.Lb(b,c,d);var e=Hb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Hb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ra("IKVReduce.-kv-reduce",b);},Ib=function Ib(b,c){if(null!=b&&null!=b.D)return b.D(b,c);var d=Ib[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Ib._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("IEquiv.-equiv",b);},Jb=function Jb(b){if(null!=b&&null!=b.T)return b.T(b);
var c=Jb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Jb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IHash.-hash",b);};function Kb(){}var Lb=function Lb(b){if(null!=b&&null!=b.V)return b.V(b);var c=Lb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Lb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("ISeqable.-seq",b);};function Mb(){}function Nb(){}function Ob(){}
var Pb=function Pb(b){if(null!=b&&null!=b.bc)return b.bc(b);var c=Pb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Pb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IReversible.-rseq",b);},Qb=function Qb(b,c){if(null!=b&&null!=b.Bc)return b.Bc(0,c);var d=Qb[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Qb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("IWriter.-write",b);},Rb=function Rb(b,c,d){if(null!=b&&null!=b.M)return b.M(b,c,d);
var e=Rb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Rb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ra("IPrintWithWriter.-pr-writer",b);},Sb=function Sb(b,c,d){if(null!=b&&null!=b.Ac)return b.Ac(0,c,d);var e=Sb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Sb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ra("IWatchable.-notify-watches",b);},Tb=function Tb(b){if(null!=b&&null!=b.vb)return b.vb(b);var c=Tb[t(null==
b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Tb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IEditableCollection.-as-transient",b);},Ub=function Ub(b,c){if(null!=b&&null!=b.Rb)return b.Rb(b,c);var d=Ub[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Ub._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("ITransientCollection.-conj!",b);},Vb=function Vb(b){if(null!=b&&null!=b.Sb)return b.Sb(b);var c=Vb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):
c.call(null,b);c=Vb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("ITransientCollection.-persistent!",b);},Wb=function Wb(b,c,d){if(null!=b&&null!=b.Qb)return b.Qb(b,c,d);var e=Wb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Wb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ra("ITransientAssociative.-assoc!",b);},Xb=function Xb(b,c,d){if(null!=b&&null!=b.zc)return b.zc(0,c,d);var e=Xb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,
b,c,d);e=Xb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ra("ITransientVector.-assoc-n!",b);};function Yb(){}
var Zb=function Zb(b,c){if(null!=b&&null!=b.ub)return b.ub(b,c);var d=Zb[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Zb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("IComparable.-compare",b);},$b=function $b(b){if(null!=b&&null!=b.wc)return b.wc();var c=$b[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=$b._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IChunk.-drop-first",b);},ac=function ac(b){if(null!=b&&null!=b.nc)return b.nc(b);
var c=ac[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ac._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IChunkedSeq.-chunked-first",b);},bc=function bc(b){if(null!=b&&null!=b.oc)return b.oc(b);var c=bc[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=bc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IChunkedSeq.-chunked-rest",b);},cc=function cc(b){if(null!=b&&null!=b.mc)return b.mc(b);var c=cc[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,
b);c=cc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IChunkedNext.-chunked-next",b);},dc=function dc(b){if(null!=b&&null!=b.Ob)return b.Ob(b);var c=dc[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=dc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("INamed.-name",b);},ec=function ec(b){if(null!=b&&null!=b.Pb)return b.Pb(b);var c=ec[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ec._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("INamed.-namespace",
b);},fc=function fc(b,c){if(null!=b&&null!=b.Zc)return b.Zc(b,c);var d=fc[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=fc._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("IReset.-reset!",b);},gc=function gc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return gc.a(arguments[0],arguments[1]);case 3:return gc.c(arguments[0],arguments[1],arguments[2]);case 4:return gc.m(arguments[0],arguments[1],arguments[2],
arguments[3]);case 5:return gc.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};gc.a=function(a,b){if(null!=a&&null!=a.ad)return a.ad(a,b);var c=gc[t(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=gc._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Ra("ISwap.-swap!",a);};
gc.c=function(a,b,c){if(null!=a&&null!=a.bd)return a.bd(a,b,c);var d=gc[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=gc._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Ra("ISwap.-swap!",a);};gc.m=function(a,b,c,d){if(null!=a&&null!=a.cd)return a.cd(a,b,c,d);var e=gc[t(null==a?null:a)];if(null!=e)return e.m?e.m(a,b,c,d):e.call(null,a,b,c,d);e=gc._;if(null!=e)return e.m?e.m(a,b,c,d):e.call(null,a,b,c,d);throw Ra("ISwap.-swap!",a);};
gc.A=function(a,b,c,d,e){if(null!=a&&null!=a.dd)return a.dd(a,b,c,d,e);var f=gc[t(null==a?null:a)];if(null!=f)return f.A?f.A(a,b,c,d,e):f.call(null,a,b,c,d,e);f=gc._;if(null!=f)return f.A?f.A(a,b,c,d,e):f.call(null,a,b,c,d,e);throw Ra("ISwap.-swap!",a);};gc.w=5;var hc=function hc(b){if(null!=b&&null!=b.Ga)return b.Ga(b);var c=hc[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=hc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IIterable.-iterator",b);};
function ic(a){this.rd=a;this.g=1073741824;this.C=0}ic.prototype.Bc=function(a,b){return this.rd.append(b)};function jc(a){var b=new pa;a.M(null,new ic(b),Ea());return""+B(b)}var kc="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function lc(a){a=kc(a|0,-862048943);return kc(a<<15|a>>>-15,461845907)}
function mc(a,b){var c=(a|0)^(b|0);return kc(c<<13|c>>>-13,5)+-430675100|0}function nc(a,b){var c=(a|0)^b,c=kc(c^c>>>16,-2048144789),c=kc(c^c>>>13,-1028477387);return c^c>>>16}function oc(a){var b;a:{b=1;for(var c=0;;)if(b<a.length){var d=b+2,c=mc(c,lc(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^lc(a.charCodeAt(a.length-1)):b;return nc(b,kc(2,a.length))}pc;qc;rc;sc;var tc={},uc=0;
function vc(a){255<uc&&(tc={},uc=0);var b=tc[a];if("number"!==typeof b){a:if(null!=a)if(b=a.length,0<b)for(var c=0,d=0;;)if(c<b)var e=c+1,d=kc(31,d)+a.charCodeAt(c),c=e;else{b=d;break a}else b=0;else b=0;tc[a]=b;uc+=1}return a=b}function wc(a){null!=a&&(a.g&4194304||a.yd)?a=a.T(null):"number"===typeof a?a=Math.floor(a)%2147483647:!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=vc(a),0!==a&&(a=lc(a),a=mc(0,a),a=nc(a,4))):a=a instanceof Date?a.valueOf():null==a?0:Jb(a);return a}
function xc(a,b){return a^b+2654435769+(a<<6)+(a>>2)}function Ma(a,b){return b instanceof a}function yc(a,b){if(a.$a===b.$a)return 0;var c=Pa(a.Ba);if(x(c?b.Ba:c))return-1;if(x(a.Ba)){if(Pa(b.Ba))return 1;c=sa(a.Ba,b.Ba);return 0===c?sa(a.name,b.name):c}return sa(a.name,b.name)}D;function qc(a,b,c,d,e){this.Ba=a;this.name=b;this.$a=c;this.tb=d;this.Da=e;this.g=2154168321;this.C=4096}k=qc.prototype;k.toString=function(){return this.$a};k.equiv=function(a){return this.D(null,a)};
k.D=function(a,b){return b instanceof qc?this.$a===b.$a:!1};k.call=function(){function a(a,b,c){return D.c?D.c(b,this,c):D.call(null,b,this,c)}function b(a,b){return D.a?D.a(b,this):D.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Xa(b)))};
k.b=function(a){return D.a?D.a(a,this):D.call(null,a,this)};k.a=function(a,b){return D.c?D.c(a,this,b):D.call(null,a,this,b)};k.O=function(){return this.Da};k.P=function(a,b){return new qc(this.Ba,this.name,this.$a,this.tb,b)};k.T=function(){var a=this.tb;return null!=a?a:this.tb=a=xc(oc(this.name),vc(this.Ba))};k.Ob=function(){return this.name};k.Pb=function(){return this.Ba};k.M=function(a,b){return Qb(b,this.$a)};
var zc=function zc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return zc.b(arguments[0]);case 2:return zc.a(arguments[0],arguments[1]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};zc.b=function(a){if(a instanceof qc)return a;var b=a.indexOf("/");return-1===b?zc.a(null,a):zc.a(a.substring(0,b),a.substring(b+1,a.length))};zc.a=function(a,b){var c=null!=a?[B(a),B("/"),B(b)].join(""):b;return new qc(a,b,c,null,null)};
zc.w=2;G;Ac;Bc;function H(a){if(null==a)return null;if(null!=a&&(a.g&8388608||a.$c))return a.V(null);if(Oa(a)||"string"===typeof a)return 0===a.length?null:new Bc(a,0);if(Qa(Kb,a))return Lb(a);throw Error([B(a),B(" is not ISeqable")].join(""));}function I(a){if(null==a)return null;if(null!=a&&(a.g&64||a.F))return a.ta(null);a=H(a);return null==a?null:ib(a)}function Dc(a){return null!=a?null!=a&&(a.g&64||a.F)?a.xa(null):(a=H(a))?jb(a):Ec:Ec}
function K(a){return null==a?null:null!=a&&(a.g&128||a.ac)?a.wa(null):H(Dc(a))}var rc=function rc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return rc.b(arguments[0]);case 2:return rc.a(arguments[0],arguments[1]);default:return rc.i(arguments[0],arguments[1],new Bc(c.slice(2),0))}};rc.b=function(){return!0};rc.a=function(a,b){return null==a?null==b:a===b||Ib(a,b)};
rc.i=function(a,b,c){for(;;)if(rc.a(a,b))if(K(c))a=b,b=I(c),c=K(c);else return rc.a(b,I(c));else return!1};rc.B=function(a){var b=I(a),c=K(a);a=I(c);c=K(c);return rc.i(b,a,c)};rc.w=2;function Fc(a){this.J=a}Fc.prototype.next=function(){if(null!=this.J){var a=I(this.J);this.J=K(this.J);return{value:a,done:!1}}return{value:null,done:!0}};function Gc(a){return new Fc(H(a))}Hc;function Ic(a,b,c){this.value=a;this.Db=b;this.jc=c;this.g=8388672;this.C=0}Ic.prototype.V=function(){return this};
Ic.prototype.ta=function(){return this.value};Ic.prototype.xa=function(){null==this.jc&&(this.jc=Hc.b?Hc.b(this.Db):Hc.call(null,this.Db));return this.jc};function Hc(a){var b=a.next();return x(b.done)?Ec:new Ic(b.value,a,null)}function Jc(a,b){var c=lc(a),c=mc(0,c);return nc(c,b)}function Kc(a){var b=0,c=1;for(a=H(a);;)if(null!=a)b+=1,c=kc(31,c)+wc(I(a))|0,a=K(a);else return Jc(c,b)}var Lc=Jc(1,0);function Mc(a){var b=0,c=0;for(a=H(a);;)if(null!=a)b+=1,c=c+wc(I(a))|0,a=K(a);else return Jc(c,b)}
var Nc=Jc(0,0);Oc;pc;Pc;ab["null"]=!0;bb["null"]=function(){return 0};Date.prototype.D=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};Date.prototype.Ib=!0;Date.prototype.ub=function(a,b){if(b instanceof Date)return sa(this.valueOf(),b.valueOf());throw Error([B("Cannot compare "),B(this),B(" to "),B(b)].join(""));};Ib.number=function(a,b){return a===b};Qc;$a["function"]=!0;Cb["function"]=!0;Db["function"]=function(){return null};Jb._=function(a){return a[da]||(a[da]=++ea)};
function Rc(a){return a+1}L;function Sc(a){this.H=a;this.g=32768;this.C=0}Sc.prototype.Jb=function(){return this.H};function Tc(a){return a instanceof Sc}function L(a){return Ab(a)}function Uc(a,b){var c=bb(a);if(0===c)return b.l?b.l():b.call(null);for(var d=gb.a(a,0),e=1;;)if(e<c){var f=gb.a(a,e),d=b.a?b.a(d,f):b.call(null,d,f);if(Tc(d))return Ab(d);e+=1}else return d}
function Vc(a,b,c){var d=bb(a),e=c;for(c=0;;)if(c<d){var f=gb.a(a,c),e=b.a?b.a(e,f):b.call(null,e,f);if(Tc(e))return Ab(e);c+=1}else return e}function Wc(a,b){var c=a.length;if(0===a.length)return b.l?b.l():b.call(null);for(var d=a[0],e=1;;)if(e<c){var f=a[e],d=b.a?b.a(d,f):b.call(null,d,f);if(Tc(d))return Ab(d);e+=1}else return d}function Xc(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var f=a[c],e=b.a?b.a(e,f):b.call(null,e,f);if(Tc(e))return Ab(e);c+=1}else return e}
function Yc(a,b,c,d){for(var e=a.length;;)if(d<e){var f=a[d];c=b.a?b.a(c,f):b.call(null,c,f);if(Tc(c))return Ab(c);d+=1}else return c}Zc;N;$c;ad;function bd(a){return null!=a?a.g&2||a.Qc?!0:a.g?!1:Qa(ab,a):Qa(ab,a)}function dd(a){return null!=a?a.g&16||a.xc?!0:a.g?!1:Qa(fb,a):Qa(fb,a)}function ed(a,b){this.f=a;this.s=b}ed.prototype.ya=function(){return this.s<this.f.length};ed.prototype.next=function(){var a=this.f[this.s];this.s+=1;return a};
function Bc(a,b){this.f=a;this.s=b;this.g=166199550;this.C=8192}k=Bc.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.ca=function(a,b){var c=b+this.s;return c<this.f.length?this.f[c]:null};k.Ea=function(a,b,c){a=b+this.s;return a<this.f.length?this.f[a]:c};k.Ga=function(){return new ed(this.f,this.s)};k.wa=function(){return this.s+1<this.f.length?new Bc(this.f,this.s+1):null};k.Z=function(){var a=this.f.length-this.s;return 0>a?0:a};
k.bc=function(){var a=bb(this);return 0<a?new $c(this,a-1,null):null};k.T=function(){return Kc(this)};k.D=function(a,b){return Pc.a?Pc.a(this,b):Pc.call(null,this,b)};k.da=function(){return Ec};k.ea=function(a,b){return Yc(this.f,b,this.f[this.s],this.s+1)};k.fa=function(a,b,c){return Yc(this.f,b,c,this.s)};k.ta=function(){return this.f[this.s]};k.xa=function(){return this.s+1<this.f.length?new Bc(this.f,this.s+1):Ec};k.V=function(){return this.s<this.f.length?this:null};
k.X=function(a,b){return N.a?N.a(b,this):N.call(null,b,this)};Bc.prototype[Wa]=function(){return Gc(this)};var Ac=function Ac(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ac.b(arguments[0]);case 2:return Ac.a(arguments[0],arguments[1]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};Ac.b=function(a){return Ac.a(a,0)};Ac.a=function(a,b){return b<a.length?new Bc(a,b):null};Ac.w=2;
var G=function G(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return G.b(arguments[0]);case 2:return G.a(arguments[0],arguments[1]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};G.b=function(a){return Ac.a(a,0)};G.a=function(a,b){return Ac.a(a,b)};G.w=2;Qc;fd;function $c(a,b,c){this.$b=a;this.s=b;this.v=c;this.g=32374990;this.C=8192}k=$c.prototype;k.toString=function(){return jc(this)};
k.equiv=function(a){return this.D(null,a)};k.O=function(){return this.v};k.wa=function(){return 0<this.s?new $c(this.$b,this.s-1,null):null};k.Z=function(){return this.s+1};k.T=function(){return Kc(this)};k.D=function(a,b){return Pc.a?Pc.a(this,b):Pc.call(null,this,b)};k.da=function(){var a=Ec,b=this.v;return Qc.a?Qc.a(a,b):Qc.call(null,a,b)};k.ea=function(a,b){return fd.a?fd.a(b,this):fd.call(null,b,this)};k.fa=function(a,b,c){return fd.c?fd.c(b,c,this):fd.call(null,b,c,this)};
k.ta=function(){return gb.a(this.$b,this.s)};k.xa=function(){return 0<this.s?new $c(this.$b,this.s-1,null):Ec};k.V=function(){return this};k.P=function(a,b){return new $c(this.$b,this.s,b)};k.X=function(a,b){return N.a?N.a(b,this):N.call(null,b,this)};$c.prototype[Wa]=function(){return Gc(this)};function gd(a){return I(K(a))}function hd(a){for(;;){var b=K(a);if(null!=b)a=b;else return I(a)}}Ib._=function(a,b){return a===b};
var id=function id(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return id.l();case 1:return id.b(arguments[0]);case 2:return id.a(arguments[0],arguments[1]);default:return id.i(arguments[0],arguments[1],new Bc(c.slice(2),0))}};id.l=function(){return jd};id.b=function(a){return a};id.a=function(a,b){return null!=a?eb(a,b):eb(Ec,b)};id.i=function(a,b,c){for(;;)if(x(c))a=id.a(a,b),b=I(c),c=K(c);else return id.a(a,b)};
id.B=function(a){var b=I(a),c=K(a);a=I(c);c=K(c);return id.i(b,a,c)};id.w=2;function O(a){if(null!=a)if(null!=a&&(a.g&2||a.Qc))a=a.Z(null);else if(Oa(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.g&8388608||a.$c))a:{a=H(a);for(var b=0;;){if(bd(a)){a=b+bb(a);break a}a=K(a);b+=1}}else a=bb(a);else a=0;return a}function kd(a,b){for(var c=null;;){if(null==a)return c;if(0===b)return H(a)?I(a):c;if(dd(a))return gb.c(a,b,c);if(H(a)){var d=K(a),e=b-1;a=d;b=e}else return c}}
function ld(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.g&16||a.xc))return a.ca(null,b);if(Oa(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.g&64||a.F)){var c;a:{c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(H(c)){c=I(c);break a}throw Error("Index out of bounds");}if(dd(c)){c=gb.a(c,d);break a}if(H(c))c=K(c),--d;else throw Error("Index out of bounds");
}}return c}if(Qa(fb,a))return gb.a(a,b);throw Error([B("nth not supported on this type "),B(Sa(null==a?null:a.constructor))].join(""));}
function P(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return null;if(null!=a&&(a.g&16||a.xc))return a.Ea(null,b,null);if(Oa(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.g&64||a.F))return kd(a,b);if(Qa(fb,a))return gb.a(a,b);throw Error([B("nth not supported on this type "),B(Sa(null==a?null:a.constructor))].join(""));}
var D=function D(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return D.a(arguments[0],arguments[1]);case 3:return D.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};D.a=function(a,b){return null==a?null:null!=a&&(a.g&256||a.yc)?a.N(null,b):Oa(a)?b<a.length?a[b|0]:null:"string"===typeof a?b<a.length?a[b|0]:null:Qa(lb,a)?mb.a(a,b):null};
D.c=function(a,b,c){return null!=a?null!=a&&(a.g&256||a.yc)?a.I(null,b,c):Oa(a)?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:Qa(lb,a)?mb.c(a,b,c):c:c};D.w=3;md;var nd=function nd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return nd.c(arguments[0],arguments[1],arguments[2]);default:return nd.i(arguments[0],arguments[1],arguments[2],new Bc(c.slice(3),0))}};nd.c=function(a,b,c){return null!=a?qb(a,b,c):od([b],[c])};
nd.i=function(a,b,c,d){for(;;)if(a=nd.c(a,b,c),x(d))b=I(d),c=gd(d),d=K(K(d));else return a};nd.B=function(a){var b=I(a),c=K(a);a=I(c);var d=K(c),c=I(d),d=K(d);return nd.i(b,a,c,d)};nd.w=3;var pd=function pd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return pd.b(arguments[0]);case 2:return pd.a(arguments[0],arguments[1]);default:return pd.i(arguments[0],arguments[1],new Bc(c.slice(2),0))}};pd.b=function(a){return a};
pd.a=function(a,b){return null==a?null:sb(a,b)};pd.i=function(a,b,c){for(;;){if(null==a)return null;a=pd.a(a,b);if(x(c))b=I(c),c=K(c);else return a}};pd.B=function(a){var b=I(a),c=K(a);a=I(c);c=K(c);return pd.i(b,a,c)};pd.w=2;function qd(a,b){this.h=a;this.v=b;this.g=393217;this.C=0}k=qd.prototype;k.O=function(){return this.v};k.P=function(a,b){return new qd(this.h,b)};k.Pc=!0;
k.call=function(){function a(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,A,F,E,M,J){a=this;return C.wb?C.wb(a.h,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,A,F,E,M,J):C.call(null,a.h,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,A,F,E,M,J)}function b(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,A,F,E,M){a=this;return a.h.qa?a.h.qa(b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,A,F,E,M):a.h.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,A,F,E,M)}function c(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,A,F,E){a=this;return a.h.pa?a.h.pa(b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,A,F,E):
a.h.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,A,F,E)}function d(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,A,F){a=this;return a.h.oa?a.h.oa(b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,A,F):a.h.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,A,F)}function e(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,A){a=this;return a.h.na?a.h.na(b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,A):a.h.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,A)}function f(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z){a=this;return a.h.ma?a.h.ma(b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z):a.h.call(null,b,
c,d,e,f,g,h,l,m,n,p,q,r,w,v,z)}function g(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v){a=this;return a.h.la?a.h.la(b,c,d,e,f,g,h,l,m,n,p,q,r,w,v):a.h.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v)}function h(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w){a=this;return a.h.ka?a.h.ka(b,c,d,e,f,g,h,l,m,n,p,q,r,w):a.h.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w)}function l(a,b,c,d,e,f,g,h,l,m,n,p,q,r){a=this;return a.h.ja?a.h.ja(b,c,d,e,f,g,h,l,m,n,p,q,r):a.h.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r)}function m(a,b,c,d,e,f,g,h,l,m,n,p,q){a=this;
return a.h.ia?a.h.ia(b,c,d,e,f,g,h,l,m,n,p,q):a.h.call(null,b,c,d,e,f,g,h,l,m,n,p,q)}function n(a,b,c,d,e,f,g,h,l,m,n,p){a=this;return a.h.ha?a.h.ha(b,c,d,e,f,g,h,l,m,n,p):a.h.call(null,b,c,d,e,f,g,h,l,m,n,p)}function p(a,b,c,d,e,f,g,h,l,m,n){a=this;return a.h.ga?a.h.ga(b,c,d,e,f,g,h,l,m,n):a.h.call(null,b,c,d,e,f,g,h,l,m,n)}function q(a,b,c,d,e,f,g,h,l,m){a=this;return a.h.sa?a.h.sa(b,c,d,e,f,g,h,l,m):a.h.call(null,b,c,d,e,f,g,h,l,m)}function r(a,b,c,d,e,f,g,h,l){a=this;return a.h.ra?a.h.ra(b,c,
d,e,f,g,h,l):a.h.call(null,b,c,d,e,f,g,h,l)}function v(a,b,c,d,e,f,g,h){a=this;return a.h.ba?a.h.ba(b,c,d,e,f,g,h):a.h.call(null,b,c,d,e,f,g,h)}function w(a,b,c,d,e,f,g){a=this;return a.h.Y?a.h.Y(b,c,d,e,f,g):a.h.call(null,b,c,d,e,f,g)}function z(a,b,c,d,e,f){a=this;return a.h.A?a.h.A(b,c,d,e,f):a.h.call(null,b,c,d,e,f)}function A(a,b,c,d,e){a=this;return a.h.m?a.h.m(b,c,d,e):a.h.call(null,b,c,d,e)}function F(a,b,c,d){a=this;return a.h.c?a.h.c(b,c,d):a.h.call(null,b,c,d)}function J(a,b,c){a=this;
return a.h.a?a.h.a(b,c):a.h.call(null,b,c)}function M(a,b){a=this;return a.h.b?a.h.b(b):a.h.call(null,b)}function Ba(a){a=this;return a.h.l?a.h.l():a.h.call(null)}var E=null,E=function(na,ka,R,fa,X,ha,W,ma,oa,qa,va,ya,E,Aa,Ja,Ua,Va,pb,Bb,Ya,Cc,cd){switch(arguments.length){case 1:return Ba.call(this,na);case 2:return M.call(this,na,ka);case 3:return J.call(this,na,ka,R);case 4:return F.call(this,na,ka,R,fa);case 5:return A.call(this,na,ka,R,fa,X);case 6:return z.call(this,na,ka,R,fa,X,ha);case 7:return w.call(this,
na,ka,R,fa,X,ha,W);case 8:return v.call(this,na,ka,R,fa,X,ha,W,ma);case 9:return r.call(this,na,ka,R,fa,X,ha,W,ma,oa);case 10:return q.call(this,na,ka,R,fa,X,ha,W,ma,oa,qa);case 11:return p.call(this,na,ka,R,fa,X,ha,W,ma,oa,qa,va);case 12:return n.call(this,na,ka,R,fa,X,ha,W,ma,oa,qa,va,ya);case 13:return m.call(this,na,ka,R,fa,X,ha,W,ma,oa,qa,va,ya,E);case 14:return l.call(this,na,ka,R,fa,X,ha,W,ma,oa,qa,va,ya,E,Aa);case 15:return h.call(this,na,ka,R,fa,X,ha,W,ma,oa,qa,va,ya,E,Aa,Ja);case 16:return g.call(this,
na,ka,R,fa,X,ha,W,ma,oa,qa,va,ya,E,Aa,Ja,Ua);case 17:return f.call(this,na,ka,R,fa,X,ha,W,ma,oa,qa,va,ya,E,Aa,Ja,Ua,Va);case 18:return e.call(this,na,ka,R,fa,X,ha,W,ma,oa,qa,va,ya,E,Aa,Ja,Ua,Va,pb);case 19:return d.call(this,na,ka,R,fa,X,ha,W,ma,oa,qa,va,ya,E,Aa,Ja,Ua,Va,pb,Bb);case 20:return c.call(this,na,ka,R,fa,X,ha,W,ma,oa,qa,va,ya,E,Aa,Ja,Ua,Va,pb,Bb,Ya);case 21:return b.call(this,na,ka,R,fa,X,ha,W,ma,oa,qa,va,ya,E,Aa,Ja,Ua,Va,pb,Bb,Ya,Cc);case 22:return a.call(this,na,ka,R,fa,X,ha,W,ma,oa,
qa,va,ya,E,Aa,Ja,Ua,Va,pb,Bb,Ya,Cc,cd)}throw Error("Invalid arity: "+arguments.length);};E.b=Ba;E.a=M;E.c=J;E.m=F;E.A=A;E.Y=z;E.ba=w;E.ra=v;E.sa=r;E.ga=q;E.ha=p;E.ia=n;E.ja=m;E.ka=l;E.la=h;E.ma=g;E.na=f;E.oa=e;E.pa=d;E.qa=c;E.Kb=b;E.wb=a;return E}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Xa(b)))};k.l=function(){return this.h.l?this.h.l():this.h.call(null)};k.b=function(a){return this.h.b?this.h.b(a):this.h.call(null,a)};
k.a=function(a,b){return this.h.a?this.h.a(a,b):this.h.call(null,a,b)};k.c=function(a,b,c){return this.h.c?this.h.c(a,b,c):this.h.call(null,a,b,c)};k.m=function(a,b,c,d){return this.h.m?this.h.m(a,b,c,d):this.h.call(null,a,b,c,d)};k.A=function(a,b,c,d,e){return this.h.A?this.h.A(a,b,c,d,e):this.h.call(null,a,b,c,d,e)};k.Y=function(a,b,c,d,e,f){return this.h.Y?this.h.Y(a,b,c,d,e,f):this.h.call(null,a,b,c,d,e,f)};
k.ba=function(a,b,c,d,e,f,g){return this.h.ba?this.h.ba(a,b,c,d,e,f,g):this.h.call(null,a,b,c,d,e,f,g)};k.ra=function(a,b,c,d,e,f,g,h){return this.h.ra?this.h.ra(a,b,c,d,e,f,g,h):this.h.call(null,a,b,c,d,e,f,g,h)};k.sa=function(a,b,c,d,e,f,g,h,l){return this.h.sa?this.h.sa(a,b,c,d,e,f,g,h,l):this.h.call(null,a,b,c,d,e,f,g,h,l)};k.ga=function(a,b,c,d,e,f,g,h,l,m){return this.h.ga?this.h.ga(a,b,c,d,e,f,g,h,l,m):this.h.call(null,a,b,c,d,e,f,g,h,l,m)};
k.ha=function(a,b,c,d,e,f,g,h,l,m,n){return this.h.ha?this.h.ha(a,b,c,d,e,f,g,h,l,m,n):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n)};k.ia=function(a,b,c,d,e,f,g,h,l,m,n,p){return this.h.ia?this.h.ia(a,b,c,d,e,f,g,h,l,m,n,p):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p)};k.ja=function(a,b,c,d,e,f,g,h,l,m,n,p,q){return this.h.ja?this.h.ja(a,b,c,d,e,f,g,h,l,m,n,p,q):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q)};
k.ka=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){return this.h.ka?this.h.ka(a,b,c,d,e,f,g,h,l,m,n,p,q,r):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r)};k.la=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v){return this.h.la?this.h.la(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v)};k.ma=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w){return this.h.ma?this.h.ma(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w)};
k.na=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z){return this.h.na?this.h.na(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z)};k.oa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A){return this.h.oa?this.h.oa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A)};
k.pa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F){return this.h.pa?this.h.pa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F)};k.qa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F,J){return this.h.qa?this.h.qa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F,J):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F,J)};
k.Kb=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F,J,M){return C.wb?C.wb(this.h,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F,J,M):C.call(null,this.h,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F,J,M)};function Qc(a,b){return ca(a)?new qd(a,b):null==a?null:Eb(a,b)}function rd(a){var b=null!=a;return(b?null!=a?a.g&131072||a.Wc||(a.g?0:Qa(Cb,a)):Qa(Cb,a):b)?Db(a):null}function sd(a){return null==a||Pa(H(a))}function td(a){return null==a?!1:null!=a?a.g&4096||a.Cd?!0:a.g?!1:Qa(wb,a):Qa(wb,a)}
function ud(a){return null!=a?a.g&16777216||a.Bd?!0:a.g?!1:Qa(Mb,a):Qa(Mb,a)}function vd(a){return null==a?!1:null!=a?a.g&1024||a.Uc?!0:a.g?!1:Qa(rb,a):Qa(rb,a)}function wd(a){return null!=a?a.g&16384||a.Dd?!0:a.g?!1:Qa(yb,a):Qa(yb,a)}xd;yd;function zd(a){return null!=a?a.C&512||a.wd?!0:!1:!1}function Ad(a){var b=[];la(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}function Bd(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var Cd={};
function Dd(a){return null==a?!1:null!=a?a.g&64||a.F?!0:a.g?!1:Qa(hb,a):Qa(hb,a)}function Ed(a){return null==a?!1:!1===a?!1:!0}function Fd(a,b){return D.c(a,b,Cd)===Cd?!1:!0}function Gd(a,b){var c;if(c=null!=a)c=null!=a?a.g&512||a.vd?!0:a.g?!1:Qa(nb,a):Qa(nb,a);return c&&Fd(a,b)?new Q(null,2,5,S,[b,D.a(a,b)],null):null}
function sc(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if("number"===typeof a){if("number"===typeof b)return sa(a,b);throw Error([B("Cannot compare "),B(a),B(" to "),B(b)].join(""));}if(null!=a?a.C&2048||a.Ib||(a.C?0:Qa(Yb,a)):Qa(Yb,a))return Zb(a,b);if("string"!==typeof a&&!Oa(a)&&!0!==a&&!1!==a||(null==a?null:a.constructor)!==(null==b?null:b.constructor))throw Error([B("Cannot compare "),B(a),B(" to "),B(b)].join(""));return sa(a,b)}
function Hd(a,b){var c=O(a),d=O(b);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=sc(ld(a,d),ld(b,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}function Id(a){return rc.a(a,sc)?sc:function(b,c){var d=a.a?a.a(b,c):a.call(null,b,c);return"number"===typeof d?d:x(d)?-1:x(a.a?a.a(c,b):a.call(null,c,b))?1:0}}Jd;
var fd=function fd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return fd.a(arguments[0],arguments[1]);case 3:return fd.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};fd.a=function(a,b){var c=H(b);if(c){var d=I(c),c=K(c);return Za.c?Za.c(a,d,c):Za.call(null,a,d,c)}return a.l?a.l():a.call(null)};
fd.c=function(a,b,c){for(c=H(c);;)if(c){var d=I(c);b=a.a?a.a(b,d):a.call(null,b,d);if(Tc(b))return Ab(b);c=K(c)}else return b};fd.w=3;Kd;var Za=function Za(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Za.a(arguments[0],arguments[1]);case 3:return Za.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};
Za.a=function(a,b){return null!=b&&(b.g&524288||b.Yc)?b.ea(null,a):Oa(b)?Wc(b,a):"string"===typeof b?Wc(b,a):Qa(Fb,b)?Gb.a(b,a):fd.a(a,b)};Za.c=function(a,b,c){return null!=c&&(c.g&524288||c.Yc)?c.fa(null,a,b):Oa(c)?Xc(c,a,b):"string"===typeof c?Xc(c,a,b):Qa(Fb,c)?Gb.c(c,a,b):fd.c(a,b,c)};Za.w=3;function Ld(a){return a}function Md(a,b,c,d){a=a.b?a.b(b):a.call(null,b);c=Za.c(a,c,d);return a.b?a.b(c):a.call(null,c)}
var Nd=function Nd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Nd.l();case 1:return Nd.b(arguments[0]);case 2:return Nd.a(arguments[0],arguments[1]);default:return Nd.i(arguments[0],arguments[1],new Bc(c.slice(2),0))}};Nd.l=function(){return 0};Nd.b=function(a){return a};Nd.a=function(a,b){return a+b};Nd.i=function(a,b,c){return Za.c(Nd,a+b,c)};Nd.B=function(a){var b=I(a),c=K(a);a=I(c);c=K(c);return Nd.i(b,a,c)};Nd.w=2;
var Od=function Od(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Od.b(arguments[0]);case 2:return Od.a(arguments[0],arguments[1]);default:return Od.i(arguments[0],arguments[1],new Bc(c.slice(2),0))}};Od.b=function(a){return-a};Od.a=function(a,b){return a-b};Od.i=function(a,b,c){return Za.c(Od,a-b,c)};Od.B=function(a){var b=I(a),c=K(a);a=I(c);c=K(c);return Od.i(b,a,c)};Od.w=2;
var Pd=function Pd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Pd.l();case 1:return Pd.b(arguments[0]);case 2:return Pd.a(arguments[0],arguments[1]);default:return Pd.i(arguments[0],arguments[1],new Bc(c.slice(2),0))}};Pd.l=function(){return 1};Pd.b=function(a){return a};Pd.a=function(a,b){return a*b};Pd.i=function(a,b,c){return Za.c(Pd,a*b,c)};Pd.B=function(a){var b=I(a),c=K(a);a=I(c);c=K(c);return Pd.i(b,a,c)};Pd.w=2;ua.Jd;
var Qd=function Qd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Qd.b(arguments[0]);case 2:return Qd.a(arguments[0],arguments[1]);default:return Qd.i(arguments[0],arguments[1],new Bc(c.slice(2),0))}};Qd.b=function(a){return 1/a};Qd.a=function(a,b){return a/b};Qd.i=function(a,b,c){return Za.c(Qd,a/b,c)};Qd.B=function(a){var b=I(a),c=K(a);a=I(c);c=K(c);return Qd.i(b,a,c)};Qd.w=2;function Rd(a){return a-1}
var Sd=function Sd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Sd.b(arguments[0]);case 2:return Sd.a(arguments[0],arguments[1]);default:return Sd.i(arguments[0],arguments[1],new Bc(c.slice(2),0))}};Sd.b=function(a){return a};Sd.a=function(a,b){return a>b?a:b};Sd.i=function(a,b,c){return Za.c(Sd,a>b?a:b,c)};Sd.B=function(a){var b=I(a),c=K(a);a=I(c);c=K(c);return Sd.i(b,a,c)};Sd.w=2;
var Td=function Td(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Td.b(arguments[0]);case 2:return Td.a(arguments[0],arguments[1]);default:return Td.i(arguments[0],arguments[1],new Bc(c.slice(2),0))}};Td.b=function(a){return a};Td.a=function(a,b){return a<b?a:b};Td.i=function(a,b,c){return Za.c(Td,a<b?a:b,c)};Td.B=function(a){var b=I(a),c=K(a);a=I(c);c=K(c);return Td.i(b,a,c)};Td.w=2;Ud;function Ud(a,b){return(a%b+b)%b}
function Vd(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function Wd(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function Xd(a,b){for(var c=b,d=H(a);;)if(d&&0<c)--c,d=K(d);else return d}var B=function B(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return B.l();case 1:return B.b(arguments[0]);default:return B.i(arguments[0],new Bc(c.slice(1),0))}};B.l=function(){return""};
B.b=function(a){return null==a?"":""+a};B.i=function(a,b){for(var c=new pa(""+B(a)),d=b;;)if(x(d))c=c.append(""+B(I(d))),d=K(d);else return c.toString()};B.B=function(a){var b=I(a);a=K(a);return B.i(b,a)};B.w=1;T;Yd;function Pc(a,b){var c;if(ud(b))if(bd(a)&&bd(b)&&O(a)!==O(b))c=!1;else a:{c=H(a);for(var d=H(b);;){if(null==c){c=null==d;break a}if(null!=d&&rc.a(I(c),I(d)))c=K(c),d=K(d);else{c=!1;break a}}}else c=null;return Ed(c)}
function Zc(a){if(H(a)){var b=wc(I(a));for(a=K(a);;){if(null==a)return b;b=xc(b,wc(I(a)));a=K(a)}}else return 0}Zd;$d;function ae(a){var b=0;for(a=H(a);;)if(a){var c=I(a),b=(b+(wc(Zd.b?Zd.b(c):Zd.call(null,c))^wc($d.b?$d.b(c):$d.call(null,c))))%4503599627370496;a=K(a)}else return b}Yd;be;ce;function ad(a,b,c,d,e){this.v=a;this.first=b;this.Ca=c;this.count=d;this.u=e;this.g=65937646;this.C=8192}k=ad.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.O=function(){return this.v};
k.wa=function(){return 1===this.count?null:this.Ca};k.Z=function(){return this.count};k.jb=function(){return this.first};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.da=function(){return Eb(Ec,this.v)};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){return this.first};k.xa=function(){return 1===this.count?Ec:this.Ca};k.V=function(){return this};
k.P=function(a,b){return new ad(b,this.first,this.Ca,this.count,this.u)};k.X=function(a,b){return new ad(this.v,b,this,this.count+1,null)};function de(a){return null!=a?a.g&33554432||a.zd?!0:a.g?!1:Qa(Nb,a):Qa(Nb,a)}ad.prototype[Wa]=function(){return Gc(this)};function ee(a){this.v=a;this.g=65937614;this.C=8192}k=ee.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.O=function(){return this.v};k.wa=function(){return null};k.Z=function(){return 0};k.jb=function(){return null};
k.T=function(){return Lc};k.D=function(a,b){return de(b)||ud(b)?null==H(b):!1};k.da=function(){return this};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){return null};k.xa=function(){return Ec};k.V=function(){return null};k.P=function(a,b){return new ee(b)};k.X=function(a,b){return new ad(this.v,b,null,1,null)};var Ec=new ee(null);ee.prototype[Wa]=function(){return Gc(this)};
function fe(a){return(null!=a?a.g&134217728||a.Ad||(a.g?0:Qa(Ob,a)):Qa(Ob,a))?Pb(a):Za.c(id,Ec,a)}var pc=function pc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return pc.i(0<c.length?new Bc(c.slice(0),0):null)};pc.i=function(a){var b;if(a instanceof Bc&&0===a.s)b=a.f;else a:for(b=[];;)if(null!=a)b.push(a.ta(null)),a=a.wa(null);else break a;a=b.length;for(var c=Ec;;)if(0<a){var d=a-1,c=c.X(null,b[a-1]);a=d}else return c};pc.w=0;pc.B=function(a){return pc.i(H(a))};
function ge(a,b,c,d){this.v=a;this.first=b;this.Ca=c;this.u=d;this.g=65929452;this.C=8192}k=ge.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.O=function(){return this.v};k.wa=function(){return null==this.Ca?null:H(this.Ca)};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.da=function(){return Qc(Ec,this.v)};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){return this.first};
k.xa=function(){return null==this.Ca?Ec:this.Ca};k.V=function(){return this};k.P=function(a,b){return new ge(b,this.first,this.Ca,this.u)};k.X=function(a,b){return new ge(null,b,this,this.u)};ge.prototype[Wa]=function(){return Gc(this)};function N(a,b){var c=null==b;return(c?c:null!=b&&(b.g&64||b.F))?new ge(null,a,b,null):new ge(null,a,H(b),null)}
function he(a,b){if(a.Ha===b.Ha)return 0;var c=Pa(a.Ba);if(x(c?b.Ba:c))return-1;if(x(a.Ba)){if(Pa(b.Ba))return 1;c=sa(a.Ba,b.Ba);return 0===c?sa(a.name,b.name):c}return sa(a.name,b.name)}function y(a,b,c,d){this.Ba=a;this.name=b;this.Ha=c;this.tb=d;this.g=2153775105;this.C=4096}k=y.prototype;k.toString=function(){return[B(":"),B(this.Ha)].join("")};k.equiv=function(a){return this.D(null,a)};k.D=function(a,b){return b instanceof y?this.Ha===b.Ha:!1};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return D.a(c,this);case 3:return D.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return D.a(c,this)};a.c=function(a,c,d){return D.c(c,this,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Xa(b)))};k.b=function(a){return D.a(a,this)};k.a=function(a,b){return D.c(a,this,b)};
k.T=function(){var a=this.tb;return null!=a?a:this.tb=a=xc(oc(this.name),vc(this.Ba))+2654435769|0};k.Ob=function(){return this.name};k.Pb=function(){return this.Ba};k.M=function(a,b){return Qb(b,[B(":"),B(this.Ha)].join(""))};function U(a,b){return a===b?!0:a instanceof y&&b instanceof y?a.Ha===b.Ha:!1}
var ie=function ie(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ie.b(arguments[0]);case 2:return ie.a(arguments[0],arguments[1]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};
ie.b=function(a){if(a instanceof y)return a;if(a instanceof qc){var b;if(null!=a&&(a.C&4096||a.Xc))b=a.Pb(null);else throw Error([B("Doesn't support namespace: "),B(a)].join(""));return new y(b,Yd.b?Yd.b(a):Yd.call(null,a),a.$a,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new y(b[0],b[1],a,null):new y(null,b[0],a,null)):null};ie.a=function(a,b){return new y(a,b,[B(x(a)?[B(a),B("/")].join(""):null),B(b)].join(""),null)};ie.w=2;
function je(a,b,c,d){this.v=a;this.Cb=b;this.J=c;this.u=d;this.g=32374988;this.C=0}k=je.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};function ke(a){null!=a.Cb&&(a.J=a.Cb.l?a.Cb.l():a.Cb.call(null),a.Cb=null);return a.J}k.O=function(){return this.v};k.wa=function(){Lb(this);return null==this.J?null:K(this.J)};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.da=function(){return Qc(Ec,this.v)};
k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){Lb(this);return null==this.J?null:I(this.J)};k.xa=function(){Lb(this);return null!=this.J?Dc(this.J):Ec};k.V=function(){ke(this);if(null==this.J)return null;for(var a=this.J;;)if(a instanceof je)a=ke(a);else return this.J=a,H(this.J)};k.P=function(a,b){return new je(b,this.Cb,this.J,this.u)};k.X=function(a,b){return N(b,this)};je.prototype[Wa]=function(){return Gc(this)};le;
function me(a,b){this.L=a;this.end=b;this.g=2;this.C=0}me.prototype.add=function(a){this.L[this.end]=a;return this.end+=1};me.prototype.U=function(){var a=new le(this.L,0,this.end);this.L=null;return a};me.prototype.Z=function(){return this.end};function ne(a){return new me(Array(a),0)}function le(a,b,c){this.f=a;this.ua=b;this.end=c;this.g=524306;this.C=0}k=le.prototype;k.Z=function(){return this.end-this.ua};k.ca=function(a,b){return this.f[this.ua+b]};
k.Ea=function(a,b,c){return 0<=b&&b<this.end-this.ua?this.f[this.ua+b]:c};k.wc=function(){if(this.ua===this.end)throw Error("-drop-first of empty chunk");return new le(this.f,this.ua+1,this.end)};k.ea=function(a,b){return Yc(this.f,b,this.f[this.ua],this.ua+1)};k.fa=function(a,b,c){return Yc(this.f,b,c,this.ua)};function xd(a,b,c,d){this.U=a;this.Wa=b;this.v=c;this.u=d;this.g=31850732;this.C=1536}k=xd.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};
k.O=function(){return this.v};k.wa=function(){if(1<bb(this.U))return new xd($b(this.U),this.Wa,this.v,null);var a=Lb(this.Wa);return null==a?null:a};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.da=function(){return Qc(Ec,this.v)};k.ta=function(){return gb.a(this.U,0)};k.xa=function(){return 1<bb(this.U)?new xd($b(this.U),this.Wa,this.v,null):null==this.Wa?Ec:this.Wa};k.V=function(){return this};k.nc=function(){return this.U};
k.oc=function(){return null==this.Wa?Ec:this.Wa};k.P=function(a,b){return new xd(this.U,this.Wa,b,this.u)};k.X=function(a,b){return N(b,this)};k.mc=function(){return null==this.Wa?null:this.Wa};xd.prototype[Wa]=function(){return Gc(this)};function oe(a,b){return 0===bb(a)?b:new xd(a,b,null,null)}function pe(a,b){a.add(b)}function be(a){return ac(a)}function ce(a){return bc(a)}function Jd(a){for(var b=[];;)if(H(a))b.push(I(a)),a=K(a);else return b}
function qe(a){if("number"===typeof a)a:{var b=Array(a);if(Dd(null))for(var c=0,d=H(null);;)if(d&&c<a)b[c]=I(d),c+=1,d=K(d);else{a=b;break a}else{for(c=0;;)if(c<a)b[c]=null,c+=1;else break;a=b}}else a=La.b(a);return a}function re(a,b){if(bd(a))return O(a);for(var c=a,d=b,e=0;;)if(0<d&&H(c))c=K(c),--d,e+=1;else return e}
var se=function se(b){return null==b?null:null==K(b)?H(I(b)):N(I(b),se(K(b)))},te=function te(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return te.l();case 1:return te.b(arguments[0]);case 2:return te.a(arguments[0],arguments[1]);default:return te.i(arguments[0],arguments[1],new Bc(c.slice(2),0))}};te.l=function(){return new je(null,function(){return null},null,null)};te.b=function(a){return new je(null,function(){return a},null,null)};
te.a=function(a,b){return new je(null,function(){var c=H(a);return c?zd(c)?oe(ac(c),te.a(bc(c),b)):N(I(c),te.a(Dc(c),b)):b},null,null)};te.i=function(a,b,c){return function e(a,b){return new je(null,function(){var c=H(a);return c?zd(c)?oe(ac(c),e(bc(c),b)):N(I(c),e(Dc(c),b)):x(b)?e(I(b),K(b)):null},null,null)}(te.a(a,b),c)};te.B=function(a){var b=I(a),c=K(a);a=I(c);c=K(c);return te.i(b,a,c)};te.w=2;function ue(a){return Vb(a)}
var ve=function ve(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return ve.l();case 1:return ve.b(arguments[0]);case 2:return ve.a(arguments[0],arguments[1]);default:return ve.i(arguments[0],arguments[1],new Bc(c.slice(2),0))}};ve.l=function(){return Tb(jd)};ve.b=function(a){return a};ve.a=function(a,b){return Ub(a,b)};ve.i=function(a,b,c){for(;;)if(a=Ub(a,b),x(c))b=I(c),c=K(c);else return a};
ve.B=function(a){var b=I(a),c=K(a);a=I(c);c=K(c);return ve.i(b,a,c)};ve.w=2;function we(a,b,c){return Wb(a,b,c)}
function xe(a,b,c){var d=H(c);if(0===b)return a.l?a.l():a.call(null);c=ib(d);var e=jb(d);if(1===b)return a.b?a.b(c):a.b?a.b(c):a.call(null,c);var d=ib(e),f=jb(e);if(2===b)return a.a?a.a(c,d):a.a?a.a(c,d):a.call(null,c,d);var e=ib(f),g=jb(f);if(3===b)return a.c?a.c(c,d,e):a.c?a.c(c,d,e):a.call(null,c,d,e);var f=ib(g),h=jb(g);if(4===b)return a.m?a.m(c,d,e,f):a.m?a.m(c,d,e,f):a.call(null,c,d,e,f);var g=ib(h),l=jb(h);if(5===b)return a.A?a.A(c,d,e,f,g):a.A?a.A(c,d,e,f,g):a.call(null,c,d,e,f,g);var h=ib(l),
m=jb(l);if(6===b)return a.Y?a.Y(c,d,e,f,g,h):a.Y?a.Y(c,d,e,f,g,h):a.call(null,c,d,e,f,g,h);var l=ib(m),n=jb(m);if(7===b)return a.ba?a.ba(c,d,e,f,g,h,l):a.ba?a.ba(c,d,e,f,g,h,l):a.call(null,c,d,e,f,g,h,l);var m=ib(n),p=jb(n);if(8===b)return a.ra?a.ra(c,d,e,f,g,h,l,m):a.ra?a.ra(c,d,e,f,g,h,l,m):a.call(null,c,d,e,f,g,h,l,m);var n=ib(p),q=jb(p);if(9===b)return a.sa?a.sa(c,d,e,f,g,h,l,m,n):a.sa?a.sa(c,d,e,f,g,h,l,m,n):a.call(null,c,d,e,f,g,h,l,m,n);var p=ib(q),r=jb(q);if(10===b)return a.ga?a.ga(c,d,e,
f,g,h,l,m,n,p):a.ga?a.ga(c,d,e,f,g,h,l,m,n,p):a.call(null,c,d,e,f,g,h,l,m,n,p);var q=ib(r),v=jb(r);if(11===b)return a.ha?a.ha(c,d,e,f,g,h,l,m,n,p,q):a.ha?a.ha(c,d,e,f,g,h,l,m,n,p,q):a.call(null,c,d,e,f,g,h,l,m,n,p,q);var r=ib(v),w=jb(v);if(12===b)return a.ia?a.ia(c,d,e,f,g,h,l,m,n,p,q,r):a.ia?a.ia(c,d,e,f,g,h,l,m,n,p,q,r):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r);var v=ib(w),z=jb(w);if(13===b)return a.ja?a.ja(c,d,e,f,g,h,l,m,n,p,q,r,v):a.ja?a.ja(c,d,e,f,g,h,l,m,n,p,q,r,v):a.call(null,c,d,e,f,g,h,l,m,n,
p,q,r,v);var w=ib(z),A=jb(z);if(14===b)return a.ka?a.ka(c,d,e,f,g,h,l,m,n,p,q,r,v,w):a.ka?a.ka(c,d,e,f,g,h,l,m,n,p,q,r,v,w):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,v,w);var z=ib(A),F=jb(A);if(15===b)return a.la?a.la(c,d,e,f,g,h,l,m,n,p,q,r,v,w,z):a.la?a.la(c,d,e,f,g,h,l,m,n,p,q,r,v,w,z):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z);var A=ib(F),J=jb(F);if(16===b)return a.ma?a.ma(c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A):a.ma?a.ma(c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A);var F=
ib(J),M=jb(J);if(17===b)return a.na?a.na(c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F):a.na?a.na(c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F);var J=ib(M),Ba=jb(M);if(18===b)return a.oa?a.oa(c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F,J):a.oa?a.oa(c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F,J):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F,J);M=ib(Ba);Ba=jb(Ba);if(19===b)return a.pa?a.pa(c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F,J,M):a.pa?a.pa(c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F,J,M):a.call(null,c,d,e,
f,g,h,l,m,n,p,q,r,v,w,z,A,F,J,M);var E=ib(Ba);jb(Ba);if(20===b)return a.qa?a.qa(c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F,J,M,E):a.qa?a.qa(c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F,J,M,E):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F,J,M,E);throw Error("Only up to 20 arguments supported on functions");}
var C=function C(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return C.a(arguments[0],arguments[1]);case 3:return C.c(arguments[0],arguments[1],arguments[2]);case 4:return C.m(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return C.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return C.i(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new Bc(c.slice(5),0))}};
C.a=function(a,b){var c=a.w;if(a.B){var d=re(b,c+1);return d<=c?xe(a,d,b):a.B(b)}return a.apply(a,Jd(b))};C.c=function(a,b,c){b=N(b,c);c=a.w;if(a.B){var d=re(b,c+1);return d<=c?xe(a,d,b):a.B(b)}return a.apply(a,Jd(b))};C.m=function(a,b,c,d){b=N(b,N(c,d));c=a.w;return a.B?(d=re(b,c+1),d<=c?xe(a,d,b):a.B(b)):a.apply(a,Jd(b))};C.A=function(a,b,c,d,e){b=N(b,N(c,N(d,e)));c=a.w;return a.B?(d=re(b,c+1),d<=c?xe(a,d,b):a.B(b)):a.apply(a,Jd(b))};
C.i=function(a,b,c,d,e,f){b=N(b,N(c,N(d,N(e,se(f)))));c=a.w;return a.B?(d=re(b,c+1),d<=c?xe(a,d,b):a.B(b)):a.apply(a,Jd(b))};C.B=function(a){var b=I(a),c=K(a);a=I(c);var d=K(c),c=I(d),e=K(d),d=I(e),f=K(e),e=I(f),f=K(f);return C.i(b,a,c,d,e,f)};C.w=5;function ye(a){return H(a)?a:null}
var ze=function ze(){"undefined"===typeof wa&&(wa=function(b,c){this.od=b;this.nd=c;this.g=393216;this.C=0},wa.prototype.P=function(b,c){return new wa(this.od,c)},wa.prototype.O=function(){return this.nd},wa.prototype.ya=function(){return!1},wa.prototype.next=function(){return Error("No such element")},wa.prototype.remove=function(){return Error("Unsupported operation")},wa.ic=function(){return new Q(null,2,5,S,[Qc(Ae,new u(null,1,[Be,pc(Ce,pc(jd))],null)),ua.Id],null)},wa.xb=!0,wa.eb="cljs.core/t_cljs$core23323",
wa.Tb=function(b,c){return Qb(c,"cljs.core/t_cljs$core23323")});return new wa(ze,De)};Ee;function Ee(a,b,c,d){this.Fb=a;this.first=b;this.Ca=c;this.v=d;this.g=31719628;this.C=0}k=Ee.prototype;k.P=function(a,b){return new Ee(this.Fb,this.first,this.Ca,b)};k.X=function(a,b){return N(b,Lb(this))};k.da=function(){return Ec};k.D=function(a,b){return null!=Lb(this)?Pc(this,b):ud(b)&&null==H(b)};k.T=function(){return Kc(this)};k.V=function(){null!=this.Fb&&this.Fb.step(this);return null==this.Ca?null:this};
k.ta=function(){null!=this.Fb&&Lb(this);return null==this.Ca?null:this.first};k.xa=function(){null!=this.Fb&&Lb(this);return null==this.Ca?Ec:this.Ca};k.wa=function(){null!=this.Fb&&Lb(this);return null==this.Ca?null:Lb(this.Ca)};Ee.prototype[Wa]=function(){return Gc(this)};function Fe(a,b){for(;;){if(null==H(b))return!0;var c;c=I(b);c=a.b?a.b(c):a.call(null,c);if(x(c)){c=a;var d=K(b);a=c;b=d}else return!1}}
function Ge(a,b){for(;;)if(H(b)){var c;c=I(b);c=a.b?a.b(c):a.call(null,c);if(x(c))return c;c=a;var d=K(b);a=c;b=d}else return null}
function He(a){return function(){function b(b,c){return Pa(a.a?a.a(b,c):a.call(null,b,c))}function c(b){return Pa(a.b?a.b(b):a.call(null,b))}function d(){return Pa(a.l?a.l():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new Bc(g,0)}return c.call(this,a,d,f)}function c(b,d,e){return Pa(C.m(a,b,d,e))}b.w=2;b.B=function(a){var b=I(a);a=K(a);var d=I(a);a=Dc(a);return c(b,d,a)};b.i=
c;return b}(),e=function(a,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var m=null;if(2<arguments.length){for(var m=0,n=Array(arguments.length-2);m<n.length;)n[m]=arguments[m+2],++m;m=new Bc(n,0)}return f.i(a,e,m)}throw Error("Invalid arity: "+arguments.length);};e.w=2;e.B=f.B;e.l=d;e.b=c;e.a=b;e.i=f.i;return e}()}
function Ie(a){return function(){function b(b){if(0<arguments.length)for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;return a}b.w=0;b.B=function(b){H(b);return a};b.i=function(){return a};return b}()}
var Je=function Je(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Je.l();case 1:return Je.b(arguments[0]);case 2:return Je.a(arguments[0],arguments[1]);case 3:return Je.c(arguments[0],arguments[1],arguments[2]);default:return Je.i(arguments[0],arguments[1],arguments[2],new Bc(c.slice(3),0))}};Je.l=function(){return Ld};Je.b=function(a){return a};
Je.a=function(a,b){return function(){function c(c,d,e){c=b.c?b.c(c,d,e):b.call(null,c,d,e);return a.b?a.b(c):a.call(null,c)}function d(c,d){var e=b.a?b.a(c,d):b.call(null,c,d);return a.b?a.b(e):a.call(null,e)}function e(c){c=b.b?b.b(c):b.call(null,c);return a.b?a.b(c):a.call(null,c)}function f(){var c=b.l?b.l():b.call(null);return a.b?a.b(c):a.call(null,c)}var g=null,h=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+
3],++g;g=new Bc(h,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){c=C.A(b,c,e,f,g);return a.b?a.b(c):a.call(null,c)}c.w=3;c.B=function(a){var b=I(a);a=K(a);var c=I(a);a=K(a);var e=I(a);a=Dc(a);return d(b,c,e,a)};c.i=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+
3],++q;q=new Bc(r,0)}return h.i(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.B=h.B;g.l=f;g.b=e;g.a=d;g.c=c;g.i=h.i;return g}()};
Je.c=function(a,b,c){return function(){function d(d,e,f){d=c.c?c.c(d,e,f):c.call(null,d,e,f);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}function e(d,e){var f;f=c.a?c.a(d,e):c.call(null,d,e);f=b.b?b.b(f):b.call(null,f);return a.b?a.b(f):a.call(null,f)}function f(d){d=c.b?c.b(d):c.call(null,d);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}function g(){var d;d=c.l?c.l():c.call(null);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}var h=null,l=function(){function d(a,
b,c,f){var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;g=new Bc(h,0)}return e.call(this,a,b,c,g)}function e(d,f,g,h){d=C.A(c,d,f,g,h);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}d.w=3;d.B=function(a){var b=I(a);a=K(a);var c=I(a);a=K(a);var d=I(a);a=Dc(a);return e(b,c,d,a)};d.i=e;return d}(),h=function(a,b,c,h){switch(arguments.length){case 0:return g.call(this);case 1:return f.call(this,a);case 2:return e.call(this,a,b);
case 3:return d.call(this,a,b,c);default:var r=null;if(3<arguments.length){for(var r=0,v=Array(arguments.length-3);r<v.length;)v[r]=arguments[r+3],++r;r=new Bc(v,0)}return l.i(a,b,c,r)}throw Error("Invalid arity: "+arguments.length);};h.w=3;h.B=l.B;h.l=g;h.b=f;h.a=e;h.c=d;h.i=l.i;return h}()};
Je.i=function(a,b,c,d){return function(a){return function(){function b(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new Bc(e,0)}return c.call(this,d)}function c(b){b=C.a(I(a),b);for(var d=K(a);;)if(d)b=I(d).call(null,b),d=K(d);else return b}b.w=0;b.B=function(a){a=H(a);return c(a)};b.i=c;return b}()}(fe(N(a,N(b,N(c,d)))))};Je.B=function(a){var b=I(a),c=K(a);a=I(c);var d=K(c),c=I(d),d=K(d);return Je.i(b,a,c,d)};Je.w=3;
function Ke(a,b){return function(){function c(c,d,e){return a.m?a.m(b,c,d,e):a.call(null,b,c,d,e)}function d(c,d){return a.c?a.c(b,c,d):a.call(null,b,c,d)}function e(c){return a.a?a.a(b,c):a.call(null,b,c)}function f(){return a.b?a.b(b):a.call(null,b)}var g=null,h=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;g=new Bc(h,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){return C.i(a,b,c,e,f,G([g],0))}c.w=
3;c.B=function(a){var b=I(a);a=K(a);var c=I(a);a=K(a);var e=I(a);a=Dc(a);return d(b,c,e,a)};c.i=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+3],++q;q=new Bc(r,0)}return h.i(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.B=h.B;g.l=f;g.b=
e;g.a=d;g.c=c;g.i=h.i;return g}()}Le;function Me(a,b){return function d(b,f){return new je(null,function(){var g=H(f);if(g){if(zd(g)){for(var h=ac(g),l=O(h),m=ne(l),n=0;;)if(n<l)pe(m,function(){var d=b+n,f=gb.a(h,n);return a.a?a.a(d,f):a.call(null,d,f)}()),n+=1;else break;return oe(m.U(),d(b+l,bc(g)))}return N(function(){var d=I(g);return a.a?a.a(b,d):a.call(null,b,d)}(),d(b+1,Dc(g)))}return null},null,null)}(0,b)}function Ne(a,b,c,d){this.state=a;this.v=b;this.Nc=d;this.C=16386;this.g=6455296}
k=Ne.prototype;k.equiv=function(a){return this.D(null,a)};k.D=function(a,b){return this===b};k.Jb=function(){return this.state};k.O=function(){return this.v};k.Ac=function(a,b,c){a=H(this.Nc);for(var d=null,e=0,f=0;;)if(f<e){var g=d.ca(null,f),h=P(g,0),g=P(g,1);g.m?g.m(h,this,b,c):g.call(null,h,this,b,c);f+=1}else if(a=H(a))zd(a)?(d=ac(a),a=bc(a),h=d,e=O(d),d=h):(d=I(a),h=P(d,0),g=P(d,1),g.m?g.m(h,this,b,c):g.call(null,h,this,b,c),a=K(a),d=null,e=0),f=0;else return null};
k.T=function(){return this[da]||(this[da]=++ea)};var V=function V(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return V.b(arguments[0]);default:return V.i(arguments[0],new Bc(c.slice(1),0))}};V.b=function(a){return new Ne(a,null,0,null)};V.i=function(a,b){var c=null!=b&&(b.g&64||b.F)?C.a(Oc,b):b,d=D.a(c,Ha);D.a(c,Oe);return new Ne(a,d,0,null)};V.B=function(a){var b=I(a);a=K(a);return V.i(b,a)};V.w=1;Pe;
function Qe(a,b){if(a instanceof Ne){var c=a.state;a.state=b;null!=a.Nc&&Sb(a,c,b);return b}return fc(a,b)}var Re=function Re(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Re.a(arguments[0],arguments[1]);case 3:return Re.c(arguments[0],arguments[1],arguments[2]);case 4:return Re.m(arguments[0],arguments[1],arguments[2],arguments[3]);default:return Re.i(arguments[0],arguments[1],arguments[2],arguments[3],new Bc(c.slice(4),0))}};
Re.a=function(a,b){var c;a instanceof Ne?(c=a.state,c=b.b?b.b(c):b.call(null,c),c=Qe(a,c)):c=gc.a(a,b);return c};Re.c=function(a,b,c){if(a instanceof Ne){var d=a.state;b=b.a?b.a(d,c):b.call(null,d,c);a=Qe(a,b)}else a=gc.c(a,b,c);return a};Re.m=function(a,b,c,d){if(a instanceof Ne){var e=a.state;b=b.c?b.c(e,c,d):b.call(null,e,c,d);a=Qe(a,b)}else a=gc.m(a,b,c,d);return a};Re.i=function(a,b,c,d,e){return a instanceof Ne?Qe(a,C.A(b,a.state,c,d,e)):gc.A(a,b,c,d,e)};
Re.B=function(a){var b=I(a),c=K(a);a=I(c);var d=K(c),c=I(d),e=K(d),d=I(e),e=K(e);return Re.i(b,a,c,d,e)};Re.w=4;function Se(a){this.state=a;this.g=32768;this.C=0}Se.prototype.Jb=function(){return this.state};function Le(a){return new Se(a)}
var T=function T(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return T.b(arguments[0]);case 2:return T.a(arguments[0],arguments[1]);case 3:return T.c(arguments[0],arguments[1],arguments[2]);case 4:return T.m(arguments[0],arguments[1],arguments[2],arguments[3]);default:return T.i(arguments[0],arguments[1],arguments[2],arguments[3],new Bc(c.slice(4),0))}};
T.b=function(a){return function(b){return function(){function c(c,d){var e=a.b?a.b(d):a.call(null,d);return b.a?b.a(c,e):b.call(null,c,e)}function d(a){return b.b?b.b(a):b.call(null,a)}function e(){return b.l?b.l():b.call(null)}var f=null,g=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new Bc(g,0)}return d.call(this,a,b,f)}function d(c,e,f){e=C.c(a,e,f);return b.a?b.a(c,e):b.call(null,c,e)}c.w=2;c.B=function(a){var b=
I(a);a=K(a);var c=I(a);a=Dc(a);return d(b,c,a)};c.i=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var n=null;if(2<arguments.length){for(var n=0,p=Array(arguments.length-2);n<p.length;)p[n]=arguments[n+2],++n;n=new Bc(p,0)}return g.i(a,b,n)}throw Error("Invalid arity: "+arguments.length);};f.w=2;f.B=g.B;f.l=e;f.b=d;f.a=c;f.i=g.i;return f}()}};
T.a=function(a,b){return new je(null,function(){var c=H(b);if(c){if(zd(c)){for(var d=ac(c),e=O(d),f=ne(e),g=0;;)if(g<e)pe(f,function(){var b=gb.a(d,g);return a.b?a.b(b):a.call(null,b)}()),g+=1;else break;return oe(f.U(),T.a(a,bc(c)))}return N(function(){var b=I(c);return a.b?a.b(b):a.call(null,b)}(),T.a(a,Dc(c)))}return null},null,null)};
T.c=function(a,b,c){return new je(null,function(){var d=H(b),e=H(c);if(d&&e){var f=N,g;g=I(d);var h=I(e);g=a.a?a.a(g,h):a.call(null,g,h);d=f(g,T.c(a,Dc(d),Dc(e)))}else d=null;return d},null,null)};T.m=function(a,b,c,d){return new je(null,function(){var e=H(b),f=H(c),g=H(d);if(e&&f&&g){var h=N,l;l=I(e);var m=I(f),n=I(g);l=a.c?a.c(l,m,n):a.call(null,l,m,n);e=h(l,T.m(a,Dc(e),Dc(f),Dc(g)))}else e=null;return e},null,null)};
T.i=function(a,b,c,d,e){var f=function h(a){return new je(null,function(){var b=T.a(H,a);return Fe(Ld,b)?N(T.a(I,b),h(T.a(Dc,b))):null},null,null)};return T.a(function(){return function(b){return C.a(a,b)}}(f),f(id.i(e,d,G([c,b],0))))};T.B=function(a){var b=I(a),c=K(a);a=I(c);var d=K(c),c=I(d),e=K(d),d=I(e),e=K(e);return T.i(b,a,c,d,e)};T.w=4;function Te(a,b){return new je(null,function(){if(0<a){var c=H(b);return c?N(I(c),Te(a-1,Dc(c))):null}return null},null,null)}
function Ue(a,b){return new je(null,function(c){return function(){return c(a,b)}}(function(a,b){for(;;){var e=H(b);if(0<a&&e){var f=a-1,e=Dc(e);a=f;b=e}else return e}}),null,null)}function Ve(a){return new je(null,function(){return N(a,Ve(a))},null,null)}function We(a){return new je(null,function(){return N(a.l?a.l():a.call(null),We(a))},null,null)}
var Xe=function Xe(b,c){return N(c,new je(null,function(){return Xe(b,b.b?b.b(c):b.call(null,c))},null,null))},Ye=function Ye(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ye.a(arguments[0],arguments[1]);default:return Ye.i(arguments[0],arguments[1],new Bc(c.slice(2),0))}};Ye.a=function(a,b){return new je(null,function(){var c=H(a),d=H(b);return c&&d?N(I(c),N(I(d),Ye.a(Dc(c),Dc(d)))):null},null,null)};
Ye.i=function(a,b,c){return new je(null,function(){var d=T.a(H,id.i(c,b,G([a],0)));return Fe(Ld,d)?te.a(T.a(I,d),C.a(Ye,T.a(Dc,d))):null},null,null)};Ye.B=function(a){var b=I(a),c=K(a);a=I(c);c=K(c);return Ye.i(b,a,c)};Ye.w=2;function Ze(a){return Ue(1,Ye.a(Ve("L"),a))}$e;
function af(a,b){return new je(null,function(){var c=H(b);if(c){if(zd(c)){for(var d=ac(c),e=O(d),f=ne(e),g=0;;)if(g<e){var h;h=gb.a(d,g);h=a.b?a.b(h):a.call(null,h);x(h)&&(h=gb.a(d,g),f.add(h));g+=1}else break;return oe(f.U(),af(a,bc(c)))}d=I(c);c=Dc(c);return x(a.b?a.b(d):a.call(null,d))?N(d,af(a,c)):af(a,c)}return null},null,null)}
function bf(a){return function c(a){return new je(null,function(){var e=N,f;x(Dd.b?Dd.b(a):Dd.call(null,a))?(f=G([H.b?H.b(a):H.call(null,a)],0),f=C.a(te,C.c(T,c,f))):f=null;return e(a,f)},null,null)}(a)}var cf=function cf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return cf.a(arguments[0],arguments[1]);case 3:return cf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};
cf.a=function(a,b){return null!=a?null!=a&&(a.C&4||a.Rc)?Qc(ue(Za.c(Ub,Tb(a),b)),rd(a)):Za.c(eb,a,b):Za.c(id,Ec,b)};cf.c=function(a,b,c){return null!=a&&(a.C&4||a.Rc)?Qc(ue(Md(b,ve,Tb(a),c)),rd(a)):Md(b,id,a,c)};cf.w=3;function df(a,b){return ue(Za.c(function(b,d){return ve.a(b,a.b?a.b(d):a.call(null,d))},Tb(jd),b))}
function ef(a,b){var c;a:{c=Cd;for(var d=a,e=H(b);;)if(e)if(null!=d?d.g&256||d.yc||(d.g?0:Qa(lb,d)):Qa(lb,d)){d=D.c(d,I(e),c);if(c===d){c=null;break a}e=K(e)}else{c=null;break a}else{c=d;break a}}return c}
var ff=function ff(b,c,d){var e=P(c,0);c=Xd(c,1);return x(c)?nd.c(b,e,ff(D.a(b,e),c,d)):nd.c(b,e,d)},gf=function gf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return gf.c(arguments[0],arguments[1],arguments[2]);case 4:return gf.m(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return gf.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);case 6:return gf.Y(arguments[0],arguments[1],arguments[2],arguments[3],
arguments[4],arguments[5]);default:return gf.i(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],new Bc(c.slice(6),0))}};gf.c=function(a,b,c){var d=P(b,0);b=Xd(b,1);return x(b)?nd.c(a,d,gf.c(D.a(a,d),b,c)):nd.c(a,d,function(){var b=D.a(a,d);return c.b?c.b(b):c.call(null,b)}())};gf.m=function(a,b,c,d){var e=P(b,0);b=Xd(b,1);return x(b)?nd.c(a,e,gf.m(D.a(a,e),b,c,d)):nd.c(a,e,function(){var b=D.a(a,e);return c.a?c.a(b,d):c.call(null,b,d)}())};
gf.A=function(a,b,c,d,e){var f=P(b,0);b=Xd(b,1);return x(b)?nd.c(a,f,gf.A(D.a(a,f),b,c,d,e)):nd.c(a,f,function(){var b=D.a(a,f);return c.c?c.c(b,d,e):c.call(null,b,d,e)}())};gf.Y=function(a,b,c,d,e,f){var g=P(b,0);b=Xd(b,1);return x(b)?nd.c(a,g,gf.Y(D.a(a,g),b,c,d,e,f)):nd.c(a,g,function(){var b=D.a(a,g);return c.m?c.m(b,d,e,f):c.call(null,b,d,e,f)}())};
gf.i=function(a,b,c,d,e,f,g){var h=P(b,0);b=Xd(b,1);return x(b)?nd.c(a,h,C.i(gf,D.a(a,h),b,c,d,G([e,f,g],0))):nd.c(a,h,C.i(c,D.a(a,h),d,e,f,G([g],0)))};gf.B=function(a){var b=I(a),c=K(a);a=I(c);var d=K(c),c=I(d),e=K(d),d=I(e),f=K(e),e=I(f),g=K(f),f=I(g),g=K(g);return gf.i(b,a,c,d,e,f,g)};gf.w=6;function hf(a,b,c){return nd.c(a,b,function(){var d=D.a(a,b);return c.b?c.b(d):c.call(null,d)}())}function jf(a,b,c,d){return nd.c(a,b,function(){var e=D.a(a,b);return c.a?c.a(e,d):c.call(null,e,d)}())}
function kf(a,b,c,d){var e=lf;return nd.c(a,e,function(){var f=D.a(a,e);return b.c?b.c(f,c,d):b.call(null,f,c,d)}())}function mf(a,b){this.W=a;this.f=b}function nf(a){return new mf(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function of(a){a=a.o;return 32>a?0:a-1>>>5<<5}function pf(a,b,c){for(;;){if(0===b)return c;var d=nf(a);d.f[0]=c;c=d;b-=5}}
var qf=function qf(b,c,d,e){var f=new mf(d.W,Xa(d.f)),g=b.o-1>>>c&31;5===c?f.f[g]=e:(d=d.f[g],b=null!=d?qf(b,c-5,d,e):pf(null,c-5,e),f.f[g]=b);return f};function rf(a,b){throw Error([B("No item "),B(a),B(" in vector of length "),B(b)].join(""));}function sf(a,b){if(b>=of(a))return a.R;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.f[b>>>d&31],d=e;else return c.f}function tf(a,b){return 0<=b&&b<a.o?sf(a,b):rf(b,a.o)}
var uf=function uf(b,c,d,e,f){var g=new mf(d.W,Xa(d.f));if(0===c)g.f[e&31]=f;else{var h=e>>>c&31;b=uf(b,c-5,d.f[h],e,f);g.f[h]=b}return g};function vf(a,b,c,d,e,f){this.s=a;this.kc=b;this.f=c;this.Na=d;this.start=e;this.end=f}vf.prototype.ya=function(){return this.s<this.end};vf.prototype.next=function(){32===this.s-this.kc&&(this.f=sf(this.Na,this.s),this.kc+=32);var a=this.f[this.s&31];this.s+=1;return a};wf;xf;yf;L;zf;Af;Bf;
function Q(a,b,c,d,e,f){this.v=a;this.o=b;this.shift=c;this.root=d;this.R=e;this.u=f;this.g=167668511;this.C=8196}k=Q.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.N=function(a,b){return mb.c(this,b,null)};k.I=function(a,b,c){return"number"===typeof b?gb.c(this,b,c):c};
k.Lb=function(a,b,c){a=0;for(var d=c;;)if(a<this.o){var e=sf(this,a);c=e.length;a:for(var f=0;;)if(f<c){var g=f+a,h=e[f],d=b.c?b.c(d,g,h):b.call(null,d,g,h);if(Tc(d)){e=d;break a}f+=1}else{e=d;break a}if(Tc(e))return L.b?L.b(e):L.call(null,e);a+=c;d=e}else return d};k.ca=function(a,b){return tf(this,b)[b&31]};k.Ea=function(a,b,c){return 0<=b&&b<this.o?sf(this,b)[b&31]:c};
k.kb=function(a,b,c){if(0<=b&&b<this.o)return of(this)<=b?(a=Xa(this.R),a[b&31]=c,new Q(this.v,this.o,this.shift,this.root,a,null)):new Q(this.v,this.o,this.shift,uf(this,this.shift,this.root,b,c),this.R,null);if(b===this.o)return eb(this,c);throw Error([B("Index "),B(b),B(" out of bounds  [0,"),B(this.o),B("]")].join(""));};k.Ga=function(){var a=this.o;return new vf(0,0,0<O(this)?sf(this,0):null,this,0,a)};k.O=function(){return this.v};k.Z=function(){return this.o};
k.Mb=function(){return gb.a(this,0)};k.Nb=function(){return gb.a(this,1)};k.jb=function(){return 0<this.o?gb.a(this,this.o-1):null};k.bc=function(){return 0<this.o?new $c(this,this.o-1,null):null};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){if(b instanceof Q)if(this.o===O(b))for(var c=hc(this),d=hc(b);;)if(x(c.ya())){var e=c.next(),f=d.next();if(!rc.a(e,f))return!1}else return!0;else return!1;else return Pc(this,b)};
k.vb=function(){return new yf(this.o,this.shift,wf.b?wf.b(this.root):wf.call(null,this.root),xf.b?xf.b(this.R):xf.call(null,this.R))};k.da=function(){return Qc(jd,this.v)};k.ea=function(a,b){return Uc(this,b)};k.fa=function(a,b,c){a=0;for(var d=c;;)if(a<this.o){var e=sf(this,a);c=e.length;a:for(var f=0;;)if(f<c){var g=e[f],d=b.a?b.a(d,g):b.call(null,d,g);if(Tc(d)){e=d;break a}f+=1}else{e=d;break a}if(Tc(e))return L.b?L.b(e):L.call(null,e);a+=c;d=e}else return d};
k.Oa=function(a,b,c){if("number"===typeof b)return zb(this,b,c);throw Error("Vector's key for assoc must be a number.");};k.V=function(){if(0===this.o)return null;if(32>=this.o)return new Bc(this.R,0);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.f[0];else{a=a.f;break a}}return Bf.m?Bf.m(this,a,0,0):Bf.call(null,this,a,0,0)};k.P=function(a,b){return new Q(b,this.o,this.shift,this.root,this.R,this.u)};
k.X=function(a,b){if(32>this.o-of(this)){for(var c=this.R.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.R[e],e+=1;else break;d[c]=b;return new Q(this.v,this.o+1,this.shift,this.root,d,null)}c=(d=this.o>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=nf(null),d.f[0]=this.root,e=pf(null,this.shift,new mf(null,this.R)),d.f[1]=e):d=qf(this,this.shift,this.root,new mf(null,this.R));return new Q(this.v,this.o+1,c,d,[b],null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.ca(null,c);case 3:return this.Ea(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.ca(null,c)};a.c=function(a,c,d){return this.Ea(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Xa(b)))};k.b=function(a){return this.ca(null,a)};k.a=function(a,b){return this.Ea(null,a,b)};
var S=new mf(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),jd=new Q(null,0,5,S,[],Lc);function Cf(a){var b=a.length;if(32>b)return new Q(null,b,5,S,a,null);for(var c=32,d=(new Q(null,32,5,S,a.slice(0,32),null)).vb(null);;)if(c<b)var e=c+1,d=ve.a(d,a[c]),c=e;else return Vb(d)}Q.prototype[Wa]=function(){return Gc(this)};function Kd(a){return Oa(a)?Cf(a):Vb(Za.c(Ub,Tb(jd),a))}
var Df=function Df(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Df.i(0<c.length?new Bc(c.slice(0),0):null)};Df.i=function(a){return a instanceof Bc&&0===a.s?Cf(a.f):Kd(a)};Df.w=0;Df.B=function(a){return Df.i(H(a))};Ef;function yd(a,b,c,d,e,f){this.Ia=a;this.node=b;this.s=c;this.ua=d;this.v=e;this.u=f;this.g=32375020;this.C=1536}k=yd.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.O=function(){return this.v};
k.wa=function(){if(this.ua+1<this.node.length){var a;a=this.Ia;var b=this.node,c=this.s,d=this.ua+1;a=Bf.m?Bf.m(a,b,c,d):Bf.call(null,a,b,c,d);return null==a?null:a}return cc(this)};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.da=function(){return Qc(jd,this.v)};k.ea=function(a,b){var c;c=this.Ia;var d=this.s+this.ua,e=O(this.Ia);c=Ef.c?Ef.c(c,d,e):Ef.call(null,c,d,e);return Uc(c,b)};
k.fa=function(a,b,c){a=this.Ia;var d=this.s+this.ua,e=O(this.Ia);a=Ef.c?Ef.c(a,d,e):Ef.call(null,a,d,e);return Vc(a,b,c)};k.ta=function(){return this.node[this.ua]};k.xa=function(){if(this.ua+1<this.node.length){var a;a=this.Ia;var b=this.node,c=this.s,d=this.ua+1;a=Bf.m?Bf.m(a,b,c,d):Bf.call(null,a,b,c,d);return null==a?Ec:a}return bc(this)};k.V=function(){return this};k.nc=function(){var a=this.node;return new le(a,this.ua,a.length)};
k.oc=function(){var a=this.s+this.node.length;if(a<bb(this.Ia)){var b=this.Ia,c=sf(this.Ia,a);return Bf.m?Bf.m(b,c,a,0):Bf.call(null,b,c,a,0)}return Ec};k.P=function(a,b){return Bf.A?Bf.A(this.Ia,this.node,this.s,this.ua,b):Bf.call(null,this.Ia,this.node,this.s,this.ua,b)};k.X=function(a,b){return N(b,this)};k.mc=function(){var a=this.s+this.node.length;if(a<bb(this.Ia)){var b=this.Ia,c=sf(this.Ia,a);return Bf.m?Bf.m(b,c,a,0):Bf.call(null,b,c,a,0)}return null};yd.prototype[Wa]=function(){return Gc(this)};
var Bf=function Bf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Bf.c(arguments[0],arguments[1],arguments[2]);case 4:return Bf.m(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Bf.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};Bf.c=function(a,b,c){return new yd(a,tf(a,b),b,c,null,null)};
Bf.m=function(a,b,c,d){return new yd(a,b,c,d,null,null)};Bf.A=function(a,b,c,d,e){return new yd(a,b,c,d,e,null)};Bf.w=5;Ff;function Gf(a,b,c,d,e){this.v=a;this.Na=b;this.start=c;this.end=d;this.u=e;this.g=167666463;this.C=8192}k=Gf.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.N=function(a,b){return mb.c(this,b,null)};k.I=function(a,b,c){return"number"===typeof b?gb.c(this,b,c):c};
k.Lb=function(a,b,c){a=this.start;for(var d=0;;)if(a<this.end){var e=d,f=gb.a(this.Na,a);c=b.c?b.c(c,e,f):b.call(null,c,e,f);if(Tc(c))return L.b?L.b(c):L.call(null,c);d+=1;a+=1}else return c};k.ca=function(a,b){return 0>b||this.end<=this.start+b?rf(b,this.end-this.start):gb.a(this.Na,this.start+b)};k.Ea=function(a,b,c){return 0>b||this.end<=this.start+b?c:gb.c(this.Na,this.start+b,c)};
k.kb=function(a,b,c){var d=this.start+b;a=this.v;c=nd.c(this.Na,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return Ff.A?Ff.A(a,c,b,d,null):Ff.call(null,a,c,b,d,null)};k.O=function(){return this.v};k.Z=function(){return this.end-this.start};k.jb=function(){return gb.a(this.Na,this.end-1)};k.bc=function(){return this.start!==this.end?new $c(this,this.end-this.start-1,null):null};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};
k.da=function(){return Qc(jd,this.v)};k.ea=function(a,b){return Uc(this,b)};k.fa=function(a,b,c){return Vc(this,b,c)};k.Oa=function(a,b,c){if("number"===typeof b)return zb(this,b,c);throw Error("Subvec's key for assoc must be a number.");};k.V=function(){var a=this;return function(b){return function d(e){return e===a.end?null:N(gb.a(a.Na,e),new je(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};
k.P=function(a,b){return Ff.A?Ff.A(b,this.Na,this.start,this.end,this.u):Ff.call(null,b,this.Na,this.start,this.end,this.u)};k.X=function(a,b){var c=this.v,d=zb(this.Na,this.end,b),e=this.start,f=this.end+1;return Ff.A?Ff.A(c,d,e,f,null):Ff.call(null,c,d,e,f,null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.ca(null,c);case 3:return this.Ea(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.ca(null,c)};a.c=function(a,c,d){return this.Ea(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Xa(b)))};k.b=function(a){return this.ca(null,a)};k.a=function(a,b){return this.Ea(null,a,b)};Gf.prototype[Wa]=function(){return Gc(this)};
function Ff(a,b,c,d,e){for(;;)if(b instanceof Gf)c=b.start+c,d=b.start+d,b=b.Na;else{var f=O(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new Gf(a,b,c,d,e)}}var Ef=function Ef(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ef.a(arguments[0],arguments[1]);case 3:return Ef.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};
Ef.a=function(a,b){return Ef.c(a,b,O(a))};Ef.c=function(a,b,c){return Ff(null,a,b,c,null)};Ef.w=3;function Hf(a,b){return a===b.W?b:new mf(a,Xa(b.f))}function wf(a){return new mf({},Xa(a.f))}function xf(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];Bd(a,0,b,0,a.length);return b}
var If=function If(b,c,d,e){d=Hf(b.root.W,d);var f=b.o-1>>>c&31;if(5===c)b=e;else{var g=d.f[f];b=null!=g?If(b,c-5,g,e):pf(b.root.W,c-5,e)}d.f[f]=b;return d};function yf(a,b,c,d){this.o=a;this.shift=b;this.root=c;this.R=d;this.C=88;this.g=275}k=yf.prototype;
k.Rb=function(a,b){if(this.root.W){if(32>this.o-of(this))this.R[this.o&31]=b;else{var c=new mf(this.root.W,this.R),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.R=d;if(this.o>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=pf(this.root.W,this.shift,c);this.root=new mf(this.root.W,d);this.shift=e}else this.root=If(this,this.shift,this.root,c)}this.o+=1;return this}throw Error("conj! after persistent!");};k.Sb=function(){if(this.root.W){this.root.W=null;var a=this.o-of(this),b=Array(a);Bd(this.R,0,b,0,a);return new Q(null,this.o,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
k.Qb=function(a,b,c){if("number"===typeof b)return Xb(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
k.zc=function(a,b,c){var d=this;if(d.root.W){if(0<=b&&b<d.o)return of(this)<=b?d.R[b&31]=c:(a=function(){return function f(a,h){var l=Hf(d.root.W,h);if(0===a)l.f[b&31]=c;else{var m=b>>>a&31,n=f(a-5,l.f[m]);l.f[m]=n}return l}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.o)return Ub(this,c);throw Error([B("Index "),B(b),B(" out of bounds for TransientVector of length"),B(d.o)].join(""));}throw Error("assoc! after persistent!");};
k.Z=function(){if(this.root.W)return this.o;throw Error("count after persistent!");};k.ca=function(a,b){if(this.root.W)return tf(this,b)[b&31];throw Error("nth after persistent!");};k.Ea=function(a,b,c){return 0<=b&&b<this.o?gb.a(this,b):c};k.N=function(a,b){return mb.c(this,b,null)};k.I=function(a,b,c){return"number"===typeof b?gb.c(this,b,c):c};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Xa(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};function Jf(){this.g=2097152;this.C=0}
Jf.prototype.equiv=function(a){return this.D(null,a)};Jf.prototype.D=function(){return!1};var Kf=new Jf;function Lf(a,b){return Ed(vd(b)?O(a)===O(b)?Fe(Ld,T.a(function(a){return rc.a(D.c(b,I(a),Kf),gd(a))},a)):null:null)}function Mf(a,b,c,d,e){this.s=a;this.qd=b;this.uc=c;this.fd=d;this.Kc=e}Mf.prototype.ya=function(){var a=this.s<this.uc;return a?a:this.Kc.ya()};Mf.prototype.next=function(){if(this.s<this.uc){var a=ld(this.fd,this.s);this.s+=1;return new Q(null,2,5,S,[a,mb.a(this.qd,a)],null)}return this.Kc.next()};
Mf.prototype.remove=function(){return Error("Unsupported operation")};function Nf(a){this.J=a}Nf.prototype.next=function(){if(null!=this.J){var a=I(this.J),b=P(a,0),a=P(a,1);this.J=K(this.J);return{value:[b,a],done:!1}}return{value:null,done:!0}};function Of(a){return new Nf(H(a))}function Pf(a){this.J=a}Pf.prototype.next=function(){if(null!=this.J){var a=I(this.J);this.J=K(this.J);return{value:[a,a],done:!1}}return{value:null,done:!0}};
function Qf(a,b){var c;if(b instanceof y)a:{c=a.length;for(var d=b.Ha,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof y&&d===a[e].Ha){c=e;break a}e+=2}}else if("string"==typeof b||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof qc)a:for(c=a.length,d=b.$a,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof qc&&d===a[e].$a){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=
a.length,d=0;;){if(c<=d){c=-1;break a}if(rc.a(b,a[d])){c=d;break a}d+=2}return c}Rf;function Sf(a,b,c){this.f=a;this.s=b;this.Da=c;this.g=32374990;this.C=0}k=Sf.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.O=function(){return this.Da};k.wa=function(){return this.s<this.f.length-2?new Sf(this.f,this.s+2,this.Da):null};k.Z=function(){return(this.f.length-this.s)/2};k.T=function(){return Kc(this)};k.D=function(a,b){return Pc(this,b)};
k.da=function(){return Qc(Ec,this.Da)};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){return new Q(null,2,5,S,[this.f[this.s],this.f[this.s+1]],null)};k.xa=function(){return this.s<this.f.length-2?new Sf(this.f,this.s+2,this.Da):Ec};k.V=function(){return this};k.P=function(a,b){return new Sf(this.f,this.s,b)};k.X=function(a,b){return N(b,this)};Sf.prototype[Wa]=function(){return Gc(this)};Tf;Uf;function Vf(a,b,c){this.f=a;this.s=b;this.o=c}
Vf.prototype.ya=function(){return this.s<this.o};Vf.prototype.next=function(){var a=new Q(null,2,5,S,[this.f[this.s],this.f[this.s+1]],null);this.s+=2;return a};function u(a,b,c,d){this.v=a;this.o=b;this.f=c;this.u=d;this.g=16647951;this.C=8196}k=u.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.keys=function(){return Gc(Tf.b?Tf.b(this):Tf.call(null,this))};k.entries=function(){return Of(H(this))};
k.values=function(){return Gc(Uf.b?Uf.b(this):Uf.call(null,this))};k.has=function(a){return Fd(this,a)};k.get=function(a,b){return this.I(null,a,b)};k.forEach=function(a){for(var b=H(this),c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e),g=P(f,0),f=P(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=H(b))zd(b)?(c=ac(b),b=bc(b),g=c,d=O(c),c=g):(c=I(b),g=P(c,0),f=P(c,1),a.a?a.a(f,g):a.call(null,f,g),b=K(b),c=null,d=0),e=0;else return null};k.N=function(a,b){return mb.c(this,b,null)};
k.I=function(a,b,c){a=Qf(this.f,b);return-1===a?c:this.f[a+1]};k.Lb=function(a,b,c){a=this.f.length;for(var d=0;;)if(d<a){var e=this.f[d],f=this.f[d+1];c=b.c?b.c(c,e,f):b.call(null,c,e,f);if(Tc(c))return L.b?L.b(c):L.call(null,c);d+=2}else return c};k.Ga=function(){return new Vf(this.f,0,2*this.o)};k.O=function(){return this.v};k.Z=function(){return this.o};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Mc(this)};
k.D=function(a,b){if(null!=b&&(b.g&1024||b.Uc)){var c=this.f.length;if(this.o===b.Z(null))for(var d=0;;)if(d<c){var e=b.I(null,this.f[d],Cd);if(e!==Cd)if(rc.a(this.f[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return Lf(this,b)};k.vb=function(){return new Rf({},this.f.length,Xa(this.f))};k.da=function(){return Eb(De,this.v)};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};
k.ib=function(a,b){if(0<=Qf(this.f,b)){var c=this.f.length,d=c-2;if(0===d)return cb(this);for(var d=Array(d),e=0,f=0;;){if(e>=c)return new u(this.v,this.o-1,d,null);rc.a(b,this.f[e])||(d[f]=this.f[e],d[f+1]=this.f[e+1],f+=2);e+=2}}else return this};
k.Oa=function(a,b,c){a=Qf(this.f,b);if(-1===a){if(this.o<Wf){a=this.f;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new u(this.v,this.o+1,e,null)}return Eb(qb(cf.a(Xf,this),b,c),this.v)}if(c===this.f[a+1])return this;b=Xa(this.f);b[a+1]=c;return new u(this.v,this.o,b,null)};k.lc=function(a,b){return-1!==Qf(this.f,b)};k.V=function(){var a=this.f;return 0<=a.length-2?new Sf(a,0,null):null};k.P=function(a,b){return new u(b,this.o,this.f,this.u)};
k.X=function(a,b){if(wd(b))return qb(this,gb.a(b,0),gb.a(b,1));for(var c=this,d=H(b);;){if(null==d)return c;var e=I(d);if(wd(e))c=qb(c,gb.a(e,0),gb.a(e,1)),d=K(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Xa(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};var De=new u(null,0,[],Nc),Wf=8;u.prototype[Wa]=function(){return Gc(this)};
Yf;function Rf(a,b,c){this.Bb=a;this.qb=b;this.f=c;this.g=258;this.C=56}k=Rf.prototype;k.Z=function(){if(x(this.Bb))return Vd(this.qb);throw Error("count after persistent!");};k.N=function(a,b){return mb.c(this,b,null)};k.I=function(a,b,c){if(x(this.Bb))return a=Qf(this.f,b),-1===a?c:this.f[a+1];throw Error("lookup after persistent!");};
k.Rb=function(a,b){if(x(this.Bb)){if(null!=b?b.g&2048||b.Vc||(b.g?0:Qa(tb,b)):Qa(tb,b))return Wb(this,Zd.b?Zd.b(b):Zd.call(null,b),$d.b?$d.b(b):$d.call(null,b));for(var c=H(b),d=this;;){var e=I(c);if(x(e))c=K(c),d=Wb(d,Zd.b?Zd.b(e):Zd.call(null,e),$d.b?$d.b(e):$d.call(null,e));else return d}}else throw Error("conj! after persistent!");};k.Sb=function(){if(x(this.Bb))return this.Bb=!1,new u(null,Vd(this.qb),this.f,null);throw Error("persistent! called twice");};
k.Qb=function(a,b,c){if(x(this.Bb)){a=Qf(this.f,b);if(-1===a)return this.qb+2<=2*Wf?(this.qb+=2,this.f.push(b),this.f.push(c),this):we(Yf.a?Yf.a(this.qb,this.f):Yf.call(null,this.qb,this.f),b,c);c!==this.f[a+1]&&(this.f[a+1]=c);return this}throw Error("assoc! after persistent!");};Zf;md;function Yf(a,b){for(var c=Tb(Xf),d=0;;)if(d<a)c=Wb(c,b[d],b[d+1]),d+=2;else return c}function $f(){this.H=!1}ag;bg;Qe;cg;V;L;function dg(a,b){return a===b?!0:U(a,b)?!0:rc.a(a,b)}
function eg(a,b,c){a=Xa(a);a[b]=c;return a}function fg(a,b){var c=Array(a.length-2);Bd(a,0,c,0,2*b);Bd(a,2*(b+1),c,2*b,c.length-2*b);return c}function gg(a,b,c,d){a=a.mb(b);a.f[c]=d;return a}function hg(a,b,c){for(var d=a.length,e=0,f=c;;)if(e<d){c=a[e];if(null!=c){var g=a[e+1];c=b.c?b.c(f,c,g):b.call(null,f,c,g)}else c=a[e+1],c=null!=c?c.pb(b,f):f;if(Tc(c))return L.b?L.b(c):L.call(null,c);e+=2;f=c}else return f}ig;function jg(a,b,c,d){this.f=a;this.s=b;this.Zb=c;this.Ra=d}
jg.prototype.advance=function(){for(var a=this.f.length;;)if(this.s<a){var b=this.f[this.s],c=this.f[this.s+1];null!=b?b=this.Zb=new Q(null,2,5,S,[b,c],null):null!=c?(b=hc(c),b=b.ya()?this.Ra=b:!1):b=!1;this.s+=2;if(b)return!0}else return!1};jg.prototype.ya=function(){var a=null!=this.Zb;return a?a:(a=null!=this.Ra)?a:this.advance()};
jg.prototype.next=function(){if(null!=this.Zb){var a=this.Zb;this.Zb=null;return a}if(null!=this.Ra)return a=this.Ra.next(),this.Ra.ya()||(this.Ra=null),a;if(this.advance())return this.next();throw Error("No such element");};jg.prototype.remove=function(){return Error("Unsupported operation")};function kg(a,b,c){this.W=a;this.$=b;this.f=c}k=kg.prototype;k.mb=function(a){if(a===this.W)return this;var b=Wd(this.$),c=Array(0>b?4:2*(b+1));Bd(this.f,0,c,0,2*b);return new kg(a,this.$,c)};
k.Wb=function(){return ag.b?ag.b(this.f):ag.call(null,this.f)};k.pb=function(a,b){return hg(this.f,a,b)};k.fb=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.$&e))return d;var f=Wd(this.$&e-1),e=this.f[2*f],f=this.f[2*f+1];return null==e?f.fb(a+5,b,c,d):dg(c,e)?f:d};
k.Qa=function(a,b,c,d,e,f){var g=1<<(c>>>b&31),h=Wd(this.$&g-1);if(0===(this.$&g)){var l=Wd(this.$);if(2*l<this.f.length){a=this.mb(a);b=a.f;f.H=!0;a:for(c=2*(l-h),f=2*h+(c-1),l=2*(h+1)+(c-1);;){if(0===c)break a;b[l]=b[f];--l;--c;--f}b[2*h]=d;b[2*h+1]=e;a.$|=g;return a}if(16<=l){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[c>>>b&31]=lg.Qa(a,b+5,c,d,e,f);for(e=d=0;;)if(32>d)0!==
(this.$>>>d&1)&&(h[d]=null!=this.f[e]?lg.Qa(a,b+5,wc(this.f[e]),this.f[e],this.f[e+1],f):this.f[e+1],e+=2),d+=1;else break;return new ig(a,l+1,h)}b=Array(2*(l+4));Bd(this.f,0,b,0,2*h);b[2*h]=d;b[2*h+1]=e;Bd(this.f,2*h,b,2*(h+1),2*(l-h));f.H=!0;a=this.mb(a);a.f=b;a.$|=g;return a}l=this.f[2*h];g=this.f[2*h+1];if(null==l)return l=g.Qa(a,b+5,c,d,e,f),l===g?this:gg(this,a,2*h+1,l);if(dg(d,l))return e===g?this:gg(this,a,2*h+1,e);f.H=!0;f=b+5;d=cg.ba?cg.ba(a,f,l,g,c,d,e):cg.call(null,a,f,l,g,c,d,e);e=2*
h;h=2*h+1;a=this.mb(a);a.f[e]=null;a.f[h]=d;return a};
k.Pa=function(a,b,c,d,e){var f=1<<(b>>>a&31),g=Wd(this.$&f-1);if(0===(this.$&f)){var h=Wd(this.$);if(16<=h){g=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];g[b>>>a&31]=lg.Pa(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.$>>>c&1)&&(g[c]=null!=this.f[d]?lg.Pa(a+5,wc(this.f[d]),this.f[d],this.f[d+1],e):this.f[d+1],d+=2),c+=1;else break;return new ig(null,h+1,g)}a=Array(2*(h+1));Bd(this.f,
0,a,0,2*g);a[2*g]=c;a[2*g+1]=d;Bd(this.f,2*g,a,2*(g+1),2*(h-g));e.H=!0;return new kg(null,this.$|f,a)}var l=this.f[2*g],f=this.f[2*g+1];if(null==l)return h=f.Pa(a+5,b,c,d,e),h===f?this:new kg(null,this.$,eg(this.f,2*g+1,h));if(dg(c,l))return d===f?this:new kg(null,this.$,eg(this.f,2*g+1,d));e.H=!0;e=this.$;h=this.f;a+=5;a=cg.Y?cg.Y(a,l,f,b,c,d):cg.call(null,a,l,f,b,c,d);c=2*g;g=2*g+1;d=Xa(h);d[c]=null;d[g]=a;return new kg(null,e,d)};
k.Xb=function(a,b,c){var d=1<<(b>>>a&31);if(0===(this.$&d))return this;var e=Wd(this.$&d-1),f=this.f[2*e],g=this.f[2*e+1];return null==f?(a=g.Xb(a+5,b,c),a===g?this:null!=a?new kg(null,this.$,eg(this.f,2*e+1,a)):this.$===d?null:new kg(null,this.$^d,fg(this.f,e))):dg(c,f)?new kg(null,this.$^d,fg(this.f,e)):this};k.Ga=function(){return new jg(this.f,0,null,null)};var lg=new kg(null,0,[]);function mg(a,b,c){this.f=a;this.s=b;this.Ra=c}
mg.prototype.ya=function(){for(var a=this.f.length;;){if(null!=this.Ra&&this.Ra.ya())return!0;if(this.s<a){var b=this.f[this.s];this.s+=1;null!=b&&(this.Ra=hc(b))}else return!1}};mg.prototype.next=function(){if(this.ya())return this.Ra.next();throw Error("No such element");};mg.prototype.remove=function(){return Error("Unsupported operation")};function ig(a,b,c){this.W=a;this.o=b;this.f=c}k=ig.prototype;k.mb=function(a){return a===this.W?this:new ig(a,this.o,Xa(this.f))};
k.Wb=function(){return bg.b?bg.b(this.f):bg.call(null,this.f)};k.pb=function(a,b){for(var c=this.f.length,d=0,e=b;;)if(d<c){var f=this.f[d];if(null!=f&&(e=f.pb(a,e),Tc(e)))return L.b?L.b(e):L.call(null,e);d+=1}else return e};k.fb=function(a,b,c,d){var e=this.f[b>>>a&31];return null!=e?e.fb(a+5,b,c,d):d};k.Qa=function(a,b,c,d,e,f){var g=c>>>b&31,h=this.f[g];if(null==h)return a=gg(this,a,g,lg.Qa(a,b+5,c,d,e,f)),a.o+=1,a;b=h.Qa(a,b+5,c,d,e,f);return b===h?this:gg(this,a,g,b)};
k.Pa=function(a,b,c,d,e){var f=b>>>a&31,g=this.f[f];if(null==g)return new ig(null,this.o+1,eg(this.f,f,lg.Pa(a+5,b,c,d,e)));a=g.Pa(a+5,b,c,d,e);return a===g?this:new ig(null,this.o,eg(this.f,f,a))};
k.Xb=function(a,b,c){var d=b>>>a&31,e=this.f[d];if(null!=e){a=e.Xb(a+5,b,c);if(a===e)d=this;else if(null==a)if(8>=this.o)a:{e=this.f;a=e.length;b=Array(2*(this.o-1));c=0;for(var f=1,g=0;;)if(c<a)c!==d&&null!=e[c]&&(b[f]=e[c],f+=2,g|=1<<c),c+=1;else{d=new kg(null,g,b);break a}}else d=new ig(null,this.o-1,eg(this.f,d,a));else d=new ig(null,this.o,eg(this.f,d,a));return d}return this};k.Ga=function(){return new mg(this.f,0,null)};
function ng(a,b,c){b*=2;for(var d=0;;)if(d<b){if(dg(c,a[d]))return d;d+=2}else return-1}function og(a,b,c,d){this.W=a;this.bb=b;this.o=c;this.f=d}k=og.prototype;k.mb=function(a){if(a===this.W)return this;var b=Array(2*(this.o+1));Bd(this.f,0,b,0,2*this.o);return new og(a,this.bb,this.o,b)};k.Wb=function(){return ag.b?ag.b(this.f):ag.call(null,this.f)};k.pb=function(a,b){return hg(this.f,a,b)};k.fb=function(a,b,c,d){a=ng(this.f,this.o,c);return 0>a?d:dg(c,this.f[a])?this.f[a+1]:d};
k.Qa=function(a,b,c,d,e,f){if(c===this.bb){b=ng(this.f,this.o,d);if(-1===b){if(this.f.length>2*this.o)return b=2*this.o,c=2*this.o+1,a=this.mb(a),a.f[b]=d,a.f[c]=e,f.H=!0,a.o+=1,a;c=this.f.length;b=Array(c+2);Bd(this.f,0,b,0,c);b[c]=d;b[c+1]=e;f.H=!0;d=this.o+1;a===this.W?(this.f=b,this.o=d,a=this):a=new og(this.W,this.bb,d,b);return a}return this.f[b+1]===e?this:gg(this,a,b+1,e)}return(new kg(a,1<<(this.bb>>>b&31),[null,this,null,null])).Qa(a,b,c,d,e,f)};
k.Pa=function(a,b,c,d,e){return b===this.bb?(a=ng(this.f,this.o,c),-1===a?(a=2*this.o,b=Array(a+2),Bd(this.f,0,b,0,a),b[a]=c,b[a+1]=d,e.H=!0,new og(null,this.bb,this.o+1,b)):rc.a(this.f[a],d)?this:new og(null,this.bb,this.o,eg(this.f,a+1,d))):(new kg(null,1<<(this.bb>>>a&31),[null,this])).Pa(a,b,c,d,e)};k.Xb=function(a,b,c){a=ng(this.f,this.o,c);return-1===a?this:1===this.o?null:new og(null,this.bb,this.o-1,fg(this.f,Vd(a)))};k.Ga=function(){return new jg(this.f,0,null,null)};
var cg=function cg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return cg.Y(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return cg.ba(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};
cg.Y=function(a,b,c,d,e,f){var g=wc(b);if(g===d)return new og(null,g,2,[b,c,e,f]);var h=new $f;return lg.Pa(a,g,b,c,h).Pa(a,d,e,f,h)};cg.ba=function(a,b,c,d,e,f,g){var h=wc(c);if(h===e)return new og(null,h,2,[c,d,f,g]);var l=new $f;return lg.Qa(a,b,h,c,d,l).Qa(a,b,e,f,g,l)};cg.w=7;function pg(a,b,c,d,e){this.v=a;this.gb=b;this.s=c;this.J=d;this.u=e;this.g=32374860;this.C=0}k=pg.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.O=function(){return this.v};
k.T=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.da=function(){return Qc(Ec,this.v)};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){return null==this.J?new Q(null,2,5,S,[this.gb[this.s],this.gb[this.s+1]],null):I(this.J)};
k.xa=function(){if(null==this.J){var a=this.gb,b=this.s+2;return ag.c?ag.c(a,b,null):ag.call(null,a,b,null)}var a=this.gb,b=this.s,c=K(this.J);return ag.c?ag.c(a,b,c):ag.call(null,a,b,c)};k.V=function(){return this};k.P=function(a,b){return new pg(b,this.gb,this.s,this.J,this.u)};k.X=function(a,b){return N(b,this)};pg.prototype[Wa]=function(){return Gc(this)};
var ag=function ag(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ag.b(arguments[0]);case 3:return ag.c(arguments[0],arguments[1],arguments[2]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};ag.b=function(a){return ag.c(a,0,null)};
ag.c=function(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new pg(null,a,b,null,null);var d=a[b+1];if(x(d)&&(d=d.Wb(),x(d)))return new pg(null,a,b+2,d,null);b+=2}else return null;else return new pg(null,a,b,c,null)};ag.w=3;function qg(a,b,c,d,e){this.v=a;this.gb=b;this.s=c;this.J=d;this.u=e;this.g=32374860;this.C=0}k=qg.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.O=function(){return this.v};
k.T=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.da=function(){return Qc(Ec,this.v)};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){return I(this.J)};k.xa=function(){var a=this.gb,b=this.s,c=K(this.J);return bg.m?bg.m(null,a,b,c):bg.call(null,null,a,b,c)};k.V=function(){return this};k.P=function(a,b){return new qg(b,this.gb,this.s,this.J,this.u)};k.X=function(a,b){return N(b,this)};
qg.prototype[Wa]=function(){return Gc(this)};var bg=function bg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return bg.b(arguments[0]);case 4:return bg.m(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};bg.b=function(a){return bg.m(null,a,0,null)};
bg.m=function(a,b,c,d){if(null==d)for(d=b.length;;)if(c<d){var e=b[c];if(x(e)&&(e=e.Wb(),x(e)))return new qg(a,b,c+1,e,null);c+=1}else return null;else return new qg(a,b,c,d,null)};bg.w=4;Zf;function rg(a,b,c){this.Aa=a;this.Mc=b;this.tc=c}rg.prototype.ya=function(){return this.tc&&this.Mc.ya()};rg.prototype.next=function(){if(this.tc)return this.Mc.next();this.tc=!0;return this.Aa};rg.prototype.remove=function(){return Error("Unsupported operation")};
function md(a,b,c,d,e,f){this.v=a;this.o=b;this.root=c;this.za=d;this.Aa=e;this.u=f;this.g=16123663;this.C=8196}k=md.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.keys=function(){return Gc(Tf.b?Tf.b(this):Tf.call(null,this))};k.entries=function(){return Of(H(this))};k.values=function(){return Gc(Uf.b?Uf.b(this):Uf.call(null,this))};k.has=function(a){return Fd(this,a)};k.get=function(a,b){return this.I(null,a,b)};
k.forEach=function(a){for(var b=H(this),c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e),g=P(f,0),f=P(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=H(b))zd(b)?(c=ac(b),b=bc(b),g=c,d=O(c),c=g):(c=I(b),g=P(c,0),f=P(c,1),a.a?a.a(f,g):a.call(null,f,g),b=K(b),c=null,d=0),e=0;else return null};k.N=function(a,b){return mb.c(this,b,null)};k.I=function(a,b,c){return null==b?this.za?this.Aa:c:null==this.root?c:this.root.fb(0,wc(b),b,c)};
k.Lb=function(a,b,c){a=this.za?b.c?b.c(c,null,this.Aa):b.call(null,c,null,this.Aa):c;return Tc(a)?L.b?L.b(a):L.call(null,a):null!=this.root?this.root.pb(b,a):a};k.Ga=function(){var a=this.root?hc(this.root):ze;return this.za?new rg(this.Aa,a,!1):a};k.O=function(){return this.v};k.Z=function(){return this.o};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Mc(this)};k.D=function(a,b){return Lf(this,b)};k.vb=function(){return new Zf({},this.root,this.o,this.za,this.Aa)};
k.da=function(){return Eb(Xf,this.v)};k.ib=function(a,b){if(null==b)return this.za?new md(this.v,this.o-1,this.root,!1,null,null):this;if(null==this.root)return this;var c=this.root.Xb(0,wc(b),b);return c===this.root?this:new md(this.v,this.o-1,c,this.za,this.Aa,null)};
k.Oa=function(a,b,c){if(null==b)return this.za&&c===this.Aa?this:new md(this.v,this.za?this.o:this.o+1,this.root,!0,c,null);a=new $f;b=(null==this.root?lg:this.root).Pa(0,wc(b),b,c,a);return b===this.root?this:new md(this.v,a.H?this.o+1:this.o,b,this.za,this.Aa,null)};k.lc=function(a,b){return null==b?this.za:null==this.root?!1:this.root.fb(0,wc(b),b,Cd)!==Cd};k.V=function(){if(0<this.o){var a=null!=this.root?this.root.Wb():null;return this.za?N(new Q(null,2,5,S,[null,this.Aa],null),a):a}return null};
k.P=function(a,b){return new md(b,this.o,this.root,this.za,this.Aa,this.u)};k.X=function(a,b){if(wd(b))return qb(this,gb.a(b,0),gb.a(b,1));for(var c=this,d=H(b);;){if(null==d)return c;var e=I(d);if(wd(e))c=qb(c,gb.a(e,0),gb.a(e,1)),d=K(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Xa(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};var Xf=new md(null,0,null,!1,null,Nc);
function od(a,b){for(var c=a.length,d=0,e=Tb(Xf);;)if(d<c)var f=d+1,e=e.Qb(null,a[d],b[d]),d=f;else return Vb(e)}md.prototype[Wa]=function(){return Gc(this)};function Zf(a,b,c,d,e){this.W=a;this.root=b;this.count=c;this.za=d;this.Aa=e;this.g=258;this.C=56}function sg(a,b,c){if(a.W){if(null==b)a.Aa!==c&&(a.Aa=c),a.za||(a.count+=1,a.za=!0);else{var d=new $f;b=(null==a.root?lg:a.root).Qa(a.W,0,wc(b),b,c,d);b!==a.root&&(a.root=b);d.H&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}k=Zf.prototype;
k.Z=function(){if(this.W)return this.count;throw Error("count after persistent!");};k.N=function(a,b){return null==b?this.za?this.Aa:null:null==this.root?null:this.root.fb(0,wc(b),b)};k.I=function(a,b,c){return null==b?this.za?this.Aa:c:null==this.root?c:this.root.fb(0,wc(b),b,c)};
k.Rb=function(a,b){var c;a:if(this.W)if(null!=b?b.g&2048||b.Vc||(b.g?0:Qa(tb,b)):Qa(tb,b))c=sg(this,Zd.b?Zd.b(b):Zd.call(null,b),$d.b?$d.b(b):$d.call(null,b));else{c=H(b);for(var d=this;;){var e=I(c);if(x(e))c=K(c),d=sg(d,Zd.b?Zd.b(e):Zd.call(null,e),$d.b?$d.b(e):$d.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};k.Sb=function(){var a;if(this.W)this.W=null,a=new md(null,this.count,this.root,this.za,this.Aa,null);else throw Error("persistent! called twice");return a};
k.Qb=function(a,b,c){return sg(this,b,c)};tg;ug;var vg=function vg(b,c,d){d=null!=b.left?vg(b.left,c,d):d;if(Tc(d))return L.b?L.b(d):L.call(null,d);var e=b.key,f=b.H;d=c.c?c.c(d,e,f):c.call(null,d,e,f);if(Tc(d))return L.b?L.b(d):L.call(null,d);b=null!=b.right?vg(b.right,c,d):d;return Tc(b)?L.b?L.b(b):L.call(null,b):b};function ug(a,b,c,d,e){this.key=a;this.H=b;this.left=c;this.right=d;this.u=e;this.g=32402207;this.C=0}k=ug.prototype;k.replace=function(a,b,c,d){return new ug(a,b,c,d,null)};
k.pb=function(a,b){return vg(this,a,b)};k.N=function(a,b){return gb.c(this,b,null)};k.I=function(a,b,c){return gb.c(this,b,c)};k.ca=function(a,b){return 0===b?this.key:1===b?this.H:null};k.Ea=function(a,b,c){return 0===b?this.key:1===b?this.H:c};k.kb=function(a,b,c){return(new Q(null,2,5,S,[this.key,this.H],null)).kb(null,b,c)};k.O=function(){return null};k.Z=function(){return 2};k.Mb=function(){return this.key};k.Nb=function(){return this.H};k.jb=function(){return this.H};
k.T=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.da=function(){return jd};k.ea=function(a,b){return Uc(this,b)};k.fa=function(a,b,c){return Vc(this,b,c)};k.Oa=function(a,b,c){return nd.c(new Q(null,2,5,S,[this.key,this.H],null),b,c)};k.V=function(){return eb(eb(Ec,this.H),this.key)};k.P=function(a,b){return Qc(new Q(null,2,5,S,[this.key,this.H],null),b)};k.X=function(a,b){return new Q(null,3,5,S,[this.key,this.H,b],null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Xa(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};ug.prototype[Wa]=function(){return Gc(this)};
function tg(a,b,c,d,e){this.key=a;this.H=b;this.left=c;this.right=d;this.u=e;this.g=32402207;this.C=0}k=tg.prototype;k.replace=function(a,b,c,d){return new tg(a,b,c,d,null)};k.pb=function(a,b){return vg(this,a,b)};k.N=function(a,b){return gb.c(this,b,null)};k.I=function(a,b,c){return gb.c(this,b,c)};k.ca=function(a,b){return 0===b?this.key:1===b?this.H:null};k.Ea=function(a,b,c){return 0===b?this.key:1===b?this.H:c};k.kb=function(a,b,c){return(new Q(null,2,5,S,[this.key,this.H],null)).kb(null,b,c)};
k.O=function(){return null};k.Z=function(){return 2};k.Mb=function(){return this.key};k.Nb=function(){return this.H};k.jb=function(){return this.H};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.da=function(){return jd};k.ea=function(a,b){return Uc(this,b)};k.fa=function(a,b,c){return Vc(this,b,c)};k.Oa=function(a,b,c){return nd.c(new Q(null,2,5,S,[this.key,this.H],null),b,c)};k.V=function(){return eb(eb(Ec,this.H),this.key)};
k.P=function(a,b){return Qc(new Q(null,2,5,S,[this.key,this.H],null),b)};k.X=function(a,b){return new Q(null,3,5,S,[this.key,this.H,b],null)};k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Xa(b)))};
k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};tg.prototype[Wa]=function(){return Gc(this)};Zd;var Oc=function Oc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Oc.i(0<c.length?new Bc(c.slice(0),0):null)};Oc.i=function(a){a=H(a);for(var b=Tb(Xf);;)if(a){var c=K(K(a)),b=we(b,I(a),gd(a));a=c}else return Vb(b)};Oc.w=0;Oc.B=function(a){return Oc.i(H(a))};function wg(a,b){this.K=a;this.Da=b;this.g=32374988;this.C=0}k=wg.prototype;
k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.O=function(){return this.Da};k.wa=function(){var a=(null!=this.K?this.K.g&128||this.K.ac||(this.K.g?0:Qa(kb,this.K)):Qa(kb,this.K))?this.K.wa(null):K(this.K);return null==a?null:new wg(a,this.Da)};k.T=function(){return Kc(this)};k.D=function(a,b){return Pc(this,b)};k.da=function(){return Qc(Ec,this.Da)};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){return this.K.ta(null).Mb(null)};
k.xa=function(){var a=(null!=this.K?this.K.g&128||this.K.ac||(this.K.g?0:Qa(kb,this.K)):Qa(kb,this.K))?this.K.wa(null):K(this.K);return null!=a?new wg(a,this.Da):Ec};k.V=function(){return this};k.P=function(a,b){return new wg(this.K,b)};k.X=function(a,b){return N(b,this)};wg.prototype[Wa]=function(){return Gc(this)};function Tf(a){return(a=H(a))?new wg(a,null):null}function Zd(a){return ub(a)}function xg(a,b){this.K=a;this.Da=b;this.g=32374988;this.C=0}k=xg.prototype;k.toString=function(){return jc(this)};
k.equiv=function(a){return this.D(null,a)};k.O=function(){return this.Da};k.wa=function(){var a=(null!=this.K?this.K.g&128||this.K.ac||(this.K.g?0:Qa(kb,this.K)):Qa(kb,this.K))?this.K.wa(null):K(this.K);return null==a?null:new xg(a,this.Da)};k.T=function(){return Kc(this)};k.D=function(a,b){return Pc(this,b)};k.da=function(){return Qc(Ec,this.Da)};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){return this.K.ta(null).Nb(null)};
k.xa=function(){var a=(null!=this.K?this.K.g&128||this.K.ac||(this.K.g?0:Qa(kb,this.K)):Qa(kb,this.K))?this.K.wa(null):K(this.K);return null!=a?new xg(a,this.Da):Ec};k.V=function(){return this};k.P=function(a,b){return new xg(this.K,b)};k.X=function(a,b){return N(b,this)};xg.prototype[Wa]=function(){return Gc(this)};function Uf(a){return(a=H(a))?new xg(a,null):null}function $d(a){return vb(a)}
var yg=function yg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return yg.i(0<c.length?new Bc(c.slice(0),0):null)};yg.i=function(a){return x(Ge(Ld,a))?Za.a(function(a,c){return id.a(x(a)?a:De,c)},a):null};yg.w=0;yg.B=function(a){return yg.i(H(a))};zg;function Ag(a){this.Db=a}Ag.prototype.ya=function(){return this.Db.ya()};Ag.prototype.next=function(){if(this.Db.ya())return this.Db.next().R[0];throw Error("No such element");};Ag.prototype.remove=function(){return Error("Unsupported operation")};
function Bg(a,b,c){this.v=a;this.nb=b;this.u=c;this.g=15077647;this.C=8196}k=Bg.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.keys=function(){return Gc(H(this))};k.entries=function(){var a=H(this);return new Pf(H(a))};k.values=function(){return Gc(H(this))};k.has=function(a){return Fd(this,a)};
k.forEach=function(a){for(var b=H(this),c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e),g=P(f,0),f=P(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=H(b))zd(b)?(c=ac(b),b=bc(b),g=c,d=O(c),c=g):(c=I(b),g=P(c,0),f=P(c,1),a.a?a.a(f,g):a.call(null,f,g),b=K(b),c=null,d=0),e=0;else return null};k.N=function(a,b){return mb.c(this,b,null)};k.I=function(a,b,c){return ob(this.nb,b)?b:c};k.Ga=function(){return new Ag(hc(this.nb))};k.O=function(){return this.v};k.Z=function(){return bb(this.nb)};
k.T=function(){var a=this.u;return null!=a?a:this.u=a=Mc(this)};k.D=function(a,b){return td(b)&&O(this)===O(b)&&Fe(function(a){return function(b){return Fd(a,b)}}(this),b)};k.vb=function(){return new zg(Tb(this.nb))};k.da=function(){return Qc(Cg,this.v)};k.V=function(){return Tf(this.nb)};k.P=function(a,b){return new Bg(b,this.nb,this.u)};k.X=function(a,b){return new Bg(this.v,nd.c(this.nb,b,null),null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Xa(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};var Cg=new Bg(null,De,Nc);Bg.prototype[Wa]=function(){return Gc(this)};
function zg(a){this.cb=a;this.C=136;this.g=259}k=zg.prototype;k.Rb=function(a,b){this.cb=Wb(this.cb,b,null);return this};k.Sb=function(){return new Bg(null,Vb(this.cb),null)};k.Z=function(){return O(this.cb)};k.N=function(a,b){return mb.c(this,b,null)};k.I=function(a,b,c){return mb.c(this.cb,b,Cd)===Cd?c:b};
k.call=function(){function a(a,b,c){return mb.c(this.cb,b,Cd)===Cd?c:b}function b(a,b){return mb.c(this.cb,b,Cd)===Cd?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Xa(b)))};k.b=function(a){return mb.c(this.cb,a,Cd)===Cd?null:a};k.a=function(a,b){return mb.c(this.cb,a,Cd)===Cd?b:a};
function Dg(a,b){if(wd(b)){var c=O(b);return Za.c(function(){return function(b,c){var f=Gd(a,ld(b,c));return x(f)?nd.c(b,c,gd(f)):b}}(c),b,Te(c,Xe(Rc,0)))}return T.a(function(b){var c=Gd(a,b);return x(c)?gd(c):b},b)}function Eg(a){for(var b=jd;;)if(K(a))b=id.a(b,I(a)),a=K(a);else return H(b)}function Yd(a){if(null!=a&&(a.C&4096||a.Xc))return a.Ob(null);if("string"===typeof a)return a;throw Error([B("Doesn't support name: "),B(a)].join(""));}
function Fg(a,b){for(var c=Tb(De),d=H(a),e=H(b);;)if(d&&e)c=we(c,I(d),I(e)),d=K(d),e=K(e);else return Vb(c)}var Gg=function Gg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Gg.a(arguments[0],arguments[1]);case 3:return Gg.c(arguments[0],arguments[1],arguments[2]);default:return Gg.i(arguments[0],arguments[1],arguments[2],new Bc(c.slice(3),0))}};Gg.a=function(a,b){return b};
Gg.c=function(a,b,c){return(a.b?a.b(b):a.call(null,b))<(a.b?a.b(c):a.call(null,c))?b:c};Gg.i=function(a,b,c,d){return Za.c(function(b,c){return Gg.c(a,b,c)},Gg.c(a,b,c),d)};Gg.B=function(a){var b=I(a),c=K(a);a=I(c);var d=K(c),c=I(d),d=K(d);return Gg.i(b,a,c,d)};Gg.w=3;function Hg(a,b){return new je(null,function(){var c=H(b);if(c){var d;d=I(c);d=a.b?a.b(d):a.call(null,d);c=x(d)?N(I(c),Hg(a,Dc(c))):null}else c=null;return c},null,null)}function Ig(a,b,c){this.s=a;this.end=b;this.step=c}
Ig.prototype.ya=function(){return 0<this.step?this.s<this.end:this.s>this.end};Ig.prototype.next=function(){var a=this.s;this.s+=this.step;return a};function Jg(a,b,c,d,e){this.v=a;this.start=b;this.end=c;this.step=d;this.u=e;this.g=32375006;this.C=8192}k=Jg.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};
k.ca=function(a,b){if(b<bb(this))return this.start+b*this.step;if(this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};k.Ea=function(a,b,c){return b<bb(this)?this.start+b*this.step:this.start>this.end&&0===this.step?this.start:c};k.Ga=function(){return new Ig(this.start,this.end,this.step)};k.O=function(){return this.v};
k.wa=function(){return 0<this.step?this.start+this.step<this.end?new Jg(this.v,this.start+this.step,this.end,this.step,null):null:this.start+this.step>this.end?new Jg(this.v,this.start+this.step,this.end,this.step,null):null};k.Z=function(){return Pa(Lb(this))?0:Math.ceil((this.end-this.start)/this.step)};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.da=function(){return Qc(Ec,this.v)};k.ea=function(a,b){return Uc(this,b)};
k.fa=function(a,b,c){for(a=this.start;;)if(0<this.step?a<this.end:a>this.end){c=b.a?b.a(c,a):b.call(null,c,a);if(Tc(c))return L.b?L.b(c):L.call(null,c);a+=this.step}else return c};k.ta=function(){return null==Lb(this)?null:this.start};k.xa=function(){return null!=Lb(this)?new Jg(this.v,this.start+this.step,this.end,this.step,null):Ec};k.V=function(){return 0<this.step?this.start<this.end?this:null:0>this.step?this.start>this.end?this:null:this.start===this.end?null:this};
k.P=function(a,b){return new Jg(b,this.start,this.end,this.step,this.u)};k.X=function(a,b){return N(b,this)};Jg.prototype[Wa]=function(){return Gc(this)};function Kg(a,b){return new je(null,function(){var c=H(b);if(c){var d=I(c),e=a.b?a.b(d):a.call(null,d),d=N(d,Hg(function(b,c){return function(b){return rc.a(c,a.b?a.b(b):a.call(null,b))}}(d,e,c,c),K(c)));return N(d,Kg(a,H(Ue(O(d),c))))}return null},null,null)}
function Lg(a){return new je(null,function(){var b=H(a);return b?Mg(Nd,I(b),Dc(b)):eb(Ec,Nd.l?Nd.l():Nd.call(null))},null,null)}function Mg(a,b,c){return N(b,new je(null,function(){var d=H(c);if(d){var e=Mg,f;f=I(d);f=a.a?a.a(b,f):a.call(null,b,f);d=e(a,f,Dc(d))}else d=null;return d},null,null))}
function Ng(a,b){return function(){function c(c,d,e){return new Q(null,2,5,S,[a.c?a.c(c,d,e):a.call(null,c,d,e),b.c?b.c(c,d,e):b.call(null,c,d,e)],null)}function d(c,d){return new Q(null,2,5,S,[a.a?a.a(c,d):a.call(null,c,d),b.a?b.a(c,d):b.call(null,c,d)],null)}function e(c){return new Q(null,2,5,S,[a.b?a.b(c):a.call(null,c),b.b?b.b(c):b.call(null,c)],null)}function f(){return new Q(null,2,5,S,[a.l?a.l():a.call(null),b.l?b.l():b.call(null)],null)}var g=null,h=function(){function c(a,b,e,f){var g=null;
if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;g=new Bc(h,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){return new Q(null,2,5,S,[C.A(a,c,e,f,g),C.A(b,c,e,f,g)],null)}c.w=3;c.B=function(a){var b=I(a);a=K(a);var c=I(a);a=K(a);var e=I(a);a=Dc(a);return d(b,c,e,a)};c.i=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);
default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+3],++q;q=new Bc(r,0)}return h.i(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.B=h.B;g.l=f;g.b=e;g.a=d;g.c=c;g.i=h.i;return g}()}
function zf(a,b,c,d,e,f,g){var h=Ca;Ca=null==Ca?null:Ca-1;try{if(null!=Ca&&0>Ca)return Qb(a,"#");Qb(a,c);if(0===Ka.b(f))H(g)&&Qb(a,function(){var a=Og.b(f);return x(a)?a:"..."}());else{if(H(g)){var l=I(g);b.c?b.c(l,a,f):b.call(null,l,a,f)}for(var m=K(g),n=Ka.b(f)-1;;)if(!m||null!=n&&0===n){H(m)&&0===n&&(Qb(a,d),Qb(a,function(){var a=Og.b(f);return x(a)?a:"..."}()));break}else{Qb(a,d);var p=I(m);c=a;g=f;b.c?b.c(p,c,g):b.call(null,p,c,g);var q=K(m);c=n-1;m=q;n=c}}return Qb(a,e)}finally{Ca=h}}
function Pg(a,b){for(var c=H(b),d=null,e=0,f=0;;)if(f<e){var g=d.ca(null,f);Qb(a,g);f+=1}else if(c=H(c))d=c,zd(d)?(c=ac(d),e=bc(d),d=c,g=O(c),c=e,e=g):(g=I(d),Qb(a,g),c=K(d),d=null,e=0),f=0;else return null}var Qg={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function Rg(a){return[B('"'),B(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return Qg[a]})),B('"')].join("")}Sg;
function Tg(a,b){var c=Ed(D.a(a,Ha));return c?(c=null!=b?b.g&131072||b.Wc?!0:!1:!1)?null!=rd(b):c:c}
function Ug(a,b,c){if(null==a)return Qb(b,"nil");if(Tg(c,a)){Qb(b,"^");var d=rd(a);Af.c?Af.c(d,b,c):Af.call(null,d,b,c);Qb(b," ")}if(a.xb)return a.Tb(a,b,c);if(null!=a&&(a.g&2147483648||a.aa))return a.M(null,b,c);if(!0===a||!1===a||"number"===typeof a)return Qb(b,""+B(a));if(null!=a&&a.constructor===Object)return Qb(b,"#js "),d=T.a(function(b){return new Q(null,2,5,S,[ie.b(b),a[b]],null)},Ad(a)),Sg.m?Sg.m(d,Af,b,c):Sg.call(null,d,Af,b,c);if(Oa(a))return zf(b,Af,"#js ["," ","]",c,a);if("string"==typeof a)return x(Ga.b(c))?
Qb(b,Rg(a)):Qb(b,a);if(ca(a)){var e=a.name;c=x(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return Pg(b,G(["#object[",c,' "',""+B(a),'"]'],0))}if(a instanceof Date)return c=function(a,b){for(var c=""+B(a);;)if(O(c)<b)c=[B("0"),B(c)].join("");else return c},Pg(b,G(['#inst "',""+B(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),3),"-",'00:00"'],
0));if(a instanceof RegExp)return Pg(b,G(['#"',a.source,'"'],0));if(null!=a&&(a.g&2147483648||a.aa))return Rb(a,b,c);if(x(a.constructor.eb))return Pg(b,G(["#object[",a.constructor.eb.replace(RegExp("/","g"),"."),"]"],0));e=a.constructor.name;c=x(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return Pg(b,G(["#object[",c," ",""+B(a),"]"],0))}function Af(a,b,c){var d=Vg.b(c);return x(d)?(c=nd.c(c,Wg,Ug),d.c?d.c(a,b,c):d.call(null,a,b,c)):Ug(a,b,c)}
var Pe=function Pe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Pe.i(0<c.length?new Bc(c.slice(0),0):null)};Pe.i=function(a){var b=Ea();if(sd(a))b="";else{var c=B,d=new pa;a:{var e=new ic(d);Af(I(a),e,b);a=H(K(a));for(var f=null,g=0,h=0;;)if(h<g){var l=f.ca(null,h);Qb(e," ");Af(l,e,b);h+=1}else if(a=H(a))f=a,zd(f)?(a=ac(f),g=bc(f),f=a,l=O(a),a=g,g=l):(l=I(f),Qb(e," "),Af(l,e,b),a=K(f),f=null,g=0),h=0;else break a}b=""+c(d)}return b};Pe.w=0;Pe.B=function(a){return Pe.i(H(a))};
function Sg(a,b,c,d){return zf(c,function(a,c,d){var h=ub(a);b.c?b.c(h,c,d):b.call(null,h,c,d);Qb(c," ");a=vb(a);return b.c?b.c(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,H(a))}Se.prototype.aa=!0;Se.prototype.M=function(a,b,c){Qb(b,"#object [cljs.core.Volatile ");Af(new u(null,1,[Xg,this.state],null),b,c);return Qb(b,"]")};Bc.prototype.aa=!0;Bc.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};je.prototype.aa=!0;je.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};
pg.prototype.aa=!0;pg.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};ug.prototype.aa=!0;ug.prototype.M=function(a,b,c){return zf(b,Af,"["," ","]",c,this)};Sf.prototype.aa=!0;Sf.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};Ic.prototype.aa=!0;Ic.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};yd.prototype.aa=!0;yd.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};ge.prototype.aa=!0;
ge.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};$c.prototype.aa=!0;$c.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};md.prototype.aa=!0;md.prototype.M=function(a,b,c){return Sg(this,Af,b,c)};qg.prototype.aa=!0;qg.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};Gf.prototype.aa=!0;Gf.prototype.M=function(a,b,c){return zf(b,Af,"["," ","]",c,this)};Bg.prototype.aa=!0;Bg.prototype.M=function(a,b,c){return zf(b,Af,"#{"," ","}",c,this)};
xd.prototype.aa=!0;xd.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};Ne.prototype.aa=!0;Ne.prototype.M=function(a,b,c){Qb(b,"#object [cljs.core.Atom ");Af(new u(null,1,[Xg,this.state],null),b,c);return Qb(b,"]")};xg.prototype.aa=!0;xg.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};tg.prototype.aa=!0;tg.prototype.M=function(a,b,c){return zf(b,Af,"["," ","]",c,this)};Q.prototype.aa=!0;Q.prototype.M=function(a,b,c){return zf(b,Af,"["," ","]",c,this)};
ee.prototype.aa=!0;ee.prototype.M=function(a,b){return Qb(b,"()")};Ee.prototype.aa=!0;Ee.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};u.prototype.aa=!0;u.prototype.M=function(a,b,c){return Sg(this,Af,b,c)};Jg.prototype.aa=!0;Jg.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};wg.prototype.aa=!0;wg.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};ad.prototype.aa=!0;ad.prototype.M=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};qc.prototype.Ib=!0;
qc.prototype.ub=function(a,b){if(b instanceof qc)return yc(this,b);throw Error([B("Cannot compare "),B(this),B(" to "),B(b)].join(""));};y.prototype.Ib=!0;y.prototype.ub=function(a,b){if(b instanceof y)return he(this,b);throw Error([B("Cannot compare "),B(this),B(" to "),B(b)].join(""));};Gf.prototype.Ib=!0;Gf.prototype.ub=function(a,b){if(wd(b))return Hd(this,b);throw Error([B("Cannot compare "),B(this),B(" to "),B(b)].join(""));};Q.prototype.Ib=!0;
Q.prototype.ub=function(a,b){if(wd(b))return Hd(this,b);throw Error([B("Cannot compare "),B(this),B(" to "),B(b)].join(""));};var Yg=null;function Zg(a){null==Yg&&(Yg=V.b?V.b(0):V.call(null,0));return zc.b([B(a),B(Re.a(Yg,Rc))].join(""))}function $g(a){return function(b,c){var d=a.a?a.a(b,c):a.call(null,b,c);return Tc(d)?new Sc(d):d}}
function $e(a){return function(b){return function(){function c(a,c){return Za.c(b,a,c)}function d(b){return a.b?a.b(b):a.call(null,b)}function e(){return a.l?a.l():a.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.l=e;f.b=d;f.a=c;return f}()}($g(a))}ah;function bh(){}
var ch=function ch(b){if(null!=b&&null!=b.Tc)return b.Tc(b);var c=ch[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ch._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IEncodeJS.-clj-\x3ejs",b);};dh;function eh(a){return(null!=a?a.Sc||(a.ec?0:Qa(bh,a)):Qa(bh,a))?ch(a):"string"===typeof a||"number"===typeof a||a instanceof y||a instanceof qc?dh.b?dh.b(a):dh.call(null,a):Pe.i(G([a],0))}
var dh=function dh(b){if(null==b)return null;if(null!=b?b.Sc||(b.ec?0:Qa(bh,b)):Qa(bh,b))return ch(b);if(b instanceof y)return Yd(b);if(b instanceof qc)return""+B(b);if(vd(b)){var c={};b=H(b);for(var d=null,e=0,f=0;;)if(f<e){var g=d.ca(null,f),h=P(g,0),g=P(g,1);c[eh(h)]=dh(g);f+=1}else if(b=H(b))zd(b)?(e=ac(b),b=bc(b),d=e,e=O(e)):(e=I(b),d=P(e,0),e=P(e,1),c[eh(d)]=dh(e),b=K(b),d=null,e=0),f=0;else break;return c}if(null==b?0:null!=b?b.g&8||b.xd||(b.g?0:Qa(db,b)):Qa(db,b)){c=[];b=H(T.a(dh,b));d=null;
for(f=e=0;;)if(f<e)h=d.ca(null,f),c.push(h),f+=1;else if(b=H(b))d=b,zd(d)?(b=ac(d),f=bc(d),d=b,e=O(b),b=f):(b=I(d),c.push(b),b=K(d),d=null,e=0),f=0;else break;return c}return b},ah=function ah(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return ah.l();case 1:return ah.b(arguments[0]);default:throw Error([B("Invalid arity: "),B(c.length)].join(""));}};ah.l=function(){return ah.b(1)};ah.b=function(a){return Math.random()*a};ah.w=1;
function fh(a,b){return ue(Za.c(function(b,d){var e=a.b?a.b(d):a.call(null,d);return we(b,e,id.a(D.c(b,e,jd),d))},Tb(De),b))}var gh=null;function hh(){if(null==gh){var a=new u(null,3,[ih,De,jh,De,mh,De],null);gh=V.b?V.b(a):V.call(null,a)}return gh}
function nh(a,b,c){var d=rc.a(b,c);if(!d&&!(d=Fd(mh.b(a).call(null,b),c))&&(d=wd(c))&&(d=wd(b)))if(d=O(c)===O(b))for(var d=!0,e=0;;)if(d&&e!==O(c))d=nh(a,b.b?b.b(e):b.call(null,e),c.b?c.b(e):c.call(null,e)),e+=1;else return d;else return d;else return d}function oh(a){var b;b=hh();b=L.b?L.b(b):L.call(null,b);return ye(D.a(ih.b(b),a))}function ph(a,b,c,d){Re.a(a,function(){return L.b?L.b(b):L.call(null,b)});Re.a(c,function(){return L.b?L.b(d):L.call(null,d)})}
var qh=function qh(b,c,d){var e=(L.b?L.b(d):L.call(null,d)).call(null,b),e=x(x(e)?e.b?e.b(c):e.call(null,c):e)?!0:null;if(x(e))return e;e=function(){for(var e=oh(c);;)if(0<O(e))qh(b,I(e),d),e=Dc(e);else return null}();if(x(e))return e;e=function(){for(var e=oh(b);;)if(0<O(e))qh(I(e),c,d),e=Dc(e);else return null}();return x(e)?e:!1};function rh(a,b,c){c=qh(a,b,c);if(x(c))a=c;else{c=nh;var d;d=hh();d=L.b?L.b(d):L.call(null,d);a=c(d,a,b)}return a}
var sh=function sh(b,c,d,e,f,g,h){var l=Za.c(function(e,g){var h=P(g,0);P(g,1);if(nh(L.b?L.b(d):L.call(null,d),c,h)){var l;l=(l=null==e)?l:rh(h,I(e),f);l=x(l)?g:e;if(!x(rh(I(l),h,f)))throw Error([B("Multiple methods in multimethod '"),B(b),B("' match dispatch value: "),B(c),B(" -\x3e "),B(h),B(" and "),B(I(l)),B(", and neither is preferred")].join(""));return l}return e},null,L.b?L.b(e):L.call(null,e));if(x(l)){if(rc.a(L.b?L.b(h):L.call(null,h),L.b?L.b(d):L.call(null,d)))return Re.m(g,nd,c,gd(l)),
gd(l);ph(g,e,h,d);return sh(b,c,d,e,f,g,h)}return null};function th(a,b){throw Error([B("No method in multimethod '"),B(a),B("' for dispatch value: "),B(b)].join(""));}function uh(a,b,c,d,e,f,g,h){this.name=a;this.j=b;this.ed=c;this.Vb=d;this.Eb=e;this.pd=f;this.Yb=g;this.Hb=h;this.g=4194305;this.C=4352}k=uh.prototype;
k.call=function(){function a(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,A,F,E,M,J){a=this;var Ba=C.i(a.j,b,c,d,e,G([f,g,h,l,m,n,p,q,r,w,z,v,A,F,E,M,J],0)),lh=vh(this,Ba);x(lh)||th(a.name,Ba);return C.i(lh,b,c,d,e,G([f,g,h,l,m,n,p,q,r,w,z,v,A,F,E,M,J],0))}function b(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,A,F,E,M){a=this;var J=a.j.qa?a.j.qa(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,A,F,E,M):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,A,F,E,M),Ba=vh(this,J);x(Ba)||th(a.name,J);return Ba.qa?Ba.qa(b,c,d,e,f,g,h,l,m,n,p,q,r,
w,z,v,A,F,E,M):Ba.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,A,F,E,M)}function c(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,A,F,E){a=this;var M=a.j.pa?a.j.pa(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,A,F,E):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,A,F,E),J=vh(this,M);x(J)||th(a.name,M);return J.pa?J.pa(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,A,F,E):J.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,A,F,E)}function d(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,A,F){a=this;var E=a.j.oa?a.j.oa(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,A,F):a.j.call(null,
b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,A,F),M=vh(this,E);x(M)||th(a.name,E);return M.oa?M.oa(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,A,F):M.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,A,F)}function e(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,A){a=this;var F=a.j.na?a.j.na(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,A):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,A),E=vh(this,F);x(E)||th(a.name,F);return E.na?E.na(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,A):E.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,A)}function f(a,b,c,d,e,f,g,h,l,m,n,p,q,r,
w,z,v){a=this;var A=a.j.ma?a.j.ma(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v),F=vh(this,A);x(F)||th(a.name,A);return F.ma?F.ma(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v):F.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v)}function g(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z){a=this;var v=a.j.la?a.j.la(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z),A=vh(this,v);x(A)||th(a.name,v);return A.la?A.la(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z):A.call(null,b,c,d,e,f,g,h,l,m,n,p,
q,r,w,z)}function h(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w){a=this;var z=a.j.ka?a.j.ka(b,c,d,e,f,g,h,l,m,n,p,q,r,w):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w),v=vh(this,z);x(v)||th(a.name,z);return v.ka?v.ka(b,c,d,e,f,g,h,l,m,n,p,q,r,w):v.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w)}function l(a,b,c,d,e,f,g,h,l,m,n,p,q,r){a=this;var w=a.j.ja?a.j.ja(b,c,d,e,f,g,h,l,m,n,p,q,r):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r),z=vh(this,w);x(z)||th(a.name,w);return z.ja?z.ja(b,c,d,e,f,g,h,l,m,n,p,q,r):z.call(null,b,c,d,e,f,
g,h,l,m,n,p,q,r)}function m(a,b,c,d,e,f,g,h,l,m,n,p,q){a=this;var r=a.j.ia?a.j.ia(b,c,d,e,f,g,h,l,m,n,p,q):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q),w=vh(this,r);x(w)||th(a.name,r);return w.ia?w.ia(b,c,d,e,f,g,h,l,m,n,p,q):w.call(null,b,c,d,e,f,g,h,l,m,n,p,q)}function n(a,b,c,d,e,f,g,h,l,m,n,p){a=this;var q=a.j.ha?a.j.ha(b,c,d,e,f,g,h,l,m,n,p):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p),r=vh(this,q);x(r)||th(a.name,q);return r.ha?r.ha(b,c,d,e,f,g,h,l,m,n,p):r.call(null,b,c,d,e,f,g,h,l,m,n,p)}function p(a,b,
c,d,e,f,g,h,l,m,n){a=this;var p=a.j.ga?a.j.ga(b,c,d,e,f,g,h,l,m,n):a.j.call(null,b,c,d,e,f,g,h,l,m,n),q=vh(this,p);x(q)||th(a.name,p);return q.ga?q.ga(b,c,d,e,f,g,h,l,m,n):q.call(null,b,c,d,e,f,g,h,l,m,n)}function q(a,b,c,d,e,f,g,h,l,m){a=this;var n=a.j.sa?a.j.sa(b,c,d,e,f,g,h,l,m):a.j.call(null,b,c,d,e,f,g,h,l,m),p=vh(this,n);x(p)||th(a.name,n);return p.sa?p.sa(b,c,d,e,f,g,h,l,m):p.call(null,b,c,d,e,f,g,h,l,m)}function r(a,b,c,d,e,f,g,h,l){a=this;var m=a.j.ra?a.j.ra(b,c,d,e,f,g,h,l):a.j.call(null,
b,c,d,e,f,g,h,l),n=vh(this,m);x(n)||th(a.name,m);return n.ra?n.ra(b,c,d,e,f,g,h,l):n.call(null,b,c,d,e,f,g,h,l)}function v(a,b,c,d,e,f,g,h){a=this;var l=a.j.ba?a.j.ba(b,c,d,e,f,g,h):a.j.call(null,b,c,d,e,f,g,h),m=vh(this,l);x(m)||th(a.name,l);return m.ba?m.ba(b,c,d,e,f,g,h):m.call(null,b,c,d,e,f,g,h)}function w(a,b,c,d,e,f,g){a=this;var h=a.j.Y?a.j.Y(b,c,d,e,f,g):a.j.call(null,b,c,d,e,f,g),l=vh(this,h);x(l)||th(a.name,h);return l.Y?l.Y(b,c,d,e,f,g):l.call(null,b,c,d,e,f,g)}function z(a,b,c,d,e,f){a=
this;var g=a.j.A?a.j.A(b,c,d,e,f):a.j.call(null,b,c,d,e,f),h=vh(this,g);x(h)||th(a.name,g);return h.A?h.A(b,c,d,e,f):h.call(null,b,c,d,e,f)}function A(a,b,c,d,e){a=this;var f=a.j.m?a.j.m(b,c,d,e):a.j.call(null,b,c,d,e),g=vh(this,f);x(g)||th(a.name,f);return g.m?g.m(b,c,d,e):g.call(null,b,c,d,e)}function F(a,b,c,d){a=this;var e=a.j.c?a.j.c(b,c,d):a.j.call(null,b,c,d),f=vh(this,e);x(f)||th(a.name,e);return f.c?f.c(b,c,d):f.call(null,b,c,d)}function J(a,b,c){a=this;var d=a.j.a?a.j.a(b,c):a.j.call(null,
b,c),e=vh(this,d);x(e)||th(a.name,d);return e.a?e.a(b,c):e.call(null,b,c)}function M(a,b){a=this;var c=a.j.b?a.j.b(b):a.j.call(null,b),d=vh(this,c);x(d)||th(a.name,c);return d.b?d.b(b):d.call(null,b)}function Ba(a){a=this;var b=a.j.l?a.j.l():a.j.call(null),c=vh(this,b);x(c)||th(a.name,b);return c.l?c.l():c.call(null)}var E=null,E=function(na,E,R,fa,X,ha,W,ma,oa,qa,va,ya,Ta,Aa,Ja,Ua,Va,pb,Bb,Ya,Cc,cd){switch(arguments.length){case 1:return Ba.call(this,na);case 2:return M.call(this,na,E);case 3:return J.call(this,
na,E,R);case 4:return F.call(this,na,E,R,fa);case 5:return A.call(this,na,E,R,fa,X);case 6:return z.call(this,na,E,R,fa,X,ha);case 7:return w.call(this,na,E,R,fa,X,ha,W);case 8:return v.call(this,na,E,R,fa,X,ha,W,ma);case 9:return r.call(this,na,E,R,fa,X,ha,W,ma,oa);case 10:return q.call(this,na,E,R,fa,X,ha,W,ma,oa,qa);case 11:return p.call(this,na,E,R,fa,X,ha,W,ma,oa,qa,va);case 12:return n.call(this,na,E,R,fa,X,ha,W,ma,oa,qa,va,ya);case 13:return m.call(this,na,E,R,fa,X,ha,W,ma,oa,qa,va,ya,Ta);
case 14:return l.call(this,na,E,R,fa,X,ha,W,ma,oa,qa,va,ya,Ta,Aa);case 15:return h.call(this,na,E,R,fa,X,ha,W,ma,oa,qa,va,ya,Ta,Aa,Ja);case 16:return g.call(this,na,E,R,fa,X,ha,W,ma,oa,qa,va,ya,Ta,Aa,Ja,Ua);case 17:return f.call(this,na,E,R,fa,X,ha,W,ma,oa,qa,va,ya,Ta,Aa,Ja,Ua,Va);case 18:return e.call(this,na,E,R,fa,X,ha,W,ma,oa,qa,va,ya,Ta,Aa,Ja,Ua,Va,pb);case 19:return d.call(this,na,E,R,fa,X,ha,W,ma,oa,qa,va,ya,Ta,Aa,Ja,Ua,Va,pb,Bb);case 20:return c.call(this,na,E,R,fa,X,ha,W,ma,oa,qa,va,ya,Ta,
Aa,Ja,Ua,Va,pb,Bb,Ya);case 21:return b.call(this,na,E,R,fa,X,ha,W,ma,oa,qa,va,ya,Ta,Aa,Ja,Ua,Va,pb,Bb,Ya,Cc);case 22:return a.call(this,na,E,R,fa,X,ha,W,ma,oa,qa,va,ya,Ta,Aa,Ja,Ua,Va,pb,Bb,Ya,Cc,cd)}throw Error("Invalid arity: "+arguments.length);};E.b=Ba;E.a=M;E.c=J;E.m=F;E.A=A;E.Y=z;E.ba=w;E.ra=v;E.sa=r;E.ga=q;E.ha=p;E.ia=n;E.ja=m;E.ka=l;E.la=h;E.ma=g;E.na=f;E.oa=e;E.pa=d;E.qa=c;E.Kb=b;E.wb=a;return E}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Xa(b)))};
k.l=function(){var a=this.j.l?this.j.l():this.j.call(null),b=vh(this,a);x(b)||th(this.name,a);return b.l?b.l():b.call(null)};k.b=function(a){var b=this.j.b?this.j.b(a):this.j.call(null,a),c=vh(this,b);x(c)||th(this.name,b);return c.b?c.b(a):c.call(null,a)};k.a=function(a,b){var c=this.j.a?this.j.a(a,b):this.j.call(null,a,b),d=vh(this,c);x(d)||th(this.name,c);return d.a?d.a(a,b):d.call(null,a,b)};
k.c=function(a,b,c){var d=this.j.c?this.j.c(a,b,c):this.j.call(null,a,b,c),e=vh(this,d);x(e)||th(this.name,d);return e.c?e.c(a,b,c):e.call(null,a,b,c)};k.m=function(a,b,c,d){var e=this.j.m?this.j.m(a,b,c,d):this.j.call(null,a,b,c,d),f=vh(this,e);x(f)||th(this.name,e);return f.m?f.m(a,b,c,d):f.call(null,a,b,c,d)};k.A=function(a,b,c,d,e){var f=this.j.A?this.j.A(a,b,c,d,e):this.j.call(null,a,b,c,d,e),g=vh(this,f);x(g)||th(this.name,f);return g.A?g.A(a,b,c,d,e):g.call(null,a,b,c,d,e)};
k.Y=function(a,b,c,d,e,f){var g=this.j.Y?this.j.Y(a,b,c,d,e,f):this.j.call(null,a,b,c,d,e,f),h=vh(this,g);x(h)||th(this.name,g);return h.Y?h.Y(a,b,c,d,e,f):h.call(null,a,b,c,d,e,f)};k.ba=function(a,b,c,d,e,f,g){var h=this.j.ba?this.j.ba(a,b,c,d,e,f,g):this.j.call(null,a,b,c,d,e,f,g),l=vh(this,h);x(l)||th(this.name,h);return l.ba?l.ba(a,b,c,d,e,f,g):l.call(null,a,b,c,d,e,f,g)};
k.ra=function(a,b,c,d,e,f,g,h){var l=this.j.ra?this.j.ra(a,b,c,d,e,f,g,h):this.j.call(null,a,b,c,d,e,f,g,h),m=vh(this,l);x(m)||th(this.name,l);return m.ra?m.ra(a,b,c,d,e,f,g,h):m.call(null,a,b,c,d,e,f,g,h)};k.sa=function(a,b,c,d,e,f,g,h,l){var m=this.j.sa?this.j.sa(a,b,c,d,e,f,g,h,l):this.j.call(null,a,b,c,d,e,f,g,h,l),n=vh(this,m);x(n)||th(this.name,m);return n.sa?n.sa(a,b,c,d,e,f,g,h,l):n.call(null,a,b,c,d,e,f,g,h,l)};
k.ga=function(a,b,c,d,e,f,g,h,l,m){var n=this.j.ga?this.j.ga(a,b,c,d,e,f,g,h,l,m):this.j.call(null,a,b,c,d,e,f,g,h,l,m),p=vh(this,n);x(p)||th(this.name,n);return p.ga?p.ga(a,b,c,d,e,f,g,h,l,m):p.call(null,a,b,c,d,e,f,g,h,l,m)};k.ha=function(a,b,c,d,e,f,g,h,l,m,n){var p=this.j.ha?this.j.ha(a,b,c,d,e,f,g,h,l,m,n):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n),q=vh(this,p);x(q)||th(this.name,p);return q.ha?q.ha(a,b,c,d,e,f,g,h,l,m,n):q.call(null,a,b,c,d,e,f,g,h,l,m,n)};
k.ia=function(a,b,c,d,e,f,g,h,l,m,n,p){var q=this.j.ia?this.j.ia(a,b,c,d,e,f,g,h,l,m,n,p):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p),r=vh(this,q);x(r)||th(this.name,q);return r.ia?r.ia(a,b,c,d,e,f,g,h,l,m,n,p):r.call(null,a,b,c,d,e,f,g,h,l,m,n,p)};k.ja=function(a,b,c,d,e,f,g,h,l,m,n,p,q){var r=this.j.ja?this.j.ja(a,b,c,d,e,f,g,h,l,m,n,p,q):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q),v=vh(this,r);x(v)||th(this.name,r);return v.ja?v.ja(a,b,c,d,e,f,g,h,l,m,n,p,q):v.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q)};
k.ka=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){var v=this.j.ka?this.j.ka(a,b,c,d,e,f,g,h,l,m,n,p,q,r):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r),w=vh(this,v);x(w)||th(this.name,v);return w.ka?w.ka(a,b,c,d,e,f,g,h,l,m,n,p,q,r):w.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r)};
k.la=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v){var w=this.j.la?this.j.la(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v),z=vh(this,w);x(z)||th(this.name,w);return z.la?z.la(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v):z.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v)};
k.ma=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w){var z=this.j.ma?this.j.ma(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w),A=vh(this,z);x(A)||th(this.name,z);return A.ma?A.ma(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w):A.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w)};
k.na=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z){var A=this.j.na?this.j.na(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z),F=vh(this,A);x(F)||th(this.name,A);return F.na?F.na(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z):F.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z)};
k.oa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A){var F=this.j.oa?this.j.oa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A),J=vh(this,F);x(J)||th(this.name,F);return J.oa?J.oa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A):J.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A)};
k.pa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F){var J=this.j.pa?this.j.pa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F),M=vh(this,J);x(M)||th(this.name,J);return M.pa?M.pa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F):M.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F)};
k.qa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F,J){var M=this.j.qa?this.j.qa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F,J):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F,J),Ba=vh(this,M);x(Ba)||th(this.name,M);return Ba.qa?Ba.qa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F,J):Ba.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F,J)};
k.Kb=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F,J,M){var Ba=C.i(this.j,a,b,c,d,G([e,f,g,h,l,m,n,p,q,r,v,w,z,A,F,J,M],0)),E=vh(this,Ba);x(E)||th(this.name,Ba);return C.i(E,a,b,c,d,G([e,f,g,h,l,m,n,p,q,r,v,w,z,A,F,J,M],0))};function wh(a,b,c){Re.m(a.Eb,nd,b,c);ph(a.Yb,a.Eb,a.Hb,a.Vb)}
function vh(a,b){rc.a(L.b?L.b(a.Hb):L.call(null,a.Hb),L.b?L.b(a.Vb):L.call(null,a.Vb))||ph(a.Yb,a.Eb,a.Hb,a.Vb);var c=(L.b?L.b(a.Yb):L.call(null,a.Yb)).call(null,b);if(x(c))return c;c=sh(a.name,b,a.Vb,a.Eb,a.pd,a.Yb,a.Hb);return x(c)?c:(L.b?L.b(a.Eb):L.call(null,a.Eb)).call(null,a.ed)}k.Ob=function(){return dc(this.name)};k.Pb=function(){return ec(this.name)};k.T=function(){return this[da]||(this[da]=++ea)};var xh=new y(null,"y","y",-1757859776),yh=new y(null,"text-anchor","text-anchor",585613696),zh=new y(null,"path","path",-188191168),Ah=new y(null,"penny-spacing","penny-spacing",-20780703),Bh=new y(null,"supplier","supplier",18255489),Ch=new y(null,"determine-capacity","determine-capacity",-452765887),Dh=new y(null,"by-station","by-station",516084641),Eh=new y(null,"selector","selector",762528866),Fh=new y(null,"basic+efficient+fixed","basic+efficient+fixed",-1106868702),Gh=new y(null,"r","r",-471384190),
Hh=new y(null,"run","run",-1821166653),Ih=new y(null,"richpath","richpath",-150197948),Jh=new y(null,"turns","turns",-1118736892),Kh=new y(null,"transform","transform",1381301764),Lh=new y(null,"die","die",-547192252),Ha=new y(null,"meta","meta",1499536964),Mh=new y(null,"transformer","transformer",-1493470620),Nh=new y(null,"dx","dx",-381796732),Oh=new y(null,"color","color",1011675173),Ph=new y(null,"executors","executors",-331073403),Ia=new y(null,"dup","dup",556298533),Qh=new y(null,"intaking",
"intaking",-1009888859),Rh=new y(null,"running?","running?",-257884763),Sh=new y(null,"processing","processing",-1576405467),Th=new y(null,"stats-history","stats-history",636123973),Uh=new y(null,"spout-y","spout-y",1676697606),Vh=new y(null,"stations","stations",-19744730),Wh=new y(null,"capacity","capacity",72689734),Xh=new y(null,"disabled","disabled",-1529784218),Yh=new y(null,"private","private",-558947994),Zh=new y(null,"efficient","efficient",-63016538),$h=new y(null,"graphs?","graphs?",-270895578),
ai=new y(null,"transform*","transform*",-1613794522),bi=new y(null,"button","button",1456579943),ci=new y(null,"top","top",-1856271961),di=new y(null,"basic+efficient","basic+efficient",-970783161),Oe=new y(null,"validator","validator",-1966190681),ei=new y(null,"total-utilization","total-utilization",-1341502521),fi=new y(null,"use","use",-1846382424),gi=new y(null,"default","default",-1987822328),hi=new y(null,"finally-block","finally-block",832982472),ii=new y(null,"scenarios","scenarios",1618559369),
ji=new y(null,"formatter","formatter",-483008823),ki=new y(null,"value","value",305978217),li=new y(null,"green","green",-945526839),mi=new y(null,"section","section",-300141526),ni=new y(null,"circle","circle",1903212362),oi=new y(null,"drop","drop",364481611),pi=new y(null,"tracer","tracer",-1844475765),qi=new y(null,"width","width",-384071477),ri=new y(null,"supply","supply",-1701696309),si=new y(null,"spath","spath",-1857758005),ti=new y(null,"source-spout-y","source-spout-y",1447094571),ui=new y(null,
"onclick","onclick",1297553739),vi=new y(null,"dy","dy",1719547243),wi=new y(null,"penny","penny",1653999051),xi=new y(null,"params","params",710516235),yi=new y(null,"total-output","total-output",1149740747),zi=new y(null,"easing","easing",735372043),Xg=new y(null,"val","val",128701612),Y=new y(null,"recur","recur",-437573268),Ai=new y(null,"type","type",1174270348),Bi=new y(null,"catch-block","catch-block",1175212748),Ci=new y(null,"duration","duration",1444101068),Di=new y(null,"execute","execute",
-129499188),Ei=new y(null,"constrained","constrained",597287981),Fi=new y(null,"intaking?","intaking?",834765),Wg=new y(null,"fallback-impl","fallback-impl",-1501286995),Gi=new y(null,"output","output",-1105869043),Hi=new y(null,"original-setup","original-setup",2029721421),Fa=new y(null,"flush-on-newline","flush-on-newline",-151457939),Ii=new y(null,"normal","normal",-1519123858),Ji=new y(null,"wip","wip",-103467282),Ki=new y(null,"averages","averages",-1747836978),Li=new y(null,"className","className",
-1983287057),jh=new y(null,"descendants","descendants",1824886031),Mi=new y(null,"size","size",1098693007),Ni=new y(null,"accessor","accessor",-25476721),Oi=new y(null,"title","title",636505583),Pi=new y(null,"running","running",1554969103),Qi=new y(null,"no-op","no-op",-93046065),Ri=new qc(null,"folder","folder",-1138554033,null),Si=new y(null,"num-needed-params","num-needed-params",-1219326097),Ti=new y(null,"dropping","dropping",125809647),Ui=new y(null,"high","high",2027297808),Vi=new y(null,
"setup","setup",1987730512),mh=new y(null,"ancestors","ancestors",-776045424),Wi=new y(null,"style","style",-496642736),Xi=new y(null,"div","div",1057191632),Ga=new y(null,"readably","readably",1129599760),Yi=new y(null,"params-idx","params-idx",340984624),Zi=new qc(null,"box","box",-1123515375,null),Og=new y(null,"more-marker","more-marker",-14717935),$i=new y(null,"percent-utilization","percent-utilization",-2006109103),aj=new y(null,"g","g",1738089905),bj=new y(null,"update-stats","update-stats",
1938193073),cj=new y(null,"basic+efficient+constrained","basic+efficient+constrained",-815375631),dj=new y(null,"info?","info?",361925553),ej=new y(null,"transfer-to-next-station","transfer-to-next-station",-114193262),fj=new y(null,"set-spacing","set-spacing",1920968978),gj=new y(null,"intake","intake",-108984782),hj=new qc(null,"coll","coll",-1006698606,null),ij=new y(null,"line","line",212345235),jj=new y(null,"basic+efficient+constrained+fixed","basic+efficient+constrained+fixed",-963095949),
kj=new qc(null,"val","val",1769233139,null),lj=new qc(null,"xf","xf",2042434515,null),Ka=new y(null,"print-length","print-length",1931866356),mj=new y(null,"select*","select*",-1829914060),nj=new y(null,"cx","cx",1272694324),oj=new y(null,"id","id",-1388402092),pj=new y(null,"class","class",-2030961996),qj=new y(null,"red","red",-969428204),rj=new y(null,"blue","blue",-622100620),sj=new y(null,"cy","cy",755331060),tj=new y(null,"catch-exception","catch-exception",-1997306795),uj=new y(null,"total-input",
"total-input",1219129557),ih=new y(null,"parents","parents",-2027538891),vj=new y(null,"collect-val","collect-val",801894069),wj=new y(null,"xlink:href","xlink:href",828777205),xj=new y(null,"prev","prev",-1597069226),yj=new y(null,"svg","svg",856789142),zj=new y(null,"info","info",-317069002),Aj=new y(null,"bin-h","bin-h",346004918),Bj=new y(null,"length","length",588987862),Ej=new y(null,"continue-block","continue-block",-1852047850),Fj=new y(null,"hookTransition","hookTransition",-1045887913),
Gj=new y(null,"tracer-reset","tracer-reset",283192087),Hj=new y(null,"distribution","distribution",-284555369),Ij=new y(null,"transfer-to-processed","transfer-to-processed",198231991),Jj=new y(null,"roll","roll",11266999),Kj=new y(null,"position","position",-2011731912),Lj=new y(null,"graphs","graphs",-1584479112),Mj=new y(null,"basic","basic",1043717368),Nj=new y(null,"image","image",-58725096),Oj=new y(null,"d","d",1972142424),Pj=new y(null,"average","average",-492356168),Qj=new y(null,"dropping?",
"dropping?",-1065207176),Rj=new y(null,"processed","processed",800622264),Sj=new y(null,"x","x",2099068185),Tj=new y(null,"run-next","run-next",1110241561),Uj=new y(null,"x1","x1",-1863922247),Vj=new y(null,"tracer-start","tracer-start",1036491225),Wj=new y(null,"domain","domain",1847214937),Xj=new y(null,"transform-fns","transform-fns",669042649),Ce=new qc(null,"quote","quote",1377916282,null),Yj=new y(null,"purple","purple",-876021126),Zj=new y(null,"fixed","fixed",-562004358),Be=new y(null,"arglists",
"arglists",1661989754),lf=new y(null,"dice","dice",707777434),ak=new y(null,"y2","y2",-718691301),bk=new y(null,"set-lengths","set-lengths",742672507),Ae=new qc(null,"nil-iter","nil-iter",1101030523,null),ck=new y(null,"main","main",-2117802661),dk=new y(null,"hierarchy","hierarchy",-1053470341),Vg=new y(null,"alt-impl","alt-impl",670969595),ek=new y(null,"under-utilized","under-utilized",-524567781),fk=new qc(null,"fn-handler","fn-handler",648785851,null),gk=new y(null,"doc","doc",1913296891),hk=
new y(null,"integrate","integrate",-1653689604),ik=new y(null,"rect","rect",-108902628),jk=new y(null,"step","step",1288888124),kk=new y(null,"delay","delay",-574225219),lk=new y(null,"stats","stats",-85643011),mk=new y(null,"x2","x2",-1362513475),nk=new y(null,"pennies","pennies",1847043709),ok=new y(null,"incoming","incoming",-1710131427),pk=new y(null,"productivity","productivity",-890721314),qk=new y(null,"range","range",1639692286),rk=new y(null,"height","height",1025178622),sk=new y(null,"spacing",
"spacing",204422175),tk=new y(null,"left","left",-399115937),uk=new y("cljs.core","not-found","cljs.core/not-found",-1572889185),vk=new y(null,"foreignObject","foreignObject",25502111),wk=new y(null,"text","text",-1790561697),xk=new y(null,"data","data",-232669377),yk=new qc(null,"f","f",43394975,null);var zk;function Ak(a){return a.l?a.l():a.call(null)}function Bk(a,b,c){return vd(c)?Hb(c,a,b):null==c?b:Oa(c)?Xc(c,a,b):Gb.c(c,a,b)}
var Ck=function Ck(b,c,d,e){if(null!=b&&null!=b.qc)return b.qc(b,c,d,e);var f=Ck[t(null==b?null:b)];if(null!=f)return f.m?f.m(b,c,d,e):f.call(null,b,c,d,e);f=Ck._;if(null!=f)return f.m?f.m(b,c,d,e):f.call(null,b,c,d,e);throw Ra("CollFold.coll-fold",b);},Dk=function Dk(b,c){"undefined"===typeof zk&&(zk=function(b,c,f,g){this.gd=b;this.fc=c;this.ab=f;this.jd=g;this.g=917504;this.C=0},zk.prototype.P=function(b,c){return new zk(this.gd,this.fc,this.ab,c)},zk.prototype.O=function(){return this.jd},zk.prototype.ea=
function(b,c){return Gb.c(this.fc,this.ab.b?this.ab.b(c):this.ab.call(null,c),c.l?c.l():c.call(null))},zk.prototype.fa=function(b,c,f){return Gb.c(this.fc,this.ab.b?this.ab.b(c):this.ab.call(null,c),f)},zk.prototype.qc=function(b,c,f,g){return Ck(this.fc,c,f,this.ab.b?this.ab.b(g):this.ab.call(null,g))},zk.ic=function(){return new Q(null,4,5,S,[Qc(Ri,new u(null,2,[Be,pc(Ce,pc(new Q(null,2,5,S,[hj,lj],null))),gk,"Given a foldable collection, and a transformation function xf,\n  returns a foldable collection, where any supplied reducing\n  fn will be transformed by xf. xf is a function of reducing fn to\n  reducing fn."],
null)),hj,lj,ua.Ed],null)},zk.xb=!0,zk.eb="clojure.core.reducers/t_clojure$core$reducers19004",zk.Tb=function(b,c){return Qb(c,"clojure.core.reducers/t_clojure$core$reducers19004")});return new zk(Dk,b,c,De)};
function Ek(a,b){return Dk(b,function(b){return function(){function d(d,e,f){e=a.a?a.a(e,f):a.call(null,e,f);return b.a?b.a(d,e):b.call(null,d,e)}function e(d,e){var f=a.b?a.b(e):a.call(null,e);return b.a?b.a(d,f):b.call(null,d,f)}function f(){return b.l?b.l():b.call(null)}var g=null,g=function(a,b,c){switch(arguments.length){case 0:return f.call(this);case 2:return e.call(this,a,b);case 3:return d.call(this,a,b,c)}throw Error("Invalid arity: "+arguments.length);};g.l=f;g.a=e;g.c=d;return g}()})}
function Fk(a,b){return Dk(b,function(b){return function(){function d(d,e,f){return Bk(b,d,a.a?a.a(e,f):a.call(null,e,f))}function e(d,e){return Bk(b,d,a.b?a.b(e):a.call(null,e))}function f(){return b.l?b.l():b.call(null)}var g=null,g=function(a,b,c){switch(arguments.length){case 0:return f.call(this);case 2:return e.call(this,a,b);case 3:return d.call(this,a,b,c)}throw Error("Invalid arity: "+arguments.length);};g.l=f;g.a=e;g.c=d;return g}()})}
var Gk=function Gk(b,c,d,e){if(sd(b))return d.l?d.l():d.call(null);if(O(b)<=c)return Bk(e,d.l?d.l():d.call(null),b);var f=Vd(O(b)),g=Ef.c(b,0,f);b=Ef.c(b,f,O(b));return Ak(function(b,c,e,f){return function(){var b=f(c),g;g=f(e);b=b.l?b.l():b.call(null);g=g.l?g.l():g.call(null);return d.a?d.a(b,g):d.call(null,b,g)}}(f,g,b,function(b,f,g){return function(n){return function(){return function(){return Gk(n,c,d,e)}}(b,f,g)}}(f,g,b)))};Ck["null"]=function(a,b,c){return c.l?c.l():c.call(null)};
Ck.object=function(a,b,c,d){return Bk(d,c.l?c.l():c.call(null),a)};Q.prototype.qc=function(a,b,c,d){return Gk(this,b,c,d)};function Hk(){}
var Ik=function Ik(b,c,d){if(null!=b&&null!=b.zb)return b.zb(b,c,d);var e=Ik[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Ik._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ra("StructurePath.select*",b);},Jk=function Jk(b,c,d){if(null!=b&&null!=b.Ab)return b.Ab(b,c,d);var e=Jk[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Jk._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ra("StructurePath.transform*",b);};
function Kk(){}var Lk=function Lk(b,c){if(null!=b&&null!=b.rc)return b.rc(0,c);var d=Lk[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Lk._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("Collector.collect-val",b);};var Mk=function Mk(b){if(null!=b&&null!=b.Gc)return b.Gc();var c=Mk[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Mk._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("PathComposer.comp-paths*",b);};function Nk(a,b,c){this.type=a;this.sd=b;this.ud=c}var Ok;
Ok=new Nk(Ih,function(a,b,c,d){var e=function(){return function(a,b,c,d){return sd(c)?new Q(null,1,5,S,[d],null):new Q(null,1,5,S,[id.a(c,d)],null)}}(a,b,jd,d);return c.A?c.A(a,b,jd,d,e):c.call(null,a,b,jd,d,e)},function(a,b,c,d,e){var f=function(){return function(a,b,c,e){return sd(c)?d.b?d.b(e):d.call(null,e):C.a(d,id.a(c,e))}}(a,b,jd,e);return c.A?c.A(a,b,jd,e,f):c.call(null,a,b,jd,e,f)});var Pk;
Pk=new Nk(si,function(a,b,c,d){a=function(){return function(a){return new Q(null,1,5,S,[a],null)}}(d);return c.a?c.a(d,a):c.call(null,d,a)},function(a,b,c,d,e){return c.a?c.a(e,d):c.call(null,e,d)});function Qk(a,b,c,d,e,f){this.Ka=a;this.La=b;this.Ma=c;this.S=d;this.G=e;this.u=f;this.g=2229667594;this.C=8192}k=Qk.prototype;k.N=function(a,b){return mb.c(this,b,null)};
k.I=function(a,b,c){switch(b instanceof y?b.Ha:null){case "executors":return this.Ka;case "selector":return this.La;case "transformer":return this.Ma;default:return D.c(this.G,b,c)}};k.M=function(a,b,c){return zf(b,function(){return function(a){return zf(b,Af,""," ","",c,a)}}(this),"#com.rpl.specter.impl.TransformFunctions{",", ","}",c,te.a(new Q(null,3,5,S,[new Q(null,2,5,S,[Ph,this.Ka],null),new Q(null,2,5,S,[Eh,this.La],null),new Q(null,2,5,S,[Mh,this.Ma],null)],null),this.G))};
k.Ga=function(){return new Mf(0,this,3,new Q(null,3,5,S,[Ph,Eh,Mh],null),hc(this.G))};k.O=function(){return this.S};k.Z=function(){return 3+O(this.G)};k.T=function(){var a=this.u;return null!=a?a:this.u=a=ae(this)};k.D=function(a,b){var c;c=x(b)?(c=this.constructor===b.constructor)?Lf(this,b):c:b;return x(c)?!0:!1};
k.ib=function(a,b){return Fd(new Bg(null,new u(null,3,[Eh,null,Mh,null,Ph,null],null),null),b)?pd.a(Qc(cf.a(De,this),this.S),b):new Qk(this.Ka,this.La,this.Ma,this.S,ye(pd.a(this.G,b)),null)};
k.Oa=function(a,b,c){return x(U.a?U.a(Ph,b):U.call(null,Ph,b))?new Qk(c,this.La,this.Ma,this.S,this.G,null):x(U.a?U.a(Eh,b):U.call(null,Eh,b))?new Qk(this.Ka,c,this.Ma,this.S,this.G,null):x(U.a?U.a(Mh,b):U.call(null,Mh,b))?new Qk(this.Ka,this.La,c,this.S,this.G,null):new Qk(this.Ka,this.La,this.Ma,this.S,nd.c(this.G,b,c),null)};k.V=function(){return H(te.a(new Q(null,3,5,S,[new Q(null,2,5,S,[Ph,this.Ka],null),new Q(null,2,5,S,[Eh,this.La],null),new Q(null,2,5,S,[Mh,this.Ma],null)],null),this.G))};
k.P=function(a,b){return new Qk(this.Ka,this.La,this.Ma,b,this.G,this.u)};k.X=function(a,b){return wd(b)?qb(this,gb.a(b,0),gb.a(b,1)):Za.c(eb,this,b)};function Rk(a,b,c){return new Qk(a,b,c,null,null,null)}function Sk(a,b,c,d,e,f){this.va=a;this.Xa=b;this.Ya=c;this.S=d;this.G=e;this.u=f;this.g=2229667594;this.C=8192}k=Sk.prototype;k.N=function(a,b){return mb.c(this,b,null)};
k.I=function(a,b,c){switch(b instanceof y?b.Ha:null){case "transform-fns":return this.va;case "params":return this.Xa;case "params-idx":return this.Ya;default:return D.c(this.G,b,c)}};k.M=function(a,b,c){return zf(b,function(){return function(a){return zf(b,Af,""," ","",c,a)}}(this),"#com.rpl.specter.impl.CompiledPath{",", ","}",c,te.a(new Q(null,3,5,S,[new Q(null,2,5,S,[Xj,this.va],null),new Q(null,2,5,S,[xi,this.Xa],null),new Q(null,2,5,S,[Yi,this.Ya],null)],null),this.G))};
k.Ga=function(){return new Mf(0,this,3,new Q(null,3,5,S,[Xj,xi,Yi],null),hc(this.G))};k.O=function(){return this.S};k.Z=function(){return 3+O(this.G)};k.T=function(){var a=this.u;return null!=a?a:this.u=a=ae(this)};k.D=function(a,b){var c;c=x(b)?(c=this.constructor===b.constructor)?Lf(this,b):c:b;return x(c)?!0:!1};
k.ib=function(a,b){return Fd(new Bg(null,new u(null,3,[xi,null,Yi,null,Xj,null],null),null),b)?pd.a(Qc(cf.a(De,this),this.S),b):new Sk(this.va,this.Xa,this.Ya,this.S,ye(pd.a(this.G,b)),null)};
k.Oa=function(a,b,c){return x(U.a?U.a(Xj,b):U.call(null,Xj,b))?new Sk(c,this.Xa,this.Ya,this.S,this.G,null):x(U.a?U.a(xi,b):U.call(null,xi,b))?new Sk(this.va,c,this.Ya,this.S,this.G,null):x(U.a?U.a(Yi,b):U.call(null,Yi,b))?new Sk(this.va,this.Xa,c,this.S,this.G,null):new Sk(this.va,this.Xa,this.Ya,this.S,nd.c(this.G,b,c),null)};k.V=function(){return H(te.a(new Q(null,3,5,S,[new Q(null,2,5,S,[Xj,this.va],null),new Q(null,2,5,S,[xi,this.Xa],null),new Q(null,2,5,S,[Yi,this.Ya],null)],null),this.G))};
k.P=function(a,b){return new Sk(this.va,this.Xa,this.Ya,b,this.G,this.u)};k.X=function(a,b){return wd(b)?qb(this,gb.a(b,0),gb.a(b,1)):Za.c(eb,this,b)};function Tk(a){return new Sk(a,null,0,null,null,null)}Z;function Uk(a,b,c,d,e){this.va=a;this.rb=b;this.S=c;this.G=d;this.u=e;this.g=2229667595;this.C=8192}k=Uk.prototype;k.N=function(a,b){return mb.c(this,b,null)};
k.I=function(a,b,c){switch(b instanceof y?b.Ha:null){case "transform-fns":return this.va;case "num-needed-params":return this.rb;default:return D.c(this.G,b,c)}};k.M=function(a,b,c){return zf(b,function(){return function(a){return zf(b,Af,""," ","",c,a)}}(this),"#com.rpl.specter.impl.ParamsNeededPath{",", ","}",c,te.a(new Q(null,2,5,S,[new Q(null,2,5,S,[Xj,this.va],null),new Q(null,2,5,S,[Si,this.rb],null)],null),this.G))};k.Ga=function(){return new Mf(0,this,2,new Q(null,2,5,S,[Xj,Si],null),hc(this.G))};
k.call=function(){function a(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,A,E,F,M,J){a=qe(te.a(new Q(null,20,5,S,[b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,A,E,F,M],null),J));return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function b(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,A,E,F,M){a=qe(20);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;a[14]=z;a[15]=v;a[16]=A;a[17]=E;a[18]=F;a[19]=M;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function c(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,
z,v,A,E,F){a=qe(19);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;a[14]=z;a[15]=v;a[16]=A;a[17]=E;a[18]=F;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function d(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,A,E){a=qe(18);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;a[14]=z;a[15]=v;a[16]=A;a[17]=E;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function e(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v,A){a=qe(17);
a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;a[14]=z;a[15]=v;a[16]=A;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function f(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,v){a=qe(16);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;a[14]=z;a[15]=v;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function g(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z){a=qe(15);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;
a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;a[14]=z;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function h(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w){a=qe(14);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function l(a,b,c,d,e,f,g,h,l,m,n,p,q,r){a=qe(13);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function m(a,
b,c,d,e,f,g,h,l,m,n,p,q){a=qe(12);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function n(a,b,c,d,e,f,g,h,l,m,n,p){a=qe(11);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function p(a,b,c,d,e,f,g,h,l,m,n){a=qe(10);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function q(a,
b,c,d,e,f,g,h,l,m){a=qe(9);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function r(a,b,c,d,e,f,g,h,l){a=qe(8);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function v(a,b,c,d,e,f,g,h){a=qe(7);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function w(a,b,c,d,e,f,g){a=qe(6);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;return Z.c?Z.c(this,
a,0):Z.call(null,this,a,0)}function z(a,b,c,d,e,f){a=qe(5);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function A(a,b,c,d,e){a=qe(4);a[0]=b;a[1]=c;a[2]=d;a[3]=e;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function F(a,b,c,d){a=qe(3);a[0]=b;a[1]=c;a[2]=d;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function J(a,b,c){a=qe(2);a[0]=b;a[1]=c;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function M(a,b){var c=qe(1);c[0]=b;return Z.c?Z.c(this,c,0):Z.call(null,
this,c,0)}function Ba(){var a=qe(0);return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}var E=null,E=function(E,ka,R,fa,X,ha,W,ma,oa,qa,va,ya,Ta,Aa,Ja,Ua,Va,pb,Bb,Ya,Cc,cd){switch(arguments.length){case 1:return Ba.call(this);case 2:return M.call(this,0,ka);case 3:return J.call(this,0,ka,R);case 4:return F.call(this,0,ka,R,fa);case 5:return A.call(this,0,ka,R,fa,X);case 6:return z.call(this,0,ka,R,fa,X,ha);case 7:return w.call(this,0,ka,R,fa,X,ha,W);case 8:return v.call(this,0,ka,R,fa,X,ha,W,ma);case 9:return r.call(this,
0,ka,R,fa,X,ha,W,ma,oa);case 10:return q.call(this,0,ka,R,fa,X,ha,W,ma,oa,qa);case 11:return p.call(this,0,ka,R,fa,X,ha,W,ma,oa,qa,va);case 12:return n.call(this,0,ka,R,fa,X,ha,W,ma,oa,qa,va,ya);case 13:return m.call(this,0,ka,R,fa,X,ha,W,ma,oa,qa,va,ya,Ta);case 14:return l.call(this,0,ka,R,fa,X,ha,W,ma,oa,qa,va,ya,Ta,Aa);case 15:return h.call(this,0,ka,R,fa,X,ha,W,ma,oa,qa,va,ya,Ta,Aa,Ja);case 16:return g.call(this,0,ka,R,fa,X,ha,W,ma,oa,qa,va,ya,Ta,Aa,Ja,Ua);case 17:return f.call(this,0,ka,R,fa,
X,ha,W,ma,oa,qa,va,ya,Ta,Aa,Ja,Ua,Va);case 18:return e.call(this,0,ka,R,fa,X,ha,W,ma,oa,qa,va,ya,Ta,Aa,Ja,Ua,Va,pb);case 19:return d.call(this,0,ka,R,fa,X,ha,W,ma,oa,qa,va,ya,Ta,Aa,Ja,Ua,Va,pb,Bb);case 20:return c.call(this,0,ka,R,fa,X,ha,W,ma,oa,qa,va,ya,Ta,Aa,Ja,Ua,Va,pb,Bb,Ya);case 21:return b.call(this,0,ka,R,fa,X,ha,W,ma,oa,qa,va,ya,Ta,Aa,Ja,Ua,Va,pb,Bb,Ya,Cc);case 22:return a.call(this,0,ka,R,fa,X,ha,W,ma,oa,qa,va,ya,Ta,Aa,Ja,Ua,Va,pb,Bb,Ya,Cc,cd)}throw Error("Invalid arity: "+arguments.length);
};E.b=Ba;E.a=M;E.c=J;E.m=F;E.A=A;E.Y=z;E.ba=w;E.ra=v;E.sa=r;E.ga=q;E.ha=p;E.ia=n;E.ja=m;E.ka=l;E.la=h;E.ma=g;E.na=f;E.oa=e;E.pa=d;E.qa=c;E.Kb=b;E.wb=a;return E}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Xa(b)))};k.l=function(){var a=qe(0);return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)};k.b=function(a){var b=qe(1);b[0]=a;return Z.c?Z.c(this,b,0):Z.call(null,this,b,0)};k.a=function(a,b){var c=qe(2);c[0]=a;c[1]=b;return Z.c?Z.c(this,c,0):Z.call(null,this,c,0)};
k.c=function(a,b,c){var d=qe(3);d[0]=a;d[1]=b;d[2]=c;return Z.c?Z.c(this,d,0):Z.call(null,this,d,0)};k.m=function(a,b,c,d){var e=qe(4);e[0]=a;e[1]=b;e[2]=c;e[3]=d;return Z.c?Z.c(this,e,0):Z.call(null,this,e,0)};k.A=function(a,b,c,d,e){var f=qe(5);f[0]=a;f[1]=b;f[2]=c;f[3]=d;f[4]=e;return Z.c?Z.c(this,f,0):Z.call(null,this,f,0)};k.Y=function(a,b,c,d,e,f){var g=qe(6);g[0]=a;g[1]=b;g[2]=c;g[3]=d;g[4]=e;g[5]=f;return Z.c?Z.c(this,g,0):Z.call(null,this,g,0)};
k.ba=function(a,b,c,d,e,f,g){var h=qe(7);h[0]=a;h[1]=b;h[2]=c;h[3]=d;h[4]=e;h[5]=f;h[6]=g;return Z.c?Z.c(this,h,0):Z.call(null,this,h,0)};k.ra=function(a,b,c,d,e,f,g,h){var l=qe(8);l[0]=a;l[1]=b;l[2]=c;l[3]=d;l[4]=e;l[5]=f;l[6]=g;l[7]=h;return Z.c?Z.c(this,l,0):Z.call(null,this,l,0)};k.sa=function(a,b,c,d,e,f,g,h,l){var m=qe(9);m[0]=a;m[1]=b;m[2]=c;m[3]=d;m[4]=e;m[5]=f;m[6]=g;m[7]=h;m[8]=l;return Z.c?Z.c(this,m,0):Z.call(null,this,m,0)};
k.ga=function(a,b,c,d,e,f,g,h,l,m){var n=qe(10);n[0]=a;n[1]=b;n[2]=c;n[3]=d;n[4]=e;n[5]=f;n[6]=g;n[7]=h;n[8]=l;n[9]=m;return Z.c?Z.c(this,n,0):Z.call(null,this,n,0)};k.ha=function(a,b,c,d,e,f,g,h,l,m,n){var p=qe(11);p[0]=a;p[1]=b;p[2]=c;p[3]=d;p[4]=e;p[5]=f;p[6]=g;p[7]=h;p[8]=l;p[9]=m;p[10]=n;return Z.c?Z.c(this,p,0):Z.call(null,this,p,0)};
k.ia=function(a,b,c,d,e,f,g,h,l,m,n,p){var q=qe(12);q[0]=a;q[1]=b;q[2]=c;q[3]=d;q[4]=e;q[5]=f;q[6]=g;q[7]=h;q[8]=l;q[9]=m;q[10]=n;q[11]=p;return Z.c?Z.c(this,q,0):Z.call(null,this,q,0)};k.ja=function(a,b,c,d,e,f,g,h,l,m,n,p,q){var r=qe(13);r[0]=a;r[1]=b;r[2]=c;r[3]=d;r[4]=e;r[5]=f;r[6]=g;r[7]=h;r[8]=l;r[9]=m;r[10]=n;r[11]=p;r[12]=q;return Z.c?Z.c(this,r,0):Z.call(null,this,r,0)};
k.ka=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){var v=qe(14);v[0]=a;v[1]=b;v[2]=c;v[3]=d;v[4]=e;v[5]=f;v[6]=g;v[7]=h;v[8]=l;v[9]=m;v[10]=n;v[11]=p;v[12]=q;v[13]=r;return Z.c?Z.c(this,v,0):Z.call(null,this,v,0)};k.la=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v){var w=qe(15);w[0]=a;w[1]=b;w[2]=c;w[3]=d;w[4]=e;w[5]=f;w[6]=g;w[7]=h;w[8]=l;w[9]=m;w[10]=n;w[11]=p;w[12]=q;w[13]=r;w[14]=v;return Z.c?Z.c(this,w,0):Z.call(null,this,w,0)};
k.ma=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w){var z=qe(16);z[0]=a;z[1]=b;z[2]=c;z[3]=d;z[4]=e;z[5]=f;z[6]=g;z[7]=h;z[8]=l;z[9]=m;z[10]=n;z[11]=p;z[12]=q;z[13]=r;z[14]=v;z[15]=w;return Z.c?Z.c(this,z,0):Z.call(null,this,z,0)};k.na=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z){var A=qe(17);A[0]=a;A[1]=b;A[2]=c;A[3]=d;A[4]=e;A[5]=f;A[6]=g;A[7]=h;A[8]=l;A[9]=m;A[10]=n;A[11]=p;A[12]=q;A[13]=r;A[14]=v;A[15]=w;A[16]=z;return Z.c?Z.c(this,A,0):Z.call(null,this,A,0)};
k.oa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A){var F=qe(18);F[0]=a;F[1]=b;F[2]=c;F[3]=d;F[4]=e;F[5]=f;F[6]=g;F[7]=h;F[8]=l;F[9]=m;F[10]=n;F[11]=p;F[12]=q;F[13]=r;F[14]=v;F[15]=w;F[16]=z;F[17]=A;return Z.c?Z.c(this,F,0):Z.call(null,this,F,0)};k.pa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F){var J=qe(19);J[0]=a;J[1]=b;J[2]=c;J[3]=d;J[4]=e;J[5]=f;J[6]=g;J[7]=h;J[8]=l;J[9]=m;J[10]=n;J[11]=p;J[12]=q;J[13]=r;J[14]=v;J[15]=w;J[16]=z;J[17]=A;J[18]=F;return Z.c?Z.c(this,J,0):Z.call(null,this,J,0)};
k.qa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F,J){var M=qe(20);M[0]=a;M[1]=b;M[2]=c;M[3]=d;M[4]=e;M[5]=f;M[6]=g;M[7]=h;M[8]=l;M[9]=m;M[10]=n;M[11]=p;M[12]=q;M[13]=r;M[14]=v;M[15]=w;M[16]=z;M[17]=A;M[18]=F;M[19]=J;return Z.c?Z.c(this,M,0):Z.call(null,this,M,0)};k.Kb=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F,J,M){a=qe(te.a(new Q(null,20,5,S,[a,b,c,d,e,f,g,h,l,m,n,p,q,r,v,w,z,A,F,J],null),M));return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)};k.O=function(){return this.S};
k.Z=function(){return 2+O(this.G)};k.T=function(){var a=this.u;return null!=a?a:this.u=a=ae(this)};k.D=function(a,b){var c;c=x(b)?(c=this.constructor===b.constructor)?Lf(this,b):c:b;return x(c)?!0:!1};k.ib=function(a,b){return Fd(new Bg(null,new u(null,2,[Si,null,Xj,null],null),null),b)?pd.a(Qc(cf.a(De,this),this.S),b):new Uk(this.va,this.rb,this.S,ye(pd.a(this.G,b)),null)};
k.Oa=function(a,b,c){return x(U.a?U.a(Xj,b):U.call(null,Xj,b))?new Uk(c,this.rb,this.S,this.G,null):x(U.a?U.a(Si,b):U.call(null,Si,b))?new Uk(this.va,c,this.S,this.G,null):new Uk(this.va,this.rb,this.S,nd.c(this.G,b,c),null)};k.V=function(){return H(te.a(new Q(null,2,5,S,[new Q(null,2,5,S,[Xj,this.va],null),new Q(null,2,5,S,[Si,this.rb],null)],null),this.G))};k.P=function(a,b){return new Uk(this.va,this.rb,b,this.G,this.u)};
k.X=function(a,b){return wd(b)?qb(this,gb.a(b,0),gb.a(b,1)):Za.c(eb,this,b)};function Vk(a,b){return new Uk(a,b,null,null,null)}function Z(a,b,c){return new Sk(a.va,b,c,null,null,null)}function Wk(a){return new u(null,2,[mj,null!=a&&a.yb?function(a,c,d){return a.zb(null,c,d)}:Ik,ai,null!=a&&a.yb?function(a,c,d){return a.Ab(null,c,d)}:Jk],null)}function Xk(a){return new u(null,1,[vj,null!=a&&a.Jc?function(a,c){return a.rc(0,c)}:Lk],null)}
function Yk(a){var b=function(b){return function(d,e,f,g,h){f=id.a(f,b.a?b.a(a,g):b.call(null,a,g));return h.m?h.m(d,e,f,g):h.call(null,d,e,f,g)}}(vj.b(Xk(a)));return Tk(Rk(Ok,b,b))}function Zk(a){var b=Wk(a),c=mj.b(b),d=ai.b(b);return Tk(Rk(Pk,function(b,c){return function(b,d){return c.c?c.c(a,b,d):c.call(null,a,b,d)}}(b,c,d),function(b,c,d){return function(b,c){return d.c?d.c(a,b,c):d.call(null,a,b,c)}}(b,c,d)))}
var $k=function $k(b){if(null!=b&&null!=b.lb)return b.lb(b);var c=$k[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=$k._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("CoercePath.coerce-path",b);};$k["null"]=function(){return Zk(null)};Sk.prototype.lb=function(){return this};Uk.prototype.lb=function(){return this};Q.prototype.lb=function(){return Mk(this)};Bc.prototype.lb=function(){return $k(Kd(this))};ee.prototype.lb=function(){return $k(Kd(this))};ad.prototype.lb=function(){return $k(Kd(this))};
$k._=function(a){var b;b=(b=(b=ca(a))?b:null!=a?a.Pc?!0:a.ec?!1:Qa($a,a):Qa($a,a))?b:null!=a?a.yb?!0:a.ec?!1:Qa(Hk,a):Qa(Hk,a);if(x(b))a=Zk(a);else if(null!=a?a.Jc||(a.ec?0:Qa(Kk,a)):Qa(Kk,a))a=Yk(a);else throw b=G,a=[B("Protocol implementation cannot be found for object.\n        Extending Specter protocols should not be done inline in a deftype definition\n        because that prevents Specter from finding the protocol implementations for\n        optimized performance. Instead, you should extend the protocols via an\n        explicit extend-protocol call. \n"),
B(a)].join(""),a=b([a],0),Error(C.a(B,a));return a};function al(a){return a.Ka.type}
function bl(a){var b=P(a,0),c=Xd(a,1),d=b.Ka,e=d.type,f=rc.a(e,Ih)?function(a,b,c,d,e,f){return function(q,r){return function(a,b,c,d,e,f){return function(g,h,l,m,n){var p=function(){return function(a,b,c,d){return r.A?r.A(a,b,c,d,n):r.call(null,a,b,c,d,n)}}(g,h,l,m,a,b,c,d,e,f);return q.A?q.A(g,h,l,m,p):q.call(null,g,h,l,m,p)}}(a,b,c,d,e,f)}}(d,e,a,b,c,a):function(a,b,c,d,e,f){return function(q,r){return function(a,b,c,d,e,f){return function(g,h){var l=function(){return function(a){return r.a?r.a(a,
h):r.call(null,a,h)}}(g,a,b,c,d,e,f);return q.a?q.a(g,l):q.call(null,g,l)}}(a,b,c,d,e,f)}}(d,e,a,b,c,a);return Za.a(function(a,b,c){return function(b,d){return Rk(a,function(){var a=b.La,e=d.La;return c.a?c.a(a,e):c.call(null,a,e)}(),function(){var a=b.Ma,e=d.Ma;return c.a?c.a(a,e):c.call(null,a,e)}())}}(d,e,f,a,b,c,a),a)}
function cl(a){if(rc.a(al(a),Ih))return a;var b=a.La;a=a.Ma;return Rk(Ok,function(a,b){return function(e,f,g,h,l){var m=function(){return function(a){return l.m?l.m(e,f,g,a):l.call(null,e,f,g,a)}}(h,a,b);return a.a?a.a(h,m):a.call(null,h,m)}}(b,a),function(a,b){return function(e,f,g,h,l){var m=function(){return function(a){return l.m?l.m(e,f,g,a):l.call(null,e,f,g,a)}}(h,a,b);return b.a?b.a(h,m):b.call(null,h,m)}}(b,a))}
function dl(a){if(a instanceof Sk){var b=xi.b(a),c=Yi.b(a),d=Eh.b(Xj.b(a)),e=Mh.b(Xj.b(a));return sd(b)?a:Tk(Rk(Ok,function(a,b,c,d){return function(e,n,p,q,r){var v=function(){return function(a,b,c,d){return r.m?r.m(e,n,c,d):r.call(null,e,n,c,d)}}(a,b,p,q,a,b,c,d);return c.A?c.A(a,b,p,q,v):c.call(null,a,b,p,q,v)}}(b,c,d,e),function(a,b,c,d){return function(e,n,p,q,r){var v=function(){return function(a,b,c,d){return r.m?r.m(e,n,c,d):r.call(null,e,n,c,d)}}(a,b,p,q,a,b,c,d);return d.A?d.A(a,b,p,q,v):
d.call(null,a,b,p,q,v)}}(b,c,d,e)))}return a}Mk["null"]=function(a){return $k(a)};Mk._=function(a){return $k(a)};Q.prototype.Gc=function(){if(sd(this))return $k(null);var a=T.a(dl,T.a($k,this)),b=T.a(bl,Kg(al,T.a(Xj,a))),c=rc.a(1,O(b))?I(b):bl(T.a(cl,b)),a=af(function(){return function(a){return a instanceof Uk}}(a,b,c,this),a);return sd(a)?Tk(c):Vk(cl(c),Za.a(Nd,T.a(Si,a)))};function el(a){return a instanceof Sk?0:Si.b(a)}
var fl=function fl(b,c){if(null!=b&&null!=b.Hc)return b.Hc(0,c);var d=fl[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=fl._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("SetExtremes.set-first",b);},gl=function gl(b,c){if(null!=b&&null!=b.Ic)return b.Ic(0,c);var d=gl[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=gl._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("SetExtremes.set-last",b);};
Q.prototype.Hc=function(a,b){return nd.c(this,0,b)};Q.prototype.Ic=function(a,b){return nd.c(this,O(this)-1,b)};fl._=function(a,b){return N(b,Dc(a))};gl._=function(a,b){var c=Eg(a);return id.a(Kd(c),b)};function hl(a,b){var c=a.va;return c.Ka.sd.call(null,a.Xa,a.Ya,c.La,b)}function il(a,b,c){var d=a.va;return d.Ka.ud.call(null,a.Xa,a.Ya,d.Ma,b,c)}function jl(){}jl.prototype.yb=!0;jl.prototype.zb=function(a,b,c){return cf.a(jd,Fk(c,b))};
jl.prototype.Ab=function(a,b,c){a=null==b?null:cb(b);if(de(a))for(c=b=T.a(c,b);;)if(H(c))c=K(c);else break;else b=cf.a(a,Ek(c,b));return b};function kl(){}kl.prototype.Jc=!0;kl.prototype.rc=function(a,b){return b};function ll(a,b){this.Lc=a;this.td=b}ll.prototype.yb=!0;ll.prototype.zb=function(a,b,c){if(sd(b))return null;a=this.Lc.call(null,b);return c.b?c.b(a):c.call(null,a)};
ll.prototype.Ab=function(a,b,c){var d=this;return sd(b)?b:d.td.call(null,b,function(){var a=d.Lc.call(null,b);return c.b?c.b(a):c.call(null,a)}())};function ml(a,b,c,d){a=Ef.c(Kd(a),b,c);return d.b?d.b(a):d.call(null,a)}function nl(a,b,c,d){var e=Kd(a),f=Ef.c(e,b,c);d=d.b?d.b(f):d.call(null,f);b=te.i(Ef.c(e,0,b),d,G([Ef.c(e,c,O(a))],0));return wd(a)?Kd(b):b}Hk["null"]=!0;Ik["null"]=function(a,b,c){return c.b?c.b(b):c.call(null,b)};Jk["null"]=function(a,b,c){return c.b?c.b(b):c.call(null,b)};
function ol(a,b,c){return x(a.b?a.b(b):a.call(null,b))?c.b?c.b(b):c.call(null,b):null}function pl(a,b,c){return x(a.b?a.b(b):a.call(null,b))?c.b?c.b(b):c.call(null,b):b};function ql(a){return Mk(Kd(a))}function rl(a,b){var c=Mk(a);return hl.a?hl.a(c,b):hl.call(null,c,b)}function sl(a,b,c){a=Mk(a);return il.c?il.c(a,b,c):il.call(null,a,b,c)}var tl=ql(G([new jl],0)),ul=new kl,vl=ql(G([new ll(hd,gl)],0));ql(G([new ll(I,fl)],0));
var wl=Vk(Rk(Ok,function(a,b,c,d,e){var f=a[b+0],g=a[b+1];return ml(d,f.b?f.b(d):f.call(null,d),g.b?g.b(d):g.call(null,d),function(d){var f=b+2;return e.m?e.m(a,f,c,d):e.call(null,a,f,c,d)})},function(a,b,c,d,e){var f=a[b+0],g=a[b+1];return nl(d,f.b?f.b(d):f.call(null,d),g.b?g.b(d):g.call(null,d),function(d){var f=b+2;return e.m?e.m(a,f,c,d):e.call(null,a,f,c,d)})}),2),xl=Vk(Rk(Ok,function(a,b,c,d,e){return ml(d,a[b+0],a[b+1],function(d){var g=b+2;return e.m?e.m(a,g,c,d):e.call(null,a,g,c,d)})},function(a,
b,c,d,e){return nl(d,a[b+0],a[b+1],function(d){var g=b+2;return e.m?e.m(a,g,c,d):e.call(null,a,g,c,d)})}),2);xl.a?xl.a(0,0):xl.call(null,0,0);wl.a?wl.a(O,O):wl.call(null,O,O);y.prototype.yb=!0;y.prototype.zb=function(a,b,c){a=D.a(b,this);return c.b?c.b(a):c.call(null,a)};y.prototype.Ab=function(a,b,c){var d=this;return nd.c(b,d,function(){var a=D.a(b,d);return c.b?c.b(a):c.call(null,a)}())};Hk["function"]=!0;Ik["function"]=function(a,b,c){return ol(a,b,c)};
Jk["function"]=function(a,b,c){return pl(a,b,c)};Bg.prototype.yb=!0;Bg.prototype.zb=function(a,b,c){return ol(this,b,c)};Bg.prototype.Ab=function(a,b,c){return pl(this,b,c)};var yl=Vk(Rk(Ok,function(a,b,c,d,e){var f=a[b+0];d=x(d)?d:f;b+=1;return e.m?e.m(a,b,c,d):e.call(null,a,b,c,d)},function(a,b,c,d,e){var f=a[b+0];d=x(d)?d:f;b+=1;return e.m?e.m(a,b,c,d):e.call(null,a,b,c,d)}),1);yl.b?yl.b(Cg):yl.call(null,Cg);var zl=Ec;yl.b?yl.b(zl):yl.call(null,zl);yl.b?yl.b(jd):yl.call(null,jd);
function Al(){var a=G([ok],0),b=T.a(Mk,new Q(null,1,5,S,[a],null)),c=T.a(el,b),d=N(0,Lg(c)),e=hd(d),f=T.c(function(a,b,c,d){return function(e,f){return x(f instanceof Sk)?function(){return function(){return f}}(a,b,c,d):function(){return function(a,b){return Z(f,a,b+e)}}(a,b,c,d)}}(b,c,d,e),d,b),g=P(f,0),a=function(){var a=function(a,b,c,d,e,f,g){return function(a,b,c,e,f){var h;h=g.a?g.a(a,b):g.call(null,a,b);var l=hl.a?hl.a(h,e):hl.call(null,h,e);if(1<O(l))throw a=G(["More than one element found for params: ",
h,e],0),Error(C.a(B,a));h=I(l);b+=d;c=id.a(c,h);return f.m?f.m(a,b,c,e):f.call(null,a,b,c,e)}}(b,c,d,e,f,f,g);return Vk(Rk(Ok,a,a),e)}();return rc.a(0,e)?Z(a,null,0):a};var Bl=new u(null,3,[ri,2,Sh,4,Hj,1],null),Cl=new u(null,3,[ri,-1,Sh,0,Hj,0],null),Dl=new u(null,3,[ri,40,Sh,40,Hj,0],null);function El(a,b){var c=T.a(Je.a(Bl,Ai),b),d=a/Za.a(Nd,c);return T.a(Ke(Pd,d),c)}function Fl(a,b,c){return id.a(b,function(){var d=null==b?null:xb(b);return a.a?a.a(d,c):a.call(null,d,c)}())}function Gl(a,b){var c=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a,c=D.a(c,Ai),c=b-(Dl.b?Dl.b(c):Dl.call(null,c));return c-Ud(c,20)}
function Hl(a,b){var c=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a,d=D.a(c,qi),e=D.a(c,rk),f=El(e,b);return T.i(function(a,b,c,d){return function(a,b,c,e){a=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a;c=D.a(a,Ai);b=new u(null,5,[xh,b+(Cl.b?Cl.b(c):Cl.call(null,c)),qi,d,Aj,e,Uh,e,ti,-30],null);return yg.i(G([a,b],0))}}(f,a,c,d,e),b,Za.c(Ke(Fl,Nd),new Q(null,1,5,S,[0],null),f),f,G([T.c(Gl,b,f)],0))}
function Il(a,b){var c=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a,d=D.a(c,qi),e=D.a(c,rk),f=D.a(c,Sj),g=O(b),h=d/g;return T.c(function(a,b,c,d,e,f){return function(a,c){var d=new u(null,3,[Sj,a,qi,b-30,rk,f],null),d=null!=d&&(d.g&64||d.F)?C.a(Oc,d):d,e=D.a(d,qi),g=D.a(d,rk),h=null!=c&&(c.g&64||c.F)?C.a(Oc,c):c;D.a(h,Vh);return hf(yg.i(G([h,d],0)),Vh,Ke(Hl,new u(null,2,[qi,e,rk,g],null)))}}(g,h,a,c,d,e,f),Te(g,Xe(Ke(Nd,h),f)),b)};function Jl(a){return rc.a(Sh,Ai.b(a))}function Kl(a){return sl(new Q(null,7,5,S,[ii,tl,Vh,tl,function(a){return Vj.b(a)},nk,vl],null),Ie(pi),a)}if("undefined"===typeof Ll)var Ll=function(){var a=V.b?V.b(De):V.call(null,De),b=V.b?V.b(De):V.call(null,De),c=V.b?V.b(De):V.call(null,De),d=V.b?V.b(De):V.call(null,De),e=D.c(De,dk,hh());return new uh(zc.a("pennygame.updates","capacity"),function(){return function(a,b){var c=null!=b&&(b.g&64||b.F)?C.a(Oc,b):b;return D.a(c,Ai)}}(a,b,c,d,e),gi,e,a,b,c,d)}();
wh(Ll,Ii,function(a){return a});wh(Ll,Ui,function(a){switch(a){case 1:return 4;case 2:return 4;case 3:return 4;case 4:return 4;case 5:return 5;case 6:return 6;default:throw Error([B("No matching clause: "),B(a)].join(""));}});wh(Ll,Ei,function(a,b,c){a=null!=b&&(b.g&64||b.F)?C.a(Oc,b):b;b=D.a(a,Dh);a=D.a(a,fi);c=ld(c,b);b=null!=c&&(c.g&64||c.F)?C.a(Oc,c):c;c=D.a(b,Wh);b=D.a(b,nk);if(rc.a(a,Wh))return c;a=O(b);return c<a?c:a});function Ml(a,b){return sl(new Q(null,4,5,S,[ii,tl,Vh,tl],null),b,a)}
function Nl(a,b){return Kd(T.c(function(a,b){return nd.c(a,ki,b)},a,b))}function Ol(a,b){return jf(a,lf,Nl,b)}function Pl(a,b){return sl(new Q(null,6,5,S,[ii,tl,Vh,ul,tl,function(a){return Fd(a,Lh)}],null),function(a,d){var e=null!=d&&(d.g&64||d.F)?C.a(Oc,d):d,f=D.a(e,Lh),g=D.a(e,pk);D.a(e,nk);f=ef(b,new Q(null,2,5,S,[f,ki],null));g=Ll.c?Ll.c(f,g,a):Ll.call(null,f,g,a);return nd.c(e,Wh,g)},a)}
function Ql(a,b){return sl(new Q(null,7,5,S,[ii,tl,Vh,ul,tl,function(a){return Fd(a,Lh)},function(a){return rc.a(Ei,ef(a,new Q(null,2,5,S,[pk,Ai],null)))}],null),function(a,d){var e=null!=d&&(d.g&64||d.F)?C.a(Oc,d):d,f=D.a(e,Lh),g=D.a(e,pk);D.a(e,nk);f=ef(b,new Q(null,2,5,S,[f,ki],null));g=Ll.c?Ll.c(f,g,a):Ll.call(null,f,g,a);return nd.c(e,Wh,g)},a)}function Rl(a){var b=a.b?a.b(lf):a.call(null,lf);return Ql(Pl(a,b),b)}
if("undefined"===typeof Sl){var Sl,Tl=V.b?V.b(De):V.call(null,De),Ul=V.b?V.b(De):V.call(null,De),Vl=V.b?V.b(De):V.call(null,De),Wl=V.b?V.b(De):V.call(null,De),Xl=D.c(De,dk,hh());Sl=new uh(zc.a("pennygame.updates","process"),Ai,gi,Xl,Tl,Ul,Vl,Wl)}wh(Sl,gi,function(a){a=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a;var b=D.a(a,Wh),c=D.a(a,nk);return nd.i(a,nk,Ue(b,c),G([Rj,Te(b,c)],0))});wh(Sl,ri,function(a){a=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a;var b=D.a(a,Wh);return nd.c(a,Rj,Te(b,Ve(De)))});
function Yl(a){var b=I(rl(new Q(null,4,5,S,[Vh,tl,function(a){return Gj.b(a)},Gj],null),a));return sl(new Q(null,5,5,S,[Vh,function(){var a=b+1;return xl.a?xl.a(b,a):xl.call(null,b,a)}(),tl,Rj,vl],null),Ie(pi),a)}function Zl(a){return Ge(function(a){return rc.a(a,pi)},rl(new Q(null,4,5,S,[tl,function(a){return Gj.b(a)},Rj,tl],null),a))}function $l(a){return x(Zl(a.b?a.b(Vh):a.call(null,Vh)))?Yl(a):a}
function am(a){return sl(new Q(null,2,5,S,[ii,tl],null),$l,sl(new Q(null,5,5,S,[ii,tl,Vh,tl,function(a){return D.a(a,Wh)}],null),Sl,a))}function bm(a){var b=C.c(Td,16.5,T.a(function(a){var b=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a;a=D.a(b,Bj);var e=D.a(b,ok),b=D.a(b,nk);return a/(O(e)+O(b))},rl(new Q(null,5,5,S,[ii,tl,Vh,tl,Jl],null),a)));return sl(new Q(null,5,5,S,[ii,tl,Vh,tl,Jl],null),function(a){return function(b){return jf(b,Ah,Td,a)}}(b),a)}
function cm(a){return sl(new Q(null,6,5,S,[ii,tl,Vh,ul,tl,function(a){return Fd(a,Bh)}],null),function(a,c){var d=null!=c&&(c.g&64||c.F)?C.a(Oc,c):c,e=D.a(d,Bh);return nd.c(d,ok,ef(Kd(a),new Q(null,2,5,S,[e,Rj],null)))},a)}function dm(a){return sl(new Q(null,6,5,S,[ii,tl,Vh,tl,Al(),nk],null),function(a,c){return te.a(c,a)},a)}
function em(a,b){var c=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a,c=D.a(c,Vh),d=null!=b&&(b.g&64||b.F)?C.a(Oc,b):b,e=D.c(d,Jh,0),f=D.a(d,uj),g=D.a(d,yi),h=D.c(d,ei,new Q(null,2,5,S,[0,0],null)),d=O(Rj.b(I(c))),l=O(Rj.b(hd(Eg(c)))),m=C.c(T,Nd,T.a(Ng(Je.a(O,Rj),Wh),rl(new Q(null,2,5,S,[tl,Jl],null),c))),n=Za.a(Nd,T.a(O,rl(new Q(null,3,5,S,[tl,Jl,nk],null),c))),h=T.c(Nd,h,m);return new u(null,6,[Ji,n,Jh,x(Zl(c))?e+1:e,uj,f+d,yi,g+l,ei,h,$i,C.a(Qd,h)],null)}
function fm(a){return sl(new Q(null,5,5,S,[ii,tl,function(a){return H(D.a(a,Vh))},ul,Th],null),function(a,c){return id.a(c,em(a,null==c?null:xb(c)))},sl(new Q(null,7,5,S,[ii,tl,function(a){return H(D.a(a,Vh))},Vh,tl,function(a){return O(Rj.b(a))<Wh.b(a)},ek],null),Rc,a))};function gm(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;return hm(0<b.length?new Bc(b.slice(0),0):null)}function hm(a){return yg.i(G([new u(null,2,[ki,0,Ai,Sh],null),C.a(Oc,a)],0))}function im(a){return yg.i(G([od([Ah,Wh,Ai,oj,Rj,ek,nk,ok,pk],[999999,null,Sh,Zg("station"),jd,0,Te(4,Ve(wi)),jd,new u(null,1,[Ai,Ii],null)]),C.a(Oc,a)],0))}
function jm(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;return km(0<b.length?new Bc(b.slice(0),0):null)}function km(a){return yg.i(G([new u(null,2,[Th,jd,Vh,jd],null),C.a(Oc,a)],0))}
var lm=new Q(null,5,5,S,[hm(G([Ai,ri],0)),gm(),gm(),gm(),gm()],null),mm=km(G([Oh,qj,Vh,new Q(null,6,5,S,[im(G([Ai,ri,Lh,0],0)),im(G([Bh,0,Lh,1,Vj,!0],0)),im(G([Bh,1,Lh,2],0)),im(G([Bh,2,Lh,3],0)),im(G([Bh,3,Lh,4,Gj,0],0)),im(G([Ai,Hj,Bh,4],0))],null)],0)),nm=km(G([Oh,li,Vh,new Q(null,6,5,S,[im(G([Ai,ri,Lh,0,pk,new u(null,1,[Ai,Ui],null)],0)),im(G([Bh,0,Lh,1,pk,new u(null,1,[Ai,Ui],null),Vj,!0],0)),im(G([Bh,1,Lh,2,pk,new u(null,1,[Ai,Ui],null)],0)),im(G([Bh,2,Lh,3],0)),im(G([Bh,3,Lh,4,pk,new u(null,
1,[Ai,Ui],null),Gj,0],0)),im(G([Ai,Hj,Bh,4],0))],null)],0)),om=km(G([Oh,rj,Vh,new Q(null,6,5,S,[im(G([Ai,ri,Lh,0,pk,new u(null,3,[Ai,Ei,Dh,3,fi,Wh],null)],0)),im(G([Bh,0,Lh,1,pk,new u(null,1,[Ai,Ui],null),Vj,!0],0)),im(G([Bh,1,Lh,2,pk,new u(null,1,[Ai,Ui],null)],0)),im(G([Bh,2,Lh,3],0)),im(G([Bh,3,Lh,4,pk,new u(null,1,[Ai,Ui],null),Gj,0],0)),im(G([Ai,Hj,Bh,4],0))],null)],0)),pm=km(G([Oh,Yj,Vh,new Q(null,6,5,S,[im(G([Ai,ri,Lh,0,pk,new u(null,3,[Ai,Ei,Dh,3,fi,Gi],null)],0)),im(G([Bh,0,Lh,1,pk,new u(null,
1,[Ai,Ui],null),Vj,!0],0)),im(G([Bh,1,Lh,2,pk,new u(null,1,[Ai,Ui],null)],0)),im(G([Bh,2,Lh,3,nk,Te(6,Ve(wi))],0)),im(G([Bh,3,Lh,4,pk,new u(null,1,[Ai,Ui],null),Gj,0],0)),im(G([Ai,Hj,Bh,4],0))],null)],0)),qm=new u(null,7,[Mj,new u(null,3,[jk,0,lf,lm,ii,new Q(null,3,5,S,[mm,jm(),jm()],null)],null),Zh,new u(null,3,[jk,0,lf,lm,ii,new Q(null,3,5,S,[jm(),nm,jm()],null)],null),Ei,new u(null,3,[jk,0,lf,lm,ii,new Q(null,3,5,S,[jm(),jm(),om],null)],null),di,new u(null,3,[jk,0,lf,lm,ii,new Q(null,3,5,S,[mm,
nm,jm()],null)],null),cj,new u(null,3,[jk,0,lf,lm,ii,new Q(null,3,5,S,[mm,nm,om],null)],null),Fh,new u(null,3,[jk,0,lf,lm,ii,new Q(null,3,5,S,[mm,nm,pm],null)],null),jj,new u(null,3,[jk,0,lf,lm,ii,new Q(null,4,5,S,[mm,nm,om,pm],null)],null)],null);function rm(a){return fm(dm(cm(am(Rl(Ol(hf(a,jk,Rc),We(function(){return 6*Math.random()+1|0})))))))}function sm(a,b){for(var c=0,d=Kl(b);;)if(c<a)c+=1,d=rm(d);else return d}function tm(a){a:for(var b=De,c=H(new Q(null,4,5,S,[Ji,yi,Jh,$i],null));;)if(c)var d=I(c),e=D.c(a,d,uk),b=rc.a(e,uk)?b:nd.c(b,d,e),c=K(c);else{a=Qc(b,rd(a));break a}return a}function um(a){return Fg(new Q(null,4,5,S,[Mj,Zh,Ei,Zj],null),T.a(Je.a(function(a){return T.a(tm,a)},Th),ii.b(a)))}
function vm(a,b){return Fg(Tf(b),T.a(a,Uf(b)))}var wm=function wm(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return wm.i(arguments[0],1<c.length?new Bc(c.slice(1),0):null)};wm.i=function(a,b){return vm(function(b){return C.a(a,b)},vm(function(a){return T.a($d,a)},fh(Zd,C.a(te,b))))};wm.w=1;wm.B=function(a){var b=I(a);a=K(a);return wm.i(b,a)};function xm(a){return vm(function(a){return C.c(T,Df,a)},vm(function(a){return T.a($d,a)},fh(Zd,C.a(te,a))))}
function ym(a){var b=function(){var b=um(a);return V.b?V.b(b):V.call(null,b)}(),c=V.b?V.b(1):V.call(null,1),d=function(a,b){return function(a,c){return((L.b?L.b(b):L.call(null,b))*a+c)/((L.b?L.b(b):L.call(null,b))+1)}}(b,c);return function(a,b,c,d){return function(l){l=vm(function(a,b,c,d,e){return function(a){return T.a(e,a)}}(a,a,b,c,d),xm(G([L.b?L.b(a):L.call(null,a),um(l)],0)));Qe.a?Qe.a(a,l):Qe.call(null,a,l);Re.a(b,Rc);return L.b?L.b(a):L.call(null,a)}}(b,c,d,function(a,b,c){return function(a){return C.c(wm,
c,a)}}(b,c,d))};var zm;a:{var Am=aa.navigator;if(Am){var Bm=Am.userAgent;if(Bm){zm=Bm;break a}}zm=""};var Cm,Dm=function Dm(b,c){if(null!=b&&null!=b.pc)return b.pc(0,c);var d=Dm[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Dm._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("ReadPort.take!",b);},Em=function Em(b,c,d){if(null!=b&&null!=b.dc)return b.dc(0,c,d);var e=Em[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Em._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ra("WritePort.put!",b);},Fm=function Fm(b){if(null!=b&&null!=b.cc)return b.cc();
var c=Fm[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Fm._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("Channel.close!",b);},Gm=function Gm(b){if(null!=b&&null!=b.Ec)return!0;var c=Gm[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Gm._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("Handler.active?",b);},Hm=function Hm(b){if(null!=b&&null!=b.Fc)return b.Fa;var c=Hm[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Hm._;if(null!=c)return c.b?
c.b(b):c.call(null,b);throw Ra("Handler.commit",b);},Im=function Im(b,c){if(null!=b&&null!=b.Dc)return b.Dc(0,c);var d=Im[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Im._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("Buffer.add!*",b);},Jm=function Jm(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Jm.b(arguments[0]);case 2:return Jm.a(arguments[0],arguments[1]);default:throw Error([B("Invalid arity: "),
B(c.length)].join(""));}};Jm.b=function(a){return a};Jm.a=function(a,b){return Im(a,b)};Jm.w=2;var Km,Lm=function Lm(b){"undefined"===typeof Km&&(Km=function(b,d,e){this.sc=b;this.Fa=d;this.ld=e;this.g=393216;this.C=0},Km.prototype.P=function(b,d){return new Km(this.sc,this.Fa,d)},Km.prototype.O=function(){return this.ld},Km.prototype.Ec=function(){return!0},Km.prototype.Fc=function(){return this.Fa},Km.ic=function(){return new Q(null,3,5,S,[Qc(fk,new u(null,2,[Yh,!0,Be,pc(Ce,pc(new Q(null,1,5,S,[yk],null)))],null)),yk,ua.Gd],null)},Km.xb=!0,Km.eb="cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers22073",
Km.Tb=function(b,d){return Qb(d,"cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers22073")});return new Km(Lm,b,De)};function Mm(a){try{return a[0].call(null,a)}catch(b){throw b instanceof Object&&a[6].cc(),b;}}function Nm(a,b,c){c=c.pc(0,Lm(function(c){a[2]=c;a[1]=b;return Mm(a)}));return x(c)?(a[2]=L.b?L.b(c):L.call(null,c),a[1]=b,Y):null}function Om(a,b,c,d){c=c.dc(0,d,Lm(function(c){a[2]=c;a[1]=b;return Mm(a)}));return x(c)?(a[2]=L.b?L.b(c):L.call(null,c),a[1]=b,Y):null}
function Pm(a,b){var c=a[6];null!=b&&c.dc(0,b,Lm(function(){return function(){return null}}(c)));c.cc();return c}function Qm(a,b,c,d,e,f,g,h){this.Sa=a;this.Ta=b;this.Va=c;this.Ua=d;this.Za=e;this.S=f;this.G=g;this.u=h;this.g=2229667594;this.C=8192}k=Qm.prototype;k.N=function(a,b){return mb.c(this,b,null)};
k.I=function(a,b,c){switch(b instanceof y?b.Ha:null){case "catch-block":return this.Sa;case "catch-exception":return this.Ta;case "finally-block":return this.Va;case "continue-block":return this.Ua;case "prev":return this.Za;default:return D.c(this.G,b,c)}};
k.M=function(a,b,c){return zf(b,function(){return function(a){return zf(b,Af,""," ","",c,a)}}(this),"#cljs.core.async.impl.ioc-helpers.ExceptionFrame{",", ","}",c,te.a(new Q(null,5,5,S,[new Q(null,2,5,S,[Bi,this.Sa],null),new Q(null,2,5,S,[tj,this.Ta],null),new Q(null,2,5,S,[hi,this.Va],null),new Q(null,2,5,S,[Ej,this.Ua],null),new Q(null,2,5,S,[xj,this.Za],null)],null),this.G))};k.Ga=function(){return new Mf(0,this,5,new Q(null,5,5,S,[Bi,tj,hi,Ej,xj],null),hc(this.G))};k.O=function(){return this.S};
k.Z=function(){return 5+O(this.G)};k.T=function(){var a=this.u;return null!=a?a:this.u=a=ae(this)};k.D=function(a,b){var c;c=x(b)?(c=this.constructor===b.constructor)?Lf(this,b):c:b;return x(c)?!0:!1};k.ib=function(a,b){return Fd(new Bg(null,new u(null,5,[hi,null,Bi,null,tj,null,xj,null,Ej,null],null),null),b)?pd.a(Qc(cf.a(De,this),this.S),b):new Qm(this.Sa,this.Ta,this.Va,this.Ua,this.Za,this.S,ye(pd.a(this.G,b)),null)};
k.Oa=function(a,b,c){return x(U.a?U.a(Bi,b):U.call(null,Bi,b))?new Qm(c,this.Ta,this.Va,this.Ua,this.Za,this.S,this.G,null):x(U.a?U.a(tj,b):U.call(null,tj,b))?new Qm(this.Sa,c,this.Va,this.Ua,this.Za,this.S,this.G,null):x(U.a?U.a(hi,b):U.call(null,hi,b))?new Qm(this.Sa,this.Ta,c,this.Ua,this.Za,this.S,this.G,null):x(U.a?U.a(Ej,b):U.call(null,Ej,b))?new Qm(this.Sa,this.Ta,this.Va,c,this.Za,this.S,this.G,null):x(U.a?U.a(xj,b):U.call(null,xj,b))?new Qm(this.Sa,this.Ta,this.Va,this.Ua,c,this.S,this.G,
null):new Qm(this.Sa,this.Ta,this.Va,this.Ua,this.Za,this.S,nd.c(this.G,b,c),null)};k.V=function(){return H(te.a(new Q(null,5,5,S,[new Q(null,2,5,S,[Bi,this.Sa],null),new Q(null,2,5,S,[tj,this.Ta],null),new Q(null,2,5,S,[hi,this.Va],null),new Q(null,2,5,S,[Ej,this.Ua],null),new Q(null,2,5,S,[xj,this.Za],null)],null),this.G))};k.P=function(a,b){return new Qm(this.Sa,this.Ta,this.Va,this.Ua,this.Za,b,this.G,this.u)};k.X=function(a,b){return wd(b)?qb(this,gb.a(b,0),gb.a(b,1)):Za.c(eb,this,b)};
function Rm(a){for(;;){var b=a[4],c=Bi.b(b),d=tj.b(b),e=a[5];if(x(function(){var a=e;return x(a)?Pa(b):a}()))throw e;if(x(function(){var a=e;return x(a)?(a=c,x(a)?e instanceof d:a):a}())){a[1]=c;a[2]=e;a[5]=null;a[4]=nd.i(b,Bi,null,G([tj,null],0));break}if(x(function(){var a=e;return x(a)?Pa(c)&&Pa(hi.b(b)):a}()))a[4]=xj.b(b);else{if(x(function(){var a=e;return x(a)?(a=Pa(c))?hi.b(b):a:a}())){a[1]=hi.b(b);a[4]=nd.c(b,hi,null);break}if(x(function(){var a=Pa(e);return a?hi.b(b):a}())){a[1]=hi.b(b);
a[4]=nd.c(b,hi,null);break}if(Pa(e)&&Pa(hi.b(b))){a[1]=Ej.b(b);a[4]=xj.b(b);break}throw Error("No matching clause");}}};function Sm(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function Tm(a,b,c,d){this.head=a;this.R=b;this.length=c;this.f=d}Tm.prototype.pop=function(){if(0===this.length)return null;var a=this.f[this.R];this.f[this.R]=null;this.R=(this.R+1)%this.f.length;--this.length;return a};Tm.prototype.unshift=function(a){this.f[this.head]=a;this.head=(this.head+1)%this.f.length;this.length+=1;return null};function Um(a,b){a.length+1===a.f.length&&a.resize();a.unshift(b)}
Tm.prototype.resize=function(){var a=Array(2*this.f.length);return this.R<this.head?(Sm(this.f,this.R,a,0,this.length),this.R=0,this.head=this.length,this.f=a):this.R>this.head?(Sm(this.f,this.R,a,0,this.f.length-this.R),Sm(this.f,0,a,this.f.length-this.R,this.head),this.R=0,this.head=this.length,this.f=a):this.R===this.head?(this.head=this.R=0,this.f=a):null};function Vm(a,b){for(var c=a.length,d=0;;)if(d<c){var e=a.pop();(b.b?b.b(e):b.call(null,e))&&a.unshift(e);d+=1}else break}
function Wm(a){return new Tm(0,0,0,Array(a))}function Xm(a,b){this.L=a;this.n=b;this.g=2;this.C=0}function Ym(a){return a.L.length===a.n}Xm.prototype.Dc=function(a,b){Um(this.L,b);return this};Xm.prototype.Z=function(){return this.L.length};var Zm;
function $m(){var a=aa.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==zm.indexOf("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=ja(function(a){if(("*"==d||a.origin==
d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&-1==zm.indexOf("Trident")&&-1==zm.indexOf("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.vc;c.vc=null;a()}};return function(a){d.next={vc:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=
document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){aa.setTimeout(a,0)}};var an=Wm(32),bn=!1,cn=!1;dn;function en(){bn=!0;cn=!1;for(var a=0;;){var b=an.pop();if(null!=b&&(b.l?b.l():b.call(null),1024>a)){a+=1;continue}break}bn=!1;return 0<an.length?dn.l?dn.l():dn.call(null):null}function dn(){var a=cn;if(x(x(a)?bn:a))return null;cn=!0;!ca(aa.setImmediate)||aa.Window&&aa.Window.prototype&&aa.Window.prototype.setImmediate==aa.setImmediate?(Zm||(Zm=$m()),Zm(en)):aa.setImmediate(en)}function fn(a){Um(an,a);dn()}function gn(a,b){setTimeout(a,b)};var hn,jn=function jn(b){"undefined"===typeof hn&&(hn=function(b,d,e){this.Oc=b;this.H=d;this.md=e;this.g=425984;this.C=0},hn.prototype.P=function(b,d){return new hn(this.Oc,this.H,d)},hn.prototype.O=function(){return this.md},hn.prototype.Jb=function(){return this.H},hn.ic=function(){return new Q(null,3,5,S,[Qc(Zi,new u(null,1,[Be,pc(Ce,pc(new Q(null,1,5,S,[kj],null)))],null)),kj,ua.Hd],null)},hn.xb=!0,hn.eb="cljs.core.async.impl.channels/t_cljs$core$async$impl$channels22136",hn.Tb=function(b,d){return Qb(d,
"cljs.core.async.impl.channels/t_cljs$core$async$impl$channels22136")});return new hn(jn,b,De)};function kn(a,b){this.Ub=a;this.H=b}function ln(a){return Gm(a.Ub)}var mn=function mn(b){if(null!=b&&null!=b.Cc)return b.Cc();var c=mn[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=mn._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("MMC.abort",b);};function nn(a,b,c,d,e,f,g){this.Gb=a;this.hc=b;this.sb=c;this.gc=d;this.L=e;this.closed=f;this.Ja=g}
nn.prototype.Cc=function(){for(;;){var a=this.sb.pop();if(null!=a){var b=a.Ub;fn(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(b.Fa,b,a.H,a,this))}break}Vm(this.sb,Ie(!1));return Fm(this)};
nn.prototype.dc=function(a,b,c){var d=this;if(a=d.closed)return jn(!a);if(x(function(){var a=d.L;return x(a)?Pa(Ym(d.L)):a}())){for(c=Tc(d.Ja.a?d.Ja.a(d.L,b):d.Ja.call(null,d.L,b));;){if(0<d.Gb.length&&0<O(d.L)){var e=d.Gb.pop(),f=e.Fa,g=d.L.L.pop();fn(function(a,b){return function(){return a.b?a.b(b):a.call(null,b)}}(f,g,e,c,a,this))}break}c&&mn(this);return jn(!0)}e=function(){for(;;){var a=d.Gb.pop();if(x(a)){if(x(!0))return a}else return null}}();if(x(e))return c=Hm(e),fn(function(a){return function(){return a.b?
a.b(b):a.call(null,b)}}(c,e,a,this)),jn(!0);64<d.gc?(d.gc=0,Vm(d.sb,ln)):d.gc+=1;Um(d.sb,new kn(c,b));return null};
nn.prototype.pc=function(a,b){var c=this;if(null!=c.L&&0<O(c.L)){for(var d=b.Fa,e=jn(c.L.L.pop());;){if(!x(Ym(c.L))){var f=c.sb.pop();if(null!=f){var g=f.Ub,h=f.H;fn(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(g.Fa,g,h,f,d,e,this));Tc(c.Ja.a?c.Ja.a(c.L,h):c.Ja.call(null,c.L,h))&&mn(this);continue}}break}return e}d=function(){for(;;){var a=c.sb.pop();if(x(a)){if(Gm(a.Ub))return a}else return null}}();if(x(d))return e=Hm(d.Ub),fn(function(a){return function(){return a.b?a.b(!0):
a.call(null,!0)}}(e,d,this)),jn(d.H);if(x(c.closed))return x(c.L)&&(c.Ja.b?c.Ja.b(c.L):c.Ja.call(null,c.L)),x(x(!0)?b.Fa:!0)?(d=function(){var a=c.L;return x(a)?0<O(c.L):a}(),d=x(d)?c.L.L.pop():null,jn(d)):null;64<c.hc?(c.hc=0,Vm(c.Gb,Gm)):c.hc+=1;Um(c.Gb,b);return null};
nn.prototype.cc=function(){var a=this;if(!a.closed)for(a.closed=!0,x(function(){var b=a.L;return x(b)?0===a.sb.length:b}())&&(a.Ja.b?a.Ja.b(a.L):a.Ja.call(null,a.L));;){var b=a.Gb.pop();if(null==b)break;else{var c=b.Fa,d=x(function(){var b=a.L;return x(b)?0<O(a.L):b}())?a.L.L.pop():null;fn(function(a,b){return function(){return a.b?a.b(b):a.call(null,b)}}(c,d,b,this))}}return null};function on(a){console.log(a);return null}
function pn(a,b){var c=(x(null)?null:on).call(null,b);return null==c?a:Jm.a(a,c)}
function qn(a){return new nn(Wm(32),0,Wm(32),0,a,!1,function(){return function(a){return function(){function c(c,d){try{return a.a?a.a(c,d):a.call(null,c,d)}catch(e){return pn(c,e)}}function d(c){try{return a.b?a.b(c):a.call(null,c)}catch(d){return pn(c,d)}}var e=null,e=function(a,b){switch(arguments.length){case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};e.b=d;e.a=c;return e}()}(x(null)?null.b?null.b(Jm):null.call(null,Jm):Jm)}())};function rn(a,b,c){this.key=a;this.H=b;this.forward=c;this.g=2155872256;this.C=0}rn.prototype.V=function(){return eb(eb(Ec,this.H),this.key)};rn.prototype.M=function(a,b,c){return zf(b,Af,"["," ","]",c,this)};function sn(a,b,c){c=Array(c+1);for(var d=0;;)if(d<c.length)c[d]=null,d+=1;else break;return new rn(a,b,c)}function tn(a,b,c,d){for(;;){if(0>c)return a;a:for(;;){var e=a.forward[c];if(x(e))if(e.key<b)a=e;else break a;else break a}null!=d&&(d[c]=a);--c}}
function un(a,b){this.ob=a;this.level=b;this.g=2155872256;this.C=0}un.prototype.put=function(a,b){var c=Array(15),d=tn(this.ob,a,this.level,c).forward[0];if(null!=d&&d.key===a)return d.H=b;a:for(d=0;;)if(.5>Math.random()&&15>d)d+=1;else break a;if(d>this.level){for(var e=this.level+1;;)if(e<=d+1)c[e]=this.ob,e+=1;else break;this.level=d}for(d=sn(a,b,Array(d));;)return 0<=this.level?(c=c[0].forward,d.forward[0]=c[0],c[0]=d):null};
un.prototype.remove=function(a){var b=Array(15),c=tn(this.ob,a,this.level,b).forward[0];if(null!=c&&c.key===a){for(a=0;;)if(a<=this.level){var d=b[a].forward;d[a]===c&&(d[a]=c.forward[a]);a+=1}else break;for(;;)if(0<this.level&&null==this.ob.forward[this.level])--this.level;else return null}else return null};function vn(a){for(var b=wn,c=b.ob,d=b.level;;){if(0>d)return c===b.ob?null:c;var e;a:for(e=c;;){e=e.forward[d];if(null==e){e=null;break a}if(e.key>=a)break a}null!=e?(--d,c=e):--d}}
un.prototype.V=function(){return function(a){return function c(d){return new je(null,function(){return function(){return null==d?null:N(new Q(null,2,5,S,[d.key,d.H],null),c(d.forward[0]))}}(a),null,null)}}(this)(this.ob.forward[0])};un.prototype.M=function(a,b,c){return zf(b,function(){return function(a){return zf(b,Af,""," ","",c,a)}}(this),"{",", ","}",c,this)};var wn=new un(sn(null,null,0),0);
function xn(a){var b=(new Date).valueOf()+a,c=vn(b),d=x(x(c)?c.key<b+10:c)?c.H:null;if(x(d))return d;var e=qn(null);wn.put(b,e);gn(function(a,b,c){return function(){wn.remove(c);return Fm(a)}}(e,d,b,c),a);return e};var yn=function yn(b){"undefined"===typeof Cm&&(Cm=function(b,d,e){this.sc=b;this.Fa=d;this.kd=e;this.g=393216;this.C=0},Cm.prototype.P=function(b,d){return new Cm(this.sc,this.Fa,d)},Cm.prototype.O=function(){return this.kd},Cm.prototype.Ec=function(){return!0},Cm.prototype.Fc=function(){return this.Fa},Cm.ic=function(){return new Q(null,3,5,S,[Qc(fk,new u(null,2,[Yh,!0,Be,pc(Ce,pc(new Q(null,1,5,S,[yk],null)))],null)),yk,ua.Fd],null)},Cm.xb=!0,Cm.eb="cljs.core.async/t_cljs$core$async19305",Cm.Tb=
function(b,d){return Qb(d,"cljs.core.async/t_cljs$core$async19305")});return new Cm(yn,b,De)};function zn(a){a=rc.a(a,0)?null:a;return qn("number"===typeof a?new Xm(Wm(a),a):a)}function An(a,b){var c=Dm(a,yn(b));if(x(c)){var d=L.b?L.b(c):L.call(null,c);x(!0)?b.b?b.b(d):b.call(null,d):fn(function(a){return function(){return b.b?b.b(a):b.call(null,a)}}(d,c))}return null}var Bn=yn(function(){return null});function Cn(a,b){var c=Em(a,b,Bn);return x(c)?L.b?L.b(c):L.call(null,c):!0}
function Dn(a){var b=Kd(new Q(null,1,5,S,[En],null)),c=zn(null),d=O(b),e=qe(d),f=zn(1),g=V.b?V.b(null):V.call(null,null),h=df(function(a,b,c,d,e,f){return function(g){return function(a,b,c,d,e,f){return function(a){d[g]=a;return 0===Re.a(f,Rd)?Cn(e,d.slice(0)):null}}(a,b,c,d,e,f)}}(b,c,d,e,f,g),new Jg(null,0,d,1,null)),l=zn(1);fn(function(b,c,d,e,f,g,h,l){return function(){var A=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!U(e,Y)){d=e;break a}}}catch(f){if(f instanceof
Object)c[5]=f,Rm(c),d=Y;else throw f;}if(!U(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(b,c,d,e,f,g,h,l){return function(b){var f=b[1];if(7===f)return b[2]=null,b[1]=8,Y;if(1===f)return b[2]=null,b[1]=2,Y;if(4===f){var m=b[7],
f=m<e;b[1]=x(f)?6:7;return Y}return 15===f?(f=b[2],b[2]=f,b[1]=3,Y):13===f?(f=Fm(d),b[2]=f,b[1]=15,Y):6===f?(b[2]=null,b[1]=11,Y):3===f?(f=b[2],Pm(b,f)):12===f?(f=b[8],f=b[2],m=Ge(Na,f),b[8]=f,b[1]=x(m)?13:14,Y):2===f?(f=Qe.a?Qe.a(h,e):Qe.call(null,h,e),b[9]=f,b[7]=0,b[2]=null,b[1]=4,Y):11===f?(m=b[7],b[4]=new Qm(10,Object,null,9,b[4],null,null,null),f=c.b?c.b(m):c.call(null,m),m=l.b?l.b(m):l.call(null,m),f=An(f,m),b[2]=f,Rm(b),Y):9===f?(m=b[7],b[10]=b[2],b[7]=m+1,b[2]=null,b[1]=4,Y):5===f?(b[11]=
b[2],Nm(b,12,g)):14===f?(f=b[8],f=C.a(a,f),Om(b,16,d,f)):16===f?(b[12]=b[2],b[2]=null,b[1]=2,Y):10===f?(m=b[2],f=Re.a(h,Rd),b[13]=m,b[2]=f,Rm(b),Y):8===f?(f=b[2],b[2]=f,b[1]=5,Y):null}}(b,c,d,e,f,g,h,l),b,c,d,e,f,g,h,l)}(),F=function(){var a=A.l?A.l():A.call(null);a[6]=b;return a}();return Mm(F)}}(l,b,c,d,e,f,g,h));return c};var Fn=VDOM.diff,Gn=VDOM.patch,Hn=VDOM.create;function In(a){return af(He(Na),af(He(Dd),bf(a)))}function Jn(a,b,c){return new VDOM.VHtml(Yd(a),dh(b),dh(c))}function Kn(a,b,c){return new VDOM.VSvg(Yd(a),dh(b),dh(c))}Ln;
var Mn=function Mn(b){if(null==b)return new VDOM.VText("");if(Dd(b))return Jn(Xi,De,T.a(Mn,In(b)));if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(rc.a(yj,I(b)))return Ln.b?Ln.b(b):Ln.call(null,b);var c=P(b,0),d=P(b,1);b=Xd(b,2);return Jn(c,d,T.a(Mn,In(b)))},Ln=function Ln(b){if(null==b)return new VDOM.VText("");if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(rc.a(vk,I(b))){var c=P(b,0),d=P(b,1);b=Xd(b,2);return Kn(c,d,T.a(Mn,In(b)))}c=P(b,0);d=P(b,
1);b=Xd(b,2);return Kn(c,d,T.a(Ln,In(b)))};
function Nn(){var a=document.body,b=function(){var a=new VDOM.VText("");return V.b?V.b(a):V.call(null,a)}(),c=function(){var a;a=L.b?L.b(b):L.call(null,b);a=Hn.b?Hn.b(a):Hn.call(null,a);return V.b?V.b(a):V.call(null,a)}(),d=null==window.requestAnimationFrame?function(){return function(a){return a.l?a.l():a.call(null)}}(b,c):function(){return function(a){return window.requestAnimationFrame(a)}}(b,c);a.appendChild(L.b?L.b(c):L.call(null,c));return function(a,b,c){return function(d){var l=Mn(d);d=function(){var b=
L.b?L.b(a):L.call(null,a);return Fn.a?Fn.a(b,l):Fn.call(null,b,l)}();Qe.a?Qe.a(a,l):Qe.call(null,a,l);d=function(a,b,c,d){return function(){return Re.c(d,Gn,b)}}(l,d,a,b,c);return c.b?c.b(d):c.call(null,d)}}(b,c,d)};var On=Error();function Pn(a){if(x(rc.a?rc.a(0,a):rc.call(null,0,a)))return jd;if(x(rc.a?rc.a(1,a):rc.call(null,1,a)))return new Q(null,1,5,S,[new Q(null,2,5,S,[0,0],null)],null);if(x(rc.a?rc.a(2,a):rc.call(null,2,a)))return new Q(null,2,5,S,[new Q(null,2,5,S,[-1,-1],null),new Q(null,2,5,S,[1,1],null)],null);if(x(rc.a?rc.a(3,a):rc.call(null,3,a)))return new Q(null,3,5,S,[new Q(null,2,5,S,[-1,-1],null),new Q(null,2,5,S,[0,0],null),new Q(null,2,5,S,[1,1],null)],null);if(x(rc.a?rc.a(4,a):rc.call(null,4,a)))return new Q(null,
4,5,S,[new Q(null,2,5,S,[-1,-1],null),new Q(null,2,5,S,[-1,1],null),new Q(null,2,5,S,[1,-1],null),new Q(null,2,5,S,[1,1],null)],null);if(x(rc.a?rc.a(5,a):rc.call(null,5,a)))return new Q(null,5,5,S,[new Q(null,2,5,S,[-1,-1],null),new Q(null,2,5,S,[-1,1],null),new Q(null,2,5,S,[0,0],null),new Q(null,2,5,S,[1,-1],null),new Q(null,2,5,S,[1,1],null)],null);if(x(rc.a?rc.a(6,a):rc.call(null,6,a)))return new Q(null,6,5,S,[new Q(null,2,5,S,[-1,-1],null),new Q(null,2,5,S,[-1,0],null),new Q(null,2,5,S,[-1,1],
null),new Q(null,2,5,S,[1,-1],null),new Q(null,2,5,S,[1,0],null),new Q(null,2,5,S,[1,1],null)],null);throw Error([B("No matching clause: "),B(a)].join(""));}var Qn=Ng(function(a){return a.x},function(a){return a.y});
function Rn(a){var b=P(a,0),c=P(a,1),d=Math.ceil(Math.sqrt(4)),e=b/d,f=c/d;return function(a,b,c,d,e,f,q){return function v(w){return new je(null,function(a,b,c,d,e,f,g){return function(){for(var h=w;;){var l=H(h);if(l){var m=l,n=I(m);if(l=H(function(a,b,c,d,e,f,g,h,l,m,n){return function Va(p){return new je(null,function(a,b,c,d,e,f,g,h){return function(){for(;;){var a=H(p);if(a){if(zd(a)){var c=ac(a),d=O(c),e=ne(d);a:for(var l=0;;)if(l<d){var m=gb.a(c,l),m=nd.i(h,Sj,m*f,G([xh,b*g],0));e.add(m);
l+=1}else{c=!0;break a}return c?oe(e.U(),Va(bc(a))):oe(e.U(),null)}e=I(a);return N(nd.i(h,Sj,e*f,G([xh,b*g],0)),Va(Dc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n),null,null)}}(h,n,m,l,a,b,c,d,e,f,g)(new Jg(null,0,a,1,null))))return te.a(l,v(Dc(h)));h=Dc(h)}else return null}}}(a,b,c,d,e,f,q),null,null)}}(d,e,f,new u(null,2,[qi,e,rk,f],null),a,b,c)(new Jg(null,0,d,1,null))}var Sn=Ng(Ke(C,Td),Ke(C,Sd));
function Tn(a,b){var c=P(a,0),d=P(a,1),e=P(b,0),f=P(b,1),g=rc.a(c,d)?new Q(null,2,5,S,[0,1],null):new Q(null,2,5,S,[c,d],null),h=P(g,0),l=P(g,1),m=(f-e)/(l-h);return function(a,b,c,d,e){return function(a){return d*a+e}}(g,h,l,m,f-m*l,a,c,d,b,e,f)}
var Un=function Un(b,c){return rc.a(1,b)?T.a(pc,c):new je(null,function(){var d=H(c);if(d){var e=P(d,0),f=Xd(d,1);return te.a(function(){return function(b,c,d,e){return function p(f){return new je(null,function(b,c){return function(){for(;;){var b=H(f);if(b){if(zd(b)){var d=ac(b),e=O(d),g=ne(e);a:for(var h=0;;)if(h<e){var l=gb.a(d,h),l=N(c,l);g.add(l);h+=1}else{d=!0;break a}return d?oe(g.U(),p(bc(b))):oe(g.U(),null)}g=I(b);return N(N(c,g),p(Dc(b)))}return null}}}(b,c,d,e),null,null)}}(d,e,f,d)(Un(b-
1,f))}(),Un(b,f))}return null},null,null)};
function Vn(a){function b(a){var b=sc;H(a)?(a=Jd.b?Jd.b(a):Jd.call(null,a),b=Id(b),ta(a,b),a=H(a)):a=Ec;b=P(a,0);a=P(a,1);var c=(11-(a-b))/2,b=[b,b-c,a,a+c];a=[];for(c=0;;)if(c<b.length){var g=b[c],h=b[c+1];-1===Qf(a,g)&&(a.push(g),a.push(h));c+=2}else break;return new u(null,a.length/2,a,null)}for(;;){var c=gd(C.c(Gg,I,af(function(){return function(a){return 0<I(a)&&11>I(a)}}(a,b),T.a(function(){return function(a){var b=S,c=C.a(Od,a);return new Q(null,2,5,b,[Math.abs(c),a],null)}}(a,b),Un(2,a)))));
if(x(c))a=Dg(b(c),a);else return a}}function Wn(a,b){return te.a(a,Ue(O(a),b))}function Xn(a,b,c){var d=null!=b&&(b.g&64||b.F)?C.a(Oc,b):b;b=D.a(d,qi);var d=D.a(d,rk),e=null!=c&&(c.g&64||c.F)?C.a(Oc,c):c;c=D.a(e,qk);var e=D.a(e,Wj),f=C.a(te,a);a=Wn(e,function(){var a=T.a(I,f);return Sn.b?Sn.b(a):Sn.call(null,a)}());c=Wn(c,function(){var a=T.a(gd,f);return Sn.b?Sn.b(a):Sn.call(null,a)}());return new Q(null,2,5,S,[Tn(a,new Q(null,2,5,S,[0,b],null)),Tn(c,new Q(null,2,5,S,[d,0],null))],null)};var Yn=V.b?V.b(De):V.call(null,De);function Zn(a){return Re.m(Yn,nd,Zg("animation"),a)}
function $n(){var a=1E3/30,b=zn(1);fn(function(a,b){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!U(e,Y)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Rm(c),d=Y;else throw f;}if(!U(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(a,b){return function(a){var c=a[1];if(7===c)return c=a,c[2]=a[2],c[1]=4,Y;if(20===c){var c=a[7],d=a[8],e=I(d),d=P(e,0),e=P(e,1),c=e.b?e.b(c):e.call(null,c);a[9]=d;a[1]=x(c)?22:23;return Y}if(1===c)return c=xn(0),Nm(a,2,c);if(24===c){var d=a[8],e=a[2],c=K(d),f;a[10]=null;a[11]=0;a[12]=c;a[13]=0;a[14]=e;a[2]=null;a[1]=8;return Y}if(4===c)return c=a[2],Pm(a,c);if(15===c){d=a[10];f=a[11];var c=
a[12],e=a[13],g=a[2];a[10]=d;a[11]=f;a[15]=g;a[12]=c;a[13]=e+1;a[2]=null;a[1]=8;return Y}return 21===c?(c=a[2],a[2]=c,a[1]=18,Y):13===c?(a[2]=null,a[1]=15,Y):22===c?(a[2]=null,a[1]=24,Y):6===c?(a[2]=null,a[1]=7,Y):25===c?(c=a[7],c+=b,a[16]=a[2],a[7]=c,a[2]=null,a[1]=3,Y):17===c?(a[2]=null,a[1]=18,Y):3===c?(c=L.b?L.b(Yn):L.call(null,Yn),c=H(c),a[1]=c?5:6,Y):12===c?(c=a[2],a[2]=c,a[1]=9,Y):2===c?(c=a[2],a[17]=c,a[7]=0,a[2]=null,a[1]=3,Y):23===c?(d=a[9],c=Re.c(Yn,pd,d),a[2]=c,a[1]=24,Y):19===c?(d=a[8],
c=ac(d),d=bc(d),e=O(c),a[10]=c,a[11]=e,a[12]=d,a[13]=0,a[2]=null,a[1]=8,Y):11===c?(c=a[12],c=H(c),a[8]=c,a[1]=c?16:17,Y):9===c?(c=a[2],d=xn(b),a[18]=c,Nm(a,25,d)):5===c?(c=L.b?L.b(Yn):L.call(null,Yn),c=H(c),a[10]=null,a[11]=0,a[12]=c,a[13]=0,a[2]=null,a[1]=8,Y):14===c?(d=a[19],c=Re.c(Yn,pd,d),a[2]=c,a[1]=15,Y):16===c?(d=a[8],c=zd(d),a[1]=c?19:20,Y):10===c?(d=a[10],c=a[7],e=a[13],e=gb.a(d,e),d=P(e,0),e=P(e,1),c=e.b?e.b(c):e.call(null,c),a[19]=d,a[1]=x(c)?13:14,Y):18===c?(c=a[2],a[2]=c,a[1]=12,Y):8===
c?(f=a[11],e=a[13],c=e<f,a[1]=x(c)?10:11,Y):null}}(a,b),a,b)}(),f=function(){var b=e.l?e.l():e.call(null);b[6]=a;return b}();return Mm(f)}}(b,a));return b}function ao(a){return a*a}function bo(a,b,c){var d=null!=c&&(c.g&64||c.F)?C.a(Oc,c):c,e=D.c(d,kk,0),f=D.a(d,Ci),g=D.c(d,zi,Ld);return function(c,d,e,f,g){return function(c){if(c<=e)return!0;if(c<e+f)return c=(c-e)/f,c=g.b?g.b(c):g.call(null,c),b.a?b.a(a,c):b.call(null,a,c),!0;b.a?b.a(a,1):b.call(null,a,1);return!1}}(c,d,e,f,g)}
function co(a,b){return function(c){return Zn(bo(c,a,b))}}function eo(a,b,c){return function(d){var e=function(c){return function(e,h){var l,m=a.getPointAtLength(h*c);l=Qn.b?Qn.b(m):Qn.call(null,m);m=P(l,0);l=P(l,1);m=new Q(null,2,5,S,[m,l],null);return b.a?b.a(d,m):b.call(null,d,m)}}(a.getTotalLength());return Zn(bo(d,e,c))}};function fo(){var a=go,b=De,c=ho,d=zn(null);Cn(d,b);var e=zn(1);fn(function(d,e){return function(){var h=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!U(e,Y)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Rm(c),d=Y;else throw f;}if(!U(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,
a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(d,e){return function(d){var f=d[1];if(1===f)return Nm(d,2,c);if(2===f){var f=b,g=d[2];d[7]=f;d[8]=g;d[2]=null;d[1]=3;return Y}return 3===f?(f=d[9],f=d[7],g=d[8],f=a.a?a.a(f,g):a.call(null,f,g),g=Cn(e,f),d[10]=g,d[9]=f,Nm(d,5,c)):4===f?(f=d[2],Pm(d,f)):5===f?(f=d[9],g=d[2],d[7]=f,d[8]=g,d[2]=null,d[1]=3,Y):null}}(d,e),d,e)}(),l=function(){var a=h.l?h.l():h.call(null);a[6]=d;return a}();return Mm(l)}}(e,d));return d}
function io(){var a=jo,b=Nn(),c=zn(1);fn(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!U(e,Y)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Rm(c),d=Y;else throw f;}if(!U(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.l=c;d.b=b;return d}()}(function(){return function(c){var d=c[1];return 1===d?(c[2]=null,c[1]=2,Y):2===d?Nm(c,4,a):3===d?(d=c[2],Pm(c,d)):4===d?(d=c[7],d=c[2],c[7]=d,c[1]=x(d)?5:6,Y):5===d?(d=c[7],d=b.b?b.b(d):b.call(null,d),c[8]=d,c[2]=null,c[1]=2,Y):6===d?(c[2]=null,c[1]=7,Y):7===d?(d=c[2],c[2]=d,c[1]=3,Y):null}}(c),c)}(),f=function(){var a=e.l?e.l():e.call(null);a[6]=c;return a}();return Mm(f)}}(c));return c};var ko,lo=new u(null,3,[jk,250,gj,500,oi,500],null);ko=V.b?V.b(lo):V.call(null,lo);function mo(a){return document.querySelector([B("#"),B(a),B(" .penny-path")].join(""))}function no(a){return document.querySelector([B("#"),B(a),B(" .ramp")].join(""))};function oo(a){this.Fa=a}oo.prototype.hd=function(a){return this.Fa.b?this.Fa.b(a):this.Fa.call(null,a)};ba("Hook",oo);ba("Hook.prototype.hook",oo.prototype.hd);function po(a){var b=P(a,0);a=P(a,1);return[B(b),B(","),B(a)].join("")}function qo(a,b,c){var d=P(a,0);P(a,1);a=P(b,0);var e=P(b,1);b=P(c,0);c=P(c,1);var d=d-a,f=(e-c)/2*(d/Math.abs(d)),g=f/2,d=new Q(null,2,5,S,[a+f,e],null);a=new Q(null,2,5,S,[a-g,e],null);e=new Q(null,2,5,S,[b-g,c],null);b=new Q(null,2,5,S,[b+f,c],null);return[B("L"),B(po(d)),B("C"),B(po(a)),B(","),B(po(e)),B(","),B(po(b))].join("")}function ro(a){return H(a)?C.c(B,"M",Ze(T.a(po,a))):null}
function so(a,b){return[B("translate("),B(a),B(","),B(b),B(")")].join("")}
function to(a){var b=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a,c=D.a(b,qi),d=D.a(b,rk),e=D.a(b,Sj),f=D.a(b,xh),g=D.a(b,ki),h=c/2;return new Q(null,4,5,S,[aj,new u(null,1,[Kh,so(h,h)],null),new Q(null,2,5,S,[ik,new u(null,5,[pj,"die",Sj,-h,xh,-h,qi,c,rk,c],null)],null),function(){return function(a,b,c,d,e,f,g,h,z){return function F(J){return new je(null,function(a,b,c,d,e){return function(){for(;;){var b=H(J);if(b){if(zd(b)){var c=ac(b),d=O(c),f=ne(d);a:for(var g=0;;)if(g<d){var h=gb.a(c,g),l=P(h,0),h=P(h,
1),l=new Q(null,2,5,S,[ni,new u(null,3,[nj,a.b?a.b(l):a.call(null,l),sj,a.b?a.b(h):a.call(null,h),Gh,e/10],null)],null);f.add(l);g+=1}else{c=!0;break a}return c?oe(f.U(),F(bc(b))):oe(f.U(),null)}c=I(b);f=P(c,0);c=P(c,1);return N(new Q(null,2,5,S,[ni,new u(null,3,[nj,a.b?a.b(f):a.call(null,f),sj,a.b?a.b(c):a.call(null,c),Gh,e/10],null)],null),F(Dc(b)))}return null}}}(a,b,c,d,e,f,g,h,z),null,null)}}(Ke(Pd,c/4),h,a,b,c,d,e,f,g)(Pn(g))}()],null)}
function uo(a,b){for(var c=a-10,d=jd,e=!0,f=b-10;;)if(0<f)d=te.a(d,e?new Q(null,2,5,S,[new Q(null,2,5,S,[c,f],null),new Q(null,2,5,S,[10,f],null)],null):new Q(null,2,5,S,[new Q(null,2,5,S,[10,f],null),new Q(null,2,5,S,[c,f],null)],null)),e=!e,f-=20;else{c=S;a:for(e=P(d,0),f=Xd(d,1),d=[B("M"),B(po(e))].join(""),P(f,0),P(f,1),Xd(f,2);;){var g=f,h=P(g,0),f=P(g,1),g=Xd(g,2),l;l=h;x(l)&&(l=f,l=x(l)?H(g):l);if(x(l))d=[B(d),B(qo(e,h,f))].join(""),e=f,f=g;else{d=x(h)?[B(d),B("L"),B(po(h))].join(""):d;break a}}return new Q(null,
2,5,c,[zh,new u(null,2,[pj,"penny-path",Oj,d],null)],null)}}function vo(a,b,c){a=a.getPointAtLength(c*b+20);return Qn.b?Qn.b(a):Qn.call(null,a)}function wo(a,b,c){var d=P(a,0);a=P(a,1);return new Q(null,4,5,S,[aj,new u(null,2,[Kh,so(d,a),Fj,x(c)?new oo(c):null],null),new Q(null,2,5,S,[ni,new u(null,2,[pj,"penny fill",Gh,8],null)],null),rc.a(b,pi)?new Q(null,2,5,S,[ni,new u(null,2,[pj,"tracer",Gh,4],null)],null):null],null)}
function xo(a,b,c){var d=null!=c&&(c.g&64||c.F)?C.a(Oc,c):c,e=D.a(d,nk),f=D.a(d,sk),g=D.a(d,Qh),h=D.a(d,Uh);return eb(eb(Ec,function(){var a=d.b?d.b(zh):d.call(null,zh);return x(a)?eb(eb(Ec,fe(Me(function(a,b,c,d,e,f,g,h,l){return function(F,J){var M=function(a,b,c,d,e,f,g){return function(b){return vo(a,b,g)}}(a,b,c,d,e,f,g,h,l);return wo(M(F),J,0<h?co(function(a,b,c,d,e,f,g,h,l){return function(b,c){var d;d=F-c*l;d=-1>d?-1:d;var e=a(d),f=P(e,0),e=P(e,1);b.setAttribute("transform",so(f,e));return rc.a(-1,
d)?b.setAttribute("transform","scale(0)"):null}}(M,a,b,c,d,e,f,g,h,l),new u(null,1,[Ci,(L.b?L.b(ko):L.call(null,ko)).call(null,gj)],null)):null)}}(a,a,c,d,d,e,f,g,h),e))),fe(Me(function(){return function(a,b,c,d,e,f,g,h,l,F){return function(J,M){var Ba=vo(b,a+J,h),E=P(Ba,0),na=P(Ba,1);return wo(new Q(null,2,5,S,[E,F],null),M,co(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){return function(a,c){return a.setAttribute("transform",so(b,r+c*d))}}(Ba,E,na,na-F,a,b,c,d,e,f,g,h,l,F),new u(null,3,[Ci,(L.b?L.b(ko):
L.call(null,ko)).call(null,oi),kk,50*J,zi,ao],null)))}}(O(e),a,a,c,d,d,e,f,g,h)}(),d.b?d.b(Ti):d.call(null,Ti)))):null}()),uo(a,b))}
function yo(a,b,c,d){var e=b-20,f=S;a=new u(null,2,[pj,"spout",Kh,so(0,a)],null);var g=S,e=[B(ro(new Q(null,6,5,S,[new Q(null,2,5,S,[b,-20],null),new Q(null,2,5,S,[b,23],null),new Q(null,2,5,S,[0,23],null),new Q(null,2,5,S,[0,3],null),new Q(null,2,5,S,[e,3],null),new Q(null,2,5,S,[e,-20],null)],null))),B("Z")].join("");return new Q(null,4,5,f,[aj,a,new Q(null,2,5,g,[zh,new u(null,1,[Oj,e],null)],null),x(d)?new Q(null,3,5,S,[wk,new u(null,2,[Kh,so(b/2,23),vi,-5],null),c],null):null],null)}
if("undefined"===typeof zo){var zo,Ao=V.b?V.b(De):V.call(null,De),Bo=V.b?V.b(De):V.call(null,De),Co=V.b?V.b(De):V.call(null,De),Do=V.b?V.b(De):V.call(null,De),Eo=D.c(De,dk,hh());zo=new uh(zc.a("pennygame.ui","station"),Ai,gi,Eo,Ao,Bo,Co,Do)}wh(zo,ri,function(a,b){var c=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a,d=D.a(c,qi);D.a(c,Aj);var e=D.a(c,Uh),c=D.c(c,lk,De);return yo(e,d,[B("Total Input: "),B(c.a?c.a(uj,0):c.call(null,uj,0))].join(""),b)});
wh(zo,Sh,function(a,b){var c=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a,d=D.a(c,qi),e=D.a(c,Aj),c=eb(eb(eb(Ec,yo(c.b?c.b(Uh):c.call(null,Uh),d,[B("Under-utilized: "),B(c.b?c.b(ek):c.call(null,ek))].join(""),b)),xo(d,e,new u(null,6,[nk,c.b?c.b(nk):c.call(null,nk),sk,c.b?c.b(Ah):c.call(null,Ah),Qh,x(c.b?c.b(Fi):c.call(null,Fi))?c.b?c.b(Wh):c.call(null,Wh):0,Ti,x(c.b?c.b(Qj):c.call(null,Qj))?c.b?c.b(ok):c.call(null,ok):null,zh,mo(c.b?c.b(oj):c.call(null,oj)),Uh,c.b?c.b(ti):c.call(null,ti)],null))),new Q(null,
2,5,S,[ik,new u(null,3,[pj,"bin",qi,d,rk,e],null)],null));a:for(var f=jd,g=!0,e=e-20;;)if(0<e)f=id.a(f,new Q(null,2,5,S,[ij,new u(null,4,[pj,"shelf",Kh,so(0,e),Uj,g?20:0,mk,g?d:d-20],null)],null)),g=!g,e-=20;else{d=new Q(null,3,5,S,[aj,De,C.a(pc,f)],null);break a}return eb(c,d)});
wh(zo,Hj,function(a,b){var c=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a,d=D.a(c,qi),e=D.a(c,oj),f=D.a(c,Aj),g=D.a(c,ti),h=D.c(c,lk,De),l=D.a(c,ok),m=D.a(c,Qj);return eb(eb(eb(eb(Ec,x(b)?new Q(null,3,5,S,[wk,new u(null,3,[Nh,d/2,vi,-4,yh,"middle"],null),[B("Total Output: "),B(h.a?h.a(yi,0):h.call(null,yi,0))].join("")],null):null),new Q(null,2,5,S,[Nj,new u(null,3,[wj,truckSrc,qi,d,rk,f],null)],null)),new Q(null,2,5,S,[zh,new u(null,2,[pj,"ramp",Oj,[B("M"),B(po(new Q(null,2,5,S,[10,g],null))),B("C"),B(po(new Q(null,
2,5,S,[10,f/2],null))),B(","),B(po(new Q(null,2,5,S,[10,f/2],null))),B(","),B(po(new Q(null,2,5,S,[d/2,f/2],null)))].join("")],null)],null)),function(){var b=no(e);return x(x(b)?m:b)?Me(function(a,b,c,d,e,f,g,h,l,m){return function(n,E){return wo(new Q(null,2,5,S,[10,g],null),E,eo(a,function(){return function(a,b){var c=P(b,0),d=P(b,1);return a.setAttribute("transform",so(c,d))}}(a,b,c,d,e,f,g,h,l,m),new u(null,3,[Ci,(L.b?L.b(ko):L.call(null,ko)).call(null,oi),kk,50*n,zi,ao],null)))}}(b,a,c,d,e,f,
g,h,l,m),l):null}())});
function Fo(a,b){var c=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a,d=D.a(c,Sj),e=D.a(c,Oh),f=D.a(c,Vh),g=D.a(c,Th);return x(x(d)?e:d)?new Q(null,3,5,S,[aj,new u(null,2,[pj,[B("scenario "),B(Yd(e))].join(""),Kh,so(d,0)],null),function(){return function(a,c,d,e,f,g){return function v(w){return new je(null,function(a,c,d,e,f,g){return function(){for(;;){var a=H(w);if(a){if(zd(a)){var c=ac(a),d=O(c),e=ne(d);return function(){for(var a=0;;)if(a<d){var f=gb.a(c,a),h=null!=f&&(f.g&64||f.F)?C.a(Oc,f):f,f=h,l=D.a(h,
pk),l=null!=l&&(l.g&64||l.F)?C.a(Oc,l):l,m=D.a(l,Ai),n=D.a(h,oj),p=D.a(h,xh),h=e,l=S,m=new u(null,3,[oj,n,pj,[B(Yd(m)),B(" productivity-"),B(Yd(m))].join(""),Kh,so(0,p)],null);H(g)&&(f=nd.c(f,lk,null==g?null:xb(g)));f=zo.a?zo.a(f,b):zo.call(null,f,b);h.add(new Q(null,3,5,l,[aj,m,f],null));a+=1}else return!0}()?oe(e.U(),v(bc(a))):oe(e.U(),null)}var f=I(a),h=f=null!=f&&(f.g&64||f.F)?C.a(Oc,f):f,l=D.a(f,pk),l=null!=l&&(l.g&64||l.F)?C.a(Oc,l):l,l=D.a(l,Ai),m=D.a(f,oj),f=D.a(f,xh);return N(new Q(null,
3,5,S,[aj,new u(null,3,[oj,m,pj,[B(Yd(l)),B(" productivity-"),B(Yd(l))].join(""),Kh,so(0,f)],null),H(g)?function(){var a=nd.c(h,lk,null==g?null:xb(g));return zo.a?zo.a(a,b):zo.call(null,a,b)}():zo.a?zo.a(h,b):zo.call(null,h,b)],null),v(Dc(a)))}return null}}}(a,c,d,e,f,g),null,null)}}(a,c,d,e,f,g)(fe(f))}()],null):null}
function Go(a,b,c,d){if(H(a)){var e=Vn(T.a(function(a){a=hd(xk.b(a));a=b.b?b.b(a):b.call(null,a);return gd(a)},a));return function(a){return function h(e){return new je(null,function(){return function(){for(var a=e;;)if(a=H(a)){if(zd(a)){var f=ac(a),p=O(f),q=ne(p);return function(){for(var a=0;;)if(a<p){var e=gb.a(f,a),h=P(e,0),h=null!=h&&(h.g&64||h.F)?C.a(Oc,h):h,l=D.a(h,xk),e=P(e,1),h=function(){var a=hd(l);return b.b?b.b(a):b.call(null,a)}(),h=P(h,0);x(h)&&pe(q,new Q(null,3,5,S,[wk,new u(null,
3,[pj,[B("label "),B(d)].join(""),Kh,so(h,e),vi,4],null),function(){var a=gd(hd(l));return c.b?c.b(a):c.call(null,a)}()],null));a+=1}else return!0}()?oe(q.U(),h(bc(a))):oe(q.U(),null)}var r=I(a),v=P(r,0),v=null!=v&&(v.g&64||v.F)?C.a(Oc,v):v,w=D.a(v,xk),r=P(r,1),v=function(){var a=hd(w);return b.b?b.b(a):b.call(null,a)}(),v=P(v,0);if(x(v))return N(new Q(null,3,5,S,[wk,new u(null,3,[pj,[B("label "),B(d)].join(""),Kh,so(v,r),vi,4],null),function(){var a=gd(hd(w));return c.b?c.b(a):c.call(null,a)}()],
null),h(Dc(a)));a=Dc(a)}else return null}}(a),null,null)}}(e)(T.c(Df,a,e))}return null}var Ho=new u(null,4,[Mj,qj,Zh,li,Ei,rj,Zj,Yj],null);
function Io(a,b,c,d){var e=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a,f=D.a(e,qi),g=D.a(e,rk),h=D.a(e,Sj),l=D.a(e,xh),m=null!=d&&(d.g&64||d.F)?C.a(Oc,d):d,n=D.a(m,Ni),p=D.a(m,qk),q=D.a(m,Oi),r=D.c(m,ji,Ld),v=g-60,w=function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){return function Aa(w){return new je(null,function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){return function(){for(var v=w;;){var z=H(v);if(z){var A=z;if(zd(A)){var E=ac(A),F=O(E),J=ne(F);return function(){for(var w=0;;)if(w<F){var M=gb.a(E,w),R=null!=
M&&(M.g&64||M.F)?C.a(Oc,M):M,W=D.a(R,Oh),X=D.a(R,Th);x(W)&&pe(J,new u(null,2,[Oh,W,xk,Me(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,A,E,F,M,J){return function(a,b){return new Q(null,2,5,S,[a,J.b?J.b(b):J.call(null,b)],null)}}(w,v,M,R,W,X,E,F,J,A,z,a,b,c,d,e,f,g,h,l,m,n,p,q,r),X)],null));w+=1}else return!0}()?oe(J.U(),Aa(bc(A))):oe(J.U(),null)}var M=I(A),R=null!=M&&(M.g&64||M.F)?C.a(Oc,M):M,W=D.a(R,Oh),X=D.a(R,Th);if(x(W))return N(new u(null,2,[Oh,W,xk,Me(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,
A){return function(a,b){return new Q(null,2,5,S,[a,A.b?A.b(b):A.call(null,b)],null)}}(v,M,R,W,X,A,z,a,b,c,d,e,f,g,h,l,m,n,p,q,r),X)],null),Aa(Dc(A)));v=Dc(A)}else return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r),null,null)}}(30,v,a,e,f,g,h,l,d,m,n,p,q,r)(b)}(),z=function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w){return function Ja(v){return new je(null,function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w){return function(){for(;;){var z=H(v);if(z){var A=z;if(zd(A)){var E=ac(A),F=O(E),M=ne(F);return function(){for(var v=
0;;)if(v<F){var J=gb.a(E,v),R=P(J,0),W=P(J,1),J=Me(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,A,E,F,J){return function(a,b){return new Q(null,2,5,S,[a,J.b?J.b(b):J.call(null,b)],null)}}(v,J,R,W,E,F,M,A,z,a,b,c,d,e,f,g,h,l,m,n,p,q,r,w),W);pe(M,new u(null,2,[Oh,Ho.b?Ho.b(R):Ho.call(null,R),xk,J],null));v+=1}else return!0}()?oe(M.U(),Ja(bc(A))):oe(M.U(),null)}var J=I(A),R=P(J,0),W=P(J,1),J=Me(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z){return function(a,b){return new Q(null,2,5,S,[a,z.b?z.b(b):z.call(null,
b)],null)}}(J,R,W,A,z,a,b,c,d,e,f,g,h,l,m,n,p,q,r,w),W);return N(new u(null,2,[Oh,Ho.b?Ho.b(R):Ho.call(null,R),xk,J],null),Ja(Dc(A)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w),null,null)}}(30,v,w,a,e,f,g,h,l,d,m,n,p,q,r)(c)}(),A=Xn(te.a(T.a(xk,w),T.a(xk,z)),new u(null,2,[qi,f-60,rk,v],null),new u(null,2,[Wj,jd,qk,p],null)),F=P(A,0),J=P(A,1),M=function(a,b,c,d,e,f,g){return function(a){return new Q(null,2,5,S,[function(){var b=I(a);return f.b?f.b(b):f.call(null,b)}(),function(){var b=gd(a);return g.b?
g.b(b):g.call(null,b)}()],null)}}(30,v,w,z,A,F,J,a,e,f,g,h,l,d,m,n,p,q,r);return new Q(null,5,5,S,[aj,new u(null,2,[pj,[B("graph "),B(x(c)?"averaging":null)].join(""),Kh,so(h,l)],null),new Q(null,2,5,S,[ik,new u(null,2,[qi,f,rk,g],null)],null),new Q(null,3,5,S,[wk,new u(null,4,[pj,"title",Sj,f/2,xh,g/2,vi,10],null),q],null),new Q(null,8,5,S,[aj,new u(null,1,[Kh,so(30,30)],null),function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,A,F,J){return function Ya(M){return new je(null,function(a,
b,c,d,e,f,g,h){return function(){for(;;){var a=H(M);if(a){if(zd(a)){var b=ac(a),c=O(b),d=ne(c);a:for(var e=0;;)if(e<c){var f=gb.a(b,e),g=null!=f&&(f.g&64||f.F)?C.a(Oc,f):f,f=D.a(g,Oh),g=D.a(g,xk),f=new Q(null,2,5,S,[zh,new u(null,2,[pj,[B("average stroke "),B(Yd(f))].join(""),Oj,ro(T.a(h,g))],null)],null);d.add(f);e+=1}else{b=!0;break a}return b?oe(d.U(),Ya(bc(a))):oe(d.U(),null)}d=I(a);b=null!=d&&(d.g&64||d.F)?C.a(Oc,d):d;d=D.a(b,Oh);b=D.a(b,xk);return N(new Q(null,2,5,S,[zh,new u(null,2,[pj,[B("average stroke "),
B(Yd(d))].join(""),Oj,ro(T.a(h,b))],null)],null),Ya(Dc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,A,F,J),null,null)}}(30,v,w,z,A,F,J,M,a,e,f,g,h,l,d,m,n,p,q,r)(z)}(),function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,A,F,J){return function Ya(M){return new je(null,function(a,b,c,d,e,f,g,h){return function(){for(;;){var a=H(M);if(a){if(zd(a)){var b=ac(a),c=O(b),d=ne(c);a:for(var e=0;;)if(e<c){var f=gb.a(b,e),g=null!=f&&(f.g&64||f.F)?C.a(Oc,f):f,f=D.a(g,Oh),g=D.a(g,xk),f=new Q(null,
2,5,S,[zh,new u(null,2,[pj,[B("history stroke "),B(Yd(f))].join(""),Oj,ro(T.a(h,g))],null)],null);d.add(f);e+=1}else{b=!0;break a}return b?oe(d.U(),Ya(bc(a))):oe(d.U(),null)}d=I(a);b=null!=d&&(d.g&64||d.F)?C.a(Oc,d):d;d=D.a(b,Oh);b=D.a(b,xk);return N(new Q(null,2,5,S,[zh,new u(null,2,[pj,[B("history stroke "),B(Yd(d))].join(""),Oj,ro(T.a(h,b))],null)],null),Ya(Dc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,v,z,A,F,J),null,null)}}(30,v,w,z,A,F,J,M,a,e,f,g,h,l,d,m,n,p,q,r)(w)}(),Go(w,M,r,"history"),
Go(z,M,r,"average"),new Q(null,2,5,S,[ij,new u(null,3,[pj,"axis",Kh,so(0,v),mk,f-60],null)],null),new Q(null,2,5,S,[ij,new u(null,2,[pj,"axis",ak,v],null)],null)],null)],null)}
function Jo(a,b,c){a=Rn(a);var d=P(a,0),e=P(a,1),f=P(a,2),g=P(a,3);return new Q(null,6,5,S,[aj,new u(null,1,[oj,"graphs"],null),Io(d,b,c,new u(null,4,[Oi,"Work in Progress",Ni,Ji,qk,new Q(null,1,5,S,[0],null),ji,function(){return function(a){return Math.round(a)}}(a,d,e,f,g)],null)),Io(e,b,c,new u(null,3,[Oi,"Total Output",Ni,yi,ji,function(){return function(a){return Math.round(a)}}(a,d,e,f,g)],null)),Io(f,b,c,new u(null,3,[Oi,"Inventory Turns",Ni,Jh,ji,function(){return function(a){return Math.round(a)}}(a,
d,e,f,g)],null)),Io(g,b,c,new u(null,4,[Oi,"Utilization",Ni,$i,qk,new Q(null,2,5,S,[0,1],null),ji,function(){return function(a){return[B(Math.round(100*a)),B("%")].join("")}}(a,d,e,f,g)],null))],null)}
function Ko(a,b){var c=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a,d=D.a(c,Vi),e=null!=d&&(d.g&64||d.F)?C.a(Oc,d):d,f=D.a(e,jk),g=D.a(e,Ki),h=D.a(c,dj),l=D.a(c,$h),m=D.a(c,Rh);return new Q(null,4,5,S,[Xi,new u(null,1,[oj,"controls"],null),new Q(null,9,5,S,[mi,new u(null,1,[Li,"slidden"],null),new Q(null,3,5,S,[bi,new u(null,1,[ui,function(){return function(){var a=new Q(null,3,5,S,[Hh,1,!0],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Roll"],null),new Q(null,3,5,S,[bi,new u(null,1,[ui,
function(){return function(){var a=new Q(null,3,5,S,[Hh,100,!0],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Run"],null),new Q(null,3,5,S,[bi,new u(null,1,[ui,function(){return function(){var a=new Q(null,3,5,S,[Hh,100,!1],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Run Fast"],null),new Q(null,3,5,S,[bi,new u(null,1,[ui,function(){return function(){var a=new Q(null,2,5,S,[Di,100],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Run Instantly"],
null),new Q(null,3,5,S,[bi,new u(null,1,[ui,function(a,c,d,e,f,g,h){return function(){var a=new Q(null,2,5,S,[zj,Pa(h)],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),x(h)?"Hide info":"Show info"],null),new Q(null,3,5,S,[bi,new u(null,1,[ui,function(a,c,d,e,f,g,h,l){return function(){var a=new Q(null,2,5,S,[Lj,Pa(l)],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),x(l)?"Hide graphs":"Show graphs"],null),x(l)?new Q(null,3,5,S,[bi,new u(null,2,[Xh,function(){var a=
0===f;return a?a:m}(),ui,function(a,c,d,e,f,g){return function(){var a=new Q(null,2,5,S,[Ki,Pa(g)],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),x(g)?"Hide averages":"Average"],null):null],null),new Q(null,8,5,S,[mi,new u(null,1,[Li,"slidden"],null),new Q(null,3,5,S,[bi,new u(null,1,[ui,function(){return function(){var a=new Q(null,2,5,S,[Vi,Mj],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Basic"],null),new Q(null,3,5,S,[bi,new u(null,1,[ui,function(){return function(){var a=
new Q(null,2,5,S,[Vi,Zh],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Efficient"],null),new Q(null,3,5,S,[bi,new u(null,1,[ui,function(){return function(){var a=new Q(null,2,5,S,[Vi,di],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Basic \x26 Efficient"],null),new Q(null,3,5,S,[bi,new u(null,1,[ui,function(){return function(){var a=new Q(null,2,5,S,[Vi,Ei],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Constrained"],null),new Q(null,
3,5,S,[bi,new u(null,1,[ui,function(){return function(){var a=new Q(null,2,5,S,[Vi,cj],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Basic, Efficient, \x26 Constrained"],null),new Q(null,3,5,S,[bi,new u(null,1,[ui,function(){return function(){var a=new Q(null,2,5,S,[Vi,jj],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Basic, Efficient, Constrained, \x26 Fixed"],null)],null)],null)}
function Lo(a){var b=Mo,c=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a,d=D.a(c,Vi),e=null!=d&&(d.g&64||d.F)?C.a(Oc,d):d,f=D.a(e,qi),g=D.a(e,rk),h=D.a(e,jk),l=D.a(e,lf),m=D.a(e,ii),n=D.a(e,Ki),p=D.a(c,dj),q=D.a(c,$h);return new Q(null,5,5,S,[ck,De,new Q(null,3,5,S,[Xi,new u(null,1,[Wi,new u(null,3,[Kj,Zj,tk,"5px",ci,"5px"],null)],null),new Q(null,4,5,S,[Xi,De,h," steps"],null)],null),Ko(c,b),new Q(null,5,5,S,[yj,new u(null,3,[oj,"space",qi,"100%",rk,"100%"],null),function(){return function(a,b,c,d,e,f,g,h,l,
m,n,p,q){return function X(ha){return new je(null,function(){return function(){for(;;){var a=H(ha);if(a){if(zd(a)){var b=ac(a),c=O(b),d=ne(c);a:for(var e=0;;)if(e<c){var f=gb.a(b,e),g=null!=f&&(f.g&64||f.F)?C.a(Oc,f):f,f=g,h=D.a(g,Sj),g=D.a(g,xh),f=x(h)?new Q(null,3,5,S,[aj,new u(null,1,[Kh,so(h,g)],null),to(f)],null):null;d.add(f);e+=1}else{b=!0;break a}return b?oe(d.U(),X(bc(a))):oe(d.U(),null)}d=I(a);d=c=null!=d&&(d.g&64||d.F)?C.a(Oc,d):d;b=D.a(c,Sj);c=D.a(c,xh);return N(x(b)?new Q(null,3,5,S,
[aj,new u(null,1,[Kh,so(b,c)],null),to(d)],null):null,X(Dc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q),null,null)}}(a,c,c,d,e,f,g,h,l,m,n,p,q)(l)}(),T.a(function(a,b,c,d,e,f,g,h,l,m,n,p){return function(a){return Fo(a,p)}}(a,c,c,d,e,f,g,h,l,m,n,p,q),m),x(x(f)?x(g)?q:g:f)?Jo(new Q(null,2,5,S,[f,g],null),m,n):null],null)],null)};xa=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new Bc(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,La.b?La.b(a):La.call(null,a))}a.w=0;a.B=function(a){a=H(a);return b(a)};a.i=b;return a}();
za=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new Bc(e,0)}return b.call(this,d)}function b(a){return console.error.apply(console,La.b?La.b(a):La.call(null,a))}a.w=0;a.B=function(a){a=H(a);return b(a)};a.i=b;return a}();
function No(a,b){var c=null!=b&&(b.g&64||b.F)?C.a(Oc,b):b,d=D.a(c,qi),e=D.a(c,Sj),f=Ue(1,Vh.b(I(af(Oh,ii.b(a))))),g=T.a(rk,f),h=T.a(xh,f);return kf(a,Ke(T,function(a,b,c,d,e,f,g){return function(a,b,c){return nd.i(a,Sj,g,G([xh,b+c+(0-f/2-20),qi,f,rk,f],0))}}(f,g,h,b,c,d,e)),h,g)}if("undefined"===typeof ho)var ho=zn(null);function Mo(a){return Cn(ho,a)}
function Oo(a,b){var c=zn(1);fn(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!U(e,Y)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Rm(c),d=Y;else throw f;}if(!U(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(){return function(c){var d=c[1];if(7===d){var d=c[2],e=$n();c[7]=d;return Nm(c,8,e)}return 20===d?(c[8]=c[2],c[1]=x(b)?21:22,Y):27===d?(d=c[2],Pm(c,d)):1===d?Om(c,2,ho,Jj):24===d?(d=c[2],c[2]=d,c[1]=23,Y):4===d?(d=new Q(null,2,5,S,[Qh,!0],null),Om(c,7,ho,d)):15===d?(c[9]=c[2],Om(c,19,ho,hk)):21===d?(c[2]=null,c[1]=23,Y):13===d?(d=new Q(null,2,5,S,[Ti,!0],null),Om(c,16,ho,d)):22===d?(d=
L.b?L.b(ko):L.call(null,ko),d=d.b?d.b(jk):d.call(null,jk),d=xn(d),Nm(c,24,d)):29===d?(d=c[2],c[2]=d,c[1]=27,Y):6===d?(c[10]=c[2],Om(c,10,ho,Ij)):28===d?(d=c[2],c[2]=d,c[1]=27,Y):25===d?(d=new Q(null,3,5,S,[Tj,c[11],b],null),Om(c,28,ho,d)):17===d?(d=new Q(null,2,5,S,[Ti,!1],null),c[12]=c[2],Om(c,18,ho,d)):3===d?(c[13]=c[2],c[1]=x(b)?4:5,Y):12===d?(c[14]=c[2],c[1]=x(b)?13:14,Y):2===d?(c[15]=c[2],Om(c,3,ho,Ch)):23===d?(d=c[2],e=a-1,c[11]=e,c[16]=d,c[1]=x(0<e)?25:26,Y):19===d?(c[17]=c[2],Om(c,20,ho,bj)):
11===d?(c[18]=c[2],Om(c,12,ho,fj)):9===d?(d=c[2],c[2]=d,c[1]=6,Y):5===d?(c[2]=null,c[1]=6,Y):14===d?(c[2]=null,c[1]=15,Y):26===d?(d=new Q(null,2,5,S,[Pi,!1],null),Om(c,29,ho,d)):16===d?(d=c[2],e=$n(),c[19]=d,Nm(c,17,e)):10===d?(c[20]=c[2],Om(c,11,ho,ej)):18===d?(d=c[2],c[2]=d,c[1]=15,Y):8===d?(d=new Q(null,2,5,S,[Qh,!1],null),c[21]=c[2],Om(c,9,ho,d)):null}}(c),c)}(),f=function(){var a=e.l?e.l():e.call(null);a[6]=c;return a}();return Mm(f)}}(c))}
function Po(){var a=zn(1);fn(function(a){return function(){var c=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var f=a(c);if(!U(f,Y)){d=f;break a}}}catch(g){if(g instanceof Object)c[5]=g,Rm(c),d=Y;else throw g;}if(!U(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.l=c;d.b=b;return d}()}(function(a){return function(b){var c=b[1];if(1===c){var d=xn(50);return Nm(b,2,d)}if(2===c){var l=b[2],m=function(){return function(){return function(a){return a.width}}(l,c,a)}(),d=Ng(m,function(){return function(){return function(a){return a.height}}(l,m,c,a)}()),n=document.getElementById("space").getBoundingClientRect(),n=d.b?d.b(n):d.call(null,n),d=P(n,0),n=P(n,1),d=Cn(ho,new Q(null,3,5,S,[Mi,d,n],null)),n=xn(100);b[7]=d;b[8]=l;return Nm(b,3,n)}if(3===
c){var d=b[2],n=Cn(ho,bk),p=xn(100);b[9]=d;b[10]=n;return Nm(b,4,p)}return 4===c?(d=b[2],n=Cn(ho,fj),b[11]=d,Pm(b,n)):null}}(a),a)}(),d=function(){var d=c.l?c.l():c.call(null);d[6]=a;return d}();return Mm(d)}}(a))}
function Qo(a,b){var c=ym(b),d=b.b?b.b(jk):b.call(null,jk),e=zn(1);fn(function(c,d,e,l){return function(){var m=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!U(e,Y)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Rm(c),d=Y;else throw f;}if(!U(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(c,d,e,f){return function(c){var g=c[1];if(7===g)return c[2]=null,c[1]=8,Y;if(1===g)return g=um(b),g=new Q(null,2,5,S,[Pj,g],null),Om(c,2,ho,g);if(4===g)return g=c[7],c[1]=x(50>g)?6:7,Y;if(6===g)return g=sm(e,a),g=d.b?d.b(g):d.call(null,g),g=new Q(null,2,5,S,[Pj,g],null),Om(c,9,ho,g);if(3===g)return g=c[2],c[8]=g,c[7]=0,c[2]=null,c[1]=4,Y;if(2===g){var g=c[2],h=xn(f);c[9]=g;return Nm(c,
3,h)}return 9===g?(g=c[2],h=xn(f),c[10]=g,Nm(c,10,h)):5===g?(g=c[2],Pm(c,g)):10===g?(g=c[7],c[11]=c[2],c[7]=g+1,c[2]=null,c[1]=4,Y):8===g?(g=c[2],c[2]=g,c[1]=5,Y):null}}(c,d,e,l),c,d,e,l)}(),n=function(){var a=m.l?m.l():m.call(null);a[6]=c;return a}();return Mm(n)}}(e,c,d,100))}
function go(a,b){var c=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a,d=D.a(c,ii);try{if(U(b,Qi))return c;throw On;}catch(e){if(e instanceof Error)if(e===On)try{if(wd(b)&&3===O(b))try{var f=ld(b,0);if(U(f,Mi)){var g=ld(b,1),h=ld(b,2);return jf(gf.c(ff(ff(c,new Q(null,2,5,S,[Vi,qi],null),g),new Q(null,2,5,S,[Vi,rk],null),h),new Q(null,2,5,S,[Vi,ii],null),Ke(Il,new u(null,3,[Sj,150,qi,g-150,rk,h],null))),Vi,No,new u(null,2,[Sj,45,qi,60],null))}throw On;}catch(l){if(l instanceof Error){f=l;if(f===On)throw On;throw f;
}throw l;}else throw On;}catch(m){if(m instanceof Error)if(f=m,f===On)try{if(U(b,bk))return jf(c,Vi,Ml,function(){return function(a){a=null!=a&&(a.g&64||a.F)?C.a(Oc,a):a;var b=D.a(a,oj),b=mo(b);return x(b)?nd.c(a,Bj,b.getTotalLength()):a}}(f,e,a,c,c,d));throw On;}catch(n){if(n instanceof Error)if(n===On)try{if(wd(b)&&2===O(b))try{var p=ld(b,0);if(U(p,Vi)){var q=ld(b,1);Po();var r=Kl(q.b?q.b(qm):q.call(null,qm));return nd.i(c,Vi,r,G([Hi,r,Rh,!1],0))}throw On;}catch(v){if(v instanceof Error)if(q=v,
q===On)try{p=ld(b,0);if(U(p,Pi)){var w=ld(b,1);return nd.c(c,Rh,w)}throw On;}catch(z){if(z instanceof Error){var A=z;if(A===On)throw On;throw A;}throw z;}else throw q;else throw v;}else throw On;}catch(F){if(F instanceof Error)if(q=F,q===On)try{if(wd(b)&&3===O(b))try{var J=ld(b,0);if(U(J,Hh)){var M=ld(b,1),Ba=ld(b,2);Oo(M,Ba);return nd.c(c,Rh,!0)}throw On;}catch(E){if(E instanceof Error)if(A=E,A===On)try{J=ld(b,0);if(U(J,Tj))return M=ld(b,1),Ba=ld(b,2),x(c.b?c.b(Rh):c.call(null,Rh))&&Oo(M,Ba),c;throw On;
}catch(na){if(na instanceof Error){var ka=na;if(ka===On)throw On;throw ka;}throw na;}else throw A;else throw E;}else throw On;}catch(R){if(R instanceof Error)if(A=R,A===On)try{if(wd(b)&&2===O(b))try{var fa=ld(b,0);if(U(fa,Di))return M=ld(b,1),hf(c,Vi,function(a){return function(b){return sm(a,b)}}(M,fa,A,q,n,f,e,a,c,c,d));throw On;}catch(X){if(X instanceof Error){ka=X;if(ka===On)throw On;throw ka;}throw X;}else throw On;}catch(ha){if(ha instanceof Error)if(ka=ha,ka===On)try{if(U(b,Jj))return jf(gf.c(c,
new Q(null,2,5,S,[Vi,jk],null),Rc),Vi,Ol,We(function(){return function(){return 6*Math.random()+1|0}}(ka,A,q,n,f,e,a,c,c,d)));throw On;}catch(W){if(W instanceof Error)if(W===On)try{if(U(b,Ch))return hf(c,Vi,Rl);throw On;}catch(ma){if(ma instanceof Error)if(ma===On)try{if(wd(b)&&2===O(b))try{var oa=ld(b,0);if(U(oa,Qh))return w=ld(b,1),jf(c,Vi,Ml,function(a){return function(b){return nd.c(b,Fi,a)}}(w,oa,ma,W,ka,A,q,n,f,e,a,c,c,d));throw On;}catch(qa){if(qa instanceof Error){p=qa;if(p===On)throw On;
throw p;}throw qa;}else throw On;}catch(va){if(va instanceof Error)if(p=va,p===On)try{if(U(b,Ij))return hf(c,Vi,am);throw On;}catch(ya){if(ya instanceof Error)if(ya===On)try{if(U(b,ej))return hf(c,Vi,cm);throw On;}catch(Ta){if(Ta instanceof Error)if(Ta===On)try{if(U(b,fj))return hf(c,Vi,bm);throw On;}catch(Aa){if(Aa instanceof Error)if(Aa===On)try{if(wd(b)&&2===O(b))try{var Ja=ld(b,0);if(U(Ja,Ti))return w=ld(b,1),jf(c,Vi,Ml,function(a){return function(b){return nd.c(b,Qj,a)}}(w,Ja,Aa,Ta,ya,p,ma,W,
ka,A,q,n,f,e,a,c,c,d));throw On;}catch(Ua){if(Ua instanceof Error){d=Ua;if(d===On)throw On;throw d;}throw Ua;}else throw On;}catch(Va){if(Va instanceof Error)if(d=Va,d===On)try{if(U(b,hk))return hf(c,Vi,dm);throw On;}catch(pb){if(pb instanceof Error)if(pb===On)try{if(U(b,bj))return hf(c,Vi,fm);throw On;}catch(Bb){if(Bb instanceof Error)if(Bb===On)try{if(wd(b)&&2===O(b))try{var Ya=ld(b,0);if(U(Ya,zj))return w=ld(b,1),nd.c(c,dj,w);throw On;}catch(Cc){if(Cc instanceof Error)if(d=Cc,d===On)try{Ya=ld(b,
0);if(U(Ya,Lj))return w=ld(b,1),nd.c(c,$h,w);throw On;}catch(cd){if(cd instanceof Error)if(cd===On)try{Ya=ld(b,0);if(U(Ya,Ki))return w=ld(b,1),x(w)?(Qo(c.b?c.b(Hi):c.call(null,Hi),c.b?c.b(Vi):c.call(null,Vi)),c):jf(c,Vi,pd,Ki);throw On;}catch(kh){if(kh instanceof Error)if(kh===On)try{Ya=ld(b,0);if(U(Ya,Pj)){var lh=ld(b,1);return ff(c,new Q(null,2,5,S,[Vi,Ki],null),lh)}throw On;}catch(Cj){if(Cj instanceof Error&&Cj===On)throw On;throw Cj;}else throw kh;else throw kh;}else throw cd;else throw cd;}else throw d;
else throw Cc;}else throw On;}catch(Dj){if(Dj instanceof Error){d=Dj;if(d===On)throw Error([B("No matching clause: "),B(b)].join(""));throw d;}throw Dj;}else throw Bb;else throw Bb;}else throw pb;else throw pb;}else throw d;else throw Va;}else throw Aa;else throw Aa;}else throw Ta;else throw Ta;}else throw ya;else throw ya;}else throw p;else throw va;}else throw ma;else throw ma;}else throw W;else throw W;}else throw ka;else throw ha;}else throw A;else throw R;}else throw q;else throw F;}else throw n;
else throw n;}else throw f;else throw m;}else throw e;else throw e;}}if("undefined"===typeof En)var En=fo();if("undefined"===typeof Ro){var jo;jo=Dn(function(a){return Lo(a)});var Ro;Ro=io()}
if("undefined"===typeof So)var So=function(){var a=zn(1);fn(function(a){return function(){var c=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var f=a(c);if(!U(f,Y)){d=f;break a}}}catch(g){if(g instanceof Object)c[5]=g,Rm(c),d=Y;else throw g;}if(!U(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.l=c;d.b=b;return d}()}(function(){return function(a){var b=a[1];return 1===b?Om(a,2,ho,new Q(null,2,5,S,[Vi,Mj],null)):2===b?(b=a[2],Pm(a,b)):null}}(a),a)}(),d=function(){var d=c.l?c.l():c.call(null);d[6]=a;return d}();return Mm(d)}}(a));return a}();