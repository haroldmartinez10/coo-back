CREATE TABLE IF NOT EXISTS quote_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  origin_city VARCHAR(100) NOT NULL,
  destination_city VARCHAR(100) NOT NULL,
  actual_weight DECIMAL(8,2) NOT NULL,
  volume_weight DECIMAL(8,2) NOT NULL,
  selected_weight DECIMAL(8,2) NOT NULL,
  height DECIMAL(8,2) NOT NULL,
  width DECIMAL(8,2) NOT NULL,
  length DECIMAL(8,2) NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  price_per_kg DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
); 