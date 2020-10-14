import logging
import requests
import azure.functions as func
import base64, json

def string_base64(tex):
    if(tex == ""):
        return ""
    tex_en = tex.encode('utf-8')
    tex_64_en = base64.b64encode(tex_en)
    tex_64 = tex_64_en.decode('utf-8')
    return tex_64

def base64_string(tex:str):
    if(tex == ""):
        return ""
    b64_en = tex.encode('utf-8')
    b64_64_en = base64.b64decode(b64_en)
    fin_str = b64_64_en.decode('utf-8')
    return fin_str

def main(req: func.HttpRequest) -> func.HttpResponse:
    con = True
    try:
        data = req.get_json()
        method = data['method']
        url = data['url']
        header = data.get('header', {})
        body = base64_string(data.get('body', ''))
    except:
        con = False
    if con:
        x = requests.request(method=method, url=url, headers = header, data=body)
        print(x.text)
        body_got = string_base64(x.text)
        headers_got = dict(map(lambda y:(y,x.headers[y]),x.headers))
        resp = {
            "body" : body_got,
            "status_code": f"{x.status_code} {x.reason}",
            "headers": headers_got
        }
        return func.HttpResponse(json.dumps(resp), mimetype="application/json")
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass body in correct format",
             status_code=400
        )
