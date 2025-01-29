"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
const USERS = ["elonmusk", "naval", "VitalikButerin"];
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const fetchTweets = (username) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        const formattedStartDate = startDate.toISOString();
        const url = `https://api.twitter.com/2/tweets/search/recent?query=from:${username}&max_results=10&start_time=${formattedStartDate}`;
        const response = yield axios_1.default.get(url, {
            headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
        });
        return response.data.data || [];
    }
    catch (error) {
        if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 429) {
            console.warn(`Rate limit exceeded for ${username}, retrying after delay...`);
            yield delay(15000); // Wait 15 seconds before retrying
            return fetchTweets(username); // Retry the request
        }
        else {
            console.error(`Error fetching tweets for ${username}:`, ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message);
            return [];
        }
    }
});
const fetchAllTweets = () => __awaiter(void 0, void 0, void 0, function* () {
    const results = {};
    for (const user of USERS) {
        console.log(`Fetching tweets for @${user}...`);
        results[user] = yield fetchTweets(user);
        yield delay(5000); // Add a delay between requests to prevent hitting rate limits
    }
    console.log(JSON.stringify(results, null, 2));
});
fetchAllTweets();
