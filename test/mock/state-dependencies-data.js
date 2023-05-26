const pythonObjWithFile1DependencyFile =  {
    "org1__repo1": {
        "file1": "https://raw.githubusercontent.com/org1/repo1/master/requirements.txt",
        "file_name": "mz__org1__repo1__master",
    },
};

const pythonObjWithTwoOrgReposAndFile1DependencyFile =  {
    ...pythonObjWithFile1DependencyFile,
    "org1__repo2": {
        "file1": "https://raw.githubusercontent.com/org1/repo2/master/requirements.txt",
        "file_name": "mz__org1__repo2__master",
    }
};

const javaObjWithFile1DependencyFile =  {
    "org2__repo2": {
        "file1": "https://raw.githubusercontent.com/org2/repo2/master/pom.xml",
        "file_name": "mz__org2__repo2__master",
    },
};

const nodeObjWithFile1DependencyFile =  {
    "org1__repo1": {
        "file1": "https://raw.githubusercontent.com/org1/repo1/master/package.json",
        "file_name": "mz__org1__repo1__master",
    },
}

const nodeObjWithBothDependencyFiles = {
    ...nodeObjWithFile1DependencyFile["org1__repo1"],
    "file2": "https://raw.githubusercontent.com/org1/repo1/master/package-lock.json",
}

export const mockStateDependenciesData = [
    {
        tech: "python",
        key: 'file1',
        repoName: "repo1",
        fileUrl: "https://raw.githubusercontent.com/org1/repo1/master/requirements.txt",
        branch: "master",
        org: "org1",
        expected: {
            "python": pythonObjWithFile1DependencyFile
        }
    },
    {
        tech: "java",
        key: 'file1',
        repoName: "repo2",
        fileUrl: "https://raw.githubusercontent.com/org2/repo2/master/pom.xml",
        branch: "master",
        org: "org2",
        expected: {
            "python": pythonObjWithFile1DependencyFile,
            "java": javaObjWithFile1DependencyFile
        }
    },
    {
        tech: "node",
        key: 'file1',
        repoName: "repo1",
        fileUrl: "https://raw.githubusercontent.com/org1/repo1/master/package.json",
        branch: "master",
        org: "org1",
        expected: {
            "python": pythonObjWithFile1DependencyFile,
            "java": javaObjWithFile1DependencyFile,
            "node": nodeObjWithFile1DependencyFile
        }
    },
    {
        tech: "node",
        key: 'file2',
        repoName: "repo1",
        fileUrl: "https://raw.githubusercontent.com/org1/repo1/master/package-lock.json",
        branch: "master",
        org: "org1",
        expected: {
            "python": pythonObjWithFile1DependencyFile,
            "java": javaObjWithFile1DependencyFile,
            "node": { "org1__repo1": nodeObjWithBothDependencyFiles }
        }
    },
    {
        tech: "python",
        key: 'file1',
        repoName: "repo2",
        fileUrl: "https://raw.githubusercontent.com/org1/repo2/master/requirements.txt",
        branch: "master",
        org: "org1",
        expected: {
            "java": javaObjWithFile1DependencyFile,
            "python": pythonObjWithTwoOrgReposAndFile1DependencyFile, 
            "node": { "org1__repo1": nodeObjWithBothDependencyFiles },
        }
    },
];
