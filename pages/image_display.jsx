import { useState, useEffect } from 'react'

export default function View_Event() {
  const [dataFetched, setDataFetched] = useState(false);

  var id;
  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryParameters = new URLSearchParams(window.location.search);
      id = queryParameters.get("id");
      console.log(id);
      setDataFetched(true);
    }}, []);

  return (
    <div>
      {dataFetched && <img src={`https://culturehouse-images.s3.ap-northeast-2.amazonaws.com/${id}.png`}/>}
    </div>
  )
}
