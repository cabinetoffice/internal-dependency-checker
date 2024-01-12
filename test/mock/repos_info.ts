import { GIT_BASE_URL } from "../../src/config";
import { WhatEnum } from "../../src/types/config";

export const MOCK_WHAT = WhatEnum.repos;
export const MOCK_ORGANIZATION = "COOL_ORG";

export const BASE_URL = `${GIT_BASE_URL}/${MOCK_ORGANIZATION}`;

export const MOCK_REPO_NAME = "cool-repo-name";
export const MOCK_MEMBERS_NAME = "cool-member";
export const MOCK_TEAMS_NAME = "cool-team-name";
const MOCK_REPO_DESCRIPTION = "Repos Description";
const MOCK_TEAMS_DESCRIPTION = "Teams Description";

// ************************************************************ //

export const MOCK_GET_TEAMS_API_SDK_RESPONSE = {
    httpStatusCode: 200,
    resource: [
        {
            "name": MOCK_TEAMS_NAME,
            "description": MOCK_TEAMS_DESCRIPTION,
            "url": "https://api.github.com/organizations/00000/team/22222",
            "html_url": `https://api.github.com/orgs/${MOCK_ORGANIZATION}/teams/${MOCK_TEAMS_NAME}`
        }
    ],
};

export const MOCK_GET_MEMBERS_API_SDK_RESPONSE = {
    httpStatusCode: 200,
    resource: [
        {
            "login": MOCK_MEMBERS_NAME,
            "url": `https://api.github.com/users/${MOCK_MEMBERS_NAME}`,
            "html_url": `https://github.com/${MOCK_MEMBERS_NAME}`,
            "repos_url": `https://api.github.com/users/${MOCK_MEMBERS_NAME}/repos`
        }
    ],
};

export const MOCK_GET_REPOS_API_SDK_RESPONSE = {
    httpStatusCode: 200,
    resource: [
        {
            "name": MOCK_REPO_NAME,
            "description": MOCK_REPO_DESCRIPTION,
            "full_name": `${MOCK_ORGANIZATION}/${MOCK_REPO_NAME}`,
            "visibility": 'public',
            "url": `https://api.github.com/repos/${MOCK_ORGANIZATION}/${MOCK_REPO_NAME}`,
            "html_url": `https://github.com/${MOCK_ORGANIZATION}/${MOCK_REPO_NAME}`,
            "created_at": '2023-07-10T08:41:07Z',
            "archived": false,
        },
    ],
};

// ************************************************************ //

export const MOCK_GET_MEMBERS_PER_TEAM_API_SDK_RESPONSE = {
    httpStatusCode: 200,
    resource: [{ "login": MOCK_MEMBERS_NAME }]
};

export const MOCK_GET_REPOS_PER_TEAM_API_SDK_RESPONSE = {
    httpStatusCode: 200,
    resource: [{ "name": MOCK_REPO_NAME }]
};

export const MOCK_ORG_TEAMS = {
    "teams": {
        "details": {
            [MOCK_TEAMS_NAME]: {
                "description": MOCK_TEAMS_DESCRIPTION,
                "name": MOCK_TEAMS_NAME,
                "url": "https://api.github.com/organizations/00000/team/22222",
                "html_url": `https://api.github.com/orgs/${MOCK_ORGANIZATION}/teams/${MOCK_TEAMS_NAME}`,
                "members": [MOCK_MEMBERS_NAME],
                "repos": [MOCK_REPO_NAME],
            }
        },
        "list": [
            MOCK_TEAMS_NAME
        ]
    }
};

export const MOCK_ORG_MEMBERS = {
    "members": {
        "details": {
            [MOCK_MEMBERS_NAME]: {
                "login": MOCK_MEMBERS_NAME,
                "html_url": `https://github.com/${MOCK_MEMBERS_NAME}`,
                "url": `https://api.github.com/users/${MOCK_MEMBERS_NAME}`,
                "repos_url": `https://api.github.com/users/${MOCK_MEMBERS_NAME}/repos`,
                "repos": [],
                "teams": [],
            }
        },
        "list": [MOCK_MEMBERS_NAME]
    }
};

export const MOCK_ORG_REPOS = {
    "repos": {
        "details": {
            [MOCK_REPO_NAME]: {
                "name": MOCK_REPO_NAME,
                "description": MOCK_REPO_DESCRIPTION,
                "full_name": `${MOCK_ORGANIZATION}/${MOCK_REPO_NAME}`,
                "visibility": 'public',
                "url": `https://api.github.com/repos/${MOCK_ORGANIZATION}/${MOCK_REPO_NAME}`,
                "html_url": `https://github.com/${MOCK_ORGANIZATION}/${MOCK_REPO_NAME}`,
                "created_at": '2023-07-10T08:41:07Z',
                "archived": false,
                "members": [],
                "teams": []
            }
        },
        "list": [MOCK_REPO_NAME]
    }
};

export const MOCK_ORG_DATA = {
    "repos": {
        "details": {
            [MOCK_REPO_NAME]: {
                "description": "Something",
                "full_name": "COOL_ORG/cool-repo",
                "html_url": "https://github.com/COOL_ORG/cool-repo",
                "visibility": "public",
                "url": "https://api.github.com/org1/repo1",
                "created_at": "2015-12-10T11:48:11Z",
                "archived": false,
                // Added duplicated values
                "members": [MOCK_MEMBERS_NAME, MOCK_MEMBERS_NAME, MOCK_MEMBERS_NAME],
                "teams": [MOCK_TEAMS_NAME]
            }
        },
        "list": [MOCK_REPO_NAME]
    },
    "members": {
        "details": {
            [MOCK_MEMBERS_NAME]: {
                "html_url": "https://github.com/cool-member",
                // Added duplicated values
                "repos": [MOCK_REPO_NAME, MOCK_REPO_NAME, MOCK_REPO_NAME],
                "teams": [MOCK_TEAMS_NAME],
                "url": "https://api.github.com/users/cool-member"
            }
        },
        "list": [MOCK_MEMBERS_NAME]
    },
    "teams": {
        "details": {
            [MOCK_TEAMS_NAME]: {
                "description": MOCK_TEAMS_DESCRIPTION,
                "html_url": "https://api.github.com/orgs/COOL_ORG/teams/cool-team-name",
                "members": [MOCK_MEMBERS_NAME],
                "repos": [MOCK_REPO_NAME],
                "url": "https://api.github.com/organizations/00000/team/22222"
            }
        },
        "list": [
            MOCK_TEAMS_NAME
        ]
    }
};
