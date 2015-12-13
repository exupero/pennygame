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
else if("function"==a&&"undefined"==typeof b.call)return"object";return a}function ea(b){return"function"==u(b)}var fa="closure_uid_"+(1E9*Math.random()>>>0),ia=0;function la(b,a,c){return b.call.apply(b.bind,arguments)}function na(b,a,c){if(!b)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return b.apply(a,c)}}return function(){return b.apply(a,arguments)}}
function pa(b,a,c){pa=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?la:na;return pa.apply(null,arguments)};function qa(b,a){for(var c in b)a.call(void 0,b[c],c,b)};function ra(b,a){null!=b&&this.append.apply(this,arguments)}h=ra.prototype;h.hb="";h.set=function(b){this.hb=""+b};h.append=function(b,a,c){this.hb+=b;if(null!=a)for(var d=1;d<arguments.length;d++)this.hb+=arguments[d];return this};h.clear=function(){this.hb=""};h.toString=function(){return this.hb};function ta(b,a){return b>a?1:b<a?-1:0};var ua={},wa;if("undefined"===typeof xa)var xa=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof za)var za=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var Aa=null;if("undefined"===typeof Ba)var Ba=null;function Ca(){return new v(null,5,[Da,!0,Fa,!0,Ga,!1,Ha,!1,Ia,null],null)}Ja;function x(b){return null!=b&&!1!==b}Ka;y;function La(b){return null==b}function Ma(b){return b instanceof Array}
function Na(b){return null==b?!0:!1===b?!0:!1}function Oa(b,a){return b[u(null==a?null:a)]?!0:b._?!0:!1}function B(b,a){var c=null==a?null:a.constructor,c=x(x(c)?c.xb:c)?c.eb:u(a);return Error(["No protocol method ",b," defined for type ",c,": ",a].join(""))}function Pa(b){var a=b.eb;return x(a)?a:""+D(b)}var Ra="undefined"!==typeof Symbol&&"function"===u(Symbol)?Symbol.iterator:"@@iterator";function Ta(b){for(var a=b.length,c=Array(a),d=0;;)if(d<a)c[d]=b[d],d+=1;else break;return c}F;Ua;
var Ja=function Ja(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ja.b(arguments[0]);case 2:return Ja.a(arguments[0],arguments[1]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};Ja.b=function(b){return Ja.a(null,b)};Ja.a=function(b,a){function c(a,b){a.push(b);return a}var d=[];return Ua.c?Ua.c(c,d,a):Ua.call(null,c,d,a)};Ja.w=2;function Va(){}function Wa(){}
var Xa=function Xa(a){if(null!=a&&null!=a.X)return a.X(a);var c=Xa[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Xa._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("ICounted.-count",a);},Ya=function Ya(a){if(null!=a&&null!=a.da)return a.da(a);var c=Ya[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Ya._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IEmptyableCollection.-empty",a);};function ab(){}
var bb=function bb(a,c){if(null!=a&&null!=a.W)return a.W(a,c);var d=bb[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=bb._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("ICollection.-conj",a);};function cb(){}
var G=function G(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return G.a(arguments[0],arguments[1]);case 3:return G.c(arguments[0],arguments[1],arguments[2]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};
G.a=function(b,a){if(null!=b&&null!=b.ca)return b.ca(b,a);var c=G[u(null==b?null:b)];if(null!=c)return c.a?c.a(b,a):c.call(null,b,a);c=G._;if(null!=c)return c.a?c.a(b,a):c.call(null,b,a);throw B("IIndexed.-nth",b);};G.c=function(b,a,c){if(null!=b&&null!=b.Ea)return b.Ea(b,a,c);var d=G[u(null==b?null:b)];if(null!=d)return d.c?d.c(b,a,c):d.call(null,b,a,c);d=G._;if(null!=d)return d.c?d.c(b,a,c):d.call(null,b,a,c);throw B("IIndexed.-nth",b);};G.w=3;function db(){}
var eb=function eb(a){if(null!=a&&null!=a.ta)return a.ta(a);var c=eb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=eb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("ISeq.-first",a);},fb=function fb(a){if(null!=a&&null!=a.xa)return a.xa(a);var c=fb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=fb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("ISeq.-rest",a);};function gb(){}function hb(){}
var ib=function ib(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return ib.a(arguments[0],arguments[1]);case 3:return ib.c(arguments[0],arguments[1],arguments[2]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};
ib.a=function(b,a){if(null!=b&&null!=b.N)return b.N(b,a);var c=ib[u(null==b?null:b)];if(null!=c)return c.a?c.a(b,a):c.call(null,b,a);c=ib._;if(null!=c)return c.a?c.a(b,a):c.call(null,b,a);throw B("ILookup.-lookup",b);};ib.c=function(b,a,c){if(null!=b&&null!=b.I)return b.I(b,a,c);var d=ib[u(null==b?null:b)];if(null!=d)return d.c?d.c(b,a,c):d.call(null,b,a,c);d=ib._;if(null!=d)return d.c?d.c(b,a,c):d.call(null,b,a,c);throw B("ILookup.-lookup",b);};ib.w=3;
var jb=function jb(a,c){if(null!=a&&null!=a.lc)return a.lc(a,c);var d=jb[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=jb._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("IAssociative.-contains-key?",a);},kb=function kb(a,c,d){if(null!=a&&null!=a.Oa)return a.Oa(a,c,d);var e=kb[u(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=kb._;if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw B("IAssociative.-assoc",a);};function lb(){}
var mb=function mb(a,c){if(null!=a&&null!=a.ib)return a.ib(a,c);var d=mb[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=mb._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("IMap.-dissoc",a);};function nb(){}
var ob=function ob(a){if(null!=a&&null!=a.Mb)return a.Mb(a);var c=ob[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=ob._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IMapEntry.-key",a);},pb=function pb(a){if(null!=a&&null!=a.Nb)return a.Nb(a);var c=pb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=pb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IMapEntry.-val",a);};function qb(){}
var rb=function rb(a){if(null!=a&&null!=a.jb)return a.jb(a);var c=rb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=rb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IStack.-peek",a);};function sb(){}
var tb=function tb(a,c,d){if(null!=a&&null!=a.kb)return a.kb(a,c,d);var e=tb[u(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=tb._;if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw B("IVector.-assoc-n",a);},ub=function ub(a){if(null!=a&&null!=a.Jb)return a.Jb(a);var c=ub[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=ub._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IDeref.-deref",a);};function vb(){}
var wb=function wb(a){if(null!=a&&null!=a.O)return a.O(a);var c=wb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=wb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IMeta.-meta",a);},xb=function xb(a,c){if(null!=a&&null!=a.P)return a.P(a,c);var d=xb[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=xb._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("IWithMeta.-with-meta",a);};function yb(){}
var zb=function zb(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return zb.a(arguments[0],arguments[1]);case 3:return zb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};
zb.a=function(b,a){if(null!=b&&null!=b.ea)return b.ea(b,a);var c=zb[u(null==b?null:b)];if(null!=c)return c.a?c.a(b,a):c.call(null,b,a);c=zb._;if(null!=c)return c.a?c.a(b,a):c.call(null,b,a);throw B("IReduce.-reduce",b);};zb.c=function(b,a,c){if(null!=b&&null!=b.fa)return b.fa(b,a,c);var d=zb[u(null==b?null:b)];if(null!=d)return d.c?d.c(b,a,c):d.call(null,b,a,c);d=zb._;if(null!=d)return d.c?d.c(b,a,c):d.call(null,b,a,c);throw B("IReduce.-reduce",b);};zb.w=3;
var Bb=function Bb(a,c,d){if(null!=a&&null!=a.Lb)return a.Lb(a,c,d);var e=Bb[u(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=Bb._;if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw B("IKVReduce.-kv-reduce",a);},Cb=function Cb(a,c){if(null!=a&&null!=a.C)return a.C(a,c);var d=Cb[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=Cb._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("IEquiv.-equiv",a);},Db=function Db(a){if(null!=a&&null!=a.T)return a.T(a);
var c=Db[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Db._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IHash.-hash",a);};function Eb(){}var Fb=function Fb(a){if(null!=a&&null!=a.U)return a.U(a);var c=Fb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Fb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("ISeqable.-seq",a);};function Gb(){}function Hb(){}function Ib(){}
var Jb=function Jb(a){if(null!=a&&null!=a.bc)return a.bc(a);var c=Jb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Jb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IReversible.-rseq",a);},Kb=function Kb(a,c){if(null!=a&&null!=a.Bc)return a.Bc(0,c);var d=Kb[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=Kb._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("IWriter.-write",a);},Lb=function Lb(a,c,d){if(null!=a&&null!=a.M)return a.M(a,c,d);var e=
Lb[u(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=Lb._;if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw B("IPrintWithWriter.-pr-writer",a);},Mb=function Mb(a,c,d){if(null!=a&&null!=a.Ac)return a.Ac(0,c,d);var e=Mb[u(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=Mb._;if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw B("IWatchable.-notify-watches",a);},Nb=function Nb(a){if(null!=a&&null!=a.vb)return a.vb(a);var c=Nb[u(null==a?null:
a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Nb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IEditableCollection.-as-transient",a);},Ob=function Ob(a,c){if(null!=a&&null!=a.Rb)return a.Rb(a,c);var d=Ob[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=Ob._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("ITransientCollection.-conj!",a);},Pb=function Pb(a){if(null!=a&&null!=a.Sb)return a.Sb(a);var c=Pb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,
a);c=Pb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("ITransientCollection.-persistent!",a);},Sb=function Sb(a,c,d){if(null!=a&&null!=a.Qb)return a.Qb(a,c,d);var e=Sb[u(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=Sb._;if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw B("ITransientAssociative.-assoc!",a);},Tb=function Tb(a,c,d){if(null!=a&&null!=a.zc)return a.zc(0,c,d);var e=Tb[u(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=Tb._;
if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw B("ITransientVector.-assoc-n!",a);};function Ub(){}
var Vb=function Vb(a,c){if(null!=a&&null!=a.ub)return a.ub(a,c);var d=Vb[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=Vb._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("IComparable.-compare",a);},Wb=function Wb(a){if(null!=a&&null!=a.wc)return a.wc();var c=Wb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Wb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IChunk.-drop-first",a);},Xb=function Xb(a){if(null!=a&&null!=a.nc)return a.nc(a);var c=
Xb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Xb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IChunkedSeq.-chunked-first",a);},Yb=function Yb(a){if(null!=a&&null!=a.oc)return a.oc(a);var c=Yb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Yb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IChunkedSeq.-chunked-rest",a);},Zb=function Zb(a){if(null!=a&&null!=a.mc)return a.mc(a);var c=Zb[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,
a);c=Zb._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IChunkedNext.-chunked-next",a);},$b=function $b(a){if(null!=a&&null!=a.Ob)return a.Ob(a);var c=$b[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=$b._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("INamed.-name",a);},ac=function ac(a){if(null!=a&&null!=a.Pb)return a.Pb(a);var c=ac[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=ac._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("INamed.-namespace",
a);},bc=function bc(a,c){if(null!=a&&null!=a.Zc)return a.Zc(a,c);var d=bc[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=bc._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("IReset.-reset!",a);},cc=function cc(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return cc.a(arguments[0],arguments[1]);case 3:return cc.c(arguments[0],arguments[1],arguments[2]);case 4:return cc.o(arguments[0],arguments[1],arguments[2],
arguments[3]);case 5:return cc.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};cc.a=function(b,a){if(null!=b&&null!=b.ad)return b.ad(b,a);var c=cc[u(null==b?null:b)];if(null!=c)return c.a?c.a(b,a):c.call(null,b,a);c=cc._;if(null!=c)return c.a?c.a(b,a):c.call(null,b,a);throw B("ISwap.-swap!",b);};
cc.c=function(b,a,c){if(null!=b&&null!=b.bd)return b.bd(b,a,c);var d=cc[u(null==b?null:b)];if(null!=d)return d.c?d.c(b,a,c):d.call(null,b,a,c);d=cc._;if(null!=d)return d.c?d.c(b,a,c):d.call(null,b,a,c);throw B("ISwap.-swap!",b);};cc.o=function(b,a,c,d){if(null!=b&&null!=b.cd)return b.cd(b,a,c,d);var e=cc[u(null==b?null:b)];if(null!=e)return e.o?e.o(b,a,c,d):e.call(null,b,a,c,d);e=cc._;if(null!=e)return e.o?e.o(b,a,c,d):e.call(null,b,a,c,d);throw B("ISwap.-swap!",b);};
cc.A=function(b,a,c,d,e){if(null!=b&&null!=b.dd)return b.dd(b,a,c,d,e);var f=cc[u(null==b?null:b)];if(null!=f)return f.A?f.A(b,a,c,d,e):f.call(null,b,a,c,d,e);f=cc._;if(null!=f)return f.A?f.A(b,a,c,d,e):f.call(null,b,a,c,d,e);throw B("ISwap.-swap!",b);};cc.w=5;var dc=function dc(a){if(null!=a&&null!=a.Ga)return a.Ga(a);var c=dc[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=dc._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IIterable.-iterator",a);};
function ec(b){this.rd=b;this.g=1073741824;this.B=0}ec.prototype.Bc=function(b,a){return this.rd.append(a)};function fc(b){var a=new ra;b.M(null,new ec(a),Ca());return""+D(a)}var gc="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(b,a){return Math.imul(b,a)}:function(b,a){var c=b&65535,d=a&65535;return c*d+((b>>>16&65535)*d+c*(a>>>16&65535)<<16>>>0)|0};function hc(b){b=gc(b|0,-862048943);return gc(b<<15|b>>>-15,461845907)}
function ic(b,a){var c=(b|0)^(a|0);return gc(c<<13|c>>>-13,5)+-430675100|0}function jc(b,a){var c=(b|0)^a,c=gc(c^c>>>16,-2048144789),c=gc(c^c>>>13,-1028477387);return c^c>>>16}function kc(b){var a;a:{a=1;for(var c=0;;)if(a<b.length){var d=a+2,c=ic(c,hc(b.charCodeAt(a-1)|b.charCodeAt(a)<<16));a=d}else{a=c;break a}}a=1===(b.length&1)?a^hc(b.charCodeAt(b.length-1)):a;return jc(a,gc(2,b.length))}lc;mc;nc;oc;var pc={},qc=0;
function rc(b){255<qc&&(pc={},qc=0);var a=pc[b];if("number"!==typeof a){a:if(null!=b)if(a=b.length,0<a)for(var c=0,d=0;;)if(c<a)var e=c+1,d=gc(31,d)+b.charCodeAt(c),c=e;else{a=d;break a}else a=0;else a=0;pc[b]=a;qc+=1}return b=a}function sc(b){null!=b&&(b.g&4194304||b.xd)?b=b.T(null):"number"===typeof b?b=Math.floor(b)%2147483647:!0===b?b=1:!1===b?b=0:"string"===typeof b?(b=rc(b),0!==b&&(b=hc(b),b=ic(0,b),b=jc(b,4))):b=b instanceof Date?b.valueOf():null==b?0:Db(b);return b}
function tc(b,a){return b^a+2654435769+(b<<6)+(b>>2)}function Ka(b,a){return a instanceof b}function uc(b,a){if(b.$a===a.$a)return 0;var c=Na(b.Ba);if(x(c?a.Ba:c))return-1;if(x(b.Ba)){if(Na(a.Ba))return 1;c=ta(b.Ba,a.Ba);return 0===c?ta(b.name,a.name):c}return ta(b.name,a.name)}J;function mc(b,a,c,d,e){this.Ba=b;this.name=a;this.$a=c;this.tb=d;this.Da=e;this.g=2154168321;this.B=4096}h=mc.prototype;h.toString=function(){return this.$a};h.equiv=function(b){return this.C(null,b)};
h.C=function(b,a){return a instanceof mc?this.$a===a.$a:!1};h.call=function(){function b(a,b,c){return J.c?J.c(b,this,c):J.call(null,b,this,c)}function a(a,b){return J.a?J.a(b,this):J.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return a.call(this,0,e);case 3:return b.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=a;c.c=b;return c}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ta(a)))};
h.b=function(b){return J.a?J.a(b,this):J.call(null,b,this)};h.a=function(b,a){return J.c?J.c(b,this,a):J.call(null,b,this,a)};h.O=function(){return this.Da};h.P=function(b,a){return new mc(this.Ba,this.name,this.$a,this.tb,a)};h.T=function(){var b=this.tb;return null!=b?b:this.tb=b=tc(kc(this.name),rc(this.Ba))};h.Ob=function(){return this.name};h.Pb=function(){return this.Ba};h.M=function(b,a){return Kb(a,this.$a)};
var vc=function vc(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return vc.b(arguments[0]);case 2:return vc.a(arguments[0],arguments[1]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};vc.b=function(b){if(b instanceof mc)return b;var a=b.indexOf("/");return-1===a?vc.a(null,b):vc.a(b.substring(0,a),b.substring(a+1,b.length))};vc.a=function(b,a){var c=null!=b?[D(b),D("/"),D(a)].join(""):a;return new mc(b,a,c,null,null)};
vc.w=2;K;wc;xc;function L(b){if(null==b)return null;if(null!=b&&(b.g&8388608||b.$c))return b.U(null);if(Ma(b)||"string"===typeof b)return 0===b.length?null:new xc(b,0);if(Oa(Eb,b))return Fb(b);throw Error([D(b),D(" is not ISeqable")].join(""));}function M(b){if(null==b)return null;if(null!=b&&(b.g&64||b.F))return b.ta(null);b=L(b);return null==b?null:eb(b)}function yc(b){return null!=b?null!=b&&(b.g&64||b.F)?b.xa(null):(b=L(b))?fb(b):zc:zc}
function N(b){return null==b?null:null!=b&&(b.g&128||b.ac)?b.wa(null):L(yc(b))}var nc=function nc(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return nc.b(arguments[0]);case 2:return nc.a(arguments[0],arguments[1]);default:return nc.j(arguments[0],arguments[1],new xc(c.slice(2),0))}};nc.b=function(){return!0};nc.a=function(b,a){return null==b?null==a:b===a||Cb(b,a)};
nc.j=function(b,a,c){for(;;)if(nc.a(b,a))if(N(c))b=a,a=M(c),c=N(c);else return nc.a(a,M(c));else return!1};nc.D=function(b){var a=M(b),c=N(b);b=M(c);c=N(c);return nc.j(a,b,c)};nc.w=2;function Ac(b){this.J=b}Ac.prototype.next=function(){if(null!=this.J){var b=M(this.J);this.J=N(this.J);return{value:b,done:!1}}return{value:null,done:!0}};function Cc(b){return new Ac(L(b))}Dc;function Ec(b,a,c){this.value=b;this.Db=a;this.jc=c;this.g=8388672;this.B=0}Ec.prototype.U=function(){return this};
Ec.prototype.ta=function(){return this.value};Ec.prototype.xa=function(){null==this.jc&&(this.jc=Dc.b?Dc.b(this.Db):Dc.call(null,this.Db));return this.jc};function Dc(b){var a=b.next();return x(a.done)?zc:new Ec(a.value,b,null)}function Fc(b,a){var c=hc(b),c=ic(0,c);return jc(c,a)}function Gc(b){var a=0,c=1;for(b=L(b);;)if(null!=b)a+=1,c=gc(31,c)+sc(M(b))|0,b=N(b);else return Fc(c,a)}var Hc=Fc(1,0);function Ic(b){var a=0,c=0;for(b=L(b);;)if(null!=b)a+=1,c=c+sc(M(b))|0,b=N(b);else return Fc(c,a)}
var Jc=Fc(0,0);Kc;lc;Lc;Wa["null"]=!0;Xa["null"]=function(){return 0};Date.prototype.C=function(b,a){return a instanceof Date&&this.valueOf()===a.valueOf()};Date.prototype.Ib=!0;Date.prototype.ub=function(b,a){if(a instanceof Date)return ta(this.valueOf(),a.valueOf());throw Error([D("Cannot compare "),D(this),D(" to "),D(a)].join(""));};Cb.number=function(b,a){return b===a};Mc;Va["function"]=!0;vb["function"]=!0;wb["function"]=function(){return null};Db._=function(b){return b[fa]||(b[fa]=++ia)};
function Nc(b){return b+1}O;function Oc(b){this.H=b;this.g=32768;this.B=0}Oc.prototype.Jb=function(){return this.H};function Pc(b){return b instanceof Oc}function O(b){return ub(b)}function Qc(b,a){var c=Xa(b);if(0===c)return a.l?a.l():a.call(null);for(var d=G.a(b,0),e=1;;)if(e<c){var f=G.a(b,e),d=a.a?a.a(d,f):a.call(null,d,f);if(Pc(d))return ub(d);e+=1}else return d}
function Rc(b,a,c){var d=Xa(b),e=c;for(c=0;;)if(c<d){var f=G.a(b,c),e=a.a?a.a(e,f):a.call(null,e,f);if(Pc(e))return ub(e);c+=1}else return e}function Sc(b,a){var c=b.length;if(0===b.length)return a.l?a.l():a.call(null);for(var d=b[0],e=1;;)if(e<c){var f=b[e],d=a.a?a.a(d,f):a.call(null,d,f);if(Pc(d))return ub(d);e+=1}else return d}function Tc(b,a,c){var d=b.length,e=c;for(c=0;;)if(c<d){var f=b[c],e=a.a?a.a(e,f):a.call(null,e,f);if(Pc(e))return ub(e);c+=1}else return e}
function Uc(b,a,c,d){for(var e=b.length;;)if(d<e){var f=b[d];c=a.a?a.a(c,f):a.call(null,c,f);if(Pc(c))return ub(c);d+=1}else return c}Vc;Wc;Xc;Yc;function Zc(b){return null!=b?b.g&2||b.Qc?!0:b.g?!1:Oa(Wa,b):Oa(Wa,b)}function $c(b){return null!=b?b.g&16||b.xc?!0:b.g?!1:Oa(cb,b):Oa(cb,b)}function ad(b,a){this.f=b;this.s=a}ad.prototype.ya=function(){return this.s<this.f.length};ad.prototype.next=function(){var b=this.f[this.s];this.s+=1;return b};
function xc(b,a){this.f=b;this.s=a;this.g=166199550;this.B=8192}h=xc.prototype;h.toString=function(){return fc(this)};h.equiv=function(b){return this.C(null,b)};h.ca=function(b,a){var c=a+this.s;return c<this.f.length?this.f[c]:null};h.Ea=function(b,a,c){b=a+this.s;return b<this.f.length?this.f[b]:c};h.Ga=function(){return new ad(this.f,this.s)};h.wa=function(){return this.s+1<this.f.length?new xc(this.f,this.s+1):null};h.X=function(){var b=this.f.length-this.s;return 0>b?0:b};
h.bc=function(){var b=Xa(this);return 0<b?new Xc(this,b-1,null):null};h.T=function(){return Gc(this)};h.C=function(b,a){return Lc.a?Lc.a(this,a):Lc.call(null,this,a)};h.da=function(){return zc};h.ea=function(b,a){return Uc(this.f,a,this.f[this.s],this.s+1)};h.fa=function(b,a,c){return Uc(this.f,a,c,this.s)};h.ta=function(){return this.f[this.s]};h.xa=function(){return this.s+1<this.f.length?new xc(this.f,this.s+1):zc};h.U=function(){return this.s<this.f.length?this:null};
h.W=function(b,a){return Wc.a?Wc.a(a,this):Wc.call(null,a,this)};xc.prototype[Ra]=function(){return Cc(this)};var wc=function wc(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return wc.b(arguments[0]);case 2:return wc.a(arguments[0],arguments[1]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};wc.b=function(b){return wc.a(b,0)};wc.a=function(b,a){return a<b.length?new xc(b,a):null};wc.w=2;
var K=function K(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return K.b(arguments[0]);case 2:return K.a(arguments[0],arguments[1]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};K.b=function(b){return wc.a(b,0)};K.a=function(b,a){return wc.a(b,a)};K.w=2;Mc;bd;function Xc(b,a,c){this.$b=b;this.s=a;this.v=c;this.g=32374990;this.B=8192}h=Xc.prototype;h.toString=function(){return fc(this)};
h.equiv=function(b){return this.C(null,b)};h.O=function(){return this.v};h.wa=function(){return 0<this.s?new Xc(this.$b,this.s-1,null):null};h.X=function(){return this.s+1};h.T=function(){return Gc(this)};h.C=function(b,a){return Lc.a?Lc.a(this,a):Lc.call(null,this,a)};h.da=function(){var b=zc,a=this.v;return Mc.a?Mc.a(b,a):Mc.call(null,b,a)};h.ea=function(b,a){return bd.a?bd.a(a,this):bd.call(null,a,this)};h.fa=function(b,a,c){return bd.c?bd.c(a,c,this):bd.call(null,a,c,this)};
h.ta=function(){return G.a(this.$b,this.s)};h.xa=function(){return 0<this.s?new Xc(this.$b,this.s-1,null):zc};h.U=function(){return this};h.P=function(b,a){return new Xc(this.$b,this.s,a)};h.W=function(b,a){return Wc.a?Wc.a(a,this):Wc.call(null,a,this)};Xc.prototype[Ra]=function(){return Cc(this)};function dd(b){return M(N(b))}function ed(b){for(;;){var a=N(b);if(null!=a)b=a;else return M(b)}}Cb._=function(b,a){return b===a};
var fd=function fd(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return fd.l();case 1:return fd.b(arguments[0]);case 2:return fd.a(arguments[0],arguments[1]);default:return fd.j(arguments[0],arguments[1],new xc(c.slice(2),0))}};fd.l=function(){return gd};fd.b=function(b){return b};fd.a=function(b,a){return null!=b?bb(b,a):bb(zc,a)};fd.j=function(b,a,c){for(;;)if(x(c))b=fd.a(b,a),a=M(c),c=N(c);else return fd.a(b,a)};
fd.D=function(b){var a=M(b),c=N(b);b=M(c);c=N(c);return fd.j(a,b,c)};fd.w=2;function P(b){if(null!=b)if(null!=b&&(b.g&2||b.Qc))b=b.X(null);else if(Ma(b))b=b.length;else if("string"===typeof b)b=b.length;else if(null!=b&&(b.g&8388608||b.$c))a:{b=L(b);for(var a=0;;){if(Zc(b)){b=a+Xa(b);break a}b=N(b);a+=1}}else b=Xa(b);else b=0;return b}function hd(b,a){for(var c=null;;){if(null==b)return c;if(0===a)return L(b)?M(b):c;if($c(b))return G.c(b,a,c);if(L(b)){var d=N(b),e=a-1;b=d;a=e}else return c}}
function id(b,a){if("number"!==typeof a)throw Error("index argument to nth must be a number");if(null==b)return b;if(null!=b&&(b.g&16||b.xc))return b.ca(null,a);if(Ma(b))return a<b.length?b[a]:null;if("string"===typeof b)return a<b.length?b.charAt(a):null;if(null!=b&&(b.g&64||b.F)){var c;a:{c=b;for(var d=a;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(L(c)){c=M(c);break a}throw Error("Index out of bounds");}if($c(c)){c=G.a(c,d);break a}if(L(c))c=N(c),--d;else throw Error("Index out of bounds");
}}return c}if(Oa(cb,b))return G.a(b,a);throw Error([D("nth not supported on this type "),D(Pa(null==b?null:b.constructor))].join(""));}
function R(b,a){if("number"!==typeof a)throw Error("index argument to nth must be a number.");if(null==b)return null;if(null!=b&&(b.g&16||b.xc))return b.Ea(null,a,null);if(Ma(b))return a<b.length?b[a]:null;if("string"===typeof b)return a<b.length?b.charAt(a):null;if(null!=b&&(b.g&64||b.F))return hd(b,a);if(Oa(cb,b))return G.a(b,a);throw Error([D("nth not supported on this type "),D(Pa(null==b?null:b.constructor))].join(""));}
var J=function J(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return J.a(arguments[0],arguments[1]);case 3:return J.c(arguments[0],arguments[1],arguments[2]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};J.a=function(b,a){return null==b?null:null!=b&&(b.g&256||b.yc)?b.N(null,a):Ma(b)?a<b.length?b[a|0]:null:"string"===typeof b?a<b.length?b[a|0]:null:Oa(hb,b)?ib.a(b,a):null};
J.c=function(b,a,c){return null!=b?null!=b&&(b.g&256||b.yc)?b.I(null,a,c):Ma(b)?a<b.length?b[a]:c:"string"===typeof b?a<b.length?b[a]:c:Oa(hb,b)?ib.c(b,a,c):c:c};J.w=3;jd;var kd=function kd(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return kd.c(arguments[0],arguments[1],arguments[2]);default:return kd.j(arguments[0],arguments[1],arguments[2],new xc(c.slice(3),0))}};kd.c=function(b,a,c){return null!=b?kb(b,a,c):ld([a],[c])};
kd.j=function(b,a,c,d){for(;;)if(b=kd.c(b,a,c),x(d))a=M(d),c=dd(d),d=N(N(d));else return b};kd.D=function(b){var a=M(b),c=N(b);b=M(c);var d=N(c),c=M(d),d=N(d);return kd.j(a,b,c,d)};kd.w=3;var md=function md(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return md.b(arguments[0]);case 2:return md.a(arguments[0],arguments[1]);default:return md.j(arguments[0],arguments[1],new xc(c.slice(2),0))}};md.b=function(b){return b};
md.a=function(b,a){return null==b?null:mb(b,a)};md.j=function(b,a,c){for(;;){if(null==b)return null;b=md.a(b,a);if(x(c))a=M(c),c=N(c);else return b}};md.D=function(b){var a=M(b),c=N(b);b=M(c);c=N(c);return md.j(a,b,c)};md.w=2;function nd(b,a){this.h=b;this.v=a;this.g=393217;this.B=0}h=nd.prototype;h.O=function(){return this.v};h.P=function(b,a){return new nd(this.h,a)};h.Pc=!0;
h.call=function(){function b(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,H,A,I){a=this;return F.wb?F.wb(a.h,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,H,A,I):F.call(null,a.h,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,H,A,I)}function a(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,H,A){a=this;return a.h.qa?a.h.qa(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,H,A):a.h.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,H,A)}function c(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,H){a=this;return a.h.pa?a.h.pa(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,H):
a.h.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,H)}function d(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E){a=this;return a.h.oa?a.h.oa(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E):a.h.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E)}function e(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C){a=this;return a.h.na?a.h.na(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C):a.h.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C)}function f(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z){a=this;return a.h.ma?a.h.ma(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z):a.h.call(null,b,
c,d,e,f,g,k,l,m,n,p,q,r,t,w,z)}function g(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w){a=this;return a.h.la?a.h.la(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w):a.h.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w)}function k(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t){a=this;return a.h.ka?a.h.ka(b,c,d,e,f,g,k,l,m,n,p,q,r,t):a.h.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t)}function l(a,b,c,d,e,f,g,k,l,m,n,p,q,r){a=this;return a.h.ja?a.h.ja(b,c,d,e,f,g,k,l,m,n,p,q,r):a.h.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r)}function m(a,b,c,d,e,f,g,k,l,m,n,p,q){a=this;
return a.h.ia?a.h.ia(b,c,d,e,f,g,k,l,m,n,p,q):a.h.call(null,b,c,d,e,f,g,k,l,m,n,p,q)}function n(a,b,c,d,e,f,g,k,l,m,n,p){a=this;return a.h.ha?a.h.ha(b,c,d,e,f,g,k,l,m,n,p):a.h.call(null,b,c,d,e,f,g,k,l,m,n,p)}function p(a,b,c,d,e,f,g,k,l,m,n){a=this;return a.h.ga?a.h.ga(b,c,d,e,f,g,k,l,m,n):a.h.call(null,b,c,d,e,f,g,k,l,m,n)}function q(a,b,c,d,e,f,g,k,l,m){a=this;return a.h.sa?a.h.sa(b,c,d,e,f,g,k,l,m):a.h.call(null,b,c,d,e,f,g,k,l,m)}function r(a,b,c,d,e,f,g,k,l){a=this;return a.h.ra?a.h.ra(b,c,
d,e,f,g,k,l):a.h.call(null,b,c,d,e,f,g,k,l)}function t(a,b,c,d,e,f,g,k){a=this;return a.h.ba?a.h.ba(b,c,d,e,f,g,k):a.h.call(null,b,c,d,e,f,g,k)}function w(a,b,c,d,e,f,g){a=this;return a.h.aa?a.h.aa(b,c,d,e,f,g):a.h.call(null,b,c,d,e,f,g)}function z(a,b,c,d,e,f){a=this;return a.h.A?a.h.A(b,c,d,e,f):a.h.call(null,b,c,d,e,f)}function C(a,b,c,d,e){a=this;return a.h.o?a.h.o(b,c,d,e):a.h.call(null,b,c,d,e)}function E(a,b,c,d){a=this;return a.h.c?a.h.c(b,c,d):a.h.call(null,b,c,d)}function I(a,b,c){a=this;
return a.h.a?a.h.a(b,c):a.h.call(null,b,c)}function H(a,b){a=this;return a.h.b?a.h.b(b):a.h.call(null,b)}function sa(a){a=this;return a.h.l?a.h.l():a.h.call(null)}var A=null,A=function(ga,ka,Q,S,ba,ca,ha,ja,ma,oa,va,A,ya,Ea,Qa,Za,$a,Ab,Qb,Bc,Rb,cd){switch(arguments.length){case 1:return sa.call(this,ga);case 2:return H.call(this,ga,ka);case 3:return I.call(this,ga,ka,Q);case 4:return E.call(this,ga,ka,Q,S);case 5:return C.call(this,ga,ka,Q,S,ba);case 6:return z.call(this,ga,ka,Q,S,ba,ca);case 7:return w.call(this,
ga,ka,Q,S,ba,ca,ha);case 8:return t.call(this,ga,ka,Q,S,ba,ca,ha,ja);case 9:return r.call(this,ga,ka,Q,S,ba,ca,ha,ja,ma);case 10:return q.call(this,ga,ka,Q,S,ba,ca,ha,ja,ma,oa);case 11:return p.call(this,ga,ka,Q,S,ba,ca,ha,ja,ma,oa,va);case 12:return n.call(this,ga,ka,Q,S,ba,ca,ha,ja,ma,oa,va,A);case 13:return m.call(this,ga,ka,Q,S,ba,ca,ha,ja,ma,oa,va,A,ya);case 14:return l.call(this,ga,ka,Q,S,ba,ca,ha,ja,ma,oa,va,A,ya,Ea);case 15:return k.call(this,ga,ka,Q,S,ba,ca,ha,ja,ma,oa,va,A,ya,Ea,Qa);case 16:return g.call(this,
ga,ka,Q,S,ba,ca,ha,ja,ma,oa,va,A,ya,Ea,Qa,Za);case 17:return f.call(this,ga,ka,Q,S,ba,ca,ha,ja,ma,oa,va,A,ya,Ea,Qa,Za,$a);case 18:return e.call(this,ga,ka,Q,S,ba,ca,ha,ja,ma,oa,va,A,ya,Ea,Qa,Za,$a,Ab);case 19:return d.call(this,ga,ka,Q,S,ba,ca,ha,ja,ma,oa,va,A,ya,Ea,Qa,Za,$a,Ab,Qb);case 20:return c.call(this,ga,ka,Q,S,ba,ca,ha,ja,ma,oa,va,A,ya,Ea,Qa,Za,$a,Ab,Qb,Bc);case 21:return a.call(this,ga,ka,Q,S,ba,ca,ha,ja,ma,oa,va,A,ya,Ea,Qa,Za,$a,Ab,Qb,Bc,Rb);case 22:return b.call(this,ga,ka,Q,S,ba,ca,ha,
ja,ma,oa,va,A,ya,Ea,Qa,Za,$a,Ab,Qb,Bc,Rb,cd)}throw Error("Invalid arity: "+arguments.length);};A.b=sa;A.a=H;A.c=I;A.o=E;A.A=C;A.aa=z;A.ba=w;A.ra=t;A.sa=r;A.ga=q;A.ha=p;A.ia=n;A.ja=m;A.ka=l;A.la=k;A.ma=g;A.na=f;A.oa=e;A.pa=d;A.qa=c;A.Kb=a;A.wb=b;return A}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ta(a)))};h.l=function(){return this.h.l?this.h.l():this.h.call(null)};h.b=function(b){return this.h.b?this.h.b(b):this.h.call(null,b)};
h.a=function(b,a){return this.h.a?this.h.a(b,a):this.h.call(null,b,a)};h.c=function(b,a,c){return this.h.c?this.h.c(b,a,c):this.h.call(null,b,a,c)};h.o=function(b,a,c,d){return this.h.o?this.h.o(b,a,c,d):this.h.call(null,b,a,c,d)};h.A=function(b,a,c,d,e){return this.h.A?this.h.A(b,a,c,d,e):this.h.call(null,b,a,c,d,e)};h.aa=function(b,a,c,d,e,f){return this.h.aa?this.h.aa(b,a,c,d,e,f):this.h.call(null,b,a,c,d,e,f)};
h.ba=function(b,a,c,d,e,f,g){return this.h.ba?this.h.ba(b,a,c,d,e,f,g):this.h.call(null,b,a,c,d,e,f,g)};h.ra=function(b,a,c,d,e,f,g,k){return this.h.ra?this.h.ra(b,a,c,d,e,f,g,k):this.h.call(null,b,a,c,d,e,f,g,k)};h.sa=function(b,a,c,d,e,f,g,k,l){return this.h.sa?this.h.sa(b,a,c,d,e,f,g,k,l):this.h.call(null,b,a,c,d,e,f,g,k,l)};h.ga=function(b,a,c,d,e,f,g,k,l,m){return this.h.ga?this.h.ga(b,a,c,d,e,f,g,k,l,m):this.h.call(null,b,a,c,d,e,f,g,k,l,m)};
h.ha=function(b,a,c,d,e,f,g,k,l,m,n){return this.h.ha?this.h.ha(b,a,c,d,e,f,g,k,l,m,n):this.h.call(null,b,a,c,d,e,f,g,k,l,m,n)};h.ia=function(b,a,c,d,e,f,g,k,l,m,n,p){return this.h.ia?this.h.ia(b,a,c,d,e,f,g,k,l,m,n,p):this.h.call(null,b,a,c,d,e,f,g,k,l,m,n,p)};h.ja=function(b,a,c,d,e,f,g,k,l,m,n,p,q){return this.h.ja?this.h.ja(b,a,c,d,e,f,g,k,l,m,n,p,q):this.h.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q)};
h.ka=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r){return this.h.ka?this.h.ka(b,a,c,d,e,f,g,k,l,m,n,p,q,r):this.h.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r)};h.la=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t){return this.h.la?this.h.la(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t):this.h.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t)};h.ma=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w){return this.h.ma?this.h.ma(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w):this.h.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w)};
h.na=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z){return this.h.na?this.h.na(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z):this.h.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z)};h.oa=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C){return this.h.oa?this.h.oa(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C):this.h.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C)};
h.pa=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E){return this.h.pa?this.h.pa(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E):this.h.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E)};h.qa=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,I){return this.h.qa?this.h.qa(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,I):this.h.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,I)};
h.Kb=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,I,H){return F.wb?F.wb(this.h,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,I,H):F.call(null,this.h,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,I,H)};function Mc(b,a){return ea(b)?new nd(b,a):null==b?null:xb(b,a)}function od(b){var a=null!=b;return(a?null!=b?b.g&131072||b.Wc||(b.g?0:Oa(vb,b)):Oa(vb,b):a)?wb(b):null}function pd(b){return null==b||Na(L(b))}function qd(b){return null==b?!1:null!=b?b.g&4096||b.Bd?!0:b.g?!1:Oa(qb,b):Oa(qb,b)}
function rd(b){return null!=b?b.g&16777216||b.Ad?!0:b.g?!1:Oa(Gb,b):Oa(Gb,b)}function sd(b){return null==b?!1:null!=b?b.g&1024||b.Uc?!0:b.g?!1:Oa(lb,b):Oa(lb,b)}function td(b){return null!=b?b.g&16384||b.Cd?!0:b.g?!1:Oa(sb,b):Oa(sb,b)}ud;vd;function wd(b){return null!=b?b.B&512||b.vd?!0:!1:!1}function xd(b){var a=[];qa(b,function(a,b){return function(a,c){return b.push(c)}}(b,a));return a}function yd(b,a,c,d,e){for(;0!==e;)c[d]=b[a],d+=1,--e,a+=1}var zd={};
function Ad(b){return null==b?!1:null!=b?b.g&64||b.F?!0:b.g?!1:Oa(db,b):Oa(db,b)}function Bd(b){return null==b?!1:!1===b?!1:!0}function Cd(b,a){return J.c(b,a,zd)===zd?!1:!0}
function oc(b,a){if(b===a)return 0;if(null==b)return-1;if(null==a)return 1;if("number"===typeof b){if("number"===typeof a)return ta(b,a);throw Error([D("Cannot compare "),D(b),D(" to "),D(a)].join(""));}if(null!=b?b.B&2048||b.Ib||(b.B?0:Oa(Ub,b)):Oa(Ub,b))return Vb(b,a);if("string"!==typeof b&&!Ma(b)&&!0!==b&&!1!==b||(null==b?null:b.constructor)!==(null==a?null:a.constructor))throw Error([D("Cannot compare "),D(b),D(" to "),D(a)].join(""));return ta(b,a)}
function Dd(b,a){var c=P(b),d=P(a);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=oc(id(b,d),id(a,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}Ed;var bd=function bd(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return bd.a(arguments[0],arguments[1]);case 3:return bd.c(arguments[0],arguments[1],arguments[2]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};
bd.a=function(b,a){var c=L(a);if(c){var d=M(c),c=N(c);return Ua.c?Ua.c(b,d,c):Ua.call(null,b,d,c)}return b.l?b.l():b.call(null)};bd.c=function(b,a,c){for(c=L(c);;)if(c){var d=M(c);a=b.a?b.a(a,d):b.call(null,a,d);if(Pc(a))return ub(a);c=N(c)}else return a};bd.w=3;Fd;
var Ua=function Ua(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ua.a(arguments[0],arguments[1]);case 3:return Ua.c(arguments[0],arguments[1],arguments[2]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};Ua.a=function(b,a){return null!=a&&(a.g&524288||a.Yc)?a.ea(null,b):Ma(a)?Sc(a,b):"string"===typeof a?Sc(a,b):Oa(yb,a)?zb.a(a,b):bd.a(b,a)};
Ua.c=function(b,a,c){return null!=c&&(c.g&524288||c.Yc)?c.fa(null,b,a):Ma(c)?Tc(c,b,a):"string"===typeof c?Tc(c,b,a):Oa(yb,c)?zb.c(c,b,a):bd.c(b,a,c)};Ua.w=3;function Gd(b){return b}function Hd(b,a,c,d){b=b.b?b.b(a):b.call(null,a);c=Ua.c(b,c,d);return b.b?b.b(c):b.call(null,c)}
var Id=function Id(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Id.l();case 1:return Id.b(arguments[0]);case 2:return Id.a(arguments[0],arguments[1]);default:return Id.j(arguments[0],arguments[1],new xc(c.slice(2),0))}};Id.l=function(){return 0};Id.b=function(b){return b};Id.a=function(b,a){return b+a};Id.j=function(b,a,c){return Ua.c(Id,b+a,c)};Id.D=function(b){var a=M(b),c=N(b);b=M(c);c=N(c);return Id.j(a,b,c)};Id.w=2;
var Jd=function Jd(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Jd.l();case 1:return Jd.b(arguments[0]);case 2:return Jd.a(arguments[0],arguments[1]);default:return Jd.j(arguments[0],arguments[1],new xc(c.slice(2),0))}};Jd.l=function(){return 1};Jd.b=function(b){return b};Jd.a=function(b,a){return b*a};Jd.j=function(b,a,c){return Ua.c(Jd,b*a,c)};Jd.D=function(b){var a=M(b),c=N(b);b=M(c);c=N(c);return Jd.j(a,b,c)};Jd.w=2;ua.Id;
var Kd=function Kd(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Kd.b(arguments[0]);case 2:return Kd.a(arguments[0],arguments[1]);default:return Kd.j(arguments[0],arguments[1],new xc(c.slice(2),0))}};Kd.b=function(b){return 1/b};Kd.a=function(b,a){return b/a};Kd.j=function(b,a,c){return Ua.c(Kd,b/a,c)};Kd.D=function(b){var a=M(b),c=N(b);b=M(c);c=N(c);return Kd.j(a,b,c)};Kd.w=2;function Ld(b){return b-1}
var Md=function Md(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Md.b(arguments[0]);case 2:return Md.a(arguments[0],arguments[1]);default:return Md.j(arguments[0],arguments[1],new xc(c.slice(2),0))}};Md.b=function(b){return b};Md.a=function(b,a){return b>a?b:a};Md.j=function(b,a,c){return Ua.c(Md,b>a?b:a,c)};Md.D=function(b){var a=M(b),c=N(b);b=M(c);c=N(c);return Md.j(a,b,c)};Md.w=2;
var Nd=function Nd(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Nd.b(arguments[0]);case 2:return Nd.a(arguments[0],arguments[1]);default:return Nd.j(arguments[0],arguments[1],new xc(c.slice(2),0))}};Nd.b=function(b){return b};Nd.a=function(b,a){return b<a?b:a};Nd.j=function(b,a,c){return Ua.c(Nd,b<a?b:a,c)};Nd.D=function(b){var a=M(b),c=N(b);b=M(c);c=N(c);return Nd.j(a,b,c)};Nd.w=2;Od;function Od(b,a){return(b%a+a)%a}
function Pd(b){b=(b-b%2)/2;return 0<=b?Math.floor(b):Math.ceil(b)}function Qd(b){b-=b>>1&1431655765;b=(b&858993459)+(b>>2&858993459);return 16843009*(b+(b>>4)&252645135)>>24}function Rd(b,a){for(var c=a,d=L(b);;)if(d&&0<c)--c,d=N(d);else return d}var D=function D(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return D.l();case 1:return D.b(arguments[0]);default:return D.j(arguments[0],new xc(c.slice(1),0))}};D.l=function(){return""};
D.b=function(b){return null==b?"":""+b};D.j=function(b,a){for(var c=new ra(""+D(b)),d=a;;)if(x(d))c=c.append(""+D(M(d))),d=N(d);else return c.toString()};D.D=function(b){var a=M(b);b=N(b);return D.j(a,b)};D.w=1;T;Sd;function Lc(b,a){var c;if(rd(a))if(Zc(b)&&Zc(a)&&P(b)!==P(a))c=!1;else a:{c=L(b);for(var d=L(a);;){if(null==c){c=null==d;break a}if(null!=d&&nc.a(M(c),M(d)))c=N(c),d=N(d);else{c=!1;break a}}}else c=null;return Bd(c)}
function Vc(b){if(L(b)){var a=sc(M(b));for(b=N(b);;){if(null==b)return a;a=tc(a,sc(M(b)));b=N(b)}}else return 0}Td;Ud;function Vd(b){var a=0;for(b=L(b);;)if(b){var c=M(b),a=(a+(sc(Td.b?Td.b(c):Td.call(null,c))^sc(Ud.b?Ud.b(c):Ud.call(null,c))))%4503599627370496;b=N(b)}else return a}Sd;Wd;Xd;function Yc(b,a,c,d,e){this.v=b;this.first=a;this.Ca=c;this.count=d;this.u=e;this.g=65937646;this.B=8192}h=Yc.prototype;h.toString=function(){return fc(this)};h.equiv=function(b){return this.C(null,b)};h.O=function(){return this.v};
h.wa=function(){return 1===this.count?null:this.Ca};h.X=function(){return this.count};h.jb=function(){return this.first};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Gc(this)};h.C=function(b,a){return Lc(this,a)};h.da=function(){return xb(zc,this.v)};h.ea=function(b,a){return bd.a(a,this)};h.fa=function(b,a,c){return bd.c(a,c,this)};h.ta=function(){return this.first};h.xa=function(){return 1===this.count?zc:this.Ca};h.U=function(){return this};
h.P=function(b,a){return new Yc(a,this.first,this.Ca,this.count,this.u)};h.W=function(b,a){return new Yc(this.v,a,this,this.count+1,null)};function Yd(b){return null!=b?b.g&33554432||b.yd?!0:b.g?!1:Oa(Hb,b):Oa(Hb,b)}Yc.prototype[Ra]=function(){return Cc(this)};function Zd(b){this.v=b;this.g=65937614;this.B=8192}h=Zd.prototype;h.toString=function(){return fc(this)};h.equiv=function(b){return this.C(null,b)};h.O=function(){return this.v};h.wa=function(){return null};h.X=function(){return 0};h.jb=function(){return null};
h.T=function(){return Hc};h.C=function(b,a){return Yd(a)||rd(a)?null==L(a):!1};h.da=function(){return this};h.ea=function(b,a){return bd.a(a,this)};h.fa=function(b,a,c){return bd.c(a,c,this)};h.ta=function(){return null};h.xa=function(){return zc};h.U=function(){return null};h.P=function(b,a){return new Zd(a)};h.W=function(b,a){return new Yc(this.v,a,null,1,null)};var zc=new Zd(null);Zd.prototype[Ra]=function(){return Cc(this)};
function $d(b){return(null!=b?b.g&134217728||b.zd||(b.g?0:Oa(Ib,b)):Oa(Ib,b))?Jb(b):Ua.c(fd,zc,b)}var lc=function lc(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return lc.j(0<c.length?new xc(c.slice(0),0):null)};lc.j=function(b){var a;if(b instanceof xc&&0===b.s)a=b.f;else a:for(a=[];;)if(null!=b)a.push(b.ta(null)),b=b.wa(null);else break a;b=a.length;for(var c=zc;;)if(0<b){var d=b-1,c=c.W(null,a[b-1]);b=d}else return c};lc.w=0;lc.D=function(b){return lc.j(L(b))};
function ae(b,a,c,d){this.v=b;this.first=a;this.Ca=c;this.u=d;this.g=65929452;this.B=8192}h=ae.prototype;h.toString=function(){return fc(this)};h.equiv=function(b){return this.C(null,b)};h.O=function(){return this.v};h.wa=function(){return null==this.Ca?null:L(this.Ca)};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Gc(this)};h.C=function(b,a){return Lc(this,a)};h.da=function(){return Mc(zc,this.v)};h.ea=function(b,a){return bd.a(a,this)};h.fa=function(b,a,c){return bd.c(a,c,this)};h.ta=function(){return this.first};
h.xa=function(){return null==this.Ca?zc:this.Ca};h.U=function(){return this};h.P=function(b,a){return new ae(a,this.first,this.Ca,this.u)};h.W=function(b,a){return new ae(null,a,this,this.u)};ae.prototype[Ra]=function(){return Cc(this)};function Wc(b,a){var c=null==a;return(c?c:null!=a&&(a.g&64||a.F))?new ae(null,b,a,null):new ae(null,b,L(a),null)}
function be(b,a){if(b.Ha===a.Ha)return 0;var c=Na(b.Ba);if(x(c?a.Ba:c))return-1;if(x(b.Ba)){if(Na(a.Ba))return 1;c=ta(b.Ba,a.Ba);return 0===c?ta(b.name,a.name):c}return ta(b.name,a.name)}function y(b,a,c,d){this.Ba=b;this.name=a;this.Ha=c;this.tb=d;this.g=2153775105;this.B=4096}h=y.prototype;h.toString=function(){return[D(":"),D(this.Ha)].join("")};h.equiv=function(b){return this.C(null,b)};h.C=function(b,a){return a instanceof y?this.Ha===a.Ha:!1};
h.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return J.a(b,this);case 3:return J.c(b,this,d)}throw Error("Invalid arity: "+arguments.length);};b.a=function(a,b){return J.a(b,this)};b.c=function(a,b,d){return J.c(b,this,d)};return b}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ta(a)))};h.b=function(b){return J.a(b,this)};h.a=function(b,a){return J.c(b,this,a)};
h.T=function(){var b=this.tb;return null!=b?b:this.tb=b=tc(kc(this.name),rc(this.Ba))+2654435769|0};h.Ob=function(){return this.name};h.Pb=function(){return this.Ba};h.M=function(b,a){return Kb(a,[D(":"),D(this.Ha)].join(""))};function U(b,a){return b===a?!0:b instanceof y&&a instanceof y?b.Ha===a.Ha:!1}
var ce=function ce(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ce.b(arguments[0]);case 2:return ce.a(arguments[0],arguments[1]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};
ce.b=function(b){if(b instanceof y)return b;if(b instanceof mc){var a;if(null!=b&&(b.B&4096||b.Xc))a=b.Pb(null);else throw Error([D("Doesn't support namespace: "),D(b)].join(""));return new y(a,Sd.b?Sd.b(b):Sd.call(null,b),b.$a,null)}return"string"===typeof b?(a=b.split("/"),2===a.length?new y(a[0],a[1],b,null):new y(null,a[0],b,null)):null};ce.a=function(b,a){return new y(b,a,[D(x(b)?[D(b),D("/")].join(""):null),D(a)].join(""),null)};ce.w=2;
function de(b,a,c,d){this.v=b;this.Cb=a;this.J=c;this.u=d;this.g=32374988;this.B=0}h=de.prototype;h.toString=function(){return fc(this)};h.equiv=function(b){return this.C(null,b)};function ee(b){null!=b.Cb&&(b.J=b.Cb.l?b.Cb.l():b.Cb.call(null),b.Cb=null);return b.J}h.O=function(){return this.v};h.wa=function(){Fb(this);return null==this.J?null:N(this.J)};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Gc(this)};h.C=function(b,a){return Lc(this,a)};h.da=function(){return Mc(zc,this.v)};
h.ea=function(b,a){return bd.a(a,this)};h.fa=function(b,a,c){return bd.c(a,c,this)};h.ta=function(){Fb(this);return null==this.J?null:M(this.J)};h.xa=function(){Fb(this);return null!=this.J?yc(this.J):zc};h.U=function(){ee(this);if(null==this.J)return null;for(var b=this.J;;)if(b instanceof de)b=ee(b);else return this.J=b,L(this.J)};h.P=function(b,a){return new de(a,this.Cb,this.J,this.u)};h.W=function(b,a){return Wc(a,this)};de.prototype[Ra]=function(){return Cc(this)};fe;
function ge(b,a){this.L=b;this.end=a;this.g=2;this.B=0}ge.prototype.add=function(b){this.L[this.end]=b;return this.end+=1};ge.prototype.$=function(){var b=new fe(this.L,0,this.end);this.L=null;return b};ge.prototype.X=function(){return this.end};function he(b){return new ge(Array(b),0)}function fe(b,a,c){this.f=b;this.ua=a;this.end=c;this.g=524306;this.B=0}h=fe.prototype;h.X=function(){return this.end-this.ua};h.ca=function(b,a){return this.f[this.ua+a]};
h.Ea=function(b,a,c){return 0<=a&&a<this.end-this.ua?this.f[this.ua+a]:c};h.wc=function(){if(this.ua===this.end)throw Error("-drop-first of empty chunk");return new fe(this.f,this.ua+1,this.end)};h.ea=function(b,a){return Uc(this.f,a,this.f[this.ua],this.ua+1)};h.fa=function(b,a,c){return Uc(this.f,a,c,this.ua)};function ud(b,a,c,d){this.$=b;this.Wa=a;this.v=c;this.u=d;this.g=31850732;this.B=1536}h=ud.prototype;h.toString=function(){return fc(this)};h.equiv=function(b){return this.C(null,b)};
h.O=function(){return this.v};h.wa=function(){if(1<Xa(this.$))return new ud(Wb(this.$),this.Wa,this.v,null);var b=Fb(this.Wa);return null==b?null:b};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Gc(this)};h.C=function(b,a){return Lc(this,a)};h.da=function(){return Mc(zc,this.v)};h.ta=function(){return G.a(this.$,0)};h.xa=function(){return 1<Xa(this.$)?new ud(Wb(this.$),this.Wa,this.v,null):null==this.Wa?zc:this.Wa};h.U=function(){return this};h.nc=function(){return this.$};
h.oc=function(){return null==this.Wa?zc:this.Wa};h.P=function(b,a){return new ud(this.$,this.Wa,a,this.u)};h.W=function(b,a){return Wc(a,this)};h.mc=function(){return null==this.Wa?null:this.Wa};ud.prototype[Ra]=function(){return Cc(this)};function ie(b,a){return 0===Xa(b)?a:new ud(b,a,null,null)}function je(b,a){b.add(a)}function Wd(b){return Xb(b)}function Xd(b){return Yb(b)}function Ed(b){for(var a=[];;)if(L(b))a.push(M(b)),b=N(b);else return a}
function ke(b){if("number"===typeof b)a:{var a=Array(b);if(Ad(null))for(var c=0,d=L(null);;)if(d&&c<b)a[c]=M(d),c+=1,d=N(d);else{b=a;break a}else{for(c=0;;)if(c<b)a[c]=null,c+=1;else break;b=a}}else b=Ja.b(b);return b}function le(b,a){if(Zc(b))return P(b);for(var c=b,d=a,e=0;;)if(0<d&&L(c))c=N(c),--d,e+=1;else return e}
var me=function me(a){return null==a?null:null==N(a)?L(M(a)):Wc(M(a),me(N(a)))},ne=function ne(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return ne.l();case 1:return ne.b(arguments[0]);case 2:return ne.a(arguments[0],arguments[1]);default:return ne.j(arguments[0],arguments[1],new xc(c.slice(2),0))}};ne.l=function(){return new de(null,function(){return null},null,null)};ne.b=function(b){return new de(null,function(){return b},null,null)};
ne.a=function(b,a){return new de(null,function(){var c=L(b);return c?wd(c)?ie(Xb(c),ne.a(Yb(c),a)):Wc(M(c),ne.a(yc(c),a)):a},null,null)};ne.j=function(b,a,c){return function e(a,b){return new de(null,function(){var c=L(a);return c?wd(c)?ie(Xb(c),e(Yb(c),b)):Wc(M(c),e(yc(c),b)):x(b)?e(M(b),N(b)):null},null,null)}(ne.a(b,a),c)};ne.D=function(b){var a=M(b),c=N(b);b=M(c);c=N(c);return ne.j(a,b,c)};ne.w=2;function oe(b){return Pb(b)}
var pe=function pe(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return pe.l();case 1:return pe.b(arguments[0]);case 2:return pe.a(arguments[0],arguments[1]);default:return pe.j(arguments[0],arguments[1],new xc(c.slice(2),0))}};pe.l=function(){return Nb(gd)};pe.b=function(b){return b};pe.a=function(b,a){return Ob(b,a)};pe.j=function(b,a,c){for(;;)if(b=Ob(b,a),x(c))a=M(c),c=N(c);else return b};
pe.D=function(b){var a=M(b),c=N(b);b=M(c);c=N(c);return pe.j(a,b,c)};pe.w=2;
function qe(b,a,c){var d=L(c);if(0===a)return b.l?b.l():b.call(null);c=eb(d);var e=fb(d);if(1===a)return b.b?b.b(c):b.b?b.b(c):b.call(null,c);var d=eb(e),f=fb(e);if(2===a)return b.a?b.a(c,d):b.a?b.a(c,d):b.call(null,c,d);var e=eb(f),g=fb(f);if(3===a)return b.c?b.c(c,d,e):b.c?b.c(c,d,e):b.call(null,c,d,e);var f=eb(g),k=fb(g);if(4===a)return b.o?b.o(c,d,e,f):b.o?b.o(c,d,e,f):b.call(null,c,d,e,f);var g=eb(k),l=fb(k);if(5===a)return b.A?b.A(c,d,e,f,g):b.A?b.A(c,d,e,f,g):b.call(null,c,d,e,f,g);var k=eb(l),
m=fb(l);if(6===a)return b.aa?b.aa(c,d,e,f,g,k):b.aa?b.aa(c,d,e,f,g,k):b.call(null,c,d,e,f,g,k);var l=eb(m),n=fb(m);if(7===a)return b.ba?b.ba(c,d,e,f,g,k,l):b.ba?b.ba(c,d,e,f,g,k,l):b.call(null,c,d,e,f,g,k,l);var m=eb(n),p=fb(n);if(8===a)return b.ra?b.ra(c,d,e,f,g,k,l,m):b.ra?b.ra(c,d,e,f,g,k,l,m):b.call(null,c,d,e,f,g,k,l,m);var n=eb(p),q=fb(p);if(9===a)return b.sa?b.sa(c,d,e,f,g,k,l,m,n):b.sa?b.sa(c,d,e,f,g,k,l,m,n):b.call(null,c,d,e,f,g,k,l,m,n);var p=eb(q),r=fb(q);if(10===a)return b.ga?b.ga(c,
d,e,f,g,k,l,m,n,p):b.ga?b.ga(c,d,e,f,g,k,l,m,n,p):b.call(null,c,d,e,f,g,k,l,m,n,p);var q=eb(r),t=fb(r);if(11===a)return b.ha?b.ha(c,d,e,f,g,k,l,m,n,p,q):b.ha?b.ha(c,d,e,f,g,k,l,m,n,p,q):b.call(null,c,d,e,f,g,k,l,m,n,p,q);var r=eb(t),w=fb(t);if(12===a)return b.ia?b.ia(c,d,e,f,g,k,l,m,n,p,q,r):b.ia?b.ia(c,d,e,f,g,k,l,m,n,p,q,r):b.call(null,c,d,e,f,g,k,l,m,n,p,q,r);var t=eb(w),z=fb(w);if(13===a)return b.ja?b.ja(c,d,e,f,g,k,l,m,n,p,q,r,t):b.ja?b.ja(c,d,e,f,g,k,l,m,n,p,q,r,t):b.call(null,c,d,e,f,g,k,l,
m,n,p,q,r,t);var w=eb(z),C=fb(z);if(14===a)return b.ka?b.ka(c,d,e,f,g,k,l,m,n,p,q,r,t,w):b.ka?b.ka(c,d,e,f,g,k,l,m,n,p,q,r,t,w):b.call(null,c,d,e,f,g,k,l,m,n,p,q,r,t,w);var z=eb(C),E=fb(C);if(15===a)return b.la?b.la(c,d,e,f,g,k,l,m,n,p,q,r,t,w,z):b.la?b.la(c,d,e,f,g,k,l,m,n,p,q,r,t,w,z):b.call(null,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z);var C=eb(E),I=fb(E);if(16===a)return b.ma?b.ma(c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C):b.ma?b.ma(c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C):b.call(null,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C);var E=
eb(I),H=fb(I);if(17===a)return b.na?b.na(c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E):b.na?b.na(c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E):b.call(null,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E);var I=eb(H),sa=fb(H);if(18===a)return b.oa?b.oa(c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,I):b.oa?b.oa(c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,I):b.call(null,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,I);H=eb(sa);sa=fb(sa);if(19===a)return b.pa?b.pa(c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,I,H):b.pa?b.pa(c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,I,H):b.call(null,c,d,e,
f,g,k,l,m,n,p,q,r,t,w,z,C,E,I,H);var A=eb(sa);fb(sa);if(20===a)return b.qa?b.qa(c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,I,H,A):b.qa?b.qa(c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,I,H,A):b.call(null,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,I,H,A);throw Error("Only up to 20 arguments supported on functions");}
var F=function F(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return F.a(arguments[0],arguments[1]);case 3:return F.c(arguments[0],arguments[1],arguments[2]);case 4:return F.o(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return F.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return F.j(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new xc(c.slice(5),0))}};
F.a=function(b,a){var c=b.w;if(b.D){var d=le(a,c+1);return d<=c?qe(b,d,a):b.D(a)}return b.apply(b,Ed(a))};F.c=function(b,a,c){a=Wc(a,c);c=b.w;if(b.D){var d=le(a,c+1);return d<=c?qe(b,d,a):b.D(a)}return b.apply(b,Ed(a))};F.o=function(b,a,c,d){a=Wc(a,Wc(c,d));c=b.w;return b.D?(d=le(a,c+1),d<=c?qe(b,d,a):b.D(a)):b.apply(b,Ed(a))};F.A=function(b,a,c,d,e){a=Wc(a,Wc(c,Wc(d,e)));c=b.w;return b.D?(d=le(a,c+1),d<=c?qe(b,d,a):b.D(a)):b.apply(b,Ed(a))};
F.j=function(b,a,c,d,e,f){a=Wc(a,Wc(c,Wc(d,Wc(e,me(f)))));c=b.w;return b.D?(d=le(a,c+1),d<=c?qe(b,d,a):b.D(a)):b.apply(b,Ed(a))};F.D=function(b){var a=M(b),c=N(b);b=M(c);var d=N(c),c=M(d),e=N(d),d=M(e),f=N(e),e=M(f),f=N(f);return F.j(a,b,c,d,e,f)};F.w=5;function re(b){return L(b)?b:null}
var se=function se(){"undefined"===typeof wa&&(wa=function(a,c){this.od=a;this.nd=c;this.g=393216;this.B=0},wa.prototype.P=function(a,c){return new wa(this.od,c)},wa.prototype.O=function(){return this.nd},wa.prototype.ya=function(){return!1},wa.prototype.next=function(){return Error("No such element")},wa.prototype.remove=function(){return Error("Unsupported operation")},wa.ic=function(){return new V(null,2,5,W,[Mc(te,new v(null,1,[ue,lc(ve,lc(gd))],null)),ua.Hd],null)},wa.xb=!0,wa.eb="cljs.core/t_cljs$core23323",
wa.Tb=function(a,c){return Kb(c,"cljs.core/t_cljs$core23323")});return new wa(se,we)};xe;function xe(b,a,c,d){this.Fb=b;this.first=a;this.Ca=c;this.v=d;this.g=31719628;this.B=0}h=xe.prototype;h.P=function(b,a){return new xe(this.Fb,this.first,this.Ca,a)};h.W=function(b,a){return Wc(a,Fb(this))};h.da=function(){return zc};h.C=function(b,a){return null!=Fb(this)?Lc(this,a):rd(a)&&null==L(a)};h.T=function(){return Gc(this)};h.U=function(){null!=this.Fb&&this.Fb.step(this);return null==this.Ca?null:this};
h.ta=function(){null!=this.Fb&&Fb(this);return null==this.Ca?null:this.first};h.xa=function(){null!=this.Fb&&Fb(this);return null==this.Ca?zc:this.Ca};h.wa=function(){null!=this.Fb&&Fb(this);return null==this.Ca?null:Fb(this.Ca)};xe.prototype[Ra]=function(){return Cc(this)};function ye(b,a){for(;;){if(null==L(a))return!0;var c;c=M(a);c=b.b?b.b(c):b.call(null,c);if(x(c)){c=b;var d=N(a);b=c;a=d}else return!1}}
function ze(b,a){for(;;)if(L(a)){var c;c=M(a);c=b.b?b.b(c):b.call(null,c);if(x(c))return c;c=b;var d=N(a);b=c;a=d}else return null}
function Ae(b){return function(){function a(a,c){return Na(b.a?b.a(a,c):b.call(null,a,c))}function c(a){return Na(b.b?b.b(a):b.call(null,a))}function d(){return Na(b.l?b.l():b.call(null))}var e=null,f=function(){function a(b,d,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new xc(g,0)}return c.call(this,b,d,f)}function c(a,d,e){return Na(F.o(b,a,d,e))}a.w=2;a.D=function(a){var b=M(a);a=N(a);var d=M(a);a=yc(a);return c(b,d,a)};a.j=
c;return a}(),e=function(b,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,b);case 2:return a.call(this,b,e);default:var m=null;if(2<arguments.length){for(var m=0,n=Array(arguments.length-2);m<n.length;)n[m]=arguments[m+2],++m;m=new xc(n,0)}return f.j(b,e,m)}throw Error("Invalid arity: "+arguments.length);};e.w=2;e.D=f.D;e.l=d;e.b=c;e.a=a;e.j=f.j;return e}()}
function Be(b){return function(){function a(a){if(0<arguments.length)for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;return b}a.w=0;a.D=function(a){L(a);return b};a.j=function(){return b};return a}()}
var Ce=function Ce(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Ce.l();case 1:return Ce.b(arguments[0]);case 2:return Ce.a(arguments[0],arguments[1]);case 3:return Ce.c(arguments[0],arguments[1],arguments[2]);default:return Ce.j(arguments[0],arguments[1],arguments[2],new xc(c.slice(3),0))}};Ce.l=function(){return Gd};Ce.b=function(b){return b};
Ce.a=function(b,a){return function(){function c(c,d,e){c=a.c?a.c(c,d,e):a.call(null,c,d,e);return b.b?b.b(c):b.call(null,c)}function d(c,d){var e=a.a?a.a(c,d):a.call(null,c,d);return b.b?b.b(e):b.call(null,e)}function e(c){c=a.b?a.b(c):a.call(null,c);return b.b?b.b(c):b.call(null,c)}function f(){var c=a.l?a.l():a.call(null);return b.b?b.b(c):b.call(null,c)}var g=null,k=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,k=Array(arguments.length-3);g<k.length;)k[g]=arguments[g+
3],++g;g=new xc(k,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){c=F.A(a,c,e,f,g);return b.b?b.b(c):b.call(null,c)}c.w=3;c.D=function(a){var b=M(a);a=N(a);var c=M(a);a=N(a);var e=M(a);a=yc(a);return d(b,c,e,a)};c.j=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+
3],++q;q=new xc(r,0)}return k.j(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.D=k.D;g.l=f;g.b=e;g.a=d;g.c=c;g.j=k.j;return g}()};
Ce.c=function(b,a,c){return function(){function d(d,e,f){d=c.c?c.c(d,e,f):c.call(null,d,e,f);d=a.b?a.b(d):a.call(null,d);return b.b?b.b(d):b.call(null,d)}function e(d,e){var f;f=c.a?c.a(d,e):c.call(null,d,e);f=a.b?a.b(f):a.call(null,f);return b.b?b.b(f):b.call(null,f)}function f(d){d=c.b?c.b(d):c.call(null,d);d=a.b?a.b(d):a.call(null,d);return b.b?b.b(d):b.call(null,d)}function g(){var d;d=c.l?c.l():c.call(null);d=a.b?a.b(d):a.call(null,d);return b.b?b.b(d):b.call(null,d)}var k=null,l=function(){function d(a,
b,c,f){var g=null;if(3<arguments.length){for(var g=0,k=Array(arguments.length-3);g<k.length;)k[g]=arguments[g+3],++g;g=new xc(k,0)}return e.call(this,a,b,c,g)}function e(d,f,g,k){d=F.A(c,d,f,g,k);d=a.b?a.b(d):a.call(null,d);return b.b?b.b(d):b.call(null,d)}d.w=3;d.D=function(a){var b=M(a);a=N(a);var c=M(a);a=N(a);var d=M(a);a=yc(a);return e(b,c,d,a)};d.j=e;return d}(),k=function(a,b,c,k){switch(arguments.length){case 0:return g.call(this);case 1:return f.call(this,a);case 2:return e.call(this,a,b);
case 3:return d.call(this,a,b,c);default:var r=null;if(3<arguments.length){for(var r=0,t=Array(arguments.length-3);r<t.length;)t[r]=arguments[r+3],++r;r=new xc(t,0)}return l.j(a,b,c,r)}throw Error("Invalid arity: "+arguments.length);};k.w=3;k.D=l.D;k.l=g;k.b=f;k.a=e;k.c=d;k.j=l.j;return k}()};
Ce.j=function(b,a,c,d){return function(a){return function(){function b(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new xc(e,0)}return c.call(this,d)}function c(b){b=F.a(M(a),b);for(var d=N(a);;)if(d)b=M(d).call(null,b),d=N(d);else return b}b.w=0;b.D=function(a){a=L(a);return c(a)};b.j=c;return b}()}($d(Wc(b,Wc(a,Wc(c,d)))))};Ce.D=function(b){var a=M(b),c=N(b);b=M(c);var d=N(c),c=M(d),d=N(d);return Ce.j(a,b,c,d)};Ce.w=3;
function De(b,a){return function(){function c(c,d,e){return b.o?b.o(a,c,d,e):b.call(null,a,c,d,e)}function d(c,d){return b.c?b.c(a,c,d):b.call(null,a,c,d)}function e(c){return b.a?b.a(a,c):b.call(null,a,c)}function f(){return b.b?b.b(a):b.call(null,a)}var g=null,k=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,k=Array(arguments.length-3);g<k.length;)k[g]=arguments[g+3],++g;g=new xc(k,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){return F.j(b,a,c,e,f,K([g],0))}c.w=
3;c.D=function(a){var b=M(a);a=N(a);var c=M(a);a=N(a);var e=M(a);a=yc(a);return d(b,c,e,a)};c.j=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+3],++q;q=new xc(r,0)}return k.j(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.D=k.D;g.l=f;g.b=
e;g.a=d;g.c=c;g.j=k.j;return g}()}Ee;function Fe(b,a){return function d(a,f){return new de(null,function(){var g=L(f);if(g){if(wd(g)){for(var k=Xb(g),l=P(k),m=he(l),n=0;;)if(n<l)je(m,function(){var d=a+n,f=G.a(k,n);return b.a?b.a(d,f):b.call(null,d,f)}()),n+=1;else break;return ie(m.$(),d(a+l,Yb(g)))}return Wc(function(){var d=M(g);return b.a?b.a(a,d):b.call(null,a,d)}(),d(a+1,yc(g)))}return null},null,null)}(0,a)}function Ge(b,a,c,d){this.state=b;this.v=a;this.Nc=d;this.B=16386;this.g=6455296}
h=Ge.prototype;h.equiv=function(b){return this.C(null,b)};h.C=function(b,a){return this===a};h.Jb=function(){return this.state};h.O=function(){return this.v};h.Ac=function(b,a,c){b=L(this.Nc);for(var d=null,e=0,f=0;;)if(f<e){var g=d.ca(null,f),k=R(g,0),g=R(g,1);g.o?g.o(k,this,a,c):g.call(null,k,this,a,c);f+=1}else if(b=L(b))wd(b)?(d=Xb(b),b=Yb(b),k=d,e=P(d),d=k):(d=M(b),k=R(d,0),g=R(d,1),g.o?g.o(k,this,a,c):g.call(null,k,this,a,c),b=N(b),d=null,e=0),f=0;else return null};
h.T=function(){return this[fa]||(this[fa]=++ia)};var X=function X(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return X.b(arguments[0]);default:return X.j(arguments[0],new xc(c.slice(1),0))}};X.b=function(b){return new Ge(b,null,0,null)};X.j=function(b,a){var c=null!=a&&(a.g&64||a.F)?F.a(Kc,a):a,d=J.a(c,Ga);J.a(c,He);return new Ge(b,d,0,null)};X.D=function(b){var a=M(b);b=N(b);return X.j(a,b)};X.w=1;Ie;
function Je(b,a){if(b instanceof Ge){var c=b.state;b.state=a;null!=b.Nc&&Mb(b,c,a);return a}return bc(b,a)}var Ke=function Ke(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ke.a(arguments[0],arguments[1]);case 3:return Ke.c(arguments[0],arguments[1],arguments[2]);case 4:return Ke.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:return Ke.j(arguments[0],arguments[1],arguments[2],arguments[3],new xc(c.slice(4),0))}};
Ke.a=function(b,a){var c;b instanceof Ge?(c=b.state,c=a.b?a.b(c):a.call(null,c),c=Je(b,c)):c=cc.a(b,a);return c};Ke.c=function(b,a,c){if(b instanceof Ge){var d=b.state;a=a.a?a.a(d,c):a.call(null,d,c);b=Je(b,a)}else b=cc.c(b,a,c);return b};Ke.o=function(b,a,c,d){if(b instanceof Ge){var e=b.state;a=a.c?a.c(e,c,d):a.call(null,e,c,d);b=Je(b,a)}else b=cc.o(b,a,c,d);return b};Ke.j=function(b,a,c,d,e){return b instanceof Ge?Je(b,F.A(a,b.state,c,d,e)):cc.A(b,a,c,d,e)};
Ke.D=function(b){var a=M(b),c=N(b);b=M(c);var d=N(c),c=M(d),e=N(d),d=M(e),e=N(e);return Ke.j(a,b,c,d,e)};Ke.w=4;function Le(b){this.state=b;this.g=32768;this.B=0}Le.prototype.Jb=function(){return this.state};function Ee(b){return new Le(b)}
var T=function T(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return T.b(arguments[0]);case 2:return T.a(arguments[0],arguments[1]);case 3:return T.c(arguments[0],arguments[1],arguments[2]);case 4:return T.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:return T.j(arguments[0],arguments[1],arguments[2],arguments[3],new xc(c.slice(4),0))}};
T.b=function(b){return function(a){return function(){function c(c,d){var e=b.b?b.b(d):b.call(null,d);return a.a?a.a(c,e):a.call(null,c,e)}function d(b){return a.b?a.b(b):a.call(null,b)}function e(){return a.l?a.l():a.call(null)}var f=null,g=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new xc(g,0)}return d.call(this,a,b,f)}function d(c,e,f){e=F.c(b,e,f);return a.a?a.a(c,e):a.call(null,c,e)}c.w=2;c.D=function(a){var b=
M(a);a=N(a);var c=M(a);a=yc(a);return d(b,c,a)};c.j=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var n=null;if(2<arguments.length){for(var n=0,p=Array(arguments.length-2);n<p.length;)p[n]=arguments[n+2],++n;n=new xc(p,0)}return g.j(a,b,n)}throw Error("Invalid arity: "+arguments.length);};f.w=2;f.D=g.D;f.l=e;f.b=d;f.a=c;f.j=g.j;return f}()}};
T.a=function(b,a){return new de(null,function(){var c=L(a);if(c){if(wd(c)){for(var d=Xb(c),e=P(d),f=he(e),g=0;;)if(g<e)je(f,function(){var a=G.a(d,g);return b.b?b.b(a):b.call(null,a)}()),g+=1;else break;return ie(f.$(),T.a(b,Yb(c)))}return Wc(function(){var a=M(c);return b.b?b.b(a):b.call(null,a)}(),T.a(b,yc(c)))}return null},null,null)};
T.c=function(b,a,c){return new de(null,function(){var d=L(a),e=L(c);if(d&&e){var f=Wc,g;g=M(d);var k=M(e);g=b.a?b.a(g,k):b.call(null,g,k);d=f(g,T.c(b,yc(d),yc(e)))}else d=null;return d},null,null)};T.o=function(b,a,c,d){return new de(null,function(){var e=L(a),f=L(c),g=L(d);if(e&&f&&g){var k=Wc,l;l=M(e);var m=M(f),n=M(g);l=b.c?b.c(l,m,n):b.call(null,l,m,n);e=k(l,T.o(b,yc(e),yc(f),yc(g)))}else e=null;return e},null,null)};
T.j=function(b,a,c,d,e){var f=function k(a){return new de(null,function(){var b=T.a(L,a);return ye(Gd,b)?Wc(T.a(M,b),k(T.a(yc,b))):null},null,null)};return T.a(function(){return function(a){return F.a(b,a)}}(f),f(fd.j(e,d,K([c,a],0))))};T.D=function(b){var a=M(b),c=N(b);b=M(c);var d=N(c),c=M(d),e=N(d),d=M(e),e=N(e);return T.j(a,b,c,d,e)};T.w=4;function Me(b,a){return new de(null,function(){if(0<b){var c=L(a);return c?Wc(M(c),Me(b-1,yc(c))):null}return null},null,null)}
function Ne(b,a){return new de(null,function(c){return function(){return c(b,a)}}(function(a,b){for(;;){var e=L(b);if(0<a&&e){var f=a-1,e=yc(e);a=f;b=e}else return e}}),null,null)}function Oe(b){return new de(null,function(){return Wc(b,Oe(b))},null,null)}function Pe(b){return new de(null,function(){return Wc(b.l?b.l():b.call(null),Pe(b))},null,null)}function Qe(b){return Me(5,Pe(b))}
var Re=function Re(a,c){return Wc(c,new de(null,function(){return Re(a,a.b?a.b(c):a.call(null,c))},null,null))},Se=function Se(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Se.a(arguments[0],arguments[1]);default:return Se.j(arguments[0],arguments[1],new xc(c.slice(2),0))}};Se.a=function(b,a){return new de(null,function(){var c=L(b),d=L(a);return c&&d?Wc(M(c),Wc(M(d),Se.a(yc(c),yc(d)))):null},null,null)};
Se.j=function(b,a,c){return new de(null,function(){var d=T.a(L,fd.j(c,a,K([b],0)));return ye(Gd,d)?ne.a(T.a(M,d),F.a(Se,T.a(yc,d))):null},null,null)};Se.D=function(b){var a=M(b),c=N(b);b=M(c);c=N(c);return Se.j(a,b,c)};Se.w=2;function Te(b){return Ne(1,Se.a(Oe("L"),b))}Ue;function Ve(b,a){return F.a(ne,F.c(T,b,a))}
function We(b,a){return new de(null,function(){var c=L(a);if(c){if(wd(c)){for(var d=Xb(c),e=P(d),f=he(e),g=0;;)if(g<e){var k;k=G.a(d,g);k=b.b?b.b(k):b.call(null,k);x(k)&&(k=G.a(d,g),f.add(k));g+=1}else break;return ie(f.$(),We(b,Yb(c)))}d=M(c);c=yc(c);return x(b.b?b.b(d):b.call(null,d))?Wc(d,We(b,c)):We(b,c)}return null},null,null)}
function Xe(b){return function c(b){return new de(null,function(){return Wc(b,x(Ad.b?Ad.b(b):Ad.call(null,b))?Ve(c,K([L.b?L.b(b):L.call(null,b)],0)):null)},null,null)}(b)}var Ye=function Ye(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ye.a(arguments[0],arguments[1]);case 3:return Ye.c(arguments[0],arguments[1],arguments[2]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};
Ye.a=function(b,a){return null!=b?null!=b&&(b.B&4||b.Rc)?Mc(oe(Ua.c(Ob,Nb(b),a)),od(b)):Ua.c(bb,b,a):Ua.c(fd,zc,a)};Ye.c=function(b,a,c){return null!=b&&(b.B&4||b.Rc)?Mc(oe(Hd(a,pe,Nb(b),c)),od(b)):Hd(a,fd,b,c)};Ye.w=3;function Ze(b,a){return oe(Ua.c(function(a,d){return pe.a(a,b.b?b.b(d):b.call(null,d))},Nb(gd),a))}
function $e(b,a){var c;a:{c=zd;for(var d=b,e=L(a);;)if(e)if(null!=d?d.g&256||d.yc||(d.g?0:Oa(hb,d)):Oa(hb,d)){d=J.c(d,M(e),c);if(c===d){c=null;break a}e=N(e)}else{c=null;break a}else{c=d;break a}}return c}function af(b,a,c){return kd.c(b,a,function(){var d=J.a(b,a);return c.b?c.b(d):c.call(null,d)}())}function bf(b,a,c,d){return kd.c(b,a,function(){var e=J.a(b,a);return c.a?c.a(e,d):c.call(null,e,d)}())}
function cf(b,a,c,d){var e=df;return kd.c(b,e,function(){var f=J.a(b,e);return a.c?a.c(f,c,d):a.call(null,f,c,d)}())}function ef(b,a){this.V=b;this.f=a}function ff(b){return new ef(b,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function gf(b){b=b.m;return 32>b?0:b-1>>>5<<5}function hf(b,a,c){for(;;){if(0===a)return c;var d=ff(b);d.f[0]=c;c=d;a-=5}}
var jf=function jf(a,c,d,e){var f=new ef(d.V,Ta(d.f)),g=a.m-1>>>c&31;5===c?f.f[g]=e:(d=d.f[g],a=null!=d?jf(a,c-5,d,e):hf(null,c-5,e),f.f[g]=a);return f};function kf(b,a){throw Error([D("No item "),D(b),D(" in vector of length "),D(a)].join(""));}function lf(b,a){if(a>=gf(b))return b.R;for(var c=b.root,d=b.shift;;)if(0<d)var e=d-5,c=c.f[a>>>d&31],d=e;else return c.f}function mf(b,a){return 0<=a&&a<b.m?lf(b,a):kf(a,b.m)}
var nf=function nf(a,c,d,e,f){var g=new ef(d.V,Ta(d.f));if(0===c)g.f[e&31]=f;else{var k=e>>>c&31;a=nf(a,c-5,d.f[k],e,f);g.f[k]=a}return g};function of(b,a,c,d,e,f){this.s=b;this.kc=a;this.f=c;this.Na=d;this.start=e;this.end=f}of.prototype.ya=function(){return this.s<this.end};of.prototype.next=function(){32===this.s-this.kc&&(this.f=lf(this.Na,this.s),this.kc+=32);var b=this.f[this.s&31];this.s+=1;return b};pf;qf;rf;O;sf;tf;uf;
function V(b,a,c,d,e,f){this.v=b;this.m=a;this.shift=c;this.root=d;this.R=e;this.u=f;this.g=167668511;this.B=8196}h=V.prototype;h.toString=function(){return fc(this)};h.equiv=function(b){return this.C(null,b)};h.N=function(b,a){return ib.c(this,a,null)};h.I=function(b,a,c){return"number"===typeof a?G.c(this,a,c):c};
h.Lb=function(b,a,c){b=0;for(var d=c;;)if(b<this.m){var e=lf(this,b);c=e.length;a:for(var f=0;;)if(f<c){var g=f+b,k=e[f],d=a.c?a.c(d,g,k):a.call(null,d,g,k);if(Pc(d)){e=d;break a}f+=1}else{e=d;break a}if(Pc(e))return O.b?O.b(e):O.call(null,e);b+=c;d=e}else return d};h.ca=function(b,a){return mf(this,a)[a&31]};h.Ea=function(b,a,c){return 0<=a&&a<this.m?lf(this,a)[a&31]:c};
h.kb=function(b,a,c){if(0<=a&&a<this.m)return gf(this)<=a?(b=Ta(this.R),b[a&31]=c,new V(this.v,this.m,this.shift,this.root,b,null)):new V(this.v,this.m,this.shift,nf(this,this.shift,this.root,a,c),this.R,null);if(a===this.m)return bb(this,c);throw Error([D("Index "),D(a),D(" out of bounds  [0,"),D(this.m),D("]")].join(""));};h.Ga=function(){var b=this.m;return new of(0,0,0<P(this)?lf(this,0):null,this,0,b)};h.O=function(){return this.v};h.X=function(){return this.m};
h.Mb=function(){return G.a(this,0)};h.Nb=function(){return G.a(this,1)};h.jb=function(){return 0<this.m?G.a(this,this.m-1):null};h.bc=function(){return 0<this.m?new Xc(this,this.m-1,null):null};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Gc(this)};h.C=function(b,a){if(a instanceof V)if(this.m===P(a))for(var c=dc(this),d=dc(a);;)if(x(c.ya())){var e=c.next(),f=d.next();if(!nc.a(e,f))return!1}else return!0;else return!1;else return Lc(this,a)};
h.vb=function(){return new rf(this.m,this.shift,pf.b?pf.b(this.root):pf.call(null,this.root),qf.b?qf.b(this.R):qf.call(null,this.R))};h.da=function(){return Mc(gd,this.v)};h.ea=function(b,a){return Qc(this,a)};h.fa=function(b,a,c){b=0;for(var d=c;;)if(b<this.m){var e=lf(this,b);c=e.length;a:for(var f=0;;)if(f<c){var g=e[f],d=a.a?a.a(d,g):a.call(null,d,g);if(Pc(d)){e=d;break a}f+=1}else{e=d;break a}if(Pc(e))return O.b?O.b(e):O.call(null,e);b+=c;d=e}else return d};
h.Oa=function(b,a,c){if("number"===typeof a)return tb(this,a,c);throw Error("Vector's key for assoc must be a number.");};h.U=function(){if(0===this.m)return null;if(32>=this.m)return new xc(this.R,0);var b;a:{b=this.root;for(var a=this.shift;;)if(0<a)a-=5,b=b.f[0];else{b=b.f;break a}}return uf.o?uf.o(this,b,0,0):uf.call(null,this,b,0,0)};h.P=function(b,a){return new V(a,this.m,this.shift,this.root,this.R,this.u)};
h.W=function(b,a){if(32>this.m-gf(this)){for(var c=this.R.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.R[e],e+=1;else break;d[c]=a;return new V(this.v,this.m+1,this.shift,this.root,d,null)}c=(d=this.m>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=ff(null),d.f[0]=this.root,e=hf(null,this.shift,new ef(null,this.R)),d.f[1]=e):d=jf(this,this.shift,this.root,new ef(null,this.R));return new V(this.v,this.m+1,c,d,[a],null)};
h.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.ca(null,b);case 3:return this.Ea(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=function(a,b){return this.ca(null,b)};b.c=function(a,b,d){return this.Ea(null,b,d)};return b}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ta(a)))};h.b=function(b){return this.ca(null,b)};h.a=function(b,a){return this.Ea(null,b,a)};
var W=new ef(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),gd=new V(null,0,5,W,[],Hc);V.prototype[Ra]=function(){return Cc(this)};function Fd(b){if(Ma(b))a:{var a=b.length;if(32>a)b=new V(null,a,5,W,b,null);else for(var c=32,d=(new V(null,32,5,W,b.slice(0,32),null)).vb(null);;)if(c<a)var e=c+1,d=pe.a(d,b[c]),c=e;else{b=Pb(d);break a}}else b=Pb(Ua.c(Ob,Nb(gd),b));return b}vf;
function vd(b,a,c,d,e,f){this.Ia=b;this.node=a;this.s=c;this.ua=d;this.v=e;this.u=f;this.g=32375020;this.B=1536}h=vd.prototype;h.toString=function(){return fc(this)};h.equiv=function(b){return this.C(null,b)};h.O=function(){return this.v};h.wa=function(){if(this.ua+1<this.node.length){var b;b=this.Ia;var a=this.node,c=this.s,d=this.ua+1;b=uf.o?uf.o(b,a,c,d):uf.call(null,b,a,c,d);return null==b?null:b}return Zb(this)};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Gc(this)};
h.C=function(b,a){return Lc(this,a)};h.da=function(){return Mc(gd,this.v)};h.ea=function(b,a){var c;c=this.Ia;var d=this.s+this.ua,e=P(this.Ia);c=vf.c?vf.c(c,d,e):vf.call(null,c,d,e);return Qc(c,a)};h.fa=function(b,a,c){b=this.Ia;var d=this.s+this.ua,e=P(this.Ia);b=vf.c?vf.c(b,d,e):vf.call(null,b,d,e);return Rc(b,a,c)};h.ta=function(){return this.node[this.ua]};
h.xa=function(){if(this.ua+1<this.node.length){var b;b=this.Ia;var a=this.node,c=this.s,d=this.ua+1;b=uf.o?uf.o(b,a,c,d):uf.call(null,b,a,c,d);return null==b?zc:b}return Yb(this)};h.U=function(){return this};h.nc=function(){var b=this.node;return new fe(b,this.ua,b.length)};h.oc=function(){var b=this.s+this.node.length;if(b<Xa(this.Ia)){var a=this.Ia,c=lf(this.Ia,b);return uf.o?uf.o(a,c,b,0):uf.call(null,a,c,b,0)}return zc};
h.P=function(b,a){return uf.A?uf.A(this.Ia,this.node,this.s,this.ua,a):uf.call(null,this.Ia,this.node,this.s,this.ua,a)};h.W=function(b,a){return Wc(a,this)};h.mc=function(){var b=this.s+this.node.length;if(b<Xa(this.Ia)){var a=this.Ia,c=lf(this.Ia,b);return uf.o?uf.o(a,c,b,0):uf.call(null,a,c,b,0)}return null};vd.prototype[Ra]=function(){return Cc(this)};
var uf=function uf(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return uf.c(arguments[0],arguments[1],arguments[2]);case 4:return uf.o(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return uf.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};uf.c=function(b,a,c){return new vd(b,mf(b,a),a,c,null,null)};
uf.o=function(b,a,c,d){return new vd(b,a,c,d,null,null)};uf.A=function(b,a,c,d,e){return new vd(b,a,c,d,e,null)};uf.w=5;wf;function xf(b,a,c,d,e){this.v=b;this.Na=a;this.start=c;this.end=d;this.u=e;this.g=167666463;this.B=8192}h=xf.prototype;h.toString=function(){return fc(this)};h.equiv=function(b){return this.C(null,b)};h.N=function(b,a){return ib.c(this,a,null)};h.I=function(b,a,c){return"number"===typeof a?G.c(this,a,c):c};
h.Lb=function(b,a,c){b=this.start;for(var d=0;;)if(b<this.end){var e=d,f=G.a(this.Na,b);c=a.c?a.c(c,e,f):a.call(null,c,e,f);if(Pc(c))return O.b?O.b(c):O.call(null,c);d+=1;b+=1}else return c};h.ca=function(b,a){return 0>a||this.end<=this.start+a?kf(a,this.end-this.start):G.a(this.Na,this.start+a)};h.Ea=function(b,a,c){return 0>a||this.end<=this.start+a?c:G.c(this.Na,this.start+a,c)};
h.kb=function(b,a,c){var d=this.start+a;b=this.v;c=kd.c(this.Na,d,c);a=this.start;var e=this.end,d=d+1,d=e>d?e:d;return wf.A?wf.A(b,c,a,d,null):wf.call(null,b,c,a,d,null)};h.O=function(){return this.v};h.X=function(){return this.end-this.start};h.jb=function(){return G.a(this.Na,this.end-1)};h.bc=function(){return this.start!==this.end?new Xc(this,this.end-this.start-1,null):null};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Gc(this)};h.C=function(b,a){return Lc(this,a)};
h.da=function(){return Mc(gd,this.v)};h.ea=function(b,a){return Qc(this,a)};h.fa=function(b,a,c){return Rc(this,a,c)};h.Oa=function(b,a,c){if("number"===typeof a)return tb(this,a,c);throw Error("Subvec's key for assoc must be a number.");};h.U=function(){var b=this;return function(a){return function d(e){return e===b.end?null:Wc(G.a(b.Na,e),new de(null,function(){return function(){return d(e+1)}}(a),null,null))}}(this)(b.start)};
h.P=function(b,a){return wf.A?wf.A(a,this.Na,this.start,this.end,this.u):wf.call(null,a,this.Na,this.start,this.end,this.u)};h.W=function(b,a){var c=this.v,d=tb(this.Na,this.end,a),e=this.start,f=this.end+1;return wf.A?wf.A(c,d,e,f,null):wf.call(null,c,d,e,f,null)};
h.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.ca(null,b);case 3:return this.Ea(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=function(a,b){return this.ca(null,b)};b.c=function(a,b,d){return this.Ea(null,b,d)};return b}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ta(a)))};h.b=function(b){return this.ca(null,b)};h.a=function(b,a){return this.Ea(null,b,a)};xf.prototype[Ra]=function(){return Cc(this)};
function wf(b,a,c,d,e){for(;;)if(a instanceof xf)c=a.start+c,d=a.start+d,a=a.Na;else{var f=P(a);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new xf(b,a,c,d,e)}}var vf=function vf(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return vf.a(arguments[0],arguments[1]);case 3:return vf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};
vf.a=function(b,a){return vf.c(b,a,P(b))};vf.c=function(b,a,c){return wf(null,b,a,c,null)};vf.w=3;function yf(b,a){return b===a.V?a:new ef(b,Ta(a.f))}function pf(b){return new ef({},Ta(b.f))}function qf(b){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];yd(b,0,a,0,b.length);return a}
var zf=function zf(a,c,d,e){d=yf(a.root.V,d);var f=a.m-1>>>c&31;if(5===c)a=e;else{var g=d.f[f];a=null!=g?zf(a,c-5,g,e):hf(a.root.V,c-5,e)}d.f[f]=a;return d};function rf(b,a,c,d){this.m=b;this.shift=a;this.root=c;this.R=d;this.B=88;this.g=275}h=rf.prototype;
h.Rb=function(b,a){if(this.root.V){if(32>this.m-gf(this))this.R[this.m&31]=a;else{var c=new ef(this.root.V,this.R),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=a;this.R=d;if(this.m>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=hf(this.root.V,this.shift,c);this.root=new ef(this.root.V,d);this.shift=e}else this.root=zf(this,this.shift,this.root,c)}this.m+=1;return this}throw Error("conj! after persistent!");};h.Sb=function(){if(this.root.V){this.root.V=null;var b=this.m-gf(this),a=Array(b);yd(this.R,0,a,0,b);return new V(null,this.m,this.shift,this.root,a,null)}throw Error("persistent! called twice");};
h.Qb=function(b,a,c){if("number"===typeof a)return Tb(this,a,c);throw Error("TransientVector's key for assoc! must be a number.");};
h.zc=function(b,a,c){var d=this;if(d.root.V){if(0<=a&&a<d.m)return gf(this)<=a?d.R[a&31]=c:(b=function(){return function f(b,k){var l=yf(d.root.V,k);if(0===b)l.f[a&31]=c;else{var m=a>>>b&31,n=f(b-5,l.f[m]);l.f[m]=n}return l}}(this).call(null,d.shift,d.root),d.root=b),this;if(a===d.m)return Ob(this,c);throw Error([D("Index "),D(a),D(" out of bounds for TransientVector of length"),D(d.m)].join(""));}throw Error("assoc! after persistent!");};
h.X=function(){if(this.root.V)return this.m;throw Error("count after persistent!");};h.ca=function(b,a){if(this.root.V)return mf(this,a)[a&31];throw Error("nth after persistent!");};h.Ea=function(b,a,c){return 0<=a&&a<this.m?G.a(this,a):c};h.N=function(b,a){return ib.c(this,a,null)};h.I=function(b,a,c){return"number"===typeof a?G.c(this,a,c):c};
h.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.N(null,b);case 3:return this.I(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=function(a,b){return this.N(null,b)};b.c=function(a,b,d){return this.I(null,b,d)};return b}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ta(a)))};h.b=function(b){return this.N(null,b)};h.a=function(b,a){return this.I(null,b,a)};function Af(){this.g=2097152;this.B=0}
Af.prototype.equiv=function(b){return this.C(null,b)};Af.prototype.C=function(){return!1};var Bf=new Af;function Cf(b,a){return Bd(sd(a)?P(b)===P(a)?ye(Gd,T.a(function(b){return nc.a(J.c(a,M(b),Bf),dd(b))},b)):null:null)}function Df(b,a,c,d,e){this.s=b;this.qd=a;this.uc=c;this.fd=d;this.Kc=e}Df.prototype.ya=function(){var b=this.s<this.uc;return b?b:this.Kc.ya()};Df.prototype.next=function(){if(this.s<this.uc){var b=id(this.fd,this.s);this.s+=1;return new V(null,2,5,W,[b,ib.a(this.qd,b)],null)}return this.Kc.next()};
Df.prototype.remove=function(){return Error("Unsupported operation")};function Ef(b){this.J=b}Ef.prototype.next=function(){if(null!=this.J){var b=M(this.J),a=R(b,0),b=R(b,1);this.J=N(this.J);return{value:[a,b],done:!1}}return{value:null,done:!0}};function Ff(b){return new Ef(L(b))}function Gf(b){this.J=b}Gf.prototype.next=function(){if(null!=this.J){var b=M(this.J);this.J=N(this.J);return{value:[b,b],done:!1}}return{value:null,done:!0}};
function Hf(b,a){var c;if(a instanceof y)a:{c=b.length;for(var d=a.Ha,e=0;;){if(c<=e){c=-1;break a}if(b[e]instanceof y&&d===b[e].Ha){c=e;break a}e+=2}}else if("string"==typeof a||"number"===typeof a)a:for(c=b.length,d=0;;){if(c<=d){c=-1;break a}if(a===b[d]){c=d;break a}d+=2}else if(a instanceof mc)a:for(c=b.length,d=a.$a,e=0;;){if(c<=e){c=-1;break a}if(b[e]instanceof mc&&d===b[e].$a){c=e;break a}e+=2}else if(null==a)a:for(c=b.length,d=0;;){if(c<=d){c=-1;break a}if(null==b[d]){c=d;break a}d+=2}else a:for(c=
b.length,d=0;;){if(c<=d){c=-1;break a}if(nc.a(a,b[d])){c=d;break a}d+=2}return c}If;function Jf(b,a,c){this.f=b;this.s=a;this.Da=c;this.g=32374990;this.B=0}h=Jf.prototype;h.toString=function(){return fc(this)};h.equiv=function(b){return this.C(null,b)};h.O=function(){return this.Da};h.wa=function(){return this.s<this.f.length-2?new Jf(this.f,this.s+2,this.Da):null};h.X=function(){return(this.f.length-this.s)/2};h.T=function(){return Gc(this)};h.C=function(b,a){return Lc(this,a)};
h.da=function(){return Mc(zc,this.Da)};h.ea=function(b,a){return bd.a(a,this)};h.fa=function(b,a,c){return bd.c(a,c,this)};h.ta=function(){return new V(null,2,5,W,[this.f[this.s],this.f[this.s+1]],null)};h.xa=function(){return this.s<this.f.length-2?new Jf(this.f,this.s+2,this.Da):zc};h.U=function(){return this};h.P=function(b,a){return new Jf(this.f,this.s,a)};h.W=function(b,a){return Wc(a,this)};Jf.prototype[Ra]=function(){return Cc(this)};Kf;Lf;function Mf(b,a,c){this.f=b;this.s=a;this.m=c}
Mf.prototype.ya=function(){return this.s<this.m};Mf.prototype.next=function(){var b=new V(null,2,5,W,[this.f[this.s],this.f[this.s+1]],null);this.s+=2;return b};function v(b,a,c,d){this.v=b;this.m=a;this.f=c;this.u=d;this.g=16647951;this.B=8196}h=v.prototype;h.toString=function(){return fc(this)};h.equiv=function(b){return this.C(null,b)};h.keys=function(){return Cc(Kf.b?Kf.b(this):Kf.call(null,this))};h.entries=function(){return Ff(L(this))};
h.values=function(){return Cc(Lf.b?Lf.b(this):Lf.call(null,this))};h.has=function(b){return Cd(this,b)};h.get=function(b,a){return this.I(null,b,a)};h.forEach=function(b){for(var a=L(this),c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e),g=R(f,0),f=R(f,1);b.a?b.a(f,g):b.call(null,f,g);e+=1}else if(a=L(a))wd(a)?(c=Xb(a),a=Yb(a),g=c,d=P(c),c=g):(c=M(a),g=R(c,0),f=R(c,1),b.a?b.a(f,g):b.call(null,f,g),a=N(a),c=null,d=0),e=0;else return null};h.N=function(b,a){return ib.c(this,a,null)};
h.I=function(b,a,c){b=Hf(this.f,a);return-1===b?c:this.f[b+1]};h.Lb=function(b,a,c){b=this.f.length;for(var d=0;;)if(d<b){var e=this.f[d],f=this.f[d+1];c=a.c?a.c(c,e,f):a.call(null,c,e,f);if(Pc(c))return O.b?O.b(c):O.call(null,c);d+=2}else return c};h.Ga=function(){return new Mf(this.f,0,2*this.m)};h.O=function(){return this.v};h.X=function(){return this.m};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Ic(this)};
h.C=function(b,a){if(null!=a&&(a.g&1024||a.Uc)){var c=this.f.length;if(this.m===a.X(null))for(var d=0;;)if(d<c){var e=a.I(null,this.f[d],zd);if(e!==zd)if(nc.a(this.f[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return Cf(this,a)};h.vb=function(){return new If({},this.f.length,Ta(this.f))};h.da=function(){return xb(we,this.v)};h.ea=function(b,a){return bd.a(a,this)};h.fa=function(b,a,c){return bd.c(a,c,this)};
h.ib=function(b,a){if(0<=Hf(this.f,a)){var c=this.f.length,d=c-2;if(0===d)return Ya(this);for(var d=Array(d),e=0,f=0;;){if(e>=c)return new v(this.v,this.m-1,d,null);nc.a(a,this.f[e])||(d[f]=this.f[e],d[f+1]=this.f[e+1],f+=2);e+=2}}else return this};
h.Oa=function(b,a,c){b=Hf(this.f,a);if(-1===b){if(this.m<Nf){b=this.f;for(var d=b.length,e=Array(d+2),f=0;;)if(f<d)e[f]=b[f],f+=1;else break;e[d]=a;e[d+1]=c;return new v(this.v,this.m+1,e,null)}return xb(kb(Ye.a(Of,this),a,c),this.v)}if(c===this.f[b+1])return this;a=Ta(this.f);a[b+1]=c;return new v(this.v,this.m,a,null)};h.lc=function(b,a){return-1!==Hf(this.f,a)};h.U=function(){var b=this.f;return 0<=b.length-2?new Jf(b,0,null):null};h.P=function(b,a){return new v(a,this.m,this.f,this.u)};
h.W=function(b,a){if(td(a))return kb(this,G.a(a,0),G.a(a,1));for(var c=this,d=L(a);;){if(null==d)return c;var e=M(d);if(td(e))c=kb(c,G.a(e,0),G.a(e,1)),d=N(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
h.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.N(null,b);case 3:return this.I(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=function(a,b){return this.N(null,b)};b.c=function(a,b,d){return this.I(null,b,d)};return b}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ta(a)))};h.b=function(b){return this.N(null,b)};h.a=function(b,a){return this.I(null,b,a)};var we=new v(null,0,[],Jc),Nf=8;v.prototype[Ra]=function(){return Cc(this)};
Pf;function If(b,a,c){this.Bb=b;this.qb=a;this.f=c;this.g=258;this.B=56}h=If.prototype;h.X=function(){if(x(this.Bb))return Pd(this.qb);throw Error("count after persistent!");};h.N=function(b,a){return ib.c(this,a,null)};h.I=function(b,a,c){if(x(this.Bb))return b=Hf(this.f,a),-1===b?c:this.f[b+1];throw Error("lookup after persistent!");};
h.Rb=function(b,a){if(x(this.Bb)){if(null!=a?a.g&2048||a.Vc||(a.g?0:Oa(nb,a)):Oa(nb,a))return Sb(this,Td.b?Td.b(a):Td.call(null,a),Ud.b?Ud.b(a):Ud.call(null,a));for(var c=L(a),d=this;;){var e=M(c);if(x(e))c=N(c),d=Sb(d,Td.b?Td.b(e):Td.call(null,e),Ud.b?Ud.b(e):Ud.call(null,e));else return d}}else throw Error("conj! after persistent!");};h.Sb=function(){if(x(this.Bb))return this.Bb=!1,new v(null,Pd(this.qb),this.f,null);throw Error("persistent! called twice");};
h.Qb=function(b,a,c){if(x(this.Bb)){b=Hf(this.f,a);if(-1===b){if(this.qb+2<=2*Nf)return this.qb+=2,this.f.push(a),this.f.push(c),this;b=Pf.a?Pf.a(this.qb,this.f):Pf.call(null,this.qb,this.f);return Sb(b,a,c)}c!==this.f[b+1]&&(this.f[b+1]=c);return this}throw Error("assoc! after persistent!");};Qf;jd;function Pf(b,a){for(var c=Nb(Of),d=0;;)if(d<b)c=Sb(c,a[d],a[d+1]),d+=2;else return c}function Rf(){this.H=!1}Sf;Tf;Je;Uf;X;O;function Vf(b,a){return b===a?!0:U(b,a)?!0:nc.a(b,a)}
function Wf(b,a,c){b=Ta(b);b[a]=c;return b}function Xf(b,a){var c=Array(b.length-2);yd(b,0,c,0,2*a);yd(b,2*(a+1),c,2*a,c.length-2*a);return c}function Yf(b,a,c,d){b=b.mb(a);b.f[c]=d;return b}function Zf(b,a,c){for(var d=b.length,e=0,f=c;;)if(e<d){c=b[e];if(null!=c){var g=b[e+1];c=a.c?a.c(f,c,g):a.call(null,f,c,g)}else c=b[e+1],c=null!=c?c.pb(a,f):f;if(Pc(c))return O.b?O.b(c):O.call(null,c);e+=2;f=c}else return f}$f;function ag(b,a,c,d){this.f=b;this.s=a;this.Zb=c;this.Ra=d}
ag.prototype.advance=function(){for(var b=this.f.length;;)if(this.s<b){var a=this.f[this.s],c=this.f[this.s+1];null!=a?a=this.Zb=new V(null,2,5,W,[a,c],null):null!=c?(a=dc(c),a=a.ya()?this.Ra=a:!1):a=!1;this.s+=2;if(a)return!0}else return!1};ag.prototype.ya=function(){var b=null!=this.Zb;return b?b:(b=null!=this.Ra)?b:this.advance()};
ag.prototype.next=function(){if(null!=this.Zb){var b=this.Zb;this.Zb=null;return b}if(null!=this.Ra)return b=this.Ra.next(),this.Ra.ya()||(this.Ra=null),b;if(this.advance())return this.next();throw Error("No such element");};ag.prototype.remove=function(){return Error("Unsupported operation")};function bg(b,a,c){this.V=b;this.Y=a;this.f=c}h=bg.prototype;h.mb=function(b){if(b===this.V)return this;var a=Qd(this.Y),c=Array(0>a?4:2*(a+1));yd(this.f,0,c,0,2*a);return new bg(b,this.Y,c)};
h.Wb=function(){return Sf.b?Sf.b(this.f):Sf.call(null,this.f)};h.pb=function(b,a){return Zf(this.f,b,a)};h.fb=function(b,a,c,d){var e=1<<(a>>>b&31);if(0===(this.Y&e))return d;var f=Qd(this.Y&e-1),e=this.f[2*f],f=this.f[2*f+1];return null==e?f.fb(b+5,a,c,d):Vf(c,e)?f:d};
h.Qa=function(b,a,c,d,e,f){var g=1<<(c>>>a&31),k=Qd(this.Y&g-1);if(0===(this.Y&g)){var l=Qd(this.Y);if(2*l<this.f.length){b=this.mb(b);a=b.f;f.H=!0;a:for(c=2*(l-k),f=2*k+(c-1),l=2*(k+1)+(c-1);;){if(0===c)break a;a[l]=a[f];--l;--c;--f}a[2*k]=d;a[2*k+1]=e;b.Y|=g;return b}if(16<=l){k=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];k[c>>>a&31]=cg.Qa(b,a+5,c,d,e,f);for(e=d=0;;)if(32>d)0!==
(this.Y>>>d&1)&&(k[d]=null!=this.f[e]?cg.Qa(b,a+5,sc(this.f[e]),this.f[e],this.f[e+1],f):this.f[e+1],e+=2),d+=1;else break;return new $f(b,l+1,k)}a=Array(2*(l+4));yd(this.f,0,a,0,2*k);a[2*k]=d;a[2*k+1]=e;yd(this.f,2*k,a,2*(k+1),2*(l-k));f.H=!0;b=this.mb(b);b.f=a;b.Y|=g;return b}l=this.f[2*k];g=this.f[2*k+1];if(null==l)return l=g.Qa(b,a+5,c,d,e,f),l===g?this:Yf(this,b,2*k+1,l);if(Vf(d,l))return e===g?this:Yf(this,b,2*k+1,e);f.H=!0;f=a+5;d=Uf.ba?Uf.ba(b,f,l,g,c,d,e):Uf.call(null,b,f,l,g,c,d,e);e=2*
k;k=2*k+1;b=this.mb(b);b.f[e]=null;b.f[k]=d;return b};
h.Pa=function(b,a,c,d,e){var f=1<<(a>>>b&31),g=Qd(this.Y&f-1);if(0===(this.Y&f)){var k=Qd(this.Y);if(16<=k){g=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];g[a>>>b&31]=cg.Pa(b+5,a,c,d,e);for(d=c=0;;)if(32>c)0!==(this.Y>>>c&1)&&(g[c]=null!=this.f[d]?cg.Pa(b+5,sc(this.f[d]),this.f[d],this.f[d+1],e):this.f[d+1],d+=2),c+=1;else break;return new $f(null,k+1,g)}b=Array(2*(k+1));yd(this.f,
0,b,0,2*g);b[2*g]=c;b[2*g+1]=d;yd(this.f,2*g,b,2*(g+1),2*(k-g));e.H=!0;return new bg(null,this.Y|f,b)}var l=this.f[2*g],f=this.f[2*g+1];if(null==l)return k=f.Pa(b+5,a,c,d,e),k===f?this:new bg(null,this.Y,Wf(this.f,2*g+1,k));if(Vf(c,l))return d===f?this:new bg(null,this.Y,Wf(this.f,2*g+1,d));e.H=!0;e=this.Y;k=this.f;b+=5;b=Uf.aa?Uf.aa(b,l,f,a,c,d):Uf.call(null,b,l,f,a,c,d);c=2*g;g=2*g+1;d=Ta(k);d[c]=null;d[g]=b;return new bg(null,e,d)};
h.Xb=function(b,a,c){var d=1<<(a>>>b&31);if(0===(this.Y&d))return this;var e=Qd(this.Y&d-1),f=this.f[2*e],g=this.f[2*e+1];return null==f?(b=g.Xb(b+5,a,c),b===g?this:null!=b?new bg(null,this.Y,Wf(this.f,2*e+1,b)):this.Y===d?null:new bg(null,this.Y^d,Xf(this.f,e))):Vf(c,f)?new bg(null,this.Y^d,Xf(this.f,e)):this};h.Ga=function(){return new ag(this.f,0,null,null)};var cg=new bg(null,0,[]);function dg(b,a,c){this.f=b;this.s=a;this.Ra=c}
dg.prototype.ya=function(){for(var b=this.f.length;;){if(null!=this.Ra&&this.Ra.ya())return!0;if(this.s<b){var a=this.f[this.s];this.s+=1;null!=a&&(this.Ra=dc(a))}else return!1}};dg.prototype.next=function(){if(this.ya())return this.Ra.next();throw Error("No such element");};dg.prototype.remove=function(){return Error("Unsupported operation")};function $f(b,a,c){this.V=b;this.m=a;this.f=c}h=$f.prototype;h.mb=function(b){return b===this.V?this:new $f(b,this.m,Ta(this.f))};
h.Wb=function(){return Tf.b?Tf.b(this.f):Tf.call(null,this.f)};h.pb=function(b,a){for(var c=this.f.length,d=0,e=a;;)if(d<c){var f=this.f[d];if(null!=f&&(e=f.pb(b,e),Pc(e)))return O.b?O.b(e):O.call(null,e);d+=1}else return e};h.fb=function(b,a,c,d){var e=this.f[a>>>b&31];return null!=e?e.fb(b+5,a,c,d):d};h.Qa=function(b,a,c,d,e,f){var g=c>>>a&31,k=this.f[g];if(null==k)return b=Yf(this,b,g,cg.Qa(b,a+5,c,d,e,f)),b.m+=1,b;a=k.Qa(b,a+5,c,d,e,f);return a===k?this:Yf(this,b,g,a)};
h.Pa=function(b,a,c,d,e){var f=a>>>b&31,g=this.f[f];if(null==g)return new $f(null,this.m+1,Wf(this.f,f,cg.Pa(b+5,a,c,d,e)));b=g.Pa(b+5,a,c,d,e);return b===g?this:new $f(null,this.m,Wf(this.f,f,b))};
h.Xb=function(b,a,c){var d=a>>>b&31,e=this.f[d];if(null!=e){b=e.Xb(b+5,a,c);if(b===e)d=this;else if(null==b)if(8>=this.m)a:{e=this.f;b=e.length;a=Array(2*(this.m-1));c=0;for(var f=1,g=0;;)if(c<b)c!==d&&null!=e[c]&&(a[f]=e[c],f+=2,g|=1<<c),c+=1;else{d=new bg(null,g,a);break a}}else d=new $f(null,this.m-1,Wf(this.f,d,b));else d=new $f(null,this.m,Wf(this.f,d,b));return d}return this};h.Ga=function(){return new dg(this.f,0,null)};
function eg(b,a,c){a*=2;for(var d=0;;)if(d<a){if(Vf(c,b[d]))return d;d+=2}else return-1}function fg(b,a,c,d){this.V=b;this.bb=a;this.m=c;this.f=d}h=fg.prototype;h.mb=function(b){if(b===this.V)return this;var a=Array(2*(this.m+1));yd(this.f,0,a,0,2*this.m);return new fg(b,this.bb,this.m,a)};h.Wb=function(){return Sf.b?Sf.b(this.f):Sf.call(null,this.f)};h.pb=function(b,a){return Zf(this.f,b,a)};h.fb=function(b,a,c,d){b=eg(this.f,this.m,c);return 0>b?d:Vf(c,this.f[b])?this.f[b+1]:d};
h.Qa=function(b,a,c,d,e,f){if(c===this.bb){a=eg(this.f,this.m,d);if(-1===a){if(this.f.length>2*this.m)return a=2*this.m,c=2*this.m+1,b=this.mb(b),b.f[a]=d,b.f[c]=e,f.H=!0,b.m+=1,b;c=this.f.length;a=Array(c+2);yd(this.f,0,a,0,c);a[c]=d;a[c+1]=e;f.H=!0;d=this.m+1;b===this.V?(this.f=a,this.m=d,b=this):b=new fg(this.V,this.bb,d,a);return b}return this.f[a+1]===e?this:Yf(this,b,a+1,e)}return(new bg(b,1<<(this.bb>>>a&31),[null,this,null,null])).Qa(b,a,c,d,e,f)};
h.Pa=function(b,a,c,d,e){return a===this.bb?(b=eg(this.f,this.m,c),-1===b?(b=2*this.m,a=Array(b+2),yd(this.f,0,a,0,b),a[b]=c,a[b+1]=d,e.H=!0,new fg(null,this.bb,this.m+1,a)):nc.a(this.f[b],d)?this:new fg(null,this.bb,this.m,Wf(this.f,b+1,d))):(new bg(null,1<<(this.bb>>>b&31),[null,this])).Pa(b,a,c,d,e)};h.Xb=function(b,a,c){b=eg(this.f,this.m,c);return-1===b?this:1===this.m?null:new fg(null,this.bb,this.m-1,Xf(this.f,Pd(b)))};h.Ga=function(){return new ag(this.f,0,null,null)};
var Uf=function Uf(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return Uf.aa(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return Uf.ba(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};
Uf.aa=function(b,a,c,d,e,f){var g=sc(a);if(g===d)return new fg(null,g,2,[a,c,e,f]);var k=new Rf;return cg.Pa(b,g,a,c,k).Pa(b,d,e,f,k)};Uf.ba=function(b,a,c,d,e,f,g){var k=sc(c);if(k===e)return new fg(null,k,2,[c,d,f,g]);var l=new Rf;return cg.Qa(b,a,k,c,d,l).Qa(b,a,e,f,g,l)};Uf.w=7;function gg(b,a,c,d,e){this.v=b;this.gb=a;this.s=c;this.J=d;this.u=e;this.g=32374860;this.B=0}h=gg.prototype;h.toString=function(){return fc(this)};h.equiv=function(b){return this.C(null,b)};h.O=function(){return this.v};
h.T=function(){var b=this.u;return null!=b?b:this.u=b=Gc(this)};h.C=function(b,a){return Lc(this,a)};h.da=function(){return Mc(zc,this.v)};h.ea=function(b,a){return bd.a(a,this)};h.fa=function(b,a,c){return bd.c(a,c,this)};h.ta=function(){return null==this.J?new V(null,2,5,W,[this.gb[this.s],this.gb[this.s+1]],null):M(this.J)};
h.xa=function(){if(null==this.J){var b=this.gb,a=this.s+2;return Sf.c?Sf.c(b,a,null):Sf.call(null,b,a,null)}var b=this.gb,a=this.s,c=N(this.J);return Sf.c?Sf.c(b,a,c):Sf.call(null,b,a,c)};h.U=function(){return this};h.P=function(b,a){return new gg(a,this.gb,this.s,this.J,this.u)};h.W=function(b,a){return Wc(a,this)};gg.prototype[Ra]=function(){return Cc(this)};
var Sf=function Sf(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Sf.b(arguments[0]);case 3:return Sf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};Sf.b=function(b){return Sf.c(b,0,null)};
Sf.c=function(b,a,c){if(null==c)for(c=b.length;;)if(a<c){if(null!=b[a])return new gg(null,b,a,null,null);var d=b[a+1];if(x(d)&&(d=d.Wb(),x(d)))return new gg(null,b,a+2,d,null);a+=2}else return null;else return new gg(null,b,a,c,null)};Sf.w=3;function hg(b,a,c,d,e){this.v=b;this.gb=a;this.s=c;this.J=d;this.u=e;this.g=32374860;this.B=0}h=hg.prototype;h.toString=function(){return fc(this)};h.equiv=function(b){return this.C(null,b)};h.O=function(){return this.v};
h.T=function(){var b=this.u;return null!=b?b:this.u=b=Gc(this)};h.C=function(b,a){return Lc(this,a)};h.da=function(){return Mc(zc,this.v)};h.ea=function(b,a){return bd.a(a,this)};h.fa=function(b,a,c){return bd.c(a,c,this)};h.ta=function(){return M(this.J)};h.xa=function(){var b=this.gb,a=this.s,c=N(this.J);return Tf.o?Tf.o(null,b,a,c):Tf.call(null,null,b,a,c)};h.U=function(){return this};h.P=function(b,a){return new hg(a,this.gb,this.s,this.J,this.u)};h.W=function(b,a){return Wc(a,this)};
hg.prototype[Ra]=function(){return Cc(this)};var Tf=function Tf(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Tf.b(arguments[0]);case 4:return Tf.o(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};Tf.b=function(b){return Tf.o(null,b,0,null)};
Tf.o=function(b,a,c,d){if(null==d)for(d=a.length;;)if(c<d){var e=a[c];if(x(e)&&(e=e.Wb(),x(e)))return new hg(b,a,c+1,e,null);c+=1}else return null;else return new hg(b,a,c,d,null)};Tf.w=4;Qf;function ig(b,a,c){this.Aa=b;this.Mc=a;this.tc=c}ig.prototype.ya=function(){return this.tc&&this.Mc.ya()};ig.prototype.next=function(){if(this.tc)return this.Mc.next();this.tc=!0;return this.Aa};ig.prototype.remove=function(){return Error("Unsupported operation")};
function jd(b,a,c,d,e,f){this.v=b;this.m=a;this.root=c;this.za=d;this.Aa=e;this.u=f;this.g=16123663;this.B=8196}h=jd.prototype;h.toString=function(){return fc(this)};h.equiv=function(b){return this.C(null,b)};h.keys=function(){return Cc(Kf.b?Kf.b(this):Kf.call(null,this))};h.entries=function(){return Ff(L(this))};h.values=function(){return Cc(Lf.b?Lf.b(this):Lf.call(null,this))};h.has=function(b){return Cd(this,b)};h.get=function(b,a){return this.I(null,b,a)};
h.forEach=function(b){for(var a=L(this),c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e),g=R(f,0),f=R(f,1);b.a?b.a(f,g):b.call(null,f,g);e+=1}else if(a=L(a))wd(a)?(c=Xb(a),a=Yb(a),g=c,d=P(c),c=g):(c=M(a),g=R(c,0),f=R(c,1),b.a?b.a(f,g):b.call(null,f,g),a=N(a),c=null,d=0),e=0;else return null};h.N=function(b,a){return ib.c(this,a,null)};h.I=function(b,a,c){return null==a?this.za?this.Aa:c:null==this.root?c:this.root.fb(0,sc(a),a,c)};
h.Lb=function(b,a,c){b=this.za?a.c?a.c(c,null,this.Aa):a.call(null,c,null,this.Aa):c;return Pc(b)?O.b?O.b(b):O.call(null,b):null!=this.root?this.root.pb(a,b):b};h.Ga=function(){var b=this.root?dc(this.root):se;return this.za?new ig(this.Aa,b,!1):b};h.O=function(){return this.v};h.X=function(){return this.m};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Ic(this)};h.C=function(b,a){return Cf(this,a)};h.vb=function(){return new Qf({},this.root,this.m,this.za,this.Aa)};
h.da=function(){return xb(Of,this.v)};h.ib=function(b,a){if(null==a)return this.za?new jd(this.v,this.m-1,this.root,!1,null,null):this;if(null==this.root)return this;var c=this.root.Xb(0,sc(a),a);return c===this.root?this:new jd(this.v,this.m-1,c,this.za,this.Aa,null)};
h.Oa=function(b,a,c){if(null==a)return this.za&&c===this.Aa?this:new jd(this.v,this.za?this.m:this.m+1,this.root,!0,c,null);b=new Rf;a=(null==this.root?cg:this.root).Pa(0,sc(a),a,c,b);return a===this.root?this:new jd(this.v,b.H?this.m+1:this.m,a,this.za,this.Aa,null)};h.lc=function(b,a){return null==a?this.za:null==this.root?!1:this.root.fb(0,sc(a),a,zd)!==zd};h.U=function(){if(0<this.m){var b=null!=this.root?this.root.Wb():null;return this.za?Wc(new V(null,2,5,W,[null,this.Aa],null),b):b}return null};
h.P=function(b,a){return new jd(a,this.m,this.root,this.za,this.Aa,this.u)};h.W=function(b,a){if(td(a))return kb(this,G.a(a,0),G.a(a,1));for(var c=this,d=L(a);;){if(null==d)return c;var e=M(d);if(td(e))c=kb(c,G.a(e,0),G.a(e,1)),d=N(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
h.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.N(null,b);case 3:return this.I(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=function(a,b){return this.N(null,b)};b.c=function(a,b,d){return this.I(null,b,d)};return b}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ta(a)))};h.b=function(b){return this.N(null,b)};h.a=function(b,a){return this.I(null,b,a)};var Of=new jd(null,0,null,!1,null,Jc);
function ld(b,a){for(var c=b.length,d=0,e=Nb(Of);;)if(d<c)var f=d+1,e=e.Qb(null,b[d],a[d]),d=f;else return Pb(e)}jd.prototype[Ra]=function(){return Cc(this)};function Qf(b,a,c,d,e){this.V=b;this.root=a;this.count=c;this.za=d;this.Aa=e;this.g=258;this.B=56}function jg(b,a,c){if(b.V){if(null==a)b.Aa!==c&&(b.Aa=c),b.za||(b.count+=1,b.za=!0);else{var d=new Rf;a=(null==b.root?cg:b.root).Qa(b.V,0,sc(a),a,c,d);a!==b.root&&(b.root=a);d.H&&(b.count+=1)}return b}throw Error("assoc! after persistent!");}h=Qf.prototype;
h.X=function(){if(this.V)return this.count;throw Error("count after persistent!");};h.N=function(b,a){return null==a?this.za?this.Aa:null:null==this.root?null:this.root.fb(0,sc(a),a)};h.I=function(b,a,c){return null==a?this.za?this.Aa:c:null==this.root?c:this.root.fb(0,sc(a),a,c)};
h.Rb=function(b,a){var c;a:if(this.V)if(null!=a?a.g&2048||a.Vc||(a.g?0:Oa(nb,a)):Oa(nb,a))c=jg(this,Td.b?Td.b(a):Td.call(null,a),Ud.b?Ud.b(a):Ud.call(null,a));else{c=L(a);for(var d=this;;){var e=M(c);if(x(e))c=N(c),d=jg(d,Td.b?Td.b(e):Td.call(null,e),Ud.b?Ud.b(e):Ud.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};h.Sb=function(){var b;if(this.V)this.V=null,b=new jd(null,this.count,this.root,this.za,this.Aa,null);else throw Error("persistent! called twice");return b};
h.Qb=function(b,a,c){return jg(this,a,c)};kg;lg;var mg=function mg(a,c,d){d=null!=a.left?mg(a.left,c,d):d;if(Pc(d))return O.b?O.b(d):O.call(null,d);var e=a.key,f=a.H;d=c.c?c.c(d,e,f):c.call(null,d,e,f);if(Pc(d))return O.b?O.b(d):O.call(null,d);a=null!=a.right?mg(a.right,c,d):d;return Pc(a)?O.b?O.b(a):O.call(null,a):a};function lg(b,a,c,d,e){this.key=b;this.H=a;this.left=c;this.right=d;this.u=e;this.g=32402207;this.B=0}h=lg.prototype;h.replace=function(b,a,c,d){return new lg(b,a,c,d,null)};
h.pb=function(b,a){return mg(this,b,a)};h.N=function(b,a){return G.c(this,a,null)};h.I=function(b,a,c){return G.c(this,a,c)};h.ca=function(b,a){return 0===a?this.key:1===a?this.H:null};h.Ea=function(b,a,c){return 0===a?this.key:1===a?this.H:c};h.kb=function(b,a,c){return(new V(null,2,5,W,[this.key,this.H],null)).kb(null,a,c)};h.O=function(){return null};h.X=function(){return 2};h.Mb=function(){return this.key};h.Nb=function(){return this.H};h.jb=function(){return this.H};
h.T=function(){var b=this.u;return null!=b?b:this.u=b=Gc(this)};h.C=function(b,a){return Lc(this,a)};h.da=function(){return gd};h.ea=function(b,a){return Qc(this,a)};h.fa=function(b,a,c){return Rc(this,a,c)};h.Oa=function(b,a,c){return kd.c(new V(null,2,5,W,[this.key,this.H],null),a,c)};h.U=function(){return bb(bb(zc,this.H),this.key)};h.P=function(b,a){return Mc(new V(null,2,5,W,[this.key,this.H],null),a)};h.W=function(b,a){return new V(null,3,5,W,[this.key,this.H,a],null)};
h.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.N(null,b);case 3:return this.I(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=function(a,b){return this.N(null,b)};b.c=function(a,b,d){return this.I(null,b,d)};return b}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ta(a)))};h.b=function(b){return this.N(null,b)};h.a=function(b,a){return this.I(null,b,a)};lg.prototype[Ra]=function(){return Cc(this)};
function kg(b,a,c,d,e){this.key=b;this.H=a;this.left=c;this.right=d;this.u=e;this.g=32402207;this.B=0}h=kg.prototype;h.replace=function(b,a,c,d){return new kg(b,a,c,d,null)};h.pb=function(b,a){return mg(this,b,a)};h.N=function(b,a){return G.c(this,a,null)};h.I=function(b,a,c){return G.c(this,a,c)};h.ca=function(b,a){return 0===a?this.key:1===a?this.H:null};h.Ea=function(b,a,c){return 0===a?this.key:1===a?this.H:c};h.kb=function(b,a,c){return(new V(null,2,5,W,[this.key,this.H],null)).kb(null,a,c)};
h.O=function(){return null};h.X=function(){return 2};h.Mb=function(){return this.key};h.Nb=function(){return this.H};h.jb=function(){return this.H};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Gc(this)};h.C=function(b,a){return Lc(this,a)};h.da=function(){return gd};h.ea=function(b,a){return Qc(this,a)};h.fa=function(b,a,c){return Rc(this,a,c)};h.Oa=function(b,a,c){return kd.c(new V(null,2,5,W,[this.key,this.H],null),a,c)};h.U=function(){return bb(bb(zc,this.H),this.key)};
h.P=function(b,a){return Mc(new V(null,2,5,W,[this.key,this.H],null),a)};h.W=function(b,a){return new V(null,3,5,W,[this.key,this.H,a],null)};h.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.N(null,b);case 3:return this.I(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=function(a,b){return this.N(null,b)};b.c=function(a,b,d){return this.I(null,b,d)};return b}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ta(a)))};
h.b=function(b){return this.N(null,b)};h.a=function(b,a){return this.I(null,b,a)};kg.prototype[Ra]=function(){return Cc(this)};Td;var Kc=function Kc(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Kc.j(0<c.length?new xc(c.slice(0),0):null)};Kc.j=function(b){for(var a=L(b),c=Nb(Of);;)if(a){b=N(N(a));var d=M(a),a=dd(a),c=Sb(c,d,a),a=b}else return Pb(c)};Kc.w=0;Kc.D=function(b){return Kc.j(L(b))};
function ng(b,a){this.K=b;this.Da=a;this.g=32374988;this.B=0}h=ng.prototype;h.toString=function(){return fc(this)};h.equiv=function(b){return this.C(null,b)};h.O=function(){return this.Da};h.wa=function(){var b=(null!=this.K?this.K.g&128||this.K.ac||(this.K.g?0:Oa(gb,this.K)):Oa(gb,this.K))?this.K.wa(null):N(this.K);return null==b?null:new ng(b,this.Da)};h.T=function(){return Gc(this)};h.C=function(b,a){return Lc(this,a)};h.da=function(){return Mc(zc,this.Da)};h.ea=function(b,a){return bd.a(a,this)};
h.fa=function(b,a,c){return bd.c(a,c,this)};h.ta=function(){return this.K.ta(null).Mb(null)};h.xa=function(){var b=(null!=this.K?this.K.g&128||this.K.ac||(this.K.g?0:Oa(gb,this.K)):Oa(gb,this.K))?this.K.wa(null):N(this.K);return null!=b?new ng(b,this.Da):zc};h.U=function(){return this};h.P=function(b,a){return new ng(this.K,a)};h.W=function(b,a){return Wc(a,this)};ng.prototype[Ra]=function(){return Cc(this)};function Kf(b){return(b=L(b))?new ng(b,null):null}function Td(b){return ob(b)}
function og(b,a){this.K=b;this.Da=a;this.g=32374988;this.B=0}h=og.prototype;h.toString=function(){return fc(this)};h.equiv=function(b){return this.C(null,b)};h.O=function(){return this.Da};h.wa=function(){var b=(null!=this.K?this.K.g&128||this.K.ac||(this.K.g?0:Oa(gb,this.K)):Oa(gb,this.K))?this.K.wa(null):N(this.K);return null==b?null:new og(b,this.Da)};h.T=function(){return Gc(this)};h.C=function(b,a){return Lc(this,a)};h.da=function(){return Mc(zc,this.Da)};h.ea=function(b,a){return bd.a(a,this)};
h.fa=function(b,a,c){return bd.c(a,c,this)};h.ta=function(){return this.K.ta(null).Nb(null)};h.xa=function(){var b=(null!=this.K?this.K.g&128||this.K.ac||(this.K.g?0:Oa(gb,this.K)):Oa(gb,this.K))?this.K.wa(null):N(this.K);return null!=b?new og(b,this.Da):zc};h.U=function(){return this};h.P=function(b,a){return new og(this.K,a)};h.W=function(b,a){return Wc(a,this)};og.prototype[Ra]=function(){return Cc(this)};function Lf(b){return(b=L(b))?new og(b,null):null}function Ud(b){return pb(b)}
var pg=function pg(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return pg.j(0<c.length?new xc(c.slice(0),0):null)};pg.j=function(b){return x(ze(Gd,b))?Ua.a(function(a,b){return fd.a(x(a)?a:we,b)},b):null};pg.w=0;pg.D=function(b){return pg.j(L(b))};qg;function rg(b){this.Db=b}rg.prototype.ya=function(){return this.Db.ya()};rg.prototype.next=function(){if(this.Db.ya())return this.Db.next().R[0];throw Error("No such element");};rg.prototype.remove=function(){return Error("Unsupported operation")};
function sg(b,a,c){this.v=b;this.nb=a;this.u=c;this.g=15077647;this.B=8196}h=sg.prototype;h.toString=function(){return fc(this)};h.equiv=function(b){return this.C(null,b)};h.keys=function(){return Cc(L(this))};h.entries=function(){var b=L(this);return new Gf(L(b))};h.values=function(){return Cc(L(this))};h.has=function(b){return Cd(this,b)};
h.forEach=function(b){for(var a=L(this),c=null,d=0,e=0;;)if(e<d){var f=c.ca(null,e),g=R(f,0),f=R(f,1);b.a?b.a(f,g):b.call(null,f,g);e+=1}else if(a=L(a))wd(a)?(c=Xb(a),a=Yb(a),g=c,d=P(c),c=g):(c=M(a),g=R(c,0),f=R(c,1),b.a?b.a(f,g):b.call(null,f,g),a=N(a),c=null,d=0),e=0;else return null};h.N=function(b,a){return ib.c(this,a,null)};h.I=function(b,a,c){return jb(this.nb,a)?a:c};h.Ga=function(){return new rg(dc(this.nb))};h.O=function(){return this.v};h.X=function(){return Xa(this.nb)};
h.T=function(){var b=this.u;return null!=b?b:this.u=b=Ic(this)};h.C=function(b,a){return qd(a)&&P(this)===P(a)&&ye(function(a){return function(b){return Cd(a,b)}}(this),a)};h.vb=function(){return new qg(Nb(this.nb))};h.da=function(){return Mc(tg,this.v)};h.U=function(){return Kf(this.nb)};h.P=function(b,a){return new sg(a,this.nb,this.u)};h.W=function(b,a){return new sg(this.v,kd.c(this.nb,a,null),null)};
h.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.N(null,b);case 3:return this.I(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.a=function(a,b){return this.N(null,b)};b.c=function(a,b,d){return this.I(null,b,d)};return b}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ta(a)))};h.b=function(b){return this.N(null,b)};h.a=function(b,a){return this.I(null,b,a)};var tg=new sg(null,we,Jc);sg.prototype[Ra]=function(){return Cc(this)};
function qg(b){this.cb=b;this.B=136;this.g=259}h=qg.prototype;h.Rb=function(b,a){this.cb=Sb(this.cb,a,null);return this};h.Sb=function(){return new sg(null,Pb(this.cb),null)};h.X=function(){return P(this.cb)};h.N=function(b,a){return ib.c(this,a,null)};h.I=function(b,a,c){return ib.c(this.cb,a,zd)===zd?c:a};
h.call=function(){function b(a,b,c){return ib.c(this.cb,b,zd)===zd?c:b}function a(a,b){return ib.c(this.cb,b,zd)===zd?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return a.call(this,c,e);case 3:return b.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=a;c.c=b;return c}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ta(a)))};h.b=function(b){return ib.c(this.cb,b,zd)===zd?null:b};h.a=function(b,a){return ib.c(this.cb,b,zd)===zd?a:b};
function ug(b){for(var a=gd;;)if(N(b))a=fd.a(a,M(b)),b=N(b);else return L(a)}function Sd(b){if(null!=b&&(b.B&4096||b.Xc))return b.Ob(null);if("string"===typeof b)return b;throw Error([D("Doesn't support name: "),D(b)].join(""));}function vg(b,a){return new de(null,function(){var c=L(a);if(c){var d;d=M(c);d=b.b?b.b(d):b.call(null,d);c=x(d)?Wc(M(c),vg(b,yc(c))):null}else c=null;return c},null,null)}function wg(b,a,c){this.s=b;this.end=a;this.step=c}
wg.prototype.ya=function(){return 0<this.step?this.s<this.end:this.s>this.end};wg.prototype.next=function(){var b=this.s;this.s+=this.step;return b};function xg(b,a,c,d,e){this.v=b;this.start=a;this.end=c;this.step=d;this.u=e;this.g=32375006;this.B=8192}h=xg.prototype;h.toString=function(){return fc(this)};h.equiv=function(b){return this.C(null,b)};
h.ca=function(b,a){if(a<Xa(this))return this.start+a*this.step;if(this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};h.Ea=function(b,a,c){return a<Xa(this)?this.start+a*this.step:this.start>this.end&&0===this.step?this.start:c};h.Ga=function(){return new wg(this.start,this.end,this.step)};h.O=function(){return this.v};
h.wa=function(){return 0<this.step?this.start+this.step<this.end?new xg(this.v,this.start+this.step,this.end,this.step,null):null:this.start+this.step>this.end?new xg(this.v,this.start+this.step,this.end,this.step,null):null};h.X=function(){return Na(Fb(this))?0:Math.ceil((this.end-this.start)/this.step)};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Gc(this)};h.C=function(b,a){return Lc(this,a)};h.da=function(){return Mc(zc,this.v)};h.ea=function(b,a){return Qc(this,a)};
h.fa=function(b,a,c){for(b=this.start;;)if(0<this.step?b<this.end:b>this.end){c=a.a?a.a(c,b):a.call(null,c,b);if(Pc(c))return O.b?O.b(c):O.call(null,c);b+=this.step}else return c};h.ta=function(){return null==Fb(this)?null:this.start};h.xa=function(){return null!=Fb(this)?new xg(this.v,this.start+this.step,this.end,this.step,null):zc};h.U=function(){return 0<this.step?this.start<this.end?this:null:0>this.step?this.start>this.end?this:null:this.start===this.end?null:this};
h.P=function(b,a){return new xg(a,this.start,this.end,this.step,this.u)};h.W=function(b,a){return Wc(a,this)};xg.prototype[Ra]=function(){return Cc(this)};function yg(b,a){return new de(null,function(){var c=L(a);if(c){var d=M(c),e=b.b?b.b(d):b.call(null,d),d=Wc(d,vg(function(a,c){return function(a){return nc.a(c,b.b?b.b(a):b.call(null,a))}}(d,e,c,c),N(c)));return Wc(d,yg(b,L(Ne(P(d),c))))}return null},null,null)}
function zg(b){return new de(null,function(){var a=L(b);return a?Ag(Id,M(a),yc(a)):bb(zc,Id.l?Id.l():Id.call(null))},null,null)}function Ag(b,a,c){return Wc(a,new de(null,function(){var d=L(c);if(d){var e=Ag,f;f=M(d);f=b.a?b.a(a,f):b.call(null,a,f);d=e(b,f,yc(d))}else d=null;return d},null,null))}
function Bg(b,a){return function(){function c(c,d,e){return new V(null,2,5,W,[b.c?b.c(c,d,e):b.call(null,c,d,e),a.c?a.c(c,d,e):a.call(null,c,d,e)],null)}function d(c,d){return new V(null,2,5,W,[b.a?b.a(c,d):b.call(null,c,d),a.a?a.a(c,d):a.call(null,c,d)],null)}function e(c){return new V(null,2,5,W,[b.b?b.b(c):b.call(null,c),a.b?a.b(c):a.call(null,c)],null)}function f(){return new V(null,2,5,W,[b.l?b.l():b.call(null),a.l?a.l():a.call(null)],null)}var g=null,k=function(){function c(a,b,e,f){var g=null;
if(3<arguments.length){for(var g=0,k=Array(arguments.length-3);g<k.length;)k[g]=arguments[g+3],++g;g=new xc(k,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){return new V(null,2,5,W,[F.A(b,c,e,f,g),F.A(a,c,e,f,g)],null)}c.w=3;c.D=function(a){var b=M(a);a=N(a);var c=M(a);a=N(a);var e=M(a);a=yc(a);return d(b,c,e,a)};c.j=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);
default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+3],++q;q=new xc(r,0)}return k.j(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.D=k.D;g.l=f;g.b=e;g.a=d;g.c=c;g.j=k.j;return g}()}function Cg(b){a:for(var a=b;;)if(L(a))a=N(a);else break a;return b}
function sf(b,a,c,d,e,f,g){var k=Aa;Aa=null==Aa?null:Aa-1;try{if(null!=Aa&&0>Aa)return Kb(b,"#");Kb(b,c);if(0===Ia.b(f))L(g)&&Kb(b,function(){var a=Dg.b(f);return x(a)?a:"..."}());else{if(L(g)){var l=M(g);a.c?a.c(l,b,f):a.call(null,l,b,f)}for(var m=N(g),n=Ia.b(f)-1;;)if(!m||null!=n&&0===n){L(m)&&0===n&&(Kb(b,d),Kb(b,function(){var a=Dg.b(f);return x(a)?a:"..."}()));break}else{Kb(b,d);var p=M(m);c=b;g=f;a.c?a.c(p,c,g):a.call(null,p,c,g);var q=N(m);c=n-1;m=q;n=c}}return Kb(b,e)}finally{Aa=k}}
function Eg(b,a){for(var c=L(a),d=null,e=0,f=0;;)if(f<e){var g=d.ca(null,f);Kb(b,g);f+=1}else if(c=L(c))d=c,wd(d)?(c=Xb(d),e=Yb(d),d=c,g=P(c),c=e,e=g):(g=M(d),Kb(b,g),c=N(d),d=null,e=0),f=0;else return null}var Fg={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function Gg(b){return[D('"'),D(b.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return Fg[a]})),D('"')].join("")}Hg;
function Ig(b,a){var c=Bd(J.a(b,Ga));return c?(c=null!=a?a.g&131072||a.Wc?!0:!1:!1)?null!=od(a):c:c}
function Jg(b,a,c){if(null==b)return Kb(a,"nil");if(Ig(c,b)){Kb(a,"^");var d=od(b);tf.c?tf.c(d,a,c):tf.call(null,d,a,c);Kb(a," ")}if(b.xb)return b.Tb(b,a,c);if(null!=b&&(b.g&2147483648||b.Z))return b.M(null,a,c);if(!0===b||!1===b||"number"===typeof b)return Kb(a,""+D(b));if(null!=b&&b.constructor===Object)return Kb(a,"#js "),d=T.a(function(a){return new V(null,2,5,W,[ce.b(a),b[a]],null)},xd(b)),Hg.o?Hg.o(d,tf,a,c):Hg.call(null,d,tf,a,c);if(Ma(b))return sf(a,tf,"#js ["," ","]",c,b);if("string"==typeof b)return x(Fa.b(c))?
Kb(a,Gg(b)):Kb(a,b);if(ea(b)){var e=b.name;c=x(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return Eg(a,K(["#object[",c,' "',""+D(b),'"]'],0))}if(b instanceof Date)return c=function(a,b){for(var c=""+D(a);;)if(P(c)<b)c=[D("0"),D(c)].join("");else return c},Eg(a,K(['#inst "',""+D(b.getUTCFullYear()),"-",c(b.getUTCMonth()+1,2),"-",c(b.getUTCDate(),2),"T",c(b.getUTCHours(),2),":",c(b.getUTCMinutes(),2),":",c(b.getUTCSeconds(),2),".",c(b.getUTCMilliseconds(),3),"-",'00:00"'],
0));if(b instanceof RegExp)return Eg(a,K(['#"',b.source,'"'],0));if(null!=b&&(b.g&2147483648||b.Z))return Lb(b,a,c);if(x(b.constructor.eb))return Eg(a,K(["#object[",b.constructor.eb.replace(RegExp("/","g"),"."),"]"],0));e=b.constructor.name;c=x(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return Eg(a,K(["#object[",c," ",""+D(b),"]"],0))}function tf(b,a,c){var d=Kg.b(c);return x(d)?(c=kd.c(c,Lg,Jg),d.c?d.c(b,a,c):d.call(null,b,a,c)):Jg(b,a,c)}
var Ie=function Ie(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Ie.j(0<c.length?new xc(c.slice(0),0):null)};Ie.j=function(b){var a=Ca();if(pd(b))a="";else{var c=D,d=new ra;a:{var e=new ec(d);tf(M(b),e,a);b=L(N(b));for(var f=null,g=0,k=0;;)if(k<g){var l=f.ca(null,k);Kb(e," ");tf(l,e,a);k+=1}else if(b=L(b))f=b,wd(f)?(b=Xb(f),g=Yb(f),f=b,l=P(b),b=g,g=l):(l=M(f),Kb(e," "),tf(l,e,a),b=N(f),f=null,g=0),k=0;else break a}a=""+c(d)}return a};Ie.w=0;Ie.D=function(b){return Ie.j(L(b))};
function Hg(b,a,c,d){return sf(c,function(b,c,d){var k=ob(b);a.c?a.c(k,c,d):a.call(null,k,c,d);Kb(c," ");b=pb(b);return a.c?a.c(b,c,d):a.call(null,b,c,d)},"{",", ","}",d,L(b))}Le.prototype.Z=!0;Le.prototype.M=function(b,a,c){Kb(a,"#object [cljs.core.Volatile ");tf(new v(null,1,[Mg,this.state],null),a,c);return Kb(a,"]")};xc.prototype.Z=!0;xc.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};de.prototype.Z=!0;de.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};
gg.prototype.Z=!0;gg.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};lg.prototype.Z=!0;lg.prototype.M=function(b,a,c){return sf(a,tf,"["," ","]",c,this)};Jf.prototype.Z=!0;Jf.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};Ec.prototype.Z=!0;Ec.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};vd.prototype.Z=!0;vd.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};ae.prototype.Z=!0;
ae.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};Xc.prototype.Z=!0;Xc.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};jd.prototype.Z=!0;jd.prototype.M=function(b,a,c){return Hg(this,tf,a,c)};hg.prototype.Z=!0;hg.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};xf.prototype.Z=!0;xf.prototype.M=function(b,a,c){return sf(a,tf,"["," ","]",c,this)};sg.prototype.Z=!0;sg.prototype.M=function(b,a,c){return sf(a,tf,"#{"," ","}",c,this)};ud.prototype.Z=!0;
ud.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};Ge.prototype.Z=!0;Ge.prototype.M=function(b,a,c){Kb(a,"#object [cljs.core.Atom ");tf(new v(null,1,[Mg,this.state],null),a,c);return Kb(a,"]")};og.prototype.Z=!0;og.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};kg.prototype.Z=!0;kg.prototype.M=function(b,a,c){return sf(a,tf,"["," ","]",c,this)};V.prototype.Z=!0;V.prototype.M=function(b,a,c){return sf(a,tf,"["," ","]",c,this)};Zd.prototype.Z=!0;
Zd.prototype.M=function(b,a){return Kb(a,"()")};xe.prototype.Z=!0;xe.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};v.prototype.Z=!0;v.prototype.M=function(b,a,c){return Hg(this,tf,a,c)};xg.prototype.Z=!0;xg.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};ng.prototype.Z=!0;ng.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};Yc.prototype.Z=!0;Yc.prototype.M=function(b,a,c){return sf(a,tf,"("," ",")",c,this)};mc.prototype.Ib=!0;
mc.prototype.ub=function(b,a){if(a instanceof mc)return uc(this,a);throw Error([D("Cannot compare "),D(this),D(" to "),D(a)].join(""));};y.prototype.Ib=!0;y.prototype.ub=function(b,a){if(a instanceof y)return be(this,a);throw Error([D("Cannot compare "),D(this),D(" to "),D(a)].join(""));};xf.prototype.Ib=!0;xf.prototype.ub=function(b,a){if(td(a))return Dd(this,a);throw Error([D("Cannot compare "),D(this),D(" to "),D(a)].join(""));};V.prototype.Ib=!0;
V.prototype.ub=function(b,a){if(td(a))return Dd(this,a);throw Error([D("Cannot compare "),D(this),D(" to "),D(a)].join(""));};var Ng=null;function Og(b){null==Ng&&(Ng=X.b?X.b(0):X.call(null,0));return vc.b([D(b),D(Ke.a(Ng,Nc))].join(""))}function Pg(b){return function(a,c){var d=b.a?b.a(a,c):b.call(null,a,c);return Pc(d)?new Oc(d):d}}
function Ue(b){return function(a){return function(){function c(b,c){return Ua.c(a,b,c)}function d(a){return b.b?b.b(a):b.call(null,a)}function e(){return b.l?b.l():b.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.l=e;f.b=d;f.a=c;return f}()}(Pg(b))}Qg;function Rg(){}
var Sg=function Sg(a){if(null!=a&&null!=a.Tc)return a.Tc(a);var c=Sg[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Sg._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("IEncodeJS.-clj-\x3ejs",a);};Tg;function Ug(b){return(null!=b?b.Sc||(b.ec?0:Oa(Rg,b)):Oa(Rg,b))?Sg(b):"string"===typeof b||"number"===typeof b||b instanceof y||b instanceof mc?Tg.b?Tg.b(b):Tg.call(null,b):Ie.j(K([b],0))}
var Tg=function Tg(a){if(null==a)return null;if(null!=a?a.Sc||(a.ec?0:Oa(Rg,a)):Oa(Rg,a))return Sg(a);if(a instanceof y)return Sd(a);if(a instanceof mc)return""+D(a);if(sd(a)){var c={};a=L(a);for(var d=null,e=0,f=0;;)if(f<e){var g=d.ca(null,f),k=R(g,0),g=R(g,1);c[Ug(k)]=Tg(g);f+=1}else if(a=L(a))wd(a)?(e=Xb(a),a=Yb(a),d=e,e=P(e)):(e=M(a),d=R(e,0),e=R(e,1),c[Ug(d)]=Tg(e),a=N(a),d=null,e=0),f=0;else break;return c}if(null==a?0:null!=a?a.g&8||a.wd||(a.g?0:Oa(ab,a)):Oa(ab,a)){c=[];a=L(T.a(Tg,a));d=null;
for(f=e=0;;)if(f<e)k=d.ca(null,f),c.push(k),f+=1;else if(a=L(a))d=a,wd(d)?(a=Xb(d),f=Yb(d),d=a,e=P(a),a=f):(a=M(d),c.push(a),a=N(d),d=null,e=0),f=0;else break;return c}return a},Qg=function Qg(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Qg.l();case 1:return Qg.b(arguments[0]);default:throw Error([D("Invalid arity: "),D(c.length)].join(""));}};Qg.l=function(){return Qg.b(1)};Qg.b=function(b){return Math.random()*b};Qg.w=1;
var Vg=null;function Wg(){if(null==Vg){var b=new v(null,3,[Xg,we,Yg,we,Zg,we],null);Vg=X.b?X.b(b):X.call(null,b)}return Vg}function $g(b,a,c){var d=nc.a(a,c);if(!d&&!(d=Cd(Zg.b(b).call(null,a),c))&&(d=td(c))&&(d=td(a)))if(d=P(c)===P(a))for(var d=!0,e=0;;)if(d&&e!==P(c))d=$g(b,a.b?a.b(e):a.call(null,e),c.b?c.b(e):c.call(null,e)),e+=1;else return d;else return d;else return d}function ah(b){var a;a=Wg();a=O.b?O.b(a):O.call(null,a);return re(J.a(Xg.b(a),b))}
function bh(b,a,c,d){Ke.a(b,function(){return O.b?O.b(a):O.call(null,a)});Ke.a(c,function(){return O.b?O.b(d):O.call(null,d)})}var ch=function ch(a,c,d){var e=(O.b?O.b(d):O.call(null,d)).call(null,a),e=x(x(e)?e.b?e.b(c):e.call(null,c):e)?!0:null;if(x(e))return e;e=function(){for(var e=ah(c);;)if(0<P(e))ch(a,M(e),d),e=yc(e);else return null}();if(x(e))return e;e=function(){for(var e=ah(a);;)if(0<P(e))ch(M(e),c,d),e=yc(e);else return null}();return x(e)?e:!1};
function dh(b,a,c){c=ch(b,a,c);if(x(c))b=c;else{c=$g;var d;d=Wg();d=O.b?O.b(d):O.call(null,d);b=c(d,b,a)}return b}
var eh=function eh(a,c,d,e,f,g,k){var l=Ua.c(function(e,g){var k=R(g,0);R(g,1);if($g(O.b?O.b(d):O.call(null,d),c,k)){var l;l=(l=null==e)?l:dh(k,M(e),f);l=x(l)?g:e;if(!x(dh(M(l),k,f)))throw Error([D("Multiple methods in multimethod '"),D(a),D("' match dispatch value: "),D(c),D(" -\x3e "),D(k),D(" and "),D(M(l)),D(", and neither is preferred")].join(""));return l}return e},null,O.b?O.b(e):O.call(null,e));if(x(l)){if(nc.a(O.b?O.b(k):O.call(null,k),O.b?O.b(d):O.call(null,d)))return Ke.o(g,kd,c,dd(l)),
dd(l);bh(g,e,k,d);return eh(a,c,d,e,f,g,k)}return null};function fh(b,a){throw Error([D("No method in multimethod '"),D(b),D("' for dispatch value: "),D(a)].join(""));}function gh(b,a,c,d,e,f,g,k){this.name=b;this.i=a;this.ed=c;this.Vb=d;this.Eb=e;this.pd=f;this.Yb=g;this.Hb=k;this.g=4194305;this.B=4352}h=gh.prototype;
h.call=function(){function b(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,A,E,H,I){a=this;var sa=F.j(a.i,b,c,d,e,K([f,g,k,l,m,n,p,q,r,t,w,z,C,A,E,H,I],0)),ak=hh(this,sa);x(ak)||fh(a.name,sa);return F.j(ak,b,c,d,e,K([f,g,k,l,m,n,p,q,r,t,w,z,C,A,E,H,I],0))}function a(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,A,E,H){a=this;var I=a.i.qa?a.i.qa(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,A,E,H):a.i.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,A,E,H),sa=hh(this,I);x(sa)||fh(a.name,I);return sa.qa?sa.qa(b,c,d,e,f,g,k,l,m,n,p,q,r,
t,w,z,C,A,E,H):sa.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,A,E,H)}function c(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,A,E){a=this;var H=a.i.pa?a.i.pa(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,A,E):a.i.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,A,E),I=hh(this,H);x(I)||fh(a.name,H);return I.pa?I.pa(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,A,E):I.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,A,E)}function d(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,A){a=this;var E=a.i.oa?a.i.oa(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,A):a.i.call(null,
b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,A),H=hh(this,E);x(H)||fh(a.name,E);return H.oa?H.oa(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,A):H.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,A)}function e(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C){a=this;var A=a.i.na?a.i.na(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C):a.i.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C),E=hh(this,A);x(E)||fh(a.name,A);return E.na?E.na(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C):E.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C)}function f(a,b,c,d,e,f,g,k,l,m,n,p,q,r,
t,w,z){a=this;var C=a.i.ma?a.i.ma(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z):a.i.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z),A=hh(this,C);x(A)||fh(a.name,C);return A.ma?A.ma(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z):A.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z)}function g(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w){a=this;var z=a.i.la?a.i.la(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w):a.i.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w),C=hh(this,z);x(C)||fh(a.name,z);return C.la?C.la(b,c,d,e,f,g,k,l,m,n,p,q,r,t,w):C.call(null,b,c,d,e,f,g,k,l,m,n,p,
q,r,t,w)}function k(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t){a=this;var w=a.i.ka?a.i.ka(b,c,d,e,f,g,k,l,m,n,p,q,r,t):a.i.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t),z=hh(this,w);x(z)||fh(a.name,w);return z.ka?z.ka(b,c,d,e,f,g,k,l,m,n,p,q,r,t):z.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r,t)}function l(a,b,c,d,e,f,g,k,l,m,n,p,q,r){a=this;var t=a.i.ja?a.i.ja(b,c,d,e,f,g,k,l,m,n,p,q,r):a.i.call(null,b,c,d,e,f,g,k,l,m,n,p,q,r),w=hh(this,t);x(w)||fh(a.name,t);return w.ja?w.ja(b,c,d,e,f,g,k,l,m,n,p,q,r):w.call(null,b,c,d,e,f,
g,k,l,m,n,p,q,r)}function m(a,b,c,d,e,f,g,k,l,m,n,p,q){a=this;var r=a.i.ia?a.i.ia(b,c,d,e,f,g,k,l,m,n,p,q):a.i.call(null,b,c,d,e,f,g,k,l,m,n,p,q),t=hh(this,r);x(t)||fh(a.name,r);return t.ia?t.ia(b,c,d,e,f,g,k,l,m,n,p,q):t.call(null,b,c,d,e,f,g,k,l,m,n,p,q)}function n(a,b,c,d,e,f,g,k,l,m,n,p){a=this;var q=a.i.ha?a.i.ha(b,c,d,e,f,g,k,l,m,n,p):a.i.call(null,b,c,d,e,f,g,k,l,m,n,p),r=hh(this,q);x(r)||fh(a.name,q);return r.ha?r.ha(b,c,d,e,f,g,k,l,m,n,p):r.call(null,b,c,d,e,f,g,k,l,m,n,p)}function p(a,b,
c,d,e,f,g,k,l,m,n){a=this;var p=a.i.ga?a.i.ga(b,c,d,e,f,g,k,l,m,n):a.i.call(null,b,c,d,e,f,g,k,l,m,n),q=hh(this,p);x(q)||fh(a.name,p);return q.ga?q.ga(b,c,d,e,f,g,k,l,m,n):q.call(null,b,c,d,e,f,g,k,l,m,n)}function q(a,b,c,d,e,f,g,k,l,m){a=this;var n=a.i.sa?a.i.sa(b,c,d,e,f,g,k,l,m):a.i.call(null,b,c,d,e,f,g,k,l,m),p=hh(this,n);x(p)||fh(a.name,n);return p.sa?p.sa(b,c,d,e,f,g,k,l,m):p.call(null,b,c,d,e,f,g,k,l,m)}function r(a,b,c,d,e,f,g,k,l){a=this;var m=a.i.ra?a.i.ra(b,c,d,e,f,g,k,l):a.i.call(null,
b,c,d,e,f,g,k,l),n=hh(this,m);x(n)||fh(a.name,m);return n.ra?n.ra(b,c,d,e,f,g,k,l):n.call(null,b,c,d,e,f,g,k,l)}function t(a,b,c,d,e,f,g,k){a=this;var l=a.i.ba?a.i.ba(b,c,d,e,f,g,k):a.i.call(null,b,c,d,e,f,g,k),m=hh(this,l);x(m)||fh(a.name,l);return m.ba?m.ba(b,c,d,e,f,g,k):m.call(null,b,c,d,e,f,g,k)}function w(a,b,c,d,e,f,g){a=this;var k=a.i.aa?a.i.aa(b,c,d,e,f,g):a.i.call(null,b,c,d,e,f,g),l=hh(this,k);x(l)||fh(a.name,k);return l.aa?l.aa(b,c,d,e,f,g):l.call(null,b,c,d,e,f,g)}function z(a,b,c,d,
e,f){a=this;var g=a.i.A?a.i.A(b,c,d,e,f):a.i.call(null,b,c,d,e,f),k=hh(this,g);x(k)||fh(a.name,g);return k.A?k.A(b,c,d,e,f):k.call(null,b,c,d,e,f)}function C(a,b,c,d,e){a=this;var f=a.i.o?a.i.o(b,c,d,e):a.i.call(null,b,c,d,e),g=hh(this,f);x(g)||fh(a.name,f);return g.o?g.o(b,c,d,e):g.call(null,b,c,d,e)}function E(a,b,c,d){a=this;var e=a.i.c?a.i.c(b,c,d):a.i.call(null,b,c,d),f=hh(this,e);x(f)||fh(a.name,e);return f.c?f.c(b,c,d):f.call(null,b,c,d)}function I(a,b,c){a=this;var d=a.i.a?a.i.a(b,c):a.i.call(null,
b,c),e=hh(this,d);x(e)||fh(a.name,d);return e.a?e.a(b,c):e.call(null,b,c)}function H(a,b){a=this;var c=a.i.b?a.i.b(b):a.i.call(null,b),d=hh(this,c);x(d)||fh(a.name,c);return d.b?d.b(b):d.call(null,b)}function sa(a){a=this;var b=a.i.l?a.i.l():a.i.call(null),c=hh(this,b);x(c)||fh(a.name,b);return c.l?c.l():c.call(null)}var A=null,A=function(ga,A,Q,S,ba,ca,ha,ja,ma,oa,va,Sa,ya,Ea,Qa,Za,$a,Ab,Qb,Bc,Rb,cd){switch(arguments.length){case 1:return sa.call(this,ga);case 2:return H.call(this,ga,A);case 3:return I.call(this,
ga,A,Q);case 4:return E.call(this,ga,A,Q,S);case 5:return C.call(this,ga,A,Q,S,ba);case 6:return z.call(this,ga,A,Q,S,ba,ca);case 7:return w.call(this,ga,A,Q,S,ba,ca,ha);case 8:return t.call(this,ga,A,Q,S,ba,ca,ha,ja);case 9:return r.call(this,ga,A,Q,S,ba,ca,ha,ja,ma);case 10:return q.call(this,ga,A,Q,S,ba,ca,ha,ja,ma,oa);case 11:return p.call(this,ga,A,Q,S,ba,ca,ha,ja,ma,oa,va);case 12:return n.call(this,ga,A,Q,S,ba,ca,ha,ja,ma,oa,va,Sa);case 13:return m.call(this,ga,A,Q,S,ba,ca,ha,ja,ma,oa,va,Sa,
ya);case 14:return l.call(this,ga,A,Q,S,ba,ca,ha,ja,ma,oa,va,Sa,ya,Ea);case 15:return k.call(this,ga,A,Q,S,ba,ca,ha,ja,ma,oa,va,Sa,ya,Ea,Qa);case 16:return g.call(this,ga,A,Q,S,ba,ca,ha,ja,ma,oa,va,Sa,ya,Ea,Qa,Za);case 17:return f.call(this,ga,A,Q,S,ba,ca,ha,ja,ma,oa,va,Sa,ya,Ea,Qa,Za,$a);case 18:return e.call(this,ga,A,Q,S,ba,ca,ha,ja,ma,oa,va,Sa,ya,Ea,Qa,Za,$a,Ab);case 19:return d.call(this,ga,A,Q,S,ba,ca,ha,ja,ma,oa,va,Sa,ya,Ea,Qa,Za,$a,Ab,Qb);case 20:return c.call(this,ga,A,Q,S,ba,ca,ha,ja,ma,
oa,va,Sa,ya,Ea,Qa,Za,$a,Ab,Qb,Bc);case 21:return a.call(this,ga,A,Q,S,ba,ca,ha,ja,ma,oa,va,Sa,ya,Ea,Qa,Za,$a,Ab,Qb,Bc,Rb);case 22:return b.call(this,ga,A,Q,S,ba,ca,ha,ja,ma,oa,va,Sa,ya,Ea,Qa,Za,$a,Ab,Qb,Bc,Rb,cd)}throw Error("Invalid arity: "+arguments.length);};A.b=sa;A.a=H;A.c=I;A.o=E;A.A=C;A.aa=z;A.ba=w;A.ra=t;A.sa=r;A.ga=q;A.ha=p;A.ia=n;A.ja=m;A.ka=l;A.la=k;A.ma=g;A.na=f;A.oa=e;A.pa=d;A.qa=c;A.Kb=a;A.wb=b;return A}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ta(a)))};
h.l=function(){var b=this.i.l?this.i.l():this.i.call(null),a=hh(this,b);x(a)||fh(this.name,b);return a.l?a.l():a.call(null)};h.b=function(b){var a=this.i.b?this.i.b(b):this.i.call(null,b),c=hh(this,a);x(c)||fh(this.name,a);return c.b?c.b(b):c.call(null,b)};h.a=function(b,a){var c=this.i.a?this.i.a(b,a):this.i.call(null,b,a),d=hh(this,c);x(d)||fh(this.name,c);return d.a?d.a(b,a):d.call(null,b,a)};
h.c=function(b,a,c){var d=this.i.c?this.i.c(b,a,c):this.i.call(null,b,a,c),e=hh(this,d);x(e)||fh(this.name,d);return e.c?e.c(b,a,c):e.call(null,b,a,c)};h.o=function(b,a,c,d){var e=this.i.o?this.i.o(b,a,c,d):this.i.call(null,b,a,c,d),f=hh(this,e);x(f)||fh(this.name,e);return f.o?f.o(b,a,c,d):f.call(null,b,a,c,d)};h.A=function(b,a,c,d,e){var f=this.i.A?this.i.A(b,a,c,d,e):this.i.call(null,b,a,c,d,e),g=hh(this,f);x(g)||fh(this.name,f);return g.A?g.A(b,a,c,d,e):g.call(null,b,a,c,d,e)};
h.aa=function(b,a,c,d,e,f){var g=this.i.aa?this.i.aa(b,a,c,d,e,f):this.i.call(null,b,a,c,d,e,f),k=hh(this,g);x(k)||fh(this.name,g);return k.aa?k.aa(b,a,c,d,e,f):k.call(null,b,a,c,d,e,f)};h.ba=function(b,a,c,d,e,f,g){var k=this.i.ba?this.i.ba(b,a,c,d,e,f,g):this.i.call(null,b,a,c,d,e,f,g),l=hh(this,k);x(l)||fh(this.name,k);return l.ba?l.ba(b,a,c,d,e,f,g):l.call(null,b,a,c,d,e,f,g)};
h.ra=function(b,a,c,d,e,f,g,k){var l=this.i.ra?this.i.ra(b,a,c,d,e,f,g,k):this.i.call(null,b,a,c,d,e,f,g,k),m=hh(this,l);x(m)||fh(this.name,l);return m.ra?m.ra(b,a,c,d,e,f,g,k):m.call(null,b,a,c,d,e,f,g,k)};h.sa=function(b,a,c,d,e,f,g,k,l){var m=this.i.sa?this.i.sa(b,a,c,d,e,f,g,k,l):this.i.call(null,b,a,c,d,e,f,g,k,l),n=hh(this,m);x(n)||fh(this.name,m);return n.sa?n.sa(b,a,c,d,e,f,g,k,l):n.call(null,b,a,c,d,e,f,g,k,l)};
h.ga=function(b,a,c,d,e,f,g,k,l,m){var n=this.i.ga?this.i.ga(b,a,c,d,e,f,g,k,l,m):this.i.call(null,b,a,c,d,e,f,g,k,l,m),p=hh(this,n);x(p)||fh(this.name,n);return p.ga?p.ga(b,a,c,d,e,f,g,k,l,m):p.call(null,b,a,c,d,e,f,g,k,l,m)};h.ha=function(b,a,c,d,e,f,g,k,l,m,n){var p=this.i.ha?this.i.ha(b,a,c,d,e,f,g,k,l,m,n):this.i.call(null,b,a,c,d,e,f,g,k,l,m,n),q=hh(this,p);x(q)||fh(this.name,p);return q.ha?q.ha(b,a,c,d,e,f,g,k,l,m,n):q.call(null,b,a,c,d,e,f,g,k,l,m,n)};
h.ia=function(b,a,c,d,e,f,g,k,l,m,n,p){var q=this.i.ia?this.i.ia(b,a,c,d,e,f,g,k,l,m,n,p):this.i.call(null,b,a,c,d,e,f,g,k,l,m,n,p),r=hh(this,q);x(r)||fh(this.name,q);return r.ia?r.ia(b,a,c,d,e,f,g,k,l,m,n,p):r.call(null,b,a,c,d,e,f,g,k,l,m,n,p)};h.ja=function(b,a,c,d,e,f,g,k,l,m,n,p,q){var r=this.i.ja?this.i.ja(b,a,c,d,e,f,g,k,l,m,n,p,q):this.i.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q),t=hh(this,r);x(t)||fh(this.name,r);return t.ja?t.ja(b,a,c,d,e,f,g,k,l,m,n,p,q):t.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q)};
h.ka=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r){var t=this.i.ka?this.i.ka(b,a,c,d,e,f,g,k,l,m,n,p,q,r):this.i.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r),w=hh(this,t);x(w)||fh(this.name,t);return w.ka?w.ka(b,a,c,d,e,f,g,k,l,m,n,p,q,r):w.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r)};
h.la=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t){var w=this.i.la?this.i.la(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t):this.i.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t),z=hh(this,w);x(z)||fh(this.name,w);return z.la?z.la(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t):z.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t)};
h.ma=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w){var z=this.i.ma?this.i.ma(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w):this.i.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w),C=hh(this,z);x(C)||fh(this.name,z);return C.ma?C.ma(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w):C.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w)};
h.na=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z){var C=this.i.na?this.i.na(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z):this.i.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z),E=hh(this,C);x(E)||fh(this.name,C);return E.na?E.na(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z):E.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z)};
h.oa=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C){var E=this.i.oa?this.i.oa(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C):this.i.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C),I=hh(this,E);x(I)||fh(this.name,E);return I.oa?I.oa(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C):I.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C)};
h.pa=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E){var I=this.i.pa?this.i.pa(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E):this.i.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E),H=hh(this,I);x(H)||fh(this.name,I);return H.pa?H.pa(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E):H.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E)};
h.qa=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,I){var H=this.i.qa?this.i.qa(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,I):this.i.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,I),sa=hh(this,H);x(sa)||fh(this.name,H);return sa.qa?sa.qa(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,I):sa.call(null,b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,I)};
h.Kb=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,I,H){var sa=F.j(this.i,b,a,c,d,K([e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,I,H],0)),A=hh(this,sa);x(A)||fh(this.name,sa);return F.j(A,b,a,c,d,K([e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,I,H],0))};function ih(b,a,c){Ke.o(b.Eb,kd,a,c);bh(b.Yb,b.Eb,b.Hb,b.Vb)}
function hh(b,a){nc.a(O.b?O.b(b.Hb):O.call(null,b.Hb),O.b?O.b(b.Vb):O.call(null,b.Vb))||bh(b.Yb,b.Eb,b.Hb,b.Vb);var c=(O.b?O.b(b.Yb):O.call(null,b.Yb)).call(null,a);if(x(c))return c;c=eh(b.name,a,b.Vb,b.Eb,b.pd,b.Yb,b.Hb);return x(c)?c:(O.b?O.b(b.Eb):O.call(null,b.Eb)).call(null,b.ed)}h.Ob=function(){return $b(this.name)};h.Pb=function(){return ac(this.name)};h.T=function(){return this[fa]||(this[fa]=++ia)};var jh=new y(null,"y","y",-1757859776),kh=new y(null,"path","path",-188191168),lh=new y(null,"total-velocity","total-velocity",1517450912),mh=new y(null,"penny-spacing","penny-spacing",-20780703),nh=new y(null,"supplier","supplier",18255489),oh=new y(null,"determine-capacity","determine-capacity",-452765887),ph=new y(null,"by-station","by-station",516084641),qh=new y(null,"selector","selector",762528866),rh=new y(null,"r","r",-471384190),sh=new y(null,"run","run",-1821166653),th=new y(null,"richpath",
"richpath",-150197948),uh=new y(null,"turns","turns",-1118736892),vh=new y(null,"transform","transform",1381301764),wh=new y(null,"die","die",-547192252),Ga=new y(null,"meta","meta",1499536964),xh=new y(null,"transformer","transformer",-1493470620),yh=new y(null,"color","color",1011675173),zh=new y(null,"executors","executors",-331073403),Ha=new y(null,"dup","dup",556298533),Ah=new y(null,"intaking","intaking",-1009888859),Bh=new y(null,"processing","processing",-1576405467),Ch=new y(null,"stats-history",
"stats-history",636123973),Dh=new y(null,"spout-y","spout-y",1676697606),Eh=new y(null,"stations","stations",-19744730),Fh=new y(null,"capacity","capacity",72689734),Gh=new y(null,"private","private",-558947994),Hh=new y(null,"efficient","efficient",-63016538),Ih=new y(null,"graphs?","graphs?",-270895578),Jh=new y(null,"transform*","transform*",-1613794522),Kh=new y(null,"button","button",1456579943),Lh=new y(null,"top","top",-1856271961),Mh=new y(null,"basic+efficient","basic+efficient",-970783161),
He=new y(null,"validator","validator",-1966190681),Nh=new y(null,"total-utilization","total-utilization",-1341502521),Oh=new y(null,"default","default",-1987822328),Ph=new y(null,"finally-block","finally-block",832982472),Qh=new y(null,"utilization","utilization",-1258491735),Rh=new y(null,"scenarios","scenarios",1618559369),Sh=new y(null,"value","value",305978217),Th=new y(null,"green","green",-945526839),Uh=new y(null,"section","section",-300141526),Vh=new y(null,"circle","circle",1903212362),Wh=
new y(null,"drop","drop",364481611),Xh=new y(null,"tracer","tracer",-1844475765),Yh=new y(null,"width","width",-384071477),Zh=new y(null,"supply","supply",-1701696309),$h=new y(null,"spath","spath",-1857758005),ai=new y(null,"source-spout-y","source-spout-y",1447094571),bi=new y(null,"onclick","onclick",1297553739),ci=new y(null,"dy","dy",1719547243),di=new y(null,"params","params",710516235),ei=new y(null,"total-output","total-output",1149740747),fi=new y(null,"easing","easing",735372043),Mg=new y(null,
"val","val",128701612),Y=new y(null,"recur","recur",-437573268),gi=new y(null,"type","type",1174270348),hi=new y(null,"catch-block","catch-block",1175212748),ii=new y(null,"duration","duration",1444101068),ji=new y(null,"constrained","constrained",597287981),ki=new y(null,"intaking?","intaking?",834765),Lg=new y(null,"fallback-impl","fallback-impl",-1501286995),li=new y(null,"output","output",-1105869043),Da=new y(null,"flush-on-newline","flush-on-newline",-151457939),mi=new y(null,"all","all",892129742),
ni=new y(null,"normal","normal",-1519123858),oi=new y(null,"wip","wip",-103467282),pi=new y(null,"className","className",-1983287057),Yg=new y(null,"descendants","descendants",1824886031),qi=new y(null,"size","size",1098693007),ri=new y(null,"accessor","accessor",-25476721),si=new y(null,"title","title",636505583),ti=new y(null,"no-op","no-op",-93046065),ui=new mc(null,"folder","folder",-1138554033,null),vi=new y(null,"num-needed-params","num-needed-params",-1219326097),wi=new y(null,"dropping","dropping",
125809647),xi=new y(null,"high","high",2027297808),Zg=new y(null,"ancestors","ancestors",-776045424),yi=new y(null,"style","style",-496642736),zi=new y(null,"div","div",1057191632),Fa=new y(null,"readably","readably",1129599760),Ai=new y(null,"params-idx","params-idx",340984624),Bi=new mc(null,"box","box",-1123515375,null),Dg=new y(null,"more-marker","more-marker",-14717935),Ci=new y(null,"g","g",1738089905),Di=new y(null,"update-stats","update-stats",1938193073),Ei=new y(null,"transfer-to-next-station",
"transfer-to-next-station",-114193262),Fi=new y(null,"set-spacing","set-spacing",1920968978),Gi=new y(null,"intake","intake",-108984782),Hi=new y(null,"set-up","set-up",874388242),Ii=new mc(null,"coll","coll",-1006698606,null),Ji=new y(null,"line","line",212345235),Ki=new mc(null,"val","val",1769233139,null),Li=new mc(null,"xf","xf",2042434515,null),Ia=new y(null,"print-length","print-length",1931866356),Mi=new y(null,"select*","select*",-1829914060),Ni=new y(null,"cx","cx",1272694324),Oi=new y(null,
"id","id",-1388402092),Pi=new y(null,"class","class",-2030961996),Qi=new y(null,"red","red",-969428204),Ri=new y(null,"blue","blue",-622100620),Si=new y(null,"cy","cy",755331060),Ti=new y(null,"catch-exception","catch-exception",-1997306795),Ui=new y(null,"total-input","total-input",1219129557),Xg=new y(null,"parents","parents",-2027538891),Vi=new y(null,"collect-val","collect-val",801894069),Wi=new y(null,"xlink:href","xlink:href",828777205),Xi=new y(null,"prev","prev",-1597069226),Yi=new y(null,
"svg","svg",856789142),Zi=new y(null,"bin-h","bin-h",346004918),$i=new y(null,"length","length",588987862),aj=new y(null,"continue-block","continue-block",-1852047850),bj=new y(null,"hookTransition","hookTransition",-1045887913),cj=new y(null,"tracer-reset","tracer-reset",283192087),dj=new y(null,"distribution","distribution",-284555369),ej=new y(null,"transfer-to-processed","transfer-to-processed",198231991),fj=new y(null,"roll","roll",11266999),gj=new y(null,"position","position",-2011731912),hj=
new y(null,"graphs","graphs",-1584479112),ij=new y(null,"basic","basic",1043717368),jj=new y(null,"image","image",-58725096),kj=new y(null,"d","d",1972142424),lj=new y(null,"dropping?","dropping?",-1065207176),mj=new y(null,"processed","processed",800622264),nj=new y(null,"x","x",2099068185),oj=new y(null,"x1","x1",-1863922247),pj=new y(null,"tracer-start","tracer-start",1036491225),qj=new y(null,"input","input",556931961),rj=new y(null,"transform-fns","transform-fns",669042649),ve=new mc(null,"quote",
"quote",1377916282,null),sj=new y(null,"fixed","fixed",-562004358),ue=new y(null,"arglists","arglists",1661989754),df=new y(null,"dice","dice",707777434),tj=new y(null,"y2","y2",-718691301),uj=new y(null,"set-lengths","set-lengths",742672507),te=new mc(null,"nil-iter","nil-iter",1101030523,null),vj=new y(null,"main","main",-2117802661),wj=new y(null,"hierarchy","hierarchy",-1053470341),Kg=new y(null,"alt-impl","alt-impl",670969595),xj=new mc(null,"fn-handler","fn-handler",648785851,null),yj=new y(null,
"doc","doc",1913296891),zj=new y(null,"integrate","integrate",-1653689604),Aj=new y(null,"rect","rect",-108902628),Bj=new y(null,"step","step",1288888124),Cj=new y(null,"velocity","velocity",-581524355),Dj=new y(null,"delay","delay",-574225219),Ej=new y(null,"x2","x2",-1362513475),Fj=new y(null,"pennies","pennies",1847043709),Gj=new y(null,"incoming","incoming",-1710131427),Hj=new y(null,"productivity","productivity",-890721314),Ij=new y(null,"range","range",1639692286),Jj=new y(null,"height","height",
1025178622),Kj=new y(null,"spacing","spacing",204422175),Lj=new y(null,"left","left",-399115937),Mj=new y(null,"foreignObject","foreignObject",25502111),Nj=new y(null,"text","text",-1790561697),Oj=new y(null,"data","data",-232669377),Pj=new mc(null,"f","f",43394975,null);var Qj=new v(null,3,[Zh,2,Bh,4,dj,1],null),Rj=new v(null,3,[Zh,-1,Bh,0,dj,0],null),Sj=new v(null,3,[Zh,40,Bh,40,dj,0],null);function Tj(b,a){var c=T.a(Ce.a(Qj,gi),a),d=b/Ua.a(Id,c);return T.a(De(Jd,d),c)}function Uj(b,a,c){return fd.a(a,function(){var d=null==a?null:rb(a);return b.a?b.a(d,c):b.call(null,d,c)}())}function Vj(b,a){var c=null!=b&&(b.g&64||b.F)?F.a(Kc,b):b,c=J.a(c,gi),c=a-(Sj.b?Sj.b(c):Sj.call(null,c));return c-Od(c,20)}
function Wj(b,a){var c=null!=b&&(b.g&64||b.F)?F.a(Kc,b):b,d=J.a(c,Yh),e=J.a(c,Jj),f=Tj(e,a);return T.j(function(a,b,c,d){return function(a,b,c,e){a=null!=a&&(a.g&64||a.F)?F.a(Kc,a):a;c=J.a(a,gi);b=new v(null,5,[jh,b+(Rj.b?Rj.b(c):Rj.call(null,c)),Yh,d,Zi,e,Dh,e,ai,-30],null);return pg.j(K([a,b],0))}}(f,b,c,d,e),a,Ua.c(De(Uj,Id),new V(null,1,5,W,[0],null),f),f,K([T.c(Vj,a,f)],0))}
function Xj(b,a){var c=null!=b&&(b.g&64||b.F)?F.a(Kc,b):b,d=J.a(c,Yh),e=J.a(c,Jj),f=J.a(c,nj),g=P(a),k=d/g;return T.c(function(a,b,c,d,e,f){return function(a,c){var d=new v(null,3,[nj,a,Yh,b-30,Jj,f],null),d=null!=d&&(d.g&64||d.F)?F.a(Kc,d):d,e=J.a(d,Yh),g=J.a(d,Jj),k=null!=c&&(c.g&64||c.F)?F.a(Kc,c):c;J.a(k,Eh);return af(pg.j(K([k,d],0)),Eh,De(Wj,new v(null,2,[Yh,e,Jj,g],null)))}}(g,k,b,c,d,e,f),Me(g,Re(De(Id,k),f)),a)};var Yj;a:{var Zj=aa.navigator;if(Zj){var bk=Zj.userAgent;if(bk){Yj=bk;break a}}Yj=""};var ck;function dk(b){return b.l?b.l():b.call(null)}function ek(b,a,c){return sd(c)?Bb(c,b,a):null==c?a:Ma(c)?Tc(c,b,a):zb.c(c,b,a)}
var fk=function fk(a,c,d,e){if(null!=a&&null!=a.qc)return a.qc(a,c,d,e);var f=fk[u(null==a?null:a)];if(null!=f)return f.o?f.o(a,c,d,e):f.call(null,a,c,d,e);f=fk._;if(null!=f)return f.o?f.o(a,c,d,e):f.call(null,a,c,d,e);throw B("CollFold.coll-fold",a);},gk=function gk(a,c){"undefined"===typeof ck&&(ck=function(a,c,f,g){this.gd=a;this.fc=c;this.ab=f;this.jd=g;this.g=917504;this.B=0},ck.prototype.P=function(a,c){return new ck(this.gd,this.fc,this.ab,c)},ck.prototype.O=function(){return this.jd},ck.prototype.ea=
function(a,c){return zb.c(this.fc,this.ab.b?this.ab.b(c):this.ab.call(null,c),c.l?c.l():c.call(null))},ck.prototype.fa=function(a,c,f){return zb.c(this.fc,this.ab.b?this.ab.b(c):this.ab.call(null,c),f)},ck.prototype.qc=function(a,c,f,g){return fk(this.fc,c,f,this.ab.b?this.ab.b(g):this.ab.call(null,g))},ck.ic=function(){return new V(null,4,5,W,[Mc(ui,new v(null,2,[ue,lc(ve,lc(new V(null,2,5,W,[Ii,Li],null))),yj,"Given a foldable collection, and a transformation function xf,\n  returns a foldable collection, where any supplied reducing\n  fn will be transformed by xf. xf is a function of reducing fn to\n  reducing fn."],
null)),Ii,Li,ua.Dd],null)},ck.xb=!0,ck.eb="clojure.core.reducers/t_clojure$core$reducers19004",ck.Tb=function(a,c){return Kb(c,"clojure.core.reducers/t_clojure$core$reducers19004")});return new ck(gk,a,c,we)};
function hk(b,a){return gk(a,function(a){return function(){function d(d,e,f){e=b.a?b.a(e,f):b.call(null,e,f);return a.a?a.a(d,e):a.call(null,d,e)}function e(d,e){var f=b.b?b.b(e):b.call(null,e);return a.a?a.a(d,f):a.call(null,d,f)}function f(){return a.l?a.l():a.call(null)}var g=null,g=function(a,b,c){switch(arguments.length){case 0:return f.call(this);case 2:return e.call(this,a,b);case 3:return d.call(this,a,b,c)}throw Error("Invalid arity: "+arguments.length);};g.l=f;g.a=e;g.c=d;return g}()})}
function ik(b,a){return gk(a,function(a){return function(){function d(d,e,f){return ek(a,d,b.a?b.a(e,f):b.call(null,e,f))}function e(d,e){return ek(a,d,b.b?b.b(e):b.call(null,e))}function f(){return a.l?a.l():a.call(null)}var g=null,g=function(a,b,c){switch(arguments.length){case 0:return f.call(this);case 2:return e.call(this,a,b);case 3:return d.call(this,a,b,c)}throw Error("Invalid arity: "+arguments.length);};g.l=f;g.a=e;g.c=d;return g}()})}
var jk=function jk(a,c,d,e){if(pd(a))return d.l?d.l():d.call(null);if(P(a)<=c)return ek(e,d.l?d.l():d.call(null),a);var f=Pd(P(a)),g=vf.c(a,0,f);a=vf.c(a,f,P(a));return dk(function(a,c,e,f){return function(){var a=f(c),g;g=f(e);a=a.l?a.l():a.call(null);g=g.l?g.l():g.call(null);return d.a?d.a(a,g):d.call(null,a,g)}}(f,g,a,function(a,f,g){return function(n){return function(){return function(){return jk(n,c,d,e)}}(a,f,g)}}(f,g,a)))};fk["null"]=function(b,a,c){return c.l?c.l():c.call(null)};
fk.object=function(b,a,c,d){return ek(d,c.l?c.l():c.call(null),b)};V.prototype.qc=function(b,a,c,d){return jk(this,a,c,d)};function kk(){}var lk=function lk(a,c,d){if(null!=a&&null!=a.zb)return a.zb(a,c,d);var e=lk[u(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=lk._;if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw B("StructurePath.select*",a);},mk=function mk(a,c,d){if(null!=a&&null!=a.Ab)return a.Ab(a,c,d);var e=mk[u(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=mk._;if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw B("StructurePath.transform*",a);};
function nk(){}var ok=function ok(a,c){if(null!=a&&null!=a.rc)return a.rc(0,c);var d=ok[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=ok._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("Collector.collect-val",a);};var pk=function pk(a){if(null!=a&&null!=a.Gc)return a.Gc();var c=pk[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=pk._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("PathComposer.comp-paths*",a);};function qk(b,a,c){this.type=b;this.sd=a;this.ud=c}var rk;
rk=new qk(th,function(b,a,c,d){var e=function(){return function(a,b,c,d){return pd(c)?new V(null,1,5,W,[d],null):new V(null,1,5,W,[fd.a(c,d)],null)}}(b,a,gd,d);return c.A?c.A(b,a,gd,d,e):c.call(null,b,a,gd,d,e)},function(b,a,c,d,e){var f=function(){return function(a,b,c,e){return pd(c)?d.b?d.b(e):d.call(null,e):F.a(d,fd.a(c,e))}}(b,a,gd,e);return c.A?c.A(b,a,gd,e,f):c.call(null,b,a,gd,e,f)});var sk;
sk=new qk($h,function(b,a,c,d){b=function(){return function(a){return new V(null,1,5,W,[a],null)}}(d);return c.a?c.a(d,b):c.call(null,d,b)},function(b,a,c,d,e){return c.a?c.a(e,d):c.call(null,e,d)});function tk(b,a,c,d,e,f){this.Ka=b;this.La=a;this.Ma=c;this.S=d;this.G=e;this.u=f;this.g=2229667594;this.B=8192}h=tk.prototype;h.N=function(b,a){return ib.c(this,a,null)};
h.I=function(b,a,c){switch(a instanceof y?a.Ha:null){case "executors":return this.Ka;case "selector":return this.La;case "transformer":return this.Ma;default:return J.c(this.G,a,c)}};h.M=function(b,a,c){return sf(a,function(){return function(b){return sf(a,tf,""," ","",c,b)}}(this),"#com.rpl.specter.impl.TransformFunctions{",", ","}",c,ne.a(new V(null,3,5,W,[new V(null,2,5,W,[zh,this.Ka],null),new V(null,2,5,W,[qh,this.La],null),new V(null,2,5,W,[xh,this.Ma],null)],null),this.G))};
h.Ga=function(){return new Df(0,this,3,new V(null,3,5,W,[zh,qh,xh],null),dc(this.G))};h.O=function(){return this.S};h.X=function(){return 3+P(this.G)};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Vd(this)};h.C=function(b,a){var c;c=x(a)?(c=this.constructor===a.constructor)?Cf(this,a):c:a;return x(c)?!0:!1};
h.ib=function(b,a){return Cd(new sg(null,new v(null,3,[qh,null,xh,null,zh,null],null),null),a)?md.a(Mc(Ye.a(we,this),this.S),a):new tk(this.Ka,this.La,this.Ma,this.S,re(md.a(this.G,a)),null)};
h.Oa=function(b,a,c){return x(U.a?U.a(zh,a):U.call(null,zh,a))?new tk(c,this.La,this.Ma,this.S,this.G,null):x(U.a?U.a(qh,a):U.call(null,qh,a))?new tk(this.Ka,c,this.Ma,this.S,this.G,null):x(U.a?U.a(xh,a):U.call(null,xh,a))?new tk(this.Ka,this.La,c,this.S,this.G,null):new tk(this.Ka,this.La,this.Ma,this.S,kd.c(this.G,a,c),null)};h.U=function(){return L(ne.a(new V(null,3,5,W,[new V(null,2,5,W,[zh,this.Ka],null),new V(null,2,5,W,[qh,this.La],null),new V(null,2,5,W,[xh,this.Ma],null)],null),this.G))};
h.P=function(b,a){return new tk(this.Ka,this.La,this.Ma,a,this.G,this.u)};h.W=function(b,a){return td(a)?kb(this,G.a(a,0),G.a(a,1)):Ua.c(bb,this,a)};function uk(b,a,c){return new tk(b,a,c,null,null,null)}function vk(b,a,c,d,e,f){this.va=b;this.Xa=a;this.Ya=c;this.S=d;this.G=e;this.u=f;this.g=2229667594;this.B=8192}h=vk.prototype;h.N=function(b,a){return ib.c(this,a,null)};
h.I=function(b,a,c){switch(a instanceof y?a.Ha:null){case "transform-fns":return this.va;case "params":return this.Xa;case "params-idx":return this.Ya;default:return J.c(this.G,a,c)}};h.M=function(b,a,c){return sf(a,function(){return function(b){return sf(a,tf,""," ","",c,b)}}(this),"#com.rpl.specter.impl.CompiledPath{",", ","}",c,ne.a(new V(null,3,5,W,[new V(null,2,5,W,[rj,this.va],null),new V(null,2,5,W,[di,this.Xa],null),new V(null,2,5,W,[Ai,this.Ya],null)],null),this.G))};
h.Ga=function(){return new Df(0,this,3,new V(null,3,5,W,[rj,di,Ai],null),dc(this.G))};h.O=function(){return this.S};h.X=function(){return 3+P(this.G)};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Vd(this)};h.C=function(b,a){var c;c=x(a)?(c=this.constructor===a.constructor)?Cf(this,a):c:a;return x(c)?!0:!1};
h.ib=function(b,a){return Cd(new sg(null,new v(null,3,[di,null,Ai,null,rj,null],null),null),a)?md.a(Mc(Ye.a(we,this),this.S),a):new vk(this.va,this.Xa,this.Ya,this.S,re(md.a(this.G,a)),null)};
h.Oa=function(b,a,c){return x(U.a?U.a(rj,a):U.call(null,rj,a))?new vk(c,this.Xa,this.Ya,this.S,this.G,null):x(U.a?U.a(di,a):U.call(null,di,a))?new vk(this.va,c,this.Ya,this.S,this.G,null):x(U.a?U.a(Ai,a):U.call(null,Ai,a))?new vk(this.va,this.Xa,c,this.S,this.G,null):new vk(this.va,this.Xa,this.Ya,this.S,kd.c(this.G,a,c),null)};h.U=function(){return L(ne.a(new V(null,3,5,W,[new V(null,2,5,W,[rj,this.va],null),new V(null,2,5,W,[di,this.Xa],null),new V(null,2,5,W,[Ai,this.Ya],null)],null),this.G))};
h.P=function(b,a){return new vk(this.va,this.Xa,this.Ya,a,this.G,this.u)};h.W=function(b,a){return td(a)?kb(this,G.a(a,0),G.a(a,1)):Ua.c(bb,this,a)};function wk(b){return new vk(b,null,0,null,null,null)}Z;function xk(b,a,c,d,e){this.va=b;this.rb=a;this.S=c;this.G=d;this.u=e;this.g=2229667595;this.B=8192}h=xk.prototype;h.N=function(b,a){return ib.c(this,a,null)};
h.I=function(b,a,c){switch(a instanceof y?a.Ha:null){case "transform-fns":return this.va;case "num-needed-params":return this.rb;default:return J.c(this.G,a,c)}};h.M=function(b,a,c){return sf(a,function(){return function(b){return sf(a,tf,""," ","",c,b)}}(this),"#com.rpl.specter.impl.ParamsNeededPath{",", ","}",c,ne.a(new V(null,2,5,W,[new V(null,2,5,W,[rj,this.va],null),new V(null,2,5,W,[vi,this.rb],null)],null),this.G))};h.Ga=function(){return new Df(0,this,2,new V(null,2,5,W,[rj,vi],null),dc(this.G))};
h.call=function(){function b(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,A,C,E,H,I){a=ke(ne.a(new V(null,20,5,W,[b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,A,C,E,H],null),I));return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function a(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,A,C,E,H){a=ke(20);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=w;a[15]=z;a[16]=A;a[17]=C;a[18]=E;a[19]=H;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function c(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,
w,z,A,C,E){a=ke(19);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=w;a[15]=z;a[16]=A;a[17]=C;a[18]=E;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function d(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,A,C){a=ke(18);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=w;a[15]=z;a[16]=A;a[17]=C;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function e(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,A){a=ke(17);
a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=w;a[15]=z;a[16]=A;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function f(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z){a=ke(16);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=w;a[15]=z;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function g(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w){a=ke(15);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;a[7]=l;
a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=w;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function k(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t){a=ke(14);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function l(a,b,c,d,e,f,g,k,l,m,n,p,q,r){a=ke(13);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function m(a,
b,c,d,e,f,g,k,l,m,n,p,q){a=ke(12);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function n(a,b,c,d,e,f,g,k,l,m,n,p){a=ke(11);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;a[7]=l;a[8]=m;a[9]=n;a[10]=p;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function p(a,b,c,d,e,f,g,k,l,m,n){a=ke(10);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;a[7]=l;a[8]=m;a[9]=n;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function q(a,
b,c,d,e,f,g,k,l,m){a=ke(9);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;a[7]=l;a[8]=m;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function r(a,b,c,d,e,f,g,k,l){a=ke(8);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;a[7]=l;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function t(a,b,c,d,e,f,g,k){a=ke(7);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=k;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function w(a,b,c,d,e,f,g){a=ke(6);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;return Z.c?Z.c(this,
a,0):Z.call(null,this,a,0)}function z(a,b,c,d,e,f){a=ke(5);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function C(a,b,c,d,e){a=ke(4);a[0]=b;a[1]=c;a[2]=d;a[3]=e;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function E(a,b,c,d){a=ke(3);a[0]=b;a[1]=c;a[2]=d;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function I(a,b,c){a=ke(2);a[0]=b;a[1]=c;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}function H(a,b){var c=ke(1);c[0]=b;return Z.c?Z.c(this,c,0):Z.call(null,
this,c,0)}function sa(){var a=ke(0);return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)}var A=null,A=function(A,ka,Q,S,ba,ca,ha,ja,ma,oa,va,Sa,ya,Ea,Qa,Za,$a,Ab,Qb,Bc,Rb,cd){switch(arguments.length){case 1:return sa.call(this);case 2:return H.call(this,0,ka);case 3:return I.call(this,0,ka,Q);case 4:return E.call(this,0,ka,Q,S);case 5:return C.call(this,0,ka,Q,S,ba);case 6:return z.call(this,0,ka,Q,S,ba,ca);case 7:return w.call(this,0,ka,Q,S,ba,ca,ha);case 8:return t.call(this,0,ka,Q,S,ba,ca,ha,ja);case 9:return r.call(this,
0,ka,Q,S,ba,ca,ha,ja,ma);case 10:return q.call(this,0,ka,Q,S,ba,ca,ha,ja,ma,oa);case 11:return p.call(this,0,ka,Q,S,ba,ca,ha,ja,ma,oa,va);case 12:return n.call(this,0,ka,Q,S,ba,ca,ha,ja,ma,oa,va,Sa);case 13:return m.call(this,0,ka,Q,S,ba,ca,ha,ja,ma,oa,va,Sa,ya);case 14:return l.call(this,0,ka,Q,S,ba,ca,ha,ja,ma,oa,va,Sa,ya,Ea);case 15:return k.call(this,0,ka,Q,S,ba,ca,ha,ja,ma,oa,va,Sa,ya,Ea,Qa);case 16:return g.call(this,0,ka,Q,S,ba,ca,ha,ja,ma,oa,va,Sa,ya,Ea,Qa,Za);case 17:return f.call(this,0,
ka,Q,S,ba,ca,ha,ja,ma,oa,va,Sa,ya,Ea,Qa,Za,$a);case 18:return e.call(this,0,ka,Q,S,ba,ca,ha,ja,ma,oa,va,Sa,ya,Ea,Qa,Za,$a,Ab);case 19:return d.call(this,0,ka,Q,S,ba,ca,ha,ja,ma,oa,va,Sa,ya,Ea,Qa,Za,$a,Ab,Qb);case 20:return c.call(this,0,ka,Q,S,ba,ca,ha,ja,ma,oa,va,Sa,ya,Ea,Qa,Za,$a,Ab,Qb,Bc);case 21:return a.call(this,0,ka,Q,S,ba,ca,ha,ja,ma,oa,va,Sa,ya,Ea,Qa,Za,$a,Ab,Qb,Bc,Rb);case 22:return b.call(this,0,ka,Q,S,ba,ca,ha,ja,ma,oa,va,Sa,ya,Ea,Qa,Za,$a,Ab,Qb,Bc,Rb,cd)}throw Error("Invalid arity: "+
arguments.length);};A.b=sa;A.a=H;A.c=I;A.o=E;A.A=C;A.aa=z;A.ba=w;A.ra=t;A.sa=r;A.ga=q;A.ha=p;A.ia=n;A.ja=m;A.ka=l;A.la=k;A.ma=g;A.na=f;A.oa=e;A.pa=d;A.qa=c;A.Kb=a;A.wb=b;return A}();h.apply=function(b,a){return this.call.apply(this,[this].concat(Ta(a)))};h.l=function(){var b=ke(0);return Z.c?Z.c(this,b,0):Z.call(null,this,b,0)};h.b=function(b){var a=ke(1);a[0]=b;return Z.c?Z.c(this,a,0):Z.call(null,this,a,0)};
h.a=function(b,a){var c=ke(2);c[0]=b;c[1]=a;return Z.c?Z.c(this,c,0):Z.call(null,this,c,0)};h.c=function(b,a,c){var d=ke(3);d[0]=b;d[1]=a;d[2]=c;return Z.c?Z.c(this,d,0):Z.call(null,this,d,0)};h.o=function(b,a,c,d){var e=ke(4);e[0]=b;e[1]=a;e[2]=c;e[3]=d;return Z.c?Z.c(this,e,0):Z.call(null,this,e,0)};h.A=function(b,a,c,d,e){var f=ke(5);f[0]=b;f[1]=a;f[2]=c;f[3]=d;f[4]=e;return Z.c?Z.c(this,f,0):Z.call(null,this,f,0)};
h.aa=function(b,a,c,d,e,f){var g=ke(6);g[0]=b;g[1]=a;g[2]=c;g[3]=d;g[4]=e;g[5]=f;return Z.c?Z.c(this,g,0):Z.call(null,this,g,0)};h.ba=function(b,a,c,d,e,f,g){var k=ke(7);k[0]=b;k[1]=a;k[2]=c;k[3]=d;k[4]=e;k[5]=f;k[6]=g;return Z.c?Z.c(this,k,0):Z.call(null,this,k,0)};h.ra=function(b,a,c,d,e,f,g,k){var l=ke(8);l[0]=b;l[1]=a;l[2]=c;l[3]=d;l[4]=e;l[5]=f;l[6]=g;l[7]=k;return Z.c?Z.c(this,l,0):Z.call(null,this,l,0)};
h.sa=function(b,a,c,d,e,f,g,k,l){var m=ke(9);m[0]=b;m[1]=a;m[2]=c;m[3]=d;m[4]=e;m[5]=f;m[6]=g;m[7]=k;m[8]=l;return Z.c?Z.c(this,m,0):Z.call(null,this,m,0)};h.ga=function(b,a,c,d,e,f,g,k,l,m){var n=ke(10);n[0]=b;n[1]=a;n[2]=c;n[3]=d;n[4]=e;n[5]=f;n[6]=g;n[7]=k;n[8]=l;n[9]=m;return Z.c?Z.c(this,n,0):Z.call(null,this,n,0)};h.ha=function(b,a,c,d,e,f,g,k,l,m,n){var p=ke(11);p[0]=b;p[1]=a;p[2]=c;p[3]=d;p[4]=e;p[5]=f;p[6]=g;p[7]=k;p[8]=l;p[9]=m;p[10]=n;return Z.c?Z.c(this,p,0):Z.call(null,this,p,0)};
h.ia=function(b,a,c,d,e,f,g,k,l,m,n,p){var q=ke(12);q[0]=b;q[1]=a;q[2]=c;q[3]=d;q[4]=e;q[5]=f;q[6]=g;q[7]=k;q[8]=l;q[9]=m;q[10]=n;q[11]=p;return Z.c?Z.c(this,q,0):Z.call(null,this,q,0)};h.ja=function(b,a,c,d,e,f,g,k,l,m,n,p,q){var r=ke(13);r[0]=b;r[1]=a;r[2]=c;r[3]=d;r[4]=e;r[5]=f;r[6]=g;r[7]=k;r[8]=l;r[9]=m;r[10]=n;r[11]=p;r[12]=q;return Z.c?Z.c(this,r,0):Z.call(null,this,r,0)};
h.ka=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r){var t=ke(14);t[0]=b;t[1]=a;t[2]=c;t[3]=d;t[4]=e;t[5]=f;t[6]=g;t[7]=k;t[8]=l;t[9]=m;t[10]=n;t[11]=p;t[12]=q;t[13]=r;return Z.c?Z.c(this,t,0):Z.call(null,this,t,0)};h.la=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t){var w=ke(15);w[0]=b;w[1]=a;w[2]=c;w[3]=d;w[4]=e;w[5]=f;w[6]=g;w[7]=k;w[8]=l;w[9]=m;w[10]=n;w[11]=p;w[12]=q;w[13]=r;w[14]=t;return Z.c?Z.c(this,w,0):Z.call(null,this,w,0)};
h.ma=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w){var z=ke(16);z[0]=b;z[1]=a;z[2]=c;z[3]=d;z[4]=e;z[5]=f;z[6]=g;z[7]=k;z[8]=l;z[9]=m;z[10]=n;z[11]=p;z[12]=q;z[13]=r;z[14]=t;z[15]=w;return Z.c?Z.c(this,z,0):Z.call(null,this,z,0)};h.na=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z){var C=ke(17);C[0]=b;C[1]=a;C[2]=c;C[3]=d;C[4]=e;C[5]=f;C[6]=g;C[7]=k;C[8]=l;C[9]=m;C[10]=n;C[11]=p;C[12]=q;C[13]=r;C[14]=t;C[15]=w;C[16]=z;return Z.c?Z.c(this,C,0):Z.call(null,this,C,0)};
h.oa=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C){var E=ke(18);E[0]=b;E[1]=a;E[2]=c;E[3]=d;E[4]=e;E[5]=f;E[6]=g;E[7]=k;E[8]=l;E[9]=m;E[10]=n;E[11]=p;E[12]=q;E[13]=r;E[14]=t;E[15]=w;E[16]=z;E[17]=C;return Z.c?Z.c(this,E,0):Z.call(null,this,E,0)};h.pa=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E){var I=ke(19);I[0]=b;I[1]=a;I[2]=c;I[3]=d;I[4]=e;I[5]=f;I[6]=g;I[7]=k;I[8]=l;I[9]=m;I[10]=n;I[11]=p;I[12]=q;I[13]=r;I[14]=t;I[15]=w;I[16]=z;I[17]=C;I[18]=E;return Z.c?Z.c(this,I,0):Z.call(null,this,I,0)};
h.qa=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,I){var H=ke(20);H[0]=b;H[1]=a;H[2]=c;H[3]=d;H[4]=e;H[5]=f;H[6]=g;H[7]=k;H[8]=l;H[9]=m;H[10]=n;H[11]=p;H[12]=q;H[13]=r;H[14]=t;H[15]=w;H[16]=z;H[17]=C;H[18]=E;H[19]=I;return Z.c?Z.c(this,H,0):Z.call(null,this,H,0)};h.Kb=function(b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,I,H){b=ke(ne.a(new V(null,20,5,W,[b,a,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,I],null),H));return Z.c?Z.c(this,b,0):Z.call(null,this,b,0)};h.O=function(){return this.S};
h.X=function(){return 2+P(this.G)};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Vd(this)};h.C=function(b,a){var c;c=x(a)?(c=this.constructor===a.constructor)?Cf(this,a):c:a;return x(c)?!0:!1};h.ib=function(b,a){return Cd(new sg(null,new v(null,2,[vi,null,rj,null],null),null),a)?md.a(Mc(Ye.a(we,this),this.S),a):new xk(this.va,this.rb,this.S,re(md.a(this.G,a)),null)};
h.Oa=function(b,a,c){return x(U.a?U.a(rj,a):U.call(null,rj,a))?new xk(c,this.rb,this.S,this.G,null):x(U.a?U.a(vi,a):U.call(null,vi,a))?new xk(this.va,c,this.S,this.G,null):new xk(this.va,this.rb,this.S,kd.c(this.G,a,c),null)};h.U=function(){return L(ne.a(new V(null,2,5,W,[new V(null,2,5,W,[rj,this.va],null),new V(null,2,5,W,[vi,this.rb],null)],null),this.G))};h.P=function(b,a){return new xk(this.va,this.rb,a,this.G,this.u)};h.W=function(b,a){return td(a)?kb(this,G.a(a,0),G.a(a,1)):Ua.c(bb,this,a)};
function yk(b,a){return new xk(b,a,null,null,null)}function Z(b,a,c){return new vk(b.va,a,c,null,null,null)}function zk(b){return new v(null,2,[Mi,null!=b&&b.yb?function(a,b,d){return a.zb(null,b,d)}:lk,Jh,null!=b&&b.yb?function(a,b,d){return a.Ab(null,b,d)}:mk],null)}function Ak(b){return new v(null,1,[Vi,null!=b&&b.Jc?function(a,b){return a.rc(0,b)}:ok],null)}
function Bk(b){var a=function(a){return function(d,e,f,g,k){f=fd.a(f,a.a?a.a(b,g):a.call(null,b,g));return k.o?k.o(d,e,f,g):k.call(null,d,e,f,g)}}(Vi.b(Ak(b)));return wk(uk(rk,a,a))}function Ck(b){var a=zk(b),c=Mi.b(a),d=Jh.b(a);return wk(uk(sk,function(a,c){return function(a,d){return c.c?c.c(b,a,d):c.call(null,b,a,d)}}(a,c,d),function(a,c,d){return function(a,c){return d.c?d.c(b,a,c):d.call(null,b,a,c)}}(a,c,d)))}
var Dk=function Dk(a){if(null!=a&&null!=a.lb)return a.lb(a);var c=Dk[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Dk._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("CoercePath.coerce-path",a);};Dk["null"]=function(){return Ck(null)};vk.prototype.lb=function(){return this};xk.prototype.lb=function(){return this};V.prototype.lb=function(){return pk(this)};xc.prototype.lb=function(){return Dk(Fd(this))};Zd.prototype.lb=function(){return Dk(Fd(this))};Yc.prototype.lb=function(){return Dk(Fd(this))};
Dk._=function(b){var a;a=(a=(a=ea(b))?a:null!=b?b.Pc?!0:b.ec?!1:Oa(Va,b):Oa(Va,b))?a:null!=b?b.yb?!0:b.ec?!1:Oa(kk,b):Oa(kk,b);if(x(a))b=Ck(b);else if(null!=b?b.Jc||(b.ec?0:Oa(nk,b)):Oa(nk,b))b=Bk(b);else throw a=K,b=[D("Protocol implementation cannot be found for object.\n        Extending Specter protocols should not be done inline in a deftype definition\n        because that prevents Specter from finding the protocol implementations for\n        optimized performance. Instead, you should extend the protocols via an\n        explicit extend-protocol call. \n"),
D(b)].join(""),b=a([b],0),Error(F.a(D,b));return b};function Ek(b){return b.Ka.type}
function Fk(b){var a=R(b,0),c=Rd(b,1),d=a.Ka,e=d.type,f=nc.a(e,th)?function(a,b,c,d,e,f){return function(q,r){return function(a,b,c,d,e,f){return function(g,k,l,m,n){var p=function(){return function(a,b,c,d){return r.A?r.A(a,b,c,d,n):r.call(null,a,b,c,d,n)}}(g,k,l,m,a,b,c,d,e,f);return q.A?q.A(g,k,l,m,p):q.call(null,g,k,l,m,p)}}(a,b,c,d,e,f)}}(d,e,b,a,c,b):function(a,b,c,d,e,f){return function(q,r){return function(a,b,c,d,e,f){return function(g,k){var l=function(){return function(a){return r.a?r.a(a,
k):r.call(null,a,k)}}(g,a,b,c,d,e,f);return q.a?q.a(g,l):q.call(null,g,l)}}(a,b,c,d,e,f)}}(d,e,b,a,c,b);return Ua.a(function(a,b,c){return function(b,d){return uk(a,function(){var a=b.La,e=d.La;return c.a?c.a(a,e):c.call(null,a,e)}(),function(){var a=b.Ma,e=d.Ma;return c.a?c.a(a,e):c.call(null,a,e)}())}}(d,e,f,b,a,c,b),b)}
function Gk(b){if(nc.a(Ek(b),th))return b;var a=b.La;b=b.Ma;return uk(rk,function(a,b){return function(e,f,g,k,l){var m=function(){return function(a){return l.o?l.o(e,f,g,a):l.call(null,e,f,g,a)}}(k,a,b);return a.a?a.a(k,m):a.call(null,k,m)}}(a,b),function(a,b){return function(e,f,g,k,l){var m=function(){return function(a){return l.o?l.o(e,f,g,a):l.call(null,e,f,g,a)}}(k,a,b);return b.a?b.a(k,m):b.call(null,k,m)}}(a,b))}
function Hk(b){if(b instanceof vk){var a=di.b(b),c=Ai.b(b),d=qh.b(rj.b(b)),e=xh.b(rj.b(b));return pd(a)?b:wk(uk(rk,function(a,b,c,d){return function(e,n,p,q,r){var t=function(){return function(a,b,c,d){return r.o?r.o(e,n,c,d):r.call(null,e,n,c,d)}}(a,b,p,q,a,b,c,d);return c.A?c.A(a,b,p,q,t):c.call(null,a,b,p,q,t)}}(a,c,d,e),function(a,b,c,d){return function(e,n,p,q,r){var t=function(){return function(a,b,c,d){return r.o?r.o(e,n,c,d):r.call(null,e,n,c,d)}}(a,b,p,q,a,b,c,d);return d.A?d.A(a,b,p,q,t):
d.call(null,a,b,p,q,t)}}(a,c,d,e)))}return b}pk["null"]=function(b){return Dk(b)};pk._=function(b){return Dk(b)};V.prototype.Gc=function(){if(pd(this))return Dk(null);var b=T.a(Hk,T.a(Dk,this)),a=T.a(Fk,yg(Ek,T.a(rj,b))),c=nc.a(1,P(a))?M(a):Fk(T.a(Gk,a)),b=We(function(){return function(a){return a instanceof xk}}(b,a,c,this),b);return pd(b)?wk(c):yk(Gk(c),Ua.a(Id,T.a(vi,b)))};function Ik(b){return b instanceof vk?0:vi.b(b)}
var Jk=function Jk(a,c){if(null!=a&&null!=a.Hc)return a.Hc(0,c);var d=Jk[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=Jk._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("SetExtremes.set-first",a);},Kk=function Kk(a,c){if(null!=a&&null!=a.Ic)return a.Ic(0,c);var d=Kk[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=Kk._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("SetExtremes.set-last",a);};
V.prototype.Hc=function(b,a){return kd.c(this,0,a)};V.prototype.Ic=function(b,a){return kd.c(this,P(this)-1,a)};Jk._=function(b,a){return Wc(a,yc(b))};Kk._=function(b,a){var c=ug(b);return fd.a(Fd(c),a)};function Lk(b,a){var c=b.va;return c.Ka.sd.call(null,b.Xa,b.Ya,c.La,a)}function Mk(b,a,c){var d=b.va;return d.Ka.ud.call(null,b.Xa,b.Ya,d.Ma,a,c)}function Nk(){}Nk.prototype.yb=!0;Nk.prototype.zb=function(b,a,c){return Ye.a(gd,ik(c,a))};
Nk.prototype.Ab=function(b,a,c){b=null==a?null:Ya(a);return Yd(b)?Cg(T.a(c,a)):Ye.a(b,hk(c,a))};function Ok(){}Ok.prototype.Jc=!0;Ok.prototype.rc=function(b,a){return a};function Pk(b,a){this.Lc=b;this.td=a}Pk.prototype.yb=!0;Pk.prototype.zb=function(b,a,c){if(pd(a))return null;b=this.Lc.call(null,a);return c.b?c.b(b):c.call(null,b)};Pk.prototype.Ab=function(b,a,c){var d=this;return pd(a)?a:d.td.call(null,a,function(){var b=d.Lc.call(null,a);return c.b?c.b(b):c.call(null,b)}())};
function Qk(b,a,c,d){b=vf.c(Fd(b),a,c);return d.b?d.b(b):d.call(null,b)}function Rk(b,a,c,d){var e=Fd(b),f=vf.c(e,a,c);d=d.b?d.b(f):d.call(null,f);a=ne.j(vf.c(e,0,a),d,K([vf.c(e,c,P(b))],0));return td(b)?Fd(a):a}kk["null"]=!0;lk["null"]=function(b,a,c){return c.b?c.b(a):c.call(null,a)};mk["null"]=function(b,a,c){return c.b?c.b(a):c.call(null,a)};function Sk(b,a,c){return x(b.b?b.b(a):b.call(null,a))?c.b?c.b(a):c.call(null,a):null}
function Tk(b,a,c){return x(b.b?b.b(a):b.call(null,a))?c.b?c.b(a):c.call(null,a):a};function Uk(b){return pk(Fd(b))}function Vk(b,a){var c=pk(b);return Lk.a?Lk.a(c,a):Lk.call(null,c,a)}function Wk(b,a,c){b=pk(b);return Mk.c?Mk.c(b,a,c):Mk.call(null,b,a,c)}var Xk=Uk(K([new Nk],0)),Yk=new Ok,Zk=Uk(K([new Pk(ed,Kk)],0));Uk(K([new Pk(M,Jk)],0));
var $k=yk(uk(rk,function(b,a,c,d,e){var f=b[a+0],g=b[a+1];return Qk(d,f.b?f.b(d):f.call(null,d),g.b?g.b(d):g.call(null,d),function(d){var f=a+2;return e.o?e.o(b,f,c,d):e.call(null,b,f,c,d)})},function(b,a,c,d,e){var f=b[a+0],g=b[a+1];return Rk(d,f.b?f.b(d):f.call(null,d),g.b?g.b(d):g.call(null,d),function(d){var f=a+2;return e.o?e.o(b,f,c,d):e.call(null,b,f,c,d)})}),2),al=yk(uk(rk,function(b,a,c,d,e){return Qk(d,b[a+0],b[a+1],function(d){var g=a+2;return e.o?e.o(b,g,c,d):e.call(null,b,g,c,d)})},function(b,
a,c,d,e){return Rk(d,b[a+0],b[a+1],function(d){var g=a+2;return e.o?e.o(b,g,c,d):e.call(null,b,g,c,d)})}),2);al.a?al.a(0,0):al.call(null,0,0);$k.a?$k.a(P,P):$k.call(null,P,P);y.prototype.yb=!0;y.prototype.zb=function(b,a,c){b=J.a(a,this);return c.b?c.b(b):c.call(null,b)};y.prototype.Ab=function(b,a,c){var d=this;return kd.c(a,d,function(){var b=J.a(a,d);return c.b?c.b(b):c.call(null,b)}())};kk["function"]=!0;lk["function"]=function(b,a,c){return Sk(b,a,c)};
mk["function"]=function(b,a,c){return Tk(b,a,c)};sg.prototype.yb=!0;sg.prototype.zb=function(b,a,c){return Sk(this,a,c)};sg.prototype.Ab=function(b,a,c){return Tk(this,a,c)};var bl=yk(uk(rk,function(b,a,c,d,e){var f=b[a+0];d=x(d)?d:f;a+=1;return e.o?e.o(b,a,c,d):e.call(null,b,a,c,d)},function(b,a,c,d,e){var f=b[a+0];d=x(d)?d:f;a+=1;return e.o?e.o(b,a,c,d):e.call(null,b,a,c,d)}),1);bl.b?bl.b(tg):bl.call(null,tg);var cl=zc;bl.b?bl.b(cl):bl.call(null,cl);bl.b?bl.b(gd):bl.call(null,gd);
function dl(){var b=K([Gj],0),a=T.a(pk,new V(null,1,5,W,[b],null)),c=T.a(Ik,a),d=Wc(0,zg(c)),e=ed(d),f=T.c(function(a,b,c,d){return function(e,f){return x(f instanceof vk)?function(){return function(){return f}}(a,b,c,d):function(){return function(a,b){return Z(f,a,b+e)}}(a,b,c,d)}}(a,c,d,e),d,a),g=R(f,0),b=function(){var b=function(a,b,c,d,e,f,g){return function(a,b,c,e,f){var k;k=g.a?g.a(a,b):g.call(null,a,b);var l=Lk.a?Lk.a(k,e):Lk.call(null,k,e);if(1<P(l))throw a=K(["More than one element found for params: ",
k,e],0),Error(F.a(D,a));k=M(l);b+=d;c=fd.a(c,k);return f.o?f.o(a,b,c,e):f.call(null,a,b,c,e)}}(a,c,d,e,f,f,g);return yk(uk(rk,b,b),e)}();return nc.a(0,e)?Z(b,null,0):b};function el(b){return nc.a(Bh,gi.b(b))}function fl(b){return Wk(new V(null,8,5,W,[Rh,Xk,Eh,Xk,function(a){return pj.b(a)},Fj,Zk,Xh],null),Be(!0),b)}if("undefined"===typeof gl)var gl=function(){var b=X.b?X.b(we):X.call(null,we),a=X.b?X.b(we):X.call(null,we),c=X.b?X.b(we):X.call(null,we),d=X.b?X.b(we):X.call(null,we),e=J.c(we,wj,Wg());return new gh(vc.a("pennygame.updates","capacity"),function(){return function(a,b){var c=null!=b&&(b.g&64||b.F)?F.a(Kc,b):b;return J.a(c,gi)}}(b,a,c,d,e),Oh,e,b,a,c,d)}();
ih(gl,ni,function(b){return b});ih(gl,xi,function(b){switch(b){case 1:return 2;case 2:return 4;case 3:return 6;case 4:return 4;case 5:return 5;case 6:return 6;default:throw Error([D("No matching clause: "),D(b)].join(""));}});ih(gl,ji,function(b,a,c){b=null!=a&&(a.g&64||a.F)?F.a(Kc,a):a;b=J.a(b,ph);return $e(Fd(c),new V(null,2,5,W,[b,Fh],null))});function hl(b,a){return Wk(new V(null,4,5,W,[Rh,Xk,Eh,Xk],null),a,b)}function il(b,a){return Fd(T.c(function(a,b){return kd.c(a,Sh,b)},b,a))}
function jl(b,a){return Wk(new V(null,6,5,W,[Rh,Xk,Eh,Yk,Xk,function(a){return Cd(a,wh)}],null),function(b,d){var e=null!=d&&(d.g&64||d.F)?F.a(Kc,d):d,f=J.a(e,wh),g=J.a(e,Hj);J.a(e,Fj);f=$e(a,new V(null,2,5,W,[f,Sh],null));g=gl.c?gl.c(f,g,b):gl.call(null,f,g,b);return kd.c(e,Fh,g)},b)}
function kl(b,a){return Wk(new V(null,7,5,W,[Rh,Xk,Eh,Yk,Xk,function(a){return Cd(a,wh)},function(a){return nc.a(ji,$e(a,new V(null,2,5,W,[Hj,gi],null)))}],null),function(b,d){var e=null!=d&&(d.g&64||d.F)?F.a(Kc,d):d,f=J.a(e,wh),g=J.a(e,Hj);J.a(e,Fj);f=$e(a,new V(null,2,5,W,[f,Sh],null));g=gl.c?gl.c(f,g,b):gl.call(null,f,g,b);return kd.c(e,Fh,g)},b)}function ll(b){var a=b.b?b.b(df):b.call(null,df);return kl(jl(b,a),a)}
if("undefined"===typeof ml){var ml,nl=X.b?X.b(we):X.call(null,we),ol=X.b?X.b(we):X.call(null,we),pl=X.b?X.b(we):X.call(null,we),ql=X.b?X.b(we):X.call(null,we),rl=J.c(we,wj,Wg());ml=new gh(vc.a("pennygame.updates","process"),gi,Oh,rl,nl,ol,pl,ql)}ih(ml,Oh,function(b){b=null!=b&&(b.g&64||b.F)?F.a(Kc,b):b;var a=J.a(b,Fh),c=J.a(b,Fj);return kd.j(b,Fj,Ne(a,c),K([mj,Me(a,c)],0))});ih(ml,Zh,function(b){b=null!=b&&(b.g&64||b.F)?F.a(Kc,b):b;var a=J.a(b,Fh);return kd.c(b,mj,Me(a,Oe(we)))});
function sl(b){var a=M(Vk(new V(null,4,5,W,[Eh,Xk,function(a){return cj.b(a)},cj],null),b));return Wk(new V(null,6,5,W,[Eh,function(){var b=a+1;return al.a?al.a(a,b):al.call(null,a,b)}(),Xk,mj,Zk,Xh],null),Be(!0),b)}function tl(b){return ze(Xh,Vk(new V(null,4,5,W,[Xk,function(a){return cj.b(a)},mj,Xk],null),b))}function ul(b){return x(tl(b.b?b.b(Eh):b.call(null,Eh)))?sl(b):b}
function vl(b){return Wk(new V(null,2,5,W,[Rh,Xk],null),ul,Wk(new V(null,5,5,W,[Rh,Xk,Eh,Xk,function(a){return J.a(a,Fh)}],null),ml,b))}function wl(b){var a=F.c(Nd,16.5,T.a(function(a){var b=null!=a&&(a.g&64||a.F)?F.a(Kc,a):a;a=J.a(b,$i);var e=J.a(b,Gj),b=J.a(b,Fj);return a/(P(e)+P(b))},Vk(new V(null,5,5,W,[Rh,Xk,Eh,Xk,el],null),b)));return Wk(new V(null,5,5,W,[Rh,Xk,Eh,Xk,el],null),function(a){return function(b){return bf(b,mh,Nd,a)}}(a),b)}
function xl(b){return Wk(new V(null,6,5,W,[Rh,Xk,Eh,Yk,Xk,function(a){return Cd(a,nh)}],null),function(a,b){var d=null!=b&&(b.g&64||b.F)?F.a(Kc,b):b,e=J.a(d,nh);return kd.c(d,Gj,$e(Fd(a),new V(null,2,5,W,[e,mj],null)))},b)}function yl(b){return Wk(new V(null,6,5,W,[Rh,Xk,Eh,Xk,dl(),Fj],null),function(a,b){return ne.a(b,a)},b)}
function zl(b,a){var c=null!=b&&(b.g&64||b.F)?F.a(Kc,b):b,c=J.a(c,Eh),d=null!=a&&(a.g&64||a.F)?F.a(Kc,a):a,e=J.c(d,Bj,0),f=J.c(d,uh,0),g=J.a(d,Ui),k=J.c(d,Nh,new V(null,2,5,W,[0,0],null)),l=J.a(d,ei),d=J.a(d,lh),m=P(mj.b(M(c))),n=F.c(T,Id,T.a(Bg(Ce.a(P,mj),Fh),Vk(new V(null,2,5,W,[Xk,el],null),c))),p=P(mj.b(ed(ug(c)))),q=Ua.a(Id,T.a(P,Vk(new V(null,3,5,W,[Xk,el,Fj],null),c))),r=p/q;return ld([lh,uh,Nh,Qh,ei,li,oi,Ui,qj,Bj,Cj],[d+r,x(tl(c))?f+1:f,T.c(Id,k,n),n,l+p,p,q,g+m,m,e+1,r])}
function Al(b){return Wk(new V(null,4,5,W,[Rh,Xk,Yk,Ch],null),function(a,b){return fd.a(b,zl(a,null==b?null:rb(b)))},b)};var Bl,Cl=function Cl(a,c){if(null!=a&&null!=a.pc)return a.pc(0,c);var d=Cl[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=Cl._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("ReadPort.take!",a);},Dl=function Dl(a,c,d){if(null!=a&&null!=a.dc)return a.dc(0,c,d);var e=Dl[u(null==a?null:a)];if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);e=Dl._;if(null!=e)return e.c?e.c(a,c,d):e.call(null,a,c,d);throw B("WritePort.put!",a);},El=function El(a){if(null!=a&&null!=a.cc)return a.cc();
var c=El[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=El._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("Channel.close!",a);},Fl=function Fl(a){if(null!=a&&null!=a.Ec)return!0;var c=Fl[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Fl._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("Handler.active?",a);},Gl=function Gl(a){if(null!=a&&null!=a.Fc)return a.Fa;var c=Gl[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=Gl._;if(null!=c)return c.b?
c.b(a):c.call(null,a);throw B("Handler.commit",a);},Hl=function Hl(a,c){if(null!=a&&null!=a.Dc)return a.Dc(0,c);var d=Hl[u(null==a?null:a)];if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);d=Hl._;if(null!=d)return d.a?d.a(a,c):d.call(null,a,c);throw B("Buffer.add!*",a);},Il=function Il(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Il.b(arguments[0]);case 2:return Il.a(arguments[0],arguments[1]);default:throw Error([D("Invalid arity: "),
D(c.length)].join(""));}};Il.b=function(b){return b};Il.a=function(b,a){return Hl(b,a)};Il.w=2;var Jl,Kl=function Kl(a){"undefined"===typeof Jl&&(Jl=function(a,d,e){this.sc=a;this.Fa=d;this.ld=e;this.g=393216;this.B=0},Jl.prototype.P=function(a,d){return new Jl(this.sc,this.Fa,d)},Jl.prototype.O=function(){return this.ld},Jl.prototype.Ec=function(){return!0},Jl.prototype.Fc=function(){return this.Fa},Jl.ic=function(){return new V(null,3,5,W,[Mc(xj,new v(null,2,[Gh,!0,ue,lc(ve,lc(new V(null,1,5,W,[Pj],null)))],null)),Pj,ua.Fd],null)},Jl.xb=!0,Jl.eb="cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers22073",
Jl.Tb=function(a,d){return Kb(d,"cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers22073")});return new Jl(Kl,a,we)};function Ll(b){try{return b[0].call(null,b)}catch(a){throw a instanceof Object&&b[6].cc(),a;}}function Ml(b,a,c){c=c.pc(0,Kl(function(c){b[2]=c;b[1]=a;return Ll(b)}));return x(c)?(b[2]=O.b?O.b(c):O.call(null,c),b[1]=a,Y):null}function Nl(b,a,c,d){c=c.dc(0,d,Kl(function(c){b[2]=c;b[1]=a;return Ll(b)}));return x(c)?(b[2]=O.b?O.b(c):O.call(null,c),b[1]=a,Y):null}
function Ol(b,a){var c=b[6];null!=a&&c.dc(0,a,Kl(function(){return function(){return null}}(c)));c.cc();return c}function Pl(b,a,c,d,e,f,g,k){this.Sa=b;this.Ta=a;this.Va=c;this.Ua=d;this.Za=e;this.S=f;this.G=g;this.u=k;this.g=2229667594;this.B=8192}h=Pl.prototype;h.N=function(b,a){return ib.c(this,a,null)};
h.I=function(b,a,c){switch(a instanceof y?a.Ha:null){case "catch-block":return this.Sa;case "catch-exception":return this.Ta;case "finally-block":return this.Va;case "continue-block":return this.Ua;case "prev":return this.Za;default:return J.c(this.G,a,c)}};
h.M=function(b,a,c){return sf(a,function(){return function(b){return sf(a,tf,""," ","",c,b)}}(this),"#cljs.core.async.impl.ioc-helpers.ExceptionFrame{",", ","}",c,ne.a(new V(null,5,5,W,[new V(null,2,5,W,[hi,this.Sa],null),new V(null,2,5,W,[Ti,this.Ta],null),new V(null,2,5,W,[Ph,this.Va],null),new V(null,2,5,W,[aj,this.Ua],null),new V(null,2,5,W,[Xi,this.Za],null)],null),this.G))};h.Ga=function(){return new Df(0,this,5,new V(null,5,5,W,[hi,Ti,Ph,aj,Xi],null),dc(this.G))};h.O=function(){return this.S};
h.X=function(){return 5+P(this.G)};h.T=function(){var b=this.u;return null!=b?b:this.u=b=Vd(this)};h.C=function(b,a){var c;c=x(a)?(c=this.constructor===a.constructor)?Cf(this,a):c:a;return x(c)?!0:!1};h.ib=function(b,a){return Cd(new sg(null,new v(null,5,[Ph,null,hi,null,Ti,null,Xi,null,aj,null],null),null),a)?md.a(Mc(Ye.a(we,this),this.S),a):new Pl(this.Sa,this.Ta,this.Va,this.Ua,this.Za,this.S,re(md.a(this.G,a)),null)};
h.Oa=function(b,a,c){return x(U.a?U.a(hi,a):U.call(null,hi,a))?new Pl(c,this.Ta,this.Va,this.Ua,this.Za,this.S,this.G,null):x(U.a?U.a(Ti,a):U.call(null,Ti,a))?new Pl(this.Sa,c,this.Va,this.Ua,this.Za,this.S,this.G,null):x(U.a?U.a(Ph,a):U.call(null,Ph,a))?new Pl(this.Sa,this.Ta,c,this.Ua,this.Za,this.S,this.G,null):x(U.a?U.a(aj,a):U.call(null,aj,a))?new Pl(this.Sa,this.Ta,this.Va,c,this.Za,this.S,this.G,null):x(U.a?U.a(Xi,a):U.call(null,Xi,a))?new Pl(this.Sa,this.Ta,this.Va,this.Ua,c,this.S,this.G,
null):new Pl(this.Sa,this.Ta,this.Va,this.Ua,this.Za,this.S,kd.c(this.G,a,c),null)};h.U=function(){return L(ne.a(new V(null,5,5,W,[new V(null,2,5,W,[hi,this.Sa],null),new V(null,2,5,W,[Ti,this.Ta],null),new V(null,2,5,W,[Ph,this.Va],null),new V(null,2,5,W,[aj,this.Ua],null),new V(null,2,5,W,[Xi,this.Za],null)],null),this.G))};h.P=function(b,a){return new Pl(this.Sa,this.Ta,this.Va,this.Ua,this.Za,a,this.G,this.u)};h.W=function(b,a){return td(a)?kb(this,G.a(a,0),G.a(a,1)):Ua.c(bb,this,a)};
function Ql(b){for(;;){var a=b[4],c=hi.b(a),d=Ti.b(a),e=b[5];if(x(function(){var b=e;return x(b)?Na(a):b}()))throw e;if(x(function(){var a=e;return x(a)?(a=c,x(a)?e instanceof d:a):a}())){b[1]=c;b[2]=e;b[5]=null;b[4]=kd.j(a,hi,null,K([Ti,null],0));break}if(x(function(){var b=e;return x(b)?Na(c)&&Na(Ph.b(a)):b}()))b[4]=Xi.b(a);else{if(x(function(){var b=e;return x(b)?(b=Na(c))?Ph.b(a):b:b}())){b[1]=Ph.b(a);b[4]=kd.c(a,Ph,null);break}if(x(function(){var b=Na(e);return b?Ph.b(a):b}())){b[1]=Ph.b(a);
b[4]=kd.c(a,Ph,null);break}if(Na(e)&&Na(Ph.b(a))){b[1]=aj.b(a);b[4]=Xi.b(a);break}throw Error("No matching clause");}}};function Rl(b,a,c,d,e){for(var f=0;;)if(f<e)c[d+f]=b[a+f],f+=1;else break}function Sl(b,a,c,d){this.head=b;this.R=a;this.length=c;this.f=d}Sl.prototype.pop=function(){if(0===this.length)return null;var b=this.f[this.R];this.f[this.R]=null;this.R=(this.R+1)%this.f.length;--this.length;return b};Sl.prototype.unshift=function(b){this.f[this.head]=b;this.head=(this.head+1)%this.f.length;this.length+=1;return null};function Tl(b,a){b.length+1===b.f.length&&b.resize();b.unshift(a)}
Sl.prototype.resize=function(){var b=Array(2*this.f.length);return this.R<this.head?(Rl(this.f,this.R,b,0,this.length),this.R=0,this.head=this.length,this.f=b):this.R>this.head?(Rl(this.f,this.R,b,0,this.f.length-this.R),Rl(this.f,0,b,this.f.length-this.R,this.head),this.R=0,this.head=this.length,this.f=b):this.R===this.head?(this.head=this.R=0,this.f=b):null};function Ul(b,a){for(var c=b.length,d=0;;)if(d<c){var e=b.pop();(a.b?a.b(e):a.call(null,e))&&b.unshift(e);d+=1}else break}
function Vl(b){return new Sl(0,0,0,Array(b))}function Wl(b,a){this.L=b;this.n=a;this.g=2;this.B=0}function Xl(b){return b.L.length===b.n}Wl.prototype.Dc=function(b,a){Tl(this.L,a);return this};Wl.prototype.X=function(){return this.L.length};var Yl;
function Zl(){var b=aa.MessageChannel;"undefined"===typeof b&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==Yj.indexOf("Presto")&&(b=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=pa(function(a){if(("*"==d||a.origin==
d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof b&&-1==Yj.indexOf("Trident")&&-1==Yj.indexOf("MSIE")){var a=new b,c={},d=c;a.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.vc;c.vc=null;a()}};return function(b){d.next={vc:b};d=d.next;a.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=
document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){aa.setTimeout(a,0)}};var $l=Vl(32),am=!1,bm=!1;cm;function dm(){am=!0;bm=!1;for(var b=0;;){var a=$l.pop();if(null!=a&&(a.l?a.l():a.call(null),1024>b)){b+=1;continue}break}am=!1;return 0<$l.length?cm.l?cm.l():cm.call(null):null}function cm(){var b=bm;if(x(x(b)?am:b))return null;bm=!0;!ea(aa.setImmediate)||aa.Window&&aa.Window.prototype&&aa.Window.prototype.setImmediate==aa.setImmediate?(Yl||(Yl=Zl()),Yl(dm)):aa.setImmediate(dm)}function em(b){Tl($l,b);cm()}function fm(b,a){setTimeout(b,a)};var gm,hm=function hm(a){"undefined"===typeof gm&&(gm=function(a,d,e){this.Oc=a;this.H=d;this.md=e;this.g=425984;this.B=0},gm.prototype.P=function(a,d){return new gm(this.Oc,this.H,d)},gm.prototype.O=function(){return this.md},gm.prototype.Jb=function(){return this.H},gm.ic=function(){return new V(null,3,5,W,[Mc(Bi,new v(null,1,[ue,lc(ve,lc(new V(null,1,5,W,[Ki],null)))],null)),Ki,ua.Gd],null)},gm.xb=!0,gm.eb="cljs.core.async.impl.channels/t_cljs$core$async$impl$channels22136",gm.Tb=function(a,d){return Kb(d,
"cljs.core.async.impl.channels/t_cljs$core$async$impl$channels22136")});return new gm(hm,a,we)};function im(b,a){this.Ub=b;this.H=a}function jm(b){return Fl(b.Ub)}var km=function km(a){if(null!=a&&null!=a.Cc)return a.Cc();var c=km[u(null==a?null:a)];if(null!=c)return c.b?c.b(a):c.call(null,a);c=km._;if(null!=c)return c.b?c.b(a):c.call(null,a);throw B("MMC.abort",a);};function lm(b,a,c,d,e,f,g){this.Gb=b;this.hc=a;this.sb=c;this.gc=d;this.L=e;this.closed=f;this.Ja=g}
lm.prototype.Cc=function(){for(;;){var b=this.sb.pop();if(null!=b){var a=b.Ub;em(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(a.Fa,a,b.H,b,this))}break}Ul(this.sb,Be(!1));return El(this)};
lm.prototype.dc=function(b,a,c){var d=this;if(b=d.closed)return hm(!b);if(x(function(){var a=d.L;return x(a)?Na(Xl(d.L)):a}())){for(c=Pc(d.Ja.a?d.Ja.a(d.L,a):d.Ja.call(null,d.L,a));;){if(0<d.Gb.length&&0<P(d.L)){var e=d.Gb.pop(),f=e.Fa,g=d.L.L.pop();em(function(a,b){return function(){return a.b?a.b(b):a.call(null,b)}}(f,g,e,c,b,this))}break}c&&km(this);return hm(!0)}e=function(){for(;;){var a=d.Gb.pop();if(x(a)){if(x(!0))return a}else return null}}();if(x(e))return c=Gl(e),em(function(b){return function(){return b.b?
b.b(a):b.call(null,a)}}(c,e,b,this)),hm(!0);64<d.gc?(d.gc=0,Ul(d.sb,jm)):d.gc+=1;Tl(d.sb,new im(c,a));return null};
lm.prototype.pc=function(b,a){var c=this;if(null!=c.L&&0<P(c.L)){for(var d=a.Fa,e=hm(c.L.L.pop());;){if(!x(Xl(c.L))){var f=c.sb.pop();if(null!=f){var g=f.Ub,k=f.H;em(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(g.Fa,g,k,f,d,e,this));Pc(c.Ja.a?c.Ja.a(c.L,k):c.Ja.call(null,c.L,k))&&km(this);continue}}break}return e}d=function(){for(;;){var a=c.sb.pop();if(x(a)){if(Fl(a.Ub))return a}else return null}}();if(x(d))return e=Gl(d.Ub),em(function(a){return function(){return a.b?a.b(!0):
a.call(null,!0)}}(e,d,this)),hm(d.H);if(x(c.closed))return x(c.L)&&(c.Ja.b?c.Ja.b(c.L):c.Ja.call(null,c.L)),x(x(!0)?a.Fa:!0)?(d=function(){var a=c.L;return x(a)?0<P(c.L):a}(),d=x(d)?c.L.L.pop():null,hm(d)):null;64<c.hc?(c.hc=0,Ul(c.Gb,Fl)):c.hc+=1;Tl(c.Gb,a);return null};
lm.prototype.cc=function(){var b=this;if(!b.closed)for(b.closed=!0,x(function(){var a=b.L;return x(a)?0===b.sb.length:a}())&&(b.Ja.b?b.Ja.b(b.L):b.Ja.call(null,b.L));;){var a=b.Gb.pop();if(null==a)break;else{var c=a.Fa,d=x(function(){var a=b.L;return x(a)?0<P(b.L):a}())?b.L.L.pop():null;em(function(a,b){return function(){return a.b?a.b(b):a.call(null,b)}}(c,d,a,this))}}return null};function mm(b){console.log(b);return null}
function nm(b,a){var c=(x(null)?null:mm).call(null,a);return null==c?b:Il.a(b,c)}
function om(b){return new lm(Vl(32),0,Vl(32),0,b,!1,function(){return function(a){return function(){function b(c,d){try{return a.a?a.a(c,d):a.call(null,c,d)}catch(e){return nm(c,e)}}function d(b){try{return a.b?a.b(b):a.call(null,b)}catch(c){return nm(b,c)}}var e=null,e=function(a,e){switch(arguments.length){case 1:return d.call(this,a);case 2:return b.call(this,a,e)}throw Error("Invalid arity: "+arguments.length);};e.b=d;e.a=b;return e}()}(x(null)?null.b?null.b(Il):null.call(null,Il):Il)}())};function pm(b,a,c){this.key=b;this.H=a;this.forward=c;this.g=2155872256;this.B=0}pm.prototype.U=function(){return bb(bb(zc,this.H),this.key)};pm.prototype.M=function(b,a,c){return sf(a,tf,"["," ","]",c,this)};function qm(b,a,c){c=Array(c+1);for(var d=0;;)if(d<c.length)c[d]=null,d+=1;else break;return new pm(b,a,c)}function rm(b,a,c,d){for(;;){if(0>c)return b;a:for(;;){var e=b.forward[c];if(x(e))if(e.key<a)b=e;else break a;else break a}null!=d&&(d[c]=b);--c}}
function sm(b,a){this.ob=b;this.level=a;this.g=2155872256;this.B=0}sm.prototype.put=function(b,a){var c=Array(15),d=rm(this.ob,b,this.level,c).forward[0];if(null!=d&&d.key===b)return d.H=a;a:for(d=0;;)if(.5>Math.random()&&15>d)d+=1;else break a;if(d>this.level){for(var e=this.level+1;;)if(e<=d+1)c[e]=this.ob,e+=1;else break;this.level=d}for(d=qm(b,a,Array(d));;)return 0<=this.level?(c=c[0].forward,d.forward[0]=c[0],c[0]=d):null};
sm.prototype.remove=function(b){var a=Array(15),c=rm(this.ob,b,this.level,a).forward[0];if(null!=c&&c.key===b){for(b=0;;)if(b<=this.level){var d=a[b].forward;d[b]===c&&(d[b]=c.forward[b]);b+=1}else break;for(;;)if(0<this.level&&null==this.ob.forward[this.level])--this.level;else return null}else return null};function tm(b){for(var a=um,c=a.ob,d=a.level;;){if(0>d)return c===a.ob?null:c;var e;a:for(e=c;;){e=e.forward[d];if(null==e){e=null;break a}if(e.key>=b)break a}null!=e?(--d,c=e):--d}}
sm.prototype.U=function(){return function(b){return function c(d){return new de(null,function(){return function(){return null==d?null:Wc(new V(null,2,5,W,[d.key,d.H],null),c(d.forward[0]))}}(b),null,null)}}(this)(this.ob.forward[0])};sm.prototype.M=function(b,a,c){return sf(a,function(){return function(b){return sf(a,tf,""," ","",c,b)}}(this),"{",", ","}",c,this)};var um=new sm(qm(null,null,0),0);
function vm(b){var a=(new Date).valueOf()+b,c=tm(a),d=x(x(c)?c.key<a+10:c)?c.H:null;if(x(d))return d;var e=om(null);um.put(a,e);fm(function(a,b,c){return function(){um.remove(c);return El(a)}}(e,d,a,c),b);return e};var wm=function wm(a){"undefined"===typeof Bl&&(Bl=function(a,d,e){this.sc=a;this.Fa=d;this.kd=e;this.g=393216;this.B=0},Bl.prototype.P=function(a,d){return new Bl(this.sc,this.Fa,d)},Bl.prototype.O=function(){return this.kd},Bl.prototype.Ec=function(){return!0},Bl.prototype.Fc=function(){return this.Fa},Bl.ic=function(){return new V(null,3,5,W,[Mc(xj,new v(null,2,[Gh,!0,ue,lc(ve,lc(new V(null,1,5,W,[Pj],null)))],null)),Pj,ua.Ed],null)},Bl.xb=!0,Bl.eb="cljs.core.async/t_cljs$core$async19305",Bl.Tb=
function(a,d){return Kb(d,"cljs.core.async/t_cljs$core$async19305")});return new Bl(wm,a,we)};function xm(b){b=nc.a(b,0)?null:b;return om("number"===typeof b?new Wl(Vl(b),b):b)}function ym(b,a){var c=Cl(b,wm(a));if(x(c)){var d=O.b?O.b(c):O.call(null,c);x(!0)?a.b?a.b(d):a.call(null,d):em(function(b){return function(){return a.b?a.b(b):a.call(null,b)}}(d,c))}return null}var zm=wm(function(){return null});function Am(b,a){var c=Dl(b,a,zm);return x(c)?O.b?O.b(c):O.call(null,c):!0}
function Bm(b){var a=Fd(new V(null,1,5,W,[Cm],null)),c=xm(null),d=P(a),e=ke(d),f=xm(1),g=X.b?X.b(null):X.call(null,null),k=Ze(function(a,b,c,d,e,f){return function(g){return function(a,b,c,d,e,f){return function(a){d[g]=a;return 0===Ke.a(f,Ld)?Am(e,d.slice(0)):null}}(a,b,c,d,e,f)}}(a,c,d,e,f,g),new xg(null,0,d,1,null)),l=xm(1);em(function(a,c,d,e,f,g,k,l){return function(){var C=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!U(e,Y)){d=e;break a}}}catch(f){if(f instanceof
Object)c[5]=f,Ql(c),d=Y;else throw f;}if(!U(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(a,c,d,e,f,g,k,l){return function(a){var f=a[1];if(7===f)return a[2]=null,a[1]=8,Y;if(1===f)return a[2]=null,a[1]=2,Y;if(4===f){var m=a[7],
f=m<e;a[1]=x(f)?6:7;return Y}return 15===f?(f=a[2],a[2]=f,a[1]=3,Y):13===f?(f=El(d),a[2]=f,a[1]=15,Y):6===f?(a[2]=null,a[1]=11,Y):3===f?(f=a[2],Ol(a,f)):12===f?(f=a[8],f=a[2],m=ze(La,f),a[8]=f,a[1]=x(m)?13:14,Y):2===f?(f=Je.a?Je.a(k,e):Je.call(null,k,e),a[9]=f,a[7]=0,a[2]=null,a[1]=4,Y):11===f?(m=a[7],a[4]=new Pl(10,Object,null,9,a[4],null,null,null),f=c.b?c.b(m):c.call(null,m),m=l.b?l.b(m):l.call(null,m),f=ym(f,m),a[2]=f,Ql(a),Y):9===f?(m=a[7],a[10]=a[2],a[7]=m+1,a[2]=null,a[1]=4,Y):5===f?(a[11]=
a[2],Ml(a,12,g)):14===f?(f=a[8],f=F.a(b,f),Nl(a,16,d,f)):16===f?(a[12]=a[2],a[2]=null,a[1]=2,Y):10===f?(m=a[2],f=Ke.a(k,Ld),a[13]=m,a[2]=f,Ql(a),Y):8===f?(f=a[2],a[2]=f,a[1]=5,Y):null}}(a,c,d,e,f,g,k,l),a,c,d,e,f,g,k,l)}(),E=function(){var b=C.l?C.l():C.call(null);b[6]=a;return b}();return Ll(E)}}(l,a,c,d,e,f,g,k));return c};var Dm=VDOM.diff,Em=VDOM.patch,Fm=VDOM.create;function Gm(b){return We(Ae(La),We(Ae(Ad),Xe(b)))}function Hm(b,a,c){return new VDOM.VHtml(Sd(b),Tg(a),Tg(c))}function Im(b,a,c){return new VDOM.VSvg(Sd(b),Tg(a),Tg(c))}Jm;
var Km=function Km(a){if(null==a)return new VDOM.VText("");if(Ad(a))return Hm(zi,we,T.a(Km,Gm(a)));if("string"===typeof a||"number"===typeof a)return new VDOM.VText(a);if(nc.a(Yi,M(a)))return Jm.b?Jm.b(a):Jm.call(null,a);var c=R(a,0),d=R(a,1);a=Rd(a,2);return Hm(c,d,T.a(Km,Gm(a)))},Jm=function Jm(a){if(null==a)return new VDOM.VText("");if("string"===typeof a||"number"===typeof a)return new VDOM.VText(a);if(nc.a(Mj,M(a))){var c=R(a,0),d=R(a,1);a=Rd(a,2);return Im(c,d,T.a(Km,Gm(a)))}c=R(a,0);d=R(a,
1);a=Rd(a,2);return Im(c,d,T.a(Jm,Gm(a)))};
function Lm(){var b=document.body,a=function(){var a=new VDOM.VText("");return X.b?X.b(a):X.call(null,a)}(),c=function(){var b;b=O.b?O.b(a):O.call(null,a);b=Fm.b?Fm.b(b):Fm.call(null,b);return X.b?X.b(b):X.call(null,b)}(),d=null==window.requestAnimationFrame?function(){return function(a){return a.l?a.l():a.call(null)}}(a,c):function(){return function(a){return window.requestAnimationFrame(a)}}(a,c);b.appendChild(O.b?O.b(c):O.call(null,c));return function(a,b,c){return function(d){var l=Km(d);d=function(){var b=
O.b?O.b(a):O.call(null,a);return Dm.a?Dm.a(b,l):Dm.call(null,b,l)}();Je.a?Je.a(a,l):Je.call(null,a,l);d=function(a,b,c,d){return function(){return Ke.c(d,Em,b)}}(l,d,a,b,c);return c.b?c.b(d):c.call(null,d)}}(a,c,d)};var Mm=Error();function Nm(b){if(x(nc.a?nc.a(0,b):nc.call(null,0,b)))return gd;if(x(nc.a?nc.a(1,b):nc.call(null,1,b)))return new V(null,1,5,W,[new V(null,2,5,W,[0,0],null)],null);if(x(nc.a?nc.a(2,b):nc.call(null,2,b)))return new V(null,2,5,W,[new V(null,2,5,W,[-1,-1],null),new V(null,2,5,W,[1,1],null)],null);if(x(nc.a?nc.a(3,b):nc.call(null,3,b)))return new V(null,3,5,W,[new V(null,2,5,W,[-1,-1],null),new V(null,2,5,W,[0,0],null),new V(null,2,5,W,[1,1],null)],null);if(x(nc.a?nc.a(4,b):nc.call(null,4,b)))return new V(null,
4,5,W,[new V(null,2,5,W,[-1,-1],null),new V(null,2,5,W,[-1,1],null),new V(null,2,5,W,[1,-1],null),new V(null,2,5,W,[1,1],null)],null);if(x(nc.a?nc.a(5,b):nc.call(null,5,b)))return new V(null,5,5,W,[new V(null,2,5,W,[-1,-1],null),new V(null,2,5,W,[-1,1],null),new V(null,2,5,W,[0,0],null),new V(null,2,5,W,[1,-1],null),new V(null,2,5,W,[1,1],null)],null);if(x(nc.a?nc.a(6,b):nc.call(null,6,b)))return new V(null,6,5,W,[new V(null,2,5,W,[-1,-1],null),new V(null,2,5,W,[-1,0],null),new V(null,2,5,W,[-1,1],
null),new V(null,2,5,W,[1,-1],null),new V(null,2,5,W,[1,0],null),new V(null,2,5,W,[1,1],null)],null);throw Error([D("No matching clause: "),D(b)].join(""));}var Om=Bg(function(b){return b.x},function(b){return b.y});
function Pm(b){var a=R(b,0),c=R(b,1),d=Math.ceil(Math.sqrt(4)),e=a/d,f=c/d;return function(a,b,c,d,e,f,q){return function t(w){return new de(null,function(a,b,c,d,e,f,g){return function(){for(var k=w;;){var l=L(k);if(l){var m=l,n=M(m);if(l=L(function(a,b,c,d,e,f,g,k,l,m,n){return function $a(p){return new de(null,function(a,b,c,d,e,f,g,k){return function(){for(;;){var a=L(p);if(a){if(wd(a)){var c=Xb(a),d=P(c),e=he(d);a:for(var l=0;;)if(l<d){var m=G.a(c,l),m=kd.j(k,nj,m*f,K([jh,b*g],0));e.add(m);l+=
1}else{c=!0;break a}return c?ie(e.$(),$a(Yb(a))):ie(e.$(),null)}e=M(a);return Wc(kd.j(k,nj,e*f,K([jh,b*g],0)),$a(yc(a)))}return null}}}(a,b,c,d,e,f,g,k,l,m,n),null,null)}}(k,n,m,l,a,b,c,d,e,f,g)(new xg(null,0,a,1,null))))return ne.a(l,t(yc(k)));k=yc(k)}else return null}}}(a,b,c,d,e,f,q),null,null)}}(d,e,f,new v(null,2,[Yh,e,Jj,f],null),b,a,c)(new xg(null,0,d,1,null))}var Qm=Bg(De(F,Nd),De(F,Md));
function Rm(b,a){var c=R(b,0),d=R(b,1),e=R(a,0),f=R(a,1),g=nc.a(c,d)?new V(null,2,5,W,[0,1],null):new V(null,2,5,W,[c,d],null),k=R(g,0),l=R(g,1),m=(f-e)/(l-k);return function(a,b,c,d,e){return function(a){return d*a+e}}(g,k,l,m,f-m*l,b,c,d,a,e,f)};var Sm=X.b?X.b(we):X.call(null,we);function Tm(b){return Ke.o(Sm,kd,Og("animation"),b)}
function Um(){var b=1E3/30,a=xm(1);em(function(a,b){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!U(e,Y)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Ql(c),d=Y;else throw f;}if(!U(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(a,b){return function(a){var c=a[1];if(7===c)return c=a,c[2]=a[2],c[1]=4,Y;if(20===c){var d=a[7],c=a[8],e=M(d),d=R(e,0),e=R(e,1),c=e.b?e.b(c):e.call(null,c);a[9]=d;a[1]=x(c)?22:23;return Y}if(1===c)return c=vm(0),Ml(a,2,c);if(24===c){var d=a[7],e=a[2],c=N(d),f;a[10]=c;a[11]=e;a[12]=0;a[13]=0;a[14]=null;a[2]=null;a[1]=8;return Y}if(4===c)return c=a[2],Ol(a,c);if(15===c){c=a[10];f=a[12];var e=
a[13],d=a[14],g=a[2];a[10]=c;a[12]=f;a[13]=e+1;a[15]=g;a[14]=d;a[2]=null;a[1]=8;return Y}return 21===c?(c=a[2],a[2]=c,a[1]=18,Y):13===c?(a[2]=null,a[1]=15,Y):22===c?(a[2]=null,a[1]=24,Y):6===c?(a[2]=null,a[1]=7,Y):25===c?(c=a[8],c+=b,a[16]=a[2],a[8]=c,a[2]=null,a[1]=3,Y):17===c?(a[2]=null,a[1]=18,Y):3===c?(c=O.b?O.b(Sm):O.call(null,Sm),c=L(c),a[1]=c?5:6,Y):12===c?(c=a[2],a[2]=c,a[1]=9,Y):2===c?(c=a[2],a[17]=c,a[8]=0,a[2]=null,a[1]=3,Y):23===c?(d=a[9],c=Ke.c(Sm,md,d),a[2]=c,a[1]=24,Y):19===c?(d=a[7],
c=Xb(d),d=Yb(d),e=P(c),a[10]=d,a[12]=e,a[13]=0,a[14]=c,a[2]=null,a[1]=8,Y):11===c?(c=a[10],c=L(c),a[7]=c,a[1]=c?16:17,Y):9===c?(c=a[2],d=vm(b),a[18]=c,Ml(a,25,d)):5===c?(c=O.b?O.b(Sm):O.call(null,Sm),c=L(c),a[10]=c,a[12]=0,a[13]=0,a[14]=null,a[2]=null,a[1]=8,Y):14===c?(d=a[19],c=Ke.c(Sm,md,d),a[2]=c,a[1]=15,Y):16===c?(d=a[7],c=wd(d),a[1]=c?19:20,Y):10===c?(e=a[13],d=a[14],c=a[8],e=G.a(d,e),d=R(e,0),e=R(e,1),c=e.b?e.b(c):e.call(null,c),a[19]=d,a[1]=x(c)?13:14,Y):18===c?(c=a[2],a[2]=c,a[1]=12,Y):8===
c?(f=a[12],e=a[13],c=e<f,a[1]=x(c)?10:11,Y):null}}(a,b),a,b)}(),f=function(){var b=e.l?e.l():e.call(null);b[6]=a;return b}();return Ll(f)}}(a,b));return a}function Vm(b){return b*b}function Wm(b,a,c){var d=null!=c&&(c.g&64||c.F)?F.a(Kc,c):c,e=J.c(d,Dj,0),f=J.a(d,ii),g=J.c(d,fi,Gd);return function(c,d,e,f,g){return function(c){if(c<=e)return!0;if(c<e+f)return c=(c-e)/f,c=g.b?g.b(c):g.call(null,c),a.a?a.a(b,c):a.call(null,b,c),!0;a.a?a.a(b,1):a.call(null,b,1);return!1}}(c,d,e,f,g)}
function Xm(b,a){return function(c){return Tm(Wm(c,b,a))}}function Ym(b,a,c){return function(d){var e=function(c){return function(e,k){var l,m=b.getPointAtLength(k*c);l=Om.b?Om.b(m):Om.call(null,m);m=R(l,0);l=R(l,1);m=new V(null,2,5,W,[m,l],null);return a.a?a.a(d,m):a.call(null,d,m)}}(b.getTotalLength());return Tm(Wm(d,e,c))}};function Zm(){var b=$m,a=an,c=bn,d=xm(null);Am(d,a);var e=xm(1);em(function(d,e){return function(){var k=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!U(e,Y)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Ql(c),d=Y;else throw f;}if(!U(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,
a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(d,e){return function(d){var f=d[1];if(1===f)return Ml(d,2,c);if(2===f){var f=a,g=d[2];d[7]=f;d[8]=g;d[2]=null;d[1]=3;return Y}return 3===f?(f=d[9],f=d[7],g=d[8],f=b.a?b.a(f,g):b.call(null,f,g),g=Am(e,f),d[10]=g,d[9]=f,Ml(d,5,c)):4===f?(f=d[2],Ol(d,f)):5===f?(f=d[9],g=d[2],d[7]=f,d[8]=g,d[2]=null,d[1]=3,Y):null}}(d,e),d,e)}(),l=function(){var a=k.l?k.l():k.call(null);a[6]=d;return a}();return Ll(l)}}(e,d));return d}
function cn(){var b=dn,a=Lm(),c=xm(1);em(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!U(e,Y)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Ql(c),d=Y;else throw f;}if(!U(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.l=c;d.b=b;return d}()}(function(){return function(c){var d=c[1];return 1===d?(c[2]=null,c[1]=2,Y):2===d?Ml(c,4,b):3===d?(d=c[2],Ol(c,d)):4===d?(d=c[7],d=c[2],c[7]=d,c[1]=x(d)?5:6,Y):5===d?(d=c[7],d=a.b?a.b(d):a.call(null,d),c[8]=d,c[2]=null,c[1]=2,Y):6===d?(c[2]=null,c[1]=7,Y):7===d?(d=c[2],c[2]=d,c[1]=3,Y):null}}(c),c)}(),f=function(){var a=e.l?e.l():e.call(null);a[6]=c;return a}();return Ll(f)}}(c));return c};var en,fn=new v(null,3,[Bj,250,Gi,500,Wh,500],null);en=X.b?X.b(fn):X.call(null,fn);function gn(b){return document.querySelector([D("#"),D(b),D(" .penny-path")].join(""))}function hn(b){return document.querySelector([D("#"),D(b),D(" .ramp")].join(""))};function jn(b){for(var a=[],c=arguments.length,d=0;;)if(d<c)a.push(arguments[d]),d+=1;else break;return kn(0<a.length?new xc(a.slice(0),0):null)}function kn(b){return pg.j(K([new v(null,2,[Sh,0,gi,Bh],null),F.a(Kc,b)],0))}function ln(b){return pg.j(K([new v(null,8,[Oi,Og("station"),gi,Bh,Gj,gd,Fj,Me(4,Oe(we)),mj,gd,Fh,null,Hj,new v(null,1,[gi,ni],null),mh,999999],null),F.a(Kc,b)],0))}
function mn(b){for(var a=[],c=arguments.length,d=0;;)if(d<c)a.push(arguments[d]),d+=1;else break;return nn(0<a.length?new xc(a.slice(0),0):null)}function nn(b){return pg.j(K([new v(null,2,[Ch,gd,Eh,gd],null),F.a(Kc,b)],0))}
var on=new V(null,5,5,W,[kn(K([gi,Zh],0)),jn(),jn(),jn(),jn()],null),pn=nn(K([yh,Qi,Eh,new V(null,6,5,W,[ln(K([gi,Zh,wh,0],0)),ln(K([nh,0,wh,1,pj,!0],0)),ln(K([nh,1,wh,2],0)),ln(K([nh,2,wh,3],0)),ln(K([nh,3,wh,4,cj,0],0)),ln(K([gi,dj,nh,4],0))],null)],0)),qn=nn(K([yh,Th,Eh,new V(null,6,5,W,[ln(K([gi,Zh,wh,0,Hj,new v(null,1,[gi,xi],null)],0)),ln(K([nh,0,wh,1,Hj,new v(null,1,[gi,xi],null),pj,!0],0)),ln(K([nh,1,wh,2,Hj,new v(null,1,[gi,xi],null)],0)),ln(K([nh,2,wh,3],0)),ln(K([nh,3,wh,4,Hj,new v(null,
1,[gi,xi],null),cj,0],0)),ln(K([gi,dj,nh,4],0))],null)],0)),rn=nn(K([yh,Ri,Eh,new V(null,6,5,W,[ln(K([gi,Zh,wh,0,Hj,new v(null,2,[gi,ji,ph,3],null)],0)),ln(K([nh,0,wh,1,Hj,new v(null,1,[gi,xi],null),pj,!0],0)),ln(K([nh,1,wh,2,Hj,new v(null,1,[gi,xi],null)],0)),ln(K([nh,2,wh,3],0)),ln(K([nh,3,wh,4,Hj,new v(null,1,[gi,xi],null),cj,0],0)),ln(K([gi,dj,nh,4],0))],null)],0)),sn=new v(null,5,[ij,new v(null,3,[Bj,0,df,on,Rh,new V(null,3,5,W,[pn,mn(),mn()],null)],null),Hh,new v(null,3,[Bj,0,df,on,Rh,new V(null,
3,5,W,[mn(),qn,mn()],null)],null),ji,new v(null,3,[Bj,0,df,on,Rh,new V(null,3,5,W,[mn(),mn(),rn],null)],null),Mh,new v(null,3,[Bj,0,df,on,Rh,new V(null,3,5,W,[pn,qn,mn()],null)],null),mi,new v(null,3,[Bj,0,df,on,Rh,new V(null,3,5,W,[pn,qn,rn],null)],null)],null);function tn(b){this.Fa=b}tn.prototype.hd=function(b){return this.Fa.b?this.Fa.b(b):this.Fa.call(null,b)};da("Hook",tn);da("Hook.prototype.hook",tn.prototype.hd);function un(b){var a=R(b,0);b=R(b,1);return[D(a),D(","),D(b)].join("")}function vn(b,a,c){var d=R(b,0);R(b,1);b=R(a,0);var e=R(a,1);a=R(c,0);c=R(c,1);var d=d-b,f=(e-c)/2*(d/Math.abs(d)),g=f/2,d=new V(null,2,5,W,[b+f,e],null);b=new V(null,2,5,W,[b-g,e],null);e=new V(null,2,5,W,[a-g,c],null);a=new V(null,2,5,W,[a+f,c],null);return[D("L"),D(un(d)),D("C"),D(un(b)),D(","),D(un(e)),D(","),D(un(a))].join("")}function wn(b){return L(b)?F.c(D,"M",Te(T.a(un,b))):null}
function xn(b,a){return[D("translate("),D(b),D(","),D(a),D(")")].join("")}
function yn(b){var a=null!=b&&(b.g&64||b.F)?F.a(Kc,b):b,c=J.a(a,Yh),d=J.a(a,Jj),e=J.a(a,nj),f=J.a(a,jh),g=J.a(a,Sh),k=c/2;return new V(null,4,5,W,[Ci,new v(null,1,[vh,xn(k,k)],null),new V(null,2,5,W,[Aj,new v(null,5,[Pi,"die",nj,-k,jh,-k,Yh,c,Jj,c],null)],null),function(){return function(a,b,c,d,e,f,g,k,z){return function E(I){return new de(null,function(a,b,c,d,e){return function(){for(;;){var b=L(I);if(b){if(wd(b)){var c=Xb(b),d=P(c),f=he(d);a:for(var g=0;;)if(g<d){var k=G.a(c,g),l=R(k,0),k=R(k,
1),l=new V(null,2,5,W,[Vh,new v(null,3,[Ni,a.b?a.b(l):a.call(null,l),Si,a.b?a.b(k):a.call(null,k),rh,e/10],null)],null);f.add(l);g+=1}else{c=!0;break a}return c?ie(f.$(),E(Yb(b))):ie(f.$(),null)}c=M(b);f=R(c,0);c=R(c,1);return Wc(new V(null,2,5,W,[Vh,new v(null,3,[Ni,a.b?a.b(f):a.call(null,f),Si,a.b?a.b(c):a.call(null,c),rh,e/10],null)],null),E(yc(b)))}return null}}}(a,b,c,d,e,f,g,k,z),null,null)}}(De(Jd,c/4),k,b,a,c,d,e,f,g)(Nm(g))}()],null)}
function zn(b,a){for(var c=b-10,d=gd,e=!0,f=a-10;;)if(0<f)d=ne.a(d,e?new V(null,2,5,W,[new V(null,2,5,W,[c,f],null),new V(null,2,5,W,[10,f],null)],null):new V(null,2,5,W,[new V(null,2,5,W,[10,f],null),new V(null,2,5,W,[c,f],null)],null)),e=!e,f-=20;else{c=W;a:for(e=R(d,0),f=Rd(d,1),d=[D("M"),D(un(e))].join(""),R(f,0),R(f,1),Rd(f,2);;){var g=f,k=R(g,0),f=R(g,1),g=Rd(g,2),l;l=k;x(l)&&(l=f,l=x(l)?L(g):l);if(x(l))d=[D(d),D(vn(e,k,f))].join(""),e=f,f=g;else{d=x(k)?[D(d),D("L"),D(un(k))].join(""):d;break a}}return new V(null,
2,5,c,[kh,new v(null,2,[Pi,"penny-path",kj,d],null)],null)}}function An(b,a,c){b=b.getPointAtLength(c*a+20);return Om.b?Om.b(b):Om.call(null,b)}function Bn(b,a,c){var d=R(b,0);b=R(b,1);return new V(null,4,5,W,[Ci,new v(null,2,[vh,xn(d,b),bj,x(c)?new tn(c):null],null),new V(null,2,5,W,[Vh,new v(null,2,[Pi,"penny",rh,8],null)],null),x(a)?new V(null,2,5,W,[Vh,new v(null,2,[Pi,"tracer",rh,4],null)],null):null],null)}
function Cn(b,a,c){var d=null!=c&&(c.g&64||c.F)?F.a(Kc,c):c,e=J.a(d,Fj),f=J.a(d,Kj),g=J.a(d,Ah),k=J.a(d,Dh);return bb(bb(zc,function(){var a=d.b?d.b(kh):d.call(null,kh);return x(a)?bb(bb(zc,$d(Fe(function(a,b,c,d,e,f,g,k,l){return function(E,I){var H=null!=I&&(I.g&64||I.F)?F.a(Kc,I):I,sa=J.a(H,Xh),A=function(a,b,c,d,e,f,g,k,l,m){return function(a){return An(d,a,m)}}(I,H,sa,a,b,c,d,e,f,g,k,l);return Bn(A(E),sa,0<k?Xm(function(a,b,c,d,e,f,g,k,l,m,n,p){return function(b,c){var d;d=E-c*p;d=-1>d?-1:d;
var e=a(d),f=R(e,0),e=R(e,1);b.setAttribute("transform",xn(f,e));return nc.a(-1,d)?b.setAttribute("transform","scale(0)"):null}}(A,I,H,sa,a,b,c,d,e,f,g,k,l),new v(null,1,[ii,(O.b?O.b(en):O.call(null,en)).call(null,Gi)],null)):null)}}(a,a,c,d,d,e,f,g,k),e))),$d(Fe(function(){return function(a,b,c,d,e,f,g,k,l,E){return function(I,H){var sa=null!=H&&(H.g&64||H.F)?F.a(Kc,H):H,A=J.a(sa,Xh),ga=An(b,a+I,k),ka=R(ga,0),Q=R(ga,1);return Bn(new V(null,2,5,W,[ka,E],null),A,Xm(function(a,b,c,d,e,f,g,k,l,m,n,p,
q,r,t,w,z){return function(a,c){return a.setAttribute("transform",xn(b,z+c*d))}}(ga,ka,Q,Q-E,H,sa,A,a,b,c,d,e,f,g,k,l,E),new v(null,3,[ii,(O.b?O.b(en):O.call(null,en)).call(null,Wh),Dj,50*I,fi,Vm],null)))}}(P(e),a,a,c,d,d,e,f,g,k)}(),d.b?d.b(wi):d.call(null,wi)))):null}()),zn(b,a))}
function Dn(b,a){var c=a-20,d=W,e=xn(0,b),c=[D(wn(new V(null,6,5,W,[new V(null,2,5,W,[a,-20],null),new V(null,2,5,W,[a,23],null),new V(null,2,5,W,[0,23],null),new V(null,2,5,W,[0,3],null),new V(null,2,5,W,[c,3],null),new V(null,2,5,W,[c,-20],null)],null))),D("Z")].join("");return new V(null,2,5,d,[kh,new v(null,3,[Pi,"spout",vh,e,kj,c],null)],null)}
if("undefined"===typeof En){var En,Fn=X.b?X.b(we):X.call(null,we),Gn=X.b?X.b(we):X.call(null,we),Hn=X.b?X.b(we):X.call(null,we),In=X.b?X.b(we):X.call(null,we),Jn=J.c(we,wj,Wg());En=new gh(vc.a("pennygame.ui","station"),gi,Oh,Jn,Fn,Gn,Hn,In)}ih(En,Zh,function(b){var a=null!=b&&(b.g&64||b.F)?F.a(Kc,b):b;b=J.a(a,Yh);J.a(a,Zi);a=J.a(a,Dh);return Dn(a,b)});
ih(En,Bh,function(b){var a=null!=b&&(b.g&64||b.F)?F.a(Kc,b):b;b=J.a(a,Yh);var c=J.a(a,Zi),a=bb(bb(bb(zc,Dn(a.b?a.b(Dh):a.call(null,Dh),b)),Cn(b,c,new v(null,6,[Fj,a.b?a.b(Fj):a.call(null,Fj),Kj,a.b?a.b(mh):a.call(null,mh),Ah,x(a.b?a.b(ki):a.call(null,ki))?a.b?a.b(Fh):a.call(null,Fh):0,wi,x(a.b?a.b(lj):a.call(null,lj))?a.b?a.b(Gj):a.call(null,Gj):null,kh,gn(a.b?a.b(Oi):a.call(null,Oi)),Dh,a.b?a.b(ai):a.call(null,ai)],null))),new V(null,2,5,W,[Aj,new v(null,3,[Pi,"bin",Yh,b,Jj,c],null)],null));a:for(var d=
gd,e=!0,c=c-20;;)if(0<c)d=fd.a(d,new V(null,2,5,W,[Ji,new v(null,4,[Pi,"shelf",vh,xn(0,c),oj,e?20:0,Ej,e?b:b-20],null)],null)),e=!e,c-=20;else{b=new V(null,3,5,W,[Ci,we,F.a(lc,d)],null);break a}return bb(a,b)});
ih(En,dj,function(b){var a=null!=b&&(b.g&64||b.F)?F.a(Kc,b):b,c=J.a(a,Yh),d=J.a(a,Oi),e=J.a(a,Zi),f=J.a(a,ai);return bb(bb(bb(zc,new V(null,2,5,W,[jj,new v(null,3,[Wi,truckSrc,Yh,c,Jj,e],null)],null)),new V(null,2,5,W,[kh,new v(null,2,[Pi,"ramp",kj,[D("M"),D(un(new V(null,2,5,W,[10,f],null))),D("C"),D(un(new V(null,2,5,W,[10,e/2],null))),D(","),D(un(new V(null,2,5,W,[10,e/2],null))),D(","),D(un(new V(null,2,5,W,[c/2,e/2],null)))].join("")],null)],null)),function(){var g=hn(d);return x(x(g)?a.b?a.b(lj):
a.call(null,lj):g)?Fe(function(a,b,c,d,e,f,g,t){return function(w,z){var C=null!=z&&(z.g&64||z.F)?F.a(Kc,z):z,E=J.a(C,Xh);return Bn(new V(null,2,5,W,[10,t],null),E,Ym(a,function(){return function(a,b){var c=R(b,0),d=R(b,1);return a.setAttribute("transform",xn(c,d))}}(z,C,E,a,b,c,d,e,f,g,t),new v(null,3,[ii,(O.b?O.b(en):O.call(null,en)).call(null,Wh),Dj,50*w,fi,Vm],null)))}}(g,b,a,a,c,d,e,f),a.b?a.b(Gj):a.call(null,Gj)):null}())});
function Kn(b){var a=null!=b&&(b.g&64||b.F)?F.a(Kc,b):b,c=J.a(a,nj),d=J.a(a,yh),e=J.a(a,Eh);return x(x(c)?d:c)?new V(null,3,5,W,[Ci,new v(null,2,[Pi,[D("scenario "),D(Sd(d))].join(""),vh,xn(c,0)],null),function(){return function(a,b,c,d,e){return function p(q){return new de(null,function(){return function(){for(;;){var a=L(q);if(a){if(wd(a)){var b=Xb(a),c=P(b),d=he(c);a:for(var e=0;;)if(e<c){var f=G.a(b,e),g=null!=f&&(f.g&64||f.F)?F.a(Kc,f):f,f=g,k=J.a(g,Hj),k=null!=k&&(k.g&64||k.F)?F.a(Kc,k):k,k=
J.a(k,gi),l=J.a(g,Oi),g=J.a(g,jh),f=new V(null,3,5,W,[Ci,new v(null,3,[Oi,l,Pi,[D(Sd(k)),D(" productivity-"),D(Sd(k))].join(""),vh,xn(0,g)],null),En.b?En.b(f):En.call(null,f)],null);d.add(f);e+=1}else{b=!0;break a}return b?ie(d.$(),p(Yb(a))):ie(d.$(),null)}d=M(a);d=b=null!=d&&(d.g&64||d.F)?F.a(Kc,d):d;c=J.a(b,Hj);c=null!=c&&(c.g&64||c.F)?F.a(Kc,c):c;c=J.a(c,gi);e=J.a(b,Oi);b=J.a(b,jh);return Wc(new V(null,3,5,W,[Ci,new v(null,3,[Oi,e,Pi,[D(Sd(c)),D(" productivity-"),D(Sd(c))].join(""),vh,xn(0,b)],
null),En.b?En.b(d):En.call(null,d)],null),p(yc(a)))}return null}}}(a,b,c,d,e),null,null)}}(b,a,c,d,e)($d(e))}()],null):null}
function Ln(b,a,c){var d=null!=b&&(b.g&64||b.F)?F.a(Kc,b):b,e=J.a(d,Yh),f=J.a(d,Jj),g=J.a(d,nj),k=J.a(d,jh),l=null!=c&&(c.g&64||c.F)?F.a(Kc,c):c,m=J.a(l,ri),n=J.a(l,Ij),p=J.a(l,si);return new V(null,5,5,W,[Ci,new v(null,2,[Pi,"graph",vh,xn(g,k)],null),new V(null,2,5,W,[Aj,new v(null,2,[Yh,e,Jj,f],null)],null),new V(null,3,5,W,[Nj,new v(null,4,[Pi,"title",nj,e/2,jh,f/2,ci,10],null),p],null),function(){var q=f-60;return new V(null,5,5,W,[Ci,new v(null,1,[vh,xn(30,30)],null),function(){var r=Cg(function(){return function(a,
b,c,d,e,f,g,k,l,m,n,p,q){return function ya(r){return new de(null,function(a,b,c,d,e,f,g,k,l,m,n,p,q){return function(){for(var t=r;;){var w=L(t);if(w){var z=w;if(wd(z)){var A=Xb(z),C=P(A),E=he(C);return function(){for(var r=0;;)if(r<C){var H=G.a(A,r),I=null!=H&&(H.g&64||H.F)?F.a(Kc,H):H,Q=J.a(I,yh),S=J.a(I,Ch);x(Q)&&je(E,new v(null,2,[yh,Q,Oj,Fe(function(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,A,C,E,H,I){return function(a,b){return new V(null,2,5,W,[a,I.b?I.b(b):I.call(null,b)],null)}}(r,t,H,I,Q,S,A,C,
E,z,w,a,b,c,d,e,f,g,k,l,m,n,p,q),S)],null));r+=1}else return!0}()?ie(E.$(),ya(Yb(z))):ie(E.$(),null)}var H=M(z),I=null!=H&&(H.g&64||H.F)?F.a(Kc,H):H,Q=J.a(I,yh),S=J.a(I,Ch);if(x(Q))return Wc(new v(null,2,[yh,Q,Oj,Fe(function(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,A){return function(a,b){return new V(null,2,5,W,[a,A.b?A.b(b):A.call(null,b)],null)}}(t,H,I,Q,S,z,w,a,b,c,d,e,f,g,k,l,m,n,p,q),S)],null),ya(yc(z)));t=yc(z)}else return null}}}(a,b,c,d,e,f,g,k,l,m,n,p,q),null,null)}}(30,q,b,d,e,f,g,k,c,l,m,n,p)(a)}()),
t=Ve(Oj,K([r],0)),w=function(){var a=T.a(dd,t);return Qm.b?Qm.b(a):Qm.call(null,a)}(),z=null==n?w:nc.a(1,P(n))?new V(null,2,5,W,[M(n),dd(w)],null):n,C=Rm(function(){var a=T.a(M,t);return Qm.b?Qm.b(a):Qm.call(null,a)}(),new V(null,2,5,W,[0,e-60],null)),E=Rm(z,new V(null,2,5,W,[q,0],null)),I=function(a,b,c,d,e,f){return function(a){var b=R(a,0);a=R(a,1);return new V(null,2,5,W,[e.b?e.b(b):e.call(null,b),f.b?f.b(a):f.call(null,a)],null)}}(r,t,w,z,C,E,30,q,b,d,e,f,g,k,c,l,m,n,p),H=Wk(new V(null,2,5,W,
[Xk,Oj],null),function(a,b,c,d,e,f,g){return function(a){return T.a(g,a)}}(r,t,w,z,C,E,I,30,q,b,d,e,f,g,k,c,l,m,n,p),r);return bb(bb(zc,function(){return function(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,H,I){return function Rb(cd){return new de(null,function(){return function(){for(;;){var a=L(cd);if(a){if(wd(a)){var b=Xb(a),c=P(b),d=he(c);a:for(var e=0;;)if(e<c){var f=G.a(b,e),g=null!=f&&(f.g&64||f.F)?F.a(Kc,f):f,f=J.a(g,yh),g=J.a(g,Oj),f=new V(null,2,5,W,[kh,new v(null,2,[Pi,[D("history "),D(Sd(f))].join(""),
kj,wn(g)],null)],null);d.add(f);e+=1}else{b=!0;break a}return b?ie(d.$(),Rb(Yb(a))):ie(d.$(),null)}d=M(a);b=null!=d&&(d.g&64||d.F)?F.a(Kc,d):d;d=J.a(b,yh);b=J.a(b,Oj);return Wc(new V(null,2,5,W,[kh,new v(null,2,[Pi,[D("history "),D(Sd(d))].join(""),kj,wn(b)],null)],null),Rb(yc(a)))}return null}}}(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,H,I),null,null)}}(r,t,w,z,C,E,I,H,30,q,b,d,e,f,g,k,c,l,m,n,p)(H)}()),function(){return function(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,H,I){return function Rb(cd){return new de(null,
function(){return function(){for(;;){var a=L(cd);if(a){if(wd(a)){var b=Xb(a),c=P(b),d=he(c);a:for(var e=0;;)if(e<c){var f=G.a(b,e),f=null!=f&&(f.g&64||f.F)?F.a(Kc,f):f;J.a(f,yh);f=J.a(f,Oj);f=new V(null,2,5,W,[kh,new v(null,2,[Pi,""+D("history stroke"),kj,wn(f)],null)],null);d.add(f);e+=1}else{b=!0;break a}return b?ie(d.$(),Rb(Yb(a))):ie(d.$(),null)}d=M(a);d=null!=d&&(d.g&64||d.F)?F.a(Kc,d):d;J.a(d,yh);d=J.a(d,Oj);return Wc(new V(null,2,5,W,[kh,new v(null,2,[Pi,""+D("history stroke"),kj,wn(d)],null)],
null),Rb(yc(a)))}return null}}}(a,b,c,d,e,f,g,k,l,m,n,p,q,r,t,w,z,C,E,H,I),null,null)}}(r,t,w,z,C,E,I,H,30,q,b,d,e,f,g,k,c,l,m,n,p)(H)}())}(),new V(null,2,5,W,[Ji,new v(null,3,[Pi,"axis",vh,xn(0,q),Ej,e-60],null)],null),new V(null,2,5,W,[Ji,new v(null,2,[Pi,"axis",tj,q],null)],null)],null)}()],null)}
function Mn(b,a){var c=Pm(b),d=R(c,0),e=R(c,1),f=R(c,2),g=R(c,3);return new V(null,6,5,W,[Ci,new v(null,1,[Oi,"graphs"],null),Ln(d,a,new v(null,2,[si,"Work in Progress",ri,oi],null)),Ln(e,a,new v(null,2,[si,"Total Output",ri,ei],null)),Ln(f,a,new v(null,2,[si,"Inventory Turns",ri,uh],null)),Ln(g,a,new v(null,3,[si,"Utilization",ri,Ce.a(function(){return function(a){return F.a(Kd,a)}}(c,d,e,f,g),Nh),Ij,new V(null,2,5,W,[0,1],null)],null))],null)}
function Nn(b){var a=On,c=null!=b&&(b.g&64||b.F)?F.a(Kc,b):b,d=J.a(c,Yh),e=J.a(c,Jj),f=J.a(c,Bj),g=J.a(c,df),k=J.a(c,Rh),l=J.a(c,Ih);return new V(null,5,5,W,[vj,we,new V(null,3,5,W,[zi,new v(null,1,[yi,new v(null,3,[gj,sj,Lj,"5px",Lh,"5px"],null)],null),new V(null,4,5,W,[zi,we,f," steps"],null)],null),new V(null,4,5,W,[zi,new v(null,1,[Oi,"controls"],null),new V(null,6,5,W,[Uh,new v(null,1,[pi,"slidden"],null),new V(null,3,5,W,[Kh,new v(null,1,[bi,function(){return function(){var b=new V(null,3,5,
W,[sh,1,!0],null);return a.b?a.b(b):a.call(null,b)}}(b,c,d,e,f,g,k,l)],null),"Roll"],null),new V(null,3,5,W,[Kh,new v(null,1,[bi,function(){return function(){var b=new V(null,3,5,W,[sh,100,!0],null);return a.b?a.b(b):a.call(null,b)}}(b,c,d,e,f,g,k,l)],null),"Run"],null),new V(null,3,5,W,[Kh,new v(null,1,[bi,function(){return function(){var b=new V(null,3,5,W,[sh,100,!1],null);return a.b?a.b(b):a.call(null,b)}}(b,c,d,e,f,g,k,l)],null),"Run Fast"],null),new V(null,3,5,W,[Kh,new v(null,1,[bi,function(b,
c,d,e,f,g,k,l){return function(){var b=new V(null,2,5,W,[hj,Na(l)],null);return a.b?a.b(b):a.call(null,b)}}(b,c,d,e,f,g,k,l)],null),x(l)?"Hide graphs":"Show graphs"],null)],null),new V(null,7,5,W,[Uh,new v(null,1,[pi,"slidden"],null),new V(null,3,5,W,[Kh,new v(null,1,[bi,function(){return function(){var b=new V(null,2,5,W,[Hi,ij],null);return a.b?a.b(b):a.call(null,b)}}(b,c,d,e,f,g,k,l)],null),"Basic"],null),new V(null,3,5,W,[Kh,new v(null,1,[bi,function(){return function(){var b=new V(null,2,5,W,
[Hi,Hh],null);return a.b?a.b(b):a.call(null,b)}}(b,c,d,e,f,g,k,l)],null),"Efficient"],null),new V(null,3,5,W,[Kh,new v(null,1,[bi,function(){return function(){var b=new V(null,2,5,W,[Hi,Mh],null);return a.b?a.b(b):a.call(null,b)}}(b,c,d,e,f,g,k,l)],null),"Basic \x26 Efficient"],null),new V(null,3,5,W,[Kh,new v(null,1,[bi,function(){return function(){var b=new V(null,2,5,W,[Hi,ji],null);return a.b?a.b(b):a.call(null,b)}}(b,c,d,e,f,g,k,l)],null),"Constrained"],null),new V(null,3,5,W,[Kh,new v(null,
1,[bi,function(){return function(){var b=new V(null,2,5,W,[Hi,mi],null);return a.b?a.b(b):a.call(null,b)}}(b,c,d,e,f,g,k,l)],null),"All 3"],null)],null)],null),new V(null,5,5,W,[Yi,new v(null,3,[Oi,"space",Yh,"100%",Jj,"100%"],null),function(){return function(a,b,c,d,e,f,g,k){return function E(l){return new de(null,function(){return function(){for(;;){var a=L(l);if(a){if(wd(a)){var b=Xb(a),c=P(b),d=he(c);a:for(var e=0;;)if(e<c){var f=G.a(b,e),g=null!=f&&(f.g&64||f.F)?F.a(Kc,f):f,f=g,k=J.a(g,nj),g=
J.a(g,jh),f=x(k)?new V(null,3,5,W,[Ci,new v(null,1,[vh,xn(k,g)],null),yn(f)],null):null;d.add(f);e+=1}else{b=!0;break a}return b?ie(d.$(),E(Yb(a))):ie(d.$(),null)}d=M(a);d=c=null!=d&&(d.g&64||d.F)?F.a(Kc,d):d;b=J.a(c,nj);c=J.a(c,jh);return Wc(x(b)?new V(null,3,5,W,[Ci,new v(null,1,[vh,xn(b,c)],null),yn(d)],null):null,E(yc(a)))}return null}}}(a,b,c,d,e,f,g,k),null,null)}}(b,c,d,e,f,g,k,l)(g)}(),T.a(Kn,k),x(x(d)?x(e)?l:e:d)?Mn(new V(null,2,5,W,[d,e],null),k):null],null)],null)};xa=function(){function b(b){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new xc(e,0)}return a.call(this,d)}function a(a){return console.log.apply(console,Ja.b?Ja.b(a):Ja.call(null,a))}b.w=0;b.D=function(b){b=L(b);return a(b)};b.j=a;return b}();
za=function(){function b(b){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new xc(e,0)}return a.call(this,d)}function a(a){return console.error.apply(console,Ja.b?Ja.b(a):Ja.call(null,a))}b.w=0;b.D=function(b){b=L(b);return a(b)};b.j=a;return b}();
function Pn(b){var a=new v(null,2,[nj,45,Yh,60],null),c=null!=a&&(a.g&64||a.F)?F.a(Kc,a):a,d=J.a(c,Yh),e=J.a(c,nj),f=Ne(1,Eh.b(M(We(yh,Rh.b(b))))),g=T.a(Jj,f),k=T.a(jh,f);return cf(b,De(T,function(a,b,c,d,e,f,g){return function(a,b,c){return kd.j(a,nj,g,K([jh,b+c+(0-f/2-20),Yh,f,Jj,f],0))}}(f,g,k,a,c,d,e)),k,g)}if("undefined"===typeof bn)var bn=xm(null);function On(b){return Am(bn,b)}if("undefined"===typeof Qn)var Qn=X.b?X.b(!1):X.call(null,!1);
function Rn(b,a){var c=xm(1);em(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!U(e,Y)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Ql(c),d=Y;else throw f;}if(!U(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.l=c;d.b=b;return d}()}(function(){return function(c){var d=c[1];if(7===d){var d=c[2],e=Um();c[7]=d;return Ml(c,8,e)}if(20===d)return c[8]=c[2],c[1]=x(a)?21:22,Y;if(27===d)return d=c[2],c[1]=x(d)?28:29,Y;if(1===d)return Nl(c,2,bn,fj);if(24===d)return d=c[2],c[2]=d,c[1]=23,Y;if(4===d)return d=new V(null,2,5,W,[Ah,!0],null),Nl(c,7,bn,d);if(15===d)return c[9]=c[2],Nl(c,19,bn,zj);if(21===d)return c[2]=null,c[1]=23,Y;if(31===
d)return d=c[2],c[2]=d,c[1]=30,Y;if(13===d)return d=new V(null,2,5,W,[wi,!0],null),Nl(c,16,bn,d);if(22===d)return d=O.b?O.b(en):O.call(null,en),d=d.b?d.b(Bj):d.call(null,Bj),d=vm(d),Ml(c,24,d);if(29===d)return c[2]=null,c[1]=30,Y;if(6===d)return c[10]=c[2],Nl(c,10,bn,ej);if(28===d)return d=c[11],d=new V(null,3,5,W,[sh,d,a],null),Nl(c,31,bn,d);if(25===d)return d=c[11],c[2]=0<d,c[1]=27,Y;if(17===d)return d=new V(null,2,5,W,[wi,!1],null),c[12]=c[2],Nl(c,18,bn,d);if(3===d)return c[13]=c[2],c[1]=x(a)?
4:5,Y;if(12===d)return c[14]=c[2],c[1]=x(a)?13:14,Y;if(2===d)return c[15]=c[2],Nl(c,3,bn,oh);if(23===d){var d=c[16],e=c[2],d=b-1,f=O.b?O.b(Qn):O.call(null,Qn);c[16]=f;c[11]=d;c[17]=e;c[1]=x(f)?25:26;return Y}return 19===d?(c[18]=c[2],Nl(c,20,bn,Di)):11===d?(c[19]=c[2],Nl(c,12,bn,Fi)):9===d?(d=c[2],c[2]=d,c[1]=6,Y):5===d?(c[2]=null,c[1]=6,Y):14===d?(c[2]=null,c[1]=15,Y):26===d?(d=c[16],c[2]=d,c[1]=27,Y):16===d?(d=c[2],e=Um(),c[20]=d,Ml(c,17,e)):30===d?(d=c[2],Ol(c,d)):10===d?(c[21]=c[2],Nl(c,11,bn,
Ei)):18===d?(d=c[2],c[2]=d,c[1]=15,Y):8===d?(d=new V(null,2,5,W,[Ah,!1],null),c[22]=c[2],Nl(c,9,bn,d)):null}}(c),c)}(),f=function(){var a=e.l?e.l():e.call(null);a[6]=c;return a}();return Ll(f)}}(c))}
function Sn(){var b=xm(1);em(function(a){return function(){var b=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var f=a(c);if(!U(f,Y)){d=f;break a}}}catch(g){if(g instanceof Object)c[5]=g,Ql(c),d=Y;else throw g;}if(!U(d,Y))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+
arguments.length);};d.l=c;d.b=b;return d}()}(function(a){return function(b){var c=b[1];if(1===c){var d=vm(50);return Ml(b,2,d)}if(2===c){var l=b[2],m=function(){return function(){return function(a){return a.width}}(l,c,a)}(),d=Bg(m,function(){return function(){return function(a){return a.height}}(l,m,c,a)}()),n=document.getElementById("space").getBoundingClientRect(),n=d.b?d.b(n):d.call(null,n),d=R(n,0),n=R(n,1),d=Am(bn,new V(null,3,5,W,[qi,d,n],null)),n=vm(100);b[7]=d;b[8]=l;return Ml(b,3,n)}if(3===
c){var d=b[2],n=Am(bn,uj),p=vm(100);b[9]=n;b[10]=d;return Ml(b,4,p)}return 4===c?(d=b[2],n=Am(bn,Fi),b[11]=d,Ol(b,n)):null}}(a),a)}(),d=function(){var d=b.l?b.l():b.call(null);d[6]=a;return d}();return Ll(d)}}(b))}
function $m(b,a){var c=null!=b&&(b.g&64||b.F)?F.a(Kc,b):b,d=J.a(c,Rh);try{if(U(a,ti))return c;throw Mm;}catch(e){if(e instanceof Error)if(e===Mm)try{if(td(a)&&3===P(a))try{var f=id(a,0);if(U(f,qi)){var g=id(a,1),k=id(a,2);return Pn(af(kd.j(c,Yh,g,K([Jj,k],0)),Rh,De(Xj,new v(null,3,[nj,150,Yh,g-150,Jj,k],null))))}throw Mm;}catch(l){if(l instanceof Error){f=l;if(f===Mm)throw Mm;throw f;}throw l;}else throw Mm;}catch(m){if(m instanceof Error)if(f=m,f===Mm)try{if(U(a,uj))return hl(c,function(){return function(a){a=
null!=a&&(a.g&64||a.F)?F.a(Kc,a):a;var b=J.a(a,Oi),b=gn(b);return x(b)?kd.c(a,$i,b.getTotalLength()):a}}(f,e,b,c,c,d));throw Mm;}catch(n){if(n instanceof Error)if(n===Mm)try{if(td(a)&&2===P(a))try{var p=id(a,0);if(U(p,Hi)){var q=id(a,1);Je.a?Je.a(Qn,!1):Je.call(null,Qn,!1);Sn();return fl(sn.b?sn.b(q):sn.call(null,q))}throw Mm;}catch(r){if(r instanceof Error){p=r;if(p===Mm)throw Mm;throw p;}throw r;}else throw Mm;}catch(t){if(t instanceof Error)if(p=t,p===Mm)try{if(td(a)&&3===P(a))try{var w=id(a,0);
if(U(w,sh)){var z=id(a,1),C=id(a,2);Je.a?Je.a(Qn,!0):Je.call(null,Qn,!0);Rn(z,C);return c}throw Mm;}catch(E){if(E instanceof Error){w=E;if(w===Mm)throw Mm;throw w;}throw E;}else throw Mm;}catch(I){if(I instanceof Error)if(w=I,w===Mm)try{if(U(a,fj))return bf(af(c,Bj,Nc),df,il,Fd(Qe(function(){return function(){return 6*Math.random()+1|0}}(w,p,n,f,e,b,c,c,d))));throw Mm;}catch(H){if(H instanceof Error)if(H===Mm)try{if(U(a,oh))return ll(c);throw Mm;}catch(sa){if(sa instanceof Error)if(sa===Mm)try{if(td(a)&&
2===P(a))try{var A=id(a,0);if(U(A,Ah)){var ga=id(a,1);return hl(c,function(a){return function(b){return kd.c(b,ki,a)}}(ga,A,sa,H,w,p,n,f,e,b,c,c,d))}throw Mm;}catch(ka){if(ka instanceof Error){A=ka;if(A===Mm)throw Mm;throw A;}throw ka;}else throw Mm;}catch(Q){if(Q instanceof Error)if(A=Q,A===Mm)try{if(U(a,ej))return vl(c);throw Mm;}catch(S){if(S instanceof Error)if(S===Mm)try{if(U(a,Ei))return xl(c);throw Mm;}catch(ba){if(ba instanceof Error)if(ba===Mm)try{if(U(a,Fi))return wl(c);throw Mm;}catch(ca){if(ca instanceof
Error)if(ca===Mm)try{if(td(a)&&2===P(a))try{var ha=id(a,0);if(U(ha,wi))return ga=id(a,1),hl(c,function(a){return function(b){return kd.c(b,lj,a)}}(ga,ha,ca,ba,S,A,sa,H,w,p,n,f,e,b,c,c,d));throw Mm;}catch(ja){if(ja instanceof Error){d=ja;if(d===Mm)throw Mm;throw d;}throw ja;}else throw Mm;}catch(ma){if(ma instanceof Error)if(d=ma,d===Mm)try{if(U(a,zj))return yl(c);throw Mm;}catch(oa){if(oa instanceof Error)if(oa===Mm)try{if(U(a,Di))return Al(c);throw Mm;}catch(va){if(va instanceof Error)if(va===Mm)try{if(td(a)&&
2===P(a))try{var Sa=id(a,0);if(U(Sa,hj))return ga=id(a,1),kd.c(c,Ih,ga);throw Mm;}catch(ya){if(ya instanceof Error){c=ya;if(c===Mm)throw Mm;throw c;}throw ya;}else throw Mm;}catch(Ea){if(Ea instanceof Error){c=Ea;if(c===Mm)throw Error([D("No matching clause: "),D(a)].join(""));throw c;}throw Ea;}else throw va;else throw va;}else throw oa;else throw oa;}else throw d;else throw ma;}else throw ca;else throw ca;}else throw ba;else throw ba;}else throw S;else throw S;}else throw A;else throw Q;}else throw sa;
else throw sa;}else throw H;else throw H;}else throw w;else throw I;}else throw p;else throw t;}else throw n;else throw n;}else throw f;else throw m;}else throw e;else throw e;}}var an=fl(sn.b?sn.b(ij):sn.call(null,ij));if("undefined"===typeof Cm)var Cm=Zm();if("undefined"===typeof Tn){var dn;dn=Bm(function(b){return Nn(b)});var Tn;Tn=cn()}Sn();