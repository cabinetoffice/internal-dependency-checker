import { createOAuthApiClient } from "@co-digital/api-sdk";
import { GITHUB_KEY } from "../config/index";

export const createApiClient = (GITHUB_KEY: string | undefined) => {
    if (!GITHUB_KEY) {
        throw new Error('GITHUB_KEY is missing');
    }
    return createOAuthApiClient(GITHUB_KEY);
};

export const client = createApiClient(GITHUB_KEY);
