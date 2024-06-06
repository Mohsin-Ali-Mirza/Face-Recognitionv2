import React, {useState, useEffect} from 'react';
import DashboardHeader from '/src/components/DashboardHeader';

import all_orders from '/src/constants/orders';
import students from '/src/constants/students';
import {calculateRange, sliceData} from '/src/utils/table-pagination';
import { useNavigate } from 'react-router-dom';

import '/src/styles.css';
import { Link } from 'react-router-dom';
import { getDecide } from '../constants/loggedin';


function Orders () {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [orders, setOrders] = useState(all_orders);
    const [stu, setStudents] = useState(students);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        setPagination(calculateRange(stu, 5));
        setStudents(sliceData(stu, page, 5));
        const currentDecision = getDecide();
        console.log(currentDecision);
        setLoggedIn(currentDecision);
    }, []);

    // Search
    const __handleSearch = (event) => {
        setSearch(event.target.value);
        if (event.target.value !== '') {
            let search_results = stu.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.id.toLowerCase().includes(search.toLowerCase()) ||
                item.dept.toLowerCase().includes(search.toLowerCase())
            );
            setStudents(search_results);
        }
        else {
        __handleChangePage(1);
        }
    };

    // Change Page 
    const __handleChangePage = (new_page) => {
        setPage(new_page);
        
        setStudents(sliceData(students, new_page, 5));
    }

    const handleLoginPrompt = () => {
    
        navigate("/login"); // Navigate to the login page
      };

    

    return(
        <div className='dashboard-content'>


{loggedIn ? (  <div className='dashboard-content-container'>
                <div className='dashboard-content-header'>
                    <h2 className="text-blue-900 text-2xl -mt-5 underline underline-offset-2 font-mono">Students List</h2>
                    <div className='dashboard-content-search'>
                        <input
                            type='text'
                            value={search}
                            placeholder='Search..'
                            className='dashboard-content-input'
                            onChange={e => __handleSearch(e)} />
                    </div>
                </div>
                <table>
                    <thead>
                        <th>ID</th>
                        <th>NAME</th>
                        <th>DEPARTMENT</th>
                        <th>IMAGE</th>
                        <th>ATTENDANCE</th>
                        <th>LAST_ATTENDANCE</th>
                    </thead>

                    {stu.length !== 0 ?
                        <tbody>
                            {stu.map((student, index) => (
                                <tr key={index}>
                                    <td><span>{student.id}</span></td>
                                    <td><span>{student.name}</span></td>
                                    <td>
                                        <div>
                                            <span>{student.dept}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <img 
                                                src={student.image}
                                                className='dashboard-content-avatar'
                                                alt={student.name} />
                                            
                                        </div>
                                    </td>
                                    <td><span>{student.attendance}</span></td>
                                    <td><span>${student.last_attendance}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    : null}
                </table>

                {stu.length !== 0 ?
                    <div className='dashboard-content-footer'>
                        {pagination.map((item, index) => (
                            <span 
                                key={index} 
                                className={item === page ? 'active-pagination' : 'pagination'}
                                onClick={() => __handleChangePage(item)}>
                                    {item}
                            </span>
                        ))}
                    </div>
                : 
                    <div className='dashboard-content-footer'>
                        <span className='empty-table'>No data</span>
                    </div>
                }
            </div>): (
        <div className="text-white text-center">
          <p>You need to log in to access the registration form.</p>
          <button
            onClick={handleLoginPrompt}
            className="bg-green-500 hover:bg-green-900 text-white text-sm py-2 px-4 rounded-md w-32 lg:mx-4 mb-8"
            style={{ marginLeft: "73px" }}
          >
            Log In
          </button>
        </div>
      )}
        </div>
    )
}

export default Orders;