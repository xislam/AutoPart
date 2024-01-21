import asyncio
import time
import googletrans
from django.core.management.base import BaseCommand
from requests_html import AsyncHTMLSession, HTMLResponse, HTML
from products.models import Product, Category, CarName, CarMake

url_page = "https://m.gparts.co.kr/display/showSearchDisplayList.mo?searchKeyword=&keyword=&producers_cd=&model_class_cd=&year_model=&part_cd=&maker=&carmodel=&model=&year=&part=&rowPage=10&sortType=A&idxNum=0&pageIdx="
url_product = "https://m.gparts.co.kr/goods/viewGoodsInfo.mo?goodsCd="

won_to_usd = 0.00075

translator = googletrans.Translator()


def get_translate(text, dest="ru", src='ko', count=1):
    if text != "":
        try:
            return translator.translate(text, src=src, dest=dest).text
        except BaseException as err:
            print(err)
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
    except BaseException as err:
        print(err)
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
            car_make=(await CarMake.objects.aget_or_create(make=car_info[1]))[0]
        ))[0]
        product.model_year = data[2].split("/")[0]
        product.detail_number = data[2].split("/")[1] if "없음" not in data[2].split("/")[1] else "не существует"

        product.v_i_n = data[3] if "없음" not in data[3] else "не существует"
        product.code_product = result[4]
        product.product_information = result[5]
        product.old_price = (product_price + 20) * won_to_usd

        await product.asave()

    except BaseException as e:
        print("product_error", e)


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
            exist = await Product.objects.filter(product_id=product_id).aexists()
            if not exist:
                products_job.append(parse_page(asession, product_id, float(product_price)))

        if len(products_job) > 0:
            await asyncio.gather(*products_job)

        image = html.find("div.page_navi a:last img", first=True).attrs["src"]
        return image == "/images/board/next_more_btn.png"
    except BaseException as e:
        print("page_error", e)


async def main(start_page):
    asession = AsyncHTMLSession(loop=asyncio.get_running_loop())
    out = []
    start = start_page
    step = 5
    start_time = time.time()

    while False not in out:
        await asyncio.gather(*[parse_pages(asession, i) for i in range(start, start + step)])
        start = start + step

    print(time.time() - start_time)


class Command(BaseCommand):
    help = "Closes the specified poll for voting"

    def add_arguments(self, parser):
        parser.add_argument("--start_page", type=int, default=1)

    def handle(self, *args, **options):
        start_page = options["start_page"]
        asyncio.run(main(start_page))
