import requests
import base64
import os

GITHUB_KEY = os.environ["GITHUB_KEY"]

# TODO import get_json using modules

def get_json(url, headers):
    r = requests.get(url, headers=headers)
    return r.headers, r.json()

def write_dependency_file(url, absolute_path):
    data = get_json(url, {'Authorisation': f'token {GITHUB_KEY}'})

    file_content = data[1]["content"]
    file_content_encoding = data[1]["encoding"]
    if file_content_encoding == "base64":
        file_content = base64.b64decode(file_content).decode()
    f = open(absolute_path, "w")
    f.write(file_content)
    f.close()

def create_dependency_subdirectory(dependency_path, repo_name):
    path_split = dependency_path.split("/")  # split path string into list

    remove_dependency_file = path_split[
        :-1
    ]  # remove dependency file from filepath in order to create subdir only filepath

    subdir_path = "/".join(
        remove_dependency_file
    )  # rejoin to list elements to create string with subdir path

    full_path = os.path.join(
        f"repos/{repo_name}/{subdir_path}"
    )  # create absolute path from root repos folder

    # Check if folder has already been created, if not, create it
    if not os.path.exists(full_path):
        os.makedirs(full_path)

    return full_path

def write_dependencies_to_file(all_dependencies, repo_name):

    for dependency in all_dependencies:
            
            dependency_name = dependency["name"]
            dependency_path = dependency["path"]

            # If dependency file is inside project root directory (no need to generate subdirectories), navigate to url and write to file

            if (dependency_path == dependency_name):

                content_url = dependency["url"]
                write_to_file_path = f"repos/{repo_name}/{dependency_path}"

                write_dependency_file(content_url, write_to_file_path)

            # if dependency files are nested in subdirectories

            else:  
                # Create nested subdirectories

                subdir_path = create_dependency_subdirectory(dependency_path, repo_name)

                # Write dependencies to file inside relevant nested subdirectory

                content_url = dependency["url"]
                full_path = f"{subdir_path}/{dependency_name}"
                write_dependency_file(content_url, full_path)

# write_dependencies_to_file()