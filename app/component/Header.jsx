export default function Header({title}) {
    return (
        <header className="mb-8">
            <h1 className="text-4xl font-bold text-neutral-100">{title}</h1>
            <p className="text-sm text-neutral-500 mt-2">Track, rate, and manage your movie watchlist</p>
        </header>
    );
}