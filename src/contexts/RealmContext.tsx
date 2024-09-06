import React, { createContext, useContext, useEffect, useState } from "react";
import Realm from "realm";
import { getRealmConfig } from "../realm/RealmConfig";

const RealmContext = createContext<Realm | undefined>(undefined);

export const RealmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [realm, setRealm] = useState<Realm | undefined>(undefined);

  useEffect(() => {
    const initRealm = async () => {
      const config = await getRealmConfig();
      const realmInstance = await Realm.open(config);
      setRealm(realmInstance);
    };

    initRealm();

    return () => {
      realm?.close();
    };
  }, []);

  return <RealmContext.Provider value={realm}>{children}</RealmContext.Provider>;
};

export const useRealm = () => {
  const context = useContext(RealmContext);
  if (context === undefined) {
    throw new Error("useRealm must be used within a RealmProvider");
  }
  return context;
};
