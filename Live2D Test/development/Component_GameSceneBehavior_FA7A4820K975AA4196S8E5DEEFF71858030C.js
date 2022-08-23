var Component_GameSceneBehavior,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Component_GameSceneBehavior = (function(superClass) {
  extend(Component_GameSceneBehavior, superClass);


  /**
  * Defines the behavior of visual novel game scene.
  *
  * @module vn
  * @class Component_GameSceneBehavior
  * @extends gs.Component_LayoutSceneBehavior
  * @memberof vn
   */

  function Component_GameSceneBehavior() {
    Component_GameSceneBehavior.__super__.constructor.call(this);
    this.onAutoCommonEventStart = (function(_this) {
      return function() {
        _this.object.removeComponent(_this.object.interpreter);
        return _this.object.interpreter.stop();
      };
    })(this);
    this.onAutoCommonEventFinish = (function(_this) {
      return function() {
        if (!_this.object.components.contains(_this.object.interpreter)) {
          _this.object.addComponent(_this.object.interpreter);
        }
        return _this.object.interpreter.resume();
      };
    })(this);
    this.resourceContext = null;
    this.objectDomain = "";
  }


  /**
  * Initializes the scene.
  *
  * @method initialize
   */

  Component_GameSceneBehavior.prototype.initialize = function() {
    var ref, saveGame, sceneUid, sprite;
    if (SceneManager.previousScenes.length === 0) {
      gs.GlobalEventManager.clearExcept(this.object.commonEventContainer.subObjects);
    }
    this.resourceContext = ResourceManager.createContext();
    ResourceManager.context = this.resourceContext;
    Graphics.freeze();
    saveGame = GameManager.loadedSaveGame;
    sceneUid = null;
    if (saveGame) {
      sceneUid = saveGame.sceneUid;
      this.object.sceneData = saveGame.data;
    } else {
      sceneUid = ((ref = $PARAMS.preview) != null ? ref.scene.uid : void 0) || this.object.sceneData.uid || RecordManager.system.startInfo.scene.uid;
    }
    this.object.sceneDocument = DataManager.getDocument(sceneUid);
    if (this.object.sceneDocument && this.object.sceneDocument.items.type === "vn.scene") {
      this.object.chapter = DataManager.getDocument(this.object.sceneDocument.items.chapterUid);
      this.object.currentCharacter = {
        "name": ""
      };
      if (!GameManager.initialized) {
        GameManager.initialize();
      }
      GameManager.preloadCommonEvents();
      LanguageManager.loadBundles();
    } else {
      sprite = new gs.Sprite();
      sprite.bitmap = new gs.Bitmap(Graphics.width, 50);
      sprite.bitmap.drawText(0, 0, Graphics.width, 50, "No Start Scene selected", 1, 0);
      sprite.srcRect = new gs.Rect(0, 0, Graphics.width, 50);
      sprite.y = (Graphics.height - 50) / 2;
      sprite.z = 10000;
    }
    return this.setupScreen();
  };


  /**
  * Disposes the scene.
  *
  * @method dispose
   */

  Component_GameSceneBehavior.prototype.dispose = function() {
    var event, j, len, ref, ref1;
    ResourceManager.context = this.resourceContext;
    this.object.removeObject(this.object.commonEventContainer);
    this.show(false);
    if ((ref = this.object.viewport) != null) {
      ref.dispose();
    }
    ref1 = GameManager.commonEvents;
    for (j = 0, len = ref1.length; j < len; j++) {
      event = ref1[j];
      if (event) {
        event.events.offByOwner("start", this.object);
        event.events.offByOwner("finish", this.object);
      }
    }
    if (this.object.video) {
      this.object.video.dispose();
      this.object.video.onEnded();
    }
    return Component_GameSceneBehavior.__super__.dispose.call(this);
  };

  Component_GameSceneBehavior.prototype.changePictureDomain = function(domain) {
    this.object.pictureContainer.behavior.changeDomain(domain);
    return this.object.pictures = this.object.pictureContainer.subObjects;
  };

  Component_GameSceneBehavior.prototype.changeTextDomain = function(domain) {
    this.object.textContainer.behavior.changeDomain(domain);
    return this.object.texts = this.object.textContainer.subObjects;
  };

  Component_GameSceneBehavior.prototype.changeVideoDomain = function(domain) {
    this.object.videoContainer.behavior.changeDomain(domain);
    return this.object.videos = this.object.videoContainer.subObjects;
  };

  Component_GameSceneBehavior.prototype.changeHotspotDomain = function(domain) {
    this.object.hotspotContainer.behavior.changeDomain(domain);
    return this.object.hotspots = this.object.hotspotContainer.subObjects;
  };

  Component_GameSceneBehavior.prototype.changeMessageAreaDomain = function(domain) {
    this.object.messageAreaContainer.behavior.changeDomain(domain);
    return this.object.messageAreas = this.object.messageAreaContainer.subObjects;
  };


  /**
  * Shows/Hides the current scene. A hidden scene is no longer shown and executed
  * but all objects and data is still there and be shown again anytime.
  *
  * @method show
  * @param {boolean} visible - Indicates if the scene should be shown or hidden.
   */

  Component_GameSceneBehavior.prototype.show = function(visible) {
    var ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8;
    if (visible) {
      GameManager.sceneViewport = this.object.viewport;
      GameManager.sceneViewport.tone = this.screenTone || GameManager.sceneViewport.tone;
      GameManager.sceneViewport.zoom = this.screenZoom || GameManager.sceneViewport.zoom;
      GameManager.sceneViewport.angle = this.screenAngle || GameManager.sceneViewport.angle;
      GameManager.sceneViewport.anchor = this.screenAnchor || GameManager.sceneViewport.anchor;
      if ((ref = SceneManager.scene.viewport) != null) {
        ref.visual.scroll = this.screenScroll || SceneManager.scene.viewport.visual.scroll;
      }
      GameManager.sceneViewport.update();
    } else {
      if (GameManager.sceneViewport) {
        this.screenTone = Object.copy(GameManager.sceneViewport.tone);
        this.screenZoom = Object.copy(GameManager.sceneViewport.zoom);
        this.screenAngle = Object.copy(GameManager.sceneViewport.angle);
        this.screenAnchor = Object.copy(GameManager.sceneViewport.anchor);
      }
      if (SceneManager.scene.viewport) {
        this.screenScroll = Object.copy(SceneManager.scene.viewport.visual.scroll);
      }
    }
    window.$dataFields = this.dataFields;
    this.object.visible = visible;
    if ((ref1 = this.object.layout) != null) {
      ref1.update();
    }
    this.object.pictureContainer.behavior.setVisible(visible);
    this.object.hotspotContainer.behavior.setVisible(visible);
    this.object.textContainer.behavior.setVisible(visible);
    this.object.videoContainer.behavior.setVisible(visible);
    this.object.messageAreaContainer.behavior.setVisible(visible);
    this.object.viewportContainer.behavior.setVisible(visible);
    this.object.characterContainer.behavior.setVisible(visible);
    this.object.backgroundContainer.behavior.setVisible(visible);
    if ((ref2 = this.viewport) != null) {
      ref2.visible = visible;
    }
    if ((ref3 = this.object.choiceWindow) != null) {
      ref3.visible = visible;
    }
    if ((ref4 = this.object.inputNumberBox) != null) {
      ref4.visible = visible;
    }
    if ((ref5 = this.object.inputTextBox) != null) {
      ref5.visible = visible;
    }
    if ((ref6 = this.object.inputTextBox) != null) {
      ref6.update();
    }
    if ((ref7 = this.object.inputNumberBox) != null) {
      ref7.update();
    }
    if ((ref8 = this.object.choiceWindow) != null) {
      ref8.update();
    }
    GameManager.tempSettings.skip = false;
    return this.setupCommonEvents();
  };


  /**
  * Sets up common event handling.
  *
  * @method setupCommonEvents
   */

  Component_GameSceneBehavior.prototype.setupCommonEvents = function() {
    var commonEvents, event, i, j, k, len, len1, ref, ref1, ref2, ref3;
    commonEvents = (ref = this.object.sceneData) != null ? ref.commonEvents : void 0;
    if (commonEvents) {
      for (i = j = 0, len = commonEvents.length; j < len; i = ++j) {
        event = commonEvents[i];
        if (event && !this.object.commonEventContainer.subObjects.first(function(e) {
          return (e != null ? e.rid : void 0) === event.rid;
        })) {
          this.object.commonEventContainer.setObject(event, i);
          event.behavior.setupEventHandlers();
          if ((ref1 = event.interpreter) != null ? ref1.isRunning : void 0) {
            event.events.emit("start", event);
          }
        }
      }
    } else {
      ref2 = GameManager.commonEvents;
      for (i = k = 0, len1 = ref2.length; k < len1; i = ++k) {
        event = ref2[i];
        if (event && (event.record.startCondition === 1 || event.record.parallel) && !this.object.commonEventContainer.subObjects.first(function(e) {
          return (e != null ? e.rid : void 0) === event.rid;
        })) {
          this.object.commonEventContainer.setObject(event, i);
          event.events.offByOwner("start", this.object);
          event.events.offByOwner("finish", this.object);
          if (!event.record.parallel) {
            event.events.on("start", gs.CallBack("onAutoCommonEventStart", this), null, this.object);
            event.events.on("finish", gs.CallBack("onAutoCommonEventFinish", this), null, this.object);
          }
          if ((ref3 = event.interpreter) != null ? ref3.isRunning : void 0) {
            event.events.emit("start", event);
          }
        }
      }
    }
    return null;
  };


  /**
  * Sets up main interpreter.
  *
  * @method setupInterpreter
  * @protected
   */

  Component_GameSceneBehavior.prototype.setupInterpreter = function() {
    this.object.commands = this.object.sceneDocument.items.commands;
    if (this.object.sceneData.interpreter) {
      this.object.removeComponent(this.object.interpreter);
      this.object.interpreter = this.object.sceneData.interpreter;
      this.object.addComponent(this.object.interpreter);
      this.object.interpreter.context.set(this.object.sceneDocument.uid, this.object);
      return this.object.interpreter.object = this.object;
    } else {
      this.object.interpreter.setup();
      this.object.interpreter.context.set(this.object.sceneDocument.uid, this.object);
      return this.object.interpreter.start();
    }
  };


  /**
  * Sets up characters and restores them from loaded save game if necessary.
  *
  * @method setupCharacters
  * @protected
   */

  Component_GameSceneBehavior.prototype.setupCharacters = function() {
    var c, i, j, len, ref;
    if (this.object.sceneData.characters != null) {
      ref = this.object.sceneData.characters;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        c = ref[i];
        this.object.characterContainer.setObject(c, i);
      }
    }
    return this.object.currentCharacter = this.object.sceneData.currentCharacter || {
      name: ""
    };
  };


  /**
  * Sets up viewports and restores them from loaded save game if necessary.
  *
  * @method setupViewports
  * @protected
   */

  Component_GameSceneBehavior.prototype.setupViewports = function() {
    var i, j, len, ref, ref1, results, viewport, viewports;
    viewports = (ref = (ref1 = this.object.sceneData) != null ? ref1.viewports : void 0) != null ? ref : [];
    results = [];
    for (i = j = 0, len = viewports.length; j < len; i = ++j) {
      viewport = viewports[i];
      if (viewport) {
        results.push(this.object.viewportContainer.setObject(viewport, i));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };


  /**
  * Sets up backgrounds and restores them from loaded save game if necessary.
  *
  * @method setupBackgrounds
  * @protected
   */

  Component_GameSceneBehavior.prototype.setupBackgrounds = function() {
    var b, backgrounds, i, j, len, ref, ref1, results;
    backgrounds = (ref = (ref1 = this.object.sceneData) != null ? ref1.backgrounds : void 0) != null ? ref : [];
    results = [];
    for (i = j = 0, len = backgrounds.length; j < len; i = ++j) {
      b = backgrounds[i];
      results.push(this.object.backgroundContainer.setObject(b, i));
    }
    return results;
  };


  /**
  * Sets up pictures and restores them from loaded save game if necessary.
  *
  * @method setupPictures
  * @protected
   */

  Component_GameSceneBehavior.prototype.setupPictures = function() {
    var domain, i, path, picture, pictures, ref, ref1, results;
    pictures = (ref = (ref1 = this.object.sceneData) != null ? ref1.pictures : void 0) != null ? ref : {};
    results = [];
    for (domain in pictures) {
      this.object.pictureContainer.behavior.changeDomain(domain);
      if (pictures[domain]) {
        results.push((function() {
          var j, len, ref2, ref3, results1;
          ref2 = pictures[domain];
          results1 = [];
          for (i = j = 0, len = ref2.length; j < len; i = ++j) {
            picture = ref2[i];
            this.object.pictureContainer.setObject(picture, i);
            if (picture != null ? picture.image : void 0) {
              path = ((ref3 = picture.imageFolder) != null ? ref3 : "Graphics/Pictures") + "/" + picture.image;
              results1.push(this.resourceContext.add(path, ResourceManager.resourcesByPath[path]));
            } else {
              results1.push(void 0);
            }
          }
          return results1;
        }).call(this));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };


  /**
  * Sets up texts and restores them from loaded save game if necessary.
  *
  * @method setupTexts
  * @protected
   */

  Component_GameSceneBehavior.prototype.setupTexts = function() {
    var domain, i, ref, ref1, results, text, texts;
    texts = (ref = (ref1 = this.object.sceneData) != null ? ref1.texts : void 0) != null ? ref : {};
    results = [];
    for (domain in texts) {
      this.object.textContainer.behavior.changeDomain(domain);
      if (texts[domain]) {
        results.push((function() {
          var j, len, ref2, results1;
          ref2 = texts[domain];
          results1 = [];
          for (i = j = 0, len = ref2.length; j < len; i = ++j) {
            text = ref2[i];
            results1.push(this.object.textContainer.setObject(text, i));
          }
          return results1;
        }).call(this));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };


  /**
  * Sets up videos and restores them from loaded save game if necessary.
  *
  * @method setupVideos
  * @protected
   */

  Component_GameSceneBehavior.prototype.setupVideos = function() {
    var domain, i, path, ref, ref1, results, video, videos;
    videos = (ref = (ref1 = this.object.sceneData) != null ? ref1.videos : void 0) != null ? ref : {};
    results = [];
    for (domain in videos) {
      this.object.videoContainer.behavior.changeDomain(domain);
      if (videos[domain]) {
        results.push((function() {
          var j, len, ref2, ref3, results1;
          ref2 = videos[domain];
          results1 = [];
          for (i = j = 0, len = ref2.length; j < len; i = ++j) {
            video = ref2[i];
            if (video) {
              path = ((ref3 = video.videoFolder) != null ? ref3 : "Movies") + "/" + video.video;
              this.resourceContext.add(path, ResourceManager.resourcesByPath[path]);
              video.visible = true;
              video.update();
            }
            results1.push(this.object.videoContainer.setObject(video, i));
          }
          return results1;
        }).call(this));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };


  /**
  * Sets up hotspots and restores them from loaded save game if necessary.
  *
  * @method setupHotspots
  * @protected
   */

  Component_GameSceneBehavior.prototype.setupHotspots = function() {
    var domain, hotspot, hotspots, i, ref, ref1, results;
    hotspots = (ref = (ref1 = this.object.sceneData) != null ? ref1.hotspots : void 0) != null ? ref : {};
    results = [];
    for (domain in hotspots) {
      this.object.hotspotContainer.behavior.changeDomain(domain);
      if (hotspots[domain]) {
        results.push((function() {
          var j, len, ref2, results1;
          ref2 = hotspots[domain];
          results1 = [];
          for (i = j = 0, len = ref2.length; j < len; i = ++j) {
            hotspot = ref2[i];
            results1.push(this.object.hotspotContainer.setObject(hotspot, i));
          }
          return results1;
        }).call(this));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };


  /**
  * Sets up layout.
  *
  * @method setupLayout
  * @protected
   */

  Component_GameSceneBehavior.prototype.setupLayout = function() {
    var advVisible, ref, ref1;
    this.dataFields = ui.UIManager.dataSources[ui.UiFactory.layouts.gameLayout.dataSource || "default"]();
    this.dataFields.scene = this.object;
    window.$dataFields = this.dataFields;
    advVisible = this.object.messageMode === vn.MessageMode.ADV;
    this.object.layout = ui.UiFactory.createFromDescriptor(ui.UiFactory.layouts.gameLayout, this.object);
    this.object.layout.visible = advVisible;
    $gameMessage_message.visible = advVisible;
    this.object.layout.ui.prepare();
    this.object.choices = ((ref = this.object.sceneData) != null ? ref.choices : void 0) || this.object.choices;
    if (((ref1 = this.object.choices) != null ? ref1.length : void 0) > 0) {
      this.showChoices(gs.CallBack("onChoiceAccept", this.object.choices[0].interpreter || this.object.interpreter, {
        pointer: this.object.interpreter.pointer,
        params: this.params
      }));
    }
    if (this.object.interpreter.waitingFor.inputNumber) {
      this.showInputNumber(GameManager.tempFields.digits, gs.CallBack("onInputNumberFinish", this.object.interpreter, this.object.interpreter));
    }
    if (this.object.interpreter.waitingFor.inputText) {
      return this.showInputText(GameManager.tempFields.letters, gs.CallBack("onInputTextFinish", this.object.interpreter, this.object.interpreter));
    }
  };


  /**
  * Sets up the main viewport / screen viewport.
  *
  * @method setupMainViewport
  * @protected
   */

  Component_GameSceneBehavior.prototype.setupMainViewport = function() {
    if (!this.object.sceneData.viewport) {
      if (SceneManager.previousScenes.length === 0) {
        GameManager.sceneViewport.dispose();
      }
      GameManager.sceneViewport = new gs.Object_Viewport(new Viewport(0, 0, Graphics.width, Graphics.height, Graphics.viewport));
      this.viewport = GameManager.sceneViewport.visual.viewport;
      return this.object.viewport = GameManager.sceneViewport;
    } else {
      GameManager.sceneViewport.dispose();
      GameManager.sceneViewport = this.object.sceneData.viewport;
      this.object.viewport = this.object.sceneData.viewport;
      this.viewport = this.object.viewport.visual.viewport;
      return this.viewport.viewport = Graphics.viewport;
    }
  };


  /**
  * Sets up screen.
  *
  * @method setupScreen
  * @protected
   */

  Component_GameSceneBehavior.prototype.setupScreen = function() {
    if (this.object.sceneData.screen) {
      return this.object.viewport.restore(this.object.sceneData.screen);
    }
  };


  /**
  * Restores main interpreter from loaded save game.
  *
  * @method restoreInterpreter
  * @protected
   */

  Component_GameSceneBehavior.prototype.restoreInterpreter = function() {
    if (this.object.sceneData.interpreter) {
      return this.object.interpreter.restore();
    }
  };


  /**
  * Restores message box from loaded save game.
  *
  * @method restoreMessageBox
  * @protected
   */

  Component_GameSceneBehavior.prototype.restoreMessageBox = function() {
    var c, j, k, len, len1, message, messageBox, messageBoxes, messageObject, ref, ref1, results;
    messageBoxes = (ref = this.object.sceneData) != null ? ref.messageBoxes : void 0;
    if (messageBoxes) {
      results = [];
      for (j = 0, len = messageBoxes.length; j < len; j++) {
        messageBox = messageBoxes[j];
        messageObject = gs.ObjectManager.current.objectById(messageBox.id);
        messageObject.visible = messageBox.visible;
        if (messageBox.message) {
          messageBox.message.textRenderer.disposeEventHandlers();
          message = gs.ObjectManager.current.objectById(messageBox.message.id);
          message.textRenderer.dispose();
          Object.mixin(message, messageBox.message, ui.Object_Message.objectCodecBlackList.concat(["origin"]));
          ref1 = message.components;
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            c = ref1[k];
            c.object = message;
          }
          results.push(message.textRenderer.setupEventHandlers());
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };


  /**
  * Restores message from loaded save game.
  *
  * @method restoreMessages
  * @protected
   */

  Component_GameSceneBehavior.prototype.restoreMessages = function() {
    var area, c, domain, i, message, messageArea, messageAreas, messageLayout, ref, results;
    if ((ref = this.object.sceneData) != null ? ref.messageAreas : void 0) {
      results = [];
      for (domain in this.object.sceneData.messageAreas) {
        this.object.messageAreaContainer.behavior.changeDomain(domain);
        messageAreas = this.object.sceneData.messageAreas;
        if (messageAreas[domain]) {
          results.push((function() {
            var j, k, len, len1, ref1, ref2, results1;
            ref1 = messageAreas[domain];
            results1 = [];
            for (i = j = 0, len = ref1.length; j < len; i = ++j) {
              area = ref1[i];
              if (area) {
                messageArea = new gs.Object_MessageArea();
                messageLayout = ui.UIManager.createControlFromDescriptor({
                  type: "ui.CustomGameMessage",
                  id: "customGameMessage_" + i,
                  params: {
                    id: "customGameMessage_" + i
                  }
                }, messageArea);
                message = gs.ObjectManager.current.objectById("customGameMessage_" + i + "_message");
                area.message.textRenderer.disposeEventHandlers();
                message.textRenderer.dispose();
                Object.mixin(message, area.message);
                ref2 = message.components;
                for (k = 0, len1 = ref2.length; k < len1; k++) {
                  c = ref2[k];
                  c.object = message;
                }
                messageLayout.dstRect.x = area.layout.dstRect.x;
                messageLayout.dstRect.y = area.layout.dstRect.y;
                messageLayout.dstRect.width = area.layout.dstRect.width;
                messageLayout.dstRect.height = area.layout.dstRect.height;
                messageLayout.needsUpdate = true;
                message.textRenderer.setupEventHandlers();
                messageLayout.update();
                messageArea.message = message;
                messageArea.layout = messageLayout;
                messageArea.addObject(messageLayout);
                results1.push(this.object.messageAreaContainer.setObject(messageArea, i));
              } else {
                results1.push(void 0);
              }
            }
            return results1;
          }).call(this));
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };


  /**
  * Restores audio-playback from loaded save game.
  *
  * @method restoreAudioPlayback
  * @protected
   */

  Component_GameSceneBehavior.prototype.restoreAudioPlayback = function() {
    var b, j, len, ref;
    if (this.object.sceneData.audio) {
      ref = this.object.sceneData.audio.audioBuffers;
      for (j = 0, len = ref.length; j < len; j++) {
        b = ref[j];
        AudioManager.audioBuffers.push(b);
      }
      AudioManager.audioBuffersByLayer = this.object.sceneData.audio.audioBuffersByLayer;
      AudioManager.audioLayers = this.object.sceneData.audio.audioLayers;
      return AudioManager.soundReferences = this.object.sceneData.audio.soundReferences;
    }
  };


  /**
  * Restores the scene objects from the current loaded save-game. If no save-game is
  * present in GameManager.loadedSaveGame, nothing will happen.
  *
  * @method restoreScene
  * @protected
   */

  Component_GameSceneBehavior.prototype.restoreScene = function() {
    var c, context, j, len, ref, ref1, saveGame;
    saveGame = GameManager.loadedSaveGame;
    if (saveGame) {
      context = new gs.ObjectCodecContext([Graphics.viewport, this.object, this], saveGame.encodedObjectStore, null);
      saveGame.data = gs.ObjectCodec.decode(saveGame.data, context);
      ref = saveGame.data.characterNames;
      for (j = 0, len = ref.length; j < len; j++) {
        c = ref[j];
        if (c) {
          if ((ref1 = RecordManager.characters[c.index]) != null) {
            ref1.name = c.name;
          }
        }
      }
      GameManager.restore(saveGame);
      gs.ObjectCodec.onRestore(saveGame.data, context);
      this.resourceContext.fromDataBundle(saveGame.data.resourceContext, ResourceManager.resourcesByPath);
      this.object.sceneData = saveGame.data;
      return Graphics.frameCount = saveGame.data.frameCount;
    }
  };


  /**
  * Prepares all data for the scene and loads the necessary graphic and audio resources.
  *
  * @method prepareData
  * @abstract
   */

  Component_GameSceneBehavior.prototype.prepareData = function() {
    GameManager.scene = this.object;
    gs.ObjectManager.current = this.objectManager;
    this.object.sceneData.uid = this.object.sceneDocument.uid;
    if (!ResourceLoader.loadEventCommandsData(this.object.sceneDocument.items.commands)) {
      ResourceLoader.loadEventCommandsGraphics(this.object.sceneDocument.items.commands);
      GameManager.backlog = this.object.sceneData.backlog || GameManager.sceneData.backlog || [];
      ResourceLoader.loadSystemSounds();
      ResourceLoader.loadSystemGraphics();
      ResourceLoader.loadUiTypesGraphics(ui.UiFactory.customTypes);
      ResourceLoader.loadUiLayoutGraphics(ui.UiFactory.layouts.gameLayout);
      if (this.dataFields != null) {
        ResourceLoader.loadUiDataFieldsGraphics(this.dataFields);
      }
      $tempFields.choiceTimer = this.object.choiceTimer;
      return GameManager.variableStore.setup({
        id: this.object.sceneDocument.uid
      });
    }
  };


  /**
  * Prepares all visual game object for the scene.
  *
  * @method prepareVisual
   */

  Component_GameSceneBehavior.prototype.prepareVisual = function() {
    var ref;
    if (this.object.layout) {
      this.transition({
        duration: 0
      });
      return;
    }
    if (GameManager.tempFields.isExitingGame) {
      GameManager.tempFields.isExitingGame = false;
      gs.GameNotifier.postResetSceneChange(this.object.sceneDocument.items.name);
    } else {
      gs.GameNotifier.postSceneChange(this.object.sceneDocument.items.name);
    }
    this.restoreScene();
    this.object.messageMode = (ref = this.object.sceneData.messageMode) != null ? ref : vn.MessageMode.ADV;
    this.setupMainViewport();
    this.setupViewports();
    this.setupCharacters();
    this.setupBackgrounds();
    this.setupPictures();
    this.setupTexts();
    this.setupVideos();
    this.setupHotspots();
    this.setupInterpreter();
    this.setupLayout();
    this.setupCommonEvents();
    this.restoreMessageBox();
    this.restoreInterpreter();
    this.restoreMessages();
    this.restoreAudioPlayback();
    this.show(true);
    this.object.sceneData = {};
    GameManager.sceneData = {};
    Graphics.update();
    return this.transition({
      duration: 0
    });
  };


  /**
  * Adds a new character to the scene.
  *
  * @method addCharacter
  * @param {vn.Object_Character} character - The character to add.
  * @param {boolean} noAnimation - Indicates if the character should be added immediately witout any appear-animation.
  * @param {Object} animationData - Contains the appear-animation data -> { animation, easing, duration }.
   */

  Component_GameSceneBehavior.prototype.addCharacter = function(character, noAnimation, animationData) {
    if (!noAnimation) {
      character.motionBlur.set(animationData.motionBlur);
      if (animationData.duration > 0) {
        if (!noAnimation) {
          character.animator.appear(character.dstRect.x, character.dstRect.y, animationData.animation, animationData.easing, animationData.duration);
        }
      }
    }
    character.viewport = this.viewport;
    character.visible = true;
    return this.object.characterContainer.addObject(character);
  };


  /**
  * Removes a character from the scene.
  *
  * @method removeCharacter
  * @param {vn.Object_Character} character - The character to remove.
  * @param {boolean} noAnimation - Indicates if the character should be disposed immediately witout any disapear-animation.
  * @param {Object} animationData - Contains the disappear-animation data -> { animation, easing, duration }.
   */

  Component_GameSceneBehavior.prototype.removeCharacter = function(character, noAnimation, animationData) {
    if (!noAnimation) {
      return character != null ? character.animator.disappear(animationData.animation, animationData.easing, animationData.duration, function(sender) {
        return sender.dispose();
      }) : void 0;
    } else {
      return character != null ? character.dispose() : void 0;
    }
  };


  /**
  * Resumes the current scene if it has been paused.
  *
  * @method resumeScene
   */

  Component_GameSceneBehavior.prototype.resumeScene = function() {
    var message;
    this.object.pictureContainer.active = true;
    this.object.characterContainer.active = true;
    this.object.backgroundContainer.active = true;
    this.object.textContainer.active = true;
    this.object.hotspotContainer.active = true;
    this.object.videoContainer.active = true;
    message = gs.ObjectManager.current.objectById("gameMessage_message");
    return message.active = true;
  };


  /**
  * Pauses the current scene. A paused scene will not continue, messages, pictures, etc. will
  * stop until the scene resumes.
  *
  * @method pauseScene
   */

  Component_GameSceneBehavior.prototype.pauseScene = function() {
    var message;
    this.object.pictureContainer.active = false;
    this.object.characterContainer.active = false;
    this.object.backgroundContainer.active = false;
    this.object.textContainer.active = false;
    this.object.hotspotContainer.active = false;
    this.object.videoContainer.active = false;
    message = gs.ObjectManager.current.objectById("gameMessage_message");
    return message.active = false;
  };


  /**
  * Changes the visibility of the entire game UI like the message boxes, etc. to allows
  * the player to see the entire scene. Useful for CGs, etc.
  *
  * @param {boolean} visible - If <b>true</b>, the game UI will be visible. Otherwise it will be hidden.
  * @method changeUIVisibility
   */

  Component_GameSceneBehavior.prototype.changeUIVisibility = function(visible) {
    this.uiVisible = visible;
    return this.object.layout.visible = visible;
  };


  /**
  * Shows input-text box to let the user enter a text.
  *
  * @param {number} letters - The max. number of letters the user can enter.
  * @param {gs.Callback} callback - A callback function called if the input-text box has been accepted by the user.
  * @method showInputText
   */

  Component_GameSceneBehavior.prototype.showInputText = function(letters, callback) {
    var ref;
    if ((ref = this.object.inputTextBox) != null) {
      ref.dispose();
    }
    this.object.inputTextBox = ui.UiFactory.createControlFromDescriptor(ui.UiFactory.customTypes["ui.InputTextBox"], this.object.layout);
    this.object.inputTextBox.ui.prepare();
    return this.object.inputTextBox.events.on("accept", callback);
  };


  /**
  * Shows input-number box to let the user enter a number.
  *
  * @param {number} digits - The max. number of digits the user can enter.
  * @param {gs.Callback} callback - A callback function called if the input-number box has been accepted by the user.
  * @method showInputNumber
   */

  Component_GameSceneBehavior.prototype.showInputNumber = function(digits, callback) {
    var ref;
    if ((ref = this.object.inputNumberBox) != null) {
      ref.dispose();
    }
    this.object.inputNumberBox = ui.UiFactory.createControlFromDescriptor(ui.UiFactory.customTypes["ui.InputNumberBox"], this.object.layout);
    this.object.inputNumberBox.ui.prepare();
    return this.object.inputNumberBox.events.on("accept", callback);
  };


  /**
  * Shows choices to let the user pick a choice.
  *
  * @param {Object[]} choices - An array of choices
  * @param {gs.Callback} callback - A callback function called if a choice has been picked by the user.
  * @method showChoices
   */

  Component_GameSceneBehavior.prototype.showChoices = function(callback) {
    var ref, useFreeLayout;
    useFreeLayout = this.object.choices.where(function(x) {
      return x.dstRect != null;
    }).length > 0;
    if ((ref = this.object.choiceWindow) != null) {
      ref.dispose();
    }
    if (useFreeLayout) {
      this.object.choiceWindow = ui.UiFactory.createControlFromDescriptor(ui.UiFactory.customTypes["ui.FreeChoiceBox"], this.object.layout);
    } else {
      this.object.choiceWindow = ui.UiFactory.createControlFromDescriptor(ui.UiFactory.customTypes["ui.ChoiceBox"], this.object.layout);
    }
    this.object.choiceWindow.events.on("selectionAccept", callback);
    return this.object.choiceWindow.ui.prepare();
  };

  Component_GameSceneBehavior.prototype.showChoiceTimer = function(seconds, minutes) {
    this.object.choiceTimer.behavior.minutes = minutes;
    this.object.choiceTimer.behavior.seconds = seconds;
    this.object.choiceTimer.events.on("finish", (function(_this) {
      return function() {
        var choice;
        GameManager.tempFields.choiceTimerVisible = false;
        choice = _this.object.choices.first(function(c) {
          return c.isDefault;
        }) || _this.object.choices[0];
        if (choice != null) {
          return _this.object.choiceWindow.events.emit("selectionAccept", _this.object.choiceWindow, choice);
        }
      };
    })(this));
    this.object.choiceTimer.behavior.start();
    return GameManager.tempFields.choiceTimerVisible = true;
  };


  /**
  * Changes the background of the scene.
  *
  * @method changeBackground
  * @param {Object} background - The background graphic object -> { name }
  * @param {boolean} noAnimation - Indicates if the background should be changed immediately witout any change-animation.
  * @param {Object} animation - The appear/disappear animation to use.
  * @param {Object} easing - The easing of the change animation.
  * @param {number} duration - The duration of the change in frames.
  * @param {number} ox - The x-origin of the background.
  * @param {number} oy - The y-origin of the background.
  * @param {number} layer - The background-layer to change.
  * @param {boolean} loopHorizontal - Indicates if the background should be looped horizontally.
  * @param {boolean} loopVertical - Indicates if the background should be looped vertically.
   */

  Component_GameSceneBehavior.prototype.changeBackground = function(background, noAnimation, animation, easing, duration, ox, oy, layer, loopHorizontal, loopVertical) {
    var object, otherObject, ref, ref1;
    if (background != null) {
      otherObject = this.object.backgrounds[layer];
      object = new vn.Object_Background();
      object.image = background.name;
      object.imageFolder = background.folderPath;
      object.origin.x = ox;
      object.origin.y = oy;
      object.viewport = this.viewport;
      object.visual.looping.vertical = false;
      object.visual.looping.horizontal = false;
      object.update();
      this.object.backgroundContainer.setObject(object, layer);
      duration = duration != null ? duration : 30;
      if (otherObject != null) {
        otherObject.zIndex = layer;
      }
      if (otherObject != null) {
        if ((ref = otherObject.animator.otherObject) != null) {
          ref.dispose();
        }
      }
      if (duration === 0) {
        if (otherObject != null) {
          otherObject.dispose();
        }
        object.visual.looping.vertical = loopVertical;
        return object.visual.looping.horizontal = loopHorizontal;
      } else {
        if (noAnimation) {
          object.visual.looping.vertical = loopVertical;
          return object.visual.looping.horizontal = loopHorizontal;
        } else {
          object.animator.otherObject = otherObject;
          return object.animator.appear(0, 0, animation, easing, duration, (function(_this) {
            return function(sender) {
              var ref1;
              sender.update();
              if ((ref1 = sender.animator.otherObject) != null) {
                ref1.dispose();
              }
              sender.animator.otherObject = null;
              sender.visual.looping.vertical = loopVertical;
              return sender.visual.looping.horizontal = loopHorizontal;
            };
          })(this));
        }
      }
    } else {
      return (ref1 = this.object.backgrounds[layer]) != null ? ref1.animator.hide(duration, easing, (function(_this) {
        return function() {
          _this.object.backgrounds[layer].dispose();
          return _this.object.backgrounds[layer] = null;
        };
      })(this)) : void 0;
    }
  };


  /**
  * Skips all viewport animations except the main viewport animation.
  *
  * @method skipViewports
  * @protected
   */

  Component_GameSceneBehavior.prototype.skipViewports = function() {
    var component, j, k, len, len1, ref, viewport, viewports;
    viewports = this.object.viewportContainer.subObjects;
    for (j = 0, len = viewports.length; j < len; j++) {
      viewport = viewports[j];
      if (viewport) {
        ref = viewport.components;
        for (k = 0, len1 = ref.length; k < len1; k++) {
          component = ref[k];
          if (typeof component.skip === "function") {
            component.skip();
          }
        }
      }
    }
    return null;
  };


  /**
  * Skips all picture animations.
  *
  * @method skipPictures
  * @protected
   */

  Component_GameSceneBehavior.prototype.skipPictures = function() {
    var component, j, k, len, len1, picture, ref, ref1;
    ref = this.object.pictures;
    for (j = 0, len = ref.length; j < len; j++) {
      picture = ref[j];
      if (picture) {
        ref1 = picture.components;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          component = ref1[k];
          if (typeof component.skip === "function") {
            component.skip();
          }
        }
      }
    }
    return null;
  };


  /**
  * Skips all text animations.
  *
  * @method skipTexts
  * @protected
   */

  Component_GameSceneBehavior.prototype.skipTexts = function() {
    var component, j, k, len, len1, ref, ref1, text;
    ref = this.object.texts;
    for (j = 0, len = ref.length; j < len; j++) {
      text = ref[j];
      if (text) {
        ref1 = text.components;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          component = ref1[k];
          if (typeof component.skip === "function") {
            component.skip();
          }
        }
      }
    }
    return null;
  };


  /**
  * Skips all video animations but not the video-playback itself.
  *
  * @method skipVideos
  * @protected
   */

  Component_GameSceneBehavior.prototype.skipVideos = function() {
    var component, j, k, len, len1, ref, ref1, video;
    ref = this.object.videos;
    for (j = 0, len = ref.length; j < len; j++) {
      video = ref[j];
      if (video) {
        ref1 = video.components;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          component = ref1[k];
          if (typeof component.skip === "function") {
            component.skip();
          }
        }
      }
    }
    return null;
  };


  /**
  * Skips all background animations.
  *
  * @method skipBackgrounds
  * @protected
   */

  Component_GameSceneBehavior.prototype.skipBackgrounds = function() {
    var background, component, j, k, len, len1, ref, ref1;
    ref = this.object.backgrounds;
    for (j = 0, len = ref.length; j < len; j++) {
      background = ref[j];
      if (background) {
        ref1 = background.components;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          component = ref1[k];
          if (typeof component.skip === "function") {
            component.skip();
          }
        }
      }
    }
    return null;
  };


  /**
  * Skips all character animations
  *
  * @method skipCharacters
  * @protected
   */

  Component_GameSceneBehavior.prototype.skipCharacters = function() {
    var character, component, j, k, len, len1, ref, ref1;
    ref = this.object.characters;
    for (j = 0, len = ref.length; j < len; j++) {
      character = ref[j];
      if (character) {
        ref1 = character.components;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          component = ref1[k];
          if (typeof component.skip === "function") {
            component.skip();
          }
        }
      }
    }
    return null;
  };


  /**
  * Skips the main viewport animation.
  *
  * @method skipMainViewport
  * @protected
   */

  Component_GameSceneBehavior.prototype.skipMainViewport = function() {
    var component, j, len, ref;
    ref = this.object.viewport.components;
    for (j = 0, len = ref.length; j < len; j++) {
      component = ref[j];
      if (typeof component.skip === "function") {
        component.skip();
      }
    }
    return null;
  };


  /**
  * Skips all animations of all message boxes defined in MESSAGE_BOX_IDS ui constant.
  *
  * @method skipMessageBoxes
  * @protected
   */

  Component_GameSceneBehavior.prototype.skipMessageBoxes = function() {
    var component, j, k, len, len1, messageBox, messageBoxId, ref, ref1;
    ref = gs.UIConstants.MESSAGE_BOX_IDS || ["messageBox", "nvlMessageBox"];
    for (j = 0, len = ref.length; j < len; j++) {
      messageBoxId = ref[j];
      messageBox = gs.ObjectManager.current.objectById(messageBoxId);
      if (messageBox.components) {
        ref1 = messageBox.components;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          component = ref1[k];
          if (typeof component.skip === "function") {
            component.skip();
          }
        }
      }
    }
    return null;
  };


  /**
  * Skips all animations of all message areas.
  *
  * @method skipMessageAreas
  * @protected
   */

  Component_GameSceneBehavior.prototype.skipMessageAreas = function() {
    var component, j, k, l, len, len1, len2, len3, m, messageArea, msg, ref, ref1, ref2, ref3;
    ref = this.object.messageAreas;
    for (j = 0, len = ref.length; j < len; j++) {
      messageArea = ref[j];
      if (messageArea != null ? messageArea.message : void 0) {
        ref1 = messageArea.message.components;
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          component = ref1[k];
          if (typeof component.skip === "function") {
            component.skip();
          }
        }
      }
    }
    msg = gs.ObjectManager.current.objectById("gameMessage_message");
    if (msg) {
      ref2 = msg.components;
      for (l = 0, len2 = ref2.length; l < len2; l++) {
        component = ref2[l];
        if (typeof component.skip === "function") {
          component.skip();
        }
      }
    }
    msg = gs.ObjectManager.current.objectById("nvlGameMessage_message");
    if (msg) {
      ref3 = msg.components;
      for (m = 0, len3 = ref3.length; m < len3; m++) {
        component = ref3[m];
        if (typeof component.skip === "function") {
          component.skip();
        }
      }
    }
    return null;
  };


  /**
  * Skips the scene interpreter timer.
  *
  * @method skipInterpreter
  * @protected
   */

  Component_GameSceneBehavior.prototype.skipInterpreter = function() {
    if (this.object.interpreter.waitCounter > GameManager.tempSettings.skipTime) {
      this.object.interpreter.waitCounter = GameManager.tempSettings.skipTime;
      if (this.object.interpreter.waitCounter === 0) {
        return this.object.interpreter.isWaiting = false;
      }
    }
  };


  /**
  * Skips the interpreter timer of all common events.
  *
  * @method skipCommonEvents
  * @protected
   */

  Component_GameSceneBehavior.prototype.skipCommonEvents = function() {
    var event, events, j, len, results;
    events = this.object.commonEventContainer.subObjects;
    results = [];
    for (j = 0, len = events.length; j < len; j++) {
      event = events[j];
      if ((event != null ? event.interpreter : void 0) && event.interpreter.waitCounter > GameManager.tempSettings.skipTime) {
        event.interpreter.waitCounter = GameManager.tempSettings.skipTime;
        if (event.interpreter.waitCounter === 0) {
          results.push(event.interpreter.isWaiting = false);
        } else {
          results.push(void 0);
        }
      } else {
        results.push(void 0);
      }
    }
    return results;
  };


  /**
  * Skips the scene's content.
  *
  * @method skipContent
  * @protected
   */

  Component_GameSceneBehavior.prototype.skipContent = function() {
    this.skipPictures();
    this.skipTexts();
    this.skipVideos();
    this.skipBackgrounds();
    this.skipCharacters();
    this.skipMainViewport();
    this.skipViewports();
    this.skipMessageBoxes();
    this.skipMessageAreas();
    this.skipInterpreter();
    return this.skipCommonEvents();
  };


  /**
  * Checks for the shortcut to hide/show the game UI. By default, this is the space-key. You
  * can override this method to change the shortcut.
  *
  * @method updateUIVisibilityShortcut
  * @protected
   */

  Component_GameSceneBehavior.prototype.updateUIVisibilityShortcut = function() {
    if (!this.uiVisible && (Input.trigger(Input.C) || Input.Mouse.buttonDown)) {
      this.changeUIVisibility(!this.uiVisible);
    }
    if (Input.trigger(Input.KEY_SPACE)) {
      return this.changeUIVisibility(!this.uiVisible);
    }
  };


  /**
  * Checks for the shortcut to exit the game. By default, this is the escape-key. You
  * can override this method to change the shortcut.
  *
  * @method updateQuitShortcut
  * @protected
   */

  Component_GameSceneBehavior.prototype.updateQuitShortcut = function() {
    if (Input.trigger(Input.KEY_ESCAPE)) {
      return gs.Application.exit();
    }
  };


  /**
  * Checks for the shortcut to open the settings menu. By default, this is the s-key. You
  * can override this method to change the shortcut.
  *
  * @method updateSettingsShortcut
  * @protected
   */

  Component_GameSceneBehavior.prototype.updateSettingsShortcut = function() {
    if (GameManager.tempSettings.menuAccess && Input.trigger(Input.X)) {
      return SceneManager.switchTo(new gs.Object_Layout("settingsMenuLayout"), true);
    }
  };


  /**
  * Checks for the shortcut to open the settings menu. By default, this is the control-key. You
  * can override this method to change the shortcut.
  *
  * @method updateSkipShortcut
  * @protected
   */

  Component_GameSceneBehavior.prototype.updateSkipShortcut = function() {
    if (this.object.settings.allowSkip) {
      if (Input.keys[Input.KEY_CONTROL] === 1) {
        return GameManager.tempSettings.skip = true;
      } else if (Input.keys[Input.KEY_CONTROL] === 2) {
        return GameManager.tempSettings.skip = false;
      }
    }
  };


  /**
  * Checks for default keyboard shortcuts e.g space-key to hide the UI, etc.
  *
  * @method updateShortcuts
  * @protected
   */

  Component_GameSceneBehavior.prototype.updateShortcuts = function() {
    if (!this.object.canReceiveInput()) {
      return;
    }
    this.updateSettingsShortcut();
    this.updateQuitShortcut();
    this.updateUIVisibilityShortcut();
    return this.updateSkipShortcut();
  };


  /**
  * Updates the full screen video played via Play Movie command.
  *
  * @method updateVideo
   */

  Component_GameSceneBehavior.prototype.updateVideo = function() {
    if (this.object.video != null) {
      this.object.video.update();
      if (this.object.settings.allowVideoSkip && (Input.trigger(Input.C) || Input.Mouse.buttons[Input.Mouse.LEFT] === 2)) {
        this.object.video.stop();
      }
      return Input.clear();
    }
  };


  /**
  * Updates skipping if enabled.
  *
  * @method updateSkipping
   */

  Component_GameSceneBehavior.prototype.updateSkipping = function() {
    if (!this.object.settings.allowSkip) {
      this.object.tempSettings.skip = false;
    }
    if (GameManager.tempSettings.skip) {
      return this.skipContent();
    }
  };


  /**
  * Updates the scene's content.
  *
  * @method updateContent
   */

  Component_GameSceneBehavior.prototype.updateContent = function() {
    GameManager.scene = this.object;
    Graphics.viewport.update();
    this.object.viewport.update();
    this.updateSkipping();
    this.updateVideo();
    this.updateShortcuts();
    return Component_GameSceneBehavior.__super__.updateContent.call(this);
  };

  return Component_GameSceneBehavior;

})(gs.Component_LayoutSceneBehavior);

vn.Component_GameSceneBehavior = Component_GameSceneBehavior;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsMkJBQUE7RUFBQTs7O0FBQU07Ozs7QUFFRjs7Ozs7Ozs7O0VBUWEscUNBQUE7SUFDVCwyREFBQTtJQUVBLElBQUMsQ0FBQSxzQkFBRCxHQUEwQixDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUE7UUFDdEIsS0FBQyxDQUFBLE1BQU0sQ0FBQyxlQUFSLENBQXdCLEtBQUMsQ0FBQSxNQUFNLENBQUMsV0FBaEM7ZUFDQSxLQUFDLENBQUEsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFwQixDQUFBO01BRnNCO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtJQUcxQixJQUFDLENBQUEsdUJBQUQsR0FBMkIsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFBO1FBQ3ZCLElBQUcsQ0FBQyxLQUFDLENBQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFuQixDQUE0QixLQUFDLENBQUEsTUFBTSxDQUFDLFdBQXBDLENBQUo7VUFDSSxLQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBcUIsS0FBQyxDQUFBLE1BQU0sQ0FBQyxXQUE3QixFQURKOztlQUVBLEtBQUMsQ0FBQSxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQXBCLENBQUE7TUFIdUI7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBO0lBSzNCLElBQUMsQ0FBQSxlQUFELEdBQW1CO0lBQ25CLElBQUMsQ0FBQSxZQUFELEdBQWdCO0VBWlA7OztBQWNiOzs7Ozs7d0NBS0EsVUFBQSxHQUFZLFNBQUE7QUFDUixRQUFBO0lBQUEsSUFBRyxZQUFZLENBQUMsY0FBYyxDQUFDLE1BQTVCLEtBQXNDLENBQXpDO01BQ0ksRUFBRSxDQUFDLGtCQUFrQixDQUFDLFdBQXRCLENBQWtDLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQW9CLENBQUMsVUFBL0QsRUFESjs7SUFHQSxJQUFDLENBQUEsZUFBRCxHQUFtQixlQUFlLENBQUMsYUFBaEIsQ0FBQTtJQUNuQixlQUFlLENBQUMsT0FBaEIsR0FBMEIsSUFBQyxDQUFBO0lBRTNCLFFBQVEsQ0FBQyxNQUFULENBQUE7SUFDQSxRQUFBLEdBQVcsV0FBVyxDQUFDO0lBQ3ZCLFFBQUEsR0FBVztJQUVYLElBQUcsUUFBSDtNQUNJLFFBQUEsR0FBVyxRQUFRLENBQUM7TUFDcEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLEdBQW9CLFFBQVEsQ0FBQyxLQUZqQztLQUFBLE1BQUE7TUFJSSxRQUFBLHlDQUEwQixDQUFFLEtBQUssQ0FBQyxhQUF2QixJQUE4QixJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFoRCxJQUF1RCxhQUFhLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFKM0c7O0lBTUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxhQUFSLEdBQXdCLFdBQVcsQ0FBQyxXQUFaLENBQXdCLFFBQXhCO0lBRXhCLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxhQUFSLElBQTBCLElBQUMsQ0FBQSxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUE1QixLQUFvQyxVQUFqRTtNQUNJLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixHQUFrQixXQUFXLENBQUMsV0FBWixDQUF3QixJQUFDLENBQUEsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsVUFBcEQ7TUFDbEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQkFBUixHQUEyQjtRQUFFLE1BQUEsRUFBUSxFQUFWOztNQUUzQixJQUFHLENBQUksV0FBVyxDQUFDLFdBQW5CO1FBQ0ksV0FBVyxDQUFDLFVBQVosQ0FBQSxFQURKOztNQUVBLFdBQVcsQ0FBQyxtQkFBWixDQUFBO01BRUEsZUFBZSxDQUFDLFdBQWhCLENBQUEsRUFSSjtLQUFBLE1BQUE7TUFVSSxNQUFBLEdBQWEsSUFBQSxFQUFFLENBQUMsTUFBSCxDQUFBO01BQ2IsTUFBTSxDQUFDLE1BQVAsR0FBb0IsSUFBQSxFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVEsQ0FBQyxLQUFuQixFQUEwQixFQUExQjtNQUNwQixNQUFNLENBQUMsTUFBTSxDQUFDLFFBQWQsQ0FBdUIsQ0FBdkIsRUFBMEIsQ0FBMUIsRUFBNkIsUUFBUSxDQUFDLEtBQXRDLEVBQTZDLEVBQTdDLEVBQWlELHlCQUFqRCxFQUE0RSxDQUE1RSxFQUErRSxDQUEvRTtNQUNBLE1BQU0sQ0FBQyxPQUFQLEdBQXFCLElBQUEsRUFBRSxDQUFDLElBQUgsQ0FBUSxDQUFSLEVBQVcsQ0FBWCxFQUFjLFFBQVEsQ0FBQyxLQUF2QixFQUE4QixFQUE5QjtNQUNyQixNQUFNLENBQUMsQ0FBUCxHQUFXLENBQUMsUUFBUSxDQUFDLE1BQVQsR0FBa0IsRUFBbkIsQ0FBQSxHQUF5QjtNQUNwQyxNQUFNLENBQUMsQ0FBUCxHQUFXLE1BZmY7O1dBaUJBLElBQUMsQ0FBQSxXQUFELENBQUE7RUFwQ1E7OztBQXNDWjs7Ozs7O3dDQUtBLE9BQUEsR0FBUyxTQUFBO0FBQ0wsUUFBQTtJQUFBLGVBQWUsQ0FBQyxPQUFoQixHQUEwQixJQUFDLENBQUE7SUFDM0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxZQUFSLENBQXFCLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQTdCO0lBQ0EsSUFBQyxDQUFBLElBQUQsQ0FBTSxLQUFOOztTQUNnQixDQUFFLE9BQWxCLENBQUE7O0FBRUE7QUFBQSxTQUFBLHNDQUFBOztNQUNJLElBQUcsS0FBSDtRQUNJLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBYixDQUF3QixPQUF4QixFQUFpQyxJQUFDLENBQUEsTUFBbEM7UUFDQSxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQWIsQ0FBd0IsUUFBeEIsRUFBa0MsSUFBQyxDQUFBLE1BQW5DLEVBRko7O0FBREo7SUFLQSxJQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBWDtNQUNJLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQWQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQWQsQ0FBQSxFQUZKOztXQUlBLHVEQUFBO0VBZks7O3dDQWlCVCxtQkFBQSxHQUFxQixTQUFDLE1BQUQ7SUFDakIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsWUFBbEMsQ0FBK0MsTUFBL0M7V0FDQSxJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVIsR0FBbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztFQUYzQjs7d0NBR3JCLGdCQUFBLEdBQWtCLFNBQUMsTUFBRDtJQUNkLElBQUMsQ0FBQSxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxZQUEvQixDQUE0QyxNQUE1QztXQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBUixHQUFnQixJQUFDLENBQUEsTUFBTSxDQUFDLGFBQWEsQ0FBQztFQUZ4Qjs7d0NBR2xCLGlCQUFBLEdBQW1CLFNBQUMsTUFBRDtJQUNmLElBQUMsQ0FBQSxNQUFNLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxZQUFoQyxDQUE2QyxNQUE3QztXQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixJQUFDLENBQUEsTUFBTSxDQUFDLGNBQWMsQ0FBQztFQUZ6Qjs7d0NBR25CLG1CQUFBLEdBQXFCLFNBQUMsTUFBRDtJQUNqQixJQUFDLENBQUEsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxZQUFsQyxDQUErQyxNQUEvQztXQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixHQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLGdCQUFnQixDQUFDO0VBRjNCOzt3Q0FHckIsdUJBQUEsR0FBeUIsU0FBQyxNQUFEO0lBQ3JCLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLFlBQXRDLENBQW1ELE1BQW5EO1dBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxZQUFSLEdBQXVCLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQW9CLENBQUM7RUFGL0I7OztBQUl6Qjs7Ozs7Ozs7d0NBT0EsSUFBQSxHQUFNLFNBQUMsT0FBRDtBQUNGLFFBQUE7SUFBQSxJQUFHLE9BQUg7TUFDSSxXQUFXLENBQUMsYUFBWixHQUE0QixJQUFDLENBQUEsTUFBTSxDQUFDO01BQ3BDLFdBQVcsQ0FBQyxhQUFhLENBQUMsSUFBMUIsR0FBaUMsSUFBQyxDQUFBLFVBQUQsSUFBZSxXQUFXLENBQUMsYUFBYSxDQUFDO01BQzFFLFdBQVcsQ0FBQyxhQUFhLENBQUMsSUFBMUIsR0FBaUMsSUFBQyxDQUFBLFVBQUQsSUFBZSxXQUFXLENBQUMsYUFBYSxDQUFDO01BQzFFLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBMUIsR0FBa0MsSUFBQyxDQUFBLFdBQUQsSUFBZ0IsV0FBVyxDQUFDLGFBQWEsQ0FBQztNQUM1RSxXQUFXLENBQUMsYUFBYSxDQUFDLE1BQTFCLEdBQW1DLElBQUMsQ0FBQSxZQUFELElBQWlCLFdBQVcsQ0FBQyxhQUFhLENBQUM7O1dBQ25ELENBQUUsTUFBTSxDQUFDLE1BQXBDLEdBQTZDLElBQUMsQ0FBQSxZQUFELElBQWlCLFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzs7TUFDakcsV0FBVyxDQUFDLGFBQWEsQ0FBQyxNQUExQixDQUFBLEVBUEo7S0FBQSxNQUFBO01BU0ksSUFBRyxXQUFXLENBQUMsYUFBZjtRQUNJLElBQUMsQ0FBQSxVQUFELEdBQWMsTUFBTSxDQUFDLElBQVAsQ0FBWSxXQUFXLENBQUMsYUFBYSxDQUFDLElBQXRDO1FBQ2QsSUFBQyxDQUFBLFVBQUQsR0FBYyxNQUFNLENBQUMsSUFBUCxDQUFZLFdBQVcsQ0FBQyxhQUFhLENBQUMsSUFBdEM7UUFDZCxJQUFDLENBQUEsV0FBRCxHQUFlLE1BQU0sQ0FBQyxJQUFQLENBQVksV0FBVyxDQUFDLGFBQWEsQ0FBQyxLQUF0QztRQUNmLElBQUMsQ0FBQSxZQUFELEdBQWdCLE1BQU0sQ0FBQyxJQUFQLENBQVksV0FBVyxDQUFDLGFBQWEsQ0FBQyxNQUF0QyxFQUpwQjs7TUFLQSxJQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBdEI7UUFDSSxJQUFDLENBQUEsWUFBRCxHQUFnQixNQUFNLENBQUMsSUFBUCxDQUFZLFlBQVksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUEvQyxFQURwQjtPQWRKOztJQWlCQSxNQUFNLENBQUMsV0FBUCxHQUFxQixJQUFDLENBQUE7SUFDdEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFSLEdBQWtCOztVQUVKLENBQUUsTUFBaEIsQ0FBQTs7SUFFQSxJQUFDLENBQUEsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxVQUFsQyxDQUE2QyxPQUE3QztJQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLFVBQWxDLENBQTZDLE9BQTdDO0lBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFVBQS9CLENBQTBDLE9BQTFDO0lBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLFVBQWhDLENBQTJDLE9BQTNDO0lBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsVUFBdEMsQ0FBaUQsT0FBakQ7SUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxVQUFuQyxDQUE4QyxPQUE5QztJQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUFDLFVBQXBDLENBQStDLE9BQS9DO0lBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsVUFBckMsQ0FBZ0QsT0FBaEQ7O1VBRVMsQ0FBRSxPQUFYLEdBQXFCOzs7VUFDRCxDQUFFLE9BQXRCLEdBQWdDOzs7VUFDVixDQUFFLE9BQXhCLEdBQWtDOzs7VUFDZCxDQUFFLE9BQXRCLEdBQWdDOzs7VUFDWixDQUFFLE1BQXRCLENBQUE7OztVQUNzQixDQUFFLE1BQXhCLENBQUE7OztVQUNvQixDQUFFLE1BQXRCLENBQUE7O0lBRUEsV0FBVyxDQUFDLFlBQVksQ0FBQyxJQUF6QixHQUFnQztXQUdoQyxJQUFDLENBQUEsaUJBQUQsQ0FBQTtFQTNDRTs7O0FBNkNOOzs7Ozs7d0NBS0EsaUJBQUEsR0FBbUIsU0FBQTtBQUNmLFFBQUE7SUFBQSxZQUFBLDhDQUFnQyxDQUFFO0lBRWxDLElBQUcsWUFBSDtBQUNJLFdBQUEsc0RBQUE7O1FBQ0ksSUFBRyxLQUFBLElBQVUsQ0FBQyxJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxLQUF4QyxDQUE4QyxTQUFDLENBQUQ7OEJBQU8sQ0FBQyxDQUFFLGFBQUgsS0FBVSxLQUFLLENBQUM7UUFBdkIsQ0FBOUMsQ0FBZDtVQUNJLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQW9CLENBQUMsU0FBN0IsQ0FBdUMsS0FBdkMsRUFBOEMsQ0FBOUM7VUFDQSxLQUFLLENBQUMsUUFBUSxDQUFDLGtCQUFmLENBQUE7VUFFQSw2Q0FBb0IsQ0FBRSxrQkFBdEI7WUFDSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQWIsQ0FBa0IsT0FBbEIsRUFBMkIsS0FBM0IsRUFESjtXQUpKOztBQURKLE9BREo7S0FBQSxNQUFBO0FBU0k7QUFBQSxXQUFBLGdEQUFBOztRQUNJLElBQUcsS0FBQSxJQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxjQUFiLEtBQStCLENBQS9CLElBQW9DLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBbEQsQ0FBVixJQUEwRSxDQUFDLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLEtBQXhDLENBQThDLFNBQUMsQ0FBRDs4QkFBTyxDQUFDLENBQUUsYUFBSCxLQUFVLEtBQUssQ0FBQztRQUF2QixDQUE5QyxDQUE5RTtVQUNJLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQW9CLENBQUMsU0FBN0IsQ0FBdUMsS0FBdkMsRUFBOEMsQ0FBOUM7VUFFQSxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQWIsQ0FBd0IsT0FBeEIsRUFBaUMsSUFBQyxDQUFBLE1BQWxDO1VBQ0EsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFiLENBQXdCLFFBQXhCLEVBQWtDLElBQUMsQ0FBQSxNQUFuQztVQUVBLElBQUcsQ0FBSSxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQXBCO1lBQ0ksS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFiLENBQWdCLE9BQWhCLEVBQXlCLEVBQUUsQ0FBQyxRQUFILENBQVksd0JBQVosRUFBc0MsSUFBdEMsQ0FBekIsRUFBc0UsSUFBdEUsRUFBNEUsSUFBQyxDQUFBLE1BQTdFO1lBQ0EsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFiLENBQWdCLFFBQWhCLEVBQTBCLEVBQUUsQ0FBQyxRQUFILENBQVkseUJBQVosRUFBdUMsSUFBdkMsQ0FBMUIsRUFBd0UsSUFBeEUsRUFBOEUsSUFBQyxDQUFBLE1BQS9FLEVBRko7O1VBSUEsNkNBQW9CLENBQUUsa0JBQXRCO1lBQ0ksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFiLENBQWtCLE9BQWxCLEVBQTJCLEtBQTNCLEVBREo7V0FWSjs7QUFESixPQVRKOztBQXVCQSxXQUFPO0VBMUJROzs7QUE0Qm5COzs7Ozs7O3dDQU1BLGdCQUFBLEdBQWtCLFNBQUE7SUFDZCxJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVIsR0FBbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO0lBRS9DLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBckI7TUFDSSxJQUFDLENBQUEsTUFBTSxDQUFDLGVBQVIsQ0FBd0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFoQztNQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBUixHQUFzQixJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQztNQUN4QyxJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBcUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUE3QjtNQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUE1QixDQUFnQyxJQUFDLENBQUEsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUF0RCxFQUEyRCxJQUFDLENBQUEsTUFBNUQ7YUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFwQixHQUE2QixJQUFDLENBQUEsT0FObEM7S0FBQSxNQUFBO01BUUksSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBcEIsQ0FBQTtNQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUE1QixDQUFnQyxJQUFDLENBQUEsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUF0RCxFQUEyRCxJQUFDLENBQUEsTUFBNUQ7YUFDQSxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFwQixDQUFBLEVBVko7O0VBSGM7OztBQWdCbEI7Ozs7Ozs7d0NBTUEsZUFBQSxHQUFpQixTQUFBO0FBQ2IsUUFBQTtJQUFBLElBQUcsd0NBQUg7QUFDSTtBQUFBLFdBQUEsNkNBQUE7O1FBQ0ksSUFBQyxDQUFBLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxTQUEzQixDQUFxQyxDQUFyQyxFQUF3QyxDQUF4QztBQURKLE9BREo7O1dBSUEsSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQkFBUixHQUEyQixJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBbEIsSUFBc0M7TUFBRSxJQUFBLEVBQU0sRUFBUjs7RUFMcEQ7OztBQVFqQjs7Ozs7Ozt3Q0FNQSxjQUFBLEdBQWdCLFNBQUE7QUFDWixRQUFBO0lBQUEsU0FBQSw0RkFBMkM7QUFDM0M7U0FBQSxtREFBQTs7TUFDSSxJQUFHLFFBQUg7cUJBQ0ksSUFBQyxDQUFBLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxTQUExQixDQUFvQyxRQUFwQyxFQUE4QyxDQUE5QyxHQURKO09BQUEsTUFBQTs2QkFBQTs7QUFESjs7RUFGWTs7O0FBS2hCOzs7Ozs7O3dDQU1BLGdCQUFBLEdBQWtCLFNBQUE7QUFDZCxRQUFBO0lBQUEsV0FBQSw4RkFBK0M7QUFDL0M7U0FBQSxxREFBQTs7bUJBQ0ksSUFBQyxDQUFBLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxTQUE1QixDQUFzQyxDQUF0QyxFQUF5QyxDQUF6QztBQURKOztFQUZjOzs7QUFLbEI7Ozs7Ozs7d0NBTUEsYUFBQSxHQUFlLFNBQUE7QUFDWCxRQUFBO0lBQUEsUUFBQSwyRkFBeUM7QUFDekM7U0FBQSxrQkFBQTtNQUNJLElBQUMsQ0FBQSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLFlBQWxDLENBQStDLE1BQS9DO01BQ0EsSUFBRyxRQUFTLENBQUEsTUFBQSxDQUFaOzs7QUFBeUI7QUFBQTtlQUFBLDhDQUFBOztZQUNyQixJQUFDLENBQUEsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQXpCLENBQW1DLE9BQW5DLEVBQTRDLENBQTVDO1lBQ0Esc0JBQUcsT0FBTyxDQUFFLGNBQVo7Y0FDSSxJQUFBLEdBQVMsK0NBQXVCLG1CQUF2QixDQUFBLEdBQTJDLEdBQTNDLEdBQThDLE9BQU8sQ0FBQzs0QkFDL0QsSUFBQyxDQUFBLGVBQWUsQ0FBQyxHQUFqQixDQUFxQixJQUFyQixFQUEyQixlQUFlLENBQUMsZUFBZ0IsQ0FBQSxJQUFBLENBQTNELEdBRko7YUFBQSxNQUFBO29DQUFBOztBQUZxQjs7dUJBQXpCO09BQUEsTUFBQTs2QkFBQTs7QUFGSjs7RUFGVzs7O0FBVWY7Ozs7Ozs7d0NBTUEsVUFBQSxHQUFZLFNBQUE7QUFDUixRQUFBO0lBQUEsS0FBQSx3RkFBbUM7QUFDbkM7U0FBQSxlQUFBO01BQ0ksSUFBQyxDQUFBLE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFlBQS9CLENBQTRDLE1BQTVDO01BQ0EsSUFBRyxLQUFNLENBQUEsTUFBQSxDQUFUOzs7QUFBc0I7QUFBQTtlQUFBLDhDQUFBOzswQkFDbEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxhQUFhLENBQUMsU0FBdEIsQ0FBZ0MsSUFBaEMsRUFBc0MsQ0FBdEM7QUFEa0I7O3VCQUF0QjtPQUFBLE1BQUE7NkJBQUE7O0FBRko7O0VBRlE7OztBQU9aOzs7Ozs7O3dDQU1BLFdBQUEsR0FBYSxTQUFBO0FBQ1QsUUFBQTtJQUFBLE1BQUEseUZBQXFDO0FBQ3JDO1NBQUEsZ0JBQUE7TUFDSSxJQUFDLENBQUEsTUFBTSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsWUFBaEMsQ0FBNkMsTUFBN0M7TUFDQSxJQUFHLE1BQU8sQ0FBQSxNQUFBLENBQVY7OztBQUF1QjtBQUFBO2VBQUEsOENBQUE7O1lBQ25CLElBQUcsS0FBSDtjQUNJLElBQUEsR0FBUyw2Q0FBcUIsUUFBckIsQ0FBQSxHQUE4QixHQUE5QixHQUFpQyxLQUFLLENBQUM7Y0FDaEQsSUFBQyxDQUFBLGVBQWUsQ0FBQyxHQUFqQixDQUFxQixJQUFyQixFQUEyQixlQUFlLENBQUMsZUFBZ0IsQ0FBQSxJQUFBLENBQTNEO2NBQ0EsS0FBSyxDQUFDLE9BQU4sR0FBZ0I7Y0FDaEIsS0FBSyxDQUFDLE1BQU4sQ0FBQSxFQUpKOzswQkFNQSxJQUFDLENBQUEsTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUF2QixDQUFpQyxLQUFqQyxFQUF3QyxDQUF4QztBQVBtQjs7dUJBQXZCO09BQUEsTUFBQTs2QkFBQTs7QUFGSjs7RUFGUzs7O0FBYWI7Ozs7Ozs7d0NBTUEsYUFBQSxHQUFlLFNBQUE7QUFDWCxRQUFBO0lBQUEsUUFBQSwyRkFBeUM7QUFDekM7U0FBQSxrQkFBQTtNQUNJLElBQUMsQ0FBQSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLFlBQWxDLENBQStDLE1BQS9DO01BQ0EsSUFBRyxRQUFTLENBQUEsTUFBQSxDQUFaOzs7QUFBeUI7QUFBQTtlQUFBLDhDQUFBOzswQkFDckIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUF6QixDQUFtQyxPQUFuQyxFQUE0QyxDQUE1QztBQURxQjs7dUJBQXpCO09BQUEsTUFBQTs2QkFBQTs7QUFGSjs7RUFGVzs7O0FBT2Y7Ozs7Ozs7d0NBTUEsV0FBQSxHQUFhLFNBQUE7QUFDVCxRQUFBO0lBQUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxFQUFFLENBQUMsU0FBUyxDQUFDLFdBQVksQ0FBQSxFQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsVUFBaEMsSUFBOEMsU0FBOUMsQ0FBekIsQ0FBQTtJQUNkLElBQUMsQ0FBQSxVQUFVLENBQUMsS0FBWixHQUFvQixJQUFDLENBQUE7SUFDckIsTUFBTSxDQUFDLFdBQVAsR0FBcUIsSUFBQyxDQUFBO0lBQ3RCLFVBQUEsR0FBYSxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsS0FBdUIsRUFBRSxDQUFDLFdBQVcsQ0FBQztJQUVuRCxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsR0FBaUIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxvQkFBYixDQUFrQyxFQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUF2RCxFQUFtRSxJQUFDLENBQUEsTUFBcEU7SUFDakIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBZixHQUF5QjtJQUN6QixvQkFBb0IsQ0FBQyxPQUFyQixHQUErQjtJQUMvQixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBbEIsQ0FBQTtJQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUiwrQ0FBbUMsQ0FBRSxpQkFBbkIsSUFBOEIsSUFBQyxDQUFBLE1BQU0sQ0FBQztJQUN4RCxnREFBa0IsQ0FBRSxnQkFBakIsR0FBMEIsQ0FBN0I7TUFDSSxJQUFDLENBQUEsV0FBRCxDQUFhLEVBQUUsQ0FBQyxRQUFILENBQVksZ0JBQVosRUFBOEIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFRLENBQUEsQ0FBQSxDQUFFLENBQUMsV0FBbkIsSUFBa0MsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUF4RSxFQUFxRjtRQUFFLE9BQUEsRUFBUyxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUEvQjtRQUF3QyxNQUFBLEVBQVEsSUFBQyxDQUFBLE1BQWpEO09BQXJGLENBQWIsRUFESjs7SUFHQSxJQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxXQUFsQztNQUNJLElBQUMsQ0FBQSxlQUFELENBQWlCLFdBQVcsQ0FBQyxVQUFVLENBQUMsTUFBeEMsRUFBZ0QsRUFBRSxDQUFDLFFBQUgsQ0FBWSxxQkFBWixFQUFtQyxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQTNDLEVBQXdELElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBaEUsQ0FBaEQsRUFESjs7SUFHQSxJQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxTQUFsQzthQUNJLElBQUMsQ0FBQSxhQUFELENBQWUsV0FBVyxDQUFDLFVBQVUsQ0FBQyxPQUF0QyxFQUErQyxFQUFFLENBQUMsUUFBSCxDQUFZLG1CQUFaLEVBQWlDLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBekMsRUFBc0QsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUE5RCxDQUEvQyxFQURKOztFQWxCUzs7O0FBcUJiOzs7Ozs7O3dDQU1BLGlCQUFBLEdBQW1CLFNBQUE7SUFDZixJQUFHLENBQUMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBdEI7TUFDSSxJQUFHLFlBQVksQ0FBQyxjQUFjLENBQUMsTUFBNUIsS0FBc0MsQ0FBekM7UUFDSSxXQUFXLENBQUMsYUFBYSxDQUFDLE9BQTFCLENBQUEsRUFESjs7TUFFQSxXQUFXLENBQUMsYUFBWixHQUFnQyxJQUFBLEVBQUUsQ0FBQyxlQUFILENBQXVCLElBQUEsUUFBQSxDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsUUFBUSxDQUFDLEtBQXhCLEVBQStCLFFBQVEsQ0FBQyxNQUF4QyxFQUFnRCxRQUFRLENBQUMsUUFBekQsQ0FBdkI7TUFDaEMsSUFBQyxDQUFBLFFBQUQsR0FBWSxXQUFXLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQzthQUM3QyxJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVIsR0FBbUIsV0FBVyxDQUFDLGNBTG5DO0tBQUEsTUFBQTtNQU9JLFdBQVcsQ0FBQyxhQUFhLENBQUMsT0FBMUIsQ0FBQTtNQUNBLFdBQVcsQ0FBQyxhQUFaLEdBQTRCLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUyxDQUFDO01BQzlDLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixHQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQztNQUNyQyxJQUFDLENBQUEsUUFBRCxHQUFZLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzthQUNwQyxJQUFDLENBQUEsUUFBUSxDQUFDLFFBQVYsR0FBcUIsUUFBUSxDQUFDLFNBWGxDOztFQURlOzs7QUFjbkI7Ozs7Ozs7d0NBTUEsV0FBQSxHQUFhLFNBQUE7SUFDVCxJQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQXJCO2FBQ0ksSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBakIsQ0FBeUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBM0MsRUFESjs7RUFEUzs7O0FBSWI7Ozs7Ozs7d0NBTUEsa0JBQUEsR0FBb0IsU0FBQTtJQUNoQixJQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUyxDQUFDLFdBQXJCO2FBQ0ksSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBcEIsQ0FBQSxFQURKOztFQURnQjs7O0FBSXBCOzs7Ozs7O3dDQU1BLGlCQUFBLEdBQW1CLFNBQUE7QUFDZixRQUFBO0lBQUEsWUFBQSw4Q0FBZ0MsQ0FBRTtJQUNsQyxJQUFHLFlBQUg7QUFDSTtXQUFBLDhDQUFBOztRQUNJLGFBQUEsR0FBZ0IsRUFBRSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBekIsQ0FBb0MsVUFBVSxDQUFDLEVBQS9DO1FBQ2hCLGFBQWEsQ0FBQyxPQUFkLEdBQXdCLFVBQVUsQ0FBQztRQUNuQyxJQUFHLFVBQVUsQ0FBQyxPQUFkO1VBQ0ksVUFBVSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsb0JBQWhDLENBQUE7VUFDQSxPQUFBLEdBQVUsRUFBRSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBekIsQ0FBb0MsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUF2RDtVQUNWLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBckIsQ0FBQTtVQUVBLE1BQU0sQ0FBQyxLQUFQLENBQWEsT0FBYixFQUFzQixVQUFVLENBQUMsT0FBakMsRUFBMEMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxNQUF2QyxDQUE4QyxDQUFDLFFBQUQsQ0FBOUMsQ0FBMUM7QUFFQTtBQUFBLGVBQUEsd0NBQUE7O1lBQ0ksQ0FBQyxDQUFDLE1BQUYsR0FBVztBQURmO3VCQUVBLE9BQU8sQ0FBQyxZQUFZLENBQUMsa0JBQXJCLENBQUEsR0FUSjtTQUFBLE1BQUE7K0JBQUE7O0FBSEo7cUJBREo7O0VBRmU7OztBQWlCbkI7Ozs7Ozs7d0NBTUEsZUFBQSxHQUFpQixTQUFBO0FBQ2IsUUFBQTtJQUFBLCtDQUFvQixDQUFFLHFCQUF0QjtBQUNJO1dBQUEsNENBQUE7UUFDSSxJQUFDLENBQUEsTUFBTSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxZQUF0QyxDQUFtRCxNQUFuRDtRQUNBLFlBQUEsR0FBZSxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNqQyxJQUFHLFlBQWEsQ0FBQSxNQUFBLENBQWhCOzs7QUFBNkI7QUFBQTtpQkFBQSw4Q0FBQTs7Y0FDekIsSUFBRyxJQUFIO2dCQUNJLFdBQUEsR0FBa0IsSUFBQSxFQUFFLENBQUMsa0JBQUgsQ0FBQTtnQkFDbEIsYUFBQSxHQUFnQixFQUFFLENBQUMsU0FBUyxDQUFDLDJCQUFiLENBQXlDO2tCQUFBLElBQUEsRUFBTSxzQkFBTjtrQkFBOEIsRUFBQSxFQUFJLG9CQUFBLEdBQXFCLENBQXZEO2tCQUEwRCxNQUFBLEVBQVE7b0JBQUUsRUFBQSxFQUFJLG9CQUFBLEdBQXFCLENBQTNCO21CQUFsRTtpQkFBekMsRUFBMkksV0FBM0k7Z0JBQ2hCLE9BQUEsR0FBVSxFQUFFLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUF6QixDQUFvQyxvQkFBQSxHQUFxQixDQUFyQixHQUF1QixVQUEzRDtnQkFDVixJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxvQkFBMUIsQ0FBQTtnQkFDQSxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQXJCLENBQUE7Z0JBQ0EsTUFBTSxDQUFDLEtBQVAsQ0FBYSxPQUFiLEVBQXNCLElBQUksQ0FBQyxPQUEzQjtBQUNBO0FBQUEscUJBQUEsd0NBQUE7O2tCQUNJLENBQUMsQ0FBQyxNQUFGLEdBQVc7QUFEZjtnQkFJQSxhQUFhLENBQUMsT0FBTyxDQUFDLENBQXRCLEdBQTBCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO2dCQUM5QyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQXRCLEdBQTBCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO2dCQUM5QyxhQUFhLENBQUMsT0FBTyxDQUFDLEtBQXRCLEdBQThCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO2dCQUNsRCxhQUFhLENBQUMsT0FBTyxDQUFDLE1BQXRCLEdBQStCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO2dCQUNuRCxhQUFhLENBQUMsV0FBZCxHQUE0QjtnQkFDNUIsT0FBTyxDQUFDLFlBQVksQ0FBQyxrQkFBckIsQ0FBQTtnQkFDQSxhQUFhLENBQUMsTUFBZCxDQUFBO2dCQUtBLFdBQVcsQ0FBQyxPQUFaLEdBQXNCO2dCQUN0QixXQUFXLENBQUMsTUFBWixHQUFxQjtnQkFDckIsV0FBVyxDQUFDLFNBQVosQ0FBc0IsYUFBdEI7OEJBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxTQUE3QixDQUF1QyxXQUF2QyxFQUFvRCxDQUFwRCxHQXpCSjtlQUFBLE1BQUE7c0NBQUE7O0FBRHlCOzt5QkFBN0I7U0FBQSxNQUFBOytCQUFBOztBQUhKO3FCQURKOztFQURhOzs7QUFxQ2pCOzs7Ozs7O3dDQU1BLG9CQUFBLEdBQXNCLFNBQUE7QUFDbEIsUUFBQTtJQUFBLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBckI7QUFDSTtBQUFBLFdBQUEscUNBQUE7O1FBQUEsWUFBWSxDQUFDLFlBQVksQ0FBQyxJQUExQixDQUErQixDQUEvQjtBQUFBO01BQ0EsWUFBWSxDQUFDLG1CQUFiLEdBQW1DLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztNQUMzRCxZQUFZLENBQUMsV0FBYixHQUEyQixJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7YUFDbkQsWUFBWSxDQUFDLGVBQWIsR0FBK0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLGdCQUozRDs7RUFEa0I7OztBQVF0Qjs7Ozs7Ozs7d0NBT0EsWUFBQSxHQUFjLFNBQUE7QUFDVixRQUFBO0lBQUEsUUFBQSxHQUFXLFdBQVcsQ0FBQztJQUN2QixJQUFHLFFBQUg7TUFDSSxPQUFBLEdBQWMsSUFBQSxFQUFFLENBQUMsa0JBQUgsQ0FBc0IsQ0FBQyxRQUFRLENBQUMsUUFBVixFQUFvQixJQUFDLENBQUEsTUFBckIsRUFBNkIsSUFBN0IsQ0FBdEIsRUFBMEQsUUFBUSxDQUFDLGtCQUFuRSxFQUF1RixJQUF2RjtNQUNkLFFBQVEsQ0FBQyxJQUFULEdBQWdCLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBZixDQUFzQixRQUFRLENBQUMsSUFBL0IsRUFBcUMsT0FBckM7QUFDaEI7QUFBQSxXQUFBLHFDQUFBOztRQUNJLElBQUcsQ0FBSDs7Z0JBQTJDLENBQUUsSUFBbkMsR0FBMEMsQ0FBQyxDQUFDO1dBQXREOztBQURKO01BRUEsV0FBVyxDQUFDLE9BQVosQ0FBb0IsUUFBcEI7TUFDQSxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQWYsQ0FBeUIsUUFBUSxDQUFDLElBQWxDLEVBQXdDLE9BQXhDO01BQ0EsSUFBQyxDQUFBLGVBQWUsQ0FBQyxjQUFqQixDQUFnQyxRQUFRLENBQUMsSUFBSSxDQUFDLGVBQTlDLEVBQStELGVBQWUsQ0FBQyxlQUEvRTtNQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixHQUFvQixRQUFRLENBQUM7YUFDN0IsUUFBUSxDQUFDLFVBQVQsR0FBc0IsUUFBUSxDQUFDLElBQUksQ0FBQyxXQVZ4Qzs7RUFGVTs7O0FBY2Q7Ozs7Ozs7d0NBTUEsV0FBQSxHQUFhLFNBQUE7SUFHVCxXQUFXLENBQUMsS0FBWixHQUFvQixJQUFDLENBQUE7SUFFckIsRUFBRSxDQUFDLGFBQWEsQ0FBQyxPQUFqQixHQUEyQixJQUFDLENBQUE7SUFFNUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBbEIsR0FBd0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxhQUFhLENBQUM7SUFFOUMsSUFBRyxDQUFDLGNBQWMsQ0FBQyxxQkFBZixDQUFxQyxJQUFDLENBQUEsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsUUFBakUsQ0FBSjtNQUNJLGNBQWMsQ0FBQyx5QkFBZixDQUF5QyxJQUFDLENBQUEsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsUUFBckU7TUFDQSxXQUFXLENBQUMsT0FBWixHQUFzQixJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFsQixJQUE2QixXQUFXLENBQUMsU0FBUyxDQUFDLE9BQW5ELElBQThEO01BRXBGLGNBQWMsQ0FBQyxnQkFBZixDQUFBO01BQ0EsY0FBYyxDQUFDLGtCQUFmLENBQUE7TUFDQSxjQUFjLENBQUMsbUJBQWYsQ0FBbUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxXQUFoRDtNQUNBLGNBQWMsQ0FBQyxvQkFBZixDQUFvQyxFQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUF6RDtNQUVBLElBQUcsdUJBQUg7UUFDSSxjQUFjLENBQUMsd0JBQWYsQ0FBd0MsSUFBQyxDQUFBLFVBQXpDLEVBREo7O01BR0EsV0FBVyxDQUFDLFdBQVosR0FBMEIsSUFBQyxDQUFBLE1BQU0sQ0FBQzthQUVsQyxXQUFXLENBQUMsYUFBYSxDQUFDLEtBQTFCLENBQWdDO1FBQUUsRUFBQSxFQUFJLElBQUMsQ0FBQSxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQTVCO09BQWhDLEVBZEo7O0VBVFM7OztBQXlCYjs7Ozs7O3dDQUtBLGFBQUEsR0FBZSxTQUFBO0FBQ1gsUUFBQTtJQUFBLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUFYO01BQ0ksSUFBQyxDQUFBLFVBQUQsQ0FBWTtRQUFFLFFBQUEsRUFBVSxDQUFaO09BQVo7QUFDQSxhQUZKOztJQUlBLElBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxhQUExQjtNQUNJLFdBQVcsQ0FBQyxVQUFVLENBQUMsYUFBdkIsR0FBdUM7TUFDdkMsRUFBRSxDQUFDLFlBQVksQ0FBQyxvQkFBaEIsQ0FBcUMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQWpFLEVBRko7S0FBQSxNQUFBO01BSUksRUFBRSxDQUFDLFlBQVksQ0FBQyxlQUFoQixDQUFnQyxJQUFDLENBQUEsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBNUQsRUFKSjs7SUFNQSxJQUFDLENBQUEsWUFBRCxDQUFBO0lBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFSLDZEQUFzRCxFQUFFLENBQUMsV0FBVyxDQUFDO0lBQ3JFLElBQUMsQ0FBQSxpQkFBRCxDQUFBO0lBQ0EsSUFBQyxDQUFBLGNBQUQsQ0FBQTtJQUNBLElBQUMsQ0FBQSxlQUFELENBQUE7SUFDQSxJQUFDLENBQUEsZ0JBQUQsQ0FBQTtJQUNBLElBQUMsQ0FBQSxhQUFELENBQUE7SUFDQSxJQUFDLENBQUEsVUFBRCxDQUFBO0lBQ0EsSUFBQyxDQUFBLFdBQUQsQ0FBQTtJQUNBLElBQUMsQ0FBQSxhQUFELENBQUE7SUFDQSxJQUFDLENBQUEsZ0JBQUQsQ0FBQTtJQUNBLElBQUMsQ0FBQSxXQUFELENBQUE7SUFDQSxJQUFDLENBQUEsaUJBQUQsQ0FBQTtJQUVBLElBQUMsQ0FBQSxpQkFBRCxDQUFBO0lBQ0EsSUFBQyxDQUFBLGtCQUFELENBQUE7SUFDQSxJQUFDLENBQUEsZUFBRCxDQUFBO0lBQ0EsSUFBQyxDQUFBLG9CQUFELENBQUE7SUFFQSxJQUFDLENBQUEsSUFBRCxDQUFNLElBQU47SUFFQSxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsR0FBb0I7SUFDcEIsV0FBVyxDQUFDLFNBQVosR0FBd0I7SUFFeEIsUUFBUSxDQUFDLE1BQVQsQ0FBQTtXQUNBLElBQUMsQ0FBQSxVQUFELENBQVk7TUFBRSxRQUFBLEVBQVUsQ0FBWjtLQUFaO0VBcENXOzs7QUF1Q2Y7Ozs7Ozs7Ozt3Q0FRQSxZQUFBLEdBQWMsU0FBQyxTQUFELEVBQVksV0FBWixFQUF5QixhQUF6QjtJQUNWLElBQUEsQ0FBTyxXQUFQO01BQ0ksU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFyQixDQUF5QixhQUFhLENBQUMsVUFBdkM7TUFFQSxJQUFHLGFBQWEsQ0FBQyxRQUFkLEdBQXlCLENBQTVCO1FBQ0ksSUFBQSxDQUFrSixXQUFsSjtVQUFBLFNBQVMsQ0FBQyxRQUFRLENBQUMsTUFBbkIsQ0FBMEIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUE1QyxFQUErQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQWpFLEVBQW9FLGFBQWEsQ0FBQyxTQUFsRixFQUE2RixhQUFhLENBQUMsTUFBM0csRUFBbUgsYUFBYSxDQUFDLFFBQWpJLEVBQUE7U0FESjtPQUhKOztJQU1BLFNBQVMsQ0FBQyxRQUFWLEdBQXFCLElBQUMsQ0FBQTtJQUN0QixTQUFTLENBQUMsT0FBVixHQUFvQjtXQUVwQixJQUFDLENBQUEsTUFBTSxDQUFDLGtCQUFrQixDQUFDLFNBQTNCLENBQXFDLFNBQXJDO0VBVlU7OztBQVlkOzs7Ozs7Ozs7d0NBUUEsZUFBQSxHQUFpQixTQUFDLFNBQUQsRUFBWSxXQUFaLEVBQXlCLGFBQXpCO0lBQ2IsSUFBQSxDQUFPLFdBQVA7aUNBQ0ksU0FBUyxDQUFFLFFBQVEsQ0FBQyxTQUFwQixDQUE4QixhQUFhLENBQUMsU0FBNUMsRUFBdUQsYUFBYSxDQUFDLE1BQXJFLEVBQTZFLGFBQWEsQ0FBQyxRQUEzRixFQUFxRyxTQUFDLE1BQUQ7ZUFBWSxNQUFNLENBQUMsT0FBUCxDQUFBO01BQVosQ0FBckcsV0FESjtLQUFBLE1BQUE7aUNBR0ksU0FBUyxDQUFFLE9BQVgsQ0FBQSxXQUhKOztFQURhOzs7QUFNakI7Ozs7Ozt3Q0FLQSxXQUFBLEdBQWEsU0FBQTtBQUNULFFBQUE7SUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQXpCLEdBQWtDO0lBQ2xDLElBQUMsQ0FBQSxNQUFNLENBQUMsa0JBQWtCLENBQUMsTUFBM0IsR0FBb0M7SUFDcEMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxNQUE1QixHQUFxQztJQUNyQyxJQUFDLENBQUEsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUF0QixHQUErQjtJQUMvQixJQUFDLENBQUEsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQXpCLEdBQWtDO0lBQ2xDLElBQUMsQ0FBQSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQXZCLEdBQWdDO0lBRWhDLE9BQUEsR0FBVSxFQUFFLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUF6QixDQUFvQyxxQkFBcEM7V0FDVixPQUFPLENBQUMsTUFBUixHQUFpQjtFQVRSOzs7QUFXYjs7Ozs7Ozt3Q0FNQSxVQUFBLEdBQVksU0FBQTtBQUNSLFFBQUE7SUFBQSxJQUFDLENBQUEsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQXpCLEdBQWtDO0lBQ2xDLElBQUMsQ0FBQSxNQUFNLENBQUMsa0JBQWtCLENBQUMsTUFBM0IsR0FBb0M7SUFDcEMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxNQUE1QixHQUFxQztJQUNyQyxJQUFDLENBQUEsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUF0QixHQUErQjtJQUMvQixJQUFDLENBQUEsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQXpCLEdBQWtDO0lBQ2xDLElBQUMsQ0FBQSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQXZCLEdBQWdDO0lBRWhDLE9BQUEsR0FBVSxFQUFFLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUF6QixDQUFvQyxxQkFBcEM7V0FDVixPQUFPLENBQUMsTUFBUixHQUFpQjtFQVRUOzs7QUFXWjs7Ozs7Ozs7d0NBT0Esa0JBQUEsR0FBb0IsU0FBQyxPQUFEO0lBQ2hCLElBQUMsQ0FBQSxTQUFELEdBQWE7V0FDYixJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFmLEdBQXlCO0VBRlQ7OztBQUlwQjs7Ozs7Ozs7d0NBT0EsYUFBQSxHQUFlLFNBQUMsT0FBRCxFQUFVLFFBQVY7QUFDWCxRQUFBOztTQUFvQixDQUFFLE9BQXRCLENBQUE7O0lBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxZQUFSLEdBQXVCLEVBQUUsQ0FBQyxTQUFTLENBQUMsMkJBQWIsQ0FBeUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxXQUFZLENBQUEsaUJBQUEsQ0FBbEUsRUFBc0YsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUE5RjtJQUN2QixJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsT0FBeEIsQ0FBQTtXQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUE1QixDQUErQixRQUEvQixFQUF5QyxRQUF6QztFQUpXOzs7QUFNZjs7Ozs7Ozs7d0NBT0EsZUFBQSxHQUFpQixTQUFDLE1BQUQsRUFBUyxRQUFUO0FBQ2IsUUFBQTs7U0FBc0IsQ0FBRSxPQUF4QixDQUFBOztJQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsY0FBUixHQUF5QixFQUFFLENBQUMsU0FBUyxDQUFDLDJCQUFiLENBQXlDLEVBQUUsQ0FBQyxTQUFTLENBQUMsV0FBWSxDQUFBLG1CQUFBLENBQWxFLEVBQXdGLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBaEc7SUFDekIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLE9BQTFCLENBQUE7V0FDQSxJQUFDLENBQUEsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBOUIsQ0FBaUMsUUFBakMsRUFBMkMsUUFBM0M7RUFKYTs7O0FBTWpCOzs7Ozs7Ozt3Q0FPQSxXQUFBLEdBQWEsU0FBQyxRQUFEO0FBQ1QsUUFBQTtJQUFBLGFBQUEsR0FBZ0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBaEIsQ0FBc0IsU0FBQyxDQUFEO2FBQU87SUFBUCxDQUF0QixDQUF3QyxDQUFDLE1BQXpDLEdBQWtEOztTQUU5QyxDQUFFLE9BQXRCLENBQUE7O0lBRUEsSUFBRyxhQUFIO01BQ0ksSUFBQyxDQUFBLE1BQU0sQ0FBQyxZQUFSLEdBQXVCLEVBQUUsQ0FBQyxTQUFTLENBQUMsMkJBQWIsQ0FBeUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxXQUFZLENBQUEsa0JBQUEsQ0FBbEUsRUFBdUYsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUEvRixFQUQzQjtLQUFBLE1BQUE7TUFHSSxJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsR0FBdUIsRUFBRSxDQUFDLFNBQVMsQ0FBQywyQkFBYixDQUF5QyxFQUFFLENBQUMsU0FBUyxDQUFDLFdBQVksQ0FBQSxjQUFBLENBQWxFLEVBQW1GLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBM0YsRUFIM0I7O0lBS0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQTVCLENBQStCLGlCQUEvQixFQUFrRCxRQUFsRDtXQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxPQUF4QixDQUFBO0VBWFM7O3dDQWFiLGVBQUEsR0FBaUIsU0FBQyxPQUFELEVBQVUsT0FBVjtJQUNiLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxPQUE3QixHQUF1QztJQUN2QyxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsT0FBN0IsR0FBdUM7SUFDdkMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQTNCLENBQThCLFFBQTlCLEVBQXdDLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQTtBQUNwQyxZQUFBO1FBQUEsV0FBVyxDQUFDLFVBQVUsQ0FBQyxrQkFBdkIsR0FBNEM7UUFDNUMsTUFBQSxHQUFTLEtBQUMsQ0FBQSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQWhCLENBQXNCLFNBQUMsQ0FBRDtpQkFBTyxDQUFDLENBQUM7UUFBVCxDQUF0QixDQUFBLElBQTZDLEtBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUSxDQUFBLENBQUE7UUFDdEUsSUFBRyxjQUFIO2lCQUNJLEtBQUMsQ0FBQSxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUE1QixDQUFpQyxpQkFBakMsRUFBb0QsS0FBQyxDQUFBLE1BQU0sQ0FBQyxZQUE1RCxFQUEwRSxNQUExRSxFQURKOztNQUhvQztJQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEM7SUFNQSxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsS0FBN0IsQ0FBQTtXQUNBLFdBQVcsQ0FBQyxVQUFVLENBQUMsa0JBQXZCLEdBQTRDO0VBVi9COzs7QUFZakI7Ozs7Ozs7Ozs7Ozs7Ozs7d0NBZUEsZ0JBQUEsR0FBa0IsU0FBQyxVQUFELEVBQWEsV0FBYixFQUEwQixTQUExQixFQUFxQyxNQUFyQyxFQUE2QyxRQUE3QyxFQUF1RCxFQUF2RCxFQUEyRCxFQUEzRCxFQUErRCxLQUEvRCxFQUFzRSxjQUF0RSxFQUFzRixZQUF0RjtBQUNkLFFBQUE7SUFBQSxJQUFHLGtCQUFIO01BQ0ksV0FBQSxHQUFjLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBWSxDQUFBLEtBQUE7TUFDbEMsTUFBQSxHQUFhLElBQUEsRUFBRSxDQUFDLGlCQUFILENBQUE7TUFDYixNQUFNLENBQUMsS0FBUCxHQUFlLFVBQVUsQ0FBQztNQUMxQixNQUFNLENBQUMsV0FBUCxHQUFxQixVQUFVLENBQUM7TUFDaEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFkLEdBQWtCO01BQ2xCLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBZCxHQUFrQjtNQUNsQixNQUFNLENBQUMsUUFBUCxHQUFrQixJQUFDLENBQUE7TUFDbkIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBdEIsR0FBaUM7TUFDakMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBdEIsR0FBbUM7TUFDbkMsTUFBTSxDQUFDLE1BQVAsQ0FBQTtNQUVBLElBQUMsQ0FBQSxNQUFNLENBQUMsbUJBQW1CLENBQUMsU0FBNUIsQ0FBc0MsTUFBdEMsRUFBOEMsS0FBOUM7TUFFQSxRQUFBLHNCQUFXLFdBQVc7O1FBRXRCLFdBQVcsQ0FBRSxNQUFiLEdBQXNCOzs7O2FBQ1csQ0FBRSxPQUFuQyxDQUFBOzs7TUFFQSxJQUFHLFFBQUEsS0FBWSxDQUFmOztVQUNJLFdBQVcsQ0FBRSxPQUFiLENBQUE7O1FBQ0EsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBdEIsR0FBaUM7ZUFDakMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBdEIsR0FBbUMsZUFIdkM7T0FBQSxNQUFBO1FBS0ksSUFBRyxXQUFIO1VBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBdEIsR0FBaUM7aUJBQ2pDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQXRCLEdBQW1DLGVBRnZDO1NBQUEsTUFBQTtVQUlJLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBaEIsR0FBOEI7aUJBQzlCLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBaEIsQ0FBdUIsQ0FBdkIsRUFBMEIsQ0FBMUIsRUFBNkIsU0FBN0IsRUFBd0MsTUFBeEMsRUFBZ0QsUUFBaEQsRUFBMEQsQ0FBQSxTQUFBLEtBQUE7bUJBQUEsU0FBQyxNQUFEO0FBQ3RELGtCQUFBO2NBQUEsTUFBTSxDQUFDLE1BQVAsQ0FBQTs7b0JBQzJCLENBQUUsT0FBN0IsQ0FBQTs7Y0FDQSxNQUFNLENBQUMsUUFBUSxDQUFDLFdBQWhCLEdBQThCO2NBQzlCLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQXRCLEdBQWlDO3FCQUNqQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUF0QixHQUFtQztZQUxtQjtVQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBMUQsRUFMSjtTQUxKO09BbkJKO0tBQUEsTUFBQTttRUFxQzhCLENBQUUsUUFBUSxDQUFDLElBQXJDLENBQTBDLFFBQTFDLEVBQW9ELE1BQXBELEVBQTZELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUMxRCxLQUFDLENBQUEsTUFBTSxDQUFDLFdBQVksQ0FBQSxLQUFBLENBQU0sQ0FBQyxPQUEzQixDQUFBO2lCQUNBLEtBQUMsQ0FBQSxNQUFNLENBQUMsV0FBWSxDQUFBLEtBQUEsQ0FBcEIsR0FBNkI7UUFGNkI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdELFdBckNKOztFQURjOzs7QUEyQ2xCOzs7Ozs7O3dDQU1BLGFBQUEsR0FBZSxTQUFBO0FBQ1gsUUFBQTtJQUFBLFNBQUEsR0FBWSxJQUFDLENBQUEsTUFBTSxDQUFDLGlCQUFpQixDQUFDO0FBQ3RDLFNBQUEsMkNBQUE7O01BQ0ksSUFBRyxRQUFIO0FBQ0k7QUFBQSxhQUFBLHVDQUFBOzs7WUFDSSxTQUFTLENBQUM7O0FBRGQsU0FESjs7QUFESjtBQUlBLFdBQU87RUFOSTs7O0FBUWY7Ozs7Ozs7d0NBTUEsWUFBQSxHQUFjLFNBQUE7QUFDVixRQUFBO0FBQUE7QUFBQSxTQUFBLHFDQUFBOztNQUNJLElBQUcsT0FBSDtBQUNJO0FBQUEsYUFBQSx3Q0FBQTs7O1lBQ0ksU0FBUyxDQUFDOztBQURkLFNBREo7O0FBREo7QUFJQSxXQUFPO0VBTEc7OztBQU9kOzs7Ozs7O3dDQU1BLFNBQUEsR0FBVyxTQUFBO0FBQ1IsUUFBQTtBQUFBO0FBQUEsU0FBQSxxQ0FBQTs7TUFDSyxJQUFHLElBQUg7QUFDSTtBQUFBLGFBQUEsd0NBQUE7OztZQUNJLFNBQVMsQ0FBQzs7QUFEZCxTQURKOztBQURMO0FBSUMsV0FBTztFQUxBOzs7QUFPWDs7Ozs7Ozt3Q0FNQSxVQUFBLEdBQVksU0FBQTtBQUNSLFFBQUE7QUFBQTtBQUFBLFNBQUEscUNBQUE7O01BQ0ksSUFBRyxLQUFIO0FBQ0k7QUFBQSxhQUFBLHdDQUFBOzs7WUFDSSxTQUFTLENBQUM7O0FBRGQsU0FESjs7QUFESjtBQUlBLFdBQU87RUFMQzs7O0FBT1o7Ozs7Ozs7d0NBTUEsZUFBQSxHQUFpQixTQUFBO0FBQ2IsUUFBQTtBQUFBO0FBQUEsU0FBQSxxQ0FBQTs7TUFDSSxJQUFHLFVBQUg7QUFDSTtBQUFBLGFBQUEsd0NBQUE7OztZQUNJLFNBQVMsQ0FBQzs7QUFEZCxTQURKOztBQURKO0FBSUEsV0FBTztFQUxNOzs7QUFPakI7Ozs7Ozs7d0NBTUEsY0FBQSxHQUFnQixTQUFBO0FBQ1osUUFBQTtBQUFBO0FBQUEsU0FBQSxxQ0FBQTs7TUFDSSxJQUFHLFNBQUg7QUFDSTtBQUFBLGFBQUEsd0NBQUE7OztZQUNJLFNBQVMsQ0FBQzs7QUFEZCxTQURKOztBQURKO0FBSUEsV0FBTztFQUxLOzs7QUFPaEI7Ozs7Ozs7d0NBTUEsZ0JBQUEsR0FBa0IsU0FBQTtBQUNkLFFBQUE7QUFBQTtBQUFBLFNBQUEscUNBQUE7OztRQUNJLFNBQVMsQ0FBQzs7QUFEZDtBQUVBLFdBQU87RUFITzs7O0FBS2xCOzs7Ozs7O3dDQU1BLGdCQUFBLEdBQWtCLFNBQUE7QUFDZCxRQUFBO0FBQUE7QUFBQSxTQUFBLHFDQUFBOztNQUNJLFVBQUEsR0FBYSxFQUFFLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUF6QixDQUFvQyxZQUFwQztNQUNiLElBQUcsVUFBVSxDQUFDLFVBQWQ7QUFDSTtBQUFBLGFBQUEsd0NBQUE7OztZQUNJLFNBQVMsQ0FBQzs7QUFEZCxTQURKOztBQUZKO0FBS0EsV0FBTztFQU5POzs7QUFRbEI7Ozs7Ozs7d0NBTUEsZ0JBQUEsR0FBa0IsU0FBQTtBQUNkLFFBQUE7QUFBQTtBQUFBLFNBQUEscUNBQUE7O01BQ0ksMEJBQUcsV0FBVyxDQUFFLGdCQUFoQjtBQUNJO0FBQUEsYUFBQSx3Q0FBQTs7O1lBQ0ksU0FBUyxDQUFDOztBQURkLFNBREo7O0FBREo7SUFLQSxHQUFBLEdBQU0sRUFBRSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBekIsQ0FBb0MscUJBQXBDO0lBQ04sSUFBRyxHQUFIO0FBQ0k7QUFBQSxXQUFBLHdDQUFBOzs7VUFDSSxTQUFTLENBQUM7O0FBRGQsT0FESjs7SUFHQSxHQUFBLEdBQU0sRUFBRSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBekIsQ0FBb0Msd0JBQXBDO0lBQ04sSUFBRyxHQUFIO0FBQ0k7QUFBQSxXQUFBLHdDQUFBOzs7VUFDSSxTQUFTLENBQUM7O0FBRGQsT0FESjs7QUFJQSxXQUFPO0VBZk87OztBQWlCbEI7Ozs7Ozs7d0NBTUEsZUFBQSxHQUFpQixTQUFBO0lBQ2IsSUFBRyxJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVcsQ0FBQyxXQUFwQixHQUFrQyxXQUFXLENBQUMsWUFBWSxDQUFDLFFBQTlEO01BQ0ksSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFXLENBQUMsV0FBcEIsR0FBa0MsV0FBVyxDQUFDLFlBQVksQ0FBQztNQUMzRCxJQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsV0FBVyxDQUFDLFdBQXBCLEtBQW1DLENBQXRDO2VBQ0ksSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBcEIsR0FBZ0MsTUFEcEM7T0FGSjs7RUFEYTs7O0FBTWpCOzs7Ozs7O3dDQU1BLGdCQUFBLEdBQWtCLFNBQUE7QUFDZCxRQUFBO0lBQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQW9CLENBQUM7QUFDdEM7U0FBQSx3Q0FBQTs7TUFDSSxxQkFBRyxLQUFLLENBQUUscUJBQVAsSUFBdUIsS0FBSyxDQUFDLFdBQVcsQ0FBQyxXQUFsQixHQUFnQyxXQUFXLENBQUMsWUFBWSxDQUFDLFFBQW5GO1FBQ0ksS0FBSyxDQUFDLFdBQVcsQ0FBQyxXQUFsQixHQUFnQyxXQUFXLENBQUMsWUFBWSxDQUFDO1FBQ3pELElBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxXQUFsQixLQUFpQyxDQUFwQzt1QkFDSSxLQUFLLENBQUMsV0FBVyxDQUFDLFNBQWxCLEdBQThCLE9BRGxDO1NBQUEsTUFBQTsrQkFBQTtTQUZKO09BQUEsTUFBQTs2QkFBQTs7QUFESjs7RUFGYzs7O0FBUWxCOzs7Ozs7O3dDQU1BLFdBQUEsR0FBYSxTQUFBO0lBQ1QsSUFBQyxDQUFBLFlBQUQsQ0FBQTtJQUNBLElBQUMsQ0FBQSxTQUFELENBQUE7SUFDQSxJQUFDLENBQUEsVUFBRCxDQUFBO0lBQ0EsSUFBQyxDQUFBLGVBQUQsQ0FBQTtJQUNBLElBQUMsQ0FBQSxjQUFELENBQUE7SUFDQSxJQUFDLENBQUEsZ0JBQUQsQ0FBQTtJQUNBLElBQUMsQ0FBQSxhQUFELENBQUE7SUFDQSxJQUFDLENBQUEsZ0JBQUQsQ0FBQTtJQUNBLElBQUMsQ0FBQSxnQkFBRCxDQUFBO0lBQ0EsSUFBQyxDQUFBLGVBQUQsQ0FBQTtXQUNBLElBQUMsQ0FBQSxnQkFBRCxDQUFBO0VBWFM7OztBQWNiOzs7Ozs7Ozt3Q0FPQSwwQkFBQSxHQUE0QixTQUFBO0lBQ3hCLElBQUcsQ0FBQyxJQUFDLENBQUEsU0FBRixJQUFnQixDQUFDLEtBQUssQ0FBQyxPQUFOLENBQWMsS0FBSyxDQUFDLENBQXBCLENBQUEsSUFBMEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUF2QyxDQUFuQjtNQUNJLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixDQUFDLElBQUMsQ0FBQSxTQUF0QixFQURKOztJQUVBLElBQUcsS0FBSyxDQUFDLE9BQU4sQ0FBYyxLQUFLLENBQUMsU0FBcEIsQ0FBSDthQUNJLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixDQUFDLElBQUMsQ0FBQSxTQUF0QixFQURKOztFQUh3Qjs7O0FBTTVCOzs7Ozs7Ozt3Q0FPQSxrQkFBQSxHQUFvQixTQUFBO0lBQ2hCLElBQUcsS0FBSyxDQUFDLE9BQU4sQ0FBYyxLQUFLLENBQUMsVUFBcEIsQ0FBSDthQUNJLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBZixDQUFBLEVBREo7O0VBRGdCOzs7QUFLcEI7Ozs7Ozs7O3dDQU9BLHNCQUFBLEdBQXdCLFNBQUE7SUFDcEIsSUFBRyxXQUFXLENBQUMsWUFBWSxDQUFDLFVBQXpCLElBQXdDLEtBQUssQ0FBQyxPQUFOLENBQWMsS0FBSyxDQUFDLENBQXBCLENBQTNDO2FBQ0ksWUFBWSxDQUFDLFFBQWIsQ0FBMEIsSUFBQSxFQUFFLENBQUMsYUFBSCxDQUFpQixvQkFBakIsQ0FBMUIsRUFBa0UsSUFBbEUsRUFESjs7RUFEb0I7OztBQUl4Qjs7Ozs7Ozs7d0NBT0Esa0JBQUEsR0FBb0IsU0FBQTtJQUNoQixJQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQXBCO01BQ0ksSUFBRyxLQUFLLENBQUMsSUFBSyxDQUFBLEtBQUssQ0FBQyxXQUFOLENBQVgsS0FBaUMsQ0FBcEM7ZUFDSSxXQUFXLENBQUMsWUFBWSxDQUFDLElBQXpCLEdBQWdDLEtBRHBDO09BQUEsTUFFSyxJQUFHLEtBQUssQ0FBQyxJQUFLLENBQUEsS0FBSyxDQUFDLFdBQU4sQ0FBWCxLQUFpQyxDQUFwQztlQUNELFdBQVcsQ0FBQyxZQUFZLENBQUMsSUFBekIsR0FBZ0MsTUFEL0I7T0FIVDs7RUFEZ0I7OztBQU9wQjs7Ozs7Ozt3Q0FNQSxlQUFBLEdBQWlCLFNBQUE7SUFDYixJQUFVLENBQUMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxlQUFSLENBQUEsQ0FBWDtBQUFBLGFBQUE7O0lBQ0EsSUFBQyxDQUFBLHNCQUFELENBQUE7SUFDQSxJQUFDLENBQUEsa0JBQUQsQ0FBQTtJQUNBLElBQUMsQ0FBQSwwQkFBRCxDQUFBO1dBQ0EsSUFBQyxDQUFBLGtCQUFELENBQUE7RUFMYTs7O0FBT2pCOzs7Ozs7d0NBS0EsV0FBQSxHQUFhLFNBQUE7SUFDVCxJQUFHLHlCQUFIO01BQ0ksSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBZCxDQUFBO01BQ0EsSUFBRyxJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxjQUFqQixJQUFvQyxDQUFDLEtBQUssQ0FBQyxPQUFOLENBQWMsS0FBSyxDQUFDLENBQXBCLENBQUEsSUFBMEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFRLENBQUEsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFaLENBQXBCLEtBQXlDLENBQXBFLENBQXZDO1FBQ0ksSUFBQyxDQUFBLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBZCxDQUFBLEVBREo7O2FBRUEsS0FBSyxDQUFDLEtBQU4sQ0FBQSxFQUpKOztFQURTOzs7QUFPYjs7Ozs7O3dDQUtBLGNBQUEsR0FBZ0IsU0FBQTtJQUNaLElBQUcsQ0FBQyxJQUFDLENBQUEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFyQjtNQUNJLElBQUMsQ0FBQSxNQUFNLENBQUMsWUFBWSxDQUFDLElBQXJCLEdBQTRCLE1BRGhDOztJQUdBLElBQUcsV0FBVyxDQUFDLFlBQVksQ0FBQyxJQUE1QjthQUNJLElBQUMsQ0FBQSxXQUFELENBQUEsRUFESjs7RUFKWTs7O0FBT2hCOzs7Ozs7d0NBS0EsYUFBQSxHQUFlLFNBQUE7SUFHWCxXQUFXLENBQUMsS0FBWixHQUFvQixJQUFDLENBQUE7SUFDckIsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFsQixDQUFBO0lBQ0EsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBakIsQ0FBQTtJQUVBLElBQUMsQ0FBQSxjQUFELENBQUE7SUFDQSxJQUFDLENBQUEsV0FBRCxDQUFBO0lBQ0EsSUFBQyxDQUFBLGVBQUQsQ0FBQTtXQUVBLDZEQUFBO0VBWFc7Ozs7R0FuL0J1QixFQUFFLENBQUM7O0FBZ2dDN0MsRUFBRSxDQUFDLDJCQUFILEdBQWlDIiwic291cmNlc0NvbnRlbnQiOlsiIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jXG4jICAgU2NyaXB0OiBDb21wb25lbnRfR2FtZVNjZW5lQmVoYXZpb3JcbiNcbiMgICAkJENPUFlSSUdIVCQkXG4jXG4jID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNsYXNzIENvbXBvbmVudF9HYW1lU2NlbmVCZWhhdmlvciBleHRlbmRzIGdzLkNvbXBvbmVudF9MYXlvdXRTY2VuZUJlaGF2aW9yXG4gIyAgIEBvYmplY3RDb2RlY0JsYWNrTGlzdCA9IFtcIm9iamVjdE1hbmFnZXJcIl1cbiAgICAjIyMqXG4gICAgKiBEZWZpbmVzIHRoZSBiZWhhdmlvciBvZiB2aXN1YWwgbm92ZWwgZ2FtZSBzY2VuZS5cbiAgICAqXG4gICAgKiBAbW9kdWxlIHZuXG4gICAgKiBAY2xhc3MgQ29tcG9uZW50X0dhbWVTY2VuZUJlaGF2aW9yXG4gICAgKiBAZXh0ZW5kcyBncy5Db21wb25lbnRfTGF5b3V0U2NlbmVCZWhhdmlvclxuICAgICogQG1lbWJlcm9mIHZuXG4gICAgIyMjXG4gICAgY29uc3RydWN0b3I6IC0+XG4gICAgICAgIHN1cGVyKClcblxuICAgICAgICBAb25BdXRvQ29tbW9uRXZlbnRTdGFydCA9ID0+XG4gICAgICAgICAgICBAb2JqZWN0LnJlbW92ZUNvbXBvbmVudChAb2JqZWN0LmludGVycHJldGVyKVxuICAgICAgICAgICAgQG9iamVjdC5pbnRlcnByZXRlci5zdG9wKClcbiAgICAgICAgQG9uQXV0b0NvbW1vbkV2ZW50RmluaXNoID0gPT5cbiAgICAgICAgICAgIGlmICFAb2JqZWN0LmNvbXBvbmVudHMuY29udGFpbnMoQG9iamVjdC5pbnRlcnByZXRlcilcbiAgICAgICAgICAgICAgICBAb2JqZWN0LmFkZENvbXBvbmVudChAb2JqZWN0LmludGVycHJldGVyKVxuICAgICAgICAgICAgQG9iamVjdC5pbnRlcnByZXRlci5yZXN1bWUoKVxuXG4gICAgICAgIEByZXNvdXJjZUNvbnRleHQgPSBudWxsXG4gICAgICAgIEBvYmplY3REb21haW4gPSBcIlwiXG5cbiAgICAjIyMqXG4gICAgKiBJbml0aWFsaXplcyB0aGUgc2NlbmUuXG4gICAgKlxuICAgICogQG1ldGhvZCBpbml0aWFsaXplXG4gICAgIyMjXG4gICAgaW5pdGlhbGl6ZTogLT5cbiAgICAgICAgaWYgU2NlbmVNYW5hZ2VyLnByZXZpb3VzU2NlbmVzLmxlbmd0aCA9PSAwXG4gICAgICAgICAgICBncy5HbG9iYWxFdmVudE1hbmFnZXIuY2xlYXJFeGNlcHQoQG9iamVjdC5jb21tb25FdmVudENvbnRhaW5lci5zdWJPYmplY3RzKVxuXG4gICAgICAgIEByZXNvdXJjZUNvbnRleHQgPSBSZXNvdXJjZU1hbmFnZXIuY3JlYXRlQ29udGV4dCgpXG4gICAgICAgIFJlc291cmNlTWFuYWdlci5jb250ZXh0ID0gQHJlc291cmNlQ29udGV4dFxuXG4gICAgICAgIEdyYXBoaWNzLmZyZWV6ZSgpXG4gICAgICAgIHNhdmVHYW1lID0gR2FtZU1hbmFnZXIubG9hZGVkU2F2ZUdhbWVcbiAgICAgICAgc2NlbmVVaWQgPSBudWxsXG5cbiAgICAgICAgaWYgc2F2ZUdhbWVcbiAgICAgICAgICAgIHNjZW5lVWlkID0gc2F2ZUdhbWUuc2NlbmVVaWRcbiAgICAgICAgICAgIEBvYmplY3Quc2NlbmVEYXRhID0gc2F2ZUdhbWUuZGF0YVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBzY2VuZVVpZCA9ICRQQVJBTVMucHJldmlldz8uc2NlbmUudWlkIHx8IEBvYmplY3Quc2NlbmVEYXRhLnVpZCB8fCBSZWNvcmRNYW5hZ2VyLnN5c3RlbS5zdGFydEluZm8uc2NlbmUudWlkXG5cbiAgICAgICAgQG9iamVjdC5zY2VuZURvY3VtZW50ID0gRGF0YU1hbmFnZXIuZ2V0RG9jdW1lbnQoc2NlbmVVaWQpXG5cbiAgICAgICAgaWYgQG9iamVjdC5zY2VuZURvY3VtZW50IGFuZCBAb2JqZWN0LnNjZW5lRG9jdW1lbnQuaXRlbXMudHlwZSA9PSBcInZuLnNjZW5lXCJcbiAgICAgICAgICAgIEBvYmplY3QuY2hhcHRlciA9IERhdGFNYW5hZ2VyLmdldERvY3VtZW50KEBvYmplY3Quc2NlbmVEb2N1bWVudC5pdGVtcy5jaGFwdGVyVWlkKVxuICAgICAgICAgICAgQG9iamVjdC5jdXJyZW50Q2hhcmFjdGVyID0geyBcIm5hbWVcIjogXCJcIiB9ICNSZWNvcmRNYW5hZ2VyLmNoYXJhY3RlcnNbMF1cblxuICAgICAgICAgICAgaWYgbm90IEdhbWVNYW5hZ2VyLmluaXRpYWxpemVkXG4gICAgICAgICAgICAgICAgR2FtZU1hbmFnZXIuaW5pdGlhbGl6ZSgpXG4gICAgICAgICAgICBHYW1lTWFuYWdlci5wcmVsb2FkQ29tbW9uRXZlbnRzKClcblxuICAgICAgICAgICAgTGFuZ3VhZ2VNYW5hZ2VyLmxvYWRCdW5kbGVzKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3ByaXRlID0gbmV3IGdzLlNwcml0ZSgpXG4gICAgICAgICAgICBzcHJpdGUuYml0bWFwID0gbmV3IGdzLkJpdG1hcChHcmFwaGljcy53aWR0aCwgNTApXG4gICAgICAgICAgICBzcHJpdGUuYml0bWFwLmRyYXdUZXh0KDAsIDAsIEdyYXBoaWNzLndpZHRoLCA1MCwgXCJObyBTdGFydCBTY2VuZSBzZWxlY3RlZFwiLCAxLCAwKVxuICAgICAgICAgICAgc3ByaXRlLnNyY1JlY3QgPSBuZXcgZ3MuUmVjdCgwLCAwLCBHcmFwaGljcy53aWR0aCwgNTApXG4gICAgICAgICAgICBzcHJpdGUueSA9IChHcmFwaGljcy5oZWlnaHQgLSA1MCkgLyAyXG4gICAgICAgICAgICBzcHJpdGUueiA9IDEwMDAwXG5cbiAgICAgICAgQHNldHVwU2NyZWVuKClcblxuICAgICMjIypcbiAgICAqIERpc3Bvc2VzIHRoZSBzY2VuZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGRpc3Bvc2VcbiAgICAjIyNcbiAgICBkaXNwb3NlOiAtPlxuICAgICAgICBSZXNvdXJjZU1hbmFnZXIuY29udGV4dCA9IEByZXNvdXJjZUNvbnRleHRcbiAgICAgICAgQG9iamVjdC5yZW1vdmVPYmplY3QoQG9iamVjdC5jb21tb25FdmVudENvbnRhaW5lcilcbiAgICAgICAgQHNob3cobm8pXG4gICAgICAgIEBvYmplY3Qudmlld3BvcnQ/LmRpc3Bvc2UoKVxuXG4gICAgICAgIGZvciBldmVudCBpbiBHYW1lTWFuYWdlci5jb21tb25FdmVudHNcbiAgICAgICAgICAgIGlmIGV2ZW50XG4gICAgICAgICAgICAgICAgZXZlbnQuZXZlbnRzLm9mZkJ5T3duZXIoXCJzdGFydFwiLCBAb2JqZWN0KVxuICAgICAgICAgICAgICAgIGV2ZW50LmV2ZW50cy5vZmZCeU93bmVyKFwiZmluaXNoXCIsIEBvYmplY3QpXG5cbiAgICAgICAgaWYgQG9iamVjdC52aWRlb1xuICAgICAgICAgICAgQG9iamVjdC52aWRlby5kaXNwb3NlKClcbiAgICAgICAgICAgIEBvYmplY3QudmlkZW8ub25FbmRlZCgpXG5cbiAgICAgICAgc3VwZXIoKVxuXG4gICAgY2hhbmdlUGljdHVyZURvbWFpbjogKGRvbWFpbikgLT5cbiAgICAgICAgQG9iamVjdC5waWN0dXJlQ29udGFpbmVyLmJlaGF2aW9yLmNoYW5nZURvbWFpbihkb21haW4pXG4gICAgICAgIEBvYmplY3QucGljdHVyZXMgPSBAb2JqZWN0LnBpY3R1cmVDb250YWluZXIuc3ViT2JqZWN0c1xuICAgIGNoYW5nZVRleHREb21haW46IChkb21haW4pIC0+XG4gICAgICAgIEBvYmplY3QudGV4dENvbnRhaW5lci5iZWhhdmlvci5jaGFuZ2VEb21haW4oZG9tYWluKVxuICAgICAgICBAb2JqZWN0LnRleHRzID0gQG9iamVjdC50ZXh0Q29udGFpbmVyLnN1Yk9iamVjdHNcbiAgICBjaGFuZ2VWaWRlb0RvbWFpbjogKGRvbWFpbikgLT5cbiAgICAgICAgQG9iamVjdC52aWRlb0NvbnRhaW5lci5iZWhhdmlvci5jaGFuZ2VEb21haW4oZG9tYWluKVxuICAgICAgICBAb2JqZWN0LnZpZGVvcyA9IEBvYmplY3QudmlkZW9Db250YWluZXIuc3ViT2JqZWN0c1xuICAgIGNoYW5nZUhvdHNwb3REb21haW46IChkb21haW4pIC0+XG4gICAgICAgIEBvYmplY3QuaG90c3BvdENvbnRhaW5lci5iZWhhdmlvci5jaGFuZ2VEb21haW4oZG9tYWluKVxuICAgICAgICBAb2JqZWN0LmhvdHNwb3RzID0gQG9iamVjdC5ob3RzcG90Q29udGFpbmVyLnN1Yk9iamVjdHNcbiAgICBjaGFuZ2VNZXNzYWdlQXJlYURvbWFpbjogKGRvbWFpbikgLT5cbiAgICAgICAgQG9iamVjdC5tZXNzYWdlQXJlYUNvbnRhaW5lci5iZWhhdmlvci5jaGFuZ2VEb21haW4oZG9tYWluKVxuICAgICAgICBAb2JqZWN0Lm1lc3NhZ2VBcmVhcyA9IEBvYmplY3QubWVzc2FnZUFyZWFDb250YWluZXIuc3ViT2JqZWN0c1xuXG4gICAgIyMjKlxuICAgICogU2hvd3MvSGlkZXMgdGhlIGN1cnJlbnQgc2NlbmUuIEEgaGlkZGVuIHNjZW5lIGlzIG5vIGxvbmdlciBzaG93biBhbmQgZXhlY3V0ZWRcbiAgICAqIGJ1dCBhbGwgb2JqZWN0cyBhbmQgZGF0YSBpcyBzdGlsbCB0aGVyZSBhbmQgYmUgc2hvd24gYWdhaW4gYW55dGltZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNob3dcbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gdmlzaWJsZSAtIEluZGljYXRlcyBpZiB0aGUgc2NlbmUgc2hvdWxkIGJlIHNob3duIG9yIGhpZGRlbi5cbiAgICAjIyNcbiAgICBzaG93OiAodmlzaWJsZSkgLT5cbiAgICAgICAgaWYgdmlzaWJsZVxuICAgICAgICAgICAgR2FtZU1hbmFnZXIuc2NlbmVWaWV3cG9ydCA9IEBvYmplY3Qudmlld3BvcnRcbiAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnNjZW5lVmlld3BvcnQudG9uZSA9IEBzY3JlZW5Ub25lIHx8IEdhbWVNYW5hZ2VyLnNjZW5lVmlld3BvcnQudG9uZVxuICAgICAgICAgICAgR2FtZU1hbmFnZXIuc2NlbmVWaWV3cG9ydC56b29tID0gQHNjcmVlblpvb20gfHwgR2FtZU1hbmFnZXIuc2NlbmVWaWV3cG9ydC56b29tXG4gICAgICAgICAgICBHYW1lTWFuYWdlci5zY2VuZVZpZXdwb3J0LmFuZ2xlID0gQHNjcmVlbkFuZ2xlIHx8IEdhbWVNYW5hZ2VyLnNjZW5lVmlld3BvcnQuYW5nbGVcbiAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnNjZW5lVmlld3BvcnQuYW5jaG9yID0gQHNjcmVlbkFuY2hvciB8fCBHYW1lTWFuYWdlci5zY2VuZVZpZXdwb3J0LmFuY2hvclxuICAgICAgICAgICAgU2NlbmVNYW5hZ2VyLnNjZW5lLnZpZXdwb3J0Py52aXN1YWwuc2Nyb2xsID0gQHNjcmVlblNjcm9sbCB8fCBTY2VuZU1hbmFnZXIuc2NlbmUudmlld3BvcnQudmlzdWFsLnNjcm9sbFxuICAgICAgICAgICAgR2FtZU1hbmFnZXIuc2NlbmVWaWV3cG9ydC51cGRhdGUoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBpZiBHYW1lTWFuYWdlci5zY2VuZVZpZXdwb3J0XG4gICAgICAgICAgICAgICAgQHNjcmVlblRvbmUgPSBPYmplY3QuY29weShHYW1lTWFuYWdlci5zY2VuZVZpZXdwb3J0LnRvbmUpXG4gICAgICAgICAgICAgICAgQHNjcmVlblpvb20gPSBPYmplY3QuY29weShHYW1lTWFuYWdlci5zY2VuZVZpZXdwb3J0Lnpvb20pXG4gICAgICAgICAgICAgICAgQHNjcmVlbkFuZ2xlID0gT2JqZWN0LmNvcHkoR2FtZU1hbmFnZXIuc2NlbmVWaWV3cG9ydC5hbmdsZSlcbiAgICAgICAgICAgICAgICBAc2NyZWVuQW5jaG9yID0gT2JqZWN0LmNvcHkoR2FtZU1hbmFnZXIuc2NlbmVWaWV3cG9ydC5hbmNob3IpXG4gICAgICAgICAgICBpZiBTY2VuZU1hbmFnZXIuc2NlbmUudmlld3BvcnRcbiAgICAgICAgICAgICAgICBAc2NyZWVuU2Nyb2xsID0gT2JqZWN0LmNvcHkoU2NlbmVNYW5hZ2VyLnNjZW5lLnZpZXdwb3J0LnZpc3VhbC5zY3JvbGwpXG5cbiAgICAgICAgd2luZG93LiRkYXRhRmllbGRzID0gQGRhdGFGaWVsZHNcbiAgICAgICAgQG9iamVjdC52aXNpYmxlID0gdmlzaWJsZVxuXG4gICAgICAgIEBvYmplY3QubGF5b3V0Py51cGRhdGUoKVxuXG4gICAgICAgIEBvYmplY3QucGljdHVyZUNvbnRhaW5lci5iZWhhdmlvci5zZXRWaXNpYmxlKHZpc2libGUpXG4gICAgICAgIEBvYmplY3QuaG90c3BvdENvbnRhaW5lci5iZWhhdmlvci5zZXRWaXNpYmxlKHZpc2libGUpXG4gICAgICAgIEBvYmplY3QudGV4dENvbnRhaW5lci5iZWhhdmlvci5zZXRWaXNpYmxlKHZpc2libGUpXG4gICAgICAgIEBvYmplY3QudmlkZW9Db250YWluZXIuYmVoYXZpb3Iuc2V0VmlzaWJsZSh2aXNpYmxlKVxuICAgICAgICBAb2JqZWN0Lm1lc3NhZ2VBcmVhQ29udGFpbmVyLmJlaGF2aW9yLnNldFZpc2libGUodmlzaWJsZSlcbiAgICAgICAgQG9iamVjdC52aWV3cG9ydENvbnRhaW5lci5iZWhhdmlvci5zZXRWaXNpYmxlKHZpc2libGUpXG4gICAgICAgIEBvYmplY3QuY2hhcmFjdGVyQ29udGFpbmVyLmJlaGF2aW9yLnNldFZpc2libGUodmlzaWJsZSlcbiAgICAgICAgQG9iamVjdC5iYWNrZ3JvdW5kQ29udGFpbmVyLmJlaGF2aW9yLnNldFZpc2libGUodmlzaWJsZSlcblxuICAgICAgICBAdmlld3BvcnQ/LnZpc2libGUgPSB2aXNpYmxlXG4gICAgICAgIEBvYmplY3QuY2hvaWNlV2luZG93Py52aXNpYmxlID0gdmlzaWJsZVxuICAgICAgICBAb2JqZWN0LmlucHV0TnVtYmVyQm94Py52aXNpYmxlID0gdmlzaWJsZVxuICAgICAgICBAb2JqZWN0LmlucHV0VGV4dEJveD8udmlzaWJsZSA9IHZpc2libGVcbiAgICAgICAgQG9iamVjdC5pbnB1dFRleHRCb3g/LnVwZGF0ZSgpXG4gICAgICAgIEBvYmplY3QuaW5wdXROdW1iZXJCb3g/LnVwZGF0ZSgpXG4gICAgICAgIEBvYmplY3QuY2hvaWNlV2luZG93Py51cGRhdGUoKVxuXG4gICAgICAgIEdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5ncy5za2lwID0gbm9cblxuICAgICAgICAjaWYgdmlzaWJsZSBhbmQgQG9iamVjdC5jb21tb25FdmVudENvbnRhaW5lci5zdWJPYmplY3RzLmxlbmd0aCA9PSAwXG4gICAgICAgIEBzZXR1cENvbW1vbkV2ZW50cygpXG5cbiAgICAjIyMqXG4gICAgKiBTZXRzIHVwIGNvbW1vbiBldmVudCBoYW5kbGluZy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwQ29tbW9uRXZlbnRzXG4gICAgIyMjXG4gICAgc2V0dXBDb21tb25FdmVudHM6IC0+XG4gICAgICAgIGNvbW1vbkV2ZW50cyA9IEBvYmplY3Quc2NlbmVEYXRhPy5jb21tb25FdmVudHNcblxuICAgICAgICBpZiBjb21tb25FdmVudHNcbiAgICAgICAgICAgIGZvciBldmVudCwgaSBpbiBjb21tb25FdmVudHNcbiAgICAgICAgICAgICAgICBpZiBldmVudCBhbmQgIUBvYmplY3QuY29tbW9uRXZlbnRDb250YWluZXIuc3ViT2JqZWN0cy5maXJzdCgoZSkgLT4gZT8ucmlkID09IGV2ZW50LnJpZClcbiAgICAgICAgICAgICAgICAgICAgQG9iamVjdC5jb21tb25FdmVudENvbnRhaW5lci5zZXRPYmplY3QoZXZlbnQsIGkpXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LmJlaGF2aW9yLnNldHVwRXZlbnRIYW5kbGVycygpXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgZXZlbnQuaW50ZXJwcmV0ZXI/LmlzUnVubmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuZXZlbnRzLmVtaXQoXCJzdGFydFwiLCBldmVudClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgZm9yIGV2ZW50LCBpIGluIEdhbWVNYW5hZ2VyLmNvbW1vbkV2ZW50c1xuICAgICAgICAgICAgICAgIGlmIGV2ZW50IGFuZCAoZXZlbnQucmVjb3JkLnN0YXJ0Q29uZGl0aW9uID09IDEgb3IgZXZlbnQucmVjb3JkLnBhcmFsbGVsKSBhbmQgIUBvYmplY3QuY29tbW9uRXZlbnRDb250YWluZXIuc3ViT2JqZWN0cy5maXJzdCgoZSkgLT4gZT8ucmlkID09IGV2ZW50LnJpZClcbiAgICAgICAgICAgICAgICAgICAgQG9iamVjdC5jb21tb25FdmVudENvbnRhaW5lci5zZXRPYmplY3QoZXZlbnQsIGkpXG5cbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuZXZlbnRzLm9mZkJ5T3duZXIoXCJzdGFydFwiLCBAb2JqZWN0KVxuICAgICAgICAgICAgICAgICAgICBldmVudC5ldmVudHMub2ZmQnlPd25lcihcImZpbmlzaFwiLCBAb2JqZWN0KVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIG5vdCBldmVudC5yZWNvcmQucGFyYWxsZWxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LmV2ZW50cy5vbiBcInN0YXJ0XCIsIGdzLkNhbGxCYWNrKFwib25BdXRvQ29tbW9uRXZlbnRTdGFydFwiLCB0aGlzKSwgbnVsbCwgQG9iamVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuZXZlbnRzLm9uIFwiZmluaXNoXCIsIGdzLkNhbGxCYWNrKFwib25BdXRvQ29tbW9uRXZlbnRGaW5pc2hcIiwgdGhpcyksIG51bGwsIEBvYmplY3RcblxuICAgICAgICAgICAgICAgICAgICBpZiBldmVudC5pbnRlcnByZXRlcj8uaXNSdW5uaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5ldmVudHMuZW1pdChcInN0YXJ0XCIsIGV2ZW50KVxuXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAjIyMqXG4gICAgKiBTZXRzIHVwIG1haW4gaW50ZXJwcmV0ZXIuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cEludGVycHJldGVyXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgc2V0dXBJbnRlcnByZXRlcjogLT5cbiAgICAgICAgQG9iamVjdC5jb21tYW5kcyA9IEBvYmplY3Quc2NlbmVEb2N1bWVudC5pdGVtcy5jb21tYW5kc1xuXG4gICAgICAgIGlmIEBvYmplY3Quc2NlbmVEYXRhLmludGVycHJldGVyXG4gICAgICAgICAgICBAb2JqZWN0LnJlbW92ZUNvbXBvbmVudChAb2JqZWN0LmludGVycHJldGVyKVxuICAgICAgICAgICAgQG9iamVjdC5pbnRlcnByZXRlciA9IEBvYmplY3Quc2NlbmVEYXRhLmludGVycHJldGVyXG4gICAgICAgICAgICBAb2JqZWN0LmFkZENvbXBvbmVudChAb2JqZWN0LmludGVycHJldGVyKVxuICAgICAgICAgICAgI09iamVjdC5taXhpbihAb2JqZWN0LmludGVycHJldGVyLCBAb2JqZWN0LnNjZW5lRGF0YS5pbnRlcnByZXRlciwgZ3MuQ29tcG9uZW50X0NvbW1hbmRJbnRlcnByZXRlci5vYmplY3RDb2RlY0JsYWNrTGlzdClcbiAgICAgICAgICAgIEBvYmplY3QuaW50ZXJwcmV0ZXIuY29udGV4dC5zZXQoQG9iamVjdC5zY2VuZURvY3VtZW50LnVpZCwgQG9iamVjdClcbiAgICAgICAgICAgIEBvYmplY3QuaW50ZXJwcmV0ZXIub2JqZWN0ID0gQG9iamVjdFxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAb2JqZWN0LmludGVycHJldGVyLnNldHVwKClcbiAgICAgICAgICAgIEBvYmplY3QuaW50ZXJwcmV0ZXIuY29udGV4dC5zZXQoQG9iamVjdC5zY2VuZURvY3VtZW50LnVpZCwgQG9iamVjdClcbiAgICAgICAgICAgIEBvYmplY3QuaW50ZXJwcmV0ZXIuc3RhcnQoKVxuXG5cbiAgICAjIyMqXG4gICAgKiBTZXRzIHVwIGNoYXJhY3RlcnMgYW5kIHJlc3RvcmVzIHRoZW0gZnJvbSBsb2FkZWQgc2F2ZSBnYW1lIGlmIG5lY2Vzc2FyeS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwQ2hhcmFjdGVyc1xuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIHNldHVwQ2hhcmFjdGVyczogLT5cbiAgICAgICAgaWYgQG9iamVjdC5zY2VuZURhdGEuY2hhcmFjdGVycz9cbiAgICAgICAgICAgIGZvciBjLCBpIGluIEBvYmplY3Quc2NlbmVEYXRhLmNoYXJhY3RlcnNcbiAgICAgICAgICAgICAgICBAb2JqZWN0LmNoYXJhY3RlckNvbnRhaW5lci5zZXRPYmplY3QoYywgaSlcblxuICAgICAgICBAb2JqZWN0LmN1cnJlbnRDaGFyYWN0ZXIgPSBAb2JqZWN0LnNjZW5lRGF0YS5jdXJyZW50Q2hhcmFjdGVyIHx8IHsgbmFtZTogXCJcIiB9I1JlY29yZE1hbmFnZXIuY2hhcmFjdGVyc1swXVxuXG5cbiAgICAjIyMqXG4gICAgKiBTZXRzIHVwIHZpZXdwb3J0cyBhbmQgcmVzdG9yZXMgdGhlbSBmcm9tIGxvYWRlZCBzYXZlIGdhbWUgaWYgbmVjZXNzYXJ5LlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0dXBWaWV3cG9ydHNcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBzZXR1cFZpZXdwb3J0czogLT5cbiAgICAgICAgdmlld3BvcnRzID0gQG9iamVjdC5zY2VuZURhdGE/LnZpZXdwb3J0cyA/IFtdXG4gICAgICAgIGZvciB2aWV3cG9ydCwgaSBpbiB2aWV3cG9ydHNcbiAgICAgICAgICAgIGlmIHZpZXdwb3J0XG4gICAgICAgICAgICAgICAgQG9iamVjdC52aWV3cG9ydENvbnRhaW5lci5zZXRPYmplY3Qodmlld3BvcnQsIGkpXG4gICAgIyMjKlxuICAgICogU2V0cyB1cCBiYWNrZ3JvdW5kcyBhbmQgcmVzdG9yZXMgdGhlbSBmcm9tIGxvYWRlZCBzYXZlIGdhbWUgaWYgbmVjZXNzYXJ5LlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0dXBCYWNrZ3JvdW5kc1xuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIHNldHVwQmFja2dyb3VuZHM6IC0+XG4gICAgICAgIGJhY2tncm91bmRzID0gQG9iamVjdC5zY2VuZURhdGE/LmJhY2tncm91bmRzID8gW11cbiAgICAgICAgZm9yIGIsIGkgaW4gYmFja2dyb3VuZHNcbiAgICAgICAgICAgIEBvYmplY3QuYmFja2dyb3VuZENvbnRhaW5lci5zZXRPYmplY3QoYiwgaSlcblxuICAgICMjIypcbiAgICAqIFNldHMgdXAgcGljdHVyZXMgYW5kIHJlc3RvcmVzIHRoZW0gZnJvbSBsb2FkZWQgc2F2ZSBnYW1lIGlmIG5lY2Vzc2FyeS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwUGljdHVyZXNcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBzZXR1cFBpY3R1cmVzOiAtPlxuICAgICAgICBwaWN0dXJlcyA9IEBvYmplY3Quc2NlbmVEYXRhPy5waWN0dXJlcyA/IHt9XG4gICAgICAgIGZvciBkb21haW4gb2YgcGljdHVyZXNcbiAgICAgICAgICAgIEBvYmplY3QucGljdHVyZUNvbnRhaW5lci5iZWhhdmlvci5jaGFuZ2VEb21haW4oZG9tYWluKVxuICAgICAgICAgICAgaWYgcGljdHVyZXNbZG9tYWluXSB0aGVuIGZvciBwaWN0dXJlLCBpIGluIHBpY3R1cmVzW2RvbWFpbl1cbiAgICAgICAgICAgICAgICBAb2JqZWN0LnBpY3R1cmVDb250YWluZXIuc2V0T2JqZWN0KHBpY3R1cmUsIGkpXG4gICAgICAgICAgICAgICAgaWYgcGljdHVyZT8uaW1hZ2VcbiAgICAgICAgICAgICAgICAgICAgcGF0aCA9IFwiI3twaWN0dXJlLmltYWdlRm9sZGVyID8gXCJHcmFwaGljcy9QaWN0dXJlc1wifS8je3BpY3R1cmUuaW1hZ2V9XCJcbiAgICAgICAgICAgICAgICAgICAgQHJlc291cmNlQ29udGV4dC5hZGQocGF0aCwgUmVzb3VyY2VNYW5hZ2VyLnJlc291cmNlc0J5UGF0aFtwYXRoXSlcblxuICAgICMjIypcbiAgICAqIFNldHMgdXAgdGV4dHMgYW5kIHJlc3RvcmVzIHRoZW0gZnJvbSBsb2FkZWQgc2F2ZSBnYW1lIGlmIG5lY2Vzc2FyeS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwVGV4dHNcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBzZXR1cFRleHRzOiAtPlxuICAgICAgICB0ZXh0cyA9IEBvYmplY3Quc2NlbmVEYXRhPy50ZXh0cyA/IHt9XG4gICAgICAgIGZvciBkb21haW4gb2YgdGV4dHNcbiAgICAgICAgICAgIEBvYmplY3QudGV4dENvbnRhaW5lci5iZWhhdmlvci5jaGFuZ2VEb21haW4oZG9tYWluKVxuICAgICAgICAgICAgaWYgdGV4dHNbZG9tYWluXSB0aGVuIGZvciB0ZXh0LCBpIGluIHRleHRzW2RvbWFpbl1cbiAgICAgICAgICAgICAgICBAb2JqZWN0LnRleHRDb250YWluZXIuc2V0T2JqZWN0KHRleHQsIGkpXG5cbiAgICAjIyMqXG4gICAgKiBTZXRzIHVwIHZpZGVvcyBhbmQgcmVzdG9yZXMgdGhlbSBmcm9tIGxvYWRlZCBzYXZlIGdhbWUgaWYgbmVjZXNzYXJ5LlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0dXBWaWRlb3NcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBzZXR1cFZpZGVvczogLT5cbiAgICAgICAgdmlkZW9zID0gQG9iamVjdC5zY2VuZURhdGE/LnZpZGVvcyA/IHt9XG4gICAgICAgIGZvciBkb21haW4gb2YgdmlkZW9zXG4gICAgICAgICAgICBAb2JqZWN0LnZpZGVvQ29udGFpbmVyLmJlaGF2aW9yLmNoYW5nZURvbWFpbihkb21haW4pXG4gICAgICAgICAgICBpZiB2aWRlb3NbZG9tYWluXSB0aGVuIGZvciB2aWRlbywgaSBpbiB2aWRlb3NbZG9tYWluXVxuICAgICAgICAgICAgICAgIGlmIHZpZGVvXG4gICAgICAgICAgICAgICAgICAgIHBhdGggPSBcIiN7dmlkZW8udmlkZW9Gb2xkZXIgPyBcIk1vdmllc1wifS8je3ZpZGVvLnZpZGVvfVwiXG4gICAgICAgICAgICAgICAgICAgIEByZXNvdXJjZUNvbnRleHQuYWRkKHBhdGgsIFJlc291cmNlTWFuYWdlci5yZXNvdXJjZXNCeVBhdGhbcGF0aF0pXG4gICAgICAgICAgICAgICAgICAgIHZpZGVvLnZpc2libGUgPSB5ZXNcbiAgICAgICAgICAgICAgICAgICAgdmlkZW8udXBkYXRlKClcblxuICAgICAgICAgICAgICAgIEBvYmplY3QudmlkZW9Db250YWluZXIuc2V0T2JqZWN0KHZpZGVvLCBpKVxuXG4gICAgIyMjKlxuICAgICogU2V0cyB1cCBob3RzcG90cyBhbmQgcmVzdG9yZXMgdGhlbSBmcm9tIGxvYWRlZCBzYXZlIGdhbWUgaWYgbmVjZXNzYXJ5LlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0dXBIb3RzcG90c1xuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIHNldHVwSG90c3BvdHM6IC0+XG4gICAgICAgIGhvdHNwb3RzID0gQG9iamVjdC5zY2VuZURhdGE/LmhvdHNwb3RzID8ge31cbiAgICAgICAgZm9yIGRvbWFpbiBvZiBob3RzcG90c1xuICAgICAgICAgICAgQG9iamVjdC5ob3RzcG90Q29udGFpbmVyLmJlaGF2aW9yLmNoYW5nZURvbWFpbihkb21haW4pXG4gICAgICAgICAgICBpZiBob3RzcG90c1tkb21haW5dIHRoZW4gZm9yIGhvdHNwb3QsIGkgaW4gaG90c3BvdHNbZG9tYWluXVxuICAgICAgICAgICAgICAgIEBvYmplY3QuaG90c3BvdENvbnRhaW5lci5zZXRPYmplY3QoaG90c3BvdCwgaSlcblxuICAgICMjIypcbiAgICAqIFNldHMgdXAgbGF5b3V0LlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0dXBMYXlvdXRcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBzZXR1cExheW91dDogLT5cbiAgICAgICAgQGRhdGFGaWVsZHMgPSB1aS5VSU1hbmFnZXIuZGF0YVNvdXJjZXNbdWkuVWlGYWN0b3J5LmxheW91dHMuZ2FtZUxheW91dC5kYXRhU291cmNlIHx8IFwiZGVmYXVsdFwiXSgpXG4gICAgICAgIEBkYXRhRmllbGRzLnNjZW5lID0gQG9iamVjdFxuICAgICAgICB3aW5kb3cuJGRhdGFGaWVsZHMgPSBAZGF0YUZpZWxkc1xuICAgICAgICBhZHZWaXNpYmxlID0gQG9iamVjdC5tZXNzYWdlTW9kZSA9PSB2bi5NZXNzYWdlTW9kZS5BRFZcblxuICAgICAgICBAb2JqZWN0LmxheW91dCA9IHVpLlVpRmFjdG9yeS5jcmVhdGVGcm9tRGVzY3JpcHRvcih1aS5VaUZhY3RvcnkubGF5b3V0cy5nYW1lTGF5b3V0LCBAb2JqZWN0KVxuICAgICAgICBAb2JqZWN0LmxheW91dC52aXNpYmxlID0gYWR2VmlzaWJsZVxuICAgICAgICAkZ2FtZU1lc3NhZ2VfbWVzc2FnZS52aXNpYmxlID0gYWR2VmlzaWJsZVxuICAgICAgICBAb2JqZWN0LmxheW91dC51aS5wcmVwYXJlKClcblxuICAgICAgICBAb2JqZWN0LmNob2ljZXMgPSBAb2JqZWN0LnNjZW5lRGF0YT8uY2hvaWNlcyB8fCBAb2JqZWN0LmNob2ljZXNcbiAgICAgICAgaWYgQG9iamVjdC5jaG9pY2VzPy5sZW5ndGggPiAwXG4gICAgICAgICAgICBAc2hvd0Nob2ljZXMoZ3MuQ2FsbEJhY2soXCJvbkNob2ljZUFjY2VwdFwiLCBAb2JqZWN0LmNob2ljZXNbMF0uaW50ZXJwcmV0ZXIgfHwgQG9iamVjdC5pbnRlcnByZXRlciwgeyBwb2ludGVyOiBAb2JqZWN0LmludGVycHJldGVyLnBvaW50ZXIsIHBhcmFtczogQHBhcmFtcyB9KSlcblxuICAgICAgICBpZiBAb2JqZWN0LmludGVycHJldGVyLndhaXRpbmdGb3IuaW5wdXROdW1iZXJcbiAgICAgICAgICAgIEBzaG93SW5wdXROdW1iZXIoR2FtZU1hbmFnZXIudGVtcEZpZWxkcy5kaWdpdHMsIGdzLkNhbGxCYWNrKFwib25JbnB1dE51bWJlckZpbmlzaFwiLCBAb2JqZWN0LmludGVycHJldGVyLCBAb2JqZWN0LmludGVycHJldGVyKSlcblxuICAgICAgICBpZiBAb2JqZWN0LmludGVycHJldGVyLndhaXRpbmdGb3IuaW5wdXRUZXh0XG4gICAgICAgICAgICBAc2hvd0lucHV0VGV4dChHYW1lTWFuYWdlci50ZW1wRmllbGRzLmxldHRlcnMsIGdzLkNhbGxCYWNrKFwib25JbnB1dFRleHRGaW5pc2hcIiwgQG9iamVjdC5pbnRlcnByZXRlciwgQG9iamVjdC5pbnRlcnByZXRlcikpXG5cbiAgICAjIyMqXG4gICAgKiBTZXRzIHVwIHRoZSBtYWluIHZpZXdwb3J0IC8gc2NyZWVuIHZpZXdwb3J0LlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0dXBNYWluVmlld3BvcnRcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBzZXR1cE1haW5WaWV3cG9ydDogLT5cbiAgICAgICAgaWYgIUBvYmplY3Quc2NlbmVEYXRhLnZpZXdwb3J0XG4gICAgICAgICAgICBpZiBTY2VuZU1hbmFnZXIucHJldmlvdXNTY2VuZXMubGVuZ3RoID09IDAgXG4gICAgICAgICAgICAgICAgR2FtZU1hbmFnZXIuc2NlbmVWaWV3cG9ydC5kaXNwb3NlKClcbiAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnNjZW5lVmlld3BvcnQgPSBuZXcgZ3MuT2JqZWN0X1ZpZXdwb3J0KG5ldyBWaWV3cG9ydCgwLCAwLCBHcmFwaGljcy53aWR0aCwgR3JhcGhpY3MuaGVpZ2h0LCBHcmFwaGljcy52aWV3cG9ydCkpXG4gICAgICAgICAgICBAdmlld3BvcnQgPSBHYW1lTWFuYWdlci5zY2VuZVZpZXdwb3J0LnZpc3VhbC52aWV3cG9ydFxuICAgICAgICAgICAgQG9iamVjdC52aWV3cG9ydCA9IEdhbWVNYW5hZ2VyLnNjZW5lVmlld3BvcnRcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgR2FtZU1hbmFnZXIuc2NlbmVWaWV3cG9ydC5kaXNwb3NlKClcbiAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnNjZW5lVmlld3BvcnQgPSBAb2JqZWN0LnNjZW5lRGF0YS52aWV3cG9ydFxuICAgICAgICAgICAgQG9iamVjdC52aWV3cG9ydCA9IEBvYmplY3Quc2NlbmVEYXRhLnZpZXdwb3J0XG4gICAgICAgICAgICBAdmlld3BvcnQgPSBAb2JqZWN0LnZpZXdwb3J0LnZpc3VhbC52aWV3cG9ydFxuICAgICAgICAgICAgQHZpZXdwb3J0LnZpZXdwb3J0ID0gR3JhcGhpY3Mudmlld3BvcnRcblxuICAgICMjIypcbiAgICAqIFNldHMgdXAgc2NyZWVuLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0dXBTY3JlZW5cbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBzZXR1cFNjcmVlbjogLT5cbiAgICAgICAgaWYgQG9iamVjdC5zY2VuZURhdGEuc2NyZWVuXG4gICAgICAgICAgICBAb2JqZWN0LnZpZXdwb3J0LnJlc3RvcmUoQG9iamVjdC5zY2VuZURhdGEuc2NyZWVuKVxuXG4gICAgIyMjKlxuICAgICogUmVzdG9yZXMgbWFpbiBpbnRlcnByZXRlciBmcm9tIGxvYWRlZCBzYXZlIGdhbWUuXG4gICAgKlxuICAgICogQG1ldGhvZCByZXN0b3JlSW50ZXJwcmV0ZXJcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICByZXN0b3JlSW50ZXJwcmV0ZXI6IC0+XG4gICAgICAgIGlmIEBvYmplY3Quc2NlbmVEYXRhLmludGVycHJldGVyXG4gICAgICAgICAgICBAb2JqZWN0LmludGVycHJldGVyLnJlc3RvcmUoKVxuXG4gICAgIyMjKlxuICAgICogUmVzdG9yZXMgbWVzc2FnZSBib3ggZnJvbSBsb2FkZWQgc2F2ZSBnYW1lLlxuICAgICpcbiAgICAqIEBtZXRob2QgcmVzdG9yZU1lc3NhZ2VCb3hcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICByZXN0b3JlTWVzc2FnZUJveDogLT5cbiAgICAgICAgbWVzc2FnZUJveGVzID0gQG9iamVjdC5zY2VuZURhdGE/Lm1lc3NhZ2VCb3hlc1xuICAgICAgICBpZiBtZXNzYWdlQm94ZXNcbiAgICAgICAgICAgIGZvciBtZXNzYWdlQm94IGluIG1lc3NhZ2VCb3hlc1xuICAgICAgICAgICAgICAgIG1lc3NhZ2VPYmplY3QgPSBncy5PYmplY3RNYW5hZ2VyLmN1cnJlbnQub2JqZWN0QnlJZChtZXNzYWdlQm94LmlkKVxuICAgICAgICAgICAgICAgIG1lc3NhZ2VPYmplY3QudmlzaWJsZSA9IG1lc3NhZ2VCb3gudmlzaWJsZVxuICAgICAgICAgICAgICAgIGlmIG1lc3NhZ2VCb3gubWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlQm94Lm1lc3NhZ2UudGV4dFJlbmRlcmVyLmRpc3Bvc2VFdmVudEhhbmRsZXJzKClcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IGdzLk9iamVjdE1hbmFnZXIuY3VycmVudC5vYmplY3RCeUlkKG1lc3NhZ2VCb3gubWVzc2FnZS5pZClcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZS50ZXh0UmVuZGVyZXIuZGlzcG9zZSgpXG5cbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0Lm1peGluKG1lc3NhZ2UsIG1lc3NhZ2VCb3gubWVzc2FnZSwgdWkuT2JqZWN0X01lc3NhZ2Uub2JqZWN0Q29kZWNCbGFja0xpc3QuY29uY2F0KFtcIm9yaWdpblwiXSkpXG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIGMgaW4gbWVzc2FnZS5jb21wb25lbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICBjLm9iamVjdCA9IG1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZS50ZXh0UmVuZGVyZXIuc2V0dXBFdmVudEhhbmRsZXJzKClcblxuICAgICMjIypcbiAgICAqIFJlc3RvcmVzIG1lc3NhZ2UgZnJvbSBsb2FkZWQgc2F2ZSBnYW1lLlxuICAgICpcbiAgICAqIEBtZXRob2QgcmVzdG9yZU1lc3NhZ2VzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgcmVzdG9yZU1lc3NhZ2VzOiAtPlxuICAgICAgICBpZiBAb2JqZWN0LnNjZW5lRGF0YT8ubWVzc2FnZUFyZWFzXG4gICAgICAgICAgICBmb3IgZG9tYWluIG9mIEBvYmplY3Quc2NlbmVEYXRhLm1lc3NhZ2VBcmVhc1xuICAgICAgICAgICAgICAgIEBvYmplY3QubWVzc2FnZUFyZWFDb250YWluZXIuYmVoYXZpb3IuY2hhbmdlRG9tYWluKGRvbWFpbilcbiAgICAgICAgICAgICAgICBtZXNzYWdlQXJlYXMgPSBAb2JqZWN0LnNjZW5lRGF0YS5tZXNzYWdlQXJlYXNcbiAgICAgICAgICAgICAgICBpZiBtZXNzYWdlQXJlYXNbZG9tYWluXSB0aGVuIGZvciBhcmVhLCBpIGluIG1lc3NhZ2VBcmVhc1tkb21haW5dXG4gICAgICAgICAgICAgICAgICAgIGlmIGFyZWFcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VBcmVhID0gbmV3IGdzLk9iamVjdF9NZXNzYWdlQXJlYSgpXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlTGF5b3V0ID0gdWkuVUlNYW5hZ2VyLmNyZWF0ZUNvbnRyb2xGcm9tRGVzY3JpcHRvcih0eXBlOiBcInVpLkN1c3RvbUdhbWVNZXNzYWdlXCIsIGlkOiBcImN1c3RvbUdhbWVNZXNzYWdlX1wiK2ksIHBhcmFtczogeyBpZDogXCJjdXN0b21HYW1lTWVzc2FnZV9cIitpIH0sIG1lc3NhZ2VBcmVhKVxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IGdzLk9iamVjdE1hbmFnZXIuY3VycmVudC5vYmplY3RCeUlkKFwiY3VzdG9tR2FtZU1lc3NhZ2VfXCIraStcIl9tZXNzYWdlXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmVhLm1lc3NhZ2UudGV4dFJlbmRlcmVyLmRpc3Bvc2VFdmVudEhhbmRsZXJzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlLnRleHRSZW5kZXJlci5kaXNwb3NlKClcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5taXhpbihtZXNzYWdlLCBhcmVhLm1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgYyBpbiBtZXNzYWdlLmNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLm9iamVjdCA9IG1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgICNtZXNzYWdlLnJlc3RvcmUoZi5tZXNzYWdlKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlTGF5b3V0LmRzdFJlY3QueCA9IGFyZWEubGF5b3V0LmRzdFJlY3QueFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZUxheW91dC5kc3RSZWN0LnkgPSBhcmVhLmxheW91dC5kc3RSZWN0LnlcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VMYXlvdXQuZHN0UmVjdC53aWR0aCA9IGFyZWEubGF5b3V0LmRzdFJlY3Qud2lkdGhcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VMYXlvdXQuZHN0UmVjdC5oZWlnaHQgPSBhcmVhLmxheW91dC5kc3RSZWN0LmhlaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZUxheW91dC5uZWVkc1VwZGF0ZSA9IHllc1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZS50ZXh0UmVuZGVyZXIuc2V0dXBFdmVudEhhbmRsZXJzKClcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VMYXlvdXQudXBkYXRlKClcblxuICAgICAgICAgICAgICAgICAgICAgICAgI21lc3NhZ2UubWVzc2FnZS5yZXN0b3JlTWVzc2FnZXMoZi5tZXNzYWdlcylcbiAgICAgICAgICAgICAgICAgICAgICAgICNtZXNzYWdlLnRleHRSZW5kZXJlci5yZXN0b3JlKGYudGV4dFJlbmRlcmVyKVxuICAgICAgICAgICAgICAgICAgICAgICAgI21lc3NhZ2UudmlzaWJsZSA9IHllc1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZUFyZWEubWVzc2FnZSA9IG1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VBcmVhLmxheW91dCA9IG1lc3NhZ2VMYXlvdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VBcmVhLmFkZE9iamVjdChtZXNzYWdlTGF5b3V0KVxuICAgICAgICAgICAgICAgICAgICAgICAgQG9iamVjdC5tZXNzYWdlQXJlYUNvbnRhaW5lci5zZXRPYmplY3QobWVzc2FnZUFyZWEsIGkpXG5cblxuXG5cblxuICAgICMjIypcbiAgICAqIFJlc3RvcmVzIGF1ZGlvLXBsYXliYWNrIGZyb20gbG9hZGVkIHNhdmUgZ2FtZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHJlc3RvcmVBdWRpb1BsYXliYWNrXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgcmVzdG9yZUF1ZGlvUGxheWJhY2s6IC0+XG4gICAgICAgIGlmIEBvYmplY3Quc2NlbmVEYXRhLmF1ZGlvXG4gICAgICAgICAgICBBdWRpb01hbmFnZXIuYXVkaW9CdWZmZXJzLnB1c2goYikgZm9yIGIgaW4gQG9iamVjdC5zY2VuZURhdGEuYXVkaW8uYXVkaW9CdWZmZXJzXG4gICAgICAgICAgICBBdWRpb01hbmFnZXIuYXVkaW9CdWZmZXJzQnlMYXllciA9IEBvYmplY3Quc2NlbmVEYXRhLmF1ZGlvLmF1ZGlvQnVmZmVyc0J5TGF5ZXJcbiAgICAgICAgICAgIEF1ZGlvTWFuYWdlci5hdWRpb0xheWVycyA9IEBvYmplY3Quc2NlbmVEYXRhLmF1ZGlvLmF1ZGlvTGF5ZXJzXG4gICAgICAgICAgICBBdWRpb01hbmFnZXIuc291bmRSZWZlcmVuY2VzID0gQG9iamVjdC5zY2VuZURhdGEuYXVkaW8uc291bmRSZWZlcmVuY2VzXG5cblxuICAgICMjIypcbiAgICAqIFJlc3RvcmVzIHRoZSBzY2VuZSBvYmplY3RzIGZyb20gdGhlIGN1cnJlbnQgbG9hZGVkIHNhdmUtZ2FtZS4gSWYgbm8gc2F2ZS1nYW1lIGlzXG4gICAgKiBwcmVzZW50IGluIEdhbWVNYW5hZ2VyLmxvYWRlZFNhdmVHYW1lLCBub3RoaW5nIHdpbGwgaGFwcGVuLlxuICAgICpcbiAgICAqIEBtZXRob2QgcmVzdG9yZVNjZW5lXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgcmVzdG9yZVNjZW5lOiAtPlxuICAgICAgICBzYXZlR2FtZSA9IEdhbWVNYW5hZ2VyLmxvYWRlZFNhdmVHYW1lXG4gICAgICAgIGlmIHNhdmVHYW1lXG4gICAgICAgICAgICBjb250ZXh0ID0gbmV3IGdzLk9iamVjdENvZGVjQ29udGV4dChbR3JhcGhpY3Mudmlld3BvcnQsIEBvYmplY3QsIHRoaXNdLCBzYXZlR2FtZS5lbmNvZGVkT2JqZWN0U3RvcmUsIG51bGwpXG4gICAgICAgICAgICBzYXZlR2FtZS5kYXRhID0gZ3MuT2JqZWN0Q29kZWMuZGVjb2RlKHNhdmVHYW1lLmRhdGEsIGNvbnRleHQpXG4gICAgICAgICAgICBmb3IgYyBpbiBzYXZlR2FtZS5kYXRhLmNoYXJhY3Rlck5hbWVzXG4gICAgICAgICAgICAgICAgaWYgYyB0aGVuIFJlY29yZE1hbmFnZXIuY2hhcmFjdGVyc1tjLmluZGV4XT8ubmFtZSA9IGMubmFtZVxuICAgICAgICAgICAgR2FtZU1hbmFnZXIucmVzdG9yZShzYXZlR2FtZSlcbiAgICAgICAgICAgIGdzLk9iamVjdENvZGVjLm9uUmVzdG9yZShzYXZlR2FtZS5kYXRhLCBjb250ZXh0KVxuICAgICAgICAgICAgQHJlc291cmNlQ29udGV4dC5mcm9tRGF0YUJ1bmRsZShzYXZlR2FtZS5kYXRhLnJlc291cmNlQ29udGV4dCwgUmVzb3VyY2VNYW5hZ2VyLnJlc291cmNlc0J5UGF0aClcblxuICAgICAgICAgICAgQG9iamVjdC5zY2VuZURhdGEgPSBzYXZlR2FtZS5kYXRhXG4gICAgICAgICAgICBHcmFwaGljcy5mcmFtZUNvdW50ID0gc2F2ZUdhbWUuZGF0YS5mcmFtZUNvdW50XG5cbiAgICAjIyMqXG4gICAgKiBQcmVwYXJlcyBhbGwgZGF0YSBmb3IgdGhlIHNjZW5lIGFuZCBsb2FkcyB0aGUgbmVjZXNzYXJ5IGdyYXBoaWMgYW5kIGF1ZGlvIHJlc291cmNlcy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHByZXBhcmVEYXRhXG4gICAgKiBAYWJzdHJhY3RcbiAgICAjIyNcbiAgICBwcmVwYXJlRGF0YTogLT5cbiAgICAgICAgI1JlY29yZE1hbmFnZXIudHJhbnNsYXRlKClcblxuICAgICAgICBHYW1lTWFuYWdlci5zY2VuZSA9IEBvYmplY3RcblxuICAgICAgICBncy5PYmplY3RNYW5hZ2VyLmN1cnJlbnQgPSBAb2JqZWN0TWFuYWdlclxuXG4gICAgICAgIEBvYmplY3Quc2NlbmVEYXRhLnVpZCA9IEBvYmplY3Quc2NlbmVEb2N1bWVudC51aWRcblxuICAgICAgICBpZiAhUmVzb3VyY2VMb2FkZXIubG9hZEV2ZW50Q29tbWFuZHNEYXRhKEBvYmplY3Quc2NlbmVEb2N1bWVudC5pdGVtcy5jb21tYW5kcylcbiAgICAgICAgICAgIFJlc291cmNlTG9hZGVyLmxvYWRFdmVudENvbW1hbmRzR3JhcGhpY3MoQG9iamVjdC5zY2VuZURvY3VtZW50Lml0ZW1zLmNvbW1hbmRzKVxuICAgICAgICAgICAgR2FtZU1hbmFnZXIuYmFja2xvZyA9IEBvYmplY3Quc2NlbmVEYXRhLmJhY2tsb2cgfHwgR2FtZU1hbmFnZXIuc2NlbmVEYXRhLmJhY2tsb2cgfHwgW11cblxuICAgICAgICAgICAgUmVzb3VyY2VMb2FkZXIubG9hZFN5c3RlbVNvdW5kcygpXG4gICAgICAgICAgICBSZXNvdXJjZUxvYWRlci5sb2FkU3lzdGVtR3JhcGhpY3MoKVxuICAgICAgICAgICAgUmVzb3VyY2VMb2FkZXIubG9hZFVpVHlwZXNHcmFwaGljcyh1aS5VaUZhY3RvcnkuY3VzdG9tVHlwZXMpXG4gICAgICAgICAgICBSZXNvdXJjZUxvYWRlci5sb2FkVWlMYXlvdXRHcmFwaGljcyh1aS5VaUZhY3RvcnkubGF5b3V0cy5nYW1lTGF5b3V0KVxuXG4gICAgICAgICAgICBpZiBAZGF0YUZpZWxkcz9cbiAgICAgICAgICAgICAgICBSZXNvdXJjZUxvYWRlci5sb2FkVWlEYXRhRmllbGRzR3JhcGhpY3MoQGRhdGFGaWVsZHMpXG5cbiAgICAgICAgICAgICR0ZW1wRmllbGRzLmNob2ljZVRpbWVyID0gQG9iamVjdC5jaG9pY2VUaW1lclxuXG4gICAgICAgICAgICBHYW1lTWFuYWdlci52YXJpYWJsZVN0b3JlLnNldHVwKHsgaWQ6IEBvYmplY3Quc2NlbmVEb2N1bWVudC51aWR9KVxuXG4gICAgIyMjKlxuICAgICogUHJlcGFyZXMgYWxsIHZpc3VhbCBnYW1lIG9iamVjdCBmb3IgdGhlIHNjZW5lLlxuICAgICpcbiAgICAqIEBtZXRob2QgcHJlcGFyZVZpc3VhbFxuICAgICMjI1xuICAgIHByZXBhcmVWaXN1YWw6IC0+XG4gICAgICAgIGlmIEBvYmplY3QubGF5b3V0XG4gICAgICAgICAgICBAdHJhbnNpdGlvbih7IGR1cmF0aW9uOiAwIH0pXG4gICAgICAgICAgICByZXR1cm5cblxuICAgICAgICBpZiBHYW1lTWFuYWdlci50ZW1wRmllbGRzLmlzRXhpdGluZ0dhbWVcbiAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnRlbXBGaWVsZHMuaXNFeGl0aW5nR2FtZSA9IG5vXG4gICAgICAgICAgICBncy5HYW1lTm90aWZpZXIucG9zdFJlc2V0U2NlbmVDaGFuZ2UoQG9iamVjdC5zY2VuZURvY3VtZW50Lml0ZW1zLm5hbWUpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGdzLkdhbWVOb3RpZmllci5wb3N0U2NlbmVDaGFuZ2UoQG9iamVjdC5zY2VuZURvY3VtZW50Lml0ZW1zLm5hbWUpXG5cbiAgICAgICAgQHJlc3RvcmVTY2VuZSgpXG4gICAgICAgIEBvYmplY3QubWVzc2FnZU1vZGUgPSBAb2JqZWN0LnNjZW5lRGF0YS5tZXNzYWdlTW9kZSA/IHZuLk1lc3NhZ2VNb2RlLkFEVlxuICAgICAgICBAc2V0dXBNYWluVmlld3BvcnQoKVxuICAgICAgICBAc2V0dXBWaWV3cG9ydHMoKVxuICAgICAgICBAc2V0dXBDaGFyYWN0ZXJzKClcbiAgICAgICAgQHNldHVwQmFja2dyb3VuZHMoKVxuICAgICAgICBAc2V0dXBQaWN0dXJlcygpXG4gICAgICAgIEBzZXR1cFRleHRzKClcbiAgICAgICAgQHNldHVwVmlkZW9zKClcbiAgICAgICAgQHNldHVwSG90c3BvdHMoKVxuICAgICAgICBAc2V0dXBJbnRlcnByZXRlcigpXG4gICAgICAgIEBzZXR1cExheW91dCgpXG4gICAgICAgIEBzZXR1cENvbW1vbkV2ZW50cygpXG5cbiAgICAgICAgQHJlc3RvcmVNZXNzYWdlQm94KClcbiAgICAgICAgQHJlc3RvcmVJbnRlcnByZXRlcigpXG4gICAgICAgIEByZXN0b3JlTWVzc2FnZXMoKVxuICAgICAgICBAcmVzdG9yZUF1ZGlvUGxheWJhY2soKVxuXG4gICAgICAgIEBzaG93KHRydWUpXG5cbiAgICAgICAgQG9iamVjdC5zY2VuZURhdGEgPSB7fVxuICAgICAgICBHYW1lTWFuYWdlci5zY2VuZURhdGEgPSB7fVxuXG4gICAgICAgIEdyYXBoaWNzLnVwZGF0ZSgpXG4gICAgICAgIEB0cmFuc2l0aW9uKHsgZHVyYXRpb246IDAgfSlcblxuXG4gICAgIyMjKlxuICAgICogQWRkcyBhIG5ldyBjaGFyYWN0ZXIgdG8gdGhlIHNjZW5lLlxuICAgICpcbiAgICAqIEBtZXRob2QgYWRkQ2hhcmFjdGVyXG4gICAgKiBAcGFyYW0ge3ZuLk9iamVjdF9DaGFyYWN0ZXJ9IGNoYXJhY3RlciAtIFRoZSBjaGFyYWN0ZXIgdG8gYWRkLlxuICAgICogQHBhcmFtIHtib29sZWFufSBub0FuaW1hdGlvbiAtIEluZGljYXRlcyBpZiB0aGUgY2hhcmFjdGVyIHNob3VsZCBiZSBhZGRlZCBpbW1lZGlhdGVseSB3aXRvdXQgYW55IGFwcGVhci1hbmltYXRpb24uXG4gICAgKiBAcGFyYW0ge09iamVjdH0gYW5pbWF0aW9uRGF0YSAtIENvbnRhaW5zIHRoZSBhcHBlYXItYW5pbWF0aW9uIGRhdGEgLT4geyBhbmltYXRpb24sIGVhc2luZywgZHVyYXRpb24gfS5cbiAgICAjIyNcbiAgICBhZGRDaGFyYWN0ZXI6IChjaGFyYWN0ZXIsIG5vQW5pbWF0aW9uLCBhbmltYXRpb25EYXRhKSAtPlxuICAgICAgICB1bmxlc3Mgbm9BbmltYXRpb25cbiAgICAgICAgICAgIGNoYXJhY3Rlci5tb3Rpb25CbHVyLnNldChhbmltYXRpb25EYXRhLm1vdGlvbkJsdXIpXG5cbiAgICAgICAgICAgIGlmIGFuaW1hdGlvbkRhdGEuZHVyYXRpb24gPiAwXG4gICAgICAgICAgICAgICAgY2hhcmFjdGVyLmFuaW1hdG9yLmFwcGVhcihjaGFyYWN0ZXIuZHN0UmVjdC54LCBjaGFyYWN0ZXIuZHN0UmVjdC55LCBhbmltYXRpb25EYXRhLmFuaW1hdGlvbiwgYW5pbWF0aW9uRGF0YS5lYXNpbmcsIGFuaW1hdGlvbkRhdGEuZHVyYXRpb24pIHVubGVzcyBub0FuaW1hdGlvblxuXG4gICAgICAgIGNoYXJhY3Rlci52aWV3cG9ydCA9IEB2aWV3cG9ydFxuICAgICAgICBjaGFyYWN0ZXIudmlzaWJsZSA9IHllc1xuXG4gICAgICAgIEBvYmplY3QuY2hhcmFjdGVyQ29udGFpbmVyLmFkZE9iamVjdChjaGFyYWN0ZXIpXG5cbiAgICAjIyMqXG4gICAgKiBSZW1vdmVzIGEgY2hhcmFjdGVyIGZyb20gdGhlIHNjZW5lLlxuICAgICpcbiAgICAqIEBtZXRob2QgcmVtb3ZlQ2hhcmFjdGVyXG4gICAgKiBAcGFyYW0ge3ZuLk9iamVjdF9DaGFyYWN0ZXJ9IGNoYXJhY3RlciAtIFRoZSBjaGFyYWN0ZXIgdG8gcmVtb3ZlLlxuICAgICogQHBhcmFtIHtib29sZWFufSBub0FuaW1hdGlvbiAtIEluZGljYXRlcyBpZiB0aGUgY2hhcmFjdGVyIHNob3VsZCBiZSBkaXNwb3NlZCBpbW1lZGlhdGVseSB3aXRvdXQgYW55IGRpc2FwZWFyLWFuaW1hdGlvbi5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBhbmltYXRpb25EYXRhIC0gQ29udGFpbnMgdGhlIGRpc2FwcGVhci1hbmltYXRpb24gZGF0YSAtPiB7IGFuaW1hdGlvbiwgZWFzaW5nLCBkdXJhdGlvbiB9LlxuICAgICMjI1xuICAgIHJlbW92ZUNoYXJhY3RlcjogKGNoYXJhY3Rlciwgbm9BbmltYXRpb24sIGFuaW1hdGlvbkRhdGEpIC0+XG4gICAgICAgIHVubGVzcyBub0FuaW1hdGlvblxuICAgICAgICAgICAgY2hhcmFjdGVyPy5hbmltYXRvci5kaXNhcHBlYXIoYW5pbWF0aW9uRGF0YS5hbmltYXRpb24sIGFuaW1hdGlvbkRhdGEuZWFzaW5nLCBhbmltYXRpb25EYXRhLmR1cmF0aW9uLCAoc2VuZGVyKSAtPiBzZW5kZXIuZGlzcG9zZSgpKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBjaGFyYWN0ZXI/LmRpc3Bvc2UoKVxuXG4gICAgIyMjKlxuICAgICogUmVzdW1lcyB0aGUgY3VycmVudCBzY2VuZSBpZiBpdCBoYXMgYmVlbiBwYXVzZWQuXG4gICAgKlxuICAgICogQG1ldGhvZCByZXN1bWVTY2VuZVxuICAgICMjI1xuICAgIHJlc3VtZVNjZW5lOiAtPlxuICAgICAgICBAb2JqZWN0LnBpY3R1cmVDb250YWluZXIuYWN0aXZlID0geWVzXG4gICAgICAgIEBvYmplY3QuY2hhcmFjdGVyQ29udGFpbmVyLmFjdGl2ZSA9IHllc1xuICAgICAgICBAb2JqZWN0LmJhY2tncm91bmRDb250YWluZXIuYWN0aXZlID0geWVzXG4gICAgICAgIEBvYmplY3QudGV4dENvbnRhaW5lci5hY3RpdmUgPSB5ZXNcbiAgICAgICAgQG9iamVjdC5ob3RzcG90Q29udGFpbmVyLmFjdGl2ZSA9IHllc1xuICAgICAgICBAb2JqZWN0LnZpZGVvQ29udGFpbmVyLmFjdGl2ZSA9IHllc1xuXG4gICAgICAgIG1lc3NhZ2UgPSBncy5PYmplY3RNYW5hZ2VyLmN1cnJlbnQub2JqZWN0QnlJZChcImdhbWVNZXNzYWdlX21lc3NhZ2VcIilcbiAgICAgICAgbWVzc2FnZS5hY3RpdmUgPSB5ZXNcblxuICAgICMjIypcbiAgICAqIFBhdXNlcyB0aGUgY3VycmVudCBzY2VuZS4gQSBwYXVzZWQgc2NlbmUgd2lsbCBub3QgY29udGludWUsIG1lc3NhZ2VzLCBwaWN0dXJlcywgZXRjLiB3aWxsXG4gICAgKiBzdG9wIHVudGlsIHRoZSBzY2VuZSByZXN1bWVzLlxuICAgICpcbiAgICAqIEBtZXRob2QgcGF1c2VTY2VuZVxuICAgICMjI1xuICAgIHBhdXNlU2NlbmU6IC0+XG4gICAgICAgIEBvYmplY3QucGljdHVyZUNvbnRhaW5lci5hY3RpdmUgPSBub1xuICAgICAgICBAb2JqZWN0LmNoYXJhY3RlckNvbnRhaW5lci5hY3RpdmUgPSBub1xuICAgICAgICBAb2JqZWN0LmJhY2tncm91bmRDb250YWluZXIuYWN0aXZlID0gbm9cbiAgICAgICAgQG9iamVjdC50ZXh0Q29udGFpbmVyLmFjdGl2ZSA9IG5vXG4gICAgICAgIEBvYmplY3QuaG90c3BvdENvbnRhaW5lci5hY3RpdmUgPSBub1xuICAgICAgICBAb2JqZWN0LnZpZGVvQ29udGFpbmVyLmFjdGl2ZSA9IG5vXG5cbiAgICAgICAgbWVzc2FnZSA9IGdzLk9iamVjdE1hbmFnZXIuY3VycmVudC5vYmplY3RCeUlkKFwiZ2FtZU1lc3NhZ2VfbWVzc2FnZVwiKVxuICAgICAgICBtZXNzYWdlLmFjdGl2ZSA9IG5vXG5cbiAgICAjIyMqXG4gICAgKiBDaGFuZ2VzIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSBlbnRpcmUgZ2FtZSBVSSBsaWtlIHRoZSBtZXNzYWdlIGJveGVzLCBldGMuIHRvIGFsbG93c1xuICAgICogdGhlIHBsYXllciB0byBzZWUgdGhlIGVudGlyZSBzY2VuZS4gVXNlZnVsIGZvciBDR3MsIGV0Yy5cbiAgICAqXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IHZpc2libGUgLSBJZiA8Yj50cnVlPC9iPiwgdGhlIGdhbWUgVUkgd2lsbCBiZSB2aXNpYmxlLiBPdGhlcndpc2UgaXQgd2lsbCBiZSBoaWRkZW4uXG4gICAgKiBAbWV0aG9kIGNoYW5nZVVJVmlzaWJpbGl0eVxuICAgICMjI1xuICAgIGNoYW5nZVVJVmlzaWJpbGl0eTogKHZpc2libGUpIC0+XG4gICAgICAgIEB1aVZpc2libGUgPSB2aXNpYmxlXG4gICAgICAgIEBvYmplY3QubGF5b3V0LnZpc2libGUgPSB2aXNpYmxlXG5cbiAgICAjIyMqXG4gICAgKiBTaG93cyBpbnB1dC10ZXh0IGJveCB0byBsZXQgdGhlIHVzZXIgZW50ZXIgYSB0ZXh0LlxuICAgICpcbiAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZXR0ZXJzIC0gVGhlIG1heC4gbnVtYmVyIG9mIGxldHRlcnMgdGhlIHVzZXIgY2FuIGVudGVyLlxuICAgICogQHBhcmFtIHtncy5DYWxsYmFja30gY2FsbGJhY2sgLSBBIGNhbGxiYWNrIGZ1bmN0aW9uIGNhbGxlZCBpZiB0aGUgaW5wdXQtdGV4dCBib3ggaGFzIGJlZW4gYWNjZXB0ZWQgYnkgdGhlIHVzZXIuXG4gICAgKiBAbWV0aG9kIHNob3dJbnB1dFRleHRcbiAgICAjIyNcbiAgICBzaG93SW5wdXRUZXh0OiAobGV0dGVycywgY2FsbGJhY2spIC0+XG4gICAgICAgIEBvYmplY3QuaW5wdXRUZXh0Qm94Py5kaXNwb3NlKClcbiAgICAgICAgQG9iamVjdC5pbnB1dFRleHRCb3ggPSB1aS5VaUZhY3RvcnkuY3JlYXRlQ29udHJvbEZyb21EZXNjcmlwdG9yKHVpLlVpRmFjdG9yeS5jdXN0b21UeXBlc1tcInVpLklucHV0VGV4dEJveFwiXSwgQG9iamVjdC5sYXlvdXQpXG4gICAgICAgIEBvYmplY3QuaW5wdXRUZXh0Qm94LnVpLnByZXBhcmUoKVxuICAgICAgICBAb2JqZWN0LmlucHV0VGV4dEJveC5ldmVudHMub24oXCJhY2NlcHRcIiwgY2FsbGJhY2spXG5cbiAgICAjIyMqXG4gICAgKiBTaG93cyBpbnB1dC1udW1iZXIgYm94IHRvIGxldCB0aGUgdXNlciBlbnRlciBhIG51bWJlci5cbiAgICAqXG4gICAgKiBAcGFyYW0ge251bWJlcn0gZGlnaXRzIC0gVGhlIG1heC4gbnVtYmVyIG9mIGRpZ2l0cyB0aGUgdXNlciBjYW4gZW50ZXIuXG4gICAgKiBAcGFyYW0ge2dzLkNhbGxiYWNrfSBjYWxsYmFjayAtIEEgY2FsbGJhY2sgZnVuY3Rpb24gY2FsbGVkIGlmIHRoZSBpbnB1dC1udW1iZXIgYm94IGhhcyBiZWVuIGFjY2VwdGVkIGJ5IHRoZSB1c2VyLlxuICAgICogQG1ldGhvZCBzaG93SW5wdXROdW1iZXJcbiAgICAjIyNcbiAgICBzaG93SW5wdXROdW1iZXI6IChkaWdpdHMsIGNhbGxiYWNrKSAtPlxuICAgICAgICBAb2JqZWN0LmlucHV0TnVtYmVyQm94Py5kaXNwb3NlKClcbiAgICAgICAgQG9iamVjdC5pbnB1dE51bWJlckJveCA9IHVpLlVpRmFjdG9yeS5jcmVhdGVDb250cm9sRnJvbURlc2NyaXB0b3IodWkuVWlGYWN0b3J5LmN1c3RvbVR5cGVzW1widWkuSW5wdXROdW1iZXJCb3hcIl0sIEBvYmplY3QubGF5b3V0KVxuICAgICAgICBAb2JqZWN0LmlucHV0TnVtYmVyQm94LnVpLnByZXBhcmUoKVxuICAgICAgICBAb2JqZWN0LmlucHV0TnVtYmVyQm94LmV2ZW50cy5vbihcImFjY2VwdFwiLCBjYWxsYmFjaylcblxuICAgICMjIypcbiAgICAqIFNob3dzIGNob2ljZXMgdG8gbGV0IHRoZSB1c2VyIHBpY2sgYSBjaG9pY2UuXG4gICAgKlxuICAgICogQHBhcmFtIHtPYmplY3RbXX0gY2hvaWNlcyAtIEFuIGFycmF5IG9mIGNob2ljZXNcbiAgICAqIEBwYXJhbSB7Z3MuQ2FsbGJhY2t9IGNhbGxiYWNrIC0gQSBjYWxsYmFjayBmdW5jdGlvbiBjYWxsZWQgaWYgYSBjaG9pY2UgaGFzIGJlZW4gcGlja2VkIGJ5IHRoZSB1c2VyLlxuICAgICogQG1ldGhvZCBzaG93Q2hvaWNlc1xuICAgICMjI1xuICAgIHNob3dDaG9pY2VzOiAoY2FsbGJhY2spIC0+XG4gICAgICAgIHVzZUZyZWVMYXlvdXQgPSBAb2JqZWN0LmNob2ljZXMud2hlcmUoKHgpIC0+IHguZHN0UmVjdD8pLmxlbmd0aCA+IDBcblxuICAgICAgICBAb2JqZWN0LmNob2ljZVdpbmRvdz8uZGlzcG9zZSgpXG5cbiAgICAgICAgaWYgdXNlRnJlZUxheW91dFxuICAgICAgICAgICAgQG9iamVjdC5jaG9pY2VXaW5kb3cgPSB1aS5VaUZhY3RvcnkuY3JlYXRlQ29udHJvbEZyb21EZXNjcmlwdG9yKHVpLlVpRmFjdG9yeS5jdXN0b21UeXBlc1tcInVpLkZyZWVDaG9pY2VCb3hcIl0sIEBvYmplY3QubGF5b3V0KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAb2JqZWN0LmNob2ljZVdpbmRvdyA9IHVpLlVpRmFjdG9yeS5jcmVhdGVDb250cm9sRnJvbURlc2NyaXB0b3IodWkuVWlGYWN0b3J5LmN1c3RvbVR5cGVzW1widWkuQ2hvaWNlQm94XCJdLCBAb2JqZWN0LmxheW91dClcblxuICAgICAgICBAb2JqZWN0LmNob2ljZVdpbmRvdy5ldmVudHMub24oXCJzZWxlY3Rpb25BY2NlcHRcIiwgY2FsbGJhY2spXG4gICAgICAgIEBvYmplY3QuY2hvaWNlV2luZG93LnVpLnByZXBhcmUoKVxuXG4gICAgc2hvd0Nob2ljZVRpbWVyOiAoc2Vjb25kcywgbWludXRlcykgLT5cbiAgICAgICAgQG9iamVjdC5jaG9pY2VUaW1lci5iZWhhdmlvci5taW51dGVzID0gbWludXRlc1xuICAgICAgICBAb2JqZWN0LmNob2ljZVRpbWVyLmJlaGF2aW9yLnNlY29uZHMgPSBzZWNvbmRzXG4gICAgICAgIEBvYmplY3QuY2hvaWNlVGltZXIuZXZlbnRzLm9uIFwiZmluaXNoXCIsID0+XG4gICAgICAgICAgICBHYW1lTWFuYWdlci50ZW1wRmllbGRzLmNob2ljZVRpbWVyVmlzaWJsZSA9IGZhbHNlXG4gICAgICAgICAgICBjaG9pY2UgPSBAb2JqZWN0LmNob2ljZXMuZmlyc3QoKGMpIC0+IGMuaXNEZWZhdWx0KSB8fCBAb2JqZWN0LmNob2ljZXNbMF1cbiAgICAgICAgICAgIGlmIGNob2ljZT9cbiAgICAgICAgICAgICAgICBAb2JqZWN0LmNob2ljZVdpbmRvdy5ldmVudHMuZW1pdChcInNlbGVjdGlvbkFjY2VwdFwiLCBAb2JqZWN0LmNob2ljZVdpbmRvdywgY2hvaWNlKVxuICAgICAgICAgICAgXG4gICAgICAgIEBvYmplY3QuY2hvaWNlVGltZXIuYmVoYXZpb3Iuc3RhcnQoKVxuICAgICAgICBHYW1lTWFuYWdlci50ZW1wRmllbGRzLmNob2ljZVRpbWVyVmlzaWJsZSA9IHRydWVcbiAgICAgICAgXG4gICAgIyMjKlxuICAgICogQ2hhbmdlcyB0aGUgYmFja2dyb3VuZCBvZiB0aGUgc2NlbmUuXG4gICAgKlxuICAgICogQG1ldGhvZCBjaGFuZ2VCYWNrZ3JvdW5kXG4gICAgKiBAcGFyYW0ge09iamVjdH0gYmFja2dyb3VuZCAtIFRoZSBiYWNrZ3JvdW5kIGdyYXBoaWMgb2JqZWN0IC0+IHsgbmFtZSB9XG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IG5vQW5pbWF0aW9uIC0gSW5kaWNhdGVzIGlmIHRoZSBiYWNrZ3JvdW5kIHNob3VsZCBiZSBjaGFuZ2VkIGltbWVkaWF0ZWx5IHdpdG91dCBhbnkgY2hhbmdlLWFuaW1hdGlvbi5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBhbmltYXRpb24gLSBUaGUgYXBwZWFyL2Rpc2FwcGVhciBhbmltYXRpb24gdG8gdXNlLlxuICAgICogQHBhcmFtIHtPYmplY3R9IGVhc2luZyAtIFRoZSBlYXNpbmcgb2YgdGhlIGNoYW5nZSBhbmltYXRpb24uXG4gICAgKiBAcGFyYW0ge251bWJlcn0gZHVyYXRpb24gLSBUaGUgZHVyYXRpb24gb2YgdGhlIGNoYW5nZSBpbiBmcmFtZXMuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gb3ggLSBUaGUgeC1vcmlnaW4gb2YgdGhlIGJhY2tncm91bmQuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gb3kgLSBUaGUgeS1vcmlnaW4gb2YgdGhlIGJhY2tncm91bmQuXG4gICAgKiBAcGFyYW0ge251bWJlcn0gbGF5ZXIgLSBUaGUgYmFja2dyb3VuZC1sYXllciB0byBjaGFuZ2UuXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IGxvb3BIb3Jpem9udGFsIC0gSW5kaWNhdGVzIGlmIHRoZSBiYWNrZ3JvdW5kIHNob3VsZCBiZSBsb29wZWQgaG9yaXpvbnRhbGx5LlxuICAgICogQHBhcmFtIHtib29sZWFufSBsb29wVmVydGljYWwgLSBJbmRpY2F0ZXMgaWYgdGhlIGJhY2tncm91bmQgc2hvdWxkIGJlIGxvb3BlZCB2ZXJ0aWNhbGx5LlxuICAgICMjI1xuICAgIGNoYW5nZUJhY2tncm91bmQ6IChiYWNrZ3JvdW5kLCBub0FuaW1hdGlvbiwgYW5pbWF0aW9uLCBlYXNpbmcsIGR1cmF0aW9uLCBveCwgb3ksIGxheWVyLCBsb29wSG9yaXpvbnRhbCwgbG9vcFZlcnRpY2FsKSAtPlxuICAgICAgICBpZiBiYWNrZ3JvdW5kP1xuICAgICAgICAgICAgb3RoZXJPYmplY3QgPSBAb2JqZWN0LmJhY2tncm91bmRzW2xheWVyXVxuICAgICAgICAgICAgb2JqZWN0ID0gbmV3IHZuLk9iamVjdF9CYWNrZ3JvdW5kKClcbiAgICAgICAgICAgIG9iamVjdC5pbWFnZSA9IGJhY2tncm91bmQubmFtZVxuICAgICAgICAgICAgb2JqZWN0LmltYWdlRm9sZGVyID0gYmFja2dyb3VuZC5mb2xkZXJQYXRoXG4gICAgICAgICAgICBvYmplY3Qub3JpZ2luLnggPSBveFxuICAgICAgICAgICAgb2JqZWN0Lm9yaWdpbi55ID0gb3lcbiAgICAgICAgICAgIG9iamVjdC52aWV3cG9ydCA9IEB2aWV3cG9ydFxuICAgICAgICAgICAgb2JqZWN0LnZpc3VhbC5sb29waW5nLnZlcnRpY2FsID0gbm9cbiAgICAgICAgICAgIG9iamVjdC52aXN1YWwubG9vcGluZy5ob3Jpem9udGFsID0gbm9cbiAgICAgICAgICAgIG9iamVjdC51cGRhdGUoKVxuXG4gICAgICAgICAgICBAb2JqZWN0LmJhY2tncm91bmRDb250YWluZXIuc2V0T2JqZWN0KG9iamVjdCwgbGF5ZXIpXG5cbiAgICAgICAgICAgIGR1cmF0aW9uID0gZHVyYXRpb24gPyAzMFxuXG4gICAgICAgICAgICBvdGhlck9iamVjdD8uekluZGV4ID0gbGF5ZXJcbiAgICAgICAgICAgIG90aGVyT2JqZWN0Py5hbmltYXRvci5vdGhlck9iamVjdD8uZGlzcG9zZSgpXG5cbiAgICAgICAgICAgIGlmIGR1cmF0aW9uID09IDBcbiAgICAgICAgICAgICAgICBvdGhlck9iamVjdD8uZGlzcG9zZSgpXG4gICAgICAgICAgICAgICAgb2JqZWN0LnZpc3VhbC5sb29waW5nLnZlcnRpY2FsID0gbG9vcFZlcnRpY2FsXG4gICAgICAgICAgICAgICAgb2JqZWN0LnZpc3VhbC5sb29waW5nLmhvcml6b250YWwgPSBsb29wSG9yaXpvbnRhbFxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGlmIG5vQW5pbWF0aW9uXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC52aXN1YWwubG9vcGluZy52ZXJ0aWNhbCA9IGxvb3BWZXJ0aWNhbFxuICAgICAgICAgICAgICAgICAgICBvYmplY3QudmlzdWFsLmxvb3BpbmcuaG9yaXpvbnRhbCA9IGxvb3BIb3Jpem9udGFsXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBvYmplY3QuYW5pbWF0b3Iub3RoZXJPYmplY3QgPSBvdGhlck9iamVjdFxuICAgICAgICAgICAgICAgICAgICBvYmplY3QuYW5pbWF0b3IuYXBwZWFyKDAsIDAsIGFuaW1hdGlvbiwgZWFzaW5nLCBkdXJhdGlvbiwgKHNlbmRlcikgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbmRlci51cGRhdGUoKVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VuZGVyLmFuaW1hdG9yLm90aGVyT2JqZWN0Py5kaXNwb3NlKClcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbmRlci5hbmltYXRvci5vdGhlck9iamVjdCA9IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbmRlci52aXN1YWwubG9vcGluZy52ZXJ0aWNhbCA9IGxvb3BWZXJ0aWNhbFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VuZGVyLnZpc3VhbC5sb29waW5nLmhvcml6b250YWwgPSBsb29wSG9yaXpvbnRhbFxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEBvYmplY3QuYmFja2dyb3VuZHNbbGF5ZXJdPy5hbmltYXRvci5oaWRlIGR1cmF0aW9uLCBlYXNpbmcsICA9PlxuICAgICAgICAgICAgICAgQG9iamVjdC5iYWNrZ3JvdW5kc1tsYXllcl0uZGlzcG9zZSgpXG4gICAgICAgICAgICAgICBAb2JqZWN0LmJhY2tncm91bmRzW2xheWVyXSA9IG51bGxcblxuXG4gICAgIyMjKlxuICAgICogU2tpcHMgYWxsIHZpZXdwb3J0IGFuaW1hdGlvbnMgZXhjZXB0IHRoZSBtYWluIHZpZXdwb3J0IGFuaW1hdGlvbi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNraXBWaWV3cG9ydHNcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBza2lwVmlld3BvcnRzOiAtPlxuICAgICAgICB2aWV3cG9ydHMgPSBAb2JqZWN0LnZpZXdwb3J0Q29udGFpbmVyLnN1Yk9iamVjdHNcbiAgICAgICAgZm9yIHZpZXdwb3J0IGluIHZpZXdwb3J0c1xuICAgICAgICAgICAgaWYgdmlld3BvcnRcbiAgICAgICAgICAgICAgICBmb3IgY29tcG9uZW50IGluIHZpZXdwb3J0LmNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LnNraXA/KClcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICMjIypcbiAgICAqIFNraXBzIGFsbCBwaWN0dXJlIGFuaW1hdGlvbnMuXG4gICAgKlxuICAgICogQG1ldGhvZCBza2lwUGljdHVyZXNcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBza2lwUGljdHVyZXM6IC0+XG4gICAgICAgIGZvciBwaWN0dXJlIGluIEBvYmplY3QucGljdHVyZXNcbiAgICAgICAgICAgIGlmIHBpY3R1cmVcbiAgICAgICAgICAgICAgICBmb3IgY29tcG9uZW50IGluIHBpY3R1cmUuY29tcG9uZW50c1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuc2tpcD8oKVxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgIyMjKlxuICAgICogU2tpcHMgYWxsIHRleHQgYW5pbWF0aW9ucy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNraXBUZXh0c1xuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIHNraXBUZXh0czogLT5cbiAgICAgICBmb3IgdGV4dCBpbiBAb2JqZWN0LnRleHRzXG4gICAgICAgICAgICBpZiB0ZXh0XG4gICAgICAgICAgICAgICAgZm9yIGNvbXBvbmVudCBpbiB0ZXh0LmNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LnNraXA/KClcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICMjIypcbiAgICAqIFNraXBzIGFsbCB2aWRlbyBhbmltYXRpb25zIGJ1dCBub3QgdGhlIHZpZGVvLXBsYXliYWNrIGl0c2VsZi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNraXBWaWRlb3NcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBza2lwVmlkZW9zOiAtPlxuICAgICAgICBmb3IgdmlkZW8gaW4gQG9iamVjdC52aWRlb3NcbiAgICAgICAgICAgIGlmIHZpZGVvXG4gICAgICAgICAgICAgICAgZm9yIGNvbXBvbmVudCBpbiB2aWRlby5jb21wb25lbnRzXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5za2lwPygpXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAjIyMqXG4gICAgKiBTa2lwcyBhbGwgYmFja2dyb3VuZCBhbmltYXRpb25zLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2tpcEJhY2tncm91bmRzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgc2tpcEJhY2tncm91bmRzOiAtPlxuICAgICAgICBmb3IgYmFja2dyb3VuZCBpbiBAb2JqZWN0LmJhY2tncm91bmRzXG4gICAgICAgICAgICBpZiBiYWNrZ3JvdW5kXG4gICAgICAgICAgICAgICAgZm9yIGNvbXBvbmVudCBpbiBiYWNrZ3JvdW5kLmNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LnNraXA/KClcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICMjIypcbiAgICAqIFNraXBzIGFsbCBjaGFyYWN0ZXIgYW5pbWF0aW9uc1xuICAgICpcbiAgICAqIEBtZXRob2Qgc2tpcENoYXJhY3RlcnNcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBza2lwQ2hhcmFjdGVyczogLT5cbiAgICAgICAgZm9yIGNoYXJhY3RlciBpbiBAb2JqZWN0LmNoYXJhY3RlcnNcbiAgICAgICAgICAgIGlmIGNoYXJhY3RlclxuICAgICAgICAgICAgICAgIGZvciBjb21wb25lbnQgaW4gY2hhcmFjdGVyLmNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LnNraXA/KClcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICMjIypcbiAgICAqIFNraXBzIHRoZSBtYWluIHZpZXdwb3J0IGFuaW1hdGlvbi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNraXBNYWluVmlld3BvcnRcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBza2lwTWFpblZpZXdwb3J0OiAtPlxuICAgICAgICBmb3IgY29tcG9uZW50IGluIEBvYmplY3Qudmlld3BvcnQuY29tcG9uZW50c1xuICAgICAgICAgICAgY29tcG9uZW50LnNraXA/KClcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICMjIypcbiAgICAqIFNraXBzIGFsbCBhbmltYXRpb25zIG9mIGFsbCBtZXNzYWdlIGJveGVzIGRlZmluZWQgaW4gTUVTU0FHRV9CT1hfSURTIHVpIGNvbnN0YW50LlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2tpcE1lc3NhZ2VCb3hlc1xuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIHNraXBNZXNzYWdlQm94ZXM6IC0+XG4gICAgICAgIGZvciBtZXNzYWdlQm94SWQgaW4gZ3MuVUlDb25zdGFudHMuTUVTU0FHRV9CT1hfSURTIHx8IFtcIm1lc3NhZ2VCb3hcIiwgXCJudmxNZXNzYWdlQm94XCJdXG4gICAgICAgICAgICBtZXNzYWdlQm94ID0gZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50Lm9iamVjdEJ5SWQobWVzc2FnZUJveElkKVxuICAgICAgICAgICAgaWYgbWVzc2FnZUJveC5jb21wb25lbnRzXG4gICAgICAgICAgICAgICAgZm9yIGNvbXBvbmVudCBpbiBtZXNzYWdlQm94LmNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LnNraXA/KClcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICMjIypcbiAgICAqIFNraXBzIGFsbCBhbmltYXRpb25zIG9mIGFsbCBtZXNzYWdlIGFyZWFzLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2tpcE1lc3NhZ2VBcmVhc1xuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIHNraXBNZXNzYWdlQXJlYXM6IC0+XG4gICAgICAgIGZvciBtZXNzYWdlQXJlYSBpbiBAb2JqZWN0Lm1lc3NhZ2VBcmVhc1xuICAgICAgICAgICAgaWYgbWVzc2FnZUFyZWE/Lm1lc3NhZ2VcbiAgICAgICAgICAgICAgICBmb3IgY29tcG9uZW50IGluIG1lc3NhZ2VBcmVhLm1lc3NhZ2UuY29tcG9uZW50c1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuc2tpcD8oKVxuXG4gICAgICAgIG1zZyA9IGdzLk9iamVjdE1hbmFnZXIuY3VycmVudC5vYmplY3RCeUlkKFwiZ2FtZU1lc3NhZ2VfbWVzc2FnZVwiKVxuICAgICAgICBpZiBtc2dcbiAgICAgICAgICAgIGZvciBjb21wb25lbnQgaW4gbXNnLmNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuc2tpcD8oKVxuICAgICAgICBtc2cgPSBncy5PYmplY3RNYW5hZ2VyLmN1cnJlbnQub2JqZWN0QnlJZChcIm52bEdhbWVNZXNzYWdlX21lc3NhZ2VcIilcbiAgICAgICAgaWYgbXNnXG4gICAgICAgICAgICBmb3IgY29tcG9uZW50IGluIG1zZy5jb21wb25lbnRzXG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnNraXA/KClcblxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgIyMjKlxuICAgICogU2tpcHMgdGhlIHNjZW5lIGludGVycHJldGVyIHRpbWVyLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2tpcEludGVycHJldGVyXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgc2tpcEludGVycHJldGVyOiAtPlxuICAgICAgICBpZiBAb2JqZWN0LmludGVycHJldGVyLndhaXRDb3VudGVyID4gR2FtZU1hbmFnZXIudGVtcFNldHRpbmdzLnNraXBUaW1lXG4gICAgICAgICAgICBAb2JqZWN0LmludGVycHJldGVyLndhaXRDb3VudGVyID0gR2FtZU1hbmFnZXIudGVtcFNldHRpbmdzLnNraXBUaW1lXG4gICAgICAgICAgICBpZiBAb2JqZWN0LmludGVycHJldGVyLndhaXRDb3VudGVyID09IDBcbiAgICAgICAgICAgICAgICBAb2JqZWN0LmludGVycHJldGVyLmlzV2FpdGluZyA9IG5vXG5cbiAgICAjIyMqXG4gICAgKiBTa2lwcyB0aGUgaW50ZXJwcmV0ZXIgdGltZXIgb2YgYWxsIGNvbW1vbiBldmVudHMuXG4gICAgKlxuICAgICogQG1ldGhvZCBza2lwQ29tbW9uRXZlbnRzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgc2tpcENvbW1vbkV2ZW50czogLT5cbiAgICAgICAgZXZlbnRzID0gQG9iamVjdC5jb21tb25FdmVudENvbnRhaW5lci5zdWJPYmplY3RzXG4gICAgICAgIGZvciBldmVudCBpbiBldmVudHNcbiAgICAgICAgICAgIGlmIGV2ZW50Py5pbnRlcnByZXRlciBhbmQgZXZlbnQuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgPiBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3Muc2tpcFRpbWVcbiAgICAgICAgICAgICAgICBldmVudC5pbnRlcnByZXRlci53YWl0Q291bnRlciA9IEdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5ncy5za2lwVGltZVxuICAgICAgICAgICAgICAgIGlmIGV2ZW50LmludGVycHJldGVyLndhaXRDb3VudGVyID09IDBcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuaW50ZXJwcmV0ZXIuaXNXYWl0aW5nID0gbm9cblxuICAgICMjIypcbiAgICAqIFNraXBzIHRoZSBzY2VuZSdzIGNvbnRlbnQuXG4gICAgKlxuICAgICogQG1ldGhvZCBza2lwQ29udGVudFxuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIHNraXBDb250ZW50OiAtPlxuICAgICAgICBAc2tpcFBpY3R1cmVzKClcbiAgICAgICAgQHNraXBUZXh0cygpXG4gICAgICAgIEBza2lwVmlkZW9zKClcbiAgICAgICAgQHNraXBCYWNrZ3JvdW5kcygpXG4gICAgICAgIEBza2lwQ2hhcmFjdGVycygpXG4gICAgICAgIEBza2lwTWFpblZpZXdwb3J0KClcbiAgICAgICAgQHNraXBWaWV3cG9ydHMoKVxuICAgICAgICBAc2tpcE1lc3NhZ2VCb3hlcygpXG4gICAgICAgIEBza2lwTWVzc2FnZUFyZWFzKClcbiAgICAgICAgQHNraXBJbnRlcnByZXRlcigpXG4gICAgICAgIEBza2lwQ29tbW9uRXZlbnRzKClcblxuXG4gICAgIyMjKlxuICAgICogQ2hlY2tzIGZvciB0aGUgc2hvcnRjdXQgdG8gaGlkZS9zaG93IHRoZSBnYW1lIFVJLiBCeSBkZWZhdWx0LCB0aGlzIGlzIHRoZSBzcGFjZS1rZXkuIFlvdVxuICAgICogY2FuIG92ZXJyaWRlIHRoaXMgbWV0aG9kIHRvIGNoYW5nZSB0aGUgc2hvcnRjdXQuXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVVSVZpc2liaWxpdHlTaG9ydGN1dFxuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIHVwZGF0ZVVJVmlzaWJpbGl0eVNob3J0Y3V0OiAtPlxuICAgICAgICBpZiAhQHVpVmlzaWJsZSBhbmQgKElucHV0LnRyaWdnZXIoSW5wdXQuQykgb3IgSW5wdXQuTW91c2UuYnV0dG9uRG93bilcbiAgICAgICAgICAgIEBjaGFuZ2VVSVZpc2liaWxpdHkoIUB1aVZpc2libGUpXG4gICAgICAgIGlmIElucHV0LnRyaWdnZXIoSW5wdXQuS0VZX1NQQUNFKVxuICAgICAgICAgICAgQGNoYW5nZVVJVmlzaWJpbGl0eSghQHVpVmlzaWJsZSlcblxuICAgICMjIypcbiAgICAqIENoZWNrcyBmb3IgdGhlIHNob3J0Y3V0IHRvIGV4aXQgdGhlIGdhbWUuIEJ5IGRlZmF1bHQsIHRoaXMgaXMgdGhlIGVzY2FwZS1rZXkuIFlvdVxuICAgICogY2FuIG92ZXJyaWRlIHRoaXMgbWV0aG9kIHRvIGNoYW5nZSB0aGUgc2hvcnRjdXQuXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVRdWl0U2hvcnRjdXRcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICB1cGRhdGVRdWl0U2hvcnRjdXQ6IC0+XG4gICAgICAgIGlmIElucHV0LnRyaWdnZXIoSW5wdXQuS0VZX0VTQ0FQRSlcbiAgICAgICAgICAgIGdzLkFwcGxpY2F0aW9uLmV4aXQoKVxuXG5cbiAgICAjIyMqXG4gICAgKiBDaGVja3MgZm9yIHRoZSBzaG9ydGN1dCB0byBvcGVuIHRoZSBzZXR0aW5ncyBtZW51LiBCeSBkZWZhdWx0LCB0aGlzIGlzIHRoZSBzLWtleS4gWW91XG4gICAgKiBjYW4gb3ZlcnJpZGUgdGhpcyBtZXRob2QgdG8gY2hhbmdlIHRoZSBzaG9ydGN1dC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVNldHRpbmdzU2hvcnRjdXRcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICB1cGRhdGVTZXR0aW5nc1Nob3J0Y3V0OiAtPlxuICAgICAgICBpZiBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3MubWVudUFjY2VzcyBhbmQgSW5wdXQudHJpZ2dlcihJbnB1dC5YKVxuICAgICAgICAgICAgU2NlbmVNYW5hZ2VyLnN3aXRjaFRvKG5ldyBncy5PYmplY3RfTGF5b3V0KFwic2V0dGluZ3NNZW51TGF5b3V0XCIpLCB0cnVlKVxuXG4gICAgIyMjKlxuICAgICogQ2hlY2tzIGZvciB0aGUgc2hvcnRjdXQgdG8gb3BlbiB0aGUgc2V0dGluZ3MgbWVudS4gQnkgZGVmYXVsdCwgdGhpcyBpcyB0aGUgY29udHJvbC1rZXkuIFlvdVxuICAgICogY2FuIG92ZXJyaWRlIHRoaXMgbWV0aG9kIHRvIGNoYW5nZSB0aGUgc2hvcnRjdXQuXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVTa2lwU2hvcnRjdXRcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICB1cGRhdGVTa2lwU2hvcnRjdXQ6IC0+XG4gICAgICAgIGlmIEBvYmplY3Quc2V0dGluZ3MuYWxsb3dTa2lwXG4gICAgICAgICAgICBpZiBJbnB1dC5rZXlzW0lucHV0LktFWV9DT05UUk9MXSA9PSAxXG4gICAgICAgICAgICAgICAgR2FtZU1hbmFnZXIudGVtcFNldHRpbmdzLnNraXAgPSB5ZXNcbiAgICAgICAgICAgIGVsc2UgaWYgSW5wdXQua2V5c1tJbnB1dC5LRVlfQ09OVFJPTF0gPT0gMlxuICAgICAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5ncy5za2lwID0gbm9cblxuICAgICMjIypcbiAgICAqIENoZWNrcyBmb3IgZGVmYXVsdCBrZXlib2FyZCBzaG9ydGN1dHMgZS5nIHNwYWNlLWtleSB0byBoaWRlIHRoZSBVSSwgZXRjLlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlU2hvcnRjdXRzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgdXBkYXRlU2hvcnRjdXRzOiAtPlxuICAgICAgICByZXR1cm4gaWYgIUBvYmplY3QuY2FuUmVjZWl2ZUlucHV0KClcbiAgICAgICAgQHVwZGF0ZVNldHRpbmdzU2hvcnRjdXQoKVxuICAgICAgICBAdXBkYXRlUXVpdFNob3J0Y3V0KClcbiAgICAgICAgQHVwZGF0ZVVJVmlzaWJpbGl0eVNob3J0Y3V0KClcbiAgICAgICAgQHVwZGF0ZVNraXBTaG9ydGN1dCgpXG5cbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBmdWxsIHNjcmVlbiB2aWRlbyBwbGF5ZWQgdmlhIFBsYXkgTW92aWUgY29tbWFuZC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVZpZGVvXG4gICAgIyMjXG4gICAgdXBkYXRlVmlkZW86IC0+XG4gICAgICAgIGlmIEBvYmplY3QudmlkZW8/XG4gICAgICAgICAgICBAb2JqZWN0LnZpZGVvLnVwZGF0ZSgpXG4gICAgICAgICAgICBpZiBAb2JqZWN0LnNldHRpbmdzLmFsbG93VmlkZW9Ta2lwIGFuZCAoSW5wdXQudHJpZ2dlcihJbnB1dC5DKSBvciBJbnB1dC5Nb3VzZS5idXR0b25zW0lucHV0Lk1vdXNlLkxFRlRdID09IDIpXG4gICAgICAgICAgICAgICAgQG9iamVjdC52aWRlby5zdG9wKClcbiAgICAgICAgICAgIElucHV0LmNsZWFyKClcblxuICAgICMjIypcbiAgICAqIFVwZGF0ZXMgc2tpcHBpbmcgaWYgZW5hYmxlZC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVNraXBwaW5nXG4gICAgIyMjXG4gICAgdXBkYXRlU2tpcHBpbmc6IC0+XG4gICAgICAgIGlmICFAb2JqZWN0LnNldHRpbmdzLmFsbG93U2tpcFxuICAgICAgICAgICAgQG9iamVjdC50ZW1wU2V0dGluZ3Muc2tpcCA9IG5vXG5cbiAgICAgICAgaWYgR2FtZU1hbmFnZXIudGVtcFNldHRpbmdzLnNraXBcbiAgICAgICAgICAgIEBza2lwQ29udGVudCgpXG5cbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHRoZSBzY2VuZSdzIGNvbnRlbnQuXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVDb250ZW50XG4gICAgIyMjXG4gICAgdXBkYXRlQ29udGVudDogLT5cbiAgICAgICAgI2lmICFAb2JqZWN0LmludGVycHJldGVyLmlzUnVubmluZyBhbmQgIUdyYXBoaWNzLmZyb3plblxuICAgICAgICAjICAgIEBzZXR1cEludGVycHJldGVyKClcbiAgICAgICAgR2FtZU1hbmFnZXIuc2NlbmUgPSBAb2JqZWN0XG4gICAgICAgIEdyYXBoaWNzLnZpZXdwb3J0LnVwZGF0ZSgpXG4gICAgICAgIEBvYmplY3Qudmlld3BvcnQudXBkYXRlKClcblxuICAgICAgICBAdXBkYXRlU2tpcHBpbmcoKVxuICAgICAgICBAdXBkYXRlVmlkZW8oKVxuICAgICAgICBAdXBkYXRlU2hvcnRjdXRzKClcblxuICAgICAgICBzdXBlcigpXG5cbnZuLkNvbXBvbmVudF9HYW1lU2NlbmVCZWhhdmlvciA9IENvbXBvbmVudF9HYW1lU2NlbmVCZWhhdmlvciJdfQ==
//# sourceURL=Component_GameSceneBehavior_42.js