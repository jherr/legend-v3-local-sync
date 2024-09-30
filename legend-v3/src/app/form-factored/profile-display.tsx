"use client";
import { Memo } from "@legendapp/state/react";

import { useProfile } from "./profile-context";

export default function ProfileDisplay() {
  const { state$ } = useProfile();

  return (
    <>
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
    </>
  );
}
