#!/usr/bin/env python3

import os

all_repo_names = []

def create_project_directory(repo):

    # create 'repo' root directory if it doesn't exitst. This houses all project directories

    if not os.path.isdir('repos'):
        os.mkdir('repos')
        
    # create path for project directory
    
    path = os.path.join("repos", repo)

    # Create project directory

    if not os.path.exists(path):
        os.mkdir(path)

