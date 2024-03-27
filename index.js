import pg from 'pg';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = 3000;

const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'inventory',
    password: 'root',
    port: 5432,
});


// CRUD operations for Inventory table
const getInventory = (request, response) => {
    db.query('SELECT * FROM Inventory', (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};

const getInventoryById = (request, response) => {
    const id = parseInt(request.params.id);

    db.query('SELECT * FROM Inventory WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
}

const createInventory = (request, response) => {
    const { product, quantity } = request.body;

    db.query('INSERT INTO Inventory (product, quantity) VALUES ($1, $2)', [product, quantity], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(201).send(`Inventory added with ID: ${results.insertId}`);
    });
}

const updateInventory = (request, response) => {
    const id = parseInt(request.params.id);
    const { product, quantity } = request.body;

    db.query('UPDATE Inventory SET product = $1, quantity = $2 WHERE id = $3', [product, quantity, id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`Inventory modified with ID: ${id}`);
    });
}

const deleteInventory = (request, response) => {
    const id = parseInt(request.params.id);

    db.query('DELETE FROM Inventory WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`Inventory deleted with ID: ${id}`);
    });
}

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})