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
function u(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function ca(a){return"function"==u(a)}var da="closure_uid_"+(1E9*Math.random()>>>0),ga=0;function ha(a,b,c){return a.call.apply(a.bind,arguments)}function ia(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}
function ka(a,b,c){ka=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ha:ia;return ka.apply(null,arguments)};function la(a,b){for(var c in a)b.call(void 0,a[c],c,a)};function ma(a,b){null!=a&&this.append.apply(this,arguments)}k=ma.prototype;k.hb="";k.set=function(a){this.hb=""+a};k.append=function(a,b,c){this.hb+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.hb+=arguments[d];return this};k.clear=function(){this.hb=""};k.toString=function(){return this.hb};function pa(a,b){return a>b?1:a<b?-1:0};var ra={},sa;if("undefined"===typeof ta)var ta=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof ua)var ua=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var wa=null;if("undefined"===typeof xa)var xa=null;function ya(){return new v(null,5,[za,!0,Ba,!0,Ca,!1,Ea,!1,Fa,null],null)}Ga;function y(a){return null!=a&&!1!==a}Ia;z;function Ja(a){return null==a}function Ka(a){return a instanceof Array}
function Ma(a){return null==a?!0:!1===a?!0:!1}function Na(a,b){return a[u(null==b?null:b)]?!0:a._?!0:!1}function Oa(a,b){var c=null==b?null:b.constructor,c=y(y(c)?c.xb:c)?c.eb:u(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function Pa(a){var b=a.eb;return y(b)?b:""+C(a)}var Qa="undefined"!==typeof Symbol&&"function"===u(Symbol)?Symbol.iterator:"@@iterator";function Ra(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}E;Ua;
var Ga=function Ga(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ga.b(arguments[0]);case 2:return Ga.a(arguments[0],arguments[1]);default:throw Error([C("Invalid arity: "),C(c.length)].join(""));}};Ga.b=function(a){return Ga.a(null,a)};Ga.a=function(a,b){function c(a,b){a.push(b);return a}var d=[];return Ua.c?Ua.c(c,d,b):Ua.call(null,c,d,b)};Ga.w=2;function Va(){}function Wa(){}
var Xa=function Xa(b){if(null!=b&&null!=b.Y)return b.Y(b);var c=Xa[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Xa._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("ICounted.-count",b);},Ya=function Ya(b){if(null!=b&&null!=b.da)return b.da(b);var c=Ya[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Ya._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("IEmptyableCollection.-empty",b);};function Za(){}
var $a=function $a(b,c){if(null!=b&&null!=b.X)return b.X(b,c);var d=$a[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=$a._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Oa("ICollection.-conj",b);};function ab(){}
var bb=function bb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return bb.a(arguments[0],arguments[1]);case 3:return bb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([C("Invalid arity: "),C(c.length)].join(""));}};
bb.a=function(a,b){if(null!=a&&null!=a.ca)return a.ca(a,b);var c=bb[u(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=bb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Oa("IIndexed.-nth",a);};bb.c=function(a,b,c){if(null!=a&&null!=a.Ea)return a.Ea(a,b,c);var d=bb[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=bb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Oa("IIndexed.-nth",a);};bb.w=3;function cb(){}
var db=function db(b){if(null!=b&&null!=b.ta)return b.ta(b);var c=db[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=db._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("ISeq.-first",b);},eb=function eb(b){if(null!=b&&null!=b.xa)return b.xa(b);var c=eb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=eb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("ISeq.-rest",b);};function fb(){}function gb(){}
var hb=function hb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return hb.a(arguments[0],arguments[1]);case 3:return hb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([C("Invalid arity: "),C(c.length)].join(""));}};
hb.a=function(a,b){if(null!=a&&null!=a.N)return a.N(a,b);var c=hb[u(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=hb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Oa("ILookup.-lookup",a);};hb.c=function(a,b,c){if(null!=a&&null!=a.I)return a.I(a,b,c);var d=hb[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=hb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Oa("ILookup.-lookup",a);};hb.w=3;
var ib=function ib(b,c){if(null!=b&&null!=b.lc)return b.lc(b,c);var d=ib[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=ib._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Oa("IAssociative.-contains-key?",b);},jb=function jb(b,c,d){if(null!=b&&null!=b.Oa)return b.Oa(b,c,d);var e=jb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=jb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Oa("IAssociative.-assoc",b);};function kb(){}
var lb=function lb(b,c){if(null!=b&&null!=b.ib)return b.ib(b,c);var d=lb[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=lb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Oa("IMap.-dissoc",b);};function mb(){}
var nb=function nb(b){if(null!=b&&null!=b.Mb)return b.Mb(b);var c=nb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=nb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("IMapEntry.-key",b);},ob=function ob(b){if(null!=b&&null!=b.Nb)return b.Nb(b);var c=ob[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ob._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("IMapEntry.-val",b);};function pb(){}
var qb=function qb(b){if(null!=b&&null!=b.jb)return b.jb(b);var c=qb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=qb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("IStack.-peek",b);};function rb(){}
var sb=function sb(b,c,d){if(null!=b&&null!=b.kb)return b.kb(b,c,d);var e=sb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=sb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Oa("IVector.-assoc-n",b);},tb=function tb(b){if(null!=b&&null!=b.Jb)return b.Jb(b);var c=tb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=tb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("IDeref.-deref",b);};function ub(){}
var vb=function vb(b){if(null!=b&&null!=b.O)return b.O(b);var c=vb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=vb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("IMeta.-meta",b);},wb=function wb(b,c){if(null!=b&&null!=b.P)return b.P(b,c);var d=wb[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=wb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Oa("IWithMeta.-with-meta",b);};function xb(){}
var yb=function yb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return yb.a(arguments[0],arguments[1]);case 3:return yb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([C("Invalid arity: "),C(c.length)].join(""));}};
yb.a=function(a,b){if(null!=a&&null!=a.ea)return a.ea(a,b);var c=yb[u(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=yb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Oa("IReduce.-reduce",a);};yb.c=function(a,b,c){if(null!=a&&null!=a.fa)return a.fa(a,b,c);var d=yb[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=yb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Oa("IReduce.-reduce",a);};yb.w=3;
var zb=function zb(b,c,d){if(null!=b&&null!=b.Lb)return b.Lb(b,c,d);var e=zb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=zb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Oa("IKVReduce.-kv-reduce",b);},Ab=function Ab(b,c){if(null!=b&&null!=b.C)return b.C(b,c);var d=Ab[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Ab._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Oa("IEquiv.-equiv",b);},Bb=function Bb(b){if(null!=b&&null!=b.T)return b.T(b);
var c=Bb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Bb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("IHash.-hash",b);};function Cb(){}var Db=function Db(b){if(null!=b&&null!=b.U)return b.U(b);var c=Db[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Db._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("ISeqable.-seq",b);};function Fb(){}function Gb(){}function Hb(){}
var Ib=function Ib(b){if(null!=b&&null!=b.bc)return b.bc(b);var c=Ib[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Ib._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("IReversible.-rseq",b);},Jb=function Jb(b,c){if(null!=b&&null!=b.Bc)return b.Bc(0,c);var d=Jb[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Jb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Oa("IWriter.-write",b);},Kb=function Kb(b,c,d){if(null!=b&&null!=b.M)return b.M(b,c,d);
var e=Kb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Kb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Oa("IPrintWithWriter.-pr-writer",b);},Lb=function Lb(b,c,d){if(null!=b&&null!=b.Ac)return b.Ac(0,c,d);var e=Lb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Lb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Oa("IWatchable.-notify-watches",b);},Mb=function Mb(b){if(null!=b&&null!=b.vb)return b.vb(b);var c=Mb[u(null==
b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Mb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("IEditableCollection.-as-transient",b);},Nb=function Nb(b,c){if(null!=b&&null!=b.Rb)return b.Rb(b,c);var d=Nb[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Nb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Oa("ITransientCollection.-conj!",b);},Ob=function Ob(b){if(null!=b&&null!=b.Sb)return b.Sb(b);var c=Ob[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):
c.call(null,b);c=Ob._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("ITransientCollection.-persistent!",b);},Pb=function Pb(b,c,d){if(null!=b&&null!=b.Qb)return b.Qb(b,c,d);var e=Pb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Pb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Oa("ITransientAssociative.-assoc!",b);},Qb=function Qb(b,c,d){if(null!=b&&null!=b.zc)return b.zc(0,c,d);var e=Qb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,
b,c,d);e=Qb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Oa("ITransientVector.-assoc-n!",b);};function Rb(){}
var Sb=function Sb(b,c){if(null!=b&&null!=b.ub)return b.ub(b,c);var d=Sb[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Sb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Oa("IComparable.-compare",b);},Ub=function Ub(b){if(null!=b&&null!=b.wc)return b.wc();var c=Ub[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Ub._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("IChunk.-drop-first",b);},Vb=function Vb(b){if(null!=b&&null!=b.nc)return b.nc(b);
var c=Vb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Vb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("IChunkedSeq.-chunked-first",b);},Wb=function Wb(b){if(null!=b&&null!=b.oc)return b.oc(b);var c=Wb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Wb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("IChunkedSeq.-chunked-rest",b);},Xb=function Xb(b){if(null!=b&&null!=b.mc)return b.mc(b);var c=Xb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,
b);c=Xb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("IChunkedNext.-chunked-next",b);},Yb=function Yb(b){if(null!=b&&null!=b.Ob)return b.Ob(b);var c=Yb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Yb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("INamed.-name",b);},Zb=function Zb(b){if(null!=b&&null!=b.Pb)return b.Pb(b);var c=Zb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Zb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("INamed.-namespace",
b);},$b=function $b(b,c){if(null!=b&&null!=b.Zc)return b.Zc(b,c);var d=$b[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=$b._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Oa("IReset.-reset!",b);},ac=function ac(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return ac.a(arguments[0],arguments[1]);case 3:return ac.c(arguments[0],arguments[1],arguments[2]);case 4:return ac.o(arguments[0],arguments[1],arguments[2],
arguments[3]);case 5:return ac.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([C("Invalid arity: "),C(c.length)].join(""));}};ac.a=function(a,b){if(null!=a&&null!=a.ad)return a.ad(a,b);var c=ac[u(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=ac._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Oa("ISwap.-swap!",a);};
ac.c=function(a,b,c){if(null!=a&&null!=a.bd)return a.bd(a,b,c);var d=ac[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=ac._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Oa("ISwap.-swap!",a);};ac.o=function(a,b,c,d){if(null!=a&&null!=a.cd)return a.cd(a,b,c,d);var e=ac[u(null==a?null:a)];if(null!=e)return e.o?e.o(a,b,c,d):e.call(null,a,b,c,d);e=ac._;if(null!=e)return e.o?e.o(a,b,c,d):e.call(null,a,b,c,d);throw Oa("ISwap.-swap!",a);};
ac.A=function(a,b,c,d,e){if(null!=a&&null!=a.dd)return a.dd(a,b,c,d,e);var f=ac[u(null==a?null:a)];if(null!=f)return f.A?f.A(a,b,c,d,e):f.call(null,a,b,c,d,e);f=ac._;if(null!=f)return f.A?f.A(a,b,c,d,e):f.call(null,a,b,c,d,e);throw Oa("ISwap.-swap!",a);};ac.w=5;var bc=function bc(b){if(null!=b&&null!=b.Ga)return b.Ga(b);var c=bc[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=bc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("IIterable.-iterator",b);};
function cc(a){this.rd=a;this.g=1073741824;this.B=0}cc.prototype.Bc=function(a,b){return this.rd.append(b)};function dc(a){var b=new ma;a.M(null,new cc(b),ya());return""+C(b)}var ec="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function fc(a){a=ec(a|0,-862048943);return ec(a<<15|a>>>-15,461845907)}
function gc(a,b){var c=(a|0)^(b|0);return ec(c<<13|c>>>-13,5)+-430675100|0}function hc(a,b){var c=(a|0)^b,c=ec(c^c>>>16,-2048144789),c=ec(c^c>>>13,-1028477387);return c^c>>>16}function ic(a){var b;a:{b=1;for(var c=0;;)if(b<a.length){var d=b+2,c=gc(c,fc(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^fc(a.charCodeAt(a.length-1)):b;return hc(b,ec(2,a.length))}jc;kc;lc;mc;var nc={},oc=0;
function pc(a){255<oc&&(nc={},oc=0);var b=nc[a];if("number"!==typeof b){a:if(null!=a)if(b=a.length,0<b)for(var c=0,d=0;;)if(c<b)var e=c+1,d=ec(31,d)+a.charCodeAt(c),c=e;else{b=d;break a}else b=0;else b=0;nc[a]=b;oc+=1}return a=b}function qc(a){null!=a&&(a.g&4194304||a.xd)?a=a.T(null):"number"===typeof a?a=Math.floor(a)%2147483647:!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=pc(a),0!==a&&(a=fc(a),a=gc(0,a),a=hc(a,4))):a=a instanceof Date?a.valueOf():null==a?0:Bb(a);return a}
function rc(a,b){return a^b+2654435769+(a<<6)+(a>>2)}function Ia(a,b){return b instanceof a}function sc(a,b){if(a.$a===b.$a)return 0;var c=Ma(a.Ba);if(y(c?b.Ba:c))return-1;if(y(a.Ba)){if(Ma(b.Ba))return 1;c=pa(a.Ba,b.Ba);return 0===c?pa(a.name,b.name):c}return pa(a.name,b.name)}F;function kc(a,b,c,d,e){this.Ba=a;this.name=b;this.$a=c;this.tb=d;this.Da=e;this.g=2154168321;this.B=4096}k=kc.prototype;k.toString=function(){return this.$a};k.equiv=function(a){return this.C(null,a)};
k.C=function(a,b){return b instanceof kc?this.$a===b.$a:!1};k.call=function(){function a(a,b,c){return F.c?F.c(b,this,c):F.call(null,b,this,c)}function b(a,b){return F.a?F.a(b,this):F.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ra(b)))};
k.b=function(a){return F.a?F.a(a,this):F.call(null,a,this)};k.a=function(a,b){return F.c?F.c(a,this,b):F.call(null,a,this,b)};k.O=function(){return this.Da};k.P=function(a,b){return new kc(this.Ba,this.name,this.$a,this.tb,b)};k.T=function(){var a=this.tb;return null!=a?a:this.tb=a=rc(ic(this.name),pc(this.Ba))};k.Ob=function(){return this.name};k.Pb=function(){return this.Ba};k.M=function(a,b){return Jb(b,this.$a)};
var tc=function tc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return tc.b(arguments[0]);case 2:return tc.a(arguments[0],arguments[1]);default:throw Error([C("Invalid arity: "),C(c.length)].join(""));}};tc.b=function(a){if(a instanceof kc)return a;var b=a.indexOf("/");return-1===b?tc.a(null,a):tc.a(a.substring(0,b),a.substring(b+1,a.length))};tc.a=function(a,b){var c=null!=a?[C(a),C("/"),C(b)].join(""):b;return new kc(a,b,c,null,null)};
tc.w=2;uc;vc;wc;function H(a){if(null==a)return null;if(null!=a&&(a.g&8388608||a.$c))return a.U(null);if(Ka(a)||"string"===typeof a)return 0===a.length?null:new wc(a,0);if(Na(Cb,a))return Db(a);throw Error([C(a),C(" is not ISeqable")].join(""));}function J(a){if(null==a)return null;if(null!=a&&(a.g&64||a.F))return a.ta(null);a=H(a);return null==a?null:db(a)}function xc(a){return null!=a?null!=a&&(a.g&64||a.F)?a.xa(null):(a=H(a))?eb(a):yc:yc}
function K(a){return null==a?null:null!=a&&(a.g&128||a.ac)?a.wa(null):H(xc(a))}var lc=function lc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return lc.b(arguments[0]);case 2:return lc.a(arguments[0],arguments[1]);default:return lc.j(arguments[0],arguments[1],new wc(c.slice(2),0))}};lc.b=function(){return!0};lc.a=function(a,b){return null==a?null==b:a===b||Ab(a,b)};
lc.j=function(a,b,c){for(;;)if(lc.a(a,b))if(K(c))a=b,b=J(c),c=K(c);else return lc.a(b,J(c));else return!1};lc.D=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return lc.j(b,a,c)};lc.w=2;function zc(a){this.J=a}zc.prototype.next=function(){if(null!=this.J){var a=J(this.J);this.J=K(this.J);return{value:a,done:!1}}return{value:null,done:!0}};function Ac(a){return new zc(H(a))}Bc;function Cc(a,b,c){this.value=a;this.Db=b;this.jc=c;this.g=8388672;this.B=0}Cc.prototype.U=function(){return this};
Cc.prototype.ta=function(){return this.value};Cc.prototype.xa=function(){null==this.jc&&(this.jc=Bc.b?Bc.b(this.Db):Bc.call(null,this.Db));return this.jc};function Bc(a){var b=a.next();return y(b.done)?yc:new Cc(b.value,a,null)}function Dc(a,b){var c=fc(a),c=gc(0,c);return hc(c,b)}function Fc(a){var b=0,c=1;for(a=H(a);;)if(null!=a)b+=1,c=ec(31,c)+qc(J(a))|0,a=K(a);else return Dc(c,b)}var Gc=Dc(1,0);function Hc(a){var b=0,c=0;for(a=H(a);;)if(null!=a)b+=1,c=c+qc(J(a))|0,a=K(a);else return Dc(c,b)}
var Ic=Dc(0,0);Jc;jc;Lc;Wa["null"]=!0;Xa["null"]=function(){return 0};Date.prototype.C=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};Date.prototype.Ib=!0;Date.prototype.ub=function(a,b){if(b instanceof Date)return pa(this.valueOf(),b.valueOf());throw Error([C("Cannot compare "),C(this),C(" to "),C(b)].join(""));};Ab.number=function(a,b){return a===b};Mc;Va["function"]=!0;ub["function"]=!0;vb["function"]=function(){return null};Bb._=function(a){return a[da]||(a[da]=++ga)};
function Nc(a){return a+1}L;function Oc(a){this.H=a;this.g=32768;this.B=0}Oc.prototype.Jb=function(){return this.H};function Pc(a){return a instanceof Oc}function L(a){return tb(a)}function Qc(a,b){var c=Xa(a);if(0===c)return b.l?b.l():b.call(null);for(var d=bb.a(a,0),e=1;;)if(e<c){var f=bb.a(a,e),d=b.a?b.a(d,f):b.call(null,d,f);if(Pc(d))return tb(d);e+=1}else return d}
function Rc(a,b,c){var d=Xa(a),e=c;for(c=0;;)if(c<d){var f=bb.a(a,c),e=b.a?b.a(e,f):b.call(null,e,f);if(Pc(e))return tb(e);c+=1}else return e}function Sc(a,b){var c=a.length;if(0===a.length)return b.l?b.l():b.call(null);for(var d=a[0],e=1;;)if(e<c){var f=a[e],d=b.a?b.a(d,f):b.call(null,d,f);if(Pc(d))return tb(d);e+=1}else return d}function Tc(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var f=a[c],e=b.a?b.a(e,f):b.call(null,e,f);if(Pc(e))return tb(e);c+=1}else return e}
function Uc(a,b,c,d){for(var e=a.length;;)if(d<e){var f=a[d];c=b.a?b.a(c,f):b.call(null,c,f);if(Pc(c))return tb(c);d+=1}else return c}Vc;Wc;Xc;Yc;function Zc(a){return null!=a?a.g&2||a.Qc?!0:a.g?!1:Na(Wa,a):Na(Wa,a)}function $c(a){return null!=a?a.g&16||a.xc?!0:a.g?!1:Na(ab,a):Na(ab,a)}function ad(a,b){this.f=a;this.s=b}ad.prototype.ya=function(){return this.s<this.f.length};ad.prototype.next=function(){var a=this.f[this.s];this.s+=1;return a};
function wc(a,b){this.f=a;this.s=b;this.g=166199550;this.B=8192}k=wc.prototype;k.toString=function(){return dc(this)};k.equiv=function(a){return this.C(null,a)};k.ca=function(a,b){var c=b+this.s;return c<this.f.length?this.f[c]:null};k.Ea=function(a,b,c){a=b+this.s;return a<this.f.length?this.f[a]:c};k.Ga=function(){return new ad(this.f,this.s)};k.wa=function(){return this.s+1<this.f.length?new wc(this.f,this.s+1):null};k.Y=function(){var a=this.f.length-this.s;return 0>a?0:a};
k.bc=function(){var a=Xa(this);return 0<a?new Xc(this,a-1,null):null};k.T=function(){return Fc(this)};k.C=function(a,b){return Lc.a?Lc.a(this,b):Lc.call(null,this,b)};k.da=function(){return yc};k.ea=function(a,b){return Uc(this.f,b,this.f[this.s],this.s+1)};k.fa=function(a,b,c){return Uc(this.f,b,c,this.s)};k.ta=function(){return this.f[this.s]};k.xa=function(){return this.s+1<this.f.length?new wc(this.f,this.s+1):yc};k.U=function(){return this.s<this.f.length?this:null};
k.X=function(a,b){return Wc.a?Wc.a(b,this):Wc.call(null,b,this)};wc.prototype[Qa]=function(){return Ac(this)};var vc=function vc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return vc.b(arguments[0]);case 2:return vc.a(arguments[0],arguments[1]);default:throw Error([C("Invalid arity: "),C(c.length)].join(""));}};vc.b=function(a){return vc.a(a,0)};vc.a=function(a,b){return b<a.length?new wc(a,b):null};vc.w=2;
var uc=function uc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return uc.b(arguments[0]);case 2:return uc.a(arguments[0],arguments[1]);default:throw Error([C("Invalid arity: "),C(c.length)].join(""));}};uc.b=function(a){return vc.a(a,0)};uc.a=function(a,b){return vc.a(a,b)};uc.w=2;Mc;bd;function Xc(a,b,c){this.$b=a;this.s=b;this.v=c;this.g=32374990;this.B=8192}k=Xc.prototype;k.toString=function(){return dc(this)};
k.equiv=function(a){return this.C(null,a)};k.O=function(){return this.v};k.wa=function(){return 0<this.s?new Xc(this.$b,this.s-1,null):null};k.Y=function(){return this.s+1};k.T=function(){return Fc(this)};k.C=function(a,b){return Lc.a?Lc.a(this,b):Lc.call(null,this,b)};k.da=function(){var a=yc,b=this.v;return Mc.a?Mc.a(a,b):Mc.call(null,a,b)};k.ea=function(a,b){return bd.a?bd.a(b,this):bd.call(null,b,this)};k.fa=function(a,b,c){return bd.c?bd.c(b,c,this):bd.call(null,b,c,this)};
k.ta=function(){return bb.a(this.$b,this.s)};k.xa=function(){return 0<this.s?new Xc(this.$b,this.s-1,null):yc};k.U=function(){return this};k.P=function(a,b){return new Xc(this.$b,this.s,b)};k.X=function(a,b){return Wc.a?Wc.a(b,this):Wc.call(null,b,this)};Xc.prototype[Qa]=function(){return Ac(this)};function cd(a){return J(K(a))}function dd(a){for(;;){var b=K(a);if(null!=b)a=b;else return J(a)}}Ab._=function(a,b){return a===b};
var ed=function ed(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return ed.l();case 1:return ed.b(arguments[0]);case 2:return ed.a(arguments[0],arguments[1]);default:return ed.j(arguments[0],arguments[1],new wc(c.slice(2),0))}};ed.l=function(){return fd};ed.b=function(a){return a};ed.a=function(a,b){return null!=a?$a(a,b):$a(yc,b)};ed.j=function(a,b,c){for(;;)if(y(c))a=ed.a(a,b),b=J(c),c=K(c);else return ed.a(a,b)};
ed.D=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return ed.j(b,a,c)};ed.w=2;function M(a){if(null!=a)if(null!=a&&(a.g&2||a.Qc))a=a.Y(null);else if(Ka(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.g&8388608||a.$c))a:{a=H(a);for(var b=0;;){if(Zc(a)){a=b+Xa(a);break a}a=K(a);b+=1}}else a=Xa(a);else a=0;return a}function gd(a,b){for(var c=null;;){if(null==a)return c;if(0===b)return H(a)?J(a):c;if($c(a))return bb.c(a,b,c);if(H(a)){var d=K(a),e=b-1;a=d;b=e}else return c}}
function hd(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.g&16||a.xc))return a.ca(null,b);if(Ka(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.g&64||a.F)){var c;a:{c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(H(c)){c=J(c);break a}throw Error("Index out of bounds");}if($c(c)){c=bb.a(c,d);break a}if(H(c))c=K(c),--d;else throw Error("Index out of bounds");
}}return c}if(Na(ab,a))return bb.a(a,b);throw Error([C("nth not supported on this type "),C(Pa(null==a?null:a.constructor))].join(""));}
function N(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return null;if(null!=a&&(a.g&16||a.xc))return a.Ea(null,b,null);if(Ka(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.g&64||a.F))return gd(a,b);if(Na(ab,a))return bb.a(a,b);throw Error([C("nth not supported on this type "),C(Pa(null==a?null:a.constructor))].join(""));}
var F=function F(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return F.a(arguments[0],arguments[1]);case 3:return F.c(arguments[0],arguments[1],arguments[2]);default:throw Error([C("Invalid arity: "),C(c.length)].join(""));}};F.a=function(a,b){return null==a?null:null!=a&&(a.g&256||a.yc)?a.N(null,b):Ka(a)?b<a.length?a[b|0]:null:"string"===typeof a?b<a.length?a[b|0]:null:Na(gb,a)?hb.a(a,b):null};
F.c=function(a,b,c){return null!=a?null!=a&&(a.g&256||a.yc)?a.I(null,b,c):Ka(a)?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:Na(gb,a)?hb.c(a,b,c):c:c};F.w=3;id;var jd=function jd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return jd.c(arguments[0],arguments[1],arguments[2]);default:return jd.j(arguments[0],arguments[1],arguments[2],new wc(c.slice(3),0))}};
jd.c=function(a,b,c){if(null!=a)a=jb(a,b,c);else a:{a=[b];c=[c];b=a.length;var d=0,e;for(e=Mb(kd);;)if(d<b){var f=d+1;e=e.Qb(null,a[d],c[d]);d=f}else{a=Ob(e);break a}}return a};jd.j=function(a,b,c,d){for(;;)if(a=jd.c(a,b,c),y(d))b=J(d),c=cd(d),d=K(K(d));else return a};jd.D=function(a){var b=J(a),c=K(a);a=J(c);var d=K(c),c=J(d),d=K(d);return jd.j(b,a,c,d)};jd.w=3;
var ld=function ld(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ld.b(arguments[0]);case 2:return ld.a(arguments[0],arguments[1]);default:return ld.j(arguments[0],arguments[1],new wc(c.slice(2),0))}};ld.b=function(a){return a};ld.a=function(a,b){return null==a?null:lb(a,b)};ld.j=function(a,b,c){for(;;){if(null==a)return null;a=ld.a(a,b);if(y(c))b=J(c),c=K(c);else return a}};
ld.D=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return ld.j(b,a,c)};ld.w=2;function md(a,b){this.h=a;this.v=b;this.g=393217;this.B=0}k=md.prototype;k.O=function(){return this.v};k.P=function(a,b){return new md(this.h,b)};k.Pc=!0;
k.call=function(){function a(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,G,A,I){a=this;return E.wb?E.wb(a.h,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,G,A,I):E.call(null,a.h,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,G,A,I)}function b(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,G,A){a=this;return a.h.qa?a.h.qa(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,G,A):a.h.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,G,A)}function c(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,G){a=this;return a.h.pa?a.h.pa(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,G):
a.h.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,G)}function d(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D){a=this;return a.h.oa?a.h.oa(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D):a.h.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D)}function e(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B){a=this;return a.h.na?a.h.na(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B):a.h.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B)}function f(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x){a=this;return a.h.ma?a.h.ma(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x):a.h.call(null,b,
c,d,e,f,g,h,l,m,n,p,q,r,t,w,x)}function g(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w){a=this;return a.h.la?a.h.la(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w):a.h.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w)}function h(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t){a=this;return a.h.ka?a.h.ka(b,c,d,e,f,g,h,l,m,n,p,q,r,t):a.h.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t)}function l(a,b,c,d,e,f,g,h,l,m,n,p,q,r){a=this;return a.h.ja?a.h.ja(b,c,d,e,f,g,h,l,m,n,p,q,r):a.h.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r)}function m(a,b,c,d,e,f,g,h,l,m,n,p,q){a=this;
return a.h.ia?a.h.ia(b,c,d,e,f,g,h,l,m,n,p,q):a.h.call(null,b,c,d,e,f,g,h,l,m,n,p,q)}function n(a,b,c,d,e,f,g,h,l,m,n,p){a=this;return a.h.ha?a.h.ha(b,c,d,e,f,g,h,l,m,n,p):a.h.call(null,b,c,d,e,f,g,h,l,m,n,p)}function p(a,b,c,d,e,f,g,h,l,m,n){a=this;return a.h.ga?a.h.ga(b,c,d,e,f,g,h,l,m,n):a.h.call(null,b,c,d,e,f,g,h,l,m,n)}function q(a,b,c,d,e,f,g,h,l,m){a=this;return a.h.sa?a.h.sa(b,c,d,e,f,g,h,l,m):a.h.call(null,b,c,d,e,f,g,h,l,m)}function r(a,b,c,d,e,f,g,h,l){a=this;return a.h.ra?a.h.ra(b,c,
d,e,f,g,h,l):a.h.call(null,b,c,d,e,f,g,h,l)}function t(a,b,c,d,e,f,g,h){a=this;return a.h.ba?a.h.ba(b,c,d,e,f,g,h):a.h.call(null,b,c,d,e,f,g,h)}function w(a,b,c,d,e,f,g){a=this;return a.h.aa?a.h.aa(b,c,d,e,f,g):a.h.call(null,b,c,d,e,f,g)}function x(a,b,c,d,e,f){a=this;return a.h.A?a.h.A(b,c,d,e,f):a.h.call(null,b,c,d,e,f)}function B(a,b,c,d,e){a=this;return a.h.o?a.h.o(b,c,d,e):a.h.call(null,b,c,d,e)}function D(a,b,c,d){a=this;return a.h.c?a.h.c(b,c,d):a.h.call(null,b,c,d)}function I(a,b,c){a=this;
return a.h.a?a.h.a(b,c):a.h.call(null,b,c)}function G(a,b){a=this;return a.h.b?a.h.b(b):a.h.call(null,b)}function ja(a){a=this;return a.h.l?a.h.l():a.h.call(null)}var A=null,A=function(Z,ea,O,V,T,X,fa,na,oa,qa,va,A,Aa,Da,Ha,Sa,Ta,Eb,Tb,Ec,wd,xd){switch(arguments.length){case 1:return ja.call(this,Z);case 2:return G.call(this,Z,ea);case 3:return I.call(this,Z,ea,O);case 4:return D.call(this,Z,ea,O,V);case 5:return B.call(this,Z,ea,O,V,T);case 6:return x.call(this,Z,ea,O,V,T,X);case 7:return w.call(this,
Z,ea,O,V,T,X,fa);case 8:return t.call(this,Z,ea,O,V,T,X,fa,na);case 9:return r.call(this,Z,ea,O,V,T,X,fa,na,oa);case 10:return q.call(this,Z,ea,O,V,T,X,fa,na,oa,qa);case 11:return p.call(this,Z,ea,O,V,T,X,fa,na,oa,qa,va);case 12:return n.call(this,Z,ea,O,V,T,X,fa,na,oa,qa,va,A);case 13:return m.call(this,Z,ea,O,V,T,X,fa,na,oa,qa,va,A,Aa);case 14:return l.call(this,Z,ea,O,V,T,X,fa,na,oa,qa,va,A,Aa,Da);case 15:return h.call(this,Z,ea,O,V,T,X,fa,na,oa,qa,va,A,Aa,Da,Ha);case 16:return g.call(this,Z,ea,
O,V,T,X,fa,na,oa,qa,va,A,Aa,Da,Ha,Sa);case 17:return f.call(this,Z,ea,O,V,T,X,fa,na,oa,qa,va,A,Aa,Da,Ha,Sa,Ta);case 18:return e.call(this,Z,ea,O,V,T,X,fa,na,oa,qa,va,A,Aa,Da,Ha,Sa,Ta,Eb);case 19:return d.call(this,Z,ea,O,V,T,X,fa,na,oa,qa,va,A,Aa,Da,Ha,Sa,Ta,Eb,Tb);case 20:return c.call(this,Z,ea,O,V,T,X,fa,na,oa,qa,va,A,Aa,Da,Ha,Sa,Ta,Eb,Tb,Ec);case 21:return b.call(this,Z,ea,O,V,T,X,fa,na,oa,qa,va,A,Aa,Da,Ha,Sa,Ta,Eb,Tb,Ec,wd);case 22:return a.call(this,Z,ea,O,V,T,X,fa,na,oa,qa,va,A,Aa,Da,Ha,Sa,
Ta,Eb,Tb,Ec,wd,xd)}throw Error("Invalid arity: "+arguments.length);};A.b=ja;A.a=G;A.c=I;A.o=D;A.A=B;A.aa=x;A.ba=w;A.ra=t;A.sa=r;A.ga=q;A.ha=p;A.ia=n;A.ja=m;A.ka=l;A.la=h;A.ma=g;A.na=f;A.oa=e;A.pa=d;A.qa=c;A.Kb=b;A.wb=a;return A}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ra(b)))};k.l=function(){return this.h.l?this.h.l():this.h.call(null)};k.b=function(a){return this.h.b?this.h.b(a):this.h.call(null,a)};k.a=function(a,b){return this.h.a?this.h.a(a,b):this.h.call(null,a,b)};
k.c=function(a,b,c){return this.h.c?this.h.c(a,b,c):this.h.call(null,a,b,c)};k.o=function(a,b,c,d){return this.h.o?this.h.o(a,b,c,d):this.h.call(null,a,b,c,d)};k.A=function(a,b,c,d,e){return this.h.A?this.h.A(a,b,c,d,e):this.h.call(null,a,b,c,d,e)};k.aa=function(a,b,c,d,e,f){return this.h.aa?this.h.aa(a,b,c,d,e,f):this.h.call(null,a,b,c,d,e,f)};k.ba=function(a,b,c,d,e,f,g){return this.h.ba?this.h.ba(a,b,c,d,e,f,g):this.h.call(null,a,b,c,d,e,f,g)};
k.ra=function(a,b,c,d,e,f,g,h){return this.h.ra?this.h.ra(a,b,c,d,e,f,g,h):this.h.call(null,a,b,c,d,e,f,g,h)};k.sa=function(a,b,c,d,e,f,g,h,l){return this.h.sa?this.h.sa(a,b,c,d,e,f,g,h,l):this.h.call(null,a,b,c,d,e,f,g,h,l)};k.ga=function(a,b,c,d,e,f,g,h,l,m){return this.h.ga?this.h.ga(a,b,c,d,e,f,g,h,l,m):this.h.call(null,a,b,c,d,e,f,g,h,l,m)};k.ha=function(a,b,c,d,e,f,g,h,l,m,n){return this.h.ha?this.h.ha(a,b,c,d,e,f,g,h,l,m,n):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n)};
k.ia=function(a,b,c,d,e,f,g,h,l,m,n,p){return this.h.ia?this.h.ia(a,b,c,d,e,f,g,h,l,m,n,p):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p)};k.ja=function(a,b,c,d,e,f,g,h,l,m,n,p,q){return this.h.ja?this.h.ja(a,b,c,d,e,f,g,h,l,m,n,p,q):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q)};k.ka=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){return this.h.ka?this.h.ka(a,b,c,d,e,f,g,h,l,m,n,p,q,r):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r)};
k.la=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t){return this.h.la?this.h.la(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t)};k.ma=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w){return this.h.ma?this.h.ma(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w)};k.na=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x){return this.h.na?this.h.na(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x)};
k.oa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B){return this.h.oa?this.h.oa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B)};k.pa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D){return this.h.pa?this.h.pa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D)};
k.qa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,I){return this.h.qa?this.h.qa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,I):this.h.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,I)};k.Kb=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,I,G){return E.wb?E.wb(this.h,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,I,G):E.call(null,this.h,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,I,G)};function Mc(a,b){return ca(a)?new md(a,b):null==a?null:wb(a,b)}
function nd(a){var b=null!=a;return(b?null!=a?a.g&131072||a.Wc||(a.g?0:Na(ub,a)):Na(ub,a):b)?vb(a):null}function od(a){return null==a||Ma(H(a))}function pd(a){return null==a?!1:null!=a?a.g&4096||a.Bd?!0:a.g?!1:Na(pb,a):Na(pb,a)}function qd(a){return null!=a?a.g&16777216||a.Ad?!0:a.g?!1:Na(Fb,a):Na(Fb,a)}function rd(a){return null==a?!1:null!=a?a.g&1024||a.Uc?!0:a.g?!1:Na(kb,a):Na(kb,a)}function sd(a){return null!=a?a.g&16384||a.Cd?!0:a.g?!1:Na(rb,a):Na(rb,a)}td;ud;
function vd(a){return null!=a?a.B&512||a.vd?!0:!1:!1}function yd(a){var b=[];la(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}function zd(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var Ad={};function Bd(a){return null==a?!1:null!=a?a.g&64||a.F?!0:a.g?!1:Na(cb,a):Na(cb,a)}function Cd(a){return null==a?!1:!1===a?!1:!0}function Dd(a,b){return F.c(a,b,Ad)===Ad?!1:!0}
function mc(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if("number"===typeof a){if("number"===typeof b)return pa(a,b);throw Error([C("Cannot compare "),C(a),C(" to "),C(b)].join(""));}if(null!=a?a.B&2048||a.Ib||(a.B?0:Na(Rb,a)):Na(Rb,a))return Sb(a,b);if("string"!==typeof a&&!Ka(a)&&!0!==a&&!1!==a||(null==a?null:a.constructor)!==(null==b?null:b.constructor))throw Error([C("Cannot compare "),C(a),C(" to "),C(b)].join(""));return pa(a,b)}
function Ed(a,b){var c=M(a),d=M(b);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=mc(hd(a,d),hd(b,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}Fd;var bd=function bd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return bd.a(arguments[0],arguments[1]);case 3:return bd.c(arguments[0],arguments[1],arguments[2]);default:throw Error([C("Invalid arity: "),C(c.length)].join(""));}};
bd.a=function(a,b){var c=H(b);if(c){var d=J(c),c=K(c);return Ua.c?Ua.c(a,d,c):Ua.call(null,a,d,c)}return a.l?a.l():a.call(null)};bd.c=function(a,b,c){for(c=H(c);;)if(c){var d=J(c);b=a.a?a.a(b,d):a.call(null,b,d);if(Pc(b))return tb(b);c=K(c)}else return b};bd.w=3;Gd;
var Ua=function Ua(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ua.a(arguments[0],arguments[1]);case 3:return Ua.c(arguments[0],arguments[1],arguments[2]);default:throw Error([C("Invalid arity: "),C(c.length)].join(""));}};Ua.a=function(a,b){return null!=b&&(b.g&524288||b.Yc)?b.ea(null,a):Ka(b)?Sc(b,a):"string"===typeof b?Sc(b,a):Na(xb,b)?yb.a(b,a):bd.a(a,b)};
Ua.c=function(a,b,c){return null!=c&&(c.g&524288||c.Yc)?c.fa(null,a,b):Ka(c)?Tc(c,a,b):"string"===typeof c?Tc(c,a,b):Na(xb,c)?yb.c(c,a,b):bd.c(a,b,c)};Ua.w=3;function Hd(a){return a}function Id(a,b,c,d){a=a.b?a.b(b):a.call(null,b);c=Ua.c(a,c,d);return a.b?a.b(c):a.call(null,c)}
var Jd=function Jd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Jd.l();case 1:return Jd.b(arguments[0]);case 2:return Jd.a(arguments[0],arguments[1]);default:return Jd.j(arguments[0],arguments[1],new wc(c.slice(2),0))}};Jd.l=function(){return 0};Jd.b=function(a){return a};Jd.a=function(a,b){return a+b};Jd.j=function(a,b,c){return Ua.c(Jd,a+b,c)};Jd.D=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return Jd.j(b,a,c)};Jd.w=2;
var Kd=function Kd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Kd.l();case 1:return Kd.b(arguments[0]);case 2:return Kd.a(arguments[0],arguments[1]);default:return Kd.j(arguments[0],arguments[1],new wc(c.slice(2),0))}};Kd.l=function(){return 1};Kd.b=function(a){return a};Kd.a=function(a,b){return a*b};Kd.j=function(a,b,c){return Ua.c(Kd,a*b,c)};Kd.D=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return Kd.j(b,a,c)};Kd.w=2;ra.Id;
var Ld=function Ld(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ld.b(arguments[0]);case 2:return Ld.a(arguments[0],arguments[1]);default:return Ld.j(arguments[0],arguments[1],new wc(c.slice(2),0))}};Ld.b=function(a){return 1/a};Ld.a=function(a,b){return a/b};Ld.j=function(a,b,c){return Ua.c(Ld,a/b,c)};Ld.D=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return Ld.j(b,a,c)};Ld.w=2;function Md(a){return a-1}
var Nd=function Nd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Nd.b(arguments[0]);case 2:return Nd.a(arguments[0],arguments[1]);default:return Nd.j(arguments[0],arguments[1],new wc(c.slice(2),0))}};Nd.b=function(a){return a};Nd.a=function(a,b){return a>b?a:b};Nd.j=function(a,b,c){return Ua.c(Nd,a>b?a:b,c)};Nd.D=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return Nd.j(b,a,c)};Nd.w=2;
var Od=function Od(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Od.b(arguments[0]);case 2:return Od.a(arguments[0],arguments[1]);default:return Od.j(arguments[0],arguments[1],new wc(c.slice(2),0))}};Od.b=function(a){return a};Od.a=function(a,b){return a<b?a:b};Od.j=function(a,b,c){return Ua.c(Od,a<b?a:b,c)};Od.D=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return Od.j(b,a,c)};Od.w=2;Pd;function Pd(a,b){return(a%b+b)%b}
function Qd(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function Rd(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function Sd(a,b){for(var c=b,d=H(a);;)if(d&&0<c)--c,d=K(d);else return d}var C=function C(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return C.l();case 1:return C.b(arguments[0]);default:return C.j(arguments[0],new wc(c.slice(1),0))}};C.l=function(){return""};
C.b=function(a){return null==a?"":""+a};C.j=function(a,b){for(var c=new ma(""+C(a)),d=b;;)if(y(d))c=c.append(""+C(J(d))),d=K(d);else return c.toString()};C.D=function(a){var b=J(a);a=K(a);return C.j(b,a)};C.w=1;P;Td;function Lc(a,b){var c;if(qd(b))if(Zc(a)&&Zc(b)&&M(a)!==M(b))c=!1;else a:{c=H(a);for(var d=H(b);;){if(null==c){c=null==d;break a}if(null!=d&&lc.a(J(c),J(d)))c=K(c),d=K(d);else{c=!1;break a}}}else c=null;return Cd(c)}
function Vc(a){if(H(a)){var b=qc(J(a));for(a=K(a);;){if(null==a)return b;b=rc(b,qc(J(a)));a=K(a)}}else return 0}Ud;Vd;function Wd(a){var b=0;for(a=H(a);;)if(a){var c=J(a),b=(b+(qc(Ud.b?Ud.b(c):Ud.call(null,c))^qc(Vd.b?Vd.b(c):Vd.call(null,c))))%4503599627370496;a=K(a)}else return b}Td;Xd;Yd;function Yc(a,b,c,d,e){this.v=a;this.first=b;this.Ca=c;this.count=d;this.u=e;this.g=65937646;this.B=8192}k=Yc.prototype;k.toString=function(){return dc(this)};k.equiv=function(a){return this.C(null,a)};k.O=function(){return this.v};
k.wa=function(){return 1===this.count?null:this.Ca};k.Y=function(){return this.count};k.jb=function(){return this.first};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Fc(this)};k.C=function(a,b){return Lc(this,b)};k.da=function(){return wb(yc,this.v)};k.ea=function(a,b){return bd.a(b,this)};k.fa=function(a,b,c){return bd.c(b,c,this)};k.ta=function(){return this.first};k.xa=function(){return 1===this.count?yc:this.Ca};k.U=function(){return this};
k.P=function(a,b){return new Yc(b,this.first,this.Ca,this.count,this.u)};k.X=function(a,b){return new Yc(this.v,b,this,this.count+1,null)};function Zd(a){return null!=a?a.g&33554432||a.yd?!0:a.g?!1:Na(Gb,a):Na(Gb,a)}Yc.prototype[Qa]=function(){return Ac(this)};function $d(a){this.v=a;this.g=65937614;this.B=8192}k=$d.prototype;k.toString=function(){return dc(this)};k.equiv=function(a){return this.C(null,a)};k.O=function(){return this.v};k.wa=function(){return null};k.Y=function(){return 0};k.jb=function(){return null};
k.T=function(){return Gc};k.C=function(a,b){return Zd(b)||qd(b)?null==H(b):!1};k.da=function(){return this};k.ea=function(a,b){return bd.a(b,this)};k.fa=function(a,b,c){return bd.c(b,c,this)};k.ta=function(){return null};k.xa=function(){return yc};k.U=function(){return null};k.P=function(a,b){return new $d(b)};k.X=function(a,b){return new Yc(this.v,b,null,1,null)};var yc=new $d(null);$d.prototype[Qa]=function(){return Ac(this)};
function ae(a){return(null!=a?a.g&134217728||a.zd||(a.g?0:Na(Hb,a)):Na(Hb,a))?Ib(a):Ua.c(ed,yc,a)}var jc=function jc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return jc.j(0<c.length?new wc(c.slice(0),0):null)};jc.j=function(a){var b;if(a instanceof wc&&0===a.s)b=a.f;else a:for(b=[];;)if(null!=a)b.push(a.ta(null)),a=a.wa(null);else break a;a=b.length;for(var c=yc;;)if(0<a){var d=a-1,c=c.X(null,b[a-1]);a=d}else return c};jc.w=0;jc.D=function(a){return jc.j(H(a))};
function be(a,b,c,d){this.v=a;this.first=b;this.Ca=c;this.u=d;this.g=65929452;this.B=8192}k=be.prototype;k.toString=function(){return dc(this)};k.equiv=function(a){return this.C(null,a)};k.O=function(){return this.v};k.wa=function(){return null==this.Ca?null:H(this.Ca)};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Fc(this)};k.C=function(a,b){return Lc(this,b)};k.da=function(){return Mc(yc,this.v)};k.ea=function(a,b){return bd.a(b,this)};k.fa=function(a,b,c){return bd.c(b,c,this)};k.ta=function(){return this.first};
k.xa=function(){return null==this.Ca?yc:this.Ca};k.U=function(){return this};k.P=function(a,b){return new be(b,this.first,this.Ca,this.u)};k.X=function(a,b){return new be(null,b,this,this.u)};be.prototype[Qa]=function(){return Ac(this)};function Wc(a,b){var c=null==b;return(c?c:null!=b&&(b.g&64||b.F))?new be(null,a,b,null):new be(null,a,H(b),null)}
function ce(a,b){if(a.Ha===b.Ha)return 0;var c=Ma(a.Ba);if(y(c?b.Ba:c))return-1;if(y(a.Ba)){if(Ma(b.Ba))return 1;c=pa(a.Ba,b.Ba);return 0===c?pa(a.name,b.name):c}return pa(a.name,b.name)}function z(a,b,c,d){this.Ba=a;this.name=b;this.Ha=c;this.tb=d;this.g=2153775105;this.B=4096}k=z.prototype;k.toString=function(){return[C(":"),C(this.Ha)].join("")};k.equiv=function(a){return this.C(null,a)};k.C=function(a,b){return b instanceof z?this.Ha===b.Ha:!1};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return F.a(c,this);case 3:return F.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return F.a(c,this)};a.c=function(a,c,d){return F.c(c,this,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ra(b)))};k.b=function(a){return F.a(a,this)};k.a=function(a,b){return F.c(a,this,b)};
k.T=function(){var a=this.tb;return null!=a?a:this.tb=a=rc(ic(this.name),pc(this.Ba))+2654435769|0};k.Ob=function(){return this.name};k.Pb=function(){return this.Ba};k.M=function(a,b){return Jb(b,[C(":"),C(this.Ha)].join(""))};function Q(a,b){return a===b?!0:a instanceof z&&b instanceof z?a.Ha===b.Ha:!1}
var de=function de(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return de.b(arguments[0]);case 2:return de.a(arguments[0],arguments[1]);default:throw Error([C("Invalid arity: "),C(c.length)].join(""));}};
de.b=function(a){if(a instanceof z)return a;if(a instanceof kc){var b;if(null!=a&&(a.B&4096||a.Xc))b=a.Pb(null);else throw Error([C("Doesn't support namespace: "),C(a)].join(""));return new z(b,Td.b?Td.b(a):Td.call(null,a),a.$a,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new z(b[0],b[1],a,null):new z(null,b[0],a,null)):null};de.a=function(a,b){return new z(a,b,[C(y(a)?[C(a),C("/")].join(""):null),C(b)].join(""),null)};de.w=2;
function ee(a,b,c,d){this.v=a;this.Cb=b;this.J=c;this.u=d;this.g=32374988;this.B=0}k=ee.prototype;k.toString=function(){return dc(this)};k.equiv=function(a){return this.C(null,a)};function fe(a){null!=a.Cb&&(a.J=a.Cb.l?a.Cb.l():a.Cb.call(null),a.Cb=null);return a.J}k.O=function(){return this.v};k.wa=function(){Db(this);return null==this.J?null:K(this.J)};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Fc(this)};k.C=function(a,b){return Lc(this,b)};k.da=function(){return Mc(yc,this.v)};
k.ea=function(a,b){return bd.a(b,this)};k.fa=function(a,b,c){return bd.c(b,c,this)};k.ta=function(){Db(this);return null==this.J?null:J(this.J)};k.xa=function(){Db(this);return null!=this.J?xc(this.J):yc};k.U=function(){fe(this);if(null==this.J)return null;for(var a=this.J;;)if(a instanceof ee)a=fe(a);else return this.J=a,H(this.J)};k.P=function(a,b){return new ee(b,this.Cb,this.J,this.u)};k.X=function(a,b){return Wc(b,this)};ee.prototype[Qa]=function(){return Ac(this)};ge;
function he(a,b){this.L=a;this.end=b;this.g=2;this.B=0}he.prototype.add=function(a){this.L[this.end]=a;return this.end+=1};he.prototype.W=function(){var a=new ge(this.L,0,this.end);this.L=null;return a};he.prototype.Y=function(){return this.end};function ie(a){return new he(Array(a),0)}function ge(a,b,c){this.f=a;this.ua=b;this.end=c;this.g=524306;this.B=0}k=ge.prototype;k.Y=function(){return this.end-this.ua};k.ca=function(a,b){return this.f[this.ua+b]};
k.Ea=function(a,b,c){return 0<=b&&b<this.end-this.ua?this.f[this.ua+b]:c};k.wc=function(){if(this.ua===this.end)throw Error("-drop-first of empty chunk");return new ge(this.f,this.ua+1,this.end)};k.ea=function(a,b){return Uc(this.f,b,this.f[this.ua],this.ua+1)};k.fa=function(a,b,c){return Uc(this.f,b,c,this.ua)};function td(a,b,c,d){this.W=a;this.Wa=b;this.v=c;this.u=d;this.g=31850732;this.B=1536}k=td.prototype;k.toString=function(){return dc(this)};k.equiv=function(a){return this.C(null,a)};
k.O=function(){return this.v};k.wa=function(){if(1<Xa(this.W))return new td(Ub(this.W),this.Wa,this.v,null);var a=Db(this.Wa);return null==a?null:a};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Fc(this)};k.C=function(a,b){return Lc(this,b)};k.da=function(){return Mc(yc,this.v)};k.ta=function(){return bb.a(this.W,0)};k.xa=function(){return 1<Xa(this.W)?new td(Ub(this.W),this.Wa,this.v,null):null==this.Wa?yc:this.Wa};k.U=function(){return this};k.nc=function(){return this.W};
k.oc=function(){return null==this.Wa?yc:this.Wa};k.P=function(a,b){return new td(this.W,this.Wa,b,this.u)};k.X=function(a,b){return Wc(b,this)};k.mc=function(){return null==this.Wa?null:this.Wa};td.prototype[Qa]=function(){return Ac(this)};function je(a,b){return 0===Xa(a)?b:new td(a,b,null,null)}function ke(a,b){a.add(b)}function Xd(a){return Vb(a)}function Yd(a){return Wb(a)}function Fd(a){for(var b=[];;)if(H(a))b.push(J(a)),a=K(a);else return b}
function le(a){if("number"===typeof a)a:{var b=Array(a);if(Bd(null))for(var c=0,d=H(null);;)if(d&&c<a)b[c]=J(d),c+=1,d=K(d);else{a=b;break a}else{for(c=0;;)if(c<a)b[c]=null,c+=1;else break;a=b}}else a=Ga.b(a);return a}function me(a,b){if(Zc(a))return M(a);for(var c=a,d=b,e=0;;)if(0<d&&H(c))c=K(c),--d,e+=1;else return e}
var ne=function ne(b){return null==b?null:null==K(b)?H(J(b)):Wc(J(b),ne(K(b)))},oe=function oe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return oe.l();case 1:return oe.b(arguments[0]);case 2:return oe.a(arguments[0],arguments[1]);default:return oe.j(arguments[0],arguments[1],new wc(c.slice(2),0))}};oe.l=function(){return new ee(null,function(){return null},null,null)};oe.b=function(a){return new ee(null,function(){return a},null,null)};
oe.a=function(a,b){return new ee(null,function(){var c=H(a);return c?vd(c)?je(Vb(c),oe.a(Wb(c),b)):Wc(J(c),oe.a(xc(c),b)):b},null,null)};oe.j=function(a,b,c){return function e(a,b){return new ee(null,function(){var c=H(a);return c?vd(c)?je(Vb(c),e(Wb(c),b)):Wc(J(c),e(xc(c),b)):y(b)?e(J(b),K(b)):null},null,null)}(oe.a(a,b),c)};oe.D=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return oe.j(b,a,c)};oe.w=2;function pe(a){return Ob(a)}
var qe=function qe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return qe.l();case 1:return qe.b(arguments[0]);case 2:return qe.a(arguments[0],arguments[1]);default:return qe.j(arguments[0],arguments[1],new wc(c.slice(2),0))}};qe.l=function(){return Mb(fd)};qe.b=function(a){return a};qe.a=function(a,b){return Nb(a,b)};qe.j=function(a,b,c){for(;;)if(a=Nb(a,b),y(c))b=J(c),c=K(c);else return a};
qe.D=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return qe.j(b,a,c)};qe.w=2;function re(a,b,c){return Pb(a,b,c)}
function se(a,b,c){var d=H(c);if(0===b)return a.l?a.l():a.call(null);c=db(d);var e=eb(d);if(1===b)return a.b?a.b(c):a.b?a.b(c):a.call(null,c);var d=db(e),f=eb(e);if(2===b)return a.a?a.a(c,d):a.a?a.a(c,d):a.call(null,c,d);var e=db(f),g=eb(f);if(3===b)return a.c?a.c(c,d,e):a.c?a.c(c,d,e):a.call(null,c,d,e);var f=db(g),h=eb(g);if(4===b)return a.o?a.o(c,d,e,f):a.o?a.o(c,d,e,f):a.call(null,c,d,e,f);var g=db(h),l=eb(h);if(5===b)return a.A?a.A(c,d,e,f,g):a.A?a.A(c,d,e,f,g):a.call(null,c,d,e,f,g);var h=db(l),
m=eb(l);if(6===b)return a.aa?a.aa(c,d,e,f,g,h):a.aa?a.aa(c,d,e,f,g,h):a.call(null,c,d,e,f,g,h);var l=db(m),n=eb(m);if(7===b)return a.ba?a.ba(c,d,e,f,g,h,l):a.ba?a.ba(c,d,e,f,g,h,l):a.call(null,c,d,e,f,g,h,l);var m=db(n),p=eb(n);if(8===b)return a.ra?a.ra(c,d,e,f,g,h,l,m):a.ra?a.ra(c,d,e,f,g,h,l,m):a.call(null,c,d,e,f,g,h,l,m);var n=db(p),q=eb(p);if(9===b)return a.sa?a.sa(c,d,e,f,g,h,l,m,n):a.sa?a.sa(c,d,e,f,g,h,l,m,n):a.call(null,c,d,e,f,g,h,l,m,n);var p=db(q),r=eb(q);if(10===b)return a.ga?a.ga(c,
d,e,f,g,h,l,m,n,p):a.ga?a.ga(c,d,e,f,g,h,l,m,n,p):a.call(null,c,d,e,f,g,h,l,m,n,p);var q=db(r),t=eb(r);if(11===b)return a.ha?a.ha(c,d,e,f,g,h,l,m,n,p,q):a.ha?a.ha(c,d,e,f,g,h,l,m,n,p,q):a.call(null,c,d,e,f,g,h,l,m,n,p,q);var r=db(t),w=eb(t);if(12===b)return a.ia?a.ia(c,d,e,f,g,h,l,m,n,p,q,r):a.ia?a.ia(c,d,e,f,g,h,l,m,n,p,q,r):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r);var t=db(w),x=eb(w);if(13===b)return a.ja?a.ja(c,d,e,f,g,h,l,m,n,p,q,r,t):a.ja?a.ja(c,d,e,f,g,h,l,m,n,p,q,r,t):a.call(null,c,d,e,f,g,h,l,
m,n,p,q,r,t);var w=db(x),B=eb(x);if(14===b)return a.ka?a.ka(c,d,e,f,g,h,l,m,n,p,q,r,t,w):a.ka?a.ka(c,d,e,f,g,h,l,m,n,p,q,r,t,w):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,t,w);var x=db(B),D=eb(B);if(15===b)return a.la?a.la(c,d,e,f,g,h,l,m,n,p,q,r,t,w,x):a.la?a.la(c,d,e,f,g,h,l,m,n,p,q,r,t,w,x):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x);var B=db(D),I=eb(D);if(16===b)return a.ma?a.ma(c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B):a.ma?a.ma(c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B);var D=
db(I),G=eb(I);if(17===b)return a.na?a.na(c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D):a.na?a.na(c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D);var I=db(G),ja=eb(G);if(18===b)return a.oa?a.oa(c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,I):a.oa?a.oa(c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,I):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,I);G=db(ja);ja=eb(ja);if(19===b)return a.pa?a.pa(c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,I,G):a.pa?a.pa(c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,I,G):a.call(null,c,d,e,
f,g,h,l,m,n,p,q,r,t,w,x,B,D,I,G);var A=db(ja);eb(ja);if(20===b)return a.qa?a.qa(c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,I,G,A):a.qa?a.qa(c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,I,G,A):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,I,G,A);throw Error("Only up to 20 arguments supported on functions");}
var E=function E(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return E.a(arguments[0],arguments[1]);case 3:return E.c(arguments[0],arguments[1],arguments[2]);case 4:return E.o(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return E.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return E.j(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new wc(c.slice(5),0))}};
E.a=function(a,b){var c=a.w;if(a.D){var d=me(b,c+1);return d<=c?se(a,d,b):a.D(b)}return a.apply(a,Fd(b))};E.c=function(a,b,c){b=Wc(b,c);c=a.w;if(a.D){var d=me(b,c+1);return d<=c?se(a,d,b):a.D(b)}return a.apply(a,Fd(b))};E.o=function(a,b,c,d){b=Wc(b,Wc(c,d));c=a.w;return a.D?(d=me(b,c+1),d<=c?se(a,d,b):a.D(b)):a.apply(a,Fd(b))};E.A=function(a,b,c,d,e){b=Wc(b,Wc(c,Wc(d,e)));c=a.w;return a.D?(d=me(b,c+1),d<=c?se(a,d,b):a.D(b)):a.apply(a,Fd(b))};
E.j=function(a,b,c,d,e,f){b=Wc(b,Wc(c,Wc(d,Wc(e,ne(f)))));c=a.w;return a.D?(d=me(b,c+1),d<=c?se(a,d,b):a.D(b)):a.apply(a,Fd(b))};E.D=function(a){var b=J(a),c=K(a);a=J(c);var d=K(c),c=J(d),e=K(d),d=J(e),f=K(e),e=J(f),f=K(f);return E.j(b,a,c,d,e,f)};E.w=5;function te(a){return H(a)?a:null}
var ue=function ue(){"undefined"===typeof sa&&(sa=function(b,c){this.od=b;this.nd=c;this.g=393216;this.B=0},sa.prototype.P=function(b,c){return new sa(this.od,c)},sa.prototype.O=function(){return this.nd},sa.prototype.ya=function(){return!1},sa.prototype.next=function(){return Error("No such element")},sa.prototype.remove=function(){return Error("Unsupported operation")},sa.ic=function(){return new R(null,2,5,S,[Mc(ve,new v(null,1,[we,jc(xe,jc(fd))],null)),ra.Hd],null)},sa.xb=!0,sa.eb="cljs.core/t_cljs$core23323",
sa.Tb=function(b,c){return Jb(c,"cljs.core/t_cljs$core23323")});return new sa(ue,ye)};ze;function ze(a,b,c,d){this.Fb=a;this.first=b;this.Ca=c;this.v=d;this.g=31719628;this.B=0}k=ze.prototype;k.P=function(a,b){return new ze(this.Fb,this.first,this.Ca,b)};k.X=function(a,b){return Wc(b,Db(this))};k.da=function(){return yc};k.C=function(a,b){return null!=Db(this)?Lc(this,b):qd(b)&&null==H(b)};k.T=function(){return Fc(this)};k.U=function(){null!=this.Fb&&this.Fb.step(this);return null==this.Ca?null:this};
k.ta=function(){null!=this.Fb&&Db(this);return null==this.Ca?null:this.first};k.xa=function(){null!=this.Fb&&Db(this);return null==this.Ca?yc:this.Ca};k.wa=function(){null!=this.Fb&&Db(this);return null==this.Ca?null:Db(this.Ca)};ze.prototype[Qa]=function(){return Ac(this)};function Ae(a,b){for(;;){if(null==H(b))return!0;var c;c=J(b);c=a.b?a.b(c):a.call(null,c);if(y(c)){c=a;var d=K(b);a=c;b=d}else return!1}}
function Be(a,b){for(;;)if(H(b)){var c;c=J(b);c=a.b?a.b(c):a.call(null,c);if(y(c))return c;c=a;var d=K(b);a=c;b=d}else return null}
function Ce(a){return function(){function b(b,c){return Ma(a.a?a.a(b,c):a.call(null,b,c))}function c(b){return Ma(a.b?a.b(b):a.call(null,b))}function d(){return Ma(a.l?a.l():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new wc(g,0)}return c.call(this,a,d,f)}function c(b,d,e){return Ma(E.o(a,b,d,e))}b.w=2;b.D=function(a){var b=J(a);a=K(a);var d=J(a);a=xc(a);return c(b,d,a)};b.j=
c;return b}(),e=function(a,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var m=null;if(2<arguments.length){for(var m=0,n=Array(arguments.length-2);m<n.length;)n[m]=arguments[m+2],++m;m=new wc(n,0)}return f.j(a,e,m)}throw Error("Invalid arity: "+arguments.length);};e.w=2;e.D=f.D;e.l=d;e.b=c;e.a=b;e.j=f.j;return e}()}
function De(a){return function(){function b(b){if(0<arguments.length)for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;return a}b.w=0;b.D=function(b){H(b);return a};b.j=function(){return a};return b}()}
var Ee=function Ee(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Ee.l();case 1:return Ee.b(arguments[0]);case 2:return Ee.a(arguments[0],arguments[1]);case 3:return Ee.c(arguments[0],arguments[1],arguments[2]);default:return Ee.j(arguments[0],arguments[1],arguments[2],new wc(c.slice(3),0))}};Ee.l=function(){return Hd};Ee.b=function(a){return a};
Ee.a=function(a,b){return function(){function c(c,d,e){c=b.c?b.c(c,d,e):b.call(null,c,d,e);return a.b?a.b(c):a.call(null,c)}function d(c,d){var e=b.a?b.a(c,d):b.call(null,c,d);return a.b?a.b(e):a.call(null,e)}function e(c){c=b.b?b.b(c):b.call(null,c);return a.b?a.b(c):a.call(null,c)}function f(){var c=b.l?b.l():b.call(null);return a.b?a.b(c):a.call(null,c)}var g=null,h=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+
3],++g;g=new wc(h,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){c=E.A(b,c,e,f,g);return a.b?a.b(c):a.call(null,c)}c.w=3;c.D=function(a){var b=J(a);a=K(a);var c=J(a);a=K(a);var e=J(a);a=xc(a);return d(b,c,e,a)};c.j=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+
3],++q;q=new wc(r,0)}return h.j(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.D=h.D;g.l=f;g.b=e;g.a=d;g.c=c;g.j=h.j;return g}()};
Ee.c=function(a,b,c){return function(){function d(d,e,f){d=c.c?c.c(d,e,f):c.call(null,d,e,f);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}function e(d,e){var f;f=c.a?c.a(d,e):c.call(null,d,e);f=b.b?b.b(f):b.call(null,f);return a.b?a.b(f):a.call(null,f)}function f(d){d=c.b?c.b(d):c.call(null,d);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}function g(){var d;d=c.l?c.l():c.call(null);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}var h=null,l=function(){function d(a,
b,c,f){var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;g=new wc(h,0)}return e.call(this,a,b,c,g)}function e(d,f,g,h){d=E.A(c,d,f,g,h);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}d.w=3;d.D=function(a){var b=J(a);a=K(a);var c=J(a);a=K(a);var d=J(a);a=xc(a);return e(b,c,d,a)};d.j=e;return d}(),h=function(a,b,c,h){switch(arguments.length){case 0:return g.call(this);case 1:return f.call(this,a);case 2:return e.call(this,a,b);
case 3:return d.call(this,a,b,c);default:var r=null;if(3<arguments.length){for(var r=0,t=Array(arguments.length-3);r<t.length;)t[r]=arguments[r+3],++r;r=new wc(t,0)}return l.j(a,b,c,r)}throw Error("Invalid arity: "+arguments.length);};h.w=3;h.D=l.D;h.l=g;h.b=f;h.a=e;h.c=d;h.j=l.j;return h}()};
Ee.j=function(a,b,c,d){return function(a){return function(){function b(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new wc(e,0)}return c.call(this,d)}function c(b){b=E.a(J(a),b);for(var d=K(a);;)if(d)b=J(d).call(null,b),d=K(d);else return b}b.w=0;b.D=function(a){a=H(a);return c(a)};b.j=c;return b}()}(ae(Wc(a,Wc(b,Wc(c,d)))))};Ee.D=function(a){var b=J(a),c=K(a);a=J(c);var d=K(c),c=J(d),d=K(d);return Ee.j(b,a,c,d)};Ee.w=3;
function Fe(a,b){return function(){function c(c,d,e){return a.o?a.o(b,c,d,e):a.call(null,b,c,d,e)}function d(c,d){return a.c?a.c(b,c,d):a.call(null,b,c,d)}function e(c){return a.a?a.a(b,c):a.call(null,b,c)}function f(){return a.b?a.b(b):a.call(null,b)}var g=null,h=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;g=new wc(h,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){return E.j(a,b,c,e,f,uc([g],0))}c.w=
3;c.D=function(a){var b=J(a);a=K(a);var c=J(a);a=K(a);var e=J(a);a=xc(a);return d(b,c,e,a)};c.j=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+3],++q;q=new wc(r,0)}return h.j(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.D=h.D;g.l=f;g.b=
e;g.a=d;g.c=c;g.j=h.j;return g}()}Ge;function He(a,b){return function d(b,f){return new ee(null,function(){var g=H(f);if(g){if(vd(g)){for(var h=Vb(g),l=M(h),m=ie(l),n=0;;)if(n<l)ke(m,function(){var d=b+n,f=bb.a(h,n);return a.a?a.a(d,f):a.call(null,d,f)}()),n+=1;else break;return je(m.W(),d(b+l,Wb(g)))}return Wc(function(){var d=J(g);return a.a?a.a(b,d):a.call(null,b,d)}(),d(b+1,xc(g)))}return null},null,null)}(0,b)}function Ie(a,b,c,d){this.state=a;this.v=b;this.Nc=d;this.B=16386;this.g=6455296}
k=Ie.prototype;k.equiv=function(a){return this.C(null,a)};k.C=function(a,b){return this===b};k.Jb=function(){return this.state};k.O=function(){return this.v};k.Ac=function(a,b,c){a=H(this.Nc);for(var d=null,e=0,f=0;;)if(f<e){var g=d.ca(null,f),h=N(g,0),g=N(g,1);g.o?g.o(h,this,b,c):g.call(null,h,this,b,c);f+=1}else if(a=H(a))vd(a)?(d=Vb(a),a=Wb(a),h=d,e=M(d),d=h):(d=J(a),h=N(d,0),g=N(d,1),g.o?g.o(h,this,b,c):g.call(null,h,this,b,c),a=K(a),d=null,e=0),f=0;else return null};
k.T=function(){return this[da]||(this[da]=++ga)};var U=function U(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return U.b(arguments[0]);default:return U.j(arguments[0],new wc(c.slice(1),0))}};U.b=function(a){return new Ie(a,null,0,null)};U.j=function(a,b){var c=null!=b&&(b.g&64||b.F)?E.a(Jc,b):b,d=F.a(c,Ca);F.a(c,Je);return new Ie(a,d,0,null)};U.D=function(a){var b=J(a);a=K(a);return U.j(b,a)};U.w=1;Ke;
function Le(a,b){if(a instanceof Ie){var c=a.state;a.state=b;null!=a.Nc&&Lb(a,c,b);return b}return $b(a,b)}var Me=function Me(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Me.a(arguments[0],arguments[1]);case 3:return Me.c(arguments[0],arguments[1],arguments[2]);case 4:return Me.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:return Me.j(arguments[0],arguments[1],arguments[2],arguments[3],new wc(c.slice(4),0))}};
Me.a=function(a,b){var c;a instanceof Ie?(c=a.state,c=b.b?b.b(c):b.call(null,c),c=Le(a,c)):c=ac.a(a,b);return c};Me.c=function(a,b,c){if(a instanceof Ie){var d=a.state;b=b.a?b.a(d,c):b.call(null,d,c);a=Le(a,b)}else a=ac.c(a,b,c);return a};Me.o=function(a,b,c,d){if(a instanceof Ie){var e=a.state;b=b.c?b.c(e,c,d):b.call(null,e,c,d);a=Le(a,b)}else a=ac.o(a,b,c,d);return a};Me.j=function(a,b,c,d,e){return a instanceof Ie?Le(a,E.A(b,a.state,c,d,e)):ac.A(a,b,c,d,e)};
Me.D=function(a){var b=J(a),c=K(a);a=J(c);var d=K(c),c=J(d),e=K(d),d=J(e),e=K(e);return Me.j(b,a,c,d,e)};Me.w=4;function Ne(a){this.state=a;this.g=32768;this.B=0}Ne.prototype.Jb=function(){return this.state};function Ge(a){return new Ne(a)}
var P=function P(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return P.b(arguments[0]);case 2:return P.a(arguments[0],arguments[1]);case 3:return P.c(arguments[0],arguments[1],arguments[2]);case 4:return P.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:return P.j(arguments[0],arguments[1],arguments[2],arguments[3],new wc(c.slice(4),0))}};
P.b=function(a){return function(b){return function(){function c(c,d){var e=a.b?a.b(d):a.call(null,d);return b.a?b.a(c,e):b.call(null,c,e)}function d(a){return b.b?b.b(a):b.call(null,a)}function e(){return b.l?b.l():b.call(null)}var f=null,g=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new wc(g,0)}return d.call(this,a,b,f)}function d(c,e,f){e=E.c(a,e,f);return b.a?b.a(c,e):b.call(null,c,e)}c.w=2;c.D=function(a){var b=
J(a);a=K(a);var c=J(a);a=xc(a);return d(b,c,a)};c.j=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var n=null;if(2<arguments.length){for(var n=0,p=Array(arguments.length-2);n<p.length;)p[n]=arguments[n+2],++n;n=new wc(p,0)}return g.j(a,b,n)}throw Error("Invalid arity: "+arguments.length);};f.w=2;f.D=g.D;f.l=e;f.b=d;f.a=c;f.j=g.j;return f}()}};
P.a=function(a,b){return new ee(null,function(){var c=H(b);if(c){if(vd(c)){for(var d=Vb(c),e=M(d),f=ie(e),g=0;;)if(g<e)ke(f,function(){var b=bb.a(d,g);return a.b?a.b(b):a.call(null,b)}()),g+=1;else break;return je(f.W(),P.a(a,Wb(c)))}return Wc(function(){var b=J(c);return a.b?a.b(b):a.call(null,b)}(),P.a(a,xc(c)))}return null},null,null)};
P.c=function(a,b,c){return new ee(null,function(){var d=H(b),e=H(c);if(d&&e){var f=Wc,g;g=J(d);var h=J(e);g=a.a?a.a(g,h):a.call(null,g,h);d=f(g,P.c(a,xc(d),xc(e)))}else d=null;return d},null,null)};P.o=function(a,b,c,d){return new ee(null,function(){var e=H(b),f=H(c),g=H(d);if(e&&f&&g){var h=Wc,l;l=J(e);var m=J(f),n=J(g);l=a.c?a.c(l,m,n):a.call(null,l,m,n);e=h(l,P.o(a,xc(e),xc(f),xc(g)))}else e=null;return e},null,null)};
P.j=function(a,b,c,d,e){var f=function h(a){return new ee(null,function(){var b=P.a(H,a);return Ae(Hd,b)?Wc(P.a(J,b),h(P.a(xc,b))):null},null,null)};return P.a(function(){return function(b){return E.a(a,b)}}(f),f(ed.j(e,d,uc([c,b],0))))};P.D=function(a){var b=J(a),c=K(a);a=J(c);var d=K(c),c=J(d),e=K(d),d=J(e),e=K(e);return P.j(b,a,c,d,e)};P.w=4;function Oe(a,b){return new ee(null,function(){if(0<a){var c=H(b);return c?Wc(J(c),Oe(a-1,xc(c))):null}return null},null,null)}
function Pe(a,b){return new ee(null,function(c){return function(){return c(a,b)}}(function(a,b){for(;;){var e=H(b);if(0<a&&e){var f=a-1,e=xc(e);a=f;b=e}else return e}}),null,null)}function Qe(a){return new ee(null,function(){return Wc(a,Qe(a))},null,null)}function Re(a){return new ee(null,function(){return Wc(a.l?a.l():a.call(null),Re(a))},null,null)}
var Se=function Se(b,c){return Wc(c,new ee(null,function(){return Se(b,b.b?b.b(c):b.call(null,c))},null,null))},Te=function Te(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Te.a(arguments[0],arguments[1]);default:return Te.j(arguments[0],arguments[1],new wc(c.slice(2),0))}};Te.a=function(a,b){return new ee(null,function(){var c=H(a),d=H(b);return c&&d?Wc(J(c),Wc(J(d),Te.a(xc(c),xc(d)))):null},null,null)};
Te.j=function(a,b,c){return new ee(null,function(){var d=P.a(H,ed.j(c,b,uc([a],0)));return Ae(Hd,d)?oe.a(P.a(J,d),E.a(Te,P.a(xc,d))):null},null,null)};Te.D=function(a){var b=J(a),c=K(a);a=J(c);c=K(c);return Te.j(b,a,c)};Te.w=2;function Ue(a){return Pe(1,Te.a(Qe("L"),a))}Ve;function We(a,b){return E.a(oe,E.c(P,a,b))}
function Xe(a,b){return new ee(null,function(){var c=H(b);if(c){if(vd(c)){for(var d=Vb(c),e=M(d),f=ie(e),g=0;;)if(g<e){var h;h=bb.a(d,g);h=a.b?a.b(h):a.call(null,h);y(h)&&(h=bb.a(d,g),f.add(h));g+=1}else break;return je(f.W(),Xe(a,Wb(c)))}d=J(c);c=xc(c);return y(a.b?a.b(d):a.call(null,d))?Wc(d,Xe(a,c)):Xe(a,c)}return null},null,null)}
function Ye(a){return function c(a){return new ee(null,function(){return Wc(a,y(Bd.b?Bd.b(a):Bd.call(null,a))?We(c,uc([H.b?H.b(a):H.call(null,a)],0)):null)},null,null)}(a)}var Ze=function Ze(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ze.a(arguments[0],arguments[1]);case 3:return Ze.c(arguments[0],arguments[1],arguments[2]);default:throw Error([C("Invalid arity: "),C(c.length)].join(""));}};
Ze.a=function(a,b){return null!=a?null!=a&&(a.B&4||a.Rc)?Mc(pe(Ua.c(Nb,Mb(a),b)),nd(a)):Ua.c($a,a,b):Ua.c(ed,yc,b)};Ze.c=function(a,b,c){return null!=a&&(a.B&4||a.Rc)?Mc(pe(Id(b,qe,Mb(a),c)),nd(a)):Id(b,ed,a,c)};Ze.w=3;function $e(a,b){return pe(Ua.c(function(b,d){return qe.a(b,a.b?a.b(d):a.call(null,d))},Mb(fd),b))}
function af(a,b){var c;a:{c=Ad;for(var d=a,e=H(b);;)if(e)if(null!=d?d.g&256||d.yc||(d.g?0:Na(gb,d)):Na(gb,d)){d=F.c(d,J(e),c);if(c===d){c=null;break a}e=K(e)}else{c=null;break a}else{c=d;break a}}return c}function bf(a,b,c){return jd.c(a,b,function(){var d=F.a(a,b);return c.b?c.b(d):c.call(null,d)}())}function cf(a,b,c,d){return jd.c(a,b,function(){var e=F.a(a,b);return c.a?c.a(e,d):c.call(null,e,d)}())}
function df(a,b,c,d){var e=ef;return jd.c(a,e,function(){var f=F.a(a,e);return b.c?b.c(f,c,d):b.call(null,f,c,d)}())}function ff(a,b){this.V=a;this.f=b}function gf(a){return new ff(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function hf(a){a=a.m;return 32>a?0:a-1>>>5<<5}function jf(a,b,c){for(;;){if(0===b)return c;var d=gf(a);d.f[0]=c;c=d;b-=5}}
var kf=function kf(b,c,d,e){var f=new ff(d.V,Ra(d.f)),g=b.m-1>>>c&31;5===c?f.f[g]=e:(d=d.f[g],b=null!=d?kf(b,c-5,d,e):jf(null,c-5,e),f.f[g]=b);return f};function lf(a,b){throw Error([C("No item "),C(a),C(" in vector of length "),C(b)].join(""));}function mf(a,b){if(b>=hf(a))return a.R;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.f[b>>>d&31],d=e;else return c.f}function nf(a,b){return 0<=b&&b<a.m?mf(a,b):lf(b,a.m)}
var of=function of(b,c,d,e,f){var g=new ff(d.V,Ra(d.f));if(0===c)g.f[e&31]=f;else{var h=e>>>c&31;b=of(b,c-5,d.f[h],e,f);g.f[h]=b}return g};function pf(a,b,c,d,e,f){this.s=a;this.kc=b;this.f=c;this.Na=d;this.start=e;this.end=f}pf.prototype.ya=function(){return this.s<this.end};pf.prototype.next=function(){32===this.s-this.kc&&(this.f=mf(this.Na,this.s),this.kc+=32);var a=this.f[this.s&31];this.s+=1;return a};qf;rf;sf;L;tf;uf;vf;
function R(a,b,c,d,e,f){this.v=a;this.m=b;this.shift=c;this.root=d;this.R=e;this.u=f;this.g=167668511;this.B=8196}k=R.prototype;k.toString=function(){return dc(this)};k.equiv=function(a){return this.C(null,a)};k.N=function(a,b){return hb.c(this,b,null)};k.I=function(a,b,c){return"number"===typeof b?bb.c(this,b,c):c};
k.Lb=function(a,b,c){a=0;for(var d=c;;)if(a<this.m){var e=mf(this,a);c=e.length;a:for(var f=0;;)if(f<c){var g=f+a,h=e[f],d=b.c?b.c(d,g,h):b.call(null,d,g,h);if(Pc(d)){e=d;break a}f+=1}else{e=d;break a}if(Pc(e))return L.b?L.b(e):L.call(null,e);a+=c;d=e}else return d};k.ca=function(a,b){return nf(this,b)[b&31]};k.Ea=function(a,b,c){return 0<=b&&b<this.m?mf(this,b)[b&31]:c};
k.kb=function(a,b,c){if(0<=b&&b<this.m)return hf(this)<=b?(a=Ra(this.R),a[b&31]=c,new R(this.v,this.m,this.shift,this.root,a,null)):new R(this.v,this.m,this.shift,of(this,this.shift,this.root,b,c),this.R,null);if(b===this.m)return $a(this,c);throw Error([C("Index "),C(b),C(" out of bounds  [0,"),C(this.m),C("]")].join(""));};k.Ga=function(){var a=this.m;return new pf(0,0,0<M(this)?mf(this,0):null,this,0,a)};k.O=function(){return this.v};k.Y=function(){return this.m};
k.Mb=function(){return bb.a(this,0)};k.Nb=function(){return bb.a(this,1)};k.jb=function(){return 0<this.m?bb.a(this,this.m-1):null};k.bc=function(){return 0<this.m?new Xc(this,this.m-1,null):null};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Fc(this)};k.C=function(a,b){if(b instanceof R)if(this.m===M(b))for(var c=bc(this),d=bc(b);;)if(y(c.ya())){var e=c.next(),f=d.next();if(!lc.a(e,f))return!1}else return!0;else return!1;else return Lc(this,b)};
k.vb=function(){return new sf(this.m,this.shift,qf.b?qf.b(this.root):qf.call(null,this.root),rf.b?rf.b(this.R):rf.call(null,this.R))};k.da=function(){return Mc(fd,this.v)};k.ea=function(a,b){return Qc(this,b)};k.fa=function(a,b,c){a=0;for(var d=c;;)if(a<this.m){var e=mf(this,a);c=e.length;a:for(var f=0;;)if(f<c){var g=e[f],d=b.a?b.a(d,g):b.call(null,d,g);if(Pc(d)){e=d;break a}f+=1}else{e=d;break a}if(Pc(e))return L.b?L.b(e):L.call(null,e);a+=c;d=e}else return d};
k.Oa=function(a,b,c){if("number"===typeof b)return sb(this,b,c);throw Error("Vector's key for assoc must be a number.");};k.U=function(){if(0===this.m)return null;if(32>=this.m)return new wc(this.R,0);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.f[0];else{a=a.f;break a}}return vf.o?vf.o(this,a,0,0):vf.call(null,this,a,0,0)};k.P=function(a,b){return new R(b,this.m,this.shift,this.root,this.R,this.u)};
k.X=function(a,b){if(32>this.m-hf(this)){for(var c=this.R.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.R[e],e+=1;else break;d[c]=b;return new R(this.v,this.m+1,this.shift,this.root,d,null)}c=(d=this.m>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=gf(null),d.f[0]=this.root,e=jf(null,this.shift,new ff(null,this.R)),d.f[1]=e):d=kf(this,this.shift,this.root,new ff(null,this.R));return new R(this.v,this.m+1,c,d,[b],null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.ca(null,c);case 3:return this.Ea(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.ca(null,c)};a.c=function(a,c,d){return this.Ea(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ra(b)))};k.b=function(a){return this.ca(null,a)};k.a=function(a,b){return this.Ea(null,a,b)};
var S=new ff(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),fd=new R(null,0,5,S,[],Gc);function wf(a){var b=a.length;if(32>b)return new R(null,b,5,S,a,null);for(var c=32,d=(new R(null,32,5,S,a.slice(0,32),null)).vb(null);;)if(c<b)var e=c+1,d=qe.a(d,a[c]),c=e;else return Ob(d)}R.prototype[Qa]=function(){return Ac(this)};function Gd(a){return Ka(a)?wf(a):Ob(Ua.c(Nb,Mb(fd),a))}
var xf=function xf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return xf.j(0<c.length?new wc(c.slice(0),0):null)};xf.j=function(a){return a instanceof wc&&0===a.s?wf(a.f):Gd(a)};xf.w=0;xf.D=function(a){return xf.j(H(a))};yf;function ud(a,b,c,d,e,f){this.Ia=a;this.node=b;this.s=c;this.ua=d;this.v=e;this.u=f;this.g=32375020;this.B=1536}k=ud.prototype;k.toString=function(){return dc(this)};k.equiv=function(a){return this.C(null,a)};k.O=function(){return this.v};
k.wa=function(){if(this.ua+1<this.node.length){var a;a=this.Ia;var b=this.node,c=this.s,d=this.ua+1;a=vf.o?vf.o(a,b,c,d):vf.call(null,a,b,c,d);return null==a?null:a}return Xb(this)};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Fc(this)};k.C=function(a,b){return Lc(this,b)};k.da=function(){return Mc(fd,this.v)};k.ea=function(a,b){var c;c=this.Ia;var d=this.s+this.ua,e=M(this.Ia);c=yf.c?yf.c(c,d,e):yf.call(null,c,d,e);return Qc(c,b)};
k.fa=function(a,b,c){a=this.Ia;var d=this.s+this.ua,e=M(this.Ia);a=yf.c?yf.c(a,d,e):yf.call(null,a,d,e);return Rc(a,b,c)};k.ta=function(){return this.node[this.ua]};k.xa=function(){if(this.ua+1<this.node.length){var a;a=this.Ia;var b=this.node,c=this.s,d=this.ua+1;a=vf.o?vf.o(a,b,c,d):vf.call(null,a,b,c,d);return null==a?yc:a}return Wb(this)};k.U=function(){return this};k.nc=function(){var a=this.node;return new ge(a,this.ua,a.length)};
k.oc=function(){var a=this.s+this.node.length;if(a<Xa(this.Ia)){var b=this.Ia,c=mf(this.Ia,a);return vf.o?vf.o(b,c,a,0):vf.call(null,b,c,a,0)}return yc};k.P=function(a,b){return vf.A?vf.A(this.Ia,this.node,this.s,this.ua,b):vf.call(null,this.Ia,this.node,this.s,this.ua,b)};k.X=function(a,b){return Wc(b,this)};k.mc=function(){var a=this.s+this.node.length;if(a<Xa(this.Ia)){var b=this.Ia,c=mf(this.Ia,a);return vf.o?vf.o(b,c,a,0):vf.call(null,b,c,a,0)}return null};ud.prototype[Qa]=function(){return Ac(this)};
var vf=function vf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return vf.c(arguments[0],arguments[1],arguments[2]);case 4:return vf.o(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return vf.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([C("Invalid arity: "),C(c.length)].join(""));}};vf.c=function(a,b,c){return new ud(a,nf(a,b),b,c,null,null)};
vf.o=function(a,b,c,d){return new ud(a,b,c,d,null,null)};vf.A=function(a,b,c,d,e){return new ud(a,b,c,d,e,null)};vf.w=5;zf;function Af(a,b,c,d,e){this.v=a;this.Na=b;this.start=c;this.end=d;this.u=e;this.g=167666463;this.B=8192}k=Af.prototype;k.toString=function(){return dc(this)};k.equiv=function(a){return this.C(null,a)};k.N=function(a,b){return hb.c(this,b,null)};k.I=function(a,b,c){return"number"===typeof b?bb.c(this,b,c):c};
k.Lb=function(a,b,c){a=this.start;for(var d=0;;)if(a<this.end){var e=d,f=bb.a(this.Na,a);c=b.c?b.c(c,e,f):b.call(null,c,e,f);if(Pc(c))return L.b?L.b(c):L.call(null,c);d+=1;a+=1}else return c};k.ca=function(a,b){return 0>b||this.end<=this.start+b?lf(b,this.end-this.start):bb.a(this.Na,this.start+b)};k.Ea=function(a,b,c){return 0>b||this.end<=this.start+b?c:bb.c(this.Na,this.start+b,c)};
k.kb=function(a,b,c){var d=this.start+b;a=this.v;c=jd.c(this.Na,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return zf.A?zf.A(a,c,b,d,null):zf.call(null,a,c,b,d,null)};k.O=function(){return this.v};k.Y=function(){return this.end-this.start};k.jb=function(){return bb.a(this.Na,this.end-1)};k.bc=function(){return this.start!==this.end?new Xc(this,this.end-this.start-1,null):null};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Fc(this)};k.C=function(a,b){return Lc(this,b)};
k.da=function(){return Mc(fd,this.v)};k.ea=function(a,b){return Qc(this,b)};k.fa=function(a,b,c){return Rc(this,b,c)};k.Oa=function(a,b,c){if("number"===typeof b)return sb(this,b,c);throw Error("Subvec's key for assoc must be a number.");};k.U=function(){var a=this;return function(b){return function d(e){return e===a.end?null:Wc(bb.a(a.Na,e),new ee(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};
k.P=function(a,b){return zf.A?zf.A(b,this.Na,this.start,this.end,this.u):zf.call(null,b,this.Na,this.start,this.end,this.u)};k.X=function(a,b){var c=this.v,d=sb(this.Na,this.end,b),e=this.start,f=this.end+1;return zf.A?zf.A(c,d,e,f,null):zf.call(null,c,d,e,f,null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.ca(null,c);case 3:return this.Ea(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.ca(null,c)};a.c=function(a,c,d){return this.Ea(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ra(b)))};k.b=function(a){return this.ca(null,a)};k.a=function(a,b){return this.Ea(null,a,b)};Af.prototype[Qa]=function(){return Ac(this)};
function zf(a,b,c,d,e){for(;;)if(b instanceof Af)c=b.start+c,d=b.start+d,b=b.Na;else{var f=M(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new Af(a,b,c,d,e)}}var yf=function yf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return yf.a(arguments[0],arguments[1]);case 3:return yf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([C("Invalid arity: "),C(c.length)].join(""));}};
yf.a=function(a,b){return yf.c(a,b,M(a))};yf.c=function(a,b,c){return zf(null,a,b,c,null)};yf.w=3;function Bf(a,b){return a===b.V?b:new ff(a,Ra(b.f))}function qf(a){return new ff({},Ra(a.f))}function rf(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];zd(a,0,b,0,a.length);return b}
var Cf=function Cf(b,c,d,e){d=Bf(b.root.V,d);var f=b.m-1>>>c&31;if(5===c)b=e;else{var g=d.f[f];b=null!=g?Cf(b,c-5,g,e):jf(b.root.V,c-5,e)}d.f[f]=b;return d};function sf(a,b,c,d){this.m=a;this.shift=b;this.root=c;this.R=d;this.B=88;this.g=275}k=sf.prototype;
k.Rb=function(a,b){if(this.root.V){if(32>this.m-hf(this))this.R[this.m&31]=b;else{var c=new ff(this.root.V,this.R),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.R=d;if(this.m>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=jf(this.root.V,this.shift,c);this.root=new ff(this.root.V,d);this.shift=e}else this.root=Cf(this,this.shift,this.root,c)}this.m+=1;return this}throw Error("conj! after persistent!");};k.Sb=function(){if(this.root.V){this.root.V=null;var a=this.m-hf(this),b=Array(a);zd(this.R,0,b,0,a);return new R(null,this.m,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
k.Qb=function(a,b,c){if("number"===typeof b)return Qb(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
k.zc=function(a,b,c){var d=this;if(d.root.V){if(0<=b&&b<d.m)return hf(this)<=b?d.R[b&31]=c:(a=function(){return function f(a,h){var l=Bf(d.root.V,h);if(0===a)l.f[b&31]=c;else{var m=b>>>a&31,n=f(a-5,l.f[m]);l.f[m]=n}return l}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.m)return Nb(this,c);throw Error([C("Index "),C(b),C(" out of bounds for TransientVector of length"),C(d.m)].join(""));}throw Error("assoc! after persistent!");};
k.Y=function(){if(this.root.V)return this.m;throw Error("count after persistent!");};k.ca=function(a,b){if(this.root.V)return nf(this,b)[b&31];throw Error("nth after persistent!");};k.Ea=function(a,b,c){return 0<=b&&b<this.m?bb.a(this,b):c};k.N=function(a,b){return hb.c(this,b,null)};k.I=function(a,b,c){return"number"===typeof b?bb.c(this,b,c):c};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ra(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};function Df(){this.g=2097152;this.B=0}
Df.prototype.equiv=function(a){return this.C(null,a)};Df.prototype.C=function(){return!1};var Ef=new Df;function Ff(a,b){return Cd(rd(b)?M(a)===M(b)?Ae(Hd,P.a(function(a){return lc.a(F.c(b,J(a),Ef),cd(a))},a)):null:null)}function Gf(a,b,c,d,e){this.s=a;this.qd=b;this.uc=c;this.fd=d;this.Kc=e}Gf.prototype.ya=function(){var a=this.s<this.uc;return a?a:this.Kc.ya()};Gf.prototype.next=function(){if(this.s<this.uc){var a=hd(this.fd,this.s);this.s+=1;return new R(null,2,5,S,[a,hb.a(this.qd,a)],null)}return this.Kc.next()};
Gf.prototype.remove=function(){return Error("Unsupported operation")};function Hf(a){this.J=a}Hf.prototype.next=function(){if(null!=this.J){var a=J(this.J),b=N(a,0),a=N(a,1);this.J=K(this.J);return{value:[b,a],done:!1}}return{value:null,done:!0}};function If(a){return new Hf(H(a))}function Jf(a){this.J=a}Jf.prototype.next=function(){if(null!=this.J){var a=J(this.J);this.J=K(this.J);return{value:[a,a],done:!1}}return{value:null,done:!0}};
function Kf(a,b){var c;if(b instanceof z)a:{c=a.length;for(var d=b.Ha,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof z&&d===a[e].Ha){c=e;break a}e+=2}}else if("string"==typeof b||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof kc)a:for(c=a.length,d=b.$a,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof kc&&d===a[e].$a){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=
a.length,d=0;;){if(c<=d){c=-1;break a}if(lc.a(b,a[d])){c=d;break a}d+=2}return c}Lf;function Mf(a,b,c){this.f=a;this.s=b;this.Da=c;this.g=32374990;this.B=0}k=Mf.prototype;k.toString=function(){return dc(this)};k.equiv=function(a){return this.C(null,a)};k.O=function(){return this.Da};k.wa=function(){return this.s<this.f.length-2?new Mf(this.f,this.s+2,this.Da):null};k.Y=function(){return(this.f.length-this.s)/2};k.T=function(){return Fc(this)};k.C=function(a,b){return Lc(this,b)};
k.da=function(){return Mc(yc,this.Da)};k.ea=function(a,b){return bd.a(b,this)};k.fa=function(a,b,c){return bd.c(b,c,this)};k.ta=function(){return new R(null,2,5,S,[this.f[this.s],this.f[this.s+1]],null)};k.xa=function(){return this.s<this.f.length-2?new Mf(this.f,this.s+2,this.Da):yc};k.U=function(){return this};k.P=function(a,b){return new Mf(this.f,this.s,b)};k.X=function(a,b){return Wc(b,this)};Mf.prototype[Qa]=function(){return Ac(this)};Nf;Of;function Pf(a,b,c){this.f=a;this.s=b;this.m=c}
Pf.prototype.ya=function(){return this.s<this.m};Pf.prototype.next=function(){var a=new R(null,2,5,S,[this.f[this.s],this.f[this.s+1]],null);this.s+=2;return a};function v(a,b,c,d){this.v=a;this.m=b;this.f=c;this.u=d;this.g=16647951;this.B=8196}k=v.prototype;k.toString=function(){return dc(this)};k.equiv=function(a){return this.C(null,a)};k.keys=function(){return Ac(Nf.b?Nf.b(this):Nf.call(null,this))};k.entries=function(){return If(H(this))};
k.values=function(){return Ac(Of.b?Of.b(this):Of.call(null,this))};k.has=function(a){return Dd(this,a)};k.get=function(a,b){return this.I(null,a,b)};k.forEach=function(a){for(var b=H(this),c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e),g=N(f,0),f=N(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=H(b))vd(b)?(c=Vb(b),b=Wb(b),g=c,d=M(c),c=g):(c=J(b),g=N(c,0),f=N(c,1),a.a?a.a(f,g):a.call(null,f,g),b=K(b),c=null,d=0),e=0;else return null};k.N=function(a,b){return hb.c(this,b,null)};
k.I=function(a,b,c){a=Kf(this.f,b);return-1===a?c:this.f[a+1]};k.Lb=function(a,b,c){a=this.f.length;for(var d=0;;)if(d<a){var e=this.f[d],f=this.f[d+1];c=b.c?b.c(c,e,f):b.call(null,c,e,f);if(Pc(c))return L.b?L.b(c):L.call(null,c);d+=2}else return c};k.Ga=function(){return new Pf(this.f,0,2*this.m)};k.O=function(){return this.v};k.Y=function(){return this.m};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Hc(this)};
k.C=function(a,b){if(null!=b&&(b.g&1024||b.Uc)){var c=this.f.length;if(this.m===b.Y(null))for(var d=0;;)if(d<c){var e=b.I(null,this.f[d],Ad);if(e!==Ad)if(lc.a(this.f[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return Ff(this,b)};k.vb=function(){return new Lf({},this.f.length,Ra(this.f))};k.da=function(){return wb(ye,this.v)};k.ea=function(a,b){return bd.a(b,this)};k.fa=function(a,b,c){return bd.c(b,c,this)};
k.ib=function(a,b){if(0<=Kf(this.f,b)){var c=this.f.length,d=c-2;if(0===d)return Ya(this);for(var d=Array(d),e=0,f=0;;){if(e>=c)return new v(this.v,this.m-1,d,null);lc.a(b,this.f[e])||(d[f]=this.f[e],d[f+1]=this.f[e+1],f+=2);e+=2}}else return this};
k.Oa=function(a,b,c){a=Kf(this.f,b);if(-1===a){if(this.m<Qf){a=this.f;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new v(this.v,this.m+1,e,null)}return wb(jb(Ze.a(kd,this),b,c),this.v)}if(c===this.f[a+1])return this;b=Ra(this.f);b[a+1]=c;return new v(this.v,this.m,b,null)};k.lc=function(a,b){return-1!==Kf(this.f,b)};k.U=function(){var a=this.f;return 0<=a.length-2?new Mf(a,0,null):null};k.P=function(a,b){return new v(b,this.m,this.f,this.u)};
k.X=function(a,b){if(sd(b))return jb(this,bb.a(b,0),bb.a(b,1));for(var c=this,d=H(b);;){if(null==d)return c;var e=J(d);if(sd(e))c=jb(c,bb.a(e,0),bb.a(e,1)),d=K(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ra(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};var ye=new v(null,0,[],Ic),Qf=8;v.prototype[Qa]=function(){return Ac(this)};
Rf;function Lf(a,b,c){this.Bb=a;this.qb=b;this.f=c;this.g=258;this.B=56}k=Lf.prototype;k.Y=function(){if(y(this.Bb))return Qd(this.qb);throw Error("count after persistent!");};k.N=function(a,b){return hb.c(this,b,null)};k.I=function(a,b,c){if(y(this.Bb))return a=Kf(this.f,b),-1===a?c:this.f[a+1];throw Error("lookup after persistent!");};
k.Rb=function(a,b){if(y(this.Bb)){if(null!=b?b.g&2048||b.Vc||(b.g?0:Na(mb,b)):Na(mb,b))return Pb(this,Ud.b?Ud.b(b):Ud.call(null,b),Vd.b?Vd.b(b):Vd.call(null,b));for(var c=H(b),d=this;;){var e=J(c);if(y(e))c=K(c),d=Pb(d,Ud.b?Ud.b(e):Ud.call(null,e),Vd.b?Vd.b(e):Vd.call(null,e));else return d}}else throw Error("conj! after persistent!");};k.Sb=function(){if(y(this.Bb))return this.Bb=!1,new v(null,Qd(this.qb),this.f,null);throw Error("persistent! called twice");};
k.Qb=function(a,b,c){if(y(this.Bb)){a=Kf(this.f,b);if(-1===a)return this.qb+2<=2*Qf?(this.qb+=2,this.f.push(b),this.f.push(c),this):re(Rf.a?Rf.a(this.qb,this.f):Rf.call(null,this.qb,this.f),b,c);c!==this.f[a+1]&&(this.f[a+1]=c);return this}throw Error("assoc! after persistent!");};Sf;id;function Rf(a,b){for(var c=Mb(kd),d=0;;)if(d<a)c=Pb(c,b[d],b[d+1]),d+=2;else return c}function Tf(){this.H=!1}Uf;Vf;Le;Wf;U;L;function Xf(a,b){return a===b?!0:Q(a,b)?!0:lc.a(a,b)}
function Yf(a,b,c){a=Ra(a);a[b]=c;return a}function Zf(a,b){var c=Array(a.length-2);zd(a,0,c,0,2*b);zd(a,2*(b+1),c,2*b,c.length-2*b);return c}function $f(a,b,c,d){a=a.mb(b);a.f[c]=d;return a}function ag(a,b,c){for(var d=a.length,e=0,f=c;;)if(e<d){c=a[e];if(null!=c){var g=a[e+1];c=b.c?b.c(f,c,g):b.call(null,f,c,g)}else c=a[e+1],c=null!=c?c.pb(b,f):f;if(Pc(c))return L.b?L.b(c):L.call(null,c);e+=2;f=c}else return f}bg;function cg(a,b,c,d){this.f=a;this.s=b;this.Zb=c;this.Ra=d}
cg.prototype.advance=function(){for(var a=this.f.length;;)if(this.s<a){var b=this.f[this.s],c=this.f[this.s+1];null!=b?b=this.Zb=new R(null,2,5,S,[b,c],null):null!=c?(b=bc(c),b=b.ya()?this.Ra=b:!1):b=!1;this.s+=2;if(b)return!0}else return!1};cg.prototype.ya=function(){var a=null!=this.Zb;return a?a:(a=null!=this.Ra)?a:this.advance()};
cg.prototype.next=function(){if(null!=this.Zb){var a=this.Zb;this.Zb=null;return a}if(null!=this.Ra)return a=this.Ra.next(),this.Ra.ya()||(this.Ra=null),a;if(this.advance())return this.next();throw Error("No such element");};cg.prototype.remove=function(){return Error("Unsupported operation")};function dg(a,b,c){this.V=a;this.Z=b;this.f=c}k=dg.prototype;k.mb=function(a){if(a===this.V)return this;var b=Rd(this.Z),c=Array(0>b?4:2*(b+1));zd(this.f,0,c,0,2*b);return new dg(a,this.Z,c)};
k.Wb=function(){return Uf.b?Uf.b(this.f):Uf.call(null,this.f)};k.pb=function(a,b){return ag(this.f,a,b)};k.fb=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.Z&e))return d;var f=Rd(this.Z&e-1),e=this.f[2*f],f=this.f[2*f+1];return null==e?f.fb(a+5,b,c,d):Xf(c,e)?f:d};
k.Qa=function(a,b,c,d,e,f){var g=1<<(c>>>b&31),h=Rd(this.Z&g-1);if(0===(this.Z&g)){var l=Rd(this.Z);if(2*l<this.f.length){a=this.mb(a);b=a.f;f.H=!0;a:for(c=2*(l-h),f=2*h+(c-1),l=2*(h+1)+(c-1);;){if(0===c)break a;b[l]=b[f];--l;--c;--f}b[2*h]=d;b[2*h+1]=e;a.Z|=g;return a}if(16<=l){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[c>>>b&31]=eg.Qa(a,b+5,c,d,e,f);for(e=d=0;;)if(32>d)0!==
(this.Z>>>d&1)&&(h[d]=null!=this.f[e]?eg.Qa(a,b+5,qc(this.f[e]),this.f[e],this.f[e+1],f):this.f[e+1],e+=2),d+=1;else break;return new bg(a,l+1,h)}b=Array(2*(l+4));zd(this.f,0,b,0,2*h);b[2*h]=d;b[2*h+1]=e;zd(this.f,2*h,b,2*(h+1),2*(l-h));f.H=!0;a=this.mb(a);a.f=b;a.Z|=g;return a}l=this.f[2*h];g=this.f[2*h+1];if(null==l)return l=g.Qa(a,b+5,c,d,e,f),l===g?this:$f(this,a,2*h+1,l);if(Xf(d,l))return e===g?this:$f(this,a,2*h+1,e);f.H=!0;f=b+5;d=Wf.ba?Wf.ba(a,f,l,g,c,d,e):Wf.call(null,a,f,l,g,c,d,e);e=2*
h;h=2*h+1;a=this.mb(a);a.f[e]=null;a.f[h]=d;return a};
k.Pa=function(a,b,c,d,e){var f=1<<(b>>>a&31),g=Rd(this.Z&f-1);if(0===(this.Z&f)){var h=Rd(this.Z);if(16<=h){g=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];g[b>>>a&31]=eg.Pa(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.Z>>>c&1)&&(g[c]=null!=this.f[d]?eg.Pa(a+5,qc(this.f[d]),this.f[d],this.f[d+1],e):this.f[d+1],d+=2),c+=1;else break;return new bg(null,h+1,g)}a=Array(2*(h+1));zd(this.f,
0,a,0,2*g);a[2*g]=c;a[2*g+1]=d;zd(this.f,2*g,a,2*(g+1),2*(h-g));e.H=!0;return new dg(null,this.Z|f,a)}var l=this.f[2*g],f=this.f[2*g+1];if(null==l)return h=f.Pa(a+5,b,c,d,e),h===f?this:new dg(null,this.Z,Yf(this.f,2*g+1,h));if(Xf(c,l))return d===f?this:new dg(null,this.Z,Yf(this.f,2*g+1,d));e.H=!0;e=this.Z;h=this.f;a+=5;a=Wf.aa?Wf.aa(a,l,f,b,c,d):Wf.call(null,a,l,f,b,c,d);c=2*g;g=2*g+1;d=Ra(h);d[c]=null;d[g]=a;return new dg(null,e,d)};
k.Xb=function(a,b,c){var d=1<<(b>>>a&31);if(0===(this.Z&d))return this;var e=Rd(this.Z&d-1),f=this.f[2*e],g=this.f[2*e+1];return null==f?(a=g.Xb(a+5,b,c),a===g?this:null!=a?new dg(null,this.Z,Yf(this.f,2*e+1,a)):this.Z===d?null:new dg(null,this.Z^d,Zf(this.f,e))):Xf(c,f)?new dg(null,this.Z^d,Zf(this.f,e)):this};k.Ga=function(){return new cg(this.f,0,null,null)};var eg=new dg(null,0,[]);function fg(a,b,c){this.f=a;this.s=b;this.Ra=c}
fg.prototype.ya=function(){for(var a=this.f.length;;){if(null!=this.Ra&&this.Ra.ya())return!0;if(this.s<a){var b=this.f[this.s];this.s+=1;null!=b&&(this.Ra=bc(b))}else return!1}};fg.prototype.next=function(){if(this.ya())return this.Ra.next();throw Error("No such element");};fg.prototype.remove=function(){return Error("Unsupported operation")};function bg(a,b,c){this.V=a;this.m=b;this.f=c}k=bg.prototype;k.mb=function(a){return a===this.V?this:new bg(a,this.m,Ra(this.f))};
k.Wb=function(){return Vf.b?Vf.b(this.f):Vf.call(null,this.f)};k.pb=function(a,b){for(var c=this.f.length,d=0,e=b;;)if(d<c){var f=this.f[d];if(null!=f&&(e=f.pb(a,e),Pc(e)))return L.b?L.b(e):L.call(null,e);d+=1}else return e};k.fb=function(a,b,c,d){var e=this.f[b>>>a&31];return null!=e?e.fb(a+5,b,c,d):d};k.Qa=function(a,b,c,d,e,f){var g=c>>>b&31,h=this.f[g];if(null==h)return a=$f(this,a,g,eg.Qa(a,b+5,c,d,e,f)),a.m+=1,a;b=h.Qa(a,b+5,c,d,e,f);return b===h?this:$f(this,a,g,b)};
k.Pa=function(a,b,c,d,e){var f=b>>>a&31,g=this.f[f];if(null==g)return new bg(null,this.m+1,Yf(this.f,f,eg.Pa(a+5,b,c,d,e)));a=g.Pa(a+5,b,c,d,e);return a===g?this:new bg(null,this.m,Yf(this.f,f,a))};
k.Xb=function(a,b,c){var d=b>>>a&31,e=this.f[d];if(null!=e){a=e.Xb(a+5,b,c);if(a===e)d=this;else if(null==a)if(8>=this.m)a:{e=this.f;a=e.length;b=Array(2*(this.m-1));c=0;for(var f=1,g=0;;)if(c<a)c!==d&&null!=e[c]&&(b[f]=e[c],f+=2,g|=1<<c),c+=1;else{d=new dg(null,g,b);break a}}else d=new bg(null,this.m-1,Yf(this.f,d,a));else d=new bg(null,this.m,Yf(this.f,d,a));return d}return this};k.Ga=function(){return new fg(this.f,0,null)};
function gg(a,b,c){b*=2;for(var d=0;;)if(d<b){if(Xf(c,a[d]))return d;d+=2}else return-1}function hg(a,b,c,d){this.V=a;this.bb=b;this.m=c;this.f=d}k=hg.prototype;k.mb=function(a){if(a===this.V)return this;var b=Array(2*(this.m+1));zd(this.f,0,b,0,2*this.m);return new hg(a,this.bb,this.m,b)};k.Wb=function(){return Uf.b?Uf.b(this.f):Uf.call(null,this.f)};k.pb=function(a,b){return ag(this.f,a,b)};k.fb=function(a,b,c,d){a=gg(this.f,this.m,c);return 0>a?d:Xf(c,this.f[a])?this.f[a+1]:d};
k.Qa=function(a,b,c,d,e,f){if(c===this.bb){b=gg(this.f,this.m,d);if(-1===b){if(this.f.length>2*this.m)return b=2*this.m,c=2*this.m+1,a=this.mb(a),a.f[b]=d,a.f[c]=e,f.H=!0,a.m+=1,a;c=this.f.length;b=Array(c+2);zd(this.f,0,b,0,c);b[c]=d;b[c+1]=e;f.H=!0;d=this.m+1;a===this.V?(this.f=b,this.m=d,a=this):a=new hg(this.V,this.bb,d,b);return a}return this.f[b+1]===e?this:$f(this,a,b+1,e)}return(new dg(a,1<<(this.bb>>>b&31),[null,this,null,null])).Qa(a,b,c,d,e,f)};
k.Pa=function(a,b,c,d,e){return b===this.bb?(a=gg(this.f,this.m,c),-1===a?(a=2*this.m,b=Array(a+2),zd(this.f,0,b,0,a),b[a]=c,b[a+1]=d,e.H=!0,new hg(null,this.bb,this.m+1,b)):lc.a(this.f[a],d)?this:new hg(null,this.bb,this.m,Yf(this.f,a+1,d))):(new dg(null,1<<(this.bb>>>a&31),[null,this])).Pa(a,b,c,d,e)};k.Xb=function(a,b,c){a=gg(this.f,this.m,c);return-1===a?this:1===this.m?null:new hg(null,this.bb,this.m-1,Zf(this.f,Qd(a)))};k.Ga=function(){return new cg(this.f,0,null,null)};
var Wf=function Wf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return Wf.aa(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return Wf.ba(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([C("Invalid arity: "),C(c.length)].join(""));}};
Wf.aa=function(a,b,c,d,e,f){var g=qc(b);if(g===d)return new hg(null,g,2,[b,c,e,f]);var h=new Tf;return eg.Pa(a,g,b,c,h).Pa(a,d,e,f,h)};Wf.ba=function(a,b,c,d,e,f,g){var h=qc(c);if(h===e)return new hg(null,h,2,[c,d,f,g]);var l=new Tf;return eg.Qa(a,b,h,c,d,l).Qa(a,b,e,f,g,l)};Wf.w=7;function ig(a,b,c,d,e){this.v=a;this.gb=b;this.s=c;this.J=d;this.u=e;this.g=32374860;this.B=0}k=ig.prototype;k.toString=function(){return dc(this)};k.equiv=function(a){return this.C(null,a)};k.O=function(){return this.v};
k.T=function(){var a=this.u;return null!=a?a:this.u=a=Fc(this)};k.C=function(a,b){return Lc(this,b)};k.da=function(){return Mc(yc,this.v)};k.ea=function(a,b){return bd.a(b,this)};k.fa=function(a,b,c){return bd.c(b,c,this)};k.ta=function(){return null==this.J?new R(null,2,5,S,[this.gb[this.s],this.gb[this.s+1]],null):J(this.J)};
k.xa=function(){if(null==this.J){var a=this.gb,b=this.s+2;return Uf.c?Uf.c(a,b,null):Uf.call(null,a,b,null)}var a=this.gb,b=this.s,c=K(this.J);return Uf.c?Uf.c(a,b,c):Uf.call(null,a,b,c)};k.U=function(){return this};k.P=function(a,b){return new ig(b,this.gb,this.s,this.J,this.u)};k.X=function(a,b){return Wc(b,this)};ig.prototype[Qa]=function(){return Ac(this)};
var Uf=function Uf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Uf.b(arguments[0]);case 3:return Uf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([C("Invalid arity: "),C(c.length)].join(""));}};Uf.b=function(a){return Uf.c(a,0,null)};
Uf.c=function(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new ig(null,a,b,null,null);var d=a[b+1];if(y(d)&&(d=d.Wb(),y(d)))return new ig(null,a,b+2,d,null);b+=2}else return null;else return new ig(null,a,b,c,null)};Uf.w=3;function jg(a,b,c,d,e){this.v=a;this.gb=b;this.s=c;this.J=d;this.u=e;this.g=32374860;this.B=0}k=jg.prototype;k.toString=function(){return dc(this)};k.equiv=function(a){return this.C(null,a)};k.O=function(){return this.v};
k.T=function(){var a=this.u;return null!=a?a:this.u=a=Fc(this)};k.C=function(a,b){return Lc(this,b)};k.da=function(){return Mc(yc,this.v)};k.ea=function(a,b){return bd.a(b,this)};k.fa=function(a,b,c){return bd.c(b,c,this)};k.ta=function(){return J(this.J)};k.xa=function(){var a=this.gb,b=this.s,c=K(this.J);return Vf.o?Vf.o(null,a,b,c):Vf.call(null,null,a,b,c)};k.U=function(){return this};k.P=function(a,b){return new jg(b,this.gb,this.s,this.J,this.u)};k.X=function(a,b){return Wc(b,this)};
jg.prototype[Qa]=function(){return Ac(this)};var Vf=function Vf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Vf.b(arguments[0]);case 4:return Vf.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([C("Invalid arity: "),C(c.length)].join(""));}};Vf.b=function(a){return Vf.o(null,a,0,null)};
Vf.o=function(a,b,c,d){if(null==d)for(d=b.length;;)if(c<d){var e=b[c];if(y(e)&&(e=e.Wb(),y(e)))return new jg(a,b,c+1,e,null);c+=1}else return null;else return new jg(a,b,c,d,null)};Vf.w=4;Sf;function kg(a,b,c){this.Aa=a;this.Mc=b;this.tc=c}kg.prototype.ya=function(){return this.tc&&this.Mc.ya()};kg.prototype.next=function(){if(this.tc)return this.Mc.next();this.tc=!0;return this.Aa};kg.prototype.remove=function(){return Error("Unsupported operation")};
function id(a,b,c,d,e,f){this.v=a;this.m=b;this.root=c;this.za=d;this.Aa=e;this.u=f;this.g=16123663;this.B=8196}k=id.prototype;k.toString=function(){return dc(this)};k.equiv=function(a){return this.C(null,a)};k.keys=function(){return Ac(Nf.b?Nf.b(this):Nf.call(null,this))};k.entries=function(){return If(H(this))};k.values=function(){return Ac(Of.b?Of.b(this):Of.call(null,this))};k.has=function(a){return Dd(this,a)};k.get=function(a,b){return this.I(null,a,b)};
k.forEach=function(a){for(var b=H(this),c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e),g=N(f,0),f=N(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=H(b))vd(b)?(c=Vb(b),b=Wb(b),g=c,d=M(c),c=g):(c=J(b),g=N(c,0),f=N(c,1),a.a?a.a(f,g):a.call(null,f,g),b=K(b),c=null,d=0),e=0;else return null};k.N=function(a,b){return hb.c(this,b,null)};k.I=function(a,b,c){return null==b?this.za?this.Aa:c:null==this.root?c:this.root.fb(0,qc(b),b,c)};
k.Lb=function(a,b,c){a=this.za?b.c?b.c(c,null,this.Aa):b.call(null,c,null,this.Aa):c;return Pc(a)?L.b?L.b(a):L.call(null,a):null!=this.root?this.root.pb(b,a):a};k.Ga=function(){var a=this.root?bc(this.root):ue;return this.za?new kg(this.Aa,a,!1):a};k.O=function(){return this.v};k.Y=function(){return this.m};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Hc(this)};k.C=function(a,b){return Ff(this,b)};k.vb=function(){return new Sf({},this.root,this.m,this.za,this.Aa)};
k.da=function(){return wb(kd,this.v)};k.ib=function(a,b){if(null==b)return this.za?new id(this.v,this.m-1,this.root,!1,null,null):this;if(null==this.root)return this;var c=this.root.Xb(0,qc(b),b);return c===this.root?this:new id(this.v,this.m-1,c,this.za,this.Aa,null)};
k.Oa=function(a,b,c){if(null==b)return this.za&&c===this.Aa?this:new id(this.v,this.za?this.m:this.m+1,this.root,!0,c,null);a=new Tf;b=(null==this.root?eg:this.root).Pa(0,qc(b),b,c,a);return b===this.root?this:new id(this.v,a.H?this.m+1:this.m,b,this.za,this.Aa,null)};k.lc=function(a,b){return null==b?this.za:null==this.root?!1:this.root.fb(0,qc(b),b,Ad)!==Ad};k.U=function(){if(0<this.m){var a=null!=this.root?this.root.Wb():null;return this.za?Wc(new R(null,2,5,S,[null,this.Aa],null),a):a}return null};
k.P=function(a,b){return new id(b,this.m,this.root,this.za,this.Aa,this.u)};k.X=function(a,b){if(sd(b))return jb(this,bb.a(b,0),bb.a(b,1));for(var c=this,d=H(b);;){if(null==d)return c;var e=J(d);if(sd(e))c=jb(c,bb.a(e,0),bb.a(e,1)),d=K(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ra(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};var kd=new id(null,0,null,!1,null,Ic);id.prototype[Qa]=function(){return Ac(this)};
function Sf(a,b,c,d,e){this.V=a;this.root=b;this.count=c;this.za=d;this.Aa=e;this.g=258;this.B=56}function lg(a,b,c){if(a.V){if(null==b)a.Aa!==c&&(a.Aa=c),a.za||(a.count+=1,a.za=!0);else{var d=new Tf;b=(null==a.root?eg:a.root).Qa(a.V,0,qc(b),b,c,d);b!==a.root&&(a.root=b);d.H&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}k=Sf.prototype;k.Y=function(){if(this.V)return this.count;throw Error("count after persistent!");};
k.N=function(a,b){return null==b?this.za?this.Aa:null:null==this.root?null:this.root.fb(0,qc(b),b)};k.I=function(a,b,c){return null==b?this.za?this.Aa:c:null==this.root?c:this.root.fb(0,qc(b),b,c)};
k.Rb=function(a,b){var c;a:if(this.V)if(null!=b?b.g&2048||b.Vc||(b.g?0:Na(mb,b)):Na(mb,b))c=lg(this,Ud.b?Ud.b(b):Ud.call(null,b),Vd.b?Vd.b(b):Vd.call(null,b));else{c=H(b);for(var d=this;;){var e=J(c);if(y(e))c=K(c),d=lg(d,Ud.b?Ud.b(e):Ud.call(null,e),Vd.b?Vd.b(e):Vd.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};k.Sb=function(){var a;if(this.V)this.V=null,a=new id(null,this.count,this.root,this.za,this.Aa,null);else throw Error("persistent! called twice");return a};
k.Qb=function(a,b,c){return lg(this,b,c)};mg;ng;var og=function og(b,c,d){d=null!=b.left?og(b.left,c,d):d;if(Pc(d))return L.b?L.b(d):L.call(null,d);var e=b.key,f=b.H;d=c.c?c.c(d,e,f):c.call(null,d,e,f);if(Pc(d))return L.b?L.b(d):L.call(null,d);b=null!=b.right?og(b.right,c,d):d;return Pc(b)?L.b?L.b(b):L.call(null,b):b};function ng(a,b,c,d,e){this.key=a;this.H=b;this.left=c;this.right=d;this.u=e;this.g=32402207;this.B=0}k=ng.prototype;k.replace=function(a,b,c,d){return new ng(a,b,c,d,null)};
k.pb=function(a,b){return og(this,a,b)};k.N=function(a,b){return bb.c(this,b,null)};k.I=function(a,b,c){return bb.c(this,b,c)};k.ca=function(a,b){return 0===b?this.key:1===b?this.H:null};k.Ea=function(a,b,c){return 0===b?this.key:1===b?this.H:c};k.kb=function(a,b,c){return(new R(null,2,5,S,[this.key,this.H],null)).kb(null,b,c)};k.O=function(){return null};k.Y=function(){return 2};k.Mb=function(){return this.key};k.Nb=function(){return this.H};k.jb=function(){return this.H};
k.T=function(){var a=this.u;return null!=a?a:this.u=a=Fc(this)};k.C=function(a,b){return Lc(this,b)};k.da=function(){return fd};k.ea=function(a,b){return Qc(this,b)};k.fa=function(a,b,c){return Rc(this,b,c)};k.Oa=function(a,b,c){return jd.c(new R(null,2,5,S,[this.key,this.H],null),b,c)};k.U=function(){return $a($a(yc,this.H),this.key)};k.P=function(a,b){return Mc(new R(null,2,5,S,[this.key,this.H],null),b)};k.X=function(a,b){return new R(null,3,5,S,[this.key,this.H,b],null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ra(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};ng.prototype[Qa]=function(){return Ac(this)};
function mg(a,b,c,d,e){this.key=a;this.H=b;this.left=c;this.right=d;this.u=e;this.g=32402207;this.B=0}k=mg.prototype;k.replace=function(a,b,c,d){return new mg(a,b,c,d,null)};k.pb=function(a,b){return og(this,a,b)};k.N=function(a,b){return bb.c(this,b,null)};k.I=function(a,b,c){return bb.c(this,b,c)};k.ca=function(a,b){return 0===b?this.key:1===b?this.H:null};k.Ea=function(a,b,c){return 0===b?this.key:1===b?this.H:c};k.kb=function(a,b,c){return(new R(null,2,5,S,[this.key,this.H],null)).kb(null,b,c)};
k.O=function(){return null};k.Y=function(){return 2};k.Mb=function(){return this.key};k.Nb=function(){return this.H};k.jb=function(){return this.H};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Fc(this)};k.C=function(a,b){return Lc(this,b)};k.da=function(){return fd};k.ea=function(a,b){return Qc(this,b)};k.fa=function(a,b,c){return Rc(this,b,c)};k.Oa=function(a,b,c){return jd.c(new R(null,2,5,S,[this.key,this.H],null),b,c)};k.U=function(){return $a($a(yc,this.H),this.key)};
k.P=function(a,b){return Mc(new R(null,2,5,S,[this.key,this.H],null),b)};k.X=function(a,b){return new R(null,3,5,S,[this.key,this.H,b],null)};k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ra(b)))};
k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};mg.prototype[Qa]=function(){return Ac(this)};Ud;var Jc=function Jc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Jc.j(0<c.length?new wc(c.slice(0),0):null)};Jc.j=function(a){a=H(a);for(var b=Mb(kd);;)if(a){var c=K(K(a)),b=re(b,J(a),cd(a));a=c}else return Ob(b)};Jc.w=0;Jc.D=function(a){return Jc.j(H(a))};function pg(a,b){this.K=a;this.Da=b;this.g=32374988;this.B=0}k=pg.prototype;
k.toString=function(){return dc(this)};k.equiv=function(a){return this.C(null,a)};k.O=function(){return this.Da};k.wa=function(){var a=(null!=this.K?this.K.g&128||this.K.ac||(this.K.g?0:Na(fb,this.K)):Na(fb,this.K))?this.K.wa(null):K(this.K);return null==a?null:new pg(a,this.Da)};k.T=function(){return Fc(this)};k.C=function(a,b){return Lc(this,b)};k.da=function(){return Mc(yc,this.Da)};k.ea=function(a,b){return bd.a(b,this)};k.fa=function(a,b,c){return bd.c(b,c,this)};k.ta=function(){return this.K.ta(null).Mb(null)};
k.xa=function(){var a=(null!=this.K?this.K.g&128||this.K.ac||(this.K.g?0:Na(fb,this.K)):Na(fb,this.K))?this.K.wa(null):K(this.K);return null!=a?new pg(a,this.Da):yc};k.U=function(){return this};k.P=function(a,b){return new pg(this.K,b)};k.X=function(a,b){return Wc(b,this)};pg.prototype[Qa]=function(){return Ac(this)};function Nf(a){return(a=H(a))?new pg(a,null):null}function Ud(a){return nb(a)}function qg(a,b){this.K=a;this.Da=b;this.g=32374988;this.B=0}k=qg.prototype;k.toString=function(){return dc(this)};
k.equiv=function(a){return this.C(null,a)};k.O=function(){return this.Da};k.wa=function(){var a=(null!=this.K?this.K.g&128||this.K.ac||(this.K.g?0:Na(fb,this.K)):Na(fb,this.K))?this.K.wa(null):K(this.K);return null==a?null:new qg(a,this.Da)};k.T=function(){return Fc(this)};k.C=function(a,b){return Lc(this,b)};k.da=function(){return Mc(yc,this.Da)};k.ea=function(a,b){return bd.a(b,this)};k.fa=function(a,b,c){return bd.c(b,c,this)};k.ta=function(){return this.K.ta(null).Nb(null)};
k.xa=function(){var a=(null!=this.K?this.K.g&128||this.K.ac||(this.K.g?0:Na(fb,this.K)):Na(fb,this.K))?this.K.wa(null):K(this.K);return null!=a?new qg(a,this.Da):yc};k.U=function(){return this};k.P=function(a,b){return new qg(this.K,b)};k.X=function(a,b){return Wc(b,this)};qg.prototype[Qa]=function(){return Ac(this)};function Of(a){return(a=H(a))?new qg(a,null):null}function Vd(a){return ob(a)}
var rg=function rg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return rg.j(0<c.length?new wc(c.slice(0),0):null)};rg.j=function(a){return y(Be(Hd,a))?Ua.a(function(a,c){return ed.a(y(a)?a:ye,c)},a):null};rg.w=0;rg.D=function(a){return rg.j(H(a))};sg;function tg(a){this.Db=a}tg.prototype.ya=function(){return this.Db.ya()};tg.prototype.next=function(){if(this.Db.ya())return this.Db.next().R[0];throw Error("No such element");};tg.prototype.remove=function(){return Error("Unsupported operation")};
function ug(a,b,c){this.v=a;this.nb=b;this.u=c;this.g=15077647;this.B=8196}k=ug.prototype;k.toString=function(){return dc(this)};k.equiv=function(a){return this.C(null,a)};k.keys=function(){return Ac(H(this))};k.entries=function(){var a=H(this);return new Jf(H(a))};k.values=function(){return Ac(H(this))};k.has=function(a){return Dd(this,a)};
k.forEach=function(a){for(var b=H(this),c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e),g=N(f,0),f=N(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=H(b))vd(b)?(c=Vb(b),b=Wb(b),g=c,d=M(c),c=g):(c=J(b),g=N(c,0),f=N(c,1),a.a?a.a(f,g):a.call(null,f,g),b=K(b),c=null,d=0),e=0;else return null};k.N=function(a,b){return hb.c(this,b,null)};k.I=function(a,b,c){return ib(this.nb,b)?b:c};k.Ga=function(){return new tg(bc(this.nb))};k.O=function(){return this.v};k.Y=function(){return Xa(this.nb)};
k.T=function(){var a=this.u;return null!=a?a:this.u=a=Hc(this)};k.C=function(a,b){return pd(b)&&M(this)===M(b)&&Ae(function(a){return function(b){return Dd(a,b)}}(this),b)};k.vb=function(){return new sg(Mb(this.nb))};k.da=function(){return Mc(vg,this.v)};k.U=function(){return Nf(this.nb)};k.P=function(a,b){return new ug(b,this.nb,this.u)};k.X=function(a,b){return new ug(this.v,jd.c(this.nb,b,null),null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ra(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};var vg=new ug(null,ye,Ic);ug.prototype[Qa]=function(){return Ac(this)};
function sg(a){this.cb=a;this.B=136;this.g=259}k=sg.prototype;k.Rb=function(a,b){this.cb=Pb(this.cb,b,null);return this};k.Sb=function(){return new ug(null,Ob(this.cb),null)};k.Y=function(){return M(this.cb)};k.N=function(a,b){return hb.c(this,b,null)};k.I=function(a,b,c){return hb.c(this.cb,b,Ad)===Ad?c:b};
k.call=function(){function a(a,b,c){return hb.c(this.cb,b,Ad)===Ad?c:b}function b(a,b){return hb.c(this.cb,b,Ad)===Ad?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ra(b)))};k.b=function(a){return hb.c(this.cb,a,Ad)===Ad?null:a};k.a=function(a,b){return hb.c(this.cb,a,Ad)===Ad?b:a};
function wg(a){for(var b=fd;;)if(K(a))b=ed.a(b,J(a)),a=K(a);else return H(b)}function Td(a){if(null!=a&&(a.B&4096||a.Xc))return a.Ob(null);if("string"===typeof a)return a;throw Error([C("Doesn't support name: "),C(a)].join(""));}function xg(a,b){for(var c=Mb(ye),d=H(a),e=H(b);;)if(d&&e)c=re(c,J(d),J(e)),d=K(d),e=K(e);else return Ob(c)}
function yg(a,b){return new ee(null,function(){var c=H(b);if(c){var d;d=J(c);d=a.b?a.b(d):a.call(null,d);c=y(d)?Wc(J(c),yg(a,xc(c))):null}else c=null;return c},null,null)}function zg(a,b,c){this.s=a;this.end=b;this.step=c}zg.prototype.ya=function(){return 0<this.step?this.s<this.end:this.s>this.end};zg.prototype.next=function(){var a=this.s;this.s+=this.step;return a};function Ag(a,b,c,d,e){this.v=a;this.start=b;this.end=c;this.step=d;this.u=e;this.g=32375006;this.B=8192}k=Ag.prototype;
k.toString=function(){return dc(this)};k.equiv=function(a){return this.C(null,a)};k.ca=function(a,b){if(b<Xa(this))return this.start+b*this.step;if(this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};k.Ea=function(a,b,c){return b<Xa(this)?this.start+b*this.step:this.start>this.end&&0===this.step?this.start:c};k.Ga=function(){return new zg(this.start,this.end,this.step)};k.O=function(){return this.v};
k.wa=function(){return 0<this.step?this.start+this.step<this.end?new Ag(this.v,this.start+this.step,this.end,this.step,null):null:this.start+this.step>this.end?new Ag(this.v,this.start+this.step,this.end,this.step,null):null};k.Y=function(){return Ma(Db(this))?0:Math.ceil((this.end-this.start)/this.step)};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Fc(this)};k.C=function(a,b){return Lc(this,b)};k.da=function(){return Mc(yc,this.v)};k.ea=function(a,b){return Qc(this,b)};
k.fa=function(a,b,c){for(a=this.start;;)if(0<this.step?a<this.end:a>this.end){c=b.a?b.a(c,a):b.call(null,c,a);if(Pc(c))return L.b?L.b(c):L.call(null,c);a+=this.step}else return c};k.ta=function(){return null==Db(this)?null:this.start};k.xa=function(){return null!=Db(this)?new Ag(this.v,this.start+this.step,this.end,this.step,null):yc};k.U=function(){return 0<this.step?this.start<this.end?this:null:0>this.step?this.start>this.end?this:null:this.start===this.end?null:this};
k.P=function(a,b){return new Ag(b,this.start,this.end,this.step,this.u)};k.X=function(a,b){return Wc(b,this)};Ag.prototype[Qa]=function(){return Ac(this)};function Bg(a,b){return new ee(null,function(){var c=H(b);if(c){var d=J(c),e=a.b?a.b(d):a.call(null,d),d=Wc(d,yg(function(b,c){return function(b){return lc.a(c,a.b?a.b(b):a.call(null,b))}}(d,e,c,c),K(c)));return Wc(d,Bg(a,H(Pe(M(d),c))))}return null},null,null)}
function Cg(a){return new ee(null,function(){var b=H(a);return b?Dg(Jd,J(b),xc(b)):$a(yc,Jd.l?Jd.l():Jd.call(null))},null,null)}function Dg(a,b,c){return Wc(b,new ee(null,function(){var d=H(c);if(d){var e=Dg,f;f=J(d);f=a.a?a.a(b,f):a.call(null,b,f);d=e(a,f,xc(d))}else d=null;return d},null,null))}
function Eg(a,b){return function(){function c(c,d,e){return new R(null,2,5,S,[a.c?a.c(c,d,e):a.call(null,c,d,e),b.c?b.c(c,d,e):b.call(null,c,d,e)],null)}function d(c,d){return new R(null,2,5,S,[a.a?a.a(c,d):a.call(null,c,d),b.a?b.a(c,d):b.call(null,c,d)],null)}function e(c){return new R(null,2,5,S,[a.b?a.b(c):a.call(null,c),b.b?b.b(c):b.call(null,c)],null)}function f(){return new R(null,2,5,S,[a.l?a.l():a.call(null),b.l?b.l():b.call(null)],null)}var g=null,h=function(){function c(a,b,e,f){var g=null;
if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;g=new wc(h,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){return new R(null,2,5,S,[E.A(a,c,e,f,g),E.A(b,c,e,f,g)],null)}c.w=3;c.D=function(a){var b=J(a);a=K(a);var c=J(a);a=K(a);var e=J(a);a=xc(a);return d(b,c,e,a)};c.j=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);
default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+3],++q;q=new wc(r,0)}return h.j(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.D=h.D;g.l=f;g.b=e;g.a=d;g.c=c;g.j=h.j;return g}()}
function tf(a,b,c,d,e,f,g){var h=wa;wa=null==wa?null:wa-1;try{if(null!=wa&&0>wa)return Jb(a,"#");Jb(a,c);if(0===Fa.b(f))H(g)&&Jb(a,function(){var a=Fg.b(f);return y(a)?a:"..."}());else{if(H(g)){var l=J(g);b.c?b.c(l,a,f):b.call(null,l,a,f)}for(var m=K(g),n=Fa.b(f)-1;;)if(!m||null!=n&&0===n){H(m)&&0===n&&(Jb(a,d),Jb(a,function(){var a=Fg.b(f);return y(a)?a:"..."}()));break}else{Jb(a,d);var p=J(m);c=a;g=f;b.c?b.c(p,c,g):b.call(null,p,c,g);var q=K(m);c=n-1;m=q;n=c}}return Jb(a,e)}finally{wa=h}}
function Gg(a,b){for(var c=H(b),d=null,e=0,f=0;;)if(f<e){var g=d.ca(null,f);Jb(a,g);f+=1}else if(c=H(c))d=c,vd(d)?(c=Vb(d),e=Wb(d),d=c,g=M(c),c=e,e=g):(g=J(d),Jb(a,g),c=K(d),d=null,e=0),f=0;else return null}var Hg={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function Ig(a){return[C('"'),C(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return Hg[a]})),C('"')].join("")}Jg;
function Kg(a,b){var c=Cd(F.a(a,Ca));return c?(c=null!=b?b.g&131072||b.Wc?!0:!1:!1)?null!=nd(b):c:c}
function Lg(a,b,c){if(null==a)return Jb(b,"nil");if(Kg(c,a)){Jb(b,"^");var d=nd(a);uf.c?uf.c(d,b,c):uf.call(null,d,b,c);Jb(b," ")}if(a.xb)return a.Tb(a,b,c);if(null!=a&&(a.g&2147483648||a.$))return a.M(null,b,c);if(!0===a||!1===a||"number"===typeof a)return Jb(b,""+C(a));if(null!=a&&a.constructor===Object)return Jb(b,"#js "),d=P.a(function(b){return new R(null,2,5,S,[de.b(b),a[b]],null)},yd(a)),Jg.o?Jg.o(d,uf,b,c):Jg.call(null,d,uf,b,c);if(Ka(a))return tf(b,uf,"#js ["," ","]",c,a);if("string"==typeof a)return y(Ba.b(c))?
Jb(b,Ig(a)):Jb(b,a);if(ca(a)){var e=a.name;c=y(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return Gg(b,uc(["#object[",c,' "',""+C(a),'"]'],0))}if(a instanceof Date)return c=function(a,b){for(var c=""+C(a);;)if(M(c)<b)c=[C("0"),C(c)].join("");else return c},Gg(b,uc(['#inst "',""+C(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),3),"-",'00:00"'],
0));if(a instanceof RegExp)return Gg(b,uc(['#"',a.source,'"'],0));if(null!=a&&(a.g&2147483648||a.$))return Kb(a,b,c);if(y(a.constructor.eb))return Gg(b,uc(["#object[",a.constructor.eb.replace(RegExp("/","g"),"."),"]"],0));e=a.constructor.name;c=y(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return Gg(b,uc(["#object[",c," ",""+C(a),"]"],0))}function uf(a,b,c){var d=Mg.b(c);return y(d)?(c=jd.c(c,Ng,Lg),d.c?d.c(a,b,c):d.call(null,a,b,c)):Lg(a,b,c)}
var Ke=function Ke(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Ke.j(0<c.length?new wc(c.slice(0),0):null)};Ke.j=function(a){var b=ya();if(od(a))b="";else{var c=C,d=new ma;a:{var e=new cc(d);uf(J(a),e,b);a=H(K(a));for(var f=null,g=0,h=0;;)if(h<g){var l=f.ca(null,h);Jb(e," ");uf(l,e,b);h+=1}else if(a=H(a))f=a,vd(f)?(a=Vb(f),g=Wb(f),f=a,l=M(a),a=g,g=l):(l=J(f),Jb(e," "),uf(l,e,b),a=K(f),f=null,g=0),h=0;else break a}b=""+c(d)}return b};Ke.w=0;Ke.D=function(a){return Ke.j(H(a))};
function Jg(a,b,c,d){return tf(c,function(a,c,d){var h=nb(a);b.c?b.c(h,c,d):b.call(null,h,c,d);Jb(c," ");a=ob(a);return b.c?b.c(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,H(a))}Ne.prototype.$=!0;Ne.prototype.M=function(a,b,c){Jb(b,"#object [cljs.core.Volatile ");uf(new v(null,1,[Og,this.state],null),b,c);return Jb(b,"]")};wc.prototype.$=!0;wc.prototype.M=function(a,b,c){return tf(b,uf,"("," ",")",c,this)};ee.prototype.$=!0;ee.prototype.M=function(a,b,c){return tf(b,uf,"("," ",")",c,this)};
ig.prototype.$=!0;ig.prototype.M=function(a,b,c){return tf(b,uf,"("," ",")",c,this)};ng.prototype.$=!0;ng.prototype.M=function(a,b,c){return tf(b,uf,"["," ","]",c,this)};Mf.prototype.$=!0;Mf.prototype.M=function(a,b,c){return tf(b,uf,"("," ",")",c,this)};Cc.prototype.$=!0;Cc.prototype.M=function(a,b,c){return tf(b,uf,"("," ",")",c,this)};ud.prototype.$=!0;ud.prototype.M=function(a,b,c){return tf(b,uf,"("," ",")",c,this)};be.prototype.$=!0;
be.prototype.M=function(a,b,c){return tf(b,uf,"("," ",")",c,this)};Xc.prototype.$=!0;Xc.prototype.M=function(a,b,c){return tf(b,uf,"("," ",")",c,this)};id.prototype.$=!0;id.prototype.M=function(a,b,c){return Jg(this,uf,b,c)};jg.prototype.$=!0;jg.prototype.M=function(a,b,c){return tf(b,uf,"("," ",")",c,this)};Af.prototype.$=!0;Af.prototype.M=function(a,b,c){return tf(b,uf,"["," ","]",c,this)};ug.prototype.$=!0;ug.prototype.M=function(a,b,c){return tf(b,uf,"#{"," ","}",c,this)};td.prototype.$=!0;
td.prototype.M=function(a,b,c){return tf(b,uf,"("," ",")",c,this)};Ie.prototype.$=!0;Ie.prototype.M=function(a,b,c){Jb(b,"#object [cljs.core.Atom ");uf(new v(null,1,[Og,this.state],null),b,c);return Jb(b,"]")};qg.prototype.$=!0;qg.prototype.M=function(a,b,c){return tf(b,uf,"("," ",")",c,this)};mg.prototype.$=!0;mg.prototype.M=function(a,b,c){return tf(b,uf,"["," ","]",c,this)};R.prototype.$=!0;R.prototype.M=function(a,b,c){return tf(b,uf,"["," ","]",c,this)};$d.prototype.$=!0;
$d.prototype.M=function(a,b){return Jb(b,"()")};ze.prototype.$=!0;ze.prototype.M=function(a,b,c){return tf(b,uf,"("," ",")",c,this)};v.prototype.$=!0;v.prototype.M=function(a,b,c){return Jg(this,uf,b,c)};Ag.prototype.$=!0;Ag.prototype.M=function(a,b,c){return tf(b,uf,"("," ",")",c,this)};pg.prototype.$=!0;pg.prototype.M=function(a,b,c){return tf(b,uf,"("," ",")",c,this)};Yc.prototype.$=!0;Yc.prototype.M=function(a,b,c){return tf(b,uf,"("," ",")",c,this)};kc.prototype.Ib=!0;
kc.prototype.ub=function(a,b){if(b instanceof kc)return sc(this,b);throw Error([C("Cannot compare "),C(this),C(" to "),C(b)].join(""));};z.prototype.Ib=!0;z.prototype.ub=function(a,b){if(b instanceof z)return ce(this,b);throw Error([C("Cannot compare "),C(this),C(" to "),C(b)].join(""));};Af.prototype.Ib=!0;Af.prototype.ub=function(a,b){if(sd(b))return Ed(this,b);throw Error([C("Cannot compare "),C(this),C(" to "),C(b)].join(""));};R.prototype.Ib=!0;
R.prototype.ub=function(a,b){if(sd(b))return Ed(this,b);throw Error([C("Cannot compare "),C(this),C(" to "),C(b)].join(""));};var Pg=null;function Qg(a){null==Pg&&(Pg=U.b?U.b(0):U.call(null,0));return tc.b([C(a),C(Me.a(Pg,Nc))].join(""))}function Rg(a){return function(b,c){var d=a.a?a.a(b,c):a.call(null,b,c);return Pc(d)?new Oc(d):d}}
function Ve(a){return function(b){return function(){function c(a,c){return Ua.c(b,a,c)}function d(b){return a.b?a.b(b):a.call(null,b)}function e(){return a.l?a.l():a.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.l=e;f.b=d;f.a=c;return f}()}(Rg(a))}Sg;function Tg(){}
var Ug=function Ug(b){if(null!=b&&null!=b.Tc)return b.Tc(b);var c=Ug[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Ug._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("IEncodeJS.-clj-\x3ejs",b);};Vg;function Wg(a){return(null!=a?a.Sc||(a.ec?0:Na(Tg,a)):Na(Tg,a))?Ug(a):"string"===typeof a||"number"===typeof a||a instanceof z||a instanceof kc?Vg.b?Vg.b(a):Vg.call(null,a):Ke.j(uc([a],0))}
var Vg=function Vg(b){if(null==b)return null;if(null!=b?b.Sc||(b.ec?0:Na(Tg,b)):Na(Tg,b))return Ug(b);if(b instanceof z)return Td(b);if(b instanceof kc)return""+C(b);if(rd(b)){var c={};b=H(b);for(var d=null,e=0,f=0;;)if(f<e){var g=d.ca(null,f),h=N(g,0),g=N(g,1);c[Wg(h)]=Vg(g);f+=1}else if(b=H(b))vd(b)?(e=Vb(b),b=Wb(b),d=e,e=M(e)):(e=J(b),d=N(e,0),e=N(e,1),c[Wg(d)]=Vg(e),b=K(b),d=null,e=0),f=0;else break;return c}if(null==b?0:null!=b?b.g&8||b.wd||(b.g?0:Na(Za,b)):Na(Za,b)){c=[];b=H(P.a(Vg,b));d=null;
for(f=e=0;;)if(f<e)h=d.ca(null,f),c.push(h),f+=1;else if(b=H(b))d=b,vd(d)?(b=Vb(d),f=Wb(d),d=b,e=M(b),b=f):(b=J(d),c.push(b),b=K(d),d=null,e=0),f=0;else break;return c}return b},Sg=function Sg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Sg.l();case 1:return Sg.b(arguments[0]);default:throw Error([C("Invalid arity: "),C(c.length)].join(""));}};Sg.l=function(){return Sg.b(1)};Sg.b=function(a){return Math.random()*a};Sg.w=1;
function Xg(a,b){return pe(Ua.c(function(b,d){var e=a.b?a.b(d):a.call(null,d);return re(b,e,ed.a(F.c(b,e,fd),d))},Mb(ye),b))}var Yg=null;function Zg(){if(null==Yg){var a=new v(null,3,[$g,ye,ah,ye,bh,ye],null);Yg=U.b?U.b(a):U.call(null,a)}return Yg}
function ch(a,b,c){var d=lc.a(b,c);if(!d&&!(d=Dd(bh.b(a).call(null,b),c))&&(d=sd(c))&&(d=sd(b)))if(d=M(c)===M(b))for(var d=!0,e=0;;)if(d&&e!==M(c))d=ch(a,b.b?b.b(e):b.call(null,e),c.b?c.b(e):c.call(null,e)),e+=1;else return d;else return d;else return d}function dh(a){var b;b=Zg();b=L.b?L.b(b):L.call(null,b);return te(F.a($g.b(b),a))}function eh(a,b,c,d){Me.a(a,function(){return L.b?L.b(b):L.call(null,b)});Me.a(c,function(){return L.b?L.b(d):L.call(null,d)})}
var fh=function fh(b,c,d){var e=(L.b?L.b(d):L.call(null,d)).call(null,b),e=y(y(e)?e.b?e.b(c):e.call(null,c):e)?!0:null;if(y(e))return e;e=function(){for(var e=dh(c);;)if(0<M(e))fh(b,J(e),d),e=xc(e);else return null}();if(y(e))return e;e=function(){for(var e=dh(b);;)if(0<M(e))fh(J(e),c,d),e=xc(e);else return null}();return y(e)?e:!1};function gh(a,b,c){c=fh(a,b,c);if(y(c))a=c;else{c=ch;var d;d=Zg();d=L.b?L.b(d):L.call(null,d);a=c(d,a,b)}return a}
var hh=function hh(b,c,d,e,f,g,h){var l=Ua.c(function(e,g){var h=N(g,0);N(g,1);if(ch(L.b?L.b(d):L.call(null,d),c,h)){var l;l=(l=null==e)?l:gh(h,J(e),f);l=y(l)?g:e;if(!y(gh(J(l),h,f)))throw Error([C("Multiple methods in multimethod '"),C(b),C("' match dispatch value: "),C(c),C(" -\x3e "),C(h),C(" and "),C(J(l)),C(", and neither is preferred")].join(""));return l}return e},null,L.b?L.b(e):L.call(null,e));if(y(l)){if(lc.a(L.b?L.b(h):L.call(null,h),L.b?L.b(d):L.call(null,d)))return Me.o(g,jd,c,cd(l)),
cd(l);eh(g,e,h,d);return hh(b,c,d,e,f,g,h)}return null};function ih(a,b){throw Error([C("No method in multimethod '"),C(a),C("' for dispatch value: "),C(b)].join(""));}function jh(a,b,c,d,e,f,g,h){this.name=a;this.i=b;this.ed=c;this.Vb=d;this.Eb=e;this.pd=f;this.Yb=g;this.Hb=h;this.g=4194305;this.B=4352}k=jh.prototype;
k.call=function(){function a(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,A,G,I){a=this;var ja=E.j(a.i,b,c,d,e,uc([f,g,h,l,m,n,p,q,r,t,w,x,B,D,A,G,I],0)),Kc=kh(this,ja);y(Kc)||ih(a.name,ja);return E.j(Kc,b,c,d,e,uc([f,g,h,l,m,n,p,q,r,t,w,x,B,D,A,G,I],0))}function b(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,A,G){a=this;var I=a.i.qa?a.i.qa(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,A,G):a.i.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,A,G),ja=kh(this,I);y(ja)||ih(a.name,I);return ja.qa?ja.qa(b,c,d,e,f,g,h,l,m,n,p,q,
r,t,w,x,B,D,A,G):ja.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,A,G)}function c(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,A){a=this;var G=a.i.pa?a.i.pa(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,A):a.i.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,A),I=kh(this,G);y(I)||ih(a.name,G);return I.pa?I.pa(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,A):I.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,A)}function d(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D){a=this;var A=a.i.oa?a.i.oa(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D):a.i.call(null,
b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D),G=kh(this,A);y(G)||ih(a.name,A);return G.oa?G.oa(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D):G.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D)}function e(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B){a=this;var D=a.i.na?a.i.na(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B):a.i.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B),A=kh(this,D);y(A)||ih(a.name,D);return A.na?A.na(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B):A.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B)}function f(a,b,c,d,e,f,g,h,l,m,n,p,q,r,
t,w,x){a=this;var B=a.i.ma?a.i.ma(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x):a.i.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x),D=kh(this,B);y(D)||ih(a.name,B);return D.ma?D.ma(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x):D.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x)}function g(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w){a=this;var x=a.i.la?a.i.la(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w):a.i.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w),B=kh(this,x);y(B)||ih(a.name,x);return B.la?B.la(b,c,d,e,f,g,h,l,m,n,p,q,r,t,w):B.call(null,b,c,d,e,f,g,h,l,m,n,p,
q,r,t,w)}function h(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t){a=this;var w=a.i.ka?a.i.ka(b,c,d,e,f,g,h,l,m,n,p,q,r,t):a.i.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t),x=kh(this,w);y(x)||ih(a.name,w);return x.ka?x.ka(b,c,d,e,f,g,h,l,m,n,p,q,r,t):x.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t)}function l(a,b,c,d,e,f,g,h,l,m,n,p,q,r){a=this;var t=a.i.ja?a.i.ja(b,c,d,e,f,g,h,l,m,n,p,q,r):a.i.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r),w=kh(this,t);y(w)||ih(a.name,t);return w.ja?w.ja(b,c,d,e,f,g,h,l,m,n,p,q,r):w.call(null,b,c,d,e,f,
g,h,l,m,n,p,q,r)}function m(a,b,c,d,e,f,g,h,l,m,n,p,q){a=this;var r=a.i.ia?a.i.ia(b,c,d,e,f,g,h,l,m,n,p,q):a.i.call(null,b,c,d,e,f,g,h,l,m,n,p,q),t=kh(this,r);y(t)||ih(a.name,r);return t.ia?t.ia(b,c,d,e,f,g,h,l,m,n,p,q):t.call(null,b,c,d,e,f,g,h,l,m,n,p,q)}function n(a,b,c,d,e,f,g,h,l,m,n,p){a=this;var q=a.i.ha?a.i.ha(b,c,d,e,f,g,h,l,m,n,p):a.i.call(null,b,c,d,e,f,g,h,l,m,n,p),r=kh(this,q);y(r)||ih(a.name,q);return r.ha?r.ha(b,c,d,e,f,g,h,l,m,n,p):r.call(null,b,c,d,e,f,g,h,l,m,n,p)}function p(a,b,
c,d,e,f,g,h,l,m,n){a=this;var p=a.i.ga?a.i.ga(b,c,d,e,f,g,h,l,m,n):a.i.call(null,b,c,d,e,f,g,h,l,m,n),q=kh(this,p);y(q)||ih(a.name,p);return q.ga?q.ga(b,c,d,e,f,g,h,l,m,n):q.call(null,b,c,d,e,f,g,h,l,m,n)}function q(a,b,c,d,e,f,g,h,l,m){a=this;var n=a.i.sa?a.i.sa(b,c,d,e,f,g,h,l,m):a.i.call(null,b,c,d,e,f,g,h,l,m),p=kh(this,n);y(p)||ih(a.name,n);return p.sa?p.sa(b,c,d,e,f,g,h,l,m):p.call(null,b,c,d,e,f,g,h,l,m)}function r(a,b,c,d,e,f,g,h,l){a=this;var m=a.i.ra?a.i.ra(b,c,d,e,f,g,h,l):a.i.call(null,
b,c,d,e,f,g,h,l),n=kh(this,m);y(n)||ih(a.name,m);return n.ra?n.ra(b,c,d,e,f,g,h,l):n.call(null,b,c,d,e,f,g,h,l)}function t(a,b,c,d,e,f,g,h){a=this;var l=a.i.ba?a.i.ba(b,c,d,e,f,g,h):a.i.call(null,b,c,d,e,f,g,h),m=kh(this,l);y(m)||ih(a.name,l);return m.ba?m.ba(b,c,d,e,f,g,h):m.call(null,b,c,d,e,f,g,h)}function w(a,b,c,d,e,f,g){a=this;var h=a.i.aa?a.i.aa(b,c,d,e,f,g):a.i.call(null,b,c,d,e,f,g),l=kh(this,h);y(l)||ih(a.name,h);return l.aa?l.aa(b,c,d,e,f,g):l.call(null,b,c,d,e,f,g)}function x(a,b,c,d,
e,f){a=this;var g=a.i.A?a.i.A(b,c,d,e,f):a.i.call(null,b,c,d,e,f),h=kh(this,g);y(h)||ih(a.name,g);return h.A?h.A(b,c,d,e,f):h.call(null,b,c,d,e,f)}function B(a,b,c,d,e){a=this;var f=a.i.o?a.i.o(b,c,d,e):a.i.call(null,b,c,d,e),g=kh(this,f);y(g)||ih(a.name,f);return g.o?g.o(b,c,d,e):g.call(null,b,c,d,e)}function D(a,b,c,d){a=this;var e=a.i.c?a.i.c(b,c,d):a.i.call(null,b,c,d),f=kh(this,e);y(f)||ih(a.name,e);return f.c?f.c(b,c,d):f.call(null,b,c,d)}function I(a,b,c){a=this;var d=a.i.a?a.i.a(b,c):a.i.call(null,
b,c),e=kh(this,d);y(e)||ih(a.name,d);return e.a?e.a(b,c):e.call(null,b,c)}function G(a,b){a=this;var c=a.i.b?a.i.b(b):a.i.call(null,b),d=kh(this,c);y(d)||ih(a.name,c);return d.b?d.b(b):d.call(null,b)}function ja(a){a=this;var b=a.i.l?a.i.l():a.i.call(null),c=kh(this,b);y(c)||ih(a.name,b);return c.l?c.l():c.call(null)}var A=null,A=function(Z,A,O,V,T,X,fa,na,oa,qa,va,La,Aa,Da,Ha,Sa,Ta,Eb,Tb,Ec,wd,xd){switch(arguments.length){case 1:return ja.call(this,Z);case 2:return G.call(this,Z,A);case 3:return I.call(this,
Z,A,O);case 4:return D.call(this,Z,A,O,V);case 5:return B.call(this,Z,A,O,V,T);case 6:return x.call(this,Z,A,O,V,T,X);case 7:return w.call(this,Z,A,O,V,T,X,fa);case 8:return t.call(this,Z,A,O,V,T,X,fa,na);case 9:return r.call(this,Z,A,O,V,T,X,fa,na,oa);case 10:return q.call(this,Z,A,O,V,T,X,fa,na,oa,qa);case 11:return p.call(this,Z,A,O,V,T,X,fa,na,oa,qa,va);case 12:return n.call(this,Z,A,O,V,T,X,fa,na,oa,qa,va,La);case 13:return m.call(this,Z,A,O,V,T,X,fa,na,oa,qa,va,La,Aa);case 14:return l.call(this,
Z,A,O,V,T,X,fa,na,oa,qa,va,La,Aa,Da);case 15:return h.call(this,Z,A,O,V,T,X,fa,na,oa,qa,va,La,Aa,Da,Ha);case 16:return g.call(this,Z,A,O,V,T,X,fa,na,oa,qa,va,La,Aa,Da,Ha,Sa);case 17:return f.call(this,Z,A,O,V,T,X,fa,na,oa,qa,va,La,Aa,Da,Ha,Sa,Ta);case 18:return e.call(this,Z,A,O,V,T,X,fa,na,oa,qa,va,La,Aa,Da,Ha,Sa,Ta,Eb);case 19:return d.call(this,Z,A,O,V,T,X,fa,na,oa,qa,va,La,Aa,Da,Ha,Sa,Ta,Eb,Tb);case 20:return c.call(this,Z,A,O,V,T,X,fa,na,oa,qa,va,La,Aa,Da,Ha,Sa,Ta,Eb,Tb,Ec);case 21:return b.call(this,
Z,A,O,V,T,X,fa,na,oa,qa,va,La,Aa,Da,Ha,Sa,Ta,Eb,Tb,Ec,wd);case 22:return a.call(this,Z,A,O,V,T,X,fa,na,oa,qa,va,La,Aa,Da,Ha,Sa,Ta,Eb,Tb,Ec,wd,xd)}throw Error("Invalid arity: "+arguments.length);};A.b=ja;A.a=G;A.c=I;A.o=D;A.A=B;A.aa=x;A.ba=w;A.ra=t;A.sa=r;A.ga=q;A.ha=p;A.ia=n;A.ja=m;A.ka=l;A.la=h;A.ma=g;A.na=f;A.oa=e;A.pa=d;A.qa=c;A.Kb=b;A.wb=a;return A}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ra(b)))};
k.l=function(){var a=this.i.l?this.i.l():this.i.call(null),b=kh(this,a);y(b)||ih(this.name,a);return b.l?b.l():b.call(null)};k.b=function(a){var b=this.i.b?this.i.b(a):this.i.call(null,a),c=kh(this,b);y(c)||ih(this.name,b);return c.b?c.b(a):c.call(null,a)};k.a=function(a,b){var c=this.i.a?this.i.a(a,b):this.i.call(null,a,b),d=kh(this,c);y(d)||ih(this.name,c);return d.a?d.a(a,b):d.call(null,a,b)};
k.c=function(a,b,c){var d=this.i.c?this.i.c(a,b,c):this.i.call(null,a,b,c),e=kh(this,d);y(e)||ih(this.name,d);return e.c?e.c(a,b,c):e.call(null,a,b,c)};k.o=function(a,b,c,d){var e=this.i.o?this.i.o(a,b,c,d):this.i.call(null,a,b,c,d),f=kh(this,e);y(f)||ih(this.name,e);return f.o?f.o(a,b,c,d):f.call(null,a,b,c,d)};k.A=function(a,b,c,d,e){var f=this.i.A?this.i.A(a,b,c,d,e):this.i.call(null,a,b,c,d,e),g=kh(this,f);y(g)||ih(this.name,f);return g.A?g.A(a,b,c,d,e):g.call(null,a,b,c,d,e)};
k.aa=function(a,b,c,d,e,f){var g=this.i.aa?this.i.aa(a,b,c,d,e,f):this.i.call(null,a,b,c,d,e,f),h=kh(this,g);y(h)||ih(this.name,g);return h.aa?h.aa(a,b,c,d,e,f):h.call(null,a,b,c,d,e,f)};k.ba=function(a,b,c,d,e,f,g){var h=this.i.ba?this.i.ba(a,b,c,d,e,f,g):this.i.call(null,a,b,c,d,e,f,g),l=kh(this,h);y(l)||ih(this.name,h);return l.ba?l.ba(a,b,c,d,e,f,g):l.call(null,a,b,c,d,e,f,g)};
k.ra=function(a,b,c,d,e,f,g,h){var l=this.i.ra?this.i.ra(a,b,c,d,e,f,g,h):this.i.call(null,a,b,c,d,e,f,g,h),m=kh(this,l);y(m)||ih(this.name,l);return m.ra?m.ra(a,b,c,d,e,f,g,h):m.call(null,a,b,c,d,e,f,g,h)};k.sa=function(a,b,c,d,e,f,g,h,l){var m=this.i.sa?this.i.sa(a,b,c,d,e,f,g,h,l):this.i.call(null,a,b,c,d,e,f,g,h,l),n=kh(this,m);y(n)||ih(this.name,m);return n.sa?n.sa(a,b,c,d,e,f,g,h,l):n.call(null,a,b,c,d,e,f,g,h,l)};
k.ga=function(a,b,c,d,e,f,g,h,l,m){var n=this.i.ga?this.i.ga(a,b,c,d,e,f,g,h,l,m):this.i.call(null,a,b,c,d,e,f,g,h,l,m),p=kh(this,n);y(p)||ih(this.name,n);return p.ga?p.ga(a,b,c,d,e,f,g,h,l,m):p.call(null,a,b,c,d,e,f,g,h,l,m)};k.ha=function(a,b,c,d,e,f,g,h,l,m,n){var p=this.i.ha?this.i.ha(a,b,c,d,e,f,g,h,l,m,n):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n),q=kh(this,p);y(q)||ih(this.name,p);return q.ha?q.ha(a,b,c,d,e,f,g,h,l,m,n):q.call(null,a,b,c,d,e,f,g,h,l,m,n)};
k.ia=function(a,b,c,d,e,f,g,h,l,m,n,p){var q=this.i.ia?this.i.ia(a,b,c,d,e,f,g,h,l,m,n,p):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p),r=kh(this,q);y(r)||ih(this.name,q);return r.ia?r.ia(a,b,c,d,e,f,g,h,l,m,n,p):r.call(null,a,b,c,d,e,f,g,h,l,m,n,p)};k.ja=function(a,b,c,d,e,f,g,h,l,m,n,p,q){var r=this.i.ja?this.i.ja(a,b,c,d,e,f,g,h,l,m,n,p,q):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q),t=kh(this,r);y(t)||ih(this.name,r);return t.ja?t.ja(a,b,c,d,e,f,g,h,l,m,n,p,q):t.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q)};
k.ka=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){var t=this.i.ka?this.i.ka(a,b,c,d,e,f,g,h,l,m,n,p,q,r):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r),w=kh(this,t);y(w)||ih(this.name,t);return w.ka?w.ka(a,b,c,d,e,f,g,h,l,m,n,p,q,r):w.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r)};
k.la=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t){var w=this.i.la?this.i.la(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t),x=kh(this,w);y(x)||ih(this.name,w);return x.la?x.la(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t):x.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t)};
k.ma=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w){var x=this.i.ma?this.i.ma(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w),B=kh(this,x);y(B)||ih(this.name,x);return B.ma?B.ma(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w):B.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w)};
k.na=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x){var B=this.i.na?this.i.na(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x),D=kh(this,B);y(D)||ih(this.name,B);return D.na?D.na(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x):D.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x)};
k.oa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B){var D=this.i.oa?this.i.oa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B),I=kh(this,D);y(I)||ih(this.name,D);return I.oa?I.oa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B):I.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B)};
k.pa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D){var I=this.i.pa?this.i.pa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D),G=kh(this,I);y(G)||ih(this.name,I);return G.pa?G.pa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D):G.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D)};
k.qa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,I){var G=this.i.qa?this.i.qa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,I):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,I),ja=kh(this,G);y(ja)||ih(this.name,G);return ja.qa?ja.qa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,I):ja.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,I)};
k.Kb=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,I,G){var ja=E.j(this.i,a,b,c,d,uc([e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,I,G],0)),A=kh(this,ja);y(A)||ih(this.name,ja);return E.j(A,a,b,c,d,uc([e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,I,G],0))};function lh(a,b,c){Me.o(a.Eb,jd,b,c);eh(a.Yb,a.Eb,a.Hb,a.Vb)}
function kh(a,b){lc.a(L.b?L.b(a.Hb):L.call(null,a.Hb),L.b?L.b(a.Vb):L.call(null,a.Vb))||eh(a.Yb,a.Eb,a.Hb,a.Vb);var c=(L.b?L.b(a.Yb):L.call(null,a.Yb)).call(null,b);if(y(c))return c;c=hh(a.name,b,a.Vb,a.Eb,a.pd,a.Yb,a.Hb);return y(c)?c:(L.b?L.b(a.Eb):L.call(null,a.Eb)).call(null,a.ed)}k.Ob=function(){return Yb(this.name)};k.Pb=function(){return Zb(this.name)};k.T=function(){return this[da]||(this[da]=++ga)};var mh=new z(null,"y","y",-1757859776),nh=new z(null,"path","path",-188191168),oh=new z(null,"penny-spacing","penny-spacing",-20780703),ph=new z(null,"supplier","supplier",18255489),qh=new z(null,"determine-capacity","determine-capacity",-452765887),rh=new z(null,"by-station","by-station",516084641),sh=new z(null,"selector","selector",762528866),th=new z(null,"r","r",-471384190),uh=new z(null,"run","run",-1821166653),vh=new z(null,"richpath","richpath",-150197948),wh=new z(null,"turns","turns",-1118736892),
xh=new z(null,"transform","transform",1381301764),yh=new z(null,"die","die",-547192252),Ca=new z(null,"meta","meta",1499536964),zh=new z(null,"transformer","transformer",-1493470620),Ah=new z(null,"color","color",1011675173),Bh=new z(null,"executors","executors",-331073403),Ea=new z(null,"dup","dup",556298533),Ch=new z(null,"intaking","intaking",-1009888859),Dh=new z(null,"processing","processing",-1576405467),Eh=new z(null,"stats-history","stats-history",636123973),Fh=new z(null,"spout-y","spout-y",
1676697606),Gh=new z(null,"stations","stations",-19744730),Hh=new z(null,"capacity","capacity",72689734),Ih=new z(null,"private","private",-558947994),Jh=new z(null,"efficient","efficient",-63016538),Kh=new z(null,"graphs?","graphs?",-270895578),Lh=new z(null,"transform*","transform*",-1613794522),Mh=new z(null,"button","button",1456579943),Nh=new z(null,"top","top",-1856271961),Oh=new z(null,"basic+efficient","basic+efficient",-970783161),Je=new z(null,"validator","validator",-1966190681),Ph=new z(null,
"total-utilization","total-utilization",-1341502521),Qh=new z(null,"default","default",-1987822328),Rh=new z(null,"finally-block","finally-block",832982472),Sh=new z(null,"scenarios","scenarios",1618559369),Th=new z(null,"value","value",305978217),Uh=new z(null,"green","green",-945526839),Vh=new z(null,"section","section",-300141526),Wh=new z(null,"circle","circle",1903212362),Xh=new z(null,"drop","drop",364481611),Yh=new z(null,"tracer","tracer",-1844475765),Zh=new z(null,"width","width",-384071477),
$h=new z(null,"supply","supply",-1701696309),ai=new z(null,"spath","spath",-1857758005),bi=new z(null,"source-spout-y","source-spout-y",1447094571),ci=new z(null,"onclick","onclick",1297553739),di=new z(null,"dy","dy",1719547243),ei=new z(null,"clipPath","clipPath",-934619797),fi=new z(null,"params","params",710516235),gi=new z(null,"total-output","total-output",1149740747),hi=new z(null,"easing","easing",735372043),Og=new z(null,"val","val",128701612),W=new z(null,"recur","recur",-437573268),ii=
new z(null,"type","type",1174270348),ji=new z(null,"catch-block","catch-block",1175212748),ki=new z(null,"duration","duration",1444101068),li=new z(null,"constrained","constrained",597287981),mi=new z(null,"intaking?","intaking?",834765),Ng=new z(null,"fallback-impl","fallback-impl",-1501286995),za=new z(null,"flush-on-newline","flush-on-newline",-151457939),ni=new z(null,"all","all",892129742),oi=new z(null,"normal","normal",-1519123858),pi=new z(null,"wip","wip",-103467282),qi=new z(null,"averages",
"averages",-1747836978),ri=new z(null,"className","className",-1983287057),ah=new z(null,"descendants","descendants",1824886031),si=new z(null,"size","size",1098693007),ti=new z(null,"accessor","accessor",-25476721),ui=new z(null,"title","title",636505583),vi=new z(null,"no-op","no-op",-93046065),wi=new kc(null,"folder","folder",-1138554033,null),xi=new z(null,"num-needed-params","num-needed-params",-1219326097),yi=new z(null,"dropping","dropping",125809647),zi=new z(null,"high","high",2027297808),
bh=new z(null,"ancestors","ancestors",-776045424),Ai=new z(null,"style","style",-496642736),Bi=new z(null,"clip-path","clip-path",-439959120),Ci=new z(null,"div","div",1057191632),Ba=new z(null,"readably","readably",1129599760),Di=new z(null,"params-idx","params-idx",340984624),Ei=new kc(null,"box","box",-1123515375,null),Fg=new z(null,"more-marker","more-marker",-14717935),Fi=new z(null,"percent-utilization","percent-utilization",-2006109103),Gi=new z(null,"g","g",1738089905),Hi=new z(null,"update-stats",
"update-stats",1938193073),Ii=new z(null,"transfer-to-next-station","transfer-to-next-station",-114193262),Ji=new z(null,"set-spacing","set-spacing",1920968978),Ki=new z(null,"intake","intake",-108984782),Li=new z(null,"set-up","set-up",874388242),Mi=new kc(null,"coll","coll",-1006698606,null),Ni=new z(null,"line","line",212345235),Oi=new kc(null,"val","val",1769233139,null),Pi=new kc(null,"xf","xf",2042434515,null),Fa=new z(null,"print-length","print-length",1931866356),Qi=new z(null,"select*","select*",
-1829914060),Ri=new z(null,"cx","cx",1272694324),Si=new z(null,"id","id",-1388402092),Ti=new z(null,"class","class",-2030961996),Ui=new z(null,"red","red",-969428204),Vi=new z(null,"blue","blue",-622100620),Wi=new z(null,"cy","cy",755331060),Xi=new z(null,"catch-exception","catch-exception",-1997306795),Yi=new z(null,"defs","defs",1398449717),$g=new z(null,"parents","parents",-2027538891),Zi=new z(null,"collect-val","collect-val",801894069),$i=new z(null,"xlink:href","xlink:href",828777205),aj=new z(null,
"prev","prev",-1597069226),bj=new z(null,"svg","svg",856789142),cj=new z(null,"bin-h","bin-h",346004918),dj=new z(null,"length","length",588987862),ej=new z(null,"continue-block","continue-block",-1852047850),fj=new z(null,"hookTransition","hookTransition",-1045887913),gj=new z(null,"tracer-reset","tracer-reset",283192087),hj=new z(null,"distribution","distribution",-284555369),ij=new z(null,"transfer-to-processed","transfer-to-processed",198231991),jj=new z(null,"roll","roll",11266999),kj=new z(null,
"position","position",-2011731912),lj=new z(null,"graphs","graphs",-1584479112),mj=new z(null,"basic","basic",1043717368),nj=new z(null,"image","image",-58725096),oj=new z(null,"d","d",1972142424),pj=new z(null,"average","average",-492356168),qj=new z(null,"dropping?","dropping?",-1065207176),rj=new z(null,"processed","processed",800622264),sj=new z(null,"x","x",2099068185),tj=new z(null,"x1","x1",-1863922247),uj=new z(null,"tracer-start","tracer-start",1036491225),vj=new z(null,"transform-fns","transform-fns",
669042649),xe=new kc(null,"quote","quote",1377916282,null),wj=new z(null,"fixed","fixed",-562004358),we=new z(null,"arglists","arglists",1661989754),ef=new z(null,"dice","dice",707777434),xj=new z(null,"y2","y2",-718691301),yj=new z(null,"set-lengths","set-lengths",742672507),ve=new kc(null,"nil-iter","nil-iter",1101030523,null),zj=new z(null,"main","main",-2117802661),Aj=new z(null,"hierarchy","hierarchy",-1053470341),Mg=new z(null,"alt-impl","alt-impl",670969595),Bj=new kc(null,"fn-handler","fn-handler",
648785851,null),Cj=new z(null,"doc","doc",1913296891),Dj=new z(null,"integrate","integrate",-1653689604),Ej=new z(null,"rect","rect",-108902628),Fj=new z(null,"step","step",1288888124),Gj=new z(null,"delay","delay",-574225219),Hj=new z(null,"x2","x2",-1362513475),Ij=new z(null,"pennies","pennies",1847043709),Jj=new z(null,"incoming","incoming",-1710131427),Kj=new z(null,"productivity","productivity",-890721314),Lj=new z(null,"range","range",1639692286),Mj=new z(null,"height","height",1025178622),
Nj=new z(null,"spacing","spacing",204422175),Oj=new z(null,"left","left",-399115937),Pj=new z("cljs.core","not-found","cljs.core/not-found",-1572889185),Qj=new z(null,"foreignObject","foreignObject",25502111),Rj=new z(null,"text","text",-1790561697),Sj=new z(null,"data","data",-232669377),Tj=new kc(null,"f","f",43394975,null);var Uj;function Vj(a){return a.l?a.l():a.call(null)}function Wj(a,b,c){return rd(c)?zb(c,a,b):null==c?b:Ka(c)?Tc(c,a,b):yb.c(c,a,b)}
var Xj=function Xj(b,c,d,e){if(null!=b&&null!=b.qc)return b.qc(b,c,d,e);var f=Xj[u(null==b?null:b)];if(null!=f)return f.o?f.o(b,c,d,e):f.call(null,b,c,d,e);f=Xj._;if(null!=f)return f.o?f.o(b,c,d,e):f.call(null,b,c,d,e);throw Oa("CollFold.coll-fold",b);},Yj=function Yj(b,c){"undefined"===typeof Uj&&(Uj=function(b,c,f,g){this.gd=b;this.fc=c;this.ab=f;this.jd=g;this.g=917504;this.B=0},Uj.prototype.P=function(b,c){return new Uj(this.gd,this.fc,this.ab,c)},Uj.prototype.O=function(){return this.jd},Uj.prototype.ea=
function(b,c){return yb.c(this.fc,this.ab.b?this.ab.b(c):this.ab.call(null,c),c.l?c.l():c.call(null))},Uj.prototype.fa=function(b,c,f){return yb.c(this.fc,this.ab.b?this.ab.b(c):this.ab.call(null,c),f)},Uj.prototype.qc=function(b,c,f,g){return Xj(this.fc,c,f,this.ab.b?this.ab.b(g):this.ab.call(null,g))},Uj.ic=function(){return new R(null,4,5,S,[Mc(wi,new v(null,2,[we,jc(xe,jc(new R(null,2,5,S,[Mi,Pi],null))),Cj,"Given a foldable collection, and a transformation function xf,\n  returns a foldable collection, where any supplied reducing\n  fn will be transformed by xf. xf is a function of reducing fn to\n  reducing fn."],
null)),Mi,Pi,ra.Dd],null)},Uj.xb=!0,Uj.eb="clojure.core.reducers/t_clojure$core$reducers19004",Uj.Tb=function(b,c){return Jb(c,"clojure.core.reducers/t_clojure$core$reducers19004")});return new Uj(Yj,b,c,ye)};
function Zj(a,b){return Yj(b,function(b){return function(){function d(d,e,f){e=a.a?a.a(e,f):a.call(null,e,f);return b.a?b.a(d,e):b.call(null,d,e)}function e(d,e){var f=a.b?a.b(e):a.call(null,e);return b.a?b.a(d,f):b.call(null,d,f)}function f(){return b.l?b.l():b.call(null)}var g=null,g=function(a,b,c){switch(arguments.length){case 0:return f.call(this);case 2:return e.call(this,a,b);case 3:return d.call(this,a,b,c)}throw Error("Invalid arity: "+arguments.length);};g.l=f;g.a=e;g.c=d;return g}()})}
function ak(a,b){return Yj(b,function(b){return function(){function d(d,e,f){return Wj(b,d,a.a?a.a(e,f):a.call(null,e,f))}function e(d,e){return Wj(b,d,a.b?a.b(e):a.call(null,e))}function f(){return b.l?b.l():b.call(null)}var g=null,g=function(a,b,c){switch(arguments.length){case 0:return f.call(this);case 2:return e.call(this,a,b);case 3:return d.call(this,a,b,c)}throw Error("Invalid arity: "+arguments.length);};g.l=f;g.a=e;g.c=d;return g}()})}
var bk=function bk(b,c,d,e){if(od(b))return d.l?d.l():d.call(null);if(M(b)<=c)return Wj(e,d.l?d.l():d.call(null),b);var f=Qd(M(b)),g=yf.c(b,0,f);b=yf.c(b,f,M(b));return Vj(function(b,c,e,f){return function(){var b=f(c),g;g=f(e);b=b.l?b.l():b.call(null);g=g.l?g.l():g.call(null);return d.a?d.a(b,g):d.call(null,b,g)}}(f,g,b,function(b,f,g){return function(n){return function(){return function(){return bk(n,c,d,e)}}(b,f,g)}}(f,g,b)))};Xj["null"]=function(a,b,c){return c.l?c.l():c.call(null)};
Xj.object=function(a,b,c,d){return Wj(d,c.l?c.l():c.call(null),a)};R.prototype.qc=function(a,b,c,d){return bk(this,b,c,d)};function ck(){}
var dk=function dk(b,c,d){if(null!=b&&null!=b.zb)return b.zb(b,c,d);var e=dk[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=dk._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Oa("StructurePath.select*",b);},ek=function ek(b,c,d){if(null!=b&&null!=b.Ab)return b.Ab(b,c,d);var e=ek[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=ek._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Oa("StructurePath.transform*",b);};
function fk(){}var gk=function gk(b,c){if(null!=b&&null!=b.rc)return b.rc(0,c);var d=gk[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=gk._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Oa("Collector.collect-val",b);};var hk=function hk(b){if(null!=b&&null!=b.Gc)return b.Gc();var c=hk[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=hk._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("PathComposer.comp-paths*",b);};function ik(a,b,c){this.type=a;this.sd=b;this.ud=c}var jk;
jk=new ik(vh,function(a,b,c,d){var e=function(){return function(a,b,c,d){return od(c)?new R(null,1,5,S,[d],null):new R(null,1,5,S,[ed.a(c,d)],null)}}(a,b,fd,d);return c.A?c.A(a,b,fd,d,e):c.call(null,a,b,fd,d,e)},function(a,b,c,d,e){var f=function(){return function(a,b,c,e){return od(c)?d.b?d.b(e):d.call(null,e):E.a(d,ed.a(c,e))}}(a,b,fd,e);return c.A?c.A(a,b,fd,e,f):c.call(null,a,b,fd,e,f)});var kk;
kk=new ik(ai,function(a,b,c,d){a=function(){return function(a){return new R(null,1,5,S,[a],null)}}(d);return c.a?c.a(d,a):c.call(null,d,a)},function(a,b,c,d,e){return c.a?c.a(e,d):c.call(null,e,d)});function lk(a,b,c,d,e,f){this.Ka=a;this.La=b;this.Ma=c;this.S=d;this.G=e;this.u=f;this.g=2229667594;this.B=8192}k=lk.prototype;k.N=function(a,b){return hb.c(this,b,null)};
k.I=function(a,b,c){switch(b instanceof z?b.Ha:null){case "executors":return this.Ka;case "selector":return this.La;case "transformer":return this.Ma;default:return F.c(this.G,b,c)}};k.M=function(a,b,c){return tf(b,function(){return function(a){return tf(b,uf,""," ","",c,a)}}(this),"#com.rpl.specter.impl.TransformFunctions{",", ","}",c,oe.a(new R(null,3,5,S,[new R(null,2,5,S,[Bh,this.Ka],null),new R(null,2,5,S,[sh,this.La],null),new R(null,2,5,S,[zh,this.Ma],null)],null),this.G))};
k.Ga=function(){return new Gf(0,this,3,new R(null,3,5,S,[Bh,sh,zh],null),bc(this.G))};k.O=function(){return this.S};k.Y=function(){return 3+M(this.G)};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Wd(this)};k.C=function(a,b){var c;c=y(b)?(c=this.constructor===b.constructor)?Ff(this,b):c:b;return y(c)?!0:!1};
k.ib=function(a,b){return Dd(new ug(null,new v(null,3,[sh,null,zh,null,Bh,null],null),null),b)?ld.a(Mc(Ze.a(ye,this),this.S),b):new lk(this.Ka,this.La,this.Ma,this.S,te(ld.a(this.G,b)),null)};
k.Oa=function(a,b,c){return y(Q.a?Q.a(Bh,b):Q.call(null,Bh,b))?new lk(c,this.La,this.Ma,this.S,this.G,null):y(Q.a?Q.a(sh,b):Q.call(null,sh,b))?new lk(this.Ka,c,this.Ma,this.S,this.G,null):y(Q.a?Q.a(zh,b):Q.call(null,zh,b))?new lk(this.Ka,this.La,c,this.S,this.G,null):new lk(this.Ka,this.La,this.Ma,this.S,jd.c(this.G,b,c),null)};k.U=function(){return H(oe.a(new R(null,3,5,S,[new R(null,2,5,S,[Bh,this.Ka],null),new R(null,2,5,S,[sh,this.La],null),new R(null,2,5,S,[zh,this.Ma],null)],null),this.G))};
k.P=function(a,b){return new lk(this.Ka,this.La,this.Ma,b,this.G,this.u)};k.X=function(a,b){return sd(b)?jb(this,bb.a(b,0),bb.a(b,1)):Ua.c($a,this,b)};function mk(a,b,c){return new lk(a,b,c,null,null,null)}function nk(a,b,c,d,e,f){this.va=a;this.Xa=b;this.Ya=c;this.S=d;this.G=e;this.u=f;this.g=2229667594;this.B=8192}k=nk.prototype;k.N=function(a,b){return hb.c(this,b,null)};
k.I=function(a,b,c){switch(b instanceof z?b.Ha:null){case "transform-fns":return this.va;case "params":return this.Xa;case "params-idx":return this.Ya;default:return F.c(this.G,b,c)}};k.M=function(a,b,c){return tf(b,function(){return function(a){return tf(b,uf,""," ","",c,a)}}(this),"#com.rpl.specter.impl.CompiledPath{",", ","}",c,oe.a(new R(null,3,5,S,[new R(null,2,5,S,[vj,this.va],null),new R(null,2,5,S,[fi,this.Xa],null),new R(null,2,5,S,[Di,this.Ya],null)],null),this.G))};
k.Ga=function(){return new Gf(0,this,3,new R(null,3,5,S,[vj,fi,Di],null),bc(this.G))};k.O=function(){return this.S};k.Y=function(){return 3+M(this.G)};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Wd(this)};k.C=function(a,b){var c;c=y(b)?(c=this.constructor===b.constructor)?Ff(this,b):c:b;return y(c)?!0:!1};
k.ib=function(a,b){return Dd(new ug(null,new v(null,3,[fi,null,Di,null,vj,null],null),null),b)?ld.a(Mc(Ze.a(ye,this),this.S),b):new nk(this.va,this.Xa,this.Ya,this.S,te(ld.a(this.G,b)),null)};
k.Oa=function(a,b,c){return y(Q.a?Q.a(vj,b):Q.call(null,vj,b))?new nk(c,this.Xa,this.Ya,this.S,this.G,null):y(Q.a?Q.a(fi,b):Q.call(null,fi,b))?new nk(this.va,c,this.Ya,this.S,this.G,null):y(Q.a?Q.a(Di,b):Q.call(null,Di,b))?new nk(this.va,this.Xa,c,this.S,this.G,null):new nk(this.va,this.Xa,this.Ya,this.S,jd.c(this.G,b,c),null)};k.U=function(){return H(oe.a(new R(null,3,5,S,[new R(null,2,5,S,[vj,this.va],null),new R(null,2,5,S,[fi,this.Xa],null),new R(null,2,5,S,[Di,this.Ya],null)],null),this.G))};
k.P=function(a,b){return new nk(this.va,this.Xa,this.Ya,b,this.G,this.u)};k.X=function(a,b){return sd(b)?jb(this,bb.a(b,0),bb.a(b,1)):Ua.c($a,this,b)};function ok(a){return new nk(a,null,0,null,null,null)}Y;function pk(a,b,c,d,e){this.va=a;this.rb=b;this.S=c;this.G=d;this.u=e;this.g=2229667595;this.B=8192}k=pk.prototype;k.N=function(a,b){return hb.c(this,b,null)};
k.I=function(a,b,c){switch(b instanceof z?b.Ha:null){case "transform-fns":return this.va;case "num-needed-params":return this.rb;default:return F.c(this.G,b,c)}};k.M=function(a,b,c){return tf(b,function(){return function(a){return tf(b,uf,""," ","",c,a)}}(this),"#com.rpl.specter.impl.ParamsNeededPath{",", ","}",c,oe.a(new R(null,2,5,S,[new R(null,2,5,S,[vj,this.va],null),new R(null,2,5,S,[xi,this.rb],null)],null),this.G))};k.Ga=function(){return new Gf(0,this,2,new R(null,2,5,S,[vj,xi],null),bc(this.G))};
k.call=function(){function a(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,A,D,G,I){a=le(oe.a(new R(null,20,5,S,[b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,A,D,G],null),I));return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function b(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,A,D,G){a=le(20);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=w;a[15]=x;a[16]=B;a[17]=A;a[18]=D;a[19]=G;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function c(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,
w,x,B,A,D){a=le(19);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=w;a[15]=x;a[16]=B;a[17]=A;a[18]=D;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function d(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,A){a=le(18);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=w;a[15]=x;a[16]=B;a[17]=A;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function e(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B){a=le(17);
a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=w;a[15]=x;a[16]=B;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function f(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x){a=le(16);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=w;a[15]=x;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function g(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w){a=le(15);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;
a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=w;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function h(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t){a=le(14);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function l(a,b,c,d,e,f,g,h,l,m,n,p,q,r){a=le(13);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function m(a,
b,c,d,e,f,g,h,l,m,n,p,q){a=le(12);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function n(a,b,c,d,e,f,g,h,l,m,n,p){a=le(11);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function p(a,b,c,d,e,f,g,h,l,m,n){a=le(10);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function q(a,
b,c,d,e,f,g,h,l,m){a=le(9);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function r(a,b,c,d,e,f,g,h,l){a=le(8);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function t(a,b,c,d,e,f,g,h){a=le(7);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function w(a,b,c,d,e,f,g){a=le(6);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;return Y.c?Y.c(this,
a,0):Y.call(null,this,a,0)}function x(a,b,c,d,e,f){a=le(5);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function B(a,b,c,d,e){a=le(4);a[0]=b;a[1]=c;a[2]=d;a[3]=e;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function D(a,b,c,d){a=le(3);a[0]=b;a[1]=c;a[2]=d;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function I(a,b,c){a=le(2);a[0]=b;a[1]=c;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function G(a,b){var c=le(1);c[0]=b;return Y.c?Y.c(this,c,0):Y.call(null,
this,c,0)}function ja(){var a=le(0);return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}var A=null,A=function(A,ea,O,V,T,X,fa,na,oa,qa,va,La,Aa,Da,Ha,Sa,Ta,Eb,Tb,Ec,wd,xd){switch(arguments.length){case 1:return ja.call(this);case 2:return G.call(this,0,ea);case 3:return I.call(this,0,ea,O);case 4:return D.call(this,0,ea,O,V);case 5:return B.call(this,0,ea,O,V,T);case 6:return x.call(this,0,ea,O,V,T,X);case 7:return w.call(this,0,ea,O,V,T,X,fa);case 8:return t.call(this,0,ea,O,V,T,X,fa,na);case 9:return r.call(this,
0,ea,O,V,T,X,fa,na,oa);case 10:return q.call(this,0,ea,O,V,T,X,fa,na,oa,qa);case 11:return p.call(this,0,ea,O,V,T,X,fa,na,oa,qa,va);case 12:return n.call(this,0,ea,O,V,T,X,fa,na,oa,qa,va,La);case 13:return m.call(this,0,ea,O,V,T,X,fa,na,oa,qa,va,La,Aa);case 14:return l.call(this,0,ea,O,V,T,X,fa,na,oa,qa,va,La,Aa,Da);case 15:return h.call(this,0,ea,O,V,T,X,fa,na,oa,qa,va,La,Aa,Da,Ha);case 16:return g.call(this,0,ea,O,V,T,X,fa,na,oa,qa,va,La,Aa,Da,Ha,Sa);case 17:return f.call(this,0,ea,O,V,T,X,fa,na,
oa,qa,va,La,Aa,Da,Ha,Sa,Ta);case 18:return e.call(this,0,ea,O,V,T,X,fa,na,oa,qa,va,La,Aa,Da,Ha,Sa,Ta,Eb);case 19:return d.call(this,0,ea,O,V,T,X,fa,na,oa,qa,va,La,Aa,Da,Ha,Sa,Ta,Eb,Tb);case 20:return c.call(this,0,ea,O,V,T,X,fa,na,oa,qa,va,La,Aa,Da,Ha,Sa,Ta,Eb,Tb,Ec);case 21:return b.call(this,0,ea,O,V,T,X,fa,na,oa,qa,va,La,Aa,Da,Ha,Sa,Ta,Eb,Tb,Ec,wd);case 22:return a.call(this,0,ea,O,V,T,X,fa,na,oa,qa,va,La,Aa,Da,Ha,Sa,Ta,Eb,Tb,Ec,wd,xd)}throw Error("Invalid arity: "+arguments.length);};A.b=ja;A.a=
G;A.c=I;A.o=D;A.A=B;A.aa=x;A.ba=w;A.ra=t;A.sa=r;A.ga=q;A.ha=p;A.ia=n;A.ja=m;A.ka=l;A.la=h;A.ma=g;A.na=f;A.oa=e;A.pa=d;A.qa=c;A.Kb=b;A.wb=a;return A}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ra(b)))};k.l=function(){var a=le(0);return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)};k.b=function(a){var b=le(1);b[0]=a;return Y.c?Y.c(this,b,0):Y.call(null,this,b,0)};k.a=function(a,b){var c=le(2);c[0]=a;c[1]=b;return Y.c?Y.c(this,c,0):Y.call(null,this,c,0)};
k.c=function(a,b,c){var d=le(3);d[0]=a;d[1]=b;d[2]=c;return Y.c?Y.c(this,d,0):Y.call(null,this,d,0)};k.o=function(a,b,c,d){var e=le(4);e[0]=a;e[1]=b;e[2]=c;e[3]=d;return Y.c?Y.c(this,e,0):Y.call(null,this,e,0)};k.A=function(a,b,c,d,e){var f=le(5);f[0]=a;f[1]=b;f[2]=c;f[3]=d;f[4]=e;return Y.c?Y.c(this,f,0):Y.call(null,this,f,0)};k.aa=function(a,b,c,d,e,f){var g=le(6);g[0]=a;g[1]=b;g[2]=c;g[3]=d;g[4]=e;g[5]=f;return Y.c?Y.c(this,g,0):Y.call(null,this,g,0)};
k.ba=function(a,b,c,d,e,f,g){var h=le(7);h[0]=a;h[1]=b;h[2]=c;h[3]=d;h[4]=e;h[5]=f;h[6]=g;return Y.c?Y.c(this,h,0):Y.call(null,this,h,0)};k.ra=function(a,b,c,d,e,f,g,h){var l=le(8);l[0]=a;l[1]=b;l[2]=c;l[3]=d;l[4]=e;l[5]=f;l[6]=g;l[7]=h;return Y.c?Y.c(this,l,0):Y.call(null,this,l,0)};k.sa=function(a,b,c,d,e,f,g,h,l){var m=le(9);m[0]=a;m[1]=b;m[2]=c;m[3]=d;m[4]=e;m[5]=f;m[6]=g;m[7]=h;m[8]=l;return Y.c?Y.c(this,m,0):Y.call(null,this,m,0)};
k.ga=function(a,b,c,d,e,f,g,h,l,m){var n=le(10);n[0]=a;n[1]=b;n[2]=c;n[3]=d;n[4]=e;n[5]=f;n[6]=g;n[7]=h;n[8]=l;n[9]=m;return Y.c?Y.c(this,n,0):Y.call(null,this,n,0)};k.ha=function(a,b,c,d,e,f,g,h,l,m,n){var p=le(11);p[0]=a;p[1]=b;p[2]=c;p[3]=d;p[4]=e;p[5]=f;p[6]=g;p[7]=h;p[8]=l;p[9]=m;p[10]=n;return Y.c?Y.c(this,p,0):Y.call(null,this,p,0)};
k.ia=function(a,b,c,d,e,f,g,h,l,m,n,p){var q=le(12);q[0]=a;q[1]=b;q[2]=c;q[3]=d;q[4]=e;q[5]=f;q[6]=g;q[7]=h;q[8]=l;q[9]=m;q[10]=n;q[11]=p;return Y.c?Y.c(this,q,0):Y.call(null,this,q,0)};k.ja=function(a,b,c,d,e,f,g,h,l,m,n,p,q){var r=le(13);r[0]=a;r[1]=b;r[2]=c;r[3]=d;r[4]=e;r[5]=f;r[6]=g;r[7]=h;r[8]=l;r[9]=m;r[10]=n;r[11]=p;r[12]=q;return Y.c?Y.c(this,r,0):Y.call(null,this,r,0)};
k.ka=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){var t=le(14);t[0]=a;t[1]=b;t[2]=c;t[3]=d;t[4]=e;t[5]=f;t[6]=g;t[7]=h;t[8]=l;t[9]=m;t[10]=n;t[11]=p;t[12]=q;t[13]=r;return Y.c?Y.c(this,t,0):Y.call(null,this,t,0)};k.la=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t){var w=le(15);w[0]=a;w[1]=b;w[2]=c;w[3]=d;w[4]=e;w[5]=f;w[6]=g;w[7]=h;w[8]=l;w[9]=m;w[10]=n;w[11]=p;w[12]=q;w[13]=r;w[14]=t;return Y.c?Y.c(this,w,0):Y.call(null,this,w,0)};
k.ma=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w){var x=le(16);x[0]=a;x[1]=b;x[2]=c;x[3]=d;x[4]=e;x[5]=f;x[6]=g;x[7]=h;x[8]=l;x[9]=m;x[10]=n;x[11]=p;x[12]=q;x[13]=r;x[14]=t;x[15]=w;return Y.c?Y.c(this,x,0):Y.call(null,this,x,0)};k.na=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x){var B=le(17);B[0]=a;B[1]=b;B[2]=c;B[3]=d;B[4]=e;B[5]=f;B[6]=g;B[7]=h;B[8]=l;B[9]=m;B[10]=n;B[11]=p;B[12]=q;B[13]=r;B[14]=t;B[15]=w;B[16]=x;return Y.c?Y.c(this,B,0):Y.call(null,this,B,0)};
k.oa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B){var D=le(18);D[0]=a;D[1]=b;D[2]=c;D[3]=d;D[4]=e;D[5]=f;D[6]=g;D[7]=h;D[8]=l;D[9]=m;D[10]=n;D[11]=p;D[12]=q;D[13]=r;D[14]=t;D[15]=w;D[16]=x;D[17]=B;return Y.c?Y.c(this,D,0):Y.call(null,this,D,0)};k.pa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D){var I=le(19);I[0]=a;I[1]=b;I[2]=c;I[3]=d;I[4]=e;I[5]=f;I[6]=g;I[7]=h;I[8]=l;I[9]=m;I[10]=n;I[11]=p;I[12]=q;I[13]=r;I[14]=t;I[15]=w;I[16]=x;I[17]=B;I[18]=D;return Y.c?Y.c(this,I,0):Y.call(null,this,I,0)};
k.qa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,I){var G=le(20);G[0]=a;G[1]=b;G[2]=c;G[3]=d;G[4]=e;G[5]=f;G[6]=g;G[7]=h;G[8]=l;G[9]=m;G[10]=n;G[11]=p;G[12]=q;G[13]=r;G[14]=t;G[15]=w;G[16]=x;G[17]=B;G[18]=D;G[19]=I;return Y.c?Y.c(this,G,0):Y.call(null,this,G,0)};k.Kb=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,I,G){a=le(oe.a(new R(null,20,5,S,[a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,B,D,I],null),G));return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)};k.O=function(){return this.S};
k.Y=function(){return 2+M(this.G)};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Wd(this)};k.C=function(a,b){var c;c=y(b)?(c=this.constructor===b.constructor)?Ff(this,b):c:b;return y(c)?!0:!1};k.ib=function(a,b){return Dd(new ug(null,new v(null,2,[xi,null,vj,null],null),null),b)?ld.a(Mc(Ze.a(ye,this),this.S),b):new pk(this.va,this.rb,this.S,te(ld.a(this.G,b)),null)};
k.Oa=function(a,b,c){return y(Q.a?Q.a(vj,b):Q.call(null,vj,b))?new pk(c,this.rb,this.S,this.G,null):y(Q.a?Q.a(xi,b):Q.call(null,xi,b))?new pk(this.va,c,this.S,this.G,null):new pk(this.va,this.rb,this.S,jd.c(this.G,b,c),null)};k.U=function(){return H(oe.a(new R(null,2,5,S,[new R(null,2,5,S,[vj,this.va],null),new R(null,2,5,S,[xi,this.rb],null)],null),this.G))};k.P=function(a,b){return new pk(this.va,this.rb,b,this.G,this.u)};
k.X=function(a,b){return sd(b)?jb(this,bb.a(b,0),bb.a(b,1)):Ua.c($a,this,b)};function qk(a,b){return new pk(a,b,null,null,null)}function Y(a,b,c){return new nk(a.va,b,c,null,null,null)}function rk(a){return new v(null,2,[Qi,null!=a&&a.yb?function(a,c,d){return a.zb(null,c,d)}:dk,Lh,null!=a&&a.yb?function(a,c,d){return a.Ab(null,c,d)}:ek],null)}function sk(a){return new v(null,1,[Zi,null!=a&&a.Jc?function(a,c){return a.rc(0,c)}:gk],null)}
function tk(a){var b=function(b){return function(d,e,f,g,h){f=ed.a(f,b.a?b.a(a,g):b.call(null,a,g));return h.o?h.o(d,e,f,g):h.call(null,d,e,f,g)}}(Zi.b(sk(a)));return ok(mk(jk,b,b))}function uk(a){var b=rk(a),c=Qi.b(b),d=Lh.b(b);return ok(mk(kk,function(b,c){return function(b,d){return c.c?c.c(a,b,d):c.call(null,a,b,d)}}(b,c,d),function(b,c,d){return function(b,c){return d.c?d.c(a,b,c):d.call(null,a,b,c)}}(b,c,d)))}
var vk=function vk(b){if(null!=b&&null!=b.lb)return b.lb(b);var c=vk[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=vk._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("CoercePath.coerce-path",b);};vk["null"]=function(){return uk(null)};nk.prototype.lb=function(){return this};pk.prototype.lb=function(){return this};R.prototype.lb=function(){return hk(this)};wc.prototype.lb=function(){return vk(Gd(this))};$d.prototype.lb=function(){return vk(Gd(this))};Yc.prototype.lb=function(){return vk(Gd(this))};
vk._=function(a){var b;b=(b=(b=ca(a))?b:null!=a?a.Pc?!0:a.ec?!1:Na(Va,a):Na(Va,a))?b:null!=a?a.yb?!0:a.ec?!1:Na(ck,a):Na(ck,a);if(y(b))a=uk(a);else if(null!=a?a.Jc||(a.ec?0:Na(fk,a)):Na(fk,a))a=tk(a);else throw b=uc,a=[C("Protocol implementation cannot be found for object.\n        Extending Specter protocols should not be done inline in a deftype definition\n        because that prevents Specter from finding the protocol implementations for\n        optimized performance. Instead, you should extend the protocols via an\n        explicit extend-protocol call. \n"),
C(a)].join(""),a=b([a],0),Error(E.a(C,a));return a};function wk(a){return a.Ka.type}
function xk(a){var b=N(a,0),c=Sd(a,1),d=b.Ka,e=d.type,f=lc.a(e,vh)?function(a,b,c,d,e,f){return function(q,r){return function(a,b,c,d,e,f){return function(g,h,l,m,n){var p=function(){return function(a,b,c,d){return r.A?r.A(a,b,c,d,n):r.call(null,a,b,c,d,n)}}(g,h,l,m,a,b,c,d,e,f);return q.A?q.A(g,h,l,m,p):q.call(null,g,h,l,m,p)}}(a,b,c,d,e,f)}}(d,e,a,b,c,a):function(a,b,c,d,e,f){return function(q,r){return function(a,b,c,d,e,f){return function(g,h){var l=function(){return function(a){return r.a?r.a(a,
h):r.call(null,a,h)}}(g,a,b,c,d,e,f);return q.a?q.a(g,l):q.call(null,g,l)}}(a,b,c,d,e,f)}}(d,e,a,b,c,a);return Ua.a(function(a,b,c){return function(b,d){return mk(a,function(){var a=b.La,e=d.La;return c.a?c.a(a,e):c.call(null,a,e)}(),function(){var a=b.Ma,e=d.Ma;return c.a?c.a(a,e):c.call(null,a,e)}())}}(d,e,f,a,b,c,a),a)}
function yk(a){if(lc.a(wk(a),vh))return a;var b=a.La;a=a.Ma;return mk(jk,function(a,b){return function(e,f,g,h,l){var m=function(){return function(a){return l.o?l.o(e,f,g,a):l.call(null,e,f,g,a)}}(h,a,b);return a.a?a.a(h,m):a.call(null,h,m)}}(b,a),function(a,b){return function(e,f,g,h,l){var m=function(){return function(a){return l.o?l.o(e,f,g,a):l.call(null,e,f,g,a)}}(h,a,b);return b.a?b.a(h,m):b.call(null,h,m)}}(b,a))}
function zk(a){if(a instanceof nk){var b=fi.b(a),c=Di.b(a),d=sh.b(vj.b(a)),e=zh.b(vj.b(a));return od(b)?a:ok(mk(jk,function(a,b,c,d){return function(e,n,p,q,r){var t=function(){return function(a,b,c,d){return r.o?r.o(e,n,c,d):r.call(null,e,n,c,d)}}(a,b,p,q,a,b,c,d);return c.A?c.A(a,b,p,q,t):c.call(null,a,b,p,q,t)}}(b,c,d,e),function(a,b,c,d){return function(e,n,p,q,r){var t=function(){return function(a,b,c,d){return r.o?r.o(e,n,c,d):r.call(null,e,n,c,d)}}(a,b,p,q,a,b,c,d);return d.A?d.A(a,b,p,q,t):
d.call(null,a,b,p,q,t)}}(b,c,d,e)))}return a}hk["null"]=function(a){return vk(a)};hk._=function(a){return vk(a)};R.prototype.Gc=function(){if(od(this))return vk(null);var a=P.a(zk,P.a(vk,this)),b=P.a(xk,Bg(wk,P.a(vj,a))),c=lc.a(1,M(b))?J(b):xk(P.a(yk,b)),a=Xe(function(){return function(a){return a instanceof pk}}(a,b,c,this),a);return od(a)?ok(c):qk(yk(c),Ua.a(Jd,P.a(xi,a)))};function Ak(a){return a instanceof nk?0:xi.b(a)}
var Bk=function Bk(b,c){if(null!=b&&null!=b.Hc)return b.Hc(0,c);var d=Bk[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Bk._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Oa("SetExtremes.set-first",b);},Ck=function Ck(b,c){if(null!=b&&null!=b.Ic)return b.Ic(0,c);var d=Ck[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Ck._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Oa("SetExtremes.set-last",b);};
R.prototype.Hc=function(a,b){return jd.c(this,0,b)};R.prototype.Ic=function(a,b){return jd.c(this,M(this)-1,b)};Bk._=function(a,b){return Wc(b,xc(a))};Ck._=function(a,b){var c=wg(a);return ed.a(Gd(c),b)};function Dk(a,b){var c=a.va;return c.Ka.sd.call(null,a.Xa,a.Ya,c.La,b)}function Ek(a,b,c){var d=a.va;return d.Ka.ud.call(null,a.Xa,a.Ya,d.Ma,b,c)}function Fk(){}Fk.prototype.yb=!0;Fk.prototype.zb=function(a,b,c){return Ze.a(fd,ak(c,b))};
Fk.prototype.Ab=function(a,b,c){a=null==b?null:Ya(b);if(Zd(a))for(c=b=P.a(c,b);;)if(H(c))c=K(c);else break;else b=Ze.a(a,Zj(c,b));return b};function Gk(){}Gk.prototype.Jc=!0;Gk.prototype.rc=function(a,b){return b};function Hk(a,b){this.Lc=a;this.td=b}Hk.prototype.yb=!0;Hk.prototype.zb=function(a,b,c){if(od(b))return null;a=this.Lc.call(null,b);return c.b?c.b(a):c.call(null,a)};
Hk.prototype.Ab=function(a,b,c){var d=this;return od(b)?b:d.td.call(null,b,function(){var a=d.Lc.call(null,b);return c.b?c.b(a):c.call(null,a)}())};function Ik(a,b,c,d){a=yf.c(Gd(a),b,c);return d.b?d.b(a):d.call(null,a)}function Jk(a,b,c,d){var e=Gd(a),f=yf.c(e,b,c);d=d.b?d.b(f):d.call(null,f);b=oe.j(yf.c(e,0,b),d,uc([yf.c(e,c,M(a))],0));return sd(a)?Gd(b):b}ck["null"]=!0;dk["null"]=function(a,b,c){return c.b?c.b(b):c.call(null,b)};ek["null"]=function(a,b,c){return c.b?c.b(b):c.call(null,b)};
function Kk(a,b,c){return y(a.b?a.b(b):a.call(null,b))?c.b?c.b(b):c.call(null,b):null}function Lk(a,b,c){return y(a.b?a.b(b):a.call(null,b))?c.b?c.b(b):c.call(null,b):b};function Mk(a){return hk(Gd(a))}function Nk(a,b){var c=hk(a);return Dk.a?Dk.a(c,b):Dk.call(null,c,b)}function Ok(a,b,c){a=hk(a);return Ek.c?Ek.c(a,b,c):Ek.call(null,a,b,c)}var Pk=Mk(uc([new Fk],0)),Qk=new Gk,Rk=Mk(uc([new Hk(dd,Ck)],0));Mk(uc([new Hk(J,Bk)],0));
var Sk=qk(mk(jk,function(a,b,c,d,e){var f=a[b+0],g=a[b+1];return Ik(d,f.b?f.b(d):f.call(null,d),g.b?g.b(d):g.call(null,d),function(d){var f=b+2;return e.o?e.o(a,f,c,d):e.call(null,a,f,c,d)})},function(a,b,c,d,e){var f=a[b+0],g=a[b+1];return Jk(d,f.b?f.b(d):f.call(null,d),g.b?g.b(d):g.call(null,d),function(d){var f=b+2;return e.o?e.o(a,f,c,d):e.call(null,a,f,c,d)})}),2),Tk=qk(mk(jk,function(a,b,c,d,e){return Ik(d,a[b+0],a[b+1],function(d){var g=b+2;return e.o?e.o(a,g,c,d):e.call(null,a,g,c,d)})},function(a,
b,c,d,e){return Jk(d,a[b+0],a[b+1],function(d){var g=b+2;return e.o?e.o(a,g,c,d):e.call(null,a,g,c,d)})}),2);Tk.a?Tk.a(0,0):Tk.call(null,0,0);Sk.a?Sk.a(M,M):Sk.call(null,M,M);z.prototype.yb=!0;z.prototype.zb=function(a,b,c){a=F.a(b,this);return c.b?c.b(a):c.call(null,a)};z.prototype.Ab=function(a,b,c){var d=this;return jd.c(b,d,function(){var a=F.a(b,d);return c.b?c.b(a):c.call(null,a)}())};ck["function"]=!0;dk["function"]=function(a,b,c){return Kk(a,b,c)};
ek["function"]=function(a,b,c){return Lk(a,b,c)};ug.prototype.yb=!0;ug.prototype.zb=function(a,b,c){return Kk(this,b,c)};ug.prototype.Ab=function(a,b,c){return Lk(this,b,c)};var Uk=qk(mk(jk,function(a,b,c,d,e){var f=a[b+0];d=y(d)?d:f;b+=1;return e.o?e.o(a,b,c,d):e.call(null,a,b,c,d)},function(a,b,c,d,e){var f=a[b+0];d=y(d)?d:f;b+=1;return e.o?e.o(a,b,c,d):e.call(null,a,b,c,d)}),1);Uk.b?Uk.b(vg):Uk.call(null,vg);var Vk=yc;Uk.b?Uk.b(Vk):Uk.call(null,Vk);Uk.b?Uk.b(fd):Uk.call(null,fd);
function Wk(){var a=uc([Jj],0),b=P.a(hk,new R(null,1,5,S,[a],null)),c=P.a(Ak,b),d=Wc(0,Cg(c)),e=dd(d),f=P.c(function(a,b,c,d){return function(e,f){return y(f instanceof nk)?function(){return function(){return f}}(a,b,c,d):function(){return function(a,b){return Y(f,a,b+e)}}(a,b,c,d)}}(b,c,d,e),d,b),g=N(f,0),a=function(){var a=function(a,b,c,d,e,f,g){return function(a,b,c,e,f){var h;h=g.a?g.a(a,b):g.call(null,a,b);var l=Dk.a?Dk.a(h,e):Dk.call(null,h,e);if(1<M(l))throw a=uc(["More than one element found for params: ",
h,e],0),Error(E.a(C,a));h=J(l);b+=d;c=ed.a(c,h);return f.o?f.o(a,b,c,e):f.call(null,a,b,c,e)}}(b,c,d,e,f,f,g);return qk(mk(jk,a,a),e)}();return lc.a(0,e)?Y(a,null,0):a};var Xk=new v(null,3,[$h,2,Dh,4,hj,1],null),Yk=new v(null,3,[$h,-1,Dh,0,hj,0],null),Zk=new v(null,3,[$h,40,Dh,40,hj,0],null);function $k(a,b){var c=P.a(Ee.a(Xk,ii),b),d=a/Ua.a(Jd,c);return P.a(Fe(Kd,d),c)}function al(a,b,c){return ed.a(b,function(){var d=null==b?null:qb(b);return a.a?a.a(d,c):a.call(null,d,c)}())}function bl(a,b){var c=null!=a&&(a.g&64||a.F)?E.a(Jc,a):a,c=F.a(c,ii),c=b-(Zk.b?Zk.b(c):Zk.call(null,c));return c-Pd(c,20)}
function cl(a,b){var c=null!=a&&(a.g&64||a.F)?E.a(Jc,a):a,d=F.a(c,Zh),e=F.a(c,Mj),f=$k(e,b);return P.j(function(a,b,c,d){return function(a,b,c,e){a=null!=a&&(a.g&64||a.F)?E.a(Jc,a):a;c=F.a(a,ii);b=new v(null,5,[mh,b+(Yk.b?Yk.b(c):Yk.call(null,c)),Zh,d,cj,e,Fh,e,bi,-30],null);return rg.j(uc([a,b],0))}}(f,a,c,d,e),b,Ua.c(Fe(al,Jd),new R(null,1,5,S,[0],null),f),f,uc([P.c(bl,b,f)],0))}
function dl(a,b){var c=null!=a&&(a.g&64||a.F)?E.a(Jc,a):a,d=F.a(c,Zh),e=F.a(c,Mj),f=F.a(c,sj),g=M(b),h=d/g;return P.c(function(a,b,c,d,e,f){return function(a,c){var d=new v(null,3,[sj,a,Zh,b-30,Mj,f],null),d=null!=d&&(d.g&64||d.F)?E.a(Jc,d):d,e=F.a(d,Zh),g=F.a(d,Mj),h=null!=c&&(c.g&64||c.F)?E.a(Jc,c):c;F.a(h,Gh);return bf(rg.j(uc([h,d],0)),Gh,Fe(cl,new v(null,2,[Zh,e,Mj,g],null)))}}(g,h,a,c,d,e,f),Oe(g,Se(Fe(Jd,h),f)),b)};function el(a){return lc.a(Dh,ii.b(a))}function fl(a){return Ok(new R(null,8,5,S,[Sh,Pk,Gh,Pk,function(a){return uj.b(a)},Ij,Rk,Yh],null),De(!0),a)}if("undefined"===typeof gl)var gl=function(){var a=U.b?U.b(ye):U.call(null,ye),b=U.b?U.b(ye):U.call(null,ye),c=U.b?U.b(ye):U.call(null,ye),d=U.b?U.b(ye):U.call(null,ye),e=F.c(ye,Aj,Zg());return new jh(tc.a("pennygame.updates","capacity"),function(){return function(a,b){var c=null!=b&&(b.g&64||b.F)?E.a(Jc,b):b;return F.a(c,ii)}}(a,b,c,d,e),Qh,e,a,b,c,d)}();
lh(gl,oi,function(a){return a});lh(gl,zi,function(a){switch(a){case 1:return 4;case 2:return 4;case 3:return 4;case 4:return 4;case 5:return 5;case 6:return 6;default:throw Error([C("No matching clause: "),C(a)].join(""));}});lh(gl,li,function(a,b,c){a=null!=b&&(b.g&64||b.F)?E.a(Jc,b):b;a=F.a(a,rh);return af(Gd(c),new R(null,2,5,S,[a,Hh],null))});function hl(a,b){return Ok(new R(null,4,5,S,[Sh,Pk,Gh,Pk],null),b,a)}function il(a,b){return Gd(P.c(function(a,b){return jd.c(a,Th,b)},a,b))}
function jl(a,b){return cf(a,ef,il,b)}function kl(a,b){return Ok(new R(null,6,5,S,[Sh,Pk,Gh,Qk,Pk,function(a){return Dd(a,yh)}],null),function(a,d){var e=null!=d&&(d.g&64||d.F)?E.a(Jc,d):d,f=F.a(e,yh),g=F.a(e,Kj);F.a(e,Ij);f=af(b,new R(null,2,5,S,[f,Th],null));g=gl.c?gl.c(f,g,a):gl.call(null,f,g,a);return jd.c(e,Hh,g)},a)}
function ll(a,b){return Ok(new R(null,7,5,S,[Sh,Pk,Gh,Qk,Pk,function(a){return Dd(a,yh)},function(a){return lc.a(li,af(a,new R(null,2,5,S,[Kj,ii],null)))}],null),function(a,d){var e=null!=d&&(d.g&64||d.F)?E.a(Jc,d):d,f=F.a(e,yh),g=F.a(e,Kj);F.a(e,Ij);f=af(b,new R(null,2,5,S,[f,Th],null));g=gl.c?gl.c(f,g,a):gl.call(null,f,g,a);return jd.c(e,Hh,g)},a)}function ml(a){var b=a.b?a.b(ef):a.call(null,ef);return ll(kl(a,b),b)}
if("undefined"===typeof nl){var nl,ol=U.b?U.b(ye):U.call(null,ye),pl=U.b?U.b(ye):U.call(null,ye),ql=U.b?U.b(ye):U.call(null,ye),rl=U.b?U.b(ye):U.call(null,ye),sl=F.c(ye,Aj,Zg());nl=new jh(tc.a("pennygame.updates","process"),ii,Qh,sl,ol,pl,ql,rl)}lh(nl,Qh,function(a){a=null!=a&&(a.g&64||a.F)?E.a(Jc,a):a;var b=F.a(a,Hh),c=F.a(a,Ij);return jd.j(a,Ij,Pe(b,c),uc([rj,Oe(b,c)],0))});lh(nl,$h,function(a){a=null!=a&&(a.g&64||a.F)?E.a(Jc,a):a;var b=F.a(a,Hh);return jd.c(a,rj,Oe(b,Qe(ye)))});
function tl(a){var b=J(Nk(new R(null,4,5,S,[Gh,Pk,function(a){return gj.b(a)},gj],null),a));return Ok(new R(null,6,5,S,[Gh,function(){var a=b+1;return Tk.a?Tk.a(b,a):Tk.call(null,b,a)}(),Pk,rj,Rk,Yh],null),De(!0),a)}function ul(a){return Be(Yh,Nk(new R(null,4,5,S,[Pk,function(a){return gj.b(a)},rj,Pk],null),a))}function vl(a){return y(ul(a.b?a.b(Gh):a.call(null,Gh)))?tl(a):a}
function wl(a){return Ok(new R(null,2,5,S,[Sh,Pk],null),vl,Ok(new R(null,5,5,S,[Sh,Pk,Gh,Pk,function(a){return F.a(a,Hh)}],null),nl,a))}function xl(a){var b=E.c(Od,16.5,P.a(function(a){var b=null!=a&&(a.g&64||a.F)?E.a(Jc,a):a;a=F.a(b,dj);var e=F.a(b,Jj),b=F.a(b,Ij);return a/(M(e)+M(b))},Nk(new R(null,5,5,S,[Sh,Pk,Gh,Pk,el],null),a)));return Ok(new R(null,5,5,S,[Sh,Pk,Gh,Pk,el],null),function(a){return function(b){return cf(b,oh,Od,a)}}(b),a)}
function yl(a){return Ok(new R(null,6,5,S,[Sh,Pk,Gh,Qk,Pk,function(a){return Dd(a,ph)}],null),function(a,c){var d=null!=c&&(c.g&64||c.F)?E.a(Jc,c):c,e=F.a(d,ph);return jd.c(d,Jj,af(Gd(a),new R(null,2,5,S,[e,rj],null)))},a)}function zl(a){return Ok(new R(null,6,5,S,[Sh,Pk,Gh,Pk,Wk(),Ij],null),function(a,c){return oe.a(c,a)},a)}
function Al(a,b){var c=null!=a&&(a.g&64||a.F)?E.a(Jc,a):a,c=F.a(c,Gh),d=null!=b&&(b.g&64||b.F)?E.a(Jc,b):b,e=F.c(d,wh,0),f=F.c(d,Ph,new R(null,2,5,S,[0,0],null)),d=F.a(d,gi),g=E.c(P,Jd,P.a(Eg(Ee.a(M,rj),Hh),Nk(new R(null,2,5,S,[Pk,el],null),c))),h=M(rj.b(dd(wg(c)))),l=Ua.a(Jd,P.a(M,Nk(new R(null,3,5,S,[Pk,el,Ij],null),c))),f=P.c(Jd,f,g);return new v(null,5,[pi,l,wh,y(ul(c))?e+1:e,gi,d+h,Ph,f,Fi,E.a(Ld,f)],null)}
function Bl(a){return Ok(new R(null,4,5,S,[Sh,Pk,Qk,Eh],null),function(a,c){return ed.a(c,Al(a,null==c?null:qb(c)))},a)};function Cl(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;return Dl(0<b.length?new wc(b.slice(0),0):null)}function Dl(a){return rg.j(uc([new v(null,2,[Th,0,ii,Dh],null),E.a(Jc,a)],0))}function El(a){return rg.j(uc([new v(null,8,[Si,Qg("station"),ii,Dh,Jj,fd,Ij,Oe(4,Qe(ye)),rj,fd,Hh,null,Kj,new v(null,1,[ii,oi],null),oh,999999],null),E.a(Jc,a)],0))}
function Fl(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;return Gl(0<b.length?new wc(b.slice(0),0):null)}function Gl(a){return rg.j(uc([new v(null,2,[Eh,fd,Gh,fd],null),E.a(Jc,a)],0))}
var Hl=new R(null,5,5,S,[Dl(uc([ii,$h],0)),Cl(),Cl(),Cl(),Cl()],null),Il=Gl(uc([Ah,Ui,Gh,new R(null,6,5,S,[El(uc([ii,$h,yh,0],0)),El(uc([ph,0,yh,1,uj,!0],0)),El(uc([ph,1,yh,2],0)),El(uc([ph,2,yh,3],0)),El(uc([ph,3,yh,4,gj,0],0)),El(uc([ii,hj,ph,4],0))],null)],0)),Jl=Gl(uc([Ah,Uh,Gh,new R(null,6,5,S,[El(uc([ii,$h,yh,0,Kj,new v(null,1,[ii,zi],null)],0)),El(uc([ph,0,yh,1,Kj,new v(null,1,[ii,zi],null),uj,!0],0)),El(uc([ph,1,yh,2,Kj,new v(null,1,[ii,zi],null)],0)),El(uc([ph,2,yh,3],0)),El(uc([ph,3,yh,
4,Kj,new v(null,1,[ii,zi],null),gj,0],0)),El(uc([ii,hj,ph,4],0))],null)],0)),Kl=Gl(uc([Ah,Vi,Gh,new R(null,6,5,S,[El(uc([ii,$h,yh,0,Kj,new v(null,2,[ii,li,rh,3],null)],0)),El(uc([ph,0,yh,1,Kj,new v(null,1,[ii,zi],null),uj,!0],0)),El(uc([ph,1,yh,2,Kj,new v(null,1,[ii,zi],null)],0)),El(uc([ph,2,yh,3],0)),El(uc([ph,3,yh,4,Kj,new v(null,1,[ii,zi],null),gj,0],0)),El(uc([ii,hj,ph,4],0))],null)],0)),Ll=new v(null,5,[mj,new v(null,3,[Fj,0,ef,Hl,Sh,new R(null,3,5,S,[Il,Fl(),Fl()],null)],null),Jh,new v(null,
3,[Fj,0,ef,Hl,Sh,new R(null,3,5,S,[Fl(),Jl,Fl()],null)],null),li,new v(null,3,[Fj,0,ef,Hl,Sh,new R(null,3,5,S,[Fl(),Fl(),Kl],null)],null),Oh,new v(null,3,[Fj,0,ef,Hl,Sh,new R(null,3,5,S,[Il,Jl,Fl()],null)],null),ni,new v(null,3,[Fj,0,ef,Hl,Sh,new R(null,3,5,S,[Il,Jl,Kl],null)],null)],null);function Ml(a){return Bl(zl(yl(wl(ml(jl(bf(a,Fj,Nc),Re(function(){return 6*Math.random()+1|0})))))))}function Nl(a){a:for(var b=ye,c=H(new R(null,4,5,S,[pi,gi,wh,Fi],null));;)if(c)var d=J(c),e=F.c(a,d,Pj),b=lc.a(e,Pj)?b:jd.c(b,d,e),c=K(c);else{a=Mc(b,nd(a));break a}return a}var Ol=new v(null,3,[Fj,0,ef,Hl,Sh,new R(null,3,5,S,[Il,Jl,Kl],null)],null);function Pl(a){return xg(new R(null,3,5,S,[mj,Jh,li],null),P.a(Ee.a(function(a){return P.a(Nl,a)},Eh),Sh.b(a)))}
function Ql(a,b){return xg(Nf(b),P.a(a,Of(b)))}var Rl=function Rl(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Rl.j(arguments[0],1<c.length?new wc(c.slice(1),0):null)};Rl.j=function(a,b){return Ql(function(b){return E.a(a,b)},Ql(function(a){return P.a(Vd,a)},Xg(Ud,E.a(oe,b))))};Rl.w=1;Rl.D=function(a){var b=J(a);a=K(a);return Rl.j(b,a)};function Sl(a){return Ql(function(a){return E.c(P,xf,a)},Ql(function(a){return P.a(Vd,a)},Xg(Ud,E.a(oe,a))))}
function Tl(a){var b=function(){var b=Pl(a);return U.b?U.b(b):U.call(null,b)}(),c=U.b?U.b(1):U.call(null,1),d=function(a,b){return function(a,c){return((L.b?L.b(b):L.call(null,b))*a+c)/((L.b?L.b(b):L.call(null,b))+1)}}(b,c);return function(a,b,c,d){return function(l){l=Ql(function(a,b,c,d,e){return function(a){return P.a(e,a)}}(a,a,b,c,d),Sl(uc([L.b?L.b(a):L.call(null,a),Pl(l)],0)));Le.a?Le.a(a,l):Le.call(null,a,l);Me.a(b,Nc);return L.b?L.b(a):L.call(null,a)}}(b,c,d,function(a,b,c){return function(a){return E.c(Rl,
c,a)}}(b,c,d))};var Ul;a:{var Vl=aa.navigator;if(Vl){var Wl=Vl.userAgent;if(Wl){Ul=Wl;break a}}Ul=""};var Xl,Yl=function Yl(b,c){if(null!=b&&null!=b.pc)return b.pc(0,c);var d=Yl[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Yl._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Oa("ReadPort.take!",b);},Zl=function Zl(b,c,d){if(null!=b&&null!=b.dc)return b.dc(0,c,d);var e=Zl[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Zl._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Oa("WritePort.put!",b);},$l=function $l(b){if(null!=b&&null!=b.cc)return b.cc();
var c=$l[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=$l._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("Channel.close!",b);},am=function am(b){if(null!=b&&null!=b.Ec)return!0;var c=am[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=am._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("Handler.active?",b);},bm=function bm(b){if(null!=b&&null!=b.Fc)return b.Fa;var c=bm[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=bm._;if(null!=c)return c.b?
c.b(b):c.call(null,b);throw Oa("Handler.commit",b);},cm=function cm(b,c){if(null!=b&&null!=b.Dc)return b.Dc(0,c);var d=cm[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=cm._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Oa("Buffer.add!*",b);},dm=function dm(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return dm.b(arguments[0]);case 2:return dm.a(arguments[0],arguments[1]);default:throw Error([C("Invalid arity: "),
C(c.length)].join(""));}};dm.b=function(a){return a};dm.a=function(a,b){return cm(a,b)};dm.w=2;var em,fm=function fm(b){"undefined"===typeof em&&(em=function(b,d,e){this.sc=b;this.Fa=d;this.ld=e;this.g=393216;this.B=0},em.prototype.P=function(b,d){return new em(this.sc,this.Fa,d)},em.prototype.O=function(){return this.ld},em.prototype.Ec=function(){return!0},em.prototype.Fc=function(){return this.Fa},em.ic=function(){return new R(null,3,5,S,[Mc(Bj,new v(null,2,[Ih,!0,we,jc(xe,jc(new R(null,1,5,S,[Tj],null)))],null)),Tj,ra.Fd],null)},em.xb=!0,em.eb="cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers22073",
em.Tb=function(b,d){return Jb(d,"cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers22073")});return new em(fm,b,ye)};function gm(a){try{return a[0].call(null,a)}catch(b){throw b instanceof Object&&a[6].cc(),b;}}function hm(a,b,c){c=c.pc(0,fm(function(c){a[2]=c;a[1]=b;return gm(a)}));return y(c)?(a[2]=L.b?L.b(c):L.call(null,c),a[1]=b,W):null}function im(a,b,c,d){c=c.dc(0,d,fm(function(c){a[2]=c;a[1]=b;return gm(a)}));return y(c)?(a[2]=L.b?L.b(c):L.call(null,c),a[1]=b,W):null}
function jm(a,b){var c=a[6];null!=b&&c.dc(0,b,fm(function(){return function(){return null}}(c)));c.cc();return c}function km(a,b,c,d,e,f,g,h){this.Sa=a;this.Ta=b;this.Va=c;this.Ua=d;this.Za=e;this.S=f;this.G=g;this.u=h;this.g=2229667594;this.B=8192}k=km.prototype;k.N=function(a,b){return hb.c(this,b,null)};
k.I=function(a,b,c){switch(b instanceof z?b.Ha:null){case "catch-block":return this.Sa;case "catch-exception":return this.Ta;case "finally-block":return this.Va;case "continue-block":return this.Ua;case "prev":return this.Za;default:return F.c(this.G,b,c)}};
k.M=function(a,b,c){return tf(b,function(){return function(a){return tf(b,uf,""," ","",c,a)}}(this),"#cljs.core.async.impl.ioc-helpers.ExceptionFrame{",", ","}",c,oe.a(new R(null,5,5,S,[new R(null,2,5,S,[ji,this.Sa],null),new R(null,2,5,S,[Xi,this.Ta],null),new R(null,2,5,S,[Rh,this.Va],null),new R(null,2,5,S,[ej,this.Ua],null),new R(null,2,5,S,[aj,this.Za],null)],null),this.G))};k.Ga=function(){return new Gf(0,this,5,new R(null,5,5,S,[ji,Xi,Rh,ej,aj],null),bc(this.G))};k.O=function(){return this.S};
k.Y=function(){return 5+M(this.G)};k.T=function(){var a=this.u;return null!=a?a:this.u=a=Wd(this)};k.C=function(a,b){var c;c=y(b)?(c=this.constructor===b.constructor)?Ff(this,b):c:b;return y(c)?!0:!1};k.ib=function(a,b){return Dd(new ug(null,new v(null,5,[Rh,null,ji,null,Xi,null,aj,null,ej,null],null),null),b)?ld.a(Mc(Ze.a(ye,this),this.S),b):new km(this.Sa,this.Ta,this.Va,this.Ua,this.Za,this.S,te(ld.a(this.G,b)),null)};
k.Oa=function(a,b,c){return y(Q.a?Q.a(ji,b):Q.call(null,ji,b))?new km(c,this.Ta,this.Va,this.Ua,this.Za,this.S,this.G,null):y(Q.a?Q.a(Xi,b):Q.call(null,Xi,b))?new km(this.Sa,c,this.Va,this.Ua,this.Za,this.S,this.G,null):y(Q.a?Q.a(Rh,b):Q.call(null,Rh,b))?new km(this.Sa,this.Ta,c,this.Ua,this.Za,this.S,this.G,null):y(Q.a?Q.a(ej,b):Q.call(null,ej,b))?new km(this.Sa,this.Ta,this.Va,c,this.Za,this.S,this.G,null):y(Q.a?Q.a(aj,b):Q.call(null,aj,b))?new km(this.Sa,this.Ta,this.Va,this.Ua,c,this.S,this.G,
null):new km(this.Sa,this.Ta,this.Va,this.Ua,this.Za,this.S,jd.c(this.G,b,c),null)};k.U=function(){return H(oe.a(new R(null,5,5,S,[new R(null,2,5,S,[ji,this.Sa],null),new R(null,2,5,S,[Xi,this.Ta],null),new R(null,2,5,S,[Rh,this.Va],null),new R(null,2,5,S,[ej,this.Ua],null),new R(null,2,5,S,[aj,this.Za],null)],null),this.G))};k.P=function(a,b){return new km(this.Sa,this.Ta,this.Va,this.Ua,this.Za,b,this.G,this.u)};k.X=function(a,b){return sd(b)?jb(this,bb.a(b,0),bb.a(b,1)):Ua.c($a,this,b)};
function lm(a){for(;;){var b=a[4],c=ji.b(b),d=Xi.b(b),e=a[5];if(y(function(){var a=e;return y(a)?Ma(b):a}()))throw e;if(y(function(){var a=e;return y(a)?(a=c,y(a)?e instanceof d:a):a}())){a[1]=c;a[2]=e;a[5]=null;a[4]=jd.j(b,ji,null,uc([Xi,null],0));break}if(y(function(){var a=e;return y(a)?Ma(c)&&Ma(Rh.b(b)):a}()))a[4]=aj.b(b);else{if(y(function(){var a=e;return y(a)?(a=Ma(c))?Rh.b(b):a:a}())){a[1]=Rh.b(b);a[4]=jd.c(b,Rh,null);break}if(y(function(){var a=Ma(e);return a?Rh.b(b):a}())){a[1]=Rh.b(b);
a[4]=jd.c(b,Rh,null);break}if(Ma(e)&&Ma(Rh.b(b))){a[1]=ej.b(b);a[4]=aj.b(b);break}throw Error("No matching clause");}}};function mm(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function nm(a,b,c,d){this.head=a;this.R=b;this.length=c;this.f=d}nm.prototype.pop=function(){if(0===this.length)return null;var a=this.f[this.R];this.f[this.R]=null;this.R=(this.R+1)%this.f.length;--this.length;return a};nm.prototype.unshift=function(a){this.f[this.head]=a;this.head=(this.head+1)%this.f.length;this.length+=1;return null};function om(a,b){a.length+1===a.f.length&&a.resize();a.unshift(b)}
nm.prototype.resize=function(){var a=Array(2*this.f.length);return this.R<this.head?(mm(this.f,this.R,a,0,this.length),this.R=0,this.head=this.length,this.f=a):this.R>this.head?(mm(this.f,this.R,a,0,this.f.length-this.R),mm(this.f,0,a,this.f.length-this.R,this.head),this.R=0,this.head=this.length,this.f=a):this.R===this.head?(this.head=this.R=0,this.f=a):null};function pm(a,b){for(var c=a.length,d=0;;)if(d<c){var e=a.pop();(b.b?b.b(e):b.call(null,e))&&a.unshift(e);d+=1}else break}
function qm(a){return new nm(0,0,0,Array(a))}function rm(a,b){this.L=a;this.n=b;this.g=2;this.B=0}function sm(a){return a.L.length===a.n}rm.prototype.Dc=function(a,b){om(this.L,b);return this};rm.prototype.Y=function(){return this.L.length};var tm;
function um(){var a=aa.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==Ul.indexOf("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=ka(function(a){if(("*"==d||a.origin==
d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&-1==Ul.indexOf("Trident")&&-1==Ul.indexOf("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.vc;c.vc=null;a()}};return function(a){d.next={vc:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=
document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){aa.setTimeout(a,0)}};var vm=qm(32),wm=!1,xm=!1;ym;function zm(){wm=!0;xm=!1;for(var a=0;;){var b=vm.pop();if(null!=b&&(b.l?b.l():b.call(null),1024>a)){a+=1;continue}break}wm=!1;return 0<vm.length?ym.l?ym.l():ym.call(null):null}function ym(){var a=xm;if(y(y(a)?wm:a))return null;xm=!0;!ca(aa.setImmediate)||aa.Window&&aa.Window.prototype&&aa.Window.prototype.setImmediate==aa.setImmediate?(tm||(tm=um()),tm(zm)):aa.setImmediate(zm)}function Am(a){om(vm,a);ym()}function Bm(a,b){setTimeout(a,b)};var Cm,Dm=function Dm(b){"undefined"===typeof Cm&&(Cm=function(b,d,e){this.Oc=b;this.H=d;this.md=e;this.g=425984;this.B=0},Cm.prototype.P=function(b,d){return new Cm(this.Oc,this.H,d)},Cm.prototype.O=function(){return this.md},Cm.prototype.Jb=function(){return this.H},Cm.ic=function(){return new R(null,3,5,S,[Mc(Ei,new v(null,1,[we,jc(xe,jc(new R(null,1,5,S,[Oi],null)))],null)),Oi,ra.Gd],null)},Cm.xb=!0,Cm.eb="cljs.core.async.impl.channels/t_cljs$core$async$impl$channels22136",Cm.Tb=function(b,d){return Jb(d,
"cljs.core.async.impl.channels/t_cljs$core$async$impl$channels22136")});return new Cm(Dm,b,ye)};function Em(a,b){this.Ub=a;this.H=b}function Fm(a){return am(a.Ub)}var Gm=function Gm(b){if(null!=b&&null!=b.Cc)return b.Cc();var c=Gm[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Gm._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Oa("MMC.abort",b);};function Hm(a,b,c,d,e,f,g){this.Gb=a;this.hc=b;this.sb=c;this.gc=d;this.L=e;this.closed=f;this.Ja=g}
Hm.prototype.Cc=function(){for(;;){var a=this.sb.pop();if(null!=a){var b=a.Ub;Am(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(b.Fa,b,a.H,a,this))}break}pm(this.sb,De(!1));return $l(this)};
Hm.prototype.dc=function(a,b,c){var d=this;if(a=d.closed)return Dm(!a);if(y(function(){var a=d.L;return y(a)?Ma(sm(d.L)):a}())){for(c=Pc(d.Ja.a?d.Ja.a(d.L,b):d.Ja.call(null,d.L,b));;){if(0<d.Gb.length&&0<M(d.L)){var e=d.Gb.pop(),f=e.Fa,g=d.L.L.pop();Am(function(a,b){return function(){return a.b?a.b(b):a.call(null,b)}}(f,g,e,c,a,this))}break}c&&Gm(this);return Dm(!0)}e=function(){for(;;){var a=d.Gb.pop();if(y(a)){if(y(!0))return a}else return null}}();if(y(e))return c=bm(e),Am(function(a){return function(){return a.b?
a.b(b):a.call(null,b)}}(c,e,a,this)),Dm(!0);64<d.gc?(d.gc=0,pm(d.sb,Fm)):d.gc+=1;om(d.sb,new Em(c,b));return null};
Hm.prototype.pc=function(a,b){var c=this;if(null!=c.L&&0<M(c.L)){for(var d=b.Fa,e=Dm(c.L.L.pop());;){if(!y(sm(c.L))){var f=c.sb.pop();if(null!=f){var g=f.Ub,h=f.H;Am(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(g.Fa,g,h,f,d,e,this));Pc(c.Ja.a?c.Ja.a(c.L,h):c.Ja.call(null,c.L,h))&&Gm(this);continue}}break}return e}d=function(){for(;;){var a=c.sb.pop();if(y(a)){if(am(a.Ub))return a}else return null}}();if(y(d))return e=bm(d.Ub),Am(function(a){return function(){return a.b?a.b(!0):
a.call(null,!0)}}(e,d,this)),Dm(d.H);if(y(c.closed))return y(c.L)&&(c.Ja.b?c.Ja.b(c.L):c.Ja.call(null,c.L)),y(y(!0)?b.Fa:!0)?(d=function(){var a=c.L;return y(a)?0<M(c.L):a}(),d=y(d)?c.L.L.pop():null,Dm(d)):null;64<c.hc?(c.hc=0,pm(c.Gb,am)):c.hc+=1;om(c.Gb,b);return null};
Hm.prototype.cc=function(){var a=this;if(!a.closed)for(a.closed=!0,y(function(){var b=a.L;return y(b)?0===a.sb.length:b}())&&(a.Ja.b?a.Ja.b(a.L):a.Ja.call(null,a.L));;){var b=a.Gb.pop();if(null==b)break;else{var c=b.Fa,d=y(function(){var b=a.L;return y(b)?0<M(a.L):b}())?a.L.L.pop():null;Am(function(a,b){return function(){return a.b?a.b(b):a.call(null,b)}}(c,d,b,this))}}return null};function Im(a){console.log(a);return null}
function Jm(a,b){var c=(y(null)?null:Im).call(null,b);return null==c?a:dm.a(a,c)}
function Km(a){return new Hm(qm(32),0,qm(32),0,a,!1,function(){return function(a){return function(){function c(c,d){try{return a.a?a.a(c,d):a.call(null,c,d)}catch(e){return Jm(c,e)}}function d(c){try{return a.b?a.b(c):a.call(null,c)}catch(d){return Jm(c,d)}}var e=null,e=function(a,b){switch(arguments.length){case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};e.b=d;e.a=c;return e}()}(y(null)?null.b?null.b(dm):null.call(null,dm):dm)}())};function Lm(a,b,c){this.key=a;this.H=b;this.forward=c;this.g=2155872256;this.B=0}Lm.prototype.U=function(){return $a($a(yc,this.H),this.key)};Lm.prototype.M=function(a,b,c){return tf(b,uf,"["," ","]",c,this)};function Mm(a,b,c){c=Array(c+1);for(var d=0;;)if(d<c.length)c[d]=null,d+=1;else break;return new Lm(a,b,c)}function Nm(a,b,c,d){for(;;){if(0>c)return a;a:for(;;){var e=a.forward[c];if(y(e))if(e.key<b)a=e;else break a;else break a}null!=d&&(d[c]=a);--c}}
function Om(a,b){this.ob=a;this.level=b;this.g=2155872256;this.B=0}Om.prototype.put=function(a,b){var c=Array(15),d=Nm(this.ob,a,this.level,c).forward[0];if(null!=d&&d.key===a)return d.H=b;a:for(d=0;;)if(.5>Math.random()&&15>d)d+=1;else break a;if(d>this.level){for(var e=this.level+1;;)if(e<=d+1)c[e]=this.ob,e+=1;else break;this.level=d}for(d=Mm(a,b,Array(d));;)return 0<=this.level?(c=c[0].forward,d.forward[0]=c[0],c[0]=d):null};
Om.prototype.remove=function(a){var b=Array(15),c=Nm(this.ob,a,this.level,b).forward[0];if(null!=c&&c.key===a){for(a=0;;)if(a<=this.level){var d=b[a].forward;d[a]===c&&(d[a]=c.forward[a]);a+=1}else break;for(;;)if(0<this.level&&null==this.ob.forward[this.level])--this.level;else return null}else return null};function Pm(a){for(var b=Qm,c=b.ob,d=b.level;;){if(0>d)return c===b.ob?null:c;var e;a:for(e=c;;){e=e.forward[d];if(null==e){e=null;break a}if(e.key>=a)break a}null!=e?(--d,c=e):--d}}
Om.prototype.U=function(){return function(a){return function c(d){return new ee(null,function(){return function(){return null==d?null:Wc(new R(null,2,5,S,[d.key,d.H],null),c(d.forward[0]))}}(a),null,null)}}(this)(this.ob.forward[0])};Om.prototype.M=function(a,b,c){return tf(b,function(){return function(a){return tf(b,uf,""," ","",c,a)}}(this),"{",", ","}",c,this)};var Qm=new Om(Mm(null,null,0),0);
function Rm(a){var b=(new Date).valueOf()+a,c=Pm(b),d=y(y(c)?c.key<b+10:c)?c.H:null;if(y(d))return d;var e=Km(null);Qm.put(b,e);Bm(function(a,b,c){return function(){Qm.remove(c);return $l(a)}}(e,d,b,c),a);return e};var Sm=function Sm(b){"undefined"===typeof Xl&&(Xl=function(b,d,e){this.sc=b;this.Fa=d;this.kd=e;this.g=393216;this.B=0},Xl.prototype.P=function(b,d){return new Xl(this.sc,this.Fa,d)},Xl.prototype.O=function(){return this.kd},Xl.prototype.Ec=function(){return!0},Xl.prototype.Fc=function(){return this.Fa},Xl.ic=function(){return new R(null,3,5,S,[Mc(Bj,new v(null,2,[Ih,!0,we,jc(xe,jc(new R(null,1,5,S,[Tj],null)))],null)),Tj,ra.Ed],null)},Xl.xb=!0,Xl.eb="cljs.core.async/t_cljs$core$async19305",Xl.Tb=
function(b,d){return Jb(d,"cljs.core.async/t_cljs$core$async19305")});return new Xl(Sm,b,ye)};function Tm(a){a=lc.a(a,0)?null:a;return Km("number"===typeof a?new rm(qm(a),a):a)}function Um(a,b){var c=Yl(a,Sm(b));if(y(c)){var d=L.b?L.b(c):L.call(null,c);y(!0)?b.b?b.b(d):b.call(null,d):Am(function(a){return function(){return b.b?b.b(a):b.call(null,a)}}(d,c))}return null}var Vm=Sm(function(){return null});function Wm(a,b){var c=Zl(a,b,Vm);return y(c)?L.b?L.b(c):L.call(null,c):!0}
function Xm(a){var b=Gd(new R(null,1,5,S,[Ym],null)),c=Tm(null),d=M(b),e=le(d),f=Tm(1),g=U.b?U.b(null):U.call(null,null),h=$e(function(a,b,c,d,e,f){return function(g){return function(a,b,c,d,e,f){return function(a){d[g]=a;return 0===Me.a(f,Md)?Wm(e,d.slice(0)):null}}(a,b,c,d,e,f)}}(b,c,d,e,f,g),new Ag(null,0,d,1,null)),l=Tm(1);Am(function(b,c,d,e,f,g,h,l){return function(){var B=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!Q(e,W)){d=e;break a}}}catch(f){if(f instanceof
Object)c[5]=f,lm(c),d=W;else throw f;}if(!Q(d,W))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(b,c,d,e,f,g,h,l){return function(b){var f=b[1];if(7===f)return b[2]=null,b[1]=8,W;if(1===f)return b[2]=null,b[1]=2,W;if(4===f){var m=b[7],
f=m<e;b[1]=y(f)?6:7;return W}return 15===f?(f=b[2],b[2]=f,b[1]=3,W):13===f?(f=$l(d),b[2]=f,b[1]=15,W):6===f?(b[2]=null,b[1]=11,W):3===f?(f=b[2],jm(b,f)):12===f?(f=b[8],f=b[2],m=Be(Ja,f),b[8]=f,b[1]=y(m)?13:14,W):2===f?(f=Le.a?Le.a(h,e):Le.call(null,h,e),b[9]=f,b[7]=0,b[2]=null,b[1]=4,W):11===f?(m=b[7],b[4]=new km(10,Object,null,9,b[4],null,null,null),f=c.b?c.b(m):c.call(null,m),m=l.b?l.b(m):l.call(null,m),f=Um(f,m),b[2]=f,lm(b),W):9===f?(m=b[7],b[10]=b[2],b[7]=m+1,b[2]=null,b[1]=4,W):5===f?(b[11]=
b[2],hm(b,12,g)):14===f?(f=b[8],f=E.a(a,f),im(b,16,d,f)):16===f?(b[12]=b[2],b[2]=null,b[1]=2,W):10===f?(m=b[2],f=Me.a(h,Md),b[13]=m,b[2]=f,lm(b),W):8===f?(f=b[2],b[2]=f,b[1]=5,W):null}}(b,c,d,e,f,g,h,l),b,c,d,e,f,g,h,l)}(),D=function(){var a=B.l?B.l():B.call(null);a[6]=b;return a}();return gm(D)}}(l,b,c,d,e,f,g,h));return c};var Zm=VDOM.diff,$m=VDOM.patch,an=VDOM.create;function bn(a){return Xe(Ce(Ja),Xe(Ce(Bd),Ye(a)))}function cn(a,b,c){return new VDOM.VHtml(Td(a),Vg(b),Vg(c))}function dn(a,b,c){return new VDOM.VSvg(Td(a),Vg(b),Vg(c))}en;
var fn=function fn(b){if(null==b)return new VDOM.VText("");if(Bd(b))return cn(Ci,ye,P.a(fn,bn(b)));if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(lc.a(bj,J(b)))return en.b?en.b(b):en.call(null,b);var c=N(b,0),d=N(b,1);b=Sd(b,2);return cn(c,d,P.a(fn,bn(b)))},en=function en(b){if(null==b)return new VDOM.VText("");if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(lc.a(Qj,J(b))){var c=N(b,0),d=N(b,1);b=Sd(b,2);return dn(c,d,P.a(fn,bn(b)))}c=N(b,0);d=N(b,
1);b=Sd(b,2);return dn(c,d,P.a(en,bn(b)))};
function gn(){var a=document.body,b=function(){var a=new VDOM.VText("");return U.b?U.b(a):U.call(null,a)}(),c=function(){var a;a=L.b?L.b(b):L.call(null,b);a=an.b?an.b(a):an.call(null,a);return U.b?U.b(a):U.call(null,a)}(),d=null==window.requestAnimationFrame?function(){return function(a){return a.l?a.l():a.call(null)}}(b,c):function(){return function(a){return window.requestAnimationFrame(a)}}(b,c);a.appendChild(L.b?L.b(c):L.call(null,c));return function(a,b,c){return function(d){var l=fn(d);d=function(){var b=
L.b?L.b(a):L.call(null,a);return Zm.a?Zm.a(b,l):Zm.call(null,b,l)}();Le.a?Le.a(a,l):Le.call(null,a,l);d=function(a,b,c,d){return function(){return Me.c(d,$m,b)}}(l,d,a,b,c);return c.b?c.b(d):c.call(null,d)}}(b,c,d)};var hn=Error();function jn(a){if(y(lc.a?lc.a(0,a):lc.call(null,0,a)))return fd;if(y(lc.a?lc.a(1,a):lc.call(null,1,a)))return new R(null,1,5,S,[new R(null,2,5,S,[0,0],null)],null);if(y(lc.a?lc.a(2,a):lc.call(null,2,a)))return new R(null,2,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[1,1],null)],null);if(y(lc.a?lc.a(3,a):lc.call(null,3,a)))return new R(null,3,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[0,0],null),new R(null,2,5,S,[1,1],null)],null);if(y(lc.a?lc.a(4,a):lc.call(null,4,a)))return new R(null,
4,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[-1,1],null),new R(null,2,5,S,[1,-1],null),new R(null,2,5,S,[1,1],null)],null);if(y(lc.a?lc.a(5,a):lc.call(null,5,a)))return new R(null,5,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[-1,1],null),new R(null,2,5,S,[0,0],null),new R(null,2,5,S,[1,-1],null),new R(null,2,5,S,[1,1],null)],null);if(y(lc.a?lc.a(6,a):lc.call(null,6,a)))return new R(null,6,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[-1,0],null),new R(null,2,5,S,[-1,1],
null),new R(null,2,5,S,[1,-1],null),new R(null,2,5,S,[1,0],null),new R(null,2,5,S,[1,1],null)],null);throw Error([C("No matching clause: "),C(a)].join(""));}var kn=Eg(function(a){return a.x},function(a){return a.y});
function ln(a){var b=N(a,0),c=N(a,1),d=Math.ceil(Math.sqrt(4)),e=b/d,f=c/d;return function(a,b,c,d,e,f,q){return function t(w){return new ee(null,function(a,b,c,d,e,f,g){return function(){for(var h=w;;){var l=H(h);if(l){var m=l,n=J(m);if(l=H(function(a,b,c,d,e,f,g,h,l,m,n){return function Ta(p){return new ee(null,function(a,b,c,d,e,f,g,h){return function(){for(;;){var a=H(p);if(a){if(vd(a)){var c=Vb(a),d=M(c),e=ie(d);a:for(var l=0;;)if(l<d){var m=bb.a(c,l),m=jd.j(h,sj,m*f,uc([mh,b*g],0));e.add(m);
l+=1}else{c=!0;break a}return c?je(e.W(),Ta(Wb(a))):je(e.W(),null)}e=J(a);return Wc(jd.j(h,sj,e*f,uc([mh,b*g],0)),Ta(xc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n),null,null)}}(h,n,m,l,a,b,c,d,e,f,g)(new Ag(null,0,a,1,null))))return oe.a(l,t(xc(h)));h=xc(h)}else return null}}}(a,b,c,d,e,f,q),null,null)}}(d,e,f,new v(null,2,[Zh,e,Mj,f],null),a,b,c)(new Ag(null,0,d,1,null))}var mn=Eg(Fe(E,Od),Fe(E,Nd));
function nn(a,b){var c=N(a,0),d=N(a,1),e=N(b,0),f=N(b,1),g=lc.a(c,d)?new R(null,2,5,S,[0,1],null):new R(null,2,5,S,[c,d],null),h=N(g,0),l=N(g,1),m=(f-e)/(l-h);return function(a,b,c,d,e){return function(a){return d*a+e}}(g,h,l,m,f-m*l,a,c,d,b,e,f)};var on=U.b?U.b(ye):U.call(null,ye);function pn(a){return Me.o(on,jd,Qg("animation"),a)}
function qn(){var a=1E3/30,b=Tm(1);Am(function(a,b){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!Q(e,W)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,lm(c),d=W;else throw f;}if(!Q(d,W))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(a,b){return function(a){var c=a[1];if(7===c)return c=a,c[2]=a[2],c[1]=4,W;if(20===c){var d=a[7],c=a[8],e=J(d),d=N(e,0),e=N(e,1),c=e.b?e.b(c):e.call(null,c);a[9]=d;a[1]=y(c)?22:23;return W}if(1===c)return c=Rm(0),hm(a,2,c);if(24===c){var d=a[7],e=a[2],c=K(d),f;a[10]=c;a[11]=e;a[12]=0;a[13]=0;a[14]=null;a[2]=null;a[1]=8;return W}if(4===c)return c=a[2],jm(a,c);if(15===c){c=a[10];f=a[12];var e=
a[13],d=a[14],g=a[2];a[10]=c;a[12]=f;a[13]=e+1;a[15]=g;a[14]=d;a[2]=null;a[1]=8;return W}return 21===c?(c=a[2],a[2]=c,a[1]=18,W):13===c?(a[2]=null,a[1]=15,W):22===c?(a[2]=null,a[1]=24,W):6===c?(a[2]=null,a[1]=7,W):25===c?(c=a[8],c+=b,a[16]=a[2],a[8]=c,a[2]=null,a[1]=3,W):17===c?(a[2]=null,a[1]=18,W):3===c?(c=L.b?L.b(on):L.call(null,on),c=H(c),a[1]=c?5:6,W):12===c?(c=a[2],a[2]=c,a[1]=9,W):2===c?(c=a[2],a[17]=c,a[8]=0,a[2]=null,a[1]=3,W):23===c?(d=a[9],c=Me.c(on,ld,d),a[2]=c,a[1]=24,W):19===c?(d=a[7],
c=Vb(d),d=Wb(d),e=M(c),a[10]=d,a[12]=e,a[13]=0,a[14]=c,a[2]=null,a[1]=8,W):11===c?(c=a[10],c=H(c),a[7]=c,a[1]=c?16:17,W):9===c?(c=a[2],d=Rm(b),a[18]=c,hm(a,25,d)):5===c?(c=L.b?L.b(on):L.call(null,on),c=H(c),a[10]=c,a[12]=0,a[13]=0,a[14]=null,a[2]=null,a[1]=8,W):14===c?(d=a[19],c=Me.c(on,ld,d),a[2]=c,a[1]=15,W):16===c?(d=a[7],c=vd(d),a[1]=c?19:20,W):10===c?(e=a[13],d=a[14],c=a[8],e=bb.a(d,e),d=N(e,0),e=N(e,1),c=e.b?e.b(c):e.call(null,c),a[19]=d,a[1]=y(c)?13:14,W):18===c?(c=a[2],a[2]=c,a[1]=12,W):8===
c?(f=a[12],e=a[13],c=e<f,a[1]=y(c)?10:11,W):null}}(a,b),a,b)}(),f=function(){var b=e.l?e.l():e.call(null);b[6]=a;return b}();return gm(f)}}(b,a));return b}function rn(a){return a*a}function sn(a,b,c){var d=null!=c&&(c.g&64||c.F)?E.a(Jc,c):c,e=F.c(d,Gj,0),f=F.a(d,ki),g=F.c(d,hi,Hd);return function(c,d,e,f,g){return function(c){if(c<=e)return!0;if(c<e+f)return c=(c-e)/f,c=g.b?g.b(c):g.call(null,c),b.a?b.a(a,c):b.call(null,a,c),!0;b.a?b.a(a,1):b.call(null,a,1);return!1}}(c,d,e,f,g)}
function tn(a,b){return function(c){return pn(sn(c,a,b))}}function un(a,b,c){return function(d){var e=function(c){return function(e,h){var l,m=a.getPointAtLength(h*c);l=kn.b?kn.b(m):kn.call(null,m);m=N(l,0);l=N(l,1);m=new R(null,2,5,S,[m,l],null);return b.a?b.a(d,m):b.call(null,d,m)}}(a.getTotalLength());return pn(sn(d,e,c))}};function vn(){var a=wn,b=xn,c=yn,d=Tm(null);Wm(d,b);var e=Tm(1);Am(function(d,e){return function(){var h=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!Q(e,W)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,lm(c),d=W;else throw f;}if(!Q(d,W))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,
a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(d,e){return function(d){var f=d[1];if(1===f)return hm(d,2,c);if(2===f){var f=b,g=d[2];d[7]=f;d[8]=g;d[2]=null;d[1]=3;return W}return 3===f?(f=d[9],f=d[7],g=d[8],f=a.a?a.a(f,g):a.call(null,f,g),g=Wm(e,f),d[10]=g,d[9]=f,hm(d,5,c)):4===f?(f=d[2],jm(d,f)):5===f?(f=d[9],g=d[2],d[7]=f,d[8]=g,d[2]=null,d[1]=3,W):null}}(d,e),d,e)}(),l=function(){var a=h.l?h.l():h.call(null);a[6]=d;return a}();return gm(l)}}(e,d));return d}
function zn(){var a=An,b=gn(),c=Tm(1);Am(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!Q(e,W)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,lm(c),d=W;else throw f;}if(!Q(d,W))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.l=c;d.b=b;return d}()}(function(){return function(c){var d=c[1];return 1===d?(c[2]=null,c[1]=2,W):2===d?hm(c,4,a):3===d?(d=c[2],jm(c,d)):4===d?(d=c[7],d=c[2],c[7]=d,c[1]=y(d)?5:6,W):5===d?(d=c[7],d=b.b?b.b(d):b.call(null,d),c[8]=d,c[2]=null,c[1]=2,W):6===d?(c[2]=null,c[1]=7,W):7===d?(d=c[2],c[2]=d,c[1]=3,W):null}}(c),c)}(),f=function(){var a=e.l?e.l():e.call(null);a[6]=c;return a}();return gm(f)}}(c));return c};var Bn,Cn=new v(null,3,[Fj,250,Ki,500,Xh,500],null);Bn=U.b?U.b(Cn):U.call(null,Cn);function Dn(a){return document.querySelector([C("#"),C(a),C(" .penny-path")].join(""))}function En(a){return document.querySelector([C("#"),C(a),C(" .ramp")].join(""))};function Fn(a){this.Fa=a}Fn.prototype.hd=function(a){return this.Fa.b?this.Fa.b(a):this.Fa.call(null,a)};ba("Hook",Fn);ba("Hook.prototype.hook",Fn.prototype.hd);function Gn(a){var b=N(a,0);a=N(a,1);return[C(b),C(","),C(a)].join("")}function Hn(a,b,c){var d=N(a,0);N(a,1);a=N(b,0);var e=N(b,1);b=N(c,0);c=N(c,1);var d=d-a,f=(e-c)/2*(d/Math.abs(d)),g=f/2,d=new R(null,2,5,S,[a+f,e],null);a=new R(null,2,5,S,[a-g,e],null);e=new R(null,2,5,S,[b-g,c],null);b=new R(null,2,5,S,[b+f,c],null);return[C("L"),C(Gn(d)),C("C"),C(Gn(a)),C(","),C(Gn(e)),C(","),C(Gn(b))].join("")}function In(a){return H(a)?E.c(C,"M",Ue(P.a(Gn,a))):null}
function Jn(a,b){return[C("translate("),C(a),C(","),C(b),C(")")].join("")}
function Kn(a){var b=null!=a&&(a.g&64||a.F)?E.a(Jc,a):a,c=F.a(b,Zh),d=F.a(b,Mj),e=F.a(b,sj),f=F.a(b,mh),g=F.a(b,Th),h=c/2;return new R(null,4,5,S,[Gi,new v(null,1,[xh,Jn(h,h)],null),new R(null,2,5,S,[Ej,new v(null,5,[Ti,"die",sj,-h,mh,-h,Zh,c,Mj,c],null)],null),function(){return function(a,b,c,d,e,f,g,h,x){return function D(I){return new ee(null,function(a,b,c,d,e){return function(){for(;;){var b=H(I);if(b){if(vd(b)){var c=Vb(b),d=M(c),f=ie(d);a:for(var g=0;;)if(g<d){var h=bb.a(c,g),l=N(h,0),h=N(h,
1),l=new R(null,2,5,S,[Wh,new v(null,3,[Ri,a.b?a.b(l):a.call(null,l),Wi,a.b?a.b(h):a.call(null,h),th,e/10],null)],null);f.add(l);g+=1}else{c=!0;break a}return c?je(f.W(),D(Wb(b))):je(f.W(),null)}c=J(b);f=N(c,0);c=N(c,1);return Wc(new R(null,2,5,S,[Wh,new v(null,3,[Ri,a.b?a.b(f):a.call(null,f),Wi,a.b?a.b(c):a.call(null,c),th,e/10],null)],null),D(xc(b)))}return null}}}(a,b,c,d,e,f,g,h,x),null,null)}}(Fe(Kd,c/4),h,a,b,c,d,e,f,g)(jn(g))}()],null)}
function Ln(a,b){for(var c=a-10,d=fd,e=!0,f=b-10;;)if(0<f)d=oe.a(d,e?new R(null,2,5,S,[new R(null,2,5,S,[c,f],null),new R(null,2,5,S,[10,f],null)],null):new R(null,2,5,S,[new R(null,2,5,S,[10,f],null),new R(null,2,5,S,[c,f],null)],null)),e=!e,f-=20;else{c=S;a:for(e=N(d,0),f=Sd(d,1),d=[C("M"),C(Gn(e))].join(""),N(f,0),N(f,1),Sd(f,2);;){var g=f,h=N(g,0),f=N(g,1),g=Sd(g,2),l;l=h;y(l)&&(l=f,l=y(l)?H(g):l);if(y(l))d=[C(d),C(Hn(e,h,f))].join(""),e=f,f=g;else{d=y(h)?[C(d),C("L"),C(Gn(h))].join(""):d;break a}}return new R(null,
2,5,c,[nh,new v(null,2,[Ti,"penny-path",oj,d],null)],null)}}function Mn(a,b,c){a=a.getPointAtLength(c*b+20);return kn.b?kn.b(a):kn.call(null,a)}function Nn(a,b,c){var d=N(a,0);a=N(a,1);return new R(null,4,5,S,[Gi,new v(null,2,[xh,Jn(d,a),fj,y(c)?new Fn(c):null],null),new R(null,2,5,S,[Wh,new v(null,2,[Ti,"penny",th,8],null)],null),y(b)?new R(null,2,5,S,[Wh,new v(null,2,[Ti,"tracer",th,4],null)],null):null],null)}
function On(a,b,c){var d=null!=c&&(c.g&64||c.F)?E.a(Jc,c):c,e=F.a(d,Ij),f=F.a(d,Nj),g=F.a(d,Ch),h=F.a(d,Fh);return $a($a(yc,function(){var a=d.b?d.b(nh):d.call(null,nh);return y(a)?$a($a(yc,ae(He(function(a,b,c,d,e,f,g,h,l){return function(D,I){var G=null!=I&&(I.g&64||I.F)?E.a(Jc,I):I,ja=F.a(G,Yh),A=function(a,b,c,d,e,f,g,h,l,m){return function(a){return Mn(d,a,m)}}(I,G,ja,a,b,c,d,e,f,g,h,l);return Nn(A(D),ja,0<h?tn(function(a,b,c,d,e,f,g,h,l,m,n,p){return function(b,c){var d;d=D-c*p;d=-1>d?-1:d;
var e=a(d),f=N(e,0),e=N(e,1);b.setAttribute("transform",Jn(f,e));return lc.a(-1,d)?b.setAttribute("transform","scale(0)"):null}}(A,I,G,ja,a,b,c,d,e,f,g,h,l),new v(null,1,[ki,(L.b?L.b(Bn):L.call(null,Bn)).call(null,Ki)],null)):null)}}(a,a,c,d,d,e,f,g,h),e))),ae(He(function(){return function(a,b,c,d,e,f,g,h,l,D){return function(I,G){var ja=null!=G&&(G.g&64||G.F)?E.a(Jc,G):G,A=F.a(ja,Yh),Z=Mn(b,a+I,h),ea=N(Z,0),O=N(Z,1);return Nn(new R(null,2,5,S,[ea,D],null),A,tn(function(a,b,c,d,e,f,g,h,l,m,n,p,q,
r,t,w,x){return function(a,c){return a.setAttribute("transform",Jn(b,x+c*d))}}(Z,ea,O,O-D,G,ja,A,a,b,c,d,e,f,g,h,l,D),new v(null,3,[ki,(L.b?L.b(Bn):L.call(null,Bn)).call(null,Xh),Gj,50*I,hi,rn],null)))}}(M(e),a,a,c,d,d,e,f,g,h)}(),d.b?d.b(yi):d.call(null,yi)))):null}()),Ln(a,b))}
function Pn(a,b){var c=b-20,d=S,e=Jn(0,a),c=[C(In(new R(null,6,5,S,[new R(null,2,5,S,[b,-20],null),new R(null,2,5,S,[b,23],null),new R(null,2,5,S,[0,23],null),new R(null,2,5,S,[0,3],null),new R(null,2,5,S,[c,3],null),new R(null,2,5,S,[c,-20],null)],null))),C("Z")].join("");return new R(null,2,5,d,[nh,new v(null,3,[Ti,"spout",xh,e,oj,c],null)],null)}
if("undefined"===typeof Qn){var Qn,Rn=U.b?U.b(ye):U.call(null,ye),Sn=U.b?U.b(ye):U.call(null,ye),Tn=U.b?U.b(ye):U.call(null,ye),Un=U.b?U.b(ye):U.call(null,ye),Vn=F.c(ye,Aj,Zg());Qn=new jh(tc.a("pennygame.ui","station"),ii,Qh,Vn,Rn,Sn,Tn,Un)}lh(Qn,$h,function(a){var b=null!=a&&(a.g&64||a.F)?E.a(Jc,a):a;a=F.a(b,Zh);F.a(b,cj);b=F.a(b,Fh);return Pn(b,a)});
lh(Qn,Dh,function(a){var b=null!=a&&(a.g&64||a.F)?E.a(Jc,a):a;a=F.a(b,Zh);var c=F.a(b,cj),b=$a($a($a(yc,Pn(b.b?b.b(Fh):b.call(null,Fh),a)),On(a,c,new v(null,6,[Ij,b.b?b.b(Ij):b.call(null,Ij),Nj,b.b?b.b(oh):b.call(null,oh),Ch,y(b.b?b.b(mi):b.call(null,mi))?b.b?b.b(Hh):b.call(null,Hh):0,yi,y(b.b?b.b(qj):b.call(null,qj))?b.b?b.b(Jj):b.call(null,Jj):null,nh,Dn(b.b?b.b(Si):b.call(null,Si)),Fh,b.b?b.b(bi):b.call(null,bi)],null))),new R(null,2,5,S,[Ej,new v(null,3,[Ti,"bin",Zh,a,Mj,c],null)],null));a:for(var d=
fd,e=!0,c=c-20;;)if(0<c)d=ed.a(d,new R(null,2,5,S,[Ni,new v(null,4,[Ti,"shelf",xh,Jn(0,c),tj,e?20:0,Hj,e?a:a-20],null)],null)),e=!e,c-=20;else{a=new R(null,3,5,S,[Gi,ye,E.a(jc,d)],null);break a}return $a(b,a)});
lh(Qn,hj,function(a){var b=null!=a&&(a.g&64||a.F)?E.a(Jc,a):a,c=F.a(b,Zh),d=F.a(b,Si),e=F.a(b,cj),f=F.a(b,bi);return $a($a($a(yc,new R(null,2,5,S,[nj,new v(null,3,[$i,truckSrc,Zh,c,Mj,e],null)],null)),new R(null,2,5,S,[nh,new v(null,2,[Ti,"ramp",oj,[C("M"),C(Gn(new R(null,2,5,S,[10,f],null))),C("C"),C(Gn(new R(null,2,5,S,[10,e/2],null))),C(","),C(Gn(new R(null,2,5,S,[10,e/2],null))),C(","),C(Gn(new R(null,2,5,S,[c/2,e/2],null)))].join("")],null)],null)),function(){var g=En(d);return y(y(g)?b.b?b.b(qj):
b.call(null,qj):g)?He(function(a,b,c,d,e,f,g,t){return function(w,x){var B=null!=x&&(x.g&64||x.F)?E.a(Jc,x):x,D=F.a(B,Yh);return Nn(new R(null,2,5,S,[10,t],null),D,un(a,function(){return function(a,b){var c=N(b,0),d=N(b,1);return a.setAttribute("transform",Jn(c,d))}}(x,B,D,a,b,c,d,e,f,g,t),new v(null,3,[ki,(L.b?L.b(Bn):L.call(null,Bn)).call(null,Xh),Gj,50*w,hi,rn],null)))}}(g,a,b,b,c,d,e,f),b.b?b.b(Jj):b.call(null,Jj)):null}())});
function Wn(a){var b=null!=a&&(a.g&64||a.F)?E.a(Jc,a):a,c=F.a(b,sj),d=F.a(b,Ah),e=F.a(b,Gh);return y(y(c)?d:c)?new R(null,3,5,S,[Gi,new v(null,2,[Ti,[C("scenario "),C(Td(d))].join(""),xh,Jn(c,0)],null),function(){return function(a,b,c,d,e){return function p(q){return new ee(null,function(){return function(){for(;;){var a=H(q);if(a){if(vd(a)){var b=Vb(a),c=M(b),d=ie(c);a:for(var e=0;;)if(e<c){var f=bb.a(b,e),g=null!=f&&(f.g&64||f.F)?E.a(Jc,f):f,f=g,h=F.a(g,Kj),h=null!=h&&(h.g&64||h.F)?E.a(Jc,h):h,
h=F.a(h,ii),l=F.a(g,Si),g=F.a(g,mh),f=new R(null,3,5,S,[Gi,new v(null,3,[Si,l,Ti,[C(Td(h)),C(" productivity-"),C(Td(h))].join(""),xh,Jn(0,g)],null),Qn.b?Qn.b(f):Qn.call(null,f)],null);d.add(f);e+=1}else{b=!0;break a}return b?je(d.W(),p(Wb(a))):je(d.W(),null)}d=J(a);d=b=null!=d&&(d.g&64||d.F)?E.a(Jc,d):d;c=F.a(b,Kj);c=null!=c&&(c.g&64||c.F)?E.a(Jc,c):c;c=F.a(c,ii);e=F.a(b,Si);b=F.a(b,mh);return Wc(new R(null,3,5,S,[Gi,new v(null,3,[Si,e,Ti,[C(Td(c)),C(" productivity-"),C(Td(c))].join(""),xh,Jn(0,b)],
null),Qn.b?Qn.b(d):Qn.call(null,d)],null),p(xc(a)))}return null}}}(a,b,c,d,e),null,null)}}(a,b,c,d,e)(ae(e))}()],null):null}
function Xn(a,b,c,d){var e=null!=a&&(a.g&64||a.F)?E.a(Jc,a):a,f=F.a(e,Zh),g=F.a(e,Mj),h=F.a(e,sj),l=F.a(e,mh),m=null!=d&&(d.g&64||d.F)?E.a(Jc,d):d,n=F.a(m,ti),p=F.a(m,Lj),q=F.a(m,ui),r=g-60,t=function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q){return function Ha(r){return new ee(null,function(a,b,c,d,e,f,g,h,l,m,n,p,q){return function(){for(var t=r;;){var w=H(t);if(w){var x=w;if(vd(x)){var A=Vb(x),B=M(A),D=ie(B);return function(){for(var r=0;;)if(r<B){var G=bb.a(A,r),I=null!=G&&(G.g&64||G.F)?E.a(Jc,
G):G,O=F.a(I,Ah),T=F.a(I,Eh);y(O)&&ke(D,new v(null,2,[Ah,O,Sj,He(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,A,B,D,G,I){return function(a,b){return new R(null,2,5,S,[a,I.b?I.b(b):I.call(null,b)],null)}}(r,t,G,I,O,T,A,B,D,x,w,a,b,c,d,e,f,g,h,l,m,n,p,q),T)],null));r+=1}else return!0}()?je(D.W(),Ha(Wb(x))):je(D.W(),null)}var G=J(x),I=null!=G&&(G.g&64||G.F)?E.a(Jc,G):G,O=F.a(I,Ah),T=F.a(I,Eh);if(y(O))return Wc(new v(null,2,[Ah,O,Sj,He(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,A){return function(a,b){return new R(null,
2,5,S,[a,A.b?A.b(b):A.call(null,b)],null)}}(t,G,I,O,T,x,w,a,b,c,d,e,f,g,h,l,m,n,p,q),T)],null),Ha(xc(x)));t=xc(x)}else return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q),null,null)}}(30,r,a,e,f,g,h,l,d,m,n,p,q)(b)}(),w=We(Sj,uc([t],0)),x=oe.a(p,Pe(M(p),function(){var a=P.a(cd,w);return mn.b?mn.b(a):mn.call(null,a)}())),B=nn(function(){var a=P.a(J,w);return mn.b?mn.b(a):mn.call(null,a)}(),new R(null,2,5,S,[0,f-60],null)),D=nn(x,new R(null,2,5,S,[r,0],null)),I=function(a,b,c,d,e,f,g){return function(a,b){return new R(null,
2,5,S,[f.b?f.b(a):f.call(null,a),g.b?g.b(b):g.call(null,b)],null)}}(30,r,t,w,x,B,D,a,e,f,g,h,l,d,m,n,p,q),G=Ok(new R(null,3,5,S,[Pk,Sj,Pk],null),function(a,b,c,d,e,f,g,h){return function(a){return E.a(h,a)}}(30,r,t,w,x,B,D,I,a,e,f,g,h,l,d,m,n,p,q),t),ja=function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,A,B,D){return function xd(G){return new ee(null,function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,A,B,D){return function(){for(;;){var I=H(G);if(I){var O=I;if(vd(O)){var T=Vb(O),V=M(T),Z=ie(V);
return function(){for(var G=0;;)if(G<V){var X=bb.a(T,G),ea=N(X,0),fa=N(X,1);ke(Z,new v(null,2,[Ah,function(){var a=new v(null,3,[mj,Ui,Jh,Uh,li,Vi],null);return ea.b?ea.b(a):ea.call(null,a)}(),Sj,He(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,A,B,D,G,I,O,T,V,X,Z){return function(a,b){return x(a,Z.b?Z.b(b):Z.call(null,b))}}(G,X,ea,fa,T,V,Z,O,I,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,A,B,D),fa)],null));G+=1}else return!0}()?je(Z.W(),xd(Wb(O))):je(Z.W(),null)}var X=J(O),ea=N(X,0),fa=N(X,1);return Wc(new v(null,
2,[Ah,function(){var a=new v(null,3,[mj,Ui,Jh,Uh,li,Vi],null);return ea.b?ea.b(a):ea.call(null,a)}(),Sj,He(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,A,B,D,G,I,O){return function(a,b){return q(a,O.b?O.b(b):O.call(null,b))}}(X,ea,fa,O,I,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,A,B,D),fa)],null),xd(xc(O)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,A,B,D),null,null)}}(30,r,t,w,x,B,D,I,G,a,e,f,g,h,l,d,m,n,p,q)(c)}(),A=Td(Qg("clip"));return new R(null,6,5,S,[Gi,new v(null,2,[Ti,[C("graph "),C(y(c)?"averaging":
null)].join(""),xh,Jn(h,l)],null),new R(null,2,5,S,[Ej,new v(null,2,[Zh,f,Mj,g],null)],null),new R(null,3,5,S,[Rj,new v(null,4,[Ti,"title",sj,f/2,mh,g/2,di,10],null),q],null),new R(null,3,5,S,[Yi,ye,new R(null,3,5,S,[ei,new v(null,1,[Si,A],null),new R(null,2,5,S,[Ej,new v(null,3,[mh,-1,Zh,f-60,Mj,g-60+1],null)],null)],null)],null),new R(null,5,5,S,[Gi,new v(null,1,[xh,Jn(30,30)],null),new R(null,5,5,S,[Gi,new v(null,1,[Bi,[C("url(#"),C(A),C(")")].join("")],null),function(){return function(a,b,c,d,
e,f,g,h,l,m,n,p,q,r,t,w,x,A,B,D,G,I){return function Kc(ja){return new ee(null,function(){return function(){for(;;){var a=H(ja);if(a){if(vd(a)){var b=Vb(a),c=M(b),d=ie(c);a:for(var e=0;;)if(e<c){var f=bb.a(b,e),g=null!=f&&(f.g&64||f.F)?E.a(Jc,f):f,f=F.a(g,Ah),g=F.a(g,Sj),f=new R(null,2,5,S,[nh,new v(null,2,[Ti,[C("average "),C(Td(f))].join(""),oj,In(g)],null)],null);d.add(f);e+=1}else{b=!0;break a}return b?je(d.W(),Kc(Wb(a))):je(d.W(),null)}d=J(a);b=null!=d&&(d.g&64||d.F)?E.a(Jc,d):d;d=F.a(b,Ah);
b=F.a(b,Sj);return Wc(new R(null,2,5,S,[nh,new v(null,2,[Ti,[C("average "),C(Td(d))].join(""),oj,In(b)],null)],null),Kc(xc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,A,B,D,G,I),null,null)}}(30,r,t,w,x,B,D,I,G,ja,A,a,e,f,g,h,l,d,m,n,p,q)(ja)}(),function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,A,B,D,G,I){return function Kc(ja){return new ee(null,function(){return function(){for(;;){var a=H(ja);if(a){if(vd(a)){var b=Vb(a),c=M(b),d=ie(c);a:for(var e=0;;)if(e<c){var f=bb.a(b,e),
f=null!=f&&(f.g&64||f.F)?E.a(Jc,f):f;F.a(f,Ah);f=F.a(f,Sj);f=new R(null,2,5,S,[nh,new v(null,2,[Ti,"history stroke",oj,In(f)],null)],null);d.add(f);e+=1}else{b=!0;break a}return b?je(d.W(),Kc(Wb(a))):je(d.W(),null)}d=J(a);d=null!=d&&(d.g&64||d.F)?E.a(Jc,d):d;F.a(d,Ah);d=F.a(d,Sj);return Wc(new R(null,2,5,S,[nh,new v(null,2,[Ti,"history stroke",oj,In(d)],null)],null),Kc(xc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,A,B,D,G,I),null,null)}}(30,r,t,w,x,B,D,I,G,ja,A,a,e,f,g,h,l,d,m,n,p,q)(G)}(),
function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,A,B,D,G,I){return function Kc(ja){return new ee(null,function(){return function(){for(;;){var a=H(ja);if(a){if(vd(a)){var b=Vb(a),c=M(b),d=ie(c);a:for(var e=0;;)if(e<c){var f=bb.a(b,e),g=null!=f&&(f.g&64||f.F)?E.a(Jc,f):f,f=F.a(g,Ah),g=F.a(g,Sj),f=new R(null,2,5,S,[nh,new v(null,2,[Ti,[C("history "),C(Td(f))].join(""),oj,In(g)],null)],null);d.add(f);e+=1}else{b=!0;break a}return b?je(d.W(),Kc(Wb(a))):je(d.W(),null)}d=J(a);b=null!=d&&(d.g&
64||d.F)?E.a(Jc,d):d;d=F.a(b,Ah);b=F.a(b,Sj);return Wc(new R(null,2,5,S,[nh,new v(null,2,[Ti,[C("history "),C(Td(d))].join(""),oj,In(b)],null)],null),Kc(xc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,x,A,B,D,G,I),null,null)}}(30,r,t,w,x,B,D,I,G,ja,A,a,e,f,g,h,l,d,m,n,p,q)(G)}()],null),new R(null,2,5,S,[Ni,new v(null,3,[Ti,"axis",xh,Jn(0,r),Hj,f-60],null)],null),new R(null,2,5,S,[Ni,new v(null,2,[Ti,"axis",xj,r],null)],null)],null)],null)}
function Yn(a,b,c){var d=ln(a);a=N(d,0);var e=N(d,1),f=N(d,2),d=N(d,3);return new R(null,6,5,S,[Gi,new v(null,1,[Si,"graphs"],null),Xn(a,b,c,new v(null,2,[ui,"Work in Progress",ti,pi],null)),Xn(e,b,c,new v(null,2,[ui,"Total Output",ti,gi],null)),Xn(f,b,c,new v(null,2,[ui,"Inventory Turns",ti,wh],null)),Xn(d,b,c,new v(null,3,[ui,"Utilization",ti,Fi,Lj,new R(null,2,5,S,[0,1],null)],null))],null)}
function Zn(a){var b=$n,c=null!=a&&(a.g&64||a.F)?E.a(Jc,a):a,d=F.a(c,Zh),e=F.a(c,Mj),f=F.a(c,Fj),g=F.a(c,ef),h=F.a(c,Sh),l=F.a(c,qi),m=F.a(c,Kh);return new R(null,5,5,S,[zj,ye,new R(null,3,5,S,[Ci,new v(null,1,[Ai,new v(null,3,[kj,wj,Oj,"5px",Nh,"5px"],null)],null),new R(null,4,5,S,[Ci,ye,f," steps"],null)],null),new R(null,4,5,S,[Ci,new v(null,1,[Si,"controls"],null),new R(null,7,5,S,[Vh,new v(null,1,[ri,"slidden"],null),new R(null,3,5,S,[Mh,new v(null,1,[ci,function(){return function(){var a=new R(null,
3,5,S,[uh,1,!0],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Roll"],null),new R(null,3,5,S,[Mh,new v(null,1,[ci,function(){return function(){var a=new R(null,3,5,S,[uh,100,!0],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Run"],null),new R(null,3,5,S,[Mh,new v(null,1,[ci,function(){return function(){var a=new R(null,3,5,S,[uh,100,!1],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Run Fast"],null),new R(null,3,5,S,[Mh,new v(null,1,[ci,
function(a,c,d,e,f,g,h,l,m){return function(){var a=new R(null,2,5,S,[lj,Ma(m)],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),y(m)?"Hide graphs":"Show graphs"],null),new R(null,3,5,S,[Mh,new v(null,1,[ci,function(a,c,d,e,f,g,h,l){return function(){var a=new R(null,2,5,S,[qi,Ma(l)],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),y(l)?"Hide averages":"Average"],null)],null),new R(null,7,5,S,[Vh,new v(null,1,[ri,"slidden"],null),new R(null,3,5,S,[Mh,new v(null,
1,[ci,function(){return function(){var a=new R(null,2,5,S,[Li,mj],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Basic"],null),new R(null,3,5,S,[Mh,new v(null,1,[ci,function(){return function(){var a=new R(null,2,5,S,[Li,Jh],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Efficient"],null),new R(null,3,5,S,[Mh,new v(null,1,[ci,function(){return function(){var a=new R(null,2,5,S,[Li,Oh],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Basic \x26 Efficient"],
null),new R(null,3,5,S,[Mh,new v(null,1,[ci,function(){return function(){var a=new R(null,2,5,S,[Li,li],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"Constrained"],null),new R(null,3,5,S,[Mh,new v(null,1,[ci,function(){return function(){var a=new R(null,2,5,S,[Li,ni],null);return b.b?b.b(a):b.call(null,a)}}(a,c,d,e,f,g,h,l,m)],null),"All 3"],null)],null)],null),new R(null,5,5,S,[bj,new v(null,3,[Si,"space",Zh,"100%",Mj,"100%"],null),function(){return function(a,b,c,d,e,f,g,h,
l){return function G(m){return new ee(null,function(){return function(){for(;;){var a=H(m);if(a){if(vd(a)){var b=Vb(a),c=M(b),d=ie(c);a:for(var e=0;;)if(e<c){var f=bb.a(b,e),g=null!=f&&(f.g&64||f.F)?E.a(Jc,f):f,f=g,h=F.a(g,sj),g=F.a(g,mh),f=y(h)?new R(null,3,5,S,[Gi,new v(null,1,[xh,Jn(h,g)],null),Kn(f)],null):null;d.add(f);e+=1}else{b=!0;break a}return b?je(d.W(),G(Wb(a))):je(d.W(),null)}d=J(a);d=c=null!=d&&(d.g&64||d.F)?E.a(Jc,d):d;b=F.a(c,sj);c=F.a(c,mh);return Wc(y(b)?new R(null,3,5,S,[Gi,new v(null,
1,[xh,Jn(b,c)],null),Kn(d)],null):null,G(xc(a)))}return null}}}(a,b,c,d,e,f,g,h,l),null,null)}}(a,c,d,e,f,g,h,l,m)(g)}(),P.a(Wn,h),y(y(d)?y(e)?m:e:d)?Yn(new R(null,2,5,S,[d,e],null),h,l):null],null)],null)};ta=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new wc(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,Ga.b?Ga.b(a):Ga.call(null,a))}a.w=0;a.D=function(a){a=H(a);return b(a)};a.j=b;return a}();
ua=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new wc(e,0)}return b.call(this,d)}function b(a){return console.error.apply(console,Ga.b?Ga.b(a):Ga.call(null,a))}a.w=0;a.D=function(a){a=H(a);return b(a)};a.j=b;return a}();
function ao(a){var b=new v(null,2,[sj,45,Zh,60],null),c=null!=b&&(b.g&64||b.F)?E.a(Jc,b):b,d=F.a(c,Zh),e=F.a(c,sj),f=Pe(1,Gh.b(J(Xe(Ah,Sh.b(a))))),g=P.a(Mj,f),h=P.a(mh,f);return df(a,Fe(P,function(a,b,c,d,e,f,g){return function(a,b,c){return jd.j(a,sj,g,uc([mh,b+c+(0-f/2-20),Zh,f,Mj,f],0))}}(f,g,h,b,c,d,e)),h,g)}if("undefined"===typeof yn)var yn=Tm(null);function $n(a){return Wm(yn,a)}if("undefined"===typeof bo)var bo=U.b?U.b(!1):U.call(null,!1);
function co(a,b){var c=Tm(1);Am(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!Q(e,W)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,lm(c),d=W;else throw f;}if(!Q(d,W))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(){return function(c){var d=c[1];if(7===d){var d=c[2],e=qn();c[7]=d;return hm(c,8,e)}if(20===d)return c[8]=c[2],c[1]=y(b)?21:22,W;if(27===d)return d=c[2],c[1]=y(d)?28:29,W;if(1===d)return im(c,2,yn,jj);if(24===d)return d=c[2],c[2]=d,c[1]=23,W;if(4===d)return d=new R(null,2,5,S,[Ch,!0],null),im(c,7,yn,d);if(15===d)return c[9]=c[2],im(c,19,yn,Dj);if(21===d)return c[2]=null,c[1]=23,W;if(31===
d)return d=c[2],c[2]=d,c[1]=30,W;if(13===d)return d=new R(null,2,5,S,[yi,!0],null),im(c,16,yn,d);if(22===d)return d=L.b?L.b(Bn):L.call(null,Bn),d=d.b?d.b(Fj):d.call(null,Fj),d=Rm(d),hm(c,24,d);if(29===d)return c[2]=null,c[1]=30,W;if(6===d)return c[10]=c[2],im(c,10,yn,ij);if(28===d)return d=c[11],d=new R(null,3,5,S,[uh,d,b],null),im(c,31,yn,d);if(25===d)return d=c[11],c[2]=0<d,c[1]=27,W;if(17===d)return d=new R(null,2,5,S,[yi,!1],null),c[12]=c[2],im(c,18,yn,d);if(3===d)return c[13]=c[2],c[1]=y(b)?
4:5,W;if(12===d)return c[14]=c[2],c[1]=y(b)?13:14,W;if(2===d)return c[15]=c[2],im(c,3,yn,qh);if(23===d){var d=c[16],e=c[2],d=a-1,f=L.b?L.b(bo):L.call(null,bo);c[16]=f;c[17]=e;c[11]=d;c[1]=y(f)?25:26;return W}return 19===d?(c[18]=c[2],im(c,20,yn,Hi)):11===d?(c[19]=c[2],im(c,12,yn,Ji)):9===d?(d=c[2],c[2]=d,c[1]=6,W):5===d?(c[2]=null,c[1]=6,W):14===d?(c[2]=null,c[1]=15,W):26===d?(d=c[16],c[2]=d,c[1]=27,W):16===d?(d=c[2],e=qn(),c[20]=d,hm(c,17,e)):30===d?(d=c[2],jm(c,d)):10===d?(c[21]=c[2],im(c,11,yn,
Ii)):18===d?(d=c[2],c[2]=d,c[1]=15,W):8===d?(d=new R(null,2,5,S,[Ch,!1],null),c[22]=c[2],im(c,9,yn,d)):null}}(c),c)}(),f=function(){var a=e.l?e.l():e.call(null);a[6]=c;return a}();return gm(f)}}(c))}
function eo(){var a=Tm(1);Am(function(a){return function(){var c=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var f=a(c);if(!Q(f,W)){d=f;break a}}}catch(g){if(g instanceof Object)c[5]=g,lm(c),d=W;else throw g;}if(!Q(d,W))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.l=c;d.b=b;return d}()}(function(a){return function(b){var c=b[1];if(1===c){var d=Rm(50);return hm(b,2,d)}if(2===c){var l=b[2],m=function(){return function(){return function(a){return a.width}}(l,c,a)}(),d=Eg(m,function(){return function(){return function(a){return a.height}}(l,m,c,a)}()),n=document.getElementById("space").getBoundingClientRect(),n=d.b?d.b(n):d.call(null,n),d=N(n,0),n=N(n,1),d=Wm(yn,new R(null,3,5,S,[si,d,n],null)),n=Rm(100);b[7]=l;b[8]=d;return hm(b,3,n)}if(3===
c){var d=b[2],n=Wm(yn,yj),p=Rm(100);b[9]=n;b[10]=d;return hm(b,4,p)}return 4===c?(d=b[2],n=Wm(yn,Ji),b[11]=d,jm(b,n)):null}}(a),a)}(),d=function(){var d=c.l?c.l():c.call(null);d[6]=a;return d}();return gm(d)}}(a))}
function fo(a){var b=Tl(a),c=a.b?a.b(Fj):a.call(null,Fj),d=Tm(1);Am(function(b,c,d,h){return function(){var l=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!Q(e,W)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,lm(c),d=W;else throw f;}if(!Q(d,W))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(b,c,d,e){return function(b){var f=b[1];if(7===f)return b[2]=null,b[1]=8,W;if(1===f)return f=Pl(a),f=new R(null,2,5,S,[pj,f],null),im(b,2,yn,f);if(4===f)return f=b[7],b[1]=y(50>f)?6:7,W;if(6===f){a:for(var f=0,g=fl(Ol);;)if(f<d)f+=1,g=Ml(g);else{f=g;break a}f=c.b?c.b(f):c.call(null,f);f=new R(null,2,5,S,[pj,f],null);return im(b,9,yn,f)}return 3===f?(f=b[2],b[8]=f,b[7]=0,b[2]=null,b[1]=4,
W):2===f?(f=b[2],g=Rm(e),b[9]=f,hm(b,3,g)):9===f?(f=b[2],g=Rm(e),b[10]=f,hm(b,10,g)):5===f?(f=b[2],jm(b,f)):10===f?(f=b[7],g=b[2],b[7]=f+1,b[11]=g,b[2]=null,b[1]=4,W):8===f?(f=b[2],b[2]=f,b[1]=5,W):null}}(b,c,d,h),b,c,d,h)}(),m=function(){var a=l.l?l.l():l.call(null);a[6]=b;return a}();return gm(m)}}(d,b,c,100))}
function wn(a,b){var c=null!=a&&(a.g&64||a.F)?E.a(Jc,a):a,d=F.a(c,Sh);try{if(Q(b,vi))return c;throw hn;}catch(e){if(e instanceof Error)if(e===hn)try{if(sd(b)&&3===M(b))try{var f=hd(b,0);if(Q(f,si)){var g=hd(b,1),h=hd(b,2);return ao(bf(jd.j(c,Zh,g,uc([Mj,h],0)),Sh,Fe(dl,new v(null,3,[sj,150,Zh,g-150,Mj,h],null))))}throw hn;}catch(l){if(l instanceof Error){f=l;if(f===hn)throw hn;throw f;}throw l;}else throw hn;}catch(m){if(m instanceof Error)if(f=m,f===hn)try{if(Q(b,yj))return hl(c,function(){return function(a){a=
null!=a&&(a.g&64||a.F)?E.a(Jc,a):a;var b=F.a(a,Si),b=Dn(b);return y(b)?jd.c(a,dj,b.getTotalLength()):a}}(f,e,a,c,c,d));throw hn;}catch(n){if(n instanceof Error)if(n===hn)try{if(sd(b)&&2===M(b))try{var p=hd(b,0);if(Q(p,Li)){var q=hd(b,1);Le.a?Le.a(bo,!1):Le.call(null,bo,!1);eo();return fl(Ll.b?Ll.b(q):Ll.call(null,q))}throw hn;}catch(r){if(r instanceof Error){p=r;if(p===hn)throw hn;throw p;}throw r;}else throw hn;}catch(t){if(t instanceof Error)if(p=t,p===hn)try{if(sd(b)&&3===M(b))try{var w=hd(b,0);
if(Q(w,uh)){var x=hd(b,1),B=hd(b,2);Le.a?Le.a(bo,!0):Le.call(null,bo,!0);co(x,B);return c}throw hn;}catch(D){if(D instanceof Error){w=D;if(w===hn)throw hn;throw w;}throw D;}else throw hn;}catch(I){if(I instanceof Error)if(w=I,w===hn)try{if(Q(b,jj))return jl(bf(c,Fj,Nc),Re(function(){return function(){return 6*Math.random()+1|0}}(w,p,n,f,e,a,c,c,d)));throw hn;}catch(G){if(G instanceof Error)if(G===hn)try{if(Q(b,qh))return ml(c);throw hn;}catch(ja){if(ja instanceof Error)if(ja===hn)try{if(sd(b)&&2===
M(b))try{var A=hd(b,0);if(Q(A,Ch)){var Z=hd(b,1);return hl(c,function(a){return function(b){return jd.c(b,mi,a)}}(Z,A,ja,G,w,p,n,f,e,a,c,c,d))}throw hn;}catch(ea){if(ea instanceof Error){A=ea;if(A===hn)throw hn;throw A;}throw ea;}else throw hn;}catch(O){if(O instanceof Error)if(A=O,A===hn)try{if(Q(b,ij))return wl(c);throw hn;}catch(V){if(V instanceof Error)if(V===hn)try{if(Q(b,Ii))return yl(c);throw hn;}catch(T){if(T instanceof Error)if(T===hn)try{if(Q(b,Ji))return xl(c);throw hn;}catch(X){if(X instanceof
Error)if(X===hn)try{if(sd(b)&&2===M(b))try{var fa=hd(b,0);if(Q(fa,yi))return Z=hd(b,1),hl(c,function(a){return function(b){return jd.c(b,qj,a)}}(Z,fa,X,T,V,A,ja,G,w,p,n,f,e,a,c,c,d));throw hn;}catch(na){if(na instanceof Error){d=na;if(d===hn)throw hn;throw d;}throw na;}else throw hn;}catch(oa){if(oa instanceof Error)if(d=oa,d===hn)try{if(Q(b,Dj))return zl(c);throw hn;}catch(qa){if(qa instanceof Error)if(qa===hn)try{if(Q(b,Hi))return Bl(c);throw hn;}catch(va){if(va instanceof Error)if(va===hn)try{if(sd(b)&&
2===M(b))try{var La=hd(b,0);if(Q(La,lj))return Z=hd(b,1),jd.c(c,Kh,Z);throw hn;}catch(Aa){if(Aa instanceof Error)if(d=Aa,d===hn)try{La=hd(b,0);if(Q(La,qi))return Z=hd(b,1),y(Z)?(fo(c),c):ld.a(c,qi);throw hn;}catch(Da){if(Da instanceof Error)if(Da===hn)try{La=hd(b,0);if(Q(La,pj)){var Ha=hd(b,1);return jd.c(c,qi,Ha)}throw hn;}catch(Sa){if(Sa instanceof Error&&Sa===hn)throw hn;throw Sa;}else throw Da;else throw Da;}else throw d;else throw Aa;}else throw hn;}catch(Ta){if(Ta instanceof Error){d=Ta;if(d===
hn)throw Error([C("No matching clause: "),C(b)].join(""));throw d;}throw Ta;}else throw va;else throw va;}else throw qa;else throw qa;}else throw d;else throw oa;}else throw X;else throw X;}else throw T;else throw T;}else throw V;else throw V;}else throw A;else throw O;}else throw ja;else throw ja;}else throw G;else throw G;}else throw w;else throw I;}else throw p;else throw t;}else throw n;else throw n;}else throw f;else throw m;}else throw e;else throw e;}}var xn=fl(Ll.b?Ll.b(mj):Ll.call(null,mj));
if("undefined"===typeof Ym)var Ym=vn();if("undefined"===typeof go){var An;An=Xm(function(a){return Zn(a)});var go;go=zn()}eo();