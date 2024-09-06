import { Alert } from "react-native";
import {
  check,
  checkMultiple,
  checkNotifications,
  openSettings,
  PERMISSIONS,
  request,
  requestMultiple,
  requestNotifications,
  RESULTS,
} from "react-native-permissions";
import messaging from '@react-native-firebase/messaging';

export const checkPermission = async (permission) => {
  const res = await check(permission)
    .then(async (result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log("result Unavailable", result);
          return false;

        case RESULTS.DENIED:
          console.log("result denied", result);
          const reqRes = await requestPermission(permission);
          return reqRes;

        case RESULTS.LIMITED:
          console.log("result limited", result);
          return true;

        case RESULTS.GRANTED:
          console.log("result granted", result);
          return true;

        case RESULTS.BLOCKED:
          Alert.alert(
            "Permission Error",
            "You have denied the permission please allow the permission through settings",
            [
              {
                text: "Open Settings",
                onPress: () =>
                  openSettings().catch(() =>
                    console.warn("cannot open settings")
                  ),
              },
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
            ]
          );
          return false;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return res;
};

export const requestPermission = async (permission) => {
  const res = await request(permission)
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log("result Unavailable", result);
          return false;

        case RESULTS.DENIED:
          console.log("result denied", result);
          return false;

        case RESULTS.LIMITED:
          console.log("result Limited", result);
          return true;

        case RESULTS.GRANTED:
          console.log("result granted", result);
          return true;

        case RESULTS.BLOCKED:
          Alert.alert(
            "Permission Error",
            "You have denied the permission please allow the permission through settings",
            [
              {
                text: "Open Settings",
                onPress: () =>
                  openSettings().catch(() =>
                    console.warn("cannot open settings")
                  ),
              },
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
            ]
          );
          return false;
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return res;
};



const resolvePermision = (permissions: Array<any>) => {
  let PERM_STATUS = PERMISSIONS_RESULTS.GRANTED;

  if (Array.isArray(permissions) && permissions.length) {
    PERM_STATUS = PERMISSIONS_RESULTS.GRANTED;
    for (let index = 0; index < permissions.length; index++) {
      // consoleLog('permissions[index]', permissions[index]);
      if (permissions[index] == RESULTS.DENIED) {
        PERM_STATUS = PERMISSIONS_RESULTS.DENIED;
        break;
      } else if (permissions[index] == RESULTS.BLOCKED) {
        PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
        break;
      }
    }
  } else {
    PERM_STATUS = PERMISSIONS_RESULTS.BLOCKED;
  }

  return PERM_STATUS;
};



const PERMISSIONS_RESULTS = Object({
  UNAVAILABLE: 'unavailable',
  BLOCKED: 'blocked',
  DENIED: 'denied',
  GRANTED: 'granted',
  LIMITED: 'limited',
});

/**
 * Check permission to access push notification
 */

const checkPushNotificationPermissionAndroid = async () => {
  const authorizationStatus = await checkNotifications();

  // consoleLog(
  //   'checkPushNotificationPermissionAndroid authorizationStatus==>',
  //   authorizationStatus,
  // );
  if (
    typeof authorizationStatus?.status != 'undefined' &&
    authorizationStatus?.status === RESULTS.GRANTED
  ) {
    // consoleLog('User has notification permissions enabled.');
    return PERMISSIONS_RESULTS.GRANTED;
  } else {
    // consoleLog('User has notification permissions disabled');
    return PERMISSIONS_RESULTS.BLOCKED;
  }
};

/**
 * Check permission to access push notification
 */

const requestPushNotificationPermissionAndroid = async () => {
  const authorizationStatus = await requestNotifications(['alert', 'sound']);
  // consoleLog(
  //   'requestPushNotificationPermissionAndroid authorizationStatus==>',
  //   authorizationStatus,
  // );
  if (
    typeof authorizationStatus?.status != 'undefined' &&
    authorizationStatus?.status === RESULTS.GRANTED
  ) {
    // consoleLog('User has provisional notification permissions.');
    return PERMISSIONS_RESULTS.GRANTED;
  } else {
    // consoleLog('User has notification permissions disabled');
    return PERMISSIONS_RESULTS.BLOCKED;
  }
};

/**
 * Check permission to access push notification
 */

const __checkPushNotificationPermissionAndroid = () => {
  return new Promise(resolve => {
    checkMultiple([PERMISSIONS.ANDROID.POST_NOTIFICATIONS])
      .then((statuses: any) => {
        // consoleLog('statuses==>', statuses);
        let PERM_STATUS = resolvePermision([
          PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
        ]);
        resolve(PERM_STATUS);
      })
      .catch(err => {
        resolve(PERMISSIONS_RESULTS.BLOCKED);
      });
  });
};

/**
 * Check permission to access push notification
 */

const __requestPushNotificationPermissionAndroid = () => {
  return new Promise(resolve => {
    requestMultiple([PERMISSIONS.ANDROID.POST_NOTIFICATIONS])
      .then((statuses: any) => {
        // consoleLog('statuses==>', statuses);
        let PERM_STATUS = resolvePermision([
          PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
        ]);
        resolve(PERM_STATUS);
      })
      .catch(err => {
        resolve(PERMISSIONS_RESULTS.BLOCKED);
      });
  });
};

/**
 * Check permission to access push notification
 */

const checkPushNotificationPermissionIos = async () => {
  const authorizationStatus = await messaging().hasPermission();
  if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    // consoleLog('User has notification permissions enabled.');
    return PERMISSIONS_RESULTS.GRANTED;
  } else if (
    authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
  ) {
    // consoleLog('User has provisional notification permissions.');
    return PERMISSIONS_RESULTS.GRANTED;
  } else {
    // consoleLog('User has notification permissions disabled');
    return PERMISSIONS_RESULTS.BLOCKED;
  }
};

/**
 * Check permission to access push notification
 */

const requestPushNotificationPermissionIos = async () => {
  const authorizationStatus = await messaging().requestPermission();
  if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    // consoleLog('User has notification permissions enabled.');
    return PERMISSIONS_RESULTS.GRANTED;
  } else if (
    authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
  ) {
    // consoleLog('User has provisional notification permissions.');
    return PERMISSIONS_RESULTS.GRANTED;
  } else {
    // consoleLog('User has notification permissions disabled');
    return PERMISSIONS_RESULTS.BLOCKED;
  }
};


export {
  PERMISSIONS_RESULTS,
  checkPushNotificationPermissionAndroid,
  requestPushNotificationPermissionAndroid,
  checkPushNotificationPermissionIos,
  requestPushNotificationPermissionIos,
};