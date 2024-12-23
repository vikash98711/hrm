import React, { useContext, useState, useEffect } from "react";
import "./ContentMain.css";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { SidebarContext } from "../../context/sidebarContext";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { url } from "../URL/Url";

const ContentMain = () => {
  const { department, role, user } = useContext(SidebarContext);
  const [todoItems, setTodoItems] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editTodoId, setEditTodoId] = useState(null); // ID of the item being edited
  const [editTodoContent, setEditTodoContent] = useState(""); // Content of the item being edited

  const roles = sessionStorage.getItem("role");
  const name = sessionStorage.getItem("name");
  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("id");

  // Fetch To-Do items from the server
  const fetchTodos = async () => {
    try {
      const response = await axios.get(`https://backfile-h9t9.onrender.com/api/todos/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodoItems(response.data.todos);
    } catch (error) {
      console.error("Error fetching To-Dos:", error.message);
    }
  };

  // Add a new To-Do
  const addTodo = async () => {
    if (!newTodo.trim()) {
      Swal.fire("Error", "To-Do cannot be empty", "error");
      return;
    }

    try {
      const response = await axios.post(
        `${url}/api/todos`,
        { userId, content: newTodo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodoItems([...todoItems, response.data.todo]);
      setNewTodo("");
    } catch (error) {
      console.error("Error adding To-Do:", error.message);
    }
  };

  // Delete a To-Do
  const deleteTodo = async (todoId) => {
    try {
      await axios.delete(`${url}/api/todos/${todoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodoItems(todoItems.filter((item) => item._id !== todoId));
    } catch (error) {
      console.error("Error deleting To-Do:", error.message);
    }
  };

  // Start editing a To-Do
  const startEditing = (todoId, content) => {
    setEditTodoId(todoId);
    setEditTodoContent(content);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditTodoId(null);
    setEditTodoContent("");
  };

  // Update a To-Do
  const updateTodo = async () => {
    if (!editTodoContent.trim()) {
      Swal.fire("Error", "Updated content cannot be empty", "error");
      return;
    }

    try {
      const response = await axios.put(
        `${url}/api/todos/${editTodoId}`,
        { content: editTodoContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodoItems(
        todoItems.map((item) =>
          item._id === editTodoId ? { ...item, content: response.data.todo.content } : item
        )
      );
      cancelEditing();
    } catch (error) {
      console.error("Error updating To-Do:", error.message);
    }
  };

  // Load To-Do items on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <>
      {/* Welcome Message */}
      <div className="container Home-total-card-box">
        <div className="row box-shadow-common p-5">
          <h5 className="fs-25">
            Welcome <span className="text-warning">{name || "Guest"}</span> to the{" "}
            <span className="text-warning">{roles || "Dashboard"}</span>
          </h5>
        </div>

        {/* Dashboard Cards */}
        <div className="row box-shadow-common p-5">
          <div className="col-lg-4">
            <Card className="card-total-orders box-downshadow">
              <Card.Body>
                <Card.Title className="text-center">Total Employees</Card.Title>
                <Card.Title className="text-center fs-25">
                  {user ? user.length : "Not Available"}
                </Card.Title>
              </Card.Body>
            </Card>
          </div>
          <div className="col-lg-4">
            <Card className="card-pending-orders box-downshadow">
              <Card.Body>
                <Card.Title className="text-center">Total Departments</Card.Title>
                <Card.Title className="text-center fs-25">
                  {department ? department.length : "Not Available"}
                </Card.Title>
              </Card.Body>
            </Card>
          </div>
          <div className="col-lg-4">
            <Card className="card-cancel-orders box-downshadow">
              <Card.Body>
                <Card.Title className="text-center">Total Roles</Card.Title>
                <Card.Title className="text-center fs-25">
                  {role ? role.length : "Not Available"}
                </Card.Title>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* To-Do List Section */}
        <div className="container">
          <div className="row box-shadow-common p-5">
            <div className="col-lg-6">
              <Card className="box-downshadow">
                <Card.Body>
                  <h4 className="text-center text-danger">To-Do List</h4>
                  <InputGroup className="mb-3">
                    <Form.Control
                      placeholder="Enter a new task"
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                    />
                    <Button variant="primary" onClick={addTodo}>
                      <i className="fa-solid fa-plus"></i> Add
                    </Button>
                  </InputGroup>
                  <div className="todo-list">
                    {todoItems.length > 0 ? (
                      todoItems.map((item) => (
                        <Card className="mb-2 box-downshadow" key={item._id}>
                          <Card.Body className="d-flex justify-content-between align-items-center">
                            {editTodoId === item._id ? (
                              <InputGroup>
                                <Form.Control
                                  value={editTodoContent}
                                  onChange={(e) => setEditTodoContent(e.target.value)}
                                />
                                <Button variant="success" onClick={updateTodo}>
                                  Save
                                </Button>
                                <Button variant="secondary" onClick={cancelEditing}>
                                  Cancel
                                </Button>
                              </InputGroup>
                            ) : (
                              <>
                                <span>{item.content}</span>
                                <div>
                                  <Link
                                    to="#"
                                    onClick={() => startEditing(item._id, item.content)}
                                  >
                                    <i className="fa-regular fa-pen-to-square text-info"></i>
                                  </Link>{" "}
                                  &nbsp;
                                  <Link
                                    to="#"
                                    onClick={() => deleteTodo(item._id)}
                                  >
                                    <i className="fa-solid fa-trash-can text-danger"></i>
                                  </Link>
                                </div>
                              </>
                            )}
                          </Card.Body>
                        </Card>
                      ))
                    ) : (
                      <p className="text-center">No tasks found.</p>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentMain;
