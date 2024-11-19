# Novelty Reviewer

An AI-powered novelty reviewer to faciliate the process of novelty detection in scientific papers.

## Development

### Frontend

Just go to the web folder and run the following commands:

```bash
cd web
npm install
npx vite
```

Then open your browser and go to `http://localhost:5173` or other URL suggested by `vite`.

### Backend

In fact, we don't have a real backend yet. All requests can be directly sent to other web services.

The translate, llama model, and other services can be started separately. Please refer to the README in the `api-server` folder.


# Updates

## 0.6.0

- Add new template for loading taxonomy
- Fixed layout
- Fixed import loading issue

## 0.5.0

- Add basic functions