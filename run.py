from get_repos import get_repo_names
from create_repo_directory import create_project_directory
from find_dependency_endpoints import find_all_dependencies
from write_dependencies_to_file import write_dependencies_to_file
import os


def main():
    USERNAME = 'cabinetoffice'
    GITHUB_KEY = os.environ["GITHUB_KEY"]
    DEPENDENCY_FILE = 'package.json'

    all_repo_names = get_repo_names(USERNAME)

    # create_project_directory(all_repo_names[5])

    # all_dependencies = find_all_dependencies(USERNAME, all_repo_names[5], DEPENDENCY_FILE)

    # write_dependencies_to_file(all_dependencies, all_repo_names[5])


if __name__ == '__main__':
    main()
