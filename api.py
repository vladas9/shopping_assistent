import json
import os
import re

from flask import Flask, request
from groq import Groq

app = Flask(__name__)

os.environ["GROQ_API_KEY"] = "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"


promts = {
    "analysis": """I give you a set of description of a product. You need to write the answer in the format where the characteristics are described as 'key_word': 'your info'. The keys (key words) are in the data: table and in the output, the key words remain the same as in the input data.
            Your task is to write a short description of what this technology or parameter is, how good it is, what it is sufficient for, a comparison with the average value of the parameters in the market, downsides if any, and additional info.
            Additionally, provide the reason why each parameter is considered good, bad, or average, and how it compares to similar parameters in the market.
            If needed, specify additional info, tips, or compatibility details relevant to the parameter.
            Write the answer in very simple language with no hard terminology.
            \n\nThe response should follow this format:\n
            'pattern = r"\\*\\*(.*?)\\*\\*:\\s*(.*?)(?=\\n\\n|$)"\n'
            The info is: """,
    "review": "In the next info I will give you the title of a product the users review and the different criterias and their status, your task is you give a short overview and advice for the user based on the info, write all in 50 words. Info: ",
    "suggestion": "I will give you a list of products with their prices and reviews, as well as a list of items already in the user's cart. Your task is to recommend the best product from the list, ensuring it is compatible with the cart items and the queried item. The recommendation should be clear and simple, explicitly mentioning only the suggested item name and the reason for the suggestion. The response should begin with id: the_id or an array of ids. If no suitable option is found, provide a brief prompt with key search keywords for the user so he can find somthing suitable.",
    "definition": "I will give you a word you need to write a very very short defition of it or explanation in a very simple language",
    "text": "Your are a shop assistent and you respond only for related question or say that you don't know. Question: ",
}


def string_to_json(input_string, data_type):
    pattern = r"\*\*(.*?)\*\*:\s*(.*?)(?=\n\n|$)"

    matches = re.findall(pattern, input_string)

    result_dict = {match[0]: match[1] for match in matches}
    result_dict["type"] = data_type
    json_result = json.dumps(result_dict, indent=4)

    return json_result


def parse_data(data):
    data_dict = json.loads(data)
    data_type = data_dict.get("type")
    if data_type == "analysis":
        data_title = data_dict.get("data").get("title")
        data_table = data_dict.get("data").get("table")
        table_data_string = ", ".join(
            [f"{key} - {value}" for key, value in data_table.items()]
        )
        res = "title: " + data_title + ", parametrs: " + table_data_string
        return res, data_type
    elif data_type == "review":
        data_title = data_dict.get("data").get("title")
        data_criteria = data_dict.get("data").get("criteria")
        criteria_data_string = ", ".join(
            [f"{key} - {value}" for key, value in data_criteria.items()]
        )
        data_rating = data_dict.get("data").get("rating")
        data_detaledRating = data_dict.get("data").get("detailedRating")
        detailedRating_data_string = ", ".join(
            [f"{key} - {value}" for key, value in data_detaledRating.items()]
        )
        res = (
            "title: "
            + data_title
            + ", criteria: "
            + criteria_data_string
            + ", rating: "
            + data_rating
            + ", detailRating_data_string: "
            + detailedRating_data_string
        )
        return res, data_type
    elif data_type == "suggestion":
        res = ""
        data_items = data_dict.get("data").get("list")
        cart_data = data_dict.get("data").get("items")
        for key, value in data_items.items():
            res += f"'id': {key}\n"
            for inner_key, inner_value in value.items():
                res += f"'{inner_key}': '{inner_value}'\n"
            res += "\n"
        content = data_dict.get("content")
        res = f"{content}. Cart data: {cart_data} List of items: {res}"
        return res, data_type
    elif data_type == "text" or data_type == "definition":
        content = data_dict.get("content")
        return content, data_type
    return "", data_type


@app.route("/api/data", methods=["GET"])
def get_data():
    res = ""
    data_info = str(request.args.get("data"))
    data_info, data_type = parse_data(data_info)
    while True:
        data = promts[data_type] + data_info

        client = Groq(
            api_key=os.environ.get("GROQ_API_KEY"),
        )

        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": str(data),
                }
            ],
            model="llama3-8b-8192",
        )

        res = chat_completion.choices[0].message.content
        if data_type == "analysis":
            res = string_to_json(res, data_type)
            if res != "{}" and len(res) > 1500:
                break
        elif data_type == "review":
            res = {"review": res, "type": "review"}
            res = json.dumps(res, indent=4)
            break
        elif data_type == "suggestion":
            res = res.replace("\n", " \n ")
            ids = re.findall(r"id: ([a-f0-9-]+)", res)
            res = re.sub(r"id: [a-f0-9-]+\n?", "", res)
            res.replace("*", "")
            res = {"suggestion": res, "type": "suggestion", "ids": ids}
            break
        elif data_type == "text":
            res = {"content": res, "type": str(data_type)}
            break
        elif data_type == "definition":
            res = {"content": res, "type": str(data_type), "definition": data_info}
            break

    return res


app.run(port=5000)
