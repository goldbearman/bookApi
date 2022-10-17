const exptress = require('express');
const router = exptress.Router();

router.get('/', (req, res) => {
  const {url} = req;
  console.log(url);
  res.json({url});
});

module.exports = router;