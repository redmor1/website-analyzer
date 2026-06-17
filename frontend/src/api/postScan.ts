import { API_URL } from "./config";

// TODO: define zod types for body and figure out how to link backend and frontend with zod types without repeating
export async function postScan(
  body: object,
  apiKey: string,
  // username: string,
  // password: string,
) {
  // encode to base64
  // const credentials = btoa(`${username}:${password}`);
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        // Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
