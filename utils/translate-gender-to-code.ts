const GENDER_MAP = Object.freeze({
  남성: 1,
  여성: 2,
});

type Gender = keyof typeof GENDER_MAP;
export const translateGender2Code = (gender: Gender): number => {
  return GENDER_MAP[gender];
};
