/**
 * MCP Stdio Client Protocol Verification
 */
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverScript = path.resolve(__dirname, "../index.js");

async function testMcpStdio() {
  console.log("Testing MCP Stdio Handshake & Protocol...");

  const proc = spawn("node", [serverScript], {
    stdio: ["pipe", "pipe", "pipe"],
  });

  let stdoutBuffer = "";
  proc.stdout.on("data", (chunk) => {
    stdoutBuffer += chunk.toString();
  });

  proc.stderr.on("data", (chunk) => {
    // server logs go to stderr in stdio MCP
    // console.log("[STDERR]:", chunk.toString());
  });

  const send = (msg) => {
    proc.stdin.write(JSON.stringify(msg) + "\n");
  };

  // Step 1: initialize
  send({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "test-client", version: "1.0.0" },
    },
  });

  // Step 2: notifications initialized
  send({
    jsonrpc: "2.0",
    method: "notifications/initialized",
    params: {},
  });

  // Step 3: list tools
  send({
    jsonrpc: "2.0",
    id: 2,
    method: "tools/list",
    params: {},
  });

  // Wait for responses
  await new Promise((r) => setTimeout(r, 2000));

  const lines = stdoutBuffer.split("\n").filter((l) => l.trim().length > 0);
  console.log(`Received ${lines.length} JSON-RPC responses on stdio.`);

  let foundToolsList = false;
  let toolCount = 0;

  for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      if (parsed.id === 2 && parsed.result?.tools) {
        foundToolsList = true;
        toolCount = parsed.result.tools.length;
        console.log(`✅ [PASS] tools/list succeeded! Found ${toolCount} registered MCP tools.`);
      }
    } catch {
      // ignore
    }
  }

  proc.kill();

  if (!foundToolsList || toolCount < 20) {
    console.error("❌ [FAIL] Failed to receive proper tools/list response");
    process.exit(1);
  }

  console.log("✅ MCP Stdio protocol verification passed successfully!");
}

testMcpStdio().catch((err) => {
  console.error(err);
  process.exit(1);
});
