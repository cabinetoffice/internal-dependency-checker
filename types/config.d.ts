export const enum WhatEnum {
  repos = "repos",
  members = "members",
  teams = "teams"
}

export interface OrgData {
  [key: WhatEnum]: any[];
  repos: any[];
  members: any[];
  teams: any[];
}

export interface StateDependencies {
  [tech: string]: {
    [file_name: string]: {
      [key: string]: string;
      repo_path: string;
      file_name: string;
      repo_file_path: string;
    }
  }
}