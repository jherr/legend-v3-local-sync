import { getProfile } from "@/profile";

import { ProfileProvider } from "./profile-context";
import ProfileForm from "./profile-form";
import ProfileDisplay from "./profile-display";

export default async function Home() {
  const profile = await getProfile();
  return (
    <ProfileProvider profile={profile}>
      <ProfileForm />
      <ProfileDisplay />
    </ProfileProvider>
  );
}
