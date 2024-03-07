import express from "express";
import { conn } from "../dbconnect";
import { PersonRequest } from "../model/person_req";
import mysql from "mysql";
import { queryAsync } from "../dbconnect";

export const router = express.Router();

router.get("/", (req, res) => {
	const select = "select * from person";
	
	conn.query(select, (err,result)=>{
		if (err) {
			res.status(400).json(err);
			console.log("ERR400");
		} else {
			res.json(result);
		}
	});
});

router.get("/:id", (req, res) => {
	const id = req.params.id;
	const select = "select * from person where pid = ?";
	
	conn.query(select, [id], (err,result)=>{
		if (err) {
			res.status(400).json(err);
            console.log("ERR400");
		} else {
			res.json(result);
		}
	});
});

router.post("/", (req, res) => {
	const person: PersonRequest = req.body;
    const insert = "INSERT INTO person (name, lastname, url, age, detail)"+
	"VALUES (?, ?, ?, ?, ?)"

	conn.query(insert, [
		person.name,
        person.lastname,
        person.url,
        person.age,
        person.detail
	], (err,result,fields)=>{
        if (err) throw err;
        res.status(201).json({ 
            affected_row: result.affectedRows, 
            last_idx: result.insertId 
        });
    });
});

router.delete("/:id", (req, res) => {
	const id = req.params.id;
	const select = "delete from person where pid = ?";
	
	conn.query(select, [id], (err,result)=>{
		if (err) throw err;
       res
         .status(200)
         .json({ affected_row: result.affectedRows });
	});
});


router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const person: PersonRequest = req.body;
  
    let sql = mysql.format("select * from person where pid = ?", [id]);
    const result = await queryAsync(sql);

    const JsonStr = JSON.stringify(result);
    const JsonObj = JSON.parse(JsonStr);
    const personOriginal : PersonRequest = JsonObj[0];
  
    let updateMovie = {...personOriginal, ...person};

    sql = "update  `person` set `name`=?, `lastname`=?, `url`=?, `age`=?, `detail`=?"+ 
	"where `pid`= ?";
    sql = mysql.format(sql, [
        updateMovie.name,
        updateMovie.lastname,
        updateMovie.url,
        updateMovie.age,
        updateMovie.detail,
		id
    ]);
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.status(201).json({ affected_row: result.affectedRows });
    });
});