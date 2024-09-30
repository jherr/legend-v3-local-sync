import { getProfile, updateProfile } from "@/profile";

export async function GET() {
  const profile = await getProfile();
  return new Response(JSON.stringify(profile));
}

export async function POST(req: Request) {
  const profile = await req.json();
  console.log(profile);
  const updatedProfile = await updateProfile(profile);
  return new Response(JSON.stringify(updatedProfile));
}
