const router = require('express').Router();



router.get('/', (req, res) => {
    return res.json({ message: "This is the general endpoint." });
});




module.exports = router;