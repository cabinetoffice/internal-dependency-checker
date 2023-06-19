import { WhatEnum } from "../../src/types/config";

export const MOCK_WHAT = WhatEnum.repos;
export const MOCK_ORGANIZATION = "COOL_ORG";
export const MOCK_REPO_URL = `https://api.github.com/orgs/${MOCK_ORGANIZATION}/${MOCK_WHAT}?page=1&per_page=100`;
export const MOCK_HEADERS = { "headers": { "Authorization": `Bearer ${process.env.GITHUB_KEY}` } };

export const MOCK_REPOS_INFO_EMPTY = {
    "members": [],
    "repos": [],
    "teams": []
};

export const MOCK_REPOS_DATA = [
    {
        name: "repo1",
        full_name: "org1/repo1",
        language: "Go",
        owner: { login: "org1" },
        clone_url: "https://github.com/org1/repo1"
    },
    {
        name: "repo2",
        full_name: "org1/repo2",
        language: "Java",
        owner: { login: "org1" },
        clone_url: "https://github.com/org1/repo2"
    },
    {
        name: "repo3",
        full_name: "org1/repo3",
        language: "TypeScript",
        owner: { login: "org1" },
        clone_url: "https://github.com/org1/repo3"
    },
    {
        name: "repo4",
        full_name: "org2/repo4",
        language: "JavaScript",
        owner: { login: "org2" },
        clone_url: "https://github.com/org2/repo4"
    },
    {
        name: "repo5",
        full_name: "org2/repo5",
        language: "Python",
        owner: { login: "org2" },
        clone_url: "https://github.com/org2/repo5"
    },
    {
        name: "repo6",
        full_name: "org2/repo6",
        language: "Ruby",
        owner: { login: "org2" },
        clone_url: "https://github.com/org2/repo6"
    },
    {
        name: "repo7",
        full_name: "org1/repo7",
        language: "Java",
        owner: { login: "org1" },
        clone_url: "https://github.com/org1/repo7"
    },
    {
        name: "repo8",
        full_name: "org1/repo8",
        language: "Perl",
        owner: { login: "org1" },
        clone_url: "https://github.com/org1/repo8"
    }
];
