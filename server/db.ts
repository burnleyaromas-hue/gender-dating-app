import { eq, and, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  userProfiles,
  userPhotos,
  userPreferences,
  likes,
  matches,
  messages,
  blockedUsers,
  reports,
  type InsertUserProfile,
  type InsertUserPhoto,
  type InsertUserPreferences,
  type InsertLike,
  type InsertMatch,
  type InsertMessage,
  type InsertReport,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// User Profile Functions
export async function getUserProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
  return result[0] || null;
}

export async function createUserProfile(data: InsertUserProfile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(userProfiles).values(data);
}

export async function updateUserProfile(userId: number, data: Partial<InsertUserProfile>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(userProfiles).set(data).where(eq(userProfiles.userId, userId));
}

// User Photos Functions
export async function getUserPhotos(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(userPhotos)
    .where(eq(userPhotos.userId, userId))
    .orderBy(userPhotos.displayOrder);
}

export async function addUserPhoto(data: InsertUserPhoto) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(userPhotos).values(data);
}

export async function deleteUserPhoto(photoId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(userPhotos).where(eq(userPhotos.id, photoId));
}

// User Preferences Functions
export async function getUserPreferences(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
  return result[0] || null;
}

export async function createUserPreferences(data: InsertUserPreferences) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(userPreferences).values(data);
}

export async function updateUserPreferences(userId: number, data: Partial<InsertUserPreferences>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(userPreferences).set(data).where(eq(userPreferences.userId, userId));
}

// Nearby Profiles Functions
export async function getNearbyProfiles(
  userId: number,
  latitude: number,
  longitude: number,
  maxDistance: number = 50
) {
  const db = await getDb();
  if (!db) return [];

  const userPrefs = await getUserPreferences(userId);
  if (!userPrefs) return [];

  // Get blocked users
  const blockedList = await db
    .select({ blockedUserId: blockedUsers.blockedUserId })
    .from(blockedUsers)
    .where(eq(blockedUsers.userId, userId));

  const blockedIds = blockedList.map((b) => b.blockedUserId);

  // Get all profiles within age range
  const profiles = await db
    .select()
    .from(userProfiles)
    .where(
      and(
        sql`${userProfiles.userId} != ${userId}`,
        sql`${userProfiles.latitude} IS NOT NULL`,
        sql`${userProfiles.longitude} IS NOT NULL`,
        sql`${userProfiles.age} >= ${userPrefs.minAge}`,
        sql`${userProfiles.age} <= ${userPrefs.maxAge}`
      )
    );

  // Filter by distance and blocked users
  return profiles.filter((profile) => {
    if (!profile.latitude || !profile.longitude) return false;
    if (blockedIds.includes(profile.userId)) return false;

    // Simple distance calculation (not accurate but works for demo)
    const lat1 = parseFloat(String(latitude));
    const lon1 = parseFloat(String(longitude));
    const lat2 = parseFloat(String(profile.latitude));
    const lon2 = parseFloat(String(profile.longitude));

    const distance = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2)) * 111; // Rough km conversion
    return distance <= maxDistance;
  });
}

// Likes Functions
export async function likeUser(fromUserId: number, toUserId: number, likeType: "like" | "superlike" = "like") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if already liked
  const existingResult = await db
    .select()
    .from(likes)
    .where(and(eq(likes.fromUserId, fromUserId), eq(likes.toUserId, toUserId)));
  const existing = existingResult[0];

  if (existing) {
    // Update like type
    await db
      .update(likes)
      .set({ likeType })
      .where(and(eq(likes.fromUserId, fromUserId), eq(likes.toUserId, toUserId)));
  } else {
    // Create new like
    await db.insert(likes).values({ fromUserId, toUserId, likeType });
  }

  // Check for mutual like (match)
  const mutualLikeResult = await db
    .select()
    .from(likes)
    .where(and(eq(likes.fromUserId, toUserId), eq(likes.toUserId, fromUserId)));
  const mutualLike = mutualLikeResult[0];

  if (mutualLike) {
    // Create match
    const existingMatchResult = await db
      .select()
      .from(matches)
      .where(
        or(
          and(eq(matches.user1Id, fromUserId), eq(matches.user2Id, toUserId)),
          and(eq(matches.user1Id, toUserId), eq(matches.user2Id, fromUserId))
        )
      );
    const existingMatch = existingMatchResult[0];

    if (!existingMatch) {
      await db.insert(matches).values({
        user1Id: Math.min(fromUserId, toUserId),
        user2Id: Math.max(fromUserId, toUserId),
      });
    }
  }
}

export async function passUser(fromUserId: number, toUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Delete any existing like
  await db.delete(likes).where(and(eq(likes.fromUserId, fromUserId), eq(likes.toUserId, toUserId)));
}

// Matches Functions
export async function getUserMatches(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(matches)
    .where(or(eq(matches.user1Id, userId), eq(matches.user2Id, userId)));
}

export async function getMatchDetails(matchId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(matches).where(eq(matches.id, matchId));
  return result[0] || null;
}

// Messages Functions
export async function sendMessage(data: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(messages).values(data);

  // Update match's lastMessageAt
  await db.update(matches).set({ lastMessageAt: new Date() }).where(eq(matches.id, data.matchId));
}

export async function getMatchMessages(matchId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(messages)
    .where(eq(messages.matchId, matchId))
    .orderBy(messages.createdAt)
    .limit(limit);
}

export async function markMessagesAsRead(matchId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(messages)
    .set({ isRead: true, readAt: new Date() })
    .where(and(eq(messages.matchId, matchId), eq(messages.toUserId, userId), eq(messages.isRead, false)));
}

// Blocked Users Functions
export async function blockUser(userId: number, blockedUserId: number, reason?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(blockedUsers).values({ userId, blockedUserId, reason });
}

export async function unblockUser(userId: number, blockedUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(blockedUsers)
    .where(and(eq(blockedUsers.userId, userId), eq(blockedUsers.blockedUserId, blockedUserId)));
}

export async function getBlockedUsers(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(blockedUsers).where(eq(blockedUsers.userId, userId));
}

// Reports Functions
export async function reportUser(data: InsertReport) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(reports).values(data);
}

export async function getReports(status?: string) {
  const db = await getDb();
  if (!db) return [];

  if (status) {
    return db.select().from(reports).where(sql`${reports.status} = ${status}`);
  }
  return db.select().from(reports);
}

// Update online status
export async function updateOnlineStatus(userId: number, isOnline: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(userProfiles)
    .set({ isOnline, lastSeen: new Date() })
    .where(eq(userProfiles.userId, userId));
}

// Update location
export async function updateUserLocation(userId: number, latitude: number, longitude: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(userProfiles)
    .set({ latitude: latitude.toString(), longitude: longitude.toString(), lastLocationUpdate: new Date() })
    .where(eq(userProfiles.userId, userId));
}
