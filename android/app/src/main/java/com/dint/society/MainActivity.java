package com.dint.society;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import com.google.firebase.FirebaseApp;
import com.oney.WebRTCModule.WebRTCModuleOptions;

import android.app.ActivityManager;
import android.content.Context;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;

import java.util.List;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Dint";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
//    FirebaseApp.initializeApp(this);
    WebRTCModuleOptions options = WebRTCModuleOptions.getInstance();
    options.enableMediaProjectionService = true;
    Log.d("ActivityState", "Current State in start: " );
  }

  @Override
  protected void onPause() {
    super.onPause();
    Log.d("ActivityState", "Current State in onPause: " );
  }

  @Override
  protected void onStop() {
    super.onStop();
    Log.d("ActivityState", "Current State in onStop: " );
  }

  @Override
  protected void onDestroy() {
    super.onDestroy();
    Log.d("ActivityState", "Current State in onDestroy: " );
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled(), // fabricEnabled
        // If you opted-in for the New Architecture, we enable Concurrent React (i.e. React 18).
        DefaultNewArchitectureEntryPoint.getConcurrentReactEnabled() // concurrentRootEnabled
        );
  }
}