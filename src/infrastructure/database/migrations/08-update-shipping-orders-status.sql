UPDATE shipping_orders 
SET status = CASE 
    WHEN status = 'En espera' THEN 'pending'
    WHEN status = 'En tránsito' THEN 'in_transit'
    WHEN status = 'Entregado' THEN 'delivered'
    ELSE status
END; 