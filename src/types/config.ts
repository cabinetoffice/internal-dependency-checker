export const REPOS_KEY = "repos";

export interface RepoDetails {
  description: string;
  full_name: string;
  visibility: string;
  url: string;
  html_url: string;
  created_at: string;
  archived: boolean;
  members: string[];
  teams: string[];
}

export interface MemberDetails {
  url: string;
  html_url: string;
  repos: string[];
  teams: string[];
}

export interface TeamDetails {
  description: string;
  url: string;
  html_url: string;
  repos: string[];
  members: string[];
}

export enum WhatEnum {
  repos = "repos",
  members = "members",
  teams = "teams"
}

export type OrgData = {
  [key in WhatEnum]: {
    list: string[];
    details: {
      [key_name: string]: RepoDetails | MemberDetails | TeamDetails
    }
  };
};

export interface MemberPerTeam {
  login: string;
}

export interface MembersPerTeam {
  [team_name: string]: MemberPerTeam[]
}

export interface RepoPerTeam {
  name: string;
}

export interface ReposPerTeam {
  [team_name: string]: RepoPerTeam[]
}

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

export interface RepoList {
  [REPOS_KEY]: {
    [key: string]: {
      repo_path: string;
      file_name: string;
    };
  };
}

export interface TechFile {
  tech: TechEnum;
  key: KeyEnum;
}
