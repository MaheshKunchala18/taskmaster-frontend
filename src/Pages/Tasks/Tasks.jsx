import React, { useState, useEffect } from 'react';
import { Container, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserCircle, 
  faPlus, 
  faTasks, 
  faExclamationTriangle,
  faCheckCircle,
  faSearch,
  faChevronDown,
  faClock,
  faCalendarAlt
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
    const [activeCategory, setActiveCategory] = useState('due');
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

    const getActiveTaskList = () => {
        switch (activeCategory) {
            case 'overdue':
                return overdueTasks;
            case 'completed':
                return completedTasks;
            default:
                return tasks;
        }
    };

    const filteredTasks = () => {
        const taskList = getActiveTaskList();
        return taskList.filter(task => 
            task.task_detail.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const getCategoryInfo = (category) => {
        switch (category) {
            case 'overdue':
                return {
                    icon: faExclamationTriangle,
                    label: 'Overdue',
                    count: overdueTasks.length,
                    variant: 'overdue'
                };
            case 'completed':
                return {
                    icon: faCheckCircle,
                    label: 'Completed',
                    count: completedTasks.length,
                    variant: 'completed'
                };
            default:
                return {
                    icon: faClock,
                    label: 'Due Soon',
                    count: tasks.length,
                    variant: 'due'
                };
        }
    };

    if (isLoading) {
        return (
            <div className="tasks-loading">
                <div className="tasks-loading__spinner"></div>
                <p>Loading your tasks...</p>
            </div>
        );
    }

    const currentCategory = getCategoryInfo(activeCategory);
    const displayTasks = filteredTasks();

    return (
        <div className="modern-tasks-page">
            {/* Background Elements */}
            <div className="tasks-background">
                <div className="tasks-background__gradient"></div>
                <div className="tasks-background__particles"></div>
            </div>

            <div className="tasks-layout">
                {/* Sidebar Navigation */}
                <aside className={`tasks-sidebar ${isSidebarCollapsed ? 'tasks-sidebar--collapsed' : ''}`}>
                    <div className="sidebar-header">
                        <button 
                            className="sidebar-toggle"
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        >
                            <FontAwesomeIcon icon={faTasks} />
                        </button>
                        {!isSidebarCollapsed && (
                            <h3 className="sidebar-title">Categories</h3>
                        )}
                    </div>

                    <nav className="sidebar-nav">
                        {['due', 'overdue', 'completed'].map((category) => {
                            const categoryInfo = getCategoryInfo(category);
                            return (
                                <button
                                    key={category}
                                    className={`sidebar-nav-item ${activeCategory === category ? 'sidebar-nav-item--active' : ''}`}
                                    onClick={() => setActiveCategory(category)}
                                >
                                    <div className="nav-item-content">
                                        <div className="nav-item-icon">
                                            <FontAwesomeIcon icon={categoryInfo.icon} />
                                        </div>
                                        {!isSidebarCollapsed && (
                                            <>
                                                <span className="nav-item-label">{categoryInfo.label}</span>
                                                <span className="nav-item-count">{categoryInfo.count}</span>
                                            </>
                                        )}
                                    </div>
                                    {activeCategory === category && (
                                        <div className="nav-item-indicator"></div>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {!isSidebarCollapsed && (
                        <div className="sidebar-footer">
                            <div className="sidebar-stats">
                                <div className="stat-item">
                                    <span className="stat-label">Total Tasks</span>
                                    <span className="stat-value">{tasks.length + overdueTasks.length + completedTasks.length}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </aside>

                {/* Main Content */}
                <main className="tasks-main">
                    {/* Header */}
                    <header className="tasks-header">
                        <div className="tasks-header__content">
                            <div className="tasks-header__left">
                                <h1 className="tasks-header__title">
                                    <FontAwesomeIcon icon={currentCategory.icon} className="tasks-header__icon" />
                                    {currentCategory.label}
                                </h1>
                                <p className="tasks-header__subtitle">
                                    Welcome back, {userName}! You have {currentCategory.count} {currentCategory.label.toLowerCase()} tasks.
                                </p>
                            </div>
                            
                            <div className="tasks-header__right">
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
                    </header>

                    {/* Tasks Grid */}
                    <section className="tasks-grid-container">
                        {displayTasks.length === 0 ? (
                            <div className="tasks-empty">
                                <div className="empty-state">
                                    <FontAwesomeIcon icon={currentCategory.icon} className="empty-state__icon" />
                                    <h3 className="empty-state__title">No {currentCategory.label.toLowerCase()}</h3>
                                    <p className="empty-state__message">
                                        {activeCategory === 'due' && "You're all caught up! Add a new task to get started."}
                                        {activeCategory === 'overdue' && "Great! You don't have any overdue tasks."}
                                        {activeCategory === 'completed' && "Complete some tasks to see them here."}
                                    </p>
                                    {activeCategory === 'due' && (
                                        <ModernButton
                                            variant="primary"
                                            onClick={() => setShowModal(true)}
                                            icon={<FontAwesomeIcon icon={faPlus} />}
                                        >
                                            Add Your First Task
                                        </ModernButton>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="tasks-grid">
                                {displayTasks.map((task, index) => (
                                    <TaskCard
                                        key={task._id}
                                        task={task}
                                        variant={currentCategory.variant}
                                        onEdit={handleEditTask}
                                        onDelete={handleDeleteTask}
                                        onComplete={handleCompleteTask}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </main>
            </div>

            {/* Modal */}
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