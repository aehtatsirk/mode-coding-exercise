#!/usr/bin/env node
import readline from 'readline';
import { aggregateHourlyData, validateInput, collectHourlyOutput } from '../src/logic.js';
import { fetchTimeSeriesData, fetchHourlyData } from '../src/client.js';
import { almostEqual } from '../src/utils.js';

const BEGIN = '2021-03-04T03:00:00Z';
const END = '2021-03-04T11:00:00Z';

async function compare() {
    console.log(`🔎 Comparing your output to official hourly averages for ${BEGIN} -> ${END}...`);

    const officialLines = await fetchHourlyData(BEGIN, END);

    const stream = await fetchTimeSeriesData(BEGIN, END);
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

    const myOutput = await collectHourlyOutput(rl, BEGIN, END, aggregateHourlyData);

    let success = true;
    // check for length mismatch
    if (myOutput.length !== officialLines.length) {
        success = false;
        console.error(`Length mismatch: mine=${myOutput.length}, official=${officialLines.length}`);
    }

    const n = Math.min(myOutput.length, officialLines.length);
    // compare each line
    for (let i = 0; i < n; i++) {
        const [tsMine, valMineStr] = myOutput[i].split(/\s+/);
        const [tsOfficial, valOfficialStr] = officialLines[i].split(/\s+/);
        // check timestamp mismatch
        if (tsMine !== tsOfficial) {
            console.error(`Timestamp mismatch at line ${i + 1}`);
            success = false;
            // check value mismatch within tolerance
        } else if (!almostEqual(Number(valMineStr), Number(valOfficialStr))) {
            console.error(`Value mismatch at line ${i + 1}`);
            console.error('Mine:    ', myOutput[i]);
            console.error('Official:', officialLines[i]);
            success = false;
        }
    }

    if (success) console.log('✅ All hourly averages match!');
    else console.error('❌ Differences detected.');
}

compare().catch(err => {
    console.error('❌ Comparison failed:', err);
    process.exit(1);
});
