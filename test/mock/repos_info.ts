import { GitHubTeams } from "@co-digital/api-sdk/lib/api-sdk/github/type";
import { MEMBERS_PER_TEAM_KEY, REPOS_PER_TEAM_KEY } from "../../src/config";
import { WhatEnum } from "../../src/types/config";

export const MOCK_WHAT = WhatEnum.repos;
export const MOCK_ORGANIZATION = "COOL_ORG";
export const MOCK_REPO_URL = `https://api.github.com/orgs/${MOCK_ORGANIZATION}/${MOCK_WHAT}`;
export const MOCK_HEADERS = { "headers": { "Authorization": `Bearer ${process.env.GITHUB_KEY}` } };

export const MOCK_REPOS_INFO_EMPTY = {
    "repos": { "list": [], "details": {} },
    "members": { "list": [], "details": {} },
    "teams": { "list": [], "details": {} }
};

export const MOCK_REPOS_DATA = {
    "repos": {
        "list": ["repo1", "repo2", "repo3", "repo4"],
        "details": {
            "repo1": {
                "full_name": "org1/repo1",
                "visibility": "public",
                "html_url": "https://github.com/org1/repo1",
                "url": "https://api.github.com/org1/repo1",
                "description": "Best repo1",
                "created_at": "2015-12-10T11:48:11Z",
                "archived": false,
                "members": [],
                "teams": []
            },
            "repo2": {
                "full_name": "org1/repo2",
                "visibility": "public",
                "html_url": "https://github.com/org1/repo2",
                "url": "https://api.github.com/org1/repo2",
                "description": "Best repo2",
                "created_at": "2015-12-10T11:48:11Z",
                "archived": false,
                "members": [],
                "teams": []
            },
            "repo3": {
                "full_name": "org1/repo3",
                "visibility": "public",
                "html_url": "https://github.com/org1/repo3",
                "url": "https://api.github.com/org1/repo3",
                "description": "Best repo3",
                "created_at": "2015-12-10T11:48:11Z",
                "archived": false,
                "members": [],
                "teams": []
            },
            "repo4": {
                "full_name": "org1/repo4",
                "visibility": "public",
                "html_url": "https://github.com/org1/repo4",
                "url": "https://api.github.com/org1/repo4",
                "description": "Best repo4",
                "created_at": "2015-12-10T11:48:11Z",
                "archived": false,
                "members": [],
                "teams": []
            },
        }
    }
};

export const MOCK_JSON_FETCH_RESPONSE = [
    {
        description: "Best repo1",
        name: "repo1",
        full_name: "org1/repo1",
        archived: false,
        created_at: "2015-12-10T11:48:11Z",
        owner: { login: "org1" },
        html_url: "https://github.com/org1/repo1",
        url: "https://api.github.com/org1/repo1",
        visibility: "public"
    },
    {
        description: "Best repo2",
        name: "repo2",
        full_name: "org1/repo2",
        archived: false,
        created_at: "2015-12-10T11:48:11Z",
        owner: { login: "org1" },
        html_url: "https://github.com/org1/repo2",
        url: "https://api.github.com/org1/repo1",
        visibility: "public"
    },
    {
        description: "Best repo3",
        name: "repo3",
        full_name: "org1/repo3",
        archived: false,
        created_at: "2015-12-10T11:48:11Z",
        owner: { login: "org1" },
        html_url: "https://github.com/org1/repo3",
        url: "https://api.github.com/org1/repo1",
        visibility: "public"
    },
    {
        description: "Best repo4",
        name: "repo4",
        full_name: "org2/repo4",
        archived: false,
        created_at: "2015-12-10T11:48:11Z",
        owner: { login: "org2" },
        html_url: "https://github.com/org2/repo4",
        url: "https://api.github.com/org1/repo1",
        visibility: "public"
    }
];

export const MOCK_REPOS_TEAMS_NAME = "cool-team-name";
export const MOCK_REPOS_TEAMS_DESCRIPTION = "Teams Description";

export const MOCK_GET_TEAMS_API_SDK_RESPONSE = {
    httpStatusCode: 200,
    resource: [
        {
            "name": MOCK_REPOS_TEAMS_NAME,
            "description": MOCK_REPOS_TEAMS_DESCRIPTION,
            "url": "https://api.github.com/organizations/00000/team/22222",
            "html_url": `https://api.github.com/orgs/${MOCK_ORGANIZATION}/teams/${MOCK_REPOS_TEAMS_NAME}`,
            "members_url": "https://api.github.com/organizations/11111/team/22222/members{/member}",
            "repositories_url": "https://api.github.com/organizations/11111/team/22222/repos"
        }
    ],
};

