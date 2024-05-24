import threading
import random
from queue import Queue
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC 

# https://updates.techsupport-corp.com/67a7b7ddd3959ad5?l=11
# https://www.micrasoft-office365.com/a8764900322d1a31?l=41
# https://www.sharepoint-docshare.com/4ec8837879a67cd3?l=38

# nelipak.security.team@techsupport-corp.com

working_numbers = []
big_code = 0x67a7b7ddd3959ad5
little_code = 11
test_code = 0x70a7b7ddd3959ac5
response = []

campaign_code=0xdae69bfbb0
userid=0xa7b7d3959a
userid_reversed=0xa9593d7b7a
userid_a=0xa7b7d
userid_b=0x3959a

# Make a string in the format it appears to be in with manual testing - xx-a7b7d-xx-3959a-xx
def make_hex_string(x,y,z):
    return '{:02x}a7b7d{:02x]).hex()}3959a{:02x}'.format(x,y,z)

# Make a string in the format it appears to be in with manual testing - xx-a7b7d-xx-3959a-xx
def make_alternative_hex_string(x,y):
    return '70a{:04x}dd{:04x}ac5'.format(x,y)

def open_tab(url, time):
    c = webdriver.ChromeOptions()
    c.add_argument("--incognito")
    driver = webdriver.Chrome(options=c)
    driver.get(url)
    WebDriverWait(driver, time).until(lambda driver: "You've been phished" in driver.title or 'The page cannot be found' in driver.title)
    # (EC.title_contains("You've been phished"))
    driver.close()

def alternate_junk_hex(domain, symbol):
    for i in range(255,-1,-1):
        for j in range(255,-1,-1):
            for k in range(255,-1,-1):
                code = make_hex_string(k,j,i)
                url = f'https://{domain}/{code}?{symbol}={random.randint(0,99)}'
                yield url

def alternate_guid_hex(domain, symbol):
    # factor1 = 32713
    # factor2 = 11186
    # for i in range(686973-(factor1*10),686973+(factor1*10),factor1):
    #     for j in range(234906-(factor2*10),234906+(factor2*10),factor2):
    #             code = make_alternative_hex_string(i,j)
    #             url = f'https://{domain}/{code}?{symbol}={random.randint(0,99)}'
    #             yield url

    for i in range(65535,-1,-1):
        if(str(i) != str(i)[::-1]):
            continue
        # for j in range(65535,-1,-1):
        for j in range(19991,10000,-1):
                code = make_alternative_hex_string(i,j)
                url = f'https://{domain}/{code}?{symbol}={random.randint(0,99)}'
                yield url

def produce(queue, domain, symbol, generator):
    for url in generator(domain, symbol):
        queue.put(url)
    queue.put(None)
                 
def consume(queue, time):
    while True:
         url = queue.get()
         if url is None:
              break
         open_tab(url, time)
    queue.put(None)

def main():
    queue = Queue()

    for x in range(0, 20):
        consumer = []
        consumer.append(threading.Thread(target=consume, args=(queue, 30)))
        consumer[-1].start()
    
    producer = threading.Thread(target=produce, args=(queue, 'updates.techsupport-corp.com', 'l', alternate_guid_hex))
    producer.start()
    # Cycle all the possible combinations of inputs
    producer.join()
    for thread in consumer:
        thread.join()

if __name__ == "__main__":
    main()
