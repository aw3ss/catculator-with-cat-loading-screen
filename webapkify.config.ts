/**
 * @file webapkify configuration file
 * @instructions Edit the properties below, then run: webapkify build [--release]
 * @details Hover over each property for more info.
 * @see https://npmjs.com/package/webapkify for full documentation
 */

import type { WebAPKifyConfig } from 'webapkify'

export default {
  // -- Identity --------------------------------------------------------------
  appName: 'Catculator',
  appId: 'com.aw3ss.catculator',
  versionCode: 1,
  versionName: '1.0.0',
  artifact: 'catculator',

  // -- Source ----------------------------------------------------------------
  webDir: './dist',

  // -- SDK -------------------------------------------------------------------
  minSdk: 26,
  compileSdk: 35,
  targetSdk: 35,
  buildToolsVersion: '35.0.0',

  // -- Icons -----------------------------------------------------------------
  icon: './icon.png',
  // adaptiveIconForeground: './icon-fg.png',
  // monochromeIcon: './icon-mono.png',
  adaptiveIconBackground: '#fce4ec',

  // -- App -------------------------------------------------------------------
  orientation: 'portrait',
  statusBar: 'default',
  themeColor: '#fce4ec',
  backgroundColor: '#fce4ec',
  allowBackup: true,
  hardwareAccelerated: true,
  keepScreenOn: false,
  supportsRtl: true,

  // -- WebView ---------------------------------------------------------------
  webview: {
    javaScriptEnabled: true,
    domStorageEnabled: true,     
    allowFileAccessFromFileURLs: false,
    allowUniversalAccessFromFileURLs: false,
    useWideViewPort: true,
    loadWithOverviewMode: true,
    builtInZoomControls: false,
    displayZoomControls: false,
    mediaPlaybackRequiresUserGesture: true,
    safeBrowsingEnabled: true,
    forceDark: 'AUTO',            
    algorithmicDarkeningAllowed: false,
    acceptCookies: true,
    acceptThirdPartyCookies: false,
  },

  // -- Permissions -----------------------------------------------------------
  permissions: {
    internet: true,
    networkState: true,
  },

  // -- Signing  --------------------------------
  // signing: {
  //   storeFile: './release.jks',
  //   storePassword: 'change-me',
  //   keyAlias: 'release',
  //   keyPassword: 'change-me',
  //   v1SigningEnabled: true,
  //   v2SigningEnabled: true,
  //   v3SigningEnabled: true,
  // },

  // -- Build -----------------------------------------------------------------
  build: {
    minifyEnabled: false,
    shrinkResources: false,
    jvmTarget: '17',
    kotlinVersion: '2.0.21',
    agpVersion: '8.7.3',
  },
} satisfies WebAPKifyConfig
