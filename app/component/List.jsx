export default function UserList({users, onDelete, onEdit}) {
    if (!users || users.length === 0) {
        return null;
    }

    return (
        <ul className="space-y-3 w-full">
            {users.map((user, index) => (
                <li key={index} className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="flex flex-col">
                            <span className="font-semibold text-slate-900">{user.name}</span>
                            <span className="text-sm text-slate-500 mt-1">Student</span>
                        </div>
                        <div className="ml-2">
                            <span className="text-xs inline-block bg-gray-100 text-slate-700 px-2 py-1 rounded">Grade: {user.grade || '—'}</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button 
                            onClick={() => onEdit(index)}
                            className="text-sm bg-amber-400 hover:bg-amber-500 text-white px-3 py-1 rounded">Edit</button>
                        <button 
                            onClick={() => onDelete(index)}
                            className="text-sm bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded">Delete</button>
                    </div>
                </li>
            ))}
        </ul>
    );
}