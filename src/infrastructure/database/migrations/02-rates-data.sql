

-- Check if rates table has data, if not, insert the initial data
INSERT INTO rates (origin_city, destination_city, weight_min, weight_max, base_price, price_per_kg)
SELECT * FROM (
  SELECT 'Bogotá' as origin_city, 'Medellín' as destination_city, 0.00 as weight_min, 5.00 as weight_max, 15000 as base_price, 2500 as price_per_kg
  UNION ALL SELECT 'Bogotá', 'Medellín', 5.01, 20.00, 25000, 2000
  UNION ALL SELECT 'Bogotá', 'Medellín', 20.01, 50.00, 45000, 1800
  UNION ALL SELECT 'Bogotá', 'Medellín', 50.01, 999.99, 80000, 1500
  
  UNION ALL SELECT 'Medellín', 'Bogotá', 0.00, 5.00, 15000, 2500
  UNION ALL SELECT 'Medellín', 'Bogotá', 5.01, 20.00, 25000, 2000
  UNION ALL SELECT 'Medellín', 'Bogotá', 20.01, 50.00, 45000, 1800
  UNION ALL SELECT 'Medellín', 'Bogotá', 50.01, 999.99, 80000, 1500
  
  UNION ALL SELECT 'Bogotá', 'Cali', 0.00, 5.00, 18000, 3000
  UNION ALL SELECT 'Bogotá', 'Cali', 5.01, 20.00, 30000, 2500
  UNION ALL SELECT 'Bogotá', 'Cali', 20.01, 50.00, 55000, 2200
  UNION ALL SELECT 'Bogotá', 'Cali', 50.01, 999.99, 95000, 1800
  
  UNION ALL SELECT 'Cali', 'Bogotá', 0.00, 5.00, 18000, 3000
  UNION ALL SELECT 'Cali', 'Bogotá', 5.01, 20.00, 30000, 2500
  UNION ALL SELECT 'Cali', 'Bogotá', 20.01, 50.00, 55000, 2200
  UNION ALL SELECT 'Cali', 'Bogotá', 50.01, 999.99, 95000, 1800
  
  UNION ALL SELECT 'Medellín', 'Cali', 0.00, 5.00, 20000, 3500
  UNION ALL SELECT 'Medellín', 'Cali', 5.01, 20.00, 35000, 3000
  UNION ALL SELECT 'Medellín', 'Cali', 20.01, 50.00, 65000, 2500
  UNION ALL SELECT 'Medellín', 'Cali', 50.01, 999.99, 110000, 2000
  
  UNION ALL SELECT 'Cali', 'Medellín', 0.00, 5.00, 20000, 3500
  UNION ALL SELECT 'Cali', 'Medellín', 5.01, 20.00, 35000, 3000
  UNION ALL SELECT 'Cali', 'Medellín', 20.01, 50.00, 65000, 2500
  UNION ALL SELECT 'Cali', 'Medellín', 50.01, 999.99, 110000, 2000
  
  UNION ALL SELECT 'Bogotá', 'Barranquilla', 0.00, 5.00, 22000, 4000
  UNION ALL SELECT 'Bogotá', 'Barranquilla', 5.01, 20.00, 40000, 3500
  UNION ALL SELECT 'Bogotá', 'Barranquilla', 20.01, 50.00, 75000, 3000
  UNION ALL SELECT 'Bogotá', 'Barranquilla', 50.01, 999.99, 130000, 2500
  
  UNION ALL SELECT 'Barranquilla', 'Bogotá', 0.00, 5.00, 22000, 4000
  UNION ALL SELECT 'Barranquilla', 'Bogotá', 5.01, 20.00, 40000, 3500
  UNION ALL SELECT 'Barranquilla', 'Bogotá', 20.01, 50.00, 75000, 3000
  UNION ALL SELECT 'Barranquilla', 'Bogotá', 50.01, 999.99, 130000, 2500
) AS temp_rates
WHERE NOT EXISTS (SELECT 1 FROM rates LIMIT 1); 