package com.ssafy.sos.global.error;

import lombok.Getter;
import lombok.ToString;
import org.springframework.http.HttpStatus;

@Getter
@ToString
public enum ExceptionEnum {

    // Member Error: 1000 ~
    NOT_EXIT_WALLET(HttpStatus.NOT_FOUND, "CE1000", Message.NOT_EXIST_WALLET),


    // Game Error: 2000 ~


    // Shop Error: 3000 ~
    NOT_ENOUGH_GOLD(HttpStatus.BAD_REQUEST, "CE3000", Message.NOT_ENOUGH_GOLD),
    NFT_MINTING_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "CE3001", Message.NFT_MINTING_ERROR),
    NOT_EXIST_GRADE(HttpStatus.BAD_REQUEST, "CE3002", Message.NOT_EXIST_GRADE);

    private final HttpStatus status;
    private final String code;
    private final String message;

    ExceptionEnum(HttpStatus status, String code, String message) {
        this.status = status;
        this.code = code;
        this.message = message;
    }

    public interface Message{
        String NOT_EXIST_WALLET = "지갑이 존재하지 않습니다.";
        String NOT_ENOUGH_GOLD = "보유 골드가 부족합니다.";
        String NFT_MINTING_ERROR = "NFT 발급에 실패했습니다.";
        String NOT_EXIST_GRADE = "존재하지 않는 등급입니다.";
    }
}