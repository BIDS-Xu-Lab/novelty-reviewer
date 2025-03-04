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

## 0.7.4

- Add load sample

## 0.7.3

- Fixed toolbar border bug
- Updated favicon

## 0.7.2

- Fixed selection color bug
- Updated style of hovering

## 0.7.1

- Add setting for translation service
- Add conclusion translation

## 0.7.0

- Add "temperature slider" for AI model
- Add "system role" prompt for AI model

## 0.6.8

- Add try-catch for importing JSON config
- Fixed light mode bg color
- Updated colors
- Updated filter search box

## 0.6.5

- Added close button for setting panel
- Added tooltip for save button
- Fixed AI helper layout bug
- Fixed translation error message bug

## 0.6.3

- Updated dark mode for night reading

## 0.6.2

- Updated AI model selection
- Fixed footer text
- Updated visual layout
- Updated default openai model

## 0.6.0

- Add new template for loading taxonomy
- Add dependency for loading prompt
- Fixed layout
- Fixed import loading issue

## 0.5.0

- Add basic functions