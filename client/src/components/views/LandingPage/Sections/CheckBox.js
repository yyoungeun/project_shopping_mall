import React from "react";
import { Collapse, Checkbox } from "antd";

const { Panel } = Collapse;

function CheckBox(props) {
  const renderCheckboxLists = () =>
    props.list &&
    props.list.map((value, index) => (
      <React.Fragment key={index}>
        <Checkbox onChange>
          <span>{value.name}</span>
        </Checkbox>
      </React.Fragment>
    ));
  return (
    <Collapse defaultActiveKey={["1"]}>
      <Panel header="This is panel header with arrow icon" key="1">
        {renderCheckboxLists()}
      </Panel>
    </Collapse>
  );
}

export default CheckBox;
