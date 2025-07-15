import type { Express } from "express";
import { createServer, type Server } from "http";
import cors from "cors";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertRoomDesignSchema, 
  insertBusinessGroupSchema, 
  insertQAQuestionSchema 
} from "@shared/schema";
import { ZodError } from "zod";

// In-memory storage for furniture and rooms
let furnitureItems = [
  {
    id: 1,
    name: "Modern Sectional Sofa",
    category: "Sofa",
    price: 1299,
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    description: "Contemporary sectional sofa with clean lines and comfortable cushioning. Perfect for modern living rooms."
  },
  {
    id: 2,
    name: "Ergonomic Office Chair",
    category: "Chair",
    price: 899,
    imageUrl: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400",
    description: "Premium ergonomic office chair designed for all-day comfort and productivity."
  },
  {
    id: 3,
    name: "Minimalist Dining Table",
    category: "Table",
    price: 749,
    imageUrl: "https://images.unsplash.com/photo-1549497538-303791108f95?w=400",
    description: "Scandinavian-inspired dining table with clean lines and sustainable wood construction."
  },
  {
    id: 4,
    name: "Industrial Coffee Table",
    category: "Table",
    price: 399,
    imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400",
    description: "Industrial-style coffee table with metal frame and reclaimed wood top."
  },
  {
    id: 5,
    name: "Velvet Accent Chair",
    category: "Chair",
    price: 599,
    imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400",
    description: "Luxurious velvet accent chair in emerald green with gold legs."
  }
];

let roomLayouts: any[] = [
  {
    id: "living-room-1",
    name: "Modern Living Room",
    furniture: [
      { furnitureId: 1, x: 200, y: 300, z: 0, rotation: 0 },
      { furnitureId: 4, x: 400, y: 350, z: 0, rotation: 45 }
    ]
  }
];

let nextFurnitureId = 6;

export async function registerRoutes(app: Express): Promise<Server> {
  // Enable CORS
  app.use(cors());

  // 1. GET /api/furniture – Returns a list of furniture items
  app.get("/api/furniture", (req, res) => {
    res.status(200).json({
      success: true,
      data: furnitureItems,
      count: furnitureItems.length
    });
  });

  // 2. POST /api/furniture – Adds a new furniture item
  app.post("/api/furniture", (req, res) => {
    try {
      const { name, category, price, imageUrl, description } = req.body;

      // Validation
      if (!name || !category || !price || !imageUrl || !description) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: name, category, price, imageUrl, description"
        });
      }

      if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({
          success: false,
          message: "Price must be a positive number"
        });
      }

      const newFurniture = {
        id: nextFurnitureId++,
        name,
        category,
        price,
        imageUrl,
        description
      };

      furnitureItems.push(newFurniture);

      res.status(201).json({
        success: true,
        message: "Furniture item created successfully",
        data: newFurniture
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // 3. GET /api/room/:id – Returns a saved room layout
  app.get("/api/room/:id", (req, res) => {
    try {
      const roomId = req.params.id;
      const room = roomLayouts.find(r => r.id === roomId);

      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Room not found"
        });
      }

      res.status(200).json({
        success: true,
        data: room
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // 4. POST /api/room – Saves a new room layout
  app.post("/api/room", (req, res) => {
    try {
      const { id, name, furniture } = req.body;

      // Validation
      if (!id || !name || !furniture) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: id, name, furniture"
        });
      }

      if (!Array.isArray(furniture)) {
        return res.status(400).json({
          success: false,
          message: "Furniture must be an array"
        });
      }

      // Validate furniture items structure
      for (const item of furniture) {
        if (!item.furnitureId || typeof item.x !== 'number' || typeof item.y !== 'number' || 
            typeof item.z !== 'number' || typeof item.rotation !== 'number') {
          return res.status(400).json({
            success: false,
            message: "Each furniture item must have furnitureId, x, y, z, and rotation"
          });
        }
      }

      // Check if room already exists
      const existingRoomIndex = roomLayouts.findIndex(r => r.id === id);
      
      const newRoom = { id, name, furniture };

      if (existingRoomIndex >= 0) {
        // Update existing room
        roomLayouts[existingRoomIndex] = newRoom;
        res.status(200).json({
          success: true,
          message: "Room layout updated successfully",
          data: newRoom
        });
      } else {
        // Create new room
        roomLayouts.push(newRoom);
        res.status(201).json({
          success: true,
          message: "Room layout created successfully",
          data: newRoom
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Additional helper endpoints

  // GET /api/rooms – Get all room layouts
  app.get("/api/rooms", (req, res) => {
    res.status(200).json({
      success: true,
      data: roomLayouts,
      count: roomLayouts.length
    });
  });

  // DELETE /api/furniture/:id – Delete a furniture item
  app.delete("/api/furniture/:id", (req, res) => {
    try {
      const furnitureId = parseInt(req.params.id);
      const furnitureIndex = furnitureItems.findIndex(item => item.id === furnitureId);

      if (furnitureIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Furniture item not found"
        });
      }

      const deletedItem = furnitureItems.splice(furnitureIndex, 1)[0];

      res.status(200).json({
        success: true,
        message: "Furniture item deleted successfully",
        data: deletedItem
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // DELETE /api/room/:id – Delete a room layout
  app.delete("/api/room/:id", (req, res) => {
    try {
      const roomId = req.params.id;
      const roomIndex = roomLayouts.findIndex(r => r.id === roomId);

      if (roomIndex === -1) {
        return res.status(404).json({
          success: false,
          message: "Room not found"
        });
      }

      const deletedRoom = roomLayouts.splice(roomIndex, 1)[0];

      res.status(200).json({
        success: true,
        message: "Room layout deleted successfully",
        data: deletedRoom
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.status(200).json({
      success: true,
      message: "API is running",
      timestamp: new Date().toISOString(),
      endpoints: {
        furniture: {
          "GET /api/furniture": "Get all furniture items",
          "POST /api/furniture": "Create new furniture item",
          "DELETE /api/furniture/:id": "Delete furniture item"
        },
        rooms: {
          "GET /api/room/:id": "Get specific room layout",
          "POST /api/room": "Create/update room layout", 
          "GET /api/rooms": "Get all room layouts",
          "DELETE /api/room/:id": "Delete room layout"
        }
      }
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
