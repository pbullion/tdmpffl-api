const { Router } = require("express");
const pool = require("../db");

const router = Router();

router.get("/history", (request, response, next) => {
    pool.query("SELECT * FROM tdmpffl_history", (err, res) => {
        if (err) return next(err);
        console.log(res.rows);
        response.json(res.rows);
    });
});