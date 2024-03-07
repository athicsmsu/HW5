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
    const Title = req.query.Title;
    const sql = "SELECT movie.*, " +
        "GROUP_CONCAT(DISTINCT CONCAT_WS(' ', creators.pid, Cperson.name, Cperson.lastname, Cperson.url, Cperson.age, Cperson.detail) SEPARATOR ';') AS creators, " +
        "GROUP_CONCAT(DISTINCT CONCAT_WS(' ', stars.pid, Sperson.name, Sperson.lastname, Sperson.url, Sperson.age, Sperson.detail) SEPARATOR ';') AS stars " +
        "FROM movie " +
        "LEFT JOIN creators ON movie.imdbID = creators.imdbID " +
        "LEFT JOIN stars ON movie.imdbID = stars.imdbID " +
        "LEFT JOIN person ON person.pid = creators.pid OR person.pid = stars.pid " +
		"LEFT JOIN person AS Cperson ON Cperson.pid = creators.pid " +
		"LEFT JOIN person AS Sperson ON Sperson.pid = stars.pid " +
        "WHERE movie.Title IS NULL OR movie.Title LIKE ? GROUP BY movie.imdbID";

    conn.query(sql, ["%" + Title + "%"], (err, result) => {
        if (err) {
            res.status(400).json(err);
        } else {
            // จัดรูปแบบข้อมูลให้เป็นโครงสร้าง JSON ตามที่ต้องการ
            const movies = result.map((row: { imdbID: any; Title: any; Year: any; Rated: any; Runtime: any; Plot: any; Language: any; Poster: any; imdbRating: any; imdbVotes: any; Type: any; creators: string; stars: string; }) => {
                return {
                    imdbID: row.imdbID,
                    Title: row.Title,
                    Year: row.Year,
                    Rated: row.Rated,
                    Runtime: row.Runtime,
                    Plot: row.Plot,
                    Language: row.Language,
                    Poster: row.Poster,
                    imdbRating: row.imdbRating,
                    imdbVotes: row.imdbVotes,
                    Type: row.Type,
                    creators: row.creators ? row.creators.split(';').map(creator => {
                        const [pid, name, lastname, url, age, detail] = creator.split(' ');
                        return { pid, name, lastname, url, age, detail };
                    }) : [],
                    stars: row.stars ? row.stars.split(';').map(star => {
                        const [pid, name, lastname, url, age, detail] = star.split(' ');
                        return { pid, name, lastname, url, age, detail };
                    }) : []
                };
            });
            res.json(movies);
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
