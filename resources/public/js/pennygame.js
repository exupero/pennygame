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
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function ca(a){return"function"==u(a)}function da(a){return a[ea]||(a[ea]=++fa)}var ea="closure_uid_"+(1E9*Math.random()>>>0),fa=0;function ga(a,b,c){return a.call.apply(a.bind,arguments)}
function ma(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function pa(a,b,c){pa=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ga:ma;return pa.apply(null,arguments)}var qa=Date.now||function(){return+new Date};Math.random();function ra(a,b){for(var c in a)b.call(void 0,a[c],c,a)};function sa(a,b){null!=a&&this.append.apply(this,arguments)}k=sa.prototype;k.cb="";k.set=function(a){this.cb=""+a};k.append=function(a,b,c){this.cb+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.cb+=arguments[d];return this};k.clear=function(){this.cb=""};k.toString=function(){return this.cb};function ta(a,b){a.sort(b||va)}function wa(a,b){for(var c=0;c<a.length;c++)a[c]={index:c,value:a[c]};var d=b||va;ta(a,function(a,b){return d(a.value,b.value)||a.index-b.index});for(c=0;c<a.length;c++)a[c]=a[c].value}function va(a,b){return a>b?1:a<b?-1:0};var xa={},ya;if("undefined"===typeof Ba)var Ba=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof Ea)var Ea=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var Fa=!0,Ga=null;if("undefined"===typeof Ha)var Ha=null;function Ia(){return new v(null,5,[Ja,!0,Ka,!0,La,!1,Ma,!1,Na,null],null)}Oa;function w(a){return null!=a&&!1!==a}Pa;x;function Qa(a){return null==a}function Ra(a){return a instanceof Array}
function Sa(a){return null==a?!0:!1===a?!0:!1}function Ta(a,b){return a[u(null==b?null:b)]?!0:a._?!0:!1}function Ua(a,b){var c=null==b?null:b.constructor,c=w(w(c)?c.tb:c)?c.Za:u(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function Wa(a){var b=a.Za;return w(b)?b:""+z(a)}var Ya="undefined"!==typeof Symbol&&"function"===u(Symbol)?Symbol.iterator:"@@iterator";function Za(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}B;$a;
var Oa=function Oa(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Oa.b(arguments[0]);case 2:return Oa.a(arguments[0],arguments[1]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};Oa.b=function(a){return Oa.a(null,a)};Oa.a=function(a,b){function c(a,b){a.push(b);return a}var d=[];return $a.c?$a.c(c,d,b):$a.call(null,c,d,b)};Oa.v=2;function ab(){}function bb(){}
var cb=function cb(b){if(null!=b&&null!=b.Z)return b.Z(b);var c=cb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=cb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("ICounted.-count",b);},db=function db(b){if(null!=b&&null!=b.ca)return b.ca(b);var c=db[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=db._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("IEmptyableCollection.-empty",b);};function eb(){}
var fb=function fb(b,c){if(null!=b&&null!=b.X)return b.X(b,c);var d=fb[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=fb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ua("ICollection.-conj",b);};function gb(){}
var hb=function hb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return hb.a(arguments[0],arguments[1]);case 3:return hb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};
hb.a=function(a,b){if(null!=a&&null!=a.ba)return a.ba(a,b);var c=hb[u(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=hb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Ua("IIndexed.-nth",a);};hb.c=function(a,b,c){if(null!=a&&null!=a.Ea)return a.Ea(a,b,c);var d=hb[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=hb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Ua("IIndexed.-nth",a);};hb.v=3;function kb(){}
var lb=function lb(b){if(null!=b&&null!=b.ta)return b.ta(b);var c=lb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=lb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("ISeq.-first",b);},mb=function mb(b){if(null!=b&&null!=b.xa)return b.xa(b);var c=mb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=mb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("ISeq.-rest",b);};function nb(){}function ob(){}
var pb=function pb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return pb.a(arguments[0],arguments[1]);case 3:return pb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};
pb.a=function(a,b){if(null!=a&&null!=a.N)return a.N(a,b);var c=pb[u(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=pb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Ua("ILookup.-lookup",a);};pb.c=function(a,b,c){if(null!=a&&null!=a.I)return a.I(a,b,c);var d=pb[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=pb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Ua("ILookup.-lookup",a);};pb.v=3;function qb(){}
var rb=function rb(b,c){if(null!=b&&null!=b.hc)return b.hc(b,c);var d=rb[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=rb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ua("IAssociative.-contains-key?",b);},sb=function sb(b,c,d){if(null!=b&&null!=b.Ra)return b.Ra(b,c,d);var e=sb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=sb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ua("IAssociative.-assoc",b);};function tb(){}
var ub=function ub(b,c){if(null!=b&&null!=b.sb)return b.sb(b,c);var d=ub[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=ub._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ua("IMap.-dissoc",b);};function vb(){}
var wb=function wb(b){if(null!=b&&null!=b.Ib)return b.Ib(b);var c=wb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=wb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("IMapEntry.-key",b);},xb=function xb(b){if(null!=b&&null!=b.Jb)return b.Jb(b);var c=xb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=xb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("IMapEntry.-val",b);};function yb(){}
var zb=function zb(b){if(null!=b&&null!=b.eb)return b.eb(b);var c=zb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=zb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("IStack.-peek",b);};function Bb(){}
var Cb=function Cb(b,c,d){if(null!=b&&null!=b.fb)return b.fb(b,c,d);var e=Cb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Cb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ua("IVector.-assoc-n",b);},Eb=function Eb(b){if(null!=b&&null!=b.Fb)return b.Fb(b);var c=Eb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Eb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("IDeref.-deref",b);};function Fb(){}
var Gb=function Gb(b){if(null!=b&&null!=b.P)return b.P(b);var c=Gb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Gb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("IMeta.-meta",b);},Hb=function Hb(b,c){if(null!=b&&null!=b.R)return b.R(b,c);var d=Hb[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Hb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ua("IWithMeta.-with-meta",b);};function Ib(){}
var Jb=function Jb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Jb.a(arguments[0],arguments[1]);case 3:return Jb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};
Jb.a=function(a,b){if(null!=a&&null!=a.ea)return a.ea(a,b);var c=Jb[u(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=Jb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Ua("IReduce.-reduce",a);};Jb.c=function(a,b,c){if(null!=a&&null!=a.fa)return a.fa(a,b,c);var d=Jb[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=Jb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Ua("IReduce.-reduce",a);};Jb.v=3;
var Kb=function Kb(b,c,d){if(null!=b&&null!=b.Hb)return b.Hb(b,c,d);var e=Kb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Kb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ua("IKVReduce.-kv-reduce",b);},Lb=function Lb(b,c){if(null!=b&&null!=b.D)return b.D(b,c);var d=Lb[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Lb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ua("IEquiv.-equiv",b);},Mb=function Mb(b){if(null!=b&&null!=b.S)return b.S(b);
var c=Mb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Mb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("IHash.-hash",b);};function Nb(){}var Ob=function Ob(b){if(null!=b&&null!=b.U)return b.U(b);var c=Ob[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Ob._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("ISeqable.-seq",b);};function Pb(){}function Qb(){}function Rb(){}
var Sb=function Sb(b){if(null!=b&&null!=b.Zb)return b.Zb(b);var c=Sb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Sb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("IReversible.-rseq",b);},Tb=function Tb(b,c){if(null!=b&&null!=b.xc)return b.xc(0,c);var d=Tb[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Tb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ua("IWriter.-write",b);},Ub=function Ub(b,c,d){if(null!=b&&null!=b.L)return b.L(b,c,d);
var e=Ub[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Ub._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ua("IPrintWithWriter.-pr-writer",b);},Vb=function Vb(b,c,d){if(null!=b&&null!=b.wc)return b.wc(0,c,d);var e=Vb[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Vb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ua("IWatchable.-notify-watches",b);},Wb=function Wb(b,c,d){if(null!=b&&null!=b.vc)return b.vc(0,c,d);var e=Wb[u(null==
b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Wb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ua("IWatchable.-add-watch",b);},Xb=function Xb(b){if(null!=b&&null!=b.qb)return b.qb(b);var c=Xb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Xb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("IEditableCollection.-as-transient",b);},Yb=function Yb(b,c){if(null!=b&&null!=b.Nb)return b.Nb(b,c);var d=Yb[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,
c):d.call(null,b,c);d=Yb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ua("ITransientCollection.-conj!",b);},Zb=function Zb(b){if(null!=b&&null!=b.Ob)return b.Ob(b);var c=Zb[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Zb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("ITransientCollection.-persistent!",b);},$b=function $b(b,c,d){if(null!=b&&null!=b.Mb)return b.Mb(b,c,d);var e=$b[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=$b._;if(null!=
e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ua("ITransientAssociative.-assoc!",b);},ac=function ac(b,c,d){if(null!=b&&null!=b.uc)return b.uc(0,c,d);var e=ac[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=ac._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ua("ITransientVector.-assoc-n!",b);};function bc(){}
var cc=function cc(b,c){if(null!=b&&null!=b.pb)return b.pb(b,c);var d=cc[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=cc._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ua("IComparable.-compare",b);},dc=function dc(b){if(null!=b&&null!=b.rc)return b.rc();var c=dc[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=dc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("IChunk.-drop-first",b);},ec=function ec(b){if(null!=b&&null!=b.jc)return b.jc(b);
var c=ec[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ec._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("IChunkedSeq.-chunked-first",b);},fc=function fc(b){if(null!=b&&null!=b.kc)return b.kc(b);var c=fc[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=fc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("IChunkedSeq.-chunked-rest",b);},gc=function gc(b){if(null!=b&&null!=b.ic)return b.ic(b);var c=gc[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,
b);c=gc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("IChunkedNext.-chunked-next",b);},hc=function hc(b){if(null!=b&&null!=b.Kb)return b.Kb(b);var c=hc[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=hc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("INamed.-name",b);},ic=function ic(b){if(null!=b&&null!=b.Lb)return b.Lb(b);var c=ic[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ic._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("INamed.-namespace",
b);},jc=function jc(b,c){if(null!=b&&null!=b.Wc)return b.Wc(b,c);var d=jc[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=jc._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ua("IReset.-reset!",b);},kc=function kc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return kc.a(arguments[0],arguments[1]);case 3:return kc.c(arguments[0],arguments[1],arguments[2]);case 4:return kc.l(arguments[0],arguments[1],arguments[2],
arguments[3]);case 5:return kc.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};kc.a=function(a,b){if(null!=a&&null!=a.Yc)return a.Yc(a,b);var c=kc[u(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=kc._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Ua("ISwap.-swap!",a);};
kc.c=function(a,b,c){if(null!=a&&null!=a.Zc)return a.Zc(a,b,c);var d=kc[u(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=kc._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Ua("ISwap.-swap!",a);};kc.l=function(a,b,c,d){if(null!=a&&null!=a.$c)return a.$c(a,b,c,d);var e=kc[u(null==a?null:a)];if(null!=e)return e.l?e.l(a,b,c,d):e.call(null,a,b,c,d);e=kc._;if(null!=e)return e.l?e.l(a,b,c,d):e.call(null,a,b,c,d);throw Ua("ISwap.-swap!",a);};
kc.A=function(a,b,c,d,e){if(null!=a&&null!=a.ad)return a.ad(a,b,c,d,e);var f=kc[u(null==a?null:a)];if(null!=f)return f.A?f.A(a,b,c,d,e):f.call(null,a,b,c,d,e);f=kc._;if(null!=f)return f.A?f.A(a,b,c,d,e):f.call(null,a,b,c,d,e);throw Ua("ISwap.-swap!",a);};kc.v=5;var lc=function lc(b){if(null!=b&&null!=b.Ha)return b.Ha(b);var c=lc[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=lc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("IIterable.-iterator",b);};
function mc(a){this.qd=a;this.g=1073741824;this.C=0}mc.prototype.xc=function(a,b){return this.qd.append(b)};function nc(a){var b=new sa;a.L(null,new mc(b),Ia());return""+z(b)}var oc="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function pc(a){a=oc(a|0,-862048943);return oc(a<<15|a>>>-15,461845907)}
function qc(a,b){var c=(a|0)^(b|0);return oc(c<<13|c>>>-13,5)+-430675100|0}function rc(a,b){var c=(a|0)^b,c=oc(c^c>>>16,-2048144789),c=oc(c^c>>>13,-1028477387);return c^c>>>16}function sc(a){var b;a:{b=1;for(var c=0;;)if(b<a.length){var d=b+2,c=qc(c,pc(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^pc(a.charCodeAt(a.length-1)):b;return rc(b,oc(2,a.length))}tc;uc;vc;wc;var xc={},yc=0;
function zc(a){255<yc&&(xc={},yc=0);var b=xc[a];if("number"!==typeof b){a:if(null!=a)if(b=a.length,0<b)for(var c=0,d=0;;)if(c<b)var e=c+1,d=oc(31,d)+a.charCodeAt(c),c=e;else{b=d;break a}else b=0;else b=0;xc[a]=b;yc+=1}return a=b}function Ac(a){null!=a&&(a.g&4194304||a.xd)?a=a.S(null):"number"===typeof a?a=Math.floor(a)%2147483647:!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=zc(a),0!==a&&(a=pc(a),a=qc(0,a),a=rc(a,4))):a=a instanceof Date?a.valueOf():null==a?0:Mb(a);return a}
function Bc(a,b){return a^b+2654435769+(a<<6)+(a>>2)}function Pa(a,b){return b instanceof a}function Cc(a,b){if(a.Va===b.Va)return 0;var c=Sa(a.Ba);if(w(c?b.Ba:c))return-1;if(w(a.Ba)){if(Sa(b.Ba))return 1;c=va(a.Ba,b.Ba);return 0===c?va(a.name,b.name):c}return va(a.name,b.name)}C;function uc(a,b,c,d,e){this.Ba=a;this.name=b;this.Va=c;this.ob=d;this.Da=e;this.g=2154168321;this.C=4096}k=uc.prototype;k.toString=function(){return this.Va};k.equiv=function(a){return this.D(null,a)};
k.D=function(a,b){return b instanceof uc?this.Va===b.Va:!1};k.call=function(){function a(a,b,c){return C.c?C.c(b,this,c):C.call(null,b,this,c)}function b(a,b){return C.a?C.a(b,this):C.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};
k.b=function(a){return C.a?C.a(a,this):C.call(null,a,this)};k.a=function(a,b){return C.c?C.c(a,this,b):C.call(null,a,this,b)};k.P=function(){return this.Da};k.R=function(a,b){return new uc(this.Ba,this.name,this.Va,this.ob,b)};k.S=function(){var a=this.ob;return null!=a?a:this.ob=a=Bc(sc(this.name),zc(this.Ba))};k.Kb=function(){return this.name};k.Lb=function(){return this.Ba};k.L=function(a,b){return Tb(b,this.Va)};
var Dc=function Dc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Dc.b(arguments[0]);case 2:return Dc.a(arguments[0],arguments[1]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};Dc.b=function(a){if(a instanceof uc)return a;var b=a.indexOf("/");return-1===b?Dc.a(null,a):Dc.a(a.substring(0,b),a.substring(b+1,a.length))};Dc.a=function(a,b){var c=null!=a?[z(a),z("/"),z(b)].join(""):b;return new uc(a,b,c,null,null)};
Dc.v=2;E;Ec;Fc;function F(a){if(null==a)return null;if(null!=a&&(a.g&8388608||a.Xc))return a.U(null);if(Ra(a)||"string"===typeof a)return 0===a.length?null:new Fc(a,0);if(Ta(Nb,a))return Ob(a);throw Error([z(a),z(" is not ISeqable")].join(""));}function H(a){if(null==a)return null;if(null!=a&&(a.g&64||a.F))return a.ta(null);a=F(a);return null==a?null:lb(a)}function Gc(a){return null!=a?null!=a&&(a.g&64||a.F)?a.xa(null):(a=F(a))?mb(a):Hc:Hc}
function J(a){return null==a?null:null!=a&&(a.g&128||a.Yb)?a.wa(null):F(Gc(a))}var vc=function vc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return vc.b(arguments[0]);case 2:return vc.a(arguments[0],arguments[1]);default:return vc.h(arguments[0],arguments[1],new Fc(c.slice(2),0))}};vc.b=function(){return!0};vc.a=function(a,b){return null==a?null==b:a===b||Lb(a,b)};
vc.h=function(a,b,c){for(;;)if(vc.a(a,b))if(J(c))a=b,b=H(c),c=J(c);else return vc.a(b,H(c));else return!1};vc.B=function(a){var b=H(a),c=J(a);a=H(c);c=J(c);return vc.h(b,a,c)};vc.v=2;function Ic(a){this.H=a}Ic.prototype.next=function(){if(null!=this.H){var a=H(this.H);this.H=J(this.H);return{value:a,done:!1}}return{value:null,done:!0}};function Jc(a){return new Ic(F(a))}Lc;function Mc(a,b,c){this.value=a;this.zb=b;this.gc=c;this.g=8388672;this.C=0}Mc.prototype.U=function(){return this};
Mc.prototype.ta=function(){return this.value};Mc.prototype.xa=function(){null==this.gc&&(this.gc=Lc.b?Lc.b(this.zb):Lc.call(null,this.zb));return this.gc};function Lc(a){var b=a.next();return w(b.done)?Hc:new Mc(b.value,a,null)}function Nc(a,b){var c=pc(a),c=qc(0,c);return rc(c,b)}function Oc(a){var b=0,c=1;for(a=F(a);;)if(null!=a)b+=1,c=oc(31,c)+Ac(H(a))|0,a=J(a);else return Nc(c,b)}var Pc=Nc(1,0);function Qc(a){var b=0,c=0;for(a=F(a);;)if(null!=a)b+=1,c=c+Ac(H(a))|0,a=J(a);else return Nc(c,b)}
var Rc=Nc(0,0);Sc;tc;Tc;bb["null"]=!0;cb["null"]=function(){return 0};Date.prototype.D=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};Date.prototype.Eb=!0;Date.prototype.pb=function(a,b){if(b instanceof Date)return va(this.valueOf(),b.valueOf());throw Error([z("Cannot compare "),z(this),z(" to "),z(b)].join(""));};Lb.number=function(a,b){return a===b};Uc;ab["function"]=!0;Fb["function"]=!0;Gb["function"]=function(){return null};Mb._=function(a){return da(a)};
function Vc(a){return a+1}L;function Wc(a){this.G=a;this.g=32768;this.C=0}Wc.prototype.Fb=function(){return this.G};function Xc(a){return a instanceof Wc}function L(a){return Eb(a)}function Yc(a,b){var c=cb(a);if(0===c)return b.m?b.m():b.call(null);for(var d=hb.a(a,0),e=1;;)if(e<c){var f=hb.a(a,e),d=b.a?b.a(d,f):b.call(null,d,f);if(Xc(d))return Eb(d);e+=1}else return d}
function Zc(a,b,c){var d=cb(a),e=c;for(c=0;;)if(c<d){var f=hb.a(a,c),e=b.a?b.a(e,f):b.call(null,e,f);if(Xc(e))return Eb(e);c+=1}else return e}function $c(a,b){var c=a.length;if(0===a.length)return b.m?b.m():b.call(null);for(var d=a[0],e=1;;)if(e<c){var f=a[e],d=b.a?b.a(d,f):b.call(null,d,f);if(Xc(d))return Eb(d);e+=1}else return d}function ad(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var f=a[c],e=b.a?b.a(e,f):b.call(null,e,f);if(Xc(e))return Eb(e);c+=1}else return e}
function bd(a,b,c,d){for(var e=a.length;;)if(d<e){var f=a[d];c=b.a?b.a(c,f):b.call(null,c,f);if(Xc(c))return Eb(c);d+=1}else return c}cd;M;dd;ed;function fd(a){return null!=a?a.g&2||a.Nc?!0:a.g?!1:Ta(bb,a):Ta(bb,a)}function gd(a){return null!=a?a.g&16||a.sc?!0:a.g?!1:Ta(gb,a):Ta(gb,a)}function hd(a,b){this.f=a;this.s=b}hd.prototype.ya=function(){return this.s<this.f.length};hd.prototype.next=function(){var a=this.f[this.s];this.s+=1;return a};
function Fc(a,b){this.f=a;this.s=b;this.g=166199550;this.C=8192}k=Fc.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.ba=function(a,b){var c=b+this.s;return c<this.f.length?this.f[c]:null};k.Ea=function(a,b,c){a=b+this.s;return a<this.f.length?this.f[a]:c};k.Ha=function(){return new hd(this.f,this.s)};k.wa=function(){return this.s+1<this.f.length?new Fc(this.f,this.s+1):null};k.Z=function(){var a=this.f.length-this.s;return 0>a?0:a};
k.Zb=function(){var a=cb(this);return 0<a?new dd(this,a-1,null):null};k.S=function(){return Oc(this)};k.D=function(a,b){return Tc.a?Tc.a(this,b):Tc.call(null,this,b)};k.ca=function(){return Hc};k.ea=function(a,b){return bd(this.f,b,this.f[this.s],this.s+1)};k.fa=function(a,b,c){return bd(this.f,b,c,this.s)};k.ta=function(){return this.f[this.s]};k.xa=function(){return this.s+1<this.f.length?new Fc(this.f,this.s+1):Hc};k.U=function(){return this.s<this.f.length?this:null};
k.X=function(a,b){return M.a?M.a(b,this):M.call(null,b,this)};Fc.prototype[Ya]=function(){return Jc(this)};var Ec=function Ec(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ec.b(arguments[0]);case 2:return Ec.a(arguments[0],arguments[1]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};Ec.b=function(a){return Ec.a(a,0)};Ec.a=function(a,b){return b<a.length?new Fc(a,b):null};Ec.v=2;
var E=function E(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return E.b(arguments[0]);case 2:return E.a(arguments[0],arguments[1]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};E.b=function(a){return Ec.a(a,0)};E.a=function(a,b){return Ec.a(a,b)};E.v=2;Uc;id;function dd(a,b,c){this.Xb=a;this.s=b;this.w=c;this.g=32374990;this.C=8192}k=dd.prototype;k.toString=function(){return nc(this)};
k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.w};k.wa=function(){return 0<this.s?new dd(this.Xb,this.s-1,null):null};k.Z=function(){return this.s+1};k.S=function(){return Oc(this)};k.D=function(a,b){return Tc.a?Tc.a(this,b):Tc.call(null,this,b)};k.ca=function(){var a=Hc,b=this.w;return Uc.a?Uc.a(a,b):Uc.call(null,a,b)};k.ea=function(a,b){return id.a?id.a(b,this):id.call(null,b,this)};k.fa=function(a,b,c){return id.c?id.c(b,c,this):id.call(null,b,c,this)};
k.ta=function(){return hb.a(this.Xb,this.s)};k.xa=function(){return 0<this.s?new dd(this.Xb,this.s-1,null):Hc};k.U=function(){return this};k.R=function(a,b){return new dd(this.Xb,this.s,b)};k.X=function(a,b){return M.a?M.a(b,this):M.call(null,b,this)};dd.prototype[Ya]=function(){return Jc(this)};function jd(a){return H(J(a))}function kd(a){for(;;){var b=J(a);if(null!=b)a=b;else return H(a)}}Lb._=function(a,b){return a===b};
var ld=function ld(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return ld.m();case 1:return ld.b(arguments[0]);case 2:return ld.a(arguments[0],arguments[1]);default:return ld.h(arguments[0],arguments[1],new Fc(c.slice(2),0))}};ld.m=function(){return md};ld.b=function(a){return a};ld.a=function(a,b){return null!=a?fb(a,b):fb(Hc,b)};ld.h=function(a,b,c){for(;;)if(w(c))a=ld.a(a,b),b=H(c),c=J(c);else return ld.a(a,b)};
ld.B=function(a){var b=H(a),c=J(a);a=H(c);c=J(c);return ld.h(b,a,c)};ld.v=2;function O(a){if(null!=a)if(null!=a&&(a.g&2||a.Nc))a=a.Z(null);else if(Ra(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.g&8388608||a.Xc))a:{a=F(a);for(var b=0;;){if(fd(a)){a=b+cb(a);break a}a=J(a);b+=1}}else a=cb(a);else a=0;return a}function nd(a,b){for(var c=null;;){if(null==a)return c;if(0===b)return F(a)?H(a):c;if(gd(a))return hb.c(a,b,c);if(F(a)){var d=J(a),e=b-1;a=d;b=e}else return c}}
function od(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.g&16||a.sc))return a.ba(null,b);if(Ra(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.g&64||a.F)){var c;a:{c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(F(c)){c=H(c);break a}throw Error("Index out of bounds");}if(gd(c)){c=hb.a(c,d);break a}if(F(c))c=J(c),--d;else throw Error("Index out of bounds");
}}return c}if(Ta(gb,a))return hb.a(a,b);throw Error([z("nth not supported on this type "),z(Wa(null==a?null:a.constructor))].join(""));}
function P(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return null;if(null!=a&&(a.g&16||a.sc))return a.Ea(null,b,null);if(Ra(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.g&64||a.F))return nd(a,b);if(Ta(gb,a))return hb.a(a,b);throw Error([z("nth not supported on this type "),z(Wa(null==a?null:a.constructor))].join(""));}
var C=function C(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return C.a(arguments[0],arguments[1]);case 3:return C.c(arguments[0],arguments[1],arguments[2]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};C.a=function(a,b){return null==a?null:null!=a&&(a.g&256||a.tc)?a.N(null,b):Ra(a)?b<a.length?a[b|0]:null:"string"===typeof a?b<a.length?a[b|0]:null:Ta(ob,a)?pb.a(a,b):null};
C.c=function(a,b,c){return null!=a?null!=a&&(a.g&256||a.tc)?a.I(null,b,c):Ra(a)?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:Ta(ob,a)?pb.c(a,b,c):c:c};C.v=3;pd;var Q=function Q(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Q.c(arguments[0],arguments[1],arguments[2]);default:return Q.h(arguments[0],arguments[1],arguments[2],new Fc(c.slice(3),0))}};Q.c=function(a,b,c){return null!=a?sb(a,b,c):qd([b],[c])};
Q.h=function(a,b,c,d){for(;;)if(a=Q.c(a,b,c),w(d))b=H(d),c=jd(d),d=J(J(d));else return a};Q.B=function(a){var b=H(a),c=J(a);a=H(c);var d=J(c),c=H(d),d=J(d);return Q.h(b,a,c,d)};Q.v=3;var rd=function rd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return rd.b(arguments[0]);case 2:return rd.a(arguments[0],arguments[1]);default:return rd.h(arguments[0],arguments[1],new Fc(c.slice(2),0))}};rd.b=function(a){return a};
rd.a=function(a,b){return null==a?null:ub(a,b)};rd.h=function(a,b,c){for(;;){if(null==a)return null;a=rd.a(a,b);if(w(c))b=H(c),c=J(c);else return a}};rd.B=function(a){var b=H(a),c=J(a);a=H(c);c=J(c);return rd.h(b,a,c)};rd.v=2;function sd(a,b){this.i=a;this.w=b;this.g=393217;this.C=0}k=sd.prototype;k.P=function(){return this.w};k.R=function(a,b){return new sd(this.i,b)};k.Mc=!0;
k.call=function(){function a(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,K,N,I,G){a=this;return B.rb?B.rb(a.i,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,K,N,I,G):B.call(null,a.i,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,K,N,I,G)}function b(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,K,N,I){a=this;return a.i.qa?a.i.qa(b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,K,N,I):a.i.call(null,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,K,N,I)}function c(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,K,N){a=this;return a.i.pa?a.i.pa(b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,K,N):
a.i.call(null,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,K,N)}function d(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,K){a=this;return a.i.oa?a.i.oa(b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,K):a.i.call(null,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,K)}function e(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D){a=this;return a.i.na?a.i.na(b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D):a.i.call(null,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D)}function f(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A){a=this;return a.i.ma?a.i.ma(b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A):a.i.call(null,b,
c,d,e,f,g,h,l,m,n,q,p,r,t,y,A)}function g(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y){a=this;return a.i.la?a.i.la(b,c,d,e,f,g,h,l,m,n,q,p,r,t,y):a.i.call(null,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y)}function h(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t){a=this;return a.i.ka?a.i.ka(b,c,d,e,f,g,h,l,m,n,q,p,r,t):a.i.call(null,b,c,d,e,f,g,h,l,m,n,q,p,r,t)}function l(a,b,c,d,e,f,g,h,l,m,n,q,p,r){a=this;return a.i.ja?a.i.ja(b,c,d,e,f,g,h,l,m,n,q,p,r):a.i.call(null,b,c,d,e,f,g,h,l,m,n,q,p,r)}function m(a,b,c,d,e,f,g,h,l,m,n,q,p){a=this;
return a.i.ia?a.i.ia(b,c,d,e,f,g,h,l,m,n,q,p):a.i.call(null,b,c,d,e,f,g,h,l,m,n,q,p)}function n(a,b,c,d,e,f,g,h,l,m,n,q){a=this;return a.i.ha?a.i.ha(b,c,d,e,f,g,h,l,m,n,q):a.i.call(null,b,c,d,e,f,g,h,l,m,n,q)}function q(a,b,c,d,e,f,g,h,l,m,n){a=this;return a.i.ga?a.i.ga(b,c,d,e,f,g,h,l,m,n):a.i.call(null,b,c,d,e,f,g,h,l,m,n)}function p(a,b,c,d,e,f,g,h,l,m){a=this;return a.i.sa?a.i.sa(b,c,d,e,f,g,h,l,m):a.i.call(null,b,c,d,e,f,g,h,l,m)}function r(a,b,c,d,e,f,g,h,l){a=this;return a.i.ra?a.i.ra(b,c,
d,e,f,g,h,l):a.i.call(null,b,c,d,e,f,g,h,l)}function t(a,b,c,d,e,f,g,h){a=this;return a.i.aa?a.i.aa(b,c,d,e,f,g,h):a.i.call(null,b,c,d,e,f,g,h)}function y(a,b,c,d,e,f,g){a=this;return a.i.T?a.i.T(b,c,d,e,f,g):a.i.call(null,b,c,d,e,f,g)}function A(a,b,c,d,e,f){a=this;return a.i.A?a.i.A(b,c,d,e,f):a.i.call(null,b,c,d,e,f)}function D(a,b,c,d,e){a=this;return a.i.l?a.i.l(b,c,d,e):a.i.call(null,b,c,d,e)}function I(a,b,c,d){a=this;return a.i.c?a.i.c(b,c,d):a.i.call(null,b,c,d)}function K(a,b,c){a=this;
return a.i.a?a.i.a(b,c):a.i.call(null,b,c)}function N(a,b){a=this;return a.i.b?a.i.b(b):a.i.call(null,b)}function Aa(a){a=this;return a.i.m?a.i.m():a.i.call(null)}var G=null,G=function(ka,na,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,G,Xa,Va,ib,jb,Db,Kc,Cd,pf){switch(arguments.length){case 1:return Aa.call(this,ka);case 2:return N.call(this,ka,na);case 3:return K.call(this,ka,na,U);case 4:return I.call(this,ka,na,U,X);case 5:return D.call(this,ka,na,U,X,ha);case 6:return A.call(this,ka,na,U,X,ha,ia);case 7:return y.call(this,
ka,na,U,X,ha,ia,ja);case 8:return t.call(this,ka,na,U,X,ha,ia,ja,la);case 9:return r.call(this,ka,na,U,X,ha,ia,ja,la,oa);case 10:return p.call(this,ka,na,U,X,ha,ia,ja,la,oa,ua);case 11:return q.call(this,ka,na,U,X,ha,ia,ja,la,oa,ua,za);case 12:return n.call(this,ka,na,U,X,ha,ia,ja,la,oa,ua,za,Ca);case 13:return m.call(this,ka,na,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da);case 14:return l.call(this,ka,na,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,G);case 15:return h.call(this,ka,na,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,G,Xa);case 16:return g.call(this,
ka,na,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,G,Xa,Va);case 17:return f.call(this,ka,na,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,G,Xa,Va,ib);case 18:return e.call(this,ka,na,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,G,Xa,Va,ib,jb);case 19:return d.call(this,ka,na,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,G,Xa,Va,ib,jb,Db);case 20:return c.call(this,ka,na,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,G,Xa,Va,ib,jb,Db,Kc);case 21:return b.call(this,ka,na,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,G,Xa,Va,ib,jb,Db,Kc,Cd);case 22:return a.call(this,ka,na,U,X,ha,ia,ja,
la,oa,ua,za,Ca,Da,G,Xa,Va,ib,jb,Db,Kc,Cd,pf)}throw Error("Invalid arity: "+arguments.length);};G.b=Aa;G.a=N;G.c=K;G.l=I;G.A=D;G.T=A;G.aa=y;G.ra=t;G.sa=r;G.ga=p;G.ha=q;G.ia=n;G.ja=m;G.ka=l;G.la=h;G.ma=g;G.na=f;G.oa=e;G.pa=d;G.qa=c;G.Gb=b;G.rb=a;return G}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.m=function(){return this.i.m?this.i.m():this.i.call(null)};k.b=function(a){return this.i.b?this.i.b(a):this.i.call(null,a)};
k.a=function(a,b){return this.i.a?this.i.a(a,b):this.i.call(null,a,b)};k.c=function(a,b,c){return this.i.c?this.i.c(a,b,c):this.i.call(null,a,b,c)};k.l=function(a,b,c,d){return this.i.l?this.i.l(a,b,c,d):this.i.call(null,a,b,c,d)};k.A=function(a,b,c,d,e){return this.i.A?this.i.A(a,b,c,d,e):this.i.call(null,a,b,c,d,e)};k.T=function(a,b,c,d,e,f){return this.i.T?this.i.T(a,b,c,d,e,f):this.i.call(null,a,b,c,d,e,f)};
k.aa=function(a,b,c,d,e,f,g){return this.i.aa?this.i.aa(a,b,c,d,e,f,g):this.i.call(null,a,b,c,d,e,f,g)};k.ra=function(a,b,c,d,e,f,g,h){return this.i.ra?this.i.ra(a,b,c,d,e,f,g,h):this.i.call(null,a,b,c,d,e,f,g,h)};k.sa=function(a,b,c,d,e,f,g,h,l){return this.i.sa?this.i.sa(a,b,c,d,e,f,g,h,l):this.i.call(null,a,b,c,d,e,f,g,h,l)};k.ga=function(a,b,c,d,e,f,g,h,l,m){return this.i.ga?this.i.ga(a,b,c,d,e,f,g,h,l,m):this.i.call(null,a,b,c,d,e,f,g,h,l,m)};
k.ha=function(a,b,c,d,e,f,g,h,l,m,n){return this.i.ha?this.i.ha(a,b,c,d,e,f,g,h,l,m,n):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n)};k.ia=function(a,b,c,d,e,f,g,h,l,m,n,q){return this.i.ia?this.i.ia(a,b,c,d,e,f,g,h,l,m,n,q):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,q)};k.ja=function(a,b,c,d,e,f,g,h,l,m,n,q,p){return this.i.ja?this.i.ja(a,b,c,d,e,f,g,h,l,m,n,q,p):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,q,p)};
k.ka=function(a,b,c,d,e,f,g,h,l,m,n,q,p,r){return this.i.ka?this.i.ka(a,b,c,d,e,f,g,h,l,m,n,q,p,r):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,q,p,r)};k.la=function(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t){return this.i.la?this.i.la(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,q,p,r,t)};k.ma=function(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y){return this.i.ma?this.i.ma(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y)};
k.na=function(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A){return this.i.na?this.i.na(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A)};k.oa=function(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D){return this.i.oa?this.i.oa(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D)};
k.pa=function(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I){return this.i.pa?this.i.pa(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I)};k.qa=function(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I,K){return this.i.qa?this.i.qa(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I,K):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I,K)};
k.Gb=function(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I,K,N){return B.rb?B.rb(this.i,a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I,K,N):B.call(null,this.i,a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I,K,N)};function Uc(a,b){return ca(a)?new sd(a,b):null==a?null:Hb(a,b)}function td(a){var b=null!=a;return(b?null!=a?a.g&131072||a.Tc||(a.g?0:Ta(Fb,a)):Ta(Fb,a):b)?Gb(a):null}function ud(a){return null==a||Sa(F(a))}function vd(a){return null==a?!1:null!=a?a.g&4096||a.Bd?!0:a.g?!1:Ta(yb,a):Ta(yb,a)}
function wd(a){return null!=a?a.g&16777216||a.Ad?!0:a.g?!1:Ta(Pb,a):Ta(Pb,a)}function xd(a){return null==a?!1:null!=a?a.g&1024||a.Rc?!0:a.g?!1:Ta(tb,a):Ta(tb,a)}function yd(a){return null!=a?a.g&16384||a.Cd?!0:a.g?!1:Ta(Bb,a):Ta(Bb,a)}zd;Ad;function Bd(a){return null!=a?a.C&512||a.vd?!0:!1:!1}function Dd(a){var b=[];ra(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}function Ed(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var Fd={};
function Gd(a){return null==a?!1:null!=a?a.g&64||a.F?!0:a.g?!1:Ta(kb,a):Ta(kb,a)}function Hd(a){return null==a?!1:!1===a?!1:!0}function Id(a,b){return C.c(a,b,Fd)===Fd?!1:!0}function Jd(a,b){var c;if(c=null!=a)c=null!=a?a.g&512||a.ud?!0:a.g?!1:Ta(qb,a):Ta(qb,a);return c&&Id(a,b)?new R(null,2,5,S,[b,C.a(a,b)],null):null}
function wc(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if("number"===typeof a){if("number"===typeof b)return va(a,b);throw Error([z("Cannot compare "),z(a),z(" to "),z(b)].join(""));}if(null!=a?a.C&2048||a.Eb||(a.C?0:Ta(bc,a)):Ta(bc,a))return cc(a,b);if("string"!==typeof a&&!Ra(a)&&!0!==a&&!1!==a||(null==a?null:a.constructor)!==(null==b?null:b.constructor))throw Error([z("Cannot compare "),z(a),z(" to "),z(b)].join(""));return va(a,b)}
function Kd(a,b){var c=O(a),d=O(b);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=wc(od(a,d),od(b,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}function Ld(a){return vc.a(a,wc)?wc:function(b,c){var d=a.a?a.a(b,c):a.call(null,b,c);return"number"===typeof d?d:w(d)?-1:w(a.a?a.a(c,b):a.call(null,c,b))?1:0}}Md;
var id=function id(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return id.a(arguments[0],arguments[1]);case 3:return id.c(arguments[0],arguments[1],arguments[2]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};id.a=function(a,b){var c=F(b);if(c){var d=H(c),c=J(c);return $a.c?$a.c(a,d,c):$a.call(null,a,d,c)}return a.m?a.m():a.call(null)};
id.c=function(a,b,c){for(c=F(c);;)if(c){var d=H(c);b=a.a?a.a(b,d):a.call(null,b,d);if(Xc(b))return Eb(b);c=J(c)}else return b};id.v=3;Nd;var $a=function $a(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return $a.a(arguments[0],arguments[1]);case 3:return $a.c(arguments[0],arguments[1],arguments[2]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};
$a.a=function(a,b){return null!=b&&(b.g&524288||b.Vc)?b.ea(null,a):Ra(b)?$c(b,a):"string"===typeof b?$c(b,a):Ta(Ib,b)?Jb.a(b,a):id.a(a,b)};$a.c=function(a,b,c){return null!=c&&(c.g&524288||c.Vc)?c.fa(null,a,b):Ra(c)?ad(c,a,b):"string"===typeof c?ad(c,a,b):Ta(Ib,c)?Jb.c(c,a,b):id.c(a,b,c)};$a.v=3;function Od(a){return a}function Pd(a,b,c,d){a=a.b?a.b(b):a.call(null,b);c=$a.c(a,c,d);return a.b?a.b(c):a.call(null,c)}
var Qd=function Qd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Qd.m();case 1:return Qd.b(arguments[0]);case 2:return Qd.a(arguments[0],arguments[1]);default:return Qd.h(arguments[0],arguments[1],new Fc(c.slice(2),0))}};Qd.m=function(){return 0};Qd.b=function(a){return a};Qd.a=function(a,b){return a+b};Qd.h=function(a,b,c){return $a.c(Qd,a+b,c)};Qd.B=function(a){var b=H(a),c=J(a);a=H(c);c=J(c);return Qd.h(b,a,c)};Qd.v=2;
var Rd=function Rd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Rd.b(arguments[0]);case 2:return Rd.a(arguments[0],arguments[1]);default:return Rd.h(arguments[0],arguments[1],new Fc(c.slice(2),0))}};Rd.b=function(a){return-a};Rd.a=function(a,b){return a-b};Rd.h=function(a,b,c){return $a.c(Rd,a-b,c)};Rd.B=function(a){var b=H(a),c=J(a);a=H(c);c=J(c);return Rd.h(b,a,c)};Rd.v=2;
var Sd=function Sd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Sd.m();case 1:return Sd.b(arguments[0]);case 2:return Sd.a(arguments[0],arguments[1]);default:return Sd.h(arguments[0],arguments[1],new Fc(c.slice(2),0))}};Sd.m=function(){return 1};Sd.b=function(a){return a};Sd.a=function(a,b){return a*b};Sd.h=function(a,b,c){return $a.c(Sd,a*b,c)};Sd.B=function(a){var b=H(a),c=J(a);a=H(c);c=J(c);return Sd.h(b,a,c)};Sd.v=2;xa.Id;
var Td=function Td(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Td.b(arguments[0]);case 2:return Td.a(arguments[0],arguments[1]);default:return Td.h(arguments[0],arguments[1],new Fc(c.slice(2),0))}};Td.b=function(a){return 1/a};Td.a=function(a,b){return a/b};Td.h=function(a,b,c){return $a.c(Td,a/b,c)};Td.B=function(a){var b=H(a),c=J(a);a=H(c);c=J(c);return Td.h(b,a,c)};Td.v=2;
var Ud=function Ud(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ud.b(arguments[0]);case 2:return Ud.a(arguments[0],arguments[1]);default:return Ud.h(arguments[0],arguments[1],new Fc(c.slice(2),0))}};Ud.b=function(){return!0};Ud.a=function(a,b){return a>b};Ud.h=function(a,b,c){for(;;)if(a>b)if(J(c))a=b,b=H(c),c=J(c);else return b>H(c);else return!1};Ud.B=function(a){var b=H(a),c=J(a);a=H(c);c=J(c);return Ud.h(b,a,c)};Ud.v=2;
var Vd=function Vd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Vd.b(arguments[0]);case 2:return Vd.a(arguments[0],arguments[1]);default:return Vd.h(arguments[0],arguments[1],new Fc(c.slice(2),0))}};Vd.b=function(a){return a};Vd.a=function(a,b){return a>b?a:b};Vd.h=function(a,b,c){return $a.c(Vd,a>b?a:b,c)};Vd.B=function(a){var b=H(a),c=J(a);a=H(c);c=J(c);return Vd.h(b,a,c)};Vd.v=2;
var Wd=function Wd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Wd.b(arguments[0]);case 2:return Wd.a(arguments[0],arguments[1]);default:return Wd.h(arguments[0],arguments[1],new Fc(c.slice(2),0))}};Wd.b=function(a){return a};Wd.a=function(a,b){return a<b?a:b};Wd.h=function(a,b,c){return $a.c(Wd,a<b?a:b,c)};Wd.B=function(a){var b=H(a),c=J(a);a=H(c);c=J(c);return Wd.h(b,a,c)};Wd.v=2;Xd;function Xd(a,b){return(a%b+b)%b}
function Yd(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function Zd(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function $d(a,b){for(var c=b,d=F(a);;)if(d&&0<c)--c,d=J(d);else return d}var z=function z(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return z.m();case 1:return z.b(arguments[0]);default:return z.h(arguments[0],new Fc(c.slice(1),0))}};z.m=function(){return""};
z.b=function(a){return null==a?"":""+a};z.h=function(a,b){for(var c=new sa(""+z(a)),d=b;;)if(w(d))c=c.append(""+z(H(d))),d=J(d);else return c.toString()};z.B=function(a){var b=H(a);a=J(a);return z.h(b,a)};z.v=1;T;ae;function Tc(a,b){var c;if(wd(b))if(fd(a)&&fd(b)&&O(a)!==O(b))c=!1;else a:{c=F(a);for(var d=F(b);;){if(null==c){c=null==d;break a}if(null!=d&&vc.a(H(c),H(d)))c=J(c),d=J(d);else{c=!1;break a}}}else c=null;return Hd(c)}
function cd(a){if(F(a)){var b=Ac(H(a));for(a=J(a);;){if(null==a)return b;b=Bc(b,Ac(H(a)));a=J(a)}}else return 0}be;ce;function de(a){var b=0;for(a=F(a);;)if(a){var c=H(a),b=(b+(Ac(be.b?be.b(c):be.call(null,c))^Ac(ce.b?ce.b(c):ce.call(null,c))))%4503599627370496;a=J(a)}else return b}ae;ee;fe;function ed(a,b,c,d,e){this.w=a;this.first=b;this.Ca=c;this.count=d;this.u=e;this.g=65937646;this.C=8192}k=ed.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.w};
k.wa=function(){return 1===this.count?null:this.Ca};k.Z=function(){return this.count};k.eb=function(){return this.first};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Oc(this)};k.D=function(a,b){return Tc(this,b)};k.ca=function(){return Hb(Hc,this.w)};k.ea=function(a,b){return id.a(b,this)};k.fa=function(a,b,c){return id.c(b,c,this)};k.ta=function(){return this.first};k.xa=function(){return 1===this.count?Hc:this.Ca};k.U=function(){return this};
k.R=function(a,b){return new ed(b,this.first,this.Ca,this.count,this.u)};k.X=function(a,b){return new ed(this.w,b,this,this.count+1,null)};function ge(a){return null!=a?a.g&33554432||a.yd?!0:a.g?!1:Ta(Qb,a):Ta(Qb,a)}ed.prototype[Ya]=function(){return Jc(this)};function he(a){this.w=a;this.g=65937614;this.C=8192}k=he.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.w};k.wa=function(){return null};k.Z=function(){return 0};k.eb=function(){return null};
k.S=function(){return Pc};k.D=function(a,b){return ge(b)||wd(b)?null==F(b):!1};k.ca=function(){return this};k.ea=function(a,b){return id.a(b,this)};k.fa=function(a,b,c){return id.c(b,c,this)};k.ta=function(){return null};k.xa=function(){return Hc};k.U=function(){return null};k.R=function(a,b){return new he(b)};k.X=function(a,b){return new ed(this.w,b,null,1,null)};var Hc=new he(null);he.prototype[Ya]=function(){return Jc(this)};
function ie(a){return(null!=a?a.g&134217728||a.zd||(a.g?0:Ta(Rb,a)):Ta(Rb,a))?Sb(a):$a.c(ld,Hc,a)}var tc=function tc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return tc.h(0<c.length?new Fc(c.slice(0),0):null)};tc.h=function(a){var b;if(a instanceof Fc&&0===a.s)b=a.f;else a:for(b=[];;)if(null!=a)b.push(a.ta(null)),a=a.wa(null);else break a;a=b.length;for(var c=Hc;;)if(0<a){var d=a-1,c=c.X(null,b[a-1]);a=d}else return c};tc.v=0;tc.B=function(a){return tc.h(F(a))};
function je(a,b,c,d){this.w=a;this.first=b;this.Ca=c;this.u=d;this.g=65929452;this.C=8192}k=je.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.w};k.wa=function(){return null==this.Ca?null:F(this.Ca)};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Oc(this)};k.D=function(a,b){return Tc(this,b)};k.ca=function(){return Uc(Hc,this.w)};k.ea=function(a,b){return id.a(b,this)};k.fa=function(a,b,c){return id.c(b,c,this)};k.ta=function(){return this.first};
k.xa=function(){return null==this.Ca?Hc:this.Ca};k.U=function(){return this};k.R=function(a,b){return new je(b,this.first,this.Ca,this.u)};k.X=function(a,b){return new je(null,b,this,this.u)};je.prototype[Ya]=function(){return Jc(this)};function M(a,b){var c=null==b;return(c?c:null!=b&&(b.g&64||b.F))?new je(null,a,b,null):new je(null,a,F(b),null)}
function ke(a,b){if(a.Ia===b.Ia)return 0;var c=Sa(a.Ba);if(w(c?b.Ba:c))return-1;if(w(a.Ba)){if(Sa(b.Ba))return 1;c=va(a.Ba,b.Ba);return 0===c?va(a.name,b.name):c}return va(a.name,b.name)}function x(a,b,c,d){this.Ba=a;this.name=b;this.Ia=c;this.ob=d;this.g=2153775105;this.C=4096}k=x.prototype;k.toString=function(){return[z(":"),z(this.Ia)].join("")};k.equiv=function(a){return this.D(null,a)};k.D=function(a,b){return b instanceof x?this.Ia===b.Ia:!1};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return C.a(c,this);case 3:return C.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return C.a(c,this)};a.c=function(a,c,d){return C.c(c,this,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return C.a(a,this)};k.a=function(a,b){return C.c(a,this,b)};
k.S=function(){var a=this.ob;return null!=a?a:this.ob=a=Bc(sc(this.name),zc(this.Ba))+2654435769|0};k.Kb=function(){return this.name};k.Lb=function(){return this.Ba};k.L=function(a,b){return Tb(b,[z(":"),z(this.Ia)].join(""))};function le(a,b){return a===b?!0:a instanceof x&&b instanceof x?a.Ia===b.Ia:!1}
var me=function me(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return me.b(arguments[0]);case 2:return me.a(arguments[0],arguments[1]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};
me.b=function(a){if(a instanceof x)return a;if(a instanceof uc){var b;if(null!=a&&(a.C&4096||a.Uc))b=a.Lb(null);else throw Error([z("Doesn't support namespace: "),z(a)].join(""));return new x(b,ae.b?ae.b(a):ae.call(null,a),a.Va,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new x(b[0],b[1],a,null):new x(null,b[0],a,null)):null};me.a=function(a,b){return new x(a,b,[z(w(a)?[z(a),z("/")].join(""):null),z(b)].join(""),null)};me.v=2;
function ne(a,b,c,d){this.w=a;this.yb=b;this.H=c;this.u=d;this.g=32374988;this.C=0}k=ne.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};function oe(a){null!=a.yb&&(a.H=a.yb.m?a.yb.m():a.yb.call(null),a.yb=null);return a.H}k.P=function(){return this.w};k.wa=function(){Ob(this);return null==this.H?null:J(this.H)};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Oc(this)};k.D=function(a,b){return Tc(this,b)};k.ca=function(){return Uc(Hc,this.w)};
k.ea=function(a,b){return id.a(b,this)};k.fa=function(a,b,c){return id.c(b,c,this)};k.ta=function(){Ob(this);return null==this.H?null:H(this.H)};k.xa=function(){Ob(this);return null!=this.H?Gc(this.H):Hc};k.U=function(){oe(this);if(null==this.H)return null;for(var a=this.H;;)if(a instanceof ne)a=oe(a);else return this.H=a,F(this.H)};k.R=function(a,b){return new ne(b,this.yb,this.H,this.u)};k.X=function(a,b){return M(b,this)};ne.prototype[Ya]=function(){return Jc(this)};pe;
function qe(a,b){this.K=a;this.end=b;this.g=2;this.C=0}qe.prototype.add=function(a){this.K[this.end]=a;return this.end+=1};qe.prototype.W=function(){var a=new pe(this.K,0,this.end);this.K=null;return a};qe.prototype.Z=function(){return this.end};function re(a){return new qe(Array(a),0)}function pe(a,b,c){this.f=a;this.ua=b;this.end=c;this.g=524306;this.C=0}k=pe.prototype;k.Z=function(){return this.end-this.ua};k.ba=function(a,b){return this.f[this.ua+b]};
k.Ea=function(a,b,c){return 0<=b&&b<this.end-this.ua?this.f[this.ua+b]:c};k.rc=function(){if(this.ua===this.end)throw Error("-drop-first of empty chunk");return new pe(this.f,this.ua+1,this.end)};k.ea=function(a,b){return bd(this.f,b,this.f[this.ua],this.ua+1)};k.fa=function(a,b,c){return bd(this.f,b,c,this.ua)};function zd(a,b,c,d){this.W=a;this.Sa=b;this.w=c;this.u=d;this.g=31850732;this.C=1536}k=zd.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};
k.P=function(){return this.w};k.wa=function(){if(1<cb(this.W))return new zd(dc(this.W),this.Sa,this.w,null);var a=Ob(this.Sa);return null==a?null:a};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Oc(this)};k.D=function(a,b){return Tc(this,b)};k.ca=function(){return Uc(Hc,this.w)};k.ta=function(){return hb.a(this.W,0)};k.xa=function(){return 1<cb(this.W)?new zd(dc(this.W),this.Sa,this.w,null):null==this.Sa?Hc:this.Sa};k.U=function(){return this};k.jc=function(){return this.W};
k.kc=function(){return null==this.Sa?Hc:this.Sa};k.R=function(a,b){return new zd(this.W,this.Sa,b,this.u)};k.X=function(a,b){return M(b,this)};k.ic=function(){return null==this.Sa?null:this.Sa};zd.prototype[Ya]=function(){return Jc(this)};function se(a,b){return 0===cb(a)?b:new zd(a,b,null,null)}function te(a,b){a.add(b)}function ee(a){return ec(a)}function fe(a){return fc(a)}function Md(a){for(var b=[];;)if(F(a))b.push(H(a)),a=J(a);else return b}
function ue(a){if("number"===typeof a)a:{var b=Array(a);if(Gd(null))for(var c=0,d=F(null);;)if(d&&c<a)b[c]=H(d),c+=1,d=J(d);else{a=b;break a}else{for(c=0;;)if(c<a)b[c]=null,c+=1;else break;a=b}}else a=Oa.b(a);return a}function ve(a,b){if(fd(a))return O(a);for(var c=a,d=b,e=0;;)if(0<d&&F(c))c=J(c),--d,e+=1;else return e}
var we=function we(b){return null==b?null:null==J(b)?F(H(b)):M(H(b),we(J(b)))},xe=function xe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return xe.m();case 1:return xe.b(arguments[0]);case 2:return xe.a(arguments[0],arguments[1]);default:return xe.h(arguments[0],arguments[1],new Fc(c.slice(2),0))}};xe.m=function(){return new ne(null,function(){return null},null,null)};xe.b=function(a){return new ne(null,function(){return a},null,null)};
xe.a=function(a,b){return new ne(null,function(){var c=F(a);return c?Bd(c)?se(ec(c),xe.a(fc(c),b)):M(H(c),xe.a(Gc(c),b)):b},null,null)};xe.h=function(a,b,c){return function e(a,b){return new ne(null,function(){var c=F(a);return c?Bd(c)?se(ec(c),e(fc(c),b)):M(H(c),e(Gc(c),b)):w(b)?e(H(b),J(b)):null},null,null)}(xe.a(a,b),c)};xe.B=function(a){var b=H(a),c=J(a);a=H(c);c=J(c);return xe.h(b,a,c)};xe.v=2;function ye(a){return Zb(a)}
var ze=function ze(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return ze.m();case 1:return ze.b(arguments[0]);case 2:return ze.a(arguments[0],arguments[1]);default:return ze.h(arguments[0],arguments[1],new Fc(c.slice(2),0))}};ze.m=function(){return Xb(md)};ze.b=function(a){return a};ze.a=function(a,b){return Yb(a,b)};ze.h=function(a,b,c){for(;;)if(a=Yb(a,b),w(c))b=H(c),c=J(c);else return a};
ze.B=function(a){var b=H(a),c=J(a);a=H(c);c=J(c);return ze.h(b,a,c)};ze.v=2;function Ae(a,b,c){return $b(a,b,c)}
function Be(a,b,c){var d=F(c);if(0===b)return a.m?a.m():a.call(null);c=lb(d);var e=mb(d);if(1===b)return a.b?a.b(c):a.b?a.b(c):a.call(null,c);var d=lb(e),f=mb(e);if(2===b)return a.a?a.a(c,d):a.a?a.a(c,d):a.call(null,c,d);var e=lb(f),g=mb(f);if(3===b)return a.c?a.c(c,d,e):a.c?a.c(c,d,e):a.call(null,c,d,e);var f=lb(g),h=mb(g);if(4===b)return a.l?a.l(c,d,e,f):a.l?a.l(c,d,e,f):a.call(null,c,d,e,f);var g=lb(h),l=mb(h);if(5===b)return a.A?a.A(c,d,e,f,g):a.A?a.A(c,d,e,f,g):a.call(null,c,d,e,f,g);var h=lb(l),
m=mb(l);if(6===b)return a.T?a.T(c,d,e,f,g,h):a.T?a.T(c,d,e,f,g,h):a.call(null,c,d,e,f,g,h);var l=lb(m),n=mb(m);if(7===b)return a.aa?a.aa(c,d,e,f,g,h,l):a.aa?a.aa(c,d,e,f,g,h,l):a.call(null,c,d,e,f,g,h,l);var m=lb(n),q=mb(n);if(8===b)return a.ra?a.ra(c,d,e,f,g,h,l,m):a.ra?a.ra(c,d,e,f,g,h,l,m):a.call(null,c,d,e,f,g,h,l,m);var n=lb(q),p=mb(q);if(9===b)return a.sa?a.sa(c,d,e,f,g,h,l,m,n):a.sa?a.sa(c,d,e,f,g,h,l,m,n):a.call(null,c,d,e,f,g,h,l,m,n);var q=lb(p),r=mb(p);if(10===b)return a.ga?a.ga(c,d,e,
f,g,h,l,m,n,q):a.ga?a.ga(c,d,e,f,g,h,l,m,n,q):a.call(null,c,d,e,f,g,h,l,m,n,q);var p=lb(r),t=mb(r);if(11===b)return a.ha?a.ha(c,d,e,f,g,h,l,m,n,q,p):a.ha?a.ha(c,d,e,f,g,h,l,m,n,q,p):a.call(null,c,d,e,f,g,h,l,m,n,q,p);var r=lb(t),y=mb(t);if(12===b)return a.ia?a.ia(c,d,e,f,g,h,l,m,n,q,p,r):a.ia?a.ia(c,d,e,f,g,h,l,m,n,q,p,r):a.call(null,c,d,e,f,g,h,l,m,n,q,p,r);var t=lb(y),A=mb(y);if(13===b)return a.ja?a.ja(c,d,e,f,g,h,l,m,n,q,p,r,t):a.ja?a.ja(c,d,e,f,g,h,l,m,n,q,p,r,t):a.call(null,c,d,e,f,g,h,l,m,n,
q,p,r,t);var y=lb(A),D=mb(A);if(14===b)return a.ka?a.ka(c,d,e,f,g,h,l,m,n,q,p,r,t,y):a.ka?a.ka(c,d,e,f,g,h,l,m,n,q,p,r,t,y):a.call(null,c,d,e,f,g,h,l,m,n,q,p,r,t,y);var A=lb(D),I=mb(D);if(15===b)return a.la?a.la(c,d,e,f,g,h,l,m,n,q,p,r,t,y,A):a.la?a.la(c,d,e,f,g,h,l,m,n,q,p,r,t,y,A):a.call(null,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A);var D=lb(I),K=mb(I);if(16===b)return a.ma?a.ma(c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D):a.ma?a.ma(c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D):a.call(null,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D);var I=
lb(K),N=mb(K);if(17===b)return a.na?a.na(c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I):a.na?a.na(c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I):a.call(null,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I);var K=lb(N),Aa=mb(N);if(18===b)return a.oa?a.oa(c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I,K):a.oa?a.oa(c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I,K):a.call(null,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I,K);N=lb(Aa);Aa=mb(Aa);if(19===b)return a.pa?a.pa(c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I,K,N):a.pa?a.pa(c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I,K,N):a.call(null,c,d,e,
f,g,h,l,m,n,q,p,r,t,y,A,D,I,K,N);var G=lb(Aa);mb(Aa);if(20===b)return a.qa?a.qa(c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I,K,N,G):a.qa?a.qa(c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I,K,N,G):a.call(null,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I,K,N,G);throw Error("Only up to 20 arguments supported on functions");}
var B=function B(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return B.a(arguments[0],arguments[1]);case 3:return B.c(arguments[0],arguments[1],arguments[2]);case 4:return B.l(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return B.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return B.h(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new Fc(c.slice(5),0))}};
B.a=function(a,b){var c=a.v;if(a.B){var d=ve(b,c+1);return d<=c?Be(a,d,b):a.B(b)}return a.apply(a,Md(b))};B.c=function(a,b,c){b=M(b,c);c=a.v;if(a.B){var d=ve(b,c+1);return d<=c?Be(a,d,b):a.B(b)}return a.apply(a,Md(b))};B.l=function(a,b,c,d){b=M(b,M(c,d));c=a.v;return a.B?(d=ve(b,c+1),d<=c?Be(a,d,b):a.B(b)):a.apply(a,Md(b))};B.A=function(a,b,c,d,e){b=M(b,M(c,M(d,e)));c=a.v;return a.B?(d=ve(b,c+1),d<=c?Be(a,d,b):a.B(b)):a.apply(a,Md(b))};
B.h=function(a,b,c,d,e,f){b=M(b,M(c,M(d,M(e,we(f)))));c=a.v;return a.B?(d=ve(b,c+1),d<=c?Be(a,d,b):a.B(b)):a.apply(a,Md(b))};B.B=function(a){var b=H(a),c=J(a);a=H(c);var d=J(c),c=H(d),e=J(d),d=H(e),f=J(e),e=H(f),f=J(f);return B.h(b,a,c,d,e,f)};B.v=5;function Ce(a){return F(a)?a:null}
var De=function De(){"undefined"===typeof ya&&(ya=function(b,c){this.md=b;this.ld=c;this.g=393216;this.C=0},ya.prototype.R=function(b,c){return new ya(this.md,c)},ya.prototype.P=function(){return this.ld},ya.prototype.ya=function(){return!1},ya.prototype.next=function(){return Error("No such element")},ya.prototype.remove=function(){return Error("Unsupported operation")},ya.ec=function(){return new R(null,2,5,S,[Uc(Ee,new v(null,1,[Fe,tc(Ge,tc(md))],null)),xa.Hd],null)},ya.tb=!0,ya.Za="cljs.core/t_cljs$core23150",
ya.Pb=function(b,c){return Tb(c,"cljs.core/t_cljs$core23150")});return new ya(De,V)};He;function He(a,b,c,d){this.Bb=a;this.first=b;this.Ca=c;this.w=d;this.g=31719628;this.C=0}k=He.prototype;k.R=function(a,b){return new He(this.Bb,this.first,this.Ca,b)};k.X=function(a,b){return M(b,Ob(this))};k.ca=function(){return Hc};k.D=function(a,b){return null!=Ob(this)?Tc(this,b):wd(b)&&null==F(b)};k.S=function(){return Oc(this)};k.U=function(){null!=this.Bb&&this.Bb.step(this);return null==this.Ca?null:this};
k.ta=function(){null!=this.Bb&&Ob(this);return null==this.Ca?null:this.first};k.xa=function(){null!=this.Bb&&Ob(this);return null==this.Ca?Hc:this.Ca};k.wa=function(){null!=this.Bb&&Ob(this);return null==this.Ca?null:Ob(this.Ca)};He.prototype[Ya]=function(){return Jc(this)};function Ie(a,b){for(;;){if(null==F(b))return!0;var c;c=H(b);c=a.b?a.b(c):a.call(null,c);if(w(c)){c=a;var d=J(b);a=c;b=d}else return!1}}
function Je(a,b){for(;;)if(F(b)){var c;c=H(b);c=a.b?a.b(c):a.call(null,c);if(w(c))return c;c=a;var d=J(b);a=c;b=d}else return null}
function Ke(a){return function(){function b(b,c){return Sa(a.a?a.a(b,c):a.call(null,b,c))}function c(b){return Sa(a.b?a.b(b):a.call(null,b))}function d(){return Sa(a.m?a.m():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new Fc(g,0)}return c.call(this,a,d,f)}function c(b,d,e){return Sa(B.l(a,b,d,e))}b.v=2;b.B=function(a){var b=H(a);a=J(a);var d=H(a);a=Gc(a);return c(b,d,a)};b.h=
c;return b}(),e=function(a,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var m=null;if(2<arguments.length){for(var m=0,n=Array(arguments.length-2);m<n.length;)n[m]=arguments[m+2],++m;m=new Fc(n,0)}return f.h(a,e,m)}throw Error("Invalid arity: "+arguments.length);};e.v=2;e.B=f.B;e.m=d;e.b=c;e.a=b;e.h=f.h;return e}()}
function Le(a){return function(){function b(b){if(0<arguments.length)for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;return a}b.v=0;b.B=function(b){F(b);return a};b.h=function(){return a};return b}()}
var Me=function Me(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Me.m();case 1:return Me.b(arguments[0]);case 2:return Me.a(arguments[0],arguments[1]);case 3:return Me.c(arguments[0],arguments[1],arguments[2]);default:return Me.h(arguments[0],arguments[1],arguments[2],new Fc(c.slice(3),0))}};Me.m=function(){return Od};Me.b=function(a){return a};
Me.a=function(a,b){return function(){function c(c,d,e){c=b.c?b.c(c,d,e):b.call(null,c,d,e);return a.b?a.b(c):a.call(null,c)}function d(c,d){var e=b.a?b.a(c,d):b.call(null,c,d);return a.b?a.b(e):a.call(null,e)}function e(c){c=b.b?b.b(c):b.call(null,c);return a.b?a.b(c):a.call(null,c)}function f(){var c=b.m?b.m():b.call(null);return a.b?a.b(c):a.call(null,c)}var g=null,h=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+
3],++g;g=new Fc(h,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){c=B.A(b,c,e,f,g);return a.b?a.b(c):a.call(null,c)}c.v=3;c.B=function(a){var b=H(a);a=J(a);var c=H(a);a=J(a);var e=H(a);a=Gc(a);return d(b,c,e,a)};c.h=d;return c}(),g=function(a,b,g,q){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var p=null;if(3<arguments.length){for(var p=0,r=Array(arguments.length-3);p<r.length;)r[p]=arguments[p+
3],++p;p=new Fc(r,0)}return h.h(a,b,g,p)}throw Error("Invalid arity: "+arguments.length);};g.v=3;g.B=h.B;g.m=f;g.b=e;g.a=d;g.c=c;g.h=h.h;return g}()};
Me.c=function(a,b,c){return function(){function d(d,e,f){d=c.c?c.c(d,e,f):c.call(null,d,e,f);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}function e(d,e){var f;f=c.a?c.a(d,e):c.call(null,d,e);f=b.b?b.b(f):b.call(null,f);return a.b?a.b(f):a.call(null,f)}function f(d){d=c.b?c.b(d):c.call(null,d);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}function g(){var d;d=c.m?c.m():c.call(null);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}var h=null,l=function(){function d(a,
b,c,f){var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;g=new Fc(h,0)}return e.call(this,a,b,c,g)}function e(d,f,g,h){d=B.A(c,d,f,g,h);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}d.v=3;d.B=function(a){var b=H(a);a=J(a);var c=H(a);a=J(a);var d=H(a);a=Gc(a);return e(b,c,d,a)};d.h=e;return d}(),h=function(a,b,c,h){switch(arguments.length){case 0:return g.call(this);case 1:return f.call(this,a);case 2:return e.call(this,a,b);
case 3:return d.call(this,a,b,c);default:var r=null;if(3<arguments.length){for(var r=0,t=Array(arguments.length-3);r<t.length;)t[r]=arguments[r+3],++r;r=new Fc(t,0)}return l.h(a,b,c,r)}throw Error("Invalid arity: "+arguments.length);};h.v=3;h.B=l.B;h.m=g;h.b=f;h.a=e;h.c=d;h.h=l.h;return h}()};
Me.h=function(a,b,c,d){return function(a){return function(){function b(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new Fc(e,0)}return c.call(this,d)}function c(b){b=B.a(H(a),b);for(var d=J(a);;)if(d)b=H(d).call(null,b),d=J(d);else return b}b.v=0;b.B=function(a){a=F(a);return c(a)};b.h=c;return b}()}(ie(M(a,M(b,M(c,d)))))};Me.B=function(a){var b=H(a),c=J(a);a=H(c);var d=J(c),c=H(d),d=J(d);return Me.h(b,a,c,d)};Me.v=3;
function Ne(a,b){return function(){function c(c,d,e){return a.l?a.l(b,c,d,e):a.call(null,b,c,d,e)}function d(c,d){return a.c?a.c(b,c,d):a.call(null,b,c,d)}function e(c){return a.a?a.a(b,c):a.call(null,b,c)}function f(){return a.b?a.b(b):a.call(null,b)}var g=null,h=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;g=new Fc(h,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){return B.h(a,b,c,e,f,E([g],0))}c.v=
3;c.B=function(a){var b=H(a);a=J(a);var c=H(a);a=J(a);var e=H(a);a=Gc(a);return d(b,c,e,a)};c.h=d;return c}(),g=function(a,b,g,q){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var p=null;if(3<arguments.length){for(var p=0,r=Array(arguments.length-3);p<r.length;)r[p]=arguments[p+3],++p;p=new Fc(r,0)}return h.h(a,b,g,p)}throw Error("Invalid arity: "+arguments.length);};g.v=3;g.B=h.B;g.m=f;g.b=
e;g.a=d;g.c=c;g.h=h.h;return g}()}Oe;function Pe(a,b){return function d(b,f){return new ne(null,function(){var g=F(f);if(g){if(Bd(g)){for(var h=ec(g),l=O(h),m=re(l),n=0;;)if(n<l)te(m,function(){var d=b+n,f=hb.a(h,n);return a.a?a.a(d,f):a.call(null,d,f)}()),n+=1;else break;return se(m.W(),d(b+l,fc(g)))}return M(function(){var d=H(g);return a.a?a.a(b,d):a.call(null,b,d)}(),d(b+1,Gc(g)))}return null},null,null)}(0,b)}function Qe(a,b,c,d){this.state=a;this.w=b;this.fc=d;this.C=16386;this.g=6455296}
k=Qe.prototype;k.equiv=function(a){return this.D(null,a)};k.D=function(a,b){return this===b};k.Fb=function(){return this.state};k.P=function(){return this.w};k.wc=function(a,b,c){a=F(this.fc);for(var d=null,e=0,f=0;;)if(f<e){var g=d.ba(null,f),h=P(g,0),g=P(g,1);g.l?g.l(h,this,b,c):g.call(null,h,this,b,c);f+=1}else if(a=F(a))Bd(a)?(d=ec(a),a=fc(a),h=d,e=O(d),d=h):(d=H(a),h=P(d,0),g=P(d,1),g.l?g.l(h,this,b,c):g.call(null,h,this,b,c),a=J(a),d=null,e=0),f=0;else return null};
k.vc=function(a,b,c){this.fc=Q.c(this.fc,b,c);return this};k.S=function(){return da(this)};var W=function W(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return W.b(arguments[0]);default:return W.h(arguments[0],new Fc(c.slice(1),0))}};W.b=function(a){return new Qe(a,null,0,null)};W.h=function(a,b){var c=null!=b&&(b.g&64||b.F)?B.a(Sc,b):b,d=C.a(c,La);C.a(c,Re);return new Qe(a,d,0,null)};W.B=function(a){var b=H(a);a=J(a);return W.h(b,a)};
W.v=1;Se;function Te(a,b){if(a instanceof Qe){var c=a.state;a.state=b;null!=a.fc&&Vb(a,c,b);return b}return jc(a,b)}
var Ue=function Ue(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ue.a(arguments[0],arguments[1]);case 3:return Ue.c(arguments[0],arguments[1],arguments[2]);case 4:return Ue.l(arguments[0],arguments[1],arguments[2],arguments[3]);default:return Ue.h(arguments[0],arguments[1],arguments[2],arguments[3],new Fc(c.slice(4),0))}};Ue.a=function(a,b){var c;a instanceof Qe?(c=a.state,c=b.b?b.b(c):b.call(null,c),c=Te(a,c)):c=kc.a(a,b);return c};
Ue.c=function(a,b,c){if(a instanceof Qe){var d=a.state;b=b.a?b.a(d,c):b.call(null,d,c);a=Te(a,b)}else a=kc.c(a,b,c);return a};Ue.l=function(a,b,c,d){if(a instanceof Qe){var e=a.state;b=b.c?b.c(e,c,d):b.call(null,e,c,d);a=Te(a,b)}else a=kc.l(a,b,c,d);return a};Ue.h=function(a,b,c,d,e){return a instanceof Qe?Te(a,B.A(b,a.state,c,d,e)):kc.A(a,b,c,d,e)};Ue.B=function(a){var b=H(a),c=J(a);a=H(c);var d=J(c),c=H(d),e=J(d),d=H(e),e=J(e);return Ue.h(b,a,c,d,e)};Ue.v=4;
function Ve(a){this.state=a;this.g=32768;this.C=0}Ve.prototype.Fb=function(){return this.state};function Oe(a){return new Ve(a)}
var T=function T(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return T.b(arguments[0]);case 2:return T.a(arguments[0],arguments[1]);case 3:return T.c(arguments[0],arguments[1],arguments[2]);case 4:return T.l(arguments[0],arguments[1],arguments[2],arguments[3]);default:return T.h(arguments[0],arguments[1],arguments[2],arguments[3],new Fc(c.slice(4),0))}};
T.b=function(a){return function(b){return function(){function c(c,d){var e=a.b?a.b(d):a.call(null,d);return b.a?b.a(c,e):b.call(null,c,e)}function d(a){return b.b?b.b(a):b.call(null,a)}function e(){return b.m?b.m():b.call(null)}var f=null,g=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new Fc(g,0)}return d.call(this,a,b,f)}function d(c,e,f){e=B.c(a,e,f);return b.a?b.a(c,e):b.call(null,c,e)}c.v=2;c.B=function(a){var b=
H(a);a=J(a);var c=H(a);a=Gc(a);return d(b,c,a)};c.h=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var n=null;if(2<arguments.length){for(var n=0,q=Array(arguments.length-2);n<q.length;)q[n]=arguments[n+2],++n;n=new Fc(q,0)}return g.h(a,b,n)}throw Error("Invalid arity: "+arguments.length);};f.v=2;f.B=g.B;f.m=e;f.b=d;f.a=c;f.h=g.h;return f}()}};
T.a=function(a,b){return new ne(null,function(){var c=F(b);if(c){if(Bd(c)){for(var d=ec(c),e=O(d),f=re(e),g=0;;)if(g<e)te(f,function(){var b=hb.a(d,g);return a.b?a.b(b):a.call(null,b)}()),g+=1;else break;return se(f.W(),T.a(a,fc(c)))}return M(function(){var b=H(c);return a.b?a.b(b):a.call(null,b)}(),T.a(a,Gc(c)))}return null},null,null)};
T.c=function(a,b,c){return new ne(null,function(){var d=F(b),e=F(c);if(d&&e){var f=M,g;g=H(d);var h=H(e);g=a.a?a.a(g,h):a.call(null,g,h);d=f(g,T.c(a,Gc(d),Gc(e)))}else d=null;return d},null,null)};T.l=function(a,b,c,d){return new ne(null,function(){var e=F(b),f=F(c),g=F(d);if(e&&f&&g){var h=M,l;l=H(e);var m=H(f),n=H(g);l=a.c?a.c(l,m,n):a.call(null,l,m,n);e=h(l,T.l(a,Gc(e),Gc(f),Gc(g)))}else e=null;return e},null,null)};
T.h=function(a,b,c,d,e){var f=function h(a){return new ne(null,function(){var b=T.a(F,a);return Ie(Od,b)?M(T.a(H,b),h(T.a(Gc,b))):null},null,null)};return T.a(function(){return function(b){return B.a(a,b)}}(f),f(ld.h(e,d,E([c,b],0))))};T.B=function(a){var b=H(a),c=J(a);a=H(c);var d=J(c),c=H(d),e=J(d),d=H(e),e=J(e);return T.h(b,a,c,d,e)};T.v=4;function We(a,b){return new ne(null,function(){if(0<a){var c=F(b);return c?M(H(c),We(a-1,Gc(c))):null}return null},null,null)}
function Xe(a,b){return new ne(null,function(c){return function(){return c(a,b)}}(function(a,b){for(;;){var e=F(b);if(0<a&&e){var f=a-1,e=Gc(e);a=f;b=e}else return e}}),null,null)}function Ye(a){return new ne(null,function(){return M(a,Ye(a))},null,null)}function Ze(a){return new ne(null,function(){return M(a.m?a.m():a.call(null),Ze(a))},null,null)}
var $e=function $e(b,c){return M(c,new ne(null,function(){return $e(b,b.b?b.b(c):b.call(null,c))},null,null))},af=function af(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return af.a(arguments[0],arguments[1]);default:return af.h(arguments[0],arguments[1],new Fc(c.slice(2),0))}};af.a=function(a,b){return new ne(null,function(){var c=F(a),d=F(b);return c&&d?M(H(c),M(H(d),af.a(Gc(c),Gc(d)))):null},null,null)};
af.h=function(a,b,c){return new ne(null,function(){var d=T.a(F,ld.h(c,b,E([a],0)));return Ie(Od,d)?xe.a(T.a(H,d),B.a(af,T.a(Gc,d))):null},null,null)};af.B=function(a){var b=H(a),c=J(a);a=H(c);c=J(c);return af.h(b,a,c)};af.v=2;function bf(a){return Xe(1,af.a(Ye("L"),a))}cf;
function df(a,b){return new ne(null,function(){var c=F(b);if(c){if(Bd(c)){for(var d=ec(c),e=O(d),f=re(e),g=0;;)if(g<e){var h;h=hb.a(d,g);h=a.b?a.b(h):a.call(null,h);w(h)&&(h=hb.a(d,g),f.add(h));g+=1}else break;return se(f.W(),df(a,fc(c)))}d=H(c);c=Gc(c);return w(a.b?a.b(d):a.call(null,d))?M(d,df(a,c)):df(a,c)}return null},null,null)}function ef(a,b){return df(Ke(a),b)}
function ff(a){return function c(a){return new ne(null,function(){var e=M,f;w(Gd.b?Gd.b(a):Gd.call(null,a))?(f=E([F.b?F.b(a):F.call(null,a)],0),f=B.a(xe,B.c(T,c,f))):f=null;return e(a,f)},null,null)}(a)}var gf=function gf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return gf.a(arguments[0],arguments[1]);case 3:return gf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};
gf.a=function(a,b){return null!=a?null!=a&&(a.C&4||a.Oc)?Uc(ye($a.c(Yb,Xb(a),b)),td(a)):$a.c(fb,a,b):$a.c(ld,Hc,b)};gf.c=function(a,b,c){return null!=a&&(a.C&4||a.Oc)?Uc(ye(Pd(b,ze,Xb(a),c)),td(a)):Pd(b,ld,a,c)};gf.v=3;function hf(a,b){var c;a:{c=Fd;for(var d=a,e=F(b);;)if(e)if(null!=d?d.g&256||d.tc||(d.g?0:Ta(ob,d)):Ta(ob,d)){d=C.c(d,H(e),c);if(c===d){c=null;break a}e=J(e)}else{c=null;break a}else{c=d;break a}}return c}
var jf=function jf(b,c,d){var e=P(c,0);c=$d(c,1);return w(c)?Q.c(b,e,jf(C.a(b,e),c,d)):Q.c(b,e,d)},kf=function kf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return kf.c(arguments[0],arguments[1],arguments[2]);case 4:return kf.l(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return kf.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);case 6:return kf.T(arguments[0],arguments[1],arguments[2],arguments[3],
arguments[4],arguments[5]);default:return kf.h(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],new Fc(c.slice(6),0))}};kf.c=function(a,b,c){var d=P(b,0);b=$d(b,1);return w(b)?Q.c(a,d,kf.c(C.a(a,d),b,c)):Q.c(a,d,function(){var b=C.a(a,d);return c.b?c.b(b):c.call(null,b)}())};kf.l=function(a,b,c,d){var e=P(b,0);b=$d(b,1);return w(b)?Q.c(a,e,kf.l(C.a(a,e),b,c,d)):Q.c(a,e,function(){var b=C.a(a,e);return c.a?c.a(b,d):c.call(null,b,d)}())};
kf.A=function(a,b,c,d,e){var f=P(b,0);b=$d(b,1);return w(b)?Q.c(a,f,kf.A(C.a(a,f),b,c,d,e)):Q.c(a,f,function(){var b=C.a(a,f);return c.c?c.c(b,d,e):c.call(null,b,d,e)}())};kf.T=function(a,b,c,d,e,f){var g=P(b,0);b=$d(b,1);return w(b)?Q.c(a,g,kf.T(C.a(a,g),b,c,d,e,f)):Q.c(a,g,function(){var b=C.a(a,g);return c.l?c.l(b,d,e,f):c.call(null,b,d,e,f)}())};kf.h=function(a,b,c,d,e,f,g){var h=P(b,0);b=$d(b,1);return w(b)?Q.c(a,h,B.h(kf,C.a(a,h),b,c,d,E([e,f,g],0))):Q.c(a,h,B.h(c,C.a(a,h),d,e,f,E([g],0)))};
kf.B=function(a){var b=H(a),c=J(a);a=H(c);var d=J(c),c=H(d),e=J(d),d=H(e),f=J(e),e=H(f),g=J(f),f=H(g),g=J(g);return kf.h(b,a,c,d,e,f,g)};kf.v=6;
var lf=function lf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return lf.c(arguments[0],arguments[1],arguments[2]);case 4:return lf.l(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return lf.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);case 6:return lf.T(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);default:return lf.h(arguments[0],arguments[1],arguments[2],arguments[3],
arguments[4],arguments[5],new Fc(c.slice(6),0))}};lf.c=function(a,b,c){return Q.c(a,b,function(){var d=C.a(a,b);return c.b?c.b(d):c.call(null,d)}())};lf.l=function(a,b,c,d){return Q.c(a,b,function(){var e=C.a(a,b);return c.a?c.a(e,d):c.call(null,e,d)}())};lf.A=function(a,b,c,d,e){return Q.c(a,b,function(){var f=C.a(a,b);return c.c?c.c(f,d,e):c.call(null,f,d,e)}())};lf.T=function(a,b,c,d,e,f){return Q.c(a,b,function(){var g=C.a(a,b);return c.l?c.l(g,d,e,f):c.call(null,g,d,e,f)}())};
lf.h=function(a,b,c,d,e,f,g){return Q.c(a,b,B.h(c,C.a(a,b),d,e,f,E([g],0)))};lf.B=function(a){var b=H(a),c=J(a);a=H(c);var d=J(c),c=H(d),e=J(d),d=H(e),f=J(e),e=H(f),g=J(f),f=H(g),g=J(g);return lf.h(b,a,c,d,e,f,g)};lf.v=6;function mf(a,b){this.V=a;this.f=b}function nf(a){return new mf(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function of(a){a=a.o;return 32>a?0:a-1>>>5<<5}
function qf(a,b,c){for(;;){if(0===b)return c;var d=nf(a);d.f[0]=c;c=d;b-=5}}var rf=function rf(b,c,d,e){var f=new mf(d.V,Za(d.f)),g=b.o-1>>>c&31;5===c?f.f[g]=e:(d=d.f[g],b=null!=d?rf(b,c-5,d,e):qf(null,c-5,e),f.f[g]=b);return f};function sf(a,b){throw Error([z("No item "),z(a),z(" in vector of length "),z(b)].join(""));}function tf(a,b){if(b>=of(a))return a.O;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.f[b>>>d&31],d=e;else return c.f}function uf(a,b){return 0<=b&&b<a.o?tf(a,b):sf(b,a.o)}
var vf=function vf(b,c,d,e,f){var g=new mf(d.V,Za(d.f));if(0===c)g.f[e&31]=f;else{var h=e>>>c&31;b=vf(b,c-5,d.f[h],e,f);g.f[h]=b}return g};function wf(a,b,c,d,e,f){this.s=a;this.Wb=b;this.f=c;this.Na=d;this.start=e;this.end=f}wf.prototype.ya=function(){return this.s<this.end};wf.prototype.next=function(){32===this.s-this.Wb&&(this.f=tf(this.Na,this.s),this.Wb+=32);var a=this.f[this.s&31];this.s+=1;return a};xf;yf;zf;L;Af;Bf;Cf;
function R(a,b,c,d,e,f){this.w=a;this.o=b;this.shift=c;this.root=d;this.O=e;this.u=f;this.g=167668511;this.C=8196}k=R.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.N=function(a,b){return pb.c(this,b,null)};k.I=function(a,b,c){return"number"===typeof b?hb.c(this,b,c):c};
k.Hb=function(a,b,c){a=0;for(var d=c;;)if(a<this.o){var e=tf(this,a);c=e.length;a:for(var f=0;;)if(f<c){var g=f+a,h=e[f],d=b.c?b.c(d,g,h):b.call(null,d,g,h);if(Xc(d)){e=d;break a}f+=1}else{e=d;break a}if(Xc(e))return L.b?L.b(e):L.call(null,e);a+=c;d=e}else return d};k.ba=function(a,b){return uf(this,b)[b&31]};k.Ea=function(a,b,c){return 0<=b&&b<this.o?tf(this,b)[b&31]:c};
k.fb=function(a,b,c){if(0<=b&&b<this.o)return of(this)<=b?(a=Za(this.O),a[b&31]=c,new R(this.w,this.o,this.shift,this.root,a,null)):new R(this.w,this.o,this.shift,vf(this,this.shift,this.root,b,c),this.O,null);if(b===this.o)return fb(this,c);throw Error([z("Index "),z(b),z(" out of bounds  [0,"),z(this.o),z("]")].join(""));};k.Ha=function(){var a=this.o;return new wf(0,0,0<O(this)?tf(this,0):null,this,0,a)};k.P=function(){return this.w};k.Z=function(){return this.o};
k.Ib=function(){return hb.a(this,0)};k.Jb=function(){return hb.a(this,1)};k.eb=function(){return 0<this.o?hb.a(this,this.o-1):null};k.Zb=function(){return 0<this.o?new dd(this,this.o-1,null):null};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Oc(this)};k.D=function(a,b){if(b instanceof R)if(this.o===O(b))for(var c=lc(this),d=lc(b);;)if(w(c.ya())){var e=c.next(),f=d.next();if(!vc.a(e,f))return!1}else return!0;else return!1;else return Tc(this,b)};
k.qb=function(){return new zf(this.o,this.shift,xf.b?xf.b(this.root):xf.call(null,this.root),yf.b?yf.b(this.O):yf.call(null,this.O))};k.ca=function(){return Uc(md,this.w)};k.ea=function(a,b){return Yc(this,b)};k.fa=function(a,b,c){a=0;for(var d=c;;)if(a<this.o){var e=tf(this,a);c=e.length;a:for(var f=0;;)if(f<c){var g=e[f],d=b.a?b.a(d,g):b.call(null,d,g);if(Xc(d)){e=d;break a}f+=1}else{e=d;break a}if(Xc(e))return L.b?L.b(e):L.call(null,e);a+=c;d=e}else return d};
k.Ra=function(a,b,c){if("number"===typeof b)return Cb(this,b,c);throw Error("Vector's key for assoc must be a number.");};k.U=function(){if(0===this.o)return null;if(32>=this.o)return new Fc(this.O,0);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.f[0];else{a=a.f;break a}}return Cf.l?Cf.l(this,a,0,0):Cf.call(null,this,a,0,0)};k.R=function(a,b){return new R(b,this.o,this.shift,this.root,this.O,this.u)};
k.X=function(a,b){if(32>this.o-of(this)){for(var c=this.O.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.O[e],e+=1;else break;d[c]=b;return new R(this.w,this.o+1,this.shift,this.root,d,null)}c=(d=this.o>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=nf(null),d.f[0]=this.root,e=qf(null,this.shift,new mf(null,this.O)),d.f[1]=e):d=rf(this,this.shift,this.root,new mf(null,this.O));return new R(this.w,this.o+1,c,d,[b],null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.ba(null,c);case 3:return this.Ea(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.ba(null,c)};a.c=function(a,c,d){return this.Ea(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return this.ba(null,a)};k.a=function(a,b){return this.Ea(null,a,b)};
var S=new mf(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),md=new R(null,0,5,S,[],Pc);function Df(a){var b=a.length;if(32>b)return new R(null,b,5,S,a,null);for(var c=32,d=(new R(null,32,5,S,a.slice(0,32),null)).qb(null);;)if(c<b)var e=c+1,d=ze.a(d,a[c]),c=e;else return Zb(d)}R.prototype[Ya]=function(){return Jc(this)};function Nd(a){return Ra(a)?Df(a):Zb($a.c(Yb,Xb(md),a))}
var Ef=function Ef(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Ef.h(0<c.length?new Fc(c.slice(0),0):null)};Ef.h=function(a){return a instanceof Fc&&0===a.s?Df(a.f):Nd(a)};Ef.v=0;Ef.B=function(a){return Ef.h(F(a))};Ff;function Ad(a,b,c,d,e,f){this.Ga=a;this.node=b;this.s=c;this.ua=d;this.w=e;this.u=f;this.g=32375020;this.C=1536}k=Ad.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.w};
k.wa=function(){if(this.ua+1<this.node.length){var a;a=this.Ga;var b=this.node,c=this.s,d=this.ua+1;a=Cf.l?Cf.l(a,b,c,d):Cf.call(null,a,b,c,d);return null==a?null:a}return gc(this)};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Oc(this)};k.D=function(a,b){return Tc(this,b)};k.ca=function(){return Uc(md,this.w)};k.ea=function(a,b){var c;c=this.Ga;var d=this.s+this.ua,e=O(this.Ga);c=Ff.c?Ff.c(c,d,e):Ff.call(null,c,d,e);return Yc(c,b)};
k.fa=function(a,b,c){a=this.Ga;var d=this.s+this.ua,e=O(this.Ga);a=Ff.c?Ff.c(a,d,e):Ff.call(null,a,d,e);return Zc(a,b,c)};k.ta=function(){return this.node[this.ua]};k.xa=function(){if(this.ua+1<this.node.length){var a;a=this.Ga;var b=this.node,c=this.s,d=this.ua+1;a=Cf.l?Cf.l(a,b,c,d):Cf.call(null,a,b,c,d);return null==a?Hc:a}return fc(this)};k.U=function(){return this};k.jc=function(){var a=this.node;return new pe(a,this.ua,a.length)};
k.kc=function(){var a=this.s+this.node.length;if(a<cb(this.Ga)){var b=this.Ga,c=tf(this.Ga,a);return Cf.l?Cf.l(b,c,a,0):Cf.call(null,b,c,a,0)}return Hc};k.R=function(a,b){return Cf.A?Cf.A(this.Ga,this.node,this.s,this.ua,b):Cf.call(null,this.Ga,this.node,this.s,this.ua,b)};k.X=function(a,b){return M(b,this)};k.ic=function(){var a=this.s+this.node.length;if(a<cb(this.Ga)){var b=this.Ga,c=tf(this.Ga,a);return Cf.l?Cf.l(b,c,a,0):Cf.call(null,b,c,a,0)}return null};Ad.prototype[Ya]=function(){return Jc(this)};
var Cf=function Cf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Cf.c(arguments[0],arguments[1],arguments[2]);case 4:return Cf.l(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Cf.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};Cf.c=function(a,b,c){return new Ad(a,uf(a,b),b,c,null,null)};
Cf.l=function(a,b,c,d){return new Ad(a,b,c,d,null,null)};Cf.A=function(a,b,c,d,e){return new Ad(a,b,c,d,e,null)};Cf.v=5;Gf;function Hf(a,b,c,d,e){this.w=a;this.Na=b;this.start=c;this.end=d;this.u=e;this.g=167666463;this.C=8192}k=Hf.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.N=function(a,b){return pb.c(this,b,null)};k.I=function(a,b,c){return"number"===typeof b?hb.c(this,b,c):c};
k.Hb=function(a,b,c){a=this.start;for(var d=0;;)if(a<this.end){var e=d,f=hb.a(this.Na,a);c=b.c?b.c(c,e,f):b.call(null,c,e,f);if(Xc(c))return L.b?L.b(c):L.call(null,c);d+=1;a+=1}else return c};k.ba=function(a,b){return 0>b||this.end<=this.start+b?sf(b,this.end-this.start):hb.a(this.Na,this.start+b)};k.Ea=function(a,b,c){return 0>b||this.end<=this.start+b?c:hb.c(this.Na,this.start+b,c)};
k.fb=function(a,b,c){var d=this.start+b;a=this.w;c=Q.c(this.Na,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return Gf.A?Gf.A(a,c,b,d,null):Gf.call(null,a,c,b,d,null)};k.P=function(){return this.w};k.Z=function(){return this.end-this.start};k.eb=function(){return hb.a(this.Na,this.end-1)};k.Zb=function(){return this.start!==this.end?new dd(this,this.end-this.start-1,null):null};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Oc(this)};k.D=function(a,b){return Tc(this,b)};
k.ca=function(){return Uc(md,this.w)};k.ea=function(a,b){return Yc(this,b)};k.fa=function(a,b,c){return Zc(this,b,c)};k.Ra=function(a,b,c){if("number"===typeof b)return Cb(this,b,c);throw Error("Subvec's key for assoc must be a number.");};k.U=function(){var a=this;return function(b){return function d(e){return e===a.end?null:M(hb.a(a.Na,e),new ne(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};
k.R=function(a,b){return Gf.A?Gf.A(b,this.Na,this.start,this.end,this.u):Gf.call(null,b,this.Na,this.start,this.end,this.u)};k.X=function(a,b){var c=this.w,d=Cb(this.Na,this.end,b),e=this.start,f=this.end+1;return Gf.A?Gf.A(c,d,e,f,null):Gf.call(null,c,d,e,f,null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.ba(null,c);case 3:return this.Ea(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.ba(null,c)};a.c=function(a,c,d){return this.Ea(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return this.ba(null,a)};k.a=function(a,b){return this.Ea(null,a,b)};Hf.prototype[Ya]=function(){return Jc(this)};
function Gf(a,b,c,d,e){for(;;)if(b instanceof Hf)c=b.start+c,d=b.start+d,b=b.Na;else{var f=O(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new Hf(a,b,c,d,e)}}var Ff=function Ff(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ff.a(arguments[0],arguments[1]);case 3:return Ff.c(arguments[0],arguments[1],arguments[2]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};
Ff.a=function(a,b){return Ff.c(a,b,O(a))};Ff.c=function(a,b,c){return Gf(null,a,b,c,null)};Ff.v=3;function If(a,b){return a===b.V?b:new mf(a,Za(b.f))}function xf(a){return new mf({},Za(a.f))}function yf(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];Ed(a,0,b,0,a.length);return b}
var Jf=function Jf(b,c,d,e){d=If(b.root.V,d);var f=b.o-1>>>c&31;if(5===c)b=e;else{var g=d.f[f];b=null!=g?Jf(b,c-5,g,e):qf(b.root.V,c-5,e)}d.f[f]=b;return d};function zf(a,b,c,d){this.o=a;this.shift=b;this.root=c;this.O=d;this.C=88;this.g=275}k=zf.prototype;
k.Nb=function(a,b){if(this.root.V){if(32>this.o-of(this))this.O[this.o&31]=b;else{var c=new mf(this.root.V,this.O),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.O=d;if(this.o>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=qf(this.root.V,this.shift,c);this.root=new mf(this.root.V,d);this.shift=e}else this.root=Jf(this,this.shift,this.root,c)}this.o+=1;return this}throw Error("conj! after persistent!");};k.Ob=function(){if(this.root.V){this.root.V=null;var a=this.o-of(this),b=Array(a);Ed(this.O,0,b,0,a);return new R(null,this.o,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
k.Mb=function(a,b,c){if("number"===typeof b)return ac(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
k.uc=function(a,b,c){var d=this;if(d.root.V){if(0<=b&&b<d.o)return of(this)<=b?d.O[b&31]=c:(a=function(){return function f(a,h){var l=If(d.root.V,h);if(0===a)l.f[b&31]=c;else{var m=b>>>a&31,n=f(a-5,l.f[m]);l.f[m]=n}return l}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.o)return Yb(this,c);throw Error([z("Index "),z(b),z(" out of bounds for TransientVector of length"),z(d.o)].join(""));}throw Error("assoc! after persistent!");};
k.Z=function(){if(this.root.V)return this.o;throw Error("count after persistent!");};k.ba=function(a,b){if(this.root.V)return uf(this,b)[b&31];throw Error("nth after persistent!");};k.Ea=function(a,b,c){return 0<=b&&b<this.o?hb.a(this,b):c};k.N=function(a,b){return pb.c(this,b,null)};k.I=function(a,b,c){return"number"===typeof b?hb.c(this,b,c):c};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};function Kf(){this.g=2097152;this.C=0}
Kf.prototype.equiv=function(a){return this.D(null,a)};Kf.prototype.D=function(){return!1};var Lf=new Kf;function Mf(a,b){return Hd(xd(b)?O(a)===O(b)?Ie(Od,T.a(function(a){return vc.a(C.c(b,H(a),Lf),jd(a))},a)):null:null)}function Nf(a,b,c,d,e){this.s=a;this.pd=b;this.pc=c;this.cd=d;this.Hc=e}Nf.prototype.ya=function(){var a=this.s<this.pc;return a?a:this.Hc.ya()};Nf.prototype.next=function(){if(this.s<this.pc){var a=od(this.cd,this.s);this.s+=1;return new R(null,2,5,S,[a,pb.a(this.pd,a)],null)}return this.Hc.next()};
Nf.prototype.remove=function(){return Error("Unsupported operation")};function Of(a){this.H=a}Of.prototype.next=function(){if(null!=this.H){var a=H(this.H),b=P(a,0),a=P(a,1);this.H=J(this.H);return{value:[b,a],done:!1}}return{value:null,done:!0}};function Pf(a){return new Of(F(a))}function Qf(a){this.H=a}Qf.prototype.next=function(){if(null!=this.H){var a=H(this.H);this.H=J(this.H);return{value:[a,a],done:!1}}return{value:null,done:!0}};
function Rf(a,b){var c;if(b instanceof x)a:{c=a.length;for(var d=b.Ia,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof x&&d===a[e].Ia){c=e;break a}e+=2}}else if("string"==typeof b||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof uc)a:for(c=a.length,d=b.Va,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof uc&&d===a[e].Va){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=
a.length,d=0;;){if(c<=d){c=-1;break a}if(vc.a(b,a[d])){c=d;break a}d+=2}return c}Sf;function Tf(a,b,c){this.f=a;this.s=b;this.Da=c;this.g=32374990;this.C=0}k=Tf.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.Da};k.wa=function(){return this.s<this.f.length-2?new Tf(this.f,this.s+2,this.Da):null};k.Z=function(){return(this.f.length-this.s)/2};k.S=function(){return Oc(this)};k.D=function(a,b){return Tc(this,b)};
k.ca=function(){return Uc(Hc,this.Da)};k.ea=function(a,b){return id.a(b,this)};k.fa=function(a,b,c){return id.c(b,c,this)};k.ta=function(){return new R(null,2,5,S,[this.f[this.s],this.f[this.s+1]],null)};k.xa=function(){return this.s<this.f.length-2?new Tf(this.f,this.s+2,this.Da):Hc};k.U=function(){return this};k.R=function(a,b){return new Tf(this.f,this.s,b)};k.X=function(a,b){return M(b,this)};Tf.prototype[Ya]=function(){return Jc(this)};Uf;Vf;function Wf(a,b,c){this.f=a;this.s=b;this.o=c}
Wf.prototype.ya=function(){return this.s<this.o};Wf.prototype.next=function(){var a=new R(null,2,5,S,[this.f[this.s],this.f[this.s+1]],null);this.s+=2;return a};function v(a,b,c,d){this.w=a;this.o=b;this.f=c;this.u=d;this.g=16647951;this.C=8196}k=v.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.keys=function(){return Jc(Uf.b?Uf.b(this):Uf.call(null,this))};k.entries=function(){return Pf(F(this))};
k.values=function(){return Jc(Vf.b?Vf.b(this):Vf.call(null,this))};k.has=function(a){return Id(this,a)};k.get=function(a,b){return this.I(null,a,b)};k.forEach=function(a){for(var b=F(this),c=null,d=0,e=0;;)if(e<d){var f=c.ba(null,e),g=P(f,0),f=P(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=F(b))Bd(b)?(c=ec(b),b=fc(b),g=c,d=O(c),c=g):(c=H(b),g=P(c,0),f=P(c,1),a.a?a.a(f,g):a.call(null,f,g),b=J(b),c=null,d=0),e=0;else return null};k.N=function(a,b){return pb.c(this,b,null)};
k.I=function(a,b,c){a=Rf(this.f,b);return-1===a?c:this.f[a+1]};k.Hb=function(a,b,c){a=this.f.length;for(var d=0;;)if(d<a){var e=this.f[d],f=this.f[d+1];c=b.c?b.c(c,e,f):b.call(null,c,e,f);if(Xc(c))return L.b?L.b(c):L.call(null,c);d+=2}else return c};k.Ha=function(){return new Wf(this.f,0,2*this.o)};k.P=function(){return this.w};k.Z=function(){return this.o};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Qc(this)};
k.D=function(a,b){if(null!=b&&(b.g&1024||b.Rc)){var c=this.f.length;if(this.o===b.Z(null))for(var d=0;;)if(d<c){var e=b.I(null,this.f[d],Fd);if(e!==Fd)if(vc.a(this.f[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return Mf(this,b)};k.qb=function(){return new Sf({},this.f.length,Za(this.f))};k.ca=function(){return Hb(V,this.w)};k.ea=function(a,b){return id.a(b,this)};k.fa=function(a,b,c){return id.c(b,c,this)};
k.sb=function(a,b){if(0<=Rf(this.f,b)){var c=this.f.length,d=c-2;if(0===d)return db(this);for(var d=Array(d),e=0,f=0;;){if(e>=c)return new v(this.w,this.o-1,d,null);vc.a(b,this.f[e])||(d[f]=this.f[e],d[f+1]=this.f[e+1],f+=2);e+=2}}else return this};
k.Ra=function(a,b,c){a=Rf(this.f,b);if(-1===a){if(this.o<Xf){a=this.f;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new v(this.w,this.o+1,e,null)}return Hb(sb(gf.a(Yf,this),b,c),this.w)}if(c===this.f[a+1])return this;b=Za(this.f);b[a+1]=c;return new v(this.w,this.o,b,null)};k.hc=function(a,b){return-1!==Rf(this.f,b)};k.U=function(){var a=this.f;return 0<=a.length-2?new Tf(a,0,null):null};k.R=function(a,b){return new v(b,this.o,this.f,this.u)};
k.X=function(a,b){if(yd(b))return sb(this,hb.a(b,0),hb.a(b,1));for(var c=this,d=F(b);;){if(null==d)return c;var e=H(d);if(yd(e))c=sb(c,hb.a(e,0),hb.a(e,1)),d=J(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};var V=new v(null,0,[],Rc),Xf=8;v.prototype[Ya]=function(){return Jc(this)};
Zf;function Sf(a,b,c){this.xb=a;this.lb=b;this.f=c;this.g=258;this.C=56}k=Sf.prototype;k.Z=function(){if(w(this.xb))return Yd(this.lb);throw Error("count after persistent!");};k.N=function(a,b){return pb.c(this,b,null)};k.I=function(a,b,c){if(w(this.xb))return a=Rf(this.f,b),-1===a?c:this.f[a+1];throw Error("lookup after persistent!");};
k.Nb=function(a,b){if(w(this.xb)){if(null!=b?b.g&2048||b.Sc||(b.g?0:Ta(vb,b)):Ta(vb,b))return $b(this,be.b?be.b(b):be.call(null,b),ce.b?ce.b(b):ce.call(null,b));for(var c=F(b),d=this;;){var e=H(c);if(w(e))c=J(c),d=$b(d,be.b?be.b(e):be.call(null,e),ce.b?ce.b(e):ce.call(null,e));else return d}}else throw Error("conj! after persistent!");};k.Ob=function(){if(w(this.xb))return this.xb=!1,new v(null,Yd(this.lb),this.f,null);throw Error("persistent! called twice");};
k.Mb=function(a,b,c){if(w(this.xb)){a=Rf(this.f,b);if(-1===a)return this.lb+2<=2*Xf?(this.lb+=2,this.f.push(b),this.f.push(c),this):Ae(Zf.a?Zf.a(this.lb,this.f):Zf.call(null,this.lb,this.f),b,c);c!==this.f[a+1]&&(this.f[a+1]=c);return this}throw Error("assoc! after persistent!");};$f;pd;function Zf(a,b){for(var c=Xb(Yf),d=0;;)if(d<a)c=$b(c,b[d],b[d+1]),d+=2;else return c}function ag(){this.G=!1}bg;cg;Te;dg;W;L;function eg(a,b){return a===b?!0:le(a,b)?!0:vc.a(a,b)}
function fg(a,b,c){a=Za(a);a[b]=c;return a}function gg(a,b){var c=Array(a.length-2);Ed(a,0,c,0,2*b);Ed(a,2*(b+1),c,2*b,c.length-2*b);return c}function hg(a,b,c,d){a=a.hb(b);a.f[c]=d;return a}function ig(a,b,c){for(var d=a.length,e=0,f=c;;)if(e<d){c=a[e];if(null!=c){var g=a[e+1];c=b.c?b.c(f,c,g):b.call(null,f,c,g)}else c=a[e+1],c=null!=c?c.kb(b,f):f;if(Xc(c))return L.b?L.b(c):L.call(null,c);e+=2;f=c}else return f}jg;function kg(a,b,c,d){this.f=a;this.s=b;this.Vb=c;this.Qa=d}
kg.prototype.advance=function(){for(var a=this.f.length;;)if(this.s<a){var b=this.f[this.s],c=this.f[this.s+1];null!=b?b=this.Vb=new R(null,2,5,S,[b,c],null):null!=c?(b=lc(c),b=b.ya()?this.Qa=b:!1):b=!1;this.s+=2;if(b)return!0}else return!1};kg.prototype.ya=function(){var a=null!=this.Vb;return a?a:(a=null!=this.Qa)?a:this.advance()};
kg.prototype.next=function(){if(null!=this.Vb){var a=this.Vb;this.Vb=null;return a}if(null!=this.Qa)return a=this.Qa.next(),this.Qa.ya()||(this.Qa=null),a;if(this.advance())return this.next();throw Error("No such element");};kg.prototype.remove=function(){return Error("Unsupported operation")};function lg(a,b,c){this.V=a;this.Y=b;this.f=c}k=lg.prototype;k.hb=function(a){if(a===this.V)return this;var b=Zd(this.Y),c=Array(0>b?4:2*(b+1));Ed(this.f,0,c,0,2*b);return new lg(a,this.Y,c)};
k.Sb=function(){return bg.b?bg.b(this.f):bg.call(null,this.f)};k.kb=function(a,b){return ig(this.f,a,b)};k.$a=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.Y&e))return d;var f=Zd(this.Y&e-1),e=this.f[2*f],f=this.f[2*f+1];return null==e?f.$a(a+5,b,c,d):eg(c,e)?f:d};
k.Pa=function(a,b,c,d,e,f){var g=1<<(c>>>b&31),h=Zd(this.Y&g-1);if(0===(this.Y&g)){var l=Zd(this.Y);if(2*l<this.f.length){a=this.hb(a);b=a.f;f.G=!0;a:for(c=2*(l-h),f=2*h+(c-1),l=2*(h+1)+(c-1);;){if(0===c)break a;b[l]=b[f];--l;--c;--f}b[2*h]=d;b[2*h+1]=e;a.Y|=g;return a}if(16<=l){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[c>>>b&31]=mg.Pa(a,b+5,c,d,e,f);for(e=d=0;;)if(32>d)0!==
(this.Y>>>d&1)&&(h[d]=null!=this.f[e]?mg.Pa(a,b+5,Ac(this.f[e]),this.f[e],this.f[e+1],f):this.f[e+1],e+=2),d+=1;else break;return new jg(a,l+1,h)}b=Array(2*(l+4));Ed(this.f,0,b,0,2*h);b[2*h]=d;b[2*h+1]=e;Ed(this.f,2*h,b,2*(h+1),2*(l-h));f.G=!0;a=this.hb(a);a.f=b;a.Y|=g;return a}l=this.f[2*h];g=this.f[2*h+1];if(null==l)return l=g.Pa(a,b+5,c,d,e,f),l===g?this:hg(this,a,2*h+1,l);if(eg(d,l))return e===g?this:hg(this,a,2*h+1,e);f.G=!0;f=b+5;d=dg.aa?dg.aa(a,f,l,g,c,d,e):dg.call(null,a,f,l,g,c,d,e);e=2*
h;h=2*h+1;a=this.hb(a);a.f[e]=null;a.f[h]=d;return a};
k.Oa=function(a,b,c,d,e){var f=1<<(b>>>a&31),g=Zd(this.Y&f-1);if(0===(this.Y&f)){var h=Zd(this.Y);if(16<=h){g=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];g[b>>>a&31]=mg.Oa(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.Y>>>c&1)&&(g[c]=null!=this.f[d]?mg.Oa(a+5,Ac(this.f[d]),this.f[d],this.f[d+1],e):this.f[d+1],d+=2),c+=1;else break;return new jg(null,h+1,g)}a=Array(2*(h+1));Ed(this.f,
0,a,0,2*g);a[2*g]=c;a[2*g+1]=d;Ed(this.f,2*g,a,2*(g+1),2*(h-g));e.G=!0;return new lg(null,this.Y|f,a)}var l=this.f[2*g],f=this.f[2*g+1];if(null==l)return h=f.Oa(a+5,b,c,d,e),h===f?this:new lg(null,this.Y,fg(this.f,2*g+1,h));if(eg(c,l))return d===f?this:new lg(null,this.Y,fg(this.f,2*g+1,d));e.G=!0;e=this.Y;h=this.f;a+=5;a=dg.T?dg.T(a,l,f,b,c,d):dg.call(null,a,l,f,b,c,d);c=2*g;g=2*g+1;d=Za(h);d[c]=null;d[g]=a;return new lg(null,e,d)};
k.Tb=function(a,b,c){var d=1<<(b>>>a&31);if(0===(this.Y&d))return this;var e=Zd(this.Y&d-1),f=this.f[2*e],g=this.f[2*e+1];return null==f?(a=g.Tb(a+5,b,c),a===g?this:null!=a?new lg(null,this.Y,fg(this.f,2*e+1,a)):this.Y===d?null:new lg(null,this.Y^d,gg(this.f,e))):eg(c,f)?new lg(null,this.Y^d,gg(this.f,e)):this};k.Ha=function(){return new kg(this.f,0,null,null)};var mg=new lg(null,0,[]);function ng(a,b,c){this.f=a;this.s=b;this.Qa=c}
ng.prototype.ya=function(){for(var a=this.f.length;;){if(null!=this.Qa&&this.Qa.ya())return!0;if(this.s<a){var b=this.f[this.s];this.s+=1;null!=b&&(this.Qa=lc(b))}else return!1}};ng.prototype.next=function(){if(this.ya())return this.Qa.next();throw Error("No such element");};ng.prototype.remove=function(){return Error("Unsupported operation")};function jg(a,b,c){this.V=a;this.o=b;this.f=c}k=jg.prototype;k.hb=function(a){return a===this.V?this:new jg(a,this.o,Za(this.f))};
k.Sb=function(){return cg.b?cg.b(this.f):cg.call(null,this.f)};k.kb=function(a,b){for(var c=this.f.length,d=0,e=b;;)if(d<c){var f=this.f[d];if(null!=f&&(e=f.kb(a,e),Xc(e)))return L.b?L.b(e):L.call(null,e);d+=1}else return e};k.$a=function(a,b,c,d){var e=this.f[b>>>a&31];return null!=e?e.$a(a+5,b,c,d):d};k.Pa=function(a,b,c,d,e,f){var g=c>>>b&31,h=this.f[g];if(null==h)return a=hg(this,a,g,mg.Pa(a,b+5,c,d,e,f)),a.o+=1,a;b=h.Pa(a,b+5,c,d,e,f);return b===h?this:hg(this,a,g,b)};
k.Oa=function(a,b,c,d,e){var f=b>>>a&31,g=this.f[f];if(null==g)return new jg(null,this.o+1,fg(this.f,f,mg.Oa(a+5,b,c,d,e)));a=g.Oa(a+5,b,c,d,e);return a===g?this:new jg(null,this.o,fg(this.f,f,a))};
k.Tb=function(a,b,c){var d=b>>>a&31,e=this.f[d];if(null!=e){a=e.Tb(a+5,b,c);if(a===e)d=this;else if(null==a)if(8>=this.o)a:{e=this.f;a=e.length;b=Array(2*(this.o-1));c=0;for(var f=1,g=0;;)if(c<a)c!==d&&null!=e[c]&&(b[f]=e[c],f+=2,g|=1<<c),c+=1;else{d=new lg(null,g,b);break a}}else d=new jg(null,this.o-1,fg(this.f,d,a));else d=new jg(null,this.o,fg(this.f,d,a));return d}return this};k.Ha=function(){return new ng(this.f,0,null)};
function og(a,b,c){b*=2;for(var d=0;;)if(d<b){if(eg(c,a[d]))return d;d+=2}else return-1}function pg(a,b,c,d){this.V=a;this.Xa=b;this.o=c;this.f=d}k=pg.prototype;k.hb=function(a){if(a===this.V)return this;var b=Array(2*(this.o+1));Ed(this.f,0,b,0,2*this.o);return new pg(a,this.Xa,this.o,b)};k.Sb=function(){return bg.b?bg.b(this.f):bg.call(null,this.f)};k.kb=function(a,b){return ig(this.f,a,b)};k.$a=function(a,b,c,d){a=og(this.f,this.o,c);return 0>a?d:eg(c,this.f[a])?this.f[a+1]:d};
k.Pa=function(a,b,c,d,e,f){if(c===this.Xa){b=og(this.f,this.o,d);if(-1===b){if(this.f.length>2*this.o)return b=2*this.o,c=2*this.o+1,a=this.hb(a),a.f[b]=d,a.f[c]=e,f.G=!0,a.o+=1,a;c=this.f.length;b=Array(c+2);Ed(this.f,0,b,0,c);b[c]=d;b[c+1]=e;f.G=!0;d=this.o+1;a===this.V?(this.f=b,this.o=d,a=this):a=new pg(this.V,this.Xa,d,b);return a}return this.f[b+1]===e?this:hg(this,a,b+1,e)}return(new lg(a,1<<(this.Xa>>>b&31),[null,this,null,null])).Pa(a,b,c,d,e,f)};
k.Oa=function(a,b,c,d,e){return b===this.Xa?(a=og(this.f,this.o,c),-1===a?(a=2*this.o,b=Array(a+2),Ed(this.f,0,b,0,a),b[a]=c,b[a+1]=d,e.G=!0,new pg(null,this.Xa,this.o+1,b)):vc.a(this.f[a],d)?this:new pg(null,this.Xa,this.o,fg(this.f,a+1,d))):(new lg(null,1<<(this.Xa>>>a&31),[null,this])).Oa(a,b,c,d,e)};k.Tb=function(a,b,c){a=og(this.f,this.o,c);return-1===a?this:1===this.o?null:new pg(null,this.Xa,this.o-1,gg(this.f,Yd(a)))};k.Ha=function(){return new kg(this.f,0,null,null)};
var dg=function dg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return dg.T(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return dg.aa(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};
dg.T=function(a,b,c,d,e,f){var g=Ac(b);if(g===d)return new pg(null,g,2,[b,c,e,f]);var h=new ag;return mg.Oa(a,g,b,c,h).Oa(a,d,e,f,h)};dg.aa=function(a,b,c,d,e,f,g){var h=Ac(c);if(h===e)return new pg(null,h,2,[c,d,f,g]);var l=new ag;return mg.Pa(a,b,h,c,d,l).Pa(a,b,e,f,g,l)};dg.v=7;function qg(a,b,c,d,e){this.w=a;this.ab=b;this.s=c;this.H=d;this.u=e;this.g=32374860;this.C=0}k=qg.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.w};
k.S=function(){var a=this.u;return null!=a?a:this.u=a=Oc(this)};k.D=function(a,b){return Tc(this,b)};k.ca=function(){return Uc(Hc,this.w)};k.ea=function(a,b){return id.a(b,this)};k.fa=function(a,b,c){return id.c(b,c,this)};k.ta=function(){return null==this.H?new R(null,2,5,S,[this.ab[this.s],this.ab[this.s+1]],null):H(this.H)};
k.xa=function(){if(null==this.H){var a=this.ab,b=this.s+2;return bg.c?bg.c(a,b,null):bg.call(null,a,b,null)}var a=this.ab,b=this.s,c=J(this.H);return bg.c?bg.c(a,b,c):bg.call(null,a,b,c)};k.U=function(){return this};k.R=function(a,b){return new qg(b,this.ab,this.s,this.H,this.u)};k.X=function(a,b){return M(b,this)};qg.prototype[Ya]=function(){return Jc(this)};
var bg=function bg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return bg.b(arguments[0]);case 3:return bg.c(arguments[0],arguments[1],arguments[2]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};bg.b=function(a){return bg.c(a,0,null)};
bg.c=function(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new qg(null,a,b,null,null);var d=a[b+1];if(w(d)&&(d=d.Sb(),w(d)))return new qg(null,a,b+2,d,null);b+=2}else return null;else return new qg(null,a,b,c,null)};bg.v=3;function rg(a,b,c,d,e){this.w=a;this.ab=b;this.s=c;this.H=d;this.u=e;this.g=32374860;this.C=0}k=rg.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.w};
k.S=function(){var a=this.u;return null!=a?a:this.u=a=Oc(this)};k.D=function(a,b){return Tc(this,b)};k.ca=function(){return Uc(Hc,this.w)};k.ea=function(a,b){return id.a(b,this)};k.fa=function(a,b,c){return id.c(b,c,this)};k.ta=function(){return H(this.H)};k.xa=function(){var a=this.ab,b=this.s,c=J(this.H);return cg.l?cg.l(null,a,b,c):cg.call(null,null,a,b,c)};k.U=function(){return this};k.R=function(a,b){return new rg(b,this.ab,this.s,this.H,this.u)};k.X=function(a,b){return M(b,this)};
rg.prototype[Ya]=function(){return Jc(this)};var cg=function cg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return cg.b(arguments[0]);case 4:return cg.l(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};cg.b=function(a){return cg.l(null,a,0,null)};
cg.l=function(a,b,c,d){if(null==d)for(d=b.length;;)if(c<d){var e=b[c];if(w(e)&&(e=e.Sb(),w(e)))return new rg(a,b,c+1,e,null);c+=1}else return null;else return new rg(a,b,c,d,null)};cg.v=4;$f;function sg(a,b,c){this.Aa=a;this.Kc=b;this.oc=c}sg.prototype.ya=function(){return this.oc&&this.Kc.ya()};sg.prototype.next=function(){if(this.oc)return this.Kc.next();this.oc=!0;return this.Aa};sg.prototype.remove=function(){return Error("Unsupported operation")};
function pd(a,b,c,d,e,f){this.w=a;this.o=b;this.root=c;this.za=d;this.Aa=e;this.u=f;this.g=16123663;this.C=8196}k=pd.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.keys=function(){return Jc(Uf.b?Uf.b(this):Uf.call(null,this))};k.entries=function(){return Pf(F(this))};k.values=function(){return Jc(Vf.b?Vf.b(this):Vf.call(null,this))};k.has=function(a){return Id(this,a)};k.get=function(a,b){return this.I(null,a,b)};
k.forEach=function(a){for(var b=F(this),c=null,d=0,e=0;;)if(e<d){var f=c.ba(null,e),g=P(f,0),f=P(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=F(b))Bd(b)?(c=ec(b),b=fc(b),g=c,d=O(c),c=g):(c=H(b),g=P(c,0),f=P(c,1),a.a?a.a(f,g):a.call(null,f,g),b=J(b),c=null,d=0),e=0;else return null};k.N=function(a,b){return pb.c(this,b,null)};k.I=function(a,b,c){return null==b?this.za?this.Aa:c:null==this.root?c:this.root.$a(0,Ac(b),b,c)};
k.Hb=function(a,b,c){a=this.za?b.c?b.c(c,null,this.Aa):b.call(null,c,null,this.Aa):c;return Xc(a)?L.b?L.b(a):L.call(null,a):null!=this.root?this.root.kb(b,a):a};k.Ha=function(){var a=this.root?lc(this.root):De;return this.za?new sg(this.Aa,a,!1):a};k.P=function(){return this.w};k.Z=function(){return this.o};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Qc(this)};k.D=function(a,b){return Mf(this,b)};k.qb=function(){return new $f({},this.root,this.o,this.za,this.Aa)};
k.ca=function(){return Hb(Yf,this.w)};k.sb=function(a,b){if(null==b)return this.za?new pd(this.w,this.o-1,this.root,!1,null,null):this;if(null==this.root)return this;var c=this.root.Tb(0,Ac(b),b);return c===this.root?this:new pd(this.w,this.o-1,c,this.za,this.Aa,null)};
k.Ra=function(a,b,c){if(null==b)return this.za&&c===this.Aa?this:new pd(this.w,this.za?this.o:this.o+1,this.root,!0,c,null);a=new ag;b=(null==this.root?mg:this.root).Oa(0,Ac(b),b,c,a);return b===this.root?this:new pd(this.w,a.G?this.o+1:this.o,b,this.za,this.Aa,null)};k.hc=function(a,b){return null==b?this.za:null==this.root?!1:this.root.$a(0,Ac(b),b,Fd)!==Fd};k.U=function(){if(0<this.o){var a=null!=this.root?this.root.Sb():null;return this.za?M(new R(null,2,5,S,[null,this.Aa],null),a):a}return null};
k.R=function(a,b){return new pd(b,this.o,this.root,this.za,this.Aa,this.u)};k.X=function(a,b){if(yd(b))return sb(this,hb.a(b,0),hb.a(b,1));for(var c=this,d=F(b);;){if(null==d)return c;var e=H(d);if(yd(e))c=sb(c,hb.a(e,0),hb.a(e,1)),d=J(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};var Yf=new pd(null,0,null,!1,null,Rc);
function qd(a,b){for(var c=a.length,d=0,e=Xb(Yf);;)if(d<c)var f=d+1,e=e.Mb(null,a[d],b[d]),d=f;else return Zb(e)}pd.prototype[Ya]=function(){return Jc(this)};function $f(a,b,c,d,e){this.V=a;this.root=b;this.count=c;this.za=d;this.Aa=e;this.g=258;this.C=56}function tg(a,b,c){if(a.V){if(null==b)a.Aa!==c&&(a.Aa=c),a.za||(a.count+=1,a.za=!0);else{var d=new ag;b=(null==a.root?mg:a.root).Pa(a.V,0,Ac(b),b,c,d);b!==a.root&&(a.root=b);d.G&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}k=$f.prototype;
k.Z=function(){if(this.V)return this.count;throw Error("count after persistent!");};k.N=function(a,b){return null==b?this.za?this.Aa:null:null==this.root?null:this.root.$a(0,Ac(b),b)};k.I=function(a,b,c){return null==b?this.za?this.Aa:c:null==this.root?c:this.root.$a(0,Ac(b),b,c)};
k.Nb=function(a,b){var c;a:if(this.V)if(null!=b?b.g&2048||b.Sc||(b.g?0:Ta(vb,b)):Ta(vb,b))c=tg(this,be.b?be.b(b):be.call(null,b),ce.b?ce.b(b):ce.call(null,b));else{c=F(b);for(var d=this;;){var e=H(c);if(w(e))c=J(c),d=tg(d,be.b?be.b(e):be.call(null,e),ce.b?ce.b(e):ce.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};k.Ob=function(){var a;if(this.V)this.V=null,a=new pd(null,this.count,this.root,this.za,this.Aa,null);else throw Error("persistent! called twice");return a};
k.Mb=function(a,b,c){return tg(this,b,c)};ug;vg;var wg=function wg(b,c,d){d=null!=b.left?wg(b.left,c,d):d;if(Xc(d))return L.b?L.b(d):L.call(null,d);var e=b.key,f=b.G;d=c.c?c.c(d,e,f):c.call(null,d,e,f);if(Xc(d))return L.b?L.b(d):L.call(null,d);b=null!=b.right?wg(b.right,c,d):d;return Xc(b)?L.b?L.b(b):L.call(null,b):b};function vg(a,b,c,d,e){this.key=a;this.G=b;this.left=c;this.right=d;this.u=e;this.g=32402207;this.C=0}k=vg.prototype;k.replace=function(a,b,c,d){return new vg(a,b,c,d,null)};
k.kb=function(a,b){return wg(this,a,b)};k.N=function(a,b){return hb.c(this,b,null)};k.I=function(a,b,c){return hb.c(this,b,c)};k.ba=function(a,b){return 0===b?this.key:1===b?this.G:null};k.Ea=function(a,b,c){return 0===b?this.key:1===b?this.G:c};k.fb=function(a,b,c){return(new R(null,2,5,S,[this.key,this.G],null)).fb(null,b,c)};k.P=function(){return null};k.Z=function(){return 2};k.Ib=function(){return this.key};k.Jb=function(){return this.G};k.eb=function(){return this.G};
k.S=function(){var a=this.u;return null!=a?a:this.u=a=Oc(this)};k.D=function(a,b){return Tc(this,b)};k.ca=function(){return md};k.ea=function(a,b){return Yc(this,b)};k.fa=function(a,b,c){return Zc(this,b,c)};k.Ra=function(a,b,c){return Q.c(new R(null,2,5,S,[this.key,this.G],null),b,c)};k.U=function(){return fb(fb(Hc,this.G),this.key)};k.R=function(a,b){return Uc(new R(null,2,5,S,[this.key,this.G],null),b)};k.X=function(a,b){return new R(null,3,5,S,[this.key,this.G,b],null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};vg.prototype[Ya]=function(){return Jc(this)};
function ug(a,b,c,d,e){this.key=a;this.G=b;this.left=c;this.right=d;this.u=e;this.g=32402207;this.C=0}k=ug.prototype;k.replace=function(a,b,c,d){return new ug(a,b,c,d,null)};k.kb=function(a,b){return wg(this,a,b)};k.N=function(a,b){return hb.c(this,b,null)};k.I=function(a,b,c){return hb.c(this,b,c)};k.ba=function(a,b){return 0===b?this.key:1===b?this.G:null};k.Ea=function(a,b,c){return 0===b?this.key:1===b?this.G:c};k.fb=function(a,b,c){return(new R(null,2,5,S,[this.key,this.G],null)).fb(null,b,c)};
k.P=function(){return null};k.Z=function(){return 2};k.Ib=function(){return this.key};k.Jb=function(){return this.G};k.eb=function(){return this.G};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Oc(this)};k.D=function(a,b){return Tc(this,b)};k.ca=function(){return md};k.ea=function(a,b){return Yc(this,b)};k.fa=function(a,b,c){return Zc(this,b,c)};k.Ra=function(a,b,c){return Q.c(new R(null,2,5,S,[this.key,this.G],null),b,c)};k.U=function(){return fb(fb(Hc,this.G),this.key)};
k.R=function(a,b){return Uc(new R(null,2,5,S,[this.key,this.G],null),b)};k.X=function(a,b){return new R(null,3,5,S,[this.key,this.G,b],null)};k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};
k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};ug.prototype[Ya]=function(){return Jc(this)};be;var Sc=function Sc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Sc.h(0<c.length?new Fc(c.slice(0),0):null)};Sc.h=function(a){a=F(a);for(var b=Xb(Yf);;)if(a){var c=J(J(a)),b=Ae(b,H(a),jd(a));a=c}else return Zb(b)};Sc.v=0;Sc.B=function(a){return Sc.h(F(a))};function xg(a,b){this.J=a;this.Da=b;this.g=32374988;this.C=0}k=xg.prototype;
k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.Da};k.wa=function(){var a=(null!=this.J?this.J.g&128||this.J.Yb||(this.J.g?0:Ta(nb,this.J)):Ta(nb,this.J))?this.J.wa(null):J(this.J);return null==a?null:new xg(a,this.Da)};k.S=function(){return Oc(this)};k.D=function(a,b){return Tc(this,b)};k.ca=function(){return Uc(Hc,this.Da)};k.ea=function(a,b){return id.a(b,this)};k.fa=function(a,b,c){return id.c(b,c,this)};k.ta=function(){return this.J.ta(null).Ib(null)};
k.xa=function(){var a=(null!=this.J?this.J.g&128||this.J.Yb||(this.J.g?0:Ta(nb,this.J)):Ta(nb,this.J))?this.J.wa(null):J(this.J);return null!=a?new xg(a,this.Da):Hc};k.U=function(){return this};k.R=function(a,b){return new xg(this.J,b)};k.X=function(a,b){return M(b,this)};xg.prototype[Ya]=function(){return Jc(this)};function Uf(a){return(a=F(a))?new xg(a,null):null}function be(a){return wb(a)}function yg(a,b){this.J=a;this.Da=b;this.g=32374988;this.C=0}k=yg.prototype;k.toString=function(){return nc(this)};
k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.Da};k.wa=function(){var a=(null!=this.J?this.J.g&128||this.J.Yb||(this.J.g?0:Ta(nb,this.J)):Ta(nb,this.J))?this.J.wa(null):J(this.J);return null==a?null:new yg(a,this.Da)};k.S=function(){return Oc(this)};k.D=function(a,b){return Tc(this,b)};k.ca=function(){return Uc(Hc,this.Da)};k.ea=function(a,b){return id.a(b,this)};k.fa=function(a,b,c){return id.c(b,c,this)};k.ta=function(){return this.J.ta(null).Jb(null)};
k.xa=function(){var a=(null!=this.J?this.J.g&128||this.J.Yb||(this.J.g?0:Ta(nb,this.J)):Ta(nb,this.J))?this.J.wa(null):J(this.J);return null!=a?new yg(a,this.Da):Hc};k.U=function(){return this};k.R=function(a,b){return new yg(this.J,b)};k.X=function(a,b){return M(b,this)};yg.prototype[Ya]=function(){return Jc(this)};function Vf(a){return(a=F(a))?new yg(a,null):null}function ce(a){return xb(a)}
var zg=function zg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return zg.h(0<c.length?new Fc(c.slice(0),0):null)};zg.h=function(a){return w(Je(Od,a))?$a.a(function(a,c){return ld.a(w(a)?a:V,c)},a):null};zg.v=0;zg.B=function(a){return zg.h(F(a))};Ag;function Bg(a){this.zb=a}Bg.prototype.ya=function(){return this.zb.ya()};Bg.prototype.next=function(){if(this.zb.ya())return this.zb.next().O[0];throw Error("No such element");};Bg.prototype.remove=function(){return Error("Unsupported operation")};
function Cg(a,b,c){this.w=a;this.ib=b;this.u=c;this.g=15077647;this.C=8196}k=Cg.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.keys=function(){return Jc(F(this))};k.entries=function(){var a=F(this);return new Qf(F(a))};k.values=function(){return Jc(F(this))};k.has=function(a){return Id(this,a)};
k.forEach=function(a){for(var b=F(this),c=null,d=0,e=0;;)if(e<d){var f=c.ba(null,e),g=P(f,0),f=P(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=F(b))Bd(b)?(c=ec(b),b=fc(b),g=c,d=O(c),c=g):(c=H(b),g=P(c,0),f=P(c,1),a.a?a.a(f,g):a.call(null,f,g),b=J(b),c=null,d=0),e=0;else return null};k.N=function(a,b){return pb.c(this,b,null)};k.I=function(a,b,c){return rb(this.ib,b)?b:c};k.Ha=function(){return new Bg(lc(this.ib))};k.P=function(){return this.w};k.Z=function(){return cb(this.ib)};
k.S=function(){var a=this.u;return null!=a?a:this.u=a=Qc(this)};k.D=function(a,b){return vd(b)&&O(this)===O(b)&&Ie(function(a){return function(b){return Id(a,b)}}(this),b)};k.qb=function(){return new Ag(Xb(this.ib))};k.ca=function(){return Uc(Dg,this.w)};k.U=function(){return Uf(this.ib)};k.R=function(a,b){return new Cg(b,this.ib,this.u)};k.X=function(a,b){return new Cg(this.w,Q.c(this.ib,b,null),null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};var Dg=new Cg(null,V,Rc);Cg.prototype[Ya]=function(){return Jc(this)};
function Ag(a){this.Ya=a;this.C=136;this.g=259}k=Ag.prototype;k.Nb=function(a,b){this.Ya=$b(this.Ya,b,null);return this};k.Ob=function(){return new Cg(null,Zb(this.Ya),null)};k.Z=function(){return O(this.Ya)};k.N=function(a,b){return pb.c(this,b,null)};k.I=function(a,b,c){return pb.c(this.Ya,b,Fd)===Fd?c:b};
k.call=function(){function a(a,b,c){return pb.c(this.Ya,b,Fd)===Fd?c:b}function b(a,b){return pb.c(this.Ya,b,Fd)===Fd?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.b=function(a){return pb.c(this.Ya,a,Fd)===Fd?null:a};k.a=function(a,b){return pb.c(this.Ya,a,Fd)===Fd?b:a};
function Eg(a,b){if(yd(b)){var c=O(b);return $a.c(function(){return function(b,c){var f=Jd(a,od(b,c));return w(f)?Q.c(b,c,jd(f)):b}}(c),b,We(c,$e(Vc,0)))}return T.a(function(b){var c=Jd(a,b);return w(c)?jd(c):b},b)}function Fg(a){for(var b=md;;)if(J(a))b=ld.a(b,H(a)),a=J(a);else return F(b)}function ae(a){if(null!=a&&(a.C&4096||a.Uc))return a.Kb(null);if("string"===typeof a)return a;throw Error([z("Doesn't support name: "),z(a)].join(""));}
var Gg=function Gg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Gg.a(arguments[0],arguments[1]);case 3:return Gg.c(arguments[0],arguments[1],arguments[2]);default:return Gg.h(arguments[0],arguments[1],arguments[2],new Fc(c.slice(3),0))}};Gg.a=function(a,b){return b};Gg.c=function(a,b,c){return(a.b?a.b(b):a.call(null,b))<(a.b?a.b(c):a.call(null,c))?b:c};
Gg.h=function(a,b,c,d){return $a.c(function(b,c){return Gg.c(a,b,c)},Gg.c(a,b,c),d)};Gg.B=function(a){var b=H(a),c=J(a);a=H(c);var d=J(c),c=H(d),d=J(d);return Gg.h(b,a,c,d)};Gg.v=3;function Hg(a,b){return new ne(null,function(){var c=F(b);if(c){var d;d=H(c);d=a.b?a.b(d):a.call(null,d);c=w(d)?M(H(c),Hg(a,Gc(c))):null}else c=null;return c},null,null)}function Ig(a,b,c){this.s=a;this.end=b;this.step=c}Ig.prototype.ya=function(){return 0<this.step?this.s<this.end:this.s>this.end};
Ig.prototype.next=function(){var a=this.s;this.s+=this.step;return a};function Jg(a,b,c,d,e){this.w=a;this.start=b;this.end=c;this.step=d;this.u=e;this.g=32375006;this.C=8192}k=Jg.prototype;k.toString=function(){return nc(this)};k.equiv=function(a){return this.D(null,a)};k.ba=function(a,b){if(b<cb(this))return this.start+b*this.step;if(this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};
k.Ea=function(a,b,c){return b<cb(this)?this.start+b*this.step:this.start>this.end&&0===this.step?this.start:c};k.Ha=function(){return new Ig(this.start,this.end,this.step)};k.P=function(){return this.w};k.wa=function(){return 0<this.step?this.start+this.step<this.end?new Jg(this.w,this.start+this.step,this.end,this.step,null):null:this.start+this.step>this.end?new Jg(this.w,this.start+this.step,this.end,this.step,null):null};k.Z=function(){return Sa(Ob(this))?0:Math.ceil((this.end-this.start)/this.step)};
k.S=function(){var a=this.u;return null!=a?a:this.u=a=Oc(this)};k.D=function(a,b){return Tc(this,b)};k.ca=function(){return Uc(Hc,this.w)};k.ea=function(a,b){return Yc(this,b)};k.fa=function(a,b,c){for(a=this.start;;)if(0<this.step?a<this.end:a>this.end){c=b.a?b.a(c,a):b.call(null,c,a);if(Xc(c))return L.b?L.b(c):L.call(null,c);a+=this.step}else return c};k.ta=function(){return null==Ob(this)?null:this.start};
k.xa=function(){return null!=Ob(this)?new Jg(this.w,this.start+this.step,this.end,this.step,null):Hc};k.U=function(){return 0<this.step?this.start<this.end?this:null:0>this.step?this.start>this.end?this:null:this.start===this.end?null:this};k.R=function(a,b){return new Jg(b,this.start,this.end,this.step,this.u)};k.X=function(a,b){return M(b,this)};Jg.prototype[Ya]=function(){return Jc(this)};
function Kg(a,b){return new ne(null,function(){var c=F(b);if(c){var d=H(c),e=a.b?a.b(d):a.call(null,d),d=M(d,Hg(function(b,c){return function(b){return vc.a(c,a.b?a.b(b):a.call(null,b))}}(d,e,c,c),J(c)));return M(d,Kg(a,F(Xe(O(d),c))))}return null},null,null)}function Lg(a){return new ne(null,function(){var b=F(a);return b?Mg(Qd,H(b),Gc(b)):fb(Hc,Qd.m?Qd.m():Qd.call(null))},null,null)}
function Mg(a,b,c){return M(b,new ne(null,function(){var d=F(c);if(d){var e=Mg,f;f=H(d);f=a.a?a.a(b,f):a.call(null,b,f);d=e(a,f,Gc(d))}else d=null;return d},null,null))}
function Ng(a,b){return function(){function c(c,d,e){return new R(null,2,5,S,[a.c?a.c(c,d,e):a.call(null,c,d,e),b.c?b.c(c,d,e):b.call(null,c,d,e)],null)}function d(c,d){return new R(null,2,5,S,[a.a?a.a(c,d):a.call(null,c,d),b.a?b.a(c,d):b.call(null,c,d)],null)}function e(c){return new R(null,2,5,S,[a.b?a.b(c):a.call(null,c),b.b?b.b(c):b.call(null,c)],null)}function f(){return new R(null,2,5,S,[a.m?a.m():a.call(null),b.m?b.m():b.call(null)],null)}var g=null,h=function(){function c(a,b,e,f){var g=null;
if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;g=new Fc(h,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){return new R(null,2,5,S,[B.A(a,c,e,f,g),B.A(b,c,e,f,g)],null)}c.v=3;c.B=function(a){var b=H(a);a=J(a);var c=H(a);a=J(a);var e=H(a);a=Gc(a);return d(b,c,e,a)};c.h=d;return c}(),g=function(a,b,g,q){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);
default:var p=null;if(3<arguments.length){for(var p=0,r=Array(arguments.length-3);p<r.length;)r[p]=arguments[p+3],++p;p=new Fc(r,0)}return h.h(a,b,g,p)}throw Error("Invalid arity: "+arguments.length);};g.v=3;g.B=h.B;g.m=f;g.b=e;g.a=d;g.c=c;g.h=h.h;return g}()}
function Af(a,b,c,d,e,f,g){var h=Ga;Ga=null==Ga?null:Ga-1;try{if(null!=Ga&&0>Ga)return Tb(a,"#");Tb(a,c);if(0===Na.b(f))F(g)&&Tb(a,function(){var a=Og.b(f);return w(a)?a:"..."}());else{if(F(g)){var l=H(g);b.c?b.c(l,a,f):b.call(null,l,a,f)}for(var m=J(g),n=Na.b(f)-1;;)if(!m||null!=n&&0===n){F(m)&&0===n&&(Tb(a,d),Tb(a,function(){var a=Og.b(f);return w(a)?a:"..."}()));break}else{Tb(a,d);var q=H(m);c=a;g=f;b.c?b.c(q,c,g):b.call(null,q,c,g);var p=J(m);c=n-1;m=p;n=c}}return Tb(a,e)}finally{Ga=h}}
function Pg(a,b){for(var c=F(b),d=null,e=0,f=0;;)if(f<e){var g=d.ba(null,f);Tb(a,g);f+=1}else if(c=F(c))d=c,Bd(d)?(c=ec(d),e=fc(d),d=c,g=O(c),c=e,e=g):(g=H(d),Tb(a,g),c=J(d),d=null,e=0),f=0;else return null}var Qg={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function Rg(a){return[z('"'),z(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return Qg[a]})),z('"')].join("")}Sg;
function Tg(a,b){var c=Hd(C.a(a,La));return c?(c=null!=b?b.g&131072||b.Tc?!0:!1:!1)?null!=td(b):c:c}
function Ug(a,b,c){if(null==a)return Tb(b,"nil");if(Tg(c,a)){Tb(b,"^");var d=td(a);Bf.c?Bf.c(d,b,c):Bf.call(null,d,b,c);Tb(b," ")}if(a.tb)return a.Pb(a,b,c);if(null!=a&&(a.g&2147483648||a.$))return a.L(null,b,c);if(!0===a||!1===a||"number"===typeof a)return Tb(b,""+z(a));if(null!=a&&a.constructor===Object)return Tb(b,"#js "),d=T.a(function(b){return new R(null,2,5,S,[me.b(b),a[b]],null)},Dd(a)),Sg.l?Sg.l(d,Bf,b,c):Sg.call(null,d,Bf,b,c);if(Ra(a))return Af(b,Bf,"#js ["," ","]",c,a);if("string"==typeof a)return w(Ka.b(c))?
Tb(b,Rg(a)):Tb(b,a);if(ca(a)){var e=a.name;c=w(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return Pg(b,E(["#object[",c,' "',""+z(a),'"]'],0))}if(a instanceof Date)return c=function(a,b){for(var c=""+z(a);;)if(O(c)<b)c=[z("0"),z(c)].join("");else return c},Pg(b,E(['#inst "',""+z(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),3),"-",'00:00"'],
0));if(a instanceof RegExp)return Pg(b,E(['#"',a.source,'"'],0));if(null!=a&&(a.g&2147483648||a.$))return Ub(a,b,c);if(w(a.constructor.Za))return Pg(b,E(["#object[",a.constructor.Za.replace(RegExp("/","g"),"."),"]"],0));e=a.constructor.name;c=w(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return Pg(b,E(["#object[",c," ",""+z(a),"]"],0))}function Bf(a,b,c){var d=Vg.b(c);return w(d)?(c=Q.c(c,Wg,Ug),d.c?d.c(a,b,c):d.call(null,a,b,c)):Ug(a,b,c)}
function Xg(a,b){var c;if(ud(a))c="";else{c=z;var d=new sa;a:{var e=new mc(d);Bf(H(a),e,b);for(var f=F(J(a)),g=null,h=0,l=0;;)if(l<h){var m=g.ba(null,l);Tb(e," ");Bf(m,e,b);l+=1}else if(f=F(f))g=f,Bd(g)?(f=ec(g),h=fc(g),g=f,m=O(f),f=h,h=m):(m=H(g),Tb(e," "),Bf(m,e,b),f=J(g),g=null,h=0),l=0;else break a}c=""+c(d)}return c}var Se=function Se(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Se.h(0<c.length?new Fc(c.slice(0),0):null)};
Se.h=function(a){return Xg(a,Ia())};Se.v=0;Se.B=function(a){return Se.h(F(a))};function Yg(){var a=E(["Run time",((new Date).getTime()-Zg.b(L.b?L.b($g):L.call(null,$g)).getTime())/1E3,"seconds"],0),b=Q.c(Ia(),Ka,!1),a=Xg(a,b);Ba.b?Ba.b(a):Ba.call(null,a);w(Fa)&&(a=Ia(),Ba.b?Ba.b("\n"):Ba.call(null,"\n"),C.a(a,Ja))}function Sg(a,b,c,d){return Af(c,function(a,c,d){var h=wb(a);b.c?b.c(h,c,d):b.call(null,h,c,d);Tb(c," ");a=xb(a);return b.c?b.c(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,F(a))}
Ve.prototype.$=!0;Ve.prototype.L=function(a,b,c){Tb(b,"#object [cljs.core.Volatile ");Bf(new v(null,1,[ah,this.state],null),b,c);return Tb(b,"]")};Fc.prototype.$=!0;Fc.prototype.L=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};ne.prototype.$=!0;ne.prototype.L=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};qg.prototype.$=!0;qg.prototype.L=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};vg.prototype.$=!0;vg.prototype.L=function(a,b,c){return Af(b,Bf,"["," ","]",c,this)};
Tf.prototype.$=!0;Tf.prototype.L=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};Mc.prototype.$=!0;Mc.prototype.L=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};Ad.prototype.$=!0;Ad.prototype.L=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};je.prototype.$=!0;je.prototype.L=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};dd.prototype.$=!0;dd.prototype.L=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};pd.prototype.$=!0;pd.prototype.L=function(a,b,c){return Sg(this,Bf,b,c)};
rg.prototype.$=!0;rg.prototype.L=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};Hf.prototype.$=!0;Hf.prototype.L=function(a,b,c){return Af(b,Bf,"["," ","]",c,this)};Cg.prototype.$=!0;Cg.prototype.L=function(a,b,c){return Af(b,Bf,"#{"," ","}",c,this)};zd.prototype.$=!0;zd.prototype.L=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};Qe.prototype.$=!0;Qe.prototype.L=function(a,b,c){Tb(b,"#object [cljs.core.Atom ");Bf(new v(null,1,[ah,this.state],null),b,c);return Tb(b,"]")};yg.prototype.$=!0;
yg.prototype.L=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};ug.prototype.$=!0;ug.prototype.L=function(a,b,c){return Af(b,Bf,"["," ","]",c,this)};R.prototype.$=!0;R.prototype.L=function(a,b,c){return Af(b,Bf,"["," ","]",c,this)};he.prototype.$=!0;he.prototype.L=function(a,b){return Tb(b,"()")};He.prototype.$=!0;He.prototype.L=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};v.prototype.$=!0;v.prototype.L=function(a,b,c){return Sg(this,Bf,b,c)};Jg.prototype.$=!0;
Jg.prototype.L=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};xg.prototype.$=!0;xg.prototype.L=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};ed.prototype.$=!0;ed.prototype.L=function(a,b,c){return Af(b,Bf,"("," ",")",c,this)};uc.prototype.Eb=!0;uc.prototype.pb=function(a,b){if(b instanceof uc)return Cc(this,b);throw Error([z("Cannot compare "),z(this),z(" to "),z(b)].join(""));};x.prototype.Eb=!0;
x.prototype.pb=function(a,b){if(b instanceof x)return ke(this,b);throw Error([z("Cannot compare "),z(this),z(" to "),z(b)].join(""));};Hf.prototype.Eb=!0;Hf.prototype.pb=function(a,b){if(yd(b))return Kd(this,b);throw Error([z("Cannot compare "),z(this),z(" to "),z(b)].join(""));};R.prototype.Eb=!0;R.prototype.pb=function(a,b){if(yd(b))return Kd(this,b);throw Error([z("Cannot compare "),z(this),z(" to "),z(b)].join(""));};var bh=null;
function ch(a){null==bh&&(bh=W.b?W.b(0):W.call(null,0));return Dc.b([z(a),z(Ue.a(bh,Vc))].join(""))}function dh(a){return function(b,c){var d=a.a?a.a(b,c):a.call(null,b,c);return Xc(d)?new Wc(d):d}}
function cf(a){return function(b){return function(){function c(a,c){return $a.c(b,a,c)}function d(b){return a.b?a.b(b):a.call(null,b)}function e(){return a.m?a.m():a.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.m=e;f.b=d;f.a=c;return f}()}(dh(a))}eh;function fh(){}
var gh=function gh(b){if(null!=b&&null!=b.Qc)return b.Qc(b);var c=gh[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=gh._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("IEncodeJS.-clj-\x3ejs",b);};hh;function ih(a){return(null!=a?a.Pc||(a.ac?0:Ta(fh,a)):Ta(fh,a))?gh(a):"string"===typeof a||"number"===typeof a||a instanceof x||a instanceof uc?hh.b?hh.b(a):hh.call(null,a):Se.h(E([a],0))}
var hh=function hh(b){if(null==b)return null;if(null!=b?b.Pc||(b.ac?0:Ta(fh,b)):Ta(fh,b))return gh(b);if(b instanceof x)return ae(b);if(b instanceof uc)return""+z(b);if(xd(b)){var c={};b=F(b);for(var d=null,e=0,f=0;;)if(f<e){var g=d.ba(null,f),h=P(g,0),g=P(g,1);c[ih(h)]=hh(g);f+=1}else if(b=F(b))Bd(b)?(e=ec(b),b=fc(b),d=e,e=O(e)):(e=H(b),d=P(e,0),e=P(e,1),c[ih(d)]=hh(e),b=J(b),d=null,e=0),f=0;else break;return c}if(null==b?0:null!=b?b.g&8||b.wd||(b.g?0:Ta(eb,b)):Ta(eb,b)){c=[];b=F(T.a(hh,b));d=null;
for(f=e=0;;)if(f<e)h=d.ba(null,f),c.push(h),f+=1;else if(b=F(b))d=b,Bd(d)?(b=ec(d),f=fc(d),d=b,e=O(b),b=f):(b=H(d),c.push(b),b=J(d),d=null,e=0),f=0;else break;return c}return b},eh=function eh(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return eh.m();case 1:return eh.b(arguments[0]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};eh.m=function(){return eh.b(1)};eh.b=function(a){return Math.random()*a};eh.v=1;
function jh(){var a=1E8*Math.random();return Math.floor(a)}function kh(a,b){return ye($a.c(function(b,d){var e=a.b?a.b(d):a.call(null,d);return Ae(b,e,ld.a(C.c(b,e,md),d))},Xb(V),b))}var lh=null;function mh(){if(null==lh){var a=new v(null,3,[nh,V,oh,V,ph,V],null);lh=W.b?W.b(a):W.call(null,a)}return lh}
function qh(a,b,c){var d=vc.a(b,c);if(!d&&!(d=Id(ph.b(a).call(null,b),c))&&(d=yd(c))&&(d=yd(b)))if(d=O(c)===O(b))for(var d=!0,e=0;;)if(d&&e!==O(c))d=qh(a,b.b?b.b(e):b.call(null,e),c.b?c.b(e):c.call(null,e)),e+=1;else return d;else return d;else return d}function rh(a){var b;b=mh();b=L.b?L.b(b):L.call(null,b);return Ce(C.a(nh.b(b),a))}function sh(a,b,c,d){Ue.a(a,function(){return L.b?L.b(b):L.call(null,b)});Ue.a(c,function(){return L.b?L.b(d):L.call(null,d)})}
var th=function th(b,c,d){var e=(L.b?L.b(d):L.call(null,d)).call(null,b),e=w(w(e)?e.b?e.b(c):e.call(null,c):e)?!0:null;if(w(e))return e;e=function(){for(var e=rh(c);;)if(0<O(e))th(b,H(e),d),e=Gc(e);else return null}();if(w(e))return e;e=function(){for(var e=rh(b);;)if(0<O(e))th(H(e),c,d),e=Gc(e);else return null}();return w(e)?e:!1};function uh(a,b,c){c=th(a,b,c);if(w(c))a=c;else{c=qh;var d;d=mh();d=L.b?L.b(d):L.call(null,d);a=c(d,a,b)}return a}
var vh=function vh(b,c,d,e,f,g,h){var l=$a.c(function(e,g){var h=P(g,0);P(g,1);if(qh(L.b?L.b(d):L.call(null,d),c,h)){var l;l=(l=null==e)?l:uh(h,H(e),f);l=w(l)?g:e;if(!w(uh(H(l),h,f)))throw Error([z("Multiple methods in multimethod '"),z(b),z("' match dispatch value: "),z(c),z(" -\x3e "),z(h),z(" and "),z(H(l)),z(", and neither is preferred")].join(""));return l}return e},null,L.b?L.b(e):L.call(null,e));if(w(l)){if(vc.a(L.b?L.b(h):L.call(null,h),L.b?L.b(d):L.call(null,d)))return Ue.l(g,Q,c,jd(l)),
jd(l);sh(g,e,h,d);return vh(b,c,d,e,f,g,h)}return null};function wh(a,b){throw Error([z("No method in multimethod '"),z(a),z("' for dispatch value: "),z(b)].join(""));}function xh(a,b,c,d,e,f,g,h){this.name=a;this.j=b;this.bd=c;this.Rb=d;this.Ab=e;this.od=f;this.Ub=g;this.Db=h;this.g=4194305;this.C=4352}k=xh.prototype;
k.call=function(){function a(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D,K,N,I,G){a=this;var Aa=B.h(a.j,b,c,d,e,E([f,g,h,l,m,n,p,q,r,t,A,y,D,K,N,I,G],0)),cl=yh(this,Aa);w(cl)||wh(a.name,Aa);return B.h(cl,b,c,d,e,E([f,g,h,l,m,n,p,q,r,t,A,y,D,K,N,I,G],0))}function b(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D,K,N,I){a=this;var G=a.j.qa?a.j.qa(b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D,K,N,I):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D,K,N,I),Aa=yh(this,G);w(Aa)||wh(a.name,G);return Aa.qa?Aa.qa(b,c,d,e,f,g,h,l,m,n,p,q,r,
t,A,y,D,K,N,I):Aa.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D,K,N,I)}function c(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D,K,N){a=this;var I=a.j.pa?a.j.pa(b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D,K,N):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D,K,N),G=yh(this,I);w(G)||wh(a.name,I);return G.pa?G.pa(b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D,K,N):G.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D,K,N)}function d(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D,K){a=this;var N=a.j.oa?a.j.oa(b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D,K):a.j.call(null,
b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D,K),I=yh(this,N);w(I)||wh(a.name,N);return I.oa?I.oa(b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D,K):I.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D,K)}function e(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D){a=this;var K=a.j.na?a.j.na(b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D),N=yh(this,K);w(N)||wh(a.name,K);return N.na?N.na(b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D):N.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D)}function f(a,b,c,d,e,f,g,h,l,m,n,p,q,r,
t,A,y){a=this;var D=a.j.ma?a.j.ma(b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y),K=yh(this,D);w(K)||wh(a.name,D);return K.ma?K.ma(b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y):K.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y)}function g(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A){a=this;var y=a.j.la?a.j.la(b,c,d,e,f,g,h,l,m,n,p,q,r,t,A):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A),D=yh(this,y);w(D)||wh(a.name,y);return D.la?D.la(b,c,d,e,f,g,h,l,m,n,p,q,r,t,A):D.call(null,b,c,d,e,f,g,h,l,m,n,p,
q,r,t,A)}function h(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t){a=this;var A=a.j.ka?a.j.ka(b,c,d,e,f,g,h,l,m,n,p,q,r,t):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t),y=yh(this,A);w(y)||wh(a.name,A);return y.ka?y.ka(b,c,d,e,f,g,h,l,m,n,p,q,r,t):y.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,t)}function l(a,b,c,d,e,f,g,h,l,m,n,p,q,r){a=this;var t=a.j.ja?a.j.ja(b,c,d,e,f,g,h,l,m,n,p,q,r):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r),A=yh(this,t);w(A)||wh(a.name,t);return A.ja?A.ja(b,c,d,e,f,g,h,l,m,n,p,q,r):A.call(null,b,c,d,e,f,
g,h,l,m,n,p,q,r)}function m(a,b,c,d,e,f,g,h,l,m,n,p,q){a=this;var r=a.j.ia?a.j.ia(b,c,d,e,f,g,h,l,m,n,p,q):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q),t=yh(this,r);w(t)||wh(a.name,r);return t.ia?t.ia(b,c,d,e,f,g,h,l,m,n,p,q):t.call(null,b,c,d,e,f,g,h,l,m,n,p,q)}function n(a,b,c,d,e,f,g,h,l,m,n,p){a=this;var q=a.j.ha?a.j.ha(b,c,d,e,f,g,h,l,m,n,p):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p),r=yh(this,q);w(r)||wh(a.name,q);return r.ha?r.ha(b,c,d,e,f,g,h,l,m,n,p):r.call(null,b,c,d,e,f,g,h,l,m,n,p)}function q(a,b,
c,d,e,f,g,h,l,m,n){a=this;var p=a.j.ga?a.j.ga(b,c,d,e,f,g,h,l,m,n):a.j.call(null,b,c,d,e,f,g,h,l,m,n),q=yh(this,p);w(q)||wh(a.name,p);return q.ga?q.ga(b,c,d,e,f,g,h,l,m,n):q.call(null,b,c,d,e,f,g,h,l,m,n)}function p(a,b,c,d,e,f,g,h,l,m){a=this;var n=a.j.sa?a.j.sa(b,c,d,e,f,g,h,l,m):a.j.call(null,b,c,d,e,f,g,h,l,m),p=yh(this,n);w(p)||wh(a.name,n);return p.sa?p.sa(b,c,d,e,f,g,h,l,m):p.call(null,b,c,d,e,f,g,h,l,m)}function r(a,b,c,d,e,f,g,h,l){a=this;var m=a.j.ra?a.j.ra(b,c,d,e,f,g,h,l):a.j.call(null,
b,c,d,e,f,g,h,l),n=yh(this,m);w(n)||wh(a.name,m);return n.ra?n.ra(b,c,d,e,f,g,h,l):n.call(null,b,c,d,e,f,g,h,l)}function t(a,b,c,d,e,f,g,h){a=this;var l=a.j.aa?a.j.aa(b,c,d,e,f,g,h):a.j.call(null,b,c,d,e,f,g,h),m=yh(this,l);w(m)||wh(a.name,l);return m.aa?m.aa(b,c,d,e,f,g,h):m.call(null,b,c,d,e,f,g,h)}function y(a,b,c,d,e,f,g){a=this;var h=a.j.T?a.j.T(b,c,d,e,f,g):a.j.call(null,b,c,d,e,f,g),l=yh(this,h);w(l)||wh(a.name,h);return l.T?l.T(b,c,d,e,f,g):l.call(null,b,c,d,e,f,g)}function A(a,b,c,d,e,f){a=
this;var g=a.j.A?a.j.A(b,c,d,e,f):a.j.call(null,b,c,d,e,f),h=yh(this,g);w(h)||wh(a.name,g);return h.A?h.A(b,c,d,e,f):h.call(null,b,c,d,e,f)}function D(a,b,c,d,e){a=this;var f=a.j.l?a.j.l(b,c,d,e):a.j.call(null,b,c,d,e),g=yh(this,f);w(g)||wh(a.name,f);return g.l?g.l(b,c,d,e):g.call(null,b,c,d,e)}function I(a,b,c,d){a=this;var e=a.j.c?a.j.c(b,c,d):a.j.call(null,b,c,d),f=yh(this,e);w(f)||wh(a.name,e);return f.c?f.c(b,c,d):f.call(null,b,c,d)}function K(a,b,c){a=this;var d=a.j.a?a.j.a(b,c):a.j.call(null,
b,c),e=yh(this,d);w(e)||wh(a.name,d);return e.a?e.a(b,c):e.call(null,b,c)}function N(a,b){a=this;var c=a.j.b?a.j.b(b):a.j.call(null,b),d=yh(this,c);w(d)||wh(a.name,c);return d.b?d.b(b):d.call(null,b)}function Aa(a){a=this;var b=a.j.m?a.j.m():a.j.call(null),c=yh(this,b);w(c)||wh(a.name,b);return c.m?c.m():c.call(null)}var G=null,G=function(ka,G,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,Ab,Xa,Va,ib,jb,Db,Kc,Cd,pf){switch(arguments.length){case 1:return Aa.call(this,ka);case 2:return N.call(this,ka,G);case 3:return K.call(this,
ka,G,U);case 4:return I.call(this,ka,G,U,X);case 5:return D.call(this,ka,G,U,X,ha);case 6:return A.call(this,ka,G,U,X,ha,ia);case 7:return y.call(this,ka,G,U,X,ha,ia,ja);case 8:return t.call(this,ka,G,U,X,ha,ia,ja,la);case 9:return r.call(this,ka,G,U,X,ha,ia,ja,la,oa);case 10:return p.call(this,ka,G,U,X,ha,ia,ja,la,oa,ua);case 11:return q.call(this,ka,G,U,X,ha,ia,ja,la,oa,ua,za);case 12:return n.call(this,ka,G,U,X,ha,ia,ja,la,oa,ua,za,Ca);case 13:return m.call(this,ka,G,U,X,ha,ia,ja,la,oa,ua,za,Ca,
Da);case 14:return l.call(this,ka,G,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,Ab);case 15:return h.call(this,ka,G,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,Ab,Xa);case 16:return g.call(this,ka,G,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,Ab,Xa,Va);case 17:return f.call(this,ka,G,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,Ab,Xa,Va,ib);case 18:return e.call(this,ka,G,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,Ab,Xa,Va,ib,jb);case 19:return d.call(this,ka,G,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,Ab,Xa,Va,ib,jb,Db);case 20:return c.call(this,ka,G,U,X,ha,ia,ja,la,oa,
ua,za,Ca,Da,Ab,Xa,Va,ib,jb,Db,Kc);case 21:return b.call(this,ka,G,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,Ab,Xa,Va,ib,jb,Db,Kc,Cd);case 22:return a.call(this,ka,G,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,Ab,Xa,Va,ib,jb,Db,Kc,Cd,pf)}throw Error("Invalid arity: "+arguments.length);};G.b=Aa;G.a=N;G.c=K;G.l=I;G.A=D;G.T=A;G.aa=y;G.ra=t;G.sa=r;G.ga=p;G.ha=q;G.ia=n;G.ja=m;G.ka=l;G.la=h;G.ma=g;G.na=f;G.oa=e;G.pa=d;G.qa=c;G.Gb=b;G.rb=a;return G}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};
k.m=function(){var a=this.j.m?this.j.m():this.j.call(null),b=yh(this,a);w(b)||wh(this.name,a);return b.m?b.m():b.call(null)};k.b=function(a){var b=this.j.b?this.j.b(a):this.j.call(null,a),c=yh(this,b);w(c)||wh(this.name,b);return c.b?c.b(a):c.call(null,a)};k.a=function(a,b){var c=this.j.a?this.j.a(a,b):this.j.call(null,a,b),d=yh(this,c);w(d)||wh(this.name,c);return d.a?d.a(a,b):d.call(null,a,b)};
k.c=function(a,b,c){var d=this.j.c?this.j.c(a,b,c):this.j.call(null,a,b,c),e=yh(this,d);w(e)||wh(this.name,d);return e.c?e.c(a,b,c):e.call(null,a,b,c)};k.l=function(a,b,c,d){var e=this.j.l?this.j.l(a,b,c,d):this.j.call(null,a,b,c,d),f=yh(this,e);w(f)||wh(this.name,e);return f.l?f.l(a,b,c,d):f.call(null,a,b,c,d)};k.A=function(a,b,c,d,e){var f=this.j.A?this.j.A(a,b,c,d,e):this.j.call(null,a,b,c,d,e),g=yh(this,f);w(g)||wh(this.name,f);return g.A?g.A(a,b,c,d,e):g.call(null,a,b,c,d,e)};
k.T=function(a,b,c,d,e,f){var g=this.j.T?this.j.T(a,b,c,d,e,f):this.j.call(null,a,b,c,d,e,f),h=yh(this,g);w(h)||wh(this.name,g);return h.T?h.T(a,b,c,d,e,f):h.call(null,a,b,c,d,e,f)};k.aa=function(a,b,c,d,e,f,g){var h=this.j.aa?this.j.aa(a,b,c,d,e,f,g):this.j.call(null,a,b,c,d,e,f,g),l=yh(this,h);w(l)||wh(this.name,h);return l.aa?l.aa(a,b,c,d,e,f,g):l.call(null,a,b,c,d,e,f,g)};
k.ra=function(a,b,c,d,e,f,g,h){var l=this.j.ra?this.j.ra(a,b,c,d,e,f,g,h):this.j.call(null,a,b,c,d,e,f,g,h),m=yh(this,l);w(m)||wh(this.name,l);return m.ra?m.ra(a,b,c,d,e,f,g,h):m.call(null,a,b,c,d,e,f,g,h)};k.sa=function(a,b,c,d,e,f,g,h,l){var m=this.j.sa?this.j.sa(a,b,c,d,e,f,g,h,l):this.j.call(null,a,b,c,d,e,f,g,h,l),n=yh(this,m);w(n)||wh(this.name,m);return n.sa?n.sa(a,b,c,d,e,f,g,h,l):n.call(null,a,b,c,d,e,f,g,h,l)};
k.ga=function(a,b,c,d,e,f,g,h,l,m){var n=this.j.ga?this.j.ga(a,b,c,d,e,f,g,h,l,m):this.j.call(null,a,b,c,d,e,f,g,h,l,m),q=yh(this,n);w(q)||wh(this.name,n);return q.ga?q.ga(a,b,c,d,e,f,g,h,l,m):q.call(null,a,b,c,d,e,f,g,h,l,m)};k.ha=function(a,b,c,d,e,f,g,h,l,m,n){var q=this.j.ha?this.j.ha(a,b,c,d,e,f,g,h,l,m,n):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n),p=yh(this,q);w(p)||wh(this.name,q);return p.ha?p.ha(a,b,c,d,e,f,g,h,l,m,n):p.call(null,a,b,c,d,e,f,g,h,l,m,n)};
k.ia=function(a,b,c,d,e,f,g,h,l,m,n,q){var p=this.j.ia?this.j.ia(a,b,c,d,e,f,g,h,l,m,n,q):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,q),r=yh(this,p);w(r)||wh(this.name,p);return r.ia?r.ia(a,b,c,d,e,f,g,h,l,m,n,q):r.call(null,a,b,c,d,e,f,g,h,l,m,n,q)};k.ja=function(a,b,c,d,e,f,g,h,l,m,n,q,p){var r=this.j.ja?this.j.ja(a,b,c,d,e,f,g,h,l,m,n,q,p):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,q,p),t=yh(this,r);w(t)||wh(this.name,r);return t.ja?t.ja(a,b,c,d,e,f,g,h,l,m,n,q,p):t.call(null,a,b,c,d,e,f,g,h,l,m,n,q,p)};
k.ka=function(a,b,c,d,e,f,g,h,l,m,n,q,p,r){var t=this.j.ka?this.j.ka(a,b,c,d,e,f,g,h,l,m,n,q,p,r):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,q,p,r),y=yh(this,t);w(y)||wh(this.name,t);return y.ka?y.ka(a,b,c,d,e,f,g,h,l,m,n,q,p,r):y.call(null,a,b,c,d,e,f,g,h,l,m,n,q,p,r)};
k.la=function(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t){var y=this.j.la?this.j.la(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,q,p,r,t),A=yh(this,y);w(A)||wh(this.name,y);return A.la?A.la(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t):A.call(null,a,b,c,d,e,f,g,h,l,m,n,q,p,r,t)};
k.ma=function(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y){var A=this.j.ma?this.j.ma(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y),D=yh(this,A);w(D)||wh(this.name,A);return D.ma?D.ma(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y):D.call(null,a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y)};
k.na=function(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A){var D=this.j.na?this.j.na(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A),I=yh(this,D);w(I)||wh(this.name,D);return I.na?I.na(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A):I.call(null,a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A)};
k.oa=function(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D){var I=this.j.oa?this.j.oa(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D),K=yh(this,I);w(K)||wh(this.name,I);return K.oa?K.oa(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D):K.call(null,a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D)};
k.pa=function(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I){var K=this.j.pa?this.j.pa(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I),N=yh(this,K);w(N)||wh(this.name,K);return N.pa?N.pa(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I):N.call(null,a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I)};
k.qa=function(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I,K){var N=this.j.qa?this.j.qa(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I,K):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I,K),Aa=yh(this,N);w(Aa)||wh(this.name,N);return Aa.qa?Aa.qa(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I,K):Aa.call(null,a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I,K)};
k.Gb=function(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I,K,N){var Aa=B.h(this.j,a,b,c,d,E([e,f,g,h,l,m,n,q,p,r,t,y,A,D,I,K,N],0)),G=yh(this,Aa);w(G)||wh(this.name,Aa);return B.h(G,a,b,c,d,E([e,f,g,h,l,m,n,q,p,r,t,y,A,D,I,K,N],0))};function zh(a,b,c){Ue.l(a.Ab,Q,b,c);sh(a.Ub,a.Ab,a.Db,a.Rb)}
function yh(a,b){vc.a(L.b?L.b(a.Db):L.call(null,a.Db),L.b?L.b(a.Rb):L.call(null,a.Rb))||sh(a.Ub,a.Ab,a.Db,a.Rb);var c=(L.b?L.b(a.Ub):L.call(null,a.Ub)).call(null,b);if(w(c))return c;c=vh(a.name,b,a.Rb,a.Ab,a.od,a.Ub,a.Db);return w(c)?c:(L.b?L.b(a.Ab):L.call(null,a.Ab)).call(null,a.bd)}k.Kb=function(){return hc(this.name)};k.Lb=function(){return ic(this.name)};k.S=function(){return da(this)};var Ah=new x(null,"rng","rng",1082666016),Bh=new x(null,"y","y",-1757859776),Ch=new x(null,"text-anchor","text-anchor",585613696),Dh=new x(null,"path","path",-188191168),Eh=new x(null,"penny-spacing","penny-spacing",-20780703),Fh=new x(null,"supplier","supplier",18255489),Gh=new x(null,"determine-capacity","determine-capacity",-452765887),Hh=new x(null,"by-station","by-station",516084641),Ih=new x(null,"selector","selector",762528866),Jh=new x(null,"r","r",-471384190),Kh=new x(null,"hr","hr",1377740067),
Lh=new x(null,"stroke","stroke",1741823555),Mh=new x(null,"run","run",-1821166653),Nh=new x(null,"generate-new","generate-new",-1613885469),Oh=new x(null,"richpath","richpath",-150197948),Ph=new x(null,"turns","turns",-1118736892),Qh=new x(null,"transform","transform",1381301764),Rh=new x(null,"die","die",-547192252),La=new x(null,"meta","meta",1499536964),Sh=new x(null,"patternUnits","patternUnits",-1458803100),Th=new x(null,"transformer","transformer",-1493470620),Uh=new x(null,"dx","dx",-381796732),
Vh=new x(null,"executors","executors",-331073403),Ma=new x(null,"dup","dup",556298533),Wh=new x(null,"intaking","intaking",-1009888859),Xh=new x(null,"running?","running?",-257884763),Yh=new x(null,"processing","processing",-1576405467),Zh=new x(null,"key","key",-1516042587),$h=new x(null,"stats-history","stats-history",636123973),ai=new x(null,"spout-y","spout-y",1676697606),bi=new x(null,"stations","stations",-19744730),ci=new x(null,"capacity","capacity",72689734),di=new x(null,"disabled","disabled",
-1529784218),ei=new x(null,"private","private",-558947994),fi=new x(null,"efficient","efficient",-63016538),gi=new x(null,"graphs?","graphs?",-270895578),hi=new x(null,"transform*","transform*",-1613794522),ii=new x(null,"reset","reset",-800929946),ji=new x(null,"button","button",1456579943),ki=new x(null,"top","top",-1856271961),Re=new x(null,"validator","validator",-1966190681),li=new x(null,"total-utilization","total-utilization",-1341502521),mi=new x(null,"use","use",-1846382424),ni=new x(null,
"default","default",-1987822328),oi=new x(null,"finally-block","finally-block",832982472),pi=new x(null,"name","name",1843675177),qi=new x(null,"scenarios","scenarios",1618559369),ri=new x(null,"formatter","formatter",-483008823),si=new x(null,"fill","fill",883462889),ti=new x(null,"value","value",305978217),ui=new x(null,"section","section",-300141526),vi=new x(null,"circle","circle",1903212362),wi=new x(null,"y1","y1",589123466),xi=new x(null,"drop","drop",364481611),yi=new x(null,"tracer","tracer",
-1844475765),zi=new x(null,"width","width",-384071477),Ai=new x(null,"supply","supply",-1701696309),Bi=new x(null,"spath","spath",-1857758005),Ci=new x(null,"source-spout-y","source-spout-y",1447094571),Di=new x(null,"onclick","onclick",1297553739),Ei=new x(null,"dy","dy",1719547243),Fi=new x(null,"penny","penny",1653999051),Gi=new x(null,"params","params",710516235),Hi=new x(null,"total-output","total-output",1149740747),Ii=new x(null,"easing","easing",735372043),ah=new x(null,"val","val",128701612),
Ji=new x(null,"delivery","delivery",-1844470516),Ki=new x(null,"recur","recur",-437573268),Li=new x(null,"type","type",1174270348),Mi=new x(null,"catch-block","catch-block",1175212748),Ni=new x(null,"duration","duration",1444101068),Oi=new x(null,"execute","execute",-129499188),Pi=new x(null,"delivered","delivered",474109932),Qi=new x(null,"constrained","constrained",597287981),Ri=new x(null,"intaking?","intaking?",834765),Wg=new x(null,"fallback-impl","fallback-impl",-1501286995),Si=new x(null,"output",
"output",-1105869043),Ti=new x(null,"original-setup","original-setup",2029721421),Ja=new x(null,"flush-on-newline","flush-on-newline",-151457939),Ui=new x(null,"normal","normal",-1519123858),Vi=new x(null,"wip","wip",-103467282),Wi=new x(null,"averages","averages",-1747836978),Xi=new x(null,"seed","seed",68613327),Yi=new x(null,"className","className",-1983287057),oh=new x(null,"descendants","descendants",1824886031),Zi=new x(null,"size","size",1098693007),$i=new x(null,"accessor","accessor",-25476721),
aj=new x(null,"title","title",636505583),bj=new x(null,"running","running",1554969103),cj=new uc(null,"folder","folder",-1138554033,null),dj=new x(null,"num-needed-params","num-needed-params",-1219326097),ej=new x(null,"dropping","dropping",125809647),fj=new x(null,"high","high",2027297808),gj=new x(null,"setup","setup",1987730512),ph=new x(null,"ancestors","ancestors",-776045424),hj=new x(null,"style","style",-496642736),ij=new x(null,"div","div",1057191632),Ka=new x(null,"readably","readably",1129599760),
jj=new x(null,"params-idx","params-idx",340984624),kj=new uc(null,"box","box",-1123515375,null),Og=new x(null,"more-marker","more-marker",-14717935),lj=new x(null,"percent-utilization","percent-utilization",-2006109103),mj=new x(null,"g","g",1738089905),nj=new x(null,"update-stats","update-stats",1938193073),oj=new x(null,"info?","info?",361925553),pj=new x(null,"transfer-to-next-station","transfer-to-next-station",-114193262),qj=new x(null,"set-spacing","set-spacing",1920968978),rj=new x(null,"intake",
"intake",-108984782),sj=new uc(null,"coll","coll",-1006698606,null),tj=new x(null,"line","line",212345235),uj=new x(null,"stroke-width","stroke-width",716836435),vj=new uc(null,"val","val",1769233139,null),wj=new uc(null,"xf","xf",2042434515,null),Na=new x(null,"print-length","print-length",1931866356),xj=new x(null,"select*","select*",-1829914060),yj=new x(null,"cx","cx",1272694324),zj=new x(null,"id","id",-1388402092),Aj=new x(null,"class","class",-2030961996),Bj=new x(null,"cy","cy",755331060),
Cj=new x(null,"catch-exception","catch-exception",-1997306795),Dj=new x(null,"total-input","total-input",1219129557),Ej=new x(null,"defs","defs",1398449717),nh=new x(null,"parents","parents",-2027538891),Fj=new x(null,"collect-val","collect-val",801894069),Gj=new x(null,"xlink:href","xlink:href",828777205),Hj=new x(null,"toggle-scenario","toggle-scenario",-1166476555),Ij=new x(null,"prev","prev",-1597069226),Jj=new x(null,"svg","svg",856789142),Kj=new x(null,"info","info",-317069002),Lj=new x(null,
"bin-h","bin-h",346004918),Mj=new x(null,"length","length",588987862),Nj=new x(null,"continue-block","continue-block",-1852047850),Oj=new x(null,"hookTransition","hookTransition",-1045887913),Zg=new x(null,"start-timestamp","start-timestamp",-1555748521),Pj=new x(null,"tracer-reset","tracer-reset",283192087),Qj=new x(null,"distribution","distribution",-284555369),Rj=new x(null,"transfer-to-processed","transfer-to-processed",198231991),Sj=new x(null,"roll","roll",11266999),Tj=new x(null,"position",
"position",-2011731912),Uj=new x(null,"graphs","graphs",-1584479112),Vj=new x(null,"basic","basic",1043717368),Wj=new x(null,"image","image",-58725096),Xj=new x(null,"d","d",1972142424),Yj=new x(null,"average","average",-492356168),Zj=new x(null,"dropping?","dropping?",-1065207176),ak=new x(null,"processed","processed",800622264),bk=new x(null,"x","x",2099068185),ck=new x(null,"run-next","run-next",1110241561),dk=new x(null,"x1","x1",-1863922247),ek=new x(null,"tracer-start","tracer-start",1036491225),
fk=new x(null,"rerender","rerender",-1601192263),gk=new x(null,"domain","domain",1847214937),hk=new x(null,"transform-fns","transform-fns",669042649),ik=new x(null,"bottleneck?","bottleneck?",241100890),Ge=new uc(null,"quote","quote",1377916282,null),jk=new x(null,"fixed","fixed",-562004358),Fe=new x(null,"arglists","arglists",1661989754),kk=new x(null,"dice","dice",707777434),lk=new x(null,"y2","y2",-718691301),mk=new x(null,"set-lengths","set-lengths",742672507),Ee=new uc(null,"nil-iter","nil-iter",
1101030523,null),nk=new x(null,"main","main",-2117802661),ok=new x(null,"hierarchy","hierarchy",-1053470341),Vg=new x(null,"alt-impl","alt-impl",670969595),pk=new x(null,"under-utilized","under-utilized",-524567781),qk=new x(null,"scenario","scenario",-316635333),rk=new uc(null,"fn-handler","fn-handler",648785851,null),sk=new x(null,"doc","doc",1913296891),tk=new x(null,"integrate","integrate",-1653689604),uk=new x(null,"rect","rect",-108902628),vk=new x(null,"step","step",1288888124),wk=new x(null,
"delay","delay",-574225219),xk=new x(null,"stats","stats",-85643011),yk=new x(null,"x2","x2",-1362513475),zk=new x(null,"pennies","pennies",1847043709),Ak=new x(null,"incoming","incoming",-1710131427),Bk=new x(null,"productivity","productivity",-890721314),Ck=new x(null,"range","range",1639692286),Dk=new x(null,"height","height",1025178622),Ek=new x(null,"spacing","spacing",204422175),Fk=new x(null,"left","left",-399115937),Gk=new x(null,"pattern","pattern",242135423),Hk=new x(null,"foreignObject",
"foreignObject",25502111),Ik=new x(null,"text","text",-1790561697),Jk=new x(null,"span","span",1394872991),Kk=new x(null,"data","data",-232669377),Lk=new uc(null,"f","f",43394975,null);var Mk;function Nk(a){return a.m?a.m():a.call(null)}function Ok(a,b,c){return xd(c)?Kb(c,a,b):null==c?b:Ra(c)?ad(c,a,b):Jb.c(c,a,b)}
var Pk=function Pk(b,c,d,e){if(null!=b&&null!=b.lc)return b.lc(b,c,d,e);var f=Pk[u(null==b?null:b)];if(null!=f)return f.l?f.l(b,c,d,e):f.call(null,b,c,d,e);f=Pk._;if(null!=f)return f.l?f.l(b,c,d,e):f.call(null,b,c,d,e);throw Ua("CollFold.coll-fold",b);},Qk=function Qk(b,c){"undefined"===typeof Mk&&(Mk=function(b,c,f,g){this.dd=b;this.bc=c;this.Wa=f;this.gd=g;this.g=917504;this.C=0},Mk.prototype.R=function(b,c){return new Mk(this.dd,this.bc,this.Wa,c)},Mk.prototype.P=function(){return this.gd},Mk.prototype.ea=
function(b,c){return Jb.c(this.bc,this.Wa.b?this.Wa.b(c):this.Wa.call(null,c),c.m?c.m():c.call(null))},Mk.prototype.fa=function(b,c,f){return Jb.c(this.bc,this.Wa.b?this.Wa.b(c):this.Wa.call(null,c),f)},Mk.prototype.lc=function(b,c,f,g){return Pk(this.bc,c,f,this.Wa.b?this.Wa.b(g):this.Wa.call(null,g))},Mk.ec=function(){return new R(null,4,5,S,[Uc(cj,new v(null,2,[Fe,tc(Ge,tc(new R(null,2,5,S,[sj,wj],null))),sk,"Given a foldable collection, and a transformation function xf,\n  returns a foldable collection, where any supplied reducing\n  fn will be transformed by xf. xf is a function of reducing fn to\n  reducing fn."],
null)),sj,wj,xa.Dd],null)},Mk.tb=!0,Mk.Za="clojure.core.reducers/t_clojure$core$reducers19049",Mk.Pb=function(b,c){return Tb(c,"clojure.core.reducers/t_clojure$core$reducers19049")});return new Mk(Qk,b,c,V)};
function Rk(a,b){return Qk(b,function(b){return function(){function d(d,e,f){e=a.a?a.a(e,f):a.call(null,e,f);return b.a?b.a(d,e):b.call(null,d,e)}function e(d,e){var f=a.b?a.b(e):a.call(null,e);return b.a?b.a(d,f):b.call(null,d,f)}function f(){return b.m?b.m():b.call(null)}var g=null,g=function(a,b,c){switch(arguments.length){case 0:return f.call(this);case 2:return e.call(this,a,b);case 3:return d.call(this,a,b,c)}throw Error("Invalid arity: "+arguments.length);};g.m=f;g.a=e;g.c=d;return g}()})}
function Sk(a,b){return Qk(b,function(b){return function(){function d(d,e,f){return Ok(b,d,a.a?a.a(e,f):a.call(null,e,f))}function e(d,e){return Ok(b,d,a.b?a.b(e):a.call(null,e))}function f(){return b.m?b.m():b.call(null)}var g=null,g=function(a,b,c){switch(arguments.length){case 0:return f.call(this);case 2:return e.call(this,a,b);case 3:return d.call(this,a,b,c)}throw Error("Invalid arity: "+arguments.length);};g.m=f;g.a=e;g.c=d;return g}()})}
var Tk=function Tk(b,c,d,e){if(ud(b))return d.m?d.m():d.call(null);if(O(b)<=c)return Ok(e,d.m?d.m():d.call(null),b);var f=Yd(O(b)),g=Ff.c(b,0,f);b=Ff.c(b,f,O(b));return Nk(function(b,c,e,f){return function(){var b=f(c),g;g=f(e);b=b.m?b.m():b.call(null);g=g.m?g.m():g.call(null);return d.a?d.a(b,g):d.call(null,b,g)}}(f,g,b,function(b,f,g){return function(n){return function(){return function(){return Tk(n,c,d,e)}}(b,f,g)}}(f,g,b)))};Pk["null"]=function(a,b,c){return c.m?c.m():c.call(null)};
Pk.object=function(a,b,c,d){return Ok(d,c.m?c.m():c.call(null),a)};R.prototype.lc=function(a,b,c,d){return Tk(this,b,c,d)};function Uk(){}
var Vk=function Vk(b,c,d){if(null!=b&&null!=b.vb)return b.vb(b,c,d);var e=Vk[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Vk._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ua("StructurePath.select*",b);},Wk=function Wk(b,c,d){if(null!=b&&null!=b.wb)return b.wb(b,c,d);var e=Wk[u(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Wk._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ua("StructurePath.transform*",b);};
function Xk(){}var Yk=function Yk(b,c){if(null!=b&&null!=b.mc)return b.mc(0,c);var d=Yk[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Yk._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ua("Collector.collect-val",b);};var Zk=function Zk(b){if(null!=b&&null!=b.Cc)return b.Cc();var c=Zk[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Zk._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("PathComposer.comp-paths*",b);};function $k(a,b,c){this.type=a;this.rd=b;this.td=c}var al;
al=new $k(Oh,function(a,b,c,d){var e=function(){return function(a,b,c,d){return ud(c)?new R(null,1,5,S,[d],null):new R(null,1,5,S,[ld.a(c,d)],null)}}(a,b,md,d);return c.A?c.A(a,b,md,d,e):c.call(null,a,b,md,d,e)},function(a,b,c,d,e){var f=function(){return function(a,b,c,e){return ud(c)?d.b?d.b(e):d.call(null,e):B.a(d,ld.a(c,e))}}(a,b,md,e);return c.A?c.A(a,b,md,e,f):c.call(null,a,b,md,e,f)});var bl;
bl=new $k(Bi,function(a,b,c,d){a=function(){return function(a){return new R(null,1,5,S,[a],null)}}(d);return c.a?c.a(d,a):c.call(null,d,a)},function(a,b,c,d,e){return c.a?c.a(e,d):c.call(null,e,d)});function dl(a,b,c,d,e,f){this.Ka=a;this.La=b;this.Ma=c;this.da=d;this.M=e;this.u=f;this.g=2229667594;this.C=8192}k=dl.prototype;k.N=function(a,b){return pb.c(this,b,null)};
k.I=function(a,b,c){switch(b instanceof x?b.Ia:null){case "executors":return this.Ka;case "selector":return this.La;case "transformer":return this.Ma;default:return C.c(this.M,b,c)}};k.L=function(a,b,c){return Af(b,function(){return function(a){return Af(b,Bf,""," ","",c,a)}}(this),"#com.rpl.specter.impl.TransformFunctions{",", ","}",c,xe.a(new R(null,3,5,S,[new R(null,2,5,S,[Vh,this.Ka],null),new R(null,2,5,S,[Ih,this.La],null),new R(null,2,5,S,[Th,this.Ma],null)],null),this.M))};
k.Ha=function(){return new Nf(0,this,3,new R(null,3,5,S,[Vh,Ih,Th],null),lc(this.M))};k.P=function(){return this.da};k.Z=function(){return 3+O(this.M)};k.S=function(){var a=this.u;return null!=a?a:this.u=a=de(this)};k.D=function(a,b){var c;c=w(b)?(c=this.constructor===b.constructor)?Mf(this,b):c:b;return w(c)?!0:!1};
k.sb=function(a,b){return Id(new Cg(null,new v(null,3,[Ih,null,Th,null,Vh,null],null),null),b)?rd.a(Uc(gf.a(V,this),this.da),b):new dl(this.Ka,this.La,this.Ma,this.da,Ce(rd.a(this.M,b)),null)};
k.Ra=function(a,b,c){return w(le.a?le.a(Vh,b):le.call(null,Vh,b))?new dl(c,this.La,this.Ma,this.da,this.M,null):w(le.a?le.a(Ih,b):le.call(null,Ih,b))?new dl(this.Ka,c,this.Ma,this.da,this.M,null):w(le.a?le.a(Th,b):le.call(null,Th,b))?new dl(this.Ka,this.La,c,this.da,this.M,null):new dl(this.Ka,this.La,this.Ma,this.da,Q.c(this.M,b,c),null)};
k.U=function(){return F(xe.a(new R(null,3,5,S,[new R(null,2,5,S,[Vh,this.Ka],null),new R(null,2,5,S,[Ih,this.La],null),new R(null,2,5,S,[Th,this.Ma],null)],null),this.M))};k.R=function(a,b){return new dl(this.Ka,this.La,this.Ma,b,this.M,this.u)};k.X=function(a,b){return yd(b)?sb(this,hb.a(b,0),hb.a(b,1)):$a.c(fb,this,b)};function el(a,b,c){return new dl(a,b,c,null,null,null)}function fl(a,b,c,d,e,f){this.va=a;this.Ta=b;this.Ua=c;this.da=d;this.M=e;this.u=f;this.g=2229667594;this.C=8192}k=fl.prototype;
k.N=function(a,b){return pb.c(this,b,null)};k.I=function(a,b,c){switch(b instanceof x?b.Ia:null){case "transform-fns":return this.va;case "params":return this.Ta;case "params-idx":return this.Ua;default:return C.c(this.M,b,c)}};
k.L=function(a,b,c){return Af(b,function(){return function(a){return Af(b,Bf,""," ","",c,a)}}(this),"#com.rpl.specter.impl.CompiledPath{",", ","}",c,xe.a(new R(null,3,5,S,[new R(null,2,5,S,[hk,this.va],null),new R(null,2,5,S,[Gi,this.Ta],null),new R(null,2,5,S,[jj,this.Ua],null)],null),this.M))};k.Ha=function(){return new Nf(0,this,3,new R(null,3,5,S,[hk,Gi,jj],null),lc(this.M))};k.P=function(){return this.da};k.Z=function(){return 3+O(this.M)};
k.S=function(){var a=this.u;return null!=a?a:this.u=a=de(this)};k.D=function(a,b){var c;c=w(b)?(c=this.constructor===b.constructor)?Mf(this,b):c:b;return w(c)?!0:!1};k.sb=function(a,b){return Id(new Cg(null,new v(null,3,[Gi,null,jj,null,hk,null],null),null),b)?rd.a(Uc(gf.a(V,this),this.da),b):new fl(this.va,this.Ta,this.Ua,this.da,Ce(rd.a(this.M,b)),null)};
k.Ra=function(a,b,c){return w(le.a?le.a(hk,b):le.call(null,hk,b))?new fl(c,this.Ta,this.Ua,this.da,this.M,null):w(le.a?le.a(Gi,b):le.call(null,Gi,b))?new fl(this.va,c,this.Ua,this.da,this.M,null):w(le.a?le.a(jj,b):le.call(null,jj,b))?new fl(this.va,this.Ta,c,this.da,this.M,null):new fl(this.va,this.Ta,this.Ua,this.da,Q.c(this.M,b,c),null)};
k.U=function(){return F(xe.a(new R(null,3,5,S,[new R(null,2,5,S,[hk,this.va],null),new R(null,2,5,S,[Gi,this.Ta],null),new R(null,2,5,S,[jj,this.Ua],null)],null),this.M))};k.R=function(a,b){return new fl(this.va,this.Ta,this.Ua,b,this.M,this.u)};k.X=function(a,b){return yd(b)?sb(this,hb.a(b,0),hb.a(b,1)):$a.c(fb,this,b)};function gl(a){return new fl(a,null,0,null,null,null)}Y;function hl(a,b,c,d,e){this.va=a;this.mb=b;this.da=c;this.M=d;this.u=e;this.g=2229667595;this.C=8192}k=hl.prototype;
k.N=function(a,b){return pb.c(this,b,null)};k.I=function(a,b,c){switch(b instanceof x?b.Ia:null){case "transform-fns":return this.va;case "num-needed-params":return this.mb;default:return C.c(this.M,b,c)}};k.L=function(a,b,c){return Af(b,function(){return function(a){return Af(b,Bf,""," ","",c,a)}}(this),"#com.rpl.specter.impl.ParamsNeededPath{",", ","}",c,xe.a(new R(null,2,5,S,[new R(null,2,5,S,[hk,this.va],null),new R(null,2,5,S,[dj,this.mb],null)],null),this.M))};
k.Ha=function(){return new Nf(0,this,2,new R(null,2,5,S,[hk,dj],null),lc(this.M))};
k.call=function(){function a(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D,K,N,I,G){a=ue(xe.a(new R(null,20,5,S,[b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D,K,N,I],null),G));return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function b(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D,K,N,I){a=ue(20);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=A;a[15]=y;a[16]=D;a[17]=K;a[18]=N;a[19]=I;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function c(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,
A,y,D,K,N){a=ue(19);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=A;a[15]=y;a[16]=D;a[17]=K;a[18]=N;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function d(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D,K){a=ue(18);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=A;a[15]=y;a[16]=D;a[17]=K;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function e(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D){a=ue(17);
a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=A;a[15]=y;a[16]=D;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function f(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y){a=ue(16);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=A;a[15]=y;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function g(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A){a=ue(15);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;
a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;a[14]=A;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function h(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t){a=ue(14);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=t;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function l(a,b,c,d,e,f,g,h,l,m,n,p,q,r){a=ue(13);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function m(a,
b,c,d,e,f,g,h,l,m,n,p,q){a=ue(12);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function n(a,b,c,d,e,f,g,h,l,m,n,p){a=ue(11);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function q(a,b,c,d,e,f,g,h,l,m,n){a=ue(10);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function p(a,
b,c,d,e,f,g,h,l,m){a=ue(9);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function r(a,b,c,d,e,f,g,h,l){a=ue(8);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function t(a,b,c,d,e,f,g,h){a=ue(7);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function y(a,b,c,d,e,f,g){a=ue(6);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;return Y.c?Y.c(this,
a,0):Y.call(null,this,a,0)}function A(a,b,c,d,e,f){a=ue(5);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function D(a,b,c,d,e){a=ue(4);a[0]=b;a[1]=c;a[2]=d;a[3]=e;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function I(a,b,c,d){a=ue(3);a[0]=b;a[1]=c;a[2]=d;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function K(a,b,c){a=ue(2);a[0]=b;a[1]=c;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function N(a,b){var c=ue(1);c[0]=b;return Y.c?Y.c(this,c,0):Y.call(null,
this,c,0)}function Aa(){var a=ue(0);return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}var G=null,G=function(G,na,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,Ab,Xa,Va,ib,jb,Db,Kc,Cd,pf){switch(arguments.length){case 1:return Aa.call(this);case 2:return N.call(this,0,na);case 3:return K.call(this,0,na,U);case 4:return I.call(this,0,na,U,X);case 5:return D.call(this,0,na,U,X,ha);case 6:return A.call(this,0,na,U,X,ha,ia);case 7:return y.call(this,0,na,U,X,ha,ia,ja);case 8:return t.call(this,0,na,U,X,ha,ia,ja,la);case 9:return r.call(this,
0,na,U,X,ha,ia,ja,la,oa);case 10:return p.call(this,0,na,U,X,ha,ia,ja,la,oa,ua);case 11:return q.call(this,0,na,U,X,ha,ia,ja,la,oa,ua,za);case 12:return n.call(this,0,na,U,X,ha,ia,ja,la,oa,ua,za,Ca);case 13:return m.call(this,0,na,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da);case 14:return l.call(this,0,na,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,Ab);case 15:return h.call(this,0,na,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,Ab,Xa);case 16:return g.call(this,0,na,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,Ab,Xa,Va);case 17:return f.call(this,0,
na,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,Ab,Xa,Va,ib);case 18:return e.call(this,0,na,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,Ab,Xa,Va,ib,jb);case 19:return d.call(this,0,na,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,Ab,Xa,Va,ib,jb,Db);case 20:return c.call(this,0,na,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,Ab,Xa,Va,ib,jb,Db,Kc);case 21:return b.call(this,0,na,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,Ab,Xa,Va,ib,jb,Db,Kc,Cd);case 22:return a.call(this,0,na,U,X,ha,ia,ja,la,oa,ua,za,Ca,Da,Ab,Xa,Va,ib,jb,Db,Kc,Cd,pf)}throw Error("Invalid arity: "+
arguments.length);};G.b=Aa;G.a=N;G.c=K;G.l=I;G.A=D;G.T=A;G.aa=y;G.ra=t;G.sa=r;G.ga=p;G.ha=q;G.ia=n;G.ja=m;G.ka=l;G.la=h;G.ma=g;G.na=f;G.oa=e;G.pa=d;G.qa=c;G.Gb=b;G.rb=a;return G}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Za(b)))};k.m=function(){var a=ue(0);return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)};k.b=function(a){var b=ue(1);b[0]=a;return Y.c?Y.c(this,b,0):Y.call(null,this,b,0)};k.a=function(a,b){var c=ue(2);c[0]=a;c[1]=b;return Y.c?Y.c(this,c,0):Y.call(null,this,c,0)};
k.c=function(a,b,c){var d=ue(3);d[0]=a;d[1]=b;d[2]=c;return Y.c?Y.c(this,d,0):Y.call(null,this,d,0)};k.l=function(a,b,c,d){var e=ue(4);e[0]=a;e[1]=b;e[2]=c;e[3]=d;return Y.c?Y.c(this,e,0):Y.call(null,this,e,0)};k.A=function(a,b,c,d,e){var f=ue(5);f[0]=a;f[1]=b;f[2]=c;f[3]=d;f[4]=e;return Y.c?Y.c(this,f,0):Y.call(null,this,f,0)};k.T=function(a,b,c,d,e,f){var g=ue(6);g[0]=a;g[1]=b;g[2]=c;g[3]=d;g[4]=e;g[5]=f;return Y.c?Y.c(this,g,0):Y.call(null,this,g,0)};
k.aa=function(a,b,c,d,e,f,g){var h=ue(7);h[0]=a;h[1]=b;h[2]=c;h[3]=d;h[4]=e;h[5]=f;h[6]=g;return Y.c?Y.c(this,h,0):Y.call(null,this,h,0)};k.ra=function(a,b,c,d,e,f,g,h){var l=ue(8);l[0]=a;l[1]=b;l[2]=c;l[3]=d;l[4]=e;l[5]=f;l[6]=g;l[7]=h;return Y.c?Y.c(this,l,0):Y.call(null,this,l,0)};k.sa=function(a,b,c,d,e,f,g,h,l){var m=ue(9);m[0]=a;m[1]=b;m[2]=c;m[3]=d;m[4]=e;m[5]=f;m[6]=g;m[7]=h;m[8]=l;return Y.c?Y.c(this,m,0):Y.call(null,this,m,0)};
k.ga=function(a,b,c,d,e,f,g,h,l,m){var n=ue(10);n[0]=a;n[1]=b;n[2]=c;n[3]=d;n[4]=e;n[5]=f;n[6]=g;n[7]=h;n[8]=l;n[9]=m;return Y.c?Y.c(this,n,0):Y.call(null,this,n,0)};k.ha=function(a,b,c,d,e,f,g,h,l,m,n){var q=ue(11);q[0]=a;q[1]=b;q[2]=c;q[3]=d;q[4]=e;q[5]=f;q[6]=g;q[7]=h;q[8]=l;q[9]=m;q[10]=n;return Y.c?Y.c(this,q,0):Y.call(null,this,q,0)};
k.ia=function(a,b,c,d,e,f,g,h,l,m,n,q){var p=ue(12);p[0]=a;p[1]=b;p[2]=c;p[3]=d;p[4]=e;p[5]=f;p[6]=g;p[7]=h;p[8]=l;p[9]=m;p[10]=n;p[11]=q;return Y.c?Y.c(this,p,0):Y.call(null,this,p,0)};k.ja=function(a,b,c,d,e,f,g,h,l,m,n,q,p){var r=ue(13);r[0]=a;r[1]=b;r[2]=c;r[3]=d;r[4]=e;r[5]=f;r[6]=g;r[7]=h;r[8]=l;r[9]=m;r[10]=n;r[11]=q;r[12]=p;return Y.c?Y.c(this,r,0):Y.call(null,this,r,0)};
k.ka=function(a,b,c,d,e,f,g,h,l,m,n,q,p,r){var t=ue(14);t[0]=a;t[1]=b;t[2]=c;t[3]=d;t[4]=e;t[5]=f;t[6]=g;t[7]=h;t[8]=l;t[9]=m;t[10]=n;t[11]=q;t[12]=p;t[13]=r;return Y.c?Y.c(this,t,0):Y.call(null,this,t,0)};k.la=function(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t){var y=ue(15);y[0]=a;y[1]=b;y[2]=c;y[3]=d;y[4]=e;y[5]=f;y[6]=g;y[7]=h;y[8]=l;y[9]=m;y[10]=n;y[11]=q;y[12]=p;y[13]=r;y[14]=t;return Y.c?Y.c(this,y,0):Y.call(null,this,y,0)};
k.ma=function(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y){var A=ue(16);A[0]=a;A[1]=b;A[2]=c;A[3]=d;A[4]=e;A[5]=f;A[6]=g;A[7]=h;A[8]=l;A[9]=m;A[10]=n;A[11]=q;A[12]=p;A[13]=r;A[14]=t;A[15]=y;return Y.c?Y.c(this,A,0):Y.call(null,this,A,0)};k.na=function(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A){var D=ue(17);D[0]=a;D[1]=b;D[2]=c;D[3]=d;D[4]=e;D[5]=f;D[6]=g;D[7]=h;D[8]=l;D[9]=m;D[10]=n;D[11]=q;D[12]=p;D[13]=r;D[14]=t;D[15]=y;D[16]=A;return Y.c?Y.c(this,D,0):Y.call(null,this,D,0)};
k.oa=function(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D){var I=ue(18);I[0]=a;I[1]=b;I[2]=c;I[3]=d;I[4]=e;I[5]=f;I[6]=g;I[7]=h;I[8]=l;I[9]=m;I[10]=n;I[11]=q;I[12]=p;I[13]=r;I[14]=t;I[15]=y;I[16]=A;I[17]=D;return Y.c?Y.c(this,I,0):Y.call(null,this,I,0)};k.pa=function(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I){var K=ue(19);K[0]=a;K[1]=b;K[2]=c;K[3]=d;K[4]=e;K[5]=f;K[6]=g;K[7]=h;K[8]=l;K[9]=m;K[10]=n;K[11]=q;K[12]=p;K[13]=r;K[14]=t;K[15]=y;K[16]=A;K[17]=D;K[18]=I;return Y.c?Y.c(this,K,0):Y.call(null,this,K,0)};
k.qa=function(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I,K){var N=ue(20);N[0]=a;N[1]=b;N[2]=c;N[3]=d;N[4]=e;N[5]=f;N[6]=g;N[7]=h;N[8]=l;N[9]=m;N[10]=n;N[11]=q;N[12]=p;N[13]=r;N[14]=t;N[15]=y;N[16]=A;N[17]=D;N[18]=I;N[19]=K;return Y.c?Y.c(this,N,0):Y.call(null,this,N,0)};k.Gb=function(a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I,K,N){a=ue(xe.a(new R(null,20,5,S,[a,b,c,d,e,f,g,h,l,m,n,q,p,r,t,y,A,D,I,K],null),N));return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)};k.P=function(){return this.da};
k.Z=function(){return 2+O(this.M)};k.S=function(){var a=this.u;return null!=a?a:this.u=a=de(this)};k.D=function(a,b){var c;c=w(b)?(c=this.constructor===b.constructor)?Mf(this,b):c:b;return w(c)?!0:!1};k.sb=function(a,b){return Id(new Cg(null,new v(null,2,[dj,null,hk,null],null),null),b)?rd.a(Uc(gf.a(V,this),this.da),b):new hl(this.va,this.mb,this.da,Ce(rd.a(this.M,b)),null)};
k.Ra=function(a,b,c){return w(le.a?le.a(hk,b):le.call(null,hk,b))?new hl(c,this.mb,this.da,this.M,null):w(le.a?le.a(dj,b):le.call(null,dj,b))?new hl(this.va,c,this.da,this.M,null):new hl(this.va,this.mb,this.da,Q.c(this.M,b,c),null)};k.U=function(){return F(xe.a(new R(null,2,5,S,[new R(null,2,5,S,[hk,this.va],null),new R(null,2,5,S,[dj,this.mb],null)],null),this.M))};k.R=function(a,b){return new hl(this.va,this.mb,b,this.M,this.u)};
k.X=function(a,b){return yd(b)?sb(this,hb.a(b,0),hb.a(b,1)):$a.c(fb,this,b)};function il(a,b){return new hl(a,b,null,null,null)}function Y(a,b,c){return new fl(a.va,b,c,null,null,null)}function jl(a){return new v(null,2,[xj,null!=a&&a.ub?function(a,c,d){return a.vb(null,c,d)}:Vk,hi,null!=a&&a.ub?function(a,c,d){return a.wb(null,c,d)}:Wk],null)}function kl(a){return new v(null,1,[Fj,null!=a&&a.Fc?function(a,c){return a.mc(0,c)}:Yk],null)}
function ll(a){var b=function(b){return function(d,e,f,g,h){f=ld.a(f,b.a?b.a(a,g):b.call(null,a,g));return h.l?h.l(d,e,f,g):h.call(null,d,e,f,g)}}(Fj.b(kl(a)));return gl(el(al,b,b))}function ml(a){var b=jl(a),c=xj.b(b),d=hi.b(b);return gl(el(bl,function(b,c){return function(b,d){return c.c?c.c(a,b,d):c.call(null,a,b,d)}}(b,c,d),function(b,c,d){return function(b,c){return d.c?d.c(a,b,c):d.call(null,a,b,c)}}(b,c,d)))}
var nl=function nl(b){if(null!=b&&null!=b.gb)return b.gb(b);var c=nl[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=nl._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("CoercePath.coerce-path",b);};nl["null"]=function(){return ml(null)};fl.prototype.gb=function(){return this};hl.prototype.gb=function(){return this};R.prototype.gb=function(){return Zk(this)};Fc.prototype.gb=function(){return nl(Nd(this))};he.prototype.gb=function(){return nl(Nd(this))};ed.prototype.gb=function(){return nl(Nd(this))};
nl._=function(a){var b;b=(b=(b=ca(a))?b:null!=a?a.Mc?!0:a.ac?!1:Ta(ab,a):Ta(ab,a))?b:null!=a?a.ub?!0:a.ac?!1:Ta(Uk,a):Ta(Uk,a);if(w(b))a=ml(a);else if(null!=a?a.Fc||(a.ac?0:Ta(Xk,a)):Ta(Xk,a))a=ll(a);else throw b=E,a=[z("Protocol implementation cannot be found for object.\n        Extending Specter protocols should not be done inline in a deftype definition\n        because that prevents Specter from finding the protocol implementations for\n        optimized performance. Instead, you should extend the protocols via an\n        explicit extend-protocol call. \n"),
z(a)].join(""),a=b([a],0),Error(B.a(z,a));return a};function ol(a){return a.Ka.type}
function pl(a){var b=P(a,0),c=$d(a,1),d=b.Ka,e=d.type,f=vc.a(e,Oh)?function(a,b,c,d,e,f){return function(p,r){return function(a,b,c,d,e,f){return function(g,h,l,m,n){var q=function(){return function(a,b,c,d){return r.A?r.A(a,b,c,d,n):r.call(null,a,b,c,d,n)}}(g,h,l,m,a,b,c,d,e,f);return p.A?p.A(g,h,l,m,q):p.call(null,g,h,l,m,q)}}(a,b,c,d,e,f)}}(d,e,a,b,c,a):function(a,b,c,d,e,f){return function(p,r){return function(a,b,c,d,e,f){return function(g,h){var l=function(){return function(a){return r.a?r.a(a,
h):r.call(null,a,h)}}(g,a,b,c,d,e,f);return p.a?p.a(g,l):p.call(null,g,l)}}(a,b,c,d,e,f)}}(d,e,a,b,c,a);return $a.a(function(a,b,c){return function(b,d){return el(a,function(){var a=b.La,e=d.La;return c.a?c.a(a,e):c.call(null,a,e)}(),function(){var a=b.Ma,e=d.Ma;return c.a?c.a(a,e):c.call(null,a,e)}())}}(d,e,f,a,b,c,a),a)}
function ql(a){if(vc.a(ol(a),Oh))return a;var b=a.La;a=a.Ma;return el(al,function(a,b){return function(e,f,g,h,l){var m=function(){return function(a){return l.l?l.l(e,f,g,a):l.call(null,e,f,g,a)}}(h,a,b);return a.a?a.a(h,m):a.call(null,h,m)}}(b,a),function(a,b){return function(e,f,g,h,l){var m=function(){return function(a){return l.l?l.l(e,f,g,a):l.call(null,e,f,g,a)}}(h,a,b);return b.a?b.a(h,m):b.call(null,h,m)}}(b,a))}
function rl(a){if(a instanceof fl){var b=Gi.b(a),c=jj.b(a),d=Ih.b(hk.b(a)),e=Th.b(hk.b(a));return ud(b)?a:gl(el(al,function(a,b,c,d){return function(e,n,q,p,r){var t=function(){return function(a,b,c,d){return r.l?r.l(e,n,c,d):r.call(null,e,n,c,d)}}(a,b,q,p,a,b,c,d);return c.A?c.A(a,b,q,p,t):c.call(null,a,b,q,p,t)}}(b,c,d,e),function(a,b,c,d){return function(e,n,q,p,r){var t=function(){return function(a,b,c,d){return r.l?r.l(e,n,c,d):r.call(null,e,n,c,d)}}(a,b,q,p,a,b,c,d);return d.A?d.A(a,b,q,p,t):
d.call(null,a,b,q,p,t)}}(b,c,d,e)))}return a}Zk["null"]=function(a){return nl(a)};Zk._=function(a){return nl(a)};R.prototype.Cc=function(){if(ud(this))return nl(null);var a=T.a(rl,T.a(nl,this)),b=T.a(pl,Kg(ol,T.a(hk,a))),c=vc.a(1,O(b))?H(b):pl(T.a(ql,b)),a=df(function(){return function(a){return a instanceof hl}}(a,b,c,this),a);return ud(a)?gl(c):il(ql(c),$a.a(Qd,T.a(dj,a)))};function sl(a){return a instanceof fl?0:dj.b(a)}
var tl=function tl(b,c){if(null!=b&&null!=b.Dc)return b.Dc(0,c);var d=tl[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=tl._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ua("SetExtremes.set-first",b);},ul=function ul(b,c){if(null!=b&&null!=b.Ec)return b.Ec(0,c);var d=ul[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=ul._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ua("SetExtremes.set-last",b);};
R.prototype.Dc=function(a,b){return Q.c(this,0,b)};R.prototype.Ec=function(a,b){return Q.c(this,O(this)-1,b)};tl._=function(a,b){return M(b,Gc(a))};ul._=function(a,b){var c=Fg(a);return ld.a(Nd(c),b)};function vl(a,b){var c=a.va;return c.Ka.rd.call(null,a.Ta,a.Ua,c.La,b)}function wl(a,b,c){var d=a.va;return d.Ka.td.call(null,a.Ta,a.Ua,d.Ma,b,c)}function xl(){}xl.prototype.ub=!0;xl.prototype.vb=function(a,b,c){return gf.a(md,Sk(c,b))};
xl.prototype.wb=function(a,b,c){a=null==b?null:db(b);if(ge(a))for(c=b=T.a(c,b);;)if(F(c))c=J(c);else break;else b=gf.a(a,Rk(c,b));return b};function yl(){}yl.prototype.Fc=!0;yl.prototype.mc=function(a,b){return b};function zl(a,b){this.Ic=a;this.sd=b}zl.prototype.ub=!0;zl.prototype.vb=function(a,b,c){if(ud(b))return null;a=this.Ic.call(null,b);return c.b?c.b(a):c.call(null,a)};
zl.prototype.wb=function(a,b,c){var d=this;return ud(b)?b:d.sd.call(null,b,function(){var a=d.Ic.call(null,b);return c.b?c.b(a):c.call(null,a)}())};function Al(a,b,c,d){a=Ff.c(Nd(a),b,c);return d.b?d.b(a):d.call(null,a)}function Bl(a,b,c,d){var e=Nd(a),f=Ff.c(e,b,c);d=d.b?d.b(f):d.call(null,f);b=xe.h(Ff.c(e,0,b),d,E([Ff.c(e,c,O(a))],0));return yd(a)?Nd(b):b}Uk["null"]=!0;Vk["null"]=function(a,b,c){return c.b?c.b(b):c.call(null,b)};Wk["null"]=function(a,b,c){return c.b?c.b(b):c.call(null,b)};
function Cl(a,b,c){return w(a.b?a.b(b):a.call(null,b))?c.b?c.b(b):c.call(null,b):null}function Dl(a,b,c){return w(a.b?a.b(b):a.call(null,b))?c.b?c.b(b):c.call(null,b):b};function El(a){return Zk(Nd(a))}function Fl(a,b){var c=Zk(a);return vl.a?vl.a(c,b):vl.call(null,c,b)}function Gl(a,b,c){a=Zk(a);return wl.c?wl.c(a,b,c):wl.call(null,a,b,c)}var Hl=El(E([new xl],0)),Il=new yl,Jl=El(E([new zl(kd,ul)],0));El(E([new zl(H,tl)],0));
var Kl=il(el(al,function(a,b,c,d,e){var f=a[b+0],g=a[b+1];return Al(d,f.b?f.b(d):f.call(null,d),g.b?g.b(d):g.call(null,d),function(d){var f=b+2;return e.l?e.l(a,f,c,d):e.call(null,a,f,c,d)})},function(a,b,c,d,e){var f=a[b+0],g=a[b+1];return Bl(d,f.b?f.b(d):f.call(null,d),g.b?g.b(d):g.call(null,d),function(d){var f=b+2;return e.l?e.l(a,f,c,d):e.call(null,a,f,c,d)})}),2),Ll=il(el(al,function(a,b,c,d,e){return Al(d,a[b+0],a[b+1],function(d){var g=b+2;return e.l?e.l(a,g,c,d):e.call(null,a,g,c,d)})},function(a,
b,c,d,e){return Bl(d,a[b+0],a[b+1],function(d){var g=b+2;return e.l?e.l(a,g,c,d):e.call(null,a,g,c,d)})}),2);Ll.a?Ll.a(0,0):Ll.call(null,0,0);Kl.a?Kl.a(O,O):Kl.call(null,O,O);x.prototype.ub=!0;x.prototype.vb=function(a,b,c){a=C.a(b,this);return c.b?c.b(a):c.call(null,a)};x.prototype.wb=function(a,b,c){var d=this;return Q.c(b,d,function(){var a=C.a(b,d);return c.b?c.b(a):c.call(null,a)}())};Uk["function"]=!0;Vk["function"]=function(a,b,c){return Cl(a,b,c)};
Wk["function"]=function(a,b,c){return Dl(a,b,c)};Cg.prototype.ub=!0;Cg.prototype.vb=function(a,b,c){return Cl(this,b,c)};Cg.prototype.wb=function(a,b,c){return Dl(this,b,c)};var Ml=il(el(al,function(a,b,c,d,e){var f=a[b+0];d=w(d)?d:f;b+=1;return e.l?e.l(a,b,c,d):e.call(null,a,b,c,d)},function(a,b,c,d,e){var f=a[b+0];d=w(d)?d:f;b+=1;return e.l?e.l(a,b,c,d):e.call(null,a,b,c,d)}),1);Ml.b?Ml.b(Dg):Ml.call(null,Dg);var Nl=Hc;Ml.b?Ml.b(Nl):Ml.call(null,Nl);Ml.b?Ml.b(md):Ml.call(null,md);
function Ol(){var a=E([Ak],0),b=T.a(Zk,new R(null,1,5,S,[a],null)),c=T.a(sl,b),d=M(0,Lg(c)),e=kd(d),f=T.c(function(a,b,c,d){return function(e,f){return w(f instanceof fl)?function(){return function(){return f}}(a,b,c,d):function(){return function(a,b){return Y(f,a,b+e)}}(a,b,c,d)}}(b,c,d,e),d,b),g=P(f,0),a=function(){var a=function(a,b,c,d,e,f,g){return function(a,b,c,e,f){var h;h=g.a?g.a(a,b):g.call(null,a,b);var l=vl.a?vl.a(h,e):vl.call(null,h,e);if(1<O(l))throw a=E(["More than one element found for params: ",
h,e],0),Error(B.a(z,a));h=H(l);b+=d;c=ld.a(c,h);return f.l?f.l(a,b,c,e):f.call(null,a,b,c,e)}}(b,c,d,e,f,f,g);return il(el(al,a,a),e)}();return vc.a(0,e)?Y(a,null,0):a};var Pl=new v(null,3,[Ai,2,Yh,4,Qj,1],null),Ql=new v(null,3,[Ai,40,Yh,40,Qj,0],null);function Rl(a,b){var c=T.a(Me.a(Pl,Li),b),d=a/$a.a(Qd,c);return T.a(Ne(Sd,d),c)}function Sl(a,b,c){return ld.a(b,function(){var d=null==b?null:zb(b);return a.a?a.a(d,c):a.call(null,d,c)}())}function Tl(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a,c=C.a(c,Li),c=b-(Ql.b?Ql.b(c):Ql.call(null,c));return c-Xd(c,20)}
function Ul(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a,d=C.a(c,zi),e=C.a(c,Dk),f=Rl(e,b);return T.h(function(a,b,c,d){return function(a,b,c,e){a=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a;C.a(a,Li);return zg.h(E([a,new v(null,5,[Bh,c,zi,d,Lj,e,ai,e,Ci,-30],null)],0))}}(f,a,c,d,e),b,f,$a.c(Ne(Sl,Qd),new R(null,1,5,S,[0],null),f),E([T.c(Tl,b,f)],0))}
function Vl(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a,d=C.a(c,zi),e=C.a(c,Dk),f=C.a(c,bk),g=O(b),h=d/g;return T.c(function(a,b,c,d,e,f){return function(a,c){var d=new v(null,3,[bk,a,zi,b-30,Dk,f],null),d=null!=d&&(d.g&64||d.F)?B.a(Sc,d):d,e=C.a(d,zi),g=C.a(d,Dk),h=null!=c&&(c.g&64||c.F)?B.a(Sc,c):c;C.a(h,bi);return lf.c(zg.h(E([h,d],0)),bi,Ne(Ul,new v(null,2,[zi,e,Dk,g],null)))}}(g,h,a,c,d,e,f),We(g,$e(Ne(Qd,h),f)),b)};function Wl(a){return vc.a(Yh,Li.b(a))}function Xl(a){return Gl(new R(null,7,5,S,[qi,Hl,bi,Hl,function(a){return ek.b(a)},zk,Jl],null),Le(yi),a)}if("undefined"===typeof Yl)var Yl=function(){var a=W.b?W.b(V):W.call(null,V),b=W.b?W.b(V):W.call(null,V),c=W.b?W.b(V):W.call(null,V),d=W.b?W.b(V):W.call(null,V),e=C.c(V,ok,mh());return new xh(Dc.a("pennygame.updates","capacity"),function(){return function(a,b){var c=null!=b&&(b.g&64||b.F)?B.a(Sc,b):b;return C.a(c,Li)}}(a,b,c,d,e),ni,e,a,b,c,d)}();
zh(Yl,Ui,function(a){return a});zh(Yl,fj,function(a){switch(a){case 1:return 4;case 2:return 4;case 3:return 4;case 4:return 4;case 5:return 5;case 6:return 6;default:throw Error([z("No matching clause: "),z(a)].join(""));}});zh(Yl,Qi,function(a,b,c){a=null!=b&&(b.g&64||b.F)?B.a(Sc,b):b;b=C.a(a,Hh);a=C.a(a,mi);c=od(c,b);b=null!=c&&(c.g&64||c.F)?B.a(Sc,c):c;c=C.a(b,ci);b=C.a(b,zk);if(vc.a(a,ci))return c;a=O(b);return c<a?c:a});function Zl(a,b){return Gl(new R(null,4,5,S,[qi,Hl,bi,Hl],null),b,a)}
function $l(a,b){return Nd(T.c(function(a,b){return Q.c(a,ti,b)},a,b))}function am(a,b){return lf.l(a,kk,$l,b)}function bm(a,b){return Gl(new R(null,6,5,S,[qi,Hl,bi,Il,Hl,function(a){return Id(a,Rh)}],null),function(a,d){var e=null!=d&&(d.g&64||d.F)?B.a(Sc,d):d,f=C.a(e,Rh),g=C.a(e,Bk);C.a(e,zk);f=hf(b,new R(null,2,5,S,[f,ti],null));g=Yl.c?Yl.c(f,g,a):Yl.call(null,f,g,a);return Q.c(e,ci,g)},a)}
function cm(a,b){return Gl(new R(null,7,5,S,[qi,Hl,bi,Il,Hl,function(a){return Id(a,Rh)},function(a){return vc.a(Qi,hf(a,new R(null,2,5,S,[Bk,Li],null)))}],null),function(a,d){var e=null!=d&&(d.g&64||d.F)?B.a(Sc,d):d,f=C.a(e,Rh),g=C.a(e,Bk);C.a(e,zk);f=hf(b,new R(null,2,5,S,[f,ti],null));g=Yl.c?Yl.c(f,g,a):Yl.call(null,f,g,a);return Q.c(e,ci,g)},a)}function dm(a){var b=a.b?a.b(kk):a.call(null,kk);return cm(bm(a,b),b)}
if("undefined"===typeof em){var em,fm=W.b?W.b(V):W.call(null,V),gm=W.b?W.b(V):W.call(null,V),hm=W.b?W.b(V):W.call(null,V),im=W.b?W.b(V):W.call(null,V),jm=C.c(V,ok,mh());em=new xh(Dc.a("pennygame.updates","process"),Li,ni,jm,fm,gm,hm,im)}zh(em,ni,function(a){a=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a;var b=C.a(a,ci),c=C.a(a,zk);return Q.h(a,zk,Xe(b,c),E([ak,We(b,c)],0))});zh(em,Ai,function(a){a=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a;var b=C.a(a,ci);return Q.c(a,ak,We(b,Ye(Fi)))});
function km(a){var b=H(Fl(new R(null,4,5,S,[bi,Hl,function(a){return Pj.b(a)},Pj],null),a));return Gl(new R(null,5,5,S,[bi,function(){var a=b+1;return Ll.a?Ll.a(b,a):Ll.call(null,b,a)}(),Hl,ak,Jl],null),Le(yi),a)}function lm(a){return Je(function(a){return vc.a(a,yi)},Fl(new R(null,4,5,S,[Hl,function(a){return Pj.b(a)},ak,Hl],null),a))}function mm(a){return w(lm(a.b?a.b(bi):a.call(null,bi)))?km(a):a}
function nm(a){return Gl(new R(null,2,5,S,[qi,Hl],null),mm,Gl(new R(null,5,5,S,[qi,Hl,bi,Hl,function(a){return C.a(a,ci)}],null),em,a))}function om(a){var b=B.c(Wd,16.5,T.a(function(a){var b=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a;a=C.a(b,Mj);var e=C.a(b,Ak),b=C.a(b,zk);return a/(O(e)+O(b))},Fl(new R(null,5,5,S,[qi,Hl,bi,Hl,Wl],null),a)));return Gl(new R(null,5,5,S,[qi,Hl,bi,Hl,Wl],null),function(a){return function(b){return lf.l(b,Eh,Wd,a)}}(b),a)}
function pm(a){return Gl(new R(null,6,5,S,[qi,Hl,bi,Il,Hl,function(a){return Id(a,Fh)}],null),function(a,c){var d=null!=c&&(c.g&64||c.F)?B.a(Sc,c):c,e=C.a(d,Fh);return Q.c(d,Ak,hf(Nd(a),new R(null,2,5,S,[e,ak],null)))},a)}function qm(a){return Gl(new R(null,6,5,S,[qi,Hl,bi,Hl,Ol(),zk],null),function(a,c){return xe.a(c,a)},a)}
function rm(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a,c=C.a(c,bi),d=null!=b&&(b.g&64||b.F)?B.a(Sc,b):b,e=C.c(d,vk,0),f=C.c(d,Ph,0),g=C.c(d,Ji,0),h=C.c(d,Pi,0),l=C.a(d,Dj),m=C.a(d,Hi),n=C.c(d,li,new R(null,2,5,S,[0,0],null)),d=O(ak.b(H(c))),q=O(ak.b(kd(Fg(c)))),p=B.c(T,Qd,T.a(Ng(Me.a(O,ak),ci),Fl(new R(null,2,5,S,[Hl,Wl],null),c))),r=$a.a(Qd,T.a(O,Fl(new R(null,3,5,S,[Hl,Wl,zk],null),c))),n=T.c(Qd,n,p);return qd([Ph,li,Hi,Ji,Pi,Vi,lj,Dj,vk],[w(lm(c))?f+1:f,n,m+q,w(lm(c))?e-h:g,w(lm(c))?e:h,r,B.a(Td,
n),l+d,e+1])}function sm(a){return Gl(new R(null,5,5,S,[qi,Hl,function(a){return F(C.a(a,bi))},Il,$h],null),function(a,c){return ld.a(c,rm(a,null==c?null:zb(c)))},Gl(new R(null,7,5,S,[qi,Hl,function(a){return F(C.a(a,bi))},bi,Hl,function(a){return O(ak.b(a))<ci.b(a)},pk],null),Vc,a))};var tm,um=new v(null,3,[vk,50,rj,400,xi,400],null);tm=W.b?W.b(um):W.call(null,um);var vm=VDOM.diff,wm=VDOM.patch,xm=VDOM.create;function ym(a){return ef(Qa,ef(Gd,ff(a)))}function zm(a,b,c){return new VDOM.VHtml(ae(a),hh(rd.a(b,Zh)),hh(c),Zh.b(b))}function Am(a,b,c){return new VDOM.VSvg(ae(a),hh(b),hh(c))}Bm;
var Cm=function Cm(b){if(null==b)return new VDOM.VText("");if(w(VDOM.isVirtualNode(b)))return b;if(Gd(b))return zm(ij,V,T.a(Cm,ym(b)));if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(vc.a(Jj,H(b)))return Bm.b?Bm.b(b):Bm.call(null,b);var c=P(b,0),d=P(b,1);b=$d(b,2);return zm(c,d,T.a(Cm,ym(b)))},Bm=function Bm(b){if(null==b)return new VDOM.VText("");if(w(VDOM.isVirtualNode(b)))return b;if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(vc.a(Hk,H(b))){var c=
P(b,0),d=P(b,1);b=$d(b,2);return Am(c,d,T.a(Cm,ym(b)))}c=P(b,0);d=P(b,1);b=$d(b,2);return Am(c,d,T.a(Bm,ym(b)))};
function Dm(){var a=document.getElementById("app"),b=function(){var a=new VDOM.VText("");return W.b?W.b(a):W.call(null,a)}(),c=function(){var a;a=L.b?L.b(b):L.call(null,b);a=xm.b?xm.b(a):xm.call(null,a);return W.b?W.b(a):W.call(null,a)}(),d=function(){var a=window.requestAnimationFrame;return w(a)?function(a){return function(b){return a.b?a.b(b):a.call(null,b)}}(a,a,b,c):function(){return function(a){return a.m?a.m():a.call(null)}}(a,b,c)}();a.appendChild(L.b?L.b(c):L.call(null,c));return function(a,
b,c){return function(d){var l=Cm(d);d=function(){var b=L.b?L.b(a):L.call(null,a);return vm.a?vm.a(b,l):vm.call(null,b,l)}();Te.a?Te.a(a,l):Te.call(null,a,l);d=function(a,b,c,d){return function(){return Ue.c(d,wm,b)}}(l,d,a,b,c);return c.b?c.b(d):c.call(null,d)}}(b,c,d)};function Em(a){if(w(vc.a?vc.a(0,a):vc.call(null,0,a)))return md;if(w(vc.a?vc.a(1,a):vc.call(null,1,a)))return new R(null,1,5,S,[new R(null,2,5,S,[0,0],null)],null);if(w(vc.a?vc.a(2,a):vc.call(null,2,a)))return new R(null,2,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[1,1],null)],null);if(w(vc.a?vc.a(3,a):vc.call(null,3,a)))return new R(null,3,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[0,0],null),new R(null,2,5,S,[1,1],null)],null);if(w(vc.a?vc.a(4,a):vc.call(null,4,a)))return new R(null,
4,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[-1,1],null),new R(null,2,5,S,[1,-1],null),new R(null,2,5,S,[1,1],null)],null);if(w(vc.a?vc.a(5,a):vc.call(null,5,a)))return new R(null,5,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[-1,1],null),new R(null,2,5,S,[0,0],null),new R(null,2,5,S,[1,-1],null),new R(null,2,5,S,[1,1],null)],null);if(w(vc.a?vc.a(6,a):vc.call(null,6,a)))return new R(null,6,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[-1,0],null),new R(null,2,5,S,[-1,1],
null),new R(null,2,5,S,[1,-1],null),new R(null,2,5,S,[1,0],null),new R(null,2,5,S,[1,1],null)],null);throw Error([z("No matching clause: "),z(a)].join(""));}var Fm=Ng(function(a){return a.x},function(a){return a.y});
function Gm(a){var b=P(a,0),c=P(a,1),d=Math.ceil(Math.sqrt(4)),e=b/d,f=c/d;return function(a,b,c,d,e,f,p){return function t(y){return new ne(null,function(a,b,c,d,e,f,g){return function(){for(var h=y;;){var l=F(h);if(l){var m=l,n=H(m);if(l=F(function(a,b,c,d,e,f,g,h,l,m,n){return function ib(p){return new ne(null,function(a,b,c,d,e,f,g,h){return function(){for(;;){var a=F(p);if(a){if(Bd(a)){var c=ec(a),d=O(c),e=re(d);a:for(var l=0;;)if(l<d){var m=hb.a(c,l),m=Q.h(h,bk,m*f,E([Bh,b*g],0));e.add(m);l+=
1}else{c=!0;break a}return c?se(e.W(),ib(fc(a))):se(e.W(),null)}e=H(a);return M(Q.h(h,bk,e*f,E([Bh,b*g],0)),ib(Gc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n),null,null)}}(h,n,m,l,a,b,c,d,e,f,g)(new Jg(null,0,a,1,null))))return xe.a(l,t(Gc(h)));h=Gc(h)}else return null}}}(a,b,c,d,e,f,p),null,null)}}(d,e,f,new v(null,2,[zi,e,Dk,f],null),a,b,c)(new Jg(null,0,d,1,null))}var Hm=Ng(Ne(B,Wd),Ne(B,Vd));
function Im(a,b){var c=P(a,0),d=P(a,1),e=P(b,0),f=P(b,1),g=vc.a(c,d)?new R(null,2,5,S,[0,1],null):new R(null,2,5,S,[c,d],null),h=P(g,0),l=P(g,1),m=(f-e)/(l-h);return function(a,b,c,d,e){return function(a){return d*a+e}}(g,h,l,m,f-m*l,a,c,d,b,e,f)}
var Jm=function Jm(b,c){return vc.a(1,b)?T.a(tc,c):new ne(null,function(){var d=F(c);if(d){var e=P(d,0),f=$d(d,1);return xe.a(function(){return function(b,c,d,e){return function q(f){return new ne(null,function(b,c){return function(){for(;;){var b=F(f);if(b){if(Bd(b)){var d=ec(b),e=O(d),g=re(e);a:for(var h=0;;)if(h<e){var l=hb.a(d,h),l=M(c,l);g.add(l);h+=1}else{d=!0;break a}return d?se(g.W(),q(fc(b))):se(g.W(),null)}g=H(b);return M(M(c,g),q(Gc(b)))}return null}}}(b,c,d,e),null,null)}}(d,e,f,d)(Jm(b-
1,f))}(),Jm(b,f))}return null},null,null)};
function Km(a){function b(a){var b=wc;F(a)?(a=Md.b?Md.b(a):Md.call(null,a),b=Ld(b),wa(a,b),a=F(a)):a=Hc;b=P(a,0);a=P(a,1);var c=(18-(a-b))/2,b=[b,b-c,a,a+c];a=[];for(c=0;;)if(c<b.length){var g=b[c],h=b[c+1];-1===Rf(a,g)&&(a.push(g),a.push(h));c+=2}else break;return new v(null,a.length/2,a,null)}for(;;){var c=jd(B.c(Gg,H,df(function(){return function(a){return 0<H(a)&&18>H(a)}}(a,b),T.a(function(){return function(a){var b=S,c=B.a(Rd,a);return new R(null,2,5,b,[Math.abs(c),a],null)}}(a,b),Jm(2,a)))));
if(w(c))a=Eg(b(c),a);else return a}}function Lm(a,b){return xe.a(a,Xe(O(a),b))}function Mm(a,b,c){var d=null!=b&&(b.g&64||b.F)?B.a(Sc,b):b;b=C.a(d,zi);var d=C.a(d,Dk),e=null!=c&&(c.g&64||c.F)?B.a(Sc,c):c;c=C.a(e,Ck);var e=C.a(e,gk),f=B.a(xe,a);a=Lm(e,function(){var a=T.a(H,f);return Hm.b?Hm.b(a):Hm.call(null,a)}());c=Lm(c,function(){var a=T.a(jd,f);return Hm.b?Hm.b(a):Hm.call(null,a)}());return new R(null,2,5,S,[Im(a,new R(null,2,5,S,[0,b],null)),Im(c,new R(null,2,5,S,[d,0],null))],null)};function Nm(a){this.Fa=a}Nm.prototype.ed=function(a,b,c){return this.Fa.c?this.Fa.c(a,b,c):this.Fa.call(null,a,b,c)};ba("Hook",Nm);ba("Hook.prototype.hook",Nm.prototype.ed);function Om(a){return document.querySelector([z("#"),z(a),z(" .penny-path")].join(""))}function Pm(a){return document.querySelector([z("#"),z(a),z(" .ramp")].join(""))};function Qm(a){return zg.h(E([qd([Eh,ci,Li,zj,ak,pk,zk,Ak,Bk],[999999,null,Yh,ch("station"),md,0,We(4,Ye(Fi)),md,new v(null,1,[Li,Ui],null)]),B.a(Sc,a)],0))}function Rm(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;return Sm(0<b.length?new Fc(b.slice(0),0):null)}function Sm(a){return zg.h(E([new v(null,2,[$h,md,bi,md],null),B.a(Sc,a)],0))}
var Tm=Sm(E([pi,Vj,bi,new R(null,6,5,S,[Qm(E([Li,Ai,Rh,0],0)),Qm(E([Fh,0,Rh,1,ek,!0],0)),Qm(E([Fh,1,Rh,2],0)),Qm(E([Fh,2,Rh,3],0)),Qm(E([Fh,3,Rh,4,Pj,0],0)),Qm(E([Li,Qj,Fh,4],0))],null)],0)),Um=Sm(E([pi,fi,bi,new R(null,6,5,S,[Qm(E([Li,Ai,Rh,0,Bk,new v(null,1,[Li,fj],null)],0)),Qm(E([Fh,0,Rh,1,Bk,new v(null,1,[Li,fj],null),ek,!0],0)),Qm(E([Fh,1,Rh,2,Bk,new v(null,1,[Li,fj],null)],0)),Qm(E([Fh,2,Rh,3,ik,!0],0)),Qm(E([Fh,3,Rh,4,Bk,new v(null,1,[Li,fj],null),Pj,0],0)),Qm(E([Li,Qj,Fh,4],0))],null)],0)),
Vm=Sm(E([pi,Qi,bi,new R(null,6,5,S,[Qm(E([Li,Ai,Rh,0,Bk,new v(null,3,[Li,Qi,Hh,3,mi,ci],null),ik,!0],0)),Qm(E([Fh,0,Rh,1,Bk,new v(null,1,[Li,fj],null),ek,!0],0)),Qm(E([Fh,1,Rh,2,Bk,new v(null,1,[Li,fj],null)],0)),Qm(E([Fh,2,Rh,3,ik,!0],0)),Qm(E([Fh,3,Rh,4,Bk,new v(null,1,[Li,fj],null),Pj,0],0)),Qm(E([Li,Qj,Fh,4],0))],null)],0));
Sm(E([pi,jk,bi,new R(null,6,5,S,[Qm(E([Li,Ai,Rh,0,Bk,new v(null,3,[Li,Qi,Hh,3,mi,Si],null)],0)),Qm(E([Fh,0,Rh,1,Bk,new v(null,1,[Li,fj],null),ek,!0],0)),Qm(E([Fh,1,Rh,2,Bk,new v(null,1,[Li,fj],null)],0)),Qm(E([Fh,2,Rh,3,zk,We(6,Ye(Fi))],0)),Qm(E([Fh,3,Rh,4,Bk,new v(null,1,[Li,fj],null),Pj,0],0)),Qm(E([Li,Qj,Fh,4],0))],null)],0));var Wm=new v(null,3,[Vj,Tm,fi,Um,Qi,Vm],null);function Xm(){0!=Ym&&da(this);this.Gc=this.Gc;this.nd=this.nd}var Ym=0;Xm.prototype.Gc=!1;function Zm(a,b){Xm.call(this);void 0!==a||(a=$m++ +qa());this.bb=a%2147483646;0>=this.bb&&(this.bb+=2147483646);b&&this.install()}(function(){function a(){}a.prototype=Xm.prototype;Zm.Jd=Xm.prototype;Zm.prototype=new a;Zm.prototype.constructor=Zm;Zm.Wb=function(a,c,d){for(var e=Array(arguments.length-2),f=2;f<arguments.length;f++)e[f-2]=arguments[f];return Xm.prototype[c].apply(a,e)}})();var $m=0,an=1/2147483646;Zm.prototype.bb=1;
Zm.prototype.install=function(){this.fd||(Math.random=pa(this.random,this),this.fd=!0)};Zm.prototype.random=function(){var a=this.bb%44488*48271-3399*Math.floor(this.bb/44488);this.bb=0<a?a:a+2147483647;return(this.bb-1)*an};var bn=function bn(b){if(null!=b&&null!=b.Jc)return b.Jc();var c=bn[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=bn._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("IRandom.-rand",b);};Zm.prototype.Jc=function(){return this.random()};function cn(a){return new Zm(a)};function dn(a,b){return sm(qm(pm(nm(dm(am(lf.c(b,vk,Vc),Ze(function(){return(6*bn(a)|0)+1})))))))}function en(a,b,c){var d=0;for(c=Xl(c);;)if(d<b)d+=1,c=dn(a,c);else return c}function fn(a){return gf.a(V,ef(Me.a(Qa,H),T.a(Ng(pi,$h),qi.b(a))))}function gn(a,b){var c;a:{var d=Uf(b),e=T.a(a,Vf(b));c=Xb(V);d=F(d);for(e=F(e);;)if(d&&e)c=Ae(c,H(d),H(e)),d=J(d),e=J(e);else{c=Zb(c);break a}}return c}
var hn=function hn(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return hn.h(arguments[0],1<c.length?new Fc(c.slice(1),0):null)};hn.h=function(a,b){return gn(function(b){return B.a(a,b)},gn(function(a){return T.a(ce,a)},kh(be,B.a(xe,b))))};hn.v=1;hn.B=function(a){var b=H(a);a=J(a);return hn.h(b,a)};function jn(a){return gn(function(a){return B.c(T,Ef,a)},gn(function(a){return T.a(ce,a)},kh(be,B.a(xe,a))))}
function kn(a){var b=function(){var b=fn(a);return W.b?W.b(b):W.call(null,b)}(),c=W.b?W.b(1):W.call(null,1),d=function(a,b){return function(a,c){return((L.b?L.b(b):L.call(null,b))*a+c)/((L.b?L.b(b):L.call(null,b))+1)}}(b,c);return function(a,b,c,d){return function(l){l=gn(function(a,b,c,d,e){return function(a){return T.a(e,a)}}(a,a,b,c,d),jn(E([L.b?L.b(a):L.call(null,a),fn(l)],0)));Te.a?Te.a(a,l):Te.call(null,a,l);Ue.a(b,Vc);return L.b?L.b(a):L.call(null,a)}}(b,c,d,function(a,b,c){return function(a){return B.c(hn,
c,a)}}(b,c,d))};var ln,mn=function mn(b){if(null!=b&&null!=b.$b)return b.$b();var c=mn[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=mn._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("Channel.close!",b);},nn=function nn(b){if(null!=b&&null!=b.Ac)return!0;var c=nn[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=nn._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("Handler.active?",b);},on=function on(b){if(null!=b&&null!=b.Bc)return b.Fa;var c=on[u(null==b?null:b)];
if(null!=c)return c.b?c.b(b):c.call(null,b);c=on._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("Handler.commit",b);},pn=function pn(b,c){if(null!=b&&null!=b.zc)return b.zc(0,c);var d=pn[u(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=pn._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ua("Buffer.add!*",b);},qn=function qn(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return qn.b(arguments[0]);case 2:return qn.a(arguments[0],
arguments[1]);default:throw Error([z("Invalid arity: "),z(c.length)].join(""));}};qn.b=function(a){return a};qn.a=function(a,b){return pn(a,b)};qn.v=2;function rn(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function sn(a,b,c,d){this.head=a;this.O=b;this.length=c;this.f=d}sn.prototype.pop=function(){if(0===this.length)return null;var a=this.f[this.O];this.f[this.O]=null;this.O=(this.O+1)%this.f.length;--this.length;return a};sn.prototype.unshift=function(a){this.f[this.head]=a;this.head=(this.head+1)%this.f.length;this.length+=1;return null};function tn(a,b){a.length+1===a.f.length&&a.resize();a.unshift(b)}
sn.prototype.resize=function(){var a=Array(2*this.f.length);return this.O<this.head?(rn(this.f,this.O,a,0,this.length),this.O=0,this.head=this.length,this.f=a):this.O>this.head?(rn(this.f,this.O,a,0,this.f.length-this.O),rn(this.f,0,a,this.f.length-this.O,this.head),this.O=0,this.head=this.length,this.f=a):this.O===this.head?(this.head=this.O=0,this.f=a):null};function un(a,b){for(var c=a.length,d=0;;)if(d<c){var e=a.pop();(b.b?b.b(e):b.call(null,e))&&a.unshift(e);d+=1}else break}
function vn(a){return new sn(0,0,0,Array(a))}function wn(a,b){this.K=a;this.n=b;this.g=2;this.C=0}function xn(a){return a.K.length===a.n}wn.prototype.zc=function(a,b){tn(this.K,b);return this};wn.prototype.Z=function(){return this.K.length};var yn;a:{var zn=aa.navigator;if(zn){var An=zn.userAgent;if(An){yn=An;break a}}yn=""};var Bn;
function Cn(){var a=aa.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==yn.indexOf("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=pa(function(a){if(("*"==d||a.origin==
d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&-1==yn.indexOf("Trident")&&-1==yn.indexOf("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.qc;c.qc=null;a()}};return function(a){d.next={qc:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=
document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){aa.setTimeout(a,0)}};var Dn=vn(32),En=!1,Fn=!1;Gn;function Hn(){En=!0;Fn=!1;for(var a=0;;){var b=Dn.pop();if(null!=b&&(b.m?b.m():b.call(null),1024>a)){a+=1;continue}break}En=!1;return 0<Dn.length?Gn.m?Gn.m():Gn.call(null):null}function Gn(){var a=Fn;if(w(w(a)?En:a))return null;Fn=!0;!ca(aa.setImmediate)||aa.Window&&aa.Window.prototype&&aa.Window.prototype.setImmediate==aa.setImmediate?(Bn||(Bn=Cn()),Bn(Hn)):aa.setImmediate(Hn)}function In(a){tn(Dn,a);Gn()}function Jn(a,b){setTimeout(a,b)};var Kn,Ln=function Ln(b){"undefined"===typeof Kn&&(Kn=function(b,d,e){this.Lc=b;this.G=d;this.kd=e;this.g=425984;this.C=0},Kn.prototype.R=function(b,d){return new Kn(this.Lc,this.G,d)},Kn.prototype.P=function(){return this.kd},Kn.prototype.Fb=function(){return this.G},Kn.ec=function(){return new R(null,3,5,S,[Uc(kj,new v(null,1,[Fe,tc(Ge,tc(new R(null,1,5,S,[vj],null)))],null)),vj,xa.Gd],null)},Kn.tb=!0,Kn.Za="cljs.core.async.impl.channels/t_cljs$core$async$impl$channels22071",Kn.Pb=function(b,d){return Tb(d,
"cljs.core.async.impl.channels/t_cljs$core$async$impl$channels22071")});return new Kn(Ln,b,V)};function Mn(a,b){this.Qb=a;this.G=b}function Nn(a){return nn(a.Qb)}var On=function On(b){if(null!=b&&null!=b.yc)return b.yc();var c=On[u(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=On._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ua("MMC.abort",b);};function Pn(a,b,c,d,e,f,g){this.Cb=a;this.dc=b;this.nb=c;this.cc=d;this.K=e;this.closed=f;this.Ja=g}
Pn.prototype.yc=function(){for(;;){var a=this.nb.pop();if(null!=a){var b=a.Qb;In(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(b.Fa,b,a.G,a,this))}break}un(this.nb,Le(!1));return mn(this)};
function Qn(a,b,c){var d=a.closed;if(d)Ln(!d);else if(w(function(){var b=a.K;return w(b)?Sa(xn(a.K)):b}())){for(var e=Xc(a.Ja.a?a.Ja.a(a.K,b):a.Ja.call(null,a.K,b));;){if(0<a.Cb.length&&0<O(a.K)){c=a.Cb.pop();var f=c.Fa,g=a.K.K.pop();In(function(a,b){return function(){return a.b?a.b(b):a.call(null,b)}}(f,g,c,e,d,a))}break}e&&On(a);Ln(!0)}else e=function(){for(;;){var b=a.Cb.pop();if(w(b)){if(w(!0))return b}else return null}}(),w(e)?(c=on(e),In(function(a){return function(){return a.b?a.b(b):a.call(null,
b)}}(c,e,d,a)),Ln(!0)):(64<a.cc?(a.cc=0,un(a.nb,Nn)):a.cc+=1,tn(a.nb,new Mn(c,b)))}
function Rn(a,b){if(null!=a.K&&0<O(a.K)){for(var c=b.Fa,d=Ln(a.K.K.pop());;){if(!w(xn(a.K))){var e=a.nb.pop();if(null!=e){var f=e.Qb,g=e.G;In(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(f.Fa,f,g,e,c,d,a));Xc(a.Ja.a?a.Ja.a(a.K,g):a.Ja.call(null,a.K,g))&&On(a);continue}}break}return d}c=function(){for(;;){var b=a.nb.pop();if(w(b)){if(nn(b.Qb))return b}else return null}}();if(w(c))return d=on(c.Qb),In(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(d,c,a)),Ln(c.G);
if(w(a.closed))return w(a.K)&&(a.Ja.b?a.Ja.b(a.K):a.Ja.call(null,a.K)),w(w(!0)?b.Fa:!0)?(c=function(){var b=a.K;return w(b)?0<O(a.K):b}(),c=w(c)?a.K.K.pop():null,Ln(c)):null;64<a.dc?(a.dc=0,un(a.Cb,nn)):a.dc+=1;tn(a.Cb,b);return null}
Pn.prototype.$b=function(){var a=this;if(!a.closed)for(a.closed=!0,w(function(){var b=a.K;return w(b)?0===a.nb.length:b}())&&(a.Ja.b?a.Ja.b(a.K):a.Ja.call(null,a.K));;){var b=a.Cb.pop();if(null==b)break;else{var c=b.Fa,d=w(function(){var b=a.K;return w(b)?0<O(a.K):b}())?a.K.K.pop():null;In(function(a,b){return function(){return a.b?a.b(b):a.call(null,b)}}(c,d,b,this))}}return null};function Sn(a){console.log(a);return null}
function Tn(a,b){var c=(w(null)?null:Sn).call(null,b);return null==c?a:qn.a(a,c)}
function Un(a){return new Pn(vn(32),0,vn(32),0,a,!1,function(){return function(a){return function(){function c(c,d){try{return a.a?a.a(c,d):a.call(null,c,d)}catch(e){return Tn(c,e)}}function d(c){try{return a.b?a.b(c):a.call(null,c)}catch(d){return Tn(c,d)}}var e=null,e=function(a,b){switch(arguments.length){case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};e.b=d;e.a=c;return e}()}(w(null)?null.b?null.b(qn):null.call(null,qn):qn)}())};var Vn,Wn=function Wn(b){"undefined"===typeof Vn&&(Vn=function(b,d,e){this.nc=b;this.Fa=d;this.jd=e;this.g=393216;this.C=0},Vn.prototype.R=function(b,d){return new Vn(this.nc,this.Fa,d)},Vn.prototype.P=function(){return this.jd},Vn.prototype.Ac=function(){return!0},Vn.prototype.Bc=function(){return this.Fa},Vn.ec=function(){return new R(null,3,5,S,[Uc(rk,new v(null,2,[ei,!0,Fe,tc(Ge,tc(new R(null,1,5,S,[Lk],null)))],null)),Lk,xa.Fd],null)},Vn.tb=!0,Vn.Za="cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers22008",
Vn.Pb=function(b,d){return Tb(d,"cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers22008")});return new Vn(Wn,b,V)};function Xn(a){try{return a[0].call(null,a)}catch(b){throw b instanceof Object&&a[6].$b(),b;}}function Yn(a,b,c){c=Rn(c,Wn(function(c){a[2]=c;a[1]=b;return Xn(a)}));return w(c)?(a[2]=L.b?L.b(c):L.call(null,c),a[1]=b,Ki):null}function Zn(a,b){var c=a[6];null!=b&&Qn(c,b,Wn(function(){return function(){return null}}(c)));c.$b();return c}
function $n(a){for(;;){var b=a[4],c=Mi.b(b),d=Cj.b(b),e=a[5];if(w(function(){var a=e;return w(a)?Sa(b):a}()))throw e;if(w(function(){var a=e;return w(a)?(a=c,w(a)?e instanceof d:a):a}())){a[1]=c;a[2]=e;a[5]=null;a[4]=Q.h(b,Mi,null,E([Cj,null],0));break}if(w(function(){var a=e;return w(a)?Sa(c)&&Sa(oi.b(b)):a}()))a[4]=Ij.b(b);else{if(w(function(){var a=e;return w(a)?(a=Sa(c))?oi.b(b):a:a}())){a[1]=oi.b(b);a[4]=Q.c(b,oi,null);break}if(w(function(){var a=Sa(e);return a?oi.b(b):a}())){a[1]=oi.b(b);a[4]=
Q.c(b,oi,null);break}if(Sa(e)&&Sa(oi.b(b))){a[1]=Nj.b(b);a[4]=Ij.b(b);break}throw Error("No matching clause");}}};function ao(a,b,c){this.key=a;this.G=b;this.forward=c;this.g=2155872256;this.C=0}ao.prototype.U=function(){return fb(fb(Hc,this.G),this.key)};ao.prototype.L=function(a,b,c){return Af(b,Bf,"["," ","]",c,this)};function bo(a,b,c){c=Array(c+1);for(var d=0;;)if(d<c.length)c[d]=null,d+=1;else break;return new ao(a,b,c)}function co(a,b,c,d){for(;;){if(0>c)return a;a:for(;;){var e=a.forward[c];if(w(e))if(e.key<b)a=e;else break a;else break a}null!=d&&(d[c]=a);--c}}
function eo(a,b){this.jb=a;this.level=b;this.g=2155872256;this.C=0}eo.prototype.put=function(a,b){var c=Array(15),d=co(this.jb,a,this.level,c).forward[0];if(null!=d&&d.key===a)return d.G=b;a:for(d=0;;)if(.5>Math.random()&&15>d)d+=1;else break a;if(d>this.level){for(var e=this.level+1;;)if(e<=d+1)c[e]=this.jb,e+=1;else break;this.level=d}for(d=bo(a,b,Array(d));;)return 0<=this.level?(c=c[0].forward,d.forward[0]=c[0],c[0]=d):null};
eo.prototype.remove=function(a){var b=Array(15),c=co(this.jb,a,this.level,b).forward[0];if(null!=c&&c.key===a){for(a=0;;)if(a<=this.level){var d=b[a].forward;d[a]===c&&(d[a]=c.forward[a]);a+=1}else break;for(;;)if(0<this.level&&null==this.jb.forward[this.level])--this.level;else return null}else return null};function fo(a){for(var b=go,c=b.jb,d=b.level;;){if(0>d)return c===b.jb?null:c;var e;a:for(e=c;;){e=e.forward[d];if(null==e){e=null;break a}if(e.key>=a)break a}null!=e?(--d,c=e):--d}}
eo.prototype.U=function(){return function(a){return function c(d){return new ne(null,function(){return function(){return null==d?null:M(new R(null,2,5,S,[d.key,d.G],null),c(d.forward[0]))}}(a),null,null)}}(this)(this.jb.forward[0])};eo.prototype.L=function(a,b,c){return Af(b,function(){return function(a){return Af(b,Bf,""," ","",c,a)}}(this),"{",", ","}",c,this)};var go=new eo(bo(null,null,0),0);
function ho(a){var b=(new Date).valueOf()+a,c=fo(b),d=w(w(c)?c.key<b+10:c)?c.G:null;if(w(d))return d;var e=Un(null);go.put(b,e);Jn(function(a,b,c){return function(){go.remove(c);return mn(a)}}(e,d,b,c),a);return e};function io(){var a=vc.a(1,0)?null:1;return Un("number"===typeof a?new wn(vn(a),a):a)}
(function jo(b){"undefined"===typeof ln&&(ln=function(b,d,e){this.nc=b;this.Fa=d;this.hd=e;this.g=393216;this.C=0},ln.prototype.R=function(b,d){return new ln(this.nc,this.Fa,d)},ln.prototype.P=function(){return this.hd},ln.prototype.Ac=function(){return!0},ln.prototype.Bc=function(){return this.Fa},ln.ec=function(){return new R(null,3,5,S,[Uc(rk,new v(null,2,[ei,!0,Fe,tc(Ge,tc(new R(null,1,5,S,[Lk],null)))],null)),Lk,xa.Ed],null)},ln.tb=!0,ln.Za="cljs.core.async/t_cljs$core$async19240",ln.Pb=function(b,
d){return Tb(d,"cljs.core.async/t_cljs$core$async19240")});return new ln(jo,b,V)})(function(){return null});var ko=W.b?W.b(V):W.call(null,V);function lo(a){return Ue.l(ko,Q,ch("animation"),a)}
function mo(a){var b=1E3/30,c=io();In(function(b,c){return function(){var f=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!le(e,Ki)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,$n(c),d=Ki;else throw f;}if(!le(d,Ki))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.m=c;d.b=b;return d}()}(function(b,c){return function(b){var d=b[1];if(7===d)return d=b,d[2]=b[2],d[1]=4,Ki;if(20===d){var e=b[7],d=b[8],f=H(e),e=P(f,0),f=P(f,1),d=d*a,d=f.b?f.b(d):f.call(null,d);b[9]=e;b[1]=w(d)?22:23;return Ki}if(1===d)return d=ho(0),Yn(b,2,d);if(24===d){var e=b[7],f=b[2],d=J(e),g;b[10]=d;b[11]=null;b[12]=0;b[13]=0;b[14]=f;b[2]=null;b[1]=8;return Ki}if(4===d)return d=b[2],Zn(b,d);if(15===d){d=b[10];
e=b[11];g=b[12];var f=b[13],h=b[2];b[10]=d;b[11]=e;b[12]=g;b[15]=h;b[13]=f+1;b[2]=null;b[1]=8;return Ki}return 21===d?(d=b[2],b[2]=d,b[1]=18,Ki):13===d?(b[2]=null,b[1]=15,Ki):22===d?(b[2]=null,b[1]=24,Ki):6===d?(b[2]=null,b[1]=7,Ki):25===d?(d=b[8],e=b[2],b[8]=d+c,b[16]=e,b[2]=null,b[1]=3,Ki):17===d?(b[2]=null,b[1]=18,Ki):3===d?(d=L.b?L.b(ko):L.call(null,ko),d=F(d),b[1]=d?5:6,Ki):12===d?(d=b[2],b[2]=d,b[1]=9,Ki):2===d?(d=b[2],b[17]=d,b[8]=0,b[2]=null,b[1]=3,Ki):23===d?(e=b[9],d=Ue.c(ko,rd,e),b[2]=
d,b[1]=24,Ki):19===d?(e=b[7],d=ec(e),e=fc(e),f=O(d),b[10]=e,b[11]=d,b[12]=f,b[13]=0,b[2]=null,b[1]=8,Ki):11===d?(d=b[10],d=F(d),b[7]=d,b[1]=d?16:17,Ki):9===d?(d=b[2],e=ho(c),b[18]=d,Yn(b,25,e)):5===d?(d=L.b?L.b(ko):L.call(null,ko),d=F(d),b[10]=d,b[11]=null,b[12]=0,b[13]=0,b[2]=null,b[1]=8,Ki):14===d?(e=b[19],d=Ue.c(ko,rd,e),b[2]=d,b[1]=15,Ki):16===d?(e=b[7],d=Bd(e),b[1]=d?19:20,Ki):10===d?(e=b[11],d=b[8],f=b[13],f=hb.a(e,f),e=P(f,0),f=P(f,1),d*=a,d=f.b?f.b(d):f.call(null,d),b[19]=e,b[1]=w(d)?13:14,
Ki):18===d?(d=b[2],b[2]=d,b[1]=12,Ki):8===d?(g=b[12],f=b[13],d=f<g,b[1]=w(d)?10:11,Ki):null}}(b,c),b,c)}(),g=function(){var a=f.m?f.m():f.call(null);a[6]=b;return a}();return Xn(g)}}(c,b));return c}function no(a){return a*a}function oo(a){return.5>a?2*a*a:a*(4-2*a)-1}
function po(a,b,c){var d=null!=c&&(c.g&64||c.F)?B.a(Sc,c):c,e=C.c(d,wk,0),f=C.a(d,Ni),g=C.c(d,Ii,Od);return function(c,d,e,f,g){return function(c){if(c<=e)return!0;if(c<e+f)return c=(c-e)/f,c=g.b?g.b(c):g.call(null,c),b.a?b.a(a,c):b.call(null,a,c),!0;b.a?b.a(a,1):b.call(null,a,1);return!1}}(c,d,e,f,g)}function qo(a,b){return function(c){return lo(po(c,a,b))}}
function ro(a,b,c){return function(d){var e=function(c){return function(e,h){var l,m=a.getPointAtLength(h*c);l=Fm.b?Fm.b(m):Fm.call(null,m);m=P(l,0);l=P(l,1);m=new R(null,2,5,S,[m,l],null);return b.a?b.a(d,m):b.call(null,d,m)}}(a.getTotalLength());return lo(po(d,e,c))}};function so(a){var b=P(a,0);a=P(a,1);return[z(b),z(","),z(a)].join("")}function to(a,b,c){var d=P(a,0);P(a,1);a=P(b,0);var e=P(b,1);b=P(c,0);c=P(c,1);var d=d-a,f=(e-c)/2*(d/Math.abs(d)),g=f/2,d=new R(null,2,5,S,[a+f,e],null);a=new R(null,2,5,S,[a-g,e],null);e=new R(null,2,5,S,[b-g,c],null);b=new R(null,2,5,S,[b+f,c],null);return[z("L"),z(so(d)),z("C"),z(so(a)),z(","),z(so(e)),z(","),z(so(b))].join("")}function uo(a){return F(a)?B.c(z,"M",bf(T.a(so,a))):null}
function vo(a,b){return[z("translate("),z(a),z(","),z(b),z(")")].join("")}
function wo(a){var b=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a,c=C.a(b,zi),d=C.a(b,Dk),e=C.a(b,bk),f=C.a(b,Bh),g=C.a(b,ti),h=c/2;return new R(null,4,5,S,[mj,new v(null,1,[Qh,vo(h,h)],null),new R(null,2,5,S,[uk,new v(null,5,[Aj,"die",bk,-h,Bh,-h,zi,c,Dk,c],null)],null),function(){return function(a,b,c,d,e,f,g,h,A){return function I(K){return new ne(null,function(a,b,c,d,e){return function(){for(;;){var b=F(K);if(b){if(Bd(b)){var c=ec(b),d=O(c),f=re(d);a:for(var g=0;;)if(g<d){var h=hb.a(c,g),l=P(h,0),h=P(h,
1),l=new R(null,2,5,S,[vi,new v(null,3,[yj,a.b?a.b(l):a.call(null,l),Bj,a.b?a.b(h):a.call(null,h),Jh,e/10],null)],null);f.add(l);g+=1}else{c=!0;break a}return c?se(f.W(),I(fc(b))):se(f.W(),null)}c=H(b);f=P(c,0);c=P(c,1);return M(new R(null,2,5,S,[vi,new v(null,3,[yj,a.b?a.b(f):a.call(null,f),Bj,a.b?a.b(c):a.call(null,c),Jh,e/10],null)],null),I(Gc(b)))}return null}}}(a,b,c,d,e,f,g,h,A),null,null)}}(Ne(Sd,c/4),h,a,b,c,d,e,f,g)(Em(g))}()],null)}
function xo(a,b){for(var c=a-10,d=md,e=!0,f=b-10;;)if(0<f)d=xe.a(d,e?new R(null,2,5,S,[new R(null,2,5,S,[c,f],null),new R(null,2,5,S,[10,f],null)],null):new R(null,2,5,S,[new R(null,2,5,S,[10,f],null),new R(null,2,5,S,[c,f],null)],null)),e=!e,f-=20;else{c=S;a:for(e=P(d,0),f=$d(d,1),d=[z("M"),z(so(e))].join(""),P(f,0),P(f,1),$d(f,2);;){var g=f,h=P(g,0),f=P(g,1),g=$d(g,2),l;l=h;w(l)&&(l=f,l=w(l)?F(g):l);if(w(l))d=[z(d),z(to(e,h,f))].join(""),e=f,f=g;else{d=w(h)?[z(d),z("L"),z(so(h))].join(""):d;break a}}return new R(null,
2,5,c,[Dh,new v(null,2,[Aj,"penny-path",Xj,d],null)],null)}}function yo(a,b,c){a=a.getPointAtLength(c*b+20);return Fm.b?Fm.b(a):Fm.call(null,a)}function zo(a,b,c){var d=P(a,0);a=P(a,1);return new R(null,4,5,S,[mj,new v(null,2,[Qh,vo(d,a),Oj,w(c)?new Nm(c):null],null),new R(null,2,5,S,[vi,new v(null,2,[Aj,"penny fill",Jh,8],null)],null),vc.a(b,yi)?new R(null,2,5,S,[vi,new v(null,2,[Aj,"tracer",Jh,4],null)],null):null],null)}
function Ao(a,b,c){var d=null!=c&&(c.g&64||c.F)?B.a(Sc,c):c,e=C.a(d,zk),f=C.a(d,Ek),g=C.a(d,Wh),h=C.a(d,ai);return fb(fb(Hc,function(){var a=d.b?d.b(Dh):d.call(null,Dh);return w(a)?fb(fb(Hc,ie(Pe(function(a,b,c,d,e,f,g,h,l){return function(I,K){var N=function(a,b,c,d,e,f,g){return function(b){return yo(a,b,g)}}(a,b,c,d,e,f,g,h,l);return zo(N(I),K,0<h?qo(function(a,b,c,d,e,f,g,h,l){return function(b,c){var d;d=I-c*l;d=-1>d?-1:d;var e=a(d),f=P(e,0),e=P(e,1);b.setAttribute("transform",vo(f,e));return vc.a(-1,
d)?b.setAttribute("transform","scale(0)"):null}}(N,a,b,c,d,e,f,g,h,l),new v(null,1,[Ni,(L.b?L.b(tm):L.call(null,tm)).call(null,rj)],null)):null)}}(a,a,c,d,d,e,f,g,h),e))),ie(Pe(function(){return function(a,b,c,d,e,f,g,h,l,I){return function(K,N){var Aa=yo(b,a+K,h),G=P(Aa,0),ka=P(Aa,1);return zo(new R(null,2,5,S,[G,I],null),N,qo(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){return function(a,c){return a.setAttribute("transform",vo(b,r+c*d))}}(Aa,G,ka,ka-I,a,b,c,d,e,f,g,h,l,I),new v(null,3,[Ni,(L.b?L.b(tm):
L.call(null,tm)).call(null,xi),wk,50*K,Ii,no],null)))}}(O(e),a,a,c,d,d,e,f,g,h)}(),d.b?d.b(ej):d.call(null,ej)))):null}()),xo(a,b))}
function Bo(a,b,c,d){var e=b-20,f=S;a=new v(null,2,[Aj,"spout",Qh,vo(0,a)],null);var g=S,e=[z(uo(new R(null,6,5,S,[new R(null,2,5,S,[b,-20],null),new R(null,2,5,S,[b,23],null),new R(null,2,5,S,[0,23],null),new R(null,2,5,S,[0,3],null),new R(null,2,5,S,[e,3],null),new R(null,2,5,S,[e,-20],null)],null))),z("Z")].join("");return new R(null,4,5,f,[mj,a,new R(null,2,5,g,[Dh,new v(null,1,[Xj,e],null)],null),w(d)?new R(null,3,5,S,[Ik,new v(null,3,[Aj,"infotext fill",Qh,vo(b/2,23),Ei,-5],null),c],null):null],
null)}if("undefined"===typeof Co)var Co=function(){var a=W.b?W.b(V):W.call(null,V),b=W.b?W.b(V):W.call(null,V),c=W.b?W.b(V):W.call(null,V),d=W.b?W.b(V):W.call(null,V),e=C.c(V,ok,mh());return new xh(Dc.a("pennygame.ui","station"),function(){return function(a){return Li.b(a)}}(a,b,c,d,e),ni,e,a,b,c,d)}();zh(Co,Ai,function(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a,d=C.a(c,zi);C.a(c,Lj);var e=C.a(c,ai),c=C.c(c,xk,V),c=c.a?c.a(Dj,0):c.call(null,Dj,0);return Bo(10+e,d,0===c?"In":c,b)});
zh(Co,Yh,function(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a,d=C.a(c,zi),e=C.a(c,Lj),f=Hc,g;g=c.b?c.b(ai):c.call(null,ai);g=Bo(g,d,"",b);c=fb(fb(fb(f,g),Ao(d,e,new v(null,6,[zk,c.b?c.b(zk):c.call(null,zk),Ek,c.b?c.b(Eh):c.call(null,Eh),Wh,w(c.b?c.b(Ri):c.call(null,Ri))?c.b?c.b(ci):c.call(null,ci):0,ej,w(c.b?c.b(Zj):c.call(null,Zj))?c.b?c.b(Ak):c.call(null,Ak):null,Dh,Om(c.b?c.b(zj):c.call(null,zj)),ai,c.b?c.b(Ci):c.call(null,Ci)],null))),new R(null,2,5,S,[uk,new v(null,3,[Aj,"bin",zi,d,Dk,e],null)],
null));a:for(f=md,g=!0,e-=20;;)if(0<e)f=ld.a(f,new R(null,2,5,S,[tj,new v(null,4,[Aj,"shelf",Qh,vo(0,e),dk,g?20:0,yk,g?d:d-20],null)],null)),g=!g,e-=20;else{d=new R(null,3,5,S,[mj,V,B.a(tc,f)],null);break a}return fb(c,d)});
zh(Co,Qj,function(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a,d=C.a(c,zi),e=C.a(c,zj),f=C.a(c,Lj),g=C.a(c,Ci),h=C.c(c,xk,V),l=C.a(c,Ak),m=C.a(c,Zj),n=1/265*f*967;return fb(fb(fb(fb(Hc,w(b)?function(){var a=h.a?h.a(Hi,0):h.call(null,Hi,0),b=h.a?h.a(Ji,0):h.call(null,Ji,0);return new R(null,4,5,S,[mj,V,new R(null,3,5,S,[Ik,new v(null,3,[Aj,"infotext fill",Ei,24,Ch,"start"],null),0===b?"Days":b],null),new R(null,3,5,S,[Ik,new v(null,4,[Aj,"infotext fill",Uh,d,Ei,24,Ch,"end"],null),0===a?"Out":a],null)],
null)}():null),new R(null,2,5,S,[Wj,new v(null,4,[Gj,truckSrc,bk,d/2+n/2,zi,n,Dk,f],null)],null)),new R(null,2,5,S,[Dh,new v(null,2,[Aj,"ramp",Xj,[z("M"),z(so(new R(null,2,5,S,[10,g],null))),z("C"),z(so(new R(null,2,5,S,[10,f/2],null))),z(","),z(so(new R(null,2,5,S,[10,f/2],null))),z(","),z(so(new R(null,2,5,S,[d/2+n,f/2],null)))].join("")],null)],null)),function(){var b=Pm(e);return w(w(b)?m:b)?Pe(function(a,b,c,d,e,f,g,h,l,m,n){return function(q,na){return zo(new R(null,2,5,S,[10,h],null),na,ro(a,
function(){return function(a,b){var c=P(b,0),d=P(b,1);return a.setAttribute("transform",vo(c,d))}}(a,b,c,d,e,f,g,h,l,m,n),new v(null,3,[Ni,(L.b?L.b(tm):L.call(null,tm)).call(null,xi),wk,50*q,Ii,no],null)))}}(b,n,a,c,d,e,f,g,h,l,m),l):null}())});
function Do(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a,d=C.a(c,pi),e=C.a(c,zi),f=C.a(c,Dk),g=C.a(c,bk),h=C.a(c,bi),l=C.a(c,$h),m=F(l)?null==l?null:zb(l):null;return w(w(g)?d:g)?new R(null,4,5,S,[mj,new v(null,2,[Aj,[z("scenario "),z(ae(d))].join(""),Qh,vo(g,0)],null),function(){return function(a,c,d,e,f,g,h,l,m){return function N(Aa){return new ne(null,function(a,c,d,e,f,g,h,l,m){return function(){for(;;){var c=F(Aa);if(c){if(Bd(c)){var d=ec(c),e=O(d),f=re(e);return function(){for(var c=0;;)if(c<
e){var g=hb.a(d,c),h=null!=g&&(g.g&64||g.F)?B.a(Sc,g):g,g=h,l=C.a(h,Bk),l=null!=l&&(l.g&64||l.F)?B.a(Sc,l):l,n=C.a(l,Li),p=C.a(h,zj),q=C.a(h,Bh),r=C.a(h,ik),h=f,l=S,n=new v(null,3,[zj,p,Aj,[z(ae(n)),z(" productivity-"),z(ae(n)),z(" "),z(w(r)?"bottleneck":null)].join(""),Qh,vo(0,q)],null);F(m)&&(g=Q.c(g,xk,a));g=Co.a?Co.a(g,b):Co.call(null,g,b);h.add(new R(null,3,5,l,[mj,n,g],null));c+=1}else return!0}()?se(f.W(),N(fc(c))):se(f.W(),null)}var g=H(c),h=g=null!=g&&(g.g&64||g.F)?B.a(Sc,g):g,l=C.a(g,Bk),
l=null!=l&&(l.g&64||l.F)?B.a(Sc,l):l,l=C.a(l,Li),n=C.a(g,zj),p=C.a(g,Bh),g=C.a(g,ik);return M(new R(null,3,5,S,[mj,new v(null,3,[zj,n,Aj,[z(ae(l)),z(" productivity-"),z(ae(l)),z(" "),z(w(g)?"bottleneck":null)].join(""),Qh,vo(0,p)],null),F(m)?function(){var c=Q.c(h,xk,a);return Co.a?Co.a(c,b):Co.call(null,c,b)}():Co.a?Co.a(h,b):Co.call(null,h,b)],null),N(Gc(c)))}return null}}}(a,c,d,e,f,g,h,l,m),null,null)}}(m,a,c,d,e,f,g,h,l)(ie(h))}(),w(b)?function(){var a=Vi.a(m,0);return new R(null,3,5,S,[Ik,new v(null,
5,[Aj,"infotext fill",bk,e/2,Bh,f/2,Ei,26,Ch,"middle"],null),0===a?"WIP":a],null)}():null],null):null}
function Eo(a,b,c){if(F(a)){var d=Km(T.a(function(a){a=kd(Kk.b(a));a=b.b?b.b(a):b.call(null,a);return jd(a)},a));return function(a){return function g(d){return new ne(null,function(){return function(){for(var a=d;;)if(a=F(a)){if(Bd(a)){var e=ec(a),n=O(e),q=re(n);return function(){for(var a=0;;)if(a<n){var d=hb.a(e,a),g=P(d,0),g=null!=g&&(g.g&64||g.F)?B.a(Sc,g):g,h=C.a(g,Kk),d=P(d,1),g=function(){var a=kd(h);return b.b?b.b(a):b.call(null,a)}(),g=P(g,0);w(g)&&te(q,new R(null,3,5,S,[Ik,new v(null,3,
[Aj,[z("label "),z("history")].join(""),Qh,vo(g,d),Ei,7],null),function(){var a=jd(kd(h));return c.b?c.b(a):c.call(null,a)}()],null));a+=1}else return!0}()?se(q.W(),g(fc(a))):se(q.W(),null)}var p=H(a),r=P(p,0),r=null!=r&&(r.g&64||r.F)?B.a(Sc,r):r,t=C.a(r,Kk),p=P(p,1),r=function(){var a=kd(t);return b.b?b.b(a):b.call(null,a)}(),r=P(r,0);if(w(r))return M(new R(null,3,5,S,[Ik,new v(null,3,[Aj,[z("label "),z("history")].join(""),Qh,vo(r,p),Ei,7],null),function(){var a=jd(kd(t));return c.b?c.b(a):c.call(null,
a)}()],null),g(Gc(a)));a=Gc(a)}else return null}}(a),null,null)}}(d)(T.c(Ef,a,d))}return null}
function Fo(a,b,c){var d=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a,e=C.a(d,zi),f=C.a(d,Dk),g=C.a(d,bk),h=C.a(d,Bh),l=null!=c&&(c.g&64||c.F)?B.a(Sc,c):c,m=C.a(l,$i),n=C.a(l,Ck),q=C.a(l,aj),p=C.c(l,ri,Od),r=f-60,t=function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t){return function Da(A){return new ne(null,function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t){return function(){for(;;){var y=F(A);if(y){var D=y;if(Bd(D)){var K=ec(D),N=O(K),I=re(N);return function(){for(var A=0;;)if(A<N){var G=hb.a(K,A),U=P(G,0),X=P(G,
1);te(I,new v(null,2,[qk,U,Kk,Pe(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D,K,N,I){return function(a,b){return new R(null,2,5,S,[a,I.b?I.b(b):I.call(null,b)],null)}}(A,G,U,X,K,N,I,D,y,a,b,c,d,e,f,g,h,l,m,n,p,q,r,t),X)],null));A+=1}else return!0}()?se(I.W(),Da(fc(D))):se(I.W(),null)}var G=H(D),U=P(G,0),X=P(G,1);return M(new v(null,2,[qk,U,Kk,Pe(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y){return function(a,b){return new R(null,2,5,S,[a,y.b?y.b(b):y.call(null,b)],null)}}(G,U,X,D,y,a,b,c,d,e,f,g,h,
l,m,n,p,q,r,t),X)],null),Da(Gc(D)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t),null,null)}}(30,50,r,a,d,e,f,g,h,c,l,m,n,q,p)(b)}(),y=Mm(T.a(Kk,t),new v(null,2,[zi,e-100,Dk,r],null),new v(null,2,[gk,md,Ck,n],null)),A=P(y,0),D=P(y,1),I=function(a,b,c,d,e,f,g){return function(a){return new R(null,2,5,S,[function(){var b=H(a);return f.b?f.b(b):f.call(null,b)}(),function(){var b=jd(a);return g.b?g.b(b):g.call(null,b)}()],null)}}(30,50,r,t,y,A,D,a,d,e,f,g,h,c,l,m,n,q,p);return new R(null,5,5,S,[mj,new v(null,
2,[Aj,"graph",Qh,vo(g,h)],null),new R(null,2,5,S,[uk,new v(null,2,[zi,e,Dk,f],null)],null),new R(null,3,5,S,[Ik,new v(null,4,[Aj,"title",bk,e/2,Bh,f/2,Ei,10],null),q],null),new R(null,7,5,S,[mj,new v(null,1,[Qh,vo(50,30)],null),function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D,I,Va){return function jb(Db){return new ne(null,function(a,b,c,d,e,f,g,h){return function(){for(;;){var a=F(Db);if(a){if(Bd(a)){var b=ec(a),c=O(b),d=re(c);a:for(var e=0;;)if(e<c){var f=hb.a(b,e),f=null!=f&&(f.g&
64||f.F)?B.a(Sc,f):f;C.a(f,qk);f=C.a(f,Kk);f=new R(null,2,5,S,[Dh,new v(null,2,[Aj,"stroke outline",Xj,uo(T.a(h,f))],null)],null);d.add(f);e+=1}else{b=!0;break a}return b?se(d.W(),jb(fc(a))):se(d.W(),null)}d=H(a);d=null!=d&&(d.g&64||d.F)?B.a(Sc,d):d;C.a(d,qk);d=C.a(d,Kk);return M(new R(null,2,5,S,[Dh,new v(null,2,[Aj,"stroke outline",Xj,uo(T.a(h,d))],null)],null),jb(Gc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D,I,Va),null,null)}}(30,50,r,t,y,A,D,I,a,d,e,f,g,h,c,l,m,n,q,p)(t)}(),function(){return function(a,
b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D,I,Va){return function jb(Db){return new ne(null,function(a,b,c,d,e,f,g,h){return function(){for(;;){var a=F(Db);if(a){if(Bd(a)){var b=ec(a),c=O(b),d=re(c);a:for(var e=0;;)if(e<c){var f=hb.a(b,e),g=null!=f&&(f.g&64||f.F)?B.a(Sc,f):f,f=C.a(g,qk),g=C.a(g,Kk),f=new R(null,2,5,S,[Dh,new v(null,2,[Aj,[z("history stroke "),z(ae(f))].join(""),Xj,uo(T.a(h,g))],null)],null);d.add(f);e+=1}else{b=!0;break a}return b?se(d.W(),jb(fc(a))):se(d.W(),null)}d=H(a);b=null!=d&&(d.g&64||
d.F)?B.a(Sc,d):d;d=C.a(b,qk);b=C.a(b,Kk);return M(new R(null,2,5,S,[Dh,new v(null,2,[Aj,[z("history stroke "),z(ae(d))].join(""),Xj,uo(T.a(h,b))],null)],null),jb(Gc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r,t,A,y,D,I,Va),null,null)}}(30,50,r,t,y,A,D,I,a,d,e,f,g,h,c,l,m,n,q,p)(t)}(),Eo(t,I,p),new R(null,2,5,S,[tj,new v(null,3,[Aj,"axis",Qh,vo(0,r),yk,e-100],null)],null),new R(null,2,5,S,[tj,new v(null,2,[Aj,"axis",lk,r],null)],null)],null)],null)}
function Go(a,b){var c=Gm(a),d=P(c,0),e=P(c,1),f=P(c,2),c=P(c,3);return new R(null,6,5,S,[mj,new v(null,1,[zj,"graphs"],null),Fo(d,b,new v(null,3,[aj,"Total Input",$i,Dj,ri,Math.round],null)),Fo(e,b,new v(null,3,[aj,"Total Output",$i,Hi,ri,Math.round],null)),Fo(f,b,new v(null,4,[aj,"Work in Progress",$i,Vi,Ck,new R(null,1,5,S,[0],null),ri,Math.round],null)),Fo(c,b,new v(null,3,[aj,"Days to Delivery",$i,Ji,ri,Math.round],null))],null)}
function Ho(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a,d=C.a(c,gj),e=null!=d&&(d.g&64||d.F)?B.a(Sc,d):d,f=C.a(e,vk),g=C.a(e,Wi),h=C.a(c,oj),l=C.a(c,gi),m=C.a(c,Xh);return new R(null,4,5,S,[ij,new v(null,1,[zj,"controls"],null),new R(null,9,5,S,[ui,new v(null,1,[Yi,"slidden"],null),new R(null,3,5,S,[ji,new v(null,1,[Di,function(){return function(){return b.c?b.c(Mh,1,!0):b.call(null,Mh,1,!0)}}(a,c,d,e,f,g,h,l,m)],null),"Roll"],null),new R(null,3,5,S,[ji,new v(null,1,[Di,function(){return function(){return b.c?
b.c(Mh,200,!0):b.call(null,Mh,200,!0)}}(a,c,d,e,f,g,h,l,m)],null),"Run"],null),new R(null,3,5,S,[ji,new v(null,1,[Di,function(){return function(){return b.c?b.c(Mh,200,!1):b.call(null,Mh,200,!1)}}(a,c,d,e,f,g,h,l,m)],null),"Run Fast"],null),new R(null,3,5,S,[ji,new v(null,1,[Di,function(){return function(){return b.a?b.a(Oi,200):b.call(null,Oi,200)}}(a,c,d,e,f,g,h,l,m)],null),"Run Instantly"],null),new R(null,3,5,S,[ji,new v(null,1,[Di,function(a,c,d,e,f,g,h){return function(){var a=Sa(h);return b.a?
b.a(Kj,a):b.call(null,Kj,a)}}(a,c,d,e,f,g,h,l,m)],null),w(h)?"Hide info":"Show info"],null),new R(null,3,5,S,[ji,new v(null,1,[Di,function(a,c,d,e,f,g,h,l){return function(){var a=Sa(l);return b.a?b.a(Uj,a):b.call(null,Uj,a)}}(a,c,d,e,f,g,h,l,m)],null),w(l)?"Hide graphs":"Show graphs"],null),w(l)?new R(null,3,5,S,[ji,new v(null,2,[di,function(){var a=0===f;return a?a:m}(),Di,function(a,c,d,e,f,g){return function(){var a=Sa(g);return b.a?b.a(Wi,a):b.call(null,Wi,a)}}(a,c,d,e,f,g,h,l,m)],null),w(g)?
"Hide averages":"Average"],null):null],null),new R(null,8,5,S,[ui,new v(null,1,[Yi,"slidden"],null),new R(null,3,5,S,[ji,new v(null,1,[Di,function(){return function(){return b.c?b.c(Hj,Vj,0):b.call(null,Hj,Vj,0)}}(a,c,d,e,f,g,h,l,m)],null),"Basic"],null),new R(null,3,5,S,[ji,new v(null,1,[Di,function(){return function(){return b.c?b.c(Hj,fi,1):b.call(null,Hj,fi,1)}}(a,c,d,e,f,g,h,l,m)],null),"Efficient"],null),new R(null,3,5,S,[ji,new v(null,1,[Di,function(){return function(){return b.c?b.c(Hj,Qi,
2):b.call(null,Hj,Qi,2)}}(a,c,d,e,f,g,h,l,m)],null),"Constrained"],null),new R(null,2,5,S,[Kh,V],null),new R(null,3,5,S,[ji,new v(null,1,[Di,function(){return function(){return b.b?b.b(ii):b.call(null,ii)}}(a,c,d,e,f,g,h,l,m)],null),"Reset"],null),new R(null,3,5,S,[ji,new v(null,1,[Di,function(){return function(){return b.b?b.b(Nh):b.call(null,Nh)}}(a,c,d,e,f,g,h,l,m)],null),"Generate New"],null)],null)],null)}
function Io(){var a=L.b?L.b($g):L.call(null,$g),b=Z,c=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a,d=C.a(c,gj),e=null!=d&&(d.g&64||d.F)?B.a(Sc,d):d,f=C.a(e,zi),g=C.a(e,Dk),h=C.a(e,vk),l=C.a(e,kk),m=C.a(e,qi),n=C.a(e,Wi),q=C.a(c,oj),p=C.a(c,gi);return new R(null,5,5,S,[nk,V,new R(null,3,5,S,[ij,new v(null,1,[hj,new v(null,3,[Tj,jk,Fk,"5px",ki,"5px"],null)],null),new R(null,4,5,S,[ij,new v(null,1,[zj,"days"],null),new R(null,3,5,S,[Jk,V,h],null)," days"],null)],null),Ho(c,b),new R(null,6,5,S,[Jj,new v(null,3,
[zj,"space",zi,"100%",Dk,"99%"],null),new R(null,3,5,S,[Ej,V,new R(null,6,5,S,[Gk,new v(null,6,[zj,"caution",bk,0,Bh,0,zi,30,Dk,30,Sh,"userSpaceOnUse"],null),new R(null,2,5,S,[uk,new v(null,3,[zi,30,Dk,30,si,"#777"],null)],null),new R(null,2,5,S,[tj,new v(null,6,[dk,-10,wi,10,yk,10,lk,-10,Lh,"yellow",uj,10],null)],null),new R(null,2,5,S,[tj,new v(null,6,[dk,0,wi,30,yk,30,lk,0,Lh,"yellow",uj,10],null)],null),new R(null,2,5,S,[tj,new v(null,6,[dk,20,wi,40,yk,40,lk,20,Lh,"yellow",uj,10],null)],null)],
null)],null),function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q,X){return function ia(ja){return new ne(null,function(){return function(){for(;;){var a=F(ja);if(a){if(Bd(a)){var b=ec(a),c=O(b),d=re(c);a:for(var e=0;;)if(e<c){var f=hb.a(b,e),g=null!=f&&(f.g&64||f.F)?B.a(Sc,f):f,f=g,h=C.a(g,bk),g=C.a(g,Bh),f=w(h)?new R(null,3,5,S,[mj,new v(null,1,[Qh,vo(h,g)],null),wo(f)],null):null;d.add(f);e+=1}else{b=!0;break a}return b?se(d.W(),ia(fc(a))):se(d.W(),null)}d=H(a);d=c=null!=d&&(d.g&64||d.F)?B.a(Sc,
d):d;b=C.a(c,bk);c=C.a(c,Bh);return M(w(b)?new R(null,3,5,S,[mj,new v(null,1,[Qh,vo(b,c)],null),wo(d)],null):null,ia(Gc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,X),null,null)}}(a,c,c,d,e,e,f,g,h,l,m,n,q,p)(l)}(),T.a(function(a,b,c,d,e,f,g,h,l,m,n,p,q){return function(a){return Do(a,q)}}(a,c,c,d,e,e,f,g,h,l,m,n,q,p),m),w(w(f)?w(g)?p:g:f)?Go(new R(null,2,5,S,[f,g],null),w(n)?n:fn(e)):null],null)],null)};Fa=!1;Ba=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new Fc(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,Oa.b?Oa.b(a):Oa.call(null,a))}a.v=0;a.B=function(a){a=F(a);return b(a)};a.h=b;return a}();
Ea=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new Fc(e,0)}return b.call(this,d)}function b(a){return console.error.apply(console,Oa.b?Oa.b(a):Oa.call(null,a))}a.v=0;a.B=function(a){a=F(a);return b(a)};a.h=b;return a}();
function Jo(a){var b="undefined"!==typeof document.hidden?"visibilitychange":"undefined"!==typeof document.webkitHidden?"webkitvisibilitychange":"undefined"!==typeof document.mozHidden?"mozvisibilitychange":"undefined"!==typeof document.msHidden?"msvisibilitychange":null;return document.addEventListener(b,function(b){return function e(){a.m?a.m():a.call(null);return document.removeEventListener(b,e)}}(b))}
function Ko(a,b){var c=null!=b&&(b.g&64||b.F)?B.a(Sc,b):b,d=C.a(c,zi),e=C.a(c,bk),f=Xe(1,bi.b(H(df(pi,qi.b(a))))),g=T.a(Dk,f),h=T.a(Bh,f);return lf.A(a,kk,Ne(T,function(a,b,c,d,e,f,g){return function(a,b,c){return Q.h(a,bk,g,E([Bh,b+c+(0-f/2-20),zi,f,Dk,f],0))}}(f,g,h,b,c,d,e)),h,g)}
if("undefined"===typeof $g){var $g,Lo,Mo;var No=location.hash,Oo=/#/;if("string"===typeof Oo)Mo=No.replace(new RegExp(String(Oo).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08"),"g"),"");else if(Oo instanceof RegExp)Mo=No.replace(new RegExp(Oo.source,"g"),"");else throw[z("Invalid match arg: "),z(Oo)].join("");var Po=Mo;Lo=w(/^[\s\xa0]*$/.test(null==Po?"":String(Po)))?null:parseInt(Mo);var Qo=w(Lo)?Lo:jh();location.hash=Qo;var Ro=new v(null,3,[qi,new R(null,3,5,S,[null,null,
null],null),Xi,Qo,Ah,cn(Qo)],null);$g=W.b?W.b(Ro):W.call(null,Ro)}
if("undefined"===typeof Z)var Z=function(){var a=W.b?W.b(V):W.call(null,V),b=W.b?W.b(V):W.call(null,V),c=W.b?W.b(V):W.call(null,V),d=W.b?W.b(V):W.call(null,V),e=C.c(V,ok,mh());return new xh(Dc.a("pennygame.core","emit"),function(){return function(){function a(b,c){if(1<arguments.length)for(var d=0,e=Array(arguments.length-1);d<e.length;)e[d]=arguments[d+1],++d;return b}a.v=1;a.B=function(a){var b=H(a);Gc(a);return b};a.h=function(a){return a};return a}()}(a,b,c,d,e),ni,e,a,b,c,d)}();
function So(a){var b=new R(null,2,5,S,[1,10],null),c=new R(null,2,5,S,[.05,.95],null),d=P(b,0),b=P(b,1),e=P(c,0),f=P(c,1),c=b-d;return w(Ud.a?Ud.a(e,a):Ud.call(null,e,a))?d:w(function(){var b=e+.05;return Ud.a?Ud.a(b,a):Ud.call(null,b,a)}())?d+c*oo((a-e)/.05):w(Ud.a?Ud.a(f,a):Ud.call(null,f,a))?b:w(function(){var b=f+.05;return Ud.a?Ud.a(b,a):Ud.call(null,b,a)}())?b-c*oo((a-f)/.05):d}
function To(a,b,c){var d=(b-a)/b,e=So(d),f=w(c)?10>e:c,g=io();In(function(d,e,f,g,q){return function(){var p=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!le(e,Ki)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,$n(c),d=Ki;else throw f;}if(!le(d,Ki))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.m=c;d.b=b;return d}()}(function(d,e,f,g,h){return function(d){var e=d[1];if(7===e)return d[2]=null,d[1]=8,Ki;if(1===e){var e=Z.b?Z.b(Sj):Z.call(null,Sj),f=Z.b?Z.b(Gh):Z.call(null,Gh);d[7]=e;d[8]=f;d[1]=w(h)?2:3;return Ki}if(4===e){var e=d[2],f=Z.b?Z.b(Rj):Z.call(null,Rj),l=Z.b?Z.b(pj):Z.call(null,pj),m=Z.b?Z.b(qj):Z.call(null,qj);d[9]=m;d[10]=f;d[11]=l;d[12]=e;d[1]=w(h)?6:7;return Ki}return 15===e?(e=Z.a?Z.a(bj,!1):Z.call(null,
bj,!1),d[2]=e,d[1]=16,Ki):13===e?(e=d[2],d[2]=e,d[1]=12,Ki):6===e?(e=Z.a?Z.a(ej,!0):Z.call(null,ej,!0),f=mo(g),d[13]=e,Yn(d,9,f)):3===e?(d[2]=null,d[1]=4,Ki):12===e?(e=d[14],e=a-1,d[15]=d[2],d[14]=e,d[1]=w(0<e)?14:15,Ki):2===e?(e=Z.a?Z.a(Wh,!0):Z.call(null,Wh,!0),f=mo(g),d[16]=e,Yn(d,5,f)):11===e?(e=L.b?L.b(tm):L.call(null,tm),e=e.b?e.b(vk):e.call(null,vk),e=ho(e),Yn(d,13,e)):9===e?(f=d[2],e=Z.a?Z.a(ej,!1):Z.call(null,ej,!1),d[17]=f,d[2]=e,d[1]=8,Ki):5===e?(f=d[2],e=Z.a?Z.a(Wh,!1):Z.call(null,Wh,
!1),d[18]=f,d[2]=e,d[1]=4,Ki):14===e?(e=d[14],e=Z.l?Z.l(ck,e,b,c):Z.call(null,ck,e,b,c),d[2]=e,d[1]=16,Ki):16===e?(e=d[2],Zn(d,e)):10===e?(d[2]=null,d[1]=12,Ki):8===e?(e=d[2],f=Z.b?Z.b(tk):Z.call(null,tk),l=Z.b?Z.b(nj):Z.call(null,nj),d[19]=e,d[20]=f,d[21]=l,d[1]=w(h)?10:11,Ki):null}}(d,e,f,g,q),d,e,f,g,q)}(),r=function(){var a=p.m?p.m():p.call(null);a[6]=d;return a}();return Xn(r)}}(g,d,10,e,f))}
var Uo=function Uo(){var b=io();In(function(b){return function(){var d=function(){return function(b){return function(){function c(d){for(;;){var e;a:try{for(;;){var g=b(d);if(!le(g,Ki)){e=g;break a}}}catch(h){if(h instanceof Object)d[5]=h,$n(d),e=Ki;else throw h;}if(!le(e,Ki))return e}}function d(){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];b[0]=e;b[1]=1;return b}var e=null,e=function(b){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,
b)}throw Error("Invalid arity: "+arguments.length);};e.m=d;e.b=c;return e}()}(function(b){return function(c){var d=c[1];if(7===d){var e=c[7],e=e.getBoundingClientRect();c[2]=e;c[1]=8;return Ki}if(1===d)return e=ho(50),Yn(c,2,e);if(4===d)return e=document.getElementById("space"),c[2]=e,c[1]=5,Ki;if(15===d){var e=c[2],m=Z.b?Z.b(mk):Z.call(null,mk),n=ho(100);c[8]=m;c[9]=e;return Yn(c,16,n)}if(13===d)return e=Jo(Uo),c[2]=e,c[1]=14,Ki;if(6===d)return c[2]=null,c[1]=8,Ki;if(3===d)return c[2]=null,c[1]=
5,Ki;if(12===d)return e=c[10],m=c[11],e=Z.c?Z.c(Zi,e,m):Z.call(null,Zi,e,m),m=ho(100),c[12]=e,Yn(c,15,m);if(2===d){var q=c[2],p=function(){return function(){return function(b){return b.width}}(q,d,b)}(),e=Ng(p,function(){return function(){return function(b){return b.height}}(q,p,d,b)}()),m=null==document;c[13]=e;c[14]=q;c[1]=w(m)?3:4;return Ki}return 11===d?(n=c[2],e=P(n,0),m=P(n,1),c[10]=e,c[11]=m,c[1]=w(n)?12:13,Ki):9===d?(c[2]=null,c[1]=11,Ki):5===d?(e=c[7],e=c[2],c[7]=e,c[1]=w(null==e)?6:7,Ki):
14===d?(e=c[2],Zn(c,e)):16===d?(m=c[2],e=Z.b?Z.b(qj):Z.call(null,qj),c[15]=m,c[2]=e,c[1]=14,Ki):10===d?(e=c[13],m=c[16],e=e.b?e.b(m):e.call(null,m),c[2]=e,c[1]=11,Ki):8===d?(m=c[16],e=c[2],c[16]=e,c[1]=w(null==e)?9:10,Ki):null}}(b),b)}(),e=function(){var e=d.m?d.m():d.call(null);e[6]=b;return e}();return Xn(e)}}(b));return b};
function Vo(a,b,c){var d=kn(c),e=c.b?c.b(vk):c.call(null,vk),f=io();In(function(d,e,f,m){return function(){var n=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!le(e,Ki)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,$n(c),d=Ki;else throw f;}if(!le(d,Ki))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.m=c;d.b=b;return d}()}(function(d,e,f,g){return function(d){var h=d[1];if(1===h){var h=fn(c),h=Z.a?Z.a(Yj,h):Z.call(null,Yj,h),l=ho(g);d[7]=h;return Yn(d,2,l)}return 2===h?(h=d[2],d[8]=0,d[9]=h,d[2]=null,d[1]=3,Ki):3===h?(h=d[8],d[1]=w(50>h)?5:6,Ki):4===h?(h=d[2],Zn(d,h)):5===h?(h=en(a,f,b),h=e.b?e.b(h):e.call(null,h),h=Z.a?Z.a(Yj,h):Z.call(null,Yj,h),l=ho(g),d[10]=h,Yn(d,8,l)):6===h?(d[2]=null,d[1]=7,Ki):7===h?(h=d[2],
d[2]=h,d[1]=4,Ki):8===h?(h=d[8],d[11]=d[2],d[8]=h+1,d[2]=null,d[1]=3,Ki):null}}(d,e,f,m),d,e,f,m)}(),q=function(){var a=n.m?n.m():n.call(null);a[6]=d;return a}();return Xn(q)}}(f,d,e,100))}function Wo(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;return Xo(0<b.length?new Fc(b.slice(0),0):null)}function Xo(a){return zg.h(E([new v(null,2,[ti,0,Li,Yh],null),B.a(Sc,a)],0))}
zh(Z,Hj,function(a,b,c){Uo();return Ue.a($g,function(a){var e=lf.c(a.b?a.b(qi):a.call(null,qi),c,function(a){return w(a)?null:Wm.b?Wm.b(b):Wm.call(null,b)}),f=Xl(new v(null,3,[vk,0,kk,new R(null,5,5,S,[Xo(E([Li,Ai],0)),Wo(),Wo(),Wo(),Wo()],null),qi,T.a(function(){return function(a){return w(a)?a:Rm()}}(e),e)],null));return Q.h(a,gj,f,E([Ti,f,qi,e,Xh,!1],0))})});
zh(Z,Zi,function(a,b,c){return Ue.a($g,function(a){return function(e){return lf.l(kf.c(jf(jf(e,new R(null,2,5,S,[gj,zi],null),b),new R(null,2,5,S,[gj,Dk],null),c),new R(null,2,5,S,[gj,qi],null),Ne(Vl,new v(null,3,[bk,a,zi,b-a,Dk,c],null))),gj,Ko,new v(null,2,[bk,45,zi,a-90],null))}}(150))});zh(Z,mk,function(){return Ue.h($g,lf,gj,Zl,E([function(a){a=null!=a&&(a.g&64||a.F)?B.a(Sc,a):a;var b=C.a(a,zj),b=Om(b);return w(b)?Q.c(a,Mj,b.getTotalLength()):a}],0))});
zh(Z,qj,function(){return Ue.l($g,lf,gj,om)});zh(Z,Sj,function(){return Ue.a($g,function(a){var b=a.b?a.b(Ah):a.call(null,Ah);return lf.l(kf.c(a,new R(null,2,5,S,[gj,vk],null),Vc),gj,am,Ze(function(a){return function(){return(6*bn(a)|0)+1}}(b)))})});zh(Z,Mh,function(a,b,c){To(b,b,c);return Ue.h($g,Q,Xh,!0,E([Zg,new Date],0))});zh(Z,Gh,function(){return Ue.l($g,lf,gj,dm)});zh(Z,Wh,function(a,b){return Ue.h($g,lf,gj,Zl,E([function(a){return Q.c(a,Ri,b)}],0))});
zh(Z,Rj,function(){return Ue.l($g,lf,gj,nm)});zh(Z,pj,function(){return Ue.l($g,lf,gj,pm)});zh(Z,ej,function(a,b){return Ue.h($g,lf,gj,Zl,E([function(a){return Q.c(a,Zj,b)}],0))});zh(Z,tk,function(){return Ue.l($g,lf,gj,qm)});zh(Z,nj,function(){return Ue.l($g,lf,gj,sm)});zh(Z,bj,function(a,b){Yg();return Ue.a($g,function(a){return rd.a(Q.c(a,Xh,b),Zg)})});zh(Z,ck,function(a,b,c,d){w((L.b?L.b($g):L.call(null,$g)).call(null,Xh))&&To(b,c,d);return L.b?L.b($g):L.call(null,$g)});
zh(Z,Oi,function(a,b){return Ue.l($g,lf,gj,function(a){return en((L.b?L.b($g):L.call(null,$g)).call(null,Ah),b,a)})});zh(Z,Kj,function(a,b){return Ue.l($g,Q,oj,b)});zh(Z,Uj,function(a,b){return Ue.l($g,Q,gi,b)});zh(Z,Wi,function(a,b){if(w(b)){var c=L.b?L.b($g):L.call(null,$g),d=null!=c&&(c.g&64||c.F)?B.a(Sc,c):c,c=C.a(d,Ah),e=C.a(d,gj),d=C.a(d,Ti);Vo(c,d,e);return L.b?L.b($g):L.call(null,$g)}return Ue.h($g,lf,gj,rd,E([Wi],0))});
zh(Z,Yj,function(a,b){return Ue.l($g,jf,new R(null,2,5,S,[gj,Wi],null),b)});zh(Z,ii,function(){Ue.a($g,function(a){return Q.h(a,gj,a.b?a.b(Ti):a.call(null,Ti),E([Ah,cn(a.b?a.b(Xi):a.call(null,Xi))],0))});return Uo()});zh(Z,Nh,function(){var a=jh();location.hash=a;Ue.a($g,function(a){return function(c){return Q.h(c,gj,c.b?c.b(Ti):c.call(null,Ti),E([Xi,a,Ah,cn(a)],0))}}(a));return Uo()});if("undefined"===typeof Yo)var Yo=function(a){return function(){var b=Io();return a.b?a.b(b):a.call(null,b)}}(Dm());
if("undefined"===typeof Zo){var Zo,$o=$g;Wb($o,fk,function(a,b,c,d){return Yo.b?Yo.b(d):Yo.call(null,d)});Zo=$o}if("undefined"===typeof ap){var ap;Z.c?Z.c(Hj,Vj,0):Z.call(null,Hj,Vj,0);Z.c?Z.c(Hj,fi,1):Z.call(null,Hj,fi,1);Z.c?Z.c(Hj,Qi,2):Z.call(null,Hj,Qi,2);ap=Z.a?Z.a(Kj,!0):Z.call(null,Kj,!0)}var bp=L.b?L.b($g):L.call(null,$g);Yo.b?Yo.b(bp):Yo.call(null,bp);