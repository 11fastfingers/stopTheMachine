/*

    Database structure
    -> Need a single database which stores names and donations
    -> Are wait a second, this is many to many relationship. But I don't need to bother with it
      I'll treat it like a one to many relationship. Where there is a single name and many possible donations from that name. 

    -> So I need a donor table which stores the names
    -> I need a donation table which stores the name and the amount donated. FK names. 

*/ 

CREATE TABLE donor (
    id INTEGER PRIMARY KEY, 
    name TEXT DEFAULT 'Anonymous'
); 

CREATE TABLE donation (
    id INTEGER PRIMARY KEY, 
    donor_id INTEGER NOT NULL, 
    amount INTEGER NOT NULL, 
    donated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES donor(id) ON DELETE CASCADE 
);