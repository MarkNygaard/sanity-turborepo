import React from "react";

import { DevApp } from "./DevApp";

import "./App.css";

// For development, we'll use the DevApp which works without TypeScript conflicts
// When deploying to production, this can be switched to use full SanityApp wrapper

export function App() {
  return <DevApp />;
}

export default App;
