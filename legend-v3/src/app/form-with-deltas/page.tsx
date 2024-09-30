import { getProfile } from "@/profile";

import EditProfile from "./edit-profile";

export default async function Home() {
  const profile = await getProfile();
  return <EditProfile profile={profile} />;
}
