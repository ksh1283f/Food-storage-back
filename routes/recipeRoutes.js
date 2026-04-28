import express from 'express';
import { getAIRecipes } from "../services/openaiService.js";

const router = express.Router();

router.post('/ai-recommend', async (req, res) => {
    try{
        const result = await getAIRecipes(req.body);
        res.json(result);
    }catch(e){
        console.error(e);
        res.status(500).json({error: "AI recommendation failed" });
    }
});

export default router;