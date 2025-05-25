import { TMatchedUser } from "../type";
import { redis } from "../config/redis.config";
import { logger } from "../util/logger.util";
import { ELogLevel, ERedisConstants, EUserState } from "../constant/application.constant";

class ChatService {
      public async matchUser(id: string, name: string, interests: Array<string>): Promise<TMatchedUser | null> {
            try {
                  await redis.client.hSet(`user:${id}`, {
                        [ERedisConstants.ID]: id,
                        [ERedisConstants.NAME]: name,
                        [ERedisConstants.INTERESTS]: JSON.stringify(interests)
                  });

                  let matchedUser: TMatchedUser | null = null;

                  for (const interest of interests) {
                        const users: Array<string> = await redis.client.sMembers(`interest:${interest}`);

                        if (users.length === 0) continue;

                        const queuedUserId: string | undefined = users[0];

                        if (!queuedUserId) continue;

                        const matchedUserID: string | undefined = await redis.client.hGet(`user:${queuedUserId}`, ERedisConstants.ID);
                        const matchedUserName: string | undefined = await redis.client.hGet(`user:${queuedUserId}`, ERedisConstants.NAME);
                        const rawMatchedUserInterests: string | undefined = await redis.client.hGet(
                              `user:${queuedUserId}`,
                              ERedisConstants.INTERESTS
                        );

                        if (!matchedUserID || !matchedUserName || !rawMatchedUserInterests) continue;

                        const matchedUserInterests: Array<string> = JSON.parse(rawMatchedUserInterests) as Array<string>;

                        for (const matchedUserInterest of matchedUserInterests)
                              await redis.client.sRem(`interest:${matchedUserInterest}`, matchedUserID);

                        matchedUser = {
                              id: matchedUserID,
                              name: matchedUserName,
                              interests: matchedUserInterests
                        };

                        break;
                  }

                  if (matchedUser === null) {
                        for (const interest of interests) {
                              await redis.client.sAdd(`interest:${interest}`, id);
                        }

                        await redis.client.hSet(`user_state:${id}`, { [ERedisConstants.USER_STATE]: EUserState.WAITING });
                  } else {
                        await redis.client.hSet(`match:${id}`, { [ERedisConstants.PARTNER_ID]: matchedUser.id });
                        await redis.client.hSet(`match:${matchedUser.id}`, { [ERedisConstants.PARTNER_ID]: id });

                        await redis.client.hSet(`user_state:${id}`, { [ERedisConstants.USER_STATE]: EUserState.INDIVIDUAL_CHAT });
                        await redis.client.hSet(`user_state:${matchedUser.id}`, { [ERedisConstants.USER_STATE]: EUserState.INDIVIDUAL_CHAT });

                        logger.log(ELogLevel.ERROR, "1");
                  }

                  return matchedUser;
            } catch (error: unknown) {
                  logger.log(ELogLevel.ERROR, `ERROR - CHAT SERVICE WHILE FINDING MATCH FOR ${id}`, { data: { id, name, interests }, error });
                  return null;
            }
      }

      private async disconnectWaitingUser(id: string): Promise<string | null> {
            const rawInterests: string | undefined = await redis.client.hGet(`user:${id}`, ERedisConstants.INTERESTS);

            if (!rawInterests) return null;

            const interests: Array<string> = JSON.parse(rawInterests) as Array<string>;

            for (const interest of interests) {
                  await redis.client.sRem(`interest:${interest}`, id);
            }

            await redis.client.del(`user:${id}`);

            return null;
      }

      private async disconnectIndividualChat(id: string): Promise<string | null> {
            const partnerId: string | undefined = await redis.client.hGet(`match:${id}`, ERedisConstants.PARTNER_ID);

            if (!partnerId) return null;

            await redis.client.del(`match:${id}`);
            await redis.client.del(`match:${partnerId}`);

            await redis.client.del(`user:${id}`);
            await redis.client.del(`user:${partnerId}`);

            logger.log(ELogLevel.ERROR, `${partnerId}`);

            return partnerId;
      }

      public async disconnectUser(id: string): Promise<string | null> {
            try {
                  const userState: string | undefined = await redis.client.hGet(`user_state:${id}`, "user_state");

                  if (!userState) return null;

                  switch (userState as EUserState) {
                        case EUserState.WAITING:
                              return this.disconnectWaitingUser(id);
                        case EUserState.INDIVIDUAL_CHAT:
                              return this.disconnectIndividualChat(id);
                        default:
                              return null;
                  }
            } catch (error: unknown) {
                  logger.log(ELogLevel.ERROR, `ERROR - CHAT SERVICE WHILE DICONENCTING USER`, { id, error });
                  return null;
            }
      }
}

export { ChatService };

