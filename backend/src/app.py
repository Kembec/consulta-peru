from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from elasticsearch import Elasticsearch
import os

url = os.getenv("URL", "localhost")
debug = os.getenv("DEBUG", "True") == "True"

app = Flask(__name__)
CORS(
    app,
    resources={r"/api/*": {"origins": ["localhost:5173", f"{url}"]}},
)

es_username = os.getenv("ELASTICSEARCH_USERNAME")
es_password = os.getenv("ELASTICSEARCH_PASSWORD")

es = Elasticsearch("http://elasticsearch:9200", basic_auth=(es_username, es_password))


@app.route("/api/search/<ruc>", methods=["GET"])
@cross_origin(
    origin=f'"localhost:5173", "{url}"',
    headers=["Content-Type", "Authorization"],
)
def search_by_ruc(ruc):
    if not ruc:
        return jsonify({"error": "RUC no proporcionado"}), 400

    try:
        query = {"query": {"match": {"ruc": ruc}}}
        response = es.search(index="ruc_index", body=query)
        return jsonify(response["hits"]["hits"])
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=debug)
