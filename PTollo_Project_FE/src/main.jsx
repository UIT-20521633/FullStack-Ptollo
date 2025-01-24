import { createRoot } from "react-dom/client";
import App from "./App.jsx";
// Import CssBaseline from MUI
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
// import { ThemeProvider } from "@mui/material/styles";
// import theme from "./theme";
// Cấu hình redux
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
//Cấu hình react - toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//Cấu hình material-ui-confirm
import { ConfirmProvider } from "material-ui-confirm";

//Cấu hình react-router-dom với BrowserRouter
import { BrowserRouter } from "react-router-dom";

//Cấu hình Redux-Persist
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
const persistor = persistStore(store);

//Kỹ thuật Inject store: là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi react component như file authorizeAxios hiện tại
import { injectStore } from "./utils/authorizeAxios.js";
injectStore(store);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      {/* <ThemeProvider theme={theme}> */}
      <BrowserRouter basename="/">
        <ConfirmProvider
          defaultOptions={{
            allowClose: false,
            dialogProps: { maxWidth: "xs" },
            cancellationButtonProps: { color: "info", variant: "outlined" },
            confirmationButtonProps: { color: "error", variant: "outlined" },
            buttonOrder: ["confirm", "cancel"],
          }}>
          <GlobalStyles styles={{ a: { textDecoration: "none" } }} />
          <CssBaseline />
          <App />
          <ToastContainer
            position="bottom-left"
            theme="colored"
            autoClose="1000"
          />
        </ConfirmProvider>
      </BrowserRouter>
      {/* </ThemeProvider> */}
    </PersistGate>
  </Provider>
);
