import React from "react";
import styled from "styled-components";
import localData from "./data.json";
import Modal from "./Modal/Modal";
import LocalData from "./LocalData/LocalData";
import ServerData from "./ServerData/ServerData";
import axios from "axios";

const StyledTable = styled.table`
  border-collapse: collapse;
  th {
    border: 1px solid black;
    background-color: green;
    color: white;
    padding: 10px;
  }
  td {
    border: 1px solid black;
    padding: 10px;
  }
`;

const styleHoverEl = "green";
const styleActiveEl = "blue";
const styleDefaultEl = "white";
const styleNonEditEl = "grey";
const Td = styled.td`
  &:hover {
    background-color: ${({ isEdit }) => (isEdit ? "none" : styleHoverEl)};
  }
  &:active {
    background-color: ${({ isEdit }) => (isEdit ? "none" : styleActiveEl)};
  }
  background-color: ${({ isEdit }) =>
    isEdit ? styleNonEditEl : styleDefaultEl};
`;

function App() {
  const [lData, setLData] = React.useState(localData);
  const [sData, setSData] = React.useState([]);
  const [modalActive, setModalActive] = React.useState(false);
  const [isServerButton, setIsServerButton] = React.useState(null);
  const [isEdit, setIsEdit] = React.useState(false);
  const nameInputRef = React.useRef(null);
  const ageInputRef = React.useRef(null);

  const tableHead = () => {
    return (
      <tr>
        <th>name</th>
        <th>age</th>
      </tr>
    );
  };

  const renderTableData = (typeData, textButton, isServer) => {
    const addButton = (
      <button
        onClick={() => {
          setModalActive(true);
          setIsServerButton(isServer);
        }}
      >
        {textButton}
      </button>
    );
    if (typeData.length === 0) {
      return (
        <tr>
          <td style={{ border: "none" }}>{addButton}</td>
        </tr>
      );
    }
    return typeData.map((user, key) => {
      if (user.data) {
        const { name, age } = user.data;
        const tableData = (
          <>
            <td>{name}</td>
            <td>{age}</td>
            <Td
              onClick={deleteItem}
              id={user._id}
              data-isserver={isServer}
              isEdit={isEdit}
            >
              ❌
            </Td>
            <Td
              onClick={editItem}
              id={user._id}
              data-isserver={isServer}
              isEdit={isEdit}
            >
              ✏️
            </Td>
          </>
        );
        if (key === typeData.length - 1) {
          return (
            <tr key={key}>
              {tableData}
              <td style={{ border: "none" }}>{addButton}</td>
            </tr>
          );
        }

        return <tr key={key}>{tableData}</tr>;
      }
      return null;
    });
  };

  const renderNewServer = (status, event, typeOperation) => {
    if (status === 200) {
      const newData = [...sData];
      for (let i = 0; i < newData.length; i++) {
        if (newData[i]._id === event.target.id) {
          switch (typeOperation) {
            case "update":
              newData[i].data = {
                name: nameInputRef.current.value,
                age: ageInputRef.current.value,
              };
              break;
            case "delete":
              newData.splice(i, 1);
              break;
            default:
              return;
          }
        }
      }
      setSData(newData);
    }
  };

  const deleteItem = (e) => {
    if (isEdit) {
      return;
    }
    if (e.target.dataset.isserver === "true") {
      async function deleteData() {
        try {
          const deleteData = await axios({
            method: "DELETE",
            url: `http://178.128.196.163:3000/api/records/${e.target.id}`,
          });

          renderNewServer(deleteData.status, e, "delete");
        } catch (error) {
          console.log(error);
        }
      }

      deleteData();
    } else {
      const newData = lData.users.filter((v) => v._id !== e.target.id);
      const renderData = { users: newData };
      setLData(() => renderData);
    }
  };

  const styleEditSettings = (e) => {
    e.target.style.background = styleDefaultEl;
    e.target.onmouseover = function () {
      e.target.style.background = styleHoverEl;
    };
    e.target.onmouseleave = function () {
      e.target.style.background = styleDefaultEl;
    };
    e.target.onmousedown = function(){
      e.target.style.background = styleActiveEl;
    }
    e.target.addEventListener("click", () => {
      e.target.onmouseover = null;
      e.target.onmouseleave = null;
      e.target.onmousedown = null;
    });
  };

  const editItem = (e) => {
    if (e.target.dataset.isserver === "true") {
      if (isEdit) {
        if (e.target.innerHTML !== "📁") {
          return;
        }
        if (nameInputRef.current && ageInputRef.current) {
          async function updateData() {
            try {
              const updateData = await axios({
                method: "POST",
                url: `http://178.128.196.163:3000/api/records/${e.target.id}`,
                data: {
                  data: {
                    name: nameInputRef.current.value,
                    age: ageInputRef.current.value,
                  },
                },
              });

              e.target.innerHTML = "✏️";
              e.target.style.removeProperty("background");
              setIsEdit(false);
              renderNewServer(updateData.status, e, "update");
            } catch (error) {
              console.log(error);
            }
          }
          updateData();
        }
      } else {
        const widthInput = { width: "auto" };
        const newData = [...sData];
        for (const user of newData) {
          if (user._id === e.target.id) {
            user.data.name = (
              <input ref={nameInputRef} style={widthInput} type="text" />
            );
            user.data.age = (
              <input ref={ageInputRef} style={widthInput} type="text" />
            );
            e.target.innerHTML = "📁";
            styleEditSettings(e);
          }
        }
        setIsEdit(true);
        setSData(newData);
      }
    } else {
      if (isEdit) {
        if (e.target.innerHTML !== "📁") {
          return;
        }
        if (nameInputRef.current && ageInputRef.current) {
          const newData = Object.assign({}, lData);

          for (const user of newData.users) {
            if (user._id === e.target.id) {
              user.data.name = nameInputRef.current.value;
              user.data.age = ageInputRef.current.value;
              e.target.innerHTML = "✏️";
            }
          }

          setLData(newData);
          e.target.style.removeProperty("background");
          setIsEdit(false);
        }
      } else {
        const widthInput = { width: "auto" };
        const newData = Object.assign({}, lData);

        for (const user of newData.users) {
          if (user._id === e.target.id) {
            user.data.name = (
              <input ref={nameInputRef} style={widthInput} type="text" />
            );
            user.data.age = (
              <input ref={ageInputRef} style={widthInput} type="text" />
            );
            e.target.innerHTML = "📁";
            styleEditSettings(e);
          }
        }

        setIsEdit(true);
        setLData(newData);
      }
    }
  };

  return (
    <div>
      <StyledTable>
        <tbody>
          {tableHead()}

          <LocalData
            lData={lData}
            setModalActive={setModalActive}
            setIsServerButton={setIsServerButton}
            renderTableData={renderTableData}
          />
          <ServerData
            sData={sData}
            setSData={setSData}
            setModalActive={setModalActive}
            setIsServerButton={setIsServerButton}
            renderTableData={renderTableData}
          />
        </tbody>
      </StyledTable>
      <Modal
        active={modalActive}
        setModalActive={setModalActive}
        lData={lData}
        setLData={setLData}
        sData={sData}
        setSData={setSData}
        isServerButton={isServerButton}
      />
    </div>
  );
}

export default App;
