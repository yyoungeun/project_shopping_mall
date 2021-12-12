import React, { useState } from "react";
import { Typography, Button, Form, Input } from "antd";
import FileUpload from "../../utils/FileUpload";
import Axios from "axios";

const { Title } = Typography;
const { TextArea } = Input;

const Continents = [
  { key: 1, value: "Africa" },
  { key: 2, value: "Europe" },
  { key: 3, value: "Asia" },
  { key: 4, value: "North America" },
  { key: 5, value: "South America" },
  { key: 6, value: "Australia" },
  { key: 7, value: "Antarctica" },
];

function UploadProductPage(props) {
  const [Name, setName] = useState("");
  const [Description, setDescription] = useState("");
  const [Price, setPrice] = useState(0);
  const [Continent, setContinent] = useState(1);

  //이미지 => sumbit시 필요
  const [Images, setImages] = useState([]);

  const nameChangeHandler = (e) => {
    setName(e.currentTarget.value);
  };

  const descriptionChangeHandler = (e) => {
    setDescription(e.currentTarget.value);
  };

  const priceChangeHandler = (e) => {
    setPrice(e.currentTarget.value);
  };

  const continentsChangeHandler = (e) => {
    setContinent(e.currentTarget.value);
  };

  const updateImages = (newImages) => {
    setImages(newImages);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // 유효성 체크
    if (!Name || !Description || !Price || !Continent || !Images) {
      return alert("모든 값을 넣어주셔야 합니다.");
    }

    // 서버에 채운 값을 request로 보낸다.
    const body = {
      // 로그인된 사람의 ID
      writer: props.user.userData._id, // auth 참고
      name: Name,
      description: Description,
      price: Price,
      image: Images,
      continents: Continent,
    };
    Axios.post("/api/product", body).then((response) => {
      if (response.data.success) {
        alert("상품 업로드 성공 했습니다.");
        props.history.push("/");
      } else {
        alert("상품 업로드 실패 했습니다.");
      }
    });
  };
  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>여행 상품 업로드</Title>
      </div>

      <Form onSubmit={submitHandler}>
        {/* DropZone */}
        <FileUpload refreshFunction={updateImages} />
        <br />
        <br />
        <label>이름</label>
        <Input value={Name} onChange={nameChangeHandler} />
        <br />
        <br />
        <label>설명</label>
        <TextArea value={Description} onChange={descriptionChangeHandler} />
        <br />
        <br />
        <label>가격($)</label>
        <Input type="number" value={Price} onChange={priceChangeHandler} />
        <br />
        <br />
        <select value={Continent} onChange={continentsChangeHandler}>
          {Continents.map((item) => (
            <option key={item.key} value={item.key}>
              {item.value}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button type="submit" onClick={submitHandler}>
          확인
        </Button>
      </Form>
    </div>
  );
}
export default UploadProductPage;
