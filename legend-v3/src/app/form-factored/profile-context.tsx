"use client";
import { createContext, useContext, useRef, useCallback } from "react";

import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { useObservableSyncedQuery } from "@legendapp/state/sync-plugins/tanstack-react-query";
import { useObservable } from "@legendapp/state/react";

import type { Profile } from "@/profile";

function useFormState(profile: Profile) {
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

  const onSave = useCallback(() => {
    state$.assign(formState$.get());
  }, [state$, formState$]);

  return { formState$, state$, onSave };
}

export const ProfileContext = createContext<ReturnType<
  typeof useFormState
> | null>(null);

export function ProfileProvider({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: Profile;
}) {
  const formState = useFormState(profile);
  return (
    <ProfileContext.Provider value={formState}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
