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
    var newNode = renderOptions.render(vNode, renderOptions)

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
        newNode = renderOptions.render(vText, renderOptions)

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
        newNode = renderOptions.render(widget, renderOptions)
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
    var newNode = renderOptions.render(vNode, renderOptions)

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

},{"../vnode/is-widget.js":30,"../vnode/vpatch.js":33,"./apply-properties":12,"./update-widget":17}],16:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var render = require("./create-element")
var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {}
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive
    renderOptions.render = renderOptions.render || render

    return renderOptions.patch(rootNode, patches, renderOptions)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions.document && ownerDocument !== document) {
        renderOptions.document = ownerDocument
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

},{"./create-element":13,"./dom-index":14,"./patch-op":15,"global/document":8,"x-is-array":10}],17:[function(require,module,exports){
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
    } else if (typeof c === 'number') {
        childNodes.push(new VText(String(c)));
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

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
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
        free: free      // An array of unkeyed item indices
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
  VSvg: require("virtual-dom/virtual-hyperscript/svg"),
  isVirtualNode: require("virtual-dom/vnode/is-vnode")
}

},{"virtual-dom/create-element":2,"virtual-dom/diff":3,"virtual-dom/patch":11,"virtual-dom/virtual-hyperscript/svg":24,"virtual-dom/vnode/is-vnode":28,"virtual-dom/vnode/vnode":32,"virtual-dom/vnode/vtext":34}]},{},[37]);

