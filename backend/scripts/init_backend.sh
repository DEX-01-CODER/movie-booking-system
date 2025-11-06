#!/usr/bin/env bash
set -e

# Create venv & install deps
python -m venv .venv
. .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Start Django project if not exists
if [ ! -f "manage.py" ]; then
  django-admin startproject mbs .
fi

cd mbs
SETTINGS_FILE="mbs/settings.py"
URLS_FILE="mbs/urls.py"
cd ..

# Create apps if missing
for APP in users movies shows orders; do
  if [ ! -d "$APP" ]; then
    django-admin startapp $APP
    mkdir -p $APP/urls
    touch $APP/urls.py
    echo -e "from django.urls import path

urlpatterns = []" > $APP/urls.py
  fi
done

# Minimal settings patch (idempotent)
python - <<'PY'
from pathlib import Path
p = Path("mbs/mbs/settings.py")
txt = p.read_text()
adds = [
    "rest_framework",
    "corsheaders",
    "users","movies","shows","orders"
]
# Insert installed apps if not present
if "REST_FRAMEWORK" not in txt:
    txt = txt.replace("INSTALLED_APPS = [",
        "INSTALLED_APPS = [
    'rest_framework',
    'corsheaders',
    'users', 'movies', 'shows', 'orders',")
# Add CORS middleware
if "corsheaders.middleware.CorsMiddleware" not in txt:
    txt = txt.replace("MIDDLEWARE = [",
        "MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',")
# Allow all origins for dev
if "CORS_ALLOW_ALL_ORIGINS" not in txt:
    txt += "\nCORS_ALLOW_ALL_ORIGINS = True\n"
# Simple REST settings
if "REST_FRAMEWORK" not in txt:
    txt += "\nREST_FRAMEWORK = { 'DEFAULT_AUTHENTICATION_CLASSES': [], }\n"
p.write_text(txt)
PY

# Root urls include app urls (idempotent)
python - <<'PY'
from pathlib import Path
p = Path("mbs/mbs/urls.py")
txt = p.read_text()
imports = "from django.urls import path, include\n"
if imports not in txt:
    txt = txt.replace("from django.contrib import admin",
                      "from django.contrib import admin\n"+imports)
if "path('api/users'," not in txt:
    txt = txt.replace("urlpatterns = [",
        "urlpatterns = [\n    path('api/users/', include('users.urls')),\n    path('api/movies/', include('movies.urls')),\n    path('api/shows/', include('shows.urls')),\n    path('api/orders/', include('orders.urls')),")
p.write_text(txt)
PY

echo "✅ Backend scaffold ready. Next:"
echo "  1) source .venv/bin/activate"
echo "  2) python manage.py migrate"
echo "  3) python manage.py runserver"
