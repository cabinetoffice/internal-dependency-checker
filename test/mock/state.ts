const pythonObjWithFile1DependencyFile = {
    "repos__org1__repo1": {
        "repo_path": "repos/org1/repo1",
        "file1": "repos/org1/repo1/requirements.txt",
        "repo_file_path": "repos/org1/repo1",
        "file_name": "repos__org1__repo1",
    },
};

const pythonObjWithTwoOrgReposAndFile1DependencyFile = {
    ...pythonObjWithFile1DependencyFile,
    "repos__org1__repo2": {
        "repo_path": "repos/org1/repo2",
        "file1": "repos/org1/repo2/requirements.txt",
        "repo_file_path": "repos/org1/repo2",
        "file_name": "repos__org1__repo2",
    }
};

const javaObjWithFile1DependencyFile = {
    "repos__org2__repo2": {
        "repo_path": "repos/org2/repo2",
        "file1": "repos/org2/repo2/pom.xml",
        "repo_file_path": "repos/org2/repo2",
        "file_name": "repos__org2__repo2",
    },
};

const nodeObjWithFile1DependencyFile = {
    "repos__org1__repo1": {
        "repo_path": "repos/org1/repo1",
        "file1": "repos/org1/repo1/package.json",
        "repo_file_path": "repos/org1/repo1",
        "file_name": "repos__org1__repo1",
    },
}

const nodeObjWithBothDependencyFiles = {
    ...nodeObjWithFile1DependencyFile["repos__org1__repo1"],
    "file2": "repos/org1/repo1/package-lock.json"
}

export const mockStateDependenciesData = [
    {
        filePath: "infrastructure/repos/org1/repo1/requirements.txt",
        fileName: "requirements.txt",
        fileExtension: "",
        expected: {
            "python": pythonObjWithFile1DependencyFile
        }
    },
    {
        filePath: "infrastructure/repos/org2/repo2/pom.xml",
        fileName: "pom.xml",
        fileExtension: "",
        expected: {
            "python": pythonObjWithFile1DependencyFile,
            "java": javaObjWithFile1DependencyFile
        }
    },
    {
        filePath: "infrastructure/repos/org1/repo1/package.json",
        fileName: "package.json",
        fileExtension: "",
        expected: {
            "python": pythonObjWithFile1DependencyFile,
            "java": javaObjWithFile1DependencyFile,
            "node": nodeObjWithFile1DependencyFile
        }
    },
    {
        filePath: "infrastructure/repos/org1/repo1/package-lock.json",
        fileName: "package-lock.json",
        fileExtension: "",
        expected: {
            "python": pythonObjWithFile1DependencyFile,
            "java": javaObjWithFile1DependencyFile,
            "node": { "repos__org1__repo1": nodeObjWithBothDependencyFiles }
        }
    },
    {
        filePath: "infrastructure/repos/org1/repo2/requirements.txt",
        fileName: "requirements.txt",
        fileExtension: "",
        expected: {
            "java": javaObjWithFile1DependencyFile,
            "python": pythonObjWithTwoOrgReposAndFile1DependencyFile,
            "node": { "repos__org1__repo1": nodeObjWithBothDependencyFiles },
        }
    }
];
