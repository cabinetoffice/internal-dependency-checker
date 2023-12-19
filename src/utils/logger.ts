import { ApplicationLogger } from "@co-digital/logging/lib/ApplicationLogger";
import { createLogger } from "@co-digital/logging";
import { APPLICATION_NAME } from "../config/index";

let logger: ApplicationLogger | undefined = undefined;

export const log = !logger ? (logger = createLogger(APPLICATION_NAME)) : logger;
