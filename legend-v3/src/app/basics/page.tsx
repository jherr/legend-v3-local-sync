"use client";
import { useObservable, observer } from "@legendapp/state/react";

import { Input } from "@/components/input";

function Basics() {
  const name$ = useObservable({
    first: "Jack",
    last: "Sparrow",
    full: () => `${name$.first.get()} ${name$.last.get()}`,
  });

  return (
    <div className="flex flex-col gap-4">
      <Input $value={name$.first} placeholder="First" />
      <Input $value={name$.last} placeholder="Last" />
      <div>Full Name: {name$.full.get()}</div>
    </div>
  );
}

export default observer(Basics);
