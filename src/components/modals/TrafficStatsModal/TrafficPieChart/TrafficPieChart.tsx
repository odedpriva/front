import React, { useState, useEffect } from "react";
import { Cell, Tooltip, Pie, PieChart } from "recharts";
import { Entry } from "../../../EntryListItem/Entry";
import { getClassification, StatusCodeClassification } from "../../../UI/StatusCode/StatusCode";
import variables from '../../../../variables.module.scss';

interface TrafficPieChartProps {
  entries: Entry[];
  lastUpdated: number;
}

export const TrafficPieChart: React.FC<TrafficPieChartProps> = ({ entries, lastUpdated }) => {

  const [protoData, setProtoData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [methodData, setMethodData] = useState([]);
  const [lastEntriesLength, setLastEntriesLength] = useState(0);

  useEffect(() => {
    if (entries.length === lastEntriesLength) {
      return;
    }
    setLastEntriesLength(entries.length);

    const protoMap = {};
    const statusMap = {};
    const methodMap = {};

    const _protoData = [];
    const _statusData = [];
    const _methodData = [];

    entries.map(entry => {
      if (entry.proto.abbr in protoMap) {
        protoMap[entry.proto.abbr].value++;
      } else {
        protoMap[entry.proto.abbr] = {value: 0, color: entry.proto.backgroundColor}
      }

      if (entry.proto.name == "http") {
        if (entry.status in statusMap) {
          statusMap[entry.status].value++;
        } else {
          let color = "#808080";
          const classification = getClassification(entry.status);
          if (classification == StatusCodeClassification.SUCCESS) {
            color = variables.successColor;
          } else if (classification == StatusCodeClassification.FAILURE) {
            color = variables.failureColor;
          }
          statusMap[entry.status] = {value: 0, color: color}
        }
      }

      if (entry.method in methodMap) {
        methodMap[entry.method].value++;
      } else {
        methodMap[entry.method] = {value: 0, color: variables.lightBlueColor}
      }
    });

    for (const key in protoMap) {
      _protoData.push(
        {
          name: `Protocol: ${key}`,
          ...protoMap[key],
        }
      );
    }

    for (const key in statusMap) {
      _statusData.push(
        {
          name: `Status Code: ${key}`,
          ...statusMap[key],
        }
      );
    }

    for (const key in methodMap) {
      _methodData.push(
        {
          name: `Method: ${key}`,
          ...methodMap[key],
        }
      );
    }

    setProtoData(_protoData);
    setStatusData(_statusData);
    setMethodData(_methodData);
  }, [entries, lastUpdated]);

  return (
    <div>
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <PieChart width={300} height={300}>
          <Pie
            data={protoData}
            dataKey="value"
            cx={150}
            cy={125}
            innerRadius={40}
            outerRadius={80}
          >
            {(protoData).map((el, index) => (
              <Cell key={`cell-${index}`} fill={el.color} />)
            )}
          </Pie>
          <Tooltip />
        </PieChart>
        <PieChart width={300} height={300}>
          <Pie
            dataKey="value"
            data={statusData}
            cx={150}
            cy={125}
            innerRadius={40}
            outerRadius={80}
          >
            {(statusData).map((el, index) => (
              <Cell key={`cell-${index}`} fill={el.color} />)
            )}
          </Pie>
          <Tooltip />
        </PieChart>
        <PieChart width={300} height={300}>
          <Pie
            dataKey="value"
            data={methodData}
            cx={150}
            cy={125}
            innerRadius={40}
            outerRadius={80}
          >
            {(methodData).map((el, index) => (
              <Cell key={`cell-${index}`} fill={el.color} />)
            )}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
}
