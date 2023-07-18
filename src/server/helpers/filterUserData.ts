import type { User } from "@clerk/nextjs/dist/types/server";

export const filterUsersForClient = (user: User) => {
  //google sso doesnt have username
  let username = user.username;
  if (!username) {
    if (user.firstName && user.lastName)
      username = `${user.firstName} ${user.lastName}`;
    else username = user.firstName ?? user.lastName ?? "Anonymous";
  }

  return {
    id: user.id,
    username: username,
    profileImageUrl: user.profileImageUrl,
  };
};
