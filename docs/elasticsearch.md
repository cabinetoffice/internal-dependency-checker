# Elasticsearch

To analyse and gain insights from the JSON audit files and other information (e.g., git user and repository info), the Elasticsearch and Kibana (E&K) solution has been chosen. This solution provides functionality for analysing, aggregating, and filtering data. Furthermore, Elasticsearch can efficiently store and index this data in a way that supports fast searches.

Kibana is used to query and visualise the data stored in Elasticsearch. The Kibana dashboard serves as a user-friendly interface, allowing users to easily explore and identify vulnerabilities in the software across organisation(s). It provides efficient tracking and monitoring of security issues, facilitating remediation efforts.

In the initial stages of the IDC project, information will be collected as described in the [README](./README.md) file, and then fed in bulk to Elasticsearch during the bootstrap process. However, in the future, the service will continuously receive updated information on the status of our repositories. Whenever a repository is updated, a task in our CI/CD pipeline will be triggered to initiate the check. The results of this check will then be compiled into a report and sent to dedicated storage. This setup ensures that we have real-time data on the status of our services and can access historical reports for analysis and review.

## Structure & Configuration

The development configuration for the IDC project can be accessed [here](https://github.com/cabinetoffice/internal-dependency-checker/tree/main/infrastructure/elasticsearch). Docker Compose is used to initiate the entire stack, including `Elasticsearch`, `Kibana`, and `Filebeat`. It's worth mentioning that currently, we manually ingest the pipeline configurations into Elasticsearch.

However, a straightforward support script will be integrated in due course. This will involve iterating through the ingest folder, saving related configurations using the file name as the ID and its content as the value. These pipelines pre-process documents before the actual indexing takes place in Elasticsearch. For operations on the JSON audit file, tasks such as removing or renaming fields, as well as more complex logic using scripts, are carried out sequentially.

|              Name               |                 Description                                       |
|-------------------------------------|-----------------------------------------------------------------|
| ./elasticsearch/.env.example | List the secret names and example values needed to quickly get up and running with E&K |
| ./elasticsearch/docker-compose.yml | docker-compose.yml file sets up an elasticsearch, kibana and filebeat containers using the official Elasticsearch image from Docker Hub. Stack version used is 8.7.1 |
| ./elasticsearch/configs/filebeat.yml | filebeat.yml configuration file specifies inputs, Elasticsearch output settings, Prospectors and other options. In this file we are specifying how to process the logs and send them to Elasticsearch. The prospector will contain the name of the ingest pipeline to apply to the ingested data, as well as the index name to store the ingested data that will be used to create the Data View. |
| ./data/filebeat<br>./data/kibana<br>./data/elasticsearch | These paths will store the respective data for Kibana, Elasticsearch, and Filebeat, which will maintain state and configuration between container restarts. Related configuration has been added on compose file. |
| ./ingest<br>./ingest/git/idc_git_commits_pipeline.json<br>./ingest/git/idc_git_info_pipeline.json<br>./ingest/node/idc_node_audit_pipeline.json<br>./ingest/python/idc_python_audit_pipeline.json | Directory structure for each ingest pipeline. Each pipeline is defined in a JSON file specific to its language/category.Each JSON file contains the configuration for its respective ingest pipeline, detailing how the data should be processed and transformed before being indexed into Elasticsearch. These pipelines define various processors, transformations, and enrichments to be applied to the incoming data. |

Before accessing Kibana we need fix the authentication issue with kibana_system user to contact elasticsearch. Only in Development mode!!

```sh
curl -X POST -u "elastic:${ELASTIC_PASSWORD}" -H "Content-Type: application/json" http://elasticsearch:9200/_security/user/kibana_system/_password -d "{\"password\":\"${KIBANA_PASSWORD}\"}"
# or based on `.env.example` file
curl -X POST -u "elastic:changeme" -H "Content-Type: application/json" http://elasticsearch:9200/_security/user/kibana_system/_password -d "{\"password\":\"changeme\"}"
```

The production configuration and best practices can be accessed [here](https://www.elastic.co/guide/en/cloud/current/ec-planning.html). However, I recommend considering a SaaS approach. List of all config files [Configuring Elasticsearchedit](https://www.elastic.co/guide/en/elasticsearch/reference/current/settings.html).

## Deployment

If the audit files are stored in a private S3 bucket, we could utilise the [AWS S3 input](https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-input-aws-s3.html) as the source for log retrieval. My preference for the search and analytics backend would be the [Amazon OpenSearch service](https://aws.amazon.com/opensearch-service/), with [Elastic Cloud](https://www.elastic.co/cloud) being a secondary option.

For a production environment that requires ongoing service maintenance (although not recommended), detailed planning is outlined [here](https://www.elastic.co/guide/en/cloud/current/ec-prepare-production.html).
