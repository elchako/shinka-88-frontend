import React from "react"
import { createRoot, hydrateRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { App } from "./App"
import { store } from "./app/store"
import "./null.css"
import "./index.css"
import "./common.scss" // Design system styles

const container = document.getElementById("root")

if (container) {
  const app = (
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  )
  if (container.childElementCount) hydrateRoot(container, app)
  else createRoot(container).render(app)
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
