# AndroidManifest.xml permissions to verify after Capacitor creates Android project

Capacitor normally adds some permissions, but verify these exist in:

android/app/src/main/AndroidManifest.xml

Add if missing:

<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

For Android 13+, POST_NOTIFICATIONS is needed for push notifications.
For Google Play, background location requires justification and policy review.
