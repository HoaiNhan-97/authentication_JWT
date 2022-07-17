const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const instance = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  timeout: 3000,
  headers: {
    "Content-Type": "application/json",
  },
});
instance.interceptors.request.use(
  async function (config) {
    const { url } = config;
    const listUrlNotcheckToken = [
      "/user/login",
      "/user/register",
      "/user/refreshtoken",
    ];
    if (listUrlNotcheckToken.includes(url)) {
      return config;
    }
    const { accesstoken } = await instance.getLocalStorageToken();
    config.headers["x-access-token"] = accesstoken;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  async function (response) {
    const { url } = response.config;
    const listUrlNotcheckToken = [
      "/user/login",
      "/user/register",
      "/user/refreshtoken",
    ];
    if (listUrlNotcheckToken.includes(url)) {
      return response;
    }
    const { status, message } = response.data;
    if (status === 401 && message === "jwt expired") {
      
      const { accesstoken, refreshToken } = await instance.getLocalStorageToken();
      const { userid} = parseJwt(accesstoken);
      console.log("expried", userid);
      const { accesstoken: newAccesstoken, refreshToken: newRefreshToken } = await refreshTokenFnc(userid, refreshToken);
      response.config.headers["x-access-token"] = newAccesstoken;
      await instance.setLocalStorageToken({accesstoken:newAccesstoken,refreshToken: newRefreshToken})
      return instance(response.config);
    }
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
instance.setLocalStorageToken = async ({ accesstoken, refreshToken }) => {
  try {
    window.localStorage.setItem(
      "token",
      JSON.stringify({ accesstoken, refreshToken })
    );
  } catch (err) {
    throw err;
  }
};
instance.getLocalStorageToken = async () => {
  try {
    const data = JSON.parse(window.localStorage.getItem("token"));
    return data;
  } catch (err) {
    throw err;
  }
};

const refreshTokenFnc = (userid, refreshToken) => {
  return new Promise((resolve, reject) => {
    instance
      .post(
        "/user/refreshtoken",
        {
          userid: userid,
        },
        {
          headers: {
            "x-access-refreshtoken": refreshToken,
          },
        }
      )
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
const app = {
  handleEvents() {
    $("#login").addEventListener("click", () => {
      instance
        .post("/user/login", {
          username: "nhan21@gmail.com",
          password: "NgHoainHan123!@#",
        })
        .then(async (res) => {
          try {
            const { accesstoken, refreshToken } = res.data;
            instance.setLocalStorageToken({ accesstoken, refreshToken });
          } catch (err) {
            console.log("login request ::: ", err);
          }
        });
    });
    $("#getlist").addEventListener("click", () => {
      instance
        .get("/user/")
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  },
  start() {
    this.handleEvents();
  },
};
window.addEventListener("DOMContentLoaded", app.start());
