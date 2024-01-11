import {
    GitHubTeams,
    GitHubMembers,
    GitHubRepos,
    GitHubMembersPerTeam,
    GitHubReposPerTeam
} from "@co-digital/api-sdk/lib/api-sdk/github/type";
import {
    TechEnum,
    DependencyObject,
    RepoDetails,
    MemberDetails,
    TechFile,
    KeyEnum,
    OrgData,
    GitOrgData,
    TeamDetails
} from '../types/config';
import {
    FILES_BY_EXTENSIONS,
    STATE_DEPENDENCIES,
    CLONE_TIMEOUT,
    TEAMS_KEY,
    REPOS_KEY,
    MEMBERS_KEY
} from "../config/index";
import { getData } from "../service/github";

// ************************************************************ //

export const setTimeOut = async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, CLONE_TIMEOUT));
};

// ************************************************************ //

export const setTeamsData = async (teams: GitHubTeams[]): Promise<GitOrgData> => {
    const obj = { "list": [], "details": {} } as GitOrgData;
    for (const team of teams) {
        const { name, ...rest } = team;

        const repos = (await getData("getReposPerTeam", `${rest.url}/repos`) as GitHubReposPerTeam[])
            .map(repos => repos.name);
        const members = (await getData("getMembersPerTeam", `${rest.url}/members`) as GitHubMembersPerTeam[])
            .map(members => members.login);

        obj.list.push(name);
        obj.details[name] = { ...rest, name, repos, members };
    }
    return obj;
};

// ************************************************************ //

export const setMembersData = (members: GitHubMembers[]): GitOrgData => {
    const obj = { "list": [], "details": {} } as GitOrgData;
    members.forEach((member) => {
        const { login, ...rest } = member;
        obj.list.push(login);
        obj.details[login] = { ...rest, login, repos: [], teams: [] } as MemberDetails;
    });
    return obj;
};

// ************************************************************ //

export const setReposData = (repos: GitHubRepos[]): GitOrgData => {
    const obj = { "list": [], "details": {} } as GitOrgData;
    repos.forEach((repo) => {
        const { name, ...rest } = repo;
        obj.list.push(name);
        obj.details[name] = { ...rest, name, members: [], teams: [] } as RepoDetails;
    });
    return obj;
};

// ************************************************************ //

export const setTeamsMembersReposInnerData = (data: OrgData): void => {
    const teams = data[TEAMS_KEY];
    teams.list.forEach(team => {

        const teamDetails = teams.details[team] as TeamDetails;
        const members = teamDetails[MEMBERS_KEY];
        const repos = teamDetails[REPOS_KEY];

        members.forEach((member) => {
            const memberDetails = data[MEMBERS_KEY].details[member] as MemberDetails;
            memberDetails[TEAMS_KEY].push(team);
            // Concat repos list and remove duplication
            memberDetails[REPOS_KEY] = [...new Set([...memberDetails[REPOS_KEY], ...repos])];
        });

        repos.forEach((repo) => {
            const repoDetails = data[REPOS_KEY].details[repo] as RepoDetails;
            repoDetails[TEAMS_KEY].push(team);
            // Concat members list and remove duplication
            repoDetails[MEMBERS_KEY] = [...new Set([...repoDetails[MEMBERS_KEY], ...members])];
        });
    });
};

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
