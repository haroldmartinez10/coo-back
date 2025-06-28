CREATE TABLE IF NOT EXISTS order_status_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  FOREIGN KEY (order_id) REFERENCES shipping_orders(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id),
  INDEX idx_status (status),
  INDEX idx_changed_at (changed_at)
);

INSERT INTO order_status_history (order_id, status, changed_at, notes)
SELECT id, status, created_at, 'Estado inicial'
FROM shipping_orders
WHERE id NOT IN (SELECT DISTINCT order_id FROM order_status_history); 