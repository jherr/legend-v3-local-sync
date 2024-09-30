import fs from "node:fs/promises";

export interface Profile {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export const getProfile = async (): Promise<Profile> => {
  const profile = await fs.readFile("./data/profile.json", "utf8");
  return JSON.parse(profile);
};

export const updateProfile = async (
  profile: Partial<Profile>,
): Promise<Profile> => {
  const existingProfile = await getProfile();
  const updatedProfile = { ...existingProfile, ...profile };
  await fs.writeFile(
    "./data/profile.json",
    JSON.stringify(updatedProfile, null, 2),
  );
  return updatedProfile;
};
