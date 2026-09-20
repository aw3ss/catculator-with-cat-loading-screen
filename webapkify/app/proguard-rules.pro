# WebAPKify ProGuard / R8 rules
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keep public class * extends android.app.Activity
-keep public class * extends android.webkit.WebViewClient
-keep public class * extends android.webkit.WebChromeClient