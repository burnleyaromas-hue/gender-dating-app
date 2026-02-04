import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const datingRouter = router({
  profile: router({
    get: protectedProcedure.query(({ ctx }) => db.getUserProfile(ctx.user.id)),
    create: protectedProcedure
      .input(z.object({
        age: z.number().int().min(18).max(120),
        bio: z.string().max(500),
        latitude: z.number(),
        longitude: z.number(),
        interests: z.string().optional(),
      }))
      .mutation(({ ctx, input }) => db.createUserProfile({
        userId: ctx.user.id,
        age: input.age,
        bio: input.bio,
        latitude: input.latitude.toString(),
        longitude: input.longitude.toString(),
        interests: input.interests || "",
      })),
    update: protectedProcedure
      .input(z.object({
        age: z.number().int().min(18).max(120).optional(),
        bio: z.string().max(500).optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        interests: z.string().optional(),
      }))
      .mutation(({ ctx, input }) => {
        const updateData: any = {};
        if (input.age !== undefined) updateData.age = input.age;
        if (input.bio !== undefined) updateData.bio = input.bio;
        if (input.latitude !== undefined) updateData.latitude = input.latitude.toString();
        if (input.longitude !== undefined) updateData.longitude = input.longitude.toString();
        if (input.interests !== undefined) updateData.interests = input.interests;
        return db.updateUserProfile(ctx.user.id, updateData);
      }),
    updateLocation: protectedProcedure
      .input(z.object({ latitude: z.number(), longitude: z.number() }))
      .mutation(({ ctx, input }) => db.updateUserLocation(ctx.user.id, input.latitude, input.longitude)),
    updateOnlineStatus: protectedProcedure
      .input(z.object({ isOnline: z.boolean() }))
      .mutation(({ ctx, input }) => db.updateOnlineStatus(ctx.user.id, input.isOnline)),
  }),
  photos: router({
    list: protectedProcedure.query(({ ctx }) => db.getUserPhotos(ctx.user.id)),
    add: protectedProcedure
      .input(z.object({ photoUrl: z.string().url(), displayOrder: z.number().int().default(0) }))
      .mutation(({ ctx, input }) => db.addUserPhoto({ userId: ctx.user.id, photoUrl: input.photoUrl, displayOrder: input.displayOrder })),
    delete: protectedProcedure
      .input(z.object({ photoId: z.number() }))
      .mutation(({ input }) => db.deleteUserPhoto(input.photoId)),
  }),
  preferences: router({
    get: protectedProcedure.query(({ ctx }) => db.getUserPreferences(ctx.user.id)),
    create: protectedProcedure
      .input(z.object({
        minAge: z.number().int().min(18),
        maxAge: z.number().int().max(120),
        maxDistance: z.number().int().min(1),
        showProfile: z.boolean().default(true),
        allowMessages: z.boolean().default(true),
      }))
      .mutation(({ ctx, input }) => db.createUserPreferences({
        userId: ctx.user.id,
        minAge: input.minAge,
        maxAge: input.maxAge,
        maxDistance: input.maxDistance,
        showProfile: input.showProfile,
        allowMessages: input.allowMessages,
      })),
    update: protectedProcedure
      .input(z.object({
        minAge: z.number().int().min(18).optional(),
        maxAge: z.number().int().max(120).optional(),
        maxDistance: z.number().int().min(1).optional(),
        showProfile: z.boolean().optional(),
        allowMessages: z.boolean().optional(),
      }))
      .mutation(({ ctx, input }) => db.updateUserPreferences(ctx.user.id, input)),
  }),
  discovery: router({
    nearby: protectedProcedure
      .input(z.object({ latitude: z.number(), longitude: z.number() }))
      .query(({ ctx, input }) => db.getNearbyProfiles(ctx.user.id, input.latitude, input.longitude)),
  }),
  likes: router({
    like: protectedProcedure
      .input(z.object({ toUserId: z.number(), likeType: z.enum(["like", "superlike"]).default("like") }))
      .mutation(({ ctx, input }) => db.likeUser(ctx.user.id, input.toUserId, input.likeType)),
    pass: protectedProcedure
      .input(z.object({ toUserId: z.number() }))
      .mutation(({ ctx, input }) => db.passUser(ctx.user.id, input.toUserId)),
  }),
  matches: router({
    list: protectedProcedure.query(({ ctx }) => db.getUserMatches(ctx.user.id)),
    get: protectedProcedure
      .input(z.object({ matchId: z.number() }))
      .query(({ input }) => db.getMatchDetails(input.matchId)),
  }),
  messages: router({
    send: protectedProcedure
      .input(z.object({ matchId: z.number(), toUserId: z.number(), content: z.string().min(1).max(1000) }))
      .mutation(({ ctx, input }) => db.sendMessage({ matchId: input.matchId, fromUserId: ctx.user.id, toUserId: input.toUserId, content: input.content })),
    list: protectedProcedure
      .input(z.object({ matchId: z.number() }))
      .query(({ input }) => db.getMatchMessages(input.matchId)),
    markAsRead: protectedProcedure
      .input(z.object({ matchId: z.number() }))
      .mutation(({ ctx, input }) => db.markMessagesAsRead(input.matchId, ctx.user.id)),
  }),
  safety: router({
    block: protectedProcedure
      .input(z.object({ blockedUserId: z.number(), reason: z.string().optional() }))
      .mutation(({ ctx, input }) => db.blockUser(ctx.user.id, input.blockedUserId, input.reason)),
    unblock: protectedProcedure
      .input(z.object({ blockedUserId: z.number() }))
      .mutation(({ ctx, input }) => db.unblockUser(ctx.user.id, input.blockedUserId)),
    blockedList: protectedProcedure.query(({ ctx }) => db.getBlockedUsers(ctx.user.id)),
    report: protectedProcedure
      .input(z.object({
        reportedUserId: z.number(),
        reason: z.enum(["inappropriate_photos", "fake_profile", "harassment", "spam", "other"]),
        description: z.string().optional(),
      }))
      .mutation(({ ctx, input }) => db.reportUser({
        reportedByUserId: ctx.user.id,
        reportedUserId: input.reportedUserId,
        reason: input.reason,
        description: input.description,
      })),
  }),
});
