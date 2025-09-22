import styles from "./App.css";
import classNames from "classnames/bind";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import routes from "./routes/routes.js";
import Header from "./component/Header/Header.js";
import { usePersistedUser } from "./hooks/usePersistedUser";
import SocketManager from "./hooks/SocketManager.js";
import "bootstrap/dist/css/bootstrap.min.css";

const cx = classNames.bind(styles);

function App() {
  usePersistedUser();
  return (
    <div className={cx("App")}>
      <SocketManager />
      <Router>
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                <>
                  {route.isHeader && <Header />}
                  {route.Element}
                </>
              }
            />
          ))}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
