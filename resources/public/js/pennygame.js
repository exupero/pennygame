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

var h,aa=this;function da(b,a){var c=b.split("."),d=aa;c[0]in d||!d.execScript||d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)c.length||void 0===a?d=d[e]?d[e]:d[e]={}:d[e]=a}
function u(b){var a=typeof b;if("object"==a)if(b){if(b instanceof Array)return"array";if(b instanceof Object)return a;var c=Object.prototype.toString.call(b);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof b.length&&"undefined"!=typeof b.splice&&"undefined"!=typeof b.propertyIsEnumerable&&!b.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof b.call&&"undefined"!=typeof b.propertyIsEnumerable&&!b.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==a&&"undefined"==typeof b.call)return"object";return a}function fa(b){return"function"==u(b)}var ha="closure_uid_"+(1E9*Math.random()>>>0),ia=0;function ka(b,a,c){return b.call.apply(b.bind,arguments)}function ma(b,a,c){if(!b)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return b.apply(a,c)}}return function(){return b.apply(a,arguments)}}
function qa(b,a,c){qa=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ka:ma;return qa.apply(null,arguments)};function ra(b,a){for(var c in b)a.call(void 0,b[c],c,b)};function sa(b,a){null!=b&&this.append.apply(this,arguments)}h=sa.prototype;h.hb="";h.set=function(b){this.hb=""+b};h.append=function(b,a,c){this.hb+=b;if(null!=a)for(var d=1;d<arguments.length;d++)this.hb+=arguments[d];return this};h.clear=function(){this.hb=""};h.toString=function(){return this.hb};function ta(b,a){return b>a?1:b<a?-1:0};var ua={},va;if("undefined"===typeof wa)var wa=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof xa)var xa=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var ya=null;if("undefined"===typeof Ba)var Ba=null;function Ca(){return new v(null,5,[Da,!0,Fa,!0,Ga,!1,Ha,!1,Ia,null],null)}Ja;function x(b){return null!=b&&!1!==b}La;y;function Ma(b){return null==b}function Na(b){return b instanceof Array}
function Oa(b){return null==b?!0:!1===b?!0:!1}function Pa(b,a){return b[u(null==a?null:a)]?!0:b._?!0:!1}function B(b,a){var c=null==a?null:a.constructor,c=x(x(c)?c.xb:c)?c.eb:u(a);return Error(["No protocol method ",b," defined for type ",c,": ",a].join(""))}function Qa(b){var a=b.eb;return x(a)?a:""+D(b)}var Ra="undefined"!==typeof Symbol&&"function"===u(Symbol)?Symbol.iterator:"@@iterator";function Ua(b){for(var a=b.length,c=Array(a),d=0;;)if(d<a)c[d]=b[d],d+=1;else break;return c}F;Va;
var Ja=function Ja(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ja.b(arguments[0]);case 2:return Ja.a(arguments[0],arguments[1]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};Ja.b=function(b){return Ja.a(null,b)};Ja.a=function(b,a){function c(a,b){a.push(b);return a}var d=[];return Va.c?Va.c(c,d,a):Va.call(null,c,d,a)};Ja.w=2;function Wa(){}function Xa(){}
var Ya=function Ya(a){if(null!=a&&null!=a.X)return a.X(a);var c=Ya[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Ya._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("ICounted.-count",a);},$a=function $a(a){if(null!=a&&null!=a.da)return a.da(a);var c=$a[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=$a._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IEmptyableCollection.-empty",a);};function ab(){}
var bb=function bb(a,c){if(null!=a&&null!=a.W)return a.W(a,c);var d=bb[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=bb._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("ICollection.-conj",a);};function cb(){}
var G=function G(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return G.a(arguments[0],arguments[1]);case 3:return G.c(arguments[0],arguments[1],arguments[2]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};
G.a=function(b,a){if(null!=b&&null!=b.ca)return b.ca(b,a);var c=G[u(null==b?null:b)];if(null!=c)return c.a?c.a(b,a):c.call(null,b,a);c=G._;if(null!=c)return c.a?c.a(b,a):c.call(null,b,a);throw B("IIndexed.-nth",b);};G.c=function(b,a,c){if(null!=b&&null!=b.Ea)return b.Ea(b,a,c);var d=G[u(null==b?null:b)];if(null!=d)return d.c?d.c(b,a,c):d.call(null,b,a,c);d=G._;if(null!=d)return d.c?d.c(b,a,c):d.call(null,b,a,c);throw B("IIndexed.-nth",b);};G.w=3;function db(){}
var eb=function eb(a){if(null!=a&&null!=a.ta)return a.ta(a);var c=eb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=eb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("ISeq.-first",a);},fb=function fb(a){if(null!=a&&null!=a.xa)return a.xa(a);var c=fb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=fb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("ISeq.-rest",a);};function hb(){}function ib(){}
var jb=function jb(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return jb.a(arguments[0],arguments[1]);case 3:return jb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};
jb.a=function(b,a){if(null!=b&&null!=b.N)return b.N(b,a);var c=jb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b,a):c.call(null,b,a);c=jb._;if(null!=c)return c.a?c.a(b,a):c.call(null,b,a);throw B("ILookup.-lookup",b);};jb.c=function(b,a,c){if(null!=b&&null!=b.I)return b.I(b,a,c);var d=jb[u(null==b?null:b)];if(null!=d)return d.c?d.c(b,a,c):d.call(null,b,a,c);d=jb._;if(null!=d)return d.c?d.c(b,a,c):d.call(null,b,a,c);throw B("ILookup.-lookup",b);};jb.w=3;
var kb=function kb(a,c){if(null!=a&&null!=a.lc)return a.lc(a,c);var d=kb[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=kb._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("IAssociative.-contains-key?",a);},lb=function lb(a,c,d){if(null!=a&&null!=a.Oa)return a.Oa(a,c,d);var e=lb[u(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=lb._;if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw B("IAssociative.-assoc",a);};function mb(){}
var nb=function nb(a,c){if(null!=a&&null!=a.ib)return a.ib(a,c);var d=nb[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=nb._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("IMap.-dissoc",a);};function ob(){}
var pb=function pb(a){if(null!=a&&null!=a.Mb)return a.Mb(a);var c=pb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=pb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IMapEntry.-key",a);},qb=function qb(a){if(null!=a&&null!=a.Nb)return a.Nb(a);var c=qb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=qb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IMapEntry.-val",a);};function rb(){}
var sb=function sb(a){if(null!=a&&null!=a.jb)return a.jb(a);var c=sb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=sb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IStack.-peek",a);};function tb(){}
var ub=function ub(a,c,d){if(null!=a&&null!=a.kb)return a.kb(a,c,d);var e=ub[u(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=ub._;if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw B("IVector.-assoc-n",a);},vb=function vb(a){if(null!=a&&null!=a.Jb)return a.Jb(a);var c=vb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=vb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IDeref.-deref",a);};function wb(){}
var xb=function xb(a){if(null!=a&&null!=a.O)return a.O(a);var c=xb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=xb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IMeta.-meta",a);},yb=function yb(a,c){if(null!=a&&null!=a.P)return a.P(a,c);var d=yb[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=yb._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("IWithMeta.-with-meta",a);};function zb(){}
var Ab=function Ab(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ab.a(arguments[0],arguments[1]);case 3:return Ab.c(arguments[0],arguments[1],arguments[2]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};
Ab.a=function(b,a){if(null!=b&&null!=b.ea)return b.ea(b,a);var c=Ab[u(null==b?null:b)];if(null!=c)return c.a?c.a(b,a):c.call(null,b,a);c=Ab._;if(null!=c)return c.a?c.a(b,a):c.call(null,b,a);throw B("IReduce.-reduce",b);};Ab.c=function(b,a,c){if(null!=b&&null!=b.fa)return b.fa(b,a,c);var d=Ab[u(null==b?null:b)];if(null!=d)return d.c?d.c(b,a,c):d.call(null,b,a,c);d=Ab._;if(null!=d)return d.c?d.c(b,a,c):d.call(null,b,a,c);throw B("IReduce.-reduce",b);};Ab.w=3;
var Bb=function Bb(a,c,d){if(null!=a&&null!=a.Lb)return a.Lb(a,c,d);var e=Bb[u(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=Bb._;if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw B("IKVReduce.-kv-reduce",a);},Cb=function Cb(a,c){if(null!=a&&null!=a.C)return a.C(a,c);var d=Cb[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=Cb._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("IEquiv.-equiv",a);},Db=function Db(a){if(null!=a&&null!=a.T)return a.T(a);
var c=Db[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Db._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IHash.-hash",a);};function Eb(){}var Fb=function Fb(a){if(null!=a&&null!=a.U)return a.U(a);var c=Fb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Fb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("ISeqable.-seq",a);};function Gb(){}function Hb(){}function Ib(){}
var Jb=function Jb(a){if(null!=a&&null!=a.bc)return a.bc(a);var c=Jb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Jb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IReversible.-rseq",a);},Kb=function Kb(a,c){if(null!=a&&null!=a.Bc)return a.Bc(0,c);var d=Kb[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=Kb._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("IWriter.-write",a);},Lb=function Lb(a,c,d){if(null!=a&&null!=a.M)return a.M(a,c,d);var e=
Lb[u(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=Lb._;if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw B("IPrintWithWriter.-pr-writer",a);},Mb=function Mb(a,c,d){if(null!=a&&null!=a.Ac)return a.Ac(0,c,d);var e=Mb[u(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=Mb._;if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw B("IWatchable.-notify-watches",a);},Nb=function Nb(a){if(null!=a&&null!=a.vb)return a.vb(a);var c=Nb[u(null==a?null:
a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Nb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IEditableCollection.-as-transient",a);},Ob=function Ob(a,c){if(null!=a&&null!=a.Rb)return a.Rb(a,c);var d=Ob[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=Ob._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("ITransientCollection.-conj!",a);},Qb=function Qb(a){if(null!=a&&null!=a.Sb)return a.Sb(a);var c=Qb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,
a);c=Qb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("ITransientCollection.-persistent!",a);},Rb=function Rb(a,c,d){if(null!=a&&null!=a.Qb)return a.Qb(a,c,d);var e=Rb[u(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=Rb._;if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw B("ITransientAssociative.-assoc!",a);},Sb=function Sb(a,c,d){if(null!=a&&null!=a.zc)return a.zc(0,c,d);var e=Sb[u(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=Sb._;
if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw B("ITransientVector.-assoc-n!",a);};function Tb(){}
var Ub=function Ub(a,c){if(null!=a&&null!=a.ub)return a.ub(a,c);var d=Ub[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=Ub._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("IComparable.-compare",a);},Vb=function Vb(a){if(null!=a&&null!=a.wc)return a.wc();var c=Vb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Vb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IChunk.-drop-first",a);},Wb=function Wb(a){if(null!=a&&null!=a.nc)return a.nc(a);var c=
Wb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Wb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IChunkedSeq.-chunked-first",a);},Xb=function Xb(a){if(null!=a&&null!=a.oc)return a.oc(a);var c=Xb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Xb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IChunkedSeq.-chunked-rest",a);},Yb=function Yb(a){if(null!=a&&null!=a.mc)return a.mc(a);var c=Yb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,
a);c=Yb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IChunkedNext.-chunked-next",a);},Zb=function Zb(a){if(null!=a&&null!=a.Ob)return a.Ob(a);var c=Zb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Zb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("INamed.-name",a);},$b=function $b(a){if(null!=a&&null!=a.Pb)return a.Pb(a);var c=$b[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=$b._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("INamed.-namespace",
a);},ac=function ac(a,c){if(null!=a&&null!=a.Zc)return a.Zc(a,c);var d=ac[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=ac._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("IReset.-reset!",a);},bc=function bc(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return bc.a(arguments[0],arguments[1]);case 3:return bc.c(arguments[0],arguments[1],arguments[2]);case 4:return bc.o(arguments[0],arguments[1],arguments[2],
arguments[3]);case 5:return bc.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};bc.a=function(b,a){if(null!=b&&null!=b.ad)return b.ad(b,a);var c=bc[u(null==b?null:b)];if(null!=c)return c.a?c.a(b,a):c.call(null,b,a);c=bc._;if(null!=c)return c.a?c.a(b,a):c.call(null,b,a);throw B("ISwap.-swap!",b);};
bc.c=function(b,a,c){if(null!=b&&null!=b.bd)return b.bd(b,a,c);var d=bc[u(null==b?null:b)];if(null!=d)return d.c?d.c(b,a,c):d.call(null,b,a,c);d=bc._;if(null!=d)return d.c?d.c(b,a,c):d.call(null,b,a,c);throw B("ISwap.-swap!",b);};bc.o=function(b,a,c,d){if(null!=b&&null!=b.cd)return b.cd(b,a,c,d);var e=bc[u(null==b?null:b)];if(null!=e)return e.o?e.o(b,a,c,d):e.call(null,b,a,c,d);e=bc._;if(null!=e)return e.o?e.o(b,a,c,d):e.call(null,b,a,c,d);throw B("ISwap.-swap!",b);};
bc.A=function(b,a,c,d,e){if(null!=b&&null!=b.dd)return b.dd(b,a,c,d,e);var f=bc[u(null==b?null:b)];if(null!=f)return f.A?f.A(b,a,c,d,e):f.call(null,b,a,c,d,e);f=bc._;if(null!=f)return f.A?f.A(b,a,c,d,e):f.call(null,b,a,c,d,e);throw B("ISwap.-swap!",b);};bc.w=5;var cc=function cc(a){if(null!=a&&null!=a.Ga)return a.Ga(a);var c=cc[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=cc._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IIterable.-iterator",a);};
function dc(b){this.rd=b;this.g=1073741824;this.B=0}dc.prototype.Bc=function(b,a){return this.rd.append(a)};function ec(b){var a=new sa;b.M(null,new dc(a),Ca());return""+D(a)}var fc="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(b,a){return Math.imul(b,a)}:function(b,a){var c=b&65535,d=a&65535;return c*d+((b>>>16&65535)*d+c*(a>>>16&65535)<<16>>>0)|0};function gc(b){b=fc(b|0,-862048943);return fc(b<<15|b>>>-15,461845907)}
function hc(b,a){var c=(b|0)^(a|0);return fc(c<<13|c>>>-13,5)+-430675100|0}function ic(b,a){var c=(b|0)^a,c=fc(c^c>>>16,-2048144789),c=fc(c^c>>>13,-1028477387);return c^c>>>16}function jc(b){var a;a:{a=1;for(var c=0;;)if(a<b.length){var d=a+2,c=hc(c,gc(b.charCodeAt(a-1)|b.charCodeAt(a)<<16));a=d}else{a=c;break a}}a=1===(b.length&1)?a^gc(b.charCodeAt(b.length-1)):a;return ic(a,fc(2,b.length))}kc;lc;mc;nc;var oc={},pc=0;
function qc(b){255<pc&&(oc={},pc=0);var a=oc[b];if("number"!==typeof a){a:if(null!=b)if(a=b.length,0<a)for(var c=0,d=0;;)if(c<a)var e=c+1,d=fc(31,d)+b.charCodeAt(c),c=e;else{a=d;break a}else a=0;else a=0;oc[b]=a;pc+=1}return b=a}function rc(b){null!=b&&(b.g&4194304||b.xd)?b=b.T(null):"number"===typeof b?b=Math.floor(b)%2147483647:!0===b?b=1:!1===b?b=0:"string"===typeof b?(b=qc(b),0!==b&&(b=gc(b),b=hc(0,b),b=ic(b,4))):b=b instanceof Date?b.valueOf():null==b?0:Db(b);return b}
function sc(b,a){return b^a+2654435769+(b<<6)+(b>>2)}function La(b,a){return a instanceof b}function tc(b,a){if(b.$a===a.$a)return 0;var c=Oa(b.Ba);if(x(c?a.Ba:c))return-1;if(x(b.Ba)){if(Oa(a.Ba))return 1;c=ta(b.Ba,a.Ba);return 0===c?ta(b.name,a.name):c}return ta(b.name,a.name)}H;function lc(b,a,c,d,e){this.Ba=b;this.name=a;this.$a=c;this.tb=d;this.Da=e;this.g=2154168321;this.B=4096}h=lc.prototype;h.toString=function(){return this.$a};h.equiv=function(b){return this.C(null,b)};
h.C=function(b,a){return a instanceof lc?this.$a===a.$a:!1};h.call=function(){function b(a,b,c){return H.c?H.c(b,this,c):H.call(null,b,this,c)}function a(a,b){return H.a?H.a(b,this):H.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return a.call(this,0,e);case 3:return b.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=a;c.c=b;return c}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ua(a)))};
h.b=function(b){return H.a?H.a(b,this):H.call(null,b,this)};h.a=function(b,a){return H.c?H.c(b,this,a):H.call(null,b,this,a)};h.O=function(){return this.Da};h.P=function(b,a){return new lc(this.Ba,this.name,this.$a,this.tb,a)};h.T=function(){var b=this.tb;return null!=b?b:this.tb=b=sc(jc(this.name),qc(this.Ba))};h.Ob=function(){return this.name};h.Pb=function(){return this.Ba};h.M=function(b,a){return Kb(a,this.$a)};
var uc=function uc(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return uc.b(arguments[0]);case 2:return uc.a(arguments[0],arguments[1]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};uc.b=function(b){if(b instanceof lc)return b;var a=b.indexOf("/");return-1===a?uc.a(null,b):uc.a(b.substring(0,a),b.substring(a+1,b.length))};uc.a=function(b,a){var c=null!=b?[D(b),D("/"),D(a)].join(""):a;return new lc(b,a,c,null,null)};
uc.w=2;I;wc;xc;function J(b){if(null==b)return null;if(null!=b&&(b.g&8388608||b.$c))return b.U(null);if(Na(b)||"string"===typeof b)return 0===b.length?null:new xc(b,0);if(Pa(Eb,b))return Fb(b);throw Error([D(b),D(" is not ISeqable")].join(""));}function L(b){if(null==b)return null;if(null!=b&&(b.g&64||b.G))return b.ta(null);b=J(b);return null==b?null:eb(b)}function yc(b){return null!=b?null!=b&&(b.g&64||b.G)?b.xa(null):(b=J(b))?fb(b):zc:zc}
function N(b){return null==b?null:null!=b&&(b.g&128||b.ac)?b.wa(null):J(yc(b))}var mc=function mc(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return mc.b(arguments[0]);case 2:return mc.a(arguments[0],arguments[1]);default:return mc.j(arguments[0],arguments[1],new xc(c.slice(2),0))}};mc.b=function(){return!0};mc.a=function(b,a){return null==b?null==a:b===a||Cb(b,a)};
mc.j=function(b,a,c){for(;;)if(mc.a(b,a))if(N(c))b=a,a=L(c),c=N(c);else return mc.a(a,L(c));else return!1};mc.D=function(b){var a=L(b),c=N(b);b=L(c);c=N(c);return mc.j(a,b,c)};mc.w=2;function Ac(b){this.J=b}Ac.prototype.next=function(){if(null!=this.J){var b=L(this.J);this.J=N(this.J);return{value:b,done:!1}}return{value:null,done:!0}};function Bc(b){return new Ac(J(b))}Cc;function Dc(b,a,c){this.value=b;this.Db=a;this.jc=c;this.g=8388672;this.B=0}Dc.prototype.U=function(){return this};
Dc.prototype.ta=function(){return this.value};Dc.prototype.xa=function(){null==this.jc&&(this.jc=Cc.b?Cc.b(this.Db):Cc.call(null,this.Db));return this.jc};function Cc(b){var a=b.next();return x(a.done)?zc:new Dc(a.value,b,null)}function Ec(b,a){var c=gc(b),c=hc(0,c);return ic(c,a)}function Fc(b){var a=0,c=1;for(b=J(b);;)if(null!=b)a+=1,c=fc(31,c)+rc(L(b))|0,b=N(b);else return Ec(c,a)}var Gc=Ec(1,0);function Hc(b){var a=0,c=0;for(b=J(b);;)if(null!=b)a+=1,c=c+rc(L(b))|0,b=N(b);else return Ec(c,a)}
var Ic=Ec(0,0);Jc;kc;Kc;Xa["null"]=!0;Ya["null"]=function(){return 0};Date.prototype.C=function(b,a){return a instanceof Date&&this.valueOf()===a.valueOf()};Date.prototype.Ib=!0;Date.prototype.ub=function(b,a){if(a instanceof Date)return ta(this.valueOf(),a.valueOf());throw Error([D("Cannot compare "),D(this),D(" to "),D(a)].join(""));};Cb.number=function(b,a){return b===a};Lc;Wa["function"]=!0;wb["function"]=!0;xb["function"]=function(){return null};Db._=function(b){return b[ha]||(b[ha]=++ia)};
function Mc(b){return b+1}O;function Nc(b){this.H=b;this.g=32768;this.B=0}Nc.prototype.Jb=function(){return this.H};function Oc(b){return b instanceof Nc}function O(b){return vb(b)}function Pc(b,a){var c=Ya(b);if(0===c)return a.l?a.l():a.call(null);for(var d=G.a(b,0),e=1;;)if(e<c){var f=G.a(b,e),d=a.a?a.a(d,f):a.call(null,d,f);if(Oc(d))return vb(d);e+=1}else return d}
function Qc(b,a,c){var d=Ya(b),e=c;for(c=0;;)if(c<d){var f=G.a(b,c),e=a.a?a.a(e,f):a.call(null,e,f);if(Oc(e))return vb(e);c+=1}else return e}function Rc(b,a){var c=b.length;if(0===b.length)return a.l?a.l():a.call(null);for(var d=b[0],e=1;;)if(e<c){var f=b[e],d=a.a?a.a(d,f):a.call(null,d,f);if(Oc(d))return vb(d);e+=1}else return d}function Sc(b,a,c){var d=b.length,e=c;for(c=0;;)if(c<d){var f=b[c],e=a.a?a.a(e,f):a.call(null,e,f);if(Oc(e))return vb(e);c+=1}else return e}
function Tc(b,a,c,d){for(var e=b.length;;)if(d<e){var f=b[d];c=a.a?a.a(c,f):a.call(null,c,f);if(Oc(c))return vb(c);d+=1}else return c}Uc;Vc;Wc;Xc;function Yc(b){return null!=b?b.g&2||b.Qc?!0:b.g?!1:Pa(Xa,b):Pa(Xa,b)}function Zc(b){return null!=b?b.g&16||b.xc?!0:b.g?!1:Pa(cb,b):Pa(cb,b)}function $c(b,a){this.f=b;this.s=a}$c.prototype.ya=function(){return this.s<this.f.length};$c.prototype.next=function(){var b=this.f[this.s];this.s+=1;return b};
function xc(b,a){this.f=b;this.s=a;this.g=166199550;this.B=8192}h=xc.prototype;h.toString=function(){return ec(this)};h.equiv=function(b){return this.C(null,b)};h.ca=function(b,a){var c=a+this.s;return c<this.f.length?this.f[c]:null};h.Ea=function(b,a,c){b=a+this.s;return b<this.f.length?this.f[b]:c};h.Ga=function(){return new $c(this.f,this.s)};h.wa=function(){return this.s+1<this.f.length?new xc(this.f,this.s+1):null};h.X=function(){var b=this.f.length-this.s;return 0>b?0:b};
h.bc=function(){var b=Ya(this);return 0<b?new Wc(this,b-1,null):null};h.T=function(){return Fc(this)};h.C=function(b,a){return Kc.a?Kc.a(this,a):Kc.call(null,this,a)};h.da=function(){return zc};h.ea=function(b,a){return Tc(this.f,a,this.f[this.s],this.s+1)};h.fa=function(b,a,c){return Tc(this.f,a,c,this.s)};h.ta=function(){return this.f[this.s]};h.xa=function(){return this.s+1<this.f.length?new xc(this.f,this.s+1):zc};h.U=function(){return this.s<this.f.length?this:null};
h.W=function(b,a){return Vc.a?Vc.a(a,this):Vc.call(null,a,this)};xc.prototype[Ra]=function(){return Bc(this)};var wc=function wc(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return wc.b(arguments[0]);case 2:return wc.a(arguments[0],arguments[1]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};wc.b=function(b){return wc.a(b,0)};wc.a=function(b,a){return a<b.length?new xc(b,a):null};wc.w=2;
var I=function I(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return I.b(arguments[0]);case 2:return I.a(arguments[0],arguments[1]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};I.b=function(b){return wc.a(b,0)};I.a=function(b,a){return wc.a(b,a)};I.w=2;Lc;ad;function Wc(b,a,c){this.$b=b;this.s=a;this.v=c;this.g=32374990;this.B=8192}h=Wc.prototype;h.toString=function(){return ec(this)};
h.equiv=function(b){return this.C(null,b)};h.O=function(){return this.v};h.wa=function(){return 0<this.s?new Wc(this.$b,this.s-1,null):null};h.X=function(){return this.s+1};h.T=function(){return Fc(this)};h.C=function(b,a){return Kc.a?Kc.a(this,a):Kc.call(null,this,a)};h.da=function(){var b=zc,a=this.v;return Lc.a?Lc.a(b,a):Lc.call(null,b,a)};h.ea=function(b,a){return ad.a?ad.a(a,this):ad.call(null,a,this)};h.fa=function(b,a,c){return ad.c?ad.c(a,c,this):ad.call(null,a,c,this)};
h.ta=function(){return G.a(this.$b,this.s)};h.xa=function(){return 0<this.s?new Wc(this.$b,this.s-1,null):zc};h.U=function(){return this};h.P=function(b,a){return new Wc(this.$b,this.s,a)};h.W=function(b,a){return Vc.a?Vc.a(a,this):Vc.call(null,a,this)};Wc.prototype[Ra]=function(){return Bc(this)};function bd(b){return L(N(b))}function cd(b){for(;;){var a=N(b);if(null!=a)b=a;else return L(b)}}Cb._=function(b,a){return b===a};
var dd=function dd(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return dd.l();case 1:return dd.b(arguments[0]);case 2:return dd.a(arguments[0],arguments[1]);default:return dd.j(arguments[0],arguments[1],new xc(c.slice(2),0))}};dd.l=function(){return ed};dd.b=function(b){return b};dd.a=function(b,a){return null!=b?bb(b,a):bb(zc,a)};dd.j=function(b,a,c){for(;;)if(x(c))b=dd.a(b,a),a=L(c),c=N(c);else return dd.a(b,a)};
dd.D=function(b){var a=L(b),c=N(b);b=L(c);c=N(c);return dd.j(a,b,c)};dd.w=2;function P(b){if(null!=b)if(null!=b&&(b.g&2||b.Qc))b=b.X(null);else if(Na(b))b=b.length;else if("string"===typeof b)b=b.length;else if(null!=b&&(b.g&8388608||b.$c))a:{b=J(b);for(var a=0;;){if(Yc(b)){b=a+Ya(b);break a}b=N(b);a+=1}}else b=Ya(b);else b=0;return b}function fd(b,a){for(var c=null;;){if(null==b)return c;if(0===a)return J(b)?L(b):c;if(Zc(b))return G.c(b,a,c);if(J(b)){var d=N(b),e=a-1;b=d;a=e}else return c}}
function gd(b,a){if("number"!==typeof a)throw Error("index argument to nth must be a number");if(null==b)return b;if(null!=b&&(b.g&16||b.xc))return b.ca(null,a);if(Na(b))return a<b.length?b[a]:null;if("string"===typeof b)return a<b.length?b.charAt(a):null;if(null!=b&&(b.g&64||b.G)){var c;a:{c=b;for(var d=a;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(J(c)){c=L(c);break a}throw Error("Index out of bounds");}if(Zc(c)){c=G.a(c,d);break a}if(J(c))c=N(c),--d;else throw Error("Index out of bounds");
}}return c}if(Pa(cb,b))return G.a(b,a);throw Error([D("nth not supported on this type "),D(Qa(null==b?null:b.constructor))].join(""));}
function Q(b,a){if("number"!==typeof a)throw Error("index argument to nth must be a number.");if(null==b)return null;if(null!=b&&(b.g&16||b.xc))return b.Ea(null,a,null);if(Na(b))return a<b.length?b[a]:null;if("string"===typeof b)return a<b.length?b.charAt(a):null;if(null!=b&&(b.g&64||b.G))return fd(b,a);if(Pa(cb,b))return G.a(b,a);throw Error([D("nth not supported on this type "),D(Qa(null==b?null:b.constructor))].join(""));}
var H=function H(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return H.a(arguments[0],arguments[1]);case 3:return H.c(arguments[0],arguments[1],arguments[2]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};H.a=function(b,a){return null==b?null:null!=b&&(b.g&256||b.yc)?b.N(null,a):Na(b)?a<b.length?b[a|0]:null:"string"===typeof b?a<b.length?b[a|0]:null:Pa(ib,b)?jb.a(b,a):null};
H.c=function(b,a,c){return null!=b?null!=b&&(b.g&256||b.yc)?b.I(null,a,c):Na(b)?a<b.length?b[a]:c:"string"===typeof b?a<b.length?b[a]:c:Pa(ib,b)?jb.c(b,a,c):c:c};H.w=3;hd;var id=function id(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return id.c(arguments[0],arguments[1],arguments[2]);default:return id.j(arguments[0],arguments[1],arguments[2],new xc(c.slice(3),0))}};
id.c=function(b,a,c){if(null!=b)b=lb(b,a,c);else a:{b=[a];c=[c];a=b.length;var d=0,e;for(e=Nb(jd);;)if(d<a){var f=d+1;e=e.Qb(null,b[d],c[d]);d=f}else{b=Qb(e);break a}}return b};id.j=function(b,a,c,d){for(;;)if(b=id.c(b,a,c),x(d))a=L(d),c=bd(d),d=N(N(d));else return b};id.D=function(b){var a=L(b),c=N(b);b=L(c);var d=N(c),c=L(d),d=N(d);return id.j(a,b,c,d)};id.w=3;
var kd=function kd(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return kd.b(arguments[0]);case 2:return kd.a(arguments[0],arguments[1]);default:return kd.j(arguments[0],arguments[1],new xc(c.slice(2),0))}};kd.b=function(b){return b};kd.a=function(b,a){return null==b?null:nb(b,a)};kd.j=function(b,a,c){for(;;){if(null==b)return null;b=kd.a(b,a);if(x(c))a=L(c),c=N(c);else return b}};
kd.D=function(b){var a=L(b),c=N(b);b=L(c);c=N(c);return kd.j(a,b,c)};kd.w=2;function ld(b,a){this.h=b;this.v=a;this.g=393217;this.B=0}h=ld.prototype;h.O=function(){return this.v};h.P=function(b,a){return new ld(this.h,a)};h.Pc=!0;
h.call=function(){function b(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,M,A,K){a=this;return F.wb?F.wb(a.h,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,M,A,K):F.call(null,a.h,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,M,A,K)}function a(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,M,A){a=this;return a.h.qa?a.h.qa(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,M,A):a.h.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,M,A)}function c(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,M){a=this;return a.h.pa?a.h.pa(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,M):
a.h.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,M)}function d(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E){a=this;return a.h.oa?a.h.oa(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E):a.h.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E)}function e(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C){a=this;return a.h.na?a.h.na(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C):a.h.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C)}function f(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z){a=this;return a.h.ma?a.h.ma(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z):a.h.call(null,b,
c,d,e,f,g,k,l,m,n,p,q,r,t,w,z)}function g(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w){a=this;return a.h.la?a.h.la(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w):a.h.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w)}function k(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t){a=this;return a.h.ka?a.h.ka(b,c,d,e,f,g,k,l,m,n,p,q,r,t):a.h.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t)}function l(a,b,c,d,e,f,g,k,l,m,n,p,q,r){a=this;return a.h.ja?a.h.ja(b,c,d,e,f,g,k,l,m,n,p,q,r):a.h.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r)}function m(a,b,c,d,e,f,g,k,l,m,n,p,q){a=this;
return a.h.ia?a.h.ia(b,c,d,e,f,g,k,l,m,n,p,q):a.h.call(null,b,c,d,e,f,g,k,l,m,n,p,q)}function n(a,b,c,d,e,f,g,k,l,m,n,p){a=this;return a.h.ha?a.h.ha(b,c,d,e,f,g,k,l,m,n,p):a.h.call(null,b,c,d,e,f,g,k,l,m,n,p)}function p(a,b,c,d,e,f,g,k,l,m,n){a=this;return a.h.ga?a.h.ga(b,c,d,e,f,g,k,l,m,n):a.h.call(null,b,c,d,e,f,g,k,l,m,n)}function q(a,b,c,d,e,f,g,k,l,m){a=this;return a.h.sa?a.h.sa(b,c,d,e,f,g,k,l,m):a.h.call(null,b,c,d,e,f,g,k,l,m)}function r(a,b,c,d,e,f,g,k,l){a=this;return a.h.ra?a.h.ra(b,c,
d,e,f,g,k,l):a.h.call(null,b,c,d,e,f,g,k,l)}function t(a,b,c,d,e,f,g,k){a=this;return a.h.ba?a.h.ba(b,c,d,e,f,g,k):a.h.call(null,b,c,d,e,f,g,k)}function w(a,b,c,d,e,f,g){a=this;return a.h.aa?a.h.aa(b,c,d,e,f,g):a.h.call(null,b,c,d,e,f,g)}function z(a,b,c,d,e,f){a=this;return a.h.A?a.h.A(b,c,d,e,f):a.h.call(null,b,c,d,e,f)}function C(a,b,c,d,e){a=this;return a.h.o?a.h.o(b,c,d,e):a.h.call(null,b,c,d,e)}function E(a,b,c,d){a=this;return a.h.c?a.h.c(b,c,d):a.h.call(null,b,c,d)}function K(a,b,c){a=this;
return a.h.a?a.h.a(b,c):a.h.call(null,b,c)}function M(a,b){a=this;return a.h.b?a.h.b(b):a.h.call(null,b)}function za(a){a=this;return a.h.l?a.h.l():a.h.call(null)}var A=null,A=function(ea,na,R,V,ba,ca,ga,ja,la,oa,pa,A,Aa,Ea,Sa,Za,Ka,gb,Pb,vc,rd,af){switch(arguments.length){case 1:return za.call(this,ea);case 2:return M.call(this,ea,na);case 3:return K.call(this,ea,na,R);case 4:return E.call(this,ea,na,R,V);case 5:return C.call(this,ea,na,R,V,ba);case 6:return z.call(this,ea,na,R,V,ba,ca);case 7:return w.call(this,
ea,na,R,V,ba,ca,ga);case 8:return t.call(this,ea,na,R,V,ba,ca,ga,ja);case 9:return r.call(this,ea,na,R,V,ba,ca,ga,ja,la);case 10:return q.call(this,ea,na,R,V,ba,ca,ga,ja,la,oa);case 11:return p.call(this,ea,na,R,V,ba,ca,ga,ja,la,oa,pa);case 12:return n.call(this,ea,na,R,V,ba,ca,ga,ja,la,oa,pa,A);case 13:return m.call(this,ea,na,R,V,ba,ca,ga,ja,la,oa,pa,A,Aa);case 14:return l.call(this,ea,na,R,V,ba,ca,ga,ja,la,oa,pa,A,Aa,Ea);case 15:return k.call(this,ea,na,R,V,ba,ca,ga,ja,la,oa,pa,A,Aa,Ea,Sa);case 16:return g.call(this,
ea,na,R,V,ba,ca,ga,ja,la,oa,pa,A,Aa,Ea,Sa,Za);case 17:return f.call(this,ea,na,R,V,ba,ca,ga,ja,la,oa,pa,A,Aa,Ea,Sa,Za,Ka);case 18:return e.call(this,ea,na,R,V,ba,ca,ga,ja,la,oa,pa,A,Aa,Ea,Sa,Za,Ka,gb);case 19:return d.call(this,ea,na,R,V,ba,ca,ga,ja,la,oa,pa,A,Aa,Ea,Sa,Za,Ka,gb,Pb);case 20:return c.call(this,ea,na,R,V,ba,ca,ga,ja,la,oa,pa,A,Aa,Ea,Sa,Za,Ka,gb,Pb,vc);case 21:return a.call(this,ea,na,R,V,ba,ca,ga,ja,la,oa,pa,A,Aa,Ea,Sa,Za,Ka,gb,Pb,vc,rd);case 22:return b.call(this,ea,na,R,V,ba,ca,ga,
ja,la,oa,pa,A,Aa,Ea,Sa,Za,Ka,gb,Pb,vc,rd,af)}throw Error("Invalid arity: "+arguments.length);};A.b=za;A.a=M;A.c=K;A.o=E;A.A=C;A.aa=z;A.ba=w;A.ra=t;A.sa=r;A.ga=q;A.ha=p;A.ia=n;A.ja=m;A.ka=l;A.la=k;A.ma=g;A.na=f;A.oa=e;A.pa=d;A.qa=c;A.Kb=a;A.wb=b;return A}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ua(a)))};h.l=function(){return this.h.l?this.h.l():this.h.call(null)};h.b=function(b){return this.h.b?this.h.b(b):this.h.call(null,b)};
h.a=function(b,a){return this.h.a?this.h.a(b,a):this.h.call(null,b,a)};h.c=function(b,a,c){return this.h.c?this.h.c(b,a,c):this.h.call(null,b,a,c)};h.o=function(b,a,c,d){return this.h.o?this.h.o(b,a,c,d):this.h.call(null,b,a,c,d)};h.A=function(b,a,c,d,e){return this.h.A?this.h.A(b,a,c,d,e):this.h.call(null,b,a,c,d,e)};h.aa=function(b,a,c,d,e,f){return this.h.aa?this.h.aa(b,a,c,d,e,f):this.h.call(null,b,a,c,d,e,f)};
h.ba=function(b,a,c,d,e,f,g){return this.h.ba?this.h.ba(b,a,c,d,e,f,g):this.h.call(null,b,a,c,d,e,f,g)};h.ra=function(b,a,c,d,e,f,g,k){return this.h.ra?this.h.ra(b,a,c,d,e,f,g,k):this.h.call(null,b,a,c,d,e,f,g,k)};h.sa=function(b,a,c,d,e,f,g,k,l){return this.h.sa?this.h.sa(b,a,c,d,e,f,g,k,l):this.h.call(null,b,a,c,d,e,f,g,k,l)};h.ga=function(b,a,c,d,e,f,g,k,l,m){return this.h.ga?this.h.ga(b,a,c,d,e,f,g,k,l,m):this.h.call(null,b,a,c,d,e,f,g,k,l,m)};
h.ha=function(b,a,c,d,e,f,g,k,l,m,n){return this.h.ha?this.h.ha(b,a,c,d,e,f,g,k,l,m,n):this.h.call(null,b,a,c,d,e,f,g,k,l,m,n)};h.ia=function(b,a,c,d,e,f,g,k,l,m,n,p){return this.h.ia?this.h.ia(b,a,c,d,e,f,g,k,l,m,n,p):this.h.call(null,b,a,c,d,e,f,g,k,l,m,n,p)};h.ja=function(b,a,c,d,e,f,g,k,l,m,n,p,q){return this.h.ja?this.h.ja(b,a,c,d,e,f,g,k,l,m,n,p,q):this.h.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q)};
h.ka=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r){return this.h.ka?this.h.ka(b,a,c,d,e,f,g,k,l,m,n,p,q,r):this.h.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r)};h.la=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t){return this.h.la?this.h.la(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t):this.h.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t)};h.ma=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w){return this.h.ma?this.h.ma(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w):this.h.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w)};
h.na=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z){return this.h.na?this.h.na(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z):this.h.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z)};h.oa=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C){return this.h.oa?this.h.oa(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C):this.h.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C)};
h.pa=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E){return this.h.pa?this.h.pa(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E):this.h.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E)};h.qa=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,K){return this.h.qa?this.h.qa(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,K):this.h.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,K)};
h.Kb=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,K,M){return F.wb?F.wb(this.h,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,K,M):F.call(null,this.h,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,K,M)};function Lc(b,a){return fa(b)?new ld(b,a):null==b?null:yb(b,a)}function md(b){var a=null!=b;return(a?null!=b?b.g&131072||b.Wc||(b.g?0:Pa(wb,b)):Pa(wb,b):a)?xb(b):null}function nd(b){return null==b||Oa(J(b))}function od(b){return null==b?!1:null!=b?b.g&4096||b.Bd?!0:b.g?!1:Pa(rb,b):Pa(rb,b)}
function pd(b){return null!=b?b.g&16777216||b.Ad?!0:b.g?!1:Pa(Gb,b):Pa(Gb,b)}function qd(b){return null==b?!1:null!=b?b.g&1024||b.Uc?!0:b.g?!1:Pa(mb,b):Pa(mb,b)}function sd(b){return null!=b?b.g&16384||b.Cd?!0:b.g?!1:Pa(tb,b):Pa(tb,b)}td;ud;function vd(b){return null!=b?b.B&512||b.vd?!0:!1:!1}function wd(b){var a=[];ra(b,function(a,b){return function(a,c){return b.push(c)}}(b,a));return a}function xd(b,a,c,d,e){for(;0!==e;)c[d]=b[a],d+=1,--e,a+=1}var yd={};
function zd(b){return null==b?!1:null!=b?b.g&64||b.G?!0:b.g?!1:Pa(db,b):Pa(db,b)}function Ad(b){return null==b?!1:!1===b?!1:!0}function Bd(b,a){return H.c(b,a,yd)===yd?!1:!0}
function nc(b,a){if(b===a)return 0;if(null==b)return-1;if(null==a)return 1;if("number"===typeof b){if("number"===typeof a)return ta(b,a);throw Error([D("Cannot compare "),D(b),D(" to "),D(a)].join(""));}if(null!=b?b.B&2048||b.Ib||(b.B?0:Pa(Tb,b)):Pa(Tb,b))return Ub(b,a);if("string"!==typeof b&&!Na(b)&&!0!==b&&!1!==b||(null==b?null:b.constructor)!==(null==a?null:a.constructor))throw Error([D("Cannot compare "),D(b),D(" to "),D(a)].join(""));return ta(b,a)}
function Cd(b,a){var c=P(b),d=P(a);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=nc(gd(b,d),gd(a,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}Dd;var ad=function ad(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return ad.a(arguments[0],arguments[1]);case 3:return ad.c(arguments[0],arguments[1],arguments[2]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};
ad.a=function(b,a){var c=J(a);if(c){var d=L(c),c=N(c);return Va.c?Va.c(b,d,c):Va.call(null,b,d,c)}return b.l?b.l():b.call(null)};ad.c=function(b,a,c){for(c=J(c);;)if(c){var d=L(c);a=b.a?b.a(a,d):b.call(null,a,d);if(Oc(a))return vb(a);c=N(c)}else return a};ad.w=3;Ed;
var Va=function Va(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Va.a(arguments[0],arguments[1]);case 3:return Va.c(arguments[0],arguments[1],arguments[2]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};Va.a=function(b,a){return null!=a&&(a.g&524288||a.Yc)?a.ea(null,b):Na(a)?Rc(a,b):"string"===typeof a?Rc(a,b):Pa(zb,a)?Ab.a(a,b):ad.a(b,a)};
Va.c=function(b,a,c){return null!=c&&(c.g&524288||c.Yc)?c.fa(null,b,a):Na(c)?Sc(c,b,a):"string"===typeof c?Sc(c,b,a):Pa(zb,c)?Ab.c(c,b,a):ad.c(b,a,c)};Va.w=3;function Fd(b){return b}function Gd(b,a,c,d){b=b.b?b.b(a):b.call(null,a);c=Va.c(b,c,d);return b.b?b.b(c):b.call(null,c)}
var Hd=function Hd(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Hd.l();case 1:return Hd.b(arguments[0]);case 2:return Hd.a(arguments[0],arguments[1]);default:return Hd.j(arguments[0],arguments[1],new xc(c.slice(2),0))}};Hd.l=function(){return 0};Hd.b=function(b){return b};Hd.a=function(b,a){return b+a};Hd.j=function(b,a,c){return Va.c(Hd,b+a,c)};Hd.D=function(b){var a=L(b),c=N(b);b=L(c);c=N(c);return Hd.j(a,b,c)};Hd.w=2;
var Id=function Id(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Id.l();case 1:return Id.b(arguments[0]);case 2:return Id.a(arguments[0],arguments[1]);default:return Id.j(arguments[0],arguments[1],new xc(c.slice(2),0))}};Id.l=function(){return 1};Id.b=function(b){return b};Id.a=function(b,a){return b*a};Id.j=function(b,a,c){return Va.c(Id,b*a,c)};Id.D=function(b){var a=L(b),c=N(b);b=L(c);c=N(c);return Id.j(a,b,c)};Id.w=2;ua.Ed;
var Jd=function Jd(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Jd.b(arguments[0]);case 2:return Jd.a(arguments[0],arguments[1]);default:return Jd.j(arguments[0],arguments[1],new xc(c.slice(2),0))}};Jd.b=function(b){return 1/b};Jd.a=function(b,a){return b/a};Jd.j=function(b,a,c){return Va.c(Jd,b/a,c)};Jd.D=function(b){var a=L(b),c=N(b);b=L(c);c=N(c);return Jd.j(a,b,c)};Jd.w=2;function Kd(b){return b-1}
var Ld=function Ld(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ld.b(arguments[0]);case 2:return Ld.a(arguments[0],arguments[1]);default:return Ld.j(arguments[0],arguments[1],new xc(c.slice(2),0))}};Ld.b=function(b){return b};Ld.a=function(b,a){return b>a?b:a};Ld.j=function(b,a,c){return Va.c(Ld,b>a?b:a,c)};Ld.D=function(b){var a=L(b),c=N(b);b=L(c);c=N(c);return Ld.j(a,b,c)};Ld.w=2;
var Md=function Md(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Md.b(arguments[0]);case 2:return Md.a(arguments[0],arguments[1]);default:return Md.j(arguments[0],arguments[1],new xc(c.slice(2),0))}};Md.b=function(b){return b};Md.a=function(b,a){return b<a?b:a};Md.j=function(b,a,c){return Va.c(Md,b<a?b:a,c)};Md.D=function(b){var a=L(b),c=N(b);b=L(c);c=N(c);return Md.j(a,b,c)};Md.w=2;Nd;function Nd(b,a){return(b%a+a)%a}
function Od(b){b=(b-b%2)/2;return 0<=b?Math.floor(b):Math.ceil(b)}function Pd(b){b-=b>>1&1431655765;b=(b&858993459)+(b>>2&858993459);return 16843009*(b+(b>>4)&252645135)>>24}function Qd(b,a){for(var c=a,d=J(b);;)if(d&&0<c)--c,d=N(d);else return d}var D=function D(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return D.l();case 1:return D.b(arguments[0]);default:return D.j(arguments[0],new xc(c.slice(1),0))}};D.l=function(){return""};
D.b=function(b){return null==b?"":""+b};D.j=function(b,a){for(var c=new sa(""+D(b)),d=a;;)if(x(d))c=c.append(""+D(L(d))),d=N(d);else return c.toString()};D.D=function(b){var a=L(b);b=N(b);return D.j(a,b)};D.w=1;S;Rd;function Kc(b,a){var c;if(pd(a))if(Yc(b)&&Yc(a)&&P(b)!==P(a))c=!1;else a:{c=J(b);for(var d=J(a);;){if(null==c){c=null==d;break a}if(null!=d&&mc.a(L(c),L(d)))c=N(c),d=N(d);else{c=!1;break a}}}else c=null;return Ad(c)}
function Uc(b){if(J(b)){var a=rc(L(b));for(b=N(b);;){if(null==b)return a;a=sc(a,rc(L(b)));b=N(b)}}else return 0}Sd;Td;function Ud(b){var a=0;for(b=J(b);;)if(b){var c=L(b),a=(a+(rc(Sd.b?Sd.b(c):Sd.call(null,c))^rc(Td.b?Td.b(c):Td.call(null,c))))%4503599627370496;b=N(b)}else return a}Rd;Vd;Wd;function Xc(b,a,c,d,e){this.v=b;this.first=a;this.Ca=c;this.count=d;this.u=e;this.g=65937646;this.B=8192}h=Xc.prototype;h.toString=function(){return ec(this)};h.equiv=function(b){return this.C(null,b)};h.O=function(){return this.v};
h.wa=function(){return 1===this.count?null:this.Ca};h.X=function(){return this.count};h.jb=function(){return this.first};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Fc(this)};h.C=function(b,a){return Kc(this,a)};h.da=function(){return yb(zc,this.v)};h.ea=function(b,a){return ad.a(a,this)};h.fa=function(b,a,c){return ad.c(a,c,this)};h.ta=function(){return this.first};h.xa=function(){return 1===this.count?zc:this.Ca};h.U=function(){return this};
h.P=function(b,a){return new Xc(a,this.first,this.Ca,this.count,this.u)};h.W=function(b,a){return new Xc(this.v,a,this,this.count+1,null)};function Xd(b){return null!=b?b.g&33554432||b.yd?!0:b.g?!1:Pa(Hb,b):Pa(Hb,b)}Xc.prototype[Ra]=function(){return Bc(this)};function Yd(b){this.v=b;this.g=65937614;this.B=8192}h=Yd.prototype;h.toString=function(){return ec(this)};h.equiv=function(b){return this.C(null,b)};h.O=function(){return this.v};h.wa=function(){return null};h.X=function(){return 0};h.jb=function(){return null};
h.T=function(){return Gc};h.C=function(b,a){return Xd(a)||pd(a)?null==J(a):!1};h.da=function(){return this};h.ea=function(b,a){return ad.a(a,this)};h.fa=function(b,a,c){return ad.c(a,c,this)};h.ta=function(){return null};h.xa=function(){return zc};h.U=function(){return null};h.P=function(b,a){return new Yd(a)};h.W=function(b,a){return new Xc(this.v,a,null,1,null)};var zc=new Yd(null);Yd.prototype[Ra]=function(){return Bc(this)};
function Zd(b){return(null!=b?b.g&134217728||b.zd||(b.g?0:Pa(Ib,b)):Pa(Ib,b))?Jb(b):Va.c(dd,zc,b)}var kc=function kc(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return kc.j(0<c.length?new xc(c.slice(0),0):null)};kc.j=function(b){var a;if(b instanceof xc&&0===b.s)a=b.f;else a:for(a=[];;)if(null!=b)a.push(b.ta(null)),b=b.wa(null);else break a;b=a.length;for(var c=zc;;)if(0<b){var d=b-1,c=c.W(null,a[b-1]);b=d}else return c};kc.w=0;kc.D=function(b){return kc.j(J(b))};
function $d(b,a,c,d){this.v=b;this.first=a;this.Ca=c;this.u=d;this.g=65929452;this.B=8192}h=$d.prototype;h.toString=function(){return ec(this)};h.equiv=function(b){return this.C(null,b)};h.O=function(){return this.v};h.wa=function(){return null==this.Ca?null:J(this.Ca)};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Fc(this)};h.C=function(b,a){return Kc(this,a)};h.da=function(){return Lc(zc,this.v)};h.ea=function(b,a){return ad.a(a,this)};h.fa=function(b,a,c){return ad.c(a,c,this)};h.ta=function(){return this.first};
h.xa=function(){return null==this.Ca?zc:this.Ca};h.U=function(){return this};h.P=function(b,a){return new $d(a,this.first,this.Ca,this.u)};h.W=function(b,a){return new $d(null,a,this,this.u)};$d.prototype[Ra]=function(){return Bc(this)};function Vc(b,a){var c=null==a;return(c?c:null!=a&&(a.g&64||a.G))?new $d(null,b,a,null):new $d(null,b,J(a),null)}
function ae(b,a){if(b.Ha===a.Ha)return 0;var c=Oa(b.Ba);if(x(c?a.Ba:c))return-1;if(x(b.Ba)){if(Oa(a.Ba))return 1;c=ta(b.Ba,a.Ba);return 0===c?ta(b.name,a.name):c}return ta(b.name,a.name)}function y(b,a,c,d){this.Ba=b;this.name=a;this.Ha=c;this.tb=d;this.g=2153775105;this.B=4096}h=y.prototype;h.toString=function(){return[D(":"),D(this.Ha)].join("")};h.equiv=function(b){return this.C(null,b)};h.C=function(b,a){return a instanceof y?this.Ha===a.Ha:!1};
h.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return H.a(b,this);case 3:return H.c(b,this,d)}throw Error("Invalid arity: "+arguments.length);};b.a=function(a,b){return H.a(b,this)};b.c=function(a,b,d){return H.c(b,this,d)};return b}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ua(a)))};h.b=function(b){return H.a(b,this)};h.a=function(b,a){return H.c(b,this,a)};
h.T=function(){var b=this.tb;return null!=b?b:this.tb=b=sc(jc(this.name),qc(this.Ba))+2654435769|0};h.Ob=function(){return this.name};h.Pb=function(){return this.Ba};h.M=function(b,a){return Kb(a,[D(":"),D(this.Ha)].join(""))};function T(b,a){return b===a?!0:b instanceof y&&a instanceof y?b.Ha===a.Ha:!1}
var be=function be(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return be.b(arguments[0]);case 2:return be.a(arguments[0],arguments[1]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};
be.b=function(b){if(b instanceof y)return b;if(b instanceof lc){var a;if(null!=b&&(b.B&4096||b.Xc))a=b.Pb(null);else throw Error([D("Doesn't support namespace: "),D(b)].join(""));return new y(a,Rd.b?Rd.b(b):Rd.call(null,b),b.$a,null)}return"string"===typeof b?(a=b.split("/"),2===a.length?new y(a[0],a[1],b,null):new y(null,a[0],b,null)):null};be.a=function(b,a){return new y(b,a,[D(x(b)?[D(b),D("/")].join(""):null),D(a)].join(""),null)};be.w=2;
function ce(b,a,c,d){this.v=b;this.Cb=a;this.J=c;this.u=d;this.g=32374988;this.B=0}h=ce.prototype;h.toString=function(){return ec(this)};h.equiv=function(b){return this.C(null,b)};function de(b){null!=b.Cb&&(b.J=b.Cb.l?b.Cb.l():b.Cb.call(null),b.Cb=null);return b.J}h.O=function(){return this.v};h.wa=function(){Fb(this);return null==this.J?null:N(this.J)};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Fc(this)};h.C=function(b,a){return Kc(this,a)};h.da=function(){return Lc(zc,this.v)};
h.ea=function(b,a){return ad.a(a,this)};h.fa=function(b,a,c){return ad.c(a,c,this)};h.ta=function(){Fb(this);return null==this.J?null:L(this.J)};h.xa=function(){Fb(this);return null!=this.J?yc(this.J):zc};h.U=function(){de(this);if(null==this.J)return null;for(var b=this.J;;)if(b instanceof ce)b=de(b);else return this.J=b,J(this.J)};h.P=function(b,a){return new ce(a,this.Cb,this.J,this.u)};h.W=function(b,a){return Vc(a,this)};ce.prototype[Ra]=function(){return Bc(this)};ee;
function fe(b,a){this.L=b;this.end=a;this.g=2;this.B=0}fe.prototype.add=function(b){this.L[this.end]=b;return this.end+=1};fe.prototype.$=function(){var b=new ee(this.L,0,this.end);this.L=null;return b};fe.prototype.X=function(){return this.end};function ge(b){return new fe(Array(b),0)}function ee(b,a,c){this.f=b;this.ua=a;this.end=c;this.g=524306;this.B=0}h=ee.prototype;h.X=function(){return this.end-this.ua};h.ca=function(b,a){return this.f[this.ua+a]};
h.Ea=function(b,a,c){return 0<=a&&a<this.end-this.ua?this.f[this.ua+a]:c};h.wc=function(){if(this.ua===this.end)throw Error("-drop-first of empty chunk");return new ee(this.f,this.ua+1,this.end)};h.ea=function(b,a){return Tc(this.f,a,this.f[this.ua],this.ua+1)};h.fa=function(b,a,c){return Tc(this.f,a,c,this.ua)};function td(b,a,c,d){this.$=b;this.Wa=a;this.v=c;this.u=d;this.g=31850732;this.B=1536}h=td.prototype;h.toString=function(){return ec(this)};h.equiv=function(b){return this.C(null,b)};
h.O=function(){return this.v};h.wa=function(){if(1<Ya(this.$))return new td(Vb(this.$),this.Wa,this.v,null);var b=Fb(this.Wa);return null==b?null:b};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Fc(this)};h.C=function(b,a){return Kc(this,a)};h.da=function(){return Lc(zc,this.v)};h.ta=function(){return G.a(this.$,0)};h.xa=function(){return 1<Ya(this.$)?new td(Vb(this.$),this.Wa,this.v,null):null==this.Wa?zc:this.Wa};h.U=function(){return this};h.nc=function(){return this.$};
h.oc=function(){return null==this.Wa?zc:this.Wa};h.P=function(b,a){return new td(this.$,this.Wa,a,this.u)};h.W=function(b,a){return Vc(a,this)};h.mc=function(){return null==this.Wa?null:this.Wa};td.prototype[Ra]=function(){return Bc(this)};function he(b,a){return 0===Ya(b)?a:new td(b,a,null,null)}function ie(b,a){b.add(a)}function Vd(b){return Wb(b)}function Wd(b){return Xb(b)}function Dd(b){for(var a=[];;)if(J(b))a.push(L(b)),b=N(b);else return a}
function je(b){if("number"===typeof b)a:{var a=Array(b);if(zd(null))for(var c=0,d=J(null);;)if(d&&c<b)a[c]=L(d),c+=1,d=N(d);else{b=a;break a}else{for(c=0;;)if(c<b)a[c]=null,c+=1;else break;b=a}}else b=Ja.b(b);return b}function ke(b,a){if(Yc(b))return P(b);for(var c=b,d=a,e=0;;)if(0<d&&J(c))c=N(c),--d,e+=1;else return e}
var le=function le(a){return null==a?null:null==N(a)?J(L(a)):Vc(L(a),le(N(a)))},me=function me(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return me.l();case 1:return me.b(arguments[0]);case 2:return me.a(arguments[0],arguments[1]);default:return me.j(arguments[0],arguments[1],new xc(c.slice(2),0))}};me.l=function(){return new ce(null,function(){return null},null,null)};me.b=function(b){return new ce(null,function(){return b},null,null)};
me.a=function(b,a){return new ce(null,function(){var c=J(b);return c?vd(c)?he(Wb(c),me.a(Xb(c),a)):Vc(L(c),me.a(yc(c),a)):a},null,null)};me.j=function(b,a,c){return function e(a,b){return new ce(null,function(){var c=J(a);return c?vd(c)?he(Wb(c),e(Xb(c),b)):Vc(L(c),e(yc(c),b)):x(b)?e(L(b),N(b)):null},null,null)}(me.a(b,a),c)};me.D=function(b){var a=L(b),c=N(b);b=L(c);c=N(c);return me.j(a,b,c)};me.w=2;function ne(b){return Qb(b)}
var oe=function oe(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return oe.l();case 1:return oe.b(arguments[0]);case 2:return oe.a(arguments[0],arguments[1]);default:return oe.j(arguments[0],arguments[1],new xc(c.slice(2),0))}};oe.l=function(){return Nb(ed)};oe.b=function(b){return b};oe.a=function(b,a){return Ob(b,a)};oe.j=function(b,a,c){for(;;)if(b=Ob(b,a),x(c))a=L(c),c=N(c);else return b};
oe.D=function(b){var a=L(b),c=N(b);b=L(c);c=N(c);return oe.j(a,b,c)};oe.w=2;
function pe(b,a,c){var d=J(c);if(0===a)return b.l?b.l():b.call(null);c=eb(d);var e=fb(d);if(1===a)return b.b?b.b(c):b.b?b.b(c):b.call(null,c);var d=eb(e),f=fb(e);if(2===a)return b.a?b.a(c,d):b.a?b.a(c,d):b.call(null,c,d);var e=eb(f),g=fb(f);if(3===a)return b.c?b.c(c,d,e):b.c?b.c(c,d,e):b.call(null,c,d,e);var f=eb(g),k=fb(g);if(4===a)return b.o?b.o(c,d,e,f):b.o?b.o(c,d,e,f):b.call(null,c,d,e,f);var g=eb(k),l=fb(k);if(5===a)return b.A?b.A(c,d,e,f,g):b.A?b.A(c,d,e,f,g):b.call(null,c,d,e,f,g);var k=eb(l),
m=fb(l);if(6===a)return b.aa?b.aa(c,d,e,f,g,k):b.aa?b.aa(c,d,e,f,g,k):b.call(null,c,d,e,f,g,k);var l=eb(m),n=fb(m);if(7===a)return b.ba?b.ba(c,d,e,f,g,k,l):b.ba?b.ba(c,d,e,f,g,k,l):b.call(null,c,d,e,f,g,k,l);var m=eb(n),p=fb(n);if(8===a)return b.ra?b.ra(c,d,e,f,g,k,l,m):b.ra?b.ra(c,d,e,f,g,k,l,m):b.call(null,c,d,e,f,g,k,l,m);var n=eb(p),q=fb(p);if(9===a)return b.sa?b.sa(c,d,e,f,g,k,l,m,n):b.sa?b.sa(c,d,e,f,g,k,l,m,n):b.call(null,c,d,e,f,g,k,l,m,n);var p=eb(q),r=fb(q);if(10===a)return b.ga?b.ga(c,
d,e,f,g,k,l,m,n,p):b.ga?b.ga(c,d,e,f,g,k,l,m,n,p):b.call(null,c,d,e,f,g,k,l,m,n,p);var q=eb(r),t=fb(r);if(11===a)return b.ha?b.ha(c,d,e,f,g,k,l,m,n,p,q):b.ha?b.ha(c,d,e,f,g,k,l,m,n,p,q):b.call(null,c,d,e,f,g,k,l,m,n,p,q);var r=eb(t),w=fb(t);if(12===a)return b.ia?b.ia(c,d,e,f,g,k,l,m,n,p,q,r):b.ia?b.ia(c,d,e,f,g,k,l,m,n,p,q,r):b.call(null,c,d,e,f,g,k,l,m,n,p,q,r);var t=eb(w),z=fb(w);if(13===a)return b.ja?b.ja(c,d,e,f,g,k,l,m,n,p,q,r,t):b.ja?b.ja(c,d,e,f,g,k,l,m,n,p,q,r,t):b.call(null,c,d,e,f,g,k,l,
m,n,p,q,r,t);var w=eb(z),C=fb(z);if(14===a)return b.ka?b.ka(c,d,e,f,g,k,l,m,n,p,q,r,t,w):b.ka?b.ka(c,d,e,f,g,k,l,m,n,p,q,r,t,w):b.call(null,c,d,e,f,g,k,l,m,n,p,q,r,t,w);var z=eb(C),E=fb(C);if(15===a)return b.la?b.la(c,d,e,f,g,k,l,m,n,p,q,r,t,w,z):b.la?b.la(c,d,e,f,g,k,l,m,n,p,q,r,t,w,z):b.call(null,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z);var C=eb(E),K=fb(E);if(16===a)return b.ma?b.ma(c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C):b.ma?b.ma(c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C):b.call(null,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C);var E=
eb(K),M=fb(K);if(17===a)return b.na?b.na(c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E):b.na?b.na(c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E):b.call(null,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E);var K=eb(M),za=fb(M);if(18===a)return b.oa?b.oa(c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,K):b.oa?b.oa(c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,K):b.call(null,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,K);M=eb(za);za=fb(za);if(19===a)return b.pa?b.pa(c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,K,M):b.pa?b.pa(c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,K,M):b.call(null,c,d,e,
f,g,k,l,m,n,p,q,r,t,w,z,C,E,K,M);var A=eb(za);fb(za);if(20===a)return b.qa?b.qa(c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,K,M,A):b.qa?b.qa(c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,K,M,A):b.call(null,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,K,M,A);throw Error("Only up to 20 arguments supported on functions");}
var F=function F(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return F.a(arguments[0],arguments[1]);case 3:return F.c(arguments[0],arguments[1],arguments[2]);case 4:return F.o(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return F.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return F.j(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new xc(c.slice(5),0))}};
F.a=function(b,a){var c=b.w;if(b.D){var d=ke(a,c+1);return d<=c?pe(b,d,a):b.D(a)}return b.apply(b,Dd(a))};F.c=function(b,a,c){a=Vc(a,c);c=b.w;if(b.D){var d=ke(a,c+1);return d<=c?pe(b,d,a):b.D(a)}return b.apply(b,Dd(a))};F.o=function(b,a,c,d){a=Vc(a,Vc(c,d));c=b.w;return b.D?(d=ke(a,c+1),d<=c?pe(b,d,a):b.D(a)):b.apply(b,Dd(a))};F.A=function(b,a,c,d,e){a=Vc(a,Vc(c,Vc(d,e)));c=b.w;return b.D?(d=ke(a,c+1),d<=c?pe(b,d,a):b.D(a)):b.apply(b,Dd(a))};
F.j=function(b,a,c,d,e,f){a=Vc(a,Vc(c,Vc(d,Vc(e,le(f)))));c=b.w;return b.D?(d=ke(a,c+1),d<=c?pe(b,d,a):b.D(a)):b.apply(b,Dd(a))};F.D=function(b){var a=L(b),c=N(b);b=L(c);var d=N(c),c=L(d),e=N(d),d=L(e),f=N(e),e=L(f),f=N(f);return F.j(a,b,c,d,e,f)};F.w=5;function qe(b){return J(b)?b:null}
var re=function re(){"undefined"===typeof va&&(va=function(a,c){this.od=a;this.nd=c;this.g=393216;this.B=0},va.prototype.P=function(a,c){return new va(this.od,c)},va.prototype.O=function(){return this.nd},va.prototype.ya=function(){return!1},va.prototype.next=function(){return Error("No such element")},va.prototype.remove=function(){return Error("Unsupported operation")},va.ic=function(){return new U(null,2,5,W,[Lc(se,new v(null,1,[te,kc(ue,kc(ed))],null)),ua.Dd],null)},va.xb=!0,va.eb="cljs.core/t_cljs$core23323",
va.Tb=function(a,c){return Kb(c,"cljs.core/t_cljs$core23323")});return new va(re,ve)};we;function we(b,a,c,d){this.Fb=b;this.first=a;this.Ca=c;this.v=d;this.g=31719628;this.B=0}h=we.prototype;h.P=function(b,a){return new we(this.Fb,this.first,this.Ca,a)};h.W=function(b,a){return Vc(a,Fb(this))};h.da=function(){return zc};h.C=function(b,a){return null!=Fb(this)?Kc(this,a):pd(a)&&null==J(a)};h.T=function(){return Fc(this)};h.U=function(){null!=this.Fb&&this.Fb.step(this);return null==this.Ca?null:this};
h.ta=function(){null!=this.Fb&&Fb(this);return null==this.Ca?null:this.first};h.xa=function(){null!=this.Fb&&Fb(this);return null==this.Ca?zc:this.Ca};h.wa=function(){null!=this.Fb&&Fb(this);return null==this.Ca?null:Fb(this.Ca)};we.prototype[Ra]=function(){return Bc(this)};function xe(b,a){for(;;){if(null==J(a))return!0;var c;c=L(a);c=b.b?b.b(c):b.call(null,c);if(x(c)){c=b;var d=N(a);b=c;a=d}else return!1}}
function ye(b,a){for(;;)if(J(a)){var c;c=L(a);c=b.b?b.b(c):b.call(null,c);if(x(c))return c;c=b;var d=N(a);b=c;a=d}else return null}
function ze(b){return function(){function a(a,c){return Oa(b.a?b.a(a,c):b.call(null,a,c))}function c(a){return Oa(b.b?b.b(a):b.call(null,a))}function d(){return Oa(b.l?b.l():b.call(null))}var e=null,f=function(){function a(b,d,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new xc(g,0)}return c.call(this,b,d,f)}function c(a,d,e){return Oa(F.o(b,a,d,e))}a.w=2;a.D=function(a){var b=L(a);a=N(a);var d=L(a);a=yc(a);return c(b,d,a)};a.j=
c;return a}(),e=function(b,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,b);case 2:return a.call(this,b,e);default:var m=null;if(2<arguments.length){for(var m=0,n=Array(arguments.length-2);m<n.length;)n[m]=arguments[m+2],++m;m=new xc(n,0)}return f.j(b,e,m)}throw Error("Invalid arity: "+arguments.length);};e.w=2;e.D=f.D;e.l=d;e.b=c;e.a=a;e.j=f.j;return e}()}
function Ae(){return function(){function b(a){if(0<arguments.length)for(var b=0,d=Array(arguments.length-0);b<d.length;)d[b]=arguments[b+0],++b;return!1}b.w=0;b.D=function(a){J(a);return!1};b.j=function(){return!1};return b}()}
var Be=function Be(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Be.l();case 1:return Be.b(arguments[0]);case 2:return Be.a(arguments[0],arguments[1]);case 3:return Be.c(arguments[0],arguments[1],arguments[2]);default:return Be.j(arguments[0],arguments[1],arguments[2],new xc(c.slice(3),0))}};Be.l=function(){return Fd};Be.b=function(b){return b};
Be.a=function(b,a){return function(){function c(c,d,e){c=a.c?a.c(c,d,e):a.call(null,c,d,e);return b.b?b.b(c):b.call(null,c)}function d(c,d){var e=a.a?a.a(c,d):a.call(null,c,d);return b.b?b.b(e):b.call(null,e)}function e(c){c=a.b?a.b(c):a.call(null,c);return b.b?b.b(c):b.call(null,c)}function f(){var c=a.l?a.l():a.call(null);return b.b?b.b(c):b.call(null,c)}var g=null,k=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,k=Array(arguments.length-3);g<k.length;)k[g]=arguments[g+
3],++g;g=new xc(k,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){c=F.A(a,c,e,f,g);return b.b?b.b(c):b.call(null,c)}c.w=3;c.D=function(a){var b=L(a);a=N(a);var c=L(a);a=N(a);var e=L(a);a=yc(a);return d(b,c,e,a)};c.j=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+
3],++q;q=new xc(r,0)}return k.j(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.D=k.D;g.l=f;g.b=e;g.a=d;g.c=c;g.j=k.j;return g}()};
Be.c=function(b,a,c){return function(){function d(d,e,f){d=c.c?c.c(d,e,f):c.call(null,d,e,f);d=a.b?a.b(d):a.call(null,d);return b.b?b.b(d):b.call(null,d)}function e(d,e){var f;f=c.a?c.a(d,e):c.call(null,d,e);f=a.b?a.b(f):a.call(null,f);return b.b?b.b(f):b.call(null,f)}function f(d){d=c.b?c.b(d):c.call(null,d);d=a.b?a.b(d):a.call(null,d);return b.b?b.b(d):b.call(null,d)}function g(){var d;d=c.l?c.l():c.call(null);d=a.b?a.b(d):a.call(null,d);return b.b?b.b(d):b.call(null,d)}var k=null,l=function(){function d(a,
b,c,f){var g=null;if(3<arguments.length){for(var g=0,k=Array(arguments.length-3);g<k.length;)k[g]=arguments[g+3],++g;g=new xc(k,0)}return e.call(this,a,b,c,g)}function e(d,f,g,k){d=F.A(c,d,f,g,k);d=a.b?a.b(d):a.call(null,d);return b.b?b.b(d):b.call(null,d)}d.w=3;d.D=function(a){var b=L(a);a=N(a);var c=L(a);a=N(a);var d=L(a);a=yc(a);return e(b,c,d,a)};d.j=e;return d}(),k=function(a,b,c,k){switch(arguments.length){case 0:return g.call(this);case 1:return f.call(this,a);case 2:return e.call(this,a,b);
case 3:return d.call(this,a,b,c);default:var r=null;if(3<arguments.length){for(var r=0,t=Array(arguments.length-3);r<t.length;)t[r]=arguments[r+3],++r;r=new xc(t,0)}return l.j(a,b,c,r)}throw Error("Invalid arity: "+arguments.length);};k.w=3;k.D=l.D;k.l=g;k.b=f;k.a=e;k.c=d;k.j=l.j;return k}()};
Be.j=function(b,a,c,d){return function(a){return function(){function b(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new xc(e,0)}return c.call(this,d)}function c(b){b=F.a(L(a),b);for(var d=N(a);;)if(d)b=L(d).call(null,b),d=N(d);else return b}b.w=0;b.D=function(a){a=J(a);return c(a)};b.j=c;return b}()}(Zd(Vc(b,Vc(a,Vc(c,d)))))};Be.D=function(b){var a=L(b),c=N(b);b=L(c);var d=N(c),c=L(d),d=N(d);return Be.j(a,b,c,d)};Be.w=3;
function Ce(b,a){return function(){function c(c,d,e){return b.o?b.o(a,c,d,e):b.call(null,a,c,d,e)}function d(c,d){return b.c?b.c(a,c,d):b.call(null,a,c,d)}function e(c){return b.a?b.a(a,c):b.call(null,a,c)}function f(){return b.b?b.b(a):b.call(null,a)}var g=null,k=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,k=Array(arguments.length-3);g<k.length;)k[g]=arguments[g+3],++g;g=new xc(k,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){return F.j(b,a,c,e,f,I([g],0))}c.w=
3;c.D=function(a){var b=L(a);a=N(a);var c=L(a);a=N(a);var e=L(a);a=yc(a);return d(b,c,e,a)};c.j=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+3],++q;q=new xc(r,0)}return k.j(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.D=k.D;g.l=f;g.b=
e;g.a=d;g.c=c;g.j=k.j;return g}()}De;function Ee(b,a){return function d(a,f){return new ce(null,function(){var g=J(f);if(g){if(vd(g)){for(var k=Wb(g),l=P(k),m=ge(l),n=0;;)if(n<l)ie(m,function(){var d=a+n,f=G.a(k,n);return b.a?b.a(d,f):b.call(null,d,f)}()),n+=1;else break;return he(m.$(),d(a+l,Xb(g)))}return Vc(function(){var d=L(g);return b.a?b.a(a,d):b.call(null,a,d)}(),d(a+1,yc(g)))}return null},null,null)}(0,a)}function Fe(b,a,c,d){this.state=b;this.v=a;this.Nc=d;this.B=16386;this.g=6455296}
h=Fe.prototype;h.equiv=function(b){return this.C(null,b)};h.C=function(b,a){return this===a};h.Jb=function(){return this.state};h.O=function(){return this.v};h.Ac=function(b,a,c){b=J(this.Nc);for(var d=null,e=0,f=0;;)if(f<e){var g=d.ca(null,f),k=Q(g,0),g=Q(g,1);g.o?g.o(k,this,a,c):g.call(null,k,this,a,c);f+=1}else if(b=J(b))vd(b)?(d=Wb(b),b=Xb(b),k=d,e=P(d),d=k):(d=L(b),k=Q(d,0),g=Q(d,1),g.o?g.o(k,this,a,c):g.call(null,k,this,a,c),b=N(b),d=null,e=0),f=0;else return null};
h.T=function(){return this[ha]||(this[ha]=++ia)};var X=function X(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return X.b(arguments[0]);default:return X.j(arguments[0],new xc(c.slice(1),0))}};X.b=function(b){return new Fe(b,null,0,null)};X.j=function(b,a){var c=null!=a&&(a.g&64||a.G)?F.a(Jc,a):a,d=H.a(c,Ga);H.a(c,Ge);return new Fe(b,d,0,null)};X.D=function(b){var a=L(b);b=N(b);return X.j(a,b)};X.w=1;He;
function Ie(b,a){if(b instanceof Fe){var c=b.state;b.state=a;null!=b.Nc&&Mb(b,c,a);return a}return ac(b,a)}var Je=function Je(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Je.a(arguments[0],arguments[1]);case 3:return Je.c(arguments[0],arguments[1],arguments[2]);case 4:return Je.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:return Je.j(arguments[0],arguments[1],arguments[2],arguments[3],new xc(c.slice(4),0))}};
Je.a=function(b,a){var c;b instanceof Fe?(c=b.state,c=a.b?a.b(c):a.call(null,c),c=Ie(b,c)):c=bc.a(b,a);return c};Je.c=function(b,a,c){if(b instanceof Fe){var d=b.state;a=a.a?a.a(d,c):a.call(null,d,c);b=Ie(b,a)}else b=bc.c(b,a,c);return b};Je.o=function(b,a,c,d){if(b instanceof Fe){var e=b.state;a=a.c?a.c(e,c,d):a.call(null,e,c,d);b=Ie(b,a)}else b=bc.o(b,a,c,d);return b};Je.j=function(b,a,c,d,e){return b instanceof Fe?Ie(b,F.A(a,b.state,c,d,e)):bc.A(b,a,c,d,e)};
Je.D=function(b){var a=L(b),c=N(b);b=L(c);var d=N(c),c=L(d),e=N(d),d=L(e),e=N(e);return Je.j(a,b,c,d,e)};Je.w=4;function Ke(b){this.state=b;this.g=32768;this.B=0}Ke.prototype.Jb=function(){return this.state};function De(b){return new Ke(b)}
var S=function S(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return S.b(arguments[0]);case 2:return S.a(arguments[0],arguments[1]);case 3:return S.c(arguments[0],arguments[1],arguments[2]);case 4:return S.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:return S.j(arguments[0],arguments[1],arguments[2],arguments[3],new xc(c.slice(4),0))}};
S.b=function(b){return function(a){return function(){function c(c,d){var e=b.b?b.b(d):b.call(null,d);return a.a?a.a(c,e):a.call(null,c,e)}function d(b){return a.b?a.b(b):a.call(null,b)}function e(){return a.l?a.l():a.call(null)}var f=null,g=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new xc(g,0)}return d.call(this,a,b,f)}function d(c,e,f){e=F.c(b,e,f);return a.a?a.a(c,e):a.call(null,c,e)}c.w=2;c.D=function(a){var b=
L(a);a=N(a);var c=L(a);a=yc(a);return d(b,c,a)};c.j=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var n=null;if(2<arguments.length){for(var n=0,p=Array(arguments.length-2);n<p.length;)p[n]=arguments[n+2],++n;n=new xc(p,0)}return g.j(a,b,n)}throw Error("Invalid arity: "+arguments.length);};f.w=2;f.D=g.D;f.l=e;f.b=d;f.a=c;f.j=g.j;return f}()}};
S.a=function(b,a){return new ce(null,function(){var c=J(a);if(c){if(vd(c)){for(var d=Wb(c),e=P(d),f=ge(e),g=0;;)if(g<e)ie(f,function(){var a=G.a(d,g);return b.b?b.b(a):b.call(null,a)}()),g+=1;else break;return he(f.$(),S.a(b,Xb(c)))}return Vc(function(){var a=L(c);return b.b?b.b(a):b.call(null,a)}(),S.a(b,yc(c)))}return null},null,null)};
S.c=function(b,a,c){return new ce(null,function(){var d=J(a),e=J(c);if(d&&e){var f=Vc,g;g=L(d);var k=L(e);g=b.a?b.a(g,k):b.call(null,g,k);d=f(g,S.c(b,yc(d),yc(e)))}else d=null;return d},null,null)};S.o=function(b,a,c,d){return new ce(null,function(){var e=J(a),f=J(c),g=J(d);if(e&&f&&g){var k=Vc,l;l=L(e);var m=L(f),n=L(g);l=b.c?b.c(l,m,n):b.call(null,l,m,n);e=k(l,S.o(b,yc(e),yc(f),yc(g)))}else e=null;return e},null,null)};
S.j=function(b,a,c,d,e){var f=function k(a){return new ce(null,function(){var b=S.a(J,a);return xe(Fd,b)?Vc(S.a(L,b),k(S.a(yc,b))):null},null,null)};return S.a(function(){return function(a){return F.a(b,a)}}(f),f(dd.j(e,d,I([c,a],0))))};S.D=function(b){var a=L(b),c=N(b);b=L(c);var d=N(c),c=L(d),e=N(d),d=L(e),e=N(e);return S.j(a,b,c,d,e)};S.w=4;function Le(b,a){return new ce(null,function(){if(0<b){var c=J(a);return c?Vc(L(c),Le(b-1,yc(c))):null}return null},null,null)}
function Me(b,a){return new ce(null,function(c){return function(){return c(b,a)}}(function(a,b){for(;;){var e=J(b);if(0<a&&e){var f=a-1,e=yc(e);a=f;b=e}else return e}}),null,null)}function Ne(b){return new ce(null,function(){return Vc(b,Ne(b))},null,null)}function Oe(b){return new ce(null,function(){return Vc(b.l?b.l():b.call(null),Oe(b))},null,null)}function Pe(b){return Le(5,Oe(b))}
var Qe=function Qe(a,c){return Vc(c,new ce(null,function(){return Qe(a,a.b?a.b(c):a.call(null,c))},null,null))},Re=function Re(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Re.a(arguments[0],arguments[1]);default:return Re.j(arguments[0],arguments[1],new xc(c.slice(2),0))}};Re.a=function(b,a){return new ce(null,function(){var c=J(b),d=J(a);return c&&d?Vc(L(c),Vc(L(d),Re.a(yc(c),yc(d)))):null},null,null)};
Re.j=function(b,a,c){return new ce(null,function(){var d=S.a(J,dd.j(c,a,I([b],0)));return xe(Fd,d)?me.a(S.a(L,d),F.a(Re,S.a(yc,d))):null},null,null)};Re.D=function(b){var a=L(b),c=N(b);b=L(c);c=N(c);return Re.j(a,b,c)};Re.w=2;function Se(b){return Me(1,Re.a(Ne("L"),b))}Te;function Ue(b,a){return F.a(me,F.c(S,b,a))}
function Ve(b,a){return new ce(null,function(){var c=J(a);if(c){if(vd(c)){for(var d=Wb(c),e=P(d),f=ge(e),g=0;;)if(g<e){var k;k=G.a(d,g);k=b.b?b.b(k):b.call(null,k);x(k)&&(k=G.a(d,g),f.add(k));g+=1}else break;return he(f.$(),Ve(b,Xb(c)))}d=L(c);c=yc(c);return x(b.b?b.b(d):b.call(null,d))?Vc(d,Ve(b,c)):Ve(b,c)}return null},null,null)}
function We(b){return function c(b){return new ce(null,function(){return Vc(b,x(zd.b?zd.b(b):zd.call(null,b))?Ue(c,I([J.b?J.b(b):J.call(null,b)],0)):null)},null,null)}(b)}var Xe=function Xe(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Xe.a(arguments[0],arguments[1]);case 3:return Xe.c(arguments[0],arguments[1],arguments[2]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};
Xe.a=function(b,a){return null!=b?null!=b&&(b.B&4||b.Rc)?Lc(ne(Va.c(Ob,Nb(b),a)),md(b)):Va.c(bb,b,a):Va.c(dd,zc,a)};Xe.c=function(b,a,c){return null!=b&&(b.B&4||b.Rc)?Lc(ne(Gd(a,oe,Nb(b),c)),md(b)):Gd(a,dd,b,c)};Xe.w=3;function Ye(b,a){return ne(Va.c(function(a,d){return oe.a(a,b.b?b.b(d):b.call(null,d))},Nb(ed),a))}
function Ze(b,a){var c;a:{c=yd;for(var d=b,e=J(a);;)if(e)if(null!=d?d.g&256||d.yc||(d.g?0:Pa(ib,d)):Pa(ib,d)){d=H.c(d,L(e),c);if(c===d){c=null;break a}e=N(e)}else{c=null;break a}else{c=d;break a}}return c}function $e(b,a,c){return id.c(b,a,function(){var d=H.a(b,a);return c.b?c.b(d):c.call(null,d)}())}function bf(b,a,c,d){return id.c(b,a,function(){var e=H.a(b,a);return c.a?c.a(e,d):c.call(null,e,d)}())}
function cf(b,a,c,d){var e=df;return id.c(b,e,function(){var f=H.a(b,e);return a.c?a.c(f,c,d):a.call(null,f,c,d)}())}function ef(b,a){this.V=b;this.f=a}function ff(b){return new ef(b,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function gf(b){b=b.m;return 32>b?0:b-1>>>5<<5}function hf(b,a,c){for(;;){if(0===a)return c;var d=ff(b);d.f[0]=c;c=d;a-=5}}
var jf=function jf(a,c,d,e){var f=new ef(d.V,Ua(d.f)),g=a.m-1>>>c&31;5===c?f.f[g]=e:(d=d.f[g],a=null!=d?jf(a,c-5,d,e):hf(null,c-5,e),f.f[g]=a);return f};function kf(b,a){throw Error([D("No item "),D(b),D(" in vector of length "),D(a)].join(""));}function lf(b,a){if(a>=gf(b))return b.R;for(var c=b.root,d=b.shift;;)if(0<d)var e=d-5,c=c.f[a>>>d&31],d=e;else return c.f}function mf(b,a){return 0<=a&&a<b.m?lf(b,a):kf(a,b.m)}
var nf=function nf(a,c,d,e,f){var g=new ef(d.V,Ua(d.f));if(0===c)g.f[e&31]=f;else{var k=e>>>c&31;a=nf(a,c-5,d.f[k],e,f);g.f[k]=a}return g};function of(b,a,c,d,e,f){this.s=b;this.kc=a;this.f=c;this.Na=d;this.start=e;this.end=f}of.prototype.ya=function(){return this.s<this.end};of.prototype.next=function(){32===this.s-this.kc&&(this.f=lf(this.Na,this.s),this.kc+=32);var b=this.f[this.s&31];this.s+=1;return b};pf;qf;rf;O;sf;tf;uf;
function U(b,a,c,d,e,f){this.v=b;this.m=a;this.shift=c;this.root=d;this.R=e;this.u=f;this.g=167668511;this.B=8196}h=U.prototype;h.toString=function(){return ec(this)};h.equiv=function(b){return this.C(null,b)};h.N=function(b,a){return jb.c(this,a,null)};h.I=function(b,a,c){return"number"===typeof a?G.c(this,a,c):c};
h.Lb=function(b,a,c){b=0;for(var d=c;;)if(b<this.m){var e=lf(this,b);c=e.length;a:for(var f=0;;)if(f<c){var g=f+b,k=e[f],d=a.c?a.c(d,g,k):a.call(null,d,g,k);if(Oc(d)){e=d;break a}f+=1}else{e=d;break a}if(Oc(e))return O.b?O.b(e):O.call(null,e);b+=c;d=e}else return d};h.ca=function(b,a){return mf(this,a)[a&31]};h.Ea=function(b,a,c){return 0<=a&&a<this.m?lf(this,a)[a&31]:c};
h.kb=function(b,a,c){if(0<=a&&a<this.m)return gf(this)<=a?(b=Ua(this.R),b[a&31]=c,new U(this.v,this.m,this.shift,this.root,b,null)):new U(this.v,this.m,this.shift,nf(this,this.shift,this.root,a,c),this.R,null);if(a===this.m)return bb(this,c);throw Error([D("Index "),D(a),D(" out of bounds  [0,"),D(this.m),D("]")].join(""));};h.Ga=function(){var b=this.m;return new of(0,0,0<P(this)?lf(this,0):null,this,0,b)};h.O=function(){return this.v};h.X=function(){return this.m};
h.Mb=function(){return G.a(this,0)};h.Nb=function(){return G.a(this,1)};h.jb=function(){return 0<this.m?G.a(this,this.m-1):null};h.bc=function(){return 0<this.m?new Wc(this,this.m-1,null):null};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Fc(this)};h.C=function(b,a){if(a instanceof U)if(this.m===P(a))for(var c=cc(this),d=cc(a);;)if(x(c.ya())){var e=c.next(),f=d.next();if(!mc.a(e,f))return!1}else return!0;else return!1;else return Kc(this,a)};
h.vb=function(){return new rf(this.m,this.shift,pf.b?pf.b(this.root):pf.call(null,this.root),qf.b?qf.b(this.R):qf.call(null,this.R))};h.da=function(){return Lc(ed,this.v)};h.ea=function(b,a){return Pc(this,a)};h.fa=function(b,a,c){b=0;for(var d=c;;)if(b<this.m){var e=lf(this,b);c=e.length;a:for(var f=0;;)if(f<c){var g=e[f],d=a.a?a.a(d,g):a.call(null,d,g);if(Oc(d)){e=d;break a}f+=1}else{e=d;break a}if(Oc(e))return O.b?O.b(e):O.call(null,e);b+=c;d=e}else return d};
h.Oa=function(b,a,c){if("number"===typeof a)return ub(this,a,c);throw Error("Vector's key for assoc must be a number.");};h.U=function(){if(0===this.m)return null;if(32>=this.m)return new xc(this.R,0);var b;a:{b=this.root;for(var a=this.shift;;)if(0<a)a-=5,b=b.f[0];else{b=b.f;break a}}return uf.o?uf.o(this,b,0,0):uf.call(null,this,b,0,0)};h.P=function(b,a){return new U(a,this.m,this.shift,this.root,this.R,this.u)};
h.W=function(b,a){if(32>this.m-gf(this)){for(var c=this.R.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.R[e],e+=1;else break;d[c]=a;return new U(this.v,this.m+1,this.shift,this.root,d,null)}c=(d=this.m>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=ff(null),d.f[0]=this.root,e=hf(null,this.shift,new ef(null,this.R)),d.f[1]=e):d=jf(this,this.shift,this.root,new ef(null,this.R));return new U(this.v,this.m+1,c,d,[a],null)};
h.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.ca(null,b);case 3:return this.Ea(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=function(a,b){return this.ca(null,b)};b.c=function(a,b,d){return this.Ea(null,b,d)};return b}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ua(a)))};h.b=function(b){return this.ca(null,b)};h.a=function(b,a){return this.Ea(null,b,a)};
var W=new ef(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),ed=new U(null,0,5,W,[],Gc);U.prototype[Ra]=function(){return Bc(this)};function Ed(b){if(Na(b))a:{var a=b.length;if(32>a)b=new U(null,a,5,W,b,null);else for(var c=32,d=(new U(null,32,5,W,b.slice(0,32),null)).vb(null);;)if(c<a)var e=c+1,d=oe.a(d,b[c]),c=e;else{b=Qb(d);break a}}else b=Qb(Va.c(Ob,Nb(ed),b));return b}vf;
function ud(b,a,c,d,e,f){this.Ia=b;this.node=a;this.s=c;this.ua=d;this.v=e;this.u=f;this.g=32375020;this.B=1536}h=ud.prototype;h.toString=function(){return ec(this)};h.equiv=function(b){return this.C(null,b)};h.O=function(){return this.v};h.wa=function(){if(this.ua+1<this.node.length){var b;b=this.Ia;var a=this.node,c=this.s,d=this.ua+1;b=uf.o?uf.o(b,a,c,d):uf.call(null,b,a,c,d);return null==b?null:b}return Yb(this)};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Fc(this)};
h.C=function(b,a){return Kc(this,a)};h.da=function(){return Lc(ed,this.v)};h.ea=function(b,a){var c;c=this.Ia;var d=this.s+this.ua,e=P(this.Ia);c=vf.c?vf.c(c,d,e):vf.call(null,c,d,e);return Pc(c,a)};h.fa=function(b,a,c){b=this.Ia;var d=this.s+this.ua,e=P(this.Ia);b=vf.c?vf.c(b,d,e):vf.call(null,b,d,e);return Qc(b,a,c)};h.ta=function(){return this.node[this.ua]};
h.xa=function(){if(this.ua+1<this.node.length){var b;b=this.Ia;var a=this.node,c=this.s,d=this.ua+1;b=uf.o?uf.o(b,a,c,d):uf.call(null,b,a,c,d);return null==b?zc:b}return Xb(this)};h.U=function(){return this};h.nc=function(){var b=this.node;return new ee(b,this.ua,b.length)};h.oc=function(){var b=this.s+this.node.length;if(b<Ya(this.Ia)){var a=this.Ia,c=lf(this.Ia,b);return uf.o?uf.o(a,c,b,0):uf.call(null,a,c,b,0)}return zc};
h.P=function(b,a){return uf.A?uf.A(this.Ia,this.node,this.s,this.ua,a):uf.call(null,this.Ia,this.node,this.s,this.ua,a)};h.W=function(b,a){return Vc(a,this)};h.mc=function(){var b=this.s+this.node.length;if(b<Ya(this.Ia)){var a=this.Ia,c=lf(this.Ia,b);return uf.o?uf.o(a,c,b,0):uf.call(null,a,c,b,0)}return null};ud.prototype[Ra]=function(){return Bc(this)};
var uf=function uf(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return uf.c(arguments[0],arguments[1],arguments[2]);case 4:return uf.o(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return uf.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};uf.c=function(b,a,c){return new ud(b,mf(b,a),a,c,null,null)};
uf.o=function(b,a,c,d){return new ud(b,a,c,d,null,null)};uf.A=function(b,a,c,d,e){return new ud(b,a,c,d,e,null)};uf.w=5;wf;function xf(b,a,c,d,e){this.v=b;this.Na=a;this.start=c;this.end=d;this.u=e;this.g=167666463;this.B=8192}h=xf.prototype;h.toString=function(){return ec(this)};h.equiv=function(b){return this.C(null,b)};h.N=function(b,a){return jb.c(this,a,null)};h.I=function(b,a,c){return"number"===typeof a?G.c(this,a,c):c};
h.Lb=function(b,a,c){b=this.start;for(var d=0;;)if(b<this.end){var e=d,f=G.a(this.Na,b);c=a.c?a.c(c,e,f):a.call(null,c,e,f);if(Oc(c))return O.b?O.b(c):O.call(null,c);d+=1;b+=1}else return c};h.ca=function(b,a){return 0>a||this.end<=this.start+a?kf(a,this.end-this.start):G.a(this.Na,this.start+a)};h.Ea=function(b,a,c){return 0>a||this.end<=this.start+a?c:G.c(this.Na,this.start+a,c)};
h.kb=function(b,a,c){var d=this.start+a;b=this.v;c=id.c(this.Na,d,c);a=this.start;var e=this.end,d=d+1,d=e>d?e:d;return wf.A?wf.A(b,c,a,d,null):wf.call(null,b,c,a,d,null)};h.O=function(){return this.v};h.X=function(){return this.end-this.start};h.jb=function(){return G.a(this.Na,this.end-1)};h.bc=function(){return this.start!==this.end?new Wc(this,this.end-this.start-1,null):null};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Fc(this)};h.C=function(b,a){return Kc(this,a)};
h.da=function(){return Lc(ed,this.v)};h.ea=function(b,a){return Pc(this,a)};h.fa=function(b,a,c){return Qc(this,a,c)};h.Oa=function(b,a,c){if("number"===typeof a)return ub(this,a,c);throw Error("Subvec's key for assoc must be a number.");};h.U=function(){var b=this;return function(a){return function d(e){return e===b.end?null:Vc(G.a(b.Na,e),new ce(null,function(){return function(){return d(e+1)}}(a),null,null))}}(this)(b.start)};
h.P=function(b,a){return wf.A?wf.A(a,this.Na,this.start,this.end,this.u):wf.call(null,a,this.Na,this.start,this.end,this.u)};h.W=function(b,a){var c=this.v,d=ub(this.Na,this.end,a),e=this.start,f=this.end+1;return wf.A?wf.A(c,d,e,f,null):wf.call(null,c,d,e,f,null)};
h.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.ca(null,b);case 3:return this.Ea(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=function(a,b){return this.ca(null,b)};b.c=function(a,b,d){return this.Ea(null,b,d)};return b}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ua(a)))};h.b=function(b){return this.ca(null,b)};h.a=function(b,a){return this.Ea(null,b,a)};xf.prototype[Ra]=function(){return Bc(this)};
function wf(b,a,c,d,e){for(;;)if(a instanceof xf)c=a.start+c,d=a.start+d,a=a.Na;else{var f=P(a);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new xf(b,a,c,d,e)}}var vf=function vf(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return vf.a(arguments[0],arguments[1]);case 3:return vf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};
vf.a=function(b,a){return vf.c(b,a,P(b))};vf.c=function(b,a,c){return wf(null,b,a,c,null)};vf.w=3;function yf(b,a){return b===a.V?a:new ef(b,Ua(a.f))}function pf(b){return new ef({},Ua(b.f))}function qf(b){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];xd(b,0,a,0,b.length);return a}
var zf=function zf(a,c,d,e){d=yf(a.root.V,d);var f=a.m-1>>>c&31;if(5===c)a=e;else{var g=d.f[f];a=null!=g?zf(a,c-5,g,e):hf(a.root.V,c-5,e)}d.f[f]=a;return d};function rf(b,a,c,d){this.m=b;this.shift=a;this.root=c;this.R=d;this.B=88;this.g=275}h=rf.prototype;
h.Rb=function(b,a){if(this.root.V){if(32>this.m-gf(this))this.R[this.m&31]=a;else{var c=new ef(this.root.V,this.R),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=a;this.R=d;if(this.m>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=hf(this.root.V,this.shift,c);this.root=new ef(this.root.V,d);this.shift=e}else this.root=zf(this,this.shift,this.root,c)}this.m+=1;return this}throw Error("conj! after persistent!");};h.Sb=function(){if(this.root.V){this.root.V=null;var b=this.m-gf(this),a=Array(b);xd(this.R,0,a,0,b);return new U(null,this.m,this.shift,this.root,a,null)}throw Error("persistent! called twice");};
h.Qb=function(b,a,c){if("number"===typeof a)return Sb(this,a,c);throw Error("TransientVector's key for assoc! must be a number.");};
h.zc=function(b,a,c){var d=this;if(d.root.V){if(0<=a&&a<d.m)return gf(this)<=a?d.R[a&31]=c:(b=function(){return function f(b,k){var l=yf(d.root.V,k);if(0===b)l.f[a&31]=c;else{var m=a>>>b&31,n=f(b-5,l.f[m]);l.f[m]=n}return l}}(this).call(null,d.shift,d.root),d.root=b),this;if(a===d.m)return Ob(this,c);throw Error([D("Index "),D(a),D(" out of bounds for TransientVector of length"),D(d.m)].join(""));}throw Error("assoc! after persistent!");};
h.X=function(){if(this.root.V)return this.m;throw Error("count after persistent!");};h.ca=function(b,a){if(this.root.V)return mf(this,a)[a&31];throw Error("nth after persistent!");};h.Ea=function(b,a,c){return 0<=a&&a<this.m?G.a(this,a):c};h.N=function(b,a){return jb.c(this,a,null)};h.I=function(b,a,c){return"number"===typeof a?G.c(this,a,c):c};
h.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.N(null,b);case 3:return this.I(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=function(a,b){return this.N(null,b)};b.c=function(a,b,d){return this.I(null,b,d)};return b}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ua(a)))};h.b=function(b){return this.N(null,b)};h.a=function(b,a){return this.I(null,b,a)};function Af(){this.g=2097152;this.B=0}
Af.prototype.equiv=function(b){return this.C(null,b)};Af.prototype.C=function(){return!1};var Bf=new Af;function Cf(b,a){return Ad(qd(a)?P(b)===P(a)?xe(Fd,S.a(function(b){return mc.a(H.c(a,L(b),Bf),bd(b))},b)):null:null)}function Df(b,a,c,d,e){this.s=b;this.qd=a;this.uc=c;this.fd=d;this.Kc=e}Df.prototype.ya=function(){var b=this.s<this.uc;return b?b:this.Kc.ya()};Df.prototype.next=function(){if(this.s<this.uc){var b=gd(this.fd,this.s);this.s+=1;return new U(null,2,5,W,[b,jb.a(this.qd,b)],null)}return this.Kc.next()};
Df.prototype.remove=function(){return Error("Unsupported operation")};function Ef(b){this.J=b}Ef.prototype.next=function(){if(null!=this.J){var b=L(this.J),a=Q(b,0),b=Q(b,1);this.J=N(this.J);return{value:[a,b],done:!1}}return{value:null,done:!0}};function Ff(b){return new Ef(J(b))}function Gf(b){this.J=b}Gf.prototype.next=function(){if(null!=this.J){var b=L(this.J);this.J=N(this.J);return{value:[b,b],done:!1}}return{value:null,done:!0}};
function Hf(b,a){var c;if(a instanceof y)a:{c=b.length;for(var d=a.Ha,e=0;;){if(c<=e){c=-1;break a}if(b[e]instanceof y&&d===b[e].Ha){c=e;break a}e+=2}}else if("string"==typeof a||"number"===typeof a)a:for(c=b.length,d=0;;){if(c<=d){c=-1;break a}if(a===b[d]){c=d;break a}d+=2}else if(a instanceof lc)a:for(c=b.length,d=a.$a,e=0;;){if(c<=e){c=-1;break a}if(b[e]instanceof lc&&d===b[e].$a){c=e;break a}e+=2}else if(null==a)a:for(c=b.length,d=0;;){if(c<=d){c=-1;break a}if(null==b[d]){c=d;break a}d+=2}else a:for(c=
b.length,d=0;;){if(c<=d){c=-1;break a}if(mc.a(a,b[d])){c=d;break a}d+=2}return c}If;function Jf(b,a,c){this.f=b;this.s=a;this.Da=c;this.g=32374990;this.B=0}h=Jf.prototype;h.toString=function(){return ec(this)};h.equiv=function(b){return this.C(null,b)};h.O=function(){return this.Da};h.wa=function(){return this.s<this.f.length-2?new Jf(this.f,this.s+2,this.Da):null};h.X=function(){return(this.f.length-this.s)/2};h.T=function(){return Fc(this)};h.C=function(b,a){return Kc(this,a)};
h.da=function(){return Lc(zc,this.Da)};h.ea=function(b,a){return ad.a(a,this)};h.fa=function(b,a,c){return ad.c(a,c,this)};h.ta=function(){return new U(null,2,5,W,[this.f[this.s],this.f[this.s+1]],null)};h.xa=function(){return this.s<this.f.length-2?new Jf(this.f,this.s+2,this.Da):zc};h.U=function(){return this};h.P=function(b,a){return new Jf(this.f,this.s,a)};h.W=function(b,a){return Vc(a,this)};Jf.prototype[Ra]=function(){return Bc(this)};Kf;Lf;function Mf(b,a,c){this.f=b;this.s=a;this.m=c}
Mf.prototype.ya=function(){return this.s<this.m};Mf.prototype.next=function(){var b=new U(null,2,5,W,[this.f[this.s],this.f[this.s+1]],null);this.s+=2;return b};function v(b,a,c,d){this.v=b;this.m=a;this.f=c;this.u=d;this.g=16647951;this.B=8196}h=v.prototype;h.toString=function(){return ec(this)};h.equiv=function(b){return this.C(null,b)};h.keys=function(){return Bc(Kf.b?Kf.b(this):Kf.call(null,this))};h.entries=function(){return Ff(J(this))};
h.values=function(){return Bc(Lf.b?Lf.b(this):Lf.call(null,this))};h.has=function(b){return Bd(this,b)};h.get=function(b,a){return this.I(null,b,a)};h.forEach=function(b){for(var a=J(this),c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e),g=Q(f,0),f=Q(f,1);b.a?b.a(f,g):b.call(null,f,g);e+=1}else if(a=J(a))vd(a)?(c=Wb(a),a=Xb(a),g=c,d=P(c),c=g):(c=L(a),g=Q(c,0),f=Q(c,1),b.a?b.a(f,g):b.call(null,f,g),a=N(a),c=null,d=0),e=0;else return null};h.N=function(b,a){return jb.c(this,a,null)};
h.I=function(b,a,c){b=Hf(this.f,a);return-1===b?c:this.f[b+1]};h.Lb=function(b,a,c){b=this.f.length;for(var d=0;;)if(d<b){var e=this.f[d],f=this.f[d+1];c=a.c?a.c(c,e,f):a.call(null,c,e,f);if(Oc(c))return O.b?O.b(c):O.call(null,c);d+=2}else return c};h.Ga=function(){return new Mf(this.f,0,2*this.m)};h.O=function(){return this.v};h.X=function(){return this.m};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Hc(this)};
h.C=function(b,a){if(null!=a&&(a.g&1024||a.Uc)){var c=this.f.length;if(this.m===a.X(null))for(var d=0;;)if(d<c){var e=a.I(null,this.f[d],yd);if(e!==yd)if(mc.a(this.f[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return Cf(this,a)};h.vb=function(){return new If({},this.f.length,Ua(this.f))};h.da=function(){return yb(ve,this.v)};h.ea=function(b,a){return ad.a(a,this)};h.fa=function(b,a,c){return ad.c(a,c,this)};
h.ib=function(b,a){if(0<=Hf(this.f,a)){var c=this.f.length,d=c-2;if(0===d)return $a(this);for(var d=Array(d),e=0,f=0;;){if(e>=c)return new v(this.v,this.m-1,d,null);mc.a(a,this.f[e])||(d[f]=this.f[e],d[f+1]=this.f[e+1],f+=2);e+=2}}else return this};
h.Oa=function(b,a,c){b=Hf(this.f,a);if(-1===b){if(this.m<Nf){b=this.f;for(var d=b.length,e=Array(d+2),f=0;;)if(f<d)e[f]=b[f],f+=1;else break;e[d]=a;e[d+1]=c;return new v(this.v,this.m+1,e,null)}return yb(lb(Xe.a(jd,this),a,c),this.v)}if(c===this.f[b+1])return this;a=Ua(this.f);a[b+1]=c;return new v(this.v,this.m,a,null)};h.lc=function(b,a){return-1!==Hf(this.f,a)};h.U=function(){var b=this.f;return 0<=b.length-2?new Jf(b,0,null):null};h.P=function(b,a){return new v(a,this.m,this.f,this.u)};
h.W=function(b,a){if(sd(a))return lb(this,G.a(a,0),G.a(a,1));for(var c=this,d=J(a);;){if(null==d)return c;var e=L(d);if(sd(e))c=lb(c,G.a(e,0),G.a(e,1)),d=N(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
h.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.N(null,b);case 3:return this.I(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=function(a,b){return this.N(null,b)};b.c=function(a,b,d){return this.I(null,b,d)};return b}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ua(a)))};h.b=function(b){return this.N(null,b)};h.a=function(b,a){return this.I(null,b,a)};var ve=new v(null,0,[],Ic),Nf=8;v.prototype[Ra]=function(){return Bc(this)};
Of;function If(b,a,c){this.Bb=b;this.qb=a;this.f=c;this.g=258;this.B=56}h=If.prototype;h.X=function(){if(x(this.Bb))return Od(this.qb);throw Error("count after persistent!");};h.N=function(b,a){return jb.c(this,a,null)};h.I=function(b,a,c){if(x(this.Bb))return b=Hf(this.f,a),-1===b?c:this.f[b+1];throw Error("lookup after persistent!");};
h.Rb=function(b,a){if(x(this.Bb)){if(null!=a?a.g&2048||a.Vc||(a.g?0:Pa(ob,a)):Pa(ob,a))return Rb(this,Sd.b?Sd.b(a):Sd.call(null,a),Td.b?Td.b(a):Td.call(null,a));for(var c=J(a),d=this;;){var e=L(c);if(x(e))c=N(c),d=Rb(d,Sd.b?Sd.b(e):Sd.call(null,e),Td.b?Td.b(e):Td.call(null,e));else return d}}else throw Error("conj! after persistent!");};h.Sb=function(){if(x(this.Bb))return this.Bb=!1,new v(null,Od(this.qb),this.f,null);throw Error("persistent! called twice");};
h.Qb=function(b,a,c){if(x(this.Bb)){b=Hf(this.f,a);if(-1===b){if(this.qb+2<=2*Nf)return this.qb+=2,this.f.push(a),this.f.push(c),this;b=Of.a?Of.a(this.qb,this.f):Of.call(null,this.qb,this.f);return Rb(b,a,c)}c!==this.f[b+1]&&(this.f[b+1]=c);return this}throw Error("assoc! after persistent!");};Pf;hd;function Of(b,a){for(var c=Nb(jd),d=0;;)if(d<b)c=Rb(c,a[d],a[d+1]),d+=2;else return c}function Qf(){this.H=!1}Rf;Sf;Ie;Tf;X;O;function Uf(b,a){return b===a?!0:T(b,a)?!0:mc.a(b,a)}
function Vf(b,a,c){b=Ua(b);b[a]=c;return b}function Wf(b,a){var c=Array(b.length-2);xd(b,0,c,0,2*a);xd(b,2*(a+1),c,2*a,c.length-2*a);return c}function Xf(b,a,c,d){b=b.mb(a);b.f[c]=d;return b}function Yf(b,a,c){for(var d=b.length,e=0,f=c;;)if(e<d){c=b[e];if(null!=c){var g=b[e+1];c=a.c?a.c(f,c,g):a.call(null,f,c,g)}else c=b[e+1],c=null!=c?c.pb(a,f):f;if(Oc(c))return O.b?O.b(c):O.call(null,c);e+=2;f=c}else return f}Zf;function $f(b,a,c,d){this.f=b;this.s=a;this.Zb=c;this.Ra=d}
$f.prototype.advance=function(){for(var b=this.f.length;;)if(this.s<b){var a=this.f[this.s],c=this.f[this.s+1];null!=a?a=this.Zb=new U(null,2,5,W,[a,c],null):null!=c?(a=cc(c),a=a.ya()?this.Ra=a:!1):a=!1;this.s+=2;if(a)return!0}else return!1};$f.prototype.ya=function(){var b=null!=this.Zb;return b?b:(b=null!=this.Ra)?b:this.advance()};
$f.prototype.next=function(){if(null!=this.Zb){var b=this.Zb;this.Zb=null;return b}if(null!=this.Ra)return b=this.Ra.next(),this.Ra.ya()||(this.Ra=null),b;if(this.advance())return this.next();throw Error("No such element");};$f.prototype.remove=function(){return Error("Unsupported operation")};function ag(b,a,c){this.V=b;this.Y=a;this.f=c}h=ag.prototype;h.mb=function(b){if(b===this.V)return this;var a=Pd(this.Y),c=Array(0>a?4:2*(a+1));xd(this.f,0,c,0,2*a);return new ag(b,this.Y,c)};
h.Wb=function(){return Rf.b?Rf.b(this.f):Rf.call(null,this.f)};h.pb=function(b,a){return Yf(this.f,b,a)};h.fb=function(b,a,c,d){var e=1<<(a>>>b&31);if(0===(this.Y&e))return d;var f=Pd(this.Y&e-1),e=this.f[2*f],f=this.f[2*f+1];return null==e?f.fb(b+5,a,c,d):Uf(c,e)?f:d};
h.Qa=function(b,a,c,d,e,f){var g=1<<(c>>>a&31),k=Pd(this.Y&g-1);if(0===(this.Y&g)){var l=Pd(this.Y);if(2*l<this.f.length){b=this.mb(b);a=b.f;f.H=!0;a:for(c=2*(l-k),f=2*k+(c-1),l=2*(k+1)+(c-1);;){if(0===c)break a;a[l]=a[f];--l;--c;--f}a[2*k]=d;a[2*k+1]=e;b.Y|=g;return b}if(16<=l){k=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];k[c>>>a&31]=bg.Qa(b,a+5,c,d,e,f);for(e=d=0;;)if(32>d)0!==
(this.Y>>>d&1)&&(k[d]=null!=this.f[e]?bg.Qa(b,a+5,rc(this.f[e]),this.f[e],this.f[e+1],f):this.f[e+1],e+=2),d+=1;else break;return new Zf(b,l+1,k)}a=Array(2*(l+4));xd(this.f,0,a,0,2*k);a[2*k]=d;a[2*k+1]=e;xd(this.f,2*k,a,2*(k+1),2*(l-k));f.H=!0;b=this.mb(b);b.f=a;b.Y|=g;return b}l=this.f[2*k];g=this.f[2*k+1];if(null==l)return l=g.Qa(b,a+5,c,d,e,f),l===g?this:Xf(this,b,2*k+1,l);if(Uf(d,l))return e===g?this:Xf(this,b,2*k+1,e);f.H=!0;f=a+5;d=Tf.ba?Tf.ba(b,f,l,g,c,d,e):Tf.call(null,b,f,l,g,c,d,e);e=2*
k;k=2*k+1;b=this.mb(b);b.f[e]=null;b.f[k]=d;return b};
h.Pa=function(b,a,c,d,e){var f=1<<(a>>>b&31),g=Pd(this.Y&f-1);if(0===(this.Y&f)){var k=Pd(this.Y);if(16<=k){g=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];g[a>>>b&31]=bg.Pa(b+5,a,c,d,e);for(d=c=0;;)if(32>c)0!==(this.Y>>>c&1)&&(g[c]=null!=this.f[d]?bg.Pa(b+5,rc(this.f[d]),this.f[d],this.f[d+1],e):this.f[d+1],d+=2),c+=1;else break;return new Zf(null,k+1,g)}b=Array(2*(k+1));xd(this.f,
0,b,0,2*g);b[2*g]=c;b[2*g+1]=d;xd(this.f,2*g,b,2*(g+1),2*(k-g));e.H=!0;return new ag(null,this.Y|f,b)}var l=this.f[2*g],f=this.f[2*g+1];if(null==l)return k=f.Pa(b+5,a,c,d,e),k===f?this:new ag(null,this.Y,Vf(this.f,2*g+1,k));if(Uf(c,l))return d===f?this:new ag(null,this.Y,Vf(this.f,2*g+1,d));e.H=!0;e=this.Y;k=this.f;b+=5;b=Tf.aa?Tf.aa(b,l,f,a,c,d):Tf.call(null,b,l,f,a,c,d);c=2*g;g=2*g+1;d=Ua(k);d[c]=null;d[g]=b;return new ag(null,e,d)};
h.Xb=function(b,a,c){var d=1<<(a>>>b&31);if(0===(this.Y&d))return this;var e=Pd(this.Y&d-1),f=this.f[2*e],g=this.f[2*e+1];return null==f?(b=g.Xb(b+5,a,c),b===g?this:null!=b?new ag(null,this.Y,Vf(this.f,2*e+1,b)):this.Y===d?null:new ag(null,this.Y^d,Wf(this.f,e))):Uf(c,f)?new ag(null,this.Y^d,Wf(this.f,e)):this};h.Ga=function(){return new $f(this.f,0,null,null)};var bg=new ag(null,0,[]);function cg(b,a,c){this.f=b;this.s=a;this.Ra=c}
cg.prototype.ya=function(){for(var b=this.f.length;;){if(null!=this.Ra&&this.Ra.ya())return!0;if(this.s<b){var a=this.f[this.s];this.s+=1;null!=a&&(this.Ra=cc(a))}else return!1}};cg.prototype.next=function(){if(this.ya())return this.Ra.next();throw Error("No such element");};cg.prototype.remove=function(){return Error("Unsupported operation")};function Zf(b,a,c){this.V=b;this.m=a;this.f=c}h=Zf.prototype;h.mb=function(b){return b===this.V?this:new Zf(b,this.m,Ua(this.f))};
h.Wb=function(){return Sf.b?Sf.b(this.f):Sf.call(null,this.f)};h.pb=function(b,a){for(var c=this.f.length,d=0,e=a;;)if(d<c){var f=this.f[d];if(null!=f&&(e=f.pb(b,e),Oc(e)))return O.b?O.b(e):O.call(null,e);d+=1}else return e};h.fb=function(b,a,c,d){var e=this.f[a>>>b&31];return null!=e?e.fb(b+5,a,c,d):d};h.Qa=function(b,a,c,d,e,f){var g=c>>>a&31,k=this.f[g];if(null==k)return b=Xf(this,b,g,bg.Qa(b,a+5,c,d,e,f)),b.m+=1,b;a=k.Qa(b,a+5,c,d,e,f);return a===k?this:Xf(this,b,g,a)};
h.Pa=function(b,a,c,d,e){var f=a>>>b&31,g=this.f[f];if(null==g)return new Zf(null,this.m+1,Vf(this.f,f,bg.Pa(b+5,a,c,d,e)));b=g.Pa(b+5,a,c,d,e);return b===g?this:new Zf(null,this.m,Vf(this.f,f,b))};
h.Xb=function(b,a,c){var d=a>>>b&31,e=this.f[d];if(null!=e){b=e.Xb(b+5,a,c);if(b===e)d=this;else if(null==b)if(8>=this.m)a:{e=this.f;b=e.length;a=Array(2*(this.m-1));c=0;for(var f=1,g=0;;)if(c<b)c!==d&&null!=e[c]&&(a[f]=e[c],f+=2,g|=1<<c),c+=1;else{d=new ag(null,g,a);break a}}else d=new Zf(null,this.m-1,Vf(this.f,d,b));else d=new Zf(null,this.m,Vf(this.f,d,b));return d}return this};h.Ga=function(){return new cg(this.f,0,null)};
function dg(b,a,c){a*=2;for(var d=0;;)if(d<a){if(Uf(c,b[d]))return d;d+=2}else return-1}function eg(b,a,c,d){this.V=b;this.bb=a;this.m=c;this.f=d}h=eg.prototype;h.mb=function(b){if(b===this.V)return this;var a=Array(2*(this.m+1));xd(this.f,0,a,0,2*this.m);return new eg(b,this.bb,this.m,a)};h.Wb=function(){return Rf.b?Rf.b(this.f):Rf.call(null,this.f)};h.pb=function(b,a){return Yf(this.f,b,a)};h.fb=function(b,a,c,d){b=dg(this.f,this.m,c);return 0>b?d:Uf(c,this.f[b])?this.f[b+1]:d};
h.Qa=function(b,a,c,d,e,f){if(c===this.bb){a=dg(this.f,this.m,d);if(-1===a){if(this.f.length>2*this.m)return a=2*this.m,c=2*this.m+1,b=this.mb(b),b.f[a]=d,b.f[c]=e,f.H=!0,b.m+=1,b;c=this.f.length;a=Array(c+2);xd(this.f,0,a,0,c);a[c]=d;a[c+1]=e;f.H=!0;d=this.m+1;b===this.V?(this.f=a,this.m=d,b=this):b=new eg(this.V,this.bb,d,a);return b}return this.f[a+1]===e?this:Xf(this,b,a+1,e)}return(new ag(b,1<<(this.bb>>>a&31),[null,this,null,null])).Qa(b,a,c,d,e,f)};
h.Pa=function(b,a,c,d,e){return a===this.bb?(b=dg(this.f,this.m,c),-1===b?(b=2*this.m,a=Array(b+2),xd(this.f,0,a,0,b),a[b]=c,a[b+1]=d,e.H=!0,new eg(null,this.bb,this.m+1,a)):mc.a(this.f[b],d)?this:new eg(null,this.bb,this.m,Vf(this.f,b+1,d))):(new ag(null,1<<(this.bb>>>b&31),[null,this])).Pa(b,a,c,d,e)};h.Xb=function(b,a,c){b=dg(this.f,this.m,c);return-1===b?this:1===this.m?null:new eg(null,this.bb,this.m-1,Wf(this.f,Od(b)))};h.Ga=function(){return new $f(this.f,0,null,null)};
var Tf=function Tf(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return Tf.aa(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return Tf.ba(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};
Tf.aa=function(b,a,c,d,e,f){var g=rc(a);if(g===d)return new eg(null,g,2,[a,c,e,f]);var k=new Qf;return bg.Pa(b,g,a,c,k).Pa(b,d,e,f,k)};Tf.ba=function(b,a,c,d,e,f,g){var k=rc(c);if(k===e)return new eg(null,k,2,[c,d,f,g]);var l=new Qf;return bg.Qa(b,a,k,c,d,l).Qa(b,a,e,f,g,l)};Tf.w=7;function fg(b,a,c,d,e){this.v=b;this.gb=a;this.s=c;this.J=d;this.u=e;this.g=32374860;this.B=0}h=fg.prototype;h.toString=function(){return ec(this)};h.equiv=function(b){return this.C(null,b)};h.O=function(){return this.v};
h.T=function(){var b=this.u;return null!=b?b:this.u=b=Fc(this)};h.C=function(b,a){return Kc(this,a)};h.da=function(){return Lc(zc,this.v)};h.ea=function(b,a){return ad.a(a,this)};h.fa=function(b,a,c){return ad.c(a,c,this)};h.ta=function(){return null==this.J?new U(null,2,5,W,[this.gb[this.s],this.gb[this.s+1]],null):L(this.J)};
h.xa=function(){if(null==this.J){var b=this.gb,a=this.s+2;return Rf.c?Rf.c(b,a,null):Rf.call(null,b,a,null)}var b=this.gb,a=this.s,c=N(this.J);return Rf.c?Rf.c(b,a,c):Rf.call(null,b,a,c)};h.U=function(){return this};h.P=function(b,a){return new fg(a,this.gb,this.s,this.J,this.u)};h.W=function(b,a){return Vc(a,this)};fg.prototype[Ra]=function(){return Bc(this)};
var Rf=function Rf(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Rf.b(arguments[0]);case 3:return Rf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};Rf.b=function(b){return Rf.c(b,0,null)};
Rf.c=function(b,a,c){if(null==c)for(c=b.length;;)if(a<c){if(null!=b[a])return new fg(null,b,a,null,null);var d=b[a+1];if(x(d)&&(d=d.Wb(),x(d)))return new fg(null,b,a+2,d,null);a+=2}else return null;else return new fg(null,b,a,c,null)};Rf.w=3;function gg(b,a,c,d,e){this.v=b;this.gb=a;this.s=c;this.J=d;this.u=e;this.g=32374860;this.B=0}h=gg.prototype;h.toString=function(){return ec(this)};h.equiv=function(b){return this.C(null,b)};h.O=function(){return this.v};
h.T=function(){var b=this.u;return null!=b?b:this.u=b=Fc(this)};h.C=function(b,a){return Kc(this,a)};h.da=function(){return Lc(zc,this.v)};h.ea=function(b,a){return ad.a(a,this)};h.fa=function(b,a,c){return ad.c(a,c,this)};h.ta=function(){return L(this.J)};h.xa=function(){var b=this.gb,a=this.s,c=N(this.J);return Sf.o?Sf.o(null,b,a,c):Sf.call(null,null,b,a,c)};h.U=function(){return this};h.P=function(b,a){return new gg(a,this.gb,this.s,this.J,this.u)};h.W=function(b,a){return Vc(a,this)};
gg.prototype[Ra]=function(){return Bc(this)};var Sf=function Sf(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Sf.b(arguments[0]);case 4:return Sf.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};Sf.b=function(b){return Sf.o(null,b,0,null)};
Sf.o=function(b,a,c,d){if(null==d)for(d=a.length;;)if(c<d){var e=a[c];if(x(e)&&(e=e.Wb(),x(e)))return new gg(b,a,c+1,e,null);c+=1}else return null;else return new gg(b,a,c,d,null)};Sf.w=4;Pf;function hg(b,a,c){this.Aa=b;this.Mc=a;this.tc=c}hg.prototype.ya=function(){return this.tc&&this.Mc.ya()};hg.prototype.next=function(){if(this.tc)return this.Mc.next();this.tc=!0;return this.Aa};hg.prototype.remove=function(){return Error("Unsupported operation")};
function hd(b,a,c,d,e,f){this.v=b;this.m=a;this.root=c;this.za=d;this.Aa=e;this.u=f;this.g=16123663;this.B=8196}h=hd.prototype;h.toString=function(){return ec(this)};h.equiv=function(b){return this.C(null,b)};h.keys=function(){return Bc(Kf.b?Kf.b(this):Kf.call(null,this))};h.entries=function(){return Ff(J(this))};h.values=function(){return Bc(Lf.b?Lf.b(this):Lf.call(null,this))};h.has=function(b){return Bd(this,b)};h.get=function(b,a){return this.I(null,b,a)};
h.forEach=function(b){for(var a=J(this),c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e),g=Q(f,0),f=Q(f,1);b.a?b.a(f,g):b.call(null,f,g);e+=1}else if(a=J(a))vd(a)?(c=Wb(a),a=Xb(a),g=c,d=P(c),c=g):(c=L(a),g=Q(c,0),f=Q(c,1),b.a?b.a(f,g):b.call(null,f,g),a=N(a),c=null,d=0),e=0;else return null};h.N=function(b,a){return jb.c(this,a,null)};h.I=function(b,a,c){return null==a?this.za?this.Aa:c:null==this.root?c:this.root.fb(0,rc(a),a,c)};
h.Lb=function(b,a,c){b=this.za?a.c?a.c(c,null,this.Aa):a.call(null,c,null,this.Aa):c;return Oc(b)?O.b?O.b(b):O.call(null,b):null!=this.root?this.root.pb(a,b):b};h.Ga=function(){var b=this.root?cc(this.root):re;return this.za?new hg(this.Aa,b,!1):b};h.O=function(){return this.v};h.X=function(){return this.m};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Hc(this)};h.C=function(b,a){return Cf(this,a)};h.vb=function(){return new Pf({},this.root,this.m,this.za,this.Aa)};
h.da=function(){return yb(jd,this.v)};h.ib=function(b,a){if(null==a)return this.za?new hd(this.v,this.m-1,this.root,!1,null,null):this;if(null==this.root)return this;var c=this.root.Xb(0,rc(a),a);return c===this.root?this:new hd(this.v,this.m-1,c,this.za,this.Aa,null)};
h.Oa=function(b,a,c){if(null==a)return this.za&&c===this.Aa?this:new hd(this.v,this.za?this.m:this.m+1,this.root,!0,c,null);b=new Qf;a=(null==this.root?bg:this.root).Pa(0,rc(a),a,c,b);return a===this.root?this:new hd(this.v,b.H?this.m+1:this.m,a,this.za,this.Aa,null)};h.lc=function(b,a){return null==a?this.za:null==this.root?!1:this.root.fb(0,rc(a),a,yd)!==yd};h.U=function(){if(0<this.m){var b=null!=this.root?this.root.Wb():null;return this.za?Vc(new U(null,2,5,W,[null,this.Aa],null),b):b}return null};
h.P=function(b,a){return new hd(a,this.m,this.root,this.za,this.Aa,this.u)};h.W=function(b,a){if(sd(a))return lb(this,G.a(a,0),G.a(a,1));for(var c=this,d=J(a);;){if(null==d)return c;var e=L(d);if(sd(e))c=lb(c,G.a(e,0),G.a(e,1)),d=N(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
h.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.N(null,b);case 3:return this.I(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=function(a,b){return this.N(null,b)};b.c=function(a,b,d){return this.I(null,b,d)};return b}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ua(a)))};h.b=function(b){return this.N(null,b)};h.a=function(b,a){return this.I(null,b,a)};var jd=new hd(null,0,null,!1,null,Ic);hd.prototype[Ra]=function(){return Bc(this)};
function Pf(b,a,c,d,e){this.V=b;this.root=a;this.count=c;this.za=d;this.Aa=e;this.g=258;this.B=56}function ig(b,a,c){if(b.V){if(null==a)b.Aa!==c&&(b.Aa=c),b.za||(b.count+=1,b.za=!0);else{var d=new Qf;a=(null==b.root?bg:b.root).Qa(b.V,0,rc(a),a,c,d);a!==b.root&&(b.root=a);d.H&&(b.count+=1)}return b}throw Error("assoc! after persistent!");}h=Pf.prototype;h.X=function(){if(this.V)return this.count;throw Error("count after persistent!");};
h.N=function(b,a){return null==a?this.za?this.Aa:null:null==this.root?null:this.root.fb(0,rc(a),a)};h.I=function(b,a,c){return null==a?this.za?this.Aa:c:null==this.root?c:this.root.fb(0,rc(a),a,c)};
h.Rb=function(b,a){var c;a:if(this.V)if(null!=a?a.g&2048||a.Vc||(a.g?0:Pa(ob,a)):Pa(ob,a))c=ig(this,Sd.b?Sd.b(a):Sd.call(null,a),Td.b?Td.b(a):Td.call(null,a));else{c=J(a);for(var d=this;;){var e=L(c);if(x(e))c=N(c),d=ig(d,Sd.b?Sd.b(e):Sd.call(null,e),Td.b?Td.b(e):Td.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};h.Sb=function(){var b;if(this.V)this.V=null,b=new hd(null,this.count,this.root,this.za,this.Aa,null);else throw Error("persistent! called twice");return b};
h.Qb=function(b,a,c){return ig(this,a,c)};jg;kg;var lg=function lg(a,c,d){d=null!=a.left?lg(a.left,c,d):d;if(Oc(d))return O.b?O.b(d):O.call(null,d);var e=a.key,f=a.H;d=c.c?c.c(d,e,f):c.call(null,d,e,f);if(Oc(d))return O.b?O.b(d):O.call(null,d);a=null!=a.right?lg(a.right,c,d):d;return Oc(a)?O.b?O.b(a):O.call(null,a):a};function kg(b,a,c,d,e){this.key=b;this.H=a;this.left=c;this.right=d;this.u=e;this.g=32402207;this.B=0}h=kg.prototype;h.replace=function(b,a,c,d){return new kg(b,a,c,d,null)};
h.pb=function(b,a){return lg(this,b,a)};h.N=function(b,a){return G.c(this,a,null)};h.I=function(b,a,c){return G.c(this,a,c)};h.ca=function(b,a){return 0===a?this.key:1===a?this.H:null};h.Ea=function(b,a,c){return 0===a?this.key:1===a?this.H:c};h.kb=function(b,a,c){return(new U(null,2,5,W,[this.key,this.H],null)).kb(null,a,c)};h.O=function(){return null};h.X=function(){return 2};h.Mb=function(){return this.key};h.Nb=function(){return this.H};h.jb=function(){return this.H};
h.T=function(){var b=this.u;return null!=b?b:this.u=b=Fc(this)};h.C=function(b,a){return Kc(this,a)};h.da=function(){return ed};h.ea=function(b,a){return Pc(this,a)};h.fa=function(b,a,c){return Qc(this,a,c)};h.Oa=function(b,a,c){return id.c(new U(null,2,5,W,[this.key,this.H],null),a,c)};h.U=function(){return bb(bb(zc,this.H),this.key)};h.P=function(b,a){return Lc(new U(null,2,5,W,[this.key,this.H],null),a)};h.W=function(b,a){return new U(null,3,5,W,[this.key,this.H,a],null)};
h.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.N(null,b);case 3:return this.I(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=function(a,b){return this.N(null,b)};b.c=function(a,b,d){return this.I(null,b,d)};return b}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ua(a)))};h.b=function(b){return this.N(null,b)};h.a=function(b,a){return this.I(null,b,a)};kg.prototype[Ra]=function(){return Bc(this)};
function jg(b,a,c,d,e){this.key=b;this.H=a;this.left=c;this.right=d;this.u=e;this.g=32402207;this.B=0}h=jg.prototype;h.replace=function(b,a,c,d){return new jg(b,a,c,d,null)};h.pb=function(b,a){return lg(this,b,a)};h.N=function(b,a){return G.c(this,a,null)};h.I=function(b,a,c){return G.c(this,a,c)};h.ca=function(b,a){return 0===a?this.key:1===a?this.H:null};h.Ea=function(b,a,c){return 0===a?this.key:1===a?this.H:c};h.kb=function(b,a,c){return(new U(null,2,5,W,[this.key,this.H],null)).kb(null,a,c)};
h.O=function(){return null};h.X=function(){return 2};h.Mb=function(){return this.key};h.Nb=function(){return this.H};h.jb=function(){return this.H};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Fc(this)};h.C=function(b,a){return Kc(this,a)};h.da=function(){return ed};h.ea=function(b,a){return Pc(this,a)};h.fa=function(b,a,c){return Qc(this,a,c)};h.Oa=function(b,a,c){return id.c(new U(null,2,5,W,[this.key,this.H],null),a,c)};h.U=function(){return bb(bb(zc,this.H),this.key)};
h.P=function(b,a){return Lc(new U(null,2,5,W,[this.key,this.H],null),a)};h.W=function(b,a){return new U(null,3,5,W,[this.key,this.H,a],null)};h.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.N(null,b);case 3:return this.I(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=function(a,b){return this.N(null,b)};b.c=function(a,b,d){return this.I(null,b,d)};return b}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ua(a)))};
h.b=function(b){return this.N(null,b)};h.a=function(b,a){return this.I(null,b,a)};jg.prototype[Ra]=function(){return Bc(this)};Sd;var Jc=function Jc(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Jc.j(0<c.length?new xc(c.slice(0),0):null)};Jc.j=function(b){for(var a=J(b),c=Nb(jd);;)if(a){b=N(N(a));var d=L(a),a=bd(a),c=Rb(c,d,a),a=b}else return Qb(c)};Jc.w=0;Jc.D=function(b){return Jc.j(J(b))};
function mg(b,a){this.K=b;this.Da=a;this.g=32374988;this.B=0}h=mg.prototype;h.toString=function(){return ec(this)};h.equiv=function(b){return this.C(null,b)};h.O=function(){return this.Da};h.wa=function(){var b=(null!=this.K?this.K.g&128||this.K.ac||(this.K.g?0:Pa(hb,this.K)):Pa(hb,this.K))?this.K.wa(null):N(this.K);return null==b?null:new mg(b,this.Da)};h.T=function(){return Fc(this)};h.C=function(b,a){return Kc(this,a)};h.da=function(){return Lc(zc,this.Da)};h.ea=function(b,a){return ad.a(a,this)};
h.fa=function(b,a,c){return ad.c(a,c,this)};h.ta=function(){return this.K.ta(null).Mb(null)};h.xa=function(){var b=(null!=this.K?this.K.g&128||this.K.ac||(this.K.g?0:Pa(hb,this.K)):Pa(hb,this.K))?this.K.wa(null):N(this.K);return null!=b?new mg(b,this.Da):zc};h.U=function(){return this};h.P=function(b,a){return new mg(this.K,a)};h.W=function(b,a){return Vc(a,this)};mg.prototype[Ra]=function(){return Bc(this)};function Kf(b){return(b=J(b))?new mg(b,null):null}function Sd(b){return pb(b)}
function ng(b,a){this.K=b;this.Da=a;this.g=32374988;this.B=0}h=ng.prototype;h.toString=function(){return ec(this)};h.equiv=function(b){return this.C(null,b)};h.O=function(){return this.Da};h.wa=function(){var b=(null!=this.K?this.K.g&128||this.K.ac||(this.K.g?0:Pa(hb,this.K)):Pa(hb,this.K))?this.K.wa(null):N(this.K);return null==b?null:new ng(b,this.Da)};h.T=function(){return Fc(this)};h.C=function(b,a){return Kc(this,a)};h.da=function(){return Lc(zc,this.Da)};h.ea=function(b,a){return ad.a(a,this)};
h.fa=function(b,a,c){return ad.c(a,c,this)};h.ta=function(){return this.K.ta(null).Nb(null)};h.xa=function(){var b=(null!=this.K?this.K.g&128||this.K.ac||(this.K.g?0:Pa(hb,this.K)):Pa(hb,this.K))?this.K.wa(null):N(this.K);return null!=b?new ng(b,this.Da):zc};h.U=function(){return this};h.P=function(b,a){return new ng(this.K,a)};h.W=function(b,a){return Vc(a,this)};ng.prototype[Ra]=function(){return Bc(this)};function Lf(b){return(b=J(b))?new ng(b,null):null}function Td(b){return qb(b)}
var og=function og(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return og.j(0<c.length?new xc(c.slice(0),0):null)};og.j=function(b){return x(ye(Fd,b))?Va.a(function(a,b){return dd.a(x(a)?a:ve,b)},b):null};og.w=0;og.D=function(b){return og.j(J(b))};pg;function qg(b){this.Db=b}qg.prototype.ya=function(){return this.Db.ya()};qg.prototype.next=function(){if(this.Db.ya())return this.Db.next().R[0];throw Error("No such element");};qg.prototype.remove=function(){return Error("Unsupported operation")};
function rg(b,a,c){this.v=b;this.nb=a;this.u=c;this.g=15077647;this.B=8196}h=rg.prototype;h.toString=function(){return ec(this)};h.equiv=function(b){return this.C(null,b)};h.keys=function(){return Bc(J(this))};h.entries=function(){var b=J(this);return new Gf(J(b))};h.values=function(){return Bc(J(this))};h.has=function(b){return Bd(this,b)};
h.forEach=function(b){for(var a=J(this),c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e),g=Q(f,0),f=Q(f,1);b.a?b.a(f,g):b.call(null,f,g);e+=1}else if(a=J(a))vd(a)?(c=Wb(a),a=Xb(a),g=c,d=P(c),c=g):(c=L(a),g=Q(c,0),f=Q(c,1),b.a?b.a(f,g):b.call(null,f,g),a=N(a),c=null,d=0),e=0;else return null};h.N=function(b,a){return jb.c(this,a,null)};h.I=function(b,a,c){return kb(this.nb,a)?a:c};h.Ga=function(){return new qg(cc(this.nb))};h.O=function(){return this.v};h.X=function(){return Ya(this.nb)};
h.T=function(){var b=this.u;return null!=b?b:this.u=b=Hc(this)};h.C=function(b,a){return od(a)&&P(this)===P(a)&&xe(function(a){return function(b){return Bd(a,b)}}(this),a)};h.vb=function(){return new pg(Nb(this.nb))};h.da=function(){return Lc(sg,this.v)};h.U=function(){return Kf(this.nb)};h.P=function(b,a){return new rg(a,this.nb,this.u)};h.W=function(b,a){return new rg(this.v,id.c(this.nb,a,null),null)};
h.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.N(null,b);case 3:return this.I(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=function(a,b){return this.N(null,b)};b.c=function(a,b,d){return this.I(null,b,d)};return b}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ua(a)))};h.b=function(b){return this.N(null,b)};h.a=function(b,a){return this.I(null,b,a)};var sg=new rg(null,ve,Ic);rg.prototype[Ra]=function(){return Bc(this)};
function pg(b){this.cb=b;this.B=136;this.g=259}h=pg.prototype;h.Rb=function(b,a){this.cb=Rb(this.cb,a,null);return this};h.Sb=function(){return new rg(null,Qb(this.cb),null)};h.X=function(){return P(this.cb)};h.N=function(b,a){return jb.c(this,a,null)};h.I=function(b,a,c){return jb.c(this.cb,a,yd)===yd?c:a};
h.call=function(){function b(a,b,c){return jb.c(this.cb,b,yd)===yd?c:b}function a(a,b){return jb.c(this.cb,b,yd)===yd?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return a.call(this,c,e);case 3:return b.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=a;c.c=b;return c}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ua(a)))};h.b=function(b){return jb.c(this.cb,b,yd)===yd?null:b};h.a=function(b,a){return jb.c(this.cb,b,yd)===yd?a:b};
function tg(b){for(var a=ed;;)if(N(b))a=dd.a(a,L(b)),b=N(b);else return J(a)}function Rd(b){if(null!=b&&(b.B&4096||b.Xc))return b.Ob(null);if("string"===typeof b)return b;throw Error([D("Doesn't support name: "),D(b)].join(""));}function ug(b,a){for(var c=Nb(ve),d=J(b),e=J(a);;)if(d&&e)var f=L(d),g=L(e),c=Rb(c,f,g),d=N(d),e=N(e);else return Qb(c)}
function vg(b,a){return new ce(null,function(){var c=J(a);if(c){var d;d=L(c);d=b.b?b.b(d):b.call(null,d);c=x(d)?Vc(L(c),vg(b,yc(c))):null}else c=null;return c},null,null)}function wg(b,a,c){this.s=b;this.end=a;this.step=c}wg.prototype.ya=function(){return 0<this.step?this.s<this.end:this.s>this.end};wg.prototype.next=function(){var b=this.s;this.s+=this.step;return b};function xg(b,a,c,d,e){this.v=b;this.start=a;this.end=c;this.step=d;this.u=e;this.g=32375006;this.B=8192}h=xg.prototype;
h.toString=function(){return ec(this)};h.equiv=function(b){return this.C(null,b)};h.ca=function(b,a){if(a<Ya(this))return this.start+a*this.step;if(this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};h.Ea=function(b,a,c){return a<Ya(this)?this.start+a*this.step:this.start>this.end&&0===this.step?this.start:c};h.Ga=function(){return new wg(this.start,this.end,this.step)};h.O=function(){return this.v};
h.wa=function(){return 0<this.step?this.start+this.step<this.end?new xg(this.v,this.start+this.step,this.end,this.step,null):null:this.start+this.step>this.end?new xg(this.v,this.start+this.step,this.end,this.step,null):null};h.X=function(){return Oa(Fb(this))?0:Math.ceil((this.end-this.start)/this.step)};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Fc(this)};h.C=function(b,a){return Kc(this,a)};h.da=function(){return Lc(zc,this.v)};h.ea=function(b,a){return Pc(this,a)};
h.fa=function(b,a,c){for(b=this.start;;)if(0<this.step?b<this.end:b>this.end){c=a.a?a.a(c,b):a.call(null,c,b);if(Oc(c))return O.b?O.b(c):O.call(null,c);b+=this.step}else return c};h.ta=function(){return null==Fb(this)?null:this.start};h.xa=function(){return null!=Fb(this)?new xg(this.v,this.start+this.step,this.end,this.step,null):zc};h.U=function(){return 0<this.step?this.start<this.end?this:null:0>this.step?this.start>this.end?this:null:this.start===this.end?null:this};
h.P=function(b,a){return new xg(a,this.start,this.end,this.step,this.u)};h.W=function(b,a){return Vc(a,this)};xg.prototype[Ra]=function(){return Bc(this)};function yg(b){return new xg(null,0,b,1,null)}function zg(b,a){return new ce(null,function(){var c=J(a);if(c){var d=L(c),e=b.b?b.b(d):b.call(null,d),d=Vc(d,vg(function(a,c){return function(a){return mc.a(c,b.b?b.b(a):b.call(null,a))}}(d,e,c,c),N(c)));return Vc(d,zg(b,J(Me(P(d),c))))}return null},null,null)}
function Ag(b){return new ce(null,function(){var a=J(b);return a?Bg(Hd,L(a),yc(a)):bb(zc,Hd.l?Hd.l():Hd.call(null))},null,null)}function Bg(b,a,c){return Vc(a,new ce(null,function(){var d=J(c);if(d){var e=Bg,f;f=L(d);f=b.a?b.a(a,f):b.call(null,a,f);d=e(b,f,yc(d))}else d=null;return d},null,null))}
function Cg(b,a){return function(){function c(c,d,e){return new U(null,2,5,W,[b.c?b.c(c,d,e):b.call(null,c,d,e),a.c?a.c(c,d,e):a.call(null,c,d,e)],null)}function d(c,d){return new U(null,2,5,W,[b.a?b.a(c,d):b.call(null,c,d),a.a?a.a(c,d):a.call(null,c,d)],null)}function e(c){return new U(null,2,5,W,[b.b?b.b(c):b.call(null,c),a.b?a.b(c):a.call(null,c)],null)}function f(){return new U(null,2,5,W,[b.l?b.l():b.call(null),a.l?a.l():a.call(null)],null)}var g=null,k=function(){function c(a,b,e,f){var g=null;
if(3<arguments.length){for(var g=0,k=Array(arguments.length-3);g<k.length;)k[g]=arguments[g+3],++g;g=new xc(k,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){return new U(null,2,5,W,[F.A(b,c,e,f,g),F.A(a,c,e,f,g)],null)}c.w=3;c.D=function(a){var b=L(a);a=N(a);var c=L(a);a=N(a);var e=L(a);a=yc(a);return d(b,c,e,a)};c.j=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);
default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+3],++q;q=new xc(r,0)}return k.j(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.D=k.D;g.l=f;g.b=e;g.a=d;g.c=c;g.j=k.j;return g}()}function Dg(b){a:for(var a=b;;)if(J(a))a=N(a);else break a;return b}
function sf(b,a,c,d,e,f,g){var k=ya;ya=null==ya?null:ya-1;try{if(null!=ya&&0>ya)return Kb(b,"#");Kb(b,c);if(0===Ia.b(f))J(g)&&Kb(b,function(){var a=Eg.b(f);return x(a)?a:"..."}());else{if(J(g)){var l=L(g);a.c?a.c(l,b,f):a.call(null,l,b,f)}for(var m=N(g),n=Ia.b(f)-1;;)if(!m||null!=n&&0===n){J(m)&&0===n&&(Kb(b,d),Kb(b,function(){var a=Eg.b(f);return x(a)?a:"..."}()));break}else{Kb(b,d);var p=L(m);c=b;g=f;a.c?a.c(p,c,g):a.call(null,p,c,g);var q=N(m);c=n-1;m=q;n=c}}return Kb(b,e)}finally{ya=k}}
function Fg(b,a){for(var c=J(a),d=null,e=0,f=0;;)if(f<e){var g=d.ca(null,f);Kb(b,g);f+=1}else if(c=J(c))d=c,vd(d)?(c=Wb(d),e=Xb(d),d=c,g=P(c),c=e,e=g):(g=L(d),Kb(b,g),c=N(d),d=null,e=0),f=0;else return null}var Gg={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function Hg(b){return[D('"'),D(b.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return Gg[a]})),D('"')].join("")}Ig;
function Jg(b,a){var c=Ad(H.a(b,Ga));return c?(c=null!=a?a.g&131072||a.Wc?!0:!1:!1)?null!=md(a):c:c}
function Kg(b,a,c){if(null==b)return Kb(a,"nil");if(Jg(c,b)){Kb(a,"^");var d=md(b);tf.c?tf.c(d,a,c):tf.call(null,d,a,c);Kb(a," ")}if(b.xb)return b.Tb(b,a,c);if(null!=b&&(b.g&2147483648||b.Z))return b.M(null,a,c);if(!0===b||!1===b||"number"===typeof b)return Kb(a,""+D(b));if(null!=b&&b.constructor===Object)return Kb(a,"#js "),d=S.a(function(a){return new U(null,2,5,W,[be.b(a),b[a]],null)},wd(b)),Ig.o?Ig.o(d,tf,a,c):Ig.call(null,d,tf,a,c);if(Na(b))return sf(a,tf,"#js ["," ","]",c,b);if("string"==typeof b)return x(Fa.b(c))?
Kb(a,Hg(b)):Kb(a,b);if(fa(b)){var e=b.name;c=x(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return Fg(a,I(["#object[",c,' "',""+D(b),'"]'],0))}if(b instanceof Date)return c=function(a,b){for(var c=""+D(a);;)if(P(c)<b)c=[D("0"),D(c)].join("");else return c},Fg(a,I(['#inst "',""+D(b.getUTCFullYear()),"-",c(b.getUTCMonth()+1,2),"-",c(b.getUTCDate(),2),"T",c(b.getUTCHours(),2),":",c(b.getUTCMinutes(),2),":",c(b.getUTCSeconds(),2),".",c(b.getUTCMilliseconds(),3),"-",'00:00"'],
0));if(b instanceof RegExp)return Fg(a,I(['#"',b.source,'"'],0));if(null!=b&&(b.g&2147483648||b.Z))return Lb(b,a,c);if(x(b.constructor.eb))return Fg(a,I(["#object[",b.constructor.eb.replace(RegExp("/","g"),"."),"]"],0));e=b.constructor.name;c=x(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return Fg(a,I(["#object[",c," ",""+D(b),"]"],0))}function tf(b,a,c){var d=Lg.b(c);return x(d)?(c=id.c(c,Mg,Kg),d.c?d.c(b,a,c):d.call(null,b,a,c)):Kg(b,a,c)}
var He=function He(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return He.j(0<c.length?new xc(c.slice(0),0):null)};He.j=function(b){var a=Ca();if(nd(b))a="";else{var c=D,d=new sa;a:{var e=new dc(d);tf(L(b),e,a);b=J(N(b));for(var f=null,g=0,k=0;;)if(k<g){var l=f.ca(null,k);Kb(e," ");tf(l,e,a);k+=1}else if(b=J(b))f=b,vd(f)?(b=Wb(f),g=Xb(f),f=b,l=P(b),b=g,g=l):(l=L(f),Kb(e," "),tf(l,e,a),b=N(f),f=null,g=0),k=0;else break a}a=""+c(d)}return a};He.w=0;He.D=function(b){return He.j(J(b))};
function Ig(b,a,c,d){return sf(c,function(b,c,d){var k=pb(b);a.c?a.c(k,c,d):a.call(null,k,c,d);Kb(c," ");b=qb(b);return a.c?a.c(b,c,d):a.call(null,b,c,d)},"{",", ","}",d,J(b))}Ke.prototype.Z=!0;Ke.prototype.M=function(b,a,c){Kb(a,"#object [cljs.core.Volatile ");tf(new v(null,1,[Ng,this.state],null),a,c);return Kb(a,"]")};xc.prototype.Z=!0;xc.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};ce.prototype.Z=!0;ce.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};
fg.prototype.Z=!0;fg.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};kg.prototype.Z=!0;kg.prototype.M=function(b,a,c){return sf(a,tf,"["," ","]",c,this)};Jf.prototype.Z=!0;Jf.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};Dc.prototype.Z=!0;Dc.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};ud.prototype.Z=!0;ud.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};$d.prototype.Z=!0;
$d.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};Wc.prototype.Z=!0;Wc.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};hd.prototype.Z=!0;hd.prototype.M=function(b,a,c){return Ig(this,tf,a,c)};gg.prototype.Z=!0;gg.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};xf.prototype.Z=!0;xf.prototype.M=function(b,a,c){return sf(a,tf,"["," ","]",c,this)};rg.prototype.Z=!0;rg.prototype.M=function(b,a,c){return sf(a,tf,"#{"," ","}",c,this)};td.prototype.Z=!0;
td.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};Fe.prototype.Z=!0;Fe.prototype.M=function(b,a,c){Kb(a,"#object [cljs.core.Atom ");tf(new v(null,1,[Ng,this.state],null),a,c);return Kb(a,"]")};ng.prototype.Z=!0;ng.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};jg.prototype.Z=!0;jg.prototype.M=function(b,a,c){return sf(a,tf,"["," ","]",c,this)};U.prototype.Z=!0;U.prototype.M=function(b,a,c){return sf(a,tf,"["," ","]",c,this)};Yd.prototype.Z=!0;
Yd.prototype.M=function(b,a){return Kb(a,"()")};we.prototype.Z=!0;we.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};v.prototype.Z=!0;v.prototype.M=function(b,a,c){return Ig(this,tf,a,c)};xg.prototype.Z=!0;xg.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};mg.prototype.Z=!0;mg.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};Xc.prototype.Z=!0;Xc.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};lc.prototype.Ib=!0;
lc.prototype.ub=function(b,a){if(a instanceof lc)return tc(this,a);throw Error([D("Cannot compare "),D(this),D(" to "),D(a)].join(""));};y.prototype.Ib=!0;y.prototype.ub=function(b,a){if(a instanceof y)return ae(this,a);throw Error([D("Cannot compare "),D(this),D(" to "),D(a)].join(""));};xf.prototype.Ib=!0;xf.prototype.ub=function(b,a){if(sd(a))return Cd(this,a);throw Error([D("Cannot compare "),D(this),D(" to "),D(a)].join(""));};U.prototype.Ib=!0;
U.prototype.ub=function(b,a){if(sd(a))return Cd(this,a);throw Error([D("Cannot compare "),D(this),D(" to "),D(a)].join(""));};var Og=null;function Pg(b){null==Og&&(Og=X.b?X.b(0):X.call(null,0));return uc.b([D(b),D(Je.a(Og,Mc))].join(""))}function Qg(b){return function(a,c){var d=b.a?b.a(a,c):b.call(null,a,c);return Oc(d)?new Nc(d):d}}
function Te(b){return function(a){return function(){function c(b,c){return Va.c(a,b,c)}function d(a){return b.b?b.b(a):b.call(null,a)}function e(){return b.l?b.l():b.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.l=e;f.b=d;f.a=c;return f}()}(Qg(b))}Rg;function Sg(){}
var Tg=function Tg(a){if(null!=a&&null!=a.Tc)return a.Tc(a);var c=Tg[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Tg._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IEncodeJS.-clj-\x3ejs",a);};Ug;function Vg(b){return(null!=b?b.Sc||(b.ec?0:Pa(Sg,b)):Pa(Sg,b))?Tg(b):"string"===typeof b||"number"===typeof b||b instanceof y||b instanceof lc?Ug.b?Ug.b(b):Ug.call(null,b):He.j(I([b],0))}
var Ug=function Ug(a){if(null==a)return null;if(null!=a?a.Sc||(a.ec?0:Pa(Sg,a)):Pa(Sg,a))return Tg(a);if(a instanceof y)return Rd(a);if(a instanceof lc)return""+D(a);if(qd(a)){var c={};a=J(a);for(var d=null,e=0,f=0;;)if(f<e){var g=d.ca(null,f),k=Q(g,0),g=Q(g,1);c[Vg(k)]=Ug(g);f+=1}else if(a=J(a))vd(a)?(e=Wb(a),a=Xb(a),d=e,e=P(e)):(e=L(a),d=Q(e,0),e=Q(e,1),c[Vg(d)]=Ug(e),a=N(a),d=null,e=0),f=0;else break;return c}if(null==a?0:null!=a?a.g&8||a.wd||(a.g?0:Pa(ab,a)):Pa(ab,a)){c=[];a=J(S.a(Ug,a));d=null;
for(f=e=0;;)if(f<e)k=d.ca(null,f),c.push(k),f+=1;else if(a=J(a))d=a,vd(d)?(a=Wb(d),f=Xb(d),d=a,e=P(a),a=f):(a=L(d),c.push(a),a=N(d),d=null,e=0),f=0;else break;return c}return a},Rg=function Rg(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Rg.l();case 1:return Rg.b(arguments[0]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};Rg.l=function(){return Rg.b(1)};Rg.b=function(b){return Math.random()*b};Rg.w=1;
var Wg=null;function Xg(){if(null==Wg){var b=new v(null,3,[Yg,ve,Zg,ve,$g,ve],null);Wg=X.b?X.b(b):X.call(null,b)}return Wg}function ah(b,a,c){var d=mc.a(a,c);if(!d&&!(d=Bd($g.b(b).call(null,a),c))&&(d=sd(c))&&(d=sd(a)))if(d=P(c)===P(a))for(var d=!0,e=0;;)if(d&&e!==P(c))d=ah(b,a.b?a.b(e):a.call(null,e),c.b?c.b(e):c.call(null,e)),e+=1;else return d;else return d;else return d}function bh(b){var a;a=Xg();a=O.b?O.b(a):O.call(null,a);return qe(H.a(Yg.b(a),b))}
function ch(b,a,c,d){Je.a(b,function(){return O.b?O.b(a):O.call(null,a)});Je.a(c,function(){return O.b?O.b(d):O.call(null,d)})}var dh=function dh(a,c,d){var e=(O.b?O.b(d):O.call(null,d)).call(null,a),e=x(x(e)?e.b?e.b(c):e.call(null,c):e)?!0:null;if(x(e))return e;e=function(){for(var e=bh(c);;)if(0<P(e))dh(a,L(e),d),e=yc(e);else return null}();if(x(e))return e;e=function(){for(var e=bh(a);;)if(0<P(e))dh(L(e),c,d),e=yc(e);else return null}();return x(e)?e:!1};
function eh(b,a,c){c=dh(b,a,c);if(x(c))b=c;else{c=ah;var d;d=Xg();d=O.b?O.b(d):O.call(null,d);b=c(d,b,a)}return b}
var fh=function fh(a,c,d,e,f,g,k){var l=Va.c(function(e,g){var k=Q(g,0);Q(g,1);if(ah(O.b?O.b(d):O.call(null,d),c,k)){var l;l=(l=null==e)?l:eh(k,L(e),f);l=x(l)?g:e;if(!x(eh(L(l),k,f)))throw Error([D("Multiple methods in multimethod '"),D(a),D("' match dispatch value: "),D(c),D(" -\x3e "),D(k),D(" and "),D(L(l)),D(", and neither is preferred")].join(""));return l}return e},null,O.b?O.b(e):O.call(null,e));if(x(l)){if(mc.a(O.b?O.b(k):O.call(null,k),O.b?O.b(d):O.call(null,d)))return Je.o(g,id,c,bd(l)),
bd(l);ch(g,e,k,d);return fh(a,c,d,e,f,g,k)}return null};function gh(b,a){throw Error([D("No method in multimethod '"),D(b),D("' for dispatch value: "),D(a)].join(""));}function hh(b,a,c,d,e,f,g,k){this.name=b;this.i=a;this.ed=c;this.Vb=d;this.Eb=e;this.pd=f;this.Yb=g;this.Hb=k;this.g=4194305;this.B=4352}h=hh.prototype;
h.call=function(){function b(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,A,M,K){a=this;var za=F.j(a.i,b,c,d,e,I([f,g,k,l,m,n,p,q,r,t,w,z,C,E,A,M,K],0)),Zj=ih(this,za);x(Zj)||gh(a.name,za);return F.j(Zj,b,c,d,e,I([f,g,k,l,m,n,p,q,r,t,w,z,C,E,A,M,K],0))}function a(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,A,M){a=this;var K=a.i.qa?a.i.qa(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,A,M):a.i.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,A,M),za=ih(this,K);x(za)||gh(a.name,K);return za.qa?za.qa(b,c,d,e,f,g,k,l,m,n,p,q,r,
t,w,z,C,E,A,M):za.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,A,M)}function c(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,A){a=this;var M=a.i.pa?a.i.pa(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,A):a.i.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,A),K=ih(this,M);x(K)||gh(a.name,M);return K.pa?K.pa(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,A):K.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,A)}function d(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E){a=this;var A=a.i.oa?a.i.oa(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E):a.i.call(null,
b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E),M=ih(this,A);x(M)||gh(a.name,A);return M.oa?M.oa(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E):M.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E)}function e(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C){a=this;var E=a.i.na?a.i.na(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C):a.i.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C),A=ih(this,E);x(A)||gh(a.name,E);return A.na?A.na(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C):A.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C)}function f(a,b,c,d,e,f,g,k,l,m,n,p,q,r,
t,w,z){a=this;var C=a.i.ma?a.i.ma(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z):a.i.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z),E=ih(this,C);x(E)||gh(a.name,C);return E.ma?E.ma(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z):E.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z)}function g(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w){a=this;var z=a.i.la?a.i.la(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w):a.i.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w),C=ih(this,z);x(C)||gh(a.name,z);return C.la?C.la(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w):C.call(null,b,c,d,e,f,g,k,l,m,n,p,
q,r,t,w)}function k(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t){a=this;var w=a.i.ka?a.i.ka(b,c,d,e,f,g,k,l,m,n,p,q,r,t):a.i.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t),z=ih(this,w);x(z)||gh(a.name,w);return z.ka?z.ka(b,c,d,e,f,g,k,l,m,n,p,q,r,t):z.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t)}function l(a,b,c,d,e,f,g,k,l,m,n,p,q,r){a=this;var t=a.i.ja?a.i.ja(b,c,d,e,f,g,k,l,m,n,p,q,r):a.i.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r),w=ih(this,t);x(w)||gh(a.name,t);return w.ja?w.ja(b,c,d,e,f,g,k,l,m,n,p,q,r):w.call(null,b,c,d,e,f,
g,k,l,m,n,p,q,r)}function m(a,b,c,d,e,f,g,k,l,m,n,p,q){a=this;var r=a.i.ia?a.i.ia(b,c,d,e,f,g,k,l,m,n,p,q):a.i.call(null,b,c,d,e,f,g,k,l,m,n,p,q),t=ih(this,r);x(t)||gh(a.name,r);return t.ia?t.ia(b,c,d,e,f,g,k,l,m,n,p,q):t.call(null,b,c,d,e,f,g,k,l,m,n,p,q)}function n(a,b,c,d,e,f,g,k,l,m,n,p){a=this;var q=a.i.ha?a.i.ha(b,c,d,e,f,g,k,l,m,n,p):a.i.call(null,b,c,d,e,f,g,k,l,m,n,p),r=ih(this,q);x(r)||gh(a.name,q);return r.ha?r.ha(b,c,d,e,f,g,k,l,m,n,p):r.call(null,b,c,d,e,f,g,k,l,m,n,p)}function p(a,b,
c,d,e,f,g,k,l,m,n){a=this;var p=a.i.ga?a.i.ga(b,c,d,e,f,g,k,l,m,n):a.i.call(null,b,c,d,e,f,g,k,l,m,n),q=ih(this,p);x(q)||gh(a.name,p);return q.ga?q.ga(b,c,d,e,f,g,k,l,m,n):q.call(null,b,c,d,e,f,g,k,l,m,n)}function q(a,b,c,d,e,f,g,k,l,m){a=this;var n=a.i.sa?a.i.sa(b,c,d,e,f,g,k,l,m):a.i.call(null,b,c,d,e,f,g,k,l,m),p=ih(this,n);x(p)||gh(a.name,n);return p.sa?p.sa(b,c,d,e,f,g,k,l,m):p.call(null,b,c,d,e,f,g,k,l,m)}function r(a,b,c,d,e,f,g,k,l){a=this;var m=a.i.ra?a.i.ra(b,c,d,e,f,g,k,l):a.i.call(null,
b,c,d,e,f,g,k,l),n=ih(this,m);x(n)||gh(a.name,m);return n.ra?n.ra(b,c,d,e,f,g,k,l):n.call(null,b,c,d,e,f,g,k,l)}function t(a,b,c,d,e,f,g,k){a=this;var l=a.i.ba?a.i.ba(b,c,d,e,f,g,k):a.i.call(null,b,c,d,e,f,g,k),m=ih(this,l);x(m)||gh(a.name,l);return m.ba?m.ba(b,c,d,e,f,g,k):m.call(null,b,c,d,e,f,g,k)}function w(a,b,c,d,e,f,g){a=this;var k=a.i.aa?a.i.aa(b,c,d,e,f,g):a.i.call(null,b,c,d,e,f,g),l=ih(this,k);x(l)||gh(a.name,k);return l.aa?l.aa(b,c,d,e,f,g):l.call(null,b,c,d,e,f,g)}function z(a,b,c,d,
e,f){a=this;var g=a.i.A?a.i.A(b,c,d,e,f):a.i.call(null,b,c,d,e,f),k=ih(this,g);x(k)||gh(a.name,g);return k.A?k.A(b,c,d,e,f):k.call(null,b,c,d,e,f)}function C(a,b,c,d,e){a=this;var f=a.i.o?a.i.o(b,c,d,e):a.i.call(null,b,c,d,e),g=ih(this,f);x(g)||gh(a.name,f);return g.o?g.o(b,c,d,e):g.call(null,b,c,d,e)}function E(a,b,c,d){a=this;var e=a.i.c?a.i.c(b,c,d):a.i.call(null,b,c,d),f=ih(this,e);x(f)||gh(a.name,e);return f.c?f.c(b,c,d):f.call(null,b,c,d)}function K(a,b,c){a=this;var d=a.i.a?a.i.a(b,c):a.i.call(null,
b,c),e=ih(this,d);x(e)||gh(a.name,d);return e.a?e.a(b,c):e.call(null,b,c)}function M(a,b){a=this;var c=a.i.b?a.i.b(b):a.i.call(null,b),d=ih(this,c);x(d)||gh(a.name,c);return d.b?d.b(b):d.call(null,b)}function za(a){a=this;var b=a.i.l?a.i.l():a.i.call(null),c=ih(this,b);x(c)||gh(a.name,b);return c.l?c.l():c.call(null)}var A=null,A=function(ea,A,R,V,ba,ca,ga,ja,la,oa,pa,Ta,Aa,Ea,Sa,Za,Ka,gb,Pb,vc,rd,af){switch(arguments.length){case 1:return za.call(this,ea);case 2:return M.call(this,ea,A);case 3:return K.call(this,
ea,A,R);case 4:return E.call(this,ea,A,R,V);case 5:return C.call(this,ea,A,R,V,ba);case 6:return z.call(this,ea,A,R,V,ba,ca);case 7:return w.call(this,ea,A,R,V,ba,ca,ga);case 8:return t.call(this,ea,A,R,V,ba,ca,ga,ja);case 9:return r.call(this,ea,A,R,V,ba,ca,ga,ja,la);case 10:return q.call(this,ea,A,R,V,ba,ca,ga,ja,la,oa);case 11:return p.call(this,ea,A,R,V,ba,ca,ga,ja,la,oa,pa);case 12:return n.call(this,ea,A,R,V,ba,ca,ga,ja,la,oa,pa,Ta);case 13:return m.call(this,ea,A,R,V,ba,ca,ga,ja,la,oa,pa,Ta,
Aa);case 14:return l.call(this,ea,A,R,V,ba,ca,ga,ja,la,oa,pa,Ta,Aa,Ea);case 15:return k.call(this,ea,A,R,V,ba,ca,ga,ja,la,oa,pa,Ta,Aa,Ea,Sa);case 16:return g.call(this,ea,A,R,V,ba,ca,ga,ja,la,oa,pa,Ta,Aa,Ea,Sa,Za);case 17:return f.call(this,ea,A,R,V,ba,ca,ga,ja,la,oa,pa,Ta,Aa,Ea,Sa,Za,Ka);case 18:return e.call(this,ea,A,R,V,ba,ca,ga,ja,la,oa,pa,Ta,Aa,Ea,Sa,Za,Ka,gb);case 19:return d.call(this,ea,A,R,V,ba,ca,ga,ja,la,oa,pa,Ta,Aa,Ea,Sa,Za,Ka,gb,Pb);case 20:return c.call(this,ea,A,R,V,ba,ca,ga,ja,la,
oa,pa,Ta,Aa,Ea,Sa,Za,Ka,gb,Pb,vc);case 21:return a.call(this,ea,A,R,V,ba,ca,ga,ja,la,oa,pa,Ta,Aa,Ea,Sa,Za,Ka,gb,Pb,vc,rd);case 22:return b.call(this,ea,A,R,V,ba,ca,ga,ja,la,oa,pa,Ta,Aa,Ea,Sa,Za,Ka,gb,Pb,vc,rd,af)}throw Error("Invalid arity: "+arguments.length);};A.b=za;A.a=M;A.c=K;A.o=E;A.A=C;A.aa=z;A.ba=w;A.ra=t;A.sa=r;A.ga=q;A.ha=p;A.ia=n;A.ja=m;A.ka=l;A.la=k;A.ma=g;A.na=f;A.oa=e;A.pa=d;A.qa=c;A.Kb=a;A.wb=b;return A}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ua(a)))};
h.l=function(){var b=this.i.l?this.i.l():this.i.call(null),a=ih(this,b);x(a)||gh(this.name,b);return a.l?a.l():a.call(null)};h.b=function(b){var a=this.i.b?this.i.b(b):this.i.call(null,b),c=ih(this,a);x(c)||gh(this.name,a);return c.b?c.b(b):c.call(null,b)};h.a=function(b,a){var c=this.i.a?this.i.a(b,a):this.i.call(null,b,a),d=ih(this,c);x(d)||gh(this.name,c);return d.a?d.a(b,a):d.call(null,b,a)};
h.c=function(b,a,c){var d=this.i.c?this.i.c(b,a,c):this.i.call(null,b,a,c),e=ih(this,d);x(e)||gh(this.name,d);return e.c?e.c(b,a,c):e.call(null,b,a,c)};h.o=function(b,a,c,d){var e=this.i.o?this.i.o(b,a,c,d):this.i.call(null,b,a,c,d),f=ih(this,e);x(f)||gh(this.name,e);return f.o?f.o(b,a,c,d):f.call(null,b,a,c,d)};h.A=function(b,a,c,d,e){var f=this.i.A?this.i.A(b,a,c,d,e):this.i.call(null,b,a,c,d,e),g=ih(this,f);x(g)||gh(this.name,f);return g.A?g.A(b,a,c,d,e):g.call(null,b,a,c,d,e)};
h.aa=function(b,a,c,d,e,f){var g=this.i.aa?this.i.aa(b,a,c,d,e,f):this.i.call(null,b,a,c,d,e,f),k=ih(this,g);x(k)||gh(this.name,g);return k.aa?k.aa(b,a,c,d,e,f):k.call(null,b,a,c,d,e,f)};h.ba=function(b,a,c,d,e,f,g){var k=this.i.ba?this.i.ba(b,a,c,d,e,f,g):this.i.call(null,b,a,c,d,e,f,g),l=ih(this,k);x(l)||gh(this.name,k);return l.ba?l.ba(b,a,c,d,e,f,g):l.call(null,b,a,c,d,e,f,g)};
h.ra=function(b,a,c,d,e,f,g,k){var l=this.i.ra?this.i.ra(b,a,c,d,e,f,g,k):this.i.call(null,b,a,c,d,e,f,g,k),m=ih(this,l);x(m)||gh(this.name,l);return m.ra?m.ra(b,a,c,d,e,f,g,k):m.call(null,b,a,c,d,e,f,g,k)};h.sa=function(b,a,c,d,e,f,g,k,l){var m=this.i.sa?this.i.sa(b,a,c,d,e,f,g,k,l):this.i.call(null,b,a,c,d,e,f,g,k,l),n=ih(this,m);x(n)||gh(this.name,m);return n.sa?n.sa(b,a,c,d,e,f,g,k,l):n.call(null,b,a,c,d,e,f,g,k,l)};
h.ga=function(b,a,c,d,e,f,g,k,l,m){var n=this.i.ga?this.i.ga(b,a,c,d,e,f,g,k,l,m):this.i.call(null,b,a,c,d,e,f,g,k,l,m),p=ih(this,n);x(p)||gh(this.name,n);return p.ga?p.ga(b,a,c,d,e,f,g,k,l,m):p.call(null,b,a,c,d,e,f,g,k,l,m)};h.ha=function(b,a,c,d,e,f,g,k,l,m,n){var p=this.i.ha?this.i.ha(b,a,c,d,e,f,g,k,l,m,n):this.i.call(null,b,a,c,d,e,f,g,k,l,m,n),q=ih(this,p);x(q)||gh(this.name,p);return q.ha?q.ha(b,a,c,d,e,f,g,k,l,m,n):q.call(null,b,a,c,d,e,f,g,k,l,m,n)};
h.ia=function(b,a,c,d,e,f,g,k,l,m,n,p){var q=this.i.ia?this.i.ia(b,a,c,d,e,f,g,k,l,m,n,p):this.i.call(null,b,a,c,d,e,f,g,k,l,m,n,p),r=ih(this,q);x(r)||gh(this.name,q);return r.ia?r.ia(b,a,c,d,e,f,g,k,l,m,n,p):r.call(null,b,a,c,d,e,f,g,k,l,m,n,p)};h.ja=function(b,a,c,d,e,f,g,k,l,m,n,p,q){var r=this.i.ja?this.i.ja(b,a,c,d,e,f,g,k,l,m,n,p,q):this.i.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q),t=ih(this,r);x(t)||gh(this.name,r);return t.ja?t.ja(b,a,c,d,e,f,g,k,l,m,n,p,q):t.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q)};
h.ka=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r){var t=this.i.ka?this.i.ka(b,a,c,d,e,f,g,k,l,m,n,p,q,r):this.i.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r),w=ih(this,t);x(w)||gh(this.name,t);return w.ka?w.ka(b,a,c,d,e,f,g,k,l,m,n,p,q,r):w.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r)};
h.la=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t){var w=this.i.la?this.i.la(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t):this.i.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t),z=ih(this,w);x(z)||gh(this.name,w);return z.la?z.la(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t):z.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t)};
h.ma=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w){var z=this.i.ma?this.i.ma(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w):this.i.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w),C=ih(this,z);x(C)||gh(this.name,z);return C.ma?C.ma(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w):C.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w)};
h.na=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z){var C=this.i.na?this.i.na(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z):this.i.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z),E=ih(this,C);x(E)||gh(this.name,C);return E.na?E.na(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z):E.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z)};
h.oa=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C){var E=this.i.oa?this.i.oa(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C):this.i.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C),K=ih(this,E);x(K)||gh(this.name,E);return K.oa?K.oa(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C):K.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C)};
h.pa=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E){var K=this.i.pa?this.i.pa(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E):this.i.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E),M=ih(this,K);x(M)||gh(this.name,K);return M.pa?M.pa(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E):M.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E)};
h.qa=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,K){var M=this.i.qa?this.i.qa(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,K):this.i.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,K),za=ih(this,M);x(za)||gh(this.name,M);return za.qa?za.qa(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,K):za.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,K)};
h.Kb=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,K,M){var za=F.j(this.i,b,a,c,d,I([e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,K,M],0)),A=ih(this,za);x(A)||gh(this.name,za);return F.j(A,b,a,c,d,I([e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,K,M],0))};function jh(b,a,c){Je.o(b.Eb,id,a,c);ch(b.Yb,b.Eb,b.Hb,b.Vb)}
function ih(b,a){mc.a(O.b?O.b(b.Hb):O.call(null,b.Hb),O.b?O.b(b.Vb):O.call(null,b.Vb))||ch(b.Yb,b.Eb,b.Hb,b.Vb);var c=(O.b?O.b(b.Yb):O.call(null,b.Yb)).call(null,a);if(x(c))return c;c=fh(b.name,a,b.Vb,b.Eb,b.pd,b.Yb,b.Hb);return x(c)?c:(O.b?O.b(b.Eb):O.call(null,b.Eb)).call(null,b.ed)}h.Ob=function(){return Zb(this.name)};h.Pb=function(){return $b(this.name)};h.T=function(){return this[ha]||(this[ha]=++ia)};var kh=new y(null,"y","y",-1757859776),lh=new y(null,"path","path",-188191168),mh=new y(null,"penny-spacing","penny-spacing",-20780703),nh=new y(null,"supplier","supplier",18255489),oh=new y(null,"determine-capacity","determine-capacity",-452765887),ph=new y(null,"by-station","by-station",516084641),qh=new y(null,"selector","selector",762528866),rh=new y(null,"r","r",-471384190),sh=new y(null,"run","run",-1821166653),th=new y(null,"richpath","richpath",-150197948),uh=new y(null,"transform","transform",
1381301764),vh=new y(null,"die","die",-547192252),Ga=new y(null,"meta","meta",1499536964),wh=new y(null,"transformer","transformer",-1493470620),xh=new y(null,"color","color",1011675173),yh=new y(null,"executors","executors",-331073403),Ha=new y(null,"dup","dup",556298533),zh=new y(null,"intaking","intaking",-1009888859),Ah=new y(null,"processing","processing",-1576405467),Bh=new y(null,"stats-history","stats-history",636123973),Ch=new y(null,"spout-y","spout-y",1676697606),Dh=new y(null,"stations",
"stations",-19744730),Eh=new y(null,"capacity","capacity",72689734),Fh=new y(null,"private","private",-558947994),Gh=new y(null,"efficient","efficient",-63016538),Hh=new y(null,"graphs?","graphs?",-270895578),Ih=new y(null,"transform*","transform*",-1613794522),Jh=new y(null,"button","button",1456579943),Kh=new y(null,"top","top",-1856271961),Lh=new y(null,"basic+efficient","basic+efficient",-970783161),Ge=new y(null,"validator","validator",-1966190681),Mh=new y(null,"total-utilization","total-utilization",
-1341502521),Nh=new lc(null,"meta22074","meta22074",-996283288,null),Oh=new y(null,"default","default",-1987822328),Ph=new y(null,"finally-block","finally-block",832982472),Qh=new y(null,"utilization","utilization",-1258491735),Rh=new y(null,"scenarios","scenarios",1618559369),Sh=new y(null,"value","value",305978217),Th=new y(null,"green","green",-945526839),Uh=new y(null,"section","section",-300141526),Vh=new y(null,"circle","circle",1903212362),Wh=new y(null,"drop","drop",364481611),Xh=new y(null,
"width","width",-384071477),Yh=new y(null,"supply","supply",-1701696309),Zh=new y(null,"spath","spath",-1857758005),$h=new y(null,"source-spout-y","source-spout-y",1447094571),ai=new y(null,"onclick","onclick",1297553739),bi=new y(null,"dy","dy",1719547243),ci=new y(null,"params","params",710516235),di=new lc(null,"meta19306","meta19306",1065163371,null),ei=new y(null,"total-output","total-output",1149740747),fi=new y(null,"easing","easing",735372043),Ng=new y(null,"val","val",128701612),Y=new y(null,
"recur","recur",-437573268),gi=new y(null,"type","type",1174270348),hi=new y(null,"catch-block","catch-block",1175212748),ii=new y(null,"duration","duration",1444101068),ji=new y(null,"constrained","constrained",597287981),ki=new y(null,"intaking?","intaking?",834765),Mg=new y(null,"fallback-impl","fallback-impl",-1501286995),li=new y(null,"output","output",-1105869043),Da=new y(null,"flush-on-newline","flush-on-newline",-151457939),mi=new y(null,"all","all",892129742),ni=new y(null,"normal","normal",
-1519123858),oi=new y(null,"wip","wip",-103467282),pi=new y(null,"className","className",-1983287057),Zg=new y(null,"descendants","descendants",1824886031),qi=new y(null,"size","size",1098693007),ri=new y(null,"accessor","accessor",-25476721),si=new y(null,"title","title",636505583),ti=new y(null,"no-op","no-op",-93046065),ui=new lc(null,"folder","folder",-1138554033,null),vi=new y(null,"num-needed-params","num-needed-params",-1219326097),wi=new y(null,"dropping","dropping",125809647),xi=new y(null,
"high","high",2027297808),$g=new y(null,"ancestors","ancestors",-776045424),yi=new y(null,"style","style",-496642736),zi=new y(null,"div","div",1057191632),Fa=new y(null,"readably","readably",1129599760),Ai=new y(null,"params-idx","params-idx",340984624),Bi=new lc(null,"box","box",-1123515375,null),Eg=new y(null,"more-marker","more-marker",-14717935),Ci=new y(null,"g","g",1738089905),Di=new y(null,"update-stats","update-stats",1938193073),Ei=new lc(null,"meta19005","meta19005",-209490926,null),Fi=
new y(null,"transfer-to-next-station","transfer-to-next-station",-114193262),Gi=new y(null,"set-spacing","set-spacing",1920968978),Hi=new y(null,"intake","intake",-108984782),Ii=new y(null,"set-up","set-up",874388242),Ji=new lc(null,"coll","coll",-1006698606,null),Ki=new y(null,"line","line",212345235),Li=new lc(null,"val","val",1769233139,null),Mi=new lc(null,"xf","xf",2042434515,null),Ia=new y(null,"print-length","print-length",1931866356),Ni=new y(null,"select*","select*",-1829914060),Oi=new y(null,
"cx","cx",1272694324),Pi=new y(null,"id","id",-1388402092),Qi=new y(null,"class","class",-2030961996),Ri=new y(null,"red","red",-969428204),Si=new y(null,"blue","blue",-622100620),Ti=new y(null,"cy","cy",755331060),Ui=new y(null,"catch-exception","catch-exception",-1997306795),Vi=new y(null,"total-input","total-input",1219129557),Yg=new y(null,"parents","parents",-2027538891),Wi=new y(null,"collect-val","collect-val",801894069),Xi=new y(null,"xlink:href","xlink:href",828777205),Yi=new y(null,"prev",
"prev",-1597069226),Zi=new y(null,"svg","svg",856789142),$i=new y(null,"bin-h","bin-h",346004918),aj=new y(null,"length","length",588987862),bj=new y(null,"continue-block","continue-block",-1852047850),cj=new y(null,"hookTransition","hookTransition",-1045887913),dj=new y(null,"distribution","distribution",-284555369),ej=new y(null,"transfer-to-processed","transfer-to-processed",198231991),fj=new y(null,"roll","roll",11266999),gj=new y(null,"position","position",-2011731912),hj=new y(null,"graphs",
"graphs",-1584479112),ij=new y(null,"basic","basic",1043717368),jj=new y(null,"image","image",-58725096),kj=new y(null,"d","d",1972142424),lj=new y(null,"dropping?","dropping?",-1065207176),mj=new y(null,"processed","processed",800622264),nj=new y(null,"x","x",2099068185),oj=new y(null,"x1","x1",-1863922247),pj=new y(null,"input","input",556931961),qj=new y(null,"transform-fns","transform-fns",669042649),ue=new lc(null,"quote","quote",1377916282,null),rj=new y(null,"fixed","fixed",-562004358),te=
new y(null,"arglists","arglists",1661989754),df=new y(null,"dice","dice",707777434),sj=new y(null,"y2","y2",-718691301),tj=new y(null,"set-lengths","set-lengths",742672507),se=new lc(null,"nil-iter","nil-iter",1101030523,null),uj=new y(null,"main","main",-2117802661),vj=new y(null,"hierarchy","hierarchy",-1053470341),Lg=new y(null,"alt-impl","alt-impl",670969595),wj=new lc(null,"fn-handler","fn-handler",648785851,null),xj=new y(null,"doc","doc",1913296891),yj=new y(null,"integrate","integrate",-1653689604),
zj=new y(null,"rect","rect",-108902628),Aj=new y(null,"step","step",1288888124),Bj=new y(null,"delay","delay",-574225219),Cj=new y(null,"x2","x2",-1362513475),Dj=new y(null,"pennies","pennies",1847043709),Ej=new y(null,"incoming","incoming",-1710131427),Fj=new y(null,"productivity","productivity",-890721314),Gj=new y(null,"range","range",1639692286),Hj=new y(null,"height","height",1025178622),Ij=new y(null,"spacing","spacing",204422175),Jj=new y(null,"left","left",-399115937),Kj=new y(null,"foreignObject",
"foreignObject",25502111),Lj=new y(null,"text","text",-1790561697),Mj=new lc(null,"meta22137","meta22137",493706943,null),Nj=new y(null,"data","data",-232669377),Oj=new lc(null,"f","f",43394975,null);function Pj(b){return document.querySelector([D("#"),D(b),D(" .penny-path")].join(""))}function Qj(b){return document.querySelector([D("#"),D(b),D(" .ramp")].join(""))};var Rj;a:{var Sj=aa.navigator;if(Sj){var Tj=Sj.userAgent;if(Tj){Rj=Tj;break a}}Rj=""};var Uj;function Vj(b){return b.l?b.l():b.call(null)}function Wj(b,a,c){return qd(c)?Bb(c,b,a):null==c?a:Na(c)?Sc(c,b,a):Ab.c(c,b,a)}
var Xj=function Xj(a,c,d,e){if(null!=a&&null!=a.qc)return a.qc(a,c,d,e);var f=Xj[u(null==a?null:a)];if(null!=f)return f.o?f.o(a,c,d,e):f.call(null,a,c,d,e);f=Xj._;if(null!=f)return f.o?f.o(a,c,d,e):f.call(null,a,c,d,e);throw B("CollFold.coll-fold",a);},Yj=function Yj(a,c){"undefined"===typeof Uj&&(Uj=function(a,c,f,g){this.gd=a;this.fc=c;this.ab=f;this.jd=g;this.g=917504;this.B=0},Uj.prototype.P=function(a,c){return new Uj(this.gd,this.fc,this.ab,c)},Uj.prototype.O=function(){return this.jd},Uj.prototype.ea=
function(a,c){return Ab.c(this.fc,this.ab.b?this.ab.b(c):this.ab.call(null,c),c.l?c.l():c.call(null))},Uj.prototype.fa=function(a,c,f){return Ab.c(this.fc,this.ab.b?this.ab.b(c):this.ab.call(null,c),f)},Uj.prototype.qc=function(a,c,f,g){return Xj(this.fc,c,f,this.ab.b?this.ab.b(g):this.ab.call(null,g))},Uj.ic=function(){return new U(null,4,5,W,[Lc(ui,new v(null,2,[te,kc(ue,kc(new U(null,2,5,W,[Ji,Mi],null))),xj,"Given a foldable collection, and a transformation function xf,\n  returns a foldable collection, where any supplied reducing\n  fn will be transformed by xf. xf is a function of reducing fn to\n  reducing fn."],
null)),Ji,Mi,Ei],null)},Uj.xb=!0,Uj.eb="clojure.core.reducers/t_clojure$core$reducers19004",Uj.Tb=function(a,c){return Kb(c,"clojure.core.reducers/t_clojure$core$reducers19004")});return new Uj(Yj,a,c,ve)};
function ak(b,a){return Yj(a,function(a){return function(){function d(d,e,f){e=b.a?b.a(e,f):b.call(null,e,f);return a.a?a.a(d,e):a.call(null,d,e)}function e(d,e){var f=b.b?b.b(e):b.call(null,e);return a.a?a.a(d,f):a.call(null,d,f)}function f(){return a.l?a.l():a.call(null)}var g=null,g=function(a,b,c){switch(arguments.length){case 0:return f.call(this);case 2:return e.call(this,a,b);case 3:return d.call(this,a,b,c)}throw Error("Invalid arity: "+arguments.length);};g.l=f;g.a=e;g.c=d;return g}()})}
function bk(b,a){return Yj(a,function(a){return function(){function d(d,e,f){return Wj(a,d,b.a?b.a(e,f):b.call(null,e,f))}function e(d,e){return Wj(a,d,b.b?b.b(e):b.call(null,e))}function f(){return a.l?a.l():a.call(null)}var g=null,g=function(a,b,c){switch(arguments.length){case 0:return f.call(this);case 2:return e.call(this,a,b);case 3:return d.call(this,a,b,c)}throw Error("Invalid arity: "+arguments.length);};g.l=f;g.a=e;g.c=d;return g}()})}
var ck=function ck(a,c,d,e){if(nd(a))return d.l?d.l():d.call(null);if(P(a)<=c)return Wj(e,d.l?d.l():d.call(null),a);var f=Od(P(a)),g=vf.c(a,0,f);a=vf.c(a,f,P(a));return Vj(function(a,c,e,f){return function(){var a=f(c),g;g=f(e);a=a.l?a.l():a.call(null);g=g.l?g.l():g.call(null);return d.a?d.a(a,g):d.call(null,a,g)}}(f,g,a,function(a,f,g){return function(n){return function(){return function(){return ck(n,c,d,e)}}(a,f,g)}}(f,g,a)))};Xj["null"]=function(b,a,c){return c.l?c.l():c.call(null)};
Xj.object=function(b,a,c,d){return Wj(d,c.l?c.l():c.call(null),b)};U.prototype.qc=function(b,a,c,d){return ck(this,a,c,d)};function dk(){}var ek=function ek(a,c,d){if(null!=a&&null!=a.zb)return a.zb(a,c,d);var e=ek[u(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=ek._;if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw B("StructurePath.select*",a);},fk=function fk(a,c,d){if(null!=a&&null!=a.Ab)return a.Ab(a,c,d);var e=fk[u(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=fk._;if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw B("StructurePath.transform*",a);};
function gk(){}var hk=function hk(a,c){if(null!=a&&null!=a.rc)return a.rc(0,c);var d=hk[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=hk._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("Collector.collect-val",a);};var ik=function ik(a){if(null!=a&&null!=a.Gc)return a.Gc();var c=ik[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=ik._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("PathComposer.comp-paths*",a);};function jk(b,a,c){this.type=b;this.sd=a;this.ud=c}var kk;
kk=new jk(th,function(b,a,c,d){var e=function(){return function(a,b,c,d){return nd(c)?new U(null,1,5,W,[d],null):new U(null,1,5,W,[dd.a(c,d)],null)}}(b,a,ed,d);return c.A?c.A(b,a,ed,d,e):c.call(null,b,a,ed,d,e)},function(b,a,c,d,e){var f=function(){return function(a,b,c,e){return nd(c)?d.b?d.b(e):d.call(null,e):F.a(d,dd.a(c,e))}}(b,a,ed,e);return c.A?c.A(b,a,ed,e,f):c.call(null,b,a,ed,e,f)});var lk;
lk=new jk(Zh,function(b,a,c,d){b=function(){return function(a){return new U(null,1,5,W,[a],null)}}(d);return c.a?c.a(d,b):c.call(null,d,b)},function(b,a,c,d,e){return c.a?c.a(e,d):c.call(null,e,d)});function mk(b,a,c,d,e,f){this.Ka=b;this.La=a;this.Ma=c;this.S=d;this.F=e;this.u=f;this.g=2229667594;this.B=8192}h=mk.prototype;h.N=function(b,a){return jb.c(this,a,null)};
h.I=function(b,a,c){switch(a instanceof y?a.Ha:null){case "executors":return this.Ka;case "selector":return this.La;case "transformer":return this.Ma;default:return H.c(this.F,a,c)}};h.M=function(b,a,c){return sf(a,function(){return function(b){return sf(a,tf,""," ","",c,b)}}(this),"#com.rpl.specter.impl.TransformFunctions{",", ","}",c,me.a(new U(null,3,5,W,[new U(null,2,5,W,[yh,this.Ka],null),new U(null,2,5,W,[qh,this.La],null),new U(null,2,5,W,[wh,this.Ma],null)],null),this.F))};
h.Ga=function(){return new Df(0,this,3,new U(null,3,5,W,[yh,qh,wh],null),cc(this.F))};h.O=function(){return this.S};h.X=function(){return 3+P(this.F)};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Ud(this)};h.C=function(b,a){var c;c=x(a)?(c=this.constructor===a.constructor)?Cf(this,a):c:a;return x(c)?!0:!1};
h.ib=function(b,a){return Bd(new rg(null,new v(null,3,[qh,null,wh,null,yh,null],null),null),a)?kd.a(Lc(Xe.a(ve,this),this.S),a):new mk(this.Ka,this.La,this.Ma,this.S,qe(kd.a(this.F,a)),null)};
h.Oa=function(b,a,c){return x(T.a?T.a(yh,a):T.call(null,yh,a))?new mk(c,this.La,this.Ma,this.S,this.F,null):x(T.a?T.a(qh,a):T.call(null,qh,a))?new mk(this.Ka,c,this.Ma,this.S,this.F,null):x(T.a?T.a(wh,a):T.call(null,wh,a))?new mk(this.Ka,this.La,c,this.S,this.F,null):new mk(this.Ka,this.La,this.Ma,this.S,id.c(this.F,a,c),null)};h.U=function(){return J(me.a(new U(null,3,5,W,[new U(null,2,5,W,[yh,this.Ka],null),new U(null,2,5,W,[qh,this.La],null),new U(null,2,5,W,[wh,this.Ma],null)],null),this.F))};
h.P=function(b,a){return new mk(this.Ka,this.La,this.Ma,a,this.F,this.u)};h.W=function(b,a){return sd(a)?lb(this,G.a(a,0),G.a(a,1)):Va.c(bb,this,a)};function nk(b,a,c){return new mk(b,a,c,null,null,null)}function ok(b,a,c,d,e,f){this.va=b;this.Xa=a;this.Ya=c;this.S=d;this.F=e;this.u=f;this.g=2229667594;this.B=8192}h=ok.prototype;h.N=function(b,a){return jb.c(this,a,null)};
h.I=function(b,a,c){switch(a instanceof y?a.Ha:null){case "transform-fns":return this.va;case "params":return this.Xa;case "params-idx":return this.Ya;default:return H.c(this.F,a,c)}};h.M=function(b,a,c){return sf(a,function(){return function(b){return sf(a,tf,""," ","",c,b)}}(this),"#com.rpl.specter.impl.CompiledPath{",", ","}",c,me.a(new U(null,3,5,W,[new U(null,2,5,W,[qj,this.va],null),new U(null,2,5,W,[ci,this.Xa],null),new U(null,2,5,W,[Ai,this.Ya],null)],null),this.F))};
h.Ga=function(){return new Df(0,this,3,new U(null,3,5,W,[qj,ci,Ai],null),cc(this.F))};h.O=function(){return this.S};h.X=function(){return 3+P(this.F)};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Ud(this)};h.C=function(b,a){var c;c=x(a)?(c=this.constructor===a.constructor)?Cf(this,a):c:a;return x(c)?!0:!1};
h.ib=function(b,a){return Bd(new rg(null,new v(null,3,[ci,null,Ai,null,qj,null],null),null),a)?kd.a(Lc(Xe.a(ve,this),this.S),a):new ok(this.va,this.Xa,this.Ya,this.S,qe(kd.a(this.F,a)),null)};
h.Oa=function(b,a,c){return x(T.a?T.a(qj,a):T.call(null,qj,a))?new ok(c,this.Xa,this.Ya,this.S,this.F,null):x(T.a?T.a(ci,a):T.call(null,ci,a))?new ok(this.va,c,this.Ya,this.S,this.F,null):x(T.a?T.a(Ai,a):T.call(null,Ai,a))?new ok(this.va,this.Xa,c,this.S,this.F,null):new ok(this.va,this.Xa,this.Ya,this.S,id.c(this.F,a,c),null)};h.U=function(){return J(me.a(new U(null,3,5,W,[new U(null,2,5,W,[qj,this.va],null),new U(null,2,5,W,[ci,this.Xa],null),new U(null,2,5,W,[Ai,this.Ya],null)],null),this.F))};
h.P=function(b,a){return new ok(this.va,this.Xa,this.Ya,a,this.F,this.u)};h.W=function(b,a){return sd(a)?lb(this,G.a(a,0),G.a(a,1)):Va.c(bb,this,a)};function pk(b){return new ok(b,null,0,null,null,null)}Z;function qk(b,a,c,d,e){this.va=b;this.rb=a;this.S=c;this.F=d;this.u=e;this.g=2229667595;this.B=8192}h=qk.prototype;h.N=function(b,a){return jb.c(this,a,null)};
h.I=function(b,a,c){switch(a instanceof y?a.Ha:null){case "transform-fns":return this.va;case "num-needed-params":return this.rb;default:return H.c(this.F,a,c)}};h.M=function(b,a,c){return sf(a,function(){return function(b){return sf(a,tf,""," ","",c,b)}}(this),"#com.rpl.specter.impl.ParamsNeededPath{",", ","}",c,me.a(new U(null,2,5,W,[new U(null,2,5,W,[qj,this.va],null),new U(null,2,5,W,[vi,this.rb],null)],null),this.F))};h.Ga=function(){return new Df(0,this,2,new U(null,2,5,W,[qj,vi],null),cc(this.F))};
h.call=function(){function b(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,A,C,E,M,K){a=je(me.a(new U(null,20,5,W,[b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,A,C,E,M],null),K));return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function a(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,A,C,E,M){a=je(20);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=w;a[15]=z;a[16]=A;a[17]=C;a[18]=E;a[19]=M;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function c(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,
w,z,A,C,E){a=je(19);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=w;a[15]=z;a[16]=A;a[17]=C;a[18]=E;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function d(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,A,C){a=je(18);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=w;a[15]=z;a[16]=A;a[17]=C;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function e(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,A){a=je(17);
a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=w;a[15]=z;a[16]=A;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function f(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z){a=je(16);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=w;a[15]=z;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function g(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w){a=je(15);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;a[7]=l;
a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=w;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function k(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t){a=je(14);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function l(a,b,c,d,e,f,g,k,l,m,n,p,q,r){a=je(13);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function m(a,
b,c,d,e,f,g,k,l,m,n,p,q){a=je(12);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function n(a,b,c,d,e,f,g,k,l,m,n,p){a=je(11);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;a[7]=l;a[8]=m;a[9]=n;a[10]=p;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function p(a,b,c,d,e,f,g,k,l,m,n){a=je(10);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;a[7]=l;a[8]=m;a[9]=n;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function q(a,
b,c,d,e,f,g,k,l,m){a=je(9);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;a[7]=l;a[8]=m;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function r(a,b,c,d,e,f,g,k,l){a=je(8);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;a[7]=l;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function t(a,b,c,d,e,f,g,k){a=je(7);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function w(a,b,c,d,e,f,g){a=je(6);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;return Z.c?Z.c(this,
a,0):Z.call(null,this,a,0)}function z(a,b,c,d,e,f){a=je(5);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function C(a,b,c,d,e){a=je(4);a[0]=b;a[1]=c;a[2]=d;a[3]=e;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function E(a,b,c,d){a=je(3);a[0]=b;a[1]=c;a[2]=d;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function K(a,b,c){a=je(2);a[0]=b;a[1]=c;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function M(a,b){var c=je(1);c[0]=b;return Z.c?Z.c(this,c,0):Z.call(null,
this,c,0)}function za(){var a=je(0);return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}var A=null,A=function(A,na,R,V,ba,ca,ga,ja,la,oa,pa,Ta,Aa,Ea,Sa,Za,Ka,gb,Pb,vc,rd,af){switch(arguments.length){case 1:return za.call(this);case 2:return M.call(this,0,na);case 3:return K.call(this,0,na,R);case 4:return E.call(this,0,na,R,V);case 5:return C.call(this,0,na,R,V,ba);case 6:return z.call(this,0,na,R,V,ba,ca);case 7:return w.call(this,0,na,R,V,ba,ca,ga);case 8:return t.call(this,0,na,R,V,ba,ca,ga,ja);case 9:return r.call(this,
0,na,R,V,ba,ca,ga,ja,la);case 10:return q.call(this,0,na,R,V,ba,ca,ga,ja,la,oa);case 11:return p.call(this,0,na,R,V,ba,ca,ga,ja,la,oa,pa);case 12:return n.call(this,0,na,R,V,ba,ca,ga,ja,la,oa,pa,Ta);case 13:return m.call(this,0,na,R,V,ba,ca,ga,ja,la,oa,pa,Ta,Aa);case 14:return l.call(this,0,na,R,V,ba,ca,ga,ja,la,oa,pa,Ta,Aa,Ea);case 15:return k.call(this,0,na,R,V,ba,ca,ga,ja,la,oa,pa,Ta,Aa,Ea,Sa);case 16:return g.call(this,0,na,R,V,ba,ca,ga,ja,la,oa,pa,Ta,Aa,Ea,Sa,Za);case 17:return f.call(this,0,
na,R,V,ba,ca,ga,ja,la,oa,pa,Ta,Aa,Ea,Sa,Za,Ka);case 18:return e.call(this,0,na,R,V,ba,ca,ga,ja,la,oa,pa,Ta,Aa,Ea,Sa,Za,Ka,gb);case 19:return d.call(this,0,na,R,V,ba,ca,ga,ja,la,oa,pa,Ta,Aa,Ea,Sa,Za,Ka,gb,Pb);case 20:return c.call(this,0,na,R,V,ba,ca,ga,ja,la,oa,pa,Ta,Aa,Ea,Sa,Za,Ka,gb,Pb,vc);case 21:return a.call(this,0,na,R,V,ba,ca,ga,ja,la,oa,pa,Ta,Aa,Ea,Sa,Za,Ka,gb,Pb,vc,rd);case 22:return b.call(this,0,na,R,V,ba,ca,ga,ja,la,oa,pa,Ta,Aa,Ea,Sa,Za,Ka,gb,Pb,vc,rd,af)}throw Error("Invalid arity: "+
arguments.length);};A.b=za;A.a=M;A.c=K;A.o=E;A.A=C;A.aa=z;A.ba=w;A.ra=t;A.sa=r;A.ga=q;A.ha=p;A.ia=n;A.ja=m;A.ka=l;A.la=k;A.ma=g;A.na=f;A.oa=e;A.pa=d;A.qa=c;A.Kb=a;A.wb=b;return A}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ua(a)))};h.l=function(){var b=je(0);return Z.c?Z.c(this,b,0):Z.call(null,this,b,0)};h.b=function(b){var a=je(1);a[0]=b;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)};
h.a=function(b,a){var c=je(2);c[0]=b;c[1]=a;return Z.c?Z.c(this,c,0):Z.call(null,this,c,0)};h.c=function(b,a,c){var d=je(3);d[0]=b;d[1]=a;d[2]=c;return Z.c?Z.c(this,d,0):Z.call(null,this,d,0)};h.o=function(b,a,c,d){var e=je(4);e[0]=b;e[1]=a;e[2]=c;e[3]=d;return Z.c?Z.c(this,e,0):Z.call(null,this,e,0)};h.A=function(b,a,c,d,e){var f=je(5);f[0]=b;f[1]=a;f[2]=c;f[3]=d;f[4]=e;return Z.c?Z.c(this,f,0):Z.call(null,this,f,0)};
h.aa=function(b,a,c,d,e,f){var g=je(6);g[0]=b;g[1]=a;g[2]=c;g[3]=d;g[4]=e;g[5]=f;return Z.c?Z.c(this,g,0):Z.call(null,this,g,0)};h.ba=function(b,a,c,d,e,f,g){var k=je(7);k[0]=b;k[1]=a;k[2]=c;k[3]=d;k[4]=e;k[5]=f;k[6]=g;return Z.c?Z.c(this,k,0):Z.call(null,this,k,0)};h.ra=function(b,a,c,d,e,f,g,k){var l=je(8);l[0]=b;l[1]=a;l[2]=c;l[3]=d;l[4]=e;l[5]=f;l[6]=g;l[7]=k;return Z.c?Z.c(this,l,0):Z.call(null,this,l,0)};
h.sa=function(b,a,c,d,e,f,g,k,l){var m=je(9);m[0]=b;m[1]=a;m[2]=c;m[3]=d;m[4]=e;m[5]=f;m[6]=g;m[7]=k;m[8]=l;return Z.c?Z.c(this,m,0):Z.call(null,this,m,0)};h.ga=function(b,a,c,d,e,f,g,k,l,m){var n=je(10);n[0]=b;n[1]=a;n[2]=c;n[3]=d;n[4]=e;n[5]=f;n[6]=g;n[7]=k;n[8]=l;n[9]=m;return Z.c?Z.c(this,n,0):Z.call(null,this,n,0)};h.ha=function(b,a,c,d,e,f,g,k,l,m,n){var p=je(11);p[0]=b;p[1]=a;p[2]=c;p[3]=d;p[4]=e;p[5]=f;p[6]=g;p[7]=k;p[8]=l;p[9]=m;p[10]=n;return Z.c?Z.c(this,p,0):Z.call(null,this,p,0)};
h.ia=function(b,a,c,d,e,f,g,k,l,m,n,p){var q=je(12);q[0]=b;q[1]=a;q[2]=c;q[3]=d;q[4]=e;q[5]=f;q[6]=g;q[7]=k;q[8]=l;q[9]=m;q[10]=n;q[11]=p;return Z.c?Z.c(this,q,0):Z.call(null,this,q,0)};h.ja=function(b,a,c,d,e,f,g,k,l,m,n,p,q){var r=je(13);r[0]=b;r[1]=a;r[2]=c;r[3]=d;r[4]=e;r[5]=f;r[6]=g;r[7]=k;r[8]=l;r[9]=m;r[10]=n;r[11]=p;r[12]=q;return Z.c?Z.c(this,r,0):Z.call(null,this,r,0)};
h.ka=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r){var t=je(14);t[0]=b;t[1]=a;t[2]=c;t[3]=d;t[4]=e;t[5]=f;t[6]=g;t[7]=k;t[8]=l;t[9]=m;t[10]=n;t[11]=p;t[12]=q;t[13]=r;return Z.c?Z.c(this,t,0):Z.call(null,this,t,0)};h.la=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t){var w=je(15);w[0]=b;w[1]=a;w[2]=c;w[3]=d;w[4]=e;w[5]=f;w[6]=g;w[7]=k;w[8]=l;w[9]=m;w[10]=n;w[11]=p;w[12]=q;w[13]=r;w[14]=t;return Z.c?Z.c(this,w,0):Z.call(null,this,w,0)};
h.ma=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w){var z=je(16);z[0]=b;z[1]=a;z[2]=c;z[3]=d;z[4]=e;z[5]=f;z[6]=g;z[7]=k;z[8]=l;z[9]=m;z[10]=n;z[11]=p;z[12]=q;z[13]=r;z[14]=t;z[15]=w;return Z.c?Z.c(this,z,0):Z.call(null,this,z,0)};h.na=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z){var C=je(17);C[0]=b;C[1]=a;C[2]=c;C[3]=d;C[4]=e;C[5]=f;C[6]=g;C[7]=k;C[8]=l;C[9]=m;C[10]=n;C[11]=p;C[12]=q;C[13]=r;C[14]=t;C[15]=w;C[16]=z;return Z.c?Z.c(this,C,0):Z.call(null,this,C,0)};
h.oa=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C){var E=je(18);E[0]=b;E[1]=a;E[2]=c;E[3]=d;E[4]=e;E[5]=f;E[6]=g;E[7]=k;E[8]=l;E[9]=m;E[10]=n;E[11]=p;E[12]=q;E[13]=r;E[14]=t;E[15]=w;E[16]=z;E[17]=C;return Z.c?Z.c(this,E,0):Z.call(null,this,E,0)};h.pa=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E){var K=je(19);K[0]=b;K[1]=a;K[2]=c;K[3]=d;K[4]=e;K[5]=f;K[6]=g;K[7]=k;K[8]=l;K[9]=m;K[10]=n;K[11]=p;K[12]=q;K[13]=r;K[14]=t;K[15]=w;K[16]=z;K[17]=C;K[18]=E;return Z.c?Z.c(this,K,0):Z.call(null,this,K,0)};
h.qa=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,K){var M=je(20);M[0]=b;M[1]=a;M[2]=c;M[3]=d;M[4]=e;M[5]=f;M[6]=g;M[7]=k;M[8]=l;M[9]=m;M[10]=n;M[11]=p;M[12]=q;M[13]=r;M[14]=t;M[15]=w;M[16]=z;M[17]=C;M[18]=E;M[19]=K;return Z.c?Z.c(this,M,0):Z.call(null,this,M,0)};h.Kb=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,K,M){b=je(me.a(new U(null,20,5,W,[b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,K],null),M));return Z.c?Z.c(this,b,0):Z.call(null,this,b,0)};h.O=function(){return this.S};
h.X=function(){return 2+P(this.F)};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Ud(this)};h.C=function(b,a){var c;c=x(a)?(c=this.constructor===a.constructor)?Cf(this,a):c:a;return x(c)?!0:!1};h.ib=function(b,a){return Bd(new rg(null,new v(null,2,[vi,null,qj,null],null),null),a)?kd.a(Lc(Xe.a(ve,this),this.S),a):new qk(this.va,this.rb,this.S,qe(kd.a(this.F,a)),null)};
h.Oa=function(b,a,c){return x(T.a?T.a(qj,a):T.call(null,qj,a))?new qk(c,this.rb,this.S,this.F,null):x(T.a?T.a(vi,a):T.call(null,vi,a))?new qk(this.va,c,this.S,this.F,null):new qk(this.va,this.rb,this.S,id.c(this.F,a,c),null)};h.U=function(){return J(me.a(new U(null,2,5,W,[new U(null,2,5,W,[qj,this.va],null),new U(null,2,5,W,[vi,this.rb],null)],null),this.F))};h.P=function(b,a){return new qk(this.va,this.rb,a,this.F,this.u)};h.W=function(b,a){return sd(a)?lb(this,G.a(a,0),G.a(a,1)):Va.c(bb,this,a)};
function rk(b,a){return new qk(b,a,null,null,null)}function Z(b,a,c){return new ok(b.va,a,c,null,null,null)}function sk(b){return new v(null,2,[Ni,null!=b&&b.yb?function(a,b,d){return a.zb(null,b,d)}:ek,Ih,null!=b&&b.yb?function(a,b,d){return a.Ab(null,b,d)}:fk],null)}function tk(b){return new v(null,1,[Wi,null!=b&&b.Jc?function(a,b){return a.rc(0,b)}:hk],null)}
function uk(b){var a=function(a){return function(d,e,f,g,k){f=dd.a(f,a.a?a.a(b,g):a.call(null,b,g));return k.o?k.o(d,e,f,g):k.call(null,d,e,f,g)}}(Wi.b(tk(b)));return pk(nk(kk,a,a))}function vk(b){var a=sk(b),c=Ni.b(a),d=Ih.b(a);return pk(nk(lk,function(a,c){return function(a,d){return c.c?c.c(b,a,d):c.call(null,b,a,d)}}(a,c,d),function(a,c,d){return function(a,c){return d.c?d.c(b,a,c):d.call(null,b,a,c)}}(a,c,d)))}
var wk=function wk(a){if(null!=a&&null!=a.lb)return a.lb(a);var c=wk[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=wk._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("CoercePath.coerce-path",a);};wk["null"]=function(){return vk(null)};ok.prototype.lb=function(){return this};qk.prototype.lb=function(){return this};U.prototype.lb=function(){return ik(this)};xc.prototype.lb=function(){return wk(Ed(this))};Yd.prototype.lb=function(){return wk(Ed(this))};Xc.prototype.lb=function(){return wk(Ed(this))};
wk._=function(b){var a;a=(a=(a=fa(b))?a:null!=b?b.Pc?!0:b.ec?!1:Pa(Wa,b):Pa(Wa,b))?a:null!=b?b.yb?!0:b.ec?!1:Pa(dk,b):Pa(dk,b);if(x(a))b=vk(b);else if(null!=b?b.Jc||(b.ec?0:Pa(gk,b)):Pa(gk,b))b=uk(b);else throw a=I,b=[D("Protocol implementation cannot be found for object.\n        Extending Specter protocols should not be done inline in a deftype definition\n        because that prevents Specter from finding the protocol implementations for\n        optimized performance. Instead, you should extend the protocols via an\n        explicit extend-protocol call. \n"),
D(b)].join(""),b=a([b],0),Error(F.a(D,b));return b};function xk(b){return b.Ka.type}
function yk(b){var a=Q(b,0),c=Qd(b,1),d=a.Ka,e=d.type,f=mc.a(e,th)?function(a,b,c,d,e,f){return function(q,r){return function(a,b,c,d,e,f){return function(g,k,l,m,n){var p=function(){return function(a,b,c,d){return r.A?r.A(a,b,c,d,n):r.call(null,a,b,c,d,n)}}(g,k,l,m,a,b,c,d,e,f);return q.A?q.A(g,k,l,m,p):q.call(null,g,k,l,m,p)}}(a,b,c,d,e,f)}}(d,e,b,a,c,b):function(a,b,c,d,e,f){return function(q,r){return function(a,b,c,d,e,f){return function(g,k){var l=function(){return function(a){return r.a?r.a(a,
k):r.call(null,a,k)}}(g,a,b,c,d,e,f);return q.a?q.a(g,l):q.call(null,g,l)}}(a,b,c,d,e,f)}}(d,e,b,a,c,b);return Va.a(function(a,b,c){return function(b,d){return nk(a,function(){var a=b.La,e=d.La;return c.a?c.a(a,e):c.call(null,a,e)}(),function(){var a=b.Ma,e=d.Ma;return c.a?c.a(a,e):c.call(null,a,e)}())}}(d,e,f,b,a,c,b),b)}
function zk(b){if(mc.a(xk(b),th))return b;var a=b.La;b=b.Ma;return nk(kk,function(a,b){return function(e,f,g,k,l){var m=function(){return function(a){return l.o?l.o(e,f,g,a):l.call(null,e,f,g,a)}}(k,a,b);return a.a?a.a(k,m):a.call(null,k,m)}}(a,b),function(a,b){return function(e,f,g,k,l){var m=function(){return function(a){return l.o?l.o(e,f,g,a):l.call(null,e,f,g,a)}}(k,a,b);return b.a?b.a(k,m):b.call(null,k,m)}}(a,b))}
function Ak(b){if(b instanceof ok){var a=ci.b(b),c=Ai.b(b),d=qh.b(qj.b(b)),e=wh.b(qj.b(b));return nd(a)?b:pk(nk(kk,function(a,b,c,d){return function(e,n,p,q,r){var t=function(){return function(a,b,c,d){return r.o?r.o(e,n,c,d):r.call(null,e,n,c,d)}}(a,b,p,q,a,b,c,d);return c.A?c.A(a,b,p,q,t):c.call(null,a,b,p,q,t)}}(a,c,d,e),function(a,b,c,d){return function(e,n,p,q,r){var t=function(){return function(a,b,c,d){return r.o?r.o(e,n,c,d):r.call(null,e,n,c,d)}}(a,b,p,q,a,b,c,d);return d.A?d.A(a,b,p,q,t):
d.call(null,a,b,p,q,t)}}(a,c,d,e)))}return b}ik["null"]=function(b){return wk(b)};ik._=function(b){return wk(b)};U.prototype.Gc=function(){if(nd(this))return wk(null);var b=S.a(Ak,S.a(wk,this)),a=S.a(yk,zg(xk,S.a(qj,b))),c=mc.a(1,P(a))?L(a):yk(S.a(zk,a)),b=Ve(function(){return function(a){return a instanceof qk}}(b,a,c,this),b);return nd(b)?pk(c):rk(zk(c),Va.a(Hd,S.a(vi,b)))};function Bk(b){return b instanceof ok?0:vi.b(b)}
var Ck=function Ck(a,c){if(null!=a&&null!=a.Hc)return a.Hc(0,c);var d=Ck[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=Ck._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("SetExtremes.set-first",a);},Dk=function Dk(a,c){if(null!=a&&null!=a.Ic)return a.Ic(0,c);var d=Dk[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=Dk._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("SetExtremes.set-last",a);};
U.prototype.Hc=function(b,a){return id.c(this,0,a)};U.prototype.Ic=function(b,a){return id.c(this,P(this)-1,a)};Ck._=function(b,a){return Vc(a,yc(b))};Dk._=function(b,a){var c=tg(b);return dd.a(Ed(c),a)};function Ek(b,a){var c=b.va;return c.Ka.sd.call(null,b.Xa,b.Ya,c.La,a)}function Fk(b,a,c){var d=b.va;return d.Ka.ud.call(null,b.Xa,b.Ya,d.Ma,a,c)}function Gk(){}Gk.prototype.yb=!0;Gk.prototype.zb=function(b,a,c){return Xe.a(ed,bk(c,a))};
Gk.prototype.Ab=function(b,a,c){b=null==a?null:$a(a);return Xd(b)?Dg(S.a(c,a)):Xe.a(b,ak(c,a))};function Hk(){}Hk.prototype.Jc=!0;Hk.prototype.rc=function(b,a){return a};function Ik(b,a){this.Lc=b;this.td=a}Ik.prototype.yb=!0;Ik.prototype.zb=function(b,a,c){if(nd(a))return null;b=this.Lc.call(null,a);return c.b?c.b(b):c.call(null,b)};Ik.prototype.Ab=function(b,a,c){var d=this;return nd(a)?a:d.td.call(null,a,function(){var b=d.Lc.call(null,a);return c.b?c.b(b):c.call(null,b)}())};
function Jk(b,a,c,d){b=vf.c(Ed(b),a,c);return d.b?d.b(b):d.call(null,b)}function Kk(b,a,c,d){var e=Ed(b),f=vf.c(e,a,c);d=d.b?d.b(f):d.call(null,f);a=me.j(vf.c(e,0,a),d,I([vf.c(e,c,P(b))],0));return sd(b)?Ed(a):a}dk["null"]=!0;ek["null"]=function(b,a,c){return c.b?c.b(a):c.call(null,a)};fk["null"]=function(b,a,c){return c.b?c.b(a):c.call(null,a)};function Lk(b,a,c){return x(b.b?b.b(a):b.call(null,a))?c.b?c.b(a):c.call(null,a):null}
function Mk(b,a,c){return x(b.b?b.b(a):b.call(null,a))?c.b?c.b(a):c.call(null,a):a};function Nk(b){return ik(Ed(b))}function Ok(b,a){var c=ik(b);return Ek.a?Ek.a(c,a):Ek.call(null,c,a)}function Pk(b,a,c){b=ik(b);return Fk.c?Fk.c(b,a,c):Fk.call(null,b,a,c)}var Qk=Nk(I([new Gk],0)),Rk=new Hk;Nk(I([new Ik(cd,Dk)],0));Nk(I([new Ik(L,Ck)],0));
var Sk=rk(nk(kk,function(b,a,c,d,e){var f=b[a+0],g=b[a+1];return Jk(d,f.b?f.b(d):f.call(null,d),g.b?g.b(d):g.call(null,d),function(d){var f=a+2;return e.o?e.o(b,f,c,d):e.call(null,b,f,c,d)})},function(b,a,c,d,e){var f=b[a+0],g=b[a+1];return Kk(d,f.b?f.b(d):f.call(null,d),g.b?g.b(d):g.call(null,d),function(d){var f=a+2;return e.o?e.o(b,f,c,d):e.call(null,b,f,c,d)})}),2),Tk=rk(nk(kk,function(b,a,c,d,e){return Jk(d,b[a+0],b[a+1],function(d){var g=a+2;return e.o?e.o(b,g,c,d):e.call(null,b,g,c,d)})},function(b,
a,c,d,e){return Kk(d,b[a+0],b[a+1],function(d){var g=a+2;return e.o?e.o(b,g,c,d):e.call(null,b,g,c,d)})}),2);Tk.a?Tk.a(0,0):Tk.call(null,0,0);Sk.a?Sk.a(P,P):Sk.call(null,P,P);y.prototype.yb=!0;y.prototype.zb=function(b,a,c){b=H.a(a,this);return c.b?c.b(b):c.call(null,b)};y.prototype.Ab=function(b,a,c){var d=this;return id.c(a,d,function(){var b=H.a(a,d);return c.b?c.b(b):c.call(null,b)}())};dk["function"]=!0;ek["function"]=function(b,a,c){return Lk(b,a,c)};
fk["function"]=function(b,a,c){return Mk(b,a,c)};rg.prototype.yb=!0;rg.prototype.zb=function(b,a,c){return Lk(this,a,c)};rg.prototype.Ab=function(b,a,c){return Mk(this,a,c)};var Uk=rk(nk(kk,function(b,a,c,d,e){var f=b[a+0];d=x(d)?d:f;a+=1;return e.o?e.o(b,a,c,d):e.call(null,b,a,c,d)},function(b,a,c,d,e){var f=b[a+0];d=x(d)?d:f;a+=1;return e.o?e.o(b,a,c,d):e.call(null,b,a,c,d)}),1);Uk.b?Uk.b(sg):Uk.call(null,sg);var Vk=zc;Uk.b?Uk.b(Vk):Uk.call(null,Vk);Uk.b?Uk.b(ed):Uk.call(null,ed);
function Wk(){var b=I([Ej],0),a=S.a(ik,new U(null,1,5,W,[b],null)),c=S.a(Bk,a),d=Vc(0,Ag(c)),e=cd(d),f=S.c(function(a,b,c,d){return function(e,f){return x(f instanceof ok)?function(){return function(){return f}}(a,b,c,d):function(){return function(a,b){return Z(f,a,b+e)}}(a,b,c,d)}}(a,c,d,e),d,a),g=Q(f,0),b=function(){var b=function(a,b,c,d,e,f,g){return function(a,b,c,e,f){var k;k=g.a?g.a(a,b):g.call(null,a,b);var l=Ek.a?Ek.a(k,e):Ek.call(null,k,e);if(1<P(l))throw a=I(["More than one element found for params: ",
k,e],0),Error(F.a(D,a));k=L(l);b+=d;c=dd.a(c,k);return f.o?f.o(a,b,c,e):f.call(null,a,b,c,e)}}(a,c,d,e,f,f,g);return rk(nk(kk,b,b),e)}();return mc.a(0,e)?Z(b,null,0):b};var Xk=new v(null,3,[Yh,2,Ah,4,dj,1],null),Yk=new v(null,3,[Yh,-1,Ah,0,dj,0],null),Zk=new v(null,3,[Yh,40,Ah,40,dj,0],null);function $k(b,a){var c=S.a(Be.a(Xk,gi),a),d=b/Va.a(Hd,c);return S.a(Ce(Id,d),c)}function al(b,a,c){return dd.a(a,function(){var d=null==a?null:sb(a);return b.a?b.a(d,c):b.call(null,d,c)}())}function bl(b,a){var c=null!=b&&(b.g&64||b.G)?F.a(Jc,b):b,c=H.a(c,gi),c=a-(Zk.b?Zk.b(c):Zk.call(null,c));return c-Nd(c,20)}
function cl(b,a){var c=null!=b&&(b.g&64||b.G)?F.a(Jc,b):b,d=H.a(c,Xh),e=H.a(c,Hj),f=$k(e,a);return S.j(function(a,b,c,d){return function(a,b,c,e){a=null!=a&&(a.g&64||a.G)?F.a(Jc,a):a;c=H.a(a,gi);b=new v(null,5,[kh,b+(Yk.b?Yk.b(c):Yk.call(null,c)),Xh,d,$i,e,Ch,e,$h,-30],null);return og.j(I([a,b],0))}}(f,b,c,d,e),a,Va.c(Ce(al,Hd),new U(null,1,5,W,[0],null),f),f,I([S.c(bl,a,f)],0))}
function dl(b,a){var c=null!=b&&(b.g&64||b.G)?F.a(Jc,b):b,d=H.a(c,Xh),e=H.a(c,Hj),f=H.a(c,nj),g=P(a),k=d/g;return S.c(function(a,b,c,d,e,f){return function(a,c){var d=new v(null,3,[nj,a,Xh,b-30,Hj,f],null),d=null!=d&&(d.g&64||d.G)?F.a(Jc,d):d,e=H.a(d,Xh),g=H.a(d,Hj),k=null!=c&&(c.g&64||c.G)?F.a(Jc,c):c;H.a(k,Dh);return $e(og.j(I([k,d],0)),Dh,Ce(cl,new v(null,2,[Xh,e,Hj,g],null)))}}(g,k,b,c,d,e,f),Le(g,Qe(Ce(Hd,k),f)),a)};if("undefined"===typeof el)var el=function(){var b=X.b?X.b(ve):X.call(null,ve),a=X.b?X.b(ve):X.call(null,ve),c=X.b?X.b(ve):X.call(null,ve),d=X.b?X.b(ve):X.call(null,ve),e=H.c(ve,vj,Xg());return new hh(uc.a("pennygame.updates","capacity"),function(){return function(a,b){var c=null!=b&&(b.g&64||b.G)?F.a(Jc,b):b;return H.a(c,gi)}}(b,a,c,d,e),Oh,e,b,a,c,d)}();jh(el,ni,function(b){return b});
jh(el,xi,function(b){switch(b){case 1:return 2;case 2:return 4;case 3:return 6;case 4:return 4;case 5:return 5;case 6:return 6;default:throw Error([D("No matching clause: "),D(b)].join(""));}});jh(el,ji,function(b,a,c){b=null!=a&&(a.g&64||a.G)?F.a(Jc,a):a;b=H.a(b,ph);return Ze(Ed(c),new U(null,2,5,W,[b,Eh],null))});function fl(b,a){return Pk(new U(null,4,5,W,[Rh,Qk,Dh,Qk],null),a,b)}function gl(b,a){return Ed(S.c(function(a,b){return id.c(a,Sh,b)},b,a))}
function hl(b,a){return Pk(new U(null,6,5,W,[Rh,Qk,Dh,Rk,Qk,function(a){return Bd(a,vh)}],null),function(b,d){var e=null!=d&&(d.g&64||d.G)?F.a(Jc,d):d,f=H.a(e,vh),g=H.a(e,Fj);H.a(e,Dj);f=Ze(a,new U(null,2,5,W,[f,Sh],null));g=el.c?el.c(f,g,b):el.call(null,f,g,b);return id.c(e,Eh,g)},b)}
function il(b,a){return Pk(new U(null,7,5,W,[Rh,Qk,Dh,Rk,Qk,function(a){return Bd(a,vh)},function(a){return mc.a(ji,Ze(a,new U(null,2,5,W,[Fj,gi],null)))}],null),function(b,d){var e=null!=d&&(d.g&64||d.G)?F.a(Jc,d):d,f=H.a(e,vh),g=H.a(e,Fj);H.a(e,Dj);f=Ze(a,new U(null,2,5,W,[f,Sh],null));g=el.c?el.c(f,g,b):el.call(null,f,g,b);return id.c(e,Eh,g)},b)}function jl(b){var a=b.b?b.b(df):b.call(null,df);return il(hl(b,a),a)}
if("undefined"===typeof kl){var kl,ll=X.b?X.b(ve):X.call(null,ve),ml=X.b?X.b(ve):X.call(null,ve),nl=X.b?X.b(ve):X.call(null,ve),ol=X.b?X.b(ve):X.call(null,ve),pl=H.c(ve,vj,Xg());kl=new hh(uc.a("pennygame.updates","process"),gi,Oh,pl,ll,ml,nl,ol)}jh(kl,Oh,function(b){b=null!=b&&(b.g&64||b.G)?F.a(Jc,b):b;var a=H.a(b,Eh),c=H.a(b,Dj);return id.j(b,Dj,Me(a,c),I([mj,Le(a,c)],0))});jh(kl,Yh,function(b){b=null!=b&&(b.g&64||b.G)?F.a(Jc,b):b;var a=H.a(b,Eh);return id.c(b,mj,yg(a))});
function ql(b){return Pk(new U(null,5,5,W,[Rh,Qk,Dh,Qk,function(a){return H.a(a,Eh)}],null),kl,b)}function rl(b){return mc.a(Ah,gi.b(b))}function sl(b){var a=F.c(Md,16.5,S.a(function(a){var b=null!=a&&(a.g&64||a.G)?F.a(Jc,a):a;a=H.a(b,aj);var e=H.a(b,Ej),b=H.a(b,Dj);return a/(P(e)+P(b))},Ok(new U(null,5,5,W,[Rh,Qk,Dh,Qk,rl],null),b)));return Pk(new U(null,5,5,W,[Rh,Qk,Dh,Qk,rl],null),function(a){return function(b){return bf(b,mh,Md,a)}}(a),b)}
function tl(b){return Pk(new U(null,6,5,W,[Rh,Qk,Dh,Rk,Qk,function(a){return Bd(a,nh)}],null),function(a,b){var d=null!=b&&(b.g&64||b.G)?F.a(Jc,b):b,e=H.a(d,nh);return id.c(d,Ej,Ze(Ed(a),new U(null,2,5,W,[e,mj],null)))},b)}function ul(b){return Pk(new U(null,6,5,W,[Rh,Qk,Dh,Qk,Wk(),Dj],null),function(a,b){return me.a(b,a)},b)}
function vl(b,a){var c=null!=b&&(b.g&64||b.G)?F.a(Jc,b):b,c=H.a(c,Dh),d=null!=a&&(a.g&64||a.G)?F.a(Jc,a):a,e=H.a(d,Vi),f=H.c(d,Mh,new U(null,2,5,W,[0,0],null)),d=H.a(d,ei),g=P(mj.b(L(c))),k=F.c(S,Hd,S.a(Cg(Be.a(P,mj),Eh),Ok(new U(null,2,5,W,[Qk,rl],null),c))),l=P(mj.b(cd(tg(c))));return new v(null,7,[pj,g,oi,Va.a(Hd,S.a(P,Ok(new U(null,3,5,W,[Qk,rl,Dj],null),c))),Qh,k,li,l,Vi,e+g,Mh,S.c(Hd,f,k),ei,d+l],null)}
function wl(b){return Pk(new U(null,4,5,W,[Rh,Qk,Rk,Bh],null),function(a,b){return dd.a(b,vl(a,null==b?null:sb(b)))},b)};var xl,yl=function yl(a,c){if(null!=a&&null!=a.pc)return a.pc(0,c);var d=yl[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=yl._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("ReadPort.take!",a);},zl=function zl(a,c,d){if(null!=a&&null!=a.dc)return a.dc(0,c,d);var e=zl[u(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=zl._;if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw B("WritePort.put!",a);},Al=function Al(a){if(null!=a&&null!=a.cc)return a.cc();
var c=Al[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Al._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("Channel.close!",a);},Bl=function Bl(a){if(null!=a&&null!=a.Ec)return!0;var c=Bl[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Bl._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("Handler.active?",a);},Cl=function Cl(a){if(null!=a&&null!=a.Fc)return a.Fa;var c=Cl[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Cl._;if(null!=c)return c.b?
c.b(a):c.call(null,a);throw B("Handler.commit",a);},Dl=function Dl(a,c){if(null!=a&&null!=a.Dc)return a.Dc(0,c);var d=Dl[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=Dl._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("Buffer.add!*",a);},El=function El(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return El.b(arguments[0]);case 2:return El.a(arguments[0],arguments[1]);default:throw Error([D("Invalid arity: "),
D(c.length)].join(""));}};El.b=function(b){return b};El.a=function(b,a){return Dl(b,a)};El.w=2;var Fl,Gl=function Gl(a){"undefined"===typeof Fl&&(Fl=function(a,d,e){this.sc=a;this.Fa=d;this.ld=e;this.g=393216;this.B=0},Fl.prototype.P=function(a,d){return new Fl(this.sc,this.Fa,d)},Fl.prototype.O=function(){return this.ld},Fl.prototype.Ec=function(){return!0},Fl.prototype.Fc=function(){return this.Fa},Fl.ic=function(){return new U(null,3,5,W,[Lc(wj,new v(null,2,[Fh,!0,te,kc(ue,kc(new U(null,1,5,W,[Oj],null)))],null)),Oj,Nh],null)},Fl.xb=!0,Fl.eb="cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers22073",
Fl.Tb=function(a,d){return Kb(d,"cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers22073")});return new Fl(Gl,a,ve)};function Hl(b){try{return b[0].call(null,b)}catch(a){throw a instanceof Object&&b[6].cc(),a;}}function Il(b,a,c){c=c.pc(0,Gl(function(c){b[2]=c;b[1]=a;return Hl(b)}));return x(c)?(b[2]=O.b?O.b(c):O.call(null,c),b[1]=a,Y):null}function Jl(b,a,c,d){c=c.dc(0,d,Gl(function(c){b[2]=c;b[1]=a;return Hl(b)}));return x(c)?(b[2]=O.b?O.b(c):O.call(null,c),b[1]=a,Y):null}
function Kl(b,a){var c=b[6];null!=a&&c.dc(0,a,Gl(function(){return function(){return null}}(c)));c.cc();return c}function Ll(b,a,c,d,e,f,g,k){this.Sa=b;this.Ta=a;this.Va=c;this.Ua=d;this.Za=e;this.S=f;this.F=g;this.u=k;this.g=2229667594;this.B=8192}h=Ll.prototype;h.N=function(b,a){return jb.c(this,a,null)};
h.I=function(b,a,c){switch(a instanceof y?a.Ha:null){case "catch-block":return this.Sa;case "catch-exception":return this.Ta;case "finally-block":return this.Va;case "continue-block":return this.Ua;case "prev":return this.Za;default:return H.c(this.F,a,c)}};
h.M=function(b,a,c){return sf(a,function(){return function(b){return sf(a,tf,""," ","",c,b)}}(this),"#cljs.core.async.impl.ioc-helpers.ExceptionFrame{",", ","}",c,me.a(new U(null,5,5,W,[new U(null,2,5,W,[hi,this.Sa],null),new U(null,2,5,W,[Ui,this.Ta],null),new U(null,2,5,W,[Ph,this.Va],null),new U(null,2,5,W,[bj,this.Ua],null),new U(null,2,5,W,[Yi,this.Za],null)],null),this.F))};h.Ga=function(){return new Df(0,this,5,new U(null,5,5,W,[hi,Ui,Ph,bj,Yi],null),cc(this.F))};h.O=function(){return this.S};
h.X=function(){return 5+P(this.F)};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Ud(this)};h.C=function(b,a){var c;c=x(a)?(c=this.constructor===a.constructor)?Cf(this,a):c:a;return x(c)?!0:!1};h.ib=function(b,a){return Bd(new rg(null,new v(null,5,[Ph,null,hi,null,Ui,null,Yi,null,bj,null],null),null),a)?kd.a(Lc(Xe.a(ve,this),this.S),a):new Ll(this.Sa,this.Ta,this.Va,this.Ua,this.Za,this.S,qe(kd.a(this.F,a)),null)};
h.Oa=function(b,a,c){return x(T.a?T.a(hi,a):T.call(null,hi,a))?new Ll(c,this.Ta,this.Va,this.Ua,this.Za,this.S,this.F,null):x(T.a?T.a(Ui,a):T.call(null,Ui,a))?new Ll(this.Sa,c,this.Va,this.Ua,this.Za,this.S,this.F,null):x(T.a?T.a(Ph,a):T.call(null,Ph,a))?new Ll(this.Sa,this.Ta,c,this.Ua,this.Za,this.S,this.F,null):x(T.a?T.a(bj,a):T.call(null,bj,a))?new Ll(this.Sa,this.Ta,this.Va,c,this.Za,this.S,this.F,null):x(T.a?T.a(Yi,a):T.call(null,Yi,a))?new Ll(this.Sa,this.Ta,this.Va,this.Ua,c,this.S,this.F,
null):new Ll(this.Sa,this.Ta,this.Va,this.Ua,this.Za,this.S,id.c(this.F,a,c),null)};h.U=function(){return J(me.a(new U(null,5,5,W,[new U(null,2,5,W,[hi,this.Sa],null),new U(null,2,5,W,[Ui,this.Ta],null),new U(null,2,5,W,[Ph,this.Va],null),new U(null,2,5,W,[bj,this.Ua],null),new U(null,2,5,W,[Yi,this.Za],null)],null),this.F))};h.P=function(b,a){return new Ll(this.Sa,this.Ta,this.Va,this.Ua,this.Za,a,this.F,this.u)};h.W=function(b,a){return sd(a)?lb(this,G.a(a,0),G.a(a,1)):Va.c(bb,this,a)};
function Ml(b){for(;;){var a=b[4],c=hi.b(a),d=Ui.b(a),e=b[5];if(x(function(){var b=e;return x(b)?Oa(a):b}()))throw e;if(x(function(){var a=e;return x(a)?(a=c,x(a)?e instanceof d:a):a}())){b[1]=c;b[2]=e;b[5]=null;b[4]=id.j(a,hi,null,I([Ui,null],0));break}if(x(function(){var b=e;return x(b)?Oa(c)&&Oa(Ph.b(a)):b}()))b[4]=Yi.b(a);else{if(x(function(){var b=e;return x(b)?(b=Oa(c))?Ph.b(a):b:b}())){b[1]=Ph.b(a);b[4]=id.c(a,Ph,null);break}if(x(function(){var b=Oa(e);return b?Ph.b(a):b}())){b[1]=Ph.b(a);
b[4]=id.c(a,Ph,null);break}if(Oa(e)&&Oa(Ph.b(a))){b[1]=bj.b(a);b[4]=Yi.b(a);break}throw Error("No matching clause");}}};function Nl(b,a,c,d,e){for(var f=0;;)if(f<e)c[d+f]=b[a+f],f+=1;else break}function Ol(b,a,c,d){this.head=b;this.R=a;this.length=c;this.f=d}Ol.prototype.pop=function(){if(0===this.length)return null;var b=this.f[this.R];this.f[this.R]=null;this.R=(this.R+1)%this.f.length;--this.length;return b};Ol.prototype.unshift=function(b){this.f[this.head]=b;this.head=(this.head+1)%this.f.length;this.length+=1;return null};function Pl(b,a){b.length+1===b.f.length&&b.resize();b.unshift(a)}
Ol.prototype.resize=function(){var b=Array(2*this.f.length);return this.R<this.head?(Nl(this.f,this.R,b,0,this.length),this.R=0,this.head=this.length,this.f=b):this.R>this.head?(Nl(this.f,this.R,b,0,this.f.length-this.R),Nl(this.f,0,b,this.f.length-this.R,this.head),this.R=0,this.head=this.length,this.f=b):this.R===this.head?(this.head=this.R=0,this.f=b):null};function Ql(b,a){for(var c=b.length,d=0;;)if(d<c){var e=b.pop();(a.b?a.b(e):a.call(null,e))&&b.unshift(e);d+=1}else break}
function Rl(b){return new Ol(0,0,0,Array(b))}function Sl(b,a){this.L=b;this.n=a;this.g=2;this.B=0}function Tl(b){return b.L.length===b.n}Sl.prototype.Dc=function(b,a){Pl(this.L,a);return this};Sl.prototype.X=function(){return this.L.length};var Ul;
function Vl(){var b=aa.MessageChannel;"undefined"===typeof b&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==Rj.indexOf("Presto")&&(b=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=qa(function(a){if(("*"==d||a.origin==
d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof b&&-1==Rj.indexOf("Trident")&&-1==Rj.indexOf("MSIE")){var a=new b,c={},d=c;a.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.vc;c.vc=null;a()}};return function(b){d.next={vc:b};d=d.next;a.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=
document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){aa.setTimeout(a,0)}};var Wl=Rl(32),Xl=!1,Yl=!1;Zl;function $l(){Xl=!0;Yl=!1;for(var b=0;;){var a=Wl.pop();if(null!=a&&(a.l?a.l():a.call(null),1024>b)){b+=1;continue}break}Xl=!1;return 0<Wl.length?Zl.l?Zl.l():Zl.call(null):null}function Zl(){var b=Yl;if(x(x(b)?Xl:b))return null;Yl=!0;!fa(aa.setImmediate)||aa.Window&&aa.Window.prototype&&aa.Window.prototype.setImmediate==aa.setImmediate?(Ul||(Ul=Vl()),Ul($l)):aa.setImmediate($l)}function am(b){Pl(Wl,b);Zl()}function bm(b,a){setTimeout(b,a)};var cm,dm=function dm(a){"undefined"===typeof cm&&(cm=function(a,d,e){this.Oc=a;this.H=d;this.md=e;this.g=425984;this.B=0},cm.prototype.P=function(a,d){return new cm(this.Oc,this.H,d)},cm.prototype.O=function(){return this.md},cm.prototype.Jb=function(){return this.H},cm.ic=function(){return new U(null,3,5,W,[Lc(Bi,new v(null,1,[te,kc(ue,kc(new U(null,1,5,W,[Li],null)))],null)),Li,Mj],null)},cm.xb=!0,cm.eb="cljs.core.async.impl.channels/t_cljs$core$async$impl$channels22136",cm.Tb=function(a,d){return Kb(d,
"cljs.core.async.impl.channels/t_cljs$core$async$impl$channels22136")});return new cm(dm,a,ve)};function em(b,a){this.Ub=b;this.H=a}function fm(b){return Bl(b.Ub)}var gm=function gm(a){if(null!=a&&null!=a.Cc)return a.Cc();var c=gm[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=gm._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("MMC.abort",a);};function hm(b,a,c,d,e,f,g){this.Gb=b;this.hc=a;this.sb=c;this.gc=d;this.L=e;this.closed=f;this.Ja=g}
hm.prototype.Cc=function(){for(;;){var b=this.sb.pop();if(null!=b){var a=b.Ub;am(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(a.Fa,a,b.H,b,this))}break}Ql(this.sb,Ae());return Al(this)};
hm.prototype.dc=function(b,a,c){var d=this;if(b=d.closed)return dm(!b);if(x(function(){var a=d.L;return x(a)?Oa(Tl(d.L)):a}())){for(c=Oc(d.Ja.a?d.Ja.a(d.L,a):d.Ja.call(null,d.L,a));;){if(0<d.Gb.length&&0<P(d.L)){var e=d.Gb.pop(),f=e.Fa,g=d.L.L.pop();am(function(a,b){return function(){return a.b?a.b(b):a.call(null,b)}}(f,g,e,c,b,this))}break}c&&gm(this);return dm(!0)}e=function(){for(;;){var a=d.Gb.pop();if(x(a)){if(x(!0))return a}else return null}}();if(x(e))return c=Cl(e),am(function(b){return function(){return b.b?
b.b(a):b.call(null,a)}}(c,e,b,this)),dm(!0);64<d.gc?(d.gc=0,Ql(d.sb,fm)):d.gc+=1;Pl(d.sb,new em(c,a));return null};
hm.prototype.pc=function(b,a){var c=this;if(null!=c.L&&0<P(c.L)){for(var d=a.Fa,e=dm(c.L.L.pop());;){if(!x(Tl(c.L))){var f=c.sb.pop();if(null!=f){var g=f.Ub,k=f.H;am(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(g.Fa,g,k,f,d,e,this));Oc(c.Ja.a?c.Ja.a(c.L,k):c.Ja.call(null,c.L,k))&&gm(this);continue}}break}return e}d=function(){for(;;){var a=c.sb.pop();if(x(a)){if(Bl(a.Ub))return a}else return null}}();if(x(d))return e=Cl(d.Ub),am(function(a){return function(){return a.b?a.b(!0):
a.call(null,!0)}}(e,d,this)),dm(d.H);if(x(c.closed))return x(c.L)&&(c.Ja.b?c.Ja.b(c.L):c.Ja.call(null,c.L)),x(x(!0)?a.Fa:!0)?(d=function(){var a=c.L;return x(a)?0<P(c.L):a}(),d=x(d)?c.L.L.pop():null,dm(d)):null;64<c.hc?(c.hc=0,Ql(c.Gb,Bl)):c.hc+=1;Pl(c.Gb,a);return null};
hm.prototype.cc=function(){var b=this;if(!b.closed)for(b.closed=!0,x(function(){var a=b.L;return x(a)?0===b.sb.length:a}())&&(b.Ja.b?b.Ja.b(b.L):b.Ja.call(null,b.L));;){var a=b.Gb.pop();if(null==a)break;else{var c=a.Fa,d=x(function(){var a=b.L;return x(a)?0<P(b.L):a}())?b.L.L.pop():null;am(function(a,b){return function(){return a.b?a.b(b):a.call(null,b)}}(c,d,a,this))}}return null};function im(b){console.log(b);return null}
function jm(b,a){var c=(x(null)?null:im).call(null,a);return null==c?b:El.a(b,c)}
function km(b){return new hm(Rl(32),0,Rl(32),0,b,!1,function(){return function(a){return function(){function b(c,d){try{return a.a?a.a(c,d):a.call(null,c,d)}catch(e){return jm(c,e)}}function d(b){try{return a.b?a.b(b):a.call(null,b)}catch(c){return jm(b,c)}}var e=null,e=function(a,e){switch(arguments.length){case 1:return d.call(this,a);case 2:return b.call(this,a,e)}throw Error("Invalid arity: "+arguments.length);};e.b=d;e.a=b;return e}()}(x(null)?null.b?null.b(El):null.call(null,El):El)}())};function lm(b,a,c){this.key=b;this.H=a;this.forward=c;this.g=2155872256;this.B=0}lm.prototype.U=function(){return bb(bb(zc,this.H),this.key)};lm.prototype.M=function(b,a,c){return sf(a,tf,"["," ","]",c,this)};function mm(b,a,c){c=Array(c+1);for(var d=0;;)if(d<c.length)c[d]=null,d+=1;else break;return new lm(b,a,c)}function nm(b,a,c,d){for(;;){if(0>c)return b;a:for(;;){var e=b.forward[c];if(x(e))if(e.key<a)b=e;else break a;else break a}null!=d&&(d[c]=b);--c}}
function om(b,a){this.ob=b;this.level=a;this.g=2155872256;this.B=0}om.prototype.put=function(b,a){var c=Array(15),d=nm(this.ob,b,this.level,c).forward[0];if(null!=d&&d.key===b)return d.H=a;a:for(d=0;;)if(.5>Math.random()&&15>d)d+=1;else break a;if(d>this.level){for(var e=this.level+1;;)if(e<=d+1)c[e]=this.ob,e+=1;else break;this.level=d}for(d=mm(b,a,Array(d));;)return 0<=this.level?(c=c[0].forward,d.forward[0]=c[0],c[0]=d):null};
om.prototype.remove=function(b){var a=Array(15),c=nm(this.ob,b,this.level,a).forward[0];if(null!=c&&c.key===b){for(b=0;;)if(b<=this.level){var d=a[b].forward;d[b]===c&&(d[b]=c.forward[b]);b+=1}else break;for(;;)if(0<this.level&&null==this.ob.forward[this.level])--this.level;else return null}else return null};function pm(b){for(var a=qm,c=a.ob,d=a.level;;){if(0>d)return c===a.ob?null:c;var e;a:for(e=c;;){e=e.forward[d];if(null==e){e=null;break a}if(e.key>=b)break a}null!=e?(--d,c=e):--d}}
om.prototype.U=function(){return function(b){return function c(d){return new ce(null,function(){return function(){return null==d?null:Vc(new U(null,2,5,W,[d.key,d.H],null),c(d.forward[0]))}}(b),null,null)}}(this)(this.ob.forward[0])};om.prototype.M=function(b,a,c){return sf(a,function(){return function(b){return sf(a,tf,""," ","",c,b)}}(this),"{",", ","}",c,this)};var qm=new om(mm(null,null,0),0);
function rm(b){var a=(new Date).valueOf()+b,c=pm(a),d=x(x(c)?c.key<a+10:c)?c.H:null;if(x(d))return d;var e=km(null);qm.put(a,e);bm(function(a,b,c){return function(){qm.remove(c);return Al(a)}}(e,d,a,c),b);return e};var sm=function sm(a){"undefined"===typeof xl&&(xl=function(a,d,e){this.sc=a;this.Fa=d;this.kd=e;this.g=393216;this.B=0},xl.prototype.P=function(a,d){return new xl(this.sc,this.Fa,d)},xl.prototype.O=function(){return this.kd},xl.prototype.Ec=function(){return!0},xl.prototype.Fc=function(){return this.Fa},xl.ic=function(){return new U(null,3,5,W,[Lc(wj,new v(null,2,[Fh,!0,te,kc(ue,kc(new U(null,1,5,W,[Oj],null)))],null)),Oj,di],null)},xl.xb=!0,xl.eb="cljs.core.async/t_cljs$core$async19305",xl.Tb=function(a,
d){return Kb(d,"cljs.core.async/t_cljs$core$async19305")});return new xl(sm,a,ve)};function tm(b){b=mc.a(b,0)?null:b;return km("number"===typeof b?new Sl(Rl(b),b):b)}function um(b,a){var c=yl(b,sm(a));if(x(c)){var d=O.b?O.b(c):O.call(null,c);x(!0)?a.b?a.b(d):a.call(null,d):am(function(b){return function(){return a.b?a.b(b):a.call(null,b)}}(d,c))}return null}var vm=sm(function(){return null});function wm(b,a){var c=zl(b,a,vm);return x(c)?O.b?O.b(c):O.call(null,c):!0}
function xm(b){var a=Ed(new U(null,1,5,W,[ym],null)),c=tm(null),d=P(a),e=je(d),f=tm(1),g=X.b?X.b(null):X.call(null,null),k=Ye(function(a,b,c,d,e,f){return function(g){return function(a,b,c,d,e,f){return function(a){d[g]=a;return 0===Je.a(f,Kd)?wm(e,d.slice(0)):null}}(a,b,c,d,e,f)}}(a,c,d,e,f,g),yg(d)),l=tm(1);am(function(a,c,d,e,f,g,k,l){return function(){var C=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!T(e,Y)){d=e;break a}}}catch(f){if(f instanceof
Object)c[5]=f,Ml(c),d=Y;else throw f;}if(!T(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(a,c,d,e,f,g,k,l){return function(a){var f=a[1];if(7===f)return a[2]=null,a[1]=8,Y;if(1===f)return a[2]=null,a[1]=2,Y;if(4===f){var m=a[7],
f=m<e;a[1]=x(f)?6:7;return Y}return 15===f?(f=a[2],a[2]=f,a[1]=3,Y):13===f?(f=Al(d),a[2]=f,a[1]=15,Y):6===f?(a[2]=null,a[1]=11,Y):3===f?(f=a[2],Kl(a,f)):12===f?(f=a[8],f=a[2],m=ye(Ma,f),a[8]=f,a[1]=x(m)?13:14,Y):2===f?(f=Ie.a?Ie.a(k,e):Ie.call(null,k,e),a[9]=f,a[7]=0,a[2]=null,a[1]=4,Y):11===f?(m=a[7],a[4]=new Ll(10,Object,null,9,a[4],null,null,null),f=c.b?c.b(m):c.call(null,m),m=l.b?l.b(m):l.call(null,m),f=um(f,m),a[2]=f,Ml(a),Y):9===f?(m=a[7],a[10]=a[2],a[7]=m+1,a[2]=null,a[1]=4,Y):5===f?(a[11]=
a[2],Il(a,12,g)):14===f?(f=a[8],f=F.a(b,f),Jl(a,16,d,f)):16===f?(a[12]=a[2],a[2]=null,a[1]=2,Y):10===f?(m=a[2],f=Je.a(k,Kd),a[13]=m,a[2]=f,Ml(a),Y):8===f?(f=a[2],a[2]=f,a[1]=5,Y):null}}(a,c,d,e,f,g,k,l),a,c,d,e,f,g,k,l)}(),E=function(){var b=C.l?C.l():C.call(null);b[6]=a;return b}();return Hl(E)}}(l,a,c,d,e,f,g,k));return c};var zm=VDOM.diff,Am=VDOM.patch,Bm=VDOM.create;function Cm(b){return Ve(ze(Ma),Ve(ze(zd),We(b)))}function Dm(b,a,c){return new VDOM.VHtml(Rd(b),Ug(a),Ug(c))}function Em(b,a,c){return new VDOM.VSvg(Rd(b),Ug(a),Ug(c))}Fm;
var Gm=function Gm(a){if(null==a)return new VDOM.VText("");if(zd(a))return Dm(zi,ve,S.a(Gm,Cm(a)));if("string"===typeof a||"number"===typeof a)return new VDOM.VText(a);if(mc.a(Zi,L(a)))return Fm.b?Fm.b(a):Fm.call(null,a);var c=Q(a,0),d=Q(a,1);a=Qd(a,2);return Dm(c,d,S.a(Gm,Cm(a)))},Fm=function Fm(a){if(null==a)return new VDOM.VText("");if("string"===typeof a||"number"===typeof a)return new VDOM.VText(a);if(mc.a(Kj,L(a))){var c=Q(a,0),d=Q(a,1);a=Qd(a,2);return Em(c,d,S.a(Gm,Cm(a)))}c=Q(a,0);d=Q(a,
1);a=Qd(a,2);return Em(c,d,S.a(Fm,Cm(a)))};
function Hm(){var b=document.body,a=function(){var a=new VDOM.VText("");return X.b?X.b(a):X.call(null,a)}(),c=function(){var b;b=O.b?O.b(a):O.call(null,a);b=Bm.b?Bm.b(b):Bm.call(null,b);return X.b?X.b(b):X.call(null,b)}(),d=null==window.requestAnimationFrame?function(){return function(a){return a.l?a.l():a.call(null)}}(a,c):function(){return function(a){return window.requestAnimationFrame(a)}}(a,c);b.appendChild(O.b?O.b(c):O.call(null,c));return function(a,b,c){return function(d){var l=Gm(d);d=function(){var b=
O.b?O.b(a):O.call(null,a);return zm.a?zm.a(b,l):zm.call(null,b,l)}();Ie.a?Ie.a(a,l):Ie.call(null,a,l);d=function(a,b,c,d){return function(){return Je.c(d,Am,b)}}(l,d,a,b,c);return c.b?c.b(d):c.call(null,d)}}(a,c,d)};var Im=Error();function Jm(b){if(x(mc.a?mc.a(0,b):mc.call(null,0,b)))return ed;if(x(mc.a?mc.a(1,b):mc.call(null,1,b)))return new U(null,1,5,W,[new U(null,2,5,W,[0,0],null)],null);if(x(mc.a?mc.a(2,b):mc.call(null,2,b)))return new U(null,2,5,W,[new U(null,2,5,W,[-1,-1],null),new U(null,2,5,W,[1,1],null)],null);if(x(mc.a?mc.a(3,b):mc.call(null,3,b)))return new U(null,3,5,W,[new U(null,2,5,W,[-1,-1],null),new U(null,2,5,W,[0,0],null),new U(null,2,5,W,[1,1],null)],null);if(x(mc.a?mc.a(4,b):mc.call(null,4,b)))return new U(null,
4,5,W,[new U(null,2,5,W,[-1,-1],null),new U(null,2,5,W,[-1,1],null),new U(null,2,5,W,[1,-1],null),new U(null,2,5,W,[1,1],null)],null);if(x(mc.a?mc.a(5,b):mc.call(null,5,b)))return new U(null,5,5,W,[new U(null,2,5,W,[-1,-1],null),new U(null,2,5,W,[-1,1],null),new U(null,2,5,W,[0,0],null),new U(null,2,5,W,[1,-1],null),new U(null,2,5,W,[1,1],null)],null);if(x(mc.a?mc.a(6,b):mc.call(null,6,b)))return new U(null,6,5,W,[new U(null,2,5,W,[-1,-1],null),new U(null,2,5,W,[-1,0],null),new U(null,2,5,W,[-1,1],
null),new U(null,2,5,W,[1,-1],null),new U(null,2,5,W,[1,0],null),new U(null,2,5,W,[1,1],null)],null);throw Error([D("No matching clause: "),D(b)].join(""));}var Km=Cg(function(b){return b.x},function(b){return b.y});
function Lm(b){var a=Q(b,0),c=Q(b,1),d=Math.ceil(Math.sqrt(4)),e=a/d,f=c/d;return function(a,b,c,d,e,f,q){return function t(w){return new ce(null,function(a,b,c,d,e,f,g){return function(){for(var k=w;;){var l=J(k);if(l){var m=l,n=L(m);if(l=J(function(a,b,c,d,e,f,g,k,l,m,n){return function Ka(p){return new ce(null,function(a,b,c,d,e,f,g,k){return function(){for(;;){var a=J(p);if(a){if(vd(a)){var c=Wb(a),d=P(c),e=ge(d);a:for(var l=0;;)if(l<d){var m=G.a(c,l),m=id.j(k,nj,m*f,I([kh,b*g],0));e.add(m);l+=
1}else{c=!0;break a}return c?he(e.$(),Ka(Xb(a))):he(e.$(),null)}e=L(a);return Vc(id.j(k,nj,e*f,I([kh,b*g],0)),Ka(yc(a)))}return null}}}(a,b,c,d,e,f,g,k,l,m,n),null,null)}}(k,n,m,l,a,b,c,d,e,f,g)(yg(a))))return me.a(l,t(yc(k)));k=yc(k)}else return null}}}(a,b,c,d,e,f,q),null,null)}}(d,e,f,new v(null,2,[Xh,e,Hj,f],null),b,a,c)(yg(d))}var Mm=Cg(Ce(F,Md),Ce(F,Ld));
function Nm(b,a){var c=Q(b,0),d=Q(b,1),e=Q(a,0),f=Q(a,1),g=mc.a(c,d)?new U(null,2,5,W,[0,1],null):new U(null,2,5,W,[c,d],null),k=Q(g,0),l=Q(g,1),m=(f-e)/(l-k);return function(a,b,c,d,e){return function(a){return d*a+e}}(g,k,l,m,f-m*l,b,c,d,a,e,f)};var Om=X.b?X.b(ve):X.call(null,ve);function Pm(b){return Je.o(Om,id,Pg("animation"),b)}
function Qm(){var b=1E3/30,a=tm(1);am(function(a,b){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!T(e,Y)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Ml(c),d=Y;else throw f;}if(!T(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(a,b){return function(a){var c=a[1];if(7===c)return c=a,c[2]=a[2],c[1]=4,Y;if(20===c){var c=a[7],d=a[8],e=L(d),d=Q(e,0),e=Q(e,1),c=e.b?e.b(c):e.call(null,c);a[9]=d;a[1]=x(c)?22:23;return Y}if(1===c)return c=rm(0),Il(a,2,c);if(24===c){var d=a[8],e=a[2],c=N(d),f;a[10]=0;a[11]=c;a[12]=0;a[13]=null;a[14]=e;a[2]=null;a[1]=8;return Y}if(4===c)return c=a[2],Kl(a,c);if(15===c){f=a[10];var c=a[11],
e=a[12],d=a[13],g=a[2];a[10]=f;a[15]=g;a[11]=c;a[12]=e+1;a[13]=d;a[2]=null;a[1]=8;return Y}return 21===c?(c=a[2],a[2]=c,a[1]=18,Y):13===c?(a[2]=null,a[1]=15,Y):22===c?(a[2]=null,a[1]=24,Y):6===c?(a[2]=null,a[1]=7,Y):25===c?(c=a[7],c+=b,a[16]=a[2],a[7]=c,a[2]=null,a[1]=3,Y):17===c?(a[2]=null,a[1]=18,Y):3===c?(c=O.b?O.b(Om):O.call(null,Om),c=J(c),a[1]=c?5:6,Y):12===c?(c=a[2],a[2]=c,a[1]=9,Y):2===c?(c=a[2],a[17]=c,a[7]=0,a[2]=null,a[1]=3,Y):23===c?(d=a[9],c=Je.c(Om,kd,d),a[2]=c,a[1]=24,Y):19===c?(d=
a[8],c=Wb(d),d=Xb(d),e=P(c),a[10]=e,a[11]=d,a[12]=0,a[13]=c,a[2]=null,a[1]=8,Y):11===c?(c=a[11],c=J(c),a[8]=c,a[1]=c?16:17,Y):9===c?(c=a[2],d=rm(b),a[18]=c,Il(a,25,d)):5===c?(c=O.b?O.b(Om):O.call(null,Om),c=J(c),a[10]=0,a[11]=c,a[12]=0,a[13]=null,a[2]=null,a[1]=8,Y):14===c?(d=a[19],c=Je.c(Om,kd,d),a[2]=c,a[1]=15,Y):16===c?(d=a[8],c=vd(d),a[1]=c?19:20,Y):10===c?(c=a[7],e=a[12],d=a[13],e=G.a(d,e),d=Q(e,0),e=Q(e,1),c=e.b?e.b(c):e.call(null,c),a[19]=d,a[1]=x(c)?13:14,Y):18===c?(c=a[2],a[2]=c,a[1]=12,
Y):8===c?(f=a[10],e=a[12],c=e<f,a[1]=x(c)?10:11,Y):null}}(a,b),a,b)}(),f=function(){var b=e.l?e.l():e.call(null);b[6]=a;return b}();return Hl(f)}}(a,b));return a}function Rm(b){return b*b}function Sm(b,a,c){var d=null!=c&&(c.g&64||c.G)?F.a(Jc,c):c,e=H.c(d,Bj,0),f=H.a(d,ii),g=H.c(d,fi,Fd);return function(c,d,e,f,g){return function(c){if(c<=e)return!0;if(c<e+f)return c=(c-e)/f,c=g.b?g.b(c):g.call(null,c),a.a?a.a(b,c):a.call(null,b,c),!0;a.a?a.a(b,1):a.call(null,b,1);return!1}}(c,d,e,f,g)}
function Tm(b){var a=new v(null,1,[ii,(O.b?O.b(Um):O.call(null,Um)).call(null,Hi)],null);return function(c){return Pm(Sm(c,b,a))}}
function Vm(b,a){return function(c){var d=S.a(Rd,Kf(b)),e=ug(d,S.a(function(a){return function(b){var c=Q(b,0),d=Q(b,1);return function(a,b,c){return function(b){return c+a*b}}(d-c,b,c,d,a)}}(d),Lf(b)));return Pm(Sm(c,function(a,b){return function(a,d){for(var e=J(J(b)),f=null,p=0,q=0;;)if(q<p){var r=f.ca(null,q),t=Q(r,0),r=Q(r,1);c.setAttribute(t,r.b?r.b(d):r.call(null,d));q+=1}else if(e=J(e))vd(e)?(f=Wb(e),e=Xb(e),t=f,p=P(f),f=t):(f=L(e),t=Q(f,0),r=Q(f,1),c.setAttribute(t,r.b?r.b(d):r.call(null,
d)),e=N(e),f=null,p=0),q=0;else return null}}(d,e),a))}}function Wm(b,a,c){var d=Q(a,0),e=Q(a,1);return function(a,d,e){return function(l){var m=b.getTotalLength(),n=Rd(d),p=Rd(e);return Pm(Sm(l,function(a,c,d){return function(e,f){var g,k=b.getPointAtLength(f*a);g=Km.b?Km.b(k):Km.call(null,k);k=Q(g,0);g=Q(g,1);l.setAttribute(c,k);l.setAttribute(d,g);return l}}(m,n,p,a,d,e),c))}}(a,d,e)};function Xm(){var b=Ym,a=Zm,c=$m,d=tm(null);wm(d,a);var e=tm(1);am(function(d,e){return function(){var k=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!T(e,Y)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Ml(c),d=Y;else throw f;}if(!T(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,
a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(d,e){return function(d){var f=d[1];if(1===f)return Il(d,2,c);if(2===f){var f=a,g=d[2];d[7]=f;d[8]=g;d[2]=null;d[1]=3;return Y}return 3===f?(f=d[9],f=d[7],g=d[8],f=b.a?b.a(f,g):b.call(null,f,g),g=wm(e,f),d[10]=g,d[9]=f,Il(d,5,c)):4===f?(f=d[2],Kl(d,f)):5===f?(f=d[9],g=d[2],d[7]=f,d[8]=g,d[2]=null,d[1]=3,Y):null}}(d,e),d,e)}(),l=function(){var a=k.l?k.l():k.call(null);a[6]=d;return a}();return Hl(l)}}(e,d));return d}
function an(){var b=bn,a=Hm(),c=tm(1);am(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!T(e,Y)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Ml(c),d=Y;else throw f;}if(!T(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.l=c;d.b=b;return d}()}(function(){return function(c){var d=c[1];return 1===d?(c[2]=null,c[1]=2,Y):2===d?Il(c,4,b):3===d?(d=c[2],Kl(c,d)):4===d?(d=c[7],d=c[2],c[7]=d,c[1]=x(d)?5:6,Y):5===d?(d=c[7],d=a.b?a.b(d):a.call(null,d),c[8]=d,c[2]=null,c[1]=2,Y):6===d?(c[2]=null,c[1]=7,Y):7===d?(d=c[2],c[2]=d,c[1]=3,Y):null}}(c),c)}(),f=function(){var a=e.l?e.l():e.call(null);a[6]=c;return a}();return Hl(f)}}(c));return c};var Um,cn=new v(null,3,[Aj,250,Hi,500,Wh,500],null);Um=X.b?X.b(cn):X.call(null,cn);function dn(b){for(var a=[],c=arguments.length,d=0;;)if(d<c)a.push(arguments[d]),d+=1;else break;return en(0<a.length?new xc(a.slice(0),0):null)}function en(b){return og.j(I([new v(null,2,[Sh,0,gi,Ah],null),F.a(Jc,b)],0))}function fn(b){return og.j(I([new v(null,8,[Pi,Pg("station"),gi,Ah,Ej,ed,Dj,ed,mj,ed,Eh,null,Fj,new v(null,1,[gi,ni],null),mh,999999],null),F.a(Jc,b)],0))}
function gn(b){for(var a=[],c=arguments.length,d=0;;)if(d<c)a.push(arguments[d]),d+=1;else break;return hn(0<a.length?new xc(a.slice(0),0):null)}function hn(b){return og.j(I([new v(null,1,[Bh,ed],null),F.a(Jc,b)],0))}
var jn=new U(null,5,5,W,[en(I([gi,Yh],0)),dn(),dn(),dn(),dn()],null),kn=hn(I([xh,Ri,Dh,new U(null,6,5,W,[fn(I([gi,Yh,vh,0],0)),fn(I([nh,0,vh,1],0)),fn(I([nh,1,vh,2],0)),fn(I([nh,2,vh,3],0)),fn(I([nh,3,vh,4],0)),fn(I([gi,dj,nh,4],0))],null)],0)),ln=hn(I([xh,Th,Dh,new U(null,6,5,W,[fn(I([gi,Yh,vh,0,Fj,new v(null,1,[gi,xi],null)],0)),fn(I([nh,0,vh,1,Fj,new v(null,1,[gi,xi],null)],0)),fn(I([nh,1,vh,2,Fj,new v(null,1,[gi,xi],null)],0)),fn(I([nh,2,vh,3],0)),fn(I([nh,3,vh,4,Fj,new v(null,1,[gi,xi],null)],
0)),fn(I([gi,dj,nh,4],0))],null)],0)),mn=hn(I([xh,Si,Dh,new U(null,6,5,W,[fn(I([gi,Yh,vh,0,Fj,new v(null,2,[gi,ji,ph,3],null)],0)),fn(I([nh,0,vh,1,Fj,new v(null,1,[gi,xi],null)],0)),fn(I([nh,1,vh,2,Fj,new v(null,1,[gi,xi],null)],0)),fn(I([nh,2,vh,3],0)),fn(I([nh,3,vh,4,Fj,new v(null,1,[gi,xi],null)],0)),fn(I([gi,dj,nh,4],0))],null)],0)),nn=new v(null,5,[ij,new v(null,3,[Aj,0,df,jn,Rh,new U(null,3,5,W,[kn,gn(),gn()],null)],null),Gh,new v(null,3,[Aj,0,df,jn,Rh,new U(null,3,5,W,[gn(),ln,gn()],null)],
null),ji,new v(null,3,[Aj,0,df,jn,Rh,new U(null,3,5,W,[gn(),gn(),mn],null)],null),Lh,new v(null,3,[Aj,0,df,jn,Rh,new U(null,3,5,W,[kn,ln,gn()],null)],null),mi,new v(null,3,[Aj,0,df,jn,Rh,new U(null,3,5,W,[kn,ln,mn],null)],null)],null);function on(b){this.Fa=b}on.prototype.hd=function(b){return this.Fa.b?this.Fa.b(b):this.Fa.call(null,b)};da("Hook",on);da("Hook.prototype.hook",on.prototype.hd);function pn(b){var a=Q(b,0);b=Q(b,1);return[D(a),D(","),D(b)].join("")}function qn(b,a,c){var d=Q(b,0);Q(b,1);b=Q(a,0);var e=Q(a,1);a=Q(c,0);c=Q(c,1);var d=d-b,f=(e-c)/2*(d/Math.abs(d)),g=f/2,d=new U(null,2,5,W,[b+f,e],null);b=new U(null,2,5,W,[b-g,e],null);e=new U(null,2,5,W,[a-g,c],null);a=new U(null,2,5,W,[a+f,c],null);return[D("L"),D(pn(d)),D("C"),D(pn(b)),D(","),D(pn(e)),D(","),D(pn(a))].join("")}function rn(b){return J(b)?F.c(D,"M",Se(S.a(pn,b))):null}
function sn(b,a){return[D("translate("),D(b),D(","),D(a),D(")")].join("")}
function tn(b){var a=null!=b&&(b.g&64||b.G)?F.a(Jc,b):b,c=H.a(a,Xh),d=H.a(a,Hj),e=H.a(a,nj),f=H.a(a,kh),g=H.a(a,Sh),k=c/2;return new U(null,4,5,W,[Ci,new v(null,1,[uh,sn(k,k)],null),new U(null,2,5,W,[zj,new v(null,5,[Qi,"die",nj,-k,kh,-k,Xh,c,Hj,c],null)],null),function(){return function(a,b,c,d,e,f,g,k,z){return function E(K){return new ce(null,function(a,b,c,d,e){return function(){for(;;){var b=J(K);if(b){if(vd(b)){var c=Wb(b),d=P(c),f=ge(d);a:for(var g=0;;)if(g<d){var k=G.a(c,g),l=Q(k,0),k=Q(k,
1),l=new U(null,2,5,W,[Vh,new v(null,3,[Oi,a.b?a.b(l):a.call(null,l),Ti,a.b?a.b(k):a.call(null,k),rh,e/10],null)],null);f.add(l);g+=1}else{c=!0;break a}return c?he(f.$(),E(Xb(b))):he(f.$(),null)}c=L(b);f=Q(c,0);c=Q(c,1);return Vc(new U(null,2,5,W,[Vh,new v(null,3,[Oi,a.b?a.b(f):a.call(null,f),Ti,a.b?a.b(c):a.call(null,c),rh,e/10],null)],null),E(yc(b)))}return null}}}(a,b,c,d,e,f,g,k,z),null,null)}}(Ce(Id,c/4),k,b,a,c,d,e,f,g)(Jm(g))}()],null)}
function un(b,a){for(var c=b-10,d=ed,e=!0,f=a-10;;)if(0<f)d=me.a(d,e?new U(null,2,5,W,[new U(null,2,5,W,[c,f],null),new U(null,2,5,W,[10,f],null)],null):new U(null,2,5,W,[new U(null,2,5,W,[10,f],null),new U(null,2,5,W,[c,f],null)],null)),e=!e,f-=20;else{c=W;a:for(e=Q(d,0),f=Qd(d,1),d=[D("M"),D(pn(e))].join(""),Q(f,0),Q(f,1),Qd(f,2);;){var g=f,k=Q(g,0),f=Q(g,1),g=Qd(g,2),l;l=k;x(l)&&(l=f,l=x(l)?J(g):l);if(x(l))d=[D(d),D(qn(e,k,f))].join(""),e=f,f=g;else{d=x(k)?[D(d),D("L"),D(pn(k))].join(""):d;break a}}return new U(null,
2,5,c,[lh,new v(null,2,[Qi,"penny-path",kj,d],null)],null)}}function vn(b,a,c){b=b.getPointAtLength(c*a+20);return Km.b?Km.b(b):Km.call(null,b)}function wn(b,a){var c=Q(b,0),d=Q(b,1);return new U(null,2,5,W,[Vh,new v(null,5,[Qi,"penny",Oi,c,Ti,d,rh,8,cj,x(a)?new on(a):null],null)],null)}
function xn(b,a,c){var d=null!=c&&(c.g&64||c.G)?F.a(Jc,c):c,e=H.a(d,Dj),f=H.a(d,Ij),g=H.a(d,zh),k=H.a(d,Ch);return bb(bb(zc,function(){var a=d.b?d.b(lh):d.call(null,lh);return x(a)?bb(bb(zc,Zd(Ee(function(a,b,c,d,e,f,g,k,l){return function(E){var K=function(a,b,c,d,e,f,g){return function(b){return vn(a,b,g)}}(a,b,c,d,e,f,g,k,l);return wn(K(E),0<k?Tm(function(a,b,c,d,e,f,g,k,l){return function(b,c){var d;d=E-c*l;d=-1>d?-1:d;var e=a(d),f=Q(e,0),e=Q(e,1);mc.a(-1,d)&&b.setAttribute("r",0);b.setAttribute("cx",
f);b.setAttribute("cy",e);return b}}(K,a,b,c,d,e,f,g,k,l)):null)}}(a,a,c,d,d,e,f,g,k),e))),Zd(Ee(function(){return function(a,b,c,d,e,f,g,k,l,E){return function(c){var d=vn(b,a+c,k),e=Q(d,0),d=Q(d,1);return wn(new U(null,2,5,W,[e,E],null),Vm(new v(null,1,[Ti,new U(null,2,5,W,[E,d],null)],null),new v(null,3,[ii,(O.b?O.b(Um):O.call(null,Um)).call(null,Wh),Bj,50*c,fi,Rm],null)))}}(P(e),a,a,c,d,d,e,f,g,k)}(),d.b?d.b(wi):d.call(null,wi)))):null}()),un(b,a))}
function yn(b,a){var c=a-20,d=W,e=sn(0,b),c=[D(rn(new U(null,6,5,W,[new U(null,2,5,W,[a,-20],null),new U(null,2,5,W,[a,23],null),new U(null,2,5,W,[0,23],null),new U(null,2,5,W,[0,3],null),new U(null,2,5,W,[c,3],null),new U(null,2,5,W,[c,-20],null)],null))),D("Z")].join("");return new U(null,2,5,d,[lh,new v(null,3,[Qi,"spout",uh,e,kj,c],null)],null)}
if("undefined"===typeof zn){var zn,An=X.b?X.b(ve):X.call(null,ve),Bn=X.b?X.b(ve):X.call(null,ve),Cn=X.b?X.b(ve):X.call(null,ve),Dn=X.b?X.b(ve):X.call(null,ve),En=H.c(ve,vj,Xg());zn=new hh(uc.a("pennygame.ui","station"),gi,Oh,En,An,Bn,Cn,Dn)}jh(zn,Yh,function(b){var a=null!=b&&(b.g&64||b.G)?F.a(Jc,b):b;b=H.a(a,Xh);H.a(a,$i);a=H.a(a,Ch);return yn(a,b)});
jh(zn,Ah,function(b){var a=null!=b&&(b.g&64||b.G)?F.a(Jc,b):b;b=H.a(a,Xh);var c=H.a(a,$i),a=bb(bb(bb(zc,yn(a.b?a.b(Ch):a.call(null,Ch),b)),xn(b,c,new v(null,6,[Dj,a.b?a.b(Dj):a.call(null,Dj),Ij,a.b?a.b(mh):a.call(null,mh),zh,x(a.b?a.b(ki):a.call(null,ki))?a.b?a.b(Eh):a.call(null,Eh):0,wi,x(a.b?a.b(lj):a.call(null,lj))?a.b?a.b(Ej):a.call(null,Ej):null,lh,Pj(a.b?a.b(Pi):a.call(null,Pi)),Ch,a.b?a.b($h):a.call(null,$h)],null))),new U(null,2,5,W,[zj,new v(null,3,[Qi,"bin",Xh,b,Hj,c],null)],null));a:for(var d=
ed,e=!0,c=c-20;;)if(0<c)d=dd.a(d,new U(null,2,5,W,[Ki,new v(null,4,[Qi,"shelf",uh,sn(0,c),oj,e?20:0,Cj,e?b:b-20],null)],null)),e=!e,c-=20;else{b=new U(null,3,5,W,[Ci,ve,F.a(kc,d)],null);break a}return bb(a,b)});
jh(zn,dj,function(b){var a=null!=b&&(b.g&64||b.G)?F.a(Jc,b):b,c=H.a(a,Xh),d=H.a(a,Pi),e=H.a(a,$i),f=H.a(a,$h);return bb(bb(bb(zc,new U(null,2,5,W,[jj,new v(null,3,[Xi,truckSrc,Xh,c,Hj,e],null)],null)),new U(null,2,5,W,[lh,new v(null,2,[Qi,"ramp",kj,[D("M"),D(pn(new U(null,2,5,W,[10,f],null))),D("C"),D(pn(new U(null,2,5,W,[10,e/2],null))),D(","),D(pn(new U(null,2,5,W,[10,e/2],null))),D(","),D(pn(new U(null,2,5,W,[c/2,e/2],null)))].join("")],null)],null)),function(){var g=Qj(d);return x(x(g)?a.b?a.b(lj):
a.call(null,lj):g)?Zd(Ee(function(a,b,c,d,e,f,g,t){return function(b){return wn(new U(null,2,5,W,[10,t],null),Wm(a,new U(null,2,5,W,[Oi,Ti],null),new v(null,3,[ii,(O.b?O.b(Um):O.call(null,Um)).call(null,Wh),Bj,50*b,fi,Rm],null)))}}(g,b,a,a,c,d,e,f),a.b?a.b(Ej):a.call(null,Ej))):null}())});
function Fn(b){var a=null!=b&&(b.g&64||b.G)?F.a(Jc,b):b,c=H.a(a,nj),d=H.a(a,xh),e=H.a(a,Dh);return x(x(c)?d:c)?new U(null,3,5,W,[Ci,new v(null,2,[Qi,[D("scenario "),D(Rd(d))].join(""),uh,sn(c,0)],null),function(){return function(a,b,c,d,e){return function p(q){return new ce(null,function(){return function(){for(;;){var a=J(q);if(a){if(vd(a)){var b=Wb(a),c=P(b),d=ge(c);a:for(var e=0;;)if(e<c){var f=G.a(b,e),g=null!=f&&(f.g&64||f.G)?F.a(Jc,f):f,f=g,k=H.a(g,Fj),k=null!=k&&(k.g&64||k.G)?F.a(Jc,k):k,k=
H.a(k,gi),l=H.a(g,Pi),g=H.a(g,kh),f=new U(null,3,5,W,[Ci,new v(null,3,[Pi,l,Qi,[D(Rd(k)),D(" productivity-"),D(Rd(k))].join(""),uh,sn(0,g)],null),zn.b?zn.b(f):zn.call(null,f)],null);d.add(f);e+=1}else{b=!0;break a}return b?he(d.$(),p(Xb(a))):he(d.$(),null)}d=L(a);d=b=null!=d&&(d.g&64||d.G)?F.a(Jc,d):d;c=H.a(b,Fj);c=null!=c&&(c.g&64||c.G)?F.a(Jc,c):c;c=H.a(c,gi);e=H.a(b,Pi);b=H.a(b,kh);return Vc(new U(null,3,5,W,[Ci,new v(null,3,[Pi,e,Qi,[D(Rd(c)),D(" productivity-"),D(Rd(c))].join(""),uh,sn(0,b)],
null),zn.b?zn.b(d):zn.call(null,d)],null),p(yc(a)))}return null}}}(a,b,c,d,e),null,null)}}(b,a,c,d,e)(Zd(e))}()],null):null}
function Gn(b,a,c){var d=null!=b&&(b.g&64||b.G)?F.a(Jc,b):b,e=H.a(d,Xh),f=H.a(d,Hj),g=H.a(d,nj),k=H.a(d,kh),l=null!=c&&(c.g&64||c.G)?F.a(Jc,c):c,m=H.a(l,ri),n=H.a(l,Gj),p=H.a(l,si);return new U(null,5,5,W,[Ci,new v(null,2,[Qi,"graph",uh,sn(g,k)],null),new U(null,2,5,W,[zj,new v(null,2,[Xh,e,Hj,f],null)],null),new U(null,3,5,W,[Lj,new v(null,4,[Qi,"title",nj,e/2,kh,f/2,bi,10],null),p],null),function(){var q=f-60;return new U(null,5,5,W,[Ci,new v(null,1,[uh,sn(30,30)],null),function(){var r=Dg(function(){return function(a,
b,c,d,e,f,g,k,l,m,n,p,q){return function pa(r){return new ce(null,function(a,b,c,d,e,f,g,k,l,m,n,p,q){return function(){for(var t=r;;){var w=J(t);if(w){var z=w;if(vd(z)){var A=Wb(z),C=P(A),E=ge(C);return function(){for(var r=0;;)if(r<C){var K=G.a(A,r),M=null!=K&&(K.g&64||K.G)?F.a(Jc,K):K,R=H.a(M,xh),ea=H.a(M,Bh);x(R)&&ie(E,new v(null,2,[xh,R,Nj,Ee(function(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,A,C,E,K,M){return function(a,b){return new U(null,2,5,W,[a,M.b?M.b(b):M.call(null,b)],null)}}(r,t,K,M,R,ea,A,
C,E,z,w,a,b,c,d,e,f,g,k,l,m,n,p,q),ea)],null));r+=1}else return!0}()?he(E.$(),pa(Xb(z))):he(E.$(),null)}var K=L(z),M=null!=K&&(K.g&64||K.G)?F.a(Jc,K):K,R=H.a(M,xh),ea=H.a(M,Bh);if(x(R))return Vc(new v(null,2,[xh,R,Nj,Ee(function(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,A){return function(a,b){return new U(null,2,5,W,[a,A.b?A.b(b):A.call(null,b)],null)}}(t,K,M,R,ea,z,w,a,b,c,d,e,f,g,k,l,m,n,p,q),ea)],null),pa(yc(z)));t=yc(z)}else return null}}}(a,b,c,d,e,f,g,k,l,m,n,p,q),null,null)}}(30,q,b,d,e,f,g,k,c,l,
m,n,p)(a)}()),t=Ue(Nj,I([r],0)),w=Nm(function(){var a=S.a(L,t);return Mm.b?Mm.b(a):Mm.call(null,a)}(),new U(null,2,5,W,[0,e-60],null)),z=Nm(function(){if(x(n))return n;var a=S.a(bd,t);return Mm.b?Mm.b(a):Mm.call(null,a)}(),new U(null,2,5,W,[q,0],null)),C=function(a,b,c,d){return function(a){var b=Q(a,0);a=Q(a,1);return new U(null,2,5,W,[c.b?c.b(b):c.call(null,b),d.b?d.b(a):d.call(null,a)],null)}}(r,t,w,z,30,q,b,d,e,f,g,k,c,l,m,n,p),E=Pk(new U(null,2,5,W,[Qk,Nj],null),function(a,b,c,d,e){return function(a){return S.a(e,
a)}}(r,t,w,z,C,30,q,b,d,e,f,g,k,c,l,m,n,p),r);return bb(bb(zc,function(){return function(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E){return function Ka(gb){return new ce(null,function(){return function(){for(;;){var a=J(gb);if(a){if(vd(a)){var b=Wb(a),c=P(b),d=ge(c);a:for(var e=0;;)if(e<c){var f=G.a(b,e),g=null!=f&&(f.g&64||f.G)?F.a(Jc,f):f,f=H.a(g,xh),g=H.a(g,Nj),f=new U(null,2,5,W,[lh,new v(null,2,[Qi,[D("history "),D(Rd(f))].join(""),kj,rn(g)],null)],null);d.add(f);e+=1}else{b=!0;break a}return b?he(d.$(),
Ka(Xb(a))):he(d.$(),null)}d=L(a);b=null!=d&&(d.g&64||d.G)?F.a(Jc,d):d;d=H.a(b,xh);b=H.a(b,Nj);return Vc(new U(null,2,5,W,[lh,new v(null,2,[Qi,[D("history "),D(Rd(d))].join(""),kj,rn(b)],null)],null),Ka(yc(a)))}return null}}}(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E),null,null)}}(r,t,w,z,C,E,30,q,b,d,e,f,g,k,c,l,m,n,p)(E)}()),function(){return function(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E){return function Ka(gb){return new ce(null,function(){return function(){for(;;){var a=J(gb);if(a){if(vd(a)){var b=
Wb(a),c=P(b),d=ge(c);a:for(var e=0;;)if(e<c){var f=G.a(b,e),f=null!=f&&(f.g&64||f.G)?F.a(Jc,f):f;H.a(f,xh);f=H.a(f,Nj);f=new U(null,2,5,W,[lh,new v(null,2,[Qi,""+D("history stroke"),kj,rn(f)],null)],null);d.add(f);e+=1}else{b=!0;break a}return b?he(d.$(),Ka(Xb(a))):he(d.$(),null)}d=L(a);d=null!=d&&(d.g&64||d.G)?F.a(Jc,d):d;H.a(d,xh);d=H.a(d,Nj);return Vc(new U(null,2,5,W,[lh,new v(null,2,[Qi,""+D("history stroke"),kj,rn(d)],null)],null),Ka(yc(a)))}return null}}}(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,
C,E),null,null)}}(r,t,w,z,C,E,30,q,b,d,e,f,g,k,c,l,m,n,p)(E)}())}(),new U(null,2,5,W,[Ki,new v(null,3,[Qi,"axis",uh,sn(0,q),Cj,e-60],null)],null),new U(null,2,5,W,[Ki,new v(null,2,[Qi,"axis",sj,q],null)],null)],null)}()],null)}
function Hn(b,a){var c=Lm(b),d=Q(c,0),e=Q(c,1),f=Q(c,2),c=Q(c,3);return new U(null,6,5,W,[Ci,new v(null,1,[Pi,"graphs"],null),Gn(d,a,new v(null,2,[si,"Total Input",ri,Vi],null)),Gn(e,a,new v(null,2,[si,"Total Output",ri,ei],null)),Gn(f,a,new v(null,2,[si,"Work in Progress",ri,oi],null)),Gn(c,a,new v(null,3,[si,"Utilization",ri,Be.a(Ce(F,Jd),Mh),Gj,new U(null,2,5,W,[0,1],null)],null))],null)}
function In(b){var a=Jn,c=null!=b&&(b.g&64||b.G)?F.a(Jc,b):b,d=H.a(c,Xh),e=H.a(c,Hj),f=H.a(c,Aj),g=H.a(c,df),k=H.a(c,Rh),l=H.a(c,Hh);return new U(null,5,5,W,[uj,ve,new U(null,3,5,W,[zi,new v(null,1,[yi,new v(null,3,[gj,rj,Jj,"5px",Kh,"5px"],null)],null),new U(null,4,5,W,[zi,ve,f," steps"],null)],null),new U(null,4,5,W,[zi,new v(null,1,[Pi,"controls"],null),new U(null,6,5,W,[Uh,new v(null,1,[pi,"slidden"],null),new U(null,3,5,W,[Jh,new v(null,1,[ai,function(){return function(){var b=new U(null,3,5,
W,[sh,1,!0],null);return a.b?a.b(b):a.call(null,b)}}(b,c,d,e,f,g,k,l)],null),"Roll"],null),new U(null,3,5,W,[Jh,new v(null,1,[ai,function(){return function(){var b=new U(null,3,5,W,[sh,100,!0],null);return a.b?a.b(b):a.call(null,b)}}(b,c,d,e,f,g,k,l)],null),"Run"],null),new U(null,3,5,W,[Jh,new v(null,1,[ai,function(){return function(){var b=new U(null,3,5,W,[sh,100,!1],null);return a.b?a.b(b):a.call(null,b)}}(b,c,d,e,f,g,k,l)],null),"Run Fast"],null),new U(null,3,5,W,[Jh,new v(null,1,[ai,function(b,
c,d,e,f,g,k,l){return function(){var b=new U(null,2,5,W,[hj,Oa(l)],null);return a.b?a.b(b):a.call(null,b)}}(b,c,d,e,f,g,k,l)],null),x(l)?"Hide graphs":"Show graphs"],null)],null),new U(null,7,5,W,[Uh,new v(null,1,[pi,"slidden"],null),new U(null,3,5,W,[Jh,new v(null,1,[ai,function(){return function(){var b=new U(null,2,5,W,[Ii,ij],null);return a.b?a.b(b):a.call(null,b)}}(b,c,d,e,f,g,k,l)],null),"Basic"],null),new U(null,3,5,W,[Jh,new v(null,1,[ai,function(){return function(){var b=new U(null,2,5,W,
[Ii,Gh],null);return a.b?a.b(b):a.call(null,b)}}(b,c,d,e,f,g,k,l)],null),"Efficient"],null),new U(null,3,5,W,[Jh,new v(null,1,[ai,function(){return function(){var b=new U(null,2,5,W,[Ii,Lh],null);return a.b?a.b(b):a.call(null,b)}}(b,c,d,e,f,g,k,l)],null),"Basic \x26 Efficient"],null),new U(null,3,5,W,[Jh,new v(null,1,[ai,function(){return function(){var b=new U(null,2,5,W,[Ii,ji],null);return a.b?a.b(b):a.call(null,b)}}(b,c,d,e,f,g,k,l)],null),"Constrained"],null),new U(null,3,5,W,[Jh,new v(null,
1,[ai,function(){return function(){var b=new U(null,2,5,W,[Ii,mi],null);return a.b?a.b(b):a.call(null,b)}}(b,c,d,e,f,g,k,l)],null),"All 3"],null)],null)],null),new U(null,5,5,W,[Zi,new v(null,3,[Pi,"space",Xh,"100%",Hj,"100%"],null),function(){return function(a,b,c,d,e,f,g,k){return function E(l){return new ce(null,function(){return function(){for(;;){var a=J(l);if(a){if(vd(a)){var b=Wb(a),c=P(b),d=ge(c);a:for(var e=0;;)if(e<c){var f=G.a(b,e),g=null!=f&&(f.g&64||f.G)?F.a(Jc,f):f,f=g,k=H.a(g,nj),g=
H.a(g,kh),f=x(k)?new U(null,3,5,W,[Ci,new v(null,1,[uh,sn(k,g)],null),tn(f)],null):null;d.add(f);e+=1}else{b=!0;break a}return b?he(d.$(),E(Xb(a))):he(d.$(),null)}d=L(a);d=c=null!=d&&(d.g&64||d.G)?F.a(Jc,d):d;b=H.a(c,nj);c=H.a(c,kh);return Vc(x(b)?new U(null,3,5,W,[Ci,new v(null,1,[uh,sn(b,c)],null),tn(d)],null):null,E(yc(a)))}return null}}}(a,b,c,d,e,f,g,k),null,null)}}(b,c,d,e,f,g,k,l)(g)}(),S.a(Fn,k),x(x(d)?x(e)?l:e:d)?Hn(new U(null,2,5,W,[d,e],null),k):null],null)],null)};var wa=function(){function b(b){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new xc(e,0)}return a.call(this,d)}function a(a){return console.log.apply(console,Ja.b?Ja.b(a):Ja.call(null,a))}b.w=0;b.D=function(b){b=J(b);return a(b)};b.j=a;return b}(),xa=function(){function b(b){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new xc(e,0)}return a.call(this,d)}function a(a){return console.error.apply(console,
Ja.b?Ja.b(a):Ja.call(null,a))}b.w=0;b.D=function(b){b=J(b);return a(b)};b.j=a;return b}(),Zm=nn.b?nn.b(ij):nn.call(null,ij);function Kn(b){var a=new v(null,2,[nj,45,Xh,60],null),c=null!=a&&(a.g&64||a.G)?F.a(Jc,a):a,d=H.a(c,Xh),e=H.a(c,nj),f=Me(1,Dh.b(L(Ve(xh,Rh.b(b))))),g=S.a(Hj,f),k=S.a(kh,f);return cf(b,Ce(S,function(a,b,c,d,e,f,g){return function(a,b,c){return id.j(a,nj,g,I([kh,b+c+(0-f/2-20),Xh,f,Hj,f],0))}}(f,g,k,a,c,d,e)),k,g)}if("undefined"===typeof $m)var $m=tm(null);
function Jn(b){return wm($m,b)}if("undefined"===typeof Ln)var Ln=X.b?X.b(!1):X.call(null,!1);
function Mn(b,a){var c=tm(1);am(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!T(e,Y)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Ml(c),d=Y;else throw f;}if(!T(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(){return function(c){var d=c[1];if(7===d){var d=c[2],e=Qm();c[7]=d;return Il(c,8,e)}if(20===d)return c[8]=c[2],c[1]=x(a)?21:22,Y;if(27===d)return d=c[2],c[1]=x(d)?28:29,Y;if(1===d)return Jl(c,2,$m,fj);if(24===d)return d=c[2],c[2]=d,c[1]=23,Y;if(4===d)return d=new U(null,2,5,W,[zh,!0],null),Jl(c,7,$m,d);if(15===d)return c[9]=c[2],Jl(c,19,$m,yj);if(21===d)return c[2]=null,c[1]=23,Y;if(31===
d)return d=c[2],c[2]=d,c[1]=30,Y;if(13===d)return d=new U(null,2,5,W,[wi,!0],null),Jl(c,16,$m,d);if(22===d)return d=O.b?O.b(Um):O.call(null,Um),d=d.b?d.b(Aj):d.call(null,Aj),d=rm(d),Il(c,24,d);if(29===d)return c[2]=null,c[1]=30,Y;if(6===d)return c[10]=c[2],Jl(c,10,$m,ej);if(28===d)return d=c[11],d=new U(null,3,5,W,[sh,d,a],null),Jl(c,31,$m,d);if(25===d)return d=c[11],c[2]=0<d,c[1]=27,Y;if(17===d)return d=new U(null,2,5,W,[wi,!1],null),c[12]=c[2],Jl(c,18,$m,d);if(3===d)return c[13]=c[2],c[1]=x(a)?
4:5,Y;if(12===d)return c[14]=c[2],c[1]=x(a)?13:14,Y;if(2===d)return c[15]=c[2],Jl(c,3,$m,oh);if(23===d){var d=c[16],e=c[2],d=b-1,f=O.b?O.b(Ln):O.call(null,Ln);c[11]=d;c[16]=f;c[17]=e;c[1]=x(f)?25:26;return Y}return 19===d?(c[18]=c[2],Jl(c,20,$m,Di)):11===d?(c[19]=c[2],Jl(c,12,$m,Gi)):9===d?(d=c[2],c[2]=d,c[1]=6,Y):5===d?(c[2]=null,c[1]=6,Y):14===d?(c[2]=null,c[1]=15,Y):26===d?(d=c[16],c[2]=d,c[1]=27,Y):16===d?(d=c[2],e=Qm(),c[20]=d,Il(c,17,e)):30===d?(d=c[2],Kl(c,d)):10===d?(c[21]=c[2],Jl(c,11,$m,
Fi)):18===d?(d=c[2],c[2]=d,c[1]=15,Y):8===d?(d=new U(null,2,5,W,[zh,!1],null),c[22]=c[2],Jl(c,9,$m,d)):null}}(c),c)}(),f=function(){var a=e.l?e.l():e.call(null);a[6]=c;return a}();return Hl(f)}}(c))}
function Nn(){var b=tm(1);am(function(a){return function(){var b=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var f=a(c);if(!T(f,Y)){d=f;break a}}}catch(g){if(g instanceof Object)c[5]=g,Ml(c),d=Y;else throw g;}if(!T(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.l=c;d.b=b;return d}()}(function(a){return function(b){var c=b[1];if(1===c){var d=rm(50);return Il(b,2,d)}if(2===c){var l=b[2],m=function(){return function(){return function(a){return a.width}}(l,c,a)}(),d=Cg(m,function(){return function(){return function(a){return a.height}}(l,m,c,a)}()),n=document.getElementById("space").getBoundingClientRect(),n=d.b?d.b(n):d.call(null,n),d=Q(n,0),n=Q(n,1),d=wm($m,new U(null,3,5,W,[qi,d,n],null)),n=rm(100);b[7]=l;b[8]=d;return Il(b,3,n)}return 3===
c?(d=b[2],n=wm($m,tj),b[9]=d,Kl(b,n)):null}}(a),a)}(),d=function(){var d=b.l?b.l():b.call(null);d[6]=a;return d}();return Hl(d)}}(b))}
function Ym(b,a){var c=null!=b&&(b.g&64||b.G)?F.a(Jc,b):b,d=H.a(c,Rh);try{if(T(a,ti))return c;throw Im;}catch(e){if(e instanceof Error)if(e===Im)try{if(sd(a)&&3===P(a))try{var f=gd(a,0);if(T(f,qi)){var g=gd(a,1),k=gd(a,2);return Kn($e(id.j(c,Xh,g,I([Hj,k],0)),Rh,Ce(dl,new v(null,3,[nj,150,Xh,g-150,Hj,k],null))))}throw Im;}catch(l){if(l instanceof Error){f=l;if(f===Im)throw Im;throw f;}throw l;}else throw Im;}catch(m){if(m instanceof Error)if(f=m,f===Im)try{if(T(a,tj))return fl(c,function(){return function(a){a=
null!=a&&(a.g&64||a.G)?F.a(Jc,a):a;var b=H.a(a,Pi),b=Pj(b);return x(b)?id.c(a,aj,b.getTotalLength()):a}}(f,e,b,c,c,d));throw Im;}catch(n){if(n instanceof Error)if(n===Im)try{if(sd(a)&&2===P(a))try{var p=gd(a,0);if(T(p,Ii)){var q=gd(a,1);Ie.a?Ie.a(Ln,!1):Ie.call(null,Ln,!1);Nn();return nn.b?nn.b(q):nn.call(null,q)}throw Im;}catch(r){if(r instanceof Error){p=r;if(p===Im)throw Im;throw p;}throw r;}else throw Im;}catch(t){if(t instanceof Error)if(p=t,p===Im)try{if(sd(a)&&3===P(a))try{var w=gd(a,0);if(T(w,
sh)){var z=gd(a,1),C=gd(a,2);Ie.a?Ie.a(Ln,!0):Ie.call(null,Ln,!0);Mn(z,C);return c}throw Im;}catch(E){if(E instanceof Error){w=E;if(w===Im)throw Im;throw w;}throw E;}else throw Im;}catch(K){if(K instanceof Error)if(w=K,w===Im)try{if(T(a,fj))return bf($e(c,Aj,Mc),df,gl,Ed(Pe(function(){return function(){return 6*Math.random()+1|0}}(w,p,n,f,e,b,c,c,d))));throw Im;}catch(M){if(M instanceof Error)if(M===Im)try{if(T(a,oh))return jl(c);throw Im;}catch(za){if(za instanceof Error)if(za===Im)try{if(sd(a)&&
2===P(a))try{var A=gd(a,0);if(T(A,zh)){var ea=gd(a,1);return fl(c,function(a){return function(b){return id.c(b,ki,a)}}(ea,A,za,M,w,p,n,f,e,b,c,c,d))}throw Im;}catch(na){if(na instanceof Error){A=na;if(A===Im)throw Im;throw A;}throw na;}else throw Im;}catch(R){if(R instanceof Error)if(A=R,A===Im)try{if(T(a,ej))return ql(c);throw Im;}catch(V){if(V instanceof Error)if(V===Im)try{if(T(a,Fi))return tl(c);throw Im;}catch(ba){if(ba instanceof Error)if(ba===Im)try{if(T(a,Gi))return sl(c);throw Im;}catch(ca){if(ca instanceof
Error)if(ca===Im)try{if(sd(a)&&2===P(a))try{var ga=gd(a,0);if(T(ga,wi))return ea=gd(a,1),fl(c,function(a){return function(b){return id.c(b,lj,a)}}(ea,ga,ca,ba,V,A,za,M,w,p,n,f,e,b,c,c,d));throw Im;}catch(ja){if(ja instanceof Error){d=ja;if(d===Im)throw Im;throw d;}throw ja;}else throw Im;}catch(la){if(la instanceof Error)if(d=la,d===Im)try{if(T(a,yj))return ul(c);throw Im;}catch(oa){if(oa instanceof Error)if(oa===Im)try{if(T(a,Di))return wl(c);throw Im;}catch(pa){if(pa instanceof Error)if(pa===Im)try{if(sd(a)&&
2===P(a))try{var Ta=gd(a,0);if(T(Ta,hj))return ea=gd(a,1),id.c(c,Hh,ea);throw Im;}catch(Aa){if(Aa instanceof Error){c=Aa;if(c===Im)throw Im;throw c;}throw Aa;}else throw Im;}catch(Ea){if(Ea instanceof Error){c=Ea;if(c===Im)throw Error([D("No matching clause: "),D(a)].join(""));throw c;}throw Ea;}else throw pa;else throw pa;}else throw oa;else throw oa;}else throw d;else throw la;}else throw ca;else throw ca;}else throw ba;else throw ba;}else throw V;else throw V;}else throw A;else throw R;}else throw za;
else throw za;}else throw M;else throw M;}else throw w;else throw K;}else throw p;else throw t;}else throw n;else throw n;}else throw f;else throw m;}else throw e;else throw e;}}if("undefined"===typeof ym)var ym=Xm();if("undefined"===typeof On){var bn;bn=xm(function(b){return In(b)});var On;On=an()}Nn();