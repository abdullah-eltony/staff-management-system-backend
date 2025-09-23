
const { pipeline } = require('@xenova/transformers');

let pip; 

async function loadPipeline() {
  if (!pip) {
    pip = await pipeline('summarization','Xenova/distilbart-cnn-12-6');
  }
  return pip;
}

async function generateSummary(text) {
  const summarizer = await loadPipeline();
  const output = await summarizer(text, { max_length: 20, min_length: 10 });
  return output[0].summary_text;
}

module.exports = { generateSummary };
