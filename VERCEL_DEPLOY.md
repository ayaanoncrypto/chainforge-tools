# Vercel deployment

This is a static Vite website. The repository includes `vercel.json` for the build output and client-side route fallback.

1. Copy the project to your computer or push it to your GitHub account.
2. Open a terminal in the project folder and run `pnpm install` followed by `pnpm run build`.
3. Push the folder to a GitHub repository.
4. In Vercel, select **Add New Project**, import the repository, and keep the detected Vite settings.
5. Click **Deploy**. Vercel will use `dist/public` as the static output directory.

The website uses browser-local calculations and file processing. It needs no environment variables or backend service.
