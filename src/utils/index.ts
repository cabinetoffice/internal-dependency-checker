import {
    FILES_BY_EXTENSIONS,
    STATE_DEPENDENCIES,
    ORGANIZATION,
    PER_PAGE,
    ORG_DATA,
    HEADERS
} from "../config/index.js";

// ************************************************************ //

export const filterRepos = (repos = [], key = 'clone_url') => repos.map((r) => r[key]);
export const getGitOrgData = async (what, page = 1) => {
    const repoUrl = `https://api.github.com/orgs/${ORGANIZATION}/${what}?page=${page}&per_page=${PER_PAGE}`;
    return await fetch(repoUrl, HEADERS)
        .then(jsonData => jsonData.json())
        .then(async data => {
            console.log(`Get ${what} from ${ORGANIZATION}, page ${page}, retrieved ${data?.length}`);
            if (data?.length) {
                ORG_DATA[what] = ORG_DATA[what].concat(data); // filterRepos(data));
                await getGitOrgData(what, page + 1);
            }
        })
        .catch(error => {
            console.error(`getGitOrgData error: ${error.message}`);
        })
};

// ************************************************************ //

export const updateStateFile = (filePath, fileName, fileExtension) => {

    const fp = filePath.split('/');
    const org = fp[2];
    const repoName = fp[3];

    const repo_path = `${fp[1]}/${org}/${repoName}`;
    const repo_file_path = fp.slice(1, fp.length - 1).join('/');
    const file_name = fp.slice(1, fp.length - 1).join('__');
    const file_path = fp.slice(1, fp.length).join('/');

    const { tech, key } = getTechFile(fileName, fileExtension);
    const dep_obj = { repo_path, file_name, repo_file_path, [key]: file_path };

    if (!STATE_DEPENDENCIES[tech]) {
        STATE_DEPENDENCIES[tech] = { [file_name]: dep_obj };
    } else {
        if (!STATE_DEPENDENCIES[tech][file_name]) {
            STATE_DEPENDENCIES[tech][file_name] = dep_obj;
        } else if (!STATE_DEPENDENCIES[tech][file_name][key]) {
            STATE_DEPENDENCIES[tech][file_name][key] = file_path;
        } else if (FILES_BY_EXTENSIONS.indexOf(fileExtension) === -1) {
            console.error(`error: path->${file_name}, file Path->${file_path}, key->${key}`);
            throw new Error('This should not happen!');
        }
    }

    console.log(`Added ${file_path} to state file.`);
};

// ************************************************************ //

export const getTechFile = (fileName, fileExtension) => {
    let tech = ""; let key = "file1";

    if (fileExtension === '.tf') {
        return { tech: "terraform", key };
    } else if (fileExtension === '.csproj') {
        return { tech: "csharp", key };
    }

    switch (fileName) {
        case "requirements.txt":
            tech = "python";
            break;
        case "pom.xml":
            tech = "java";
            break;
        case "cpanfile":
            tech = "perl";
            break;
        case "composer.json":
            tech = "php";
            break;
        case "composer.lock":
            tech = "php";
            key = "file2";
            break;
        case "Dockerfile":
            tech = "docker";
            break;
        case "docker-compose.yml":
            tech = "compose";
            break;
        case "package.json":
            tech = "node";
            break;
        case "package-lock.json":
            tech = "node";
            key = "file2";
            break;
        case "go.mod":
            tech = "go";
            break;
        case "go.sum":
            tech = "go";
            key = "file2";
            break;
        case "Gemfile":
            tech = "ruby";
            break;
        case "Gemfile.lock":
            tech = "ruby";
            key = "file2";
            break;
        case "gradlew":
            // case "gradlew.bat":
            // case "build.gradle.kts":
            // case "gradle-wrapper.jar":
            // case "gradle-wrapper.properties":
            tech = "kotlin";
            break;
        default:
            throw new Error(`Error: fix FILES_NAME object! File "${fileName}" has to be added.`);
    }
    return { tech, key };
};
