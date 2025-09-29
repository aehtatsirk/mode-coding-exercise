import { startOfHourISO, endOfHourISO, isRFC3339Aligned, parseISOToDate } from './utils.js';

// generator that yields [hourISO, average] for each hourly bucket
export async function* aggregateHourlyData(lines) {
    let currentHour = null;
    let sum = 0;
    let count = 0;

    for await (const line of lines) {
        if (!line.trim()) continue;

        const [ts, valStr] = line.trim().split(/\s+/);
        const val = Number(valStr);
        if (!ts || !Number.isFinite(val)) continue;

        let hour;
        try {
            hour = startOfHourISO(ts);
        } catch {
            continue;
        }

        if (currentHour && hour !== currentHour) {
            yield [currentHour, sum / count];
            sum = 0;
            count = 0;
        }

        currentHour = hour;
        sum += val;
        count++;
    }

    if (currentHour && count > 0) yield [currentHour, sum / count];
}

// collect hourly output into array of "hourISO average" strings
export async function collectHourlyOutput(rl, startTime, endTime, aggregateHourlyData) {
    const output = [];
    const beginDate = startOfHourISO(startTime);
    const endDate = endOfHourISO(endTime);

    for await (const [hourISO, avg] of aggregateHourlyData(rl)) {
        const hourDate = parseISOToDate(hourISO);
        if (hourDate < beginDate || hourDate > endDate) continue;
        const outputTime = `${hourISO} ${avg.toFixed(4)}`;
        output.push(outputTime);
    }

    return output;
}

// validate input timestamps
export function validateInput(startTime, endTime) {
    if (!startTime || !endTime) {
        console.error('Usage: node src/index.js <BEGIN> <END>');
        process.exit(1);
    }

    if (!isRFC3339Aligned(startTime) || !isRFC3339Aligned(endTime)) {
        console.error('Timestamps must be aligned with RFC3339 format and hour-aligned (minutes and seconds == 00)');
        process.exit(1);
    }

    const beginDate = parseISOToDate(startTime);
    const endDate = parseISOToDate(endTime);
    if (beginDate > endDate) {
        console.error('Begin Date must be <= End Date');
        process.exit(1);
    }
}

