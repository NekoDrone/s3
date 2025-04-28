import * as crypto from "crypto";

export function encryptString(input: string, secret: string) {
    const initVec = crypto.randomBytes(16);
    const key = crypto
        .createHash("sha256")
        .update(secret)
        .digest("base64")
        .substring(0, 32);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, initVec);

    let encrypted = cipher.update(input, "utf-8", "hex");
    encrypted += cipher.final("hex");

    return {
        encrypted,
        initVecHex: initVec.toString("hex"),
    };
}

export function decryptString(
    encrypted: string,
    secret: string,
    initVecHex: string,
) {
    const initVec = Buffer.from(initVecHex, "hex");
    const key = crypto
        .createHash("sha256")
        .update(secret)
        .digest("base64")
        .substring(0, 32);
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, initVec);

    let decrypted = decipher.update(encrypted, "hex", "utf-8");
    decrypted += decipher.final("utf-8");

    return decrypted;
}
