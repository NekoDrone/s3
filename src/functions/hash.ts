import bcrypt from "bcryptjs";

export function hashString(input: string) {
    const saltRounds = 12;
    return bcrypt.hashSync(input, saltRounds);
}

export function verifyHash(input: string, compareTo: string) {
    return bcrypt.compareSync(input, compareTo);
}
