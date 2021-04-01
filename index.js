const express = require("express");
const axios = require("axios");
const { create, convert } = require("xmlbuilder2");
const fetch = require("node-fetch");
const https = require("https");

const app = express();
app.use(express.json());

app.get("/test/", async (request, response) => {
  const instance = axios.create({
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });

  // const baseUrl = request.params.url;
  const baseUrl = request.query.url;
  const url = baseUrl.substring(1, baseUrl.length - 1);

  const server = "https://20.195.101.222/api/";
  console.log(url);
  //   const headers = {
  //     "Content-Type": "application/json",
  //     "X-API-Key": process.env.ARCEO_SCAN_API_KEY
  //   };
  //   const data = await axios.get(
  //     `https://staging-dp.arceo.dev/api/v1/newaf_report/${reportId}`,
  //     { headers }
  //   );

  try {
    const userData = {
      User: {
        login_id: "cenmetrixa",
        password: "cenmtx@1",
      },
    };
    // const loginHeader = {
    //   accept: "application/json",
    //   "Content-Type": "application/json",
    // };

    const { headers: resHeaders } = await instance.post(
      `${server}login`,
      userData
      //   loginHeader
    );

    const reqHeaders = {
      "bs-session-id": resHeaders["bs-session-id"],
    };
    // console.log(reqHeaders);
    const { data } = await instance.get(`${server}${url}`, {
      headers: reqHeaders,
    });

    const doc = create({ responseXml: data });
    const finalXml = doc.end();

    response.set("Content-Type", "text/xml");
    response.send(finalXml);
    // console.log(data);
    return;
  } catch (error) {
    // console.log(error.request);
    if (error.response.data) {
      // console.log(error.response.data);
      response.send(error.response.data);
    } else {
      // console.log(error);
      response.send(error);
    }
    return;
  }
});

// listen for requests :)
// const listener = app.listen(process.env.PORT, () => {
//   console.log("Your app is listening on port " + listener.address().port);
// });
// Request Template
// http://localhost:8081/test/?url=%22api/device_groups%22
const listener = app.listen(8081, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
