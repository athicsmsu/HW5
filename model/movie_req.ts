export interface MovieRequest {
    imdbID:     number;
    Title:      string;
    Year:       number;
    Rated:      number;
    Runtime:    string;
    Plot:       string;
    Language:   string;
    Poster:     string;
    imdbRating: number;
    imdbVotes:  string;
    Type:       string;
    creator:    Person[];
    stars:      Person[];
}

export interface Person {
    pid:      number;
    name:     string;
    lastname: string;
    url:      string;
    age:      string;
    detail:   string;
}