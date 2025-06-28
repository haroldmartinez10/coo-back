-- Sample data for rates table
-- Different weight ranges and routes for testing

INSERT INTO rates (origin_city, destination_city, weight_min, weight_max, base_price, price_per_kg) VALUES

('Bogotá', 'Medellín', 0.00, 5.00, 15000, 2500),
('Bogotá', 'Medellín', 5.01, 20.00, 25000, 2000),
('Bogotá', 'Medellín', 20.01, 50.00, 45000, 1800),
('Bogotá', 'Medellín', 50.01, 999.99, 80000, 1500),

('Medellín', 'Bogotá', 0.00, 5.00, 15000, 2500),
('Medellín', 'Bogotá', 5.01, 20.00, 25000, 2000),
('Medellín', 'Bogotá', 20.01, 50.00, 45000, 1800),
('Medellín', 'Bogotá', 50.01, 999.99, 80000, 1500),

('Bogotá', 'Cali', 0.00, 5.00, 18000, 3000),
('Bogotá', 'Cali', 5.01, 20.00, 30000, 2500),
('Bogotá', 'Cali', 20.01, 50.00, 55000, 2200),
('Bogotá', 'Cali', 50.01, 999.99, 95000, 1800),

('Cali', 'Bogotá', 0.00, 5.00, 18000, 3000),
('Cali', 'Bogotá', 5.01, 20.00, 30000, 2500),
('Cali', 'Bogotá', 20.01, 50.00, 55000, 2200),
('Cali', 'Bogotá', 50.01, 999.99, 95000, 1800),

('Medellín', 'Cali', 0.00, 5.00, 20000, 3500),
('Medellín', 'Cali', 5.01, 20.00, 35000, 3000),
('Medellín', 'Cali', 20.01, 50.00, 65000, 2500),
('Medellín', 'Cali', 50.01, 999.99, 110000, 2000),

('Cali', 'Medellín', 0.00, 5.00, 20000, 3500),
('Cali', 'Medellín', 5.01, 20.00, 35000, 3000),
('Cali', 'Medellín', 20.01, 50.00, 65000, 2500),
('Cali', 'Medellín', 50.01, 999.99, 110000, 2000),

('Bogotá', 'Barranquilla', 0.00, 5.00, 22000, 4000),
('Bogotá', 'Barranquilla', 5.01, 20.00, 40000, 3500),
('Bogotá', 'Barranquilla', 20.01, 50.00, 75000, 3000),
('Bogotá', 'Barranquilla', 50.01, 999.99, 130000, 2500),

('Barranquilla', 'Bogotá', 0.00, 5.00, 22000, 4000),
('Barranquilla', 'Bogotá', 5.01, 20.00, 40000, 3500),
('Barranquilla', 'Bogotá', 20.01, 50.00, 75000, 3000),
('Barranquilla', 'Bogotá', 50.01, 999.99, 130000, 2500); 