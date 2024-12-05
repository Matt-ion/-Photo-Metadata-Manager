import os
import shutil
from pathlib import Path
import psycopg2
from psycopg2 import sql

def reset_database():
    print("Starting database reset...")
    BASE_DIR = Path(__file__).resolve().parent

    # Paths
    migrations_path = BASE_DIR / 'photos' / 'migrations'
    media_path = BASE_DIR / 'media'

    # PostgreSQL Configuration
    DB_NAME = "photometadata"
    DB_USER = "postgres"
    DB_PASSWORD = "MChilletR2003"
    DB_HOST = "localhost"
    DB_PORT = "5432"

    # Superuser Configuration
    SUPERUSER_USERNAME = "admin"
    SUPERUSER_EMAIL = "admin@example.com"
    SUPERUSER_PASSWORD = "password"

    # Step 1: Remove migration files
    print("Removing migration files...")
    if migrations_path.exists():
        for file in migrations_path.iterdir():
            if file.name != '__init__.py' and file.is_file():
                print(f"Deleting migration file: {file}")
                file.unlink()
    else:
        print("No migrations folder found for the app 'photos'.")

    # Step 2: Drop and recreate the PostgreSQL database
    print("Resetting PostgreSQL database...")
    try:
        conn = psycopg2.connect(dbname="postgres", user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT)
        conn.autocommit = True
        cursor = conn.cursor()

        # Terminate active connections
        cursor.execute(sql.SQL("""
            SELECT pg_terminate_backend(pid)
            FROM pg_stat_activity
            WHERE datname = %s
        """), [DB_NAME])

        # Drop and recreate the database
        cursor.execute(sql.SQL("DROP DATABASE IF EXISTS {}").format(sql.Identifier(DB_NAME)))
        cursor.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(DB_NAME)))
        print(f"Database {DB_NAME} reset successfully.")

        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error resetting database: {e}")
        return

    # Step 3: Remove media files
    print("Removing media files...")
    if media_path.exists():
        for file in media_path.glob("**/*"):
            if file.is_file():
                print(f"Deleting file: {file}")
                file.unlink()
        for folder in media_path.glob("**/"):
            if folder.is_dir():
                print(f"Deleting folder: {folder}")
                shutil.rmtree(folder)
        # Finally, delete the media folder itself
        print(f"Deleting media folder: {media_path}")
        shutil.rmtree(media_path)
    else:
        print("No media folder found.")

    # Step 4: Reapply migrations
    print("Recreating database schema...")
    os.system("python manage.py makemigrations")
    os.system("python manage.py migrate")

    # Step 5: Auto-create superuser
    print("Creating superuser...")
    create_superuser_command = (
        f"python manage.py shell -c \""
        f"from django.contrib.auth.models import User; "
        f"User.objects.create_superuser('{SUPERUSER_USERNAME}', '{SUPERUSER_EMAIL}', '{SUPERUSER_PASSWORD}') "
        f"if not User.objects.filter(username='{SUPERUSER_USERNAME}').exists() else print('Superuser already exists.')\""
    )
    os.system(create_superuser_command)

    print("Database reset complete!")


if __name__ == "__main__":
    reset_database()
