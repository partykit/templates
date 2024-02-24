"use server";
import { LRUCache } from "lru-cache";
import type { User } from "../party/shared";

const cache = new LRUCache<string, string>({ max: 100 });

function getRandomUser(): User {
	const animals = [
		"Ant",
		"Bear",
		"Camel",
		"Cat",
		"Chicken",
		"Deer",
		"Giraffe",
		"Kangaroo",
		"Lion",
		"Monkey",
		"Narwhal",
		"Tiger",
	];

	return {
		name: `Anonymous ${animals[Math.round(Math.random() * animals.length)]}`,
	};
}
export default async function getUser(): Promise<User> {
	// in production, we'd get the user from the server
	// but for now, we'll just generate a random name
	const user = JSON.parse(cache.get("user") || "null") || getRandomUser();
	cache.set("user", JSON.stringify(user));

	return user as User;
}
