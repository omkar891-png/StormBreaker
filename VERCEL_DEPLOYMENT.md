# Vercel Deployment Guide for StormBreaker

This project is configured to be deployed on Vercel as a full-stack application.
- **Frontend**: Next.js (handled by `@vercel/next`)
- **Backend**: FastAPI (handled by `@vercel/python`)

## ⚠️ Important Limitations

1.  **Database (SQLite)**
    *   This project currently uses `sqlite` (a file-based database).
    *   On Vercel, the file system is ephemeral. **Data will reset whenever the server restarts.**
    *   **Recommendation**: For a permanent deployment, configure a cloud database (like Vercel Postgres, Neon, or Supabase) and update the `DATABASE_URL` in `backend/app/database.py`.

2.  **ML Service (Face Recognition)**
    *   The Face Recognition feature requires heavy libraries (`dlib`) that may not build on Vercel.
    *   **Current Setup**: The backend is configured to be lightweight. The face recognition features might fail or need to be stubbed out if the ML service isn't running separately.
    *   **Recommendation**: Deploy the ML Service to a Docker-based host (like Render or Railway) and update the backend to point to that URL.

## Deployment Steps

### Option 1: Deploy with Vercel CLI (Recommended for testing)

1.  **Install Vercel CLI**:
    ```bash
    npm i -g vercel
    ```

2.  **Login**:
    ```bash
    vercel login
    ```

3.  **Deploy**:
    Run this command from the root `StormBreaker` directory:
    ```bash
    vercel
    ```
    - Follow the prompts (Keep default settings).
    - It will detect `vercel.json` and configure the build.

### Option 2: Deploy via GitHub

1.  Push your code to a GitHub repository.
2.  Go to [Vercel Dashboard](https://vercel.com/dashboard) -> **Add New Project**.
3.  Import your repository.
4.  **Framework Preset**: Select "Other" or let it detect.
5.  **Root Directory**: Keep as `./`.
6.  **Build Command**: You might need to override this if auto-detection fails, but `vercel.json` should handle it.
7.  Click **Deploy**.

## Environment Variables

If you switch to a cloud database or external ML service, set these in Vercel > Settings > Environment Variables:

- `DATABASE_URL`: `postgresql://user:pass@host/db` (if using Postgres)
- `ML_SERVICE_URL`: `https://your-ml-service.onrender.com` (if hosted externally)
- `SECRET_KEY`: Your JWT secret key

## Troubleshooting

- **404 on /api**: Check the `vercel.json` routes.
- **500 Errors**: Check the Function Logs in Vercel Dashboard.
- **Missing Modules**: Ensure `backend/requirements.txt` is up to date.

## Project Structure for Vercel

```
StormBreaker/
├── vercel.json        # Routing configuration
├── frontend/          # Next.js App
│   ├── package.json
│   └── ...
├── backend/           # FastAPI App
│   ├── requirements.txt
│   ├── app/
│   │   └── main.py
│   └── ...
```
