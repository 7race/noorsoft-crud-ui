import React from "react";
import axios from "axios";

const ServerData = ({ sData, setSData, renderTableData }) => {
  React.useEffect(() => {
    async function getServerData() {
      const response = await axios({
        url: "http://178.128.196.163:3000/api/records",
      });

      const data = response.data;

      setSData(data);
    }

    getServerData();
  }, [setSData]);

  return renderTableData(sData);
};

export default ServerData;
