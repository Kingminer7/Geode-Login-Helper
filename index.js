const axios = require('axios');
const readline = require('readline');

function waitForEnter() {
  return new Promise(resolve => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.on('line', () => {
      rl.close();
      resolve();
    });
  });
}

(async () => {
  try {
    console.clear();

    await axios.post('https://api.geode-sdk.org/v1/login/github', {}, {
      headers: {}
    }).then(async response => {
      const uuid = response.data.payload.uuid; // Assuming the UUID is returned in the response body
      console.log("UUID: " + uuid);
      console.log("Code: " + response.data.payload.code);
      console.log("Go to " + response.data.payload.uri + " and enter the code.");
      console.log("Press enter to continue...");

      await waitForEnter();

      return axios.post('https://api.geode-sdk.org/v1/login/github/poll', { uuid }, {
        headers: {}
      });
    }).then(response => {
      const token = response.data.payload;
      console.log("Your token is " + token);
    }).catch(error => {
      console.error('Error occurred:', error);
    });
  } catch (error) {
    console.error('Error occurred:', error);
  }
})();
