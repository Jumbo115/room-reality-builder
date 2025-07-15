import { 
  users, 
  roomDesigns, 
  businessGroups, 
  groupMemberships, 
  furnitureItems, 
  qaQuestions, 
  roomLikes,
  type User, 
  type InsertUser, 
  type RoomDesign, 
  type BusinessGroup, 
  type FurnitureItem, 
  type QAQuestion 
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserSubscription(userId: number, plan: string, expiry: Date): Promise<void>;
  
  // Room design methods
  createRoomDesign(design: any): Promise<RoomDesign>;
  getPublicRoomDesigns(limit?: number): Promise<RoomDesign[]>;
  getUserRoomDesigns(userId: number): Promise<RoomDesign[]>;
  likeRoom(userId: number, roomId: number): Promise<void>;
  getRoomDesign(id: number): Promise<RoomDesign | undefined>;
  
  // Business group methods
  createBusinessGroup(group: any): Promise<BusinessGroup>;
  getBusinessGroups(category?: string): Promise<BusinessGroup[]>;
  joinGroup(userId: number, groupId: number): Promise<void>;
  getUserGroups(userId: number): Promise<BusinessGroup[]>;
  
  // Furniture methods
  getFurnitureItems(category?: string): Promise<FurnitureItem[]>;
  createFurnitureItem(item: any): Promise<FurnitureItem>;
  
  // Q&A methods
  createQuestion(question: any): Promise<QAQuestion>;
  getQuestions(category?: string): Promise<QAQuestion[]>;
  answerQuestion(questionId: number, aiResponse: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserSubscription(userId: number, plan: string, expiry: Date): Promise<void> {
    await db
      .update(users)
      .set({ subscriptionPlan: plan, subscriptionExpiry: expiry })
      .where(eq(users.id, userId));
  }

  // Room design methods
  async createRoomDesign(design: any): Promise<RoomDesign> {
    const [roomDesign] = await db
      .insert(roomDesigns)
      .values(design)
      .returning();
    return roomDesign;
  }

  async getPublicRoomDesigns(limit = 20): Promise<RoomDesign[]> {
    return await db
      .select()
      .from(roomDesigns)
      .where(eq(roomDesigns.isPublic, true))
      .orderBy(desc(roomDesigns.createdAt))
      .limit(limit);
  }

  async getUserRoomDesigns(userId: number): Promise<RoomDesign[]> {
    return await db
      .select()
      .from(roomDesigns)
      .where(eq(roomDesigns.userId, userId))
      .orderBy(desc(roomDesigns.createdAt));
  }

  async likeRoom(userId: number, roomId: number): Promise<void> {
    // Check if already liked
    const [existing] = await db
      .select()
      .from(roomLikes)
      .where(and(eq(roomLikes.userId, userId), eq(roomLikes.roomId, roomId)));

    if (!existing) {
      await db.insert(roomLikes).values({ userId, roomId });
      
      // Update likes count
      await db
        .update(roomDesigns)
        .set({ likes: count(roomLikes.id) })
        .where(eq(roomDesigns.id, roomId));
    }
  }

  async getRoomDesign(id: number): Promise<RoomDesign | undefined> {
    const [room] = await db.select().from(roomDesigns).where(eq(roomDesigns.id, id));
    return room || undefined;
  }

  // Business group methods
  async createBusinessGroup(group: any): Promise<BusinessGroup> {
    const [businessGroup] = await db
      .insert(businessGroups)
      .values(group)
      .returning();
    return businessGroup;
  }

  async getBusinessGroups(category?: string): Promise<BusinessGroup[]> {
    if (category) {
      return await db
        .select()
        .from(businessGroups)
        .where(eq(businessGroups.category, category))
        .orderBy(desc(businessGroups.memberCount));
    }
    return await db
      .select()
      .from(businessGroups)
      .orderBy(desc(businessGroups.memberCount));
  }

  async joinGroup(userId: number, groupId: number): Promise<void> {
    // Check if already a member
    const [existing] = await db
      .select()
      .from(groupMemberships)
      .where(and(eq(groupMemberships.userId, userId), eq(groupMemberships.groupId, groupId)));

    if (!existing) {
      await db.insert(groupMemberships).values({ userId, groupId });
      
      // Update member count
      await db
        .update(businessGroups)
        .set({ memberCount: count(groupMemberships.id) })
        .where(eq(businessGroups.id, groupId));
    }
  }

  async getUserGroups(userId: number): Promise<BusinessGroup[]> {
    return await db
      .select({
        id: businessGroups.id,
        name: businessGroups.name,
        category: businessGroups.category,
        description: businessGroups.description,
        memberCount: businessGroups.memberCount,
        createdAt: businessGroups.createdAt,
      })
      .from(businessGroups)
      .innerJoin(groupMemberships, eq(businessGroups.id, groupMemberships.groupId))
      .where(eq(groupMemberships.userId, userId));
  }

  // Furniture methods
  async getFurnitureItems(category?: string): Promise<FurnitureItem[]> {
    if (category) {
      return await db
        .select()
        .from(furnitureItems)
        .where(eq(furnitureItems.category, category))
        .orderBy(desc(furnitureItems.averageRating));
    }
    return await db
      .select()
      .from(furnitureItems)
      .orderBy(desc(furnitureItems.averageRating));
  }

  async createFurnitureItem(item: any): Promise<FurnitureItem> {
    const [furnitureItem] = await db
      .insert(furnitureItems)
      .values(item)
      .returning();
    return furnitureItem;
  }

  // Q&A methods
  async createQuestion(question: any): Promise<QAQuestion> {
    const [qaQuestion] = await db
      .insert(qaQuestions)
      .values(question)
      .returning();
    return qaQuestion;
  }

  async getQuestions(category?: string): Promise<QAQuestion[]> {
    if (category) {
      return await db
        .select()
        .from(qaQuestions)
        .where(eq(qaQuestions.category, category))
        .orderBy(desc(qaQuestions.createdAt));
    }
    return await db
      .select()
      .from(qaQuestions)
      .orderBy(desc(qaQuestions.createdAt));
  }

  async answerQuestion(questionId: number, aiResponse: string): Promise<void> {
    await db
      .update(qaQuestions)
      .set({ aiResponse, isAnswered: true })
      .where(eq(qaQuestions.id, questionId));
  }
}

export const storage = new DatabaseStorage();
