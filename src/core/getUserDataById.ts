import userData from "./userData.json";
import { User } from "@/types";

export async function getUserDataById(
  id: string
): Promise<[User: User | null, Error: Error | null]> {
  const user = userData.find((user) => user.id === id);

  if (!user) {
    return [null, new Error(`User with id ${id} not found`)];
  }

  return [user, null];
}
