import React from "react";
import styled from "styled-components";
import axios from "axios";
import uniqid from "uniqid";

const StyledModal = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ active }) => (active ? 1 : 0)};
  pointer-events: ${({ active }) => (active ? `all` : `none`)};
  transition: 0.3s;
`;

const StyledModalContent = styled.div`
  padding: 20px;
  border-radius: 12px;
  background-color: white;
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  border: ${({ formWarning }) =>
    formWarning ? "1px solid grey" : "1px solid red"};
`;

const Modal = ({
  active,
  setModalActive,
  // lData,
  // setLData,
  // isServerButton,
  sData,
  setSData,
}) => {
  const [valueName, setValueName] = React.useState("");
  const [valueAge, setValueAge] = React.useState("");
  const [isValueName, setIsValueName] = React.useState(true);
  const [isValueAge, setIsValueAge] = React.useState(true);

  const addTableEntry = (e) => {
    if (valueName && valueAge) {
      // if (isServerButton) {
        async function addServerData() {
          try {
            const addItem = await axios({
              method: "PUT",
              url: "http://178.128.196.163:3000/api/records",
              data: {
                data: { name: valueName, age: valueAge },
              },
            });
            sData.push(addItem.data);
            const newData = [...sData];
            setSData(newData);
          } catch (error) {
            console.log(error);
          }
        }

        addServerData();
      // } else {
      //   setLData(() => {
      //     return {
      //       users: [
      //         ...lData.users,
      //         { _id: uniqid(), data: { name: valueName, age: valueAge } },
      //       ],
      //     };
      //   });
      // }
      setValueName(() => "");
      setValueAge(() => "");
    } else {
      if (!valueName) {
        setIsValueName(false);
      }
      if (!valueAge) {
        setIsValueAge(false);
      }
    }
  };

  return (
    <StyledModal active={active}>
      <StyledModalContent>
        <label htmlFor="name">Name:</label>
        <Input
          type="text"
          id="name"
          formWarning={isValueName}
          value={valueName}
          onChange={(e) => {
            setValueName(e.target.value);
            setIsValueName(true);
          }}
        />
        <label htmlFor="age">Age:</label>
        <Input
          type="text"
          id="age"
          formWarning={isValueAge}
          value={valueAge}
          onChange={(e) => {
            setValueAge(e.target.value);
            setIsValueAge(true);
          }}
        />
        <div>
          <button onClick={addTableEntry}>add</button> &nbsp;
          <button onClick={() => setModalActive(false)}>done</button>
        </div>
      </StyledModalContent>
    </StyledModal>
  );
};

export default Modal;
