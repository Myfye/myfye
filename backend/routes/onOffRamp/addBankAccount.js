import axios from 'axios';

const options = {
  method: 'POST',
  url: 'https://api.blindpay.com/v1/instances/in_000000000000/receivers/re_000000000000/bank-accounts',
  headers: {'Content-Type': 'application/json', Authorization: 'Bearer YOUR_SECRET_TOKEN'},
  data: {
    type: 'wire',
    name: 'Bank Account Name',
    pix_key: '14947677768',
    beneficiary_name: 'Individual full name or business name',
    routing_number: '012345678',
    account_number: '1001001234',
  }
};

try {
  const { data } = await axios.request(options);
  console.log(data);
} catch (error) {
  console.error(error);
}