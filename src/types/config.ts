import {
    GitHubTeams,
    GitHubMembers,
    GitHubRepos
} from "@co-digital/api-sdk/lib/api-sdk/github/type";
import {
    TEAMS_KEY,
    REPOS_KEY,
    MEMBERS_KEY
} from "../config";

export type GITHUB_METHODS_TYPE = "getRepos" | "getMembers" | "getTeams" | "getMembersPerTeam" | "getReposPerTeam";

export interface RepoDetails extends GitHubRepos {
  members: string[];
  teams: string[];
}

export interface MemberDetails extends GitHubMembers {
  repos: string[];
  teams: string[];
}

export interface TeamDetails extends GitHubTeams {
  repos: string[];
  members: string[];
}

export enum WhatEnum {
  repos = REPOS_KEY,
  members = MEMBERS_KEY,
  teams = TEAMS_KEY
}

export type GitOrgData = {
  list: string[];
  details: {
    [key_name: string]: RepoDetails | MemberDetails | TeamDetails
  }
};

export type OrgData = {
  [key in WhatEnum]: GitOrgData
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
