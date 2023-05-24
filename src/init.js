import {
    getOrganizationRepos,
    checkFileExists,
    getInfoFromOrganizationRepos,
    updateStateDependencies,
    getTechFile,
    writeDependencyFiles
} from "./utils.js";

import {
    DEPENDENCY_FILES
} from "./config.js";

// import { repos } from "../test/mock/repos.js";

export const init = async () => {
    try {
        const repos = await getOrganizationRepos();
        for ( const repo of repos ) {
            const { repoName, org, branch, filter, fileUrl } = getInfoFromOrganizationRepos( repo );
            for ( const fileName of DEPENDENCY_FILES[filter] ) {
                if( await checkFileExists(`${fileUrl}/${fileName}`) ) {
                    const { tech, key } = getTechFile(fileName);
                    updateStateDependencies(tech, key, repoName, org, branch, `${fileUrl}/${fileName}`)
                }
            }
        }
        console.log( `Creation of the state file completed.` );

        // Write dependency states to file on the infrastructure/dependencies folder.
        // Files needed on the container when docker compose up is triggered (It is going to be fun :))
        await writeDependencyFiles();
    } catch (error) {
        console.error( `init: error ${error.message}` );
    }
}