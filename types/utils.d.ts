export interface JsonData {
  repos: [
    {
      full_name: string;
      clone_url: string;
    }
  ];
}

export interface RepoList {
  [key: string]: {
    repo_path: string; file_name: string
  };
}

export interface TechFile {
  tech: string;
  key: string;
}
