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
app.post('/test', async (req, res) => {
    const form = req.body;
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `You are an AI assistant responsible for determining whether a job description matches an applicant's qualifications, skills, and job preferences. Your task is to evaluate the job description and applicant's details and return "Yes" if the applicant is suitable, and "No" if they are not. You must follow the below rules to determine the response:

                    Key Rules for Determining a "Yes":
                    1. If the applicant matches at least 60% of the core qualifications and skills in the job description, respond with "Yes."
                    2. If the applicant has equivalent or transferable skills for "nice-to-have" or additional requirements (e.g., AWS instead of Azure for cloud technologies), consider it a match for those skills.
                    3. If the applicant’s experience is in the same domain, but they are missing some minor qualifications that can be gained easily (e.g., a certification or tool familiarity), respond with "Yes."
                    4. Consider the applicant's job preference; if their qualifications are suitable for the job but their stated preference does not match, respond with "No."
                    
                    Key Rules for Determining a "No":
                    1. If the applicant matches less than 60% of the core job qualifications and skills, respond with "No."
                    2. If the job is in a completely different field and the applicant lacks relevant skills or experience, respond with "No."
                    3. If the applicant is missing critical, mandatory skills and does not have equivalent or transferable experience, respond with "No."
                    4. If the applicant’s job preferences indicate they are not interested in the role despite their qualifications matching, respond with "No."

                    Consider both the technical qualifications and job preferences of the applicant, and prioritize core job skills for the match.`
                },
                {
                    role: "user",
                    content: `Job description: ${form.jobdescription}. Applicant details: Name: ${form.name}, Age: ${form.age}, Education: ${form.education}, Email: ${form.email}, Skills and experience: ${form.skills}. The applicant is looking for a ${form.jobTitle} position.`
                },
            ],
        });

        // Send the response back
        res.json({ answer: completion.choices[0].message.content });
    } catch (error) {
        console.error("Error fetching completion:", error);
        res.status(500).send("Failed to fetch completion from OpenAI.");
    }
});



app.listen(port, () => {
    console.log(`Server started on port ${port} successfully`);
});
