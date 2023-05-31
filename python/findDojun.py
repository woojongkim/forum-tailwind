import requests
import json


# JSON 배열을 순환하고 titleName을 처리합니다.

for i in range(1,101) :
    url = f"https://comic.naver.com/api/challenge/list?genre=&order=VIEW&tab=TOTAL&page={i}"
    response = requests.get(url)
    json_data = response.json()
    # print(f"index : {i}")
    if 'list' in json_data :
        for item in json_data['list']:
            if 'greatestContest' in item and item['greatestContest'] == True :
                print(f"{item['titleName']}\t{item['starScore']}\t{item['viewCount']}")