var k,aa=this;function ba(a,b){var c=a.split("."),d=aa;c[0]in d||!d.execScript||d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)c.length||void 0===b?d=d[e]?d[e]:d[e]={}:d[e]=b}
function t(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function ca(a){return"function"==t(a)}function da(a){return a[ea]||(a[ea]=++fa)}var ea="closure_uid_"+(1E9*Math.random()>>>0),fa=0;function ga(a,b,c){return a.call.apply(a.bind,arguments)}
function ma(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function pa(a,b,c){pa=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ga:ma;return pa.apply(null,arguments)}var qa=Date.now||function(){return+new Date};Math.random();function ra(a,b){for(var c in a)b.call(void 0,a[c],c,a)};function sa(a,b){null!=a&&this.append.apply(this,arguments)}k=sa.prototype;k.cb="";k.set=function(a){this.cb=""+a};k.append=function(a,b,c){this.cb+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.cb+=arguments[d];return this};k.clear=function(){this.cb=""};k.toString=function(){return this.cb};function ta(a,b){a.sort(b||va)}function wa(a,b){for(var c=0;c<a.length;c++)a[c]={index:c,value:a[c]};var d=b||va;ta(a,function(a,b){return d(a.value,b.value)||a.index-b.index});for(c=0;c<a.length;c++)a[c]=a[c].value}function va(a,b){return a>b?1:a<b?-1:0};var xa={},za;if("undefined"===typeof Ba)var Ba=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof Ea)var Ea=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var Fa=!0,Ga=null;if("undefined"===typeof Ha)var Ha=null;function Ia(){return new v(null,5,[Ja,!0,Ka,!0,La,!1,Ma,!1,Na,null],null)}Oa;function w(a){return null!=a&&!1!==a}Qa;x;function Ra(a){return null==a}function Sa(a){return a instanceof Array}
function Ta(a){return null==a?!0:!1===a?!0:!1}function Ua(a,b){return a[t(null==b?null:b)]?!0:a._?!0:!1}function Va(a,b){var c=null==b?null:b.constructor,c=w(w(c)?c.tb:c)?c.Za:t(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function Xa(a){var b=a.Za;return w(b)?b:""+A(a)}var Ya="undefined"!==typeof Symbol&&"function"===t(Symbol)?Symbol.iterator:"@@iterator";function Za(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}B;$a;
var Oa=function Oa(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Oa.b(arguments[0]);case 2:return Oa.a(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};Oa.b=function(a){return Oa.a(null,a)};Oa.a=function(a,b){function c(a,b){a.push(b);return a}var d=[];return $a.c?$a.c(c,d,b):$a.call(null,c,d,b)};Oa.w=2;function ab(){}function bb(){}
var cb=function cb(b){if(null!=b&&null!=b.Z)return b.Z(b);var c=cb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=cb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("ICounted.-count",b);},db=function db(b){if(null!=b&&null!=b.ca)return b.ca(b);var c=db[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=db._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IEmptyableCollection.-empty",b);};function eb(){}
var fb=function fb(b,c){if(null!=b&&null!=b.X)return b.X(b,c);var d=fb[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=fb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("ICollection.-conj",b);};function gb(){}
var hb=function hb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return hb.a(arguments[0],arguments[1]);case 3:return hb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
hb.a=function(a,b){if(null!=a&&null!=a.ba)return a.ba(a,b);var c=hb[t(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=hb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Va("IIndexed.-nth",a);};hb.c=function(a,b,c){if(null!=a&&null!=a.Ea)return a.Ea(a,b,c);var d=hb[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=hb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Va("IIndexed.-nth",a);};hb.w=3;function kb(){}
var lb=function lb(b){if(null!=b&&null!=b.ta)return b.ta(b);var c=lb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=lb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("ISeq.-first",b);},mb=function mb(b){if(null!=b&&null!=b.xa)return b.xa(b);var c=mb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=mb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("ISeq.-rest",b);};function nb(){}function ob(){}
var pb=function pb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return pb.a(arguments[0],arguments[1]);case 3:return pb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
pb.a=function(a,b){if(null!=a&&null!=a.N)return a.N(a,b);var c=pb[t(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=pb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Va("ILookup.-lookup",a);};pb.c=function(a,b,c){if(null!=a&&null!=a.I)return a.I(a,b,c);var d=pb[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=pb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Va("ILookup.-lookup",a);};pb.w=3;function qb(){}
var rb=function rb(b,c){if(null!=b&&null!=b.hc)return b.hc(b,c);var d=rb[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=rb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("IAssociative.-contains-key?",b);},sb=function sb(b,c,d){if(null!=b&&null!=b.Ra)return b.Ra(b,c,d);var e=sb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=sb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Va("IAssociative.-assoc",b);};function tb(){}
var ub=function ub(b,c){if(null!=b&&null!=b.sb)return b.sb(b,c);var d=ub[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=ub._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("IMap.-dissoc",b);};function vb(){}
var wb=function wb(b){if(null!=b&&null!=b.Ib)return b.Ib(b);var c=wb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=wb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IMapEntry.-key",b);},xb=function xb(b){if(null!=b&&null!=b.Jb)return b.Jb(b);var c=xb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=xb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IMapEntry.-val",b);};function yb(){}
var zb=function zb(b){if(null!=b&&null!=b.eb)return b.eb(b);var c=zb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=zb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IStack.-peek",b);};function Ab(){}
var Cb=function Cb(b,c,d){if(null!=b&&null!=b.fb)return b.fb(b,c,d);var e=Cb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Cb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Va("IVector.-assoc-n",b);},Db=function Db(b){if(null!=b&&null!=b.Fb)return b.Fb(b);var c=Db[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Db._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IDeref.-deref",b);};function Eb(){}
var Fb=function Fb(b){if(null!=b&&null!=b.P)return b.P(b);var c=Fb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Fb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IMeta.-meta",b);},Gb=function Gb(b,c){if(null!=b&&null!=b.R)return b.R(b,c);var d=Gb[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Gb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("IWithMeta.-with-meta",b);};function Hb(){}
var Ib=function Ib(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ib.a(arguments[0],arguments[1]);case 3:return Ib.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
Ib.a=function(a,b){if(null!=a&&null!=a.ea)return a.ea(a,b);var c=Ib[t(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=Ib._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Va("IReduce.-reduce",a);};Ib.c=function(a,b,c){if(null!=a&&null!=a.fa)return a.fa(a,b,c);var d=Ib[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=Ib._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Va("IReduce.-reduce",a);};Ib.w=3;
var Kb=function Kb(b,c,d){if(null!=b&&null!=b.Hb)return b.Hb(b,c,d);var e=Kb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Kb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Va("IKVReduce.-kv-reduce",b);},Lb=function Lb(b,c){if(null!=b&&null!=b.D)return b.D(b,c);var d=Lb[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Lb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("IEquiv.-equiv",b);},Mb=function Mb(b){if(null!=b&&null!=b.S)return b.S(b);
var c=Mb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Mb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IHash.-hash",b);};function Nb(){}var Ob=function Ob(b){if(null!=b&&null!=b.U)return b.U(b);var c=Ob[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Ob._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("ISeqable.-seq",b);};function Pb(){}function Qb(){}function Rb(){}
var Sb=function Sb(b){if(null!=b&&null!=b.Zb)return b.Zb(b);var c=Sb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Sb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IReversible.-rseq",b);},Tb=function Tb(b,c){if(null!=b&&null!=b.xc)return b.xc(0,c);var d=Tb[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Tb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("IWriter.-write",b);},Ub=function Ub(b,c,d){if(null!=b&&null!=b.L)return b.L(b,c,d);
var e=Ub[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Ub._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Va("IPrintWithWriter.-pr-writer",b);},Vb=function Vb(b,c,d){if(null!=b&&null!=b.wc)return b.wc(0,c,d);var e=Vb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Vb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Va("IWatchable.-notify-watches",b);},Wb=function Wb(b,c,d){if(null!=b&&null!=b.vc)return b.vc(0,c,d);var e=Wb[t(null==
b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Wb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Va("IWatchable.-add-watch",b);},Xb=function Xb(b){if(null!=b&&null!=b.qb)return b.qb(b);var c=Xb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Xb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IEditableCollection.-as-transient",b);},Yb=function Yb(b,c){if(null!=b&&null!=b.Nb)return b.Nb(b,c);var d=Yb[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,
c):d.call(null,b,c);d=Yb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("ITransientCollection.-conj!",b);},Zb=function Zb(b){if(null!=b&&null!=b.Ob)return b.Ob(b);var c=Zb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Zb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("ITransientCollection.-persistent!",b);},$b=function $b(b,c,d){if(null!=b&&null!=b.Mb)return b.Mb(b,c,d);var e=$b[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=$b._;if(null!=
e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Va("ITransientAssociative.-assoc!",b);},ac=function ac(b,c,d){if(null!=b&&null!=b.uc)return b.uc(0,c,d);var e=ac[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=ac._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Va("ITransientVector.-assoc-n!",b);};function bc(){}
var cc=function cc(b,c){if(null!=b&&null!=b.pb)return b.pb(b,c);var d=cc[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=cc._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("IComparable.-compare",b);},dc=function dc(b){if(null!=b&&null!=b.rc)return b.rc();var c=dc[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=dc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IChunk.-drop-first",b);},ec=function ec(b){if(null!=b&&null!=b.jc)return b.jc(b);
var c=ec[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ec._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IChunkedSeq.-chunked-first",b);},fc=function fc(b){if(null!=b&&null!=b.kc)return b.kc(b);var c=fc[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=fc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IChunkedSeq.-chunked-rest",b);},gc=function gc(b){if(null!=b&&null!=b.ic)return b.ic(b);var c=gc[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,
b);c=gc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IChunkedNext.-chunked-next",b);},hc=function hc(b){if(null!=b&&null!=b.Kb)return b.Kb(b);var c=hc[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=hc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("INamed.-name",b);},ic=function ic(b){if(null!=b&&null!=b.Lb)return b.Lb(b);var c=ic[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ic._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("INamed.-namespace",
b);},jc=function jc(b,c){if(null!=b&&null!=b.Wc)return b.Wc(b,c);var d=jc[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=jc._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("IReset.-reset!",b);},kc=function kc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return kc.a(arguments[0],arguments[1]);case 3:return kc.c(arguments[0],arguments[1],arguments[2]);case 4:return kc.l(arguments[0],arguments[1],arguments[2],
arguments[3]);case 5:return kc.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};kc.a=function(a,b){if(null!=a&&null!=a.Yc)return a.Yc(a,b);var c=kc[t(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=kc._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Va("ISwap.-swap!",a);};
kc.c=function(a,b,c){if(null!=a&&null!=a.Zc)return a.Zc(a,b,c);var d=kc[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=kc._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Va("ISwap.-swap!",a);};kc.l=function(a,b,c,d){if(null!=a&&null!=a.$c)return a.$c(a,b,c,d);var e=kc[t(null==a?null:a)];if(null!=e)return e.l?e.l(a,b,c,d):e.call(null,a,b,c,d);e=kc._;if(null!=e)return e.l?e.l(a,b,c,d):e.call(null,a,b,c,d);throw Va("ISwap.-swap!",a);};
kc.A=function(a,b,c,d,e){if(null!=a&&null!=a.ad)return a.ad(a,b,c,d,e);var f=kc[t(null==a?null:a)];if(null!=f)return f.A?f.A(a,b,c,d,e):f.call(null,a,b,c,d,e);f=kc._;if(null!=f)return f.A?f.A(a,b,c,d,e):f.call(null,a,b,c,d,e);throw Va("ISwap.-swap!",a);};kc.w=5;var lc=function lc(b){if(null!=b&&null!=b.Ha)return b.Ha(b);var c=lc[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=lc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IIterable.-iterator",b);};
function mc(a){this.qd=a;this.g=1073741824;this.C=0}mc.prototype.xc=function(a,b){return this.qd.append(b)};function nc(a){var b=new sa;a.L(null,new mc(b),Ia());return""+A(b)}var oc="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function pc(a){a=oc(a|0,-862048943);return oc(a<<15|a>>>-15,461845907)}
function qc(a,b){var c=(a|0)^(b|0);return oc(c<<13|c>>>-13,5)+-430675100|0}function rc(a,b){var c=(a|0)^b,c=oc(c^c>>>16,-2048144789),c=oc(c^c>>>13,-1028477387);return c^c>>>16}function sc(a){var b;a:{b=1;for(var c=0;;)if(b<a.length){var d=b+2,c=qc(c,pc(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^pc(a.charCodeAt(a.length-1)):b;return rc(b,oc(2,a.length))}tc;uc;vc;wc;var xc={},yc=0;
function zc(a){255<yc&&(xc={},yc=0);var b=xc[a];if("number"!==typeof b){a:if(null!=a)if(b=a.length,0<b)for(var c=0,d=0;;)if(c<b)var e=c+1,d=oc(31,d)+a.charCodeAt(c),c=e;else{b=d;break a}else b=0;else b=0;xc[a]=b;yc+=1}return a=b}function Ac(a){null!=a&&(a.g&4194304||a.xd)?a=a.S(null):"number"===typeof a?a=Math.floor(a)%2147483647:!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=zc(a),0!==a&&(a=pc(a),a=qc(0,a),a=rc(a,4))):a=a instanceof Date?a.valueOf():null==a?0:Mb(a);return a}
function Bc(a,b){return a^b+2654435769+(a<<6)+(a>>2)}function Qa(a,b){return b instanceof a}function Cc(a,b){if(a.Va===b.Va)return 0;var c=Ta(a.Ba);if(w(c?b.Ba:c))return-1;if(w(a.Ba)){if(Ta(b.Ba))return 1;c=va(a.Ba,b.Ba);return 0===c?va(a.name,b.name):c}return va(a.name,b.name)}C;function uc(a,b,c,d,e){this.Ba=a;this.name=b;this.Va=c;this.ob=d;this.Da=e;this.g=2154168321;this.C=4096}k=uc.prototype;k.toString=function(){return this.Va};k.equiv=function(a){return this.D(null,a)};
k.D=function(a,b){return b instanceof uc?this.Va===b.Va:!1};k.call=function(){function a(a,b,c){return C.c?C.c(b,this,c):C.call(null,b,this,c)}function b(a,b){return C.a?C.a(b,this):C.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};
k.b=function(a){return C.a?C.a(a,this):C.call(null,a,this)};k.a=function(a,b){return C.c?C.c(a,this,b):C.call(null,a,this,b)};k.P=function(){return this.Da};k.R=function(a,b){return new uc(this.Ba,this.name,this.Va,this.ob,b)};k.S=function(){var a=this.ob;return null!=a?a:this.ob=a=Bc(sc(this.name),zc(this.Ba))};k.Kb=function(){return this.name};k.Lb=function(){return this.Ba};k.L=function(a,b){return Tb(b,this.Va)};
var Dc=function Dc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Dc.b(arguments[0]);case 2:return Dc.a(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};Dc.b=function(a){if(a instanceof uc)return a;var b=a.indexOf("/");return-1===b?Dc.a(null,a):Dc.a(a.substring(0,b),a.substring(b+1,a.length))};Dc.a=function(a,b){var c=null!=a?[A(a),A("/"),A(b)].join(""):b;return new uc(a,b,c,null,null)};
Dc.w=2;G;Ec;Fc;function H(a){if(null==a)return null;if(null!=a&&(a.g&8388608||a.Xc))return a.U(null);if(Sa(a)||"string"===typeof a)return 0===a.length?null:new Fc(a,0);if(Ua(Nb,a))return Ob(a);throw Error([A(a),A(" is not ISeqable")].join(""));}function I(a){if(null==a)return null;if(null!=a&&(a.g&64||a.F))return a.ta(null);a=H(a);return null==a?null:lb(a)}function Gc(a){return null!=a?null!=a&&(a.g&64||a.F)?a.xa(null):(a=H(a))?mb(a):Hc:Hc}
function J(a){return null==a?null:null!=a&&(a.g&128||a.Yb)?a.wa(null):H(Gc(a))}var vc=function vc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return vc.b(arguments[0]);case 2:return vc.a(arguments[0],arguments[1]);default:return vc.h(arguments[0],arguments[1],new Fc(c.slice(2),0))}};vc.b=function(){return!0};vc.a=function(a,b){return null==a?null==b:a===b||Lb(a,b)};
vc.h=function(a,b,c){for(;;)if(vc.a(a,b))if(J(c))a=b,b=I(c),c=J(c);else return vc.a(b,I(c));else return!1};vc.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return vc.h(b,a,c)};vc.w=2;function Ic(a){this.H=a}Ic.prototype.next=function(){if(null!=this.H){var a=I(this.H);this.H=J(this.H);return{value:a,done:!1}}return{value:null,done:!0}};function Kc(a){return new Ic(H(a))}Lc;function Mc(a,b,c){this.value=a;this.zb=b;this.gc=c;this.g=8388672;this.C=0}Mc.prototype.U=function(){return this};
Mc.prototype.ta=function(){return this.value};Mc.prototype.xa=function(){null==this.gc&&(this.gc=Lc.b?Lc.b(this.zb):Lc.call(null,this.zb));return this.gc};function Lc(a){var b=a.next();return w(b.done)?Hc:new Mc(b.value,a,null)}function Nc(a,b){var c=pc(a),c=qc(0,c);return rc(c,b)}function Oc(a){var b=0,c=1;for(a=H(a);;)if(null!=a)b+=1,c=oc(31,c)+Ac(I(a))|0,a=J(a);else return Nc(c,b)}var Pc=Nc(1,0);function Qc(a){var b=0,c=0;for(a=H(a);;)if(null!=a)b+=1,c=c+Ac(I(a))|0,a=J(a);else return Nc(c,b)}
var Rc=Nc(0,0);Sc;tc;Tc;bb["null"]=!0;cb["null"]=function(){return 0};Date.prototype.D=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};Date.prototype.Eb=!0;Date.prototype.pb=function(a,b){if(b instanceof Date)return va(this.valueOf(),b.valueOf());throw Error([A("Cannot compare "),A(this),A(" to "),A(b)].join(""));};Lb.number=function(a,b){return a===b};Uc;ab["function"]=!0;Eb["function"]=!0;Fb["function"]=function(){return null};Mb._=function(a){return da(a)};
function Vc(a){return a+1}K;function Wc(a){this.G=a;this.g=32768;this.C=0}Wc.prototype.Fb=function(){return this.G};function Xc(a){return a instanceof Wc}function K(a){return Db(a)}function Yc(a,b){var c=cb(a);if(0===c)return b.m?b.m():b.call(null);for(var d=hb.a(a,0),e=1;;)if(e<c){var f=hb.a(a,e),d=b.a?b.a(d,f):b.call(null,d,f);if(Xc(d))return Db(d);e+=1}else return d}
function Zc(a,b,c){var d=cb(a),e=c;for(c=0;;)if(c<d){var f=hb.a(a,c),e=b.a?b.a(e,f):b.call(null,e,f);if(Xc(e))return Db(e);c+=1}else return e}function $c(a,b){var c=a.length;if(0===a.length)return b.m?b.m():b.call(null);for(var d=a[0],e=1;;)if(e<c){var f=a[e],d=b.a?b.a(d,f):b.call(null,d,f);if(Xc(d))return Db(d);e+=1}else return d}function ad(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var f=a[c],e=b.a?b.a(e,f):b.call(null,e,f);if(Xc(e))return Db(e);c+=1}else return e}
function bd(a,b,c,d){for(var e=a.length;;)if(d<e){var f=a[d];c=b.a?b.a(c,f):b.call(null,c,f);if(Xc(c))return Db(c);d+=1}else return c}cd;M;dd;ed;function fd(a){return null!=a?a.g&2||a.Nc?!0:a.g?!1:Ua(bb,a):Ua(bb,a)}function gd(a){return null!=a?a.g&16||a.sc?!0:a.g?!1:Ua(gb,a):Ua(gb,a)}function hd(a,b){this.f=a;this.s=b}hd.prototype.ya=function(){return this.s<this.f.length};hd.prototype.next=function(){var a=this.f[this.s];this.s+=1;return a};
function Fc(a,b){this.f=a;this.s=b;this.g=166199550;this.C=8192}k=Fc.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.ba=function(a,b){var c=b+this.s;return c<this.f.length?this.f[c]:null};k.Ea=function(a,b,c){a=b+this.s;return a<this.f.length?this.f[a]:c};k.Ha=function(){return new hd(this.f,this.s)};k.wa=function(){return this.s+1<this.f.length?new Fc(this.f,this.s+1):null};k.Z=function(){var a=this.f.length-this.s;return 0>a?0:a};
k.Zb=function(){var a=cb(this);return 0<a?new dd(this,a-1,null):null};k.S=function(){return Oc(this)};k.D=function(a,b){return Tc.a?Tc.a(this,b):Tc.call(null,this,b)};k.ca=function(){return Hc};k.ea=function(a,b){return bd(this.f,b,this.f[this.s],this.s+1)};k.fa=function(a,b,c){return bd(this.f,b,c,this.s)};k.ta=function(){return this.f[this.s]};k.xa=function(){return this.s+1<this.f.length?new Fc(this.f,this.s+1):Hc};k.U=function(){return this.s<this.f.length?this:null};
k.X=function(a,b){return M.a?M.a(b,this):M.call(null,b,this)};Fc.prototype[Ya]=function(){return Kc(this)};var Ec=function Ec(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ec.b(arguments[0]);case 2:return Ec.a(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};Ec.b=function(a){return Ec.a(a,0)};Ec.a=function(a,b){return b<a.length?new Fc(a,b):null};Ec.w=2;
var G=function G(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return G.b(arguments[0]);case 2:return G.a(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};G.b=function(a){return Ec.a(a,0)};G.a=function(a,b){return Ec.a(a,b)};G.w=2;Uc;id;function dd(a,b,c){this.Xb=a;this.s=b;this.v=c;this.g=32374990;this.C=8192}k=dd.prototype;k.toString=function(){return nc(this)};
k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};k.wa=function(){return 0<this.s?new dd(this.Xb,this.s-1,null):null};k.Z=function(){return this.s+1};k.S=function(){return Oc(this)};k.D=function(a,b){return Tc.a?Tc.a(this,b):Tc.call(null,this,b)};k.ca=function(){var a=Hc,b=this.v;return Uc.a?Uc.a(a,b):Uc.call(null,a,b)};k.ea=function(a,b){return id.a?id.a(b,this):id.call(null,b,this)};k.fa=function(a,b,c){return id.c?id.c(b,c,this):id.call(null,b,c,this)};
k.ta=function(){return hb.a(this.Xb,this.s)};k.xa=function(){return 0<this.s?new dd(this.Xb,this.s-1,null):Hc};k.U=function(){return this};k.R=function(a,b){return new dd(this.Xb,this.s,b)};k.X=function(a,b){return M.a?M.a(b,this):M.call(null,b,this)};dd.prototype[Ya]=function(){return Kc(this)};function jd(a){return I(J(a))}function kd(a){for(;;){var b=J(a);if(null!=b)a=b;else return I(a)}}Lb._=function(a,b){return a===b};
var ld=function ld(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return ld.m();case 1:return ld.b(arguments[0]);case 2:return ld.a(arguments[0],arguments[1]);default:return ld.h(arguments[0],arguments[1],new Fc(c.slice(2),0))}};ld.m=function(){return md};ld.b=function(a){return a};ld.a=function(a,b){return null!=a?fb(a,b):fb(Hc,b)};ld.h=function(a,b,c){for(;;)if(w(c))a=ld.a(a,b),b=I(c),c=J(c);else return ld.a(a,b)};
ld.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return ld.h(b,a,c)};ld.w=2;function N(a){if(null!=a)if(null!=a&&(a.g&2||a.Nc))a=a.Z(null);else if(Sa(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.g&8388608||a.Xc))a:{a=H(a);for(var b=0;;){if(fd(a)){a=b+cb(a);break a}a=J(a);b+=1}}else a=cb(a);else a=0;return a}function nd(a,b){for(var c=null;;){if(null==a)return c;if(0===b)return H(a)?I(a):c;if(gd(a))return hb.c(a,b,c);if(H(a)){var d=J(a),e=b-1;a=d;b=e}else return c}}
function od(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.g&16||a.sc))return a.ba(null,b);if(Sa(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.g&64||a.F)){var c;a:{c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(H(c)){c=I(c);break a}throw Error("Index out of bounds");}if(gd(c)){c=hb.a(c,d);break a}if(H(c))c=J(c),--d;else throw Error("Index out of bounds");
}}return c}if(Ua(gb,a))return hb.a(a,b);throw Error([A("nth not supported on this type "),A(Xa(null==a?null:a.constructor))].join(""));}
function P(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return null;if(null!=a&&(a.g&16||a.sc))return a.Ea(null,b,null);if(Sa(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.g&64||a.F))return nd(a,b);if(Ua(gb,a))return hb.a(a,b);throw Error([A("nth not supported on this type "),A(Xa(null==a?null:a.constructor))].join(""));}
var C=function C(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return C.a(arguments[0],arguments[1]);case 3:return C.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};C.a=function(a,b){return null==a?null:null!=a&&(a.g&256||a.tc)?a.N(null,b):Sa(a)?b<a.length?a[b|0]:null:"string"===typeof a?b<a.length?a[b|0]:null:Ua(ob,a)?pb.a(a,b):null};
C.c=function(a,b,c){return null!=a?null!=a&&(a.g&256||a.tc)?a.I(null,b,c):Sa(a)?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:Ua(ob,a)?pb.c(a,b,c):c:c};C.w=3;pd;var Q=function Q(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Q.c(arguments[0],arguments[1],arguments[2]);default:return Q.h(arguments[0],arguments[1],arguments[2],new Fc(c.slice(3),0))}};Q.c=function(a,b,c){return null!=a?sb(a,b,c):qd([b],[c])};
Q.h=function(a,b,c,d){for(;;)if(a=Q.c(a,b,c),w(d))b=I(d),c=jd(d),d=J(J(d));else return a};Q.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),d=J(d);return Q.h(b,a,c,d)};Q.w=3;var rd=function rd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return rd.b(arguments[0]);case 2:return rd.a(arguments[0],arguments[1]);default:return rd.h(arguments[0],arguments[1],new Fc(c.slice(2),0))}};rd.b=function(a){return a};
rd.a=function(a,b){return null==a?null:ub(a,b)};rd.h=function(a,b,c){for(;;){if(null==a)return null;a=rd.a(a,b);if(w(c))b=I(c),c=J(c);else return a}};rd.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return rd.h(b,a,c)};rd.w=2;function sd(a,b){this.i=a;this.v=b;this.g=393217;this.C=0}k=sd.prototype;k.P=function(){return this.v};k.R=function(a,b){return new sd(this.i,b)};k.Mc=!0;
k.call=function(){function a(a,b,c,d,e,f,g,l,h,m,n,p,q,r,u,y,z,D,E,L,O,F){a=this;return B.rb?B.rb(a.i,b,c,d,e,f,g,l,h,m,n,p,q,r,u,y,z,D,E,L,O,F):B.call(null,a.i,b,c,d,e,f,g,l,h,m,n,p,q,r,u,y,z,D,E,L,O,F)}function b(a,b,c,d,e,f,g,l,h,m,n,p,q,r,u,y,z,D,E,L,O){a=this;return a.i.qa?a.i.qa(b,c,d,e,f,g,l,h,m,n,p,q,r,u,y,z,D,E,L,O):a.i.call(null,b,c,d,e,f,g,l,h,m,n,p,q,r,u,y,z,D,E,L,O)}function c(a,b,c,d,e,f,g,l,h,m,n,p,q,r,u,y,z,D,E,L){a=this;return a.i.pa?a.i.pa(b,c,d,e,f,g,l,h,m,n,p,q,r,u,y,z,D,E,L):
a.i.call(null,b,c,d,e,f,g,l,h,m,n,p,q,r,u,y,z,D,E,L)}function d(a,b,c,d,e,f,g,l,h,m,n,p,q,r,u,y,z,D,E){a=this;return a.i.oa?a.i.oa(b,c,d,e,f,g,l,h,m,n,p,q,r,u,y,z,D,E):a.i.call(null,b,c,d,e,f,g,l,h,m,n,p,q,r,u,y,z,D,E)}function e(a,b,c,d,e,f,g,l,h,m,n,p,q,r,u,y,z,D){a=this;return a.i.na?a.i.na(b,c,d,e,f,g,l,h,m,n,p,q,r,u,y,z,D):a.i.call(null,b,c,d,e,f,g,l,h,m,n,p,q,r,u,y,z,D)}function f(a,b,c,d,e,f,g,l,h,m,n,p,q,r,u,y,z){a=this;return a.i.ma?a.i.ma(b,c,d,e,f,g,l,h,m,n,p,q,r,u,y,z):a.i.call(null,b,
c,d,e,f,g,l,h,m,n,p,q,r,u,y,z)}function g(a,b,c,d,e,f,g,l,h,m,n,p,q,r,u,y){a=this;return a.i.la?a.i.la(b,c,d,e,f,g,l,h,m,n,p,q,r,u,y):a.i.call(null,b,c,d,e,f,g,l,h,m,n,p,q,r,u,y)}function h(a,b,c,d,e,f,g,l,h,m,n,p,q,r,u){a=this;return a.i.ka?a.i.ka(b,c,d,e,f,g,l,h,m,n,p,q,r,u):a.i.call(null,b,c,d,e,f,g,l,h,m,n,p,q,r,u)}function l(a,b,c,d,e,f,g,l,h,m,n,p,q,r){a=this;return a.i.ja?a.i.ja(b,c,d,e,f,g,l,h,m,n,p,q,r):a.i.call(null,b,c,d,e,f,g,l,h,m,n,p,q,r)}function m(a,b,c,d,e,f,g,l,h,m,n,p,q){a=this;
return a.i.ia?a.i.ia(b,c,d,e,f,g,l,h,m,n,p,q):a.i.call(null,b,c,d,e,f,g,l,h,m,n,p,q)}function n(a,b,c,d,e,f,g,l,h,m,n,p){a=this;return a.i.ha?a.i.ha(b,c,d,e,f,g,l,h,m,n,p):a.i.call(null,b,c,d,e,f,g,l,h,m,n,p)}function p(a,b,c,d,e,f,g,l,h,m,n){a=this;return a.i.ga?a.i.ga(b,c,d,e,f,g,l,h,m,n):a.i.call(null,b,c,d,e,f,g,l,h,m,n)}function q(a,b,c,d,e,f,g,l,h,m){a=this;return a.i.sa?a.i.sa(b,c,d,e,f,g,l,h,m):a.i.call(null,b,c,d,e,f,g,l,h,m)}function r(a,b,c,d,e,f,g,l,h){a=this;return a.i.ra?a.i.ra(b,c,
d,e,f,g,l,h):a.i.call(null,b,c,d,e,f,g,l,h)}function u(a,b,c,d,e,f,g,l){a=this;return a.i.aa?a.i.aa(b,c,d,e,f,g,l):a.i.call(null,b,c,d,e,f,g,l)}function y(a,b,c,d,e,f,g){a=this;return a.i.T?a.i.T(b,c,d,e,f,g):a.i.call(null,b,c,d,e,f,g)}function z(a,b,c,d,e,f){a=this;return a.i.A?a.i.A(b,c,d,e,f):a.i.call(null,b,c,d,e,f)}function D(a,b,c,d,e){a=this;return a.i.l?a.i.l(b,c,d,e):a.i.call(null,b,c,d,e)}function E(a,b,c,d){a=this;return a.i.c?a.i.c(b,c,d):a.i.call(null,b,c,d)}function L(a,b,c){a=this;
return a.i.a?a.i.a(b,c):a.i.call(null,b,c)}function O(a,b){a=this;return a.i.b?a.i.b(b):a.i.call(null,b)}function Aa(a){a=this;return a.i.m?a.i.m():a.i.call(null)}var F=null,F=function(ka,na,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa,F,Wa,ib,jb,Bb,Jc,Bd,of){switch(arguments.length){case 1:return Aa.call(this,ka);case 2:return O.call(this,ka,na);case 3:return L.call(this,ka,na,U);case 4:return E.call(this,ka,na,U,X);case 5:return D.call(this,ka,na,U,X,ha);case 6:return z.call(this,ka,na,U,X,ha,ia);case 7:return y.call(this,
ka,na,U,X,ha,ia,ja);case 8:return u.call(this,ka,na,U,X,ha,ia,ja,la);case 9:return r.call(this,ka,na,U,X,ha,ia,ja,la,oa);case 10:return q.call(this,ka,na,U,X,ha,ia,ja,la,oa,ua);case 11:return p.call(this,ka,na,U,X,ha,ia,ja,la,oa,ua,ya);case 12:return n.call(this,ka,na,U,X,ha,ia,ja,la,oa,ua,ya,Ca);case 13:return m.call(this,ka,na,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da);case 14:return l.call(this,ka,na,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa);case 15:return h.call(this,ka,na,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa,F);
case 16:return g.call(this,ka,na,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa,F,Wa);case 17:return f.call(this,ka,na,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa,F,Wa,ib);case 18:return e.call(this,ka,na,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa,F,Wa,ib,jb);case 19:return d.call(this,ka,na,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa,F,Wa,ib,jb,Bb);case 20:return c.call(this,ka,na,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa,F,Wa,ib,jb,Bb,Jc);case 21:return b.call(this,ka,na,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa,F,Wa,ib,jb,Bb,Jc,Bd);case 22:return a.call(this,
ka,na,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa,F,Wa,ib,jb,Bb,Jc,Bd,of)}throw Error("Invalid arity: "+arguments.length);};F.b=Aa;F.a=O;F.c=L;F.l=E;F.A=D;F.T=z;F.aa=y;F.ra=u;F.sa=r;F.ga=q;F.ha=p;F.ia=n;F.ja=m;F.ka=l;F.la=h;F.ma=g;F.na=f;F.oa=e;F.pa=d;F.qa=c;F.Gb=b;F.rb=a;return F}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.m=function(){return this.i.m?this.i.m():this.i.call(null)};k.b=function(a){return this.i.b?this.i.b(a):this.i.call(null,a)};
k.a=function(a,b){return this.i.a?this.i.a(a,b):this.i.call(null,a,b)};k.c=function(a,b,c){return this.i.c?this.i.c(a,b,c):this.i.call(null,a,b,c)};k.l=function(a,b,c,d){return this.i.l?this.i.l(a,b,c,d):this.i.call(null,a,b,c,d)};k.A=function(a,b,c,d,e){return this.i.A?this.i.A(a,b,c,d,e):this.i.call(null,a,b,c,d,e)};k.T=function(a,b,c,d,e,f){return this.i.T?this.i.T(a,b,c,d,e,f):this.i.call(null,a,b,c,d,e,f)};
k.aa=function(a,b,c,d,e,f,g){return this.i.aa?this.i.aa(a,b,c,d,e,f,g):this.i.call(null,a,b,c,d,e,f,g)};k.ra=function(a,b,c,d,e,f,g,h){return this.i.ra?this.i.ra(a,b,c,d,e,f,g,h):this.i.call(null,a,b,c,d,e,f,g,h)};k.sa=function(a,b,c,d,e,f,g,h,l){return this.i.sa?this.i.sa(a,b,c,d,e,f,g,h,l):this.i.call(null,a,b,c,d,e,f,g,h,l)};k.ga=function(a,b,c,d,e,f,g,h,l,m){return this.i.ga?this.i.ga(a,b,c,d,e,f,g,h,l,m):this.i.call(null,a,b,c,d,e,f,g,h,l,m)};
k.ha=function(a,b,c,d,e,f,g,h,l,m,n){return this.i.ha?this.i.ha(a,b,c,d,e,f,g,h,l,m,n):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n)};k.ia=function(a,b,c,d,e,f,g,h,l,m,n,p){return this.i.ia?this.i.ia(a,b,c,d,e,f,g,h,l,m,n,p):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p)};k.ja=function(a,b,c,d,e,f,g,h,l,m,n,p,q){return this.i.ja?this.i.ja(a,b,c,d,e,f,g,h,l,m,n,p,q):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q)};
k.ka=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){return this.i.ka?this.i.ka(a,b,c,d,e,f,g,h,l,m,n,p,q,r):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r)};k.la=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u){return this.i.la?this.i.la(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u)};k.ma=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y){return this.i.ma?this.i.ma(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y)};
k.na=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z){return this.i.na?this.i.na(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z)};k.oa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D){return this.i.oa?this.i.oa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D)};
k.pa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E){return this.i.pa?this.i.pa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E)};k.qa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E,L){return this.i.qa?this.i.qa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E,L):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E,L)};
k.Gb=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E,L,O){return B.rb?B.rb(this.i,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E,L,O):B.call(null,this.i,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E,L,O)};function Uc(a,b){return ca(a)?new sd(a,b):null==a?null:Gb(a,b)}function td(a){var b=null!=a;return(b?null!=a?a.g&131072||a.Tc||(a.g?0:Ua(Eb,a)):Ua(Eb,a):b)?Fb(a):null}function ud(a){return null==a||Ta(H(a))}function vd(a){return null==a?!1:null!=a?a.g&4096||a.Bd?!0:a.g?!1:Ua(yb,a):Ua(yb,a)}
function wd(a){return null!=a?a.g&16777216||a.Ad?!0:a.g?!1:Ua(Pb,a):Ua(Pb,a)}function xd(a){return null==a?!1:null!=a?a.g&1024||a.Rc?!0:a.g?!1:Ua(tb,a):Ua(tb,a)}function yd(a){return null!=a?a.g&16384||a.Cd?!0:a.g?!1:Ua(Ab,a):Ua(Ab,a)}zd;Ad;function Cd(a){return null!=a?a.C&512||a.vd?!0:!1:!1}function Dd(a){var b=[];ra(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}function Ed(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var Fd={};
function Gd(a){return null==a?!1:null!=a?a.g&64||a.F?!0:a.g?!1:Ua(kb,a):Ua(kb,a)}function Hd(a){return null==a?!1:!1===a?!1:!0}function Id(a,b){return C.c(a,b,Fd)===Fd?!1:!0}function Jd(a,b){var c;if(c=null!=a)c=null!=a?a.g&512||a.ud?!0:a.g?!1:Ua(qb,a):Ua(qb,a);return c&&Id(a,b)?new R(null,2,5,S,[b,C.a(a,b)],null):null}
function wc(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if("number"===typeof a){if("number"===typeof b)return va(a,b);throw Error([A("Cannot compare "),A(a),A(" to "),A(b)].join(""));}if(null!=a?a.C&2048||a.Eb||(a.C?0:Ua(bc,a)):Ua(bc,a))return cc(a,b);if("string"!==typeof a&&!Sa(a)&&!0!==a&&!1!==a||(null==a?null:a.constructor)!==(null==b?null:b.constructor))throw Error([A("Cannot compare "),A(a),A(" to "),A(b)].join(""));return va(a,b)}
function Kd(a,b){var c=N(a),d=N(b);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=wc(od(a,d),od(b,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}function Ld(a){return vc.a(a,wc)?wc:function(b,c){var d=a.a?a.a(b,c):a.call(null,b,c);return"number"===typeof d?d:w(d)?-1:w(a.a?a.a(c,b):a.call(null,c,b))?1:0}}Md;
var id=function id(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return id.a(arguments[0],arguments[1]);case 3:return id.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};id.a=function(a,b){var c=H(b);if(c){var d=I(c),c=J(c);return $a.c?$a.c(a,d,c):$a.call(null,a,d,c)}return a.m?a.m():a.call(null)};
id.c=function(a,b,c){for(c=H(c);;)if(c){var d=I(c);b=a.a?a.a(b,d):a.call(null,b,d);if(Xc(b))return Db(b);c=J(c)}else return b};id.w=3;Nd;var $a=function $a(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return $a.a(arguments[0],arguments[1]);case 3:return $a.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
$a.a=function(a,b){return null!=b&&(b.g&524288||b.Vc)?b.ea(null,a):Sa(b)?$c(b,a):"string"===typeof b?$c(b,a):Ua(Hb,b)?Ib.a(b,a):id.a(a,b)};$a.c=function(a,b,c){return null!=c&&(c.g&524288||c.Vc)?c.fa(null,a,b):Sa(c)?ad(c,a,b):"string"===typeof c?ad(c,a,b):Ua(Hb,c)?Ib.c(c,a,b):id.c(a,b,c)};$a.w=3;function Od(a){return a}function Pd(a,b,c,d){a=a.b?a.b(b):a.call(null,b);c=$a.c(a,c,d);return a.b?a.b(c):a.call(null,c)}
var Qd=function Qd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Qd.m();case 1:return Qd.b(arguments[0]);case 2:return Qd.a(arguments[0],arguments[1]);default:return Qd.h(arguments[0],arguments[1],new Fc(c.slice(2),0))}};Qd.m=function(){return 0};Qd.b=function(a){return a};Qd.a=function(a,b){return a+b};Qd.h=function(a,b,c){return $a.c(Qd,a+b,c)};Qd.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return Qd.h(b,a,c)};Qd.w=2;
var Rd=function Rd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Rd.b(arguments[0]);case 2:return Rd.a(arguments[0],arguments[1]);default:return Rd.h(arguments[0],arguments[1],new Fc(c.slice(2),0))}};Rd.b=function(a){return-a};Rd.a=function(a,b){return a-b};Rd.h=function(a,b,c){return $a.c(Rd,a-b,c)};Rd.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return Rd.h(b,a,c)};Rd.w=2;
var Sd=function Sd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Sd.m();case 1:return Sd.b(arguments[0]);case 2:return Sd.a(arguments[0],arguments[1]);default:return Sd.h(arguments[0],arguments[1],new Fc(c.slice(2),0))}};Sd.m=function(){return 1};Sd.b=function(a){return a};Sd.a=function(a,b){return a*b};Sd.h=function(a,b,c){return $a.c(Sd,a*b,c)};Sd.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return Sd.h(b,a,c)};Sd.w=2;xa.Id;
var Td=function Td(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Td.b(arguments[0]);case 2:return Td.a(arguments[0],arguments[1]);default:return Td.h(arguments[0],arguments[1],new Fc(c.slice(2),0))}};Td.b=function(a){return 1/a};Td.a=function(a,b){return a/b};Td.h=function(a,b,c){return $a.c(Td,a/b,c)};Td.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return Td.h(b,a,c)};Td.w=2;
var Ud=function Ud(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ud.b(arguments[0]);case 2:return Ud.a(arguments[0],arguments[1]);default:return Ud.h(arguments[0],arguments[1],new Fc(c.slice(2),0))}};Ud.b=function(a){return a};Ud.a=function(a,b){return a>b?a:b};Ud.h=function(a,b,c){return $a.c(Ud,a>b?a:b,c)};Ud.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return Ud.h(b,a,c)};Ud.w=2;
var Vd=function Vd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Vd.b(arguments[0]);case 2:return Vd.a(arguments[0],arguments[1]);default:return Vd.h(arguments[0],arguments[1],new Fc(c.slice(2),0))}};Vd.b=function(a){return a};Vd.a=function(a,b){return a<b?a:b};Vd.h=function(a,b,c){return $a.c(Vd,a<b?a:b,c)};Vd.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return Vd.h(b,a,c)};Vd.w=2;Wd;function Wd(a,b){return(a%b+b)%b}
function Xd(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function Yd(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function Zd(a,b){for(var c=b,d=H(a);;)if(d&&0<c)--c,d=J(d);else return d}var A=function A(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return A.m();case 1:return A.b(arguments[0]);default:return A.h(arguments[0],new Fc(c.slice(1),0))}};A.m=function(){return""};
A.b=function(a){return null==a?"":""+a};A.h=function(a,b){for(var c=new sa(""+A(a)),d=b;;)if(w(d))c=c.append(""+A(I(d))),d=J(d);else return c.toString()};A.B=function(a){var b=I(a);a=J(a);return A.h(b,a)};A.w=1;T;$d;function Tc(a,b){var c;if(wd(b))if(fd(a)&&fd(b)&&N(a)!==N(b))c=!1;else a:{c=H(a);for(var d=H(b);;){if(null==c){c=null==d;break a}if(null!=d&&vc.a(I(c),I(d)))c=J(c),d=J(d);else{c=!1;break a}}}else c=null;return Hd(c)}
function cd(a){if(H(a)){var b=Ac(I(a));for(a=J(a);;){if(null==a)return b;b=Bc(b,Ac(I(a)));a=J(a)}}else return 0}ae;be;function ce(a){var b=0;for(a=H(a);;)if(a){var c=I(a),b=(b+(Ac(ae.b?ae.b(c):ae.call(null,c))^Ac(be.b?be.b(c):be.call(null,c))))%4503599627370496;a=J(a)}else return b}$d;de;ee;function ed(a,b,c,d,e){this.v=a;this.first=b;this.Ca=c;this.count=d;this.u=e;this.g=65937646;this.C=8192}k=ed.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};
k.wa=function(){return 1===this.count?null:this.Ca};k.Z=function(){return this.count};k.eb=function(){return this.first};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Oc(this)};k.D=function(a,b){return Tc(this,b)};k.ca=function(){return Gb(Hc,this.v)};k.ea=function(a,b){return id.a(b,this)};k.fa=function(a,b,c){return id.c(b,c,this)};k.ta=function(){return this.first};k.xa=function(){return 1===this.count?Hc:this.Ca};k.U=function(){return this};
k.R=function(a,b){return new ed(b,this.first,this.Ca,this.count,this.u)};k.X=function(a,b){return new ed(this.v,b,this,this.count+1,null)};function fe(a){return null!=a?a.g&33554432||a.yd?!0:a.g?!1:Ua(Qb,a):Ua(Qb,a)}ed.prototype[Ya]=function(){return Kc(this)};function ge(a){this.v=a;this.g=65937614;this.C=8192}k=ge.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};k.wa=function(){return null};k.Z=function(){return 0};k.eb=function(){return null};
k.S=function(){return Pc};k.D=function(a,b){return fe(b)||wd(b)?null==H(b):!1};k.ca=function(){return this};k.ea=function(a,b){return id.a(b,this)};k.fa=function(a,b,c){return id.c(b,c,this)};k.ta=function(){return null};k.xa=function(){return Hc};k.U=function(){return null};k.R=function(a,b){return new ge(b)};k.X=function(a,b){return new ed(this.v,b,null,1,null)};var Hc=new ge(null);ge.prototype[Ya]=function(){return Kc(this)};
function he(a){return(null!=a?a.g&134217728||a.zd||(a.g?0:Ua(Rb,a)):Ua(Rb,a))?Sb(a):$a.c(ld,Hc,a)}var tc=function tc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return tc.h(0<c.length?new Fc(c.slice(0),0):null)};tc.h=function(a){var b;if(a instanceof Fc&&0===a.s)b=a.f;else a:for(b=[];;)if(null!=a)b.push(a.ta(null)),a=a.wa(null);else break a;a=b.length;for(var c=Hc;;)if(0<a){var d=a-1,c=c.X(null,b[a-1]);a=d}else return c};tc.w=0;tc.B=function(a){return tc.h(H(a))};
function ie(a,b,c,d){this.v=a;this.first=b;this.Ca=c;this.u=d;this.g=65929452;this.C=8192}k=ie.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};k.wa=function(){return null==this.Ca?null:H(this.Ca)};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Oc(this)};k.D=function(a,b){return Tc(this,b)};k.ca=function(){return Uc(Hc,this.v)};k.ea=function(a,b){return id.a(b,this)};k.fa=function(a,b,c){return id.c(b,c,this)};k.ta=function(){return this.first};
k.xa=function(){return null==this.Ca?Hc:this.Ca};k.U=function(){return this};k.R=function(a,b){return new ie(b,this.first,this.Ca,this.u)};k.X=function(a,b){return new ie(null,b,this,this.u)};ie.prototype[Ya]=function(){return Kc(this)};function M(a,b){var c=null==b;return(c?c:null!=b&&(b.g&64||b.F))?new ie(null,a,b,null):new ie(null,a,H(b),null)}
function je(a,b){if(a.Ia===b.Ia)return 0;var c=Ta(a.Ba);if(w(c?b.Ba:c))return-1;if(w(a.Ba)){if(Ta(b.Ba))return 1;c=va(a.Ba,b.Ba);return 0===c?va(a.name,b.name):c}return va(a.name,b.name)}function x(a,b,c,d){this.Ba=a;this.name=b;this.Ia=c;this.ob=d;this.g=2153775105;this.C=4096}k=x.prototype;k.toString=function(){return[A(":"),A(this.Ia)].join("")};k.equiv=function(a){return this.D(null,a)};k.D=function(a,b){return b instanceof x?this.Ia===b.Ia:!1};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return C.a(c,this);case 3:return C.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return C.a(c,this)};a.c=function(a,c,d){return C.c(c,this,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return C.a(a,this)};k.a=function(a,b){return C.c(a,this,b)};
k.S=function(){var a=this.ob;return null!=a?a:this.ob=a=Bc(sc(this.name),zc(this.Ba))+2654435769|0};k.Kb=function(){return this.name};k.Lb=function(){return this.Ba};k.L=function(a,b){return Tb(b,[A(":"),A(this.Ia)].join(""))};function ke(a,b){return a===b?!0:a instanceof x&&b instanceof x?a.Ia===b.Ia:!1}
var le=function le(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return le.b(arguments[0]);case 2:return le.a(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
le.b=function(a){if(a instanceof x)return a;if(a instanceof uc){var b;if(null!=a&&(a.C&4096||a.Uc))b=a.Lb(null);else throw Error([A("Doesn't support namespace: "),A(a)].join(""));return new x(b,$d.b?$d.b(a):$d.call(null,a),a.Va,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new x(b[0],b[1],a,null):new x(null,b[0],a,null)):null};le.a=function(a,b){return new x(a,b,[A(w(a)?[A(a),A("/")].join(""):null),A(b)].join(""),null)};le.w=2;
function me(a,b,c,d){this.v=a;this.yb=b;this.H=c;this.u=d;this.g=32374988;this.C=0}k=me.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};function ne(a){null!=a.yb&&(a.H=a.yb.m?a.yb.m():a.yb.call(null),a.yb=null);return a.H}k.P=function(){return this.v};k.wa=function(){Ob(this);return null==this.H?null:J(this.H)};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Oc(this)};k.D=function(a,b){return Tc(this,b)};k.ca=function(){return Uc(Hc,this.v)};
k.ea=function(a,b){return id.a(b,this)};k.fa=function(a,b,c){return id.c(b,c,this)};k.ta=function(){Ob(this);return null==this.H?null:I(this.H)};k.xa=function(){Ob(this);return null!=this.H?Gc(this.H):Hc};k.U=function(){ne(this);if(null==this.H)return null;for(var a=this.H;;)if(a instanceof me)a=ne(a);else return this.H=a,H(this.H)};k.R=function(a,b){return new me(b,this.yb,this.H,this.u)};k.X=function(a,b){return M(b,this)};me.prototype[Ya]=function(){return Kc(this)};oe;
function pe(a,b){this.K=a;this.end=b;this.g=2;this.C=0}pe.prototype.add=function(a){this.K[this.end]=a;return this.end+=1};pe.prototype.W=function(){var a=new oe(this.K,0,this.end);this.K=null;return a};pe.prototype.Z=function(){return this.end};function qe(a){return new pe(Array(a),0)}function oe(a,b,c){this.f=a;this.ua=b;this.end=c;this.g=524306;this.C=0}k=oe.prototype;k.Z=function(){return this.end-this.ua};k.ba=function(a,b){return this.f[this.ua+b]};
k.Ea=function(a,b,c){return 0<=b&&b<this.end-this.ua?this.f[this.ua+b]:c};k.rc=function(){if(this.ua===this.end)throw Error("-drop-first of empty chunk");return new oe(this.f,this.ua+1,this.end)};k.ea=function(a,b){return bd(this.f,b,this.f[this.ua],this.ua+1)};k.fa=function(a,b,c){return bd(this.f,b,c,this.ua)};function zd(a,b,c,d){this.W=a;this.Sa=b;this.v=c;this.u=d;this.g=31850732;this.C=1536}k=zd.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};
k.P=function(){return this.v};k.wa=function(){if(1<cb(this.W))return new zd(dc(this.W),this.Sa,this.v,null);var a=Ob(this.Sa);return null==a?null:a};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Oc(this)};k.D=function(a,b){return Tc(this,b)};k.ca=function(){return Uc(Hc,this.v)};k.ta=function(){return hb.a(this.W,0)};k.xa=function(){return 1<cb(this.W)?new zd(dc(this.W),this.Sa,this.v,null):null==this.Sa?Hc:this.Sa};k.U=function(){return this};k.jc=function(){return this.W};
k.kc=function(){return null==this.Sa?Hc:this.Sa};k.R=function(a,b){return new zd(this.W,this.Sa,b,this.u)};k.X=function(a,b){return M(b,this)};k.ic=function(){return null==this.Sa?null:this.Sa};zd.prototype[Ya]=function(){return Kc(this)};function re(a,b){return 0===cb(a)?b:new zd(a,b,null,null)}function se(a,b){a.add(b)}function de(a){return ec(a)}function ee(a){return fc(a)}function Md(a){for(var b=[];;)if(H(a))b.push(I(a)),a=J(a);else return b}
function te(a){if("number"===typeof a)a:{var b=Array(a);if(Gd(null))for(var c=0,d=H(null);;)if(d&&c<a)b[c]=I(d),c+=1,d=J(d);else{a=b;break a}else{for(c=0;;)if(c<a)b[c]=null,c+=1;else break;a=b}}else a=Oa.b(a);return a}function ue(a,b){if(fd(a))return N(a);for(var c=a,d=b,e=0;;)if(0<d&&H(c))c=J(c),--d,e+=1;else return e}
var ve=function ve(b){return null==b?null:null==J(b)?H(I(b)):M(I(b),ve(J(b)))},we=function we(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return we.m();case 1:return we.b(arguments[0]);case 2:return we.a(arguments[0],arguments[1]);default:return we.h(arguments[0],arguments[1],new Fc(c.slice(2),0))}};we.m=function(){return new me(null,function(){return null},null,null)};we.b=function(a){return new me(null,function(){return a},null,null)};
we.a=function(a,b){return new me(null,function(){var c=H(a);return c?Cd(c)?re(ec(c),we.a(fc(c),b)):M(I(c),we.a(Gc(c),b)):b},null,null)};we.h=function(a,b,c){return function e(a,b){return new me(null,function(){var c=H(a);return c?Cd(c)?re(ec(c),e(fc(c),b)):M(I(c),e(Gc(c),b)):w(b)?e(I(b),J(b)):null},null,null)}(we.a(a,b),c)};we.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return we.h(b,a,c)};we.w=2;function xe(a){return Zb(a)}
var ye=function ye(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return ye.m();case 1:return ye.b(arguments[0]);case 2:return ye.a(arguments[0],arguments[1]);default:return ye.h(arguments[0],arguments[1],new Fc(c.slice(2),0))}};ye.m=function(){return Xb(md)};ye.b=function(a){return a};ye.a=function(a,b){return Yb(a,b)};ye.h=function(a,b,c){for(;;)if(a=Yb(a,b),w(c))b=I(c),c=J(c);else return a};
ye.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return ye.h(b,a,c)};ye.w=2;function ze(a,b,c){return $b(a,b,c)}
function Ae(a,b,c){var d=H(c);if(0===b)return a.m?a.m():a.call(null);c=lb(d);var e=mb(d);if(1===b)return a.b?a.b(c):a.b?a.b(c):a.call(null,c);var d=lb(e),f=mb(e);if(2===b)return a.a?a.a(c,d):a.a?a.a(c,d):a.call(null,c,d);var e=lb(f),g=mb(f);if(3===b)return a.c?a.c(c,d,e):a.c?a.c(c,d,e):a.call(null,c,d,e);var f=lb(g),h=mb(g);if(4===b)return a.l?a.l(c,d,e,f):a.l?a.l(c,d,e,f):a.call(null,c,d,e,f);var g=lb(h),l=mb(h);if(5===b)return a.A?a.A(c,d,e,f,g):a.A?a.A(c,d,e,f,g):a.call(null,c,d,e,f,g);var h=lb(l),
m=mb(l);if(6===b)return a.T?a.T(c,d,e,f,g,h):a.T?a.T(c,d,e,f,g,h):a.call(null,c,d,e,f,g,h);var l=lb(m),n=mb(m);if(7===b)return a.aa?a.aa(c,d,e,f,g,h,l):a.aa?a.aa(c,d,e,f,g,h,l):a.call(null,c,d,e,f,g,h,l);var m=lb(n),p=mb(n);if(8===b)return a.ra?a.ra(c,d,e,f,g,h,l,m):a.ra?a.ra(c,d,e,f,g,h,l,m):a.call(null,c,d,e,f,g,h,l,m);var n=lb(p),q=mb(p);if(9===b)return a.sa?a.sa(c,d,e,f,g,h,l,m,n):a.sa?a.sa(c,d,e,f,g,h,l,m,n):a.call(null,c,d,e,f,g,h,l,m,n);var p=lb(q),r=mb(q);if(10===b)return a.ga?a.ga(c,d,e,
f,g,h,l,m,n,p):a.ga?a.ga(c,d,e,f,g,h,l,m,n,p):a.call(null,c,d,e,f,g,h,l,m,n,p);var q=lb(r),u=mb(r);if(11===b)return a.ha?a.ha(c,d,e,f,g,h,l,m,n,p,q):a.ha?a.ha(c,d,e,f,g,h,l,m,n,p,q):a.call(null,c,d,e,f,g,h,l,m,n,p,q);var r=lb(u),y=mb(u);if(12===b)return a.ia?a.ia(c,d,e,f,g,h,l,m,n,p,q,r):a.ia?a.ia(c,d,e,f,g,h,l,m,n,p,q,r):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r);var u=lb(y),z=mb(y);if(13===b)return a.ja?a.ja(c,d,e,f,g,h,l,m,n,p,q,r,u):a.ja?a.ja(c,d,e,f,g,h,l,m,n,p,q,r,u):a.call(null,c,d,e,f,g,h,l,m,n,
p,q,r,u);var y=lb(z),D=mb(z);if(14===b)return a.ka?a.ka(c,d,e,f,g,h,l,m,n,p,q,r,u,y):a.ka?a.ka(c,d,e,f,g,h,l,m,n,p,q,r,u,y):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,u,y);var z=lb(D),E=mb(D);if(15===b)return a.la?a.la(c,d,e,f,g,h,l,m,n,p,q,r,u,y,z):a.la?a.la(c,d,e,f,g,h,l,m,n,p,q,r,u,y,z):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z);var D=lb(E),L=mb(E);if(16===b)return a.ma?a.ma(c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D):a.ma?a.ma(c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D);var E=
lb(L),O=mb(L);if(17===b)return a.na?a.na(c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E):a.na?a.na(c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E);var L=lb(O),Aa=mb(O);if(18===b)return a.oa?a.oa(c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E,L):a.oa?a.oa(c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E,L):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E,L);O=lb(Aa);Aa=mb(Aa);if(19===b)return a.pa?a.pa(c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E,L,O):a.pa?a.pa(c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E,L,O):a.call(null,c,d,e,
f,g,h,l,m,n,p,q,r,u,y,z,D,E,L,O);var F=lb(Aa);mb(Aa);if(20===b)return a.qa?a.qa(c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E,L,O,F):a.qa?a.qa(c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E,L,O,F):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E,L,O,F);throw Error("Only up to 20 arguments supported on functions");}
var B=function B(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return B.a(arguments[0],arguments[1]);case 3:return B.c(arguments[0],arguments[1],arguments[2]);case 4:return B.l(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return B.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return B.h(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new Fc(c.slice(5),0))}};
B.a=function(a,b){var c=a.w;if(a.B){var d=ue(b,c+1);return d<=c?Ae(a,d,b):a.B(b)}return a.apply(a,Md(b))};B.c=function(a,b,c){b=M(b,c);c=a.w;if(a.B){var d=ue(b,c+1);return d<=c?Ae(a,d,b):a.B(b)}return a.apply(a,Md(b))};B.l=function(a,b,c,d){b=M(b,M(c,d));c=a.w;return a.B?(d=ue(b,c+1),d<=c?Ae(a,d,b):a.B(b)):a.apply(a,Md(b))};B.A=function(a,b,c,d,e){b=M(b,M(c,M(d,e)));c=a.w;return a.B?(d=ue(b,c+1),d<=c?Ae(a,d,b):a.B(b)):a.apply(a,Md(b))};
B.h=function(a,b,c,d,e,f){b=M(b,M(c,M(d,M(e,ve(f)))));c=a.w;return a.B?(d=ue(b,c+1),d<=c?Ae(a,d,b):a.B(b)):a.apply(a,Md(b))};B.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),e=J(d),d=I(e),f=J(e),e=I(f),f=J(f);return B.h(b,a,c,d,e,f)};B.w=5;function Be(a){return H(a)?a:null}
var Ce=function Ce(){"undefined"===typeof za&&(za=function(b,c){this.md=b;this.ld=c;this.g=393216;this.C=0},za.prototype.R=function(b,c){return new za(this.md,c)},za.prototype.P=function(){return this.ld},za.prototype.ya=function(){return!1},za.prototype.next=function(){return Error("No such element")},za.prototype.remove=function(){return Error("Unsupported operation")},za.ec=function(){return new R(null,2,5,S,[Uc(De,new v(null,1,[Ee,tc(Fe,tc(md))],null)),xa.Hd],null)},za.tb=!0,za.Za="cljs.core/t_cljs$core23150",
za.Pb=function(b,c){return Tb(c,"cljs.core/t_cljs$core23150")});return new za(Ce,V)};Ge;function Ge(a,b,c,d){this.Bb=a;this.first=b;this.Ca=c;this.v=d;this.g=31719628;this.C=0}k=Ge.prototype;k.R=function(a,b){return new Ge(this.Bb,this.first,this.Ca,b)};k.X=function(a,b){return M(b,Ob(this))};k.ca=function(){return Hc};k.D=function(a,b){return null!=Ob(this)?Tc(this,b):wd(b)&&null==H(b)};k.S=function(){return Oc(this)};k.U=function(){null!=this.Bb&&this.Bb.step(this);return null==this.Ca?null:this};
k.ta=function(){null!=this.Bb&&Ob(this);return null==this.Ca?null:this.first};k.xa=function(){null!=this.Bb&&Ob(this);return null==this.Ca?Hc:this.Ca};k.wa=function(){null!=this.Bb&&Ob(this);return null==this.Ca?null:Ob(this.Ca)};Ge.prototype[Ya]=function(){return Kc(this)};function He(a,b){for(;;){if(null==H(b))return!0;var c;c=I(b);c=a.b?a.b(c):a.call(null,c);if(w(c)){c=a;var d=J(b);a=c;b=d}else return!1}}
function Ie(a,b){for(;;)if(H(b)){var c;c=I(b);c=a.b?a.b(c):a.call(null,c);if(w(c))return c;c=a;var d=J(b);a=c;b=d}else return null}
function Je(a){return function(){function b(b,c){return Ta(a.a?a.a(b,c):a.call(null,b,c))}function c(b){return Ta(a.b?a.b(b):a.call(null,b))}function d(){return Ta(a.m?a.m():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new Fc(g,0)}return c.call(this,a,d,f)}function c(b,d,e){return Ta(B.l(a,b,d,e))}b.w=2;b.B=function(a){var b=I(a);a=J(a);var d=I(a);a=Gc(a);return c(b,d,a)};b.h=
c;return b}(),e=function(a,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var m=null;if(2<arguments.length){for(var m=0,n=Array(arguments.length-2);m<n.length;)n[m]=arguments[m+2],++m;m=new Fc(n,0)}return f.h(a,e,m)}throw Error("Invalid arity: "+arguments.length);};e.w=2;e.B=f.B;e.m=d;e.b=c;e.a=b;e.h=f.h;return e}()}
function Ke(a){return function(){function b(b){if(0<arguments.length)for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;return a}b.w=0;b.B=function(b){H(b);return a};b.h=function(){return a};return b}()}
var Le=function Le(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Le.m();case 1:return Le.b(arguments[0]);case 2:return Le.a(arguments[0],arguments[1]);case 3:return Le.c(arguments[0],arguments[1],arguments[2]);default:return Le.h(arguments[0],arguments[1],arguments[2],new Fc(c.slice(3),0))}};Le.m=function(){return Od};Le.b=function(a){return a};
Le.a=function(a,b){return function(){function c(c,d,e){c=b.c?b.c(c,d,e):b.call(null,c,d,e);return a.b?a.b(c):a.call(null,c)}function d(c,d){var e=b.a?b.a(c,d):b.call(null,c,d);return a.b?a.b(e):a.call(null,e)}function e(c){c=b.b?b.b(c):b.call(null,c);return a.b?a.b(c):a.call(null,c)}function f(){var c=b.m?b.m():b.call(null);return a.b?a.b(c):a.call(null,c)}var g=null,h=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,l=Array(arguments.length-3);g<l.length;)l[g]=arguments[g+
3],++g;g=new Fc(l,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){c=B.A(b,c,e,f,g);return a.b?a.b(c):a.call(null,c)}c.w=3;c.B=function(a){var b=I(a);a=J(a);var c=I(a);a=J(a);var e=I(a);a=Gc(a);return d(b,c,e,a)};c.h=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+
3],++q;q=new Fc(r,0)}return h.h(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.B=h.B;g.m=f;g.b=e;g.a=d;g.c=c;g.h=h.h;return g}()};
Le.c=function(a,b,c){return function(){function d(d,e,f){d=c.c?c.c(d,e,f):c.call(null,d,e,f);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}function e(d,e){var f;f=c.a?c.a(d,e):c.call(null,d,e);f=b.b?b.b(f):b.call(null,f);return a.b?a.b(f):a.call(null,f)}function f(d){d=c.b?c.b(d):c.call(null,d);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}function g(){var d;d=c.m?c.m():c.call(null);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}var h=null,l=function(){function d(a,
b,c,f){var g=null;if(3<arguments.length){for(var g=0,l=Array(arguments.length-3);g<l.length;)l[g]=arguments[g+3],++g;g=new Fc(l,0)}return e.call(this,a,b,c,g)}function e(d,f,g,l){d=B.A(c,d,f,g,l);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}d.w=3;d.B=function(a){var b=I(a);a=J(a);var c=I(a);a=J(a);var d=I(a);a=Gc(a);return e(b,c,d,a)};d.h=e;return d}(),h=function(a,b,c,h){switch(arguments.length){case 0:return g.call(this);case 1:return f.call(this,a);case 2:return e.call(this,a,b);
case 3:return d.call(this,a,b,c);default:var r=null;if(3<arguments.length){for(var r=0,u=Array(arguments.length-3);r<u.length;)u[r]=arguments[r+3],++r;r=new Fc(u,0)}return l.h(a,b,c,r)}throw Error("Invalid arity: "+arguments.length);};h.w=3;h.B=l.B;h.m=g;h.b=f;h.a=e;h.c=d;h.h=l.h;return h}()};
Le.h=function(a,b,c,d){return function(a){return function(){function b(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new Fc(e,0)}return c.call(this,d)}function c(b){b=B.a(I(a),b);for(var d=J(a);;)if(d)b=I(d).call(null,b),d=J(d);else return b}b.w=0;b.B=function(a){a=H(a);return c(a)};b.h=c;return b}()}(he(M(a,M(b,M(c,d)))))};Le.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),d=J(d);return Le.h(b,a,c,d)};Le.w=3;
function Me(a,b){return function(){function c(c,d,e){return a.l?a.l(b,c,d,e):a.call(null,b,c,d,e)}function d(c,d){return a.c?a.c(b,c,d):a.call(null,b,c,d)}function e(c){return a.a?a.a(b,c):a.call(null,b,c)}function f(){return a.b?a.b(b):a.call(null,b)}var g=null,h=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;g=new Fc(h,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){return B.h(a,b,c,e,f,G([g],0))}c.w=
3;c.B=function(a){var b=I(a);a=J(a);var c=I(a);a=J(a);var e=I(a);a=Gc(a);return d(b,c,e,a)};c.h=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+3],++q;q=new Fc(r,0)}return h.h(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.B=h.B;g.m=f;g.b=
e;g.a=d;g.c=c;g.h=h.h;return g}()}Ne;function Oe(a,b){return function d(b,f){return new me(null,function(){var g=H(f);if(g){if(Cd(g)){for(var h=ec(g),l=N(h),m=qe(l),n=0;;)if(n<l)se(m,function(){var d=b+n,f=hb.a(h,n);return a.a?a.a(d,f):a.call(null,d,f)}()),n+=1;else break;return re(m.W(),d(b+l,fc(g)))}return M(function(){var d=I(g);return a.a?a.a(b,d):a.call(null,b,d)}(),d(b+1,Gc(g)))}return null},null,null)}(0,b)}function Pe(a,b,c,d){this.state=a;this.v=b;this.fc=d;this.C=16386;this.g=6455296}
k=Pe.prototype;k.equiv=function(a){return this.D(null,a)};k.D=function(a,b){return this===b};k.Fb=function(){return this.state};k.P=function(){return this.v};k.wc=function(a,b,c){a=H(this.fc);for(var d=null,e=0,f=0;;)if(f<e){var g=d.ba(null,f),h=P(g,0),g=P(g,1);g.l?g.l(h,this,b,c):g.call(null,h,this,b,c);f+=1}else if(a=H(a))Cd(a)?(d=ec(a),a=fc(a),h=d,e=N(d),d=h):(d=I(a),h=P(d,0),g=P(d,1),g.l?g.l(h,this,b,c):g.call(null,h,this,b,c),a=J(a),d=null,e=0),f=0;else return null};
k.vc=function(a,b,c){this.fc=Q.c(this.fc,b,c);return this};k.S=function(){return da(this)};var W=function W(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return W.b(arguments[0]);default:return W.h(arguments[0],new Fc(c.slice(1),0))}};W.b=function(a){return new Pe(a,null,0,null)};W.h=function(a,b){var c=null!=b&&(b.g&64||b.F)?B.a(Sc,b):b,d=C.a(c,La);C.a(c,Qe);return new Pe(a,d,0,null)};W.B=function(a){var b=I(a);a=J(a);return W.h(b,a)};
W.w=1;Re;function Se(a,b){if(a instanceof Pe){var c=a.state;a.state=b;null!=a.fc&&Vb(a,c,b);return b}return jc(a,b)}
var Te=function Te(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Te.a(arguments[0],arguments[1]);case 3:return Te.c(arguments[0],arguments[1],arguments[2]);case 4:return Te.l(arguments[0],arguments[1],arguments[2],arguments[3]);default:return Te.h(arguments[0],arguments[1],arguments[2],arguments[3],new Fc(c.slice(4),0))}};Te.a=function(a,b){var c;a instanceof Pe?(c=a.state,c=b.b?b.b(c):b.call(null,c),c=Se(a,c)):c=kc.a(a,b);return c};
Te.c=function(a,b,c){if(a instanceof Pe){var d=a.state;b=b.a?b.a(d,c):b.call(null,d,c);a=Se(a,b)}else a=kc.c(a,b,c);return a};Te.l=function(a,b,c,d){if(a instanceof Pe){var e=a.state;b=b.c?b.c(e,c,d):b.call(null,e,c,d);a=Se(a,b)}else a=kc.l(a,b,c,d);return a};Te.h=function(a,b,c,d,e){return a instanceof Pe?Se(a,B.A(b,a.state,c,d,e)):kc.A(a,b,c,d,e)};Te.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),e=J(d),d=I(e),e=J(e);return Te.h(b,a,c,d,e)};Te.w=4;
function Ue(a){this.state=a;this.g=32768;this.C=0}Ue.prototype.Fb=function(){return this.state};function Ne(a){return new Ue(a)}
var T=function T(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return T.b(arguments[0]);case 2:return T.a(arguments[0],arguments[1]);case 3:return T.c(arguments[0],arguments[1],arguments[2]);case 4:return T.l(arguments[0],arguments[1],arguments[2],arguments[3]);default:return T.h(arguments[0],arguments[1],arguments[2],arguments[3],new Fc(c.slice(4),0))}};
T.b=function(a){return function(b){return function(){function c(c,d){var e=a.b?a.b(d):a.call(null,d);return b.a?b.a(c,e):b.call(null,c,e)}function d(a){return b.b?b.b(a):b.call(null,a)}function e(){return b.m?b.m():b.call(null)}var f=null,g=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new Fc(g,0)}return d.call(this,a,b,f)}function d(c,e,f){e=B.c(a,e,f);return b.a?b.a(c,e):b.call(null,c,e)}c.w=2;c.B=function(a){var b=
I(a);a=J(a);var c=I(a);a=Gc(a);return d(b,c,a)};c.h=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var n=null;if(2<arguments.length){for(var n=0,p=Array(arguments.length-2);n<p.length;)p[n]=arguments[n+2],++n;n=new Fc(p,0)}return g.h(a,b,n)}throw Error("Invalid arity: "+arguments.length);};f.w=2;f.B=g.B;f.m=e;f.b=d;f.a=c;f.h=g.h;return f}()}};
T.a=function(a,b){return new me(null,function(){var c=H(b);if(c){if(Cd(c)){for(var d=ec(c),e=N(d),f=qe(e),g=0;;)if(g<e)se(f,function(){var b=hb.a(d,g);return a.b?a.b(b):a.call(null,b)}()),g+=1;else break;return re(f.W(),T.a(a,fc(c)))}return M(function(){var b=I(c);return a.b?a.b(b):a.call(null,b)}(),T.a(a,Gc(c)))}return null},null,null)};
T.c=function(a,b,c){return new me(null,function(){var d=H(b),e=H(c);if(d&&e){var f=M,g;g=I(d);var h=I(e);g=a.a?a.a(g,h):a.call(null,g,h);d=f(g,T.c(a,Gc(d),Gc(e)))}else d=null;return d},null,null)};T.l=function(a,b,c,d){return new me(null,function(){var e=H(b),f=H(c),g=H(d);if(e&&f&&g){var h=M,l;l=I(e);var m=I(f),n=I(g);l=a.c?a.c(l,m,n):a.call(null,l,m,n);e=h(l,T.l(a,Gc(e),Gc(f),Gc(g)))}else e=null;return e},null,null)};
T.h=function(a,b,c,d,e){var f=function h(a){return new me(null,function(){var b=T.a(H,a);return He(Od,b)?M(T.a(I,b),h(T.a(Gc,b))):null},null,null)};return T.a(function(){return function(b){return B.a(a,b)}}(f),f(ld.h(e,d,G([c,b],0))))};T.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),e=J(d),d=I(e),e=J(e);return T.h(b,a,c,d,e)};T.w=4;function Ve(a,b){return new me(null,function(){if(0<a){var c=H(b);return c?M(I(c),Ve(a-1,Gc(c))):null}return null},null,null)}
function We(a,b){return new me(null,function(c){return function(){return c(a,b)}}(function(a,b){for(;;){var e=H(b);if(0<a&&e){var f=a-1,e=Gc(e);a=f;b=e}else return e}}),null,null)}function Xe(a){return new me(null,function(){return M(a,Xe(a))},null,null)}function Ye(a){return new me(null,function(){return M(a.m?a.m():a.call(null),Ye(a))},null,null)}
var Ze=function Ze(b,c){return M(c,new me(null,function(){return Ze(b,b.b?b.b(c):b.call(null,c))},null,null))},$e=function $e(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return $e.a(arguments[0],arguments[1]);default:return $e.h(arguments[0],arguments[1],new Fc(c.slice(2),0))}};$e.a=function(a,b){return new me(null,function(){var c=H(a),d=H(b);return c&&d?M(I(c),M(I(d),$e.a(Gc(c),Gc(d)))):null},null,null)};
$e.h=function(a,b,c){return new me(null,function(){var d=T.a(H,ld.h(c,b,G([a],0)));return He(Od,d)?we.a(T.a(I,d),B.a($e,T.a(Gc,d))):null},null,null)};$e.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return $e.h(b,a,c)};$e.w=2;function af(a){return We(1,$e.a(Xe("L"),a))}bf;
function cf(a,b){return new me(null,function(){var c=H(b);if(c){if(Cd(c)){for(var d=ec(c),e=N(d),f=qe(e),g=0;;)if(g<e){var h;h=hb.a(d,g);h=a.b?a.b(h):a.call(null,h);w(h)&&(h=hb.a(d,g),f.add(h));g+=1}else break;return re(f.W(),cf(a,fc(c)))}d=I(c);c=Gc(c);return w(a.b?a.b(d):a.call(null,d))?M(d,cf(a,c)):cf(a,c)}return null},null,null)}function df(a,b){return cf(Je(a),b)}
function ef(a){return function c(a){return new me(null,function(){var e=M,f;w(Gd.b?Gd.b(a):Gd.call(null,a))?(f=G([H.b?H.b(a):H.call(null,a)],0),f=B.a(we,B.c(T,c,f))):f=null;return e(a,f)},null,null)}(a)}var ff=function ff(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return ff.a(arguments[0],arguments[1]);case 3:return ff.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
ff.a=function(a,b){return null!=a?null!=a&&(a.C&4||a.Oc)?Uc(xe($a.c(Yb,Xb(a),b)),td(a)):$a.c(fb,a,b):$a.c(ld,Hc,b)};ff.c=function(a,b,c){return null!=a&&(a.C&4||a.Oc)?Uc(xe(Pd(b,ye,Xb(a),c)),td(a)):Pd(b,ld,a,c)};ff.w=3;function gf(a,b){var c;a:{c=Fd;for(var d=a,e=H(b);;)if(e)if(null!=d?d.g&256||d.tc||(d.g?0:Ua(ob,d)):Ua(ob,d)){d=C.c(d,I(e),c);if(c===d){c=null;break a}e=J(e)}else{c=null;break a}else{c=d;break a}}return c}
var hf=function hf(b,c,d){var e=P(c,0);c=Zd(c,1);return w(c)?Q.c(b,e,hf(C.a(b,e),c,d)):Q.c(b,e,d)},jf=function jf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return jf.c(arguments[0],arguments[1],arguments[2]);case 4:return jf.l(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return jf.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);case 6:return jf.T(arguments[0],arguments[1],arguments[2],arguments[3],
arguments[4],arguments[5]);default:return jf.h(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],new Fc(c.slice(6),0))}};jf.c=function(a,b,c){var d=P(b,0);b=Zd(b,1);return w(b)?Q.c(a,d,jf.c(C.a(a,d),b,c)):Q.c(a,d,function(){var b=C.a(a,d);return c.b?c.b(b):c.call(null,b)}())};jf.l=function(a,b,c,d){var e=P(b,0);b=Zd(b,1);return w(b)?Q.c(a,e,jf.l(C.a(a,e),b,c,d)):Q.c(a,e,function(){var b=C.a(a,e);return c.a?c.a(b,d):c.call(null,b,d)}())};
jf.A=function(a,b,c,d,e){var f=P(b,0);b=Zd(b,1);return w(b)?Q.c(a,f,jf.A(C.a(a,f),b,c,d,e)):Q.c(a,f,function(){var b=C.a(a,f);return c.c?c.c(b,d,e):c.call(null,b,d,e)}())};jf.T=function(a,b,c,d,e,f){var g=P(b,0);b=Zd(b,1);return w(b)?Q.c(a,g,jf.T(C.a(a,g),b,c,d,e,f)):Q.c(a,g,function(){var b=C.a(a,g);return c.l?c.l(b,d,e,f):c.call(null,b,d,e,f)}())};jf.h=function(a,b,c,d,e,f,g){var h=P(b,0);b=Zd(b,1);return w(b)?Q.c(a,h,B.h(jf,C.a(a,h),b,c,d,G([e,f,g],0))):Q.c(a,h,B.h(c,C.a(a,h),d,e,f,G([g],0)))};
jf.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),e=J(d),d=I(e),f=J(e),e=I(f),g=J(f),f=I(g),g=J(g);return jf.h(b,a,c,d,e,f,g)};jf.w=6;
var kf=function kf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return kf.c(arguments[0],arguments[1],arguments[2]);case 4:return kf.l(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return kf.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);case 6:return kf.T(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);default:return kf.h(arguments[0],arguments[1],arguments[2],arguments[3],
arguments[4],arguments[5],new Fc(c.slice(6),0))}};kf.c=function(a,b,c){return Q.c(a,b,function(){var d=C.a(a,b);return c.b?c.b(d):c.call(null,d)}())};kf.l=function(a,b,c,d){return Q.c(a,b,function(){var e=C.a(a,b);return c.a?c.a(e,d):c.call(null,e,d)}())};kf.A=function(a,b,c,d,e){return Q.c(a,b,function(){var f=C.a(a,b);return c.c?c.c(f,d,e):c.call(null,f,d,e)}())};kf.T=function(a,b,c,d,e,f){return Q.c(a,b,function(){var g=C.a(a,b);return c.l?c.l(g,d,e,f):c.call(null,g,d,e,f)}())};
kf.h=function(a,b,c,d,e,f,g){return Q.c(a,b,B.h(c,C.a(a,b),d,e,f,G([g],0)))};kf.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),e=J(d),d=I(e),f=J(e),e=I(f),g=J(f),f=I(g),g=J(g);return kf.h(b,a,c,d,e,f,g)};kf.w=6;function lf(a,b){this.V=a;this.f=b}function mf(a){return new lf(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function nf(a){a=a.o;return 32>a?0:a-1>>>5<<5}
function pf(a,b,c){for(;;){if(0===b)return c;var d=mf(a);d.f[0]=c;c=d;b-=5}}var qf=function qf(b,c,d,e){var f=new lf(d.V,Za(d.f)),g=b.o-1>>>c&31;5===c?f.f[g]=e:(d=d.f[g],b=null!=d?qf(b,c-5,d,e):pf(null,c-5,e),f.f[g]=b);return f};function rf(a,b){throw Error([A("No item "),A(a),A(" in vector of length "),A(b)].join(""));}function sf(a,b){if(b>=nf(a))return a.O;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.f[b>>>d&31],d=e;else return c.f}function tf(a,b){return 0<=b&&b<a.o?sf(a,b):rf(b,a.o)}
var uf=function uf(b,c,d,e,f){var g=new lf(d.V,Za(d.f));if(0===c)g.f[e&31]=f;else{var h=e>>>c&31;b=uf(b,c-5,d.f[h],e,f);g.f[h]=b}return g};function vf(a,b,c,d,e,f){this.s=a;this.Wb=b;this.f=c;this.Na=d;this.start=e;this.end=f}vf.prototype.ya=function(){return this.s<this.end};vf.prototype.next=function(){32===this.s-this.Wb&&(this.f=sf(this.Na,this.s),this.Wb+=32);var a=this.f[this.s&31];this.s+=1;return a};wf;xf;yf;K;zf;Af;Bf;
function R(a,b,c,d,e,f){this.v=a;this.o=b;this.shift=c;this.root=d;this.O=e;this.u=f;this.g=167668511;this.C=8196}k=R.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.N=function(a,b){return pb.c(this,b,null)};k.I=function(a,b,c){return"number"===typeof b?hb.c(this,b,c):c};
k.Hb=function(a,b,c){a=0;for(var d=c;;)if(a<this.o){var e=sf(this,a);c=e.length;a:for(var f=0;;)if(f<c){var g=f+a,h=e[f],d=b.c?b.c(d,g,h):b.call(null,d,g,h);if(Xc(d)){e=d;break a}f+=1}else{e=d;break a}if(Xc(e))return K.b?K.b(e):K.call(null,e);a+=c;d=e}else return d};k.ba=function(a,b){return tf(this,b)[b&31]};k.Ea=function(a,b,c){return 0<=b&&b<this.o?sf(this,b)[b&31]:c};
k.fb=function(a,b,c){if(0<=b&&b<this.o)return nf(this)<=b?(a=Za(this.O),a[b&31]=c,new R(this.v,this.o,this.shift,this.root,a,null)):new R(this.v,this.o,this.shift,uf(this,this.shift,this.root,b,c),this.O,null);if(b===this.o)return fb(this,c);throw Error([A("Index "),A(b),A(" out of bounds  [0,"),A(this.o),A("]")].join(""));};k.Ha=function(){var a=this.o;return new vf(0,0,0<N(this)?sf(this,0):null,this,0,a)};k.P=function(){return this.v};k.Z=function(){return this.o};
k.Ib=function(){return hb.a(this,0)};k.Jb=function(){return hb.a(this,1)};k.eb=function(){return 0<this.o?hb.a(this,this.o-1):null};k.Zb=function(){return 0<this.o?new dd(this,this.o-1,null):null};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Oc(this)};k.D=function(a,b){if(b instanceof R)if(this.o===N(b))for(var c=lc(this),d=lc(b);;)if(w(c.ya())){var e=c.next(),f=d.next();if(!vc.a(e,f))return!1}else return!0;else return!1;else return Tc(this,b)};
k.qb=function(){return new yf(this.o,this.shift,wf.b?wf.b(this.root):wf.call(null,this.root),xf.b?xf.b(this.O):xf.call(null,this.O))};k.ca=function(){return Uc(md,this.v)};k.ea=function(a,b){return Yc(this,b)};k.fa=function(a,b,c){a=0;for(var d=c;;)if(a<this.o){var e=sf(this,a);c=e.length;a:for(var f=0;;)if(f<c){var g=e[f],d=b.a?b.a(d,g):b.call(null,d,g);if(Xc(d)){e=d;break a}f+=1}else{e=d;break a}if(Xc(e))return K.b?K.b(e):K.call(null,e);a+=c;d=e}else return d};
k.Ra=function(a,b,c){if("number"===typeof b)return Cb(this,b,c);throw Error("Vector's key for assoc must be a number.");};k.U=function(){if(0===this.o)return null;if(32>=this.o)return new Fc(this.O,0);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.f[0];else{a=a.f;break a}}return Bf.l?Bf.l(this,a,0,0):Bf.call(null,this,a,0,0)};k.R=function(a,b){return new R(b,this.o,this.shift,this.root,this.O,this.u)};
k.X=function(a,b){if(32>this.o-nf(this)){for(var c=this.O.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.O[e],e+=1;else break;d[c]=b;return new R(this.v,this.o+1,this.shift,this.root,d,null)}c=(d=this.o>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=mf(null),d.f[0]=this.root,e=pf(null,this.shift,new lf(null,this.O)),d.f[1]=e):d=qf(this,this.shift,this.root,new lf(null,this.O));return new R(this.v,this.o+1,c,d,[b],null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.ba(null,c);case 3:return this.Ea(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.ba(null,c)};a.c=function(a,c,d){return this.Ea(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return this.ba(null,a)};k.a=function(a,b){return this.Ea(null,a,b)};
var S=new lf(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),md=new R(null,0,5,S,[],Pc);function Cf(a){var b=a.length;if(32>b)return new R(null,b,5,S,a,null);for(var c=32,d=(new R(null,32,5,S,a.slice(0,32),null)).qb(null);;)if(c<b)var e=c+1,d=ye.a(d,a[c]),c=e;else return Zb(d)}R.prototype[Ya]=function(){return Kc(this)};function Nd(a){return Sa(a)?Cf(a):Zb($a.c(Yb,Xb(md),a))}
var Df=function Df(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Df.h(0<c.length?new Fc(c.slice(0),0):null)};Df.h=function(a){return a instanceof Fc&&0===a.s?Cf(a.f):Nd(a)};Df.w=0;Df.B=function(a){return Df.h(H(a))};Ef;function Ad(a,b,c,d,e,f){this.Ga=a;this.node=b;this.s=c;this.ua=d;this.v=e;this.u=f;this.g=32375020;this.C=1536}k=Ad.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};
k.wa=function(){if(this.ua+1<this.node.length){var a;a=this.Ga;var b=this.node,c=this.s,d=this.ua+1;a=Bf.l?Bf.l(a,b,c,d):Bf.call(null,a,b,c,d);return null==a?null:a}return gc(this)};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Oc(this)};k.D=function(a,b){return Tc(this,b)};k.ca=function(){return Uc(md,this.v)};k.ea=function(a,b){var c;c=this.Ga;var d=this.s+this.ua,e=N(this.Ga);c=Ef.c?Ef.c(c,d,e):Ef.call(null,c,d,e);return Yc(c,b)};
k.fa=function(a,b,c){a=this.Ga;var d=this.s+this.ua,e=N(this.Ga);a=Ef.c?Ef.c(a,d,e):Ef.call(null,a,d,e);return Zc(a,b,c)};k.ta=function(){return this.node[this.ua]};k.xa=function(){if(this.ua+1<this.node.length){var a;a=this.Ga;var b=this.node,c=this.s,d=this.ua+1;a=Bf.l?Bf.l(a,b,c,d):Bf.call(null,a,b,c,d);return null==a?Hc:a}return fc(this)};k.U=function(){return this};k.jc=function(){var a=this.node;return new oe(a,this.ua,a.length)};
k.kc=function(){var a=this.s+this.node.length;if(a<cb(this.Ga)){var b=this.Ga,c=sf(this.Ga,a);return Bf.l?Bf.l(b,c,a,0):Bf.call(null,b,c,a,0)}return Hc};k.R=function(a,b){return Bf.A?Bf.A(this.Ga,this.node,this.s,this.ua,b):Bf.call(null,this.Ga,this.node,this.s,this.ua,b)};k.X=function(a,b){return M(b,this)};k.ic=function(){var a=this.s+this.node.length;if(a<cb(this.Ga)){var b=this.Ga,c=sf(this.Ga,a);return Bf.l?Bf.l(b,c,a,0):Bf.call(null,b,c,a,0)}return null};Ad.prototype[Ya]=function(){return Kc(this)};
var Bf=function Bf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Bf.c(arguments[0],arguments[1],arguments[2]);case 4:return Bf.l(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Bf.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};Bf.c=function(a,b,c){return new Ad(a,tf(a,b),b,c,null,null)};
Bf.l=function(a,b,c,d){return new Ad(a,b,c,d,null,null)};Bf.A=function(a,b,c,d,e){return new Ad(a,b,c,d,e,null)};Bf.w=5;Ff;function Gf(a,b,c,d,e){this.v=a;this.Na=b;this.start=c;this.end=d;this.u=e;this.g=167666463;this.C=8192}k=Gf.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.N=function(a,b){return pb.c(this,b,null)};k.I=function(a,b,c){return"number"===typeof b?hb.c(this,b,c):c};
k.Hb=function(a,b,c){a=this.start;for(var d=0;;)if(a<this.end){var e=d,f=hb.a(this.Na,a);c=b.c?b.c(c,e,f):b.call(null,c,e,f);if(Xc(c))return K.b?K.b(c):K.call(null,c);d+=1;a+=1}else return c};k.ba=function(a,b){return 0>b||this.end<=this.start+b?rf(b,this.end-this.start):hb.a(this.Na,this.start+b)};k.Ea=function(a,b,c){return 0>b||this.end<=this.start+b?c:hb.c(this.Na,this.start+b,c)};
k.fb=function(a,b,c){var d=this.start+b;a=this.v;c=Q.c(this.Na,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return Ff.A?Ff.A(a,c,b,d,null):Ff.call(null,a,c,b,d,null)};k.P=function(){return this.v};k.Z=function(){return this.end-this.start};k.eb=function(){return hb.a(this.Na,this.end-1)};k.Zb=function(){return this.start!==this.end?new dd(this,this.end-this.start-1,null):null};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Oc(this)};k.D=function(a,b){return Tc(this,b)};
k.ca=function(){return Uc(md,this.v)};k.ea=function(a,b){return Yc(this,b)};k.fa=function(a,b,c){return Zc(this,b,c)};k.Ra=function(a,b,c){if("number"===typeof b)return Cb(this,b,c);throw Error("Subvec's key for assoc must be a number.");};k.U=function(){var a=this;return function(b){return function d(e){return e===a.end?null:M(hb.a(a.Na,e),new me(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};
k.R=function(a,b){return Ff.A?Ff.A(b,this.Na,this.start,this.end,this.u):Ff.call(null,b,this.Na,this.start,this.end,this.u)};k.X=function(a,b){var c=this.v,d=Cb(this.Na,this.end,b),e=this.start,f=this.end+1;return Ff.A?Ff.A(c,d,e,f,null):Ff.call(null,c,d,e,f,null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.ba(null,c);case 3:return this.Ea(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.ba(null,c)};a.c=function(a,c,d){return this.Ea(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return this.ba(null,a)};k.a=function(a,b){return this.Ea(null,a,b)};Gf.prototype[Ya]=function(){return Kc(this)};
function Ff(a,b,c,d,e){for(;;)if(b instanceof Gf)c=b.start+c,d=b.start+d,b=b.Na;else{var f=N(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new Gf(a,b,c,d,e)}}var Ef=function Ef(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ef.a(arguments[0],arguments[1]);case 3:return Ef.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
Ef.a=function(a,b){return Ef.c(a,b,N(a))};Ef.c=function(a,b,c){return Ff(null,a,b,c,null)};Ef.w=3;function Hf(a,b){return a===b.V?b:new lf(a,Za(b.f))}function wf(a){return new lf({},Za(a.f))}function xf(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];Ed(a,0,b,0,a.length);return b}
var If=function If(b,c,d,e){d=Hf(b.root.V,d);var f=b.o-1>>>c&31;if(5===c)b=e;else{var g=d.f[f];b=null!=g?If(b,c-5,g,e):pf(b.root.V,c-5,e)}d.f[f]=b;return d};function yf(a,b,c,d){this.o=a;this.shift=b;this.root=c;this.O=d;this.C=88;this.g=275}k=yf.prototype;
k.Nb=function(a,b){if(this.root.V){if(32>this.o-nf(this))this.O[this.o&31]=b;else{var c=new lf(this.root.V,this.O),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.O=d;if(this.o>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=pf(this.root.V,this.shift,c);this.root=new lf(this.root.V,d);this.shift=e}else this.root=If(this,this.shift,this.root,c)}this.o+=1;return this}throw Error("conj! after persistent!");};k.Ob=function(){if(this.root.V){this.root.V=null;var a=this.o-nf(this),b=Array(a);Ed(this.O,0,b,0,a);return new R(null,this.o,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
k.Mb=function(a,b,c){if("number"===typeof b)return ac(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
k.uc=function(a,b,c){var d=this;if(d.root.V){if(0<=b&&b<d.o)return nf(this)<=b?d.O[b&31]=c:(a=function(){return function f(a,h){var l=Hf(d.root.V,h);if(0===a)l.f[b&31]=c;else{var m=b>>>a&31,n=f(a-5,l.f[m]);l.f[m]=n}return l}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.o)return Yb(this,c);throw Error([A("Index "),A(b),A(" out of bounds for TransientVector of length"),A(d.o)].join(""));}throw Error("assoc! after persistent!");};
k.Z=function(){if(this.root.V)return this.o;throw Error("count after persistent!");};k.ba=function(a,b){if(this.root.V)return tf(this,b)[b&31];throw Error("nth after persistent!");};k.Ea=function(a,b,c){return 0<=b&&b<this.o?hb.a(this,b):c};k.N=function(a,b){return pb.c(this,b,null)};k.I=function(a,b,c){return"number"===typeof b?hb.c(this,b,c):c};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};function Jf(){this.g=2097152;this.C=0}
Jf.prototype.equiv=function(a){return this.D(null,a)};Jf.prototype.D=function(){return!1};var Kf=new Jf;function Lf(a,b){return Hd(xd(b)?N(a)===N(b)?He(Od,T.a(function(a){return vc.a(C.c(b,I(a),Kf),jd(a))},a)):null:null)}function Mf(a,b,c,d,e){this.s=a;this.pd=b;this.pc=c;this.cd=d;this.Hc=e}Mf.prototype.ya=function(){var a=this.s<this.pc;return a?a:this.Hc.ya()};Mf.prototype.next=function(){if(this.s<this.pc){var a=od(this.cd,this.s);this.s+=1;return new R(null,2,5,S,[a,pb.a(this.pd,a)],null)}return this.Hc.next()};
Mf.prototype.remove=function(){return Error("Unsupported operation")};function Nf(a){this.H=a}Nf.prototype.next=function(){if(null!=this.H){var a=I(this.H),b=P(a,0),a=P(a,1);this.H=J(this.H);return{value:[b,a],done:!1}}return{value:null,done:!0}};function Of(a){return new Nf(H(a))}function Pf(a){this.H=a}Pf.prototype.next=function(){if(null!=this.H){var a=I(this.H);this.H=J(this.H);return{value:[a,a],done:!1}}return{value:null,done:!0}};
function Qf(a,b){var c;if(b instanceof x)a:{c=a.length;for(var d=b.Ia,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof x&&d===a[e].Ia){c=e;break a}e+=2}}else if("string"==typeof b||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof uc)a:for(c=a.length,d=b.Va,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof uc&&d===a[e].Va){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=
a.length,d=0;;){if(c<=d){c=-1;break a}if(vc.a(b,a[d])){c=d;break a}d+=2}return c}Rf;function Sf(a,b,c){this.f=a;this.s=b;this.Da=c;this.g=32374990;this.C=0}k=Sf.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.Da};k.wa=function(){return this.s<this.f.length-2?new Sf(this.f,this.s+2,this.Da):null};k.Z=function(){return(this.f.length-this.s)/2};k.S=function(){return Oc(this)};k.D=function(a,b){return Tc(this,b)};
k.ca=function(){return Uc(Hc,this.Da)};k.ea=function(a,b){return id.a(b,this)};k.fa=function(a,b,c){return id.c(b,c,this)};k.ta=function(){return new R(null,2,5,S,[this.f[this.s],this.f[this.s+1]],null)};k.xa=function(){return this.s<this.f.length-2?new Sf(this.f,this.s+2,this.Da):Hc};k.U=function(){return this};k.R=function(a,b){return new Sf(this.f,this.s,b)};k.X=function(a,b){return M(b,this)};Sf.prototype[Ya]=function(){return Kc(this)};Tf;Uf;function Vf(a,b,c){this.f=a;this.s=b;this.o=c}
Vf.prototype.ya=function(){return this.s<this.o};Vf.prototype.next=function(){var a=new R(null,2,5,S,[this.f[this.s],this.f[this.s+1]],null);this.s+=2;return a};function v(a,b,c,d){this.v=a;this.o=b;this.f=c;this.u=d;this.g=16647951;this.C=8196}k=v.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.keys=function(){return Kc(Tf.b?Tf.b(this):Tf.call(null,this))};k.entries=function(){return Of(H(this))};
k.values=function(){return Kc(Uf.b?Uf.b(this):Uf.call(null,this))};k.has=function(a){return Id(this,a)};k.get=function(a,b){return this.I(null,a,b)};k.forEach=function(a){for(var b=H(this),c=null,d=0,e=0;;)if(e<d){var f=c.ba(null,e),g=P(f,0),f=P(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=H(b))Cd(b)?(c=ec(b),b=fc(b),g=c,d=N(c),c=g):(c=I(b),g=P(c,0),f=P(c,1),a.a?a.a(f,g):a.call(null,f,g),b=J(b),c=null,d=0),e=0;else return null};k.N=function(a,b){return pb.c(this,b,null)};
k.I=function(a,b,c){a=Qf(this.f,b);return-1===a?c:this.f[a+1]};k.Hb=function(a,b,c){a=this.f.length;for(var d=0;;)if(d<a){var e=this.f[d],f=this.f[d+1];c=b.c?b.c(c,e,f):b.call(null,c,e,f);if(Xc(c))return K.b?K.b(c):K.call(null,c);d+=2}else return c};k.Ha=function(){return new Vf(this.f,0,2*this.o)};k.P=function(){return this.v};k.Z=function(){return this.o};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Qc(this)};
k.D=function(a,b){if(null!=b&&(b.g&1024||b.Rc)){var c=this.f.length;if(this.o===b.Z(null))for(var d=0;;)if(d<c){var e=b.I(null,this.f[d],Fd);if(e!==Fd)if(vc.a(this.f[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return Lf(this,b)};k.qb=function(){return new Rf({},this.f.length,Za(this.f))};k.ca=function(){return Gb(V,this.v)};k.ea=function(a,b){return id.a(b,this)};k.fa=function(a,b,c){return id.c(b,c,this)};
k.sb=function(a,b){if(0<=Qf(this.f,b)){var c=this.f.length,d=c-2;if(0===d)return db(this);for(var d=Array(d),e=0,f=0;;){if(e>=c)return new v(this.v,this.o-1,d,null);vc.a(b,this.f[e])||(d[f]=this.f[e],d[f+1]=this.f[e+1],f+=2);e+=2}}else return this};
k.Ra=function(a,b,c){a=Qf(this.f,b);if(-1===a){if(this.o<Wf){a=this.f;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new v(this.v,this.o+1,e,null)}return Gb(sb(ff.a(Xf,this),b,c),this.v)}if(c===this.f[a+1])return this;b=Za(this.f);b[a+1]=c;return new v(this.v,this.o,b,null)};k.hc=function(a,b){return-1!==Qf(this.f,b)};k.U=function(){var a=this.f;return 0<=a.length-2?new Sf(a,0,null):null};k.R=function(a,b){return new v(b,this.o,this.f,this.u)};
k.X=function(a,b){if(yd(b))return sb(this,hb.a(b,0),hb.a(b,1));for(var c=this,d=H(b);;){if(null==d)return c;var e=I(d);if(yd(e))c=sb(c,hb.a(e,0),hb.a(e,1)),d=J(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};var V=new v(null,0,[],Rc),Wf=8;v.prototype[Ya]=function(){return Kc(this)};
Yf;function Rf(a,b,c){this.xb=a;this.lb=b;this.f=c;this.g=258;this.C=56}k=Rf.prototype;k.Z=function(){if(w(this.xb))return Xd(this.lb);throw Error("count after persistent!");};k.N=function(a,b){return pb.c(this,b,null)};k.I=function(a,b,c){if(w(this.xb))return a=Qf(this.f,b),-1===a?c:this.f[a+1];throw Error("lookup after persistent!");};
k.Nb=function(a,b){if(w(this.xb)){if(null!=b?b.g&2048||b.Sc||(b.g?0:Ua(vb,b)):Ua(vb,b))return $b(this,ae.b?ae.b(b):ae.call(null,b),be.b?be.b(b):be.call(null,b));for(var c=H(b),d=this;;){var e=I(c);if(w(e))c=J(c),d=$b(d,ae.b?ae.b(e):ae.call(null,e),be.b?be.b(e):be.call(null,e));else return d}}else throw Error("conj! after persistent!");};k.Ob=function(){if(w(this.xb))return this.xb=!1,new v(null,Xd(this.lb),this.f,null);throw Error("persistent! called twice");};
k.Mb=function(a,b,c){if(w(this.xb)){a=Qf(this.f,b);if(-1===a)return this.lb+2<=2*Wf?(this.lb+=2,this.f.push(b),this.f.push(c),this):ze(Yf.a?Yf.a(this.lb,this.f):Yf.call(null,this.lb,this.f),b,c);c!==this.f[a+1]&&(this.f[a+1]=c);return this}throw Error("assoc! after persistent!");};Zf;pd;function Yf(a,b){for(var c=Xb(Xf),d=0;;)if(d<a)c=$b(c,b[d],b[d+1]),d+=2;else return c}function $f(){this.G=!1}ag;bg;Se;cg;W;K;function dg(a,b){return a===b?!0:ke(a,b)?!0:vc.a(a,b)}
function eg(a,b,c){a=Za(a);a[b]=c;return a}function fg(a,b){var c=Array(a.length-2);Ed(a,0,c,0,2*b);Ed(a,2*(b+1),c,2*b,c.length-2*b);return c}function gg(a,b,c,d){a=a.hb(b);a.f[c]=d;return a}function hg(a,b,c){for(var d=a.length,e=0,f=c;;)if(e<d){c=a[e];if(null!=c){var g=a[e+1];c=b.c?b.c(f,c,g):b.call(null,f,c,g)}else c=a[e+1],c=null!=c?c.kb(b,f):f;if(Xc(c))return K.b?K.b(c):K.call(null,c);e+=2;f=c}else return f}ig;function jg(a,b,c,d){this.f=a;this.s=b;this.Vb=c;this.Qa=d}
jg.prototype.advance=function(){for(var a=this.f.length;;)if(this.s<a){var b=this.f[this.s],c=this.f[this.s+1];null!=b?b=this.Vb=new R(null,2,5,S,[b,c],null):null!=c?(b=lc(c),b=b.ya()?this.Qa=b:!1):b=!1;this.s+=2;if(b)return!0}else return!1};jg.prototype.ya=function(){var a=null!=this.Vb;return a?a:(a=null!=this.Qa)?a:this.advance()};
jg.prototype.next=function(){if(null!=this.Vb){var a=this.Vb;this.Vb=null;return a}if(null!=this.Qa)return a=this.Qa.next(),this.Qa.ya()||(this.Qa=null),a;if(this.advance())return this.next();throw Error("No such element");};jg.prototype.remove=function(){return Error("Unsupported operation")};function kg(a,b,c){this.V=a;this.Y=b;this.f=c}k=kg.prototype;k.hb=function(a){if(a===this.V)return this;var b=Yd(this.Y),c=Array(0>b?4:2*(b+1));Ed(this.f,0,c,0,2*b);return new kg(a,this.Y,c)};
k.Sb=function(){return ag.b?ag.b(this.f):ag.call(null,this.f)};k.kb=function(a,b){return hg(this.f,a,b)};k.$a=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.Y&e))return d;var f=Yd(this.Y&e-1),e=this.f[2*f],f=this.f[2*f+1];return null==e?f.$a(a+5,b,c,d):dg(c,e)?f:d};
k.Pa=function(a,b,c,d,e,f){var g=1<<(c>>>b&31),h=Yd(this.Y&g-1);if(0===(this.Y&g)){var l=Yd(this.Y);if(2*l<this.f.length){a=this.hb(a);b=a.f;f.G=!0;a:for(c=2*(l-h),f=2*h+(c-1),l=2*(h+1)+(c-1);;){if(0===c)break a;b[l]=b[f];--l;--c;--f}b[2*h]=d;b[2*h+1]=e;a.Y|=g;return a}if(16<=l){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[c>>>b&31]=lg.Pa(a,b+5,c,d,e,f);for(e=d=0;;)if(32>d)0!==
(this.Y>>>d&1)&&(h[d]=null!=this.f[e]?lg.Pa(a,b+5,Ac(this.f[e]),this.f[e],this.f[e+1],f):this.f[e+1],e+=2),d+=1;else break;return new ig(a,l+1,h)}b=Array(2*(l+4));Ed(this.f,0,b,0,2*h);b[2*h]=d;b[2*h+1]=e;Ed(this.f,2*h,b,2*(h+1),2*(l-h));f.G=!0;a=this.hb(a);a.f=b;a.Y|=g;return a}l=this.f[2*h];g=this.f[2*h+1];if(null==l)return l=g.Pa(a,b+5,c,d,e,f),l===g?this:gg(this,a,2*h+1,l);if(dg(d,l))return e===g?this:gg(this,a,2*h+1,e);f.G=!0;f=b+5;d=cg.aa?cg.aa(a,f,l,g,c,d,e):cg.call(null,a,f,l,g,c,d,e);e=2*
h;h=2*h+1;a=this.hb(a);a.f[e]=null;a.f[h]=d;return a};
k.Oa=function(a,b,c,d,e){var f=1<<(b>>>a&31),g=Yd(this.Y&f-1);if(0===(this.Y&f)){var h=Yd(this.Y);if(16<=h){g=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];g[b>>>a&31]=lg.Oa(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.Y>>>c&1)&&(g[c]=null!=this.f[d]?lg.Oa(a+5,Ac(this.f[d]),this.f[d],this.f[d+1],e):this.f[d+1],d+=2),c+=1;else break;return new ig(null,h+1,g)}a=Array(2*(h+1));Ed(this.f,
0,a,0,2*g);a[2*g]=c;a[2*g+1]=d;Ed(this.f,2*g,a,2*(g+1),2*(h-g));e.G=!0;return new kg(null,this.Y|f,a)}var l=this.f[2*g],f=this.f[2*g+1];if(null==l)return h=f.Oa(a+5,b,c,d,e),h===f?this:new kg(null,this.Y,eg(this.f,2*g+1,h));if(dg(c,l))return d===f?this:new kg(null,this.Y,eg(this.f,2*g+1,d));e.G=!0;e=this.Y;h=this.f;a+=5;a=cg.T?cg.T(a,l,f,b,c,d):cg.call(null,a,l,f,b,c,d);c=2*g;g=2*g+1;d=Za(h);d[c]=null;d[g]=a;return new kg(null,e,d)};
k.Tb=function(a,b,c){var d=1<<(b>>>a&31);if(0===(this.Y&d))return this;var e=Yd(this.Y&d-1),f=this.f[2*e],g=this.f[2*e+1];return null==f?(a=g.Tb(a+5,b,c),a===g?this:null!=a?new kg(null,this.Y,eg(this.f,2*e+1,a)):this.Y===d?null:new kg(null,this.Y^d,fg(this.f,e))):dg(c,f)?new kg(null,this.Y^d,fg(this.f,e)):this};k.Ha=function(){return new jg(this.f,0,null,null)};var lg=new kg(null,0,[]);function mg(a,b,c){this.f=a;this.s=b;this.Qa=c}
mg.prototype.ya=function(){for(var a=this.f.length;;){if(null!=this.Qa&&this.Qa.ya())return!0;if(this.s<a){var b=this.f[this.s];this.s+=1;null!=b&&(this.Qa=lc(b))}else return!1}};mg.prototype.next=function(){if(this.ya())return this.Qa.next();throw Error("No such element");};mg.prototype.remove=function(){return Error("Unsupported operation")};function ig(a,b,c){this.V=a;this.o=b;this.f=c}k=ig.prototype;k.hb=function(a){return a===this.V?this:new ig(a,this.o,Za(this.f))};
k.Sb=function(){return bg.b?bg.b(this.f):bg.call(null,this.f)};k.kb=function(a,b){for(var c=this.f.length,d=0,e=b;;)if(d<c){var f=this.f[d];if(null!=f&&(e=f.kb(a,e),Xc(e)))return K.b?K.b(e):K.call(null,e);d+=1}else return e};k.$a=function(a,b,c,d){var e=this.f[b>>>a&31];return null!=e?e.$a(a+5,b,c,d):d};k.Pa=function(a,b,c,d,e,f){var g=c>>>b&31,h=this.f[g];if(null==h)return a=gg(this,a,g,lg.Pa(a,b+5,c,d,e,f)),a.o+=1,a;b=h.Pa(a,b+5,c,d,e,f);return b===h?this:gg(this,a,g,b)};
k.Oa=function(a,b,c,d,e){var f=b>>>a&31,g=this.f[f];if(null==g)return new ig(null,this.o+1,eg(this.f,f,lg.Oa(a+5,b,c,d,e)));a=g.Oa(a+5,b,c,d,e);return a===g?this:new ig(null,this.o,eg(this.f,f,a))};
k.Tb=function(a,b,c){var d=b>>>a&31,e=this.f[d];if(null!=e){a=e.Tb(a+5,b,c);if(a===e)d=this;else if(null==a)if(8>=this.o)a:{e=this.f;a=e.length;b=Array(2*(this.o-1));c=0;for(var f=1,g=0;;)if(c<a)c!==d&&null!=e[c]&&(b[f]=e[c],f+=2,g|=1<<c),c+=1;else{d=new kg(null,g,b);break a}}else d=new ig(null,this.o-1,eg(this.f,d,a));else d=new ig(null,this.o,eg(this.f,d,a));return d}return this};k.Ha=function(){return new mg(this.f,0,null)};
function ng(a,b,c){b*=2;for(var d=0;;)if(d<b){if(dg(c,a[d]))return d;d+=2}else return-1}function og(a,b,c,d){this.V=a;this.Xa=b;this.o=c;this.f=d}k=og.prototype;k.hb=function(a){if(a===this.V)return this;var b=Array(2*(this.o+1));Ed(this.f,0,b,0,2*this.o);return new og(a,this.Xa,this.o,b)};k.Sb=function(){return ag.b?ag.b(this.f):ag.call(null,this.f)};k.kb=function(a,b){return hg(this.f,a,b)};k.$a=function(a,b,c,d){a=ng(this.f,this.o,c);return 0>a?d:dg(c,this.f[a])?this.f[a+1]:d};
k.Pa=function(a,b,c,d,e,f){if(c===this.Xa){b=ng(this.f,this.o,d);if(-1===b){if(this.f.length>2*this.o)return b=2*this.o,c=2*this.o+1,a=this.hb(a),a.f[b]=d,a.f[c]=e,f.G=!0,a.o+=1,a;c=this.f.length;b=Array(c+2);Ed(this.f,0,b,0,c);b[c]=d;b[c+1]=e;f.G=!0;d=this.o+1;a===this.V?(this.f=b,this.o=d,a=this):a=new og(this.V,this.Xa,d,b);return a}return this.f[b+1]===e?this:gg(this,a,b+1,e)}return(new kg(a,1<<(this.Xa>>>b&31),[null,this,null,null])).Pa(a,b,c,d,e,f)};
k.Oa=function(a,b,c,d,e){return b===this.Xa?(a=ng(this.f,this.o,c),-1===a?(a=2*this.o,b=Array(a+2),Ed(this.f,0,b,0,a),b[a]=c,b[a+1]=d,e.G=!0,new og(null,this.Xa,this.o+1,b)):vc.a(this.f[a],d)?this:new og(null,this.Xa,this.o,eg(this.f,a+1,d))):(new kg(null,1<<(this.Xa>>>a&31),[null,this])).Oa(a,b,c,d,e)};k.Tb=function(a,b,c){a=ng(this.f,this.o,c);return-1===a?this:1===this.o?null:new og(null,this.Xa,this.o-1,fg(this.f,Xd(a)))};k.Ha=function(){return new jg(this.f,0,null,null)};
var cg=function cg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return cg.T(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return cg.aa(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
cg.T=function(a,b,c,d,e,f){var g=Ac(b);if(g===d)return new og(null,g,2,[b,c,e,f]);var h=new $f;return lg.Oa(a,g,b,c,h).Oa(a,d,e,f,h)};cg.aa=function(a,b,c,d,e,f,g){var h=Ac(c);if(h===e)return new og(null,h,2,[c,d,f,g]);var l=new $f;return lg.Pa(a,b,h,c,d,l).Pa(a,b,e,f,g,l)};cg.w=7;function pg(a,b,c,d,e){this.v=a;this.ab=b;this.s=c;this.H=d;this.u=e;this.g=32374860;this.C=0}k=pg.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};
k.S=function(){var a=this.u;return null!=a?a:this.u=a=Oc(this)};k.D=function(a,b){return Tc(this,b)};k.ca=function(){return Uc(Hc,this.v)};k.ea=function(a,b){return id.a(b,this)};k.fa=function(a,b,c){return id.c(b,c,this)};k.ta=function(){return null==this.H?new R(null,2,5,S,[this.ab[this.s],this.ab[this.s+1]],null):I(this.H)};
k.xa=function(){if(null==this.H){var a=this.ab,b=this.s+2;return ag.c?ag.c(a,b,null):ag.call(null,a,b,null)}var a=this.ab,b=this.s,c=J(this.H);return ag.c?ag.c(a,b,c):ag.call(null,a,b,c)};k.U=function(){return this};k.R=function(a,b){return new pg(b,this.ab,this.s,this.H,this.u)};k.X=function(a,b){return M(b,this)};pg.prototype[Ya]=function(){return Kc(this)};
var ag=function ag(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ag.b(arguments[0]);case 3:return ag.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};ag.b=function(a){return ag.c(a,0,null)};
ag.c=function(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new pg(null,a,b,null,null);var d=a[b+1];if(w(d)&&(d=d.Sb(),w(d)))return new pg(null,a,b+2,d,null);b+=2}else return null;else return new pg(null,a,b,c,null)};ag.w=3;function qg(a,b,c,d,e){this.v=a;this.ab=b;this.s=c;this.H=d;this.u=e;this.g=32374860;this.C=0}k=qg.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};
k.S=function(){var a=this.u;return null!=a?a:this.u=a=Oc(this)};k.D=function(a,b){return Tc(this,b)};k.ca=function(){return Uc(Hc,this.v)};k.ea=function(a,b){return id.a(b,this)};k.fa=function(a,b,c){return id.c(b,c,this)};k.ta=function(){return I(this.H)};k.xa=function(){var a=this.ab,b=this.s,c=J(this.H);return bg.l?bg.l(null,a,b,c):bg.call(null,null,a,b,c)};k.U=function(){return this};k.R=function(a,b){return new qg(b,this.ab,this.s,this.H,this.u)};k.X=function(a,b){return M(b,this)};
qg.prototype[Ya]=function(){return Kc(this)};var bg=function bg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return bg.b(arguments[0]);case 4:return bg.l(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};bg.b=function(a){return bg.l(null,a,0,null)};
bg.l=function(a,b,c,d){if(null==d)for(d=b.length;;)if(c<d){var e=b[c];if(w(e)&&(e=e.Sb(),w(e)))return new qg(a,b,c+1,e,null);c+=1}else return null;else return new qg(a,b,c,d,null)};bg.w=4;Zf;function rg(a,b,c){this.Aa=a;this.Kc=b;this.oc=c}rg.prototype.ya=function(){return this.oc&&this.Kc.ya()};rg.prototype.next=function(){if(this.oc)return this.Kc.next();this.oc=!0;return this.Aa};rg.prototype.remove=function(){return Error("Unsupported operation")};
function pd(a,b,c,d,e,f){this.v=a;this.o=b;this.root=c;this.za=d;this.Aa=e;this.u=f;this.g=16123663;this.C=8196}k=pd.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.keys=function(){return Kc(Tf.b?Tf.b(this):Tf.call(null,this))};k.entries=function(){return Of(H(this))};k.values=function(){return Kc(Uf.b?Uf.b(this):Uf.call(null,this))};k.has=function(a){return Id(this,a)};k.get=function(a,b){return this.I(null,a,b)};
k.forEach=function(a){for(var b=H(this),c=null,d=0,e=0;;)if(e<d){var f=c.ba(null,e),g=P(f,0),f=P(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=H(b))Cd(b)?(c=ec(b),b=fc(b),g=c,d=N(c),c=g):(c=I(b),g=P(c,0),f=P(c,1),a.a?a.a(f,g):a.call(null,f,g),b=J(b),c=null,d=0),e=0;else return null};k.N=function(a,b){return pb.c(this,b,null)};k.I=function(a,b,c){return null==b?this.za?this.Aa:c:null==this.root?c:this.root.$a(0,Ac(b),b,c)};
k.Hb=function(a,b,c){a=this.za?b.c?b.c(c,null,this.Aa):b.call(null,c,null,this.Aa):c;return Xc(a)?K.b?K.b(a):K.call(null,a):null!=this.root?this.root.kb(b,a):a};k.Ha=function(){var a=this.root?lc(this.root):Ce;return this.za?new rg(this.Aa,a,!1):a};k.P=function(){return this.v};k.Z=function(){return this.o};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Qc(this)};k.D=function(a,b){return Lf(this,b)};k.qb=function(){return new Zf({},this.root,this.o,this.za,this.Aa)};
k.ca=function(){return Gb(Xf,this.v)};k.sb=function(a,b){if(null==b)return this.za?new pd(this.v,this.o-1,this.root,!1,null,null):this;if(null==this.root)return this;var c=this.root.Tb(0,Ac(b),b);return c===this.root?this:new pd(this.v,this.o-1,c,this.za,this.Aa,null)};
k.Ra=function(a,b,c){if(null==b)return this.za&&c===this.Aa?this:new pd(this.v,this.za?this.o:this.o+1,this.root,!0,c,null);a=new $f;b=(null==this.root?lg:this.root).Oa(0,Ac(b),b,c,a);return b===this.root?this:new pd(this.v,a.G?this.o+1:this.o,b,this.za,this.Aa,null)};k.hc=function(a,b){return null==b?this.za:null==this.root?!1:this.root.$a(0,Ac(b),b,Fd)!==Fd};k.U=function(){if(0<this.o){var a=null!=this.root?this.root.Sb():null;return this.za?M(new R(null,2,5,S,[null,this.Aa],null),a):a}return null};
k.R=function(a,b){return new pd(b,this.o,this.root,this.za,this.Aa,this.u)};k.X=function(a,b){if(yd(b))return sb(this,hb.a(b,0),hb.a(b,1));for(var c=this,d=H(b);;){if(null==d)return c;var e=I(d);if(yd(e))c=sb(c,hb.a(e,0),hb.a(e,1)),d=J(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};var Xf=new pd(null,0,null,!1,null,Rc);
function qd(a,b){for(var c=a.length,d=0,e=Xb(Xf);;)if(d<c)var f=d+1,e=e.Mb(null,a[d],b[d]),d=f;else return Zb(e)}pd.prototype[Ya]=function(){return Kc(this)};function Zf(a,b,c,d,e){this.V=a;this.root=b;this.count=c;this.za=d;this.Aa=e;this.g=258;this.C=56}function sg(a,b,c){if(a.V){if(null==b)a.Aa!==c&&(a.Aa=c),a.za||(a.count+=1,a.za=!0);else{var d=new $f;b=(null==a.root?lg:a.root).Pa(a.V,0,Ac(b),b,c,d);b!==a.root&&(a.root=b);d.G&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}k=Zf.prototype;
k.Z=function(){if(this.V)return this.count;throw Error("count after persistent!");};k.N=function(a,b){return null==b?this.za?this.Aa:null:null==this.root?null:this.root.$a(0,Ac(b),b)};k.I=function(a,b,c){return null==b?this.za?this.Aa:c:null==this.root?c:this.root.$a(0,Ac(b),b,c)};
k.Nb=function(a,b){var c;a:if(this.V)if(null!=b?b.g&2048||b.Sc||(b.g?0:Ua(vb,b)):Ua(vb,b))c=sg(this,ae.b?ae.b(b):ae.call(null,b),be.b?be.b(b):be.call(null,b));else{c=H(b);for(var d=this;;){var e=I(c);if(w(e))c=J(c),d=sg(d,ae.b?ae.b(e):ae.call(null,e),be.b?be.b(e):be.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};k.Ob=function(){var a;if(this.V)this.V=null,a=new pd(null,this.count,this.root,this.za,this.Aa,null);else throw Error("persistent! called twice");return a};
k.Mb=function(a,b,c){return sg(this,b,c)};tg;ug;var vg=function vg(b,c,d){d=null!=b.left?vg(b.left,c,d):d;if(Xc(d))return K.b?K.b(d):K.call(null,d);var e=b.key,f=b.G;d=c.c?c.c(d,e,f):c.call(null,d,e,f);if(Xc(d))return K.b?K.b(d):K.call(null,d);b=null!=b.right?vg(b.right,c,d):d;return Xc(b)?K.b?K.b(b):K.call(null,b):b};function ug(a,b,c,d,e){this.key=a;this.G=b;this.left=c;this.right=d;this.u=e;this.g=32402207;this.C=0}k=ug.prototype;k.replace=function(a,b,c,d){return new ug(a,b,c,d,null)};
k.kb=function(a,b){return vg(this,a,b)};k.N=function(a,b){return hb.c(this,b,null)};k.I=function(a,b,c){return hb.c(this,b,c)};k.ba=function(a,b){return 0===b?this.key:1===b?this.G:null};k.Ea=function(a,b,c){return 0===b?this.key:1===b?this.G:c};k.fb=function(a,b,c){return(new R(null,2,5,S,[this.key,this.G],null)).fb(null,b,c)};k.P=function(){return null};k.Z=function(){return 2};k.Ib=function(){return this.key};k.Jb=function(){return this.G};k.eb=function(){return this.G};
k.S=function(){var a=this.u;return null!=a?a:this.u=a=Oc(this)};k.D=function(a,b){return Tc(this,b)};k.ca=function(){return md};k.ea=function(a,b){return Yc(this,b)};k.fa=function(a,b,c){return Zc(this,b,c)};k.Ra=function(a,b,c){return Q.c(new R(null,2,5,S,[this.key,this.G],null),b,c)};k.U=function(){return fb(fb(Hc,this.G),this.key)};k.R=function(a,b){return Uc(new R(null,2,5,S,[this.key,this.G],null),b)};k.X=function(a,b){return new R(null,3,5,S,[this.key,this.G,b],null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};ug.prototype[Ya]=function(){return Kc(this)};
function tg(a,b,c,d,e){this.key=a;this.G=b;this.left=c;this.right=d;this.u=e;this.g=32402207;this.C=0}k=tg.prototype;k.replace=function(a,b,c,d){return new tg(a,b,c,d,null)};k.kb=function(a,b){return vg(this,a,b)};k.N=function(a,b){return hb.c(this,b,null)};k.I=function(a,b,c){return hb.c(this,b,c)};k.ba=function(a,b){return 0===b?this.key:1===b?this.G:null};k.Ea=function(a,b,c){return 0===b?this.key:1===b?this.G:c};k.fb=function(a,b,c){return(new R(null,2,5,S,[this.key,this.G],null)).fb(null,b,c)};
k.P=function(){return null};k.Z=function(){return 2};k.Ib=function(){return this.key};k.Jb=function(){return this.G};k.eb=function(){return this.G};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Oc(this)};k.D=function(a,b){return Tc(this,b)};k.ca=function(){return md};k.ea=function(a,b){return Yc(this,b)};k.fa=function(a,b,c){return Zc(this,b,c)};k.Ra=function(a,b,c){return Q.c(new R(null,2,5,S,[this.key,this.G],null),b,c)};k.U=function(){return fb(fb(Hc,this.G),this.key)};
k.R=function(a,b){return Uc(new R(null,2,5,S,[this.key,this.G],null),b)};k.X=function(a,b){return new R(null,3,5,S,[this.key,this.G,b],null)};k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};
k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};tg.prototype[Ya]=function(){return Kc(this)};ae;var Sc=function Sc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Sc.h(0<c.length?new Fc(c.slice(0),0):null)};Sc.h=function(a){a=H(a);for(var b=Xb(Xf);;)if(a){var c=J(J(a)),b=ze(b,I(a),jd(a));a=c}else return Zb(b)};Sc.w=0;Sc.B=function(a){return Sc.h(H(a))};function wg(a,b){this.J=a;this.Da=b;this.g=32374988;this.C=0}k=wg.prototype;
k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.Da};k.wa=function(){var a=(null!=this.J?this.J.g&128||this.J.Yb||(this.J.g?0:Ua(nb,this.J)):Ua(nb,this.J))?this.J.wa(null):J(this.J);return null==a?null:new wg(a,this.Da)};k.S=function(){return Oc(this)};k.D=function(a,b){return Tc(this,b)};k.ca=function(){return Uc(Hc,this.Da)};k.ea=function(a,b){return id.a(b,this)};k.fa=function(a,b,c){return id.c(b,c,this)};k.ta=function(){return this.J.ta(null).Ib(null)};
k.xa=function(){var a=(null!=this.J?this.J.g&128||this.J.Yb||(this.J.g?0:Ua(nb,this.J)):Ua(nb,this.J))?this.J.wa(null):J(this.J);return null!=a?new wg(a,this.Da):Hc};k.U=function(){return this};k.R=function(a,b){return new wg(this.J,b)};k.X=function(a,b){return M(b,this)};wg.prototype[Ya]=function(){return Kc(this)};function Tf(a){return(a=H(a))?new wg(a,null):null}function ae(a){return wb(a)}function xg(a,b){this.J=a;this.Da=b;this.g=32374988;this.C=0}k=xg.prototype;k.toString=function(){return nc(this)};
k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.Da};k.wa=function(){var a=(null!=this.J?this.J.g&128||this.J.Yb||(this.J.g?0:Ua(nb,this.J)):Ua(nb,this.J))?this.J.wa(null):J(this.J);return null==a?null:new xg(a,this.Da)};k.S=function(){return Oc(this)};k.D=function(a,b){return Tc(this,b)};k.ca=function(){return Uc(Hc,this.Da)};k.ea=function(a,b){return id.a(b,this)};k.fa=function(a,b,c){return id.c(b,c,this)};k.ta=function(){return this.J.ta(null).Jb(null)};
k.xa=function(){var a=(null!=this.J?this.J.g&128||this.J.Yb||(this.J.g?0:Ua(nb,this.J)):Ua(nb,this.J))?this.J.wa(null):J(this.J);return null!=a?new xg(a,this.Da):Hc};k.U=function(){return this};k.R=function(a,b){return new xg(this.J,b)};k.X=function(a,b){return M(b,this)};xg.prototype[Ya]=function(){return Kc(this)};function Uf(a){return(a=H(a))?new xg(a,null):null}function be(a){return xb(a)}
var yg=function yg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return yg.h(0<c.length?new Fc(c.slice(0),0):null)};yg.h=function(a){return w(Ie(Od,a))?$a.a(function(a,c){return ld.a(w(a)?a:V,c)},a):null};yg.w=0;yg.B=function(a){return yg.h(H(a))};zg;function Ag(a){this.zb=a}Ag.prototype.ya=function(){return this.zb.ya()};Ag.prototype.next=function(){if(this.zb.ya())return this.zb.next().O[0];throw Error("No such element");};Ag.prototype.remove=function(){return Error("Unsupported operation")};
function Bg(a,b,c){this.v=a;this.ib=b;this.u=c;this.g=15077647;this.C=8196}k=Bg.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.keys=function(){return Kc(H(this))};k.entries=function(){var a=H(this);return new Pf(H(a))};k.values=function(){return Kc(H(this))};k.has=function(a){return Id(this,a)};
k.forEach=function(a){for(var b=H(this),c=null,d=0,e=0;;)if(e<d){var f=c.ba(null,e),g=P(f,0),f=P(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=H(b))Cd(b)?(c=ec(b),b=fc(b),g=c,d=N(c),c=g):(c=I(b),g=P(c,0),f=P(c,1),a.a?a.a(f,g):a.call(null,f,g),b=J(b),c=null,d=0),e=0;else return null};k.N=function(a,b){return pb.c(this,b,null)};k.I=function(a,b,c){return rb(this.ib,b)?b:c};k.Ha=function(){return new Ag(lc(this.ib))};k.P=function(){return this.v};k.Z=function(){return cb(this.ib)};
k.S=function(){var a=this.u;return null!=a?a:this.u=a=Qc(this)};k.D=function(a,b){return vd(b)&&N(this)===N(b)&&He(function(a){return function(b){return Id(a,b)}}(this),b)};k.qb=function(){return new zg(Xb(this.ib))};k.ca=function(){return Uc(Cg,this.v)};k.U=function(){return Tf(this.ib)};k.R=function(a,b){return new Bg(b,this.ib,this.u)};k.X=function(a,b){return new Bg(this.v,Q.c(this.ib,b,null),null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};var Cg=new Bg(null,V,Rc);Bg.prototype[Ya]=function(){return Kc(this)};
function zg(a){this.Ya=a;this.C=136;this.g=259}k=zg.prototype;k.Nb=function(a,b){this.Ya=$b(this.Ya,b,null);return this};k.Ob=function(){return new Bg(null,Zb(this.Ya),null)};k.Z=function(){return N(this.Ya)};k.N=function(a,b){return pb.c(this,b,null)};k.I=function(a,b,c){return pb.c(this.Ya,b,Fd)===Fd?c:b};
k.call=function(){function a(a,b,c){return pb.c(this.Ya,b,Fd)===Fd?c:b}function b(a,b){return pb.c(this.Ya,b,Fd)===Fd?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return pb.c(this.Ya,a,Fd)===Fd?null:a};k.a=function(a,b){return pb.c(this.Ya,a,Fd)===Fd?b:a};
function Dg(a,b){if(yd(b)){var c=N(b);return $a.c(function(){return function(b,c){var f=Jd(a,od(b,c));return w(f)?Q.c(b,c,jd(f)):b}}(c),b,Ve(c,Ze(Vc,0)))}return T.a(function(b){var c=Jd(a,b);return w(c)?jd(c):b},b)}function Eg(a){for(var b=md;;)if(J(a))b=ld.a(b,I(a)),a=J(a);else return H(b)}function $d(a){if(null!=a&&(a.C&4096||a.Uc))return a.Kb(null);if("string"===typeof a)return a;throw Error([A("Doesn't support name: "),A(a)].join(""));}
var Fg=function Fg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Fg.a(arguments[0],arguments[1]);case 3:return Fg.c(arguments[0],arguments[1],arguments[2]);default:return Fg.h(arguments[0],arguments[1],arguments[2],new Fc(c.slice(3),0))}};Fg.a=function(a,b){return b};Fg.c=function(a,b,c){return(a.b?a.b(b):a.call(null,b))<(a.b?a.b(c):a.call(null,c))?b:c};
Fg.h=function(a,b,c,d){return $a.c(function(b,c){return Fg.c(a,b,c)},Fg.c(a,b,c),d)};Fg.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),d=J(d);return Fg.h(b,a,c,d)};Fg.w=3;function Gg(a,b){return new me(null,function(){var c=H(b);if(c){var d;d=I(c);d=a.b?a.b(d):a.call(null,d);c=w(d)?M(I(c),Gg(a,Gc(c))):null}else c=null;return c},null,null)}function Hg(a,b,c){this.s=a;this.end=b;this.step=c}Hg.prototype.ya=function(){return 0<this.step?this.s<this.end:this.s>this.end};
Hg.prototype.next=function(){var a=this.s;this.s+=this.step;return a};function Ig(a,b,c,d,e){this.v=a;this.start=b;this.end=c;this.step=d;this.u=e;this.g=32375006;this.C=8192}k=Ig.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.ba=function(a,b){if(b<cb(this))return this.start+b*this.step;if(this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};
k.Ea=function(a,b,c){return b<cb(this)?this.start+b*this.step:this.start>this.end&&0===this.step?this.start:c};k.Ha=function(){return new Hg(this.start,this.end,this.step)};k.P=function(){return this.v};k.wa=function(){return 0<this.step?this.start+this.step<this.end?new Ig(this.v,this.start+this.step,this.end,this.step,null):null:this.start+this.step>this.end?new Ig(this.v,this.start+this.step,this.end,this.step,null):null};k.Z=function(){return Ta(Ob(this))?0:Math.ceil((this.end-this.start)/this.step)};
k.S=function(){var a=this.u;return null!=a?a:this.u=a=Oc(this)};k.D=function(a,b){return Tc(this,b)};k.ca=function(){return Uc(Hc,this.v)};k.ea=function(a,b){return Yc(this,b)};k.fa=function(a,b,c){for(a=this.start;;)if(0<this.step?a<this.end:a>this.end){c=b.a?b.a(c,a):b.call(null,c,a);if(Xc(c))return K.b?K.b(c):K.call(null,c);a+=this.step}else return c};k.ta=function(){return null==Ob(this)?null:this.start};
k.xa=function(){return null!=Ob(this)?new Ig(this.v,this.start+this.step,this.end,this.step,null):Hc};k.U=function(){return 0<this.step?this.start<this.end?this:null:0>this.step?this.start>this.end?this:null:this.start===this.end?null:this};k.R=function(a,b){return new Ig(b,this.start,this.end,this.step,this.u)};k.X=function(a,b){return M(b,this)};Ig.prototype[Ya]=function(){return Kc(this)};
function Jg(a,b){return new me(null,function(){var c=H(b);if(c){var d=I(c),e=a.b?a.b(d):a.call(null,d),d=M(d,Gg(function(b,c){return function(b){return vc.a(c,a.b?a.b(b):a.call(null,b))}}(d,e,c,c),J(c)));return M(d,Jg(a,H(We(N(d),c))))}return null},null,null)}function Kg(a){return new me(null,function(){var b=H(a);return b?Lg(Qd,I(b),Gc(b)):fb(Hc,Qd.m?Qd.m():Qd.call(null))},null,null)}
function Lg(a,b,c){return M(b,new me(null,function(){var d=H(c);if(d){var e=Lg,f;f=I(d);f=a.a?a.a(b,f):a.call(null,b,f);d=e(a,f,Gc(d))}else d=null;return d},null,null))}
function Mg(a,b){return function(){function c(c,d,e){return new R(null,2,5,S,[a.c?a.c(c,d,e):a.call(null,c,d,e),b.c?b.c(c,d,e):b.call(null,c,d,e)],null)}function d(c,d){return new R(null,2,5,S,[a.a?a.a(c,d):a.call(null,c,d),b.a?b.a(c,d):b.call(null,c,d)],null)}function e(c){return new R(null,2,5,S,[a.b?a.b(c):a.call(null,c),b.b?b.b(c):b.call(null,c)],null)}function f(){return new R(null,2,5,S,[a.m?a.m():a.call(null),b.m?b.m():b.call(null)],null)}var g=null,h=function(){function c(a,b,e,f){var g=null;
if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;g=new Fc(h,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){return new R(null,2,5,S,[B.A(a,c,e,f,g),B.A(b,c,e,f,g)],null)}c.w=3;c.B=function(a){var b=I(a);a=J(a);var c=I(a);a=J(a);var e=I(a);a=Gc(a);return d(b,c,e,a)};c.h=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);
default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+3],++q;q=new Fc(r,0)}return h.h(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.B=h.B;g.m=f;g.b=e;g.a=d;g.c=c;g.h=h.h;return g}()}
function zf(a,b,c,d,e,f,g){var h=Ga;Ga=null==Ga?null:Ga-1;try{if(null!=Ga&&0>Ga)return Tb(a,"#");Tb(a,c);if(0===Na.b(f))H(g)&&Tb(a,function(){var a=Ng.b(f);return w(a)?a:"..."}());else{if(H(g)){var l=I(g);b.c?b.c(l,a,f):b.call(null,l,a,f)}for(var m=J(g),n=Na.b(f)-1;;)if(!m||null!=n&&0===n){H(m)&&0===n&&(Tb(a,d),Tb(a,function(){var a=Ng.b(f);return w(a)?a:"..."}()));break}else{Tb(a,d);var p=I(m);c=a;g=f;b.c?b.c(p,c,g):b.call(null,p,c,g);var q=J(m);c=n-1;m=q;n=c}}return Tb(a,e)}finally{Ga=h}}
function Og(a,b){for(var c=H(b),d=null,e=0,f=0;;)if(f<e){var g=d.ba(null,f);Tb(a,g);f+=1}else if(c=H(c))d=c,Cd(d)?(c=ec(d),e=fc(d),d=c,g=N(c),c=e,e=g):(g=I(d),Tb(a,g),c=J(d),d=null,e=0),f=0;else return null}var Pg={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function Qg(a){return[A('"'),A(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return Pg[a]})),A('"')].join("")}Rg;
function Sg(a,b){var c=Hd(C.a(a,La));return c?(c=null!=b?b.g&131072||b.Tc?!0:!1:!1)?null!=td(b):c:c}
function Tg(a,b,c){if(null==a)return Tb(b,"nil");if(Sg(c,a)){Tb(b,"^");var d=td(a);Af.c?Af.c(d,b,c):Af.call(null,d,b,c);Tb(b," ")}if(a.tb)return a.Pb(a,b,c);if(null!=a&&(a.g&2147483648||a.$))return a.L(null,b,c);if(!0===a||!1===a||"number"===typeof a)return Tb(b,""+A(a));if(null!=a&&a.constructor===Object)return Tb(b,"#js "),d=T.a(function(b){return new R(null,2,5,S,[le.b(b),a[b]],null)},Dd(a)),Rg.l?Rg.l(d,Af,b,c):Rg.call(null,d,Af,b,c);if(Sa(a))return zf(b,Af,"#js ["," ","]",c,a);if("string"==typeof a)return w(Ka.b(c))?
Tb(b,Qg(a)):Tb(b,a);if(ca(a)){var e=a.name;c=w(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return Og(b,G(["#object[",c,' "',""+A(a),'"]'],0))}if(a instanceof Date)return c=function(a,b){for(var c=""+A(a);;)if(N(c)<b)c=[A("0"),A(c)].join("");else return c},Og(b,G(['#inst "',""+A(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),3),"-",'00:00"'],
0));if(a instanceof RegExp)return Og(b,G(['#"',a.source,'"'],0));if(null!=a&&(a.g&2147483648||a.$))return Ub(a,b,c);if(w(a.constructor.Za))return Og(b,G(["#object[",a.constructor.Za.replace(RegExp("/","g"),"."),"]"],0));e=a.constructor.name;c=w(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return Og(b,G(["#object[",c," ",""+A(a),"]"],0))}function Af(a,b,c){var d=Ug.b(c);return w(d)?(c=Q.c(c,Vg,Tg),d.c?d.c(a,b,c):d.call(null,a,b,c)):Tg(a,b,c)}
function Wg(a,b){var c;if(ud(a))c="";else{c=A;var d=new sa;a:{var e=new mc(d);Af(I(a),e,b);for(var f=H(J(a)),g=null,h=0,l=0;;)if(l<h){var m=g.ba(null,l);Tb(e," ");Af(m,e,b);l+=1}else if(f=H(f))g=f,Cd(g)?(f=ec(g),h=fc(g),g=f,m=N(f),f=h,h=m):(m=I(g),Tb(e," "),Af(m,e,b),f=J(g),g=null,h=0),l=0;else break a}c=""+c(d)}return c}var Re=function Re(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Re.h(0<c.length?new Fc(c.slice(0),0):null)};
Re.h=function(a){return Wg(a,Ia())};Re.w=0;Re.B=function(a){return Re.h(H(a))};function Rg(a,b,c,d){return zf(c,function(a,c,d){var h=wb(a);b.c?b.c(h,c,d):b.call(null,h,c,d);Tb(c," ");a=xb(a);return b.c?b.c(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,H(a))}Ue.prototype.$=!0;Ue.prototype.L=function(a,b,c){Tb(b,"#object [cljs.core.Volatile ");Af(new v(null,1,[Xg,this.state],null),b,c);return Tb(b,"]")};Fc.prototype.$=!0;Fc.prototype.L=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};
me.prototype.$=!0;me.prototype.L=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};pg.prototype.$=!0;pg.prototype.L=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};ug.prototype.$=!0;ug.prototype.L=function(a,b,c){return zf(b,Af,"["," ","]",c,this)};Sf.prototype.$=!0;Sf.prototype.L=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};Mc.prototype.$=!0;Mc.prototype.L=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};Ad.prototype.$=!0;
Ad.prototype.L=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};ie.prototype.$=!0;ie.prototype.L=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};dd.prototype.$=!0;dd.prototype.L=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};pd.prototype.$=!0;pd.prototype.L=function(a,b,c){return Rg(this,Af,b,c)};qg.prototype.$=!0;qg.prototype.L=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};Gf.prototype.$=!0;Gf.prototype.L=function(a,b,c){return zf(b,Af,"["," ","]",c,this)};Bg.prototype.$=!0;
Bg.prototype.L=function(a,b,c){return zf(b,Af,"#{"," ","}",c,this)};zd.prototype.$=!0;zd.prototype.L=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};Pe.prototype.$=!0;Pe.prototype.L=function(a,b,c){Tb(b,"#object [cljs.core.Atom ");Af(new v(null,1,[Xg,this.state],null),b,c);return Tb(b,"]")};xg.prototype.$=!0;xg.prototype.L=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};tg.prototype.$=!0;tg.prototype.L=function(a,b,c){return zf(b,Af,"["," ","]",c,this)};R.prototype.$=!0;
R.prototype.L=function(a,b,c){return zf(b,Af,"["," ","]",c,this)};ge.prototype.$=!0;ge.prototype.L=function(a,b){return Tb(b,"()")};Ge.prototype.$=!0;Ge.prototype.L=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};v.prototype.$=!0;v.prototype.L=function(a,b,c){return Rg(this,Af,b,c)};Ig.prototype.$=!0;Ig.prototype.L=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};wg.prototype.$=!0;wg.prototype.L=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};ed.prototype.$=!0;
ed.prototype.L=function(a,b,c){return zf(b,Af,"("," ",")",c,this)};uc.prototype.Eb=!0;uc.prototype.pb=function(a,b){if(b instanceof uc)return Cc(this,b);throw Error([A("Cannot compare "),A(this),A(" to "),A(b)].join(""));};x.prototype.Eb=!0;x.prototype.pb=function(a,b){if(b instanceof x)return je(this,b);throw Error([A("Cannot compare "),A(this),A(" to "),A(b)].join(""));};Gf.prototype.Eb=!0;
Gf.prototype.pb=function(a,b){if(yd(b))return Kd(this,b);throw Error([A("Cannot compare "),A(this),A(" to "),A(b)].join(""));};R.prototype.Eb=!0;R.prototype.pb=function(a,b){if(yd(b))return Kd(this,b);throw Error([A("Cannot compare "),A(this),A(" to "),A(b)].join(""));};var Yg=null;function Zg(a){null==Yg&&(Yg=W.b?W.b(0):W.call(null,0));return Dc.b([A(a),A(Te.a(Yg,Vc))].join(""))}function $g(a){return function(b,c){var d=a.a?a.a(b,c):a.call(null,b,c);return Xc(d)?new Wc(d):d}}
function bf(a){return function(b){return function(){function c(a,c){return $a.c(b,a,c)}function d(b){return a.b?a.b(b):a.call(null,b)}function e(){return a.m?a.m():a.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.m=e;f.b=d;f.a=c;return f}()}($g(a))}ah;function bh(){}
var ch=function ch(b){if(null!=b&&null!=b.Qc)return b.Qc(b);var c=ch[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ch._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IEncodeJS.-clj-\x3ejs",b);};dh;function eh(a){return(null!=a?a.Pc||(a.ac?0:Ua(bh,a)):Ua(bh,a))?ch(a):"string"===typeof a||"number"===typeof a||a instanceof x||a instanceof uc?dh.b?dh.b(a):dh.call(null,a):Re.h(G([a],0))}
var dh=function dh(b){if(null==b)return null;if(null!=b?b.Pc||(b.ac?0:Ua(bh,b)):Ua(bh,b))return ch(b);if(b instanceof x)return $d(b);if(b instanceof uc)return""+A(b);if(xd(b)){var c={};b=H(b);for(var d=null,e=0,f=0;;)if(f<e){var g=d.ba(null,f),h=P(g,0),g=P(g,1);c[eh(h)]=dh(g);f+=1}else if(b=H(b))Cd(b)?(e=ec(b),b=fc(b),d=e,e=N(e)):(e=I(b),d=P(e,0),e=P(e,1),c[eh(d)]=dh(e),b=J(b),d=null,e=0),f=0;else break;return c}if(null==b?0:null!=b?b.g&8||b.wd||(b.g?0:Ua(eb,b)):Ua(eb,b)){c=[];b=H(T.a(dh,b));d=null;
for(f=e=0;;)if(f<e)h=d.ba(null,f),c.push(h),f+=1;else if(b=H(b))d=b,Cd(d)?(b=ec(d),f=fc(d),d=b,e=N(b),b=f):(b=I(d),c.push(b),b=J(d),d=null,e=0),f=0;else break;return c}return b},ah=function ah(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return ah.m();case 1:return ah.b(arguments[0]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};ah.m=function(){return ah.b(1)};ah.b=function(a){return Math.random()*a};ah.w=1;
function fh(){var a=1E8*Math.random();return Math.floor(a)}function gh(a,b){return xe($a.c(function(b,d){var e=a.b?a.b(d):a.call(null,d);return ze(b,e,ld.a(C.c(b,e,md),d))},Xb(V),b))}var hh=null;function ih(){if(null==hh){var a=new v(null,3,[jh,V,kh,V,lh,V],null);hh=W.b?W.b(a):W.call(null,a)}return hh}
function mh(a,b,c){var d=vc.a(b,c);if(!d&&!(d=Id(lh.b(a).call(null,b),c))&&(d=yd(c))&&(d=yd(b)))if(d=N(c)===N(b))for(var d=!0,e=0;;)if(d&&e!==N(c))d=mh(a,b.b?b.b(e):b.call(null,e),c.b?c.b(e):c.call(null,e)),e+=1;else return d;else return d;else return d}function nh(a){var b;b=ih();b=K.b?K.b(b):K.call(null,b);return Be(C.a(jh.b(b),a))}function oh(a,b,c,d){Te.a(a,function(){return K.b?K.b(b):K.call(null,b)});Te.a(c,function(){return K.b?K.b(d):K.call(null,d)})}
var ph=function ph(b,c,d){var e=(K.b?K.b(d):K.call(null,d)).call(null,b),e=w(w(e)?e.b?e.b(c):e.call(null,c):e)?!0:null;if(w(e))return e;e=function(){for(var e=nh(c);;)if(0<N(e))ph(b,I(e),d),e=Gc(e);else return null}();if(w(e))return e;e=function(){for(var e=nh(b);;)if(0<N(e))ph(I(e),c,d),e=Gc(e);else return null}();return w(e)?e:!1};function qh(a,b,c){c=ph(a,b,c);if(w(c))a=c;else{c=mh;var d;d=ih();d=K.b?K.b(d):K.call(null,d);a=c(d,a,b)}return a}
var rh=function rh(b,c,d,e,f,g,h){var l=$a.c(function(e,g){var h=P(g,0);P(g,1);if(mh(K.b?K.b(d):K.call(null,d),c,h)){var l;l=(l=null==e)?l:qh(h,I(e),f);l=w(l)?g:e;if(!w(qh(I(l),h,f)))throw Error([A("Multiple methods in multimethod '"),A(b),A("' match dispatch value: "),A(c),A(" -\x3e "),A(h),A(" and "),A(I(l)),A(", and neither is preferred")].join(""));return l}return e},null,K.b?K.b(e):K.call(null,e));if(w(l)){if(vc.a(K.b?K.b(h):K.call(null,h),K.b?K.b(d):K.call(null,d)))return Te.l(g,Q,c,jd(l)),
jd(l);oh(g,e,h,d);return rh(b,c,d,e,f,g,h)}return null};function sh(a,b){throw Error([A("No method in multimethod '"),A(a),A("' for dispatch value: "),A(b)].join(""));}function th(a,b,c,d,e,f,g,h){this.name=a;this.j=b;this.bd=c;this.Rb=d;this.Ab=e;this.od=f;this.Ub=g;this.Db=h;this.g=4194305;this.C=4352}k=th.prototype;
k.call=function(){function a(a,b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y,D,E,L,F,O){a=this;var Aa=B.h(a.j,b,c,d,e,G([f,g,h,l,m,n,p,q,r,z,u,y,D,E,L,F,O],0)),$k=uh(this,Aa);w($k)||sh(a.name,Aa);return B.h($k,b,c,d,e,G([f,g,h,l,m,n,p,q,r,z,u,y,D,E,L,F,O],0))}function b(a,b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y,D,E,L,F){a=this;var O=a.j.qa?a.j.qa(b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y,D,E,L,F):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y,D,E,L,F),Aa=uh(this,O);w(Aa)||sh(a.name,O);return Aa.qa?Aa.qa(b,c,d,e,f,g,h,l,m,n,p,q,r,
z,u,y,D,E,L,F):Aa.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y,D,E,L,F)}function c(a,b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y,D,E,L){a=this;var F=a.j.pa?a.j.pa(b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y,D,E,L):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y,D,E,L),O=uh(this,F);w(O)||sh(a.name,F);return O.pa?O.pa(b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y,D,E,L):O.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y,D,E,L)}function d(a,b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y,D,E){a=this;var L=a.j.oa?a.j.oa(b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y,D,E):a.j.call(null,
b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y,D,E),F=uh(this,L);w(F)||sh(a.name,L);return F.oa?F.oa(b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y,D,E):F.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y,D,E)}function e(a,b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y,D){a=this;var E=a.j.na?a.j.na(b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y,D):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y,D),L=uh(this,E);w(L)||sh(a.name,E);return L.na?L.na(b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y,D):L.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y,D)}function f(a,b,c,d,e,f,g,h,l,m,n,p,q,r,
z,u,y){a=this;var D=a.j.ma?a.j.ma(b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y),E=uh(this,D);w(E)||sh(a.name,D);return E.ma?E.ma(b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y):E.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y)}function g(a,b,c,d,e,f,g,h,l,m,n,p,q,r,z,u){a=this;var y=a.j.la?a.j.la(b,c,d,e,f,g,h,l,m,n,p,q,r,z,u):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,z,u),D=uh(this,y);w(D)||sh(a.name,y);return D.la?D.la(b,c,d,e,f,g,h,l,m,n,p,q,r,z,u):D.call(null,b,c,d,e,f,g,h,l,m,n,p,
q,r,z,u)}function h(a,b,c,d,e,f,g,h,l,m,n,p,q,r,z){a=this;var u=a.j.ka?a.j.ka(b,c,d,e,f,g,h,l,m,n,p,q,r,z):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,z),y=uh(this,u);w(y)||sh(a.name,u);return y.ka?y.ka(b,c,d,e,f,g,h,l,m,n,p,q,r,z):y.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,z)}function l(a,b,c,d,e,f,g,h,l,m,n,p,q,r){a=this;var z=a.j.ja?a.j.ja(b,c,d,e,f,g,h,l,m,n,p,q,r):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r),u=uh(this,z);w(u)||sh(a.name,z);return u.ja?u.ja(b,c,d,e,f,g,h,l,m,n,p,q,r):u.call(null,b,c,d,e,f,
g,h,l,m,n,p,q,r)}function m(a,b,c,d,e,f,g,h,l,m,n,p,q){a=this;var r=a.j.ia?a.j.ia(b,c,d,e,f,g,h,l,m,n,p,q):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q),z=uh(this,r);w(z)||sh(a.name,r);return z.ia?z.ia(b,c,d,e,f,g,h,l,m,n,p,q):z.call(null,b,c,d,e,f,g,h,l,m,n,p,q)}function n(a,b,c,d,e,f,g,h,l,m,n,p){a=this;var q=a.j.ha?a.j.ha(b,c,d,e,f,g,h,l,m,n,p):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p),r=uh(this,q);w(r)||sh(a.name,q);return r.ha?r.ha(b,c,d,e,f,g,h,l,m,n,p):r.call(null,b,c,d,e,f,g,h,l,m,n,p)}function p(a,b,
c,d,e,f,g,h,l,m,n){a=this;var p=a.j.ga?a.j.ga(b,c,d,e,f,g,h,l,m,n):a.j.call(null,b,c,d,e,f,g,h,l,m,n),q=uh(this,p);w(q)||sh(a.name,p);return q.ga?q.ga(b,c,d,e,f,g,h,l,m,n):q.call(null,b,c,d,e,f,g,h,l,m,n)}function q(a,b,c,d,e,f,g,h,l,m){a=this;var n=a.j.sa?a.j.sa(b,c,d,e,f,g,h,l,m):a.j.call(null,b,c,d,e,f,g,h,l,m),p=uh(this,n);w(p)||sh(a.name,n);return p.sa?p.sa(b,c,d,e,f,g,h,l,m):p.call(null,b,c,d,e,f,g,h,l,m)}function r(a,b,c,d,e,f,g,h,l){a=this;var m=a.j.ra?a.j.ra(b,c,d,e,f,g,h,l):a.j.call(null,
b,c,d,e,f,g,h,l),n=uh(this,m);w(n)||sh(a.name,m);return n.ra?n.ra(b,c,d,e,f,g,h,l):n.call(null,b,c,d,e,f,g,h,l)}function u(a,b,c,d,e,f,g,h){a=this;var l=a.j.aa?a.j.aa(b,c,d,e,f,g,h):a.j.call(null,b,c,d,e,f,g,h),m=uh(this,l);w(m)||sh(a.name,l);return m.aa?m.aa(b,c,d,e,f,g,h):m.call(null,b,c,d,e,f,g,h)}function y(a,b,c,d,e,f,g){a=this;var h=a.j.T?a.j.T(b,c,d,e,f,g):a.j.call(null,b,c,d,e,f,g),l=uh(this,h);w(l)||sh(a.name,h);return l.T?l.T(b,c,d,e,f,g):l.call(null,b,c,d,e,f,g)}function z(a,b,c,d,e,f){a=
this;var g=a.j.A?a.j.A(b,c,d,e,f):a.j.call(null,b,c,d,e,f),h=uh(this,g);w(h)||sh(a.name,g);return h.A?h.A(b,c,d,e,f):h.call(null,b,c,d,e,f)}function D(a,b,c,d,e){a=this;var f=a.j.l?a.j.l(b,c,d,e):a.j.call(null,b,c,d,e),g=uh(this,f);w(g)||sh(a.name,f);return g.l?g.l(b,c,d,e):g.call(null,b,c,d,e)}function E(a,b,c,d){a=this;var e=a.j.c?a.j.c(b,c,d):a.j.call(null,b,c,d),f=uh(this,e);w(f)||sh(a.name,e);return f.c?f.c(b,c,d):f.call(null,b,c,d)}function L(a,b,c){a=this;var d=a.j.a?a.j.a(b,c):a.j.call(null,
b,c),e=uh(this,d);w(e)||sh(a.name,d);return e.a?e.a(b,c):e.call(null,b,c)}function O(a,b){a=this;var c=a.j.b?a.j.b(b):a.j.call(null,b),d=uh(this,c);w(d)||sh(a.name,c);return d.b?d.b(b):d.call(null,b)}function Aa(a){a=this;var b=a.j.m?a.j.m():a.j.call(null),c=uh(this,b);w(c)||sh(a.name,b);return c.m?c.m():c.call(null)}var F=null,F=function(ka,F,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa,Jb,Wa,ib,jb,Bb,Jc,Bd,of){switch(arguments.length){case 1:return Aa.call(this,ka);case 2:return O.call(this,ka,F);case 3:return L.call(this,
ka,F,U);case 4:return E.call(this,ka,F,U,X);case 5:return D.call(this,ka,F,U,X,ha);case 6:return z.call(this,ka,F,U,X,ha,ia);case 7:return y.call(this,ka,F,U,X,ha,ia,ja);case 8:return u.call(this,ka,F,U,X,ha,ia,ja,la);case 9:return r.call(this,ka,F,U,X,ha,ia,ja,la,oa);case 10:return q.call(this,ka,F,U,X,ha,ia,ja,la,oa,ua);case 11:return p.call(this,ka,F,U,X,ha,ia,ja,la,oa,ua,ya);case 12:return n.call(this,ka,F,U,X,ha,ia,ja,la,oa,ua,ya,Ca);case 13:return m.call(this,ka,F,U,X,ha,ia,ja,la,oa,ua,ya,Ca,
Da);case 14:return l.call(this,ka,F,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa);case 15:return h.call(this,ka,F,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa,Jb);case 16:return g.call(this,ka,F,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa,Jb,Wa);case 17:return f.call(this,ka,F,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa,Jb,Wa,ib);case 18:return e.call(this,ka,F,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa,Jb,Wa,ib,jb);case 19:return d.call(this,ka,F,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa,Jb,Wa,ib,jb,Bb);case 20:return c.call(this,ka,F,U,X,ha,ia,ja,la,oa,
ua,ya,Ca,Da,Pa,Jb,Wa,ib,jb,Bb,Jc);case 21:return b.call(this,ka,F,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa,Jb,Wa,ib,jb,Bb,Jc,Bd);case 22:return a.call(this,ka,F,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa,Jb,Wa,ib,jb,Bb,Jc,Bd,of)}throw Error("Invalid arity: "+arguments.length);};F.b=Aa;F.a=O;F.c=L;F.l=E;F.A=D;F.T=z;F.aa=y;F.ra=u;F.sa=r;F.ga=q;F.ha=p;F.ia=n;F.ja=m;F.ka=l;F.la=h;F.ma=g;F.na=f;F.oa=e;F.pa=d;F.qa=c;F.Gb=b;F.rb=a;return F}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};
k.m=function(){var a=this.j.m?this.j.m():this.j.call(null),b=uh(this,a);w(b)||sh(this.name,a);return b.m?b.m():b.call(null)};k.b=function(a){var b=this.j.b?this.j.b(a):this.j.call(null,a),c=uh(this,b);w(c)||sh(this.name,b);return c.b?c.b(a):c.call(null,a)};k.a=function(a,b){var c=this.j.a?this.j.a(a,b):this.j.call(null,a,b),d=uh(this,c);w(d)||sh(this.name,c);return d.a?d.a(a,b):d.call(null,a,b)};
k.c=function(a,b,c){var d=this.j.c?this.j.c(a,b,c):this.j.call(null,a,b,c),e=uh(this,d);w(e)||sh(this.name,d);return e.c?e.c(a,b,c):e.call(null,a,b,c)};k.l=function(a,b,c,d){var e=this.j.l?this.j.l(a,b,c,d):this.j.call(null,a,b,c,d),f=uh(this,e);w(f)||sh(this.name,e);return f.l?f.l(a,b,c,d):f.call(null,a,b,c,d)};k.A=function(a,b,c,d,e){var f=this.j.A?this.j.A(a,b,c,d,e):this.j.call(null,a,b,c,d,e),g=uh(this,f);w(g)||sh(this.name,f);return g.A?g.A(a,b,c,d,e):g.call(null,a,b,c,d,e)};
k.T=function(a,b,c,d,e,f){var g=this.j.T?this.j.T(a,b,c,d,e,f):this.j.call(null,a,b,c,d,e,f),h=uh(this,g);w(h)||sh(this.name,g);return h.T?h.T(a,b,c,d,e,f):h.call(null,a,b,c,d,e,f)};k.aa=function(a,b,c,d,e,f,g){var h=this.j.aa?this.j.aa(a,b,c,d,e,f,g):this.j.call(null,a,b,c,d,e,f,g),l=uh(this,h);w(l)||sh(this.name,h);return l.aa?l.aa(a,b,c,d,e,f,g):l.call(null,a,b,c,d,e,f,g)};
k.ra=function(a,b,c,d,e,f,g,h){var l=this.j.ra?this.j.ra(a,b,c,d,e,f,g,h):this.j.call(null,a,b,c,d,e,f,g,h),m=uh(this,l);w(m)||sh(this.name,l);return m.ra?m.ra(a,b,c,d,e,f,g,h):m.call(null,a,b,c,d,e,f,g,h)};k.sa=function(a,b,c,d,e,f,g,h,l){var m=this.j.sa?this.j.sa(a,b,c,d,e,f,g,h,l):this.j.call(null,a,b,c,d,e,f,g,h,l),n=uh(this,m);w(n)||sh(this.name,m);return n.sa?n.sa(a,b,c,d,e,f,g,h,l):n.call(null,a,b,c,d,e,f,g,h,l)};
k.ga=function(a,b,c,d,e,f,g,h,l,m){var n=this.j.ga?this.j.ga(a,b,c,d,e,f,g,h,l,m):this.j.call(null,a,b,c,d,e,f,g,h,l,m),p=uh(this,n);w(p)||sh(this.name,n);return p.ga?p.ga(a,b,c,d,e,f,g,h,l,m):p.call(null,a,b,c,d,e,f,g,h,l,m)};k.ha=function(a,b,c,d,e,f,g,h,l,m,n){var p=this.j.ha?this.j.ha(a,b,c,d,e,f,g,h,l,m,n):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n),q=uh(this,p);w(q)||sh(this.name,p);return q.ha?q.ha(a,b,c,d,e,f,g,h,l,m,n):q.call(null,a,b,c,d,e,f,g,h,l,m,n)};
k.ia=function(a,b,c,d,e,f,g,h,l,m,n,p){var q=this.j.ia?this.j.ia(a,b,c,d,e,f,g,h,l,m,n,p):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p),r=uh(this,q);w(r)||sh(this.name,q);return r.ia?r.ia(a,b,c,d,e,f,g,h,l,m,n,p):r.call(null,a,b,c,d,e,f,g,h,l,m,n,p)};k.ja=function(a,b,c,d,e,f,g,h,l,m,n,p,q){var r=this.j.ja?this.j.ja(a,b,c,d,e,f,g,h,l,m,n,p,q):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q),u=uh(this,r);w(u)||sh(this.name,r);return u.ja?u.ja(a,b,c,d,e,f,g,h,l,m,n,p,q):u.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q)};
k.ka=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){var u=this.j.ka?this.j.ka(a,b,c,d,e,f,g,h,l,m,n,p,q,r):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r),y=uh(this,u);w(y)||sh(this.name,u);return y.ka?y.ka(a,b,c,d,e,f,g,h,l,m,n,p,q,r):y.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r)};
k.la=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u){var y=this.j.la?this.j.la(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u),z=uh(this,y);w(z)||sh(this.name,y);return z.la?z.la(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u):z.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u)};
k.ma=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y){var z=this.j.ma?this.j.ma(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y),D=uh(this,z);w(D)||sh(this.name,z);return D.ma?D.ma(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y):D.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y)};
k.na=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z){var D=this.j.na?this.j.na(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z),E=uh(this,D);w(E)||sh(this.name,D);return E.na?E.na(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z):E.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z)};
k.oa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D){var E=this.j.oa?this.j.oa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D),L=uh(this,E);w(L)||sh(this.name,E);return L.oa?L.oa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D):L.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D)};
k.pa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E){var L=this.j.pa?this.j.pa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E),O=uh(this,L);w(O)||sh(this.name,L);return O.pa?O.pa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E):O.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E)};
k.qa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E,L){var O=this.j.qa?this.j.qa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E,L):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E,L),Aa=uh(this,O);w(Aa)||sh(this.name,O);return Aa.qa?Aa.qa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E,L):Aa.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E,L)};
k.Gb=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E,L,O){var Aa=B.h(this.j,a,b,c,d,G([e,f,g,h,l,m,n,p,q,r,u,y,z,D,E,L,O],0)),F=uh(this,Aa);w(F)||sh(this.name,Aa);return B.h(F,a,b,c,d,G([e,f,g,h,l,m,n,p,q,r,u,y,z,D,E,L,O],0))};function vh(a,b,c){Te.l(a.Ab,Q,b,c);oh(a.Ub,a.Ab,a.Db,a.Rb)}
function uh(a,b){vc.a(K.b?K.b(a.Db):K.call(null,a.Db),K.b?K.b(a.Rb):K.call(null,a.Rb))||oh(a.Ub,a.Ab,a.Db,a.Rb);var c=(K.b?K.b(a.Ub):K.call(null,a.Ub)).call(null,b);if(w(c))return c;c=rh(a.name,b,a.Rb,a.Ab,a.od,a.Ub,a.Db);return w(c)?c:(K.b?K.b(a.Ab):K.call(null,a.Ab)).call(null,a.bd)}k.Kb=function(){return hc(this.name)};k.Lb=function(){return ic(this.name)};k.S=function(){return da(this)};var wh=new x(null,"rng","rng",1082666016),xh=new x(null,"y","y",-1757859776),yh=new x(null,"text-anchor","text-anchor",585613696),zh=new x(null,"path","path",-188191168),Ah=new x(null,"penny-spacing","penny-spacing",-20780703),Bh=new x(null,"supplier","supplier",18255489),Ch=new x(null,"determine-capacity","determine-capacity",-452765887),Dh=new x(null,"by-station","by-station",516084641),Eh=new x(null,"selector","selector",762528866),Fh=new x(null,"r","r",-471384190),Gh=new x(null,"hr","hr",1377740067),
Hh=new x(null,"stroke","stroke",1741823555),Ih=new x(null,"run","run",-1821166653),Jh=new x(null,"generate-new","generate-new",-1613885469),Kh=new x(null,"richpath","richpath",-150197948),Lh=new x(null,"turns","turns",-1118736892),Mh=new x(null,"transform","transform",1381301764),Nh=new x(null,"die","die",-547192252),La=new x(null,"meta","meta",1499536964),Oh=new x(null,"patternUnits","patternUnits",-1458803100),Ph=new x(null,"transformer","transformer",-1493470620),Qh=new x(null,"dx","dx",-381796732),
Rh=new x(null,"executors","executors",-331073403),Ma=new x(null,"dup","dup",556298533),Sh=new x(null,"intaking","intaking",-1009888859),Th=new x(null,"running?","running?",-257884763),Uh=new x(null,"processing","processing",-1576405467),Vh=new x(null,"key","key",-1516042587),Wh=new x(null,"stats-history","stats-history",636123973),Xh=new x(null,"spout-y","spout-y",1676697606),Yh=new x(null,"stations","stations",-19744730),Zh=new x(null,"capacity","capacity",72689734),$h=new x(null,"disabled","disabled",
-1529784218),ai=new x(null,"private","private",-558947994),bi=new x(null,"efficient","efficient",-63016538),ci=new x(null,"graphs?","graphs?",-270895578),di=new x(null,"transform*","transform*",-1613794522),ei=new x(null,"reset","reset",-800929946),fi=new x(null,"button","button",1456579943),gi=new x(null,"top","top",-1856271961),hi=new uc(null,"rng","rng",-1571769753,null),Qe=new x(null,"validator","validator",-1966190681),ii=new x(null,"total-utilization","total-utilization",-1341502521),ji=new x(null,
"use","use",-1846382424),ki=new x(null,"default","default",-1987822328),li=new x(null,"finally-block","finally-block",832982472),mi=new x(null,"name","name",1843675177),ni=new x(null,"scenarios","scenarios",1618559369),oi=new x(null,"formatter","formatter",-483008823),pi=new x(null,"fill","fill",883462889),qi=new x(null,"value","value",305978217),ri=new x(null,"section","section",-300141526),si=new x(null,"circle","circle",1903212362),ti=new x(null,"y1","y1",589123466),ui=new x(null,"drop","drop",
364481611),vi=new x(null,"tracer","tracer",-1844475765),wi=new x(null,"width","width",-384071477),xi=new x(null,"supply","supply",-1701696309),yi=new x(null,"spath","spath",-1857758005),zi=new x(null,"source-spout-y","source-spout-y",1447094571),Ai=new x(null,"onclick","onclick",1297553739),Bi=new x(null,"dy","dy",1719547243),Ci=new x(null,"penny","penny",1653999051),Di=new x(null,"params","params",710516235),Ei=new x(null,"total-output","total-output",1149740747),Fi=new x(null,"easing","easing",
735372043),Xg=new x(null,"val","val",128701612),Gi=new x(null,"delivery","delivery",-1844470516),Hi=new x(null,"recur","recur",-437573268),Ii=new x(null,"type","type",1174270348),Ji=new x(null,"catch-block","catch-block",1175212748),Ki=new x(null,"duration","duration",1444101068),Li=new x(null,"execute","execute",-129499188),Mi=new x(null,"delivered","delivered",474109932),Ni=new x(null,"constrained","constrained",597287981),Oi=new x(null,"intaking?","intaking?",834765),Vg=new x(null,"fallback-impl",
"fallback-impl",-1501286995),Pi=new x(null,"output","output",-1105869043),Qi=new x(null,"original-setup","original-setup",2029721421),Ja=new x(null,"flush-on-newline","flush-on-newline",-151457939),Ri=new x(null,"normal","normal",-1519123858),Si=new x(null,"wip","wip",-103467282),Ti=new x(null,"averages","averages",-1747836978),Ui=new x(null,"seed","seed",68613327),Vi=new x(null,"className","className",-1983287057),kh=new x(null,"descendants","descendants",1824886031),Wi=new x(null,"size","size",
1098693007),Xi=new x(null,"accessor","accessor",-25476721),Yi=new x(null,"title","title",636505583),Zi=new x(null,"running","running",1554969103),$i=new uc(null,"folder","folder",-1138554033,null),aj=new x(null,"num-needed-params","num-needed-params",-1219326097),bj=new x(null,"dropping","dropping",125809647),cj=new x(null,"high","high",2027297808),dj=new x(null,"setup","setup",1987730512),lh=new x(null,"ancestors","ancestors",-776045424),ej=new x(null,"style","style",-496642736),fj=new x(null,"div",
"div",1057191632),Ka=new x(null,"readably","readably",1129599760),gj=new x(null,"params-idx","params-idx",340984624),hj=new uc(null,"box","box",-1123515375,null),Ng=new x(null,"more-marker","more-marker",-14717935),ij=new x(null,"percent-utilization","percent-utilization",-2006109103),jj=new x(null,"g","g",1738089905),kj=new x(null,"update-stats","update-stats",1938193073),lj=new x(null,"info?","info?",361925553),mj=new x(null,"transfer-to-next-station","transfer-to-next-station",-114193262),nj=new x(null,
"set-spacing","set-spacing",1920968978),oj=new x(null,"intake","intake",-108984782),pj=new uc(null,"coll","coll",-1006698606,null),qj=new x(null,"line","line",212345235),rj=new x(null,"stroke-width","stroke-width",716836435),sj=new uc(null,"val","val",1769233139,null),tj=new uc(null,"xf","xf",2042434515,null),Na=new x(null,"print-length","print-length",1931866356),uj=new x(null,"select*","select*",-1829914060),vj=new x(null,"cx","cx",1272694324),wj=new x(null,"id","id",-1388402092),xj=new x(null,
"class","class",-2030961996),yj=new x(null,"cy","cy",755331060),zj=new x(null,"catch-exception","catch-exception",-1997306795),Aj=new x(null,"total-input","total-input",1219129557),Bj=new x(null,"defs","defs",1398449717),jh=new x(null,"parents","parents",-2027538891),Cj=new x(null,"collect-val","collect-val",801894069),Dj=new x(null,"xlink:href","xlink:href",828777205),Ej=new x(null,"toggle-scenario","toggle-scenario",-1166476555),Fj=new x(null,"prev","prev",-1597069226),Gj=new x(null,"svg","svg",
856789142),Hj=new x(null,"info","info",-317069002),Ij=new x(null,"bin-h","bin-h",346004918),Jj=new x(null,"length","length",588987862),Kj=new x(null,"continue-block","continue-block",-1852047850),Lj=new x(null,"hookTransition","hookTransition",-1045887913),Mj=new x(null,"tracer-reset","tracer-reset",283192087),Nj=new x(null,"distribution","distribution",-284555369),Oj=new x(null,"transfer-to-processed","transfer-to-processed",198231991),Pj=new x(null,"roll","roll",11266999),Qj=new x(null,"position",
"position",-2011731912),Rj=new x(null,"graphs","graphs",-1584479112),Sj=new uc("rng","rand-int","rng/rand-int",-495400840,null),Tj=new x(null,"basic","basic",1043717368),Uj=new x(null,"image","image",-58725096),Vj=new x(null,"d","d",1972142424),Wj=new x(null,"average","average",-492356168),Xj=new x(null,"dropping?","dropping?",-1065207176),Yj=new x(null,"processed","processed",800622264),Zj=new x(null,"x","x",2099068185),ak=new x(null,"run-next","run-next",1110241561),bk=new x(null,"x1","x1",-1863922247),
ck=new x(null,"tracer-start","tracer-start",1036491225),dk=new x(null,"rerender","rerender",-1601192263),ek=new uc(null,"inc","inc",324505433,null),fk=new x(null,"domain","domain",1847214937),gk=new x(null,"transform-fns","transform-fns",669042649),hk=new x(null,"bottleneck?","bottleneck?",241100890),Fe=new uc(null,"quote","quote",1377916282,null),ik=new x(null,"fixed","fixed",-562004358),Ee=new x(null,"arglists","arglists",1661989754),jk=new x(null,"dice","dice",707777434),kk=new x(null,"y2","y2",
-718691301),lk=new x(null,"set-lengths","set-lengths",742672507),De=new uc(null,"nil-iter","nil-iter",1101030523,null),mk=new x(null,"main","main",-2117802661),nk=new x(null,"hierarchy","hierarchy",-1053470341),Ug=new x(null,"alt-impl","alt-impl",670969595),ok=new x(null,"under-utilized","under-utilized",-524567781),pk=new x(null,"scenario","scenario",-316635333),qk=new uc(null,"fn-handler","fn-handler",648785851,null),rk=new x(null,"doc","doc",1913296891),sk=new x(null,"integrate","integrate",-1653689604),
tk=new x(null,"rect","rect",-108902628),uk=new x(null,"step","step",1288888124),vk=new x(null,"delay","delay",-574225219),wk=new x(null,"stats","stats",-85643011),xk=new x(null,"x2","x2",-1362513475),yk=new x(null,"pennies","pennies",1847043709),zk=new x(null,"incoming","incoming",-1710131427),Ak=new x(null,"productivity","productivity",-890721314),Bk=new x(null,"range","range",1639692286),Ck=new x(null,"height","height",1025178622),Dk=new x(null,"spacing","spacing",204422175),Ek=new x(null,"left",
"left",-399115937),Fk=new x(null,"pattern","pattern",242135423),Gk=new x(null,"foreignObject","foreignObject",25502111),Hk=new x(null,"text","text",-1790561697),Ik=new x(null,"span","span",1394872991),Jk=new x(null,"data","data",-232669377),Kk=new uc(null,"f","f",43394975,null);var Lk;function Mk(a){return a.m?a.m():a.call(null)}function Nk(a,b,c){return xd(c)?Kb(c,a,b):null==c?b:Sa(c)?ad(c,a,b):Ib.c(c,a,b)}
var Ok=function Ok(b,c,d,e){if(null!=b&&null!=b.lc)return b.lc(b,c,d,e);var f=Ok[t(null==b?null:b)];if(null!=f)return f.l?f.l(b,c,d,e):f.call(null,b,c,d,e);f=Ok._;if(null!=f)return f.l?f.l(b,c,d,e):f.call(null,b,c,d,e);throw Va("CollFold.coll-fold",b);},Pk=function Pk(b,c){"undefined"===typeof Lk&&(Lk=function(b,c,f,g){this.dd=b;this.bc=c;this.Wa=f;this.gd=g;this.g=917504;this.C=0},Lk.prototype.R=function(b,c){return new Lk(this.dd,this.bc,this.Wa,c)},Lk.prototype.P=function(){return this.gd},Lk.prototype.ea=
function(b,c){return Ib.c(this.bc,this.Wa.b?this.Wa.b(c):this.Wa.call(null,c),c.m?c.m():c.call(null))},Lk.prototype.fa=function(b,c,f){return Ib.c(this.bc,this.Wa.b?this.Wa.b(c):this.Wa.call(null,c),f)},Lk.prototype.lc=function(b,c,f,g){return Ok(this.bc,c,f,this.Wa.b?this.Wa.b(g):this.Wa.call(null,g))},Lk.ec=function(){return new R(null,4,5,S,[Uc($i,new v(null,2,[Ee,tc(Fe,tc(new R(null,2,5,S,[pj,tj],null))),rk,"Given a foldable collection, and a transformation function xf,\n  returns a foldable collection, where any supplied reducing\n  fn will be transformed by xf. xf is a function of reducing fn to\n  reducing fn."],
null)),pj,tj,xa.Dd],null)},Lk.tb=!0,Lk.Za="clojure.core.reducers/t_clojure$core$reducers19049",Lk.Pb=function(b,c){return Tb(c,"clojure.core.reducers/t_clojure$core$reducers19049")});return new Lk(Pk,b,c,V)};
function Qk(a,b){return Pk(b,function(b){return function(){function d(d,e,f){e=a.a?a.a(e,f):a.call(null,e,f);return b.a?b.a(d,e):b.call(null,d,e)}function e(d,e){var f=a.b?a.b(e):a.call(null,e);return b.a?b.a(d,f):b.call(null,d,f)}function f(){return b.m?b.m():b.call(null)}var g=null,g=function(a,b,c){switch(arguments.length){case 0:return f.call(this);case 2:return e.call(this,a,b);case 3:return d.call(this,a,b,c)}throw Error("Invalid arity: "+arguments.length);};g.m=f;g.a=e;g.c=d;return g}()})}
function Rk(a,b){return Pk(b,function(b){return function(){function d(d,e,f){return Nk(b,d,a.a?a.a(e,f):a.call(null,e,f))}function e(d,e){return Nk(b,d,a.b?a.b(e):a.call(null,e))}function f(){return b.m?b.m():b.call(null)}var g=null,g=function(a,b,c){switch(arguments.length){case 0:return f.call(this);case 2:return e.call(this,a,b);case 3:return d.call(this,a,b,c)}throw Error("Invalid arity: "+arguments.length);};g.m=f;g.a=e;g.c=d;return g}()})}
var Sk=function Sk(b,c,d,e){if(ud(b))return d.m?d.m():d.call(null);if(N(b)<=c)return Nk(e,d.m?d.m():d.call(null),b);var f=Xd(N(b)),g=Ef.c(b,0,f);b=Ef.c(b,f,N(b));return Mk(function(b,c,e,f){return function(){var b=f(c),g;g=f(e);b=b.m?b.m():b.call(null);g=g.m?g.m():g.call(null);return d.a?d.a(b,g):d.call(null,b,g)}}(f,g,b,function(b,f,g){return function(n){return function(){return function(){return Sk(n,c,d,e)}}(b,f,g)}}(f,g,b)))};Ok["null"]=function(a,b,c){return c.m?c.m():c.call(null)};
Ok.object=function(a,b,c,d){return Nk(d,c.m?c.m():c.call(null),a)};R.prototype.lc=function(a,b,c,d){return Sk(this,b,c,d)};function Tk(){}
var Uk=function Uk(b,c,d){if(null!=b&&null!=b.vb)return b.vb(b,c,d);var e=Uk[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Uk._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Va("StructurePath.select*",b);},Vk=function Vk(b,c,d){if(null!=b&&null!=b.wb)return b.wb(b,c,d);var e=Vk[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Vk._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Va("StructurePath.transform*",b);};
function Wk(){}var Xk=function Xk(b,c){if(null!=b&&null!=b.mc)return b.mc(0,c);var d=Xk[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Xk._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("Collector.collect-val",b);};var Yk=function Yk(b){if(null!=b&&null!=b.Cc)return b.Cc();var c=Yk[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Yk._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("PathComposer.comp-paths*",b);};function Zk(a,b,c){this.type=a;this.rd=b;this.td=c}var al;
al=new Zk(Kh,function(a,b,c,d){var e=function(){return function(a,b,c,d){return ud(c)?new R(null,1,5,S,[d],null):new R(null,1,5,S,[ld.a(c,d)],null)}}(a,b,md,d);return c.A?c.A(a,b,md,d,e):c.call(null,a,b,md,d,e)},function(a,b,c,d,e){var f=function(){return function(a,b,c,e){return ud(c)?d.b?d.b(e):d.call(null,e):B.a(d,ld.a(c,e))}}(a,b,md,e);return c.A?c.A(a,b,md,e,f):c.call(null,a,b,md,e,f)});var bl;
bl=new Zk(yi,function(a,b,c,d){a=function(){return function(a){return new R(null,1,5,S,[a],null)}}(d);return c.a?c.a(d,a):c.call(null,d,a)},function(a,b,c,d,e){return c.a?c.a(e,d):c.call(null,e,d)});function cl(a,b,c,d,e,f){this.Ka=a;this.La=b;this.Ma=c;this.da=d;this.M=e;this.u=f;this.g=2229667594;this.C=8192}k=cl.prototype;k.N=function(a,b){return pb.c(this,b,null)};
k.I=function(a,b,c){switch(b instanceof x?b.Ia:null){case "executors":return this.Ka;case "selector":return this.La;case "transformer":return this.Ma;default:return C.c(this.M,b,c)}};k.L=function(a,b,c){return zf(b,function(){return function(a){return zf(b,Af,""," ","",c,a)}}(this),"#com.rpl.specter.impl.TransformFunctions{",", ","}",c,we.a(new R(null,3,5,S,[new R(null,2,5,S,[Rh,this.Ka],null),new R(null,2,5,S,[Eh,this.La],null),new R(null,2,5,S,[Ph,this.Ma],null)],null),this.M))};
k.Ha=function(){return new Mf(0,this,3,new R(null,3,5,S,[Rh,Eh,Ph],null),lc(this.M))};k.P=function(){return this.da};k.Z=function(){return 3+N(this.M)};k.S=function(){var a=this.u;return null!=a?a:this.u=a=ce(this)};k.D=function(a,b){var c;c=w(b)?(c=this.constructor===b.constructor)?Lf(this,b):c:b;return w(c)?!0:!1};
k.sb=function(a,b){return Id(new Bg(null,new v(null,3,[Eh,null,Ph,null,Rh,null],null),null),b)?rd.a(Uc(ff.a(V,this),this.da),b):new cl(this.Ka,this.La,this.Ma,this.da,Be(rd.a(this.M,b)),null)};
k.Ra=function(a,b,c){return w(ke.a?ke.a(Rh,b):ke.call(null,Rh,b))?new cl(c,this.La,this.Ma,this.da,this.M,null):w(ke.a?ke.a(Eh,b):ke.call(null,Eh,b))?new cl(this.Ka,c,this.Ma,this.da,this.M,null):w(ke.a?ke.a(Ph,b):ke.call(null,Ph,b))?new cl(this.Ka,this.La,c,this.da,this.M,null):new cl(this.Ka,this.La,this.Ma,this.da,Q.c(this.M,b,c),null)};
k.U=function(){return H(we.a(new R(null,3,5,S,[new R(null,2,5,S,[Rh,this.Ka],null),new R(null,2,5,S,[Eh,this.La],null),new R(null,2,5,S,[Ph,this.Ma],null)],null),this.M))};k.R=function(a,b){return new cl(this.Ka,this.La,this.Ma,b,this.M,this.u)};k.X=function(a,b){return yd(b)?sb(this,hb.a(b,0),hb.a(b,1)):$a.c(fb,this,b)};function dl(a,b,c){return new cl(a,b,c,null,null,null)}function el(a,b,c,d,e,f){this.va=a;this.Ta=b;this.Ua=c;this.da=d;this.M=e;this.u=f;this.g=2229667594;this.C=8192}k=el.prototype;
k.N=function(a,b){return pb.c(this,b,null)};k.I=function(a,b,c){switch(b instanceof x?b.Ia:null){case "transform-fns":return this.va;case "params":return this.Ta;case "params-idx":return this.Ua;default:return C.c(this.M,b,c)}};
k.L=function(a,b,c){return zf(b,function(){return function(a){return zf(b,Af,""," ","",c,a)}}(this),"#com.rpl.specter.impl.CompiledPath{",", ","}",c,we.a(new R(null,3,5,S,[new R(null,2,5,S,[gk,this.va],null),new R(null,2,5,S,[Di,this.Ta],null),new R(null,2,5,S,[gj,this.Ua],null)],null),this.M))};k.Ha=function(){return new Mf(0,this,3,new R(null,3,5,S,[gk,Di,gj],null),lc(this.M))};k.P=function(){return this.da};k.Z=function(){return 3+N(this.M)};
k.S=function(){var a=this.u;return null!=a?a:this.u=a=ce(this)};k.D=function(a,b){var c;c=w(b)?(c=this.constructor===b.constructor)?Lf(this,b):c:b;return w(c)?!0:!1};k.sb=function(a,b){return Id(new Bg(null,new v(null,3,[Di,null,gj,null,gk,null],null),null),b)?rd.a(Uc(ff.a(V,this),this.da),b):new el(this.va,this.Ta,this.Ua,this.da,Be(rd.a(this.M,b)),null)};
k.Ra=function(a,b,c){return w(ke.a?ke.a(gk,b):ke.call(null,gk,b))?new el(c,this.Ta,this.Ua,this.da,this.M,null):w(ke.a?ke.a(Di,b):ke.call(null,Di,b))?new el(this.va,c,this.Ua,this.da,this.M,null):w(ke.a?ke.a(gj,b):ke.call(null,gj,b))?new el(this.va,this.Ta,c,this.da,this.M,null):new el(this.va,this.Ta,this.Ua,this.da,Q.c(this.M,b,c),null)};
k.U=function(){return H(we.a(new R(null,3,5,S,[new R(null,2,5,S,[gk,this.va],null),new R(null,2,5,S,[Di,this.Ta],null),new R(null,2,5,S,[gj,this.Ua],null)],null),this.M))};k.R=function(a,b){return new el(this.va,this.Ta,this.Ua,b,this.M,this.u)};k.X=function(a,b){return yd(b)?sb(this,hb.a(b,0),hb.a(b,1)):$a.c(fb,this,b)};function fl(a){return new el(a,null,0,null,null,null)}Y;function gl(a,b,c,d,e){this.va=a;this.mb=b;this.da=c;this.M=d;this.u=e;this.g=2229667595;this.C=8192}k=gl.prototype;
k.N=function(a,b){return pb.c(this,b,null)};k.I=function(a,b,c){switch(b instanceof x?b.Ia:null){case "transform-fns":return this.va;case "num-needed-params":return this.mb;default:return C.c(this.M,b,c)}};k.L=function(a,b,c){return zf(b,function(){return function(a){return zf(b,Af,""," ","",c,a)}}(this),"#com.rpl.specter.impl.ParamsNeededPath{",", ","}",c,we.a(new R(null,2,5,S,[new R(null,2,5,S,[gk,this.va],null),new R(null,2,5,S,[aj,this.mb],null)],null),this.M))};
k.Ha=function(){return new Mf(0,this,2,new R(null,2,5,S,[gk,aj],null),lc(this.M))};
k.call=function(){function a(a,b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y,D,E,F,L,O){a=te(we.a(new R(null,20,5,S,[b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y,D,E,F,L],null),O));return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function b(a,b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y,D,E,F,L){a=te(20);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=z;a[14]=u;a[15]=y;a[16]=D;a[17]=E;a[18]=F;a[19]=L;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function c(a,b,c,d,e,f,g,h,l,m,n,p,q,r,z,
u,y,D,E,F){a=te(19);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=z;a[14]=u;a[15]=y;a[16]=D;a[17]=E;a[18]=F;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function d(a,b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y,D,E){a=te(18);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=z;a[14]=u;a[15]=y;a[16]=D;a[17]=E;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function e(a,b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y,D){a=te(17);
a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=z;a[14]=u;a[15]=y;a[16]=D;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function f(a,b,c,d,e,f,g,h,l,m,n,p,q,r,z,u,y){a=te(16);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=z;a[14]=u;a[15]=y;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function g(a,b,c,d,e,f,g,h,l,m,n,p,q,r,z,u){a=te(15);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;
a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=z;a[14]=u;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function h(a,b,c,d,e,f,g,h,l,m,n,p,q,r,z){a=te(14);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=z;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function l(a,b,c,d,e,f,g,h,l,m,n,p,q,r){a=te(13);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function m(a,
b,c,d,e,f,g,h,l,m,n,p,q){a=te(12);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function n(a,b,c,d,e,f,g,h,l,m,n,p){a=te(11);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function p(a,b,c,d,e,f,g,h,l,m,n){a=te(10);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function q(a,
b,c,d,e,f,g,h,l,m){a=te(9);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function r(a,b,c,d,e,f,g,h,l){a=te(8);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function u(a,b,c,d,e,f,g,h){a=te(7);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function y(a,b,c,d,e,f,g){a=te(6);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;return Y.c?Y.c(this,
a,0):Y.call(null,this,a,0)}function z(a,b,c,d,e,f){a=te(5);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function D(a,b,c,d,e){a=te(4);a[0]=b;a[1]=c;a[2]=d;a[3]=e;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function E(a,b,c,d){a=te(3);a[0]=b;a[1]=c;a[2]=d;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function L(a,b,c){a=te(2);a[0]=b;a[1]=c;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function O(a,b){var c=te(1);c[0]=b;return Y.c?Y.c(this,c,0):Y.call(null,
this,c,0)}function Aa(){var a=te(0);return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}var F=null,F=function(F,na,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa,Jb,Wa,ib,jb,Bb,Jc,Bd,of){switch(arguments.length){case 1:return Aa.call(this);case 2:return O.call(this,0,na);case 3:return L.call(this,0,na,U);case 4:return E.call(this,0,na,U,X);case 5:return D.call(this,0,na,U,X,ha);case 6:return z.call(this,0,na,U,X,ha,ia);case 7:return y.call(this,0,na,U,X,ha,ia,ja);case 8:return u.call(this,0,na,U,X,ha,ia,ja,la);case 9:return r.call(this,
0,na,U,X,ha,ia,ja,la,oa);case 10:return q.call(this,0,na,U,X,ha,ia,ja,la,oa,ua);case 11:return p.call(this,0,na,U,X,ha,ia,ja,la,oa,ua,ya);case 12:return n.call(this,0,na,U,X,ha,ia,ja,la,oa,ua,ya,Ca);case 13:return m.call(this,0,na,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da);case 14:return l.call(this,0,na,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa);case 15:return h.call(this,0,na,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa,Jb);case 16:return g.call(this,0,na,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa,Jb,Wa);case 17:return f.call(this,0,
na,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa,Jb,Wa,ib);case 18:return e.call(this,0,na,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa,Jb,Wa,ib,jb);case 19:return d.call(this,0,na,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa,Jb,Wa,ib,jb,Bb);case 20:return c.call(this,0,na,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa,Jb,Wa,ib,jb,Bb,Jc);case 21:return b.call(this,0,na,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa,Jb,Wa,ib,jb,Bb,Jc,Bd);case 22:return a.call(this,0,na,U,X,ha,ia,ja,la,oa,ua,ya,Ca,Da,Pa,Jb,Wa,ib,jb,Bb,Jc,Bd,of)}throw Error("Invalid arity: "+
arguments.length);};F.b=Aa;F.a=O;F.c=L;F.l=E;F.A=D;F.T=z;F.aa=y;F.ra=u;F.sa=r;F.ga=q;F.ha=p;F.ia=n;F.ja=m;F.ka=l;F.la=h;F.ma=g;F.na=f;F.oa=e;F.pa=d;F.qa=c;F.Gb=b;F.rb=a;return F}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.m=function(){var a=te(0);return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)};k.b=function(a){var b=te(1);b[0]=a;return Y.c?Y.c(this,b,0):Y.call(null,this,b,0)};k.a=function(a,b){var c=te(2);c[0]=a;c[1]=b;return Y.c?Y.c(this,c,0):Y.call(null,this,c,0)};
k.c=function(a,b,c){var d=te(3);d[0]=a;d[1]=b;d[2]=c;return Y.c?Y.c(this,d,0):Y.call(null,this,d,0)};k.l=function(a,b,c,d){var e=te(4);e[0]=a;e[1]=b;e[2]=c;e[3]=d;return Y.c?Y.c(this,e,0):Y.call(null,this,e,0)};k.A=function(a,b,c,d,e){var f=te(5);f[0]=a;f[1]=b;f[2]=c;f[3]=d;f[4]=e;return Y.c?Y.c(this,f,0):Y.call(null,this,f,0)};k.T=function(a,b,c,d,e,f){var g=te(6);g[0]=a;g[1]=b;g[2]=c;g[3]=d;g[4]=e;g[5]=f;return Y.c?Y.c(this,g,0):Y.call(null,this,g,0)};
k.aa=function(a,b,c,d,e,f,g){var h=te(7);h[0]=a;h[1]=b;h[2]=c;h[3]=d;h[4]=e;h[5]=f;h[6]=g;return Y.c?Y.c(this,h,0):Y.call(null,this,h,0)};k.ra=function(a,b,c,d,e,f,g,h){var l=te(8);l[0]=a;l[1]=b;l[2]=c;l[3]=d;l[4]=e;l[5]=f;l[6]=g;l[7]=h;return Y.c?Y.c(this,l,0):Y.call(null,this,l,0)};k.sa=function(a,b,c,d,e,f,g,h,l){var m=te(9);m[0]=a;m[1]=b;m[2]=c;m[3]=d;m[4]=e;m[5]=f;m[6]=g;m[7]=h;m[8]=l;return Y.c?Y.c(this,m,0):Y.call(null,this,m,0)};
k.ga=function(a,b,c,d,e,f,g,h,l,m){var n=te(10);n[0]=a;n[1]=b;n[2]=c;n[3]=d;n[4]=e;n[5]=f;n[6]=g;n[7]=h;n[8]=l;n[9]=m;return Y.c?Y.c(this,n,0):Y.call(null,this,n,0)};k.ha=function(a,b,c,d,e,f,g,h,l,m,n){var p=te(11);p[0]=a;p[1]=b;p[2]=c;p[3]=d;p[4]=e;p[5]=f;p[6]=g;p[7]=h;p[8]=l;p[9]=m;p[10]=n;return Y.c?Y.c(this,p,0):Y.call(null,this,p,0)};
k.ia=function(a,b,c,d,e,f,g,h,l,m,n,p){var q=te(12);q[0]=a;q[1]=b;q[2]=c;q[3]=d;q[4]=e;q[5]=f;q[6]=g;q[7]=h;q[8]=l;q[9]=m;q[10]=n;q[11]=p;return Y.c?Y.c(this,q,0):Y.call(null,this,q,0)};k.ja=function(a,b,c,d,e,f,g,h,l,m,n,p,q){var r=te(13);r[0]=a;r[1]=b;r[2]=c;r[3]=d;r[4]=e;r[5]=f;r[6]=g;r[7]=h;r[8]=l;r[9]=m;r[10]=n;r[11]=p;r[12]=q;return Y.c?Y.c(this,r,0):Y.call(null,this,r,0)};
k.ka=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){var u=te(14);u[0]=a;u[1]=b;u[2]=c;u[3]=d;u[4]=e;u[5]=f;u[6]=g;u[7]=h;u[8]=l;u[9]=m;u[10]=n;u[11]=p;u[12]=q;u[13]=r;return Y.c?Y.c(this,u,0):Y.call(null,this,u,0)};k.la=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u){var y=te(15);y[0]=a;y[1]=b;y[2]=c;y[3]=d;y[4]=e;y[5]=f;y[6]=g;y[7]=h;y[8]=l;y[9]=m;y[10]=n;y[11]=p;y[12]=q;y[13]=r;y[14]=u;return Y.c?Y.c(this,y,0):Y.call(null,this,y,0)};
k.ma=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y){var z=te(16);z[0]=a;z[1]=b;z[2]=c;z[3]=d;z[4]=e;z[5]=f;z[6]=g;z[7]=h;z[8]=l;z[9]=m;z[10]=n;z[11]=p;z[12]=q;z[13]=r;z[14]=u;z[15]=y;return Y.c?Y.c(this,z,0):Y.call(null,this,z,0)};k.na=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z){var D=te(17);D[0]=a;D[1]=b;D[2]=c;D[3]=d;D[4]=e;D[5]=f;D[6]=g;D[7]=h;D[8]=l;D[9]=m;D[10]=n;D[11]=p;D[12]=q;D[13]=r;D[14]=u;D[15]=y;D[16]=z;return Y.c?Y.c(this,D,0):Y.call(null,this,D,0)};
k.oa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D){var E=te(18);E[0]=a;E[1]=b;E[2]=c;E[3]=d;E[4]=e;E[5]=f;E[6]=g;E[7]=h;E[8]=l;E[9]=m;E[10]=n;E[11]=p;E[12]=q;E[13]=r;E[14]=u;E[15]=y;E[16]=z;E[17]=D;return Y.c?Y.c(this,E,0):Y.call(null,this,E,0)};k.pa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E){var L=te(19);L[0]=a;L[1]=b;L[2]=c;L[3]=d;L[4]=e;L[5]=f;L[6]=g;L[7]=h;L[8]=l;L[9]=m;L[10]=n;L[11]=p;L[12]=q;L[13]=r;L[14]=u;L[15]=y;L[16]=z;L[17]=D;L[18]=E;return Y.c?Y.c(this,L,0):Y.call(null,this,L,0)};
k.qa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E,L){var O=te(20);O[0]=a;O[1]=b;O[2]=c;O[3]=d;O[4]=e;O[5]=f;O[6]=g;O[7]=h;O[8]=l;O[9]=m;O[10]=n;O[11]=p;O[12]=q;O[13]=r;O[14]=u;O[15]=y;O[16]=z;O[17]=D;O[18]=E;O[19]=L;return Y.c?Y.c(this,O,0):Y.call(null,this,O,0)};k.Gb=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E,L,O){a=te(we.a(new R(null,20,5,S,[a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,y,z,D,E,L],null),O));return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)};k.P=function(){return this.da};
k.Z=function(){return 2+N(this.M)};k.S=function(){var a=this.u;return null!=a?a:this.u=a=ce(this)};k.D=function(a,b){var c;c=w(b)?(c=this.constructor===b.constructor)?Lf(this,b):c:b;return w(c)?!0:!1};k.sb=function(a,b){return Id(new Bg(null,new v(null,2,[aj,null,gk,null],null),null),b)?rd.a(Uc(ff.a(V,this),this.da),b):new gl(this.va,this.mb,this.da,Be(rd.a(this.M,b)),null)};
k.Ra=function(a,b,c){return w(ke.a?ke.a(gk,b):ke.call(null,gk,b))?new gl(c,this.mb,this.da,this.M,null):w(ke.a?ke.a(aj,b):ke.call(null,aj,b))?new gl(this.va,c,this.da,this.M,null):new gl(this.va,this.mb,this.da,Q.c(this.M,b,c),null)};k.U=function(){return H(we.a(new R(null,2,5,S,[new R(null,2,5,S,[gk,this.va],null),new R(null,2,5,S,[aj,this.mb],null)],null),this.M))};k.R=function(a,b){return new gl(this.va,this.mb,b,this.M,this.u)};
k.X=function(a,b){return yd(b)?sb(this,hb.a(b,0),hb.a(b,1)):$a.c(fb,this,b)};function hl(a,b){return new gl(a,b,null,null,null)}function Y(a,b,c){return new el(a.va,b,c,null,null,null)}function il(a){return new v(null,2,[uj,null!=a&&a.ub?function(a,c,d){return a.vb(null,c,d)}:Uk,di,null!=a&&a.ub?function(a,c,d){return a.wb(null,c,d)}:Vk],null)}function jl(a){return new v(null,1,[Cj,null!=a&&a.Fc?function(a,c){return a.mc(0,c)}:Xk],null)}
function kl(a){var b=function(b){return function(d,e,f,g,h){f=ld.a(f,b.a?b.a(a,g):b.call(null,a,g));return h.l?h.l(d,e,f,g):h.call(null,d,e,f,g)}}(Cj.b(jl(a)));return fl(dl(al,b,b))}function ll(a){var b=il(a),c=uj.b(b),d=di.b(b);return fl(dl(bl,function(b,c){return function(b,d){return c.c?c.c(a,b,d):c.call(null,a,b,d)}}(b,c,d),function(b,c,d){return function(b,c){return d.c?d.c(a,b,c):d.call(null,a,b,c)}}(b,c,d)))}
var ml=function ml(b){if(null!=b&&null!=b.gb)return b.gb(b);var c=ml[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ml._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("CoercePath.coerce-path",b);};ml["null"]=function(){return ll(null)};el.prototype.gb=function(){return this};gl.prototype.gb=function(){return this};R.prototype.gb=function(){return Yk(this)};Fc.prototype.gb=function(){return ml(Nd(this))};ge.prototype.gb=function(){return ml(Nd(this))};ed.prototype.gb=function(){return ml(Nd(this))};
ml._=function(a){var b;b=(b=(b=ca(a))?b:null!=a?a.Mc?!0:a.ac?!1:Ua(ab,a):Ua(ab,a))?b:null!=a?a.ub?!0:a.ac?!1:Ua(Tk,a):Ua(Tk,a);if(w(b))a=ll(a);else if(null!=a?a.Fc||(a.ac?0:Ua(Wk,a)):Ua(Wk,a))a=kl(a);else throw b=G,a=[A("Protocol implementation cannot be found for object.\n        Extending Specter protocols should not be done inline in a deftype definition\n        because that prevents Specter from finding the protocol implementations for\n        optimized performance. Instead, you should extend the protocols via an\n        explicit extend-protocol call. \n"),
A(a)].join(""),a=b([a],0),Error(B.a(A,a));return a};function nl(a){return a.Ka.type}
function ol(a){var b=P(a,0),c=Zd(a,1),d=b.Ka,e=d.type,f=vc.a(e,Kh)?function(a,b,c,d,e,f){return function(q,r){return function(a,b,c,d,e,f){return function(g,h,l,m,n){var p=function(){return function(a,b,c,d){return r.A?r.A(a,b,c,d,n):r.call(null,a,b,c,d,n)}}(g,h,l,m,a,b,c,d,e,f);return q.A?q.A(g,h,l,m,p):q.call(null,g,h,l,m,p)}}(a,b,c,d,e,f)}}(d,e,a,b,c,a):function(a,b,c,d,e,f){return function(q,r){return function(a,b,c,d,e,f){return function(g,h){var l=function(){return function(a){return r.a?r.a(a,
h):r.call(null,a,h)}}(g,a,b,c,d,e,f);return q.a?q.a(g,l):q.call(null,g,l)}}(a,b,c,d,e,f)}}(d,e,a,b,c,a);return $a.a(function(a,b,c){return function(b,d){return dl(a,function(){var a=b.La,e=d.La;return c.a?c.a(a,e):c.call(null,a,e)}(),function(){var a=b.Ma,e=d.Ma;return c.a?c.a(a,e):c.call(null,a,e)}())}}(d,e,f,a,b,c,a),a)}
function pl(a){if(vc.a(nl(a),Kh))return a;var b=a.La;a=a.Ma;return dl(al,function(a,b){return function(e,f,g,h,l){var m=function(){return function(a){return l.l?l.l(e,f,g,a):l.call(null,e,f,g,a)}}(h,a,b);return a.a?a.a(h,m):a.call(null,h,m)}}(b,a),function(a,b){return function(e,f,g,h,l){var m=function(){return function(a){return l.l?l.l(e,f,g,a):l.call(null,e,f,g,a)}}(h,a,b);return b.a?b.a(h,m):b.call(null,h,m)}}(b,a))}
function ql(a){if(a instanceof el){var b=Di.b(a),c=gj.b(a),d=Eh.b(gk.b(a)),e=Ph.b(gk.b(a));return ud(b)?a:fl(dl(al,function(a,b,c,d){return function(e,n,p,q,r){var u=function(){return function(a,b,c,d){return r.l?r.l(e,n,c,d):r.call(null,e,n,c,d)}}(a,b,p,q,a,b,c,d);return c.A?c.A(a,b,p,q,u):c.call(null,a,b,p,q,u)}}(b,c,d,e),function(a,b,c,d){return function(e,n,p,q,r){var u=function(){return function(a,b,c,d){return r.l?r.l(e,n,c,d):r.call(null,e,n,c,d)}}(a,b,p,q,a,b,c,d);return d.A?d.A(a,b,p,q,u):
d.call(null,a,b,p,q,u)}}(b,c,d,e)))}return a}Yk["null"]=function(a){return ml(a)};Yk._=function(a){return ml(a)};R.prototype.Cc=function(){if(ud(this))return ml(null);var a=T.a(ql,T.a(ml,this)),b=T.a(ol,Jg(nl,T.a(gk,a))),c=vc.a(1,N(b))?I(b):ol(T.a(pl,b)),a=cf(function(){return function(a){return a instanceof gl}}(a,b,c,this),a);return ud(a)?fl(c):hl(pl(c),$a.a(Qd,T.a(aj,a)))};function rl(a){return a instanceof el?0:aj.b(a)}
var sl=function sl(b,c){if(null!=b&&null!=b.Dc)return b.Dc(0,c);var d=sl[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=sl._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("SetExtremes.set-first",b);},tl=function tl(b,c){if(null!=b&&null!=b.Ec)return b.Ec(0,c);var d=tl[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=tl._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("SetExtremes.set-last",b);};
R.prototype.Dc=function(a,b){return Q.c(this,0,b)};R.prototype.Ec=function(a,b){return Q.c(this,N(this)-1,b)};sl._=function(a,b){return M(b,Gc(a))};tl._=function(a,b){var c=Eg(a);return ld.a(Nd(c),b)};function ul(a,b){var c=a.va;return c.Ka.rd.call(null,a.Ta,a.Ua,c.La,b)}function vl(a,b,c){var d=a.va;return d.Ka.td.call(null,a.Ta,a.Ua,d.Ma,b,c)}function wl(){}wl.prototype.ub=!0;wl.prototype.vb=function(a,b,c){return ff.a(md,Rk(c,b))};
wl.prototype.wb=function(a,b,c){a=null==b?null:db(b);if(fe(a))for(c=b=T.a(c,b);;)if(H(c))c=J(c);else break;else b=ff.a(a,Qk(c,b));return b};function xl(){}xl.prototype.Fc=!0;xl.prototype.mc=function(a,b){return b};function yl(a,b){this.Ic=a;this.sd=b}yl.prototype.ub=!0;yl.prototype.vb=function(a,b,c){if(ud(b))return null;a=this.Ic.call(null,b);return c.b?c.b(a):c.call(null,a)};
yl.prototype.wb=function(a,b,c){var d=this;return ud(b)?b:d.sd.call(null,b,function(){var a=d.Ic.call(null,b);return c.b?c.b(a):c.call(null,a)}())};function zl(a,b,c,d){a=Ef.c(Nd(a),b,c);return d.b?d.b(a):d.call(null,a)}function Al(a,b,c,d){var e=Nd(a),f=Ef.c(e,b,c);d=d.b?d.b(f):d.call(null,f);b=we.h(Ef.c(e,0,b),d,G([Ef.c(e,c,N(a))],0));return yd(a)?Nd(b):b}Tk["null"]=!0;Uk["null"]=function(a,b,c){return c.b?c.b(b):c.call(null,b)};Vk["null"]=function(a,b,c){return c.b?c.b(b):c.call(null,b)};
function Bl(a,b,c){return w(a.b?a.b(b):a.call(null,b))?c.b?c.b(b):c.call(null,b):null}function Cl(a,b,c){return w(a.b?a.b(b):a.call(null,b))?c.b?c.b(b):c.call(null,b):b};function Dl(a){return Yk(Nd(a))}function El(a,b){var c=Yk(a);return ul.a?ul.a(c,b):ul.call(null,c,b)}function Fl(a,b,c){a=Yk(a);return vl.c?vl.c(a,b,c):vl.call(null,a,b,c)}var Gl=Dl(G([new wl],0)),Hl=new xl,Il=Dl(G([new yl(kd,tl)],0));Dl(G([new yl(I,sl)],0));
var Jl=hl(dl(al,function(a,b,c,d,e){var f=a[b+0],g=a[b+1];return zl(d,f.b?f.b(d):f.call(null,d),g.b?g.b(d):g.call(null,d),function(d){var f=b+2;return e.l?e.l(a,f,c,d):e.call(null,a,f,c,d)})},function(a,b,c,d,e){var f=a[b+0],g=a[b+1];return Al(d,f.b?f.b(d):f.call(null,d),g.b?g.b(d):g.call(null,d),function(d){var f=b+2;return e.l?e.l(a,f,c,d):e.call(null,a,f,c,d)})}),2),Kl=hl(dl(al,function(a,b,c,d,e){return zl(d,a[b+0],a[b+1],function(d){var g=b+2;return e.l?e.l(a,g,c,d):e.call(null,a,g,c,d)})},function(a,
b,c,d,e){return Al(d,a[b+0],a[b+1],function(d){var g=b+2;return e.l?e.l(a,g,c,d):e.call(null,a,g,c,d)})}),2);Kl.a?Kl.a(0,0):Kl.call(null,0,0);Jl.a?Jl.a(N,N):Jl.call(null,N,N);x.prototype.ub=!0;x.prototype.vb=function(a,b,c){a=C.a(b,this);return c.b?c.b(a):c.call(null,a)};x.prototype.wb=function(a,b,c){var d=this;return Q.c(b,d,function(){var a=C.a(b,d);return c.b?c.b(a):c.call(null,a)}())};Tk["function"]=!0;Uk["function"]=function(a,b,c){return Bl(a,b,c)};
Vk["function"]=function(a,b,c){return Cl(a,b,c)};Bg.prototype.ub=!0;Bg.prototype.vb=function(a,b,c){return Bl(this,b,c)};Bg.prototype.wb=function(a,b,c){return Cl(this,b,c)};var Ll=hl(dl(al,function(a,b,c,d,e){var f=a[b+0];d=w(d)?d:f;b+=1;return e.l?e.l(a,b,c,d):e.call(null,a,b,c,d)},function(a,b,c,d,e){var f=a[b+0];d=w(d)?d:f;b+=1;return e.l?e.l(a,b,c,d):e.call(null,a,b,c,d)}),1);Ll.b?Ll.b(Cg):Ll.call(null,Cg);var Ml=Hc;Ll.b?Ll.b(Ml):Ll.call(null,Ml);Ll.b?Ll.b(md):Ll.call(null,md);
function Nl(){var a=G([zk],0),b=T.a(Yk,new R(null,1,5,S,[a],null)),c=T.a(rl,b),d=M(0,Kg(c)),e=kd(d),f=T.c(function(a,b,c,d){return function(e,f){return w(f instanceof el)?function(){return function(){return f}}(a,b,c,d):function(){return function(a,b){return Y(f,a,b+e)}}(a,b,c,d)}}(b,c,d,e),d,b),g=P(f,0),a=function(){var a=function(a,b,c,d,e,f,g){return function(a,b,c,e,f){var h;h=g.a?g.a(a,b):g.call(null,a,b);var l=ul.a?ul.a(h,e):ul.call(null,h,e);if(1<N(l))throw a=G(["More than one element found for params: ",
h,e],0),Error(B.a(A,a));h=I(l);b+=d;c=ld.a(c,h);return f.l?f.l(a,b,c,e):f.call(null,a,b,c,e)}}(b,c,d,e,f,f,g);return hl(dl(al,a,a),e)}();return vc.a(0,e)?Y(a,null,0):a};var Ol=new v(null,3,[xi,2,Uh,4,Nj,1],null),Pl=new v(null,3,[xi,40,Uh,40,Nj,0],null);function Ql(a,b){var c=T.a(Le.a(Ol,Ii),b),d=a/$a.a(Qd,c);return T.a(Me(Sd,d),c)}function Rl(a,b,c){return ld.a(b,function(){var d=null==b?null:zb(b);return a.a?a.a(d,c):a.call(null,d,c)}())}function Sl(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a,c=C.a(c,Ii),c=b-(Pl.b?Pl.b(c):Pl.call(null,c));return c-Wd(c,20)}
function Tl(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a,d=C.a(c,wi),e=C.a(c,Ck),f=Ql(e,b);return T.h(function(a,b,c,d){return function(a,b,c,e){a=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a;C.a(a,Ii);return yg.h(G([a,new v(null,5,[xh,c,wi,d,Ij,e,Xh,e,zi,-30],null)],0))}}(f,a,c,d,e),b,f,$a.c(Me(Rl,Qd),new R(null,1,5,S,[0],null),f),G([T.c(Sl,b,f)],0))}
function Ul(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a,d=C.a(c,wi),e=C.a(c,Ck),f=C.a(c,Zj),g=N(b),h=d/g;return T.c(function(a,b,c,d,e,f){return function(a,c){var d=new v(null,3,[Zj,a,wi,b-30,Ck,f],null),d=null!=d&&(d.g&64||d.F)?B.a(Sc,d):d,e=C.a(d,wi),g=C.a(d,Ck),h=null!=c&&(c.g&64||c.F)?B.a(Sc,c):c;C.a(h,Yh);return kf.c(yg.h(G([h,d],0)),Yh,Me(Tl,new v(null,2,[wi,e,Ck,g],null)))}}(g,h,a,c,d,e,f),Ve(g,Ze(Me(Qd,h),f)),b)};function Vl(a){return vc.a(Uh,Ii.b(a))}function Wl(a){return Fl(new R(null,7,5,S,[ni,Gl,Yh,Gl,function(a){return ck.b(a)},yk,Il],null),Ke(vi),a)}if("undefined"===typeof Xl)var Xl=function(){var a=W.b?W.b(V):W.call(null,V),b=W.b?W.b(V):W.call(null,V),c=W.b?W.b(V):W.call(null,V),d=W.b?W.b(V):W.call(null,V),e=C.c(V,nk,ih());return new th(Dc.a("pennygame.updates","capacity"),function(){return function(a,b){var c=null!=b&&(b.g&64||b.F)?B.a(Sc,b):b;return C.a(c,Ii)}}(a,b,c,d,e),ki,e,a,b,c,d)}();
vh(Xl,Ri,function(a){return a});vh(Xl,cj,function(a){switch(a){case 1:return 4;case 2:return 4;case 3:return 4;case 4:return 4;case 5:return 5;case 6:return 6;default:throw Error([A("No matching clause: "),A(a)].join(""));}});vh(Xl,Ni,function(a,b,c){a=null!=b&&(b.g&64||b.F)?B.a(Sc,b):b;b=C.a(a,Dh);a=C.a(a,ji);c=od(c,b);b=null!=c&&(c.g&64||c.F)?B.a(Sc,c):c;c=C.a(b,Zh);b=C.a(b,yk);if(vc.a(a,Zh))return c;a=N(b);return c<a?c:a});function Yl(a,b){return Fl(new R(null,4,5,S,[ni,Gl,Yh,Gl],null),b,a)}
function Zl(a,b){return Nd(T.c(function(a,b){return Q.c(a,qi,b)},a,b))}function $l(a,b){return kf.l(a,jk,Zl,b)}function am(a,b){return Fl(new R(null,6,5,S,[ni,Gl,Yh,Hl,Gl,function(a){return Id(a,Nh)}],null),function(a,d){var e=null!=d&&(d.g&64||d.F)?B.a(Sc,d):d,f=C.a(e,Nh),g=C.a(e,Ak);C.a(e,yk);f=gf(b,new R(null,2,5,S,[f,qi],null));g=Xl.c?Xl.c(f,g,a):Xl.call(null,f,g,a);return Q.c(e,Zh,g)},a)}
function bm(a,b){return Fl(new R(null,7,5,S,[ni,Gl,Yh,Hl,Gl,function(a){return Id(a,Nh)},function(a){return vc.a(Ni,gf(a,new R(null,2,5,S,[Ak,Ii],null)))}],null),function(a,d){var e=null!=d&&(d.g&64||d.F)?B.a(Sc,d):d,f=C.a(e,Nh),g=C.a(e,Ak);C.a(e,yk);f=gf(b,new R(null,2,5,S,[f,qi],null));g=Xl.c?Xl.c(f,g,a):Xl.call(null,f,g,a);return Q.c(e,Zh,g)},a)}function cm(a){var b=a.b?a.b(jk):a.call(null,jk);return bm(am(a,b),b)}
if("undefined"===typeof dm){var dm,em=W.b?W.b(V):W.call(null,V),fm=W.b?W.b(V):W.call(null,V),gm=W.b?W.b(V):W.call(null,V),hm=W.b?W.b(V):W.call(null,V),im=C.c(V,nk,ih());dm=new th(Dc.a("pennygame.updates","process"),Ii,ki,im,em,fm,gm,hm)}vh(dm,ki,function(a){a=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a;var b=C.a(a,Zh),c=C.a(a,yk);return Q.h(a,yk,We(b,c),G([Yj,Ve(b,c)],0))});vh(dm,xi,function(a){a=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a;var b=C.a(a,Zh);return Q.c(a,Yj,Ve(b,Xe(Ci)))});
function jm(a){var b=I(El(new R(null,4,5,S,[Yh,Gl,function(a){return Mj.b(a)},Mj],null),a));return Fl(new R(null,5,5,S,[Yh,function(){var a=b+1;return Kl.a?Kl.a(b,a):Kl.call(null,b,a)}(),Gl,Yj,Il],null),Ke(vi),a)}function km(a){return Ie(function(a){return vc.a(a,vi)},El(new R(null,4,5,S,[Gl,function(a){return Mj.b(a)},Yj,Gl],null),a))}function lm(a){return w(km(a.b?a.b(Yh):a.call(null,Yh)))?jm(a):a}
function mm(a){return Fl(new R(null,2,5,S,[ni,Gl],null),lm,Fl(new R(null,5,5,S,[ni,Gl,Yh,Gl,function(a){return C.a(a,Zh)}],null),dm,a))}function nm(a){var b=B.c(Vd,16.5,T.a(function(a){var b=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a;a=C.a(b,Jj);var e=C.a(b,zk),b=C.a(b,yk);return a/(N(e)+N(b))},El(new R(null,5,5,S,[ni,Gl,Yh,Gl,Vl],null),a)));return Fl(new R(null,5,5,S,[ni,Gl,Yh,Gl,Vl],null),function(a){return function(b){return kf.l(b,Ah,Vd,a)}}(b),a)}
function om(a){return Fl(new R(null,6,5,S,[ni,Gl,Yh,Hl,Gl,function(a){return Id(a,Bh)}],null),function(a,c){var d=null!=c&&(c.g&64||c.F)?B.a(Sc,c):c,e=C.a(d,Bh);return Q.c(d,zk,gf(Nd(a),new R(null,2,5,S,[e,Yj],null)))},a)}function pm(a){return Fl(new R(null,6,5,S,[ni,Gl,Yh,Gl,Nl(),yk],null),function(a,c){return we.a(c,a)},a)}
function qm(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a,c=C.a(c,Yh),d=null!=b&&(b.g&64||b.F)?B.a(Sc,b):b,e=C.c(d,uk,0),f=C.c(d,Lh,0),g=C.c(d,Gi,0),h=C.c(d,Mi,0),l=C.a(d,Aj),m=C.a(d,Ei),n=C.c(d,ii,new R(null,2,5,S,[0,0],null)),d=N(Yj.b(I(c))),p=N(Yj.b(kd(Eg(c)))),q=B.c(T,Qd,T.a(Mg(Le.a(N,Yj),Zh),El(new R(null,2,5,S,[Gl,Vl],null),c))),r=$a.a(Qd,T.a(N,El(new R(null,3,5,S,[Gl,Vl,yk],null),c))),n=T.c(Qd,n,q);return qd([Lh,ii,Ei,Gi,Mi,Si,ij,Aj,uk],[w(km(c))?f+1:f,n,m+p,w(km(c))?e-h:g,w(km(c))?e:h,r,B.a(Td,
n),l+d,e+1])}function rm(a){return Fl(new R(null,5,5,S,[ni,Gl,function(a){return H(C.a(a,Yh))},Hl,Wh],null),function(a,c){return ld.a(c,qm(a,null==c?null:zb(c)))},Fl(new R(null,7,5,S,[ni,Gl,function(a){return H(C.a(a,Yh))},Yh,Gl,function(a){return N(Yj.b(a))<Zh.b(a)},ok],null),Vc,a))};var sm,tm=new v(null,3,[uk,250,oj,400,ui,400],null);sm=W.b?W.b(tm):W.call(null,tm);var um=VDOM.diff,vm=VDOM.patch,wm=VDOM.create;function xm(a){return df(Ra,df(Gd,ef(a)))}function ym(a,b,c){return new VDOM.VHtml($d(a),dh(rd.a(b,Vh)),dh(c),Vh.b(b))}function zm(a,b,c){return new VDOM.VSvg($d(a),dh(b),dh(c))}Am;
var Bm=function Bm(b){if(null==b)return new VDOM.VText("");if(w(VDOM.isVirtualNode(b)))return b;if(Gd(b))return ym(fj,V,T.a(Bm,xm(b)));if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(vc.a(Gj,I(b)))return Am.b?Am.b(b):Am.call(null,b);var c=P(b,0),d=P(b,1);b=Zd(b,2);return ym(c,d,T.a(Bm,xm(b)))},Am=function Am(b){if(null==b)return new VDOM.VText("");if(w(VDOM.isVirtualNode(b)))return b;if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(vc.a(Gk,I(b))){var c=
P(b,0),d=P(b,1);b=Zd(b,2);return zm(c,d,T.a(Bm,xm(b)))}c=P(b,0);d=P(b,1);b=Zd(b,2);return zm(c,d,T.a(Am,xm(b)))};
function Cm(){var a=document.getElementById("app"),b=function(){var a=new VDOM.VText("");return W.b?W.b(a):W.call(null,a)}(),c=function(){var a;a=K.b?K.b(b):K.call(null,b);a=wm.b?wm.b(a):wm.call(null,a);return W.b?W.b(a):W.call(null,a)}(),d=function(){var a=window.requestAnimationFrame;return w(a)?function(a){return function(b){return a.b?a.b(b):a.call(null,b)}}(a,a,b,c):function(){return function(a){return a.m?a.m():a.call(null)}}(a,b,c)}();a.appendChild(K.b?K.b(c):K.call(null,c));return function(a,
b,c){return function(d){var l=Bm(d);d=function(){var b=K.b?K.b(a):K.call(null,a);return um.a?um.a(b,l):um.call(null,b,l)}();Se.a?Se.a(a,l):Se.call(null,a,l);d=function(a,b,c,d){return function(){return Te.c(d,vm,b)}}(l,d,a,b,c);return c.b?c.b(d):c.call(null,d)}}(b,c,d)};function Dm(a){if(w(vc.a?vc.a(0,a):vc.call(null,0,a)))return md;if(w(vc.a?vc.a(1,a):vc.call(null,1,a)))return new R(null,1,5,S,[new R(null,2,5,S,[0,0],null)],null);if(w(vc.a?vc.a(2,a):vc.call(null,2,a)))return new R(null,2,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[1,1],null)],null);if(w(vc.a?vc.a(3,a):vc.call(null,3,a)))return new R(null,3,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[0,0],null),new R(null,2,5,S,[1,1],null)],null);if(w(vc.a?vc.a(4,a):vc.call(null,4,a)))return new R(null,
4,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[-1,1],null),new R(null,2,5,S,[1,-1],null),new R(null,2,5,S,[1,1],null)],null);if(w(vc.a?vc.a(5,a):vc.call(null,5,a)))return new R(null,5,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[-1,1],null),new R(null,2,5,S,[0,0],null),new R(null,2,5,S,[1,-1],null),new R(null,2,5,S,[1,1],null)],null);if(w(vc.a?vc.a(6,a):vc.call(null,6,a)))return new R(null,6,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[-1,0],null),new R(null,2,5,S,[-1,1],
null),new R(null,2,5,S,[1,-1],null),new R(null,2,5,S,[1,0],null),new R(null,2,5,S,[1,1],null)],null);throw Error([A("No matching clause: "),A(a)].join(""));}var Em=Mg(function(a){return a.x},function(a){return a.y});
function Fm(a){var b=P(a,0),c=P(a,1),d=Math.ceil(Math.sqrt(4)),e=b/d,f=c/d;return function(a,b,c,d,e,f,q){return function u(y){return new me(null,function(a,b,c,d,e,f,g){return function(){for(var h=y;;){var l=H(h);if(l){var m=l,n=I(m);if(l=H(function(a,b,c,d,e,f,g,h,l,m,n){return function ib(p){return new me(null,function(a,b,c,d,e,f,g,h){return function(){for(;;){var a=H(p);if(a){if(Cd(a)){var c=ec(a),d=N(c),e=qe(d);a:for(var l=0;;)if(l<d){var m=hb.a(c,l),m=Q.h(h,Zj,m*f,G([xh,b*g],0));e.add(m);l+=
1}else{c=!0;break a}return c?re(e.W(),ib(fc(a))):re(e.W(),null)}e=I(a);return M(Q.h(h,Zj,e*f,G([xh,b*g],0)),ib(Gc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n),null,null)}}(h,n,m,l,a,b,c,d,e,f,g)(new Ig(null,0,a,1,null))))return we.a(l,u(Gc(h)));h=Gc(h)}else return null}}}(a,b,c,d,e,f,q),null,null)}}(d,e,f,new v(null,2,[wi,e,Ck,f],null),a,b,c)(new Ig(null,0,d,1,null))}var Gm=Mg(Me(B,Vd),Me(B,Ud));
function Hm(a,b){var c=P(a,0),d=P(a,1),e=P(b,0),f=P(b,1),g=vc.a(c,d)?new R(null,2,5,S,[0,1],null):new R(null,2,5,S,[c,d],null),h=P(g,0),l=P(g,1),m=(f-e)/(l-h);return function(a,b,c,d,e){return function(a){return d*a+e}}(g,h,l,m,f-m*l,a,c,d,b,e,f)}
var Im=function Im(b,c){return vc.a(1,b)?T.a(tc,c):new me(null,function(){var d=H(c);if(d){var e=P(d,0),f=Zd(d,1);return we.a(function(){return function(b,c,d,e){return function p(f){return new me(null,function(b,c){return function(){for(;;){var b=H(f);if(b){if(Cd(b)){var d=ec(b),e=N(d),g=qe(e);a:for(var h=0;;)if(h<e){var l=hb.a(d,h),l=M(c,l);g.add(l);h+=1}else{d=!0;break a}return d?re(g.W(),p(fc(b))):re(g.W(),null)}g=I(b);return M(M(c,g),p(Gc(b)))}return null}}}(b,c,d,e),null,null)}}(d,e,f,d)(Im(b-
1,f))}(),Im(b,f))}return null},null,null)};
function Jm(a){function b(a){var b=wc;H(a)?(a=Md.b?Md.b(a):Md.call(null,a),b=Ld(b),wa(a,b),a=H(a)):a=Hc;b=P(a,0);a=P(a,1);var c=(18-(a-b))/2,b=[b,b-c,a,a+c];a=[];for(c=0;;)if(c<b.length){var g=b[c],h=b[c+1];-1===Qf(a,g)&&(a.push(g),a.push(h));c+=2}else break;return new v(null,a.length/2,a,null)}for(;;){var c=jd(B.c(Fg,I,cf(function(){return function(a){return 0<I(a)&&18>I(a)}}(a,b),T.a(function(){return function(a){var b=S,c=B.a(Rd,a);return new R(null,2,5,b,[Math.abs(c),a],null)}}(a,b),Im(2,a)))));
if(w(c))a=Dg(b(c),a);else return a}}function Km(a,b){return we.a(a,We(N(a),b))}function Lm(a,b,c){var d=null!=b&&(b.g&64||b.F)?B.a(Sc,b):b;b=C.a(d,wi);var d=C.a(d,Ck),e=null!=c&&(c.g&64||c.F)?B.a(Sc,c):c;c=C.a(e,Bk);var e=C.a(e,fk),f=B.a(we,a);a=Km(e,function(){var a=T.a(I,f);return Gm.b?Gm.b(a):Gm.call(null,a)}());c=Km(c,function(){var a=T.a(jd,f);return Gm.b?Gm.b(a):Gm.call(null,a)}());return new R(null,2,5,S,[Hm(a,new R(null,2,5,S,[0,b],null)),Hm(c,new R(null,2,5,S,[d,0],null))],null)};function Mm(a){this.Fa=a}Mm.prototype.ed=function(a,b,c){return this.Fa.c?this.Fa.c(a,b,c):this.Fa.call(null,a,b,c)};ba("Hook",Mm);ba("Hook.prototype.hook",Mm.prototype.ed);function Nm(a){return document.querySelector([A("#"),A(a),A(" .penny-path")].join(""))}function Om(a){return document.querySelector([A("#"),A(a),A(" .ramp")].join(""))};function Pm(a){return yg.h(G([qd([Ah,Zh,Ii,wj,Yj,ok,yk,zk,Ak],[999999,null,Uh,Zg("station"),md,0,Ve(4,Xe(Ci)),md,new v(null,1,[Ii,Ri],null)]),B.a(Sc,a)],0))}function Qm(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;return Rm(0<b.length?new Fc(b.slice(0),0):null)}function Rm(a){return yg.h(G([new v(null,2,[Wh,md,Yh,md],null),B.a(Sc,a)],0))}
var Sm=Rm(G([mi,Tj,Yh,new R(null,6,5,S,[Pm(G([Ii,xi,Nh,0],0)),Pm(G([Bh,0,Nh,1,ck,!0],0)),Pm(G([Bh,1,Nh,2],0)),Pm(G([Bh,2,Nh,3],0)),Pm(G([Bh,3,Nh,4,Mj,0],0)),Pm(G([Ii,Nj,Bh,4],0))],null)],0)),Tm=Rm(G([mi,bi,Yh,new R(null,6,5,S,[Pm(G([Ii,xi,Nh,0,Ak,new v(null,1,[Ii,cj],null)],0)),Pm(G([Bh,0,Nh,1,Ak,new v(null,1,[Ii,cj],null),ck,!0],0)),Pm(G([Bh,1,Nh,2,Ak,new v(null,1,[Ii,cj],null)],0)),Pm(G([Bh,2,Nh,3,hk,!0],0)),Pm(G([Bh,3,Nh,4,Ak,new v(null,1,[Ii,cj],null),Mj,0],0)),Pm(G([Ii,Nj,Bh,4],0))],null)],0)),
Um=Rm(G([mi,Ni,Yh,new R(null,6,5,S,[Pm(G([Ii,xi,Nh,0,Ak,new v(null,3,[Ii,Ni,Dh,3,ji,Zh],null),hk,!0],0)),Pm(G([Bh,0,Nh,1,Ak,new v(null,1,[Ii,cj],null),ck,!0],0)),Pm(G([Bh,1,Nh,2,Ak,new v(null,1,[Ii,cj],null)],0)),Pm(G([Bh,2,Nh,3,hk,!0],0)),Pm(G([Bh,3,Nh,4,Ak,new v(null,1,[Ii,cj],null),Mj,0],0)),Pm(G([Ii,Nj,Bh,4],0))],null)],0));
Rm(G([mi,ik,Yh,new R(null,6,5,S,[Pm(G([Ii,xi,Nh,0,Ak,new v(null,3,[Ii,Ni,Dh,3,ji,Pi],null)],0)),Pm(G([Bh,0,Nh,1,Ak,new v(null,1,[Ii,cj],null),ck,!0],0)),Pm(G([Bh,1,Nh,2,Ak,new v(null,1,[Ii,cj],null)],0)),Pm(G([Bh,2,Nh,3,yk,Ve(6,Xe(Ci))],0)),Pm(G([Bh,3,Nh,4,Ak,new v(null,1,[Ii,cj],null),Mj,0],0)),Pm(G([Ii,Nj,Bh,4],0))],null)],0));var Vm=new v(null,3,[Tj,Sm,bi,Tm,Ni,Um],null);function Wm(){0!=Xm&&da(this);this.Gc=this.Gc;this.nd=this.nd}var Xm=0;Wm.prototype.Gc=!1;function Ym(a,b){Wm.call(this);void 0!==a||(a=Zm++ +qa());this.bb=a%2147483646;0>=this.bb&&(this.bb+=2147483646);b&&this.install()}(function(){function a(){}a.prototype=Wm.prototype;Ym.Jd=Wm.prototype;Ym.prototype=new a;Ym.prototype.constructor=Ym;Ym.Wb=function(a,c,d){for(var e=Array(arguments.length-2),f=2;f<arguments.length;f++)e[f-2]=arguments[f];return Wm.prototype[c].apply(a,e)}})();var Zm=0,$m=1/2147483646;Ym.prototype.bb=1;
Ym.prototype.install=function(){this.fd||(Math.random=pa(this.random,this),this.fd=!0)};Ym.prototype.random=function(){var a=this.bb%44488*48271-3399*Math.floor(this.bb/44488);this.bb=0<a?a:a+2147483647;return(this.bb-1)*$m};var an=function an(b){if(null!=b&&null!=b.Jc)return b.Jc();var c=an[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=an._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("IRandom.-rand",b);};Ym.prototype.Jc=function(){return this.random()};function bn(a){return new Ym(a)};function cn(a,b){return rm(pm(om(mm(cm($l(kf.c(b,uk,Vc),Ye(function(){return(6*an(a)|0)+1})))))))}function dn(a,b,c){var d=0;for(c=Wl(c);;)if(d<b)d+=1,c=cn(a,c);else return c}function en(a){return ff.a(V,df(Le.a(Ra,I),T.a(Mg(mi,Wh),ni.b(a))))}function fn(a,b){var c;a:{var d=Tf(b),e=T.a(a,Uf(b));c=Xb(V);d=H(d);for(e=H(e);;)if(d&&e)c=ze(c,I(d),I(e)),d=J(d),e=J(e);else{c=Zb(c);break a}}return c}
var gn=function gn(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return gn.h(arguments[0],1<c.length?new Fc(c.slice(1),0):null)};gn.h=function(a,b){return fn(function(b){return B.a(a,b)},fn(function(a){return T.a(be,a)},gh(ae,B.a(we,b))))};gn.w=1;gn.B=function(a){var b=I(a);a=J(a);return gn.h(b,a)};function hn(a){return fn(function(a){return B.c(T,Df,a)},fn(function(a){return T.a(be,a)},gh(ae,B.a(we,a))))}
function jn(a){var b=function(){var b=en(a);return W.b?W.b(b):W.call(null,b)}(),c=W.b?W.b(1):W.call(null,1),d=function(a,b){return function(a,c){return((K.b?K.b(b):K.call(null,b))*a+c)/((K.b?K.b(b):K.call(null,b))+1)}}(b,c);return function(a,b,c,d){return function(l){l=fn(function(a,b,c,d,e){return function(a){return T.a(e,a)}}(a,a,b,c,d),hn(G([K.b?K.b(a):K.call(null,a),en(l)],0)));Se.a?Se.a(a,l):Se.call(null,a,l);Te.a(b,Vc);return K.b?K.b(a):K.call(null,a)}}(b,c,d,function(a,b,c){return function(a){return B.c(gn,
c,a)}}(b,c,d))};var kn,ln=function ln(b){if(null!=b&&null!=b.$b)return b.$b();var c=ln[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ln._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("Channel.close!",b);},mn=function mn(b){if(null!=b&&null!=b.Ac)return!0;var c=mn[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=mn._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("Handler.active?",b);},nn=function nn(b){if(null!=b&&null!=b.Bc)return b.Fa;var c=nn[t(null==b?null:b)];
if(null!=c)return c.b?c.b(b):c.call(null,b);c=nn._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("Handler.commit",b);},on=function on(b,c){if(null!=b&&null!=b.zc)return b.zc(0,c);var d=on[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=on._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Va("Buffer.add!*",b);},pn=function pn(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return pn.b(arguments[0]);case 2:return pn.a(arguments[0],
arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};pn.b=function(a){return a};pn.a=function(a,b){return on(a,b)};pn.w=2;function qn(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function rn(a,b,c,d){this.head=a;this.O=b;this.length=c;this.f=d}rn.prototype.pop=function(){if(0===this.length)return null;var a=this.f[this.O];this.f[this.O]=null;this.O=(this.O+1)%this.f.length;--this.length;return a};rn.prototype.unshift=function(a){this.f[this.head]=a;this.head=(this.head+1)%this.f.length;this.length+=1;return null};function sn(a,b){a.length+1===a.f.length&&a.resize();a.unshift(b)}
rn.prototype.resize=function(){var a=Array(2*this.f.length);return this.O<this.head?(qn(this.f,this.O,a,0,this.length),this.O=0,this.head=this.length,this.f=a):this.O>this.head?(qn(this.f,this.O,a,0,this.f.length-this.O),qn(this.f,0,a,this.f.length-this.O,this.head),this.O=0,this.head=this.length,this.f=a):this.O===this.head?(this.head=this.O=0,this.f=a):null};function tn(a,b){for(var c=a.length,d=0;;)if(d<c){var e=a.pop();(b.b?b.b(e):b.call(null,e))&&a.unshift(e);d+=1}else break}
function un(a){return new rn(0,0,0,Array(a))}function vn(a,b){this.K=a;this.n=b;this.g=2;this.C=0}function wn(a){return a.K.length===a.n}vn.prototype.zc=function(a,b){sn(this.K,b);return this};vn.prototype.Z=function(){return this.K.length};var xn;a:{var yn=aa.navigator;if(yn){var zn=yn.userAgent;if(zn){xn=zn;break a}}xn=""};var An;
function Bn(){var a=aa.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==xn.indexOf("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=pa(function(a){if(("*"==d||a.origin==
d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&-1==xn.indexOf("Trident")&&-1==xn.indexOf("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.qc;c.qc=null;a()}};return function(a){d.next={qc:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=
document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){aa.setTimeout(a,0)}};var Cn=un(32),Dn=!1,En=!1;Fn;function Gn(){Dn=!0;En=!1;for(var a=0;;){var b=Cn.pop();if(null!=b&&(b.m?b.m():b.call(null),1024>a)){a+=1;continue}break}Dn=!1;return 0<Cn.length?Fn.m?Fn.m():Fn.call(null):null}function Fn(){var a=En;if(w(w(a)?Dn:a))return null;En=!0;!ca(aa.setImmediate)||aa.Window&&aa.Window.prototype&&aa.Window.prototype.setImmediate==aa.setImmediate?(An||(An=Bn()),An(Gn)):aa.setImmediate(Gn)}function Hn(a){sn(Cn,a);Fn()}function In(a,b){setTimeout(a,b)};var Jn,Kn=function Kn(b){"undefined"===typeof Jn&&(Jn=function(b,d,e){this.Lc=b;this.G=d;this.kd=e;this.g=425984;this.C=0},Jn.prototype.R=function(b,d){return new Jn(this.Lc,this.G,d)},Jn.prototype.P=function(){return this.kd},Jn.prototype.Fb=function(){return this.G},Jn.ec=function(){return new R(null,3,5,S,[Uc(hj,new v(null,1,[Ee,tc(Fe,tc(new R(null,1,5,S,[sj],null)))],null)),sj,xa.Gd],null)},Jn.tb=!0,Jn.Za="cljs.core.async.impl.channels/t_cljs$core$async$impl$channels22071",Jn.Pb=function(b,d){return Tb(d,
"cljs.core.async.impl.channels/t_cljs$core$async$impl$channels22071")});return new Jn(Kn,b,V)};function Ln(a,b){this.Qb=a;this.G=b}function Mn(a){return mn(a.Qb)}var Nn=function Nn(b){if(null!=b&&null!=b.yc)return b.yc();var c=Nn[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Nn._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Va("MMC.abort",b);};function On(a,b,c,d,e,f,g){this.Cb=a;this.dc=b;this.nb=c;this.cc=d;this.K=e;this.closed=f;this.Ja=g}
On.prototype.yc=function(){for(;;){var a=this.nb.pop();if(null!=a){var b=a.Qb;Hn(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(b.Fa,b,a.G,a,this))}break}tn(this.nb,Ke(!1));return ln(this)};
function Pn(a,b,c){var d=a.closed;if(d)Kn(!d);else if(w(function(){var b=a.K;return w(b)?Ta(wn(a.K)):b}())){for(var e=Xc(a.Ja.a?a.Ja.a(a.K,b):a.Ja.call(null,a.K,b));;){if(0<a.Cb.length&&0<N(a.K)){c=a.Cb.pop();var f=c.Fa,g=a.K.K.pop();Hn(function(a,b){return function(){return a.b?a.b(b):a.call(null,b)}}(f,g,c,e,d,a))}break}e&&Nn(a);Kn(!0)}else e=function(){for(;;){var b=a.Cb.pop();if(w(b)){if(w(!0))return b}else return null}}(),w(e)?(c=nn(e),Hn(function(a){return function(){return a.b?a.b(b):a.call(null,
b)}}(c,e,d,a)),Kn(!0)):(64<a.cc?(a.cc=0,tn(a.nb,Mn)):a.cc+=1,sn(a.nb,new Ln(c,b)))}
function Qn(a,b){if(null!=a.K&&0<N(a.K)){for(var c=b.Fa,d=Kn(a.K.K.pop());;){if(!w(wn(a.K))){var e=a.nb.pop();if(null!=e){var f=e.Qb,g=e.G;Hn(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(f.Fa,f,g,e,c,d,a));Xc(a.Ja.a?a.Ja.a(a.K,g):a.Ja.call(null,a.K,g))&&Nn(a);continue}}break}return d}c=function(){for(;;){var b=a.nb.pop();if(w(b)){if(mn(b.Qb))return b}else return null}}();if(w(c))return d=nn(c.Qb),Hn(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(d,c,a)),Kn(c.G);
if(w(a.closed))return w(a.K)&&(a.Ja.b?a.Ja.b(a.K):a.Ja.call(null,a.K)),w(w(!0)?b.Fa:!0)?(c=function(){var b=a.K;return w(b)?0<N(a.K):b}(),c=w(c)?a.K.K.pop():null,Kn(c)):null;64<a.dc?(a.dc=0,tn(a.Cb,mn)):a.dc+=1;sn(a.Cb,b);return null}
On.prototype.$b=function(){var a=this;if(!a.closed)for(a.closed=!0,w(function(){var b=a.K;return w(b)?0===a.nb.length:b}())&&(a.Ja.b?a.Ja.b(a.K):a.Ja.call(null,a.K));;){var b=a.Cb.pop();if(null==b)break;else{var c=b.Fa,d=w(function(){var b=a.K;return w(b)?0<N(a.K):b}())?a.K.K.pop():null;Hn(function(a,b){return function(){return a.b?a.b(b):a.call(null,b)}}(c,d,b,this))}}return null};function Rn(a){console.log(a);return null}
function Sn(a,b){var c=(w(null)?null:Rn).call(null,b);return null==c?a:pn.a(a,c)}
function Tn(a){return new On(un(32),0,un(32),0,a,!1,function(){return function(a){return function(){function c(c,d){try{return a.a?a.a(c,d):a.call(null,c,d)}catch(e){return Sn(c,e)}}function d(c){try{return a.b?a.b(c):a.call(null,c)}catch(d){return Sn(c,d)}}var e=null,e=function(a,b){switch(arguments.length){case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};e.b=d;e.a=c;return e}()}(w(null)?null.b?null.b(pn):null.call(null,pn):pn)}())};var Un,Vn=function Vn(b){"undefined"===typeof Un&&(Un=function(b,d,e){this.nc=b;this.Fa=d;this.jd=e;this.g=393216;this.C=0},Un.prototype.R=function(b,d){return new Un(this.nc,this.Fa,d)},Un.prototype.P=function(){return this.jd},Un.prototype.Ac=function(){return!0},Un.prototype.Bc=function(){return this.Fa},Un.ec=function(){return new R(null,3,5,S,[Uc(qk,new v(null,2,[ai,!0,Ee,tc(Fe,tc(new R(null,1,5,S,[Kk],null)))],null)),Kk,xa.Fd],null)},Un.tb=!0,Un.Za="cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers22008",
Un.Pb=function(b,d){return Tb(d,"cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers22008")});return new Un(Vn,b,V)};function Wn(a){try{return a[0].call(null,a)}catch(b){throw b instanceof Object&&a[6].$b(),b;}}function Xn(a,b,c){c=Qn(c,Vn(function(c){a[2]=c;a[1]=b;return Wn(a)}));return w(c)?(a[2]=K.b?K.b(c):K.call(null,c),a[1]=b,Hi):null}function Yn(a,b){var c=a[6];null!=b&&Pn(c,b,Vn(function(){return function(){return null}}(c)));c.$b();return c}
function Zn(a){for(;;){var b=a[4],c=Ji.b(b),d=zj.b(b),e=a[5];if(w(function(){var a=e;return w(a)?Ta(b):a}()))throw e;if(w(function(){var a=e;return w(a)?(a=c,w(a)?e instanceof d:a):a}())){a[1]=c;a[2]=e;a[5]=null;a[4]=Q.h(b,Ji,null,G([zj,null],0));break}if(w(function(){var a=e;return w(a)?Ta(c)&&Ta(li.b(b)):a}()))a[4]=Fj.b(b);else{if(w(function(){var a=e;return w(a)?(a=Ta(c))?li.b(b):a:a}())){a[1]=li.b(b);a[4]=Q.c(b,li,null);break}if(w(function(){var a=Ta(e);return a?li.b(b):a}())){a[1]=li.b(b);a[4]=
Q.c(b,li,null);break}if(Ta(e)&&Ta(li.b(b))){a[1]=Kj.b(b);a[4]=Fj.b(b);break}throw Error("No matching clause");}}};function $n(a,b,c){this.key=a;this.G=b;this.forward=c;this.g=2155872256;this.C=0}$n.prototype.U=function(){return fb(fb(Hc,this.G),this.key)};$n.prototype.L=function(a,b,c){return zf(b,Af,"["," ","]",c,this)};function ao(a,b,c){c=Array(c+1);for(var d=0;;)if(d<c.length)c[d]=null,d+=1;else break;return new $n(a,b,c)}function bo(a,b,c,d){for(;;){if(0>c)return a;a:for(;;){var e=a.forward[c];if(w(e))if(e.key<b)a=e;else break a;else break a}null!=d&&(d[c]=a);--c}}
function co(a,b){this.jb=a;this.level=b;this.g=2155872256;this.C=0}co.prototype.put=function(a,b){var c=Array(15),d=bo(this.jb,a,this.level,c).forward[0];if(null!=d&&d.key===a)return d.G=b;a:for(d=0;;)if(.5>Math.random()&&15>d)d+=1;else break a;if(d>this.level){for(var e=this.level+1;;)if(e<=d+1)c[e]=this.jb,e+=1;else break;this.level=d}for(d=ao(a,b,Array(d));;)return 0<=this.level?(c=c[0].forward,d.forward[0]=c[0],c[0]=d):null};
co.prototype.remove=function(a){var b=Array(15),c=bo(this.jb,a,this.level,b).forward[0];if(null!=c&&c.key===a){for(a=0;;)if(a<=this.level){var d=b[a].forward;d[a]===c&&(d[a]=c.forward[a]);a+=1}else break;for(;;)if(0<this.level&&null==this.jb.forward[this.level])--this.level;else return null}else return null};function eo(a){for(var b=fo,c=b.jb,d=b.level;;){if(0>d)return c===b.jb?null:c;var e;a:for(e=c;;){e=e.forward[d];if(null==e){e=null;break a}if(e.key>=a)break a}null!=e?(--d,c=e):--d}}
co.prototype.U=function(){return function(a){return function c(d){return new me(null,function(){return function(){return null==d?null:M(new R(null,2,5,S,[d.key,d.G],null),c(d.forward[0]))}}(a),null,null)}}(this)(this.jb.forward[0])};co.prototype.L=function(a,b,c){return zf(b,function(){return function(a){return zf(b,Af,""," ","",c,a)}}(this),"{",", ","}",c,this)};var fo=new co(ao(null,null,0),0);
function go(a){var b=(new Date).valueOf()+a,c=eo(b),d=w(w(c)?c.key<b+10:c)?c.G:null;if(w(d))return d;var e=Tn(null);fo.put(b,e);In(function(a,b,c){return function(){fo.remove(c);return ln(a)}}(e,d,b,c),a);return e};function ho(){var a=vc.a(1,0)?null:1;return Tn("number"===typeof a?new vn(un(a),a):a)}
(function io(b){"undefined"===typeof kn&&(kn=function(b,d,e){this.nc=b;this.Fa=d;this.hd=e;this.g=393216;this.C=0},kn.prototype.R=function(b,d){return new kn(this.nc,this.Fa,d)},kn.prototype.P=function(){return this.hd},kn.prototype.Ac=function(){return!0},kn.prototype.Bc=function(){return this.Fa},kn.ec=function(){return new R(null,3,5,S,[Uc(qk,new v(null,2,[ai,!0,Ee,tc(Fe,tc(new R(null,1,5,S,[Kk],null)))],null)),Kk,xa.Ed],null)},kn.tb=!0,kn.Za="cljs.core.async/t_cljs$core$async19240",kn.Pb=function(b,
d){return Tb(d,"cljs.core.async/t_cljs$core$async19240")});return new kn(io,b,V)})(function(){return null});var jo=W.b?W.b(V):W.call(null,V);function ko(a){return Te.l(jo,Q,Zg("animation"),a)}
function lo(){var a=1E3/30,b=ho();Hn(function(a,b){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!ke(e,Hi)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Zn(c),d=Hi;else throw f;}if(!ke(d,Hi))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.m=c;d.b=b;return d}()}(function(a,b){return function(a){var c=a[1];if(7===c)return c=a,c[2]=a[2],c[1]=4,Hi;if(20===c){var c=a[7],d=a[8],e=I(d),d=P(e,0),e=P(e,1),c=e.b?e.b(c):e.call(null,c);a[9]=d;a[1]=w(c)?22:23;return Hi}if(1===c)return c=go(0),Xn(a,2,c);if(24===c){var d=a[8],e=a[2],c=J(d),f;a[10]=0;a[11]=e;a[12]=0;a[13]=null;a[14]=c;a[2]=null;a[1]=8;return Hi}if(4===c)return c=a[2],Yn(a,c);if(15===c){e=a[10];f=a[12];
var d=a[13],c=a[14],g=a[2];a[10]=e+1;a[15]=g;a[12]=f;a[13]=d;a[14]=c;a[2]=null;a[1]=8;return Hi}return 21===c?(c=a[2],a[2]=c,a[1]=18,Hi):13===c?(a[2]=null,a[1]=15,Hi):22===c?(a[2]=null,a[1]=24,Hi):6===c?(a[2]=null,a[1]=7,Hi):25===c?(c=a[7],c+=b,a[16]=a[2],a[7]=c,a[2]=null,a[1]=3,Hi):17===c?(a[2]=null,a[1]=18,Hi):3===c?(c=K.b?K.b(jo):K.call(null,jo),c=H(c),a[1]=c?5:6,Hi):12===c?(c=a[2],a[2]=c,a[1]=9,Hi):2===c?(c=a[2],a[7]=0,a[17]=c,a[2]=null,a[1]=3,Hi):23===c?(d=a[9],c=Te.c(jo,rd,d),a[2]=c,a[1]=24,
Hi):19===c?(d=a[8],c=ec(d),d=fc(d),e=N(c),a[10]=0,a[12]=e,a[13]=c,a[14]=d,a[2]=null,a[1]=8,Hi):11===c?(c=a[14],c=H(c),a[8]=c,a[1]=c?16:17,Hi):9===c?(c=a[2],d=go(b),a[18]=c,Xn(a,25,d)):5===c?(c=K.b?K.b(jo):K.call(null,jo),c=H(c),a[10]=0,a[12]=0,a[13]=null,a[14]=c,a[2]=null,a[1]=8,Hi):14===c?(d=a[19],c=Te.c(jo,rd,d),a[2]=c,a[1]=15,Hi):16===c?(d=a[8],c=Cd(d),a[1]=c?19:20,Hi):10===c?(e=a[10],c=a[7],d=a[13],e=hb.a(d,e),d=P(e,0),e=P(e,1),c=e.b?e.b(c):e.call(null,c),a[19]=d,a[1]=w(c)?13:14,Hi):18===c?(c=
a[2],a[2]=c,a[1]=12,Hi):8===c?(e=a[10],f=a[12],c=e<f,a[1]=w(c)?10:11,Hi):null}}(a,b),a,b)}(),f=function(){var b=e.m?e.m():e.call(null);b[6]=a;return b}();return Wn(f)}}(b,a));return b}function mo(a){return a*a}
function no(a,b,c){var d=null!=c&&(c.g&64||c.F)?B.a(Sc,c):c,e=C.c(d,vk,0),f=C.a(d,Ki),g=C.c(d,Fi,Od);return function(c,d,e,f,g){return function(c){if(c<=e)return!0;if(c<e+f)return c=(c-e)/f,c=g.b?g.b(c):g.call(null,c),b.a?b.a(a,c):b.call(null,a,c),!0;b.a?b.a(a,1):b.call(null,a,1);return!1}}(c,d,e,f,g)}function oo(a,b){return function(c){return ko(no(c,a,b))}}
function po(a,b,c){return function(d){var e=function(c){return function(e,h){var l,m=a.getPointAtLength(h*c);l=Em.b?Em.b(m):Em.call(null,m);m=P(l,0);l=P(l,1);m=new R(null,2,5,S,[m,l],null);return b.a?b.a(d,m):b.call(null,d,m)}}(a.getTotalLength());return ko(no(d,e,c))}};function qo(a){var b=P(a,0);a=P(a,1);return[A(b),A(","),A(a)].join("")}function ro(a,b,c){var d=P(a,0);P(a,1);a=P(b,0);var e=P(b,1);b=P(c,0);c=P(c,1);var d=d-a,f=(e-c)/2*(d/Math.abs(d)),g=f/2,d=new R(null,2,5,S,[a+f,e],null);a=new R(null,2,5,S,[a-g,e],null);e=new R(null,2,5,S,[b-g,c],null);b=new R(null,2,5,S,[b+f,c],null);return[A("L"),A(qo(d)),A("C"),A(qo(a)),A(","),A(qo(e)),A(","),A(qo(b))].join("")}function so(a){return H(a)?B.c(A,"M",af(T.a(qo,a))):null}
function to(a,b){return[A("translate("),A(a),A(","),A(b),A(")")].join("")}
function uo(a){var b=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a,c=C.a(b,wi),d=C.a(b,Ck),e=C.a(b,Zj),f=C.a(b,xh),g=C.a(b,qi),h=c/2;return new R(null,4,5,S,[jj,new v(null,1,[Mh,to(h,h)],null),new R(null,2,5,S,[tk,new v(null,5,[xj,"die",Zj,-h,xh,-h,wi,c,Ck,c],null)],null),function(){return function(a,b,c,d,e,f,g,h,z){return function E(L){return new me(null,function(a,b,c,d,e){return function(){for(;;){var b=H(L);if(b){if(Cd(b)){var c=ec(b),d=N(c),f=qe(d);a:for(var g=0;;)if(g<d){var h=hb.a(c,g),l=P(h,0),h=P(h,
1),l=new R(null,2,5,S,[si,new v(null,3,[vj,a.b?a.b(l):a.call(null,l),yj,a.b?a.b(h):a.call(null,h),Fh,e/10],null)],null);f.add(l);g+=1}else{c=!0;break a}return c?re(f.W(),E(fc(b))):re(f.W(),null)}c=I(b);f=P(c,0);c=P(c,1);return M(new R(null,2,5,S,[si,new v(null,3,[vj,a.b?a.b(f):a.call(null,f),yj,a.b?a.b(c):a.call(null,c),Fh,e/10],null)],null),E(Gc(b)))}return null}}}(a,b,c,d,e,f,g,h,z),null,null)}}(Me(Sd,c/4),h,a,b,c,d,e,f,g)(Dm(g))}()],null)}
function vo(a,b){for(var c=a-10,d=md,e=!0,f=b-10;;)if(0<f)d=we.a(d,e?new R(null,2,5,S,[new R(null,2,5,S,[c,f],null),new R(null,2,5,S,[10,f],null)],null):new R(null,2,5,S,[new R(null,2,5,S,[10,f],null),new R(null,2,5,S,[c,f],null)],null)),e=!e,f-=20;else{c=S;a:for(e=P(d,0),f=Zd(d,1),d=[A("M"),A(qo(e))].join(""),P(f,0),P(f,1),Zd(f,2);;){var g=f,h=P(g,0),f=P(g,1),g=Zd(g,2),l;l=h;w(l)&&(l=f,l=w(l)?H(g):l);if(w(l))d=[A(d),A(ro(e,h,f))].join(""),e=f,f=g;else{d=w(h)?[A(d),A("L"),A(qo(h))].join(""):d;break a}}return new R(null,
2,5,c,[zh,new v(null,2,[xj,"penny-path",Vj,d],null)],null)}}function wo(a,b,c){a=a.getPointAtLength(c*b+20);return Em.b?Em.b(a):Em.call(null,a)}function xo(a,b,c){var d=P(a,0);a=P(a,1);return new R(null,4,5,S,[jj,new v(null,2,[Mh,to(d,a),Lj,w(c)?new Mm(c):null],null),new R(null,2,5,S,[si,new v(null,2,[xj,"penny fill",Fh,8],null)],null),vc.a(b,vi)?new R(null,2,5,S,[si,new v(null,2,[xj,"tracer",Fh,4],null)],null):null],null)}
function yo(a,b,c){var d=null!=c&&(c.g&64||c.F)?B.a(Sc,c):c,e=C.a(d,yk),f=C.a(d,Dk),g=C.a(d,Sh),h=C.a(d,Xh);return fb(fb(Hc,function(){var a=d.b?d.b(zh):d.call(null,zh);return w(a)?fb(fb(Hc,he(Oe(function(a,b,c,d,e,f,g,h,l){return function(E,L){var O=function(a,b,c,d,e,f,g){return function(b){return wo(a,b,g)}}(a,b,c,d,e,f,g,h,l);return xo(O(E),L,0<h?oo(function(a,b,c,d,e,f,g,h,l){return function(b,c){var d;d=E-c*l;d=-1>d?-1:d;var e=a(d),f=P(e,0),e=P(e,1);b.setAttribute("transform",to(f,e));return vc.a(-1,
d)?b.setAttribute("transform","scale(0)"):null}}(O,a,b,c,d,e,f,g,h,l),new v(null,1,[Ki,(K.b?K.b(sm):K.call(null,sm)).call(null,oj)],null)):null)}}(a,a,c,d,d,e,f,g,h),e))),he(Oe(function(){return function(a,b,c,d,e,f,g,h,l,E){return function(L,O){var Aa=wo(b,a+L,h),F=P(Aa,0),ka=P(Aa,1);return xo(new R(null,2,5,S,[F,E],null),O,oo(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){return function(a,c){return a.setAttribute("transform",to(b,r+c*d))}}(Aa,F,ka,ka-E,a,b,c,d,e,f,g,h,l,E),new v(null,3,[Ki,(K.b?K.b(sm):
K.call(null,sm)).call(null,ui),vk,50*L,Fi,mo],null)))}}(N(e),a,a,c,d,d,e,f,g,h)}(),d.b?d.b(bj):d.call(null,bj)))):null}()),vo(a,b))}
function zo(a,b,c,d){var e=b-20,f=S;a=new v(null,2,[xj,"spout",Mh,to(0,a)],null);var g=S,e=[A(so(new R(null,6,5,S,[new R(null,2,5,S,[b,-20],null),new R(null,2,5,S,[b,23],null),new R(null,2,5,S,[0,23],null),new R(null,2,5,S,[0,3],null),new R(null,2,5,S,[e,3],null),new R(null,2,5,S,[e,-20],null)],null))),A("Z")].join("");return new R(null,4,5,f,[jj,a,new R(null,2,5,g,[zh,new v(null,1,[Vj,e],null)],null),w(d)?new R(null,3,5,S,[Hk,new v(null,3,[xj,"infotext fill",Mh,to(b/2,23),Bi,-5],null),c],null):null],
null)}if("undefined"===typeof Ao)var Ao=function(){var a=W.b?W.b(V):W.call(null,V),b=W.b?W.b(V):W.call(null,V),c=W.b?W.b(V):W.call(null,V),d=W.b?W.b(V):W.call(null,V),e=C.c(V,nk,ih());return new th(Dc.a("pennygame.ui","station"),function(){return function(a){return Ii.b(a)}}(a,b,c,d,e),ki,e,a,b,c,d)}();vh(Ao,xi,function(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a,d=C.a(c,wi);C.a(c,Ij);var e=C.a(c,Xh),c=C.c(c,wk,V),c=c.a?c.a(Aj,0):c.call(null,Aj,0);return zo(10+e,d,0===c?"In":c,b)});
vh(Ao,Uh,function(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a,d=C.a(c,wi),e=C.a(c,Ij),f=Hc,g;g=c.b?c.b(Xh):c.call(null,Xh);g=zo(g,d,"",b);c=fb(fb(fb(f,g),yo(d,e,new v(null,6,[yk,c.b?c.b(yk):c.call(null,yk),Dk,c.b?c.b(Ah):c.call(null,Ah),Sh,w(c.b?c.b(Oi):c.call(null,Oi))?c.b?c.b(Zh):c.call(null,Zh):0,bj,w(c.b?c.b(Xj):c.call(null,Xj))?c.b?c.b(zk):c.call(null,zk):null,zh,Nm(c.b?c.b(wj):c.call(null,wj)),Xh,c.b?c.b(zi):c.call(null,zi)],null))),new R(null,2,5,S,[tk,new v(null,3,[xj,"bin",wi,d,Ck,e],null)],
null));a:for(f=md,g=!0,e-=20;;)if(0<e)f=ld.a(f,new R(null,2,5,S,[qj,new v(null,4,[xj,"shelf",Mh,to(0,e),bk,g?20:0,xk,g?d:d-20],null)],null)),g=!g,e-=20;else{d=new R(null,3,5,S,[jj,V,B.a(tc,f)],null);break a}return fb(c,d)});
vh(Ao,Nj,function(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a,d=C.a(c,wi),e=C.a(c,wj),f=C.a(c,Ij),g=C.a(c,zi),h=C.c(c,wk,V),l=C.a(c,zk),m=C.a(c,Xj),n=1/265*f*967;return fb(fb(fb(fb(Hc,w(b)?function(){var a=h.a?h.a(Ei,0):h.call(null,Ei,0),b=h.a?h.a(Gi,0):h.call(null,Gi,0);return new R(null,4,5,S,[jj,V,new R(null,3,5,S,[Hk,new v(null,2,[xj,"infotext fill",Bi,24],null),0===b?"Days":b],null),new R(null,3,5,S,[Hk,new v(null,4,[xj,"infotext fill",Qh,d,Bi,24,yh,"end"],null),0===a?"Out":a],null)],null)}():
null),new R(null,2,5,S,[Uj,new v(null,4,[Dj,truckSrc,Zj,d/2+n/2,wi,n,Ck,f],null)],null)),new R(null,2,5,S,[zh,new v(null,2,[xj,"ramp",Vj,[A("M"),A(qo(new R(null,2,5,S,[10,g],null))),A("C"),A(qo(new R(null,2,5,S,[10,f/2],null))),A(","),A(qo(new R(null,2,5,S,[10,f/2],null))),A(","),A(qo(new R(null,2,5,S,[d/2+n,f/2],null)))].join("")],null)],null)),function(){var b=Om(e);return w(w(b)?m:b)?Oe(function(a,b,c,d,e,f,g,h,l,m,n){return function(p,na){return xo(new R(null,2,5,S,[10,h],null),na,po(a,function(){return function(a,
b){var c=P(b,0),d=P(b,1);return a.setAttribute("transform",to(c,d))}}(a,b,c,d,e,f,g,h,l,m,n),new v(null,3,[Ki,(K.b?K.b(sm):K.call(null,sm)).call(null,ui),vk,50*p,Fi,mo],null)))}}(b,n,a,c,d,e,f,g,h,l,m),l):null}())});
function Bo(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a,d=C.a(c,mi),e=C.a(c,wi),f=C.a(c,Ck),g=C.a(c,Zj),h=C.a(c,Yh),l=C.a(c,Wh),m=H(l)?null==l?null:zb(l):null;return w(w(g)?d:g)?new R(null,4,5,S,[jj,new v(null,2,[xj,[A("scenario "),A($d(d))].join(""),Mh,to(g,0)],null),function(){return function(a,c,d,e,f,g,h,l,m){return function O(Aa){return new me(null,function(a,c,d,e,f,g,h,l,m){return function(){for(;;){var c=H(Aa);if(c){if(Cd(c)){var d=ec(c),e=N(d),f=qe(e);return function(){for(var c=0;;)if(c<
e){var g=hb.a(d,c),h=null!=g&&(g.g&64||g.F)?B.a(Sc,g):g,g=h,l=C.a(h,Ak),l=null!=l&&(l.g&64||l.F)?B.a(Sc,l):l,n=C.a(l,Ii),p=C.a(h,wj),q=C.a(h,xh),r=C.a(h,hk),h=f,l=S,n=new v(null,3,[wj,p,xj,[A($d(n)),A(" productivity-"),A($d(n)),A(" "),A(w(r)?"bottleneck":null)].join(""),Mh,to(0,q)],null);H(m)&&(g=Q.c(g,wk,a));g=Ao.a?Ao.a(g,b):Ao.call(null,g,b);h.add(new R(null,3,5,l,[jj,n,g],null));c+=1}else return!0}()?re(f.W(),O(fc(c))):re(f.W(),null)}var g=I(c),h=g=null!=g&&(g.g&64||g.F)?B.a(Sc,g):g,l=C.a(g,Ak),
l=null!=l&&(l.g&64||l.F)?B.a(Sc,l):l,l=C.a(l,Ii),n=C.a(g,wj),p=C.a(g,xh),g=C.a(g,hk);return M(new R(null,3,5,S,[jj,new v(null,3,[wj,n,xj,[A($d(l)),A(" productivity-"),A($d(l)),A(" "),A(w(g)?"bottleneck":null)].join(""),Mh,to(0,p)],null),H(m)?function(){var c=Q.c(h,wk,a);return Ao.a?Ao.a(c,b):Ao.call(null,c,b)}():Ao.a?Ao.a(h,b):Ao.call(null,h,b)],null),O(Gc(c)))}return null}}}(a,c,d,e,f,g,h,l,m),null,null)}}(m,a,c,d,e,f,g,h,l)(he(h))}(),w(b)?function(){var a=Si.a(m,0);return new R(null,3,5,S,[Hk,new v(null,
5,[xj,"infotext fill",Zj,e/2,xh,f/2,Bi,26,yh,"middle"],null),0===a?"WIP":a],null)}():null],null):null}
function Co(a,b,c){if(H(a)){var d=Jm(T.a(function(a){a=kd(Jk.b(a));a=b.b?b.b(a):b.call(null,a);return jd(a)},a));return function(a){return function g(d){return new me(null,function(){return function(){for(var a=d;;)if(a=H(a)){if(Cd(a)){var e=ec(a),n=N(e),p=qe(n);return function(){for(var a=0;;)if(a<n){var d=hb.a(e,a),g=P(d,0),g=null!=g&&(g.g&64||g.F)?B.a(Sc,g):g,h=C.a(g,Jk),d=P(d,1),g=function(){var a=kd(h);return b.b?b.b(a):b.call(null,a)}(),g=P(g,0);w(g)&&se(p,new R(null,3,5,S,[Hk,new v(null,3,
[xj,[A("label "),A("history")].join(""),Mh,to(g,d),Bi,7],null),function(){var a=jd(kd(h));return c.b?c.b(a):c.call(null,a)}()],null));a+=1}else return!0}()?re(p.W(),g(fc(a))):re(p.W(),null)}var q=I(a),r=P(q,0),r=null!=r&&(r.g&64||r.F)?B.a(Sc,r):r,u=C.a(r,Jk),q=P(q,1),r=function(){var a=kd(u);return b.b?b.b(a):b.call(null,a)}(),r=P(r,0);if(w(r))return M(new R(null,3,5,S,[Hk,new v(null,3,[xj,[A("label "),A("history")].join(""),Mh,to(r,q),Bi,7],null),function(){var a=jd(kd(u));return c.b?c.b(a):c.call(null,
a)}()],null),g(Gc(a)));a=Gc(a)}else return null}}(a),null,null)}}(d)(T.c(Df,a,d))}return null}
function Do(a,b,c){var d=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a,e=C.a(d,wi),f=C.a(d,Ck),g=C.a(d,Zj),h=C.a(d,xh),l=null!=c&&(c.g&64||c.F)?B.a(Sc,c):c,m=C.a(l,Xi),n=C.a(l,Bk),p=C.a(l,Yi),q=C.c(l,oi,Od),r=f-60,u=function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u){return function Da(z){return new me(null,function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u){return function(){for(;;){var y=H(z);if(y){var D=y;if(Cd(D)){var E=ec(D),F=N(E),L=qe(F);return function(){for(var z=0;;)if(z<F){var O=hb.a(E,z),U=P(O,0),X=P(O,
1);se(L,new v(null,2,[pk,U,Jk,Oe(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,z,y,D,E,F,L){return function(a,b){return new R(null,2,5,S,[a,L.b?L.b(b):L.call(null,b)],null)}}(z,O,U,X,E,F,L,D,y,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u),X)],null));z+=1}else return!0}()?re(L.W(),Da(fc(D))):re(L.W(),null)}var O=I(D),U=P(O,0),X=P(O,1);return M(new v(null,2,[pk,U,Jk,Oe(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,z,y){return function(a,b){return new R(null,2,5,S,[a,y.b?y.b(b):y.call(null,b)],null)}}(O,U,X,D,y,a,b,c,d,e,f,g,h,
l,m,n,p,q,r,u),X)],null),Da(Gc(D)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u),null,null)}}(30,50,r,a,d,e,f,g,h,c,l,m,n,p,q)(b)}(),y=Lm(T.a(Jk,u),new v(null,2,[wi,e-100,Ck,r],null),new v(null,2,[fk,md,Bk,n],null)),z=P(y,0),D=P(y,1),E=function(a,b,c,d,e,f,g){return function(a){return new R(null,2,5,S,[function(){var b=I(a);return f.b?f.b(b):f.call(null,b)}(),function(){var b=jd(a);return g.b?g.b(b):g.call(null,b)}()],null)}}(30,50,r,u,y,z,D,a,d,e,f,g,h,c,l,m,n,p,q);return new R(null,5,5,S,[jj,new v(null,
2,[xj,"graph",Mh,to(g,h)],null),new R(null,2,5,S,[tk,new v(null,2,[wi,e,Ck,f],null)],null),new R(null,3,5,S,[Hk,new v(null,4,[xj,"title",Zj,e/2,xh,f/2,Bi,10],null),p],null),new R(null,7,5,S,[jj,new v(null,1,[Mh,to(50,30)],null),function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,z,y,D,E,Wa){return function jb(Bb){return new me(null,function(a,b,c,d,e,f,g,h){return function(){for(;;){var a=H(Bb);if(a){if(Cd(a)){var b=ec(a),c=N(b),d=qe(c);a:for(var e=0;;)if(e<c){var f=hb.a(b,e),f=null!=f&&(f.g&
64||f.F)?B.a(Sc,f):f;C.a(f,pk);f=C.a(f,Jk);f=new R(null,2,5,S,[zh,new v(null,2,[xj,"stroke outline",Vj,so(T.a(h,f))],null)],null);d.add(f);e+=1}else{b=!0;break a}return b?re(d.W(),jb(fc(a))):re(d.W(),null)}d=I(a);d=null!=d&&(d.g&64||d.F)?B.a(Sc,d):d;C.a(d,pk);d=C.a(d,Jk);return M(new R(null,2,5,S,[zh,new v(null,2,[xj,"stroke outline",Vj,so(T.a(h,d))],null)],null),jb(Gc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,z,y,D,E,Wa),null,null)}}(30,50,r,u,y,z,D,E,a,d,e,f,g,h,c,l,m,n,p,q)(u)}(),function(){return function(a,
b,c,d,e,f,g,h,l,m,n,p,q,r,u,z,y,D,E,Wa){return function jb(Bb){return new me(null,function(a,b,c,d,e,f,g,h){return function(){for(;;){var a=H(Bb);if(a){if(Cd(a)){var b=ec(a),c=N(b),d=qe(c);a:for(var e=0;;)if(e<c){var f=hb.a(b,e),g=null!=f&&(f.g&64||f.F)?B.a(Sc,f):f,f=C.a(g,pk),g=C.a(g,Jk),f=new R(null,2,5,S,[zh,new v(null,2,[xj,[A("history stroke "),A($d(f))].join(""),Vj,so(T.a(h,g))],null)],null);d.add(f);e+=1}else{b=!0;break a}return b?re(d.W(),jb(fc(a))):re(d.W(),null)}d=I(a);b=null!=d&&(d.g&64||
d.F)?B.a(Sc,d):d;d=C.a(b,pk);b=C.a(b,Jk);return M(new R(null,2,5,S,[zh,new v(null,2,[xj,[A("history stroke "),A($d(d))].join(""),Vj,so(T.a(h,b))],null)],null),jb(Gc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,z,y,D,E,Wa),null,null)}}(30,50,r,u,y,z,D,E,a,d,e,f,g,h,c,l,m,n,p,q)(u)}(),Co(u,E,q),new R(null,2,5,S,[qj,new v(null,3,[xj,"axis",Mh,to(0,r),xk,e-100],null)],null),new R(null,2,5,S,[qj,new v(null,2,[xj,"axis",kk,r],null)],null)],null)],null)}
function Eo(a,b){var c=Fm(a),d=P(c,0),e=P(c,1),f=P(c,2),c=P(c,3);return new R(null,6,5,S,[jj,new v(null,1,[wj,"graphs"],null),Do(d,b,new v(null,3,[Yi,"Total Input",Xi,Aj,oi,Math.round],null)),Do(e,b,new v(null,3,[Yi,"Total Output",Xi,Ei,oi,Math.round],null)),Do(f,b,new v(null,4,[Yi,"Work in Progress",Xi,Si,Bk,new R(null,1,5,S,[0],null),oi,Math.round],null)),Do(c,b,new v(null,3,[Yi,"Days to Delivery",Xi,Gi,oi,Math.round],null))],null)}
function Fo(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a,d=C.a(c,dj),e=null!=d&&(d.g&64||d.F)?B.a(Sc,d):d,f=C.a(e,uk),g=C.a(e,Ti),h=C.a(c,lj),l=C.a(c,ci),m=C.a(c,Th);return new R(null,4,5,S,[fj,new v(null,1,[wj,"controls"],null),new R(null,9,5,S,[ri,new v(null,1,[Vi,"slidden"],null),new R(null,3,5,S,[fi,new v(null,1,[Ai,function(){return function(){return b.c?b.c(Ih,1,!0):b.call(null,Ih,1,!0)}}(a,c,d,e,f,g,h,l,m)],null),"Roll"],null),new R(null,3,5,S,[fi,new v(null,1,[Ai,function(){return function(){return b.c?
b.c(Ih,100,!0):b.call(null,Ih,100,!0)}}(a,c,d,e,f,g,h,l,m)],null),"Run"],null),new R(null,3,5,S,[fi,new v(null,1,[Ai,function(){return function(){return b.c?b.c(Ih,100,!1):b.call(null,Ih,100,!1)}}(a,c,d,e,f,g,h,l,m)],null),"Run Fast"],null),new R(null,3,5,S,[fi,new v(null,1,[Ai,function(){return function(){return b.a?b.a(Li,100):b.call(null,Li,100)}}(a,c,d,e,f,g,h,l,m)],null),"Run Instantly"],null),new R(null,3,5,S,[fi,new v(null,1,[Ai,function(a,c,d,e,f,g,h){return function(){var a=Ta(h);return b.a?
b.a(Hj,a):b.call(null,Hj,a)}}(a,c,d,e,f,g,h,l,m)],null),w(h)?"Hide info":"Show info"],null),new R(null,3,5,S,[fi,new v(null,1,[Ai,function(a,c,d,e,f,g,h,l){return function(){var a=Ta(l);return b.a?b.a(Rj,a):b.call(null,Rj,a)}}(a,c,d,e,f,g,h,l,m)],null),w(l)?"Hide graphs":"Show graphs"],null),w(l)?new R(null,3,5,S,[fi,new v(null,2,[$h,function(){var a=0===f;return a?a:m}(),Ai,function(a,c,d,e,f,g){return function(){var a=Ta(g);return b.a?b.a(Ti,a):b.call(null,Ti,a)}}(a,c,d,e,f,g,h,l,m)],null),w(g)?
"Hide averages":"Average"],null):null],null),new R(null,8,5,S,[ri,new v(null,1,[Vi,"slidden"],null),new R(null,3,5,S,[fi,new v(null,1,[Ai,function(){return function(){return b.c?b.c(Ej,Tj,0):b.call(null,Ej,Tj,0)}}(a,c,d,e,f,g,h,l,m)],null),"Basic"],null),new R(null,3,5,S,[fi,new v(null,1,[Ai,function(){return function(){return b.c?b.c(Ej,bi,1):b.call(null,Ej,bi,1)}}(a,c,d,e,f,g,h,l,m)],null),"Efficient"],null),new R(null,3,5,S,[fi,new v(null,1,[Ai,function(){return function(){return b.c?b.c(Ej,Ni,
2):b.call(null,Ej,Ni,2)}}(a,c,d,e,f,g,h,l,m)],null),"Constrained"],null),new R(null,2,5,S,[Gh,V],null),new R(null,3,5,S,[fi,new v(null,1,[Ai,function(){return function(){return b.b?b.b(ei):b.call(null,ei)}}(a,c,d,e,f,g,h,l,m)],null),"Reset"],null),new R(null,3,5,S,[fi,new v(null,1,[Ai,function(){return function(){return b.b?b.b(Jh):b.call(null,Jh)}}(a,c,d,e,f,g,h,l,m)],null),"Generate New"],null)],null)],null)}
function Go(){var a=K.b?K.b(Ho):K.call(null,Ho),b=Z,c=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a,d=C.a(c,dj),e=null!=d&&(d.g&64||d.F)?B.a(Sc,d):d,f=C.a(e,wi),g=C.a(e,Ck),h=C.a(e,uk),l=C.a(e,jk),m=C.a(e,ni),n=C.a(e,Ti),p=C.a(c,lj),q=C.a(c,ci);return new R(null,5,5,S,[mk,V,new R(null,3,5,S,[fj,new v(null,1,[ej,new v(null,3,[Qj,ik,Ek,"5px",gi,"5px"],null)],null),new R(null,4,5,S,[fj,V,new R(null,3,5,S,[Ik,V,h],null)," days"],null)],null),Fo(c,b),new R(null,6,5,S,[Gj,new v(null,3,[wj,"space",wi,"100%",Ck,"99%"],
null),new R(null,3,5,S,[Bj,V,new R(null,6,5,S,[Fk,new v(null,6,[wj,"caution",Zj,0,xh,0,wi,30,Ck,30,Oh,"userSpaceOnUse"],null),new R(null,2,5,S,[tk,new v(null,3,[wi,30,Ck,30,pi,"#777"],null)],null),new R(null,2,5,S,[qj,new v(null,6,[bk,-10,ti,10,xk,10,kk,-10,Hh,"yellow",rj,10],null)],null),new R(null,2,5,S,[qj,new v(null,6,[bk,0,ti,30,xk,30,kk,0,Hh,"yellow",rj,10],null)],null),new R(null,2,5,S,[qj,new v(null,6,[bk,20,ti,40,xk,40,kk,20,Hh,"yellow",rj,10],null)],null)],null)],null),function(){return function(a,
b,c,d,e,f,g,h,l,m,n,p,q,X){return function ia(ja){return new me(null,function(){return function(){for(;;){var a=H(ja);if(a){if(Cd(a)){var b=ec(a),c=N(b),d=qe(c);a:for(var e=0;;)if(e<c){var f=hb.a(b,e),g=null!=f&&(f.g&64||f.F)?B.a(Sc,f):f,f=g,h=C.a(g,Zj),g=C.a(g,xh),f=w(h)?new R(null,3,5,S,[jj,new v(null,1,[Mh,to(h,g)],null),uo(f)],null):null;d.add(f);e+=1}else{b=!0;break a}return b?re(d.W(),ia(fc(a))):re(d.W(),null)}d=I(a);d=c=null!=d&&(d.g&64||d.F)?B.a(Sc,d):d;b=C.a(c,Zj);c=C.a(c,xh);return M(w(b)?
new R(null,3,5,S,[jj,new v(null,1,[Mh,to(b,c)],null),uo(d)],null):null,ia(Gc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,X),null,null)}}(a,c,c,d,e,e,f,g,h,l,m,n,p,q)(l)}(),T.a(function(a,b,c,d,e,f,g,h,l,m,n,p,q){return function(a){return Bo(a,q)}}(a,c,c,d,e,e,f,g,h,l,m,n,p,q),m),w(w(f)?w(g)?q:g:f)?Eo(new R(null,2,5,S,[f,g],null),w(n)?n:en(e)):null],null)],null)};Fa=!1;Ba=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new Fc(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,Oa.b?Oa.b(a):Oa.call(null,a))}a.w=0;a.B=function(a){a=H(a);return b(a)};a.h=b;return a}();
Ea=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new Fc(e,0)}return b.call(this,d)}function b(a){return console.error.apply(console,Oa.b?Oa.b(a):Oa.call(null,a))}a.w=0;a.B=function(a){a=H(a);return b(a)};a.h=b;return a}();
function Io(a){var b="undefined"!==typeof document.hidden?"visibilitychange":"undefined"!==typeof document.webkitHidden?"webkitvisibilitychange":"undefined"!==typeof document.mozHidden?"mozvisibilitychange":"undefined"!==typeof document.msHidden?"msvisibilitychange":null;return document.addEventListener(b,function(b){return function e(){a.m?a.m():a.call(null);return document.removeEventListener(b,e)}}(b))}
function Jo(a,b){var c=null!=b&&(b.g&64||b.F)?B.a(Sc,b):b,d=C.a(c,wi),e=C.a(c,Zj),f=We(1,Yh.b(I(cf(mi,ni.b(a))))),g=T.a(Ck,f),h=T.a(xh,f);return kf.A(a,jk,Me(T,function(a,b,c,d,e,f,g){return function(a,b,c){return Q.h(a,Zj,g,G([xh,b+c+(0-f/2-20),wi,f,Ck,f],0))}}(f,g,h,b,c,d,e)),h,g)}
if("undefined"===typeof Ho){var Ho,Ko,Lo;var Mo=location.hash,No=/#/;if("string"===typeof No)Lo=Mo.replace(new RegExp(String(No).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08"),"g"),"");else if(No instanceof RegExp)Lo=Mo.replace(new RegExp(No.source,"g"),"");else throw[A("Invalid match arg: "),A(No)].join("");var Oo=Lo;Ko=w(/^[\s\xa0]*$/.test(null==Oo?"":String(Oo)))?null:parseInt(Lo);var Po=w(Ko)?Ko:fh();location.hash=Po;var Qo=new v(null,3,[ni,new R(null,3,5,S,[null,null,
null],null),Ui,Po,wh,bn(Po)],null);Ho=W.b?W.b(Qo):W.call(null,Qo)}
if("undefined"===typeof Z)var Z=function(){var a=W.b?W.b(V):W.call(null,V),b=W.b?W.b(V):W.call(null,V),c=W.b?W.b(V):W.call(null,V),d=W.b?W.b(V):W.call(null,V),e=C.c(V,nk,ih());return new th(Dc.a("pennygame.core","emit"),function(){return function(){function a(b,c){if(1<arguments.length)for(var d=0,e=Array(arguments.length-1);d<e.length;)e[d]=arguments[d+1],++d;return b}a.w=1;a.B=function(a){var b=I(a);Gc(a);return b};a.h=function(a){return a};return a}()}(a,b,c,d,e),ki,e,a,b,c,d)}();
function Ro(a,b){var c=ho();Hn(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!ke(e,Hi)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Zn(c),d=Hi;else throw f;}if(!ke(d,Hi))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.m=c;d.b=b;return d}()}(function(){return function(c){var d=c[1];if(7===d)return c[2]=null,c[1]=8,Hi;if(1===d){var d=Z.b?Z.b(Pj):Z.call(null,Pj),e=Z.b?Z.b(Ch):Z.call(null,Ch);c[7]=d;c[8]=e;c[1]=w(b)?2:3;return Hi}if(4===d){var d=c[2],e=Z.b?Z.b(Oj):Z.call(null,Oj),f=Z.b?Z.b(mj):Z.call(null,mj),n=Z.b?Z.b(nj):Z.call(null,nj);c[9]=e;c[10]=d;c[11]=f;c[12]=n;c[1]=w(b)?6:7;return Hi}return 15===d?(d=Z.a?Z.a(Zi,!1):Z.call(null,
Zi,!1),c[2]=d,c[1]=16,Hi):13===d?(d=c[2],c[2]=d,c[1]=12,Hi):6===d?(d=Z.a?Z.a(bj,!0):Z.call(null,bj,!0),e=lo(),c[13]=d,Xn(c,9,e)):3===d?(c[2]=null,c[1]=4,Hi):12===d?(d=c[14],d=c[2],e=a-1,c[14]=e,c[15]=d,c[1]=w(0<e)?14:15,Hi):2===d?(d=Z.a?Z.a(Sh,!0):Z.call(null,Sh,!0),e=lo(),c[16]=d,Xn(c,5,e)):11===d?(d=K.b?K.b(sm):K.call(null,sm),d=d.b?d.b(uk):d.call(null,uk),d=go(d),Xn(c,13,d)):9===d?(e=c[2],d=Z.a?Z.a(bj,!1):Z.call(null,bj,!1),c[17]=e,c[2]=d,c[1]=8,Hi):5===d?(e=c[2],d=Z.a?Z.a(Sh,!1):Z.call(null,Sh,
!1),c[18]=e,c[2]=d,c[1]=4,Hi):14===d?(d=c[14],d=Z.c?Z.c(ak,d,b):Z.call(null,ak,d,b),c[2]=d,c[1]=16,Hi):16===d?(d=c[2],Yn(c,d)):10===d?(c[2]=null,c[1]=12,Hi):8===d?(d=c[2],e=Z.b?Z.b(sk):Z.call(null,sk),f=Z.b?Z.b(kj):Z.call(null,kj),c[19]=d,c[20]=f,c[21]=e,c[1]=w(b)?10:11,Hi):null}}(c),c)}(),f=function(){var a=e.m?e.m():e.call(null);a[6]=c;return a}();return Wn(f)}}(c))}
var So=function So(){var b=ho();Hn(function(b){return function(){var d=function(){return function(b){return function(){function c(d){for(;;){var e;a:try{for(;;){var g=b(d);if(!ke(g,Hi)){e=g;break a}}}catch(h){if(h instanceof Object)d[5]=h,Zn(d),e=Hi;else throw h;}if(!ke(e,Hi))return e}}function d(){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];b[0]=e;b[1]=1;return b}var e=null,e=function(b){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,
b)}throw Error("Invalid arity: "+arguments.length);};e.m=d;e.b=c;return e}()}(function(b){return function(c){var d=c[1];if(7===d){var e=c[7],e=e.getBoundingClientRect();c[2]=e;c[1]=8;return Hi}if(1===d)return e=go(50),Xn(c,2,e);if(4===d)return e=document.getElementById("space"),c[2]=e,c[1]=5,Hi;if(15===d){var e=c[2],m=Z.b?Z.b(lk):Z.call(null,lk),n=go(100);c[8]=m;c[9]=e;return Xn(c,16,n)}if(13===d)return e=Io(So),c[2]=e,c[1]=14,Hi;if(6===d)return c[2]=null,c[1]=8,Hi;if(3===d)return c[2]=null,c[1]=
5,Hi;if(12===d)return e=c[10],m=c[11],e=Z.c?Z.c(Wi,m,e):Z.call(null,Wi,m,e),m=go(100),c[12]=e,Xn(c,15,m);if(2===d){var p=c[2],q=function(){return function(){return function(b){return b.width}}(p,d,b)}(),e=Mg(q,function(){return function(){return function(b){return b.height}}(p,q,d,b)}()),m=null==document;c[13]=p;c[14]=e;c[1]=w(m)?3:4;return Hi}return 11===d?(n=c[2],m=P(n,0),e=P(n,1),c[10]=e,c[11]=m,c[1]=w(n)?12:13,Hi):9===d?(c[2]=null,c[1]=11,Hi):5===d?(e=c[7],e=c[2],c[7]=e,c[1]=w(null==e)?6:7,Hi):
14===d?(e=c[2],Yn(c,e)):16===d?(m=c[2],e=Z.b?Z.b(nj):Z.call(null,nj),c[15]=m,c[2]=e,c[1]=14,Hi):10===d?(m=c[16],e=c[14],e=e.b?e.b(m):e.call(null,m),c[2]=e,c[1]=11,Hi):8===d?(m=c[16],e=c[2],c[16]=e,c[1]=w(null==e)?9:10,Hi):null}}(b),b)}(),e=function(){var e=d.m?d.m():d.call(null);e[6]=b;return e}();return Wn(e)}}(b));return b};
function To(a,b,c){var d=jn(c),e=c.b?c.b(uk):c.call(null,uk),f=ho();Hn(function(d,e,f,m){return function(){var n=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!ke(e,Hi)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Zn(c),d=Hi;else throw f;}if(!ke(d,Hi))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.m=c;d.b=b;return d}()}(function(d,e,f,g){return function(d){var h=d[1];if(1===h){var h=en(c),h=Z.a?Z.a(Wj,h):Z.call(null,Wj,h),l=go(g);d[7]=h;return Xn(d,2,l)}return 2===h?(d[8]=d[2],d[9]=0,d[2]=null,d[1]=3,Hi):3===h?(h=d[9],d[1]=w(50>h)?5:6,Hi):4===h?(h=d[2],Yn(d,h)):5===h?(h=dn(a,f,b),h=e.b?e.b(h):e.call(null,h),h=Z.a?Z.a(Wj,h):Z.call(null,Wj,h),l=go(g),d[10]=h,Xn(d,8,l)):6===h?(d[2]=null,d[1]=7,Hi):7===h?(h=d[2],d[2]=
h,d[1]=4,Hi):8===h?(h=d[9],d[11]=d[2],d[9]=h+1,d[2]=null,d[1]=3,Hi):null}}(d,e,f,m),d,e,f,m)}(),p=function(){var a=n.m?n.m():n.call(null);a[6]=d;return a}();return Wn(p)}}(f,d,e,100))}function Uo(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;return Vo(0<b.length?new Fc(b.slice(0),0):null)}function Vo(a){return yg.h(G([new v(null,2,[qi,0,Ii,Uh],null),B.a(Sc,a)],0))}
vh(Z,Ej,function(a,b,c){So();return Te.a(Ho,function(a){var e=kf.c(a.b?a.b(ni):a.call(null,ni),c,function(a){return w(a)?null:Vm.b?Vm.b(b):Vm.call(null,b)}),f=Wl(new v(null,3,[uk,0,jk,new R(null,5,5,S,[Vo(G([Ii,xi],0)),Uo(),Uo(),Uo(),Uo()],null),ni,T.a(function(){return function(a){return w(a)?a:Qm()}}(e),e)],null));return Q.h(a,dj,f,G([Qi,f,ni,e,Th,!1],0))})});
vh(Z,Wi,function(a,b,c){return Te.a(Ho,function(a){return function(e){return kf.l(jf.c(hf(hf(e,new R(null,2,5,S,[dj,wi],null),b),new R(null,2,5,S,[dj,Ck],null),c),new R(null,2,5,S,[dj,ni],null),Me(Ul,new v(null,3,[Zj,a,wi,b-a,Ck,c],null))),dj,Jo,new v(null,2,[Zj,45,wi,a-90],null))}}(150))});vh(Z,lk,function(){return Te.h(Ho,kf,dj,Yl,G([function(a){a=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a;var b=C.a(a,wj),b=Nm(b);return w(b)?Q.c(a,Jj,b.getTotalLength()):a}],0))});
vh(Z,nj,function(){return Te.l(Ho,kf,dj,nm)});vh(Z,Pj,function(){return Te.a(Ho,function(a){var b=a.b?a.b(wh):a.call(null,wh);return kf.l(jf.c(a,new R(null,2,5,S,[dj,uk],null),Vc),dj,$l,Ye(function(a){return function(){var b=(6*an(a)|0)+1,e=G([tc(ek,tc(Sj,hi,6))," \x3d\x3e ",b],0),f=Q.c(Ia(),Ka,!1),e=Wg(e,f);Ba.b?Ba.b(e):Ba.call(null,e);w(Fa)&&(e=Ia(),Ba.b?Ba.b("\n"):Ba.call(null,"\n"),C.a(e,Ja));return b}}(b)))})});vh(Z,Ih,function(a,b,c){Ro(b,c);return Te.l(Ho,Q,Th,!0)});
vh(Z,Ch,function(){return Te.l(Ho,kf,dj,cm)});vh(Z,Sh,function(a,b){return Te.h(Ho,kf,dj,Yl,G([function(a){return Q.c(a,Oi,b)}],0))});vh(Z,Oj,function(){return Te.l(Ho,kf,dj,mm)});vh(Z,mj,function(){return Te.l(Ho,kf,dj,om)});vh(Z,bj,function(a,b){return Te.h(Ho,kf,dj,Yl,G([function(a){return Q.c(a,Xj,b)}],0))});vh(Z,sk,function(){return Te.l(Ho,kf,dj,pm)});vh(Z,kj,function(){return Te.l(Ho,kf,dj,rm)});vh(Z,Zi,function(a,b){return Te.l(Ho,Q,Th,b)});
vh(Z,ak,function(a,b,c){w((K.b?K.b(Ho):K.call(null,Ho)).call(null,Th))&&Ro(b,c);return K.b?K.b(Ho):K.call(null,Ho)});vh(Z,Li,function(a,b){return Te.l(Ho,kf,dj,function(a){return dn((K.b?K.b(Ho):K.call(null,Ho)).call(null,wh),b,a)})});vh(Z,Hj,function(a,b){return Te.l(Ho,Q,lj,b)});vh(Z,Rj,function(a,b){return Te.l(Ho,Q,ci,b)});
vh(Z,Ti,function(a,b){if(w(b)){var c=K.b?K.b(Ho):K.call(null,Ho),d=null!=c&&(c.g&64||c.F)?B.a(Sc,c):c,c=C.a(d,wh),e=C.a(d,dj),d=C.a(d,Qi);To(c,d,e);return K.b?K.b(Ho):K.call(null,Ho)}return Te.h(Ho,kf,dj,rd,G([Ti],0))});vh(Z,Wj,function(a,b){return Te.l(Ho,hf,new R(null,2,5,S,[dj,Ti],null),b)});vh(Z,ei,function(){Te.a(Ho,function(a){return Q.h(a,dj,a.b?a.b(Qi):a.call(null,Qi),G([wh,bn(a.b?a.b(Ui):a.call(null,Ui))],0))});return So()});
vh(Z,Jh,function(){var a=fh();location.hash=a;Te.a(Ho,function(a){return function(c){return Q.h(c,dj,c.b?c.b(Qi):c.call(null,Qi),G([Ui,a,wh,bn(a)],0))}}(a));return So()});if("undefined"===typeof Wo)var Wo=function(a){return function(){var b=Go();return a.b?a.b(b):a.call(null,b)}}(Cm());if("undefined"===typeof Xo){var Xo,Yo=Ho;Wb(Yo,dk,function(a,b,c,d){return Wo.b?Wo.b(d):Wo.call(null,d)});Xo=Yo}
if("undefined"===typeof Zo){var Zo;Z.c?Z.c(Ej,Tj,0):Z.call(null,Ej,Tj,0);Z.c?Z.c(Ej,bi,1):Z.call(null,Ej,bi,1);Z.c?Z.c(Ej,Ni,2):Z.call(null,Ej,Ni,2);Zo=Z.a?Z.a(Hj,!0):Z.call(null,Hj,!0)}var $o=K.b?K.b(Ho):K.call(null,Ho);Wo.b?Wo.b($o):Wo.call(null,$o);