from sqlalchemy import text

from app.database import SessionLocal


def main() -> None:
    with SessionLocal() as db:
        version = db.execute(text("select version()")).scalar_one()
    print(version)


if __name__ == "__main__":
    main()
