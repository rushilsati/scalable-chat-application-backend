import { TMatchedUser } from "../type";
import { redis } from "../config/redis.config";

class ChatService {
      public async matchUser(id: string, name: string, interests: Array<string>): Promise<TMatchedUser | null> {
            let matchedUser: TMatchedUser | null = null;

            for (const interest of interests) {
                  const users: Array<string> = await redis.client.sMembers(`interest:${interest}`);

                  if (users.length === 0) continue;

                  const queueUserID: string | undefined = users[0];

                  if (!queueUserID) continue;

                  const matchedUserID: string | undefined = await redis.client.hGet(`user:${queueUserID}`, "id");
                  const matchedUserName: string | undefined = await redis.client.hGet(`user:${queueUserID}`, "name");
                  const rawMatchedUserInterests: string | undefined = await redis.client.hGet(`user:${queueUserID}`, "interests");

                  if (!matchedUserID || !matchedUserName || !rawMatchedUserInterests) continue;

                  const matchedUserInterests: Array<string> = JSON.parse(rawMatchedUserInterests) as Array<string>;

                  for (const matchedUserInterest of matchedUserInterests) await redis.client.sRem(`interest:${matchedUserInterest}`, matchedUserID);

                  matchedUser = {
                        id: matchedUserID,
                        name: matchedUserName,
                        interests: matchedUserInterests
                  };

                  break;
            }

            if (matchedUser === null) {
                  await redis.client.hSet(`user:${id}`, { id, name, interests: JSON.stringify(interests) });
                  for (const interest of interests) {
                        await redis.client.sAdd(`interest:${interest}`, id);
                  }
            }

            return matchedUser;
      }
}

export { ChatService };

