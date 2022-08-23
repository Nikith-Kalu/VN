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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU9BLElBQUEsMkJBQUE7RUFBQTs7O0FBQU07Ozs7QUFFRjs7Ozs7Ozs7O0VBUWEscUNBQUE7SUFDVCwyREFBQTtJQUVBLElBQUMsQ0FBQSxzQkFBRCxHQUEwQixDQUFBLFNBQUEsS0FBQTthQUFBLFNBQUE7UUFDdEIsS0FBQyxDQUFBLE1BQU0sQ0FBQyxlQUFSLENBQXdCLEtBQUMsQ0FBQSxNQUFNLENBQUMsV0FBaEM7ZUFDQSxLQUFDLENBQUEsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFwQixDQUFBO01BRnNCO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtJQUcxQixJQUFDLENBQUEsdUJBQUQsR0FBMkIsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFBO1FBQ3ZCLElBQUcsQ0FBQyxLQUFDLENBQUEsTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFuQixDQUE0QixLQUFDLENBQUEsTUFBTSxDQUFDLFdBQXBDLENBQUo7VUFDSSxLQUFDLENBQUEsTUFBTSxDQUFDLFlBQVIsQ0FBcUIsS0FBQyxDQUFBLE1BQU0sQ0FBQyxXQUE3QixFQURKOztlQUVBLEtBQUMsQ0FBQSxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQXBCLENBQUE7TUFIdUI7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBO0lBSzNCLElBQUMsQ0FBQSxlQUFELEdBQW1CO0lBQ25CLElBQUMsQ0FBQSxZQUFELEdBQWdCO0VBWlA7OztBQWNiOzs7Ozs7d0NBS0EsVUFBQSxHQUFZLFNBQUE7QUFDUixRQUFBO0lBQUEsSUFBRyxZQUFZLENBQUMsY0FBYyxDQUFDLE1BQTVCLEtBQXNDLENBQXpDO01BQ0ksRUFBRSxDQUFDLGtCQUFrQixDQUFDLFdBQXRCLENBQWtDLElBQUMsQ0FBQSxNQUFNLENBQUMsb0JBQW9CLENBQUMsVUFBL0QsRUFESjs7SUFHQSxJQUFDLENBQUEsZUFBRCxHQUFtQixlQUFlLENBQUMsYUFBaEIsQ0FB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QUFBLElBQTBCLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBUSxDQUFBLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBWixDQUFwQixLQUF5QyxDQUFwRSxDQUF2QztRQUNJLElBQUMsQ0FBQSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQWQsQ0FBQSxFQURKOzthQUVBLEtBQUssQ0FBQyxLQUFOLENBQUEsRUFKSjs7RUFEUzs7O0FBT2I7Ozs7Ozt3Q0FLQSxjQUFBLEdBQWdCLFNBQUE7SUFDWixJQUFHLENBQUMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBckI7TUFDSSxJQUFDLENBQUEsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFyQixHQUE0QixNQURoQzs7SUFHQSxJQUFHLFdBQVcsQ0FBQyxZQUFZLENBQUMsSUFBNUI7YUFDSSxJQUFDLENBQUEsV0FBRCxDQUFBLEVBREo7O0VBSlk7OztBQU9oQjs7Ozs7O3dDQUtBLGFBQUEsR0FBZSxTQUFBO0lBR1gsV0FBVyxDQUFDLEtBQVosR0FBb0IsSUFBQyxDQUFBO0lBQ3JCLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBbEIsQ0FBQTtJQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQWpCLENBQUE7SUFFQSxJQUFDLENBQUEsY0FBRCxDQUFBO0lBQ0EsSUFBQyxDQUFBLFdBQUQsQ0FBQTtJQUNBLElBQUMsQ0FBQSxlQUFELENBQUE7V0FFQSw2REFBQTtFQVhXOzs7O0dBditCdUIsRUFBRSxDQUFDOztBQW8vQjdDLEVBQUUsQ0FBQywyQkFBSCxHQUFpQyIsInNvdXJjZXNDb250ZW50IjpbIiMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIyAgIFNjcmlwdDogQ29tcG9uZW50X0dhbWVTY2VuZUJlaGF2aW9yXG4jXG4jICAgJCRDT1BZUklHSFQkJFxuI1xuIyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jbGFzcyBDb21wb25lbnRfR2FtZVNjZW5lQmVoYXZpb3IgZXh0ZW5kcyBncy5Db21wb25lbnRfTGF5b3V0U2NlbmVCZWhhdmlvclxuICMgICBAb2JqZWN0Q29kZWNCbGFja0xpc3QgPSBbXCJvYmplY3RNYW5hZ2VyXCJdXG4gICAgIyMjKlxuICAgICogRGVmaW5lcyB0aGUgYmVoYXZpb3Igb2YgdmlzdWFsIG5vdmVsIGdhbWUgc2NlbmUuXG4gICAgKlxuICAgICogQG1vZHVsZSB2blxuICAgICogQGNsYXNzIENvbXBvbmVudF9HYW1lU2NlbmVCZWhhdmlvclxuICAgICogQGV4dGVuZHMgZ3MuQ29tcG9uZW50X0xheW91dFNjZW5lQmVoYXZpb3JcbiAgICAqIEBtZW1iZXJvZiB2blxuICAgICMjI1xuICAgIGNvbnN0cnVjdG9yOiAtPlxuICAgICAgICBzdXBlcigpXG5cbiAgICAgICAgQG9uQXV0b0NvbW1vbkV2ZW50U3RhcnQgPSA9PlxuICAgICAgICAgICAgQG9iamVjdC5yZW1vdmVDb21wb25lbnQoQG9iamVjdC5pbnRlcnByZXRlcilcbiAgICAgICAgICAgIEBvYmplY3QuaW50ZXJwcmV0ZXIuc3RvcCgpXG4gICAgICAgIEBvbkF1dG9Db21tb25FdmVudEZpbmlzaCA9ID0+XG4gICAgICAgICAgICBpZiAhQG9iamVjdC5jb21wb25lbnRzLmNvbnRhaW5zKEBvYmplY3QuaW50ZXJwcmV0ZXIpXG4gICAgICAgICAgICAgICAgQG9iamVjdC5hZGRDb21wb25lbnQoQG9iamVjdC5pbnRlcnByZXRlcilcbiAgICAgICAgICAgIEBvYmplY3QuaW50ZXJwcmV0ZXIucmVzdW1lKClcblxuICAgICAgICBAcmVzb3VyY2VDb250ZXh0ID0gbnVsbFxuICAgICAgICBAb2JqZWN0RG9tYWluID0gXCJcIlxuXG4gICAgIyMjKlxuICAgICogSW5pdGlhbGl6ZXMgdGhlIHNjZW5lLlxuICAgICpcbiAgICAqIEBtZXRob2QgaW5pdGlhbGl6ZVxuICAgICMjI1xuICAgIGluaXRpYWxpemU6IC0+XG4gICAgICAgIGlmIFNjZW5lTWFuYWdlci5wcmV2aW91c1NjZW5lcy5sZW5ndGggPT0gMFxuICAgICAgICAgICAgZ3MuR2xvYmFsRXZlbnRNYW5hZ2VyLmNsZWFyRXhjZXB0KEBvYmplY3QuY29tbW9uRXZlbnRDb250YWluZXIuc3ViT2JqZWN0cylcblxuICAgICAgICBAcmVzb3VyY2VDb250ZXh0ID0gUmVzb3VyY2VNYW5hZ2VyLmNyZWF0ZUNvbnRleHQoKVxuICAgICAgICBSZXNvdXJjZU1hbmFnZXIuY29udGV4dCA9IEByZXNvdXJjZUNvbnRleHRcblxuICAgICAgICBHcmFwaGljcy5mcmVlemUoKVxuICAgICAgICBzYXZlR2FtZSA9IEdhbWVNYW5hZ2VyLmxvYWRlZFNhdmVHYW1lXG4gICAgICAgIHNjZW5lVWlkID0gbnVsbFxuXG4gICAgICAgIGlmIHNhdmVHYW1lXG4gICAgICAgICAgICBzY2VuZVVpZCA9IHNhdmVHYW1lLnNjZW5lVWlkXG4gICAgICAgICAgICBAb2JqZWN0LnNjZW5lRGF0YSA9IHNhdmVHYW1lLmRhdGFcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgc2NlbmVVaWQgPSAkUEFSQU1TLnByZXZpZXc/LnNjZW5lLnVpZCB8fCBAb2JqZWN0LnNjZW5lRGF0YS51aWQgfHwgUmVjb3JkTWFuYWdlci5zeXN0ZW0uc3RhcnRJbmZvLnNjZW5lLnVpZFxuXG4gICAgICAgIEBvYmplY3Quc2NlbmVEb2N1bWVudCA9IERhdGFNYW5hZ2VyLmdldERvY3VtZW50KHNjZW5lVWlkKVxuXG4gICAgICAgIGlmIEBvYmplY3Quc2NlbmVEb2N1bWVudCBhbmQgQG9iamVjdC5zY2VuZURvY3VtZW50Lml0ZW1zLnR5cGUgPT0gXCJ2bi5zY2VuZVwiXG4gICAgICAgICAgICBAb2JqZWN0LmNoYXB0ZXIgPSBEYXRhTWFuYWdlci5nZXREb2N1bWVudChAb2JqZWN0LnNjZW5lRG9jdW1lbnQuaXRlbXMuY2hhcHRlclVpZClcbiAgICAgICAgICAgIEBvYmplY3QuY3VycmVudENoYXJhY3RlciA9IHsgXCJuYW1lXCI6IFwiXCIgfSAjUmVjb3JkTWFuYWdlci5jaGFyYWN0ZXJzWzBdXG5cbiAgICAgICAgICAgIGlmIG5vdCBHYW1lTWFuYWdlci5pbml0aWFsaXplZFxuICAgICAgICAgICAgICAgIEdhbWVNYW5hZ2VyLmluaXRpYWxpemUoKVxuICAgICAgICAgICAgR2FtZU1hbmFnZXIucHJlbG9hZENvbW1vbkV2ZW50cygpXG5cbiAgICAgICAgICAgIExhbmd1YWdlTWFuYWdlci5sb2FkQnVuZGxlcygpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHNwcml0ZSA9IG5ldyBncy5TcHJpdGUoKVxuICAgICAgICAgICAgc3ByaXRlLmJpdG1hcCA9IG5ldyBncy5CaXRtYXAoR3JhcGhpY3Mud2lkdGgsIDUwKVxuICAgICAgICAgICAgc3ByaXRlLmJpdG1hcC5kcmF3VGV4dCgwLCAwLCBHcmFwaGljcy53aWR0aCwgNTAsIFwiTm8gU3RhcnQgU2NlbmUgc2VsZWN0ZWRcIiwgMSwgMClcbiAgICAgICAgICAgIHNwcml0ZS5zcmNSZWN0ID0gbmV3IGdzLlJlY3QoMCwgMCwgR3JhcGhpY3Mud2lkdGgsIDUwKVxuICAgICAgICAgICAgc3ByaXRlLnkgPSAoR3JhcGhpY3MuaGVpZ2h0IC0gNTApIC8gMlxuICAgICAgICAgICAgc3ByaXRlLnogPSAxMDAwMFxuXG4gICAgICAgIEBzZXR1cFNjcmVlbigpXG5cbiAgICAjIyMqXG4gICAgKiBEaXNwb3NlcyB0aGUgc2NlbmUuXG4gICAgKlxuICAgICogQG1ldGhvZCBkaXNwb3NlXG4gICAgIyMjXG4gICAgZGlzcG9zZTogLT5cbiAgICAgICAgUmVzb3VyY2VNYW5hZ2VyLmNvbnRleHQgPSBAcmVzb3VyY2VDb250ZXh0XG4gICAgICAgIEBvYmplY3QucmVtb3ZlT2JqZWN0KEBvYmplY3QuY29tbW9uRXZlbnRDb250YWluZXIpXG4gICAgICAgIEBzaG93KG5vKVxuICAgICAgICBAb2JqZWN0LnZpZXdwb3J0Py5kaXNwb3NlKClcblxuICAgICAgICBmb3IgZXZlbnQgaW4gR2FtZU1hbmFnZXIuY29tbW9uRXZlbnRzXG4gICAgICAgICAgICBpZiBldmVudFxuICAgICAgICAgICAgICAgIGV2ZW50LmV2ZW50cy5vZmZCeU93bmVyKFwic3RhcnRcIiwgQG9iamVjdClcbiAgICAgICAgICAgICAgICBldmVudC5ldmVudHMub2ZmQnlPd25lcihcImZpbmlzaFwiLCBAb2JqZWN0KVxuXG4gICAgICAgIGlmIEBvYmplY3QudmlkZW9cbiAgICAgICAgICAgIEBvYmplY3QudmlkZW8uZGlzcG9zZSgpXG4gICAgICAgICAgICBAb2JqZWN0LnZpZGVvLm9uRW5kZWQoKVxuXG4gICAgICAgIHN1cGVyKClcblxuICAgIGNoYW5nZVBpY3R1cmVEb21haW46IChkb21haW4pIC0+XG4gICAgICAgIEBvYmplY3QucGljdHVyZUNvbnRhaW5lci5iZWhhdmlvci5jaGFuZ2VEb21haW4oZG9tYWluKVxuICAgICAgICBAb2JqZWN0LnBpY3R1cmVzID0gQG9iamVjdC5waWN0dXJlQ29udGFpbmVyLnN1Yk9iamVjdHNcbiAgICBjaGFuZ2VUZXh0RG9tYWluOiAoZG9tYWluKSAtPlxuICAgICAgICBAb2JqZWN0LnRleHRDb250YWluZXIuYmVoYXZpb3IuY2hhbmdlRG9tYWluKGRvbWFpbilcbiAgICAgICAgQG9iamVjdC50ZXh0cyA9IEBvYmplY3QudGV4dENvbnRhaW5lci5zdWJPYmplY3RzXG4gICAgY2hhbmdlVmlkZW9Eb21haW46IChkb21haW4pIC0+XG4gICAgICAgIEBvYmplY3QudmlkZW9Db250YWluZXIuYmVoYXZpb3IuY2hhbmdlRG9tYWluKGRvbWFpbilcbiAgICAgICAgQG9iamVjdC52aWRlb3MgPSBAb2JqZWN0LnZpZGVvQ29udGFpbmVyLnN1Yk9iamVjdHNcbiAgICBjaGFuZ2VIb3RzcG90RG9tYWluOiAoZG9tYWluKSAtPlxuICAgICAgICBAb2JqZWN0LmhvdHNwb3RDb250YWluZXIuYmVoYXZpb3IuY2hhbmdlRG9tYWluKGRvbWFpbilcbiAgICAgICAgQG9iamVjdC5ob3RzcG90cyA9IEBvYmplY3QuaG90c3BvdENvbnRhaW5lci5zdWJPYmplY3RzXG4gICAgY2hhbmdlTWVzc2FnZUFyZWFEb21haW46IChkb21haW4pIC0+XG4gICAgICAgIEBvYmplY3QubWVzc2FnZUFyZWFDb250YWluZXIuYmVoYXZpb3IuY2hhbmdlRG9tYWluKGRvbWFpbilcbiAgICAgICAgQG9iamVjdC5tZXNzYWdlQXJlYXMgPSBAb2JqZWN0Lm1lc3NhZ2VBcmVhQ29udGFpbmVyLnN1Yk9iamVjdHNcblxuICAgICMjIypcbiAgICAqIFNob3dzL0hpZGVzIHRoZSBjdXJyZW50IHNjZW5lLiBBIGhpZGRlbiBzY2VuZSBpcyBubyBsb25nZXIgc2hvd24gYW5kIGV4ZWN1dGVkXG4gICAgKiBidXQgYWxsIG9iamVjdHMgYW5kIGRhdGEgaXMgc3RpbGwgdGhlcmUgYW5kIGJlIHNob3duIGFnYWluIGFueXRpbWUuXG4gICAgKlxuICAgICogQG1ldGhvZCBzaG93XG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IHZpc2libGUgLSBJbmRpY2F0ZXMgaWYgdGhlIHNjZW5lIHNob3VsZCBiZSBzaG93biBvciBoaWRkZW4uXG4gICAgIyMjXG4gICAgc2hvdzogKHZpc2libGUpIC0+XG4gICAgICAgIGlmIHZpc2libGVcbiAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnNjZW5lVmlld3BvcnQgPSBAb2JqZWN0LnZpZXdwb3J0XG4gICAgICAgICAgICBHYW1lTWFuYWdlci5zY2VuZVZpZXdwb3J0LnRvbmUgPSBAc2NyZWVuVG9uZSB8fCBHYW1lTWFuYWdlci5zY2VuZVZpZXdwb3J0LnRvbmVcbiAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnNjZW5lVmlld3BvcnQuem9vbSA9IEBzY3JlZW5ab29tIHx8IEdhbWVNYW5hZ2VyLnNjZW5lVmlld3BvcnQuem9vbVxuICAgICAgICAgICAgR2FtZU1hbmFnZXIuc2NlbmVWaWV3cG9ydC5hbmdsZSA9IEBzY3JlZW5BbmdsZSB8fCBHYW1lTWFuYWdlci5zY2VuZVZpZXdwb3J0LmFuZ2xlXG4gICAgICAgICAgICBHYW1lTWFuYWdlci5zY2VuZVZpZXdwb3J0LmFuY2hvciA9IEBzY3JlZW5BbmNob3IgfHwgR2FtZU1hbmFnZXIuc2NlbmVWaWV3cG9ydC5hbmNob3JcbiAgICAgICAgICAgIFNjZW5lTWFuYWdlci5zY2VuZS52aWV3cG9ydD8udmlzdWFsLnNjcm9sbCA9IEBzY3JlZW5TY3JvbGwgfHwgU2NlbmVNYW5hZ2VyLnNjZW5lLnZpZXdwb3J0LnZpc3VhbC5zY3JvbGxcbiAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnNjZW5lVmlld3BvcnQudXBkYXRlKClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgaWYgR2FtZU1hbmFnZXIuc2NlbmVWaWV3cG9ydFxuICAgICAgICAgICAgICAgIEBzY3JlZW5Ub25lID0gT2JqZWN0LmNvcHkoR2FtZU1hbmFnZXIuc2NlbmVWaWV3cG9ydC50b25lKVxuICAgICAgICAgICAgICAgIEBzY3JlZW5ab29tID0gT2JqZWN0LmNvcHkoR2FtZU1hbmFnZXIuc2NlbmVWaWV3cG9ydC56b29tKVxuICAgICAgICAgICAgICAgIEBzY3JlZW5BbmdsZSA9IE9iamVjdC5jb3B5KEdhbWVNYW5hZ2VyLnNjZW5lVmlld3BvcnQuYW5nbGUpXG4gICAgICAgICAgICAgICAgQHNjcmVlbkFuY2hvciA9IE9iamVjdC5jb3B5KEdhbWVNYW5hZ2VyLnNjZW5lVmlld3BvcnQuYW5jaG9yKVxuICAgICAgICAgICAgaWYgU2NlbmVNYW5hZ2VyLnNjZW5lLnZpZXdwb3J0XG4gICAgICAgICAgICAgICAgQHNjcmVlblNjcm9sbCA9IE9iamVjdC5jb3B5KFNjZW5lTWFuYWdlci5zY2VuZS52aWV3cG9ydC52aXN1YWwuc2Nyb2xsKVxuXG4gICAgICAgIHdpbmRvdy4kZGF0YUZpZWxkcyA9IEBkYXRhRmllbGRzXG4gICAgICAgIEBvYmplY3QudmlzaWJsZSA9IHZpc2libGVcblxuICAgICAgICBAb2JqZWN0LmxheW91dD8udXBkYXRlKClcblxuICAgICAgICBAb2JqZWN0LnBpY3R1cmVDb250YWluZXIuYmVoYXZpb3Iuc2V0VmlzaWJsZSh2aXNpYmxlKVxuICAgICAgICBAb2JqZWN0LmhvdHNwb3RDb250YWluZXIuYmVoYXZpb3Iuc2V0VmlzaWJsZSh2aXNpYmxlKVxuICAgICAgICBAb2JqZWN0LnRleHRDb250YWluZXIuYmVoYXZpb3Iuc2V0VmlzaWJsZSh2aXNpYmxlKVxuICAgICAgICBAb2JqZWN0LnZpZGVvQ29udGFpbmVyLmJlaGF2aW9yLnNldFZpc2libGUodmlzaWJsZSlcbiAgICAgICAgQG9iamVjdC5tZXNzYWdlQXJlYUNvbnRhaW5lci5iZWhhdmlvci5zZXRWaXNpYmxlKHZpc2libGUpXG4gICAgICAgIEBvYmplY3Qudmlld3BvcnRDb250YWluZXIuYmVoYXZpb3Iuc2V0VmlzaWJsZSh2aXNpYmxlKVxuICAgICAgICBAb2JqZWN0LmNoYXJhY3RlckNvbnRhaW5lci5iZWhhdmlvci5zZXRWaXNpYmxlKHZpc2libGUpXG4gICAgICAgIEBvYmplY3QuYmFja2dyb3VuZENvbnRhaW5lci5iZWhhdmlvci5zZXRWaXNpYmxlKHZpc2libGUpXG5cbiAgICAgICAgQHZpZXdwb3J0Py52aXNpYmxlID0gdmlzaWJsZVxuICAgICAgICBAb2JqZWN0LmNob2ljZVdpbmRvdz8udmlzaWJsZSA9IHZpc2libGVcbiAgICAgICAgQG9iamVjdC5pbnB1dE51bWJlckJveD8udmlzaWJsZSA9IHZpc2libGVcbiAgICAgICAgQG9iamVjdC5pbnB1dFRleHRCb3g/LnZpc2libGUgPSB2aXNpYmxlXG4gICAgICAgIEBvYmplY3QuaW5wdXRUZXh0Qm94Py51cGRhdGUoKVxuICAgICAgICBAb2JqZWN0LmlucHV0TnVtYmVyQm94Py51cGRhdGUoKVxuICAgICAgICBAb2JqZWN0LmNob2ljZVdpbmRvdz8udXBkYXRlKClcblxuICAgICAgICBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3Muc2tpcCA9IG5vXG5cbiAgICAgICAgI2lmIHZpc2libGUgYW5kIEBvYmplY3QuY29tbW9uRXZlbnRDb250YWluZXIuc3ViT2JqZWN0cy5sZW5ndGggPT0gMFxuICAgICAgICBAc2V0dXBDb21tb25FdmVudHMoKVxuXG4gICAgIyMjKlxuICAgICogU2V0cyB1cCBjb21tb24gZXZlbnQgaGFuZGxpbmcuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cENvbW1vbkV2ZW50c1xuICAgICMjI1xuICAgIHNldHVwQ29tbW9uRXZlbnRzOiAtPlxuICAgICAgICBjb21tb25FdmVudHMgPSBAb2JqZWN0LnNjZW5lRGF0YT8uY29tbW9uRXZlbnRzXG5cbiAgICAgICAgaWYgY29tbW9uRXZlbnRzXG4gICAgICAgICAgICBmb3IgZXZlbnQsIGkgaW4gY29tbW9uRXZlbnRzXG4gICAgICAgICAgICAgICAgaWYgZXZlbnQgYW5kICFAb2JqZWN0LmNvbW1vbkV2ZW50Q29udGFpbmVyLnN1Yk9iamVjdHMuZmlyc3QoKGUpIC0+IGU/LnJpZCA9PSBldmVudC5yaWQpXG4gICAgICAgICAgICAgICAgICAgIEBvYmplY3QuY29tbW9uRXZlbnRDb250YWluZXIuc2V0T2JqZWN0KGV2ZW50LCBpKVxuICAgICAgICAgICAgICAgICAgICBldmVudC5iZWhhdmlvci5zZXR1cEV2ZW50SGFuZGxlcnMoKVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIGV2ZW50LmludGVycHJldGVyPy5pc1J1bm5pbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LmV2ZW50cy5lbWl0KFwic3RhcnRcIiwgZXZlbnQpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGZvciBldmVudCwgaSBpbiBHYW1lTWFuYWdlci5jb21tb25FdmVudHNcbiAgICAgICAgICAgICAgICBpZiBldmVudCBhbmQgKGV2ZW50LnJlY29yZC5zdGFydENvbmRpdGlvbiA9PSAxIG9yIGV2ZW50LnJlY29yZC5wYXJhbGxlbCkgYW5kICFAb2JqZWN0LmNvbW1vbkV2ZW50Q29udGFpbmVyLnN1Yk9iamVjdHMuZmlyc3QoKGUpIC0+IGU/LnJpZCA9PSBldmVudC5yaWQpXG4gICAgICAgICAgICAgICAgICAgIEBvYmplY3QuY29tbW9uRXZlbnRDb250YWluZXIuc2V0T2JqZWN0KGV2ZW50LCBpKVxuXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LmV2ZW50cy5vZmZCeU93bmVyKFwic3RhcnRcIiwgQG9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuZXZlbnRzLm9mZkJ5T3duZXIoXCJmaW5pc2hcIiwgQG9iamVjdClcblxuICAgICAgICAgICAgICAgICAgICBpZiBub3QgZXZlbnQucmVjb3JkLnBhcmFsbGVsXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5ldmVudHMub24gXCJzdGFydFwiLCBncy5DYWxsQmFjayhcIm9uQXV0b0NvbW1vbkV2ZW50U3RhcnRcIiwgdGhpcyksIG51bGwsIEBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LmV2ZW50cy5vbiBcImZpbmlzaFwiLCBncy5DYWxsQmFjayhcIm9uQXV0b0NvbW1vbkV2ZW50RmluaXNoXCIsIHRoaXMpLCBudWxsLCBAb2JqZWN0XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgZXZlbnQuaW50ZXJwcmV0ZXI/LmlzUnVubmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQuZXZlbnRzLmVtaXQoXCJzdGFydFwiLCBldmVudClcblxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgIyMjKlxuICAgICogU2V0cyB1cCBtYWluIGludGVycHJldGVyLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2V0dXBJbnRlcnByZXRlclxuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIHNldHVwSW50ZXJwcmV0ZXI6IC0+XG4gICAgICAgIEBvYmplY3QuY29tbWFuZHMgPSBAb2JqZWN0LnNjZW5lRG9jdW1lbnQuaXRlbXMuY29tbWFuZHNcblxuICAgICAgICBpZiBAb2JqZWN0LnNjZW5lRGF0YS5pbnRlcnByZXRlclxuICAgICAgICAgICAgQG9iamVjdC5yZW1vdmVDb21wb25lbnQoQG9iamVjdC5pbnRlcnByZXRlcilcbiAgICAgICAgICAgIEBvYmplY3QuaW50ZXJwcmV0ZXIgPSBAb2JqZWN0LnNjZW5lRGF0YS5pbnRlcnByZXRlclxuICAgICAgICAgICAgQG9iamVjdC5hZGRDb21wb25lbnQoQG9iamVjdC5pbnRlcnByZXRlcilcbiAgICAgICAgICAgICNPYmplY3QubWl4aW4oQG9iamVjdC5pbnRlcnByZXRlciwgQG9iamVjdC5zY2VuZURhdGEuaW50ZXJwcmV0ZXIsIGdzLkNvbXBvbmVudF9Db21tYW5kSW50ZXJwcmV0ZXIub2JqZWN0Q29kZWNCbGFja0xpc3QpXG4gICAgICAgICAgICBAb2JqZWN0LmludGVycHJldGVyLmNvbnRleHQuc2V0KEBvYmplY3Quc2NlbmVEb2N1bWVudC51aWQsIEBvYmplY3QpXG4gICAgICAgICAgICBAb2JqZWN0LmludGVycHJldGVyLm9iamVjdCA9IEBvYmplY3RcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQG9iamVjdC5pbnRlcnByZXRlci5zZXR1cCgpXG4gICAgICAgICAgICBAb2JqZWN0LmludGVycHJldGVyLmNvbnRleHQuc2V0KEBvYmplY3Quc2NlbmVEb2N1bWVudC51aWQsIEBvYmplY3QpXG4gICAgICAgICAgICBAb2JqZWN0LmludGVycHJldGVyLnN0YXJ0KClcblxuXG4gICAgIyMjKlxuICAgICogU2V0cyB1cCBjaGFyYWN0ZXJzIGFuZCByZXN0b3JlcyB0aGVtIGZyb20gbG9hZGVkIHNhdmUgZ2FtZSBpZiBuZWNlc3NhcnkuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cENoYXJhY3RlcnNcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBzZXR1cENoYXJhY3RlcnM6IC0+XG4gICAgICAgIGlmIEBvYmplY3Quc2NlbmVEYXRhLmNoYXJhY3RlcnM/XG4gICAgICAgICAgICBmb3IgYywgaSBpbiBAb2JqZWN0LnNjZW5lRGF0YS5jaGFyYWN0ZXJzXG4gICAgICAgICAgICAgICAgQG9iamVjdC5jaGFyYWN0ZXJDb250YWluZXIuc2V0T2JqZWN0KGMsIGkpXG5cbiAgICAgICAgQG9iamVjdC5jdXJyZW50Q2hhcmFjdGVyID0gQG9iamVjdC5zY2VuZURhdGEuY3VycmVudENoYXJhY3RlciB8fCB7IG5hbWU6IFwiXCIgfSNSZWNvcmRNYW5hZ2VyLmNoYXJhY3RlcnNbMF1cblxuXG4gICAgIyMjKlxuICAgICogU2V0cyB1cCB2aWV3cG9ydHMgYW5kIHJlc3RvcmVzIHRoZW0gZnJvbSBsb2FkZWQgc2F2ZSBnYW1lIGlmIG5lY2Vzc2FyeS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwVmlld3BvcnRzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgc2V0dXBWaWV3cG9ydHM6IC0+XG4gICAgICAgIHZpZXdwb3J0cyA9IEBvYmplY3Quc2NlbmVEYXRhPy52aWV3cG9ydHMgPyBbXVxuICAgICAgICBmb3Igdmlld3BvcnQsIGkgaW4gdmlld3BvcnRzXG4gICAgICAgICAgICBpZiB2aWV3cG9ydFxuICAgICAgICAgICAgICAgIEBvYmplY3Qudmlld3BvcnRDb250YWluZXIuc2V0T2JqZWN0KHZpZXdwb3J0LCBpKVxuICAgICMjIypcbiAgICAqIFNldHMgdXAgYmFja2dyb3VuZHMgYW5kIHJlc3RvcmVzIHRoZW0gZnJvbSBsb2FkZWQgc2F2ZSBnYW1lIGlmIG5lY2Vzc2FyeS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwQmFja2dyb3VuZHNcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBzZXR1cEJhY2tncm91bmRzOiAtPlxuICAgICAgICBiYWNrZ3JvdW5kcyA9IEBvYmplY3Quc2NlbmVEYXRhPy5iYWNrZ3JvdW5kcyA/IFtdXG4gICAgICAgIGZvciBiLCBpIGluIGJhY2tncm91bmRzXG4gICAgICAgICAgICBAb2JqZWN0LmJhY2tncm91bmRDb250YWluZXIuc2V0T2JqZWN0KGIsIGkpXG5cbiAgICAjIyMqXG4gICAgKiBTZXRzIHVwIHBpY3R1cmVzIGFuZCByZXN0b3JlcyB0aGVtIGZyb20gbG9hZGVkIHNhdmUgZ2FtZSBpZiBuZWNlc3NhcnkuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cFBpY3R1cmVzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgc2V0dXBQaWN0dXJlczogLT5cbiAgICAgICAgcGljdHVyZXMgPSBAb2JqZWN0LnNjZW5lRGF0YT8ucGljdHVyZXMgPyB7fVxuICAgICAgICBmb3IgZG9tYWluIG9mIHBpY3R1cmVzXG4gICAgICAgICAgICBAb2JqZWN0LnBpY3R1cmVDb250YWluZXIuYmVoYXZpb3IuY2hhbmdlRG9tYWluKGRvbWFpbilcbiAgICAgICAgICAgIGlmIHBpY3R1cmVzW2RvbWFpbl0gdGhlbiBmb3IgcGljdHVyZSwgaSBpbiBwaWN0dXJlc1tkb21haW5dXG4gICAgICAgICAgICAgICAgQG9iamVjdC5waWN0dXJlQ29udGFpbmVyLnNldE9iamVjdChwaWN0dXJlLCBpKVxuICAgICAgICAgICAgICAgIGlmIHBpY3R1cmU/LmltYWdlXG4gICAgICAgICAgICAgICAgICAgIHBhdGggPSBcIiN7cGljdHVyZS5pbWFnZUZvbGRlciA/IFwiR3JhcGhpY3MvUGljdHVyZXNcIn0vI3twaWN0dXJlLmltYWdlfVwiXG4gICAgICAgICAgICAgICAgICAgIEByZXNvdXJjZUNvbnRleHQuYWRkKHBhdGgsIFJlc291cmNlTWFuYWdlci5yZXNvdXJjZXNCeVBhdGhbcGF0aF0pXG5cbiAgICAjIyMqXG4gICAgKiBTZXRzIHVwIHRleHRzIGFuZCByZXN0b3JlcyB0aGVtIGZyb20gbG9hZGVkIHNhdmUgZ2FtZSBpZiBuZWNlc3NhcnkuXG4gICAgKlxuICAgICogQG1ldGhvZCBzZXR1cFRleHRzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgc2V0dXBUZXh0czogLT5cbiAgICAgICAgdGV4dHMgPSBAb2JqZWN0LnNjZW5lRGF0YT8udGV4dHMgPyB7fVxuICAgICAgICBmb3IgZG9tYWluIG9mIHRleHRzXG4gICAgICAgICAgICBAb2JqZWN0LnRleHRDb250YWluZXIuYmVoYXZpb3IuY2hhbmdlRG9tYWluKGRvbWFpbilcbiAgICAgICAgICAgIGlmIHRleHRzW2RvbWFpbl0gdGhlbiBmb3IgdGV4dCwgaSBpbiB0ZXh0c1tkb21haW5dXG4gICAgICAgICAgICAgICAgQG9iamVjdC50ZXh0Q29udGFpbmVyLnNldE9iamVjdCh0ZXh0LCBpKVxuXG4gICAgIyMjKlxuICAgICogU2V0cyB1cCB2aWRlb3MgYW5kIHJlc3RvcmVzIHRoZW0gZnJvbSBsb2FkZWQgc2F2ZSBnYW1lIGlmIG5lY2Vzc2FyeS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwVmlkZW9zXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgc2V0dXBWaWRlb3M6IC0+XG4gICAgICAgIHZpZGVvcyA9IEBvYmplY3Quc2NlbmVEYXRhPy52aWRlb3MgPyB7fVxuICAgICAgICBmb3IgZG9tYWluIG9mIHZpZGVvc1xuICAgICAgICAgICAgQG9iamVjdC52aWRlb0NvbnRhaW5lci5iZWhhdmlvci5jaGFuZ2VEb21haW4oZG9tYWluKVxuICAgICAgICAgICAgaWYgdmlkZW9zW2RvbWFpbl0gdGhlbiBmb3IgdmlkZW8sIGkgaW4gdmlkZW9zW2RvbWFpbl1cbiAgICAgICAgICAgICAgICBpZiB2aWRlb1xuICAgICAgICAgICAgICAgICAgICBwYXRoID0gXCIje3ZpZGVvLnZpZGVvRm9sZGVyID8gXCJNb3ZpZXNcIn0vI3t2aWRlby52aWRlb31cIlxuICAgICAgICAgICAgICAgICAgICBAcmVzb3VyY2VDb250ZXh0LmFkZChwYXRoLCBSZXNvdXJjZU1hbmFnZXIucmVzb3VyY2VzQnlQYXRoW3BhdGhdKVxuICAgICAgICAgICAgICAgICAgICB2aWRlby52aXNpYmxlID0geWVzXG4gICAgICAgICAgICAgICAgICAgIHZpZGVvLnVwZGF0ZSgpXG5cbiAgICAgICAgICAgICAgICBAb2JqZWN0LnZpZGVvQ29udGFpbmVyLnNldE9iamVjdCh2aWRlbywgaSlcblxuICAgICMjIypcbiAgICAqIFNldHMgdXAgaG90c3BvdHMgYW5kIHJlc3RvcmVzIHRoZW0gZnJvbSBsb2FkZWQgc2F2ZSBnYW1lIGlmIG5lY2Vzc2FyeS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwSG90c3BvdHNcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBzZXR1cEhvdHNwb3RzOiAtPlxuICAgICAgICBob3RzcG90cyA9IEBvYmplY3Quc2NlbmVEYXRhPy5ob3RzcG90cyA/IHt9XG4gICAgICAgIGZvciBkb21haW4gb2YgaG90c3BvdHNcbiAgICAgICAgICAgIEBvYmplY3QuaG90c3BvdENvbnRhaW5lci5iZWhhdmlvci5jaGFuZ2VEb21haW4oZG9tYWluKVxuICAgICAgICAgICAgaWYgaG90c3BvdHNbZG9tYWluXSB0aGVuIGZvciBob3RzcG90LCBpIGluIGhvdHNwb3RzW2RvbWFpbl1cbiAgICAgICAgICAgICAgICBAb2JqZWN0LmhvdHNwb3RDb250YWluZXIuc2V0T2JqZWN0KGhvdHNwb3QsIGkpXG5cbiAgICAjIyMqXG4gICAgKiBTZXRzIHVwIGxheW91dC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwTGF5b3V0XG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgc2V0dXBMYXlvdXQ6IC0+XG4gICAgICAgIEBkYXRhRmllbGRzID0gdWkuVUlNYW5hZ2VyLmRhdGFTb3VyY2VzW3VpLlVpRmFjdG9yeS5sYXlvdXRzLmdhbWVMYXlvdXQuZGF0YVNvdXJjZSB8fCBcImRlZmF1bHRcIl0oKVxuICAgICAgICBAZGF0YUZpZWxkcy5zY2VuZSA9IEBvYmplY3RcbiAgICAgICAgd2luZG93LiRkYXRhRmllbGRzID0gQGRhdGFGaWVsZHNcbiAgICAgICAgYWR2VmlzaWJsZSA9IEBvYmplY3QubWVzc2FnZU1vZGUgPT0gdm4uTWVzc2FnZU1vZGUuQURWXG5cbiAgICAgICAgQG9iamVjdC5sYXlvdXQgPSB1aS5VaUZhY3RvcnkuY3JlYXRlRnJvbURlc2NyaXB0b3IodWkuVWlGYWN0b3J5LmxheW91dHMuZ2FtZUxheW91dCwgQG9iamVjdClcbiAgICAgICAgQG9iamVjdC5sYXlvdXQudmlzaWJsZSA9IGFkdlZpc2libGVcbiAgICAgICAgJGdhbWVNZXNzYWdlX21lc3NhZ2UudmlzaWJsZSA9IGFkdlZpc2libGVcbiAgICAgICAgQG9iamVjdC5sYXlvdXQudWkucHJlcGFyZSgpXG5cbiAgICAgICAgQG9iamVjdC5jaG9pY2VzID0gQG9iamVjdC5zY2VuZURhdGE/LmNob2ljZXMgfHwgQG9iamVjdC5jaG9pY2VzXG4gICAgICAgIGlmIEBvYmplY3QuY2hvaWNlcz8ubGVuZ3RoID4gMFxuICAgICAgICAgICAgQHNob3dDaG9pY2VzKGdzLkNhbGxCYWNrKFwib25DaG9pY2VBY2NlcHRcIiwgQG9iamVjdC5jaG9pY2VzWzBdLmludGVycHJldGVyIHx8IEBvYmplY3QuaW50ZXJwcmV0ZXIsIHsgcG9pbnRlcjogQG9iamVjdC5pbnRlcnByZXRlci5wb2ludGVyLCBwYXJhbXM6IEBwYXJhbXMgfSkpXG5cbiAgICAgICAgaWYgQG9iamVjdC5pbnRlcnByZXRlci53YWl0aW5nRm9yLmlucHV0TnVtYmVyXG4gICAgICAgICAgICBAc2hvd0lucHV0TnVtYmVyKEdhbWVNYW5hZ2VyLnRlbXBGaWVsZHMuZGlnaXRzLCBncy5DYWxsQmFjayhcIm9uSW5wdXROdW1iZXJGaW5pc2hcIiwgQG9iamVjdC5pbnRlcnByZXRlciwgQG9iamVjdC5pbnRlcnByZXRlcikpXG5cbiAgICAgICAgaWYgQG9iamVjdC5pbnRlcnByZXRlci53YWl0aW5nRm9yLmlucHV0VGV4dFxuICAgICAgICAgICAgQHNob3dJbnB1dFRleHQoR2FtZU1hbmFnZXIudGVtcEZpZWxkcy5sZXR0ZXJzLCBncy5DYWxsQmFjayhcIm9uSW5wdXRUZXh0RmluaXNoXCIsIEBvYmplY3QuaW50ZXJwcmV0ZXIsIEBvYmplY3QuaW50ZXJwcmV0ZXIpKVxuXG4gICAgIyMjKlxuICAgICogU2V0cyB1cCB0aGUgbWFpbiB2aWV3cG9ydCAvIHNjcmVlbiB2aWV3cG9ydC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwTWFpblZpZXdwb3J0XG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgc2V0dXBNYWluVmlld3BvcnQ6IC0+XG4gICAgICAgIGlmICFAb2JqZWN0LnNjZW5lRGF0YS52aWV3cG9ydFxuICAgICAgICAgICAgaWYgU2NlbmVNYW5hZ2VyLnByZXZpb3VzU2NlbmVzLmxlbmd0aCA9PSAwIFxuICAgICAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnNjZW5lVmlld3BvcnQuZGlzcG9zZSgpXG4gICAgICAgICAgICBHYW1lTWFuYWdlci5zY2VuZVZpZXdwb3J0ID0gbmV3IGdzLk9iamVjdF9WaWV3cG9ydChuZXcgVmlld3BvcnQoMCwgMCwgR3JhcGhpY3Mud2lkdGgsIEdyYXBoaWNzLmhlaWdodCwgR3JhcGhpY3Mudmlld3BvcnQpKVxuICAgICAgICAgICAgQHZpZXdwb3J0ID0gR2FtZU1hbmFnZXIuc2NlbmVWaWV3cG9ydC52aXN1YWwudmlld3BvcnRcbiAgICAgICAgICAgIEBvYmplY3Qudmlld3BvcnQgPSBHYW1lTWFuYWdlci5zY2VuZVZpZXdwb3J0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnNjZW5lVmlld3BvcnQuZGlzcG9zZSgpXG4gICAgICAgICAgICBHYW1lTWFuYWdlci5zY2VuZVZpZXdwb3J0ID0gQG9iamVjdC5zY2VuZURhdGEudmlld3BvcnRcbiAgICAgICAgICAgIEBvYmplY3Qudmlld3BvcnQgPSBAb2JqZWN0LnNjZW5lRGF0YS52aWV3cG9ydFxuICAgICAgICAgICAgQHZpZXdwb3J0ID0gQG9iamVjdC52aWV3cG9ydC52aXN1YWwudmlld3BvcnRcbiAgICAgICAgICAgIEB2aWV3cG9ydC52aWV3cG9ydCA9IEdyYXBoaWNzLnZpZXdwb3J0XG5cbiAgICAjIyMqXG4gICAgKiBTZXRzIHVwIHNjcmVlbi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNldHVwU2NyZWVuXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgc2V0dXBTY3JlZW46IC0+XG4gICAgICAgIGlmIEBvYmplY3Quc2NlbmVEYXRhLnNjcmVlblxuICAgICAgICAgICAgQG9iamVjdC52aWV3cG9ydC5yZXN0b3JlKEBvYmplY3Quc2NlbmVEYXRhLnNjcmVlbilcblxuICAgICMjIypcbiAgICAqIFJlc3RvcmVzIG1haW4gaW50ZXJwcmV0ZXIgZnJvbSBsb2FkZWQgc2F2ZSBnYW1lLlxuICAgICpcbiAgICAqIEBtZXRob2QgcmVzdG9yZUludGVycHJldGVyXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgcmVzdG9yZUludGVycHJldGVyOiAtPlxuICAgICAgICBpZiBAb2JqZWN0LnNjZW5lRGF0YS5pbnRlcnByZXRlclxuICAgICAgICAgICAgQG9iamVjdC5pbnRlcnByZXRlci5yZXN0b3JlKClcblxuICAgICMjIypcbiAgICAqIFJlc3RvcmVzIG1lc3NhZ2UgYm94IGZyb20gbG9hZGVkIHNhdmUgZ2FtZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHJlc3RvcmVNZXNzYWdlQm94XG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgcmVzdG9yZU1lc3NhZ2VCb3g6IC0+XG4gICAgICAgIG1lc3NhZ2VCb3hlcyA9IEBvYmplY3Quc2NlbmVEYXRhPy5tZXNzYWdlQm94ZXNcbiAgICAgICAgaWYgbWVzc2FnZUJveGVzXG4gICAgICAgICAgICBmb3IgbWVzc2FnZUJveCBpbiBtZXNzYWdlQm94ZXNcbiAgICAgICAgICAgICAgICBtZXNzYWdlT2JqZWN0ID0gZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50Lm9iamVjdEJ5SWQobWVzc2FnZUJveC5pZClcbiAgICAgICAgICAgICAgICBtZXNzYWdlT2JqZWN0LnZpc2libGUgPSBtZXNzYWdlQm94LnZpc2libGVcbiAgICAgICAgICAgICAgICBpZiBtZXNzYWdlQm94Lm1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZUJveC5tZXNzYWdlLnRleHRSZW5kZXJlci5kaXNwb3NlRXZlbnRIYW5kbGVycygpXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBncy5PYmplY3RNYW5hZ2VyLmN1cnJlbnQub2JqZWN0QnlJZChtZXNzYWdlQm94Lm1lc3NhZ2UuaWQpXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UudGV4dFJlbmRlcmVyLmRpc3Bvc2UoKVxuXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5taXhpbihtZXNzYWdlLCBtZXNzYWdlQm94Lm1lc3NhZ2UsIHVpLk9iamVjdF9NZXNzYWdlLm9iamVjdENvZGVjQmxhY2tMaXN0LmNvbmNhdChbXCJvcmlnaW5cIl0pKVxuXG4gICAgICAgICAgICAgICAgICAgIGZvciBjIGluIG1lc3NhZ2UuY29tcG9uZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgYy5vYmplY3QgPSBtZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UudGV4dFJlbmRlcmVyLnNldHVwRXZlbnRIYW5kbGVycygpXG5cbiAgICAjIyMqXG4gICAgKiBSZXN0b3JlcyBtZXNzYWdlIGZyb20gbG9hZGVkIHNhdmUgZ2FtZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHJlc3RvcmVNZXNzYWdlc1xuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIHJlc3RvcmVNZXNzYWdlczogLT5cbiAgICAgICAgaWYgQG9iamVjdC5zY2VuZURhdGE/Lm1lc3NhZ2VBcmVhc1xuICAgICAgICAgICAgZm9yIGRvbWFpbiBvZiBAb2JqZWN0LnNjZW5lRGF0YS5tZXNzYWdlQXJlYXNcbiAgICAgICAgICAgICAgICBAb2JqZWN0Lm1lc3NhZ2VBcmVhQ29udGFpbmVyLmJlaGF2aW9yLmNoYW5nZURvbWFpbihkb21haW4pXG4gICAgICAgICAgICAgICAgbWVzc2FnZUFyZWFzID0gQG9iamVjdC5zY2VuZURhdGEubWVzc2FnZUFyZWFzXG4gICAgICAgICAgICAgICAgaWYgbWVzc2FnZUFyZWFzW2RvbWFpbl0gdGhlbiBmb3IgYXJlYSwgaSBpbiBtZXNzYWdlQXJlYXNbZG9tYWluXVxuICAgICAgICAgICAgICAgICAgICBpZiBhcmVhXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlQXJlYSA9IG5ldyBncy5PYmplY3RfTWVzc2FnZUFyZWEoKVxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZUxheW91dCA9IHVpLlVJTWFuYWdlci5jcmVhdGVDb250cm9sRnJvbURlc2NyaXB0b3IodHlwZTogXCJ1aS5DdXN0b21HYW1lTWVzc2FnZVwiLCBpZDogXCJjdXN0b21HYW1lTWVzc2FnZV9cIitpLCBwYXJhbXM6IHsgaWQ6IFwiY3VzdG9tR2FtZU1lc3NhZ2VfXCIraSB9LCBtZXNzYWdlQXJlYSlcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBncy5PYmplY3RNYW5hZ2VyLmN1cnJlbnQub2JqZWN0QnlJZChcImN1c3RvbUdhbWVNZXNzYWdlX1wiK2krXCJfbWVzc2FnZVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJlYS5tZXNzYWdlLnRleHRSZW5kZXJlci5kaXNwb3NlRXZlbnRIYW5kbGVycygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZS50ZXh0UmVuZGVyZXIuZGlzcG9zZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QubWl4aW4obWVzc2FnZSwgYXJlYS5tZXNzYWdlKVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIGMgaW4gbWVzc2FnZS5jb21wb25lbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYy5vYmplY3QgPSBtZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAjbWVzc2FnZS5yZXN0b3JlKGYubWVzc2FnZSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZUxheW91dC5kc3RSZWN0LnggPSBhcmVhLmxheW91dC5kc3RSZWN0LnhcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VMYXlvdXQuZHN0UmVjdC55ID0gYXJlYS5sYXlvdXQuZHN0UmVjdC55XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlTGF5b3V0LmRzdFJlY3Qud2lkdGggPSBhcmVhLmxheW91dC5kc3RSZWN0LndpZHRoXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlTGF5b3V0LmRzdFJlY3QuaGVpZ2h0ID0gYXJlYS5sYXlvdXQuZHN0UmVjdC5oZWlnaHRcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VMYXlvdXQubmVlZHNVcGRhdGUgPSB5ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UudGV4dFJlbmRlcmVyLnNldHVwRXZlbnRIYW5kbGVycygpXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlTGF5b3V0LnVwZGF0ZSgpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICNtZXNzYWdlLm1lc3NhZ2UucmVzdG9yZU1lc3NhZ2VzKGYubWVzc2FnZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAjbWVzc2FnZS50ZXh0UmVuZGVyZXIucmVzdG9yZShmLnRleHRSZW5kZXJlcilcbiAgICAgICAgICAgICAgICAgICAgICAgICNtZXNzYWdlLnZpc2libGUgPSB5ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2VBcmVhLm1lc3NhZ2UgPSBtZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlQXJlYS5sYXlvdXQgPSBtZXNzYWdlTGF5b3V0XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlQXJlYS5hZGRPYmplY3QobWVzc2FnZUxheW91dClcbiAgICAgICAgICAgICAgICAgICAgICAgIEBvYmplY3QubWVzc2FnZUFyZWFDb250YWluZXIuc2V0T2JqZWN0KG1lc3NhZ2VBcmVhLCBpKVxuXG5cblxuXG5cbiAgICAjIyMqXG4gICAgKiBSZXN0b3JlcyBhdWRpby1wbGF5YmFjayBmcm9tIGxvYWRlZCBzYXZlIGdhbWUuXG4gICAgKlxuICAgICogQG1ldGhvZCByZXN0b3JlQXVkaW9QbGF5YmFja1xuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIHJlc3RvcmVBdWRpb1BsYXliYWNrOiAtPlxuICAgICAgICBpZiBAb2JqZWN0LnNjZW5lRGF0YS5hdWRpb1xuICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLmF1ZGlvQnVmZmVycy5wdXNoKGIpIGZvciBiIGluIEBvYmplY3Quc2NlbmVEYXRhLmF1ZGlvLmF1ZGlvQnVmZmVyc1xuICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLmF1ZGlvQnVmZmVyc0J5TGF5ZXIgPSBAb2JqZWN0LnNjZW5lRGF0YS5hdWRpby5hdWRpb0J1ZmZlcnNCeUxheWVyXG4gICAgICAgICAgICBBdWRpb01hbmFnZXIuYXVkaW9MYXllcnMgPSBAb2JqZWN0LnNjZW5lRGF0YS5hdWRpby5hdWRpb0xheWVyc1xuICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLnNvdW5kUmVmZXJlbmNlcyA9IEBvYmplY3Quc2NlbmVEYXRhLmF1ZGlvLnNvdW5kUmVmZXJlbmNlc1xuXG5cbiAgICAjIyMqXG4gICAgKiBSZXN0b3JlcyB0aGUgc2NlbmUgb2JqZWN0cyBmcm9tIHRoZSBjdXJyZW50IGxvYWRlZCBzYXZlLWdhbWUuIElmIG5vIHNhdmUtZ2FtZSBpc1xuICAgICogcHJlc2VudCBpbiBHYW1lTWFuYWdlci5sb2FkZWRTYXZlR2FtZSwgbm90aGluZyB3aWxsIGhhcHBlbi5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHJlc3RvcmVTY2VuZVxuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIHJlc3RvcmVTY2VuZTogLT5cbiAgICAgICAgc2F2ZUdhbWUgPSBHYW1lTWFuYWdlci5sb2FkZWRTYXZlR2FtZVxuICAgICAgICBpZiBzYXZlR2FtZVxuICAgICAgICAgICAgY29udGV4dCA9IG5ldyBncy5PYmplY3RDb2RlY0NvbnRleHQoW0dyYXBoaWNzLnZpZXdwb3J0LCBAb2JqZWN0LCB0aGlzXSwgc2F2ZUdhbWUuZW5jb2RlZE9iamVjdFN0b3JlLCBudWxsKVxuICAgICAgICAgICAgc2F2ZUdhbWUuZGF0YSA9IGdzLk9iamVjdENvZGVjLmRlY29kZShzYXZlR2FtZS5kYXRhLCBjb250ZXh0KVxuICAgICAgICAgICAgZm9yIGMgaW4gc2F2ZUdhbWUuZGF0YS5jaGFyYWN0ZXJOYW1lc1xuICAgICAgICAgICAgICAgIGlmIGMgdGhlbiBSZWNvcmRNYW5hZ2VyLmNoYXJhY3RlcnNbYy5pbmRleF0/Lm5hbWUgPSBjLm5hbWVcbiAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnJlc3RvcmUoc2F2ZUdhbWUpXG4gICAgICAgICAgICBncy5PYmplY3RDb2RlYy5vblJlc3RvcmUoc2F2ZUdhbWUuZGF0YSwgY29udGV4dClcbiAgICAgICAgICAgIEByZXNvdXJjZUNvbnRleHQuZnJvbURhdGFCdW5kbGUoc2F2ZUdhbWUuZGF0YS5yZXNvdXJjZUNvbnRleHQsIFJlc291cmNlTWFuYWdlci5yZXNvdXJjZXNCeVBhdGgpXG5cbiAgICAgICAgICAgIEBvYmplY3Quc2NlbmVEYXRhID0gc2F2ZUdhbWUuZGF0YVxuICAgICAgICAgICAgR3JhcGhpY3MuZnJhbWVDb3VudCA9IHNhdmVHYW1lLmRhdGEuZnJhbWVDb3VudFxuXG4gICAgIyMjKlxuICAgICogUHJlcGFyZXMgYWxsIGRhdGEgZm9yIHRoZSBzY2VuZSBhbmQgbG9hZHMgdGhlIG5lY2Vzc2FyeSBncmFwaGljIGFuZCBhdWRpbyByZXNvdXJjZXMuXG4gICAgKlxuICAgICogQG1ldGhvZCBwcmVwYXJlRGF0YVxuICAgICogQGFic3RyYWN0XG4gICAgIyMjXG4gICAgcHJlcGFyZURhdGE6IC0+XG4gICAgICAgICNSZWNvcmRNYW5hZ2VyLnRyYW5zbGF0ZSgpXG5cbiAgICAgICAgR2FtZU1hbmFnZXIuc2NlbmUgPSBAb2JqZWN0XG5cbiAgICAgICAgZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50ID0gQG9iamVjdE1hbmFnZXJcblxuICAgICAgICBAb2JqZWN0LnNjZW5lRGF0YS51aWQgPSBAb2JqZWN0LnNjZW5lRG9jdW1lbnQudWlkXG5cbiAgICAgICAgaWYgIVJlc291cmNlTG9hZGVyLmxvYWRFdmVudENvbW1hbmRzRGF0YShAb2JqZWN0LnNjZW5lRG9jdW1lbnQuaXRlbXMuY29tbWFuZHMpXG4gICAgICAgICAgICBSZXNvdXJjZUxvYWRlci5sb2FkRXZlbnRDb21tYW5kc0dyYXBoaWNzKEBvYmplY3Quc2NlbmVEb2N1bWVudC5pdGVtcy5jb21tYW5kcylcbiAgICAgICAgICAgIEdhbWVNYW5hZ2VyLmJhY2tsb2cgPSBAb2JqZWN0LnNjZW5lRGF0YS5iYWNrbG9nIHx8IEdhbWVNYW5hZ2VyLnNjZW5lRGF0YS5iYWNrbG9nIHx8IFtdXG5cbiAgICAgICAgICAgIFJlc291cmNlTG9hZGVyLmxvYWRTeXN0ZW1Tb3VuZHMoKVxuICAgICAgICAgICAgUmVzb3VyY2VMb2FkZXIubG9hZFN5c3RlbUdyYXBoaWNzKClcbiAgICAgICAgICAgIFJlc291cmNlTG9hZGVyLmxvYWRVaVR5cGVzR3JhcGhpY3ModWkuVWlGYWN0b3J5LmN1c3RvbVR5cGVzKVxuICAgICAgICAgICAgUmVzb3VyY2VMb2FkZXIubG9hZFVpTGF5b3V0R3JhcGhpY3ModWkuVWlGYWN0b3J5LmxheW91dHMuZ2FtZUxheW91dClcblxuICAgICAgICAgICAgaWYgQGRhdGFGaWVsZHM/XG4gICAgICAgICAgICAgICAgUmVzb3VyY2VMb2FkZXIubG9hZFVpRGF0YUZpZWxkc0dyYXBoaWNzKEBkYXRhRmllbGRzKVxuXG4gICAgICAgICAgICAkdGVtcEZpZWxkcy5jaG9pY2VUaW1lciA9IEBvYmplY3QuY2hvaWNlVGltZXJcblxuICAgICAgICAgICAgR2FtZU1hbmFnZXIudmFyaWFibGVTdG9yZS5zZXR1cCh7IGlkOiBAb2JqZWN0LnNjZW5lRG9jdW1lbnQudWlkfSlcblxuICAgICMjIypcbiAgICAqIFByZXBhcmVzIGFsbCB2aXN1YWwgZ2FtZSBvYmplY3QgZm9yIHRoZSBzY2VuZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHByZXBhcmVWaXN1YWxcbiAgICAjIyNcbiAgICBwcmVwYXJlVmlzdWFsOiAtPlxuICAgICAgICBpZiBAb2JqZWN0LmxheW91dFxuICAgICAgICAgICAgQHRyYW5zaXRpb24oeyBkdXJhdGlvbjogMCB9KVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgaWYgR2FtZU1hbmFnZXIudGVtcEZpZWxkcy5pc0V4aXRpbmdHYW1lXG4gICAgICAgICAgICBHYW1lTWFuYWdlci50ZW1wRmllbGRzLmlzRXhpdGluZ0dhbWUgPSBub1xuICAgICAgICAgICAgZ3MuR2FtZU5vdGlmaWVyLnBvc3RSZXNldFNjZW5lQ2hhbmdlKEBvYmplY3Quc2NlbmVEb2N1bWVudC5pdGVtcy5uYW1lKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBncy5HYW1lTm90aWZpZXIucG9zdFNjZW5lQ2hhbmdlKEBvYmplY3Quc2NlbmVEb2N1bWVudC5pdGVtcy5uYW1lKVxuXG4gICAgICAgIEByZXN0b3JlU2NlbmUoKVxuICAgICAgICBAb2JqZWN0Lm1lc3NhZ2VNb2RlID0gQG9iamVjdC5zY2VuZURhdGEubWVzc2FnZU1vZGUgPyB2bi5NZXNzYWdlTW9kZS5BRFZcbiAgICAgICAgQHNldHVwTWFpblZpZXdwb3J0KClcbiAgICAgICAgQHNldHVwVmlld3BvcnRzKClcbiAgICAgICAgQHNldHVwQ2hhcmFjdGVycygpXG4gICAgICAgIEBzZXR1cEJhY2tncm91bmRzKClcbiAgICAgICAgQHNldHVwUGljdHVyZXMoKVxuICAgICAgICBAc2V0dXBUZXh0cygpXG4gICAgICAgIEBzZXR1cFZpZGVvcygpXG4gICAgICAgIEBzZXR1cEhvdHNwb3RzKClcbiAgICAgICAgQHNldHVwSW50ZXJwcmV0ZXIoKVxuICAgICAgICBAc2V0dXBMYXlvdXQoKVxuICAgICAgICBAc2V0dXBDb21tb25FdmVudHMoKVxuXG4gICAgICAgIEByZXN0b3JlTWVzc2FnZUJveCgpXG4gICAgICAgIEByZXN0b3JlSW50ZXJwcmV0ZXIoKVxuICAgICAgICBAcmVzdG9yZU1lc3NhZ2VzKClcbiAgICAgICAgQHJlc3RvcmVBdWRpb1BsYXliYWNrKClcblxuICAgICAgICBAc2hvdyh0cnVlKVxuXG4gICAgICAgIEBvYmplY3Quc2NlbmVEYXRhID0ge31cbiAgICAgICAgR2FtZU1hbmFnZXIuc2NlbmVEYXRhID0ge31cblxuICAgICAgICBHcmFwaGljcy51cGRhdGUoKVxuICAgICAgICBAdHJhbnNpdGlvbih7IGR1cmF0aW9uOiAwIH0pXG5cblxuICAgICMjIypcbiAgICAqIEFkZHMgYSBuZXcgY2hhcmFjdGVyIHRvIHRoZSBzY2VuZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIGFkZENoYXJhY3RlclxuICAgICogQHBhcmFtIHt2bi5PYmplY3RfQ2hhcmFjdGVyfSBjaGFyYWN0ZXIgLSBUaGUgY2hhcmFjdGVyIHRvIGFkZC5cbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbm9BbmltYXRpb24gLSBJbmRpY2F0ZXMgaWYgdGhlIGNoYXJhY3RlciBzaG91bGQgYmUgYWRkZWQgaW1tZWRpYXRlbHkgd2l0b3V0IGFueSBhcHBlYXItYW5pbWF0aW9uLlxuICAgICogQHBhcmFtIHtPYmplY3R9IGFuaW1hdGlvbkRhdGEgLSBDb250YWlucyB0aGUgYXBwZWFyLWFuaW1hdGlvbiBkYXRhIC0+IHsgYW5pbWF0aW9uLCBlYXNpbmcsIGR1cmF0aW9uIH0uXG4gICAgIyMjXG4gICAgYWRkQ2hhcmFjdGVyOiAoY2hhcmFjdGVyLCBub0FuaW1hdGlvbiwgYW5pbWF0aW9uRGF0YSkgLT5cbiAgICAgICAgdW5sZXNzIG5vQW5pbWF0aW9uXG4gICAgICAgICAgICBjaGFyYWN0ZXIubW90aW9uQmx1ci5zZXQoYW5pbWF0aW9uRGF0YS5tb3Rpb25CbHVyKVxuXG4gICAgICAgICAgICBpZiBhbmltYXRpb25EYXRhLmR1cmF0aW9uID4gMFxuICAgICAgICAgICAgICAgIGNoYXJhY3Rlci5hbmltYXRvci5hcHBlYXIoY2hhcmFjdGVyLmRzdFJlY3QueCwgY2hhcmFjdGVyLmRzdFJlY3QueSwgYW5pbWF0aW9uRGF0YS5hbmltYXRpb24sIGFuaW1hdGlvbkRhdGEuZWFzaW5nLCBhbmltYXRpb25EYXRhLmR1cmF0aW9uKSB1bmxlc3Mgbm9BbmltYXRpb25cblxuICAgICAgICBjaGFyYWN0ZXIudmlld3BvcnQgPSBAdmlld3BvcnRcbiAgICAgICAgY2hhcmFjdGVyLnZpc2libGUgPSB5ZXNcblxuICAgICAgICBAb2JqZWN0LmNoYXJhY3RlckNvbnRhaW5lci5hZGRPYmplY3QoY2hhcmFjdGVyKVxuXG4gICAgIyMjKlxuICAgICogUmVtb3ZlcyBhIGNoYXJhY3RlciBmcm9tIHRoZSBzY2VuZS5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHJlbW92ZUNoYXJhY3RlclxuICAgICogQHBhcmFtIHt2bi5PYmplY3RfQ2hhcmFjdGVyfSBjaGFyYWN0ZXIgLSBUaGUgY2hhcmFjdGVyIHRvIHJlbW92ZS5cbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbm9BbmltYXRpb24gLSBJbmRpY2F0ZXMgaWYgdGhlIGNoYXJhY3RlciBzaG91bGQgYmUgZGlzcG9zZWQgaW1tZWRpYXRlbHkgd2l0b3V0IGFueSBkaXNhcGVhci1hbmltYXRpb24uXG4gICAgKiBAcGFyYW0ge09iamVjdH0gYW5pbWF0aW9uRGF0YSAtIENvbnRhaW5zIHRoZSBkaXNhcHBlYXItYW5pbWF0aW9uIGRhdGEgLT4geyBhbmltYXRpb24sIGVhc2luZywgZHVyYXRpb24gfS5cbiAgICAjIyNcbiAgICByZW1vdmVDaGFyYWN0ZXI6IChjaGFyYWN0ZXIsIG5vQW5pbWF0aW9uLCBhbmltYXRpb25EYXRhKSAtPlxuICAgICAgICB1bmxlc3Mgbm9BbmltYXRpb25cbiAgICAgICAgICAgIGNoYXJhY3Rlcj8uYW5pbWF0b3IuZGlzYXBwZWFyKGFuaW1hdGlvbkRhdGEuYW5pbWF0aW9uLCBhbmltYXRpb25EYXRhLmVhc2luZywgYW5pbWF0aW9uRGF0YS5kdXJhdGlvbiwgKHNlbmRlcikgLT4gc2VuZGVyLmRpc3Bvc2UoKSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgY2hhcmFjdGVyPy5kaXNwb3NlKClcblxuICAgICMjIypcbiAgICAqIFJlc3VtZXMgdGhlIGN1cnJlbnQgc2NlbmUgaWYgaXQgaGFzIGJlZW4gcGF1c2VkLlxuICAgICpcbiAgICAqIEBtZXRob2QgcmVzdW1lU2NlbmVcbiAgICAjIyNcbiAgICByZXN1bWVTY2VuZTogLT5cbiAgICAgICAgQG9iamVjdC5waWN0dXJlQ29udGFpbmVyLmFjdGl2ZSA9IHllc1xuICAgICAgICBAb2JqZWN0LmNoYXJhY3RlckNvbnRhaW5lci5hY3RpdmUgPSB5ZXNcbiAgICAgICAgQG9iamVjdC5iYWNrZ3JvdW5kQ29udGFpbmVyLmFjdGl2ZSA9IHllc1xuICAgICAgICBAb2JqZWN0LnRleHRDb250YWluZXIuYWN0aXZlID0geWVzXG4gICAgICAgIEBvYmplY3QuaG90c3BvdENvbnRhaW5lci5hY3RpdmUgPSB5ZXNcbiAgICAgICAgQG9iamVjdC52aWRlb0NvbnRhaW5lci5hY3RpdmUgPSB5ZXNcblxuICAgICAgICBtZXNzYWdlID0gZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50Lm9iamVjdEJ5SWQoXCJnYW1lTWVzc2FnZV9tZXNzYWdlXCIpXG4gICAgICAgIG1lc3NhZ2UuYWN0aXZlID0geWVzXG5cbiAgICAjIyMqXG4gICAgKiBQYXVzZXMgdGhlIGN1cnJlbnQgc2NlbmUuIEEgcGF1c2VkIHNjZW5lIHdpbGwgbm90IGNvbnRpbnVlLCBtZXNzYWdlcywgcGljdHVyZXMsIGV0Yy4gd2lsbFxuICAgICogc3RvcCB1bnRpbCB0aGUgc2NlbmUgcmVzdW1lcy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHBhdXNlU2NlbmVcbiAgICAjIyNcbiAgICBwYXVzZVNjZW5lOiAtPlxuICAgICAgICBAb2JqZWN0LnBpY3R1cmVDb250YWluZXIuYWN0aXZlID0gbm9cbiAgICAgICAgQG9iamVjdC5jaGFyYWN0ZXJDb250YWluZXIuYWN0aXZlID0gbm9cbiAgICAgICAgQG9iamVjdC5iYWNrZ3JvdW5kQ29udGFpbmVyLmFjdGl2ZSA9IG5vXG4gICAgICAgIEBvYmplY3QudGV4dENvbnRhaW5lci5hY3RpdmUgPSBub1xuICAgICAgICBAb2JqZWN0LmhvdHNwb3RDb250YWluZXIuYWN0aXZlID0gbm9cbiAgICAgICAgQG9iamVjdC52aWRlb0NvbnRhaW5lci5hY3RpdmUgPSBub1xuXG4gICAgICAgIG1lc3NhZ2UgPSBncy5PYmplY3RNYW5hZ2VyLmN1cnJlbnQub2JqZWN0QnlJZChcImdhbWVNZXNzYWdlX21lc3NhZ2VcIilcbiAgICAgICAgbWVzc2FnZS5hY3RpdmUgPSBub1xuXG4gICAgIyMjKlxuICAgICogQ2hhbmdlcyB0aGUgdmlzaWJpbGl0eSBvZiB0aGUgZW50aXJlIGdhbWUgVUkgbGlrZSB0aGUgbWVzc2FnZSBib3hlcywgZXRjLiB0byBhbGxvd3NcbiAgICAqIHRoZSBwbGF5ZXIgdG8gc2VlIHRoZSBlbnRpcmUgc2NlbmUuIFVzZWZ1bCBmb3IgQ0dzLCBldGMuXG4gICAgKlxuICAgICogQHBhcmFtIHtib29sZWFufSB2aXNpYmxlIC0gSWYgPGI+dHJ1ZTwvYj4sIHRoZSBnYW1lIFVJIHdpbGwgYmUgdmlzaWJsZS4gT3RoZXJ3aXNlIGl0IHdpbGwgYmUgaGlkZGVuLlxuICAgICogQG1ldGhvZCBjaGFuZ2VVSVZpc2liaWxpdHlcbiAgICAjIyNcbiAgICBjaGFuZ2VVSVZpc2liaWxpdHk6ICh2aXNpYmxlKSAtPlxuICAgICAgICBAdWlWaXNpYmxlID0gdmlzaWJsZVxuICAgICAgICBAb2JqZWN0LmxheW91dC52aXNpYmxlID0gdmlzaWJsZVxuXG4gICAgIyMjKlxuICAgICogU2hvd3MgaW5wdXQtdGV4dCBib3ggdG8gbGV0IHRoZSB1c2VyIGVudGVyIGEgdGV4dC5cbiAgICAqXG4gICAgKiBAcGFyYW0ge251bWJlcn0gbGV0dGVycyAtIFRoZSBtYXguIG51bWJlciBvZiBsZXR0ZXJzIHRoZSB1c2VyIGNhbiBlbnRlci5cbiAgICAqIEBwYXJhbSB7Z3MuQ2FsbGJhY2t9IGNhbGxiYWNrIC0gQSBjYWxsYmFjayBmdW5jdGlvbiBjYWxsZWQgaWYgdGhlIGlucHV0LXRleHQgYm94IGhhcyBiZWVuIGFjY2VwdGVkIGJ5IHRoZSB1c2VyLlxuICAgICogQG1ldGhvZCBzaG93SW5wdXRUZXh0XG4gICAgIyMjXG4gICAgc2hvd0lucHV0VGV4dDogKGxldHRlcnMsIGNhbGxiYWNrKSAtPlxuICAgICAgICBAb2JqZWN0LmlucHV0VGV4dEJveD8uZGlzcG9zZSgpXG4gICAgICAgIEBvYmplY3QuaW5wdXRUZXh0Qm94ID0gdWkuVWlGYWN0b3J5LmNyZWF0ZUNvbnRyb2xGcm9tRGVzY3JpcHRvcih1aS5VaUZhY3RvcnkuY3VzdG9tVHlwZXNbXCJ1aS5JbnB1dFRleHRCb3hcIl0sIEBvYmplY3QubGF5b3V0KVxuICAgICAgICBAb2JqZWN0LmlucHV0VGV4dEJveC51aS5wcmVwYXJlKClcbiAgICAgICAgQG9iamVjdC5pbnB1dFRleHRCb3guZXZlbnRzLm9uKFwiYWNjZXB0XCIsIGNhbGxiYWNrKVxuXG4gICAgIyMjKlxuICAgICogU2hvd3MgaW5wdXQtbnVtYmVyIGJveCB0byBsZXQgdGhlIHVzZXIgZW50ZXIgYSBudW1iZXIuXG4gICAgKlxuICAgICogQHBhcmFtIHtudW1iZXJ9IGRpZ2l0cyAtIFRoZSBtYXguIG51bWJlciBvZiBkaWdpdHMgdGhlIHVzZXIgY2FuIGVudGVyLlxuICAgICogQHBhcmFtIHtncy5DYWxsYmFja30gY2FsbGJhY2sgLSBBIGNhbGxiYWNrIGZ1bmN0aW9uIGNhbGxlZCBpZiB0aGUgaW5wdXQtbnVtYmVyIGJveCBoYXMgYmVlbiBhY2NlcHRlZCBieSB0aGUgdXNlci5cbiAgICAqIEBtZXRob2Qgc2hvd0lucHV0TnVtYmVyXG4gICAgIyMjXG4gICAgc2hvd0lucHV0TnVtYmVyOiAoZGlnaXRzLCBjYWxsYmFjaykgLT5cbiAgICAgICAgQG9iamVjdC5pbnB1dE51bWJlckJveD8uZGlzcG9zZSgpXG4gICAgICAgIEBvYmplY3QuaW5wdXROdW1iZXJCb3ggPSB1aS5VaUZhY3RvcnkuY3JlYXRlQ29udHJvbEZyb21EZXNjcmlwdG9yKHVpLlVpRmFjdG9yeS5jdXN0b21UeXBlc1tcInVpLklucHV0TnVtYmVyQm94XCJdLCBAb2JqZWN0LmxheW91dClcbiAgICAgICAgQG9iamVjdC5pbnB1dE51bWJlckJveC51aS5wcmVwYXJlKClcbiAgICAgICAgQG9iamVjdC5pbnB1dE51bWJlckJveC5ldmVudHMub24oXCJhY2NlcHRcIiwgY2FsbGJhY2spXG5cbiAgICAjIyMqXG4gICAgKiBTaG93cyBjaG9pY2VzIHRvIGxldCB0aGUgdXNlciBwaWNrIGEgY2hvaWNlLlxuICAgICpcbiAgICAqIEBwYXJhbSB7T2JqZWN0W119IGNob2ljZXMgLSBBbiBhcnJheSBvZiBjaG9pY2VzXG4gICAgKiBAcGFyYW0ge2dzLkNhbGxiYWNrfSBjYWxsYmFjayAtIEEgY2FsbGJhY2sgZnVuY3Rpb24gY2FsbGVkIGlmIGEgY2hvaWNlIGhhcyBiZWVuIHBpY2tlZCBieSB0aGUgdXNlci5cbiAgICAqIEBtZXRob2Qgc2hvd0Nob2ljZXNcbiAgICAjIyNcbiAgICBzaG93Q2hvaWNlczogKGNhbGxiYWNrKSAtPlxuICAgICAgICB1c2VGcmVlTGF5b3V0ID0gQG9iamVjdC5jaG9pY2VzLndoZXJlKCh4KSAtPiB4LmRzdFJlY3Q/KS5sZW5ndGggPiAwXG5cbiAgICAgICAgQG9iamVjdC5jaG9pY2VXaW5kb3c/LmRpc3Bvc2UoKVxuXG4gICAgICAgIGlmIHVzZUZyZWVMYXlvdXRcbiAgICAgICAgICAgIEBvYmplY3QuY2hvaWNlV2luZG93ID0gdWkuVWlGYWN0b3J5LmNyZWF0ZUNvbnRyb2xGcm9tRGVzY3JpcHRvcih1aS5VaUZhY3RvcnkuY3VzdG9tVHlwZXNbXCJ1aS5GcmVlQ2hvaWNlQm94XCJdLCBAb2JqZWN0LmxheW91dClcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgQG9iamVjdC5jaG9pY2VXaW5kb3cgPSB1aS5VaUZhY3RvcnkuY3JlYXRlQ29udHJvbEZyb21EZXNjcmlwdG9yKHVpLlVpRmFjdG9yeS5jdXN0b21UeXBlc1tcInVpLkNob2ljZUJveFwiXSwgQG9iamVjdC5sYXlvdXQpXG5cbiAgICAgICAgQG9iamVjdC5jaG9pY2VXaW5kb3cuZXZlbnRzLm9uKFwic2VsZWN0aW9uQWNjZXB0XCIsIGNhbGxiYWNrKVxuICAgICAgICBAb2JqZWN0LmNob2ljZVdpbmRvdy51aS5wcmVwYXJlKClcblxuICAgICMjIypcbiAgICAqIENoYW5nZXMgdGhlIGJhY2tncm91bmQgb2YgdGhlIHNjZW5lLlxuICAgICpcbiAgICAqIEBtZXRob2QgY2hhbmdlQmFja2dyb3VuZFxuICAgICogQHBhcmFtIHtPYmplY3R9IGJhY2tncm91bmQgLSBUaGUgYmFja2dyb3VuZCBncmFwaGljIG9iamVjdCAtPiB7IG5hbWUgfVxuICAgICogQHBhcmFtIHtib29sZWFufSBub0FuaW1hdGlvbiAtIEluZGljYXRlcyBpZiB0aGUgYmFja2dyb3VuZCBzaG91bGQgYmUgY2hhbmdlZCBpbW1lZGlhdGVseSB3aXRvdXQgYW55IGNoYW5nZS1hbmltYXRpb24uXG4gICAgKiBAcGFyYW0ge09iamVjdH0gYW5pbWF0aW9uIC0gVGhlIGFwcGVhci9kaXNhcHBlYXIgYW5pbWF0aW9uIHRvIHVzZS5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBlYXNpbmcgLSBUaGUgZWFzaW5nIG9mIHRoZSBjaGFuZ2UgYW5pbWF0aW9uLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uIC0gVGhlIGR1cmF0aW9uIG9mIHRoZSBjaGFuZ2UgaW4gZnJhbWVzLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IG94IC0gVGhlIHgtb3JpZ2luIG9mIHRoZSBiYWNrZ3JvdW5kLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IG95IC0gVGhlIHktb3JpZ2luIG9mIHRoZSBiYWNrZ3JvdW5kLlxuICAgICogQHBhcmFtIHtudW1iZXJ9IGxheWVyIC0gVGhlIGJhY2tncm91bmQtbGF5ZXIgdG8gY2hhbmdlLlxuICAgICogQHBhcmFtIHtib29sZWFufSBsb29wSG9yaXpvbnRhbCAtIEluZGljYXRlcyBpZiB0aGUgYmFja2dyb3VuZCBzaG91bGQgYmUgbG9vcGVkIGhvcml6b250YWxseS5cbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbG9vcFZlcnRpY2FsIC0gSW5kaWNhdGVzIGlmIHRoZSBiYWNrZ3JvdW5kIHNob3VsZCBiZSBsb29wZWQgdmVydGljYWxseS5cbiAgICAjIyNcbiAgICBjaGFuZ2VCYWNrZ3JvdW5kOiAoYmFja2dyb3VuZCwgbm9BbmltYXRpb24sIGFuaW1hdGlvbiwgZWFzaW5nLCBkdXJhdGlvbiwgb3gsIG95LCBsYXllciwgbG9vcEhvcml6b250YWwsIGxvb3BWZXJ0aWNhbCkgLT5cbiAgICAgICAgaWYgYmFja2dyb3VuZD9cbiAgICAgICAgICAgIG90aGVyT2JqZWN0ID0gQG9iamVjdC5iYWNrZ3JvdW5kc1tsYXllcl1cbiAgICAgICAgICAgIG9iamVjdCA9IG5ldyB2bi5PYmplY3RfQmFja2dyb3VuZCgpXG4gICAgICAgICAgICBvYmplY3QuaW1hZ2UgPSBiYWNrZ3JvdW5kLm5hbWVcbiAgICAgICAgICAgIG9iamVjdC5pbWFnZUZvbGRlciA9IGJhY2tncm91bmQuZm9sZGVyUGF0aFxuICAgICAgICAgICAgb2JqZWN0Lm9yaWdpbi54ID0gb3hcbiAgICAgICAgICAgIG9iamVjdC5vcmlnaW4ueSA9IG95XG4gICAgICAgICAgICBvYmplY3Qudmlld3BvcnQgPSBAdmlld3BvcnRcbiAgICAgICAgICAgIG9iamVjdC52aXN1YWwubG9vcGluZy52ZXJ0aWNhbCA9IG5vXG4gICAgICAgICAgICBvYmplY3QudmlzdWFsLmxvb3BpbmcuaG9yaXpvbnRhbCA9IG5vXG4gICAgICAgICAgICBvYmplY3QudXBkYXRlKClcblxuICAgICAgICAgICAgQG9iamVjdC5iYWNrZ3JvdW5kQ29udGFpbmVyLnNldE9iamVjdChvYmplY3QsIGxheWVyKVxuXG4gICAgICAgICAgICBkdXJhdGlvbiA9IGR1cmF0aW9uID8gMzBcblxuICAgICAgICAgICAgb3RoZXJPYmplY3Q/LnpJbmRleCA9IGxheWVyXG4gICAgICAgICAgICBvdGhlck9iamVjdD8uYW5pbWF0b3Iub3RoZXJPYmplY3Q/LmRpc3Bvc2UoKVxuXG4gICAgICAgICAgICBpZiBkdXJhdGlvbiA9PSAwXG4gICAgICAgICAgICAgICAgb3RoZXJPYmplY3Q/LmRpc3Bvc2UoKVxuICAgICAgICAgICAgICAgIG9iamVjdC52aXN1YWwubG9vcGluZy52ZXJ0aWNhbCA9IGxvb3BWZXJ0aWNhbFxuICAgICAgICAgICAgICAgIG9iamVjdC52aXN1YWwubG9vcGluZy5ob3Jpem9udGFsID0gbG9vcEhvcml6b250YWxcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBpZiBub0FuaW1hdGlvblxuICAgICAgICAgICAgICAgICAgICBvYmplY3QudmlzdWFsLmxvb3BpbmcudmVydGljYWwgPSBsb29wVmVydGljYWxcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LnZpc3VhbC5sb29waW5nLmhvcml6b250YWwgPSBsb29wSG9yaXpvbnRhbFxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmFuaW1hdG9yLm90aGVyT2JqZWN0ID0gb3RoZXJPYmplY3RcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0LmFuaW1hdG9yLmFwcGVhcigwLCAwLCBhbmltYXRpb24sIGVhc2luZywgZHVyYXRpb24sIChzZW5kZXIpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBzZW5kZXIudXBkYXRlKClcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbmRlci5hbmltYXRvci5vdGhlck9iamVjdD8uZGlzcG9zZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICBzZW5kZXIuYW5pbWF0b3Iub3RoZXJPYmplY3QgPSBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZW5kZXIudmlzdWFsLmxvb3BpbmcudmVydGljYWwgPSBsb29wVmVydGljYWxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbmRlci52aXN1YWwubG9vcGluZy5ob3Jpem9udGFsID0gbG9vcEhvcml6b250YWxcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBAb2JqZWN0LmJhY2tncm91bmRzW2xheWVyXT8uYW5pbWF0b3IuaGlkZSBkdXJhdGlvbiwgZWFzaW5nLCAgPT5cbiAgICAgICAgICAgICAgIEBvYmplY3QuYmFja2dyb3VuZHNbbGF5ZXJdLmRpc3Bvc2UoKVxuICAgICAgICAgICAgICAgQG9iamVjdC5iYWNrZ3JvdW5kc1tsYXllcl0gPSBudWxsXG5cblxuICAgICMjIypcbiAgICAqIFNraXBzIGFsbCB2aWV3cG9ydCBhbmltYXRpb25zIGV4Y2VwdCB0aGUgbWFpbiB2aWV3cG9ydCBhbmltYXRpb24uXG4gICAgKlxuICAgICogQG1ldGhvZCBza2lwVmlld3BvcnRzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgc2tpcFZpZXdwb3J0czogLT5cbiAgICAgICAgdmlld3BvcnRzID0gQG9iamVjdC52aWV3cG9ydENvbnRhaW5lci5zdWJPYmplY3RzXG4gICAgICAgIGZvciB2aWV3cG9ydCBpbiB2aWV3cG9ydHNcbiAgICAgICAgICAgIGlmIHZpZXdwb3J0XG4gICAgICAgICAgICAgICAgZm9yIGNvbXBvbmVudCBpbiB2aWV3cG9ydC5jb21wb25lbnRzXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5za2lwPygpXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAjIyMqXG4gICAgKiBTa2lwcyBhbGwgcGljdHVyZSBhbmltYXRpb25zLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2tpcFBpY3R1cmVzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgc2tpcFBpY3R1cmVzOiAtPlxuICAgICAgICBmb3IgcGljdHVyZSBpbiBAb2JqZWN0LnBpY3R1cmVzXG4gICAgICAgICAgICBpZiBwaWN0dXJlXG4gICAgICAgICAgICAgICAgZm9yIGNvbXBvbmVudCBpbiBwaWN0dXJlLmNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LnNraXA/KClcbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICMjIypcbiAgICAqIFNraXBzIGFsbCB0ZXh0IGFuaW1hdGlvbnMuXG4gICAgKlxuICAgICogQG1ldGhvZCBza2lwVGV4dHNcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBza2lwVGV4dHM6IC0+XG4gICAgICAgZm9yIHRleHQgaW4gQG9iamVjdC50ZXh0c1xuICAgICAgICAgICAgaWYgdGV4dFxuICAgICAgICAgICAgICAgIGZvciBjb21wb25lbnQgaW4gdGV4dC5jb21wb25lbnRzXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5za2lwPygpXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAjIyMqXG4gICAgKiBTa2lwcyBhbGwgdmlkZW8gYW5pbWF0aW9ucyBidXQgbm90IHRoZSB2aWRlby1wbGF5YmFjayBpdHNlbGYuXG4gICAgKlxuICAgICogQG1ldGhvZCBza2lwVmlkZW9zXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgc2tpcFZpZGVvczogLT5cbiAgICAgICAgZm9yIHZpZGVvIGluIEBvYmplY3QudmlkZW9zXG4gICAgICAgICAgICBpZiB2aWRlb1xuICAgICAgICAgICAgICAgIGZvciBjb21wb25lbnQgaW4gdmlkZW8uY29tcG9uZW50c1xuICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQuc2tpcD8oKVxuICAgICAgICByZXR1cm4gbnVsbFxuXG4gICAgIyMjKlxuICAgICogU2tpcHMgYWxsIGJhY2tncm91bmQgYW5pbWF0aW9ucy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNraXBCYWNrZ3JvdW5kc1xuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIHNraXBCYWNrZ3JvdW5kczogLT5cbiAgICAgICAgZm9yIGJhY2tncm91bmQgaW4gQG9iamVjdC5iYWNrZ3JvdW5kc1xuICAgICAgICAgICAgaWYgYmFja2dyb3VuZFxuICAgICAgICAgICAgICAgIGZvciBjb21wb25lbnQgaW4gYmFja2dyb3VuZC5jb21wb25lbnRzXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5za2lwPygpXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAjIyMqXG4gICAgKiBTa2lwcyBhbGwgY2hhcmFjdGVyIGFuaW1hdGlvbnNcbiAgICAqXG4gICAgKiBAbWV0aG9kIHNraXBDaGFyYWN0ZXJzXG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgc2tpcENoYXJhY3RlcnM6IC0+XG4gICAgICAgIGZvciBjaGFyYWN0ZXIgaW4gQG9iamVjdC5jaGFyYWN0ZXJzXG4gICAgICAgICAgICBpZiBjaGFyYWN0ZXJcbiAgICAgICAgICAgICAgICBmb3IgY29tcG9uZW50IGluIGNoYXJhY3Rlci5jb21wb25lbnRzXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5za2lwPygpXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAjIyMqXG4gICAgKiBTa2lwcyB0aGUgbWFpbiB2aWV3cG9ydCBhbmltYXRpb24uXG4gICAgKlxuICAgICogQG1ldGhvZCBza2lwTWFpblZpZXdwb3J0XG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgc2tpcE1haW5WaWV3cG9ydDogLT5cbiAgICAgICAgZm9yIGNvbXBvbmVudCBpbiBAb2JqZWN0LnZpZXdwb3J0LmNvbXBvbmVudHNcbiAgICAgICAgICAgIGNvbXBvbmVudC5za2lwPygpXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAjIyMqXG4gICAgKiBTa2lwcyBhbGwgYW5pbWF0aW9ucyBvZiBhbGwgbWVzc2FnZSBib3hlcyBkZWZpbmVkIGluIE1FU1NBR0VfQk9YX0lEUyB1aSBjb25zdGFudC5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNraXBNZXNzYWdlQm94ZXNcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBza2lwTWVzc2FnZUJveGVzOiAtPlxuICAgICAgICBmb3IgbWVzc2FnZUJveElkIGluIGdzLlVJQ29uc3RhbnRzLk1FU1NBR0VfQk9YX0lEUyB8fCBbXCJtZXNzYWdlQm94XCIsIFwibnZsTWVzc2FnZUJveFwiXVxuICAgICAgICAgICAgbWVzc2FnZUJveCA9IGdzLk9iamVjdE1hbmFnZXIuY3VycmVudC5vYmplY3RCeUlkKG1lc3NhZ2VCb3hJZClcbiAgICAgICAgICAgIGlmIG1lc3NhZ2VCb3guY29tcG9uZW50c1xuICAgICAgICAgICAgICAgIGZvciBjb21wb25lbnQgaW4gbWVzc2FnZUJveC5jb21wb25lbnRzXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudC5za2lwPygpXG4gICAgICAgIHJldHVybiBudWxsXG5cbiAgICAjIyMqXG4gICAgKiBTa2lwcyBhbGwgYW5pbWF0aW9ucyBvZiBhbGwgbWVzc2FnZSBhcmVhcy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNraXBNZXNzYWdlQXJlYXNcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBza2lwTWVzc2FnZUFyZWFzOiAtPlxuICAgICAgICBmb3IgbWVzc2FnZUFyZWEgaW4gQG9iamVjdC5tZXNzYWdlQXJlYXNcbiAgICAgICAgICAgIGlmIG1lc3NhZ2VBcmVhPy5tZXNzYWdlXG4gICAgICAgICAgICAgICAgZm9yIGNvbXBvbmVudCBpbiBtZXNzYWdlQXJlYS5tZXNzYWdlLmNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50LnNraXA/KClcblxuICAgICAgICBtc2cgPSBncy5PYmplY3RNYW5hZ2VyLmN1cnJlbnQub2JqZWN0QnlJZChcImdhbWVNZXNzYWdlX21lc3NhZ2VcIilcbiAgICAgICAgaWYgbXNnXG4gICAgICAgICAgICBmb3IgY29tcG9uZW50IGluIG1zZy5jb21wb25lbnRzXG4gICAgICAgICAgICAgICAgY29tcG9uZW50LnNraXA/KClcbiAgICAgICAgbXNnID0gZ3MuT2JqZWN0TWFuYWdlci5jdXJyZW50Lm9iamVjdEJ5SWQoXCJudmxHYW1lTWVzc2FnZV9tZXNzYWdlXCIpXG4gICAgICAgIGlmIG1zZ1xuICAgICAgICAgICAgZm9yIGNvbXBvbmVudCBpbiBtc2cuY29tcG9uZW50c1xuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5za2lwPygpXG5cbiAgICAgICAgcmV0dXJuIG51bGxcblxuICAgICMjIypcbiAgICAqIFNraXBzIHRoZSBzY2VuZSBpbnRlcnByZXRlciB0aW1lci5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHNraXBJbnRlcnByZXRlclxuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIHNraXBJbnRlcnByZXRlcjogLT5cbiAgICAgICAgaWYgQG9iamVjdC5pbnRlcnByZXRlci53YWl0Q291bnRlciA+IEdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5ncy5za2lwVGltZVxuICAgICAgICAgICAgQG9iamVjdC5pbnRlcnByZXRlci53YWl0Q291bnRlciA9IEdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5ncy5za2lwVGltZVxuICAgICAgICAgICAgaWYgQG9iamVjdC5pbnRlcnByZXRlci53YWl0Q291bnRlciA9PSAwXG4gICAgICAgICAgICAgICAgQG9iamVjdC5pbnRlcnByZXRlci5pc1dhaXRpbmcgPSBub1xuXG4gICAgIyMjKlxuICAgICogU2tpcHMgdGhlIGludGVycHJldGVyIHRpbWVyIG9mIGFsbCBjb21tb24gZXZlbnRzLlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2tpcENvbW1vbkV2ZW50c1xuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIHNraXBDb21tb25FdmVudHM6IC0+XG4gICAgICAgIGV2ZW50cyA9IEBvYmplY3QuY29tbW9uRXZlbnRDb250YWluZXIuc3ViT2JqZWN0c1xuICAgICAgICBmb3IgZXZlbnQgaW4gZXZlbnRzXG4gICAgICAgICAgICBpZiBldmVudD8uaW50ZXJwcmV0ZXIgYW5kIGV2ZW50LmludGVycHJldGVyLndhaXRDb3VudGVyID4gR2FtZU1hbmFnZXIudGVtcFNldHRpbmdzLnNraXBUaW1lXG4gICAgICAgICAgICAgICAgZXZlbnQuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgPSBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3Muc2tpcFRpbWVcbiAgICAgICAgICAgICAgICBpZiBldmVudC5pbnRlcnByZXRlci53YWl0Q291bnRlciA9PSAwXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LmludGVycHJldGVyLmlzV2FpdGluZyA9IG5vXG5cbiAgICAjIyMqXG4gICAgKiBTa2lwcyB0aGUgc2NlbmUncyBjb250ZW50LlxuICAgICpcbiAgICAqIEBtZXRob2Qgc2tpcENvbnRlbnRcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICBza2lwQ29udGVudDogLT5cbiAgICAgICAgQHNraXBQaWN0dXJlcygpXG4gICAgICAgIEBza2lwVGV4dHMoKVxuICAgICAgICBAc2tpcFZpZGVvcygpXG4gICAgICAgIEBza2lwQmFja2dyb3VuZHMoKVxuICAgICAgICBAc2tpcENoYXJhY3RlcnMoKVxuICAgICAgICBAc2tpcE1haW5WaWV3cG9ydCgpXG4gICAgICAgIEBza2lwVmlld3BvcnRzKClcbiAgICAgICAgQHNraXBNZXNzYWdlQm94ZXMoKVxuICAgICAgICBAc2tpcE1lc3NhZ2VBcmVhcygpXG4gICAgICAgIEBza2lwSW50ZXJwcmV0ZXIoKVxuICAgICAgICBAc2tpcENvbW1vbkV2ZW50cygpXG5cblxuICAgICMjIypcbiAgICAqIENoZWNrcyBmb3IgdGhlIHNob3J0Y3V0IHRvIGhpZGUvc2hvdyB0aGUgZ2FtZSBVSS4gQnkgZGVmYXVsdCwgdGhpcyBpcyB0aGUgc3BhY2Uta2V5LiBZb3VcbiAgICAqIGNhbiBvdmVycmlkZSB0aGlzIG1ldGhvZCB0byBjaGFuZ2UgdGhlIHNob3J0Y3V0LlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlVUlWaXNpYmlsaXR5U2hvcnRjdXRcbiAgICAqIEBwcm90ZWN0ZWRcbiAgICAjIyNcbiAgICB1cGRhdGVVSVZpc2liaWxpdHlTaG9ydGN1dDogLT5cbiAgICAgICAgaWYgIUB1aVZpc2libGUgYW5kIChJbnB1dC50cmlnZ2VyKElucHV0LkMpIG9yIElucHV0Lk1vdXNlLmJ1dHRvbkRvd24pXG4gICAgICAgICAgICBAY2hhbmdlVUlWaXNpYmlsaXR5KCFAdWlWaXNpYmxlKVxuICAgICAgICBpZiBJbnB1dC50cmlnZ2VyKElucHV0LktFWV9TUEFDRSlcbiAgICAgICAgICAgIEBjaGFuZ2VVSVZpc2liaWxpdHkoIUB1aVZpc2libGUpXG5cbiAgICAjIyMqXG4gICAgKiBDaGVja3MgZm9yIHRoZSBzaG9ydGN1dCB0byBleGl0IHRoZSBnYW1lLiBCeSBkZWZhdWx0LCB0aGlzIGlzIHRoZSBlc2NhcGUta2V5LiBZb3VcbiAgICAqIGNhbiBvdmVycmlkZSB0aGlzIG1ldGhvZCB0byBjaGFuZ2UgdGhlIHNob3J0Y3V0LlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlUXVpdFNob3J0Y3V0XG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgdXBkYXRlUXVpdFNob3J0Y3V0OiAtPlxuICAgICAgICBpZiBJbnB1dC50cmlnZ2VyKElucHV0LktFWV9FU0NBUEUpXG4gICAgICAgICAgICBncy5BcHBsaWNhdGlvbi5leGl0KClcblxuXG4gICAgIyMjKlxuICAgICogQ2hlY2tzIGZvciB0aGUgc2hvcnRjdXQgdG8gb3BlbiB0aGUgc2V0dGluZ3MgbWVudS4gQnkgZGVmYXVsdCwgdGhpcyBpcyB0aGUgcy1rZXkuIFlvdVxuICAgICogY2FuIG92ZXJyaWRlIHRoaXMgbWV0aG9kIHRvIGNoYW5nZSB0aGUgc2hvcnRjdXQuXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVTZXR0aW5nc1Nob3J0Y3V0XG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgdXBkYXRlU2V0dGluZ3NTaG9ydGN1dDogLT5cbiAgICAgICAgaWYgR2FtZU1hbmFnZXIudGVtcFNldHRpbmdzLm1lbnVBY2Nlc3MgYW5kIElucHV0LnRyaWdnZXIoSW5wdXQuWClcbiAgICAgICAgICAgIFNjZW5lTWFuYWdlci5zd2l0Y2hUbyhuZXcgZ3MuT2JqZWN0X0xheW91dChcInNldHRpbmdzTWVudUxheW91dFwiKSwgdHJ1ZSlcblxuICAgICMjIypcbiAgICAqIENoZWNrcyBmb3IgdGhlIHNob3J0Y3V0IHRvIG9wZW4gdGhlIHNldHRpbmdzIG1lbnUuIEJ5IGRlZmF1bHQsIHRoaXMgaXMgdGhlIGNvbnRyb2wta2V5LiBZb3VcbiAgICAqIGNhbiBvdmVycmlkZSB0aGlzIG1ldGhvZCB0byBjaGFuZ2UgdGhlIHNob3J0Y3V0LlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlU2tpcFNob3J0Y3V0XG4gICAgKiBAcHJvdGVjdGVkXG4gICAgIyMjXG4gICAgdXBkYXRlU2tpcFNob3J0Y3V0OiAtPlxuICAgICAgICBpZiBAb2JqZWN0LnNldHRpbmdzLmFsbG93U2tpcFxuICAgICAgICAgICAgaWYgSW5wdXQua2V5c1tJbnB1dC5LRVlfQ09OVFJPTF0gPT0gMVxuICAgICAgICAgICAgICAgIEdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5ncy5za2lwID0geWVzXG4gICAgICAgICAgICBlbHNlIGlmIElucHV0LmtleXNbSW5wdXQuS0VZX0NPTlRST0xdID09IDJcbiAgICAgICAgICAgICAgICBHYW1lTWFuYWdlci50ZW1wU2V0dGluZ3Muc2tpcCA9IG5vXG5cbiAgICAjIyMqXG4gICAgKiBDaGVja3MgZm9yIGRlZmF1bHQga2V5Ym9hcmQgc2hvcnRjdXRzIGUuZyBzcGFjZS1rZXkgdG8gaGlkZSB0aGUgVUksIGV0Yy5cbiAgICAqXG4gICAgKiBAbWV0aG9kIHVwZGF0ZVNob3J0Y3V0c1xuICAgICogQHByb3RlY3RlZFxuICAgICMjI1xuICAgIHVwZGF0ZVNob3J0Y3V0czogLT5cbiAgICAgICAgcmV0dXJuIGlmICFAb2JqZWN0LmNhblJlY2VpdmVJbnB1dCgpXG4gICAgICAgIEB1cGRhdGVTZXR0aW5nc1Nob3J0Y3V0KClcbiAgICAgICAgQHVwZGF0ZVF1aXRTaG9ydGN1dCgpXG4gICAgICAgIEB1cGRhdGVVSVZpc2liaWxpdHlTaG9ydGN1dCgpXG4gICAgICAgIEB1cGRhdGVTa2lwU2hvcnRjdXQoKVxuXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgZnVsbCBzY3JlZW4gdmlkZW8gcGxheWVkIHZpYSBQbGF5IE1vdmllIGNvbW1hbmQuXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVWaWRlb1xuICAgICMjI1xuICAgIHVwZGF0ZVZpZGVvOiAtPlxuICAgICAgICBpZiBAb2JqZWN0LnZpZGVvP1xuICAgICAgICAgICAgQG9iamVjdC52aWRlby51cGRhdGUoKVxuICAgICAgICAgICAgaWYgQG9iamVjdC5zZXR0aW5ncy5hbGxvd1ZpZGVvU2tpcCBhbmQgKElucHV0LnRyaWdnZXIoSW5wdXQuQykgb3IgSW5wdXQuTW91c2UuYnV0dG9uc1tJbnB1dC5Nb3VzZS5MRUZUXSA9PSAyKVxuICAgICAgICAgICAgICAgIEBvYmplY3QudmlkZW8uc3RvcCgpXG4gICAgICAgICAgICBJbnB1dC5jbGVhcigpXG5cbiAgICAjIyMqXG4gICAgKiBVcGRhdGVzIHNraXBwaW5nIGlmIGVuYWJsZWQuXG4gICAgKlxuICAgICogQG1ldGhvZCB1cGRhdGVTa2lwcGluZ1xuICAgICMjI1xuICAgIHVwZGF0ZVNraXBwaW5nOiAtPlxuICAgICAgICBpZiAhQG9iamVjdC5zZXR0aW5ncy5hbGxvd1NraXBcbiAgICAgICAgICAgIEBvYmplY3QudGVtcFNldHRpbmdzLnNraXAgPSBub1xuXG4gICAgICAgIGlmIEdhbWVNYW5hZ2VyLnRlbXBTZXR0aW5ncy5za2lwXG4gICAgICAgICAgICBAc2tpcENvbnRlbnQoKVxuXG4gICAgIyMjKlxuICAgICogVXBkYXRlcyB0aGUgc2NlbmUncyBjb250ZW50LlxuICAgICpcbiAgICAqIEBtZXRob2QgdXBkYXRlQ29udGVudFxuICAgICMjI1xuICAgIHVwZGF0ZUNvbnRlbnQ6IC0+XG4gICAgICAgICNpZiAhQG9iamVjdC5pbnRlcnByZXRlci5pc1J1bm5pbmcgYW5kICFHcmFwaGljcy5mcm96ZW5cbiAgICAgICAgIyAgICBAc2V0dXBJbnRlcnByZXRlcigpXG4gICAgICAgIEdhbWVNYW5hZ2VyLnNjZW5lID0gQG9iamVjdFxuICAgICAgICBHcmFwaGljcy52aWV3cG9ydC51cGRhdGUoKVxuICAgICAgICBAb2JqZWN0LnZpZXdwb3J0LnVwZGF0ZSgpXG5cbiAgICAgICAgQHVwZGF0ZVNraXBwaW5nKClcbiAgICAgICAgQHVwZGF0ZVZpZGVvKClcbiAgICAgICAgQHVwZGF0ZVNob3J0Y3V0cygpXG5cbiAgICAgICAgc3VwZXIoKVxuXG52bi5Db21wb25lbnRfR2FtZVNjZW5lQmVoYXZpb3IgPSBDb21wb25lbnRfR2FtZVNjZW5lQmVoYXZpb3IiXX0=
//# sourceURL=Component_GameSceneBehavior_42.js