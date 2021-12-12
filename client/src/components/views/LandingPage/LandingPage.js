import React, { useEffect, useState } from "react";
import axios from "axios";
import { Icon, Col, Card, Row } from "antd";
import Meta from "antd/lib/card/Meta";
import ImageSlider from "../../utils/ImageSlider";
import CheckBox from "./Sections/CheckBox";
import { continents } from "./Sections/Datas";

function LandingPage() {
  const [Products, setProducts] = useState([]);
  const [Skip, setSkip] = useState(0);
  const [Limit, setLimit] = useState(8);
  const [PostSize, setPostSize] = useState(0);
  const [Filters, setFilters] = useState({
    continents: [],
    price: [],
  });

  useEffect(() => {
    //8개만 가져올 수 있도록
    let body = {
      skip: Skip, // 0 + 8
      limit: Limit,
    };

    getProducts(body);
    setSkip(Skip + Limit);
  }, []);

  const getProducts = (body) => {
    axios.post("/api/product/products", body).then((response) => {
      if (response.data.success) {
        console.log(response.data);
        if (body.loadMore) {
          setProducts([...Products, ...response.data.productInfo]);
        } else {
          setProducts(response.data.productInfo);
        }
        setPostSize(response.data.postSize);
      } else {
        alert("상품들을 가져오는 데 실패 했습니다.");
      }
    });
  };

  const loadMoreHandler = () => {
    let skip = Skip + Limit;
    // 8 + 8
    // 16 + 8 ...

    let body = {
      skip: Skip,
      limit: Limit,
      loadMore: true, // 더보기 클릭 한 req
    };

    getProducts(body);
    setSkip(skip);
  };

  const renderCards = Products.map((product, index) => {
    //console.log("product", product);
    return (
      <Col lg={6} md={8} xs={24} key={index}>
        <Card cover={<ImageSlider images={product.image} />}>
          <Meta title={product.name} description={`$${product.price}`} />
        </Card>
      </Col>
    );
  });

  const showFilterdResults = (filters) => {
    let body = {
      skip: 0,
      limit: Limit,
      filters: filters,
    };
    getProducts(body);
    setSkip(0);
  };
  const handleFilters = (filters, category) => {
    const newFilters = { ...Filters };

    newFilters[category] = filters;

    showFilterdResults(newFilters);
  };
  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2>
          Let's Travel Anywhere <Icon type="rocket" />
        </h2>
      </div>
      {/* Filter */}
      {/* CheckBox */}
      <CheckBox
        list={continents}
        handleFilters={(filters) => handleFilters(filters, "continents")}
      />

      {/* RadioBox*/}

      {/* Search */}
      {/* Cards */}
      {/* 여백 : guttwe */}
      <Row gutter={[16, 16]}>{renderCards}</Row>
      <br />
      {PostSize >= Limit && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={loadMoreHandler}>더 보기</button>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
