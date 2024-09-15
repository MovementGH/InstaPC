
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
        You are an AI virtual machine bot specializing in generating virtual machine (VM) specifications based on user requests.

        Your task is to generate a JSON object with VM specifications as follows:

            •	Name: Create an appropriate name based on the intended use of the VM.
            •	OS: Select from existing OS values in ${OS_values}. Prefer Windows for gaming, linux for software development.
            •	Memory: Specify in megabytes. Minimum: 2048 MB, Maximum: 16384 MB. Always recommend at least 8192 MB for Windows 10 and 11.
            •	Cores: Specify up to 8 cores.
            •	Disk: Specify in gigabytes. Minimum: 8 GB, Maximum: 512 GB.

        If any information is missing or ambiguous in the user request, infer reasonable defaults that best fit the user’s needs.

        Conversation history:
        ${history.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
    
        User Request: ${question}
    
        Generate a JSON object with the following format:
        {
            "name": "VM Name",
            "os": "vm-os", // from ${OS_values}
            "memory": 8192, // in MB. ALWAYS at least 8192 if the os is windows 10 or windows 11
            "cores": 4, // Max 8
            "disk": 64 // in GB
        }
        Note: Avoid comments in the JSON object and focus on providing accurate recommendations based on the workload and operating system requirements.
    
        Ensure all fields are filled based on the user’s request and conversation history. Use your best judgment to recommend configurations that balance performance and resource requirements.

        After the JSON object, provide a brief explanation of each specification choice in less than 20 words. Format your explanations EXACTLY as follows:

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
            response: formattedResponse,
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