
import Groq from "groq-sdk";
import { NextResponse } from 'next/server.js';
import readline from 'readline';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

let conversationHistory = [];

export async function POST(request) {
    console.log("POST function called");
    const { question} = await request.json();
    console.log("Received question:", question);

    try {
        const promptTemplate = `
        You are an AI virtual machine bot specialized in generating virtual machine specifications.
        Based on the user request, generate a JSON object with VM specifications. 
        If any information is missing from output, infer with reasonable defaults that would best fit user's need.
        
        Conversation history:
        ${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
        
        User Request: ${question}
        
        Generate a JSON object with the following format:
        {
            "name": "VM Name",
            "os": "operating system",
            "memory": 0,
            "cores": 0,
            "disk": 0
        }
      
        Ensure all fields are filled using best judgment based on the user's request and conversation history.
        For the name of the virtual machine, generate an appropriate name based on intended use.
        Do not include any comments in the JSON object.

        After the JSON object, provide a brief explanation for each specification choice.
        Format your explanations like this:

        Explanations:
        - Name: [Explanation for the chosen name]
        - OS: [Explanation for the chosen OS]
        - Memory: [Explanation for the chosen memory]
        - Cores: [Explanation for the chosen number of cores]
        - Disk: [Explanation for the chosen disk size]
        `;

        console.log("Sending request to Groq API");
        const chatCompletion = await getGroqChatCompletion([...conversationHistory, { role: 'user', content: promptTemplate }]);
        console.log("Received response from Groq API");
        const botMessage = chatCompletion.choices[0]?.message?.content || '';

        let vmSpecs;
        let explanations = {};
        try {
            // Extract JSON from the response
            const jsonMatch = botMessage.match(/\{[\s\S]*?\}/);
            JSON.stringify(jsonMatch);
            if (jsonMatch) {
                // Remove comments and parse JSON
                const jsonString = jsonMatch[0].replace(/\/\/.*$/gm, '').trim();
                vmSpecs = JSON.parse(jsonString);
            } else {
                throw new Error("No valid JSON object found in the response");
            }

            // Extract explanations
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

            // Format the response
            const formattedResponse = `
            • Name: ${vmSpecs.name}
            • OS: ${vmSpecs.os}
              Explanation: ${explanations['os'] || 'No explanation provided'}
            • Memory: ${vmSpecs.memory} MiB
              Explanation: ${explanations['memory'] || 'No explanation provided'}
            • Cores: ${vmSpecs.cores}
              Explanation: ${explanations['cores'] || 'No explanation provided'}
            • Disk: ${vmSpecs.disk} GiB
              Explanation: ${explanations['disk'] || 'No explanation provided'}
            `;

            // Update conversation history
            conversationHistory.push({ role: 'user', content: question });
            conversationHistory.push({ role: 'assistant', content: formattedResponse });

            return NextResponse.json({ 
                jsonSpecs: vmSpecs,
                formattedResponse: formattedResponse
            });

        } catch (error) {
            console.error('Error processing API response:', error);
            return NextResponse.json({ 
                error: 'Failed to generate valid VM specifications.', 
                details: error.message,
                rawResponse: botMessage 
            });
        }

    } catch (error) {
        console.error('Error generating VM specifications:', error);
        return NextResponse.json({ error: 'Sorry, I could not process your request at this time.', details: error.message });
    }
}

export async function getGroqChatCompletion(messages) {
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

function getUserInput(prompt) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

export async function main() {
  try {
    console.log("Hi! I am your InstaPC virtual machine assistant. I can help decide what specs you would need for your needs!");
    conversationHistory.push({ role: 'assistant', content: "Hi! I am your InstaPC virtual machine assistant. I can help decide what specs you would need for your needs!" });
    
    while (true) {
      const question = await getUserInput("\nQuestion? (Type 'exit' to quit): ");
      
      if (question.toLowerCase() === 'exit') {
        console.log("Thank you for using InstaPC assistant. Goodbye!");
        break;
      }

      const mockRequest = {
        json: async () => ({
          question: question,
          isIntro: false
        })
      };

      const response = await POST(mockRequest);
      const result = await response.json();
      
      if (result.error) {
        console.log("Error:", result.error);
        console.log("Details:", result.details);
      } else {
        console.log("\nRecommended VM Specifications:");
        console.log(result.formattedResponse);
      }
    }
  } catch (error) {
    console.error("Error in main:", error);
  }
}

main().catch(error => console.error("Error running main:", error));