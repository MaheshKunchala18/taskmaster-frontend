import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserCircle, 
  faPlus, 
  faTasks, 
  faExclamationTriangle,
  faCheckCircle,
  faFilter,
  faSearch,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import TaskCard from '../../components/TaskCard/TaskCard';
import ModernButton from '../../components/ModernButton/ModernButton';
import { NotificationProvider, useNotification } from '../../components/NotificationSystem/NotificationSystem';
import FloatingLabelInput from '../../components/FloatingLabelInput/FloatingLabelInput';
import './Tasks.css';

function TasksContent() {
    const navigate = useNavigate();
    const notification = useNotification();

    const [showModal, setShowModal] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [overdueTasks, setOverdueTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [taskText, setTaskText] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);
    const [userName, setUserName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBy, setFilterBy] = useState('all');
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [userData, setUserData] = useState({
        username: '',
        overdue: 0,
        due: 0,
        completed: 0
    });

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            navigate('/login');
        } else {
            initializeData(userId);
        }
    }, [navigate]);

    const initializeData = async (userId) => {
        setIsLoading(true);
        try {
            await Promise.all([fetchUser(userId), fetchTasks(userId)]);
        } catch (error) {
            notification.showError('Error Loading Data', 'Failed to load your tasks. Please refresh the page.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUser = async (userId) => {
        try {
            const user = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user?userId=${userId}`);
            const user_name = user.data.first_name + ' ' + user.data.last_name;
            setUserName(user_name);
        } catch (error) {
            console.error('Error fetching user', error);
            throw error;
        }
    };

    const fetchTasks = async (userId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/tasks?userId=${userId}`);
            setTasks(response.data.dueTasks || []);
            setOverdueTasks(response.data.overdueTasks || []);
            setCompletedTasks(response.data.completedTasks || []);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    };

    const handleAddTask = async () => {
        if (taskText.trim() !== '') {
            const userId = localStorage.getItem('userId');
            const newTask = {
                user_id: userId,
                task_detail: taskText,
                due_time: dueTime
            };
            
            try {
                await axios.post(`${process.env.REACT_APP_BACKEND_URL}/tasks`, newTask);
                await fetchTasks(userId);
                notification.showTaskAdded(taskText);
                setTaskText('');
                setDueTime('');
            } catch (error) {
                console.error('Error adding task:', error);
                notification.showError('Failed to Add Task', 'There was an error adding your task. Please try again.');
            }
        }
        setShowModal(false);
    };

    const handleEditTask = (task) => {
        setSelectedTask(task);
        setTaskText(task.task_detail);
        if (task.due_time) {
            const date = new Date(task.due_time);
            const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16);
            setDueTime(localDateTime);
        }
        setShowModal(true);
    };

    const handleSaveEditTask = async () => {
        if (selectedTask && taskText.trim() !== '') {
            const editedTask = {
                task_detail: taskText,
                due_time: dueTime
            };
            
            try {
                await axios.put(`${process.env.REACT_APP_BACKEND_URL}/tasks/${selectedTask._id}`, editedTask);
                const userId = localStorage.getItem('userId');
                await fetchTasks(userId);
                notification.showTaskEdited(taskText);
                setSelectedTask(null);
                setTaskText('');
                setDueTime('');
            } catch (error) {
                console.error('Error editing task:', error);
                notification.showError('Failed to Update Task', 'There was an error updating your task. Please try again.');
            }
        }
        setShowModal(false);
    };

    const handleDeleteTask = async (task) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/tasks/${task._id}`);
            const userId = localStorage.getItem('userId');
            await fetchTasks(userId);
            notification.showTaskDeleted(task.task_detail);
        } catch (error) {
            console.error('Error deleting task:', error);
            notification.showError('Failed to Delete Task', 'There was an error deleting your task. Please try again.');
        }
    };

    const handleCompleteTask = async (task) => {
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/tasks/${task._id}/complete`);
            const userId = localStorage.getItem('userId');
            await fetchTasks(userId);
            notification.showTaskCompleted(task.task_detail);
        } catch (error) {
            console.error('Error completing task:', error);
            notification.showError('Failed to Complete Task', 'There was an error completing your task. Please try again.');
        }
    };

    const handleLogOut = () => {
        localStorage.removeItem('userId');
        notification.showInfo('Logged Out', 'You have been successfully logged out.');
        setTimeout(() => {
            navigate('/');
        }, 1000);
    };

    const updateUserData = () => {
        setUserData({
            username: userName,
            overdue: overdueTasks.length,
            due: tasks.length,
            completed: completedTasks.length
        });
    };

    const filteredTasks = (taskList) => {
        return taskList.filter(task => 
            task.task_detail.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const getTaskCounts = () => {
        return {
            total: tasks.length + overdueTasks.length + completedTasks.length,
            overdue: overdueTasks.length,
            due: tasks.length,
            completed: completedTasks.length
        };
    };

    if (isLoading) {
        return (
            <div className="tasks-loading">
                <div className="tasks-loading__spinner"></div>
                <p>Loading your tasks...</p>
            </div>
        );
    }

    const counts = getTaskCounts();

    return (
        <div className="modern-tasks-page">
            {/* Background Elements */}
            <div className="tasks-background">
                <div className="tasks-background__gradient"></div>
                <div className="tasks-background__particles"></div>
            </div>

            <Container fluid className="tasks-container">
                {/* Header Section */}
                <div className="tasks-header">
                    <div className="tasks-header__content">
                        <div className="tasks-header__main">
                            <h1 className="tasks-header__title">
                                <FontAwesomeIcon icon={faTasks} className="tasks-header__icon" />
                                Your Tasks
                            </h1>
                            <p className="tasks-header__subtitle">
                                Welcome back, {userName}! You have {counts.total} tasks to manage.
                            </p>
                        </div>
                        
                        <div className="tasks-header__actions">
                            <ModernButton
                                variant="primary"
                                size="lg"
                                icon={<FontAwesomeIcon icon={faPlus} />}
                                onClick={() => setShowModal(true)}
                                className="tasks-header__add-btn"
                            >
                                Add Task
                            </ModernButton>

                            <div className="tasks-header__profile">
                                <button 
                                    className="tasks-profile-trigger"
                                    onClick={() => {
                                        updateUserData();
                                        setShowProfileDropdown(!showProfileDropdown);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faUserCircle} />
                                    <FontAwesomeIcon icon={faChevronDown} className="profile-chevron" />
                                </button>

                                {showProfileDropdown && (
                                    <div className="tasks-profile-dropdown">
                                        <div className="profile-dropdown__header">
                                            <h4>{userData.username}</h4>
                                        </div>
                                        <div className="profile-dropdown__stats">
                                            <div className="stat-item">
                                                <span className="stat-label">Overdue</span>
                                                <span className="stat-value stat-value--danger">{userData.overdue}</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-label">Due</span>
                                                <span className="stat-value stat-value--primary">{userData.due}</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-label">Completed</span>
                                                <span className="stat-value stat-value--success">{userData.completed}</span>
                                            </div>
                                        </div>
                                        <ModernButton
                                            variant="error"
                                            size="sm"
                                            onClick={handleLogOut}
                                            className="profile-dropdown__logout"
                                        >
                                            Logout
                                        </ModernButton>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="tasks-controls">
                        <div className="tasks-search">
                            <FontAwesomeIcon icon={faSearch} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    </div>
                </div>

                {/* Tasks Grid */}
                <div className="tasks-grid">
                    {/* Overdue Tasks */}
                    <div className="tasks-column tasks-column--overdue">
                        <div className="tasks-column__header">
                            <div className="column-header__icon">
                                <FontAwesomeIcon icon={faExclamationTriangle} />
                            </div>
                            <h3 className="column-header__title">Overdue</h3>
                            <div className="column-header__count">{overdueTasks.length}</div>
                        </div>
                        
                        <div className="tasks-column__content">
                            {filteredTasks(overdueTasks).length === 0 ? (
                                <div className="tasks-empty">
                                    <p>No overdue tasks</p>
                                </div>
                            ) : (
                                filteredTasks(overdueTasks).map((task, index) => (
                                    <TaskCard
                                        key={task._id}
                                        task={task}
                                        variant="overdue"
                                        onEdit={handleEditTask}
                                        onDelete={handleDeleteTask}
                                        onComplete={handleCompleteTask}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Due Tasks */}
                    <div className="tasks-column tasks-column--due">
                        <div className="tasks-column__header">
                            <div className="column-header__icon">
                                <FontAwesomeIcon icon={faTasks} />
                            </div>
                            <h3 className="column-header__title">Due Soon</h3>
                            <div className="column-header__count">{tasks.length}</div>
                        </div>
                        
                        <div className="tasks-column__content">
                            {filteredTasks(tasks).length === 0 ? (
                                <div className="tasks-empty">
                                    <p>No upcoming tasks</p>
                                </div>
                            ) : (
                                filteredTasks(tasks).map((task, index) => (
                                    <TaskCard
                                        key={task._id}
                                        task={task}
                                        variant="due"
                                        onEdit={handleEditTask}
                                        onDelete={handleDeleteTask}
                                        onComplete={handleCompleteTask}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Completed Tasks */}
                    <div className="tasks-column tasks-column--completed">
                        <div className="tasks-column__header">
                            <div className="column-header__icon">
                                <FontAwesomeIcon icon={faCheckCircle} />
                            </div>
                            <h3 className="column-header__title">Completed</h3>
                            <div className="column-header__count">{completedTasks.length}</div>
                        </div>
                        
                        <div className="tasks-column__content">
                            {filteredTasks(completedTasks).length === 0 ? (
                                <div className="tasks-empty">
                                    <p>No completed tasks</p>
                                </div>
                            ) : (
                                filteredTasks(completedTasks).map((task, index) => (
                                    <TaskCard
                                        key={task._id}
                                        task={task}
                                        variant="completed"
                                        onEdit={handleEditTask}
                                        onDelete={handleDeleteTask}
                                        onComplete={handleCompleteTask}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </Container>

            {/* Modern Modal */}
            <Modal 
                show={showModal} 
                onHide={() => { 
                    setShowModal(false); 
                    setSelectedTask(null); 
                    setTaskText('');
                    setDueTime('');
                }}
                className="modern-modal"
                centered
            >
                <div className="modal-glass">
                    <Modal.Header className="modern-modal__header">
                        <Modal.Title className="modern-modal__title">
                            {selectedTask ? 'Edit Task' : 'Create New Task'}
                        </Modal.Title>
                    </Modal.Header>
                    
                    <Modal.Body className="modern-modal__body">
                        <Form>
                            <div className="form-group">
                                <FloatingLabelInput
                                    type="text"
                                    placeholder="Enter task description"
                                    label="Task Description"
                                    value={taskText}
                                    onChange={(e) => setTaskText(e.target.value)}
                                />
                            </div>
                            
                            <div className="form-group">
                                <FloatingLabelInput
                                    type="datetime-local"
                                    placeholder="Set due date and time"
                                    label="Due Date & Time"
                                    value={dueTime}
                                    onChange={(e) => setDueTime(e.target.value)}
                                />
                            </div>
                        </Form>
                    </Modal.Body>
                    
                    <Modal.Footer className="modern-modal__footer">
                        <ModernButton
                            variant="secondary"
                            onClick={() => { 
                                setShowModal(false); 
                                setSelectedTask(null); 
                                setTaskText('');
                                setDueTime('');
                            }}
                        >
                            Cancel
                        </ModernButton>
                        
                        <ModernButton
                            variant="primary"
                            onClick={selectedTask ? handleSaveEditTask : handleAddTask}
                            disabled={!taskText.trim()}
                        >
                            {selectedTask ? 'Update Task' : 'Create Task'}
                        </ModernButton>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    );
}

function Tasks() {
    return (
        <NotificationProvider>
            <TasksContent />
        </NotificationProvider>
    );
}

export default Tasks;