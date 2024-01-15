import { ApiResponse } from "@co-digital/api-sdk";

import { GITHUB_METHODS_TYPE } from "../types/config";
import { PER_PAGE } from "../config/index";
import { client } from "./api";

import { log } from "../utils/logger";

export const getData = async <T>(fnName: GITHUB_METHODS_TYPE, baseUrl: string, data: T[] = [], page = 1): Promise<T[]> => {
    try {
        const url = `${baseUrl}?page=${page}&per_page=${PER_PAGE}`;
        const resp = await client.gitHub[fnName](url) as ApiResponse<T[]>;
        if (resp.resource) {
            data = [...data, ...resp.resource];
            log.info(`${url}, page ${page}, retrieved ${resp.resource.length}`);
            if (resp.resource.length === PER_PAGE) {
                return await getData<T>(fnName, baseUrl, data, page + 1);
            }
        }
        return data;
    } catch (error: any) {
        log.error(`Error: ${error.message}`);
        return [];
    }
};
