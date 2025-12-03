export default function Inputs({name, grade, setName, setGrade}) {
    return (
        <>
        <div className="space-y-2">
          <label className="text-sm text-slate-700">Student name</label>
          <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Full name" 
              className="w-full rounded-md border border-gray-200 px-3 py-2 bg-white text-slate-800 shadow-sm"
          />

          <label className="text-sm text-slate-700">Grade</label>
          <input 
              type="text" 
              value={grade} 
              onChange={(e) => setGrade(e.target.value)}
              placeholder="e.g. 1st, 2nd, 10th" 
              className="w-full rounded-md border border-gray-200 px-3 py-2 bg-white text-slate-800 shadow-sm"
          />
        </div>
        </>
    );
}