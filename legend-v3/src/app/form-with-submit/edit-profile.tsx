"use client";
import { useRef } from "react";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { useObservableSyncedQuery } from "@legendapp/state/sync-plugins/tanstack-react-query";
import { observer, useObservable, Memo } from "@legendapp/state/react";

import type { Profile } from "@/profile";

import { Input } from "@/components/input";
import { Button } from "@/components/ui/button";

function EditProfile({ profile }: { profile: Profile }) {
  const serverState = useRef<Record<string, string>>({ ...profile });
  const formState$ = useObservable({ ...profile });
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
        formState$.assign({ ...data });
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
      <Input $value={formState$.name} placeholder="Name" />
      <Input $value={formState$.email} placeholder="Email" />
      <Input $value={formState$.phone} placeholder="Phone" />
      <Input $value={formState$.address} placeholder="Address" />

      <Button
        onClick={() => {
          state$.assign(formState$.get());
        }}
      >
        Save
      </Button>

      <h3 className="text-lg font-medium">Profile</h3>
      <Memo>
        {() => (
          <div className="flex flex-col gap-2">
            <p>Name: {state$.get().name}</p>
            <p>Email: {state$.get().email}</p>
            <p>Phone: {state$.get().phone}</p>
            <p>Address: {state$.get().address}</p>
          </div>
        )}
      </Memo>
    </div>
  );
}

export default observer(EditProfile);
