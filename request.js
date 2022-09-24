const axios = require('axios');
const sendRequest = async () => {
  const endpoint =  'http://localhost:5000/graphql'
  const headers = {
    "content-type": "application/json",
  };
  const graphqlQuery = {
    //just copy paste the query you write in graphql explorer
    "query": ` {
      author(id: 2){
      name
      books{
        name
      }
    }} `,
    "variables": {}
};
  const response = await axios({
    url: endpoint,
    method: 'post',
    headers: headers,
    data: graphqlQuery
  });
  console.log(JSON.stringify(response.data)); // data
}


sendRequest();