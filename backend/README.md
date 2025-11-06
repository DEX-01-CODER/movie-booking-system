# Backend (Django + DRF)

Initialize project and apps via the script:

```bash
bash scripts/init_backend.sh
source .venv/bin/activate
python manage.py runserver
```

After running the script you'll have apps:
- `users` (auth/profile)
- `movies` (catalog + reviews)
- `shows` (theaters, showtimes, prices)
- `orders` (order, payment, ticket)
