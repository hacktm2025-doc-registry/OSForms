const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const {Engine} = require('bpmn-engine');
const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(path.join(__dirname, 'process.bpmn'), 'utf8');

const engine = new Engine({
  name: 'MyProcessEngine',
  source
});

engine.execute((err, execution) => {
  if (err) throw err;

  console.log('Process started:', execution.name);

  execution.once('end', () => {
    console.log('Process completed.');
  });
});

// Directory to serve static files from
const publicDir = path.join(__dirname, '../static');
const PORT = 3000;

// Helper: get content-type by file extension (basic)
const getContentType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html';
    case '.js': return 'application/javascript';
    case '.css': return 'text/css';
    case '.json': return 'application/json';
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.gif': return 'image/gif';
    default: return 'application/octet-stream';
  }
};

// Helper: parse JSON body from request
const parseJSONBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
};

function makeId() {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth() + 1; // Months are 0-based
  const day = now.getDate();

  // Calculate seconds since midnight
  const secondsSinceMidnight = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  return `${year}.${month}.${day}-${secondsSinceMidnight}`;
}

const petitions = [];

/*
GET:
- if no petition id, send static file being requested
	- make user selector for /, make main.html next page
- if petition id, send JSON of petition
	- deny petition if requesting role and user role from petition data not the same
POST/PUT:
- assign petition id if not assigned
- run workflow
- send back plain text message
 */

const server = http.createServer(async (req, res) => {
  const method = req.method;
  const parsedUrl = url.parse(req.url, true);

  if (method === 'GET') {
	// if request has query string, send JSON for petition-id instead of static resource
	if ("petition-id:" in parsedUrl.query) {
		res.writeHead(200, { 'Content-Type': 'application/json' });
		const petitionId = parsedUrl.query.paramName;
		res.end(petitions[petitionId])
	}

    // Serve static files from publicDir
    // Map '/' to '/index.html'
    let filePath = urlPath === '/' ? '../static/login.html' : `../static/${urlPath}`;
    filePath = path.join(publicDir, decodeURIComponent(filePath));

    // Security check: prevent path traversal
    if (!filePath.startsWith(publicDir)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('Access denied');
      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
      } else {
        res.writeHead(200, { 'Content-Type': getContentType(filePath) });
        res.end(data);
      }
    });

  } else if (method === 'POST' || method === 'PUT') {
    // Handle POST/PUT with JSON body
    try {
      const jsonData = await parseJSONBody(req);
      console.log(`${method} request received:`, jsonData);

      // if data contains no petition id, assign one
	  if (!jsonData.petitionId) {
		jsonData.petitionId =  makeId();
		petitions[petitionId] = jsonData;
	  }

	  // run bpmnjs with data and workflow

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end("Finished transaction.");
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON body' }));
    }
  } else {
    // Method not supported
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end(`Method ${method} not allowed`);
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

