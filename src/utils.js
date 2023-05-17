import axios from "axios";

import { writeFile } from 'node:fs/promises';

import {
    PER_PAGE,
    ALL_DEP_FILES_KEY,
    STATE_DEPENDENCIES,
    PREFIX_FILE_NAME,
    STATE_DEPENDENCIES_FILE_NAME,
    STATE_LANGUAGE_DEPENDENCY_KEY
} from "./config.js";

// ************************************************************ //

export const checkFileExists = async (fileUrl) => {
    return await axios.head(fileUrl)
        .then( response => response.status === 200)
        .catch( _ => false)
}

// ************************************************************ //

let organizationRepos = [];
export const getOrganizationRepos = async (organization = "", page = 1, per_page = PER_PAGE) => {
    return await axios.get(`https://api.github.com/orgs/${organization}/repos?page=${page}&per_page=${per_page}`)
        .then( repos => {
            console.log(`getOrganizationRepos from ${organization}, page ${page}, retrieved ${repos.data.length}`);
            organizationRepos = organizationRepos.concat(repos.data);
            return (repos.data?.length) ? getOrganizationRepos(organization, page + 1) : organizationRepos;
        })
        .catch( error => {
            console.error(`getOrganizationRepos error: ${error.message}`);
            return organizationRepos;
        })
};

// ************************************************************ //

export const getInfoFromOrganizationRepos = (repo) => {
    const filter = ALL_DEP_FILES_KEY; // repo.languafileNamege || ALL_DEP_FILES_KEY;
    const branch = repo.default_branch;
    const repoName = repo.name;
    const org = repo.owner.login;

    const fileUrl = `https://raw.githubusercontent.com/${org}/${repoName}/${branch}`;

    return { repoName, org, filter, fileUrl, branch }
}

// ************************************************************ //

export const writeDependencyFiles = () => {
    console.log(`Writing dependencies files.`);

    for ( const key in STATE_LANGUAGE_DEPENDENCY_KEY ) {
        const langKey = STATE_LANGUAGE_DEPENDENCY_KEY[key]
        const data = { dependencies: [] };
        const filePath = `./infrastructure/dependencies/${langKey}/${STATE_DEPENDENCIES_FILE_NAME}`;

        for ( const depRepo in STATE_DEPENDENCIES[langKey] || [] ) {
            data["dependencies"].push(STATE_DEPENDENCIES[langKey][depRepo])
        }

        writeFile(filePath, JSON.stringify(data))
            .then(() => {
                console.log(`Saved data to ${filePath}.`);
            })
            .catch(err => {
                console.error(`Error while saving data to ${filePath}: ${err.message}`);
            });
    }
};

// ************************************************************ //

export const updateStateDependencies = (tech, key, repoName, org, branch, fileUrl) => {

    const path = `${org}__${repoName}`;
    const file_name = `${PREFIX_FILE_NAME}__${org}__${repoName}__${branch}`;
    const dep_obj = { file_name, [key]: fileUrl };

    if ( !STATE_DEPENDENCIES[tech] ) {
        STATE_DEPENDENCIES[tech] = { [path]: dep_obj };
    } else {
        if ( !STATE_DEPENDENCIES[tech][path] ) {
            STATE_DEPENDENCIES[tech][path] = dep_obj;
        } else if ( !STATE_DEPENDENCIES[tech][path][key] ) {
            STATE_DEPENDENCIES[tech][path][key] = fileUrl;
        } else {
            console.error( `error: path->${path},\nfile name->${file_name},\nkey->${key}` );
            throw new Error('This should not happen!'); 
        }
    }

    console.log( `Added ${fileUrl} to state file for ${tech} with ${key}.` );
};

// ************************************************************ //

export const getTechFile = (fileName) => {
    let tech = ""; let key = "file1";
    switch (fileName) {
        case "requirements.txt":
            tech = "python";
            break;
        case "pom.xml":
            tech = "java";
            break;
        case "cpanfile":
            tech = "perl";
            break;
        case "composer.json":
            tech = "php";
            break;
        case "Dockerfile":
            tech = "docker";
            break;
        case "package.json":
            tech = "node";
            break;
        case "package-lock.json":
            tech = "node";
            key = "file2";
            break;
        case "go.mod":
            tech = "go";
            break;
        case "go.sum":
            tech = "go";
            key = "file2";
            break;
        case "Gemfile":
            tech = "ruby";
            break;
        case "Gemfile.lock":
            tech = "ruby";
            key = "file2";
            break;
        default:
            console.error(`Error on ${fileName}.`);
    }
    return { tech, key };
};
