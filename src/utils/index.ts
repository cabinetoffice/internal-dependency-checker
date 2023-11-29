import {
    TechEnum,
    DependencyObject,
    RepoDetails,
    MemberDetails,
    TeamDetails,
    ReposPerTeam,
    MembersPerTeam,
    MemberPerTeam,
    RepoPerTeam,
    TechFile,
    KeyEnum
} from '../types/config';
import {
    FILES_BY_EXTENSIONS,
    STATE_DEPENDENCIES,
    PER_PAGE,
    ORG_DATA,
    HEADERS,
    CLONE_TIMEOUT,
    TMP_DATA,
    MAP_KEYS,
    MEMBERS_PER_TEAM_KEY,
    REPOS_PER_TEAM_KEY
} from "../config/index";

// ************************************************************ //

export const setTimeOut = async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, CLONE_TIMEOUT));
};

// ************************************************************ //

export const mapData = (data: any[] = [], keys: string[]) => data.map( (d: any) =>
    keys.reduce((o, key) => ({ ...o, [key]: d[key] }), {})
);

// ************************************************************ //

export const getInfo = async (what: string, dataKey: string, dataUrl: string, page = 1): Promise<void> => {
    const url = `${dataUrl}?page=${page}&per_page=${PER_PAGE}`;
    try {
        const jsonData = await fetch(url, HEADERS);
        const data = await jsonData.json();
        const dataLength = data?.length || 0;

        console.log(`${url}, page ${page}, retrieved ${dataLength}`);

        if (dataLength) {
            TMP_DATA[what][dataKey] = TMP_DATA[what][dataKey].concat(mapData(data, MAP_KEYS[what]));
            if (dataLength === PER_PAGE) {
                await getInfo(what, dataKey, dataUrl, page + 1);
            }
        }
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
    }
};

// ************************************************************ //

export const getOrgData = async (org: string, dataKey = "list"): Promise<void> => {
    // loop through each of teams, members and repos and use getInfo to extract the data
    for (const what of ['repos', 'members']) {
        console.log(`GET ${what} data:`);
        const url = `https://api.github.com/orgs/${org}/${what}`;
        await getInfo(what, dataKey, url);
    }
};

// ************************************************************ //

export const getPerTeamData = async (): Promise<void> => {
    for (const team of TMP_DATA["teams"]["list"]) {
        const memberUrl = `${team["url"]}/members`;
        const teamUrl = team["repositories_url"];
        const teamName = team["name"];

        TMP_DATA[MEMBERS_PER_TEAM_KEY][teamName] = [];
        TMP_DATA[REPOS_PER_TEAM_KEY][teamName] = [];

        await getInfo(MEMBERS_PER_TEAM_KEY, teamName, memberUrl);
        await getInfo(REPOS_PER_TEAM_KEY, teamName, teamUrl);
    }
};

// ************************************************************ //

export const setOrgData = (): void => {

    TMP_DATA["repos"]["list"].forEach((repo: any) => {
        const { name, ...rest } = repo;
        ORG_DATA["repos"]["list"].push(name);
        ORG_DATA["repos"]["details"][name] = { ...rest, members: [], teams: [] };
    });
    TMP_DATA["members"]["list"].forEach((member: any) => {
        const { login, ...rest } = member;
        ORG_DATA["members"]["list"].push(login);
        ORG_DATA["members"]["details"][login] = { ...rest, repos: [], teams: [] };
    });
    TMP_DATA["teams"]["list"].forEach((team: any) => {
        const { name, ...rest } = team;
        ORG_DATA["teams"]["list"].push(name);
        ORG_DATA["teams"]["details"][name] = {
            ...rest,
            repos: TMP_DATA[REPOS_PER_TEAM_KEY][name].map((r: RepoPerTeam) => r.name),
            members: TMP_DATA[MEMBERS_PER_TEAM_KEY][name].map((m: MemberPerTeam) => m.login)
        } as TeamDetails;
    });

    for (const [team, members] of Object.entries(TMP_DATA[MEMBERS_PER_TEAM_KEY] as MembersPerTeam)) {
        members.forEach((member) => {
            const memberName = member.login;
            const data = ORG_DATA["members"]["details"][memberName] as MemberDetails;
            data["teams"].push(team);
            // Concat repos list and remove duplication
            data["repos"] = [
                ...new Set([
                    ...data["repos"],
                    ...TMP_DATA[REPOS_PER_TEAM_KEY][team].map((r: RepoPerTeam) => r.name)
                ])
            ];
        });
    }
    for (const [team, repos] of Object.entries(TMP_DATA[REPOS_PER_TEAM_KEY] as ReposPerTeam)) {
        repos.forEach((repo) => {
            const repoName = repo.name;
            const data = ORG_DATA["repos"]["details"][repoName] as RepoDetails;
            data["teams"].push(team);
            // Concat members list and remove duplication
            data["members"] = [
                ...new Set([
                    ...data["members"],
                    ...TMP_DATA[MEMBERS_PER_TEAM_KEY][team].map((m: MemberPerTeam) => m.login)
                ])
            ];
        });
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
