import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Modal, Form, OverlayTrigger, Popover } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './Tasks.css';


function Tasks() {
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [overdueTasks, setOverdueTasks] = useState([]);
    const [taskText, setTaskText] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);

    const [typeofTask, setTypeofTask] = useState('');  // For editing the task to know which task(due/overdue) to edit.
    const [completedTasks, setCompletedTasks] = useState([]);

    const [userName, setUserName] = useState('');

    const [userData, setUserData] = useState(
        {
            username: '',
            overdue: 0,
            due: 0,
            completed: 0
        }
    );


    useEffect(() => {
        const userId = localStorage.getItem('userId');
        fetchUser(userId);
        if (!userId) {
            navigate('/login');
        } else {
            fetchTasks(userId);
        }
    }, [navigate]);


    const fetchUser = async (userId) => {
        try {
            const user = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user?userId=${userId}`);
            const user_name = user.data.first_name + ' ' + user.data.last_name;
            setUserName(user_name);
        } catch (error) {
            console.error('Error fetching user', error);
        }
    };


    const fetchTasks = async (userId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/tasks?userId=${userId}`);
            setTasks(response.data.dueTasks);
            setOverdueTasks(response.data.overdueTasks);
            setCompletedTasks(response.data.completedTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const getCurrentDateTime = () => {
        let date = new Date();
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, '0'); // padStart is used to add leading zeros
        let day = date.getDate().toString().padStart(2, '0');
        let hours = date.getHours().toString().padStart(2, '0');
        let minutes = date.getMinutes().toString().padStart(2, '0');
        let seconds = date.getSeconds().toString().padStart(2, '0');

        let dateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        return dateTime;
    }

    const handleAddTask = async () => {
        if (taskText.trim() !== '') {
            const userId = localStorage.getItem('userId');
            const currentTime = getCurrentDateTime();

            const newTask = {
                user_id: userId,
                task_detail: taskText,
                creation_time: currentTime,
                lastedited_time: currentTime,
                due_time: dueTime ? dueTime.replace('T', ' ').concat(':00') : null
            };
            try {
                await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tasks`, newTask);
                fetchTasks(userId); // Refresh the task list
                setTaskText('');
                setDueTime('');
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }
        setShowModal(false);
    };


    const handleEditTask = (task) => {
        setSelectedTask(task);
        setTaskText(task.task_detail);
        setDueTime(task.due_time.replace('T', ' ').concat(':00')); // Convert to local datetime format
        setShowModal(true);
    };


    const handleSaveEditTask = async () => {
        if (selectedTask && taskText.trim() !== '') {
            const currentTime = getCurrentDateTime();
            const editedTask = {
                ...selectedTask,
                task_detail: taskText,
                lastedited_time: currentTime,
                due_time: dueTime ? dueTime.replace('T', ' ').concat(':00') : null
            };
            try {
                if (typeofTask === 'due') await axios.put(`${process.env.REACT_APP_BACKEND_URL}/duetasks/${selectedTask._id}`, editedTask);
                else await axios.put(`${process.env.REACT_APP_BACKEND_URL}/overduetasks/${selectedTask._id}`, editedTask);

                const userId = localStorage.getItem('userId');
                fetchTasks(userId); // Refresh the task list
                setSelectedTask(null);
                setTaskText('');
                setDueTime('');
            } catch (error) {
                console.error('Error editing task:', error);
            }
        }
        setShowModal(false);
    };


    const handleDeleteTask = async (task, typeofTask) => {
        try {
            if (typeofTask === 'due') await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/duetasks/${task._id}`);
            else await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/overduetasks/${task._id}`);

            const userId = localStorage.getItem('userId');
            fetchTasks(userId); // Refresh the task list
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };


    const handleCompleteTask = async (task, typeofTask) => {
        try {
            if (typeofTask === 'due') await axios.put(`${process.env.REACT_APP_BACKEND_URL}/completeduetask/${task._id}`);
            else if (typeofTask === 'overdue') await axios.put(`${process.env.REACT_APP_BACKEND_URL}/completeoverduetask/${task._id}`);

            const userId = localStorage.getItem('userId');
            fetchTasks(userId); // Refresh the task list
        } catch (error) {
            console.error('Error Completing task:', error);
        }
    };


    const handleLogOut = () => {
        localStorage.removeItem('userId');
        setTimeout(() => {
            navigate('/');
        }, 500); // Wait for 0.5 second before redirecting
    }

    const profilePopover = (
        <Popover id="popover-basic" className="profile-popover">
            <Popover.Header as="h3">Profile</Popover.Header>
            <Popover.Body className='popover-body-text'>
                <div>Username: {userData.username}</div>
                <div>Overdue Tasks: {userData.overdue}</div>
                <div>Due Tasks: {userData.due}</div>
                <div>Completed Tasks: {userData.completed}</div>
                <Button className='mt-4' variant="danger" onClick={handleLogOut}>Logout</Button>
            </Popover.Body>
        </Popover>
    );

    const count = () => {
        setUserData({
            username: userName,
            overdue: overdueTasks.length,
            due: tasks.length,
            completed: completedTasks.length
        });
    }


    return (
        <div className="main-todos-page">
            <Container>
                <Row>
                    <Col>
                        <h1 className="text-white mb-4 d-flex justify-content-between">
                            Your Todos
                            <OverlayTrigger onEntering={count} trigger="click" placement="bottom" overlay={profilePopover} rootClose>
                                <FontAwesomeIcon icon={faUserCircle} size="2x" className="profile-icon" />
                            </OverlayTrigger>
                        </h1>
                    </Col>
                </Row>

                <Row>
                    <Col className="text-center mb-4">
                        <Button variant="primary" onClick={() => setShowModal(true)}>
                            Add a task
                        </Button>
                    </Col>
                </Row>

                <Row>
                    {/* 1. Overdue Tasks */}
                    <Col md={4}>
                        <Card className="mb-4">
                            <Card.Body>
                                <Card.Title>Overdue Tasks</Card.Title>
                                {overdueTasks.length === 0 ? (
                                    <Card.Text>No overdue tasks.</Card.Text>
                                ) : (
                                    overdueTasks.map((task, index) => (
                                        <Card.Text key={index} className="text-danger">
                                            Task: {task.task_detail}
                                            <br />
                                            Created at: {new Date(task.creation_time).toLocaleString("en-IN").replace('pm', 'PM').replace('am', 'AM')}
                                            <br />
                                            Last Edited at: {new Date(task.lastedited_time).toLocaleString("en-IN").replace('pm', 'PM').replace('am', 'AM')}
                                            <br />
                                            Due at: {new Date(task.due_time).toLocaleString("en-IN").replace('pm', 'PM').replace('am', 'AM')}
                                            <br />
                                            <Button variant="primary" onClick={() => { handleEditTask(task); setTypeofTask('overdue') }} className="mt-2"> Edit </Button>
                                            <Button variant="danger" onClick={() => handleDeleteTask(task, 'overdue')} className="mt-2 mx-2"> Delete </Button>
                                        </Card.Text>
                                    ))
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* 2. Due Tasks */}
                    <Col md={4}>
                        <Card className="mb-4">
                            <Card.Body>
                                <Card.Title>Due Tasks</Card.Title>
                                {tasks.length === 0 ? (
                                    <Card.Text>No due tasks.</Card.Text>
                                ) : (
                                    tasks.map((task, index) => (
                                        <Card.Text key={index}>
                                            Task: {task.task_detail}
                                            <br />
                                            Created at: {new Date(task.creation_time).toLocaleString("en-IN").replace('pm', 'PM').replace('am', 'AM')}
                                            <br />
                                            Last Edited at: {new Date(task.lastedited_time).toLocaleString("en-IN").replace('pm', 'PM').replace('am', 'AM')}
                                            <br />
                                            Due at: {new Date(task.due_time).toLocaleString("en-IN").replace('pm', 'PM').replace('am', 'AM')}
                                            <br />
                                            <Button variant="primary" onClick={() => { handleEditTask(task); setTypeofTask('due'); }} className="mt-2"> Edit </Button>
                                            <Button variant="danger" onClick={() => handleDeleteTask(task, 'due')} className="mt-2 mx-2"> Delete </Button>
                                            <Button variant="success" onClick={() => handleCompleteTask(task, 'due')} className="mt-2"> Complete </Button>
                                        </Card.Text>
                                    ))
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* 3. Completed Tasks */}
                    <Col md={4}>
                        <Card className="mb-4">
                            <Card.Body>
                                <Card.Title>Completed Tasks</Card.Title>
                                {completedTasks.length === 0 ? (
                                    <Card.Text>No completed tasks.</Card.Text>
                                ) : (
                                    completedTasks.map((task, index) => (
                                        <Card.Text key={index} className="text-success">
                                            Task: {task.task_detail}
                                            <br />
                                            Created at: {new Date(task.creation_time).toLocaleString("en-IN").replace('pm', 'PM').replace('am', 'AM')}
                                            <br />
                                            Last Edited at: {new Date(task.lastedited_time).toLocaleString("en-IN").replace('pm', 'PM').replace('am', 'AM')}
                                            <br />
                                            Due at: {new Date(task.due_time).toLocaleString("en-IN").replace('pm', 'PM').replace('am', 'AM')}
                                            <br />
                                        </Card.Text>
                                    ))
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <Modal show={showModal} onHide={() => { setShowModal(false); setSelectedTask(null); }}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedTask ? 'Edit Task' : 'Add Task'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTaskText">
                            <Form.Label>Task</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter task"
                                value={taskText}
                                onChange={(e) => setTaskText(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDueTime">
                            <Form.Label>Due Time</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                placeholder="Enter due time"
                                value={dueTime}
                                onChange={(e) => setDueTime(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowModal(false); setSelectedTask(null); }}>Close</Button>
                    <Button variant="primary" onClick={selectedTask ? handleSaveEditTask : handleAddTask}>
                        {selectedTask ? 'Save Changes' : 'Add Task'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Tasks;