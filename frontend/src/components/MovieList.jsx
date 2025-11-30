import MovieCard from "./MovieCard"

export default function MovieList({movies, onOpenModal}) {
    return (
        <div className="movie-list">
            {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} onOpenModal={onOpenModal}/>
            ))}
        </div>
    );
}