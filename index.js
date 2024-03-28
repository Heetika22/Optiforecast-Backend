import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL configuration
const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'optiforecast', // Change this to your database name
    password: 'root',
    port: 5432,
});

// Connect to PostgreSQL database
db.connect(err => {
    if (err) {
        console.error('Error connecting to PostgreSQL:', err);
    } else {
        console.log('Connected to PostgreSQL database');
    }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Optiforecast API');
});

// Endpoint to create a new employee
app.post('/employee', (req, res) => {
    const { name, position, access, contact } = req.body;
    console.log('Received employee data:', { name, position, access, contact }); // Log received data
    const query = 'INSERT INTO employee (name, position, access, contact) VALUES ($1, $2, $3, $4) RETURNING *';
    db.query(query, [name, position, access, contact], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Error creating employee' });
        } else {
            res.status(201).json(result.rows[0]);
        }
    });
});


// Endpoint to create a new supplier
app.post('/supplier', (req, res) => {
    const { name, address, category, contact } = req.body;
    const query = 'INSERT INTO supplier (name, address, category, contact) VALUES ($1, $2, $3, $4) RETURNING *';
    db.query(query, [name, address, category, contact], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Error creating supplier' });
        } else {
            res.status(201).json(result.rows[0]);
        }
    });
});

// Endpoint to delete an employee by ID
app.delete('/employee/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM employee WHERE id = $1';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Error deleting employee' });
        } else {
            console.log(`Employee with ID ${id} deleted successfully`); // Add this log statement
            res.status(200).json({ message: 'Employee deleted successfully' });
        }
    });
});


// Endpoint to delete a supplier by ID
app.delete('/supplier/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM supplier WHERE id = $1';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Error deleting supplier' });
        } else {
            res.status(200).json({ message: 'Supplier deleted successfully' });
        }
    });
});

// Endpoint to update an employee by ID
app.put('/employee/:id', (req, res) => {
    const { id } = req.params;
    const { name, position, access, contact } = req.body;
    const query = 'UPDATE employee SET name = $1, position = $2, access = $3, contact = $4 WHERE id = $5 RETURNING *';
    db.query(query, [name, position, access, contact, id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Error updating employee' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    });
});

// Endpoint to update a supplier by ID
app.put('/supplier/:id', (req, res) => {
    const { id } = req.params;
    const { name, address, category, contact } = req.body;
    const query = 'UPDATE supplier SET name = $1, address = $2, category = $3, contact = $4 WHERE id = $5 RETURNING *';
    db.query(query, [name, address, category, contact, id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Error updating supplier' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    });
});

app.get('/employee', (req, res) => {
    const query = 'SELECT * FROM employee';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Error fetching employees' });
        } else {
            res.status(200).json(result.rows);
        }
    });
}
);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
