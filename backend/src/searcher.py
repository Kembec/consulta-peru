from elasticsearch import Elasticsearch
import os

es_username = os.getenv("ELASTICSEARCH_USERNAME")
es_password = os.getenv("ELASTICSEARCH_PASSWORD")

es = Elasticsearch("http://elasticsearch:9200", basic_auth=(es_username, es_password))


def search_by_ruc(ruc):
    query = {"query": {"match": {"ruc": ruc}}}
    response = es.search(index="ruc_index", body=query)
    return response["hits"]["hits"]


def main():
    ruc_to_search = input("Enter the RUC to search: ")
    results = search_by_ruc(ruc_to_search)
    for result in results:
        print(result["_source"])


if __name__ == "__main__":
    main()
