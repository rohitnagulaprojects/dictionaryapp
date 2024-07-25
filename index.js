const express = require("express");
const cors = require("cors");
const axios = require("axios"); 

const app = express();
app.use(cors());
app.use(express.json());

app.get("/save", async (req, res) => {
    const word = req.query.name; // Get the word from query parameters

    try {
        // Fetch word data from the dictionary API
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = response.data[0]; // Assuming the response is an array with the first item containing the word details

        // Filter definitions for nouns and verbs
        const nounMeanings = data.meanings.filter(meaning => meaning.partOfSpeech === 'noun');
        const verbMeanings = data.meanings.filter(meaning => meaning.partOfSpeech === 'verb');

        // Return the first definition for noun and verb
        res.json({
            nounDefinitions: nounMeanings.length > 0 ? nounMeanings[0].definitions.slice(0, 1) : [],
            verbDefinitions: verbMeanings.length > 0 ? verbMeanings[0].definitions.slice(0, 1) : [],
        });
    } catch (error) {
        console.error('Error fetching the definition:', error);
        res.status(500).json({ error: 'Definition not found' });
    }
});

app.listen(9000, () => {
    console.log("Server ready at http://localhost:9000");
});
