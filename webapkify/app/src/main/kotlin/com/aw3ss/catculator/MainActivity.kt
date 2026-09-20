package com.aw3ss.catculator

import android.annotation.SuppressLint
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.webkit.CookieManager
import android.webkit.GeolocationPermissions
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.webkit.WebSettingsCompat
import androidx.webkit.WebViewFeature

/**
 * WebAPKify - generated MainActivity
 * Serves the bundled web app inside a hardware-accelerated, full-screen WebView.
 *
 * Runtime-requestable permissions enabled in webapkify.config.ts are checked on launch.
 * Missing permissions are requested once at startup before the initial WebView load.
 */
class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    private var launchState: Bundle? = null
    private var webViewInitialized = false

    private val runtimePermissions: List<String>
        get() = buildList {

        }

    private val permissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions(),
    ) {
        continueStartup()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        launchState = savedInstanceState

        webView = WebView(this)
        setContentView(webView)
        requestLaunchPermissionsOrContinue()
    }

    private fun requestLaunchPermissionsOrContinue() {
        val missingPermissions = runtimePermissions.filter { permission ->
            ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED
        }

        if (missingPermissions.isEmpty()) {
            continueStartup()
            return
        }

        permissionLauncher.launch(missingPermissions.toTypedArray())
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun continueStartup() {
        if (!webViewInitialized) {
            configureWebView()
            webViewInitialized = true
        }

        if (launchState != null) {
            webView.restoreState(launchState!!)
            launchState = null
            return
        }

        if (webView.url == null) {
            webView.loadUrl("file:///android_asset/www/index.html")
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun configureWebView() {
        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.javaScriptCanOpenWindowsAutomatically = false
        settings.domStorageEnabled = true
        settings.databaseEnabled = false
        settings.loadsImagesAutomatically = true
        settings.blockNetworkImage = false
        settings.blockNetworkLoads = false
        settings.mediaPlaybackRequiresUserGesture = true
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = true
        settings.builtInZoomControls = false
        settings.displayZoomControls = false
        settings.textZoom = 100
        settings.cacheMode = WebSettings.LOAD_DEFAULT
        settings.allowFileAccessFromFileURLs = false
        @Suppress("DEPRECATION")
        settings.allowUniversalAccessFromFileURLs = false
        settings.safeBrowsingEnabled = true
        settings.mixedContentMode = if (false) {
            WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        } else {
            WebSettings.MIXED_CONTENT_NEVER_ALLOW
        }
        settings.setGeolocationEnabled(false)

        // userAgentString: using system default

        if (WebViewFeature.isFeatureSupported(WebViewFeature.FORCE_DARK)) {
            WebSettingsCompat.setForceDark(settings, WebSettingsCompat.FORCE_DARK_AUTO)
        }

        if (WebViewFeature.isFeatureSupported(WebViewFeature.ALGORITHMIC_DARKENING)) {
            WebSettingsCompat.setAlgorithmicDarkeningAllowed(settings, false)
        }

        val cookieManager = CookieManager.getInstance()
        cookieManager.setAcceptCookie(true)
        cookieManager.setAcceptThirdPartyCookies(webView, false)

        webView.webViewClient = WebViewClient()
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        if (::webView.isInitialized) {
            webView.saveState(outState)
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (::webView.isInitialized && webView.canGoBack()) {
            webView.goBack()
            return
        }

        @Suppress("DEPRECATION")
        super.onBackPressed()
    }
}