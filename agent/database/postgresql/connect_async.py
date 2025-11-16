import os
from typing import Optional

from sqlalchemy import URL
from sqlalchemy.ext.asyncio.engine import create_async_engine, AsyncEngine
from sqlalchemy.ext.asyncio import async_sessionmaker


PostgresAsyncSession: Optional[async_sessionmaker] = None
url_object: Optional[URL] = None
async_engine: Optional[AsyncEngine] = None


def async_connect():
    global PostgresAsyncSession, url_object, async_engine

    if PostgresAsyncSession is not None:
        return

    url_object = create_async_database_url()

    async_engine = create_async_engine(
        url_object,
        pool_size=10,
        max_overflow=20,
        pool_timeout=30,
        pool_recycle=1800,
    )

    PostgresAsyncSession = async_sessionmaker(autocommit=False, autoflush=False, bind=async_engine)


def create_async_database_url():
    return URL.create(
        drivername="postgresql+asyncpg",
        username=os.getenv('POSTGRES_USER'),
        password=os.getenv('POSTGRES_PASSWORD'),
        host=os.getenv('POSTGRES_HOST'),
        port=os.getenv('POSTGRES_PORT'),
        database=os.getenv('POSTGRES_DB')
    )


async_connect()
