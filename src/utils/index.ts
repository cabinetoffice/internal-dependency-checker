import { WhatEnum, TechEnum, DependencyObject } from '../types/config';
import { KeyEnum, TechFile } from '../types/utils';
import {
    FILES_BY_EXTENSIONS,
    STATE_DEPENDENCIES,
    PER_PAGE,
    ORG_DATA,
    HEADERS,
    CLONE_TIMEOUT,
    TEAMS_DATA
} from "../config/index";

// ************************************************************ //

export const setTimeOut = async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, CLONE_TIMEOUT));
};

// ************************************************************ //

export const getGitOrgData = async (what: WhatEnum, org: string, page = 1): Promise<void> => {
    const repoUrl = `https://api.github.com/orgs/${org}/${what}?page=${page}&per_page=${PER_PAGE}`;
    try {
        const jsonData = await fetch(repoUrl, HEADERS);
        const data = await jsonData.json();

        console.log(`Get ${what} from ${org}, page ${page}, retrieved ${data?.length}`);
        if (data?.length) {
            ORG_DATA[what] = ORG_DATA[what].concat(data);
            await getGitOrgData(what, org, page + 1);
        }
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
    }
};

// ************************************************************ //

export const setTeamsData = async ( ): Promise<void> => {
    try {
        for (const team of ORG_DATA.teams) {
            const membersData = await fetch(`${team["url"]}/members`, HEADERS);
            const repositoriesData = await fetch(team["repositories_url"], HEADERS);

            TEAMS_DATA[team["name"]] = {
                "members": { ... await membersData.json() },
                "repositories": { ... await repositoriesData.json() },
                "description": team["description"]
            };
            console.log(`Get members info for ${team["name"]} team`);
        }
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
    }
};

// ************************************************************ //

export const updateStateFile = (filePath: string, fileName: string, fileExtension: string): void => {

    const fp = filePath.split('/');
    const org = fp[2];
    const repoName = fp[3];

    const repo_path = `${fp[1]}/${org}/${repoName}`;
    const repo_file_path = fp.slice(1, fp.length - 1).join('/');
    const file_name = fp.slice(1, fp.length - 1).join('__');
    const file_path = fp.slice(1, fp.length).join('/');

    const { tech, key }: TechFile = getTechFile(fileName, fileExtension);
    const dep_obj: DependencyObject = { repo_path, file_name, repo_file_path, [key]: file_path };

    if (!STATE_DEPENDENCIES[tech]) {
        STATE_DEPENDENCIES[tech] = { [file_name]: dep_obj };
    } else {
        if (!STATE_DEPENDENCIES[tech]![file_name]) {
            STATE_DEPENDENCIES[tech]![file_name] = dep_obj;
        } else if (!STATE_DEPENDENCIES[tech]![file_name][key]) {
            STATE_DEPENDENCIES[tech]![file_name][key] = file_path;
        } else if (FILES_BY_EXTENSIONS.indexOf(fileExtension) === -1) {
            console.error(`file name: ${file_name}, file Path: ${file_path}, key: ${key}`);
            throw new Error('This should not happen!');
        }
    }

    console.log(`Added ${file_path} to state file.`);
};

// ************************************************************ //

export const getTechFile = (fileName: string, fileExtension?: string): TechFile => {
    let tech: TechEnum; let key = KeyEnum.file1;

    if (fileExtension === '.tf') {
        return { tech: TechEnum.terraform, key };
    } else if (fileExtension === '.csproj') {
        return { tech: TechEnum.csharp, key };
    }

    switch (fileName) {
        case "requirements.txt":
            tech = TechEnum.python;
            break;
        case "pom.xml":
            tech = TechEnum.java;
            break;
        case "cpanfile":
            tech = TechEnum.perl;
            break;
        case "composer.json":
            tech = TechEnum.php;
            break;
        case "composer.lock":
            tech = TechEnum.php;
            key = KeyEnum.file2;
            break;
        case "Dockerfile":
            tech = TechEnum.docker;
            break;
        case "docker-compose.yml":
            tech = TechEnum.compose;
            break;
        case "package.json":
            tech = TechEnum.node;
            break;
        case "package-lock.json":
            tech = TechEnum.node;
            key = KeyEnum.file2;
            break;
        case "go.mod":
            tech = TechEnum.go;
            break;
        case "go.sum":
            tech = TechEnum.go;
            key = KeyEnum.file2;
            break;
        case "Gemfile":
            tech = TechEnum.ruby;
            break;
        case "Gemfile.lock":
            tech = TechEnum.ruby;
            key = KeyEnum.file2;
            break;
        case "gradlew":
            tech = TechEnum.kotlin;
            break;
        default:
            throw new Error(`Error: fix FILES_NAME object! File "${fileName}" has to be added.`);
    }
    return { tech, key };
};
