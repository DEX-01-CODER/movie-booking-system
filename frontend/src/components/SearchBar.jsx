export default function SearchBar({value, onChange}) {
    return (
        <div className="search-bar-wrapper">
            <input 
                className="search-input" 
                type="text"
                placeholder="Search Bar"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}