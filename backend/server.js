const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const yaml = require('js-yaml');
const xml2js = require('xml2js');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.text({ limit: '10mb', type: 'text/plain' }));

// Format detection function
function detectFormat(input) {
  const trimmed = input.trim();

  // Check for JSON
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch (e) {
      // Not valid JSON, continue checking
    }
  }

  // Check for XML
  if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
    return 'xml';
  }

  // Check for YAML
  // YAML is more flexible, check for common patterns
  if (trimmed.includes(':') && !trimmed.startsWith('<') && !trimmed.startsWith('{')) {
    try {
      yaml.load(trimmed);
      return 'yaml';
    } catch (e) {
      // Not valid YAML
    }
  }

  return 'unknown';
}

// Parse input based on detected format
async function parseInput(input, format) {
  try {
    switch (format) {
      case 'json':
        return JSON.parse(input);

      case 'xml':
        const parser = new xml2js.Parser({ explicitArray: false });
        const result = await parser.parseStringPromise(input);
        return result;

      case 'yaml':
        return yaml.load(input);

      default:
        throw new Error('Unsupported format');
    }
  } catch (error) {
    throw new Error(`Failed to parse ${format}: ${error.message}`);
  }
}

// Convert data to target format
function convertToFormat(data, targetFormat) {
  try {
    switch (targetFormat) {
      case 'json':
        return JSON.stringify(data, null, 2);

      case 'xml':
        const builder = new xml2js.Builder({
          rootName: 'root',
          renderOpts: { pretty: true, indent: '  ' }
        });
        return builder.buildObject(data);

      case 'yaml':
        return yaml.dump(data, { indent: 2 });

      default:
        throw new Error('Unsupported target format');
    }
  } catch (error) {
    throw new Error(`Failed to convert to ${targetFormat}: ${error.message}`);
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Format detection endpoint
app.post('/api/detect', (req, res) => {
  try {
    const input = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const format = detectFormat(input);

    res.json({
      success: true,
      detectedFormat: format,
      input: input.substring(0, 100) + (input.length > 100 ? '...' : '')
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Conversion endpoint
app.post('/api/convert', async (req, res) => {
  try {
    const { input, targetFormat } = req.body;

    if (!input) {
      return res.status(400).json({
        success: false,
        error: 'Input is required'
      });
    }

    if (!targetFormat || !['json', 'xml', 'yaml'].includes(targetFormat.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Valid target format (json, xml, yaml) is required'
      });
    }

    // Detect source format
    const sourceFormat = detectFormat(input);

    if (sourceFormat === 'unknown') {
      return res.status(400).json({
        success: false,
        error: 'Could not detect input format. Please ensure input is valid JSON, XML, or YAML.'
      });
    }

    // Parse input
    const parsedData = await parseInput(input, sourceFormat);

    // Convert to target format
    const converted = convertToFormat(parsedData, targetFormat.toLowerCase());

    res.json({
      success: true,
      sourceFormat,
      targetFormat: targetFormat.toLowerCase(),
      converted
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Format Converter API running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
