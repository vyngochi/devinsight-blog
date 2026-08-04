const prefixes = [
  "Con trỏ",
  "Bộ nhớ đệm",
  "Hàm ẩn danh",
  "Nhánh phát triển",
  "Biến cục bộ",
  "Gói dữ liệu",
  "Mảng động",
  "Tiến trình",
] as const;

const suffixes = [
  "tò mò",
  "lạc quan",
  "thức khuya",
  "kiên nhẫn",
  "đang debug",
  "ham học",
  "bền bỉ",
  "tìm lời giải",
] as const;

function indexFromId(value: string, modulo: number) {
  return (
    [...value].reduce(
      (total, character) => total + character.charCodeAt(0),
      0,
    ) % modulo
  );
}

export function getAnonymousDisplayName(userId: string) {
  return `${prefixes[indexFromId(userId, prefixes.length)]} ${suffixes[indexFromId([...userId].reverse().join(""), suffixes.length)]}`;
}

export function getCommunityDisplayName(input: {
  id: string;
  name: string | null;
  isAnonymous: boolean;
}) {
  if (input.isAnonymous) return getAnonymousDisplayName(input.id);
  return input.name?.trim() || "Thành viên DevInsight";
}
