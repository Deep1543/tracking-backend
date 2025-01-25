import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';

// Create an instance of express
const app = express();
const port = 5000;
const jwtSecret = 'your_jwt_secret'; // Replace with your own secret key

app.use(cors({
    origin: '*',
    credentials: true
}));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Create a MySQL connection pool
const db = mysql.createPool({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'deep1543', // Replace with your MySQL password
    database: 'scriptracingapp', // Ensure this database exists
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Function to handle database connection errors
const handleDbError = (error, res) => {
    console.error('Database error:', error);
    res.status(500).send('Internal Server Error');
};

app.get('/categorymaster', (req, res) => {
    const query = 'SELECT * FROM categorymaster';
    db.query(query, (error, results) => {
        if (error) {
            return handleDbError(error, res);
        }
        res.status(200).send(results);
    });
});

app.get('/checkpoint1', (req, res) => {
    const query = 'SELECT * FROM checkpoint1';
    db.query(query, (error, results) => {
        if (error) {
            return handleDbError(error, res);
        }
        res.status(200).send(results);
    });
});

app.get('/checkpoint2', (req, res) => {
    const query = 'SELECT * FROM checkpoint2';
    db.query(query, (error, results) => {
        if (error) {
            return handleDbError(error, res);
        }
        res.status(200).send(results);
    });
});

app.get('/checkpoint3', (req, res) => {
    const query = 'SELECT * FROM checkpoint3';
    db.query(query, (error, results) => {
        if (error) {
            return handleDbError(error, res);
        }
        res.status(200).send(results);
    });
});

app.get('/checkpoint4', (req, res) => {
    const query = 'SELECT * FROM checkpoint4';
    db.query(query, (error, results) => {
        if (error) {
            return handleDbError(error, res);
        }
        res.status(200).send(results);
    });
});

app.get('/checkpoint5', (req, res) => {
    const query = 'SELECT * FROM checkpoint5';
    db.query(query, (error, results) => {
        if (error) {
            return handleDbError(error, res);
        }
        res.status(200).send(results);
    });
});

app.get('/eventmaster', (req, res) => {
    const query = 'SELECT * FROM eventmaster';
    db.query(query, (error, results) => {
        if (error) {
            return handleDbError(error, res);
        }
        res.status(200).send(results);
    });
});

app.get('/finishline', (req, res) => {
    const query = 'SELECT * FROM finishline';
    db.query(query, (error, results) => {
        if (error) {
            return handleDbError(error, res);
        }
        res.status(200).send(results);
    });
});

app.get('/participateinmaster', (req, res) => {
    const query = 'SELECT * FROM participateinmaster';
    db.query(query, (error, results) => {
        if (error) {
            return handleDbError(error, res);
        }
        res.status(200).send(results);
    });
});

app.get('/racelogpoint1', (req, res) => {
    const query = 'SELECT * FROM racelogpoint1';
    db.query(query, (error, results) => {
        if (error) {
            return handleDbError(error, res);
        }
        res.status(200).send(results);
    });
});

app.get('/registration', (req, res) => {
    const query = 'SELECT * FROM registration';
    db.query(query, (error, results) => {
        if (error) {
            return handleDbError(error, res);
        }
        res.status(200).send(results);
    });
});

app.get('/startline', (req, res) => {
    const query = 'SELECT * FROM startline';
    db.query(query, (error, results) => {
        if (error) {
            return handleDbError(error, res);
        }
        res.status(200).send(results);
    });
});

app.get('/usermaster', (req, res) => {
    const query = 'SELECT * FROM usermaster';
    db.query(query, (error, results) => {
        if (error) {
            return handleDbError(error, res);
        }
        res.status(200).send(results);
    });
});

app.get('/event_master', (req, res) => {
    const query = 'SELECT * FROM event_master';
    db.query(query, (error, results) => {
        if (error) {
            return handleDbError(error, res);
        }
        res.status(200).send(results);
    });
});

app.get("/results/:event_id", (req, res) => {
    const eventId = req.params.event_id;

    const query = `
            SELECT 
                r.bibno, 
                r.name, 
                r.categoryid,
                DATE_FORMAT(
                    (SELECT MIN(logtime) FROM finishline WHERE bibno = r.bibno),
                    '%H:%i:%s'
                ) AS finishtime
            FROM 
                registration r
            WHERE 
                r.isactive = 1
                AND r.event_id = ?;
        `;

    db.query(query, [eventId], (err, results) => {
        if (err) {
            console.error("Query failed:", err);
            res.status(500).json({ error: "Internal server error" });
        } else {
            res.status(200).json(results);
        }
    });
});


app.get('/race-info', (req, res) => {
    const { bibno } = req.query;

    if (!bibno) {
        return res.status(400).send('Please provide either bibno .');
    }

    // Base SQL query
    let query = `
      SELECT 
        registrationid,
        bibno,
        DATE_FORMAT((SELECT MIN(StartTime) FROM participateinmaster WHERE participatein = r.participatein), '%H:%i:%s') AS StartTime,
        DATE_FORMAT((SELECT MIN(logtime) FROM finishline WHERE bibno = r.bibno), '%H:%i:%s') AS FinishLine,
        SEC_TO_TIME(TIMESTAMPDIFF(SECOND, (SELECT MIN(StartTime) FROM participateinmaster WHERE participatein = r.participatein), 
          (SELECT MIN(logtime) FROM finishline WHERE bibno = r.bibno))) AS RaceTime,
        DATE_FORMAT((SELECT MIN(logtime) FROM checkpoint1 WHERE bibno = r.bibno), '%H:%i:%s') AS CheckPoint1,
        SEC_TO_TIME(TIMESTAMPDIFF(SECOND, (SELECT MIN(StartTime) FROM participateinmaster WHERE participatein = r.participatein), 
          (SELECT MIN(logtime) FROM checkpoint1 WHERE bibno = r.bibno))) AS checkpoint1Time,
        DATE_FORMAT((SELECT MIN(logtime) FROM checkpoint2 WHERE bibno = r.bibno), '%H:%i:%s') AS CheckPoint2,
        SEC_TO_TIME(TIMESTAMPDIFF(SECOND, (SELECT MIN(StartTime) FROM participateinmaster WHERE participatein = r.participatein), 
          (SELECT MIN(logtime) FROM checkpoint2 WHERE bibno = r.bibno))) AS checkpoint2Time,
        DATE_FORMAT((SELECT MIN(logtime) FROM checkpoint3 WHERE bibno = r.bibno), '%H:%i:%s') AS CheckPoint3,
        SEC_TO_TIME(TIMESTAMPDIFF(SECOND, (SELECT MIN(StartTime) FROM participateinmaster WHERE participatein = r.participatein), 
          (SELECT MIN(logtime) FROM checkpoint3 WHERE bibno = r.bibno))) AS checkpoint3Time,
        DATE_FORMAT((SELECT MIN(logtime) FROM checkpoint4 WHERE bibno = r.bibno), '%H:%i:%s') AS CheckPoint4,
        SEC_TO_TIME(TIMESTAMPDIFF(SECOND, (SELECT MIN(StartTime) FROM participateinmaster WHERE participatein = r.participatein), 
          (SELECT MIN(logtime) FROM checkpoint4 WHERE bibno = r.bibno))) AS checkpoint4Time,
        DATE_FORMAT((SELECT MIN(logtime) FROM checkpoint5 WHERE bibno = r.bibno), '%H:%i:%s') AS CheckPoint5,
        SEC_TO_TIME(TIMESTAMPDIFF(SECOND, (SELECT MIN(StartTime) FROM participateinmaster WHERE participatein = r.participatein), 
          (SELECT MIN(logtime) FROM checkpoint5 WHERE bibno = r.bibno))) AS checkpoint5Time,
        rfid1, rfid2, name, gender, dob, city, email, contactno, emergencyno, tshirtsize, bookingreference, 
        participatein, isactive, entrydate, categoryid, entryby, updatedate, updateby
      FROM 
        registration r 
      WHERE 
        isactive = 1 
        AND participatein IS NOT NULL
        AND categoryid IS NOT NULL
    `;

    // Add condition based on input
    if (bibno) {
        query += ` AND bibno = ?`;
    } else if (name) {
        query += ` AND name LIKE ?`;
    }

    query += ` ORDER BY checkpoint1;`;

    // Define parameter for query
    const param = bibno ? [bibno] : [`%${name}%`];

    // Execute the query
    db.query(query, param, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('An error occurred while querying the database');
        }

        if (results.length === 0) {
            return res.status(404).send('No data found for the given criteria');
        }

        // Send the results as JSON
        res.json(results);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
