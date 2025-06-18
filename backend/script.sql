/*

    Database structure
    -> Need a single database which stores names and donations
    -> Are wait a second, this is many to many relationship. But I don't need to bother with it
      I'll treat it like a one to many relationship. Where there is a single name and many possible donations from that name. 

    -> So I need a donor table which stores the names
    -> I need a donation table which stores the name and the amount donated. FK names. 

    -> Storing total donations could be useful, it would have to be increased incrementally. This is much more efficient than constantly summing the donation table. 

    -> I also need to represent the spending as a database. 

    In terms of transparancy, I want there to be: 
    - the pie chart of spending 
    - Total donations could be like the heading... yes... that makes sense. 
    
    Overall, I want great detail for this... 

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




CREATE TABLE total_donations (
    id INTEGER PRIMARY KEY, 
    total INTEGER
); 