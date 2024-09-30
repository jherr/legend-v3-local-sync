import { reactive } from "@legendapp/state/react";

import { Input as ShadCNInput } from "@/components/ui/input";

export const Input = reactive(ShadCNInput, {
  value: {
    handler: "onChange",
    getValue: (e) => e.target.value,
    defaultValue: "",
  },
});
