const express = require("express");
const axios = require("axios");
const { create } = require("xmlbuilder2");
const https = require("https");
require("dotenv").config();

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

  const server = process.env.SERVER_URL;

  console.log(`Server: ${server}`)
  
  try {
    const userData = {
      User: {
        login_id: process.env.LOGIN,
        password: process.env.PASSWORD,
      },
    };

    const { headers: resHeaders } = await instance.post(
      `${server}login`,
      userData
    );

    const reqHeaders = {
      "bs-session-id": resHeaders["bs-session-id"],
    };

    const { data } = await instance.get(`${server}${url}`, {
      headers: reqHeaders,
    });

    const doc = create({ responseXml: data });
    const finalXml = doc.end();

    response.set("Content-Type", "text/xml");
    response.send(finalXml);

    return;
  } catch (error) {
    if (error.response.data) {
      response.send(error.response.data);
    } else {
      response.send(error);
    }
    return;
  }
});

// Request Template
// http://localhost:8081/test/?url=device_groups
const listener = app.listen(8081, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
