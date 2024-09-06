package com.dint.society;
import android.os.Bundle;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class MyFirebaseMessagingService extends FirebaseMessagingService {

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {

        super.onMessageReceived(remoteMessage);

        // Prepare the data to pass to the headless task
//        Bundle bundle = new Bundle();
//        bundle.putString("title", remoteMessage.getNotification().getTitle());
//        bundle.putString("body", remoteMessage.getNotification().getBody());
//        bundle.putString("data", remoteMessage.getData().toString());

//         Start the headless task service
//        Intent serviceIntent = new Intent(this, MyTaskService.class);
//        serviceIntent.putExtras(bundle);
//        startService(serviceIntent);
//        PowerManager pm = (PowerManager) this.getApplicationContext().getSystemService(POWER_SERVICE);
//        int flags=PowerManager.SCREEN_BRIGHT_WAKE_LOCK |
//                PowerManager.ACQUIRE_CAUSES_WAKEUP |
//                PowerManager.ON_AFTER_RELEASE;
//        PowerManager.WakeLock sCpuWakeLock = pm.newWakeLock(flags, "com.test:PushWakeUp");
//        sCpuWakeLock.acquire();
//        HeadlessJsTaskService.acquireWakeLockNow(this.getApplicationContext());
    }
}
