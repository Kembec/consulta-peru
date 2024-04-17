from elasticsearch import Elasticsearch, helpers
import os
import pandas as pd
import chardet
import numpy as np
import time

es_username = os.getenv("ELASTICSEARCH_USERNAME")
es_password = os.getenv("ELASTICSEARCH_PASSWORD")

es = Elasticsearch("http://elasticsearch:9200", basic_auth=(es_username, es_password))


def create_index(index_name):
    index_settings = {
        "settings": {"number_of_shards": 1, "number_of_replicas": 0},
        "mappings": {
            "properties": {
                "ruc": {"type": "keyword"},
                "nombre-o-razon-social": {"type": "text"},
                "estado-del-contribuyente": {"type": "text"},
                "condicion-de-domicilio": {"type": "text"},
                "ubigeo": {"type": "integer"},
                "tipo-de-via": {"type": "text"},
                "nombre-de-via": {"type": "text"},
                "codigo-de-zona": {"type": "text"},
                "tipo-de-zona": {"type": "text"},
                "numero": {"type": "text"},
                "interior": {"type": "text"},
                "lote": {"type": "text"},
                "departamento": {"type": "text"},
                "manzana": {"type": "text"},
                "kilometro": {"type": "text"},
            }
        },
    }
    if not es.indices.exists(index=index_name):
        es.indices.create(index=index_name, body=index_settings)


def clean_data(df):
    df["UBIGEO"] = pd.to_numeric(df["UBIGEO"], errors="coerce")
    df = df.replace({np.nan: None})
    return df


def index_batch(df, index_name):
    df = clean_data(df)

    column_mapping = {
        "RUC": "ruc",
        "NOMBRE O RAZÓN SOCIAL": "nombre-o-razon-social",
        "ESTADO DEL CONTRIBUYENTE": "estado-del-contribuyente",
        "CONDICIÓN DE DOMICILIO": "condicion-de-domicilio",
        "UBIGEO": "ubigeo",
        "TIPO DE VÍA": "tipo-de-via",
        "NOMBRE DE VÍA": "nombre-de-via",
        "CÓDIGO DE ZONA": "codigo-de-zona",
        "TIPO DE ZONA": "tipo-de-zona",
        "NÚMERO": "numero",
        "INTERIOR": "interior",
        "LOTE": "lote",
        "DEPARTAMENTO": "departamento",
        "MANZANA": "manzana",
        "KILÓMETRO": "kilometro",
    }
    df.rename(columns=column_mapping, inplace=True)

    records = df.to_dict(orient="records")
    actions = [
        {
            "_index": index_name,
            "_id": record["ruc"],
            "_source": record,
        }
        for record in records
    ]
    success = False
    retries = 5
    for attempt in range(retries):
        try:
            helpers.bulk(es, actions, chunk_size=500)
            success = True
            break
        except helpers.BulkIndexError as e:
            print("Bulk index error, intentando de nuevo...")
            for i, error_detail in enumerate(e.errors):
                action = error_detail.get("index", {})
                print(
                    f"Error {i + 1}: {action.get('error', {}).get('reason', 'No reason provided')}"
                )
        except Exception as e:
            print(f"Error during indexing: {e}")

        if attempt < retries - 1:
            time.sleep(2)
        else:
            print("Max retries reached, failed to index data")
            raise

    if not success:
        print("Failed to index batch after retries")


def detect_encoding(file_path):
    with open(file_path, "rb") as file:
        sample = file.read(10000)
        result = chardet.detect(sample)
        return result["encoding"]


def main():
    file_path = "./data/padron_reducido_ruc.txt"
    chunksize = 10000
    index_name = "ruc_index"
    encoding = detect_encoding(file_path)
    create_index(index_name)

    use_columns = [
        "RUC",
        "NOMBRE O RAZÓN SOCIAL",
        "ESTADO DEL CONTRIBUYENTE",
        "CONDICIÓN DE DOMICILIO",
        "UBIGEO",
        "TIPO DE VÍA",
        "NOMBRE DE VÍA",
        "CÓDIGO DE ZONA",
        "TIPO DE ZONA",
        "NÚMERO",
        "INTERIOR",
        "LOTE",
        "DEPARTAMENTO",
        "MANZANA",
        "KILÓMETRO",
    ]

    for chunk in pd.read_csv(
        file_path,
        chunksize=chunksize,
        delimiter="|",
        encoding=encoding,
        on_bad_lines="skip",
        usecols=use_columns,
    ):
        index_batch(chunk, index_name)


if __name__ == "__main__":
    main()
