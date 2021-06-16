import { useState, useEffect } from "react";
import { checkAuth } from "@utils/auth";

export const Header = () => {
  const [authorized, setAuthorized] = useState(0);

  useEffect(() => {
    checkAuth(setAuthorized);
  }, []);
  return (
    <header className="p-3 mb-3 border-bottom">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-between ">
          <a
            href="/"
            className="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none"
          >
            <b>Blog101</b>
          </a>

          <div className="dropdown text-end">
            <a
              href="#"
              className="d-block link-dark text-decoration-none dropdown-toggle"
              id="dropdownUser1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="/avatar.png"
                alt="mdo"
                width="32"
                height="32"
                className="rounded-circle"
              />
            </a>
            <ul
              className="dropdown-menu text-small"
              aria-labelledby="dropdownUser1"
            >
              {authorized === 2 && (
                <>
                  <li>
                    <a className="dropdown-item" href="/admin/articles">
                      Manage Articles
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/admin/users">
                      Manage Users
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/admin/comments">
                      Manage Comments
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/admin/tags">
                      Manage Tags
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                </>
              )}

              {authorized > 0 ? (
                <li>
                  <a className="dropdown-item" href="/logout">
                    Log out
                  </a>
                </li>
              ) : (
                <li>
                  <a className="dropdown-item" href="/login">
                    Log In
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
