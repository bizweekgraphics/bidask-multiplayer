(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./game.js')();
},{"./game.js":3}],2:[function(require,module,exports){
'use strict';

var ko = require('knockout');

function FilledOrder(data) {
  this.player = ko.observable(data.player);
  this.spread = ko.observable(data.spread);
  this.side = 'filled';
}

module.exports = FilledOrder


//On drop, ping ID to server, on confirmation, show changes locally, then ping new array to server, which is transmitted back to both
},{"knockout":"knockout"}],3:[function(require,module,exports){
(function (global){
'use strict';

var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var ko = require('knockout');

var StockMarketViewModel = require('./stockmarket-view-model.js');

module.exports = function() {
  var stockMarketViewModel;

  $(document).ready(function() {
    stockMarketViewModel = new StockMarketViewModel();
    ko.applyBindings(stockMarketViewModel);
  })
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./stockmarket-view-model.js":5,"knockout":"knockout"}],4:[function(require,module,exports){
'use strict';

var ko = require('knockout');

function Order(data) {
  this.price = data.price;
  this.fixed = ko.observable(false);
  this.side = data.side;
  this.spread = ko.observable(false);
}

module.exports = Order;
},{"knockout":"knockout"}],5:[function(require,module,exports){
(function (global){
'use strict';

var ko = require('knockout');
var d3 = require('d3');
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
require('./vendor/jquery-ui.js');
var Order = require('./order.js');
var FilledOrder = require('./filled-order.js');

function StockMarketViewModel() {
  var self = this;

  self.orders = ko.observableArray([]);
  self.cash = ko.observable(0);

  self.addOrder = function() {
    var newOrder = generateOrder();
    self.orders.push(newOrder);
  }

  function generateOrder() {
    var priceMean = 19.02;
    var priceStdev = 4;

    var side = Math.random() < 0.5 ? 'bid' : 'ask';
    var price = d3.random.normal(priceMean, priceStdev)().toFixed(2);

    return new Order({price: price, side: side})
  }

  function updateSpread(drag, drop) {
    var spread = ko.dataFor(drop).price - ko.dataFor(drag).price;
    ko.dataFor(drag).spread(parseFloat(spread.toFixed(2)));
  }

  function updateCash() {

    var cash = self.orders().filter(function(order) {
      return order.side === 'filled';
    }).map(function(order) {
      return parseFloat(order.spread());
    }).reduce(function(prev, curr) {
      return prev + curr;
    });

    self.cash(cash.toFixed(2));
  }

  ko.bindingHandlers.dragdrop = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

      var orderEl = $(element);

      var dragConfig = {
        revert: "invalid",
        opacity: 1,
        snap: ".ui-droppable",
        snapMode: "inner"
      };

      var dropConfig = {
        over: function(event, ui) {
          var dragEl = ui.draggable[0];
          var dropEl = event.target

          updateSpread(dragEl, dropEl)
        },
        out: function(event, ui) {
          ko.dataFor(ui.draggable[0]).spread(false);
        },
        drop: function(event, ui) {
          var dragData = ko.dataFor(ui.draggable[0]);
          var dropData = ko.dataFor(event.target);


          var dragIndex = self.orders.indexOf(dragData);
          var dropIndex = self.orders.indexOf(dropData);   

          var filledOrder = new FilledOrder({spread: dragData.spread()})

          self.orders()[dropIndex] = filledOrder;
          self.orders.splice(dragIndex, 1);

          updateCash();
        }
      };

      viewModel.side === 'ask' ? orderEl.draggable(dragConfig) : orderEl.droppable(dropConfig);

    }
  }
}

module.exports = StockMarketViewModel;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./filled-order.js":2,"./order.js":4,"./vendor/jquery-ui.js":6,"d3":"d3","knockout":"knockout"}],6:[function(require,module,exports){
/*! jQuery UI - v1.11.3 - 2015-02-25
* http://jqueryui.com
* Includes: core.js, widget.js, mouse.js, draggable.js, droppable.js
* Copyright 2015 jQuery Foundation and other contributors; Licensed MIT */

(function( factory ) {
  if ( typeof define === "function" && define.amd ) {

    // AMD. Register as an anonymous module.
    define([ "jquery" ], factory );
  } else {

    // Browser globals
    factory( jQuery );
  }
}(function( $ ) {
/*!
 * jQuery UI Core 1.11.3
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */


// $.ui might exist from components with no dependencies, e.g., $.ui.position
$.ui = $.ui || {};

$.extend( $.ui, {
  version: "1.11.3",

  keyCode: {
    BACKSPACE: 8,
    COMMA: 188,
    DELETE: 46,
    DOWN: 40,
    END: 35,
    ENTER: 13,
    ESCAPE: 27,
    HOME: 36,
    LEFT: 37,
    PAGE_DOWN: 34,
    PAGE_UP: 33,
    PERIOD: 190,
    RIGHT: 39,
    SPACE: 32,
    TAB: 9,
    UP: 38
  }
});

// plugins
$.fn.extend({
  scrollParent: function( includeHidden ) {
    var position = this.css( "position" ),
      excludeStaticParent = position === "absolute",
      overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
      scrollParent = this.parents().filter( function() {
        var parent = $( this );
        if ( excludeStaticParent && parent.css( "position" ) === "static" ) {
          return false;
        }
        return overflowRegex.test( parent.css( "overflow" ) + parent.css( "overflow-y" ) + parent.css( "overflow-x" ) );
      }).eq( 0 );

    return position === "fixed" || !scrollParent.length ? $( this[ 0 ].ownerDocument || document ) : scrollParent;
  },

  uniqueId: (function() {
    var uuid = 0;

    return function() {
      return this.each(function() {
        if ( !this.id ) {
          this.id = "ui-id-" + ( ++uuid );
        }
      });
    };
  })(),

  removeUniqueId: function() {
    return this.each(function() {
      if ( /^ui-id-\d+$/.test( this.id ) ) {
        $( this ).removeAttr( "id" );
      }
    });
  }
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
  var map, mapName, img,
    nodeName = element.nodeName.toLowerCase();
  if ( "area" === nodeName ) {
    map = element.parentNode;
    mapName = map.name;
    if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
      return false;
    }
    img = $( "img[usemap='#" + mapName + "']" )[ 0 ];
    return !!img && visible( img );
  }
  return ( /^(input|select|textarea|button|object)$/.test( nodeName ) ?
    !element.disabled :
    "a" === nodeName ?
      element.href || isTabIndexNotNaN :
      isTabIndexNotNaN) &&
    // the element and all of its ancestors must be visible
    visible( element );
}

function visible( element ) {
  return $.expr.filters.visible( element ) &&
    !$( element ).parents().addBack().filter(function() {
      return $.css( this, "visibility" ) === "hidden";
    }).length;
}

$.extend( $.expr[ ":" ], {
  data: $.expr.createPseudo ?
    $.expr.createPseudo(function( dataName ) {
      return function( elem ) {
        return !!$.data( elem, dataName );
      };
    }) :
    // support: jQuery <1.8
    function( elem, i, match ) {
      return !!$.data( elem, match[ 3 ] );
    },

  focusable: function( element ) {
    return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
  },

  tabbable: function( element ) {
    var tabIndex = $.attr( element, "tabindex" ),
      isTabIndexNaN = isNaN( tabIndex );
    return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
  }
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
  $.each( [ "Width", "Height" ], function( i, name ) {
    var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
      type = name.toLowerCase(),
      orig = {
        innerWidth: $.fn.innerWidth,
        innerHeight: $.fn.innerHeight,
        outerWidth: $.fn.outerWidth,
        outerHeight: $.fn.outerHeight
      };

    function reduce( elem, size, border, margin ) {
      $.each( side, function() {
        size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
        if ( border ) {
          size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
        }
        if ( margin ) {
          size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
        }
      });
      return size;
    }

    $.fn[ "inner" + name ] = function( size ) {
      if ( size === undefined ) {
        return orig[ "inner" + name ].call( this );
      }

      return this.each(function() {
        $( this ).css( type, reduce( this, size ) + "px" );
      });
    };

    $.fn[ "outer" + name] = function( size, margin ) {
      if ( typeof size !== "number" ) {
        return orig[ "outer" + name ].call( this, size );
      }

      return this.each(function() {
        $( this).css( type, reduce( this, size, true, margin ) + "px" );
      });
    };
  });
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
  $.fn.addBack = function( selector ) {
    return this.add( selector == null ?
      this.prevObject : this.prevObject.filter( selector )
    );
  };
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
  $.fn.removeData = (function( removeData ) {
    return function( key ) {
      if ( arguments.length ) {
        return removeData.call( this, $.camelCase( key ) );
      } else {
        return removeData.call( this );
      }
    };
  })( $.fn.removeData );
}

// deprecated
$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

$.fn.extend({
  focus: (function( orig ) {
    return function( delay, fn ) {
      return typeof delay === "number" ?
        this.each(function() {
          var elem = this;
          setTimeout(function() {
            $( elem ).focus();
            if ( fn ) {
              fn.call( elem );
            }
          }, delay );
        }) :
        orig.apply( this, arguments );
    };
  })( $.fn.focus ),

  disableSelection: (function() {
    var eventType = "onselectstart" in document.createElement( "div" ) ?
      "selectstart" :
      "mousedown";

    return function() {
      return this.bind( eventType + ".ui-disableSelection", function( event ) {
        event.preventDefault();
      });
    };
  })(),

  enableSelection: function() {
    return this.unbind( ".ui-disableSelection" );
  },

  zIndex: function( zIndex ) {
    if ( zIndex !== undefined ) {
      return this.css( "zIndex", zIndex );
    }

    if ( this.length ) {
      var elem = $( this[ 0 ] ), position, value;
      while ( elem.length && elem[ 0 ] !== document ) {
        // Ignore z-index if position is set to a value where z-index is ignored by the browser
        // This makes behavior of this function consistent across browsers
        // WebKit always returns auto if the element is positioned
        position = elem.css( "position" );
        if ( position === "absolute" || position === "relative" || position === "fixed" ) {
          // IE returns 0 when zIndex is not specified
          // other browsers return a string
          // we ignore the case of nested elements with an explicit value of 0
          // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
          value = parseInt( elem.css( "zIndex" ), 10 );
          if ( !isNaN( value ) && value !== 0 ) {
            return value;
          }
        }
        elem = elem.parent();
      }
    }

    return 0;
  }
});

// $.ui.plugin is deprecated. Use $.widget() extensions instead.
$.ui.plugin = {
  add: function( module, option, set ) {
    var i,
      proto = $.ui[ module ].prototype;
    for ( i in set ) {
      proto.plugins[ i ] = proto.plugins[ i ] || [];
      proto.plugins[ i ].push( [ option, set[ i ] ] );
    }
  },
  call: function( instance, name, args, allowDisconnected ) {
    var i,
      set = instance.plugins[ name ];

    if ( !set ) {
      return;
    }

    if ( !allowDisconnected && ( !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) ) {
      return;
    }

    for ( i = 0; i < set.length; i++ ) {
      if ( instance.options[ set[ i ][ 0 ] ] ) {
        set[ i ][ 1 ].apply( instance.element, args );
      }
    }
  }
};


/*!
 * jQuery UI Widget 1.11.3
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */


var widget_uuid = 0,
  widget_slice = Array.prototype.slice;

$.cleanData = (function( orig ) {
  return function( elems ) {
    var events, elem, i;
    for ( i = 0; (elem = elems[i]) != null; i++ ) {
      try {

        // Only trigger remove when necessary to save time
        events = $._data( elem, "events" );
        if ( events && events.remove ) {
          $( elem ).triggerHandler( "remove" );
        }

      // http://bugs.jquery.com/ticket/8235
      } catch ( e ) {}
    }
    orig( elems );
  };
})( $.cleanData );

$.widget = function( name, base, prototype ) {
  var fullName, existingConstructor, constructor, basePrototype,
    // proxiedPrototype allows the provided prototype to remain unmodified
    // so that it can be used as a mixin for multiple widgets (#8876)
    proxiedPrototype = {},
    namespace = name.split( "." )[ 0 ];

  name = name.split( "." )[ 1 ];
  fullName = namespace + "-" + name;

  if ( !prototype ) {
    prototype = base;
    base = $.Widget;
  }

  // create selector for plugin
  $.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
    return !!$.data( elem, fullName );
  };

  $[ namespace ] = $[ namespace ] || {};
  existingConstructor = $[ namespace ][ name ];
  constructor = $[ namespace ][ name ] = function( options, element ) {
    // allow instantiation without "new" keyword
    if ( !this._createWidget ) {
      return new constructor( options, element );
    }

    // allow instantiation without initializing for simple inheritance
    // must use "new" keyword (the code above always passes args)
    if ( arguments.length ) {
      this._createWidget( options, element );
    }
  };
  // extend with the existing constructor to carry over any static properties
  $.extend( constructor, existingConstructor, {
    version: prototype.version,
    // copy the object used to create the prototype in case we need to
    // redefine the widget later
    _proto: $.extend( {}, prototype ),
    // track widgets that inherit from this widget in case this widget is
    // redefined after a widget inherits from it
    _childConstructors: []
  });

  basePrototype = new base();
  // we need to make the options hash a property directly on the new instance
  // otherwise we'll modify the options hash on the prototype that we're
  // inheriting from
  basePrototype.options = $.widget.extend( {}, basePrototype.options );
  $.each( prototype, function( prop, value ) {
    if ( !$.isFunction( value ) ) {
      proxiedPrototype[ prop ] = value;
      return;
    }
    proxiedPrototype[ prop ] = (function() {
      var _super = function() {
          return base.prototype[ prop ].apply( this, arguments );
        },
        _superApply = function( args ) {
          return base.prototype[ prop ].apply( this, args );
        };
      return function() {
        var __super = this._super,
          __superApply = this._superApply,
          returnValue;

        this._super = _super;
        this._superApply = _superApply;

        returnValue = value.apply( this, arguments );

        this._super = __super;
        this._superApply = __superApply;

        return returnValue;
      };
    })();
  });
  constructor.prototype = $.widget.extend( basePrototype, {
    // TODO: remove support for widgetEventPrefix
    // always use the name + a colon as the prefix, e.g., draggable:start
    // don't prefix for widgets that aren't DOM-based
    widgetEventPrefix: existingConstructor ? (basePrototype.widgetEventPrefix || name) : name
  }, proxiedPrototype, {
    constructor: constructor,
    namespace: namespace,
    widgetName: name,
    widgetFullName: fullName
  });

  // If this widget is being redefined then we need to find all widgets that
  // are inheriting from it and redefine all of them so that they inherit from
  // the new version of this widget. We're essentially trying to replace one
  // level in the prototype chain.
  if ( existingConstructor ) {
    $.each( existingConstructor._childConstructors, function( i, child ) {
      var childPrototype = child.prototype;

      // redefine the child widget using the same prototype that was
      // originally used, but inherit from the new version of the base
      $.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
    });
    // remove the list of existing child constructors from the old constructor
    // so the old child constructors can be garbage collected
    delete existingConstructor._childConstructors;
  } else {
    base._childConstructors.push( constructor );
  }

  $.widget.bridge( name, constructor );

  return constructor;
};

$.widget.extend = function( target ) {
  var input = widget_slice.call( arguments, 1 ),
    inputIndex = 0,
    inputLength = input.length,
    key,
    value;
  for ( ; inputIndex < inputLength; inputIndex++ ) {
    for ( key in input[ inputIndex ] ) {
      value = input[ inputIndex ][ key ];
      if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
        // Clone objects
        if ( $.isPlainObject( value ) ) {
          target[ key ] = $.isPlainObject( target[ key ] ) ?
            $.widget.extend( {}, target[ key ], value ) :
            // Don't extend strings, arrays, etc. with objects
            $.widget.extend( {}, value );
        // Copy everything else by reference
        } else {
          target[ key ] = value;
        }
      }
    }
  }
  return target;
};

$.widget.bridge = function( name, object ) {
  var fullName = object.prototype.widgetFullName || name;
  $.fn[ name ] = function( options ) {
    var isMethodCall = typeof options === "string",
      args = widget_slice.call( arguments, 1 ),
      returnValue = this;

    if ( isMethodCall ) {
      this.each(function() {
        var methodValue,
          instance = $.data( this, fullName );
        if ( options === "instance" ) {
          returnValue = instance;
          return false;
        }
        if ( !instance ) {
          return $.error( "cannot call methods on " + name + " prior to initialization; " +
            "attempted to call method '" + options + "'" );
        }
        if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
          return $.error( "no such method '" + options + "' for " + name + " widget instance" );
        }
        methodValue = instance[ options ].apply( instance, args );
        if ( methodValue !== instance && methodValue !== undefined ) {
          returnValue = methodValue && methodValue.jquery ?
            returnValue.pushStack( methodValue.get() ) :
            methodValue;
          return false;
        }
      });
    } else {

      // Allow multiple hashes to be passed on init
      if ( args.length ) {
        options = $.widget.extend.apply( null, [ options ].concat(args) );
      }

      this.each(function() {
        var instance = $.data( this, fullName );
        if ( instance ) {
          instance.option( options || {} );
          if ( instance._init ) {
            instance._init();
          }
        } else {
          $.data( this, fullName, new object( options, this ) );
        }
      });
    }

    return returnValue;
  };
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
  widgetName: "widget",
  widgetEventPrefix: "",
  defaultElement: "<div>",
  options: {
    disabled: false,

    // callbacks
    create: null
  },
  _createWidget: function( options, element ) {
    element = $( element || this.defaultElement || this )[ 0 ];
    this.element = $( element );
    this.uuid = widget_uuid++;
    this.eventNamespace = "." + this.widgetName + this.uuid;

    this.bindings = $();
    this.hoverable = $();
    this.focusable = $();

    if ( element !== this ) {
      $.data( element, this.widgetFullName, this );
      this._on( true, this.element, {
        remove: function( event ) {
          if ( event.target === element ) {
            this.destroy();
          }
        }
      });
      this.document = $( element.style ?
        // element within the document
        element.ownerDocument :
        // element is window or document
        element.document || element );
      this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
    }

    this.options = $.widget.extend( {},
      this.options,
      this._getCreateOptions(),
      options );

    this._create();
    this._trigger( "create", null, this._getCreateEventData() );
    this._init();
  },
  _getCreateOptions: $.noop,
  _getCreateEventData: $.noop,
  _create: $.noop,
  _init: $.noop,

  destroy: function() {
    this._destroy();
    // we can probably remove the unbind calls in 2.0
    // all event bindings should go through this._on()
    this.element
      .unbind( this.eventNamespace )
      .removeData( this.widgetFullName )
      // support: jquery <1.6.3
      // http://bugs.jquery.com/ticket/9413
      .removeData( $.camelCase( this.widgetFullName ) );
    this.widget()
      .unbind( this.eventNamespace )
      .removeAttr( "aria-disabled" )
      .removeClass(
        this.widgetFullName + "-disabled " +
        "ui-state-disabled" );

    // clean up events and states
    this.bindings.unbind( this.eventNamespace );
    this.hoverable.removeClass( "ui-state-hover" );
    this.focusable.removeClass( "ui-state-focus" );
  },
  _destroy: $.noop,

  widget: function() {
    return this.element;
  },

  option: function( key, value ) {
    var options = key,
      parts,
      curOption,
      i;

    if ( arguments.length === 0 ) {
      // don't return a reference to the internal hash
      return $.widget.extend( {}, this.options );
    }

    if ( typeof key === "string" ) {
      // handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
      options = {};
      parts = key.split( "." );
      key = parts.shift();
      if ( parts.length ) {
        curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
        for ( i = 0; i < parts.length - 1; i++ ) {
          curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
          curOption = curOption[ parts[ i ] ];
        }
        key = parts.pop();
        if ( arguments.length === 1 ) {
          return curOption[ key ] === undefined ? null : curOption[ key ];
        }
        curOption[ key ] = value;
      } else {
        if ( arguments.length === 1 ) {
          return this.options[ key ] === undefined ? null : this.options[ key ];
        }
        options[ key ] = value;
      }
    }

    this._setOptions( options );

    return this;
  },
  _setOptions: function( options ) {
    var key;

    for ( key in options ) {
      this._setOption( key, options[ key ] );
    }

    return this;
  },
  _setOption: function( key, value ) {
    this.options[ key ] = value;

    if ( key === "disabled" ) {
      this.widget()
        .toggleClass( this.widgetFullName + "-disabled", !!value );

      // If the widget is becoming disabled, then nothing is interactive
      if ( value ) {
        this.hoverable.removeClass( "ui-state-hover" );
        this.focusable.removeClass( "ui-state-focus" );
      }
    }

    return this;
  },

  enable: function() {
    return this._setOptions({ disabled: false });
  },
  disable: function() {
    return this._setOptions({ disabled: true });
  },

  _on: function( suppressDisabledCheck, element, handlers ) {
    var delegateElement,
      instance = this;

    // no suppressDisabledCheck flag, shuffle arguments
    if ( typeof suppressDisabledCheck !== "boolean" ) {
      handlers = element;
      element = suppressDisabledCheck;
      suppressDisabledCheck = false;
    }

    // no element argument, shuffle and use this.element
    if ( !handlers ) {
      handlers = element;
      element = this.element;
      delegateElement = this.widget();
    } else {
      element = delegateElement = $( element );
      this.bindings = this.bindings.add( element );
    }

    $.each( handlers, function( event, handler ) {
      function handlerProxy() {
        // allow widgets to customize the disabled handling
        // - disabled as an array instead of boolean
        // - disabled class as method for disabling individual parts
        if ( !suppressDisabledCheck &&
            ( instance.options.disabled === true ||
              $( this ).hasClass( "ui-state-disabled" ) ) ) {
          return;
        }
        return ( typeof handler === "string" ? instance[ handler ] : handler )
          .apply( instance, arguments );
      }

      // copy the guid so direct unbinding works
      if ( typeof handler !== "string" ) {
        handlerProxy.guid = handler.guid =
          handler.guid || handlerProxy.guid || $.guid++;
      }

      var match = event.match( /^([\w:-]*)\s*(.*)$/ ),
        eventName = match[1] + instance.eventNamespace,
        selector = match[2];
      if ( selector ) {
        delegateElement.delegate( selector, eventName, handlerProxy );
      } else {
        element.bind( eventName, handlerProxy );
      }
    });
  },

  _off: function( element, eventName ) {
    eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) +
      this.eventNamespace;
    element.unbind( eventName ).undelegate( eventName );

    // Clear the stack to avoid memory leaks (#10056)
    this.bindings = $( this.bindings.not( element ).get() );
    this.focusable = $( this.focusable.not( element ).get() );
    this.hoverable = $( this.hoverable.not( element ).get() );
  },

  _delay: function( handler, delay ) {
    function handlerProxy() {
      return ( typeof handler === "string" ? instance[ handler ] : handler )
        .apply( instance, arguments );
    }
    var instance = this;
    return setTimeout( handlerProxy, delay || 0 );
  },

  _hoverable: function( element ) {
    this.hoverable = this.hoverable.add( element );
    this._on( element, {
      mouseenter: function( event ) {
        $( event.currentTarget ).addClass( "ui-state-hover" );
      },
      mouseleave: function( event ) {
        $( event.currentTarget ).removeClass( "ui-state-hover" );
      }
    });
  },

  _focusable: function( element ) {
    this.focusable = this.focusable.add( element );
    this._on( element, {
      focusin: function( event ) {
        $( event.currentTarget ).addClass( "ui-state-focus" );
      },
      focusout: function( event ) {
        $( event.currentTarget ).removeClass( "ui-state-focus" );
      }
    });
  },

  _trigger: function( type, event, data ) {
    var prop, orig,
      callback = this.options[ type ];

    data = data || {};
    event = $.Event( event );
    event.type = ( type === this.widgetEventPrefix ?
      type :
      this.widgetEventPrefix + type ).toLowerCase();
    // the original event may come from any element
    // so we need to reset the target on the new event
    event.target = this.element[ 0 ];

    // copy original event properties over to the new event
    orig = event.originalEvent;
    if ( orig ) {
      for ( prop in orig ) {
        if ( !( prop in event ) ) {
          event[ prop ] = orig[ prop ];
        }
      }
    }

    this.element.trigger( event, data );
    return !( $.isFunction( callback ) &&
      callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
      event.isDefaultPrevented() );
  }
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
  $.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
    if ( typeof options === "string" ) {
      options = { effect: options };
    }
    var hasOptions,
      effectName = !options ?
        method :
        options === true || typeof options === "number" ?
          defaultEffect :
          options.effect || defaultEffect;
    options = options || {};
    if ( typeof options === "number" ) {
      options = { duration: options };
    }
    hasOptions = !$.isEmptyObject( options );
    options.complete = callback;
    if ( options.delay ) {
      element.delay( options.delay );
    }
    if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
      element[ method ]( options );
    } else if ( effectName !== method && element[ effectName ] ) {
      element[ effectName ]( options.duration, options.easing, callback );
    } else {
      element.queue(function( next ) {
        $( this )[ method ]();
        if ( callback ) {
          callback.call( element[ 0 ] );
        }
        next();
      });
    }
  };
});

var widget = $.widget;


/*!
 * jQuery UI Mouse 1.11.3
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/mouse/
 */


var mouseHandled = false;
$( document ).mouseup( function() {
  mouseHandled = false;
});

var mouse = $.widget("ui.mouse", {
  version: "1.11.3",
  options: {
    cancel: "input,textarea,button,select,option",
    distance: 1,
    delay: 0
  },
  _mouseInit: function() {
    var that = this;

    this.element
      .bind("mousedown." + this.widgetName, function(event) {
        return that._mouseDown(event);
      })
      .bind("click." + this.widgetName, function(event) {
        if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
          $.removeData(event.target, that.widgetName + ".preventClickEvent");
          event.stopImmediatePropagation();
          return false;
        }
      });

    this.started = false;
  },

  // TODO: make sure destroying one instance of mouse doesn't mess with
  // other instances of mouse
  _mouseDestroy: function() {
    this.element.unbind("." + this.widgetName);
    if ( this._mouseMoveDelegate ) {
      this.document
        .unbind("mousemove." + this.widgetName, this._mouseMoveDelegate)
        .unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
    }
  },

  _mouseDown: function(event) {
    // don't let more than one widget handle mouseStart
    if ( mouseHandled ) {
      return;
    }

    this._mouseMoved = false;

    // we may have missed mouseup (out of window)
    (this._mouseStarted && this._mouseUp(event));

    this._mouseDownEvent = event;

    var that = this,
      btnIsLeft = (event.which === 1),
      // event.target.nodeName works around a bug in IE 8 with
      // disabled inputs (#7620)
      elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
    if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
      return true;
    }

    this.mouseDelayMet = !this.options.delay;
    if (!this.mouseDelayMet) {
      this._mouseDelayTimer = setTimeout(function() {
        that.mouseDelayMet = true;
      }, this.options.delay);
    }

    if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
      this._mouseStarted = (this._mouseStart(event) !== false);
      if (!this._mouseStarted) {
        event.preventDefault();
        return true;
      }
    }

    // Click event may never have fired (Gecko & Opera)
    if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
      $.removeData(event.target, this.widgetName + ".preventClickEvent");
    }

    // these delegates are required to keep context
    this._mouseMoveDelegate = function(event) {
      return that._mouseMove(event);
    };
    this._mouseUpDelegate = function(event) {
      return that._mouseUp(event);
    };

    this.document
      .bind( "mousemove." + this.widgetName, this._mouseMoveDelegate )
      .bind( "mouseup." + this.widgetName, this._mouseUpDelegate );

    event.preventDefault();

    mouseHandled = true;
    return true;
  },

  _mouseMove: function(event) {
    // Only check for mouseups outside the document if you've moved inside the document
    // at least once. This prevents the firing of mouseup in the case of IE<9, which will
    // fire a mousemove event if content is placed under the cursor. See #7778
    // Support: IE <9
    if ( this._mouseMoved ) {
      // IE mouseup check - mouseup happened when mouse was out of window
      if ($.ui.ie && ( !document.documentMode || document.documentMode < 9 ) && !event.button) {
        return this._mouseUp(event);

      // Iframe mouseup check - mouseup occurred in another document
      } else if ( !event.which ) {
        return this._mouseUp( event );
      }
    }

    if ( event.which || event.button ) {
      this._mouseMoved = true;
    }

    if (this._mouseStarted) {
      this._mouseDrag(event);
      return event.preventDefault();
    }

    if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
      this._mouseStarted =
        (this._mouseStart(this._mouseDownEvent, event) !== false);
      (this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
    }

    return !this._mouseStarted;
  },

  _mouseUp: function(event) {
    this.document
      .unbind( "mousemove." + this.widgetName, this._mouseMoveDelegate )
      .unbind( "mouseup." + this.widgetName, this._mouseUpDelegate );

    if (this._mouseStarted) {
      this._mouseStarted = false;

      if (event.target === this._mouseDownEvent.target) {
        $.data(event.target, this.widgetName + ".preventClickEvent", true);
      }

      this._mouseStop(event);
    }

    mouseHandled = false;
    return false;
  },

  _mouseDistanceMet: function(event) {
    return (Math.max(
        Math.abs(this._mouseDownEvent.pageX - event.pageX),
        Math.abs(this._mouseDownEvent.pageY - event.pageY)
      ) >= this.options.distance
    );
  },

  _mouseDelayMet: function(/* event */) {
    return this.mouseDelayMet;
  },

  // These are placeholder methods, to be overriden by extending plugin
  _mouseStart: function(/* event */) {},
  _mouseDrag: function(/* event */) {},
  _mouseStop: function(/* event */) {},
  _mouseCapture: function(/* event */) { return true; }
});


/*!
 * jQuery UI Draggable 1.11.3
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/draggable/
 */


