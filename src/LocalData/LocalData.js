const LocalData = ({ lData, renderTableData }) => {
  return renderTableData(lData.users, "add local data", false);
};

export default LocalData;
