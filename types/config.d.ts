export const enum WhatEnum {
  repos = "repos",
  members = "members",
  teams = "teams"
}

export interface OrgData {
  repos: any[];
  members: any[];
  teams: any[];
}

export const enum TechEnum {
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

export const enum KeyEnum {
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