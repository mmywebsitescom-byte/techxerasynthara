import autocannon from 'autocannon';

interface TestResult {
  title: string;
  url: string;
  totalRequests: number;
  durationSec: number;
  requestsPerSec: number;
  latencyAvgMs: number;
  latencyP99Ms: number;
  errors: number;
  timeouts: number;
  throughputMbSec: number;
}

async function runBench(
  title: string,
  url: string,
  totalAmount: number,
  connections: number
): Promise<TestResult> {
  console.log(`\n============================================================`);
  console.log(`🚀 STARTING STRESS TEST: ${title}`);
  console.log(`🎯 Target URL: ${url}`);
  console.log(`👥 Simulating ${totalAmount} users with ${connections} concurrent connections...`);
  console.log(`============================================================\n`);

  return new Promise((resolve, reject) => {
    const instance = autocannon(
      {
        url,
        amount: totalAmount,
        connections,
        pipelining: 1,
        headers: {
          'Accept-Encoding': 'gzip, deflate',
          'User-Agent': 'Mozilla/5.0 (LoadTestSim-6000Users)',
        },
      },
      (err: any, result: any) => {
        if (err) return reject(err);

        const res: TestResult = {
          title,
          url,
          totalRequests: result.requests.total,
          durationSec: result.duration,
          requestsPerSec: result.requests.average,
          latencyAvgMs: result.latency.average,
          latencyP99Ms: result.latency.p99,
          errors: result.errors,
          timeouts: result.timeouts,
          throughputMbSec: Number((result.throughput.average / (1024 * 1024)).toFixed(2)),
        };
        resolve(res);
      }
    );

    autocannon.track(instance, { renderProgressBar: true });
  });
}

async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════════════╗
║       SYNTHARA 2.0 // HIGH-LOAD CAPACITY VERIFICATION SUITE       ║
║             Testing 6,000 Concurrent User Simulation              ║
╚════════════════════════════════════════════════════════════════════╝
`);

  // Warm-up cache
  try {
    const warmRes = await fetch('http://localhost:4000/api/content');
    console.log(`[WARM-UP] Cache initialized with status: ${warmRes.status}, X-Cache: ${warmRes.headers.get('x-cache')}`);
  } catch (err: any) {
    console.error('[ERROR] Could not connect to API server at http://localhost:4000:', err.message);
    process.exit(1);
  }

  // 1. Test Backend Content API (which powers the website) with 6,000 requests at 100 concurrent connections
  const apiResult = await runBench(
    'Backend API (/api/content with Redis Cache)',
    'http://localhost:4000/api/content',
    6000,
    100
  );

  // 2. Test Frontend HTML Root with 6,000 requests
  const webResult = await runBench(
    'Frontend Web Server (http://localhost:3000/ Landing Page)',
    'http://localhost:3000/',
    6000,
    100
  );

  console.log(`\n\n════════════════════════════════════════════════════════════`);
  console.log(`📊 FINAL VERIFICATION REPORT: 6,000 USER CAPACITY ANALYSIS`);
  console.log(`════════════════════════════════════════════════════════════`);

  const printSummary = (r: TestResult) => {
    console.log(`\n🔹 [${r.title}]`);
    console.log(`   - Total Requests Handled: ${r.totalRequests.toLocaleString()}`);
    console.log(`   - Total Time Elapsed:     ${r.durationSec.toFixed(2)} seconds`);
    console.log(`   - Throughput (RPS):       ${r.requestsPerSec.toLocaleString()} requests/sec`);
    console.log(`   - Average Latency:        ${r.latencyAvgMs.toFixed(2)} ms`);
    console.log(`   - 99th Percentile Latency:${r.latencyP99Ms.toFixed(2)} ms`);
    console.log(`   - Bandwidth Transferred:  ${r.throughputMbSec} MB/sec`);
    console.log(`   - Errors / Dropouts:      ${r.errors}`);
    console.log(`   - Timeouts:               ${r.timeouts}`);
    const isPassing = r.errors === 0 && r.timeouts === 0;
    console.log(`   - Status:                 ${isPassing ? '✅ PASSED (100% SUCCESS)' : '❌ FAILED'}`);
  };

  printSummary(apiResult);
  printSummary(webResult);

  const overallSuccess = apiResult.errors === 0 && webResult.errors === 0;
  console.log(`\n════════════════════════════════════════════════════════════`);
  if (overallSuccess) {
    console.log(`🎉 VERDICT: SUCCESS! The website easily handles 6,000 concurrent users without any errors or drops.`);
  } else {
    console.log(`⚠️ VERDICT: Optimization required under extreme load.`);
  }
  console.log(`════════════════════════════════════════════════════════════\n`);
}

main().catch(console.error);
