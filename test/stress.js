#!/usr/bin/env node
import readline from 'readline';
import { fetchTimeSeriesData } from '../src/client.js';
import { aggregateHourlyData } from '../src/logic.js';

const BEGIN = '2021-01-01T00:00:00Z';
const END = '2025-01-01T00:00:00Z';

async function stress() {
    console.log(`🚀 Running 4-year stress test from ${BEGIN} to ${END}...`);

    const startTime = Date.now();
    let bucketCount = 0; // track number of hourly buckets
    let lineCount = 0;   // track total data points

    const stream = await fetchTimeSeriesData(BEGIN, END);
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

    // process each hourly bucket
    for await (const [_bucket, _avg] of aggregateHourlyData(rl)) {
        bucketCount++;
        lineCount++;

        // log progress every 1000 buckets
        if (bucketCount % 1000 === 0) {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
            console.error(`⏳ Processed ${bucketCount} buckets in ${elapsed}s...`);
        }
    }

    const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
    const memoryMB = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);

    console.log(`✅ 4 years stress test complete!`);
    console.log(`📊 Total buckets: ${bucketCount}, Total lines: ${lineCount}`);
    console.log(`⏱ Duration: ${durationSec}s, Memory (RSS): ~${memoryMB} MB`);
}

stress().catch(err => {
    console.error('❌ Stress test failed:', err);
    process.exit(1);
});
