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
  this.spread = ko.observable();
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
    ko.dataFor(drag).spread(spread);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvc3JjL3NjcmlwdHMvYXBwLmpzIiwicHVibGljL3NyYy9zY3JpcHRzL2dhbWUuanMiLCJwdWJsaWMvc3JjL3NjcmlwdHMvb3JkZXIuanMiLCJwdWJsaWMvc3JjL3NjcmlwdHMvc3RvY2ttYXJrZXQtdmlldy1tb2RlbC5qcyIsInB1YmxpYy9zcmMvc2NyaXB0cy92ZW5kb3IvanF1ZXJ5LXVpLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJy4vZ2FtZS5qcycpKCk7IiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgJCA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LiQgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLiQgOiBudWxsKTtcbnZhciBrbyA9IHJlcXVpcmUoJ2tub2Nrb3V0Jyk7XG5cbnZhciBTdG9ja01hcmtldFZpZXdNb2RlbCA9IHJlcXVpcmUoJy4vc3RvY2ttYXJrZXQtdmlldy1tb2RlbC5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc3RvY2tNYXJrZXRWaWV3TW9kZWw7XG5cbiAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgc3RvY2tNYXJrZXRWaWV3TW9kZWwgPSBuZXcgU3RvY2tNYXJrZXRWaWV3TW9kZWwoKTtcbiAgICBrby5hcHBseUJpbmRpbmdzKHN0b2NrTWFya2V0Vmlld01vZGVsKTtcbiAgfSlcbn0iLCIndXNlIHN0cmljdCc7XG5cbnZhciBrbyA9IHJlcXVpcmUoJ2tub2Nrb3V0Jyk7XG5cbmZ1bmN0aW9uIE9yZGVyKGRhdGEpIHtcbiAgdGhpcy5wcmljZSA9IGRhdGEucHJpY2U7XG4gIHRoaXMuZml4ZWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcbiAgdGhpcy5zaWRlID0gZGF0YS5zaWRlO1xuICB0aGlzLnNwcmVhZCA9IGtvLm9ic2VydmFibGUoKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBPcmRlcjsiLCIndXNlIHN0cmljdCc7XG5cbnZhciBrbyA9IHJlcXVpcmUoJ2tub2Nrb3V0Jyk7XG52YXIgZDMgPSByZXF1aXJlKCdkMycpO1xudmFyICQgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy4kIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC4kIDogbnVsbCk7XG5yZXF1aXJlKCcuL3ZlbmRvci9qcXVlcnktdWkuanMnKTtcbnZhciBPcmRlciA9IHJlcXVpcmUoJy4vb3JkZXIuanMnKTtcblxuZnVuY3Rpb24gU3RvY2tNYXJrZXRWaWV3TW9kZWwoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcblxuICBzZWxmLm9yZGVycyA9IGtvLm9ic2VydmFibGVBcnJheShbXSk7XG5cbiAgc2VsZi5hZGRPcmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBuZXdPcmRlciA9IGdlbmVyYXRlT3JkZXIoKTtcbiAgICBzZWxmLm9yZGVycy5wdXNoKG5ld09yZGVyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlT3JkZXIoKSB7XG4gICAgdmFyIHByaWNlTWVhbiA9IDE5LjAyO1xuICAgIHZhciBwcmljZVN0ZGV2ID0gNDtcblxuICAgIHZhciBzaWRlID0gTWF0aC5yYW5kb20oKSA8IDAuNSA/ICdiaWQnIDogJ2Fzayc7XG4gICAgdmFyIHByaWNlID0gZDMucmFuZG9tLm5vcm1hbChwcmljZU1lYW4sIHByaWNlU3RkZXYpKCkudG9GaXhlZCgyKTtcblxuICAgIHJldHVybiBuZXcgT3JkZXIoe3ByaWNlOiBwcmljZSwgc2lkZTogc2lkZX0pXG4gIH1cblxuICBrby5iaW5kaW5nSGFuZGxlcnMuZHJhZ2Ryb3AgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oZWxlbWVudCwgdmFsdWVBY2Nlc3NvciwgYWxsQmluZGluZ3MsIHZpZXdNb2RlbCwgYmluZGluZ0NvbnRleHQpIHtcblxuICAgICAgdmFyIG9yZGVyRWwgPSAkKGVsZW1lbnQpO1xuXG4gICAgICB2YXIgZHJhZ0NvbmZpZyA9IHtcbiAgICAgICAgcmV2ZXJ0OiBcImludmFsaWRcIixcbiAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgc25hcDogXCIudWktZHJvcHBhYmxlXCIsXG4gICAgICAgIHNuYXBNb2RlOiBcImlubmVyXCJcbiAgICAgIH07XG5cbiAgICAgIHZhciBkcm9wQ29uZmlnID0ge1xuICAgICAgICBvdmVyOiBmdW5jdGlvbihldmVudCwgdWkpIHtcbiAgICAgICAgICB2YXIgZHJhZ0VsID0gdWkuZHJhZ2dhYmxlWzBdO1xuICAgICAgICAgIHZhciBkcm9wRWwgPSBldmVudC50YXJnZXRcblxuICAgICAgICAgIHVwZGF0ZVNwcmVhZChkcmFnRWwsIGRyb3BFbClcbiAgICAgICAgfSxcbiAgICAgICAgb3V0OiBmdW5jdGlvbihldmVudCwgdWkpIHtcbiAgICAgICAgICBrby5kYXRhRm9yKHVpLmRyYWdnYWJsZVswXSkuc3ByZWFkKGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdmlld01vZGVsLnNpZGUgPT09ICdhc2snID8gb3JkZXJFbC5kcmFnZ2FibGUoZHJhZ0NvbmZpZykgOiBvcmRlckVsLmRyb3BwYWJsZShkcm9wQ29uZmlnKTtcblxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZVNwcmVhZChkcmFnLCBkcm9wKSB7XG4gICAgdmFyIHNwcmVhZCA9IGtvLmRhdGFGb3IoZHJvcCkucHJpY2UgLSBrby5kYXRhRm9yKGRyYWcpLnByaWNlO1xuICAgIGtvLmRhdGFGb3IoZHJhZykuc3ByZWFkKHNwcmVhZCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTdG9ja01hcmtldFZpZXdNb2RlbDsiLCIvKiEgalF1ZXJ5IFVJIC0gdjEuMTEuMyAtIDIwMTUtMDItMjVcbiogaHR0cDovL2pxdWVyeXVpLmNvbVxuKiBJbmNsdWRlczogY29yZS5qcywgd2lkZ2V0LmpzLCBtb3VzZS5qcywgZHJhZ2dhYmxlLmpzLCBkcm9wcGFibGUuanNcbiogQ29weXJpZ2h0IDIwMTUgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9yczsgTGljZW5zZWQgTUlUICovXG5cbihmdW5jdGlvbiggZmFjdG9yeSApIHtcbiAgaWYgKCB0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCApIHtcblxuICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICBkZWZpbmUoWyBcImpxdWVyeVwiIF0sIGZhY3RvcnkgKTtcbiAgfSBlbHNlIHtcblxuICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xuICAgIGZhY3RvcnkoIGpRdWVyeSApO1xuICB9XG59KGZ1bmN0aW9uKCAkICkge1xuLyohXG4gKiBqUXVlcnkgVUkgQ29yZSAxLjExLjNcbiAqIGh0dHA6Ly9qcXVlcnl1aS5jb21cbiAqXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9yc1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogaHR0cDovL2pxdWVyeS5vcmcvbGljZW5zZVxuICpcbiAqIGh0dHA6Ly9hcGkuanF1ZXJ5dWkuY29tL2NhdGVnb3J5L3VpLWNvcmUvXG4gKi9cblxuXG4vLyAkLnVpIG1pZ2h0IGV4aXN0IGZyb20gY29tcG9uZW50cyB3aXRoIG5vIGRlcGVuZGVuY2llcywgZS5nLiwgJC51aS5wb3NpdGlvblxuJC51aSA9ICQudWkgfHwge307XG5cbiQuZXh0ZW5kKCAkLnVpLCB7XG4gIHZlcnNpb246IFwiMS4xMS4zXCIsXG5cbiAga2V5Q29kZToge1xuICAgIEJBQ0tTUEFDRTogOCxcbiAgICBDT01NQTogMTg4LFxuICAgIERFTEVURTogNDYsXG4gICAgRE9XTjogNDAsXG4gICAgRU5EOiAzNSxcbiAgICBFTlRFUjogMTMsXG4gICAgRVNDQVBFOiAyNyxcbiAgICBIT01FOiAzNixcbiAgICBMRUZUOiAzNyxcbiAgICBQQUdFX0RPV046IDM0LFxuICAgIFBBR0VfVVA6IDMzLFxuICAgIFBFUklPRDogMTkwLFxuICAgIFJJR0hUOiAzOSxcbiAgICBTUEFDRTogMzIsXG4gICAgVEFCOiA5LFxuICAgIFVQOiAzOFxuICB9XG59KTtcblxuLy8gcGx1Z2luc1xuJC5mbi5leHRlbmQoe1xuICBzY3JvbGxQYXJlbnQ6IGZ1bmN0aW9uKCBpbmNsdWRlSGlkZGVuICkge1xuICAgIHZhciBwb3NpdGlvbiA9IHRoaXMuY3NzKCBcInBvc2l0aW9uXCIgKSxcbiAgICAgIGV4Y2x1ZGVTdGF0aWNQYXJlbnQgPSBwb3NpdGlvbiA9PT0gXCJhYnNvbHV0ZVwiLFxuICAgICAgb3ZlcmZsb3dSZWdleCA9IGluY2x1ZGVIaWRkZW4gPyAvKGF1dG98c2Nyb2xsfGhpZGRlbikvIDogLyhhdXRvfHNjcm9sbCkvLFxuICAgICAgc2Nyb2xsUGFyZW50ID0gdGhpcy5wYXJlbnRzKCkuZmlsdGVyKCBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHBhcmVudCA9ICQoIHRoaXMgKTtcbiAgICAgICAgaWYgKCBleGNsdWRlU3RhdGljUGFyZW50ICYmIHBhcmVudC5jc3MoIFwicG9zaXRpb25cIiApID09PSBcInN0YXRpY1wiICkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3ZlcmZsb3dSZWdleC50ZXN0KCBwYXJlbnQuY3NzKCBcIm92ZXJmbG93XCIgKSArIHBhcmVudC5jc3MoIFwib3ZlcmZsb3cteVwiICkgKyBwYXJlbnQuY3NzKCBcIm92ZXJmbG93LXhcIiApICk7XG4gICAgICB9KS5lcSggMCApO1xuXG4gICAgcmV0dXJuIHBvc2l0aW9uID09PSBcImZpeGVkXCIgfHwgIXNjcm9sbFBhcmVudC5sZW5ndGggPyAkKCB0aGlzWyAwIF0ub3duZXJEb2N1bWVudCB8fCBkb2N1bWVudCApIDogc2Nyb2xsUGFyZW50O1xuICB9LFxuXG4gIHVuaXF1ZUlkOiAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHV1aWQgPSAwO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCAhdGhpcy5pZCApIHtcbiAgICAgICAgICB0aGlzLmlkID0gXCJ1aS1pZC1cIiArICggKyt1dWlkICk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gIH0pKCksXG5cbiAgcmVtb3ZlVW5pcXVlSWQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIC9edWktaWQtXFxkKyQvLnRlc3QoIHRoaXMuaWQgKSApIHtcbiAgICAgICAgJCggdGhpcyApLnJlbW92ZUF0dHIoIFwiaWRcIiApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59KTtcblxuLy8gc2VsZWN0b3JzXG5mdW5jdGlvbiBmb2N1c2FibGUoIGVsZW1lbnQsIGlzVGFiSW5kZXhOb3ROYU4gKSB7XG4gIHZhciBtYXAsIG1hcE5hbWUsIGltZyxcbiAgICBub2RlTmFtZSA9IGVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcbiAgaWYgKCBcImFyZWFcIiA9PT0gbm9kZU5hbWUgKSB7XG4gICAgbWFwID0gZWxlbWVudC5wYXJlbnROb2RlO1xuICAgIG1hcE5hbWUgPSBtYXAubmFtZTtcbiAgICBpZiAoICFlbGVtZW50LmhyZWYgfHwgIW1hcE5hbWUgfHwgbWFwLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgIT09IFwibWFwXCIgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGltZyA9ICQoIFwiaW1nW3VzZW1hcD0nI1wiICsgbWFwTmFtZSArIFwiJ11cIiApWyAwIF07XG4gICAgcmV0dXJuICEhaW1nICYmIHZpc2libGUoIGltZyApO1xuICB9XG4gIHJldHVybiAoIC9eKGlucHV0fHNlbGVjdHx0ZXh0YXJlYXxidXR0b258b2JqZWN0KSQvLnRlc3QoIG5vZGVOYW1lICkgP1xuICAgICFlbGVtZW50LmRpc2FibGVkIDpcbiAgICBcImFcIiA9PT0gbm9kZU5hbWUgP1xuICAgICAgZWxlbWVudC5ocmVmIHx8IGlzVGFiSW5kZXhOb3ROYU4gOlxuICAgICAgaXNUYWJJbmRleE5vdE5hTikgJiZcbiAgICAvLyB0aGUgZWxlbWVudCBhbmQgYWxsIG9mIGl0cyBhbmNlc3RvcnMgbXVzdCBiZSB2aXNpYmxlXG4gICAgdmlzaWJsZSggZWxlbWVudCApO1xufVxuXG5mdW5jdGlvbiB2aXNpYmxlKCBlbGVtZW50ICkge1xuICByZXR1cm4gJC5leHByLmZpbHRlcnMudmlzaWJsZSggZWxlbWVudCApICYmXG4gICAgISQoIGVsZW1lbnQgKS5wYXJlbnRzKCkuYWRkQmFjaygpLmZpbHRlcihmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAkLmNzcyggdGhpcywgXCJ2aXNpYmlsaXR5XCIgKSA9PT0gXCJoaWRkZW5cIjtcbiAgICB9KS5sZW5ndGg7XG59XG5cbiQuZXh0ZW5kKCAkLmV4cHJbIFwiOlwiIF0sIHtcbiAgZGF0YTogJC5leHByLmNyZWF0ZVBzZXVkbyA/XG4gICAgJC5leHByLmNyZWF0ZVBzZXVkbyhmdW5jdGlvbiggZGF0YU5hbWUgKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oIGVsZW0gKSB7XG4gICAgICAgIHJldHVybiAhISQuZGF0YSggZWxlbSwgZGF0YU5hbWUgKTtcbiAgICAgIH07XG4gICAgfSkgOlxuICAgIC8vIHN1cHBvcnQ6IGpRdWVyeSA8MS44XG4gICAgZnVuY3Rpb24oIGVsZW0sIGksIG1hdGNoICkge1xuICAgICAgcmV0dXJuICEhJC5kYXRhKCBlbGVtLCBtYXRjaFsgMyBdICk7XG4gICAgfSxcblxuICBmb2N1c2FibGU6IGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuICAgIHJldHVybiBmb2N1c2FibGUoIGVsZW1lbnQsICFpc05hTiggJC5hdHRyKCBlbGVtZW50LCBcInRhYmluZGV4XCIgKSApICk7XG4gIH0sXG5cbiAgdGFiYmFibGU6IGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuICAgIHZhciB0YWJJbmRleCA9ICQuYXR0ciggZWxlbWVudCwgXCJ0YWJpbmRleFwiICksXG4gICAgICBpc1RhYkluZGV4TmFOID0gaXNOYU4oIHRhYkluZGV4ICk7XG4gICAgcmV0dXJuICggaXNUYWJJbmRleE5hTiB8fCB0YWJJbmRleCA+PSAwICkgJiYgZm9jdXNhYmxlKCBlbGVtZW50LCAhaXNUYWJJbmRleE5hTiApO1xuICB9XG59KTtcblxuLy8gc3VwcG9ydDogalF1ZXJ5IDwxLjhcbmlmICggISQoIFwiPGE+XCIgKS5vdXRlcldpZHRoKCAxICkuanF1ZXJ5ICkge1xuICAkLmVhY2goIFsgXCJXaWR0aFwiLCBcIkhlaWdodFwiIF0sIGZ1bmN0aW9uKCBpLCBuYW1lICkge1xuICAgIHZhciBzaWRlID0gbmFtZSA9PT0gXCJXaWR0aFwiID8gWyBcIkxlZnRcIiwgXCJSaWdodFwiIF0gOiBbIFwiVG9wXCIsIFwiQm90dG9tXCIgXSxcbiAgICAgIHR5cGUgPSBuYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICBvcmlnID0ge1xuICAgICAgICBpbm5lcldpZHRoOiAkLmZuLmlubmVyV2lkdGgsXG4gICAgICAgIGlubmVySGVpZ2h0OiAkLmZuLmlubmVySGVpZ2h0LFxuICAgICAgICBvdXRlcldpZHRoOiAkLmZuLm91dGVyV2lkdGgsXG4gICAgICAgIG91dGVySGVpZ2h0OiAkLmZuLm91dGVySGVpZ2h0XG4gICAgICB9O1xuXG4gICAgZnVuY3Rpb24gcmVkdWNlKCBlbGVtLCBzaXplLCBib3JkZXIsIG1hcmdpbiApIHtcbiAgICAgICQuZWFjaCggc2lkZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIHNpemUgLT0gcGFyc2VGbG9hdCggJC5jc3MoIGVsZW0sIFwicGFkZGluZ1wiICsgdGhpcyApICkgfHwgMDtcbiAgICAgICAgaWYgKCBib3JkZXIgKSB7XG4gICAgICAgICAgc2l6ZSAtPSBwYXJzZUZsb2F0KCAkLmNzcyggZWxlbSwgXCJib3JkZXJcIiArIHRoaXMgKyBcIldpZHRoXCIgKSApIHx8IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBtYXJnaW4gKSB7XG4gICAgICAgICAgc2l6ZSAtPSBwYXJzZUZsb2F0KCAkLmNzcyggZWxlbSwgXCJtYXJnaW5cIiArIHRoaXMgKSApIHx8IDA7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHNpemU7XG4gICAgfVxuXG4gICAgJC5mblsgXCJpbm5lclwiICsgbmFtZSBdID0gZnVuY3Rpb24oIHNpemUgKSB7XG4gICAgICBpZiAoIHNpemUgPT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgcmV0dXJuIG9yaWdbIFwiaW5uZXJcIiArIG5hbWUgXS5jYWxsKCB0aGlzICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICQoIHRoaXMgKS5jc3MoIHR5cGUsIHJlZHVjZSggdGhpcywgc2l6ZSApICsgXCJweFwiICk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgJC5mblsgXCJvdXRlclwiICsgbmFtZV0gPSBmdW5jdGlvbiggc2l6ZSwgbWFyZ2luICkge1xuICAgICAgaWYgKCB0eXBlb2Ygc2l6ZSAhPT0gXCJudW1iZXJcIiApIHtcbiAgICAgICAgcmV0dXJuIG9yaWdbIFwib3V0ZXJcIiArIG5hbWUgXS5jYWxsKCB0aGlzLCBzaXplICk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICQoIHRoaXMpLmNzcyggdHlwZSwgcmVkdWNlKCB0aGlzLCBzaXplLCB0cnVlLCBtYXJnaW4gKSArIFwicHhcIiApO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSk7XG59XG5cbi8vIHN1cHBvcnQ6IGpRdWVyeSA8MS44XG5pZiAoICEkLmZuLmFkZEJhY2sgKSB7XG4gICQuZm4uYWRkQmFjayA9IGZ1bmN0aW9uKCBzZWxlY3RvciApIHtcbiAgICByZXR1cm4gdGhpcy5hZGQoIHNlbGVjdG9yID09IG51bGwgP1xuICAgICAgdGhpcy5wcmV2T2JqZWN0IDogdGhpcy5wcmV2T2JqZWN0LmZpbHRlciggc2VsZWN0b3IgKVxuICAgICk7XG4gIH07XG59XG5cbi8vIHN1cHBvcnQ6IGpRdWVyeSAxLjYuMSwgMS42LjIgKGh0dHA6Ly9idWdzLmpxdWVyeS5jb20vdGlja2V0Lzk0MTMpXG5pZiAoICQoIFwiPGE+XCIgKS5kYXRhKCBcImEtYlwiLCBcImFcIiApLnJlbW92ZURhdGEoIFwiYS1iXCIgKS5kYXRhKCBcImEtYlwiICkgKSB7XG4gICQuZm4ucmVtb3ZlRGF0YSA9IChmdW5jdGlvbiggcmVtb3ZlRGF0YSApIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oIGtleSApIHtcbiAgICAgIGlmICggYXJndW1lbnRzLmxlbmd0aCApIHtcbiAgICAgICAgcmV0dXJuIHJlbW92ZURhdGEuY2FsbCggdGhpcywgJC5jYW1lbENhc2UoIGtleSApICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVtb3ZlRGF0YS5jYWxsKCB0aGlzICk7XG4gICAgICB9XG4gICAgfTtcbiAgfSkoICQuZm4ucmVtb3ZlRGF0YSApO1xufVxuXG4vLyBkZXByZWNhdGVkXG4kLnVpLmllID0gISEvbXNpZSBbXFx3Ll0rLy5leGVjKCBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkgKTtcblxuJC5mbi5leHRlbmQoe1xuICBmb2N1czogKGZ1bmN0aW9uKCBvcmlnICkge1xuICAgIHJldHVybiBmdW5jdGlvbiggZGVsYXksIGZuICkge1xuICAgICAgcmV0dXJuIHR5cGVvZiBkZWxheSA9PT0gXCJudW1iZXJcIiA/XG4gICAgICAgIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgZWxlbSA9IHRoaXM7XG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoIGVsZW0gKS5mb2N1cygpO1xuICAgICAgICAgICAgaWYgKCBmbiApIHtcbiAgICAgICAgICAgICAgZm4uY2FsbCggZWxlbSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIGRlbGF5ICk7XG4gICAgICAgIH0pIDpcbiAgICAgICAgb3JpZy5hcHBseSggdGhpcywgYXJndW1lbnRzICk7XG4gICAgfTtcbiAgfSkoICQuZm4uZm9jdXMgKSxcblxuICBkaXNhYmxlU2VsZWN0aW9uOiAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGV2ZW50VHlwZSA9IFwib25zZWxlY3RzdGFydFwiIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKSA/XG4gICAgICBcInNlbGVjdHN0YXJ0XCIgOlxuICAgICAgXCJtb3VzZWRvd25cIjtcblxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLmJpbmQoIGV2ZW50VHlwZSArIFwiLnVpLWRpc2FibGVTZWxlY3Rpb25cIiwgZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSkoKSxcblxuICBlbmFibGVTZWxlY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnVuYmluZCggXCIudWktZGlzYWJsZVNlbGVjdGlvblwiICk7XG4gIH0sXG5cbiAgekluZGV4OiBmdW5jdGlvbiggekluZGV4ICkge1xuICAgIGlmICggekluZGV4ICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICByZXR1cm4gdGhpcy5jc3MoIFwiekluZGV4XCIsIHpJbmRleCApO1xuICAgIH1cblxuICAgIGlmICggdGhpcy5sZW5ndGggKSB7XG4gICAgICB2YXIgZWxlbSA9ICQoIHRoaXNbIDAgXSApLCBwb3NpdGlvbiwgdmFsdWU7XG4gICAgICB3aGlsZSAoIGVsZW0ubGVuZ3RoICYmIGVsZW1bIDAgXSAhPT0gZG9jdW1lbnQgKSB7XG4gICAgICAgIC8vIElnbm9yZSB6LWluZGV4IGlmIHBvc2l0aW9uIGlzIHNldCB0byBhIHZhbHVlIHdoZXJlIHotaW5kZXggaXMgaWdub3JlZCBieSB0aGUgYnJvd3NlclxuICAgICAgICAvLyBUaGlzIG1ha2VzIGJlaGF2aW9yIG9mIHRoaXMgZnVuY3Rpb24gY29uc2lzdGVudCBhY3Jvc3MgYnJvd3NlcnNcbiAgICAgICAgLy8gV2ViS2l0IGFsd2F5cyByZXR1cm5zIGF1dG8gaWYgdGhlIGVsZW1lbnQgaXMgcG9zaXRpb25lZFxuICAgICAgICBwb3NpdGlvbiA9IGVsZW0uY3NzKCBcInBvc2l0aW9uXCIgKTtcbiAgICAgICAgaWYgKCBwb3NpdGlvbiA9PT0gXCJhYnNvbHV0ZVwiIHx8IHBvc2l0aW9uID09PSBcInJlbGF0aXZlXCIgfHwgcG9zaXRpb24gPT09IFwiZml4ZWRcIiApIHtcbiAgICAgICAgICAvLyBJRSByZXR1cm5zIDAgd2hlbiB6SW5kZXggaXMgbm90IHNwZWNpZmllZFxuICAgICAgICAgIC8vIG90aGVyIGJyb3dzZXJzIHJldHVybiBhIHN0cmluZ1xuICAgICAgICAgIC8vIHdlIGlnbm9yZSB0aGUgY2FzZSBvZiBuZXN0ZWQgZWxlbWVudHMgd2l0aCBhbiBleHBsaWNpdCB2YWx1ZSBvZiAwXG4gICAgICAgICAgLy8gPGRpdiBzdHlsZT1cInotaW5kZXg6IC0xMDtcIj48ZGl2IHN0eWxlPVwiei1pbmRleDogMDtcIj48L2Rpdj48L2Rpdj5cbiAgICAgICAgICB2YWx1ZSA9IHBhcnNlSW50KCBlbGVtLmNzcyggXCJ6SW5kZXhcIiApLCAxMCApO1xuICAgICAgICAgIGlmICggIWlzTmFOKCB2YWx1ZSApICYmIHZhbHVlICE9PSAwICkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbGVtID0gZWxlbS5wYXJlbnQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxufSk7XG5cbi8vICQudWkucGx1Z2luIGlzIGRlcHJlY2F0ZWQuIFVzZSAkLndpZGdldCgpIGV4dGVuc2lvbnMgaW5zdGVhZC5cbiQudWkucGx1Z2luID0ge1xuICBhZGQ6IGZ1bmN0aW9uKCBtb2R1bGUsIG9wdGlvbiwgc2V0ICkge1xuICAgIHZhciBpLFxuICAgICAgcHJvdG8gPSAkLnVpWyBtb2R1bGUgXS5wcm90b3R5cGU7XG4gICAgZm9yICggaSBpbiBzZXQgKSB7XG4gICAgICBwcm90by5wbHVnaW5zWyBpIF0gPSBwcm90by5wbHVnaW5zWyBpIF0gfHwgW107XG4gICAgICBwcm90by5wbHVnaW5zWyBpIF0ucHVzaCggWyBvcHRpb24sIHNldFsgaSBdIF0gKTtcbiAgICB9XG4gIH0sXG4gIGNhbGw6IGZ1bmN0aW9uKCBpbnN0YW5jZSwgbmFtZSwgYXJncywgYWxsb3dEaXNjb25uZWN0ZWQgKSB7XG4gICAgdmFyIGksXG4gICAgICBzZXQgPSBpbnN0YW5jZS5wbHVnaW5zWyBuYW1lIF07XG5cbiAgICBpZiAoICFzZXQgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCAhYWxsb3dEaXNjb25uZWN0ZWQgJiYgKCAhaW5zdGFuY2UuZWxlbWVudFsgMCBdLnBhcmVudE5vZGUgfHwgaW5zdGFuY2UuZWxlbWVudFsgMCBdLnBhcmVudE5vZGUubm9kZVR5cGUgPT09IDExICkgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yICggaSA9IDA7IGkgPCBzZXQubGVuZ3RoOyBpKysgKSB7XG4gICAgICBpZiAoIGluc3RhbmNlLm9wdGlvbnNbIHNldFsgaSBdWyAwIF0gXSApIHtcbiAgICAgICAgc2V0WyBpIF1bIDEgXS5hcHBseSggaW5zdGFuY2UuZWxlbWVudCwgYXJncyApO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuXG4vKiFcbiAqIGpRdWVyeSBVSSBXaWRnZXQgMS4xMS4zXG4gKiBodHRwOi8vanF1ZXJ5dWkuY29tXG4gKlxuICogQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnNcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZS5cbiAqIGh0dHA6Ly9qcXVlcnkub3JnL2xpY2Vuc2VcbiAqXG4gKiBodHRwOi8vYXBpLmpxdWVyeXVpLmNvbS9qUXVlcnkud2lkZ2V0L1xuICovXG5cblxudmFyIHdpZGdldF91dWlkID0gMCxcbiAgd2lkZ2V0X3NsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG4kLmNsZWFuRGF0YSA9IChmdW5jdGlvbiggb3JpZyApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKCBlbGVtcyApIHtcbiAgICB2YXIgZXZlbnRzLCBlbGVtLCBpO1xuICAgIGZvciAoIGkgPSAwOyAoZWxlbSA9IGVsZW1zW2ldKSAhPSBudWxsOyBpKysgKSB7XG4gICAgICB0cnkge1xuXG4gICAgICAgIC8vIE9ubHkgdHJpZ2dlciByZW1vdmUgd2hlbiBuZWNlc3NhcnkgdG8gc2F2ZSB0aW1lXG4gICAgICAgIGV2ZW50cyA9ICQuX2RhdGEoIGVsZW0sIFwiZXZlbnRzXCIgKTtcbiAgICAgICAgaWYgKCBldmVudHMgJiYgZXZlbnRzLnJlbW92ZSApIHtcbiAgICAgICAgICAkKCBlbGVtICkudHJpZ2dlckhhbmRsZXIoIFwicmVtb3ZlXCIgKTtcbiAgICAgICAgfVxuXG4gICAgICAvLyBodHRwOi8vYnVncy5qcXVlcnkuY29tL3RpY2tldC84MjM1XG4gICAgICB9IGNhdGNoICggZSApIHt9XG4gICAgfVxuICAgIG9yaWcoIGVsZW1zICk7XG4gIH07XG59KSggJC5jbGVhbkRhdGEgKTtcblxuJC53aWRnZXQgPSBmdW5jdGlvbiggbmFtZSwgYmFzZSwgcHJvdG90eXBlICkge1xuICB2YXIgZnVsbE5hbWUsIGV4aXN0aW5nQ29uc3RydWN0b3IsIGNvbnN0cnVjdG9yLCBiYXNlUHJvdG90eXBlLFxuICAgIC8vIHByb3hpZWRQcm90b3R5cGUgYWxsb3dzIHRoZSBwcm92aWRlZCBwcm90b3R5cGUgdG8gcmVtYWluIHVubW9kaWZpZWRcbiAgICAvLyBzbyB0aGF0IGl0IGNhbiBiZSB1c2VkIGFzIGEgbWl4aW4gZm9yIG11bHRpcGxlIHdpZGdldHMgKCM4ODc2KVxuICAgIHByb3hpZWRQcm90b3R5cGUgPSB7fSxcbiAgICBuYW1lc3BhY2UgPSBuYW1lLnNwbGl0KCBcIi5cIiApWyAwIF07XG5cbiAgbmFtZSA9IG5hbWUuc3BsaXQoIFwiLlwiIClbIDEgXTtcbiAgZnVsbE5hbWUgPSBuYW1lc3BhY2UgKyBcIi1cIiArIG5hbWU7XG5cbiAgaWYgKCAhcHJvdG90eXBlICkge1xuICAgIHByb3RvdHlwZSA9IGJhc2U7XG4gICAgYmFzZSA9ICQuV2lkZ2V0O1xuICB9XG5cbiAgLy8gY3JlYXRlIHNlbGVjdG9yIGZvciBwbHVnaW5cbiAgJC5leHByWyBcIjpcIiBdWyBmdWxsTmFtZS50b0xvd2VyQ2FzZSgpIF0gPSBmdW5jdGlvbiggZWxlbSApIHtcbiAgICByZXR1cm4gISEkLmRhdGEoIGVsZW0sIGZ1bGxOYW1lICk7XG4gIH07XG5cbiAgJFsgbmFtZXNwYWNlIF0gPSAkWyBuYW1lc3BhY2UgXSB8fCB7fTtcbiAgZXhpc3RpbmdDb25zdHJ1Y3RvciA9ICRbIG5hbWVzcGFjZSBdWyBuYW1lIF07XG4gIGNvbnN0cnVjdG9yID0gJFsgbmFtZXNwYWNlIF1bIG5hbWUgXSA9IGZ1bmN0aW9uKCBvcHRpb25zLCBlbGVtZW50ICkge1xuICAgIC8vIGFsbG93IGluc3RhbnRpYXRpb24gd2l0aG91dCBcIm5ld1wiIGtleXdvcmRcbiAgICBpZiAoICF0aGlzLl9jcmVhdGVXaWRnZXQgKSB7XG4gICAgICByZXR1cm4gbmV3IGNvbnN0cnVjdG9yKCBvcHRpb25zLCBlbGVtZW50ICk7XG4gICAgfVxuXG4gICAgLy8gYWxsb3cgaW5zdGFudGlhdGlvbiB3aXRob3V0IGluaXRpYWxpemluZyBmb3Igc2ltcGxlIGluaGVyaXRhbmNlXG4gICAgLy8gbXVzdCB1c2UgXCJuZXdcIiBrZXl3b3JkICh0aGUgY29kZSBhYm92ZSBhbHdheXMgcGFzc2VzIGFyZ3MpXG4gICAgaWYgKCBhcmd1bWVudHMubGVuZ3RoICkge1xuICAgICAgdGhpcy5fY3JlYXRlV2lkZ2V0KCBvcHRpb25zLCBlbGVtZW50ICk7XG4gICAgfVxuICB9O1xuICAvLyBleHRlbmQgd2l0aCB0aGUgZXhpc3RpbmcgY29uc3RydWN0b3IgdG8gY2Fycnkgb3ZlciBhbnkgc3RhdGljIHByb3BlcnRpZXNcbiAgJC5leHRlbmQoIGNvbnN0cnVjdG9yLCBleGlzdGluZ0NvbnN0cnVjdG9yLCB7XG4gICAgdmVyc2lvbjogcHJvdG90eXBlLnZlcnNpb24sXG4gICAgLy8gY29weSB0aGUgb2JqZWN0IHVzZWQgdG8gY3JlYXRlIHRoZSBwcm90b3R5cGUgaW4gY2FzZSB3ZSBuZWVkIHRvXG4gICAgLy8gcmVkZWZpbmUgdGhlIHdpZGdldCBsYXRlclxuICAgIF9wcm90bzogJC5leHRlbmQoIHt9LCBwcm90b3R5cGUgKSxcbiAgICAvLyB0cmFjayB3aWRnZXRzIHRoYXQgaW5oZXJpdCBmcm9tIHRoaXMgd2lkZ2V0IGluIGNhc2UgdGhpcyB3aWRnZXQgaXNcbiAgICAvLyByZWRlZmluZWQgYWZ0ZXIgYSB3aWRnZXQgaW5oZXJpdHMgZnJvbSBpdFxuICAgIF9jaGlsZENvbnN0cnVjdG9yczogW11cbiAgfSk7XG5cbiAgYmFzZVByb3RvdHlwZSA9IG5ldyBiYXNlKCk7XG4gIC8vIHdlIG5lZWQgdG8gbWFrZSB0aGUgb3B0aW9ucyBoYXNoIGEgcHJvcGVydHkgZGlyZWN0bHkgb24gdGhlIG5ldyBpbnN0YW5jZVxuICAvLyBvdGhlcndpc2Ugd2UnbGwgbW9kaWZ5IHRoZSBvcHRpb25zIGhhc2ggb24gdGhlIHByb3RvdHlwZSB0aGF0IHdlJ3JlXG4gIC8vIGluaGVyaXRpbmcgZnJvbVxuICBiYXNlUHJvdG90eXBlLm9wdGlvbnMgPSAkLndpZGdldC5leHRlbmQoIHt9LCBiYXNlUHJvdG90eXBlLm9wdGlvbnMgKTtcbiAgJC5lYWNoKCBwcm90b3R5cGUsIGZ1bmN0aW9uKCBwcm9wLCB2YWx1ZSApIHtcbiAgICBpZiAoICEkLmlzRnVuY3Rpb24oIHZhbHVlICkgKSB7XG4gICAgICBwcm94aWVkUHJvdG90eXBlWyBwcm9wIF0gPSB2YWx1ZTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcHJveGllZFByb3RvdHlwZVsgcHJvcCBdID0gKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIF9zdXBlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBiYXNlLnByb3RvdHlwZVsgcHJvcCBdLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcbiAgICAgICAgfSxcbiAgICAgICAgX3N1cGVyQXBwbHkgPSBmdW5jdGlvbiggYXJncyApIHtcbiAgICAgICAgICByZXR1cm4gYmFzZS5wcm90b3R5cGVbIHByb3AgXS5hcHBseSggdGhpcywgYXJncyApO1xuICAgICAgICB9O1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgX19zdXBlciA9IHRoaXMuX3N1cGVyLFxuICAgICAgICAgIF9fc3VwZXJBcHBseSA9IHRoaXMuX3N1cGVyQXBwbHksXG4gICAgICAgICAgcmV0dXJuVmFsdWU7XG5cbiAgICAgICAgdGhpcy5fc3VwZXIgPSBfc3VwZXI7XG4gICAgICAgIHRoaXMuX3N1cGVyQXBwbHkgPSBfc3VwZXJBcHBseTtcblxuICAgICAgICByZXR1cm5WYWx1ZSA9IHZhbHVlLmFwcGx5KCB0aGlzLCBhcmd1bWVudHMgKTtcblxuICAgICAgICB0aGlzLl9zdXBlciA9IF9fc3VwZXI7XG4gICAgICAgIHRoaXMuX3N1cGVyQXBwbHkgPSBfX3N1cGVyQXBwbHk7XG5cbiAgICAgICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICAgICAgfTtcbiAgICB9KSgpO1xuICB9KTtcbiAgY29uc3RydWN0b3IucHJvdG90eXBlID0gJC53aWRnZXQuZXh0ZW5kKCBiYXNlUHJvdG90eXBlLCB7XG4gICAgLy8gVE9ETzogcmVtb3ZlIHN1cHBvcnQgZm9yIHdpZGdldEV2ZW50UHJlZml4XG4gICAgLy8gYWx3YXlzIHVzZSB0aGUgbmFtZSArIGEgY29sb24gYXMgdGhlIHByZWZpeCwgZS5nLiwgZHJhZ2dhYmxlOnN0YXJ0XG4gICAgLy8gZG9uJ3QgcHJlZml4IGZvciB3aWRnZXRzIHRoYXQgYXJlbid0IERPTS1iYXNlZFxuICAgIHdpZGdldEV2ZW50UHJlZml4OiBleGlzdGluZ0NvbnN0cnVjdG9yID8gKGJhc2VQcm90b3R5cGUud2lkZ2V0RXZlbnRQcmVmaXggfHwgbmFtZSkgOiBuYW1lXG4gIH0sIHByb3hpZWRQcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3RvcjogY29uc3RydWN0b3IsXG4gICAgbmFtZXNwYWNlOiBuYW1lc3BhY2UsXG4gICAgd2lkZ2V0TmFtZTogbmFtZSxcbiAgICB3aWRnZXRGdWxsTmFtZTogZnVsbE5hbWVcbiAgfSk7XG5cbiAgLy8gSWYgdGhpcyB3aWRnZXQgaXMgYmVpbmcgcmVkZWZpbmVkIHRoZW4gd2UgbmVlZCB0byBmaW5kIGFsbCB3aWRnZXRzIHRoYXRcbiAgLy8gYXJlIGluaGVyaXRpbmcgZnJvbSBpdCBhbmQgcmVkZWZpbmUgYWxsIG9mIHRoZW0gc28gdGhhdCB0aGV5IGluaGVyaXQgZnJvbVxuICAvLyB0aGUgbmV3IHZlcnNpb24gb2YgdGhpcyB3aWRnZXQuIFdlJ3JlIGVzc2VudGlhbGx5IHRyeWluZyB0byByZXBsYWNlIG9uZVxuICAvLyBsZXZlbCBpbiB0aGUgcHJvdG90eXBlIGNoYWluLlxuICBpZiAoIGV4aXN0aW5nQ29uc3RydWN0b3IgKSB7XG4gICAgJC5lYWNoKCBleGlzdGluZ0NvbnN0cnVjdG9yLl9jaGlsZENvbnN0cnVjdG9ycywgZnVuY3Rpb24oIGksIGNoaWxkICkge1xuICAgICAgdmFyIGNoaWxkUHJvdG90eXBlID0gY2hpbGQucHJvdG90eXBlO1xuXG4gICAgICAvLyByZWRlZmluZSB0aGUgY2hpbGQgd2lkZ2V0IHVzaW5nIHRoZSBzYW1lIHByb3RvdHlwZSB0aGF0IHdhc1xuICAgICAgLy8gb3JpZ2luYWxseSB1c2VkLCBidXQgaW5oZXJpdCBmcm9tIHRoZSBuZXcgdmVyc2lvbiBvZiB0aGUgYmFzZVxuICAgICAgJC53aWRnZXQoIGNoaWxkUHJvdG90eXBlLm5hbWVzcGFjZSArIFwiLlwiICsgY2hpbGRQcm90b3R5cGUud2lkZ2V0TmFtZSwgY29uc3RydWN0b3IsIGNoaWxkLl9wcm90byApO1xuICAgIH0pO1xuICAgIC8vIHJlbW92ZSB0aGUgbGlzdCBvZiBleGlzdGluZyBjaGlsZCBjb25zdHJ1Y3RvcnMgZnJvbSB0aGUgb2xkIGNvbnN0cnVjdG9yXG4gICAgLy8gc28gdGhlIG9sZCBjaGlsZCBjb25zdHJ1Y3RvcnMgY2FuIGJlIGdhcmJhZ2UgY29sbGVjdGVkXG4gICAgZGVsZXRlIGV4aXN0aW5nQ29uc3RydWN0b3IuX2NoaWxkQ29uc3RydWN0b3JzO1xuICB9IGVsc2Uge1xuICAgIGJhc2UuX2NoaWxkQ29uc3RydWN0b3JzLnB1c2goIGNvbnN0cnVjdG9yICk7XG4gIH1cblxuICAkLndpZGdldC5icmlkZ2UoIG5hbWUsIGNvbnN0cnVjdG9yICk7XG5cbiAgcmV0dXJuIGNvbnN0cnVjdG9yO1xufTtcblxuJC53aWRnZXQuZXh0ZW5kID0gZnVuY3Rpb24oIHRhcmdldCApIHtcbiAgdmFyIGlucHV0ID0gd2lkZ2V0X3NsaWNlLmNhbGwoIGFyZ3VtZW50cywgMSApLFxuICAgIGlucHV0SW5kZXggPSAwLFxuICAgIGlucHV0TGVuZ3RoID0gaW5wdXQubGVuZ3RoLFxuICAgIGtleSxcbiAgICB2YWx1ZTtcbiAgZm9yICggOyBpbnB1dEluZGV4IDwgaW5wdXRMZW5ndGg7IGlucHV0SW5kZXgrKyApIHtcbiAgICBmb3IgKCBrZXkgaW4gaW5wdXRbIGlucHV0SW5kZXggXSApIHtcbiAgICAgIHZhbHVlID0gaW5wdXRbIGlucHV0SW5kZXggXVsga2V5IF07XG4gICAgICBpZiAoIGlucHV0WyBpbnB1dEluZGV4IF0uaGFzT3duUHJvcGVydHkoIGtleSApICYmIHZhbHVlICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgIC8vIENsb25lIG9iamVjdHNcbiAgICAgICAgaWYgKCAkLmlzUGxhaW5PYmplY3QoIHZhbHVlICkgKSB7XG4gICAgICAgICAgdGFyZ2V0WyBrZXkgXSA9ICQuaXNQbGFpbk9iamVjdCggdGFyZ2V0WyBrZXkgXSApID9cbiAgICAgICAgICAgICQud2lkZ2V0LmV4dGVuZCgge30sIHRhcmdldFsga2V5IF0sIHZhbHVlICkgOlxuICAgICAgICAgICAgLy8gRG9uJ3QgZXh0ZW5kIHN0cmluZ3MsIGFycmF5cywgZXRjLiB3aXRoIG9iamVjdHNcbiAgICAgICAgICAgICQud2lkZ2V0LmV4dGVuZCgge30sIHZhbHVlICk7XG4gICAgICAgIC8vIENvcHkgZXZlcnl0aGluZyBlbHNlIGJ5IHJlZmVyZW5jZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRhcmdldFsga2V5IF0gPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdGFyZ2V0O1xufTtcblxuJC53aWRnZXQuYnJpZGdlID0gZnVuY3Rpb24oIG5hbWUsIG9iamVjdCApIHtcbiAgdmFyIGZ1bGxOYW1lID0gb2JqZWN0LnByb3RvdHlwZS53aWRnZXRGdWxsTmFtZSB8fCBuYW1lO1xuICAkLmZuWyBuYW1lIF0gPSBmdW5jdGlvbiggb3B0aW9ucyApIHtcbiAgICB2YXIgaXNNZXRob2RDYWxsID0gdHlwZW9mIG9wdGlvbnMgPT09IFwic3RyaW5nXCIsXG4gICAgICBhcmdzID0gd2lkZ2V0X3NsaWNlLmNhbGwoIGFyZ3VtZW50cywgMSApLFxuICAgICAgcmV0dXJuVmFsdWUgPSB0aGlzO1xuXG4gICAgaWYgKCBpc01ldGhvZENhbGwgKSB7XG4gICAgICB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtZXRob2RWYWx1ZSxcbiAgICAgICAgICBpbnN0YW5jZSA9ICQuZGF0YSggdGhpcywgZnVsbE5hbWUgKTtcbiAgICAgICAgaWYgKCBvcHRpb25zID09PSBcImluc3RhbmNlXCIgKSB7XG4gICAgICAgICAgcmV0dXJuVmFsdWUgPSBpbnN0YW5jZTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCAhaW5zdGFuY2UgKSB7XG4gICAgICAgICAgcmV0dXJuICQuZXJyb3IoIFwiY2Fubm90IGNhbGwgbWV0aG9kcyBvbiBcIiArIG5hbWUgKyBcIiBwcmlvciB0byBpbml0aWFsaXphdGlvbjsgXCIgK1xuICAgICAgICAgICAgXCJhdHRlbXB0ZWQgdG8gY2FsbCBtZXRob2QgJ1wiICsgb3B0aW9ucyArIFwiJ1wiICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCAhJC5pc0Z1bmN0aW9uKCBpbnN0YW5jZVtvcHRpb25zXSApIHx8IG9wdGlvbnMuY2hhckF0KCAwICkgPT09IFwiX1wiICkge1xuICAgICAgICAgIHJldHVybiAkLmVycm9yKCBcIm5vIHN1Y2ggbWV0aG9kICdcIiArIG9wdGlvbnMgKyBcIicgZm9yIFwiICsgbmFtZSArIFwiIHdpZGdldCBpbnN0YW5jZVwiICk7XG4gICAgICAgIH1cbiAgICAgICAgbWV0aG9kVmFsdWUgPSBpbnN0YW5jZVsgb3B0aW9ucyBdLmFwcGx5KCBpbnN0YW5jZSwgYXJncyApO1xuICAgICAgICBpZiAoIG1ldGhvZFZhbHVlICE9PSBpbnN0YW5jZSAmJiBtZXRob2RWYWx1ZSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgIHJldHVyblZhbHVlID0gbWV0aG9kVmFsdWUgJiYgbWV0aG9kVmFsdWUuanF1ZXJ5ID9cbiAgICAgICAgICAgIHJldHVyblZhbHVlLnB1c2hTdGFjayggbWV0aG9kVmFsdWUuZ2V0KCkgKSA6XG4gICAgICAgICAgICBtZXRob2RWYWx1ZTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG5cbiAgICAgIC8vIEFsbG93IG11bHRpcGxlIGhhc2hlcyB0byBiZSBwYXNzZWQgb24gaW5pdFxuICAgICAgaWYgKCBhcmdzLmxlbmd0aCApIHtcbiAgICAgICAgb3B0aW9ucyA9ICQud2lkZ2V0LmV4dGVuZC5hcHBseSggbnVsbCwgWyBvcHRpb25zIF0uY29uY2F0KGFyZ3MpICk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGluc3RhbmNlID0gJC5kYXRhKCB0aGlzLCBmdWxsTmFtZSApO1xuICAgICAgICBpZiAoIGluc3RhbmNlICkge1xuICAgICAgICAgIGluc3RhbmNlLm9wdGlvbiggb3B0aW9ucyB8fCB7fSApO1xuICAgICAgICAgIGlmICggaW5zdGFuY2UuX2luaXQgKSB7XG4gICAgICAgICAgICBpbnN0YW5jZS5faW5pdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkLmRhdGEoIHRoaXMsIGZ1bGxOYW1lLCBuZXcgb2JqZWN0KCBvcHRpb25zLCB0aGlzICkgKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9O1xufTtcblxuJC5XaWRnZXQgPSBmdW5jdGlvbiggLyogb3B0aW9ucywgZWxlbWVudCAqLyApIHt9O1xuJC5XaWRnZXQuX2NoaWxkQ29uc3RydWN0b3JzID0gW107XG5cbiQuV2lkZ2V0LnByb3RvdHlwZSA9IHtcbiAgd2lkZ2V0TmFtZTogXCJ3aWRnZXRcIixcbiAgd2lkZ2V0RXZlbnRQcmVmaXg6IFwiXCIsXG4gIGRlZmF1bHRFbGVtZW50OiBcIjxkaXY+XCIsXG4gIG9wdGlvbnM6IHtcbiAgICBkaXNhYmxlZDogZmFsc2UsXG5cbiAgICAvLyBjYWxsYmFja3NcbiAgICBjcmVhdGU6IG51bGxcbiAgfSxcbiAgX2NyZWF0ZVdpZGdldDogZnVuY3Rpb24oIG9wdGlvbnMsIGVsZW1lbnQgKSB7XG4gICAgZWxlbWVudCA9ICQoIGVsZW1lbnQgfHwgdGhpcy5kZWZhdWx0RWxlbWVudCB8fCB0aGlzIClbIDAgXTtcbiAgICB0aGlzLmVsZW1lbnQgPSAkKCBlbGVtZW50ICk7XG4gICAgdGhpcy51dWlkID0gd2lkZ2V0X3V1aWQrKztcbiAgICB0aGlzLmV2ZW50TmFtZXNwYWNlID0gXCIuXCIgKyB0aGlzLndpZGdldE5hbWUgKyB0aGlzLnV1aWQ7XG5cbiAgICB0aGlzLmJpbmRpbmdzID0gJCgpO1xuICAgIHRoaXMuaG92ZXJhYmxlID0gJCgpO1xuICAgIHRoaXMuZm9jdXNhYmxlID0gJCgpO1xuXG4gICAgaWYgKCBlbGVtZW50ICE9PSB0aGlzICkge1xuICAgICAgJC5kYXRhKCBlbGVtZW50LCB0aGlzLndpZGdldEZ1bGxOYW1lLCB0aGlzICk7XG4gICAgICB0aGlzLl9vbiggdHJ1ZSwgdGhpcy5lbGVtZW50LCB7XG4gICAgICAgIHJlbW92ZTogZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgICAgICAgIGlmICggZXZlbnQudGFyZ2V0ID09PSBlbGVtZW50ICkge1xuICAgICAgICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZG9jdW1lbnQgPSAkKCBlbGVtZW50LnN0eWxlID9cbiAgICAgICAgLy8gZWxlbWVudCB3aXRoaW4gdGhlIGRvY3VtZW50XG4gICAgICAgIGVsZW1lbnQub3duZXJEb2N1bWVudCA6XG4gICAgICAgIC8vIGVsZW1lbnQgaXMgd2luZG93IG9yIGRvY3VtZW50XG4gICAgICAgIGVsZW1lbnQuZG9jdW1lbnQgfHwgZWxlbWVudCApO1xuICAgICAgdGhpcy53aW5kb3cgPSAkKCB0aGlzLmRvY3VtZW50WzBdLmRlZmF1bHRWaWV3IHx8IHRoaXMuZG9jdW1lbnRbMF0ucGFyZW50V2luZG93ICk7XG4gICAgfVxuXG4gICAgdGhpcy5vcHRpb25zID0gJC53aWRnZXQuZXh0ZW5kKCB7fSxcbiAgICAgIHRoaXMub3B0aW9ucyxcbiAgICAgIHRoaXMuX2dldENyZWF0ZU9wdGlvbnMoKSxcbiAgICAgIG9wdGlvbnMgKTtcblxuICAgIHRoaXMuX2NyZWF0ZSgpO1xuICAgIHRoaXMuX3RyaWdnZXIoIFwiY3JlYXRlXCIsIG51bGwsIHRoaXMuX2dldENyZWF0ZUV2ZW50RGF0YSgpICk7XG4gICAgdGhpcy5faW5pdCgpO1xuICB9LFxuICBfZ2V0Q3JlYXRlT3B0aW9uczogJC5ub29wLFxuICBfZ2V0Q3JlYXRlRXZlbnREYXRhOiAkLm5vb3AsXG4gIF9jcmVhdGU6ICQubm9vcCxcbiAgX2luaXQ6ICQubm9vcCxcblxuICBkZXN0cm95OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9kZXN0cm95KCk7XG4gICAgLy8gd2UgY2FuIHByb2JhYmx5IHJlbW92ZSB0aGUgdW5iaW5kIGNhbGxzIGluIDIuMFxuICAgIC8vIGFsbCBldmVudCBiaW5kaW5ncyBzaG91bGQgZ28gdGhyb3VnaCB0aGlzLl9vbigpXG4gICAgdGhpcy5lbGVtZW50XG4gICAgICAudW5iaW5kKCB0aGlzLmV2ZW50TmFtZXNwYWNlIClcbiAgICAgIC5yZW1vdmVEYXRhKCB0aGlzLndpZGdldEZ1bGxOYW1lIClcbiAgICAgIC8vIHN1cHBvcnQ6IGpxdWVyeSA8MS42LjNcbiAgICAgIC8vIGh0dHA6Ly9idWdzLmpxdWVyeS5jb20vdGlja2V0Lzk0MTNcbiAgICAgIC5yZW1vdmVEYXRhKCAkLmNhbWVsQ2FzZSggdGhpcy53aWRnZXRGdWxsTmFtZSApICk7XG4gICAgdGhpcy53aWRnZXQoKVxuICAgICAgLnVuYmluZCggdGhpcy5ldmVudE5hbWVzcGFjZSApXG4gICAgICAucmVtb3ZlQXR0ciggXCJhcmlhLWRpc2FibGVkXCIgKVxuICAgICAgLnJlbW92ZUNsYXNzKFxuICAgICAgICB0aGlzLndpZGdldEZ1bGxOYW1lICsgXCItZGlzYWJsZWQgXCIgK1xuICAgICAgICBcInVpLXN0YXRlLWRpc2FibGVkXCIgKTtcblxuICAgIC8vIGNsZWFuIHVwIGV2ZW50cyBhbmQgc3RhdGVzXG4gICAgdGhpcy5iaW5kaW5ncy51bmJpbmQoIHRoaXMuZXZlbnROYW1lc3BhY2UgKTtcbiAgICB0aGlzLmhvdmVyYWJsZS5yZW1vdmVDbGFzcyggXCJ1aS1zdGF0ZS1ob3ZlclwiICk7XG4gICAgdGhpcy5mb2N1c2FibGUucmVtb3ZlQ2xhc3MoIFwidWktc3RhdGUtZm9jdXNcIiApO1xuICB9LFxuICBfZGVzdHJveTogJC5ub29wLFxuXG4gIHdpZGdldDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudDtcbiAgfSxcblxuICBvcHRpb246IGZ1bmN0aW9uKCBrZXksIHZhbHVlICkge1xuICAgIHZhciBvcHRpb25zID0ga2V5LFxuICAgICAgcGFydHMsXG4gICAgICBjdXJPcHRpb24sXG4gICAgICBpO1xuXG4gICAgaWYgKCBhcmd1bWVudHMubGVuZ3RoID09PSAwICkge1xuICAgICAgLy8gZG9uJ3QgcmV0dXJuIGEgcmVmZXJlbmNlIHRvIHRoZSBpbnRlcm5hbCBoYXNoXG4gICAgICByZXR1cm4gJC53aWRnZXQuZXh0ZW5kKCB7fSwgdGhpcy5vcHRpb25zICk7XG4gICAgfVxuXG4gICAgaWYgKCB0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiICkge1xuICAgICAgLy8gaGFuZGxlIG5lc3RlZCBrZXlzLCBlLmcuLCBcImZvby5iYXJcIiA9PiB7IGZvbzogeyBiYXI6IF9fXyB9IH1cbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgIHBhcnRzID0ga2V5LnNwbGl0KCBcIi5cIiApO1xuICAgICAga2V5ID0gcGFydHMuc2hpZnQoKTtcbiAgICAgIGlmICggcGFydHMubGVuZ3RoICkge1xuICAgICAgICBjdXJPcHRpb24gPSBvcHRpb25zWyBrZXkgXSA9ICQud2lkZ2V0LmV4dGVuZCgge30sIHRoaXMub3B0aW9uc1sga2V5IF0gKTtcbiAgICAgICAgZm9yICggaSA9IDA7IGkgPCBwYXJ0cy5sZW5ndGggLSAxOyBpKysgKSB7XG4gICAgICAgICAgY3VyT3B0aW9uWyBwYXJ0c1sgaSBdIF0gPSBjdXJPcHRpb25bIHBhcnRzWyBpIF0gXSB8fCB7fTtcbiAgICAgICAgICBjdXJPcHRpb24gPSBjdXJPcHRpb25bIHBhcnRzWyBpIF0gXTtcbiAgICAgICAgfVxuICAgICAgICBrZXkgPSBwYXJ0cy5wb3AoKTtcbiAgICAgICAgaWYgKCBhcmd1bWVudHMubGVuZ3RoID09PSAxICkge1xuICAgICAgICAgIHJldHVybiBjdXJPcHRpb25bIGtleSBdID09PSB1bmRlZmluZWQgPyBudWxsIDogY3VyT3B0aW9uWyBrZXkgXTtcbiAgICAgICAgfVxuICAgICAgICBjdXJPcHRpb25bIGtleSBdID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub3B0aW9uc1sga2V5IF0gPT09IHVuZGVmaW5lZCA/IG51bGwgOiB0aGlzLm9wdGlvbnNbIGtleSBdO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnNbIGtleSBdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fc2V0T3B0aW9ucyggb3B0aW9ucyApO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIF9zZXRPcHRpb25zOiBmdW5jdGlvbiggb3B0aW9ucyApIHtcbiAgICB2YXIga2V5O1xuXG4gICAgZm9yICgga2V5IGluIG9wdGlvbnMgKSB7XG4gICAgICB0aGlzLl9zZXRPcHRpb24oIGtleSwgb3B0aW9uc1sga2V5IF0gKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgX3NldE9wdGlvbjogZnVuY3Rpb24oIGtleSwgdmFsdWUgKSB7XG4gICAgdGhpcy5vcHRpb25zWyBrZXkgXSA9IHZhbHVlO1xuXG4gICAgaWYgKCBrZXkgPT09IFwiZGlzYWJsZWRcIiApIHtcbiAgICAgIHRoaXMud2lkZ2V0KClcbiAgICAgICAgLnRvZ2dsZUNsYXNzKCB0aGlzLndpZGdldEZ1bGxOYW1lICsgXCItZGlzYWJsZWRcIiwgISF2YWx1ZSApO1xuXG4gICAgICAvLyBJZiB0aGUgd2lkZ2V0IGlzIGJlY29taW5nIGRpc2FibGVkLCB0aGVuIG5vdGhpbmcgaXMgaW50ZXJhY3RpdmVcbiAgICAgIGlmICggdmFsdWUgKSB7XG4gICAgICAgIHRoaXMuaG92ZXJhYmxlLnJlbW92ZUNsYXNzKCBcInVpLXN0YXRlLWhvdmVyXCIgKTtcbiAgICAgICAgdGhpcy5mb2N1c2FibGUucmVtb3ZlQ2xhc3MoIFwidWktc3RhdGUtZm9jdXNcIiApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIGVuYWJsZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NldE9wdGlvbnMoeyBkaXNhYmxlZDogZmFsc2UgfSk7XG4gIH0sXG4gIGRpc2FibGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9zZXRPcHRpb25zKHsgZGlzYWJsZWQ6IHRydWUgfSk7XG4gIH0sXG5cbiAgX29uOiBmdW5jdGlvbiggc3VwcHJlc3NEaXNhYmxlZENoZWNrLCBlbGVtZW50LCBoYW5kbGVycyApIHtcbiAgICB2YXIgZGVsZWdhdGVFbGVtZW50LFxuICAgICAgaW5zdGFuY2UgPSB0aGlzO1xuXG4gICAgLy8gbm8gc3VwcHJlc3NEaXNhYmxlZENoZWNrIGZsYWcsIHNodWZmbGUgYXJndW1lbnRzXG4gICAgaWYgKCB0eXBlb2Ygc3VwcHJlc3NEaXNhYmxlZENoZWNrICE9PSBcImJvb2xlYW5cIiApIHtcbiAgICAgIGhhbmRsZXJzID0gZWxlbWVudDtcbiAgICAgIGVsZW1lbnQgPSBzdXBwcmVzc0Rpc2FibGVkQ2hlY2s7XG4gICAgICBzdXBwcmVzc0Rpc2FibGVkQ2hlY2sgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBubyBlbGVtZW50IGFyZ3VtZW50LCBzaHVmZmxlIGFuZCB1c2UgdGhpcy5lbGVtZW50XG4gICAgaWYgKCAhaGFuZGxlcnMgKSB7XG4gICAgICBoYW5kbGVycyA9IGVsZW1lbnQ7XG4gICAgICBlbGVtZW50ID0gdGhpcy5lbGVtZW50O1xuICAgICAgZGVsZWdhdGVFbGVtZW50ID0gdGhpcy53aWRnZXQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudCA9IGRlbGVnYXRlRWxlbWVudCA9ICQoIGVsZW1lbnQgKTtcbiAgICAgIHRoaXMuYmluZGluZ3MgPSB0aGlzLmJpbmRpbmdzLmFkZCggZWxlbWVudCApO1xuICAgIH1cblxuICAgICQuZWFjaCggaGFuZGxlcnMsIGZ1bmN0aW9uKCBldmVudCwgaGFuZGxlciApIHtcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZXJQcm94eSgpIHtcbiAgICAgICAgLy8gYWxsb3cgd2lkZ2V0cyB0byBjdXN0b21pemUgdGhlIGRpc2FibGVkIGhhbmRsaW5nXG4gICAgICAgIC8vIC0gZGlzYWJsZWQgYXMgYW4gYXJyYXkgaW5zdGVhZCBvZiBib29sZWFuXG4gICAgICAgIC8vIC0gZGlzYWJsZWQgY2xhc3MgYXMgbWV0aG9kIGZvciBkaXNhYmxpbmcgaW5kaXZpZHVhbCBwYXJ0c1xuICAgICAgICBpZiAoICFzdXBwcmVzc0Rpc2FibGVkQ2hlY2sgJiZcbiAgICAgICAgICAgICggaW5zdGFuY2Uub3B0aW9ucy5kaXNhYmxlZCA9PT0gdHJ1ZSB8fFxuICAgICAgICAgICAgICAkKCB0aGlzICkuaGFzQ2xhc3MoIFwidWktc3RhdGUtZGlzYWJsZWRcIiApICkgKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoIHR5cGVvZiBoYW5kbGVyID09PSBcInN0cmluZ1wiID8gaW5zdGFuY2VbIGhhbmRsZXIgXSA6IGhhbmRsZXIgKVxuICAgICAgICAgIC5hcHBseSggaW5zdGFuY2UsIGFyZ3VtZW50cyApO1xuICAgICAgfVxuXG4gICAgICAvLyBjb3B5IHRoZSBndWlkIHNvIGRpcmVjdCB1bmJpbmRpbmcgd29ya3NcbiAgICAgIGlmICggdHlwZW9mIGhhbmRsZXIgIT09IFwic3RyaW5nXCIgKSB7XG4gICAgICAgIGhhbmRsZXJQcm94eS5ndWlkID0gaGFuZGxlci5ndWlkID1cbiAgICAgICAgICBoYW5kbGVyLmd1aWQgfHwgaGFuZGxlclByb3h5Lmd1aWQgfHwgJC5ndWlkKys7XG4gICAgICB9XG5cbiAgICAgIHZhciBtYXRjaCA9IGV2ZW50Lm1hdGNoKCAvXihbXFx3Oi1dKilcXHMqKC4qKSQvICksXG4gICAgICAgIGV2ZW50TmFtZSA9IG1hdGNoWzFdICsgaW5zdGFuY2UuZXZlbnROYW1lc3BhY2UsXG4gICAgICAgIHNlbGVjdG9yID0gbWF0Y2hbMl07XG4gICAgICBpZiAoIHNlbGVjdG9yICkge1xuICAgICAgICBkZWxlZ2F0ZUVsZW1lbnQuZGVsZWdhdGUoIHNlbGVjdG9yLCBldmVudE5hbWUsIGhhbmRsZXJQcm94eSApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbWVudC5iaW5kKCBldmVudE5hbWUsIGhhbmRsZXJQcm94eSApO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIF9vZmY6IGZ1bmN0aW9uKCBlbGVtZW50LCBldmVudE5hbWUgKSB7XG4gICAgZXZlbnROYW1lID0gKGV2ZW50TmFtZSB8fCBcIlwiKS5zcGxpdCggXCIgXCIgKS5qb2luKCB0aGlzLmV2ZW50TmFtZXNwYWNlICsgXCIgXCIgKSArXG4gICAgICB0aGlzLmV2ZW50TmFtZXNwYWNlO1xuICAgIGVsZW1lbnQudW5iaW5kKCBldmVudE5hbWUgKS51bmRlbGVnYXRlKCBldmVudE5hbWUgKTtcblxuICAgIC8vIENsZWFyIHRoZSBzdGFjayB0byBhdm9pZCBtZW1vcnkgbGVha3MgKCMxMDA1NilcbiAgICB0aGlzLmJpbmRpbmdzID0gJCggdGhpcy5iaW5kaW5ncy5ub3QoIGVsZW1lbnQgKS5nZXQoKSApO1xuICAgIHRoaXMuZm9jdXNhYmxlID0gJCggdGhpcy5mb2N1c2FibGUubm90KCBlbGVtZW50ICkuZ2V0KCkgKTtcbiAgICB0aGlzLmhvdmVyYWJsZSA9ICQoIHRoaXMuaG92ZXJhYmxlLm5vdCggZWxlbWVudCApLmdldCgpICk7XG4gIH0sXG5cbiAgX2RlbGF5OiBmdW5jdGlvbiggaGFuZGxlciwgZGVsYXkgKSB7XG4gICAgZnVuY3Rpb24gaGFuZGxlclByb3h5KCkge1xuICAgICAgcmV0dXJuICggdHlwZW9mIGhhbmRsZXIgPT09IFwic3RyaW5nXCIgPyBpbnN0YW5jZVsgaGFuZGxlciBdIDogaGFuZGxlciApXG4gICAgICAgIC5hcHBseSggaW5zdGFuY2UsIGFyZ3VtZW50cyApO1xuICAgIH1cbiAgICB2YXIgaW5zdGFuY2UgPSB0aGlzO1xuICAgIHJldHVybiBzZXRUaW1lb3V0KCBoYW5kbGVyUHJveHksIGRlbGF5IHx8IDAgKTtcbiAgfSxcblxuICBfaG92ZXJhYmxlOiBmdW5jdGlvbiggZWxlbWVudCApIHtcbiAgICB0aGlzLmhvdmVyYWJsZSA9IHRoaXMuaG92ZXJhYmxlLmFkZCggZWxlbWVudCApO1xuICAgIHRoaXMuX29uKCBlbGVtZW50LCB7XG4gICAgICBtb3VzZWVudGVyOiBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgICAgICQoIGV2ZW50LmN1cnJlbnRUYXJnZXQgKS5hZGRDbGFzcyggXCJ1aS1zdGF0ZS1ob3ZlclwiICk7XG4gICAgICB9LFxuICAgICAgbW91c2VsZWF2ZTogZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgICAgICAkKCBldmVudC5jdXJyZW50VGFyZ2V0ICkucmVtb3ZlQ2xhc3MoIFwidWktc3RhdGUtaG92ZXJcIiApO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIF9mb2N1c2FibGU6IGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuICAgIHRoaXMuZm9jdXNhYmxlID0gdGhpcy5mb2N1c2FibGUuYWRkKCBlbGVtZW50ICk7XG4gICAgdGhpcy5fb24oIGVsZW1lbnQsIHtcbiAgICAgIGZvY3VzaW46IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICAgICAgJCggZXZlbnQuY3VycmVudFRhcmdldCApLmFkZENsYXNzKCBcInVpLXN0YXRlLWZvY3VzXCIgKTtcbiAgICAgIH0sXG4gICAgICBmb2N1c291dDogZnVuY3Rpb24oIGV2ZW50ICkge1xuICAgICAgICAkKCBldmVudC5jdXJyZW50VGFyZ2V0ICkucmVtb3ZlQ2xhc3MoIFwidWktc3RhdGUtZm9jdXNcIiApO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIF90cmlnZ2VyOiBmdW5jdGlvbiggdHlwZSwgZXZlbnQsIGRhdGEgKSB7XG4gICAgdmFyIHByb3AsIG9yaWcsXG4gICAgICBjYWxsYmFjayA9IHRoaXMub3B0aW9uc1sgdHlwZSBdO1xuXG4gICAgZGF0YSA9IGRhdGEgfHwge307XG4gICAgZXZlbnQgPSAkLkV2ZW50KCBldmVudCApO1xuICAgIGV2ZW50LnR5cGUgPSAoIHR5cGUgPT09IHRoaXMud2lkZ2V0RXZlbnRQcmVmaXggP1xuICAgICAgdHlwZSA6XG4gICAgICB0aGlzLndpZGdldEV2ZW50UHJlZml4ICsgdHlwZSApLnRvTG93ZXJDYXNlKCk7XG4gICAgLy8gdGhlIG9yaWdpbmFsIGV2ZW50IG1heSBjb21lIGZyb20gYW55IGVsZW1lbnRcbiAgICAvLyBzbyB3ZSBuZWVkIHRvIHJlc2V0IHRoZSB0YXJnZXQgb24gdGhlIG5ldyBldmVudFxuICAgIGV2ZW50LnRhcmdldCA9IHRoaXMuZWxlbWVudFsgMCBdO1xuXG4gICAgLy8gY29weSBvcmlnaW5hbCBldmVudCBwcm9wZXJ0aWVzIG92ZXIgdG8gdGhlIG5ldyBldmVudFxuICAgIG9yaWcgPSBldmVudC5vcmlnaW5hbEV2ZW50O1xuICAgIGlmICggb3JpZyApIHtcbiAgICAgIGZvciAoIHByb3AgaW4gb3JpZyApIHtcbiAgICAgICAgaWYgKCAhKCBwcm9wIGluIGV2ZW50ICkgKSB7XG4gICAgICAgICAgZXZlbnRbIHByb3AgXSA9IG9yaWdbIHByb3AgXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZWxlbWVudC50cmlnZ2VyKCBldmVudCwgZGF0YSApO1xuICAgIHJldHVybiAhKCAkLmlzRnVuY3Rpb24oIGNhbGxiYWNrICkgJiZcbiAgICAgIGNhbGxiYWNrLmFwcGx5KCB0aGlzLmVsZW1lbnRbMF0sIFsgZXZlbnQgXS5jb25jYXQoIGRhdGEgKSApID09PSBmYWxzZSB8fFxuICAgICAgZXZlbnQuaXNEZWZhdWx0UHJldmVudGVkKCkgKTtcbiAgfVxufTtcblxuJC5lYWNoKCB7IHNob3c6IFwiZmFkZUluXCIsIGhpZGU6IFwiZmFkZU91dFwiIH0sIGZ1bmN0aW9uKCBtZXRob2QsIGRlZmF1bHRFZmZlY3QgKSB7XG4gICQuV2lkZ2V0LnByb3RvdHlwZVsgXCJfXCIgKyBtZXRob2QgXSA9IGZ1bmN0aW9uKCBlbGVtZW50LCBvcHRpb25zLCBjYWxsYmFjayApIHtcbiAgICBpZiAoIHR5cGVvZiBvcHRpb25zID09PSBcInN0cmluZ1wiICkge1xuICAgICAgb3B0aW9ucyA9IHsgZWZmZWN0OiBvcHRpb25zIH07XG4gICAgfVxuICAgIHZhciBoYXNPcHRpb25zLFxuICAgICAgZWZmZWN0TmFtZSA9ICFvcHRpb25zID9cbiAgICAgICAgbWV0aG9kIDpcbiAgICAgICAgb3B0aW9ucyA9PT0gdHJ1ZSB8fCB0eXBlb2Ygb3B0aW9ucyA9PT0gXCJudW1iZXJcIiA/XG4gICAgICAgICAgZGVmYXVsdEVmZmVjdCA6XG4gICAgICAgICAgb3B0aW9ucy5lZmZlY3QgfHwgZGVmYXVsdEVmZmVjdDtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICBpZiAoIHR5cGVvZiBvcHRpb25zID09PSBcIm51bWJlclwiICkge1xuICAgICAgb3B0aW9ucyA9IHsgZHVyYXRpb246IG9wdGlvbnMgfTtcbiAgICB9XG4gICAgaGFzT3B0aW9ucyA9ICEkLmlzRW1wdHlPYmplY3QoIG9wdGlvbnMgKTtcbiAgICBvcHRpb25zLmNvbXBsZXRlID0gY2FsbGJhY2s7XG4gICAgaWYgKCBvcHRpb25zLmRlbGF5ICkge1xuICAgICAgZWxlbWVudC5kZWxheSggb3B0aW9ucy5kZWxheSApO1xuICAgIH1cbiAgICBpZiAoIGhhc09wdGlvbnMgJiYgJC5lZmZlY3RzICYmICQuZWZmZWN0cy5lZmZlY3RbIGVmZmVjdE5hbWUgXSApIHtcbiAgICAgIGVsZW1lbnRbIG1ldGhvZCBdKCBvcHRpb25zICk7XG4gICAgfSBlbHNlIGlmICggZWZmZWN0TmFtZSAhPT0gbWV0aG9kICYmIGVsZW1lbnRbIGVmZmVjdE5hbWUgXSApIHtcbiAgICAgIGVsZW1lbnRbIGVmZmVjdE5hbWUgXSggb3B0aW9ucy5kdXJhdGlvbiwgb3B0aW9ucy5lYXNpbmcsIGNhbGxiYWNrICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW1lbnQucXVldWUoZnVuY3Rpb24oIG5leHQgKSB7XG4gICAgICAgICQoIHRoaXMgKVsgbWV0aG9kIF0oKTtcbiAgICAgICAgaWYgKCBjYWxsYmFjayApIHtcbiAgICAgICAgICBjYWxsYmFjay5jYWxsKCBlbGVtZW50WyAwIF0gKTtcbiAgICAgICAgfVxuICAgICAgICBuZXh0KCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59KTtcblxudmFyIHdpZGdldCA9ICQud2lkZ2V0O1xuXG5cbi8qIVxuICogalF1ZXJ5IFVJIE1vdXNlIDEuMTEuM1xuICogaHR0cDovL2pxdWVyeXVpLmNvbVxuICpcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiBodHRwOi8vanF1ZXJ5Lm9yZy9saWNlbnNlXG4gKlxuICogaHR0cDovL2FwaS5qcXVlcnl1aS5jb20vbW91c2UvXG4gKi9cblxuXG52YXIgbW91c2VIYW5kbGVkID0gZmFsc2U7XG4kKCBkb2N1bWVudCApLm1vdXNldXAoIGZ1bmN0aW9uKCkge1xuICBtb3VzZUhhbmRsZWQgPSBmYWxzZTtcbn0pO1xuXG52YXIgbW91c2UgPSAkLndpZGdldChcInVpLm1vdXNlXCIsIHtcbiAgdmVyc2lvbjogXCIxLjExLjNcIixcbiAgb3B0aW9uczoge1xuICAgIGNhbmNlbDogXCJpbnB1dCx0ZXh0YXJlYSxidXR0b24sc2VsZWN0LG9wdGlvblwiLFxuICAgIGRpc3RhbmNlOiAxLFxuICAgIGRlbGF5OiAwXG4gIH0sXG4gIF9tb3VzZUluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgIHRoaXMuZWxlbWVudFxuICAgICAgLmJpbmQoXCJtb3VzZWRvd24uXCIgKyB0aGlzLndpZGdldE5hbWUsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHJldHVybiB0aGF0Ll9tb3VzZURvd24oZXZlbnQpO1xuICAgICAgfSlcbiAgICAgIC5iaW5kKFwiY2xpY2suXCIgKyB0aGlzLndpZGdldE5hbWUsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGlmICh0cnVlID09PSAkLmRhdGEoZXZlbnQudGFyZ2V0LCB0aGF0LndpZGdldE5hbWUgKyBcIi5wcmV2ZW50Q2xpY2tFdmVudFwiKSkge1xuICAgICAgICAgICQucmVtb3ZlRGF0YShldmVudC50YXJnZXQsIHRoYXQud2lkZ2V0TmFtZSArIFwiLnByZXZlbnRDbGlja0V2ZW50XCIpO1xuICAgICAgICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcbiAgfSxcblxuICAvLyBUT0RPOiBtYWtlIHN1cmUgZGVzdHJveWluZyBvbmUgaW5zdGFuY2Ugb2YgbW91c2UgZG9lc24ndCBtZXNzIHdpdGhcbiAgLy8gb3RoZXIgaW5zdGFuY2VzIG9mIG1vdXNlXG4gIF9tb3VzZURlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZWxlbWVudC51bmJpbmQoXCIuXCIgKyB0aGlzLndpZGdldE5hbWUpO1xuICAgIGlmICggdGhpcy5fbW91c2VNb3ZlRGVsZWdhdGUgKSB7XG4gICAgICB0aGlzLmRvY3VtZW50XG4gICAgICAgIC51bmJpbmQoXCJtb3VzZW1vdmUuXCIgKyB0aGlzLndpZGdldE5hbWUsIHRoaXMuX21vdXNlTW92ZURlbGVnYXRlKVxuICAgICAgICAudW5iaW5kKFwibW91c2V1cC5cIiArIHRoaXMud2lkZ2V0TmFtZSwgdGhpcy5fbW91c2VVcERlbGVnYXRlKTtcbiAgICB9XG4gIH0sXG5cbiAgX21vdXNlRG93bjogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAvLyBkb24ndCBsZXQgbW9yZSB0aGFuIG9uZSB3aWRnZXQgaGFuZGxlIG1vdXNlU3RhcnRcbiAgICBpZiAoIG1vdXNlSGFuZGxlZCApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9tb3VzZU1vdmVkID0gZmFsc2U7XG5cbiAgICAvLyB3ZSBtYXkgaGF2ZSBtaXNzZWQgbW91c2V1cCAob3V0IG9mIHdpbmRvdylcbiAgICAodGhpcy5fbW91c2VTdGFydGVkICYmIHRoaXMuX21vdXNlVXAoZXZlbnQpKTtcblxuICAgIHRoaXMuX21vdXNlRG93bkV2ZW50ID0gZXZlbnQ7XG5cbiAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICBidG5Jc0xlZnQgPSAoZXZlbnQud2hpY2ggPT09IDEpLFxuICAgICAgLy8gZXZlbnQudGFyZ2V0Lm5vZGVOYW1lIHdvcmtzIGFyb3VuZCBhIGJ1ZyBpbiBJRSA4IHdpdGhcbiAgICAgIC8vIGRpc2FibGVkIGlucHV0cyAoIzc2MjApXG4gICAgICBlbElzQ2FuY2VsID0gKHR5cGVvZiB0aGlzLm9wdGlvbnMuY2FuY2VsID09PSBcInN0cmluZ1wiICYmIGV2ZW50LnRhcmdldC5ub2RlTmFtZSA/ICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KHRoaXMub3B0aW9ucy5jYW5jZWwpLmxlbmd0aCA6IGZhbHNlKTtcbiAgICBpZiAoIWJ0bklzTGVmdCB8fCBlbElzQ2FuY2VsIHx8ICF0aGlzLl9tb3VzZUNhcHR1cmUoZXZlbnQpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB0aGlzLm1vdXNlRGVsYXlNZXQgPSAhdGhpcy5vcHRpb25zLmRlbGF5O1xuICAgIGlmICghdGhpcy5tb3VzZURlbGF5TWV0KSB7XG4gICAgICB0aGlzLl9tb3VzZURlbGF5VGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGF0Lm1vdXNlRGVsYXlNZXQgPSB0cnVlO1xuICAgICAgfSwgdGhpcy5vcHRpb25zLmRlbGF5KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fbW91c2VEaXN0YW5jZU1ldChldmVudCkgJiYgdGhpcy5fbW91c2VEZWxheU1ldChldmVudCkpIHtcbiAgICAgIHRoaXMuX21vdXNlU3RhcnRlZCA9ICh0aGlzLl9tb3VzZVN0YXJ0KGV2ZW50KSAhPT0gZmFsc2UpO1xuICAgICAgaWYgKCF0aGlzLl9tb3VzZVN0YXJ0ZWQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQ2xpY2sgZXZlbnQgbWF5IG5ldmVyIGhhdmUgZmlyZWQgKEdlY2tvICYgT3BlcmEpXG4gICAgaWYgKHRydWUgPT09ICQuZGF0YShldmVudC50YXJnZXQsIHRoaXMud2lkZ2V0TmFtZSArIFwiLnByZXZlbnRDbGlja0V2ZW50XCIpKSB7XG4gICAgICAkLnJlbW92ZURhdGEoZXZlbnQudGFyZ2V0LCB0aGlzLndpZGdldE5hbWUgKyBcIi5wcmV2ZW50Q2xpY2tFdmVudFwiKTtcbiAgICB9XG5cbiAgICAvLyB0aGVzZSBkZWxlZ2F0ZXMgYXJlIHJlcXVpcmVkIHRvIGtlZXAgY29udGV4dFxuICAgIHRoaXMuX21vdXNlTW92ZURlbGVnYXRlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHJldHVybiB0aGF0Ll9tb3VzZU1vdmUoZXZlbnQpO1xuICAgIH07XG4gICAgdGhpcy5fbW91c2VVcERlbGVnYXRlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHJldHVybiB0aGF0Ll9tb3VzZVVwKGV2ZW50KTtcbiAgICB9O1xuXG4gICAgdGhpcy5kb2N1bWVudFxuICAgICAgLmJpbmQoIFwibW91c2Vtb3ZlLlwiICsgdGhpcy53aWRnZXROYW1lLCB0aGlzLl9tb3VzZU1vdmVEZWxlZ2F0ZSApXG4gICAgICAuYmluZCggXCJtb3VzZXVwLlwiICsgdGhpcy53aWRnZXROYW1lLCB0aGlzLl9tb3VzZVVwRGVsZWdhdGUgKTtcblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBtb3VzZUhhbmRsZWQgPSB0cnVlO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuXG4gIF9tb3VzZU1vdmU6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgLy8gT25seSBjaGVjayBmb3IgbW91c2V1cHMgb3V0c2lkZSB0aGUgZG9jdW1lbnQgaWYgeW91J3ZlIG1vdmVkIGluc2lkZSB0aGUgZG9jdW1lbnRcbiAgICAvLyBhdCBsZWFzdCBvbmNlLiBUaGlzIHByZXZlbnRzIHRoZSBmaXJpbmcgb2YgbW91c2V1cCBpbiB0aGUgY2FzZSBvZiBJRTw5LCB3aGljaCB3aWxsXG4gICAgLy8gZmlyZSBhIG1vdXNlbW92ZSBldmVudCBpZiBjb250ZW50IGlzIHBsYWNlZCB1bmRlciB0aGUgY3Vyc29yLiBTZWUgIzc3NzhcbiAgICAvLyBTdXBwb3J0OiBJRSA8OVxuICAgIGlmICggdGhpcy5fbW91c2VNb3ZlZCApIHtcbiAgICAgIC8vIElFIG1vdXNldXAgY2hlY2sgLSBtb3VzZXVwIGhhcHBlbmVkIHdoZW4gbW91c2Ugd2FzIG91dCBvZiB3aW5kb3dcbiAgICAgIGlmICgkLnVpLmllICYmICggIWRvY3VtZW50LmRvY3VtZW50TW9kZSB8fCBkb2N1bWVudC5kb2N1bWVudE1vZGUgPCA5ICkgJiYgIWV2ZW50LmJ1dHRvbikge1xuICAgICAgICByZXR1cm4gdGhpcy5fbW91c2VVcChldmVudCk7XG5cbiAgICAgIC8vIElmcmFtZSBtb3VzZXVwIGNoZWNrIC0gbW91c2V1cCBvY2N1cnJlZCBpbiBhbm90aGVyIGRvY3VtZW50XG4gICAgICB9IGVsc2UgaWYgKCAhZXZlbnQud2hpY2ggKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tb3VzZVVwKCBldmVudCApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICggZXZlbnQud2hpY2ggfHwgZXZlbnQuYnV0dG9uICkge1xuICAgICAgdGhpcy5fbW91c2VNb3ZlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX21vdXNlU3RhcnRlZCkge1xuICAgICAgdGhpcy5fbW91c2VEcmFnKGV2ZW50KTtcbiAgICAgIHJldHVybiBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9tb3VzZURpc3RhbmNlTWV0KGV2ZW50KSAmJiB0aGlzLl9tb3VzZURlbGF5TWV0KGV2ZW50KSkge1xuICAgICAgdGhpcy5fbW91c2VTdGFydGVkID1cbiAgICAgICAgKHRoaXMuX21vdXNlU3RhcnQodGhpcy5fbW91c2VEb3duRXZlbnQsIGV2ZW50KSAhPT0gZmFsc2UpO1xuICAgICAgKHRoaXMuX21vdXNlU3RhcnRlZCA/IHRoaXMuX21vdXNlRHJhZyhldmVudCkgOiB0aGlzLl9tb3VzZVVwKGV2ZW50KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuICF0aGlzLl9tb3VzZVN0YXJ0ZWQ7XG4gIH0sXG5cbiAgX21vdXNlVXA6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdGhpcy5kb2N1bWVudFxuICAgICAgLnVuYmluZCggXCJtb3VzZW1vdmUuXCIgKyB0aGlzLndpZGdldE5hbWUsIHRoaXMuX21vdXNlTW92ZURlbGVnYXRlIClcbiAgICAgIC51bmJpbmQoIFwibW91c2V1cC5cIiArIHRoaXMud2lkZ2V0TmFtZSwgdGhpcy5fbW91c2VVcERlbGVnYXRlICk7XG5cbiAgICBpZiAodGhpcy5fbW91c2VTdGFydGVkKSB7XG4gICAgICB0aGlzLl9tb3VzZVN0YXJ0ZWQgPSBmYWxzZTtcblxuICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gdGhpcy5fbW91c2VEb3duRXZlbnQudGFyZ2V0KSB7XG4gICAgICAgICQuZGF0YShldmVudC50YXJnZXQsIHRoaXMud2lkZ2V0TmFtZSArIFwiLnByZXZlbnRDbGlja0V2ZW50XCIsIHRydWUpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl9tb3VzZVN0b3AoZXZlbnQpO1xuICAgIH1cblxuICAgIG1vdXNlSGFuZGxlZCA9IGZhbHNlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICBfbW91c2VEaXN0YW5jZU1ldDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICByZXR1cm4gKE1hdGgubWF4KFxuICAgICAgICBNYXRoLmFicyh0aGlzLl9tb3VzZURvd25FdmVudC5wYWdlWCAtIGV2ZW50LnBhZ2VYKSxcbiAgICAgICAgTWF0aC5hYnModGhpcy5fbW91c2VEb3duRXZlbnQucGFnZVkgLSBldmVudC5wYWdlWSlcbiAgICAgICkgPj0gdGhpcy5vcHRpb25zLmRpc3RhbmNlXG4gICAgKTtcbiAgfSxcblxuICBfbW91c2VEZWxheU1ldDogZnVuY3Rpb24oLyogZXZlbnQgKi8pIHtcbiAgICByZXR1cm4gdGhpcy5tb3VzZURlbGF5TWV0O1xuICB9LFxuXG4gIC8vIFRoZXNlIGFyZSBwbGFjZWhvbGRlciBtZXRob2RzLCB0byBiZSBvdmVycmlkZW4gYnkgZXh0ZW5kaW5nIHBsdWdpblxuICBfbW91c2VTdGFydDogZnVuY3Rpb24oLyogZXZlbnQgKi8pIHt9LFxuICBfbW91c2VEcmFnOiBmdW5jdGlvbigvKiBldmVudCAqLykge30sXG4gIF9tb3VzZVN0b3A6IGZ1bmN0aW9uKC8qIGV2ZW50ICovKSB7fSxcbiAgX21vdXNlQ2FwdHVyZTogZnVuY3Rpb24oLyogZXZlbnQgKi8pIHsgcmV0dXJuIHRydWU7IH1cbn0pO1xuXG5cbi8qIVxuICogalF1ZXJ5IFVJIERyYWdnYWJsZSAxLjExLjNcbiAqIGh0dHA6Ly9qcXVlcnl1aS5jb21cbiAqXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9yc1xuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuICogaHR0cDovL2pxdWVyeS5vcmcvbGljZW5zZVxuICpcbiAqIGh0dHA6Ly9hcGkuanF1ZXJ5dWkuY29tL2RyYWdnYWJsZS9cbiAqL1xuXG5cbiQud2lkZ2V0KFwidWkuZHJhZ2dhYmxlXCIsICQudWkubW91c2UsIHtcbiAgdmVyc2lvbjogXCIxLjExLjNcIixcbiAgd2lkZ2V0RXZlbnRQcmVmaXg6IFwiZHJhZ1wiLFxuICBvcHRpb25zOiB7XG4gICAgYWRkQ2xhc3NlczogdHJ1ZSxcbiAgICBhcHBlbmRUbzogXCJwYXJlbnRcIixcbiAgICBheGlzOiBmYWxzZSxcbiAgICBjb25uZWN0VG9Tb3J0YWJsZTogZmFsc2UsXG4gICAgY29udGFpbm1lbnQ6IGZhbHNlLFxuICAgIGN1cnNvcjogXCJhdXRvXCIsXG4gICAgY3Vyc29yQXQ6IGZhbHNlLFxuICAgIGdyaWQ6IGZhbHNlLFxuICAgIGhhbmRsZTogZmFsc2UsXG4gICAgaGVscGVyOiBcIm9yaWdpbmFsXCIsXG4gICAgaWZyYW1lRml4OiBmYWxzZSxcbiAgICBvcGFjaXR5OiBmYWxzZSxcbiAgICByZWZyZXNoUG9zaXRpb25zOiBmYWxzZSxcbiAgICByZXZlcnQ6IGZhbHNlLFxuICAgIHJldmVydER1cmF0aW9uOiA1MDAsXG4gICAgc2NvcGU6IFwiZGVmYXVsdFwiLFxuICAgIHNjcm9sbDogdHJ1ZSxcbiAgICBzY3JvbGxTZW5zaXRpdml0eTogMjAsXG4gICAgc2Nyb2xsU3BlZWQ6IDIwLFxuICAgIHNuYXA6IGZhbHNlLFxuICAgIHNuYXBNb2RlOiBcImJvdGhcIixcbiAgICBzbmFwVG9sZXJhbmNlOiAyMCxcbiAgICBzdGFjazogZmFsc2UsXG4gICAgekluZGV4OiBmYWxzZSxcblxuICAgIC8vIGNhbGxiYWNrc1xuICAgIGRyYWc6IG51bGwsXG4gICAgc3RhcnQ6IG51bGwsXG4gICAgc3RvcDogbnVsbFxuICB9LFxuICBfY3JlYXRlOiBmdW5jdGlvbigpIHtcblxuICAgIGlmICggdGhpcy5vcHRpb25zLmhlbHBlciA9PT0gXCJvcmlnaW5hbFwiICkge1xuICAgICAgdGhpcy5fc2V0UG9zaXRpb25SZWxhdGl2ZSgpO1xuICAgIH1cbiAgICBpZiAodGhpcy5vcHRpb25zLmFkZENsYXNzZXMpe1xuICAgICAgdGhpcy5lbGVtZW50LmFkZENsYXNzKFwidWktZHJhZ2dhYmxlXCIpO1xuICAgIH1cbiAgICBpZiAodGhpcy5vcHRpb25zLmRpc2FibGVkKXtcbiAgICAgIHRoaXMuZWxlbWVudC5hZGRDbGFzcyhcInVpLWRyYWdnYWJsZS1kaXNhYmxlZFwiKTtcbiAgICB9XG4gICAgdGhpcy5fc2V0SGFuZGxlQ2xhc3NOYW1lKCk7XG5cbiAgICB0aGlzLl9tb3VzZUluaXQoKTtcbiAgfSxcblxuICBfc2V0T3B0aW9uOiBmdW5jdGlvbigga2V5LCB2YWx1ZSApIHtcbiAgICB0aGlzLl9zdXBlcigga2V5LCB2YWx1ZSApO1xuICAgIGlmICgga2V5ID09PSBcImhhbmRsZVwiICkge1xuICAgICAgdGhpcy5fcmVtb3ZlSGFuZGxlQ2xhc3NOYW1lKCk7XG4gICAgICB0aGlzLl9zZXRIYW5kbGVDbGFzc05hbWUoKTtcbiAgICB9XG4gIH0sXG5cbiAgX2Rlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuICAgIGlmICggKCB0aGlzLmhlbHBlciB8fCB0aGlzLmVsZW1lbnQgKS5pcyggXCIudWktZHJhZ2dhYmxlLWRyYWdnaW5nXCIgKSApIHtcbiAgICAgIHRoaXMuZGVzdHJveU9uQ2xlYXIgPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoIFwidWktZHJhZ2dhYmxlIHVpLWRyYWdnYWJsZS1kcmFnZ2luZyB1aS1kcmFnZ2FibGUtZGlzYWJsZWRcIiApO1xuICAgIHRoaXMuX3JlbW92ZUhhbmRsZUNsYXNzTmFtZSgpO1xuICAgIHRoaXMuX21vdXNlRGVzdHJveSgpO1xuICB9LFxuXG4gIF9tb3VzZUNhcHR1cmU6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIG8gPSB0aGlzLm9wdGlvbnM7XG5cbiAgICB0aGlzLl9ibHVyQWN0aXZlRWxlbWVudCggZXZlbnQgKTtcblxuICAgIC8vIGFtb25nIG90aGVycywgcHJldmVudCBhIGRyYWcgb24gYSByZXNpemFibGUtaGFuZGxlXG4gICAgaWYgKHRoaXMuaGVscGVyIHx8IG8uZGlzYWJsZWQgfHwgJChldmVudC50YXJnZXQpLmNsb3Nlc3QoXCIudWktcmVzaXphYmxlLWhhbmRsZVwiKS5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy9RdWl0IGlmIHdlJ3JlIG5vdCBvbiBhIHZhbGlkIGhhbmRsZVxuICAgIHRoaXMuaGFuZGxlID0gdGhpcy5fZ2V0SGFuZGxlKGV2ZW50KTtcbiAgICBpZiAoIXRoaXMuaGFuZGxlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhpcy5fYmxvY2tGcmFtZXMoIG8uaWZyYW1lRml4ID09PSB0cnVlID8gXCJpZnJhbWVcIiA6IG8uaWZyYW1lRml4ICk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcblxuICB9LFxuXG4gIF9ibG9ja0ZyYW1lczogZnVuY3Rpb24oIHNlbGVjdG9yICkge1xuICAgIHRoaXMuaWZyYW1lQmxvY2tzID0gdGhpcy5kb2N1bWVudC5maW5kKCBzZWxlY3RvciApLm1hcChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpZnJhbWUgPSAkKCB0aGlzICk7XG5cbiAgICAgIHJldHVybiAkKCBcIjxkaXY+XCIgKVxuICAgICAgICAuY3NzKCBcInBvc2l0aW9uXCIsIFwiYWJzb2x1dGVcIiApXG4gICAgICAgIC5hcHBlbmRUbyggaWZyYW1lLnBhcmVudCgpIClcbiAgICAgICAgLm91dGVyV2lkdGgoIGlmcmFtZS5vdXRlcldpZHRoKCkgKVxuICAgICAgICAub3V0ZXJIZWlnaHQoIGlmcmFtZS5vdXRlckhlaWdodCgpIClcbiAgICAgICAgLm9mZnNldCggaWZyYW1lLm9mZnNldCgpIClbIDAgXTtcbiAgICB9KTtcbiAgfSxcblxuICBfdW5ibG9ja0ZyYW1lczogZnVuY3Rpb24oKSB7XG4gICAgaWYgKCB0aGlzLmlmcmFtZUJsb2NrcyApIHtcbiAgICAgIHRoaXMuaWZyYW1lQmxvY2tzLnJlbW92ZSgpO1xuICAgICAgZGVsZXRlIHRoaXMuaWZyYW1lQmxvY2tzO1xuICAgIH1cbiAgfSxcblxuICBfYmx1ckFjdGl2ZUVsZW1lbnQ6IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICB2YXIgZG9jdW1lbnQgPSB0aGlzLmRvY3VtZW50WyAwIF07XG5cbiAgICAvLyBPbmx5IG5lZWQgdG8gYmx1ciBpZiB0aGUgZXZlbnQgb2NjdXJyZWQgb24gdGhlIGRyYWdnYWJsZSBpdHNlbGYsIHNlZSAjMTA1MjdcbiAgICBpZiAoICF0aGlzLmhhbmRsZUVsZW1lbnQuaXMoIGV2ZW50LnRhcmdldCApICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHN1cHBvcnQ6IElFOVxuICAgIC8vIElFOSB0aHJvd3MgYW4gXCJVbnNwZWNpZmllZCBlcnJvclwiIGFjY2Vzc2luZyBkb2N1bWVudC5hY3RpdmVFbGVtZW50IGZyb20gYW4gPGlmcmFtZT5cbiAgICB0cnkge1xuXG4gICAgICAvLyBTdXBwb3J0OiBJRTksIElFMTBcbiAgICAgIC8vIElmIHRoZSA8Ym9keT4gaXMgYmx1cnJlZCwgSUUgd2lsbCBzd2l0Y2ggd2luZG93cywgc2VlICM5NTIwXG4gICAgICBpZiAoIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpICE9PSBcImJvZHlcIiApIHtcblxuICAgICAgICAvLyBCbHVyIGFueSBlbGVtZW50IHRoYXQgY3VycmVudGx5IGhhcyBmb2N1cywgc2VlICM0MjYxXG4gICAgICAgICQoIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgKS5ibHVyKCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoIGVycm9yICkge31cbiAgfSxcblxuICBfbW91c2VTdGFydDogZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgIHZhciBvID0gdGhpcy5vcHRpb25zO1xuXG4gICAgLy9DcmVhdGUgYW5kIGFwcGVuZCB0aGUgdmlzaWJsZSBoZWxwZXJcbiAgICB0aGlzLmhlbHBlciA9IHRoaXMuX2NyZWF0ZUhlbHBlcihldmVudCk7XG5cbiAgICB0aGlzLmhlbHBlci5hZGRDbGFzcyhcInVpLWRyYWdnYWJsZS1kcmFnZ2luZ1wiKTtcblxuICAgIC8vQ2FjaGUgdGhlIGhlbHBlciBzaXplXG4gICAgdGhpcy5fY2FjaGVIZWxwZXJQcm9wb3J0aW9ucygpO1xuXG4gICAgLy9JZiBkZG1hbmFnZXIgaXMgdXNlZCBmb3IgZHJvcHBhYmxlcywgc2V0IHRoZSBnbG9iYWwgZHJhZ2dhYmxlXG4gICAgaWYgKCQudWkuZGRtYW5hZ2VyKSB7XG4gICAgICAkLnVpLmRkbWFuYWdlci5jdXJyZW50ID0gdGhpcztcbiAgICB9XG5cbiAgICAvKlxuICAgICAqIC0gUG9zaXRpb24gZ2VuZXJhdGlvbiAtXG4gICAgICogVGhpcyBibG9jayBnZW5lcmF0ZXMgZXZlcnl0aGluZyBwb3NpdGlvbiByZWxhdGVkIC0gaXQncyB0aGUgY29yZSBvZiBkcmFnZ2FibGVzLlxuICAgICAqL1xuXG4gICAgLy9DYWNoZSB0aGUgbWFyZ2lucyBvZiB0aGUgb3JpZ2luYWwgZWxlbWVudFxuICAgIHRoaXMuX2NhY2hlTWFyZ2lucygpO1xuXG4gICAgLy9TdG9yZSB0aGUgaGVscGVyJ3MgY3NzIHBvc2l0aW9uXG4gICAgdGhpcy5jc3NQb3NpdGlvbiA9IHRoaXMuaGVscGVyLmNzcyggXCJwb3NpdGlvblwiICk7XG4gICAgdGhpcy5zY3JvbGxQYXJlbnQgPSB0aGlzLmhlbHBlci5zY3JvbGxQYXJlbnQoIHRydWUgKTtcbiAgICB0aGlzLm9mZnNldFBhcmVudCA9IHRoaXMuaGVscGVyLm9mZnNldFBhcmVudCgpO1xuICAgIHRoaXMuaGFzRml4ZWRBbmNlc3RvciA9IHRoaXMuaGVscGVyLnBhcmVudHMoKS5maWx0ZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiAkKCB0aGlzICkuY3NzKCBcInBvc2l0aW9uXCIgKSA9PT0gXCJmaXhlZFwiO1xuICAgICAgfSkubGVuZ3RoID4gMDtcblxuICAgIC8vVGhlIGVsZW1lbnQncyBhYnNvbHV0ZSBwb3NpdGlvbiBvbiB0aGUgcGFnZSBtaW51cyBtYXJnaW5zXG4gICAgdGhpcy5wb3NpdGlvbkFicyA9IHRoaXMuZWxlbWVudC5vZmZzZXQoKTtcbiAgICB0aGlzLl9yZWZyZXNoT2Zmc2V0cyggZXZlbnQgKTtcblxuICAgIC8vR2VuZXJhdGUgdGhlIG9yaWdpbmFsIHBvc2l0aW9uXG4gICAgdGhpcy5vcmlnaW5hbFBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbiA9IHRoaXMuX2dlbmVyYXRlUG9zaXRpb24oIGV2ZW50LCBmYWxzZSApO1xuICAgIHRoaXMub3JpZ2luYWxQYWdlWCA9IGV2ZW50LnBhZ2VYO1xuICAgIHRoaXMub3JpZ2luYWxQYWdlWSA9IGV2ZW50LnBhZ2VZO1xuXG4gICAgLy9BZGp1c3QgdGhlIG1vdXNlIG9mZnNldCByZWxhdGl2ZSB0byB0aGUgaGVscGVyIGlmIFwiY3Vyc29yQXRcIiBpcyBzdXBwbGllZFxuICAgIChvLmN1cnNvckF0ICYmIHRoaXMuX2FkanVzdE9mZnNldEZyb21IZWxwZXIoby5jdXJzb3JBdCkpO1xuXG4gICAgLy9TZXQgYSBjb250YWlubWVudCBpZiBnaXZlbiBpbiB0aGUgb3B0aW9uc1xuICAgIHRoaXMuX3NldENvbnRhaW5tZW50KCk7XG5cbiAgICAvL1RyaWdnZXIgZXZlbnQgKyBjYWxsYmFja3NcbiAgICBpZiAodGhpcy5fdHJpZ2dlcihcInN0YXJ0XCIsIGV2ZW50KSA9PT0gZmFsc2UpIHtcbiAgICAgIHRoaXMuX2NsZWFyKCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy9SZWNhY2hlIHRoZSBoZWxwZXIgc2l6ZVxuICAgIHRoaXMuX2NhY2hlSGVscGVyUHJvcG9ydGlvbnMoKTtcblxuICAgIC8vUHJlcGFyZSB0aGUgZHJvcHBhYmxlIG9mZnNldHNcbiAgICBpZiAoJC51aS5kZG1hbmFnZXIgJiYgIW8uZHJvcEJlaGF2aW91cikge1xuICAgICAgJC51aS5kZG1hbmFnZXIucHJlcGFyZU9mZnNldHModGhpcywgZXZlbnQpO1xuICAgIH1cblxuICAgIC8vIFJlc2V0IGhlbHBlcidzIHJpZ2h0L2JvdHRvbSBjc3MgaWYgdGhleSdyZSBzZXQgYW5kIHNldCBleHBsaWNpdCB3aWR0aC9oZWlnaHQgaW5zdGVhZFxuICAgIC8vIGFzIHRoaXMgcHJldmVudHMgcmVzaXppbmcgb2YgZWxlbWVudHMgd2l0aCByaWdodC9ib3R0b20gc2V0IChzZWUgIzc3NzIpXG4gICAgdGhpcy5fbm9ybWFsaXplUmlnaHRCb3R0b20oKTtcblxuICAgIHRoaXMuX21vdXNlRHJhZyhldmVudCwgdHJ1ZSk7IC8vRXhlY3V0ZSB0aGUgZHJhZyBvbmNlIC0gdGhpcyBjYXVzZXMgdGhlIGhlbHBlciBub3QgdG8gYmUgdmlzaWJsZSBiZWZvcmUgZ2V0dGluZyBpdHMgY29ycmVjdCBwb3NpdGlvblxuXG4gICAgLy9JZiB0aGUgZGRtYW5hZ2VyIGlzIHVzZWQgZm9yIGRyb3BwYWJsZXMsIGluZm9ybSB0aGUgbWFuYWdlciB0aGF0IGRyYWdnaW5nIGhhcyBzdGFydGVkIChzZWUgIzUwMDMpXG4gICAgaWYgKCAkLnVpLmRkbWFuYWdlciApIHtcbiAgICAgICQudWkuZGRtYW5hZ2VyLmRyYWdTdGFydCh0aGlzLCBldmVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgX3JlZnJlc2hPZmZzZXRzOiBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgdGhpcy5vZmZzZXQgPSB7XG4gICAgICB0b3A6IHRoaXMucG9zaXRpb25BYnMudG9wIC0gdGhpcy5tYXJnaW5zLnRvcCxcbiAgICAgIGxlZnQ6IHRoaXMucG9zaXRpb25BYnMubGVmdCAtIHRoaXMubWFyZ2lucy5sZWZ0LFxuICAgICAgc2Nyb2xsOiBmYWxzZSxcbiAgICAgIHBhcmVudDogdGhpcy5fZ2V0UGFyZW50T2Zmc2V0KCksXG4gICAgICByZWxhdGl2ZTogdGhpcy5fZ2V0UmVsYXRpdmVPZmZzZXQoKVxuICAgIH07XG5cbiAgICB0aGlzLm9mZnNldC5jbGljayA9IHtcbiAgICAgIGxlZnQ6IGV2ZW50LnBhZ2VYIC0gdGhpcy5vZmZzZXQubGVmdCxcbiAgICAgIHRvcDogZXZlbnQucGFnZVkgLSB0aGlzLm9mZnNldC50b3BcbiAgICB9O1xuICB9LFxuXG4gIF9tb3VzZURyYWc6IGZ1bmN0aW9uKGV2ZW50LCBub1Byb3BhZ2F0aW9uKSB7XG4gICAgLy8gcmVzZXQgYW55IG5lY2Vzc2FyeSBjYWNoZWQgcHJvcGVydGllcyAoc2VlICM1MDA5KVxuICAgIGlmICggdGhpcy5oYXNGaXhlZEFuY2VzdG9yICkge1xuICAgICAgdGhpcy5vZmZzZXQucGFyZW50ID0gdGhpcy5fZ2V0UGFyZW50T2Zmc2V0KCk7XG4gICAgfVxuXG4gICAgLy9Db21wdXRlIHRoZSBoZWxwZXJzIHBvc2l0aW9uXG4gICAgdGhpcy5wb3NpdGlvbiA9IHRoaXMuX2dlbmVyYXRlUG9zaXRpb24oIGV2ZW50LCB0cnVlICk7XG4gICAgdGhpcy5wb3NpdGlvbkFicyA9IHRoaXMuX2NvbnZlcnRQb3NpdGlvblRvKFwiYWJzb2x1dGVcIik7XG5cbiAgICAvL0NhbGwgcGx1Z2lucyBhbmQgY2FsbGJhY2tzIGFuZCB1c2UgdGhlIHJlc3VsdGluZyBwb3NpdGlvbiBpZiBzb21ldGhpbmcgaXMgcmV0dXJuZWRcbiAgICBpZiAoIW5vUHJvcGFnYXRpb24pIHtcbiAgICAgIHZhciB1aSA9IHRoaXMuX3VpSGFzaCgpO1xuICAgICAgaWYgKHRoaXMuX3RyaWdnZXIoXCJkcmFnXCIsIGV2ZW50LCB1aSkgPT09IGZhbHNlKSB7XG4gICAgICAgIHRoaXMuX21vdXNlVXAoe30pO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICB0aGlzLnBvc2l0aW9uID0gdWkucG9zaXRpb247XG4gICAgfVxuXG4gICAgdGhpcy5oZWxwZXJbIDAgXS5zdHlsZS5sZWZ0ID0gdGhpcy5wb3NpdGlvbi5sZWZ0ICsgXCJweFwiO1xuICAgIHRoaXMuaGVscGVyWyAwIF0uc3R5bGUudG9wID0gdGhpcy5wb3NpdGlvbi50b3AgKyBcInB4XCI7XG5cbiAgICBpZiAoJC51aS5kZG1hbmFnZXIpIHtcbiAgICAgICQudWkuZGRtYW5hZ2VyLmRyYWcodGhpcywgZXZlbnQpO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICBfbW91c2VTdG9wOiBmdW5jdGlvbihldmVudCkge1xuXG4gICAgLy9JZiB3ZSBhcmUgdXNpbmcgZHJvcHBhYmxlcywgaW5mb3JtIHRoZSBtYW5hZ2VyIGFib3V0IHRoZSBkcm9wXG4gICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgZHJvcHBlZCA9IGZhbHNlO1xuICAgIGlmICgkLnVpLmRkbWFuYWdlciAmJiAhdGhpcy5vcHRpb25zLmRyb3BCZWhhdmlvdXIpIHtcbiAgICAgIGRyb3BwZWQgPSAkLnVpLmRkbWFuYWdlci5kcm9wKHRoaXMsIGV2ZW50KTtcbiAgICB9XG5cbiAgICAvL2lmIGEgZHJvcCBjb21lcyBmcm9tIG91dHNpZGUgKGEgc29ydGFibGUpXG4gICAgaWYgKHRoaXMuZHJvcHBlZCkge1xuICAgICAgZHJvcHBlZCA9IHRoaXMuZHJvcHBlZDtcbiAgICAgIHRoaXMuZHJvcHBlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmICgodGhpcy5vcHRpb25zLnJldmVydCA9PT0gXCJpbnZhbGlkXCIgJiYgIWRyb3BwZWQpIHx8ICh0aGlzLm9wdGlvbnMucmV2ZXJ0ID09PSBcInZhbGlkXCIgJiYgZHJvcHBlZCkgfHwgdGhpcy5vcHRpb25zLnJldmVydCA9PT0gdHJ1ZSB8fCAoJC5pc0Z1bmN0aW9uKHRoaXMub3B0aW9ucy5yZXZlcnQpICYmIHRoaXMub3B0aW9ucy5yZXZlcnQuY2FsbCh0aGlzLmVsZW1lbnQsIGRyb3BwZWQpKSkge1xuICAgICAgJCh0aGlzLmhlbHBlcikuYW5pbWF0ZSh0aGlzLm9yaWdpbmFsUG9zaXRpb24sIHBhcnNlSW50KHRoaXMub3B0aW9ucy5yZXZlcnREdXJhdGlvbiwgMTApLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoYXQuX3RyaWdnZXIoXCJzdG9wXCIsIGV2ZW50KSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICB0aGF0Ll9jbGVhcigpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuX3RyaWdnZXIoXCJzdG9wXCIsIGV2ZW50KSAhPT0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5fY2xlYXIoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgX21vdXNlVXA6IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICB0aGlzLl91bmJsb2NrRnJhbWVzKCk7XG5cbiAgICAvL0lmIHRoZSBkZG1hbmFnZXIgaXMgdXNlZCBmb3IgZHJvcHBhYmxlcywgaW5mb3JtIHRoZSBtYW5hZ2VyIHRoYXQgZHJhZ2dpbmcgaGFzIHN0b3BwZWQgKHNlZSAjNTAwMylcbiAgICBpZiAoICQudWkuZGRtYW5hZ2VyICkge1xuICAgICAgJC51aS5kZG1hbmFnZXIuZHJhZ1N0b3AodGhpcywgZXZlbnQpO1xuICAgIH1cblxuICAgIC8vIE9ubHkgbmVlZCB0byBmb2N1cyBpZiB0aGUgZXZlbnQgb2NjdXJyZWQgb24gdGhlIGRyYWdnYWJsZSBpdHNlbGYsIHNlZSAjMTA1MjdcbiAgICBpZiAoIHRoaXMuaGFuZGxlRWxlbWVudC5pcyggZXZlbnQudGFyZ2V0ICkgKSB7XG4gICAgICAvLyBUaGUgaW50ZXJhY3Rpb24gaXMgb3Zlcjsgd2hldGhlciBvciBub3QgdGhlIGNsaWNrIHJlc3VsdGVkIGluIGEgZHJhZywgZm9jdXMgdGhlIGVsZW1lbnRcbiAgICAgIHRoaXMuZWxlbWVudC5mb2N1cygpO1xuICAgIH1cblxuICAgIHJldHVybiAkLnVpLm1vdXNlLnByb3RvdHlwZS5fbW91c2VVcC5jYWxsKHRoaXMsIGV2ZW50KTtcbiAgfSxcblxuICBjYW5jZWw6IGZ1bmN0aW9uKCkge1xuXG4gICAgaWYgKHRoaXMuaGVscGVyLmlzKFwiLnVpLWRyYWdnYWJsZS1kcmFnZ2luZ1wiKSkge1xuICAgICAgdGhpcy5fbW91c2VVcCh7fSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NsZWFyKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgfSxcblxuICBfZ2V0SGFuZGxlOiBmdW5jdGlvbihldmVudCkge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuaGFuZGxlID9cbiAgICAgICEhJCggZXZlbnQudGFyZ2V0ICkuY2xvc2VzdCggdGhpcy5lbGVtZW50LmZpbmQoIHRoaXMub3B0aW9ucy5oYW5kbGUgKSApLmxlbmd0aCA6XG4gICAgICB0cnVlO1xuICB9LFxuXG4gIF9zZXRIYW5kbGVDbGFzc05hbWU6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaGFuZGxlRWxlbWVudCA9IHRoaXMub3B0aW9ucy5oYW5kbGUgP1xuICAgICAgdGhpcy5lbGVtZW50LmZpbmQoIHRoaXMub3B0aW9ucy5oYW5kbGUgKSA6IHRoaXMuZWxlbWVudDtcbiAgICB0aGlzLmhhbmRsZUVsZW1lbnQuYWRkQ2xhc3MoIFwidWktZHJhZ2dhYmxlLWhhbmRsZVwiICk7XG4gIH0sXG5cbiAgX3JlbW92ZUhhbmRsZUNsYXNzTmFtZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5oYW5kbGVFbGVtZW50LnJlbW92ZUNsYXNzKCBcInVpLWRyYWdnYWJsZS1oYW5kbGVcIiApO1xuICB9LFxuXG4gIF9jcmVhdGVIZWxwZXI6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICB2YXIgbyA9IHRoaXMub3B0aW9ucyxcbiAgICAgIGhlbHBlcklzRnVuY3Rpb24gPSAkLmlzRnVuY3Rpb24oIG8uaGVscGVyICksXG4gICAgICBoZWxwZXIgPSBoZWxwZXJJc0Z1bmN0aW9uID9cbiAgICAgICAgJCggby5oZWxwZXIuYXBwbHkoIHRoaXMuZWxlbWVudFsgMCBdLCBbIGV2ZW50IF0gKSApIDpcbiAgICAgICAgKCBvLmhlbHBlciA9PT0gXCJjbG9uZVwiID9cbiAgICAgICAgICB0aGlzLmVsZW1lbnQuY2xvbmUoKS5yZW1vdmVBdHRyKCBcImlkXCIgKSA6XG4gICAgICAgICAgdGhpcy5lbGVtZW50ICk7XG5cbiAgICBpZiAoIWhlbHBlci5wYXJlbnRzKFwiYm9keVwiKS5sZW5ndGgpIHtcbiAgICAgIGhlbHBlci5hcHBlbmRUbygoby5hcHBlbmRUbyA9PT0gXCJwYXJlbnRcIiA/IHRoaXMuZWxlbWVudFswXS5wYXJlbnROb2RlIDogby5hcHBlbmRUbykpO1xuICAgIH1cblxuICAgIC8vIGh0dHA6Ly9idWdzLmpxdWVyeXVpLmNvbS90aWNrZXQvOTQ0NlxuICAgIC8vIGEgaGVscGVyIGZ1bmN0aW9uIGNhbiByZXR1cm4gdGhlIG9yaWdpbmFsIGVsZW1lbnRcbiAgICAvLyB3aGljaCB3b3VsZG4ndCBoYXZlIGJlZW4gc2V0IHRvIHJlbGF0aXZlIGluIF9jcmVhdGVcbiAgICBpZiAoIGhlbHBlcklzRnVuY3Rpb24gJiYgaGVscGVyWyAwIF0gPT09IHRoaXMuZWxlbWVudFsgMCBdICkge1xuICAgICAgdGhpcy5fc2V0UG9zaXRpb25SZWxhdGl2ZSgpO1xuICAgIH1cblxuICAgIGlmIChoZWxwZXJbMF0gIT09IHRoaXMuZWxlbWVudFswXSAmJiAhKC8oZml4ZWR8YWJzb2x1dGUpLykudGVzdChoZWxwZXIuY3NzKFwicG9zaXRpb25cIikpKSB7XG4gICAgICBoZWxwZXIuY3NzKFwicG9zaXRpb25cIiwgXCJhYnNvbHV0ZVwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaGVscGVyO1xuXG4gIH0sXG5cbiAgX3NldFBvc2l0aW9uUmVsYXRpdmU6IGZ1bmN0aW9uKCkge1xuICAgIGlmICggISggL14oPzpyfGF8ZikvICkudGVzdCggdGhpcy5lbGVtZW50LmNzcyggXCJwb3NpdGlvblwiICkgKSApIHtcbiAgICAgIHRoaXMuZWxlbWVudFsgMCBdLnN0eWxlLnBvc2l0aW9uID0gXCJyZWxhdGl2ZVwiO1xuICAgIH1cbiAgfSxcblxuICBfYWRqdXN0T2Zmc2V0RnJvbUhlbHBlcjogZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKHR5cGVvZiBvYmogPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG9iaiA9IG9iai5zcGxpdChcIiBcIik7XG4gICAgfVxuICAgIGlmICgkLmlzQXJyYXkob2JqKSkge1xuICAgICAgb2JqID0geyBsZWZ0OiArb2JqWzBdLCB0b3A6ICtvYmpbMV0gfHwgMCB9O1xuICAgIH1cbiAgICBpZiAoXCJsZWZ0XCIgaW4gb2JqKSB7XG4gICAgICB0aGlzLm9mZnNldC5jbGljay5sZWZ0ID0gb2JqLmxlZnQgKyB0aGlzLm1hcmdpbnMubGVmdDtcbiAgICB9XG4gICAgaWYgKFwicmlnaHRcIiBpbiBvYmopIHtcbiAgICAgIHRoaXMub2Zmc2V0LmNsaWNrLmxlZnQgPSB0aGlzLmhlbHBlclByb3BvcnRpb25zLndpZHRoIC0gb2JqLnJpZ2h0ICsgdGhpcy5tYXJnaW5zLmxlZnQ7XG4gICAgfVxuICAgIGlmIChcInRvcFwiIGluIG9iaikge1xuICAgICAgdGhpcy5vZmZzZXQuY2xpY2sudG9wID0gb2JqLnRvcCArIHRoaXMubWFyZ2lucy50b3A7XG4gICAgfVxuICAgIGlmIChcImJvdHRvbVwiIGluIG9iaikge1xuICAgICAgdGhpcy5vZmZzZXQuY2xpY2sudG9wID0gdGhpcy5oZWxwZXJQcm9wb3J0aW9ucy5oZWlnaHQgLSBvYmouYm90dG9tICsgdGhpcy5tYXJnaW5zLnRvcDtcbiAgICB9XG4gIH0sXG5cbiAgX2lzUm9vdE5vZGU6IGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuICAgIHJldHVybiAoIC8oaHRtbHxib2R5KS9pICkudGVzdCggZWxlbWVudC50YWdOYW1lICkgfHwgZWxlbWVudCA9PT0gdGhpcy5kb2N1bWVudFsgMCBdO1xuICB9LFxuXG4gIF9nZXRQYXJlbnRPZmZzZXQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgLy9HZXQgdGhlIG9mZnNldFBhcmVudCBhbmQgY2FjaGUgaXRzIHBvc2l0aW9uXG4gICAgdmFyIHBvID0gdGhpcy5vZmZzZXRQYXJlbnQub2Zmc2V0KCksXG4gICAgICBkb2N1bWVudCA9IHRoaXMuZG9jdW1lbnRbIDAgXTtcblxuICAgIC8vIFRoaXMgaXMgYSBzcGVjaWFsIGNhc2Ugd2hlcmUgd2UgbmVlZCB0byBtb2RpZnkgYSBvZmZzZXQgY2FsY3VsYXRlZCBvbiBzdGFydCwgc2luY2UgdGhlIGZvbGxvd2luZyBoYXBwZW5lZDpcbiAgICAvLyAxLiBUaGUgcG9zaXRpb24gb2YgdGhlIGhlbHBlciBpcyBhYnNvbHV0ZSwgc28gaXQncyBwb3NpdGlvbiBpcyBjYWxjdWxhdGVkIGJhc2VkIG9uIHRoZSBuZXh0IHBvc2l0aW9uZWQgcGFyZW50XG4gICAgLy8gMi4gVGhlIGFjdHVhbCBvZmZzZXQgcGFyZW50IGlzIGEgY2hpbGQgb2YgdGhlIHNjcm9sbCBwYXJlbnQsIGFuZCB0aGUgc2Nyb2xsIHBhcmVudCBpc24ndCB0aGUgZG9jdW1lbnQsIHdoaWNoIG1lYW5zIHRoYXRcbiAgICAvLyAgICB0aGUgc2Nyb2xsIGlzIGluY2x1ZGVkIGluIHRoZSBpbml0aWFsIGNhbGN1bGF0aW9uIG9mIHRoZSBvZmZzZXQgb2YgdGhlIHBhcmVudCwgYW5kIG5ldmVyIHJlY2FsY3VsYXRlZCB1cG9uIGRyYWdcbiAgICBpZiAodGhpcy5jc3NQb3NpdGlvbiA9PT0gXCJhYnNvbHV0ZVwiICYmIHRoaXMuc2Nyb2xsUGFyZW50WzBdICE9PSBkb2N1bWVudCAmJiAkLmNvbnRhaW5zKHRoaXMuc2Nyb2xsUGFyZW50WzBdLCB0aGlzLm9mZnNldFBhcmVudFswXSkpIHtcbiAgICAgIHBvLmxlZnQgKz0gdGhpcy5zY3JvbGxQYXJlbnQuc2Nyb2xsTGVmdCgpO1xuICAgICAgcG8udG9wICs9IHRoaXMuc2Nyb2xsUGFyZW50LnNjcm9sbFRvcCgpO1xuICAgIH1cblxuICAgIGlmICggdGhpcy5faXNSb290Tm9kZSggdGhpcy5vZmZzZXRQYXJlbnRbIDAgXSApICkge1xuICAgICAgcG8gPSB7IHRvcDogMCwgbGVmdDogMCB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB0b3A6IHBvLnRvcCArIChwYXJzZUludCh0aGlzLm9mZnNldFBhcmVudC5jc3MoXCJib3JkZXJUb3BXaWR0aFwiKSwgMTApIHx8IDApLFxuICAgICAgbGVmdDogcG8ubGVmdCArIChwYXJzZUludCh0aGlzLm9mZnNldFBhcmVudC5jc3MoXCJib3JkZXJMZWZ0V2lkdGhcIiksIDEwKSB8fCAwKVxuICAgIH07XG5cbiAgfSxcblxuICBfZ2V0UmVsYXRpdmVPZmZzZXQ6IGZ1bmN0aW9uKCkge1xuICAgIGlmICggdGhpcy5jc3NQb3NpdGlvbiAhPT0gXCJyZWxhdGl2ZVwiICkge1xuICAgICAgcmV0dXJuIHsgdG9wOiAwLCBsZWZ0OiAwIH07XG4gICAgfVxuXG4gICAgdmFyIHAgPSB0aGlzLmVsZW1lbnQucG9zaXRpb24oKSxcbiAgICAgIHNjcm9sbElzUm9vdE5vZGUgPSB0aGlzLl9pc1Jvb3ROb2RlKCB0aGlzLnNjcm9sbFBhcmVudFsgMCBdICk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdG9wOiBwLnRvcCAtICggcGFyc2VJbnQodGhpcy5oZWxwZXIuY3NzKCBcInRvcFwiICksIDEwKSB8fCAwICkgKyAoICFzY3JvbGxJc1Jvb3ROb2RlID8gdGhpcy5zY3JvbGxQYXJlbnQuc2Nyb2xsVG9wKCkgOiAwICksXG4gICAgICBsZWZ0OiBwLmxlZnQgLSAoIHBhcnNlSW50KHRoaXMuaGVscGVyLmNzcyggXCJsZWZ0XCIgKSwgMTApIHx8IDAgKSArICggIXNjcm9sbElzUm9vdE5vZGUgPyB0aGlzLnNjcm9sbFBhcmVudC5zY3JvbGxMZWZ0KCkgOiAwIClcbiAgICB9O1xuXG4gIH0sXG5cbiAgX2NhY2hlTWFyZ2luczogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5tYXJnaW5zID0ge1xuICAgICAgbGVmdDogKHBhcnNlSW50KHRoaXMuZWxlbWVudC5jc3MoXCJtYXJnaW5MZWZ0XCIpLCAxMCkgfHwgMCksXG4gICAgICB0b3A6IChwYXJzZUludCh0aGlzLmVsZW1lbnQuY3NzKFwibWFyZ2luVG9wXCIpLCAxMCkgfHwgMCksXG4gICAgICByaWdodDogKHBhcnNlSW50KHRoaXMuZWxlbWVudC5jc3MoXCJtYXJnaW5SaWdodFwiKSwgMTApIHx8IDApLFxuICAgICAgYm90dG9tOiAocGFyc2VJbnQodGhpcy5lbGVtZW50LmNzcyhcIm1hcmdpbkJvdHRvbVwiKSwgMTApIHx8IDApXG4gICAgfTtcbiAgfSxcblxuICBfY2FjaGVIZWxwZXJQcm9wb3J0aW9uczogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5oZWxwZXJQcm9wb3J0aW9ucyA9IHtcbiAgICAgIHdpZHRoOiB0aGlzLmhlbHBlci5vdXRlcldpZHRoKCksXG4gICAgICBoZWlnaHQ6IHRoaXMuaGVscGVyLm91dGVySGVpZ2h0KClcbiAgICB9O1xuICB9LFxuXG4gIF9zZXRDb250YWlubWVudDogZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgaXNVc2VyU2Nyb2xsYWJsZSwgYywgY2UsXG4gICAgICBvID0gdGhpcy5vcHRpb25zLFxuICAgICAgZG9jdW1lbnQgPSB0aGlzLmRvY3VtZW50WyAwIF07XG5cbiAgICB0aGlzLnJlbGF0aXZlQ29udGFpbmVyID0gbnVsbDtcblxuICAgIGlmICggIW8uY29udGFpbm1lbnQgKSB7XG4gICAgICB0aGlzLmNvbnRhaW5tZW50ID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIG8uY29udGFpbm1lbnQgPT09IFwid2luZG93XCIgKSB7XG4gICAgICB0aGlzLmNvbnRhaW5tZW50ID0gW1xuICAgICAgICAkKCB3aW5kb3cgKS5zY3JvbGxMZWZ0KCkgLSB0aGlzLm9mZnNldC5yZWxhdGl2ZS5sZWZ0IC0gdGhpcy5vZmZzZXQucGFyZW50LmxlZnQsXG4gICAgICAgICQoIHdpbmRvdyApLnNjcm9sbFRvcCgpIC0gdGhpcy5vZmZzZXQucmVsYXRpdmUudG9wIC0gdGhpcy5vZmZzZXQucGFyZW50LnRvcCxcbiAgICAgICAgJCggd2luZG93ICkuc2Nyb2xsTGVmdCgpICsgJCggd2luZG93ICkud2lkdGgoKSAtIHRoaXMuaGVscGVyUHJvcG9ydGlvbnMud2lkdGggLSB0aGlzLm1hcmdpbnMubGVmdCxcbiAgICAgICAgJCggd2luZG93ICkuc2Nyb2xsVG9wKCkgKyAoICQoIHdpbmRvdyApLmhlaWdodCgpIHx8IGRvY3VtZW50LmJvZHkucGFyZW50Tm9kZS5zY3JvbGxIZWlnaHQgKSAtIHRoaXMuaGVscGVyUHJvcG9ydGlvbnMuaGVpZ2h0IC0gdGhpcy5tYXJnaW5zLnRvcFxuICAgICAgXTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIG8uY29udGFpbm1lbnQgPT09IFwiZG9jdW1lbnRcIikge1xuICAgICAgdGhpcy5jb250YWlubWVudCA9IFtcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgJCggZG9jdW1lbnQgKS53aWR0aCgpIC0gdGhpcy5oZWxwZXJQcm9wb3J0aW9ucy53aWR0aCAtIHRoaXMubWFyZ2lucy5sZWZ0LFxuICAgICAgICAoICQoIGRvY3VtZW50ICkuaGVpZ2h0KCkgfHwgZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlLnNjcm9sbEhlaWdodCApIC0gdGhpcy5oZWxwZXJQcm9wb3J0aW9ucy5oZWlnaHQgLSB0aGlzLm1hcmdpbnMudG9wXG4gICAgICBdO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICggby5jb250YWlubWVudC5jb25zdHJ1Y3RvciA9PT0gQXJyYXkgKSB7XG4gICAgICB0aGlzLmNvbnRhaW5tZW50ID0gby5jb250YWlubWVudDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIG8uY29udGFpbm1lbnQgPT09IFwicGFyZW50XCIgKSB7XG4gICAgICBvLmNvbnRhaW5tZW50ID0gdGhpcy5oZWxwZXJbIDAgXS5wYXJlbnROb2RlO1xuICAgIH1cblxuICAgIGMgPSAkKCBvLmNvbnRhaW5tZW50ICk7XG4gICAgY2UgPSBjWyAwIF07XG5cbiAgICBpZiAoICFjZSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpc1VzZXJTY3JvbGxhYmxlID0gLyhzY3JvbGx8YXV0bykvLnRlc3QoIGMuY3NzKCBcIm92ZXJmbG93XCIgKSApO1xuXG4gICAgdGhpcy5jb250YWlubWVudCA9IFtcbiAgICAgICggcGFyc2VJbnQoIGMuY3NzKCBcImJvcmRlckxlZnRXaWR0aFwiICksIDEwICkgfHwgMCApICsgKCBwYXJzZUludCggYy5jc3MoIFwicGFkZGluZ0xlZnRcIiApLCAxMCApIHx8IDAgKSxcbiAgICAgICggcGFyc2VJbnQoIGMuY3NzKCBcImJvcmRlclRvcFdpZHRoXCIgKSwgMTAgKSB8fCAwICkgKyAoIHBhcnNlSW50KCBjLmNzcyggXCJwYWRkaW5nVG9wXCIgKSwgMTAgKSB8fCAwICksXG4gICAgICAoIGlzVXNlclNjcm9sbGFibGUgPyBNYXRoLm1heCggY2Uuc2Nyb2xsV2lkdGgsIGNlLm9mZnNldFdpZHRoICkgOiBjZS5vZmZzZXRXaWR0aCApIC1cbiAgICAgICAgKCBwYXJzZUludCggYy5jc3MoIFwiYm9yZGVyUmlnaHRXaWR0aFwiICksIDEwICkgfHwgMCApIC1cbiAgICAgICAgKCBwYXJzZUludCggYy5jc3MoIFwicGFkZGluZ1JpZ2h0XCIgKSwgMTAgKSB8fCAwICkgLVxuICAgICAgICB0aGlzLmhlbHBlclByb3BvcnRpb25zLndpZHRoIC1cbiAgICAgICAgdGhpcy5tYXJnaW5zLmxlZnQgLVxuICAgICAgICB0aGlzLm1hcmdpbnMucmlnaHQsXG4gICAgICAoIGlzVXNlclNjcm9sbGFibGUgPyBNYXRoLm1heCggY2Uuc2Nyb2xsSGVpZ2h0LCBjZS5vZmZzZXRIZWlnaHQgKSA6IGNlLm9mZnNldEhlaWdodCApIC1cbiAgICAgICAgKCBwYXJzZUludCggYy5jc3MoIFwiYm9yZGVyQm90dG9tV2lkdGhcIiApLCAxMCApIHx8IDAgKSAtXG4gICAgICAgICggcGFyc2VJbnQoIGMuY3NzKCBcInBhZGRpbmdCb3R0b21cIiApLCAxMCApIHx8IDAgKSAtXG4gICAgICAgIHRoaXMuaGVscGVyUHJvcG9ydGlvbnMuaGVpZ2h0IC1cbiAgICAgICAgdGhpcy5tYXJnaW5zLnRvcCAtXG4gICAgICAgIHRoaXMubWFyZ2lucy5ib3R0b21cbiAgICBdO1xuICAgIHRoaXMucmVsYXRpdmVDb250YWluZXIgPSBjO1xuICB9LFxuXG4gIF9jb252ZXJ0UG9zaXRpb25UbzogZnVuY3Rpb24oZCwgcG9zKSB7XG5cbiAgICBpZiAoIXBvcykge1xuICAgICAgcG9zID0gdGhpcy5wb3NpdGlvbjtcbiAgICB9XG5cbiAgICB2YXIgbW9kID0gZCA9PT0gXCJhYnNvbHV0ZVwiID8gMSA6IC0xLFxuICAgICAgc2Nyb2xsSXNSb290Tm9kZSA9IHRoaXMuX2lzUm9vdE5vZGUoIHRoaXMuc2Nyb2xsUGFyZW50WyAwIF0gKTtcblxuICAgIHJldHVybiB7XG4gICAgICB0b3A6IChcbiAgICAgICAgcG9zLnRvcCArICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBhYnNvbHV0ZSBtb3VzZSBwb3NpdGlvblxuICAgICAgICB0aGlzLm9mZnNldC5yZWxhdGl2ZS50b3AgKiBtb2QgKyAgICAgICAgICAgICAgICAgICAgLy8gT25seSBmb3IgcmVsYXRpdmUgcG9zaXRpb25lZCBub2RlczogUmVsYXRpdmUgb2Zmc2V0IGZyb20gZWxlbWVudCB0byBvZmZzZXQgcGFyZW50XG4gICAgICAgIHRoaXMub2Zmc2V0LnBhcmVudC50b3AgKiBtb2QgLSAgICAgICAgICAgICAgICAgICAgLy8gVGhlIG9mZnNldFBhcmVudCdzIG9mZnNldCB3aXRob3V0IGJvcmRlcnMgKG9mZnNldCArIGJvcmRlcilcbiAgICAgICAgKCAoIHRoaXMuY3NzUG9zaXRpb24gPT09IFwiZml4ZWRcIiA/IC10aGlzLm9mZnNldC5zY3JvbGwudG9wIDogKCBzY3JvbGxJc1Jvb3ROb2RlID8gMCA6IHRoaXMub2Zmc2V0LnNjcm9sbC50b3AgKSApICogbW9kKVxuICAgICAgKSxcbiAgICAgIGxlZnQ6IChcbiAgICAgICAgcG9zLmxlZnQgKyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIGFic29sdXRlIG1vdXNlIHBvc2l0aW9uXG4gICAgICAgIHRoaXMub2Zmc2V0LnJlbGF0aXZlLmxlZnQgKiBtb2QgKyAgICAgICAgICAgICAgICAgICAvLyBPbmx5IGZvciByZWxhdGl2ZSBwb3NpdGlvbmVkIG5vZGVzOiBSZWxhdGl2ZSBvZmZzZXQgZnJvbSBlbGVtZW50IHRvIG9mZnNldCBwYXJlbnRcbiAgICAgICAgdGhpcy5vZmZzZXQucGFyZW50LmxlZnQgKiBtb2QgLSAgICAgICAgICAgICAgICAgICAvLyBUaGUgb2Zmc2V0UGFyZW50J3Mgb2Zmc2V0IHdpdGhvdXQgYm9yZGVycyAob2Zmc2V0ICsgYm9yZGVyKVxuICAgICAgICAoICggdGhpcy5jc3NQb3NpdGlvbiA9PT0gXCJmaXhlZFwiID8gLXRoaXMub2Zmc2V0LnNjcm9sbC5sZWZ0IDogKCBzY3JvbGxJc1Jvb3ROb2RlID8gMCA6IHRoaXMub2Zmc2V0LnNjcm9sbC5sZWZ0ICkgKSAqIG1vZClcbiAgICAgIClcbiAgICB9O1xuXG4gIH0sXG5cbiAgX2dlbmVyYXRlUG9zaXRpb246IGZ1bmN0aW9uKCBldmVudCwgY29uc3RyYWluUG9zaXRpb24gKSB7XG5cbiAgICB2YXIgY29udGFpbm1lbnQsIGNvLCB0b3AsIGxlZnQsXG4gICAgICBvID0gdGhpcy5vcHRpb25zLFxuICAgICAgc2Nyb2xsSXNSb290Tm9kZSA9IHRoaXMuX2lzUm9vdE5vZGUoIHRoaXMuc2Nyb2xsUGFyZW50WyAwIF0gKSxcbiAgICAgIHBhZ2VYID0gZXZlbnQucGFnZVgsXG4gICAgICBwYWdlWSA9IGV2ZW50LnBhZ2VZO1xuXG4gICAgLy8gQ2FjaGUgdGhlIHNjcm9sbFxuICAgIGlmICggIXNjcm9sbElzUm9vdE5vZGUgfHwgIXRoaXMub2Zmc2V0LnNjcm9sbCApIHtcbiAgICAgIHRoaXMub2Zmc2V0LnNjcm9sbCA9IHtcbiAgICAgICAgdG9wOiB0aGlzLnNjcm9sbFBhcmVudC5zY3JvbGxUb3AoKSxcbiAgICAgICAgbGVmdDogdGhpcy5zY3JvbGxQYXJlbnQuc2Nyb2xsTGVmdCgpXG4gICAgICB9O1xuICAgIH1cblxuICAgIC8qXG4gICAgICogLSBQb3NpdGlvbiBjb25zdHJhaW5pbmcgLVxuICAgICAqIENvbnN0cmFpbiB0aGUgcG9zaXRpb24gdG8gYSBtaXggb2YgZ3JpZCwgY29udGFpbm1lbnQuXG4gICAgICovXG5cbiAgICAvLyBJZiB3ZSBhcmUgbm90IGRyYWdnaW5nIHlldCwgd2Ugd29uJ3QgY2hlY2sgZm9yIG9wdGlvbnNcbiAgICBpZiAoIGNvbnN0cmFpblBvc2l0aW9uICkge1xuICAgICAgaWYgKCB0aGlzLmNvbnRhaW5tZW50ICkge1xuICAgICAgICBpZiAoIHRoaXMucmVsYXRpdmVDb250YWluZXIgKXtcbiAgICAgICAgICBjbyA9IHRoaXMucmVsYXRpdmVDb250YWluZXIub2Zmc2V0KCk7XG4gICAgICAgICAgY29udGFpbm1lbnQgPSBbXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5tZW50WyAwIF0gKyBjby5sZWZ0LFxuICAgICAgICAgICAgdGhpcy5jb250YWlubWVudFsgMSBdICsgY28udG9wLFxuICAgICAgICAgICAgdGhpcy5jb250YWlubWVudFsgMiBdICsgY28ubGVmdCxcbiAgICAgICAgICAgIHRoaXMuY29udGFpbm1lbnRbIDMgXSArIGNvLnRvcFxuICAgICAgICAgIF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29udGFpbm1lbnQgPSB0aGlzLmNvbnRhaW5tZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGV2ZW50LnBhZ2VYIC0gdGhpcy5vZmZzZXQuY2xpY2subGVmdCA8IGNvbnRhaW5tZW50WzBdKSB7XG4gICAgICAgICAgcGFnZVggPSBjb250YWlubWVudFswXSArIHRoaXMub2Zmc2V0LmNsaWNrLmxlZnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV2ZW50LnBhZ2VZIC0gdGhpcy5vZmZzZXQuY2xpY2sudG9wIDwgY29udGFpbm1lbnRbMV0pIHtcbiAgICAgICAgICBwYWdlWSA9IGNvbnRhaW5tZW50WzFdICsgdGhpcy5vZmZzZXQuY2xpY2sudG9wO1xuICAgICAgICB9XG4gICAgICAgIGlmIChldmVudC5wYWdlWCAtIHRoaXMub2Zmc2V0LmNsaWNrLmxlZnQgPiBjb250YWlubWVudFsyXSkge1xuICAgICAgICAgIHBhZ2VYID0gY29udGFpbm1lbnRbMl0gKyB0aGlzLm9mZnNldC5jbGljay5sZWZ0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChldmVudC5wYWdlWSAtIHRoaXMub2Zmc2V0LmNsaWNrLnRvcCA+IGNvbnRhaW5tZW50WzNdKSB7XG4gICAgICAgICAgcGFnZVkgPSBjb250YWlubWVudFszXSArIHRoaXMub2Zmc2V0LmNsaWNrLnRvcDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoby5ncmlkKSB7XG4gICAgICAgIC8vQ2hlY2sgZm9yIGdyaWQgZWxlbWVudHMgc2V0IHRvIDAgdG8gcHJldmVudCBkaXZpZGUgYnkgMCBlcnJvciBjYXVzaW5nIGludmFsaWQgYXJndW1lbnQgZXJyb3JzIGluIElFIChzZWUgdGlja2V0ICM2OTUwKVxuICAgICAgICB0b3AgPSBvLmdyaWRbMV0gPyB0aGlzLm9yaWdpbmFsUGFnZVkgKyBNYXRoLnJvdW5kKChwYWdlWSAtIHRoaXMub3JpZ2luYWxQYWdlWSkgLyBvLmdyaWRbMV0pICogby5ncmlkWzFdIDogdGhpcy5vcmlnaW5hbFBhZ2VZO1xuICAgICAgICBwYWdlWSA9IGNvbnRhaW5tZW50ID8gKCh0b3AgLSB0aGlzLm9mZnNldC5jbGljay50b3AgPj0gY29udGFpbm1lbnRbMV0gfHwgdG9wIC0gdGhpcy5vZmZzZXQuY2xpY2sudG9wID4gY29udGFpbm1lbnRbM10pID8gdG9wIDogKCh0b3AgLSB0aGlzLm9mZnNldC5jbGljay50b3AgPj0gY29udGFpbm1lbnRbMV0pID8gdG9wIC0gby5ncmlkWzFdIDogdG9wICsgby5ncmlkWzFdKSkgOiB0b3A7XG5cbiAgICAgICAgbGVmdCA9IG8uZ3JpZFswXSA/IHRoaXMub3JpZ2luYWxQYWdlWCArIE1hdGgucm91bmQoKHBhZ2VYIC0gdGhpcy5vcmlnaW5hbFBhZ2VYKSAvIG8uZ3JpZFswXSkgKiBvLmdyaWRbMF0gOiB0aGlzLm9yaWdpbmFsUGFnZVg7XG4gICAgICAgIHBhZ2VYID0gY29udGFpbm1lbnQgPyAoKGxlZnQgLSB0aGlzLm9mZnNldC5jbGljay5sZWZ0ID49IGNvbnRhaW5tZW50WzBdIHx8IGxlZnQgLSB0aGlzLm9mZnNldC5jbGljay5sZWZ0ID4gY29udGFpbm1lbnRbMl0pID8gbGVmdCA6ICgobGVmdCAtIHRoaXMub2Zmc2V0LmNsaWNrLmxlZnQgPj0gY29udGFpbm1lbnRbMF0pID8gbGVmdCAtIG8uZ3JpZFswXSA6IGxlZnQgKyBvLmdyaWRbMF0pKSA6IGxlZnQ7XG4gICAgICB9XG5cbiAgICAgIGlmICggby5heGlzID09PSBcInlcIiApIHtcbiAgICAgICAgcGFnZVggPSB0aGlzLm9yaWdpbmFsUGFnZVg7XG4gICAgICB9XG5cbiAgICAgIGlmICggby5heGlzID09PSBcInhcIiApIHtcbiAgICAgICAgcGFnZVkgPSB0aGlzLm9yaWdpbmFsUGFnZVk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRvcDogKFxuICAgICAgICBwYWdlWSAtICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIGFic29sdXRlIG1vdXNlIHBvc2l0aW9uXG4gICAgICAgIHRoaXMub2Zmc2V0LmNsaWNrLnRvcCAtICAgICAgICAgICAgICAgICAgICAgICAvLyBDbGljayBvZmZzZXQgKHJlbGF0aXZlIHRvIHRoZSBlbGVtZW50KVxuICAgICAgICB0aGlzLm9mZnNldC5yZWxhdGl2ZS50b3AgLSAgICAgICAgICAgICAgICAgICAgICAgIC8vIE9ubHkgZm9yIHJlbGF0aXZlIHBvc2l0aW9uZWQgbm9kZXM6IFJlbGF0aXZlIG9mZnNldCBmcm9tIGVsZW1lbnQgdG8gb2Zmc2V0IHBhcmVudFxuICAgICAgICB0aGlzLm9mZnNldC5wYXJlbnQudG9wICsgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgb2Zmc2V0UGFyZW50J3Mgb2Zmc2V0IHdpdGhvdXQgYm9yZGVycyAob2Zmc2V0ICsgYm9yZGVyKVxuICAgICAgICAoIHRoaXMuY3NzUG9zaXRpb24gPT09IFwiZml4ZWRcIiA/IC10aGlzLm9mZnNldC5zY3JvbGwudG9wIDogKCBzY3JvbGxJc1Jvb3ROb2RlID8gMCA6IHRoaXMub2Zmc2V0LnNjcm9sbC50b3AgKSApXG4gICAgICApLFxuICAgICAgbGVmdDogKFxuICAgICAgICBwYWdlWCAtICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIGFic29sdXRlIG1vdXNlIHBvc2l0aW9uXG4gICAgICAgIHRoaXMub2Zmc2V0LmNsaWNrLmxlZnQgLSAgICAgICAgICAgICAgICAgICAgICAgIC8vIENsaWNrIG9mZnNldCAocmVsYXRpdmUgdG8gdGhlIGVsZW1lbnQpXG4gICAgICAgIHRoaXMub2Zmc2V0LnJlbGF0aXZlLmxlZnQgLSAgICAgICAgICAgICAgICAgICAgICAgLy8gT25seSBmb3IgcmVsYXRpdmUgcG9zaXRpb25lZCBub2RlczogUmVsYXRpdmUgb2Zmc2V0IGZyb20gZWxlbWVudCB0byBvZmZzZXQgcGFyZW50XG4gICAgICAgIHRoaXMub2Zmc2V0LnBhcmVudC5sZWZ0ICsgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBvZmZzZXRQYXJlbnQncyBvZmZzZXQgd2l0aG91dCBib3JkZXJzIChvZmZzZXQgKyBib3JkZXIpXG4gICAgICAgICggdGhpcy5jc3NQb3NpdGlvbiA9PT0gXCJmaXhlZFwiID8gLXRoaXMub2Zmc2V0LnNjcm9sbC5sZWZ0IDogKCBzY3JvbGxJc1Jvb3ROb2RlID8gMCA6IHRoaXMub2Zmc2V0LnNjcm9sbC5sZWZ0ICkgKVxuICAgICAgKVxuICAgIH07XG5cbiAgfSxcblxuICBfY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaGVscGVyLnJlbW92ZUNsYXNzKFwidWktZHJhZ2dhYmxlLWRyYWdnaW5nXCIpO1xuICAgIGlmICh0aGlzLmhlbHBlclswXSAhPT0gdGhpcy5lbGVtZW50WzBdICYmICF0aGlzLmNhbmNlbEhlbHBlclJlbW92YWwpIHtcbiAgICAgIHRoaXMuaGVscGVyLnJlbW92ZSgpO1xuICAgIH1cbiAgICB0aGlzLmhlbHBlciA9IG51bGw7XG4gICAgdGhpcy5jYW5jZWxIZWxwZXJSZW1vdmFsID0gZmFsc2U7XG4gICAgaWYgKCB0aGlzLmRlc3Ryb3lPbkNsZWFyICkge1xuICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgfVxuICB9LFxuXG4gIF9ub3JtYWxpemVSaWdodEJvdHRvbTogZnVuY3Rpb24oKSB7XG4gICAgaWYgKCB0aGlzLm9wdGlvbnMuYXhpcyAhPT0gXCJ5XCIgJiYgdGhpcy5oZWxwZXIuY3NzKCBcInJpZ2h0XCIgKSAhPT0gXCJhdXRvXCIgKSB7XG4gICAgICB0aGlzLmhlbHBlci53aWR0aCggdGhpcy5oZWxwZXIud2lkdGgoKSApO1xuICAgICAgdGhpcy5oZWxwZXIuY3NzKCBcInJpZ2h0XCIsIFwiYXV0b1wiICk7XG4gICAgfVxuICAgIGlmICggdGhpcy5vcHRpb25zLmF4aXMgIT09IFwieFwiICYmIHRoaXMuaGVscGVyLmNzcyggXCJib3R0b21cIiApICE9PSBcImF1dG9cIiApIHtcbiAgICAgIHRoaXMuaGVscGVyLmhlaWdodCggdGhpcy5oZWxwZXIuaGVpZ2h0KCkgKTtcbiAgICAgIHRoaXMuaGVscGVyLmNzcyggXCJib3R0b21cIiwgXCJhdXRvXCIgKTtcbiAgICB9XG4gIH0sXG5cbiAgLy8gRnJvbSBub3cgb24gYnVsayBzdHVmZiAtIG1haW5seSBoZWxwZXJzXG5cbiAgX3RyaWdnZXI6IGZ1bmN0aW9uKCB0eXBlLCBldmVudCwgdWkgKSB7XG4gICAgdWkgPSB1aSB8fCB0aGlzLl91aUhhc2goKTtcbiAgICAkLnVpLnBsdWdpbi5jYWxsKCB0aGlzLCB0eXBlLCBbIGV2ZW50LCB1aSwgdGhpcyBdLCB0cnVlICk7XG5cbiAgICAvLyBBYnNvbHV0ZSBwb3NpdGlvbiBhbmQgb2Zmc2V0IChzZWUgIzY4ODQgKSBoYXZlIHRvIGJlIHJlY2FsY3VsYXRlZCBhZnRlciBwbHVnaW5zXG4gICAgaWYgKCAvXihkcmFnfHN0YXJ0fHN0b3ApLy50ZXN0KCB0eXBlICkgKSB7XG4gICAgICB0aGlzLnBvc2l0aW9uQWJzID0gdGhpcy5fY29udmVydFBvc2l0aW9uVG8oIFwiYWJzb2x1dGVcIiApO1xuICAgICAgdWkub2Zmc2V0ID0gdGhpcy5wb3NpdGlvbkFicztcbiAgICB9XG4gICAgcmV0dXJuICQuV2lkZ2V0LnByb3RvdHlwZS5fdHJpZ2dlci5jYWxsKCB0aGlzLCB0eXBlLCBldmVudCwgdWkgKTtcbiAgfSxcblxuICBwbHVnaW5zOiB7fSxcblxuICBfdWlIYXNoOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVscGVyOiB0aGlzLmhlbHBlcixcbiAgICAgIHBvc2l0aW9uOiB0aGlzLnBvc2l0aW9uLFxuICAgICAgb3JpZ2luYWxQb3NpdGlvbjogdGhpcy5vcmlnaW5hbFBvc2l0aW9uLFxuICAgICAgb2Zmc2V0OiB0aGlzLnBvc2l0aW9uQWJzXG4gICAgfTtcbiAgfVxuXG59KTtcblxuJC51aS5wbHVnaW4uYWRkKCBcImRyYWdnYWJsZVwiLCBcImNvbm5lY3RUb1NvcnRhYmxlXCIsIHtcbiAgc3RhcnQ6IGZ1bmN0aW9uKCBldmVudCwgdWksIGRyYWdnYWJsZSApIHtcbiAgICB2YXIgdWlTb3J0YWJsZSA9ICQuZXh0ZW5kKCB7fSwgdWksIHtcbiAgICAgIGl0ZW06IGRyYWdnYWJsZS5lbGVtZW50XG4gICAgfSk7XG5cbiAgICBkcmFnZ2FibGUuc29ydGFibGVzID0gW107XG4gICAgJCggZHJhZ2dhYmxlLm9wdGlvbnMuY29ubmVjdFRvU29ydGFibGUgKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNvcnRhYmxlID0gJCggdGhpcyApLnNvcnRhYmxlKCBcImluc3RhbmNlXCIgKTtcblxuICAgICAgaWYgKCBzb3J0YWJsZSAmJiAhc29ydGFibGUub3B0aW9ucy5kaXNhYmxlZCApIHtcbiAgICAgICAgZHJhZ2dhYmxlLnNvcnRhYmxlcy5wdXNoKCBzb3J0YWJsZSApO1xuXG4gICAgICAgIC8vIHJlZnJlc2hQb3NpdGlvbnMgaXMgY2FsbGVkIGF0IGRyYWcgc3RhcnQgdG8gcmVmcmVzaCB0aGUgY29udGFpbmVyQ2FjaGVcbiAgICAgICAgLy8gd2hpY2ggaXMgdXNlZCBpbiBkcmFnLiBUaGlzIGVuc3VyZXMgaXQncyBpbml0aWFsaXplZCBhbmQgc3luY2hyb25pemVkXG4gICAgICAgIC8vIHdpdGggYW55IGNoYW5nZXMgdGhhdCBtaWdodCBoYXZlIGhhcHBlbmVkIG9uIHRoZSBwYWdlIHNpbmNlIGluaXRpYWxpemF0aW9uLlxuICAgICAgICBzb3J0YWJsZS5yZWZyZXNoUG9zaXRpb25zKCk7XG4gICAgICAgIHNvcnRhYmxlLl90cmlnZ2VyKFwiYWN0aXZhdGVcIiwgZXZlbnQsIHVpU29ydGFibGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBzdG9wOiBmdW5jdGlvbiggZXZlbnQsIHVpLCBkcmFnZ2FibGUgKSB7XG4gICAgdmFyIHVpU29ydGFibGUgPSAkLmV4dGVuZCgge30sIHVpLCB7XG4gICAgICBpdGVtOiBkcmFnZ2FibGUuZWxlbWVudFxuICAgIH0pO1xuXG4gICAgZHJhZ2dhYmxlLmNhbmNlbEhlbHBlclJlbW92YWwgPSBmYWxzZTtcblxuICAgICQuZWFjaCggZHJhZ2dhYmxlLnNvcnRhYmxlcywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc29ydGFibGUgPSB0aGlzO1xuXG4gICAgICBpZiAoIHNvcnRhYmxlLmlzT3ZlciApIHtcbiAgICAgICAgc29ydGFibGUuaXNPdmVyID0gMDtcblxuICAgICAgICAvLyBBbGxvdyB0aGlzIHNvcnRhYmxlIHRvIGhhbmRsZSByZW1vdmluZyB0aGUgaGVscGVyXG4gICAgICAgIGRyYWdnYWJsZS5jYW5jZWxIZWxwZXJSZW1vdmFsID0gdHJ1ZTtcbiAgICAgICAgc29ydGFibGUuY2FuY2VsSGVscGVyUmVtb3ZhbCA9IGZhbHNlO1xuXG4gICAgICAgIC8vIFVzZSBfc3RvcmVkQ1NTIFRvIHJlc3RvcmUgcHJvcGVydGllcyBpbiB0aGUgc29ydGFibGUsXG4gICAgICAgIC8vIGFzIHRoaXMgYWxzbyBoYW5kbGVzIHJldmVydCAoIzk2NzUpIHNpbmNlIHRoZSBkcmFnZ2FibGVcbiAgICAgICAgLy8gbWF5IGhhdmUgbW9kaWZpZWQgdGhlbSBpbiB1bmV4cGVjdGVkIHdheXMgKCM4ODA5KVxuICAgICAgICBzb3J0YWJsZS5fc3RvcmVkQ1NTID0ge1xuICAgICAgICAgIHBvc2l0aW9uOiBzb3J0YWJsZS5wbGFjZWhvbGRlci5jc3MoIFwicG9zaXRpb25cIiApLFxuICAgICAgICAgIHRvcDogc29ydGFibGUucGxhY2Vob2xkZXIuY3NzKCBcInRvcFwiICksXG4gICAgICAgICAgbGVmdDogc29ydGFibGUucGxhY2Vob2xkZXIuY3NzKCBcImxlZnRcIiApXG4gICAgICAgIH07XG5cbiAgICAgICAgc29ydGFibGUuX21vdXNlU3RvcChldmVudCk7XG5cbiAgICAgICAgLy8gT25jZSBkcmFnIGhhcyBlbmRlZCwgdGhlIHNvcnRhYmxlIHNob3VsZCByZXR1cm4gdG8gdXNpbmdcbiAgICAgICAgLy8gaXRzIG9yaWdpbmFsIGhlbHBlciwgbm90IHRoZSBzaGFyZWQgaGVscGVyIGZyb20gZHJhZ2dhYmxlXG4gICAgICAgIHNvcnRhYmxlLm9wdGlvbnMuaGVscGVyID0gc29ydGFibGUub3B0aW9ucy5faGVscGVyO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gUHJldmVudCB0aGlzIFNvcnRhYmxlIGZyb20gcmVtb3ZpbmcgdGhlIGhlbHBlci5cbiAgICAgICAgLy8gSG93ZXZlciwgZG9uJ3Qgc2V0IHRoZSBkcmFnZ2FibGUgdG8gcmVtb3ZlIHRoZSBoZWxwZXJcbiAgICAgICAgLy8gZWl0aGVyIGFzIGFub3RoZXIgY29ubmVjdGVkIFNvcnRhYmxlIG1heSB5ZXQgaGFuZGxlIHRoZSByZW1vdmFsLlxuICAgICAgICBzb3J0YWJsZS5jYW5jZWxIZWxwZXJSZW1vdmFsID0gdHJ1ZTtcblxuICAgICAgICBzb3J0YWJsZS5fdHJpZ2dlciggXCJkZWFjdGl2YXRlXCIsIGV2ZW50LCB1aVNvcnRhYmxlICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIGRyYWc6IGZ1bmN0aW9uKCBldmVudCwgdWksIGRyYWdnYWJsZSApIHtcbiAgICAkLmVhY2goIGRyYWdnYWJsZS5zb3J0YWJsZXMsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGlubmVybW9zdEludGVyc2VjdGluZyA9IGZhbHNlLFxuICAgICAgICBzb3J0YWJsZSA9IHRoaXM7XG5cbiAgICAgIC8vIENvcHkgb3ZlciB2YXJpYWJsZXMgdGhhdCBzb3J0YWJsZSdzIF9pbnRlcnNlY3RzV2l0aCB1c2VzXG4gICAgICBzb3J0YWJsZS5wb3NpdGlvbkFicyA9IGRyYWdnYWJsZS5wb3NpdGlvbkFicztcbiAgICAgIHNvcnRhYmxlLmhlbHBlclByb3BvcnRpb25zID0gZHJhZ2dhYmxlLmhlbHBlclByb3BvcnRpb25zO1xuICAgICAgc29ydGFibGUub2Zmc2V0LmNsaWNrID0gZHJhZ2dhYmxlLm9mZnNldC5jbGljaztcblxuICAgICAgaWYgKCBzb3J0YWJsZS5faW50ZXJzZWN0c1dpdGgoIHNvcnRhYmxlLmNvbnRhaW5lckNhY2hlICkgKSB7XG4gICAgICAgIGlubmVybW9zdEludGVyc2VjdGluZyA9IHRydWU7XG5cbiAgICAgICAgJC5lYWNoKCBkcmFnZ2FibGUuc29ydGFibGVzLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAvLyBDb3B5IG92ZXIgdmFyaWFibGVzIHRoYXQgc29ydGFibGUncyBfaW50ZXJzZWN0c1dpdGggdXNlc1xuICAgICAgICAgIHRoaXMucG9zaXRpb25BYnMgPSBkcmFnZ2FibGUucG9zaXRpb25BYnM7XG4gICAgICAgICAgdGhpcy5oZWxwZXJQcm9wb3J0aW9ucyA9IGRyYWdnYWJsZS5oZWxwZXJQcm9wb3J0aW9ucztcbiAgICAgICAgICB0aGlzLm9mZnNldC5jbGljayA9IGRyYWdnYWJsZS5vZmZzZXQuY2xpY2s7XG5cbiAgICAgICAgICBpZiAoIHRoaXMgIT09IHNvcnRhYmxlICYmXG4gICAgICAgICAgICAgIHRoaXMuX2ludGVyc2VjdHNXaXRoKCB0aGlzLmNvbnRhaW5lckNhY2hlICkgJiZcbiAgICAgICAgICAgICAgJC5jb250YWlucyggc29ydGFibGUuZWxlbWVudFsgMCBdLCB0aGlzLmVsZW1lbnRbIDAgXSApICkge1xuICAgICAgICAgICAgaW5uZXJtb3N0SW50ZXJzZWN0aW5nID0gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGlubmVybW9zdEludGVyc2VjdGluZztcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmICggaW5uZXJtb3N0SW50ZXJzZWN0aW5nICkge1xuICAgICAgICAvLyBJZiBpdCBpbnRlcnNlY3RzLCB3ZSB1c2UgYSBsaXR0bGUgaXNPdmVyIHZhcmlhYmxlIGFuZCBzZXQgaXQgb25jZSxcbiAgICAgICAgLy8gc28gdGhhdCB0aGUgbW92ZS1pbiBzdHVmZiBnZXRzIGZpcmVkIG9ubHkgb25jZS5cbiAgICAgICAgaWYgKCAhc29ydGFibGUuaXNPdmVyICkge1xuICAgICAgICAgIHNvcnRhYmxlLmlzT3ZlciA9IDE7XG5cbiAgICAgICAgICBzb3J0YWJsZS5jdXJyZW50SXRlbSA9IHVpLmhlbHBlclxuICAgICAgICAgICAgLmFwcGVuZFRvKCBzb3J0YWJsZS5lbGVtZW50IClcbiAgICAgICAgICAgIC5kYXRhKCBcInVpLXNvcnRhYmxlLWl0ZW1cIiwgdHJ1ZSApO1xuXG4gICAgICAgICAgLy8gU3RvcmUgaGVscGVyIG9wdGlvbiB0byBsYXRlciByZXN0b3JlIGl0XG4gICAgICAgICAgc29ydGFibGUub3B0aW9ucy5faGVscGVyID0gc29ydGFibGUub3B0aW9ucy5oZWxwZXI7XG5cbiAgICAgICAgICBzb3J0YWJsZS5vcHRpb25zLmhlbHBlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHVpLmhlbHBlclsgMCBdO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICAvLyBGaXJlIHRoZSBzdGFydCBldmVudHMgb2YgdGhlIHNvcnRhYmxlIHdpdGggb3VyIHBhc3NlZCBicm93c2VyIGV2ZW50LFxuICAgICAgICAgIC8vIGFuZCBvdXIgb3duIGhlbHBlciAoc28gaXQgZG9lc24ndCBjcmVhdGUgYSBuZXcgb25lKVxuICAgICAgICAgIGV2ZW50LnRhcmdldCA9IHNvcnRhYmxlLmN1cnJlbnRJdGVtWyAwIF07XG4gICAgICAgICAgc29ydGFibGUuX21vdXNlQ2FwdHVyZSggZXZlbnQsIHRydWUgKTtcbiAgICAgICAgICBzb3J0YWJsZS5fbW91c2VTdGFydCggZXZlbnQsIHRydWUsIHRydWUgKTtcblxuICAgICAgICAgIC8vIEJlY2F1c2UgdGhlIGJyb3dzZXIgZXZlbnQgaXMgd2F5IG9mZiB0aGUgbmV3IGFwcGVuZGVkIHBvcnRsZXQsXG4gICAgICAgICAgLy8gbW9kaWZ5IG5lY2Vzc2FyeSB2YXJpYWJsZXMgdG8gcmVmbGVjdCB0aGUgY2hhbmdlc1xuICAgICAgICAgIHNvcnRhYmxlLm9mZnNldC5jbGljay50b3AgPSBkcmFnZ2FibGUub2Zmc2V0LmNsaWNrLnRvcDtcbiAgICAgICAgICBzb3J0YWJsZS5vZmZzZXQuY2xpY2subGVmdCA9IGRyYWdnYWJsZS5vZmZzZXQuY2xpY2subGVmdDtcbiAgICAgICAgICBzb3J0YWJsZS5vZmZzZXQucGFyZW50LmxlZnQgLT0gZHJhZ2dhYmxlLm9mZnNldC5wYXJlbnQubGVmdCAtXG4gICAgICAgICAgICBzb3J0YWJsZS5vZmZzZXQucGFyZW50LmxlZnQ7XG4gICAgICAgICAgc29ydGFibGUub2Zmc2V0LnBhcmVudC50b3AgLT0gZHJhZ2dhYmxlLm9mZnNldC5wYXJlbnQudG9wIC1cbiAgICAgICAgICAgIHNvcnRhYmxlLm9mZnNldC5wYXJlbnQudG9wO1xuXG4gICAgICAgICAgZHJhZ2dhYmxlLl90cmlnZ2VyKCBcInRvU29ydGFibGVcIiwgZXZlbnQgKTtcblxuICAgICAgICAgIC8vIEluZm9ybSBkcmFnZ2FibGUgdGhhdCB0aGUgaGVscGVyIGlzIGluIGEgdmFsaWQgZHJvcCB6b25lLFxuICAgICAgICAgIC8vIHVzZWQgc29sZWx5IGluIHRoZSByZXZlcnQgb3B0aW9uIHRvIGhhbmRsZSBcInZhbGlkL2ludmFsaWRcIi5cbiAgICAgICAgICBkcmFnZ2FibGUuZHJvcHBlZCA9IHNvcnRhYmxlLmVsZW1lbnQ7XG5cbiAgICAgICAgICAvLyBOZWVkIHRvIHJlZnJlc2hQb3NpdGlvbnMgb2YgYWxsIHNvcnRhYmxlcyBpbiB0aGUgY2FzZSB0aGF0XG4gICAgICAgICAgLy8gYWRkaW5nIHRvIG9uZSBzb3J0YWJsZSBjaGFuZ2VzIHRoZSBsb2NhdGlvbiBvZiB0aGUgb3RoZXIgc29ydGFibGVzICgjOTY3NSlcbiAgICAgICAgICAkLmVhY2goIGRyYWdnYWJsZS5zb3J0YWJsZXMsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoUG9zaXRpb25zKCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBoYWNrIHNvIHJlY2VpdmUvdXBkYXRlIGNhbGxiYWNrcyB3b3JrIChtb3N0bHkpXG4gICAgICAgICAgZHJhZ2dhYmxlLmN1cnJlbnRJdGVtID0gZHJhZ2dhYmxlLmVsZW1lbnQ7XG4gICAgICAgICAgc29ydGFibGUuZnJvbU91dHNpZGUgPSBkcmFnZ2FibGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIHNvcnRhYmxlLmN1cnJlbnRJdGVtICkge1xuICAgICAgICAgIHNvcnRhYmxlLl9tb3VzZURyYWcoIGV2ZW50ICk7XG4gICAgICAgICAgLy8gQ29weSB0aGUgc29ydGFibGUncyBwb3NpdGlvbiBiZWNhdXNlIHRoZSBkcmFnZ2FibGUncyBjYW4gcG90ZW50aWFsbHkgcmVmbGVjdFxuICAgICAgICAgIC8vIGEgcmVsYXRpdmUgcG9zaXRpb24sIHdoaWxlIHNvcnRhYmxlIGlzIGFsd2F5cyBhYnNvbHV0ZSwgd2hpY2ggdGhlIGRyYWdnZWRcbiAgICAgICAgICAvLyBlbGVtZW50IGhhcyBub3cgYmVjb21lLiAoIzg4MDkpXG4gICAgICAgICAgdWkucG9zaXRpb24gPSBzb3J0YWJsZS5wb3NpdGlvbjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gSWYgaXQgZG9lc24ndCBpbnRlcnNlY3Qgd2l0aCB0aGUgc29ydGFibGUsIGFuZCBpdCBpbnRlcnNlY3RlZCBiZWZvcmUsXG4gICAgICAgIC8vIHdlIGZha2UgdGhlIGRyYWcgc3RvcCBvZiB0aGUgc29ydGFibGUsIGJ1dCBtYWtlIHN1cmUgaXQgZG9lc24ndCByZW1vdmVcbiAgICAgICAgLy8gdGhlIGhlbHBlciBieSB1c2luZyBjYW5jZWxIZWxwZXJSZW1vdmFsLlxuICAgICAgICBpZiAoIHNvcnRhYmxlLmlzT3ZlciApIHtcblxuICAgICAgICAgIHNvcnRhYmxlLmlzT3ZlciA9IDA7XG4gICAgICAgICAgc29ydGFibGUuY2FuY2VsSGVscGVyUmVtb3ZhbCA9IHRydWU7XG5cbiAgICAgICAgICAvLyBDYWxsaW5nIHNvcnRhYmxlJ3MgbW91c2VTdG9wIHdvdWxkIHRyaWdnZXIgYSByZXZlcnQsXG4gICAgICAgICAgLy8gc28gcmV2ZXJ0IG11c3QgYmUgdGVtcG9yYXJpbHkgZmFsc2UgdW50aWwgYWZ0ZXIgbW91c2VTdG9wIGlzIGNhbGxlZC5cbiAgICAgICAgICBzb3J0YWJsZS5vcHRpb25zLl9yZXZlcnQgPSBzb3J0YWJsZS5vcHRpb25zLnJldmVydDtcbiAgICAgICAgICBzb3J0YWJsZS5vcHRpb25zLnJldmVydCA9IGZhbHNlO1xuXG4gICAgICAgICAgc29ydGFibGUuX3RyaWdnZXIoIFwib3V0XCIsIGV2ZW50LCBzb3J0YWJsZS5fdWlIYXNoKCBzb3J0YWJsZSApICk7XG4gICAgICAgICAgc29ydGFibGUuX21vdXNlU3RvcCggZXZlbnQsIHRydWUgKTtcblxuICAgICAgICAgIC8vIHJlc3RvcmUgc29ydGFibGUgYmVoYXZpb3JzIHRoYXQgd2VyZSBtb2RmaWVkXG4gICAgICAgICAgLy8gd2hlbiB0aGUgZHJhZ2dhYmxlIGVudGVyZWQgdGhlIHNvcnRhYmxlIGFyZWEgKCM5NDgxKVxuICAgICAgICAgIHNvcnRhYmxlLm9wdGlvbnMucmV2ZXJ0ID0gc29ydGFibGUub3B0aW9ucy5fcmV2ZXJ0O1xuICAgICAgICAgIHNvcnRhYmxlLm9wdGlvbnMuaGVscGVyID0gc29ydGFibGUub3B0aW9ucy5faGVscGVyO1xuXG4gICAgICAgICAgaWYgKCBzb3J0YWJsZS5wbGFjZWhvbGRlciApIHtcbiAgICAgICAgICAgIHNvcnRhYmxlLnBsYWNlaG9sZGVyLnJlbW92ZSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFJlY2FsY3VsYXRlIHRoZSBkcmFnZ2FibGUncyBvZmZzZXQgY29uc2lkZXJpbmcgdGhlIHNvcnRhYmxlXG4gICAgICAgICAgLy8gbWF5IGhhdmUgbW9kaWZpZWQgdGhlbSBpbiB1bmV4cGVjdGVkIHdheXMgKCM4ODA5KVxuICAgICAgICAgIGRyYWdnYWJsZS5fcmVmcmVzaE9mZnNldHMoIGV2ZW50ICk7XG4gICAgICAgICAgdWkucG9zaXRpb24gPSBkcmFnZ2FibGUuX2dlbmVyYXRlUG9zaXRpb24oIGV2ZW50LCB0cnVlICk7XG5cbiAgICAgICAgICBkcmFnZ2FibGUuX3RyaWdnZXIoIFwiZnJvbVNvcnRhYmxlXCIsIGV2ZW50ICk7XG5cbiAgICAgICAgICAvLyBJbmZvcm0gZHJhZ2dhYmxlIHRoYXQgdGhlIGhlbHBlciBpcyBubyBsb25nZXIgaW4gYSB2YWxpZCBkcm9wIHpvbmVcbiAgICAgICAgICBkcmFnZ2FibGUuZHJvcHBlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgLy8gTmVlZCB0byByZWZyZXNoUG9zaXRpb25zIG9mIGFsbCBzb3J0YWJsZXMganVzdCBpbiBjYXNlIHJlbW92aW5nXG4gICAgICAgICAgLy8gZnJvbSBvbmUgc29ydGFibGUgY2hhbmdlcyB0aGUgbG9jYXRpb24gb2Ygb3RoZXIgc29ydGFibGVzICgjOTY3NSlcbiAgICAgICAgICAkLmVhY2goIGRyYWdnYWJsZS5zb3J0YWJsZXMsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoUG9zaXRpb25zKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufSk7XG5cbiQudWkucGx1Z2luLmFkZChcImRyYWdnYWJsZVwiLCBcImN1cnNvclwiLCB7XG4gIHN0YXJ0OiBmdW5jdGlvbiggZXZlbnQsIHVpLCBpbnN0YW5jZSApIHtcbiAgICB2YXIgdCA9ICQoIFwiYm9keVwiICksXG4gICAgICBvID0gaW5zdGFuY2Uub3B0aW9ucztcblxuICAgIGlmICh0LmNzcyhcImN1cnNvclwiKSkge1xuICAgICAgby5fY3Vyc29yID0gdC5jc3MoXCJjdXJzb3JcIik7XG4gICAgfVxuICAgIHQuY3NzKFwiY3Vyc29yXCIsIG8uY3Vyc29yKTtcbiAgfSxcbiAgc3RvcDogZnVuY3Rpb24oIGV2ZW50LCB1aSwgaW5zdGFuY2UgKSB7XG4gICAgdmFyIG8gPSBpbnN0YW5jZS5vcHRpb25zO1xuICAgIGlmIChvLl9jdXJzb3IpIHtcbiAgICAgICQoXCJib2R5XCIpLmNzcyhcImN1cnNvclwiLCBvLl9jdXJzb3IpO1xuICAgIH1cbiAgfVxufSk7XG5cbiQudWkucGx1Z2luLmFkZChcImRyYWdnYWJsZVwiLCBcIm9wYWNpdHlcIiwge1xuICBzdGFydDogZnVuY3Rpb24oIGV2ZW50LCB1aSwgaW5zdGFuY2UgKSB7XG4gICAgdmFyIHQgPSAkKCB1aS5oZWxwZXIgKSxcbiAgICAgIG8gPSBpbnN0YW5jZS5vcHRpb25zO1xuICAgIGlmICh0LmNzcyhcIm9wYWNpdHlcIikpIHtcbiAgICAgIG8uX29wYWNpdHkgPSB0LmNzcyhcIm9wYWNpdHlcIik7XG4gICAgfVxuICAgIHQuY3NzKFwib3BhY2l0eVwiLCBvLm9wYWNpdHkpO1xuICB9LFxuICBzdG9wOiBmdW5jdGlvbiggZXZlbnQsIHVpLCBpbnN0YW5jZSApIHtcbiAgICB2YXIgbyA9IGluc3RhbmNlLm9wdGlvbnM7XG4gICAgaWYgKG8uX29wYWNpdHkpIHtcbiAgICAgICQodWkuaGVscGVyKS5jc3MoXCJvcGFjaXR5XCIsIG8uX29wYWNpdHkpO1xuICAgIH1cbiAgfVxufSk7XG5cbiQudWkucGx1Z2luLmFkZChcImRyYWdnYWJsZVwiLCBcInNjcm9sbFwiLCB7XG4gIHN0YXJ0OiBmdW5jdGlvbiggZXZlbnQsIHVpLCBpICkge1xuICAgIGlmICggIWkuc2Nyb2xsUGFyZW50Tm90SGlkZGVuICkge1xuICAgICAgaS5zY3JvbGxQYXJlbnROb3RIaWRkZW4gPSBpLmhlbHBlci5zY3JvbGxQYXJlbnQoIGZhbHNlICk7XG4gICAgfVxuXG4gICAgaWYgKCBpLnNjcm9sbFBhcmVudE5vdEhpZGRlblsgMCBdICE9PSBpLmRvY3VtZW50WyAwIF0gJiYgaS5zY3JvbGxQYXJlbnROb3RIaWRkZW5bIDAgXS50YWdOYW1lICE9PSBcIkhUTUxcIiApIHtcbiAgICAgIGkub3ZlcmZsb3dPZmZzZXQgPSBpLnNjcm9sbFBhcmVudE5vdEhpZGRlbi5vZmZzZXQoKTtcbiAgICB9XG4gIH0sXG4gIGRyYWc6IGZ1bmN0aW9uKCBldmVudCwgdWksIGkgICkge1xuXG4gICAgdmFyIG8gPSBpLm9wdGlvbnMsXG4gICAgICBzY3JvbGxlZCA9IGZhbHNlLFxuICAgICAgc2Nyb2xsUGFyZW50ID0gaS5zY3JvbGxQYXJlbnROb3RIaWRkZW5bIDAgXSxcbiAgICAgIGRvY3VtZW50ID0gaS5kb2N1bWVudFsgMCBdO1xuXG4gICAgaWYgKCBzY3JvbGxQYXJlbnQgIT09IGRvY3VtZW50ICYmIHNjcm9sbFBhcmVudC50YWdOYW1lICE9PSBcIkhUTUxcIiApIHtcbiAgICAgIGlmICggIW8uYXhpcyB8fCBvLmF4aXMgIT09IFwieFwiICkge1xuICAgICAgICBpZiAoICggaS5vdmVyZmxvd09mZnNldC50b3AgKyBzY3JvbGxQYXJlbnQub2Zmc2V0SGVpZ2h0ICkgLSBldmVudC5wYWdlWSA8IG8uc2Nyb2xsU2Vuc2l0aXZpdHkgKSB7XG4gICAgICAgICAgc2Nyb2xsUGFyZW50LnNjcm9sbFRvcCA9IHNjcm9sbGVkID0gc2Nyb2xsUGFyZW50LnNjcm9sbFRvcCArIG8uc2Nyb2xsU3BlZWQ7XG4gICAgICAgIH0gZWxzZSBpZiAoIGV2ZW50LnBhZ2VZIC0gaS5vdmVyZmxvd09mZnNldC50b3AgPCBvLnNjcm9sbFNlbnNpdGl2aXR5ICkge1xuICAgICAgICAgIHNjcm9sbFBhcmVudC5zY3JvbGxUb3AgPSBzY3JvbGxlZCA9IHNjcm9sbFBhcmVudC5zY3JvbGxUb3AgLSBvLnNjcm9sbFNwZWVkO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICggIW8uYXhpcyB8fCBvLmF4aXMgIT09IFwieVwiICkge1xuICAgICAgICBpZiAoICggaS5vdmVyZmxvd09mZnNldC5sZWZ0ICsgc2Nyb2xsUGFyZW50Lm9mZnNldFdpZHRoICkgLSBldmVudC5wYWdlWCA8IG8uc2Nyb2xsU2Vuc2l0aXZpdHkgKSB7XG4gICAgICAgICAgc2Nyb2xsUGFyZW50LnNjcm9sbExlZnQgPSBzY3JvbGxlZCA9IHNjcm9sbFBhcmVudC5zY3JvbGxMZWZ0ICsgby5zY3JvbGxTcGVlZDtcbiAgICAgICAgfSBlbHNlIGlmICggZXZlbnQucGFnZVggLSBpLm92ZXJmbG93T2Zmc2V0LmxlZnQgPCBvLnNjcm9sbFNlbnNpdGl2aXR5ICkge1xuICAgICAgICAgIHNjcm9sbFBhcmVudC5zY3JvbGxMZWZ0ID0gc2Nyb2xsZWQgPSBzY3JvbGxQYXJlbnQuc2Nyb2xsTGVmdCAtIG8uc2Nyb2xsU3BlZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIGlmICghby5heGlzIHx8IG8uYXhpcyAhPT0gXCJ4XCIpIHtcbiAgICAgICAgaWYgKGV2ZW50LnBhZ2VZIC0gJChkb2N1bWVudCkuc2Nyb2xsVG9wKCkgPCBvLnNjcm9sbFNlbnNpdGl2aXR5KSB7XG4gICAgICAgICAgc2Nyb2xsZWQgPSAkKGRvY3VtZW50KS5zY3JvbGxUb3AoJChkb2N1bWVudCkuc2Nyb2xsVG9wKCkgLSBvLnNjcm9sbFNwZWVkKTtcbiAgICAgICAgfSBlbHNlIGlmICgkKHdpbmRvdykuaGVpZ2h0KCkgLSAoZXZlbnQucGFnZVkgLSAkKGRvY3VtZW50KS5zY3JvbGxUb3AoKSkgPCBvLnNjcm9sbFNlbnNpdGl2aXR5KSB7XG4gICAgICAgICAgc2Nyb2xsZWQgPSAkKGRvY3VtZW50KS5zY3JvbGxUb3AoJChkb2N1bWVudCkuc2Nyb2xsVG9wKCkgKyBvLnNjcm9sbFNwZWVkKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIW8uYXhpcyB8fCBvLmF4aXMgIT09IFwieVwiKSB7XG4gICAgICAgIGlmIChldmVudC5wYWdlWCAtICQoZG9jdW1lbnQpLnNjcm9sbExlZnQoKSA8IG8uc2Nyb2xsU2Vuc2l0aXZpdHkpIHtcbiAgICAgICAgICBzY3JvbGxlZCA9ICQoZG9jdW1lbnQpLnNjcm9sbExlZnQoJChkb2N1bWVudCkuc2Nyb2xsTGVmdCgpIC0gby5zY3JvbGxTcGVlZCk7XG4gICAgICAgIH0gZWxzZSBpZiAoJCh3aW5kb3cpLndpZHRoKCkgLSAoZXZlbnQucGFnZVggLSAkKGRvY3VtZW50KS5zY3JvbGxMZWZ0KCkpIDwgby5zY3JvbGxTZW5zaXRpdml0eSkge1xuICAgICAgICAgIHNjcm9sbGVkID0gJChkb2N1bWVudCkuc2Nyb2xsTGVmdCgkKGRvY3VtZW50KS5zY3JvbGxMZWZ0KCkgKyBvLnNjcm9sbFNwZWVkKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgfVxuXG4gICAgaWYgKHNjcm9sbGVkICE9PSBmYWxzZSAmJiAkLnVpLmRkbWFuYWdlciAmJiAhby5kcm9wQmVoYXZpb3VyKSB7XG4gICAgICAkLnVpLmRkbWFuYWdlci5wcmVwYXJlT2Zmc2V0cyhpLCBldmVudCk7XG4gICAgfVxuXG4gIH1cbn0pO1xuXG4kLnVpLnBsdWdpbi5hZGQoXCJkcmFnZ2FibGVcIiwgXCJzbmFwXCIsIHtcbiAgc3RhcnQ6IGZ1bmN0aW9uKCBldmVudCwgdWksIGkgKSB7XG5cbiAgICB2YXIgbyA9IGkub3B0aW9ucztcblxuICAgIGkuc25hcEVsZW1lbnRzID0gW107XG5cbiAgICAkKG8uc25hcC5jb25zdHJ1Y3RvciAhPT0gU3RyaW5nID8gKCBvLnNuYXAuaXRlbXMgfHwgXCI6ZGF0YSh1aS1kcmFnZ2FibGUpXCIgKSA6IG8uc25hcCkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIHZhciAkdCA9ICQodGhpcyksXG4gICAgICAgICRvID0gJHQub2Zmc2V0KCk7XG4gICAgICBpZiAodGhpcyAhPT0gaS5lbGVtZW50WzBdKSB7XG4gICAgICAgIGkuc25hcEVsZW1lbnRzLnB1c2goe1xuICAgICAgICAgIGl0ZW06IHRoaXMsXG4gICAgICAgICAgd2lkdGg6ICR0Lm91dGVyV2lkdGgoKSwgaGVpZ2h0OiAkdC5vdXRlckhlaWdodCgpLFxuICAgICAgICAgIHRvcDogJG8udG9wLCBsZWZ0OiAkby5sZWZ0XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gIH0sXG4gIGRyYWc6IGZ1bmN0aW9uKCBldmVudCwgdWksIGluc3QgKSB7XG5cbiAgICB2YXIgdHMsIGJzLCBscywgcnMsIGwsIHIsIHQsIGIsIGksIGZpcnN0LFxuICAgICAgbyA9IGluc3Qub3B0aW9ucyxcbiAgICAgIGQgPSBvLnNuYXBUb2xlcmFuY2UsXG4gICAgICB4MSA9IHVpLm9mZnNldC5sZWZ0LCB4MiA9IHgxICsgaW5zdC5oZWxwZXJQcm9wb3J0aW9ucy53aWR0aCxcbiAgICAgIHkxID0gdWkub2Zmc2V0LnRvcCwgeTIgPSB5MSArIGluc3QuaGVscGVyUHJvcG9ydGlvbnMuaGVpZ2h0O1xuXG4gICAgZm9yIChpID0gaW5zdC5zbmFwRWxlbWVudHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pe1xuXG4gICAgICBsID0gaW5zdC5zbmFwRWxlbWVudHNbaV0ubGVmdCAtIGluc3QubWFyZ2lucy5sZWZ0O1xuICAgICAgciA9IGwgKyBpbnN0LnNuYXBFbGVtZW50c1tpXS53aWR0aDtcbiAgICAgIHQgPSBpbnN0LnNuYXBFbGVtZW50c1tpXS50b3AgLSBpbnN0Lm1hcmdpbnMudG9wO1xuICAgICAgYiA9IHQgKyBpbnN0LnNuYXBFbGVtZW50c1tpXS5oZWlnaHQ7XG5cbiAgICAgIGlmICggeDIgPCBsIC0gZCB8fCB4MSA+IHIgKyBkIHx8IHkyIDwgdCAtIGQgfHwgeTEgPiBiICsgZCB8fCAhJC5jb250YWlucyggaW5zdC5zbmFwRWxlbWVudHNbIGkgXS5pdGVtLm93bmVyRG9jdW1lbnQsIGluc3Quc25hcEVsZW1lbnRzWyBpIF0uaXRlbSApICkge1xuICAgICAgICBpZiAoaW5zdC5zbmFwRWxlbWVudHNbaV0uc25hcHBpbmcpIHtcbiAgICAgICAgICAoaW5zdC5vcHRpb25zLnNuYXAucmVsZWFzZSAmJiBpbnN0Lm9wdGlvbnMuc25hcC5yZWxlYXNlLmNhbGwoaW5zdC5lbGVtZW50LCBldmVudCwgJC5leHRlbmQoaW5zdC5fdWlIYXNoKCksIHsgc25hcEl0ZW06IGluc3Quc25hcEVsZW1lbnRzW2ldLml0ZW0gfSkpKTtcbiAgICAgICAgfVxuICAgICAgICBpbnN0LnNuYXBFbGVtZW50c1tpXS5zbmFwcGluZyA9IGZhbHNlO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKG8uc25hcE1vZGUgIT09IFwiaW5uZXJcIikge1xuICAgICAgICB0cyA9IE1hdGguYWJzKHQgLSB5MikgPD0gZDtcbiAgICAgICAgYnMgPSBNYXRoLmFicyhiIC0geTEpIDw9IGQ7XG4gICAgICAgIGxzID0gTWF0aC5hYnMobCAtIHgyKSA8PSBkO1xuICAgICAgICBycyA9IE1hdGguYWJzKHIgLSB4MSkgPD0gZDtcbiAgICAgICAgaWYgKHRzKSB7XG4gICAgICAgICAgdWkucG9zaXRpb24udG9wID0gaW5zdC5fY29udmVydFBvc2l0aW9uVG8oXCJyZWxhdGl2ZVwiLCB7IHRvcDogdCAtIGluc3QuaGVscGVyUHJvcG9ydGlvbnMuaGVpZ2h0LCBsZWZ0OiAwIH0pLnRvcDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYnMpIHtcbiAgICAgICAgICB1aS5wb3NpdGlvbi50b3AgPSBpbnN0Ll9jb252ZXJ0UG9zaXRpb25UbyhcInJlbGF0aXZlXCIsIHsgdG9wOiBiLCBsZWZ0OiAwIH0pLnRvcDtcbiAgICAgICAgfVxuICAgICAgICBpZiAobHMpIHtcbiAgICAgICAgICB1aS5wb3NpdGlvbi5sZWZ0ID0gaW5zdC5fY29udmVydFBvc2l0aW9uVG8oXCJyZWxhdGl2ZVwiLCB7IHRvcDogMCwgbGVmdDogbCAtIGluc3QuaGVscGVyUHJvcG9ydGlvbnMud2lkdGggfSkubGVmdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocnMpIHtcbiAgICAgICAgICB1aS5wb3NpdGlvbi5sZWZ0ID0gaW5zdC5fY29udmVydFBvc2l0aW9uVG8oXCJyZWxhdGl2ZVwiLCB7IHRvcDogMCwgbGVmdDogciB9KS5sZWZ0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZpcnN0ID0gKHRzIHx8IGJzIHx8IGxzIHx8IHJzKTtcblxuICAgICAgaWYgKG8uc25hcE1vZGUgIT09IFwib3V0ZXJcIikge1xuICAgICAgICB0cyA9IE1hdGguYWJzKHQgLSB5MSkgPD0gZDtcbiAgICAgICAgYnMgPSBNYXRoLmFicyhiIC0geTIpIDw9IGQ7XG4gICAgICAgIGxzID0gTWF0aC5hYnMobCAtIHgxKSA8PSBkO1xuICAgICAgICBycyA9IE1hdGguYWJzKHIgLSB4MikgPD0gZDtcbiAgICAgICAgaWYgKHRzKSB7XG4gICAgICAgICAgdWkucG9zaXRpb24udG9wID0gaW5zdC5fY29udmVydFBvc2l0aW9uVG8oXCJyZWxhdGl2ZVwiLCB7IHRvcDogdCwgbGVmdDogMCB9KS50b3A7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJzKSB7XG4gICAgICAgICAgdWkucG9zaXRpb24udG9wID0gaW5zdC5fY29udmVydFBvc2l0aW9uVG8oXCJyZWxhdGl2ZVwiLCB7IHRvcDogYiAtIGluc3QuaGVscGVyUHJvcG9ydGlvbnMuaGVpZ2h0LCBsZWZ0OiAwIH0pLnRvcDtcbiAgICAgICAgfVxuICAgICAgICBpZiAobHMpIHtcbiAgICAgICAgICB1aS5wb3NpdGlvbi5sZWZ0ID0gaW5zdC5fY29udmVydFBvc2l0aW9uVG8oXCJyZWxhdGl2ZVwiLCB7IHRvcDogMCwgbGVmdDogbCB9KS5sZWZ0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChycykge1xuICAgICAgICAgIHVpLnBvc2l0aW9uLmxlZnQgPSBpbnN0Ll9jb252ZXJ0UG9zaXRpb25UbyhcInJlbGF0aXZlXCIsIHsgdG9wOiAwLCBsZWZ0OiByIC0gaW5zdC5oZWxwZXJQcm9wb3J0aW9ucy53aWR0aCB9KS5sZWZ0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghaW5zdC5zbmFwRWxlbWVudHNbaV0uc25hcHBpbmcgJiYgKHRzIHx8IGJzIHx8IGxzIHx8IHJzIHx8IGZpcnN0KSkge1xuICAgICAgICAoaW5zdC5vcHRpb25zLnNuYXAuc25hcCAmJiBpbnN0Lm9wdGlvbnMuc25hcC5zbmFwLmNhbGwoaW5zdC5lbGVtZW50LCBldmVudCwgJC5leHRlbmQoaW5zdC5fdWlIYXNoKCksIHsgc25hcEl0ZW06IGluc3Quc25hcEVsZW1lbnRzW2ldLml0ZW0gfSkpKTtcbiAgICAgIH1cbiAgICAgIGluc3Quc25hcEVsZW1lbnRzW2ldLnNuYXBwaW5nID0gKHRzIHx8IGJzIHx8IGxzIHx8IHJzIHx8IGZpcnN0KTtcblxuICAgIH1cblxuICB9XG59KTtcblxuJC51aS5wbHVnaW4uYWRkKFwiZHJhZ2dhYmxlXCIsIFwic3RhY2tcIiwge1xuICBzdGFydDogZnVuY3Rpb24oIGV2ZW50LCB1aSwgaW5zdGFuY2UgKSB7XG4gICAgdmFyIG1pbixcbiAgICAgIG8gPSBpbnN0YW5jZS5vcHRpb25zLFxuICAgICAgZ3JvdXAgPSAkLm1ha2VBcnJheSgkKG8uc3RhY2spKS5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIChwYXJzZUludCgkKGEpLmNzcyhcInpJbmRleFwiKSwgMTApIHx8IDApIC0gKHBhcnNlSW50KCQoYikuY3NzKFwiekluZGV4XCIpLCAxMCkgfHwgMCk7XG4gICAgICB9KTtcblxuICAgIGlmICghZ3JvdXAubGVuZ3RoKSB7IHJldHVybjsgfVxuXG4gICAgbWluID0gcGFyc2VJbnQoJChncm91cFswXSkuY3NzKFwiekluZGV4XCIpLCAxMCkgfHwgMDtcbiAgICAkKGdyb3VwKS5lYWNoKGZ1bmN0aW9uKGkpIHtcbiAgICAgICQodGhpcykuY3NzKFwiekluZGV4XCIsIG1pbiArIGkpO1xuICAgIH0pO1xuICAgIHRoaXMuY3NzKFwiekluZGV4XCIsIChtaW4gKyBncm91cC5sZW5ndGgpKTtcbiAgfVxufSk7XG5cbiQudWkucGx1Z2luLmFkZChcImRyYWdnYWJsZVwiLCBcInpJbmRleFwiLCB7XG4gIHN0YXJ0OiBmdW5jdGlvbiggZXZlbnQsIHVpLCBpbnN0YW5jZSApIHtcbiAgICB2YXIgdCA9ICQoIHVpLmhlbHBlciApLFxuICAgICAgbyA9IGluc3RhbmNlLm9wdGlvbnM7XG5cbiAgICBpZiAodC5jc3MoXCJ6SW5kZXhcIikpIHtcbiAgICAgIG8uX3pJbmRleCA9IHQuY3NzKFwiekluZGV4XCIpO1xuICAgIH1cbiAgICB0LmNzcyhcInpJbmRleFwiLCBvLnpJbmRleCk7XG4gIH0sXG4gIHN0b3A6IGZ1bmN0aW9uKCBldmVudCwgdWksIGluc3RhbmNlICkge1xuICAgIHZhciBvID0gaW5zdGFuY2Uub3B0aW9ucztcblxuICAgIGlmIChvLl96SW5kZXgpIHtcbiAgICAgICQodWkuaGVscGVyKS5jc3MoXCJ6SW5kZXhcIiwgby5fekluZGV4KTtcbiAgICB9XG4gIH1cbn0pO1xuXG52YXIgZHJhZ2dhYmxlID0gJC51aS5kcmFnZ2FibGU7XG5cblxuLyohXG4gKiBqUXVlcnkgVUkgRHJvcHBhYmxlIDEuMTEuM1xuICogaHR0cDovL2pxdWVyeXVpLmNvbVxuICpcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzXG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4gKiBodHRwOi8vanF1ZXJ5Lm9yZy9saWNlbnNlXG4gKlxuICogaHR0cDovL2FwaS5qcXVlcnl1aS5jb20vZHJvcHBhYmxlL1xuICovXG5cblxuJC53aWRnZXQoIFwidWkuZHJvcHBhYmxlXCIsIHtcbiAgdmVyc2lvbjogXCIxLjExLjNcIixcbiAgd2lkZ2V0RXZlbnRQcmVmaXg6IFwiZHJvcFwiLFxuICBvcHRpb25zOiB7XG4gICAgYWNjZXB0OiBcIipcIixcbiAgICBhY3RpdmVDbGFzczogZmFsc2UsXG4gICAgYWRkQ2xhc3NlczogdHJ1ZSxcbiAgICBncmVlZHk6IGZhbHNlLFxuICAgIGhvdmVyQ2xhc3M6IGZhbHNlLFxuICAgIHNjb3BlOiBcImRlZmF1bHRcIixcbiAgICB0b2xlcmFuY2U6IFwiaW50ZXJzZWN0XCIsXG5cbiAgICAvLyBjYWxsYmFja3NcbiAgICBhY3RpdmF0ZTogbnVsbCxcbiAgICBkZWFjdGl2YXRlOiBudWxsLFxuICAgIGRyb3A6IG51bGwsXG4gICAgb3V0OiBudWxsLFxuICAgIG92ZXI6IG51bGxcbiAgfSxcbiAgX2NyZWF0ZTogZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgcHJvcG9ydGlvbnMsXG4gICAgICBvID0gdGhpcy5vcHRpb25zLFxuICAgICAgYWNjZXB0ID0gby5hY2NlcHQ7XG5cbiAgICB0aGlzLmlzb3ZlciA9IGZhbHNlO1xuICAgIHRoaXMuaXNvdXQgPSB0cnVlO1xuXG4gICAgdGhpcy5hY2NlcHQgPSAkLmlzRnVuY3Rpb24oIGFjY2VwdCApID8gYWNjZXB0IDogZnVuY3Rpb24oIGQgKSB7XG4gICAgICByZXR1cm4gZC5pcyggYWNjZXB0ICk7XG4gICAgfTtcblxuICAgIHRoaXMucHJvcG9ydGlvbnMgPSBmdW5jdGlvbiggLyogdmFsdWVUb1dyaXRlICovICkge1xuICAgICAgaWYgKCBhcmd1bWVudHMubGVuZ3RoICkge1xuICAgICAgICAvLyBTdG9yZSB0aGUgZHJvcHBhYmxlJ3MgcHJvcG9ydGlvbnNcbiAgICAgICAgcHJvcG9ydGlvbnMgPSBhcmd1bWVudHNbIDAgXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFJldHJpZXZlIG9yIGRlcml2ZSB0aGUgZHJvcHBhYmxlJ3MgcHJvcG9ydGlvbnNcbiAgICAgICAgcmV0dXJuIHByb3BvcnRpb25zID9cbiAgICAgICAgICBwcm9wb3J0aW9ucyA6XG4gICAgICAgICAgcHJvcG9ydGlvbnMgPSB7XG4gICAgICAgICAgICB3aWR0aDogdGhpcy5lbGVtZW50WyAwIF0ub2Zmc2V0V2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuZWxlbWVudFsgMCBdLm9mZnNldEhlaWdodFxuICAgICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMuX2FkZFRvTWFuYWdlciggby5zY29wZSApO1xuXG4gICAgby5hZGRDbGFzc2VzICYmIHRoaXMuZWxlbWVudC5hZGRDbGFzcyggXCJ1aS1kcm9wcGFibGVcIiApO1xuXG4gIH0sXG5cbiAgX2FkZFRvTWFuYWdlcjogZnVuY3Rpb24oIHNjb3BlICkge1xuICAgIC8vIEFkZCB0aGUgcmVmZXJlbmNlIGFuZCBwb3NpdGlvbnMgdG8gdGhlIG1hbmFnZXJcbiAgICAkLnVpLmRkbWFuYWdlci5kcm9wcGFibGVzWyBzY29wZSBdID0gJC51aS5kZG1hbmFnZXIuZHJvcHBhYmxlc1sgc2NvcGUgXSB8fCBbXTtcbiAgICAkLnVpLmRkbWFuYWdlci5kcm9wcGFibGVzWyBzY29wZSBdLnB1c2goIHRoaXMgKTtcbiAgfSxcblxuICBfc3BsaWNlOiBmdW5jdGlvbiggZHJvcCApIHtcbiAgICB2YXIgaSA9IDA7XG4gICAgZm9yICggOyBpIDwgZHJvcC5sZW5ndGg7IGkrKyApIHtcbiAgICAgIGlmICggZHJvcFsgaSBdID09PSB0aGlzICkge1xuICAgICAgICBkcm9wLnNwbGljZSggaSwgMSApO1xuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBfZGVzdHJveTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGRyb3AgPSAkLnVpLmRkbWFuYWdlci5kcm9wcGFibGVzWyB0aGlzLm9wdGlvbnMuc2NvcGUgXTtcblxuICAgIHRoaXMuX3NwbGljZSggZHJvcCApO1xuXG4gICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCBcInVpLWRyb3BwYWJsZSB1aS1kcm9wcGFibGUtZGlzYWJsZWRcIiApO1xuICB9LFxuXG4gIF9zZXRPcHRpb246IGZ1bmN0aW9uKCBrZXksIHZhbHVlICkge1xuXG4gICAgaWYgKCBrZXkgPT09IFwiYWNjZXB0XCIgKSB7XG4gICAgICB0aGlzLmFjY2VwdCA9ICQuaXNGdW5jdGlvbiggdmFsdWUgKSA/IHZhbHVlIDogZnVuY3Rpb24oIGQgKSB7XG4gICAgICAgIHJldHVybiBkLmlzKCB2YWx1ZSApO1xuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKCBrZXkgPT09IFwic2NvcGVcIiApIHtcbiAgICAgIHZhciBkcm9wID0gJC51aS5kZG1hbmFnZXIuZHJvcHBhYmxlc1sgdGhpcy5vcHRpb25zLnNjb3BlIF07XG5cbiAgICAgIHRoaXMuX3NwbGljZSggZHJvcCApO1xuICAgICAgdGhpcy5fYWRkVG9NYW5hZ2VyKCB2YWx1ZSApO1xuICAgIH1cblxuICAgIHRoaXMuX3N1cGVyKCBrZXksIHZhbHVlICk7XG4gIH0sXG5cbiAgX2FjdGl2YXRlOiBmdW5jdGlvbiggZXZlbnQgKSB7XG4gICAgdmFyIGRyYWdnYWJsZSA9ICQudWkuZGRtYW5hZ2VyLmN1cnJlbnQ7XG4gICAgaWYgKCB0aGlzLm9wdGlvbnMuYWN0aXZlQ2xhc3MgKSB7XG4gICAgICB0aGlzLmVsZW1lbnQuYWRkQ2xhc3MoIHRoaXMub3B0aW9ucy5hY3RpdmVDbGFzcyApO1xuICAgIH1cbiAgICBpZiAoIGRyYWdnYWJsZSApe1xuICAgICAgdGhpcy5fdHJpZ2dlciggXCJhY3RpdmF0ZVwiLCBldmVudCwgdGhpcy51aSggZHJhZ2dhYmxlICkgKTtcbiAgICB9XG4gIH0sXG5cbiAgX2RlYWN0aXZhdGU6IGZ1bmN0aW9uKCBldmVudCApIHtcbiAgICB2YXIgZHJhZ2dhYmxlID0gJC51aS5kZG1hbmFnZXIuY3VycmVudDtcbiAgICBpZiAoIHRoaXMub3B0aW9ucy5hY3RpdmVDbGFzcyApIHtcbiAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcyggdGhpcy5vcHRpb25zLmFjdGl2ZUNsYXNzICk7XG4gICAgfVxuICAgIGlmICggZHJhZ2dhYmxlICl7XG4gICAgICB0aGlzLl90cmlnZ2VyKCBcImRlYWN0aXZhdGVcIiwgZXZlbnQsIHRoaXMudWkoIGRyYWdnYWJsZSApICk7XG4gICAgfVxuICB9LFxuXG4gIF9vdmVyOiBmdW5jdGlvbiggZXZlbnQgKSB7XG5cbiAgICB2YXIgZHJhZ2dhYmxlID0gJC51aS5kZG1hbmFnZXIuY3VycmVudDtcblxuICAgIC8vIEJhaWwgaWYgZHJhZ2dhYmxlIGFuZCBkcm9wcGFibGUgYXJlIHNhbWUgZWxlbWVudFxuICAgIGlmICggIWRyYWdnYWJsZSB8fCAoIGRyYWdnYWJsZS5jdXJyZW50SXRlbSB8fCBkcmFnZ2FibGUuZWxlbWVudCApWyAwIF0gPT09IHRoaXMuZWxlbWVudFsgMCBdICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICggdGhpcy5hY2NlcHQuY2FsbCggdGhpcy5lbGVtZW50WyAwIF0sICggZHJhZ2dhYmxlLmN1cnJlbnRJdGVtIHx8IGRyYWdnYWJsZS5lbGVtZW50ICkgKSApIHtcbiAgICAgIGlmICggdGhpcy5vcHRpb25zLmhvdmVyQ2xhc3MgKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5hZGRDbGFzcyggdGhpcy5vcHRpb25zLmhvdmVyQ2xhc3MgKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3RyaWdnZXIoIFwib3ZlclwiLCBldmVudCwgdGhpcy51aSggZHJhZ2dhYmxlICkgKTtcbiAgICB9XG5cbiAgfSxcblxuICBfb3V0OiBmdW5jdGlvbiggZXZlbnQgKSB7XG5cbiAgICB2YXIgZHJhZ2dhYmxlID0gJC51aS5kZG1hbmFnZXIuY3VycmVudDtcblxuICAgIC8vIEJhaWwgaWYgZHJhZ2dhYmxlIGFuZCBkcm9wcGFibGUgYXJlIHNhbWUgZWxlbWVudFxuICAgIGlmICggIWRyYWdnYWJsZSB8fCAoIGRyYWdnYWJsZS5jdXJyZW50SXRlbSB8fCBkcmFnZ2FibGUuZWxlbWVudCApWyAwIF0gPT09IHRoaXMuZWxlbWVudFsgMCBdICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICggdGhpcy5hY2NlcHQuY2FsbCggdGhpcy5lbGVtZW50WyAwIF0sICggZHJhZ2dhYmxlLmN1cnJlbnRJdGVtIHx8IGRyYWdnYWJsZS5lbGVtZW50ICkgKSApIHtcbiAgICAgIGlmICggdGhpcy5vcHRpb25zLmhvdmVyQ2xhc3MgKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5yZW1vdmVDbGFzcyggdGhpcy5vcHRpb25zLmhvdmVyQ2xhc3MgKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3RyaWdnZXIoIFwib3V0XCIsIGV2ZW50LCB0aGlzLnVpKCBkcmFnZ2FibGUgKSApO1xuICAgIH1cblxuICB9LFxuXG4gIF9kcm9wOiBmdW5jdGlvbiggZXZlbnQsIGN1c3RvbSApIHtcblxuICAgIHZhciBkcmFnZ2FibGUgPSBjdXN0b20gfHwgJC51aS5kZG1hbmFnZXIuY3VycmVudCxcbiAgICAgIGNoaWxkcmVuSW50ZXJzZWN0aW9uID0gZmFsc2U7XG5cbiAgICAvLyBCYWlsIGlmIGRyYWdnYWJsZSBhbmQgZHJvcHBhYmxlIGFyZSBzYW1lIGVsZW1lbnRcbiAgICBpZiAoICFkcmFnZ2FibGUgfHwgKCBkcmFnZ2FibGUuY3VycmVudEl0ZW0gfHwgZHJhZ2dhYmxlLmVsZW1lbnQgKVsgMCBdID09PSB0aGlzLmVsZW1lbnRbIDAgXSApIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aGlzLmVsZW1lbnQuZmluZCggXCI6ZGF0YSh1aS1kcm9wcGFibGUpXCIgKS5ub3QoIFwiLnVpLWRyYWdnYWJsZS1kcmFnZ2luZ1wiICkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpbnN0ID0gJCggdGhpcyApLmRyb3BwYWJsZSggXCJpbnN0YW5jZVwiICk7XG4gICAgICBpZiAoXG4gICAgICAgIGluc3Qub3B0aW9ucy5ncmVlZHkgJiZcbiAgICAgICAgIWluc3Qub3B0aW9ucy5kaXNhYmxlZCAmJlxuICAgICAgICBpbnN0Lm9wdGlvbnMuc2NvcGUgPT09IGRyYWdnYWJsZS5vcHRpb25zLnNjb3BlICYmXG4gICAgICAgIGluc3QuYWNjZXB0LmNhbGwoIGluc3QuZWxlbWVudFsgMCBdLCAoIGRyYWdnYWJsZS5jdXJyZW50SXRlbSB8fCBkcmFnZ2FibGUuZWxlbWVudCApICkgJiZcbiAgICAgICAgJC51aS5pbnRlcnNlY3QoIGRyYWdnYWJsZSwgJC5leHRlbmQoIGluc3QsIHsgb2Zmc2V0OiBpbnN0LmVsZW1lbnQub2Zmc2V0KCkgfSApLCBpbnN0Lm9wdGlvbnMudG9sZXJhbmNlLCBldmVudCApXG4gICAgICApIHsgY2hpbGRyZW5JbnRlcnNlY3Rpb24gPSB0cnVlOyByZXR1cm4gZmFsc2U7IH1cbiAgICB9KTtcbiAgICBpZiAoIGNoaWxkcmVuSW50ZXJzZWN0aW9uICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICggdGhpcy5hY2NlcHQuY2FsbCggdGhpcy5lbGVtZW50WyAwIF0sICggZHJhZ2dhYmxlLmN1cnJlbnRJdGVtIHx8IGRyYWdnYWJsZS5lbGVtZW50ICkgKSApIHtcbiAgICAgIGlmICggdGhpcy5vcHRpb25zLmFjdGl2ZUNsYXNzICkge1xuICAgICAgICB0aGlzLmVsZW1lbnQucmVtb3ZlQ2xhc3MoIHRoaXMub3B0aW9ucy5hY3RpdmVDbGFzcyApO1xuICAgICAgfVxuICAgICAgaWYgKCB0aGlzLm9wdGlvbnMuaG92ZXJDbGFzcyApIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnJlbW92ZUNsYXNzKCB0aGlzLm9wdGlvbnMuaG92ZXJDbGFzcyApO1xuICAgICAgfVxuICAgICAgdGhpcy5fdHJpZ2dlciggXCJkcm9wXCIsIGV2ZW50LCB0aGlzLnVpKCBkcmFnZ2FibGUgKSApO1xuICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudDtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgfSxcblxuICB1aTogZnVuY3Rpb24oIGMgKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGRyYWdnYWJsZTogKCBjLmN1cnJlbnRJdGVtIHx8IGMuZWxlbWVudCApLFxuICAgICAgaGVscGVyOiBjLmhlbHBlcixcbiAgICAgIHBvc2l0aW9uOiBjLnBvc2l0aW9uLFxuICAgICAgb2Zmc2V0OiBjLnBvc2l0aW9uQWJzXG4gICAgfTtcbiAgfVxuXG59KTtcblxuJC51aS5pbnRlcnNlY3QgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIGlzT3ZlckF4aXMoIHgsIHJlZmVyZW5jZSwgc2l6ZSApIHtcbiAgICByZXR1cm4gKCB4ID49IHJlZmVyZW5jZSApICYmICggeCA8ICggcmVmZXJlbmNlICsgc2l6ZSApICk7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24oIGRyYWdnYWJsZSwgZHJvcHBhYmxlLCB0b2xlcmFuY2VNb2RlLCBldmVudCApIHtcblxuICAgIGlmICggIWRyb3BwYWJsZS5vZmZzZXQgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIHgxID0gKCBkcmFnZ2FibGUucG9zaXRpb25BYnMgfHwgZHJhZ2dhYmxlLnBvc2l0aW9uLmFic29sdXRlICkubGVmdCArIGRyYWdnYWJsZS5tYXJnaW5zLmxlZnQsXG4gICAgICB5MSA9ICggZHJhZ2dhYmxlLnBvc2l0aW9uQWJzIHx8IGRyYWdnYWJsZS5wb3NpdGlvbi5hYnNvbHV0ZSApLnRvcCArIGRyYWdnYWJsZS5tYXJnaW5zLnRvcCxcbiAgICAgIHgyID0geDEgKyBkcmFnZ2FibGUuaGVscGVyUHJvcG9ydGlvbnMud2lkdGgsXG4gICAgICB5MiA9IHkxICsgZHJhZ2dhYmxlLmhlbHBlclByb3BvcnRpb25zLmhlaWdodCxcbiAgICAgIGwgPSBkcm9wcGFibGUub2Zmc2V0LmxlZnQsXG4gICAgICB0ID0gZHJvcHBhYmxlLm9mZnNldC50b3AsXG4gICAgICByID0gbCArIGRyb3BwYWJsZS5wcm9wb3J0aW9ucygpLndpZHRoLFxuICAgICAgYiA9IHQgKyBkcm9wcGFibGUucHJvcG9ydGlvbnMoKS5oZWlnaHQ7XG5cbiAgICBzd2l0Y2ggKCB0b2xlcmFuY2VNb2RlICkge1xuICAgIGNhc2UgXCJmaXRcIjpcbiAgICAgIHJldHVybiAoIGwgPD0geDEgJiYgeDIgPD0gciAmJiB0IDw9IHkxICYmIHkyIDw9IGIgKTtcbiAgICBjYXNlIFwiaW50ZXJzZWN0XCI6XG4gICAgICByZXR1cm4gKCBsIDwgeDEgKyAoIGRyYWdnYWJsZS5oZWxwZXJQcm9wb3J0aW9ucy53aWR0aCAvIDIgKSAmJiAvLyBSaWdodCBIYWxmXG4gICAgICAgIHgyIC0gKCBkcmFnZ2FibGUuaGVscGVyUHJvcG9ydGlvbnMud2lkdGggLyAyICkgPCByICYmIC8vIExlZnQgSGFsZlxuICAgICAgICB0IDwgeTEgKyAoIGRyYWdnYWJsZS5oZWxwZXJQcm9wb3J0aW9ucy5oZWlnaHQgLyAyICkgJiYgLy8gQm90dG9tIEhhbGZcbiAgICAgICAgeTIgLSAoIGRyYWdnYWJsZS5oZWxwZXJQcm9wb3J0aW9ucy5oZWlnaHQgLyAyICkgPCBiICk7IC8vIFRvcCBIYWxmXG4gICAgY2FzZSBcInBvaW50ZXJcIjpcbiAgICAgIHJldHVybiBpc092ZXJBeGlzKCBldmVudC5wYWdlWSwgdCwgZHJvcHBhYmxlLnByb3BvcnRpb25zKCkuaGVpZ2h0ICkgJiYgaXNPdmVyQXhpcyggZXZlbnQucGFnZVgsIGwsIGRyb3BwYWJsZS5wcm9wb3J0aW9ucygpLndpZHRoICk7XG4gICAgY2FzZSBcInRvdWNoXCI6XG4gICAgICByZXR1cm4gKFxuICAgICAgICAoIHkxID49IHQgJiYgeTEgPD0gYiApIHx8IC8vIFRvcCBlZGdlIHRvdWNoaW5nXG4gICAgICAgICggeTIgPj0gdCAmJiB5MiA8PSBiICkgfHwgLy8gQm90dG9tIGVkZ2UgdG91Y2hpbmdcbiAgICAgICAgKCB5MSA8IHQgJiYgeTIgPiBiICkgLy8gU3Vycm91bmRlZCB2ZXJ0aWNhbGx5XG4gICAgICApICYmIChcbiAgICAgICAgKCB4MSA+PSBsICYmIHgxIDw9IHIgKSB8fCAvLyBMZWZ0IGVkZ2UgdG91Y2hpbmdcbiAgICAgICAgKCB4MiA+PSBsICYmIHgyIDw9IHIgKSB8fCAvLyBSaWdodCBlZGdlIHRvdWNoaW5nXG4gICAgICAgICggeDEgPCBsICYmIHgyID4gciApIC8vIFN1cnJvdW5kZWQgaG9yaXpvbnRhbGx5XG4gICAgICApO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9O1xufSkoKTtcblxuLypcbiAgVGhpcyBtYW5hZ2VyIHRyYWNrcyBvZmZzZXRzIG9mIGRyYWdnYWJsZXMgYW5kIGRyb3BwYWJsZXNcbiovXG4kLnVpLmRkbWFuYWdlciA9IHtcbiAgY3VycmVudDogbnVsbCxcbiAgZHJvcHBhYmxlczogeyBcImRlZmF1bHRcIjogW10gfSxcbiAgcHJlcGFyZU9mZnNldHM6IGZ1bmN0aW9uKCB0LCBldmVudCApIHtcblxuICAgIHZhciBpLCBqLFxuICAgICAgbSA9ICQudWkuZGRtYW5hZ2VyLmRyb3BwYWJsZXNbIHQub3B0aW9ucy5zY29wZSBdIHx8IFtdLFxuICAgICAgdHlwZSA9IGV2ZW50ID8gZXZlbnQudHlwZSA6IG51bGwsIC8vIHdvcmthcm91bmQgZm9yICMyMzE3XG4gICAgICBsaXN0ID0gKCB0LmN1cnJlbnRJdGVtIHx8IHQuZWxlbWVudCApLmZpbmQoIFwiOmRhdGEodWktZHJvcHBhYmxlKVwiICkuYWRkQmFjaygpO1xuXG4gICAgZHJvcHBhYmxlc0xvb3A6IGZvciAoIGkgPSAwOyBpIDwgbS5sZW5ndGg7IGkrKyApIHtcblxuICAgICAgLy8gTm8gZGlzYWJsZWQgYW5kIG5vbi1hY2NlcHRlZFxuICAgICAgaWYgKCBtWyBpIF0ub3B0aW9ucy5kaXNhYmxlZCB8fCAoIHQgJiYgIW1bIGkgXS5hY2NlcHQuY2FsbCggbVsgaSBdLmVsZW1lbnRbIDAgXSwgKCB0LmN1cnJlbnRJdGVtIHx8IHQuZWxlbWVudCApICkgKSApIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIEZpbHRlciBvdXQgZWxlbWVudHMgaW4gdGhlIGN1cnJlbnQgZHJhZ2dlZCBpdGVtXG4gICAgICBmb3IgKCBqID0gMDsgaiA8IGxpc3QubGVuZ3RoOyBqKysgKSB7XG4gICAgICAgIGlmICggbGlzdFsgaiBdID09PSBtWyBpIF0uZWxlbWVudFsgMCBdICkge1xuICAgICAgICAgIG1bIGkgXS5wcm9wb3J0aW9ucygpLmhlaWdodCA9IDA7XG4gICAgICAgICAgY29udGludWUgZHJvcHBhYmxlc0xvb3A7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbVsgaSBdLnZpc2libGUgPSBtWyBpIF0uZWxlbWVudC5jc3MoIFwiZGlzcGxheVwiICkgIT09IFwibm9uZVwiO1xuICAgICAgaWYgKCAhbVsgaSBdLnZpc2libGUgKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBBY3RpdmF0ZSB0aGUgZHJvcHBhYmxlIGlmIHVzZWQgZGlyZWN0bHkgZnJvbSBkcmFnZ2FibGVzXG4gICAgICBpZiAoIHR5cGUgPT09IFwibW91c2Vkb3duXCIgKSB7XG4gICAgICAgIG1bIGkgXS5fYWN0aXZhdGUuY2FsbCggbVsgaSBdLCBldmVudCApO1xuICAgICAgfVxuXG4gICAgICBtWyBpIF0ub2Zmc2V0ID0gbVsgaSBdLmVsZW1lbnQub2Zmc2V0KCk7XG4gICAgICBtWyBpIF0ucHJvcG9ydGlvbnMoeyB3aWR0aDogbVsgaSBdLmVsZW1lbnRbIDAgXS5vZmZzZXRXaWR0aCwgaGVpZ2h0OiBtWyBpIF0uZWxlbWVudFsgMCBdLm9mZnNldEhlaWdodCB9KTtcblxuICAgIH1cblxuICB9LFxuICBkcm9wOiBmdW5jdGlvbiggZHJhZ2dhYmxlLCBldmVudCApIHtcblxuICAgIHZhciBkcm9wcGVkID0gZmFsc2U7XG4gICAgLy8gQ3JlYXRlIGEgY29weSBvZiB0aGUgZHJvcHBhYmxlcyBpbiBjYXNlIHRoZSBsaXN0IGNoYW5nZXMgZHVyaW5nIHRoZSBkcm9wICgjOTExNilcbiAgICAkLmVhY2goICggJC51aS5kZG1hbmFnZXIuZHJvcHBhYmxlc1sgZHJhZ2dhYmxlLm9wdGlvbnMuc2NvcGUgXSB8fCBbXSApLnNsaWNlKCksIGZ1bmN0aW9uKCkge1xuXG4gICAgICBpZiAoICF0aGlzLm9wdGlvbnMgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICggIXRoaXMub3B0aW9ucy5kaXNhYmxlZCAmJiB0aGlzLnZpc2libGUgJiYgJC51aS5pbnRlcnNlY3QoIGRyYWdnYWJsZSwgdGhpcywgdGhpcy5vcHRpb25zLnRvbGVyYW5jZSwgZXZlbnQgKSApIHtcbiAgICAgICAgZHJvcHBlZCA9IHRoaXMuX2Ryb3AuY2FsbCggdGhpcywgZXZlbnQgKSB8fCBkcm9wcGVkO1xuICAgICAgfVxuXG4gICAgICBpZiAoICF0aGlzLm9wdGlvbnMuZGlzYWJsZWQgJiYgdGhpcy52aXNpYmxlICYmIHRoaXMuYWNjZXB0LmNhbGwoIHRoaXMuZWxlbWVudFsgMCBdLCAoIGRyYWdnYWJsZS5jdXJyZW50SXRlbSB8fCBkcmFnZ2FibGUuZWxlbWVudCApICkgKSB7XG4gICAgICAgIHRoaXMuaXNvdXQgPSB0cnVlO1xuICAgICAgICB0aGlzLmlzb3ZlciA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9kZWFjdGl2YXRlLmNhbGwoIHRoaXMsIGV2ZW50ICk7XG4gICAgICB9XG5cbiAgICB9KTtcbiAgICByZXR1cm4gZHJvcHBlZDtcblxuICB9LFxuICBkcmFnU3RhcnQ6IGZ1bmN0aW9uKCBkcmFnZ2FibGUsIGV2ZW50ICkge1xuICAgIC8vIExpc3RlbiBmb3Igc2Nyb2xsaW5nIHNvIHRoYXQgaWYgdGhlIGRyYWdnaW5nIGNhdXNlcyBzY3JvbGxpbmcgdGhlIHBvc2l0aW9uIG9mIHRoZSBkcm9wcGFibGVzIGNhbiBiZSByZWNhbGN1bGF0ZWQgKHNlZSAjNTAwMylcbiAgICBkcmFnZ2FibGUuZWxlbWVudC5wYXJlbnRzVW50aWwoIFwiYm9keVwiICkuYmluZCggXCJzY3JvbGwuZHJvcHBhYmxlXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCAhZHJhZ2dhYmxlLm9wdGlvbnMucmVmcmVzaFBvc2l0aW9ucyApIHtcbiAgICAgICAgJC51aS5kZG1hbmFnZXIucHJlcGFyZU9mZnNldHMoIGRyYWdnYWJsZSwgZXZlbnQgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgZHJhZzogZnVuY3Rpb24oIGRyYWdnYWJsZSwgZXZlbnQgKSB7XG5cbiAgICAvLyBJZiB5b3UgaGF2ZSBhIGhpZ2hseSBkeW5hbWljIHBhZ2UsIHlvdSBtaWdodCB0cnkgdGhpcyBvcHRpb24uIEl0IHJlbmRlcnMgcG9zaXRpb25zIGV2ZXJ5IHRpbWUgeW91IG1vdmUgdGhlIG1vdXNlLlxuICAgIGlmICggZHJhZ2dhYmxlLm9wdGlvbnMucmVmcmVzaFBvc2l0aW9ucyApIHtcbiAgICAgICQudWkuZGRtYW5hZ2VyLnByZXBhcmVPZmZzZXRzKCBkcmFnZ2FibGUsIGV2ZW50ICk7XG4gICAgfVxuXG4gICAgLy8gUnVuIHRocm91Z2ggYWxsIGRyb3BwYWJsZXMgYW5kIGNoZWNrIHRoZWlyIHBvc2l0aW9ucyBiYXNlZCBvbiBzcGVjaWZpYyB0b2xlcmFuY2Ugb3B0aW9uc1xuICAgICQuZWFjaCggJC51aS5kZG1hbmFnZXIuZHJvcHBhYmxlc1sgZHJhZ2dhYmxlLm9wdGlvbnMuc2NvcGUgXSB8fCBbXSwgZnVuY3Rpb24oKSB7XG5cbiAgICAgIGlmICggdGhpcy5vcHRpb25zLmRpc2FibGVkIHx8IHRoaXMuZ3JlZWR5Q2hpbGQgfHwgIXRoaXMudmlzaWJsZSApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgcGFyZW50SW5zdGFuY2UsIHNjb3BlLCBwYXJlbnQsXG4gICAgICAgIGludGVyc2VjdHMgPSAkLnVpLmludGVyc2VjdCggZHJhZ2dhYmxlLCB0aGlzLCB0aGlzLm9wdGlvbnMudG9sZXJhbmNlLCBldmVudCApLFxuICAgICAgICBjID0gIWludGVyc2VjdHMgJiYgdGhpcy5pc292ZXIgPyBcImlzb3V0XCIgOiAoIGludGVyc2VjdHMgJiYgIXRoaXMuaXNvdmVyID8gXCJpc292ZXJcIiA6IG51bGwgKTtcbiAgICAgIGlmICggIWMgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCB0aGlzLm9wdGlvbnMuZ3JlZWR5ICkge1xuICAgICAgICAvLyBmaW5kIGRyb3BwYWJsZSBwYXJlbnRzIHdpdGggc2FtZSBzY29wZVxuICAgICAgICBzY29wZSA9IHRoaXMub3B0aW9ucy5zY29wZTtcbiAgICAgICAgcGFyZW50ID0gdGhpcy5lbGVtZW50LnBhcmVudHMoIFwiOmRhdGEodWktZHJvcHBhYmxlKVwiICkuZmlsdGVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiAkKCB0aGlzICkuZHJvcHBhYmxlKCBcImluc3RhbmNlXCIgKS5vcHRpb25zLnNjb3BlID09PSBzY29wZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCBwYXJlbnQubGVuZ3RoICkge1xuICAgICAgICAgIHBhcmVudEluc3RhbmNlID0gJCggcGFyZW50WyAwIF0gKS5kcm9wcGFibGUoIFwiaW5zdGFuY2VcIiApO1xuICAgICAgICAgIHBhcmVudEluc3RhbmNlLmdyZWVkeUNoaWxkID0gKCBjID09PSBcImlzb3ZlclwiICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gd2UganVzdCBtb3ZlZCBpbnRvIGEgZ3JlZWR5IGNoaWxkXG4gICAgICBpZiAoIHBhcmVudEluc3RhbmNlICYmIGMgPT09IFwiaXNvdmVyXCIgKSB7XG4gICAgICAgIHBhcmVudEluc3RhbmNlLmlzb3ZlciA9IGZhbHNlO1xuICAgICAgICBwYXJlbnRJbnN0YW5jZS5pc291dCA9IHRydWU7XG4gICAgICAgIHBhcmVudEluc3RhbmNlLl9vdXQuY2FsbCggcGFyZW50SW5zdGFuY2UsIGV2ZW50ICk7XG4gICAgICB9XG5cbiAgICAgIHRoaXNbIGMgXSA9IHRydWU7XG4gICAgICB0aGlzW2MgPT09IFwiaXNvdXRcIiA/IFwiaXNvdmVyXCIgOiBcImlzb3V0XCJdID0gZmFsc2U7XG4gICAgICB0aGlzW2MgPT09IFwiaXNvdmVyXCIgPyBcIl9vdmVyXCIgOiBcIl9vdXRcIl0uY2FsbCggdGhpcywgZXZlbnQgKTtcblxuICAgICAgLy8gd2UganVzdCBtb3ZlZCBvdXQgb2YgYSBncmVlZHkgY2hpbGRcbiAgICAgIGlmICggcGFyZW50SW5zdGFuY2UgJiYgYyA9PT0gXCJpc291dFwiICkge1xuICAgICAgICBwYXJlbnRJbnN0YW5jZS5pc291dCA9IGZhbHNlO1xuICAgICAgICBwYXJlbnRJbnN0YW5jZS5pc292ZXIgPSB0cnVlO1xuICAgICAgICBwYXJlbnRJbnN0YW5jZS5fb3Zlci5jYWxsKCBwYXJlbnRJbnN0YW5jZSwgZXZlbnQgKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICB9LFxuICBkcmFnU3RvcDogZnVuY3Rpb24oIGRyYWdnYWJsZSwgZXZlbnQgKSB7XG4gICAgZHJhZ2dhYmxlLmVsZW1lbnQucGFyZW50c1VudGlsKCBcImJvZHlcIiApLnVuYmluZCggXCJzY3JvbGwuZHJvcHBhYmxlXCIgKTtcbiAgICAvLyBDYWxsIHByZXBhcmVPZmZzZXRzIG9uZSBmaW5hbCB0aW1lIHNpbmNlIElFIGRvZXMgbm90IGZpcmUgcmV0dXJuIHNjcm9sbCBldmVudHMgd2hlbiBvdmVyZmxvdyB3YXMgY2F1c2VkIGJ5IGRyYWcgKHNlZSAjNTAwMylcbiAgICBpZiAoICFkcmFnZ2FibGUub3B0aW9ucy5yZWZyZXNoUG9zaXRpb25zICkge1xuICAgICAgJC51aS5kZG1hbmFnZXIucHJlcGFyZU9mZnNldHMoIGRyYWdnYWJsZSwgZXZlbnQgKTtcbiAgICB9XG4gIH1cbn07XG5cbnZhciBkcm9wcGFibGUgPSAkLnVpLmRyb3BwYWJsZTtcblxuXG5cbn0pKTsiXX0=
