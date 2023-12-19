import {
    REPOS_KEY,
    OrgData,
    RepoList,
    StateDependencies
} from '../types/config';

export const APPLICATION_NAME = 'Internal Dependency Checker';
export const GITHUB_KEY = process.env.GITHUB_KEY;

export const PER_PAGE = 100;
export const CLONE_TIMEOUT = 5000;

export const REPOS_FILE_NAME = "repos_info.json";
export const REPOS_SUB_DIRECTORY_PATH = "repos";
export const REPOS_DIRECTORY_PATH = `infrastructure/${REPOS_SUB_DIRECTORY_PATH}`;
export const REPOS_FILE_PATH = `${REPOS_DIRECTORY_PATH}/${REPOS_FILE_NAME}`;

export const REPOS_LIST: RepoList = { [REPOS_KEY]: {} };
export const REPOS_LIST_FILE_NAME = "repos_list.json";
export const REPOS_LIST_FILE_PATH = `${REPOS_DIRECTORY_PATH}/${REPOS_LIST_FILE_NAME}`;

export const STATE_DEPENDENCIES: StateDependencies = {};
export const STATE_FILE_NAME = "state.json";
export const STATE_FILE_PATH = `${REPOS_DIRECTORY_PATH}/${STATE_FILE_NAME}`;

export const HEADERS = { 'headers': { 'Authorization': `Bearer ${GITHUB_KEY}` } };

export const ORG_DATA: OrgData = {
    "repos": { "list": [], "details": {} },
    "members": { "list": [], "details": {} },
    "teams": { "list": [], "details": {} }
};

export const MEMBERS_PER_TEAM_KEY = "members_per_team";
export const REPOS_PER_TEAM_KEY = "repos_per_team";

export const MAP_KEYS: any = {
    "repos": ["name", "full_name", "visibility", "html_url", "url", "description", "created_at", "archived"],
    "members": ["login", "url", "html_url"],
    "teams": ["name", "description", "url", "html_url", "repositories_url"],
    [MEMBERS_PER_TEAM_KEY]: ["login"],
    [REPOS_PER_TEAM_KEY]: ["name"]
};

export const TMP_DATA: any = {
    "repos": { "list": [] },
    "members": { "list": [] },
    "teams": { "list": [] },
    [MEMBERS_PER_TEAM_KEY]: {},
    [REPOS_PER_TEAM_KEY]: {}
};

export const EXCLUDE_SUBDIRECTORY = ["node_modules", ".DS_Store"];
export const FILES_NAME = [
    'pom.xml',
    'cpanfile',
    'requirements.txt',
    'go.mod', 'go.sum',
    'Gemfile', 'Gemfile.lock',
    'composer.json', 'composer.lock',
    'Dockerfile', 'docker-compose.yml',
    'package.json', 'package-lock.json',
    'gradlew'
];
export const FILES_BY_EXTENSIONS = [
    '.tf',
    '.csproj'
];
