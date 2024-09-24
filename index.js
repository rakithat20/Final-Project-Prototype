import express from 'express';
import morgan from 'morgan';
import OpenAI from "openai";
import cors from 'cors'
import 'dotenv/config';


const app =  express();
const port = 3000;
app.use(morgan('tiny'));
app.use(cors())
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

const ApiKey = process.env.OPENAI_APIKEY;
const openai = new OpenAI(
    {apiKey:ApiKey,}
)
app.post('/test',async(req,res)=>{
    console.log(req.body);
    const form = req.body
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: 'You are an AI assistant responsible for determining whether a job description matches an applicants details. Your task is to evaluate the job description and applicants qualifications, skills, and experience to assess if the applicant is suitable for the job. You must only respond with either "Yes" if the applicant is suitable, or "No" if they are not. Base your decision solely on the relevance of the skills, qualifications, and experience mentioned in the applicants details compared to the job description. Avoid providing explanations or elaborations.' },
                { role: "user", content: `Job description : {${form.jobDescription}} , applicant description : {${form.name,form.age,form.education, form.email,form.skills}} applicant is looking for : ${form.jobTitle}` },
            ],
        });

        // Send the response back
        res.json({answer:completion.choices[0].message.content});
    } catch (error) {
        console.error("Error fetching completion:", error);
        res.status(500).send("Failed to fetch completion from OpenAI.");
    }
})


app.listen(port, () => {
    console.log(`Server started on port ${port} successfully`);
});
