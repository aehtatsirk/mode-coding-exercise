import https from "https";
import { URL } from "url";
import { startOfHourISO, endOfHourISO } from "./utils.js";

const BASE_URL = "https://tsserv.tinkermode.dev";

// fetch values from an arbitrary time series
// https://tsserv.tinkermode.dev/data?begin=<BEGIN_TIMESTAMP>&end=<END_TIMESTAMP>
export function fetchTimeSeriesData(startTime, endTime) {
    const beginISO = startOfHourISO(startTime);
    const endISO = endOfHourISO(endTime);

    const url = new URL("/data", BASE_URL);
    url.searchParams.set("begin", beginISO);
    url.searchParams.set("end", endISO);

    return new Promise((resolve, reject) => {
        const req = https.get(url, (res) => {
            if (res.statusCode !== 200) {
                res.resume();
                return reject(new Error(`Server returned ${res.statusCode}`));
            }
            resolve(res);
        });
        req.on("error", reject);
        req.setTimeout(30000, () => {
            req.destroy(new Error("Request timed out"));
        });
    });;
}

// check if the program generates the right results
// https://tsserv.tinkermode.dev/hourly?begin=<BEGIN_TIMESTAMP>&end=<END_TIMESTAMP>
export async function fetchHourlyData(begin, end) {
    const url = new URL("/hourly", BASE_URL);
    url.searchParams.set("begin", begin);
    url.searchParams.set("end", end);

    return new Promise((resolve, reject) => {
        https.get(url.href, (res) => {
            if (res.statusCode !== 200) {
                res.resume();
                return reject(new Error(`Server returned ${res.statusCode}`));
            }
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => resolve(data.trim().split("\n")));
            res.on("error", reject);
        }).on("error", reject);
    });
}
