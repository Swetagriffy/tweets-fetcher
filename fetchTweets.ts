import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

const USERS: string[] = ["elonmusk", "naval", "VitalikButerin"];

interface Tweet {
  id: string;
  text: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchTweets = async (username: string): Promise<Tweet[]> => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const formattedStartDate = startDate.toISOString();

    const url = `https://api.twitter.com/2/tweets/search/recent?query=from:${username} is:tweet&max_results=10&start_time=${formattedStartDate}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${BEARER_TOKEN}` },
    });

    return response.data.data || [];
  } catch (error: any) {
    if (error.response?.status === 429) {
      console.warn(`Rate limit exceeded for ${username}, retrying after delay...`);
      await delay(15000);
      return fetchTweets(username);
    } else {
      console.error(`Error fetching tweets for ${username}:`, error.response?.data || error.message);
      return [];
    }
  }
};

const fetchAllTweets = async () => {
  const results: Record<string, Tweet[]> = {};

  for (const user of USERS) {
    console.log(`Fetching tweets for @${user} (excluding replies)...`);
    results[user] = await fetchTweets(user);
    await delay(5000);
  }

  console.log(JSON.stringify(results, null, 2));
};

fetchAllTweets();
