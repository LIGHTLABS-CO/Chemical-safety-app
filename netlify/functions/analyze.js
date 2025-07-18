const fetch = require("node-fetch");

exports.handler = async function (event) {
  try {
    const { key, input } = JSON.parse(event.body);

    const HF_URL = "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct";

    const response = await fetch(HF_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: input }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `HF API error: ${errorText}` }),
      };
    }

    const result = await response.json();
    const output = Array.isArray(result)
      ? result[0]?.generated_text
      : result?.generated_text || JSON.stringify(result);

    return {
      statusCode: 200,
      body: JSON.stringify({ result: output }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
