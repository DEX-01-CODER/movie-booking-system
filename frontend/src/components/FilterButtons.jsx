export default function FilterButtons({ filter, setFilter}) {
    return (
        <div className="filter-tabs">
            <button
                className={filter === "new" ? "tab active" : "tab"}
                onClick={() => setFilter("new")}
            >
                New Movies
            </button>
            <button
                className={filter === "upcoming" ? "tab active" : "tab"}
                onClick={() => setFilter("upcoming")}
            >
                Upcoming Movies
            </button>
            <button
                className={filter === "all" ? "tab active" : "tab"}
                onClick={() => setFilter("all")}
            >
                All Movies
            </button>
        </div>
    );
}