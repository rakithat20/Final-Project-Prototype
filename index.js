import express from 'express';
import morgan from 'morgan';
import OpenAI from "openai";
import 'dotenv/config';


const app =  express();
const port = 3000;
app.use(morgan('tiny'));

const ApiKey = process.env.OPENAI_APIKEY;
const openai = new OpenAI(
    {apiKey:ApiKey,}
)
app.get('/test',async(req,res)=>{
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "Write a haiku about recursion in programming." },
            ],
        });

        // Send the response back
        res.json(completion.choices[0].message.content);
    } catch (error) {
        console.error("Error fetching completion:", error);
        res.status(500).send("Failed to fetch completion from OpenAI.");
    }
})


app.listen(port, () => {
    console.log(`Server started on port ${port} successfully`);
});
