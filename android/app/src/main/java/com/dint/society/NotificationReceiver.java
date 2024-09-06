package com.dint.society;

import android.app.ActivityManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.media.RingtoneManager;
import android.os.AsyncTask;
import android.os.Build;
import android.util.Log;
import android.os.Bundle;


import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import org.json.JSONObject;
import org.json.JSONException;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

import io.wazo.callkeep.RNCallKeepModule;

import com.facebook.react.bridge.ReactApplicationContext;

public class NotificationReceiver extends BroadcastReceiver {
    private static final String TAG = "NotificationReceiver";
    private final String CHANNEL_ID = "dint_channel_id";
    private final int notificationId = 1;

    @Override
    public void onReceive(Context context, Intent intent) {
        Bundle bundle = intent.getExtras();
        try {
            boolean foregroud = new ForegroundCheckTask().execute(context).get();
            Log.d("---foreground---", String.valueOf(foregroud));
        } catch (ExecutionException e) {
            throw new RuntimeException(e);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//            CharSequence name = "Dint Channel";
//            String description = "Channel for Dint notifications";
//            int importance = NotificationManager.IMPORTANCE_HIGH;
//            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
//            channel.setDescription(description);
//            NotificationManager notificationManager = context.getSystemService(NotificationManager.class);
//            notificationManager.createNotificationChannel(channel);
//        }
//
//        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
//        // Intent for handling call receive action
//        Intent receiveCallIntent = new Intent(context, CallActionReceiver.class);
//        receiveCallIntent.setAction("RECEIVE_CALL");
//        PendingIntent receiveCallPendingIntent = PendingIntent.getBroadcast(context, 0, receiveCallIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
//
//        // Intent for handling call end action
//        Intent endCallIntent = new Intent(context, CallActionReceiver.class);
//        endCallIntent.setAction("END_CALL");
//        PendingIntent endCallPendingIntent = PendingIntent.getBroadcast(context, 1, endCallIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
//
//        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
//                .setSmallIcon(R.drawable.stripe_logo)
//                .setContentTitle("Incoming Call")
//                .setContentText("Call from user")
//                .setPriority(NotificationCompat.PRIORITY_HIGH)
//                .setCategory(NotificationCompat.CATEGORY_CALL)
//                .setFullScreenIntent(pendingIntent, true)
//                .setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE))
//                .setVibrate(new long[]{0, 1000, 500, 1000})
//                .setAutoCancel(true)
//                .addAction(R.drawable.stripe_link_close, "Decline", endCallPendingIntent)
//                .addAction(R.drawable.stripe_link_complete, "Accept", receiveCallPendingIntent);
//
//
//        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(context);
//        if (ActivityCompat.checkSelfPermission(context, android.Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
//            // TODO: Consider calling
//            //    ActivityCompat#requestPermissions
//            // here to request the missing permissions, and then overriding
//            //   public void onRequestPermissionsResult(int requestCode, String[] permissions,
//            //                                          int[] grantResults)
//            // to handle the case where the user grants the permission. See the documentation
//            // for ActivityCompat#requestPermissions for more details.
//            return;
//        }
//        notificationManager.notify(notificationId, builder.build());

//

//        ReactApplicationContext reactContext = new ReactApplicationContext(context);
//        RNCallKeepModule callkeep = RNCallKeepModule.getInstance(reactContext, false);
//        callkeep.initializeTelecomManager();
//        callkeep.setAvailable(true);
//        callkeep.displayIncomingCall("e0b226a1-dd4f-4a59-8711-25fbefbc90a6", "91613615510", "Jeki", true);
//
//        callkeep.registerEvents();

        if (bundle == null) {
            Log.e(TAG, "No extras found in intent");
            return;
        }
        String notificationType = bundle.getString("notification_type");
        Log.d("MyFirebaseMessagingService", "vishal");
        if (notificationType == null || !notificationType.equals("incomingCall")) {
            Log.d(TAG, "Not an incoming call notification");
            return;
        }

        String payload = bundle.getString("payload_key");  // Replace "payload_key" with the actual key
        if (payload == null) {
            Log.e(TAG, "Payload is null");
            return;
        }


        try {
//            JSONObject items = new JSONObject(payload);
//            String name = items.getString("name");
//            String number = items.getString("number");
//            boolean hasVideo = items.getBoolean("video");
//            String uuid = UUID.randomUUID().toString();
//            callkeep.displayIncomingCall(uuid, number, name, true, null);
            Log.d("onReceive", "No extras found in intent");

        }
//        catch (JSONException e) {
//            Log.e(TAG, "JSON Parsing Error: " );
//        }
        catch (Exception e) {
            Log.e("Exception", e.toString());
        }
    }
}



class ForegroundCheckTask extends AsyncTask<Context, Void, Boolean> {

    @Override
    protected Boolean doInBackground(Context... params) {
        final Context context = params[0].getApplicationContext();
        return isAppRunning(context);
    }

    public static boolean isAppRunning(Context context) {
        ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        final String packageName = context.getPackageName();

        // Check if the app is in the foreground or visible
        List<ActivityManager.RunningAppProcessInfo> appProcesses = activityManager.getRunningAppProcesses();
        if (appProcesses != null) {
            for (ActivityManager.RunningAppProcessInfo appProcess : appProcesses) {
                if (appProcess.processName.equals(packageName)) {
                    if (appProcess.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND ||
                            appProcess.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_VISIBLE || appProcess.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_BACKGROUND ) {
                        return true; // App is running in the foreground or visible
                    }
                }
            }
        }

        // Check if the app has any running services
        List<ActivityManager.RunningServiceInfo> runningServices = activityManager.getRunningServices(Integer.MAX_VALUE);
        if (runningServices != null) {
            for (ActivityManager.RunningServiceInfo serviceInfo : runningServices) {
                if (serviceInfo.service.getPackageName().equals(packageName)) {
                    return true; // App has running services (background)
                }
            }
        }

        // App is not running in the foreground, visible, or has running services
        return false; // App is considered killed or not running
    }
}





