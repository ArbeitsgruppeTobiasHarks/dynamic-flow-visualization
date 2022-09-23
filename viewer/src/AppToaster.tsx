import { Toaster } from "@blueprintjs/core"
import { createRoot } from "react-dom/client"

let AppToaster: Toaster

createRoot(document.getElementById('toaster')!).render(
  <Toaster
    ref={(instance) => {
      AppToaster = instance!
    }}
  />
)

export const getAppToaster = () => AppToaster