const fs = require("fs");
const path = "/etc/newman/reports";

const merged = {
  run: {
    executions: [],
    stats: {
      assertions: { total: 0, failed: 0 },
      // You can add more summary stats here if needed
    },
    failures: [],
    timings: {} // Optional
  },
};

["run001.json", "run002.json", "run003.json"].forEach((file) => {
  const data = JSON.parse(fs.readFileSync(`${path}/${file}`, "utf8"));

  merged.run.executions.push(...(data.run.executions || []));
  merged.run.failures.push(...(data.run.failures || []));

  if (data.run.stats && data.run.stats.assertions) {
    merged.run.stats.assertions.total += data.run.stats.assertions.total || 0;
    merged.run.stats.assertions.failed += data.run.stats.assertions.failed || 0;
  }
});

// Save merged JSON
fs.writeFileSync(`${path}/merged.json`, JSON.stringify(merged, null, 2));

// Run newman again on merged data
const { execSync } = require("child_process");
execSync(
  `newman run ${path}/merged.json --reporters htmlextra --reporter-htmlextra-export ${path}/report.html`,
  { stdio: "inherit" }
);
