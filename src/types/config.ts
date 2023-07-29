export enum WhatEnum {
  repos = "repos",
  members = "members",
  teams = "teams"
}
export interface RepoDetails {
  description: string;
  full_name: string;
  visibility: string;
  url: string;
  html_url: string;
  created_at: string;
  archived: string;
  members: string[];
  teams: string[];
};

export interface MemberDetails {
  url: string;
  html_url: string;
  repos: string[];
  teams: string[];
};

export interface TeamDetails {
  description: string;
  url: string;
  html_url: string;
  repos: string[];
  members: string[];
};

export type OrgData = {
  [key in WhatEnum]: {
    list: any[];
    details: {
      [key_name: string]: RepoDetails | MemberDetails | TeamDetails
    }
  };
};

export enum TechEnum {
  python = "python",
  java = "java",
  perl = "perl",
  php = "php",
  docker = "docker",
  compose = "compose",
  node = "node",
  go = "go",
  ruby = "ruby",
  kotlin = "kotlin",
  terraform = "terraform",
  csharp = "csharp"
}

export enum KeyEnum {
  file1 = "file1",
  file2 = "file2"
}

export interface DependencyObject {
  [KeyEnum.file1]?: string;
  [KeyEnum.file2]?: string;
  repo_path?: string;
  file_name?: string;
  repo_file_path?: string;
}

export interface StateDependency {
  [file_name: string]: DependencyObject
}

export type StateDependencies = {
  [key in TechEnum]?: StateDependency;
};
