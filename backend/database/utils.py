from typing import Any, Dict, List

def clean_doc(doc: Any) -> Any:
    """Recursively convert MongoDB ObjectId instances to str for JSON serialization."""
    if isinstance(doc, dict):
        res = {}
        for k, v in doc.items():
            if k == "_id":
                res[k] = str(v)
            else:
                res[k] = clean_doc(v)
        return res
    elif isinstance(doc, list):
        return [clean_doc(i) for i in doc]
    return doc

def clean_docs(docs: List[Any]) -> List[Any]:
    return [clean_doc(d) for d in docs]
