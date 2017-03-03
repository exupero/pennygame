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
function u(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function ca(a){return"function"==u(a)}var da="closure_uid_"+(1E9*Math.random()>>>0),ea=0;function fa(a,b,c){return a.call.apply(a.bind,arguments)}function ga(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}
function ma(a,b,c){ma=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?fa:ga;return ma.apply(null,arguments)};function pa(a,b){for(var c in a)b.call(void 0,a[c],c,a)};function qa(a,b){null!=a&&this.append.apply(this,arguments)}k=qa.prototype;k.bb="";k.set=function(a){this.bb=""+a};k.append=function(a,b,c){this.bb+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.bb+=arguments[d];return this};k.clear=function(){this.bb=""};k.toString=function(){return this.bb};function ra(a,b){a.sort(b||sa)}function ua(a,b){for(var c=0;c<a.length;c++)a[c]={index:c,value:a[c]};var d=b||sa;ra(a,function(a,b){return d(a.value,b.value)||a.index-b.index});for(c=0;c<a.length;c++)a[c]=a[c].value}function sa(a,b){return a>b?1:a<b?-1:0};var va={},wa;if("undefined"===typeof xa)var xa=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof Aa)var Aa=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var Ba=null;if("undefined"===typeof Ea)var Ea=null;function Fa(){return new v(null,5,[Ga,!0,Ha,!0,Ia,!1,Ja,!1,Ka,null],null)}La;function x(a){return null!=a&&!1!==a}Ma;y;function Na(a){return null==a}function Pa(a){return a instanceof Array}
function Qa(a){return null==a?!0:!1===a?!0:!1}function Ra(a,b){return a[u(null==b?null:b)]?!0:a._?!0:!1}function Sa(a,b){var c=null==b?null:b.constructor,c=x(x(c)?c.sb:c)?c.Za:u(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function Ta(a){var b=a.Za;return x(b)?b:""+A(a)}var Ua="undefined"!==typeof Symbol&&"function"===u(Symbol)?Symbol.iterator:"@@iterator";function Wa(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}B;Xa;
var La=function La(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return La.b(arguments[0]);case 2:return La.a(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};La.b=function(a){return La.a(null,a)};La.a=function(a,b){function c(a,b){a.push(b);return a}var d=[];return Xa.c?Xa.c(c,d,b):Xa.call(null,c,d,b)};La.w=2;function Ya(){}function Za(){}
var $a=function $a(b){if(null!=b&&null!=b.Z)return b.Z(b);var c=$a[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=$a._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("ICounted.-count",b);},ab=function ab(b){if(null!=b&&null!=b.ca)return b.ca(b);var c=ab[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ab._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IEmptyableCollection.-empty",b);};function bb(){}
var cb=function cb(b,c){if(null!=b&&null!=b.X)return b.X(b,c);var d=cb[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=cb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("ICollection.-conj",b);};function db(){}
var eb=function eb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return eb.a(arguments[0],arguments[1]);case 3:return eb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
eb.a=function(a,b){if(null!=a&&null!=a.ba)return a.ba(a,b);var c=eb[u(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=eb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Sa("IIndexed.-nth",a);};eb.c=function(a,b,c){if(null!=a&&null!=a.Ea)return a.Ea(a,b,c);var d=eb[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=eb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Sa("IIndexed.-nth",a);};eb.w=3;function fb(){}
var gb=function gb(b){if(null!=b&&null!=b.ta)return b.ta(b);var c=gb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=gb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("ISeq.-first",b);},jb=function jb(b){if(null!=b&&null!=b.xa)return b.xa(b);var c=jb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=jb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("ISeq.-rest",b);};function kb(){}function lb(){}
var mb=function mb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return mb.a(arguments[0],arguments[1]);case 3:return mb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
mb.a=function(a,b){if(null!=a&&null!=a.N)return a.N(a,b);var c=mb[u(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=mb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Sa("ILookup.-lookup",a);};mb.c=function(a,b,c){if(null!=a&&null!=a.I)return a.I(a,b,c);var d=mb[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=mb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Sa("ILookup.-lookup",a);};mb.w=3;function nb(){}
var ob=function ob(b,c){if(null!=b&&null!=b.gc)return b.gc(b,c);var d=ob[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=ob._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("IAssociative.-contains-key?",b);},pb=function pb(b,c,d){if(null!=b&&null!=b.Ra)return b.Ra(b,c,d);var e=pb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=pb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Sa("IAssociative.-assoc",b);};function qb(){}
var rb=function rb(b,c){if(null!=b&&null!=b.rb)return b.rb(b,c);var d=rb[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=rb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("IMap.-dissoc",b);};function sb(){}
var tb=function tb(b){if(null!=b&&null!=b.Hb)return b.Hb(b);var c=tb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=tb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IMapEntry.-key",b);},ub=function ub(b){if(null!=b&&null!=b.Ib)return b.Ib(b);var c=ub[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ub._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IMapEntry.-val",b);};function vb(){}
var wb=function wb(b){if(null!=b&&null!=b.cb)return b.cb(b);var c=wb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=wb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IStack.-peek",b);};function xb(){}
var yb=function yb(b,c,d){if(null!=b&&null!=b.eb)return b.eb(b,c,d);var e=yb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=yb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Sa("IVector.-assoc-n",b);},zb=function zb(b){if(null!=b&&null!=b.Eb)return b.Eb(b);var c=zb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=zb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IDeref.-deref",b);};function Ab(){}
var Cb=function Cb(b){if(null!=b&&null!=b.P)return b.P(b);var c=Cb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Cb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IMeta.-meta",b);},Db=function Db(b,c){if(null!=b&&null!=b.R)return b.R(b,c);var d=Db[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Db._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("IWithMeta.-with-meta",b);};function Eb(){}
var Fb=function Fb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Fb.a(arguments[0],arguments[1]);case 3:return Fb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
Fb.a=function(a,b){if(null!=a&&null!=a.ea)return a.ea(a,b);var c=Fb[u(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=Fb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Sa("IReduce.-reduce",a);};Fb.c=function(a,b,c){if(null!=a&&null!=a.fa)return a.fa(a,b,c);var d=Fb[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=Fb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Sa("IReduce.-reduce",a);};Fb.w=3;
var Gb=function Gb(b,c,d){if(null!=b&&null!=b.Gb)return b.Gb(b,c,d);var e=Gb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Gb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Sa("IKVReduce.-kv-reduce",b);},Hb=function Hb(b,c){if(null!=b&&null!=b.D)return b.D(b,c);var d=Hb[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Hb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("IEquiv.-equiv",b);},Jb=function Jb(b){if(null!=b&&null!=b.S)return b.S(b);
var c=Jb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Jb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IHash.-hash",b);};function Kb(){}var Lb=function Lb(b){if(null!=b&&null!=b.U)return b.U(b);var c=Lb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Lb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("ISeqable.-seq",b);};function Mb(){}function Nb(){}function Ob(){}
var Pb=function Pb(b){if(null!=b&&null!=b.Xb)return b.Xb(b);var c=Pb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Pb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IReversible.-rseq",b);},Qb=function Qb(b,c){if(null!=b&&null!=b.wc)return b.wc(0,c);var d=Qb[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Qb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("IWriter.-write",b);},Rb=function Rb(b,c,d){if(null!=b&&null!=b.L)return b.L(b,c,d);
var e=Rb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Rb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Sa("IPrintWithWriter.-pr-writer",b);},Sb=function Sb(b,c,d){if(null!=b&&null!=b.vc)return b.vc(0,c,d);var e=Sb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Sb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Sa("IWatchable.-notify-watches",b);},Tb=function Tb(b,c,d){if(null!=b&&null!=b.uc)return b.uc(0,c,d);var e=Tb[u(null==
b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Tb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Sa("IWatchable.-add-watch",b);},Ub=function Ub(b){if(null!=b&&null!=b.pb)return b.pb(b);var c=Ub[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Ub._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IEditableCollection.-as-transient",b);},Vb=function Vb(b,c){if(null!=b&&null!=b.Mb)return b.Mb(b,c);var d=Vb[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,
c):d.call(null,b,c);d=Vb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("ITransientCollection.-conj!",b);},Wb=function Wb(b){if(null!=b&&null!=b.Nb)return b.Nb(b);var c=Wb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Wb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("ITransientCollection.-persistent!",b);},Xb=function Xb(b,c,d){if(null!=b&&null!=b.Lb)return b.Lb(b,c,d);var e=Xb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Xb._;if(null!=
e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Sa("ITransientAssociative.-assoc!",b);},Yb=function Yb(b,c,d){if(null!=b&&null!=b.tc)return b.tc(0,c,d);var e=Yb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Yb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Sa("ITransientVector.-assoc-n!",b);};function Zb(){}
var $b=function $b(b,c){if(null!=b&&null!=b.ob)return b.ob(b,c);var d=$b[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=$b._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("IComparable.-compare",b);},ac=function ac(b){if(null!=b&&null!=b.qc)return b.qc();var c=ac[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ac._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IChunk.-drop-first",b);},bc=function bc(b){if(null!=b&&null!=b.ic)return b.ic(b);
var c=bc[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=bc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IChunkedSeq.-chunked-first",b);},cc=function cc(b){if(null!=b&&null!=b.jc)return b.jc(b);var c=cc[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=cc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IChunkedSeq.-chunked-rest",b);},dc=function dc(b){if(null!=b&&null!=b.hc)return b.hc(b);var c=dc[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,
b);c=dc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IChunkedNext.-chunked-next",b);},ec=function ec(b){if(null!=b&&null!=b.Jb)return b.Jb(b);var c=ec[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ec._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("INamed.-name",b);},fc=function fc(b){if(null!=b&&null!=b.Kb)return b.Kb(b);var c=fc[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=fc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("INamed.-namespace",
b);},gc=function gc(b,c){if(null!=b&&null!=b.Tc)return b.Tc(b,c);var d=gc[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=gc._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("IReset.-reset!",b);},hc=function hc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return hc.a(arguments[0],arguments[1]);case 3:return hc.c(arguments[0],arguments[1],arguments[2]);case 4:return hc.l(arguments[0],arguments[1],arguments[2],
arguments[3]);case 5:return hc.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};hc.a=function(a,b){if(null!=a&&null!=a.Vc)return a.Vc(a,b);var c=hc[u(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=hc._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Sa("ISwap.-swap!",a);};
hc.c=function(a,b,c){if(null!=a&&null!=a.Wc)return a.Wc(a,b,c);var d=hc[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=hc._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Sa("ISwap.-swap!",a);};hc.l=function(a,b,c,d){if(null!=a&&null!=a.Xc)return a.Xc(a,b,c,d);var e=hc[u(null==a?null:a)];if(null!=e)return e.l?e.l(a,b,c,d):e.call(null,a,b,c,d);e=hc._;if(null!=e)return e.l?e.l(a,b,c,d):e.call(null,a,b,c,d);throw Sa("ISwap.-swap!",a);};
hc.A=function(a,b,c,d,e){if(null!=a&&null!=a.Yc)return a.Yc(a,b,c,d,e);var f=hc[u(null==a?null:a)];if(null!=f)return f.A?f.A(a,b,c,d,e):f.call(null,a,b,c,d,e);f=hc._;if(null!=f)return f.A?f.A(a,b,c,d,e):f.call(null,a,b,c,d,e);throw Sa("ISwap.-swap!",a);};hc.w=5;var ic=function ic(b){if(null!=b&&null!=b.Ha)return b.Ha(b);var c=ic[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ic._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IIterable.-iterator",b);};
function jc(a){this.ld=a;this.g=1073741824;this.C=0}jc.prototype.wc=function(a,b){return this.ld.append(b)};function kc(a){var b=new qa;a.L(null,new jc(b),Fa());return""+A(b)}var lc="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function mc(a){a=lc(a|0,-862048943);return lc(a<<15|a>>>-15,461845907)}
function nc(a,b){var c=(a|0)^(b|0);return lc(c<<13|c>>>-13,5)+-430675100|0}function oc(a,b){var c=(a|0)^b,c=lc(c^c>>>16,-2048144789),c=lc(c^c>>>13,-1028477387);return c^c>>>16}function pc(a){var b;a:{b=1;for(var c=0;;)if(b<a.length){var d=b+2,c=nc(c,mc(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^mc(a.charCodeAt(a.length-1)):b;return oc(b,lc(2,a.length))}qc;rc;sc;tc;var uc={},vc=0;
function wc(a){255<vc&&(uc={},vc=0);var b=uc[a];if("number"!==typeof b){a:if(null!=a)if(b=a.length,0<b)for(var c=0,d=0;;)if(c<b)var e=c+1,d=lc(31,d)+a.charCodeAt(c),c=e;else{b=d;break a}else b=0;else b=0;uc[a]=b;vc+=1}return a=b}function xc(a){null!=a&&(a.g&4194304||a.sd)?a=a.S(null):"number"===typeof a?a=Math.floor(a)%2147483647:!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=wc(a),0!==a&&(a=mc(a),a=nc(0,a),a=oc(a,4))):a=a instanceof Date?a.valueOf():null==a?0:Jb(a);return a}
function yc(a,b){return a^b+2654435769+(a<<6)+(a>>2)}function Ma(a,b){return b instanceof a}function zc(a,b){if(a.Va===b.Va)return 0;var c=Qa(a.Ba);if(x(c?b.Ba:c))return-1;if(x(a.Ba)){if(Qa(b.Ba))return 1;c=sa(a.Ba,b.Ba);return 0===c?sa(a.name,b.name):c}return sa(a.name,b.name)}C;function rc(a,b,c,d,e){this.Ba=a;this.name=b;this.Va=c;this.nb=d;this.Da=e;this.g=2154168321;this.C=4096}k=rc.prototype;k.toString=function(){return this.Va};k.equiv=function(a){return this.D(null,a)};
k.D=function(a,b){return b instanceof rc?this.Va===b.Va:!1};k.call=function(){function a(a,b,c){return C.c?C.c(b,this,c):C.call(null,b,this,c)}function b(a,b){return C.a?C.a(b,this):C.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};
k.b=function(a){return C.a?C.a(a,this):C.call(null,a,this)};k.a=function(a,b){return C.c?C.c(a,this,b):C.call(null,a,this,b)};k.P=function(){return this.Da};k.R=function(a,b){return new rc(this.Ba,this.name,this.Va,this.nb,b)};k.S=function(){var a=this.nb;return null!=a?a:this.nb=a=yc(pc(this.name),wc(this.Ba))};k.Jb=function(){return this.name};k.Kb=function(){return this.Ba};k.L=function(a,b){return Qb(b,this.Va)};
var Ac=function Ac(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ac.b(arguments[0]);case 2:return Ac.a(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};Ac.b=function(a){if(a instanceof rc)return a;var b=a.indexOf("/");return-1===b?Ac.a(null,a):Ac.a(a.substring(0,b),a.substring(b+1,a.length))};Ac.a=function(a,b){var c=null!=a?[A(a),A("/"),A(b)].join(""):b;return new rc(a,b,c,null,null)};
Ac.w=2;G;Bc;Cc;function H(a){if(null==a)return null;if(null!=a&&(a.g&8388608||a.Uc))return a.U(null);if(Pa(a)||"string"===typeof a)return 0===a.length?null:new Cc(a,0);if(Ra(Kb,a))return Lb(a);throw Error([A(a),A(" is not ISeqable")].join(""));}function I(a){if(null==a)return null;if(null!=a&&(a.g&64||a.F))return a.ta(null);a=H(a);return null==a?null:gb(a)}function Dc(a){return null!=a?null!=a&&(a.g&64||a.F)?a.xa(null):(a=H(a))?jb(a):Ec:Ec}
function J(a){return null==a?null:null!=a&&(a.g&128||a.Wb)?a.wa(null):H(Dc(a))}var sc=function sc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return sc.b(arguments[0]);case 2:return sc.a(arguments[0],arguments[1]);default:return sc.h(arguments[0],arguments[1],new Cc(c.slice(2),0))}};sc.b=function(){return!0};sc.a=function(a,b){return null==a?null==b:a===b||Hb(a,b)};
sc.h=function(a,b,c){for(;;)if(sc.a(a,b))if(J(c))a=b,b=I(c),c=J(c);else return sc.a(b,I(c));else return!1};sc.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return sc.h(b,a,c)};sc.w=2;function Fc(a){this.H=a}Fc.prototype.next=function(){if(null!=this.H){var a=I(this.H);this.H=J(this.H);return{value:a,done:!1}}return{value:null,done:!0}};function Gc(a){return new Fc(H(a))}Ic;function Jc(a,b,c){this.value=a;this.yb=b;this.ec=c;this.g=8388672;this.C=0}Jc.prototype.U=function(){return this};
Jc.prototype.ta=function(){return this.value};Jc.prototype.xa=function(){null==this.ec&&(this.ec=Ic.b?Ic.b(this.yb):Ic.call(null,this.yb));return this.ec};function Ic(a){var b=a.next();return x(b.done)?Ec:new Jc(b.value,a,null)}function Kc(a,b){var c=mc(a),c=nc(0,c);return oc(c,b)}function Lc(a){var b=0,c=1;for(a=H(a);;)if(null!=a)b+=1,c=lc(31,c)+xc(I(a))|0,a=J(a);else return Kc(c,b)}var Mc=Kc(1,0);function Nc(a){var b=0,c=0;for(a=H(a);;)if(null!=a)b+=1,c=c+xc(I(a))|0,a=J(a);else return Kc(c,b)}
var Oc=Kc(0,0);Pc;qc;Qc;Za["null"]=!0;$a["null"]=function(){return 0};Date.prototype.D=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};Date.prototype.Db=!0;Date.prototype.ob=function(a,b){if(b instanceof Date)return sa(this.valueOf(),b.valueOf());throw Error([A("Cannot compare "),A(this),A(" to "),A(b)].join(""));};Hb.number=function(a,b){return a===b};Rc;Ya["function"]=!0;Ab["function"]=!0;Cb["function"]=function(){return null};Jb._=function(a){return a[da]||(a[da]=++ea)};
function Sc(a){return a+1}K;function Tc(a){this.G=a;this.g=32768;this.C=0}Tc.prototype.Eb=function(){return this.G};function Uc(a){return a instanceof Tc}function K(a){return zb(a)}function Vc(a,b){var c=$a(a);if(0===c)return b.m?b.m():b.call(null);for(var d=eb.a(a,0),e=1;;)if(e<c){var f=eb.a(a,e),d=b.a?b.a(d,f):b.call(null,d,f);if(Uc(d))return zb(d);e+=1}else return d}
function Wc(a,b,c){var d=$a(a),e=c;for(c=0;;)if(c<d){var f=eb.a(a,c),e=b.a?b.a(e,f):b.call(null,e,f);if(Uc(e))return zb(e);c+=1}else return e}function Xc(a,b){var c=a.length;if(0===a.length)return b.m?b.m():b.call(null);for(var d=a[0],e=1;;)if(e<c){var f=a[e],d=b.a?b.a(d,f):b.call(null,d,f);if(Uc(d))return zb(d);e+=1}else return d}function Yc(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var f=a[c],e=b.a?b.a(e,f):b.call(null,e,f);if(Uc(e))return zb(e);c+=1}else return e}
function Zc(a,b,c,d){for(var e=a.length;;)if(d<e){var f=a[d];c=b.a?b.a(c,f):b.call(null,c,f);if(Uc(c))return zb(c);d+=1}else return c}$c;M;ad;bd;function cd(a){return null!=a?a.g&2||a.Kc?!0:a.g?!1:Ra(Za,a):Ra(Za,a)}function dd(a){return null!=a?a.g&16||a.rc?!0:a.g?!1:Ra(db,a):Ra(db,a)}function ed(a,b){this.f=a;this.s=b}ed.prototype.ya=function(){return this.s<this.f.length};ed.prototype.next=function(){var a=this.f[this.s];this.s+=1;return a};
function Cc(a,b){this.f=a;this.s=b;this.g=166199550;this.C=8192}k=Cc.prototype;k.toString=function(){return kc(this)};k.equiv=function(a){return this.D(null,a)};k.ba=function(a,b){var c=b+this.s;return c<this.f.length?this.f[c]:null};k.Ea=function(a,b,c){a=b+this.s;return a<this.f.length?this.f[a]:c};k.Ha=function(){return new ed(this.f,this.s)};k.wa=function(){return this.s+1<this.f.length?new Cc(this.f,this.s+1):null};k.Z=function(){var a=this.f.length-this.s;return 0>a?0:a};
k.Xb=function(){var a=$a(this);return 0<a?new ad(this,a-1,null):null};k.S=function(){return Lc(this)};k.D=function(a,b){return Qc.a?Qc.a(this,b):Qc.call(null,this,b)};k.ca=function(){return Ec};k.ea=function(a,b){return Zc(this.f,b,this.f[this.s],this.s+1)};k.fa=function(a,b,c){return Zc(this.f,b,c,this.s)};k.ta=function(){return this.f[this.s]};k.xa=function(){return this.s+1<this.f.length?new Cc(this.f,this.s+1):Ec};k.U=function(){return this.s<this.f.length?this:null};
k.X=function(a,b){return M.a?M.a(b,this):M.call(null,b,this)};Cc.prototype[Ua]=function(){return Gc(this)};var Bc=function Bc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Bc.b(arguments[0]);case 2:return Bc.a(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};Bc.b=function(a){return Bc.a(a,0)};Bc.a=function(a,b){return b<a.length?new Cc(a,b):null};Bc.w=2;
var G=function G(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return G.b(arguments[0]);case 2:return G.a(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};G.b=function(a){return Bc.a(a,0)};G.a=function(a,b){return Bc.a(a,b)};G.w=2;Rc;fd;function ad(a,b,c){this.Vb=a;this.s=b;this.v=c;this.g=32374990;this.C=8192}k=ad.prototype;k.toString=function(){return kc(this)};
k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};k.wa=function(){return 0<this.s?new ad(this.Vb,this.s-1,null):null};k.Z=function(){return this.s+1};k.S=function(){return Lc(this)};k.D=function(a,b){return Qc.a?Qc.a(this,b):Qc.call(null,this,b)};k.ca=function(){var a=Ec,b=this.v;return Rc.a?Rc.a(a,b):Rc.call(null,a,b)};k.ea=function(a,b){return fd.a?fd.a(b,this):fd.call(null,b,this)};k.fa=function(a,b,c){return fd.c?fd.c(b,c,this):fd.call(null,b,c,this)};
k.ta=function(){return eb.a(this.Vb,this.s)};k.xa=function(){return 0<this.s?new ad(this.Vb,this.s-1,null):Ec};k.U=function(){return this};k.R=function(a,b){return new ad(this.Vb,this.s,b)};k.X=function(a,b){return M.a?M.a(b,this):M.call(null,b,this)};ad.prototype[Ua]=function(){return Gc(this)};function gd(a){return I(J(a))}function hd(a){for(;;){var b=J(a);if(null!=b)a=b;else return I(a)}}Hb._=function(a,b){return a===b};
var id=function id(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return id.m();case 1:return id.b(arguments[0]);case 2:return id.a(arguments[0],arguments[1]);default:return id.h(arguments[0],arguments[1],new Cc(c.slice(2),0))}};id.m=function(){return jd};id.b=function(a){return a};id.a=function(a,b){return null!=a?cb(a,b):cb(Ec,b)};id.h=function(a,b,c){for(;;)if(x(c))a=id.a(a,b),b=I(c),c=J(c);else return id.a(a,b)};
id.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return id.h(b,a,c)};id.w=2;function N(a){if(null!=a)if(null!=a&&(a.g&2||a.Kc))a=a.Z(null);else if(Pa(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.g&8388608||a.Uc))a:{a=H(a);for(var b=0;;){if(cd(a)){a=b+$a(a);break a}a=J(a);b+=1}}else a=$a(a);else a=0;return a}function kd(a,b){for(var c=null;;){if(null==a)return c;if(0===b)return H(a)?I(a):c;if(dd(a))return eb.c(a,b,c);if(H(a)){var d=J(a),e=b-1;a=d;b=e}else return c}}
function ld(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.g&16||a.rc))return a.ba(null,b);if(Pa(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.g&64||a.F)){var c;a:{c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(H(c)){c=I(c);break a}throw Error("Index out of bounds");}if(dd(c)){c=eb.a(c,d);break a}if(H(c))c=J(c),--d;else throw Error("Index out of bounds");
}}return c}if(Ra(db,a))return eb.a(a,b);throw Error([A("nth not supported on this type "),A(Ta(null==a?null:a.constructor))].join(""));}
function P(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return null;if(null!=a&&(a.g&16||a.rc))return a.Ea(null,b,null);if(Pa(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.g&64||a.F))return kd(a,b);if(Ra(db,a))return eb.a(a,b);throw Error([A("nth not supported on this type "),A(Ta(null==a?null:a.constructor))].join(""));}
var C=function C(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return C.a(arguments[0],arguments[1]);case 3:return C.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};C.a=function(a,b){return null==a?null:null!=a&&(a.g&256||a.sc)?a.N(null,b):Pa(a)?b<a.length?a[b|0]:null:"string"===typeof a?b<a.length?a[b|0]:null:Ra(lb,a)?mb.a(a,b):null};
C.c=function(a,b,c){return null!=a?null!=a&&(a.g&256||a.sc)?a.I(null,b,c):Pa(a)?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:Ra(lb,a)?mb.c(a,b,c):c:c};C.w=3;md;var Q=function Q(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Q.c(arguments[0],arguments[1],arguments[2]);default:return Q.h(arguments[0],arguments[1],arguments[2],new Cc(c.slice(3),0))}};Q.c=function(a,b,c){return null!=a?pb(a,b,c):nd([b],[c])};
Q.h=function(a,b,c,d){for(;;)if(a=Q.c(a,b,c),x(d))b=I(d),c=gd(d),d=J(J(d));else return a};Q.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),d=J(d);return Q.h(b,a,c,d)};Q.w=3;var od=function od(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return od.b(arguments[0]);case 2:return od.a(arguments[0],arguments[1]);default:return od.h(arguments[0],arguments[1],new Cc(c.slice(2),0))}};od.b=function(a){return a};
od.a=function(a,b){return null==a?null:rb(a,b)};od.h=function(a,b,c){for(;;){if(null==a)return null;a=od.a(a,b);if(x(c))b=I(c),c=J(c);else return a}};od.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return od.h(b,a,c)};od.w=2;function pd(a,b){this.i=a;this.v=b;this.g=393217;this.C=0}k=pd.prototype;k.P=function(){return this.v};k.R=function(a,b){return new pd(this.i,b)};k.Jc=!0;
k.call=function(){function a(a,b,c,d,e,f,g,l,h,m,n,p,q,r,w,t,z,D,F,L,O,E){a=this;return B.qb?B.qb(a.i,b,c,d,e,f,g,l,h,m,n,p,q,r,w,t,z,D,F,L,O,E):B.call(null,a.i,b,c,d,e,f,g,l,h,m,n,p,q,r,w,t,z,D,F,L,O,E)}function b(a,b,c,d,e,f,g,l,h,m,n,p,q,r,w,t,z,D,F,L,O){a=this;return a.i.qa?a.i.qa(b,c,d,e,f,g,l,h,m,n,p,q,r,w,t,z,D,F,L,O):a.i.call(null,b,c,d,e,f,g,l,h,m,n,p,q,r,w,t,z,D,F,L,O)}function c(a,b,c,d,e,f,g,l,h,m,n,p,q,r,w,t,z,D,F,L){a=this;return a.i.pa?a.i.pa(b,c,d,e,f,g,l,h,m,n,p,q,r,w,t,z,D,F,L):
a.i.call(null,b,c,d,e,f,g,l,h,m,n,p,q,r,w,t,z,D,F,L)}function d(a,b,c,d,e,f,g,l,h,m,n,p,q,r,w,t,z,D,F){a=this;return a.i.oa?a.i.oa(b,c,d,e,f,g,l,h,m,n,p,q,r,w,t,z,D,F):a.i.call(null,b,c,d,e,f,g,l,h,m,n,p,q,r,w,t,z,D,F)}function e(a,b,c,d,e,f,g,l,h,m,n,p,q,r,w,t,z,D){a=this;return a.i.na?a.i.na(b,c,d,e,f,g,l,h,m,n,p,q,r,w,t,z,D):a.i.call(null,b,c,d,e,f,g,l,h,m,n,p,q,r,w,t,z,D)}function f(a,b,c,d,e,f,g,l,h,m,n,p,q,r,w,t,z){a=this;return a.i.ma?a.i.ma(b,c,d,e,f,g,l,h,m,n,p,q,r,w,t,z):a.i.call(null,b,
c,d,e,f,g,l,h,m,n,p,q,r,w,t,z)}function g(a,b,c,d,e,f,g,l,h,m,n,p,q,r,w,t){a=this;return a.i.la?a.i.la(b,c,d,e,f,g,l,h,m,n,p,q,r,w,t):a.i.call(null,b,c,d,e,f,g,l,h,m,n,p,q,r,w,t)}function h(a,b,c,d,e,f,g,l,h,m,n,p,q,r,w){a=this;return a.i.ka?a.i.ka(b,c,d,e,f,g,l,h,m,n,p,q,r,w):a.i.call(null,b,c,d,e,f,g,l,h,m,n,p,q,r,w)}function l(a,b,c,d,e,f,g,l,h,m,n,p,q,r){a=this;return a.i.ja?a.i.ja(b,c,d,e,f,g,l,h,m,n,p,q,r):a.i.call(null,b,c,d,e,f,g,l,h,m,n,p,q,r)}function m(a,b,c,d,e,f,g,l,h,m,n,p,q){a=this;
return a.i.ia?a.i.ia(b,c,d,e,f,g,l,h,m,n,p,q):a.i.call(null,b,c,d,e,f,g,l,h,m,n,p,q)}function n(a,b,c,d,e,f,g,l,h,m,n,p){a=this;return a.i.ha?a.i.ha(b,c,d,e,f,g,l,h,m,n,p):a.i.call(null,b,c,d,e,f,g,l,h,m,n,p)}function p(a,b,c,d,e,f,g,l,h,m,n){a=this;return a.i.ga?a.i.ga(b,c,d,e,f,g,l,h,m,n):a.i.call(null,b,c,d,e,f,g,l,h,m,n)}function q(a,b,c,d,e,f,g,l,h,m){a=this;return a.i.sa?a.i.sa(b,c,d,e,f,g,l,h,m):a.i.call(null,b,c,d,e,f,g,l,h,m)}function r(a,b,c,d,e,f,g,l,h){a=this;return a.i.ra?a.i.ra(b,c,
d,e,f,g,l,h):a.i.call(null,b,c,d,e,f,g,l,h)}function t(a,b,c,d,e,f,g,l){a=this;return a.i.aa?a.i.aa(b,c,d,e,f,g,l):a.i.call(null,b,c,d,e,f,g,l)}function w(a,b,c,d,e,f,g){a=this;return a.i.T?a.i.T(b,c,d,e,f,g):a.i.call(null,b,c,d,e,f,g)}function z(a,b,c,d,e,f){a=this;return a.i.A?a.i.A(b,c,d,e,f):a.i.call(null,b,c,d,e,f)}function D(a,b,c,d,e){a=this;return a.i.l?a.i.l(b,c,d,e):a.i.call(null,b,c,d,e)}function F(a,b,c,d){a=this;return a.i.c?a.i.c(b,c,d):a.i.call(null,b,c,d)}function L(a,b,c){a=this;
return a.i.a?a.i.a(b,c):a.i.call(null,b,c)}function O(a,b){a=this;return a.i.b?a.i.b(b):a.i.call(null,b)}function za(a){a=this;return a.i.m?a.i.m():a.i.call(null)}var E=null,E=function(ka,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa,E,Va,hb,ib,Bb,Hc,Ad,lf){switch(arguments.length){case 1:return za.call(this,ka);case 2:return O.call(this,ka,na);case 3:return L.call(this,ka,na,U);case 4:return F.call(this,ka,na,U,V);case 5:return D.call(this,ka,na,U,V,ha);case 6:return z.call(this,ka,na,U,V,ha,ia);case 7:return w.call(this,
ka,na,U,V,ha,ia,ja);case 8:return t.call(this,ka,na,U,V,ha,ia,ja,la);case 9:return r.call(this,ka,na,U,V,ha,ia,ja,la,oa);case 10:return q.call(this,ka,na,U,V,ha,ia,ja,la,oa,ta);case 11:return p.call(this,ka,na,U,V,ha,ia,ja,la,oa,ta,ya);case 12:return n.call(this,ka,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca);case 13:return m.call(this,ka,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da);case 14:return l.call(this,ka,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa);case 15:return h.call(this,ka,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa,E);
case 16:return g.call(this,ka,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa,E,Va);case 17:return f.call(this,ka,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa,E,Va,hb);case 18:return e.call(this,ka,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa,E,Va,hb,ib);case 19:return d.call(this,ka,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa,E,Va,hb,ib,Bb);case 20:return c.call(this,ka,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa,E,Va,hb,ib,Bb,Hc);case 21:return b.call(this,ka,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa,E,Va,hb,ib,Bb,Hc,Ad);case 22:return a.call(this,
ka,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa,E,Va,hb,ib,Bb,Hc,Ad,lf)}throw Error("Invalid arity: "+arguments.length);};E.b=za;E.a=O;E.c=L;E.l=F;E.A=D;E.T=z;E.aa=w;E.ra=t;E.sa=r;E.ga=q;E.ha=p;E.ia=n;E.ja=m;E.ka=l;E.la=h;E.ma=g;E.na=f;E.oa=e;E.pa=d;E.qa=c;E.Fb=b;E.qb=a;return E}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};k.m=function(){return this.i.m?this.i.m():this.i.call(null)};k.b=function(a){return this.i.b?this.i.b(a):this.i.call(null,a)};
k.a=function(a,b){return this.i.a?this.i.a(a,b):this.i.call(null,a,b)};k.c=function(a,b,c){return this.i.c?this.i.c(a,b,c):this.i.call(null,a,b,c)};k.l=function(a,b,c,d){return this.i.l?this.i.l(a,b,c,d):this.i.call(null,a,b,c,d)};k.A=function(a,b,c,d,e){return this.i.A?this.i.A(a,b,c,d,e):this.i.call(null,a,b,c,d,e)};k.T=function(a,b,c,d,e,f){return this.i.T?this.i.T(a,b,c,d,e,f):this.i.call(null,a,b,c,d,e,f)};
k.aa=function(a,b,c,d,e,f,g){return this.i.aa?this.i.aa(a,b,c,d,e,f,g):this.i.call(null,a,b,c,d,e,f,g)};k.ra=function(a,b,c,d,e,f,g,h){return this.i.ra?this.i.ra(a,b,c,d,e,f,g,h):this.i.call(null,a,b,c,d,e,f,g,h)};k.sa=function(a,b,c,d,e,f,g,h,l){return this.i.sa?this.i.sa(a,b,c,d,e,f,g,h,l):this.i.call(null,a,b,c,d,e,f,g,h,l)};k.ga=function(a,b,c,d,e,f,g,h,l,m){return this.i.ga?this.i.ga(a,b,c,d,e,f,g,h,l,m):this.i.call(null,a,b,c,d,e,f,g,h,l,m)};
k.ha=function(a,b,c,d,e,f,g,h,l,m,n){return this.i.ha?this.i.ha(a,b,c,d,e,f,g,h,l,m,n):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n)};k.ia=function(a,b,c,d,e,f,g,h,l,m,n,p){return this.i.ia?this.i.ia(a,b,c,d,e,f,g,h,l,m,n,p):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p)};k.ja=function(a,b,c,d,e,f,g,h,l,m,n,p,q){return this.i.ja?this.i.ja(a,b,c,d,e,f,g,h,l,m,n,p,q):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q)};
k.ka=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){return this.i.ka?this.i.ka(a,b,c,d,e,f,g,h,l,m,n,p,q,r):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r)};k.la=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t){return this.i.la?this.i.la(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t)};k.ma=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w){return this.i.ma?this.i.ma(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w)};
k.na=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z){return this.i.na?this.i.na(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z)};k.oa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D){return this.i.oa?this.i.oa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D)};
k.pa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F){return this.i.pa?this.i.pa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F)};k.qa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F,L){return this.i.qa?this.i.qa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F,L):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F,L)};
k.Fb=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F,L,O){return B.qb?B.qb(this.i,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F,L,O):B.call(null,this.i,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F,L,O)};function Rc(a,b){return ca(a)?new pd(a,b):null==a?null:Db(a,b)}function qd(a){var b=null!=a;return(b?null!=a?a.g&131072||a.Qc||(a.g?0:Ra(Ab,a)):Ra(Ab,a):b)?Cb(a):null}function rd(a){return null==a||Qa(H(a))}function sd(a){return null==a?!1:null!=a?a.g&4096||a.wd?!0:a.g?!1:Ra(vb,a):Ra(vb,a)}
function td(a){return null!=a?a.g&16777216||a.vd?!0:a.g?!1:Ra(Mb,a):Ra(Mb,a)}function ud(a){return null==a?!1:null!=a?a.g&1024||a.Oc?!0:a.g?!1:Ra(qb,a):Ra(qb,a)}function vd(a){return null!=a?a.g&16384||a.xd?!0:a.g?!1:Ra(xb,a):Ra(xb,a)}wd;xd;function yd(a){return null!=a?a.C&512||a.qd?!0:!1:!1}function zd(a){var b=[];pa(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}function Bd(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var Cd={};
function Dd(a){return null==a?!1:null!=a?a.g&64||a.F?!0:a.g?!1:Ra(fb,a):Ra(fb,a)}function Ed(a){return null==a?!1:!1===a?!1:!0}function Fd(a,b){return C.c(a,b,Cd)===Cd?!1:!0}function Gd(a,b){var c;if(c=null!=a)c=null!=a?a.g&512||a.pd?!0:a.g?!1:Ra(nb,a):Ra(nb,a);return c&&Fd(a,b)?new R(null,2,5,S,[b,C.a(a,b)],null):null}
function tc(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if("number"===typeof a){if("number"===typeof b)return sa(a,b);throw Error([A("Cannot compare "),A(a),A(" to "),A(b)].join(""));}if(null!=a?a.C&2048||a.Db||(a.C?0:Ra(Zb,a)):Ra(Zb,a))return $b(a,b);if("string"!==typeof a&&!Pa(a)&&!0!==a&&!1!==a||(null==a?null:a.constructor)!==(null==b?null:b.constructor))throw Error([A("Cannot compare "),A(a),A(" to "),A(b)].join(""));return sa(a,b)}
function Hd(a,b){var c=N(a),d=N(b);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=tc(ld(a,d),ld(b,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}function Id(a){return sc.a(a,tc)?tc:function(b,c){var d=a.a?a.a(b,c):a.call(null,b,c);return"number"===typeof d?d:x(d)?-1:x(a.a?a.a(c,b):a.call(null,c,b))?1:0}}Jd;
var fd=function fd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return fd.a(arguments[0],arguments[1]);case 3:return fd.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};fd.a=function(a,b){var c=H(b);if(c){var d=I(c),c=J(c);return Xa.c?Xa.c(a,d,c):Xa.call(null,a,d,c)}return a.m?a.m():a.call(null)};
fd.c=function(a,b,c){for(c=H(c);;)if(c){var d=I(c);b=a.a?a.a(b,d):a.call(null,b,d);if(Uc(b))return zb(b);c=J(c)}else return b};fd.w=3;Kd;var Xa=function Xa(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Xa.a(arguments[0],arguments[1]);case 3:return Xa.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
Xa.a=function(a,b){return null!=b&&(b.g&524288||b.Sc)?b.ea(null,a):Pa(b)?Xc(b,a):"string"===typeof b?Xc(b,a):Ra(Eb,b)?Fb.a(b,a):fd.a(a,b)};Xa.c=function(a,b,c){return null!=c&&(c.g&524288||c.Sc)?c.fa(null,a,b):Pa(c)?Yc(c,a,b):"string"===typeof c?Yc(c,a,b):Ra(Eb,c)?Fb.c(c,a,b):fd.c(a,b,c)};Xa.w=3;function Ld(a){return a}function Md(a,b,c,d){a=a.b?a.b(b):a.call(null,b);c=Xa.c(a,c,d);return a.b?a.b(c):a.call(null,c)}
var Nd=function Nd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Nd.m();case 1:return Nd.b(arguments[0]);case 2:return Nd.a(arguments[0],arguments[1]);default:return Nd.h(arguments[0],arguments[1],new Cc(c.slice(2),0))}};Nd.m=function(){return 0};Nd.b=function(a){return a};Nd.a=function(a,b){return a+b};Nd.h=function(a,b,c){return Xa.c(Nd,a+b,c)};Nd.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return Nd.h(b,a,c)};Nd.w=2;
var Od=function Od(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Od.b(arguments[0]);case 2:return Od.a(arguments[0],arguments[1]);default:return Od.h(arguments[0],arguments[1],new Cc(c.slice(2),0))}};Od.b=function(a){return-a};Od.a=function(a,b){return a-b};Od.h=function(a,b,c){return Xa.c(Od,a-b,c)};Od.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return Od.h(b,a,c)};Od.w=2;
var Pd=function Pd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Pd.m();case 1:return Pd.b(arguments[0]);case 2:return Pd.a(arguments[0],arguments[1]);default:return Pd.h(arguments[0],arguments[1],new Cc(c.slice(2),0))}};Pd.m=function(){return 1};Pd.b=function(a){return a};Pd.a=function(a,b){return a*b};Pd.h=function(a,b,c){return Xa.c(Pd,a*b,c)};Pd.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return Pd.h(b,a,c)};Pd.w=2;va.Dd;
var Qd=function Qd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Qd.b(arguments[0]);case 2:return Qd.a(arguments[0],arguments[1]);default:return Qd.h(arguments[0],arguments[1],new Cc(c.slice(2),0))}};Qd.b=function(a){return 1/a};Qd.a=function(a,b){return a/b};Qd.h=function(a,b,c){return Xa.c(Qd,a/b,c)};Qd.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return Qd.h(b,a,c)};Qd.w=2;
var Rd=function Rd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Rd.b(arguments[0]);case 2:return Rd.a(arguments[0],arguments[1]);default:return Rd.h(arguments[0],arguments[1],new Cc(c.slice(2),0))}};Rd.b=function(a){return a};Rd.a=function(a,b){return a>b?a:b};Rd.h=function(a,b,c){return Xa.c(Rd,a>b?a:b,c)};Rd.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return Rd.h(b,a,c)};Rd.w=2;
var Sd=function Sd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Sd.b(arguments[0]);case 2:return Sd.a(arguments[0],arguments[1]);default:return Sd.h(arguments[0],arguments[1],new Cc(c.slice(2),0))}};Sd.b=function(a){return a};Sd.a=function(a,b){return a<b?a:b};Sd.h=function(a,b,c){return Xa.c(Sd,a<b?a:b,c)};Sd.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return Sd.h(b,a,c)};Sd.w=2;Td;function Td(a,b){return(a%b+b)%b}
function Ud(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function Vd(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function Wd(a,b){for(var c=b,d=H(a);;)if(d&&0<c)--c,d=J(d);else return d}var A=function A(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return A.m();case 1:return A.b(arguments[0]);default:return A.h(arguments[0],new Cc(c.slice(1),0))}};A.m=function(){return""};
A.b=function(a){return null==a?"":""+a};A.h=function(a,b){for(var c=new qa(""+A(a)),d=b;;)if(x(d))c=c.append(""+A(I(d))),d=J(d);else return c.toString()};A.B=function(a){var b=I(a);a=J(a);return A.h(b,a)};A.w=1;T;Xd;function Qc(a,b){var c;if(td(b))if(cd(a)&&cd(b)&&N(a)!==N(b))c=!1;else a:{c=H(a);for(var d=H(b);;){if(null==c){c=null==d;break a}if(null!=d&&sc.a(I(c),I(d)))c=J(c),d=J(d);else{c=!1;break a}}}else c=null;return Ed(c)}
function $c(a){if(H(a)){var b=xc(I(a));for(a=J(a);;){if(null==a)return b;b=yc(b,xc(I(a)));a=J(a)}}else return 0}Yd;Zd;function $d(a){var b=0;for(a=H(a);;)if(a){var c=I(a),b=(b+(xc(Yd.b?Yd.b(c):Yd.call(null,c))^xc(Zd.b?Zd.b(c):Zd.call(null,c))))%4503599627370496;a=J(a)}else return b}Xd;ae;be;function bd(a,b,c,d,e){this.v=a;this.first=b;this.Ca=c;this.count=d;this.u=e;this.g=65937646;this.C=8192}k=bd.prototype;k.toString=function(){return kc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};
k.wa=function(){return 1===this.count?null:this.Ca};k.Z=function(){return this.count};k.cb=function(){return this.first};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Lc(this)};k.D=function(a,b){return Qc(this,b)};k.ca=function(){return Db(Ec,this.v)};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){return this.first};k.xa=function(){return 1===this.count?Ec:this.Ca};k.U=function(){return this};
k.R=function(a,b){return new bd(b,this.first,this.Ca,this.count,this.u)};k.X=function(a,b){return new bd(this.v,b,this,this.count+1,null)};function ce(a){return null!=a?a.g&33554432||a.td?!0:a.g?!1:Ra(Nb,a):Ra(Nb,a)}bd.prototype[Ua]=function(){return Gc(this)};function de(a){this.v=a;this.g=65937614;this.C=8192}k=de.prototype;k.toString=function(){return kc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};k.wa=function(){return null};k.Z=function(){return 0};k.cb=function(){return null};
k.S=function(){return Mc};k.D=function(a,b){return ce(b)||td(b)?null==H(b):!1};k.ca=function(){return this};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){return null};k.xa=function(){return Ec};k.U=function(){return null};k.R=function(a,b){return new de(b)};k.X=function(a,b){return new bd(this.v,b,null,1,null)};var Ec=new de(null);de.prototype[Ua]=function(){return Gc(this)};
function ee(a){return(null!=a?a.g&134217728||a.ud||(a.g?0:Ra(Ob,a)):Ra(Ob,a))?Pb(a):Xa.c(id,Ec,a)}var qc=function qc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return qc.h(0<c.length?new Cc(c.slice(0),0):null)};qc.h=function(a){var b;if(a instanceof Cc&&0===a.s)b=a.f;else a:for(b=[];;)if(null!=a)b.push(a.ta(null)),a=a.wa(null);else break a;a=b.length;for(var c=Ec;;)if(0<a){var d=a-1,c=c.X(null,b[a-1]);a=d}else return c};qc.w=0;qc.B=function(a){return qc.h(H(a))};
function fe(a,b,c,d){this.v=a;this.first=b;this.Ca=c;this.u=d;this.g=65929452;this.C=8192}k=fe.prototype;k.toString=function(){return kc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};k.wa=function(){return null==this.Ca?null:H(this.Ca)};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Lc(this)};k.D=function(a,b){return Qc(this,b)};k.ca=function(){return Rc(Ec,this.v)};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){return this.first};
k.xa=function(){return null==this.Ca?Ec:this.Ca};k.U=function(){return this};k.R=function(a,b){return new fe(b,this.first,this.Ca,this.u)};k.X=function(a,b){return new fe(null,b,this,this.u)};fe.prototype[Ua]=function(){return Gc(this)};function M(a,b){var c=null==b;return(c?c:null!=b&&(b.g&64||b.F))?new fe(null,a,b,null):new fe(null,a,H(b),null)}
function ge(a,b){if(a.Ia===b.Ia)return 0;var c=Qa(a.Ba);if(x(c?b.Ba:c))return-1;if(x(a.Ba)){if(Qa(b.Ba))return 1;c=sa(a.Ba,b.Ba);return 0===c?sa(a.name,b.name):c}return sa(a.name,b.name)}function y(a,b,c,d){this.Ba=a;this.name=b;this.Ia=c;this.nb=d;this.g=2153775105;this.C=4096}k=y.prototype;k.toString=function(){return[A(":"),A(this.Ia)].join("")};k.equiv=function(a){return this.D(null,a)};k.D=function(a,b){return b instanceof y?this.Ia===b.Ia:!1};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return C.a(c,this);case 3:return C.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return C.a(c,this)};a.c=function(a,c,d){return C.c(c,this,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};k.b=function(a){return C.a(a,this)};k.a=function(a,b){return C.c(a,this,b)};
k.S=function(){var a=this.nb;return null!=a?a:this.nb=a=yc(pc(this.name),wc(this.Ba))+2654435769|0};k.Jb=function(){return this.name};k.Kb=function(){return this.Ba};k.L=function(a,b){return Qb(b,[A(":"),A(this.Ia)].join(""))};function he(a,b){return a===b?!0:a instanceof y&&b instanceof y?a.Ia===b.Ia:!1}
var ie=function ie(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ie.b(arguments[0]);case 2:return ie.a(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
ie.b=function(a){if(a instanceof y)return a;if(a instanceof rc){var b;if(null!=a&&(a.C&4096||a.Rc))b=a.Kb(null);else throw Error([A("Doesn't support namespace: "),A(a)].join(""));return new y(b,Xd.b?Xd.b(a):Xd.call(null,a),a.Va,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new y(b[0],b[1],a,null):new y(null,b[0],a,null)):null};ie.a=function(a,b){return new y(a,b,[A(x(a)?[A(a),A("/")].join(""):null),A(b)].join(""),null)};ie.w=2;
function je(a,b,c,d){this.v=a;this.xb=b;this.H=c;this.u=d;this.g=32374988;this.C=0}k=je.prototype;k.toString=function(){return kc(this)};k.equiv=function(a){return this.D(null,a)};function ke(a){null!=a.xb&&(a.H=a.xb.m?a.xb.m():a.xb.call(null),a.xb=null);return a.H}k.P=function(){return this.v};k.wa=function(){Lb(this);return null==this.H?null:J(this.H)};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Lc(this)};k.D=function(a,b){return Qc(this,b)};k.ca=function(){return Rc(Ec,this.v)};
k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){Lb(this);return null==this.H?null:I(this.H)};k.xa=function(){Lb(this);return null!=this.H?Dc(this.H):Ec};k.U=function(){ke(this);if(null==this.H)return null;for(var a=this.H;;)if(a instanceof je)a=ke(a);else return this.H=a,H(this.H)};k.R=function(a,b){return new je(b,this.xb,this.H,this.u)};k.X=function(a,b){return M(b,this)};je.prototype[Ua]=function(){return Gc(this)};le;
function me(a,b){this.K=a;this.end=b;this.g=2;this.C=0}me.prototype.add=function(a){this.K[this.end]=a;return this.end+=1};me.prototype.W=function(){var a=new le(this.K,0,this.end);this.K=null;return a};me.prototype.Z=function(){return this.end};function ne(a){return new me(Array(a),0)}function le(a,b,c){this.f=a;this.ua=b;this.end=c;this.g=524306;this.C=0}k=le.prototype;k.Z=function(){return this.end-this.ua};k.ba=function(a,b){return this.f[this.ua+b]};
k.Ea=function(a,b,c){return 0<=b&&b<this.end-this.ua?this.f[this.ua+b]:c};k.qc=function(){if(this.ua===this.end)throw Error("-drop-first of empty chunk");return new le(this.f,this.ua+1,this.end)};k.ea=function(a,b){return Zc(this.f,b,this.f[this.ua],this.ua+1)};k.fa=function(a,b,c){return Zc(this.f,b,c,this.ua)};function wd(a,b,c,d){this.W=a;this.Sa=b;this.v=c;this.u=d;this.g=31850732;this.C=1536}k=wd.prototype;k.toString=function(){return kc(this)};k.equiv=function(a){return this.D(null,a)};
k.P=function(){return this.v};k.wa=function(){if(1<$a(this.W))return new wd(ac(this.W),this.Sa,this.v,null);var a=Lb(this.Sa);return null==a?null:a};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Lc(this)};k.D=function(a,b){return Qc(this,b)};k.ca=function(){return Rc(Ec,this.v)};k.ta=function(){return eb.a(this.W,0)};k.xa=function(){return 1<$a(this.W)?new wd(ac(this.W),this.Sa,this.v,null):null==this.Sa?Ec:this.Sa};k.U=function(){return this};k.ic=function(){return this.W};
k.jc=function(){return null==this.Sa?Ec:this.Sa};k.R=function(a,b){return new wd(this.W,this.Sa,b,this.u)};k.X=function(a,b){return M(b,this)};k.hc=function(){return null==this.Sa?null:this.Sa};wd.prototype[Ua]=function(){return Gc(this)};function oe(a,b){return 0===$a(a)?b:new wd(a,b,null,null)}function pe(a,b){a.add(b)}function ae(a){return bc(a)}function be(a){return cc(a)}function Jd(a){for(var b=[];;)if(H(a))b.push(I(a)),a=J(a);else return b}
function qe(a){if("number"===typeof a)a:{var b=Array(a);if(Dd(null))for(var c=0,d=H(null);;)if(d&&c<a)b[c]=I(d),c+=1,d=J(d);else{a=b;break a}else{for(c=0;;)if(c<a)b[c]=null,c+=1;else break;a=b}}else a=La.b(a);return a}function re(a,b){if(cd(a))return N(a);for(var c=a,d=b,e=0;;)if(0<d&&H(c))c=J(c),--d,e+=1;else return e}
var se=function se(b){return null==b?null:null==J(b)?H(I(b)):M(I(b),se(J(b)))},te=function te(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return te.m();case 1:return te.b(arguments[0]);case 2:return te.a(arguments[0],arguments[1]);default:return te.h(arguments[0],arguments[1],new Cc(c.slice(2),0))}};te.m=function(){return new je(null,function(){return null},null,null)};te.b=function(a){return new je(null,function(){return a},null,null)};
te.a=function(a,b){return new je(null,function(){var c=H(a);return c?yd(c)?oe(bc(c),te.a(cc(c),b)):M(I(c),te.a(Dc(c),b)):b},null,null)};te.h=function(a,b,c){return function e(a,b){return new je(null,function(){var c=H(a);return c?yd(c)?oe(bc(c),e(cc(c),b)):M(I(c),e(Dc(c),b)):x(b)?e(I(b),J(b)):null},null,null)}(te.a(a,b),c)};te.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return te.h(b,a,c)};te.w=2;function ue(a){return Wb(a)}
var ve=function ve(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return ve.m();case 1:return ve.b(arguments[0]);case 2:return ve.a(arguments[0],arguments[1]);default:return ve.h(arguments[0],arguments[1],new Cc(c.slice(2),0))}};ve.m=function(){return Ub(jd)};ve.b=function(a){return a};ve.a=function(a,b){return Vb(a,b)};ve.h=function(a,b,c){for(;;)if(a=Vb(a,b),x(c))b=I(c),c=J(c);else return a};
ve.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return ve.h(b,a,c)};ve.w=2;function we(a,b,c){return Xb(a,b,c)}
function xe(a,b,c){var d=H(c);if(0===b)return a.m?a.m():a.call(null);c=gb(d);var e=jb(d);if(1===b)return a.b?a.b(c):a.b?a.b(c):a.call(null,c);var d=gb(e),f=jb(e);if(2===b)return a.a?a.a(c,d):a.a?a.a(c,d):a.call(null,c,d);var e=gb(f),g=jb(f);if(3===b)return a.c?a.c(c,d,e):a.c?a.c(c,d,e):a.call(null,c,d,e);var f=gb(g),h=jb(g);if(4===b)return a.l?a.l(c,d,e,f):a.l?a.l(c,d,e,f):a.call(null,c,d,e,f);var g=gb(h),l=jb(h);if(5===b)return a.A?a.A(c,d,e,f,g):a.A?a.A(c,d,e,f,g):a.call(null,c,d,e,f,g);var h=gb(l),
m=jb(l);if(6===b)return a.T?a.T(c,d,e,f,g,h):a.T?a.T(c,d,e,f,g,h):a.call(null,c,d,e,f,g,h);var l=gb(m),n=jb(m);if(7===b)return a.aa?a.aa(c,d,e,f,g,h,l):a.aa?a.aa(c,d,e,f,g,h,l):a.call(null,c,d,e,f,g,h,l);var m=gb(n),p=jb(n);if(8===b)return a.ra?a.ra(c,d,e,f,g,h,l,m):a.ra?a.ra(c,d,e,f,g,h,l,m):a.call(null,c,d,e,f,g,h,l,m);var n=gb(p),q=jb(p);if(9===b)return a.sa?a.sa(c,d,e,f,g,h,l,m,n):a.sa?a.sa(c,d,e,f,g,h,l,m,n):a.call(null,c,d,e,f,g,h,l,m,n);var p=gb(q),r=jb(q);if(10===b)return a.ga?a.ga(c,d,e,
f,g,h,l,m,n,p):a.ga?a.ga(c,d,e,f,g,h,l,m,n,p):a.call(null,c,d,e,f,g,h,l,m,n,p);var q=gb(r),t=jb(r);if(11===b)return a.ha?a.ha(c,d,e,f,g,h,l,m,n,p,q):a.ha?a.ha(c,d,e,f,g,h,l,m,n,p,q):a.call(null,c,d,e,f,g,h,l,m,n,p,q);var r=gb(t),w=jb(t);if(12===b)return a.ia?a.ia(c,d,e,f,g,h,l,m,n,p,q,r):a.ia?a.ia(c,d,e,f,g,h,l,m,n,p,q,r):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r);var t=gb(w),z=jb(w);if(13===b)return a.ja?a.ja(c,d,e,f,g,h,l,m,n,p,q,r,t):a.ja?a.ja(c,d,e,f,g,h,l,m,n,p,q,r,t):a.call(null,c,d,e,f,g,h,l,m,n,
p,q,r,t);var w=gb(z),D=jb(z);if(14===b)return a.ka?a.ka(c,d,e,f,g,h,l,m,n,p,q,r,t,w):a.ka?a.ka(c,d,e,f,g,h,l,m,n,p,q,r,t,w):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,t,w);var z=gb(D),F=jb(D);if(15===b)return a.la?a.la(c,d,e,f,g,h,l,m,n,p,q,r,t,w,z):a.la?a.la(c,d,e,f,g,h,l,m,n,p,q,r,t,w,z):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z);var D=gb(F),L=jb(F);if(16===b)return a.ma?a.ma(c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D):a.ma?a.ma(c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D);var F=
gb(L),O=jb(L);if(17===b)return a.na?a.na(c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F):a.na?a.na(c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F);var L=gb(O),za=jb(O);if(18===b)return a.oa?a.oa(c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F,L):a.oa?a.oa(c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F,L):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F,L);O=gb(za);za=jb(za);if(19===b)return a.pa?a.pa(c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F,L,O):a.pa?a.pa(c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F,L,O):a.call(null,c,d,e,
f,g,h,l,m,n,p,q,r,t,w,z,D,F,L,O);var E=gb(za);jb(za);if(20===b)return a.qa?a.qa(c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F,L,O,E):a.qa?a.qa(c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F,L,O,E):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F,L,O,E);throw Error("Only up to 20 arguments supported on functions");}
var B=function B(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return B.a(arguments[0],arguments[1]);case 3:return B.c(arguments[0],arguments[1],arguments[2]);case 4:return B.l(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return B.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return B.h(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new Cc(c.slice(5),0))}};
B.a=function(a,b){var c=a.w;if(a.B){var d=re(b,c+1);return d<=c?xe(a,d,b):a.B(b)}return a.apply(a,Jd(b))};B.c=function(a,b,c){b=M(b,c);c=a.w;if(a.B){var d=re(b,c+1);return d<=c?xe(a,d,b):a.B(b)}return a.apply(a,Jd(b))};B.l=function(a,b,c,d){b=M(b,M(c,d));c=a.w;return a.B?(d=re(b,c+1),d<=c?xe(a,d,b):a.B(b)):a.apply(a,Jd(b))};B.A=function(a,b,c,d,e){b=M(b,M(c,M(d,e)));c=a.w;return a.B?(d=re(b,c+1),d<=c?xe(a,d,b):a.B(b)):a.apply(a,Jd(b))};
B.h=function(a,b,c,d,e,f){b=M(b,M(c,M(d,M(e,se(f)))));c=a.w;return a.B?(d=re(b,c+1),d<=c?xe(a,d,b):a.B(b)):a.apply(a,Jd(b))};B.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),e=J(d),d=I(e),f=J(e),e=I(f),f=J(f);return B.h(b,a,c,d,e,f)};B.w=5;function ye(a){return H(a)?a:null}
var ze=function ze(){"undefined"===typeof wa&&(wa=function(b,c){this.hd=b;this.gd=c;this.g=393216;this.C=0},wa.prototype.R=function(b,c){return new wa(this.hd,c)},wa.prototype.P=function(){return this.gd},wa.prototype.ya=function(){return!1},wa.prototype.next=function(){return Error("No such element")},wa.prototype.remove=function(){return Error("Unsupported operation")},wa.cc=function(){return new R(null,2,5,S,[Rc(Ae,new v(null,1,[Be,qc(Ce,qc(jd))],null)),va.Cd],null)},wa.sb=!0,wa.Za="cljs.core/t_cljs$core23150",
wa.Ob=function(b,c){return Qb(c,"cljs.core/t_cljs$core23150")});return new wa(ze,W)};De;function De(a,b,c,d){this.Ab=a;this.first=b;this.Ca=c;this.v=d;this.g=31719628;this.C=0}k=De.prototype;k.R=function(a,b){return new De(this.Ab,this.first,this.Ca,b)};k.X=function(a,b){return M(b,Lb(this))};k.ca=function(){return Ec};k.D=function(a,b){return null!=Lb(this)?Qc(this,b):td(b)&&null==H(b)};k.S=function(){return Lc(this)};k.U=function(){null!=this.Ab&&this.Ab.step(this);return null==this.Ca?null:this};
k.ta=function(){null!=this.Ab&&Lb(this);return null==this.Ca?null:this.first};k.xa=function(){null!=this.Ab&&Lb(this);return null==this.Ca?Ec:this.Ca};k.wa=function(){null!=this.Ab&&Lb(this);return null==this.Ca?null:Lb(this.Ca)};De.prototype[Ua]=function(){return Gc(this)};function Ee(a,b){for(;;){if(null==H(b))return!0;var c;c=I(b);c=a.b?a.b(c):a.call(null,c);if(x(c)){c=a;var d=J(b);a=c;b=d}else return!1}}
function Fe(a,b){for(;;)if(H(b)){var c;c=I(b);c=a.b?a.b(c):a.call(null,c);if(x(c))return c;c=a;var d=J(b);a=c;b=d}else return null}
function Ge(a){return function(){function b(b,c){return Qa(a.a?a.a(b,c):a.call(null,b,c))}function c(b){return Qa(a.b?a.b(b):a.call(null,b))}function d(){return Qa(a.m?a.m():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new Cc(g,0)}return c.call(this,a,d,f)}function c(b,d,e){return Qa(B.l(a,b,d,e))}b.w=2;b.B=function(a){var b=I(a);a=J(a);var d=I(a);a=Dc(a);return c(b,d,a)};b.h=
c;return b}(),e=function(a,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var m=null;if(2<arguments.length){for(var m=0,n=Array(arguments.length-2);m<n.length;)n[m]=arguments[m+2],++m;m=new Cc(n,0)}return f.h(a,e,m)}throw Error("Invalid arity: "+arguments.length);};e.w=2;e.B=f.B;e.m=d;e.b=c;e.a=b;e.h=f.h;return e}()}
function He(a){return function(){function b(b){if(0<arguments.length)for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;return a}b.w=0;b.B=function(b){H(b);return a};b.h=function(){return a};return b}()}
var Ie=function Ie(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Ie.m();case 1:return Ie.b(arguments[0]);case 2:return Ie.a(arguments[0],arguments[1]);case 3:return Ie.c(arguments[0],arguments[1],arguments[2]);default:return Ie.h(arguments[0],arguments[1],arguments[2],new Cc(c.slice(3),0))}};Ie.m=function(){return Ld};Ie.b=function(a){return a};
Ie.a=function(a,b){return function(){function c(c,d,e){c=b.c?b.c(c,d,e):b.call(null,c,d,e);return a.b?a.b(c):a.call(null,c)}function d(c,d){var e=b.a?b.a(c,d):b.call(null,c,d);return a.b?a.b(e):a.call(null,e)}function e(c){c=b.b?b.b(c):b.call(null,c);return a.b?a.b(c):a.call(null,c)}function f(){var c=b.m?b.m():b.call(null);return a.b?a.b(c):a.call(null,c)}var g=null,h=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,l=Array(arguments.length-3);g<l.length;)l[g]=arguments[g+
3],++g;g=new Cc(l,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){c=B.A(b,c,e,f,g);return a.b?a.b(c):a.call(null,c)}c.w=3;c.B=function(a){var b=I(a);a=J(a);var c=I(a);a=J(a);var e=I(a);a=Dc(a);return d(b,c,e,a)};c.h=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+
3],++q;q=new Cc(r,0)}return h.h(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.B=h.B;g.m=f;g.b=e;g.a=d;g.c=c;g.h=h.h;return g}()};
Ie.c=function(a,b,c){return function(){function d(d,e,f){d=c.c?c.c(d,e,f):c.call(null,d,e,f);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}function e(d,e){var f;f=c.a?c.a(d,e):c.call(null,d,e);f=b.b?b.b(f):b.call(null,f);return a.b?a.b(f):a.call(null,f)}function f(d){d=c.b?c.b(d):c.call(null,d);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}function g(){var d;d=c.m?c.m():c.call(null);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}var h=null,l=function(){function d(a,
b,c,f){var g=null;if(3<arguments.length){for(var g=0,l=Array(arguments.length-3);g<l.length;)l[g]=arguments[g+3],++g;g=new Cc(l,0)}return e.call(this,a,b,c,g)}function e(d,f,g,l){d=B.A(c,d,f,g,l);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}d.w=3;d.B=function(a){var b=I(a);a=J(a);var c=I(a);a=J(a);var d=I(a);a=Dc(a);return e(b,c,d,a)};d.h=e;return d}(),h=function(a,b,c,h){switch(arguments.length){case 0:return g.call(this);case 1:return f.call(this,a);case 2:return e.call(this,a,b);
case 3:return d.call(this,a,b,c);default:var r=null;if(3<arguments.length){for(var r=0,t=Array(arguments.length-3);r<t.length;)t[r]=arguments[r+3],++r;r=new Cc(t,0)}return l.h(a,b,c,r)}throw Error("Invalid arity: "+arguments.length);};h.w=3;h.B=l.B;h.m=g;h.b=f;h.a=e;h.c=d;h.h=l.h;return h}()};
Ie.h=function(a,b,c,d){return function(a){return function(){function b(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new Cc(e,0)}return c.call(this,d)}function c(b){b=B.a(I(a),b);for(var d=J(a);;)if(d)b=I(d).call(null,b),d=J(d);else return b}b.w=0;b.B=function(a){a=H(a);return c(a)};b.h=c;return b}()}(ee(M(a,M(b,M(c,d)))))};Ie.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),d=J(d);return Ie.h(b,a,c,d)};Ie.w=3;
function Je(a,b){return function(){function c(c,d,e){return a.l?a.l(b,c,d,e):a.call(null,b,c,d,e)}function d(c,d){return a.c?a.c(b,c,d):a.call(null,b,c,d)}function e(c){return a.a?a.a(b,c):a.call(null,b,c)}function f(){return a.b?a.b(b):a.call(null,b)}var g=null,h=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;g=new Cc(h,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){return B.h(a,b,c,e,f,G([g],0))}c.w=
3;c.B=function(a){var b=I(a);a=J(a);var c=I(a);a=J(a);var e=I(a);a=Dc(a);return d(b,c,e,a)};c.h=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+3],++q;q=new Cc(r,0)}return h.h(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.B=h.B;g.m=f;g.b=
e;g.a=d;g.c=c;g.h=h.h;return g}()}Ke;function Le(a,b){return function d(b,f){return new je(null,function(){var g=H(f);if(g){if(yd(g)){for(var h=bc(g),l=N(h),m=ne(l),n=0;;)if(n<l)pe(m,function(){var d=b+n,f=eb.a(h,n);return a.a?a.a(d,f):a.call(null,d,f)}()),n+=1;else break;return oe(m.W(),d(b+l,cc(g)))}return M(function(){var d=I(g);return a.a?a.a(b,d):a.call(null,b,d)}(),d(b+1,Dc(g)))}return null},null,null)}(0,b)}function Me(a,b,c,d){this.state=a;this.v=b;this.dc=d;this.C=16386;this.g=6455296}
k=Me.prototype;k.equiv=function(a){return this.D(null,a)};k.D=function(a,b){return this===b};k.Eb=function(){return this.state};k.P=function(){return this.v};k.vc=function(a,b,c){a=H(this.dc);for(var d=null,e=0,f=0;;)if(f<e){var g=d.ba(null,f),h=P(g,0),g=P(g,1);g.l?g.l(h,this,b,c):g.call(null,h,this,b,c);f+=1}else if(a=H(a))yd(a)?(d=bc(a),a=cc(a),h=d,e=N(d),d=h):(d=I(a),h=P(d,0),g=P(d,1),g.l?g.l(h,this,b,c):g.call(null,h,this,b,c),a=J(a),d=null,e=0),f=0;else return null};
k.uc=function(a,b,c){this.dc=Q.c(this.dc,b,c);return this};k.S=function(){return this[da]||(this[da]=++ea)};var X=function X(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return X.b(arguments[0]);default:return X.h(arguments[0],new Cc(c.slice(1),0))}};X.b=function(a){return new Me(a,null,0,null)};X.h=function(a,b){var c=null!=b&&(b.g&64||b.F)?B.a(Pc,b):b,d=C.a(c,Ia);C.a(c,Ne);return new Me(a,d,0,null)};
X.B=function(a){var b=I(a);a=J(a);return X.h(b,a)};X.w=1;Oe;function Pe(a,b){if(a instanceof Me){var c=a.state;a.state=b;null!=a.dc&&Sb(a,c,b);return b}return gc(a,b)}
var Qe=function Qe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Qe.a(arguments[0],arguments[1]);case 3:return Qe.c(arguments[0],arguments[1],arguments[2]);case 4:return Qe.l(arguments[0],arguments[1],arguments[2],arguments[3]);default:return Qe.h(arguments[0],arguments[1],arguments[2],arguments[3],new Cc(c.slice(4),0))}};Qe.a=function(a,b){var c;a instanceof Me?(c=a.state,c=b.b?b.b(c):b.call(null,c),c=Pe(a,c)):c=hc.a(a,b);return c};
Qe.c=function(a,b,c){if(a instanceof Me){var d=a.state;b=b.a?b.a(d,c):b.call(null,d,c);a=Pe(a,b)}else a=hc.c(a,b,c);return a};Qe.l=function(a,b,c,d){if(a instanceof Me){var e=a.state;b=b.c?b.c(e,c,d):b.call(null,e,c,d);a=Pe(a,b)}else a=hc.l(a,b,c,d);return a};Qe.h=function(a,b,c,d,e){return a instanceof Me?Pe(a,B.A(b,a.state,c,d,e)):hc.A(a,b,c,d,e)};Qe.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),e=J(d),d=I(e),e=J(e);return Qe.h(b,a,c,d,e)};Qe.w=4;
function Re(a){this.state=a;this.g=32768;this.C=0}Re.prototype.Eb=function(){return this.state};function Ke(a){return new Re(a)}
var T=function T(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return T.b(arguments[0]);case 2:return T.a(arguments[0],arguments[1]);case 3:return T.c(arguments[0],arguments[1],arguments[2]);case 4:return T.l(arguments[0],arguments[1],arguments[2],arguments[3]);default:return T.h(arguments[0],arguments[1],arguments[2],arguments[3],new Cc(c.slice(4),0))}};
T.b=function(a){return function(b){return function(){function c(c,d){var e=a.b?a.b(d):a.call(null,d);return b.a?b.a(c,e):b.call(null,c,e)}function d(a){return b.b?b.b(a):b.call(null,a)}function e(){return b.m?b.m():b.call(null)}var f=null,g=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new Cc(g,0)}return d.call(this,a,b,f)}function d(c,e,f){e=B.c(a,e,f);return b.a?b.a(c,e):b.call(null,c,e)}c.w=2;c.B=function(a){var b=
I(a);a=J(a);var c=I(a);a=Dc(a);return d(b,c,a)};c.h=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var n=null;if(2<arguments.length){for(var n=0,p=Array(arguments.length-2);n<p.length;)p[n]=arguments[n+2],++n;n=new Cc(p,0)}return g.h(a,b,n)}throw Error("Invalid arity: "+arguments.length);};f.w=2;f.B=g.B;f.m=e;f.b=d;f.a=c;f.h=g.h;return f}()}};
T.a=function(a,b){return new je(null,function(){var c=H(b);if(c){if(yd(c)){for(var d=bc(c),e=N(d),f=ne(e),g=0;;)if(g<e)pe(f,function(){var b=eb.a(d,g);return a.b?a.b(b):a.call(null,b)}()),g+=1;else break;return oe(f.W(),T.a(a,cc(c)))}return M(function(){var b=I(c);return a.b?a.b(b):a.call(null,b)}(),T.a(a,Dc(c)))}return null},null,null)};
T.c=function(a,b,c){return new je(null,function(){var d=H(b),e=H(c);if(d&&e){var f=M,g;g=I(d);var h=I(e);g=a.a?a.a(g,h):a.call(null,g,h);d=f(g,T.c(a,Dc(d),Dc(e)))}else d=null;return d},null,null)};T.l=function(a,b,c,d){return new je(null,function(){var e=H(b),f=H(c),g=H(d);if(e&&f&&g){var h=M,l;l=I(e);var m=I(f),n=I(g);l=a.c?a.c(l,m,n):a.call(null,l,m,n);e=h(l,T.l(a,Dc(e),Dc(f),Dc(g)))}else e=null;return e},null,null)};
T.h=function(a,b,c,d,e){var f=function h(a){return new je(null,function(){var b=T.a(H,a);return Ee(Ld,b)?M(T.a(I,b),h(T.a(Dc,b))):null},null,null)};return T.a(function(){return function(b){return B.a(a,b)}}(f),f(id.h(e,d,G([c,b],0))))};T.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),e=J(d),d=I(e),e=J(e);return T.h(b,a,c,d,e)};T.w=4;function Se(a,b){return new je(null,function(){if(0<a){var c=H(b);return c?M(I(c),Se(a-1,Dc(c))):null}return null},null,null)}
function Te(a,b){return new je(null,function(c){return function(){return c(a,b)}}(function(a,b){for(;;){var e=H(b);if(0<a&&e){var f=a-1,e=Dc(e);a=f;b=e}else return e}}),null,null)}function Ue(a){return new je(null,function(){return M(a,Ue(a))},null,null)}function Ve(a){return new je(null,function(){return M(a.m?a.m():a.call(null),Ve(a))},null,null)}
var We=function We(b,c){return M(c,new je(null,function(){return We(b,b.b?b.b(c):b.call(null,c))},null,null))},Xe=function Xe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Xe.a(arguments[0],arguments[1]);default:return Xe.h(arguments[0],arguments[1],new Cc(c.slice(2),0))}};Xe.a=function(a,b){return new je(null,function(){var c=H(a),d=H(b);return c&&d?M(I(c),M(I(d),Xe.a(Dc(c),Dc(d)))):null},null,null)};
Xe.h=function(a,b,c){return new je(null,function(){var d=T.a(H,id.h(c,b,G([a],0)));return Ee(Ld,d)?te.a(T.a(I,d),B.a(Xe,T.a(Dc,d))):null},null,null)};Xe.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return Xe.h(b,a,c)};Xe.w=2;function Ye(a){return Te(1,Xe.a(Ue("L"),a))}Ze;
function $e(a,b){return new je(null,function(){var c=H(b);if(c){if(yd(c)){for(var d=bc(c),e=N(d),f=ne(e),g=0;;)if(g<e){var h;h=eb.a(d,g);h=a.b?a.b(h):a.call(null,h);x(h)&&(h=eb.a(d,g),f.add(h));g+=1}else break;return oe(f.W(),$e(a,cc(c)))}d=I(c);c=Dc(c);return x(a.b?a.b(d):a.call(null,d))?M(d,$e(a,c)):$e(a,c)}return null},null,null)}function af(a,b){return $e(Ge(a),b)}
function bf(a){return function c(a){return new je(null,function(){var e=M,f;x(Dd.b?Dd.b(a):Dd.call(null,a))?(f=G([H.b?H.b(a):H.call(null,a)],0),f=B.a(te,B.c(T,c,f))):f=null;return e(a,f)},null,null)}(a)}var cf=function cf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return cf.a(arguments[0],arguments[1]);case 3:return cf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
cf.a=function(a,b){return null!=a?null!=a&&(a.C&4||a.Lc)?Rc(ue(Xa.c(Vb,Ub(a),b)),qd(a)):Xa.c(cb,a,b):Xa.c(id,Ec,b)};cf.c=function(a,b,c){return null!=a&&(a.C&4||a.Lc)?Rc(ue(Md(b,ve,Ub(a),c)),qd(a)):Md(b,id,a,c)};cf.w=3;function df(a,b){var c;a:{c=Cd;for(var d=a,e=H(b);;)if(e)if(null!=d?d.g&256||d.sc||(d.g?0:Ra(lb,d)):Ra(lb,d)){d=C.c(d,I(e),c);if(c===d){c=null;break a}e=J(e)}else{c=null;break a}else{c=d;break a}}return c}
var ef=function ef(b,c,d){var e=P(c,0);c=Wd(c,1);return x(c)?Q.c(b,e,ef(C.a(b,e),c,d)):Q.c(b,e,d)},ff=function ff(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return ff.c(arguments[0],arguments[1],arguments[2]);case 4:return ff.l(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return ff.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);case 6:return ff.T(arguments[0],arguments[1],arguments[2],arguments[3],
arguments[4],arguments[5]);default:return ff.h(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],new Cc(c.slice(6),0))}};ff.c=function(a,b,c){var d=P(b,0);b=Wd(b,1);return x(b)?Q.c(a,d,ff.c(C.a(a,d),b,c)):Q.c(a,d,function(){var b=C.a(a,d);return c.b?c.b(b):c.call(null,b)}())};ff.l=function(a,b,c,d){var e=P(b,0);b=Wd(b,1);return x(b)?Q.c(a,e,ff.l(C.a(a,e),b,c,d)):Q.c(a,e,function(){var b=C.a(a,e);return c.a?c.a(b,d):c.call(null,b,d)}())};
ff.A=function(a,b,c,d,e){var f=P(b,0);b=Wd(b,1);return x(b)?Q.c(a,f,ff.A(C.a(a,f),b,c,d,e)):Q.c(a,f,function(){var b=C.a(a,f);return c.c?c.c(b,d,e):c.call(null,b,d,e)}())};ff.T=function(a,b,c,d,e,f){var g=P(b,0);b=Wd(b,1);return x(b)?Q.c(a,g,ff.T(C.a(a,g),b,c,d,e,f)):Q.c(a,g,function(){var b=C.a(a,g);return c.l?c.l(b,d,e,f):c.call(null,b,d,e,f)}())};ff.h=function(a,b,c,d,e,f,g){var h=P(b,0);b=Wd(b,1);return x(b)?Q.c(a,h,B.h(ff,C.a(a,h),b,c,d,G([e,f,g],0))):Q.c(a,h,B.h(c,C.a(a,h),d,e,f,G([g],0)))};
ff.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),e=J(d),d=I(e),f=J(e),e=I(f),g=J(f),f=I(g),g=J(g);return ff.h(b,a,c,d,e,f,g)};ff.w=6;
var gf=function gf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return gf.c(arguments[0],arguments[1],arguments[2]);case 4:return gf.l(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return gf.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);case 6:return gf.T(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);default:return gf.h(arguments[0],arguments[1],arguments[2],arguments[3],
arguments[4],arguments[5],new Cc(c.slice(6),0))}};gf.c=function(a,b,c){return Q.c(a,b,function(){var d=C.a(a,b);return c.b?c.b(d):c.call(null,d)}())};gf.l=function(a,b,c,d){return Q.c(a,b,function(){var e=C.a(a,b);return c.a?c.a(e,d):c.call(null,e,d)}())};gf.A=function(a,b,c,d,e){return Q.c(a,b,function(){var f=C.a(a,b);return c.c?c.c(f,d,e):c.call(null,f,d,e)}())};gf.T=function(a,b,c,d,e,f){return Q.c(a,b,function(){var g=C.a(a,b);return c.l?c.l(g,d,e,f):c.call(null,g,d,e,f)}())};
gf.h=function(a,b,c,d,e,f,g){return Q.c(a,b,B.h(c,C.a(a,b),d,e,f,G([g],0)))};gf.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),e=J(d),d=I(e),f=J(e),e=I(f),g=J(f),f=I(g),g=J(g);return gf.h(b,a,c,d,e,f,g)};gf.w=6;function hf(a,b){this.V=a;this.f=b}function jf(a){return new hf(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function kf(a){a=a.o;return 32>a?0:a-1>>>5<<5}
function mf(a,b,c){for(;;){if(0===b)return c;var d=jf(a);d.f[0]=c;c=d;b-=5}}var nf=function nf(b,c,d,e){var f=new hf(d.V,Wa(d.f)),g=b.o-1>>>c&31;5===c?f.f[g]=e:(d=d.f[g],b=null!=d?nf(b,c-5,d,e):mf(null,c-5,e),f.f[g]=b);return f};function of(a,b){throw Error([A("No item "),A(a),A(" in vector of length "),A(b)].join(""));}function pf(a,b){if(b>=kf(a))return a.O;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.f[b>>>d&31],d=e;else return c.f}function qf(a,b){return 0<=b&&b<a.o?pf(a,b):of(b,a.o)}
var rf=function rf(b,c,d,e,f){var g=new hf(d.V,Wa(d.f));if(0===c)g.f[e&31]=f;else{var h=e>>>c&31;b=rf(b,c-5,d.f[h],e,f);g.f[h]=b}return g};function sf(a,b,c,d,e,f){this.s=a;this.fc=b;this.f=c;this.Na=d;this.start=e;this.end=f}sf.prototype.ya=function(){return this.s<this.end};sf.prototype.next=function(){32===this.s-this.fc&&(this.f=pf(this.Na,this.s),this.fc+=32);var a=this.f[this.s&31];this.s+=1;return a};tf;uf;vf;K;wf;xf;yf;
function R(a,b,c,d,e,f){this.v=a;this.o=b;this.shift=c;this.root=d;this.O=e;this.u=f;this.g=167668511;this.C=8196}k=R.prototype;k.toString=function(){return kc(this)};k.equiv=function(a){return this.D(null,a)};k.N=function(a,b){return mb.c(this,b,null)};k.I=function(a,b,c){return"number"===typeof b?eb.c(this,b,c):c};
k.Gb=function(a,b,c){a=0;for(var d=c;;)if(a<this.o){var e=pf(this,a);c=e.length;a:for(var f=0;;)if(f<c){var g=f+a,h=e[f],d=b.c?b.c(d,g,h):b.call(null,d,g,h);if(Uc(d)){e=d;break a}f+=1}else{e=d;break a}if(Uc(e))return K.b?K.b(e):K.call(null,e);a+=c;d=e}else return d};k.ba=function(a,b){return qf(this,b)[b&31]};k.Ea=function(a,b,c){return 0<=b&&b<this.o?pf(this,b)[b&31]:c};
k.eb=function(a,b,c){if(0<=b&&b<this.o)return kf(this)<=b?(a=Wa(this.O),a[b&31]=c,new R(this.v,this.o,this.shift,this.root,a,null)):new R(this.v,this.o,this.shift,rf(this,this.shift,this.root,b,c),this.O,null);if(b===this.o)return cb(this,c);throw Error([A("Index "),A(b),A(" out of bounds  [0,"),A(this.o),A("]")].join(""));};k.Ha=function(){var a=this.o;return new sf(0,0,0<N(this)?pf(this,0):null,this,0,a)};k.P=function(){return this.v};k.Z=function(){return this.o};
k.Hb=function(){return eb.a(this,0)};k.Ib=function(){return eb.a(this,1)};k.cb=function(){return 0<this.o?eb.a(this,this.o-1):null};k.Xb=function(){return 0<this.o?new ad(this,this.o-1,null):null};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Lc(this)};k.D=function(a,b){if(b instanceof R)if(this.o===N(b))for(var c=ic(this),d=ic(b);;)if(x(c.ya())){var e=c.next(),f=d.next();if(!sc.a(e,f))return!1}else return!0;else return!1;else return Qc(this,b)};
k.pb=function(){return new vf(this.o,this.shift,tf.b?tf.b(this.root):tf.call(null,this.root),uf.b?uf.b(this.O):uf.call(null,this.O))};k.ca=function(){return Rc(jd,this.v)};k.ea=function(a,b){return Vc(this,b)};k.fa=function(a,b,c){a=0;for(var d=c;;)if(a<this.o){var e=pf(this,a);c=e.length;a:for(var f=0;;)if(f<c){var g=e[f],d=b.a?b.a(d,g):b.call(null,d,g);if(Uc(d)){e=d;break a}f+=1}else{e=d;break a}if(Uc(e))return K.b?K.b(e):K.call(null,e);a+=c;d=e}else return d};
k.Ra=function(a,b,c){if("number"===typeof b)return yb(this,b,c);throw Error("Vector's key for assoc must be a number.");};k.U=function(){if(0===this.o)return null;if(32>=this.o)return new Cc(this.O,0);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.f[0];else{a=a.f;break a}}return yf.l?yf.l(this,a,0,0):yf.call(null,this,a,0,0)};k.R=function(a,b){return new R(b,this.o,this.shift,this.root,this.O,this.u)};
k.X=function(a,b){if(32>this.o-kf(this)){for(var c=this.O.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.O[e],e+=1;else break;d[c]=b;return new R(this.v,this.o+1,this.shift,this.root,d,null)}c=(d=this.o>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=jf(null),d.f[0]=this.root,e=mf(null,this.shift,new hf(null,this.O)),d.f[1]=e):d=nf(this,this.shift,this.root,new hf(null,this.O));return new R(this.v,this.o+1,c,d,[b],null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.ba(null,c);case 3:return this.Ea(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.ba(null,c)};a.c=function(a,c,d){return this.Ea(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};k.b=function(a){return this.ba(null,a)};k.a=function(a,b){return this.Ea(null,a,b)};
var S=new hf(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),jd=new R(null,0,5,S,[],Mc);function zf(a){var b=a.length;if(32>b)return new R(null,b,5,S,a,null);for(var c=32,d=(new R(null,32,5,S,a.slice(0,32),null)).pb(null);;)if(c<b)var e=c+1,d=ve.a(d,a[c]),c=e;else return Wb(d)}R.prototype[Ua]=function(){return Gc(this)};function Kd(a){return Pa(a)?zf(a):Wb(Xa.c(Vb,Ub(jd),a))}
var Af=function Af(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Af.h(0<c.length?new Cc(c.slice(0),0):null)};Af.h=function(a){return a instanceof Cc&&0===a.s?zf(a.f):Kd(a)};Af.w=0;Af.B=function(a){return Af.h(H(a))};Bf;function xd(a,b,c,d,e,f){this.Ga=a;this.node=b;this.s=c;this.ua=d;this.v=e;this.u=f;this.g=32375020;this.C=1536}k=xd.prototype;k.toString=function(){return kc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};
k.wa=function(){if(this.ua+1<this.node.length){var a;a=this.Ga;var b=this.node,c=this.s,d=this.ua+1;a=yf.l?yf.l(a,b,c,d):yf.call(null,a,b,c,d);return null==a?null:a}return dc(this)};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Lc(this)};k.D=function(a,b){return Qc(this,b)};k.ca=function(){return Rc(jd,this.v)};k.ea=function(a,b){var c;c=this.Ga;var d=this.s+this.ua,e=N(this.Ga);c=Bf.c?Bf.c(c,d,e):Bf.call(null,c,d,e);return Vc(c,b)};
k.fa=function(a,b,c){a=this.Ga;var d=this.s+this.ua,e=N(this.Ga);a=Bf.c?Bf.c(a,d,e):Bf.call(null,a,d,e);return Wc(a,b,c)};k.ta=function(){return this.node[this.ua]};k.xa=function(){if(this.ua+1<this.node.length){var a;a=this.Ga;var b=this.node,c=this.s,d=this.ua+1;a=yf.l?yf.l(a,b,c,d):yf.call(null,a,b,c,d);return null==a?Ec:a}return cc(this)};k.U=function(){return this};k.ic=function(){var a=this.node;return new le(a,this.ua,a.length)};
k.jc=function(){var a=this.s+this.node.length;if(a<$a(this.Ga)){var b=this.Ga,c=pf(this.Ga,a);return yf.l?yf.l(b,c,a,0):yf.call(null,b,c,a,0)}return Ec};k.R=function(a,b){return yf.A?yf.A(this.Ga,this.node,this.s,this.ua,b):yf.call(null,this.Ga,this.node,this.s,this.ua,b)};k.X=function(a,b){return M(b,this)};k.hc=function(){var a=this.s+this.node.length;if(a<$a(this.Ga)){var b=this.Ga,c=pf(this.Ga,a);return yf.l?yf.l(b,c,a,0):yf.call(null,b,c,a,0)}return null};xd.prototype[Ua]=function(){return Gc(this)};
var yf=function yf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return yf.c(arguments[0],arguments[1],arguments[2]);case 4:return yf.l(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return yf.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};yf.c=function(a,b,c){return new xd(a,qf(a,b),b,c,null,null)};
yf.l=function(a,b,c,d){return new xd(a,b,c,d,null,null)};yf.A=function(a,b,c,d,e){return new xd(a,b,c,d,e,null)};yf.w=5;Cf;function Df(a,b,c,d,e){this.v=a;this.Na=b;this.start=c;this.end=d;this.u=e;this.g=167666463;this.C=8192}k=Df.prototype;k.toString=function(){return kc(this)};k.equiv=function(a){return this.D(null,a)};k.N=function(a,b){return mb.c(this,b,null)};k.I=function(a,b,c){return"number"===typeof b?eb.c(this,b,c):c};
k.Gb=function(a,b,c){a=this.start;for(var d=0;;)if(a<this.end){var e=d,f=eb.a(this.Na,a);c=b.c?b.c(c,e,f):b.call(null,c,e,f);if(Uc(c))return K.b?K.b(c):K.call(null,c);d+=1;a+=1}else return c};k.ba=function(a,b){return 0>b||this.end<=this.start+b?of(b,this.end-this.start):eb.a(this.Na,this.start+b)};k.Ea=function(a,b,c){return 0>b||this.end<=this.start+b?c:eb.c(this.Na,this.start+b,c)};
k.eb=function(a,b,c){var d=this.start+b;a=this.v;c=Q.c(this.Na,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return Cf.A?Cf.A(a,c,b,d,null):Cf.call(null,a,c,b,d,null)};k.P=function(){return this.v};k.Z=function(){return this.end-this.start};k.cb=function(){return eb.a(this.Na,this.end-1)};k.Xb=function(){return this.start!==this.end?new ad(this,this.end-this.start-1,null):null};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Lc(this)};k.D=function(a,b){return Qc(this,b)};
k.ca=function(){return Rc(jd,this.v)};k.ea=function(a,b){return Vc(this,b)};k.fa=function(a,b,c){return Wc(this,b,c)};k.Ra=function(a,b,c){if("number"===typeof b)return yb(this,b,c);throw Error("Subvec's key for assoc must be a number.");};k.U=function(){var a=this;return function(b){return function d(e){return e===a.end?null:M(eb.a(a.Na,e),new je(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};
k.R=function(a,b){return Cf.A?Cf.A(b,this.Na,this.start,this.end,this.u):Cf.call(null,b,this.Na,this.start,this.end,this.u)};k.X=function(a,b){var c=this.v,d=yb(this.Na,this.end,b),e=this.start,f=this.end+1;return Cf.A?Cf.A(c,d,e,f,null):Cf.call(null,c,d,e,f,null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.ba(null,c);case 3:return this.Ea(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.ba(null,c)};a.c=function(a,c,d){return this.Ea(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};k.b=function(a){return this.ba(null,a)};k.a=function(a,b){return this.Ea(null,a,b)};Df.prototype[Ua]=function(){return Gc(this)};
function Cf(a,b,c,d,e){for(;;)if(b instanceof Df)c=b.start+c,d=b.start+d,b=b.Na;else{var f=N(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new Df(a,b,c,d,e)}}var Bf=function Bf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Bf.a(arguments[0],arguments[1]);case 3:return Bf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
Bf.a=function(a,b){return Bf.c(a,b,N(a))};Bf.c=function(a,b,c){return Cf(null,a,b,c,null)};Bf.w=3;function Ef(a,b){return a===b.V?b:new hf(a,Wa(b.f))}function tf(a){return new hf({},Wa(a.f))}function uf(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];Bd(a,0,b,0,a.length);return b}
var Ff=function Ff(b,c,d,e){d=Ef(b.root.V,d);var f=b.o-1>>>c&31;if(5===c)b=e;else{var g=d.f[f];b=null!=g?Ff(b,c-5,g,e):mf(b.root.V,c-5,e)}d.f[f]=b;return d};function vf(a,b,c,d){this.o=a;this.shift=b;this.root=c;this.O=d;this.C=88;this.g=275}k=vf.prototype;
k.Mb=function(a,b){if(this.root.V){if(32>this.o-kf(this))this.O[this.o&31]=b;else{var c=new hf(this.root.V,this.O),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.O=d;if(this.o>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=mf(this.root.V,this.shift,c);this.root=new hf(this.root.V,d);this.shift=e}else this.root=Ff(this,this.shift,this.root,c)}this.o+=1;return this}throw Error("conj! after persistent!");};k.Nb=function(){if(this.root.V){this.root.V=null;var a=this.o-kf(this),b=Array(a);Bd(this.O,0,b,0,a);return new R(null,this.o,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
k.Lb=function(a,b,c){if("number"===typeof b)return Yb(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
k.tc=function(a,b,c){var d=this;if(d.root.V){if(0<=b&&b<d.o)return kf(this)<=b?d.O[b&31]=c:(a=function(){return function f(a,h){var l=Ef(d.root.V,h);if(0===a)l.f[b&31]=c;else{var m=b>>>a&31,n=f(a-5,l.f[m]);l.f[m]=n}return l}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.o)return Vb(this,c);throw Error([A("Index "),A(b),A(" out of bounds for TransientVector of length"),A(d.o)].join(""));}throw Error("assoc! after persistent!");};
k.Z=function(){if(this.root.V)return this.o;throw Error("count after persistent!");};k.ba=function(a,b){if(this.root.V)return qf(this,b)[b&31];throw Error("nth after persistent!");};k.Ea=function(a,b,c){return 0<=b&&b<this.o?eb.a(this,b):c};k.N=function(a,b){return mb.c(this,b,null)};k.I=function(a,b,c){return"number"===typeof b?eb.c(this,b,c):c};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};function Gf(){this.g=2097152;this.C=0}
Gf.prototype.equiv=function(a){return this.D(null,a)};Gf.prototype.D=function(){return!1};var Hf=new Gf;function If(a,b){return Ed(ud(b)?N(a)===N(b)?Ee(Ld,T.a(function(a){return sc.a(C.c(b,I(a),Hf),gd(a))},a)):null:null)}function Jf(a,b,c,d,e){this.s=a;this.kd=b;this.oc=c;this.$c=d;this.Fc=e}Jf.prototype.ya=function(){var a=this.s<this.oc;return a?a:this.Fc.ya()};Jf.prototype.next=function(){if(this.s<this.oc){var a=ld(this.$c,this.s);this.s+=1;return new R(null,2,5,S,[a,mb.a(this.kd,a)],null)}return this.Fc.next()};
Jf.prototype.remove=function(){return Error("Unsupported operation")};function Kf(a){this.H=a}Kf.prototype.next=function(){if(null!=this.H){var a=I(this.H),b=P(a,0),a=P(a,1);this.H=J(this.H);return{value:[b,a],done:!1}}return{value:null,done:!0}};function Lf(a){return new Kf(H(a))}function Mf(a){this.H=a}Mf.prototype.next=function(){if(null!=this.H){var a=I(this.H);this.H=J(this.H);return{value:[a,a],done:!1}}return{value:null,done:!0}};
function Nf(a,b){var c;if(b instanceof y)a:{c=a.length;for(var d=b.Ia,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof y&&d===a[e].Ia){c=e;break a}e+=2}}else if("string"==typeof b||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof rc)a:for(c=a.length,d=b.Va,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof rc&&d===a[e].Va){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=
a.length,d=0;;){if(c<=d){c=-1;break a}if(sc.a(b,a[d])){c=d;break a}d+=2}return c}Of;function Pf(a,b,c){this.f=a;this.s=b;this.Da=c;this.g=32374990;this.C=0}k=Pf.prototype;k.toString=function(){return kc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.Da};k.wa=function(){return this.s<this.f.length-2?new Pf(this.f,this.s+2,this.Da):null};k.Z=function(){return(this.f.length-this.s)/2};k.S=function(){return Lc(this)};k.D=function(a,b){return Qc(this,b)};
k.ca=function(){return Rc(Ec,this.Da)};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){return new R(null,2,5,S,[this.f[this.s],this.f[this.s+1]],null)};k.xa=function(){return this.s<this.f.length-2?new Pf(this.f,this.s+2,this.Da):Ec};k.U=function(){return this};k.R=function(a,b){return new Pf(this.f,this.s,b)};k.X=function(a,b){return M(b,this)};Pf.prototype[Ua]=function(){return Gc(this)};Qf;Rf;function Sf(a,b,c){this.f=a;this.s=b;this.o=c}
Sf.prototype.ya=function(){return this.s<this.o};Sf.prototype.next=function(){var a=new R(null,2,5,S,[this.f[this.s],this.f[this.s+1]],null);this.s+=2;return a};function v(a,b,c,d){this.v=a;this.o=b;this.f=c;this.u=d;this.g=16647951;this.C=8196}k=v.prototype;k.toString=function(){return kc(this)};k.equiv=function(a){return this.D(null,a)};k.keys=function(){return Gc(Qf.b?Qf.b(this):Qf.call(null,this))};k.entries=function(){return Lf(H(this))};
k.values=function(){return Gc(Rf.b?Rf.b(this):Rf.call(null,this))};k.has=function(a){return Fd(this,a)};k.get=function(a,b){return this.I(null,a,b)};k.forEach=function(a){for(var b=H(this),c=null,d=0,e=0;;)if(e<d){var f=c.ba(null,e),g=P(f,0),f=P(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=H(b))yd(b)?(c=bc(b),b=cc(b),g=c,d=N(c),c=g):(c=I(b),g=P(c,0),f=P(c,1),a.a?a.a(f,g):a.call(null,f,g),b=J(b),c=null,d=0),e=0;else return null};k.N=function(a,b){return mb.c(this,b,null)};
k.I=function(a,b,c){a=Nf(this.f,b);return-1===a?c:this.f[a+1]};k.Gb=function(a,b,c){a=this.f.length;for(var d=0;;)if(d<a){var e=this.f[d],f=this.f[d+1];c=b.c?b.c(c,e,f):b.call(null,c,e,f);if(Uc(c))return K.b?K.b(c):K.call(null,c);d+=2}else return c};k.Ha=function(){return new Sf(this.f,0,2*this.o)};k.P=function(){return this.v};k.Z=function(){return this.o};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Nc(this)};
k.D=function(a,b){if(null!=b&&(b.g&1024||b.Oc)){var c=this.f.length;if(this.o===b.Z(null))for(var d=0;;)if(d<c){var e=b.I(null,this.f[d],Cd);if(e!==Cd)if(sc.a(this.f[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return If(this,b)};k.pb=function(){return new Of({},this.f.length,Wa(this.f))};k.ca=function(){return Db(W,this.v)};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};
k.rb=function(a,b){if(0<=Nf(this.f,b)){var c=this.f.length,d=c-2;if(0===d)return ab(this);for(var d=Array(d),e=0,f=0;;){if(e>=c)return new v(this.v,this.o-1,d,null);sc.a(b,this.f[e])||(d[f]=this.f[e],d[f+1]=this.f[e+1],f+=2);e+=2}}else return this};
k.Ra=function(a,b,c){a=Nf(this.f,b);if(-1===a){if(this.o<Tf){a=this.f;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new v(this.v,this.o+1,e,null)}return Db(pb(cf.a(Uf,this),b,c),this.v)}if(c===this.f[a+1])return this;b=Wa(this.f);b[a+1]=c;return new v(this.v,this.o,b,null)};k.gc=function(a,b){return-1!==Nf(this.f,b)};k.U=function(){var a=this.f;return 0<=a.length-2?new Pf(a,0,null):null};k.R=function(a,b){return new v(b,this.o,this.f,this.u)};
k.X=function(a,b){if(vd(b))return pb(this,eb.a(b,0),eb.a(b,1));for(var c=this,d=H(b);;){if(null==d)return c;var e=I(d);if(vd(e))c=pb(c,eb.a(e,0),eb.a(e,1)),d=J(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};var W=new v(null,0,[],Oc),Tf=8;v.prototype[Ua]=function(){return Gc(this)};
Vf;function Of(a,b,c){this.wb=a;this.kb=b;this.f=c;this.g=258;this.C=56}k=Of.prototype;k.Z=function(){if(x(this.wb))return Ud(this.kb);throw Error("count after persistent!");};k.N=function(a,b){return mb.c(this,b,null)};k.I=function(a,b,c){if(x(this.wb))return a=Nf(this.f,b),-1===a?c:this.f[a+1];throw Error("lookup after persistent!");};
k.Mb=function(a,b){if(x(this.wb)){if(null!=b?b.g&2048||b.Pc||(b.g?0:Ra(sb,b)):Ra(sb,b))return Xb(this,Yd.b?Yd.b(b):Yd.call(null,b),Zd.b?Zd.b(b):Zd.call(null,b));for(var c=H(b),d=this;;){var e=I(c);if(x(e))c=J(c),d=Xb(d,Yd.b?Yd.b(e):Yd.call(null,e),Zd.b?Zd.b(e):Zd.call(null,e));else return d}}else throw Error("conj! after persistent!");};k.Nb=function(){if(x(this.wb))return this.wb=!1,new v(null,Ud(this.kb),this.f,null);throw Error("persistent! called twice");};
k.Lb=function(a,b,c){if(x(this.wb)){a=Nf(this.f,b);if(-1===a)return this.kb+2<=2*Tf?(this.kb+=2,this.f.push(b),this.f.push(c),this):we(Vf.a?Vf.a(this.kb,this.f):Vf.call(null,this.kb,this.f),b,c);c!==this.f[a+1]&&(this.f[a+1]=c);return this}throw Error("assoc! after persistent!");};Wf;md;function Vf(a,b){for(var c=Ub(Uf),d=0;;)if(d<a)c=Xb(c,b[d],b[d+1]),d+=2;else return c}function Xf(){this.G=!1}Yf;Zf;Pe;$f;X;K;function ag(a,b){return a===b?!0:he(a,b)?!0:sc.a(a,b)}
function bg(a,b,c){a=Wa(a);a[b]=c;return a}function cg(a,b){var c=Array(a.length-2);Bd(a,0,c,0,2*b);Bd(a,2*(b+1),c,2*b,c.length-2*b);return c}function dg(a,b,c,d){a=a.gb(b);a.f[c]=d;return a}function eg(a,b,c){for(var d=a.length,e=0,f=c;;)if(e<d){c=a[e];if(null!=c){var g=a[e+1];c=b.c?b.c(f,c,g):b.call(null,f,c,g)}else c=a[e+1],c=null!=c?c.jb(b,f):f;if(Uc(c))return K.b?K.b(c):K.call(null,c);e+=2;f=c}else return f}fg;function gg(a,b,c,d){this.f=a;this.s=b;this.Ub=c;this.Qa=d}
gg.prototype.advance=function(){for(var a=this.f.length;;)if(this.s<a){var b=this.f[this.s],c=this.f[this.s+1];null!=b?b=this.Ub=new R(null,2,5,S,[b,c],null):null!=c?(b=ic(c),b=b.ya()?this.Qa=b:!1):b=!1;this.s+=2;if(b)return!0}else return!1};gg.prototype.ya=function(){var a=null!=this.Ub;return a?a:(a=null!=this.Qa)?a:this.advance()};
gg.prototype.next=function(){if(null!=this.Ub){var a=this.Ub;this.Ub=null;return a}if(null!=this.Qa)return a=this.Qa.next(),this.Qa.ya()||(this.Qa=null),a;if(this.advance())return this.next();throw Error("No such element");};gg.prototype.remove=function(){return Error("Unsupported operation")};function hg(a,b,c){this.V=a;this.Y=b;this.f=c}k=hg.prototype;k.gb=function(a){if(a===this.V)return this;var b=Vd(this.Y),c=Array(0>b?4:2*(b+1));Bd(this.f,0,c,0,2*b);return new hg(a,this.Y,c)};
k.Rb=function(){return Yf.b?Yf.b(this.f):Yf.call(null,this.f)};k.jb=function(a,b){return eg(this.f,a,b)};k.$a=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.Y&e))return d;var f=Vd(this.Y&e-1),e=this.f[2*f],f=this.f[2*f+1];return null==e?f.$a(a+5,b,c,d):ag(c,e)?f:d};
k.Pa=function(a,b,c,d,e,f){var g=1<<(c>>>b&31),h=Vd(this.Y&g-1);if(0===(this.Y&g)){var l=Vd(this.Y);if(2*l<this.f.length){a=this.gb(a);b=a.f;f.G=!0;a:for(c=2*(l-h),f=2*h+(c-1),l=2*(h+1)+(c-1);;){if(0===c)break a;b[l]=b[f];--l;--c;--f}b[2*h]=d;b[2*h+1]=e;a.Y|=g;return a}if(16<=l){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[c>>>b&31]=ig.Pa(a,b+5,c,d,e,f);for(e=d=0;;)if(32>d)0!==
(this.Y>>>d&1)&&(h[d]=null!=this.f[e]?ig.Pa(a,b+5,xc(this.f[e]),this.f[e],this.f[e+1],f):this.f[e+1],e+=2),d+=1;else break;return new fg(a,l+1,h)}b=Array(2*(l+4));Bd(this.f,0,b,0,2*h);b[2*h]=d;b[2*h+1]=e;Bd(this.f,2*h,b,2*(h+1),2*(l-h));f.G=!0;a=this.gb(a);a.f=b;a.Y|=g;return a}l=this.f[2*h];g=this.f[2*h+1];if(null==l)return l=g.Pa(a,b+5,c,d,e,f),l===g?this:dg(this,a,2*h+1,l);if(ag(d,l))return e===g?this:dg(this,a,2*h+1,e);f.G=!0;f=b+5;d=$f.aa?$f.aa(a,f,l,g,c,d,e):$f.call(null,a,f,l,g,c,d,e);e=2*
h;h=2*h+1;a=this.gb(a);a.f[e]=null;a.f[h]=d;return a};
k.Oa=function(a,b,c,d,e){var f=1<<(b>>>a&31),g=Vd(this.Y&f-1);if(0===(this.Y&f)){var h=Vd(this.Y);if(16<=h){g=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];g[b>>>a&31]=ig.Oa(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.Y>>>c&1)&&(g[c]=null!=this.f[d]?ig.Oa(a+5,xc(this.f[d]),this.f[d],this.f[d+1],e):this.f[d+1],d+=2),c+=1;else break;return new fg(null,h+1,g)}a=Array(2*(h+1));Bd(this.f,
0,a,0,2*g);a[2*g]=c;a[2*g+1]=d;Bd(this.f,2*g,a,2*(g+1),2*(h-g));e.G=!0;return new hg(null,this.Y|f,a)}var l=this.f[2*g],f=this.f[2*g+1];if(null==l)return h=f.Oa(a+5,b,c,d,e),h===f?this:new hg(null,this.Y,bg(this.f,2*g+1,h));if(ag(c,l))return d===f?this:new hg(null,this.Y,bg(this.f,2*g+1,d));e.G=!0;e=this.Y;h=this.f;a+=5;a=$f.T?$f.T(a,l,f,b,c,d):$f.call(null,a,l,f,b,c,d);c=2*g;g=2*g+1;d=Wa(h);d[c]=null;d[g]=a;return new hg(null,e,d)};
k.Sb=function(a,b,c){var d=1<<(b>>>a&31);if(0===(this.Y&d))return this;var e=Vd(this.Y&d-1),f=this.f[2*e],g=this.f[2*e+1];return null==f?(a=g.Sb(a+5,b,c),a===g?this:null!=a?new hg(null,this.Y,bg(this.f,2*e+1,a)):this.Y===d?null:new hg(null,this.Y^d,cg(this.f,e))):ag(c,f)?new hg(null,this.Y^d,cg(this.f,e)):this};k.Ha=function(){return new gg(this.f,0,null,null)};var ig=new hg(null,0,[]);function jg(a,b,c){this.f=a;this.s=b;this.Qa=c}
jg.prototype.ya=function(){for(var a=this.f.length;;){if(null!=this.Qa&&this.Qa.ya())return!0;if(this.s<a){var b=this.f[this.s];this.s+=1;null!=b&&(this.Qa=ic(b))}else return!1}};jg.prototype.next=function(){if(this.ya())return this.Qa.next();throw Error("No such element");};jg.prototype.remove=function(){return Error("Unsupported operation")};function fg(a,b,c){this.V=a;this.o=b;this.f=c}k=fg.prototype;k.gb=function(a){return a===this.V?this:new fg(a,this.o,Wa(this.f))};
k.Rb=function(){return Zf.b?Zf.b(this.f):Zf.call(null,this.f)};k.jb=function(a,b){for(var c=this.f.length,d=0,e=b;;)if(d<c){var f=this.f[d];if(null!=f&&(e=f.jb(a,e),Uc(e)))return K.b?K.b(e):K.call(null,e);d+=1}else return e};k.$a=function(a,b,c,d){var e=this.f[b>>>a&31];return null!=e?e.$a(a+5,b,c,d):d};k.Pa=function(a,b,c,d,e,f){var g=c>>>b&31,h=this.f[g];if(null==h)return a=dg(this,a,g,ig.Pa(a,b+5,c,d,e,f)),a.o+=1,a;b=h.Pa(a,b+5,c,d,e,f);return b===h?this:dg(this,a,g,b)};
k.Oa=function(a,b,c,d,e){var f=b>>>a&31,g=this.f[f];if(null==g)return new fg(null,this.o+1,bg(this.f,f,ig.Oa(a+5,b,c,d,e)));a=g.Oa(a+5,b,c,d,e);return a===g?this:new fg(null,this.o,bg(this.f,f,a))};
k.Sb=function(a,b,c){var d=b>>>a&31,e=this.f[d];if(null!=e){a=e.Sb(a+5,b,c);if(a===e)d=this;else if(null==a)if(8>=this.o)a:{e=this.f;a=e.length;b=Array(2*(this.o-1));c=0;for(var f=1,g=0;;)if(c<a)c!==d&&null!=e[c]&&(b[f]=e[c],f+=2,g|=1<<c),c+=1;else{d=new hg(null,g,b);break a}}else d=new fg(null,this.o-1,bg(this.f,d,a));else d=new fg(null,this.o,bg(this.f,d,a));return d}return this};k.Ha=function(){return new jg(this.f,0,null)};
function kg(a,b,c){b*=2;for(var d=0;;)if(d<b){if(ag(c,a[d]))return d;d+=2}else return-1}function lg(a,b,c,d){this.V=a;this.Xa=b;this.o=c;this.f=d}k=lg.prototype;k.gb=function(a){if(a===this.V)return this;var b=Array(2*(this.o+1));Bd(this.f,0,b,0,2*this.o);return new lg(a,this.Xa,this.o,b)};k.Rb=function(){return Yf.b?Yf.b(this.f):Yf.call(null,this.f)};k.jb=function(a,b){return eg(this.f,a,b)};k.$a=function(a,b,c,d){a=kg(this.f,this.o,c);return 0>a?d:ag(c,this.f[a])?this.f[a+1]:d};
k.Pa=function(a,b,c,d,e,f){if(c===this.Xa){b=kg(this.f,this.o,d);if(-1===b){if(this.f.length>2*this.o)return b=2*this.o,c=2*this.o+1,a=this.gb(a),a.f[b]=d,a.f[c]=e,f.G=!0,a.o+=1,a;c=this.f.length;b=Array(c+2);Bd(this.f,0,b,0,c);b[c]=d;b[c+1]=e;f.G=!0;d=this.o+1;a===this.V?(this.f=b,this.o=d,a=this):a=new lg(this.V,this.Xa,d,b);return a}return this.f[b+1]===e?this:dg(this,a,b+1,e)}return(new hg(a,1<<(this.Xa>>>b&31),[null,this,null,null])).Pa(a,b,c,d,e,f)};
k.Oa=function(a,b,c,d,e){return b===this.Xa?(a=kg(this.f,this.o,c),-1===a?(a=2*this.o,b=Array(a+2),Bd(this.f,0,b,0,a),b[a]=c,b[a+1]=d,e.G=!0,new lg(null,this.Xa,this.o+1,b)):sc.a(this.f[a],d)?this:new lg(null,this.Xa,this.o,bg(this.f,a+1,d))):(new hg(null,1<<(this.Xa>>>a&31),[null,this])).Oa(a,b,c,d,e)};k.Sb=function(a,b,c){a=kg(this.f,this.o,c);return-1===a?this:1===this.o?null:new lg(null,this.Xa,this.o-1,cg(this.f,Ud(a)))};k.Ha=function(){return new gg(this.f,0,null,null)};
var $f=function $f(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return $f.T(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return $f.aa(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
$f.T=function(a,b,c,d,e,f){var g=xc(b);if(g===d)return new lg(null,g,2,[b,c,e,f]);var h=new Xf;return ig.Oa(a,g,b,c,h).Oa(a,d,e,f,h)};$f.aa=function(a,b,c,d,e,f,g){var h=xc(c);if(h===e)return new lg(null,h,2,[c,d,f,g]);var l=new Xf;return ig.Pa(a,b,h,c,d,l).Pa(a,b,e,f,g,l)};$f.w=7;function mg(a,b,c,d,e){this.v=a;this.ab=b;this.s=c;this.H=d;this.u=e;this.g=32374860;this.C=0}k=mg.prototype;k.toString=function(){return kc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};
k.S=function(){var a=this.u;return null!=a?a:this.u=a=Lc(this)};k.D=function(a,b){return Qc(this,b)};k.ca=function(){return Rc(Ec,this.v)};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){return null==this.H?new R(null,2,5,S,[this.ab[this.s],this.ab[this.s+1]],null):I(this.H)};
k.xa=function(){if(null==this.H){var a=this.ab,b=this.s+2;return Yf.c?Yf.c(a,b,null):Yf.call(null,a,b,null)}var a=this.ab,b=this.s,c=J(this.H);return Yf.c?Yf.c(a,b,c):Yf.call(null,a,b,c)};k.U=function(){return this};k.R=function(a,b){return new mg(b,this.ab,this.s,this.H,this.u)};k.X=function(a,b){return M(b,this)};mg.prototype[Ua]=function(){return Gc(this)};
var Yf=function Yf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Yf.b(arguments[0]);case 3:return Yf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};Yf.b=function(a){return Yf.c(a,0,null)};
Yf.c=function(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new mg(null,a,b,null,null);var d=a[b+1];if(x(d)&&(d=d.Rb(),x(d)))return new mg(null,a,b+2,d,null);b+=2}else return null;else return new mg(null,a,b,c,null)};Yf.w=3;function ng(a,b,c,d,e){this.v=a;this.ab=b;this.s=c;this.H=d;this.u=e;this.g=32374860;this.C=0}k=ng.prototype;k.toString=function(){return kc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};
k.S=function(){var a=this.u;return null!=a?a:this.u=a=Lc(this)};k.D=function(a,b){return Qc(this,b)};k.ca=function(){return Rc(Ec,this.v)};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){return I(this.H)};k.xa=function(){var a=this.ab,b=this.s,c=J(this.H);return Zf.l?Zf.l(null,a,b,c):Zf.call(null,null,a,b,c)};k.U=function(){return this};k.R=function(a,b){return new ng(b,this.ab,this.s,this.H,this.u)};k.X=function(a,b){return M(b,this)};
ng.prototype[Ua]=function(){return Gc(this)};var Zf=function Zf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Zf.b(arguments[0]);case 4:return Zf.l(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};Zf.b=function(a){return Zf.l(null,a,0,null)};
Zf.l=function(a,b,c,d){if(null==d)for(d=b.length;;)if(c<d){var e=b[c];if(x(e)&&(e=e.Rb(),x(e)))return new ng(a,b,c+1,e,null);c+=1}else return null;else return new ng(a,b,c,d,null)};Zf.w=4;Wf;function og(a,b,c){this.Aa=a;this.Hc=b;this.nc=c}og.prototype.ya=function(){return this.nc&&this.Hc.ya()};og.prototype.next=function(){if(this.nc)return this.Hc.next();this.nc=!0;return this.Aa};og.prototype.remove=function(){return Error("Unsupported operation")};
function md(a,b,c,d,e,f){this.v=a;this.o=b;this.root=c;this.za=d;this.Aa=e;this.u=f;this.g=16123663;this.C=8196}k=md.prototype;k.toString=function(){return kc(this)};k.equiv=function(a){return this.D(null,a)};k.keys=function(){return Gc(Qf.b?Qf.b(this):Qf.call(null,this))};k.entries=function(){return Lf(H(this))};k.values=function(){return Gc(Rf.b?Rf.b(this):Rf.call(null,this))};k.has=function(a){return Fd(this,a)};k.get=function(a,b){return this.I(null,a,b)};
k.forEach=function(a){for(var b=H(this),c=null,d=0,e=0;;)if(e<d){var f=c.ba(null,e),g=P(f,0),f=P(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=H(b))yd(b)?(c=bc(b),b=cc(b),g=c,d=N(c),c=g):(c=I(b),g=P(c,0),f=P(c,1),a.a?a.a(f,g):a.call(null,f,g),b=J(b),c=null,d=0),e=0;else return null};k.N=function(a,b){return mb.c(this,b,null)};k.I=function(a,b,c){return null==b?this.za?this.Aa:c:null==this.root?c:this.root.$a(0,xc(b),b,c)};
k.Gb=function(a,b,c){a=this.za?b.c?b.c(c,null,this.Aa):b.call(null,c,null,this.Aa):c;return Uc(a)?K.b?K.b(a):K.call(null,a):null!=this.root?this.root.jb(b,a):a};k.Ha=function(){var a=this.root?ic(this.root):ze;return this.za?new og(this.Aa,a,!1):a};k.P=function(){return this.v};k.Z=function(){return this.o};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Nc(this)};k.D=function(a,b){return If(this,b)};k.pb=function(){return new Wf({},this.root,this.o,this.za,this.Aa)};
k.ca=function(){return Db(Uf,this.v)};k.rb=function(a,b){if(null==b)return this.za?new md(this.v,this.o-1,this.root,!1,null,null):this;if(null==this.root)return this;var c=this.root.Sb(0,xc(b),b);return c===this.root?this:new md(this.v,this.o-1,c,this.za,this.Aa,null)};
k.Ra=function(a,b,c){if(null==b)return this.za&&c===this.Aa?this:new md(this.v,this.za?this.o:this.o+1,this.root,!0,c,null);a=new Xf;b=(null==this.root?ig:this.root).Oa(0,xc(b),b,c,a);return b===this.root?this:new md(this.v,a.G?this.o+1:this.o,b,this.za,this.Aa,null)};k.gc=function(a,b){return null==b?this.za:null==this.root?!1:this.root.$a(0,xc(b),b,Cd)!==Cd};k.U=function(){if(0<this.o){var a=null!=this.root?this.root.Rb():null;return this.za?M(new R(null,2,5,S,[null,this.Aa],null),a):a}return null};
k.R=function(a,b){return new md(b,this.o,this.root,this.za,this.Aa,this.u)};k.X=function(a,b){if(vd(b))return pb(this,eb.a(b,0),eb.a(b,1));for(var c=this,d=H(b);;){if(null==d)return c;var e=I(d);if(vd(e))c=pb(c,eb.a(e,0),eb.a(e,1)),d=J(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};var Uf=new md(null,0,null,!1,null,Oc);
function nd(a,b){for(var c=a.length,d=0,e=Ub(Uf);;)if(d<c)var f=d+1,e=e.Lb(null,a[d],b[d]),d=f;else return Wb(e)}md.prototype[Ua]=function(){return Gc(this)};function Wf(a,b,c,d,e){this.V=a;this.root=b;this.count=c;this.za=d;this.Aa=e;this.g=258;this.C=56}function pg(a,b,c){if(a.V){if(null==b)a.Aa!==c&&(a.Aa=c),a.za||(a.count+=1,a.za=!0);else{var d=new Xf;b=(null==a.root?ig:a.root).Pa(a.V,0,xc(b),b,c,d);b!==a.root&&(a.root=b);d.G&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}k=Wf.prototype;
k.Z=function(){if(this.V)return this.count;throw Error("count after persistent!");};k.N=function(a,b){return null==b?this.za?this.Aa:null:null==this.root?null:this.root.$a(0,xc(b),b)};k.I=function(a,b,c){return null==b?this.za?this.Aa:c:null==this.root?c:this.root.$a(0,xc(b),b,c)};
k.Mb=function(a,b){var c;a:if(this.V)if(null!=b?b.g&2048||b.Pc||(b.g?0:Ra(sb,b)):Ra(sb,b))c=pg(this,Yd.b?Yd.b(b):Yd.call(null,b),Zd.b?Zd.b(b):Zd.call(null,b));else{c=H(b);for(var d=this;;){var e=I(c);if(x(e))c=J(c),d=pg(d,Yd.b?Yd.b(e):Yd.call(null,e),Zd.b?Zd.b(e):Zd.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};k.Nb=function(){var a;if(this.V)this.V=null,a=new md(null,this.count,this.root,this.za,this.Aa,null);else throw Error("persistent! called twice");return a};
k.Lb=function(a,b,c){return pg(this,b,c)};qg;rg;var sg=function sg(b,c,d){d=null!=b.left?sg(b.left,c,d):d;if(Uc(d))return K.b?K.b(d):K.call(null,d);var e=b.key,f=b.G;d=c.c?c.c(d,e,f):c.call(null,d,e,f);if(Uc(d))return K.b?K.b(d):K.call(null,d);b=null!=b.right?sg(b.right,c,d):d;return Uc(b)?K.b?K.b(b):K.call(null,b):b};function rg(a,b,c,d,e){this.key=a;this.G=b;this.left=c;this.right=d;this.u=e;this.g=32402207;this.C=0}k=rg.prototype;k.replace=function(a,b,c,d){return new rg(a,b,c,d,null)};
k.jb=function(a,b){return sg(this,a,b)};k.N=function(a,b){return eb.c(this,b,null)};k.I=function(a,b,c){return eb.c(this,b,c)};k.ba=function(a,b){return 0===b?this.key:1===b?this.G:null};k.Ea=function(a,b,c){return 0===b?this.key:1===b?this.G:c};k.eb=function(a,b,c){return(new R(null,2,5,S,[this.key,this.G],null)).eb(null,b,c)};k.P=function(){return null};k.Z=function(){return 2};k.Hb=function(){return this.key};k.Ib=function(){return this.G};k.cb=function(){return this.G};
k.S=function(){var a=this.u;return null!=a?a:this.u=a=Lc(this)};k.D=function(a,b){return Qc(this,b)};k.ca=function(){return jd};k.ea=function(a,b){return Vc(this,b)};k.fa=function(a,b,c){return Wc(this,b,c)};k.Ra=function(a,b,c){return Q.c(new R(null,2,5,S,[this.key,this.G],null),b,c)};k.U=function(){return cb(cb(Ec,this.G),this.key)};k.R=function(a,b){return Rc(new R(null,2,5,S,[this.key,this.G],null),b)};k.X=function(a,b){return new R(null,3,5,S,[this.key,this.G,b],null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};rg.prototype[Ua]=function(){return Gc(this)};
function qg(a,b,c,d,e){this.key=a;this.G=b;this.left=c;this.right=d;this.u=e;this.g=32402207;this.C=0}k=qg.prototype;k.replace=function(a,b,c,d){return new qg(a,b,c,d,null)};k.jb=function(a,b){return sg(this,a,b)};k.N=function(a,b){return eb.c(this,b,null)};k.I=function(a,b,c){return eb.c(this,b,c)};k.ba=function(a,b){return 0===b?this.key:1===b?this.G:null};k.Ea=function(a,b,c){return 0===b?this.key:1===b?this.G:c};k.eb=function(a,b,c){return(new R(null,2,5,S,[this.key,this.G],null)).eb(null,b,c)};
k.P=function(){return null};k.Z=function(){return 2};k.Hb=function(){return this.key};k.Ib=function(){return this.G};k.cb=function(){return this.G};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Lc(this)};k.D=function(a,b){return Qc(this,b)};k.ca=function(){return jd};k.ea=function(a,b){return Vc(this,b)};k.fa=function(a,b,c){return Wc(this,b,c)};k.Ra=function(a,b,c){return Q.c(new R(null,2,5,S,[this.key,this.G],null),b,c)};k.U=function(){return cb(cb(Ec,this.G),this.key)};
k.R=function(a,b){return Rc(new R(null,2,5,S,[this.key,this.G],null),b)};k.X=function(a,b){return new R(null,3,5,S,[this.key,this.G,b],null)};k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};
k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};qg.prototype[Ua]=function(){return Gc(this)};Yd;var Pc=function Pc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Pc.h(0<c.length?new Cc(c.slice(0),0):null)};Pc.h=function(a){a=H(a);for(var b=Ub(Uf);;)if(a){var c=J(J(a)),b=we(b,I(a),gd(a));a=c}else return Wb(b)};Pc.w=0;Pc.B=function(a){return Pc.h(H(a))};function tg(a,b){this.J=a;this.Da=b;this.g=32374988;this.C=0}k=tg.prototype;
k.toString=function(){return kc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.Da};k.wa=function(){var a=(null!=this.J?this.J.g&128||this.J.Wb||(this.J.g?0:Ra(kb,this.J)):Ra(kb,this.J))?this.J.wa(null):J(this.J);return null==a?null:new tg(a,this.Da)};k.S=function(){return Lc(this)};k.D=function(a,b){return Qc(this,b)};k.ca=function(){return Rc(Ec,this.Da)};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){return this.J.ta(null).Hb(null)};
k.xa=function(){var a=(null!=this.J?this.J.g&128||this.J.Wb||(this.J.g?0:Ra(kb,this.J)):Ra(kb,this.J))?this.J.wa(null):J(this.J);return null!=a?new tg(a,this.Da):Ec};k.U=function(){return this};k.R=function(a,b){return new tg(this.J,b)};k.X=function(a,b){return M(b,this)};tg.prototype[Ua]=function(){return Gc(this)};function Qf(a){return(a=H(a))?new tg(a,null):null}function Yd(a){return tb(a)}function ug(a,b){this.J=a;this.Da=b;this.g=32374988;this.C=0}k=ug.prototype;k.toString=function(){return kc(this)};
k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.Da};k.wa=function(){var a=(null!=this.J?this.J.g&128||this.J.Wb||(this.J.g?0:Ra(kb,this.J)):Ra(kb,this.J))?this.J.wa(null):J(this.J);return null==a?null:new ug(a,this.Da)};k.S=function(){return Lc(this)};k.D=function(a,b){return Qc(this,b)};k.ca=function(){return Rc(Ec,this.Da)};k.ea=function(a,b){return fd.a(b,this)};k.fa=function(a,b,c){return fd.c(b,c,this)};k.ta=function(){return this.J.ta(null).Ib(null)};
k.xa=function(){var a=(null!=this.J?this.J.g&128||this.J.Wb||(this.J.g?0:Ra(kb,this.J)):Ra(kb,this.J))?this.J.wa(null):J(this.J);return null!=a?new ug(a,this.Da):Ec};k.U=function(){return this};k.R=function(a,b){return new ug(this.J,b)};k.X=function(a,b){return M(b,this)};ug.prototype[Ua]=function(){return Gc(this)};function Rf(a){return(a=H(a))?new ug(a,null):null}function Zd(a){return ub(a)}
var vg=function vg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return vg.h(0<c.length?new Cc(c.slice(0),0):null)};vg.h=function(a){return x(Fe(Ld,a))?Xa.a(function(a,c){return id.a(x(a)?a:W,c)},a):null};vg.w=0;vg.B=function(a){return vg.h(H(a))};wg;function xg(a){this.yb=a}xg.prototype.ya=function(){return this.yb.ya()};xg.prototype.next=function(){if(this.yb.ya())return this.yb.next().O[0];throw Error("No such element");};xg.prototype.remove=function(){return Error("Unsupported operation")};
function yg(a,b,c){this.v=a;this.hb=b;this.u=c;this.g=15077647;this.C=8196}k=yg.prototype;k.toString=function(){return kc(this)};k.equiv=function(a){return this.D(null,a)};k.keys=function(){return Gc(H(this))};k.entries=function(){var a=H(this);return new Mf(H(a))};k.values=function(){return Gc(H(this))};k.has=function(a){return Fd(this,a)};
k.forEach=function(a){for(var b=H(this),c=null,d=0,e=0;;)if(e<d){var f=c.ba(null,e),g=P(f,0),f=P(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=H(b))yd(b)?(c=bc(b),b=cc(b),g=c,d=N(c),c=g):(c=I(b),g=P(c,0),f=P(c,1),a.a?a.a(f,g):a.call(null,f,g),b=J(b),c=null,d=0),e=0;else return null};k.N=function(a,b){return mb.c(this,b,null)};k.I=function(a,b,c){return ob(this.hb,b)?b:c};k.Ha=function(){return new xg(ic(this.hb))};k.P=function(){return this.v};k.Z=function(){return $a(this.hb)};
k.S=function(){var a=this.u;return null!=a?a:this.u=a=Nc(this)};k.D=function(a,b){return sd(b)&&N(this)===N(b)&&Ee(function(a){return function(b){return Fd(a,b)}}(this),b)};k.pb=function(){return new wg(Ub(this.hb))};k.ca=function(){return Rc(zg,this.v)};k.U=function(){return Qf(this.hb)};k.R=function(a,b){return new yg(b,this.hb,this.u)};k.X=function(a,b){return new yg(this.v,Q.c(this.hb,b,null),null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};var zg=new yg(null,W,Oc);yg.prototype[Ua]=function(){return Gc(this)};
function wg(a){this.Ya=a;this.C=136;this.g=259}k=wg.prototype;k.Mb=function(a,b){this.Ya=Xb(this.Ya,b,null);return this};k.Nb=function(){return new yg(null,Wb(this.Ya),null)};k.Z=function(){return N(this.Ya)};k.N=function(a,b){return mb.c(this,b,null)};k.I=function(a,b,c){return mb.c(this.Ya,b,Cd)===Cd?c:b};
k.call=function(){function a(a,b,c){return mb.c(this.Ya,b,Cd)===Cd?c:b}function b(a,b){return mb.c(this.Ya,b,Cd)===Cd?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};k.b=function(a){return mb.c(this.Ya,a,Cd)===Cd?null:a};k.a=function(a,b){return mb.c(this.Ya,a,Cd)===Cd?b:a};
function Ag(a,b){if(vd(b)){var c=N(b);return Xa.c(function(){return function(b,c){var f=Gd(a,ld(b,c));return x(f)?Q.c(b,c,gd(f)):b}}(c),b,Se(c,We(Sc,0)))}return T.a(function(b){var c=Gd(a,b);return x(c)?gd(c):b},b)}function Bg(a){for(var b=jd;;)if(J(a))b=id.a(b,I(a)),a=J(a);else return H(b)}function Xd(a){if(null!=a&&(a.C&4096||a.Rc))return a.Jb(null);if("string"===typeof a)return a;throw Error([A("Doesn't support name: "),A(a)].join(""));}
var Cg=function Cg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Cg.a(arguments[0],arguments[1]);case 3:return Cg.c(arguments[0],arguments[1],arguments[2]);default:return Cg.h(arguments[0],arguments[1],arguments[2],new Cc(c.slice(3),0))}};Cg.a=function(a,b){return b};Cg.c=function(a,b,c){return(a.b?a.b(b):a.call(null,b))<(a.b?a.b(c):a.call(null,c))?b:c};
Cg.h=function(a,b,c,d){return Xa.c(function(b,c){return Cg.c(a,b,c)},Cg.c(a,b,c),d)};Cg.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),d=J(d);return Cg.h(b,a,c,d)};Cg.w=3;function Dg(a,b){return new je(null,function(){var c=H(b);if(c){var d;d=I(c);d=a.b?a.b(d):a.call(null,d);c=x(d)?M(I(c),Dg(a,Dc(c))):null}else c=null;return c},null,null)}function Eg(a,b,c){this.s=a;this.end=b;this.step=c}Eg.prototype.ya=function(){return 0<this.step?this.s<this.end:this.s>this.end};
Eg.prototype.next=function(){var a=this.s;this.s+=this.step;return a};function Fg(a,b,c,d,e){this.v=a;this.start=b;this.end=c;this.step=d;this.u=e;this.g=32375006;this.C=8192}k=Fg.prototype;k.toString=function(){return kc(this)};k.equiv=function(a){return this.D(null,a)};k.ba=function(a,b){if(b<$a(this))return this.start+b*this.step;if(this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};
k.Ea=function(a,b,c){return b<$a(this)?this.start+b*this.step:this.start>this.end&&0===this.step?this.start:c};k.Ha=function(){return new Eg(this.start,this.end,this.step)};k.P=function(){return this.v};k.wa=function(){return 0<this.step?this.start+this.step<this.end?new Fg(this.v,this.start+this.step,this.end,this.step,null):null:this.start+this.step>this.end?new Fg(this.v,this.start+this.step,this.end,this.step,null):null};k.Z=function(){return Qa(Lb(this))?0:Math.ceil((this.end-this.start)/this.step)};
k.S=function(){var a=this.u;return null!=a?a:this.u=a=Lc(this)};k.D=function(a,b){return Qc(this,b)};k.ca=function(){return Rc(Ec,this.v)};k.ea=function(a,b){return Vc(this,b)};k.fa=function(a,b,c){for(a=this.start;;)if(0<this.step?a<this.end:a>this.end){c=b.a?b.a(c,a):b.call(null,c,a);if(Uc(c))return K.b?K.b(c):K.call(null,c);a+=this.step}else return c};k.ta=function(){return null==Lb(this)?null:this.start};
k.xa=function(){return null!=Lb(this)?new Fg(this.v,this.start+this.step,this.end,this.step,null):Ec};k.U=function(){return 0<this.step?this.start<this.end?this:null:0>this.step?this.start>this.end?this:null:this.start===this.end?null:this};k.R=function(a,b){return new Fg(b,this.start,this.end,this.step,this.u)};k.X=function(a,b){return M(b,this)};Fg.prototype[Ua]=function(){return Gc(this)};
function Gg(a,b){return new je(null,function(){var c=H(b);if(c){var d=I(c),e=a.b?a.b(d):a.call(null,d),d=M(d,Dg(function(b,c){return function(b){return sc.a(c,a.b?a.b(b):a.call(null,b))}}(d,e,c,c),J(c)));return M(d,Gg(a,H(Te(N(d),c))))}return null},null,null)}function Hg(a){return new je(null,function(){var b=H(a);return b?Ig(Nd,I(b),Dc(b)):cb(Ec,Nd.m?Nd.m():Nd.call(null))},null,null)}
function Ig(a,b,c){return M(b,new je(null,function(){var d=H(c);if(d){var e=Ig,f;f=I(d);f=a.a?a.a(b,f):a.call(null,b,f);d=e(a,f,Dc(d))}else d=null;return d},null,null))}
function Jg(a,b){return function(){function c(c,d,e){return new R(null,2,5,S,[a.c?a.c(c,d,e):a.call(null,c,d,e),b.c?b.c(c,d,e):b.call(null,c,d,e)],null)}function d(c,d){return new R(null,2,5,S,[a.a?a.a(c,d):a.call(null,c,d),b.a?b.a(c,d):b.call(null,c,d)],null)}function e(c){return new R(null,2,5,S,[a.b?a.b(c):a.call(null,c),b.b?b.b(c):b.call(null,c)],null)}function f(){return new R(null,2,5,S,[a.m?a.m():a.call(null),b.m?b.m():b.call(null)],null)}var g=null,h=function(){function c(a,b,e,f){var g=null;
if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;g=new Cc(h,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){return new R(null,2,5,S,[B.A(a,c,e,f,g),B.A(b,c,e,f,g)],null)}c.w=3;c.B=function(a){var b=I(a);a=J(a);var c=I(a);a=J(a);var e=I(a);a=Dc(a);return d(b,c,e,a)};c.h=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);
default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+3],++q;q=new Cc(r,0)}return h.h(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.B=h.B;g.m=f;g.b=e;g.a=d;g.c=c;g.h=h.h;return g}()}
function wf(a,b,c,d,e,f,g){var h=Ba;Ba=null==Ba?null:Ba-1;try{if(null!=Ba&&0>Ba)return Qb(a,"#");Qb(a,c);if(0===Ka.b(f))H(g)&&Qb(a,function(){var a=Kg.b(f);return x(a)?a:"..."}());else{if(H(g)){var l=I(g);b.c?b.c(l,a,f):b.call(null,l,a,f)}for(var m=J(g),n=Ka.b(f)-1;;)if(!m||null!=n&&0===n){H(m)&&0===n&&(Qb(a,d),Qb(a,function(){var a=Kg.b(f);return x(a)?a:"..."}()));break}else{Qb(a,d);var p=I(m);c=a;g=f;b.c?b.c(p,c,g):b.call(null,p,c,g);var q=J(m);c=n-1;m=q;n=c}}return Qb(a,e)}finally{Ba=h}}
function Lg(a,b){for(var c=H(b),d=null,e=0,f=0;;)if(f<e){var g=d.ba(null,f);Qb(a,g);f+=1}else if(c=H(c))d=c,yd(d)?(c=bc(d),e=cc(d),d=c,g=N(c),c=e,e=g):(g=I(d),Qb(a,g),c=J(d),d=null,e=0),f=0;else return null}var Mg={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function Ng(a){return[A('"'),A(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return Mg[a]})),A('"')].join("")}Og;
function Pg(a,b){var c=Ed(C.a(a,Ia));return c?(c=null!=b?b.g&131072||b.Qc?!0:!1:!1)?null!=qd(b):c:c}
function Qg(a,b,c){if(null==a)return Qb(b,"nil");if(Pg(c,a)){Qb(b,"^");var d=qd(a);xf.c?xf.c(d,b,c):xf.call(null,d,b,c);Qb(b," ")}if(a.sb)return a.Ob(a,b,c);if(null!=a&&(a.g&2147483648||a.$))return a.L(null,b,c);if(!0===a||!1===a||"number"===typeof a)return Qb(b,""+A(a));if(null!=a&&a.constructor===Object)return Qb(b,"#js "),d=T.a(function(b){return new R(null,2,5,S,[ie.b(b),a[b]],null)},zd(a)),Og.l?Og.l(d,xf,b,c):Og.call(null,d,xf,b,c);if(Pa(a))return wf(b,xf,"#js ["," ","]",c,a);if("string"==typeof a)return x(Ha.b(c))?
Qb(b,Ng(a)):Qb(b,a);if(ca(a)){var e=a.name;c=x(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return Lg(b,G(["#object[",c,' "',""+A(a),'"]'],0))}if(a instanceof Date)return c=function(a,b){for(var c=""+A(a);;)if(N(c)<b)c=[A("0"),A(c)].join("");else return c},Lg(b,G(['#inst "',""+A(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),3),"-",'00:00"'],
0));if(a instanceof RegExp)return Lg(b,G(['#"',a.source,'"'],0));if(null!=a&&(a.g&2147483648||a.$))return Rb(a,b,c);if(x(a.constructor.Za))return Lg(b,G(["#object[",a.constructor.Za.replace(RegExp("/","g"),"."),"]"],0));e=a.constructor.name;c=x(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return Lg(b,G(["#object[",c," ",""+A(a),"]"],0))}function xf(a,b,c){var d=Rg.b(c);return x(d)?(c=Q.c(c,Sg,Qg),d.c?d.c(a,b,c):d.call(null,a,b,c)):Qg(a,b,c)}
var Oe=function Oe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Oe.h(0<c.length?new Cc(c.slice(0),0):null)};Oe.h=function(a){var b=Fa();if(rd(a))b="";else{var c=A,d=new qa;a:{var e=new jc(d);xf(I(a),e,b);a=H(J(a));for(var f=null,g=0,h=0;;)if(h<g){var l=f.ba(null,h);Qb(e," ");xf(l,e,b);h+=1}else if(a=H(a))f=a,yd(f)?(a=bc(f),g=cc(f),f=a,l=N(a),a=g,g=l):(l=I(f),Qb(e," "),xf(l,e,b),a=J(f),f=null,g=0),h=0;else break a}b=""+c(d)}return b};Oe.w=0;Oe.B=function(a){return Oe.h(H(a))};
function Og(a,b,c,d){return wf(c,function(a,c,d){var h=tb(a);b.c?b.c(h,c,d):b.call(null,h,c,d);Qb(c," ");a=ub(a);return b.c?b.c(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,H(a))}Re.prototype.$=!0;Re.prototype.L=function(a,b,c){Qb(b,"#object [cljs.core.Volatile ");xf(new v(null,1,[Tg,this.state],null),b,c);return Qb(b,"]")};Cc.prototype.$=!0;Cc.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};je.prototype.$=!0;je.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};
mg.prototype.$=!0;mg.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};rg.prototype.$=!0;rg.prototype.L=function(a,b,c){return wf(b,xf,"["," ","]",c,this)};Pf.prototype.$=!0;Pf.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};Jc.prototype.$=!0;Jc.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};xd.prototype.$=!0;xd.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};fe.prototype.$=!0;
fe.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};ad.prototype.$=!0;ad.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};md.prototype.$=!0;md.prototype.L=function(a,b,c){return Og(this,xf,b,c)};ng.prototype.$=!0;ng.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};Df.prototype.$=!0;Df.prototype.L=function(a,b,c){return wf(b,xf,"["," ","]",c,this)};yg.prototype.$=!0;yg.prototype.L=function(a,b,c){return wf(b,xf,"#{"," ","}",c,this)};wd.prototype.$=!0;
wd.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};Me.prototype.$=!0;Me.prototype.L=function(a,b,c){Qb(b,"#object [cljs.core.Atom ");xf(new v(null,1,[Tg,this.state],null),b,c);return Qb(b,"]")};ug.prototype.$=!0;ug.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};qg.prototype.$=!0;qg.prototype.L=function(a,b,c){return wf(b,xf,"["," ","]",c,this)};R.prototype.$=!0;R.prototype.L=function(a,b,c){return wf(b,xf,"["," ","]",c,this)};de.prototype.$=!0;
de.prototype.L=function(a,b){return Qb(b,"()")};De.prototype.$=!0;De.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};v.prototype.$=!0;v.prototype.L=function(a,b,c){return Og(this,xf,b,c)};Fg.prototype.$=!0;Fg.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};tg.prototype.$=!0;tg.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};bd.prototype.$=!0;bd.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};rc.prototype.Db=!0;
rc.prototype.ob=function(a,b){if(b instanceof rc)return zc(this,b);throw Error([A("Cannot compare "),A(this),A(" to "),A(b)].join(""));};y.prototype.Db=!0;y.prototype.ob=function(a,b){if(b instanceof y)return ge(this,b);throw Error([A("Cannot compare "),A(this),A(" to "),A(b)].join(""));};Df.prototype.Db=!0;Df.prototype.ob=function(a,b){if(vd(b))return Hd(this,b);throw Error([A("Cannot compare "),A(this),A(" to "),A(b)].join(""));};R.prototype.Db=!0;
R.prototype.ob=function(a,b){if(vd(b))return Hd(this,b);throw Error([A("Cannot compare "),A(this),A(" to "),A(b)].join(""));};var Ug=null;function Vg(a){null==Ug&&(Ug=X.b?X.b(0):X.call(null,0));return Ac.b([A(a),A(Qe.a(Ug,Sc))].join(""))}function Wg(a){return function(b,c){var d=a.a?a.a(b,c):a.call(null,b,c);return Uc(d)?new Tc(d):d}}
function Ze(a){return function(b){return function(){function c(a,c){return Xa.c(b,a,c)}function d(b){return a.b?a.b(b):a.call(null,b)}function e(){return a.m?a.m():a.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.m=e;f.b=d;f.a=c;return f}()}(Wg(a))}Xg;function Yg(){}
var Zg=function Zg(b){if(null!=b&&null!=b.Nc)return b.Nc(b);var c=Zg[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Zg._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("IEncodeJS.-clj-\x3ejs",b);};$g;function ah(a){return(null!=a?a.Mc||(a.Zb?0:Ra(Yg,a)):Ra(Yg,a))?Zg(a):"string"===typeof a||"number"===typeof a||a instanceof y||a instanceof rc?$g.b?$g.b(a):$g.call(null,a):Oe.h(G([a],0))}
var $g=function $g(b){if(null==b)return null;if(null!=b?b.Mc||(b.Zb?0:Ra(Yg,b)):Ra(Yg,b))return Zg(b);if(b instanceof y)return Xd(b);if(b instanceof rc)return""+A(b);if(ud(b)){var c={};b=H(b);for(var d=null,e=0,f=0;;)if(f<e){var g=d.ba(null,f),h=P(g,0),g=P(g,1);c[ah(h)]=$g(g);f+=1}else if(b=H(b))yd(b)?(e=bc(b),b=cc(b),d=e,e=N(e)):(e=I(b),d=P(e,0),e=P(e,1),c[ah(d)]=$g(e),b=J(b),d=null,e=0),f=0;else break;return c}if(null==b?0:null!=b?b.g&8||b.rd||(b.g?0:Ra(bb,b)):Ra(bb,b)){c=[];b=H(T.a($g,b));d=null;
for(f=e=0;;)if(f<e)h=d.ba(null,f),c.push(h),f+=1;else if(b=H(b))d=b,yd(d)?(b=bc(d),f=cc(d),d=b,e=N(b),b=f):(b=I(d),c.push(b),b=J(d),d=null,e=0),f=0;else break;return c}return b},Xg=function Xg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Xg.m();case 1:return Xg.b(arguments[0]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};Xg.m=function(){return Xg.b(1)};Xg.b=function(a){return Math.random()*a};Xg.w=1;
function bh(a,b){return ue(Xa.c(function(b,d){var e=a.b?a.b(d):a.call(null,d);return we(b,e,id.a(C.c(b,e,jd),d))},Ub(W),b))}var ch=null;function dh(){if(null==ch){var a=new v(null,3,[eh,W,fh,W,gh,W],null);ch=X.b?X.b(a):X.call(null,a)}return ch}function hh(a,b,c){var d=sc.a(b,c);if(!d&&!(d=Fd(gh.b(a).call(null,b),c))&&(d=vd(c))&&(d=vd(b)))if(d=N(c)===N(b))for(var d=!0,e=0;;)if(d&&e!==N(c))d=hh(a,b.b?b.b(e):b.call(null,e),c.b?c.b(e):c.call(null,e)),e+=1;else return d;else return d;else return d}
function ih(a){var b;b=dh();b=K.b?K.b(b):K.call(null,b);return ye(C.a(eh.b(b),a))}function jh(a,b,c,d){Qe.a(a,function(){return K.b?K.b(b):K.call(null,b)});Qe.a(c,function(){return K.b?K.b(d):K.call(null,d)})}
var kh=function kh(b,c,d){var e=(K.b?K.b(d):K.call(null,d)).call(null,b),e=x(x(e)?e.b?e.b(c):e.call(null,c):e)?!0:null;if(x(e))return e;e=function(){for(var e=ih(c);;)if(0<N(e))kh(b,I(e),d),e=Dc(e);else return null}();if(x(e))return e;e=function(){for(var e=ih(b);;)if(0<N(e))kh(I(e),c,d),e=Dc(e);else return null}();return x(e)?e:!1};function lh(a,b,c){c=kh(a,b,c);if(x(c))a=c;else{c=hh;var d;d=dh();d=K.b?K.b(d):K.call(null,d);a=c(d,a,b)}return a}
var mh=function mh(b,c,d,e,f,g,h){var l=Xa.c(function(e,g){var h=P(g,0);P(g,1);if(hh(K.b?K.b(d):K.call(null,d),c,h)){var l;l=(l=null==e)?l:lh(h,I(e),f);l=x(l)?g:e;if(!x(lh(I(l),h,f)))throw Error([A("Multiple methods in multimethod '"),A(b),A("' match dispatch value: "),A(c),A(" -\x3e "),A(h),A(" and "),A(I(l)),A(", and neither is preferred")].join(""));return l}return e},null,K.b?K.b(e):K.call(null,e));if(x(l)){if(sc.a(K.b?K.b(h):K.call(null,h),K.b?K.b(d):K.call(null,d)))return Qe.l(g,Q,c,gd(l)),
gd(l);jh(g,e,h,d);return mh(b,c,d,e,f,g,h)}return null};function nh(a,b){throw Error([A("No method in multimethod '"),A(a),A("' for dispatch value: "),A(b)].join(""));}function oh(a,b,c,d,e,f,g,h){this.name=a;this.j=b;this.Zc=c;this.Qb=d;this.zb=e;this.jd=f;this.Tb=g;this.Cb=h;this.g=4194305;this.C=4352}k=oh.prototype;
k.call=function(){function a(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t,D,F,E,L,O){a=this;var za=B.h(a.j,b,c,d,e,G([f,g,h,l,m,n,p,q,r,w,z,t,D,F,E,L,O],0)),Dk=ph(this,za);x(Dk)||nh(a.name,za);return B.h(Dk,b,c,d,e,G([f,g,h,l,m,n,p,q,r,w,z,t,D,F,E,L,O],0))}function b(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t,D,F,E,L){a=this;var O=a.j.qa?a.j.qa(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t,D,F,E,L):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t,D,F,E,L),za=ph(this,O);x(za)||nh(a.name,O);return za.qa?za.qa(b,c,d,e,f,g,h,l,m,n,p,q,r,
w,z,t,D,F,E,L):za.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t,D,F,E,L)}function c(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t,D,F,E){a=this;var L=a.j.pa?a.j.pa(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t,D,F,E):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t,D,F,E),O=ph(this,L);x(O)||nh(a.name,L);return O.pa?O.pa(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t,D,F,E):O.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t,D,F,E)}function d(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t,D,F){a=this;var E=a.j.oa?a.j.oa(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t,D,F):a.j.call(null,
b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t,D,F),L=ph(this,E);x(L)||nh(a.name,E);return L.oa?L.oa(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t,D,F):L.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t,D,F)}function e(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t,D){a=this;var F=a.j.na?a.j.na(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t,D):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t,D),E=ph(this,F);x(E)||nh(a.name,F);return E.na?E.na(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t,D):E.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t,D)}function f(a,b,c,d,e,f,g,h,l,m,n,p,q,r,
w,z,t){a=this;var D=a.j.ma?a.j.ma(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t),F=ph(this,D);x(F)||nh(a.name,D);return F.ma?F.ma(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t):F.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t)}function g(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z){a=this;var t=a.j.la?a.j.la(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z),D=ph(this,t);x(D)||nh(a.name,t);return D.la?D.la(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z):D.call(null,b,c,d,e,f,g,h,l,m,n,p,
q,r,w,z)}function h(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w){a=this;var z=a.j.ka?a.j.ka(b,c,d,e,f,g,h,l,m,n,p,q,r,w):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w),t=ph(this,z);x(t)||nh(a.name,z);return t.ka?t.ka(b,c,d,e,f,g,h,l,m,n,p,q,r,w):t.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w)}function l(a,b,c,d,e,f,g,h,l,m,n,p,q,r){a=this;var w=a.j.ja?a.j.ja(b,c,d,e,f,g,h,l,m,n,p,q,r):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r),z=ph(this,w);x(z)||nh(a.name,w);return z.ja?z.ja(b,c,d,e,f,g,h,l,m,n,p,q,r):z.call(null,b,c,d,e,f,
g,h,l,m,n,p,q,r)}function m(a,b,c,d,e,f,g,h,l,m,n,p,q){a=this;var r=a.j.ia?a.j.ia(b,c,d,e,f,g,h,l,m,n,p,q):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q),w=ph(this,r);x(w)||nh(a.name,r);return w.ia?w.ia(b,c,d,e,f,g,h,l,m,n,p,q):w.call(null,b,c,d,e,f,g,h,l,m,n,p,q)}function n(a,b,c,d,e,f,g,h,l,m,n,p){a=this;var q=a.j.ha?a.j.ha(b,c,d,e,f,g,h,l,m,n,p):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p),r=ph(this,q);x(r)||nh(a.name,q);return r.ha?r.ha(b,c,d,e,f,g,h,l,m,n,p):r.call(null,b,c,d,e,f,g,h,l,m,n,p)}function p(a,b,
c,d,e,f,g,h,l,m,n){a=this;var p=a.j.ga?a.j.ga(b,c,d,e,f,g,h,l,m,n):a.j.call(null,b,c,d,e,f,g,h,l,m,n),q=ph(this,p);x(q)||nh(a.name,p);return q.ga?q.ga(b,c,d,e,f,g,h,l,m,n):q.call(null,b,c,d,e,f,g,h,l,m,n)}function q(a,b,c,d,e,f,g,h,l,m){a=this;var n=a.j.sa?a.j.sa(b,c,d,e,f,g,h,l,m):a.j.call(null,b,c,d,e,f,g,h,l,m),p=ph(this,n);x(p)||nh(a.name,n);return p.sa?p.sa(b,c,d,e,f,g,h,l,m):p.call(null,b,c,d,e,f,g,h,l,m)}function r(a,b,c,d,e,f,g,h,l){a=this;var m=a.j.ra?a.j.ra(b,c,d,e,f,g,h,l):a.j.call(null,
b,c,d,e,f,g,h,l),n=ph(this,m);x(n)||nh(a.name,m);return n.ra?n.ra(b,c,d,e,f,g,h,l):n.call(null,b,c,d,e,f,g,h,l)}function t(a,b,c,d,e,f,g,h){a=this;var l=a.j.aa?a.j.aa(b,c,d,e,f,g,h):a.j.call(null,b,c,d,e,f,g,h),m=ph(this,l);x(m)||nh(a.name,l);return m.aa?m.aa(b,c,d,e,f,g,h):m.call(null,b,c,d,e,f,g,h)}function w(a,b,c,d,e,f,g){a=this;var h=a.j.T?a.j.T(b,c,d,e,f,g):a.j.call(null,b,c,d,e,f,g),l=ph(this,h);x(l)||nh(a.name,h);return l.T?l.T(b,c,d,e,f,g):l.call(null,b,c,d,e,f,g)}function z(a,b,c,d,e,f){a=
this;var g=a.j.A?a.j.A(b,c,d,e,f):a.j.call(null,b,c,d,e,f),h=ph(this,g);x(h)||nh(a.name,g);return h.A?h.A(b,c,d,e,f):h.call(null,b,c,d,e,f)}function D(a,b,c,d,e){a=this;var f=a.j.l?a.j.l(b,c,d,e):a.j.call(null,b,c,d,e),g=ph(this,f);x(g)||nh(a.name,f);return g.l?g.l(b,c,d,e):g.call(null,b,c,d,e)}function F(a,b,c,d){a=this;var e=a.j.c?a.j.c(b,c,d):a.j.call(null,b,c,d),f=ph(this,e);x(f)||nh(a.name,e);return f.c?f.c(b,c,d):f.call(null,b,c,d)}function L(a,b,c){a=this;var d=a.j.a?a.j.a(b,c):a.j.call(null,
b,c),e=ph(this,d);x(e)||nh(a.name,d);return e.a?e.a(b,c):e.call(null,b,c)}function O(a,b){a=this;var c=a.j.b?a.j.b(b):a.j.call(null,b),d=ph(this,c);x(d)||nh(a.name,c);return d.b?d.b(b):d.call(null,b)}function za(a){a=this;var b=a.j.m?a.j.m():a.j.call(null),c=ph(this,b);x(c)||nh(a.name,b);return c.m?c.m():c.call(null)}var E=null,E=function(ka,E,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa,Ib,Va,hb,ib,Bb,Hc,Ad,lf){switch(arguments.length){case 1:return za.call(this,ka);case 2:return O.call(this,ka,E);case 3:return L.call(this,
ka,E,U);case 4:return F.call(this,ka,E,U,V);case 5:return D.call(this,ka,E,U,V,ha);case 6:return z.call(this,ka,E,U,V,ha,ia);case 7:return w.call(this,ka,E,U,V,ha,ia,ja);case 8:return t.call(this,ka,E,U,V,ha,ia,ja,la);case 9:return r.call(this,ka,E,U,V,ha,ia,ja,la,oa);case 10:return q.call(this,ka,E,U,V,ha,ia,ja,la,oa,ta);case 11:return p.call(this,ka,E,U,V,ha,ia,ja,la,oa,ta,ya);case 12:return n.call(this,ka,E,U,V,ha,ia,ja,la,oa,ta,ya,Ca);case 13:return m.call(this,ka,E,U,V,ha,ia,ja,la,oa,ta,ya,Ca,
Da);case 14:return l.call(this,ka,E,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa);case 15:return h.call(this,ka,E,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa,Ib);case 16:return g.call(this,ka,E,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa,Ib,Va);case 17:return f.call(this,ka,E,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa,Ib,Va,hb);case 18:return e.call(this,ka,E,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa,Ib,Va,hb,ib);case 19:return d.call(this,ka,E,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa,Ib,Va,hb,ib,Bb);case 20:return c.call(this,ka,E,U,V,ha,ia,ja,la,oa,
ta,ya,Ca,Da,Oa,Ib,Va,hb,ib,Bb,Hc);case 21:return b.call(this,ka,E,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa,Ib,Va,hb,ib,Bb,Hc,Ad);case 22:return a.call(this,ka,E,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa,Ib,Va,hb,ib,Bb,Hc,Ad,lf)}throw Error("Invalid arity: "+arguments.length);};E.b=za;E.a=O;E.c=L;E.l=F;E.A=D;E.T=z;E.aa=w;E.ra=t;E.sa=r;E.ga=q;E.ha=p;E.ia=n;E.ja=m;E.ka=l;E.la=h;E.ma=g;E.na=f;E.oa=e;E.pa=d;E.qa=c;E.Fb=b;E.qb=a;return E}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};
k.m=function(){var a=this.j.m?this.j.m():this.j.call(null),b=ph(this,a);x(b)||nh(this.name,a);return b.m?b.m():b.call(null)};k.b=function(a){var b=this.j.b?this.j.b(a):this.j.call(null,a),c=ph(this,b);x(c)||nh(this.name,b);return c.b?c.b(a):c.call(null,a)};k.a=function(a,b){var c=this.j.a?this.j.a(a,b):this.j.call(null,a,b),d=ph(this,c);x(d)||nh(this.name,c);return d.a?d.a(a,b):d.call(null,a,b)};
k.c=function(a,b,c){var d=this.j.c?this.j.c(a,b,c):this.j.call(null,a,b,c),e=ph(this,d);x(e)||nh(this.name,d);return e.c?e.c(a,b,c):e.call(null,a,b,c)};k.l=function(a,b,c,d){var e=this.j.l?this.j.l(a,b,c,d):this.j.call(null,a,b,c,d),f=ph(this,e);x(f)||nh(this.name,e);return f.l?f.l(a,b,c,d):f.call(null,a,b,c,d)};k.A=function(a,b,c,d,e){var f=this.j.A?this.j.A(a,b,c,d,e):this.j.call(null,a,b,c,d,e),g=ph(this,f);x(g)||nh(this.name,f);return g.A?g.A(a,b,c,d,e):g.call(null,a,b,c,d,e)};
k.T=function(a,b,c,d,e,f){var g=this.j.T?this.j.T(a,b,c,d,e,f):this.j.call(null,a,b,c,d,e,f),h=ph(this,g);x(h)||nh(this.name,g);return h.T?h.T(a,b,c,d,e,f):h.call(null,a,b,c,d,e,f)};k.aa=function(a,b,c,d,e,f,g){var h=this.j.aa?this.j.aa(a,b,c,d,e,f,g):this.j.call(null,a,b,c,d,e,f,g),l=ph(this,h);x(l)||nh(this.name,h);return l.aa?l.aa(a,b,c,d,e,f,g):l.call(null,a,b,c,d,e,f,g)};
k.ra=function(a,b,c,d,e,f,g,h){var l=this.j.ra?this.j.ra(a,b,c,d,e,f,g,h):this.j.call(null,a,b,c,d,e,f,g,h),m=ph(this,l);x(m)||nh(this.name,l);return m.ra?m.ra(a,b,c,d,e,f,g,h):m.call(null,a,b,c,d,e,f,g,h)};k.sa=function(a,b,c,d,e,f,g,h,l){var m=this.j.sa?this.j.sa(a,b,c,d,e,f,g,h,l):this.j.call(null,a,b,c,d,e,f,g,h,l),n=ph(this,m);x(n)||nh(this.name,m);return n.sa?n.sa(a,b,c,d,e,f,g,h,l):n.call(null,a,b,c,d,e,f,g,h,l)};
k.ga=function(a,b,c,d,e,f,g,h,l,m){var n=this.j.ga?this.j.ga(a,b,c,d,e,f,g,h,l,m):this.j.call(null,a,b,c,d,e,f,g,h,l,m),p=ph(this,n);x(p)||nh(this.name,n);return p.ga?p.ga(a,b,c,d,e,f,g,h,l,m):p.call(null,a,b,c,d,e,f,g,h,l,m)};k.ha=function(a,b,c,d,e,f,g,h,l,m,n){var p=this.j.ha?this.j.ha(a,b,c,d,e,f,g,h,l,m,n):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n),q=ph(this,p);x(q)||nh(this.name,p);return q.ha?q.ha(a,b,c,d,e,f,g,h,l,m,n):q.call(null,a,b,c,d,e,f,g,h,l,m,n)};
k.ia=function(a,b,c,d,e,f,g,h,l,m,n,p){var q=this.j.ia?this.j.ia(a,b,c,d,e,f,g,h,l,m,n,p):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p),r=ph(this,q);x(r)||nh(this.name,q);return r.ia?r.ia(a,b,c,d,e,f,g,h,l,m,n,p):r.call(null,a,b,c,d,e,f,g,h,l,m,n,p)};k.ja=function(a,b,c,d,e,f,g,h,l,m,n,p,q){var r=this.j.ja?this.j.ja(a,b,c,d,e,f,g,h,l,m,n,p,q):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q),t=ph(this,r);x(t)||nh(this.name,r);return t.ja?t.ja(a,b,c,d,e,f,g,h,l,m,n,p,q):t.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q)};
k.ka=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){var t=this.j.ka?this.j.ka(a,b,c,d,e,f,g,h,l,m,n,p,q,r):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r),w=ph(this,t);x(w)||nh(this.name,t);return w.ka?w.ka(a,b,c,d,e,f,g,h,l,m,n,p,q,r):w.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r)};
k.la=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t){var w=this.j.la?this.j.la(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t),z=ph(this,w);x(z)||nh(this.name,w);return z.la?z.la(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t):z.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t)};
k.ma=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w){var z=this.j.ma?this.j.ma(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w),D=ph(this,z);x(D)||nh(this.name,z);return D.ma?D.ma(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w):D.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w)};
k.na=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z){var D=this.j.na?this.j.na(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z),F=ph(this,D);x(F)||nh(this.name,D);return F.na?F.na(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z):F.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z)};
k.oa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D){var F=this.j.oa?this.j.oa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D),L=ph(this,F);x(L)||nh(this.name,F);return L.oa?L.oa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D):L.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D)};
k.pa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F){var L=this.j.pa?this.j.pa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F),O=ph(this,L);x(O)||nh(this.name,L);return O.pa?O.pa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F):O.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F)};
k.qa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F,L){var O=this.j.qa?this.j.qa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F,L):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F,L),za=ph(this,O);x(za)||nh(this.name,O);return za.qa?za.qa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F,L):za.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F,L)};
k.Fb=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F,L,O){var za=B.h(this.j,a,b,c,d,G([e,f,g,h,l,m,n,p,q,r,t,w,z,D,F,L,O],0)),E=ph(this,za);x(E)||nh(this.name,za);return B.h(E,a,b,c,d,G([e,f,g,h,l,m,n,p,q,r,t,w,z,D,F,L,O],0))};function qh(a,b,c){Qe.l(a.zb,Q,b,c);jh(a.Tb,a.zb,a.Cb,a.Qb)}
function ph(a,b){sc.a(K.b?K.b(a.Cb):K.call(null,a.Cb),K.b?K.b(a.Qb):K.call(null,a.Qb))||jh(a.Tb,a.zb,a.Cb,a.Qb);var c=(K.b?K.b(a.Tb):K.call(null,a.Tb)).call(null,b);if(x(c))return c;c=mh(a.name,b,a.Qb,a.zb,a.jd,a.Tb,a.Cb);return x(c)?c:(K.b?K.b(a.zb):K.call(null,a.zb)).call(null,a.Zc)}k.Jb=function(){return ec(this.name)};k.Kb=function(){return fc(this.name)};k.S=function(){return this[da]||(this[da]=++ea)};var rh=new y(null,"y","y",-1757859776),sh=new y(null,"text-anchor","text-anchor",585613696),th=new y(null,"path","path",-188191168),uh=new y(null,"penny-spacing","penny-spacing",-20780703),vh=new y(null,"supplier","supplier",18255489),wh=new y(null,"determine-capacity","determine-capacity",-452765887),xh=new y(null,"by-station","by-station",516084641),yh=new y(null,"selector","selector",762528866),zh=new y(null,"r","r",-471384190),Ah=new y(null,"run","run",-1821166653),Bh=new y(null,"richpath","richpath",
-150197948),Ch=new y(null,"turns","turns",-1118736892),Dh=new y(null,"transform","transform",1381301764),Eh=new y(null,"die","die",-547192252),Ia=new y(null,"meta","meta",1499536964),Fh=new y(null,"transformer","transformer",-1493470620),Gh=new y(null,"dx","dx",-381796732),Hh=new y(null,"color","color",1011675173),Ih=new y(null,"executors","executors",-331073403),Ja=new y(null,"dup","dup",556298533),Jh=new y(null,"intaking","intaking",-1009888859),Kh=new y(null,"running?","running?",-257884763),Lh=
new y(null,"processing","processing",-1576405467),Mh=new y(null,"key","key",-1516042587),Nh=new y(null,"stats-history","stats-history",636123973),Oh=new y(null,"spout-y","spout-y",1676697606),Ph=new y(null,"stations","stations",-19744730),Qh=new y(null,"capacity","capacity",72689734),Rh=new y(null,"disabled","disabled",-1529784218),Sh=new y(null,"private","private",-558947994),Th=new y(null,"efficient","efficient",-63016538),Uh=new y(null,"graphs?","graphs?",-270895578),Vh=new y(null,"transform*",
"transform*",-1613794522),Wh=new y(null,"button","button",1456579943),Xh=new y(null,"top","top",-1856271961),Ne=new y(null,"validator","validator",-1966190681),Yh=new y(null,"total-utilization","total-utilization",-1341502521),Zh=new y(null,"use","use",-1846382424),$h=new y(null,"default","default",-1987822328),ai=new y(null,"finally-block","finally-block",832982472),bi=new y(null,"name","name",1843675177),ci=new y(null,"scenarios","scenarios",1618559369),di=new y(null,"formatter","formatter",-483008823),
ei=new y(null,"value","value",305978217),fi=new y(null,"green","green",-945526839),gi=new y(null,"section","section",-300141526),hi=new y(null,"circle","circle",1903212362),ii=new y(null,"drop","drop",364481611),ji=new y(null,"tracer","tracer",-1844475765),ki=new y(null,"width","width",-384071477),li=new y(null,"supply","supply",-1701696309),mi=new y(null,"spath","spath",-1857758005),ni=new y(null,"source-spout-y","source-spout-y",1447094571),oi=new y(null,"onclick","onclick",1297553739),pi=new y(null,
"dy","dy",1719547243),qi=new y(null,"penny","penny",1653999051),ri=new y(null,"params","params",710516235),si=new y(null,"total-output","total-output",1149740747),ti=new y(null,"easing","easing",735372043),Tg=new y(null,"val","val",128701612),ui=new y(null,"delivery","delivery",-1844470516),vi=new y(null,"recur","recur",-437573268),wi=new y(null,"type","type",1174270348),xi=new y(null,"catch-block","catch-block",1175212748),yi=new y(null,"duration","duration",1444101068),zi=new y(null,"execute","execute",
-129499188),Ai=new y(null,"delivered","delivered",474109932),Bi=new y(null,"constrained","constrained",597287981),Ci=new y(null,"intaking?","intaking?",834765),Sg=new y(null,"fallback-impl","fallback-impl",-1501286995),Di=new y(null,"output","output",-1105869043),Ei=new y(null,"original-setup","original-setup",2029721421),Ga=new y(null,"flush-on-newline","flush-on-newline",-151457939),Fi=new y(null,"normal","normal",-1519123858),Gi=new y(null,"wip","wip",-103467282),Hi=new y(null,"averages","averages",
-1747836978),Ii=new y(null,"className","className",-1983287057),fh=new y(null,"descendants","descendants",1824886031),Ji=new y(null,"size","size",1098693007),Ki=new y(null,"accessor","accessor",-25476721),Li=new y(null,"title","title",636505583),Mi=new y(null,"running","running",1554969103),Ni=new rc(null,"folder","folder",-1138554033,null),Oi=new y(null,"num-needed-params","num-needed-params",-1219326097),Pi=new y(null,"dropping","dropping",125809647),Qi=new y(null,"high","high",2027297808),Ri=new y(null,
"setup","setup",1987730512),gh=new y(null,"ancestors","ancestors",-776045424),Si=new y(null,"style","style",-496642736),Ti=new y(null,"div","div",1057191632),Ha=new y(null,"readably","readably",1129599760),Ui=new y(null,"params-idx","params-idx",340984624),Vi=new rc(null,"box","box",-1123515375,null),Kg=new y(null,"more-marker","more-marker",-14717935),Wi=new y(null,"percent-utilization","percent-utilization",-2006109103),Xi=new y(null,"g","g",1738089905),Yi=new y(null,"update-stats","update-stats",
1938193073),Zi=new y(null,"info?","info?",361925553),$i=new y(null,"transfer-to-next-station","transfer-to-next-station",-114193262),aj=new y(null,"set-spacing","set-spacing",1920968978),bj=new y(null,"intake","intake",-108984782),cj=new rc(null,"coll","coll",-1006698606,null),dj=new y(null,"line","line",212345235),ej=new rc(null,"val","val",1769233139,null),fj=new rc(null,"xf","xf",2042434515,null),Ka=new y(null,"print-length","print-length",1931866356),gj=new y(null,"select*","select*",-1829914060),
hj=new y(null,"cx","cx",1272694324),ij=new y(null,"id","id",-1388402092),jj=new y(null,"class","class",-2030961996),kj=new y(null,"red","red",-969428204),lj=new y(null,"blue","blue",-622100620),mj=new y(null,"cy","cy",755331060),nj=new y(null,"catch-exception","catch-exception",-1997306795),oj=new y(null,"total-input","total-input",1219129557),eh=new y(null,"parents","parents",-2027538891),pj=new y(null,"collect-val","collect-val",801894069),qj=new y(null,"xlink:href","xlink:href",828777205),rj=new y(null,
"toggle-scenario","toggle-scenario",-1166476555),sj=new y(null,"prev","prev",-1597069226),tj=new y(null,"svg","svg",856789142),uj=new y(null,"info","info",-317069002),vj=new y(null,"bin-h","bin-h",346004918),wj=new y(null,"length","length",588987862),xj=new y(null,"continue-block","continue-block",-1852047850),yj=new y(null,"hookTransition","hookTransition",-1045887913),zj=new y(null,"tracer-reset","tracer-reset",283192087),Aj=new y(null,"distribution","distribution",-284555369),Bj=new y(null,"transfer-to-processed",
"transfer-to-processed",198231991),Cj=new y(null,"roll","roll",11266999),Dj=new y(null,"position","position",-2011731912),Ej=new y(null,"graphs","graphs",-1584479112),Fj=new y(null,"basic","basic",1043717368),Gj=new y(null,"image","image",-58725096),Hj=new y(null,"d","d",1972142424),Ij=new y(null,"average","average",-492356168),Jj=new y(null,"dropping?","dropping?",-1065207176),Kj=new y(null,"processed","processed",800622264),Lj=new y(null,"x","x",2099068185),Mj=new y(null,"run-next","run-next",1110241561),
Nj=new y(null,"x1","x1",-1863922247),Oj=new y(null,"tracer-start","tracer-start",1036491225),Pj=new y(null,"rerender","rerender",-1601192263),Qj=new y(null,"domain","domain",1847214937),Rj=new y(null,"transform-fns","transform-fns",669042649),Ce=new rc(null,"quote","quote",1377916282,null),Sj=new y(null,"purple","purple",-876021126),Tj=new y(null,"fixed","fixed",-562004358),Be=new y(null,"arglists","arglists",1661989754),Uj=new y(null,"dice","dice",707777434),Vj=new y(null,"y2","y2",-718691301),Wj=
new y(null,"set-lengths","set-lengths",742672507),Ae=new rc(null,"nil-iter","nil-iter",1101030523,null),Xj=new y(null,"main","main",-2117802661),Yj=new y(null,"hierarchy","hierarchy",-1053470341),Rg=new y(null,"alt-impl","alt-impl",670969595),Zj=new y(null,"under-utilized","under-utilized",-524567781),ak=new rc(null,"fn-handler","fn-handler",648785851,null),bk=new y(null,"doc","doc",1913296891),ck=new y(null,"integrate","integrate",-1653689604),dk=new y(null,"rect","rect",-108902628),ek=new y(null,
"step","step",1288888124),fk=new y(null,"delay","delay",-574225219),gk=new y(null,"stats","stats",-85643011),hk=new y(null,"x2","x2",-1362513475),ik=new y(null,"pennies","pennies",1847043709),jk=new y(null,"incoming","incoming",-1710131427),kk=new y(null,"productivity","productivity",-890721314),lk=new y(null,"range","range",1639692286),mk=new y(null,"height","height",1025178622),nk=new y(null,"spacing","spacing",204422175),ok=new y(null,"left","left",-399115937),pk=new y(null,"foreignObject","foreignObject",
25502111),qk=new y(null,"text","text",-1790561697),rk=new y(null,"span","span",1394872991),sk=new y(null,"data","data",-232669377),tk=new rc(null,"f","f",43394975,null);function uk(a){return document.querySelector([A("#"),A(a),A(" .penny-path")].join(""))}function vk(a){return document.querySelector([A("#"),A(a),A(" .ramp")].join(""))};var wk;a:{var xk=aa.navigator;if(xk){var yk=xk.userAgent;if(yk){wk=yk;break a}}wk=""};var zk;function Ak(a){return a.m?a.m():a.call(null)}function Bk(a,b,c){return ud(c)?Gb(c,a,b):null==c?b:Pa(c)?Yc(c,a,b):Fb.c(c,a,b)}
var Ck=function Ck(b,c,d,e){if(null!=b&&null!=b.kc)return b.kc(b,c,d,e);var f=Ck[u(null==b?null:b)];if(null!=f)return f.l?f.l(b,c,d,e):f.call(null,b,c,d,e);f=Ck._;if(null!=f)return f.l?f.l(b,c,d,e):f.call(null,b,c,d,e);throw Sa("CollFold.coll-fold",b);},Ek=function Ek(b,c){"undefined"===typeof zk&&(zk=function(b,c,f,g){this.ad=b;this.$b=c;this.Wa=f;this.cd=g;this.g=917504;this.C=0},zk.prototype.R=function(b,c){return new zk(this.ad,this.$b,this.Wa,c)},zk.prototype.P=function(){return this.cd},zk.prototype.ea=
function(b,c){return Fb.c(this.$b,this.Wa.b?this.Wa.b(c):this.Wa.call(null,c),c.m?c.m():c.call(null))},zk.prototype.fa=function(b,c,f){return Fb.c(this.$b,this.Wa.b?this.Wa.b(c):this.Wa.call(null,c),f)},zk.prototype.kc=function(b,c,f,g){return Ck(this.$b,c,f,this.Wa.b?this.Wa.b(g):this.Wa.call(null,g))},zk.cc=function(){return new R(null,4,5,S,[Rc(Ni,new v(null,2,[Be,qc(Ce,qc(new R(null,2,5,S,[cj,fj],null))),bk,"Given a foldable collection, and a transformation function xf,\n  returns a foldable collection, where any supplied reducing\n  fn will be transformed by xf. xf is a function of reducing fn to\n  reducing fn."],
null)),cj,fj,va.yd],null)},zk.sb=!0,zk.Za="clojure.core.reducers/t_clojure$core$reducers19049",zk.Ob=function(b,c){return Qb(c,"clojure.core.reducers/t_clojure$core$reducers19049")});return new zk(Ek,b,c,W)};
function Fk(a,b){return Ek(b,function(b){return function(){function d(d,e,f){e=a.a?a.a(e,f):a.call(null,e,f);return b.a?b.a(d,e):b.call(null,d,e)}function e(d,e){var f=a.b?a.b(e):a.call(null,e);return b.a?b.a(d,f):b.call(null,d,f)}function f(){return b.m?b.m():b.call(null)}var g=null,g=function(a,b,c){switch(arguments.length){case 0:return f.call(this);case 2:return e.call(this,a,b);case 3:return d.call(this,a,b,c)}throw Error("Invalid arity: "+arguments.length);};g.m=f;g.a=e;g.c=d;return g}()})}
function Gk(a,b){return Ek(b,function(b){return function(){function d(d,e,f){return Bk(b,d,a.a?a.a(e,f):a.call(null,e,f))}function e(d,e){return Bk(b,d,a.b?a.b(e):a.call(null,e))}function f(){return b.m?b.m():b.call(null)}var g=null,g=function(a,b,c){switch(arguments.length){case 0:return f.call(this);case 2:return e.call(this,a,b);case 3:return d.call(this,a,b,c)}throw Error("Invalid arity: "+arguments.length);};g.m=f;g.a=e;g.c=d;return g}()})}
var Hk=function Hk(b,c,d,e){if(rd(b))return d.m?d.m():d.call(null);if(N(b)<=c)return Bk(e,d.m?d.m():d.call(null),b);var f=Ud(N(b)),g=Bf.c(b,0,f);b=Bf.c(b,f,N(b));return Ak(function(b,c,e,f){return function(){var b=f(c),g;g=f(e);b=b.m?b.m():b.call(null);g=g.m?g.m():g.call(null);return d.a?d.a(b,g):d.call(null,b,g)}}(f,g,b,function(b,f,g){return function(n){return function(){return function(){return Hk(n,c,d,e)}}(b,f,g)}}(f,g,b)))};Ck["null"]=function(a,b,c){return c.m?c.m():c.call(null)};
Ck.object=function(a,b,c,d){return Bk(d,c.m?c.m():c.call(null),a)};R.prototype.kc=function(a,b,c,d){return Hk(this,b,c,d)};function Ik(){}
var Jk=function Jk(b,c,d){if(null!=b&&null!=b.ub)return b.ub(b,c,d);var e=Jk[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Jk._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Sa("StructurePath.select*",b);},Kk=function Kk(b,c,d){if(null!=b&&null!=b.vb)return b.vb(b,c,d);var e=Kk[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Kk._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Sa("StructurePath.transform*",b);};
function Lk(){}var Mk=function Mk(b,c){if(null!=b&&null!=b.lc)return b.lc(0,c);var d=Mk[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Mk._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("Collector.collect-val",b);};var Nk=function Nk(b){if(null!=b&&null!=b.Bc)return b.Bc();var c=Nk[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Nk._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("PathComposer.comp-paths*",b);};function Ok(a,b,c){this.type=a;this.md=b;this.od=c}var Pk;
Pk=new Ok(Bh,function(a,b,c,d){var e=function(){return function(a,b,c,d){return rd(c)?new R(null,1,5,S,[d],null):new R(null,1,5,S,[id.a(c,d)],null)}}(a,b,jd,d);return c.A?c.A(a,b,jd,d,e):c.call(null,a,b,jd,d,e)},function(a,b,c,d,e){var f=function(){return function(a,b,c,e){return rd(c)?d.b?d.b(e):d.call(null,e):B.a(d,id.a(c,e))}}(a,b,jd,e);return c.A?c.A(a,b,jd,e,f):c.call(null,a,b,jd,e,f)});var Qk;
Qk=new Ok(mi,function(a,b,c,d){a=function(){return function(a){return new R(null,1,5,S,[a],null)}}(d);return c.a?c.a(d,a):c.call(null,d,a)},function(a,b,c,d,e){return c.a?c.a(e,d):c.call(null,e,d)});function Rk(a,b,c,d,e,f){this.Ka=a;this.La=b;this.Ma=c;this.da=d;this.M=e;this.u=f;this.g=2229667594;this.C=8192}k=Rk.prototype;k.N=function(a,b){return mb.c(this,b,null)};
k.I=function(a,b,c){switch(b instanceof y?b.Ia:null){case "executors":return this.Ka;case "selector":return this.La;case "transformer":return this.Ma;default:return C.c(this.M,b,c)}};k.L=function(a,b,c){return wf(b,function(){return function(a){return wf(b,xf,""," ","",c,a)}}(this),"#com.rpl.specter.impl.TransformFunctions{",", ","}",c,te.a(new R(null,3,5,S,[new R(null,2,5,S,[Ih,this.Ka],null),new R(null,2,5,S,[yh,this.La],null),new R(null,2,5,S,[Fh,this.Ma],null)],null),this.M))};
k.Ha=function(){return new Jf(0,this,3,new R(null,3,5,S,[Ih,yh,Fh],null),ic(this.M))};k.P=function(){return this.da};k.Z=function(){return 3+N(this.M)};k.S=function(){var a=this.u;return null!=a?a:this.u=a=$d(this)};k.D=function(a,b){var c;c=x(b)?(c=this.constructor===b.constructor)?If(this,b):c:b;return x(c)?!0:!1};
k.rb=function(a,b){return Fd(new yg(null,new v(null,3,[yh,null,Fh,null,Ih,null],null),null),b)?od.a(Rc(cf.a(W,this),this.da),b):new Rk(this.Ka,this.La,this.Ma,this.da,ye(od.a(this.M,b)),null)};
k.Ra=function(a,b,c){return x(he.a?he.a(Ih,b):he.call(null,Ih,b))?new Rk(c,this.La,this.Ma,this.da,this.M,null):x(he.a?he.a(yh,b):he.call(null,yh,b))?new Rk(this.Ka,c,this.Ma,this.da,this.M,null):x(he.a?he.a(Fh,b):he.call(null,Fh,b))?new Rk(this.Ka,this.La,c,this.da,this.M,null):new Rk(this.Ka,this.La,this.Ma,this.da,Q.c(this.M,b,c),null)};
k.U=function(){return H(te.a(new R(null,3,5,S,[new R(null,2,5,S,[Ih,this.Ka],null),new R(null,2,5,S,[yh,this.La],null),new R(null,2,5,S,[Fh,this.Ma],null)],null),this.M))};k.R=function(a,b){return new Rk(this.Ka,this.La,this.Ma,b,this.M,this.u)};k.X=function(a,b){return vd(b)?pb(this,eb.a(b,0),eb.a(b,1)):Xa.c(cb,this,b)};function Sk(a,b,c){return new Rk(a,b,c,null,null,null)}function Tk(a,b,c,d,e,f){this.va=a;this.Ta=b;this.Ua=c;this.da=d;this.M=e;this.u=f;this.g=2229667594;this.C=8192}k=Tk.prototype;
k.N=function(a,b){return mb.c(this,b,null)};k.I=function(a,b,c){switch(b instanceof y?b.Ia:null){case "transform-fns":return this.va;case "params":return this.Ta;case "params-idx":return this.Ua;default:return C.c(this.M,b,c)}};
k.L=function(a,b,c){return wf(b,function(){return function(a){return wf(b,xf,""," ","",c,a)}}(this),"#com.rpl.specter.impl.CompiledPath{",", ","}",c,te.a(new R(null,3,5,S,[new R(null,2,5,S,[Rj,this.va],null),new R(null,2,5,S,[ri,this.Ta],null),new R(null,2,5,S,[Ui,this.Ua],null)],null),this.M))};k.Ha=function(){return new Jf(0,this,3,new R(null,3,5,S,[Rj,ri,Ui],null),ic(this.M))};k.P=function(){return this.da};k.Z=function(){return 3+N(this.M)};
k.S=function(){var a=this.u;return null!=a?a:this.u=a=$d(this)};k.D=function(a,b){var c;c=x(b)?(c=this.constructor===b.constructor)?If(this,b):c:b;return x(c)?!0:!1};k.rb=function(a,b){return Fd(new yg(null,new v(null,3,[ri,null,Ui,null,Rj,null],null),null),b)?od.a(Rc(cf.a(W,this),this.da),b):new Tk(this.va,this.Ta,this.Ua,this.da,ye(od.a(this.M,b)),null)};
k.Ra=function(a,b,c){return x(he.a?he.a(Rj,b):he.call(null,Rj,b))?new Tk(c,this.Ta,this.Ua,this.da,this.M,null):x(he.a?he.a(ri,b):he.call(null,ri,b))?new Tk(this.va,c,this.Ua,this.da,this.M,null):x(he.a?he.a(Ui,b):he.call(null,Ui,b))?new Tk(this.va,this.Ta,c,this.da,this.M,null):new Tk(this.va,this.Ta,this.Ua,this.da,Q.c(this.M,b,c),null)};
k.U=function(){return H(te.a(new R(null,3,5,S,[new R(null,2,5,S,[Rj,this.va],null),new R(null,2,5,S,[ri,this.Ta],null),new R(null,2,5,S,[Ui,this.Ua],null)],null),this.M))};k.R=function(a,b){return new Tk(this.va,this.Ta,this.Ua,b,this.M,this.u)};k.X=function(a,b){return vd(b)?pb(this,eb.a(b,0),eb.a(b,1)):Xa.c(cb,this,b)};function Uk(a){return new Tk(a,null,0,null,null,null)}Y;function Vk(a,b,c,d,e){this.va=a;this.lb=b;this.da=c;this.M=d;this.u=e;this.g=2229667595;this.C=8192}k=Vk.prototype;
k.N=function(a,b){return mb.c(this,b,null)};k.I=function(a,b,c){switch(b instanceof y?b.Ia:null){case "transform-fns":return this.va;case "num-needed-params":return this.lb;default:return C.c(this.M,b,c)}};k.L=function(a,b,c){return wf(b,function(){return function(a){return wf(b,xf,""," ","",c,a)}}(this),"#com.rpl.specter.impl.ParamsNeededPath{",", ","}",c,te.a(new R(null,2,5,S,[new R(null,2,5,S,[Rj,this.va],null),new R(null,2,5,S,[Oi,this.lb],null)],null),this.M))};
k.Ha=function(){return new Jf(0,this,2,new R(null,2,5,S,[Rj,Oi],null),ic(this.M))};
k.call=function(){function a(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t,D,F,E,L,O){a=qe(te.a(new R(null,20,5,S,[b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t,D,F,E,L],null),O));return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function b(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t,D,F,E,L){a=qe(20);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;a[14]=z;a[15]=t;a[16]=D;a[17]=F;a[18]=E;a[19]=L;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function c(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,
z,t,D,F,E){a=qe(19);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;a[14]=z;a[15]=t;a[16]=D;a[17]=F;a[18]=E;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function d(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t,D,F){a=qe(18);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;a[14]=z;a[15]=t;a[16]=D;a[17]=F;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function e(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t,D){a=qe(17);
a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;a[14]=z;a[15]=t;a[16]=D;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function f(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,t){a=qe(16);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;a[14]=z;a[15]=t;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function g(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z){a=qe(15);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;
a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;a[14]=z;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function h(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w){a=qe(14);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function l(a,b,c,d,e,f,g,h,l,m,n,p,q,r){a=qe(13);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function m(a,
b,c,d,e,f,g,h,l,m,n,p,q){a=qe(12);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function n(a,b,c,d,e,f,g,h,l,m,n,p){a=qe(11);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function p(a,b,c,d,e,f,g,h,l,m,n){a=qe(10);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function q(a,
b,c,d,e,f,g,h,l,m){a=qe(9);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function r(a,b,c,d,e,f,g,h,l){a=qe(8);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function t(a,b,c,d,e,f,g,h){a=qe(7);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function w(a,b,c,d,e,f,g){a=qe(6);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;return Y.c?Y.c(this,
a,0):Y.call(null,this,a,0)}function z(a,b,c,d,e,f){a=qe(5);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function D(a,b,c,d,e){a=qe(4);a[0]=b;a[1]=c;a[2]=d;a[3]=e;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function F(a,b,c,d){a=qe(3);a[0]=b;a[1]=c;a[2]=d;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function L(a,b,c){a=qe(2);a[0]=b;a[1]=c;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function O(a,b){var c=qe(1);c[0]=b;return Y.c?Y.c(this,c,0):Y.call(null,
this,c,0)}function za(){var a=qe(0);return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}var E=null,E=function(E,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa,Ib,Va,hb,ib,Bb,Hc,Ad,lf){switch(arguments.length){case 1:return za.call(this);case 2:return O.call(this,0,na);case 3:return L.call(this,0,na,U);case 4:return F.call(this,0,na,U,V);case 5:return D.call(this,0,na,U,V,ha);case 6:return z.call(this,0,na,U,V,ha,ia);case 7:return w.call(this,0,na,U,V,ha,ia,ja);case 8:return t.call(this,0,na,U,V,ha,ia,ja,la);case 9:return r.call(this,
0,na,U,V,ha,ia,ja,la,oa);case 10:return q.call(this,0,na,U,V,ha,ia,ja,la,oa,ta);case 11:return p.call(this,0,na,U,V,ha,ia,ja,la,oa,ta,ya);case 12:return n.call(this,0,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca);case 13:return m.call(this,0,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da);case 14:return l.call(this,0,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa);case 15:return h.call(this,0,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa,Ib);case 16:return g.call(this,0,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa,Ib,Va);case 17:return f.call(this,0,
na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa,Ib,Va,hb);case 18:return e.call(this,0,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa,Ib,Va,hb,ib);case 19:return d.call(this,0,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa,Ib,Va,hb,ib,Bb);case 20:return c.call(this,0,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa,Ib,Va,hb,ib,Bb,Hc);case 21:return b.call(this,0,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa,Ib,Va,hb,ib,Bb,Hc,Ad);case 22:return a.call(this,0,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Oa,Ib,Va,hb,ib,Bb,Hc,Ad,lf)}throw Error("Invalid arity: "+
arguments.length);};E.b=za;E.a=O;E.c=L;E.l=F;E.A=D;E.T=z;E.aa=w;E.ra=t;E.sa=r;E.ga=q;E.ha=p;E.ia=n;E.ja=m;E.ka=l;E.la=h;E.ma=g;E.na=f;E.oa=e;E.pa=d;E.qa=c;E.Fb=b;E.qb=a;return E}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Wa(b)))};k.m=function(){var a=qe(0);return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)};k.b=function(a){var b=qe(1);b[0]=a;return Y.c?Y.c(this,b,0):Y.call(null,this,b,0)};k.a=function(a,b){var c=qe(2);c[0]=a;c[1]=b;return Y.c?Y.c(this,c,0):Y.call(null,this,c,0)};
k.c=function(a,b,c){var d=qe(3);d[0]=a;d[1]=b;d[2]=c;return Y.c?Y.c(this,d,0):Y.call(null,this,d,0)};k.l=function(a,b,c,d){var e=qe(4);e[0]=a;e[1]=b;e[2]=c;e[3]=d;return Y.c?Y.c(this,e,0):Y.call(null,this,e,0)};k.A=function(a,b,c,d,e){var f=qe(5);f[0]=a;f[1]=b;f[2]=c;f[3]=d;f[4]=e;return Y.c?Y.c(this,f,0):Y.call(null,this,f,0)};k.T=function(a,b,c,d,e,f){var g=qe(6);g[0]=a;g[1]=b;g[2]=c;g[3]=d;g[4]=e;g[5]=f;return Y.c?Y.c(this,g,0):Y.call(null,this,g,0)};
k.aa=function(a,b,c,d,e,f,g){var h=qe(7);h[0]=a;h[1]=b;h[2]=c;h[3]=d;h[4]=e;h[5]=f;h[6]=g;return Y.c?Y.c(this,h,0):Y.call(null,this,h,0)};k.ra=function(a,b,c,d,e,f,g,h){var l=qe(8);l[0]=a;l[1]=b;l[2]=c;l[3]=d;l[4]=e;l[5]=f;l[6]=g;l[7]=h;return Y.c?Y.c(this,l,0):Y.call(null,this,l,0)};k.sa=function(a,b,c,d,e,f,g,h,l){var m=qe(9);m[0]=a;m[1]=b;m[2]=c;m[3]=d;m[4]=e;m[5]=f;m[6]=g;m[7]=h;m[8]=l;return Y.c?Y.c(this,m,0):Y.call(null,this,m,0)};
k.ga=function(a,b,c,d,e,f,g,h,l,m){var n=qe(10);n[0]=a;n[1]=b;n[2]=c;n[3]=d;n[4]=e;n[5]=f;n[6]=g;n[7]=h;n[8]=l;n[9]=m;return Y.c?Y.c(this,n,0):Y.call(null,this,n,0)};k.ha=function(a,b,c,d,e,f,g,h,l,m,n){var p=qe(11);p[0]=a;p[1]=b;p[2]=c;p[3]=d;p[4]=e;p[5]=f;p[6]=g;p[7]=h;p[8]=l;p[9]=m;p[10]=n;return Y.c?Y.c(this,p,0):Y.call(null,this,p,0)};
k.ia=function(a,b,c,d,e,f,g,h,l,m,n,p){var q=qe(12);q[0]=a;q[1]=b;q[2]=c;q[3]=d;q[4]=e;q[5]=f;q[6]=g;q[7]=h;q[8]=l;q[9]=m;q[10]=n;q[11]=p;return Y.c?Y.c(this,q,0):Y.call(null,this,q,0)};k.ja=function(a,b,c,d,e,f,g,h,l,m,n,p,q){var r=qe(13);r[0]=a;r[1]=b;r[2]=c;r[3]=d;r[4]=e;r[5]=f;r[6]=g;r[7]=h;r[8]=l;r[9]=m;r[10]=n;r[11]=p;r[12]=q;return Y.c?Y.c(this,r,0):Y.call(null,this,r,0)};
k.ka=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){var t=qe(14);t[0]=a;t[1]=b;t[2]=c;t[3]=d;t[4]=e;t[5]=f;t[6]=g;t[7]=h;t[8]=l;t[9]=m;t[10]=n;t[11]=p;t[12]=q;t[13]=r;return Y.c?Y.c(this,t,0):Y.call(null,this,t,0)};k.la=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t){var w=qe(15);w[0]=a;w[1]=b;w[2]=c;w[3]=d;w[4]=e;w[5]=f;w[6]=g;w[7]=h;w[8]=l;w[9]=m;w[10]=n;w[11]=p;w[12]=q;w[13]=r;w[14]=t;return Y.c?Y.c(this,w,0):Y.call(null,this,w,0)};
k.ma=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w){var z=qe(16);z[0]=a;z[1]=b;z[2]=c;z[3]=d;z[4]=e;z[5]=f;z[6]=g;z[7]=h;z[8]=l;z[9]=m;z[10]=n;z[11]=p;z[12]=q;z[13]=r;z[14]=t;z[15]=w;return Y.c?Y.c(this,z,0):Y.call(null,this,z,0)};k.na=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z){var D=qe(17);D[0]=a;D[1]=b;D[2]=c;D[3]=d;D[4]=e;D[5]=f;D[6]=g;D[7]=h;D[8]=l;D[9]=m;D[10]=n;D[11]=p;D[12]=q;D[13]=r;D[14]=t;D[15]=w;D[16]=z;return Y.c?Y.c(this,D,0):Y.call(null,this,D,0)};
k.oa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D){var F=qe(18);F[0]=a;F[1]=b;F[2]=c;F[3]=d;F[4]=e;F[5]=f;F[6]=g;F[7]=h;F[8]=l;F[9]=m;F[10]=n;F[11]=p;F[12]=q;F[13]=r;F[14]=t;F[15]=w;F[16]=z;F[17]=D;return Y.c?Y.c(this,F,0):Y.call(null,this,F,0)};k.pa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F){var L=qe(19);L[0]=a;L[1]=b;L[2]=c;L[3]=d;L[4]=e;L[5]=f;L[6]=g;L[7]=h;L[8]=l;L[9]=m;L[10]=n;L[11]=p;L[12]=q;L[13]=r;L[14]=t;L[15]=w;L[16]=z;L[17]=D;L[18]=F;return Y.c?Y.c(this,L,0):Y.call(null,this,L,0)};
k.qa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F,L){var O=qe(20);O[0]=a;O[1]=b;O[2]=c;O[3]=d;O[4]=e;O[5]=f;O[6]=g;O[7]=h;O[8]=l;O[9]=m;O[10]=n;O[11]=p;O[12]=q;O[13]=r;O[14]=t;O[15]=w;O[16]=z;O[17]=D;O[18]=F;O[19]=L;return Y.c?Y.c(this,O,0):Y.call(null,this,O,0)};k.Fb=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F,L,O){a=qe(te.a(new R(null,20,5,S,[a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,w,z,D,F,L],null),O));return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)};k.P=function(){return this.da};
k.Z=function(){return 2+N(this.M)};k.S=function(){var a=this.u;return null!=a?a:this.u=a=$d(this)};k.D=function(a,b){var c;c=x(b)?(c=this.constructor===b.constructor)?If(this,b):c:b;return x(c)?!0:!1};k.rb=function(a,b){return Fd(new yg(null,new v(null,2,[Oi,null,Rj,null],null),null),b)?od.a(Rc(cf.a(W,this),this.da),b):new Vk(this.va,this.lb,this.da,ye(od.a(this.M,b)),null)};
k.Ra=function(a,b,c){return x(he.a?he.a(Rj,b):he.call(null,Rj,b))?new Vk(c,this.lb,this.da,this.M,null):x(he.a?he.a(Oi,b):he.call(null,Oi,b))?new Vk(this.va,c,this.da,this.M,null):new Vk(this.va,this.lb,this.da,Q.c(this.M,b,c),null)};k.U=function(){return H(te.a(new R(null,2,5,S,[new R(null,2,5,S,[Rj,this.va],null),new R(null,2,5,S,[Oi,this.lb],null)],null),this.M))};k.R=function(a,b){return new Vk(this.va,this.lb,b,this.M,this.u)};
k.X=function(a,b){return vd(b)?pb(this,eb.a(b,0),eb.a(b,1)):Xa.c(cb,this,b)};function Wk(a,b){return new Vk(a,b,null,null,null)}function Y(a,b,c){return new Tk(a.va,b,c,null,null,null)}function Xk(a){return new v(null,2,[gj,null!=a&&a.tb?function(a,c,d){return a.ub(null,c,d)}:Jk,Vh,null!=a&&a.tb?function(a,c,d){return a.vb(null,c,d)}:Kk],null)}function Yk(a){return new v(null,1,[pj,null!=a&&a.Ec?function(a,c){return a.lc(0,c)}:Mk],null)}
function Zk(a){var b=function(b){return function(d,e,f,g,h){f=id.a(f,b.a?b.a(a,g):b.call(null,a,g));return h.l?h.l(d,e,f,g):h.call(null,d,e,f,g)}}(pj.b(Yk(a)));return Uk(Sk(Pk,b,b))}function $k(a){var b=Xk(a),c=gj.b(b),d=Vh.b(b);return Uk(Sk(Qk,function(b,c){return function(b,d){return c.c?c.c(a,b,d):c.call(null,a,b,d)}}(b,c,d),function(b,c,d){return function(b,c){return d.c?d.c(a,b,c):d.call(null,a,b,c)}}(b,c,d)))}
var al=function al(b){if(null!=b&&null!=b.fb)return b.fb(b);var c=al[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=al._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("CoercePath.coerce-path",b);};al["null"]=function(){return $k(null)};Tk.prototype.fb=function(){return this};Vk.prototype.fb=function(){return this};R.prototype.fb=function(){return Nk(this)};Cc.prototype.fb=function(){return al(Kd(this))};de.prototype.fb=function(){return al(Kd(this))};bd.prototype.fb=function(){return al(Kd(this))};
al._=function(a){var b;b=(b=(b=ca(a))?b:null!=a?a.Jc?!0:a.Zb?!1:Ra(Ya,a):Ra(Ya,a))?b:null!=a?a.tb?!0:a.Zb?!1:Ra(Ik,a):Ra(Ik,a);if(x(b))a=$k(a);else if(null!=a?a.Ec||(a.Zb?0:Ra(Lk,a)):Ra(Lk,a))a=Zk(a);else throw b=G,a=[A("Protocol implementation cannot be found for object.\n        Extending Specter protocols should not be done inline in a deftype definition\n        because that prevents Specter from finding the protocol implementations for\n        optimized performance. Instead, you should extend the protocols via an\n        explicit extend-protocol call. \n"),
A(a)].join(""),a=b([a],0),Error(B.a(A,a));return a};function bl(a){return a.Ka.type}
function cl(a){var b=P(a,0),c=Wd(a,1),d=b.Ka,e=d.type,f=sc.a(e,Bh)?function(a,b,c,d,e,f){return function(q,r){return function(a,b,c,d,e,f){return function(g,h,l,m,n){var p=function(){return function(a,b,c,d){return r.A?r.A(a,b,c,d,n):r.call(null,a,b,c,d,n)}}(g,h,l,m,a,b,c,d,e,f);return q.A?q.A(g,h,l,m,p):q.call(null,g,h,l,m,p)}}(a,b,c,d,e,f)}}(d,e,a,b,c,a):function(a,b,c,d,e,f){return function(q,r){return function(a,b,c,d,e,f){return function(g,h){var l=function(){return function(a){return r.a?r.a(a,
h):r.call(null,a,h)}}(g,a,b,c,d,e,f);return q.a?q.a(g,l):q.call(null,g,l)}}(a,b,c,d,e,f)}}(d,e,a,b,c,a);return Xa.a(function(a,b,c){return function(b,d){return Sk(a,function(){var a=b.La,e=d.La;return c.a?c.a(a,e):c.call(null,a,e)}(),function(){var a=b.Ma,e=d.Ma;return c.a?c.a(a,e):c.call(null,a,e)}())}}(d,e,f,a,b,c,a),a)}
function dl(a){if(sc.a(bl(a),Bh))return a;var b=a.La;a=a.Ma;return Sk(Pk,function(a,b){return function(e,f,g,h,l){var m=function(){return function(a){return l.l?l.l(e,f,g,a):l.call(null,e,f,g,a)}}(h,a,b);return a.a?a.a(h,m):a.call(null,h,m)}}(b,a),function(a,b){return function(e,f,g,h,l){var m=function(){return function(a){return l.l?l.l(e,f,g,a):l.call(null,e,f,g,a)}}(h,a,b);return b.a?b.a(h,m):b.call(null,h,m)}}(b,a))}
function el(a){if(a instanceof Tk){var b=ri.b(a),c=Ui.b(a),d=yh.b(Rj.b(a)),e=Fh.b(Rj.b(a));return rd(b)?a:Uk(Sk(Pk,function(a,b,c,d){return function(e,n,p,q,r){var t=function(){return function(a,b,c,d){return r.l?r.l(e,n,c,d):r.call(null,e,n,c,d)}}(a,b,p,q,a,b,c,d);return c.A?c.A(a,b,p,q,t):c.call(null,a,b,p,q,t)}}(b,c,d,e),function(a,b,c,d){return function(e,n,p,q,r){var t=function(){return function(a,b,c,d){return r.l?r.l(e,n,c,d):r.call(null,e,n,c,d)}}(a,b,p,q,a,b,c,d);return d.A?d.A(a,b,p,q,t):
d.call(null,a,b,p,q,t)}}(b,c,d,e)))}return a}Nk["null"]=function(a){return al(a)};Nk._=function(a){return al(a)};R.prototype.Bc=function(){if(rd(this))return al(null);var a=T.a(el,T.a(al,this)),b=T.a(cl,Gg(bl,T.a(Rj,a))),c=sc.a(1,N(b))?I(b):cl(T.a(dl,b)),a=$e(function(){return function(a){return a instanceof Vk}}(a,b,c,this),a);return rd(a)?Uk(c):Wk(dl(c),Xa.a(Nd,T.a(Oi,a)))};function fl(a){return a instanceof Tk?0:Oi.b(a)}
var gl=function gl(b,c){if(null!=b&&null!=b.Cc)return b.Cc(0,c);var d=gl[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=gl._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("SetExtremes.set-first",b);},hl=function hl(b,c){if(null!=b&&null!=b.Dc)return b.Dc(0,c);var d=hl[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=hl._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("SetExtremes.set-last",b);};
R.prototype.Cc=function(a,b){return Q.c(this,0,b)};R.prototype.Dc=function(a,b){return Q.c(this,N(this)-1,b)};gl._=function(a,b){return M(b,Dc(a))};hl._=function(a,b){var c=Bg(a);return id.a(Kd(c),b)};function il(a,b){var c=a.va;return c.Ka.md.call(null,a.Ta,a.Ua,c.La,b)}function jl(a,b,c){var d=a.va;return d.Ka.od.call(null,a.Ta,a.Ua,d.Ma,b,c)}function kl(){}kl.prototype.tb=!0;kl.prototype.ub=function(a,b,c){return cf.a(jd,Gk(c,b))};
kl.prototype.vb=function(a,b,c){a=null==b?null:ab(b);if(ce(a))for(c=b=T.a(c,b);;)if(H(c))c=J(c);else break;else b=cf.a(a,Fk(c,b));return b};function ll(){}ll.prototype.Ec=!0;ll.prototype.lc=function(a,b){return b};function ml(a,b){this.Gc=a;this.nd=b}ml.prototype.tb=!0;ml.prototype.ub=function(a,b,c){if(rd(b))return null;a=this.Gc.call(null,b);return c.b?c.b(a):c.call(null,a)};
ml.prototype.vb=function(a,b,c){var d=this;return rd(b)?b:d.nd.call(null,b,function(){var a=d.Gc.call(null,b);return c.b?c.b(a):c.call(null,a)}())};function nl(a,b,c,d){a=Bf.c(Kd(a),b,c);return d.b?d.b(a):d.call(null,a)}function ol(a,b,c,d){var e=Kd(a),f=Bf.c(e,b,c);d=d.b?d.b(f):d.call(null,f);b=te.h(Bf.c(e,0,b),d,G([Bf.c(e,c,N(a))],0));return vd(a)?Kd(b):b}Ik["null"]=!0;Jk["null"]=function(a,b,c){return c.b?c.b(b):c.call(null,b)};Kk["null"]=function(a,b,c){return c.b?c.b(b):c.call(null,b)};
function pl(a,b,c){return x(a.b?a.b(b):a.call(null,b))?c.b?c.b(b):c.call(null,b):null}function ql(a,b,c){return x(a.b?a.b(b):a.call(null,b))?c.b?c.b(b):c.call(null,b):b};function rl(a){return Nk(Kd(a))}function sl(a,b){var c=Nk(a);return il.a?il.a(c,b):il.call(null,c,b)}function tl(a,b,c){a=Nk(a);return jl.c?jl.c(a,b,c):jl.call(null,a,b,c)}var ul=rl(G([new kl],0)),vl=new ll,wl=rl(G([new ml(hd,hl)],0));rl(G([new ml(I,gl)],0));
var xl=Wk(Sk(Pk,function(a,b,c,d,e){var f=a[b+0],g=a[b+1];return nl(d,f.b?f.b(d):f.call(null,d),g.b?g.b(d):g.call(null,d),function(d){var f=b+2;return e.l?e.l(a,f,c,d):e.call(null,a,f,c,d)})},function(a,b,c,d,e){var f=a[b+0],g=a[b+1];return ol(d,f.b?f.b(d):f.call(null,d),g.b?g.b(d):g.call(null,d),function(d){var f=b+2;return e.l?e.l(a,f,c,d):e.call(null,a,f,c,d)})}),2),yl=Wk(Sk(Pk,function(a,b,c,d,e){return nl(d,a[b+0],a[b+1],function(d){var g=b+2;return e.l?e.l(a,g,c,d):e.call(null,a,g,c,d)})},function(a,
b,c,d,e){return ol(d,a[b+0],a[b+1],function(d){var g=b+2;return e.l?e.l(a,g,c,d):e.call(null,a,g,c,d)})}),2);yl.a?yl.a(0,0):yl.call(null,0,0);xl.a?xl.a(N,N):xl.call(null,N,N);y.prototype.tb=!0;y.prototype.ub=function(a,b,c){a=C.a(b,this);return c.b?c.b(a):c.call(null,a)};y.prototype.vb=function(a,b,c){var d=this;return Q.c(b,d,function(){var a=C.a(b,d);return c.b?c.b(a):c.call(null,a)}())};Ik["function"]=!0;Jk["function"]=function(a,b,c){return pl(a,b,c)};
Kk["function"]=function(a,b,c){return ql(a,b,c)};yg.prototype.tb=!0;yg.prototype.ub=function(a,b,c){return pl(this,b,c)};yg.prototype.vb=function(a,b,c){return ql(this,b,c)};var zl=Wk(Sk(Pk,function(a,b,c,d,e){var f=a[b+0];d=x(d)?d:f;b+=1;return e.l?e.l(a,b,c,d):e.call(null,a,b,c,d)},function(a,b,c,d,e){var f=a[b+0];d=x(d)?d:f;b+=1;return e.l?e.l(a,b,c,d):e.call(null,a,b,c,d)}),1);zl.b?zl.b(zg):zl.call(null,zg);var Al=Ec;zl.b?zl.b(Al):zl.call(null,Al);zl.b?zl.b(jd):zl.call(null,jd);
function Bl(){var a=G([jk],0),b=T.a(Nk,new R(null,1,5,S,[a],null)),c=T.a(fl,b),d=M(0,Hg(c)),e=hd(d),f=T.c(function(a,b,c,d){return function(e,f){return x(f instanceof Tk)?function(){return function(){return f}}(a,b,c,d):function(){return function(a,b){return Y(f,a,b+e)}}(a,b,c,d)}}(b,c,d,e),d,b),g=P(f,0),a=function(){var a=function(a,b,c,d,e,f,g){return function(a,b,c,e,f){var h;h=g.a?g.a(a,b):g.call(null,a,b);var l=il.a?il.a(h,e):il.call(null,h,e);if(1<N(l))throw a=G(["More than one element found for params: ",
h,e],0),Error(B.a(A,a));h=I(l);b+=d;c=id.a(c,h);return f.l?f.l(a,b,c,e):f.call(null,a,b,c,e)}}(b,c,d,e,f,f,g);return Wk(Sk(Pk,a,a),e)}();return sc.a(0,e)?Y(a,null,0):a};var Cl=new v(null,3,[li,2,Lh,4,Aj,1],null),Dl=new v(null,3,[li,40,Lh,40,Aj,0],null);function El(a,b){var c=T.a(Ie.a(Cl,wi),b),d=a/Xa.a(Nd,c);return T.a(Je(Pd,d),c)}function Fl(a,b,c){return id.a(b,function(){var d=null==b?null:wb(b);return a.a?a.a(d,c):a.call(null,d,c)}())}function Gl(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Pc,a):a,c=C.a(c,wi),c=b-(Dl.b?Dl.b(c):Dl.call(null,c));return c-Td(c,20)}
function Hl(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Pc,a):a,d=C.a(c,ki),e=C.a(c,mk),f=El(e,b);return T.h(function(a,b,c,d){return function(a,b,c,e){a=null!=a&&(a.g&64||a.F)?B.a(Pc,a):a;C.a(a,wi);return vg.h(G([a,new v(null,5,[rh,c,ki,d,vj,e,Oh,e,ni,-30],null)],0))}}(f,a,c,d,e),b,f,Xa.c(Je(Fl,Nd),new R(null,1,5,S,[0],null),f),G([T.c(Gl,b,f)],0))}
function Il(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Pc,a):a,d=C.a(c,ki),e=C.a(c,mk),f=C.a(c,Lj),g=N(b),h=d/g;return T.c(function(a,b,c,d,e,f){return function(a,c){var d=new v(null,3,[Lj,a,ki,b-30,mk,f],null),d=null!=d&&(d.g&64||d.F)?B.a(Pc,d):d,e=C.a(d,ki),g=C.a(d,mk),h=null!=c&&(c.g&64||c.F)?B.a(Pc,c):c;C.a(h,Ph);return gf.c(vg.h(G([h,d],0)),Ph,Je(Hl,new v(null,2,[ki,e,mk,g],null)))}}(g,h,a,c,d,e,f),Se(g,We(Je(Nd,h),f)),b)};function Jl(a){return sc.a(Lh,wi.b(a))}function Kl(a){return tl(new R(null,7,5,S,[ci,ul,Ph,ul,function(a){return Oj.b(a)},ik,wl],null),He(ji),a)}if("undefined"===typeof Ll)var Ll=function(){var a=X.b?X.b(W):X.call(null,W),b=X.b?X.b(W):X.call(null,W),c=X.b?X.b(W):X.call(null,W),d=X.b?X.b(W):X.call(null,W),e=C.c(W,Yj,dh());return new oh(Ac.a("pennygame.updates","capacity"),function(){return function(a,b){var c=null!=b&&(b.g&64||b.F)?B.a(Pc,b):b;return C.a(c,wi)}}(a,b,c,d,e),$h,e,a,b,c,d)}();
qh(Ll,Fi,function(a){return a});qh(Ll,Qi,function(a){switch(a){case 1:return 4;case 2:return 4;case 3:return 4;case 4:return 4;case 5:return 5;case 6:return 6;default:throw Error([A("No matching clause: "),A(a)].join(""));}});qh(Ll,Bi,function(a,b,c){a=null!=b&&(b.g&64||b.F)?B.a(Pc,b):b;b=C.a(a,xh);a=C.a(a,Zh);c=ld(c,b);b=null!=c&&(c.g&64||c.F)?B.a(Pc,c):c;c=C.a(b,Qh);b=C.a(b,ik);if(sc.a(a,Qh))return c;a=N(b);return c<a?c:a});function Ml(a,b){return tl(new R(null,4,5,S,[ci,ul,Ph,ul],null),b,a)}
function Nl(a,b){return Kd(T.c(function(a,b){return Q.c(a,ei,b)},a,b))}function Ol(a,b){return gf.l(a,Uj,Nl,b)}function Pl(a,b){return tl(new R(null,6,5,S,[ci,ul,Ph,vl,ul,function(a){return Fd(a,Eh)}],null),function(a,d){var e=null!=d&&(d.g&64||d.F)?B.a(Pc,d):d,f=C.a(e,Eh),g=C.a(e,kk);C.a(e,ik);f=df(b,new R(null,2,5,S,[f,ei],null));g=Ll.c?Ll.c(f,g,a):Ll.call(null,f,g,a);return Q.c(e,Qh,g)},a)}
function Ql(a,b){return tl(new R(null,7,5,S,[ci,ul,Ph,vl,ul,function(a){return Fd(a,Eh)},function(a){return sc.a(Bi,df(a,new R(null,2,5,S,[kk,wi],null)))}],null),function(a,d){var e=null!=d&&(d.g&64||d.F)?B.a(Pc,d):d,f=C.a(e,Eh),g=C.a(e,kk);C.a(e,ik);f=df(b,new R(null,2,5,S,[f,ei],null));g=Ll.c?Ll.c(f,g,a):Ll.call(null,f,g,a);return Q.c(e,Qh,g)},a)}function Rl(a){var b=a.b?a.b(Uj):a.call(null,Uj);return Ql(Pl(a,b),b)}
if("undefined"===typeof Sl){var Sl,Tl=X.b?X.b(W):X.call(null,W),Ul=X.b?X.b(W):X.call(null,W),Vl=X.b?X.b(W):X.call(null,W),Wl=X.b?X.b(W):X.call(null,W),Xl=C.c(W,Yj,dh());Sl=new oh(Ac.a("pennygame.updates","process"),wi,$h,Xl,Tl,Ul,Vl,Wl)}qh(Sl,$h,function(a){a=null!=a&&(a.g&64||a.F)?B.a(Pc,a):a;var b=C.a(a,Qh),c=C.a(a,ik);return Q.h(a,ik,Te(b,c),G([Kj,Se(b,c)],0))});qh(Sl,li,function(a){a=null!=a&&(a.g&64||a.F)?B.a(Pc,a):a;var b=C.a(a,Qh);return Q.c(a,Kj,Se(b,Ue(W)))});
function Yl(a){var b=I(sl(new R(null,4,5,S,[Ph,ul,function(a){return zj.b(a)},zj],null),a));return tl(new R(null,5,5,S,[Ph,function(){var a=b+1;return yl.a?yl.a(b,a):yl.call(null,b,a)}(),ul,Kj,wl],null),He(ji),a)}function Zl(a){return Fe(function(a){return sc.a(a,ji)},sl(new R(null,4,5,S,[ul,function(a){return zj.b(a)},Kj,ul],null),a))}function $l(a){return x(Zl(a.b?a.b(Ph):a.call(null,Ph)))?Yl(a):a}
function am(a){return tl(new R(null,2,5,S,[ci,ul],null),$l,tl(new R(null,5,5,S,[ci,ul,Ph,ul,function(a){return C.a(a,Qh)}],null),Sl,a))}function bm(a){var b=B.c(Sd,16.5,T.a(function(a){var b=null!=a&&(a.g&64||a.F)?B.a(Pc,a):a;a=C.a(b,wj);var e=C.a(b,jk),b=C.a(b,ik);return a/(N(e)+N(b))},sl(new R(null,5,5,S,[ci,ul,Ph,ul,Jl],null),a)));return tl(new R(null,5,5,S,[ci,ul,Ph,ul,Jl],null),function(a){return function(b){return gf.l(b,uh,Sd,a)}}(b),a)}
function cm(a){return tl(new R(null,6,5,S,[ci,ul,Ph,vl,ul,function(a){return Fd(a,vh)}],null),function(a,c){var d=null!=c&&(c.g&64||c.F)?B.a(Pc,c):c,e=C.a(d,vh);return Q.c(d,jk,df(Kd(a),new R(null,2,5,S,[e,Kj],null)))},a)}function dm(a){return tl(new R(null,6,5,S,[ci,ul,Ph,ul,Bl(),ik],null),function(a,c){return te.a(c,a)},a)}
function em(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Pc,a):a,c=C.a(c,Ph),d=null!=b&&(b.g&64||b.F)?B.a(Pc,b):b,e=C.c(d,ek,0),f=C.c(d,Ch,0),g=C.c(d,ui,0),h=C.c(d,Ai,0),l=C.a(d,oj),m=C.a(d,si),n=C.c(d,Yh,new R(null,2,5,S,[0,0],null)),d=N(Kj.b(I(c))),p=N(Kj.b(hd(Bg(c)))),q=B.c(T,Nd,T.a(Jg(Ie.a(N,Kj),Qh),sl(new R(null,2,5,S,[ul,Jl],null),c))),r=Xa.a(Nd,T.a(N,sl(new R(null,3,5,S,[ul,Jl,ik],null),c))),n=T.c(Nd,n,q);return nd([Ch,Yh,si,ui,Ai,Gi,Wi,oj,ek],[x(Zl(c))?f+1:f,n,m+p,x(Zl(c))?e-h:g,x(Zl(c))?e:h,r,B.a(Qd,
n),l+d,e+1])}function fm(a){return tl(new R(null,5,5,S,[ci,ul,function(a){return H(C.a(a,Ph))},vl,Nh],null),function(a,c){return id.a(c,em(a,null==c?null:wb(c)))},tl(new R(null,7,5,S,[ci,ul,function(a){return H(C.a(a,Ph))},Ph,ul,function(a){return N(Kj.b(a))<Qh.b(a)},Zj],null),Sc,a))};var gm,hm=function hm(b){if(null!=b&&null!=b.Yb)return b.Yb();var c=hm[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=hm._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("Channel.close!",b);},im=function im(b){if(null!=b&&null!=b.zc)return!0;var c=im[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=im._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("Handler.active?",b);},jm=function jm(b){if(null!=b&&null!=b.Ac)return b.Fa;var c=jm[u(null==b?null:b)];
if(null!=c)return c.b?c.b(b):c.call(null,b);c=jm._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("Handler.commit",b);},km=function km(b,c){if(null!=b&&null!=b.yc)return b.yc(0,c);var d=km[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=km._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Sa("Buffer.add!*",b);},lm=function lm(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return lm.b(arguments[0]);case 2:return lm.a(arguments[0],
arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};lm.b=function(a){return a};lm.a=function(a,b){return km(a,b)};lm.w=2;var mm,nm=function nm(b){"undefined"===typeof mm&&(mm=function(b,d,e){this.mc=b;this.Fa=d;this.ed=e;this.g=393216;this.C=0},mm.prototype.R=function(b,d){return new mm(this.mc,this.Fa,d)},mm.prototype.P=function(){return this.ed},mm.prototype.zc=function(){return!0},mm.prototype.Ac=function(){return this.Fa},mm.cc=function(){return new R(null,3,5,S,[Rc(ak,new v(null,2,[Sh,!0,Be,qc(Ce,qc(new R(null,1,5,S,[tk],null)))],null)),tk,va.Ad],null)},mm.sb=!0,mm.Za="cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers22008",
mm.Ob=function(b,d){return Qb(d,"cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers22008")});return new mm(nm,b,W)};function om(a){try{return a[0].call(null,a)}catch(b){throw b instanceof Object&&a[6].Yb(),b;}}function pm(a,b,c){c=qm(c,nm(function(c){a[2]=c;a[1]=b;return om(a)}));return x(c)?(a[2]=K.b?K.b(c):K.call(null,c),a[1]=b,vi):null}function rm(a,b){var c=a[6];null!=b&&sm(c,b,nm(function(){return function(){return null}}(c)));c.Yb();return c}
function tm(a){for(;;){var b=a[4],c=xi.b(b),d=nj.b(b),e=a[5];if(x(function(){var a=e;return x(a)?Qa(b):a}()))throw e;if(x(function(){var a=e;return x(a)?(a=c,x(a)?e instanceof d:a):a}())){a[1]=c;a[2]=e;a[5]=null;a[4]=Q.h(b,xi,null,G([nj,null],0));break}if(x(function(){var a=e;return x(a)?Qa(c)&&Qa(ai.b(b)):a}()))a[4]=sj.b(b);else{if(x(function(){var a=e;return x(a)?(a=Qa(c))?ai.b(b):a:a}())){a[1]=ai.b(b);a[4]=Q.c(b,ai,null);break}if(x(function(){var a=Qa(e);return a?ai.b(b):a}())){a[1]=ai.b(b);a[4]=
Q.c(b,ai,null);break}if(Qa(e)&&Qa(ai.b(b))){a[1]=xj.b(b);a[4]=sj.b(b);break}throw Error("No matching clause");}}};var um=VDOM.diff,vm=VDOM.patch,wm=VDOM.create;function xm(a){return af(Na,af(Dd,bf(a)))}function ym(a,b,c){return new VDOM.VHtml(Xd(a),$g(od.a(b,Mh)),$g(c),Mh.b(b))}function zm(a,b,c){return new VDOM.VSvg(Xd(a),$g(b),$g(c))}Am;
var Bm=function Bm(b){if(null==b)return new VDOM.VText("");if(x(VDOM.isVirtualNode(b)))return b;if(Dd(b))return ym(Ti,W,T.a(Bm,xm(b)));if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(sc.a(tj,I(b)))return Am.b?Am.b(b):Am.call(null,b);var c=P(b,0),d=P(b,1);b=Wd(b,2);return ym(c,d,T.a(Bm,xm(b)))},Am=function Am(b){if(null==b)return new VDOM.VText("");if(x(VDOM.isVirtualNode(b)))return b;if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(sc.a(pk,I(b))){var c=
P(b,0),d=P(b,1);b=Wd(b,2);return zm(c,d,T.a(Bm,xm(b)))}c=P(b,0);d=P(b,1);b=Wd(b,2);return zm(c,d,T.a(Am,xm(b)))};
function Cm(){var a=document.getElementById("app"),b=function(){var a=new VDOM.VText("");return X.b?X.b(a):X.call(null,a)}(),c=function(){var a;a=K.b?K.b(b):K.call(null,b);a=wm.b?wm.b(a):wm.call(null,a);return X.b?X.b(a):X.call(null,a)}(),d=function(){var a=window.requestAnimationFrame;return x(a)?function(a){return function(b){return a.b?a.b(b):a.call(null,b)}}(a,a,b,c):function(){return function(a){return a.m?a.m():a.call(null)}}(a,b,c)}();a.appendChild(K.b?K.b(c):K.call(null,c));return function(a,
b,c){return function(d){var l=Bm(d);d=function(){var b=K.b?K.b(a):K.call(null,a);return um.a?um.a(b,l):um.call(null,b,l)}();Pe.a?Pe.a(a,l):Pe.call(null,a,l);d=function(a,b,c,d){return function(){return Qe.c(d,vm,b)}}(l,d,a,b,c);return c.b?c.b(d):c.call(null,d)}}(b,c,d)};var Dm;
function Em(){var a=aa.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==wk.indexOf("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=ma(function(a){if(("*"==d||a.origin==
d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&-1==wk.indexOf("Trident")&&-1==wk.indexOf("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.pc;c.pc=null;a()}};return function(a){d.next={pc:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=
document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){aa.setTimeout(a,0)}};function Fm(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function Gm(a,b,c,d){this.head=a;this.O=b;this.length=c;this.f=d}Gm.prototype.pop=function(){if(0===this.length)return null;var a=this.f[this.O];this.f[this.O]=null;this.O=(this.O+1)%this.f.length;--this.length;return a};Gm.prototype.unshift=function(a){this.f[this.head]=a;this.head=(this.head+1)%this.f.length;this.length+=1;return null};function Hm(a,b){a.length+1===a.f.length&&a.resize();a.unshift(b)}
Gm.prototype.resize=function(){var a=Array(2*this.f.length);return this.O<this.head?(Fm(this.f,this.O,a,0,this.length),this.O=0,this.head=this.length,this.f=a):this.O>this.head?(Fm(this.f,this.O,a,0,this.f.length-this.O),Fm(this.f,0,a,this.f.length-this.O,this.head),this.O=0,this.head=this.length,this.f=a):this.O===this.head?(this.head=this.O=0,this.f=a):null};function Im(a,b){for(var c=a.length,d=0;;)if(d<c){var e=a.pop();(b.b?b.b(e):b.call(null,e))&&a.unshift(e);d+=1}else break}
function Jm(a){return new Gm(0,0,0,Array(a))}function Km(a,b){this.K=a;this.n=b;this.g=2;this.C=0}function Lm(a){return a.K.length===a.n}Km.prototype.yc=function(a,b){Hm(this.K,b);return this};Km.prototype.Z=function(){return this.K.length};var Mm=Jm(32),Nm=!1,Om=!1;Pm;function Qm(){Nm=!0;Om=!1;for(var a=0;;){var b=Mm.pop();if(null!=b&&(b.m?b.m():b.call(null),1024>a)){a+=1;continue}break}Nm=!1;return 0<Mm.length?Pm.m?Pm.m():Pm.call(null):null}function Pm(){var a=Om;if(x(x(a)?Nm:a))return null;Om=!0;!ca(aa.setImmediate)||aa.Window&&aa.Window.prototype&&aa.Window.prototype.setImmediate==aa.setImmediate?(Dm||(Dm=Em()),Dm(Qm)):aa.setImmediate(Qm)}function Rm(a){Hm(Mm,a);Pm()}function Sm(a,b){setTimeout(a,b)};var Tm,Um=function Um(b){"undefined"===typeof Tm&&(Tm=function(b,d,e){this.Ic=b;this.G=d;this.fd=e;this.g=425984;this.C=0},Tm.prototype.R=function(b,d){return new Tm(this.Ic,this.G,d)},Tm.prototype.P=function(){return this.fd},Tm.prototype.Eb=function(){return this.G},Tm.cc=function(){return new R(null,3,5,S,[Rc(Vi,new v(null,1,[Be,qc(Ce,qc(new R(null,1,5,S,[ej],null)))],null)),ej,va.Bd],null)},Tm.sb=!0,Tm.Za="cljs.core.async.impl.channels/t_cljs$core$async$impl$channels22071",Tm.Ob=function(b,d){return Qb(d,
"cljs.core.async.impl.channels/t_cljs$core$async$impl$channels22071")});return new Tm(Um,b,W)};function Vm(a,b){this.Pb=a;this.G=b}function Wm(a){return im(a.Pb)}var Xm=function Xm(b){if(null!=b&&null!=b.xc)return b.xc();var c=Xm[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Xm._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Sa("MMC.abort",b);};function Ym(a,b,c,d,e,f,g){this.Bb=a;this.bc=b;this.mb=c;this.ac=d;this.K=e;this.closed=f;this.Ja=g}
Ym.prototype.xc=function(){for(;;){var a=this.mb.pop();if(null!=a){var b=a.Pb;Rm(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(b.Fa,b,a.G,a,this))}break}Im(this.mb,He(!1));return hm(this)};
function sm(a,b,c){var d=a.closed;if(d)Um(!d);else if(x(function(){var b=a.K;return x(b)?Qa(Lm(a.K)):b}())){for(var e=Uc(a.Ja.a?a.Ja.a(a.K,b):a.Ja.call(null,a.K,b));;){if(0<a.Bb.length&&0<N(a.K)){c=a.Bb.pop();var f=c.Fa,g=a.K.K.pop();Rm(function(a,b){return function(){return a.b?a.b(b):a.call(null,b)}}(f,g,c,e,d,a))}break}e&&Xm(a);Um(!0)}else e=function(){for(;;){var b=a.Bb.pop();if(x(b)){if(x(!0))return b}else return null}}(),x(e)?(c=jm(e),Rm(function(a){return function(){return a.b?a.b(b):a.call(null,
b)}}(c,e,d,a)),Um(!0)):(64<a.ac?(a.ac=0,Im(a.mb,Wm)):a.ac+=1,Hm(a.mb,new Vm(c,b)))}
function qm(a,b){if(null!=a.K&&0<N(a.K)){for(var c=b.Fa,d=Um(a.K.K.pop());;){if(!x(Lm(a.K))){var e=a.mb.pop();if(null!=e){var f=e.Pb,g=e.G;Rm(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(f.Fa,f,g,e,c,d,a));Uc(a.Ja.a?a.Ja.a(a.K,g):a.Ja.call(null,a.K,g))&&Xm(a);continue}}break}return d}c=function(){for(;;){var b=a.mb.pop();if(x(b)){if(im(b.Pb))return b}else return null}}();if(x(c))return d=jm(c.Pb),Rm(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(d,c,a)),Um(c.G);
if(x(a.closed))return x(a.K)&&(a.Ja.b?a.Ja.b(a.K):a.Ja.call(null,a.K)),x(x(!0)?b.Fa:!0)?(c=function(){var b=a.K;return x(b)?0<N(a.K):b}(),c=x(c)?a.K.K.pop():null,Um(c)):null;64<a.bc?(a.bc=0,Im(a.Bb,im)):a.bc+=1;Hm(a.Bb,b);return null}
Ym.prototype.Yb=function(){var a=this;if(!a.closed)for(a.closed=!0,x(function(){var b=a.K;return x(b)?0===a.mb.length:b}())&&(a.Ja.b?a.Ja.b(a.K):a.Ja.call(null,a.K));;){var b=a.Bb.pop();if(null==b)break;else{var c=b.Fa,d=x(function(){var b=a.K;return x(b)?0<N(a.K):b}())?a.K.K.pop():null;Rm(function(a,b){return function(){return a.b?a.b(b):a.call(null,b)}}(c,d,b,this))}}return null};function Zm(a){console.log(a);return null}
function $m(a,b){var c=(x(null)?null:Zm).call(null,b);return null==c?a:lm.a(a,c)}
function an(a){return new Ym(Jm(32),0,Jm(32),0,a,!1,function(){return function(a){return function(){function c(c,d){try{return a.a?a.a(c,d):a.call(null,c,d)}catch(e){return $m(c,e)}}function d(c){try{return a.b?a.b(c):a.call(null,c)}catch(d){return $m(c,d)}}var e=null,e=function(a,b){switch(arguments.length){case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};e.b=d;e.a=c;return e}()}(x(null)?null.b?null.b(lm):null.call(null,lm):lm)}())};function bn(a){if(x(sc.a?sc.a(0,a):sc.call(null,0,a)))return jd;if(x(sc.a?sc.a(1,a):sc.call(null,1,a)))return new R(null,1,5,S,[new R(null,2,5,S,[0,0],null)],null);if(x(sc.a?sc.a(2,a):sc.call(null,2,a)))return new R(null,2,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[1,1],null)],null);if(x(sc.a?sc.a(3,a):sc.call(null,3,a)))return new R(null,3,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[0,0],null),new R(null,2,5,S,[1,1],null)],null);if(x(sc.a?sc.a(4,a):sc.call(null,4,a)))return new R(null,
4,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[-1,1],null),new R(null,2,5,S,[1,-1],null),new R(null,2,5,S,[1,1],null)],null);if(x(sc.a?sc.a(5,a):sc.call(null,5,a)))return new R(null,5,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[-1,1],null),new R(null,2,5,S,[0,0],null),new R(null,2,5,S,[1,-1],null),new R(null,2,5,S,[1,1],null)],null);if(x(sc.a?sc.a(6,a):sc.call(null,6,a)))return new R(null,6,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[-1,0],null),new R(null,2,5,S,[-1,1],
null),new R(null,2,5,S,[1,-1],null),new R(null,2,5,S,[1,0],null),new R(null,2,5,S,[1,1],null)],null);throw Error([A("No matching clause: "),A(a)].join(""));}var cn=Jg(function(a){return a.x},function(a){return a.y});
function dn(a){var b=P(a,0),c=P(a,1),d=Math.ceil(Math.sqrt(4)),e=b/d,f=c/d;return function(a,b,c,d,e,f,q){return function t(w){return new je(null,function(a,b,c,d,e,f,g){return function(){for(var h=w;;){var l=H(h);if(l){var m=l,n=I(m);if(l=H(function(a,b,c,d,e,f,g,h,l,m,n){return function hb(p){return new je(null,function(a,b,c,d,e,f,g,h){return function(){for(;;){var a=H(p);if(a){if(yd(a)){var c=bc(a),d=N(c),e=ne(d);a:for(var l=0;;)if(l<d){var m=eb.a(c,l),m=Q.h(h,Lj,m*f,G([rh,b*g],0));e.add(m);l+=
1}else{c=!0;break a}return c?oe(e.W(),hb(cc(a))):oe(e.W(),null)}e=I(a);return M(Q.h(h,Lj,e*f,G([rh,b*g],0)),hb(Dc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n),null,null)}}(h,n,m,l,a,b,c,d,e,f,g)(new Fg(null,0,a,1,null))))return te.a(l,t(Dc(h)));h=Dc(h)}else return null}}}(a,b,c,d,e,f,q),null,null)}}(d,e,f,new v(null,2,[ki,e,mk,f],null),a,b,c)(new Fg(null,0,d,1,null))}var en=Jg(Je(B,Sd),Je(B,Rd));
function fn(a,b){var c=P(a,0),d=P(a,1),e=P(b,0),f=P(b,1),g=sc.a(c,d)?new R(null,2,5,S,[0,1],null):new R(null,2,5,S,[c,d],null),h=P(g,0),l=P(g,1),m=(f-e)/(l-h);return function(a,b,c,d,e){return function(a){return d*a+e}}(g,h,l,m,f-m*l,a,c,d,b,e,f)}
var gn=function gn(b,c){return sc.a(1,b)?T.a(qc,c):new je(null,function(){var d=H(c);if(d){var e=P(d,0),f=Wd(d,1);return te.a(function(){return function(b,c,d,e){return function p(f){return new je(null,function(b,c){return function(){for(;;){var b=H(f);if(b){if(yd(b)){var d=bc(b),e=N(d),g=ne(e);a:for(var h=0;;)if(h<e){var l=eb.a(d,h),l=M(c,l);g.add(l);h+=1}else{d=!0;break a}return d?oe(g.W(),p(cc(b))):oe(g.W(),null)}g=I(b);return M(M(c,g),p(Dc(b)))}return null}}}(b,c,d,e),null,null)}}(d,e,f,d)(gn(b-
1,f))}(),gn(b,f))}return null},null,null)};
function hn(a){function b(a){var b=tc;H(a)?(a=Jd.b?Jd.b(a):Jd.call(null,a),b=Id(b),ua(a,b),a=H(a)):a=Ec;b=P(a,0);a=P(a,1);var c=(18-(a-b))/2,b=[b,b-c,a,a+c];a=[];for(c=0;;)if(c<b.length){var g=b[c],h=b[c+1];-1===Nf(a,g)&&(a.push(g),a.push(h));c+=2}else break;return new v(null,a.length/2,a,null)}for(;;){var c=gd(B.c(Cg,I,$e(function(){return function(a){return 0<I(a)&&18>I(a)}}(a,b),T.a(function(){return function(a){var b=S,c=B.a(Od,a);return new R(null,2,5,b,[Math.abs(c),a],null)}}(a,b),gn(2,a)))));
if(x(c))a=Ag(b(c),a);else return a}}function jn(a,b){return te.a(a,Te(N(a),b))}function kn(a,b,c){var d=null!=b&&(b.g&64||b.F)?B.a(Pc,b):b;b=C.a(d,ki);var d=C.a(d,mk),e=null!=c&&(c.g&64||c.F)?B.a(Pc,c):c;c=C.a(e,lk);var e=C.a(e,Qj),f=B.a(te,a);a=jn(e,function(){var a=T.a(I,f);return en.b?en.b(a):en.call(null,a)}());c=jn(c,function(){var a=T.a(gd,f);return en.b?en.b(a):en.call(null,a)}());return new R(null,2,5,S,[fn(a,new R(null,2,5,S,[0,b],null)),fn(c,new R(null,2,5,S,[d,0],null))],null)};function ln(a,b,c){this.key=a;this.G=b;this.forward=c;this.g=2155872256;this.C=0}ln.prototype.U=function(){return cb(cb(Ec,this.G),this.key)};ln.prototype.L=function(a,b,c){return wf(b,xf,"["," ","]",c,this)};function mn(a,b,c){c=Array(c+1);for(var d=0;;)if(d<c.length)c[d]=null,d+=1;else break;return new ln(a,b,c)}function nn(a,b,c,d){for(;;){if(0>c)return a;a:for(;;){var e=a.forward[c];if(x(e))if(e.key<b)a=e;else break a;else break a}null!=d&&(d[c]=a);--c}}
function on(a,b){this.ib=a;this.level=b;this.g=2155872256;this.C=0}on.prototype.put=function(a,b){var c=Array(15),d=nn(this.ib,a,this.level,c).forward[0];if(null!=d&&d.key===a)return d.G=b;a:for(d=0;;)if(.5>Math.random()&&15>d)d+=1;else break a;if(d>this.level){for(var e=this.level+1;;)if(e<=d+1)c[e]=this.ib,e+=1;else break;this.level=d}for(d=mn(a,b,Array(d));;)return 0<=this.level?(c=c[0].forward,d.forward[0]=c[0],c[0]=d):null};
on.prototype.remove=function(a){var b=Array(15),c=nn(this.ib,a,this.level,b).forward[0];if(null!=c&&c.key===a){for(a=0;;)if(a<=this.level){var d=b[a].forward;d[a]===c&&(d[a]=c.forward[a]);a+=1}else break;for(;;)if(0<this.level&&null==this.ib.forward[this.level])--this.level;else return null}else return null};function pn(a){for(var b=qn,c=b.ib,d=b.level;;){if(0>d)return c===b.ib?null:c;var e;a:for(e=c;;){e=e.forward[d];if(null==e){e=null;break a}if(e.key>=a)break a}null!=e?(--d,c=e):--d}}
on.prototype.U=function(){return function(a){return function c(d){return new je(null,function(){return function(){return null==d?null:M(new R(null,2,5,S,[d.key,d.G],null),c(d.forward[0]))}}(a),null,null)}}(this)(this.ib.forward[0])};on.prototype.L=function(a,b,c){return wf(b,function(){return function(a){return wf(b,xf,""," ","",c,a)}}(this),"{",", ","}",c,this)};var qn=new on(mn(null,null,0),0);
function rn(a){var b=(new Date).valueOf()+a,c=pn(b),d=x(x(c)?c.key<b+10:c)?c.G:null;if(x(d))return d;var e=an(null);qn.put(b,e);Sm(function(a,b,c){return function(){qn.remove(c);return hm(a)}}(e,d,b,c),a);return e};function sn(){var a=sc.a(1,0)?null:1;return an("number"===typeof a?new Km(Jm(a),a):a)}
(function tn(b){"undefined"===typeof gm&&(gm=function(b,d,e){this.mc=b;this.Fa=d;this.dd=e;this.g=393216;this.C=0},gm.prototype.R=function(b,d){return new gm(this.mc,this.Fa,d)},gm.prototype.P=function(){return this.dd},gm.prototype.zc=function(){return!0},gm.prototype.Ac=function(){return this.Fa},gm.cc=function(){return new R(null,3,5,S,[Rc(ak,new v(null,2,[Sh,!0,Be,qc(Ce,qc(new R(null,1,5,S,[tk],null)))],null)),tk,va.zd],null)},gm.sb=!0,gm.Za="cljs.core.async/t_cljs$core$async19240",gm.Ob=function(b,
d){return Qb(d,"cljs.core.async/t_cljs$core$async19240")});return new gm(tn,b,W)})(function(){return null});var un=X.b?X.b(W):X.call(null,W);function vn(a){return Qe.l(un,Q,Vg("animation"),a)}
function wn(){var a=1E3/30,b=sn();Rm(function(a,b){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!he(e,vi)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,tm(c),d=vi;else throw f;}if(!he(d,vi))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.m=c;d.b=b;return d}()}(function(a,b){return function(a){var c=a[1];if(7===c)return c=a,c[2]=a[2],c[1]=4,vi;if(20===c){var c=a[7],d=a[8],e=I(d),d=P(e,0),e=P(e,1),c=e.b?e.b(c):e.call(null,c);a[9]=d;a[1]=x(c)?22:23;return vi}if(1===c)return c=rn(0),pm(a,2,c);if(24===c){var d=a[8],e=a[2],c=J(d),f;a[10]=0;a[11]=e;a[12]=0;a[13]=null;a[14]=c;a[2]=null;a[1]=8;return vi}if(4===c)return c=a[2],rm(a,c);if(15===c){e=a[10];f=a[12];
var d=a[13],c=a[14],g=a[2];a[10]=e+1;a[15]=g;a[12]=f;a[13]=d;a[14]=c;a[2]=null;a[1]=8;return vi}return 21===c?(c=a[2],a[2]=c,a[1]=18,vi):13===c?(a[2]=null,a[1]=15,vi):22===c?(a[2]=null,a[1]=24,vi):6===c?(a[2]=null,a[1]=7,vi):25===c?(c=a[7],c+=b,a[16]=a[2],a[7]=c,a[2]=null,a[1]=3,vi):17===c?(a[2]=null,a[1]=18,vi):3===c?(c=K.b?K.b(un):K.call(null,un),c=H(c),a[1]=c?5:6,vi):12===c?(c=a[2],a[2]=c,a[1]=9,vi):2===c?(c=a[2],a[7]=0,a[17]=c,a[2]=null,a[1]=3,vi):23===c?(d=a[9],c=Qe.c(un,od,d),a[2]=c,a[1]=24,
vi):19===c?(d=a[8],c=bc(d),d=cc(d),e=N(c),a[10]=0,a[12]=e,a[13]=c,a[14]=d,a[2]=null,a[1]=8,vi):11===c?(c=a[14],c=H(c),a[8]=c,a[1]=c?16:17,vi):9===c?(c=a[2],d=rn(b),a[18]=c,pm(a,25,d)):5===c?(c=K.b?K.b(un):K.call(null,un),c=H(c),a[10]=0,a[12]=0,a[13]=null,a[14]=c,a[2]=null,a[1]=8,vi):14===c?(d=a[19],c=Qe.c(un,od,d),a[2]=c,a[1]=15,vi):16===c?(d=a[8],c=yd(d),a[1]=c?19:20,vi):10===c?(e=a[10],c=a[7],d=a[13],e=eb.a(d,e),d=P(e,0),e=P(e,1),c=e.b?e.b(c):e.call(null,c),a[19]=d,a[1]=x(c)?13:14,vi):18===c?(c=
a[2],a[2]=c,a[1]=12,vi):8===c?(e=a[10],f=a[12],c=e<f,a[1]=x(c)?10:11,vi):null}}(a,b),a,b)}(),f=function(){var b=e.m?e.m():e.call(null);b[6]=a;return b}();return om(f)}}(b,a));return b}function xn(a){return a*a}
function yn(a,b,c){var d=null!=c&&(c.g&64||c.F)?B.a(Pc,c):c,e=C.c(d,fk,0),f=C.a(d,yi),g=C.c(d,ti,Ld);return function(c,d,e,f,g){return function(c){if(c<=e)return!0;if(c<e+f)return c=(c-e)/f,c=g.b?g.b(c):g.call(null,c),b.a?b.a(a,c):b.call(null,a,c),!0;b.a?b.a(a,1):b.call(null,a,1);return!1}}(c,d,e,f,g)}function zn(a,b){return function(c){return vn(yn(c,a,b))}}
function An(a,b,c){return function(d){var e=function(c){return function(e,h){var l,m=a.getPointAtLength(h*c);l=cn.b?cn.b(m):cn.call(null,m);m=P(l,0);l=P(l,1);m=new R(null,2,5,S,[m,l],null);return b.a?b.a(d,m):b.call(null,d,m)}}(a.getTotalLength());return vn(yn(d,e,c))}};function Bn(a){return vg.h(G([nd([uh,Qh,wi,ij,Kj,Zj,ik,jk,kk],[999999,null,Lh,Vg("station"),jd,0,Se(4,Ue(qi)),jd,new v(null,1,[wi,Fi],null)]),B.a(Pc,a)],0))}function Cn(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;return Dn(0<b.length?new Cc(b.slice(0),0):null)}function Dn(a){return vg.h(G([new v(null,2,[Nh,jd,Ph,jd],null),B.a(Pc,a)],0))}
var En=Dn(G([bi,Fj,Ph,new R(null,6,5,S,[Bn(G([wi,li,Eh,0],0)),Bn(G([vh,0,Eh,1,Oj,!0],0)),Bn(G([vh,1,Eh,2],0)),Bn(G([vh,2,Eh,3],0)),Bn(G([vh,3,Eh,4,zj,0],0)),Bn(G([wi,Aj,vh,4],0))],null)],0)),Fn=Dn(G([bi,Th,Ph,new R(null,6,5,S,[Bn(G([wi,li,Eh,0,kk,new v(null,1,[wi,Qi],null)],0)),Bn(G([vh,0,Eh,1,kk,new v(null,1,[wi,Qi],null),Oj,!0],0)),Bn(G([vh,1,Eh,2,kk,new v(null,1,[wi,Qi],null)],0)),Bn(G([vh,2,Eh,3],0)),Bn(G([vh,3,Eh,4,kk,new v(null,1,[wi,Qi],null),zj,0],0)),Bn(G([wi,Aj,vh,4],0))],null)],0)),Gn=
Dn(G([bi,Bi,Ph,new R(null,6,5,S,[Bn(G([wi,li,Eh,0,kk,new v(null,3,[wi,Bi,xh,3,Zh,Qh],null)],0)),Bn(G([vh,0,Eh,1,kk,new v(null,1,[wi,Qi],null),Oj,!0],0)),Bn(G([vh,1,Eh,2,kk,new v(null,1,[wi,Qi],null)],0)),Bn(G([vh,2,Eh,3],0)),Bn(G([vh,3,Eh,4,kk,new v(null,1,[wi,Qi],null),zj,0],0)),Bn(G([wi,Aj,vh,4],0))],null)],0));
Dn(G([bi,Tj,Ph,new R(null,6,5,S,[Bn(G([wi,li,Eh,0,kk,new v(null,3,[wi,Bi,xh,3,Zh,Di],null)],0)),Bn(G([vh,0,Eh,1,kk,new v(null,1,[wi,Qi],null),Oj,!0],0)),Bn(G([vh,1,Eh,2,kk,new v(null,1,[wi,Qi],null)],0)),Bn(G([vh,2,Eh,3,ik,Se(6,Ue(qi))],0)),Bn(G([vh,3,Eh,4,kk,new v(null,1,[wi,Qi],null),zj,0],0)),Bn(G([wi,Aj,vh,4],0))],null)],0));var Hn=new v(null,3,[Fj,En,Th,Fn,Bi,Gn],null);function In(a){return fm(dm(cm(am(Rl(Ol(gf.c(a,ek,Sc),Ve(function(){return 6*Math.random()+1|0})))))))}function Jn(a,b){for(var c=0,d=Kl(b);;)if(c<a)c+=1,d=In(d);else return d}function Kn(a){return cf.a(W,af(Ie.a(Na,I),T.a(Jg(bi,Nh),ci.b(a))))}function Ln(a,b){var c;a:{var d=Qf(b),e=T.a(a,Rf(b));c=Ub(W);d=H(d);for(e=H(e);;)if(d&&e)c=we(c,I(d),I(e)),d=J(d),e=J(e);else{c=Wb(c);break a}}return c}
var Mn=function Mn(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Mn.h(arguments[0],1<c.length?new Cc(c.slice(1),0):null)};Mn.h=function(a,b){return Ln(function(b){return B.a(a,b)},Ln(function(a){return T.a(Zd,a)},bh(Yd,B.a(te,b))))};Mn.w=1;Mn.B=function(a){var b=I(a);a=J(a);return Mn.h(b,a)};function Nn(a){return Ln(function(a){return B.c(T,Af,a)},Ln(function(a){return T.a(Zd,a)},bh(Yd,B.a(te,a))))}
function On(a){var b=function(){var b=Kn(a);return X.b?X.b(b):X.call(null,b)}(),c=X.b?X.b(1):X.call(null,1),d=function(a,b){return function(a,c){return((K.b?K.b(b):K.call(null,b))*a+c)/((K.b?K.b(b):K.call(null,b))+1)}}(b,c);return function(a,b,c,d){return function(l){l=Ln(function(a,b,c,d,e){return function(a){return T.a(e,a)}}(a,a,b,c,d),Nn(G([K.b?K.b(a):K.call(null,a),Kn(l)],0)));Pe.a?Pe.a(a,l):Pe.call(null,a,l);Qe.a(b,Sc);return K.b?K.b(a):K.call(null,a)}}(b,c,d,function(a,b,c){return function(a){return B.c(Mn,
c,a)}}(b,c,d))};var Pn,Qn=new v(null,3,[ek,250,bj,400,ii,400],null);Pn=X.b?X.b(Qn):X.call(null,Qn);function Rn(a){this.Fa=a}Rn.prototype.bd=function(a,b,c){return this.Fa.c?this.Fa.c(a,b,c):this.Fa.call(null,a,b,c)};ba("Hook",Rn);ba("Hook.prototype.hook",Rn.prototype.bd);var Sn=new v(null,4,[Fj,kj,Th,fi,Bi,lj,Tj,Sj],null);function Tn(a){var b=P(a,0);a=P(a,1);return[A(b),A(","),A(a)].join("")}function Un(a,b,c){var d=P(a,0);P(a,1);a=P(b,0);var e=P(b,1);b=P(c,0);c=P(c,1);var d=d-a,f=(e-c)/2*(d/Math.abs(d)),g=f/2,d=new R(null,2,5,S,[a+f,e],null);a=new R(null,2,5,S,[a-g,e],null);e=new R(null,2,5,S,[b-g,c],null);b=new R(null,2,5,S,[b+f,c],null);return[A("L"),A(Tn(d)),A("C"),A(Tn(a)),A(","),A(Tn(e)),A(","),A(Tn(b))].join("")}
function Vn(a){return H(a)?B.c(A,"M",Ye(T.a(Tn,a))):null}function Wn(a,b){return[A("translate("),A(a),A(","),A(b),A(")")].join("")}
function Xn(a){var b=null!=a&&(a.g&64||a.F)?B.a(Pc,a):a,c=C.a(b,ki),d=C.a(b,mk),e=C.a(b,Lj),f=C.a(b,rh),g=C.a(b,ei),h=c/2;return new R(null,4,5,S,[Xi,new v(null,1,[Dh,Wn(h,h)],null),new R(null,2,5,S,[dk,new v(null,5,[jj,"die",Lj,-h,rh,-h,ki,c,mk,c],null)],null),function(){return function(a,b,c,d,e,f,g,h,z){return function F(L){return new je(null,function(a,b,c,d,e){return function(){for(;;){var b=H(L);if(b){if(yd(b)){var c=bc(b),d=N(c),f=ne(d);a:for(var g=0;;)if(g<d){var h=eb.a(c,g),l=P(h,0),h=P(h,
1),l=new R(null,2,5,S,[hi,new v(null,3,[hj,a.b?a.b(l):a.call(null,l),mj,a.b?a.b(h):a.call(null,h),zh,e/10],null)],null);f.add(l);g+=1}else{c=!0;break a}return c?oe(f.W(),F(cc(b))):oe(f.W(),null)}c=I(b);f=P(c,0);c=P(c,1);return M(new R(null,2,5,S,[hi,new v(null,3,[hj,a.b?a.b(f):a.call(null,f),mj,a.b?a.b(c):a.call(null,c),zh,e/10],null)],null),F(Dc(b)))}return null}}}(a,b,c,d,e,f,g,h,z),null,null)}}(Je(Pd,c/4),h,a,b,c,d,e,f,g)(bn(g))}()],null)}
function Yn(a,b){for(var c=a-10,d=jd,e=!0,f=b-10;;)if(0<f)d=te.a(d,e?new R(null,2,5,S,[new R(null,2,5,S,[c,f],null),new R(null,2,5,S,[10,f],null)],null):new R(null,2,5,S,[new R(null,2,5,S,[10,f],null),new R(null,2,5,S,[c,f],null)],null)),e=!e,f-=20;else{c=S;a:for(e=P(d,0),f=Wd(d,1),d=[A("M"),A(Tn(e))].join(""),P(f,0),P(f,1),Wd(f,2);;){var g=f,h=P(g,0),f=P(g,1),g=Wd(g,2),l;l=h;x(l)&&(l=f,l=x(l)?H(g):l);if(x(l))d=[A(d),A(Un(e,h,f))].join(""),e=f,f=g;else{d=x(h)?[A(d),A("L"),A(Tn(h))].join(""):d;break a}}return new R(null,
2,5,c,[th,new v(null,2,[jj,"penny-path",Hj,d],null)],null)}}function Zn(a,b,c){a=a.getPointAtLength(c*b+20);return cn.b?cn.b(a):cn.call(null,a)}function $n(a,b,c){var d=P(a,0);a=P(a,1);return new R(null,4,5,S,[Xi,new v(null,2,[Dh,Wn(d,a),yj,x(c)?new Rn(c):null],null),new R(null,2,5,S,[hi,new v(null,2,[jj,"penny fill",zh,8],null)],null),sc.a(b,ji)?new R(null,2,5,S,[hi,new v(null,2,[jj,"tracer",zh,4],null)],null):null],null)}
function ao(a,b,c){var d=null!=c&&(c.g&64||c.F)?B.a(Pc,c):c,e=C.a(d,ik),f=C.a(d,nk),g=C.a(d,Jh),h=C.a(d,Oh);return cb(cb(Ec,function(){var a=d.b?d.b(th):d.call(null,th);return x(a)?cb(cb(Ec,ee(Le(function(a,b,c,d,e,f,g,h,l){return function(F,L){var O=function(a,b,c,d,e,f,g){return function(b){return Zn(a,b,g)}}(a,b,c,d,e,f,g,h,l);return $n(O(F),L,0<h?zn(function(a,b,c,d,e,f,g,h,l){return function(b,c){var d;d=F-c*l;d=-1>d?-1:d;var e=a(d),f=P(e,0),e=P(e,1);b.setAttribute("transform",Wn(f,e));return sc.a(-1,
d)?b.setAttribute("transform","scale(0)"):null}}(O,a,b,c,d,e,f,g,h,l),new v(null,1,[yi,(K.b?K.b(Pn):K.call(null,Pn)).call(null,bj)],null)):null)}}(a,a,c,d,d,e,f,g,h),e))),ee(Le(function(){return function(a,b,c,d,e,f,g,h,l,F){return function(L,O){var za=Zn(b,a+L,h),E=P(za,0),ka=P(za,1);return $n(new R(null,2,5,S,[E,F],null),O,zn(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){return function(a,c){return a.setAttribute("transform",Wn(b,r+c*d))}}(za,E,ka,ka-F,a,b,c,d,e,f,g,h,l,F),new v(null,3,[yi,(K.b?K.b(Pn):
K.call(null,Pn)).call(null,ii),fk,50*L,ti,xn],null)))}}(N(e),a,a,c,d,d,e,f,g,h)}(),d.b?d.b(Pi):d.call(null,Pi)))):null}()),Yn(a,b))}
function bo(a,b,c,d){var e=b-20,f=S;a=new v(null,2,[jj,"spout",Dh,Wn(0,a)],null);var g=S,e=[A(Vn(new R(null,6,5,S,[new R(null,2,5,S,[b,-20],null),new R(null,2,5,S,[b,23],null),new R(null,2,5,S,[0,23],null),new R(null,2,5,S,[0,3],null),new R(null,2,5,S,[e,3],null),new R(null,2,5,S,[e,-20],null)],null))),A("Z")].join("");return new R(null,4,5,f,[Xi,a,new R(null,2,5,g,[th,new v(null,1,[Hj,e],null)],null),x(d)?new R(null,3,5,S,[qk,new v(null,3,[jj,"infotext fill",Dh,Wn(b/2,23),pi,-5],null),c],null):null],
null)}if("undefined"===typeof co){var co,eo=X.b?X.b(W):X.call(null,W),fo=X.b?X.b(W):X.call(null,W),go=X.b?X.b(W):X.call(null,W),ho=X.b?X.b(W):X.call(null,W),io=C.c(W,Yj,dh());co=new oh(Ac.a("pennygame.ui","station"),wi,$h,io,eo,fo,go,ho)}qh(co,li,function(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Pc,a):a,d=C.a(c,ki);C.a(c,vj);var e=C.a(c,Oh),c=C.c(c,gk,W),c=c.a?c.a(oj,0):c.call(null,oj,0);return bo(10+e,d,0===c?"In":c,b)});
qh(co,Lh,function(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Pc,a):a,d=C.a(c,ki),e=C.a(c,vj),f=Ec,g;g=c.b?c.b(Oh):c.call(null,Oh);g=bo(g,d,"",b);c=cb(cb(cb(f,g),ao(d,e,new v(null,6,[ik,c.b?c.b(ik):c.call(null,ik),nk,c.b?c.b(uh):c.call(null,uh),Jh,x(c.b?c.b(Ci):c.call(null,Ci))?c.b?c.b(Qh):c.call(null,Qh):0,Pi,x(c.b?c.b(Jj):c.call(null,Jj))?c.b?c.b(jk):c.call(null,jk):null,th,uk(c.b?c.b(ij):c.call(null,ij)),Oh,c.b?c.b(ni):c.call(null,ni)],null))),new R(null,2,5,S,[dk,new v(null,3,[jj,"bin",ki,d,mk,e],null)],
null));a:for(f=jd,g=!0,e-=20;;)if(0<e)f=id.a(f,new R(null,2,5,S,[dj,new v(null,4,[jj,"shelf",Dh,Wn(0,e),Nj,g?20:0,hk,g?d:d-20],null)],null)),g=!g,e-=20;else{d=new R(null,3,5,S,[Xi,W,B.a(qc,f)],null);break a}return cb(c,d)});
qh(co,Aj,function(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Pc,a):a,d=C.a(c,ki),e=C.a(c,ij),f=C.a(c,vj),g=C.a(c,ni),h=C.c(c,gk,W),l=C.a(c,jk),m=C.a(c,Jj),n=1/265*f*967;return cb(cb(cb(cb(Ec,x(b)?function(){var a=h.a?h.a(si,0):h.call(null,si,0),b=h.a?h.a(ui,0):h.call(null,ui,0);return new R(null,4,5,S,[Xi,W,new R(null,3,5,S,[qk,new v(null,2,[jj,"infotext fill",pi,24],null),0===b?"Delivery":b],null),new R(null,3,5,S,[qk,new v(null,4,[jj,"infotext fill",Gh,d,pi,24,sh,"end"],null),0===a?"Out":a],null)],null)}():
null),new R(null,2,5,S,[Gj,new v(null,4,[qj,truckSrc,Lj,d/2+n/2,ki,n,mk,f],null)],null)),new R(null,2,5,S,[th,new v(null,2,[jj,"ramp",Hj,[A("M"),A(Tn(new R(null,2,5,S,[10,g],null))),A("C"),A(Tn(new R(null,2,5,S,[10,f/2],null))),A(","),A(Tn(new R(null,2,5,S,[10,f/2],null))),A(","),A(Tn(new R(null,2,5,S,[d/2+n,f/2],null)))].join("")],null)],null)),function(){var b=vk(e);return x(x(b)?m:b)?Le(function(a,b,c,d,e,f,g,h,l,m,n){return function(p,na){return $n(new R(null,2,5,S,[10,h],null),na,An(a,function(){return function(a,
b){var c=P(b,0),d=P(b,1);return a.setAttribute("transform",Wn(c,d))}}(a,b,c,d,e,f,g,h,l,m,n),new v(null,3,[yi,(K.b?K.b(Pn):K.call(null,Pn)).call(null,ii),fk,50*p,ti,xn],null)))}}(b,n,a,c,d,e,f,g,h,l,m),l):null}())});
function jo(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Pc,a):a,d=C.a(c,bi),e=C.a(c,ki),f=C.a(c,mk),g=C.a(c,Lj),h=C.a(c,Ph),l=C.a(c,Nh),m=H(l)?null==l?null:wb(l):null;return x(x(g)?d:g)?new R(null,4,5,S,[Xi,new v(null,2,[jj,[A("scenario "),A(Xd(Sn.b?Sn.b(d):Sn.call(null,d)))].join(""),Dh,Wn(g,0)],null),function(){return function(a,c,d,e,f,g,h,l,m){return function O(za){return new je(null,function(a,c,d,e,f,g,h,l,m){return function(){for(;;){var c=H(za);if(c){if(yd(c)){var d=bc(c),e=N(d),f=ne(e);return function(){for(var c=
0;;)if(c<e){var g=eb.a(d,c),h=null!=g&&(g.g&64||g.F)?B.a(Pc,g):g,g=h,l=C.a(h,kk),l=null!=l&&(l.g&64||l.F)?B.a(Pc,l):l,n=C.a(l,wi),p=C.a(h,ij),q=C.a(h,rh),h=f,l=S,n=new v(null,3,[ij,p,jj,[A(Xd(n)),A(" productivity-"),A(Xd(n))].join(""),Dh,Wn(0,q)],null);H(m)&&(g=Q.c(g,gk,a));g=co.a?co.a(g,b):co.call(null,g,b);h.add(new R(null,3,5,l,[Xi,n,g],null));c+=1}else return!0}()?oe(f.W(),O(cc(c))):oe(f.W(),null)}var g=I(c),h=g=null!=g&&(g.g&64||g.F)?B.a(Pc,g):g,l=C.a(g,kk),l=null!=l&&(l.g&64||l.F)?B.a(Pc,l):
l,l=C.a(l,wi),n=C.a(g,ij),g=C.a(g,rh);return M(new R(null,3,5,S,[Xi,new v(null,3,[ij,n,jj,[A(Xd(l)),A(" productivity-"),A(Xd(l))].join(""),Dh,Wn(0,g)],null),H(m)?function(){var c=Q.c(h,gk,a);return co.a?co.a(c,b):co.call(null,c,b)}():co.a?co.a(h,b):co.call(null,h,b)],null),O(Dc(c)))}return null}}}(a,c,d,e,f,g,h,l,m),null,null)}}(m,a,c,d,e,f,g,h,l)(ee(h))}(),x(b)?function(){var a=Gi.a(m,0);return new R(null,3,5,S,[qk,new v(null,5,[jj,"infotext fill",Lj,e/2,rh,f/2,pi,26,sh,"middle"],null),0===a?"WIP":
a],null)}():null],null):null}
function ko(a,b,c){if(H(a)){var d=hn(T.a(function(a){a=hd(sk.b(a));a=b.b?b.b(a):b.call(null,a);return gd(a)},a));return function(a){return function g(d){return new je(null,function(){return function(){for(var a=d;;)if(a=H(a)){if(yd(a)){var e=bc(a),n=N(e),p=ne(n);return function(){for(var a=0;;)if(a<n){var d=eb.a(e,a),g=P(d,0),g=null!=g&&(g.g&64||g.F)?B.a(Pc,g):g,h=C.a(g,sk),d=P(d,1),g=function(){var a=hd(h);return b.b?b.b(a):b.call(null,a)}(),g=P(g,0);x(g)&&pe(p,new R(null,3,5,S,[qk,new v(null,3,
[jj,[A("label "),A("history")].join(""),Dh,Wn(g,d),pi,7],null),function(){var a=gd(hd(h));return c.b?c.b(a):c.call(null,a)}()],null));a+=1}else return!0}()?oe(p.W(),g(cc(a))):oe(p.W(),null)}var q=I(a),r=P(q,0),r=null!=r&&(r.g&64||r.F)?B.a(Pc,r):r,t=C.a(r,sk),q=P(q,1),r=function(){var a=hd(t);return b.b?b.b(a):b.call(null,a)}(),r=P(r,0);if(x(r))return M(new R(null,3,5,S,[qk,new v(null,3,[jj,[A("label "),A("history")].join(""),Dh,Wn(r,q),pi,7],null),function(){var a=gd(hd(t));return c.b?c.b(a):c.call(null,
a)}()],null),g(Dc(a)));a=Dc(a)}else return null}}(a),null,null)}}(d)(T.c(Af,a,d))}return null}
function lo(a,b,c){var d=null!=a&&(a.g&64||a.F)?B.a(Pc,a):a,e=C.a(d,ki),f=C.a(d,mk),g=C.a(d,Lj),h=C.a(d,rh),l=null!=c&&(c.g&64||c.F)?B.a(Pc,c):c,m=C.a(l,Ki),n=C.a(l,lk),p=C.a(l,Li),q=C.c(l,di,Ld),r=f-60,t=function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w){return function Da(t){return new je(null,function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w){return function(){for(;;){var z=H(t);if(z){var D=z;if(yd(D)){var E=bc(D),F=N(E),L=ne(F);return function(){for(var t=0;;)if(t<F){var O=eb.a(E,t),U=P(O,0),V=P(O,
1);pe(L,new v(null,2,[Hh,Sn.b?Sn.b(U):Sn.call(null,U),sk,Le(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,t,z,D,E,F,L){return function(a,b){return new R(null,2,5,S,[a,L.b?L.b(b):L.call(null,b)],null)}}(t,O,U,V,E,F,L,D,z,a,b,c,d,e,f,g,h,l,m,n,p,q,r,w),V)],null));t+=1}else return!0}()?oe(L.W(),Da(cc(D))):oe(L.W(),null)}var O=I(D),U=P(O,0),V=P(O,1);return M(new v(null,2,[Hh,Sn.b?Sn.b(U):Sn.call(null,U),sk,Le(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,t,z){return function(a,b){return new R(null,2,5,S,[a,z.b?z.b(b):
z.call(null,b)],null)}}(O,U,V,D,z,a,b,c,d,e,f,g,h,l,m,n,p,q,r,w),V)],null),Da(Dc(D)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w),null,null)}}(30,50,r,a,d,e,f,g,h,c,l,m,n,p,q)(b)}(),w=kn(T.a(sk,t),new v(null,2,[ki,e-100,mk,r],null),new v(null,2,[Qj,jd,lk,n],null)),z=P(w,0),D=P(w,1),F=function(a,b,c,d,e,f,g){return function(a){return new R(null,2,5,S,[function(){var b=I(a);return f.b?f.b(b):f.call(null,b)}(),function(){var b=gd(a);return g.b?g.b(b):g.call(null,b)}()],null)}}(30,50,r,t,w,z,D,a,d,
e,f,g,h,c,l,m,n,p,q);return new R(null,5,5,S,[Xi,new v(null,2,[jj,"graph",Dh,Wn(g,h)],null),new R(null,2,5,S,[dk,new v(null,2,[ki,e,mk,f],null)],null),new R(null,3,5,S,[qk,new v(null,4,[jj,"title",Lj,e/2,rh,f/2,pi,10],null),p],null),new R(null,7,5,S,[Xi,new v(null,1,[Dh,Wn(50,30)],null),function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,t,z,D,F,Va){return function ib(Bb){return new je(null,function(a,b,c,d,e,f,g,h){return function(){for(;;){var a=H(Bb);if(a){if(yd(a)){var b=bc(a),c=N(b),d=ne(c);
a:for(var e=0;;)if(e<c){var f=eb.a(b,e),f=null!=f&&(f.g&64||f.F)?B.a(Pc,f):f;C.a(f,Hh);f=C.a(f,sk);f=new R(null,2,5,S,[th,new v(null,2,[jj,"stroke outline",Hj,Vn(T.a(h,f))],null)],null);d.add(f);e+=1}else{b=!0;break a}return b?oe(d.W(),ib(cc(a))):oe(d.W(),null)}d=I(a);d=null!=d&&(d.g&64||d.F)?B.a(Pc,d):d;C.a(d,Hh);d=C.a(d,sk);return M(new R(null,2,5,S,[th,new v(null,2,[jj,"stroke outline",Hj,Vn(T.a(h,d))],null)],null),ib(Dc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,t,z,D,F,Va),null,null)}}(30,
50,r,t,w,z,D,F,a,d,e,f,g,h,c,l,m,n,p,q)(t)}(),function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,t,z,D,F,Va){return function ib(Bb){return new je(null,function(a,b,c,d,e,f,g,h){return function(){for(;;){var a=H(Bb);if(a){if(yd(a)){var b=bc(a),c=N(b),d=ne(c);a:for(var e=0;;)if(e<c){var f=eb.a(b,e),g=null!=f&&(f.g&64||f.F)?B.a(Pc,f):f,f=C.a(g,Hh),g=C.a(g,sk),f=new R(null,2,5,S,[th,new v(null,2,[jj,[A("history stroke "),A(Xd(f))].join(""),Hj,Vn(T.a(h,g))],null)],null);d.add(f);e+=1}else{b=!0;break a}return b?
oe(d.W(),ib(cc(a))):oe(d.W(),null)}d=I(a);b=null!=d&&(d.g&64||d.F)?B.a(Pc,d):d;d=C.a(b,Hh);b=C.a(b,sk);return M(new R(null,2,5,S,[th,new v(null,2,[jj,[A("history stroke "),A(Xd(d))].join(""),Hj,Vn(T.a(h,b))],null)],null),ib(Dc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,t,z,D,F,Va),null,null)}}(30,50,r,t,w,z,D,F,a,d,e,f,g,h,c,l,m,n,p,q)(t)}(),ko(t,F,q),new R(null,2,5,S,[dj,new v(null,3,[jj,"axis",Dh,Wn(0,r),hk,e-100],null)],null),new R(null,2,5,S,[dj,new v(null,2,[jj,"axis",Vj,r],null)],null)],
null)],null)}function mo(a,b){var c=dn(a),d=P(c,0),e=P(c,1),f=P(c,2),c=P(c,3);return new R(null,6,5,S,[Xi,new v(null,1,[ij,"graphs"],null),lo(d,b,new v(null,3,[Li,"Total Input",Ki,oj,di,Math.round],null)),lo(e,b,new v(null,3,[Li,"Total Output",Ki,si,di,Math.round],null)),lo(f,b,new v(null,4,[Li,"Work in Progress",Ki,Gi,lk,new R(null,1,5,S,[0],null),di,Math.round],null)),lo(c,b,new v(null,3,[Li,"Days to Delivery",Ki,ui,di,Math.round],null))],null)}
function no(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Pc,a):a,d=C.a(c,Ri),e=null!=d&&(d.g&64||d.F)?B.a(Pc,d):d,f=C.a(e,ek),g=C.a(e,Hi),h=C.a(c,Zi),l=C.a(c,Uh),m=C.a(c,Kh);return new R(null,4,5,S,[Ti,new v(null,1,[ij,"controls"],null),new R(null,9,5,S,[gi,new v(null,1,[Ii,"slidden"],null),new R(null,3,5,S,[Wh,new v(null,1,[oi,function(){return function(){return b.c?b.c(Ah,1,!0):b.call(null,Ah,1,!0)}}(a,c,d,e,f,g,h,l,m)],null),"Roll"],null),new R(null,3,5,S,[Wh,new v(null,1,[oi,function(){return function(){return b.c?
b.c(Ah,100,!0):b.call(null,Ah,100,!0)}}(a,c,d,e,f,g,h,l,m)],null),"Run"],null),new R(null,3,5,S,[Wh,new v(null,1,[oi,function(){return function(){return b.c?b.c(Ah,100,!1):b.call(null,Ah,100,!1)}}(a,c,d,e,f,g,h,l,m)],null),"Run Fast"],null),new R(null,3,5,S,[Wh,new v(null,1,[oi,function(){return function(){return b.a?b.a(zi,100):b.call(null,zi,100)}}(a,c,d,e,f,g,h,l,m)],null),"Run Instantly"],null),new R(null,3,5,S,[Wh,new v(null,1,[oi,function(a,c,d,e,f,g,h){return function(){var a=Qa(h);return b.a?
b.a(uj,a):b.call(null,uj,a)}}(a,c,d,e,f,g,h,l,m)],null),x(h)?"Hide info":"Show info"],null),new R(null,3,5,S,[Wh,new v(null,1,[oi,function(a,c,d,e,f,g,h,l){return function(){var a=Qa(l);return b.a?b.a(Ej,a):b.call(null,Ej,a)}}(a,c,d,e,f,g,h,l,m)],null),x(l)?"Hide graphs":"Show graphs"],null),x(l)?new R(null,3,5,S,[Wh,new v(null,2,[Rh,function(){var a=0===f;return a?a:m}(),oi,function(a,c,d,e,f,g){return function(){var a=Qa(g);return b.a?b.a(Hi,a):b.call(null,Hi,a)}}(a,c,d,e,f,g,h,l,m)],null),x(g)?
"Hide averages":"Average"],null):null],null),new R(null,5,5,S,[gi,new v(null,1,[Ii,"slidden"],null),new R(null,3,5,S,[Wh,new v(null,1,[oi,function(){return function(){return b.c?b.c(rj,Fj,0):b.call(null,rj,Fj,0)}}(a,c,d,e,f,g,h,l,m)],null),"Basic"],null),new R(null,3,5,S,[Wh,new v(null,1,[oi,function(){return function(){return b.c?b.c(rj,Th,1):b.call(null,rj,Th,1)}}(a,c,d,e,f,g,h,l,m)],null),"Efficient"],null),new R(null,3,5,S,[Wh,new v(null,1,[oi,function(){return function(){return b.c?b.c(rj,Bi,
2):b.call(null,rj,Bi,2)}}(a,c,d,e,f,g,h,l,m)],null),"Constrained"],null)],null)],null)}
function oo(){var a=K.b?K.b(po):K.call(null,po),b=Z,c=null!=a&&(a.g&64||a.F)?B.a(Pc,a):a,d=C.a(c,Ri),e=null!=d&&(d.g&64||d.F)?B.a(Pc,d):d,f=C.a(e,ki),g=C.a(e,mk),h=C.a(e,ek),l=C.a(e,Uj),m=C.a(e,ci),n=C.a(e,Hi),p=C.a(c,Zi),q=C.a(c,Uh);return new R(null,5,5,S,[Xj,W,new R(null,3,5,S,[Ti,new v(null,1,[Si,new v(null,3,[Dj,Tj,ok,"5px",Xh,"5px"],null)],null),new R(null,4,5,S,[Ti,W,new R(null,3,5,S,[rk,W,h],null)," days"],null)],null),no(c,b),new R(null,5,5,S,[tj,new v(null,3,[ij,"space",ki,"100%",mk,"99%"],
null),function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q,V){return function ia(ja){return new je(null,function(){return function(){for(;;){var a=H(ja);if(a){if(yd(a)){var b=bc(a),c=N(b),d=ne(c);a:for(var e=0;;)if(e<c){var f=eb.a(b,e),g=null!=f&&(f.g&64||f.F)?B.a(Pc,f):f,f=g,h=C.a(g,Lj),g=C.a(g,rh),f=x(h)?new R(null,3,5,S,[Xi,new v(null,1,[Dh,Wn(h,g)],null),Xn(f)],null):null;d.add(f);e+=1}else{b=!0;break a}return b?oe(d.W(),ia(cc(a))):oe(d.W(),null)}d=I(a);d=c=null!=d&&(d.g&64||d.F)?B.a(Pc,d):d;
b=C.a(c,Lj);c=C.a(c,rh);return M(x(b)?new R(null,3,5,S,[Xi,new v(null,1,[Dh,Wn(b,c)],null),Xn(d)],null):null,ia(Dc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,V),null,null)}}(a,c,c,d,e,e,f,g,h,l,m,n,p,q)(l)}(),T.a(function(a,b,c,d,e,f,g,h,l,m,n,p,q){return function(a){return jo(a,q)}}(a,c,c,d,e,e,f,g,h,l,m,n,p,q),m),x(x(f)?x(g)?q:g:f)?mo(new R(null,2,5,S,[f,g],null),x(n)?n:Kn(e)):null],null)],null)};xa=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new Cc(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,La.b?La.b(a):La.call(null,a))}a.w=0;a.B=function(a){a=H(a);return b(a)};a.h=b;return a}();
Aa=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new Cc(e,0)}return b.call(this,d)}function b(a){return console.error.apply(console,La.b?La.b(a):La.call(null,a))}a.w=0;a.B=function(a){a=H(a);return b(a)};a.h=b;return a}();
function qo(a){var b="undefined"!==typeof document.hidden?"visibilitychange":"undefined"!==typeof document.webkitHidden?"webkitvisibilitychange":"undefined"!==typeof document.mozHidden?"mozvisibilitychange":"undefined"!==typeof document.msHidden?"msvisibilitychange":null;return document.addEventListener(b,function(b){return function e(){a.m?a.m():a.call(null);return document.removeEventListener(b,e)}}(b))}
function ro(a,b){var c=null!=b&&(b.g&64||b.F)?B.a(Pc,b):b,d=C.a(c,ki),e=C.a(c,Lj),f=Te(1,Ph.b(I($e(bi,ci.b(a))))),g=T.a(mk,f),h=T.a(rh,f);return gf.A(a,Uj,Je(T,function(a,b,c,d,e,f,g){return function(a,b,c){return Q.h(a,Lj,g,G([rh,b+c+(0-f/2-20),ki,f,mk,f],0))}}(f,g,h,b,c,d,e)),h,g)}if("undefined"===typeof po){var po,so=new v(null,1,[ci,new R(null,3,5,S,[null,null,null],null)],null);po=X.b?X.b(so):X.call(null,so)}
if("undefined"===typeof Z)var Z=function(){var a=X.b?X.b(W):X.call(null,W),b=X.b?X.b(W):X.call(null,W),c=X.b?X.b(W):X.call(null,W),d=X.b?X.b(W):X.call(null,W),e=C.c(W,Yj,dh());return new oh(Ac.a("pennygame.core","emit"),function(){return function(){function a(b,c){if(1<arguments.length)for(var d=0,e=Array(arguments.length-1);d<e.length;)e[d]=arguments[d+1],++d;return b}a.w=1;a.B=function(a){var b=I(a);Dc(a);return b};a.h=function(a){return a};return a}()}(a,b,c,d,e),$h,e,a,b,c,d)}();
function to(a,b){var c=sn();Rm(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!he(e,vi)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,tm(c),d=vi;else throw f;}if(!he(d,vi))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.m=c;d.b=b;return d}()}(function(){return function(c){var d=c[1];if(7===d)return c[2]=null,c[1]=8,vi;if(1===d){var d=Z.b?Z.b(Cj):Z.call(null,Cj),e=Z.b?Z.b(wh):Z.call(null,wh);c[7]=e;c[8]=d;c[1]=x(b)?2:3;return vi}if(4===d){var d=c[2],e=Z.b?Z.b(Bj):Z.call(null,Bj),f=Z.b?Z.b($i):Z.call(null,$i),n=Z.b?Z.b(aj):Z.call(null,aj);c[9]=d;c[10]=f;c[11]=e;c[12]=n;c[1]=x(b)?6:7;return vi}return 15===d?(d=Z.a?Z.a(Mi,!1):Z.call(null,
Mi,!1),c[2]=d,c[1]=16,vi):13===d?(d=c[2],c[2]=d,c[1]=12,vi):6===d?(d=Z.a?Z.a(Pi,!0):Z.call(null,Pi,!0),e=wn(),c[13]=d,pm(c,9,e)):3===d?(c[2]=null,c[1]=4,vi):12===d?(d=c[14],d=a-1,c[15]=c[2],c[14]=d,c[1]=x(0<d)?14:15,vi):2===d?(d=Z.a?Z.a(Jh,!0):Z.call(null,Jh,!0),e=wn(),c[16]=d,pm(c,5,e)):11===d?(d=K.b?K.b(Pn):K.call(null,Pn),d=d.b?d.b(ek):d.call(null,ek),d=rn(d),pm(c,13,d)):9===d?(e=c[2],d=Z.a?Z.a(Pi,!1):Z.call(null,Pi,!1),c[17]=e,c[2]=d,c[1]=8,vi):5===d?(e=c[2],d=Z.a?Z.a(Jh,!1):Z.call(null,Jh,!1),
c[18]=e,c[2]=d,c[1]=4,vi):14===d?(d=c[14],d=Z.c?Z.c(Mj,d,b):Z.call(null,Mj,d,b),c[2]=d,c[1]=16,vi):16===d?(d=c[2],rm(c,d)):10===d?(c[2]=null,c[1]=12,vi):8===d?(d=c[2],e=Z.b?Z.b(ck):Z.call(null,ck),f=Z.b?Z.b(Yi):Z.call(null,Yi),c[19]=d,c[20]=f,c[21]=e,c[1]=x(b)?10:11,vi):null}}(c),c)}(),f=function(){var a=e.m?e.m():e.call(null);a[6]=c;return a}();return om(f)}}(c))}
var uo=function uo(){var b=sn();Rm(function(b){return function(){var d=function(){return function(b){return function(){function c(d){for(;;){var e;a:try{for(;;){var g=b(d);if(!he(g,vi)){e=g;break a}}}catch(h){if(h instanceof Object)d[5]=h,tm(d),e=vi;else throw h;}if(!he(e,vi))return e}}function d(){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];b[0]=e;b[1]=1;return b}var e=null,e=function(b){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,
b)}throw Error("Invalid arity: "+arguments.length);};e.m=d;e.b=c;return e}()}(function(b){return function(c){var d=c[1];if(7===d){var e=c[7],e=e.getBoundingClientRect();c[2]=e;c[1]=8;return vi}if(1===d)return e=rn(50),pm(c,2,e);if(4===d)return e=document.getElementById("space"),c[2]=e,c[1]=5,vi;if(15===d){var e=c[2],m=Z.b?Z.b(Wj):Z.call(null,Wj),n=rn(100);c[8]=m;c[9]=e;return pm(c,16,n)}if(13===d)return e=qo(uo),c[2]=e,c[1]=14,vi;if(6===d)return c[2]=null,c[1]=8,vi;if(3===d)return c[2]=null,c[1]=
5,vi;if(12===d)return e=c[10],m=c[11],e=Z.c?Z.c(Ji,m,e):Z.call(null,Ji,m,e),m=rn(100),c[12]=e,pm(c,15,m);if(2===d){var p=c[2],q=function(){return function(){return function(b){return b.width}}(p,d,b)}(),e=Jg(q,function(){return function(){return function(b){return b.height}}(p,q,d,b)}()),m=null==document;c[13]=e;c[14]=p;c[1]=x(m)?3:4;return vi}return 11===d?(n=c[2],m=P(n,0),e=P(n,1),c[10]=e,c[11]=m,c[1]=x(n)?12:13,vi):9===d?(c[2]=null,c[1]=11,vi):5===d?(e=c[7],e=c[2],c[7]=e,c[1]=x(null==e)?6:7,vi):
14===d?(e=c[2],rm(c,e)):16===d?(m=c[2],e=Z.b?Z.b(aj):Z.call(null,aj),c[15]=m,c[2]=e,c[1]=14,vi):10===d?(e=c[13],m=c[16],e=e.b?e.b(m):e.call(null,m),c[2]=e,c[1]=11,vi):8===d?(m=c[16],e=c[2],c[16]=e,c[1]=x(null==e)?9:10,vi):null}}(b),b)}(),e=function(){var e=d.m?d.m():d.call(null);e[6]=b;return e}();return om(e)}}(b));return b};
function vo(){var a=Ei.b(K.b?K.b(po):K.call(null,po)),b=Ri.b(K.b?K.b(po):K.call(null,po)),c=On(b),d=b.b?b.b(ek):b.call(null,ek),e=sn();Rm(function(c,d,e,l){return function(){var m=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!he(e,vi)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,tm(c),d=vi;else throw f;}if(!he(d,vi))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=
null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.m=c;d.b=b;return d}()}(function(c,d,e,f){return function(c){var g=c[1];if(1===g){var g=Kn(b),g=Z.a?Z.a(Ij,g):Z.call(null,Ij,g),h=rn(f);c[7]=g;return pm(c,2,h)}return 2===g?(c[8]=c[2],c[9]=0,c[2]=null,c[1]=3,vi):3===g?(g=c[9],c[1]=x(50>g)?5:6,vi):4===g?(g=c[2],rm(c,g)):5===g?(g=Jn(e,a),g=d.b?d.b(g):d.call(null,g),g=Z.a?Z.a(Ij,g):Z.call(null,Ij,g),h=
rn(f),c[10]=g,pm(c,8,h)):6===g?(c[2]=null,c[1]=7,vi):7===g?(g=c[2],c[2]=g,c[1]=4,vi):8===g?(g=c[9],c[11]=c[2],c[9]=g+1,c[2]=null,c[1]=3,vi):null}}(c,d,e,l),c,d,e,l)}(),n=function(){var a=m.m?m.m():m.call(null);a[6]=c;return a}();return om(n)}}(e,c,d,100))}function wo(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;return xo(0<b.length?new Cc(b.slice(0),0):null)}function xo(a){return vg.h(G([new v(null,2,[ei,0,wi,Lh],null),B.a(Pc,a)],0))}
qh(Z,rj,function(a,b,c){uo();return Qe.a(po,function(a){var e=gf.c(a.b?a.b(ci):a.call(null,ci),c,function(a){return x(a)?null:Hn.b?Hn.b(b):Hn.call(null,b)}),f=Kl(new v(null,3,[ek,0,Uj,new R(null,5,5,S,[xo(G([wi,li],0)),wo(),wo(),wo(),wo()],null),ci,T.a(function(){return function(a){return x(a)?a:Cn()}}(e),e)],null));return Q.h(a,Ri,f,G([Ei,f,ci,e,Kh,!1],0))})});
qh(Z,Ji,function(a,b,c){return Qe.a(po,function(a){return function(e){return gf.l(ff.c(ef(ef(e,new R(null,2,5,S,[Ri,ki],null),b),new R(null,2,5,S,[Ri,mk],null),c),new R(null,2,5,S,[Ri,ci],null),Je(Il,new v(null,3,[Lj,a,ki,b-a,mk,c],null))),Ri,ro,new v(null,2,[Lj,45,ki,a-90],null))}}(150))});qh(Z,Wj,function(){return Qe.h(po,gf,Ri,Ml,G([function(a){a=null!=a&&(a.g&64||a.F)?B.a(Pc,a):a;var b=C.a(a,ij),b=uk(b);return x(b)?Q.c(a,wj,b.getTotalLength()):a}],0))});
qh(Z,aj,function(){return Qe.l(po,gf,Ri,bm)});qh(Z,Cj,function(){return Qe.a(po,function(a){return gf.l(ff.c(a,new R(null,2,5,S,[Ri,ek],null),Sc),Ri,Ol,Ve(function(){return 6*Math.random()+1|0}))})});qh(Z,Ah,function(a,b,c){to(b,c);return Qe.l(po,Q,Kh,!0)});qh(Z,wh,function(){return Qe.l(po,gf,Ri,Rl)});qh(Z,Jh,function(a,b){return Qe.h(po,gf,Ri,Ml,G([function(a){return Q.c(a,Ci,b)}],0))});qh(Z,Bj,function(){return Qe.l(po,gf,Ri,am)});qh(Z,$i,function(){return Qe.l(po,gf,Ri,cm)});
qh(Z,Pi,function(a,b){return Qe.h(po,gf,Ri,Ml,G([function(a){return Q.c(a,Jj,b)}],0))});qh(Z,ck,function(){return Qe.l(po,gf,Ri,dm)});qh(Z,Yi,function(){return Qe.l(po,gf,Ri,fm)});qh(Z,Mi,function(a,b){return Qe.l(po,Q,Kh,b)});qh(Z,Mj,function(a,b,c){x((K.b?K.b(po):K.call(null,po)).call(null,Kh))&&to(b,c);return K.b?K.b(po):K.call(null,po)});qh(Z,zi,function(a,b){return Qe.l(po,gf,Ri,function(a){return Jn(b,a)})});qh(Z,uj,function(a,b){return Qe.l(po,Q,Zi,b)});
qh(Z,Ej,function(a,b){return Qe.l(po,Q,Uh,b)});qh(Z,Hi,function(a,b){return x(b)?(vo(),K.b?K.b(po):K.call(null,po)):Qe.h(po,gf,Ri,od,G([Hi],0))});qh(Z,Ij,function(a,b){return Qe.l(po,ef,new R(null,2,5,S,[Ri,Hi],null),b)});if("undefined"===typeof yo)var yo=function(a){return function(){var b=oo();return a.b?a.b(b):a.call(null,b)}}(Cm());if("undefined"===typeof zo){var zo,Ao=po;Tb(Ao,Pj,function(a,b,c,d){return yo.b?yo.b(d):yo.call(null,d)});zo=Ao}
if("undefined"===typeof Bo){var Bo;Z.c?Z.c(rj,Fj,0):Z.call(null,rj,Fj,0);Z.c?Z.c(rj,Th,1):Z.call(null,rj,Th,1);Bo=Z.c?Z.c(rj,Bi,2):Z.call(null,rj,Bi,2)}var Co=K.b?K.b(po):K.call(null,po);yo.b?yo.b(Co):yo.call(null,Co);