const express = require("express");
const axios = require("axios");
const { create, convert } = require("xmlbuilder2");

const app = express();
app.use(express.json());

app.get("/test/:url", (request, response) => {
  const url = request.params.url;

  //   const headers = {
  //     "Content-Type": "application/json",
  //     "X-API-Key": process.env.ARCEO_SCAN_API_KEY
  //   };
  //   const data = await axios.get(
  //     `https://staging-dp.arceo.dev/api/v1/newaf_report/${reportId}`,
  //     { headers }
  //   );

  const data = {
    PFS_Quote_Import: {
      "@xmlns": "https://integration.ipfs.com/IntegrationQuoting",
      Header: {
        System: "MCGCYB",
      },
      Security: {
        Login: "mcgowancyber",
        AccessCode: "69C6Z3C",
      },
    },
  };

  const doc = create(data);
  const finalXml = doc.end();

  response.set("Content-Type", "text/xml");
  response.send(finalXml);
});

// listen for requests :)
// const listener = app.listen(process.env.PORT, () => {
//   console.log("Your app is listening on port " + listener.address().port);
// });
const listener = app.listen(8081, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
