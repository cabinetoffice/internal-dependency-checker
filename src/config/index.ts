import {
    OrgData,
    TeamsData,
    StateDependencies
} from '../types/config.js';

export const GITHUB_KEY = process.env.GITHUB_KEY;

export const PER_PAGE = 100;
export const CLONE_TIMEOUT = 5000;

export const REPOS_KEY = "repos";
export const REPOS_FILE_NAME = "repos_info.json";
export const REPOS_SUB_DIRECTORY_PATH = "repos";
export const REPOS_DIRECTORY_PATH = `infrastructure/${REPOS_SUB_DIRECTORY_PATH}`;
export const REPOS_FILE_PATH = `${REPOS_DIRECTORY_PATH}/${REPOS_FILE_NAME}`;

export const REPOS_LIST_FILE_NAME = "repos_list.json";
export const REPOS_LIST_FILE_PATH = `${REPOS_DIRECTORY_PATH}/${REPOS_LIST_FILE_NAME}`;

export const STATE_DEPENDENCIES: StateDependencies = {};
export const STATE_FILE_NAME = "state.json";
export const STATE_FILE_PATH = `${REPOS_DIRECTORY_PATH}/${STATE_FILE_NAME}`;

export const TEAMS_FILE_NAME = "teams.json";
export const TEAMS_FILE_PATH = `${REPOS_DIRECTORY_PATH}/${TEAMS_FILE_NAME}`;
export const TEAMS_DATA: TeamsData = {};

export const ORG_DATA: OrgData = { "repos": [], "members": [], "teams": [] };
export const HEADERS = { 'headers': { 'Authorization': `Bearer ${GITHUB_KEY}` } };

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