$.widget("ui.draggable", $.ui.mouse, {
  version: "1.11.3",
  widgetEventPrefix: "drag",
  options: {
    addClasses: true,
    appendTo: "parent",
    axis: false,
    connectToSortable: false,
    containment: false,
    cursor: "auto",
    cursorAt: false,
    grid: false,
    handle: false,
    helper: "original",
    iframeFix: false,
    opacity: false,
    refreshPositions: false,
    revert: false,
    revertDuration: 500,
    scope: "default",
    scroll: true,
    scrollSensitivity: 20,
    scrollSpeed: 20,
    snap: false,
    snapMode: "both",
    snapTolerance: 20,
    stack: false,
    zIndex: false,

    // callbacks
    drag: null,
    start: null,
    stop: null
  },
  _create: function() {

    if ( this.options.helper === "original" ) {
      this._setPositionRelative();
    }
    if (this.options.addClasses){
      this.element.addClass("ui-draggable");
    }
    if (this.options.disabled){
      this.element.addClass("ui-draggable-disabled");
    }
    this._setHandleClassName();

    this._mouseInit();
  },

  _setOption: function( key, value ) {
    this._super( key, value );
    if ( key === "handle" ) {
      this._removeHandleClassName();
      this._setHandleClassName();
    }
  },

  _destroy: function() {
    if ( ( this.helper || this.element ).is( ".ui-draggable-dragging" ) ) {
      this.destroyOnClear = true;
      return;
    }
    this.element.removeClass( "ui-draggable ui-draggable-dragging ui-draggable-disabled" );
    this._removeHandleClassName();
    this._mouseDestroy();
  },

  _mouseCapture: function(event) {
    var o = this.options;

    this._blurActiveElement( event );

    // among others, prevent a drag on a resizable-handle
    if (this.helper || o.disabled || $(event.target).closest(".ui-resizable-handle").length > 0) {
      return false;
    }

    //Quit if we're not on a valid handle
    this.handle = this._getHandle(event);
    if (!this.handle) {
      return false;
    }

    this._blockFrames( o.iframeFix === true ? "iframe" : o.iframeFix );

    return true;

  },

  _blockFrames: function( selector ) {
    this.iframeBlocks = this.document.find( selector ).map(function() {
      var iframe = $( this );

      return $( "<div>" )
        .css( "position", "absolute" )
        .appendTo( iframe.parent() )
        .outerWidth( iframe.outerWidth() )
        .outerHeight( iframe.outerHeight() )
        .offset( iframe.offset() )[ 0 ];
    });
  },

  _unblockFrames: function() {
    if ( this.iframeBlocks ) {
      this.iframeBlocks.remove();
      delete this.iframeBlocks;
    }
  },

  _blurActiveElement: function( event ) {
    var document = this.document[ 0 ];

    // Only need to blur if the event occurred on the draggable itself, see #10527
    if ( !this.handleElement.is( event.target ) ) {
      return;
    }

    // support: IE9
    // IE9 throws an "Unspecified error" accessing document.activeElement from an <iframe>
    try {

      // Support: IE9, IE10
      // If the <body> is blurred, IE will switch windows, see #9520
      if ( document.activeElement && document.activeElement.nodeName.toLowerCase() !== "body" ) {

        // Blur any element that currently has focus, see #4261
        $( document.activeElement ).blur();
      }
    } catch ( error ) {}
  },

  _mouseStart: function(event) {

    var o = this.options;

    //Create and append the visible helper
    this.helper = this._createHelper(event);

    this.helper.addClass("ui-draggable-dragging");

    //Cache the helper size
    this._cacheHelperProportions();

    //If ddmanager is used for droppables, set the global draggable
    if ($.ui.ddmanager) {
      $.ui.ddmanager.current = this;
    }

    /*
     * - Position generation -
     * This block generates everything position related - it's the core of draggables.
     */

    //Cache the margins of the original element
    this._cacheMargins();

    //Store the helper's css position
    this.cssPosition = this.helper.css( "position" );
    this.scrollParent = this.helper.scrollParent( true );
    this.offsetParent = this.helper.offsetParent();
    this.hasFixedAncestor = this.helper.parents().filter(function() {
        return $( this ).css( "position" ) === "fixed";
      }).length > 0;

    //The element's absolute position on the page minus margins
    this.positionAbs = this.element.offset();
    this._refreshOffsets( event );

    //Generate the original position
    this.originalPosition = this.position = this._generatePosition( event, false );
    this.originalPageX = event.pageX;
    this.originalPageY = event.pageY;

    //Adjust the mouse offset relative to the helper if "cursorAt" is supplied
    (o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

    //Set a containment if given in the options
    this._setContainment();

    //Trigger event + callbacks
    if (this._trigger("start", event) === false) {
      this._clear();
      return false;
    }

    //Recache the helper size
    this._cacheHelperProportions();

    //Prepare the droppable offsets
    if ($.ui.ddmanager && !o.dropBehaviour) {
      $.ui.ddmanager.prepareOffsets(this, event);
    }

    // Reset helper's right/bottom css if they're set and set explicit width/height instead
    // as this prevents resizing of elements with right/bottom set (see #7772)
    this._normalizeRightBottom();

    this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position

    //If the ddmanager is used for droppables, inform the manager that dragging has started (see #5003)
    if ( $.ui.ddmanager ) {
      $.ui.ddmanager.dragStart(this, event);
    }

    return true;
  },

  _refreshOffsets: function( event ) {
    this.offset = {
      top: this.positionAbs.top - this.margins.top,
      left: this.positionAbs.left - this.margins.left,
      scroll: false,
      parent: this._getParentOffset(),
      relative: this._getRelativeOffset()
    };

    this.offset.click = {
      left: event.pageX - this.offset.left,
      top: event.pageY - this.offset.top
    };
  },

  _mouseDrag: function(event, noPropagation) {
    // reset any necessary cached properties (see #5009)
    if ( this.hasFixedAncestor ) {
      this.offset.parent = this._getParentOffset();
    }

    //Compute the helpers position
    this.position = this._generatePosition( event, true );
    this.positionAbs = this._convertPositionTo("absolute");

    //Call plugins and callbacks and use the resulting position if something is returned
    if (!noPropagation) {
      var ui = this._uiHash();
      if (this._trigger("drag", event, ui) === false) {
        this._mouseUp({});
        return false;
      }
      this.position = ui.position;
    }

    this.helper[ 0 ].style.left = this.position.left + "px";
    this.helper[ 0 ].style.top = this.position.top + "px";

    if ($.ui.ddmanager) {
      $.ui.ddmanager.drag(this, event);
    }

    return false;
  },

  _mouseStop: function(event) {

    //If we are using droppables, inform the manager about the drop
    var that = this,
      dropped = false;
    if ($.ui.ddmanager && !this.options.dropBehaviour) {
      dropped = $.ui.ddmanager.drop(this, event);
    }

    //if a drop comes from outside (a sortable)
    if (this.dropped) {
      dropped = this.dropped;
      this.dropped = false;
    }

    if ((this.options.revert === "invalid" && !dropped) || (this.options.revert === "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
      $(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
        if (that._trigger("stop", event) !== false) {
          that._clear();
        }
      });
    } else {
      if (this._trigger("stop", event) !== false) {
        this._clear();
      }
    }

    return false;
  },

  _mouseUp: function( event ) {
    this._unblockFrames();

    //If the ddmanager is used for droppables, inform the manager that dragging has stopped (see #5003)
    if ( $.ui.ddmanager ) {
      $.ui.ddmanager.dragStop(this, event);
    }

    // Only need to focus if the event occurred on the draggable itself, see #10527
    if ( this.handleElement.is( event.target ) ) {
      // The interaction is over; whether or not the click resulted in a drag, focus the element
      this.element.focus();
    }

    return $.ui.mouse.prototype._mouseUp.call(this, event);
  },

  cancel: function() {

    if (this.helper.is(".ui-draggable-dragging")) {
      this._mouseUp({});
    } else {
      this._clear();
    }

    return this;

  },

  _getHandle: function(event) {
    return this.options.handle ?
      !!$( event.target ).closest( this.element.find( this.options.handle ) ).length :
      true;
  },

  _setHandleClassName: function() {
    this.handleElement = this.options.handle ?
      this.element.find( this.options.handle ) : this.element;
    this.handleElement.addClass( "ui-draggable-handle" );
  },

  _removeHandleClassName: function() {
    this.handleElement.removeClass( "ui-draggable-handle" );
  },

  _createHelper: function(event) {

    var o = this.options,
      helperIsFunction = $.isFunction( o.helper ),
      helper = helperIsFunction ?
        $( o.helper.apply( this.element[ 0 ], [ event ] ) ) :
        ( o.helper === "clone" ?
          this.element.clone().removeAttr( "id" ) :
          this.element );

    if (!helper.parents("body").length) {
      helper.appendTo((o.appendTo === "parent" ? this.element[0].parentNode : o.appendTo));
    }

    // http://bugs.jqueryui.com/ticket/9446
    // a helper function can return the original element
    // which wouldn't have been set to relative in _create
    if ( helperIsFunction && helper[ 0 ] === this.element[ 0 ] ) {
      this._setPositionRelative();
    }

    if (helper[0] !== this.element[0] && !(/(fixed|absolute)/).test(helper.css("position"))) {
      helper.css("position", "absolute");
    }

    return helper;

  },

  _setPositionRelative: function() {
    if ( !( /^(?:r|a|f)/ ).test( this.element.css( "position" ) ) ) {
      this.element[ 0 ].style.position = "relative";
    }
  },

  _adjustOffsetFromHelper: function(obj) {
    if (typeof obj === "string") {
      obj = obj.split(" ");
    }
    if ($.isArray(obj)) {
      obj = { left: +obj[0], top: +obj[1] || 0 };
    }
    if ("left" in obj) {
      this.offset.click.left = obj.left + this.margins.left;
    }
    if ("right" in obj) {
      this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
    }
    if ("top" in obj) {
      this.offset.click.top = obj.top + this.margins.top;
    }
    if ("bottom" in obj) {
      this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
    }
  },

  _isRootNode: function( element ) {
    return ( /(html|body)/i ).test( element.tagName ) || element === this.document[ 0 ];
  },

  _getParentOffset: function() {

    //Get the offsetParent and cache its position
    var po = this.offsetParent.offset(),
      document = this.document[ 0 ];

    // This is a special case where we need to modify a offset calculated on start, since the following happened:
    // 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
    // 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
    //    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
    if (this.cssPosition === "absolute" && this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
      po.left += this.scrollParent.scrollLeft();
      po.top += this.scrollParent.scrollTop();
    }

    if ( this._isRootNode( this.offsetParent[ 0 ] ) ) {
      po = { top: 0, left: 0 };
    }

    return {
      top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
      left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
    };

  },

  _getRelativeOffset: function() {
    if ( this.cssPosition !== "relative" ) {
      return { top: 0, left: 0 };
    }

    var p = this.element.position(),
      scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] );

    return {
      top: p.top - ( parseInt(this.helper.css( "top" ), 10) || 0 ) + ( !scrollIsRootNode ? this.scrollParent.scrollTop() : 0 ),
      left: p.left - ( parseInt(this.helper.css( "left" ), 10) || 0 ) + ( !scrollIsRootNode ? this.scrollParent.scrollLeft() : 0 )
    };

  },

  _cacheMargins: function() {
    this.margins = {
      left: (parseInt(this.element.css("marginLeft"), 10) || 0),
      top: (parseInt(this.element.css("marginTop"), 10) || 0),
      right: (parseInt(this.element.css("marginRight"), 10) || 0),
      bottom: (parseInt(this.element.css("marginBottom"), 10) || 0)
    };
  },

  _cacheHelperProportions: function() {
    this.helperProportions = {
      width: this.helper.outerWidth(),
      height: this.helper.outerHeight()
    };
  },

  _setContainment: function() {

    var isUserScrollable, c, ce,
      o = this.options,
      document = this.document[ 0 ];

    this.relativeContainer = null;

    if ( !o.containment ) {
      this.containment = null;
      return;
    }

    if ( o.containment === "window" ) {
      this.containment = [
        $( window ).scrollLeft() - this.offset.relative.left - this.offset.parent.left,
        $( window ).scrollTop() - this.offset.relative.top - this.offset.parent.top,
        $( window ).scrollLeft() + $( window ).width() - this.helperProportions.width - this.margins.left,
        $( window ).scrollTop() + ( $( window ).height() || document.body.parentNode.scrollHeight ) - this.helperProportions.height - this.margins.top
      ];
      return;
    }

    if ( o.containment === "document") {
      this.containment = [
        0,
        0,
        $( document ).width() - this.helperProportions.width - this.margins.left,
        ( $( document ).height() || document.body.parentNode.scrollHeight ) - this.helperProportions.height - this.margins.top
      ];
      return;
    }

    if ( o.containment.constructor === Array ) {
      this.containment = o.containment;
      return;
    }

    if ( o.containment === "parent" ) {
      o.containment = this.helper[ 0 ].parentNode;
    }

    c = $( o.containment );
    ce = c[ 0 ];

    if ( !ce ) {
      return;
    }

    isUserScrollable = /(scroll|auto)/.test( c.css( "overflow" ) );

    this.containment = [
      ( parseInt( c.css( "borderLeftWidth" ), 10 ) || 0 ) + ( parseInt( c.css( "paddingLeft" ), 10 ) || 0 ),
      ( parseInt( c.css( "borderTopWidth" ), 10 ) || 0 ) + ( parseInt( c.css( "paddingTop" ), 10 ) || 0 ),
      ( isUserScrollable ? Math.max( ce.scrollWidth, ce.offsetWidth ) : ce.offsetWidth ) -
        ( parseInt( c.css( "borderRightWidth" ), 10 ) || 0 ) -
        ( parseInt( c.css( "paddingRight" ), 10 ) || 0 ) -
        this.helperProportions.width -
        this.margins.left -
        this.margins.right,
      ( isUserScrollable ? Math.max( ce.scrollHeight, ce.offsetHeight ) : ce.offsetHeight ) -
        ( parseInt( c.css( "borderBottomWidth" ), 10 ) || 0 ) -
        ( parseInt( c.css( "paddingBottom" ), 10 ) || 0 ) -
        this.helperProportions.height -
        this.margins.top -
        this.margins.bottom
    ];
    this.relativeContainer = c;
  },

  _convertPositionTo: function(d, pos) {

    if (!pos) {
      pos = this.position;
    }

    var mod = d === "absolute" ? 1 : -1,
      scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] );

    return {
      top: (
        pos.top +                               // The absolute mouse position
        this.offset.relative.top * mod +                    // Only for relative positioned nodes: Relative offset from element to offset parent
        this.offset.parent.top * mod -                    // The offsetParent's offset without borders (offset + border)
        ( ( this.cssPosition === "fixed" ? -this.offset.scroll.top : ( scrollIsRootNode ? 0 : this.offset.scroll.top ) ) * mod)
      ),
      left: (
        pos.left +                                // The absolute mouse position
        this.offset.relative.left * mod +                   // Only for relative positioned nodes: Relative offset from element to offset parent
        this.offset.parent.left * mod -                   // The offsetParent's offset without borders (offset + border)
        ( ( this.cssPosition === "fixed" ? -this.offset.scroll.left : ( scrollIsRootNode ? 0 : this.offset.scroll.left ) ) * mod)
      )
    };

  },

  _generatePosition: function( event, constrainPosition ) {

    var containment, co, top, left,
      o = this.options,
      scrollIsRootNode = this._isRootNode( this.scrollParent[ 0 ] ),
      pageX = event.pageX,
      pageY = event.pageY;

    // Cache the scroll
    if ( !scrollIsRootNode || !this.offset.scroll ) {
      this.offset.scroll = {
        top: this.scrollParent.scrollTop(),
        left: this.scrollParent.scrollLeft()
      };
    }

    /*
     * - Position constraining -
     * Constrain the position to a mix of grid, containment.
     */

    // If we are not dragging yet, we won't check for options
    if ( constrainPosition ) {
      if ( this.containment ) {
        if ( this.relativeContainer ){
          co = this.relativeContainer.offset();
          containment = [
            this.containment[ 0 ] + co.left,
            this.containment[ 1 ] + co.top,
            this.containment[ 2 ] + co.left,
            this.containment[ 3 ] + co.top
          ];
        } else {
          containment = this.containment;
        }

        if (event.pageX - this.offset.click.left < containment[0]) {
          pageX = containment[0] + this.offset.click.left;
        }
        if (event.pageY - this.offset.click.top < containment[1]) {
          pageY = containment[1] + this.offset.click.top;
        }
        if (event.pageX - this.offset.click.left > containment[2]) {
          pageX = containment[2] + this.offset.click.left;
        }
        if (event.pageY - this.offset.click.top > containment[3]) {
          pageY = containment[3] + this.offset.click.top;
        }
      }

      if (o.grid) {
        //Check for grid elements set to 0 to prevent divide by 0 error causing invalid argument errors in IE (see ticket #6950)
        top = o.grid[1] ? this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
        pageY = containment ? ((top - this.offset.click.top >= containment[1] || top - this.offset.click.top > containment[3]) ? top : ((top - this.offset.click.top >= containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

        left = o.grid[0] ? this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX;
        pageX = containment ? ((left - this.offset.click.left >= containment[0] || left - this.offset.click.left > containment[2]) ? left : ((left - this.offset.click.left >= containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
      }

      if ( o.axis === "y" ) {
        pageX = this.originalPageX;
      }

      if ( o.axis === "x" ) {
        pageY = this.originalPageY;
      }
    }

    return {
      top: (
        pageY -                                 // The absolute mouse position
        this.offset.click.top -                       // Click offset (relative to the element)
        this.offset.relative.top -                        // Only for relative positioned nodes: Relative offset from element to offset parent
        this.offset.parent.top +                        // The offsetParent's offset without borders (offset + border)
        ( this.cssPosition === "fixed" ? -this.offset.scroll.top : ( scrollIsRootNode ? 0 : this.offset.scroll.top ) )
      ),
      left: (
        pageX -                                 // The absolute mouse position
        this.offset.click.left -                        // Click offset (relative to the element)
        this.offset.relative.left -                       // Only for relative positioned nodes: Relative offset from element to offset parent
        this.offset.parent.left +                       // The offsetParent's offset without borders (offset + border)
        ( this.cssPosition === "fixed" ? -this.offset.scroll.left : ( scrollIsRootNode ? 0 : this.offset.scroll.left ) )
      )
    };

  },

  _clear: function() {
    this.helper.removeClass("ui-draggable-dragging");
    if (this.helper[0] !== this.element[0] && !this.cancelHelperRemoval) {
      this.helper.remove();
    }
    this.helper = null;
    this.cancelHelperRemoval = false;
    if ( this.destroyOnClear ) {
      this.destroy();
    }
  },

  _normalizeRightBottom: function() {
    if ( this.options.axis !== "y" && this.helper.css( "right" ) !== "auto" ) {
      this.helper.width( this.helper.width() );
      this.helper.css( "right", "auto" );
    }
    if ( this.options.axis !== "x" && this.helper.css( "bottom" ) !== "auto" ) {
      this.helper.height( this.helper.height() );
      this.helper.css( "bottom", "auto" );
    }
  },

  // From now on bulk stuff - mainly helpers

  _trigger: function( type, event, ui ) {
    ui = ui || this._uiHash();
    $.ui.plugin.call( this, type, [ event, ui, this ], true );

    // Absolute position and offset (see #6884 ) have to be recalculated after plugins
    if ( /^(drag|start|stop)/.test( type ) ) {
      this.positionAbs = this._convertPositionTo( "absolute" );
      ui.offset = this.positionAbs;
    }
    return $.Widget.prototype._trigger.call( this, type, event, ui );
  },

  plugins: {},

  _uiHash: function() {
    return {
      helper: this.helper,
      position: this.position,
      originalPosition: this.originalPosition,
      offset: this.positionAbs
    };
  }

});

$.ui.plugin.add( "draggable", "connectToSortable", {
  start: function( event, ui, draggable ) {
    var uiSortable = $.extend( {}, ui, {
      item: draggable.element
    });

    draggable.sortables = [];
    $( draggable.options.connectToSortable ).each(function() {
      var sortable = $( this ).sortable( "instance" );

      if ( sortable && !sortable.options.disabled ) {
        draggable.sortables.push( sortable );

        // refreshPositions is called at drag start to refresh the containerCache
        // which is used in drag. This ensures it's initialized and synchronized
        // with any changes that might have happened on the page since initialization.
        sortable.refreshPositions();
        sortable._trigger("activate", event, uiSortable);
      }
    });
  },
  stop: function( event, ui, draggable ) {
    var uiSortable = $.extend( {}, ui, {
      item: draggable.element
    });

    draggable.cancelHelperRemoval = false;

    $.each( draggable.sortables, function() {
      var sortable = this;

      if ( sortable.isOver ) {
        sortable.isOver = 0;

        // Allow this sortable to handle removing the helper
        draggable.cancelHelperRemoval = true;
        sortable.cancelHelperRemoval = false;

        // Use _storedCSS To restore properties in the sortable,
        // as this also handles revert (#9675) since the draggable
        // may have modified them in unexpected ways (#8809)
        sortable._storedCSS = {
          position: sortable.placeholder.css( "position" ),
          top: sortable.placeholder.css( "top" ),
          left: sortable.placeholder.css( "left" )
        };

        sortable._mouseStop(event);

        // Once drag has ended, the sortable should return to using
        // its original helper, not the shared helper from draggable
        sortable.options.helper = sortable.options._helper;
      } else {
        // Prevent this Sortable from removing the helper.
        // However, don't set the draggable to remove the helper
        // either as another connected Sortable may yet handle the removal.
        sortable.cancelHelperRemoval = true;

        sortable._trigger( "deactivate", event, uiSortable );
      }
    });
  },
  drag: function( event, ui, draggable ) {
    $.each( draggable.sortables, function() {
      var innermostIntersecting = false,
        sortable = this;

      // Copy over variables that sortable's _intersectsWith uses
      sortable.positionAbs = draggable.positionAbs;
      sortable.helperProportions = draggable.helperProportions;
      sortable.offset.click = draggable.offset.click;

      if ( sortable._intersectsWith( sortable.containerCache ) ) {
        innermostIntersecting = true;

        $.each( draggable.sortables, function() {
          // Copy over variables that sortable's _intersectsWith uses
          this.positionAbs = draggable.positionAbs;
          this.helperProportions = draggable.helperProportions;
          this.offset.click = draggable.offset.click;

          if ( this !== sortable &&
              this._intersectsWith( this.containerCache ) &&
              $.contains( sortable.element[ 0 ], this.element[ 0 ] ) ) {
            innermostIntersecting = false;
          }

          return innermostIntersecting;
        });
      }

      if ( innermostIntersecting ) {
        // If it intersects, we use a little isOver variable and set it once,
        // so that the move-in stuff gets fired only once.
        if ( !sortable.isOver ) {
          sortable.isOver = 1;

          sortable.currentItem = ui.helper
            .appendTo( sortable.element )
            .data( "ui-sortable-item", true );

          // Store helper option to later restore it
          sortable.options._helper = sortable.options.helper;

          sortable.options.helper = function() {
            return ui.helper[ 0 ];
          };

          // Fire the start events of the sortable with our passed browser event,
          // and our own helper (so it doesn't create a new one)
          event.target = sortable.currentItem[ 0 ];
          sortable._mouseCapture( event, true );
          sortable._mouseStart( event, true, true );

          // Because the browser event is way off the new appended portlet,
          // modify necessary variables to reflect the changes
          sortable.offset.click.top = draggable.offset.click.top;
          sortable.offset.click.left = draggable.offset.click.left;
          sortable.offset.parent.left -= draggable.offset.parent.left -
            sortable.offset.parent.left;
          sortable.offset.parent.top -= draggable.offset.parent.top -
            sortable.offset.parent.top;

          draggable._trigger( "toSortable", event );

          // Inform draggable that the helper is in a valid drop zone,
          // used solely in the revert option to handle "valid/invalid".
          draggable.dropped = sortable.element;

          // Need to refreshPositions of all sortables in the case that
          // adding to one sortable changes the location of the other sortables (#9675)
          $.each( draggable.sortables, function() {
            this.refreshPositions();
          });

          // hack so receive/update callbacks work (mostly)
          draggable.currentItem = draggable.element;
          sortable.fromOutside = draggable;
        }

        if ( sortable.currentItem ) {
          sortable._mouseDrag( event );
          // Copy the sortable's position because the draggable's can potentially reflect
          // a relative position, while sortable is always absolute, which the dragged
          // element has now become. (#8809)
          ui.position = sortable.position;
        }
      } else {
        // If it doesn't intersect with the sortable, and it intersected before,
        // we fake the drag stop of the sortable, but make sure it doesn't remove
        // the helper by using cancelHelperRemoval.
        if ( sortable.isOver ) {

          sortable.isOver = 0;
          sortable.cancelHelperRemoval = true;

          // Calling sortable's mouseStop would trigger a revert,
          // so revert must be temporarily false until after mouseStop is called.
          sortable.options._revert = sortable.options.revert;
          sortable.options.revert = false;

          sortable._trigger( "out", event, sortable._uiHash( sortable ) );
          sortable._mouseStop( event, true );

          // restore sortable behaviors that were modfied
          // when the draggable entered the sortable area (#9481)
          sortable.options.revert = sortable.options._revert;
          sortable.options.helper = sortable.options._helper;

          if ( sortable.placeholder ) {
            sortable.placeholder.remove();
          }

          // Recalculate the draggable's offset considering the sortable
          // may have modified them in unexpected ways (#8809)
          draggable._refreshOffsets( event );
          ui.position = draggable._generatePosition( event, true );

          draggable._trigger( "fromSortable", event );

          // Inform draggable that the helper is no longer in a valid drop zone
          draggable.dropped = false;

          // Need to refreshPositions of all sortables just in case removing
          // from one sortable changes the location of other sortables (#9675)
          $.each( draggable.sortables, function() {
            this.refreshPositions();
          });
        }
      }
    });
  }
});

$.ui.plugin.add("draggable", "cursor", {
  start: function( event, ui, instance ) {
    var t = $( "body" ),
      o = instance.options;

    if (t.css("cursor")) {
      o._cursor = t.css("cursor");
    }
    t.css("cursor", o.cursor);
  },
  stop: function( event, ui, instance ) {
    var o = instance.options;
    if (o._cursor) {
      $("body").css("cursor", o._cursor);
    }
  }
});

$.ui.plugin.add("draggable", "opacity", {
  start: function( event, ui, instance ) {
    var t = $( ui.helper ),
      o = instance.options;
    if (t.css("opacity")) {
      o._opacity = t.css("opacity");
    }
    t.css("opacity", o.opacity);
  },
  stop: function( event, ui, instance ) {
    var o = instance.options;
    if (o._opacity) {
      $(ui.helper).css("opacity", o._opacity);
    }
  }
});

$.ui.plugin.add("draggable", "scroll", {
  start: function( event, ui, i ) {
    if ( !i.scrollParentNotHidden ) {
      i.scrollParentNotHidden = i.helper.scrollParent( false );
    }

    if ( i.scrollParentNotHidden[ 0 ] !== i.document[ 0 ] && i.scrollParentNotHidden[ 0 ].tagName !== "HTML" ) {
      i.overflowOffset = i.scrollParentNotHidden.offset();
    }
  },
  drag: function( event, ui, i  ) {

    var o = i.options,
      scrolled = false,
      scrollParent = i.scrollParentNotHidden[ 0 ],
      document = i.document[ 0 ];

    if ( scrollParent !== document && scrollParent.tagName !== "HTML" ) {
      if ( !o.axis || o.axis !== "x" ) {
        if ( ( i.overflowOffset.top + scrollParent.offsetHeight ) - event.pageY < o.scrollSensitivity ) {
          scrollParent.scrollTop = scrolled = scrollParent.scrollTop + o.scrollSpeed;
        } else if ( event.pageY - i.overflowOffset.top < o.scrollSensitivity ) {
          scrollParent.scrollTop = scrolled = scrollParent.scrollTop - o.scrollSpeed;
        }
      }

      if ( !o.axis || o.axis !== "y" ) {
        if ( ( i.overflowOffset.left + scrollParent.offsetWidth ) - event.pageX < o.scrollSensitivity ) {
          scrollParent.scrollLeft = scrolled = scrollParent.scrollLeft + o.scrollSpeed;
        } else if ( event.pageX - i.overflowOffset.left < o.scrollSensitivity ) {
          scrollParent.scrollLeft = scrolled = scrollParent.scrollLeft - o.scrollSpeed;
        }
      }

    } else {

      if (!o.axis || o.axis !== "x") {
        if (event.pageY - $(document).scrollTop() < o.scrollSensitivity) {
          scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
        } else if ($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity) {
          scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
        }
      }

      if (!o.axis || o.axis !== "y") {
        if (event.pageX - $(document).scrollLeft() < o.scrollSensitivity) {
          scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
        } else if ($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity) {
          scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
        }
      }

    }

    if (scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
      $.ui.ddmanager.prepareOffsets(i, event);
    }

  }
});

$.ui.plugin.add("draggable", "snap", {
  start: function( event, ui, i ) {

    var o = i.options;

    i.snapElements = [];

    $(o.snap.constructor !== String ? ( o.snap.items || ":data(ui-draggable)" ) : o.snap).each(function() {
      var $t = $(this),
        $o = $t.offset();
      if (this !== i.element[0]) {
        i.snapElements.push({
          item: this,
          width: $t.outerWidth(), height: $t.outerHeight(),
          top: $o.top, left: $o.left
        });
      }
    });

  },
  drag: function( event, ui, inst ) {

    var ts, bs, ls, rs, l, r, t, b, i, first,
      o = inst.options,
      d = o.snapTolerance,
      x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
      y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

    for (i = inst.snapElements.length - 1; i >= 0; i--){

      l = inst.snapElements[i].left - inst.margins.left;
      r = l + inst.snapElements[i].width;
      t = inst.snapElements[i].top - inst.margins.top;
      b = t + inst.snapElements[i].height;

      if ( x2 < l - d || x1 > r + d || y2 < t - d || y1 > b + d || !$.contains( inst.snapElements[ i ].item.ownerDocument, inst.snapElements[ i ].item ) ) {
        if (inst.snapElements[i].snapping) {
          (inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
        }
        inst.snapElements[i].snapping = false;
        continue;
      }

      if (o.snapMode !== "inner") {
        ts = Math.abs(t - y2) <= d;
        bs = Math.abs(b - y1) <= d;
        ls = Math.abs(l - x2) <= d;
        rs = Math.abs(r - x1) <= d;
        if (ts) {
          ui.position.top = inst._convertPositionTo("relative", { top: t - inst.helperProportions.height, left: 0 }).top;
        }
        if (bs) {
          ui.position.top = inst._convertPositionTo("relative", { top: b, left: 0 }).top;
        }
        if (ls) {
          ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l - inst.helperProportions.width }).left;
        }
        if (rs) {
          ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r }).left;
        }
      }

      first = (ts || bs || ls || rs);

      if (o.snapMode !== "outer") {
        ts = Math.abs(t - y1) <= d;
        bs = Math.abs(b - y2) <= d;
        ls = Math.abs(l - x1) <= d;
        rs = Math.abs(r - x2) <= d;
        if (ts) {
          ui.position.top = inst._convertPositionTo("relative", { top: t, left: 0 }).top;
        }
        if (bs) {
          ui.position.top = inst._convertPositionTo("relative", { top: b - inst.helperProportions.height, left: 0 }).top;
        }
        if (ls) {
          ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l }).left;
        }
        if (rs) {
          ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r - inst.helperProportions.width }).left;
        }
      }

      if (!inst.snapElements[i].snapping && (ts || bs || ls || rs || first)) {
        (inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
      }
      inst.snapElements[i].snapping = (ts || bs || ls || rs || first);

    }

  }
});

$.ui.plugin.add("draggable", "stack", {
  start: function( event, ui, instance ) {
    var min,
      o = instance.options,
      group = $.makeArray($(o.stack)).sort(function(a, b) {
        return (parseInt($(a).css("zIndex"), 10) || 0) - (parseInt($(b).css("zIndex"), 10) || 0);
      });

    if (!group.length) { return; }

    min = parseInt($(group[0]).css("zIndex"), 10) || 0;
    $(group).each(function(i) {
      $(this).css("zIndex", min + i);
    });
    this.css("zIndex", (min + group.length));
  }
});

$.ui.plugin.add("draggable", "zIndex", {
  start: function( event, ui, instance ) {
    var t = $( ui.helper ),
      o = instance.options;

    if (t.css("zIndex")) {
      o._zIndex = t.css("zIndex");
    }
    t.css("zIndex", o.zIndex);
  },
  stop: function( event, ui, instance ) {
    var o = instance.options;

    if (o._zIndex) {
      $(ui.helper).css("zIndex", o._zIndex);
    }
  }
});

var draggable = $.ui.draggable;


/*!
 * jQuery UI Droppable 1.11.3
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/droppable/
 */


$.widget( "ui.droppable", {
  version: "1.11.3",
  widgetEventPrefix: "drop",
  options: {
    accept: "*",
    activeClass: false,
    addClasses: true,
    greedy: false,
    hoverClass: false,
    scope: "default",
    tolerance: "intersect",

    // callbacks
    activate: null,
    deactivate: null,
    drop: null,
    out: null,
    over: null
  },
  _create: function() {

    var proportions,
      o = this.options,
      accept = o.accept;

    this.isover = false;
    this.isout = true;

    this.accept = $.isFunction( accept ) ? accept : function( d ) {
      return d.is( accept );
    };

    this.proportions = function( /* valueToWrite */ ) {
      if ( arguments.length ) {
        // Store the droppable's proportions
        proportions = arguments[ 0 ];
      } else {
        // Retrieve or derive the droppable's proportions
        return proportions ?
          proportions :
          proportions = {
            width: this.element[ 0 ].offsetWidth,
            height: this.element[ 0 ].offsetHeight
          };
      }
    };

    this._addToManager( o.scope );

    o.addClasses && this.element.addClass( "ui-droppable" );

  },

  _addToManager: function( scope ) {
    // Add the reference and positions to the manager
    $.ui.ddmanager.droppables[ scope ] = $.ui.ddmanager.droppables[ scope ] || [];
    $.ui.ddmanager.droppables[ scope ].push( this );
  },

  _splice: function( drop ) {
    var i = 0;
    for ( ; i < drop.length; i++ ) {
      if ( drop[ i ] === this ) {
        drop.splice( i, 1 );
      }
    }
  },

  _destroy: function() {
    var drop = $.ui.ddmanager.droppables[ this.options.scope ];

    this._splice( drop );

    this.element.removeClass( "ui-droppable ui-droppable-disabled" );
  },

  _setOption: function( key, value ) {

    if ( key === "accept" ) {
      this.accept = $.isFunction( value ) ? value : function( d ) {
        return d.is( value );
      };
    } else if ( key === "scope" ) {
      var drop = $.ui.ddmanager.droppables[ this.options.scope ];

      this._splice( drop );
      this._addToManager( value );
    }

    this._super( key, value );
  },

  _activate: function( event ) {
    var draggable = $.ui.ddmanager.current;
    if ( this.options.activeClass ) {
      this.element.addClass( this.options.activeClass );
    }
    if ( draggable ){
      this._trigger( "activate", event, this.ui( draggable ) );
    }
  },

  _deactivate: function( event ) {
    var draggable = $.ui.ddmanager.current;
    if ( this.options.activeClass ) {
      this.element.removeClass( this.options.activeClass );
    }
    if ( draggable ){
      this._trigger( "deactivate", event, this.ui( draggable ) );
    }
  },

  _over: function( event ) {

    var draggable = $.ui.ddmanager.current;

    // Bail if draggable and droppable are same element
    if ( !draggable || ( draggable.currentItem || draggable.element )[ 0 ] === this.element[ 0 ] ) {
      return;
    }

    if ( this.accept.call( this.element[ 0 ], ( draggable.currentItem || draggable.element ) ) ) {
      if ( this.options.hoverClass ) {
        this.element.addClass( this.options.hoverClass );
      }
      this._trigger( "over", event, this.ui( draggable ) );
    }

  },

  _out: function( event ) {

    var draggable = $.ui.ddmanager.current;

    // Bail if draggable and droppable are same element
    if ( !draggable || ( draggable.currentItem || draggable.element )[ 0 ] === this.element[ 0 ] ) {
      return;
    }

    if ( this.accept.call( this.element[ 0 ], ( draggable.currentItem || draggable.element ) ) ) {
      if ( this.options.hoverClass ) {
        this.element.removeClass( this.options.hoverClass );
      }
      this._trigger( "out", event, this.ui( draggable ) );
    }

  },

  _drop: function( event, custom ) {

    var draggable = custom || $.ui.ddmanager.current,
      childrenIntersection = false;

    // Bail if draggable and droppable are same element
    if ( !draggable || ( draggable.currentItem || draggable.element )[ 0 ] === this.element[ 0 ] ) {
      return false;
    }

    this.element.find( ":data(ui-droppable)" ).not( ".ui-draggable-dragging" ).each(function() {
      var inst = $( this ).droppable( "instance" );
      if (
        inst.options.greedy &&
        !inst.options.disabled &&
        inst.options.scope === draggable.options.scope &&
        inst.accept.call( inst.element[ 0 ], ( draggable.currentItem || draggable.element ) ) &&
        $.ui.intersect( draggable, $.extend( inst, { offset: inst.element.offset() } ), inst.options.tolerance, event )
      ) { childrenIntersection = true; return false; }
    });
    if ( childrenIntersection ) {
      return false;
    }

    if ( this.accept.call( this.element[ 0 ], ( draggable.currentItem || draggable.element ) ) ) {
      if ( this.options.activeClass ) {
        this.element.removeClass( this.options.activeClass );
      }
      if ( this.options.hoverClass ) {
        this.element.removeClass( this.options.hoverClass );
      }
      this._trigger( "drop", event, this.ui( draggable ) );
      return this.element;
    }

    return false;

  },

  ui: function( c ) {
    return {
      draggable: ( c.currentItem || c.element ),
      helper: c.helper,
      position: c.position,
      offset: c.positionAbs
    };
  }

});

$.ui.intersect = (function() {
  function isOverAxis( x, reference, size ) {
    return ( x >= reference ) && ( x < ( reference + size ) );
  }

  return function( draggable, droppable, toleranceMode, event ) {

    if ( !droppable.offset ) {
      return false;
    }

    var x1 = ( draggable.positionAbs || draggable.position.absolute ).left + draggable.margins.left,
      y1 = ( draggable.positionAbs || draggable.position.absolute ).top + draggable.margins.top,
      x2 = x1 + draggable.helperProportions.width,
      y2 = y1 + draggable.helperProportions.height,
      l = droppable.offset.left,
      t = droppable.offset.top,
      r = l + droppable.proportions().width,
      b = t + droppable.proportions().height;

    switch ( toleranceMode ) {
    case "fit":
      return ( l <= x1 && x2 <= r && t <= y1 && y2 <= b );
    case "intersect":
      return ( l < x1 + ( draggable.helperProportions.width / 2 ) && // Right Half
        x2 - ( draggable.helperProportions.width / 2 ) < r && // Left Half
        t < y1 + ( draggable.helperProportions.height / 2 ) && // Bottom Half
        y2 - ( draggable.helperProportions.height / 2 ) < b ); // Top Half
    case "pointer":
      return isOverAxis( event.pageY, t, droppable.proportions().height ) && isOverAxis( event.pageX, l, droppable.proportions().width );
    case "touch":
      return (
        ( y1 >= t && y1 <= b ) || // Top edge touching
        ( y2 >= t && y2 <= b ) || // Bottom edge touching
        ( y1 < t && y2 > b ) // Surrounded vertically
      ) && (
        ( x1 >= l && x1 <= r ) || // Left edge touching
        ( x2 >= l && x2 <= r ) || // Right edge touching
        ( x1 < l && x2 > r ) // Surrounded horizontally
      );
    default:
      return false;
    }
  };
})();

/*
  This manager tracks offsets of draggables and droppables
*/
$.ui.ddmanager = {
  current: null,
  droppables: { "default": [] },
  prepareOffsets: function( t, event ) {

    var i, j,
      m = $.ui.ddmanager.droppables[ t.options.scope ] || [],
      type = event ? event.type : null, // workaround for #2317
      list = ( t.currentItem || t.element ).find( ":data(ui-droppable)" ).addBack();

    droppablesLoop: for ( i = 0; i < m.length; i++ ) {

      // No disabled and non-accepted
      if ( m[ i ].options.disabled || ( t && !m[ i ].accept.call( m[ i ].element[ 0 ], ( t.currentItem || t.element ) ) ) ) {
        continue;
      }

      // Filter out elements in the current dragged item
      for ( j = 0; j < list.length; j++ ) {
        if ( list[ j ] === m[ i ].element[ 0 ] ) {
          m[ i ].proportions().height = 0;
          continue droppablesLoop;
        }
      }

      m[ i ].visible = m[ i ].element.css( "display" ) !== "none";
      if ( !m[ i ].visible ) {
        continue;
      }

      // Activate the droppable if used directly from draggables
      if ( type === "mousedown" ) {
        m[ i ]._activate.call( m[ i ], event );
      }

      m[ i ].offset = m[ i ].element.offset();
      m[ i ].proportions({ width: m[ i ].element[ 0 ].offsetWidth, height: m[ i ].element[ 0 ].offsetHeight });

    }

  },
  drop: function( draggable, event ) {

    var dropped = false;
    // Create a copy of the droppables in case the list changes during the drop (#9116)
    $.each( ( $.ui.ddmanager.droppables[ draggable.options.scope ] || [] ).slice(), function() {

      if ( !this.options ) {
        return;
      }
      if ( !this.options.disabled && this.visible && $.ui.intersect( draggable, this, this.options.tolerance, event ) ) {
        dropped = this._drop.call( this, event ) || dropped;
      }

      if ( !this.options.disabled && this.visible && this.accept.call( this.element[ 0 ], ( draggable.currentItem || draggable.element ) ) ) {
        this.isout = true;
        this.isover = false;
        this._deactivate.call( this, event );
      }

    });
    return dropped;

  },
  dragStart: function( draggable, event ) {
    // Listen for scrolling so that if the dragging causes scrolling the position of the droppables can be recalculated (see #5003)
    draggable.element.parentsUntil( "body" ).bind( "scroll.droppable", function() {
      if ( !draggable.options.refreshPositions ) {
        $.ui.ddmanager.prepareOffsets( draggable, event );
      }
    });
  },
  drag: function( draggable, event ) {

    // If you have a highly dynamic page, you might try this option. It renders positions every time you move the mouse.
    if ( draggable.options.refreshPositions ) {
      $.ui.ddmanager.prepareOffsets( draggable, event );
    }

    // Run through all droppables and check their positions based on specific tolerance options
    $.each( $.ui.ddmanager.droppables[ draggable.options.scope ] || [], function() {

      if ( this.options.disabled || this.greedyChild || !this.visible ) {
        return;
      }

      var parentInstance, scope, parent,
        intersects = $.ui.intersect( draggable, this, this.options.tolerance, event ),
        c = !intersects && this.isover ? "isout" : ( intersects && !this.isover ? "isover" : null );
      if ( !c ) {
        return;
      }

      if ( this.options.greedy ) {
        // find droppable parents with same scope
        scope = this.options.scope;
        parent = this.element.parents( ":data(ui-droppable)" ).filter(function() {
          return $( this ).droppable( "instance" ).options.scope === scope;
        });

        if ( parent.length ) {
          parentInstance = $( parent[ 0 ] ).droppable( "instance" );
          parentInstance.greedyChild = ( c === "isover" );
        }
      }

      // we just moved into a greedy child
      if ( parentInstance && c === "isover" ) {
        parentInstance.isover = false;
        parentInstance.isout = true;
        parentInstance._out.call( parentInstance, event );
      }

      this[ c ] = true;
      this[c === "isout" ? "isover" : "isout"] = false;
      this[c === "isover" ? "_over" : "_out"].call( this, event );

      // we just moved out of a greedy child
      if ( parentInstance && c === "isout" ) {
        parentInstance.isout = false;
        parentInstance.isover = true;
        parentInstance._over.call( parentInstance, event );
      }
    });

  },
  dragStop: function( draggable, event ) {
    draggable.element.parentsUntil( "body" ).unbind( "scroll.droppable" );
    // Call prepareOffsets one final time since IE does not fire return scroll events when overflow was caused by drag (see #5003)
    if ( !draggable.options.refreshPositions ) {
      $.ui.ddmanager.prepareOffsets( draggable, event );
    }
  }
};

