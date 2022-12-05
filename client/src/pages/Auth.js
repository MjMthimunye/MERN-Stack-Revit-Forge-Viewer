import axios from "axios";

async function getAccesstoken(){
    return axios.get('/token')
    .then((response) => {
        return response.data;
    })
    .catch((err) => {
        console.log(err);
    })
};

const Client = {getAccesstoken};
export default Client;