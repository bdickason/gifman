/**
 * Reads Vitest --reporter=json output from stdin; prints only failures as JSON.
 */

/**
 * @param {string} text
 * @returns {object}
 */
function parseVitestJson(text) {
  const start = text.indexOf('{');
  if (start === -1) {
    throw new Error('No JSON object found in stdin');
  }
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) {
        return JSON.parse(text.slice(start, i + 1));
      }
    }
  }
  throw new Error('Unbalanced JSON object in stdin');
}

/**
 * @param {string} msg
 * @returns {string}
 */
function firstLine(msg) {
  if (!msg || typeof msg !== 'string') return '';
  const line = msg.split(/\r?\n/, 1)[0];
  return line ?? '';
}

/**
 * @param {string} raw from failureMessages[0]
 * @returns {{ message: string, stack: string }}
 */
function splitMessageAndStack(raw) {
  const full = typeof raw === 'string' ? raw : '';
  const [messageLine, ...stackLines] = full.split(/\r?\n/);
  const message = messageLine ?? '';
  const stack = stackLines
    .filter(
      (line) =>
        !line.includes('node_modules') &&
        (line.includes('/src/') || line.includes('.test.')),
    )
    .slice(0, 5)
    .join('\n');
  return { message, stack };
}

async function main() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  const report = parseVitestJson(raw);

  const failures = [];
  const testResults = report.testResults ?? [];

  for (const fileResult of testResults) {
    const file = fileResult.name ?? '';
    const assertions = fileResult.assertionResults ?? [];
    for (const a of assertions) {
      if (a.status !== 'failed') continue;
      const messages = a.failureMessages ?? [];
      const rawFailure = messages[0] ?? '';
      let message;
      let stack = '';
      if (rawFailure) {
        ({ message, stack } = splitMessageAndStack(rawFailure));
      } else {
        message = firstLine(fileResult.message ?? '');
      }
      if (!message) message = firstLine(fileResult.message ?? '');
      failures.push({
        file,
        test: a.fullName ?? a.title ?? '',
        message,
        stack,
      });
    }
  }

  const status = failures.length === 0 ? 'pass' : 'fail';
  console.log(JSON.stringify({ status, failures }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
