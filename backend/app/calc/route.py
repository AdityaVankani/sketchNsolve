from fastapi import APIRouter
import base64

from io import BytesIO

from PIL import Image
from scheme import ImageData
from app.calc.utils import ana_img

router = APIRouter()

@router.post('/')
async def run(data: ImageData):
    img=base64.b64decode(data.image.split(",")[1])
    # print(img)
    img_bytes=BytesIO(img)
    img1=Image.open(img_bytes)

    res=ana_img(img1,dict_of_var=data.dict_of_var)

    data=[]
    for r in res:
        data.append(r)
    print(data)
    return {
        "msg": "success",
        "data":data
    }