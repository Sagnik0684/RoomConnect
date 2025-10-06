import "./listPage.scss";
import { listData } from "../../lib/dummydata.js";
import Filter from "../../components/filter/Filter.jsx";
import Card from "../../components/card/Card.jsx";
import Map from "../../components/map/Map.jsx";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";

function ListPage() {

  const data = useLoaderData();
  // const data = listData;

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          {/* {data.map((item) => (
            <Card key={item.id} item={item} />
          ))} */}
          <Filter />
          <Suspense fallback={<p>Loading...</p>}>
          <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) =>
                postResponse.data.map((post) => (
                  <Card key={post.id} item={post} />
                ))
              }
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="mapContainer">
      <Suspense fallback={<p>Loading...</p>}>
          <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => (
                <Map items={postResponse.data} />
              )
              }
            </Await>
          </Suspense>
        
      </div>
    </div>
  );
}

export default ListPage;
