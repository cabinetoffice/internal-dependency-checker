#!/usr/bin/env python3

import os

all_repo_names = ['.github',
 'action-bump-semver',
 'cciaf',
 'co-cookie-consent',
 'CO-Official-IT-AWS-Module-ec2-instance',
 'co-papt-prototype',
 'coding-exercise',
 'cookie-consent-sfdc',
 'cookie-consent-wp',
 'cop26-edge',
 'Create-Organisation-Lookup-For-RGCS',
 'Developer-recruitment-assessment-assets',
 'docker-clamav',
 'eds-data-store',
 'eds-documentation',
 'eip-ero-ems-integration-api',
 'eip-ero-print-api',
 'equality-data-platform',
 'equality-hub-govcharts',
 'gap-find-admin-backend',
 'gap-find-applicant-backend',
 'gap-find-apply-web',
 'gap-find-backend',
 'gap-find-lambda-scheduled-publishing',
 'gap-find-lambda-submission-export',
 'gap-find-lambda-upload',
 'gap-find-web',
 'gap-user-service',
 'GCS-Create-Organisation-Lookup-People-Survey',
 'GCS-People-Survey-Diversity-and-Inclusion',
 'GCSDataPortal',
 'gender-pay-gap',
 'gender-recognition-certificate-prototypes',
 'Government-Grants-Information-System-Metadata',
 'govuk-blogs',
 'govuk-design-system-dotnet',
 'gpa-datahub-lambda-template',
 'grants-centre-of-expertise',
 'grc-app',
 'gsg-guidance',
 'has-nomination-form',
 'internal-dependency-checker',
 'isc-content-blocks',
 'laravel-breeze-govuk-frontend',
 'laravel-govuk-frontend-preset',
 'lgbt-survey-viewer',
 'life-chances-fund',
 'life-chances-fund-2',
 'Make-RGCS-Data-Audit-Guidance',
 'Map_Organisations_GCS_Data_Audit',
 'Monitor-Gcs-Data-Portal',
 'national-leadership-centre-docs',
 'national-leadership-centre-drupal',
 'national-leadership-centre-elgg',
 'national-leadership-centre-neo4j',
 'national-leadership-centre-terraform',
 'national-leadership-centre-terragrunt',
 'national-leadership-centre-website',
 'oh-my-zsh',
 'ova-alpha',
 'ova-verification-alpha-phase-prototype',
 'peoplefinder',
 'Query_Organisations_API',
 'r-buildpack',
 'Reshaping-GCS',
 'Scrape-List-Of-Government-Organisations',
 'security.gov.uk-iac',
 'sfdc-useful-components',
 'slipping',
 'smc-son',
 'SRO_and_PD_gender',
 'sso.service.security.gov.uk',
 'ubuntu-ruby-node-go-nginx-mongo-vagrant-box',
 'Update-Org-Lookup']

def create_repo_directory(repo):

    # create path for repo directory
    
    path = os.path.join("repos", repo)

    # Create repo directory

    if not os.path.exists(path):
        os.mkdir(path)

if __name__ == '__main__':
    create_repo_directory(all_repo_names[3])

