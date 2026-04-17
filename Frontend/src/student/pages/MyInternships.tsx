import { useState, useEffect } from "react";
import { Briefcase, GraduationCap, Clock, IndianRupee, Calendar, CheckCircle } from "lucide-react";
// @ts-ignore
import api from "../../config/api";

function MyInternships() {
  const [internships, setInternships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchInternships(); }, []);

  const fetchInternships = async () => {
    try {
      const response = await api.get('/student/internships');
      setInternships(response.data.data || []);
    } catch (error) {
      console.error("Error fetching internships:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-gray-800">My Internships</h1>
        <p className="text-gray-500 text-xs">Your enrolled internship programs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-xs text-gray-500">Total Enrolled</p>
          <p className="text-xl font-bold text-gray-800">{internships.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-xs text-gray-500">Active</p>
          <p className="text-xl font-bold text-[#FA8128]">{internships.filter(i => i.status === 'Paid').length}</p>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-[#FA8128] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-500 text-sm">Loading internships...</p>
          </div>
        ) : internships.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <Briefcase size={40} className="text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-600">No internships enrolled yet</p>
            <p className="text-xs text-gray-400 mt-1">Enroll in an internship program to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {internships.map((item) => (
              <div key={item._id} className="p-4 sm:p-5">
                <div className="flex items-start gap-4">
                  {item.program?.thumbnail ? (
                    <img src={item.program.thumbnail} alt={item.program.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <GraduationCap size={28} className="text-[#FA8128]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{item.program?.title}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-600 shrink-0 flex items-center gap-1">
                        <CheckCircle size={10} /> {item.status}
                      </span>
                    </div>
                    {item.program?.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.program.description}</p>
                    )}
                    <div className="flex flex-wrap gap-3 mt-3">
                      {item.program?.duration && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
                          <Clock size={12} className="text-[#FA8128]" />
                          {item.program.duration}
                        </div>
                      )}
                      {item.amount > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
                          <IndianRupee size={12} className="text-[#FA8128]" />
                          ₹{item.amount.toLocaleString('en-IN')} paid
                        </div>
                      )}
                      {item.enrollmentDate && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
                          <Calendar size={12} className="text-[#FA8128]" />
                          Enrolled: {formatDate(item.enrollmentDate)}
                        </div>
                      )}

                      {item.validUntil && (
                        <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                          <Calendar size={12} />
                          Valid till {formatDate(item.validUntil)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyInternships;