var droppable = $.ui.droppable;



}));
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvc3JjL3NjcmlwdHMvYXBwLmpzIiwicHVibGljL3NyYy9zY3JpcHRzL2ZpbGxlZC1vcmRlci5qcyIsInB1YmxpYy9zcmMvc2NyaXB0cy9nYW1lLmpzIiwicHVibGljL3NyYy9zY3JpcHRzL29yZGVyLmpzIiwicHVibGljL3NyYy9zY3JpcHRzL3N0b2NrbWFya2V0LXZpZXctbW9kZWwuanMiLCJwdWJsaWMvc3JjL3NjcmlwdHMvdmVuZG9yL2pxdWVyeS11aS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM3RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJy4vZ2FtZS5qcycpKCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIga28gPSByZXF1aXJlKCdrbm9ja291dCcpO1xuXG5mdW5jdGlvbiBGaWxsZWRPcmRlcihkYXRhKSB7XG4gIHRoaXMucGxheWVyID0ga28ub2JzZXJ2YWJsZShkYXRhLnBsYXllcik7XG4gIHRoaXMuc3ByZWFkID0ga28ub2JzZXJ2YWJsZShkYXRhLnNwcmVhZCk7XG4gIHRoaXMuc2lkZSA9ICdmaWxsZWQnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZpbGxlZE9yZGVyXG5cblxuLy9PbiBkcm9wLCBwaW5nIElEIHRvIHNlcnZlciwgb24gY29uZmlybWF0aW9uLCBzaG93IGNoYW5nZXMgbG9jYWxseSwgdGhlbiBwaW5nIG5ldyBhcnJheSB0byBzZXJ2ZXIsIHdoaWNoIGlzIHRyYW5zbWl0dGVkIGJhY2sgdG8gYm90aCIsIid1c2Ugc3RyaWN0JztcblxudmFyICQgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy4kIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC4kIDogbnVsbCk7XG52YXIga28gPSByZXF1aXJlKCdrbm9ja291dCcpO1xuXG52YXIgU3RvY2tNYXJrZXRWaWV3TW9kZWwgPSByZXF1aXJlKCcuL3N0b2NrbWFya2V0LXZpZXctbW9kZWwuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHN0b2NrTWFya2V0Vmlld01vZGVsO1xuXG4gICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIHN0b2NrTWFya2V0Vmlld01vZGVsID0gbmV3IFN0b2NrTWFya2V0Vmlld01vZGVsKCk7XG4gICAga28uYXBwbHlCaW5kaW5ncyhzdG9ja01hcmtldFZpZXdNb2RlbCk7XG4gIH0pXG59IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIga28gPSByZXF1aXJlKCdrbm9ja291dCcpO1xuXG5mdW5jdGlvbiBPcmRlcihkYXRhKSB7XG4gIHRoaXMucHJpY2UgPSBkYXRhLnByaWNlO1xuICB0aGlzLmZpeGVkID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XG4gIHRoaXMuc2lkZSA9IGRhdGEuc2lkZTtcbiAgdGhpcy5zcHJlYWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPcmRlcjsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBrbyA9IHJlcXVpcmUoJ2tub2Nrb3V0Jyk7XG52YXIgZDMgPSByZXF1aXJlKCdkMycpO1xudmFyICQgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy4kIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC4kIDogbnVsbCk7XG5yZXF1aXJlKCcuL3ZlbmRvci9qcXVlcnktdWkuanMnKTtcbnZhciBPcmRlciA9IHJlcXVpcmUoJy4vb3JkZXIuanMnKTtcbnZhciBGaWxsZWRPcmRlciA9IHJlcXVpcmUoJy4vZmlsbGVkLW9yZGVyLmpzJyk7XG5cbmZ1bmN0aW9uIFN0b2NrTWFya2V0Vmlld01vZGVsKCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgc2VsZi5vcmRlcnMgPSBrby5vYnNlcnZhYmxlQXJyYXkoW10pO1xuICBzZWxmLmNhc2ggPSBrby5vYnNlcnZhYmxlKDApO1xuXG4gIHNlbGYuYWRkT3JkZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbmV3T3JkZXIgPSBnZW5lcmF0ZU9yZGVyKCk7XG4gICAgc2VsZi5vcmRlcnMucHVzaChuZXdPcmRlcik7XG4gIH1cblxuICBmdW5jdGlvbiBnZW5lcmF0ZU9yZGVyKCkge1xuICAgIHZhciBwcmljZU1lYW4gPSAxOS4wMjtcbiAgICB2YXIgcHJpY2VTdGRldiA9IDQ7XG5cbiAgICB2YXIgc2lkZSA9IE1hdGgucmFuZG9tKCkgPCAwLjUgPyAnYmlkJyA6ICdhc2snO1xuICAgIHZhciBwcmljZSA9IGQzLnJhbmRvbS5ub3JtYWwocHJpY2VNZWFuLCBwcmljZVN0ZGV2KSgpLnRvRml4ZWQoMik7XG5cbiAgICByZXR1cm4gbmV3IE9yZGVyKHtwcmljZTogcHJpY2UsIHNpZGU6IHNpZGV9KVxuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlU3ByZWFkKGRyYWcsIGRyb3ApIHtcbiAgICB2YXIgc3ByZWFkID0ga28uZGF0YUZvcihkcm9wKS5wcmljZSAtIGtvLmRhdGFGb3IoZHJhZykucHJpY2U7XG4gICAga28uZGF0YUZvcihkcmFnKS5zcHJlYWQocGFyc2VGbG9hdChzcHJlYWQudG9GaXhlZCgyKSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlQ2FzaCgpIHtcblxuICAgIHZhciBjYXNoID0gc2VsZi5vcmRlcnMoKS5maWx0ZXIoZnVuY3Rpb24ob3JkZXIpIHtcbiAgICAgIHJldHVybiBvcmRlci5zaWRlID09PSAnZmlsbGVkJztcbiAgICB9KS5tYXAoZnVuY3Rpb24ob3JkZXIpIHtcbiAgICAgIHJldHVybiBwYXJzZUZsb2F0KG9yZGVyLnNwcmVhZCgpKTtcbiAgICB9KS5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3Vycikge1xuICAgICAgcmV0dXJuIHByZXYgKyBjdXJyO1xuICAgIH0pO1xuXG4gICAgc2VsZi5jYXNoKGNhc2gudG9GaXhlZCgyKSk7XG4gIH1cblxuICBrby5iaW5kaW5nSGFuZGxlcnMuZHJhZ2Ryb3AgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3MsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpIHtcblxuICAgICAgdmFyIG9yZGVyRWwgPSAkKGVsZW1lbnQpO1xuXG4gICAgICB2YXIgZHJhZ0NvbmZpZyA9IHtcbiAgICAgICAgcmV2ZXJ0OiBcImludmFsaWRcIixcbiAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgc25hcDogXCIudWktZHJvcHBhYmxlXCIsXG4gICAgICAgIHNuYXBNb2RlOiBcImlubmVyXCJcbiAgICAgIH07XG5cbiAgICAgIHZhciBkcm9wQ29uZmlnID0ge1xuICAgICAgICBvdmVyOiBmdW5jdGlvbihldmVudCwgdWkpIHtcbiAgICAgICAgICB2YXIgZHJhZ0VsID0gdWkuZHJhZ2dhYmxlWzBdO1xuICAgICAgICAgIHZhciBkcm9wRWwgPSBldmVudC50YXJnZXRcblxuICAgICAgICAgIHVwZGF0ZVNwcmVhZChkcmFnRWwsIGRyb3BFbClcbiAgICAgICAgfSxcbiAgICAgICAgb3V0OiBmdW5jdGlvbihldmVudCwgdWkpIHtcbiAgICAgICAgICBrby5kYXRhRm9yKHVpLmRyYWdnYWJsZVswXSkuc3ByZWFkKGZhbHNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZHJvcDogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG4gICAgICAgICAgdmFyIGRyYWdEYXRhID0ga28uZGF0YUZvcih1aS5kcmFnZ2FibGVbMF0pO1xuICAgICAgICAgIHZhciBkcm9wRGF0YSA9IGtvLmRhdGFGb3IoZXZlbnQudGFyZ2V0KTtcblxuXG4gICAgICAgICAgdmFyIGRyYWdJbmRleCA9IHNlbGYub3JkZXJzLmluZGV4T2YoZHJhZ0RhdGEpO1xuICAgICAgICAgIHZhciBkcm9wSW5kZXggPSBzZWxmLm9yZGVycy5pbmRleE9mKGRyb3BEYXRhKTsgICBcblxuICAgICAgICAgIHZhciBmaWxsZWRPcmRlciA9IG5ldyBGaWxsZWRPcmRlcih7c3ByZWFkOiBkcmFnRGF0YS5zcHJlYWQoKX0pXG5cbiAgICAgICAgICBzZWxmLm9yZGVycygpW2Ryb3BJbmRleF0gPSBmaWxsZWRPcmRlcjtcbiAgICAgICAgICBzZWxmLm9yZGVycy5zcGxpY2UoZHJhZ0luZGV4LCAxKTtcblxuICAgICAgICAgIHVwZGF0ZUNhc2goKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdmlld01vZGVsLnNpZGUgPT09ICdhc2snID8gb3JkZXJFbC5kcmFnZ2FibGUoZHJhZ0NvbmZpZykgOiBvcmRlckVsLmRyb3BwYWJsZShkcm9wQ29uZmlnKTtcblxuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0b2NrTWFya2V0Vmlld01vZGVsOyIsIi8qISBqUXVlcnkgVUkgLSB2MS4xMS4zIC0gMjAxNS0wMi0yNVxuKiBodHRwOi8vanF1ZXJ5dWkuY29tXG4qIEluY2x1ZGVzOiBjb3JlLmpzLCB3aWRnZXQuanMsIG1vdXNlLmpzLCBkcmFnZ2FibGUuanMsIGRyb3BwYWJsZS5qc1xuKiBDb3B5cmlnaHQgMjAxNSBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzOyBMaWNlbnNlZCBNSVQgKi9cblxuKGZ1bmN0aW9uKCBmYWN0b3J5ICkge1xuICBpZiAoIHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kICkge1xuXG4gICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgIGRlZmluZShbIFwianF1ZXJ5XCIgXSwgZmFjdG9yeSApO1xuICB9IGVsc2Uge1xuXG4gICAgLy8gQnJvd3NlciBnbG9iYWxzXG4gICAgZmFjdG9yeSggalF1ZXJ5ICk7XG4gIH1cbn0oZnVuY3Rpb24oICQgKSB7XG4vKiFcbiAqIGpRdWVyeSBVSSBDb3JlIDEuMTEuM1xuICogaHR0cDovL2pxdWVyeXVpLmNvbVxuICpcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiBodHRwOi8vanF1ZXJ5Lm9yZy9saWNlbnNlXG4gKlxuICogaHR0cDovL2FwaS5qcXVlcnl1aS5jb20vY2F0ZWdvcnkvdWktY29yZS9cbiAqL1xuXG5cbi8vICQudWkgbWlnaHQgZXhpc3QgZnJvbSBjb21wb25lbnRzIHdpdGggbm8gZGVwZW5kZW5jaWVzLCBlLmcuLCAkLnVpLnBvc2l0aW9uXG4kLnVpID0gJC51aSB8fCB7fTtcblxuJC5leHRlbmQoICQudWksIHtcbiAgdmVyc2lvbjogXCIxLjExLjNcIixcblxuICBrZXlDb2RlOiB7XG4gICAgQkFDS1NQQUNFOiA4LFxuICAgIENPTU1BOiAxODgsXG4gICAgREVMRVRFOiA0NixcbiAgICBET1dOOiA0MCxcbiAgICBFTkQ6IDM1LFxuICAgIEVOVEVSOiAxMyxcbiAgICBFU0NBUEU6IDI3LFxuICAgIEhPTUU6IDM2LFxuICAgIExFRlQ6IDM3LFxuICAgIFBBR0VfRE9XTjogMzQsXG4gICAgUEFHRV9VUDogMzMsXG4gICAgUEVSSU9EOiAxOTAsXG4gICAgUklHSFQ6IDM5LFxuICAgIFNQQUNFOiAzMixcbiAgICBUQUI6IDksXG4gICAgVVA6IDM4XG4gIH1cbn0pO1xuXG4vLyBwbHVnaW5zXG4kLmZuLmV4dGVuZCh7XG4gIHNjcm9sbFBhcmVudDogZnVuY3Rpb24oIGluY2x1ZGVIaWRkZW4gKSB7XG4gICAgdmFyIHBvc2l0aW9uID0gdGhpcy5jc3MoIFwicG9zaXRpb25cIiApLFxuICAgICAgZXhjbHVkZVN0YXRpY1BhcmVudCA9IHBvc2l0aW9uID09PSBcImFic29sdXRlXCIsXG4gICAgICBvdmVyZmxvd1JlZ2V4ID0gaW5jbHVkZUhpZGRlbiA/IC8oYXV0b3xzY3JvbGx8aGlkZGVuKS8gOiAvKGF1dG98c2Nyb2xsKS8sXG4gICAgICBzY3JvbGxQYXJlbnQgPSB0aGlzLnBhcmVudHMoKS5maWx0ZXIoIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcGFyZW50ID0gJCggdGhpcyApO1xuICAgICAgICBpZiAoIGV4Y2x1ZGVTdGF0aWNQYXJlbnQgJiYgcGFyZW50LmNzcyggXCJwb3NpdGlvblwiICkgPT09IFwic3RhdGljXCIgKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdmVyZmxvd1JlZ2V4LnRlc3QoIHBhcmVudC5jc3MoIFwib3ZlcmZsb3dcIiApICsgcGFyZW50LmNzcyggXCJvdmVyZmxvdy15XCIgKSArIHBhcmVudC5jc3MoIFwib3ZlcmZsb3cteFwiICkgKTtcbiAgICAgIH0pLmVxKCAwICk7XG5cbiAgICByZXR1cm4gcG9zaXRpb24gPT09IFwiZml4ZWRcIiB8fCAhc2Nyb2xsUGFyZW50Lmxlbmd0aCA/ICQoIHRoaXNbIDAgXS5vd25lckRvY3VtZW50IHx8IGRvY3VtZW50ICkgOiBzY3JvbGxQYXJlbnQ7XG4gIH0sXG5cbiAgdW5pcXVlSWQ6IChmdW5jdGlvbigpIHtcbiAgICB2YXIgdXVpZCA9IDA7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoICF0aGlzLmlkICkge1xuICAgICAgICAgIHRoaXMuaWQgPSBcInVpLWlkLVwiICsgKCArK3V1aWQgKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcbiAgfSkoKSxcblxuICByZW1vdmVVbmlxdWVJZDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIGlmICggL151aS1pZC1cXGQrJC8udGVzdCggdGhpcy5pZCApICkge1xuICAgICAgICAkKCB0aGlzICkucmVtb3ZlQXR0ciggXCJpZFwiICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuXG4vLyBzZWxlY3RvcnNcbmZ1bmN0aW9uIGZvY3VzYWJsZSggZWxlbWVudCwgaXNUYWJJbmRleE5vdE5hTiApIHtcbiAgdmFyIG1hcCwgbWFwTmFtZSwgaW1nLFxuICAgIG5vZGVOYW1lID0gZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoIFwiYXJlYVwiID09PSBub2RlTmFtZSApIHtcbiAgICBtYXAgPSBlbGVtZW50LnBhcmVudE5vZGU7XG4gICAgbWFwTmFtZSA9IG1hcC5uYW1lO1xuICAgIGlmICggIWVsZW1lbnQuaHJlZiB8fCAhbWFwTmFtZSB8fCBtYXAubm9kZU5hbWUudG9Mb3dlckNhc2UoKSAhPT0gXCJtYXBcIiApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaW1nID0gJCggXCJpbWdbdXNlbWFwPScjXCIgKyBtYXBOYW1lICsgXCInXVwiIClbIDAgXTtcbiAgICByZXR1cm4gISFpbWcgJiYgdmlzaWJsZSggaW1nICk7XG4gIH1cbiAgcmV0dXJuICggL14oaW5wdXR8c2VsZWN0fHRleHRhcmVhfGJ1dHRvbnxvYmplY3QpJC8udGVzdCggbm9kZU5hbWUgKSA/XG4gICAgIWVsZW1lbnQuZGlzYWJsZWQgOlxuICAgIFwiYVwiID09PSBub2RlTmFtZSA/XG4gICAgICBlbGVtZW50LmhyZWYgfHwgaXNUYWJJbmRleE5vdE5hTiA6XG4gICAgICBpc1RhYkluZGV4Tm90TmFOKSAmJlxuICAgIC8vIHRoZSBlbGVtZW50IGFuZCBhbGwgb2YgaXRzIGFuY2VzdG9ycyBtdXN0IGJlIHZpc2libGVcbiAgICB2aXNpYmxlKCBlbGVtZW50ICk7XG59XG5cbmZ1bmN0aW9uIHZpc2libGUoIGVsZW1lbnQgKSB7XG4gIHJldHVybiAkLmV4cHIuZmlsdGVycy52aXNpYmxlKCBlbGVtZW50ICkgJiZcbiAgICAhJCggZWxlbWVudCApLnBhcmVudHMoKS5hZGRCYWNrKCkuZmlsdGVyKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICQuY3NzKCB0aGlzLCBcInZpc2liaWxpdHlcIiApID09PSBcImhpZGRlblwiO1xuICAgIH0pLmxlbmd0aDtcbn1cblxuJC5leHRlbmQoICQuZXhwclsgXCI6XCIgXSwge1xuICBkYXRhOiAkLmV4cHIuY3JlYXRlUHNldWRvID9cbiAgICAkLmV4cHIuY3JlYXRlUHNldWRvKGZ1bmN0aW9uKCBkYXRhTmFtZSApIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiggZWxlbSApIHtcbiAgICAgICAgcmV0dXJuICEhJC5kYXRhKCBlbGVtLCBkYXRhTmFtZSApO1xuICAgICAgfTtcbiAgICB9KSA6XG4gICAgLy8gc3VwcG9ydDogalF1ZXJ5IDwxLjhcbiAgICBmdW5jdGlvbiggZWxlbSwgaSwgbWF0Y2ggKSB7XG4gICAgICByZXR1cm4gISEkLmRhdGEoIGVsZW0sIG1hdGNoWyAzIF0gKTtcbiAgICB9LFxuXG4gIGZvY3VzYWJsZTogZnVuY3Rpb24oIGVsZW1lbnQgKSB7XG4gICAgcmV0dXJuIGZvY3VzYWJsZSggZWxlbWVudCwgIWlzTmFOKCAkLmF0dHIoIGVsZW1lbnQsIFwidGFiaW5kZXhcIiApICkgKTtcbiAgfSxcblxuICB0YWJiYWJsZTogZnVuY3Rpb24oIGVsZW1lbnQgKSB7XG4gICAgdmFyIHRhYkluZGV4ID0gJC5hdHRyKCBlbGVtZW50LCBcInRhYmluZGV4XCIgKSxcbiAgICAgIGlzVGFiSW5kZXhOYU4gPSBpc05hTiggdGFiSW5kZXggKTtcbiAgICByZXR1cm4gKCBpc1RhYkluZGV4TmFOIHx8IHRhYkluZGV4ID49IDAgKSAmJiBmb2N1c2FibGUoIGVsZW1lbnQsICFpc1RhYkluZGV4TmFOICk7XG4gIH1cbn0pO1xuXG4vLyBzdXBwb3J0OiBqUXVlcnkgPDEuOFxuaWYgKCAhJCggXCI8YT5cIiApLm91dGVyV2lkdGgoIDEgKS5qcXVlcnkgKSB7XG4gICQuZWFjaCggWyBcIldpZHRoXCIsIFwiSGVpZ2h0XCIgXSwgZnVuY3Rpb24oIGksIG5hbWUgKSB7XG4gICAgdmFyIHNpZGUgPSBuYW1lID09PSBcIldpZHRoXCIgPyBbIFwiTGVmdFwiLCBcIlJpZ2h0XCIgXSA6IFsgXCJUb3BcIiwgXCJCb3R0b21cIiBdLFxuICAgICAgdHlwZSA9IG5hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgIG9yaWcgPSB7XG4gICAgICAgIGlubmVyV2lkdGg6ICQuZm4uaW5uZXJXaWR0aCxcbiAgICAgICAgaW5uZXJIZWlnaHQ6ICQuZm4uaW5uZXJIZWlnaHQsXG4gICAgICAgIG91dGVyV2lkdGg6ICQuZm4ub3V0ZXJXaWR0aCxcbiAgICAgICAgb3V0ZXJIZWlnaHQ6ICQuZm4ub3V0ZXJIZWlnaHRcbiAgICAgIH07XG5cbiAgICBmdW5jdGlvbiByZWR1Y2UoIGVsZW0sIHNpemUsIGJvcmRlciwgbWFyZ2luICkge1xuICAgICAgJC5lYWNoKCBzaWRlLCBmdW5jdGlvbigpIHtcbiAgICAgICAgc2l6ZSAtPSBwYXJzZUZsb2F0KCAkLmNzcyggZWxlbSwgXCJwYWRkaW5nXCIgKyB0aGlzICkgKSB8fCAwO1xuICAgICAgICBpZiAoIGJvcmRlciApIHtcbiAgICAgICAgICBzaXplIC09IHBhcnNlRmxvYXQoICQuY3NzKCBlbGVtLCBcImJvcmRlclwiICsgdGhpcyArIFwiV2lkdGhcIiApICkgfHwgMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIG1hcmdpbiApIHtcbiAgICAgICAgICBzaXplIC09IHBhcnNlRmxvYXQoICQuY3NzKCBlbGVtLCBcIm1hcmdpblwiICsgdGhpcyApICkgfHwgMDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gc2l6ZTtcbiAgICB9XG5cbiAgICAkLmZuWyBcImlubmVyXCIgKyBuYW1lIF0gPSBmdW5jdGlvbiggc2l6ZSApIHtcbiAgICAgIGlmICggc2l6ZSA9PT0gdW5kZWZpbmVkICkge1xuICAgICAgICByZXR1cm4gb3JpZ1sgXCJpbm5lclwiICsgbmFtZSBdLmNhbGwoIHRoaXMgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgJCggdGhpcyApLmNzcyggdHlwZSwgcmVkdWNlKCB0aGlzLCBzaXplICkgKyBcInB4XCIgKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkLmZuWyBcIm91dGVyXCIgKyBuYW1lXSA9IGZ1bmN0aW9uKCBzaXplLCBtYXJnaW4gKSB7XG4gICAgICBpZiAoIHR5cGVvZiBzaXplICE9PSBcIm51bWJlclwiICkge1xuICAgICAgICByZXR1cm4gb3JpZ1sgXCJvdXRlclwiICsgbmFtZSBdLmNhbGwoIHRoaXMsIHNpemUgKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgJCggdGhpcykuY3NzKCB0eXBlLCByZWR1Y2UoIHRoaXMsIHNpemUsIHRydWUsIG1hcmdpbiApICsgXCJweFwiICk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9KTtcbn1cblxuLy8gc3VwcG9ydDogalF1ZXJ5IDwxLjhcbmlmICggISQuZm4uYWRkQmFjayApIHtcbiAgJC5mbi5hZGRCYWNrID0gZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuICAgIHJldHVybiB0aGlzLmFkZCggc2VsZWN0b3IgPT0gbnVsbCA/XG4gICAgICB0aGlzLnByZXZPYmplY3QgOiB0aGlzLnByZXZPYmplY3QuZmlsdGVyKCBzZWxlY3RvciApXG4gICAgKTtcbiAgfTtcbn1cblxuLy8gc3VwcG9ydDogalF1ZXJ5IDEuNi4xLCAxLjYuMiAoaHR0cDovL2J1Z3MuanF1ZXJ5LmNvbS90aWNrZXQvOTQxMylcbmlmICggJCggXCI8YT5cIiApLmRhdGEoIFwiYS1iXCIsIFwiYVwiICkucmVtb3ZlRGF0YSggXCJhLWJcIiApLmRhdGEoIFwiYS1iXCIgKSApIHtcbiAgJC5mbi5yZW1vdmVEYXRhID0gKGZ1bmN0aW9uKCByZW1vdmVEYXRhICkge1xuICAgIHJldHVybiBmdW5jdGlvbigga2V5ICkge1xuICAgICAgaWYgKCBhcmd1bWVudHMubGVuZ3RoICkge1xuICAgICAgICByZXR1cm4gcmVtb3ZlRGF0YS5jYWxsKCB0aGlzLCAkLmNhbWVsQ2FzZSgga2V5ICkgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZW1vdmVEYXRhLmNhbGwoIHRoaXMgKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KSggJC5mbi5yZW1vdmVEYXRhICk7XG59XG5cbi8vIGRlcHJlY2F0ZWRcbiQudWkuaWUgPSAhIS9tc2llIFtcXHcuXSsvLmV4ZWMoIG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSApO1xuXG4kLmZuLmV4dGVuZCh7XG4gIGZvY3VzOiAoZnVuY3Rpb24oIG9yaWcgKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCBkZWxheSwgZm4gKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIGRlbGF5ID09PSBcIm51bWJlclwiID9cbiAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBlbGVtID0gdGhpcztcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCggZWxlbSApLmZvY3VzKCk7XG4gICAgICAgICAgICBpZiAoIGZuICkge1xuICAgICAgICAgICAgICBmbi5jYWxsKCBlbGVtICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgZGVsYXkgKTtcbiAgICAgICAgfSkgOlxuICAgICAgICBvcmlnLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgICB9O1xuICB9KSggJC5mbi5mb2N1cyApLFxuXG4gIGRpc2FibGVTZWxlY3Rpb246IChmdW5jdGlvbigpIHtcbiAgICB2YXIgZXZlbnRUeXBlID0gXCJvbnNlbGVjdHN0YXJ0XCIgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApID9cbiAgICAgIFwic2VsZWN0c3RhcnRcIiA6XG4gICAgICBcIm1vdXNlZG93blwiO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuYmluZCggZXZlbnRUeXBlICsgXCIudWktZGlzYWJsZVNlbGVjdGlvblwiLCBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9KSgpLFxuXG4gIGVuYWJsZVNlbGVjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudW5iaW5kKCBcIi51aS1kaXNhYmxlU2VsZWN0aW9uXCIgKTtcbiAgfSxcblxuICB6SW5kZXg6IGZ1bmN0aW9uKCB6SW5kZXggKSB7XG4gICAgaWYgKCB6SW5kZXggIT09IHVuZGVmaW5lZCApIHtcbiAgICAgIHJldHVybiB0aGlzLmNzcyggXCJ6SW5kZXhcIiwgekluZGV4ICk7XG4gICAgfVxuXG4gICAgaWYgKCB0aGlzLmxlbmd0aCApIHtcbiAgICAgIHZhciBlbGVtID0gJCggdGhpc1sgMCBdICksIHBvc2l0aW9uLCB2YWx1ZTtcbiAgICAgIHdoaWxlICggZWxlbS5sZW5ndGggJiYgZWxlbVsgMCBdICE9PSBkb2N1bWVudCApIHtcbiAgICAgICAgLy8gSWdub3JlIHotaW5kZXggaWYgcG9zaXRpb24gaXMgc2V0IHRvIGEgdmFsdWUgd2hlcmUgei1pbmRleCBpcyBpZ25vcmVkIGJ5IHRoZSBicm93c2VyXG4gICAgICAgIC8vIFRoaXMgbWFrZXMgYmVoYXZpb3Igb2YgdGhpcyBmdW5jdGlvbiBjb25zaXN0ZW50IGFjcm9zcyBicm93c2Vyc1xuICAgICAgICAvLyBXZWJLaXQgYWx3YXlzIHJldHVybnMgYXV0byBpZiB0aGUgZWxlbWVudCBpcyBwb3NpdGlvbmVkXG4gICAgICAgIHBvc2l0aW9uID0gZWxlbS5jc3MoIFwicG9zaXRpb25cIiApO1xuICAgICAgICBpZiAoIHBvc2l0aW9uID09PSBcImFic29sdXRlXCIgfHwgcG9zaXRpb24gPT09IFwicmVsYXRpdmVcIiB8fCBwb3NpdGlvbiA9PT0gXCJmaXhlZFwiICkge1xuICAgICAgICAgIC8vIElFIHJldHVybnMgMCB3aGVuIHpJbmRleCBpcyBub3Qgc3BlY2lmaWVkXG4gICAgICAgICAgLy8gb3RoZXIgYnJvd3NlcnMgcmV0dXJuIGEgc3RyaW5nXG4gICAgICAgICAgLy8gd2UgaWdub3JlIHRoZSBjYXNlIG9mIG5lc3RlZCBlbGVtZW50cyB3aXRoIGFuIGV4cGxpY2l0IHZhbHVlIG9mIDBcbiAgICAgICAgICAvLyA8ZGl2IHN0eWxlPVwiei1pbmRleDogLTEwO1wiPjxkaXYgc3R5bGU9XCJ6LWluZGV4OiAwO1wiPjwvZGl2PjwvZGl2PlxuICAgICAgICAgIHZhbHVlID0gcGFyc2VJbnQoIGVsZW0uY3NzKCBcInpJbmRleFwiICksIDEwICk7XG4gICAgICAgICAgaWYgKCAhaXNOYU4oIHZhbHVlICkgJiYgdmFsdWUgIT09IDAgKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsZW0gPSBlbGVtLnBhcmVudCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG59KTtcblxuLy8gJC51aS5wbHVnaW4gaXMgZGVwcmVjYXRlZC4gVXNlICQud2lkZ2V0KCkgZXh0ZW5zaW9ucyBpbnN0ZWFkLlxuJC51aS5wbHVnaW4gPSB7XG4gIGFkZDogZnVuY3Rpb24oIG1vZHVsZSwgb3B0aW9uLCBzZXQgKSB7XG4gICAgdmFyIGksXG4gICAgICBwcm90byA9ICQudWlbIG1vZHVsZSBdLnByb3RvdHlwZTtcbiAgICBmb3IgKCBpIGluIHNldCApIHtcbiAgICAgIHByb3RvLnBsdWdpbnNbIGkgXSA9IHByb3RvLnBsdWdpbnNbIGkgXSB8fCBbXTtcbiAgICAgIHByb3RvLnBsdWdpbnNbIGkgXS5wdXNoKCBbIG9wdGlvbiwgc2V0WyBpIF0gXSApO1xuICAgIH1cbiAgfSxcbiAgY2FsbDogZnVuY3Rpb24oIGluc3RhbmNlLCBuYW1lLCBhcmdzLCBhbGxvd0Rpc2Nvbm5lY3RlZCApIHtcbiAgICB2YXIgaSxcbiAgICAgIHNldCA9IGluc3RhbmNlLnBsdWdpbnNbIG5hbWUgXTtcblxuICAgIGlmICggIXNldCApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoICFhbGxvd0Rpc2Nvbm5lY3RlZCAmJiAoICFpbnN0YW5jZS5lbGVtZW50WyAwIF0ucGFyZW50Tm9kZSB8fCBpbnN0YW5jZS5lbGVtZW50WyAwIF0ucGFyZW50Tm9kZS5ub2RlVHlwZSA9PT0gMTEgKSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKCBpID0gMDsgaSA8IHNldC5sZW5ndGg7IGkrKyApIHtcbiAgICAgIGlmICggaW5zdGFuY2Uub3B0aW9uc1sgc2V0WyBpIF1bIDAgXSBdICkge1xuICAgICAgICBzZXRbIGkgXVsgMSBdLmFwcGx5KCBpbnN0YW5jZS5lbGVtZW50LCBhcmdzICk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5cbi8qIVxuICogalF1ZXJ5IFVJIFdpZGdldCAxLjExLjNcbiAqIGh0dHA6Ly9qcXVlcnl1aS5jb21cbiAqXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9yc1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogaHR0cDovL2pxdWVyeS5vcmcvbGljZW5zZVxuICpcbiAqIGh0dHA6Ly9hcGkuanF1ZXJ5dWkuY29tL2pRdWVyeS53aWRnZXQvXG4gKi9cblxuXG52YXIgd2lkZ2V0X3V1aWQgPSAwLFxuICB3aWRnZXRfc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbiQuY2xlYW5EYXRhID0gKGZ1bmN0aW9uKCBvcmlnICkge1xuICByZXR1cm4gZnVuY3Rpb24oIGVsZW1zICkge1xuICAgIHZhciBldmVudHMsIGVsZW0sIGk7XG4gICAgZm9yICggaSA9IDA7IChlbGVtID0gZWxlbXNbaV0pICE9IG51bGw7IGkrKyApIHtcbiAgICAgIHRyeSB7XG5cbiAgICAgICAgLy8gT25seSB0cmlnZ2VyIHJlbW92ZSB3aGVuIG5lY2Vzc2FyeSB0byBzYXZlIHRpbWVcbiAgICAgICAgZXZlbnRzID0gJC5fZGF0YSggZWxlbSwgXCJldmVudHNcIiApO1xuICAgICAgICBpZiAoIGV2ZW50cyAmJiBldmVudHMucmVtb3ZlICkge1xuICAgICAgICAgICQoIGVsZW0gKS50cmlnZ2VySGFuZGxlciggXCJyZW1vdmVcIiApO1xuICAgICAgICB9XG5cbiAgICAgIC8vIGh0dHA6Ly9idWdzLmpxdWVyeS5jb20vdGlja2V0LzgyMzVcbiAgICAgIH0gY2F0Y2ggKCBlICkge31cbiAgICB9XG4gICAgb3JpZyggZWxlbXMgKTtcbiAgfTtcbn0pKCAkLmNsZWFuRGF0YSApO1xuXG4kLndpZGdldCA9IGZ1bmN0aW9uKCBuYW1lLCBiYXNlLCBwcm90b3R5cGUgKSB7XG4gIHZhciBmdWxsTmFtZSwgZXhpc3RpbmdDb25zdHJ1Y3RvciwgY29uc3RydWN0b3IsIGJhc2VQcm90b3R5cGUsXG4gICAgLy8gcHJveGllZFByb3RvdHlwZSBhbGxvd3MgdGhlIHByb3ZpZGVkIHByb3RvdHlwZSB0byByZW1haW4gdW5tb2RpZmllZFxuICAgIC8vIHNvIHRoYXQgaXQgY2FuIGJlIHVzZWQgYXMgYSBtaXhpbiBmb3IgbXVsdGlwbGUgd2lkZ2V0cyAoIzg4NzYpXG4gICAgcHJveGllZFByb3RvdHlwZSA9IHt9LFxuICAgIG5hbWVzcGFjZSA9IG5hbWUuc3BsaXQoIFwiLlwiIClbIDAgXTtcblxuICBuYW1lID0gbmFtZS5zcGxpdCggXCIuXCIgKVsgMSBdO1xuICBmdWxsTmFtZSA9IG5hbWVzcGFjZSArIFwiLVwiICsgbmFtZTtcblxuICBpZiAoICFwcm90b3R5cGUgKSB7XG4gICAgcHJvdG90eXBlID0gYmFzZTtcbiAgICBiYXNlID0gJC5XaWRnZXQ7XG4gIH1cblxuICAvLyBjcmVhdGUgc2VsZWN0b3IgZm9yIHBsdWdpblxuICAkLmV4cHJbIFwiOlwiIF1bIGZ1bGxOYW1lLnRvTG93ZXJDYXNlKCkgXSA9IGZ1bmN0aW9uKCBlbGVtICkge1xuICAgIHJldHVybiAhISQuZGF0YSggZWxlbSwgZnVsbE5hbWUgKTtcbiAgfTtcblxuICAkWyBuYW1lc3BhY2UgXSA9ICRbIG5hbWVzcGFjZSBdIHx8IHt9O1xuICBleGlzdGluZ0NvbnN0cnVjdG9yID0gJFsgbmFtZXNwYWNlIF1bIG5hbWUgXTtcbiAgY29uc3RydWN0b3IgPSAkWyBuYW1lc3BhY2UgXVsgbmFtZSBdID0gZnVuY3Rpb24oIG9wdGlvbnMsIGVsZW1lbnQgKSB7XG4gICAgLy8gYWxsb3cgaW5zdGFudGlhdGlvbiB3aXRob3V0IFwibmV3XCIga2V5d29yZFxuICAgIGlmICggIXRoaXMuX2NyZWF0ZVdpZGdldCApIHtcbiAgICAgIHJldHVybiBuZXcgY29uc3RydWN0b3IoIG9wdGlvbnMsIGVsZW1lbnQgKTtcbiAgICB9XG5cbiAgICAvLyBhbGxvdyBpbnN0YW50aWF0aW9uIHdpdGhvdXQgaW5pdGlhbGl6aW5nIGZvciBzaW1wbGUgaW5oZXJpdGFuY2VcbiAgICAvLyBtdXN0IHVzZSBcIm5ld1wiIGtleXdvcmQgKHRoZSBjb2RlIGFib3ZlIGFsd2F5cyBwYXNzZXMgYXJncylcbiAgICBpZiAoIGFyZ3VtZW50cy5sZW5ndGggKSB7XG4gICAgICB0aGlzLl9jcmVhdGVXaWRnZXQoIG9wdGlvbnMsIGVsZW1lbnQgKTtcbiAgICB9XG4gIH07XG4gIC8vIGV4dGVuZCB3aXRoIHRoZSBleGlzdGluZyBjb25zdHJ1Y3RvciB0byBjYXJyeSBvdmVyIGFueSBzdGF0aWMgcHJvcGVydGllc1xuICAkLmV4dGVuZCggY29uc3RydWN0b3IsIGV4aXN0aW5nQ29uc3RydWN0b3IsIHtcbiAgICB2ZXJzaW9uOiBwcm90b3R5cGUudmVyc2lvbixcbiAgICAvLyBjb3B5IHRoZSBvYmplY3QgdXNlZCB0byBjcmVhdGUgdGhlIHByb3RvdHlwZSBpbiBjYXNlIHdlIG5lZWQgdG9cbiAgICAvLyByZWRlZmluZSB0aGUgd2lkZ2V0IGxhdGVyXG4gICAgX3Byb3RvOiAkLmV4dGVuZCgge30sIHByb3RvdHlwZSApLFxuICAgIC8vIHRyYWNrIHdpZGdldHMgdGhhdCBpbmhlcml0IGZyb20gdGhpcyB3aWRnZXQgaW4gY2FzZSB0aGlzIHdpZGdldCBpc1xuICAgIC8vIHJlZGVmaW5lZCBhZnRlciBhIHdpZGdldCBpbmhlcml0cyBmcm9tIGl0XG4gICAgX2NoaWxkQ29uc3RydWN0b3JzOiBbXVxuICB9KTtcblxuICBiYXNlUHJvdG90eXBlID0gbmV3IGJhc2UoKTtcbiAgLy8gd2UgbmVlZCB0byBtYWtlIHRoZSBvcHRpb25zIGhhc2ggYSBwcm9wZXJ0eSBkaXJlY3RseSBvbiB0aGUgbmV3IGluc3RhbmNlXG4gIC8vIG90aGVyd2lzZSB3ZSdsbCBtb2RpZnkgdGhlIG9wdGlvbnMgaGFzaCBvbiB0aGUgcHJvdG90eXBlIHRoYXQgd2UncmVcbiAgLy8gaW5oZXJpdGluZyBmcm9tXG4gIGJhc2VQcm90b3R5cGUub3B0aW9ucyA9ICQud2lkZ2V0LmV4dGVuZCgge30sIGJhc2VQcm90b3R5cGUub3B0aW9ucyApO1xuICAkLmVhY2goIHByb3RvdHlwZSwgZnVuY3Rpb24oIHByb3AsIHZhbHVlICkge1xuICAgIGlmICggISQuaXNGdW5jdGlvbiggdmFsdWUgKSApIHtcbiAgICAgIHByb3hpZWRQcm90b3R5cGVbIHByb3AgXSA9IHZhbHVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBwcm94aWVkUHJvdG90eXBlWyBwcm9wIF0gPSAoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgX3N1cGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGJhc2UucHJvdG90eXBlWyBwcm9wIF0uYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgICAgICB9LFxuICAgICAgICBfc3VwZXJBcHBseSA9IGZ1bmN0aW9uKCBhcmdzICkge1xuICAgICAgICAgIHJldHVybiBiYXNlLnByb3RvdHlwZVsgcHJvcCBdLmFwcGx5KCB0aGlzLCBhcmdzICk7XG4gICAgICAgIH07XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBfX3N1cGVyID0gdGhpcy5fc3VwZXIsXG4gICAgICAgICAgX19zdXBlckFwcGx5ID0gdGhpcy5fc3VwZXJBcHBseSxcbiAgICAgICAgICByZXR1cm5WYWx1ZTtcblxuICAgICAgICB0aGlzLl9zdXBlciA9IF9zdXBlcjtcbiAgICAgICAgdGhpcy5fc3VwZXJBcHBseSA9IF9zdXBlckFwcGx5O1xuXG4gICAgICAgIHJldHVyblZhbHVlID0gdmFsdWUuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuXG4gICAgICAgIHRoaXMuX3N1cGVyID0gX19zdXBlcjtcbiAgICAgICAgdGhpcy5fc3VwZXJBcHBseSA9IF9fc3VwZXJBcHBseTtcblxuICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gICAgICB9O1xuICAgIH0pKCk7XG4gIH0pO1xuICBjb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSAkLndpZGdldC5leHRlbmQoIGJhc2VQcm90b3R5cGUsIHtcbiAgICAvLyBUT0RPOiByZW1vdmUgc3VwcG9ydCBmb3Igd2lkZ2V0RXZlbnRQcmVmaXhcbiAgICAvLyBhbHdheXMgdXNlIHRoZSBuYW1lICsgYSBjb2xvbiBhcyB0aGUgcHJlZml4LCBlLmcuLCBkcmFnZ2FibGU6c3RhcnRcbiAgICAvLyBkb24ndCBwcmVmaXggZm9yIHdpZGdldHMgdGhhdCBhcmVuJ3QgRE9NLWJhc2VkXG4gICAgd2lkZ2V0RXZlbnRQcmVmaXg6IGV4aXN0aW5nQ29uc3RydWN0b3IgPyAoYmFzZVByb3RvdHlwZS53aWRnZXRFdmVudFByZWZpeCB8fCBuYW1lKSA6IG5hbWVcbiAgfSwgcHJveGllZFByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiBjb25zdHJ1Y3RvcixcbiAgICBuYW1lc3BhY2U6IG5hbWVzcGFjZSxcbiAgICB3aWRnZXROYW1lOiBuYW1lLFxuICAgIHdpZGdldEZ1bGxOYW1lOiBmdWxsTmFtZVxuICB9KTtcblxuICAvLyBJZiB0aGlzIHdpZGdldCBpcyBiZWluZyByZWRlZmluZWQgdGhlbiB3ZSBuZWVkIHRvIGZpbmQgYWxsIHdpZGdldHMgdGhhdFxuICAvLyBhcmUgaW5oZXJpdGluZyBmcm9tIGl0IGFuZCByZWRlZmluZSBhbGwgb2YgdGhlbSBzbyB0aGF0IHRoZXkgaW5oZXJpdCBmcm9tXG4gIC8vIHRoZSBuZXcgdmVyc2lvbiBvZiB0aGlzIHdpZGdldC4gV2UncmUgZXNzZW50aWFsbHkgdHJ5aW5nIHRvIHJlcGxhY2Ugb25lXG4gIC8vIGxldmVsIGluIHRoZSBwcm90b3R5cGUgY2hhaW4uXG4gIGlmICggZXhpc3RpbmdDb25zdHJ1Y3RvciApIHtcbiAgICAkLmVhY2goIGV4aXN0aW5nQ29uc3RydWN0b3IuX2NoaWxkQ29uc3RydWN0b3JzLCBmdW5jdGlvbiggaSwgY2hpbGQgKSB7XG4gICAgICB2YXIgY2hpbGRQcm90b3R5cGUgPSBjaGlsZC5wcm90b3R5cGU7XG5cbiAgICAgIC8vIHJlZGVmaW5lIHRoZSBjaGlsZCB3aWRnZXQgdXNpbmcgdGhlIHNhbWUgcHJvdG90eXBlIHRoYXQgd2FzXG4gICAgICAvLyBvcmlnaW5hbGx5IHVzZWQsIGJ1dCBpbmhlcml0IGZyb20gdGhlIG5ldyB2ZXJzaW9uIG9mIHRoZSBiYXNlXG4gICAgICAkLndpZGdldCggY2hpbGRQcm90b3R5cGUubmFtZXNwYWNlICsgXCIuXCIgKyBjaGlsZFByb3RvdHlwZS53aWRnZXROYW1lLCBjb25zdHJ1Y3RvciwgY2hpbGQuX3Byb3RvICk7XG4gICAgfSk7XG4gICAgLy8gcmVtb3ZlIHRoZSBsaXN0IG9mIGV4aXN0aW5nIGNoaWxkIGNvbnN0cnVjdG9ycyBmcm9tIHRoZSBvbGQgY29uc3RydWN0b3JcbiAgICAvLyBzbyB0aGUgb2xkIGNoaWxkIGNvbnN0cnVjdG9ycyBjYW4gYmUgZ2FyYmFnZSBjb2xsZWN0ZWRcbiAgICBkZWxldGUgZXhpc3RpbmdDb25zdHJ1Y3Rvci5fY2hpbGRDb25zdHJ1Y3RvcnM7XG4gIH0gZWxzZSB7XG4gICAgYmFzZS5fY2hpbGRDb25zdHJ1Y3RvcnMucHVzaCggY29uc3RydWN0b3IgKTtcbiAgfVxuXG4gICQud2lkZ2V0LmJyaWRnZSggbmFtZSwgY29uc3RydWN0b3IgKTtcblxuICByZXR1cm4gY29uc3RydWN0b3I7XG59O1xuXG4kLndpZGdldC5leHRlbmQgPSBmdW5jdGlvbiggdGFyZ2V0ICkge1xuICB2YXIgaW5wdXQgPSB3aWRnZXRfc2xpY2UuY2FsbCggYXJndW1lbnRzLCAxICksXG4gICAgaW5wdXRJbmRleCA9IDAsXG4gICAgaW5wdXRMZW5ndGggPSBpbnB1dC5sZW5ndGgsXG4gICAga2V5LFxuICAgIHZhbHVlO1xuICBmb3IgKCA7IGlucHV0SW5kZXggPCBpbnB1dExlbmd0aDsgaW5wdXRJbmRleCsrICkge1xuICAgIGZvciAoIGtleSBpbiBpbnB1dFsgaW5wdXRJbmRleCBdICkge1xuICAgICAgdmFsdWUgPSBpbnB1dFsgaW5wdXRJbmRleCBdWyBrZXkgXTtcbiAgICAgIGlmICggaW5wdXRbIGlucHV0SW5kZXggXS5oYXNPd25Qcm9wZXJ0eSgga2V5ICkgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgLy8gQ2xvbmUgb2JqZWN0c1xuICAgICAgICBpZiAoICQuaXNQbGFpbk9iamVjdCggdmFsdWUgKSApIHtcbiAgICAgICAgICB0YXJnZXRbIGtleSBdID0gJC5pc1BsYWluT2JqZWN0KCB0YXJnZXRbIGtleSBdICkgP1xuICAgICAgICAgICAgJC53aWRnZXQuZXh0ZW5kKCB7fSwgdGFyZ2V0WyBrZXkgXSwgdmFsdWUgKSA6XG4gICAgICAgICAgICAvLyBEb24ndCBleHRlbmQgc3RyaW5ncywgYXJyYXlzLCBldGMuIHdpdGggb2JqZWN0c1xuICAgICAgICAgICAgJC53aWRnZXQuZXh0ZW5kKCB7fSwgdmFsdWUgKTtcbiAgICAgICAgLy8gQ29weSBldmVyeXRoaW5nIGVsc2UgYnkgcmVmZXJlbmNlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGFyZ2V0WyBrZXkgXSA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB0YXJnZXQ7XG59O1xuXG4kLndpZGdldC5icmlkZ2UgPSBmdW5jdGlvbiggbmFtZSwgb2JqZWN0ICkge1xuICB2YXIgZnVsbE5hbWUgPSBvYmplY3QucHJvdG90eXBlLndpZGdldEZ1bGxOYW1lIHx8IG5hbWU7XG4gICQuZm5bIG5hbWUgXSA9IGZ1bmN0aW9uKCBvcHRpb25zICkge1xuICAgIHZhciBpc01ldGhvZENhbGwgPSB0eXBlb2Ygb3B0aW9ucyA9PT0gXCJzdHJpbmdcIixcbiAgICAgIGFyZ3MgPSB3aWRnZXRfc2xpY2UuY2FsbCggYXJndW1lbnRzLCAxICksXG4gICAgICByZXR1cm5WYWx1ZSA9IHRoaXM7XG5cbiAgICBpZiAoIGlzTWV0aG9kQ2FsbCApIHtcbiAgICAgIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1ldGhvZFZhbHVlLFxuICAgICAgICAgIGluc3RhbmNlID0gJC5kYXRhKCB0aGlzLCBmdWxsTmFtZSApO1xuICAgICAgICBpZiAoIG9wdGlvbnMgPT09IFwiaW5zdGFuY2VcIiApIHtcbiAgICAgICAgICByZXR1cm5WYWx1ZSA9IGluc3RhbmNlO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoICFpbnN0YW5jZSApIHtcbiAgICAgICAgICByZXR1cm4gJC5lcnJvciggXCJjYW5ub3QgY2FsbCBtZXRob2RzIG9uIFwiICsgbmFtZSArIFwiIHByaW9yIHRvIGluaXRpYWxpemF0aW9uOyBcIiArXG4gICAgICAgICAgICBcImF0dGVtcHRlZCB0byBjYWxsIG1ldGhvZCAnXCIgKyBvcHRpb25zICsgXCInXCIgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoICEkLmlzRnVuY3Rpb24oIGluc3RhbmNlW29wdGlvbnNdICkgfHwgb3B0aW9ucy5jaGFyQXQoIDAgKSA9PT0gXCJfXCIgKSB7XG4gICAgICAgICAgcmV0dXJuICQuZXJyb3IoIFwibm8gc3VjaCBtZXRob2QgJ1wiICsgb3B0aW9ucyArIFwiJyBmb3IgXCIgKyBuYW1lICsgXCIgd2lkZ2V0IGluc3RhbmNlXCIgKTtcbiAgICAgICAgfVxuICAgICAgICBtZXRob2RWYWx1ZSA9IGluc3RhbmNlWyBvcHRpb25zIF0uYXBwbHkoIGluc3RhbmNlLCBhcmdzICk7XG4gICAgICAgIGlmICggbWV0aG9kVmFsdWUgIT09IGluc3RhbmNlICYmIG1ldGhvZFZhbHVlICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgcmV0dXJuVmFsdWUgPSBtZXRob2RWYWx1ZSAmJiBtZXRob2RWYWx1ZS5qcXVlcnkgP1xuICAgICAgICAgICAgcmV0dXJuVmFsdWUucHVzaFN0YWNrKCBtZXRob2RWYWx1ZS5nZXQoKSApIDpcbiAgICAgICAgICAgIG1ldGhvZFZhbHVlO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcblxuICAgICAgLy8gQWxsb3cgbXVsdGlwbGUgaGFzaGVzIHRvIGJlIHBhc3NlZCBvbiBpbml0XG4gICAgICBpZiAoIGFyZ3MubGVuZ3RoICkge1xuICAgICAgICBvcHRpb25zID0gJC53aWRnZXQuZXh0ZW5kLmFwcGx5KCBudWxsLCBbIG9wdGlvbnMgXS5jb25jYXQoYXJncykgKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaW5zdGFuY2UgPSAkLmRhdGEoIHRoaXMsIGZ1bGxOYW1lICk7XG4gICAgICAgIGlmICggaW5zdGFuY2UgKSB7XG4gICAgICAgICAgaW5zdGFuY2Uub3B0aW9uKCBvcHRpb25zIHx8IHt9ICk7XG4gICAgICAgICAgaWYgKCBpbnN0YW5jZS5faW5pdCApIHtcbiAgICAgICAgICAgIGluc3RhbmNlLl9pbml0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICQuZGF0YSggdGhpcywgZnVsbE5hbWUsIG5ldyBvYmplY3QoIG9wdGlvbnMsIHRoaXMgKSApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH07XG59O1xuXG4kLldpZGdldCA9IGZ1bmN0aW9uKCAvKiBvcHRpb25zLCBlbGVtZW50ICovICkge307XG4kLldpZGdldC5fY2hpbGRDb25zdHJ1Y3RvcnMgPSBbXTtcblxuJC5XaWRnZXQucHJvdG90eXBlID0ge1xuICB3aWRnZXROYW1lOiBcIndpZGdldFwiLFxuICB3aWRnZXRFdmVudFByZWZpeDogXCJcIixcbiAgZGVmYXVsdEVsZW1lbnQ6IFwiPGRpdj5cIixcbiAgb3B0aW9uczoge1xuICAgIGRpc2FibGVkOiBmYWxzZSxcblxuICAgIC8vIGNhbGxiYWNrc1xuICAgIGNyZWF0ZTogbnVsbFxuICB9LFxuICBfY3JlYXRlV2lkZ2V0OiBmdW5jdGlvbiggb3B0aW9ucywgZWxlbWVudCApIHtcbiAgICBlbGVtZW50ID0gJCggZWxlbWVudCB8fCB0aGlzLmRlZmF1bHRFbGVtZW50IHx8IHRoaXMgKVsgMCBdO1xuICAgIHRoaXMuZWxlbWVudCA9ICQoIGVsZW1lbnQgKTtcbiAgICB0aGlzLnV1aWQgPSB3aWRnZXRfdXVpZCsrO1xuICAgIHRoaXMuZXZlbnROYW1lc3BhY2UgPSBcIi5cIiArIHRoaXMud2lkZ2V0TmFtZSArIHRoaXMudXVpZDtcblxuICAgIHRoaXMuYmluZGluZ3MgPSAkKCk7XG4gICAgdGhpcy5ob3ZlcmFibGUgPSAkKCk7XG4gICAgdGhpcy5mb2N1c2FibGUgPSAkKCk7XG5cbiAgICBpZiAoIGVsZW1lbnQgIT09IHRoaXMgKSB7XG4gICAgICAkLmRhdGEoIGVsZW1lbnQsIHRoaXMud2lkZ2V0RnVsbE5hbWUsIHRoaXMgKTtcbiAgICAgIHRoaXMuX29uKCB0cnVlLCB0aGlzLmVsZW1lbnQsIHtcbiAgICAgICAgcmVtb3ZlOiBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgICAgICAgaWYgKCBldmVudC50YXJnZXQgPT09IGVsZW1lbnQgKSB7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5kb2N1bWVudCA9ICQoIGVsZW1lbnQuc3R5bGUgP1xuICAgICAgICAvLyBlbGVtZW50IHdpdGhpbiB0aGUgZG9jdW1lbnRcbiAgICAgICAgZWxlbWVudC5vd25lckRvY3VtZW50IDpcbiAgICAgICAgLy8gZWxlbWVudCBpcyB3aW5kb3cgb3IgZG9jdW1lbnRcbiAgICAgICAgZWxlbWVudC5kb2N1bWVudCB8fCBlbGVtZW50ICk7XG4gICAgICB0aGlzLndpbmRvdyA9ICQoIHRoaXMuZG9jdW1lbnRbMF0uZGVmYXVsdFZpZXcgfHwgdGhpcy5kb2N1bWVudFswXS5wYXJlbnRXaW5kb3cgKTtcbiAgICB9XG5cbiAgICB0aGlzLm9wdGlvbnMgPSAkLndpZGdldC5leHRlbmQoIHt9LFxuICAgICAgdGhpcy5vcHRpb25zLFxuICAgICAgdGhpcy5fZ2V0Q3JlYXRlT3B0aW9ucygpLFxuICAgICAgb3B0aW9ucyApO1xuXG4gICAgdGhpcy5fY3JlYXRlKCk7XG4gICAgdGhpcy5fdHJpZ2dlciggXCJjcmVhdGVcIiwgbnVsbCwgdGhpcy5fZ2V0Q3JlYXRlRXZlbnREYXRhKCkgKTtcbiAgICB0aGlzLl9pbml0KCk7XG4gIH0sXG4gIF9nZXRDcmVhdGVPcHRpb25zOiAkLm5vb3AsXG4gIF9nZXRDcmVhdGVFdmVudERhdGE6ICQubm9vcCxcbiAgX2NyZWF0ZTogJC5ub29wLFxuICBfaW5pdDogJC5ub29wLFxuXG4gIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX2Rlc3Ryb3koKTtcbiAgICAvLyB3ZSBjYW4gcHJvYmFibHkgcmVtb3ZlIHRoZSB1bmJpbmQgY2FsbHMgaW4gMi4wXG4gICAgLy8gYWxsIGV2ZW50IGJpbmRpbmdzIHNob3VsZCBnbyB0aHJvdWdoIHRoaXMuX29uKClcbiAgICB0aGlzLmVsZW1lbnRcbiAgICAgIC51bmJpbmQoIHRoaXMuZXZlbnROYW1lc3BhY2UgKVxuICAgICAgLnJlbW92ZURhdGEoIHRoaXMud2lkZ2V0RnVsbE5hbWUgKVxuICAgICAgLy8gc3VwcG9ydDoganF1ZXJ5IDwxLjYuM1xuICAgICAgLy8gaHR0cDovL2J1Z3MuanF1ZXJ5LmNvbS90aWNrZXQvOTQxM1xuICAgICAgLnJlbW92ZURhdGEoICQuY2FtZWxDYXNlKCB0aGlzLndpZGdldEZ1bGxOYW1lICkgKTtcbiAgICB0aGlzLndpZGdldCgpXG4gICAgICAudW5iaW5kKCB0aGlzLmV2ZW50TmFtZXNwYWNlIClcbiAgICAgIC5yZW1vdmVBdHRyKCBcImFyaWEtZGlzYWJsZWRcIiApXG4gICAgICAucmVtb3ZlQ2xhc3MoXG4gICAgICAgIHRoaXMud2lkZ2V0RnVsbE5hbWUgKyBcIi1kaXNhYmxlZCBcIiArXG4gICAgICAgIFwidWktc3RhdGUtZGlzYWJsZWRcIiApO1xuXG4gICAgLy8gY2xlYW4gdXAgZXZlbnRzIGFuZCBzdGF0ZXNcbiAgICB0aGlzLmJpbmRpbmdzLnVuYmluZCggdGhpcy5ldmVudE5hbWVzcGFjZSApO1xuICAgIHRoaXMuaG92ZXJhYmxlLnJlbW92ZUNsYXNzKCBcInVpLXN0YXRlLWhvdmVyXCIgKTtcbiAgICB0aGlzLmZvY3VzYWJsZS5yZW1vdmVDbGFzcyggXCJ1aS1zdGF0ZS1mb2N1c1wiICk7XG4gIH0sXG4gIF9kZXN0cm95OiAkLm5vb3AsXG5cbiAgd2lkZ2V0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50O1xuICB9LFxuXG4gIG9wdGlvbjogZnVuY3Rpb24oIGtleSwgdmFsdWUgKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBrZXksXG4gICAgICBwYXJ0cyxcbiAgICAgIGN1ck9wdGlvbixcbiAgICAgIGk7XG5cbiAgICBpZiAoIGFyZ3VtZW50cy5sZW5ndGggPT09IDAgKSB7XG4gICAgICAvLyBkb24ndCByZXR1cm4gYSByZWZlcmVuY2UgdG8gdGhlIGludGVybmFsIGhhc2hcbiAgICAgIHJldHVybiAkLndpZGdldC5leHRlbmQoIHt9LCB0aGlzLm9wdGlvbnMgKTtcbiAgICB9XG5cbiAgICBpZiAoIHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIgKSB7XG4gICAgICAvLyBoYW5kbGUgbmVzdGVkIGtleXMsIGUuZy4sIFwiZm9vLmJhclwiID0+IHsgZm9vOiB7IGJhcjogX19fIH0gfVxuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgcGFydHMgPSBrZXkuc3BsaXQoIFwiLlwiICk7XG4gICAgICBrZXkgPSBwYXJ0cy5zaGlmdCgpO1xuICAgICAgaWYgKCBwYXJ0cy5sZW5ndGggKSB7XG4gICAgICAgIGN1ck9wdGlvbiA9IG9wdGlvbnNbIGtleSBdID0gJC53aWRnZXQuZXh0ZW5kKCB7fSwgdGhpcy5vcHRpb25zWyBrZXkgXSApO1xuICAgICAgICBmb3IgKCBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aCAtIDE7IGkrKyApIHtcbiAgICAgICAgICBjdXJPcHRpb25bIHBhcnRzWyBpIF0gXSA9IGN1ck9wdGlvblsgcGFydHNbIGkgXSBdIHx8IHt9O1xuICAgICAgICAgIGN1ck9wdGlvbiA9IGN1ck9wdGlvblsgcGFydHNbIGkgXSBdO1xuICAgICAgICB9XG4gICAgICAgIGtleSA9IHBhcnRzLnBvcCgpO1xuICAgICAgICBpZiAoIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgKSB7XG4gICAgICAgICAgcmV0dXJuIGN1ck9wdGlvblsga2V5IF0gPT09IHVuZGVmaW5lZCA/IG51bGwgOiBjdXJPcHRpb25bIGtleSBdO1xuICAgICAgICB9XG4gICAgICAgIGN1ck9wdGlvblsga2V5IF0gPSB2YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICggYXJndW1lbnRzLmxlbmd0aCA9PT0gMSApIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zWyBrZXkgXSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IHRoaXMub3B0aW9uc1sga2V5IF07XG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9uc1sga2V5IF0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9zZXRPcHRpb25zKCBvcHRpb25zICk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgX3NldE9wdGlvbnM6IGZ1bmN0aW9uKCBvcHRpb25zICkge1xuICAgIHZhciBrZXk7XG5cbiAgICBmb3IgKCBrZXkgaW4gb3B0aW9ucyApIHtcbiAgICAgIHRoaXMuX3NldE9wdGlvbigga2V5LCBvcHRpb25zWyBrZXkgXSApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBfc2V0T3B0aW9uOiBmdW5jdGlvbigga2V5LCB2YWx1ZSApIHtcbiAgICB0aGlzLm9wdGlvbnNbIGtleSBdID0gdmFsdWU7XG5cbiAgICBpZiAoIGtleSA9PT0gXCJkaXNhYmxlZFwiICkge1xuICAgICAgdGhpcy53aWRnZXQoKVxuICAgICAgICAudG9nZ2xlQ2xhc3MoIHRoaXMud2lkZ2V0RnVsbE5hbWUgKyBcIi1kaXNhYmxlZFwiLCAhIXZhbHVlICk7XG5cbiAgICAgIC8vIElmIHRoZSB3aWRnZXQgaXMgYmVjb21pbmcgZGlzYWJsZWQsIHRoZW4gbm90aGluZyBpcyBpbnRlcmFjdGl2ZVxuICAgICAgaWYgKCB2YWx1ZSApIHtcbiAgICAgICAgdGhpcy5ob3ZlcmFibGUucmVtb3ZlQ2xhc3MoIFwidWktc3RhdGUtaG92ZXJcIiApO1xuICAgICAgICB0aGlzLmZvY3VzYWJsZS5yZW1vdmVDbGFzcyggXCJ1aS1zdGF0ZS1mb2N1c1wiICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgZW5hYmxlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fc2V0T3B0aW9ucyh7IGRpc2FibGVkOiBmYWxzZSB9KTtcbiAgfSxcbiAgZGlzYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NldE9wdGlvbnMoeyBkaXNhYmxlZDogdHJ1ZSB9KTtcbiAgfSxcblxuICBfb246IGZ1bmN0aW9uKCBzdXBwcmVzc0Rpc2FibGVkQ2hlY2ssIGVsZW1lbnQsIGhhbmRsZXJzICkge1xuICAgIHZhciBkZWxlZ2F0ZUVsZW1lbnQsXG4gICAgICBpbnN0YW5jZSA9IHRoaXM7XG5cbiAgICAvLyBubyBzdXBwcmVzc0Rpc2FibGVkQ2hlY2sgZmxhZywgc2h1ZmZsZSBhcmd1bWVudHNcbiAgICBpZiAoIHR5cGVvZiBzdXBwcmVzc0Rpc2FibGVkQ2hlY2sgIT09IFwiYm9vbGVhblwiICkge1xuICAgICAgaGFuZGxlcnMgPSBlbGVtZW50O1xuICAgICAgZWxlbWVudCA9IHN1cHByZXNzRGlzYWJsZWRDaGVjaztcbiAgICAgIHN1cHByZXNzRGlzYWJsZWRDaGVjayA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIG5vIGVsZW1lbnQgYXJndW1lbnQsIHNodWZmbGUgYW5kIHVzZSB0aGlzLmVsZW1lbnRcbiAgICBpZiAoICFoYW5kbGVycyApIHtcbiAgICAgIGhhbmRsZXJzID0gZWxlbWVudDtcbiAgICAgIGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQ7XG4gICAgICBkZWxlZ2F0ZUVsZW1lbnQgPSB0aGlzLndpZGdldCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50ID0gZGVsZWdhdGVFbGVtZW50ID0gJCggZWxlbWVudCApO1xuICAgICAgdGhpcy5iaW5kaW5ncyA9IHRoaXMuYmluZGluZ3MuYWRkKCBlbGVtZW50ICk7XG4gICAgfVxuXG4gICAgJC5lYWNoKCBoYW5kbGVycywgZnVuY3Rpb24oIGV2ZW50LCBoYW5kbGVyICkge1xuICAgICAgZnVuY3Rpb24gaGFuZGxlclByb3h5KCkge1xuICAgICAgICAvLyBhbGxvdyB3aWRnZXRzIHRvIGN1c3RvbWl6ZSB0aGUgZGlzYWJsZWQgaGFuZGxpbmdcbiAgICAgICAgLy8gLSBkaXNhYmxlZCBhcyBhbiBhcnJheSBpbnN0ZWFkIG9mIGJvb2xlYW5cbiAgICAgICAgLy8gLSBkaXNhYmxlZCBjbGFzcyBhcyBtZXRob2QgZm9yIGRpc2FibGluZyBpbmRpdmlkdWFsIHBhcnRzXG4gICAgICAgIGlmICggIXN1cHByZXNzRGlzYWJsZWRDaGVjayAmJlxuICAgICAgICAgICAgKCBpbnN0YW5jZS5vcHRpb25zLmRpc2FibGVkID09PSB0cnVlIHx8XG4gICAgICAgICAgICAgICQoIHRoaXMgKS5oYXNDbGFzcyggXCJ1aS1zdGF0ZS1kaXNhYmxlZFwiICkgKSApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICggdHlwZW9mIGhhbmRsZXIgPT09IFwic3RyaW5nXCIgPyBpbnN0YW5jZVsgaGFuZGxlciBdIDogaGFuZGxlciApXG4gICAgICAgICAgLmFwcGx5KCBpbnN0YW5jZSwgYXJndW1lbnRzICk7XG4gICAgICB9XG5cbiAgICAgIC8vIGNvcHkgdGhlIGd1aWQgc28gZGlyZWN0IHVuYmluZGluZyB3b3Jrc1xuICAgICAgaWYgKCB0eXBlb2YgaGFuZGxlciAhPT0gXCJzdHJpbmdcIiApIHtcbiAgICAgICAgaGFuZGxlclByb3h5Lmd1aWQgPSBoYW5kbGVyLmd1aWQgPVxuICAgICAgICAgIGhhbmRsZXIuZ3VpZCB8fCBoYW5kbGVyUHJveHkuZ3VpZCB8fCAkLmd1aWQrKztcbiAgICAgIH1cblxuICAgICAgdmFyIG1hdGNoID0gZXZlbnQubWF0Y2goIC9eKFtcXHc6LV0qKVxccyooLiopJC8gKSxcbiAgICAgICAgZXZlbnROYW1lID0gbWF0Y2hbMV0gKyBpbnN0YW5jZS5ldmVudE5hbWVzcGFjZSxcbiAgICAgICAgc2VsZWN0b3IgPSBtYXRjaFsyXTtcbiAgICAgIGlmICggc2VsZWN0b3IgKSB7XG4gICAgICAgIGRlbGVnYXRlRWxlbWVudC5kZWxlZ2F0ZSggc2VsZWN0b3IsIGV2ZW50TmFtZSwgaGFuZGxlclByb3h5ICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50LmJpbmQoIGV2ZW50TmFtZSwgaGFuZGxlclByb3h5ICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgX29mZjogZnVuY3Rpb24oIGVsZW1lbnQsIGV2ZW50TmFtZSApIHtcbiAgICBldmVudE5hbWUgPSAoZXZlbnROYW1lIHx8IFwiXCIpLnNwbGl0KCBcIiBcIiApLmpvaW4oIHRoaXMuZXZlbnROYW1lc3BhY2UgKyBcIiBcIiApICtcbiAgICAgIHRoaXMuZXZlbnROYW1lc3BhY2U7XG4gICAgZWxlbWVudC51bmJpbmQoIGV2ZW50TmFtZSApLnVuZGVsZWdhdGUoIGV2ZW50TmFtZSApO1xuXG4gICAgLy8gQ2xlYXIgdGhlIHN0YWNrIHRvIGF2b2lkIG1lbW9yeSBsZWFrcyAoIzEwMDU2KVxuICAgIHRoaXMuYmluZGluZ3MgPSAkKCB0aGlzLmJpbmRpbmdzLm5vdCggZWxlbWVudCApLmdldCgpICk7XG4gICAgdGhpcy5mb2N1c2FibGUgPSAkKCB0aGlzLmZvY3VzYWJsZS5ub3QoIGVsZW1lbnQgKS5nZXQoKSApO1xuICAgIHRoaXMuaG92ZXJhYmxlID0gJCggdGhpcy5ob3ZlcmFibGUubm90KCBlbGVtZW50ICkuZ2V0KCkgKTtcbiAgfSxcblxuICBfZGVsYXk6IGZ1bmN0aW9uKCBoYW5kbGVyLCBkZWxheSApIHtcbiAgICBmdW5jdGlvbiBoYW5kbGVyUHJveHkoKSB7XG4gICAgICByZXR1cm4gKCB0eXBlb2YgaGFuZGxlciA9PT0gXCJzdHJpbmdcIiA/IGluc3RhbmNlWyBoYW5kbGVyIF0gOiBoYW5kbGVyIClcbiAgICAgICAgLmFwcGx5KCBpbnN0YW5jZSwgYXJndW1lbnRzICk7XG4gICAgfVxuICAgIHZhciBpbnN0YW5jZSA9IHRoaXM7XG4gICAgcmV0dXJuIHNldFRpbWVvdXQoIGhhbmRsZXJQcm94eSwgZGVsYXkgfHwgMCApO1xuICB9LFxuXG4gIF9ob3ZlcmFibGU6IGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuICAgIHRoaXMuaG92ZXJhYmxlID0gdGhpcy5ob3ZlcmFibGUuYWRkKCBlbGVtZW50ICk7XG4gICAgdGhpcy5fb24oIGVsZW1lbnQsIHtcbiAgICAgIG1vdXNlZW50ZXI6IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICAgICAgJCggZXZlbnQuY3VycmVudFRhcmdldCApLmFkZENsYXNzKCBcInVpLXN0YXRlLWhvdmVyXCIgKTtcbiAgICAgIH0sXG4gICAgICBtb3VzZWxlYXZlOiBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgICAgICQoIGV2ZW50LmN1cnJlbnRUYXJnZXQgKS5yZW1vdmVDbGFzcyggXCJ1aS1zdGF0ZS1ob3ZlclwiICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgX2ZvY3VzYWJsZTogZnVuY3Rpb24oIGVsZW1lbnQgKSB7XG4gICAgdGhpcy5mb2N1c2FibGUgPSB0aGlzLmZvY3VzYWJsZS5hZGQoIGVsZW1lbnQgKTtcbiAgICB0aGlzLl9vbiggZWxlbWVudCwge1xuICAgICAgZm9jdXNpbjogZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgICAgICAkKCBldmVudC5jdXJyZW50VGFyZ2V0ICkuYWRkQ2xhc3MoIFwidWktc3RhdGUtZm9jdXNcIiApO1xuICAgICAgfSxcbiAgICAgIGZvY3Vzb3V0OiBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgICAgICQoIGV2ZW50LmN1cnJlbnRUYXJnZXQgKS5yZW1vdmVDbGFzcyggXCJ1aS1zdGF0ZS1mb2N1c1wiICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgX3RyaWdnZXI6IGZ1bmN0aW9uKCB0eXBlLCBldmVudCwgZGF0YSApIHtcbiAgICB2YXIgcHJvcCwgb3JpZyxcbiAgICAgIGNhbGxiYWNrID0gdGhpcy5vcHRpb25zWyB0eXBlIF07XG5cbiAgICBkYXRhID0gZGF0YSB8fCB7fTtcbiAgICBldmVudCA9ICQuRXZlbnQoIGV2ZW50ICk7XG4gICAgZXZlbnQudHlwZSA9ICggdHlwZSA9PT0gdGhpcy53aWRnZXRFdmVudFByZWZpeCA/XG4gICAgICB0eXBlIDpcbiAgICAgIHRoaXMud2lkZ2V0RXZlbnRQcmVmaXggKyB0eXBlICkudG9Mb3dlckNhc2UoKTtcbiAgICAvLyB0aGUgb3JpZ2luYWwgZXZlbnQgbWF5IGNvbWUgZnJvbSBhbnkgZWxlbWVudFxuICAgIC8vIHNvIHdlIG5lZWQgdG8gcmVzZXQgdGhlIHRhcmdldCBvbiB0aGUgbmV3IGV2ZW50XG4gICAgZXZlbnQudGFyZ2V0ID0gdGhpcy5lbGVtZW50WyAwIF07XG5cbiAgICAvLyBjb3B5IG9yaWdpbmFsIGV2ZW50IHByb3BlcnRpZXMgb3ZlciB0byB0aGUgbmV3IGV2ZW50XG4gICAgb3JpZyA9IGV2ZW50Lm9yaWdpbmFsRXZlbnQ7XG4gICAgaWYgKCBvcmlnICkge1xuICAgICAgZm9yICggcHJvcCBpbiBvcmlnICkge1xuICAgICAgICBpZiAoICEoIHByb3AgaW4gZXZlbnQgKSApIHtcbiAgICAgICAgICBldmVudFsgcHJvcCBdID0gb3JpZ1sgcHJvcCBdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5lbGVtZW50LnRyaWdnZXIoIGV2ZW50LCBkYXRhICk7XG4gICAgcmV0dXJuICEoICQuaXNGdW5jdGlvbiggY2FsbGJhY2sgKSAmJlxuICAgICAgY2FsbGJhY2suYXBwbHkoIHRoaXMuZWxlbWVudFswXSwgWyBldmVudCBdLmNvbmNhdCggZGF0YSApICkgPT09IGZhbHNlIHx8XG4gICAgICBldmVudC5pc0RlZmF1bHRQcmV2ZW50ZWQoKSApO1xuICB9XG59O1xuXG4kLmVhY2goIHsgc2hvdzogXCJmYWRlSW5cIiwgaGlkZTogXCJmYWRlT3V0XCIgfSwgZnVuY3Rpb24oIG1ldGhvZCwgZGVmYXVsdEVmZmVjdCApIHtcbiAgJC5XaWRnZXQucHJvdG90eXBlWyBcIl9cIiArIG1ldGhvZCBdID0gZnVuY3Rpb24oIGVsZW1lbnQsIG9wdGlvbnMsIGNhbGxiYWNrICkge1xuICAgIGlmICggdHlwZW9mIG9wdGlvbnMgPT09IFwic3RyaW5nXCIgKSB7XG4gICAgICBvcHRpb25zID0geyBlZmZlY3Q6IG9wdGlvbnMgfTtcbiAgICB9XG4gICAgdmFyIGhhc09wdGlvbnMsXG4gICAgICBlZmZlY3ROYW1lID0gIW9wdGlvbnMgP1xuICAgICAgICBtZXRob2QgOlxuICAgICAgICBvcHRpb25zID09PSB0cnVlIHx8IHR5cGVvZiBvcHRpb25zID09PSBcIm51bWJlclwiID9cbiAgICAgICAgICBkZWZhdWx0RWZmZWN0IDpcbiAgICAgICAgICBvcHRpb25zLmVmZmVjdCB8fCBkZWZhdWx0RWZmZWN0O1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIGlmICggdHlwZW9mIG9wdGlvbnMgPT09IFwibnVtYmVyXCIgKSB7XG4gICAgICBvcHRpb25zID0geyBkdXJhdGlvbjogb3B0aW9ucyB9O1xuICAgIH1cbiAgICBoYXNPcHRpb25zID0gISQuaXNFbXB0eU9iamVjdCggb3B0aW9ucyApO1xuICAgIG9wdGlvbnMuY29tcGxldGUgPSBjYWxsYmFjaztcbiAgICBpZiAoIG9wdGlvbnMuZGVsYXkgKSB7XG4gICAgICBlbGVtZW50LmRlbGF5KCBvcHRpb25zLmRlbGF5ICk7XG4gICAgfVxuICAgIGlmICggaGFzT3B0aW9ucyAmJiAkLmVmZmVjdHMgJiYgJC5lZmZlY3RzLmVmZmVjdFsgZWZmZWN0TmFtZSBdICkge1xuICAgICAgZWxlbWVudFsgbWV0aG9kIF0oIG9wdGlvbnMgKTtcbiAgICB9IGVsc2UgaWYgKCBlZmZlY3ROYW1lICE9PSBtZXRob2QgJiYgZWxlbWVudFsgZWZmZWN0TmFtZSBdICkge1xuICAgICAgZWxlbWVudFsgZWZmZWN0TmFtZSBdKCBvcHRpb25zLmR1cmF0aW9uLCBvcHRpb25zLmVhc2luZywgY2FsbGJhY2sgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudC5xdWV1ZShmdW5jdGlvbiggbmV4dCApIHtcbiAgICAgICAgJCggdGhpcyApWyBtZXRob2QgXSgpO1xuICAgICAgICBpZiAoIGNhbGxiYWNrICkge1xuICAgICAgICAgIGNhbGxiYWNrLmNhbGwoIGVsZW1lbnRbIDAgXSApO1xuICAgICAgICB9XG4gICAgICAgIG5leHQoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn0pO1xuXG52YXIgd2lkZ2V0ID0gJC53aWRnZXQ7XG5cblxuLyohXG4gKiBqUXVlcnkgVUkgTW91c2UgMS4xMS4zXG4gKiBodHRwOi8vanF1ZXJ5dWkuY29tXG4gKlxuICogQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnNcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqIGh0dHA6Ly9qcXVlcnkub3JnL2xpY2Vuc2VcbiAqXG4gKiBodHRwOi8vYXBpLmpxdWVyeXVpLmNvbS9tb3VzZS9cbiAqL1xuXG5cbnZhciBtb3VzZUhhbmRsZWQgPSBmYWxzZTtcbiQoIGRvY3VtZW50ICkubW91c2V1cCggZnVuY3Rpb24oKSB7XG4gIG1vdXNlSGFuZGxlZCA9IGZhbHNlO1xufSk7XG5cbnZhciBtb3VzZSA9ICQud2lkZ2V0KFwidWkubW91c2VcIiwge1xuICB2ZXJzaW9uOiBcIjEuMTEuM1wiLFxuICBvcHRpb25zOiB7XG4gICAgY2FuY2VsOiBcImlucHV0LHRleHRhcmVhLGJ1dHRvbixzZWxlY3Qsb3B0aW9uXCIsXG4gICAgZGlzdGFuY2U6IDEsXG4gICAgZGVsYXk6IDBcbiAgfSxcbiAgX21vdXNlSW5pdDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgdGhpcy5lbGVtZW50XG4gICAgICAuYmluZChcIm1vdXNlZG93bi5cIiArIHRoaXMud2lkZ2V0TmFtZSwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIHRoYXQuX21vdXNlRG93bihldmVudCk7XG4gICAgICB9KVxuICAgICAgLmJpbmQoXCJjbGljay5cIiArIHRoaXMud2lkZ2V0TmFtZSwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgaWYgKHRydWUgPT09ICQuZGF0YShldmVudC50YXJnZXQsIHRoYXQud2lkZ2V0TmFtZSArIFwiLnByZXZlbnRDbGlja0V2ZW50XCIpKSB7XG4gICAgICAgICAgJC5yZW1vdmVEYXRhKGV2ZW50LnRhcmdldCwgdGhhdC53aWRnZXROYW1lICsgXCIucHJldmVudENsaWNrRXZlbnRcIik7XG4gICAgICAgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuICB9LFxuXG4gIC8vIFRPRE86IG1ha2Ugc3VyZSBkZXN0cm95aW5nIG9uZSBpbnN0YW5jZSBvZiBtb3VzZSBkb2Vzbid0IG1lc3Mgd2l0aFxuICAvLyBvdGhlciBpbnN0YW5jZXMgb2YgbW91c2VcbiAgX21vdXNlRGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5lbGVtZW50LnVuYmluZChcIi5cIiArIHRoaXMud2lkZ2V0TmFtZSk7XG4gICAgaWYgKCB0aGlzLl9tb3VzZU1vdmVEZWxlZ2F0ZSApIHtcbiAgICAgIHRoaXMuZG9jdW1lbnRcbiAgICAgICAgLnVuYmluZChcIm1vdXNlbW92ZS5cIiArIHRoaXMud2lkZ2V0TmFtZSwgdGhpcy5fbW91c2VNb3ZlRGVsZWdhdGUpXG4gICAgICAgIC51bmJpbmQoXCJtb3VzZXVwLlwiICsgdGhpcy53aWRnZXROYW1lLCB0aGlzLl9tb3VzZVVwRGVsZWdhdGUpO1xuICAgIH1cbiAgfSxcblxuICBfbW91c2VEb3duOiBmdW5jdGlvbihldmVudCkge1xuICAgIC8vIGRvbid0IGxldCBtb3JlIHRoYW4gb25lIHdpZGdldCBoYW5kbGUgbW91c2VTdGFydFxuICAgIGlmICggbW91c2VIYW5kbGVkICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX21vdXNlTW92ZWQgPSBmYWxzZTtcblxuICAgIC8vIHdlIG1heSBoYXZlIG1pc3NlZCBtb3VzZXVwIChvdXQgb2Ygd2luZG93KVxuICAgICh0aGlzLl9tb3VzZVN0YXJ0ZWQgJiYgdGhpcy5fbW91c2VVcChldmVudCkpO1xuXG4gICAgdGhpcy5fbW91c2VEb3duRXZlbnQgPSBldmVudDtcblxuICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgIGJ0bklzTGVmdCA9IChldmVudC53aGljaCA9PT0gMSksXG4gICAgICAvLyBldmVudC50YXJnZXQubm9kZU5hbWUgd29ya3MgYXJvdW5kIGEgYnVnIGluIElFIDggd2l0aFxuICAgICAgLy8gZGlzYWJsZWQgaW5wdXRzICgjNzYyMClcbiAgICAgIGVsSXNDYW5jZWwgPSAodHlwZW9mIHRoaXMub3B0aW9ucy5jYW5jZWwgPT09IFwic3RyaW5nXCIgJiYgZXZlbnQudGFyZ2V0Lm5vZGVOYW1lID8gJChldmVudC50YXJnZXQpLmNsb3Nlc3QodGhpcy5vcHRpb25zLmNhbmNlbCkubGVuZ3RoIDogZmFsc2UpO1xuICAgIGlmICghYnRuSXNMZWZ0IHx8IGVsSXNDYW5jZWwgfHwgIXRoaXMuX21vdXNlQ2FwdHVyZShldmVudCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMubW91c2VEZWxheU1ldCA9ICF0aGlzLm9wdGlvbnMuZGVsYXk7XG4gICAgaWYgKCF0aGlzLm1vdXNlRGVsYXlNZXQpIHtcbiAgICAgIHRoaXMuX21vdXNlRGVsYXlUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoYXQubW91c2VEZWxheU1ldCA9IHRydWU7XG4gICAgICB9LCB0aGlzLm9wdGlvbnMuZGVsYXkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9tb3VzZURpc3RhbmNlTWV0KGV2ZW50KSAmJiB0aGlzLl9tb3VzZURlbGF5TWV0KGV2ZW50KSkge1xuICAgICAgdGhpcy5fbW91c2VTdGFydGVkID0gKHRoaXMuX21vdXNlU3RhcnQoZXZlbnQpICE9PSBmYWxzZSk7XG4gICAgICBpZiAoIXRoaXMuX21vdXNlU3RhcnRlZCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDbGljayBldmVudCBtYXkgbmV2ZXIgaGF2ZSBmaXJlZCAoR2Vja28gJiBPcGVyYSlcbiAgICBpZiAodHJ1ZSA9PT0gJC5kYXRhKGV2ZW50LnRhcmdldCwgdGhpcy53aWRnZXROYW1lICsgXCIucHJldmVudENsaWNrRXZlbnRcIikpIHtcbiAgICAgICQucmVtb3ZlRGF0YShldmVudC50YXJnZXQsIHRoaXMud2lkZ2V0TmFtZSArIFwiLnByZXZlbnRDbGlja0V2ZW50XCIpO1xuICAgIH1cblxuICAgIC8vIHRoZXNlIGRlbGVnYXRlcyBhcmUgcmVxdWlyZWQgdG8ga2VlcCBjb250ZXh0XG4gICAgdGhpcy5fbW91c2VNb3ZlRGVsZWdhdGUgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgcmV0dXJuIHRoYXQuX21vdXNlTW92ZShldmVudCk7XG4gICAgfTtcbiAgICB0aGlzLl9tb3VzZVVwRGVsZWdhdGUgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgcmV0dXJuIHRoYXQuX21vdXNlVXAoZXZlbnQpO1xuICAgIH07XG5cbiAgICB0aGlzLmRvY3VtZW50XG4gICAgICAuYmluZCggXCJtb3VzZW1vdmUuXCIgKyB0aGlzLndpZGdldE5hbWUsIHRoaXMuX21vdXNlTW92ZURlbGVnYXRlIClcbiAgICAgIC5iaW5kKCBcIm1vdXNldXAuXCIgKyB0aGlzLndpZGdldE5hbWUsIHRoaXMuX21vdXNlVXBEZWxlZ2F0ZSApO1xuXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIG1vdXNlSGFuZGxlZCA9IHRydWU7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgX21vdXNlTW92ZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAvLyBPbmx5IGNoZWNrIGZvciBtb3VzZXVwcyBvdXRzaWRlIHRoZSBkb2N1bWVudCBpZiB5b3UndmUgbW92ZWQgaW5zaWRlIHRoZSBkb2N1bWVudFxuICAgIC8vIGF0IGxlYXN0IG9uY2UuIFRoaXMgcHJldmVudHMgdGhlIGZpcmluZyBvZiBtb3VzZXVwIGluIHRoZSBjYXNlIG9mIElFPDksIHdoaWNoIHdpbGxcbiAgICAvLyBmaXJlIGEgbW91c2Vtb3ZlIGV2ZW50IGlmIGNvbnRlbnQgaXMgcGxhY2VkIHVuZGVyIHRoZSBjdXJzb3IuIFNlZSAjNzc3OFxuICAgIC8vIFN1cHBvcnQ6IElFIDw5XG4gICAgaWYgKCB0aGlzLl9tb3VzZU1vdmVkICkge1xuICAgICAgLy8gSUUgbW91c2V1cCBjaGVjayAtIG1vdXNldXAgaGFwcGVuZWQgd2hlbiBtb3VzZSB3YXMgb3V0IG9mIHdpbmRvd1xuICAgICAgaWYgKCQudWkuaWUgJiYgKCAhZG9jdW1lbnQuZG9jdW1lbnRNb2RlIHx8IGRvY3VtZW50LmRvY3VtZW50TW9kZSA8IDkgKSAmJiAhZXZlbnQuYnV0dG9uKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tb3VzZVVwKGV2ZW50KTtcblxuICAgICAgLy8gSWZyYW1lIG1vdXNldXAgY2hlY2sgLSBtb3VzZXVwIG9jY3VycmVkIGluIGFub3RoZXIgZG9jdW1lbnRcbiAgICAgIH0gZWxzZSBpZiAoICFldmVudC53aGljaCApIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21vdXNlVXAoIGV2ZW50ICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCBldmVudC53aGljaCB8fCBldmVudC5idXR0b24gKSB7XG4gICAgICB0aGlzLl9tb3VzZU1vdmVkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fbW91c2VTdGFydGVkKSB7XG4gICAgICB0aGlzLl9tb3VzZURyYWcoZXZlbnQpO1xuICAgICAgcmV0dXJuIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX21vdXNlRGlzdGFuY2VNZXQoZXZlbnQpICYmIHRoaXMuX21vdXNlRGVsYXlNZXQoZXZlbnQpKSB7XG4gICAgICB0aGlzLl9tb3VzZVN0YXJ0ZWQgPVxuICAgICAgICAodGhpcy5fbW91c2VTdGFydCh0aGlzLl9tb3VzZURvd25FdmVudCwgZXZlbnQpICE9PSBmYWxzZSk7XG4gICAgICAodGhpcy5fbW91c2VTdGFydGVkID8gdGhpcy5fbW91c2VEcmFnKGV2ZW50KSA6IHRoaXMuX21vdXNlVXAoZXZlbnQpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gIXRoaXMuX21vdXNlU3RhcnRlZDtcbiAgfSxcblxuICBfbW91c2VVcDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB0aGlzLmRvY3VtZW50XG4gICAgICAudW5iaW5kKCBcIm1vdXNlbW92ZS5cIiArIHRoaXMud2lkZ2V0TmFtZSwgdGhpcy5fbW91c2VNb3ZlRGVsZWdhdGUgKVxuICAgICAgLnVuYmluZCggXCJtb3VzZXVwLlwiICsgdGhpcy53aWRnZXROYW1lLCB0aGlzLl9tb3VzZVVwRGVsZWdhdGUgKTtcblxuICAgIGlmICh0aGlzLl9tb3VzZVN0YXJ0ZWQpIHtcbiAgICAgIHRoaXMuX21vdXNlU3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSB0aGlzLl9tb3VzZURvd25FdmVudC50YXJnZXQpIHtcbiAgICAgICAgJC5kYXRhKGV2ZW50LnRhcmdldCwgdGhpcy53aWRnZXROYW1lICsgXCIucHJldmVudENsaWNrRXZlbnRcIiwgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX21vdXNlU3RvcChldmVudCk7XG4gICAgfVxuXG4gICAgbW91c2VIYW5kbGVkID0gZmFsc2U7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIF9tb3VzZURpc3RhbmNlTWV0OiBmdW5jdGlvbihldmVudCkge1xuICAgIHJldHVybiAoTWF0aC5tYXgoXG4gICAgICAgIE1hdGguYWJzKHRoaXMuX21vdXNlRG93bkV2ZW50LnBhZ2VYIC0gZXZlbnQucGFnZVgpLFxuICAgICAgICBNYXRoLmFicyh0aGlzLl9tb3VzZURvd25FdmVudC5wYWdlWSAtIGV2ZW50LnBhZ2VZKVxuICAgICAgKSA+PSB0aGlzLm9wdGlvbnMuZGlzdGFuY2VcbiAgICApO1xuICB9LFxuXG4gIF9tb3VzZURlbGF5TWV0OiBmdW5jdGlvbigvKiBldmVudCAqLykge1xuICAgIHJldHVybiB0aGlzLm1vdXNlRGVsYXlNZXQ7XG4gIH0sXG5cbiAgLy8gVGhlc2UgYXJlIHBsYWNlaG9sZGVyIG1ldGhvZHMsIHRvIGJlIG92ZXJyaWRlbiBieSBleHRlbmRpbmcgcGx1Z2luXG4gIF9tb3VzZVN0YXJ0OiBmdW5jdGlvbigvKiBldmVudCAqLykge30sXG4gIF9tb3VzZURyYWc6IGZ1bmN0aW9uKC8qIGV2ZW50ICovKSB7fSxcbiAgX21vdXNlU3RvcDogZnVuY3Rpb24oLyogZXZlbnQgKi8pIHt9LFxuICBfbW91c2VDYXB0dXJlOiBmdW5jdGlvbigvKiBldmVudCAqLykgeyByZXR1cm4gdHJ1ZTsgfVxufSk7XG5cblxuLyohXG4gKiBqUXVlcnkgVUkgRHJhZ2dhYmxlIDEuMTEuM1xuICogaHR0cDovL2pxdWVyeXVpLmNvbVxuICpcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiBodHRwOi8vanF1ZXJ5Lm9yZy9saWNlbnNlXG4gKlxuICogaHR0cDovL2FwaS5qcXVlcnl1aS5jb20vZHJhZ2dhYmxlL1xuICovXG5cblxuJC53aWRnZXQoXCJ1aS5kcmFnZ2FibGVcIiwgJC51aS5tb3VzZSwge1xuICB2ZXJzaW9uOiBcIjEuMTEuM1wiLFxuICB3aWRnZXRFdmVudFByZWZpeDogXCJkcmFnXCIsXG4gIG9wdGlvbnM6IHtcbiAgICBhZGRDbGFzc2VzOiB0cnVlLFxuICAgIGFwcGVuZFRvOiBcInBhcmVudFwiLFxuICAgIGF4aXM6IGZhbHNlLFxuICAgIGNvbm5lY3RUb1NvcnRhYmxlOiBmYWxzZSxcbiAgICBjb250YWlubWVudDogZmFsc2UsXG4gICAgY3Vyc29yOiBcImF1dG9cIixcbiAgICBjdXJzb3JBdDogZmFsc2UsXG4gICAgZ3JpZDogZmFsc2UsXG4gICAgaGFuZGxlOiBmYWxzZSxcbiAgICBoZWxwZXI6IFwib3JpZ2luYWxcIixcbiAgICBpZnJhbWVGaXg6IGZhbHNlLFxuICAgIG9wYWNpdHk6IGZhbHNlLFxuICAgIHJlZnJlc2hQb3NpdGlvbnM6IGZhbHNlLFxuICAgIHJldmVydDogZmFsc2UsXG4gICAgcmV2ZXJ0RHVyYXRpb246IDUwMCxcbiAgICBzY29wZTogXCJkZWZhdWx0XCIsXG4gICAgc2Nyb2xsOiB0cnVlLFxuICAgIHNjcm9sbFNlbnNpdGl2aXR5OiAyMCxcbiAgICBzY3JvbGxTcGVlZDogMjAsXG4gICAgc25hcDogZmFsc2UsXG4gICAgc25hcE1vZGU6IFwiYm90aFwiLFxuICAgIHNuYXBUb2xlcmFuY2U6IDIwLFxuICAgIHN0YWNrOiBmYWxzZSxcbiAgICB6SW5kZXg6IGZhbHNlLFxuXG4gICAgLy8gY2FsbGJhY2tzXG4gICAgZHJhZzogbnVsbCxcbiAgICBzdGFydDogbnVsbCxcbiAgICBzdG9wOiBudWxsXG4gIH0sXG4gIF9jcmVhdGU6IGZ1bmN0aW9uKCkge1xuXG4gICAgaWYgKCB0aGlzLm9wdGlvbnMuaGVscGVyID09PSBcIm9yaWdpbmFsXCIgKSB7XG4gICAgICB0aGlzLl9zZXRQb3NpdGlvblJlbGF0aXZlKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLm9wdGlvbnMuYWRkQ2xhc3Nlcyl7XG4gICAgICB0aGlzLmVsZW1lbnQuYWRkQ2xhc3MoXCJ1aS1kcmFnZ2FibGVcIik7XG4gICAgfVxuICAgIGlmICh0aGlzLm9wdGlvbnMuZGlzYWJsZWQpe1xuICAgICAgdGhpcy5lbGVtZW50LmFkZENsYXNzKFwidWktZHJhZ2dhYmxlLWRpc2FibGVkXCIpO1xuICAgIH1cbiAgICB0aGlzLl9zZXRIYW5kbGVDbGFzc05hbWUoKTtcblxuICAgIHRoaXMuX21vdXNlSW5pdCgpO1xuICB9LFxuXG4gIF9zZXRPcHRpb246IGZ1bmN0aW9uKCBrZXksIHZhbHVlICkge1xuICAgIHRoaXMuX3N1cGVyKCBrZXksIHZhbHVlICk7XG4gICAgaWYgKCBrZXkgPT09IFwiaGFuZGxlXCIgKSB7XG4gICAgICB0aGlzLl9yZW1vdmVIYW5kbGVDbGFzc05hbWUoKTtcbiAgICAgIHRoaXMuX3NldEhhbmRsZUNsYXNzTmFtZSgpO1xuICAgIH1cbiAgfSxcblxuICBfZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgaWYgKCAoIHRoaXMuaGVscGVyIHx8IHRoaXMuZWxlbWVudCApLmlzKCBcIi51aS1kcmFnZ2FibGUtZHJhZ2dpbmdcIiApICkge1xuICAgICAgdGhpcy5kZXN0cm95T25DbGVhciA9IHRydWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcyggXCJ1aS1kcmFnZ2FibGUgdWktZHJhZ2dhYmxlLWRyYWdnaW5nIHVpLWRyYWdnYWJsZS1kaXNhYmxlZFwiICk7XG4gICAgdGhpcy5fcmVtb3ZlSGFuZGxlQ2xhc3NOYW1lKCk7XG4gICAgdGhpcy5fbW91c2VEZXN0cm95KCk7XG4gIH0sXG5cbiAgX21vdXNlQ2FwdHVyZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgbyA9IHRoaXMub3B0aW9ucztcblxuICAgIHRoaXMuX2JsdXJBY3RpdmVFbGVtZW50KCBldmVudCApO1xuXG4gICAgLy8gYW1vbmcgb3RoZXJzLCBwcmV2ZW50IGEgZHJhZyBvbiBhIHJlc2l6YWJsZS1oYW5kbGVcbiAgICBpZiAodGhpcy5oZWxwZXIgfHwgby5kaXNhYmxlZCB8fCAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdChcIi51aS1yZXNpemFibGUtaGFuZGxlXCIpLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvL1F1aXQgaWYgd2UncmUgbm90IG9uIGEgdmFsaWQgaGFuZGxlXG4gICAgdGhpcy5oYW5kbGUgPSB0aGlzLl9nZXRIYW5kbGUoZXZlbnQpO1xuICAgIGlmICghdGhpcy5oYW5kbGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLl9ibG9ja0ZyYW1lcyggby5pZnJhbWVGaXggPT09IHRydWUgPyBcImlmcmFtZVwiIDogby5pZnJhbWVGaXggKTtcblxuICAgIHJldHVybiB0cnVlO1xuXG4gIH0sXG5cbiAgX2Jsb2NrRnJhbWVzOiBmdW5jdGlvbiggc2VsZWN0b3IgKSB7XG4gICAgdGhpcy5pZnJhbWVCbG9ja3MgPSB0aGlzLmRvY3VtZW50LmZpbmQoIHNlbGVjdG9yICkubWFwKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGlmcmFtZSA9ICQoIHRoaXMgKTtcblxuICAgICAgcmV0dXJuICQoIFwiPGRpdj5cIiApXG4gICAgICAgIC5jc3MoIFwicG9zaXRpb25cIiwgXCJhYnNvbHV0ZVwiIClcbiAgICAgICAgLmFwcGVuZFRvKCBpZnJhbWUucGFyZW50KCkgKVxuICAgICAgICAub3V0ZXJXaWR0aCggaWZyYW1lLm91dGVyV2lkdGgoKSApXG4gICAgICAgIC5vdXRlckhlaWdodCggaWZyYW1lLm91dGVySGVpZ2h0KCkgKVxuICAgICAgICAub2Zmc2V0KCBpZnJhbWUub2Zmc2V0KCkgKVsgMCBdO1xuICAgIH0pO1xuICB9LFxuXG4gIF91bmJsb2NrRnJhbWVzOiBmdW5jdGlvbigpIHtcbiAgICBpZiAoIHRoaXMuaWZyYW1lQmxvY2tzICkge1xuICAgICAgdGhpcy5pZnJhbWVCbG9ja3MucmVtb3ZlKCk7XG4gICAgICBkZWxldGUgdGhpcy5pZnJhbWVCbG9ja3M7XG4gICAgfVxuICB9LFxuXG4gIF9ibHVyQWN0aXZlRWxlbWVudDogZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgIHZhciBkb2N1bWVudCA9IHRoaXMuZG9jdW1lbnRbIDAgXTtcblxuICAgIC8vIE9ubHkgbmVlZCB0byBibHVyIGlmIHRoZSBldmVudCBvY2N1cnJlZCBvbiB0aGUgZHJhZ2dhYmxlIGl0c2VsZiwgc2VlICMxMDUyN1xuICAgIGlmICggIXRoaXMuaGFuZGxlRWxlbWVudC5pcyggZXZlbnQudGFyZ2V0ICkgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gc3VwcG9ydDogSUU5XG4gICAgLy8gSUU5IHRocm93cyBhbiBcIlVuc3BlY2lmaWVkIGVycm9yXCIgYWNjZXNzaW5nIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgZnJvbSBhbiA8aWZyYW1lPlxuICAgIHRyeSB7XG5cbiAgICAgIC8vIFN1cHBvcnQ6IElFOSwgSUUxMFxuICAgICAgLy8gSWYgdGhlIDxib2R5PiBpcyBibHVycmVkLCBJRSB3aWxsIHN3aXRjaCB3aW5kb3dzLCBzZWUgIzk1MjBcbiAgICAgIGlmICggZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgIT09IFwiYm9keVwiICkge1xuXG4gICAgICAgIC8vIEJsdXIgYW55IGVsZW1lbnQgdGhhdCBjdXJyZW50bHkgaGFzIGZvY3VzLCBzZWUgIzQyNjFcbiAgICAgICAgJCggZG9jdW1lbnQuYWN0aXZlRWxlbWVudCApLmJsdXIoKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoICggZXJyb3IgKSB7fVxuICB9LFxuXG4gIF9tb3VzZVN0YXJ0OiBmdW5jdGlvbihldmVudCkge1xuXG4gICAgdmFyIG8gPSB0aGlzLm9wdGlvbnM7XG5cbiAgICAvL0NyZWF0ZSBhbmQgYXBwZW5kIHRoZSB2aXNpYmxlIGhlbHBlclxuICAgIHRoaXMuaGVscGVyID0gdGhpcy5fY3JlYXRlSGVscGVyKGV2ZW50KTtcblxuICAgIHRoaXMuaGVscGVyLmFkZENsYXNzKFwidWktZHJhZ2dhYmxlLWRyYWdnaW5nXCIpO1xuXG4gICAgLy9DYWNoZSB0aGUgaGVscGVyIHNpemVcbiAgICB0aGlzLl9jYWNoZUhlbHBlclByb3BvcnRpb25zKCk7XG5cbiAgICAvL0lmIGRkbWFuYWdlciBpcyB1c2VkIGZvciBkcm9wcGFibGVzLCBzZXQgdGhlIGdsb2JhbCBkcmFnZ2FibGVcbiAgICBpZiAoJC51aS5kZG1hbmFnZXIpIHtcbiAgICAgICQudWkuZGRtYW5hZ2VyLmN1cnJlbnQgPSB0aGlzO1xuICAgIH1cblxuICAgIC8qXG4gICAgICogLSBQb3NpdGlvbiBnZW5lcmF0aW9uIC1cbiAgICAgKiBUaGlzIGJsb2NrIGdlbmVyYXRlcyBldmVyeXRoaW5nIHBvc2l0aW9uIHJlbGF0ZWQgLSBpdCdzIHRoZSBjb3JlIG9mIGRyYWdnYWJsZXMuXG4gICAgICovXG5cbiAgICAvL0NhY2hlIHRoZSBtYXJnaW5zIG9mIHRoZSBvcmlnaW5hbCBlbGVtZW50XG4gICAgdGhpcy5fY2FjaGVNYXJnaW5zKCk7XG5cbiAgICAvL1N0b3JlIHRoZSBoZWxwZXIncyBjc3MgcG9zaXRpb25cbiAgICB0aGlzLmNzc1Bvc2l0aW9uID0gdGhpcy5oZWxwZXIuY3NzKCBcInBvc2l0aW9uXCIgKTtcbiAgICB0aGlzLnNjcm9sbFBhcmVudCA9IHRoaXMuaGVscGVyLnNjcm9sbFBhcmVudCggdHJ1ZSApO1xuICAgIHRoaXMub2Zmc2V0UGFyZW50ID0gdGhpcy5oZWxwZXIub2Zmc2V0UGFyZW50KCk7XG4gICAgdGhpcy5oYXNGaXhlZEFuY2VzdG9yID0gdGhpcy5oZWxwZXIucGFyZW50cygpLmZpbHRlcihmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuICQoIHRoaXMgKS5jc3MoIFwicG9zaXRpb25cIiApID09PSBcImZpeGVkXCI7XG4gICAgICB9KS5sZW5ndGggPiAwO1xuXG4gICAgLy9UaGUgZWxlbWVudCdzIGFic29sdXRlIHBvc2l0aW9uIG9uIHRoZSBwYWdlIG1pbnVzIG1hcmdpbnNcbiAgICB0aGlzLnBvc2l0aW9uQWJzID0gdGhpcy5lbGVtZW50Lm9mZnNldCgpO1xuICAgIHRoaXMuX3JlZnJlc2hPZmZzZXRzKCBldmVudCApO1xuXG4gICAgLy9HZW5lcmF0ZSB0aGUgb3JpZ2luYWwgcG9zaXRpb25cbiAgICB0aGlzLm9yaWdpbmFsUG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uID0gdGhpcy5fZ2VuZXJhdGVQb3NpdGlvbiggZXZlbnQsIGZhbHNlICk7XG4gICAgdGhpcy5vcmlnaW5hbFBhZ2VYID0gZXZlbnQucGFnZVg7XG4gICAgdGhpcy5vcmlnaW5hbFBhZ2VZID0gZXZlbnQucGFnZVk7XG5cbiAgICAvL0FkanVzdCB0aGUgbW91c2Ugb2Zmc2V0IHJlbGF0aXZlIHRvIHRoZSBoZWxwZXIgaWYgXCJjdXJzb3JBdFwiIGlzIHN1cHBsaWVkXG4gICAgKG8uY3Vyc29yQXQgJiYgdGhpcy5fYWRqdXN0T2Zmc2V0RnJvbUhlbHBlcihvLmN1cnNvckF0KSk7XG5cbiAgICAvL1NldCBhIGNvbnRhaW5tZW50IGlmIGdpdmVuIGluIHRoZSBvcHRpb25zXG4gICAgdGhpcy5fc2V0Q29udGFpbm1lbnQoKTtcblxuICAgIC8vVHJpZ2dlciBldmVudCArIGNhbGxiYWNrc1xuICAgIGlmICh0aGlzLl90cmlnZ2VyKFwic3RhcnRcIiwgZXZlbnQpID09PSBmYWxzZSkge1xuICAgICAgdGhpcy5fY2xlYXIoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvL1JlY2FjaGUgdGhlIGhlbHBlciBzaXplXG4gICAgdGhpcy5fY2FjaGVIZWxwZXJQcm9wb3J0aW9ucygpO1xuXG4gICAgLy9QcmVwYXJlIHRoZSBkcm9wcGFibGUgb2Zmc2V0c1xuICAgIGlmICgkLnVpLmRkbWFuYWdlciAmJiAhby5kcm9wQmVoYXZpb3VyKSB7XG4gICAgICAkLnVpLmRkbWFuYWdlci5wcmVwYXJlT2Zmc2V0cyh0aGlzLCBldmVudCk7XG4gICAgfVxuXG4gICAgLy8gUmVzZXQgaGVscGVyJ3MgcmlnaHQvYm90dG9tIGNzcyBpZiB0aGV5J3JlIHNldCBhbmQgc2V0IGV4cGxpY2l0IHdpZHRoL2hlaWdodCBpbnN0ZWFkXG4gICAgLy8gYXMgdGhpcyBwcmV2ZW50cyByZXNpemluZyBvZiBlbGVtZW50cyB3aXRoIHJpZ2h0L2JvdHRvbSBzZXQgKHNlZSAjNzc3MilcbiAgICB0aGlzLl9ub3JtYWxpemVSaWdodEJvdHRvbSgpO1xuXG4gICAgdGhpcy5fbW91c2VEcmFnKGV2ZW50LCB0cnVlKTsgLy9FeGVjdXRlIHRoZSBkcmFnIG9uY2UgLSB0aGlzIGNhdXNlcyB0aGUgaGVscGVyIG5vdCB0byBiZSB2aXNpYmxlIGJlZm9yZSBnZXR0aW5nIGl0cyBjb3JyZWN0IHBvc2l0aW9uXG5cbiAgICAvL0lmIHRoZSBkZG1hbmFnZXIgaXMgdXNlZCBmb3IgZHJvcHBhYmxlcywgaW5mb3JtIHRoZSBtYW5hZ2VyIHRoYXQgZHJhZ2dpbmcgaGFzIHN0YXJ0ZWQgKHNlZSAjNTAwMylcbiAgICBpZiAoICQudWkuZGRtYW5hZ2VyICkge1xuICAgICAgJC51aS5kZG1hbmFnZXIuZHJhZ1N0YXJ0KHRoaXMsIGV2ZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcblxuICBfcmVmcmVzaE9mZnNldHM6IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICB0aGlzLm9mZnNldCA9IHtcbiAgICAgIHRvcDogdGhpcy5wb3NpdGlvbkFicy50b3AgLSB0aGlzLm1hcmdpbnMudG9wLFxuICAgICAgbGVmdDogdGhpcy5wb3NpdGlvbkFicy5sZWZ0IC0gdGhpcy5tYXJnaW5zLmxlZnQsXG4gICAgICBzY3JvbGw6IGZhbHNlLFxuICAgICAgcGFyZW50OiB0aGlzLl9nZXRQYXJlbnRPZmZzZXQoKSxcbiAgICAgIHJlbGF0aXZlOiB0aGlzLl9nZXRSZWxhdGl2ZU9mZnNldCgpXG4gICAgfTtcblxuICAgIHRoaXMub2Zmc2V0LmNsaWNrID0ge1xuICAgICAgbGVmdDogZXZlbnQucGFnZVggLSB0aGlzLm9mZnNldC5sZWZ0LFxuICAgICAgdG9wOiBldmVudC5wYWdlWSAtIHRoaXMub2Zmc2V0LnRvcFxuICAgIH07XG4gIH0sXG5cbiAgX21vdXNlRHJhZzogZnVuY3Rpb24oZXZlbnQsIG5vUHJvcGFnYXRpb24pIHtcbiAgICAvLyByZXNldCBhbnkgbmVjZXNzYXJ5IGNhY2hlZCBwcm9wZXJ0aWVzIChzZWUgIzUwMDkpXG4gICAgaWYgKCB0aGlzLmhhc0ZpeGVkQW5jZXN0b3IgKSB7XG4gICAgICB0aGlzLm9mZnNldC5wYXJlbnQgPSB0aGlzLl9nZXRQYXJlbnRPZmZzZXQoKTtcbiAgICB9XG5cbiAgICAvL0NvbXB1dGUgdGhlIGhlbHBlcnMgcG9zaXRpb25cbiAgICB0aGlzLnBvc2l0aW9uID0gdGhpcy5fZ2VuZXJhdGVQb3NpdGlvbiggZXZlbnQsIHRydWUgKTtcbiAgICB0aGlzLnBvc2l0aW9uQWJzID0gdGhpcy5fY29udmVydFBvc2l0aW9uVG8oXCJhYnNvbHV0ZVwiKTtcblxuICAgIC8vQ2FsbCBwbHVnaW5zIGFuZCBjYWxsYmFja3MgYW5kIHVzZSB0aGUgcmVzdWx0aW5nIHBvc2l0aW9uIGlmIHNvbWV0aGluZyBpcyByZXR1cm5lZFxuICAgIGlmICghbm9Qcm9wYWdhdGlvbikge1xuICAgICAgdmFyIHVpID0gdGhpcy5fdWlIYXNoKCk7XG4gICAgICBpZiAodGhpcy5fdHJpZ2dlcihcImRyYWdcIiwgZXZlbnQsIHVpKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5fbW91c2VVcCh7fSk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHRoaXMucG9zaXRpb24gPSB1aS5wb3NpdGlvbjtcbiAgICB9XG5cbiAgICB0aGlzLmhlbHBlclsgMCBdLnN0eWxlLmxlZnQgPSB0aGlzLnBvc2l0aW9uLmxlZnQgKyBcInB4XCI7XG4gICAgdGhpcy5oZWxwZXJbIDAgXS5zdHlsZS50b3AgPSB0aGlzLnBvc2l0aW9uLnRvcCArIFwicHhcIjtcblxuICAgIGlmICgkLnVpLmRkbWFuYWdlcikge1xuICAgICAgJC51aS5kZG1hbmFnZXIuZHJhZyh0aGlzLCBldmVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIF9tb3VzZVN0b3A6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICAvL0lmIHdlIGFyZSB1c2luZyBkcm9wcGFibGVzLCBpbmZvcm0gdGhlIG1hbmFnZXIgYWJvdXQgdGhlIGRyb3BcbiAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICBkcm9wcGVkID0gZmFsc2U7XG4gICAgaWYgKCQudWkuZGRtYW5hZ2VyICYmICF0aGlzLm9wdGlvbnMuZHJvcEJlaGF2aW91cikge1xuICAgICAgZHJvcHBlZCA9ICQudWkuZGRtYW5hZ2VyLmRyb3AodGhpcywgZXZlbnQpO1xuICAgIH1cblxuICAgIC8vaWYgYSBkcm9wIGNvbWVzIGZyb20gb3V0c2lkZSAoYSBzb3J0YWJsZSlcbiAgICBpZiAodGhpcy5kcm9wcGVkKSB7XG4gICAgICBkcm9wcGVkID0gdGhpcy5kcm9wcGVkO1xuICAgICAgdGhpcy5kcm9wcGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCh0aGlzLm9wdGlvbnMucmV2ZXJ0ID09PSBcImludmFsaWRcIiAmJiAhZHJvcHBlZCkgfHwgKHRoaXMub3B0aW9ucy5yZXZlcnQgPT09IFwidmFsaWRcIiAmJiBkcm9wcGVkKSB8fCB0aGlzLm9wdGlvbnMucmV2ZXJ0ID09PSB0cnVlIHx8ICgkLmlzRnVuY3Rpb24odGhpcy5vcHRpb25zLnJldmVydCkgJiYgdGhpcy5vcHRpb25zLnJldmVydC5jYWxsKHRoaXMuZWxlbWVudCwgZHJvcHBlZCkpKSB7XG4gICAgICAkKHRoaXMuaGVscGVyKS5hbmltYXRlKHRoaXMub3JpZ2luYWxQb3NpdGlvbiwgcGFyc2VJbnQodGhpcy5vcHRpb25zLnJldmVydER1cmF0aW9uLCAxMCksIGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhhdC5fdHJpZ2dlcihcInN0b3BcIiwgZXZlbnQpICE9PSBmYWxzZSkge1xuICAgICAgICAgIHRoYXQuX2NsZWFyKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5fdHJpZ2dlcihcInN0b3BcIiwgZXZlbnQpICE9PSBmYWxzZSkge1xuICAgICAgICB0aGlzLl9jbGVhcigpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICBfbW91c2VVcDogZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgIHRoaXMuX3VuYmxvY2tGcmFtZXMoKTtcblxuICAgIC8vSWYgdGhlIGRkbWFuYWdlciBpcyB1c2VkIGZvciBkcm9wcGFibGVzLCBpbmZvcm0gdGhlIG1hbmFnZXIgdGhhdCBkcmFnZ2luZyBoYXMgc3RvcHBlZCAoc2VlICM1MDAzKVxuICAgIGlmICggJC51aS5kZG1hbmFnZXIgKSB7XG4gICAgICAkLnVpLmRkbWFuYWdlci5kcmFnU3RvcCh0aGlzLCBldmVudCk7XG4gICAgfVxuXG4gICAgLy8gT25seSBuZWVkIHRvIGZvY3VzIGlmIHRoZSBldmVudCBvY2N1cnJlZCBvbiB0aGUgZHJhZ2dhYmxlIGl0c2VsZiwgc2VlICMxMDUyN1xuICAgIGlmICggdGhpcy5oYW5kbGVFbGVtZW50LmlzKCBldmVudC50YXJnZXQgKSApIHtcbiAgICAgIC8vIFRoZSBpbnRlcmFjdGlvbiBpcyBvdmVyOyB3aGV0aGVyIG9yIG5vdCB0aGUgY2xpY2sgcmVzdWx0ZWQgaW4gYSBkcmFnLCBmb2N1cyB0aGUgZWxlbWVudFxuICAgICAgdGhpcy5lbGVtZW50LmZvY3VzKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuICQudWkubW91c2UucHJvdG90eXBlLl9tb3VzZVVwLmNhbGwodGhpcywgZXZlbnQpO1xuICB9LFxuXG4gIGNhbmNlbDogZnVuY3Rpb24oKSB7XG5cbiAgICBpZiAodGhpcy5oZWxwZXIuaXMoXCIudWktZHJhZ2dhYmxlLWRyYWdnaW5nXCIpKSB7XG4gICAgICB0aGlzLl9tb3VzZVVwKHt9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY2xlYXIoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcblxuICB9LFxuXG4gIF9nZXRIYW5kbGU6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5oYW5kbGUgP1xuICAgICAgISEkKCBldmVudC50YXJnZXQgKS5jbG9zZXN0KCB0aGlzLmVsZW1lbnQuZmluZCggdGhpcy5vcHRpb25zLmhhbmRsZSApICkubGVuZ3RoIDpcbiAgICAgIHRydWU7XG4gIH0sXG5cbiAgX3NldEhhbmRsZUNsYXNzTmFtZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5oYW5kbGVFbGVtZW50ID0gdGhpcy5vcHRpb25zLmhhbmRsZSA/XG4gICAgICB0aGlzLmVsZW1lbnQuZmluZCggdGhpcy5vcHRpb25zLmhhbmRsZSApIDogdGhpcy5lbGVtZW50O1xuICAgIHRoaXMuaGFuZGxlRWxlbWVudC5hZGRDbGFzcyggXCJ1aS1kcmFnZ2FibGUtaGFuZGxlXCIgKTtcbiAgfSxcblxuICBfcmVtb3ZlSGFuZGxlQ2xhc3NOYW1lOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmhhbmRsZUVsZW1lbnQucmVtb3ZlQ2xhc3MoIFwidWktZHJhZ2dhYmxlLWhhbmRsZVwiICk7XG4gIH0sXG5cbiAgX2NyZWF0ZUhlbHBlcjogZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgIHZhciBvID0gdGhpcy5vcHRpb25zLFxuICAgICAgaGVscGVySXNGdW5jdGlvbiA9ICQuaXNGdW5jdGlvbiggby5oZWxwZXIgKSxcbiAgICAgIGhlbHBlciA9IGhlbHBlcklzRnVuY3Rpb24gP1xuICAgICAgICAkKCBvLmhlbHBlci5hcHBseSggdGhpcy5lbGVtZW50WyAwIF0sIFsgZXZlbnQgXSApICkgOlxuICAgICAgICAoIG8uaGVscGVyID09PSBcImNsb25lXCIgP1xuICAgICAgICAgIHRoaXMuZWxlbWVudC5jbG9uZSgpLnJlbW92ZUF0dHIoIFwiaWRcIiApIDpcbiAgICAgICAgICB0aGlzLmVsZW1lbnQgKTtcblxuICAgIGlmICghaGVscGVyLnBhcmVudHMoXCJib2R5XCIpLmxlbmd0aCkge1xuICAgICAgaGVscGVyLmFwcGVuZFRvKChvLmFwcGVuZFRvID09PSBcInBhcmVudFwiID8gdGhpcy5lbGVtZW50WzBdLnBhcmVudE5vZGUgOiBvLmFwcGVuZFRvKSk7XG4gICAgfVxuXG4gICAgLy8gaHR0cDovL2J1Z3MuanF1ZXJ5dWkuY29tL3RpY2tldC85NDQ2XG4gICAgLy8gYSBoZWxwZXIgZnVuY3Rpb24gY2FuIHJldHVybiB0aGUgb3JpZ2luYWwgZWxlbWVudFxuICAgIC8vIHdoaWNoIHdvdWxkbid0IGhhdmUgYmVlbiBzZXQgdG8gcmVsYXRpdmUgaW4gX2NyZWF0ZVxuICAgIGlmICggaGVscGVySXNGdW5jdGlvbiAmJiBoZWxwZXJbIDAgXSA9PT0gdGhpcy5lbGVtZW50WyAwIF0gKSB7XG4gICAgICB0aGlzLl9zZXRQb3NpdGlvblJlbGF0aXZlKCk7XG4gICAgfVxuXG4gICAgaWYgKGhlbHBlclswXSAhPT0gdGhpcy5lbGVtZW50WzBdICYmICEoLyhmaXhlZHxhYnNvbHV0ZSkvKS50ZXN0KGhlbHBlci5jc3MoXCJwb3NpdGlvblwiKSkpIHtcbiAgICAgIGhlbHBlci5jc3MoXCJwb3NpdGlvblwiLCBcImFic29sdXRlXCIpO1xuICAgIH1cblxuICAgIHJldHVybiBoZWxwZXI7XG5cbiAgfSxcblxuICBfc2V0UG9zaXRpb25SZWxhdGl2ZTogZnVuY3Rpb24oKSB7XG4gICAgaWYgKCAhKCAvXig/OnJ8YXxmKS8gKS50ZXN0KCB0aGlzLmVsZW1lbnQuY3NzKCBcInBvc2l0aW9uXCIgKSApICkge1xuICAgICAgdGhpcy5lbGVtZW50WyAwIF0uc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XG4gICAgfVxuICB9LFxuXG4gIF9hZGp1c3RPZmZzZXRGcm9tSGVscGVyOiBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAodHlwZW9mIG9iaiA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgb2JqID0gb2JqLnNwbGl0KFwiIFwiKTtcbiAgICB9XG4gICAgaWYgKCQuaXNBcnJheShvYmopKSB7XG4gICAgICBvYmogPSB7IGxlZnQ6ICtvYmpbMF0sIHRvcDogK29ialsxXSB8fCAwIH07XG4gICAgfVxuICAgIGlmIChcImxlZnRcIiBpbiBvYmopIHtcbiAgICAgIHRoaXMub2Zmc2V0LmNsaWNrLmxlZnQgPSBvYmoubGVmdCArIHRoaXMubWFyZ2lucy5sZWZ0O1xuICAgIH1cbiAgICBpZiAoXCJyaWdodFwiIGluIG9iaikge1xuICAgICAgdGhpcy5vZmZzZXQuY2xpY2subGVmdCA9IHRoaXMuaGVscGVyUHJvcG9ydGlvbnMud2lkdGggLSBvYmoucmlnaHQgKyB0aGlzLm1hcmdpbnMubGVmdDtcbiAgICB9XG4gICAgaWYgKFwidG9wXCIgaW4gb2JqKSB7XG4gICAgICB0aGlzLm9mZnNldC5jbGljay50b3AgPSBvYmoudG9wICsgdGhpcy5tYXJnaW5zLnRvcDtcbiAgICB9XG4gICAgaWYgKFwiYm90dG9tXCIgaW4gb2JqKSB7XG4gICAgICB0aGlzLm9mZnNldC5jbGljay50b3AgPSB0aGlzLmhlbHBlclByb3BvcnRpb25zLmhlaWdodCAtIG9iai5ib3R0b20gKyB0aGlzLm1hcmdpbnMudG9wO1xuICAgIH1cbiAgfSxcblxuICBfaXNSb290Tm9kZTogZnVuY3Rpb24oIGVsZW1lbnQgKSB7XG4gICAgcmV0dXJuICggLyhodG1sfGJvZHkpL2kgKS50ZXN0KCBlbGVtZW50LnRhZ05hbWUgKSB8fCBlbGVtZW50ID09PSB0aGlzLmRvY3VtZW50WyAwIF07XG4gIH0sXG5cbiAgX2dldFBhcmVudE9mZnNldDogZnVuY3Rpb24oKSB7XG5cbiAgICAvL0dldCB0aGUgb2Zmc2V0UGFyZW50IGFuZCBjYWNoZSBpdHMgcG9zaXRpb25cbiAgICB2YXIgcG8gPSB0aGlzLm9mZnNldFBhcmVudC5vZmZzZXQoKSxcbiAgICAgIGRvY3VtZW50ID0gdGhpcy5kb2N1bWVudFsgMCBdO1xuXG4gICAgLy8gVGhpcyBpcyBhIHNwZWNpYWwgY2FzZSB3aGVyZSB3ZSBuZWVkIHRvIG1vZGlmeSBhIG9mZnNldCBjYWxjdWxhdGVkIG9uIHN0YXJ0LCBzaW5jZSB0aGUgZm9sbG93aW5nIGhhcHBlbmVkOlxuICAgIC8vIDEuIFRoZSBwb3NpdGlvbiBvZiB0aGUgaGVscGVyIGlzIGFic29sdXRlLCBzbyBpdCdzIHBvc2l0aW9uIGlzIGNhbGN1bGF0ZWQgYmFzZWQgb24gdGhlIG5leHQgcG9zaXRpb25lZCBwYXJlbnRcbiAgICAvLyAyLiBUaGUgYWN0dWFsIG9mZnNldCBwYXJlbnQgaXMgYSBjaGlsZCBvZiB0aGUgc2Nyb2xsIHBhcmVudCwgYW5kIHRoZSBzY3JvbGwgcGFyZW50IGlzbid0IHRoZSBkb2N1bWVudCwgd2hpY2ggbWVhbnMgdGhhdFxuICAgIC8vICAgIHRoZSBzY3JvbGwgaXMgaW5jbHVkZWQgaW4gdGhlIGluaXRpYWwgY2FsY3VsYXRpb24gb2YgdGhlIG9mZnNldCBvZiB0aGUgcGFyZW50LCBhbmQgbmV2ZXIgcmVjYWxjdWxhdGVkIHVwb24gZHJhZ1xuICAgIGlmICh0aGlzLmNzc1Bvc2l0aW9uID09PSBcImFic29sdXRlXCIgJiYgdGhpcy5zY3JvbGxQYXJlbnRbMF0gIT09IGRvY3VtZW50ICYmICQuY29udGFpbnModGhpcy5zY3JvbGxQYXJlbnRbMF0sIHRoaXMub2Zmc2V0UGFyZW50WzBdKSkge1xuICAgICAgcG8ubGVmdCArPSB0aGlzLnNjcm9sbFBhcmVudC5zY3JvbGxMZWZ0KCk7XG4gICAgICBwby50b3AgKz0gdGhpcy5zY3JvbGxQYXJlbnQuc2Nyb2xsVG9wKCk7XG4gICAgfVxuXG4gICAgaWYgKCB0aGlzLl9pc1Jvb3ROb2RlKCB0aGlzLm9mZnNldFBhcmVudFsgMCBdICkgKSB7XG4gICAgICBwbyA9IHsgdG9wOiAwLCBsZWZ0OiAwIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRvcDogcG8udG9wICsgKHBhcnNlSW50KHRoaXMub2Zmc2V0UGFyZW50LmNzcyhcImJvcmRlclRvcFdpZHRoXCIpLCAxMCkgfHwgMCksXG4gICAgICBsZWZ0OiBwby5sZWZ0ICsgKHBhcnNlSW50KHRoaXMub2Zmc2V0UGFyZW50LmNzcyhcImJvcmRlckxlZnRXaWR0aFwiKSwgMTApIHx8IDApXG4gICAgfTtcblxuICB9LFxuXG4gIF9nZXRSZWxhdGl2ZU9mZnNldDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKCB0aGlzLmNzc1Bvc2l0aW9uICE9PSBcInJlbGF0aXZlXCIgKSB7XG4gICAgICByZXR1cm4geyB0b3A6IDAsIGxlZnQ6IDAgfTtcbiAgICB9XG5cbiAgICB2YXIgcCA9IHRoaXMuZWxlbWVudC5wb3NpdGlvbigpLFxuICAgICAgc2Nyb2xsSXNSb290Tm9kZSA9IHRoaXMuX2lzUm9vdE5vZGUoIHRoaXMuc2Nyb2xsUGFyZW50WyAwIF0gKTtcblxuICAgIHJldHVybiB7XG4gICAgICB0b3A6IHAudG9wIC0gKCBwYXJzZUludCh0aGlzLmhlbHBlci5jc3MoIFwidG9wXCIgKSwgMTApIHx8IDAgKSArICggIXNjcm9sbElzUm9vdE5vZGUgPyB0aGlzLnNjcm9sbFBhcmVudC5zY3JvbGxUb3AoKSA6IDAgKSxcbiAgICAgIGxlZnQ6IHAubGVmdCAtICggcGFyc2VJbnQodGhpcy5oZWxwZXIuY3NzKCBcImxlZnRcIiApLCAxMCkgfHwgMCApICsgKCAhc2Nyb2xsSXNSb290Tm9kZSA/IHRoaXMuc2Nyb2xsUGFyZW50LnNjcm9sbExlZnQoKSA6IDAgKVxuICAgIH07XG5cbiAgfSxcblxuICBfY2FjaGVNYXJnaW5zOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm1hcmdpbnMgPSB7XG4gICAgICBsZWZ0OiAocGFyc2VJbnQodGhpcy5lbGVtZW50LmNzcyhcIm1hcmdpbkxlZnRcIiksIDEwKSB8fCAwKSxcbiAgICAgIHRvcDogKHBhcnNlSW50KHRoaXMuZWxlbWVudC5jc3MoXCJtYXJnaW5Ub3BcIiksIDEwKSB8fCAwKSxcbiAgICAgIHJpZ2h0OiAocGFyc2VJbnQodGhpcy5lbGVtZW50LmNzcyhcIm1hcmdpblJpZ2h0XCIpLCAxMCkgfHwgMCksXG4gICAgICBib3R0b206IChwYXJzZUludCh0aGlzLmVsZW1lbnQuY3NzKFwibWFyZ2luQm90dG9tXCIpLCAxMCkgfHwgMClcbiAgICB9O1xuICB9LFxuXG4gIF9jYWNoZUhlbHBlclByb3BvcnRpb25zOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmhlbHBlclByb3BvcnRpb25zID0ge1xuICAgICAgd2lkdGg6IHRoaXMuaGVscGVyLm91dGVyV2lkdGgoKSxcbiAgICAgIGhlaWdodDogdGhpcy5oZWxwZXIub3V0ZXJIZWlnaHQoKVxuICAgIH07XG4gIH0sXG5cbiAgX3NldENvbnRhaW5tZW50OiBmdW5jdGlvbigpIHtcblxuICAgIHZhciBpc1VzZXJTY3JvbGxhYmxlLCBjLCBjZSxcbiAgICAgIG8gPSB0aGlzLm9wdGlvbnMsXG4gICAgICBkb2N1bWVudCA9IHRoaXMuZG9jdW1lbnRbIDAgXTtcblxuICAgIHRoaXMucmVsYXRpdmVDb250YWluZXIgPSBudWxsO1xuXG4gICAgaWYgKCAhby5jb250YWlubWVudCApIHtcbiAgICAgIHRoaXMuY29udGFpbm1lbnQgPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICggby5jb250YWlubWVudCA9PT0gXCJ3aW5kb3dcIiApIHtcbiAgICAgIHRoaXMuY29udGFpbm1lbnQgPSBbXG4gICAgICAgICQoIHdpbmRvdyApLnNjcm9sbExlZnQoKSAtIHRoaXMub2Zmc2V0LnJlbGF0aXZlLmxlZnQgLSB0aGlzLm9mZnNldC5wYXJlbnQubGVmdCxcbiAgICAgICAgJCggd2luZG93ICkuc2Nyb2xsVG9wKCkgLSB0aGlzLm9mZnNldC5yZWxhdGl2ZS50b3AgLSB0aGlzLm9mZnNldC5wYXJlbnQudG9wLFxuICAgICAgICAkKCB3aW5kb3cgKS5zY3JvbGxMZWZ0KCkgKyAkKCB3aW5kb3cgKS53aWR0aCgpIC0gdGhpcy5oZWxwZXJQcm9wb3J0aW9ucy53aWR0aCAtIHRoaXMubWFyZ2lucy5sZWZ0LFxuICAgICAgICAkKCB3aW5kb3cgKS5zY3JvbGxUb3AoKSArICggJCggd2luZG93ICkuaGVpZ2h0KCkgfHwgZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlLnNjcm9sbEhlaWdodCApIC0gdGhpcy5oZWxwZXJQcm9wb3J0aW9ucy5oZWlnaHQgLSB0aGlzLm1hcmdpbnMudG9wXG4gICAgICBdO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICggby5jb250YWlubWVudCA9PT0gXCJkb2N1bWVudFwiKSB7XG4gICAgICB0aGlzLmNvbnRhaW5tZW50ID0gW1xuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICAkKCBkb2N1bWVudCApLndpZHRoKCkgLSB0aGlzLmhlbHBlclByb3BvcnRpb25zLndpZHRoIC0gdGhpcy5tYXJnaW5zLmxlZnQsXG4gICAgICAgICggJCggZG9jdW1lbnQgKS5oZWlnaHQoKSB8fCBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUuc2Nyb2xsSGVpZ2h0ICkgLSB0aGlzLmhlbHBlclByb3BvcnRpb25zLmhlaWdodCAtIHRoaXMubWFyZ2lucy50b3BcbiAgICAgIF07XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCBvLmNvbnRhaW5tZW50LmNvbnN0cnVjdG9yID09PSBBcnJheSApIHtcbiAgICAgIHRoaXMuY29udGFpbm1lbnQgPSBvLmNvbnRhaW5tZW50O1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICggby5jb250YWlubWVudCA9PT0gXCJwYXJlbnRcIiApIHtcbiAgICAgIG8uY29udGFpbm1lbnQgPSB0aGlzLmhlbHBlclsgMCBdLnBhcmVudE5vZGU7XG4gICAgfVxuXG4gICAgYyA9ICQoIG8uY29udGFpbm1lbnQgKTtcbiAgICBjZSA9IGNbIDAgXTtcblxuICAgIGlmICggIWNlICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlzVXNlclNjcm9sbGFibGUgPSAvKHNjcm9sbHxhdXRvKS8udGVzdCggYy5jc3MoIFwib3ZlcmZsb3dcIiApICk7XG5cbiAgICB0aGlzLmNvbnRhaW5tZW50ID0gW1xuICAgICAgKCBwYXJzZUludCggYy5jc3MoIFwiYm9yZGVyTGVmdFdpZHRoXCIgKSwgMTAgKSB8fCAwICkgKyAoIHBhcnNlSW50KCBjLmNzcyggXCJwYWRkaW5nTGVmdFwiICksIDEwICkgfHwgMCApLFxuICAgICAgKCBwYXJzZUludCggYy5jc3MoIFwiYm9yZGVyVG9wV2lkdGhcIiApLCAxMCApIHx8IDAgKSArICggcGFyc2VJbnQoIGMuY3NzKCBcInBhZGRpbmdUb3BcIiApLCAxMCApIHx8IDAgKSxcbiAgICAgICggaXNVc2VyU2Nyb2xsYWJsZSA/IE1hdGgubWF4KCBjZS5zY3JvbGxXaWR0aCwgY2Uub2Zmc2V0V2lkdGggKSA6IGNlLm9mZnNldFdpZHRoICkgLVxuICAgICAgICAoIHBhcnNlSW50KCBjLmNzcyggXCJib3JkZXJSaWdodFdpZHRoXCIgKSwgMTAgKSB8fCAwICkgLVxuICAgICAgICAoIHBhcnNlSW50KCBjLmNzcyggXCJwYWRkaW5nUmlnaHRcIiApLCAxMCApIHx8IDAgKSAtXG4gICAgICAgIHRoaXMuaGVscGVyUHJvcG9ydGlvbnMud2lkdGggLVxuICAgICAgICB0aGlzLm1hcmdpbnMubGVmdCAtXG4gICAgICAgIHRoaXMubWFyZ2lucy5yaWdodCxcbiAgICAgICggaXNVc2VyU2Nyb2xsYWJsZSA/IE1hdGgubWF4KCBjZS5zY3JvbGxIZWlnaHQsIGNlLm9mZnNldEhlaWdodCApIDogY2Uub2Zmc2V0SGVpZ2h0ICkgLVxuICAgICAgICAoIHBhcnNlSW50KCBjLmNzcyggXCJib3JkZXJCb3R0b21XaWR0aFwiICksIDEwICkgfHwgMCApIC1cbiAgICAgICAgKCBwYXJzZUludCggYy5jc3MoIFwicGFkZGluZ0JvdHRvbVwiICksIDEwICkgfHwgMCApIC1cbiAgICAgICAgdGhpcy5oZWxwZXJQcm9wb3J0aW9ucy5oZWlnaHQgLVxuICAgICAgICB0aGlzLm1hcmdpbnMudG9wIC1cbiAgICAgICAgdGhpcy5tYXJnaW5zLmJvdHRvbVxuICAgIF07XG4gICAgdGhpcy5yZWxhdGl2ZUNvbnRhaW5lciA9IGM7XG4gIH0sXG5cbiAgX2NvbnZlcnRQb3NpdGlvblRvOiBmdW5jdGlvbihkLCBwb3MpIHtcblxuICAgIGlmICghcG9zKSB7XG4gICAgICBwb3MgPSB0aGlzLnBvc2l0aW9uO1xuICAgIH1cblxuICAgIHZhciBtb2QgPSBkID09PSBcImFic29sdXRlXCIgPyAxIDogLTEsXG4gICAgICBzY3JvbGxJc1Jvb3ROb2RlID0gdGhpcy5faXNSb290Tm9kZSggdGhpcy5zY3JvbGxQYXJlbnRbIDAgXSApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRvcDogKFxuICAgICAgICBwb3MudG9wICsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIGFic29sdXRlIG1vdXNlIHBvc2l0aW9uXG4gICAgICAgIHRoaXMub2Zmc2V0LnJlbGF0aXZlLnRvcCAqIG1vZCArICAgICAgICAgICAgICAgICAgICAvLyBPbmx5IGZvciByZWxhdGl2ZSBwb3NpdGlvbmVkIG5vZGVzOiBSZWxhdGl2ZSBvZmZzZXQgZnJvbSBlbGVtZW50IHRvIG9mZnNldCBwYXJlbnRcbiAgICAgICAgdGhpcy5vZmZzZXQucGFyZW50LnRvcCAqIG1vZCAtICAgICAgICAgICAgICAgICAgICAvLyBUaGUgb2Zmc2V0UGFyZW50J3Mgb2Zmc2V0IHdpdGhvdXQgYm9yZGVycyAob2Zmc2V0ICsgYm9yZGVyKVxuICAgICAgICAoICggdGhpcy5jc3NQb3NpdGlvbiA9PT0gXCJmaXhlZFwiID8gLXRoaXMub2Zmc2V0LnNjcm9sbC50b3AgOiAoIHNjcm9sbElzUm9vdE5vZGUgPyAwIDogdGhpcy5vZmZzZXQuc2Nyb2xsLnRvcCApICkgKiBtb2QpXG4gICAgICApLFxuICAgICAgbGVmdDogKFxuICAgICAgICBwb3MubGVmdCArICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgYWJzb2x1dGUgbW91c2UgcG9zaXRpb25cbiAgICAgICAgdGhpcy5vZmZzZXQucmVsYXRpdmUubGVmdCAqIG1vZCArICAgICAgICAgICAgICAgICAgIC8vIE9ubHkgZm9yIHJlbGF0aXZlIHBvc2l0aW9uZWQgbm9kZXM6IFJlbGF0aXZlIG9mZnNldCBmcm9tIGVsZW1lbnQgdG8gb2Zmc2V0IHBhcmVudFxuICAgICAgICB0aGlzLm9mZnNldC5wYXJlbnQubGVmdCAqIG1vZCAtICAgICAgICAgICAgICAgICAgIC8vIFRoZSBvZmZzZXRQYXJlbnQncyBvZmZzZXQgd2l0aG91dCBib3JkZXJzIChvZmZzZXQgKyBib3JkZXIpXG4gICAgICAgICggKCB0aGlzLmNzc1Bvc2l0aW9uID09PSBcImZpeGVkXCIgPyAtdGhpcy5vZmZzZXQuc2Nyb2xsLmxlZnQgOiAoIHNjcm9sbElzUm9vdE5vZGUgPyAwIDogdGhpcy5vZmZzZXQuc2Nyb2xsLmxlZnQgKSApICogbW9kKVxuICAgICAgKVxuICAgIH07XG5cbiAgfSxcblxuICBfZ2VuZXJhdGVQb3NpdGlvbjogZnVuY3Rpb24oIGV2ZW50LCBjb25zdHJhaW5Qb3NpdGlvbiApIHtcblxuICAgIHZhciBjb250YWlubWVudCwgY28sIHRvcCwgbGVmdCxcbiAgICAgIG8gPSB0aGlzLm9wdGlvbnMsXG4gICAgICBzY3JvbGxJc1Jvb3ROb2RlID0gdGhpcy5faXNSb290Tm9kZSggdGhpcy5zY3JvbGxQYXJlbnRbIDAgXSApLFxuICAgICAgcGFnZVggPSBldmVudC5wYWdlWCxcbiAgICAgIHBhZ2VZID0gZXZlbnQucGFnZVk7XG5cbiAgICAvLyBDYWNoZSB0aGUgc2Nyb2xsXG4gICAgaWYgKCAhc2Nyb2xsSXNSb290Tm9kZSB8fCAhdGhpcy5vZmZzZXQuc2Nyb2xsICkge1xuICAgICAgdGhpcy5vZmZzZXQuc2Nyb2xsID0ge1xuICAgICAgICB0b3A6IHRoaXMuc2Nyb2xsUGFyZW50LnNjcm9sbFRvcCgpLFxuICAgICAgICBsZWZ0OiB0aGlzLnNjcm9sbFBhcmVudC5zY3JvbGxMZWZ0KClcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiAtIFBvc2l0aW9uIGNvbnN0cmFpbmluZyAtXG4gICAgICogQ29uc3RyYWluIHRoZSBwb3NpdGlvbiB0byBhIG1peCBvZiBncmlkLCBjb250YWlubWVudC5cbiAgICAgKi9cblxuICAgIC8vIElmIHdlIGFyZSBub3QgZHJhZ2dpbmcgeWV0LCB3ZSB3b24ndCBjaGVjayBmb3Igb3B0aW9uc1xuICAgIGlmICggY29uc3RyYWluUG9zaXRpb24gKSB7XG4gICAgICBpZiAoIHRoaXMuY29udGFpbm1lbnQgKSB7XG4gICAgICAgIGlmICggdGhpcy5yZWxhdGl2ZUNvbnRhaW5lciApe1xuICAgICAgICAgIGNvID0gdGhpcy5yZWxhdGl2ZUNvbnRhaW5lci5vZmZzZXQoKTtcbiAgICAgICAgICBjb250YWlubWVudCA9IFtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbm1lbnRbIDAgXSArIGNvLmxlZnQsXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5tZW50WyAxIF0gKyBjby50b3AsXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5tZW50WyAyIF0gKyBjby5sZWZ0LFxuICAgICAgICAgICAgdGhpcy5jb250YWlubWVudFsgMyBdICsgY28udG9wXG4gICAgICAgICAgXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb250YWlubWVudCA9IHRoaXMuY29udGFpbm1lbnQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZXZlbnQucGFnZVggLSB0aGlzLm9mZnNldC5jbGljay5sZWZ0IDwgY29udGFpbm1lbnRbMF0pIHtcbiAgICAgICAgICBwYWdlWCA9IGNvbnRhaW5tZW50WzBdICsgdGhpcy5vZmZzZXQuY2xpY2subGVmdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnQucGFnZVkgLSB0aGlzLm9mZnNldC5jbGljay50b3AgPCBjb250YWlubWVudFsxXSkge1xuICAgICAgICAgIHBhZ2VZID0gY29udGFpbm1lbnRbMV0gKyB0aGlzLm9mZnNldC5jbGljay50b3A7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2ZW50LnBhZ2VYIC0gdGhpcy5vZmZzZXQuY2xpY2subGVmdCA+IGNvbnRhaW5tZW50WzJdKSB7XG4gICAgICAgICAgcGFnZVggPSBjb250YWlubWVudFsyXSArIHRoaXMub2Zmc2V0LmNsaWNrLmxlZnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2ZW50LnBhZ2VZIC0gdGhpcy5vZmZzZXQuY2xpY2sudG9wID4gY29udGFpbm1lbnRbM10pIHtcbiAgICAgICAgICBwYWdlWSA9IGNvbnRhaW5tZW50WzNdICsgdGhpcy5vZmZzZXQuY2xpY2sudG9wO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChvLmdyaWQpIHtcbiAgICAgICAgLy9DaGVjayBmb3IgZ3JpZCBlbGVtZW50cyBzZXQgdG8gMCB0byBwcmV2ZW50IGRpdmlkZSBieSAwIGVycm9yIGNhdXNpbmcgaW52YWxpZCBhcmd1bWVudCBlcnJvcnMgaW4gSUUgKHNlZSB0aWNrZXQgIzY5NTApXG4gICAgICAgIHRvcCA9IG8uZ3JpZFsxXSA/IHRoaXMub3JpZ2luYWxQYWdlWSArIE1hdGgucm91bmQoKHBhZ2VZIC0gdGhpcy5vcmlnaW5hbFBhZ2VZKSAvIG8uZ3JpZFsxXSkgKiBvLmdyaWRbMV0gOiB0aGlzLm9yaWdpbmFsUGFnZVk7XG4gICAgICAgIHBhZ2VZID0gY29udGFpbm1lbnQgPyAoKHRvcCAtIHRoaXMub2Zmc2V0LmNsaWNrLnRvcCA+PSBjb250YWlubWVudFsxXSB8fCB0b3AgLSB0aGlzLm9mZnNldC5jbGljay50b3AgPiBjb250YWlubWVudFszXSkgPyB0b3AgOiAoKHRvcCAtIHRoaXMub2Zmc2V0LmNsaWNrLnRvcCA+PSBjb250YWlubWVudFsxXSkgPyB0b3AgLSBvLmdyaWRbMV0gOiB0b3AgKyBvLmdyaWRbMV0pKSA6IHRvcDtcblxuICAgICAgICBsZWZ0ID0gby5ncmlkWzBdID8gdGhpcy5vcmlnaW5hbFBhZ2VYICsgTWF0aC5yb3VuZCgocGFnZVggLSB0aGlzLm9yaWdpbmFsUGFnZVgpIC8gby5ncmlkWzBdKSAqIG8uZ3JpZFswXSA6IHRoaXMub3JpZ2luYWxQYWdlWDtcbiAgICAgICAgcGFnZVggPSBjb250YWlubWVudCA/ICgobGVmdCAtIHRoaXMub2Zmc2V0LmNsaWNrLmxlZnQgPj0gY29udGFpbm1lbnRbMF0gfHwgbGVmdCAtIHRoaXMub2Zmc2V0LmNsaWNrLmxlZnQgPiBjb250YWlubWVudFsyXSkgPyBsZWZ0IDogKChsZWZ0IC0gdGhpcy5vZmZzZXQuY2xpY2subGVmdCA+PSBjb250YWlubWVudFswXSkgPyBsZWZ0IC0gby5ncmlkWzBdIDogbGVmdCArIG8uZ3JpZFswXSkpIDogbGVmdDtcbiAgICAgIH1cblxuICAgICAgaWYgKCBvLmF4aXMgPT09IFwieVwiICkge1xuICAgICAgICBwYWdlWCA9IHRoaXMub3JpZ2luYWxQYWdlWDtcbiAgICAgIH1cblxuICAgICAgaWYgKCBvLmF4aXMgPT09IFwieFwiICkge1xuICAgICAgICBwYWdlWSA9IHRoaXMub3JpZ2luYWxQYWdlWTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdG9wOiAoXG4gICAgICAgIHBhZ2VZIC0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgYWJzb2x1dGUgbW91c2UgcG9zaXRpb25cbiAgICAgICAgdGhpcy5vZmZzZXQuY2xpY2sudG9wIC0gICAgICAgICAgICAgICAgICAgICAgIC8vIENsaWNrIG9mZnNldCAocmVsYXRpdmUgdG8gdGhlIGVsZW1lbnQpXG4gICAgICAgIHRoaXMub2Zmc2V0LnJlbGF0aXZlLnRvcCAtICAgICAgICAgICAgICAgICAgICAgICAgLy8gT25seSBmb3IgcmVsYXRpdmUgcG9zaXRpb25lZCBub2RlczogUmVsYXRpdmUgb2Zmc2V0IGZyb20gZWxlbWVudCB0byBvZmZzZXQgcGFyZW50XG4gICAgICAgIHRoaXMub2Zmc2V0LnBhcmVudC50b3AgKyAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBvZmZzZXRQYXJlbnQncyBvZmZzZXQgd2l0aG91dCBib3JkZXJzIChvZmZzZXQgKyBib3JkZXIpXG4gICAgICAgICggdGhpcy5jc3NQb3NpdGlvbiA9PT0gXCJmaXhlZFwiID8gLXRoaXMub2Zmc2V0LnNjcm9sbC50b3AgOiAoIHNjcm9sbElzUm9vdE5vZGUgPyAwIDogdGhpcy5vZmZzZXQuc2Nyb2xsLnRvcCApIClcbiAgICAgICksXG4gICAgICBsZWZ0OiAoXG4gICAgICAgIHBhZ2VYIC0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgYWJzb2x1dGUgbW91c2UgcG9zaXRpb25cbiAgICAgICAgdGhpcy5vZmZzZXQuY2xpY2subGVmdCAtICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2xpY2sgb2Zmc2V0IChyZWxhdGl2ZSB0byB0aGUgZWxlbWVudClcbiAgICAgICAgdGhpcy5vZmZzZXQucmVsYXRpdmUubGVmdCAtICAgICAgICAgICAgICAgICAgICAgICAvLyBPbmx5IGZvciByZWxhdGl2ZSBwb3NpdGlvbmVkIG5vZGVzOiBSZWxhdGl2ZSBvZmZzZXQgZnJvbSBlbGVtZW50IHRvIG9mZnNldCBwYXJlbnRcbiAgICAgICAgdGhpcy5vZmZzZXQucGFyZW50LmxlZnQgKyAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIG9mZnNldFBhcmVudCdzIG9mZnNldCB3aXRob3V0IGJvcmRlcnMgKG9mZnNldCArIGJvcmRlcilcbiAgICAgICAgKCB0aGlzLmNzc1Bvc2l0aW9uID09PSBcImZpeGVkXCIgPyAtdGhpcy5vZmZzZXQuc2Nyb2xsLmxlZnQgOiAoIHNjcm9sbElzUm9vdE5vZGUgPyAwIDogdGhpcy5vZmZzZXQuc2Nyb2xsLmxlZnQgKSApXG4gICAgICApXG4gICAgfTtcblxuICB9LFxuXG4gIF9jbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5oZWxwZXIucmVtb3ZlQ2xhc3MoXCJ1aS1kcmFnZ2FibGUtZHJhZ2dpbmdcIik7XG4gICAgaWYgKHRoaXMuaGVscGVyWzBdICE9PSB0aGlzLmVsZW1lbnRbMF0gJiYgIXRoaXMuY2FuY2VsSGVscGVyUmVtb3ZhbCkge1xuICAgICAgdGhpcy5oZWxwZXIucmVtb3ZlKCk7XG4gICAgfVxuICAgIHRoaXMuaGVscGVyID0gbnVsbDtcbiAgICB0aGlzLmNhbmNlbEhlbHBlclJlbW92YWwgPSBmYWxzZTtcbiAgICBpZiAoIHRoaXMuZGVzdHJveU9uQ2xlYXIgKSB7XG4gICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICB9XG4gIH0sXG5cbiAgX25vcm1hbGl6ZVJpZ2h0Qm90dG9tOiBmdW5jdGlvbigpIHtcbiAgICBpZiAoIHRoaXMub3B0aW9ucy5heGlzICE9PSBcInlcIiAmJiB0aGlzLmhlbHBlci5jc3MoIFwicmlnaHRcIiApICE9PSBcImF1dG9cIiApIHtcbiAgICAgIHRoaXMuaGVscGVyLndpZHRoKCB0aGlzLmhlbHBlci53aWR0aCgpICk7XG4gICAgICB0aGlzLmhlbHBlci5jc3MoIFwicmlnaHRcIiwgXCJhdXRvXCIgKTtcbiAgICB9XG4gICAgaWYgKCB0aGlzLm9wdGlvbnMuYXhpcyAhPT0gXCJ4XCIgJiYgdGhpcy5oZWxwZXIuY3NzKCBcImJvdHRvbVwiICkgIT09IFwiYXV0b1wiICkge1xuICAgICAgdGhpcy5oZWxwZXIuaGVpZ2h0KCB0aGlzLmhlbHBlci5oZWlnaHQoKSApO1xuICAgICAgdGhpcy5oZWxwZXIuY3NzKCBcImJvdHRvbVwiLCBcImF1dG9cIiApO1xuICAgIH1cbiAgfSxcblxuICAvLyBGcm9tIG5vdyBvbiBidWxrIHN0dWZmIC0gbWFpbmx5IGhlbHBlcnNcblxuICBfdHJpZ2dlcjogZnVuY3Rpb24oIHR5cGUsIGV2ZW50LCB1aSApIHtcbiAgICB1aSA9IHVpIHx8IHRoaXMuX3VpSGFzaCgpO1xuICAgICQudWkucGx1Z2luLmNhbGwoIHRoaXMsIHR5cGUsIFsgZXZlbnQsIHVpLCB0aGlzIF0sIHRydWUgKTtcblxuICAgIC8vIEFic29sdXRlIHBvc2l0aW9uIGFuZCBvZmZzZXQgKHNlZSAjNjg4NCApIGhhdmUgdG8gYmUgcmVjYWxjdWxhdGVkIGFmdGVyIHBsdWdpbnNcbiAgICBpZiAoIC9eKGRyYWd8c3RhcnR8c3RvcCkvLnRlc3QoIHR5cGUgKSApIHtcbiAgICAgIHRoaXMucG9zaXRpb25BYnMgPSB0aGlzLl9jb252ZXJ0UG9zaXRpb25UbyggXCJhYnNvbHV0ZVwiICk7XG4gICAgICB1aS5vZmZzZXQgPSB0aGlzLnBvc2l0aW9uQWJzO1xuICAgIH1cbiAgICByZXR1cm4gJC5XaWRnZXQucHJvdG90eXBlLl90cmlnZ2VyLmNhbGwoIHRoaXMsIHR5cGUsIGV2ZW50LCB1aSApO1xuICB9LFxuXG4gIHBsdWdpbnM6IHt9LFxuXG4gIF91aUhhc2g6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBoZWxwZXI6IHRoaXMuaGVscGVyLFxuICAgICAgcG9zaXRpb246IHRoaXMucG9zaXRpb24sXG4gICAgICBvcmlnaW5hbFBvc2l0aW9uOiB0aGlzLm9yaWdpbmFsUG9zaXRpb24sXG4gICAgICBvZmZzZXQ6IHRoaXMucG9zaXRpb25BYnNcbiAgICB9O1xuICB9XG5cbn0pO1xuXG4kLnVpLnBsdWdpbi5hZGQoIFwiZHJhZ2dhYmxlXCIsIFwiY29ubmVjdFRvU29ydGFibGVcIiwge1xuICBzdGFydDogZnVuY3Rpb24oIGV2ZW50LCB1aSwgZHJhZ2dhYmxlICkge1xuICAgIHZhciB1aVNvcnRhYmxlID0gJC5leHRlbmQoIHt9LCB1aSwge1xuICAgICAgaXRlbTogZHJhZ2dhYmxlLmVsZW1lbnRcbiAgICB9KTtcblxuICAgIGRyYWdnYWJsZS5zb3J0YWJsZXMgPSBbXTtcbiAgICAkKCBkcmFnZ2FibGUub3B0aW9ucy5jb25uZWN0VG9Tb3J0YWJsZSApLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc29ydGFibGUgPSAkKCB0aGlzICkuc29ydGFibGUoIFwiaW5zdGFuY2VcIiApO1xuXG4gICAgICBpZiAoIHNvcnRhYmxlICYmICFzb3J0YWJsZS5vcHRpb25zLmRpc2FibGVkICkge1xuICAgICAgICBkcmFnZ2FibGUuc29ydGFibGVzLnB1c2goIHNvcnRhYmxlICk7XG5cbiAgICAgICAgLy8gcmVmcmVzaFBvc2l0aW9ucyBpcyBjYWxsZWQgYXQgZHJhZyBzdGFydCB0byByZWZyZXNoIHRoZSBjb250YWluZXJDYWNoZVxuICAgICAgICAvLyB3aGljaCBpcyB1c2VkIGluIGRyYWcuIFRoaXMgZW5zdXJlcyBpdCdzIGluaXRpYWxpemVkIGFuZCBzeW5jaHJvbml6ZWRcbiAgICAgICAgLy8gd2l0aCBhbnkgY2hhbmdlcyB0aGF0IG1pZ2h0IGhhdmUgaGFwcGVuZWQgb24gdGhlIHBhZ2Ugc2luY2UgaW5pdGlhbGl6YXRpb24uXG4gICAgICAgIHNvcnRhYmxlLnJlZnJlc2hQb3NpdGlvbnMoKTtcbiAgICAgICAgc29ydGFibGUuX3RyaWdnZXIoXCJhY3RpdmF0ZVwiLCBldmVudCwgdWlTb3J0YWJsZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIHN0b3A6IGZ1bmN0aW9uKCBldmVudCwgdWksIGRyYWdnYWJsZSApIHtcbiAgICB2YXIgdWlTb3J0YWJsZSA9ICQuZXh0ZW5kKCB7fSwgdWksIHtcbiAgICAgIGl0ZW06IGRyYWdnYWJsZS5lbGVtZW50XG4gICAgfSk7XG5cbiAgICBkcmFnZ2FibGUuY2FuY2VsSGVscGVyUmVtb3ZhbCA9IGZhbHNlO1xuXG4gICAgJC5lYWNoKCBkcmFnZ2FibGUuc29ydGFibGVzLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzb3J0YWJsZSA9IHRoaXM7XG5cbiAgICAgIGlmICggc29ydGFibGUuaXNPdmVyICkge1xuICAgICAgICBzb3J0YWJsZS5pc092ZXIgPSAwO1xuXG4gICAgICAgIC8vIEFsbG93IHRoaXMgc29ydGFibGUgdG8gaGFuZGxlIHJlbW92aW5nIHRoZSBoZWxwZXJcbiAgICAgICAgZHJhZ2dhYmxlLmNhbmNlbEhlbHBlclJlbW92YWwgPSB0cnVlO1xuICAgICAgICBzb3J0YWJsZS5jYW5jZWxIZWxwZXJSZW1vdmFsID0gZmFsc2U7XG5cbiAgICAgICAgLy8gVXNlIF9zdG9yZWRDU1MgVG8gcmVzdG9yZSBwcm9wZXJ0aWVzIGluIHRoZSBzb3J0YWJsZSxcbiAgICAgICAgLy8gYXMgdGhpcyBhbHNvIGhhbmRsZXMgcmV2ZXJ0ICgjOTY3NSkgc2luY2UgdGhlIGRyYWdnYWJsZVxuICAgICAgICAvLyBtYXkgaGF2ZSBtb2RpZmllZCB0aGVtIGluIHVuZXhwZWN0ZWQgd2F5cyAoIzg4MDkpXG4gICAgICAgIHNvcnRhYmxlLl9zdG9yZWRDU1MgPSB7XG4gICAgICAgICAgcG9zaXRpb246IHNvcnRhYmxlLnBsYWNlaG9sZGVyLmNzcyggXCJwb3NpdGlvblwiICksXG4gICAgICAgICAgdG9wOiBzb3J0YWJsZS5wbGFjZWhvbGRlci5jc3MoIFwidG9wXCIgKSxcbiAgICAgICAgICBsZWZ0OiBzb3J0YWJsZS5wbGFjZWhvbGRlci5jc3MoIFwibGVmdFwiIClcbiAgICAgICAgfTtcblxuICAgICAgICBzb3J0YWJsZS5fbW91c2VTdG9wKGV2ZW50KTtcblxuICAgICAgICAvLyBPbmNlIGRyYWcgaGFzIGVuZGVkLCB0aGUgc29ydGFibGUgc2hvdWxkIHJldHVybiB0byB1c2luZ1xuICAgICAgICAvLyBpdHMgb3JpZ2luYWwgaGVscGVyLCBub3QgdGhlIHNoYXJlZCBoZWxwZXIgZnJvbSBkcmFnZ2FibGVcbiAgICAgICAgc29ydGFibGUub3B0aW9ucy5oZWxwZXIgPSBzb3J0YWJsZS5vcHRpb25zLl9oZWxwZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBQcmV2ZW50IHRoaXMgU29ydGFibGUgZnJvbSByZW1vdmluZyB0aGUgaGVscGVyLlxuICAgICAgICAvLyBIb3dldmVyLCBkb24ndCBzZXQgdGhlIGRyYWdnYWJsZSB0byByZW1vdmUgdGhlIGhlbHBlclxuICAgICAgICAvLyBlaXRoZXIgYXMgYW5vdGhlciBjb25uZWN0ZWQgU29ydGFibGUgbWF5IHlldCBoYW5kbGUgdGhlIHJlbW92YWwuXG4gICAgICAgIHNvcnRhYmxlLmNhbmNlbEhlbHBlclJlbW92YWwgPSB0cnVlO1xuXG4gICAgICAgIHNvcnRhYmxlLl90cmlnZ2VyKCBcImRlYWN0aXZhdGVcIiwgZXZlbnQsIHVpU29ydGFibGUgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgZHJhZzogZnVuY3Rpb24oIGV2ZW50LCB1aSwgZHJhZ2dhYmxlICkge1xuICAgICQuZWFjaCggZHJhZ2dhYmxlLnNvcnRhYmxlcywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaW5uZXJtb3N0SW50ZXJzZWN0aW5nID0gZmFsc2UsXG4gICAgICAgIHNvcnRhYmxlID0gdGhpcztcblxuICAgICAgLy8gQ29weSBvdmVyIHZhcmlhYmxlcyB0aGF0IHNvcnRhYmxlJ3MgX2ludGVyc2VjdHNXaXRoIHVzZXNcbiAgICAgIHNvcnRhYmxlLnBvc2l0aW9uQWJzID0gZHJhZ2dhYmxlLnBvc2l0aW9uQWJzO1xuICAgICAgc29ydGFibGUuaGVscGVyUHJvcG9ydGlvbnMgPSBkcmFnZ2FibGUuaGVscGVyUHJvcG9ydGlvbnM7XG4gICAgICBzb3J0YWJsZS5vZmZzZXQuY2xpY2sgPSBkcmFnZ2FibGUub2Zmc2V0LmNsaWNrO1xuXG4gICAgICBpZiAoIHNvcnRhYmxlLl9pbnRlcnNlY3RzV2l0aCggc29ydGFibGUuY29udGFpbmVyQ2FjaGUgKSApIHtcbiAgICAgICAgaW5uZXJtb3N0SW50ZXJzZWN0aW5nID0gdHJ1ZTtcblxuICAgICAgICAkLmVhY2goIGRyYWdnYWJsZS5zb3J0YWJsZXMsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIC8vIENvcHkgb3ZlciB2YXJpYWJsZXMgdGhhdCBzb3J0YWJsZSdzIF9pbnRlcnNlY3RzV2l0aCB1c2VzXG4gICAgICAgICAgdGhpcy5wb3NpdGlvbkFicyA9IGRyYWdnYWJsZS5wb3NpdGlvbkFicztcbiAgICAgICAgICB0aGlzLmhlbHBlclByb3BvcnRpb25zID0gZHJhZ2dhYmxlLmhlbHBlclByb3BvcnRpb25zO1xuICAgICAgICAgIHRoaXMub2Zmc2V0LmNsaWNrID0gZHJhZ2dhYmxlLm9mZnNldC5jbGljaztcblxuICAgICAgICAgIGlmICggdGhpcyAhPT0gc29ydGFibGUgJiZcbiAgICAgICAgICAgICAgdGhpcy5faW50ZXJzZWN0c1dpdGgoIHRoaXMuY29udGFpbmVyQ2FjaGUgKSAmJlxuICAgICAgICAgICAgICAkLmNvbnRhaW5zKCBzb3J0YWJsZS5lbGVtZW50WyAwIF0sIHRoaXMuZWxlbWVudFsgMCBdICkgKSB7XG4gICAgICAgICAgICBpbm5lcm1vc3RJbnRlcnNlY3RpbmcgPSBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gaW5uZXJtb3N0SW50ZXJzZWN0aW5nO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCBpbm5lcm1vc3RJbnRlcnNlY3RpbmcgKSB7XG4gICAgICAgIC8vIElmIGl0IGludGVyc2VjdHMsIHdlIHVzZSBhIGxpdHRsZSBpc092ZXIgdmFyaWFibGUgYW5kIHNldCBpdCBvbmNlLFxuICAgICAgICAvLyBzbyB0aGF0IHRoZSBtb3ZlLWluIHN0dWZmIGdldHMgZmlyZWQgb25seSBvbmNlLlxuICAgICAgICBpZiAoICFzb3J0YWJsZS5pc092ZXIgKSB7XG4gICAgICAgICAgc29ydGFibGUuaXNPdmVyID0gMTtcblxuICAgICAgICAgIHNvcnRhYmxlLmN1cnJlbnRJdGVtID0gdWkuaGVscGVyXG4gICAgICAgICAgICAuYXBwZW5kVG8oIHNvcnRhYmxlLmVsZW1lbnQgKVxuICAgICAgICAgICAgLmRhdGEoIFwidWktc29ydGFibGUtaXRlbVwiLCB0cnVlICk7XG5cbiAgICAgICAgICAvLyBTdG9yZSBoZWxwZXIgb3B0aW9uIHRvIGxhdGVyIHJlc3RvcmUgaXRcbiAgICAgICAgICBzb3J0YWJsZS5vcHRpb25zLl9oZWxwZXIgPSBzb3J0YWJsZS5vcHRpb25zLmhlbHBlcjtcblxuICAgICAgICAgIHNvcnRhYmxlLm9wdGlvbnMuaGVscGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdWkuaGVscGVyWyAwIF07XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIC8vIEZpcmUgdGhlIHN0YXJ0IGV2ZW50cyBvZiB0aGUgc29ydGFibGUgd2l0aCBvdXIgcGFzc2VkIGJyb3dzZXIgZXZlbnQsXG4gICAgICAgICAgLy8gYW5kIG91ciBvd24gaGVscGVyIChzbyBpdCBkb2Vzbid0IGNyZWF0ZSBhIG5ldyBvbmUpXG4gICAgICAgICAgZXZlbnQudGFyZ2V0ID0gc29ydGFibGUuY3VycmVudEl0ZW1bIDAgXTtcbiAgICAgICAgICBzb3J0YWJsZS5fbW91c2VDYXB0dXJlKCBldmVudCwgdHJ1ZSApO1xuICAgICAgICAgIHNvcnRhYmxlLl9tb3VzZVN0YXJ0KCBldmVudCwgdHJ1ZSwgdHJ1ZSApO1xuXG4gICAgICAgICAgLy8gQmVjYXVzZSB0aGUgYnJvd3NlciBldmVudCBpcyB3YXkgb2ZmIHRoZSBuZXcgYXBwZW5kZWQgcG9ydGxldCxcbiAgICAgICAgICAvLyBtb2RpZnkgbmVjZXNzYXJ5IHZhcmlhYmxlcyB0byByZWZsZWN0IHRoZSBjaGFuZ2VzXG4gICAgICAgICAgc29ydGFibGUub2Zmc2V0LmNsaWNrLnRvcCA9IGRyYWdnYWJsZS5vZmZzZXQuY2xpY2sudG9wO1xuICAgICAgICAgIHNvcnRhYmxlLm9mZnNldC5jbGljay5sZWZ0ID0gZHJhZ2dhYmxlLm9mZnNldC5jbGljay5sZWZ0O1xuICAgICAgICAgIHNvcnRhYmxlLm9mZnNldC5wYXJlbnQubGVmdCAtPSBkcmFnZ2FibGUub2Zmc2V0LnBhcmVudC5sZWZ0IC1cbiAgICAgICAgICAgIHNvcnRhYmxlLm9mZnNldC5wYXJlbnQubGVmdDtcbiAgICAgICAgICBzb3J0YWJsZS5vZmZzZXQucGFyZW50LnRvcCAtPSBkcmFnZ2FibGUub2Zmc2V0LnBhcmVudC50b3AgLVxuICAgICAgICAgICAgc29ydGFibGUub2Zmc2V0LnBhcmVudC50b3A7XG5cbiAgICAgICAgICBkcmFnZ2FibGUuX3RyaWdnZXIoIFwidG9Tb3J0YWJsZVwiLCBldmVudCApO1xuXG4gICAgICAgICAgLy8gSW5mb3JtIGRyYWdnYWJsZSB0aGF0IHRoZSBoZWxwZXIgaXMgaW4gYSB2YWxpZCBkcm9wIHpvbmUsXG4gICAgICAgICAgLy8gdXNlZCBzb2xlbHkgaW4gdGhlIHJldmVydCBvcHRpb24gdG8gaGFuZGxlIFwidmFsaWQvaW52YWxpZFwiLlxuICAgICAgICAgIGRyYWdnYWJsZS5kcm9wcGVkID0gc29ydGFibGUuZWxlbWVudDtcblxuICAgICAgICAgIC8vIE5lZWQgdG8gcmVmcmVzaFBvc2l0aW9ucyBvZiBhbGwgc29ydGFibGVzIGluIHRoZSBjYXNlIHRoYXRcbiAgICAgICAgICAvLyBhZGRpbmcgdG8gb25lIHNvcnRhYmxlIGNoYW5nZXMgdGhlIGxvY2F0aW9uIG9mIHRoZSBvdGhlciBzb3J0YWJsZXMgKCM5Njc1KVxuICAgICAgICAgICQuZWFjaCggZHJhZ2dhYmxlLnNvcnRhYmxlcywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hQb3NpdGlvbnMoKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIGhhY2sgc28gcmVjZWl2ZS91cGRhdGUgY2FsbGJhY2tzIHdvcmsgKG1vc3RseSlcbiAgICAgICAgICBkcmFnZ2FibGUuY3VycmVudEl0ZW0gPSBkcmFnZ2FibGUuZWxlbWVudDtcbiAgICAgICAgICBzb3J0YWJsZS5mcm9tT3V0c2lkZSA9IGRyYWdnYWJsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggc29ydGFibGUuY3VycmVudEl0ZW0gKSB7XG4gICAgICAgICAgc29ydGFibGUuX21vdXNlRHJhZyggZXZlbnQgKTtcbiAgICAgICAgICAvLyBDb3B5IHRoZSBzb3J0YWJsZSdzIHBvc2l0aW9uIGJlY2F1c2UgdGhlIGRyYWdnYWJsZSdzIGNhbiBwb3RlbnRpYWxseSByZWZsZWN0XG4gICAgICAgICAgLy8gYSByZWxhdGl2ZSBwb3NpdGlvbiwgd2hpbGUgc29ydGFibGUgaXMgYWx3YXlzIGFic29sdXRlLCB3aGljaCB0aGUgZHJhZ2dlZFxuICAgICAgICAgIC8vIGVsZW1lbnQgaGFzIG5vdyBiZWNvbWUuICgjODgwOSlcbiAgICAgICAgICB1aS5wb3NpdGlvbiA9IHNvcnRhYmxlLnBvc2l0aW9uO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBJZiBpdCBkb2Vzbid0IGludGVyc2VjdCB3aXRoIHRoZSBzb3J0YWJsZSwgYW5kIGl0IGludGVyc2VjdGVkIGJlZm9yZSxcbiAgICAgICAgLy8gd2UgZmFrZSB0aGUgZHJhZyBzdG9wIG9mIHRoZSBzb3J0YWJsZSwgYnV0IG1ha2Ugc3VyZSBpdCBkb2Vzbid0IHJlbW92ZVxuICAgICAgICAvLyB0aGUgaGVscGVyIGJ5IHVzaW5nIGNhbmNlbEhlbHBlclJlbW92YWwuXG4gICAgICAgIGlmICggc29ydGFibGUuaXNPdmVyICkge1xuXG4gICAgICAgICAgc29ydGFibGUuaXNPdmVyID0gMDtcbiAgICAgICAgICBzb3J0YWJsZS5jYW5jZWxIZWxwZXJSZW1vdmFsID0gdHJ1ZTtcblxuICAgICAgICAgIC8vIENhbGxpbmcgc29ydGFibGUncyBtb3VzZVN0b3Agd291bGQgdHJpZ2dlciBhIHJldmVydCxcbiAgICAgICAgICAvLyBzbyByZXZlcnQgbXVzdCBiZSB0ZW1wb3JhcmlseSBmYWxzZSB1bnRpbCBhZnRlciBtb3VzZVN0b3AgaXMgY2FsbGVkLlxuICAgICAgICAgIHNvcnRhYmxlLm9wdGlvbnMuX3JldmVydCA9IHNvcnRhYmxlLm9wdGlvbnMucmV2ZXJ0O1xuICAgICAgICAgIHNvcnRhYmxlLm9wdGlvbnMucmV2ZXJ0ID0gZmFsc2U7XG5cbiAgICAgICAgICBzb3J0YWJsZS5fdHJpZ2dlciggXCJvdXRcIiwgZXZlbnQsIHNvcnRhYmxlLl91aUhhc2goIHNvcnRhYmxlICkgKTtcbiAgICAgICAgICBzb3J0YWJsZS5fbW91c2VTdG9wKCBldmVudCwgdHJ1ZSApO1xuXG4gICAgICAgICAgLy8gcmVzdG9yZSBzb3J0YWJsZSBiZWhhdmlvcnMgdGhhdCB3ZXJlIG1vZGZpZWRcbiAgICAgICAgICAvLyB3aGVuIHRoZSBkcmFnZ2FibGUgZW50ZXJlZCB0aGUgc29ydGFibGUgYXJlYSAoIzk0ODEpXG4gICAgICAgICAgc29ydGFibGUub3B0aW9ucy5yZXZlcnQgPSBzb3J0YWJsZS5vcHRpb25zLl9yZXZlcnQ7XG4gICAgICAgICAgc29ydGFibGUub3B0aW9ucy5oZWxwZXIgPSBzb3J0YWJsZS5vcHRpb25zLl9oZWxwZXI7XG5cbiAgICAgICAgICBpZiAoIHNvcnRhYmxlLnBsYWNlaG9sZGVyICkge1xuICAgICAgICAgICAgc29ydGFibGUucGxhY2Vob2xkZXIucmVtb3ZlKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gUmVjYWxjdWxhdGUgdGhlIGRyYWdnYWJsZSdzIG9mZnNldCBjb25zaWRlcmluZyB0aGUgc29ydGFibGVcbiAgICAgICAgICAvLyBtYXkgaGF2ZSBtb2RpZmllZCB0aGVtIGluIHVuZXhwZWN0ZWQgd2F5cyAoIzg4MDkpXG4gICAgICAgICAgZHJhZ2dhYmxlLl9yZWZyZXNoT2Zmc2V0cyggZXZlbnQgKTtcbiAgICAgICAgICB1aS5wb3NpdGlvbiA9IGRyYWdnYWJsZS5fZ2VuZXJhdGVQb3NpdGlvbiggZXZlbnQsIHRydWUgKTtcblxuICAgICAgICAgIGRyYWdnYWJsZS5fdHJpZ2dlciggXCJmcm9tU29ydGFibGVcIiwgZXZlbnQgKTtcblxuICAgICAgICAgIC8vIEluZm9ybSBkcmFnZ2FibGUgdGhhdCB0aGUgaGVscGVyIGlzIG5vIGxvbmdlciBpbiBhIHZhbGlkIGRyb3Agem9uZVxuICAgICAgICAgIGRyYWdnYWJsZS5kcm9wcGVkID0gZmFsc2U7XG5cbiAgICAgICAgICAvLyBOZWVkIHRvIHJlZnJlc2hQb3NpdGlvbnMgb2YgYWxsIHNvcnRhYmxlcyBqdXN0IGluIGNhc2UgcmVtb3ZpbmdcbiAgICAgICAgICAvLyBmcm9tIG9uZSBzb3J0YWJsZSBjaGFuZ2VzIHRoZSBsb2NhdGlvbiBvZiBvdGhlciBzb3J0YWJsZXMgKCM5Njc1KVxuICAgICAgICAgICQuZWFjaCggZHJhZ2dhYmxlLnNvcnRhYmxlcywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hQb3NpdGlvbnMoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcblxuJC51aS5wbHVnaW4uYWRkKFwiZHJhZ2dhYmxlXCIsIFwiY3Vyc29yXCIsIHtcbiAgc3RhcnQ6IGZ1bmN0aW9uKCBldmVudCwgdWksIGluc3RhbmNlICkge1xuICAgIHZhciB0ID0gJCggXCJib2R5XCIgKSxcbiAgICAgIG8gPSBpbnN0YW5jZS5vcHRpb25zO1xuXG4gICAgaWYgKHQuY3NzKFwiY3Vyc29yXCIpKSB7XG4gICAgICBvLl9jdXJzb3IgPSB0LmNzcyhcImN1cnNvclwiKTtcbiAgICB9XG4gICAgdC5jc3MoXCJjdXJzb3JcIiwgby5jdXJzb3IpO1xuICB9LFxuICBzdG9wOiBmdW5jdGlvbiggZXZlbnQsIHVpLCBpbnN0YW5jZSApIHtcbiAgICB2YXIgbyA9IGluc3RhbmNlLm9wdGlvbnM7XG4gICAgaWYgKG8uX2N1cnNvcikge1xuICAgICAgJChcImJvZHlcIikuY3NzKFwiY3Vyc29yXCIsIG8uX2N1cnNvcik7XG4gICAgfVxuICB9XG59KTtcblxuJC51aS5wbHVnaW4uYWRkKFwiZHJhZ2dhYmxlXCIsIFwib3BhY2l0eVwiLCB7XG4gIHN0YXJ0OiBmdW5jdGlvbiggZXZlbnQsIHVpLCBpbnN0YW5jZSApIHtcbiAgICB2YXIgdCA9ICQoIHVpLmhlbHBlciApLFxuICAgICAgbyA9IGluc3RhbmNlLm9wdGlvbnM7XG4gICAgaWYgKHQuY3NzKFwib3BhY2l0eVwiKSkge1xuICAgICAgby5fb3BhY2l0eSA9IHQuY3NzKFwib3BhY2l0eVwiKTtcbiAgICB9XG4gICAgdC5jc3MoXCJvcGFjaXR5XCIsIG8ub3BhY2l0eSk7XG4gIH0sXG4gIHN0b3A6IGZ1bmN0aW9uKCBldmVudCwgdWksIGluc3RhbmNlICkge1xuICAgIHZhciBvID0gaW5zdGFuY2Uub3B0aW9ucztcbiAgICBpZiAoby5fb3BhY2l0eSkge1xuICAgICAgJCh1aS5oZWxwZXIpLmNzcyhcIm9wYWNpdHlcIiwgby5fb3BhY2l0eSk7XG4gICAgfVxuICB9XG59KTtcblxuJC51aS5wbHVnaW4uYWRkKFwiZHJhZ2dhYmxlXCIsIFwic2Nyb2xsXCIsIHtcbiAgc3RhcnQ6IGZ1bmN0aW9uKCBldmVudCwgdWksIGkgKSB7XG4gICAgaWYgKCAhaS5zY3JvbGxQYXJlbnROb3RIaWRkZW4gKSB7XG4gICAgICBpLnNjcm9sbFBhcmVudE5vdEhpZGRlbiA9IGkuaGVscGVyLnNjcm9sbFBhcmVudCggZmFsc2UgKTtcbiAgICB9XG5cbiAgICBpZiAoIGkuc2Nyb2xsUGFyZW50Tm90SGlkZGVuWyAwIF0gIT09IGkuZG9jdW1lbnRbIDAgXSAmJiBpLnNjcm9sbFBhcmVudE5vdEhpZGRlblsgMCBdLnRhZ05hbWUgIT09IFwiSFRNTFwiICkge1xuICAgICAgaS5vdmVyZmxvd09mZnNldCA9IGkuc2Nyb2xsUGFyZW50Tm90SGlkZGVuLm9mZnNldCgpO1xuICAgIH1cbiAgfSxcbiAgZHJhZzogZnVuY3Rpb24oIGV2ZW50LCB1aSwgaSAgKSB7XG5cbiAgICB2YXIgbyA9IGkub3B0aW9ucyxcbiAgICAgIHNjcm9sbGVkID0gZmFsc2UsXG4gICAgICBzY3JvbGxQYXJlbnQgPSBpLnNjcm9sbFBhcmVudE5vdEhpZGRlblsgMCBdLFxuICAgICAgZG9jdW1lbnQgPSBpLmRvY3VtZW50WyAwIF07XG5cbiAgICBpZiAoIHNjcm9sbFBhcmVudCAhPT0gZG9jdW1lbnQgJiYgc2Nyb2xsUGFyZW50LnRhZ05hbWUgIT09IFwiSFRNTFwiICkge1xuICAgICAgaWYgKCAhby5heGlzIHx8IG8uYXhpcyAhPT0gXCJ4XCIgKSB7XG4gICAgICAgIGlmICggKCBpLm92ZXJmbG93T2Zmc2V0LnRvcCArIHNjcm9sbFBhcmVudC5vZmZzZXRIZWlnaHQgKSAtIGV2ZW50LnBhZ2VZIDwgby5zY3JvbGxTZW5zaXRpdml0eSApIHtcbiAgICAgICAgICBzY3JvbGxQYXJlbnQuc2Nyb2xsVG9wID0gc2Nyb2xsZWQgPSBzY3JvbGxQYXJlbnQuc2Nyb2xsVG9wICsgby5zY3JvbGxTcGVlZDtcbiAgICAgICAgfSBlbHNlIGlmICggZXZlbnQucGFnZVkgLSBpLm92ZXJmbG93T2Zmc2V0LnRvcCA8IG8uc2Nyb2xsU2Vuc2l0aXZpdHkgKSB7XG4gICAgICAgICAgc2Nyb2xsUGFyZW50LnNjcm9sbFRvcCA9IHNjcm9sbGVkID0gc2Nyb2xsUGFyZW50LnNjcm9sbFRvcCAtIG8uc2Nyb2xsU3BlZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCAhby5heGlzIHx8IG8uYXhpcyAhPT0gXCJ5XCIgKSB7XG4gICAgICAgIGlmICggKCBpLm92ZXJmbG93T2Zmc2V0LmxlZnQgKyBzY3JvbGxQYXJlbnQub2Zmc2V0V2lkdGggKSAtIGV2ZW50LnBhZ2VYIDwgby5zY3JvbGxTZW5zaXRpdml0eSApIHtcbiAgICAgICAgICBzY3JvbGxQYXJlbnQuc2Nyb2xsTGVmdCA9IHNjcm9sbGVkID0gc2Nyb2xsUGFyZW50LnNjcm9sbExlZnQgKyBvLnNjcm9sbFNwZWVkO1xuICAgICAgICB9IGVsc2UgaWYgKCBldmVudC5wYWdlWCAtIGkub3ZlcmZsb3dPZmZzZXQubGVmdCA8IG8uc2Nyb2xsU2Vuc2l0aXZpdHkgKSB7XG4gICAgICAgICAgc2Nyb2xsUGFyZW50LnNjcm9sbExlZnQgPSBzY3JvbGxlZCA9IHNjcm9sbFBhcmVudC5zY3JvbGxMZWZ0IC0gby5zY3JvbGxTcGVlZDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfSBlbHNlIHtcblxuICAgICAgaWYgKCFvLmF4aXMgfHwgby5heGlzICE9PSBcInhcIikge1xuICAgICAgICBpZiAoZXZlbnQucGFnZVkgLSAkKGRvY3VtZW50KS5zY3JvbGxUb3AoKSA8IG8uc2Nyb2xsU2Vuc2l0aXZpdHkpIHtcbiAgICAgICAgICBzY3JvbGxlZCA9ICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgkKGRvY3VtZW50KS5zY3JvbGxUb3AoKSAtIG8uc2Nyb2xsU3BlZWQpO1xuICAgICAgICB9IGVsc2UgaWYgKCQod2luZG93KS5oZWlnaHQoKSAtIChldmVudC5wYWdlWSAtICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgpKSA8IG8uc2Nyb2xsU2Vuc2l0aXZpdHkpIHtcbiAgICAgICAgICBzY3JvbGxlZCA9ICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgkKGRvY3VtZW50KS5zY3JvbGxUb3AoKSArIG8uc2Nyb2xsU3BlZWQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghby5heGlzIHx8IG8uYXhpcyAhPT0gXCJ5XCIpIHtcbiAgICAgICAgaWYgKGV2ZW50LnBhZ2VYIC0gJChkb2N1bWVudCkuc2Nyb2xsTGVmdCgpIDwgby5zY3JvbGxTZW5zaXRpdml0eSkge1xuICAgICAgICAgIHNjcm9sbGVkID0gJChkb2N1bWVudCkuc2Nyb2xsTGVmdCgkKGRvY3VtZW50KS5zY3JvbGxMZWZ0KCkgLSBvLnNjcm9sbFNwZWVkKTtcbiAgICAgICAgfSBlbHNlIGlmICgkKHdpbmRvdykud2lkdGgoKSAtIChldmVudC5wYWdlWCAtICQoZG9jdW1lbnQpLnNjcm9sbExlZnQoKSkgPCBvLnNjcm9sbFNlbnNpdGl2aXR5KSB7XG4gICAgICAgICAgc2Nyb2xsZWQgPSAkKGRvY3VtZW50KS5zY3JvbGxMZWZ0KCQoZG9jdW1lbnQpLnNjcm9sbExlZnQoKSArIG8uc2Nyb2xsU3BlZWQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBpZiAoc2Nyb2xsZWQgIT09IGZhbHNlICYmICQudWkuZGRtYW5hZ2VyICYmICFvLmRyb3BCZWhhdmlvdXIpIHtcbiAgICAgICQudWkuZGRtYW5hZ2VyLnByZXBhcmVPZmZzZXRzKGksIGV2ZW50KTtcbiAgICB9XG5cbiAgfVxufSk7XG5cbiQudWkucGx1Z2luLmFkZChcImRyYWdnYWJsZVwiLCBcInNuYXBcIiwge1xuICBzdGFydDogZnVuY3Rpb24oIGV2ZW50LCB1aSwgaSApIHtcblxuICAgIHZhciBvID0gaS5vcHRpb25zO1xuXG4gICAgaS5zbmFwRWxlbWVudHMgPSBbXTtcblxuICAgICQoby5zbmFwLmNvbnN0cnVjdG9yICE9PSBTdHJpbmcgPyAoIG8uc25hcC5pdGVtcyB8fCBcIjpkYXRhKHVpLWRyYWdnYWJsZSlcIiApIDogby5zbmFwKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyICR0ID0gJCh0aGlzKSxcbiAgICAgICAgJG8gPSAkdC5vZmZzZXQoKTtcbiAgICAgIGlmICh0aGlzICE9PSBpLmVsZW1lbnRbMF0pIHtcbiAgICAgICAgaS5zbmFwRWxlbWVudHMucHVzaCh7XG4gICAgICAgICAgaXRlbTogdGhpcyxcbiAgICAgICAgICB3aWR0aDogJHQub3V0ZXJXaWR0aCgpLCBoZWlnaHQ6ICR0Lm91dGVySGVpZ2h0KCksXG4gICAgICAgICAgdG9wOiAkby50b3AsIGxlZnQ6ICRvLmxlZnRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgfSxcbiAgZHJhZzogZnVuY3Rpb24oIGV2ZW50LCB1aSwgaW5zdCApIHtcblxuICAgIHZhciB0cywgYnMsIGxzLCBycywgbCwgciwgdCwgYiwgaSwgZmlyc3QsXG4gICAgICBvID0gaW5zdC5vcHRpb25zLFxuICAgICAgZCA9IG8uc25hcFRvbGVyYW5jZSxcbiAgICAgIHgxID0gdWkub2Zmc2V0LmxlZnQsIHgyID0geDEgKyBpbnN0LmhlbHBlclByb3BvcnRpb25zLndpZHRoLFxuICAgICAgeTEgPSB1aS5vZmZzZXQudG9wLCB5MiA9IHkxICsgaW5zdC5oZWxwZXJQcm9wb3J0aW9ucy5oZWlnaHQ7XG5cbiAgICBmb3IgKGkgPSBpbnN0LnNuYXBFbGVtZW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSl7XG5cbiAgICAgIGwgPSBpbnN0LnNuYXBFbGVtZW50c1tpXS5sZWZ0IC0gaW5zdC5tYXJnaW5zLmxlZnQ7XG4gICAgICByID0gbCArIGluc3Quc25hcEVsZW1lbnRzW2ldLndpZHRoO1xuICAgICAgdCA9IGluc3Quc25hcEVsZW1lbnRzW2ldLnRvcCAtIGluc3QubWFyZ2lucy50b3A7XG4gICAgICBiID0gdCArIGluc3Quc25hcEVsZW1lbnRzW2ldLmhlaWdodDtcblxuICAgICAgaWYgKCB4MiA8IGwgLSBkIHx8IHgxID4gciArIGQgfHwgeTIgPCB0IC0gZCB8fCB5MSA+IGIgKyBkIHx8ICEkLmNvbnRhaW5zKCBpbnN0LnNuYXBFbGVtZW50c1sgaSBdLml0ZW0ub3duZXJEb2N1bWVudCwgaW5zdC5zbmFwRWxlbWVudHNbIGkgXS5pdGVtICkgKSB7XG4gICAgICAgIGlmIChpbnN0LnNuYXBFbGVtZW50c1tpXS5zbmFwcGluZykge1xuICAgICAgICAgIChpbnN0Lm9wdGlvbnMuc25hcC5yZWxlYXNlICYmIGluc3Qub3B0aW9ucy5zbmFwLnJlbGVhc2UuY2FsbChpbnN0LmVsZW1lbnQsIGV2ZW50LCAkLmV4dGVuZChpbnN0Ll91aUhhc2goKSwgeyBzbmFwSXRlbTogaW5zdC5zbmFwRWxlbWVudHNbaV0uaXRlbSB9KSkpO1xuICAgICAgICB9XG4gICAgICAgIGluc3Quc25hcEVsZW1lbnRzW2ldLnNuYXBwaW5nID0gZmFsc2U7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoby5zbmFwTW9kZSAhPT0gXCJpbm5lclwiKSB7XG4gICAgICAgIHRzID0gTWF0aC5hYnModCAtIHkyKSA8PSBkO1xuICAgICAgICBicyA9IE1hdGguYWJzKGIgLSB5MSkgPD0gZDtcbiAgICAgICAgbHMgPSBNYXRoLmFicyhsIC0geDIpIDw9IGQ7XG4gICAgICAgIHJzID0gTWF0aC5hYnMociAtIHgxKSA8PSBkO1xuICAgICAgICBpZiAodHMpIHtcbiAgICAgICAgICB1aS5wb3NpdGlvbi50b3AgPSBpbnN0Ll9jb252ZXJ0UG9zaXRpb25UbyhcInJlbGF0aXZlXCIsIHsgdG9wOiB0IC0gaW5zdC5oZWxwZXJQcm9wb3J0aW9ucy5oZWlnaHQsIGxlZnQ6IDAgfSkudG9wO1xuICAgICAgICB9XG4gICAgICAgIGlmIChicykge1xuICAgICAgICAgIHVpLnBvc2l0aW9uLnRvcCA9IGluc3QuX2NvbnZlcnRQb3NpdGlvblRvKFwicmVsYXRpdmVcIiwgeyB0b3A6IGIsIGxlZnQ6IDAgfSkudG9wO1xuICAgICAgICB9XG4gICAgICAgIGlmIChscykge1xuICAgICAgICAgIHVpLnBvc2l0aW9uLmxlZnQgPSBpbnN0Ll9jb252ZXJ0UG9zaXRpb25UbyhcInJlbGF0aXZlXCIsIHsgdG9wOiAwLCBsZWZ0OiBsIC0gaW5zdC5oZWxwZXJQcm9wb3J0aW9ucy53aWR0aCB9KS5sZWZ0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChycykge1xuICAgICAgICAgIHVpLnBvc2l0aW9uLmxlZnQgPSBpbnN0Ll9jb252ZXJ0UG9zaXRpb25UbyhcInJlbGF0aXZlXCIsIHsgdG9wOiAwLCBsZWZ0OiByIH0pLmxlZnQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZmlyc3QgPSAodHMgfHwgYnMgfHwgbHMgfHwgcnMpO1xuXG4gICAgICBpZiAoby5zbmFwTW9kZSAhPT0gXCJvdXRlclwiKSB7XG4gICAgICAgIHRzID0gTWF0aC5hYnModCAtIHkxKSA8PSBkO1xuICAgICAgICBicyA9IE1hdGguYWJzKGIgLSB5MikgPD0gZDtcbiAgICAgICAgbHMgPSBNYXRoLmFicyhsIC0geDEpIDw9IGQ7XG4gICAgICAgIHJzID0gTWF0aC5hYnMociAtIHgyKSA8PSBkO1xuICAgICAgICBpZiAodHMpIHtcbiAgICAgICAgICB1aS5wb3NpdGlvbi50b3AgPSBpbnN0Ll9jb252ZXJ0UG9zaXRpb25UbyhcInJlbGF0aXZlXCIsIHsgdG9wOiB0LCBsZWZ0OiAwIH0pLnRvcDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYnMpIHtcbiAgICAgICAgICB1aS5wb3NpdGlvbi50b3AgPSBpbnN0Ll9jb252ZXJ0UG9zaXRpb25UbyhcInJlbGF0aXZlXCIsIHsgdG9wOiBiIC0gaW5zdC5oZWxwZXJQcm9wb3J0aW9ucy5oZWlnaHQsIGxlZnQ6IDAgfSkudG9wO1xuICAgICAgICB9XG4gICAgICAgIGlmIChscykge1xuICAgICAgICAgIHVpLnBvc2l0aW9uLmxlZnQgPSBpbnN0Ll9jb252ZXJ0UG9zaXRpb25UbyhcInJlbGF0aXZlXCIsIHsgdG9wOiAwLCBsZWZ0OiBsIH0pLmxlZnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJzKSB7XG4gICAgICAgICAgdWkucG9zaXRpb24ubGVmdCA9IGluc3QuX2NvbnZlcnRQb3NpdGlvblRvKFwicmVsYXRpdmVcIiwgeyB0b3A6IDAsIGxlZnQ6IHIgLSBpbnN0LmhlbHBlclByb3BvcnRpb25zLndpZHRoIH0pLmxlZnQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFpbnN0LnNuYXBFbGVtZW50c1tpXS5zbmFwcGluZyAmJiAodHMgfHwgYnMgfHwgbHMgfHwgcnMgfHwgZmlyc3QpKSB7XG4gICAgICAgIChpbnN0Lm9wdGlvbnMuc25hcC5zbmFwICYmIGluc3Qub3B0aW9ucy5zbmFwLnNuYXAuY2FsbChpbnN0LmVsZW1lbnQsIGV2ZW50LCAkLmV4dGVuZChpbnN0Ll91aUhhc2goKSwgeyBzbmFwSXRlbTogaW5zdC5zbmFwRWxlbWVudHNbaV0uaXRlbSB9KSkpO1xuICAgICAgfVxuICAgICAgaW5zdC5zbmFwRWxlbWVudHNbaV0uc25hcHBpbmcgPSAodHMgfHwgYnMgfHwgbHMgfHwgcnMgfHwgZmlyc3QpO1xuXG4gICAgfVxuXG4gIH1cbn0pO1xuXG4kLnVpLnBsdWdpbi5hZGQoXCJkcmFnZ2FibGVcIiwgXCJzdGFja1wiLCB7XG4gIHN0YXJ0OiBmdW5jdGlvbiggZXZlbnQsIHVpLCBpbnN0YW5jZSApIHtcbiAgICB2YXIgbWluLFxuICAgICAgbyA9IGluc3RhbmNlLm9wdGlvbnMsXG4gICAgICBncm91cCA9ICQubWFrZUFycmF5KCQoby5zdGFjaykpLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICByZXR1cm4gKHBhcnNlSW50KCQoYSkuY3NzKFwiekluZGV4XCIpLCAxMCkgfHwgMCkgLSAocGFyc2VJbnQoJChiKS5jc3MoXCJ6SW5kZXhcIiksIDEwKSB8fCAwKTtcbiAgICAgIH0pO1xuXG4gICAgaWYgKCFncm91cC5sZW5ndGgpIHsgcmV0dXJuOyB9XG5cbiAgICBtaW4gPSBwYXJzZUludCgkKGdyb3VwWzBdKS5jc3MoXCJ6SW5kZXhcIiksIDEwKSB8fCAwO1xuICAgICQoZ3JvdXApLmVhY2goZnVuY3Rpb24oaSkge1xuICAgICAgJCh0aGlzKS5jc3MoXCJ6SW5kZXhcIiwgbWluICsgaSk7XG4gICAgfSk7XG4gICAgdGhpcy5jc3MoXCJ6SW5kZXhcIiwgKG1pbiArIGdyb3VwLmxlbmd0aCkpO1xuICB9XG59KTtcblxuJC51aS5wbHVnaW4uYWRkKFwiZHJhZ2dhYmxlXCIsIFwiekluZGV4XCIsIHtcbiAgc3RhcnQ6IGZ1bmN0aW9uKCBldmVudCwgdWksIGluc3RhbmNlICkge1xuICAgIHZhciB0ID0gJCggdWkuaGVscGVyICksXG4gICAgICBvID0gaW5zdGFuY2Uub3B0aW9ucztcblxuICAgIGlmICh0LmNzcyhcInpJbmRleFwiKSkge1xuICAgICAgby5fekluZGV4ID0gdC5jc3MoXCJ6SW5kZXhcIik7XG4gICAgfVxuICAgIHQuY3NzKFwiekluZGV4XCIsIG8uekluZGV4KTtcbiAgfSxcbiAgc3RvcDogZnVuY3Rpb24oIGV2ZW50LCB1aSwgaW5zdGFuY2UgKSB7XG4gICAgdmFyIG8gPSBpbnN0YW5jZS5vcHRpb25zO1xuXG4gICAgaWYgKG8uX3pJbmRleCkge1xuICAgICAgJCh1aS5oZWxwZXIpLmNzcyhcInpJbmRleFwiLCBvLl96SW5kZXgpO1xuICAgIH1cbiAgfVxufSk7XG5cbnZhciBkcmFnZ2FibGUgPSAkLnVpLmRyYWdnYWJsZTtcblxuXG4vKiFcbiAqIGpRdWVyeSBVSSBEcm9wcGFibGUgMS4xMS4zXG4gKiBodHRwOi8vanF1ZXJ5dWkuY29tXG4gKlxuICogQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnNcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqIGh0dHA6Ly9qcXVlcnkub3JnL2xpY2Vuc2VcbiAqXG4gKiBodHRwOi8vYXBpLmpxdWVyeXVpLmNvbS9kcm9wcGFibGUvXG4gKi9cblxuXG4kLndpZGdldCggXCJ1aS5kcm9wcGFibGVcIiwge1xuICB2ZXJzaW9uOiBcIjEuMTEuM1wiLFxuICB3aWRnZXRFdmVudFByZWZpeDogXCJkcm9wXCIsXG4gIG9wdGlvbnM6IHtcbiAgICBhY2NlcHQ6IFwiKlwiLFxuICAgIGFjdGl2ZUNsYXNzOiBmYWxzZSxcbiAgICBhZGRDbGFzc2VzOiB0cnVlLFxuICAgIGdyZWVkeTogZmFsc2UsXG4gICAgaG92ZXJDbGFzczogZmFsc2UsXG4gICAgc2NvcGU6IFwiZGVmYXVsdFwiLFxuICAgIHRvbGVyYW5jZTogXCJpbnRlcnNlY3RcIixcblxuICAgIC8vIGNhbGxiYWNrc1xuICAgIGFjdGl2YXRlOiBudWxsLFxuICAgIGRlYWN0aXZhdGU6IG51bGwsXG4gICAgZHJvcDogbnVsbCxcbiAgICBvdXQ6IG51bGwsXG4gICAgb3ZlcjogbnVsbFxuICB9LFxuICBfY3JlYXRlOiBmdW5jdGlvbigpIHtcblxuICAgIHZhciBwcm9wb3J0aW9ucyxcbiAgICAgIG8gPSB0aGlzLm9wdGlvbnMsXG4gICAgICBhY2NlcHQgPSBvLmFjY2VwdDtcblxuICAgIHRoaXMuaXNvdmVyID0gZmFsc2U7XG4gICAgdGhpcy5pc291dCA9IHRydWU7XG5cbiAgICB0aGlzLmFjY2VwdCA9ICQuaXNGdW5jdGlvbiggYWNjZXB0ICkgPyBhY2NlcHQgOiBmdW5jdGlvbiggZCApIHtcbiAgICAgIHJldHVybiBkLmlzKCBhY2NlcHQgKTtcbiAgICB9O1xuXG4gICAgdGhpcy5wcm9wb3J0aW9ucyA9IGZ1bmN0aW9uKCAvKiB2YWx1ZVRvV3JpdGUgKi8gKSB7XG4gICAgICBpZiAoIGFyZ3VtZW50cy5sZW5ndGggKSB7XG4gICAgICAgIC8vIFN0b3JlIHRoZSBkcm9wcGFibGUncyBwcm9wb3J0aW9uc1xuICAgICAgICBwcm9wb3J0aW9ucyA9IGFyZ3VtZW50c1sgMCBdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gUmV0cmlldmUgb3IgZGVyaXZlIHRoZSBkcm9wcGFibGUncyBwcm9wb3J0aW9uc1xuICAgICAgICByZXR1cm4gcHJvcG9ydGlvbnMgP1xuICAgICAgICAgIHByb3BvcnRpb25zIDpcbiAgICAgICAgICBwcm9wb3J0aW9ucyA9IHtcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmVsZW1lbnRbIDAgXS5vZmZzZXRXaWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5lbGVtZW50WyAwIF0ub2Zmc2V0SGVpZ2h0XG4gICAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5fYWRkVG9NYW5hZ2VyKCBvLnNjb3BlICk7XG5cbiAgICBvLmFkZENsYXNzZXMgJiYgdGhpcy5lbGVtZW50LmFkZENsYXNzKCBcInVpLWRyb3BwYWJsZVwiICk7XG5cbiAgfSxcblxuICBfYWRkVG9NYW5hZ2VyOiBmdW5jdGlvbiggc2NvcGUgKSB7XG4gICAgLy8gQWRkIHRoZSByZWZlcmVuY2UgYW5kIHBvc2l0aW9ucyB0byB0aGUgbWFuYWdlclxuICAgICQudWkuZGRtYW5hZ2VyLmRyb3BwYWJsZXNbIHNjb3BlIF0gPSAkLnVpLmRkbWFuYWdlci5kcm9wcGFibGVzWyBzY29wZSBdIHx8IFtdO1xuICAgICQudWkuZGRtYW5hZ2VyLmRyb3BwYWJsZXNbIHNjb3BlIF0ucHVzaCggdGhpcyApO1xuICB9LFxuXG4gIF9zcGxpY2U6IGZ1bmN0aW9uKCBkcm9wICkge1xuICAgIHZhciBpID0gMDtcbiAgICBmb3IgKCA7IGkgPCBkcm9wLmxlbmd0aDsgaSsrICkge1xuICAgICAgaWYgKCBkcm9wWyBpIF0gPT09IHRoaXMgKSB7XG4gICAgICAgIGRyb3Auc3BsaWNlKCBpLCAxICk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIF9kZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZHJvcCA9ICQudWkuZGRtYW5hZ2VyLmRyb3BwYWJsZXNbIHRoaXMub3B0aW9ucy5zY29wZSBdO1xuXG4gICAgdGhpcy5fc3BsaWNlKCBkcm9wICk7XG5cbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoIFwidWktZHJvcHBhYmxlIHVpLWRyb3BwYWJsZS1kaXNhYmxlZFwiICk7XG4gIH0sXG5cbiAgX3NldE9wdGlvbjogZnVuY3Rpb24oIGtleSwgdmFsdWUgKSB7XG5cbiAgICBpZiAoIGtleSA9PT0gXCJhY2NlcHRcIiApIHtcbiAgICAgIHRoaXMuYWNjZXB0ID0gJC5pc0Z1bmN0aW9uKCB2YWx1ZSApID8gdmFsdWUgOiBmdW5jdGlvbiggZCApIHtcbiAgICAgICAgcmV0dXJuIGQuaXMoIHZhbHVlICk7XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoIGtleSA9PT0gXCJzY29wZVwiICkge1xuICAgICAgdmFyIGRyb3AgPSAkLnVpLmRkbWFuYWdlci5kcm9wcGFibGVzWyB0aGlzLm9wdGlvbnMuc2NvcGUgXTtcblxuICAgICAgdGhpcy5fc3BsaWNlKCBkcm9wICk7XG4gICAgICB0aGlzLl9hZGRUb01hbmFnZXIoIHZhbHVlICk7XG4gICAgfVxuXG4gICAgdGhpcy5fc3VwZXIoIGtleSwgdmFsdWUgKTtcbiAgfSxcblxuICBfYWN0aXZhdGU6IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICB2YXIgZHJhZ2dhYmxlID0gJC51aS5kZG1hbmFnZXIuY3VycmVudDtcbiAgICBpZiAoIHRoaXMub3B0aW9ucy5hY3RpdmVDbGFzcyApIHtcbiAgICAgIHRoaXMuZWxlbWVudC5hZGRDbGFzcyggdGhpcy5vcHRpb25zLmFjdGl2ZUNsYXNzICk7XG4gICAgfVxuICAgIGlmICggZHJhZ2dhYmxlICl7XG4gICAgICB0aGlzLl90cmlnZ2VyKCBcImFjdGl2YXRlXCIsIGV2ZW50LCB0aGlzLnVpKCBkcmFnZ2FibGUgKSApO1xuICAgIH1cbiAgfSxcblxuICBfZGVhY3RpdmF0ZTogZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgIHZhciBkcmFnZ2FibGUgPSAkLnVpLmRkbWFuYWdlci5jdXJyZW50O1xuICAgIGlmICggdGhpcy5vcHRpb25zLmFjdGl2ZUNsYXNzICkge1xuICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCB0aGlzLm9wdGlvbnMuYWN0aXZlQ2xhc3MgKTtcbiAgICB9XG4gICAgaWYgKCBkcmFnZ2FibGUgKXtcbiAgICAgIHRoaXMuX3RyaWdnZXIoIFwiZGVhY3RpdmF0ZVwiLCBldmVudCwgdGhpcy51aSggZHJhZ2dhYmxlICkgKTtcbiAgICB9XG4gIH0sXG5cbiAgX292ZXI6IGZ1bmN0aW9uKCBldmVudCApIHtcblxuICAgIHZhciBkcmFnZ2FibGUgPSAkLnVpLmRkbWFuYWdlci5jdXJyZW50O1xuXG4gICAgLy8gQmFpbCBpZiBkcmFnZ2FibGUgYW5kIGRyb3BwYWJsZSBhcmUgc2FtZSBlbGVtZW50XG4gICAgaWYgKCAhZHJhZ2dhYmxlIHx8ICggZHJhZ2dhYmxlLmN1cnJlbnRJdGVtIHx8IGRyYWdnYWJsZS5lbGVtZW50IClbIDAgXSA9PT0gdGhpcy5lbGVtZW50WyAwIF0gKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCB0aGlzLmFjY2VwdC5jYWxsKCB0aGlzLmVsZW1lbnRbIDAgXSwgKCBkcmFnZ2FibGUuY3VycmVudEl0ZW0gfHwgZHJhZ2dhYmxlLmVsZW1lbnQgKSApICkge1xuICAgICAgaWYgKCB0aGlzLm9wdGlvbnMuaG92ZXJDbGFzcyApIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LmFkZENsYXNzKCB0aGlzLm9wdGlvbnMuaG92ZXJDbGFzcyApO1xuICAgICAgfVxuICAgICAgdGhpcy5fdHJpZ2dlciggXCJvdmVyXCIsIGV2ZW50LCB0aGlzLnVpKCBkcmFnZ2FibGUgKSApO1xuICAgIH1cblxuICB9LFxuXG4gIF9vdXQ6IGZ1bmN0aW9uKCBldmVudCApIHtcblxuICAgIHZhciBkcmFnZ2FibGUgPSAkLnVpLmRkbWFuYWdlci5jdXJyZW50O1xuXG4gICAgLy8gQmFpbCBpZiBkcmFnZ2FibGUgYW5kIGRyb3BwYWJsZSBhcmUgc2FtZSBlbGVtZW50XG4gICAgaWYgKCAhZHJhZ2dhYmxlIHx8ICggZHJhZ2dhYmxlLmN1cnJlbnRJdGVtIHx8IGRyYWdnYWJsZS5lbGVtZW50IClbIDAgXSA9PT0gdGhpcy5lbGVtZW50WyAwIF0gKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCB0aGlzLmFjY2VwdC5jYWxsKCB0aGlzLmVsZW1lbnRbIDAgXSwgKCBkcmFnZ2FibGUuY3VycmVudEl0ZW0gfHwgZHJhZ2dhYmxlLmVsZW1lbnQgKSApICkge1xuICAgICAgaWYgKCB0aGlzLm9wdGlvbnMuaG92ZXJDbGFzcyApIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCB0aGlzLm9wdGlvbnMuaG92ZXJDbGFzcyApO1xuICAgICAgfVxuICAgICAgdGhpcy5fdHJpZ2dlciggXCJvdXRcIiwgZXZlbnQsIHRoaXMudWkoIGRyYWdnYWJsZSApICk7XG4gICAgfVxuXG4gIH0sXG5cbiAgX2Ryb3A6IGZ1bmN0aW9uKCBldmVudCwgY3VzdG9tICkge1xuXG4gICAgdmFyIGRyYWdnYWJsZSA9IGN1c3RvbSB8fCAkLnVpLmRkbWFuYWdlci5jdXJyZW50LFxuICAgICAgY2hpbGRyZW5JbnRlcnNlY3Rpb24gPSBmYWxzZTtcblxuICAgIC8vIEJhaWwgaWYgZHJhZ2dhYmxlIGFuZCBkcm9wcGFibGUgYXJlIHNhbWUgZWxlbWVudFxuICAgIGlmICggIWRyYWdnYWJsZSB8fCAoIGRyYWdnYWJsZS5jdXJyZW50SXRlbSB8fCBkcmFnZ2FibGUuZWxlbWVudCApWyAwIF0gPT09IHRoaXMuZWxlbWVudFsgMCBdICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuZWxlbWVudC5maW5kKCBcIjpkYXRhKHVpLWRyb3BwYWJsZSlcIiApLm5vdCggXCIudWktZHJhZ2dhYmxlLWRyYWdnaW5nXCIgKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGluc3QgPSAkKCB0aGlzICkuZHJvcHBhYmxlKCBcImluc3RhbmNlXCIgKTtcbiAgICAgIGlmIChcbiAgICAgICAgaW5zdC5vcHRpb25zLmdyZWVkeSAmJlxuICAgICAgICAhaW5zdC5vcHRpb25zLmRpc2FibGVkICYmXG4gICAgICAgIGluc3Qub3B0aW9ucy5zY29wZSA9PT0gZHJhZ2dhYmxlLm9wdGlvbnMuc2NvcGUgJiZcbiAgICAgICAgaW5zdC5hY2NlcHQuY2FsbCggaW5zdC5lbGVtZW50WyAwIF0sICggZHJhZ2dhYmxlLmN1cnJlbnRJdGVtIHx8IGRyYWdnYWJsZS5lbGVtZW50ICkgKSAmJlxuICAgICAgICAkLnVpLmludGVyc2VjdCggZHJhZ2dhYmxlLCAkLmV4dGVuZCggaW5zdCwgeyBvZmZzZXQ6IGluc3QuZWxlbWVudC5vZmZzZXQoKSB9ICksIGluc3Qub3B0aW9ucy50b2xlcmFuY2UsIGV2ZW50IClcbiAgICAgICkgeyBjaGlsZHJlbkludGVyc2VjdGlvbiA9IHRydWU7IHJldHVybiBmYWxzZTsgfVxuICAgIH0pO1xuICAgIGlmICggY2hpbGRyZW5JbnRlcnNlY3Rpb24gKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCB0aGlzLmFjY2VwdC5jYWxsKCB0aGlzLmVsZW1lbnRbIDAgXSwgKCBkcmFnZ2FibGUuY3VycmVudEl0ZW0gfHwgZHJhZ2dhYmxlLmVsZW1lbnQgKSApICkge1xuICAgICAgaWYgKCB0aGlzLm9wdGlvbnMuYWN0aXZlQ2xhc3MgKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcyggdGhpcy5vcHRpb25zLmFjdGl2ZUNsYXNzICk7XG4gICAgICB9XG4gICAgICBpZiAoIHRoaXMub3B0aW9ucy5ob3ZlckNsYXNzICkge1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoIHRoaXMub3B0aW9ucy5ob3ZlckNsYXNzICk7XG4gICAgICB9XG4gICAgICB0aGlzLl90cmlnZ2VyKCBcImRyb3BcIiwgZXZlbnQsIHRoaXMudWkoIGRyYWdnYWJsZSApICk7XG4gICAgICByZXR1cm4gdGhpcy5lbGVtZW50O1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcblxuICB9LFxuXG4gIHVpOiBmdW5jdGlvbiggYyApIHtcbiAgICByZXR1cm4ge1xuICAgICAgZHJhZ2dhYmxlOiAoIGMuY3VycmVudEl0ZW0gfHwgYy5lbGVtZW50ICksXG4gICAgICBoZWxwZXI6IGMuaGVscGVyLFxuICAgICAgcG9zaXRpb246IGMucG9zaXRpb24sXG4gICAgICBvZmZzZXQ6IGMucG9zaXRpb25BYnNcbiAgICB9O1xuICB9XG5cbn0pO1xuXG4kLnVpLmludGVyc2VjdCA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gaXNPdmVyQXhpcyggeCwgcmVmZXJlbmNlLCBzaXplICkge1xuICAgIHJldHVybiAoIHggPj0gcmVmZXJlbmNlICkgJiYgKCB4IDwgKCByZWZlcmVuY2UgKyBzaXplICkgKTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiggZHJhZ2dhYmxlLCBkcm9wcGFibGUsIHRvbGVyYW5jZU1vZGUsIGV2ZW50ICkge1xuXG4gICAgaWYgKCAhZHJvcHBhYmxlLm9mZnNldCApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgeDEgPSAoIGRyYWdnYWJsZS5wb3NpdGlvbkFicyB8fCBkcmFnZ2FibGUucG9zaXRpb24uYWJzb2x1dGUgKS5sZWZ0ICsgZHJhZ2dhYmxlLm1hcmdpbnMubGVmdCxcbiAgICAgIHkxID0gKCBkcmFnZ2FibGUucG9zaXRpb25BYnMgfHwgZHJhZ2dhYmxlLnBvc2l0aW9uLmFic29sdXRlICkudG9wICsgZHJhZ2dhYmxlLm1hcmdpbnMudG9wLFxuICAgICAgeDIgPSB4MSArIGRyYWdnYWJsZS5oZWxwZXJQcm9wb3J0aW9ucy53aWR0aCxcbiAgICAgIHkyID0geTEgKyBkcmFnZ2FibGUuaGVscGVyUHJvcG9ydGlvbnMuaGVpZ2h0LFxuICAgICAgbCA9IGRyb3BwYWJsZS5vZmZzZXQubGVmdCxcbiAgICAgIHQgPSBkcm9wcGFibGUub2Zmc2V0LnRvcCxcbiAgICAgIHIgPSBsICsgZHJvcHBhYmxlLnByb3BvcnRpb25zKCkud2lkdGgsXG4gICAgICBiID0gdCArIGRyb3BwYWJsZS5wcm9wb3J0aW9ucygpLmhlaWdodDtcblxuICAgIHN3aXRjaCAoIHRvbGVyYW5jZU1vZGUgKSB7XG4gICAgY2FzZSBcImZpdFwiOlxuICAgICAgcmV0dXJuICggbCA8PSB4MSAmJiB4MiA8PSByICYmIHQgPD0geTEgJiYgeTIgPD0gYiApO1xuICAgIGNhc2UgXCJpbnRlcnNlY3RcIjpcbiAgICAgIHJldHVybiAoIGwgPCB4MSArICggZHJhZ2dhYmxlLmhlbHBlclByb3BvcnRpb25zLndpZHRoIC8gMiApICYmIC8vIFJpZ2h0IEhhbGZcbiAgICAgICAgeDIgLSAoIGRyYWdnYWJsZS5oZWxwZXJQcm9wb3J0aW9ucy53aWR0aCAvIDIgKSA8IHIgJiYgLy8gTGVmdCBIYWxmXG4gICAgICAgIHQgPCB5MSArICggZHJhZ2dhYmxlLmhlbHBlclByb3BvcnRpb25zLmhlaWdodCAvIDIgKSAmJiAvLyBCb3R0b20gSGFsZlxuICAgICAgICB5MiAtICggZHJhZ2dhYmxlLmhlbHBlclByb3BvcnRpb25zLmhlaWdodCAvIDIgKSA8IGIgKTsgLy8gVG9wIEhhbGZcbiAgICBjYXNlIFwicG9pbnRlclwiOlxuICAgICAgcmV0dXJuIGlzT3ZlckF4aXMoIGV2ZW50LnBhZ2VZLCB0LCBkcm9wcGFibGUucHJvcG9ydGlvbnMoKS5oZWlnaHQgKSAmJiBpc092ZXJBeGlzKCBldmVudC5wYWdlWCwgbCwgZHJvcHBhYmxlLnByb3BvcnRpb25zKCkud2lkdGggKTtcbiAgICBjYXNlIFwidG91Y2hcIjpcbiAgICAgIHJldHVybiAoXG4gICAgICAgICggeTEgPj0gdCAmJiB5MSA8PSBiICkgfHwgLy8gVG9wIGVkZ2UgdG91Y2hpbmdcbiAgICAgICAgKCB5MiA+PSB0ICYmIHkyIDw9IGIgKSB8fCAvLyBCb3R0b20gZWRnZSB0b3VjaGluZ1xuICAgICAgICAoIHkxIDwgdCAmJiB5MiA+IGIgKSAvLyBTdXJyb3VuZGVkIHZlcnRpY2FsbHlcbiAgICAgICkgJiYgKFxuICAgICAgICAoIHgxID49IGwgJiYgeDEgPD0gciApIHx8IC8vIExlZnQgZWRnZSB0b3VjaGluZ1xuICAgICAgICAoIHgyID49IGwgJiYgeDIgPD0gciApIHx8IC8vIFJpZ2h0IGVkZ2UgdG91Y2hpbmdcbiAgICAgICAgKCB4MSA8IGwgJiYgeDIgPiByICkgLy8gU3Vycm91bmRlZCBob3Jpem9udGFsbHlcbiAgICAgICk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH07XG59KSgpO1xuXG4vKlxuICBUaGlzIG1hbmFnZXIgdHJhY2tzIG9mZnNldHMgb2YgZHJhZ2dhYmxlcyBhbmQgZHJvcHBhYmxlc1xuKi9cbiQudWkuZGRtYW5hZ2VyID0ge1xuICBjdXJyZW50OiBudWxsLFxuICBkcm9wcGFibGVzOiB7IFwiZGVmYXVsdFwiOiBbXSB9LFxuICBwcmVwYXJlT2Zmc2V0czogZnVuY3Rpb24oIHQsIGV2ZW50ICkge1xuXG4gICAgdmFyIGksIGosXG4gICAgICBtID0gJC51aS5kZG1hbmFnZXIuZHJvcHBhYmxlc1sgdC5vcHRpb25zLnNjb3BlIF0gfHwgW10sXG4gICAgICB0eXBlID0gZXZlbnQgPyBldmVudC50eXBlIDogbnVsbCwgLy8gd29ya2Fyb3VuZCBmb3IgIzIzMTdcbiAgICAgIGxpc3QgPSAoIHQuY3VycmVudEl0ZW0gfHwgdC5lbGVtZW50ICkuZmluZCggXCI6ZGF0YSh1aS1kcm9wcGFibGUpXCIgKS5hZGRCYWNrKCk7XG5cbiAgICBkcm9wcGFibGVzTG9vcDogZm9yICggaSA9IDA7IGkgPCBtLmxlbmd0aDsgaSsrICkge1xuXG4gICAgICAvLyBObyBkaXNhYmxlZCBhbmQgbm9uLWFjY2VwdGVkXG4gICAgICBpZiAoIG1bIGkgXS5vcHRpb25zLmRpc2FibGVkIHx8ICggdCAmJiAhbVsgaSBdLmFjY2VwdC5jYWxsKCBtWyBpIF0uZWxlbWVudFsgMCBdLCAoIHQuY3VycmVudEl0ZW0gfHwgdC5lbGVtZW50ICkgKSApICkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gRmlsdGVyIG91dCBlbGVtZW50cyBpbiB0aGUgY3VycmVudCBkcmFnZ2VkIGl0ZW1cbiAgICAgIGZvciAoIGogPSAwOyBqIDwgbGlzdC5sZW5ndGg7IGorKyApIHtcbiAgICAgICAgaWYgKCBsaXN0WyBqIF0gPT09IG1bIGkgXS5lbGVtZW50WyAwIF0gKSB7XG4gICAgICAgICAgbVsgaSBdLnByb3BvcnRpb25zKCkuaGVpZ2h0ID0gMDtcbiAgICAgICAgICBjb250aW51ZSBkcm9wcGFibGVzTG9vcDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBtWyBpIF0udmlzaWJsZSA9IG1bIGkgXS5lbGVtZW50LmNzcyggXCJkaXNwbGF5XCIgKSAhPT0gXCJub25lXCI7XG4gICAgICBpZiAoICFtWyBpIF0udmlzaWJsZSApIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIEFjdGl2YXRlIHRoZSBkcm9wcGFibGUgaWYgdXNlZCBkaXJlY3RseSBmcm9tIGRyYWdnYWJsZXNcbiAgICAgIGlmICggdHlwZSA9PT0gXCJtb3VzZWRvd25cIiApIHtcbiAgICAgICAgbVsgaSBdLl9hY3RpdmF0ZS5jYWxsKCBtWyBpIF0sIGV2ZW50ICk7XG4gICAgICB9XG5cbiAgICAgIG1bIGkgXS5vZmZzZXQgPSBtWyBpIF0uZWxlbWVudC5vZmZzZXQoKTtcbiAgICAgIG1bIGkgXS5wcm9wb3J0aW9ucyh7IHdpZHRoOiBtWyBpIF0uZWxlbWVudFsgMCBdLm9mZnNldFdpZHRoLCBoZWlnaHQ6IG1bIGkgXS5lbGVtZW50WyAwIF0ub2Zmc2V0SGVpZ2h0IH0pO1xuXG4gICAgfVxuXG4gIH0sXG4gIGRyb3A6IGZ1bmN0aW9uKCBkcmFnZ2FibGUsIGV2ZW50ICkge1xuXG4gICAgdmFyIGRyb3BwZWQgPSBmYWxzZTtcbiAgICAvLyBDcmVhdGUgYSBjb3B5IG9mIHRoZSBkcm9wcGFibGVzIGluIGNhc2UgdGhlIGxpc3QgY2hhbmdlcyBkdXJpbmcgdGhlIGRyb3AgKCM5MTE2KVxuICAgICQuZWFjaCggKCAkLnVpLmRkbWFuYWdlci5kcm9wcGFibGVzWyBkcmFnZ2FibGUub3B0aW9ucy5zY29wZSBdIHx8IFtdICkuc2xpY2UoKSwgZnVuY3Rpb24oKSB7XG5cbiAgICAgIGlmICggIXRoaXMub3B0aW9ucyApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCAhdGhpcy5vcHRpb25zLmRpc2FibGVkICYmIHRoaXMudmlzaWJsZSAmJiAkLnVpLmludGVyc2VjdCggZHJhZ2dhYmxlLCB0aGlzLCB0aGlzLm9wdGlvbnMudG9sZXJhbmNlLCBldmVudCApICkge1xuICAgICAgICBkcm9wcGVkID0gdGhpcy5fZHJvcC5jYWxsKCB0aGlzLCBldmVudCApIHx8IGRyb3BwZWQ7XG4gICAgICB9XG5cbiAgICAgIGlmICggIXRoaXMub3B0aW9ucy5kaXNhYmxlZCAmJiB0aGlzLnZpc2libGUgJiYgdGhpcy5hY2NlcHQuY2FsbCggdGhpcy5lbGVtZW50WyAwIF0sICggZHJhZ2dhYmxlLmN1cnJlbnRJdGVtIHx8IGRyYWdnYWJsZS5lbGVtZW50ICkgKSApIHtcbiAgICAgICAgdGhpcy5pc291dCA9IHRydWU7XG4gICAgICAgIHRoaXMuaXNvdmVyID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX2RlYWN0aXZhdGUuY2FsbCggdGhpcywgZXZlbnQgKTtcbiAgICAgIH1cblxuICAgIH0pO1xuICAgIHJldHVybiBkcm9wcGVkO1xuXG4gIH0sXG4gIGRyYWdTdGFydDogZnVuY3Rpb24oIGRyYWdnYWJsZSwgZXZlbnQgKSB7XG4gICAgLy8gTGlzdGVuIGZvciBzY3JvbGxpbmcgc28gdGhhdCBpZiB0aGUgZHJhZ2dpbmcgY2F1c2VzIHNjcm9sbGluZyB0aGUgcG9zaXRpb24gb2YgdGhlIGRyb3BwYWJsZXMgY2FuIGJlIHJlY2FsY3VsYXRlZCAoc2VlICM1MDAzKVxuICAgIGRyYWdnYWJsZS5lbGVtZW50LnBhcmVudHNVbnRpbCggXCJib2R5XCIgKS5iaW5kKCBcInNjcm9sbC5kcm9wcGFibGVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoICFkcmFnZ2FibGUub3B0aW9ucy5yZWZyZXNoUG9zaXRpb25zICkge1xuICAgICAgICAkLnVpLmRkbWFuYWdlci5wcmVwYXJlT2Zmc2V0cyggZHJhZ2dhYmxlLCBldmVudCApO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBkcmFnOiBmdW5jdGlvbiggZHJhZ2dhYmxlLCBldmVudCApIHtcblxuICAgIC8vIElmIHlvdSBoYXZlIGEgaGlnaGx5IGR5bmFtaWMgcGFnZSwgeW91IG1pZ2h0IHRyeSB0aGlzIG9wdGlvbi4gSXQgcmVuZGVycyBwb3NpdGlvbnMgZXZlcnkgdGltZSB5b3UgbW92ZSB0aGUgbW91c2UuXG4gICAgaWYgKCBkcmFnZ2FibGUub3B0aW9ucy5yZWZyZXNoUG9zaXRpb25zICkge1xuICAgICAgJC51aS5kZG1hbmFnZXIucHJlcGFyZU9mZnNldHMoIGRyYWdnYWJsZSwgZXZlbnQgKTtcbiAgICB9XG5cbiAgICAvLyBSdW4gdGhyb3VnaCBhbGwgZHJvcHBhYmxlcyBhbmQgY2hlY2sgdGhlaXIgcG9zaXRpb25zIGJhc2VkIG9uIHNwZWNpZmljIHRvbGVyYW5jZSBvcHRpb25zXG4gICAgJC5lYWNoKCAkLnVpLmRkbWFuYWdlci5kcm9wcGFibGVzWyBkcmFnZ2FibGUub3B0aW9ucy5zY29wZSBdIHx8IFtdLCBmdW5jdGlvbigpIHtcblxuICAgICAgaWYgKCB0aGlzLm9wdGlvbnMuZGlzYWJsZWQgfHwgdGhpcy5ncmVlZHlDaGlsZCB8fCAhdGhpcy52aXNpYmxlICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBwYXJlbnRJbnN0YW5jZSwgc2NvcGUsIHBhcmVudCxcbiAgICAgICAgaW50ZXJzZWN0cyA9ICQudWkuaW50ZXJzZWN0KCBkcmFnZ2FibGUsIHRoaXMsIHRoaXMub3B0aW9ucy50b2xlcmFuY2UsIGV2ZW50ICksXG4gICAgICAgIGMgPSAhaW50ZXJzZWN0cyAmJiB0aGlzLmlzb3ZlciA/IFwiaXNvdXRcIiA6ICggaW50ZXJzZWN0cyAmJiAhdGhpcy5pc292ZXIgPyBcImlzb3ZlclwiIDogbnVsbCApO1xuICAgICAgaWYgKCAhYyApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIHRoaXMub3B0aW9ucy5ncmVlZHkgKSB7XG4gICAgICAgIC8vIGZpbmQgZHJvcHBhYmxlIHBhcmVudHMgd2l0aCBzYW1lIHNjb3BlXG4gICAgICAgIHNjb3BlID0gdGhpcy5vcHRpb25zLnNjb3BlO1xuICAgICAgICBwYXJlbnQgPSB0aGlzLmVsZW1lbnQucGFyZW50cyggXCI6ZGF0YSh1aS1kcm9wcGFibGUpXCIgKS5maWx0ZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuICQoIHRoaXMgKS5kcm9wcGFibGUoIFwiaW5zdGFuY2VcIiApLm9wdGlvbnMuc2NvcGUgPT09IHNjb3BlO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIHBhcmVudC5sZW5ndGggKSB7XG4gICAgICAgICAgcGFyZW50SW5zdGFuY2UgPSAkKCBwYXJlbnRbIDAgXSApLmRyb3BwYWJsZSggXCJpbnN0YW5jZVwiICk7XG4gICAgICAgICAgcGFyZW50SW5zdGFuY2UuZ3JlZWR5Q2hpbGQgPSAoIGMgPT09IFwiaXNvdmVyXCIgKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyB3ZSBqdXN0IG1vdmVkIGludG8gYSBncmVlZHkgY2hpbGRcbiAgICAgIGlmICggcGFyZW50SW5zdGFuY2UgJiYgYyA9PT0gXCJpc292ZXJcIiApIHtcbiAgICAgICAgcGFyZW50SW5zdGFuY2UuaXNvdmVyID0gZmFsc2U7XG4gICAgICAgIHBhcmVudEluc3RhbmNlLmlzb3V0ID0gdHJ1ZTtcbiAgICAgICAgcGFyZW50SW5zdGFuY2UuX291dC5jYWxsKCBwYXJlbnRJbnN0YW5jZSwgZXZlbnQgKTtcbiAgICAgIH1cblxuICAgICAgdGhpc1sgYyBdID0gdHJ1ZTtcbiAgICAgIHRoaXNbYyA9PT0gXCJpc291dFwiID8gXCJpc292ZXJcIiA6IFwiaXNvdXRcIl0gPSBmYWxzZTtcbiAgICAgIHRoaXNbYyA9PT0gXCJpc292ZXJcIiA/IFwiX292ZXJcIiA6IFwiX291dFwiXS5jYWxsKCB0aGlzLCBldmVudCApO1xuXG4gICAgICAvLyB3ZSBqdXN0IG1vdmVkIG91dCBvZiBhIGdyZWVkeSBjaGlsZFxuICAgICAgaWYgKCBwYXJlbnRJbnN0YW5jZSAmJiBjID09PSBcImlzb3V0XCIgKSB7XG4gICAgICAgIHBhcmVudEluc3RhbmNlLmlzb3V0ID0gZmFsc2U7XG4gICAgICAgIHBhcmVudEluc3RhbmNlLmlzb3ZlciA9IHRydWU7XG4gICAgICAgIHBhcmVudEluc3RhbmNlLl9vdmVyLmNhbGwoIHBhcmVudEluc3RhbmNlLCBldmVudCApO1xuICAgICAgfVxuICAgIH0pO1xuXG4gIH0sXG4gIGRyYWdTdG9wOiBmdW5jdGlvbiggZHJhZ2dhYmxlLCBldmVudCApIHtcbiAgICBkcmFnZ2FibGUuZWxlbWVudC5wYXJlbnRzVW50aWwoIFwiYm9keVwiICkudW5iaW5kKCBcInNjcm9sbC5kcm9wcGFibGVcIiApO1xuICAgIC8vIENhbGwgcHJlcGFyZU9mZnNldHMgb25lIGZpbmFsIHRpbWUgc2luY2UgSUUgZG9lcyBub3QgZmlyZSByZXR1cm4gc2Nyb2xsIGV2ZW50cyB3aGVuIG92ZXJmbG93IHdhcyBjYXVzZWQgYnkgZHJhZyAoc2VlICM1MDAzKVxuICAgIGlmICggIWRyYWdnYWJsZS5vcHRpb25zLnJlZnJlc2hQb3NpdGlvbnMgKSB7XG4gICAgICAkLnVpLmRkbWFuYWdlci5wcmVwYXJlT2Zmc2V0cyggZHJhZ2dhYmxlLCBldmVudCApO1xuICAgIH1cbiAgfVxufTtcblxudmFyIGRyb3BwYWJsZSA9ICQudWkuZHJvcHBhYmxlO1xuXG5cblxufSkpOyJdfQ==
