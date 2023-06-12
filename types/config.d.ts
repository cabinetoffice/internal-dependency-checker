export interface OrgData {
  [key: string]: any[];
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
