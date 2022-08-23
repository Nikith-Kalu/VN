var AnimationTypes, Component_Sprite,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_Sprite = (function(superClass) {
  extend(Component_Sprite, superClass);


  /**
  * Called if this object instance is restored from a data-bundle. It can be used
  * re-assign event-handler, anonymous functions, etc.
  *
  * @method onDataBundleRestore.
  * @param Object data - The data-bundle
  * @param gs.ObjectCodecContext context - The codec-context.
   */

  Component_Sprite.prototype.onDataBundleRestore = function(data, context) {
    return this.setupEventHandlers();
  };


  /**
  * A sprite component to display an object on screen. It can be managed or
  * unmanaged. A managed sprite is automatically added to the graphics-system
  * and rendered every frame until it gets disposed. An unmanaged sprite needs
  * to be added and removed manually.
  *
  * @module gs
  * @class Component_Sprite
  * @extends gs.Component_Visual
  * @memberof gs
  * @constructor
  * @param {boolean} managed - Indicates if the sprite is managed by the graphics system.
   */

  function Component_Sprite(managed) {
    Component_Sprite.__super__.constructor.call(this);

    /**
    * The native sprite object to display the game object on screen.
    *
    * @property sprite
    * @type Sprite
    * @protected
     */
    this.sprite = null;

    /**
    * The name of the image to display.
    *
    * @property image
    * @type string
    * @protected
     */
    this.image = null;

    /**
    * The name of the video to display.
    *
    * @property video
    * @type string
    * @protected
     */
    this.video = null;

    /**
    * The name of the folder from where the image should be loaded.
    *
    * @property image
    * @type string
    * @protected
     */
    this.imageFolder = "Graphics/Pictures";

    /**
    * The visibility. If <b>false</b>, the sprite is not rendered.
    *
    * @property visible
    * @type boolean
    * @protected
     */
    this.visible = false;

    /**
    * Indicates if the image is loaded.
    *
    * @property imageLoaded
    * @type boolean
    * @protected
     */
    this.imageLoaded = false;
  }


  /**
  * Disposes the sprite. If the sprite is managed, it will be automatically
  * removed from the graphics system and viewport.
  * @method dispose
   */

  Component_Sprite.prototype.dispose = function() {
    var ref, ref1;
    Component_Sprite.__super__.dispose.apply(this, arguments);
    if (this.sprite) {
      this.sprite.dispose();
      if (this.sprite.video) {
        this.sprite.video.stop();
      }
      if (!this.sprite.managed) {
        if ((ref = this.sprite.viewport) != null) {
          ref.removeGraphicObject(this.sprite);
        }
        return (ref1 = Graphics.viewport) != null ? ref1.removeGraphicObject(this.sprite) : void 0;
      }
    }
  };


  /**
  * Adds event-handlers for mouse/touch events
  *
  * @method setupEventHandlers
   */

  Component_Sprite.prototype.setupEventHandlers = function() {
    return this.sprite.onIndexChange = (function(_this) {
      return function() {
        _this.object.rIndex = _this.sprite.index;
        return _this.object.needsUpdate = true;
      };
    })(this);
  };


  /**
  * Setup the sprite.
  * @method setupSprite
   */

  Component_Sprite.prototype.setupSprite = function() {
    if (!this.sprite) {
      return this.sprite = new gs.Sprite(Graphics.viewport, typeof managed !== "undefined" && managed !== null ? managed : true);
    }
  };


  /**
  * Setup the sprite component. This method is automatically called by the
  * system.
  * @method setup
   */

  Component_Sprite.prototype.setup = function() {
    this.isSetup = true;
    this.setupSprite();
    this.setupEventHandlers();
    return this.update();
  };


  /**
  * Updates the source- and destination-rectangle of the game object so that
  * the associated bitmap fits in. The imageHandling property controls how
  * the rectangles are resized.
  * @method updateRect
   */

  Component_Sprite.prototype.updateRect = function() {
    if (this.sprite.bitmap != null) {
      if (!this.object.imageHandling) {
        this.object.srcRect = new Rect(0, 0, this.sprite.bitmap.width, this.sprite.bitmap.height);
        if (!this.object.fixedSize) {
          this.object.dstRect.width = this.object.srcRect.width;
          return this.object.dstRect.height = this.object.srcRect.height;
        }
      } else if (this.object.imageHandling === 1) {
        this.object.srcRect = new Rect(0, 0, this.sprite.bitmap.width, this.sprite.bitmap.height / 2);
        if (!this.object.fixedSize) {
          this.object.dstRect.width = this.object.srcRect.width;
          return this.object.dstRect.height = this.object.srcRect.height;
        }
      } else if (this.object.imageHandling === 2) {
        if (!this.object.fixedSize) {
          this.object.dstRect.width = this.object.srcRect.width;
          return this.object.dstRect.height = this.object.srcRect.height;
        }
      }
    }
  };


  /**
  * Updates the bitmap object from the associated image name. The imageFolder
  * property controls from which resource-folder the image will be loaded.
  * @method updateBitmap
   */

  Component_Sprite.prototype.updateBitmap = function() {
    var ref, ref1;
    this.imageLoaded = false;
    this.image = this.object.image;
    if (((ref = this.object.image) != null ? ref.startsWith("data:") : void 0) || ((ref1 = this.object.image) != null ? ref1.startsWith("$") : void 0)) {
      this.sprite.bitmap = ResourceManager.getBitmap(this.object.image);
    } else {
      this.sprite.bitmap = ResourceManager.getBitmap((this.object.imageFolder || this.imageFolder) + "/" + this.object.image);
    }
    if (this.sprite.bitmap != null) {
      if (!this.imageLoaded) {
        this.imageLoaded = this.sprite.bitmap.loaded;
      } else {
        delete this.sprite.bitmap.loaded_;
      }
    }
    return this.object.bitmap = this.sprite.bitmap;
  };


  /**
  * Updates the video object from the associated video name. It also updates
  * the video-rendering process.
  * @method updateVideo
   */

  Component_Sprite.prototype.updateVideo = function() {
    var ref, ref1, ref2;
    if (this.object.video !== this.videoName) {
      this.videoName = this.object.video;
      this.sprite.video = ResourceManager.getVideo(((ref = this.object.videoFolder) != null ? ref : "Movies") + "/" + this.object.video);
      if (this.sprite.video != null) {
        if ((ref1 = $PARAMS.preview) != null ? ref1.settings.musicDisabled : void 0) {
          this.sprite.video.volume = 0;
        }
        this.sprite.video.loop = this.object.loop;
        this.sprite.video.play();
        this.object.srcRect = new Rect(0, 0, this.sprite.video.width, this.sprite.video.height);
        if (!this.object.fixedSize) {
          this.object.dstRect = new Rect(this.object.dstRect.x, this.object.dstRect.y, this.sprite.video.width, this.sprite.video.height);
        }
      }
    }
    return (ref2 = this.sprite.video) != null ? ref2.update() : void 0;
  };


  /**
  * Updates the image if the game object has the image-property set.
  * @method updateImage
   */

  Component_Sprite.prototype.updateImage = function() {
    var ref;
    if (this.object.image != null) {
      if (this.object.image !== this.image || (!this.imageLoaded && ((ref = this.sprite.bitmap) != null ? ref.loaded : void 0))) {
        this.updateBitmap();
        return this.updateRect();
      }
    } else if (this.object.bitmap != null) {
      return this.sprite.bitmap = this.object.bitmap;
    } else if ((this.object.video != null) || this.videoName !== this.object.video) {
      return this.updateVideo();
    } else {
      this.image = null;
      this.object.bitmap = null;
      return this.sprite.bitmap = null;
    }
  };


  /**
  * If the sprite is unmanaged, this method will update the visibility of the
  * sprite. If the sprite leaves the viewport, it will be removed to save
  * performance and automatically added back to the viewport if it enters
  * the viewport.
  * @method updateVisibility
   */

  Component_Sprite.prototype.updateVisibility = function() {
    var visible;
    if (!this.sprite.managed) {
      visible = Rect.intersect(this.object.dstRect.x + this.object.origin.x, this.object.dstRect.y + this.object.origin.y, this.object.dstRect.width, this.object.dstRect.height, 0, 0, Graphics.width, Graphics.height);
      if (visible && !this.visible) {
        (this.object.viewport || Graphics.viewport).addGraphicObject(this.sprite);
        this.visible = true;
      }
      if (!visible && this.visible) {
        (this.object.viewport || Graphics.viewport).removeGraphicObject(this.sprite);
        return this.visible = false;
      }
    }
  };


  /**
  * Updates the padding.
  * @method updatePadding
   */

  Component_Sprite.prototype.updatePadding = function() {
    if (this.object.padding != null) {
      this.sprite.x += this.object.padding.left;
      this.sprite.y += this.object.padding.top;
      this.sprite.zoomX -= (this.object.padding.left + this.object.padding.right) / this.object.srcRect.width;
      return this.sprite.zoomY -= (this.object.padding.bottom + this.object.padding.bottom) / this.object.srcRect.height;
    }
  };


  /**
  * Updates the sprite properties from the game object properties.
  * @method updateProperties
   */

  Component_Sprite.prototype.updateProperties = function() {
    var ref, ref1;
    this.sprite.width = this.object.dstRect.width;
    this.sprite.height = this.object.dstRect.height;
    this.sprite.x = this.object.dstRect.x;
    this.sprite.y = this.object.dstRect.y;
    this.sprite.mask = (ref = this.object.mask) != null ? ref : this.mask;
    this.sprite.angle = this.object.angle || 0;
    this.sprite.opacity = (ref1 = this.object.opacity) != null ? ref1 : 255;
    this.sprite.clipRect = this.object.clipRect;
    this.sprite.srcRect = this.object.srcRect;
    this.sprite.blendingMode = this.object.blendMode || 0;
    this.sprite.mirror = this.object.mirror;
    this.sprite.visible = this.object.visible && (!this.object.parent || (this.object.parent.visible == null) || this.object.parent.visible);
    this.sprite.ox = -this.object.origin.x;
    this.sprite.oy = -this.object.origin.y;
    return this.sprite.z = (this.object.zIndex || 0) + (!this.object.parent ? 0 : this.object.parent.zIndex || 0);
  };


  /**
  * Updates the optional sprite properties from the game object properties.
  * @method updateOptionalProperties
   */

  Component_Sprite.prototype.updateOptionalProperties = function() {
    if (this.object.tone != null) {
      this.sprite.tone = this.object.tone;
    }
    if (this.object.color != null) {
      this.sprite.color = this.object.color;
    }
    if (this.object.viewport != null) {
      this.sprite.viewport = this.object.viewport;
    }
    if (this.object.effects != null) {
      this.sprite.effects = this.object.effects;
    }
    if (this.object.anchor != null) {
      this.sprite.anchor.x = this.object.anchor.x;
      this.sprite.anchor.y = this.object.anchor.y;
    }
    if (this.object.positionAnchor != null) {
      this.sprite.positionAnchor = this.object.positionAnchor;
    }
    if (this.object.zoom != null) {
      this.sprite.zoomX = this.object.zoom.x;
      this.sprite.zoomY = this.object.zoom.y;
    }
    if (this.object.motionBlur != null) {
      return this.sprite.motionBlur = this.object.motionBlur;
    }
  };


  /**
  * Updates the sprite component by updating its visibility, image, padding and
  * properties.
  * @method update
   */

  Component_Sprite.prototype.update = function() {
    Component_Sprite.__super__.update.apply(this, arguments);
    if (!this.isSetup) {
      this.setup();
    }
    this.updateVisibility();
    this.updateImage();
    this.updateProperties();
    this.updateOptionalProperties();
    this.updatePadding();
    this.object.rIndex = this.sprite.index;
    return this.sprite.update();
  };

  return Component_Sprite;

})(gs.Component_Visual);


