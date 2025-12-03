export default function Buttons({name, onClick}) {
    return (
        <>
        <button onClick={onClick} className="bg-blue-600 hover:bg-blue-700 text-neutral-50 font-medium py-2 px-4 rounded-md transition-colors duration-200">
          {name}
        </button>
        </> 
    );
}