package com.dint.society;

import android.app.NotificationManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;

import io.wazo.callkeep.RNCallKeepModule;

public class CallActionReceiver extends BroadcastReceiver {
    private final int notificationId = 1;
    @Override
    public void onReceive(Context context, Intent intent) {
        ReactApplicationContext reactContext = new ReactApplicationContext(context);
        RNCallKeepModule callkeep = RNCallKeepModule.getInstance(reactContext, false);
        NotificationManager notificationManager = context.getSystemService(NotificationManager.class);
        callkeep.setAvailable(true);

        String action = intent.getAction();
        Log.d("OUT", "This is OUT");
        if ("RECEIVE_CALL".equals(action)) {
            callkeep.backToForeground();
//            callkeep.answerIncomingCall(context,"Abcds");

            Log.d("RECEIVE_CALL", "This is received");
            // Handle receive call action
            notificationManager.cancel(notificationId);
            Toast.makeText(context, "Call Received", Toast.LENGTH_SHORT).show();
            // Add your logic here
        } else if ("END_CALL".equals(action)) {
            Log.d("END_CALL", "This is received");
            // Handle end call action
            Toast.makeText(context, "Call Ended", Toast.LENGTH_SHORT).show();
            notificationManager.cancel(notificationId);
            // Add your logic here
        }
    }
}
