from pydantic import BaseModel


class ImageData(BaseModel):
    image: str
    dict_of_var: dict
    