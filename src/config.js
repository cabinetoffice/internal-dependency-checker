export const PER_PAGE = 100;
export const PREFIX_FILE_NAME = 'mz';
export const ALL_DEP_FILES_KEY = 'NA';
export const STATE_LANGUAGE_DEPENDENCY_KEY = ['python', 'java', 'perl', 'php', 'docker', 'node', 'go', 'ruby'];
export const STATE_DEPENDENCIES_FOLDER = './infrastructure/dependencies';
export const STATE_DEPENDENCIES_FILE_NAME = 'dependencies.json';
export const STATE_DEPENDENCIES = {};

export const DEPENDENCY_FILES = {
    [ALL_DEP_FILES_KEY]: [
        'package.json', 'package-lock.json', 'requirements.txt', 'pom.xml',
        'cpanfile', 'go.mod', 'go.sum', 'Gemfile', 'Gemfile.lock',
        'composer.json', 'Dockerfile'
    ],
    // TBR
    // Python: ['requirements.txt'], // requirements.in
    // Java: ['pom.xml'], // build.gradle
    // Perl: ['cpanfile'],
    // Go: ['go.mod', 'go.sum'],
    // Ruby: ['Gemfile', 'Gemfile.lock'],
    // TypeScript: ['package.json', 'package-lock.json'], //  , 'yarn.lock'],
    // JavaScript: ['package.json', 'package-lock.json'], //  , 'yarn.lock'],
    // PHP: ['composer.json'],
    // Dockerfile: ['Dockerfile'],
    // HCL: [],
    // R: []
};
