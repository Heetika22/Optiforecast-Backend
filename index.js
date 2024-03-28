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

// Endpoint to get all employees
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
});

// Endpoint to get all suppliers
app.get('/supplier', (req, res) => {
    const query = 'SELECT * FROM supplier';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Error fetching suppliers' });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

// Endpoint to create a new item in the stock
app.post('/stock', (req, res) => {
    const { productid, name, cost, category, supplier_name } = req.body;
    const query = 'INSERT INTO stock (productid, name, cost, category, supplier_name) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    db.query(query, [productid, name, cost, category, supplier_name], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Error creating item in stock' });
        } else {
            res.status(201).json(result.rows[0]);
        }
    });
});

// Endpoint to get all items from the stock
app.get('/stock', (req, res) => {
    const query = 'SELECT * FROM stock';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Error fetching items from stock' });
        } else {
            res.status(200).json(result.rows);
        }
    });
});

// Endpoint to get a single item from the stock by ID
app.get('/stock/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM stock WHERE id = $1';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Error fetching item from stock' });
        } else {
            if (result.rows.length === 0) {
                res.status(404).json({ error: 'Item not found in stock' });
            } else {
                res.status(200).json(result.rows[0]);
            }
        }
    });
});

// Endpoint to update an item in the stock by ID
app.put('/stock/:id', (req, res) => {
    const { id } = req.params;
    const { productid, name, cost, category, supplier_name } = req.body;
    const query = 'UPDATE stock SET productid = $1, name = $2, cost = $3, category = $4, supplier_name = $5 WHERE id = $6 RETURNING *';
    db.query(query, [productid, name, cost, category, supplier_name, id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Error updating item in stock' });
        } else {
            if (result.rows.length === 0) {
                res.status(404).json({ error: 'Item not found in stock' });
            } else {
                res.status(200).json(result.rows[0]);
            }
        }
    });
});

// Endpoint to delete an item from the stock by ID
app.delete('/stock/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM stock WHERE id = $1';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Error deleting item from stock' });
        } else {
            if (result.rowCount === 0) {
                res.status(404).json({ error: 'Item not found in stock' });
            } else {
                res.status(200).json({ message: 'Item deleted successfully' });
            }
        }
    });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
