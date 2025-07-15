import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
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

  const httpServer = createServer(app);
  return httpServer;
}
