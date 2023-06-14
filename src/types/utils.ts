import { TechEnum } from './config.js';
import { REPOS_KEY } from '../config/index.js';

export interface JsonData {
  // The full interface can be accessed here:https://docs.github.com/en/rest/repos/repos
  [REPOS_KEY]: [
    {
      full_name: string;
      clone_url: string;
    }
  ];
}

export interface RepoList {
  [REPOS_KEY]: {
    [key: string]: {
      repo_path: string;
      file_name: string;
    };
  };
}

export enum KeyEnum {
  file1 = "file1",
  file2 = "file2"
}

export interface TechFile {
  tech: TechEnum;
  key: KeyEnum;
}
