/* eslint-disable max-len */
const http = require('http');
const { convertToCase } = require('./ConvertToCase');

const validCases = ['SNAKE', 'KEBAB', 'CAMEL', 'PASCAL', 'UPPER'];

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');

  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = reqUrl.pathname;
  const query = Object.fromEntries(reqUrl.searchParams);

  const text = pathname.slice(1);
  const toCase = query.toCase;

  const errors = [];

  if (!text) {
    errors.push({
      message:
        'Text to convert is required.',
    });
  }

  if (!toCase) {
    errors.push({
      message:
        '"toCase" query param is required.',
    });
  } else if (!validCases.includes(toCase)) {
    errors.push({
      message:
        'This case is not supported.',
    });
  }

  if (errors.length > 0) {
    res.statusCode = 400;
    res.end(JSON.stringify({ errors }));

    return;
  }

  try {
    const result = convertToCase(text, toCase);

    const response = {
      originalCase: result.originalCase,
      targetCase: toCase,
      convertedText: result.convertedText,
      originalText: text,
    };

    res.statusCode = 200;
    res.end(JSON.stringify(response));
  } catch (error) {
    res.statusCode = 500;

    res.end(
      JSON.stringify({
        errors: [{ message: error.message }],
      }),
    );
  }
});

const createServer = () => server;

module.exports = { createServer };
