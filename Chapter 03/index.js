const { format } = require('date-fns');
const { v4: uuid } = require('uuid'); // Imports v4 of uuid

console.log(format(new Date(), 'MM/dd/yyyy\tHH:mm:ss'));

console.log(uuid());