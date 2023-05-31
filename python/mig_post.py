import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import pytz

load_dotenv('.env.local')

db_uri = os.environ.get("MONGODB_URI")

client = MongoClient(db_uri)
db = client["forum"]
collection = db["post"]

# 크롬 브라우저 실행
options = webdriver.ChromeOptions()
options.add_argument("headless") # 브라우저 창 숨기기
driver = webdriver.Chrome(options=options)

# 게시글 목록 페이지로 이동
driver.get("https://tdgall.com/index.php?mid=ex_all&search_target=title_content&search_keyword=%EC%A1%B0%EA%B0%9C")

# collection 전부 지움
collection.delete_many({})

utc_tz = pytz.utc
now = datetime.datetime.now(utc_tz)

# 게시글 목록을 가져옴
posts = []
post_links = driver.find_elements(By.XPATH, "/html/body/div[1]/div[2]/div[2]/div[2]/table/tbody/tr/td[2]/a")
for post_link in post_links:
    post_url = post_link.get_attribute("href")
    post_url.replace("mid=ex_all&search_target=title_content&search_keyword=조개&","")
    posts.append(post_url)
    print(post_url)
    # 5개만 가져오기
    if len(posts) == 20:
        break

# 게시글 내용을 가져옴
for post in posts:
    driver.get(post)
    try:
        post_title = driver.find_element(By.XPATH, "/html/body/div[1]/div[3]/div[2]/div[2]/div/div[1]/div[1]/div[1]/div/h4/a")
        print(post_title.text)
        
        post_content = driver.find_element(By.XPATH, "/html/body/div[1]/div[3]/div[2]/div[2]/div/div[1]/div[3]/div/div[1]")
        
        # post_content.text 북맠 이라는 글자부터 끝까지 잘라서 출력
        print(post_content.text.split("북맠")[0].strip())
        
        post_item = {
            "category" : "웹툰",
            "title" : post_title.text,
            "content" : post_content.text.split("북맠")[0].strip(),
            "cdate" : now,
            "mdate" : now,
            "cuser" : "ㅇㅇ",
            "view" : 0,
            "likes" : 0,
            "comments" : 0,
        }
        
        result = collection.insert_one(post_item)
        print('One post: {0}'.format(result.inserted_id))
        
    except:
        print("게시글 내용을 가져올 수 없습니다.")
        

# 브라우저 종료
driver.quit()