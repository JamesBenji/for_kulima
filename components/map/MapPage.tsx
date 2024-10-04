// "use client";
// import Map from "@/components/map/Map";
// import { useParams, useRouter, useSearchParams } from "next/navigation";
// import React, { useCallback, useEffect, useState } from "react";

// export default function page() {
//   const params = useSearchParams().get("coords");
//   const coords = JSON.parse(params!);
//   const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
//   const [isMounted, setIsMounted] = useState(false);

//   useEffect(() => {
//     setIsMounted(true)
//   }, [])

//   useEffect(() => {
//     const updateDimensions = () => {
//       setDimensions({
//         width: window.innerWidth,
//         height: window.innerHeight,
//       });
//     }
//     updateDimensions();
//   }, []);

//   useEffect(() => {
//     const updateDimensions = () => {
//       setDimensions({
//         width: window.innerWidth,
//         height: window.innerHeight,
//       });
//     }

//     window.addEventListener("resize", updateDimensions);
//     return () => window.removeEventListener("resize", updateDimensions);
//   }, []);


//   if(!isMounted){
//     return null;
//   }

//   if (params && dimensions.width > 0)
//     return (
//       <div>
//         <Map
//           cordinates={coords}
//           height={dimensions.height}
//           width={dimensions.width}
//         />
//       </div>
//     );

//   if (dimensions.width === 0) {
//     <div>Loading</div>;
//   }

//   return <div className="m-auto">No coordinates received</div>;
// }
"use client";
import Map from "@/components/map/Map";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
 


const MapPage = () => {
  const searchParams = useSearchParams();
  const [coords, setCoords] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const coordsParam = searchParams.get("coords");
    if (coordsParam) {
      try {
        setCoords(JSON.parse(coordsParam));
      } catch (error) {
        console.error("Error parsing coordinates:", error);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (isMounted) {
      const updateDimensions = () => {
        if(typeof window !== 'undefined') setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      updateDimensions();
     
    }
  }, [isMounted]);

  if (typeof window === 'undefined') {
    return null; 
  }

  if (!coords) {
    return <div className="m-auto">No coordinates received</div>;
  }

  if (dimensions.width === 0) {
    return <div>Loading dimensions...</div>;
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Map
        cordinates={coords}
        height={dimensions.height || 400}
        width={dimensions.width || 400}
      />
    </div>
  );
}

export default MapPage
