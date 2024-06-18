export default function alphabetPos(a: number | string): string {
    return String.fromCharCode(Number(a) + 96);
}