const express = require('express');

const app = express();

app.set('port', 5000);

app.listen(app.get('port'), () => {
    console.log('server start');
})