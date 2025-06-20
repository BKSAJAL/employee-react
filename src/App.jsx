import { useEffect, useState } from "react";
import "./style.css";
import axios from "./api/axios";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { subYears } from "date-fns";

function App() {
  const [employees, setEmployees] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const empObj = { name: "", dob: "", salary: "", location: "" };
  const [newEmployee, setNewEmployee] = useState(empObj);

  const handleAddEmpInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleEditClick = (employee) => {
    const formattedDOB = new Date(employee.dob).toISOString().split("T")[0]; // YYYY-MM-DD
    setEditId(employee._id);
    setEditFormData({ ...employee, dob: formattedDOB });
  };

  const handleCancelClick = () => {
    setEditId(null);
    setEditFormData({});
  };

  const handleSaveClick = (id) => {
    editEmployee(id);
    setEditId(null);
  };

  const handleEditEmpInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, dob, salary, location } = newEmployee;
    if (!name) toast.error("Employee name cannot be empty");
    else if (!dob) toast.error("Date of Birth cannot be empty");
    else if (!location) toast.error("Location cannot be empty");
    else if (!salary) toast.error("Salary cannot be empty");
    else addEmployee();
  };

  //add employee
  const addEmployee = async () => {
    try {
      const { name, dob, salary, location } = newEmployee;
      const res = await axios.post("/", {
        name,
        dob,
        salary,
        location,
      });
      getEmployees();
      toast.success(res.data.message);
      setNewEmployee(empObj);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  //delete employee
  const deleteEmployee = async (employeeId) => {
    try {
      const res = await axios.delete(`/${employeeId}`);
      toast.success(res.data.message);
      getEmployees();
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  // edit employee
  const editEmployee = async (employeeId) => {
    try {
      const { name, dob, salary, location } = editFormData;
      const res = await axios.put(`/${employeeId}`, {
        name,
        dob,
        location,
        salary,
      });
      toast.success(res.data.message);
      getEmployees();
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  // get employees
  const getEmployees = async () => {
    try {
      const res = await axios.get("/");
      setEmployees(res.data);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

  return (
    <div className="container">
      <main className="main">
        <h1 className="text-4xl font-bold text-center mt-20">Employee Dashboard</h1>
        <div>
          <form
            className="flex justify-center gap-3 mt-10"
            onSubmit={handleSubmit}
            onChange={handleAddEmpInputChange}
          >
            <input
              value={newEmployee.name}
              placeholder="Employee Name"
              name="name"
            />
            <DatePicker
              selected={newEmployee?.dob}
              onChange={(date) => setNewEmployee({ ...newEmployee, dob: date })}
              minDate={subYears(new Date(), 60)}
              maxDate={subYears(new Date(), 18)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Date of Birth"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
            <input
              value={newEmployee?.location}
              placeholder="Location"
              name="location"
            />
            <input
              type="number"
              placeholder="Salary"
              name="salary"
              min="1"
              value={newEmployee?.salary}
            />
            <button className="bg-violet-600 hover:bg-violet-500">Add</button>
          </form>
        </div>
        <div className="mt-10 relative overflow-x-auto sm:rounded-lg">
          {!!employees[0] && (
            <table className="w-full text-sm text-gray-400">
              <thead className="bg-gray-700 text-gray-400 uppercase">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Date of Birth</th>
                  <th scope="col">Location</th>
                  <th scope="col">Salary</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {employees?.map((emp) => {
                  return editId == emp._id ? (
                    <tr key={emp._id} className="bg-gray-800 hover:bg-gray-600">
                      <td>
                        <input
                          className="capitalize"
                          name="name"
                          value={editFormData.name}
                          onChange={handleEditEmpInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          name="dob"
                          value={editFormData.dob}
                          onChange={handleEditEmpInputChange}
                        />
                      </td>
                      <td>
                        <input
                          className="capitalize"
                          name="location"
                          value={editFormData.location}
                          onChange={handleEditEmpInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="salary"
                          value={editFormData.salary}
                          onChange={handleEditEmpInputChange}
                        />
                      </td>
                      <td className="text-white">
                        <button
                          className="bg-cyan-600 mr-2 hover:bg-cyan-500"
                          onClick={() => handleSaveClick(emp._id)}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-600 hover:bg-gray-500"
                          onClick={handleCancelClick}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={emp._id} className="bg-gray-800 hover:bg-gray-600">
                      <td className="font-medium whitespace-nowrap capitalize text-white">
                        {emp.name}
                      </td>
                      <td>{new Date(emp.dob).toISOString().split("T")[0]}</td>
                      <td className="capitalize">{emp.location}</td>
                      <td>{emp.salary}</td>
                      <td className="text-white">
                        <button
                          className="bg-blue-600 mr-2 hover:bg-blue-500"
                          onClick={() => handleEditClick(emp)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-pink-600 hover:bg-pink-500"
                          onClick={() => deleteEmployee(emp._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
