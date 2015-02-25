(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./game.js')();
},{"./game.js":2}],2:[function(require,module,exports){
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

},{"./stockmarket-view-model.js":4,"knockout":"knockout"}],3:[function(require,module,exports){
'use strict';

var ko = require('knockout');

function Order(data) {
  this.price = data.price;
  this.fixed = ko.observable(false);
  this.side = data.side;
  this.spread = ko.observable(false);
}

module.exports = Order;
},{"knockout":"knockout"}],4:[function(require,module,exports){
(function (global){
'use strict';

var ko = require('knockout');
var d3 = require('d3');
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
require('./vendor/jquery-ui.js');
var Order = require('./order.js');

function StockMarketViewModel() {
  var self = this;

  self.orders = ko.observableArray([]);

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
        }
      };

      viewModel.side === 'ask' ? orderEl.draggable(dragConfig) : orderEl.droppable(dropConfig);

    }
  }

  function updateSpread(drag, drop) {
    var spread = ko.dataFor(drop).price - ko.dataFor(drag).price;
    ko.dataFor(drag).spread(spread.toFixed(2));
  }
}

module.exports = StockMarketViewModel;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./order.js":3,"./vendor/jquery-ui.js":5,"d3":"d3","knockout":"knockout"}],5:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvc3JjL3NjcmlwdHMvYXBwLmpzIiwicHVibGljL3NyYy9zY3JpcHRzL2dhbWUuanMiLCJwdWJsaWMvc3JjL3NjcmlwdHMvb3JkZXIuanMiLCJwdWJsaWMvc3JjL3NjcmlwdHMvc3RvY2ttYXJrZXQtdmlldy1tb2RlbC5qcyIsInB1YmxpYy9zcmMvc2NyaXB0cy92ZW5kb3IvanF1ZXJ5LXVpLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJy4vZ2FtZS5qcycpKCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LiQgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLiQgOiBudWxsKTtcbnZhciBrbyA9IHJlcXVpcmUoJ2tub2Nrb3V0Jyk7XG5cbnZhciBTdG9ja01hcmtldFZpZXdNb2RlbCA9IHJlcXVpcmUoJy4vc3RvY2ttYXJrZXQtdmlldy1tb2RlbC5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc3RvY2tNYXJrZXRWaWV3TW9kZWw7XG5cbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgc3RvY2tNYXJrZXRWaWV3TW9kZWwgPSBuZXcgU3RvY2tNYXJrZXRWaWV3TW9kZWwoKTtcbiAgICBrby5hcHBseUJpbmRpbmdzKHN0b2NrTWFya2V0Vmlld01vZGVsKTtcbiAgfSlcbn0iLCIndXNlIHN0cmljdCc7XG5cbnZhciBrbyA9IHJlcXVpcmUoJ2tub2Nrb3V0Jyk7XG5cbmZ1bmN0aW9uIE9yZGVyKGRhdGEpIHtcbiAgdGhpcy5wcmljZSA9IGRhdGEucHJpY2U7XG4gIHRoaXMuZml4ZWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcbiAgdGhpcy5zaWRlID0gZGF0YS5zaWRlO1xuICB0aGlzLnNwcmVhZCA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE9yZGVyOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGtvID0gcmVxdWlyZSgna25vY2tvdXQnKTtcbnZhciBkMyA9IHJlcXVpcmUoJ2QzJyk7XG52YXIgJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LiQgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLiQgOiBudWxsKTtcbnJlcXVpcmUoJy4vdmVuZG9yL2pxdWVyeS11aS5qcycpO1xudmFyIE9yZGVyID0gcmVxdWlyZSgnLi9vcmRlci5qcycpO1xuXG5mdW5jdGlvbiBTdG9ja01hcmtldFZpZXdNb2RlbCgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHNlbGYub3JkZXJzID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcblxuICBzZWxmLmFkZE9yZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG5ld09yZGVyID0gZ2VuZXJhdGVPcmRlcigpO1xuICAgIHNlbGYub3JkZXJzLnB1c2gobmV3T3JkZXIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVPcmRlcigpIHtcbiAgICB2YXIgcHJpY2VNZWFuID0gMTkuMDI7XG4gICAgdmFyIHByaWNlU3RkZXYgPSA0O1xuXG4gICAgdmFyIHNpZGUgPSBNYXRoLnJhbmRvbSgpIDwgMC41ID8gJ2JpZCcgOiAnYXNrJztcbiAgICB2YXIgcHJpY2UgPSBkMy5yYW5kb20ubm9ybWFsKHByaWNlTWVhbiwgcHJpY2VTdGRldikoKS50b0ZpeGVkKDIpO1xuXG4gICAgcmV0dXJuIG5ldyBPcmRlcih7cHJpY2U6IHByaWNlLCBzaWRlOiBzaWRlfSlcbiAgfVxuXG4gIGtvLmJpbmRpbmdIYW5kbGVycy5kcmFnZHJvcCA9IHtcbiAgICBpbml0OiBmdW5jdGlvbihlbGVtZW50LCB2YWx1ZUFjY2Vzc29yLCBhbGxCaW5kaW5ncywgdmlld01vZGVsLCBiaW5kaW5nQ29udGV4dCkge1xuXG4gICAgICB2YXIgb3JkZXJFbCA9ICQoZWxlbWVudCk7XG5cbiAgICAgIHZhciBkcmFnQ29uZmlnID0ge1xuICAgICAgICByZXZlcnQ6IFwiaW52YWxpZFwiLFxuICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICBzbmFwOiBcIi51aS1kcm9wcGFibGVcIixcbiAgICAgICAgc25hcE1vZGU6IFwiaW5uZXJcIlxuICAgICAgfTtcblxuICAgICAgdmFyIGRyb3BDb25maWcgPSB7XG4gICAgICAgIG92ZXI6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuICAgICAgICAgIHZhciBkcmFnRWwgPSB1aS5kcmFnZ2FibGVbMF07XG4gICAgICAgICAgdmFyIGRyb3BFbCA9IGV2ZW50LnRhcmdldFxuXG4gICAgICAgICAgdXBkYXRlU3ByZWFkKGRyYWdFbCwgZHJvcEVsKVxuICAgICAgICB9LFxuICAgICAgICBvdXQ6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xuICAgICAgICAgIGtvLmRhdGFGb3IodWkuZHJhZ2dhYmxlWzBdKS5zcHJlYWQoZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB2aWV3TW9kZWwuc2lkZSA9PT0gJ2FzaycgPyBvcmRlckVsLmRyYWdnYWJsZShkcmFnQ29uZmlnKSA6IG9yZGVyRWwuZHJvcHBhYmxlKGRyb3BDb25maWcpO1xuXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlU3ByZWFkKGRyYWcsIGRyb3ApIHtcbiAgICB2YXIgc3ByZWFkID0ga28uZGF0YUZvcihkcm9wKS5wcmljZSAtIGtvLmRhdGFGb3IoZHJhZykucHJpY2U7XG4gICAga28uZGF0YUZvcihkcmFnKS5zcHJlYWQoc3ByZWFkLnRvRml4ZWQoMikpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU3RvY2tNYXJrZXRWaWV3TW9kZWw7IiwiLyohIGpRdWVyeSBVSSAtIHYxLjExLjMgLSAyMDE1LTAyLTI1XG4qIGh0dHA6Ly9qcXVlcnl1aS5jb21cbiogSW5jbHVkZXM6IGNvcmUuanMsIHdpZGdldC5qcywgbW91c2UuanMsIGRyYWdnYWJsZS5qcywgZHJvcHBhYmxlLmpzXG4qIENvcHlyaWdodCAyMDE1IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnM7IExpY2Vuc2VkIE1JVCAqL1xuXG4oZnVuY3Rpb24oIGZhY3RvcnkgKSB7XG4gIGlmICggdHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQgKSB7XG5cbiAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgZGVmaW5lKFsgXCJqcXVlcnlcIiBdLCBmYWN0b3J5ICk7XG4gIH0gZWxzZSB7XG5cbiAgICAvLyBCcm93c2VyIGdsb2JhbHNcbiAgICBmYWN0b3J5KCBqUXVlcnkgKTtcbiAgfVxufShmdW5jdGlvbiggJCApIHtcbi8qIVxuICogalF1ZXJ5IFVJIENvcmUgMS4xMS4zXG4gKiBodHRwOi8vanF1ZXJ5dWkuY29tXG4gKlxuICogQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnNcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqIGh0dHA6Ly9qcXVlcnkub3JnL2xpY2Vuc2VcbiAqXG4gKiBodHRwOi8vYXBpLmpxdWVyeXVpLmNvbS9jYXRlZ29yeS91aS1jb3JlL1xuICovXG5cblxuLy8gJC51aSBtaWdodCBleGlzdCBmcm9tIGNvbXBvbmVudHMgd2l0aCBubyBkZXBlbmRlbmNpZXMsIGUuZy4sICQudWkucG9zaXRpb25cbiQudWkgPSAkLnVpIHx8IHt9O1xuXG4kLmV4dGVuZCggJC51aSwge1xuICB2ZXJzaW9uOiBcIjEuMTEuM1wiLFxuXG4gIGtleUNvZGU6IHtcbiAgICBCQUNLU1BBQ0U6IDgsXG4gICAgQ09NTUE6IDE4OCxcbiAgICBERUxFVEU6IDQ2LFxuICAgIERPV046IDQwLFxuICAgIEVORDogMzUsXG4gICAgRU5URVI6IDEzLFxuICAgIEVTQ0FQRTogMjcsXG4gICAgSE9NRTogMzYsXG4gICAgTEVGVDogMzcsXG4gICAgUEFHRV9ET1dOOiAzNCxcbiAgICBQQUdFX1VQOiAzMyxcbiAgICBQRVJJT0Q6IDE5MCxcbiAgICBSSUdIVDogMzksXG4gICAgU1BBQ0U6IDMyLFxuICAgIFRBQjogOSxcbiAgICBVUDogMzhcbiAgfVxufSk7XG5cbi8vIHBsdWdpbnNcbiQuZm4uZXh0ZW5kKHtcbiAgc2Nyb2xsUGFyZW50OiBmdW5jdGlvbiggaW5jbHVkZUhpZGRlbiApIHtcbiAgICB2YXIgcG9zaXRpb24gPSB0aGlzLmNzcyggXCJwb3NpdGlvblwiICksXG4gICAgICBleGNsdWRlU3RhdGljUGFyZW50ID0gcG9zaXRpb24gPT09IFwiYWJzb2x1dGVcIixcbiAgICAgIG92ZXJmbG93UmVnZXggPSBpbmNsdWRlSGlkZGVuID8gLyhhdXRvfHNjcm9sbHxoaWRkZW4pLyA6IC8oYXV0b3xzY3JvbGwpLyxcbiAgICAgIHNjcm9sbFBhcmVudCA9IHRoaXMucGFyZW50cygpLmZpbHRlciggZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBwYXJlbnQgPSAkKCB0aGlzICk7XG4gICAgICAgIGlmICggZXhjbHVkZVN0YXRpY1BhcmVudCAmJiBwYXJlbnQuY3NzKCBcInBvc2l0aW9uXCIgKSA9PT0gXCJzdGF0aWNcIiApIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG92ZXJmbG93UmVnZXgudGVzdCggcGFyZW50LmNzcyggXCJvdmVyZmxvd1wiICkgKyBwYXJlbnQuY3NzKCBcIm92ZXJmbG93LXlcIiApICsgcGFyZW50LmNzcyggXCJvdmVyZmxvdy14XCIgKSApO1xuICAgICAgfSkuZXEoIDAgKTtcblxuICAgIHJldHVybiBwb3NpdGlvbiA9PT0gXCJmaXhlZFwiIHx8ICFzY3JvbGxQYXJlbnQubGVuZ3RoID8gJCggdGhpc1sgMCBdLm93bmVyRG9jdW1lbnQgfHwgZG9jdW1lbnQgKSA6IHNjcm9sbFBhcmVudDtcbiAgfSxcblxuICB1bmlxdWVJZDogKGZ1bmN0aW9uKCkge1xuICAgIHZhciB1dWlkID0gMDtcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICggIXRoaXMuaWQgKSB7XG4gICAgICAgICAgdGhpcy5pZCA9IFwidWktaWQtXCIgKyAoICsrdXVpZCApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICB9KSgpLFxuXG4gIHJlbW92ZVVuaXF1ZUlkOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCAvXnVpLWlkLVxcZCskLy50ZXN0KCB0aGlzLmlkICkgKSB7XG4gICAgICAgICQoIHRoaXMgKS5yZW1vdmVBdHRyKCBcImlkXCIgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG5cbi8vIHNlbGVjdG9yc1xuZnVuY3Rpb24gZm9jdXNhYmxlKCBlbGVtZW50LCBpc1RhYkluZGV4Tm90TmFOICkge1xuICB2YXIgbWFwLCBtYXBOYW1lLCBpbWcsXG4gICAgbm9kZU5hbWUgPSBlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIGlmICggXCJhcmVhXCIgPT09IG5vZGVOYW1lICkge1xuICAgIG1hcCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcbiAgICBtYXBOYW1lID0gbWFwLm5hbWU7XG4gICAgaWYgKCAhZWxlbWVudC5ocmVmIHx8ICFtYXBOYW1lIHx8IG1hcC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICE9PSBcIm1hcFwiICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpbWcgPSAkKCBcImltZ1t1c2VtYXA9JyNcIiArIG1hcE5hbWUgKyBcIiddXCIgKVsgMCBdO1xuICAgIHJldHVybiAhIWltZyAmJiB2aXNpYmxlKCBpbWcgKTtcbiAgfVxuICByZXR1cm4gKCAvXihpbnB1dHxzZWxlY3R8dGV4dGFyZWF8YnV0dG9ufG9iamVjdCkkLy50ZXN0KCBub2RlTmFtZSApID9cbiAgICAhZWxlbWVudC5kaXNhYmxlZCA6XG4gICAgXCJhXCIgPT09IG5vZGVOYW1lID9cbiAgICAgIGVsZW1lbnQuaHJlZiB8fCBpc1RhYkluZGV4Tm90TmFOIDpcbiAgICAgIGlzVGFiSW5kZXhOb3ROYU4pICYmXG4gICAgLy8gdGhlIGVsZW1lbnQgYW5kIGFsbCBvZiBpdHMgYW5jZXN0b3JzIG11c3QgYmUgdmlzaWJsZVxuICAgIHZpc2libGUoIGVsZW1lbnQgKTtcbn1cblxuZnVuY3Rpb24gdmlzaWJsZSggZWxlbWVudCApIHtcbiAgcmV0dXJuICQuZXhwci5maWx0ZXJzLnZpc2libGUoIGVsZW1lbnQgKSAmJlxuICAgICEkKCBlbGVtZW50ICkucGFyZW50cygpLmFkZEJhY2soKS5maWx0ZXIoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJC5jc3MoIHRoaXMsIFwidmlzaWJpbGl0eVwiICkgPT09IFwiaGlkZGVuXCI7XG4gICAgfSkubGVuZ3RoO1xufVxuXG4kLmV4dGVuZCggJC5leHByWyBcIjpcIiBdLCB7XG4gIGRhdGE6ICQuZXhwci5jcmVhdGVQc2V1ZG8gP1xuICAgICQuZXhwci5jcmVhdGVQc2V1ZG8oZnVuY3Rpb24oIGRhdGFOYW1lICkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBlbGVtICkge1xuICAgICAgICByZXR1cm4gISEkLmRhdGEoIGVsZW0sIGRhdGFOYW1lICk7XG4gICAgICB9O1xuICAgIH0pIDpcbiAgICAvLyBzdXBwb3J0OiBqUXVlcnkgPDEuOFxuICAgIGZ1bmN0aW9uKCBlbGVtLCBpLCBtYXRjaCApIHtcbiAgICAgIHJldHVybiAhISQuZGF0YSggZWxlbSwgbWF0Y2hbIDMgXSApO1xuICAgIH0sXG5cbiAgZm9jdXNhYmxlOiBmdW5jdGlvbiggZWxlbWVudCApIHtcbiAgICByZXR1cm4gZm9jdXNhYmxlKCBlbGVtZW50LCAhaXNOYU4oICQuYXR0ciggZWxlbWVudCwgXCJ0YWJpbmRleFwiICkgKSApO1xuICB9LFxuXG4gIHRhYmJhYmxlOiBmdW5jdGlvbiggZWxlbWVudCApIHtcbiAgICB2YXIgdGFiSW5kZXggPSAkLmF0dHIoIGVsZW1lbnQsIFwidGFiaW5kZXhcIiApLFxuICAgICAgaXNUYWJJbmRleE5hTiA9IGlzTmFOKCB0YWJJbmRleCApO1xuICAgIHJldHVybiAoIGlzVGFiSW5kZXhOYU4gfHwgdGFiSW5kZXggPj0gMCApICYmIGZvY3VzYWJsZSggZWxlbWVudCwgIWlzVGFiSW5kZXhOYU4gKTtcbiAgfVxufSk7XG5cbi8vIHN1cHBvcnQ6IGpRdWVyeSA8MS44XG5pZiAoICEkKCBcIjxhPlwiICkub3V0ZXJXaWR0aCggMSApLmpxdWVyeSApIHtcbiAgJC5lYWNoKCBbIFwiV2lkdGhcIiwgXCJIZWlnaHRcIiBdLCBmdW5jdGlvbiggaSwgbmFtZSApIHtcbiAgICB2YXIgc2lkZSA9IG5hbWUgPT09IFwiV2lkdGhcIiA/IFsgXCJMZWZ0XCIsIFwiUmlnaHRcIiBdIDogWyBcIlRvcFwiLCBcIkJvdHRvbVwiIF0sXG4gICAgICB0eXBlID0gbmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgb3JpZyA9IHtcbiAgICAgICAgaW5uZXJXaWR0aDogJC5mbi5pbm5lcldpZHRoLFxuICAgICAgICBpbm5lckhlaWdodDogJC5mbi5pbm5lckhlaWdodCxcbiAgICAgICAgb3V0ZXJXaWR0aDogJC5mbi5vdXRlcldpZHRoLFxuICAgICAgICBvdXRlckhlaWdodDogJC5mbi5vdXRlckhlaWdodFxuICAgICAgfTtcblxuICAgIGZ1bmN0aW9uIHJlZHVjZSggZWxlbSwgc2l6ZSwgYm9yZGVyLCBtYXJnaW4gKSB7XG4gICAgICAkLmVhY2goIHNpZGUsIGZ1bmN0aW9uKCkge1xuICAgICAgICBzaXplIC09IHBhcnNlRmxvYXQoICQuY3NzKCBlbGVtLCBcInBhZGRpbmdcIiArIHRoaXMgKSApIHx8IDA7XG4gICAgICAgIGlmICggYm9yZGVyICkge1xuICAgICAgICAgIHNpemUgLT0gcGFyc2VGbG9hdCggJC5jc3MoIGVsZW0sIFwiYm9yZGVyXCIgKyB0aGlzICsgXCJXaWR0aFwiICkgKSB8fCAwO1xuICAgICAgICB9XG4gICAgICAgIGlmICggbWFyZ2luICkge1xuICAgICAgICAgIHNpemUgLT0gcGFyc2VGbG9hdCggJC5jc3MoIGVsZW0sIFwibWFyZ2luXCIgKyB0aGlzICkgKSB8fCAwO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBzaXplO1xuICAgIH1cblxuICAgICQuZm5bIFwiaW5uZXJcIiArIG5hbWUgXSA9IGZ1bmN0aW9uKCBzaXplICkge1xuICAgICAgaWYgKCBzaXplID09PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIHJldHVybiBvcmlnWyBcImlubmVyXCIgKyBuYW1lIF0uY2FsbCggdGhpcyApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCB0aGlzICkuY3NzKCB0eXBlLCByZWR1Y2UoIHRoaXMsIHNpemUgKSArIFwicHhcIiApO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgICQuZm5bIFwib3V0ZXJcIiArIG5hbWVdID0gZnVuY3Rpb24oIHNpemUsIG1hcmdpbiApIHtcbiAgICAgIGlmICggdHlwZW9mIHNpemUgIT09IFwibnVtYmVyXCIgKSB7XG4gICAgICAgIHJldHVybiBvcmlnWyBcIm91dGVyXCIgKyBuYW1lIF0uY2FsbCggdGhpcywgc2l6ZSApO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCB0aGlzKS5jc3MoIHR5cGUsIHJlZHVjZSggdGhpcywgc2l6ZSwgdHJ1ZSwgbWFyZ2luICkgKyBcInB4XCIgKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pO1xufVxuXG4vLyBzdXBwb3J0OiBqUXVlcnkgPDEuOFxuaWYgKCAhJC5mbi5hZGRCYWNrICkge1xuICAkLmZuLmFkZEJhY2sgPSBmdW5jdGlvbiggc2VsZWN0b3IgKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRkKCBzZWxlY3RvciA9PSBudWxsID9cbiAgICAgIHRoaXMucHJldk9iamVjdCA6IHRoaXMucHJldk9iamVjdC5maWx0ZXIoIHNlbGVjdG9yIClcbiAgICApO1xuICB9O1xufVxuXG4vLyBzdXBwb3J0OiBqUXVlcnkgMS42LjEsIDEuNi4yIChodHRwOi8vYnVncy5qcXVlcnkuY29tL3RpY2tldC85NDEzKVxuaWYgKCAkKCBcIjxhPlwiICkuZGF0YSggXCJhLWJcIiwgXCJhXCIgKS5yZW1vdmVEYXRhKCBcImEtYlwiICkuZGF0YSggXCJhLWJcIiApICkge1xuICAkLmZuLnJlbW92ZURhdGEgPSAoZnVuY3Rpb24oIHJlbW92ZURhdGEgKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCBrZXkgKSB7XG4gICAgICBpZiAoIGFyZ3VtZW50cy5sZW5ndGggKSB7XG4gICAgICAgIHJldHVybiByZW1vdmVEYXRhLmNhbGwoIHRoaXMsICQuY2FtZWxDYXNlKCBrZXkgKSApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHJlbW92ZURhdGEuY2FsbCggdGhpcyApO1xuICAgICAgfVxuICAgIH07XG4gIH0pKCAkLmZuLnJlbW92ZURhdGEgKTtcbn1cblxuLy8gZGVwcmVjYXRlZFxuJC51aS5pZSA9ICEhL21zaWUgW1xcdy5dKy8uZXhlYyggbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpICk7XG5cbiQuZm4uZXh0ZW5kKHtcbiAgZm9jdXM6IChmdW5jdGlvbiggb3JpZyApIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oIGRlbGF5LCBmbiApIHtcbiAgICAgIHJldHVybiB0eXBlb2YgZGVsYXkgPT09IFwibnVtYmVyXCIgP1xuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGVsZW0gPSB0aGlzO1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCBlbGVtICkuZm9jdXMoKTtcbiAgICAgICAgICAgIGlmICggZm4gKSB7XG4gICAgICAgICAgICAgIGZuLmNhbGwoIGVsZW0gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCBkZWxheSApO1xuICAgICAgICB9KSA6XG4gICAgICAgIG9yaWcuYXBwbHkoIHRoaXMsIGFyZ3VtZW50cyApO1xuICAgIH07XG4gIH0pKCAkLmZuLmZvY3VzICksXG5cbiAgZGlzYWJsZVNlbGVjdGlvbjogKGZ1bmN0aW9uKCkge1xuICAgIHZhciBldmVudFR5cGUgPSBcIm9uc2VsZWN0c3RhcnRcIiBpbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICkgP1xuICAgICAgXCJzZWxlY3RzdGFydFwiIDpcbiAgICAgIFwibW91c2Vkb3duXCI7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5iaW5kKCBldmVudFR5cGUgKyBcIi51aS1kaXNhYmxlU2VsZWN0aW9uXCIsIGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pKCksXG5cbiAgZW5hYmxlU2VsZWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy51bmJpbmQoIFwiLnVpLWRpc2FibGVTZWxlY3Rpb25cIiApO1xuICB9LFxuXG4gIHpJbmRleDogZnVuY3Rpb24oIHpJbmRleCApIHtcbiAgICBpZiAoIHpJbmRleCAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgcmV0dXJuIHRoaXMuY3NzKCBcInpJbmRleFwiLCB6SW5kZXggKTtcbiAgICB9XG5cbiAgICBpZiAoIHRoaXMubGVuZ3RoICkge1xuICAgICAgdmFyIGVsZW0gPSAkKCB0aGlzWyAwIF0gKSwgcG9zaXRpb24sIHZhbHVlO1xuICAgICAgd2hpbGUgKCBlbGVtLmxlbmd0aCAmJiBlbGVtWyAwIF0gIT09IGRvY3VtZW50ICkge1xuICAgICAgICAvLyBJZ25vcmUgei1pbmRleCBpZiBwb3NpdGlvbiBpcyBzZXQgdG8gYSB2YWx1ZSB3aGVyZSB6LWluZGV4IGlzIGlnbm9yZWQgYnkgdGhlIGJyb3dzZXJcbiAgICAgICAgLy8gVGhpcyBtYWtlcyBiZWhhdmlvciBvZiB0aGlzIGZ1bmN0aW9uIGNvbnNpc3RlbnQgYWNyb3NzIGJyb3dzZXJzXG4gICAgICAgIC8vIFdlYktpdCBhbHdheXMgcmV0dXJucyBhdXRvIGlmIHRoZSBlbGVtZW50IGlzIHBvc2l0aW9uZWRcbiAgICAgICAgcG9zaXRpb24gPSBlbGVtLmNzcyggXCJwb3NpdGlvblwiICk7XG4gICAgICAgIGlmICggcG9zaXRpb24gPT09IFwiYWJzb2x1dGVcIiB8fCBwb3NpdGlvbiA9PT0gXCJyZWxhdGl2ZVwiIHx8IHBvc2l0aW9uID09PSBcImZpeGVkXCIgKSB7XG4gICAgICAgICAgLy8gSUUgcmV0dXJucyAwIHdoZW4gekluZGV4IGlzIG5vdCBzcGVjaWZpZWRcbiAgICAgICAgICAvLyBvdGhlciBicm93c2VycyByZXR1cm4gYSBzdHJpbmdcbiAgICAgICAgICAvLyB3ZSBpZ25vcmUgdGhlIGNhc2Ugb2YgbmVzdGVkIGVsZW1lbnRzIHdpdGggYW4gZXhwbGljaXQgdmFsdWUgb2YgMFxuICAgICAgICAgIC8vIDxkaXYgc3R5bGU9XCJ6LWluZGV4OiAtMTA7XCI+PGRpdiBzdHlsZT1cInotaW5kZXg6IDA7XCI+PC9kaXY+PC9kaXY+XG4gICAgICAgICAgdmFsdWUgPSBwYXJzZUludCggZWxlbS5jc3MoIFwiekluZGV4XCIgKSwgMTAgKTtcbiAgICAgICAgICBpZiAoICFpc05hTiggdmFsdWUgKSAmJiB2YWx1ZSAhPT0gMCApIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxlbSA9IGVsZW0ucGFyZW50KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cbn0pO1xuXG4vLyAkLnVpLnBsdWdpbiBpcyBkZXByZWNhdGVkLiBVc2UgJC53aWRnZXQoKSBleHRlbnNpb25zIGluc3RlYWQuXG4kLnVpLnBsdWdpbiA9IHtcbiAgYWRkOiBmdW5jdGlvbiggbW9kdWxlLCBvcHRpb24sIHNldCApIHtcbiAgICB2YXIgaSxcbiAgICAgIHByb3RvID0gJC51aVsgbW9kdWxlIF0ucHJvdG90eXBlO1xuICAgIGZvciAoIGkgaW4gc2V0ICkge1xuICAgICAgcHJvdG8ucGx1Z2luc1sgaSBdID0gcHJvdG8ucGx1Z2luc1sgaSBdIHx8IFtdO1xuICAgICAgcHJvdG8ucGx1Z2luc1sgaSBdLnB1c2goIFsgb3B0aW9uLCBzZXRbIGkgXSBdICk7XG4gICAgfVxuICB9LFxuICBjYWxsOiBmdW5jdGlvbiggaW5zdGFuY2UsIG5hbWUsIGFyZ3MsIGFsbG93RGlzY29ubmVjdGVkICkge1xuICAgIHZhciBpLFxuICAgICAgc2V0ID0gaW5zdGFuY2UucGx1Z2luc1sgbmFtZSBdO1xuXG4gICAgaWYgKCAhc2V0ICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICggIWFsbG93RGlzY29ubmVjdGVkICYmICggIWluc3RhbmNlLmVsZW1lbnRbIDAgXS5wYXJlbnROb2RlIHx8IGluc3RhbmNlLmVsZW1lbnRbIDAgXS5wYXJlbnROb2RlLm5vZGVUeXBlID09PSAxMSApICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAoIGkgPSAwOyBpIDwgc2V0Lmxlbmd0aDsgaSsrICkge1xuICAgICAgaWYgKCBpbnN0YW5jZS5vcHRpb25zWyBzZXRbIGkgXVsgMCBdIF0gKSB7XG4gICAgICAgIHNldFsgaSBdWyAxIF0uYXBwbHkoIGluc3RhbmNlLmVsZW1lbnQsIGFyZ3MgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cblxuLyohXG4gKiBqUXVlcnkgVUkgV2lkZ2V0IDEuMTEuM1xuICogaHR0cDovL2pxdWVyeXVpLmNvbVxuICpcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiBodHRwOi8vanF1ZXJ5Lm9yZy9saWNlbnNlXG4gKlxuICogaHR0cDovL2FwaS5qcXVlcnl1aS5jb20valF1ZXJ5LndpZGdldC9cbiAqL1xuXG5cbnZhciB3aWRnZXRfdXVpZCA9IDAsXG4gIHdpZGdldF9zbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxuJC5jbGVhbkRhdGEgPSAoZnVuY3Rpb24oIG9yaWcgKSB7XG4gIHJldHVybiBmdW5jdGlvbiggZWxlbXMgKSB7XG4gICAgdmFyIGV2ZW50cywgZWxlbSwgaTtcbiAgICBmb3IgKCBpID0gMDsgKGVsZW0gPSBlbGVtc1tpXSkgIT0gbnVsbDsgaSsrICkge1xuICAgICAgdHJ5IHtcblxuICAgICAgICAvLyBPbmx5IHRyaWdnZXIgcmVtb3ZlIHdoZW4gbmVjZXNzYXJ5IHRvIHNhdmUgdGltZVxuICAgICAgICBldmVudHMgPSAkLl9kYXRhKCBlbGVtLCBcImV2ZW50c1wiICk7XG4gICAgICAgIGlmICggZXZlbnRzICYmIGV2ZW50cy5yZW1vdmUgKSB7XG4gICAgICAgICAgJCggZWxlbSApLnRyaWdnZXJIYW5kbGVyKCBcInJlbW92ZVwiICk7XG4gICAgICAgIH1cblxuICAgICAgLy8gaHR0cDovL2J1Z3MuanF1ZXJ5LmNvbS90aWNrZXQvODIzNVxuICAgICAgfSBjYXRjaCAoIGUgKSB7fVxuICAgIH1cbiAgICBvcmlnKCBlbGVtcyApO1xuICB9O1xufSkoICQuY2xlYW5EYXRhICk7XG5cbiQud2lkZ2V0ID0gZnVuY3Rpb24oIG5hbWUsIGJhc2UsIHByb3RvdHlwZSApIHtcbiAgdmFyIGZ1bGxOYW1lLCBleGlzdGluZ0NvbnN0cnVjdG9yLCBjb25zdHJ1Y3RvciwgYmFzZVByb3RvdHlwZSxcbiAgICAvLyBwcm94aWVkUHJvdG90eXBlIGFsbG93cyB0aGUgcHJvdmlkZWQgcHJvdG90eXBlIHRvIHJlbWFpbiB1bm1vZGlmaWVkXG4gICAgLy8gc28gdGhhdCBpdCBjYW4gYmUgdXNlZCBhcyBhIG1peGluIGZvciBtdWx0aXBsZSB3aWRnZXRzICgjODg3NilcbiAgICBwcm94aWVkUHJvdG90eXBlID0ge30sXG4gICAgbmFtZXNwYWNlID0gbmFtZS5zcGxpdCggXCIuXCIgKVsgMCBdO1xuXG4gIG5hbWUgPSBuYW1lLnNwbGl0KCBcIi5cIiApWyAxIF07XG4gIGZ1bGxOYW1lID0gbmFtZXNwYWNlICsgXCItXCIgKyBuYW1lO1xuXG4gIGlmICggIXByb3RvdHlwZSApIHtcbiAgICBwcm90b3R5cGUgPSBiYXNlO1xuICAgIGJhc2UgPSAkLldpZGdldDtcbiAgfVxuXG4gIC8vIGNyZWF0ZSBzZWxlY3RvciBmb3IgcGx1Z2luXG4gICQuZXhwclsgXCI6XCIgXVsgZnVsbE5hbWUudG9Mb3dlckNhc2UoKSBdID0gZnVuY3Rpb24oIGVsZW0gKSB7XG4gICAgcmV0dXJuICEhJC5kYXRhKCBlbGVtLCBmdWxsTmFtZSApO1xuICB9O1xuXG4gICRbIG5hbWVzcGFjZSBdID0gJFsgbmFtZXNwYWNlIF0gfHwge307XG4gIGV4aXN0aW5nQ29uc3RydWN0b3IgPSAkWyBuYW1lc3BhY2UgXVsgbmFtZSBdO1xuICBjb25zdHJ1Y3RvciA9ICRbIG5hbWVzcGFjZSBdWyBuYW1lIF0gPSBmdW5jdGlvbiggb3B0aW9ucywgZWxlbWVudCApIHtcbiAgICAvLyBhbGxvdyBpbnN0YW50aWF0aW9uIHdpdGhvdXQgXCJuZXdcIiBrZXl3b3JkXG4gICAgaWYgKCAhdGhpcy5fY3JlYXRlV2lkZ2V0ICkge1xuICAgICAgcmV0dXJuIG5ldyBjb25zdHJ1Y3Rvciggb3B0aW9ucywgZWxlbWVudCApO1xuICAgIH1cblxuICAgIC8vIGFsbG93IGluc3RhbnRpYXRpb24gd2l0aG91dCBpbml0aWFsaXppbmcgZm9yIHNpbXBsZSBpbmhlcml0YW5jZVxuICAgIC8vIG11c3QgdXNlIFwibmV3XCIga2V5d29yZCAodGhlIGNvZGUgYWJvdmUgYWx3YXlzIHBhc3NlcyBhcmdzKVxuICAgIGlmICggYXJndW1lbnRzLmxlbmd0aCApIHtcbiAgICAgIHRoaXMuX2NyZWF0ZVdpZGdldCggb3B0aW9ucywgZWxlbWVudCApO1xuICAgIH1cbiAgfTtcbiAgLy8gZXh0ZW5kIHdpdGggdGhlIGV4aXN0aW5nIGNvbnN0cnVjdG9yIHRvIGNhcnJ5IG92ZXIgYW55IHN0YXRpYyBwcm9wZXJ0aWVzXG4gICQuZXh0ZW5kKCBjb25zdHJ1Y3RvciwgZXhpc3RpbmdDb25zdHJ1Y3Rvciwge1xuICAgIHZlcnNpb246IHByb3RvdHlwZS52ZXJzaW9uLFxuICAgIC8vIGNvcHkgdGhlIG9iamVjdCB1c2VkIHRvIGNyZWF0ZSB0aGUgcHJvdG90eXBlIGluIGNhc2Ugd2UgbmVlZCB0b1xuICAgIC8vIHJlZGVmaW5lIHRoZSB3aWRnZXQgbGF0ZXJcbiAgICBfcHJvdG86ICQuZXh0ZW5kKCB7fSwgcHJvdG90eXBlICksXG4gICAgLy8gdHJhY2sgd2lkZ2V0cyB0aGF0IGluaGVyaXQgZnJvbSB0aGlzIHdpZGdldCBpbiBjYXNlIHRoaXMgd2lkZ2V0IGlzXG4gICAgLy8gcmVkZWZpbmVkIGFmdGVyIGEgd2lkZ2V0IGluaGVyaXRzIGZyb20gaXRcbiAgICBfY2hpbGRDb25zdHJ1Y3RvcnM6IFtdXG4gIH0pO1xuXG4gIGJhc2VQcm90b3R5cGUgPSBuZXcgYmFzZSgpO1xuICAvLyB3ZSBuZWVkIHRvIG1ha2UgdGhlIG9wdGlvbnMgaGFzaCBhIHByb3BlcnR5IGRpcmVjdGx5IG9uIHRoZSBuZXcgaW5zdGFuY2VcbiAgLy8gb3RoZXJ3aXNlIHdlJ2xsIG1vZGlmeSB0aGUgb3B0aW9ucyBoYXNoIG9uIHRoZSBwcm90b3R5cGUgdGhhdCB3ZSdyZVxuICAvLyBpbmhlcml0aW5nIGZyb21cbiAgYmFzZVByb3RvdHlwZS5vcHRpb25zID0gJC53aWRnZXQuZXh0ZW5kKCB7fSwgYmFzZVByb3RvdHlwZS5vcHRpb25zICk7XG4gICQuZWFjaCggcHJvdG90eXBlLCBmdW5jdGlvbiggcHJvcCwgdmFsdWUgKSB7XG4gICAgaWYgKCAhJC5pc0Z1bmN0aW9uKCB2YWx1ZSApICkge1xuICAgICAgcHJveGllZFByb3RvdHlwZVsgcHJvcCBdID0gdmFsdWU7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHByb3hpZWRQcm90b3R5cGVbIHByb3AgXSA9IChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBfc3VwZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gYmFzZS5wcm90b3R5cGVbIHByb3AgXS5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG4gICAgICAgIH0sXG4gICAgICAgIF9zdXBlckFwcGx5ID0gZnVuY3Rpb24oIGFyZ3MgKSB7XG4gICAgICAgICAgcmV0dXJuIGJhc2UucHJvdG90eXBlWyBwcm9wIF0uYXBwbHkoIHRoaXMsIGFyZ3MgKTtcbiAgICAgICAgfTtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIF9fc3VwZXIgPSB0aGlzLl9zdXBlcixcbiAgICAgICAgICBfX3N1cGVyQXBwbHkgPSB0aGlzLl9zdXBlckFwcGx5LFxuICAgICAgICAgIHJldHVyblZhbHVlO1xuXG4gICAgICAgIHRoaXMuX3N1cGVyID0gX3N1cGVyO1xuICAgICAgICB0aGlzLl9zdXBlckFwcGx5ID0gX3N1cGVyQXBwbHk7XG5cbiAgICAgICAgcmV0dXJuVmFsdWUgPSB2YWx1ZS5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG5cbiAgICAgICAgdGhpcy5fc3VwZXIgPSBfX3N1cGVyO1xuICAgICAgICB0aGlzLl9zdXBlckFwcGx5ID0gX19zdXBlckFwcGx5O1xuXG4gICAgICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgICAgIH07XG4gICAgfSkoKTtcbiAgfSk7XG4gIGNvbnN0cnVjdG9yLnByb3RvdHlwZSA9ICQud2lkZ2V0LmV4dGVuZCggYmFzZVByb3RvdHlwZSwge1xuICAgIC8vIFRPRE86IHJlbW92ZSBzdXBwb3J0IGZvciB3aWRnZXRFdmVudFByZWZpeFxuICAgIC8vIGFsd2F5cyB1c2UgdGhlIG5hbWUgKyBhIGNvbG9uIGFzIHRoZSBwcmVmaXgsIGUuZy4sIGRyYWdnYWJsZTpzdGFydFxuICAgIC8vIGRvbid0IHByZWZpeCBmb3Igd2lkZ2V0cyB0aGF0IGFyZW4ndCBET00tYmFzZWRcbiAgICB3aWRnZXRFdmVudFByZWZpeDogZXhpc3RpbmdDb25zdHJ1Y3RvciA/IChiYXNlUHJvdG90eXBlLndpZGdldEV2ZW50UHJlZml4IHx8IG5hbWUpIDogbmFtZVxuICB9LCBwcm94aWVkUHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IGNvbnN0cnVjdG9yLFxuICAgIG5hbWVzcGFjZTogbmFtZXNwYWNlLFxuICAgIHdpZGdldE5hbWU6IG5hbWUsXG4gICAgd2lkZ2V0RnVsbE5hbWU6IGZ1bGxOYW1lXG4gIH0pO1xuXG4gIC8vIElmIHRoaXMgd2lkZ2V0IGlzIGJlaW5nIHJlZGVmaW5lZCB0aGVuIHdlIG5lZWQgdG8gZmluZCBhbGwgd2lkZ2V0cyB0aGF0XG4gIC8vIGFyZSBpbmhlcml0aW5nIGZyb20gaXQgYW5kIHJlZGVmaW5lIGFsbCBvZiB0aGVtIHNvIHRoYXQgdGhleSBpbmhlcml0IGZyb21cbiAgLy8gdGhlIG5ldyB2ZXJzaW9uIG9mIHRoaXMgd2lkZ2V0LiBXZSdyZSBlc3NlbnRpYWxseSB0cnlpbmcgdG8gcmVwbGFjZSBvbmVcbiAgLy8gbGV2ZWwgaW4gdGhlIHByb3RvdHlwZSBjaGFpbi5cbiAgaWYgKCBleGlzdGluZ0NvbnN0cnVjdG9yICkge1xuICAgICQuZWFjaCggZXhpc3RpbmdDb25zdHJ1Y3Rvci5fY2hpbGRDb25zdHJ1Y3RvcnMsIGZ1bmN0aW9uKCBpLCBjaGlsZCApIHtcbiAgICAgIHZhciBjaGlsZFByb3RvdHlwZSA9IGNoaWxkLnByb3RvdHlwZTtcblxuICAgICAgLy8gcmVkZWZpbmUgdGhlIGNoaWxkIHdpZGdldCB1c2luZyB0aGUgc2FtZSBwcm90b3R5cGUgdGhhdCB3YXNcbiAgICAgIC8vIG9yaWdpbmFsbHkgdXNlZCwgYnV0IGluaGVyaXQgZnJvbSB0aGUgbmV3IHZlcnNpb24gb2YgdGhlIGJhc2VcbiAgICAgICQud2lkZ2V0KCBjaGlsZFByb3RvdHlwZS5uYW1lc3BhY2UgKyBcIi5cIiArIGNoaWxkUHJvdG90eXBlLndpZGdldE5hbWUsIGNvbnN0cnVjdG9yLCBjaGlsZC5fcHJvdG8gKTtcbiAgICB9KTtcbiAgICAvLyByZW1vdmUgdGhlIGxpc3Qgb2YgZXhpc3RpbmcgY2hpbGQgY29uc3RydWN0b3JzIGZyb20gdGhlIG9sZCBjb25zdHJ1Y3RvclxuICAgIC8vIHNvIHRoZSBvbGQgY2hpbGQgY29uc3RydWN0b3JzIGNhbiBiZSBnYXJiYWdlIGNvbGxlY3RlZFxuICAgIGRlbGV0ZSBleGlzdGluZ0NvbnN0cnVjdG9yLl9jaGlsZENvbnN0cnVjdG9ycztcbiAgfSBlbHNlIHtcbiAgICBiYXNlLl9jaGlsZENvbnN0cnVjdG9ycy5wdXNoKCBjb25zdHJ1Y3RvciApO1xuICB9XG5cbiAgJC53aWRnZXQuYnJpZGdlKCBuYW1lLCBjb25zdHJ1Y3RvciApO1xuXG4gIHJldHVybiBjb25zdHJ1Y3Rvcjtcbn07XG5cbiQud2lkZ2V0LmV4dGVuZCA9IGZ1bmN0aW9uKCB0YXJnZXQgKSB7XG4gIHZhciBpbnB1dCA9IHdpZGdldF9zbGljZS5jYWxsKCBhcmd1bWVudHMsIDEgKSxcbiAgICBpbnB1dEluZGV4ID0gMCxcbiAgICBpbnB1dExlbmd0aCA9IGlucHV0Lmxlbmd0aCxcbiAgICBrZXksXG4gICAgdmFsdWU7XG4gIGZvciAoIDsgaW5wdXRJbmRleCA8IGlucHV0TGVuZ3RoOyBpbnB1dEluZGV4KysgKSB7XG4gICAgZm9yICgga2V5IGluIGlucHV0WyBpbnB1dEluZGV4IF0gKSB7XG4gICAgICB2YWx1ZSA9IGlucHV0WyBpbnB1dEluZGV4IF1bIGtleSBdO1xuICAgICAgaWYgKCBpbnB1dFsgaW5wdXRJbmRleCBdLmhhc093blByb3BlcnR5KCBrZXkgKSAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAvLyBDbG9uZSBvYmplY3RzXG4gICAgICAgIGlmICggJC5pc1BsYWluT2JqZWN0KCB2YWx1ZSApICkge1xuICAgICAgICAgIHRhcmdldFsga2V5IF0gPSAkLmlzUGxhaW5PYmplY3QoIHRhcmdldFsga2V5IF0gKSA/XG4gICAgICAgICAgICAkLndpZGdldC5leHRlbmQoIHt9LCB0YXJnZXRbIGtleSBdLCB2YWx1ZSApIDpcbiAgICAgICAgICAgIC8vIERvbid0IGV4dGVuZCBzdHJpbmdzLCBhcnJheXMsIGV0Yy4gd2l0aCBvYmplY3RzXG4gICAgICAgICAgICAkLndpZGdldC5leHRlbmQoIHt9LCB2YWx1ZSApO1xuICAgICAgICAvLyBDb3B5IGV2ZXJ5dGhpbmcgZWxzZSBieSByZWZlcmVuY2VcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0YXJnZXRbIGtleSBdID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhcmdldDtcbn07XG5cbiQud2lkZ2V0LmJyaWRnZSA9IGZ1bmN0aW9uKCBuYW1lLCBvYmplY3QgKSB7XG4gIHZhciBmdWxsTmFtZSA9IG9iamVjdC5wcm90b3R5cGUud2lkZ2V0RnVsbE5hbWUgfHwgbmFtZTtcbiAgJC5mblsgbmFtZSBdID0gZnVuY3Rpb24oIG9wdGlvbnMgKSB7XG4gICAgdmFyIGlzTWV0aG9kQ2FsbCA9IHR5cGVvZiBvcHRpb25zID09PSBcInN0cmluZ1wiLFxuICAgICAgYXJncyA9IHdpZGdldF9zbGljZS5jYWxsKCBhcmd1bWVudHMsIDEgKSxcbiAgICAgIHJldHVyblZhbHVlID0gdGhpcztcblxuICAgIGlmICggaXNNZXRob2RDYWxsICkge1xuICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbWV0aG9kVmFsdWUsXG4gICAgICAgICAgaW5zdGFuY2UgPSAkLmRhdGEoIHRoaXMsIGZ1bGxOYW1lICk7XG4gICAgICAgIGlmICggb3B0aW9ucyA9PT0gXCJpbnN0YW5jZVwiICkge1xuICAgICAgICAgIHJldHVyblZhbHVlID0gaW5zdGFuY2U7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICggIWluc3RhbmNlICkge1xuICAgICAgICAgIHJldHVybiAkLmVycm9yKCBcImNhbm5vdCBjYWxsIG1ldGhvZHMgb24gXCIgKyBuYW1lICsgXCIgcHJpb3IgdG8gaW5pdGlhbGl6YXRpb247IFwiICtcbiAgICAgICAgICAgIFwiYXR0ZW1wdGVkIHRvIGNhbGwgbWV0aG9kICdcIiArIG9wdGlvbnMgKyBcIidcIiApO1xuICAgICAgICB9XG4gICAgICAgIGlmICggISQuaXNGdW5jdGlvbiggaW5zdGFuY2Vbb3B0aW9uc10gKSB8fCBvcHRpb25zLmNoYXJBdCggMCApID09PSBcIl9cIiApIHtcbiAgICAgICAgICByZXR1cm4gJC5lcnJvciggXCJubyBzdWNoIG1ldGhvZCAnXCIgKyBvcHRpb25zICsgXCInIGZvciBcIiArIG5hbWUgKyBcIiB3aWRnZXQgaW5zdGFuY2VcIiApO1xuICAgICAgICB9XG4gICAgICAgIG1ldGhvZFZhbHVlID0gaW5zdGFuY2VbIG9wdGlvbnMgXS5hcHBseSggaW5zdGFuY2UsIGFyZ3MgKTtcbiAgICAgICAgaWYgKCBtZXRob2RWYWx1ZSAhPT0gaW5zdGFuY2UgJiYgbWV0aG9kVmFsdWUgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICByZXR1cm5WYWx1ZSA9IG1ldGhvZFZhbHVlICYmIG1ldGhvZFZhbHVlLmpxdWVyeSA/XG4gICAgICAgICAgICByZXR1cm5WYWx1ZS5wdXNoU3RhY2soIG1ldGhvZFZhbHVlLmdldCgpICkgOlxuICAgICAgICAgICAgbWV0aG9kVmFsdWU7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuXG4gICAgICAvLyBBbGxvdyBtdWx0aXBsZSBoYXNoZXMgdG8gYmUgcGFzc2VkIG9uIGluaXRcbiAgICAgIGlmICggYXJncy5sZW5ndGggKSB7XG4gICAgICAgIG9wdGlvbnMgPSAkLndpZGdldC5leHRlbmQuYXBwbHkoIG51bGwsIFsgb3B0aW9ucyBdLmNvbmNhdChhcmdzKSApO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBpbnN0YW5jZSA9ICQuZGF0YSggdGhpcywgZnVsbE5hbWUgKTtcbiAgICAgICAgaWYgKCBpbnN0YW5jZSApIHtcbiAgICAgICAgICBpbnN0YW5jZS5vcHRpb24oIG9wdGlvbnMgfHwge30gKTtcbiAgICAgICAgICBpZiAoIGluc3RhbmNlLl9pbml0ICkge1xuICAgICAgICAgICAgaW5zdGFuY2UuX2luaXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJC5kYXRhKCB0aGlzLCBmdWxsTmFtZSwgbmV3IG9iamVjdCggb3B0aW9ucywgdGhpcyApICk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfTtcbn07XG5cbiQuV2lkZ2V0ID0gZnVuY3Rpb24oIC8qIG9wdGlvbnMsIGVsZW1lbnQgKi8gKSB7fTtcbiQuV2lkZ2V0Ll9jaGlsZENvbnN0cnVjdG9ycyA9IFtdO1xuXG4kLldpZGdldC5wcm90b3R5cGUgPSB7XG4gIHdpZGdldE5hbWU6IFwid2lkZ2V0XCIsXG4gIHdpZGdldEV2ZW50UHJlZml4OiBcIlwiLFxuICBkZWZhdWx0RWxlbWVudDogXCI8ZGl2PlwiLFxuICBvcHRpb25zOiB7XG4gICAgZGlzYWJsZWQ6IGZhbHNlLFxuXG4gICAgLy8gY2FsbGJhY2tzXG4gICAgY3JlYXRlOiBudWxsXG4gIH0sXG4gIF9jcmVhdGVXaWRnZXQ6IGZ1bmN0aW9uKCBvcHRpb25zLCBlbGVtZW50ICkge1xuICAgIGVsZW1lbnQgPSAkKCBlbGVtZW50IHx8IHRoaXMuZGVmYXVsdEVsZW1lbnQgfHwgdGhpcyApWyAwIF07XG4gICAgdGhpcy5lbGVtZW50ID0gJCggZWxlbWVudCApO1xuICAgIHRoaXMudXVpZCA9IHdpZGdldF91dWlkKys7XG4gICAgdGhpcy5ldmVudE5hbWVzcGFjZSA9IFwiLlwiICsgdGhpcy53aWRnZXROYW1lICsgdGhpcy51dWlkO1xuXG4gICAgdGhpcy5iaW5kaW5ncyA9ICQoKTtcbiAgICB0aGlzLmhvdmVyYWJsZSA9ICQoKTtcbiAgICB0aGlzLmZvY3VzYWJsZSA9ICQoKTtcblxuICAgIGlmICggZWxlbWVudCAhPT0gdGhpcyApIHtcbiAgICAgICQuZGF0YSggZWxlbWVudCwgdGhpcy53aWRnZXRGdWxsTmFtZSwgdGhpcyApO1xuICAgICAgdGhpcy5fb24oIHRydWUsIHRoaXMuZWxlbWVudCwge1xuICAgICAgICByZW1vdmU6IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICAgICAgICBpZiAoIGV2ZW50LnRhcmdldCA9PT0gZWxlbWVudCApIHtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLmRvY3VtZW50ID0gJCggZWxlbWVudC5zdHlsZSA/XG4gICAgICAgIC8vIGVsZW1lbnQgd2l0aGluIHRoZSBkb2N1bWVudFxuICAgICAgICBlbGVtZW50Lm93bmVyRG9jdW1lbnQgOlxuICAgICAgICAvLyBlbGVtZW50IGlzIHdpbmRvdyBvciBkb2N1bWVudFxuICAgICAgICBlbGVtZW50LmRvY3VtZW50IHx8IGVsZW1lbnQgKTtcbiAgICAgIHRoaXMud2luZG93ID0gJCggdGhpcy5kb2N1bWVudFswXS5kZWZhdWx0VmlldyB8fCB0aGlzLmRvY3VtZW50WzBdLnBhcmVudFdpbmRvdyApO1xuICAgIH1cblxuICAgIHRoaXMub3B0aW9ucyA9ICQud2lkZ2V0LmV4dGVuZCgge30sXG4gICAgICB0aGlzLm9wdGlvbnMsXG4gICAgICB0aGlzLl9nZXRDcmVhdGVPcHRpb25zKCksXG4gICAgICBvcHRpb25zICk7XG5cbiAgICB0aGlzLl9jcmVhdGUoKTtcbiAgICB0aGlzLl90cmlnZ2VyKCBcImNyZWF0ZVwiLCBudWxsLCB0aGlzLl9nZXRDcmVhdGVFdmVudERhdGEoKSApO1xuICAgIHRoaXMuX2luaXQoKTtcbiAgfSxcbiAgX2dldENyZWF0ZU9wdGlvbnM6ICQubm9vcCxcbiAgX2dldENyZWF0ZUV2ZW50RGF0YTogJC5ub29wLFxuICBfY3JlYXRlOiAkLm5vb3AsXG4gIF9pbml0OiAkLm5vb3AsXG5cbiAgZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fZGVzdHJveSgpO1xuICAgIC8vIHdlIGNhbiBwcm9iYWJseSByZW1vdmUgdGhlIHVuYmluZCBjYWxscyBpbiAyLjBcbiAgICAvLyBhbGwgZXZlbnQgYmluZGluZ3Mgc2hvdWxkIGdvIHRocm91Z2ggdGhpcy5fb24oKVxuICAgIHRoaXMuZWxlbWVudFxuICAgICAgLnVuYmluZCggdGhpcy5ldmVudE5hbWVzcGFjZSApXG4gICAgICAucmVtb3ZlRGF0YSggdGhpcy53aWRnZXRGdWxsTmFtZSApXG4gICAgICAvLyBzdXBwb3J0OiBqcXVlcnkgPDEuNi4zXG4gICAgICAvLyBodHRwOi8vYnVncy5qcXVlcnkuY29tL3RpY2tldC85NDEzXG4gICAgICAucmVtb3ZlRGF0YSggJC5jYW1lbENhc2UoIHRoaXMud2lkZ2V0RnVsbE5hbWUgKSApO1xuICAgIHRoaXMud2lkZ2V0KClcbiAgICAgIC51bmJpbmQoIHRoaXMuZXZlbnROYW1lc3BhY2UgKVxuICAgICAgLnJlbW92ZUF0dHIoIFwiYXJpYS1kaXNhYmxlZFwiIClcbiAgICAgIC5yZW1vdmVDbGFzcyhcbiAgICAgICAgdGhpcy53aWRnZXRGdWxsTmFtZSArIFwiLWRpc2FibGVkIFwiICtcbiAgICAgICAgXCJ1aS1zdGF0ZS1kaXNhYmxlZFwiICk7XG5cbiAgICAvLyBjbGVhbiB1cCBldmVudHMgYW5kIHN0YXRlc1xuICAgIHRoaXMuYmluZGluZ3MudW5iaW5kKCB0aGlzLmV2ZW50TmFtZXNwYWNlICk7XG4gICAgdGhpcy5ob3ZlcmFibGUucmVtb3ZlQ2xhc3MoIFwidWktc3RhdGUtaG92ZXJcIiApO1xuICAgIHRoaXMuZm9jdXNhYmxlLnJlbW92ZUNsYXNzKCBcInVpLXN0YXRlLWZvY3VzXCIgKTtcbiAgfSxcbiAgX2Rlc3Ryb3k6ICQubm9vcCxcblxuICB3aWRnZXQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQ7XG4gIH0sXG5cbiAgb3B0aW9uOiBmdW5jdGlvbigga2V5LCB2YWx1ZSApIHtcbiAgICB2YXIgb3B0aW9ucyA9IGtleSxcbiAgICAgIHBhcnRzLFxuICAgICAgY3VyT3B0aW9uLFxuICAgICAgaTtcblxuICAgIGlmICggYXJndW1lbnRzLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgIC8vIGRvbid0IHJldHVybiBhIHJlZmVyZW5jZSB0byB0aGUgaW50ZXJuYWwgaGFzaFxuICAgICAgcmV0dXJuICQud2lkZ2V0LmV4dGVuZCgge30sIHRoaXMub3B0aW9ucyApO1xuICAgIH1cblxuICAgIGlmICggdHlwZW9mIGtleSA9PT0gXCJzdHJpbmdcIiApIHtcbiAgICAgIC8vIGhhbmRsZSBuZXN0ZWQga2V5cywgZS5nLiwgXCJmb28uYmFyXCIgPT4geyBmb286IHsgYmFyOiBfX18gfSB9XG4gICAgICBvcHRpb25zID0ge307XG4gICAgICBwYXJ0cyA9IGtleS5zcGxpdCggXCIuXCIgKTtcbiAgICAgIGtleSA9IHBhcnRzLnNoaWZ0KCk7XG4gICAgICBpZiAoIHBhcnRzLmxlbmd0aCApIHtcbiAgICAgICAgY3VyT3B0aW9uID0gb3B0aW9uc1sga2V5IF0gPSAkLndpZGdldC5leHRlbmQoIHt9LCB0aGlzLm9wdGlvbnNbIGtleSBdICk7XG4gICAgICAgIGZvciAoIGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoIC0gMTsgaSsrICkge1xuICAgICAgICAgIGN1ck9wdGlvblsgcGFydHNbIGkgXSBdID0gY3VyT3B0aW9uWyBwYXJ0c1sgaSBdIF0gfHwge307XG4gICAgICAgICAgY3VyT3B0aW9uID0gY3VyT3B0aW9uWyBwYXJ0c1sgaSBdIF07XG4gICAgICAgIH1cbiAgICAgICAga2V5ID0gcGFydHMucG9wKCk7XG4gICAgICAgIGlmICggYXJndW1lbnRzLmxlbmd0aCA9PT0gMSApIHtcbiAgICAgICAgICByZXR1cm4gY3VyT3B0aW9uWyBrZXkgXSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGN1ck9wdGlvblsga2V5IF07XG4gICAgICAgIH1cbiAgICAgICAgY3VyT3B0aW9uWyBrZXkgXSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCBhcmd1bWVudHMubGVuZ3RoID09PSAxICkge1xuICAgICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnNbIGtleSBdID09PSB1bmRlZmluZWQgPyBudWxsIDogdGhpcy5vcHRpb25zWyBrZXkgXTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zWyBrZXkgXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX3NldE9wdGlvbnMoIG9wdGlvbnMgKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBfc2V0T3B0aW9uczogZnVuY3Rpb24oIG9wdGlvbnMgKSB7XG4gICAgdmFyIGtleTtcblxuICAgIGZvciAoIGtleSBpbiBvcHRpb25zICkge1xuICAgICAgdGhpcy5fc2V0T3B0aW9uKCBrZXksIG9wdGlvbnNbIGtleSBdICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIF9zZXRPcHRpb246IGZ1bmN0aW9uKCBrZXksIHZhbHVlICkge1xuICAgIHRoaXMub3B0aW9uc1sga2V5IF0gPSB2YWx1ZTtcblxuICAgIGlmICgga2V5ID09PSBcImRpc2FibGVkXCIgKSB7XG4gICAgICB0aGlzLndpZGdldCgpXG4gICAgICAgIC50b2dnbGVDbGFzcyggdGhpcy53aWRnZXRGdWxsTmFtZSArIFwiLWRpc2FibGVkXCIsICEhdmFsdWUgKTtcblxuICAgICAgLy8gSWYgdGhlIHdpZGdldCBpcyBiZWNvbWluZyBkaXNhYmxlZCwgdGhlbiBub3RoaW5nIGlzIGludGVyYWN0aXZlXG4gICAgICBpZiAoIHZhbHVlICkge1xuICAgICAgICB0aGlzLmhvdmVyYWJsZS5yZW1vdmVDbGFzcyggXCJ1aS1zdGF0ZS1ob3ZlclwiICk7XG4gICAgICAgIHRoaXMuZm9jdXNhYmxlLnJlbW92ZUNsYXNzKCBcInVpLXN0YXRlLWZvY3VzXCIgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBlbmFibGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9zZXRPcHRpb25zKHsgZGlzYWJsZWQ6IGZhbHNlIH0pO1xuICB9LFxuICBkaXNhYmxlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fc2V0T3B0aW9ucyh7IGRpc2FibGVkOiB0cnVlIH0pO1xuICB9LFxuXG4gIF9vbjogZnVuY3Rpb24oIHN1cHByZXNzRGlzYWJsZWRDaGVjaywgZWxlbWVudCwgaGFuZGxlcnMgKSB7XG4gICAgdmFyIGRlbGVnYXRlRWxlbWVudCxcbiAgICAgIGluc3RhbmNlID0gdGhpcztcblxuICAgIC8vIG5vIHN1cHByZXNzRGlzYWJsZWRDaGVjayBmbGFnLCBzaHVmZmxlIGFyZ3VtZW50c1xuICAgIGlmICggdHlwZW9mIHN1cHByZXNzRGlzYWJsZWRDaGVjayAhPT0gXCJib29sZWFuXCIgKSB7XG4gICAgICBoYW5kbGVycyA9IGVsZW1lbnQ7XG4gICAgICBlbGVtZW50ID0gc3VwcHJlc3NEaXNhYmxlZENoZWNrO1xuICAgICAgc3VwcHJlc3NEaXNhYmxlZENoZWNrID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gbm8gZWxlbWVudCBhcmd1bWVudCwgc2h1ZmZsZSBhbmQgdXNlIHRoaXMuZWxlbWVudFxuICAgIGlmICggIWhhbmRsZXJzICkge1xuICAgICAgaGFuZGxlcnMgPSBlbGVtZW50O1xuICAgICAgZWxlbWVudCA9IHRoaXMuZWxlbWVudDtcbiAgICAgIGRlbGVnYXRlRWxlbWVudCA9IHRoaXMud2lkZ2V0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQgPSBkZWxlZ2F0ZUVsZW1lbnQgPSAkKCBlbGVtZW50ICk7XG4gICAgICB0aGlzLmJpbmRpbmdzID0gdGhpcy5iaW5kaW5ncy5hZGQoIGVsZW1lbnQgKTtcbiAgICB9XG5cbiAgICAkLmVhY2goIGhhbmRsZXJzLCBmdW5jdGlvbiggZXZlbnQsIGhhbmRsZXIgKSB7XG4gICAgICBmdW5jdGlvbiBoYW5kbGVyUHJveHkoKSB7XG4gICAgICAgIC8vIGFsbG93IHdpZGdldHMgdG8gY3VzdG9taXplIHRoZSBkaXNhYmxlZCBoYW5kbGluZ1xuICAgICAgICAvLyAtIGRpc2FibGVkIGFzIGFuIGFycmF5IGluc3RlYWQgb2YgYm9vbGVhblxuICAgICAgICAvLyAtIGRpc2FibGVkIGNsYXNzIGFzIG1ldGhvZCBmb3IgZGlzYWJsaW5nIGluZGl2aWR1YWwgcGFydHNcbiAgICAgICAgaWYgKCAhc3VwcHJlc3NEaXNhYmxlZENoZWNrICYmXG4gICAgICAgICAgICAoIGluc3RhbmNlLm9wdGlvbnMuZGlzYWJsZWQgPT09IHRydWUgfHxcbiAgICAgICAgICAgICAgJCggdGhpcyApLmhhc0NsYXNzKCBcInVpLXN0YXRlLWRpc2FibGVkXCIgKSApICkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKCB0eXBlb2YgaGFuZGxlciA9PT0gXCJzdHJpbmdcIiA/IGluc3RhbmNlWyBoYW5kbGVyIF0gOiBoYW5kbGVyIClcbiAgICAgICAgICAuYXBwbHkoIGluc3RhbmNlLCBhcmd1bWVudHMgKTtcbiAgICAgIH1cblxuICAgICAgLy8gY29weSB0aGUgZ3VpZCBzbyBkaXJlY3QgdW5iaW5kaW5nIHdvcmtzXG4gICAgICBpZiAoIHR5cGVvZiBoYW5kbGVyICE9PSBcInN0cmluZ1wiICkge1xuICAgICAgICBoYW5kbGVyUHJveHkuZ3VpZCA9IGhhbmRsZXIuZ3VpZCA9XG4gICAgICAgICAgaGFuZGxlci5ndWlkIHx8IGhhbmRsZXJQcm94eS5ndWlkIHx8ICQuZ3VpZCsrO1xuICAgICAgfVxuXG4gICAgICB2YXIgbWF0Y2ggPSBldmVudC5tYXRjaCggL14oW1xcdzotXSopXFxzKiguKikkLyApLFxuICAgICAgICBldmVudE5hbWUgPSBtYXRjaFsxXSArIGluc3RhbmNlLmV2ZW50TmFtZXNwYWNlLFxuICAgICAgICBzZWxlY3RvciA9IG1hdGNoWzJdO1xuICAgICAgaWYgKCBzZWxlY3RvciApIHtcbiAgICAgICAgZGVsZWdhdGVFbGVtZW50LmRlbGVnYXRlKCBzZWxlY3RvciwgZXZlbnROYW1lLCBoYW5kbGVyUHJveHkgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW1lbnQuYmluZCggZXZlbnROYW1lLCBoYW5kbGVyUHJveHkgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICBfb2ZmOiBmdW5jdGlvbiggZWxlbWVudCwgZXZlbnROYW1lICkge1xuICAgIGV2ZW50TmFtZSA9IChldmVudE5hbWUgfHwgXCJcIikuc3BsaXQoIFwiIFwiICkuam9pbiggdGhpcy5ldmVudE5hbWVzcGFjZSArIFwiIFwiICkgK1xuICAgICAgdGhpcy5ldmVudE5hbWVzcGFjZTtcbiAgICBlbGVtZW50LnVuYmluZCggZXZlbnROYW1lICkudW5kZWxlZ2F0ZSggZXZlbnROYW1lICk7XG5cbiAgICAvLyBDbGVhciB0aGUgc3RhY2sgdG8gYXZvaWQgbWVtb3J5IGxlYWtzICgjMTAwNTYpXG4gICAgdGhpcy5iaW5kaW5ncyA9ICQoIHRoaXMuYmluZGluZ3Mubm90KCBlbGVtZW50ICkuZ2V0KCkgKTtcbiAgICB0aGlzLmZvY3VzYWJsZSA9ICQoIHRoaXMuZm9jdXNhYmxlLm5vdCggZWxlbWVudCApLmdldCgpICk7XG4gICAgdGhpcy5ob3ZlcmFibGUgPSAkKCB0aGlzLmhvdmVyYWJsZS5ub3QoIGVsZW1lbnQgKS5nZXQoKSApO1xuICB9LFxuXG4gIF9kZWxheTogZnVuY3Rpb24oIGhhbmRsZXIsIGRlbGF5ICkge1xuICAgIGZ1bmN0aW9uIGhhbmRsZXJQcm94eSgpIHtcbiAgICAgIHJldHVybiAoIHR5cGVvZiBoYW5kbGVyID09PSBcInN0cmluZ1wiID8gaW5zdGFuY2VbIGhhbmRsZXIgXSA6IGhhbmRsZXIgKVxuICAgICAgICAuYXBwbHkoIGluc3RhbmNlLCBhcmd1bWVudHMgKTtcbiAgICB9XG4gICAgdmFyIGluc3RhbmNlID0gdGhpcztcbiAgICByZXR1cm4gc2V0VGltZW91dCggaGFuZGxlclByb3h5LCBkZWxheSB8fCAwICk7XG4gIH0sXG5cbiAgX2hvdmVyYWJsZTogZnVuY3Rpb24oIGVsZW1lbnQgKSB7XG4gICAgdGhpcy5ob3ZlcmFibGUgPSB0aGlzLmhvdmVyYWJsZS5hZGQoIGVsZW1lbnQgKTtcbiAgICB0aGlzLl9vbiggZWxlbWVudCwge1xuICAgICAgbW91c2VlbnRlcjogZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgICAgICAkKCBldmVudC5jdXJyZW50VGFyZ2V0ICkuYWRkQ2xhc3MoIFwidWktc3RhdGUtaG92ZXJcIiApO1xuICAgICAgfSxcbiAgICAgIG1vdXNlbGVhdmU6IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICAgICAgJCggZXZlbnQuY3VycmVudFRhcmdldCApLnJlbW92ZUNsYXNzKCBcInVpLXN0YXRlLWhvdmVyXCIgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICBfZm9jdXNhYmxlOiBmdW5jdGlvbiggZWxlbWVudCApIHtcbiAgICB0aGlzLmZvY3VzYWJsZSA9IHRoaXMuZm9jdXNhYmxlLmFkZCggZWxlbWVudCApO1xuICAgIHRoaXMuX29uKCBlbGVtZW50LCB7XG4gICAgICBmb2N1c2luOiBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgICAgICQoIGV2ZW50LmN1cnJlbnRUYXJnZXQgKS5hZGRDbGFzcyggXCJ1aS1zdGF0ZS1mb2N1c1wiICk7XG4gICAgICB9LFxuICAgICAgZm9jdXNvdXQ6IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICAgICAgJCggZXZlbnQuY3VycmVudFRhcmdldCApLnJlbW92ZUNsYXNzKCBcInVpLXN0YXRlLWZvY3VzXCIgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICBfdHJpZ2dlcjogZnVuY3Rpb24oIHR5cGUsIGV2ZW50LCBkYXRhICkge1xuICAgIHZhciBwcm9wLCBvcmlnLFxuICAgICAgY2FsbGJhY2sgPSB0aGlzLm9wdGlvbnNbIHR5cGUgXTtcblxuICAgIGRhdGEgPSBkYXRhIHx8IHt9O1xuICAgIGV2ZW50ID0gJC5FdmVudCggZXZlbnQgKTtcbiAgICBldmVudC50eXBlID0gKCB0eXBlID09PSB0aGlzLndpZGdldEV2ZW50UHJlZml4ID9cbiAgICAgIHR5cGUgOlxuICAgICAgdGhpcy53aWRnZXRFdmVudFByZWZpeCArIHR5cGUgKS50b0xvd2VyQ2FzZSgpO1xuICAgIC8vIHRoZSBvcmlnaW5hbCBldmVudCBtYXkgY29tZSBmcm9tIGFueSBlbGVtZW50XG4gICAgLy8gc28gd2UgbmVlZCB0byByZXNldCB0aGUgdGFyZ2V0IG9uIHRoZSBuZXcgZXZlbnRcbiAgICBldmVudC50YXJnZXQgPSB0aGlzLmVsZW1lbnRbIDAgXTtcblxuICAgIC8vIGNvcHkgb3JpZ2luYWwgZXZlbnQgcHJvcGVydGllcyBvdmVyIHRvIHRoZSBuZXcgZXZlbnRcbiAgICBvcmlnID0gZXZlbnQub3JpZ2luYWxFdmVudDtcbiAgICBpZiAoIG9yaWcgKSB7XG4gICAgICBmb3IgKCBwcm9wIGluIG9yaWcgKSB7XG4gICAgICAgIGlmICggISggcHJvcCBpbiBldmVudCApICkge1xuICAgICAgICAgIGV2ZW50WyBwcm9wIF0gPSBvcmlnWyBwcm9wIF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmVsZW1lbnQudHJpZ2dlciggZXZlbnQsIGRhdGEgKTtcbiAgICByZXR1cm4gISggJC5pc0Z1bmN0aW9uKCBjYWxsYmFjayApICYmXG4gICAgICBjYWxsYmFjay5hcHBseSggdGhpcy5lbGVtZW50WzBdLCBbIGV2ZW50IF0uY29uY2F0KCBkYXRhICkgKSA9PT0gZmFsc2UgfHxcbiAgICAgIGV2ZW50LmlzRGVmYXVsdFByZXZlbnRlZCgpICk7XG4gIH1cbn07XG5cbiQuZWFjaCggeyBzaG93OiBcImZhZGVJblwiLCBoaWRlOiBcImZhZGVPdXRcIiB9LCBmdW5jdGlvbiggbWV0aG9kLCBkZWZhdWx0RWZmZWN0ICkge1xuICAkLldpZGdldC5wcm90b3R5cGVbIFwiX1wiICsgbWV0aG9kIF0gPSBmdW5jdGlvbiggZWxlbWVudCwgb3B0aW9ucywgY2FsbGJhY2sgKSB7XG4gICAgaWYgKCB0eXBlb2Ygb3B0aW9ucyA9PT0gXCJzdHJpbmdcIiApIHtcbiAgICAgIG9wdGlvbnMgPSB7IGVmZmVjdDogb3B0aW9ucyB9O1xuICAgIH1cbiAgICB2YXIgaGFzT3B0aW9ucyxcbiAgICAgIGVmZmVjdE5hbWUgPSAhb3B0aW9ucyA/XG4gICAgICAgIG1ldGhvZCA6XG4gICAgICAgIG9wdGlvbnMgPT09IHRydWUgfHwgdHlwZW9mIG9wdGlvbnMgPT09IFwibnVtYmVyXCIgP1xuICAgICAgICAgIGRlZmF1bHRFZmZlY3QgOlxuICAgICAgICAgIG9wdGlvbnMuZWZmZWN0IHx8IGRlZmF1bHRFZmZlY3Q7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgaWYgKCB0eXBlb2Ygb3B0aW9ucyA9PT0gXCJudW1iZXJcIiApIHtcbiAgICAgIG9wdGlvbnMgPSB7IGR1cmF0aW9uOiBvcHRpb25zIH07XG4gICAgfVxuICAgIGhhc09wdGlvbnMgPSAhJC5pc0VtcHR5T2JqZWN0KCBvcHRpb25zICk7XG4gICAgb3B0aW9ucy5jb21wbGV0ZSA9IGNhbGxiYWNrO1xuICAgIGlmICggb3B0aW9ucy5kZWxheSApIHtcbiAgICAgIGVsZW1lbnQuZGVsYXkoIG9wdGlvbnMuZGVsYXkgKTtcbiAgICB9XG4gICAgaWYgKCBoYXNPcHRpb25zICYmICQuZWZmZWN0cyAmJiAkLmVmZmVjdHMuZWZmZWN0WyBlZmZlY3ROYW1lIF0gKSB7XG4gICAgICBlbGVtZW50WyBtZXRob2QgXSggb3B0aW9ucyApO1xuICAgIH0gZWxzZSBpZiAoIGVmZmVjdE5hbWUgIT09IG1ldGhvZCAmJiBlbGVtZW50WyBlZmZlY3ROYW1lIF0gKSB7XG4gICAgICBlbGVtZW50WyBlZmZlY3ROYW1lIF0oIG9wdGlvbnMuZHVyYXRpb24sIG9wdGlvbnMuZWFzaW5nLCBjYWxsYmFjayApO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50LnF1ZXVlKGZ1bmN0aW9uKCBuZXh0ICkge1xuICAgICAgICAkKCB0aGlzIClbIG1ldGhvZCBdKCk7XG4gICAgICAgIGlmICggY2FsbGJhY2sgKSB7XG4gICAgICAgICAgY2FsbGJhY2suY2FsbCggZWxlbWVudFsgMCBdICk7XG4gICAgICAgIH1cbiAgICAgICAgbmV4dCgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufSk7XG5cbnZhciB3aWRnZXQgPSAkLndpZGdldDtcblxuXG4vKiFcbiAqIGpRdWVyeSBVSSBNb3VzZSAxLjExLjNcbiAqIGh0dHA6Ly9qcXVlcnl1aS5jb21cbiAqXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9yc1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogaHR0cDovL2pxdWVyeS5vcmcvbGljZW5zZVxuICpcbiAqIGh0dHA6Ly9hcGkuanF1ZXJ5dWkuY29tL21vdXNlL1xuICovXG5cblxudmFyIG1vdXNlSGFuZGxlZCA9IGZhbHNlO1xuJCggZG9jdW1lbnQgKS5tb3VzZXVwKCBmdW5jdGlvbigpIHtcbiAgbW91c2VIYW5kbGVkID0gZmFsc2U7XG59KTtcblxudmFyIG1vdXNlID0gJC53aWRnZXQoXCJ1aS5tb3VzZVwiLCB7XG4gIHZlcnNpb246IFwiMS4xMS4zXCIsXG4gIG9wdGlvbnM6IHtcbiAgICBjYW5jZWw6IFwiaW5wdXQsdGV4dGFyZWEsYnV0dG9uLHNlbGVjdCxvcHRpb25cIixcbiAgICBkaXN0YW5jZTogMSxcbiAgICBkZWxheTogMFxuICB9LFxuICBfbW91c2VJbml0OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICB0aGlzLmVsZW1lbnRcbiAgICAgIC5iaW5kKFwibW91c2Vkb3duLlwiICsgdGhpcy53aWRnZXROYW1lLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICByZXR1cm4gdGhhdC5fbW91c2VEb3duKGV2ZW50KTtcbiAgICAgIH0pXG4gICAgICAuYmluZChcImNsaWNrLlwiICsgdGhpcy53aWRnZXROYW1lLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBpZiAodHJ1ZSA9PT0gJC5kYXRhKGV2ZW50LnRhcmdldCwgdGhhdC53aWRnZXROYW1lICsgXCIucHJldmVudENsaWNrRXZlbnRcIikpIHtcbiAgICAgICAgICAkLnJlbW92ZURhdGEoZXZlbnQudGFyZ2V0LCB0aGF0LndpZGdldE5hbWUgKyBcIi5wcmV2ZW50Q2xpY2tFdmVudFwiKTtcbiAgICAgICAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG4gIH0sXG5cbiAgLy8gVE9ETzogbWFrZSBzdXJlIGRlc3Ryb3lpbmcgb25lIGluc3RhbmNlIG9mIG1vdXNlIGRvZXNuJ3QgbWVzcyB3aXRoXG4gIC8vIG90aGVyIGluc3RhbmNlcyBvZiBtb3VzZVxuICBfbW91c2VEZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmVsZW1lbnQudW5iaW5kKFwiLlwiICsgdGhpcy53aWRnZXROYW1lKTtcbiAgICBpZiAoIHRoaXMuX21vdXNlTW92ZURlbGVnYXRlICkge1xuICAgICAgdGhpcy5kb2N1bWVudFxuICAgICAgICAudW5iaW5kKFwibW91c2Vtb3ZlLlwiICsgdGhpcy53aWRnZXROYW1lLCB0aGlzLl9tb3VzZU1vdmVEZWxlZ2F0ZSlcbiAgICAgICAgLnVuYmluZChcIm1vdXNldXAuXCIgKyB0aGlzLndpZGdldE5hbWUsIHRoaXMuX21vdXNlVXBEZWxlZ2F0ZSk7XG4gICAgfVxuICB9LFxuXG4gIF9tb3VzZURvd246IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgLy8gZG9uJ3QgbGV0IG1vcmUgdGhhbiBvbmUgd2lkZ2V0IGhhbmRsZSBtb3VzZVN0YXJ0XG4gICAgaWYgKCBtb3VzZUhhbmRsZWQgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fbW91c2VNb3ZlZCA9IGZhbHNlO1xuXG4gICAgLy8gd2UgbWF5IGhhdmUgbWlzc2VkIG1vdXNldXAgKG91dCBvZiB3aW5kb3cpXG4gICAgKHRoaXMuX21vdXNlU3RhcnRlZCAmJiB0aGlzLl9tb3VzZVVwKGV2ZW50KSk7XG5cbiAgICB0aGlzLl9tb3VzZURvd25FdmVudCA9IGV2ZW50O1xuXG4gICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgYnRuSXNMZWZ0ID0gKGV2ZW50LndoaWNoID09PSAxKSxcbiAgICAgIC8vIGV2ZW50LnRhcmdldC5ub2RlTmFtZSB3b3JrcyBhcm91bmQgYSBidWcgaW4gSUUgOCB3aXRoXG4gICAgICAvLyBkaXNhYmxlZCBpbnB1dHMgKCM3NjIwKVxuICAgICAgZWxJc0NhbmNlbCA9ICh0eXBlb2YgdGhpcy5vcHRpb25zLmNhbmNlbCA9PT0gXCJzdHJpbmdcIiAmJiBldmVudC50YXJnZXQubm9kZU5hbWUgPyAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdCh0aGlzLm9wdGlvbnMuY2FuY2VsKS5sZW5ndGggOiBmYWxzZSk7XG4gICAgaWYgKCFidG5Jc0xlZnQgfHwgZWxJc0NhbmNlbCB8fCAhdGhpcy5fbW91c2VDYXB0dXJlKGV2ZW50KSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5tb3VzZURlbGF5TWV0ID0gIXRoaXMub3B0aW9ucy5kZWxheTtcbiAgICBpZiAoIXRoaXMubW91c2VEZWxheU1ldCkge1xuICAgICAgdGhpcy5fbW91c2VEZWxheVRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgdGhhdC5tb3VzZURlbGF5TWV0ID0gdHJ1ZTtcbiAgICAgIH0sIHRoaXMub3B0aW9ucy5kZWxheSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX21vdXNlRGlzdGFuY2VNZXQoZXZlbnQpICYmIHRoaXMuX21vdXNlRGVsYXlNZXQoZXZlbnQpKSB7XG4gICAgICB0aGlzLl9tb3VzZVN0YXJ0ZWQgPSAodGhpcy5fbW91c2VTdGFydChldmVudCkgIT09IGZhbHNlKTtcbiAgICAgIGlmICghdGhpcy5fbW91c2VTdGFydGVkKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENsaWNrIGV2ZW50IG1heSBuZXZlciBoYXZlIGZpcmVkIChHZWNrbyAmIE9wZXJhKVxuICAgIGlmICh0cnVlID09PSAkLmRhdGEoZXZlbnQudGFyZ2V0LCB0aGlzLndpZGdldE5hbWUgKyBcIi5wcmV2ZW50Q2xpY2tFdmVudFwiKSkge1xuICAgICAgJC5yZW1vdmVEYXRhKGV2ZW50LnRhcmdldCwgdGhpcy53aWRnZXROYW1lICsgXCIucHJldmVudENsaWNrRXZlbnRcIik7XG4gICAgfVxuXG4gICAgLy8gdGhlc2UgZGVsZWdhdGVzIGFyZSByZXF1aXJlZCB0byBrZWVwIGNvbnRleHRcbiAgICB0aGlzLl9tb3VzZU1vdmVEZWxlZ2F0ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICByZXR1cm4gdGhhdC5fbW91c2VNb3ZlKGV2ZW50KTtcbiAgICB9O1xuICAgIHRoaXMuX21vdXNlVXBEZWxlZ2F0ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICByZXR1cm4gdGhhdC5fbW91c2VVcChldmVudCk7XG4gICAgfTtcblxuICAgIHRoaXMuZG9jdW1lbnRcbiAgICAgIC5iaW5kKCBcIm1vdXNlbW92ZS5cIiArIHRoaXMud2lkZ2V0TmFtZSwgdGhpcy5fbW91c2VNb3ZlRGVsZWdhdGUgKVxuICAgICAgLmJpbmQoIFwibW91c2V1cC5cIiArIHRoaXMud2lkZ2V0TmFtZSwgdGhpcy5fbW91c2VVcERlbGVnYXRlICk7XG5cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgbW91c2VIYW5kbGVkID0gdHJ1ZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcblxuICBfbW91c2VNb3ZlOiBmdW5jdGlvbihldmVudCkge1xuICAgIC8vIE9ubHkgY2hlY2sgZm9yIG1vdXNldXBzIG91dHNpZGUgdGhlIGRvY3VtZW50IGlmIHlvdSd2ZSBtb3ZlZCBpbnNpZGUgdGhlIGRvY3VtZW50XG4gICAgLy8gYXQgbGVhc3Qgb25jZS4gVGhpcyBwcmV2ZW50cyB0aGUgZmlyaW5nIG9mIG1vdXNldXAgaW4gdGhlIGNhc2Ugb2YgSUU8OSwgd2hpY2ggd2lsbFxuICAgIC8vIGZpcmUgYSBtb3VzZW1vdmUgZXZlbnQgaWYgY29udGVudCBpcyBwbGFjZWQgdW5kZXIgdGhlIGN1cnNvci4gU2VlICM3Nzc4XG4gICAgLy8gU3VwcG9ydDogSUUgPDlcbiAgICBpZiAoIHRoaXMuX21vdXNlTW92ZWQgKSB7XG4gICAgICAvLyBJRSBtb3VzZXVwIGNoZWNrIC0gbW91c2V1cCBoYXBwZW5lZCB3aGVuIG1vdXNlIHdhcyBvdXQgb2Ygd2luZG93XG4gICAgICBpZiAoJC51aS5pZSAmJiAoICFkb2N1bWVudC5kb2N1bWVudE1vZGUgfHwgZG9jdW1lbnQuZG9jdW1lbnRNb2RlIDwgOSApICYmICFldmVudC5idXR0b24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21vdXNlVXAoZXZlbnQpO1xuXG4gICAgICAvLyBJZnJhbWUgbW91c2V1cCBjaGVjayAtIG1vdXNldXAgb2NjdXJyZWQgaW4gYW5vdGhlciBkb2N1bWVudFxuICAgICAgfSBlbHNlIGlmICggIWV2ZW50LndoaWNoICkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbW91c2VVcCggZXZlbnQgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIGV2ZW50LndoaWNoIHx8IGV2ZW50LmJ1dHRvbiApIHtcbiAgICAgIHRoaXMuX21vdXNlTW92ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9tb3VzZVN0YXJ0ZWQpIHtcbiAgICAgIHRoaXMuX21vdXNlRHJhZyhldmVudCk7XG4gICAgICByZXR1cm4gZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fbW91c2VEaXN0YW5jZU1ldChldmVudCkgJiYgdGhpcy5fbW91c2VEZWxheU1ldChldmVudCkpIHtcbiAgICAgIHRoaXMuX21vdXNlU3RhcnRlZCA9XG4gICAgICAgICh0aGlzLl9tb3VzZVN0YXJ0KHRoaXMuX21vdXNlRG93bkV2ZW50LCBldmVudCkgIT09IGZhbHNlKTtcbiAgICAgICh0aGlzLl9tb3VzZVN0YXJ0ZWQgPyB0aGlzLl9tb3VzZURyYWcoZXZlbnQpIDogdGhpcy5fbW91c2VVcChldmVudCkpO1xuICAgIH1cblxuICAgIHJldHVybiAhdGhpcy5fbW91c2VTdGFydGVkO1xuICB9LFxuXG4gIF9tb3VzZVVwOiBmdW5jdGlvbihldmVudCkge1xuICAgIHRoaXMuZG9jdW1lbnRcbiAgICAgIC51bmJpbmQoIFwibW91c2Vtb3ZlLlwiICsgdGhpcy53aWRnZXROYW1lLCB0aGlzLl9tb3VzZU1vdmVEZWxlZ2F0ZSApXG4gICAgICAudW5iaW5kKCBcIm1vdXNldXAuXCIgKyB0aGlzLndpZGdldE5hbWUsIHRoaXMuX21vdXNlVXBEZWxlZ2F0ZSApO1xuXG4gICAgaWYgKHRoaXMuX21vdXNlU3RhcnRlZCkge1xuICAgICAgdGhpcy5fbW91c2VTdGFydGVkID0gZmFsc2U7XG5cbiAgICAgIGlmIChldmVudC50YXJnZXQgPT09IHRoaXMuX21vdXNlRG93bkV2ZW50LnRhcmdldCkge1xuICAgICAgICAkLmRhdGEoZXZlbnQudGFyZ2V0LCB0aGlzLndpZGdldE5hbWUgKyBcIi5wcmV2ZW50Q2xpY2tFdmVudFwiLCB0cnVlKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fbW91c2VTdG9wKGV2ZW50KTtcbiAgICB9XG5cbiAgICBtb3VzZUhhbmRsZWQgPSBmYWxzZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgX21vdXNlRGlzdGFuY2VNZXQ6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgcmV0dXJuIChNYXRoLm1heChcbiAgICAgICAgTWF0aC5hYnModGhpcy5fbW91c2VEb3duRXZlbnQucGFnZVggLSBldmVudC5wYWdlWCksXG4gICAgICAgIE1hdGguYWJzKHRoaXMuX21vdXNlRG93bkV2ZW50LnBhZ2VZIC0gZXZlbnQucGFnZVkpXG4gICAgICApID49IHRoaXMub3B0aW9ucy5kaXN0YW5jZVxuICAgICk7XG4gIH0sXG5cbiAgX21vdXNlRGVsYXlNZXQ6IGZ1bmN0aW9uKC8qIGV2ZW50ICovKSB7XG4gICAgcmV0dXJuIHRoaXMubW91c2VEZWxheU1ldDtcbiAgfSxcblxuICAvLyBUaGVzZSBhcmUgcGxhY2Vob2xkZXIgbWV0aG9kcywgdG8gYmUgb3ZlcnJpZGVuIGJ5IGV4dGVuZGluZyBwbHVnaW5cbiAgX21vdXNlU3RhcnQ6IGZ1bmN0aW9uKC8qIGV2ZW50ICovKSB7fSxcbiAgX21vdXNlRHJhZzogZnVuY3Rpb24oLyogZXZlbnQgKi8pIHt9LFxuICBfbW91c2VTdG9wOiBmdW5jdGlvbigvKiBldmVudCAqLykge30sXG4gIF9tb3VzZUNhcHR1cmU6IGZ1bmN0aW9uKC8qIGV2ZW50ICovKSB7IHJldHVybiB0cnVlOyB9XG59KTtcblxuXG4vKiFcbiAqIGpRdWVyeSBVSSBEcmFnZ2FibGUgMS4xMS4zXG4gKiBodHRwOi8vanF1ZXJ5dWkuY29tXG4gKlxuICogQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnNcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqIGh0dHA6Ly9qcXVlcnkub3JnL2xpY2Vuc2VcbiAqXG4gKiBodHRwOi8vYXBpLmpxdWVyeXVpLmNvbS9kcmFnZ2FibGUvXG4gKi9cblxuXG4kLndpZGdldChcInVpLmRyYWdnYWJsZVwiLCAkLnVpLm1vdXNlLCB7XG4gIHZlcnNpb246IFwiMS4xMS4zXCIsXG4gIHdpZGdldEV2ZW50UHJlZml4OiBcImRyYWdcIixcbiAgb3B0aW9uczoge1xuICAgIGFkZENsYXNzZXM6IHRydWUsXG4gICAgYXBwZW5kVG86IFwicGFyZW50XCIsXG4gICAgYXhpczogZmFsc2UsXG4gICAgY29ubmVjdFRvU29ydGFibGU6IGZhbHNlLFxuICAgIGNvbnRhaW5tZW50OiBmYWxzZSxcbiAgICBjdXJzb3I6IFwiYXV0b1wiLFxuICAgIGN1cnNvckF0OiBmYWxzZSxcbiAgICBncmlkOiBmYWxzZSxcbiAgICBoYW5kbGU6IGZhbHNlLFxuICAgIGhlbHBlcjogXCJvcmlnaW5hbFwiLFxuICAgIGlmcmFtZUZpeDogZmFsc2UsXG4gICAgb3BhY2l0eTogZmFsc2UsXG4gICAgcmVmcmVzaFBvc2l0aW9uczogZmFsc2UsXG4gICAgcmV2ZXJ0OiBmYWxzZSxcbiAgICByZXZlcnREdXJhdGlvbjogNTAwLFxuICAgIHNjb3BlOiBcImRlZmF1bHRcIixcbiAgICBzY3JvbGw6IHRydWUsXG4gICAgc2Nyb2xsU2Vuc2l0aXZpdHk6IDIwLFxuICAgIHNjcm9sbFNwZWVkOiAyMCxcbiAgICBzbmFwOiBmYWxzZSxcbiAgICBzbmFwTW9kZTogXCJib3RoXCIsXG4gICAgc25hcFRvbGVyYW5jZTogMjAsXG4gICAgc3RhY2s6IGZhbHNlLFxuICAgIHpJbmRleDogZmFsc2UsXG5cbiAgICAvLyBjYWxsYmFja3NcbiAgICBkcmFnOiBudWxsLFxuICAgIHN0YXJ0OiBudWxsLFxuICAgIHN0b3A6IG51bGxcbiAgfSxcbiAgX2NyZWF0ZTogZnVuY3Rpb24oKSB7XG5cbiAgICBpZiAoIHRoaXMub3B0aW9ucy5oZWxwZXIgPT09IFwib3JpZ2luYWxcIiApIHtcbiAgICAgIHRoaXMuX3NldFBvc2l0aW9uUmVsYXRpdmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMub3B0aW9ucy5hZGRDbGFzc2VzKXtcbiAgICAgIHRoaXMuZWxlbWVudC5hZGRDbGFzcyhcInVpLWRyYWdnYWJsZVwiKTtcbiAgICB9XG4gICAgaWYgKHRoaXMub3B0aW9ucy5kaXNhYmxlZCl7XG4gICAgICB0aGlzLmVsZW1lbnQuYWRkQ2xhc3MoXCJ1aS1kcmFnZ2FibGUtZGlzYWJsZWRcIik7XG4gICAgfVxuICAgIHRoaXMuX3NldEhhbmRsZUNsYXNzTmFtZSgpO1xuXG4gICAgdGhpcy5fbW91c2VJbml0KCk7XG4gIH0sXG5cbiAgX3NldE9wdGlvbjogZnVuY3Rpb24oIGtleSwgdmFsdWUgKSB7XG4gICAgdGhpcy5fc3VwZXIoIGtleSwgdmFsdWUgKTtcbiAgICBpZiAoIGtleSA9PT0gXCJoYW5kbGVcIiApIHtcbiAgICAgIHRoaXMuX3JlbW92ZUhhbmRsZUNsYXNzTmFtZSgpO1xuICAgICAgdGhpcy5fc2V0SGFuZGxlQ2xhc3NOYW1lKCk7XG4gICAgfVxuICB9LFxuXG4gIF9kZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICBpZiAoICggdGhpcy5oZWxwZXIgfHwgdGhpcy5lbGVtZW50ICkuaXMoIFwiLnVpLWRyYWdnYWJsZS1kcmFnZ2luZ1wiICkgKSB7XG4gICAgICB0aGlzLmRlc3Ryb3lPbkNsZWFyID0gdHJ1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCBcInVpLWRyYWdnYWJsZSB1aS1kcmFnZ2FibGUtZHJhZ2dpbmcgdWktZHJhZ2dhYmxlLWRpc2FibGVkXCIgKTtcbiAgICB0aGlzLl9yZW1vdmVIYW5kbGVDbGFzc05hbWUoKTtcbiAgICB0aGlzLl9tb3VzZURlc3Ryb3koKTtcbiAgfSxcblxuICBfbW91c2VDYXB0dXJlOiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBvID0gdGhpcy5vcHRpb25zO1xuXG4gICAgdGhpcy5fYmx1ckFjdGl2ZUVsZW1lbnQoIGV2ZW50ICk7XG5cbiAgICAvLyBhbW9uZyBvdGhlcnMsIHByZXZlbnQgYSBkcmFnIG9uIGEgcmVzaXphYmxlLWhhbmRsZVxuICAgIGlmICh0aGlzLmhlbHBlciB8fCBvLmRpc2FibGVkIHx8ICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KFwiLnVpLXJlc2l6YWJsZS1oYW5kbGVcIikubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vUXVpdCBpZiB3ZSdyZSBub3Qgb24gYSB2YWxpZCBoYW5kbGVcbiAgICB0aGlzLmhhbmRsZSA9IHRoaXMuX2dldEhhbmRsZShldmVudCk7XG4gICAgaWYgKCF0aGlzLmhhbmRsZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuX2Jsb2NrRnJhbWVzKCBvLmlmcmFtZUZpeCA9PT0gdHJ1ZSA/IFwiaWZyYW1lXCIgOiBvLmlmcmFtZUZpeCApO1xuXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgfSxcblxuICBfYmxvY2tGcmFtZXM6IGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcbiAgICB0aGlzLmlmcmFtZUJsb2NrcyA9IHRoaXMuZG9jdW1lbnQuZmluZCggc2VsZWN0b3IgKS5tYXAoZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaWZyYW1lID0gJCggdGhpcyApO1xuXG4gICAgICByZXR1cm4gJCggXCI8ZGl2PlwiIClcbiAgICAgICAgLmNzcyggXCJwb3NpdGlvblwiLCBcImFic29sdXRlXCIgKVxuICAgICAgICAuYXBwZW5kVG8oIGlmcmFtZS5wYXJlbnQoKSApXG4gICAgICAgIC5vdXRlcldpZHRoKCBpZnJhbWUub3V0ZXJXaWR0aCgpIClcbiAgICAgICAgLm91dGVySGVpZ2h0KCBpZnJhbWUub3V0ZXJIZWlnaHQoKSApXG4gICAgICAgIC5vZmZzZXQoIGlmcmFtZS5vZmZzZXQoKSApWyAwIF07XG4gICAgfSk7XG4gIH0sXG5cbiAgX3VuYmxvY2tGcmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIGlmICggdGhpcy5pZnJhbWVCbG9ja3MgKSB7XG4gICAgICB0aGlzLmlmcmFtZUJsb2Nrcy5yZW1vdmUoKTtcbiAgICAgIGRlbGV0ZSB0aGlzLmlmcmFtZUJsb2NrcztcbiAgICB9XG4gIH0sXG5cbiAgX2JsdXJBY3RpdmVFbGVtZW50OiBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgdmFyIGRvY3VtZW50ID0gdGhpcy5kb2N1bWVudFsgMCBdO1xuXG4gICAgLy8gT25seSBuZWVkIHRvIGJsdXIgaWYgdGhlIGV2ZW50IG9jY3VycmVkIG9uIHRoZSBkcmFnZ2FibGUgaXRzZWxmLCBzZWUgIzEwNTI3XG4gICAgaWYgKCAhdGhpcy5oYW5kbGVFbGVtZW50LmlzKCBldmVudC50YXJnZXQgKSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBzdXBwb3J0OiBJRTlcbiAgICAvLyBJRTkgdGhyb3dzIGFuIFwiVW5zcGVjaWZpZWQgZXJyb3JcIiBhY2Nlc3NpbmcgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBmcm9tIGFuIDxpZnJhbWU+XG4gICAgdHJ5IHtcblxuICAgICAgLy8gU3VwcG9ydDogSUU5LCBJRTEwXG4gICAgICAvLyBJZiB0aGUgPGJvZHk+IGlzIGJsdXJyZWQsIElFIHdpbGwgc3dpdGNoIHdpbmRvd3MsIHNlZSAjOTUyMFxuICAgICAgaWYgKCBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICYmIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSAhPT0gXCJib2R5XCIgKSB7XG5cbiAgICAgICAgLy8gQmx1ciBhbnkgZWxlbWVudCB0aGF0IGN1cnJlbnRseSBoYXMgZm9jdXMsIHNlZSAjNDI2MVxuICAgICAgICAkKCBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICkuYmx1cigpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKCBlcnJvciApIHt9XG4gIH0sXG5cbiAgX21vdXNlU3RhcnQ6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICB2YXIgbyA9IHRoaXMub3B0aW9ucztcblxuICAgIC8vQ3JlYXRlIGFuZCBhcHBlbmQgdGhlIHZpc2libGUgaGVscGVyXG4gICAgdGhpcy5oZWxwZXIgPSB0aGlzLl9jcmVhdGVIZWxwZXIoZXZlbnQpO1xuXG4gICAgdGhpcy5oZWxwZXIuYWRkQ2xhc3MoXCJ1aS1kcmFnZ2FibGUtZHJhZ2dpbmdcIik7XG5cbiAgICAvL0NhY2hlIHRoZSBoZWxwZXIgc2l6ZVxuICAgIHRoaXMuX2NhY2hlSGVscGVyUHJvcG9ydGlvbnMoKTtcblxuICAgIC8vSWYgZGRtYW5hZ2VyIGlzIHVzZWQgZm9yIGRyb3BwYWJsZXMsIHNldCB0aGUgZ2xvYmFsIGRyYWdnYWJsZVxuICAgIGlmICgkLnVpLmRkbWFuYWdlcikge1xuICAgICAgJC51aS5kZG1hbmFnZXIuY3VycmVudCA9IHRoaXM7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKiAtIFBvc2l0aW9uIGdlbmVyYXRpb24gLVxuICAgICAqIFRoaXMgYmxvY2sgZ2VuZXJhdGVzIGV2ZXJ5dGhpbmcgcG9zaXRpb24gcmVsYXRlZCAtIGl0J3MgdGhlIGNvcmUgb2YgZHJhZ2dhYmxlcy5cbiAgICAgKi9cblxuICAgIC8vQ2FjaGUgdGhlIG1hcmdpbnMgb2YgdGhlIG9yaWdpbmFsIGVsZW1lbnRcbiAgICB0aGlzLl9jYWNoZU1hcmdpbnMoKTtcblxuICAgIC8vU3RvcmUgdGhlIGhlbHBlcidzIGNzcyBwb3NpdGlvblxuICAgIHRoaXMuY3NzUG9zaXRpb24gPSB0aGlzLmhlbHBlci5jc3MoIFwicG9zaXRpb25cIiApO1xuICAgIHRoaXMuc2Nyb2xsUGFyZW50ID0gdGhpcy5oZWxwZXIuc2Nyb2xsUGFyZW50KCB0cnVlICk7XG4gICAgdGhpcy5vZmZzZXRQYXJlbnQgPSB0aGlzLmhlbHBlci5vZmZzZXRQYXJlbnQoKTtcbiAgICB0aGlzLmhhc0ZpeGVkQW5jZXN0b3IgPSB0aGlzLmhlbHBlci5wYXJlbnRzKCkuZmlsdGVyKGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gJCggdGhpcyApLmNzcyggXCJwb3NpdGlvblwiICkgPT09IFwiZml4ZWRcIjtcbiAgICAgIH0pLmxlbmd0aCA+IDA7XG5cbiAgICAvL1RoZSBlbGVtZW50J3MgYWJzb2x1dGUgcG9zaXRpb24gb24gdGhlIHBhZ2UgbWludXMgbWFyZ2luc1xuICAgIHRoaXMucG9zaXRpb25BYnMgPSB0aGlzLmVsZW1lbnQub2Zmc2V0KCk7XG4gICAgdGhpcy5fcmVmcmVzaE9mZnNldHMoIGV2ZW50ICk7XG5cbiAgICAvL0dlbmVyYXRlIHRoZSBvcmlnaW5hbCBwb3NpdGlvblxuICAgIHRoaXMub3JpZ2luYWxQb3NpdGlvbiA9IHRoaXMucG9zaXRpb24gPSB0aGlzLl9nZW5lcmF0ZVBvc2l0aW9uKCBldmVudCwgZmFsc2UgKTtcbiAgICB0aGlzLm9yaWdpbmFsUGFnZVggPSBldmVudC5wYWdlWDtcbiAgICB0aGlzLm9yaWdpbmFsUGFnZVkgPSBldmVudC5wYWdlWTtcblxuICAgIC8vQWRqdXN0IHRoZSBtb3VzZSBvZmZzZXQgcmVsYXRpdmUgdG8gdGhlIGhlbHBlciBpZiBcImN1cnNvckF0XCIgaXMgc3VwcGxpZWRcbiAgICAoby5jdXJzb3JBdCAmJiB0aGlzLl9hZGp1c3RPZmZzZXRGcm9tSGVscGVyKG8uY3Vyc29yQXQpKTtcblxuICAgIC8vU2V0IGEgY29udGFpbm1lbnQgaWYgZ2l2ZW4gaW4gdGhlIG9wdGlvbnNcbiAgICB0aGlzLl9zZXRDb250YWlubWVudCgpO1xuXG4gICAgLy9UcmlnZ2VyIGV2ZW50ICsgY2FsbGJhY2tzXG4gICAgaWYgKHRoaXMuX3RyaWdnZXIoXCJzdGFydFwiLCBldmVudCkgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLl9jbGVhcigpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vUmVjYWNoZSB0aGUgaGVscGVyIHNpemVcbiAgICB0aGlzLl9jYWNoZUhlbHBlclByb3BvcnRpb25zKCk7XG5cbiAgICAvL1ByZXBhcmUgdGhlIGRyb3BwYWJsZSBvZmZzZXRzXG4gICAgaWYgKCQudWkuZGRtYW5hZ2VyICYmICFvLmRyb3BCZWhhdmlvdXIpIHtcbiAgICAgICQudWkuZGRtYW5hZ2VyLnByZXBhcmVPZmZzZXRzKHRoaXMsIGV2ZW50KTtcbiAgICB9XG5cbiAgICAvLyBSZXNldCBoZWxwZXIncyByaWdodC9ib3R0b20gY3NzIGlmIHRoZXkncmUgc2V0IGFuZCBzZXQgZXhwbGljaXQgd2lkdGgvaGVpZ2h0IGluc3RlYWRcbiAgICAvLyBhcyB0aGlzIHByZXZlbnRzIHJlc2l6aW5nIG9mIGVsZW1lbnRzIHdpdGggcmlnaHQvYm90dG9tIHNldCAoc2VlICM3NzcyKVxuICAgIHRoaXMuX25vcm1hbGl6ZVJpZ2h0Qm90dG9tKCk7XG5cbiAgICB0aGlzLl9tb3VzZURyYWcoZXZlbnQsIHRydWUpOyAvL0V4ZWN1dGUgdGhlIGRyYWcgb25jZSAtIHRoaXMgY2F1c2VzIHRoZSBoZWxwZXIgbm90IHRvIGJlIHZpc2libGUgYmVmb3JlIGdldHRpbmcgaXRzIGNvcnJlY3QgcG9zaXRpb25cblxuICAgIC8vSWYgdGhlIGRkbWFuYWdlciBpcyB1c2VkIGZvciBkcm9wcGFibGVzLCBpbmZvcm0gdGhlIG1hbmFnZXIgdGhhdCBkcmFnZ2luZyBoYXMgc3RhcnRlZCAoc2VlICM1MDAzKVxuICAgIGlmICggJC51aS5kZG1hbmFnZXIgKSB7XG4gICAgICAkLnVpLmRkbWFuYWdlci5kcmFnU3RhcnQodGhpcywgZXZlbnQpO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9LFxuXG4gIF9yZWZyZXNoT2Zmc2V0czogZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgIHRoaXMub2Zmc2V0ID0ge1xuICAgICAgdG9wOiB0aGlzLnBvc2l0aW9uQWJzLnRvcCAtIHRoaXMubWFyZ2lucy50b3AsXG4gICAgICBsZWZ0OiB0aGlzLnBvc2l0aW9uQWJzLmxlZnQgLSB0aGlzLm1hcmdpbnMubGVmdCxcbiAgICAgIHNjcm9sbDogZmFsc2UsXG4gICAgICBwYXJlbnQ6IHRoaXMuX2dldFBhcmVudE9mZnNldCgpLFxuICAgICAgcmVsYXRpdmU6IHRoaXMuX2dldFJlbGF0aXZlT2Zmc2V0KClcbiAgICB9O1xuXG4gICAgdGhpcy5vZmZzZXQuY2xpY2sgPSB7XG4gICAgICBsZWZ0OiBldmVudC5wYWdlWCAtIHRoaXMub2Zmc2V0LmxlZnQsXG4gICAgICB0b3A6IGV2ZW50LnBhZ2VZIC0gdGhpcy5vZmZzZXQudG9wXG4gICAgfTtcbiAgfSxcblxuICBfbW91c2VEcmFnOiBmdW5jdGlvbihldmVudCwgbm9Qcm9wYWdhdGlvbikge1xuICAgIC8vIHJlc2V0IGFueSBuZWNlc3NhcnkgY2FjaGVkIHByb3BlcnRpZXMgKHNlZSAjNTAwOSlcbiAgICBpZiAoIHRoaXMuaGFzRml4ZWRBbmNlc3RvciApIHtcbiAgICAgIHRoaXMub2Zmc2V0LnBhcmVudCA9IHRoaXMuX2dldFBhcmVudE9mZnNldCgpO1xuICAgIH1cblxuICAgIC8vQ29tcHV0ZSB0aGUgaGVscGVycyBwb3NpdGlvblxuICAgIHRoaXMucG9zaXRpb24gPSB0aGlzLl9nZW5lcmF0ZVBvc2l0aW9uKCBldmVudCwgdHJ1ZSApO1xuICAgIHRoaXMucG9zaXRpb25BYnMgPSB0aGlzLl9jb252ZXJ0UG9zaXRpb25UbyhcImFic29sdXRlXCIpO1xuXG4gICAgLy9DYWxsIHBsdWdpbnMgYW5kIGNhbGxiYWNrcyBhbmQgdXNlIHRoZSByZXN1bHRpbmcgcG9zaXRpb24gaWYgc29tZXRoaW5nIGlzIHJldHVybmVkXG4gICAgaWYgKCFub1Byb3BhZ2F0aW9uKSB7XG4gICAgICB2YXIgdWkgPSB0aGlzLl91aUhhc2goKTtcbiAgICAgIGlmICh0aGlzLl90cmlnZ2VyKFwiZHJhZ1wiLCBldmVudCwgdWkpID09PSBmYWxzZSkge1xuICAgICAgICB0aGlzLl9tb3VzZVVwKHt9KTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgdGhpcy5wb3NpdGlvbiA9IHVpLnBvc2l0aW9uO1xuICAgIH1cblxuICAgIHRoaXMuaGVscGVyWyAwIF0uc3R5bGUubGVmdCA9IHRoaXMucG9zaXRpb24ubGVmdCArIFwicHhcIjtcbiAgICB0aGlzLmhlbHBlclsgMCBdLnN0eWxlLnRvcCA9IHRoaXMucG9zaXRpb24udG9wICsgXCJweFwiO1xuXG4gICAgaWYgKCQudWkuZGRtYW5hZ2VyKSB7XG4gICAgICAkLnVpLmRkbWFuYWdlci5kcmFnKHRoaXMsIGV2ZW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgX21vdXNlU3RvcDogZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgIC8vSWYgd2UgYXJlIHVzaW5nIGRyb3BwYWJsZXMsIGluZm9ybSB0aGUgbWFuYWdlciBhYm91dCB0aGUgZHJvcFxuICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgIGRyb3BwZWQgPSBmYWxzZTtcbiAgICBpZiAoJC51aS5kZG1hbmFnZXIgJiYgIXRoaXMub3B0aW9ucy5kcm9wQmVoYXZpb3VyKSB7XG4gICAgICBkcm9wcGVkID0gJC51aS5kZG1hbmFnZXIuZHJvcCh0aGlzLCBldmVudCk7XG4gICAgfVxuXG4gICAgLy9pZiBhIGRyb3AgY29tZXMgZnJvbSBvdXRzaWRlIChhIHNvcnRhYmxlKVxuICAgIGlmICh0aGlzLmRyb3BwZWQpIHtcbiAgICAgIGRyb3BwZWQgPSB0aGlzLmRyb3BwZWQ7XG4gICAgICB0aGlzLmRyb3BwZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoKHRoaXMub3B0aW9ucy5yZXZlcnQgPT09IFwiaW52YWxpZFwiICYmICFkcm9wcGVkKSB8fCAodGhpcy5vcHRpb25zLnJldmVydCA9PT0gXCJ2YWxpZFwiICYmIGRyb3BwZWQpIHx8IHRoaXMub3B0aW9ucy5yZXZlcnQgPT09IHRydWUgfHwgKCQuaXNGdW5jdGlvbih0aGlzLm9wdGlvbnMucmV2ZXJ0KSAmJiB0aGlzLm9wdGlvbnMucmV2ZXJ0LmNhbGwodGhpcy5lbGVtZW50LCBkcm9wcGVkKSkpIHtcbiAgICAgICQodGhpcy5oZWxwZXIpLmFuaW1hdGUodGhpcy5vcmlnaW5hbFBvc2l0aW9uLCBwYXJzZUludCh0aGlzLm9wdGlvbnMucmV2ZXJ0RHVyYXRpb24sIDEwKSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGF0Ll90cmlnZ2VyKFwic3RvcFwiLCBldmVudCkgIT09IGZhbHNlKSB7XG4gICAgICAgICAgdGhhdC5fY2xlYXIoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLl90cmlnZ2VyKFwic3RvcFwiLCBldmVudCkgIT09IGZhbHNlKSB7XG4gICAgICAgIHRoaXMuX2NsZWFyKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIF9tb3VzZVVwOiBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgdGhpcy5fdW5ibG9ja0ZyYW1lcygpO1xuXG4gICAgLy9JZiB0aGUgZGRtYW5hZ2VyIGlzIHVzZWQgZm9yIGRyb3BwYWJsZXMsIGluZm9ybSB0aGUgbWFuYWdlciB0aGF0IGRyYWdnaW5nIGhhcyBzdG9wcGVkIChzZWUgIzUwMDMpXG4gICAgaWYgKCAkLnVpLmRkbWFuYWdlciApIHtcbiAgICAgICQudWkuZGRtYW5hZ2VyLmRyYWdTdG9wKHRoaXMsIGV2ZW50KTtcbiAgICB9XG5cbiAgICAvLyBPbmx5IG5lZWQgdG8gZm9jdXMgaWYgdGhlIGV2ZW50IG9jY3VycmVkIG9uIHRoZSBkcmFnZ2FibGUgaXRzZWxmLCBzZWUgIzEwNTI3XG4gICAgaWYgKCB0aGlzLmhhbmRsZUVsZW1lbnQuaXMoIGV2ZW50LnRhcmdldCApICkge1xuICAgICAgLy8gVGhlIGludGVyYWN0aW9uIGlzIG92ZXI7IHdoZXRoZXIgb3Igbm90IHRoZSBjbGljayByZXN1bHRlZCBpbiBhIGRyYWcsIGZvY3VzIHRoZSBlbGVtZW50XG4gICAgICB0aGlzLmVsZW1lbnQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJC51aS5tb3VzZS5wcm90b3R5cGUuX21vdXNlVXAuY2FsbCh0aGlzLCBldmVudCk7XG4gIH0sXG5cbiAgY2FuY2VsOiBmdW5jdGlvbigpIHtcblxuICAgIGlmICh0aGlzLmhlbHBlci5pcyhcIi51aS1kcmFnZ2FibGUtZHJhZ2dpbmdcIikpIHtcbiAgICAgIHRoaXMuX21vdXNlVXAoe30pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jbGVhcigpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuXG4gIH0sXG5cbiAgX2dldEhhbmRsZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zLmhhbmRsZSA/XG4gICAgICAhISQoIGV2ZW50LnRhcmdldCApLmNsb3Nlc3QoIHRoaXMuZWxlbWVudC5maW5kKCB0aGlzLm9wdGlvbnMuaGFuZGxlICkgKS5sZW5ndGggOlxuICAgICAgdHJ1ZTtcbiAgfSxcblxuICBfc2V0SGFuZGxlQ2xhc3NOYW1lOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmhhbmRsZUVsZW1lbnQgPSB0aGlzLm9wdGlvbnMuaGFuZGxlID9cbiAgICAgIHRoaXMuZWxlbWVudC5maW5kKCB0aGlzLm9wdGlvbnMuaGFuZGxlICkgOiB0aGlzLmVsZW1lbnQ7XG4gICAgdGhpcy5oYW5kbGVFbGVtZW50LmFkZENsYXNzKCBcInVpLWRyYWdnYWJsZS1oYW5kbGVcIiApO1xuICB9LFxuXG4gIF9yZW1vdmVIYW5kbGVDbGFzc05hbWU6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaGFuZGxlRWxlbWVudC5yZW1vdmVDbGFzcyggXCJ1aS1kcmFnZ2FibGUtaGFuZGxlXCIgKTtcbiAgfSxcblxuICBfY3JlYXRlSGVscGVyOiBmdW5jdGlvbihldmVudCkge1xuXG4gICAgdmFyIG8gPSB0aGlzLm9wdGlvbnMsXG4gICAgICBoZWxwZXJJc0Z1bmN0aW9uID0gJC5pc0Z1bmN0aW9uKCBvLmhlbHBlciApLFxuICAgICAgaGVscGVyID0gaGVscGVySXNGdW5jdGlvbiA/XG4gICAgICAgICQoIG8uaGVscGVyLmFwcGx5KCB0aGlzLmVsZW1lbnRbIDAgXSwgWyBldmVudCBdICkgKSA6XG4gICAgICAgICggby5oZWxwZXIgPT09IFwiY2xvbmVcIiA/XG4gICAgICAgICAgdGhpcy5lbGVtZW50LmNsb25lKCkucmVtb3ZlQXR0ciggXCJpZFwiICkgOlxuICAgICAgICAgIHRoaXMuZWxlbWVudCApO1xuXG4gICAgaWYgKCFoZWxwZXIucGFyZW50cyhcImJvZHlcIikubGVuZ3RoKSB7XG4gICAgICBoZWxwZXIuYXBwZW5kVG8oKG8uYXBwZW5kVG8gPT09IFwicGFyZW50XCIgPyB0aGlzLmVsZW1lbnRbMF0ucGFyZW50Tm9kZSA6IG8uYXBwZW5kVG8pKTtcbiAgICB9XG5cbiAgICAvLyBodHRwOi8vYnVncy5qcXVlcnl1aS5jb20vdGlja2V0Lzk0NDZcbiAgICAvLyBhIGhlbHBlciBmdW5jdGlvbiBjYW4gcmV0dXJuIHRoZSBvcmlnaW5hbCBlbGVtZW50XG4gICAgLy8gd2hpY2ggd291bGRuJ3QgaGF2ZSBiZWVuIHNldCB0byByZWxhdGl2ZSBpbiBfY3JlYXRlXG4gICAgaWYgKCBoZWxwZXJJc0Z1bmN0aW9uICYmIGhlbHBlclsgMCBdID09PSB0aGlzLmVsZW1lbnRbIDAgXSApIHtcbiAgICAgIHRoaXMuX3NldFBvc2l0aW9uUmVsYXRpdmUoKTtcbiAgICB9XG5cbiAgICBpZiAoaGVscGVyWzBdICE9PSB0aGlzLmVsZW1lbnRbMF0gJiYgISgvKGZpeGVkfGFic29sdXRlKS8pLnRlc3QoaGVscGVyLmNzcyhcInBvc2l0aW9uXCIpKSkge1xuICAgICAgaGVscGVyLmNzcyhcInBvc2l0aW9uXCIsIFwiYWJzb2x1dGVcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhlbHBlcjtcblxuICB9LFxuXG4gIF9zZXRQb3NpdGlvblJlbGF0aXZlOiBmdW5jdGlvbigpIHtcbiAgICBpZiAoICEoIC9eKD86cnxhfGYpLyApLnRlc3QoIHRoaXMuZWxlbWVudC5jc3MoIFwicG9zaXRpb25cIiApICkgKSB7XG4gICAgICB0aGlzLmVsZW1lbnRbIDAgXS5zdHlsZS5wb3NpdGlvbiA9IFwicmVsYXRpdmVcIjtcbiAgICB9XG4gIH0sXG5cbiAgX2FkanVzdE9mZnNldEZyb21IZWxwZXI6IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICh0eXBlb2Ygb2JqID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBvYmogPSBvYmouc3BsaXQoXCIgXCIpO1xuICAgIH1cbiAgICBpZiAoJC5pc0FycmF5KG9iaikpIHtcbiAgICAgIG9iaiA9IHsgbGVmdDogK29ialswXSwgdG9wOiArb2JqWzFdIHx8IDAgfTtcbiAgICB9XG4gICAgaWYgKFwibGVmdFwiIGluIG9iaikge1xuICAgICAgdGhpcy5vZmZzZXQuY2xpY2subGVmdCA9IG9iai5sZWZ0ICsgdGhpcy5tYXJnaW5zLmxlZnQ7XG4gICAgfVxuICAgIGlmIChcInJpZ2h0XCIgaW4gb2JqKSB7XG4gICAgICB0aGlzLm9mZnNldC5jbGljay5sZWZ0ID0gdGhpcy5oZWxwZXJQcm9wb3J0aW9ucy53aWR0aCAtIG9iai5yaWdodCArIHRoaXMubWFyZ2lucy5sZWZ0O1xuICAgIH1cbiAgICBpZiAoXCJ0b3BcIiBpbiBvYmopIHtcbiAgICAgIHRoaXMub2Zmc2V0LmNsaWNrLnRvcCA9IG9iai50b3AgKyB0aGlzLm1hcmdpbnMudG9wO1xuICAgIH1cbiAgICBpZiAoXCJib3R0b21cIiBpbiBvYmopIHtcbiAgICAgIHRoaXMub2Zmc2V0LmNsaWNrLnRvcCA9IHRoaXMuaGVscGVyUHJvcG9ydGlvbnMuaGVpZ2h0IC0gb2JqLmJvdHRvbSArIHRoaXMubWFyZ2lucy50b3A7XG4gICAgfVxuICB9LFxuXG4gIF9pc1Jvb3ROb2RlOiBmdW5jdGlvbiggZWxlbWVudCApIHtcbiAgICByZXR1cm4gKCAvKGh0bWx8Ym9keSkvaSApLnRlc3QoIGVsZW1lbnQudGFnTmFtZSApIHx8IGVsZW1lbnQgPT09IHRoaXMuZG9jdW1lbnRbIDAgXTtcbiAgfSxcblxuICBfZ2V0UGFyZW50T2Zmc2V0OiBmdW5jdGlvbigpIHtcblxuICAgIC8vR2V0IHRoZSBvZmZzZXRQYXJlbnQgYW5kIGNhY2hlIGl0cyBwb3NpdGlvblxuICAgIHZhciBwbyA9IHRoaXMub2Zmc2V0UGFyZW50Lm9mZnNldCgpLFxuICAgICAgZG9jdW1lbnQgPSB0aGlzLmRvY3VtZW50WyAwIF07XG5cbiAgICAvLyBUaGlzIGlzIGEgc3BlY2lhbCBjYXNlIHdoZXJlIHdlIG5lZWQgdG8gbW9kaWZ5IGEgb2Zmc2V0IGNhbGN1bGF0ZWQgb24gc3RhcnQsIHNpbmNlIHRoZSBmb2xsb3dpbmcgaGFwcGVuZWQ6XG4gICAgLy8gMS4gVGhlIHBvc2l0aW9uIG9mIHRoZSBoZWxwZXIgaXMgYWJzb2x1dGUsIHNvIGl0J3MgcG9zaXRpb24gaXMgY2FsY3VsYXRlZCBiYXNlZCBvbiB0aGUgbmV4dCBwb3NpdGlvbmVkIHBhcmVudFxuICAgIC8vIDIuIFRoZSBhY3R1YWwgb2Zmc2V0IHBhcmVudCBpcyBhIGNoaWxkIG9mIHRoZSBzY3JvbGwgcGFyZW50LCBhbmQgdGhlIHNjcm9sbCBwYXJlbnQgaXNuJ3QgdGhlIGRvY3VtZW50LCB3aGljaCBtZWFucyB0aGF0XG4gICAgLy8gICAgdGhlIHNjcm9sbCBpcyBpbmNsdWRlZCBpbiB0aGUgaW5pdGlhbCBjYWxjdWxhdGlvbiBvZiB0aGUgb2Zmc2V0IG9mIHRoZSBwYXJlbnQsIGFuZCBuZXZlciByZWNhbGN1bGF0ZWQgdXBvbiBkcmFnXG4gICAgaWYgKHRoaXMuY3NzUG9zaXRpb24gPT09IFwiYWJzb2x1dGVcIiAmJiB0aGlzLnNjcm9sbFBhcmVudFswXSAhPT0gZG9jdW1lbnQgJiYgJC5jb250YWlucyh0aGlzLnNjcm9sbFBhcmVudFswXSwgdGhpcy5vZmZzZXRQYXJlbnRbMF0pKSB7XG4gICAgICBwby5sZWZ0ICs9IHRoaXMuc2Nyb2xsUGFyZW50LnNjcm9sbExlZnQoKTtcbiAgICAgIHBvLnRvcCArPSB0aGlzLnNjcm9sbFBhcmVudC5zY3JvbGxUb3AoKTtcbiAgICB9XG5cbiAgICBpZiAoIHRoaXMuX2lzUm9vdE5vZGUoIHRoaXMub2Zmc2V0UGFyZW50WyAwIF0gKSApIHtcbiAgICAgIHBvID0geyB0b3A6IDAsIGxlZnQ6IDAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdG9wOiBwby50b3AgKyAocGFyc2VJbnQodGhpcy5vZmZzZXRQYXJlbnQuY3NzKFwiYm9yZGVyVG9wV2lkdGhcIiksIDEwKSB8fCAwKSxcbiAgICAgIGxlZnQ6IHBvLmxlZnQgKyAocGFyc2VJbnQodGhpcy5vZmZzZXRQYXJlbnQuY3NzKFwiYm9yZGVyTGVmdFdpZHRoXCIpLCAxMCkgfHwgMClcbiAgICB9O1xuXG4gIH0sXG5cbiAgX2dldFJlbGF0aXZlT2Zmc2V0OiBmdW5jdGlvbigpIHtcbiAgICBpZiAoIHRoaXMuY3NzUG9zaXRpb24gIT09IFwicmVsYXRpdmVcIiApIHtcbiAgICAgIHJldHVybiB7IHRvcDogMCwgbGVmdDogMCB9O1xuICAgIH1cblxuICAgIHZhciBwID0gdGhpcy5lbGVtZW50LnBvc2l0aW9uKCksXG4gICAgICBzY3JvbGxJc1Jvb3ROb2RlID0gdGhpcy5faXNSb290Tm9kZSggdGhpcy5zY3JvbGxQYXJlbnRbIDAgXSApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRvcDogcC50b3AgLSAoIHBhcnNlSW50KHRoaXMuaGVscGVyLmNzcyggXCJ0b3BcIiApLCAxMCkgfHwgMCApICsgKCAhc2Nyb2xsSXNSb290Tm9kZSA/IHRoaXMuc2Nyb2xsUGFyZW50LnNjcm9sbFRvcCgpIDogMCApLFxuICAgICAgbGVmdDogcC5sZWZ0IC0gKCBwYXJzZUludCh0aGlzLmhlbHBlci5jc3MoIFwibGVmdFwiICksIDEwKSB8fCAwICkgKyAoICFzY3JvbGxJc1Jvb3ROb2RlID8gdGhpcy5zY3JvbGxQYXJlbnQuc2Nyb2xsTGVmdCgpIDogMCApXG4gICAgfTtcblxuICB9LFxuXG4gIF9jYWNoZU1hcmdpbnM6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubWFyZ2lucyA9IHtcbiAgICAgIGxlZnQ6IChwYXJzZUludCh0aGlzLmVsZW1lbnQuY3NzKFwibWFyZ2luTGVmdFwiKSwgMTApIHx8IDApLFxuICAgICAgdG9wOiAocGFyc2VJbnQodGhpcy5lbGVtZW50LmNzcyhcIm1hcmdpblRvcFwiKSwgMTApIHx8IDApLFxuICAgICAgcmlnaHQ6IChwYXJzZUludCh0aGlzLmVsZW1lbnQuY3NzKFwibWFyZ2luUmlnaHRcIiksIDEwKSB8fCAwKSxcbiAgICAgIGJvdHRvbTogKHBhcnNlSW50KHRoaXMuZWxlbWVudC5jc3MoXCJtYXJnaW5Cb3R0b21cIiksIDEwKSB8fCAwKVxuICAgIH07XG4gIH0sXG5cbiAgX2NhY2hlSGVscGVyUHJvcG9ydGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaGVscGVyUHJvcG9ydGlvbnMgPSB7XG4gICAgICB3aWR0aDogdGhpcy5oZWxwZXIub3V0ZXJXaWR0aCgpLFxuICAgICAgaGVpZ2h0OiB0aGlzLmhlbHBlci5vdXRlckhlaWdodCgpXG4gICAgfTtcbiAgfSxcblxuICBfc2V0Q29udGFpbm1lbnQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIGlzVXNlclNjcm9sbGFibGUsIGMsIGNlLFxuICAgICAgbyA9IHRoaXMub3B0aW9ucyxcbiAgICAgIGRvY3VtZW50ID0gdGhpcy5kb2N1bWVudFsgMCBdO1xuXG4gICAgdGhpcy5yZWxhdGl2ZUNvbnRhaW5lciA9IG51bGw7XG5cbiAgICBpZiAoICFvLmNvbnRhaW5tZW50ICkge1xuICAgICAgdGhpcy5jb250YWlubWVudCA9IG51bGw7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCBvLmNvbnRhaW5tZW50ID09PSBcIndpbmRvd1wiICkge1xuICAgICAgdGhpcy5jb250YWlubWVudCA9IFtcbiAgICAgICAgJCggd2luZG93ICkuc2Nyb2xsTGVmdCgpIC0gdGhpcy5vZmZzZXQucmVsYXRpdmUubGVmdCAtIHRoaXMub2Zmc2V0LnBhcmVudC5sZWZ0LFxuICAgICAgICAkKCB3aW5kb3cgKS5zY3JvbGxUb3AoKSAtIHRoaXMub2Zmc2V0LnJlbGF0aXZlLnRvcCAtIHRoaXMub2Zmc2V0LnBhcmVudC50b3AsXG4gICAgICAgICQoIHdpbmRvdyApLnNjcm9sbExlZnQoKSArICQoIHdpbmRvdyApLndpZHRoKCkgLSB0aGlzLmhlbHBlclByb3BvcnRpb25zLndpZHRoIC0gdGhpcy5tYXJnaW5zLmxlZnQsXG4gICAgICAgICQoIHdpbmRvdyApLnNjcm9sbFRvcCgpICsgKCAkKCB3aW5kb3cgKS5oZWlnaHQoKSB8fCBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUuc2Nyb2xsSGVpZ2h0ICkgLSB0aGlzLmhlbHBlclByb3BvcnRpb25zLmhlaWdodCAtIHRoaXMubWFyZ2lucy50b3BcbiAgICAgIF07XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCBvLmNvbnRhaW5tZW50ID09PSBcImRvY3VtZW50XCIpIHtcbiAgICAgIHRoaXMuY29udGFpbm1lbnQgPSBbXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgICQoIGRvY3VtZW50ICkud2lkdGgoKSAtIHRoaXMuaGVscGVyUHJvcG9ydGlvbnMud2lkdGggLSB0aGlzLm1hcmdpbnMubGVmdCxcbiAgICAgICAgKCAkKCBkb2N1bWVudCApLmhlaWdodCgpIHx8IGRvY3VtZW50LmJvZHkucGFyZW50Tm9kZS5zY3JvbGxIZWlnaHQgKSAtIHRoaXMuaGVscGVyUHJvcG9ydGlvbnMuaGVpZ2h0IC0gdGhpcy5tYXJnaW5zLnRvcFxuICAgICAgXTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIG8uY29udGFpbm1lbnQuY29uc3RydWN0b3IgPT09IEFycmF5ICkge1xuICAgICAgdGhpcy5jb250YWlubWVudCA9IG8uY29udGFpbm1lbnQ7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCBvLmNvbnRhaW5tZW50ID09PSBcInBhcmVudFwiICkge1xuICAgICAgby5jb250YWlubWVudCA9IHRoaXMuaGVscGVyWyAwIF0ucGFyZW50Tm9kZTtcbiAgICB9XG5cbiAgICBjID0gJCggby5jb250YWlubWVudCApO1xuICAgIGNlID0gY1sgMCBdO1xuXG4gICAgaWYgKCAhY2UgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaXNVc2VyU2Nyb2xsYWJsZSA9IC8oc2Nyb2xsfGF1dG8pLy50ZXN0KCBjLmNzcyggXCJvdmVyZmxvd1wiICkgKTtcblxuICAgIHRoaXMuY29udGFpbm1lbnQgPSBbXG4gICAgICAoIHBhcnNlSW50KCBjLmNzcyggXCJib3JkZXJMZWZ0V2lkdGhcIiApLCAxMCApIHx8IDAgKSArICggcGFyc2VJbnQoIGMuY3NzKCBcInBhZGRpbmdMZWZ0XCIgKSwgMTAgKSB8fCAwICksXG4gICAgICAoIHBhcnNlSW50KCBjLmNzcyggXCJib3JkZXJUb3BXaWR0aFwiICksIDEwICkgfHwgMCApICsgKCBwYXJzZUludCggYy5jc3MoIFwicGFkZGluZ1RvcFwiICksIDEwICkgfHwgMCApLFxuICAgICAgKCBpc1VzZXJTY3JvbGxhYmxlID8gTWF0aC5tYXgoIGNlLnNjcm9sbFdpZHRoLCBjZS5vZmZzZXRXaWR0aCApIDogY2Uub2Zmc2V0V2lkdGggKSAtXG4gICAgICAgICggcGFyc2VJbnQoIGMuY3NzKCBcImJvcmRlclJpZ2h0V2lkdGhcIiApLCAxMCApIHx8IDAgKSAtXG4gICAgICAgICggcGFyc2VJbnQoIGMuY3NzKCBcInBhZGRpbmdSaWdodFwiICksIDEwICkgfHwgMCApIC1cbiAgICAgICAgdGhpcy5oZWxwZXJQcm9wb3J0aW9ucy53aWR0aCAtXG4gICAgICAgIHRoaXMubWFyZ2lucy5sZWZ0IC1cbiAgICAgICAgdGhpcy5tYXJnaW5zLnJpZ2h0LFxuICAgICAgKCBpc1VzZXJTY3JvbGxhYmxlID8gTWF0aC5tYXgoIGNlLnNjcm9sbEhlaWdodCwgY2Uub2Zmc2V0SGVpZ2h0ICkgOiBjZS5vZmZzZXRIZWlnaHQgKSAtXG4gICAgICAgICggcGFyc2VJbnQoIGMuY3NzKCBcImJvcmRlckJvdHRvbVdpZHRoXCIgKSwgMTAgKSB8fCAwICkgLVxuICAgICAgICAoIHBhcnNlSW50KCBjLmNzcyggXCJwYWRkaW5nQm90dG9tXCIgKSwgMTAgKSB8fCAwICkgLVxuICAgICAgICB0aGlzLmhlbHBlclByb3BvcnRpb25zLmhlaWdodCAtXG4gICAgICAgIHRoaXMubWFyZ2lucy50b3AgLVxuICAgICAgICB0aGlzLm1hcmdpbnMuYm90dG9tXG4gICAgXTtcbiAgICB0aGlzLnJlbGF0aXZlQ29udGFpbmVyID0gYztcbiAgfSxcblxuICBfY29udmVydFBvc2l0aW9uVG86IGZ1bmN0aW9uKGQsIHBvcykge1xuXG4gICAgaWYgKCFwb3MpIHtcbiAgICAgIHBvcyA9IHRoaXMucG9zaXRpb247XG4gICAgfVxuXG4gICAgdmFyIG1vZCA9IGQgPT09IFwiYWJzb2x1dGVcIiA/IDEgOiAtMSxcbiAgICAgIHNjcm9sbElzUm9vdE5vZGUgPSB0aGlzLl9pc1Jvb3ROb2RlKCB0aGlzLnNjcm9sbFBhcmVudFsgMCBdICk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdG9wOiAoXG4gICAgICAgIHBvcy50b3AgKyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgYWJzb2x1dGUgbW91c2UgcG9zaXRpb25cbiAgICAgICAgdGhpcy5vZmZzZXQucmVsYXRpdmUudG9wICogbW9kICsgICAgICAgICAgICAgICAgICAgIC8vIE9ubHkgZm9yIHJlbGF0aXZlIHBvc2l0aW9uZWQgbm9kZXM6IFJlbGF0aXZlIG9mZnNldCBmcm9tIGVsZW1lbnQgdG8gb2Zmc2V0IHBhcmVudFxuICAgICAgICB0aGlzLm9mZnNldC5wYXJlbnQudG9wICogbW9kIC0gICAgICAgICAgICAgICAgICAgIC8vIFRoZSBvZmZzZXRQYXJlbnQncyBvZmZzZXQgd2l0aG91dCBib3JkZXJzIChvZmZzZXQgKyBib3JkZXIpXG4gICAgICAgICggKCB0aGlzLmNzc1Bvc2l0aW9uID09PSBcImZpeGVkXCIgPyAtdGhpcy5vZmZzZXQuc2Nyb2xsLnRvcCA6ICggc2Nyb2xsSXNSb290Tm9kZSA/IDAgOiB0aGlzLm9mZnNldC5zY3JvbGwudG9wICkgKSAqIG1vZClcbiAgICAgICksXG4gICAgICBsZWZ0OiAoXG4gICAgICAgIHBvcy5sZWZ0ICsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBhYnNvbHV0ZSBtb3VzZSBwb3NpdGlvblxuICAgICAgICB0aGlzLm9mZnNldC5yZWxhdGl2ZS5sZWZ0ICogbW9kICsgICAgICAgICAgICAgICAgICAgLy8gT25seSBmb3IgcmVsYXRpdmUgcG9zaXRpb25lZCBub2RlczogUmVsYXRpdmUgb2Zmc2V0IGZyb20gZWxlbWVudCB0byBvZmZzZXQgcGFyZW50XG4gICAgICAgIHRoaXMub2Zmc2V0LnBhcmVudC5sZWZ0ICogbW9kIC0gICAgICAgICAgICAgICAgICAgLy8gVGhlIG9mZnNldFBhcmVudCdzIG9mZnNldCB3aXRob3V0IGJvcmRlcnMgKG9mZnNldCArIGJvcmRlcilcbiAgICAgICAgKCAoIHRoaXMuY3NzUG9zaXRpb24gPT09IFwiZml4ZWRcIiA/IC10aGlzLm9mZnNldC5zY3JvbGwubGVmdCA6ICggc2Nyb2xsSXNSb290Tm9kZSA/IDAgOiB0aGlzLm9mZnNldC5zY3JvbGwubGVmdCApICkgKiBtb2QpXG4gICAgICApXG4gICAgfTtcblxuICB9LFxuXG4gIF9nZW5lcmF0ZVBvc2l0aW9uOiBmdW5jdGlvbiggZXZlbnQsIGNvbnN0cmFpblBvc2l0aW9uICkge1xuXG4gICAgdmFyIGNvbnRhaW5tZW50LCBjbywgdG9wLCBsZWZ0LFxuICAgICAgbyA9IHRoaXMub3B0aW9ucyxcbiAgICAgIHNjcm9sbElzUm9vdE5vZGUgPSB0aGlzLl9pc1Jvb3ROb2RlKCB0aGlzLnNjcm9sbFBhcmVudFsgMCBdICksXG4gICAgICBwYWdlWCA9IGV2ZW50LnBhZ2VYLFxuICAgICAgcGFnZVkgPSBldmVudC5wYWdlWTtcblxuICAgIC8vIENhY2hlIHRoZSBzY3JvbGxcbiAgICBpZiAoICFzY3JvbGxJc1Jvb3ROb2RlIHx8ICF0aGlzLm9mZnNldC5zY3JvbGwgKSB7XG4gICAgICB0aGlzLm9mZnNldC5zY3JvbGwgPSB7XG4gICAgICAgIHRvcDogdGhpcy5zY3JvbGxQYXJlbnQuc2Nyb2xsVG9wKCksXG4gICAgICAgIGxlZnQ6IHRoaXMuc2Nyb2xsUGFyZW50LnNjcm9sbExlZnQoKVxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIC0gUG9zaXRpb24gY29uc3RyYWluaW5nIC1cbiAgICAgKiBDb25zdHJhaW4gdGhlIHBvc2l0aW9uIHRvIGEgbWl4IG9mIGdyaWQsIGNvbnRhaW5tZW50LlxuICAgICAqL1xuXG4gICAgLy8gSWYgd2UgYXJlIG5vdCBkcmFnZ2luZyB5ZXQsIHdlIHdvbid0IGNoZWNrIGZvciBvcHRpb25zXG4gICAgaWYgKCBjb25zdHJhaW5Qb3NpdGlvbiApIHtcbiAgICAgIGlmICggdGhpcy5jb250YWlubWVudCApIHtcbiAgICAgICAgaWYgKCB0aGlzLnJlbGF0aXZlQ29udGFpbmVyICl7XG4gICAgICAgICAgY28gPSB0aGlzLnJlbGF0aXZlQ29udGFpbmVyLm9mZnNldCgpO1xuICAgICAgICAgIGNvbnRhaW5tZW50ID0gW1xuICAgICAgICAgICAgdGhpcy5jb250YWlubWVudFsgMCBdICsgY28ubGVmdCxcbiAgICAgICAgICAgIHRoaXMuY29udGFpbm1lbnRbIDEgXSArIGNvLnRvcCxcbiAgICAgICAgICAgIHRoaXMuY29udGFpbm1lbnRbIDIgXSArIGNvLmxlZnQsXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5tZW50WyAzIF0gKyBjby50b3BcbiAgICAgICAgICBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnRhaW5tZW50ID0gdGhpcy5jb250YWlubWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudC5wYWdlWCAtIHRoaXMub2Zmc2V0LmNsaWNrLmxlZnQgPCBjb250YWlubWVudFswXSkge1xuICAgICAgICAgIHBhZ2VYID0gY29udGFpbm1lbnRbMF0gKyB0aGlzLm9mZnNldC5jbGljay5sZWZ0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChldmVudC5wYWdlWSAtIHRoaXMub2Zmc2V0LmNsaWNrLnRvcCA8IGNvbnRhaW5tZW50WzFdKSB7XG4gICAgICAgICAgcGFnZVkgPSBjb250YWlubWVudFsxXSArIHRoaXMub2Zmc2V0LmNsaWNrLnRvcDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnQucGFnZVggLSB0aGlzLm9mZnNldC5jbGljay5sZWZ0ID4gY29udGFpbm1lbnRbMl0pIHtcbiAgICAgICAgICBwYWdlWCA9IGNvbnRhaW5tZW50WzJdICsgdGhpcy5vZmZzZXQuY2xpY2subGVmdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnQucGFnZVkgLSB0aGlzLm9mZnNldC5jbGljay50b3AgPiBjb250YWlubWVudFszXSkge1xuICAgICAgICAgIHBhZ2VZID0gY29udGFpbm1lbnRbM10gKyB0aGlzLm9mZnNldC5jbGljay50b3A7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG8uZ3JpZCkge1xuICAgICAgICAvL0NoZWNrIGZvciBncmlkIGVsZW1lbnRzIHNldCB0byAwIHRvIHByZXZlbnQgZGl2aWRlIGJ5IDAgZXJyb3IgY2F1c2luZyBpbnZhbGlkIGFyZ3VtZW50IGVycm9ycyBpbiBJRSAoc2VlIHRpY2tldCAjNjk1MClcbiAgICAgICAgdG9wID0gby5ncmlkWzFdID8gdGhpcy5vcmlnaW5hbFBhZ2VZICsgTWF0aC5yb3VuZCgocGFnZVkgLSB0aGlzLm9yaWdpbmFsUGFnZVkpIC8gby5ncmlkWzFdKSAqIG8uZ3JpZFsxXSA6IHRoaXMub3JpZ2luYWxQYWdlWTtcbiAgICAgICAgcGFnZVkgPSBjb250YWlubWVudCA/ICgodG9wIC0gdGhpcy5vZmZzZXQuY2xpY2sudG9wID49IGNvbnRhaW5tZW50WzFdIHx8IHRvcCAtIHRoaXMub2Zmc2V0LmNsaWNrLnRvcCA+IGNvbnRhaW5tZW50WzNdKSA/IHRvcCA6ICgodG9wIC0gdGhpcy5vZmZzZXQuY2xpY2sudG9wID49IGNvbnRhaW5tZW50WzFdKSA/IHRvcCAtIG8uZ3JpZFsxXSA6IHRvcCArIG8uZ3JpZFsxXSkpIDogdG9wO1xuXG4gICAgICAgIGxlZnQgPSBvLmdyaWRbMF0gPyB0aGlzLm9yaWdpbmFsUGFnZVggKyBNYXRoLnJvdW5kKChwYWdlWCAtIHRoaXMub3JpZ2luYWxQYWdlWCkgLyBvLmdyaWRbMF0pICogby5ncmlkWzBdIDogdGhpcy5vcmlnaW5hbFBhZ2VYO1xuICAgICAgICBwYWdlWCA9IGNvbnRhaW5tZW50ID8gKChsZWZ0IC0gdGhpcy5vZmZzZXQuY2xpY2subGVmdCA+PSBjb250YWlubWVudFswXSB8fCBsZWZ0IC0gdGhpcy5vZmZzZXQuY2xpY2subGVmdCA+IGNvbnRhaW5tZW50WzJdKSA/IGxlZnQgOiAoKGxlZnQgLSB0aGlzLm9mZnNldC5jbGljay5sZWZ0ID49IGNvbnRhaW5tZW50WzBdKSA/IGxlZnQgLSBvLmdyaWRbMF0gOiBsZWZ0ICsgby5ncmlkWzBdKSkgOiBsZWZ0O1xuICAgICAgfVxuXG4gICAgICBpZiAoIG8uYXhpcyA9PT0gXCJ5XCIgKSB7XG4gICAgICAgIHBhZ2VYID0gdGhpcy5vcmlnaW5hbFBhZ2VYO1xuICAgICAgfVxuXG4gICAgICBpZiAoIG8uYXhpcyA9PT0gXCJ4XCIgKSB7XG4gICAgICAgIHBhZ2VZID0gdGhpcy5vcmlnaW5hbFBhZ2VZO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB0b3A6IChcbiAgICAgICAgcGFnZVkgLSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBhYnNvbHV0ZSBtb3VzZSBwb3NpdGlvblxuICAgICAgICB0aGlzLm9mZnNldC5jbGljay50b3AgLSAgICAgICAgICAgICAgICAgICAgICAgLy8gQ2xpY2sgb2Zmc2V0IChyZWxhdGl2ZSB0byB0aGUgZWxlbWVudClcbiAgICAgICAgdGhpcy5vZmZzZXQucmVsYXRpdmUudG9wIC0gICAgICAgICAgICAgICAgICAgICAgICAvLyBPbmx5IGZvciByZWxhdGl2ZSBwb3NpdGlvbmVkIG5vZGVzOiBSZWxhdGl2ZSBvZmZzZXQgZnJvbSBlbGVtZW50IHRvIG9mZnNldCBwYXJlbnRcbiAgICAgICAgdGhpcy5vZmZzZXQucGFyZW50LnRvcCArICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIG9mZnNldFBhcmVudCdzIG9mZnNldCB3aXRob3V0IGJvcmRlcnMgKG9mZnNldCArIGJvcmRlcilcbiAgICAgICAgKCB0aGlzLmNzc1Bvc2l0aW9uID09PSBcImZpeGVkXCIgPyAtdGhpcy5vZmZzZXQuc2Nyb2xsLnRvcCA6ICggc2Nyb2xsSXNSb290Tm9kZSA/IDAgOiB0aGlzLm9mZnNldC5zY3JvbGwudG9wICkgKVxuICAgICAgKSxcbiAgICAgIGxlZnQ6IChcbiAgICAgICAgcGFnZVggLSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBhYnNvbHV0ZSBtb3VzZSBwb3NpdGlvblxuICAgICAgICB0aGlzLm9mZnNldC5jbGljay5sZWZ0IC0gICAgICAgICAgICAgICAgICAgICAgICAvLyBDbGljayBvZmZzZXQgKHJlbGF0aXZlIHRvIHRoZSBlbGVtZW50KVxuICAgICAgICB0aGlzLm9mZnNldC5yZWxhdGl2ZS5sZWZ0IC0gICAgICAgICAgICAgICAgICAgICAgIC8vIE9ubHkgZm9yIHJlbGF0aXZlIHBvc2l0aW9uZWQgbm9kZXM6IFJlbGF0aXZlIG9mZnNldCBmcm9tIGVsZW1lbnQgdG8gb2Zmc2V0IHBhcmVudFxuICAgICAgICB0aGlzLm9mZnNldC5wYXJlbnQubGVmdCArICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgb2Zmc2V0UGFyZW50J3Mgb2Zmc2V0IHdpdGhvdXQgYm9yZGVycyAob2Zmc2V0ICsgYm9yZGVyKVxuICAgICAgICAoIHRoaXMuY3NzUG9zaXRpb24gPT09IFwiZml4ZWRcIiA/IC10aGlzLm9mZnNldC5zY3JvbGwubGVmdCA6ICggc2Nyb2xsSXNSb290Tm9kZSA/IDAgOiB0aGlzLm9mZnNldC5zY3JvbGwubGVmdCApIClcbiAgICAgIClcbiAgICB9O1xuXG4gIH0sXG5cbiAgX2NsZWFyOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmhlbHBlci5yZW1vdmVDbGFzcyhcInVpLWRyYWdnYWJsZS1kcmFnZ2luZ1wiKTtcbiAgICBpZiAodGhpcy5oZWxwZXJbMF0gIT09IHRoaXMuZWxlbWVudFswXSAmJiAhdGhpcy5jYW5jZWxIZWxwZXJSZW1vdmFsKSB7XG4gICAgICB0aGlzLmhlbHBlci5yZW1vdmUoKTtcbiAgICB9XG4gICAgdGhpcy5oZWxwZXIgPSBudWxsO1xuICAgIHRoaXMuY2FuY2VsSGVscGVyUmVtb3ZhbCA9IGZhbHNlO1xuICAgIGlmICggdGhpcy5kZXN0cm95T25DbGVhciApIHtcbiAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgIH1cbiAgfSxcblxuICBfbm9ybWFsaXplUmlnaHRCb3R0b206IGZ1bmN0aW9uKCkge1xuICAgIGlmICggdGhpcy5vcHRpb25zLmF4aXMgIT09IFwieVwiICYmIHRoaXMuaGVscGVyLmNzcyggXCJyaWdodFwiICkgIT09IFwiYXV0b1wiICkge1xuICAgICAgdGhpcy5oZWxwZXIud2lkdGgoIHRoaXMuaGVscGVyLndpZHRoKCkgKTtcbiAgICAgIHRoaXMuaGVscGVyLmNzcyggXCJyaWdodFwiLCBcImF1dG9cIiApO1xuICAgIH1cbiAgICBpZiAoIHRoaXMub3B0aW9ucy5heGlzICE9PSBcInhcIiAmJiB0aGlzLmhlbHBlci5jc3MoIFwiYm90dG9tXCIgKSAhPT0gXCJhdXRvXCIgKSB7XG4gICAgICB0aGlzLmhlbHBlci5oZWlnaHQoIHRoaXMuaGVscGVyLmhlaWdodCgpICk7XG4gICAgICB0aGlzLmhlbHBlci5jc3MoIFwiYm90dG9tXCIsIFwiYXV0b1wiICk7XG4gICAgfVxuICB9LFxuXG4gIC8vIEZyb20gbm93IG9uIGJ1bGsgc3R1ZmYgLSBtYWlubHkgaGVscGVyc1xuXG4gIF90cmlnZ2VyOiBmdW5jdGlvbiggdHlwZSwgZXZlbnQsIHVpICkge1xuICAgIHVpID0gdWkgfHwgdGhpcy5fdWlIYXNoKCk7XG4gICAgJC51aS5wbHVnaW4uY2FsbCggdGhpcywgdHlwZSwgWyBldmVudCwgdWksIHRoaXMgXSwgdHJ1ZSApO1xuXG4gICAgLy8gQWJzb2x1dGUgcG9zaXRpb24gYW5kIG9mZnNldCAoc2VlICM2ODg0ICkgaGF2ZSB0byBiZSByZWNhbGN1bGF0ZWQgYWZ0ZXIgcGx1Z2luc1xuICAgIGlmICggL14oZHJhZ3xzdGFydHxzdG9wKS8udGVzdCggdHlwZSApICkge1xuICAgICAgdGhpcy5wb3NpdGlvbkFicyA9IHRoaXMuX2NvbnZlcnRQb3NpdGlvblRvKCBcImFic29sdXRlXCIgKTtcbiAgICAgIHVpLm9mZnNldCA9IHRoaXMucG9zaXRpb25BYnM7XG4gICAgfVxuICAgIHJldHVybiAkLldpZGdldC5wcm90b3R5cGUuX3RyaWdnZXIuY2FsbCggdGhpcywgdHlwZSwgZXZlbnQsIHVpICk7XG4gIH0sXG5cbiAgcGx1Z2luczoge30sXG5cbiAgX3VpSGFzaDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlbHBlcjogdGhpcy5oZWxwZXIsXG4gICAgICBwb3NpdGlvbjogdGhpcy5wb3NpdGlvbixcbiAgICAgIG9yaWdpbmFsUG9zaXRpb246IHRoaXMub3JpZ2luYWxQb3NpdGlvbixcbiAgICAgIG9mZnNldDogdGhpcy5wb3NpdGlvbkFic1xuICAgIH07XG4gIH1cblxufSk7XG5cbiQudWkucGx1Z2luLmFkZCggXCJkcmFnZ2FibGVcIiwgXCJjb25uZWN0VG9Tb3J0YWJsZVwiLCB7XG4gIHN0YXJ0OiBmdW5jdGlvbiggZXZlbnQsIHVpLCBkcmFnZ2FibGUgKSB7XG4gICAgdmFyIHVpU29ydGFibGUgPSAkLmV4dGVuZCgge30sIHVpLCB7XG4gICAgICBpdGVtOiBkcmFnZ2FibGUuZWxlbWVudFxuICAgIH0pO1xuXG4gICAgZHJhZ2dhYmxlLnNvcnRhYmxlcyA9IFtdO1xuICAgICQoIGRyYWdnYWJsZS5vcHRpb25zLmNvbm5lY3RUb1NvcnRhYmxlICkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzb3J0YWJsZSA9ICQoIHRoaXMgKS5zb3J0YWJsZSggXCJpbnN0YW5jZVwiICk7XG5cbiAgICAgIGlmICggc29ydGFibGUgJiYgIXNvcnRhYmxlLm9wdGlvbnMuZGlzYWJsZWQgKSB7XG4gICAgICAgIGRyYWdnYWJsZS5zb3J0YWJsZXMucHVzaCggc29ydGFibGUgKTtcblxuICAgICAgICAvLyByZWZyZXNoUG9zaXRpb25zIGlzIGNhbGxlZCBhdCBkcmFnIHN0YXJ0IHRvIHJlZnJlc2ggdGhlIGNvbnRhaW5lckNhY2hlXG4gICAgICAgIC8vIHdoaWNoIGlzIHVzZWQgaW4gZHJhZy4gVGhpcyBlbnN1cmVzIGl0J3MgaW5pdGlhbGl6ZWQgYW5kIHN5bmNocm9uaXplZFxuICAgICAgICAvLyB3aXRoIGFueSBjaGFuZ2VzIHRoYXQgbWlnaHQgaGF2ZSBoYXBwZW5lZCBvbiB0aGUgcGFnZSBzaW5jZSBpbml0aWFsaXphdGlvbi5cbiAgICAgICAgc29ydGFibGUucmVmcmVzaFBvc2l0aW9ucygpO1xuICAgICAgICBzb3J0YWJsZS5fdHJpZ2dlcihcImFjdGl2YXRlXCIsIGV2ZW50LCB1aVNvcnRhYmxlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgc3RvcDogZnVuY3Rpb24oIGV2ZW50LCB1aSwgZHJhZ2dhYmxlICkge1xuICAgIHZhciB1aVNvcnRhYmxlID0gJC5leHRlbmQoIHt9LCB1aSwge1xuICAgICAgaXRlbTogZHJhZ2dhYmxlLmVsZW1lbnRcbiAgICB9KTtcblxuICAgIGRyYWdnYWJsZS5jYW5jZWxIZWxwZXJSZW1vdmFsID0gZmFsc2U7XG5cbiAgICAkLmVhY2goIGRyYWdnYWJsZS5zb3J0YWJsZXMsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNvcnRhYmxlID0gdGhpcztcblxuICAgICAgaWYgKCBzb3J0YWJsZS5pc092ZXIgKSB7XG4gICAgICAgIHNvcnRhYmxlLmlzT3ZlciA9IDA7XG5cbiAgICAgICAgLy8gQWxsb3cgdGhpcyBzb3J0YWJsZSB0byBoYW5kbGUgcmVtb3ZpbmcgdGhlIGhlbHBlclxuICAgICAgICBkcmFnZ2FibGUuY2FuY2VsSGVscGVyUmVtb3ZhbCA9IHRydWU7XG4gICAgICAgIHNvcnRhYmxlLmNhbmNlbEhlbHBlclJlbW92YWwgPSBmYWxzZTtcblxuICAgICAgICAvLyBVc2UgX3N0b3JlZENTUyBUbyByZXN0b3JlIHByb3BlcnRpZXMgaW4gdGhlIHNvcnRhYmxlLFxuICAgICAgICAvLyBhcyB0aGlzIGFsc28gaGFuZGxlcyByZXZlcnQgKCM5Njc1KSBzaW5jZSB0aGUgZHJhZ2dhYmxlXG4gICAgICAgIC8vIG1heSBoYXZlIG1vZGlmaWVkIHRoZW0gaW4gdW5leHBlY3RlZCB3YXlzICgjODgwOSlcbiAgICAgICAgc29ydGFibGUuX3N0b3JlZENTUyA9IHtcbiAgICAgICAgICBwb3NpdGlvbjogc29ydGFibGUucGxhY2Vob2xkZXIuY3NzKCBcInBvc2l0aW9uXCIgKSxcbiAgICAgICAgICB0b3A6IHNvcnRhYmxlLnBsYWNlaG9sZGVyLmNzcyggXCJ0b3BcIiApLFxuICAgICAgICAgIGxlZnQ6IHNvcnRhYmxlLnBsYWNlaG9sZGVyLmNzcyggXCJsZWZ0XCIgKVxuICAgICAgICB9O1xuXG4gICAgICAgIHNvcnRhYmxlLl9tb3VzZVN0b3AoZXZlbnQpO1xuXG4gICAgICAgIC8vIE9uY2UgZHJhZyBoYXMgZW5kZWQsIHRoZSBzb3J0YWJsZSBzaG91bGQgcmV0dXJuIHRvIHVzaW5nXG4gICAgICAgIC8vIGl0cyBvcmlnaW5hbCBoZWxwZXIsIG5vdCB0aGUgc2hhcmVkIGhlbHBlciBmcm9tIGRyYWdnYWJsZVxuICAgICAgICBzb3J0YWJsZS5vcHRpb25zLmhlbHBlciA9IHNvcnRhYmxlLm9wdGlvbnMuX2hlbHBlcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFByZXZlbnQgdGhpcyBTb3J0YWJsZSBmcm9tIHJlbW92aW5nIHRoZSBoZWxwZXIuXG4gICAgICAgIC8vIEhvd2V2ZXIsIGRvbid0IHNldCB0aGUgZHJhZ2dhYmxlIHRvIHJlbW92ZSB0aGUgaGVscGVyXG4gICAgICAgIC8vIGVpdGhlciBhcyBhbm90aGVyIGNvbm5lY3RlZCBTb3J0YWJsZSBtYXkgeWV0IGhhbmRsZSB0aGUgcmVtb3ZhbC5cbiAgICAgICAgc29ydGFibGUuY2FuY2VsSGVscGVyUmVtb3ZhbCA9IHRydWU7XG5cbiAgICAgICAgc29ydGFibGUuX3RyaWdnZXIoIFwiZGVhY3RpdmF0ZVwiLCBldmVudCwgdWlTb3J0YWJsZSApO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBkcmFnOiBmdW5jdGlvbiggZXZlbnQsIHVpLCBkcmFnZ2FibGUgKSB7XG4gICAgJC5lYWNoKCBkcmFnZ2FibGUuc29ydGFibGVzLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpbm5lcm1vc3RJbnRlcnNlY3RpbmcgPSBmYWxzZSxcbiAgICAgICAgc29ydGFibGUgPSB0aGlzO1xuXG4gICAgICAvLyBDb3B5IG92ZXIgdmFyaWFibGVzIHRoYXQgc29ydGFibGUncyBfaW50ZXJzZWN0c1dpdGggdXNlc1xuICAgICAgc29ydGFibGUucG9zaXRpb25BYnMgPSBkcmFnZ2FibGUucG9zaXRpb25BYnM7XG4gICAgICBzb3J0YWJsZS5oZWxwZXJQcm9wb3J0aW9ucyA9IGRyYWdnYWJsZS5oZWxwZXJQcm9wb3J0aW9ucztcbiAgICAgIHNvcnRhYmxlLm9mZnNldC5jbGljayA9IGRyYWdnYWJsZS5vZmZzZXQuY2xpY2s7XG5cbiAgICAgIGlmICggc29ydGFibGUuX2ludGVyc2VjdHNXaXRoKCBzb3J0YWJsZS5jb250YWluZXJDYWNoZSApICkge1xuICAgICAgICBpbm5lcm1vc3RJbnRlcnNlY3RpbmcgPSB0cnVlO1xuXG4gICAgICAgICQuZWFjaCggZHJhZ2dhYmxlLnNvcnRhYmxlcywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgLy8gQ29weSBvdmVyIHZhcmlhYmxlcyB0aGF0IHNvcnRhYmxlJ3MgX2ludGVyc2VjdHNXaXRoIHVzZXNcbiAgICAgICAgICB0aGlzLnBvc2l0aW9uQWJzID0gZHJhZ2dhYmxlLnBvc2l0aW9uQWJzO1xuICAgICAgICAgIHRoaXMuaGVscGVyUHJvcG9ydGlvbnMgPSBkcmFnZ2FibGUuaGVscGVyUHJvcG9ydGlvbnM7XG4gICAgICAgICAgdGhpcy5vZmZzZXQuY2xpY2sgPSBkcmFnZ2FibGUub2Zmc2V0LmNsaWNrO1xuXG4gICAgICAgICAgaWYgKCB0aGlzICE9PSBzb3J0YWJsZSAmJlxuICAgICAgICAgICAgICB0aGlzLl9pbnRlcnNlY3RzV2l0aCggdGhpcy5jb250YWluZXJDYWNoZSApICYmXG4gICAgICAgICAgICAgICQuY29udGFpbnMoIHNvcnRhYmxlLmVsZW1lbnRbIDAgXSwgdGhpcy5lbGVtZW50WyAwIF0gKSApIHtcbiAgICAgICAgICAgIGlubmVybW9zdEludGVyc2VjdGluZyA9IGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBpbm5lcm1vc3RJbnRlcnNlY3Rpbmc7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoIGlubmVybW9zdEludGVyc2VjdGluZyApIHtcbiAgICAgICAgLy8gSWYgaXQgaW50ZXJzZWN0cywgd2UgdXNlIGEgbGl0dGxlIGlzT3ZlciB2YXJpYWJsZSBhbmQgc2V0IGl0IG9uY2UsXG4gICAgICAgIC8vIHNvIHRoYXQgdGhlIG1vdmUtaW4gc3R1ZmYgZ2V0cyBmaXJlZCBvbmx5IG9uY2UuXG4gICAgICAgIGlmICggIXNvcnRhYmxlLmlzT3ZlciApIHtcbiAgICAgICAgICBzb3J0YWJsZS5pc092ZXIgPSAxO1xuXG4gICAgICAgICAgc29ydGFibGUuY3VycmVudEl0ZW0gPSB1aS5oZWxwZXJcbiAgICAgICAgICAgIC5hcHBlbmRUbyggc29ydGFibGUuZWxlbWVudCApXG4gICAgICAgICAgICAuZGF0YSggXCJ1aS1zb3J0YWJsZS1pdGVtXCIsIHRydWUgKTtcblxuICAgICAgICAgIC8vIFN0b3JlIGhlbHBlciBvcHRpb24gdG8gbGF0ZXIgcmVzdG9yZSBpdFxuICAgICAgICAgIHNvcnRhYmxlLm9wdGlvbnMuX2hlbHBlciA9IHNvcnRhYmxlLm9wdGlvbnMuaGVscGVyO1xuXG4gICAgICAgICAgc29ydGFibGUub3B0aW9ucy5oZWxwZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB1aS5oZWxwZXJbIDAgXTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgLy8gRmlyZSB0aGUgc3RhcnQgZXZlbnRzIG9mIHRoZSBzb3J0YWJsZSB3aXRoIG91ciBwYXNzZWQgYnJvd3NlciBldmVudCxcbiAgICAgICAgICAvLyBhbmQgb3VyIG93biBoZWxwZXIgKHNvIGl0IGRvZXNuJ3QgY3JlYXRlIGEgbmV3IG9uZSlcbiAgICAgICAgICBldmVudC50YXJnZXQgPSBzb3J0YWJsZS5jdXJyZW50SXRlbVsgMCBdO1xuICAgICAgICAgIHNvcnRhYmxlLl9tb3VzZUNhcHR1cmUoIGV2ZW50LCB0cnVlICk7XG4gICAgICAgICAgc29ydGFibGUuX21vdXNlU3RhcnQoIGV2ZW50LCB0cnVlLCB0cnVlICk7XG5cbiAgICAgICAgICAvLyBCZWNhdXNlIHRoZSBicm93c2VyIGV2ZW50IGlzIHdheSBvZmYgdGhlIG5ldyBhcHBlbmRlZCBwb3J0bGV0LFxuICAgICAgICAgIC8vIG1vZGlmeSBuZWNlc3NhcnkgdmFyaWFibGVzIHRvIHJlZmxlY3QgdGhlIGNoYW5nZXNcbiAgICAgICAgICBzb3J0YWJsZS5vZmZzZXQuY2xpY2sudG9wID0gZHJhZ2dhYmxlLm9mZnNldC5jbGljay50b3A7XG4gICAgICAgICAgc29ydGFibGUub2Zmc2V0LmNsaWNrLmxlZnQgPSBkcmFnZ2FibGUub2Zmc2V0LmNsaWNrLmxlZnQ7XG4gICAgICAgICAgc29ydGFibGUub2Zmc2V0LnBhcmVudC5sZWZ0IC09IGRyYWdnYWJsZS5vZmZzZXQucGFyZW50LmxlZnQgLVxuICAgICAgICAgICAgc29ydGFibGUub2Zmc2V0LnBhcmVudC5sZWZ0O1xuICAgICAgICAgIHNvcnRhYmxlLm9mZnNldC5wYXJlbnQudG9wIC09IGRyYWdnYWJsZS5vZmZzZXQucGFyZW50LnRvcCAtXG4gICAgICAgICAgICBzb3J0YWJsZS5vZmZzZXQucGFyZW50LnRvcDtcblxuICAgICAgICAgIGRyYWdnYWJsZS5fdHJpZ2dlciggXCJ0b1NvcnRhYmxlXCIsIGV2ZW50ICk7XG5cbiAgICAgICAgICAvLyBJbmZvcm0gZHJhZ2dhYmxlIHRoYXQgdGhlIGhlbHBlciBpcyBpbiBhIHZhbGlkIGRyb3Agem9uZSxcbiAgICAgICAgICAvLyB1c2VkIHNvbGVseSBpbiB0aGUgcmV2ZXJ0IG9wdGlvbiB0byBoYW5kbGUgXCJ2YWxpZC9pbnZhbGlkXCIuXG4gICAgICAgICAgZHJhZ2dhYmxlLmRyb3BwZWQgPSBzb3J0YWJsZS5lbGVtZW50O1xuXG4gICAgICAgICAgLy8gTmVlZCB0byByZWZyZXNoUG9zaXRpb25zIG9mIGFsbCBzb3J0YWJsZXMgaW4gdGhlIGNhc2UgdGhhdFxuICAgICAgICAgIC8vIGFkZGluZyB0byBvbmUgc29ydGFibGUgY2hhbmdlcyB0aGUgbG9jYXRpb24gb2YgdGhlIG90aGVyIHNvcnRhYmxlcyAoIzk2NzUpXG4gICAgICAgICAgJC5lYWNoKCBkcmFnZ2FibGUuc29ydGFibGVzLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFBvc2l0aW9ucygpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gaGFjayBzbyByZWNlaXZlL3VwZGF0ZSBjYWxsYmFja3Mgd29yayAobW9zdGx5KVxuICAgICAgICAgIGRyYWdnYWJsZS5jdXJyZW50SXRlbSA9IGRyYWdnYWJsZS5lbGVtZW50O1xuICAgICAgICAgIHNvcnRhYmxlLmZyb21PdXRzaWRlID0gZHJhZ2dhYmxlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBzb3J0YWJsZS5jdXJyZW50SXRlbSApIHtcbiAgICAgICAgICBzb3J0YWJsZS5fbW91c2VEcmFnKCBldmVudCApO1xuICAgICAgICAgIC8vIENvcHkgdGhlIHNvcnRhYmxlJ3MgcG9zaXRpb24gYmVjYXVzZSB0aGUgZHJhZ2dhYmxlJ3MgY2FuIHBvdGVudGlhbGx5IHJlZmxlY3RcbiAgICAgICAgICAvLyBhIHJlbGF0aXZlIHBvc2l0aW9uLCB3aGlsZSBzb3J0YWJsZSBpcyBhbHdheXMgYWJzb2x1dGUsIHdoaWNoIHRoZSBkcmFnZ2VkXG4gICAgICAgICAgLy8gZWxlbWVudCBoYXMgbm93IGJlY29tZS4gKCM4ODA5KVxuICAgICAgICAgIHVpLnBvc2l0aW9uID0gc29ydGFibGUucG9zaXRpb247XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIElmIGl0IGRvZXNuJ3QgaW50ZXJzZWN0IHdpdGggdGhlIHNvcnRhYmxlLCBhbmQgaXQgaW50ZXJzZWN0ZWQgYmVmb3JlLFxuICAgICAgICAvLyB3ZSBmYWtlIHRoZSBkcmFnIHN0b3Agb2YgdGhlIHNvcnRhYmxlLCBidXQgbWFrZSBzdXJlIGl0IGRvZXNuJ3QgcmVtb3ZlXG4gICAgICAgIC8vIHRoZSBoZWxwZXIgYnkgdXNpbmcgY2FuY2VsSGVscGVyUmVtb3ZhbC5cbiAgICAgICAgaWYgKCBzb3J0YWJsZS5pc092ZXIgKSB7XG5cbiAgICAgICAgICBzb3J0YWJsZS5pc092ZXIgPSAwO1xuICAgICAgICAgIHNvcnRhYmxlLmNhbmNlbEhlbHBlclJlbW92YWwgPSB0cnVlO1xuXG4gICAgICAgICAgLy8gQ2FsbGluZyBzb3J0YWJsZSdzIG1vdXNlU3RvcCB3b3VsZCB0cmlnZ2VyIGEgcmV2ZXJ0LFxuICAgICAgICAgIC8vIHNvIHJldmVydCBtdXN0IGJlIHRlbXBvcmFyaWx5IGZhbHNlIHVudGlsIGFmdGVyIG1vdXNlU3RvcCBpcyBjYWxsZWQuXG4gICAgICAgICAgc29ydGFibGUub3B0aW9ucy5fcmV2ZXJ0ID0gc29ydGFibGUub3B0aW9ucy5yZXZlcnQ7XG4gICAgICAgICAgc29ydGFibGUub3B0aW9ucy5yZXZlcnQgPSBmYWxzZTtcblxuICAgICAgICAgIHNvcnRhYmxlLl90cmlnZ2VyKCBcIm91dFwiLCBldmVudCwgc29ydGFibGUuX3VpSGFzaCggc29ydGFibGUgKSApO1xuICAgICAgICAgIHNvcnRhYmxlLl9tb3VzZVN0b3AoIGV2ZW50LCB0cnVlICk7XG5cbiAgICAgICAgICAvLyByZXN0b3JlIHNvcnRhYmxlIGJlaGF2aW9ycyB0aGF0IHdlcmUgbW9kZmllZFxuICAgICAgICAgIC8vIHdoZW4gdGhlIGRyYWdnYWJsZSBlbnRlcmVkIHRoZSBzb3J0YWJsZSBhcmVhICgjOTQ4MSlcbiAgICAgICAgICBzb3J0YWJsZS5vcHRpb25zLnJldmVydCA9IHNvcnRhYmxlLm9wdGlvbnMuX3JldmVydDtcbiAgICAgICAgICBzb3J0YWJsZS5vcHRpb25zLmhlbHBlciA9IHNvcnRhYmxlLm9wdGlvbnMuX2hlbHBlcjtcblxuICAgICAgICAgIGlmICggc29ydGFibGUucGxhY2Vob2xkZXIgKSB7XG4gICAgICAgICAgICBzb3J0YWJsZS5wbGFjZWhvbGRlci5yZW1vdmUoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBSZWNhbGN1bGF0ZSB0aGUgZHJhZ2dhYmxlJ3Mgb2Zmc2V0IGNvbnNpZGVyaW5nIHRoZSBzb3J0YWJsZVxuICAgICAgICAgIC8vIG1heSBoYXZlIG1vZGlmaWVkIHRoZW0gaW4gdW5leHBlY3RlZCB3YXlzICgjODgwOSlcbiAgICAgICAgICBkcmFnZ2FibGUuX3JlZnJlc2hPZmZzZXRzKCBldmVudCApO1xuICAgICAgICAgIHVpLnBvc2l0aW9uID0gZHJhZ2dhYmxlLl9nZW5lcmF0ZVBvc2l0aW9uKCBldmVudCwgdHJ1ZSApO1xuXG4gICAgICAgICAgZHJhZ2dhYmxlLl90cmlnZ2VyKCBcImZyb21Tb3J0YWJsZVwiLCBldmVudCApO1xuXG4gICAgICAgICAgLy8gSW5mb3JtIGRyYWdnYWJsZSB0aGF0IHRoZSBoZWxwZXIgaXMgbm8gbG9uZ2VyIGluIGEgdmFsaWQgZHJvcCB6b25lXG4gICAgICAgICAgZHJhZ2dhYmxlLmRyb3BwZWQgPSBmYWxzZTtcblxuICAgICAgICAgIC8vIE5lZWQgdG8gcmVmcmVzaFBvc2l0aW9ucyBvZiBhbGwgc29ydGFibGVzIGp1c3QgaW4gY2FzZSByZW1vdmluZ1xuICAgICAgICAgIC8vIGZyb20gb25lIHNvcnRhYmxlIGNoYW5nZXMgdGhlIGxvY2F0aW9uIG9mIG90aGVyIHNvcnRhYmxlcyAoIzk2NzUpXG4gICAgICAgICAgJC5lYWNoKCBkcmFnZ2FibGUuc29ydGFibGVzLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaFBvc2l0aW9ucygpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn0pO1xuXG4kLnVpLnBsdWdpbi5hZGQoXCJkcmFnZ2FibGVcIiwgXCJjdXJzb3JcIiwge1xuICBzdGFydDogZnVuY3Rpb24oIGV2ZW50LCB1aSwgaW5zdGFuY2UgKSB7XG4gICAgdmFyIHQgPSAkKCBcImJvZHlcIiApLFxuICAgICAgbyA9IGluc3RhbmNlLm9wdGlvbnM7XG5cbiAgICBpZiAodC5jc3MoXCJjdXJzb3JcIikpIHtcbiAgICAgIG8uX2N1cnNvciA9IHQuY3NzKFwiY3Vyc29yXCIpO1xuICAgIH1cbiAgICB0LmNzcyhcImN1cnNvclwiLCBvLmN1cnNvcik7XG4gIH0sXG4gIHN0b3A6IGZ1bmN0aW9uKCBldmVudCwgdWksIGluc3RhbmNlICkge1xuICAgIHZhciBvID0gaW5zdGFuY2Uub3B0aW9ucztcbiAgICBpZiAoby5fY3Vyc29yKSB7XG4gICAgICAkKFwiYm9keVwiKS5jc3MoXCJjdXJzb3JcIiwgby5fY3Vyc29yKTtcbiAgICB9XG4gIH1cbn0pO1xuXG4kLnVpLnBsdWdpbi5hZGQoXCJkcmFnZ2FibGVcIiwgXCJvcGFjaXR5XCIsIHtcbiAgc3RhcnQ6IGZ1bmN0aW9uKCBldmVudCwgdWksIGluc3RhbmNlICkge1xuICAgIHZhciB0ID0gJCggdWkuaGVscGVyICksXG4gICAgICBvID0gaW5zdGFuY2Uub3B0aW9ucztcbiAgICBpZiAodC5jc3MoXCJvcGFjaXR5XCIpKSB7XG4gICAgICBvLl9vcGFjaXR5ID0gdC5jc3MoXCJvcGFjaXR5XCIpO1xuICAgIH1cbiAgICB0LmNzcyhcIm9wYWNpdHlcIiwgby5vcGFjaXR5KTtcbiAgfSxcbiAgc3RvcDogZnVuY3Rpb24oIGV2ZW50LCB1aSwgaW5zdGFuY2UgKSB7XG4gICAgdmFyIG8gPSBpbnN0YW5jZS5vcHRpb25zO1xuICAgIGlmIChvLl9vcGFjaXR5KSB7XG4gICAgICAkKHVpLmhlbHBlcikuY3NzKFwib3BhY2l0eVwiLCBvLl9vcGFjaXR5KTtcbiAgICB9XG4gIH1cbn0pO1xuXG4kLnVpLnBsdWdpbi5hZGQoXCJkcmFnZ2FibGVcIiwgXCJzY3JvbGxcIiwge1xuICBzdGFydDogZnVuY3Rpb24oIGV2ZW50LCB1aSwgaSApIHtcbiAgICBpZiAoICFpLnNjcm9sbFBhcmVudE5vdEhpZGRlbiApIHtcbiAgICAgIGkuc2Nyb2xsUGFyZW50Tm90SGlkZGVuID0gaS5oZWxwZXIuc2Nyb2xsUGFyZW50KCBmYWxzZSApO1xuICAgIH1cblxuICAgIGlmICggaS5zY3JvbGxQYXJlbnROb3RIaWRkZW5bIDAgXSAhPT0gaS5kb2N1bWVudFsgMCBdICYmIGkuc2Nyb2xsUGFyZW50Tm90SGlkZGVuWyAwIF0udGFnTmFtZSAhPT0gXCJIVE1MXCIgKSB7XG4gICAgICBpLm92ZXJmbG93T2Zmc2V0ID0gaS5zY3JvbGxQYXJlbnROb3RIaWRkZW4ub2Zmc2V0KCk7XG4gICAgfVxuICB9LFxuICBkcmFnOiBmdW5jdGlvbiggZXZlbnQsIHVpLCBpICApIHtcblxuICAgIHZhciBvID0gaS5vcHRpb25zLFxuICAgICAgc2Nyb2xsZWQgPSBmYWxzZSxcbiAgICAgIHNjcm9sbFBhcmVudCA9IGkuc2Nyb2xsUGFyZW50Tm90SGlkZGVuWyAwIF0sXG4gICAgICBkb2N1bWVudCA9IGkuZG9jdW1lbnRbIDAgXTtcblxuICAgIGlmICggc2Nyb2xsUGFyZW50ICE9PSBkb2N1bWVudCAmJiBzY3JvbGxQYXJlbnQudGFnTmFtZSAhPT0gXCJIVE1MXCIgKSB7XG4gICAgICBpZiAoICFvLmF4aXMgfHwgby5heGlzICE9PSBcInhcIiApIHtcbiAgICAgICAgaWYgKCAoIGkub3ZlcmZsb3dPZmZzZXQudG9wICsgc2Nyb2xsUGFyZW50Lm9mZnNldEhlaWdodCApIC0gZXZlbnQucGFnZVkgPCBvLnNjcm9sbFNlbnNpdGl2aXR5ICkge1xuICAgICAgICAgIHNjcm9sbFBhcmVudC5zY3JvbGxUb3AgPSBzY3JvbGxlZCA9IHNjcm9sbFBhcmVudC5zY3JvbGxUb3AgKyBvLnNjcm9sbFNwZWVkO1xuICAgICAgICB9IGVsc2UgaWYgKCBldmVudC5wYWdlWSAtIGkub3ZlcmZsb3dPZmZzZXQudG9wIDwgby5zY3JvbGxTZW5zaXRpdml0eSApIHtcbiAgICAgICAgICBzY3JvbGxQYXJlbnQuc2Nyb2xsVG9wID0gc2Nyb2xsZWQgPSBzY3JvbGxQYXJlbnQuc2Nyb2xsVG9wIC0gby5zY3JvbGxTcGVlZDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoICFvLmF4aXMgfHwgby5heGlzICE9PSBcInlcIiApIHtcbiAgICAgICAgaWYgKCAoIGkub3ZlcmZsb3dPZmZzZXQubGVmdCArIHNjcm9sbFBhcmVudC5vZmZzZXRXaWR0aCApIC0gZXZlbnQucGFnZVggPCBvLnNjcm9sbFNlbnNpdGl2aXR5ICkge1xuICAgICAgICAgIHNjcm9sbFBhcmVudC5zY3JvbGxMZWZ0ID0gc2Nyb2xsZWQgPSBzY3JvbGxQYXJlbnQuc2Nyb2xsTGVmdCArIG8uc2Nyb2xsU3BlZWQ7XG4gICAgICAgIH0gZWxzZSBpZiAoIGV2ZW50LnBhZ2VYIC0gaS5vdmVyZmxvd09mZnNldC5sZWZ0IDwgby5zY3JvbGxTZW5zaXRpdml0eSApIHtcbiAgICAgICAgICBzY3JvbGxQYXJlbnQuc2Nyb2xsTGVmdCA9IHNjcm9sbGVkID0gc2Nyb2xsUGFyZW50LnNjcm9sbExlZnQgLSBvLnNjcm9sbFNwZWVkO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICBpZiAoIW8uYXhpcyB8fCBvLmF4aXMgIT09IFwieFwiKSB7XG4gICAgICAgIGlmIChldmVudC5wYWdlWSAtICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgpIDwgby5zY3JvbGxTZW5zaXRpdml0eSkge1xuICAgICAgICAgIHNjcm9sbGVkID0gJChkb2N1bWVudCkuc2Nyb2xsVG9wKCQoZG9jdW1lbnQpLnNjcm9sbFRvcCgpIC0gby5zY3JvbGxTcGVlZCk7XG4gICAgICAgIH0gZWxzZSBpZiAoJCh3aW5kb3cpLmhlaWdodCgpIC0gKGV2ZW50LnBhZ2VZIC0gJChkb2N1bWVudCkuc2Nyb2xsVG9wKCkpIDwgby5zY3JvbGxTZW5zaXRpdml0eSkge1xuICAgICAgICAgIHNjcm9sbGVkID0gJChkb2N1bWVudCkuc2Nyb2xsVG9wKCQoZG9jdW1lbnQpLnNjcm9sbFRvcCgpICsgby5zY3JvbGxTcGVlZCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFvLmF4aXMgfHwgby5heGlzICE9PSBcInlcIikge1xuICAgICAgICBpZiAoZXZlbnQucGFnZVggLSAkKGRvY3VtZW50KS5zY3JvbGxMZWZ0KCkgPCBvLnNjcm9sbFNlbnNpdGl2aXR5KSB7XG4gICAgICAgICAgc2Nyb2xsZWQgPSAkKGRvY3VtZW50KS5zY3JvbGxMZWZ0KCQoZG9jdW1lbnQpLnNjcm9sbExlZnQoKSAtIG8uc2Nyb2xsU3BlZWQpO1xuICAgICAgICB9IGVsc2UgaWYgKCQod2luZG93KS53aWR0aCgpIC0gKGV2ZW50LnBhZ2VYIC0gJChkb2N1bWVudCkuc2Nyb2xsTGVmdCgpKSA8IG8uc2Nyb2xsU2Vuc2l0aXZpdHkpIHtcbiAgICAgICAgICBzY3JvbGxlZCA9ICQoZG9jdW1lbnQpLnNjcm9sbExlZnQoJChkb2N1bWVudCkuc2Nyb2xsTGVmdCgpICsgby5zY3JvbGxTcGVlZCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH1cblxuICAgIGlmIChzY3JvbGxlZCAhPT0gZmFsc2UgJiYgJC51aS5kZG1hbmFnZXIgJiYgIW8uZHJvcEJlaGF2aW91cikge1xuICAgICAgJC51aS5kZG1hbmFnZXIucHJlcGFyZU9mZnNldHMoaSwgZXZlbnQpO1xuICAgIH1cblxuICB9XG59KTtcblxuJC51aS5wbHVnaW4uYWRkKFwiZHJhZ2dhYmxlXCIsIFwic25hcFwiLCB7XG4gIHN0YXJ0OiBmdW5jdGlvbiggZXZlbnQsIHVpLCBpICkge1xuXG4gICAgdmFyIG8gPSBpLm9wdGlvbnM7XG5cbiAgICBpLnNuYXBFbGVtZW50cyA9IFtdO1xuXG4gICAgJChvLnNuYXAuY29uc3RydWN0b3IgIT09IFN0cmluZyA/ICggby5zbmFwLml0ZW1zIHx8IFwiOmRhdGEodWktZHJhZ2dhYmxlKVwiICkgOiBvLnNuYXApLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgJHQgPSAkKHRoaXMpLFxuICAgICAgICAkbyA9ICR0Lm9mZnNldCgpO1xuICAgICAgaWYgKHRoaXMgIT09IGkuZWxlbWVudFswXSkge1xuICAgICAgICBpLnNuYXBFbGVtZW50cy5wdXNoKHtcbiAgICAgICAgICBpdGVtOiB0aGlzLFxuICAgICAgICAgIHdpZHRoOiAkdC5vdXRlcldpZHRoKCksIGhlaWdodDogJHQub3V0ZXJIZWlnaHQoKSxcbiAgICAgICAgICB0b3A6ICRvLnRvcCwgbGVmdDogJG8ubGVmdFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICB9LFxuICBkcmFnOiBmdW5jdGlvbiggZXZlbnQsIHVpLCBpbnN0ICkge1xuXG4gICAgdmFyIHRzLCBicywgbHMsIHJzLCBsLCByLCB0LCBiLCBpLCBmaXJzdCxcbiAgICAgIG8gPSBpbnN0Lm9wdGlvbnMsXG4gICAgICBkID0gby5zbmFwVG9sZXJhbmNlLFxuICAgICAgeDEgPSB1aS5vZmZzZXQubGVmdCwgeDIgPSB4MSArIGluc3QuaGVscGVyUHJvcG9ydGlvbnMud2lkdGgsXG4gICAgICB5MSA9IHVpLm9mZnNldC50b3AsIHkyID0geTEgKyBpbnN0LmhlbHBlclByb3BvcnRpb25zLmhlaWdodDtcblxuICAgIGZvciAoaSA9IGluc3Quc25hcEVsZW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKXtcblxuICAgICAgbCA9IGluc3Quc25hcEVsZW1lbnRzW2ldLmxlZnQgLSBpbnN0Lm1hcmdpbnMubGVmdDtcbiAgICAgIHIgPSBsICsgaW5zdC5zbmFwRWxlbWVudHNbaV0ud2lkdGg7XG4gICAgICB0ID0gaW5zdC5zbmFwRWxlbWVudHNbaV0udG9wIC0gaW5zdC5tYXJnaW5zLnRvcDtcbiAgICAgIGIgPSB0ICsgaW5zdC5zbmFwRWxlbWVudHNbaV0uaGVpZ2h0O1xuXG4gICAgICBpZiAoIHgyIDwgbCAtIGQgfHwgeDEgPiByICsgZCB8fCB5MiA8IHQgLSBkIHx8IHkxID4gYiArIGQgfHwgISQuY29udGFpbnMoIGluc3Quc25hcEVsZW1lbnRzWyBpIF0uaXRlbS5vd25lckRvY3VtZW50LCBpbnN0LnNuYXBFbGVtZW50c1sgaSBdLml0ZW0gKSApIHtcbiAgICAgICAgaWYgKGluc3Quc25hcEVsZW1lbnRzW2ldLnNuYXBwaW5nKSB7XG4gICAgICAgICAgKGluc3Qub3B0aW9ucy5zbmFwLnJlbGVhc2UgJiYgaW5zdC5vcHRpb25zLnNuYXAucmVsZWFzZS5jYWxsKGluc3QuZWxlbWVudCwgZXZlbnQsICQuZXh0ZW5kKGluc3QuX3VpSGFzaCgpLCB7IHNuYXBJdGVtOiBpbnN0LnNuYXBFbGVtZW50c1tpXS5pdGVtIH0pKSk7XG4gICAgICAgIH1cbiAgICAgICAgaW5zdC5zbmFwRWxlbWVudHNbaV0uc25hcHBpbmcgPSBmYWxzZTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChvLnNuYXBNb2RlICE9PSBcImlubmVyXCIpIHtcbiAgICAgICAgdHMgPSBNYXRoLmFicyh0IC0geTIpIDw9IGQ7XG4gICAgICAgIGJzID0gTWF0aC5hYnMoYiAtIHkxKSA8PSBkO1xuICAgICAgICBscyA9IE1hdGguYWJzKGwgLSB4MikgPD0gZDtcbiAgICAgICAgcnMgPSBNYXRoLmFicyhyIC0geDEpIDw9IGQ7XG4gICAgICAgIGlmICh0cykge1xuICAgICAgICAgIHVpLnBvc2l0aW9uLnRvcCA9IGluc3QuX2NvbnZlcnRQb3NpdGlvblRvKFwicmVsYXRpdmVcIiwgeyB0b3A6IHQgLSBpbnN0LmhlbHBlclByb3BvcnRpb25zLmhlaWdodCwgbGVmdDogMCB9KS50b3A7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJzKSB7XG4gICAgICAgICAgdWkucG9zaXRpb24udG9wID0gaW5zdC5fY29udmVydFBvc2l0aW9uVG8oXCJyZWxhdGl2ZVwiLCB7IHRvcDogYiwgbGVmdDogMCB9KS50b3A7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxzKSB7XG4gICAgICAgICAgdWkucG9zaXRpb24ubGVmdCA9IGluc3QuX2NvbnZlcnRQb3NpdGlvblRvKFwicmVsYXRpdmVcIiwgeyB0b3A6IDAsIGxlZnQ6IGwgLSBpbnN0LmhlbHBlclByb3BvcnRpb25zLndpZHRoIH0pLmxlZnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJzKSB7XG4gICAgICAgICAgdWkucG9zaXRpb24ubGVmdCA9IGluc3QuX2NvbnZlcnRQb3NpdGlvblRvKFwicmVsYXRpdmVcIiwgeyB0b3A6IDAsIGxlZnQ6IHIgfSkubGVmdDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmaXJzdCA9ICh0cyB8fCBicyB8fCBscyB8fCBycyk7XG5cbiAgICAgIGlmIChvLnNuYXBNb2RlICE9PSBcIm91dGVyXCIpIHtcbiAgICAgICAgdHMgPSBNYXRoLmFicyh0IC0geTEpIDw9IGQ7XG4gICAgICAgIGJzID0gTWF0aC5hYnMoYiAtIHkyKSA8PSBkO1xuICAgICAgICBscyA9IE1hdGguYWJzKGwgLSB4MSkgPD0gZDtcbiAgICAgICAgcnMgPSBNYXRoLmFicyhyIC0geDIpIDw9IGQ7XG4gICAgICAgIGlmICh0cykge1xuICAgICAgICAgIHVpLnBvc2l0aW9uLnRvcCA9IGluc3QuX2NvbnZlcnRQb3NpdGlvblRvKFwicmVsYXRpdmVcIiwgeyB0b3A6IHQsIGxlZnQ6IDAgfSkudG9wO1xuICAgICAgICB9XG4gICAgICAgIGlmIChicykge1xuICAgICAgICAgIHVpLnBvc2l0aW9uLnRvcCA9IGluc3QuX2NvbnZlcnRQb3NpdGlvblRvKFwicmVsYXRpdmVcIiwgeyB0b3A6IGIgLSBpbnN0LmhlbHBlclByb3BvcnRpb25zLmhlaWdodCwgbGVmdDogMCB9KS50b3A7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxzKSB7XG4gICAgICAgICAgdWkucG9zaXRpb24ubGVmdCA9IGluc3QuX2NvbnZlcnRQb3NpdGlvblRvKFwicmVsYXRpdmVcIiwgeyB0b3A6IDAsIGxlZnQ6IGwgfSkubGVmdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocnMpIHtcbiAgICAgICAgICB1aS5wb3NpdGlvbi5sZWZ0ID0gaW5zdC5fY29udmVydFBvc2l0aW9uVG8oXCJyZWxhdGl2ZVwiLCB7IHRvcDogMCwgbGVmdDogciAtIGluc3QuaGVscGVyUHJvcG9ydGlvbnMud2lkdGggfSkubGVmdDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIWluc3Quc25hcEVsZW1lbnRzW2ldLnNuYXBwaW5nICYmICh0cyB8fCBicyB8fCBscyB8fCBycyB8fCBmaXJzdCkpIHtcbiAgICAgICAgKGluc3Qub3B0aW9ucy5zbmFwLnNuYXAgJiYgaW5zdC5vcHRpb25zLnNuYXAuc25hcC5jYWxsKGluc3QuZWxlbWVudCwgZXZlbnQsICQuZXh0ZW5kKGluc3QuX3VpSGFzaCgpLCB7IHNuYXBJdGVtOiBpbnN0LnNuYXBFbGVtZW50c1tpXS5pdGVtIH0pKSk7XG4gICAgICB9XG4gICAgICBpbnN0LnNuYXBFbGVtZW50c1tpXS5zbmFwcGluZyA9ICh0cyB8fCBicyB8fCBscyB8fCBycyB8fCBmaXJzdCk7XG5cbiAgICB9XG5cbiAgfVxufSk7XG5cbiQudWkucGx1Z2luLmFkZChcImRyYWdnYWJsZVwiLCBcInN0YWNrXCIsIHtcbiAgc3RhcnQ6IGZ1bmN0aW9uKCBldmVudCwgdWksIGluc3RhbmNlICkge1xuICAgIHZhciBtaW4sXG4gICAgICBvID0gaW5zdGFuY2Uub3B0aW9ucyxcbiAgICAgIGdyb3VwID0gJC5tYWtlQXJyYXkoJChvLnN0YWNrKSkuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgIHJldHVybiAocGFyc2VJbnQoJChhKS5jc3MoXCJ6SW5kZXhcIiksIDEwKSB8fCAwKSAtIChwYXJzZUludCgkKGIpLmNzcyhcInpJbmRleFwiKSwgMTApIHx8IDApO1xuICAgICAgfSk7XG5cbiAgICBpZiAoIWdyb3VwLmxlbmd0aCkgeyByZXR1cm47IH1cblxuICAgIG1pbiA9IHBhcnNlSW50KCQoZ3JvdXBbMF0pLmNzcyhcInpJbmRleFwiKSwgMTApIHx8IDA7XG4gICAgJChncm91cCkuZWFjaChmdW5jdGlvbihpKSB7XG4gICAgICAkKHRoaXMpLmNzcyhcInpJbmRleFwiLCBtaW4gKyBpKTtcbiAgICB9KTtcbiAgICB0aGlzLmNzcyhcInpJbmRleFwiLCAobWluICsgZ3JvdXAubGVuZ3RoKSk7XG4gIH1cbn0pO1xuXG4kLnVpLnBsdWdpbi5hZGQoXCJkcmFnZ2FibGVcIiwgXCJ6SW5kZXhcIiwge1xuICBzdGFydDogZnVuY3Rpb24oIGV2ZW50LCB1aSwgaW5zdGFuY2UgKSB7XG4gICAgdmFyIHQgPSAkKCB1aS5oZWxwZXIgKSxcbiAgICAgIG8gPSBpbnN0YW5jZS5vcHRpb25zO1xuXG4gICAgaWYgKHQuY3NzKFwiekluZGV4XCIpKSB7XG4gICAgICBvLl96SW5kZXggPSB0LmNzcyhcInpJbmRleFwiKTtcbiAgICB9XG4gICAgdC5jc3MoXCJ6SW5kZXhcIiwgby56SW5kZXgpO1xuICB9LFxuICBzdG9wOiBmdW5jdGlvbiggZXZlbnQsIHVpLCBpbnN0YW5jZSApIHtcbiAgICB2YXIgbyA9IGluc3RhbmNlLm9wdGlvbnM7XG5cbiAgICBpZiAoby5fekluZGV4KSB7XG4gICAgICAkKHVpLmhlbHBlcikuY3NzKFwiekluZGV4XCIsIG8uX3pJbmRleCk7XG4gICAgfVxuICB9XG59KTtcblxudmFyIGRyYWdnYWJsZSA9ICQudWkuZHJhZ2dhYmxlO1xuXG5cbi8qIVxuICogalF1ZXJ5IFVJIERyb3BwYWJsZSAxLjExLjNcbiAqIGh0dHA6Ly9qcXVlcnl1aS5jb21cbiAqXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9yc1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogaHR0cDovL2pxdWVyeS5vcmcvbGljZW5zZVxuICpcbiAqIGh0dHA6Ly9hcGkuanF1ZXJ5dWkuY29tL2Ryb3BwYWJsZS9cbiAqL1xuXG5cbiQud2lkZ2V0KCBcInVpLmRyb3BwYWJsZVwiLCB7XG4gIHZlcnNpb246IFwiMS4xMS4zXCIsXG4gIHdpZGdldEV2ZW50UHJlZml4OiBcImRyb3BcIixcbiAgb3B0aW9uczoge1xuICAgIGFjY2VwdDogXCIqXCIsXG4gICAgYWN0aXZlQ2xhc3M6IGZhbHNlLFxuICAgIGFkZENsYXNzZXM6IHRydWUsXG4gICAgZ3JlZWR5OiBmYWxzZSxcbiAgICBob3ZlckNsYXNzOiBmYWxzZSxcbiAgICBzY29wZTogXCJkZWZhdWx0XCIsXG4gICAgdG9sZXJhbmNlOiBcImludGVyc2VjdFwiLFxuXG4gICAgLy8gY2FsbGJhY2tzXG4gICAgYWN0aXZhdGU6IG51bGwsXG4gICAgZGVhY3RpdmF0ZTogbnVsbCxcbiAgICBkcm9wOiBudWxsLFxuICAgIG91dDogbnVsbCxcbiAgICBvdmVyOiBudWxsXG4gIH0sXG4gIF9jcmVhdGU6IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIHByb3BvcnRpb25zLFxuICAgICAgbyA9IHRoaXMub3B0aW9ucyxcbiAgICAgIGFjY2VwdCA9IG8uYWNjZXB0O1xuXG4gICAgdGhpcy5pc292ZXIgPSBmYWxzZTtcbiAgICB0aGlzLmlzb3V0ID0gdHJ1ZTtcblxuICAgIHRoaXMuYWNjZXB0ID0gJC5pc0Z1bmN0aW9uKCBhY2NlcHQgKSA/IGFjY2VwdCA6IGZ1bmN0aW9uKCBkICkge1xuICAgICAgcmV0dXJuIGQuaXMoIGFjY2VwdCApO1xuICAgIH07XG5cbiAgICB0aGlzLnByb3BvcnRpb25zID0gZnVuY3Rpb24oIC8qIHZhbHVlVG9Xcml0ZSAqLyApIHtcbiAgICAgIGlmICggYXJndW1lbnRzLmxlbmd0aCApIHtcbiAgICAgICAgLy8gU3RvcmUgdGhlIGRyb3BwYWJsZSdzIHByb3BvcnRpb25zXG4gICAgICAgIHByb3BvcnRpb25zID0gYXJndW1lbnRzWyAwIF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBSZXRyaWV2ZSBvciBkZXJpdmUgdGhlIGRyb3BwYWJsZSdzIHByb3BvcnRpb25zXG4gICAgICAgIHJldHVybiBwcm9wb3J0aW9ucyA/XG4gICAgICAgICAgcHJvcG9ydGlvbnMgOlxuICAgICAgICAgIHByb3BvcnRpb25zID0ge1xuICAgICAgICAgICAgd2lkdGg6IHRoaXMuZWxlbWVudFsgMCBdLm9mZnNldFdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmVsZW1lbnRbIDAgXS5vZmZzZXRIZWlnaHRcbiAgICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0aGlzLl9hZGRUb01hbmFnZXIoIG8uc2NvcGUgKTtcblxuICAgIG8uYWRkQ2xhc3NlcyAmJiB0aGlzLmVsZW1lbnQuYWRkQ2xhc3MoIFwidWktZHJvcHBhYmxlXCIgKTtcblxuICB9LFxuXG4gIF9hZGRUb01hbmFnZXI6IGZ1bmN0aW9uKCBzY29wZSApIHtcbiAgICAvLyBBZGQgdGhlIHJlZmVyZW5jZSBhbmQgcG9zaXRpb25zIHRvIHRoZSBtYW5hZ2VyXG4gICAgJC51aS5kZG1hbmFnZXIuZHJvcHBhYmxlc1sgc2NvcGUgXSA9ICQudWkuZGRtYW5hZ2VyLmRyb3BwYWJsZXNbIHNjb3BlIF0gfHwgW107XG4gICAgJC51aS5kZG1hbmFnZXIuZHJvcHBhYmxlc1sgc2NvcGUgXS5wdXNoKCB0aGlzICk7XG4gIH0sXG5cbiAgX3NwbGljZTogZnVuY3Rpb24oIGRyb3AgKSB7XG4gICAgdmFyIGkgPSAwO1xuICAgIGZvciAoIDsgaSA8IGRyb3AubGVuZ3RoOyBpKysgKSB7XG4gICAgICBpZiAoIGRyb3BbIGkgXSA9PT0gdGhpcyApIHtcbiAgICAgICAgZHJvcC5zcGxpY2UoIGksIDEgKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgX2Rlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkcm9wID0gJC51aS5kZG1hbmFnZXIuZHJvcHBhYmxlc1sgdGhpcy5vcHRpb25zLnNjb3BlIF07XG5cbiAgICB0aGlzLl9zcGxpY2UoIGRyb3AgKTtcblxuICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcyggXCJ1aS1kcm9wcGFibGUgdWktZHJvcHBhYmxlLWRpc2FibGVkXCIgKTtcbiAgfSxcblxuICBfc2V0T3B0aW9uOiBmdW5jdGlvbigga2V5LCB2YWx1ZSApIHtcblxuICAgIGlmICgga2V5ID09PSBcImFjY2VwdFwiICkge1xuICAgICAgdGhpcy5hY2NlcHQgPSAkLmlzRnVuY3Rpb24oIHZhbHVlICkgPyB2YWx1ZSA6IGZ1bmN0aW9uKCBkICkge1xuICAgICAgICByZXR1cm4gZC5pcyggdmFsdWUgKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIGlmICgga2V5ID09PSBcInNjb3BlXCIgKSB7XG4gICAgICB2YXIgZHJvcCA9ICQudWkuZGRtYW5hZ2VyLmRyb3BwYWJsZXNbIHRoaXMub3B0aW9ucy5zY29wZSBdO1xuXG4gICAgICB0aGlzLl9zcGxpY2UoIGRyb3AgKTtcbiAgICAgIHRoaXMuX2FkZFRvTWFuYWdlciggdmFsdWUgKTtcbiAgICB9XG5cbiAgICB0aGlzLl9zdXBlcigga2V5LCB2YWx1ZSApO1xuICB9LFxuXG4gIF9hY3RpdmF0ZTogZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgIHZhciBkcmFnZ2FibGUgPSAkLnVpLmRkbWFuYWdlci5jdXJyZW50O1xuICAgIGlmICggdGhpcy5vcHRpb25zLmFjdGl2ZUNsYXNzICkge1xuICAgICAgdGhpcy5lbGVtZW50LmFkZENsYXNzKCB0aGlzLm9wdGlvbnMuYWN0aXZlQ2xhc3MgKTtcbiAgICB9XG4gICAgaWYgKCBkcmFnZ2FibGUgKXtcbiAgICAgIHRoaXMuX3RyaWdnZXIoIFwiYWN0aXZhdGVcIiwgZXZlbnQsIHRoaXMudWkoIGRyYWdnYWJsZSApICk7XG4gICAgfVxuICB9LFxuXG4gIF9kZWFjdGl2YXRlOiBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgdmFyIGRyYWdnYWJsZSA9ICQudWkuZGRtYW5hZ2VyLmN1cnJlbnQ7XG4gICAgaWYgKCB0aGlzLm9wdGlvbnMuYWN0aXZlQ2xhc3MgKSB7XG4gICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoIHRoaXMub3B0aW9ucy5hY3RpdmVDbGFzcyApO1xuICAgIH1cbiAgICBpZiAoIGRyYWdnYWJsZSApe1xuICAgICAgdGhpcy5fdHJpZ2dlciggXCJkZWFjdGl2YXRlXCIsIGV2ZW50LCB0aGlzLnVpKCBkcmFnZ2FibGUgKSApO1xuICAgIH1cbiAgfSxcblxuICBfb3ZlcjogZnVuY3Rpb24oIGV2ZW50ICkge1xuXG4gICAgdmFyIGRyYWdnYWJsZSA9ICQudWkuZGRtYW5hZ2VyLmN1cnJlbnQ7XG5cbiAgICAvLyBCYWlsIGlmIGRyYWdnYWJsZSBhbmQgZHJvcHBhYmxlIGFyZSBzYW1lIGVsZW1lbnRcbiAgICBpZiAoICFkcmFnZ2FibGUgfHwgKCBkcmFnZ2FibGUuY3VycmVudEl0ZW0gfHwgZHJhZ2dhYmxlLmVsZW1lbnQgKVsgMCBdID09PSB0aGlzLmVsZW1lbnRbIDAgXSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIHRoaXMuYWNjZXB0LmNhbGwoIHRoaXMuZWxlbWVudFsgMCBdLCAoIGRyYWdnYWJsZS5jdXJyZW50SXRlbSB8fCBkcmFnZ2FibGUuZWxlbWVudCApICkgKSB7XG4gICAgICBpZiAoIHRoaXMub3B0aW9ucy5ob3ZlckNsYXNzICkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuYWRkQ2xhc3MoIHRoaXMub3B0aW9ucy5ob3ZlckNsYXNzICk7XG4gICAgICB9XG4gICAgICB0aGlzLl90cmlnZ2VyKCBcIm92ZXJcIiwgZXZlbnQsIHRoaXMudWkoIGRyYWdnYWJsZSApICk7XG4gICAgfVxuXG4gIH0sXG5cbiAgX291dDogZnVuY3Rpb24oIGV2ZW50ICkge1xuXG4gICAgdmFyIGRyYWdnYWJsZSA9ICQudWkuZGRtYW5hZ2VyLmN1cnJlbnQ7XG5cbiAgICAvLyBCYWlsIGlmIGRyYWdnYWJsZSBhbmQgZHJvcHBhYmxlIGFyZSBzYW1lIGVsZW1lbnRcbiAgICBpZiAoICFkcmFnZ2FibGUgfHwgKCBkcmFnZ2FibGUuY3VycmVudEl0ZW0gfHwgZHJhZ2dhYmxlLmVsZW1lbnQgKVsgMCBdID09PSB0aGlzLmVsZW1lbnRbIDAgXSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIHRoaXMuYWNjZXB0LmNhbGwoIHRoaXMuZWxlbWVudFsgMCBdLCAoIGRyYWdnYWJsZS5jdXJyZW50SXRlbSB8fCBkcmFnZ2FibGUuZWxlbWVudCApICkgKSB7XG4gICAgICBpZiAoIHRoaXMub3B0aW9ucy5ob3ZlckNsYXNzICkge1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoIHRoaXMub3B0aW9ucy5ob3ZlckNsYXNzICk7XG4gICAgICB9XG4gICAgICB0aGlzLl90cmlnZ2VyKCBcIm91dFwiLCBldmVudCwgdGhpcy51aSggZHJhZ2dhYmxlICkgKTtcbiAgICB9XG5cbiAgfSxcblxuICBfZHJvcDogZnVuY3Rpb24oIGV2ZW50LCBjdXN0b20gKSB7XG5cbiAgICB2YXIgZHJhZ2dhYmxlID0gY3VzdG9tIHx8ICQudWkuZGRtYW5hZ2VyLmN1cnJlbnQsXG4gICAgICBjaGlsZHJlbkludGVyc2VjdGlvbiA9IGZhbHNlO1xuXG4gICAgLy8gQmFpbCBpZiBkcmFnZ2FibGUgYW5kIGRyb3BwYWJsZSBhcmUgc2FtZSBlbGVtZW50XG4gICAgaWYgKCAhZHJhZ2dhYmxlIHx8ICggZHJhZ2dhYmxlLmN1cnJlbnRJdGVtIHx8IGRyYWdnYWJsZS5lbGVtZW50IClbIDAgXSA9PT0gdGhpcy5lbGVtZW50WyAwIF0gKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5lbGVtZW50LmZpbmQoIFwiOmRhdGEodWktZHJvcHBhYmxlKVwiICkubm90KCBcIi51aS1kcmFnZ2FibGUtZHJhZ2dpbmdcIiApLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaW5zdCA9ICQoIHRoaXMgKS5kcm9wcGFibGUoIFwiaW5zdGFuY2VcIiApO1xuICAgICAgaWYgKFxuICAgICAgICBpbnN0Lm9wdGlvbnMuZ3JlZWR5ICYmXG4gICAgICAgICFpbnN0Lm9wdGlvbnMuZGlzYWJsZWQgJiZcbiAgICAgICAgaW5zdC5vcHRpb25zLnNjb3BlID09PSBkcmFnZ2FibGUub3B0aW9ucy5zY29wZSAmJlxuICAgICAgICBpbnN0LmFjY2VwdC5jYWxsKCBpbnN0LmVsZW1lbnRbIDAgXSwgKCBkcmFnZ2FibGUuY3VycmVudEl0ZW0gfHwgZHJhZ2dhYmxlLmVsZW1lbnQgKSApICYmXG4gICAgICAgICQudWkuaW50ZXJzZWN0KCBkcmFnZ2FibGUsICQuZXh0ZW5kKCBpbnN0LCB7IG9mZnNldDogaW5zdC5lbGVtZW50Lm9mZnNldCgpIH0gKSwgaW5zdC5vcHRpb25zLnRvbGVyYW5jZSwgZXZlbnQgKVxuICAgICAgKSB7IGNoaWxkcmVuSW50ZXJzZWN0aW9uID0gdHJ1ZTsgcmV0dXJuIGZhbHNlOyB9XG4gICAgfSk7XG4gICAgaWYgKCBjaGlsZHJlbkludGVyc2VjdGlvbiApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIHRoaXMuYWNjZXB0LmNhbGwoIHRoaXMuZWxlbWVudFsgMCBdLCAoIGRyYWdnYWJsZS5jdXJyZW50SXRlbSB8fCBkcmFnZ2FibGUuZWxlbWVudCApICkgKSB7XG4gICAgICBpZiAoIHRoaXMub3B0aW9ucy5hY3RpdmVDbGFzcyApIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCB0aGlzLm9wdGlvbnMuYWN0aXZlQ2xhc3MgKTtcbiAgICAgIH1cbiAgICAgIGlmICggdGhpcy5vcHRpb25zLmhvdmVyQ2xhc3MgKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcyggdGhpcy5vcHRpb25zLmhvdmVyQ2xhc3MgKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3RyaWdnZXIoIFwiZHJvcFwiLCBldmVudCwgdGhpcy51aSggZHJhZ2dhYmxlICkgKTtcbiAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIH0sXG5cbiAgdWk6IGZ1bmN0aW9uKCBjICkge1xuICAgIHJldHVybiB7XG4gICAgICBkcmFnZ2FibGU6ICggYy5jdXJyZW50SXRlbSB8fCBjLmVsZW1lbnQgKSxcbiAgICAgIGhlbHBlcjogYy5oZWxwZXIsXG4gICAgICBwb3NpdGlvbjogYy5wb3NpdGlvbixcbiAgICAgIG9mZnNldDogYy5wb3NpdGlvbkFic1xuICAgIH07XG4gIH1cblxufSk7XG5cbiQudWkuaW50ZXJzZWN0ID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBpc092ZXJBeGlzKCB4LCByZWZlcmVuY2UsIHNpemUgKSB7XG4gICAgcmV0dXJuICggeCA+PSByZWZlcmVuY2UgKSAmJiAoIHggPCAoIHJlZmVyZW5jZSArIHNpemUgKSApO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKCBkcmFnZ2FibGUsIGRyb3BwYWJsZSwgdG9sZXJhbmNlTW9kZSwgZXZlbnQgKSB7XG5cbiAgICBpZiAoICFkcm9wcGFibGUub2Zmc2V0ICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciB4MSA9ICggZHJhZ2dhYmxlLnBvc2l0aW9uQWJzIHx8IGRyYWdnYWJsZS5wb3NpdGlvbi5hYnNvbHV0ZSApLmxlZnQgKyBkcmFnZ2FibGUubWFyZ2lucy5sZWZ0LFxuICAgICAgeTEgPSAoIGRyYWdnYWJsZS5wb3NpdGlvbkFicyB8fCBkcmFnZ2FibGUucG9zaXRpb24uYWJzb2x1dGUgKS50b3AgKyBkcmFnZ2FibGUubWFyZ2lucy50b3AsXG4gICAgICB4MiA9IHgxICsgZHJhZ2dhYmxlLmhlbHBlclByb3BvcnRpb25zLndpZHRoLFxuICAgICAgeTIgPSB5MSArIGRyYWdnYWJsZS5oZWxwZXJQcm9wb3J0aW9ucy5oZWlnaHQsXG4gICAgICBsID0gZHJvcHBhYmxlLm9mZnNldC5sZWZ0LFxuICAgICAgdCA9IGRyb3BwYWJsZS5vZmZzZXQudG9wLFxuICAgICAgciA9IGwgKyBkcm9wcGFibGUucHJvcG9ydGlvbnMoKS53aWR0aCxcbiAgICAgIGIgPSB0ICsgZHJvcHBhYmxlLnByb3BvcnRpb25zKCkuaGVpZ2h0O1xuXG4gICAgc3dpdGNoICggdG9sZXJhbmNlTW9kZSApIHtcbiAgICBjYXNlIFwiZml0XCI6XG4gICAgICByZXR1cm4gKCBsIDw9IHgxICYmIHgyIDw9IHIgJiYgdCA8PSB5MSAmJiB5MiA8PSBiICk7XG4gICAgY2FzZSBcImludGVyc2VjdFwiOlxuICAgICAgcmV0dXJuICggbCA8IHgxICsgKCBkcmFnZ2FibGUuaGVscGVyUHJvcG9ydGlvbnMud2lkdGggLyAyICkgJiYgLy8gUmlnaHQgSGFsZlxuICAgICAgICB4MiAtICggZHJhZ2dhYmxlLmhlbHBlclByb3BvcnRpb25zLndpZHRoIC8gMiApIDwgciAmJiAvLyBMZWZ0IEhhbGZcbiAgICAgICAgdCA8IHkxICsgKCBkcmFnZ2FibGUuaGVscGVyUHJvcG9ydGlvbnMuaGVpZ2h0IC8gMiApICYmIC8vIEJvdHRvbSBIYWxmXG4gICAgICAgIHkyIC0gKCBkcmFnZ2FibGUuaGVscGVyUHJvcG9ydGlvbnMuaGVpZ2h0IC8gMiApIDwgYiApOyAvLyBUb3AgSGFsZlxuICAgIGNhc2UgXCJwb2ludGVyXCI6XG4gICAgICByZXR1cm4gaXNPdmVyQXhpcyggZXZlbnQucGFnZVksIHQsIGRyb3BwYWJsZS5wcm9wb3J0aW9ucygpLmhlaWdodCApICYmIGlzT3ZlckF4aXMoIGV2ZW50LnBhZ2VYLCBsLCBkcm9wcGFibGUucHJvcG9ydGlvbnMoKS53aWR0aCApO1xuICAgIGNhc2UgXCJ0b3VjaFwiOlxuICAgICAgcmV0dXJuIChcbiAgICAgICAgKCB5MSA+PSB0ICYmIHkxIDw9IGIgKSB8fCAvLyBUb3AgZWRnZSB0b3VjaGluZ1xuICAgICAgICAoIHkyID49IHQgJiYgeTIgPD0gYiApIHx8IC8vIEJvdHRvbSBlZGdlIHRvdWNoaW5nXG4gICAgICAgICggeTEgPCB0ICYmIHkyID4gYiApIC8vIFN1cnJvdW5kZWQgdmVydGljYWxseVxuICAgICAgKSAmJiAoXG4gICAgICAgICggeDEgPj0gbCAmJiB4MSA8PSByICkgfHwgLy8gTGVmdCBlZGdlIHRvdWNoaW5nXG4gICAgICAgICggeDIgPj0gbCAmJiB4MiA8PSByICkgfHwgLy8gUmlnaHQgZWRnZSB0b3VjaGluZ1xuICAgICAgICAoIHgxIDwgbCAmJiB4MiA+IHIgKSAvLyBTdXJyb3VuZGVkIGhvcml6b250YWxseVxuICAgICAgKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfTtcbn0pKCk7XG5cbi8qXG4gIFRoaXMgbWFuYWdlciB0cmFja3Mgb2Zmc2V0cyBvZiBkcmFnZ2FibGVzIGFuZCBkcm9wcGFibGVzXG4qL1xuJC51aS5kZG1hbmFnZXIgPSB7XG4gIGN1cnJlbnQ6IG51bGwsXG4gIGRyb3BwYWJsZXM6IHsgXCJkZWZhdWx0XCI6IFtdIH0sXG4gIHByZXBhcmVPZmZzZXRzOiBmdW5jdGlvbiggdCwgZXZlbnQgKSB7XG5cbiAgICB2YXIgaSwgaixcbiAgICAgIG0gPSAkLnVpLmRkbWFuYWdlci5kcm9wcGFibGVzWyB0Lm9wdGlvbnMuc2NvcGUgXSB8fCBbXSxcbiAgICAgIHR5cGUgPSBldmVudCA/IGV2ZW50LnR5cGUgOiBudWxsLCAvLyB3b3JrYXJvdW5kIGZvciAjMjMxN1xuICAgICAgbGlzdCA9ICggdC5jdXJyZW50SXRlbSB8fCB0LmVsZW1lbnQgKS5maW5kKCBcIjpkYXRhKHVpLWRyb3BwYWJsZSlcIiApLmFkZEJhY2soKTtcblxuICAgIGRyb3BwYWJsZXNMb29wOiBmb3IgKCBpID0gMDsgaSA8IG0ubGVuZ3RoOyBpKysgKSB7XG5cbiAgICAgIC8vIE5vIGRpc2FibGVkIGFuZCBub24tYWNjZXB0ZWRcbiAgICAgIGlmICggbVsgaSBdLm9wdGlvbnMuZGlzYWJsZWQgfHwgKCB0ICYmICFtWyBpIF0uYWNjZXB0LmNhbGwoIG1bIGkgXS5lbGVtZW50WyAwIF0sICggdC5jdXJyZW50SXRlbSB8fCB0LmVsZW1lbnQgKSApICkgKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBGaWx0ZXIgb3V0IGVsZW1lbnRzIGluIHRoZSBjdXJyZW50IGRyYWdnZWQgaXRlbVxuICAgICAgZm9yICggaiA9IDA7IGogPCBsaXN0Lmxlbmd0aDsgaisrICkge1xuICAgICAgICBpZiAoIGxpc3RbIGogXSA9PT0gbVsgaSBdLmVsZW1lbnRbIDAgXSApIHtcbiAgICAgICAgICBtWyBpIF0ucHJvcG9ydGlvbnMoKS5oZWlnaHQgPSAwO1xuICAgICAgICAgIGNvbnRpbnVlIGRyb3BwYWJsZXNMb29wO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIG1bIGkgXS52aXNpYmxlID0gbVsgaSBdLmVsZW1lbnQuY3NzKCBcImRpc3BsYXlcIiApICE9PSBcIm5vbmVcIjtcbiAgICAgIGlmICggIW1bIGkgXS52aXNpYmxlICkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgLy8gQWN0aXZhdGUgdGhlIGRyb3BwYWJsZSBpZiB1c2VkIGRpcmVjdGx5IGZyb20gZHJhZ2dhYmxlc1xuICAgICAgaWYgKCB0eXBlID09PSBcIm1vdXNlZG93blwiICkge1xuICAgICAgICBtWyBpIF0uX2FjdGl2YXRlLmNhbGwoIG1bIGkgXSwgZXZlbnQgKTtcbiAgICAgIH1cblxuICAgICAgbVsgaSBdLm9mZnNldCA9IG1bIGkgXS5lbGVtZW50Lm9mZnNldCgpO1xuICAgICAgbVsgaSBdLnByb3BvcnRpb25zKHsgd2lkdGg6IG1bIGkgXS5lbGVtZW50WyAwIF0ub2Zmc2V0V2lkdGgsIGhlaWdodDogbVsgaSBdLmVsZW1lbnRbIDAgXS5vZmZzZXRIZWlnaHQgfSk7XG5cbiAgICB9XG5cbiAgfSxcbiAgZHJvcDogZnVuY3Rpb24oIGRyYWdnYWJsZSwgZXZlbnQgKSB7XG5cbiAgICB2YXIgZHJvcHBlZCA9IGZhbHNlO1xuICAgIC8vIENyZWF0ZSBhIGNvcHkgb2YgdGhlIGRyb3BwYWJsZXMgaW4gY2FzZSB0aGUgbGlzdCBjaGFuZ2VzIGR1cmluZyB0aGUgZHJvcCAoIzkxMTYpXG4gICAgJC5lYWNoKCAoICQudWkuZGRtYW5hZ2VyLmRyb3BwYWJsZXNbIGRyYWdnYWJsZS5vcHRpb25zLnNjb3BlIF0gfHwgW10gKS5zbGljZSgpLCBmdW5jdGlvbigpIHtcblxuICAgICAgaWYgKCAhdGhpcy5vcHRpb25zICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoICF0aGlzLm9wdGlvbnMuZGlzYWJsZWQgJiYgdGhpcy52aXNpYmxlICYmICQudWkuaW50ZXJzZWN0KCBkcmFnZ2FibGUsIHRoaXMsIHRoaXMub3B0aW9ucy50b2xlcmFuY2UsIGV2ZW50ICkgKSB7XG4gICAgICAgIGRyb3BwZWQgPSB0aGlzLl9kcm9wLmNhbGwoIHRoaXMsIGV2ZW50ICkgfHwgZHJvcHBlZDtcbiAgICAgIH1cblxuICAgICAgaWYgKCAhdGhpcy5vcHRpb25zLmRpc2FibGVkICYmIHRoaXMudmlzaWJsZSAmJiB0aGlzLmFjY2VwdC5jYWxsKCB0aGlzLmVsZW1lbnRbIDAgXSwgKCBkcmFnZ2FibGUuY3VycmVudEl0ZW0gfHwgZHJhZ2dhYmxlLmVsZW1lbnQgKSApICkge1xuICAgICAgICB0aGlzLmlzb3V0ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5pc292ZXIgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fZGVhY3RpdmF0ZS5jYWxsKCB0aGlzLCBldmVudCApO1xuICAgICAgfVxuXG4gICAgfSk7XG4gICAgcmV0dXJuIGRyb3BwZWQ7XG5cbiAgfSxcbiAgZHJhZ1N0YXJ0OiBmdW5jdGlvbiggZHJhZ2dhYmxlLCBldmVudCApIHtcbiAgICAvLyBMaXN0ZW4gZm9yIHNjcm9sbGluZyBzbyB0aGF0IGlmIHRoZSBkcmFnZ2luZyBjYXVzZXMgc2Nyb2xsaW5nIHRoZSBwb3NpdGlvbiBvZiB0aGUgZHJvcHBhYmxlcyBjYW4gYmUgcmVjYWxjdWxhdGVkIChzZWUgIzUwMDMpXG4gICAgZHJhZ2dhYmxlLmVsZW1lbnQucGFyZW50c1VudGlsKCBcImJvZHlcIiApLmJpbmQoIFwic2Nyb2xsLmRyb3BwYWJsZVwiLCBmdW5jdGlvbigpIHtcbiAgICAgIGlmICggIWRyYWdnYWJsZS5vcHRpb25zLnJlZnJlc2hQb3NpdGlvbnMgKSB7XG4gICAgICAgICQudWkuZGRtYW5hZ2VyLnByZXBhcmVPZmZzZXRzKCBkcmFnZ2FibGUsIGV2ZW50ICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIGRyYWc6IGZ1bmN0aW9uKCBkcmFnZ2FibGUsIGV2ZW50ICkge1xuXG4gICAgLy8gSWYgeW91IGhhdmUgYSBoaWdobHkgZHluYW1pYyBwYWdlLCB5b3UgbWlnaHQgdHJ5IHRoaXMgb3B0aW9uLiBJdCByZW5kZXJzIHBvc2l0aW9ucyBldmVyeSB0aW1lIHlvdSBtb3ZlIHRoZSBtb3VzZS5cbiAgICBpZiAoIGRyYWdnYWJsZS5vcHRpb25zLnJlZnJlc2hQb3NpdGlvbnMgKSB7XG4gICAgICAkLnVpLmRkbWFuYWdlci5wcmVwYXJlT2Zmc2V0cyggZHJhZ2dhYmxlLCBldmVudCApO1xuICAgIH1cblxuICAgIC8vIFJ1biB0aHJvdWdoIGFsbCBkcm9wcGFibGVzIGFuZCBjaGVjayB0aGVpciBwb3NpdGlvbnMgYmFzZWQgb24gc3BlY2lmaWMgdG9sZXJhbmNlIG9wdGlvbnNcbiAgICAkLmVhY2goICQudWkuZGRtYW5hZ2VyLmRyb3BwYWJsZXNbIGRyYWdnYWJsZS5vcHRpb25zLnNjb3BlIF0gfHwgW10sIGZ1bmN0aW9uKCkge1xuXG4gICAgICBpZiAoIHRoaXMub3B0aW9ucy5kaXNhYmxlZCB8fCB0aGlzLmdyZWVkeUNoaWxkIHx8ICF0aGlzLnZpc2libGUgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHBhcmVudEluc3RhbmNlLCBzY29wZSwgcGFyZW50LFxuICAgICAgICBpbnRlcnNlY3RzID0gJC51aS5pbnRlcnNlY3QoIGRyYWdnYWJsZSwgdGhpcywgdGhpcy5vcHRpb25zLnRvbGVyYW5jZSwgZXZlbnQgKSxcbiAgICAgICAgYyA9ICFpbnRlcnNlY3RzICYmIHRoaXMuaXNvdmVyID8gXCJpc291dFwiIDogKCBpbnRlcnNlY3RzICYmICF0aGlzLmlzb3ZlciA/IFwiaXNvdmVyXCIgOiBudWxsICk7XG4gICAgICBpZiAoICFjICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICggdGhpcy5vcHRpb25zLmdyZWVkeSApIHtcbiAgICAgICAgLy8gZmluZCBkcm9wcGFibGUgcGFyZW50cyB3aXRoIHNhbWUgc2NvcGVcbiAgICAgICAgc2NvcGUgPSB0aGlzLm9wdGlvbnMuc2NvcGU7XG4gICAgICAgIHBhcmVudCA9IHRoaXMuZWxlbWVudC5wYXJlbnRzKCBcIjpkYXRhKHVpLWRyb3BwYWJsZSlcIiApLmZpbHRlcihmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gJCggdGhpcyApLmRyb3BwYWJsZSggXCJpbnN0YW5jZVwiICkub3B0aW9ucy5zY29wZSA9PT0gc2NvcGU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICggcGFyZW50Lmxlbmd0aCApIHtcbiAgICAgICAgICBwYXJlbnRJbnN0YW5jZSA9ICQoIHBhcmVudFsgMCBdICkuZHJvcHBhYmxlKCBcImluc3RhbmNlXCIgKTtcbiAgICAgICAgICBwYXJlbnRJbnN0YW5jZS5ncmVlZHlDaGlsZCA9ICggYyA9PT0gXCJpc292ZXJcIiApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHdlIGp1c3QgbW92ZWQgaW50byBhIGdyZWVkeSBjaGlsZFxuICAgICAgaWYgKCBwYXJlbnRJbnN0YW5jZSAmJiBjID09PSBcImlzb3ZlclwiICkge1xuICAgICAgICBwYXJlbnRJbnN0YW5jZS5pc292ZXIgPSBmYWxzZTtcbiAgICAgICAgcGFyZW50SW5zdGFuY2UuaXNvdXQgPSB0cnVlO1xuICAgICAgICBwYXJlbnRJbnN0YW5jZS5fb3V0LmNhbGwoIHBhcmVudEluc3RhbmNlLCBldmVudCApO1xuICAgICAgfVxuXG4gICAgICB0aGlzWyBjIF0gPSB0cnVlO1xuICAgICAgdGhpc1tjID09PSBcImlzb3V0XCIgPyBcImlzb3ZlclwiIDogXCJpc291dFwiXSA9IGZhbHNlO1xuICAgICAgdGhpc1tjID09PSBcImlzb3ZlclwiID8gXCJfb3ZlclwiIDogXCJfb3V0XCJdLmNhbGwoIHRoaXMsIGV2ZW50ICk7XG5cbiAgICAgIC8vIHdlIGp1c3QgbW92ZWQgb3V0IG9mIGEgZ3JlZWR5IGNoaWxkXG4gICAgICBpZiAoIHBhcmVudEluc3RhbmNlICYmIGMgPT09IFwiaXNvdXRcIiApIHtcbiAgICAgICAgcGFyZW50SW5zdGFuY2UuaXNvdXQgPSBmYWxzZTtcbiAgICAgICAgcGFyZW50SW5zdGFuY2UuaXNvdmVyID0gdHJ1ZTtcbiAgICAgICAgcGFyZW50SW5zdGFuY2UuX292ZXIuY2FsbCggcGFyZW50SW5zdGFuY2UsIGV2ZW50ICk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgfSxcbiAgZHJhZ1N0b3A6IGZ1bmN0aW9uKCBkcmFnZ2FibGUsIGV2ZW50ICkge1xuICAgIGRyYWdnYWJsZS5lbGVtZW50LnBhcmVudHNVbnRpbCggXCJib2R5XCIgKS51bmJpbmQoIFwic2Nyb2xsLmRyb3BwYWJsZVwiICk7XG4gICAgLy8gQ2FsbCBwcmVwYXJlT2Zmc2V0cyBvbmUgZmluYWwgdGltZSBzaW5jZSBJRSBkb2VzIG5vdCBmaXJlIHJldHVybiBzY3JvbGwgZXZlbnRzIHdoZW4gb3ZlcmZsb3cgd2FzIGNhdXNlZCBieSBkcmFnIChzZWUgIzUwMDMpXG4gICAgaWYgKCAhZHJhZ2dhYmxlLm9wdGlvbnMucmVmcmVzaFBvc2l0aW9ucyApIHtcbiAgICAgICQudWkuZGRtYW5hZ2VyLnByZXBhcmVPZmZzZXRzKCBkcmFnZ2FibGUsIGV2ZW50ICk7XG4gICAgfVxuICB9XG59O1xuXG52YXIgZHJvcHBhYmxlID0gJC51aS5kcm9wcGFibGU7XG5cblxuXG59KSk7Il19
