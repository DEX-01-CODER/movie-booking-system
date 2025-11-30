import {useEffect, useState } from 'react'
import '../styles/MovieCatalog.css'
import SearchBar from '../components/SearchBar'
import FilterButtons from '../components/FilterButtons'
import MovieList from '../components/MovieList'
import api from "../api"

const Catalog = () => {
    const [movies, setMovies] = useState([]);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    useEffect(() => {
    api.get("/api/movies/")
      .then(res => setMovies(res.data))
      .catch(err => console.error(err));
    }, []);

    const filteredMovies = movies.filter((movie) => {
        const matchFilter = filter === "all" || movie.status.toLowerCase() === filter.toLowerCase();
        const matchSearch = movie.title.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    return (
        <div className='catalog-container'>
            <h1 className='site-Logo'>Movie Booking Site</h1>

            <SearchBar value={search} onChange={setSearch}/>
            <FilterButtons filter={filter} setFilter={setFilter}/>

            <MovieList movies={filteredMovies}/>
        </div>
    );
}

export default Catalog;