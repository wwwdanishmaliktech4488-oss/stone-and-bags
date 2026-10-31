-- ============================================================
-- STONE & BAGS — FULL DATABASE SCHEMA
-- Run this once in MySQL to set up everything.
-- ============================================================

-- Create database
CREATE DATABASE IF NOT EXISTS stone_and_bags
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE stone_and_bags;

-- ============================================================
-- TABLE: admins
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'superadmin') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: categories
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(120) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: products
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  category_id INT,
  image_url VARCHAR(500),
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ============================================================
-- TABLE: customers (guest checkout supported, so this is optional)
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150),
  phone VARCHAR(30),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- TABLE: orders
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  customer_name VARCHAR(150) NOT NULL,
  customer_email VARCHAR(150),
  customer_phone VARCHAR(30) NOT NULL,
  shipping_address TEXT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  payment_method ENUM('cod', 'bank_transfer') DEFAULT 'cod',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

-- ============================================================
-- TABLE: order_items
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT,
  product_name VARCHAR(200) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- ============================================================
-- SEED: first admin account
-- Email: admin@stonebags.com
-- Password: admin123   (bcrypt hash below)
-- ⚠️ CHANGE PASSWORD AFTER FIRST LOGIN!
-- ============================================================
INSERT INTO admins (name, email, password, role)
VALUES (
  'Super Admin',
  'admin@stonebags.com',
  '$2b$10$8QK1hZ9cJz8f3xWq5yV6NOQe8mL6bXv2T9wYc7rH3nV8kJ0mPz4Qe',
  'superadmin'
)
ON DUPLICATE KEY UPDATE email = email;

-- ============================================================
-- SEED: sample categories
-- ============================================================
INSERT INTO categories (name, slug) VALUES
  ('Stone Products', 'stone-products'),
  ('Bags', 'bags'),
  ('Accessories', 'accessories')
ON DUPLICATE KEY UPDATE name = name;

-- ============================================================
-- SEED: sample products
-- ============================================================
INSERT INTO products (name, slug, description, price, stock, category_id, image_url) VALUES
  ('Granite Slab', 'granite-slab', 'Premium polished granite slab, 2cm thick.', 250.00, 20, 1, NULL),
  ('Marble Tile', 'marble-tile', 'White marble tile, 60x60cm.', 45.00, 100, 1, NULL),
  ('Leather Shoulder Bag', 'leather-shoulder-bag', 'Handcrafted leather shoulder bag.', 120.00, 15, 2, NULL),
  ('Canvas Tote Bag', 'canvas-tote-bag', 'Durable canvas tote for daily use.', 35.00, 50, 2, NULL),
  ('Stone Pendant', 'stone-pendant', 'Handmade stone pendant necklace.', 25.00, 40, 3, NULL)
ON DUPLICATE KEY UPDATE name = name;

-- ============================================================
-- DONE ✅
-- ============================================================