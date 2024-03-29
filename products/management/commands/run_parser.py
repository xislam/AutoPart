import asyncio
import time
import googletrans
import requests
from django.core.management.base import BaseCommand
from requests_html import AsyncHTMLSession, HTMLResponse, HTML
from products.models import Product, Category, CarName, CarMake, ExchangeRates
import datetime

url_page = "https://m.gparts.co.kr/display/showSearchDisplayList.mo?searchKeyword=&keyword=&producers_cd=&model_class_cd=&year_model=&part_cd=&maker=&carmodel=&model=&year=&part=&rowPage=100&sortType=A&idxNum=0&pageIdx="
url_product = "https://m.gparts.co.kr/goods/viewGoodsInfo.mo?goodsCd="

translator = googletrans.Translator()


def get_usd_to_krw():
    url = "http://apilayer.net/api/live?access_key=823de40ffa61b048db0ba301f21a5331&currencies=KRW&source=USD&format=1"
    return float(requests.get(url).json().get("quotes").get("USDKRW")) - 20


usd_to_krw = get_usd_to_krw()

rate = ExchangeRates.objects.first()

percentage_field = 30
if rate is not None:
    percentage_field = float(rate.percentage_field)


def get_translate(text, dest="ru", src='ko', count=1):
    if text != "":
        try:
            return translator.translate(text, src=src, dest=dest).text
        except BaseException as e:
            print("get_translate", str(e))
            if count > 5:
                print("get_translate вышло")
                return None
            time.sleep(60)
            return get_translate(text, src=src, dest=dest, count=count + 1)
    return ""


def get_translate_list(list_text, dest="ru", src='ko', count=1):
    try:
        trans_result = []
        for trans in translator.translate(list_text, src=src, dest=dest):
            trans_result.append(trans.text)
        return trans_result
    except BaseException as e:
        print("get_translate_list", str(e))
        if count > 5:
            print("get_translate вышло")
            return None
        time.sleep(60)
        return get_translate(list_text, src=src, dest=dest, count=count + 1)


async def parse_page(asession: AsyncHTMLSession, product_id: int, product_price: float):
    try:
        print(product_id)
        response: HTMLResponse = await asession.get(f"{url_product}{product_id}")
        html: HTML = response.html

        image_list = html.find("ul.info_picture img")
        image_url = []

        for image in image_list:
            image_url.append(image.attrs["src"])

        table_data = html.find("div.tableType01 table tr")

        data = []
        for row in table_data:
            value = row.find("td", first=True).text.strip()
            data.append(value)

        result = get_translate(" | ".join([f'"{i}"' for i in data])).split("|")

        if len(data) != len(result):
            result = get_translate_list(data)
        result = [i.strip().replace('»', '').replace('«', '').replace('"', '') for i in result]
        data = [i.strip().replace('»', '').replace('«', '').replace('"', '') for i in data]

        product = Product()
        product.category = (await Category.objects.aget_or_create(name=result[0]))[0]
        product.product_id = product_id
        product.fotos = image_url
        product.name_product = result[0]
        car_info = result[1].split("/")
        product.car_info = (await CarName.objects.aget_or_create(
            car_name=car_info[1],
            car_make=(await CarMake.objects.aget_or_create(make=car_info[0]))[0]
        ))[0]
        product.model_year = data[2].split("/")[0]
        product.detail_number = data[2].split("/")[1] if "없음" not in data[2].split("/")[1] else "не существует"

        product.v_i_n = data[3] if "없음" not in data[3] else "не существует"
        product.code_product = result[4]
        product.product_information = result[5]
        product.old_price = (product_price / usd_to_krw) * (1 + percentage_field / 100)
        product.price_in_won = product_price

        await product.asave()

    except BaseException as e:
        print("parse_page", str(e))


async def parse_pages(asession: AsyncHTMLSession, page=1):
    try:
        url = f"{url_page}{page}"
        print(url)
        response: HTMLResponse = await asession.get(url)
        html: HTML = response.html

        products = html.find("div.listType02 ul li")

        products_job = []
        for product in products:
            product_id = product.find("div.img a", first=True).attrs["href"][38:-4]
            product_price = product.find("div.textZone div.price", first=True).text
            product_price = product_price.replace("원", "").replace(",", "").replace(" ", "")
            product = await Product.objects.filter(product_id=product_id).afirst()
            if product is None:
                products_job.append(asyncio.create_task(parse_page(asession, product_id, float(product_price))))
            else:
                product.deleted = False
                await product.asave()

        if len(products_job) > 0:
            done, pending = await asyncio.wait(products_job, timeout=400)
            for task in pending:
                print("cancelling task", task)
                task.cancel()

        image = html.find("div.page_navi a:last img", first=True).attrs["src"]
        return image == "/images/board/next_more_btn.png"
    except BaseException as e:
        print("parse_pages", str(e))
        return None


async def main(start_page):
    out = True
    start = start_page
    start_time = time.time()

    while False is not out:
        try:
            asession = AsyncHTMLSession(loop=asyncio.get_running_loop())
            print(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
            task = asyncio.create_task(parse_pages(asession, start))
            done, pending = await asyncio.wait([task], timeout=500)
            if len(done) > 0:
                out = task.result()
            else:
                task.cancel()
                continue
            if None is out:
                time.sleep(500)
                continue
            start += 1
        except BaseException as e:
            print("main", str(e))
    print(time.time() - start_time)


class Command(BaseCommand):
    help = "Closes the specified poll for voting"

    def add_arguments(self, parser):
        parser.add_argument("--start_page", type=int, default=1)

    def handle(self, *args, **options):
        start_page = options["start_page"]
        Product.objects.update(deleted=True)
        asyncio.run(main(start_page))
