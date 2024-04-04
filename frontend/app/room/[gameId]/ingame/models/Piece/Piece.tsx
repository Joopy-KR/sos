import { useCallback, useEffect, useMemo, useState } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { Vector3, Euler } from "three";

import { useGLTF } from "../../hooks/useGLTF";
import { PiecePathMap } from "~/assetPath";
import { PieceProps } from "./types";

import { useSocketMessage } from "../../stores/useSocketMessage";
import useNickname from "~/store/nickname";
import { NodePosition } from "~/_lib/data/types";

// TODO: 이동중이면 이펙트를 없애고 이동완료되면 다시 소환
export default function Piece({
  name,
  position,
  pieceName,
  set,
  ...props
}: PieceProps) {
  const { meshRef, gltf } = useGLTF(
    PiecePathMap[pieceName]
      ? PiecePathMap[pieceName].src
      : PiecePathMap["SHIBA"].src,
  );
  const { socketMessage } = useSocketMessage();
  const { nickname } = useNickname();
  const [hovered, setHover] = useState(false);
  const { piecePosition, pieceRotation, visible } = useMemo(() => {
    return getPieceOption({
      socketMessage,
      name,
      nickname,
      pieceName,
      position,
    });
  }, [name, nickname, pieceName, position, socketMessage]);

  const handleClickPiece = useCallback((e: ThreeEvent<MouseEvent>) => {
    // console.log("******** Piece Click ********");
    // console.log("이벤트", e);
    // console.log("****************************");
  }, []);

  const handlePointerOver = useCallback(() => {
    setHover(true);
  }, []);

  const handlePointerOut = useCallback(() => {
    setHover(false);
  }, []);

  useEffect(() => {
    if (set) {
      set(meshRef.current);
    }
  }, [meshRef, set]);

  useEffect(() => {
    if (hovered) {
      document.querySelector("canvas")!.style.cursor = "pointer";
    } else {
      document.querySelector("canvas")!.style.cursor = "default";
    }
  }, [hovered]);

  return (
    <>
      <mesh
        {...props}
        ref={meshRef}
        position={piecePosition}
        rotation={pieceRotation}
        visible={visible}
        scale={PiecePathMap[pieceName] ? PiecePathMap[pieceName].size : 10}
        onClick={handleClickPiece}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <primitive object={gltf.scene} />
      </mesh>
    </>
  );
}

const getPieceOption = (props: {
  socketMessage: any;
  name: "PIRATE" | "MARINE1" | "MARINE2" | "MARINE3" | undefined;
  pieceName: keyof typeof PiecePathMap;
  position: NodePosition;
  nickname: string;
}) => {
  const { socketMessage, name, pieceName, position, nickname } = props;

  let piecePosition = undefined;
  let pieceRotation = undefined;
  let visible = undefined;

  if (name === "PIRATE") {
    visible =
      socketMessage?.game?.currentPosition[0] !== 0 &&
      socketMessage?.game?.players[0]?.nickname === nickname;
    piecePosition = position
      ? new Vector3(position.x, position.z, position.y)
      : undefined;
  } else if (name === "MARINE1") {
    visible = socketMessage?.game?.currentPosition[1] !== 0;
    piecePosition = position
      ? new Vector3(position.x, position.z + 6, position.y)
      : undefined;
  } else if (name === "MARINE2") {
    visible = socketMessage?.game?.currentPosition[2] !== 0;
    piecePosition = position
      ? new Vector3(position.x, position.z + 6, position.y)
      : undefined;
  } else if (name === "MARINE3") {
    visible = socketMessage?.game?.currentPosition[3] !== 0;
    piecePosition = position
      ? new Vector3(position.x, position.z + 6, position.y)
      : undefined;
  }

  if (pieceName === "legendary1") {
    piecePosition = position
      ? new Vector3(position.x, position.z, position.y + 10)
      : undefined;
  }

  if (pieceName === "PIRATE") {
    pieceRotation = new Euler(0, Math.PI, 0);
    piecePosition = position
      ? new Vector3(position.x, position.z, position.y + 10)
      : undefined;
  }

  if (pieceName === "MARINE1") {
    pieceRotation = new Euler(0, Math.PI, 0);
  }

  if (pieceName === "MARINE2") {
    pieceRotation = new Euler(0, Math.PI, 0);
  }

  if (pieceName === "MARINE3") {
    pieceRotation = new Euler(0, Math.PI, 0);
  }

  if (pieceName === "zuhee") {
    pieceRotation = new Euler(0, Math.PI, 0);
    piecePosition = new Vector3(position.x - 10, position.z + 30, position.y);
  }

  if (pieceName === "rare1") {
    pieceRotation = new Euler(0, Math.PI, 0);
    piecePosition = new Vector3(position.x - 10, position.z, position.y);
  }

  if (pieceName === "common1") {
    pieceRotation = new Euler(0, -Math.PI / 2, 0);
    piecePosition = new Vector3(position.x, position.z + 15, position.y);
  }

  if (pieceName === "common2") {
    pieceRotation = new Euler(0, 0, 0);
    piecePosition = new Vector3(position.x, position.z + 10, position.y);
  }

  if (pieceName === "common3") {
    pieceRotation = new Euler(0, Math.PI, 0);
    piecePosition = new Vector3(position.x, position.z + 5, position.y);
  }

  return {
    piecePosition,
    pieceRotation,
    visible,
  };
};
