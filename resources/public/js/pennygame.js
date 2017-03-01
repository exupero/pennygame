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
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function ca(a){return"function"==t(a)}var da="closure_uid_"+(1E9*Math.random()>>>0),ea=0;function fa(a,b,c){return a.call.apply(a.bind,arguments)}function ga(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}
function ma(a,b,c){ma=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?fa:ga;return ma.apply(null,arguments)};function pa(a,b){for(var c in a)b.call(void 0,a[c],c,a)};function qa(a,b){null!=a&&this.append.apply(this,arguments)}k=qa.prototype;k.bb="";k.set=function(a){this.bb=""+a};k.append=function(a,b,c){this.bb+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.bb+=arguments[d];return this};k.clear=function(){this.bb=""};k.toString=function(){return this.bb};function ra(a,b){a.sort(b||sa)}function ua(a,b){for(var c=0;c<a.length;c++)a[c]={index:c,value:a[c]};var d=b||sa;ra(a,function(a,b){return d(a.value,b.value)||a.index-b.index});for(c=0;c<a.length;c++)a[c]=a[c].value}function sa(a,b){return a>b?1:a<b?-1:0};var va;if("undefined"===typeof wa)var wa=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof xa)var xa=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var za=null;if("undefined"===typeof Ba)var Ba=null;function Ea(){return new v(null,5,[Fa,!0,Ga,!0,Ha,!1,Ia,!1,Ja,null],null)}Ka;function x(a){return null!=a&&!1!==a}La;y;function Ma(a){return null==a}function Na(a){return a instanceof Array}
function Oa(a){return null==a?!0:!1===a?!0:!1}function Pa(a,b){return a[t(null==b?null:b)]?!0:a._?!0:!1}function Ra(a,b){var c=null==b?null:b.constructor,c=x(x(c)?c.sb:c)?c.Za:t(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function Sa(a){var b=a.Za;return x(b)?b:""+A(a)}var Ta="undefined"!==typeof Symbol&&"function"===t(Symbol)?Symbol.iterator:"@@iterator";function Ua(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}B;Va;
var Ka=function Ka(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ka.b(arguments[0]);case 2:return Ka.a(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};Ka.b=function(a){return Ka.a(null,a)};Ka.a=function(a,b){function c(a,b){a.push(b);return a}var d=[];return Va.c?Va.c(c,d,b):Va.call(null,c,d,b)};Ka.w=2;function Wa(){}function Ya(){}
var Za=function Za(b){if(null!=b&&null!=b.Z)return b.Z(b);var c=Za[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Za._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("ICounted.-count",b);},$a=function $a(b){if(null!=b&&null!=b.ca)return b.ca(b);var c=$a[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=$a._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IEmptyableCollection.-empty",b);};function ab(){}
var bb=function bb(b,c){if(null!=b&&null!=b.X)return b.X(b,c);var d=bb[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=bb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("ICollection.-conj",b);};function cb(){}
var db=function db(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return db.a(arguments[0],arguments[1]);case 3:return db.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
db.a=function(a,b){if(null!=a&&null!=a.ba)return a.ba(a,b);var c=db[t(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=db._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Ra("IIndexed.-nth",a);};db.c=function(a,b,c){if(null!=a&&null!=a.Ea)return a.Ea(a,b,c);var d=db[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=db._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Ra("IIndexed.-nth",a);};db.w=3;function eb(){}
var fb=function fb(b){if(null!=b&&null!=b.ta)return b.ta(b);var c=fb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=fb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("ISeq.-first",b);},gb=function gb(b){if(null!=b&&null!=b.xa)return b.xa(b);var c=gb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=gb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("ISeq.-rest",b);};function hb(){}function ib(){}
var lb=function lb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return lb.a(arguments[0],arguments[1]);case 3:return lb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
lb.a=function(a,b){if(null!=a&&null!=a.N)return a.N(a,b);var c=lb[t(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=lb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Ra("ILookup.-lookup",a);};lb.c=function(a,b,c){if(null!=a&&null!=a.I)return a.I(a,b,c);var d=lb[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=lb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Ra("ILookup.-lookup",a);};lb.w=3;function mb(){}
var nb=function nb(b,c){if(null!=b&&null!=b.gc)return b.gc(b,c);var d=nb[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=nb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("IAssociative.-contains-key?",b);},ob=function ob(b,c,d){if(null!=b&&null!=b.Ra)return b.Ra(b,c,d);var e=ob[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=ob._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ra("IAssociative.-assoc",b);};function pb(){}
var qb=function qb(b,c){if(null!=b&&null!=b.rb)return b.rb(b,c);var d=qb[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=qb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("IMap.-dissoc",b);};function rb(){}
var sb=function sb(b){if(null!=b&&null!=b.Hb)return b.Hb(b);var c=sb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=sb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IMapEntry.-key",b);},tb=function tb(b){if(null!=b&&null!=b.Ib)return b.Ib(b);var c=tb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=tb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IMapEntry.-val",b);};function ub(){}
var vb=function vb(b){if(null!=b&&null!=b.cb)return b.cb(b);var c=vb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=vb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IStack.-peek",b);};function wb(){}
var xb=function xb(b,c,d){if(null!=b&&null!=b.eb)return b.eb(b,c,d);var e=xb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=xb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ra("IVector.-assoc-n",b);},yb=function yb(b){if(null!=b&&null!=b.Eb)return b.Eb(b);var c=yb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=yb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IDeref.-deref",b);};function zb(){}
var Ab=function Ab(b){if(null!=b&&null!=b.P)return b.P(b);var c=Ab[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Ab._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IMeta.-meta",b);},Cb=function Cb(b,c){if(null!=b&&null!=b.R)return b.R(b,c);var d=Cb[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Cb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("IWithMeta.-with-meta",b);};function Db(){}
var Eb=function Eb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Eb.a(arguments[0],arguments[1]);case 3:return Eb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
Eb.a=function(a,b){if(null!=a&&null!=a.ea)return a.ea(a,b);var c=Eb[t(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=Eb._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Ra("IReduce.-reduce",a);};Eb.c=function(a,b,c){if(null!=a&&null!=a.fa)return a.fa(a,b,c);var d=Eb[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=Eb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Ra("IReduce.-reduce",a);};Eb.w=3;
var Fb=function Fb(b,c,d){if(null!=b&&null!=b.Gb)return b.Gb(b,c,d);var e=Fb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Fb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ra("IKVReduce.-kv-reduce",b);},Gb=function Gb(b,c){if(null!=b&&null!=b.D)return b.D(b,c);var d=Gb[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Gb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("IEquiv.-equiv",b);},Hb=function Hb(b){if(null!=b&&null!=b.S)return b.S(b);
var c=Hb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Hb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IHash.-hash",b);};function Ib(){}var Kb=function Kb(b){if(null!=b&&null!=b.U)return b.U(b);var c=Kb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Kb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("ISeqable.-seq",b);};function Lb(){}function Mb(){}function Nb(){}
var Ob=function Ob(b){if(null!=b&&null!=b.Xb)return b.Xb(b);var c=Ob[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Ob._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IReversible.-rseq",b);},Pb=function Pb(b,c){if(null!=b&&null!=b.wc)return b.wc(0,c);var d=Pb[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Pb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("IWriter.-write",b);},Qb=function Qb(b,c,d){if(null!=b&&null!=b.L)return b.L(b,c,d);
var e=Qb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Qb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ra("IPrintWithWriter.-pr-writer",b);},Rb=function Rb(b,c,d){if(null!=b&&null!=b.vc)return b.vc(0,c,d);var e=Rb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Rb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ra("IWatchable.-notify-watches",b);},Sb=function Sb(b,c,d){if(null!=b&&null!=b.uc)return b.uc(0,c,d);var e=Sb[t(null==
b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Sb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ra("IWatchable.-add-watch",b);},Tb=function Tb(b){if(null!=b&&null!=b.pb)return b.pb(b);var c=Tb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Tb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IEditableCollection.-as-transient",b);},Ub=function Ub(b,c){if(null!=b&&null!=b.Mb)return b.Mb(b,c);var d=Ub[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,
c):d.call(null,b,c);d=Ub._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("ITransientCollection.-conj!",b);},Vb=function Vb(b){if(null!=b&&null!=b.Nb)return b.Nb(b);var c=Vb[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Vb._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("ITransientCollection.-persistent!",b);},Wb=function Wb(b,c,d){if(null!=b&&null!=b.Lb)return b.Lb(b,c,d);var e=Wb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Wb._;if(null!=
e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ra("ITransientAssociative.-assoc!",b);},Xb=function Xb(b,c,d){if(null!=b&&null!=b.tc)return b.tc(0,c,d);var e=Xb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Xb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ra("ITransientVector.-assoc-n!",b);};function Yb(){}
var Zb=function Zb(b,c){if(null!=b&&null!=b.ob)return b.ob(b,c);var d=Zb[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Zb._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("IComparable.-compare",b);},$b=function $b(b){if(null!=b&&null!=b.qc)return b.qc();var c=$b[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=$b._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IChunk.-drop-first",b);},ac=function ac(b){if(null!=b&&null!=b.ic)return b.ic(b);
var c=ac[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ac._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IChunkedSeq.-chunked-first",b);},bc=function bc(b){if(null!=b&&null!=b.jc)return b.jc(b);var c=bc[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=bc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IChunkedSeq.-chunked-rest",b);},cc=function cc(b){if(null!=b&&null!=b.hc)return b.hc(b);var c=cc[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,
b);c=cc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IChunkedNext.-chunked-next",b);},dc=function dc(b){if(null!=b&&null!=b.Jb)return b.Jb(b);var c=dc[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=dc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("INamed.-name",b);},ec=function ec(b){if(null!=b&&null!=b.Kb)return b.Kb(b);var c=ec[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=ec._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("INamed.-namespace",
b);},fc=function fc(b,c){if(null!=b&&null!=b.Tc)return b.Tc(b,c);var d=fc[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=fc._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("IReset.-reset!",b);},gc=function gc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return gc.a(arguments[0],arguments[1]);case 3:return gc.c(arguments[0],arguments[1],arguments[2]);case 4:return gc.l(arguments[0],arguments[1],arguments[2],
arguments[3]);case 5:return gc.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};gc.a=function(a,b){if(null!=a&&null!=a.Vc)return a.Vc(a,b);var c=gc[t(null==a?null:a)];if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);c=gc._;if(null!=c)return c.a?c.a(a,b):c.call(null,a,b);throw Ra("ISwap.-swap!",a);};
gc.c=function(a,b,c){if(null!=a&&null!=a.Wc)return a.Wc(a,b,c);var d=gc[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=gc._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw Ra("ISwap.-swap!",a);};gc.l=function(a,b,c,d){if(null!=a&&null!=a.Xc)return a.Xc(a,b,c,d);var e=gc[t(null==a?null:a)];if(null!=e)return e.l?e.l(a,b,c,d):e.call(null,a,b,c,d);e=gc._;if(null!=e)return e.l?e.l(a,b,c,d):e.call(null,a,b,c,d);throw Ra("ISwap.-swap!",a);};
gc.A=function(a,b,c,d,e){if(null!=a&&null!=a.Yc)return a.Yc(a,b,c,d,e);var f=gc[t(null==a?null:a)];if(null!=f)return f.A?f.A(a,b,c,d,e):f.call(null,a,b,c,d,e);f=gc._;if(null!=f)return f.A?f.A(a,b,c,d,e):f.call(null,a,b,c,d,e);throw Ra("ISwap.-swap!",a);};gc.w=5;var hc=function hc(b){if(null!=b&&null!=b.Ha)return b.Ha(b);var c=hc[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=hc._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IIterable.-iterator",b);};
function ic(a){this.ld=a;this.g=1073741824;this.C=0}ic.prototype.wc=function(a,b){return this.ld.append(b)};function jc(a){var b=new qa;a.L(null,new ic(b),Ea());return""+A(b)}var kc="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function lc(a){a=kc(a|0,-862048943);return kc(a<<15|a>>>-15,461845907)}
function mc(a,b){var c=(a|0)^(b|0);return kc(c<<13|c>>>-13,5)+-430675100|0}function nc(a,b){var c=(a|0)^b,c=kc(c^c>>>16,-2048144789),c=kc(c^c>>>13,-1028477387);return c^c>>>16}function oc(a){var b;a:{b=1;for(var c=0;;)if(b<a.length){var d=b+2,c=mc(c,lc(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^lc(a.charCodeAt(a.length-1)):b;return nc(b,kc(2,a.length))}pc;qc;rc;sc;var tc={},uc=0;
function vc(a){255<uc&&(tc={},uc=0);var b=tc[a];if("number"!==typeof b){a:if(null!=a)if(b=a.length,0<b)for(var c=0,d=0;;)if(c<b)var e=c+1,d=kc(31,d)+a.charCodeAt(c),c=e;else{b=d;break a}else b=0;else b=0;tc[a]=b;uc+=1}return a=b}function wc(a){null!=a&&(a.g&4194304||a.sd)?a=a.S(null):"number"===typeof a?a=Math.floor(a)%2147483647:!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=vc(a),0!==a&&(a=lc(a),a=mc(0,a),a=nc(a,4))):a=a instanceof Date?a.valueOf():null==a?0:Hb(a);return a}
function xc(a,b){return a^b+2654435769+(a<<6)+(a>>2)}function La(a,b){return b instanceof a}function yc(a,b){if(a.Va===b.Va)return 0;var c=Oa(a.Ba);if(x(c?b.Ba:c))return-1;if(x(a.Ba)){if(Oa(b.Ba))return 1;c=sa(a.Ba,b.Ba);return 0===c?sa(a.name,b.name):c}return sa(a.name,b.name)}C;function qc(a,b,c,d,e){this.Ba=a;this.name=b;this.Va=c;this.nb=d;this.Da=e;this.g=2154168321;this.C=4096}k=qc.prototype;k.toString=function(){return this.Va};k.equiv=function(a){return this.D(null,a)};
k.D=function(a,b){return b instanceof qc?this.Va===b.Va:!1};k.call=function(){function a(a,b,c){return C.c?C.c(b,this,c):C.call(null,b,this,c)}function b(a,b){return C.a?C.a(b,this):C.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ua(b)))};
k.b=function(a){return C.a?C.a(a,this):C.call(null,a,this)};k.a=function(a,b){return C.c?C.c(a,this,b):C.call(null,a,this,b)};k.P=function(){return this.Da};k.R=function(a,b){return new qc(this.Ba,this.name,this.Va,this.nb,b)};k.S=function(){var a=this.nb;return null!=a?a:this.nb=a=xc(oc(this.name),vc(this.Ba))};k.Jb=function(){return this.name};k.Kb=function(){return this.Ba};k.L=function(a,b){return Pb(b,this.Va)};
var zc=function zc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return zc.b(arguments[0]);case 2:return zc.a(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};zc.b=function(a){if(a instanceof qc)return a;var b=a.indexOf("/");return-1===b?zc.a(null,a):zc.a(a.substring(0,b),a.substring(b+1,a.length))};zc.a=function(a,b){var c=null!=a?[A(a),A("/"),A(b)].join(""):b;return new qc(a,b,c,null,null)};
zc.w=2;G;Ac;Bc;function H(a){if(null==a)return null;if(null!=a&&(a.g&8388608||a.Uc))return a.U(null);if(Na(a)||"string"===typeof a)return 0===a.length?null:new Bc(a,0);if(Pa(Ib,a))return Kb(a);throw Error([A(a),A(" is not ISeqable")].join(""));}function I(a){if(null==a)return null;if(null!=a&&(a.g&64||a.F))return a.ta(null);a=H(a);return null==a?null:fb(a)}function Cc(a){return null!=a?null!=a&&(a.g&64||a.F)?a.xa(null):(a=H(a))?gb(a):Dc:Dc}
function J(a){return null==a?null:null!=a&&(a.g&128||a.Wb)?a.wa(null):H(Cc(a))}var rc=function rc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return rc.b(arguments[0]);case 2:return rc.a(arguments[0],arguments[1]);default:return rc.h(arguments[0],arguments[1],new Bc(c.slice(2),0))}};rc.b=function(){return!0};rc.a=function(a,b){return null==a?null==b:a===b||Gb(a,b)};
rc.h=function(a,b,c){for(;;)if(rc.a(a,b))if(J(c))a=b,b=I(c),c=J(c);else return rc.a(b,I(c));else return!1};rc.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return rc.h(b,a,c)};rc.w=2;function Ec(a){this.H=a}Ec.prototype.next=function(){if(null!=this.H){var a=I(this.H);this.H=J(this.H);return{value:a,done:!1}}return{value:null,done:!0}};function Fc(a){return new Ec(H(a))}Gc;function Hc(a,b,c){this.value=a;this.yb=b;this.ec=c;this.g=8388672;this.C=0}Hc.prototype.U=function(){return this};
Hc.prototype.ta=function(){return this.value};Hc.prototype.xa=function(){null==this.ec&&(this.ec=Gc.b?Gc.b(this.yb):Gc.call(null,this.yb));return this.ec};function Gc(a){var b=a.next();return x(b.done)?Dc:new Hc(b.value,a,null)}function Ic(a,b){var c=lc(a),c=mc(0,c);return nc(c,b)}function Kc(a){var b=0,c=1;for(a=H(a);;)if(null!=a)b+=1,c=kc(31,c)+wc(I(a))|0,a=J(a);else return Ic(c,b)}var Lc=Ic(1,0);function Mc(a){var b=0,c=0;for(a=H(a);;)if(null!=a)b+=1,c=c+wc(I(a))|0,a=J(a);else return Ic(c,b)}
var Nc=Ic(0,0);Oc;pc;Pc;Ya["null"]=!0;Za["null"]=function(){return 0};Date.prototype.D=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};Date.prototype.Db=!0;Date.prototype.ob=function(a,b){if(b instanceof Date)return sa(this.valueOf(),b.valueOf());throw Error([A("Cannot compare "),A(this),A(" to "),A(b)].join(""));};Gb.number=function(a,b){return a===b};Qc;Wa["function"]=!0;zb["function"]=!0;Ab["function"]=function(){return null};Hb._=function(a){return a[da]||(a[da]=++ea)};
function Rc(a){return a+1}K;function Sc(a){this.G=a;this.g=32768;this.C=0}Sc.prototype.Eb=function(){return this.G};function Tc(a){return a instanceof Sc}function K(a){return yb(a)}function Uc(a,b){var c=Za(a);if(0===c)return b.m?b.m():b.call(null);for(var d=db.a(a,0),e=1;;)if(e<c){var f=db.a(a,e),d=b.a?b.a(d,f):b.call(null,d,f);if(Tc(d))return yb(d);e+=1}else return d}
function Vc(a,b,c){var d=Za(a),e=c;for(c=0;;)if(c<d){var f=db.a(a,c),e=b.a?b.a(e,f):b.call(null,e,f);if(Tc(e))return yb(e);c+=1}else return e}function Wc(a,b){var c=a.length;if(0===a.length)return b.m?b.m():b.call(null);for(var d=a[0],e=1;;)if(e<c){var f=a[e],d=b.a?b.a(d,f):b.call(null,d,f);if(Tc(d))return yb(d);e+=1}else return d}function Xc(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var f=a[c],e=b.a?b.a(e,f):b.call(null,e,f);if(Tc(e))return yb(e);c+=1}else return e}
function Yc(a,b,c,d){for(var e=a.length;;)if(d<e){var f=a[d];c=b.a?b.a(c,f):b.call(null,c,f);if(Tc(c))return yb(c);d+=1}else return c}Zc;M;$c;ad;function bd(a){return null!=a?a.g&2||a.Kc?!0:a.g?!1:Pa(Ya,a):Pa(Ya,a)}function cd(a){return null!=a?a.g&16||a.rc?!0:a.g?!1:Pa(cb,a):Pa(cb,a)}function dd(a,b){this.f=a;this.s=b}dd.prototype.ya=function(){return this.s<this.f.length};dd.prototype.next=function(){var a=this.f[this.s];this.s+=1;return a};
function Bc(a,b){this.f=a;this.s=b;this.g=166199550;this.C=8192}k=Bc.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.ba=function(a,b){var c=b+this.s;return c<this.f.length?this.f[c]:null};k.Ea=function(a,b,c){a=b+this.s;return a<this.f.length?this.f[a]:c};k.Ha=function(){return new dd(this.f,this.s)};k.wa=function(){return this.s+1<this.f.length?new Bc(this.f,this.s+1):null};k.Z=function(){var a=this.f.length-this.s;return 0>a?0:a};
k.Xb=function(){var a=Za(this);return 0<a?new $c(this,a-1,null):null};k.S=function(){return Kc(this)};k.D=function(a,b){return Pc.a?Pc.a(this,b):Pc.call(null,this,b)};k.ca=function(){return Dc};k.ea=function(a,b){return Yc(this.f,b,this.f[this.s],this.s+1)};k.fa=function(a,b,c){return Yc(this.f,b,c,this.s)};k.ta=function(){return this.f[this.s]};k.xa=function(){return this.s+1<this.f.length?new Bc(this.f,this.s+1):Dc};k.U=function(){return this.s<this.f.length?this:null};
k.X=function(a,b){return M.a?M.a(b,this):M.call(null,b,this)};Bc.prototype[Ta]=function(){return Fc(this)};var Ac=function Ac(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ac.b(arguments[0]);case 2:return Ac.a(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};Ac.b=function(a){return Ac.a(a,0)};Ac.a=function(a,b){return b<a.length?new Bc(a,b):null};Ac.w=2;
var G=function G(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return G.b(arguments[0]);case 2:return G.a(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};G.b=function(a){return Ac.a(a,0)};G.a=function(a,b){return Ac.a(a,b)};G.w=2;Qc;ed;function $c(a,b,c){this.Vb=a;this.s=b;this.v=c;this.g=32374990;this.C=8192}k=$c.prototype;k.toString=function(){return jc(this)};
k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};k.wa=function(){return 0<this.s?new $c(this.Vb,this.s-1,null):null};k.Z=function(){return this.s+1};k.S=function(){return Kc(this)};k.D=function(a,b){return Pc.a?Pc.a(this,b):Pc.call(null,this,b)};k.ca=function(){var a=Dc,b=this.v;return Qc.a?Qc.a(a,b):Qc.call(null,a,b)};k.ea=function(a,b){return ed.a?ed.a(b,this):ed.call(null,b,this)};k.fa=function(a,b,c){return ed.c?ed.c(b,c,this):ed.call(null,b,c,this)};
k.ta=function(){return db.a(this.Vb,this.s)};k.xa=function(){return 0<this.s?new $c(this.Vb,this.s-1,null):Dc};k.U=function(){return this};k.R=function(a,b){return new $c(this.Vb,this.s,b)};k.X=function(a,b){return M.a?M.a(b,this):M.call(null,b,this)};$c.prototype[Ta]=function(){return Fc(this)};function fd(a){return I(J(a))}function gd(a){for(;;){var b=J(a);if(null!=b)a=b;else return I(a)}}Gb._=function(a,b){return a===b};
var hd=function hd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return hd.m();case 1:return hd.b(arguments[0]);case 2:return hd.a(arguments[0],arguments[1]);default:return hd.h(arguments[0],arguments[1],new Bc(c.slice(2),0))}};hd.m=function(){return id};hd.b=function(a){return a};hd.a=function(a,b){return null!=a?bb(a,b):bb(Dc,b)};hd.h=function(a,b,c){for(;;)if(x(c))a=hd.a(a,b),b=I(c),c=J(c);else return hd.a(a,b)};
hd.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return hd.h(b,a,c)};hd.w=2;function N(a){if(null!=a)if(null!=a&&(a.g&2||a.Kc))a=a.Z(null);else if(Na(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.g&8388608||a.Uc))a:{a=H(a);for(var b=0;;){if(bd(a)){a=b+Za(a);break a}a=J(a);b+=1}}else a=Za(a);else a=0;return a}function jd(a,b){for(var c=null;;){if(null==a)return c;if(0===b)return H(a)?I(a):c;if(cd(a))return db.c(a,b,c);if(H(a)){var d=J(a),e=b-1;a=d;b=e}else return c}}
function kd(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.g&16||a.rc))return a.ba(null,b);if(Na(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.g&64||a.F)){var c;a:{c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(H(c)){c=I(c);break a}throw Error("Index out of bounds");}if(cd(c)){c=db.a(c,d);break a}if(H(c))c=J(c),--d;else throw Error("Index out of bounds");
}}return c}if(Pa(cb,a))return db.a(a,b);throw Error([A("nth not supported on this type "),A(Sa(null==a?null:a.constructor))].join(""));}
function P(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return null;if(null!=a&&(a.g&16||a.rc))return a.Ea(null,b,null);if(Na(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.g&64||a.F))return jd(a,b);if(Pa(cb,a))return db.a(a,b);throw Error([A("nth not supported on this type "),A(Sa(null==a?null:a.constructor))].join(""));}
var C=function C(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return C.a(arguments[0],arguments[1]);case 3:return C.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};C.a=function(a,b){return null==a?null:null!=a&&(a.g&256||a.sc)?a.N(null,b):Na(a)?b<a.length?a[b|0]:null:"string"===typeof a?b<a.length?a[b|0]:null:Pa(ib,a)?lb.a(a,b):null};
C.c=function(a,b,c){return null!=a?null!=a&&(a.g&256||a.sc)?a.I(null,b,c):Na(a)?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:Pa(ib,a)?lb.c(a,b,c):c:c};C.w=3;ld;var Q=function Q(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Q.c(arguments[0],arguments[1],arguments[2]);default:return Q.h(arguments[0],arguments[1],arguments[2],new Bc(c.slice(3),0))}};Q.c=function(a,b,c){return null!=a?ob(a,b,c):md([b],[c])};
Q.h=function(a,b,c,d){for(;;)if(a=Q.c(a,b,c),x(d))b=I(d),c=fd(d),d=J(J(d));else return a};Q.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),d=J(d);return Q.h(b,a,c,d)};Q.w=3;var nd=function nd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return nd.b(arguments[0]);case 2:return nd.a(arguments[0],arguments[1]);default:return nd.h(arguments[0],arguments[1],new Bc(c.slice(2),0))}};nd.b=function(a){return a};
nd.a=function(a,b){return null==a?null:qb(a,b)};nd.h=function(a,b,c){for(;;){if(null==a)return null;a=nd.a(a,b);if(x(c))b=I(c),c=J(c);else return a}};nd.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return nd.h(b,a,c)};nd.w=2;function od(a,b){this.i=a;this.v=b;this.g=393217;this.C=0}k=od.prototype;k.P=function(){return this.v};k.R=function(a,b){return new od(this.i,b)};k.Jc=!0;
k.call=function(){function a(a,b,c,d,e,f,g,l,h,m,n,p,q,r,w,u,z,D,F,L,O,E){a=this;return B.qb?B.qb(a.i,b,c,d,e,f,g,l,h,m,n,p,q,r,w,u,z,D,F,L,O,E):B.call(null,a.i,b,c,d,e,f,g,l,h,m,n,p,q,r,w,u,z,D,F,L,O,E)}function b(a,b,c,d,e,f,g,l,h,m,n,p,q,r,w,u,z,D,F,L,O){a=this;return a.i.qa?a.i.qa(b,c,d,e,f,g,l,h,m,n,p,q,r,w,u,z,D,F,L,O):a.i.call(null,b,c,d,e,f,g,l,h,m,n,p,q,r,w,u,z,D,F,L,O)}function c(a,b,c,d,e,f,g,l,h,m,n,p,q,r,w,u,z,D,F,L){a=this;return a.i.pa?a.i.pa(b,c,d,e,f,g,l,h,m,n,p,q,r,w,u,z,D,F,L):
a.i.call(null,b,c,d,e,f,g,l,h,m,n,p,q,r,w,u,z,D,F,L)}function d(a,b,c,d,e,f,g,l,h,m,n,p,q,r,w,u,z,D,F){a=this;return a.i.oa?a.i.oa(b,c,d,e,f,g,l,h,m,n,p,q,r,w,u,z,D,F):a.i.call(null,b,c,d,e,f,g,l,h,m,n,p,q,r,w,u,z,D,F)}function e(a,b,c,d,e,f,g,l,h,m,n,p,q,r,w,u,z,D){a=this;return a.i.na?a.i.na(b,c,d,e,f,g,l,h,m,n,p,q,r,w,u,z,D):a.i.call(null,b,c,d,e,f,g,l,h,m,n,p,q,r,w,u,z,D)}function f(a,b,c,d,e,f,g,l,h,m,n,p,q,r,w,u,z){a=this;return a.i.ma?a.i.ma(b,c,d,e,f,g,l,h,m,n,p,q,r,w,u,z):a.i.call(null,b,
c,d,e,f,g,l,h,m,n,p,q,r,w,u,z)}function g(a,b,c,d,e,f,g,l,h,m,n,p,q,r,w,u){a=this;return a.i.la?a.i.la(b,c,d,e,f,g,l,h,m,n,p,q,r,w,u):a.i.call(null,b,c,d,e,f,g,l,h,m,n,p,q,r,w,u)}function h(a,b,c,d,e,f,g,l,h,m,n,p,q,r,w){a=this;return a.i.ka?a.i.ka(b,c,d,e,f,g,l,h,m,n,p,q,r,w):a.i.call(null,b,c,d,e,f,g,l,h,m,n,p,q,r,w)}function l(a,b,c,d,e,f,g,l,h,m,n,p,q,r){a=this;return a.i.ja?a.i.ja(b,c,d,e,f,g,l,h,m,n,p,q,r):a.i.call(null,b,c,d,e,f,g,l,h,m,n,p,q,r)}function m(a,b,c,d,e,f,g,l,h,m,n,p,q){a=this;
return a.i.ia?a.i.ia(b,c,d,e,f,g,l,h,m,n,p,q):a.i.call(null,b,c,d,e,f,g,l,h,m,n,p,q)}function n(a,b,c,d,e,f,g,l,h,m,n,p){a=this;return a.i.ha?a.i.ha(b,c,d,e,f,g,l,h,m,n,p):a.i.call(null,b,c,d,e,f,g,l,h,m,n,p)}function p(a,b,c,d,e,f,g,l,h,m,n){a=this;return a.i.ga?a.i.ga(b,c,d,e,f,g,l,h,m,n):a.i.call(null,b,c,d,e,f,g,l,h,m,n)}function q(a,b,c,d,e,f,g,l,h,m){a=this;return a.i.sa?a.i.sa(b,c,d,e,f,g,l,h,m):a.i.call(null,b,c,d,e,f,g,l,h,m)}function r(a,b,c,d,e,f,g,l,h){a=this;return a.i.ra?a.i.ra(b,c,
d,e,f,g,l,h):a.i.call(null,b,c,d,e,f,g,l,h)}function u(a,b,c,d,e,f,g,l){a=this;return a.i.aa?a.i.aa(b,c,d,e,f,g,l):a.i.call(null,b,c,d,e,f,g,l)}function w(a,b,c,d,e,f,g){a=this;return a.i.T?a.i.T(b,c,d,e,f,g):a.i.call(null,b,c,d,e,f,g)}function z(a,b,c,d,e,f){a=this;return a.i.A?a.i.A(b,c,d,e,f):a.i.call(null,b,c,d,e,f)}function D(a,b,c,d,e){a=this;return a.i.l?a.i.l(b,c,d,e):a.i.call(null,b,c,d,e)}function F(a,b,c,d){a=this;return a.i.c?a.i.c(b,c,d):a.i.call(null,b,c,d)}function L(a,b,c){a=this;
return a.i.a?a.i.a(b,c):a.i.call(null,b,c)}function O(a,b){a=this;return a.i.b?a.i.b(b):a.i.call(null,b)}function Aa(a){a=this;return a.i.m?a.i.m():a.i.call(null)}var E=null,E=function(ka,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa,E,Xa,jb,kb,Bb,Jc,zd,nf){switch(arguments.length){case 1:return Aa.call(this,ka);case 2:return O.call(this,ka,na);case 3:return L.call(this,ka,na,U);case 4:return F.call(this,ka,na,U,V);case 5:return D.call(this,ka,na,U,V,ha);case 6:return z.call(this,ka,na,U,V,ha,ia);case 7:return w.call(this,
ka,na,U,V,ha,ia,ja);case 8:return u.call(this,ka,na,U,V,ha,ia,ja,la);case 9:return r.call(this,ka,na,U,V,ha,ia,ja,la,oa);case 10:return q.call(this,ka,na,U,V,ha,ia,ja,la,oa,ta);case 11:return p.call(this,ka,na,U,V,ha,ia,ja,la,oa,ta,ya);case 12:return n.call(this,ka,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca);case 13:return m.call(this,ka,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da);case 14:return l.call(this,ka,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa);case 15:return h.call(this,ka,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa,E);
case 16:return g.call(this,ka,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa,E,Xa);case 17:return f.call(this,ka,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa,E,Xa,jb);case 18:return e.call(this,ka,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa,E,Xa,jb,kb);case 19:return d.call(this,ka,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa,E,Xa,jb,kb,Bb);case 20:return c.call(this,ka,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa,E,Xa,jb,kb,Bb,Jc);case 21:return b.call(this,ka,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa,E,Xa,jb,kb,Bb,Jc,zd);case 22:return a.call(this,
ka,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa,E,Xa,jb,kb,Bb,Jc,zd,nf)}throw Error("Invalid arity: "+arguments.length);};E.b=Aa;E.a=O;E.c=L;E.l=F;E.A=D;E.T=z;E.aa=w;E.ra=u;E.sa=r;E.ga=q;E.ha=p;E.ia=n;E.ja=m;E.ka=l;E.la=h;E.ma=g;E.na=f;E.oa=e;E.pa=d;E.qa=c;E.Fb=b;E.qb=a;return E}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ua(b)))};k.m=function(){return this.i.m?this.i.m():this.i.call(null)};k.b=function(a){return this.i.b?this.i.b(a):this.i.call(null,a)};
k.a=function(a,b){return this.i.a?this.i.a(a,b):this.i.call(null,a,b)};k.c=function(a,b,c){return this.i.c?this.i.c(a,b,c):this.i.call(null,a,b,c)};k.l=function(a,b,c,d){return this.i.l?this.i.l(a,b,c,d):this.i.call(null,a,b,c,d)};k.A=function(a,b,c,d,e){return this.i.A?this.i.A(a,b,c,d,e):this.i.call(null,a,b,c,d,e)};k.T=function(a,b,c,d,e,f){return this.i.T?this.i.T(a,b,c,d,e,f):this.i.call(null,a,b,c,d,e,f)};
k.aa=function(a,b,c,d,e,f,g){return this.i.aa?this.i.aa(a,b,c,d,e,f,g):this.i.call(null,a,b,c,d,e,f,g)};k.ra=function(a,b,c,d,e,f,g,h){return this.i.ra?this.i.ra(a,b,c,d,e,f,g,h):this.i.call(null,a,b,c,d,e,f,g,h)};k.sa=function(a,b,c,d,e,f,g,h,l){return this.i.sa?this.i.sa(a,b,c,d,e,f,g,h,l):this.i.call(null,a,b,c,d,e,f,g,h,l)};k.ga=function(a,b,c,d,e,f,g,h,l,m){return this.i.ga?this.i.ga(a,b,c,d,e,f,g,h,l,m):this.i.call(null,a,b,c,d,e,f,g,h,l,m)};
k.ha=function(a,b,c,d,e,f,g,h,l,m,n){return this.i.ha?this.i.ha(a,b,c,d,e,f,g,h,l,m,n):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n)};k.ia=function(a,b,c,d,e,f,g,h,l,m,n,p){return this.i.ia?this.i.ia(a,b,c,d,e,f,g,h,l,m,n,p):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p)};k.ja=function(a,b,c,d,e,f,g,h,l,m,n,p,q){return this.i.ja?this.i.ja(a,b,c,d,e,f,g,h,l,m,n,p,q):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q)};
k.ka=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){return this.i.ka?this.i.ka(a,b,c,d,e,f,g,h,l,m,n,p,q,r):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r)};k.la=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u){return this.i.la?this.i.la(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u)};k.ma=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w){return this.i.ma?this.i.ma(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w)};
k.na=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z){return this.i.na?this.i.na(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z)};k.oa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D){return this.i.oa?this.i.oa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D)};
k.pa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F){return this.i.pa?this.i.pa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F)};k.qa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F,L){return this.i.qa?this.i.qa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F,L):this.i.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F,L)};
k.Fb=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F,L,O){return B.qb?B.qb(this.i,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F,L,O):B.call(null,this.i,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F,L,O)};function Qc(a,b){return ca(a)?new od(a,b):null==a?null:Cb(a,b)}function pd(a){var b=null!=a;return(b?null!=a?a.g&131072||a.Qc||(a.g?0:Pa(zb,a)):Pa(zb,a):b)?Ab(a):null}function qd(a){return null==a||Oa(H(a))}function rd(a){return null==a?!1:null!=a?a.g&4096||a.wd?!0:a.g?!1:Pa(ub,a):Pa(ub,a)}
function sd(a){return null!=a?a.g&16777216||a.vd?!0:a.g?!1:Pa(Lb,a):Pa(Lb,a)}function td(a){return null==a?!1:null!=a?a.g&1024||a.Oc?!0:a.g?!1:Pa(pb,a):Pa(pb,a)}function ud(a){return null!=a?a.g&16384||a.xd?!0:a.g?!1:Pa(wb,a):Pa(wb,a)}vd;wd;function xd(a){return null!=a?a.C&512||a.qd?!0:!1:!1}function yd(a){var b=[];pa(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}function Ad(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var Bd={};
function Cd(a){return null==a?!1:null!=a?a.g&64||a.F?!0:a.g?!1:Pa(eb,a):Pa(eb,a)}function Dd(a){return null==a?!1:!1===a?!1:!0}function Ed(a,b){return C.c(a,b,Bd)===Bd?!1:!0}function Fd(a,b){var c;if(c=null!=a)c=null!=a?a.g&512||a.pd?!0:a.g?!1:Pa(mb,a):Pa(mb,a);return c&&Ed(a,b)?new R(null,2,5,S,[b,C.a(a,b)],null):null}
function sc(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if("number"===typeof a){if("number"===typeof b)return sa(a,b);throw Error([A("Cannot compare "),A(a),A(" to "),A(b)].join(""));}if(null!=a?a.C&2048||a.Db||(a.C?0:Pa(Yb,a)):Pa(Yb,a))return Zb(a,b);if("string"!==typeof a&&!Na(a)&&!0!==a&&!1!==a||(null==a?null:a.constructor)!==(null==b?null:b.constructor))throw Error([A("Cannot compare "),A(a),A(" to "),A(b)].join(""));return sa(a,b)}
function Gd(a,b){var c=N(a),d=N(b);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=sc(kd(a,d),kd(b,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}function Hd(a){return rc.a(a,sc)?sc:function(b,c){var d=a.a?a.a(b,c):a.call(null,b,c);return"number"===typeof d?d:x(d)?-1:x(a.a?a.a(c,b):a.call(null,c,b))?1:0}}Id;
var ed=function ed(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return ed.a(arguments[0],arguments[1]);case 3:return ed.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};ed.a=function(a,b){var c=H(b);if(c){var d=I(c),c=J(c);return Va.c?Va.c(a,d,c):Va.call(null,a,d,c)}return a.m?a.m():a.call(null)};
ed.c=function(a,b,c){for(c=H(c);;)if(c){var d=I(c);b=a.a?a.a(b,d):a.call(null,b,d);if(Tc(b))return yb(b);c=J(c)}else return b};ed.w=3;Jd;var Va=function Va(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Va.a(arguments[0],arguments[1]);case 3:return Va.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
Va.a=function(a,b){return null!=b&&(b.g&524288||b.Sc)?b.ea(null,a):Na(b)?Wc(b,a):"string"===typeof b?Wc(b,a):Pa(Db,b)?Eb.a(b,a):ed.a(a,b)};Va.c=function(a,b,c){return null!=c&&(c.g&524288||c.Sc)?c.fa(null,a,b):Na(c)?Xc(c,a,b):"string"===typeof c?Xc(c,a,b):Pa(Db,c)?Eb.c(c,a,b):ed.c(a,b,c)};Va.w=3;function Kd(a){return a}function Ld(a,b,c,d){a=a.b?a.b(b):a.call(null,b);c=Va.c(a,c,d);return a.b?a.b(c):a.call(null,c)}
var Md=function Md(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Md.m();case 1:return Md.b(arguments[0]);case 2:return Md.a(arguments[0],arguments[1]);default:return Md.h(arguments[0],arguments[1],new Bc(c.slice(2),0))}};Md.m=function(){return 0};Md.b=function(a){return a};Md.a=function(a,b){return a+b};Md.h=function(a,b,c){return Va.c(Md,a+b,c)};Md.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return Md.h(b,a,c)};Md.w=2;
var Nd=function Nd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Nd.b(arguments[0]);case 2:return Nd.a(arguments[0],arguments[1]);default:return Nd.h(arguments[0],arguments[1],new Bc(c.slice(2),0))}};Nd.b=function(a){return-a};Nd.a=function(a,b){return a-b};Nd.h=function(a,b,c){return Va.c(Nd,a-b,c)};Nd.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return Nd.h(b,a,c)};Nd.w=2;
var Od=function Od(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Od.m();case 1:return Od.b(arguments[0]);case 2:return Od.a(arguments[0],arguments[1]);default:return Od.h(arguments[0],arguments[1],new Bc(c.slice(2),0))}};Od.m=function(){return 1};Od.b=function(a){return a};Od.a=function(a,b){return a*b};Od.h=function(a,b,c){return Va.c(Od,a*b,c)};Od.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return Od.h(b,a,c)};Od.w=2;({}).yd;
var Pd=function Pd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Pd.b(arguments[0]);case 2:return Pd.a(arguments[0],arguments[1]);default:return Pd.h(arguments[0],arguments[1],new Bc(c.slice(2),0))}};Pd.b=function(a){return 1/a};Pd.a=function(a,b){return a/b};Pd.h=function(a,b,c){return Va.c(Pd,a/b,c)};Pd.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return Pd.h(b,a,c)};Pd.w=2;
var Qd=function Qd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Qd.b(arguments[0]);case 2:return Qd.a(arguments[0],arguments[1]);default:return Qd.h(arguments[0],arguments[1],new Bc(c.slice(2),0))}};Qd.b=function(a){return a};Qd.a=function(a,b){return a>b?a:b};Qd.h=function(a,b,c){return Va.c(Qd,a>b?a:b,c)};Qd.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return Qd.h(b,a,c)};Qd.w=2;
var Rd=function Rd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Rd.b(arguments[0]);case 2:return Rd.a(arguments[0],arguments[1]);default:return Rd.h(arguments[0],arguments[1],new Bc(c.slice(2),0))}};Rd.b=function(a){return a};Rd.a=function(a,b){return a<b?a:b};Rd.h=function(a,b,c){return Va.c(Rd,a<b?a:b,c)};Rd.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return Rd.h(b,a,c)};Rd.w=2;Sd;function Sd(a,b){return(a%b+b)%b}
function Td(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function Ud(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function Vd(a,b){for(var c=b,d=H(a);;)if(d&&0<c)--c,d=J(d);else return d}var A=function A(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return A.m();case 1:return A.b(arguments[0]);default:return A.h(arguments[0],new Bc(c.slice(1),0))}};A.m=function(){return""};
A.b=function(a){return null==a?"":""+a};A.h=function(a,b){for(var c=new qa(""+A(a)),d=b;;)if(x(d))c=c.append(""+A(I(d))),d=J(d);else return c.toString()};A.B=function(a){var b=I(a);a=J(a);return A.h(b,a)};A.w=1;T;Wd;function Pc(a,b){var c;if(sd(b))if(bd(a)&&bd(b)&&N(a)!==N(b))c=!1;else a:{c=H(a);for(var d=H(b);;){if(null==c){c=null==d;break a}if(null!=d&&rc.a(I(c),I(d)))c=J(c),d=J(d);else{c=!1;break a}}}else c=null;return Dd(c)}
function Zc(a){if(H(a)){var b=wc(I(a));for(a=J(a);;){if(null==a)return b;b=xc(b,wc(I(a)));a=J(a)}}else return 0}Xd;Yd;function Zd(a){var b=0;for(a=H(a);;)if(a){var c=I(a),b=(b+(wc(Xd.b?Xd.b(c):Xd.call(null,c))^wc(Yd.b?Yd.b(c):Yd.call(null,c))))%4503599627370496;a=J(a)}else return b}Wd;$d;ae;function ad(a,b,c,d,e){this.v=a;this.first=b;this.Ca=c;this.count=d;this.u=e;this.g=65937646;this.C=8192}k=ad.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};
k.wa=function(){return 1===this.count?null:this.Ca};k.Z=function(){return this.count};k.cb=function(){return this.first};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.ca=function(){return Cb(Dc,this.v)};k.ea=function(a,b){return ed.a(b,this)};k.fa=function(a,b,c){return ed.c(b,c,this)};k.ta=function(){return this.first};k.xa=function(){return 1===this.count?Dc:this.Ca};k.U=function(){return this};
k.R=function(a,b){return new ad(b,this.first,this.Ca,this.count,this.u)};k.X=function(a,b){return new ad(this.v,b,this,this.count+1,null)};function be(a){return null!=a?a.g&33554432||a.td?!0:a.g?!1:Pa(Mb,a):Pa(Mb,a)}ad.prototype[Ta]=function(){return Fc(this)};function ce(a){this.v=a;this.g=65937614;this.C=8192}k=ce.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};k.wa=function(){return null};k.Z=function(){return 0};k.cb=function(){return null};
k.S=function(){return Lc};k.D=function(a,b){return be(b)||sd(b)?null==H(b):!1};k.ca=function(){return this};k.ea=function(a,b){return ed.a(b,this)};k.fa=function(a,b,c){return ed.c(b,c,this)};k.ta=function(){return null};k.xa=function(){return Dc};k.U=function(){return null};k.R=function(a,b){return new ce(b)};k.X=function(a,b){return new ad(this.v,b,null,1,null)};var Dc=new ce(null);ce.prototype[Ta]=function(){return Fc(this)};
function de(a){return(null!=a?a.g&134217728||a.ud||(a.g?0:Pa(Nb,a)):Pa(Nb,a))?Ob(a):Va.c(hd,Dc,a)}var pc=function pc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return pc.h(0<c.length?new Bc(c.slice(0),0):null)};pc.h=function(a){var b;if(a instanceof Bc&&0===a.s)b=a.f;else a:for(b=[];;)if(null!=a)b.push(a.ta(null)),a=a.wa(null);else break a;a=b.length;for(var c=Dc;;)if(0<a){var d=a-1,c=c.X(null,b[a-1]);a=d}else return c};pc.w=0;pc.B=function(a){return pc.h(H(a))};
function ee(a,b,c,d){this.v=a;this.first=b;this.Ca=c;this.u=d;this.g=65929452;this.C=8192}k=ee.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};k.wa=function(){return null==this.Ca?null:H(this.Ca)};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.ca=function(){return Qc(Dc,this.v)};k.ea=function(a,b){return ed.a(b,this)};k.fa=function(a,b,c){return ed.c(b,c,this)};k.ta=function(){return this.first};
k.xa=function(){return null==this.Ca?Dc:this.Ca};k.U=function(){return this};k.R=function(a,b){return new ee(b,this.first,this.Ca,this.u)};k.X=function(a,b){return new ee(null,b,this,this.u)};ee.prototype[Ta]=function(){return Fc(this)};function M(a,b){var c=null==b;return(c?c:null!=b&&(b.g&64||b.F))?new ee(null,a,b,null):new ee(null,a,H(b),null)}
function fe(a,b){if(a.Ia===b.Ia)return 0;var c=Oa(a.Ba);if(x(c?b.Ba:c))return-1;if(x(a.Ba)){if(Oa(b.Ba))return 1;c=sa(a.Ba,b.Ba);return 0===c?sa(a.name,b.name):c}return sa(a.name,b.name)}function y(a,b,c,d){this.Ba=a;this.name=b;this.Ia=c;this.nb=d;this.g=2153775105;this.C=4096}k=y.prototype;k.toString=function(){return[A(":"),A(this.Ia)].join("")};k.equiv=function(a){return this.D(null,a)};k.D=function(a,b){return b instanceof y?this.Ia===b.Ia:!1};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return C.a(c,this);case 3:return C.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return C.a(c,this)};a.c=function(a,c,d){return C.c(c,this,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ua(b)))};k.b=function(a){return C.a(a,this)};k.a=function(a,b){return C.c(a,this,b)};
k.S=function(){var a=this.nb;return null!=a?a:this.nb=a=xc(oc(this.name),vc(this.Ba))+2654435769|0};k.Jb=function(){return this.name};k.Kb=function(){return this.Ba};k.L=function(a,b){return Pb(b,[A(":"),A(this.Ia)].join(""))};function ge(a,b){return a===b?!0:a instanceof y&&b instanceof y?a.Ia===b.Ia:!1}
var he=function he(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return he.b(arguments[0]);case 2:return he.a(arguments[0],arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
he.b=function(a){if(a instanceof y)return a;if(a instanceof qc){var b;if(null!=a&&(a.C&4096||a.Rc))b=a.Kb(null);else throw Error([A("Doesn't support namespace: "),A(a)].join(""));return new y(b,Wd.b?Wd.b(a):Wd.call(null,a),a.Va,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new y(b[0],b[1],a,null):new y(null,b[0],a,null)):null};he.a=function(a,b){return new y(a,b,[A(x(a)?[A(a),A("/")].join(""):null),A(b)].join(""),null)};he.w=2;
function ie(a,b,c,d){this.v=a;this.xb=b;this.H=c;this.u=d;this.g=32374988;this.C=0}k=ie.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};function je(a){null!=a.xb&&(a.H=a.xb.m?a.xb.m():a.xb.call(null),a.xb=null);return a.H}k.P=function(){return this.v};k.wa=function(){Kb(this);return null==this.H?null:J(this.H)};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.ca=function(){return Qc(Dc,this.v)};
k.ea=function(a,b){return ed.a(b,this)};k.fa=function(a,b,c){return ed.c(b,c,this)};k.ta=function(){Kb(this);return null==this.H?null:I(this.H)};k.xa=function(){Kb(this);return null!=this.H?Cc(this.H):Dc};k.U=function(){je(this);if(null==this.H)return null;for(var a=this.H;;)if(a instanceof ie)a=je(a);else return this.H=a,H(this.H)};k.R=function(a,b){return new ie(b,this.xb,this.H,this.u)};k.X=function(a,b){return M(b,this)};ie.prototype[Ta]=function(){return Fc(this)};ke;
function le(a,b){this.K=a;this.end=b;this.g=2;this.C=0}le.prototype.add=function(a){this.K[this.end]=a;return this.end+=1};le.prototype.W=function(){var a=new ke(this.K,0,this.end);this.K=null;return a};le.prototype.Z=function(){return this.end};function me(a){return new le(Array(a),0)}function ke(a,b,c){this.f=a;this.ua=b;this.end=c;this.g=524306;this.C=0}k=ke.prototype;k.Z=function(){return this.end-this.ua};k.ba=function(a,b){return this.f[this.ua+b]};
k.Ea=function(a,b,c){return 0<=b&&b<this.end-this.ua?this.f[this.ua+b]:c};k.qc=function(){if(this.ua===this.end)throw Error("-drop-first of empty chunk");return new ke(this.f,this.ua+1,this.end)};k.ea=function(a,b){return Yc(this.f,b,this.f[this.ua],this.ua+1)};k.fa=function(a,b,c){return Yc(this.f,b,c,this.ua)};function vd(a,b,c,d){this.W=a;this.Sa=b;this.v=c;this.u=d;this.g=31850732;this.C=1536}k=vd.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};
k.P=function(){return this.v};k.wa=function(){if(1<Za(this.W))return new vd($b(this.W),this.Sa,this.v,null);var a=Kb(this.Sa);return null==a?null:a};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.ca=function(){return Qc(Dc,this.v)};k.ta=function(){return db.a(this.W,0)};k.xa=function(){return 1<Za(this.W)?new vd($b(this.W),this.Sa,this.v,null):null==this.Sa?Dc:this.Sa};k.U=function(){return this};k.ic=function(){return this.W};
k.jc=function(){return null==this.Sa?Dc:this.Sa};k.R=function(a,b){return new vd(this.W,this.Sa,b,this.u)};k.X=function(a,b){return M(b,this)};k.hc=function(){return null==this.Sa?null:this.Sa};vd.prototype[Ta]=function(){return Fc(this)};function ne(a,b){return 0===Za(a)?b:new vd(a,b,null,null)}function oe(a,b){a.add(b)}function $d(a){return ac(a)}function ae(a){return bc(a)}function Id(a){for(var b=[];;)if(H(a))b.push(I(a)),a=J(a);else return b}
function pe(a){if("number"===typeof a)a:{var b=Array(a);if(Cd(null))for(var c=0,d=H(null);;)if(d&&c<a)b[c]=I(d),c+=1,d=J(d);else{a=b;break a}else{for(c=0;;)if(c<a)b[c]=null,c+=1;else break;a=b}}else a=Ka.b(a);return a}function qe(a,b){if(bd(a))return N(a);for(var c=a,d=b,e=0;;)if(0<d&&H(c))c=J(c),--d,e+=1;else return e}
var re=function re(b){return null==b?null:null==J(b)?H(I(b)):M(I(b),re(J(b)))},se=function se(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return se.m();case 1:return se.b(arguments[0]);case 2:return se.a(arguments[0],arguments[1]);default:return se.h(arguments[0],arguments[1],new Bc(c.slice(2),0))}};se.m=function(){return new ie(null,function(){return null},null,null)};se.b=function(a){return new ie(null,function(){return a},null,null)};
se.a=function(a,b){return new ie(null,function(){var c=H(a);return c?xd(c)?ne(ac(c),se.a(bc(c),b)):M(I(c),se.a(Cc(c),b)):b},null,null)};se.h=function(a,b,c){return function e(a,b){return new ie(null,function(){var c=H(a);return c?xd(c)?ne(ac(c),e(bc(c),b)):M(I(c),e(Cc(c),b)):x(b)?e(I(b),J(b)):null},null,null)}(se.a(a,b),c)};se.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return se.h(b,a,c)};se.w=2;function te(a){return Vb(a)}
var ue=function ue(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return ue.m();case 1:return ue.b(arguments[0]);case 2:return ue.a(arguments[0],arguments[1]);default:return ue.h(arguments[0],arguments[1],new Bc(c.slice(2),0))}};ue.m=function(){return Tb(id)};ue.b=function(a){return a};ue.a=function(a,b){return Ub(a,b)};ue.h=function(a,b,c){for(;;)if(a=Ub(a,b),x(c))b=I(c),c=J(c);else return a};
ue.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return ue.h(b,a,c)};ue.w=2;function ve(a,b,c){return Wb(a,b,c)}
function we(a,b,c){var d=H(c);if(0===b)return a.m?a.m():a.call(null);c=fb(d);var e=gb(d);if(1===b)return a.b?a.b(c):a.b?a.b(c):a.call(null,c);var d=fb(e),f=gb(e);if(2===b)return a.a?a.a(c,d):a.a?a.a(c,d):a.call(null,c,d);var e=fb(f),g=gb(f);if(3===b)return a.c?a.c(c,d,e):a.c?a.c(c,d,e):a.call(null,c,d,e);var f=fb(g),h=gb(g);if(4===b)return a.l?a.l(c,d,e,f):a.l?a.l(c,d,e,f):a.call(null,c,d,e,f);var g=fb(h),l=gb(h);if(5===b)return a.A?a.A(c,d,e,f,g):a.A?a.A(c,d,e,f,g):a.call(null,c,d,e,f,g);var h=fb(l),
m=gb(l);if(6===b)return a.T?a.T(c,d,e,f,g,h):a.T?a.T(c,d,e,f,g,h):a.call(null,c,d,e,f,g,h);var l=fb(m),n=gb(m);if(7===b)return a.aa?a.aa(c,d,e,f,g,h,l):a.aa?a.aa(c,d,e,f,g,h,l):a.call(null,c,d,e,f,g,h,l);var m=fb(n),p=gb(n);if(8===b)return a.ra?a.ra(c,d,e,f,g,h,l,m):a.ra?a.ra(c,d,e,f,g,h,l,m):a.call(null,c,d,e,f,g,h,l,m);var n=fb(p),q=gb(p);if(9===b)return a.sa?a.sa(c,d,e,f,g,h,l,m,n):a.sa?a.sa(c,d,e,f,g,h,l,m,n):a.call(null,c,d,e,f,g,h,l,m,n);var p=fb(q),r=gb(q);if(10===b)return a.ga?a.ga(c,d,e,
f,g,h,l,m,n,p):a.ga?a.ga(c,d,e,f,g,h,l,m,n,p):a.call(null,c,d,e,f,g,h,l,m,n,p);var q=fb(r),u=gb(r);if(11===b)return a.ha?a.ha(c,d,e,f,g,h,l,m,n,p,q):a.ha?a.ha(c,d,e,f,g,h,l,m,n,p,q):a.call(null,c,d,e,f,g,h,l,m,n,p,q);var r=fb(u),w=gb(u);if(12===b)return a.ia?a.ia(c,d,e,f,g,h,l,m,n,p,q,r):a.ia?a.ia(c,d,e,f,g,h,l,m,n,p,q,r):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r);var u=fb(w),z=gb(w);if(13===b)return a.ja?a.ja(c,d,e,f,g,h,l,m,n,p,q,r,u):a.ja?a.ja(c,d,e,f,g,h,l,m,n,p,q,r,u):a.call(null,c,d,e,f,g,h,l,m,n,
p,q,r,u);var w=fb(z),D=gb(z);if(14===b)return a.ka?a.ka(c,d,e,f,g,h,l,m,n,p,q,r,u,w):a.ka?a.ka(c,d,e,f,g,h,l,m,n,p,q,r,u,w):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,u,w);var z=fb(D),F=gb(D);if(15===b)return a.la?a.la(c,d,e,f,g,h,l,m,n,p,q,r,u,w,z):a.la?a.la(c,d,e,f,g,h,l,m,n,p,q,r,u,w,z):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z);var D=fb(F),L=gb(F);if(16===b)return a.ma?a.ma(c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D):a.ma?a.ma(c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D);var F=
fb(L),O=gb(L);if(17===b)return a.na?a.na(c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F):a.na?a.na(c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F);var L=fb(O),Aa=gb(O);if(18===b)return a.oa?a.oa(c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F,L):a.oa?a.oa(c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F,L):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F,L);O=fb(Aa);Aa=gb(Aa);if(19===b)return a.pa?a.pa(c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F,L,O):a.pa?a.pa(c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F,L,O):a.call(null,c,d,e,
f,g,h,l,m,n,p,q,r,u,w,z,D,F,L,O);var E=fb(Aa);gb(Aa);if(20===b)return a.qa?a.qa(c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F,L,O,E):a.qa?a.qa(c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F,L,O,E):a.call(null,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F,L,O,E);throw Error("Only up to 20 arguments supported on functions");}
var B=function B(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return B.a(arguments[0],arguments[1]);case 3:return B.c(arguments[0],arguments[1],arguments[2]);case 4:return B.l(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return B.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return B.h(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new Bc(c.slice(5),0))}};
B.a=function(a,b){var c=a.w;if(a.B){var d=qe(b,c+1);return d<=c?we(a,d,b):a.B(b)}return a.apply(a,Id(b))};B.c=function(a,b,c){b=M(b,c);c=a.w;if(a.B){var d=qe(b,c+1);return d<=c?we(a,d,b):a.B(b)}return a.apply(a,Id(b))};B.l=function(a,b,c,d){b=M(b,M(c,d));c=a.w;return a.B?(d=qe(b,c+1),d<=c?we(a,d,b):a.B(b)):a.apply(a,Id(b))};B.A=function(a,b,c,d,e){b=M(b,M(c,M(d,e)));c=a.w;return a.B?(d=qe(b,c+1),d<=c?we(a,d,b):a.B(b)):a.apply(a,Id(b))};
B.h=function(a,b,c,d,e,f){b=M(b,M(c,M(d,M(e,re(f)))));c=a.w;return a.B?(d=qe(b,c+1),d<=c?we(a,d,b):a.B(b)):a.apply(a,Id(b))};B.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),e=J(d),d=I(e),f=J(e),e=I(f),f=J(f);return B.h(b,a,c,d,e,f)};B.w=5;function xe(a){return H(a)?a:null}
var ye=function ye(){"undefined"===typeof va&&(va=function(b,c){this.hd=b;this.gd=c;this.g=393216;this.C=0},va.prototype.R=function(b,c){return new va(this.hd,c)},va.prototype.P=function(){return this.gd},va.prototype.ya=function(){return!1},va.prototype.next=function(){return Error("No such element")},va.prototype.remove=function(){return Error("Unsupported operation")},va.cc=function(){return new R(null,2,5,S,[Qc(ze,new v(null,1,[Ae,pc(Be,pc(id))],null)),Ce],null)},va.sb=!0,va.Za="cljs.core/t_cljs$core23150",
va.Ob=function(b,c){return Pb(c,"cljs.core/t_cljs$core23150")});return new va(ye,W)};De;function De(a,b,c,d){this.Ab=a;this.first=b;this.Ca=c;this.v=d;this.g=31719628;this.C=0}k=De.prototype;k.R=function(a,b){return new De(this.Ab,this.first,this.Ca,b)};k.X=function(a,b){return M(b,Kb(this))};k.ca=function(){return Dc};k.D=function(a,b){return null!=Kb(this)?Pc(this,b):sd(b)&&null==H(b)};k.S=function(){return Kc(this)};k.U=function(){null!=this.Ab&&this.Ab.step(this);return null==this.Ca?null:this};
k.ta=function(){null!=this.Ab&&Kb(this);return null==this.Ca?null:this.first};k.xa=function(){null!=this.Ab&&Kb(this);return null==this.Ca?Dc:this.Ca};k.wa=function(){null!=this.Ab&&Kb(this);return null==this.Ca?null:Kb(this.Ca)};De.prototype[Ta]=function(){return Fc(this)};function Ee(a,b){for(;;){if(null==H(b))return!0;var c;c=I(b);c=a.b?a.b(c):a.call(null,c);if(x(c)){c=a;var d=J(b);a=c;b=d}else return!1}}
function Fe(a,b){for(;;)if(H(b)){var c;c=I(b);c=a.b?a.b(c):a.call(null,c);if(x(c))return c;c=a;var d=J(b);a=c;b=d}else return null}
function Ge(a){return function(){function b(b,c){return Oa(a.a?a.a(b,c):a.call(null,b,c))}function c(b){return Oa(a.b?a.b(b):a.call(null,b))}function d(){return Oa(a.m?a.m():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new Bc(g,0)}return c.call(this,a,d,f)}function c(b,d,e){return Oa(B.l(a,b,d,e))}b.w=2;b.B=function(a){var b=I(a);a=J(a);var d=I(a);a=Cc(a);return c(b,d,a)};b.h=
c;return b}(),e=function(a,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var m=null;if(2<arguments.length){for(var m=0,n=Array(arguments.length-2);m<n.length;)n[m]=arguments[m+2],++m;m=new Bc(n,0)}return f.h(a,e,m)}throw Error("Invalid arity: "+arguments.length);};e.w=2;e.B=f.B;e.m=d;e.b=c;e.a=b;e.h=f.h;return e}()}
function He(a){return function(){function b(b){if(0<arguments.length)for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;return a}b.w=0;b.B=function(b){H(b);return a};b.h=function(){return a};return b}()}
var Ie=function Ie(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Ie.m();case 1:return Ie.b(arguments[0]);case 2:return Ie.a(arguments[0],arguments[1]);case 3:return Ie.c(arguments[0],arguments[1],arguments[2]);default:return Ie.h(arguments[0],arguments[1],arguments[2],new Bc(c.slice(3),0))}};Ie.m=function(){return Kd};Ie.b=function(a){return a};
Ie.a=function(a,b){return function(){function c(c,d,e){c=b.c?b.c(c,d,e):b.call(null,c,d,e);return a.b?a.b(c):a.call(null,c)}function d(c,d){var e=b.a?b.a(c,d):b.call(null,c,d);return a.b?a.b(e):a.call(null,e)}function e(c){c=b.b?b.b(c):b.call(null,c);return a.b?a.b(c):a.call(null,c)}function f(){var c=b.m?b.m():b.call(null);return a.b?a.b(c):a.call(null,c)}var g=null,h=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,l=Array(arguments.length-3);g<l.length;)l[g]=arguments[g+
3],++g;g=new Bc(l,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){c=B.A(b,c,e,f,g);return a.b?a.b(c):a.call(null,c)}c.w=3;c.B=function(a){var b=I(a);a=J(a);var c=I(a);a=J(a);var e=I(a);a=Cc(a);return d(b,c,e,a)};c.h=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+
3],++q;q=new Bc(r,0)}return h.h(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.B=h.B;g.m=f;g.b=e;g.a=d;g.c=c;g.h=h.h;return g}()};
Ie.c=function(a,b,c){return function(){function d(d,e,f){d=c.c?c.c(d,e,f):c.call(null,d,e,f);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}function e(d,e){var f;f=c.a?c.a(d,e):c.call(null,d,e);f=b.b?b.b(f):b.call(null,f);return a.b?a.b(f):a.call(null,f)}function f(d){d=c.b?c.b(d):c.call(null,d);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}function g(){var d;d=c.m?c.m():c.call(null);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}var h=null,l=function(){function d(a,
b,c,f){var g=null;if(3<arguments.length){for(var g=0,l=Array(arguments.length-3);g<l.length;)l[g]=arguments[g+3],++g;g=new Bc(l,0)}return e.call(this,a,b,c,g)}function e(d,f,g,l){d=B.A(c,d,f,g,l);d=b.b?b.b(d):b.call(null,d);return a.b?a.b(d):a.call(null,d)}d.w=3;d.B=function(a){var b=I(a);a=J(a);var c=I(a);a=J(a);var d=I(a);a=Cc(a);return e(b,c,d,a)};d.h=e;return d}(),h=function(a,b,c,h){switch(arguments.length){case 0:return g.call(this);case 1:return f.call(this,a);case 2:return e.call(this,a,b);
case 3:return d.call(this,a,b,c);default:var r=null;if(3<arguments.length){for(var r=0,u=Array(arguments.length-3);r<u.length;)u[r]=arguments[r+3],++r;r=new Bc(u,0)}return l.h(a,b,c,r)}throw Error("Invalid arity: "+arguments.length);};h.w=3;h.B=l.B;h.m=g;h.b=f;h.a=e;h.c=d;h.h=l.h;return h}()};
Ie.h=function(a,b,c,d){return function(a){return function(){function b(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new Bc(e,0)}return c.call(this,d)}function c(b){b=B.a(I(a),b);for(var d=J(a);;)if(d)b=I(d).call(null,b),d=J(d);else return b}b.w=0;b.B=function(a){a=H(a);return c(a)};b.h=c;return b}()}(de(M(a,M(b,M(c,d)))))};Ie.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),d=J(d);return Ie.h(b,a,c,d)};Ie.w=3;
function Je(a,b){return function(){function c(c,d,e){return a.l?a.l(b,c,d,e):a.call(null,b,c,d,e)}function d(c,d){return a.c?a.c(b,c,d):a.call(null,b,c,d)}function e(c){return a.a?a.a(b,c):a.call(null,b,c)}function f(){return a.b?a.b(b):a.call(null,b)}var g=null,h=function(){function c(a,b,e,f){var g=null;if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;g=new Bc(h,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){return B.h(a,b,c,e,f,G([g],0))}c.w=
3;c.B=function(a){var b=I(a);a=J(a);var c=I(a);a=J(a);var e=I(a);a=Cc(a);return d(b,c,e,a)};c.h=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+3],++q;q=new Bc(r,0)}return h.h(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.B=h.B;g.m=f;g.b=
e;g.a=d;g.c=c;g.h=h.h;return g}()}Ke;function Le(a,b){return function d(b,f){return new ie(null,function(){var g=H(f);if(g){if(xd(g)){for(var h=ac(g),l=N(h),m=me(l),n=0;;)if(n<l)oe(m,function(){var d=b+n,f=db.a(h,n);return a.a?a.a(d,f):a.call(null,d,f)}()),n+=1;else break;return ne(m.W(),d(b+l,bc(g)))}return M(function(){var d=I(g);return a.a?a.a(b,d):a.call(null,b,d)}(),d(b+1,Cc(g)))}return null},null,null)}(0,b)}function Me(a,b,c,d){this.state=a;this.v=b;this.dc=d;this.C=16386;this.g=6455296}
k=Me.prototype;k.equiv=function(a){return this.D(null,a)};k.D=function(a,b){return this===b};k.Eb=function(){return this.state};k.P=function(){return this.v};k.vc=function(a,b,c){a=H(this.dc);for(var d=null,e=0,f=0;;)if(f<e){var g=d.ba(null,f),h=P(g,0),g=P(g,1);g.l?g.l(h,this,b,c):g.call(null,h,this,b,c);f+=1}else if(a=H(a))xd(a)?(d=ac(a),a=bc(a),h=d,e=N(d),d=h):(d=I(a),h=P(d,0),g=P(d,1),g.l?g.l(h,this,b,c):g.call(null,h,this,b,c),a=J(a),d=null,e=0),f=0;else return null};
k.uc=function(a,b,c){this.dc=Q.c(this.dc,b,c);return this};k.S=function(){return this[da]||(this[da]=++ea)};var X=function X(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return X.b(arguments[0]);default:return X.h(arguments[0],new Bc(c.slice(1),0))}};X.b=function(a){return new Me(a,null,0,null)};X.h=function(a,b){var c=null!=b&&(b.g&64||b.F)?B.a(Oc,b):b,d=C.a(c,Ha);C.a(c,Ne);return new Me(a,d,0,null)};
X.B=function(a){var b=I(a);a=J(a);return X.h(b,a)};X.w=1;Oe;function Pe(a,b){if(a instanceof Me){var c=a.state;a.state=b;null!=a.dc&&Rb(a,c,b);return b}return fc(a,b)}
var Qe=function Qe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Qe.a(arguments[0],arguments[1]);case 3:return Qe.c(arguments[0],arguments[1],arguments[2]);case 4:return Qe.l(arguments[0],arguments[1],arguments[2],arguments[3]);default:return Qe.h(arguments[0],arguments[1],arguments[2],arguments[3],new Bc(c.slice(4),0))}};Qe.a=function(a,b){var c;a instanceof Me?(c=a.state,c=b.b?b.b(c):b.call(null,c),c=Pe(a,c)):c=gc.a(a,b);return c};
Qe.c=function(a,b,c){if(a instanceof Me){var d=a.state;b=b.a?b.a(d,c):b.call(null,d,c);a=Pe(a,b)}else a=gc.c(a,b,c);return a};Qe.l=function(a,b,c,d){if(a instanceof Me){var e=a.state;b=b.c?b.c(e,c,d):b.call(null,e,c,d);a=Pe(a,b)}else a=gc.l(a,b,c,d);return a};Qe.h=function(a,b,c,d,e){return a instanceof Me?Pe(a,B.A(b,a.state,c,d,e)):gc.A(a,b,c,d,e)};Qe.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),e=J(d),d=I(e),e=J(e);return Qe.h(b,a,c,d,e)};Qe.w=4;
function Re(a){this.state=a;this.g=32768;this.C=0}Re.prototype.Eb=function(){return this.state};function Ke(a){return new Re(a)}
var T=function T(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return T.b(arguments[0]);case 2:return T.a(arguments[0],arguments[1]);case 3:return T.c(arguments[0],arguments[1],arguments[2]);case 4:return T.l(arguments[0],arguments[1],arguments[2],arguments[3]);default:return T.h(arguments[0],arguments[1],arguments[2],arguments[3],new Bc(c.slice(4),0))}};
T.b=function(a){return function(b){return function(){function c(c,d){var e=a.b?a.b(d):a.call(null,d);return b.a?b.a(c,e):b.call(null,c,e)}function d(a){return b.b?b.b(a):b.call(null,a)}function e(){return b.m?b.m():b.call(null)}var f=null,g=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,g=Array(arguments.length-2);f<g.length;)g[f]=arguments[f+2],++f;f=new Bc(g,0)}return d.call(this,a,b,f)}function d(c,e,f){e=B.c(a,e,f);return b.a?b.a(c,e):b.call(null,c,e)}c.w=2;c.B=function(a){var b=
I(a);a=J(a);var c=I(a);a=Cc(a);return d(b,c,a)};c.h=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var n=null;if(2<arguments.length){for(var n=0,p=Array(arguments.length-2);n<p.length;)p[n]=arguments[n+2],++n;n=new Bc(p,0)}return g.h(a,b,n)}throw Error("Invalid arity: "+arguments.length);};f.w=2;f.B=g.B;f.m=e;f.b=d;f.a=c;f.h=g.h;return f}()}};
T.a=function(a,b){return new ie(null,function(){var c=H(b);if(c){if(xd(c)){for(var d=ac(c),e=N(d),f=me(e),g=0;;)if(g<e)oe(f,function(){var b=db.a(d,g);return a.b?a.b(b):a.call(null,b)}()),g+=1;else break;return ne(f.W(),T.a(a,bc(c)))}return M(function(){var b=I(c);return a.b?a.b(b):a.call(null,b)}(),T.a(a,Cc(c)))}return null},null,null)};
T.c=function(a,b,c){return new ie(null,function(){var d=H(b),e=H(c);if(d&&e){var f=M,g;g=I(d);var h=I(e);g=a.a?a.a(g,h):a.call(null,g,h);d=f(g,T.c(a,Cc(d),Cc(e)))}else d=null;return d},null,null)};T.l=function(a,b,c,d){return new ie(null,function(){var e=H(b),f=H(c),g=H(d);if(e&&f&&g){var h=M,l;l=I(e);var m=I(f),n=I(g);l=a.c?a.c(l,m,n):a.call(null,l,m,n);e=h(l,T.l(a,Cc(e),Cc(f),Cc(g)))}else e=null;return e},null,null)};
T.h=function(a,b,c,d,e){var f=function h(a){return new ie(null,function(){var b=T.a(H,a);return Ee(Kd,b)?M(T.a(I,b),h(T.a(Cc,b))):null},null,null)};return T.a(function(){return function(b){return B.a(a,b)}}(f),f(hd.h(e,d,G([c,b],0))))};T.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),e=J(d),d=I(e),e=J(e);return T.h(b,a,c,d,e)};T.w=4;function Se(a,b){return new ie(null,function(){if(0<a){var c=H(b);return c?M(I(c),Se(a-1,Cc(c))):null}return null},null,null)}
function Te(a,b){return new ie(null,function(c){return function(){return c(a,b)}}(function(a,b){for(;;){var e=H(b);if(0<a&&e){var f=a-1,e=Cc(e);a=f;b=e}else return e}}),null,null)}function Ue(a){return new ie(null,function(){return M(a,Ue(a))},null,null)}function Ve(a){return new ie(null,function(){return M(a.m?a.m():a.call(null),Ve(a))},null,null)}
var We=function We(b,c){return M(c,new ie(null,function(){return We(b,b.b?b.b(c):b.call(null,c))},null,null))},Xe=function Xe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Xe.a(arguments[0],arguments[1]);default:return Xe.h(arguments[0],arguments[1],new Bc(c.slice(2),0))}};Xe.a=function(a,b){return new ie(null,function(){var c=H(a),d=H(b);return c&&d?M(I(c),M(I(d),Xe.a(Cc(c),Cc(d)))):null},null,null)};
Xe.h=function(a,b,c){return new ie(null,function(){var d=T.a(H,hd.h(c,b,G([a],0)));return Ee(Kd,d)?se.a(T.a(I,d),B.a(Xe,T.a(Cc,d))):null},null,null)};Xe.B=function(a){var b=I(a),c=J(a);a=I(c);c=J(c);return Xe.h(b,a,c)};Xe.w=2;function Ye(a){return Te(1,Xe.a(Ue("L"),a))}Ze;
function $e(a,b){return new ie(null,function(){var c=H(b);if(c){if(xd(c)){for(var d=ac(c),e=N(d),f=me(e),g=0;;)if(g<e){var h;h=db.a(d,g);h=a.b?a.b(h):a.call(null,h);x(h)&&(h=db.a(d,g),f.add(h));g+=1}else break;return ne(f.W(),$e(a,bc(c)))}d=I(c);c=Cc(c);return x(a.b?a.b(d):a.call(null,d))?M(d,$e(a,c)):$e(a,c)}return null},null,null)}function af(a,b){return $e(Ge(a),b)}
function bf(a){return function c(a){return new ie(null,function(){var e=M,f;x(Cd.b?Cd.b(a):Cd.call(null,a))?(f=G([H.b?H.b(a):H.call(null,a)],0),f=B.a(se,B.c(T,c,f))):f=null;return e(a,f)},null,null)}(a)}var cf=function cf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return cf.a(arguments[0],arguments[1]);case 3:return cf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
cf.a=function(a,b){return null!=a?null!=a&&(a.C&4||a.Lc)?Qc(te(Va.c(Ub,Tb(a),b)),pd(a)):Va.c(bb,a,b):Va.c(hd,Dc,b)};cf.c=function(a,b,c){return null!=a&&(a.C&4||a.Lc)?Qc(te(Ld(b,ue,Tb(a),c)),pd(a)):Ld(b,hd,a,c)};cf.w=3;function df(a,b){var c;a:{c=Bd;for(var d=a,e=H(b);;)if(e)if(null!=d?d.g&256||d.sc||(d.g?0:Pa(ib,d)):Pa(ib,d)){d=C.c(d,I(e),c);if(c===d){c=null;break a}e=J(e)}else{c=null;break a}else{c=d;break a}}return c}
var ef=function ef(b,c,d){var e=P(c,0);c=Vd(c,1);return x(c)?Q.c(b,e,ef(C.a(b,e),c,d)):Q.c(b,e,d)},ff=function ff(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return ff.c(arguments[0],arguments[1],arguments[2]);case 4:return ff.l(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return ff.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);case 6:return ff.T(arguments[0],arguments[1],arguments[2],arguments[3],
arguments[4],arguments[5]);default:return ff.h(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],new Bc(c.slice(6),0))}};ff.c=function(a,b,c){var d=P(b,0);b=Vd(b,1);return x(b)?Q.c(a,d,ff.c(C.a(a,d),b,c)):Q.c(a,d,function(){var b=C.a(a,d);return c.b?c.b(b):c.call(null,b)}())};ff.l=function(a,b,c,d){var e=P(b,0);b=Vd(b,1);return x(b)?Q.c(a,e,ff.l(C.a(a,e),b,c,d)):Q.c(a,e,function(){var b=C.a(a,e);return c.a?c.a(b,d):c.call(null,b,d)}())};
ff.A=function(a,b,c,d,e){var f=P(b,0);b=Vd(b,1);return x(b)?Q.c(a,f,ff.A(C.a(a,f),b,c,d,e)):Q.c(a,f,function(){var b=C.a(a,f);return c.c?c.c(b,d,e):c.call(null,b,d,e)}())};ff.T=function(a,b,c,d,e,f){var g=P(b,0);b=Vd(b,1);return x(b)?Q.c(a,g,ff.T(C.a(a,g),b,c,d,e,f)):Q.c(a,g,function(){var b=C.a(a,g);return c.l?c.l(b,d,e,f):c.call(null,b,d,e,f)}())};ff.h=function(a,b,c,d,e,f,g){var h=P(b,0);b=Vd(b,1);return x(b)?Q.c(a,h,B.h(ff,C.a(a,h),b,c,d,G([e,f,g],0))):Q.c(a,h,B.h(c,C.a(a,h),d,e,f,G([g],0)))};
ff.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),e=J(d),d=I(e),f=J(e),e=I(f),g=J(f),f=I(g),g=J(g);return ff.h(b,a,c,d,e,f,g)};ff.w=6;
var gf=function gf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return gf.c(arguments[0],arguments[1],arguments[2]);case 4:return gf.l(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return gf.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);case 6:return gf.T(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);default:return gf.h(arguments[0],arguments[1],arguments[2],arguments[3],
arguments[4],arguments[5],new Bc(c.slice(6),0))}};gf.c=function(a,b,c){return Q.c(a,b,function(){var d=C.a(a,b);return c.b?c.b(d):c.call(null,d)}())};gf.l=function(a,b,c,d){return Q.c(a,b,function(){var e=C.a(a,b);return c.a?c.a(e,d):c.call(null,e,d)}())};gf.A=function(a,b,c,d,e){return Q.c(a,b,function(){var f=C.a(a,b);return c.c?c.c(f,d,e):c.call(null,f,d,e)}())};gf.T=function(a,b,c,d,e,f){return Q.c(a,b,function(){var g=C.a(a,b);return c.l?c.l(g,d,e,f):c.call(null,g,d,e,f)}())};
gf.h=function(a,b,c,d,e,f,g){return Q.c(a,b,B.h(c,C.a(a,b),d,e,f,G([g],0)))};gf.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),e=J(d),d=I(e),f=J(e),e=I(f),g=J(f),f=I(g),g=J(g);return gf.h(b,a,c,d,e,f,g)};gf.w=6;function hf(a,b){this.V=a;this.f=b}function jf(a){return new hf(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function kf(a){a=a.o;return 32>a?0:a-1>>>5<<5}
function lf(a,b,c){for(;;){if(0===b)return c;var d=jf(a);d.f[0]=c;c=d;b-=5}}var mf=function mf(b,c,d,e){var f=new hf(d.V,Ua(d.f)),g=b.o-1>>>c&31;5===c?f.f[g]=e:(d=d.f[g],b=null!=d?mf(b,c-5,d,e):lf(null,c-5,e),f.f[g]=b);return f};function of(a,b){throw Error([A("No item "),A(a),A(" in vector of length "),A(b)].join(""));}function pf(a,b){if(b>=kf(a))return a.O;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.f[b>>>d&31],d=e;else return c.f}function qf(a,b){return 0<=b&&b<a.o?pf(a,b):of(b,a.o)}
var rf=function rf(b,c,d,e,f){var g=new hf(d.V,Ua(d.f));if(0===c)g.f[e&31]=f;else{var h=e>>>c&31;b=rf(b,c-5,d.f[h],e,f);g.f[h]=b}return g};function sf(a,b,c,d,e,f){this.s=a;this.fc=b;this.f=c;this.Na=d;this.start=e;this.end=f}sf.prototype.ya=function(){return this.s<this.end};sf.prototype.next=function(){32===this.s-this.fc&&(this.f=pf(this.Na,this.s),this.fc+=32);var a=this.f[this.s&31];this.s+=1;return a};tf;uf;vf;K;wf;xf;yf;
function R(a,b,c,d,e,f){this.v=a;this.o=b;this.shift=c;this.root=d;this.O=e;this.u=f;this.g=167668511;this.C=8196}k=R.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.N=function(a,b){return lb.c(this,b,null)};k.I=function(a,b,c){return"number"===typeof b?db.c(this,b,c):c};
k.Gb=function(a,b,c){a=0;for(var d=c;;)if(a<this.o){var e=pf(this,a);c=e.length;a:for(var f=0;;)if(f<c){var g=f+a,h=e[f],d=b.c?b.c(d,g,h):b.call(null,d,g,h);if(Tc(d)){e=d;break a}f+=1}else{e=d;break a}if(Tc(e))return K.b?K.b(e):K.call(null,e);a+=c;d=e}else return d};k.ba=function(a,b){return qf(this,b)[b&31]};k.Ea=function(a,b,c){return 0<=b&&b<this.o?pf(this,b)[b&31]:c};
k.eb=function(a,b,c){if(0<=b&&b<this.o)return kf(this)<=b?(a=Ua(this.O),a[b&31]=c,new R(this.v,this.o,this.shift,this.root,a,null)):new R(this.v,this.o,this.shift,rf(this,this.shift,this.root,b,c),this.O,null);if(b===this.o)return bb(this,c);throw Error([A("Index "),A(b),A(" out of bounds  [0,"),A(this.o),A("]")].join(""));};k.Ha=function(){var a=this.o;return new sf(0,0,0<N(this)?pf(this,0):null,this,0,a)};k.P=function(){return this.v};k.Z=function(){return this.o};
k.Hb=function(){return db.a(this,0)};k.Ib=function(){return db.a(this,1)};k.cb=function(){return 0<this.o?db.a(this,this.o-1):null};k.Xb=function(){return 0<this.o?new $c(this,this.o-1,null):null};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){if(b instanceof R)if(this.o===N(b))for(var c=hc(this),d=hc(b);;)if(x(c.ya())){var e=c.next(),f=d.next();if(!rc.a(e,f))return!1}else return!0;else return!1;else return Pc(this,b)};
k.pb=function(){return new vf(this.o,this.shift,tf.b?tf.b(this.root):tf.call(null,this.root),uf.b?uf.b(this.O):uf.call(null,this.O))};k.ca=function(){return Qc(id,this.v)};k.ea=function(a,b){return Uc(this,b)};k.fa=function(a,b,c){a=0;for(var d=c;;)if(a<this.o){var e=pf(this,a);c=e.length;a:for(var f=0;;)if(f<c){var g=e[f],d=b.a?b.a(d,g):b.call(null,d,g);if(Tc(d)){e=d;break a}f+=1}else{e=d;break a}if(Tc(e))return K.b?K.b(e):K.call(null,e);a+=c;d=e}else return d};
k.Ra=function(a,b,c){if("number"===typeof b)return xb(this,b,c);throw Error("Vector's key for assoc must be a number.");};k.U=function(){if(0===this.o)return null;if(32>=this.o)return new Bc(this.O,0);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.f[0];else{a=a.f;break a}}return yf.l?yf.l(this,a,0,0):yf.call(null,this,a,0,0)};k.R=function(a,b){return new R(b,this.o,this.shift,this.root,this.O,this.u)};
k.X=function(a,b){if(32>this.o-kf(this)){for(var c=this.O.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.O[e],e+=1;else break;d[c]=b;return new R(this.v,this.o+1,this.shift,this.root,d,null)}c=(d=this.o>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=jf(null),d.f[0]=this.root,e=lf(null,this.shift,new hf(null,this.O)),d.f[1]=e):d=mf(this,this.shift,this.root,new hf(null,this.O));return new R(this.v,this.o+1,c,d,[b],null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.ba(null,c);case 3:return this.Ea(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.ba(null,c)};a.c=function(a,c,d){return this.Ea(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ua(b)))};k.b=function(a){return this.ba(null,a)};k.a=function(a,b){return this.Ea(null,a,b)};
var S=new hf(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),id=new R(null,0,5,S,[],Lc);function zf(a){var b=a.length;if(32>b)return new R(null,b,5,S,a,null);for(var c=32,d=(new R(null,32,5,S,a.slice(0,32),null)).pb(null);;)if(c<b)var e=c+1,d=ue.a(d,a[c]),c=e;else return Vb(d)}R.prototype[Ta]=function(){return Fc(this)};function Jd(a){return Na(a)?zf(a):Vb(Va.c(Ub,Tb(id),a))}
var Af=function Af(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Af.h(0<c.length?new Bc(c.slice(0),0):null)};Af.h=function(a){return a instanceof Bc&&0===a.s?zf(a.f):Jd(a)};Af.w=0;Af.B=function(a){return Af.h(H(a))};Bf;function wd(a,b,c,d,e,f){this.Ga=a;this.node=b;this.s=c;this.ua=d;this.v=e;this.u=f;this.g=32375020;this.C=1536}k=wd.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};
k.wa=function(){if(this.ua+1<this.node.length){var a;a=this.Ga;var b=this.node,c=this.s,d=this.ua+1;a=yf.l?yf.l(a,b,c,d):yf.call(null,a,b,c,d);return null==a?null:a}return cc(this)};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.ca=function(){return Qc(id,this.v)};k.ea=function(a,b){var c;c=this.Ga;var d=this.s+this.ua,e=N(this.Ga);c=Bf.c?Bf.c(c,d,e):Bf.call(null,c,d,e);return Uc(c,b)};
k.fa=function(a,b,c){a=this.Ga;var d=this.s+this.ua,e=N(this.Ga);a=Bf.c?Bf.c(a,d,e):Bf.call(null,a,d,e);return Vc(a,b,c)};k.ta=function(){return this.node[this.ua]};k.xa=function(){if(this.ua+1<this.node.length){var a;a=this.Ga;var b=this.node,c=this.s,d=this.ua+1;a=yf.l?yf.l(a,b,c,d):yf.call(null,a,b,c,d);return null==a?Dc:a}return bc(this)};k.U=function(){return this};k.ic=function(){var a=this.node;return new ke(a,this.ua,a.length)};
k.jc=function(){var a=this.s+this.node.length;if(a<Za(this.Ga)){var b=this.Ga,c=pf(this.Ga,a);return yf.l?yf.l(b,c,a,0):yf.call(null,b,c,a,0)}return Dc};k.R=function(a,b){return yf.A?yf.A(this.Ga,this.node,this.s,this.ua,b):yf.call(null,this.Ga,this.node,this.s,this.ua,b)};k.X=function(a,b){return M(b,this)};k.hc=function(){var a=this.s+this.node.length;if(a<Za(this.Ga)){var b=this.Ga,c=pf(this.Ga,a);return yf.l?yf.l(b,c,a,0):yf.call(null,b,c,a,0)}return null};wd.prototype[Ta]=function(){return Fc(this)};
var yf=function yf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return yf.c(arguments[0],arguments[1],arguments[2]);case 4:return yf.l(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return yf.A(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};yf.c=function(a,b,c){return new wd(a,qf(a,b),b,c,null,null)};
yf.l=function(a,b,c,d){return new wd(a,b,c,d,null,null)};yf.A=function(a,b,c,d,e){return new wd(a,b,c,d,e,null)};yf.w=5;Cf;function Df(a,b,c,d,e){this.v=a;this.Na=b;this.start=c;this.end=d;this.u=e;this.g=167666463;this.C=8192}k=Df.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.N=function(a,b){return lb.c(this,b,null)};k.I=function(a,b,c){return"number"===typeof b?db.c(this,b,c):c};
k.Gb=function(a,b,c){a=this.start;for(var d=0;;)if(a<this.end){var e=d,f=db.a(this.Na,a);c=b.c?b.c(c,e,f):b.call(null,c,e,f);if(Tc(c))return K.b?K.b(c):K.call(null,c);d+=1;a+=1}else return c};k.ba=function(a,b){return 0>b||this.end<=this.start+b?of(b,this.end-this.start):db.a(this.Na,this.start+b)};k.Ea=function(a,b,c){return 0>b||this.end<=this.start+b?c:db.c(this.Na,this.start+b,c)};
k.eb=function(a,b,c){var d=this.start+b;a=this.v;c=Q.c(this.Na,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return Cf.A?Cf.A(a,c,b,d,null):Cf.call(null,a,c,b,d,null)};k.P=function(){return this.v};k.Z=function(){return this.end-this.start};k.cb=function(){return db.a(this.Na,this.end-1)};k.Xb=function(){return this.start!==this.end?new $c(this,this.end-this.start-1,null):null};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};
k.ca=function(){return Qc(id,this.v)};k.ea=function(a,b){return Uc(this,b)};k.fa=function(a,b,c){return Vc(this,b,c)};k.Ra=function(a,b,c){if("number"===typeof b)return xb(this,b,c);throw Error("Subvec's key for assoc must be a number.");};k.U=function(){var a=this;return function(b){return function d(e){return e===a.end?null:M(db.a(a.Na,e),new ie(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};
k.R=function(a,b){return Cf.A?Cf.A(b,this.Na,this.start,this.end,this.u):Cf.call(null,b,this.Na,this.start,this.end,this.u)};k.X=function(a,b){var c=this.v,d=xb(this.Na,this.end,b),e=this.start,f=this.end+1;return Cf.A?Cf.A(c,d,e,f,null):Cf.call(null,c,d,e,f,null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.ba(null,c);case 3:return this.Ea(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.ba(null,c)};a.c=function(a,c,d){return this.Ea(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ua(b)))};k.b=function(a){return this.ba(null,a)};k.a=function(a,b){return this.Ea(null,a,b)};Df.prototype[Ta]=function(){return Fc(this)};
function Cf(a,b,c,d,e){for(;;)if(b instanceof Df)c=b.start+c,d=b.start+d,b=b.Na;else{var f=N(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new Df(a,b,c,d,e)}}var Bf=function Bf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Bf.a(arguments[0],arguments[1]);case 3:return Bf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
Bf.a=function(a,b){return Bf.c(a,b,N(a))};Bf.c=function(a,b,c){return Cf(null,a,b,c,null)};Bf.w=3;function Ef(a,b){return a===b.V?b:new hf(a,Ua(b.f))}function tf(a){return new hf({},Ua(a.f))}function uf(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];Ad(a,0,b,0,a.length);return b}
var Ff=function Ff(b,c,d,e){d=Ef(b.root.V,d);var f=b.o-1>>>c&31;if(5===c)b=e;else{var g=d.f[f];b=null!=g?Ff(b,c-5,g,e):lf(b.root.V,c-5,e)}d.f[f]=b;return d};function vf(a,b,c,d){this.o=a;this.shift=b;this.root=c;this.O=d;this.C=88;this.g=275}k=vf.prototype;
k.Mb=function(a,b){if(this.root.V){if(32>this.o-kf(this))this.O[this.o&31]=b;else{var c=new hf(this.root.V,this.O),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.O=d;if(this.o>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=lf(this.root.V,this.shift,c);this.root=new hf(this.root.V,d);this.shift=e}else this.root=Ff(this,this.shift,this.root,c)}this.o+=1;return this}throw Error("conj! after persistent!");};k.Nb=function(){if(this.root.V){this.root.V=null;var a=this.o-kf(this),b=Array(a);Ad(this.O,0,b,0,a);return new R(null,this.o,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
k.Lb=function(a,b,c){if("number"===typeof b)return Xb(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
k.tc=function(a,b,c){var d=this;if(d.root.V){if(0<=b&&b<d.o)return kf(this)<=b?d.O[b&31]=c:(a=function(){return function f(a,h){var l=Ef(d.root.V,h);if(0===a)l.f[b&31]=c;else{var m=b>>>a&31,n=f(a-5,l.f[m]);l.f[m]=n}return l}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.o)return Ub(this,c);throw Error([A("Index "),A(b),A(" out of bounds for TransientVector of length"),A(d.o)].join(""));}throw Error("assoc! after persistent!");};
k.Z=function(){if(this.root.V)return this.o;throw Error("count after persistent!");};k.ba=function(a,b){if(this.root.V)return qf(this,b)[b&31];throw Error("nth after persistent!");};k.Ea=function(a,b,c){return 0<=b&&b<this.o?db.a(this,b):c};k.N=function(a,b){return lb.c(this,b,null)};k.I=function(a,b,c){return"number"===typeof b?db.c(this,b,c):c};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ua(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};function Gf(){this.g=2097152;this.C=0}
Gf.prototype.equiv=function(a){return this.D(null,a)};Gf.prototype.D=function(){return!1};var Hf=new Gf;function If(a,b){return Dd(td(b)?N(a)===N(b)?Ee(Kd,T.a(function(a){return rc.a(C.c(b,I(a),Hf),fd(a))},a)):null:null)}function Jf(a,b,c,d,e){this.s=a;this.kd=b;this.oc=c;this.$c=d;this.Fc=e}Jf.prototype.ya=function(){var a=this.s<this.oc;return a?a:this.Fc.ya()};Jf.prototype.next=function(){if(this.s<this.oc){var a=kd(this.$c,this.s);this.s+=1;return new R(null,2,5,S,[a,lb.a(this.kd,a)],null)}return this.Fc.next()};
Jf.prototype.remove=function(){return Error("Unsupported operation")};function Kf(a){this.H=a}Kf.prototype.next=function(){if(null!=this.H){var a=I(this.H),b=P(a,0),a=P(a,1);this.H=J(this.H);return{value:[b,a],done:!1}}return{value:null,done:!0}};function Lf(a){return new Kf(H(a))}function Mf(a){this.H=a}Mf.prototype.next=function(){if(null!=this.H){var a=I(this.H);this.H=J(this.H);return{value:[a,a],done:!1}}return{value:null,done:!0}};
function Nf(a,b){var c;if(b instanceof y)a:{c=a.length;for(var d=b.Ia,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof y&&d===a[e].Ia){c=e;break a}e+=2}}else if("string"==typeof b||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof qc)a:for(c=a.length,d=b.Va,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof qc&&d===a[e].Va){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=
a.length,d=0;;){if(c<=d){c=-1;break a}if(rc.a(b,a[d])){c=d;break a}d+=2}return c}Of;function Pf(a,b,c){this.f=a;this.s=b;this.Da=c;this.g=32374990;this.C=0}k=Pf.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.Da};k.wa=function(){return this.s<this.f.length-2?new Pf(this.f,this.s+2,this.Da):null};k.Z=function(){return(this.f.length-this.s)/2};k.S=function(){return Kc(this)};k.D=function(a,b){return Pc(this,b)};
k.ca=function(){return Qc(Dc,this.Da)};k.ea=function(a,b){return ed.a(b,this)};k.fa=function(a,b,c){return ed.c(b,c,this)};k.ta=function(){return new R(null,2,5,S,[this.f[this.s],this.f[this.s+1]],null)};k.xa=function(){return this.s<this.f.length-2?new Pf(this.f,this.s+2,this.Da):Dc};k.U=function(){return this};k.R=function(a,b){return new Pf(this.f,this.s,b)};k.X=function(a,b){return M(b,this)};Pf.prototype[Ta]=function(){return Fc(this)};Qf;Rf;function Sf(a,b,c){this.f=a;this.s=b;this.o=c}
Sf.prototype.ya=function(){return this.s<this.o};Sf.prototype.next=function(){var a=new R(null,2,5,S,[this.f[this.s],this.f[this.s+1]],null);this.s+=2;return a};function v(a,b,c,d){this.v=a;this.o=b;this.f=c;this.u=d;this.g=16647951;this.C=8196}k=v.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.keys=function(){return Fc(Qf.b?Qf.b(this):Qf.call(null,this))};k.entries=function(){return Lf(H(this))};
k.values=function(){return Fc(Rf.b?Rf.b(this):Rf.call(null,this))};k.has=function(a){return Ed(this,a)};k.get=function(a,b){return this.I(null,a,b)};k.forEach=function(a){for(var b=H(this),c=null,d=0,e=0;;)if(e<d){var f=c.ba(null,e),g=P(f,0),f=P(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=H(b))xd(b)?(c=ac(b),b=bc(b),g=c,d=N(c),c=g):(c=I(b),g=P(c,0),f=P(c,1),a.a?a.a(f,g):a.call(null,f,g),b=J(b),c=null,d=0),e=0;else return null};k.N=function(a,b){return lb.c(this,b,null)};
k.I=function(a,b,c){a=Nf(this.f,b);return-1===a?c:this.f[a+1]};k.Gb=function(a,b,c){a=this.f.length;for(var d=0;;)if(d<a){var e=this.f[d],f=this.f[d+1];c=b.c?b.c(c,e,f):b.call(null,c,e,f);if(Tc(c))return K.b?K.b(c):K.call(null,c);d+=2}else return c};k.Ha=function(){return new Sf(this.f,0,2*this.o)};k.P=function(){return this.v};k.Z=function(){return this.o};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Mc(this)};
k.D=function(a,b){if(null!=b&&(b.g&1024||b.Oc)){var c=this.f.length;if(this.o===b.Z(null))for(var d=0;;)if(d<c){var e=b.I(null,this.f[d],Bd);if(e!==Bd)if(rc.a(this.f[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return If(this,b)};k.pb=function(){return new Of({},this.f.length,Ua(this.f))};k.ca=function(){return Cb(W,this.v)};k.ea=function(a,b){return ed.a(b,this)};k.fa=function(a,b,c){return ed.c(b,c,this)};
k.rb=function(a,b){if(0<=Nf(this.f,b)){var c=this.f.length,d=c-2;if(0===d)return $a(this);for(var d=Array(d),e=0,f=0;;){if(e>=c)return new v(this.v,this.o-1,d,null);rc.a(b,this.f[e])||(d[f]=this.f[e],d[f+1]=this.f[e+1],f+=2);e+=2}}else return this};
k.Ra=function(a,b,c){a=Nf(this.f,b);if(-1===a){if(this.o<Tf){a=this.f;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new v(this.v,this.o+1,e,null)}return Cb(ob(cf.a(Uf,this),b,c),this.v)}if(c===this.f[a+1])return this;b=Ua(this.f);b[a+1]=c;return new v(this.v,this.o,b,null)};k.gc=function(a,b){return-1!==Nf(this.f,b)};k.U=function(){var a=this.f;return 0<=a.length-2?new Pf(a,0,null):null};k.R=function(a,b){return new v(b,this.o,this.f,this.u)};
k.X=function(a,b){if(ud(b))return ob(this,db.a(b,0),db.a(b,1));for(var c=this,d=H(b);;){if(null==d)return c;var e=I(d);if(ud(e))c=ob(c,db.a(e,0),db.a(e,1)),d=J(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ua(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};var W=new v(null,0,[],Nc),Tf=8;v.prototype[Ta]=function(){return Fc(this)};
Vf;function Of(a,b,c){this.wb=a;this.kb=b;this.f=c;this.g=258;this.C=56}k=Of.prototype;k.Z=function(){if(x(this.wb))return Td(this.kb);throw Error("count after persistent!");};k.N=function(a,b){return lb.c(this,b,null)};k.I=function(a,b,c){if(x(this.wb))return a=Nf(this.f,b),-1===a?c:this.f[a+1];throw Error("lookup after persistent!");};
k.Mb=function(a,b){if(x(this.wb)){if(null!=b?b.g&2048||b.Pc||(b.g?0:Pa(rb,b)):Pa(rb,b))return Wb(this,Xd.b?Xd.b(b):Xd.call(null,b),Yd.b?Yd.b(b):Yd.call(null,b));for(var c=H(b),d=this;;){var e=I(c);if(x(e))c=J(c),d=Wb(d,Xd.b?Xd.b(e):Xd.call(null,e),Yd.b?Yd.b(e):Yd.call(null,e));else return d}}else throw Error("conj! after persistent!");};k.Nb=function(){if(x(this.wb))return this.wb=!1,new v(null,Td(this.kb),this.f,null);throw Error("persistent! called twice");};
k.Lb=function(a,b,c){if(x(this.wb)){a=Nf(this.f,b);if(-1===a)return this.kb+2<=2*Tf?(this.kb+=2,this.f.push(b),this.f.push(c),this):ve(Vf.a?Vf.a(this.kb,this.f):Vf.call(null,this.kb,this.f),b,c);c!==this.f[a+1]&&(this.f[a+1]=c);return this}throw Error("assoc! after persistent!");};Wf;ld;function Vf(a,b){for(var c=Tb(Uf),d=0;;)if(d<a)c=Wb(c,b[d],b[d+1]),d+=2;else return c}function Xf(){this.G=!1}Yf;Zf;Pe;$f;X;K;function ag(a,b){return a===b?!0:ge(a,b)?!0:rc.a(a,b)}
function bg(a,b,c){a=Ua(a);a[b]=c;return a}function cg(a,b){var c=Array(a.length-2);Ad(a,0,c,0,2*b);Ad(a,2*(b+1),c,2*b,c.length-2*b);return c}function dg(a,b,c,d){a=a.gb(b);a.f[c]=d;return a}function eg(a,b,c){for(var d=a.length,e=0,f=c;;)if(e<d){c=a[e];if(null!=c){var g=a[e+1];c=b.c?b.c(f,c,g):b.call(null,f,c,g)}else c=a[e+1],c=null!=c?c.jb(b,f):f;if(Tc(c))return K.b?K.b(c):K.call(null,c);e+=2;f=c}else return f}fg;function gg(a,b,c,d){this.f=a;this.s=b;this.Ub=c;this.Qa=d}
gg.prototype.advance=function(){for(var a=this.f.length;;)if(this.s<a){var b=this.f[this.s],c=this.f[this.s+1];null!=b?b=this.Ub=new R(null,2,5,S,[b,c],null):null!=c?(b=hc(c),b=b.ya()?this.Qa=b:!1):b=!1;this.s+=2;if(b)return!0}else return!1};gg.prototype.ya=function(){var a=null!=this.Ub;return a?a:(a=null!=this.Qa)?a:this.advance()};
gg.prototype.next=function(){if(null!=this.Ub){var a=this.Ub;this.Ub=null;return a}if(null!=this.Qa)return a=this.Qa.next(),this.Qa.ya()||(this.Qa=null),a;if(this.advance())return this.next();throw Error("No such element");};gg.prototype.remove=function(){return Error("Unsupported operation")};function hg(a,b,c){this.V=a;this.Y=b;this.f=c}k=hg.prototype;k.gb=function(a){if(a===this.V)return this;var b=Ud(this.Y),c=Array(0>b?4:2*(b+1));Ad(this.f,0,c,0,2*b);return new hg(a,this.Y,c)};
k.Rb=function(){return Yf.b?Yf.b(this.f):Yf.call(null,this.f)};k.jb=function(a,b){return eg(this.f,a,b)};k.$a=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.Y&e))return d;var f=Ud(this.Y&e-1),e=this.f[2*f],f=this.f[2*f+1];return null==e?f.$a(a+5,b,c,d):ag(c,e)?f:d};
k.Pa=function(a,b,c,d,e,f){var g=1<<(c>>>b&31),h=Ud(this.Y&g-1);if(0===(this.Y&g)){var l=Ud(this.Y);if(2*l<this.f.length){a=this.gb(a);b=a.f;f.G=!0;a:for(c=2*(l-h),f=2*h+(c-1),l=2*(h+1)+(c-1);;){if(0===c)break a;b[l]=b[f];--l;--c;--f}b[2*h]=d;b[2*h+1]=e;a.Y|=g;return a}if(16<=l){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[c>>>b&31]=ig.Pa(a,b+5,c,d,e,f);for(e=d=0;;)if(32>d)0!==
(this.Y>>>d&1)&&(h[d]=null!=this.f[e]?ig.Pa(a,b+5,wc(this.f[e]),this.f[e],this.f[e+1],f):this.f[e+1],e+=2),d+=1;else break;return new fg(a,l+1,h)}b=Array(2*(l+4));Ad(this.f,0,b,0,2*h);b[2*h]=d;b[2*h+1]=e;Ad(this.f,2*h,b,2*(h+1),2*(l-h));f.G=!0;a=this.gb(a);a.f=b;a.Y|=g;return a}l=this.f[2*h];g=this.f[2*h+1];if(null==l)return l=g.Pa(a,b+5,c,d,e,f),l===g?this:dg(this,a,2*h+1,l);if(ag(d,l))return e===g?this:dg(this,a,2*h+1,e);f.G=!0;f=b+5;d=$f.aa?$f.aa(a,f,l,g,c,d,e):$f.call(null,a,f,l,g,c,d,e);e=2*
h;h=2*h+1;a=this.gb(a);a.f[e]=null;a.f[h]=d;return a};
k.Oa=function(a,b,c,d,e){var f=1<<(b>>>a&31),g=Ud(this.Y&f-1);if(0===(this.Y&f)){var h=Ud(this.Y);if(16<=h){g=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];g[b>>>a&31]=ig.Oa(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.Y>>>c&1)&&(g[c]=null!=this.f[d]?ig.Oa(a+5,wc(this.f[d]),this.f[d],this.f[d+1],e):this.f[d+1],d+=2),c+=1;else break;return new fg(null,h+1,g)}a=Array(2*(h+1));Ad(this.f,
0,a,0,2*g);a[2*g]=c;a[2*g+1]=d;Ad(this.f,2*g,a,2*(g+1),2*(h-g));e.G=!0;return new hg(null,this.Y|f,a)}var l=this.f[2*g],f=this.f[2*g+1];if(null==l)return h=f.Oa(a+5,b,c,d,e),h===f?this:new hg(null,this.Y,bg(this.f,2*g+1,h));if(ag(c,l))return d===f?this:new hg(null,this.Y,bg(this.f,2*g+1,d));e.G=!0;e=this.Y;h=this.f;a+=5;a=$f.T?$f.T(a,l,f,b,c,d):$f.call(null,a,l,f,b,c,d);c=2*g;g=2*g+1;d=Ua(h);d[c]=null;d[g]=a;return new hg(null,e,d)};
k.Sb=function(a,b,c){var d=1<<(b>>>a&31);if(0===(this.Y&d))return this;var e=Ud(this.Y&d-1),f=this.f[2*e],g=this.f[2*e+1];return null==f?(a=g.Sb(a+5,b,c),a===g?this:null!=a?new hg(null,this.Y,bg(this.f,2*e+1,a)):this.Y===d?null:new hg(null,this.Y^d,cg(this.f,e))):ag(c,f)?new hg(null,this.Y^d,cg(this.f,e)):this};k.Ha=function(){return new gg(this.f,0,null,null)};var ig=new hg(null,0,[]);function jg(a,b,c){this.f=a;this.s=b;this.Qa=c}
jg.prototype.ya=function(){for(var a=this.f.length;;){if(null!=this.Qa&&this.Qa.ya())return!0;if(this.s<a){var b=this.f[this.s];this.s+=1;null!=b&&(this.Qa=hc(b))}else return!1}};jg.prototype.next=function(){if(this.ya())return this.Qa.next();throw Error("No such element");};jg.prototype.remove=function(){return Error("Unsupported operation")};function fg(a,b,c){this.V=a;this.o=b;this.f=c}k=fg.prototype;k.gb=function(a){return a===this.V?this:new fg(a,this.o,Ua(this.f))};
k.Rb=function(){return Zf.b?Zf.b(this.f):Zf.call(null,this.f)};k.jb=function(a,b){for(var c=this.f.length,d=0,e=b;;)if(d<c){var f=this.f[d];if(null!=f&&(e=f.jb(a,e),Tc(e)))return K.b?K.b(e):K.call(null,e);d+=1}else return e};k.$a=function(a,b,c,d){var e=this.f[b>>>a&31];return null!=e?e.$a(a+5,b,c,d):d};k.Pa=function(a,b,c,d,e,f){var g=c>>>b&31,h=this.f[g];if(null==h)return a=dg(this,a,g,ig.Pa(a,b+5,c,d,e,f)),a.o+=1,a;b=h.Pa(a,b+5,c,d,e,f);return b===h?this:dg(this,a,g,b)};
k.Oa=function(a,b,c,d,e){var f=b>>>a&31,g=this.f[f];if(null==g)return new fg(null,this.o+1,bg(this.f,f,ig.Oa(a+5,b,c,d,e)));a=g.Oa(a+5,b,c,d,e);return a===g?this:new fg(null,this.o,bg(this.f,f,a))};
k.Sb=function(a,b,c){var d=b>>>a&31,e=this.f[d];if(null!=e){a=e.Sb(a+5,b,c);if(a===e)d=this;else if(null==a)if(8>=this.o)a:{e=this.f;a=e.length;b=Array(2*(this.o-1));c=0;for(var f=1,g=0;;)if(c<a)c!==d&&null!=e[c]&&(b[f]=e[c],f+=2,g|=1<<c),c+=1;else{d=new hg(null,g,b);break a}}else d=new fg(null,this.o-1,bg(this.f,d,a));else d=new fg(null,this.o,bg(this.f,d,a));return d}return this};k.Ha=function(){return new jg(this.f,0,null)};
function kg(a,b,c){b*=2;for(var d=0;;)if(d<b){if(ag(c,a[d]))return d;d+=2}else return-1}function lg(a,b,c,d){this.V=a;this.Xa=b;this.o=c;this.f=d}k=lg.prototype;k.gb=function(a){if(a===this.V)return this;var b=Array(2*(this.o+1));Ad(this.f,0,b,0,2*this.o);return new lg(a,this.Xa,this.o,b)};k.Rb=function(){return Yf.b?Yf.b(this.f):Yf.call(null,this.f)};k.jb=function(a,b){return eg(this.f,a,b)};k.$a=function(a,b,c,d){a=kg(this.f,this.o,c);return 0>a?d:ag(c,this.f[a])?this.f[a+1]:d};
k.Pa=function(a,b,c,d,e,f){if(c===this.Xa){b=kg(this.f,this.o,d);if(-1===b){if(this.f.length>2*this.o)return b=2*this.o,c=2*this.o+1,a=this.gb(a),a.f[b]=d,a.f[c]=e,f.G=!0,a.o+=1,a;c=this.f.length;b=Array(c+2);Ad(this.f,0,b,0,c);b[c]=d;b[c+1]=e;f.G=!0;d=this.o+1;a===this.V?(this.f=b,this.o=d,a=this):a=new lg(this.V,this.Xa,d,b);return a}return this.f[b+1]===e?this:dg(this,a,b+1,e)}return(new hg(a,1<<(this.Xa>>>b&31),[null,this,null,null])).Pa(a,b,c,d,e,f)};
k.Oa=function(a,b,c,d,e){return b===this.Xa?(a=kg(this.f,this.o,c),-1===a?(a=2*this.o,b=Array(a+2),Ad(this.f,0,b,0,a),b[a]=c,b[a+1]=d,e.G=!0,new lg(null,this.Xa,this.o+1,b)):rc.a(this.f[a],d)?this:new lg(null,this.Xa,this.o,bg(this.f,a+1,d))):(new hg(null,1<<(this.Xa>>>a&31),[null,this])).Oa(a,b,c,d,e)};k.Sb=function(a,b,c){a=kg(this.f,this.o,c);return-1===a?this:1===this.o?null:new lg(null,this.Xa,this.o-1,cg(this.f,Td(a)))};k.Ha=function(){return new gg(this.f,0,null,null)};
var $f=function $f(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return $f.T(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return $f.aa(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};
$f.T=function(a,b,c,d,e,f){var g=wc(b);if(g===d)return new lg(null,g,2,[b,c,e,f]);var h=new Xf;return ig.Oa(a,g,b,c,h).Oa(a,d,e,f,h)};$f.aa=function(a,b,c,d,e,f,g){var h=wc(c);if(h===e)return new lg(null,h,2,[c,d,f,g]);var l=new Xf;return ig.Pa(a,b,h,c,d,l).Pa(a,b,e,f,g,l)};$f.w=7;function mg(a,b,c,d,e){this.v=a;this.ab=b;this.s=c;this.H=d;this.u=e;this.g=32374860;this.C=0}k=mg.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};
k.S=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.ca=function(){return Qc(Dc,this.v)};k.ea=function(a,b){return ed.a(b,this)};k.fa=function(a,b,c){return ed.c(b,c,this)};k.ta=function(){return null==this.H?new R(null,2,5,S,[this.ab[this.s],this.ab[this.s+1]],null):I(this.H)};
k.xa=function(){if(null==this.H){var a=this.ab,b=this.s+2;return Yf.c?Yf.c(a,b,null):Yf.call(null,a,b,null)}var a=this.ab,b=this.s,c=J(this.H);return Yf.c?Yf.c(a,b,c):Yf.call(null,a,b,c)};k.U=function(){return this};k.R=function(a,b){return new mg(b,this.ab,this.s,this.H,this.u)};k.X=function(a,b){return M(b,this)};mg.prototype[Ta]=function(){return Fc(this)};
var Yf=function Yf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Yf.b(arguments[0]);case 3:return Yf.c(arguments[0],arguments[1],arguments[2]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};Yf.b=function(a){return Yf.c(a,0,null)};
Yf.c=function(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new mg(null,a,b,null,null);var d=a[b+1];if(x(d)&&(d=d.Rb(),x(d)))return new mg(null,a,b+2,d,null);b+=2}else return null;else return new mg(null,a,b,c,null)};Yf.w=3;function ng(a,b,c,d,e){this.v=a;this.ab=b;this.s=c;this.H=d;this.u=e;this.g=32374860;this.C=0}k=ng.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.v};
k.S=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.ca=function(){return Qc(Dc,this.v)};k.ea=function(a,b){return ed.a(b,this)};k.fa=function(a,b,c){return ed.c(b,c,this)};k.ta=function(){return I(this.H)};k.xa=function(){var a=this.ab,b=this.s,c=J(this.H);return Zf.l?Zf.l(null,a,b,c):Zf.call(null,null,a,b,c)};k.U=function(){return this};k.R=function(a,b){return new ng(b,this.ab,this.s,this.H,this.u)};k.X=function(a,b){return M(b,this)};
ng.prototype[Ta]=function(){return Fc(this)};var Zf=function Zf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Zf.b(arguments[0]);case 4:return Zf.l(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};Zf.b=function(a){return Zf.l(null,a,0,null)};
Zf.l=function(a,b,c,d){if(null==d)for(d=b.length;;)if(c<d){var e=b[c];if(x(e)&&(e=e.Rb(),x(e)))return new ng(a,b,c+1,e,null);c+=1}else return null;else return new ng(a,b,c,d,null)};Zf.w=4;Wf;function og(a,b,c){this.Aa=a;this.Hc=b;this.nc=c}og.prototype.ya=function(){return this.nc&&this.Hc.ya()};og.prototype.next=function(){if(this.nc)return this.Hc.next();this.nc=!0;return this.Aa};og.prototype.remove=function(){return Error("Unsupported operation")};
function ld(a,b,c,d,e,f){this.v=a;this.o=b;this.root=c;this.za=d;this.Aa=e;this.u=f;this.g=16123663;this.C=8196}k=ld.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.keys=function(){return Fc(Qf.b?Qf.b(this):Qf.call(null,this))};k.entries=function(){return Lf(H(this))};k.values=function(){return Fc(Rf.b?Rf.b(this):Rf.call(null,this))};k.has=function(a){return Ed(this,a)};k.get=function(a,b){return this.I(null,a,b)};
k.forEach=function(a){for(var b=H(this),c=null,d=0,e=0;;)if(e<d){var f=c.ba(null,e),g=P(f,0),f=P(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=H(b))xd(b)?(c=ac(b),b=bc(b),g=c,d=N(c),c=g):(c=I(b),g=P(c,0),f=P(c,1),a.a?a.a(f,g):a.call(null,f,g),b=J(b),c=null,d=0),e=0;else return null};k.N=function(a,b){return lb.c(this,b,null)};k.I=function(a,b,c){return null==b?this.za?this.Aa:c:null==this.root?c:this.root.$a(0,wc(b),b,c)};
k.Gb=function(a,b,c){a=this.za?b.c?b.c(c,null,this.Aa):b.call(null,c,null,this.Aa):c;return Tc(a)?K.b?K.b(a):K.call(null,a):null!=this.root?this.root.jb(b,a):a};k.Ha=function(){var a=this.root?hc(this.root):ye;return this.za?new og(this.Aa,a,!1):a};k.P=function(){return this.v};k.Z=function(){return this.o};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Mc(this)};k.D=function(a,b){return If(this,b)};k.pb=function(){return new Wf({},this.root,this.o,this.za,this.Aa)};
k.ca=function(){return Cb(Uf,this.v)};k.rb=function(a,b){if(null==b)return this.za?new ld(this.v,this.o-1,this.root,!1,null,null):this;if(null==this.root)return this;var c=this.root.Sb(0,wc(b),b);return c===this.root?this:new ld(this.v,this.o-1,c,this.za,this.Aa,null)};
k.Ra=function(a,b,c){if(null==b)return this.za&&c===this.Aa?this:new ld(this.v,this.za?this.o:this.o+1,this.root,!0,c,null);a=new Xf;b=(null==this.root?ig:this.root).Oa(0,wc(b),b,c,a);return b===this.root?this:new ld(this.v,a.G?this.o+1:this.o,b,this.za,this.Aa,null)};k.gc=function(a,b){return null==b?this.za:null==this.root?!1:this.root.$a(0,wc(b),b,Bd)!==Bd};k.U=function(){if(0<this.o){var a=null!=this.root?this.root.Rb():null;return this.za?M(new R(null,2,5,S,[null,this.Aa],null),a):a}return null};
k.R=function(a,b){return new ld(b,this.o,this.root,this.za,this.Aa,this.u)};k.X=function(a,b){if(ud(b))return ob(this,db.a(b,0),db.a(b,1));for(var c=this,d=H(b);;){if(null==d)return c;var e=I(d);if(ud(e))c=ob(c,db.a(e,0),db.a(e,1)),d=J(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ua(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};var Uf=new ld(null,0,null,!1,null,Nc);
function md(a,b){for(var c=a.length,d=0,e=Tb(Uf);;)if(d<c)var f=d+1,e=e.Lb(null,a[d],b[d]),d=f;else return Vb(e)}ld.prototype[Ta]=function(){return Fc(this)};function Wf(a,b,c,d,e){this.V=a;this.root=b;this.count=c;this.za=d;this.Aa=e;this.g=258;this.C=56}function pg(a,b,c){if(a.V){if(null==b)a.Aa!==c&&(a.Aa=c),a.za||(a.count+=1,a.za=!0);else{var d=new Xf;b=(null==a.root?ig:a.root).Pa(a.V,0,wc(b),b,c,d);b!==a.root&&(a.root=b);d.G&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}k=Wf.prototype;
k.Z=function(){if(this.V)return this.count;throw Error("count after persistent!");};k.N=function(a,b){return null==b?this.za?this.Aa:null:null==this.root?null:this.root.$a(0,wc(b),b)};k.I=function(a,b,c){return null==b?this.za?this.Aa:c:null==this.root?c:this.root.$a(0,wc(b),b,c)};
k.Mb=function(a,b){var c;a:if(this.V)if(null!=b?b.g&2048||b.Pc||(b.g?0:Pa(rb,b)):Pa(rb,b))c=pg(this,Xd.b?Xd.b(b):Xd.call(null,b),Yd.b?Yd.b(b):Yd.call(null,b));else{c=H(b);for(var d=this;;){var e=I(c);if(x(e))c=J(c),d=pg(d,Xd.b?Xd.b(e):Xd.call(null,e),Yd.b?Yd.b(e):Yd.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};k.Nb=function(){var a;if(this.V)this.V=null,a=new ld(null,this.count,this.root,this.za,this.Aa,null);else throw Error("persistent! called twice");return a};
k.Lb=function(a,b,c){return pg(this,b,c)};qg;rg;var sg=function sg(b,c,d){d=null!=b.left?sg(b.left,c,d):d;if(Tc(d))return K.b?K.b(d):K.call(null,d);var e=b.key,f=b.G;d=c.c?c.c(d,e,f):c.call(null,d,e,f);if(Tc(d))return K.b?K.b(d):K.call(null,d);b=null!=b.right?sg(b.right,c,d):d;return Tc(b)?K.b?K.b(b):K.call(null,b):b};function rg(a,b,c,d,e){this.key=a;this.G=b;this.left=c;this.right=d;this.u=e;this.g=32402207;this.C=0}k=rg.prototype;k.replace=function(a,b,c,d){return new rg(a,b,c,d,null)};
k.jb=function(a,b){return sg(this,a,b)};k.N=function(a,b){return db.c(this,b,null)};k.I=function(a,b,c){return db.c(this,b,c)};k.ba=function(a,b){return 0===b?this.key:1===b?this.G:null};k.Ea=function(a,b,c){return 0===b?this.key:1===b?this.G:c};k.eb=function(a,b,c){return(new R(null,2,5,S,[this.key,this.G],null)).eb(null,b,c)};k.P=function(){return null};k.Z=function(){return 2};k.Hb=function(){return this.key};k.Ib=function(){return this.G};k.cb=function(){return this.G};
k.S=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.ca=function(){return id};k.ea=function(a,b){return Uc(this,b)};k.fa=function(a,b,c){return Vc(this,b,c)};k.Ra=function(a,b,c){return Q.c(new R(null,2,5,S,[this.key,this.G],null),b,c)};k.U=function(){return bb(bb(Dc,this.G),this.key)};k.R=function(a,b){return Qc(new R(null,2,5,S,[this.key,this.G],null),b)};k.X=function(a,b){return new R(null,3,5,S,[this.key,this.G,b],null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ua(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};rg.prototype[Ta]=function(){return Fc(this)};
function qg(a,b,c,d,e){this.key=a;this.G=b;this.left=c;this.right=d;this.u=e;this.g=32402207;this.C=0}k=qg.prototype;k.replace=function(a,b,c,d){return new qg(a,b,c,d,null)};k.jb=function(a,b){return sg(this,a,b)};k.N=function(a,b){return db.c(this,b,null)};k.I=function(a,b,c){return db.c(this,b,c)};k.ba=function(a,b){return 0===b?this.key:1===b?this.G:null};k.Ea=function(a,b,c){return 0===b?this.key:1===b?this.G:c};k.eb=function(a,b,c){return(new R(null,2,5,S,[this.key,this.G],null)).eb(null,b,c)};
k.P=function(){return null};k.Z=function(){return 2};k.Hb=function(){return this.key};k.Ib=function(){return this.G};k.cb=function(){return this.G};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.ca=function(){return id};k.ea=function(a,b){return Uc(this,b)};k.fa=function(a,b,c){return Vc(this,b,c)};k.Ra=function(a,b,c){return Q.c(new R(null,2,5,S,[this.key,this.G],null),b,c)};k.U=function(){return bb(bb(Dc,this.G),this.key)};
k.R=function(a,b){return Qc(new R(null,2,5,S,[this.key,this.G],null),b)};k.X=function(a,b){return new R(null,3,5,S,[this.key,this.G,b],null)};k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ua(b)))};
k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};qg.prototype[Ta]=function(){return Fc(this)};Xd;var Oc=function Oc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Oc.h(0<c.length?new Bc(c.slice(0),0):null)};Oc.h=function(a){a=H(a);for(var b=Tb(Uf);;)if(a){var c=J(J(a)),b=ve(b,I(a),fd(a));a=c}else return Vb(b)};Oc.w=0;Oc.B=function(a){return Oc.h(H(a))};function tg(a,b){this.J=a;this.Da=b;this.g=32374988;this.C=0}k=tg.prototype;
k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.Da};k.wa=function(){var a=(null!=this.J?this.J.g&128||this.J.Wb||(this.J.g?0:Pa(hb,this.J)):Pa(hb,this.J))?this.J.wa(null):J(this.J);return null==a?null:new tg(a,this.Da)};k.S=function(){return Kc(this)};k.D=function(a,b){return Pc(this,b)};k.ca=function(){return Qc(Dc,this.Da)};k.ea=function(a,b){return ed.a(b,this)};k.fa=function(a,b,c){return ed.c(b,c,this)};k.ta=function(){return this.J.ta(null).Hb(null)};
k.xa=function(){var a=(null!=this.J?this.J.g&128||this.J.Wb||(this.J.g?0:Pa(hb,this.J)):Pa(hb,this.J))?this.J.wa(null):J(this.J);return null!=a?new tg(a,this.Da):Dc};k.U=function(){return this};k.R=function(a,b){return new tg(this.J,b)};k.X=function(a,b){return M(b,this)};tg.prototype[Ta]=function(){return Fc(this)};function Qf(a){return(a=H(a))?new tg(a,null):null}function Xd(a){return sb(a)}function ug(a,b){this.J=a;this.Da=b;this.g=32374988;this.C=0}k=ug.prototype;k.toString=function(){return jc(this)};
k.equiv=function(a){return this.D(null,a)};k.P=function(){return this.Da};k.wa=function(){var a=(null!=this.J?this.J.g&128||this.J.Wb||(this.J.g?0:Pa(hb,this.J)):Pa(hb,this.J))?this.J.wa(null):J(this.J);return null==a?null:new ug(a,this.Da)};k.S=function(){return Kc(this)};k.D=function(a,b){return Pc(this,b)};k.ca=function(){return Qc(Dc,this.Da)};k.ea=function(a,b){return ed.a(b,this)};k.fa=function(a,b,c){return ed.c(b,c,this)};k.ta=function(){return this.J.ta(null).Ib(null)};
k.xa=function(){var a=(null!=this.J?this.J.g&128||this.J.Wb||(this.J.g?0:Pa(hb,this.J)):Pa(hb,this.J))?this.J.wa(null):J(this.J);return null!=a?new ug(a,this.Da):Dc};k.U=function(){return this};k.R=function(a,b){return new ug(this.J,b)};k.X=function(a,b){return M(b,this)};ug.prototype[Ta]=function(){return Fc(this)};function Rf(a){return(a=H(a))?new ug(a,null):null}function Yd(a){return tb(a)}
var vg=function vg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return vg.h(0<c.length?new Bc(c.slice(0),0):null)};vg.h=function(a){return x(Fe(Kd,a))?Va.a(function(a,c){return hd.a(x(a)?a:W,c)},a):null};vg.w=0;vg.B=function(a){return vg.h(H(a))};wg;function xg(a){this.yb=a}xg.prototype.ya=function(){return this.yb.ya()};xg.prototype.next=function(){if(this.yb.ya())return this.yb.next().O[0];throw Error("No such element");};xg.prototype.remove=function(){return Error("Unsupported operation")};
function yg(a,b,c){this.v=a;this.hb=b;this.u=c;this.g=15077647;this.C=8196}k=yg.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.keys=function(){return Fc(H(this))};k.entries=function(){var a=H(this);return new Mf(H(a))};k.values=function(){return Fc(H(this))};k.has=function(a){return Ed(this,a)};
k.forEach=function(a){for(var b=H(this),c=null,d=0,e=0;;)if(e<d){var f=c.ba(null,e),g=P(f,0),f=P(f,1);a.a?a.a(f,g):a.call(null,f,g);e+=1}else if(b=H(b))xd(b)?(c=ac(b),b=bc(b),g=c,d=N(c),c=g):(c=I(b),g=P(c,0),f=P(c,1),a.a?a.a(f,g):a.call(null,f,g),b=J(b),c=null,d=0),e=0;else return null};k.N=function(a,b){return lb.c(this,b,null)};k.I=function(a,b,c){return nb(this.hb,b)?b:c};k.Ha=function(){return new xg(hc(this.hb))};k.P=function(){return this.v};k.Z=function(){return Za(this.hb)};
k.S=function(){var a=this.u;return null!=a?a:this.u=a=Mc(this)};k.D=function(a,b){return rd(b)&&N(this)===N(b)&&Ee(function(a){return function(b){return Ed(a,b)}}(this),b)};k.pb=function(){return new wg(Tb(this.hb))};k.ca=function(){return Qc(zg,this.v)};k.U=function(){return Qf(this.hb)};k.R=function(a,b){return new yg(b,this.hb,this.u)};k.X=function(a,b){return new yg(this.v,Q.c(this.hb,b,null),null)};
k.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.N(null,c);case 3:return this.I(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.a=function(a,c){return this.N(null,c)};a.c=function(a,c,d){return this.I(null,c,d)};return a}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ua(b)))};k.b=function(a){return this.N(null,a)};k.a=function(a,b){return this.I(null,a,b)};var zg=new yg(null,W,Nc);yg.prototype[Ta]=function(){return Fc(this)};
function wg(a){this.Ya=a;this.C=136;this.g=259}k=wg.prototype;k.Mb=function(a,b){this.Ya=Wb(this.Ya,b,null);return this};k.Nb=function(){return new yg(null,Vb(this.Ya),null)};k.Z=function(){return N(this.Ya)};k.N=function(a,b){return lb.c(this,b,null)};k.I=function(a,b,c){return lb.c(this.Ya,b,Bd)===Bd?c:b};
k.call=function(){function a(a,b,c){return lb.c(this.Ya,b,Bd)===Bd?c:b}function b(a,b){return lb.c(this.Ya,b,Bd)===Bd?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.a=b;c.c=a;return c}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ua(b)))};k.b=function(a){return lb.c(this.Ya,a,Bd)===Bd?null:a};k.a=function(a,b){return lb.c(this.Ya,a,Bd)===Bd?b:a};
function Ag(a,b){if(ud(b)){var c=N(b);return Va.c(function(){return function(b,c){var f=Fd(a,kd(b,c));return x(f)?Q.c(b,c,fd(f)):b}}(c),b,Se(c,We(Rc,0)))}return T.a(function(b){var c=Fd(a,b);return x(c)?fd(c):b},b)}function Bg(a){for(var b=id;;)if(J(a))b=hd.a(b,I(a)),a=J(a);else return H(b)}function Wd(a){if(null!=a&&(a.C&4096||a.Rc))return a.Jb(null);if("string"===typeof a)return a;throw Error([A("Doesn't support name: "),A(a)].join(""));}
var Cg=function Cg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Cg.a(arguments[0],arguments[1]);case 3:return Cg.c(arguments[0],arguments[1],arguments[2]);default:return Cg.h(arguments[0],arguments[1],arguments[2],new Bc(c.slice(3),0))}};Cg.a=function(a,b){return b};Cg.c=function(a,b,c){return(a.b?a.b(b):a.call(null,b))<(a.b?a.b(c):a.call(null,c))?b:c};
Cg.h=function(a,b,c,d){return Va.c(function(b,c){return Cg.c(a,b,c)},Cg.c(a,b,c),d)};Cg.B=function(a){var b=I(a),c=J(a);a=I(c);var d=J(c),c=I(d),d=J(d);return Cg.h(b,a,c,d)};Cg.w=3;function Dg(a,b){return new ie(null,function(){var c=H(b);if(c){var d;d=I(c);d=a.b?a.b(d):a.call(null,d);c=x(d)?M(I(c),Dg(a,Cc(c))):null}else c=null;return c},null,null)}function Eg(a,b,c){this.s=a;this.end=b;this.step=c}Eg.prototype.ya=function(){return 0<this.step?this.s<this.end:this.s>this.end};
Eg.prototype.next=function(){var a=this.s;this.s+=this.step;return a};function Fg(a,b,c,d,e){this.v=a;this.start=b;this.end=c;this.step=d;this.u=e;this.g=32375006;this.C=8192}k=Fg.prototype;k.toString=function(){return jc(this)};k.equiv=function(a){return this.D(null,a)};k.ba=function(a,b){if(b<Za(this))return this.start+b*this.step;if(this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};
k.Ea=function(a,b,c){return b<Za(this)?this.start+b*this.step:this.start>this.end&&0===this.step?this.start:c};k.Ha=function(){return new Eg(this.start,this.end,this.step)};k.P=function(){return this.v};k.wa=function(){return 0<this.step?this.start+this.step<this.end?new Fg(this.v,this.start+this.step,this.end,this.step,null):null:this.start+this.step>this.end?new Fg(this.v,this.start+this.step,this.end,this.step,null):null};k.Z=function(){return Oa(Kb(this))?0:Math.ceil((this.end-this.start)/this.step)};
k.S=function(){var a=this.u;return null!=a?a:this.u=a=Kc(this)};k.D=function(a,b){return Pc(this,b)};k.ca=function(){return Qc(Dc,this.v)};k.ea=function(a,b){return Uc(this,b)};k.fa=function(a,b,c){for(a=this.start;;)if(0<this.step?a<this.end:a>this.end){c=b.a?b.a(c,a):b.call(null,c,a);if(Tc(c))return K.b?K.b(c):K.call(null,c);a+=this.step}else return c};k.ta=function(){return null==Kb(this)?null:this.start};
k.xa=function(){return null!=Kb(this)?new Fg(this.v,this.start+this.step,this.end,this.step,null):Dc};k.U=function(){return 0<this.step?this.start<this.end?this:null:0>this.step?this.start>this.end?this:null:this.start===this.end?null:this};k.R=function(a,b){return new Fg(b,this.start,this.end,this.step,this.u)};k.X=function(a,b){return M(b,this)};Fg.prototype[Ta]=function(){return Fc(this)};
function Gg(a,b){return new ie(null,function(){var c=H(b);if(c){var d=I(c),e=a.b?a.b(d):a.call(null,d),d=M(d,Dg(function(b,c){return function(b){return rc.a(c,a.b?a.b(b):a.call(null,b))}}(d,e,c,c),J(c)));return M(d,Gg(a,H(Te(N(d),c))))}return null},null,null)}function Hg(a){return new ie(null,function(){var b=H(a);return b?Ig(Md,I(b),Cc(b)):bb(Dc,Md.m?Md.m():Md.call(null))},null,null)}
function Ig(a,b,c){return M(b,new ie(null,function(){var d=H(c);if(d){var e=Ig,f;f=I(d);f=a.a?a.a(b,f):a.call(null,b,f);d=e(a,f,Cc(d))}else d=null;return d},null,null))}
function Jg(a,b){return function(){function c(c,d,e){return new R(null,2,5,S,[a.c?a.c(c,d,e):a.call(null,c,d,e),b.c?b.c(c,d,e):b.call(null,c,d,e)],null)}function d(c,d){return new R(null,2,5,S,[a.a?a.a(c,d):a.call(null,c,d),b.a?b.a(c,d):b.call(null,c,d)],null)}function e(c){return new R(null,2,5,S,[a.b?a.b(c):a.call(null,c),b.b?b.b(c):b.call(null,c)],null)}function f(){return new R(null,2,5,S,[a.m?a.m():a.call(null),b.m?b.m():b.call(null)],null)}var g=null,h=function(){function c(a,b,e,f){var g=null;
if(3<arguments.length){for(var g=0,h=Array(arguments.length-3);g<h.length;)h[g]=arguments[g+3],++g;g=new Bc(h,0)}return d.call(this,a,b,e,g)}function d(c,e,f,g){return new R(null,2,5,S,[B.A(a,c,e,f,g),B.A(b,c,e,f,g)],null)}c.w=3;c.B=function(a){var b=I(a);a=J(a);var c=I(a);a=J(a);var e=I(a);a=Cc(a);return d(b,c,e,a)};c.h=d;return c}(),g=function(a,b,g,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);
default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+3],++q;q=new Bc(r,0)}return h.h(a,b,g,q)}throw Error("Invalid arity: "+arguments.length);};g.w=3;g.B=h.B;g.m=f;g.b=e;g.a=d;g.c=c;g.h=h.h;return g}()}
function wf(a,b,c,d,e,f,g){var h=za;za=null==za?null:za-1;try{if(null!=za&&0>za)return Pb(a,"#");Pb(a,c);if(0===Ja.b(f))H(g)&&Pb(a,function(){var a=Kg.b(f);return x(a)?a:"..."}());else{if(H(g)){var l=I(g);b.c?b.c(l,a,f):b.call(null,l,a,f)}for(var m=J(g),n=Ja.b(f)-1;;)if(!m||null!=n&&0===n){H(m)&&0===n&&(Pb(a,d),Pb(a,function(){var a=Kg.b(f);return x(a)?a:"..."}()));break}else{Pb(a,d);var p=I(m);c=a;g=f;b.c?b.c(p,c,g):b.call(null,p,c,g);var q=J(m);c=n-1;m=q;n=c}}return Pb(a,e)}finally{za=h}}
function Lg(a,b){for(var c=H(b),d=null,e=0,f=0;;)if(f<e){var g=d.ba(null,f);Pb(a,g);f+=1}else if(c=H(c))d=c,xd(d)?(c=ac(d),e=bc(d),d=c,g=N(c),c=e,e=g):(g=I(d),Pb(a,g),c=J(d),d=null,e=0),f=0;else return null}var Mg={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function Ng(a){return[A('"'),A(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return Mg[a]})),A('"')].join("")}Og;
function Pg(a,b){var c=Dd(C.a(a,Ha));return c?(c=null!=b?b.g&131072||b.Qc?!0:!1:!1)?null!=pd(b):c:c}
function Qg(a,b,c){if(null==a)return Pb(b,"nil");if(Pg(c,a)){Pb(b,"^");var d=pd(a);xf.c?xf.c(d,b,c):xf.call(null,d,b,c);Pb(b," ")}if(a.sb)return a.Ob(a,b,c);if(null!=a&&(a.g&2147483648||a.$))return a.L(null,b,c);if(!0===a||!1===a||"number"===typeof a)return Pb(b,""+A(a));if(null!=a&&a.constructor===Object)return Pb(b,"#js "),d=T.a(function(b){return new R(null,2,5,S,[he.b(b),a[b]],null)},yd(a)),Og.l?Og.l(d,xf,b,c):Og.call(null,d,xf,b,c);if(Na(a))return wf(b,xf,"#js ["," ","]",c,a);if("string"==typeof a)return x(Ga.b(c))?
Pb(b,Ng(a)):Pb(b,a);if(ca(a)){var e=a.name;c=x(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return Lg(b,G(["#object[",c,' "',""+A(a),'"]'],0))}if(a instanceof Date)return c=function(a,b){for(var c=""+A(a);;)if(N(c)<b)c=[A("0"),A(c)].join("");else return c},Lg(b,G(['#inst "',""+A(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),3),"-",'00:00"'],
0));if(a instanceof RegExp)return Lg(b,G(['#"',a.source,'"'],0));if(null!=a&&(a.g&2147483648||a.$))return Qb(a,b,c);if(x(a.constructor.Za))return Lg(b,G(["#object[",a.constructor.Za.replace(RegExp("/","g"),"."),"]"],0));e=a.constructor.name;c=x(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return Lg(b,G(["#object[",c," ",""+A(a),"]"],0))}function xf(a,b,c){var d=Rg.b(c);return x(d)?(c=Q.c(c,Sg,Qg),d.c?d.c(a,b,c):d.call(null,a,b,c)):Qg(a,b,c)}
var Oe=function Oe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Oe.h(0<c.length?new Bc(c.slice(0),0):null)};Oe.h=function(a){var b=Ea();if(qd(a))b="";else{var c=A,d=new qa;a:{var e=new ic(d);xf(I(a),e,b);a=H(J(a));for(var f=null,g=0,h=0;;)if(h<g){var l=f.ba(null,h);Pb(e," ");xf(l,e,b);h+=1}else if(a=H(a))f=a,xd(f)?(a=ac(f),g=bc(f),f=a,l=N(a),a=g,g=l):(l=I(f),Pb(e," "),xf(l,e,b),a=J(f),f=null,g=0),h=0;else break a}b=""+c(d)}return b};Oe.w=0;Oe.B=function(a){return Oe.h(H(a))};
function Og(a,b,c,d){return wf(c,function(a,c,d){var h=sb(a);b.c?b.c(h,c,d):b.call(null,h,c,d);Pb(c," ");a=tb(a);return b.c?b.c(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,H(a))}Re.prototype.$=!0;Re.prototype.L=function(a,b,c){Pb(b,"#object [cljs.core.Volatile ");xf(new v(null,1,[Tg,this.state],null),b,c);return Pb(b,"]")};Bc.prototype.$=!0;Bc.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};ie.prototype.$=!0;ie.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};
mg.prototype.$=!0;mg.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};rg.prototype.$=!0;rg.prototype.L=function(a,b,c){return wf(b,xf,"["," ","]",c,this)};Pf.prototype.$=!0;Pf.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};Hc.prototype.$=!0;Hc.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};wd.prototype.$=!0;wd.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};ee.prototype.$=!0;
ee.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};$c.prototype.$=!0;$c.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};ld.prototype.$=!0;ld.prototype.L=function(a,b,c){return Og(this,xf,b,c)};ng.prototype.$=!0;ng.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};Df.prototype.$=!0;Df.prototype.L=function(a,b,c){return wf(b,xf,"["," ","]",c,this)};yg.prototype.$=!0;yg.prototype.L=function(a,b,c){return wf(b,xf,"#{"," ","}",c,this)};vd.prototype.$=!0;
vd.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};Me.prototype.$=!0;Me.prototype.L=function(a,b,c){Pb(b,"#object [cljs.core.Atom ");xf(new v(null,1,[Tg,this.state],null),b,c);return Pb(b,"]")};ug.prototype.$=!0;ug.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};qg.prototype.$=!0;qg.prototype.L=function(a,b,c){return wf(b,xf,"["," ","]",c,this)};R.prototype.$=!0;R.prototype.L=function(a,b,c){return wf(b,xf,"["," ","]",c,this)};ce.prototype.$=!0;
ce.prototype.L=function(a,b){return Pb(b,"()")};De.prototype.$=!0;De.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};v.prototype.$=!0;v.prototype.L=function(a,b,c){return Og(this,xf,b,c)};Fg.prototype.$=!0;Fg.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};tg.prototype.$=!0;tg.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};ad.prototype.$=!0;ad.prototype.L=function(a,b,c){return wf(b,xf,"("," ",")",c,this)};qc.prototype.Db=!0;
qc.prototype.ob=function(a,b){if(b instanceof qc)return yc(this,b);throw Error([A("Cannot compare "),A(this),A(" to "),A(b)].join(""));};y.prototype.Db=!0;y.prototype.ob=function(a,b){if(b instanceof y)return fe(this,b);throw Error([A("Cannot compare "),A(this),A(" to "),A(b)].join(""));};Df.prototype.Db=!0;Df.prototype.ob=function(a,b){if(ud(b))return Gd(this,b);throw Error([A("Cannot compare "),A(this),A(" to "),A(b)].join(""));};R.prototype.Db=!0;
R.prototype.ob=function(a,b){if(ud(b))return Gd(this,b);throw Error([A("Cannot compare "),A(this),A(" to "),A(b)].join(""));};var Ug=null;function Vg(a){null==Ug&&(Ug=X.b?X.b(0):X.call(null,0));return zc.b([A(a),A(Qe.a(Ug,Rc))].join(""))}function Wg(a){return function(b,c){var d=a.a?a.a(b,c):a.call(null,b,c);return Tc(d)?new Sc(d):d}}
function Ze(a){return function(b){return function(){function c(a,c){return Va.c(b,a,c)}function d(b){return a.b?a.b(b):a.call(null,b)}function e(){return a.m?a.m():a.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.m=e;f.b=d;f.a=c;return f}()}(Wg(a))}Xg;function Yg(){}
var Zg=function Zg(b){if(null!=b&&null!=b.Nc)return b.Nc(b);var c=Zg[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Zg._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("IEncodeJS.-clj-\x3ejs",b);};$g;function ah(a){return(null!=a?a.Mc||(a.Zb?0:Pa(Yg,a)):Pa(Yg,a))?Zg(a):"string"===typeof a||"number"===typeof a||a instanceof y||a instanceof qc?$g.b?$g.b(a):$g.call(null,a):Oe.h(G([a],0))}
var $g=function $g(b){if(null==b)return null;if(null!=b?b.Mc||(b.Zb?0:Pa(Yg,b)):Pa(Yg,b))return Zg(b);if(b instanceof y)return Wd(b);if(b instanceof qc)return""+A(b);if(td(b)){var c={};b=H(b);for(var d=null,e=0,f=0;;)if(f<e){var g=d.ba(null,f),h=P(g,0),g=P(g,1);c[ah(h)]=$g(g);f+=1}else if(b=H(b))xd(b)?(e=ac(b),b=bc(b),d=e,e=N(e)):(e=I(b),d=P(e,0),e=P(e,1),c[ah(d)]=$g(e),b=J(b),d=null,e=0),f=0;else break;return c}if(null==b?0:null!=b?b.g&8||b.rd||(b.g?0:Pa(ab,b)):Pa(ab,b)){c=[];b=H(T.a($g,b));d=null;
for(f=e=0;;)if(f<e)h=d.ba(null,f),c.push(h),f+=1;else if(b=H(b))d=b,xd(d)?(b=ac(d),f=bc(d),d=b,e=N(b),b=f):(b=I(d),c.push(b),b=J(d),d=null,e=0),f=0;else break;return c}return b},Xg=function Xg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Xg.m();case 1:return Xg.b(arguments[0]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};Xg.m=function(){return Xg.b(1)};Xg.b=function(a){return Math.random()*a};Xg.w=1;
function bh(a,b){return te(Va.c(function(b,d){var e=a.b?a.b(d):a.call(null,d);return ve(b,e,hd.a(C.c(b,e,id),d))},Tb(W),b))}var ch=null;function dh(){if(null==ch){var a=new v(null,3,[eh,W,fh,W,gh,W],null);ch=X.b?X.b(a):X.call(null,a)}return ch}function hh(a,b,c){var d=rc.a(b,c);if(!d&&!(d=Ed(gh.b(a).call(null,b),c))&&(d=ud(c))&&(d=ud(b)))if(d=N(c)===N(b))for(var d=!0,e=0;;)if(d&&e!==N(c))d=hh(a,b.b?b.b(e):b.call(null,e),c.b?c.b(e):c.call(null,e)),e+=1;else return d;else return d;else return d}
function ih(a){var b;b=dh();b=K.b?K.b(b):K.call(null,b);return xe(C.a(eh.b(b),a))}function jh(a,b,c,d){Qe.a(a,function(){return K.b?K.b(b):K.call(null,b)});Qe.a(c,function(){return K.b?K.b(d):K.call(null,d)})}
var kh=function kh(b,c,d){var e=(K.b?K.b(d):K.call(null,d)).call(null,b),e=x(x(e)?e.b?e.b(c):e.call(null,c):e)?!0:null;if(x(e))return e;e=function(){for(var e=ih(c);;)if(0<N(e))kh(b,I(e),d),e=Cc(e);else return null}();if(x(e))return e;e=function(){for(var e=ih(b);;)if(0<N(e))kh(I(e),c,d),e=Cc(e);else return null}();return x(e)?e:!1};function lh(a,b,c){c=kh(a,b,c);if(x(c))a=c;else{c=hh;var d;d=dh();d=K.b?K.b(d):K.call(null,d);a=c(d,a,b)}return a}
var mh=function mh(b,c,d,e,f,g,h){var l=Va.c(function(e,g){var h=P(g,0);P(g,1);if(hh(K.b?K.b(d):K.call(null,d),c,h)){var l;l=(l=null==e)?l:lh(h,I(e),f);l=x(l)?g:e;if(!x(lh(I(l),h,f)))throw Error([A("Multiple methods in multimethod '"),A(b),A("' match dispatch value: "),A(c),A(" -\x3e "),A(h),A(" and "),A(I(l)),A(", and neither is preferred")].join(""));return l}return e},null,K.b?K.b(e):K.call(null,e));if(x(l)){if(rc.a(K.b?K.b(h):K.call(null,h),K.b?K.b(d):K.call(null,d)))return Qe.l(g,Q,c,fd(l)),
fd(l);jh(g,e,h,d);return mh(b,c,d,e,f,g,h)}return null};function nh(a,b){throw Error([A("No method in multimethod '"),A(a),A("' for dispatch value: "),A(b)].join(""));}function oh(a,b,c,d,e,f,g,h){this.name=a;this.j=b;this.Zc=c;this.Qb=d;this.zb=e;this.jd=f;this.Tb=g;this.Cb=h;this.g=4194305;this.C=4352}k=oh.prototype;
k.call=function(){function a(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u,D,F,E,L,O){a=this;var Aa=B.h(a.j,b,c,d,e,G([f,g,h,l,m,n,p,q,r,w,z,u,D,F,E,L,O],0)),Jk=ph(this,Aa);x(Jk)||nh(a.name,Aa);return B.h(Jk,b,c,d,e,G([f,g,h,l,m,n,p,q,r,w,z,u,D,F,E,L,O],0))}function b(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u,D,F,E,L){a=this;var O=a.j.qa?a.j.qa(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u,D,F,E,L):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u,D,F,E,L),Aa=ph(this,O);x(Aa)||nh(a.name,O);return Aa.qa?Aa.qa(b,c,d,e,f,g,h,l,m,n,p,q,r,
w,z,u,D,F,E,L):Aa.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u,D,F,E,L)}function c(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u,D,F,E){a=this;var L=a.j.pa?a.j.pa(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u,D,F,E):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u,D,F,E),O=ph(this,L);x(O)||nh(a.name,L);return O.pa?O.pa(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u,D,F,E):O.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u,D,F,E)}function d(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u,D,F){a=this;var E=a.j.oa?a.j.oa(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u,D,F):a.j.call(null,
b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u,D,F),L=ph(this,E);x(L)||nh(a.name,E);return L.oa?L.oa(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u,D,F):L.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u,D,F)}function e(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u,D){a=this;var F=a.j.na?a.j.na(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u,D):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u,D),E=ph(this,F);x(E)||nh(a.name,F);return E.na?E.na(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u,D):E.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u,D)}function f(a,b,c,d,e,f,g,h,l,m,n,p,q,r,
w,z,u){a=this;var D=a.j.ma?a.j.ma(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u),F=ph(this,D);x(F)||nh(a.name,D);return F.ma?F.ma(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u):F.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u)}function g(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z){a=this;var u=a.j.la?a.j.la(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z),D=ph(this,u);x(D)||nh(a.name,u);return D.la?D.la(b,c,d,e,f,g,h,l,m,n,p,q,r,w,z):D.call(null,b,c,d,e,f,g,h,l,m,n,p,
q,r,w,z)}function h(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w){a=this;var z=a.j.ka?a.j.ka(b,c,d,e,f,g,h,l,m,n,p,q,r,w):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w),u=ph(this,z);x(u)||nh(a.name,z);return u.ka?u.ka(b,c,d,e,f,g,h,l,m,n,p,q,r,w):u.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r,w)}function l(a,b,c,d,e,f,g,h,l,m,n,p,q,r){a=this;var w=a.j.ja?a.j.ja(b,c,d,e,f,g,h,l,m,n,p,q,r):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q,r),z=ph(this,w);x(z)||nh(a.name,w);return z.ja?z.ja(b,c,d,e,f,g,h,l,m,n,p,q,r):z.call(null,b,c,d,e,f,
g,h,l,m,n,p,q,r)}function m(a,b,c,d,e,f,g,h,l,m,n,p,q){a=this;var r=a.j.ia?a.j.ia(b,c,d,e,f,g,h,l,m,n,p,q):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p,q),w=ph(this,r);x(w)||nh(a.name,r);return w.ia?w.ia(b,c,d,e,f,g,h,l,m,n,p,q):w.call(null,b,c,d,e,f,g,h,l,m,n,p,q)}function n(a,b,c,d,e,f,g,h,l,m,n,p){a=this;var q=a.j.ha?a.j.ha(b,c,d,e,f,g,h,l,m,n,p):a.j.call(null,b,c,d,e,f,g,h,l,m,n,p),r=ph(this,q);x(r)||nh(a.name,q);return r.ha?r.ha(b,c,d,e,f,g,h,l,m,n,p):r.call(null,b,c,d,e,f,g,h,l,m,n,p)}function p(a,b,
c,d,e,f,g,h,l,m,n){a=this;var p=a.j.ga?a.j.ga(b,c,d,e,f,g,h,l,m,n):a.j.call(null,b,c,d,e,f,g,h,l,m,n),q=ph(this,p);x(q)||nh(a.name,p);return q.ga?q.ga(b,c,d,e,f,g,h,l,m,n):q.call(null,b,c,d,e,f,g,h,l,m,n)}function q(a,b,c,d,e,f,g,h,l,m){a=this;var n=a.j.sa?a.j.sa(b,c,d,e,f,g,h,l,m):a.j.call(null,b,c,d,e,f,g,h,l,m),p=ph(this,n);x(p)||nh(a.name,n);return p.sa?p.sa(b,c,d,e,f,g,h,l,m):p.call(null,b,c,d,e,f,g,h,l,m)}function r(a,b,c,d,e,f,g,h,l){a=this;var m=a.j.ra?a.j.ra(b,c,d,e,f,g,h,l):a.j.call(null,
b,c,d,e,f,g,h,l),n=ph(this,m);x(n)||nh(a.name,m);return n.ra?n.ra(b,c,d,e,f,g,h,l):n.call(null,b,c,d,e,f,g,h,l)}function u(a,b,c,d,e,f,g,h){a=this;var l=a.j.aa?a.j.aa(b,c,d,e,f,g,h):a.j.call(null,b,c,d,e,f,g,h),m=ph(this,l);x(m)||nh(a.name,l);return m.aa?m.aa(b,c,d,e,f,g,h):m.call(null,b,c,d,e,f,g,h)}function w(a,b,c,d,e,f,g){a=this;var h=a.j.T?a.j.T(b,c,d,e,f,g):a.j.call(null,b,c,d,e,f,g),l=ph(this,h);x(l)||nh(a.name,h);return l.T?l.T(b,c,d,e,f,g):l.call(null,b,c,d,e,f,g)}function z(a,b,c,d,e,f){a=
this;var g=a.j.A?a.j.A(b,c,d,e,f):a.j.call(null,b,c,d,e,f),h=ph(this,g);x(h)||nh(a.name,g);return h.A?h.A(b,c,d,e,f):h.call(null,b,c,d,e,f)}function D(a,b,c,d,e){a=this;var f=a.j.l?a.j.l(b,c,d,e):a.j.call(null,b,c,d,e),g=ph(this,f);x(g)||nh(a.name,f);return g.l?g.l(b,c,d,e):g.call(null,b,c,d,e)}function F(a,b,c,d){a=this;var e=a.j.c?a.j.c(b,c,d):a.j.call(null,b,c,d),f=ph(this,e);x(f)||nh(a.name,e);return f.c?f.c(b,c,d):f.call(null,b,c,d)}function L(a,b,c){a=this;var d=a.j.a?a.j.a(b,c):a.j.call(null,
b,c),e=ph(this,d);x(e)||nh(a.name,d);return e.a?e.a(b,c):e.call(null,b,c)}function O(a,b){a=this;var c=a.j.b?a.j.b(b):a.j.call(null,b),d=ph(this,c);x(d)||nh(a.name,c);return d.b?d.b(b):d.call(null,b)}function Aa(a){a=this;var b=a.j.m?a.j.m():a.j.call(null),c=ph(this,b);x(c)||nh(a.name,b);return c.m?c.m():c.call(null)}var E=null,E=function(ka,E,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa,Jb,Xa,jb,kb,Bb,Jc,zd,nf){switch(arguments.length){case 1:return Aa.call(this,ka);case 2:return O.call(this,ka,E);case 3:return L.call(this,
ka,E,U);case 4:return F.call(this,ka,E,U,V);case 5:return D.call(this,ka,E,U,V,ha);case 6:return z.call(this,ka,E,U,V,ha,ia);case 7:return w.call(this,ka,E,U,V,ha,ia,ja);case 8:return u.call(this,ka,E,U,V,ha,ia,ja,la);case 9:return r.call(this,ka,E,U,V,ha,ia,ja,la,oa);case 10:return q.call(this,ka,E,U,V,ha,ia,ja,la,oa,ta);case 11:return p.call(this,ka,E,U,V,ha,ia,ja,la,oa,ta,ya);case 12:return n.call(this,ka,E,U,V,ha,ia,ja,la,oa,ta,ya,Ca);case 13:return m.call(this,ka,E,U,V,ha,ia,ja,la,oa,ta,ya,Ca,
Da);case 14:return l.call(this,ka,E,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa);case 15:return h.call(this,ka,E,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa,Jb);case 16:return g.call(this,ka,E,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa,Jb,Xa);case 17:return f.call(this,ka,E,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa,Jb,Xa,jb);case 18:return e.call(this,ka,E,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa,Jb,Xa,jb,kb);case 19:return d.call(this,ka,E,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa,Jb,Xa,jb,kb,Bb);case 20:return c.call(this,ka,E,U,V,ha,ia,ja,la,oa,
ta,ya,Ca,Da,Qa,Jb,Xa,jb,kb,Bb,Jc);case 21:return b.call(this,ka,E,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa,Jb,Xa,jb,kb,Bb,Jc,zd);case 22:return a.call(this,ka,E,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa,Jb,Xa,jb,kb,Bb,Jc,zd,nf)}throw Error("Invalid arity: "+arguments.length);};E.b=Aa;E.a=O;E.c=L;E.l=F;E.A=D;E.T=z;E.aa=w;E.ra=u;E.sa=r;E.ga=q;E.ha=p;E.ia=n;E.ja=m;E.ka=l;E.la=h;E.ma=g;E.na=f;E.oa=e;E.pa=d;E.qa=c;E.Fb=b;E.qb=a;return E}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ua(b)))};
k.m=function(){var a=this.j.m?this.j.m():this.j.call(null),b=ph(this,a);x(b)||nh(this.name,a);return b.m?b.m():b.call(null)};k.b=function(a){var b=this.j.b?this.j.b(a):this.j.call(null,a),c=ph(this,b);x(c)||nh(this.name,b);return c.b?c.b(a):c.call(null,a)};k.a=function(a,b){var c=this.j.a?this.j.a(a,b):this.j.call(null,a,b),d=ph(this,c);x(d)||nh(this.name,c);return d.a?d.a(a,b):d.call(null,a,b)};
k.c=function(a,b,c){var d=this.j.c?this.j.c(a,b,c):this.j.call(null,a,b,c),e=ph(this,d);x(e)||nh(this.name,d);return e.c?e.c(a,b,c):e.call(null,a,b,c)};k.l=function(a,b,c,d){var e=this.j.l?this.j.l(a,b,c,d):this.j.call(null,a,b,c,d),f=ph(this,e);x(f)||nh(this.name,e);return f.l?f.l(a,b,c,d):f.call(null,a,b,c,d)};k.A=function(a,b,c,d,e){var f=this.j.A?this.j.A(a,b,c,d,e):this.j.call(null,a,b,c,d,e),g=ph(this,f);x(g)||nh(this.name,f);return g.A?g.A(a,b,c,d,e):g.call(null,a,b,c,d,e)};
k.T=function(a,b,c,d,e,f){var g=this.j.T?this.j.T(a,b,c,d,e,f):this.j.call(null,a,b,c,d,e,f),h=ph(this,g);x(h)||nh(this.name,g);return h.T?h.T(a,b,c,d,e,f):h.call(null,a,b,c,d,e,f)};k.aa=function(a,b,c,d,e,f,g){var h=this.j.aa?this.j.aa(a,b,c,d,e,f,g):this.j.call(null,a,b,c,d,e,f,g),l=ph(this,h);x(l)||nh(this.name,h);return l.aa?l.aa(a,b,c,d,e,f,g):l.call(null,a,b,c,d,e,f,g)};
k.ra=function(a,b,c,d,e,f,g,h){var l=this.j.ra?this.j.ra(a,b,c,d,e,f,g,h):this.j.call(null,a,b,c,d,e,f,g,h),m=ph(this,l);x(m)||nh(this.name,l);return m.ra?m.ra(a,b,c,d,e,f,g,h):m.call(null,a,b,c,d,e,f,g,h)};k.sa=function(a,b,c,d,e,f,g,h,l){var m=this.j.sa?this.j.sa(a,b,c,d,e,f,g,h,l):this.j.call(null,a,b,c,d,e,f,g,h,l),n=ph(this,m);x(n)||nh(this.name,m);return n.sa?n.sa(a,b,c,d,e,f,g,h,l):n.call(null,a,b,c,d,e,f,g,h,l)};
k.ga=function(a,b,c,d,e,f,g,h,l,m){var n=this.j.ga?this.j.ga(a,b,c,d,e,f,g,h,l,m):this.j.call(null,a,b,c,d,e,f,g,h,l,m),p=ph(this,n);x(p)||nh(this.name,n);return p.ga?p.ga(a,b,c,d,e,f,g,h,l,m):p.call(null,a,b,c,d,e,f,g,h,l,m)};k.ha=function(a,b,c,d,e,f,g,h,l,m,n){var p=this.j.ha?this.j.ha(a,b,c,d,e,f,g,h,l,m,n):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n),q=ph(this,p);x(q)||nh(this.name,p);return q.ha?q.ha(a,b,c,d,e,f,g,h,l,m,n):q.call(null,a,b,c,d,e,f,g,h,l,m,n)};
k.ia=function(a,b,c,d,e,f,g,h,l,m,n,p){var q=this.j.ia?this.j.ia(a,b,c,d,e,f,g,h,l,m,n,p):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p),r=ph(this,q);x(r)||nh(this.name,q);return r.ia?r.ia(a,b,c,d,e,f,g,h,l,m,n,p):r.call(null,a,b,c,d,e,f,g,h,l,m,n,p)};k.ja=function(a,b,c,d,e,f,g,h,l,m,n,p,q){var r=this.j.ja?this.j.ja(a,b,c,d,e,f,g,h,l,m,n,p,q):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q),u=ph(this,r);x(u)||nh(this.name,r);return u.ja?u.ja(a,b,c,d,e,f,g,h,l,m,n,p,q):u.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q)};
k.ka=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){var u=this.j.ka?this.j.ka(a,b,c,d,e,f,g,h,l,m,n,p,q,r):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r),w=ph(this,u);x(w)||nh(this.name,u);return w.ka?w.ka(a,b,c,d,e,f,g,h,l,m,n,p,q,r):w.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r)};
k.la=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u){var w=this.j.la?this.j.la(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u),z=ph(this,w);x(z)||nh(this.name,w);return z.la?z.la(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u):z.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u)};
k.ma=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w){var z=this.j.ma?this.j.ma(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w),D=ph(this,z);x(D)||nh(this.name,z);return D.ma?D.ma(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w):D.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w)};
k.na=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z){var D=this.j.na?this.j.na(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z),F=ph(this,D);x(F)||nh(this.name,D);return F.na?F.na(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z):F.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z)};
k.oa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D){var F=this.j.oa?this.j.oa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D),L=ph(this,F);x(L)||nh(this.name,F);return L.oa?L.oa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D):L.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D)};
k.pa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F){var L=this.j.pa?this.j.pa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F),O=ph(this,L);x(O)||nh(this.name,L);return O.pa?O.pa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F):O.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F)};
k.qa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F,L){var O=this.j.qa?this.j.qa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F,L):this.j.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F,L),Aa=ph(this,O);x(Aa)||nh(this.name,O);return Aa.qa?Aa.qa(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F,L):Aa.call(null,a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F,L)};
k.Fb=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F,L,O){var Aa=B.h(this.j,a,b,c,d,G([e,f,g,h,l,m,n,p,q,r,u,w,z,D,F,L,O],0)),E=ph(this,Aa);x(E)||nh(this.name,Aa);return B.h(E,a,b,c,d,G([e,f,g,h,l,m,n,p,q,r,u,w,z,D,F,L,O],0))};function qh(a,b,c){Qe.l(a.zb,Q,b,c);jh(a.Tb,a.zb,a.Cb,a.Qb)}
function ph(a,b){rc.a(K.b?K.b(a.Cb):K.call(null,a.Cb),K.b?K.b(a.Qb):K.call(null,a.Qb))||jh(a.Tb,a.zb,a.Cb,a.Qb);var c=(K.b?K.b(a.Tb):K.call(null,a.Tb)).call(null,b);if(x(c))return c;c=mh(a.name,b,a.Qb,a.zb,a.jd,a.Tb,a.Cb);return x(c)?c:(K.b?K.b(a.zb):K.call(null,a.zb)).call(null,a.Zc)}k.Jb=function(){return dc(this.name)};k.Kb=function(){return ec(this.name)};k.S=function(){return this[da]||(this[da]=++ea)};var rh=new y(null,"y","y",-1757859776),sh=new y(null,"text-anchor","text-anchor",585613696),th=new y(null,"path","path",-188191168),uh=new y(null,"penny-spacing","penny-spacing",-20780703),vh=new y(null,"supplier","supplier",18255489),wh=new y(null,"determine-capacity","determine-capacity",-452765887),xh=new y(null,"by-station","by-station",516084641),yh=new y(null,"selector","selector",762528866),zh=new y(null,"basic+efficient+fixed","basic+efficient+fixed",-1106868702),Ah=new y(null,"r","r",-471384190),
Bh=new y(null,"run","run",-1821166653),Ch=new y(null,"richpath","richpath",-150197948),Dh=new y(null,"turns","turns",-1118736892),Eh=new y(null,"transform","transform",1381301764),Fh=new y(null,"die","die",-547192252),Ha=new y(null,"meta","meta",1499536964),Gh=new y(null,"transformer","transformer",-1493470620),Hh=new y(null,"dx","dx",-381796732),Ih=new y(null,"color","color",1011675173),Jh=new y(null,"executors","executors",-331073403),Ia=new y(null,"dup","dup",556298533),Kh=new y(null,"intaking",
"intaking",-1009888859),Lh=new y(null,"running?","running?",-257884763),Mh=new y(null,"processing","processing",-1576405467),Nh=new y(null,"key","key",-1516042587),Oh=new y(null,"stats-history","stats-history",636123973),Ph=new y(null,"spout-y","spout-y",1676697606),Qh=new y(null,"stations","stations",-19744730),Rh=new y(null,"capacity","capacity",72689734),Sh=new y(null,"disabled","disabled",-1529784218),Th=new y(null,"private","private",-558947994),Uh=new y(null,"efficient","efficient",-63016538),
Vh=new y(null,"graphs?","graphs?",-270895578),Wh=new y(null,"transform*","transform*",-1613794522),Xh=new y(null,"button","button",1456579943),Yh=new y(null,"top","top",-1856271961),Zh=new y(null,"basic+efficient","basic+efficient",-970783161),Ne=new y(null,"validator","validator",-1966190681),$h=new y(null,"total-utilization","total-utilization",-1341502521),ai=new y(null,"use","use",-1846382424),bi=new y(null,"default","default",-1987822328),ci=new y(null,"finally-block","finally-block",832982472),
di=new y(null,"name","name",1843675177),ei=new y(null,"scenarios","scenarios",1618559369),fi=new y(null,"formatter","formatter",-483008823),gi=new y(null,"value","value",305978217),hi=new y(null,"green","green",-945526839),ii=new y(null,"section","section",-300141526),ji=new qc(null,"meta19241","meta19241",759774602,null),ki=new y(null,"circle","circle",1903212362),li=new y(null,"drop","drop",364481611),mi=new y(null,"tracer","tracer",-1844475765),ni=new y(null,"width","width",-384071477),oi=new y(null,
"supply","supply",-1701696309),pi=new y(null,"spath","spath",-1857758005),qi=new y(null,"source-spout-y","source-spout-y",1447094571),ri=new y(null,"onclick","onclick",1297553739),si=new y(null,"dy","dy",1719547243),ti=new y(null,"penny","penny",1653999051),ui=new y(null,"params","params",710516235),vi=new y(null,"total-output","total-output",1149740747),wi=new y(null,"easing","easing",735372043),Tg=new y(null,"val","val",128701612),xi=new y(null,"delivery","delivery",-1844470516),yi=new y(null,"recur",
"recur",-437573268),zi=new y(null,"type","type",1174270348),Ai=new y(null,"catch-block","catch-block",1175212748),Bi=new y(null,"duration","duration",1444101068),Ci=new y(null,"execute","execute",-129499188),Di=new y(null,"delivered","delivered",474109932),Ei=new y(null,"constrained","constrained",597287981),Fi=new y(null,"intaking?","intaking?",834765),Sg=new y(null,"fallback-impl","fallback-impl",-1501286995),Gi=new y(null,"output","output",-1105869043),Hi=new y(null,"original-setup","original-setup",
2029721421),Fa=new y(null,"flush-on-newline","flush-on-newline",-151457939),Ce=new qc(null,"meta23151","meta23151",-938848818,null),Ii=new y(null,"normal","normal",-1519123858),Ji=new y(null,"wip","wip",-103467282),Ki=new y(null,"averages","averages",-1747836978),Li=new y(null,"className","className",-1983287057),fh=new y(null,"descendants","descendants",1824886031),Mi=new y(null,"size","size",1098693007),Ni=new y(null,"accessor","accessor",-25476721),Oi=new y(null,"title","title",636505583),Pi=new y(null,
"running","running",1554969103),Qi=new qc(null,"folder","folder",-1138554033,null),Ri=new y(null,"num-needed-params","num-needed-params",-1219326097),Si=new y(null,"dropping","dropping",125809647),Ti=new y(null,"high","high",2027297808),Ui=new y(null,"setup","setup",1987730512),gh=new y(null,"ancestors","ancestors",-776045424),Vi=new y(null,"style","style",-496642736),Wi=new y(null,"div","div",1057191632),Ga=new y(null,"readably","readably",1129599760),Xi=new y(null,"params-idx","params-idx",340984624),
Yi=new qc(null,"box","box",-1123515375,null),Kg=new y(null,"more-marker","more-marker",-14717935),Zi=new y(null,"percent-utilization","percent-utilization",-2006109103),$i=new y(null,"g","g",1738089905),aj=new y(null,"update-stats","update-stats",1938193073),bj=new y(null,"basic+efficient+constrained","basic+efficient+constrained",-815375631),cj=new y(null,"info?","info?",361925553),dj=new y(null,"transfer-to-next-station","transfer-to-next-station",-114193262),ej=new y(null,"set-spacing","set-spacing",
1920968978),fj=new y(null,"intake","intake",-108984782),gj=new qc(null,"meta19050","meta19050",-216624238,null),hj=new qc(null,"coll","coll",-1006698606,null),ij=new y(null,"line","line",212345235),jj=new y(null,"basic+efficient+constrained+fixed","basic+efficient+constrained+fixed",-963095949),kj=new qc(null,"val","val",1769233139,null),lj=new qc(null,"meta22009","meta22009",-1216593069,null),mj=new qc(null,"xf","xf",2042434515,null),Ja=new y(null,"print-length","print-length",1931866356),nj=new y(null,
"select*","select*",-1829914060),oj=new y(null,"cx","cx",1272694324),pj=new y(null,"id","id",-1388402092),qj=new y(null,"class","class",-2030961996),rj=new y(null,"red","red",-969428204),sj=new y(null,"blue","blue",-622100620),tj=new y(null,"cy","cy",755331060),uj=new y(null,"catch-exception","catch-exception",-1997306795),vj=new y(null,"total-input","total-input",1219129557),eh=new y(null,"parents","parents",-2027538891),wj=new y(null,"collect-val","collect-val",801894069),xj=new y(null,"xlink:href",
"xlink:href",828777205),yj=new y(null,"prev","prev",-1597069226),zj=new y(null,"svg","svg",856789142),Aj=new y(null,"info","info",-317069002),Bj=new y(null,"bin-h","bin-h",346004918),Cj=new y(null,"length","length",588987862),Dj=new y(null,"continue-block","continue-block",-1852047850),Ej=new qc(null,"meta22072","meta22072",-1523293610,null),Fj=new y(null,"hookTransition","hookTransition",-1045887913),Gj=new y(null,"tracer-reset","tracer-reset",283192087),Hj=new y(null,"distribution","distribution",
-284555369),Ij=new y(null,"transfer-to-processed","transfer-to-processed",198231991),Jj=new y(null,"roll","roll",11266999),Kj=new y(null,"position","position",-2011731912),Lj=new y(null,"graphs","graphs",-1584479112),Mj=new y(null,"basic","basic",1043717368),Nj=new y(null,"image","image",-58725096),Oj=new y(null,"d","d",1972142424),Pj=new y(null,"average","average",-492356168),Qj=new y(null,"dropping?","dropping?",-1065207176),Rj=new y(null,"processed","processed",800622264),Sj=new y(null,"x","x",
2099068185),Tj=new y(null,"run-next","run-next",1110241561),Uj=new y(null,"x1","x1",-1863922247),Vj=new y(null,"tracer-start","tracer-start",1036491225),Wj=new y(null,"rerender","rerender",-1601192263),Xj=new y(null,"domain","domain",1847214937),Yj=new y(null,"transform-fns","transform-fns",669042649),Be=new qc(null,"quote","quote",1377916282,null),Zj=new y(null,"purple","purple",-876021126),ak=new y(null,"fixed","fixed",-562004358),Ae=new y(null,"arglists","arglists",1661989754),bk=new y(null,"dice",
"dice",707777434),ck=new y(null,"y2","y2",-718691301),dk=new y(null,"set-lengths","set-lengths",742672507),ze=new qc(null,"nil-iter","nil-iter",1101030523,null),ek=new y(null,"main","main",-2117802661),fk=new y(null,"hierarchy","hierarchy",-1053470341),Rg=new y(null,"alt-impl","alt-impl",670969595),gk=new y(null,"under-utilized","under-utilized",-524567781),hk=new qc(null,"fn-handler","fn-handler",648785851,null),ik=new y(null,"doc","doc",1913296891),jk=new y(null,"integrate","integrate",-1653689604),
kk=new y(null,"rect","rect",-108902628),lk=new y(null,"step","step",1288888124),mk=new y(null,"delay","delay",-574225219),nk=new y(null,"stats","stats",-85643011),ok=new y(null,"x2","x2",-1362513475),pk=new y(null,"pennies","pennies",1847043709),qk=new y(null,"incoming","incoming",-1710131427),rk=new y(null,"productivity","productivity",-890721314),sk=new y(null,"range","range",1639692286),tk=new y(null,"height","height",1025178622),uk=new y(null,"spacing","spacing",204422175),vk=new y(null,"left",
"left",-399115937),wk=new y("cljs.core","not-found","cljs.core/not-found",-1572889185),xk=new y(null,"foreignObject","foreignObject",25502111),yk=new y(null,"text","text",-1790561697),zk=new y(null,"data","data",-232669377),Ak=new qc(null,"f","f",43394975,null);function Bk(a){return document.querySelector([A("#"),A(a),A(" .penny-path")].join(""))}function Ck(a){return document.querySelector([A("#"),A(a),A(" .ramp")].join(""))};var Dk;a:{var Ek=aa.navigator;if(Ek){var Fk=Ek.userAgent;if(Fk){Dk=Fk;break a}}Dk=""};var Gk;function Hk(a){return a.m?a.m():a.call(null)}function Ik(a,b,c){return td(c)?Fb(c,a,b):null==c?b:Na(c)?Xc(c,a,b):Eb.c(c,a,b)}
var Kk=function Kk(b,c,d,e){if(null!=b&&null!=b.kc)return b.kc(b,c,d,e);var f=Kk[t(null==b?null:b)];if(null!=f)return f.l?f.l(b,c,d,e):f.call(null,b,c,d,e);f=Kk._;if(null!=f)return f.l?f.l(b,c,d,e):f.call(null,b,c,d,e);throw Ra("CollFold.coll-fold",b);},Lk=function Lk(b,c){"undefined"===typeof Gk&&(Gk=function(b,c,f,g){this.ad=b;this.$b=c;this.Wa=f;this.cd=g;this.g=917504;this.C=0},Gk.prototype.R=function(b,c){return new Gk(this.ad,this.$b,this.Wa,c)},Gk.prototype.P=function(){return this.cd},Gk.prototype.ea=
function(b,c){return Eb.c(this.$b,this.Wa.b?this.Wa.b(c):this.Wa.call(null,c),c.m?c.m():c.call(null))},Gk.prototype.fa=function(b,c,f){return Eb.c(this.$b,this.Wa.b?this.Wa.b(c):this.Wa.call(null,c),f)},Gk.prototype.kc=function(b,c,f,g){return Kk(this.$b,c,f,this.Wa.b?this.Wa.b(g):this.Wa.call(null,g))},Gk.cc=function(){return new R(null,4,5,S,[Qc(Qi,new v(null,2,[Ae,pc(Be,pc(new R(null,2,5,S,[hj,mj],null))),ik,"Given a foldable collection, and a transformation function xf,\n  returns a foldable collection, where any supplied reducing\n  fn will be transformed by xf. xf is a function of reducing fn to\n  reducing fn."],
null)),hj,mj,gj],null)},Gk.sb=!0,Gk.Za="clojure.core.reducers/t_clojure$core$reducers19049",Gk.Ob=function(b,c){return Pb(c,"clojure.core.reducers/t_clojure$core$reducers19049")});return new Gk(Lk,b,c,W)};
function Mk(a,b){return Lk(b,function(b){return function(){function d(d,e,f){e=a.a?a.a(e,f):a.call(null,e,f);return b.a?b.a(d,e):b.call(null,d,e)}function e(d,e){var f=a.b?a.b(e):a.call(null,e);return b.a?b.a(d,f):b.call(null,d,f)}function f(){return b.m?b.m():b.call(null)}var g=null,g=function(a,b,c){switch(arguments.length){case 0:return f.call(this);case 2:return e.call(this,a,b);case 3:return d.call(this,a,b,c)}throw Error("Invalid arity: "+arguments.length);};g.m=f;g.a=e;g.c=d;return g}()})}
function Nk(a,b){return Lk(b,function(b){return function(){function d(d,e,f){return Ik(b,d,a.a?a.a(e,f):a.call(null,e,f))}function e(d,e){return Ik(b,d,a.b?a.b(e):a.call(null,e))}function f(){return b.m?b.m():b.call(null)}var g=null,g=function(a,b,c){switch(arguments.length){case 0:return f.call(this);case 2:return e.call(this,a,b);case 3:return d.call(this,a,b,c)}throw Error("Invalid arity: "+arguments.length);};g.m=f;g.a=e;g.c=d;return g}()})}
var Ok=function Ok(b,c,d,e){if(qd(b))return d.m?d.m():d.call(null);if(N(b)<=c)return Ik(e,d.m?d.m():d.call(null),b);var f=Td(N(b)),g=Bf.c(b,0,f);b=Bf.c(b,f,N(b));return Hk(function(b,c,e,f){return function(){var b=f(c),g;g=f(e);b=b.m?b.m():b.call(null);g=g.m?g.m():g.call(null);return d.a?d.a(b,g):d.call(null,b,g)}}(f,g,b,function(b,f,g){return function(n){return function(){return function(){return Ok(n,c,d,e)}}(b,f,g)}}(f,g,b)))};Kk["null"]=function(a,b,c){return c.m?c.m():c.call(null)};
Kk.object=function(a,b,c,d){return Ik(d,c.m?c.m():c.call(null),a)};R.prototype.kc=function(a,b,c,d){return Ok(this,b,c,d)};function Pk(){}
var Qk=function Qk(b,c,d){if(null!=b&&null!=b.ub)return b.ub(b,c,d);var e=Qk[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Qk._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ra("StructurePath.select*",b);},Rk=function Rk(b,c,d){if(null!=b&&null!=b.vb)return b.vb(b,c,d);var e=Rk[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Rk._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw Ra("StructurePath.transform*",b);};
function Sk(){}var Tk=function Tk(b,c){if(null!=b&&null!=b.lc)return b.lc(0,c);var d=Tk[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=Tk._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("Collector.collect-val",b);};var Uk=function Uk(b){if(null!=b&&null!=b.Bc)return b.Bc();var c=Uk[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=Uk._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("PathComposer.comp-paths*",b);};function Vk(a,b,c){this.type=a;this.md=b;this.od=c}var Wk;
Wk=new Vk(Ch,function(a,b,c,d){var e=function(){return function(a,b,c,d){return qd(c)?new R(null,1,5,S,[d],null):new R(null,1,5,S,[hd.a(c,d)],null)}}(a,b,id,d);return c.A?c.A(a,b,id,d,e):c.call(null,a,b,id,d,e)},function(a,b,c,d,e){var f=function(){return function(a,b,c,e){return qd(c)?d.b?d.b(e):d.call(null,e):B.a(d,hd.a(c,e))}}(a,b,id,e);return c.A?c.A(a,b,id,e,f):c.call(null,a,b,id,e,f)});var Xk;
Xk=new Vk(pi,function(a,b,c,d){a=function(){return function(a){return new R(null,1,5,S,[a],null)}}(d);return c.a?c.a(d,a):c.call(null,d,a)},function(a,b,c,d,e){return c.a?c.a(e,d):c.call(null,e,d)});function Yk(a,b,c,d,e,f){this.Ka=a;this.La=b;this.Ma=c;this.da=d;this.M=e;this.u=f;this.g=2229667594;this.C=8192}k=Yk.prototype;k.N=function(a,b){return lb.c(this,b,null)};
k.I=function(a,b,c){switch(b instanceof y?b.Ia:null){case "executors":return this.Ka;case "selector":return this.La;case "transformer":return this.Ma;default:return C.c(this.M,b,c)}};k.L=function(a,b,c){return wf(b,function(){return function(a){return wf(b,xf,""," ","",c,a)}}(this),"#com.rpl.specter.impl.TransformFunctions{",", ","}",c,se.a(new R(null,3,5,S,[new R(null,2,5,S,[Jh,this.Ka],null),new R(null,2,5,S,[yh,this.La],null),new R(null,2,5,S,[Gh,this.Ma],null)],null),this.M))};
k.Ha=function(){return new Jf(0,this,3,new R(null,3,5,S,[Jh,yh,Gh],null),hc(this.M))};k.P=function(){return this.da};k.Z=function(){return 3+N(this.M)};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Zd(this)};k.D=function(a,b){var c;c=x(b)?(c=this.constructor===b.constructor)?If(this,b):c:b;return x(c)?!0:!1};
k.rb=function(a,b){return Ed(new yg(null,new v(null,3,[yh,null,Gh,null,Jh,null],null),null),b)?nd.a(Qc(cf.a(W,this),this.da),b):new Yk(this.Ka,this.La,this.Ma,this.da,xe(nd.a(this.M,b)),null)};
k.Ra=function(a,b,c){return x(ge.a?ge.a(Jh,b):ge.call(null,Jh,b))?new Yk(c,this.La,this.Ma,this.da,this.M,null):x(ge.a?ge.a(yh,b):ge.call(null,yh,b))?new Yk(this.Ka,c,this.Ma,this.da,this.M,null):x(ge.a?ge.a(Gh,b):ge.call(null,Gh,b))?new Yk(this.Ka,this.La,c,this.da,this.M,null):new Yk(this.Ka,this.La,this.Ma,this.da,Q.c(this.M,b,c),null)};
k.U=function(){return H(se.a(new R(null,3,5,S,[new R(null,2,5,S,[Jh,this.Ka],null),new R(null,2,5,S,[yh,this.La],null),new R(null,2,5,S,[Gh,this.Ma],null)],null),this.M))};k.R=function(a,b){return new Yk(this.Ka,this.La,this.Ma,b,this.M,this.u)};k.X=function(a,b){return ud(b)?ob(this,db.a(b,0),db.a(b,1)):Va.c(bb,this,b)};function Zk(a,b,c){return new Yk(a,b,c,null,null,null)}function $k(a,b,c,d,e,f){this.va=a;this.Ta=b;this.Ua=c;this.da=d;this.M=e;this.u=f;this.g=2229667594;this.C=8192}k=$k.prototype;
k.N=function(a,b){return lb.c(this,b,null)};k.I=function(a,b,c){switch(b instanceof y?b.Ia:null){case "transform-fns":return this.va;case "params":return this.Ta;case "params-idx":return this.Ua;default:return C.c(this.M,b,c)}};
k.L=function(a,b,c){return wf(b,function(){return function(a){return wf(b,xf,""," ","",c,a)}}(this),"#com.rpl.specter.impl.CompiledPath{",", ","}",c,se.a(new R(null,3,5,S,[new R(null,2,5,S,[Yj,this.va],null),new R(null,2,5,S,[ui,this.Ta],null),new R(null,2,5,S,[Xi,this.Ua],null)],null),this.M))};k.Ha=function(){return new Jf(0,this,3,new R(null,3,5,S,[Yj,ui,Xi],null),hc(this.M))};k.P=function(){return this.da};k.Z=function(){return 3+N(this.M)};
k.S=function(){var a=this.u;return null!=a?a:this.u=a=Zd(this)};k.D=function(a,b){var c;c=x(b)?(c=this.constructor===b.constructor)?If(this,b):c:b;return x(c)?!0:!1};k.rb=function(a,b){return Ed(new yg(null,new v(null,3,[ui,null,Xi,null,Yj,null],null),null),b)?nd.a(Qc(cf.a(W,this),this.da),b):new $k(this.va,this.Ta,this.Ua,this.da,xe(nd.a(this.M,b)),null)};
k.Ra=function(a,b,c){return x(ge.a?ge.a(Yj,b):ge.call(null,Yj,b))?new $k(c,this.Ta,this.Ua,this.da,this.M,null):x(ge.a?ge.a(ui,b):ge.call(null,ui,b))?new $k(this.va,c,this.Ua,this.da,this.M,null):x(ge.a?ge.a(Xi,b):ge.call(null,Xi,b))?new $k(this.va,this.Ta,c,this.da,this.M,null):new $k(this.va,this.Ta,this.Ua,this.da,Q.c(this.M,b,c),null)};
k.U=function(){return H(se.a(new R(null,3,5,S,[new R(null,2,5,S,[Yj,this.va],null),new R(null,2,5,S,[ui,this.Ta],null),new R(null,2,5,S,[Xi,this.Ua],null)],null),this.M))};k.R=function(a,b){return new $k(this.va,this.Ta,this.Ua,b,this.M,this.u)};k.X=function(a,b){return ud(b)?ob(this,db.a(b,0),db.a(b,1)):Va.c(bb,this,b)};function al(a){return new $k(a,null,0,null,null,null)}Y;function bl(a,b,c,d,e){this.va=a;this.lb=b;this.da=c;this.M=d;this.u=e;this.g=2229667595;this.C=8192}k=bl.prototype;
k.N=function(a,b){return lb.c(this,b,null)};k.I=function(a,b,c){switch(b instanceof y?b.Ia:null){case "transform-fns":return this.va;case "num-needed-params":return this.lb;default:return C.c(this.M,b,c)}};k.L=function(a,b,c){return wf(b,function(){return function(a){return wf(b,xf,""," ","",c,a)}}(this),"#com.rpl.specter.impl.ParamsNeededPath{",", ","}",c,se.a(new R(null,2,5,S,[new R(null,2,5,S,[Yj,this.va],null),new R(null,2,5,S,[Ri,this.lb],null)],null),this.M))};
k.Ha=function(){return new Jf(0,this,2,new R(null,2,5,S,[Yj,Ri],null),hc(this.M))};
k.call=function(){function a(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u,D,F,E,L,O){a=pe(se.a(new R(null,20,5,S,[b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u,D,F,E,L],null),O));return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function b(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u,D,F,E,L){a=pe(20);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;a[14]=z;a[15]=u;a[16]=D;a[17]=F;a[18]=E;a[19]=L;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function c(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,
z,u,D,F,E){a=pe(19);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;a[14]=z;a[15]=u;a[16]=D;a[17]=F;a[18]=E;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function d(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u,D,F){a=pe(18);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;a[14]=z;a[15]=u;a[16]=D;a[17]=F;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function e(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u,D){a=pe(17);
a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;a[14]=z;a[15]=u;a[16]=D;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function f(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z,u){a=pe(16);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;a[14]=z;a[15]=u;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function g(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,z){a=pe(15);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;
a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;a[14]=z;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function h(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w){a=pe(14);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;a[13]=w;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function l(a,b,c,d,e,f,g,h,l,m,n,p,q,r){a=pe(13);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;a[12]=r;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function m(a,
b,c,d,e,f,g,h,l,m,n,p,q){a=pe(12);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;a[11]=q;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function n(a,b,c,d,e,f,g,h,l,m,n,p){a=pe(11);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;a[10]=p;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function p(a,b,c,d,e,f,g,h,l,m,n){a=pe(10);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;a[9]=n;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function q(a,
b,c,d,e,f,g,h,l,m){a=pe(9);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;a[8]=m;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function r(a,b,c,d,e,f,g,h,l){a=pe(8);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;a[7]=l;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function u(a,b,c,d,e,f,g,h){a=pe(7);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;a[6]=h;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function w(a,b,c,d,e,f,g){a=pe(6);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;a[5]=g;return Y.c?Y.c(this,
a,0):Y.call(null,this,a,0)}function z(a,b,c,d,e,f){a=pe(5);a[0]=b;a[1]=c;a[2]=d;a[3]=e;a[4]=f;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function D(a,b,c,d,e){a=pe(4);a[0]=b;a[1]=c;a[2]=d;a[3]=e;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function F(a,b,c,d){a=pe(3);a[0]=b;a[1]=c;a[2]=d;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function L(a,b,c){a=pe(2);a[0]=b;a[1]=c;return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}function O(a,b){var c=pe(1);c[0]=b;return Y.c?Y.c(this,c,0):Y.call(null,
this,c,0)}function Aa(){var a=pe(0);return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)}var E=null,E=function(E,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa,Jb,Xa,jb,kb,Bb,Jc,zd,nf){switch(arguments.length){case 1:return Aa.call(this);case 2:return O.call(this,0,na);case 3:return L.call(this,0,na,U);case 4:return F.call(this,0,na,U,V);case 5:return D.call(this,0,na,U,V,ha);case 6:return z.call(this,0,na,U,V,ha,ia);case 7:return w.call(this,0,na,U,V,ha,ia,ja);case 8:return u.call(this,0,na,U,V,ha,ia,ja,la);case 9:return r.call(this,
0,na,U,V,ha,ia,ja,la,oa);case 10:return q.call(this,0,na,U,V,ha,ia,ja,la,oa,ta);case 11:return p.call(this,0,na,U,V,ha,ia,ja,la,oa,ta,ya);case 12:return n.call(this,0,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca);case 13:return m.call(this,0,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da);case 14:return l.call(this,0,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa);case 15:return h.call(this,0,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa,Jb);case 16:return g.call(this,0,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa,Jb,Xa);case 17:return f.call(this,0,
na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa,Jb,Xa,jb);case 18:return e.call(this,0,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa,Jb,Xa,jb,kb);case 19:return d.call(this,0,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa,Jb,Xa,jb,kb,Bb);case 20:return c.call(this,0,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa,Jb,Xa,jb,kb,Bb,Jc);case 21:return b.call(this,0,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa,Jb,Xa,jb,kb,Bb,Jc,zd);case 22:return a.call(this,0,na,U,V,ha,ia,ja,la,oa,ta,ya,Ca,Da,Qa,Jb,Xa,jb,kb,Bb,Jc,zd,nf)}throw Error("Invalid arity: "+
arguments.length);};E.b=Aa;E.a=O;E.c=L;E.l=F;E.A=D;E.T=z;E.aa=w;E.ra=u;E.sa=r;E.ga=q;E.ha=p;E.ia=n;E.ja=m;E.ka=l;E.la=h;E.ma=g;E.na=f;E.oa=e;E.pa=d;E.qa=c;E.Fb=b;E.qb=a;return E}();k.apply=function(a,b){return this.call.apply(this,[this].concat(Ua(b)))};k.m=function(){var a=pe(0);return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)};k.b=function(a){var b=pe(1);b[0]=a;return Y.c?Y.c(this,b,0):Y.call(null,this,b,0)};k.a=function(a,b){var c=pe(2);c[0]=a;c[1]=b;return Y.c?Y.c(this,c,0):Y.call(null,this,c,0)};
k.c=function(a,b,c){var d=pe(3);d[0]=a;d[1]=b;d[2]=c;return Y.c?Y.c(this,d,0):Y.call(null,this,d,0)};k.l=function(a,b,c,d){var e=pe(4);e[0]=a;e[1]=b;e[2]=c;e[3]=d;return Y.c?Y.c(this,e,0):Y.call(null,this,e,0)};k.A=function(a,b,c,d,e){var f=pe(5);f[0]=a;f[1]=b;f[2]=c;f[3]=d;f[4]=e;return Y.c?Y.c(this,f,0):Y.call(null,this,f,0)};k.T=function(a,b,c,d,e,f){var g=pe(6);g[0]=a;g[1]=b;g[2]=c;g[3]=d;g[4]=e;g[5]=f;return Y.c?Y.c(this,g,0):Y.call(null,this,g,0)};
k.aa=function(a,b,c,d,e,f,g){var h=pe(7);h[0]=a;h[1]=b;h[2]=c;h[3]=d;h[4]=e;h[5]=f;h[6]=g;return Y.c?Y.c(this,h,0):Y.call(null,this,h,0)};k.ra=function(a,b,c,d,e,f,g,h){var l=pe(8);l[0]=a;l[1]=b;l[2]=c;l[3]=d;l[4]=e;l[5]=f;l[6]=g;l[7]=h;return Y.c?Y.c(this,l,0):Y.call(null,this,l,0)};k.sa=function(a,b,c,d,e,f,g,h,l){var m=pe(9);m[0]=a;m[1]=b;m[2]=c;m[3]=d;m[4]=e;m[5]=f;m[6]=g;m[7]=h;m[8]=l;return Y.c?Y.c(this,m,0):Y.call(null,this,m,0)};
k.ga=function(a,b,c,d,e,f,g,h,l,m){var n=pe(10);n[0]=a;n[1]=b;n[2]=c;n[3]=d;n[4]=e;n[5]=f;n[6]=g;n[7]=h;n[8]=l;n[9]=m;return Y.c?Y.c(this,n,0):Y.call(null,this,n,0)};k.ha=function(a,b,c,d,e,f,g,h,l,m,n){var p=pe(11);p[0]=a;p[1]=b;p[2]=c;p[3]=d;p[4]=e;p[5]=f;p[6]=g;p[7]=h;p[8]=l;p[9]=m;p[10]=n;return Y.c?Y.c(this,p,0):Y.call(null,this,p,0)};
k.ia=function(a,b,c,d,e,f,g,h,l,m,n,p){var q=pe(12);q[0]=a;q[1]=b;q[2]=c;q[3]=d;q[4]=e;q[5]=f;q[6]=g;q[7]=h;q[8]=l;q[9]=m;q[10]=n;q[11]=p;return Y.c?Y.c(this,q,0):Y.call(null,this,q,0)};k.ja=function(a,b,c,d,e,f,g,h,l,m,n,p,q){var r=pe(13);r[0]=a;r[1]=b;r[2]=c;r[3]=d;r[4]=e;r[5]=f;r[6]=g;r[7]=h;r[8]=l;r[9]=m;r[10]=n;r[11]=p;r[12]=q;return Y.c?Y.c(this,r,0):Y.call(null,this,r,0)};
k.ka=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){var u=pe(14);u[0]=a;u[1]=b;u[2]=c;u[3]=d;u[4]=e;u[5]=f;u[6]=g;u[7]=h;u[8]=l;u[9]=m;u[10]=n;u[11]=p;u[12]=q;u[13]=r;return Y.c?Y.c(this,u,0):Y.call(null,this,u,0)};k.la=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u){var w=pe(15);w[0]=a;w[1]=b;w[2]=c;w[3]=d;w[4]=e;w[5]=f;w[6]=g;w[7]=h;w[8]=l;w[9]=m;w[10]=n;w[11]=p;w[12]=q;w[13]=r;w[14]=u;return Y.c?Y.c(this,w,0):Y.call(null,this,w,0)};
k.ma=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w){var z=pe(16);z[0]=a;z[1]=b;z[2]=c;z[3]=d;z[4]=e;z[5]=f;z[6]=g;z[7]=h;z[8]=l;z[9]=m;z[10]=n;z[11]=p;z[12]=q;z[13]=r;z[14]=u;z[15]=w;return Y.c?Y.c(this,z,0):Y.call(null,this,z,0)};k.na=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z){var D=pe(17);D[0]=a;D[1]=b;D[2]=c;D[3]=d;D[4]=e;D[5]=f;D[6]=g;D[7]=h;D[8]=l;D[9]=m;D[10]=n;D[11]=p;D[12]=q;D[13]=r;D[14]=u;D[15]=w;D[16]=z;return Y.c?Y.c(this,D,0):Y.call(null,this,D,0)};
k.oa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D){var F=pe(18);F[0]=a;F[1]=b;F[2]=c;F[3]=d;F[4]=e;F[5]=f;F[6]=g;F[7]=h;F[8]=l;F[9]=m;F[10]=n;F[11]=p;F[12]=q;F[13]=r;F[14]=u;F[15]=w;F[16]=z;F[17]=D;return Y.c?Y.c(this,F,0):Y.call(null,this,F,0)};k.pa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F){var L=pe(19);L[0]=a;L[1]=b;L[2]=c;L[3]=d;L[4]=e;L[5]=f;L[6]=g;L[7]=h;L[8]=l;L[9]=m;L[10]=n;L[11]=p;L[12]=q;L[13]=r;L[14]=u;L[15]=w;L[16]=z;L[17]=D;L[18]=F;return Y.c?Y.c(this,L,0):Y.call(null,this,L,0)};
k.qa=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F,L){var O=pe(20);O[0]=a;O[1]=b;O[2]=c;O[3]=d;O[4]=e;O[5]=f;O[6]=g;O[7]=h;O[8]=l;O[9]=m;O[10]=n;O[11]=p;O[12]=q;O[13]=r;O[14]=u;O[15]=w;O[16]=z;O[17]=D;O[18]=F;O[19]=L;return Y.c?Y.c(this,O,0):Y.call(null,this,O,0)};k.Fb=function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F,L,O){a=pe(se.a(new R(null,20,5,S,[a,b,c,d,e,f,g,h,l,m,n,p,q,r,u,w,z,D,F,L],null),O));return Y.c?Y.c(this,a,0):Y.call(null,this,a,0)};k.P=function(){return this.da};
k.Z=function(){return 2+N(this.M)};k.S=function(){var a=this.u;return null!=a?a:this.u=a=Zd(this)};k.D=function(a,b){var c;c=x(b)?(c=this.constructor===b.constructor)?If(this,b):c:b;return x(c)?!0:!1};k.rb=function(a,b){return Ed(new yg(null,new v(null,2,[Ri,null,Yj,null],null),null),b)?nd.a(Qc(cf.a(W,this),this.da),b):new bl(this.va,this.lb,this.da,xe(nd.a(this.M,b)),null)};
k.Ra=function(a,b,c){return x(ge.a?ge.a(Yj,b):ge.call(null,Yj,b))?new bl(c,this.lb,this.da,this.M,null):x(ge.a?ge.a(Ri,b):ge.call(null,Ri,b))?new bl(this.va,c,this.da,this.M,null):new bl(this.va,this.lb,this.da,Q.c(this.M,b,c),null)};k.U=function(){return H(se.a(new R(null,2,5,S,[new R(null,2,5,S,[Yj,this.va],null),new R(null,2,5,S,[Ri,this.lb],null)],null),this.M))};k.R=function(a,b){return new bl(this.va,this.lb,b,this.M,this.u)};
k.X=function(a,b){return ud(b)?ob(this,db.a(b,0),db.a(b,1)):Va.c(bb,this,b)};function cl(a,b){return new bl(a,b,null,null,null)}function Y(a,b,c){return new $k(a.va,b,c,null,null,null)}function dl(a){return new v(null,2,[nj,null!=a&&a.tb?function(a,c,d){return a.ub(null,c,d)}:Qk,Wh,null!=a&&a.tb?function(a,c,d){return a.vb(null,c,d)}:Rk],null)}function el(a){return new v(null,1,[wj,null!=a&&a.Ec?function(a,c){return a.lc(0,c)}:Tk],null)}
function fl(a){var b=function(b){return function(d,e,f,g,h){f=hd.a(f,b.a?b.a(a,g):b.call(null,a,g));return h.l?h.l(d,e,f,g):h.call(null,d,e,f,g)}}(wj.b(el(a)));return al(Zk(Wk,b,b))}function gl(a){var b=dl(a),c=nj.b(b),d=Wh.b(b);return al(Zk(Xk,function(b,c){return function(b,d){return c.c?c.c(a,b,d):c.call(null,a,b,d)}}(b,c,d),function(b,c,d){return function(b,c){return d.c?d.c(a,b,c):d.call(null,a,b,c)}}(b,c,d)))}
var hl=function hl(b){if(null!=b&&null!=b.fb)return b.fb(b);var c=hl[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=hl._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("CoercePath.coerce-path",b);};hl["null"]=function(){return gl(null)};$k.prototype.fb=function(){return this};bl.prototype.fb=function(){return this};R.prototype.fb=function(){return Uk(this)};Bc.prototype.fb=function(){return hl(Jd(this))};ce.prototype.fb=function(){return hl(Jd(this))};ad.prototype.fb=function(){return hl(Jd(this))};
hl._=function(a){var b;b=(b=(b=ca(a))?b:null!=a?a.Jc?!0:a.Zb?!1:Pa(Wa,a):Pa(Wa,a))?b:null!=a?a.tb?!0:a.Zb?!1:Pa(Pk,a):Pa(Pk,a);if(x(b))a=gl(a);else if(null!=a?a.Ec||(a.Zb?0:Pa(Sk,a)):Pa(Sk,a))a=fl(a);else throw b=G,a=[A("Protocol implementation cannot be found for object.\n        Extending Specter protocols should not be done inline in a deftype definition\n        because that prevents Specter from finding the protocol implementations for\n        optimized performance. Instead, you should extend the protocols via an\n        explicit extend-protocol call. \n"),
A(a)].join(""),a=b([a],0),Error(B.a(A,a));return a};function il(a){return a.Ka.type}
function jl(a){var b=P(a,0),c=Vd(a,1),d=b.Ka,e=d.type,f=rc.a(e,Ch)?function(a,b,c,d,e,f){return function(q,r){return function(a,b,c,d,e,f){return function(g,h,l,m,n){var p=function(){return function(a,b,c,d){return r.A?r.A(a,b,c,d,n):r.call(null,a,b,c,d,n)}}(g,h,l,m,a,b,c,d,e,f);return q.A?q.A(g,h,l,m,p):q.call(null,g,h,l,m,p)}}(a,b,c,d,e,f)}}(d,e,a,b,c,a):function(a,b,c,d,e,f){return function(q,r){return function(a,b,c,d,e,f){return function(g,h){var l=function(){return function(a){return r.a?r.a(a,
h):r.call(null,a,h)}}(g,a,b,c,d,e,f);return q.a?q.a(g,l):q.call(null,g,l)}}(a,b,c,d,e,f)}}(d,e,a,b,c,a);return Va.a(function(a,b,c){return function(b,d){return Zk(a,function(){var a=b.La,e=d.La;return c.a?c.a(a,e):c.call(null,a,e)}(),function(){var a=b.Ma,e=d.Ma;return c.a?c.a(a,e):c.call(null,a,e)}())}}(d,e,f,a,b,c,a),a)}
function kl(a){if(rc.a(il(a),Ch))return a;var b=a.La;a=a.Ma;return Zk(Wk,function(a,b){return function(e,f,g,h,l){var m=function(){return function(a){return l.l?l.l(e,f,g,a):l.call(null,e,f,g,a)}}(h,a,b);return a.a?a.a(h,m):a.call(null,h,m)}}(b,a),function(a,b){return function(e,f,g,h,l){var m=function(){return function(a){return l.l?l.l(e,f,g,a):l.call(null,e,f,g,a)}}(h,a,b);return b.a?b.a(h,m):b.call(null,h,m)}}(b,a))}
function ll(a){if(a instanceof $k){var b=ui.b(a),c=Xi.b(a),d=yh.b(Yj.b(a)),e=Gh.b(Yj.b(a));return qd(b)?a:al(Zk(Wk,function(a,b,c,d){return function(e,n,p,q,r){var u=function(){return function(a,b,c,d){return r.l?r.l(e,n,c,d):r.call(null,e,n,c,d)}}(a,b,p,q,a,b,c,d);return c.A?c.A(a,b,p,q,u):c.call(null,a,b,p,q,u)}}(b,c,d,e),function(a,b,c,d){return function(e,n,p,q,r){var u=function(){return function(a,b,c,d){return r.l?r.l(e,n,c,d):r.call(null,e,n,c,d)}}(a,b,p,q,a,b,c,d);return d.A?d.A(a,b,p,q,u):
d.call(null,a,b,p,q,u)}}(b,c,d,e)))}return a}Uk["null"]=function(a){return hl(a)};Uk._=function(a){return hl(a)};R.prototype.Bc=function(){if(qd(this))return hl(null);var a=T.a(ll,T.a(hl,this)),b=T.a(jl,Gg(il,T.a(Yj,a))),c=rc.a(1,N(b))?I(b):jl(T.a(kl,b)),a=$e(function(){return function(a){return a instanceof bl}}(a,b,c,this),a);return qd(a)?al(c):cl(kl(c),Va.a(Md,T.a(Ri,a)))};function ml(a){return a instanceof $k?0:Ri.b(a)}
var nl=function nl(b,c){if(null!=b&&null!=b.Cc)return b.Cc(0,c);var d=nl[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=nl._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("SetExtremes.set-first",b);},ol=function ol(b,c){if(null!=b&&null!=b.Dc)return b.Dc(0,c);var d=ol[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=ol._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("SetExtremes.set-last",b);};
R.prototype.Cc=function(a,b){return Q.c(this,0,b)};R.prototype.Dc=function(a,b){return Q.c(this,N(this)-1,b)};nl._=function(a,b){return M(b,Cc(a))};ol._=function(a,b){var c=Bg(a);return hd.a(Jd(c),b)};function pl(a,b){var c=a.va;return c.Ka.md.call(null,a.Ta,a.Ua,c.La,b)}function ql(a,b,c){var d=a.va;return d.Ka.od.call(null,a.Ta,a.Ua,d.Ma,b,c)}function rl(){}rl.prototype.tb=!0;rl.prototype.ub=function(a,b,c){return cf.a(id,Nk(c,b))};
rl.prototype.vb=function(a,b,c){a=null==b?null:$a(b);if(be(a))for(c=b=T.a(c,b);;)if(H(c))c=J(c);else break;else b=cf.a(a,Mk(c,b));return b};function sl(){}sl.prototype.Ec=!0;sl.prototype.lc=function(a,b){return b};function tl(a,b){this.Gc=a;this.nd=b}tl.prototype.tb=!0;tl.prototype.ub=function(a,b,c){if(qd(b))return null;a=this.Gc.call(null,b);return c.b?c.b(a):c.call(null,a)};
tl.prototype.vb=function(a,b,c){var d=this;return qd(b)?b:d.nd.call(null,b,function(){var a=d.Gc.call(null,b);return c.b?c.b(a):c.call(null,a)}())};function ul(a,b,c,d){a=Bf.c(Jd(a),b,c);return d.b?d.b(a):d.call(null,a)}function vl(a,b,c,d){var e=Jd(a),f=Bf.c(e,b,c);d=d.b?d.b(f):d.call(null,f);b=se.h(Bf.c(e,0,b),d,G([Bf.c(e,c,N(a))],0));return ud(a)?Jd(b):b}Pk["null"]=!0;Qk["null"]=function(a,b,c){return c.b?c.b(b):c.call(null,b)};Rk["null"]=function(a,b,c){return c.b?c.b(b):c.call(null,b)};
function wl(a,b,c){return x(a.b?a.b(b):a.call(null,b))?c.b?c.b(b):c.call(null,b):null}function xl(a,b,c){return x(a.b?a.b(b):a.call(null,b))?c.b?c.b(b):c.call(null,b):b};function yl(a){return Uk(Jd(a))}function zl(a,b){var c=Uk(a);return pl.a?pl.a(c,b):pl.call(null,c,b)}function Al(a,b,c){a=Uk(a);return ql.c?ql.c(a,b,c):ql.call(null,a,b,c)}var Bl=yl(G([new rl],0)),Cl=new sl,Dl=yl(G([new tl(gd,ol)],0));yl(G([new tl(I,nl)],0));
var El=cl(Zk(Wk,function(a,b,c,d,e){var f=a[b+0],g=a[b+1];return ul(d,f.b?f.b(d):f.call(null,d),g.b?g.b(d):g.call(null,d),function(d){var f=b+2;return e.l?e.l(a,f,c,d):e.call(null,a,f,c,d)})},function(a,b,c,d,e){var f=a[b+0],g=a[b+1];return vl(d,f.b?f.b(d):f.call(null,d),g.b?g.b(d):g.call(null,d),function(d){var f=b+2;return e.l?e.l(a,f,c,d):e.call(null,a,f,c,d)})}),2),Fl=cl(Zk(Wk,function(a,b,c,d,e){return ul(d,a[b+0],a[b+1],function(d){var g=b+2;return e.l?e.l(a,g,c,d):e.call(null,a,g,c,d)})},function(a,
b,c,d,e){return vl(d,a[b+0],a[b+1],function(d){var g=b+2;return e.l?e.l(a,g,c,d):e.call(null,a,g,c,d)})}),2);Fl.a?Fl.a(0,0):Fl.call(null,0,0);El.a?El.a(N,N):El.call(null,N,N);y.prototype.tb=!0;y.prototype.ub=function(a,b,c){a=C.a(b,this);return c.b?c.b(a):c.call(null,a)};y.prototype.vb=function(a,b,c){var d=this;return Q.c(b,d,function(){var a=C.a(b,d);return c.b?c.b(a):c.call(null,a)}())};Pk["function"]=!0;Qk["function"]=function(a,b,c){return wl(a,b,c)};
Rk["function"]=function(a,b,c){return xl(a,b,c)};yg.prototype.tb=!0;yg.prototype.ub=function(a,b,c){return wl(this,b,c)};yg.prototype.vb=function(a,b,c){return xl(this,b,c)};var Gl=cl(Zk(Wk,function(a,b,c,d,e){var f=a[b+0];d=x(d)?d:f;b+=1;return e.l?e.l(a,b,c,d):e.call(null,a,b,c,d)},function(a,b,c,d,e){var f=a[b+0];d=x(d)?d:f;b+=1;return e.l?e.l(a,b,c,d):e.call(null,a,b,c,d)}),1);Gl.b?Gl.b(zg):Gl.call(null,zg);var Hl=Dc;Gl.b?Gl.b(Hl):Gl.call(null,Hl);Gl.b?Gl.b(id):Gl.call(null,id);
function Il(){var a=G([qk],0),b=T.a(Uk,new R(null,1,5,S,[a],null)),c=T.a(ml,b),d=M(0,Hg(c)),e=gd(d),f=T.c(function(a,b,c,d){return function(e,f){return x(f instanceof $k)?function(){return function(){return f}}(a,b,c,d):function(){return function(a,b){return Y(f,a,b+e)}}(a,b,c,d)}}(b,c,d,e),d,b),g=P(f,0),a=function(){var a=function(a,b,c,d,e,f,g){return function(a,b,c,e,f){var h;h=g.a?g.a(a,b):g.call(null,a,b);var l=pl.a?pl.a(h,e):pl.call(null,h,e);if(1<N(l))throw a=G(["More than one element found for params: ",
h,e],0),Error(B.a(A,a));h=I(l);b+=d;c=hd.a(c,h);return f.l?f.l(a,b,c,e):f.call(null,a,b,c,e)}}(b,c,d,e,f,f,g);return cl(Zk(Wk,a,a),e)}();return rc.a(0,e)?Y(a,null,0):a};var Jl=new v(null,3,[oi,2,Mh,4,Hj,1],null),Kl=new v(null,3,[oi,40,Mh,40,Hj,0],null);function Ll(a,b){var c=T.a(Ie.a(Jl,zi),b),d=a/Va.a(Md,c);return T.a(Je(Od,d),c)}function Ml(a,b,c){return hd.a(b,function(){var d=null==b?null:vb(b);return a.a?a.a(d,c):a.call(null,d,c)}())}function Nl(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Oc,a):a,c=C.a(c,zi),c=b-(Kl.b?Kl.b(c):Kl.call(null,c));return c-Sd(c,20)}
function Ol(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Oc,a):a,d=C.a(c,ni),e=C.a(c,tk),f=Ll(e,b);return T.h(function(a,b,c,d){return function(a,b,c,e){a=null!=a&&(a.g&64||a.F)?B.a(Oc,a):a;C.a(a,zi);return vg.h(G([a,new v(null,5,[rh,c,ni,d,Bj,e,Ph,e,qi,-30],null)],0))}}(f,a,c,d,e),b,f,Va.c(Je(Ml,Md),new R(null,1,5,S,[0],null),f),G([T.c(Nl,b,f)],0))}
function Pl(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Oc,a):a,d=C.a(c,ni),e=C.a(c,tk),f=C.a(c,Sj),g=N(b),h=d/g;return T.c(function(a,b,c,d,e,f){return function(a,c){var d=new v(null,3,[Sj,a,ni,b-30,tk,f],null),d=null!=d&&(d.g&64||d.F)?B.a(Oc,d):d,e=C.a(d,ni),g=C.a(d,tk),h=null!=c&&(c.g&64||c.F)?B.a(Oc,c):c;C.a(h,Qh);return gf.c(vg.h(G([h,d],0)),Qh,Je(Ol,new v(null,2,[ni,e,tk,g],null)))}}(g,h,a,c,d,e,f),Se(g,We(Je(Md,h),f)),b)};function Ql(a){return rc.a(Mh,zi.b(a))}function Rl(a){return Al(new R(null,7,5,S,[ei,Bl,Qh,Bl,function(a){return Vj.b(a)},pk,Dl],null),He(mi),a)}if("undefined"===typeof Sl)var Sl=function(){var a=X.b?X.b(W):X.call(null,W),b=X.b?X.b(W):X.call(null,W),c=X.b?X.b(W):X.call(null,W),d=X.b?X.b(W):X.call(null,W),e=C.c(W,fk,dh());return new oh(zc.a("pennygame.updates","capacity"),function(){return function(a,b){var c=null!=b&&(b.g&64||b.F)?B.a(Oc,b):b;return C.a(c,zi)}}(a,b,c,d,e),bi,e,a,b,c,d)}();
qh(Sl,Ii,function(a){return a});qh(Sl,Ti,function(a){switch(a){case 1:return 4;case 2:return 4;case 3:return 4;case 4:return 4;case 5:return 5;case 6:return 6;default:throw Error([A("No matching clause: "),A(a)].join(""));}});qh(Sl,Ei,function(a,b,c){a=null!=b&&(b.g&64||b.F)?B.a(Oc,b):b;b=C.a(a,xh);a=C.a(a,ai);c=kd(c,b);b=null!=c&&(c.g&64||c.F)?B.a(Oc,c):c;c=C.a(b,Rh);b=C.a(b,pk);if(rc.a(a,Rh))return c;a=N(b);return c<a?c:a});function Tl(a,b){return Al(new R(null,4,5,S,[ei,Bl,Qh,Bl],null),b,a)}
function Ul(a,b){return Jd(T.c(function(a,b){return Q.c(a,gi,b)},a,b))}function Vl(a,b){return gf.l(a,bk,Ul,b)}function Wl(a,b){return Al(new R(null,6,5,S,[ei,Bl,Qh,Cl,Bl,function(a){return Ed(a,Fh)}],null),function(a,d){var e=null!=d&&(d.g&64||d.F)?B.a(Oc,d):d,f=C.a(e,Fh),g=C.a(e,rk);C.a(e,pk);f=df(b,new R(null,2,5,S,[f,gi],null));g=Sl.c?Sl.c(f,g,a):Sl.call(null,f,g,a);return Q.c(e,Rh,g)},a)}
function Xl(a,b){return Al(new R(null,7,5,S,[ei,Bl,Qh,Cl,Bl,function(a){return Ed(a,Fh)},function(a){return rc.a(Ei,df(a,new R(null,2,5,S,[rk,zi],null)))}],null),function(a,d){var e=null!=d&&(d.g&64||d.F)?B.a(Oc,d):d,f=C.a(e,Fh),g=C.a(e,rk);C.a(e,pk);f=df(b,new R(null,2,5,S,[f,gi],null));g=Sl.c?Sl.c(f,g,a):Sl.call(null,f,g,a);return Q.c(e,Rh,g)},a)}function Yl(a){var b=a.b?a.b(bk):a.call(null,bk);return Xl(Wl(a,b),b)}
if("undefined"===typeof Zl){var Zl,$l=X.b?X.b(W):X.call(null,W),am=X.b?X.b(W):X.call(null,W),bm=X.b?X.b(W):X.call(null,W),cm=X.b?X.b(W):X.call(null,W),dm=C.c(W,fk,dh());Zl=new oh(zc.a("pennygame.updates","process"),zi,bi,dm,$l,am,bm,cm)}qh(Zl,bi,function(a){a=null!=a&&(a.g&64||a.F)?B.a(Oc,a):a;var b=C.a(a,Rh),c=C.a(a,pk);return Q.h(a,pk,Te(b,c),G([Rj,Se(b,c)],0))});qh(Zl,oi,function(a){a=null!=a&&(a.g&64||a.F)?B.a(Oc,a):a;var b=C.a(a,Rh);return Q.c(a,Rj,Se(b,Ue(W)))});
function em(a){var b=I(zl(new R(null,4,5,S,[Qh,Bl,function(a){return Gj.b(a)},Gj],null),a));return Al(new R(null,5,5,S,[Qh,function(){var a=b+1;return Fl.a?Fl.a(b,a):Fl.call(null,b,a)}(),Bl,Rj,Dl],null),He(mi),a)}function fm(a){return Fe(function(a){return rc.a(a,mi)},zl(new R(null,4,5,S,[Bl,function(a){return Gj.b(a)},Rj,Bl],null),a))}function gm(a){return x(fm(a.b?a.b(Qh):a.call(null,Qh)))?em(a):a}
function hm(a){return Al(new R(null,2,5,S,[ei,Bl],null),gm,Al(new R(null,5,5,S,[ei,Bl,Qh,Bl,function(a){return C.a(a,Rh)}],null),Zl,a))}function im(a){var b=B.c(Rd,16.5,T.a(function(a){var b=null!=a&&(a.g&64||a.F)?B.a(Oc,a):a;a=C.a(b,Cj);var e=C.a(b,qk),b=C.a(b,pk);return a/(N(e)+N(b))},zl(new R(null,5,5,S,[ei,Bl,Qh,Bl,Ql],null),a)));return Al(new R(null,5,5,S,[ei,Bl,Qh,Bl,Ql],null),function(a){return function(b){return gf.l(b,uh,Rd,a)}}(b),a)}
function jm(a){return Al(new R(null,6,5,S,[ei,Bl,Qh,Cl,Bl,function(a){return Ed(a,vh)}],null),function(a,c){var d=null!=c&&(c.g&64||c.F)?B.a(Oc,c):c,e=C.a(d,vh);return Q.c(d,qk,df(Jd(a),new R(null,2,5,S,[e,Rj],null)))},a)}function km(a){return Al(new R(null,6,5,S,[ei,Bl,Qh,Bl,Il(),pk],null),function(a,c){return se.a(c,a)},a)}
function lm(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Oc,a):a,c=C.a(c,Qh),d=null!=b&&(b.g&64||b.F)?B.a(Oc,b):b,e=C.c(d,lk,0),f=C.c(d,Dh,0),g=C.c(d,xi,0),h=C.c(d,Di,0),l=C.a(d,vj),m=C.a(d,vi),n=C.c(d,$h,new R(null,2,5,S,[0,0],null)),d=N(Rj.b(I(c))),p=N(Rj.b(gd(Bg(c)))),q=B.c(T,Md,T.a(Jg(Ie.a(N,Rj),Rh),zl(new R(null,2,5,S,[Bl,Ql],null),c))),r=Va.a(Md,T.a(N,zl(new R(null,3,5,S,[Bl,Ql,pk],null),c))),n=T.c(Md,n,q);return md([Dh,$h,vi,xi,Di,Ji,Zi,vj,lk],[x(fm(c))?f+1:f,n,m+p,x(fm(c))?e-h:g,x(fm(c))?e:h,r,B.a(Pd,
n),l+d,e+1])}function mm(a){return Al(new R(null,5,5,S,[ei,Bl,function(a){return H(C.a(a,Qh))},Cl,Oh],null),function(a,c){return hd.a(c,lm(a,null==c?null:vb(c)))},Al(new R(null,7,5,S,[ei,Bl,function(a){return H(C.a(a,Qh))},Qh,Bl,function(a){return N(Rj.b(a))<Rh.b(a)},gk],null),Rc,a))};var nm,om=function om(b){if(null!=b&&null!=b.Yb)return b.Yb();var c=om[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=om._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("Channel.close!",b);},pm=function pm(b){if(null!=b&&null!=b.zc)return!0;var c=pm[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=pm._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("Handler.active?",b);},qm=function qm(b){if(null!=b&&null!=b.Ac)return b.Fa;var c=qm[t(null==b?null:b)];
if(null!=c)return c.b?c.b(b):c.call(null,b);c=qm._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("Handler.commit",b);},rm=function rm(b,c){if(null!=b&&null!=b.yc)return b.yc(0,c);var d=rm[t(null==b?null:b)];if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);d=rm._;if(null!=d)return d.a?d.a(b,c):d.call(null,b,c);throw Ra("Buffer.add!*",b);},sm=function sm(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return sm.b(arguments[0]);case 2:return sm.a(arguments[0],
arguments[1]);default:throw Error([A("Invalid arity: "),A(c.length)].join(""));}};sm.b=function(a){return a};sm.a=function(a,b){return rm(a,b)};sm.w=2;var tm,um=function um(b){"undefined"===typeof tm&&(tm=function(b,d,e){this.mc=b;this.Fa=d;this.ed=e;this.g=393216;this.C=0},tm.prototype.R=function(b,d){return new tm(this.mc,this.Fa,d)},tm.prototype.P=function(){return this.ed},tm.prototype.zc=function(){return!0},tm.prototype.Ac=function(){return this.Fa},tm.cc=function(){return new R(null,3,5,S,[Qc(hk,new v(null,2,[Th,!0,Ae,pc(Be,pc(new R(null,1,5,S,[Ak],null)))],null)),Ak,lj],null)},tm.sb=!0,tm.Za="cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers22008",
tm.Ob=function(b,d){return Pb(d,"cljs.core.async.impl.ioc-helpers/t_cljs$core$async$impl$ioc_helpers22008")});return new tm(um,b,W)};function vm(a){try{return a[0].call(null,a)}catch(b){throw b instanceof Object&&a[6].Yb(),b;}}function wm(a,b,c){c=xm(c,um(function(c){a[2]=c;a[1]=b;return vm(a)}));return x(c)?(a[2]=K.b?K.b(c):K.call(null,c),a[1]=b,yi):null}function ym(a,b){var c=a[6];null!=b&&zm(c,b,um(function(){return function(){return null}}(c)));c.Yb();return c}
function Am(a){for(;;){var b=a[4],c=Ai.b(b),d=uj.b(b),e=a[5];if(x(function(){var a=e;return x(a)?Oa(b):a}()))throw e;if(x(function(){var a=e;return x(a)?(a=c,x(a)?e instanceof d:a):a}())){a[1]=c;a[2]=e;a[5]=null;a[4]=Q.h(b,Ai,null,G([uj,null],0));break}if(x(function(){var a=e;return x(a)?Oa(c)&&Oa(ci.b(b)):a}()))a[4]=yj.b(b);else{if(x(function(){var a=e;return x(a)?(a=Oa(c))?ci.b(b):a:a}())){a[1]=ci.b(b);a[4]=Q.c(b,ci,null);break}if(x(function(){var a=Oa(e);return a?ci.b(b):a}())){a[1]=ci.b(b);a[4]=
Q.c(b,ci,null);break}if(Oa(e)&&Oa(ci.b(b))){a[1]=Dj.b(b);a[4]=yj.b(b);break}throw Error("No matching clause");}}};var Bm=VDOM.diff,Cm=VDOM.patch,Dm=VDOM.create;function Em(a){return af(Ma,af(Cd,bf(a)))}function Fm(a,b,c){return new VDOM.VHtml(Wd(a),$g(nd.a(b,Nh)),$g(c),Nh.b(b))}function Gm(a,b,c){return new VDOM.VSvg(Wd(a),$g(b),$g(c))}Hm;
var Im=function Im(b){if(null==b)return new VDOM.VText("");if(x(VDOM.isVirtualNode(b)))return b;if(Cd(b))return Fm(Wi,W,T.a(Im,Em(b)));if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(rc.a(zj,I(b)))return Hm.b?Hm.b(b):Hm.call(null,b);var c=P(b,0),d=P(b,1);b=Vd(b,2);return Fm(c,d,T.a(Im,Em(b)))},Hm=function Hm(b){if(null==b)return new VDOM.VText("");if(x(VDOM.isVirtualNode(b)))return b;if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(rc.a(xk,I(b))){var c=
P(b,0),d=P(b,1);b=Vd(b,2);return Gm(c,d,T.a(Im,Em(b)))}c=P(b,0);d=P(b,1);b=Vd(b,2);return Gm(c,d,T.a(Hm,Em(b)))};
function Jm(){var a=document.getElementById("app"),b=function(){var a=new VDOM.VText("");return X.b?X.b(a):X.call(null,a)}(),c=function(){var a;a=K.b?K.b(b):K.call(null,b);a=Dm.b?Dm.b(a):Dm.call(null,a);return X.b?X.b(a):X.call(null,a)}(),d=function(){var a=window.requestAnimationFrame;return x(a)?function(a){return function(b){return a.b?a.b(b):a.call(null,b)}}(a,a,b,c):function(){return function(a){return a.m?a.m():a.call(null)}}(a,b,c)}();a.appendChild(K.b?K.b(c):K.call(null,c));return function(a,
b,c){return function(d){var l=Im(d);d=function(){var b=K.b?K.b(a):K.call(null,a);return Bm.a?Bm.a(b,l):Bm.call(null,b,l)}();Pe.a?Pe.a(a,l):Pe.call(null,a,l);d=function(a,b,c,d){return function(){return Qe.c(d,Cm,b)}}(l,d,a,b,c);return c.b?c.b(d):c.call(null,d)}}(b,c,d)};var Km;
function Lm(){var a=aa.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==Dk.indexOf("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=ma(function(a){if(("*"==d||a.origin==
d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&-1==Dk.indexOf("Trident")&&-1==Dk.indexOf("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.pc;c.pc=null;a()}};return function(a){d.next={pc:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=
document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){aa.setTimeout(a,0)}};function Mm(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function Nm(a,b,c,d){this.head=a;this.O=b;this.length=c;this.f=d}Nm.prototype.pop=function(){if(0===this.length)return null;var a=this.f[this.O];this.f[this.O]=null;this.O=(this.O+1)%this.f.length;--this.length;return a};Nm.prototype.unshift=function(a){this.f[this.head]=a;this.head=(this.head+1)%this.f.length;this.length+=1;return null};function Om(a,b){a.length+1===a.f.length&&a.resize();a.unshift(b)}
Nm.prototype.resize=function(){var a=Array(2*this.f.length);return this.O<this.head?(Mm(this.f,this.O,a,0,this.length),this.O=0,this.head=this.length,this.f=a):this.O>this.head?(Mm(this.f,this.O,a,0,this.f.length-this.O),Mm(this.f,0,a,this.f.length-this.O,this.head),this.O=0,this.head=this.length,this.f=a):this.O===this.head?(this.head=this.O=0,this.f=a):null};function Pm(a,b){for(var c=a.length,d=0;;)if(d<c){var e=a.pop();(b.b?b.b(e):b.call(null,e))&&a.unshift(e);d+=1}else break}
function Qm(a){return new Nm(0,0,0,Array(a))}function Rm(a,b){this.K=a;this.n=b;this.g=2;this.C=0}function Sm(a){return a.K.length===a.n}Rm.prototype.yc=function(a,b){Om(this.K,b);return this};Rm.prototype.Z=function(){return this.K.length};var Tm=Qm(32),Um=!1,Vm=!1;Wm;function Xm(){Um=!0;Vm=!1;for(var a=0;;){var b=Tm.pop();if(null!=b&&(b.m?b.m():b.call(null),1024>a)){a+=1;continue}break}Um=!1;return 0<Tm.length?Wm.m?Wm.m():Wm.call(null):null}function Wm(){var a=Vm;if(x(x(a)?Um:a))return null;Vm=!0;!ca(aa.setImmediate)||aa.Window&&aa.Window.prototype&&aa.Window.prototype.setImmediate==aa.setImmediate?(Km||(Km=Lm()),Km(Xm)):aa.setImmediate(Xm)}function Ym(a){Om(Tm,a);Wm()}function Zm(a,b){setTimeout(a,b)};var $m,an=function an(b){"undefined"===typeof $m&&($m=function(b,d,e){this.Ic=b;this.G=d;this.fd=e;this.g=425984;this.C=0},$m.prototype.R=function(b,d){return new $m(this.Ic,this.G,d)},$m.prototype.P=function(){return this.fd},$m.prototype.Eb=function(){return this.G},$m.cc=function(){return new R(null,3,5,S,[Qc(Yi,new v(null,1,[Ae,pc(Be,pc(new R(null,1,5,S,[kj],null)))],null)),kj,Ej],null)},$m.sb=!0,$m.Za="cljs.core.async.impl.channels/t_cljs$core$async$impl$channels22071",$m.Ob=function(b,d){return Pb(d,
"cljs.core.async.impl.channels/t_cljs$core$async$impl$channels22071")});return new $m(an,b,W)};function bn(a,b){this.Pb=a;this.G=b}function cn(a){return pm(a.Pb)}var dn=function dn(b){if(null!=b&&null!=b.xc)return b.xc();var c=dn[t(null==b?null:b)];if(null!=c)return c.b?c.b(b):c.call(null,b);c=dn._;if(null!=c)return c.b?c.b(b):c.call(null,b);throw Ra("MMC.abort",b);};function en(a,b,c,d,e,f,g){this.Bb=a;this.bc=b;this.mb=c;this.ac=d;this.K=e;this.closed=f;this.Ja=g}
en.prototype.xc=function(){for(;;){var a=this.mb.pop();if(null!=a){var b=a.Pb;Ym(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(b.Fa,b,a.G,a,this))}break}Pm(this.mb,He(!1));return om(this)};
function zm(a,b,c){var d=a.closed;if(d)an(!d);else if(x(function(){var b=a.K;return x(b)?Oa(Sm(a.K)):b}())){for(var e=Tc(a.Ja.a?a.Ja.a(a.K,b):a.Ja.call(null,a.K,b));;){if(0<a.Bb.length&&0<N(a.K)){c=a.Bb.pop();var f=c.Fa,g=a.K.K.pop();Ym(function(a,b){return function(){return a.b?a.b(b):a.call(null,b)}}(f,g,c,e,d,a))}break}e&&dn(a);an(!0)}else e=function(){for(;;){var b=a.Bb.pop();if(x(b)){if(x(!0))return b}else return null}}(),x(e)?(c=qm(e),Ym(function(a){return function(){return a.b?a.b(b):a.call(null,
b)}}(c,e,d,a)),an(!0)):(64<a.ac?(a.ac=0,Pm(a.mb,cn)):a.ac+=1,Om(a.mb,new bn(c,b)))}
function xm(a,b){if(null!=a.K&&0<N(a.K)){for(var c=b.Fa,d=an(a.K.K.pop());;){if(!x(Sm(a.K))){var e=a.mb.pop();if(null!=e){var f=e.Pb,g=e.G;Ym(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(f.Fa,f,g,e,c,d,a));Tc(a.Ja.a?a.Ja.a(a.K,g):a.Ja.call(null,a.K,g))&&dn(a);continue}}break}return d}c=function(){for(;;){var b=a.mb.pop();if(x(b)){if(pm(b.Pb))return b}else return null}}();if(x(c))return d=qm(c.Pb),Ym(function(a){return function(){return a.b?a.b(!0):a.call(null,!0)}}(d,c,a)),an(c.G);
if(x(a.closed))return x(a.K)&&(a.Ja.b?a.Ja.b(a.K):a.Ja.call(null,a.K)),x(x(!0)?b.Fa:!0)?(c=function(){var b=a.K;return x(b)?0<N(a.K):b}(),c=x(c)?a.K.K.pop():null,an(c)):null;64<a.bc?(a.bc=0,Pm(a.Bb,pm)):a.bc+=1;Om(a.Bb,b);return null}
en.prototype.Yb=function(){var a=this;if(!a.closed)for(a.closed=!0,x(function(){var b=a.K;return x(b)?0===a.mb.length:b}())&&(a.Ja.b?a.Ja.b(a.K):a.Ja.call(null,a.K));;){var b=a.Bb.pop();if(null==b)break;else{var c=b.Fa,d=x(function(){var b=a.K;return x(b)?0<N(a.K):b}())?a.K.K.pop():null;Ym(function(a,b){return function(){return a.b?a.b(b):a.call(null,b)}}(c,d,b,this))}}return null};function fn(a){console.log(a);return null}
function gn(a,b){var c=(x(null)?null:fn).call(null,b);return null==c?a:sm.a(a,c)}
function hn(a){return new en(Qm(32),0,Qm(32),0,a,!1,function(){return function(a){return function(){function c(c,d){try{return a.a?a.a(c,d):a.call(null,c,d)}catch(e){return gn(c,e)}}function d(c){try{return a.b?a.b(c):a.call(null,c)}catch(d){return gn(c,d)}}var e=null,e=function(a,b){switch(arguments.length){case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};e.b=d;e.a=c;return e}()}(x(null)?null.b?null.b(sm):null.call(null,sm):sm)}())};function jn(a){if(x(rc.a?rc.a(0,a):rc.call(null,0,a)))return id;if(x(rc.a?rc.a(1,a):rc.call(null,1,a)))return new R(null,1,5,S,[new R(null,2,5,S,[0,0],null)],null);if(x(rc.a?rc.a(2,a):rc.call(null,2,a)))return new R(null,2,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[1,1],null)],null);if(x(rc.a?rc.a(3,a):rc.call(null,3,a)))return new R(null,3,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[0,0],null),new R(null,2,5,S,[1,1],null)],null);if(x(rc.a?rc.a(4,a):rc.call(null,4,a)))return new R(null,
4,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[-1,1],null),new R(null,2,5,S,[1,-1],null),new R(null,2,5,S,[1,1],null)],null);if(x(rc.a?rc.a(5,a):rc.call(null,5,a)))return new R(null,5,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[-1,1],null),new R(null,2,5,S,[0,0],null),new R(null,2,5,S,[1,-1],null),new R(null,2,5,S,[1,1],null)],null);if(x(rc.a?rc.a(6,a):rc.call(null,6,a)))return new R(null,6,5,S,[new R(null,2,5,S,[-1,-1],null),new R(null,2,5,S,[-1,0],null),new R(null,2,5,S,[-1,1],
null),new R(null,2,5,S,[1,-1],null),new R(null,2,5,S,[1,0],null),new R(null,2,5,S,[1,1],null)],null);throw Error([A("No matching clause: "),A(a)].join(""));}var kn=Jg(function(a){return a.x},function(a){return a.y});
function ln(a){var b=P(a,0),c=P(a,1),d=Math.ceil(Math.sqrt(4)),e=b/d,f=c/d;return function(a,b,c,d,e,f,q){return function u(w){return new ie(null,function(a,b,c,d,e,f,g){return function(){for(var h=w;;){var l=H(h);if(l){var m=l,n=I(m);if(l=H(function(a,b,c,d,e,f,g,h,l,m,n){return function jb(p){return new ie(null,function(a,b,c,d,e,f,g,h){return function(){for(;;){var a=H(p);if(a){if(xd(a)){var c=ac(a),d=N(c),e=me(d);a:for(var l=0;;)if(l<d){var m=db.a(c,l),m=Q.h(h,Sj,m*f,G([rh,b*g],0));e.add(m);l+=
1}else{c=!0;break a}return c?ne(e.W(),jb(bc(a))):ne(e.W(),null)}e=I(a);return M(Q.h(h,Sj,e*f,G([rh,b*g],0)),jb(Cc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n),null,null)}}(h,n,m,l,a,b,c,d,e,f,g)(new Fg(null,0,a,1,null))))return se.a(l,u(Cc(h)));h=Cc(h)}else return null}}}(a,b,c,d,e,f,q),null,null)}}(d,e,f,new v(null,2,[ni,e,tk,f],null),a,b,c)(new Fg(null,0,d,1,null))}var mn=Jg(Je(B,Rd),Je(B,Qd));
function nn(a,b){var c=P(a,0),d=P(a,1),e=P(b,0),f=P(b,1),g=rc.a(c,d)?new R(null,2,5,S,[0,1],null):new R(null,2,5,S,[c,d],null),h=P(g,0),l=P(g,1),m=(f-e)/(l-h);return function(a,b,c,d,e){return function(a){return d*a+e}}(g,h,l,m,f-m*l,a,c,d,b,e,f)}
var on=function on(b,c){return rc.a(1,b)?T.a(pc,c):new ie(null,function(){var d=H(c);if(d){var e=P(d,0),f=Vd(d,1);return se.a(function(){return function(b,c,d,e){return function p(f){return new ie(null,function(b,c){return function(){for(;;){var b=H(f);if(b){if(xd(b)){var d=ac(b),e=N(d),g=me(e);a:for(var h=0;;)if(h<e){var l=db.a(d,h),l=M(c,l);g.add(l);h+=1}else{d=!0;break a}return d?ne(g.W(),p(bc(b))):ne(g.W(),null)}g=I(b);return M(M(c,g),p(Cc(b)))}return null}}}(b,c,d,e),null,null)}}(d,e,f,d)(on(b-
1,f))}(),on(b,f))}return null},null,null)};
function pn(a){function b(a){var b=sc;H(a)?(a=Id.b?Id.b(a):Id.call(null,a),b=Hd(b),ua(a,b),a=H(a)):a=Dc;b=P(a,0);a=P(a,1);var c=(18-(a-b))/2,b=[b,b-c,a,a+c];a=[];for(c=0;;)if(c<b.length){var g=b[c],h=b[c+1];-1===Nf(a,g)&&(a.push(g),a.push(h));c+=2}else break;return new v(null,a.length/2,a,null)}for(;;){var c=fd(B.c(Cg,I,$e(function(){return function(a){return 0<I(a)&&18>I(a)}}(a,b),T.a(function(){return function(a){var b=S,c=B.a(Nd,a);return new R(null,2,5,b,[Math.abs(c),a],null)}}(a,b),on(2,a)))));
if(x(c))a=Ag(b(c),a);else return a}}function qn(a,b){return se.a(a,Te(N(a),b))}function rn(a,b,c){var d=null!=b&&(b.g&64||b.F)?B.a(Oc,b):b;b=C.a(d,ni);var d=C.a(d,tk),e=null!=c&&(c.g&64||c.F)?B.a(Oc,c):c;c=C.a(e,sk);var e=C.a(e,Xj),f=B.a(se,a);a=qn(e,function(){var a=T.a(I,f);return mn.b?mn.b(a):mn.call(null,a)}());c=qn(c,function(){var a=T.a(fd,f);return mn.b?mn.b(a):mn.call(null,a)}());return new R(null,2,5,S,[nn(a,new R(null,2,5,S,[0,b],null)),nn(c,new R(null,2,5,S,[d,0],null))],null)};function sn(a,b,c){this.key=a;this.G=b;this.forward=c;this.g=2155872256;this.C=0}sn.prototype.U=function(){return bb(bb(Dc,this.G),this.key)};sn.prototype.L=function(a,b,c){return wf(b,xf,"["," ","]",c,this)};function tn(a,b,c){c=Array(c+1);for(var d=0;;)if(d<c.length)c[d]=null,d+=1;else break;return new sn(a,b,c)}function un(a,b,c,d){for(;;){if(0>c)return a;a:for(;;){var e=a.forward[c];if(x(e))if(e.key<b)a=e;else break a;else break a}null!=d&&(d[c]=a);--c}}
function vn(a,b){this.ib=a;this.level=b;this.g=2155872256;this.C=0}vn.prototype.put=function(a,b){var c=Array(15),d=un(this.ib,a,this.level,c).forward[0];if(null!=d&&d.key===a)return d.G=b;a:for(d=0;;)if(.5>Math.random()&&15>d)d+=1;else break a;if(d>this.level){for(var e=this.level+1;;)if(e<=d+1)c[e]=this.ib,e+=1;else break;this.level=d}for(d=tn(a,b,Array(d));;)return 0<=this.level?(c=c[0].forward,d.forward[0]=c[0],c[0]=d):null};
vn.prototype.remove=function(a){var b=Array(15),c=un(this.ib,a,this.level,b).forward[0];if(null!=c&&c.key===a){for(a=0;;)if(a<=this.level){var d=b[a].forward;d[a]===c&&(d[a]=c.forward[a]);a+=1}else break;for(;;)if(0<this.level&&null==this.ib.forward[this.level])--this.level;else return null}else return null};function wn(a){for(var b=xn,c=b.ib,d=b.level;;){if(0>d)return c===b.ib?null:c;var e;a:for(e=c;;){e=e.forward[d];if(null==e){e=null;break a}if(e.key>=a)break a}null!=e?(--d,c=e):--d}}
vn.prototype.U=function(){return function(a){return function c(d){return new ie(null,function(){return function(){return null==d?null:M(new R(null,2,5,S,[d.key,d.G],null),c(d.forward[0]))}}(a),null,null)}}(this)(this.ib.forward[0])};vn.prototype.L=function(a,b,c){return wf(b,function(){return function(a){return wf(b,xf,""," ","",c,a)}}(this),"{",", ","}",c,this)};var xn=new vn(tn(null,null,0),0);
function yn(a){var b=(new Date).valueOf()+a,c=wn(b),d=x(x(c)?c.key<b+10:c)?c.G:null;if(x(d))return d;var e=hn(null);xn.put(b,e);Zm(function(a,b,c){return function(){xn.remove(c);return om(a)}}(e,d,b,c),a);return e};function zn(){var a=rc.a(1,0)?null:1;return hn("number"===typeof a?new Rm(Qm(a),a):a)}
(function An(b){"undefined"===typeof nm&&(nm=function(b,d,e){this.mc=b;this.Fa=d;this.dd=e;this.g=393216;this.C=0},nm.prototype.R=function(b,d){return new nm(this.mc,this.Fa,d)},nm.prototype.P=function(){return this.dd},nm.prototype.zc=function(){return!0},nm.prototype.Ac=function(){return this.Fa},nm.cc=function(){return new R(null,3,5,S,[Qc(hk,new v(null,2,[Th,!0,Ae,pc(Be,pc(new R(null,1,5,S,[Ak],null)))],null)),Ak,ji],null)},nm.sb=!0,nm.Za="cljs.core.async/t_cljs$core$async19240",nm.Ob=function(b,
d){return Pb(d,"cljs.core.async/t_cljs$core$async19240")});return new nm(An,b,W)})(function(){return null});var Bn=X.b?X.b(W):X.call(null,W);function Cn(a){return Qe.l(Bn,Q,Vg("animation"),a)}
function Dn(){var a=1E3/30,b=zn();Ym(function(a,b){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!ge(e,yi)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Am(c),d=yi;else throw f;}if(!ge(d,yi))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.m=c;d.b=b;return d}()}(function(a,b){return function(a){var c=a[1];if(7===c)return c=a,c[2]=a[2],c[1]=4,yi;if(20===c){var c=a[7],d=a[8],e=I(d),d=P(e,0),e=P(e,1),c=e.b?e.b(c):e.call(null,c);a[9]=d;a[1]=x(c)?22:23;return yi}if(1===c)return c=yn(0),wm(a,2,c);if(24===c){var d=a[8],e=a[2],c=J(d),f;a[10]=0;a[11]=e;a[12]=0;a[13]=null;a[14]=c;a[2]=null;a[1]=8;return yi}if(4===c)return c=a[2],ym(a,c);if(15===c){e=a[10];f=a[12];
var d=a[13],c=a[14],g=a[2];a[10]=e+1;a[15]=g;a[12]=f;a[13]=d;a[14]=c;a[2]=null;a[1]=8;return yi}return 21===c?(c=a[2],a[2]=c,a[1]=18,yi):13===c?(a[2]=null,a[1]=15,yi):22===c?(a[2]=null,a[1]=24,yi):6===c?(a[2]=null,a[1]=7,yi):25===c?(c=a[7],c+=b,a[16]=a[2],a[7]=c,a[2]=null,a[1]=3,yi):17===c?(a[2]=null,a[1]=18,yi):3===c?(c=K.b?K.b(Bn):K.call(null,Bn),c=H(c),a[1]=c?5:6,yi):12===c?(c=a[2],a[2]=c,a[1]=9,yi):2===c?(c=a[2],a[7]=0,a[17]=c,a[2]=null,a[1]=3,yi):23===c?(d=a[9],c=Qe.c(Bn,nd,d),a[2]=c,a[1]=24,
yi):19===c?(d=a[8],c=ac(d),d=bc(d),e=N(c),a[10]=0,a[12]=e,a[13]=c,a[14]=d,a[2]=null,a[1]=8,yi):11===c?(c=a[14],c=H(c),a[8]=c,a[1]=c?16:17,yi):9===c?(c=a[2],d=yn(b),a[18]=c,wm(a,25,d)):5===c?(c=K.b?K.b(Bn):K.call(null,Bn),c=H(c),a[10]=0,a[12]=0,a[13]=null,a[14]=c,a[2]=null,a[1]=8,yi):14===c?(d=a[19],c=Qe.c(Bn,nd,d),a[2]=c,a[1]=15,yi):16===c?(d=a[8],c=xd(d),a[1]=c?19:20,yi):10===c?(e=a[10],c=a[7],d=a[13],e=db.a(d,e),d=P(e,0),e=P(e,1),c=e.b?e.b(c):e.call(null,c),a[19]=d,a[1]=x(c)?13:14,yi):18===c?(c=
a[2],a[2]=c,a[1]=12,yi):8===c?(e=a[10],f=a[12],c=e<f,a[1]=x(c)?10:11,yi):null}}(a,b),a,b)}(),f=function(){var b=e.m?e.m():e.call(null);b[6]=a;return b}();return vm(f)}}(b,a));return b}function En(a){return a*a}
function Fn(a,b,c){var d=null!=c&&(c.g&64||c.F)?B.a(Oc,c):c,e=C.c(d,mk,0),f=C.a(d,Bi),g=C.c(d,wi,Kd);return function(c,d,e,f,g){return function(c){if(c<=e)return!0;if(c<e+f)return c=(c-e)/f,c=g.b?g.b(c):g.call(null,c),b.a?b.a(a,c):b.call(null,a,c),!0;b.a?b.a(a,1):b.call(null,a,1);return!1}}(c,d,e,f,g)}function Gn(a,b){return function(c){return Cn(Fn(c,a,b))}}
function Hn(a,b,c){return function(d){var e=function(c){return function(e,h){var l,m=a.getPointAtLength(h*c);l=kn.b?kn.b(m):kn.call(null,m);m=P(l,0);l=P(l,1);m=new R(null,2,5,S,[m,l],null);return b.a?b.a(d,m):b.call(null,d,m)}}(a.getTotalLength());return Cn(Fn(d,e,c))}};function In(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;return Jn(0<b.length?new Bc(b.slice(0),0):null)}function Jn(a){return vg.h(G([new v(null,2,[gi,0,zi,Mh],null),B.a(Oc,a)],0))}function Kn(a){return vg.h(G([md([uh,Rh,zi,pj,Rj,gk,pk,qk,rk],[999999,null,Mh,Vg("station"),id,0,Se(4,Ue(ti)),id,new v(null,1,[zi,Ii],null)]),B.a(Oc,a)],0))}
function Ln(a){for(var b=[],c=arguments.length,d=0;;)if(d<c)b.push(arguments[d]),d+=1;else break;return Mn(0<b.length?new Bc(b.slice(0),0):null)}function Mn(a){return vg.h(G([new v(null,2,[Oh,id,Qh,id],null),B.a(Oc,a)],0))}var Nn=new R(null,5,5,S,[Jn(G([zi,oi],0)),In(),In(),In(),In()],null);function On(a){return vg.h(G([new v(null,3,[lk,0,bk,Nn,ei,id],null),B.a(Oc,a)],0))}
var Pn=Mn(G([di,Mj,Qh,new R(null,6,5,S,[Kn(G([zi,oi,Fh,0],0)),Kn(G([vh,0,Fh,1,Vj,!0],0)),Kn(G([vh,1,Fh,2],0)),Kn(G([vh,2,Fh,3],0)),Kn(G([vh,3,Fh,4,Gj,0],0)),Kn(G([zi,Hj,vh,4],0))],null)],0)),Qn=Mn(G([di,Uh,Qh,new R(null,6,5,S,[Kn(G([zi,oi,Fh,0,rk,new v(null,1,[zi,Ti],null)],0)),Kn(G([vh,0,Fh,1,rk,new v(null,1,[zi,Ti],null),Vj,!0],0)),Kn(G([vh,1,Fh,2,rk,new v(null,1,[zi,Ti],null)],0)),Kn(G([vh,2,Fh,3],0)),Kn(G([vh,3,Fh,4,rk,new v(null,1,[zi,Ti],null),Gj,0],0)),Kn(G([zi,Hj,vh,4],0))],null)],0)),Rn=
Mn(G([di,Ei,Qh,new R(null,6,5,S,[Kn(G([zi,oi,Fh,0,rk,new v(null,3,[zi,Ei,xh,3,ai,Rh],null)],0)),Kn(G([vh,0,Fh,1,rk,new v(null,1,[zi,Ti],null),Vj,!0],0)),Kn(G([vh,1,Fh,2,rk,new v(null,1,[zi,Ti],null)],0)),Kn(G([vh,2,Fh,3],0)),Kn(G([vh,3,Fh,4,rk,new v(null,1,[zi,Ti],null),Gj,0],0)),Kn(G([zi,Hj,vh,4],0))],null)],0)),Sn=Mn(G([di,ak,Qh,new R(null,6,5,S,[Kn(G([zi,oi,Fh,0,rk,new v(null,3,[zi,Ei,xh,3,ai,Gi],null)],0)),Kn(G([vh,0,Fh,1,rk,new v(null,1,[zi,Ti],null),Vj,!0],0)),Kn(G([vh,1,Fh,2,rk,new v(null,
1,[zi,Ti],null)],0)),Kn(G([vh,2,Fh,3,pk,Se(6,Ue(ti))],0)),Kn(G([vh,3,Fh,4,rk,new v(null,1,[zi,Ti],null),Gj,0],0)),Kn(G([zi,Hj,vh,4],0))],null)],0)),Tn=new v(null,7,[Mj,On(G([ei,new R(null,3,5,S,[Pn,Ln(),Ln()],null)],0)),Uh,On(G([ei,new R(null,3,5,S,[Ln(),Qn,Ln()],null)],0)),Ei,On(G([ei,new R(null,3,5,S,[Ln(),Ln(),Rn],null)],0)),Zh,On(G([ei,new R(null,3,5,S,[Pn,Qn,Ln()],null)],0)),bj,On(G([ei,new R(null,3,5,S,[Pn,Qn,Rn],null)],0)),zh,On(G([ei,new R(null,3,5,S,[Pn,Qn,Sn],null)],0)),jj,On(G([ei,new R(null,
4,5,S,[Pn,Qn,Rn,Sn],null)],0))],null);function Un(a){return mm(km(jm(hm(Yl(Vl(gf.c(a,lk,Rc),Ve(function(){return 6*Math.random()+1|0})))))))}function Vn(a,b){for(var c=0,d=Rl(b);;)if(c<a)c+=1,d=Un(d);else return d}function Wn(a){a:for(var b=W,c=H(new R(null,6,5,S,[vj,Ji,vi,Dh,Zi,xi],null));;)if(c)var d=I(c),e=C.c(a,d,wk),b=rc.a(e,wk)?b:Q.c(b,d,e),c=J(c);else{a=Qc(b,pd(a));break a}return a}function Xn(a){return cf.a(W,af(Ie.a(Ma,I),T.a(Jg(di,Ie.a(function(a){return T.a(Wn,a)},Oh)),ei.b(a))))}
function Yn(a,b){var c;a:{var d=Qf(b),e=T.a(a,Rf(b));c=Tb(W);d=H(d);for(e=H(e);;)if(d&&e)c=ve(c,I(d),I(e)),d=J(d),e=J(e);else{c=Vb(c);break a}}return c}var Zn=function Zn(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Zn.h(arguments[0],1<c.length?new Bc(c.slice(1),0):null)};Zn.h=function(a,b){return Yn(function(b){return B.a(a,b)},Yn(function(a){return T.a(Yd,a)},bh(Xd,B.a(se,b))))};Zn.w=1;Zn.B=function(a){var b=I(a);a=J(a);return Zn.h(b,a)};
function $n(a){return Yn(function(a){return B.c(T,Af,a)},Yn(function(a){return T.a(Yd,a)},bh(Xd,B.a(se,a))))}
function ao(a){var b=function(){var b=Xn(a);return X.b?X.b(b):X.call(null,b)}(),c=X.b?X.b(1):X.call(null,1),d=function(a,b){return function(a,c){return((K.b?K.b(b):K.call(null,b))*a+c)/((K.b?K.b(b):K.call(null,b))+1)}}(b,c);return function(a,b,c,d){return function(l){l=Yn(function(a,b,c,d,e){return function(a){return T.a(e,a)}}(a,a,b,c,d),$n(G([K.b?K.b(a):K.call(null,a),Xn(l)],0)));Pe.a?Pe.a(a,l):Pe.call(null,a,l);Qe.a(b,Rc);return K.b?K.b(a):K.call(null,a)}}(b,c,d,function(a,b,c){return function(a){return B.c(Zn,
c,a)}}(b,c,d))};var bo,co=new v(null,3,[lk,250,fj,400,li,400],null);bo=X.b?X.b(co):X.call(null,co);function eo(a){this.Fa=a}eo.prototype.bd=function(a,b,c){return this.Fa.c?this.Fa.c(a,b,c):this.Fa.call(null,a,b,c)};ba("Hook",eo);ba("Hook.prototype.hook",eo.prototype.bd);var fo=new v(null,4,[Mj,rj,Uh,hi,Ei,sj,ak,Zj],null);function go(a){var b=P(a,0);a=P(a,1);return[A(b),A(","),A(a)].join("")}function ho(a,b,c){var d=P(a,0);P(a,1);a=P(b,0);var e=P(b,1);b=P(c,0);c=P(c,1);var d=d-a,f=(e-c)/2*(d/Math.abs(d)),g=f/2,d=new R(null,2,5,S,[a+f,e],null);a=new R(null,2,5,S,[a-g,e],null);e=new R(null,2,5,S,[b-g,c],null);b=new R(null,2,5,S,[b+f,c],null);return[A("L"),A(go(d)),A("C"),A(go(a)),A(","),A(go(e)),A(","),A(go(b))].join("")}
function io(a){return H(a)?B.c(A,"M",Ye(T.a(go,a))):null}function jo(a,b){return[A("translate("),A(a),A(","),A(b),A(")")].join("")}
function ko(a){var b=null!=a&&(a.g&64||a.F)?B.a(Oc,a):a,c=C.a(b,ni),d=C.a(b,tk),e=C.a(b,Sj),f=C.a(b,rh),g=C.a(b,gi),h=c/2;return new R(null,4,5,S,[$i,new v(null,1,[Eh,jo(h,h)],null),new R(null,2,5,S,[kk,new v(null,5,[qj,"die",Sj,-h,rh,-h,ni,c,tk,c],null)],null),function(){return function(a,b,c,d,e,f,g,h,z){return function F(L){return new ie(null,function(a,b,c,d,e){return function(){for(;;){var b=H(L);if(b){if(xd(b)){var c=ac(b),d=N(c),f=me(d);a:for(var g=0;;)if(g<d){var h=db.a(c,g),l=P(h,0),h=P(h,
1),l=new R(null,2,5,S,[ki,new v(null,3,[oj,a.b?a.b(l):a.call(null,l),tj,a.b?a.b(h):a.call(null,h),Ah,e/10],null)],null);f.add(l);g+=1}else{c=!0;break a}return c?ne(f.W(),F(bc(b))):ne(f.W(),null)}c=I(b);f=P(c,0);c=P(c,1);return M(new R(null,2,5,S,[ki,new v(null,3,[oj,a.b?a.b(f):a.call(null,f),tj,a.b?a.b(c):a.call(null,c),Ah,e/10],null)],null),F(Cc(b)))}return null}}}(a,b,c,d,e,f,g,h,z),null,null)}}(Je(Od,c/4),h,a,b,c,d,e,f,g)(jn(g))}()],null)}
function lo(a,b){for(var c=a-10,d=id,e=!0,f=b-10;;)if(0<f)d=se.a(d,e?new R(null,2,5,S,[new R(null,2,5,S,[c,f],null),new R(null,2,5,S,[10,f],null)],null):new R(null,2,5,S,[new R(null,2,5,S,[10,f],null),new R(null,2,5,S,[c,f],null)],null)),e=!e,f-=20;else{c=S;a:for(e=P(d,0),f=Vd(d,1),d=[A("M"),A(go(e))].join(""),P(f,0),P(f,1),Vd(f,2);;){var g=f,h=P(g,0),f=P(g,1),g=Vd(g,2),l;l=h;x(l)&&(l=f,l=x(l)?H(g):l);if(x(l))d=[A(d),A(ho(e,h,f))].join(""),e=f,f=g;else{d=x(h)?[A(d),A("L"),A(go(h))].join(""):d;break a}}return new R(null,
2,5,c,[th,new v(null,2,[qj,"penny-path",Oj,d],null)],null)}}function mo(a,b,c){a=a.getPointAtLength(c*b+20);return kn.b?kn.b(a):kn.call(null,a)}function no(a,b,c){var d=P(a,0);a=P(a,1);return new R(null,4,5,S,[$i,new v(null,2,[Eh,jo(d,a),Fj,x(c)?new eo(c):null],null),new R(null,2,5,S,[ki,new v(null,2,[qj,"penny fill",Ah,8],null)],null),rc.a(b,mi)?new R(null,2,5,S,[ki,new v(null,2,[qj,"tracer",Ah,4],null)],null):null],null)}
function oo(a,b,c){var d=null!=c&&(c.g&64||c.F)?B.a(Oc,c):c,e=C.a(d,pk),f=C.a(d,uk),g=C.a(d,Kh),h=C.a(d,Ph);return bb(bb(Dc,function(){var a=d.b?d.b(th):d.call(null,th);return x(a)?bb(bb(Dc,de(Le(function(a,b,c,d,e,f,g,h,l){return function(F,L){var O=function(a,b,c,d,e,f,g){return function(b){return mo(a,b,g)}}(a,b,c,d,e,f,g,h,l);return no(O(F),L,0<h?Gn(function(a,b,c,d,e,f,g,h,l){return function(b,c){var d;d=F-c*l;d=-1>d?-1:d;var e=a(d),f=P(e,0),e=P(e,1);b.setAttribute("transform",jo(f,e));return rc.a(-1,
d)?b.setAttribute("transform","scale(0)"):null}}(O,a,b,c,d,e,f,g,h,l),new v(null,1,[Bi,(K.b?K.b(bo):K.call(null,bo)).call(null,fj)],null)):null)}}(a,a,c,d,d,e,f,g,h),e))),de(Le(function(){return function(a,b,c,d,e,f,g,h,l,F){return function(L,O){var Aa=mo(b,a+L,h),E=P(Aa,0),ka=P(Aa,1);return no(new R(null,2,5,S,[E,F],null),O,Gn(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r){return function(a,c){return a.setAttribute("transform",jo(b,r+c*d))}}(Aa,E,ka,ka-F,a,b,c,d,e,f,g,h,l,F),new v(null,3,[Bi,(K.b?K.b(bo):
K.call(null,bo)).call(null,li),mk,50*L,wi,En],null)))}}(N(e),a,a,c,d,d,e,f,g,h)}(),d.b?d.b(Si):d.call(null,Si)))):null}()),lo(a,b))}
function po(a,b,c,d){var e=b-20,f=S;a=new v(null,2,[qj,"spout",Eh,jo(0,a)],null);var g=S,e=[A(io(new R(null,6,5,S,[new R(null,2,5,S,[b,-20],null),new R(null,2,5,S,[b,23],null),new R(null,2,5,S,[0,23],null),new R(null,2,5,S,[0,3],null),new R(null,2,5,S,[e,3],null),new R(null,2,5,S,[e,-20],null)],null))),A("Z")].join("");return new R(null,4,5,f,[$i,a,new R(null,2,5,g,[th,new v(null,1,[Oj,e],null)],null),x(d)?new R(null,3,5,S,[yk,new v(null,3,[qj,"infotext fill",Eh,jo(b/2,23),si,-5],null),c],null):null],
null)}if("undefined"===typeof qo){var qo,ro=X.b?X.b(W):X.call(null,W),so=X.b?X.b(W):X.call(null,W),to=X.b?X.b(W):X.call(null,W),uo=X.b?X.b(W):X.call(null,W),vo=C.c(W,fk,dh());qo=new oh(zc.a("pennygame.ui","station"),zi,bi,vo,ro,so,to,uo)}qh(qo,oi,function(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Oc,a):a,d=C.a(c,ni);C.a(c,Bj);var e=C.a(c,Ph),c=C.c(c,nk,W),c=c.a?c.a(vj,0):c.call(null,vj,0);return po(10+e,d,0===c?"In":c,b)});
qh(qo,Mh,function(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Oc,a):a,d=C.a(c,ni),e=C.a(c,Bj),f=Dc,g;g=c.b?c.b(Ph):c.call(null,Ph);g=po(g,d,"",b);c=bb(bb(bb(f,g),oo(d,e,new v(null,6,[pk,c.b?c.b(pk):c.call(null,pk),uk,c.b?c.b(uh):c.call(null,uh),Kh,x(c.b?c.b(Fi):c.call(null,Fi))?c.b?c.b(Rh):c.call(null,Rh):0,Si,x(c.b?c.b(Qj):c.call(null,Qj))?c.b?c.b(qk):c.call(null,qk):null,th,Bk(c.b?c.b(pj):c.call(null,pj)),Ph,c.b?c.b(qi):c.call(null,qi)],null))),new R(null,2,5,S,[kk,new v(null,3,[qj,"bin",ni,d,tk,e],null)],
null));a:for(f=id,g=!0,e-=20;;)if(0<e)f=hd.a(f,new R(null,2,5,S,[ij,new v(null,4,[qj,"shelf",Eh,jo(0,e),Uj,g?20:0,ok,g?d:d-20],null)],null)),g=!g,e-=20;else{d=new R(null,3,5,S,[$i,W,B.a(pc,f)],null);break a}return bb(c,d)});
qh(qo,Hj,function(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Oc,a):a,d=C.a(c,ni),e=C.a(c,pj),f=C.a(c,Bj),g=C.a(c,qi),h=C.c(c,nk,W),l=C.a(c,qk),m=C.a(c,Qj),n=1/265*f*967;return bb(bb(bb(bb(Dc,x(b)?function(){var a=h.a?h.a(vi,0):h.call(null,vi,0),b=h.a?h.a(xi,0):h.call(null,xi,0);return new R(null,4,5,S,[$i,W,new R(null,3,5,S,[yk,new v(null,2,[qj,"infotext fill",si,24],null),0===b?"Delivery":b],null),new R(null,3,5,S,[yk,new v(null,4,[qj,"infotext fill",Hh,d,si,24,sh,"end"],null),0===a?"Out":a],null)],null)}():
null),new R(null,2,5,S,[Nj,new v(null,3,[xj,truckSrc,Sj,d/2+n/2,tk,f],null)],null)),new R(null,2,5,S,[th,new v(null,2,[qj,"ramp",Oj,[A("M"),A(go(new R(null,2,5,S,[10,g],null))),A("C"),A(go(new R(null,2,5,S,[10,f/2],null))),A(","),A(go(new R(null,2,5,S,[10,f/2],null))),A(","),A(go(new R(null,2,5,S,[d/2+n,f/2],null)))].join("")],null)],null)),function(){var b=Ck(e);return x(x(b)?m:b)?Le(function(a,b,c,d,e,f,g,h,l,m,n){return function(p,na){return no(new R(null,2,5,S,[10,h],null),na,Hn(a,function(){return function(a,
b){var c=P(b,0),d=P(b,1);return a.setAttribute("transform",jo(c,d))}}(a,b,c,d,e,f,g,h,l,m,n),new v(null,3,[Bi,(K.b?K.b(bo):K.call(null,bo)).call(null,li),mk,50*p,wi,En],null)))}}(b,n,a,c,d,e,f,g,h,l,m),l):null}())});
function wo(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Oc,a):a,d=C.a(c,di),e=C.a(c,ni),f=C.a(c,tk),g=C.a(c,Sj),h=C.a(c,Qh),l=C.a(c,Oh),m=H(l)?null==l?null:vb(l):null;return x(x(g)?d:g)?new R(null,4,5,S,[$i,new v(null,2,[qj,[A("scenario "),A(Wd(fo.b?fo.b(d):fo.call(null,d)))].join(""),Eh,jo(g,0)],null),function(){return function(a,c,d,e,f,g,h,l,m){return function O(Aa){return new ie(null,function(a,c,d,e,f,g,h,l,m){return function(){for(;;){var c=H(Aa);if(c){if(xd(c)){var d=ac(c),e=N(d),f=me(e);return function(){for(var c=
0;;)if(c<e){var g=db.a(d,c),h=null!=g&&(g.g&64||g.F)?B.a(Oc,g):g,g=h,l=C.a(h,rk),l=null!=l&&(l.g&64||l.F)?B.a(Oc,l):l,n=C.a(l,zi),p=C.a(h,pj),q=C.a(h,rh),h=f,l=S,n=new v(null,3,[pj,p,qj,[A(Wd(n)),A(" productivity-"),A(Wd(n))].join(""),Eh,jo(0,q)],null);H(m)&&(g=Q.c(g,nk,a));g=qo.a?qo.a(g,b):qo.call(null,g,b);h.add(new R(null,3,5,l,[$i,n,g],null));c+=1}else return!0}()?ne(f.W(),O(bc(c))):ne(f.W(),null)}var g=I(c),h=g=null!=g&&(g.g&64||g.F)?B.a(Oc,g):g,l=C.a(g,rk),l=null!=l&&(l.g&64||l.F)?B.a(Oc,l):
l,l=C.a(l,zi),n=C.a(g,pj),g=C.a(g,rh);return M(new R(null,3,5,S,[$i,new v(null,3,[pj,n,qj,[A(Wd(l)),A(" productivity-"),A(Wd(l))].join(""),Eh,jo(0,g)],null),H(m)?function(){var c=Q.c(h,nk,a);return qo.a?qo.a(c,b):qo.call(null,c,b)}():qo.a?qo.a(h,b):qo.call(null,h,b)],null),O(Cc(c)))}return null}}}(a,c,d,e,f,g,h,l,m),null,null)}}(m,a,c,d,e,f,g,h,l)(de(h))}(),x(b)?function(){var a=Ji.a(m,0);return new R(null,3,5,S,[yk,new v(null,5,[qj,"infotext fill",Sj,e/2,rh,f/2,si,26,sh,"middle"],null),0===a?"WIP":
a],null)}():null],null):null}
function xo(a,b,c){if(H(a)){var d=pn(T.a(function(a){a=gd(zk.b(a));a=b.b?b.b(a):b.call(null,a);return fd(a)},a));return function(a){return function g(d){return new ie(null,function(){return function(){for(var a=d;;)if(a=H(a)){if(xd(a)){var e=ac(a),n=N(e),p=me(n);return function(){for(var a=0;;)if(a<n){var d=db.a(e,a),g=P(d,0),g=null!=g&&(g.g&64||g.F)?B.a(Oc,g):g,h=C.a(g,zk),d=P(d,1),g=function(){var a=gd(h);return b.b?b.b(a):b.call(null,a)}(),g=P(g,0);x(g)&&oe(p,new R(null,3,5,S,[yk,new v(null,3,
[qj,[A("label "),A("history")].join(""),Eh,jo(g,d),si,7],null),function(){var a=fd(gd(h));return c.b?c.b(a):c.call(null,a)}()],null));a+=1}else return!0}()?ne(p.W(),g(bc(a))):ne(p.W(),null)}var q=I(a),r=P(q,0),r=null!=r&&(r.g&64||r.F)?B.a(Oc,r):r,u=C.a(r,zk),q=P(q,1),r=function(){var a=gd(u);return b.b?b.b(a):b.call(null,a)}(),r=P(r,0);if(x(r))return M(new R(null,3,5,S,[yk,new v(null,3,[qj,[A("label "),A("history")].join(""),Eh,jo(r,q),si,7],null),function(){var a=fd(gd(u));return c.b?c.b(a):c.call(null,
a)}()],null),g(Cc(a)));a=Cc(a)}else return null}}(a),null,null)}}(d)(T.c(Af,a,d))}return null}
function yo(a,b,c){var d=null!=a&&(a.g&64||a.F)?B.a(Oc,a):a,e=C.a(d,ni),f=C.a(d,tk),g=C.a(d,Sj),h=C.a(d,rh),l=null!=c&&(c.g&64||c.F)?B.a(Oc,c):c,m=C.a(l,Ni),n=C.a(l,sk),p=C.a(l,Oi),q=C.c(l,fi,Kd),r=f-60,u=function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w){return function Da(u){return new ie(null,function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w){return function(){for(;;){var z=H(u);if(z){var D=z;if(xd(D)){var E=ac(D),F=N(E),L=me(F);return function(){for(var u=0;;)if(u<F){var O=db.a(E,u),U=P(O,0),V=P(O,
1);oe(L,new v(null,2,[Ih,fo.b?fo.b(U):fo.call(null,U),zk,Le(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,u,z,D,E,F,L){return function(a,b){return new R(null,2,5,S,[a,L.b?L.b(b):L.call(null,b)],null)}}(u,O,U,V,E,F,L,D,z,a,b,c,d,e,f,g,h,l,m,n,p,q,r,w),V)],null));u+=1}else return!0}()?ne(L.W(),Da(bc(D))):ne(L.W(),null)}var O=I(D),U=P(O,0),V=P(O,1);return M(new v(null,2,[Ih,fo.b?fo.b(U):fo.call(null,U),zk,Le(function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,u,z){return function(a,b){return new R(null,2,5,S,[a,z.b?z.b(b):
z.call(null,b)],null)}}(O,U,V,D,z,a,b,c,d,e,f,g,h,l,m,n,p,q,r,w),V)],null),Da(Cc(D)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w),null,null)}}(30,50,r,a,d,e,f,g,h,c,l,m,n,p,q)(b)}(),w=rn(T.a(zk,u),new v(null,2,[ni,e-100,tk,r],null),new v(null,2,[Xj,id,sk,n],null)),z=P(w,0),D=P(w,1),F=function(a,b,c,d,e,f,g){return function(a){return new R(null,2,5,S,[function(){var b=I(a);return f.b?f.b(b):f.call(null,b)}(),function(){var b=fd(a);return g.b?g.b(b):g.call(null,b)}()],null)}}(30,50,r,u,w,z,D,a,d,
e,f,g,h,c,l,m,n,p,q);return new R(null,5,5,S,[$i,new v(null,2,[qj,"graph",Eh,jo(g,h)],null),new R(null,2,5,S,[kk,new v(null,2,[ni,e,tk,f],null)],null),new R(null,3,5,S,[yk,new v(null,4,[qj,"title",Sj,e/2,rh,f/2,si,10],null),p],null),new R(null,7,5,S,[$i,new v(null,1,[Eh,jo(50,30)],null),function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,u,z,D,F,Xa){return function kb(Bb){return new ie(null,function(a,b,c,d,e,f,g,h){return function(){for(;;){var a=H(Bb);if(a){if(xd(a)){var b=ac(a),c=N(b),d=me(c);
a:for(var e=0;;)if(e<c){var f=db.a(b,e),f=null!=f&&(f.g&64||f.F)?B.a(Oc,f):f;C.a(f,Ih);f=C.a(f,zk);f=new R(null,2,5,S,[th,new v(null,2,[qj,"stroke outline",Oj,io(T.a(h,f))],null)],null);d.add(f);e+=1}else{b=!0;break a}return b?ne(d.W(),kb(bc(a))):ne(d.W(),null)}d=I(a);d=null!=d&&(d.g&64||d.F)?B.a(Oc,d):d;C.a(d,Ih);d=C.a(d,zk);return M(new R(null,2,5,S,[th,new v(null,2,[qj,"stroke outline",Oj,io(T.a(h,d))],null)],null),kb(Cc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,u,z,D,F,Xa),null,null)}}(30,
50,r,u,w,z,D,F,a,d,e,f,g,h,c,l,m,n,p,q)(u)}(),function(){return function(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,u,z,D,F,Xa){return function kb(Bb){return new ie(null,function(a,b,c,d,e,f,g,h){return function(){for(;;){var a=H(Bb);if(a){if(xd(a)){var b=ac(a),c=N(b),d=me(c);a:for(var e=0;;)if(e<c){var f=db.a(b,e),g=null!=f&&(f.g&64||f.F)?B.a(Oc,f):f,f=C.a(g,Ih),g=C.a(g,zk),f=new R(null,2,5,S,[th,new v(null,2,[qj,[A("history stroke "),A(Wd(f))].join(""),Oj,io(T.a(h,g))],null)],null);d.add(f);e+=1}else{b=!0;break a}return b?
ne(d.W(),kb(bc(a))):ne(d.W(),null)}d=I(a);b=null!=d&&(d.g&64||d.F)?B.a(Oc,d):d;d=C.a(b,Ih);b=C.a(b,zk);return M(new R(null,2,5,S,[th,new v(null,2,[qj,[A("history stroke "),A(Wd(d))].join(""),Oj,io(T.a(h,b))],null)],null),kb(Cc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,r,w,u,z,D,F,Xa),null,null)}}(30,50,r,u,w,z,D,F,a,d,e,f,g,h,c,l,m,n,p,q)(u)}(),xo(u,F,q),new R(null,2,5,S,[ij,new v(null,3,[qj,"axis",Eh,jo(0,r),ok,e-100],null)],null),new R(null,2,5,S,[ij,new v(null,2,[qj,"axis",ck,r],null)],null)],
null)],null)}function zo(a,b){var c=ln(a),d=P(c,0),e=P(c,1),f=P(c,2),c=P(c,3);return new R(null,6,5,S,[$i,new v(null,1,[pj,"graphs"],null),yo(d,b,new v(null,3,[Oi,"Total Input",Ni,vj,fi,Math.round],null)),yo(e,b,new v(null,3,[Oi,"Total Output",Ni,vi,fi,Math.round],null)),yo(f,b,new v(null,4,[Oi,"Work in Progress",Ni,Ji,sk,new R(null,1,5,S,[0],null),fi,Math.round],null)),yo(c,b,new v(null,3,[Oi,"Days to Delivery",Ni,xi,fi,Math.round],null))],null)}
function Ao(a,b){var c=null!=a&&(a.g&64||a.F)?B.a(Oc,a):a,d=C.a(c,Ui),e=null!=d&&(d.g&64||d.F)?B.a(Oc,d):d,f=C.a(e,lk),g=C.a(e,Ki),h=C.a(c,cj),l=C.a(c,Vh),m=C.a(c,Lh);return new R(null,4,5,S,[Wi,new v(null,1,[pj,"controls"],null),new R(null,9,5,S,[ii,new v(null,1,[Li,"slidden"],null),new R(null,3,5,S,[Xh,new v(null,1,[ri,function(){return function(){return b.c?b.c(Bh,1,!0):b.call(null,Bh,1,!0)}}(a,c,d,e,f,g,h,l,m)],null),"Roll"],null),new R(null,3,5,S,[Xh,new v(null,1,[ri,function(){return function(){return b.c?
b.c(Bh,100,!0):b.call(null,Bh,100,!0)}}(a,c,d,e,f,g,h,l,m)],null),"Run"],null),new R(null,3,5,S,[Xh,new v(null,1,[ri,function(){return function(){return b.c?b.c(Bh,100,!1):b.call(null,Bh,100,!1)}}(a,c,d,e,f,g,h,l,m)],null),"Run Fast"],null),new R(null,3,5,S,[Xh,new v(null,1,[ri,function(){return function(){return b.a?b.a(Ci,100):b.call(null,Ci,100)}}(a,c,d,e,f,g,h,l,m)],null),"Run Instantly"],null),new R(null,3,5,S,[Xh,new v(null,1,[ri,function(a,c,d,e,f,g,h){return function(){var a=Oa(h);return b.a?
b.a(Aj,a):b.call(null,Aj,a)}}(a,c,d,e,f,g,h,l,m)],null),x(h)?"Hide info":"Show info"],null),new R(null,3,5,S,[Xh,new v(null,1,[ri,function(a,c,d,e,f,g,h,l){return function(){var a=Oa(l);return b.a?b.a(Lj,a):b.call(null,Lj,a)}}(a,c,d,e,f,g,h,l,m)],null),x(l)?"Hide graphs":"Show graphs"],null),x(l)?new R(null,3,5,S,[Xh,new v(null,2,[Sh,function(){var a=0===f;return a?a:m}(),ri,function(a,c,d,e,f,g){return function(){var a=Oa(g);return b.a?b.a(Ki,a):b.call(null,Ki,a)}}(a,c,d,e,f,g,h,l,m)],null),x(g)?
"Hide averages":"Average"],null):null],null),new R(null,8,5,S,[ii,new v(null,1,[Li,"slidden wide"],null),new R(null,3,5,S,[Xh,new v(null,1,[ri,function(){return function(){return b.a?b.a(Ui,Mj):b.call(null,Ui,Mj)}}(a,c,d,e,f,g,h,l,m)],null),"Basic"],null),new R(null,3,5,S,[Xh,new v(null,1,[ri,function(){return function(){return b.a?b.a(Ui,Uh):b.call(null,Ui,Uh)}}(a,c,d,e,f,g,h,l,m)],null),"Efficient"],null),new R(null,3,5,S,[Xh,new v(null,1,[ri,function(){return function(){return b.a?b.a(Ui,Zh):b.call(null,
Ui,Zh)}}(a,c,d,e,f,g,h,l,m)],null),"Basic \x26 Efficient"],null),new R(null,3,5,S,[Xh,new v(null,1,[ri,function(){return function(){return b.a?b.a(Ui,Ei):b.call(null,Ui,Ei)}}(a,c,d,e,f,g,h,l,m)],null),"Constrained"],null),new R(null,3,5,S,[Xh,new v(null,1,[ri,function(){return function(){return b.a?b.a(Ui,bj):b.call(null,Ui,bj)}}(a,c,d,e,f,g,h,l,m)],null),"Basic, Efficient, \x26 Constrained"],null),new R(null,3,5,S,[Xh,new v(null,1,[ri,function(){return function(){return b.a?b.a(Ui,jj):b.call(null,
Ui,jj)}}(a,c,d,e,f,g,h,l,m)],null),"Basic, Efficient, Constrained, \x26 Fixed"],null)],null)],null)}
function Bo(){var a=K.b?K.b(Co):K.call(null,Co),b=Z,c=null!=a&&(a.g&64||a.F)?B.a(Oc,a):a,d=C.a(c,Ui),e=null!=d&&(d.g&64||d.F)?B.a(Oc,d):d,f=C.a(e,ni),g=C.a(e,tk),h=C.a(e,lk),l=C.a(e,bk),m=C.a(e,ei),n=C.a(e,Ki),p=C.a(c,cj),q=C.a(c,Vh);return new R(null,5,5,S,[ek,W,new R(null,3,5,S,[Wi,new v(null,1,[Vi,new v(null,3,[Kj,ak,vk,"5px",Yh,"5px"],null)],null),new R(null,4,5,S,[Wi,W,h," steps"],null)],null),Ao(c,b),new R(null,5,5,S,[zj,new v(null,3,[pj,"space",ni,"100%",tk,"99%"],null),function(){return function(a,
b,c,d,e,f,g,h,l,m,n,p,q,V){return function ia(ja){return new ie(null,function(){return function(){for(;;){var a=H(ja);if(a){if(xd(a)){var b=ac(a),c=N(b),d=me(c);a:for(var e=0;;)if(e<c){var f=db.a(b,e),g=null!=f&&(f.g&64||f.F)?B.a(Oc,f):f,f=g,h=C.a(g,Sj),g=C.a(g,rh),f=x(h)?new R(null,3,5,S,[$i,new v(null,1,[Eh,jo(h,g)],null),ko(f)],null):null;d.add(f);e+=1}else{b=!0;break a}return b?ne(d.W(),ia(bc(a))):ne(d.W(),null)}d=I(a);d=c=null!=d&&(d.g&64||d.F)?B.a(Oc,d):d;b=C.a(c,Sj);c=C.a(c,rh);return M(x(b)?
new R(null,3,5,S,[$i,new v(null,1,[Eh,jo(b,c)],null),ko(d)],null):null,ia(Cc(a)))}return null}}}(a,b,c,d,e,f,g,h,l,m,n,p,q,V),null,null)}}(a,c,c,d,e,e,f,g,h,l,m,n,p,q)(l)}(),T.a(function(a,b,c,d,e,f,g,h,l,m,n,p,q){return function(a){return wo(a,q)}}(a,c,c,d,e,e,f,g,h,l,m,n,p,q),m),x(x(f)?x(g)?q:g:f)?zo(new R(null,2,5,S,[f,g],null),x(n)?n:Xn(e)):null],null)],null)};wa=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new Bc(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,Ka.b?Ka.b(a):Ka.call(null,a))}a.w=0;a.B=function(a){a=H(a);return b(a)};a.h=b;return a}();
xa=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new Bc(e,0)}return b.call(this,d)}function b(a){return console.error.apply(console,Ka.b?Ka.b(a):Ka.call(null,a))}a.w=0;a.B=function(a){a=H(a);return b(a)};a.h=b;return a}();
function Do(a){var b="undefined"!==typeof document.hidden?"visibilitychange":"undefined"!==typeof document.webkitHidden?"webkitvisibilitychange":"undefined"!==typeof document.mozHidden?"mozvisibilitychange":"undefined"!==typeof document.msHidden?"msvisibilitychange":null;return document.addEventListener(b,function(b){return function e(){a.m?a.m():a.call(null);return document.removeEventListener(b,e)}}(b))}
function Eo(a,b){var c=null!=b&&(b.g&64||b.F)?B.a(Oc,b):b,d=C.a(c,ni),e=C.a(c,Sj),f=Te(1,Qh.b(I($e(di,ei.b(a))))),g=T.a(tk,f),h=T.a(rh,f);return gf.A(a,bk,Je(T,function(a,b,c,d,e,f,g){return function(a,b,c){return Q.h(a,Sj,g,G([rh,b+c+(0-f/2-20),ni,f,tk,f],0))}}(f,g,h,b,c,d,e)),h,g)}
if("undefined"===typeof Z)var Z=function(){var a=X.b?X.b(W):X.call(null,W),b=X.b?X.b(W):X.call(null,W),c=X.b?X.b(W):X.call(null,W),d=X.b?X.b(W):X.call(null,W),e=C.c(W,fk,dh());return new oh(zc.a("pennygame.core","emit"),function(){return function(){function a(b,c){if(1<arguments.length)for(var d=0,e=Array(arguments.length-1);d<e.length;)e[d]=arguments[d+1],++d;return b}a.w=1;a.B=function(a){var b=I(a);Cc(a);return b};a.h=function(a){return a};return a}()}(a,b,c,d,e),bi,e,a,b,c,d)}();
if("undefined"===typeof Co)var Co=X.b?X.b(W):X.call(null,W);
function Fo(a,b){var c=zn();Ym(function(c){return function(){var e=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!ge(e,yi)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Am(c),d=yi;else throw f;}if(!ge(d,yi))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=null,d=function(a){switch(arguments.length){case 0:return c.call(this);
case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.m=c;d.b=b;return d}()}(function(){return function(c){var d=c[1];if(7===d)return c[2]=null,c[1]=8,yi;if(1===d){var d=Z.b?Z.b(Jj):Z.call(null,Jj),e=Z.b?Z.b(wh):Z.call(null,wh);c[7]=d;c[8]=e;c[1]=x(b)?2:3;return yi}if(4===d){var d=c[2],e=Z.b?Z.b(Ij):Z.call(null,Ij),f=Z.b?Z.b(dj):Z.call(null,dj),n=Z.b?Z.b(ej):Z.call(null,ej);c[9]=d;c[10]=e;c[11]=n;c[12]=f;c[1]=x(b)?6:7;return yi}return 15===d?(d=Z.a?Z.a(Pi,!1):Z.call(null,
Pi,!1),c[2]=d,c[1]=16,yi):13===d?(d=c[2],c[2]=d,c[1]=12,yi):6===d?(d=Z.a?Z.a(Si,!0):Z.call(null,Si,!0),e=Dn(),c[13]=d,wm(c,9,e)):3===d?(c[2]=null,c[1]=4,yi):12===d?(d=c[14],d=a-1,c[15]=c[2],c[14]=d,c[1]=x(0<d)?14:15,yi):2===d?(d=Z.a?Z.a(Kh,!0):Z.call(null,Kh,!0),e=Dn(),c[16]=d,wm(c,5,e)):11===d?(d=K.b?K.b(bo):K.call(null,bo),d=d.b?d.b(lk):d.call(null,lk),d=yn(d),wm(c,13,d)):9===d?(e=c[2],d=Z.a?Z.a(Si,!1):Z.call(null,Si,!1),c[17]=e,c[2]=d,c[1]=8,yi):5===d?(e=c[2],d=Z.a?Z.a(Kh,!1):Z.call(null,Kh,!1),
c[18]=e,c[2]=d,c[1]=4,yi):14===d?(d=c[14],d=Z.c?Z.c(Tj,d,b):Z.call(null,Tj,d,b),c[2]=d,c[1]=16,yi):16===d?(d=c[2],ym(c,d)):10===d?(c[2]=null,c[1]=12,yi):8===d?(d=c[2],e=Z.b?Z.b(jk):Z.call(null,jk),f=Z.b?Z.b(aj):Z.call(null,aj),c[19]=e,c[20]=d,c[21]=f,c[1]=x(b)?10:11,yi):null}}(c),c)}(),f=function(){var a=e.m?e.m():e.call(null);a[6]=c;return a}();return vm(f)}}(c))}
var Go=function Go(){var b=zn();Ym(function(b){return function(){var d=function(){return function(b){return function(){function c(d){for(;;){var e;a:try{for(;;){var g=b(d);if(!ge(g,yi)){e=g;break a}}}catch(h){if(h instanceof Object)d[5]=h,Am(d),e=yi;else throw h;}if(!ge(e,yi))return e}}function d(){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];b[0]=e;b[1]=1;return b}var e=null,e=function(b){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,
b)}throw Error("Invalid arity: "+arguments.length);};e.m=d;e.b=c;return e}()}(function(b){return function(c){var d=c[1];if(7===d){var e=c[7],e=e.getBoundingClientRect();c[2]=e;c[1]=8;return yi}if(1===d)return e=yn(50),wm(c,2,e);if(4===d)return e=document.getElementById("space"),c[2]=e,c[1]=5,yi;if(15===d){var e=c[2],m=Z.b?Z.b(dk):Z.call(null,dk),n=yn(100);c[8]=e;c[9]=m;return wm(c,16,n)}if(13===d)return e=Do(Go),c[2]=e,c[1]=14,yi;if(6===d)return c[2]=null,c[1]=8,yi;if(3===d)return c[2]=null,c[1]=
5,yi;if(12===d)return e=c[10],m=c[11],e=Z.c?Z.c(Mi,e,m):Z.call(null,Mi,e,m),m=yn(100),c[12]=e,wm(c,15,m);if(2===d){var p=c[2],q=function(){return function(){return function(b){return b.width}}(p,d,b)}(),e=Jg(q,function(){return function(){return function(b){return b.height}}(p,q,d,b)}()),m=null==document;c[13]=p;c[14]=e;c[1]=x(m)?3:4;return yi}return 11===d?(n=c[2],e=P(n,0),m=P(n,1),c[10]=e,c[11]=m,c[1]=x(n)?12:13,yi):9===d?(c[2]=null,c[1]=11,yi):5===d?(e=c[7],e=c[2],c[7]=e,c[1]=x(null==e)?6:7,yi):
14===d?(e=c[2],ym(c,e)):16===d?(m=c[2],e=Z.b?Z.b(ej):Z.call(null,ej),c[15]=m,c[2]=e,c[1]=14,yi):10===d?(m=c[16],e=c[14],e=e.b?e.b(m):e.call(null,m),c[2]=e,c[1]=11,yi):8===d?(m=c[16],e=c[2],c[16]=e,c[1]=x(null==e)?9:10,yi):null}}(b),b)}(),e=function(){var e=d.m?d.m():d.call(null);e[6]=b;return e}();return vm(e)}}(b));return b};
function Ho(){var a=Hi.b(K.b?K.b(Co):K.call(null,Co)),b=Ui.b(K.b?K.b(Co):K.call(null,Co)),c=ao(b),d=b.b?b.b(lk):b.call(null,lk),e=zn();Ym(function(c,d,e,l){return function(){var m=function(){return function(a){return function(){function b(c){for(;;){var d;a:try{for(;;){var e=a(c);if(!ge(e,yi)){d=e;break a}}}catch(f){if(f instanceof Object)c[5]=f,Am(c),d=yi;else throw f;}if(!ge(d,yi))return d}}function c(){var a=[null,null,null,null,null,null,null,null,null,null,null,null];a[0]=d;a[1]=1;return a}var d=
null,d=function(a){switch(arguments.length){case 0:return c.call(this);case 1:return b.call(this,a)}throw Error("Invalid arity: "+arguments.length);};d.m=c;d.b=b;return d}()}(function(c,d,e,f){return function(c){var g=c[1];if(1===g){var g=Xn(b),g=Z.a?Z.a(Pj,g):Z.call(null,Pj,g),h=yn(f);c[7]=g;return wm(c,2,h)}return 2===g?(c[8]=c[2],c[9]=0,c[2]=null,c[1]=3,yi):3===g?(g=c[9],c[1]=x(50>g)?5:6,yi):4===g?(g=c[2],ym(c,g)):5===g?(g=Vn(e,a),g=d.b?d.b(g):d.call(null,g),g=Z.a?Z.a(Pj,g):Z.call(null,Pj,g),h=
yn(f),c[10]=g,wm(c,8,h)):6===g?(c[2]=null,c[1]=7,yi):7===g?(g=c[2],c[2]=g,c[1]=4,yi):8===g?(g=c[9],c[11]=c[2],c[9]=g+1,c[2]=null,c[1]=3,yi):null}}(c,d,e,l),c,d,e,l)}(),n=function(){var a=m.m?m.m():m.call(null);a[6]=c;return a}();return vm(n)}}(e,c,d,100))}qh(Z,Ui,function(a,b){Go();var c=Rl(b.b?b.b(Tn):b.call(null,Tn));return Qe.h(Co,Q,Ui,c,G([Hi,c,Lh,!1],0))});
qh(Z,Mi,function(a,b,c){return Qe.a(Co,function(a){return function(e){return gf.l(ff.c(ef(ef(e,new R(null,2,5,S,[Ui,ni],null),b),new R(null,2,5,S,[Ui,tk],null),c),new R(null,2,5,S,[Ui,ei],null),Je(Pl,new v(null,3,[Sj,a,ni,b-a,tk,c],null))),Ui,Eo,new v(null,2,[Sj,45,ni,a-90],null))}}(150))});qh(Z,dk,function(){return Qe.h(Co,gf,Ui,Tl,G([function(a){a=null!=a&&(a.g&64||a.F)?B.a(Oc,a):a;var b=C.a(a,pj),b=Bk(b);return x(b)?Q.c(a,Cj,b.getTotalLength()):a}],0))});
qh(Z,ej,function(){return Qe.l(Co,gf,Ui,im)});qh(Z,Jj,function(){return Qe.a(Co,function(a){return gf.l(ff.c(a,new R(null,2,5,S,[Ui,lk],null),Rc),Ui,Vl,Ve(function(){return 6*Math.random()+1|0}))})});qh(Z,Bh,function(a,b,c){Fo(b,c);return Qe.l(Co,Q,Lh,!0)});qh(Z,wh,function(){return Qe.l(Co,gf,Ui,Yl)});qh(Z,Kh,function(a,b){return Qe.h(Co,gf,Ui,Tl,G([function(a){return Q.c(a,Fi,b)}],0))});qh(Z,Ij,function(){return Qe.l(Co,gf,Ui,hm)});qh(Z,dj,function(){return Qe.l(Co,gf,Ui,jm)});
qh(Z,Si,function(a,b){return Qe.h(Co,gf,Ui,Tl,G([function(a){return Q.c(a,Qj,b)}],0))});qh(Z,jk,function(){return Qe.l(Co,gf,Ui,km)});qh(Z,aj,function(){return Qe.l(Co,gf,Ui,mm)});qh(Z,Pi,function(a,b){return Qe.l(Co,Q,Lh,b)});qh(Z,Tj,function(a,b,c){x((K.b?K.b(Co):K.call(null,Co)).call(null,Lh))&&Fo(b,c);return K.b?K.b(Co):K.call(null,Co)});qh(Z,Ci,function(a,b){return Qe.l(Co,gf,Ui,function(a){return Vn(b,a)})});qh(Z,Aj,function(a,b){return Qe.l(Co,Q,cj,b)});
qh(Z,Lj,function(a,b){return Qe.l(Co,Q,Vh,b)});qh(Z,Ki,function(a,b){return x(b)?(Ho(),K.b?K.b(Co):K.call(null,Co)):Qe.h(Co,gf,Ui,nd,G([Ki],0))});qh(Z,Pj,function(a,b){return Qe.l(Co,ef,new R(null,2,5,S,[Ui,Ki],null),b)});if("undefined"===typeof Io)var Io=function(a){return function(){var b=Bo();return a.b?a.b(b):a.call(null,b)}}(Jm());if("undefined"===typeof Jo){var Jo,Ko=Co;Sb(Ko,Wj,function(a,b,c,d){return Io.b?Io.b(d):Io.call(null,d)});Jo=Ko}
if("undefined"===typeof Lo)var Lo=Z.a?Z.a(Ui,Mj):Z.call(null,Ui,Mj);var Mo=K.b?K.b(Co):K.call(null,Co);Io.b?Io.b(Mo):Io.call(null,Mo);