const express = require('express');

const app = express();

const port = process.env.PORT || 5555;

app.get('/', (req, res) => {
  res.send('Home');
});

app.listen(port, () =>
  console.log(`Server running on port ${port}, http://localhost:${port}`)
);