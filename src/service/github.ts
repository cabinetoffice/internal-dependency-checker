import { ApiResponse } from "@co-digital/api-sdk";

import { GITHUB_METHODS_TYPE, GITHUB_TYPES } from "../types/config";
import { PER_PAGE } from "../config/index";
import { client } from "./api";

export const getData = async (fnName: GITHUB_METHODS_TYPE, baseUrl: string, data: GITHUB_TYPES[] = [], page = 1): Promise<GITHUB_TYPES[]> => {
    try {
        const url = `${baseUrl}?page=${page}&per_page=${PER_PAGE}`;
        const resp = await client.gitHub[fnName](url) as ApiResponse<GITHUB_TYPES[]>;
        if (resp.resource) {
            data = [...data, ...resp.resource];
            console.log(`${url}, page ${page}, retrieved ${resp.resource.length}`);
            if (resp.resource.length === PER_PAGE) {
                return await getData(fnName, baseUrl, data, page + 1);
            }
        }
        return data;
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        return [];
    }
};
