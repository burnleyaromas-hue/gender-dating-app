import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// User Profiles table
export const userProfiles = mysqlTable("userProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  age: int("age"),
  bio: text("bio"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  lastLocationUpdate: timestamp("lastLocationUpdate"),
  profilePhotoUrl: varchar("profilePhotoUrl", { length: 500 }),
  interests: text("interests"), // JSON array stored as text
  isOnline: boolean("isOnline").notNull().default(false),
  lastSeen: timestamp("lastSeen"),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// User Photos table (for multiple photos per profile)
export const userPhotos = mysqlTable("userPhotos", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  photoUrl: varchar("photoUrl", { length: 500 }).notNull(),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// User Preferences table
export const userPreferences = mysqlTable("userPreferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  minAge: int("minAge").notNull().default(18),
  maxAge: int("maxAge").notNull().default(99),
  maxDistance: int("maxDistance").notNull().default(50), // in km
  showProfile: boolean("showProfile").notNull().default(true),
  allowMessages: boolean("allowMessages").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Likes table
export const likes = mysqlTable("likes", {
  id: int("id").autoincrement().primaryKey(),
  fromUserId: int("fromUserId").notNull(),
  toUserId: int("toUserId").notNull(),
  likeType: mysqlEnum("likeType", ["like", "superlike"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Matches table (mutual likes)
export const matches = mysqlTable("matches", {
  id: int("id").autoincrement().primaryKey(),
  user1Id: int("user1Id").notNull(),
  user2Id: int("user2Id").notNull(),
  matchedAt: timestamp("matchedAt").defaultNow().notNull(),
  lastMessageAt: timestamp("lastMessageAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Messages table
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  matchId: int("matchId").notNull(),
  fromUserId: int("fromUserId").notNull(),
  toUserId: int("toUserId").notNull(),
  content: text("content").notNull(),
  isRead: boolean("isRead").notNull().default(false),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Blocked Users table
export const blockedUsers = mysqlTable("blockedUsers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  blockedUserId: int("blockedUserId").notNull(),
  reason: varchar("reason", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Reports table (for reporting inappropriate content/users)
export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  reportedByUserId: int("reportedByUserId").notNull(),
  reportedUserId: int("reportedUserId").notNull(),
  reason: mysqlEnum("reason", [
    "inappropriate_photos",
    "fake_profile",
    "harassment",
    "spam",
    "other",
  ]).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["pending", "reviewed", "resolved"]).notNull().default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Export types
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;
export type UserPhoto = typeof userPhotos.$inferSelect;
export type InsertUserPhoto = typeof userPhotos.$inferInsert;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = typeof userPreferences.$inferInsert;
export type Like = typeof likes.$inferSelect;
export type InsertLike = typeof likes.$inferInsert;
export type Match = typeof matches.$inferSelect;
export type InsertMatch = typeof matches.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;
export type BlockedUser = typeof blockedUsers.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;
