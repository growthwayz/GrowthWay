from fastapi import FastAPI


app = FastAPI(title="GrowthWay API")


@app.get("/")
async def root():
    return {"message": "GrowthWay API is running"}
