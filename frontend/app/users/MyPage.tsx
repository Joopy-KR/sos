import styled from "@emotion/styled";

import { Center } from "@react-three/drei";
import UserNft from "./UserNft";
import UserProfile from "./UserProfile";

import { UserModel, WalletModel } from "./types";
import {
  getUserInfo2,
  makeWallet2,
  logout,
  getWalletInfo2,
} from "../api/users";
import { useEffect, useState } from "react";
import Button from "../render/components/Button";

import MiniModal from "../render/components/MiniModal";
import MiniModalContent from "../render/components/MiniModalContent";

import Modal from "../render/components/Modal";
import Container from "../render/components/Container";
import { useCamera } from "../render/stores/useCamera";
import { useScreenControl } from "../render/stores/useScreenControl";
import { useAuth } from "~/store/auth";

export default function Page() {
  const { user, setUser } = useAuth();
  const [copied, setCopied] = useState(false);
  const [newAddressCopied, setNewAddressCopied] = useState(false);
  const [newMnemonicCopied, setNewMnemonicCopied] = useState(false);
  const [newPrivateKeyCopied, setNewPrivateKeysCopied] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [wallet, setWallet] = useState<WalletModel | null>(null);

  const { cameraRef, mainScreen, LoginScreen } = useCamera();
  const { screen, setScreen, setMainScreen } = useScreenControl();

  const handleMakeWallet = async () => {
    try {
      const response = await makeWallet2();
      const { address, mnemonic, privateKey } = response.data as WalletModel;
      setWallet(response.data as WalletModel);
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) {
    return <h1>유저가 없음... 로딩중일수도 있음...</h1>;
  }

  // 주소를 클립보드에 복사합니다.
  const handleCopyAddress = () => {
    if (user.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress);
      setCopied(true);
    }
  };
  const handleCopyNewAddress = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.address);
      setNewAddressCopied(true);
    }
  };
  const handleCopyMnemonic = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.mnemonic);
      setNewMnemonicCopied(true);
    }
  };
  const handleCopyPrivateKey = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.privateKey);
      setNewPrivateKeysCopied(true);
    }
  };

  // 주소를 마스킹하는 함수
  const maskAddress = (address: string) => {
    if (!address) return "";
    const visibleChars = 6; // 보여질 문자열 길이
    const maskedPart = "..."; // 마스킹할 부분
    return address.slice(0, visibleChars) + maskedPart;
  };

  const handleGetWallet = async () => {
    const response = await getWalletInfo2();
    const { address, mnemonic, privateKey } = response.data as WalletModel;
    setWallet(response.data as WalletModel);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
    } finally {
      setUser(null);
      mainScreen();
      setScreen("MAIN");
    }
  };

  return (
    <>
      <Container position="right">
        <ModalStyle>
          <ModalContent>
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <h2>{user.name}님 안녕하세요!</h2>
                  {!user.walletAddress && (
                    <Button onClick={handleMakeWallet} size={"sm"}>
                      지갑 만들기
                    </Button>
                  )}
                  {user.walletAddress && (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <p style={{ marginRight: "10px" }}>
                        지갑 주소 : {maskAddress(user.walletAddress)}
                      </p>
                      <Button onClick={handleCopyAddress} size={"xs"}>
                        {copied ? "복사됨!" : "복사하기"}
                      </Button>
                      <Button onClick={handleGetWallet} size={"xs"}>
                        지갑 정보
                      </Button>
                    </div>
                  )}
                  <h2>현재 기본 말 : {user.productName}</h2>
                </div>
              </div>

              <div></div>

              <UserNft />
            </div>
          </ModalContent>
        </ModalStyle>
        <Button size={"sm"} onClick={handleLogout}>
          로그아웃
        </Button>
      </Container>
      {wallet && (
        <MiniModal>
          <h1>발급된 지갑 정보</h1>
          <MiniModalContent>
            <p>Kaikas에 연동해서 모바일에서도 NFT를 확인해보세요!</p>
            <div style={{ display: "flex" }}>
              <p>주소 : {maskAddress(wallet.address)}</p>
              <Button onClick={handleCopyNewAddress} size={"xs"}>
                {newAddressCopied ? "복사됨!" : "복사하기"}
              </Button>
            </div>
            <br />
            <div>
              <p>
                연상 기호 : <br />
                {wallet.mnemonic}
              </p>
            </div>
            <br />
            <div style={{ display: "flex" }}>
              <p>개인키 : {maskAddress(wallet.privateKey)}</p>
              <Button onClick={handleCopyPrivateKey} size={"xs"}>
                {newPrivateKeyCopied ? "복사됨!" : "복사하기"}
              </Button>
            </div>
          </MiniModalContent>
        </MiniModal>
      )}
    </>
  );
}

const ModalStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 30rem;
  height: 40rem;
  padding: 1rem;
  background: url("/assets/modal-background.png") no-repeat center center;
  background-size: cover;
  z-index: 999;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5rem;
`;
