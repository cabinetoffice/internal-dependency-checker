export const MOCK_WHAT = "repos";
export const MOCK_REPO_URL = `https://api.github.com/orgs/${process.argv[2]}/${MOCK_WHAT}?page=1&per_page=100`;
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
        owner: { login: "org1" }
    },
    {
        name: "repo2",
        full_name: "org1/repo2",
        language: "Java",
        owner: { login: "org1" }
    },
    {
        name: "repo3",
        full_name: "org1/repo3",
        language: "TypeScript",
        owner: { login: "org1" }
    },
    {
        name: "repo4",
        full_name: "org2/repo4",
        language: "JavaScript",
        owner: { login: "org2" }
    },
    {
        name: "repo5",
        full_name: "org2/repo5",
        language: "Python",
        owner: { login: "org2" }
    },
    {
        name: "repo6",
        full_name: "org2/repo6",
        language: "Ruby",
        owner: { login: "org2" }
    },
    {
        name: "repo7",
        full_name: "org1/repo7",
        language: "Java",
        owner: { login: "org1" }
    },
    {
        name: "repo8",
        full_name: "org1/repo8",
        language: "Perl",
        owner: { login: "org1" }
    }
];
