#!/usr/bin/env python3

import os
import subprocess
from sys import platform

repos = ''


def dep_check(dir):
    if platform == "linux":
        subprocess.run(
            "/home/danny/Documents/dependency-check/bin/dependency-check.sh --enableExperimental --scan . ", shell=True, cwd=dir)
    elif platform == "darwin":
        subprocess.run(
            "dependency-check --enableExperimental --scan .", shell=True, cwd=dir)


def make_report(repos):

    for root, subdir, files in os.walk(repos):

        print(f'root: {root}')
        print(f'subdirs: {subdir}')
        print(f'files: {files}')

        if 'package.json' in files and 'node_modules' not in files:
            print(
                f'Found a package.json file at directory: {root}. Npm installing and creating report...')

            subprocess.run("npm install", shell=True, cwd=root)

            dep_check(root)

        if 'requirements.txt' in files:
            print(
                f'Found a requirements.txt file at directory: {root}. creating report...')
            dep_check(root)
