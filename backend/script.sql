/*


*/ 


DROP TABLE person_referred; 
CREATE TABLE person_referred (
    ip TEXT PRIMARY KEY
); 

DROP TABLE referrer; 
CREATE TABLE referrer (
    name TEXT PRIMARY KEY, 
    total INTEGER
); 

DROP TABLE shares_so_far; 
CREATE TABLE shares_so_far (
    id INTEGER PRIMARY KEY, 
    total INTEGER DEFAULT 0 
); 


DROP TABLE top_sharers; 
CREATE TABLE top_sharers (
    rank INTEGER PRIMARY KEY CHECK(rank >= 1 AND rank <= 50),
    name TEXT UNIQUE, 
    total INTEGER
); 



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


DROP TABLE spending_totals;
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




/* 
   So this stuff was for aligning the very first donation for testing purposes. So my accounting records and stripe's matched up perfectly. 
*/
UPDATE total_donations SET total = 1818 WHERE id = 1; 

UPDATE pending SET total = 1142 WHERE id = 1;


UPDATE spending_totals SET total = 745 WHERE account = 'stripe'; 

INSERT INTO donor (name, total_donated) VALUES ('James Spencer', 1818);

UPDATE total_spending SET total = 776 WHERE id = 1;


/*
  Ok so initialising the database with some values. 
*/ 

INSERT INTO shares_so_far (id, total) VALUES (1, 0); 

INSERT INTO top_shares (rank, name, total) VALUES (1, 'placeholder1', 0);
INSERT INTO top_shares (rank, name, total) VALUES (2, 'placeholder2', 0);
INSERT INTO top_shares (rank, name, total) VALUES (3, 'placeholder3', 0);
INSERT INTO top_shares (rank, name, total) VALUES (4, 'placeholder4', 0);
INSERT INTO top_shares (rank, name, total) VALUES (5, 'placeholder5', 0);
INSERT INTO top_shares (rank, name, total) VALUES (6, 'placeholder6', 0);
INSERT INTO top_shares (rank, name, total) VALUES (7, 'placeholder7', 0);
INSERT INTO top_shares (rank, name, total) VALUES (8, 'placeholder8', 0);
INSERT INTO top_shares (rank, name, total) VALUES (9, 'placeholder9', 0);
INSERT INTO top_shares (rank, name, total) VALUES (10, 'placeholder10', 0);
INSERT INTO top_shares (rank, name, total) VALUES (11, 'placeholder11', 0);
INSERT INTO top_shares (rank, name, total) VALUES (12, 'placeholder12', 0);
INSERT INTO top_shares (rank, name, total) VALUES (13, 'placeholder13', 0);
INSERT INTO top_shares (rank, name, total) VALUES (14, 'placeholder14', 0);
INSERT INTO top_shares (rank, name, total) VALUES (15, 'placeholder15', 0);
INSERT INTO top_shares (rank, name, total) VALUES (16, 'placeholder16', 0);
INSERT INTO top_shares (rank, name, total) VALUES (17, 'placeholder17', 0);
INSERT INTO top_shares (rank, name, total) VALUES (18, 'placeholder18', 0);
INSERT INTO top_shares (rank, name, total) VALUES (19, 'placeholder19', 0);
INSERT INTO top_shares (rank, name, total) VALUES (20, 'placeholder20', 0);
INSERT INTO top_shares (rank, name, total) VALUES (21, 'placeholder21', 0);
INSERT INTO top_shares (rank, name, total) VALUES (22, 'placeholder22', 0);
INSERT INTO top_shares (rank, name, total) VALUES (23, 'placeholder23', 0);
INSERT INTO top_shares (rank, name, total) VALUES (24, 'placeholder24', 0);
INSERT INTO top_shares (rank, name, total) VALUES (25, 'placeholder25', 0);
INSERT INTO top_shares (rank, name, total) VALUES (26, 'placeholder26', 0);
INSERT INTO top_shares (rank, name, total) VALUES (27, 'placeholder27', 0);
INSERT INTO top_shares (rank, name, total) VALUES (28, 'placeholder28', 0);
INSERT INTO top_shares (rank, name, total) VALUES (29, 'placeholder29', 0);
INSERT INTO top_shares (rank, name, total) VALUES (30, 'placeholder30', 0);
INSERT INTO top_shares (rank, name, total) VALUES (31, 'placeholder31', 0);
INSERT INTO top_shares (rank, name, total) VALUES (32, 'placeholder32', 0);
INSERT INTO top_shares (rank, name, total) VALUES (33, 'placeholder33', 0);
INSERT INTO top_shares (rank, name, total) VALUES (34, 'placeholder34', 0);
INSERT INTO top_shares (rank, name, total) VALUES (35, 'placeholder35', 0);
INSERT INTO top_shares (rank, name, total) VALUES (36, 'placeholder36', 0);
INSERT INTO top_shares (rank, name, total) VALUES (37, 'placeholder37', 0);
INSERT INTO top_shares (rank, name, total) VALUES (38, 'placeholder38', 0);
INSERT INTO top_shares (rank, name, total) VALUES (39, 'placeholder39', 0);
INSERT INTO top_shares (rank, name, total) VALUES (40, 'placeholder40', 0);
INSERT INTO top_shares (rank, name, total) VALUES (41, 'placeholder41', 0);
INSERT INTO top_shares (rank, name, total) VALUES (42, 'placeholder42', 0);
INSERT INTO top_shares (rank, name, total) VALUES (43, 'placeholder43', 0);
INSERT INTO top_shares (rank, name, total) VALUES (44, 'placeholder44', 0);
INSERT INTO top_shares (rank, name, total) VALUES (45, 'placeholder45', 0);
INSERT INTO top_shares (rank, name, total) VALUES (46, 'placeholder46', 0);
INSERT INTO top_shares (rank, name, total) VALUES (47, 'placeholder47', 0);
INSERT INTO top_shares (rank, name, total) VALUES (48, 'placeholder48', 0);
INSERT INTO top_shares (rank, name, total) VALUES (49, 'placeholder49', 0);
INSERT INTO top_shares (rank, name, total) VALUES (50, 'placeholder50', 0);


CREATE TRIGGER increment_shares_so_far_after_referrer_update
AFTER UPDATE OF total ON referrer
BEGIN
    UPDATE shares_so_far
    SET total = total + 1
    WHERE id = 1;
END;

