# MODE Coding Exercise — Node.js

Reference: https://github.com/tinkermode/mode-assignment-general-v2

CLI that fetches time-series data from `https://tsserv.tinkermode.dev/data` and computes **hourly averages** between two hour-aligned timestamps.

## Build

Install dependencies:

```bash
npm i
```

## Run the main program
**Requirements:**

- Input timestamps must be **RFC3339** and hour-aligned (minutes and seconds === `00`).
- Data points are grouped into **hourly buckets**.
- The program streams data from the server and uses constant memory by aggregating one hourly bucket at a time.
- The program **skips buckets** if no data points fall within a particular hour.

```bash
npm run start -- 2021-03-04T03:00:00Z 2021-03-04T11:00:00Z
```

## Run Unit Tests

Unit tests validate your output against the official hourly averages endpoint:
`https://tsserv.tinkermode.dev/hourly?begin=2021-03-04T03:00:00Z&end=2021-03-04T11:00:00Z`

```bash
npm run test
```

## Run Stress Test

Stress test over a **4-year time span** (from 2021-01-01T00:00:00Z to 2025-01-01T00:00:00Z) to ensure performance and memory efficiency:

```bash
npm run stress
```

## Notes

- Tested with **Node.js v22 LTS**.
- Debug and non-essential messages are output to `stderr`.
- Output precision is limited to 4 decimal places to avoid minor floating-point differences.
