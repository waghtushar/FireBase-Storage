import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";

function Add_user() {
  const [user, setUser] = useState({});
  const [list, setList] = useState([]);
  const [editId, setEditId] = useState("");
  useEffect(() => {
    getData();
  }, []);

  let handleChange = (e) => {
    let { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  let getData = async () => {
    try {
      let res = await getDocs(collection(db, "users"));
      let allData = res.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log(allData);
      setList(allData);
    } catch (error) {
      console.log(error);
    }
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId == "") {
        await addDoc(collection(db, "users"), user);
      } else {
        let obj = {
          username: user.username,
          password: user.password,
        };
        await updateDoc(doc(db, "users", editId), obj);
        setEditId("");
      }
    } catch (error) {
      console.log(error);
    }
    setUser({});
    getData();
  };

  let handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      console.log(id + " Deleted");
      getData();
    } catch (error) {
      console.log(error);
    }
  };

  let handleEdit = (user) => {
    setUser(user);
    setEditId(user.id);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-3 w-50 mx-auto">
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">
            username
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleInputEmail1"
            name="username"
            value={user.username || ""}
            aria-describedby="emailHelp"
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={user.password || ""}
            id="exampleInputPassword1"
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          {list.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.password}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-primary ms-2"
                  onClick={() => handleEdit(user)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Add_user;
