// Produces a blind, engine-anonymized version of results.md for LLM-as-a-judge
// (or human blind-review) use, plus a separate answer key mapping the generic
// labels back to real engines.
//
// Two things get stripped entirely, not just relabeled, because they'd let a
// judge de-anonymize the shuffle by cross-referencing: the Foundry Model
// Screening Summary table and the Token & Cost Summary both list model names
// alongside distinguishing metadata (tokens, latency, error counts). Neither
// appears in results-blind.md at all.
//
// Per-message candidate order is independently shuffled — a judge seeing
// "Candidate 1" win in one message and lose in another can't infer engine
// identity from position, since position isn't stable across messages.
//
// Failed/errored engines and Teams' "not filled in" placeholder are excluded
// from the candidate pool (nothing to judge), but recorded in the answer key
// for reference.

const fs = require("fs");
const path = require("path");

const INPUT_FILE = path.join(__dirname, "results.md");
const BLIND_FILE = path.join(__dirname, "results-blind.md");
const KEY_FILE = path.join(__dirname, "results-blind-key.json");

// Fisher-Yates — Math.random()-based .sort() comparators are biased and
// under-shuffle for this kind of list.
function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// A candidate block's content counts as "no real translation to judge" if
// it's an error (`_Error: ...\_`) or Teams' own "not filled in" placeholder —
// both are wrapped in a leading underscore by the generator.
function isRealCandidate(content) {
  return !content.trim().startsWith("_");
}

function parseLabelBlocks(text) {
  // Finds every "**Label:**" line-start, then slices content between
  // consecutive matches (or to end-of-text for the last one). Deliberately
  // NOT a single regex with an end-of-content lookahead: in JS, "$" under
  // the "m" flag matches at the end of EVERY line, not just end-of-string,
  // so a "(.*?)(?=\n\*\*|\s*$)" lookahead terminates the capture immediately
  // after the label instead of at the real boundary. Slicing by match index
  // sidesteps that footgun entirely.
  const labelRe = /^\*\*(.+?):\*\*/gm;
  const matches = [...text.matchAll(labelRe)];
  const blocks = [];
  for (let i = 0; i < matches.length; i++) {
    const label = matches[i][1].trim();
    const contentStart = matches[i].index + matches[i][0].length;
    const contentEnd = i + 1 < matches.length ? matches[i + 1].index : text.length;
    blocks.push({ label, content: text.slice(contentStart, contentEnd).trim() });
  }
  return blocks;
}

function main() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`Missing ${INPUT_FILE}. Run bakeoff.js first.`);
    process.exit(1);
  }

  const raw = fs.readFileSync(INPUT_FILE, "utf8");
  const parts = raw.split(/\n---\n\n/);
  // parts[0] = preamble (title/banner/summary table) — dropped entirely.
  // parts[last] = "## Token & Cost Summary" section — dropped entirely.
  // everything between = one sample block each, starting with "### sample-N".
  const sampleBlocks = parts.slice(1, -1);

  let blindMd = `# Translation Bake-off — Blind Review Set\n\n`;
  blindMd += `Anonymized from \`results.md\` for blind LLM-as-a-judge (or human) review. ` +
    `Candidate labels are generic and independently shuffled per message — ` +
    `position does not correlate with engine identity across messages, or ` +
    `within a single message with anything else in this file.\n\n`;

  const key = { generatedAt: new Date().toISOString(), sourceGeneratedLine: raw.split("\n")[2] || null, samples: {} };

  for (const block of sampleBlocks) {
    const headerMatch = block.match(/^(### [^\n]+)\n\n/);
    const header = headerMatch ? headerMatch[1] : "### (unknown sample)";
    const sampleId = (header.match(/### (\S+)/) || [])[1] || header;
    const bodyAfterHeader = headerMatch ? block.slice(headerMatch[0].length) : block;

    const labelBlocks = parseLabelBlocks(bodyAfterHeader);
    const originalBlock = labelBlocks.find((b) => b.label === "Original");
    const candidateBlocks = labelBlocks.filter((b) => b.label !== "Original");

    const real = candidateBlocks.filter((b) => isRealCandidate(b.content));
    const excluded = candidateBlocks.filter((b) => !isRealCandidate(b.content));

    const shuffled = shuffle(real);

    blindMd += `${header}\n\n`;
    if (originalBlock) {
      blindMd += `**Original:**\n${originalBlock.content}\n\n`;
    }
    const labelMap = {};
    shuffled.forEach((b, i) => {
      const generic = `Candidate ${i + 1}`;
      labelMap[generic] = b.label;
      blindMd += `**${generic}:**\n${b.content}\n\n`;
    });
    blindMd += `---\n\n`;

    key.samples[sampleId] = {
      candidates: labelMap,
      excluded: Object.fromEntries(excluded.map((b) => [b.label, b.content])),
    };
  }

  // Trailing "---\n\n" from the loop leaves one extra separator at the end —
  // trim it so the file doesn't end with a dangling rule.
  blindMd = blindMd.replace(/\n---\n\n$/, "\n");

  fs.writeFileSync(BLIND_FILE, blindMd, "utf8");
  fs.writeFileSync(KEY_FILE, JSON.stringify(key, null, 2), "utf8");
  console.log(`Wrote ${sampleBlocks.length} anonymized sample(s) to ${BLIND_FILE}`);
  console.log(`Answer key (keep this out of the judge's view) written to ${KEY_FILE}`);
}

main();
