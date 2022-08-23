/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CSM_LOG_LEVEL = exports.CSM_LOG_LEVEL_OFF = exports.CSM_LOG_LEVEL_ERROR = exports.CSM_LOG_LEVEL_WARNING = exports.CSM_LOG_LEVEL_INFO = exports.CSM_LOG_LEVEL_DEBUG = exports.CSM_LOG_LEVEL_VERBOSE = void 0;
    //========================================================
    //  ログ出力関数の設定
    //========================================================
    //---------- ログ出力レベル 選択項目 定義 ----------
    // 詳細ログ出力設定
    exports.CSM_LOG_LEVEL_VERBOSE = 0;
    // デバッグログ出力設定
    exports.CSM_LOG_LEVEL_DEBUG = 1;
    // Infoログ出力設定
    exports.CSM_LOG_LEVEL_INFO = 2;
    // 警告ログ出力設定
    exports.CSM_LOG_LEVEL_WARNING = 3;
    // エラーログ出力設定
    exports.CSM_LOG_LEVEL_ERROR = 4;
    // ログ出力オフ設定
    exports.CSM_LOG_LEVEL_OFF = 5;
    /**
     * ログ出力レベル設定。
     *
     * 強制的にログ出力レベルを変える時に定義を有効にする。
     * CSM_LOG_LEVEL_VERBOSE ～ CSM_LOG_LEVEL_OFF を選択する。
     */
    exports.CSM_LOG_LEVEL = exports.CSM_LOG_LEVEL_VERBOSE;
});
//# sourceMappingURL=cubismframeworkconfig.js.map