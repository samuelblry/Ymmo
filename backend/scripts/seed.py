from app.database import SessionLocal
from app.seed import seed_database


def main() -> None:
    with SessionLocal() as db:
        seed_database(db)
    print("Seed Ymmo termine.")


if __name__ == "__main__":
    main()
