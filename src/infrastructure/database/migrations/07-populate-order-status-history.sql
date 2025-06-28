INSERT INTO order_status_history (order_id, status, changed_at, notes)
SELECT id, status, created_at, 'Estado inicial'
FROM shipping_orders
WHERE id NOT IN (SELECT DISTINCT order_id FROM order_status_history); 