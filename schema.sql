-- Town Bakery Database Schema
-- SQLite database schema for local development
-- This file can be used to initialize the database directly with SQL

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS "Contact";
DROP TABLE IF EXISTS "Order";
DROP TABLE IF EXISTS "User";
DROP TABLE IF EXISTS "Product";
DROP TABLE IF EXISTS "Category";

-- Create Category table (must be created before Product due to foreign key)
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "name_ar" TEXT,
    "name_en" TEXT,
    "slug" TEXT NOT NULL UNIQUE,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Product table
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "name_ar" TEXT,
    "name_en" TEXT,
    "description" TEXT NOT NULL,
    "description_ar" TEXT,
    "description_en" TEXT,
    "price" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "image" TEXT NOT NULL,
    "slug" TEXT UNIQUE,
    "category" TEXT,
    "categoryId" INTEGER,
    "price_cents" INTEGER,
    "image_path" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "ingredients" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL
);

-- Create User table
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "role" TEXT NOT NULL DEFAULT 'customer',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Order table
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "products" TEXT NOT NULL,
    "total" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "customerName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT,
    "deliveryTime" TEXT,
    "paymentMethod" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Contact table
CREATE TABLE "Contact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX "idx_product_category" ON "Product"("category");
CREATE INDEX "idx_product_categoryId" ON "Product"("categoryId");
CREATE INDEX "idx_product_slug" ON "Product"("slug");
CREATE INDEX "idx_category_slug" ON "Category"("slug");
CREATE INDEX "idx_order_status" ON "Order"("status");
CREATE INDEX "idx_order_created" ON "Order"("createdAt");
CREATE INDEX "idx_contact_created" ON "Contact"("createdAt");

