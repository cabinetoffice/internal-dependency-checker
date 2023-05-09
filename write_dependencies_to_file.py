import base64
import os
from query_api import get_json
from dependency_data import dependency_data

GITHUB_KEY = os.environ["GITHUB_KEY"]

# TODO import get_json using modules


def write_dependency_file(url, github_key, file_path):
    headers, data = get_json(url, github_key)

    file_content = data["content"]
    file_content_encoding = data["encoding"]
    if file_content_encoding == "base64":
        file_content = base64.b64decode(file_content).decode()
    f = open(file_path, "w")
    f.write(file_content)
    f.close()

def create_subdirs(dependency_name, dependency_path, repo_name):
    
    subdir_path = os.path.join(f"repos/{repo_name}/{dependency_path}")

    if not os.path.exists(subdir_path):
        os.makedirs(subdir_path)

    file_path = os.path.join(f'{subdir_path}/{dependency_name}')

    return file_path

def write_dependencies_to_file(repo_name, github_key, dependency_data):
    for dependency in dependency_data:

        dependency_name = dependency["name"]
        dependency_path = dependency["path"]

        if dependency_path == dependency_name:
            path_split = dependency_path.split("/")  # split path string into list
            remove_dependency_file = path_split[:-1]  # remove dependency file from filepath in order to create subdir only filepath
            dependency_path = "/".join(remove_dependency_file)  # rejoin to list elements to create string with subdir path

        url = dependency["url"]

        file_path = f"repos/{repo_name}/{dependency_path}" if dependency_name == dependency_path else create_subdirs(dependency_name, dependency_path, repo_name)
        
        write_dependency_file(url, github_key, file_path)

def create_dependency_subdirectory(dependency_path, repository_name):
    path_split = dependency_path.split("/")  # split path string into list

    remove_dependency_file = path_split[
        :-1
    ]  # remove dependency file from filepath in order to create subdir only filepath

    relative_subdir_path = "/".join(
        remove_dependency_file
    )  # rejoin to list elements to create string with subdir path

    absolute_subdir_path = os.path.join(
        f"repos/{repository_name}/{relative_subdir_path}"
    )  # create absolute path from root repos folder

    # Check if folder has already been created, if not, create it
    if not os.path.exists(absolute_subdir_path):
        os.makedirs(absolute_subdir_path)

    return absolute_subdir_path

if __name__ == '__main__':
    write_dependencies_to_file('dependency-test-repo', os.environ['GITHUB_KEY'], dependency_data)

