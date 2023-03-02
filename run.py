from get_repos import get_repo_names
from create_repo_directory import create_project_directory
from find_dependency_endpoints import find_all_dependencies
from write_dependencies_to_file import write_dependencies_to_file

def main():
    USERNAME = 'cabinetoffice'
    DEPENDENCY_FILE = 'package.json'
    TIME_SLEEP = 1.5

    single_repo = 'gender-pay-gap'


    all_repo_names = get_repo_names(USERNAME)

    create_project_directory(single_repo)

    all_dependencies = find_all_dependencies(USERNAME, single_repo, DEPENDENCY_FILE)

    write_dependencies_to_file(all_dependencies, single_repo, TIME_SLEEP)


if __name__ == '__main__':
    main()
