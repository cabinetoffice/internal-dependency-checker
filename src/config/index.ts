import {
    RepoList,
    StateDependencies
} from '../types/config';

export const APPLICATION_NAME = 'Internal Dependency Checker';
export const GITHUB_KEY = process.env.GITHUB_KEY;

export const PER_PAGE = 100;
export const CLONE_TIMEOUT = 5000;

export const MEMBERS_PER_TEAM_KEY = "members_per_team";
export const REPOS_PER_TEAM_KEY = "repos_per_team";
export const MEMBERS_KEY = "members";
export const TEAMS_KEY = "teams";
export const REPOS_KEY = "repos";

export const GIT_BASE_URL = "https://api.github.com/orgs";

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
