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

  console.log(`Server: ${server}`);

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

    const { data } = await instance.post(
      `${server}${url}`,
      {
        monitoring_permission: true,
      },
      {
        headers: reqHeaders,
      }
    );

    const doc = create({ responseXml: decodeResponse(data) });
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

const decodeResponse = (data) => {
  const temp = data.DoorStatusCollection.rows.map((door) => {
    return {
      id: door.door_id.id,
      opened: door.opened,
      alarm: door.alarm,
    };
  });
  console.log(temp);
  return temp;
};

// Request Template
// http://localhost:8081/test/?url="doors/status"
const listener = app.listen(8081, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
