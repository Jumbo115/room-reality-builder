import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertRoomDesignSchema, 
  insertBusinessGroupSchema, 
  insertQAQuestionSchema 
} from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // User management routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ 
          message: "Username already exists" 
        });
      }

      const user = await storage.createUser(userData);
      
      // Don't return password in response
      const { password, ...userResponse } = user;
      res.status(201).json(userResponse);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid user data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Don't return password in response
      const { password, ...userResponse } = user;
      res.json(userResponse);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/users", async (req, res) => {
    try {
      // For now, this is a simple endpoint - in production you'd want pagination
      const { username } = req.query;
      
      if (username && typeof username === 'string') {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        const { password, ...userResponse } = user;
        return res.json([userResponse]);
      }

      // In a real app, you'd implement pagination and filtering
      res.json({ message: "Use specific user ID or username parameter" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Authentication routes (basic structure for future implementation)
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ 
          message: "Username and password are required" 
        });
      }

      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ 
          message: "Invalid credentials" 
        });
      }

      // In production, you'd use proper password hashing and JWT tokens
      const { password: _, ...userResponse } = user;
      res.json({ 
        message: "Login successful", 
        user: userResponse 
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Furniture discovery endpoints (foundation for future AI features)
  app.get("/api/furniture/categories", (req, res) => {
    const categories = [
      { id: 1, name: "Living Room", icon: "sofa" },
      { id: 2, name: "Bedroom", icon: "bed" },
      { id: 3, name: "Dining Room", icon: "utensils" },
      { id: 4, name: "Office", icon: "briefcase" },
      { id: 5, name: "Outdoor", icon: "tree-pine" }
    ];
    res.json(categories);
  });

  app.get("/api/furniture/trending", (req, res) => {
    const trending = [
      {
        id: 1,
        name: "Modern Sectional Sofa",
        category: "Living Room",
        price: 1299,
        image: "/api/placeholder/furniture/sofa-1",
        aiScore: 98,
        description: "Contemporary sectional with clean lines"
      },
      {
        id: 2,
        name: "Ergonomic Office Chair",
        category: "Office",
        price: 899,
        image: "/api/placeholder/furniture/chair-1",
        aiScore: 95,
        description: "Premium ergonomic design for productivity"
      },
      {
        id: 3,
        name: "Minimalist Dining Table",
        category: "Dining Room",
        price: 749,
        image: "/api/placeholder/furniture/table-1",
        aiScore: 92,
        description: "Scandinavian-inspired dining table"
      }
    ];
    res.json(trending);
  });

  // AI recommendation endpoint (structure for future implementation)
  app.post("/api/ai/recommendations", (req, res) => {
    const { style, budget, room, preferences } = req.body;
    
    // This would integrate with AI services in production
    const mockRecommendations = [
      {
        id: 1,
        name: "AI Curated Living Set",
        matchScore: 97,
        reason: "Perfect match for your modern minimalist style",
        items: ["Sectional Sofa", "Coffee Table", "Floor Lamp"],
        totalPrice: 2299
      }
    ];
    
    res.json({
      recommendations: mockRecommendations,
      aiAnalysis: {
        styleConfidence: 95,
        budgetOptimized: true,
        spaceUtilization: 88
      }
    });
  });

  // Community Room Design Routes
  app.post("/api/community/rooms", async (req, res) => {
    try {
      const roomData = insertRoomDesignSchema.parse(req.body);
      const room = await storage.createRoomDesign(roomData);
      res.status(201).json(room);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid room data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/community/rooms", async (req, res) => {
    try {
      const { limit } = req.query;
      const rooms = await storage.getPublicRoomDesigns(limit ? parseInt(limit as string) : undefined);
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/community/rooms/:id", async (req, res) => {
    try {
      const roomId = parseInt(req.params.id);
      const room = await storage.getRoomDesign(roomId);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      res.json(room);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/community/rooms/:id/like", async (req, res) => {
    try {
      const roomId = parseInt(req.params.id);
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }
      
      await storage.likeRoom(userId, roomId);
      res.json({ message: "Room liked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/users/:id/rooms", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const rooms = await storage.getUserRoomDesigns(userId);
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Business Groups Routes
  app.post("/api/business/groups", async (req, res) => {
    try {
      const groupData = insertBusinessGroupSchema.parse(req.body);
      const group = await storage.createBusinessGroup(groupData);
      res.status(201).json(group);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid group data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/business/groups", async (req, res) => {
    try {
      const { category } = req.query;
      const groups = await storage.getBusinessGroups(category as string);
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/business/groups/:id/join", async (req, res) => {
    try {
      const groupId = parseInt(req.params.id);
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }
      
      await storage.joinGroup(userId, groupId);
      res.json({ message: "Successfully joined group" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/users/:id/groups", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const groups = await storage.getUserGroups(userId);
      res.json(groups);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Furniture Items with Reviews
  app.get("/api/furniture/items", async (req, res) => {
    try {
      const { category } = req.query;
      const items = await storage.getFurnitureItems(category as string);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/furniture/items", async (req, res) => {
    try {
      const itemData = req.body;
      const item = await storage.createFurnitureItem(itemData);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Q&A with AI Receptionist
  app.post("/api/qa/questions", async (req, res) => {
    try {
      const questionData = insertQAQuestionSchema.parse(req.body);
      const question = await storage.createQuestion(questionData);
      
      // Generate AI response (this would integrate with actual AI service)
      const aiResponse = generateAIResponse(question.question, question.category);
      await storage.answerQuestion(question.id, aiResponse);
      
      const answeredQuestion = await storage.getQuestions();
      const latest = answeredQuestion.find(q => q.id === question.id);
      
      res.status(201).json(latest);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid question data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/qa/questions", async (req, res) => {
    try {
      const { category } = req.query;
      const questions = await storage.getQuestions(category as string);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Account & Subscription Management
  app.put("/api/users/:id/subscription", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { plan, expiry } = req.body;
      
      if (!plan || !expiry) {
        return res.status(400).json({ message: "Plan and expiry date required" });
      }
      
      await storage.updateUserSubscription(userId, plan, new Date(expiry));
      res.json({ message: "Subscription updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// AI Response Generator (placeholder for actual AI integration)
function generateAIResponse(question: string, category?: string): string {
  const responses = {
    furniture: "Based on your question about furniture, I'd recommend considering the room's dimensions, lighting, and your personal style preferences. For specific product recommendations, I can help you find pieces that match your aesthetic and budget.",
    design: "Great design question! The key is balancing functionality with aesthetics. Consider the flow of the space, natural light sources, and how the room will be used daily.",
    business: "For business spaces, prioritize functionality and brand representation. Consider traffic flow, meeting spaces, and creating an environment that supports productivity and client comfort.",
    default: "Thank you for your question! I'm here to help with furniture selection, room design, and space planning. Could you provide more details about your specific needs?"
  };
  
  return responses[category as keyof typeof responses] || responses.default;
}
