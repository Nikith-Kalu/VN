// Generated by CoffeeScript 1.12.7
(function() {
  var Object_FreeLayout,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Object_FreeLayout = (function(superClass) {
    extend(Object_FreeLayout, superClass);

    Object_FreeLayout.accessors("zIndex", {
      set: function(v) {
        return this.zIndex_ = v;
      },
      get: function() {
        return (this.zIndex_ || 0) + (!this.parent ? 0 : this.parent.zIndex || 0);
      }
    });


    /**
    * A free-layout which layouts all sub-objects at their specified positions. 
    * So that kind of layout allows each sub-object to be freely positioned.
    *
    * @module ui
    * @class Object_FreeLayout
    * @extends ui.Object_UIElement
    * @memberof ui
    * @constructor
     */

    function Object_FreeLayout(x, y, width, height) {
      Object_FreeLayout.__super__.constructor.call(this);
      this.dstRect.set(x || 0, y || 0, width || 1, height || 1);

      /**
      * Indicates if the layout is resizable.
      * @property resizable
      * @type boolean
       */
      this.resizable = false;

      /**
      * The UI object's animator-component to execute different kind of animations like move, rotate, etc. on it.
      * @property animator
      * @type vn.Component_Animator
       */
      this.animator = new gs.Animator();

      /**
      * The layout's sub-objects.
      * @property controls
      * @type ui.Object_UIElement[]
       */
      this.controls = [];

      /**
      * The behavior component to add free-layout specific behavior.
      * @property behavior
      * @type gs.Component_FreeLayoutBehavior
       */
      this.behavior = new gs.Component_FreeLayoutBehavior();

      /**
      * Indicates if the layouts resizes to fit its content.
      * @property sizeToFit
      * @type boolean
       */
      this.sizeToFit = false;
      this.addComponent(this.behavior);
      this.addComponent(this.animator);
    }

    return Object_FreeLayout;

  })(ui.Object_UIElement);

  ui.Object_FreeLayout = Object_FreeLayout;

}).call(this);
