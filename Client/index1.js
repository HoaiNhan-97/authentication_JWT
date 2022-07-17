

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const instance = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  timeout: 3000,
  headers: {
    "Content-Type": "application/json"
  },
});

instance.interceptors.request.use(
  async function (config) {
    try {
      const listUrlNotcheckToken = [
        "/user/login",
        "/user/register",
        "/user/refreshtoken",
      ];
      if (listUrlNotcheckToken.includes(config.url)) {
        return config;
      }
      
      const { accesstoken, refreshToken } = await instance.getLocalStorageToken()
      const {userid,exp} =parseJwt(accesstoken);
      
      const isExpired = (exp - Date.now()/1000) < 0 ? true : false
      
      if(isExpired){
        console.log("expried",userid);
        const {accesstoken:newAccesstoken,refreshToken: newRefreshToken} = await refreshTokenFnc(userid,refreshToken)
        config.headers["x-access-token"] = newAccesstoken;
        await instance.setLocalStorageToken({accesstoken:newAccesstoken,refreshToken: newRefreshToken})
      }else{
        config.headers["x-access-token"] = accesstoken;
      }
      return config;
    } catch (err) {
      console.log(err);
    }
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log("after response :::");
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
   return data
  } catch (err) {
    throw err;
  }
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
const refreshTokenFnc = (userid,refreshToken) => {
  return new Promise ((resolve,reject) => {
    instance.post("/user/refreshtoken",{
      "userid":userid
    },{
      headers:{
        "x-access-refreshtoken": refreshToken
      }
    }).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err);
    })
  })
  
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
            console.log(err);
          }
        });
    });
    $("#getlist").addEventListener("click",() => {
      instance.get("/user/").then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      })
    })
  },
  start() {
    this.handleEvents();
  },
};
window.addEventListener("DOMContentLoaded", app.start());
