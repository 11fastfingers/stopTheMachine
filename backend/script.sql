/*


*/ 

DROP TABLE donor; 
CREATE TABLE donor (
    name TEXT PRIMARY KEY,
    total_donated INTEGER DEFAULT 0
); 

DROP TABLE donation;
CREATE TABLE donation (
    id INTEGER PRIMARY KEY, 
    donor_name TEXT, 
    amount INTEGER NOT NULL, 
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_name) REFERENCES donor(name) ON DELETE CASCADE 
);


DROP TABLE total_donations; 
CREATE TABLE total_donations (
    id INTEGER PRIMARY KEY, 
    total INTEGER DEFAULT 1
); 


CREATE TABLE total_spending (
    id INTEGER PRIMARY KEY, 
    total INTEGER DEFAULT 0
); 
INSERT INTO total_spending (id) VALUES (1);


CREATE TABLE pending (
    id INTEGER PRIMARY KEY, 
    total INTEGER DEFAULT 0
); 
INSERT INTO pending (id) VALUES (1);



DROP TABLE spending; 
CREATE TABLE spending (
  id INTEGER PRIMARY KEY,
  account TEXT, /*  e.g cash    */ 
  amount INTEGER DEFAULT 0 /* e.g 500 00 */ 
); 
INSERT INTO spending (account, amount) VALUES ('stripe', 0);


CREATE TABLE spending_totals (
  account TEXT PRIMARY KEY, 
  total INTEGER DEFAULT 0
); 

CREATE TRIGGER update_spending_totals
AFTER INSERT ON spending
BEGIN
    INSERT INTO spending_totals (account, total)
    VALUES (NEW.account, NEW.amount)
    ON CONFLICT(account) DO UPDATE SET total = total + NEW.amount;
END;



CREATE TRIGGER update_total_donated_after_insert
AFTER INSERT ON donation
WHEN NEW.donor_name IS NOT NULL
BEGIN
    UPDATE donor
    SET total_donated = total_donated + NEW.amount
    WHERE name = NEW.donor_name;
END;


DROP TRIGGER update_total_spending_after_insert; 
CREATE TRIGGER update_total_spending_after_insert
AFTER INSERT ON spending
BEGIN
    UPDATE total_spending
    SET total = total + NEW.amount;
END;


CREATE TRIGGER update_pending_after_spending
AFTER UPDATE ON total_spending
BEGIN
    UPDATE pending
    SET total = (SELECT total FROM total_donations WHERE id = 1) - (SELECT total FROM total_spending WHERE id = 1);
END;

CREATE TRIGGER update_pending_after_donation
AFTER UPDATE ON total_donations
BEGIN
    UPDATE pending
    SET total = (SELECT total FROM total_donations WHERE id = 1)
              - (SELECT total FROM total_spending WHERE id = 1);
END;