export const MOCK_REPOS_TEAMS_DATA: GitHubTeams[] = MOCK_GET_TEAMS_API_SDK_RESPONSE.resource;

export const MOCK_ORG_TEAMS = {
    "teams": {
        "details": {
            [MOCK_REPOS_TEAMS_NAME]: {
                "description": MOCK_REPOS_TEAMS_DESCRIPTION,
                "url": "https://api.github.com/organizations/00000/team/22222",
                "html_url": `https://api.github.com/orgs/${MOCK_ORGANIZATION}/teams/${MOCK_REPOS_TEAMS_NAME}`,
                "repositories_url": "https://api.github.com/organizations/11111/team/22222/repos",
                "members": [],
                "repos": [],
            }
        },
        "list": [
            MOCK_REPOS_TEAMS_NAME
        ]
    }
};

export const MOCK_REPOS_MEMBERS_NAME = "cool-member";
export const MOCK_REPOS_MEMBERS = {
    "0": {
        "login": MOCK_REPOS_MEMBERS_NAME,
        "url": `https://api.github.com/users/${MOCK_REPOS_MEMBERS_NAME}`,
        "html_url": `https://github.com/${MOCK_REPOS_MEMBERS_NAME}`
    }
};
export const MOCK_REPOS_REPO_NAME = "cool-repo";
export const MOCK_REPOS_REPOSITORIES = {
    "0": {
        "name": MOCK_REPOS_REPO_NAME,
        "full_name": `${MOCK_ORGANIZATION}/${MOCK_REPOS_REPO_NAME}`,
        "html_url": `https://github.com/${MOCK_ORGANIZATION}/${MOCK_REPOS_REPO_NAME}`,
        "description": "Something",
        "visibility": "public",
        "url": "https://api.github.com/org1/repo1",
        "created_at": "2015-12-10T11:48:11Z",
        "archived": false
    }
};

export const MOCK_PER_TEAM_DATA = {
    [MEMBERS_PER_TEAM_KEY]: {
        [MOCK_REPOS_TEAMS_NAME]: [{ "login": MOCK_REPOS_MEMBERS_NAME }]
    },
    [REPOS_PER_TEAM_KEY]: {
        [MOCK_REPOS_TEAMS_NAME]: [{ "name": MOCK_REPOS_REPO_NAME }]
    }
};

export const MOCK_ORG_DATA = {
    "repos": {
        "details": {
            [MOCK_REPOS_REPO_NAME]: {
                "description": "Something",
                "full_name": "COOL_ORG/cool-repo",
                "html_url": "https://github.com/COOL_ORG/cool-repo",
                "visibility": "public",
                "url": "https://api.github.com/org1/repo1",
                "created_at": "2015-12-10T11:48:11Z",
                "archived": false,
                // Added duplicated values
                "members": [MOCK_REPOS_MEMBERS_NAME, MOCK_REPOS_MEMBERS_NAME, MOCK_REPOS_MEMBERS_NAME],
                "teams": [MOCK_REPOS_TEAMS_NAME]
            }
        },
        "list": [MOCK_REPOS_REPO_NAME]
    },
    "members": {
        "details": {
            [MOCK_REPOS_MEMBERS_NAME]: {
                "html_url": "https://github.com/cool-member",
                // Added duplicated values
                "repos": [MOCK_REPOS_REPO_NAME, MOCK_REPOS_REPO_NAME, MOCK_REPOS_REPO_NAME],
                "teams": [MOCK_REPOS_TEAMS_NAME],
                "url": "https://api.github.com/users/cool-member"
            }
        },
        "list": [MOCK_REPOS_MEMBERS_NAME]
    },
    "teams": {
        "details": {
            [MOCK_REPOS_TEAMS_NAME]: {
                "description": MOCK_REPOS_TEAMS_DESCRIPTION,
                "html_url": "https://api.github.com/orgs/COOL_ORG/teams/cool-team-name",
                "members": [MOCK_REPOS_MEMBERS_NAME],
                "members_url": "https://api.github.com/organizations/11111/team/22222/members{/member}",
                "repos": [MOCK_REPOS_REPO_NAME],
                "repositories_url": "https://api.github.com/organizations/11111/team/22222/repos",
                "url": "https://api.github.com/organizations/00000/team/22222"
            }
        },
        "list": [
            MOCK_REPOS_TEAMS_NAME
        ]
    }
};
