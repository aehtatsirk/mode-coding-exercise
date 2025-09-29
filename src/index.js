#!/usr/bin/env node
import process from 'process';
import readline from 'readline';
import { validateInput, aggregateHourlyData, collectHourlyOutput } from './logic.js';
import { fetchTimeSeriesData } from './client.js';

async function main(argv) {
    const [startTime, endTime] = argv.slice(2);
    // validate command-line input timestamps
    validateInput(startTime, endTime);

    let stream;

    try {
        // fetch remote time series data as a stream
        stream = await fetchTimeSeriesData(startTime, endTime);
    } catch (err) {
        console.error('Failed to fetch data:', err.message);
        process.exit(3);
    }

    // create readline interface to process stream line by line
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

    // aggregate data into hourly buckets and collect formatted output
    const output = await collectHourlyOutput(rl, startTime, endTime, aggregateHourlyData);

    // print all hourly averages
    console.log(output.join('\n'));

    rl.close();
}

// run main if file executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main(process.argv).catch(err => {
        console.error('Fatal error:', err.message);
        process.exit(2);
    });
}
