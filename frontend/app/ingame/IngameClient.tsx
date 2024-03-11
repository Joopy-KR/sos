"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { createSocket } from "~/sockets/createSocket";
import Loading from "./components/Loading";
import Map from "./models/Map";

import * as DUMMY_DATA from "../ingame/dummy-data";
import Node from "./models/Node";

const socket = createSocket();

// TODO: Canvas만 로딩됐다고 끝이 아니라 안에 모델, 텍스쳐도 다 로딩이 되어야함.
// 나중에 이 로딩을 상태관리로 만들자.
export default function IngameClient({ gameId }: { gameId: string }) {
  const [loading, setLoading] = useState(true);

  const onConnect = useCallback(() => {
    console.log("Hello Socket!");
  }, []);

  useEffect(() => {
    socket.connect(onConnect);

    return () => {
      socket.disconnect();
    };
  }, [onConnect]);

  return (
    <>
      {loading && <Loading />}
      <Canvas
        camera={{ position: [0, 1000, 500], far: 10000, fov: 50 }}
        onCreated={() => setLoading(false)}
      >
        <directionalLight position={[1, 1, 1]} />
        <ambientLight intensity={2} />
        <OrbitControls target={[0, 1, 0]} />
        <axesHelper scale={10} />
        <IngameThree />
      </Canvas>
    </>
  );
}

function IngameThree() {
  // 여기서 좀 빵빵해질듯...? 소켓 코드랑...

  return (
    <>
      {/* 여기에 Edges를 띄운다.. */}
      {DUMMY_DATA.nodeList.map(node => (
        <Node key={node.nodeId} node={node} />
      ))}
      <Map />
    </>
  );
}
