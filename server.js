const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = 5000;

app.use(express.json());

// Endpoint to handle chat messages
app.post('/chat', (req, res) => {
    const userMessage = req.body.message;

    // Run the ollama model with the user message
    exec(`ollama run qwen2.5:14b "${userMessage}"`, (error, stdout, stderr) => {
        console.log('stdout:', stdout); // Log standard output
        console.error('stderr:', stderr); // Log error output

        if (error) {
            console.error(`Error executing model: ${error}`);
            return res.status(500).json({ response: 'Error processing your request.' });
        }
        // Send the model's response back to the frontend
        res.json({ response: stdout.trim() });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
