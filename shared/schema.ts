import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  appleId: text("apple_id"),
  subscriptionPlan: text("subscription_plan").default("free"),
  subscriptionExpiry: timestamp("subscription_expiry"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const roomDesigns = pgTable("room_designs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  roomType: text("room_type").notNull(),
  designData: jsonb("design_data"),
  images: text("images").array(),
  isPublic: boolean("is_public").default(false),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const businessGroups = pgTable("business_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // doctor_practice, office_layouts, etc.
  description: text("description"),
  memberCount: integer("member_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const groupMemberships = pgTable("group_memberships", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  groupId: integer("group_id").references(() => businessGroups.id),
  role: text("role").default("member"), // member, admin, moderator
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const furnitureItems = pgTable("furniture_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: integer("price"),
  description: text("description"),
  images: text("images").array(),
  aiScore: integer("ai_score"),
  reviews: jsonb("reviews"),
  averageRating: integer("average_rating"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const qaQuestions = pgTable("qa_questions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  question: text("question").notNull(),
  category: text("category"),
  isAnswered: boolean("is_answered").default(false),
  aiResponse: text("ai_response"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const roomLikes = pgTable("room_likes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  roomId: integer("room_id").references(() => roomDesigns.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  roomDesigns: many(roomDesigns),
  groupMemberships: many(groupMemberships),
  qaQuestions: many(qaQuestions),
  roomLikes: many(roomLikes),
}));

export const roomDesignsRelations = relations(roomDesigns, ({ one, many }) => ({
  user: one(users, {
    fields: [roomDesigns.userId],
    references: [users.id],
  }),
  likes: many(roomLikes),
}));

export const businessGroupsRelations = relations(businessGroups, ({ many }) => ({
  memberships: many(groupMemberships),
}));

export const groupMembershipsRelations = relations(groupMemberships, ({ one }) => ({
  user: one(users, {
    fields: [groupMemberships.userId],
    references: [users.id],
  }),
  group: one(businessGroups, {
    fields: [groupMemberships.groupId],
    references: [businessGroups.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  appleId: true,
});

export const insertRoomDesignSchema = createInsertSchema(roomDesigns).pick({
  title: true,
  description: true,
  roomType: true,
  designData: true,
  images: true,
  isPublic: true,
});

export const insertBusinessGroupSchema = createInsertSchema(businessGroups).pick({
  name: true,
  category: true,
  description: true,
});

export const insertQAQuestionSchema = createInsertSchema(qaQuestions).pick({
  question: true,
  category: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type RoomDesign = typeof roomDesigns.$inferSelect;
export type BusinessGroup = typeof businessGroups.$inferSelect;
export type FurnitureItem = typeof furnitureItems.$inferSelect;
export type QAQuestion = typeof qaQuestions.$inferSelect;
