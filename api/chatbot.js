
import Groq from 'groq-sdk';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

let histories = {};

const OS_values = [
    "windows-11",
    "windows-10",
    "windows-8",
    "windows-7",
    "windows-vista",
    "windows-xp",
    "arch-basic",
    "arch-kde",
    "mint",
    "elementary",
    "ubuntu-20.04",
    "ubuntu-24.04"
];

export default async function(req, res) {
    if(!histories[req.user.userId])
        histories[req.user.userId] = [];
    
    const history = histories[req.user.userId];
    const question = req.body.question;
    
    const promptTemplate = `
        You are an AI virtual machine bot specialized in generating virtual machine specifications.
        Based on the user request, generate a JSON object with VM specifications. 
        If any information is missing from output, infer with reasonable defaults that would best fit user's need.
    
        Conversation history:
        ${history.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
    
        User Request: ${question}
    
        Generate a JSON object with the following format:
        {
            "name": "VM Name",
            "os": "operating system select from existing os values in ${OS_values}",
            "memory": 0 (value should be in megabytes, MIN - 2048, MAX - 16384),
            "cores": 0 (MAX - 8),
            "disk": 0 (value should be in gigabytes, MIN - 8, MAX 512)
        }
    
        Ensure all fields are filled using best judgment based on the user's request and conversation history.
        For the name of the virtual machine, generate an appropriate name based on intended use.
        Do not include any comments in the JSON object.
    
        After the JSON object, provide a brief explanation of less than 20 words for each specification choice.
        Format your explanations like this:
    
        Explanations:
        - Name: [Explanation for the chosen name]
        - OS: [Explanation for the chosen OS]
        - Memory: [Explanation for the chosen memory (value should be in gigabytes)]
        - Cores: [Explanation for the chosen number of cores]
        - Disk: [Explanation for the chosen disk size (value should be in gigabytes)]
        `;
    
    const chatCompletion = await getGroqChatCompletion([
        ...history,
        { role: 'user', content: promptTemplate }
    ]);
    const botMessage = chatCompletion.choices[0]?.message?.content || '';
    
    let vmSpecs;
    let explanations = {};
    try {
        const jsonMatch = botMessage.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
            const jsonString = jsonMatch[0].replace(/\/\/.*$/gm, '').trim();
            vmSpecs = JSON.parse(jsonString);
        } else {
            throw new Error("No valid JSON object found in the response");
        }
        
        const explanationMatch = botMessage.match(/Explanations:([\s\S]*)/);
        if (explanationMatch) {
            const explanationText = explanationMatch[1];
            const explanationLines = explanationText.split('\n').filter(line => line.trim() !== '');
            explanationLines.forEach(line => {
                const [key, ...valueParts] = line.split(':').map(part => part.trim());
                const value = valueParts.join(':').trim();
                if (key && value) {
                    explanations[key.toLowerCase().replace('- ', '')] = value;
                }
            });
        }
        
        const formattedResponse = `
            • Name: ${vmSpecs.name}
            • OS: ${vmSpecs.os}
              Explanation: ${explanations['os'] || 'No explanation provided'}
            • Memory: ${vmSpecs.memory}
              Explanation: ${explanations['memory'] || 'No explanation provided'}
            • Cores: ${vmSpecs.cores}
              Explanation: ${explanations['cores'] || 'No explanation provided'}
            • Disk: ${vmSpecs.disk}
              Explanation: ${explanations['disk'] || 'No explanation provided'}
            `;
        
        history.push({ role: 'user', content: question });
        history.push({ role: 'assistant', content: formattedResponse });
        
        res.json({
            json: vmSpecs,
            response: botMessage,
        });
    } catch (error) {
        res.sendStatus(500);
    }
}

async function getGroqChatCompletion(messages) {
    try {
        return await groq.chat.completions.create({
            messages: messages,
            model: "llama3-8b-8192",
        });
    } catch (error) {
        console.error("Error in API call:", error);
        throw error;
    }
}