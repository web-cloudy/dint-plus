import React, { useEffect, useState } from "react";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import Contacts from "react-native-contacts";
import { getDataFromAsync, storeDataInAsync } from "utils/LocalStorage";
import { Alert, Platform } from "react-native";

const useReadContact = () => {
  const [isLoadingContact, setIsLoadingContact] = useState(false);
  const [contactList, setContactList] = useState<object[]>([]);

  const checkContactPermissionAndroid = () => {
    check(PERMISSIONS.ANDROID.READ_CONTACTS)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              "This feature is not available (on this device / in this context)"
            );
            break;
          case RESULTS.DENIED:
            console.log(
              "The permission has not been requested / is denied but requestable"
            );
            requestContactPermissionAndroid();
            break;
          case RESULTS.LIMITED:
            console.log("The permission is limited: some actions are possible");
            break;
          case RESULTS.GRANTED:
            console.log("The permission is granted");
            fetchContacts();
            break;
          case RESULTS.BLOCKED:
            console.log("The permission is denied and not requestable anymore");
            break;
        }
      })
      .catch((error) => {});
  };

  const requestContactPermissionAndroid = () => {
    request(PERMISSIONS.ANDROID.READ_CONTACTS).then((result) => {
      console.log("requestContactPermission", result);
      switch (result) {
        case RESULTS.DENIED:
          console.log(
            "The permission has not been requested / is denied but requestable"
          );
          break;
        case RESULTS.LIMITED:
          console.log("The permission is limited: some actions are possible");
          break;
        case RESULTS.GRANTED:
          console.log("The permission is granted");
          fetchContacts();
          break;
        case RESULTS.BLOCKED:
          console.log("The permission is denied and not requestable anymore");
          break;
      }
    });
  };

  const checkContactPermissionIOS = () => {
    check(PERMISSIONS.IOS.CONTACTS)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              "This feature is not available (on this device / in this context)"
            );
            break;
          case RESULTS.DENIED:
            console.log(
              "The permission has not been requested / is denied but requestable"
            );
            requestContactPermissionIOS();
            break;
          case RESULTS.LIMITED:
            console.log("The permission is limited: some actions are possible");
            break;
          case RESULTS.GRANTED:
            console.log("The permission is granted");
            fetchContacts();
            break;
          case RESULTS.BLOCKED:
            console.log("The permission is denied and not requestable anymore");
            break;
        }
      })
      .catch((error) => {});
  };

  const requestContactPermissionIOS = () => {
    request(PERMISSIONS.IOS.CONTACTS).then((result) => {
      console.log("requestContactPermission", result);
      switch (result) {
        case RESULTS.DENIED:
          console.log(
            "The permission has not been requested / is denied but requestable"
          );
          break;
        case RESULTS.LIMITED:
          console.log("The permission is limited: some actions are possible");
          break;
        case RESULTS.GRANTED:
          console.log("The permission is granted");
          fetchContacts();
          break;
        case RESULTS.BLOCKED:
          console.log("The permission is denied and not requestable anymore");
          break;
      }
    });
  };

  const fetchContacts = async () => {
    const tempContacts = await getDataFromAsync("contacts");
    console.log("tempContacts", tempContacts);

    if (tempContacts) {
      setContactList(tempContacts);
    } else {
      setIsLoadingContact(true);
      Contacts.getAll()
        .then((contacts) => {          
          setIsLoadingContact(false);
          setContactList(contacts);
        })
        .catch((e) => {
          setIsLoadingContact(false);
          console.log(e);
        });
    }
  };

  const refreshContacts = async () => {
    setIsLoadingContact(true);
    Contacts.getAll()
      .then((contacts) => {
        setIsLoadingContact(false);
        // console.log("contacts", contacts);
        setContactList(contacts);
        //   storeDataInAsync("contacts", contacts);
      })
      .catch((e) => {
        setIsLoadingContact(false);
        console.log(e);
      });
  };

  useEffect(() => {
    if (Platform.OS == "android") {
      checkContactPermissionAndroid();
    } else {
      checkContactPermissionIOS();
    }
  }, []);

  return { contactList, fetchContacts, refreshContacts, isLoadingContact };
};

export default useReadContact;
