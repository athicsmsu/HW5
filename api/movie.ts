import express from "express";
import { conn } from "../dbconnect";
import { MovieRequest } from "../model/movie_req";
import mysql from "mysql";
import { queryAsync } from "../dbconnect";

export const router = express.Router();

router.get("/", (req, res) => {
	const select = "select * from movie";

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
	const select = "select * from movie where imdbID = ?";
	
	conn.query(select, [id], (err,result)=>{
		if (err) {
			res.status(400).json(err);
            console.log("ERR400");
		} else {
			res.json(result);
		}
	});
});

router.get("/search/fields", (req, res) => {
    const imdbID = req.query.imdbID;
    const Title = req.query.Title;
    const sql = "select * from movie where" +
    "(imdbID IS NULL OR imdbID = ?) OR (Title IS NULL OR Title like ?)"
    conn.query(sql, [imdbID,"%" + Title + "%"], (err,result)=>{
        if (err) {
            res.status(400).json(err);
        } else {
            res.json(result);
        }
    });
});

router.post("/", (req, res) => {
	const movie: MovieRequest = req.body;
    const insert = "INSERT INTO movie (Title, Year, Rated , Runtime, Plot, Language, Poster, imdbRating, imdbVotes, Type)"+
	"VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"

	conn.query(insert, [
		movie.Title,
		movie.Year,
		movie.Rated,
		movie.Runtime,
		movie.Plot,
		movie.Language,
		movie.Poster,
		movie.imdbRating,
		movie.imdbVotes,
		movie.Type
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
	const select = "delete from movie where imdbID = ?";
	
	conn.query(select, [id], (err,result)=>{
		if (err) throw err;
       res
         .status(200)
         .json({ affected_row: result.affectedRows });
	});
});

router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const movie: MovieRequest = req.body;
  
    let sql = mysql.format("select * from movie where imdbID = ?", [id]);
    const result = await queryAsync(sql);

    const JsonStr = JSON.stringify(result);
    const JsonObj = JSON.parse(JsonStr);
    const movieOriginal : MovieRequest = JsonObj[0];
  
    let updateMovie = {...movieOriginal, ...movie};

    sql = "update  `movie` set `Title`=?, `Year`=?, `Rated`=?, `Runtime`=?, `Plot`=?, `Language`=?,  `Poster`=?, `imdbRating`=?, `imdbVotes`=?,`Type`=? "+ 
	"where `imdbID`= ?";
    sql = mysql.format(sql, [
        updateMovie.Title,
		updateMovie.Year,
		updateMovie.Rated,
		updateMovie.Runtime,
		updateMovie.Plot,
		updateMovie.Language,
		updateMovie.Poster,
		updateMovie.imdbRating,
		updateMovie.imdbVotes,
		updateMovie.Type,
		id
    ]);
    conn.query(sql, (err, result) => {
        if (err) throw err;
        res.status(201).json({ affected_row: result.affectedRows });
    });
});
