import React from 'react';
import { Project, ProjectStatus } from '@/utils/types';

interface ActiveProjectsTableProps {
  projects: Project[];
}

const getStatusClass = (status: ProjectStatus) => {
  switch (status) {
    case 'On Track': return 'bg-green-100 text-green-700';
    case 'At Risk': return 'bg-yellow-100 text-yellow-700';
    case 'Delayed': return 'bg-red-100 text-red-700';
    case 'Completed': return 'bg-blue-100 text-blue-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getProgressClass = (status: ProjectStatus) => {
    switch (status) {
        case 'On Track': return 'bg-blue-500';
        case 'At Risk': return 'bg-yellow-500';
        case 'Delayed': return 'bg-red-500';
        case 'Completed': return 'bg-green-500';
        default: return 'bg-gray-500';
    }
}

const AvatarStack: React.FC<{ assigned: { avatarUrl: string }[], extra: number }> = ({ assigned, extra }) => (
    <div className="flex items-center -space-x-3">
        {assigned.slice(0, 3).map((user, index) => (
            <img key={index} src={user.avatarUrl} alt="avatar" className="h-8 w-8 rounded-full border-2 border-white" />
        ))}
        {extra > 0 && (
            <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                +{extra}
            </div>
        )}
    </div>
);


const ActiveProjectsTable: React.FC<ActiveProjectsTableProps> = ({ projects }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Projects</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Progress</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Assigned</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{project.name}</div>
                    <div className="text-xs text-gray-500">{project.date}</div>
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                            <div className={`${getProgressClass(project.status)} h-2 rounded-full`} style={{ width: `${project.progress}%` }}></div>
                        </div>
                        <span className="font-medium text-gray-700">{project.progress}%</span>
                    </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusClass(project.status)}`}>
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                    <AvatarStack assigned={project.assigned} extra={project.extraAssignees} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-center mt-4">
        <a href="#" className="text-sm font-semibold text-green-600 hover:underline">View All Projects</a>
      </div>
    </div>
  );
};

export default ActiveProjectsTable;
