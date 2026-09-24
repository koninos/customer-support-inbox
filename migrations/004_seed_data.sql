INSERT INTO customers (name, email)
VALUES
  ('John Doe', 'john@example.com'),
  ('Jane Smith', 'jane@example.com'),
  ('Bob Johnson', 'bob@example.com');

INSERT INTO conversations (customer_id, subject, status)
VALUES
  (1, 'Payment charged twice', 'open'),
  (2, 'Unable to log in', 'open'),
  (3, 'Refund request', 'closed');

INSERT INTO messages (conversation_id, sender_type, body)
VALUES
  (1, 'customer', 'I was charged twice for my subscription.'),
  (1, 'agent', 'I''m sorry about that. I''ll look into the duplicate charge for you.'),
  (2, 'customer', 'I cannot log in to my account.'),
  (2, 'agent', 'I''ll help you get back into your account.'),
  (3, 'customer', 'I would like to request a refund.');