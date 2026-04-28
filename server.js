import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import recipeRoutes from './routes/recipeRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("OK");
});

app.use("/recipes", recipeRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});