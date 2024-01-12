export const MOCK_TECH_DATA = [
    {
        fileName: "requirements.txt",
        tech: "python",
        key: 'file1'
    },
    {
        fileName: "pom.xml",
        tech: "java",
        key: 'file1'
    },
    {
        fileName: "cpanfile",
        tech: "perl",
        key: 'file1'
    },
    {
        fileName: "composer.json",
        tech: "php",
        key: 'file1'
    },
    {
        fileName: "composer.lock",
        tech: "php",
        key: 'file2'
    },
    {
        fileName: "Dockerfile",
        tech: "docker",
        key: 'file1'
    },
    {
        fileName: "docker-compose.yml",
        tech: "compose",
        key: 'file1'
    },
    {
        fileName: "package.json",
        tech: "node",
        key: 'file1'
    },
    {
        fileName: "package-lock.json",
        tech: "node",
        key: 'file2'
    },
    {
        fileName: "go.mod",
        tech: "go",
        key: 'file1'
    },
    {
        fileName: "go.sum",
        tech: "go",
        key: 'file2'
    },
    {
        fileName: "Gemfile",
        tech: "ruby",
        key: 'file1'
    },
    {
        fileName: "Gemfile.lock",
        tech: "ruby",
        key: 'file2'
    },
    {
        fileName: "gradlew",
        tech: "kotlin",
        key: 'file1'
    },
];

export const MOCK_FILE_EXT_TECH_DATA = [
    {
        fileExtension: '.tf',
        tech: "terraform",
        key: 'file1'
    },
    {
        fileExtension: '.csproj',
        tech: "csharp",
        key: 'file1'
    }
];

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
