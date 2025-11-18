import os
from typing import Optional

import dotenv
from sqlalchemy import create_engine, URL, Engine
from sqlalchemy.orm import sessionmaker

dotenv.load_dotenv()

PostgresSession: Optional[sessionmaker] = None
url_object: Optional[URL] = None
engine: Optional[Engine] = None


def connect():
    global PostgresSession, url_object, engine

    if PostgresSession is not None:
        return

    url_object = URL.create(
        drivername="postgresql+psycopg2",
        username=os.getenv('POSTGRES_USER'),
        password=os.getenv('POSTGRES_PASSWORD'),
        host=os.getenv('POSTGRES_HOST'),
        port=os.getenv('POSTGRES_PORT'),
        database=os.getenv('POSTGRES_DB')
    )

    engine = create_engine(
        url_object,
        pool_size=10,
        max_overflow=20,
        pool_timeout=30,
        pool_recycle=1800,
    )

    PostgresSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)


connect()