/**
* Enumeration of appearance animations.
*
* @module gs
* @class AnimationTypes
* @static
* @memberof gs
 */

AnimationTypes = (function() {
  function AnimationTypes() {}

  AnimationTypes.initialize = function() {

    /**
    * An object appears or disappears by moving into or out of the screen.
    * @property MOVEMENT
    * @type number
    * @static
    * @final
     */
    this.MOVEMENT = 0;

    /**
    * An object appears or disappears using alpha-blending.
    * @property BLENDING
    * @type number
    * @static
    * @final
     */
    this.BLENDING = 1;

    /**
    * An object appears or disappears using a mask-image.
    * @property MASKING
    * @type number
    * @static
    * @final
     */
    return this.MASKING = 2;
  };

  return AnimationTypes;

})();

AnimationTypes.initialize();

gs.AnimationTypes = AnimationTypes;

gs.Component_Sprite = Component_Sprite;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsZ0NBQUE7RUFBQTs7O0FBQU07Ozs7QUFDRjs7Ozs7Ozs7OzZCQVFBLG1CQUFBLEdBQXFCLFNBQUMsSUFBRCxFQUFPLE9BQVA7V0FDakIsSUFBQyxDQUFBLGtCQUFELENBQUE7RUFEaUI7OztBQUdyQjs7Ozs7Ozs7Ozs7Ozs7RUFhYSwwQkFBQyxPQUFEO0lBQ1QsZ0RBQUE7O0FBRUE7Ozs7Ozs7SUFPQSxJQUFDLENBQUEsTUFBRCxHQUFVOztBQUVWOzs7Ozs7O0lBT0EsSUFBQyxDQUFBLEtBQUQsR0FBUzs7QUFFVDs7Ozs7OztJQU9BLElBQUMsQ0FBQSxLQUFELEdBQVM7O0FBRVQ7Ozs7Ozs7SUFPQSxJQUFDLENBQUEsV0FBRCxHQUFlOztBQUVmOzs7Ozs7O0lBT0EsSUFBQyxDQUFBLE9BQUQsR0FBVzs7QUFFWDs7Ozs7OztJQU9BLElBQUMsQ0FBQSxXQUFELEdBQWU7RUF2RE47OztBQTJEYjs7Ozs7OzZCQUtBLE9BQUEsR0FBUyxTQUFBO0FBQ0wsUUFBQTtJQUFBLCtDQUFBLFNBQUE7SUFFQSxJQUFHLElBQUMsQ0FBQSxNQUFKO01BQ0ksSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLENBQUE7TUFFQSxJQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBWDtRQUNJLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQWQsQ0FBQSxFQURKOztNQUdBLElBQUcsQ0FBSSxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQWY7O2FBQ29CLENBQUUsbUJBQWxCLENBQXNDLElBQUMsQ0FBQSxNQUF2Qzs7d0RBQ2lCLENBQUUsbUJBQW5CLENBQXVDLElBQUMsQ0FBQSxNQUF4QyxXQUZKO09BTko7O0VBSEs7OztBQWFUOzs7Ozs7NkJBS0Esa0JBQUEsR0FBb0IsU0FBQTtXQUNoQixJQUFDLENBQUEsTUFBTSxDQUFDLGFBQVIsR0FBd0IsQ0FBQSxTQUFBLEtBQUE7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RCxDQUFBO0lBQ0EsSUFBQyxDQUFBLFdBQUQsQ0FBQTtJQUNBLElBQUMsQ0FBQSxnQkFBRCxDQUFBO0lBQ0EsSUFBQyxDQUFBLHdCQUFELENBQUE7SUFDQSxJQUFDLENBQUEsYUFBRCxDQUFBO0lBRUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLEdBQWlCLElBQUMsQ0FBQSxNQUFNLENBQUM7V0FDekIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFSLENBQUE7RUFYSTs7OztHQXpTbUIsRUFBRSxDQUFDOzs7QUF1VGxDOzs7Ozs7Ozs7QUFRTTs7O0VBQ0YsY0FBQyxDQUFBLFVBQUQsR0FBYSxTQUFBOztBQUNUOzs7Ozs7O0lBT0EsSUFBQyxDQUFBLFFBQUQsR0FBWTs7QUFDWjs7Ozs7OztJQU9BLElBQUMsQ0FBQSxRQUFELEdBQVk7O0FBQ1o7Ozs7Ozs7V0FPQSxJQUFDLENBQUEsT0FBRCxHQUFXO0VBeEJGOzs7Ozs7QUEwQmpCLGNBQWMsQ0FBQyxVQUFmLENBQUE7O0FBQ0EsRUFBRSxDQUFDLGNBQUgsR0FBb0I7O0FBQ3BCLEVBQUUsQ0FBQyxnQkFBSCxHQUFzQiIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogQ29tcG9uZW50XG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBDb21wb25lbnRfU3ByaXRlIGV4dGVuZHMgZ3MuQ29tcG9uZW50X1Zpc3VhbFxuICAgICMjIypcbiAgICAqIENhbGxlZCBpZiB0aGlzIG9iamVjdCBpbnN0YW5jZSBpcyByZXN0b3JlZCBmcm9tIGEgZGF0YS1idW5kbGUuIEl0IGNhbiBiZSB1c2VkXG4gICAgKiByZS1hc3NpZ24gZXZlbnQtaGFuZGxlciwgYW5vbnltb3VzIGZ1bmN0aW9ucywgZXRjLlxuICAgICpcbiAgICAqIEBtZXRob2Qgb25EYXRhQnVuZGxlUmVzdG9yZS5cbiAgICAqIEBwYXJhbSBPYmplY3QgZGF0YSAtIFRoZSBkYXRhLWJ1bmRsZVxuICAgICogQHBhcmFtIGdzLk9iamVjdENvZGVjQ29udGV4dCBjb250ZXh0IC0gVGhlIGNvZGVjLWNvbnRleHQuXG4gICAgIyMjXG4gICAgb25EYXRhQnVuZGxlUmVzdG9yZTogKGRhdGEsIGNvbnRleHQpIC0+XG4gICAgICAgIEBzZXR1cEV2ZW50SGFuZGxlcnMoKVxuXG4gICAgIyMjKlxuICAgICogQSBzcHJpdGUgY29tcG9uZW50IHRvIGRpc3BsYXkgYW4gb2JqZWN0IG9uIHNjcmVlbi4gSXQgY2FuIGJlIG1hbmFnZWQgb3JcbiAgICAqIHVubWFuYWdlZC4gQSBtYW5hZ2VkIHNwcml0ZSBpcyBhdXRvbWF0aWNhbGx5IGFkZGVkIHRvIHRoZSBncmFwaGljcy1zeXN0ZW1cbiAgICAqIGFuZCByZW5kZXJlZCBldmVyeSBmcmFtZSB1bnRpbCBpdCBnZXRzIGRpc3Bvc2VkLiBBbiB1bm1hbmFnZWQgc3ByaXRlIG5lZWRzXG4gICAgKiB0byBiZSBhZGRlZCBhbmQgcmVtb3ZlZCBtYW51YWxseS5cbiAgICAqXG4gICAgKiBAbW9kdWxlIGdzXG4gICAgKiBAY2xhc3MgQ29tcG9uZW50X1Nwcml0ZVxuICAgICogQGV4dGVuZHMgZ3MuQ29tcG9uZW50X1Zpc3VhbFxuICAgICogQG1lbWJlcm9mIGdzXG4gICAgKiBAY29uc3RydWN0b3JcbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbWFuYWdlZCAtIEluZGljYXRlcyBpZiB0aGUgc3ByaXRlIGlzIG1hbmFnZWQgYnkgdGhlIGdyYXBoaWNzIHN5c3RlbS5cbiAgICAjIyNcbiAgICBjb25zdHJ1Y3RvcjogKG1hbmFnZWQpIC0+XG4gICAgICAgIHN1cGVyKClcblxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIG5hdGl2ZSBzcHJpdGUgb2JqZWN0IHRvIGRpc3BsYXkgdGhlIGdhbWUgb2JqZWN0IG9uIHNjcmVlbi5cbiAgICAgICAgKlxuICAgICAgICAqIEBwcm9wZXJ0eSBzcHJpdGVcbiAgICAgICAgKiBAdHlwZSBTcHJpdGVcbiAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICMjI1xuICAgICAgICBAc3ByaXRlID0gbnVsbFxuXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgbmFtZSBvZiB0aGUgaW1hZ2UgdG8gZGlzcGxheS5cbiAgICAgICAgKlxuICAgICAgICAqIEBwcm9wZXJ0eSBpbWFnZVxuICAgICAgICAqIEB0eXBlIHN0cmluZ1xuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEBpbWFnZSA9IG51bGxcblxuICAgICAgICAjIyMqXG4gICAgICAgICogVGhlIG5hbWUgb2YgdGhlIHZpZGVvIHRvIGRpc3BsYXkuXG4gICAgICAgICpcbiAgICAgICAgKiBAcHJvcGVydHkgdmlkZW9cbiAgICAgICAgKiBAdHlwZSBzdHJpbmdcbiAgICAgICAgKiBAcHJvdGVjdGVkXG4gICAgICAgICMjI1xuICAgICAgICBAdmlkZW8gPSBudWxsXG5cbiAgICAgICAgIyMjKlxuICAgICAgICAqIFRoZSBuYW1lIG9mIHRoZSBmb2xkZXIgZnJvbSB3aGVyZSB0aGUgaW1hZ2Ugc2hvdWxkIGJlIGxvYWRlZC5cbiAgICAgICAgKlxuICAgICAgICAqIEBwcm9wZXJ0eSBpbWFnZVxuICAgICAgICAqIEB0eXBlIHN0cmluZ1xuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEBpbWFnZUZvbGRlciA9IFwiR3JhcGhpY3MvUGljdHVyZXNcIlxuXG4gICAgICAgICMjIypcbiAgICAgICAgKiBUaGUgdmlzaWJpbGl0eS4gSWYgPGI+ZmFsc2U8L2I+LCB0aGUgc3ByaXRlIGlzIG5vdCByZW5kZXJlZC5cbiAgICAgICAgKlxuICAgICAgICAqIEBwcm9wZXJ0eSB2aXNpYmxlXG4gICAgICAgICogQHR5cGUgYm9vbGVhblxuICAgICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgICAgIyMjXG4gICAgICAgIEB2aXNpYmxlID0gbm9cblxuICAgICAgICAjIyMqXG4gICAgICAgICogSW5kaWNhdGVzIGlmIHRoZSBpbWFnZSBpcyBsb2FkZWQuXG4gICAgICAgICpcbiAgICAgICAgKiBAcHJvcGVydHkgaW1hZ2VMb2FkZWRcbiAgICAgICAgKiBAdHlwZSBib29sZWFuXG4gICAgICAgICogQHByb3RlY3RlZFxuICAgICAgICAjIyNcbiAgICAgICAgQGltYWdlTG9hZGVkID0gbm9cblxuXG5cbiAgICAjIyMqXG4gICAgKiBEaXNwb3NlcyB0aGUgc3ByaXRlLiBJZiB0aGUgc3ByaXRlIGlzIG1hbmFnZWQsIGl0IHdpbGwgYmUgYXV0b21hdGljYWxseVxuICAgICogcmVtb3ZlZCBmcm9tIHRoZSBncmFwaGljcyBzeXN0ZW0gYW5kIHZpZXdwb3J0LlxuICAgICogQG1ldGhvZCBkaXNwb3NlXG4gICAgIyMjXG4gICAgZGlzcG9zZTogLT5cbiAgICAgICAgc3VwZXJcblxuICAgICAgICBpZiBAc3ByaXRlXG4gICAgICAgICAgICBAc3ByaXRlLmRpc3Bvc2UoKVxuXG4gICAgICAgICAgICBpZiBAc3ByaXRlLnZpZGVvXG4gICAgICAgICAgICAgICAgQHNwcml0ZS52aWRlby5zdG9wKClcblxuICAgICAgICAgICAgaWYgbm90IEBzcHJpdGUubWFuYWdlZFxuICAgICAgICAgICAgICAgIEBzcHJpdGUudmlld3BvcnQ/LnJlbW92ZUdyYXBoaWNPYmplY3QoQHNwcml0ZSlcbiAgICAgICAgICAgICAgICBHcmFwaGljcy52aWV3cG9ydD8ucmVtb3ZlR3JhcGhpY09iamVjdChAc3ByaXRlKVxuXG4gICAgIyMjKlxuICAgICogQWRkcyBldmVudC1oYW5kbGVycyBmb3IgbW91c2UvdG91Y2ggZXZlbnRzXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cEV2ZW50SGFuZGxlcnNcbiAgICAjIyNcbiAgICBzZXR1cEV2ZW50SGFuZGxlcnM6IC0+XG4gICAgICAgIEBzcHJpdGUub25JbmRleENoYW5nZSA9ID0+XG4gICAgICAgICAgICBAb2JqZWN0LnJJbmRleCA9IEBzcHJpdGUuaW5kZXhcbiAgICAgICAgICAgIEBvYmplY3QubmVlZHNVcGRhdGUgPSB5ZXNcblxuICAgICMjIypcbiAgICAqIFNldHVwIHRoZSBzcHJpdGUuXG4gICAgKiBAbWV0aG9kIHNldHVwU3ByaXRlXG4gICAgIyMjXG4gICAgc2V0dXBTcHJpdGU6IC0+XG4gICAgICAgIGlmICFAc3ByaXRlXG4gICAgICAgICAgICBAc3ByaXRlID0gbmV3IGdzLlNwcml0ZShHcmFwaGljcy52aWV3cG9ydCwgbWFuYWdlZCA/IHllcylcblxuICAgICMjIypcbiAgICAqIFNldHVwIHRoZSBzcHJpdGUgY29tcG9uZW50LiBUaGlzIG1ldGhvZCBpcyBhdXRvbWF0aWNhbGx5IGNhbGxlZCBieSB0aGVcbiAgICAqIHN5c3RlbS5cbiAgICAqIEBtZXRob2Qgc2V0dXBcbiAgICAjIyNcbiAgICBzZXR1cDogLT5cbiAgICAgICAgQGlzU2V0dXAgPSB5ZXNcbiAgICAgICAgQHNldHVwU3ByaXRlKClcbiAgICAgICAgQHNldHVwRXZlbnRIYW5kbGVycygpXG4gICAgICAgIEB1cGRhdGUoKVxuXG5cbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBzb3VyY2UtIGFuZCBkZXN0aW5hdGlvbi1yZWN0YW5nbGUgb2YgdGhlIGdhbWUgb2JqZWN0IHNvIHRoYXRcbiAgICAqIHRoZSBhc3NvY2lhdGVkIGJpdG1hcCBmaXRzIGluLiBUaGUgaW1hZ2VIYW5kbGluZyBwcm9wZXJ0eSBjb250cm9scyBob3dcbiAgICAqIHRoZSByZWN0YW5nbGVzIGFyZSByZXNpemVkLlxuICAgICogQG1ldGhvZCB1cGRhdGVSZWN0XG4gICAgIyMjXG4gICAgdXBkYXRlUmVjdDogLT5cbiAgICAgICAgaWYgQHNwcml0ZS5iaXRtYXA/XG4gICAgICAgICAgICBpZiAhQG9iamVjdC5pbWFnZUhhbmRsaW5nXG4gICAgICAgICAgICAgICAgQG9iamVjdC5zcmNSZWN0ID0gbmV3IFJlY3QoMCwgMCwgQHNwcml0ZS5iaXRtYXAud2lkdGgsIEBzcHJpdGUuYml0bWFwLmhlaWdodClcbiAgICAgICAgICAgICAgICBpZiBub3QgQG9iamVjdC5maXhlZFNpemVcbiAgICAgICAgICAgICAgICAgICAgQG9iamVjdC5kc3RSZWN0LndpZHRoID0gQG9iamVjdC5zcmNSZWN0LndpZHRoXG4gICAgICAgICAgICAgICAgICAgIEBvYmplY3QuZHN0UmVjdC5oZWlnaHQgPSBAb2JqZWN0LnNyY1JlY3QuaGVpZ2h0XG4gICAgICAgICAgICBlbHNlIGlmIEBvYmplY3QuaW1hZ2VIYW5kbGluZyA9PSAxXG4gICAgICAgICAgICAgICAgQG9iamVjdC5zcmNSZWN0ID0gbmV3IFJlY3QoMCwgMCwgQHNwcml0ZS5iaXRtYXAud2lkdGgsIEBzcHJpdGUuYml0bWFwLmhlaWdodCAvIDIpXG4gICAgICAgICAgICAgICAgaWYgbm90IEBvYmplY3QuZml4ZWRTaXplXG4gICAgICAgICAgICAgICAgICAgIEBvYmplY3QuZHN0UmVjdC53aWR0aCA9IEBvYmplY3Quc3JjUmVjdC53aWR0aFxuICAgICAgICAgICAgICAgICAgICBAb2JqZWN0LmRzdFJlY3QuaGVpZ2h0ID0gQG9iamVjdC5zcmNSZWN0LmhlaWdodFxuICAgICAgICAgICAgZWxzZSBpZiBAb2JqZWN0LmltYWdlSGFuZGxpbmcgPT0gMlxuICAgICAgICAgICAgICAgIGlmIG5vdCBAb2JqZWN0LmZpeGVkU2l6ZVxuICAgICAgICAgICAgICAgICAgICBAb2JqZWN0LmRzdFJlY3Qud2lkdGggPSBAb2JqZWN0LnNyY1JlY3Qud2lkdGhcbiAgICAgICAgICAgICAgICAgICAgQG9iamVjdC5kc3RSZWN0LmhlaWdodCA9IEBvYmplY3Quc3JjUmVjdC5oZWlnaHRcblxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIGJpdG1hcCBvYmplY3QgZnJvbSB0aGUgYXNzb2NpYXRlZCBpbWFnZSBuYW1lLiBUaGUgaW1hZ2VGb2xkZXJcbiAgICAqIHByb3BlcnR5IGNvbnRyb2xzIGZyb20gd2hpY2ggcmVzb3VyY2UtZm9sZGVyIHRoZSBpbWFnZSB3aWxsIGJlIGxvYWRlZC5cbiAgICAqIEBtZXRob2QgdXBkYXRlQml0bWFwXG4gICAgIyMjXG4gICAgdXBkYXRlQml0bWFwOiAtPlxuICAgICAgICBAaW1hZ2VMb2FkZWQgPSBub1xuICAgICAgICBAaW1hZ2UgPSBAb2JqZWN0LmltYWdlXG5cbiAgICAgICAgaWYgQG9iamVjdC5pbWFnZT8uc3RhcnRzV2l0aChcImRhdGE6XCIpIHx8IEBvYmplY3QuaW1hZ2U/LnN0YXJ0c1dpdGgoXCIkXCIpXG4gICAgICAgICAgICBAc3ByaXRlLmJpdG1hcCA9IFJlc291cmNlTWFuYWdlci5nZXRCaXRtYXAoQG9iamVjdC5pbWFnZSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQHNwcml0ZS5iaXRtYXAgPSBSZXNvdXJjZU1hbmFnZXIuZ2V0Qml0bWFwKFwiI3tAb2JqZWN0LmltYWdlRm9sZGVyfHxAaW1hZ2VGb2xkZXJ9LyN7QG9iamVjdC5pbWFnZX1cIilcblxuICAgICAgICBpZiBAc3ByaXRlLmJpdG1hcD9cbiAgICAgICAgICAgIGlmIG5vdCBAaW1hZ2VMb2FkZWRcbiAgICAgICAgICAgICAgICBAaW1hZ2VMb2FkZWQgPSBAc3ByaXRlLmJpdG1hcC5sb2FkZWRcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBkZWxldGUgQHNwcml0ZS5iaXRtYXAubG9hZGVkX1xuXG4gICAgICAgIEBvYmplY3QuYml0bWFwID0gQHNwcml0ZS5iaXRtYXBcblxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIHZpZGVvIG9iamVjdCBmcm9tIHRoZSBhc3NvY2lhdGVkIHZpZGVvIG5hbWUuIEl0IGFsc28gdXBkYXRlc1xuICAgICogdGhlIHZpZGVvLXJlbmRlcmluZyBwcm9jZXNzLlxuICAgICogQG1ldGhvZCB1cGRhdGVWaWRlb1xuICAgICMjI1xuICAgIHVwZGF0ZVZpZGVvOiAtPlxuICAgICAgICBpZiBAb2JqZWN0LnZpZGVvICE9IEB2aWRlb05hbWVcbiAgICAgICAgICAgIEB2aWRlb05hbWUgPSBAb2JqZWN0LnZpZGVvXG4gICAgICAgICAgICBAc3ByaXRlLnZpZGVvID0gUmVzb3VyY2VNYW5hZ2VyLmdldFZpZGVvKFwiI3tAb2JqZWN0LnZpZGVvRm9sZGVyID8gXCJNb3ZpZXNcIn0vI3tAb2JqZWN0LnZpZGVvfVwiKVxuICAgICAgICAgICAgaWYgQHNwcml0ZS52aWRlbz9cbiAgICAgICAgICAgICAgICBpZiAkUEFSQU1TLnByZXZpZXc/LnNldHRpbmdzLm11c2ljRGlzYWJsZWRcbiAgICAgICAgICAgICAgICAgICAgQHNwcml0ZS52aWRlby52b2x1bWUgPSAwXG4gICAgICAgICAgICAgICAgQHNwcml0ZS52aWRlby5sb29wID0gQG9iamVjdC5sb29wXG4gICAgICAgICAgICAgICAgQHNwcml0ZS52aWRlby5wbGF5KClcblxuICAgICAgICAgICAgICAgIEBvYmplY3Quc3JjUmVjdCA9IG5ldyBSZWN0KDAsIDAsIEBzcHJpdGUudmlkZW8ud2lkdGgsIEBzcHJpdGUudmlkZW8uaGVpZ2h0KVxuICAgICAgICAgICAgICAgIGlmIG5vdCBAb2JqZWN0LmZpeGVkU2l6ZVxuICAgICAgICAgICAgICAgICAgICBAb2JqZWN0LmRzdFJlY3QgPSBuZXcgUmVjdChAb2JqZWN0LmRzdFJlY3QueCwgQG9iamVjdC5kc3RSZWN0LnksIEBzcHJpdGUudmlkZW8ud2lkdGgsIEBzcHJpdGUudmlkZW8uaGVpZ2h0KVxuXG4gICAgICAgIEBzcHJpdGUudmlkZW8/LnVwZGF0ZSgpXG5cbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBpbWFnZSBpZiB0aGUgZ2FtZSBvYmplY3QgaGFzIHRoZSBpbWFnZS1wcm9wZXJ0eSBzZXQuXG4gICAgKiBAbWV0aG9kIHVwZGF0ZUltYWdlXG4gICAgIyMjXG4gICAgdXBkYXRlSW1hZ2U6IC0+XG4gICAgICAgIGlmIEBvYmplY3QuaW1hZ2U/XG4gICAgICAgICAgICBpZiBAb2JqZWN0LmltYWdlICE9IEBpbWFnZSBvciAoIUBpbWFnZUxvYWRlZCBhbmQgQHNwcml0ZS5iaXRtYXA/LmxvYWRlZClcbiAgICAgICAgICAgICAgICBAdXBkYXRlQml0bWFwKClcbiAgICAgICAgICAgICAgICBAdXBkYXRlUmVjdCgpXG4gICAgICAgIGVsc2UgaWYgQG9iamVjdC5iaXRtYXA/XG4gICAgICAgICAgICBAc3ByaXRlLmJpdG1hcCA9IEBvYmplY3QuYml0bWFwXG4gICAgICAgIGVsc2UgaWYgQG9iamVjdC52aWRlbz8gb3IgQHZpZGVvTmFtZSAhPSBAb2JqZWN0LnZpZGVvXG4gICAgICAgICAgICBAdXBkYXRlVmlkZW8oKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAaW1hZ2UgPSBudWxsXG4gICAgICAgICAgICBAb2JqZWN0LmJpdG1hcCA9IG51bGxcbiAgICAgICAgICAgIEBzcHJpdGUuYml0bWFwID0gbnVsbFxuXG4gICAgIyMjKlxuICAgICogSWYgdGhlIHNwcml0ZSBpcyB1bm1hbmFnZWQsIHRoaXMgbWV0aG9kIHdpbGwgdXBkYXRlIHRoZSB2aXNpYmlsaXR5IG9mIHRoZVxuICAgICogc3ByaXRlLiBJZiB0aGUgc3ByaXRlIGxlYXZlcyB0aGUgdmlld3BvcnQsIGl0IHdpbGwgYmUgcmVtb3ZlZCB0byBzYXZlXG4gICAgKiBwZXJmb3JtYW5jZSBhbmQgYXV0b21hdGljYWxseSBhZGRlZCBiYWNrIHRvIHRoZSB2aWV3cG9ydCBpZiBpdCBlbnRlcnNcbiAgICAqIHRoZSB2aWV3cG9ydC5cbiAgICAqIEBtZXRob2QgdXBkYXRlVmlzaWJpbGl0eVxuICAgICMjI1xuICAgIHVwZGF0ZVZpc2liaWxpdHk6IC0+XG4gICAgICAgIGlmICFAc3ByaXRlLm1hbmFnZWRcbiAgICAgICAgICAgIHZpc2libGUgPSBSZWN0LmludGVyc2VjdChAb2JqZWN0LmRzdFJlY3QueCtAb2JqZWN0Lm9yaWdpbi54LCBAb2JqZWN0LmRzdFJlY3QueStAb2JqZWN0Lm9yaWdpbi55LCBAb2JqZWN0LmRzdFJlY3Qud2lkdGgsIEBvYmplY3QuZHN0UmVjdC5oZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMCwgMCwgR3JhcGhpY3Mud2lkdGgsIEdyYXBoaWNzLmhlaWdodClcbiAgICAgICAgICAgIGlmIHZpc2libGUgYW5kICFAdmlzaWJsZVxuICAgICAgICAgICAgICAgIChAb2JqZWN0LnZpZXdwb3J0IHx8IEdyYXBoaWNzLnZpZXdwb3J0KS5hZGRHcmFwaGljT2JqZWN0KEBzcHJpdGUpXG4gICAgICAgICAgICAgICAgQHZpc2libGUgPSB5ZXNcblxuICAgICAgICAgICAgaWYgIXZpc2libGUgYW5kIEB2aXNpYmxlXG4gICAgICAgICAgICAgICAgKEBvYmplY3Qudmlld3BvcnQgfHwgR3JhcGhpY3Mudmlld3BvcnQpLnJlbW92ZUdyYXBoaWNPYmplY3QoQHNwcml0ZSlcbiAgICAgICAgICAgICAgICBAdmlzaWJsZSA9IG5vXG5cblxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIHBhZGRpbmcuXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVBhZGRpbmdcbiAgICAjIyNcbiAgICB1cGRhdGVQYWRkaW5nOiAtPlxuICAgICAgICBpZiBAb2JqZWN0LnBhZGRpbmc/XG4gICAgICAgICAgICBAc3ByaXRlLnggKz0gQG9iamVjdC5wYWRkaW5nLmxlZnRcbiAgICAgICAgICAgIEBzcHJpdGUueSArPSBAb2JqZWN0LnBhZGRpbmcudG9wXG4gICAgICAgICAgICBAc3ByaXRlLnpvb21YIC09IChAb2JqZWN0LnBhZGRpbmcubGVmdCtAb2JqZWN0LnBhZGRpbmcucmlnaHQpIC8gQG9iamVjdC5zcmNSZWN0LndpZHRoXG4gICAgICAgICAgICBAc3ByaXRlLnpvb21ZIC09IChAb2JqZWN0LnBhZGRpbmcuYm90dG9tK0BvYmplY3QucGFkZGluZy5ib3R0b20pIC8gQG9iamVjdC5zcmNSZWN0LmhlaWdodFxuXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgc3ByaXRlIHByb3BlcnRpZXMgZnJvbSB0aGUgZ2FtZSBvYmplY3QgcHJvcGVydGllcy5cbiAgICAqIEBtZXRob2QgdXBkYXRlUHJvcGVydGllc1xuICAgICMjI1xuICAgIHVwZGF0ZVByb3BlcnRpZXM6IC0+XG4gICAgICAgIEBzcHJpdGUud2lkdGggPSBAb2JqZWN0LmRzdFJlY3Qud2lkdGhcbiAgICAgICAgQHNwcml0ZS5oZWlnaHQgPSBAb2JqZWN0LmRzdFJlY3QuaGVpZ2h0XG4gICAgICAgIEBzcHJpdGUueCA9IEBvYmplY3QuZHN0UmVjdC54XG4gICAgICAgIEBzcHJpdGUueSA9IEBvYmplY3QuZHN0UmVjdC55XG4gICAgICAgIEBzcHJpdGUubWFzayA9IEBvYmplY3QubWFzayA/IEBtYXNrXG4gICAgICAgIEBzcHJpdGUuYW5nbGUgPSBAb2JqZWN0LmFuZ2xlIHx8IDBcbiAgICAgICAgQHNwcml0ZS5vcGFjaXR5ID0gQG9iamVjdC5vcGFjaXR5ID8gMjU1XG4gICAgICAgIEBzcHJpdGUuY2xpcFJlY3QgPSBAb2JqZWN0LmNsaXBSZWN0XG4gICAgICAgIEBzcHJpdGUuc3JjUmVjdCA9IEBvYmplY3Quc3JjUmVjdFxuICAgICAgICBAc3ByaXRlLmJsZW5kaW5nTW9kZSA9IEBvYmplY3QuYmxlbmRNb2RlIHx8IDBcbiAgICAgICAgQHNwcml0ZS5taXJyb3IgPSBAb2JqZWN0Lm1pcnJvclxuICAgICAgICBAc3ByaXRlLnZpc2libGUgPSBAb2JqZWN0LnZpc2libGUgYW5kICghQG9iamVjdC5wYXJlbnQgb3IgIUBvYmplY3QucGFyZW50LnZpc2libGU/IG9yIEBvYmplY3QucGFyZW50LnZpc2libGUpXG4gICAgICAgIEBzcHJpdGUub3ggPSAtQG9iamVjdC5vcmlnaW4ueFxuICAgICAgICBAc3ByaXRlLm95ID0gLUBvYmplY3Qub3JpZ2luLnlcbiAgICAgICAgQHNwcml0ZS56ID0gKEBvYmplY3QuekluZGV4IHx8IDApICsgKGlmICFAb2JqZWN0LnBhcmVudCB0aGVuIDAgZWxzZSBAb2JqZWN0LnBhcmVudC56SW5kZXggfHwgMClcblxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIG9wdGlvbmFsIHNwcml0ZSBwcm9wZXJ0aWVzIGZyb20gdGhlIGdhbWUgb2JqZWN0IHByb3BlcnRpZXMuXG4gICAgKiBAbWV0aG9kIHVwZGF0ZU9wdGlvbmFsUHJvcGVydGllc1xuICAgICMjI1xuICAgIHVwZGF0ZU9wdGlvbmFsUHJvcGVydGllczogLT5cbiAgICAgICAgaWYgQG9iamVjdC50b25lP1xuICAgICAgICAgICAgQHNwcml0ZS50b25lID0gQG9iamVjdC50b25lXG4gICAgICAgIGlmIEBvYmplY3QuY29sb3I/XG4gICAgICAgICAgICBAc3ByaXRlLmNvbG9yID0gQG9iamVjdC5jb2xvclxuICAgICAgICBpZiBAb2JqZWN0LnZpZXdwb3J0P1xuICAgICAgICAgICAgQHNwcml0ZS52aWV3cG9ydCA9IEBvYmplY3Qudmlld3BvcnRcbiAgICAgICAgaWYgQG9iamVjdC5lZmZlY3RzP1xuICAgICAgICAgICAgQHNwcml0ZS5lZmZlY3RzID0gQG9iamVjdC5lZmZlY3RzXG4gICAgICAgIGlmIEBvYmplY3QuYW5jaG9yP1xuICAgICAgICAgICAgQHNwcml0ZS5hbmNob3IueCA9IEBvYmplY3QuYW5jaG9yLnhcbiAgICAgICAgICAgIEBzcHJpdGUuYW5jaG9yLnkgPSBAb2JqZWN0LmFuY2hvci55XG4gICAgICAgIGlmIEBvYmplY3QucG9zaXRpb25BbmNob3I/XG4gICAgICAgICAgICBAc3ByaXRlLnBvc2l0aW9uQW5jaG9yID0gQG9iamVjdC5wb3NpdGlvbkFuY2hvclxuICAgICAgICBpZiBAb2JqZWN0Lnpvb20/XG4gICAgICAgICAgICBAc3ByaXRlLnpvb21YID0gQG9iamVjdC56b29tLnhcbiAgICAgICAgICAgIEBzcHJpdGUuem9vbVkgPSBAb2JqZWN0Lnpvb20ueVxuICAgICAgICBpZiBAb2JqZWN0Lm1vdGlvbkJsdXI/XG4gICAgICAgICAgICBAc3ByaXRlLm1vdGlvbkJsdXIgPSBAb2JqZWN0Lm1vdGlvbkJsdXJcblxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgdGhlIHNwcml0ZSBjb21wb25lbnQgYnkgdXBkYXRpbmcgaXRzIHZpc2liaWxpdHksIGltYWdlLCBwYWRkaW5nIGFuZFxuICAgICogcHJvcGVydGllcy5cbiAgICAqIEBtZXRob2QgdXBkYXRlXG4gICAgIyMjXG4gICAgdXBkYXRlOiAtPlxuICAgICAgICBzdXBlclxuXG4gICAgICAgIEBzZXR1cCgpIGlmIG5vdCBAaXNTZXR1cFxuICAgICAgICBAdXBkYXRlVmlzaWJpbGl0eSgpXG4gICAgICAgIEB1cGRhdGVJbWFnZSgpXG4gICAgICAgIEB1cGRhdGVQcm9wZXJ0aWVzKClcbiAgICAgICAgQHVwZGF0ZU9wdGlvbmFsUHJvcGVydGllcygpXG4gICAgICAgIEB1cGRhdGVQYWRkaW5nKClcblxuICAgICAgICBAb2JqZWN0LnJJbmRleCA9IEBzcHJpdGUuaW5kZXhcbiAgICAgICAgQHNwcml0ZS51cGRhdGUoKVxuXG5cbiMjIypcbiogRW51bWVyYXRpb24gb2YgYXBwZWFyYW5jZSBhbmltYXRpb25zLlxuKlxuKiBAbW9kdWxlIGdzXG4qIEBjbGFzcyBBbmltYXRpb25UeXBlc1xuKiBAc3RhdGljXG4qIEBtZW1iZXJvZiBnc1xuIyMjXG5jbGFzcyBBbmltYXRpb25UeXBlc1xuICAgIEBpbml0aWFsaXplOiAtPlxuICAgICAgICAjIyMqXG4gICAgICAgICogQW4gb2JqZWN0IGFwcGVhcnMgb3IgZGlzYXBwZWFycyBieSBtb3ZpbmcgaW50byBvciBvdXQgb2YgdGhlIHNjcmVlbi5cbiAgICAgICAgKiBAcHJvcGVydHkgTU9WRU1FTlRcbiAgICAgICAgKiBAdHlwZSBudW1iZXJcbiAgICAgICAgKiBAc3RhdGljXG4gICAgICAgICogQGZpbmFsXG4gICAgICAgICMjI1xuICAgICAgICBATU9WRU1FTlQgPSAwXG4gICAgICAgICMjIypcbiAgICAgICAgKiBBbiBvYmplY3QgYXBwZWFycyBvciBkaXNhcHBlYXJzIHVzaW5nIGFscGhhLWJsZW5kaW5nLlxuICAgICAgICAqIEBwcm9wZXJ0eSBCTEVORElOR1xuICAgICAgICAqIEB0eXBlIG51bWJlclxuICAgICAgICAqIEBzdGF0aWNcbiAgICAgICAgKiBAZmluYWxcbiAgICAgICAgIyMjXG4gICAgICAgIEBCTEVORElORyA9IDFcbiAgICAgICAgIyMjKlxuICAgICAgICAqIEFuIG9iamVjdCBhcHBlYXJzIG9yIGRpc2FwcGVhcnMgdXNpbmcgYSBtYXNrLWltYWdlLlxuICAgICAgICAqIEBwcm9wZXJ0eSBNQVNLSU5HXG4gICAgICAgICogQHR5cGUgbnVtYmVyXG4gICAgICAgICogQHN0YXRpY1xuICAgICAgICAqIEBmaW5hbFxuICAgICAgICAjIyNcbiAgICAgICAgQE1BU0tJTkcgPSAyXG5cbkFuaW1hdGlvblR5cGVzLmluaXRpYWxpemUoKVxuZ3MuQW5pbWF0aW9uVHlwZXMgPSBBbmltYXRpb25UeXBlc1xuZ3MuQ29tcG9uZW50X1Nwcml0ZSA9IENvbXBvbmVudF9TcHJpdGVcbiJdfQ==
//# sourceURL=Component_Sprite_61.js