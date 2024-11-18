import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 h-full">
      <h2 className="p-4 text-lg font-bold">Sidebar</h2>
      <ul className="space-y-2 p-2">
        <NavLink to="/dashboard">
          <li className="p-2 hover:bg-gray-700">
            Dashboard
          </li>
        </NavLink>
        <NavLink to="/settings">
          <li className="p-2 hover:bg-gray-700">
            Settings
          </li>
        </NavLink>
        <NavLink to="/profile">
          <li className="p-2 hover:bg-gray-700">
            Profile
          </li>
        </NavLink>
        <NavLink to="/calculator">
          <li className="p-2 hover:bg-gray-700">
            Calculator
          </li>
        </NavLink>
      </ul>
    </div>
  );
}

export default Sidebar;
