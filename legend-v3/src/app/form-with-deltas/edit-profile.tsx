"use client";
import { useRef } from "react";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { useObservableSyncedQuery } from "@legendapp/state/sync-plugins/tanstack-react-query";
import { observer, useObservable } from "@legendapp/state/react";

import type { Profile } from "@/profile";

import { Input } from "@/components/input";

function EditProfile({ profile }: { profile: Profile }) {
  const serverState = useRef<Record<string, string>>({ ...profile });
  const state$ = useObservableSyncedQuery<Profile>({
    query: {
      queryKey: ["profile"],
      queryFn: async () => {
        return fetch(`/api/profile`).then((v) => v.json());
      },
      initialData: { ...profile },
      refetchOnMount: false,
    },
    mutation: {
      mutationFn: async function <Profile>(variables: Profile) {
        const sendData: Partial<Profile> = {};
        for (const k in serverState.current) {
          const key = k as keyof Profile;
          if (variables[key] !== serverState.current[key as string]) {
            sendData[key] = variables[key];
          }
        }
        return fetch(`/api/profile`, {
          method: "POST",
          body: JSON.stringify(sendData),
        }).then((v) => v.json());
      },
    },
    transform: {
      load: (data: Profile) => {
        serverState.current = { ...data };
        return data;
      },
    },
    persist: {
      plugin: ObservablePersistLocalStorage,
      retrySync: true,
      name: "profile",
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <Input $value={state$.name} placeholder="Name" />
      <Input $value={state$.email} placeholder="Email" />
      <Input $value={state$.phone} placeholder="Phone" />
      <Input $value={state$.address} placeholder="Address" />
    </div>
  );
}

export default observer(EditProfile);
